import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'go-concurrency-patterns',
    title: 'Concurrency Patterns (worker pools, pipelines)',
    description:
      'Use goroutines, channels, context cancellation, worker pools, and pipelines to build practical concurrent Go programs.',
    level: 'advanced',
    section: 'Deep Go',
    order: 49,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Go makes starting a goroutine easy, but production concurrency is about control: bounded work, cancellation, backpressure, clean shutdown, and readable ownership.',
      },
      {
        type: 'p',
        text: 'Two patterns appear constantly in real services: worker pools for limiting parallel work, and pipelines for splitting a stream of work into clear stages.',
      },
      { type: 'h2', text: 'Worker pools: limit parallel work' },
      {
        type: 'p',
        text: 'A worker pool starts a fixed number of goroutines. Jobs flow in through a channel, workers process jobs, and results flow out through another channel.',
      },
      {
        type: 'code',
        title: 'Bounded worker pool',
        language: 'go',
        code: `package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type Job struct {
	ID int
}

type Result struct {
	JobID int
	Value string
	Err   error
}

func worker(ctx context.Context, id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {
	defer wg.Done()

	for {
		select {
		case <-ctx.Done():
			return
		case job, ok := <-jobs:
			if !ok {
				return
			}

			time.Sleep(100 * time.Millisecond) // Simulate slow I/O.
			results <- Result{
				JobID: job.ID,
				Value: fmt.Sprintf("worker %d processed job %d", id, job.ID),
			}
		}
	}
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	jobs := make(chan Job)
	results := make(chan Result)

	var wg sync.WaitGroup
	for i := 1; i <= 3; i++ {
		wg.Add(1)
		go worker(ctx, i, jobs, results, &wg)
	}

	go func() {
		defer close(jobs)
		for i := 1; i <= 10; i++ {
			jobs <- Job{ID: i}
		}
	}()

	go func() {
		wg.Wait()
		close(results)
	}()

	for result := range results {
		if result.Err != nil {
			fmt.Println("error:", result.Err)
			continue
		}
		fmt.Println(result.Value)
	}
}`,
      },
      {
        type: 'note',
        text: 'The jobs channel is closed by the sender. The results channel is closed after all workers finish. This ownership rule prevents many channel bugs.',
      },
      { type: 'h2', text: 'Choosing worker count' },
      {
        type: 'ul',
        items: [
          'CPU-heavy work: start near runtime.NumCPU(), then benchmark.',
          'I/O-heavy work: more workers may help because many goroutines wait on the network or disk.',
          'External services: respect rate limits and database connection pool limits.',
          'User-facing requests: prefer bounded queues so overload becomes visible instead of turning into memory growth.',
        ],
      },
      { type: 'h2', text: 'Pipelines: split work into stages' },
      {
        type: 'p',
        text: 'A pipeline passes values through stages. Each stage receives from an input channel, transforms or filters data, and sends to an output channel.',
      },
      {
        type: 'code',
        title: 'Pipeline with generator, transform, and sink',
        language: 'go',
        code: `package main

import "fmt"

func generate(nums ...int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for _, n := range nums {
			out <- n
		}
	}()
	return out
}

func square(in <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for n := range in {
			out <- n * n
		}
	}()
	return out
}

func onlyEven(in <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for n := range in {
			if n%2 == 0 {
				out <- n
			}
		}
	}()
	return out
}

func main() {
	for value := range onlyEven(square(generate(1, 2, 3, 4, 5))) {
		fmt.Println(value)
	}
}`,
      },
      { type: 'h2', text: 'Add cancellation to pipelines' },
      {
        type: 'p',
        text: 'A pipeline must stop when the caller is no longer interested. Without cancellation, upstream goroutines can block forever trying to send to a stage nobody reads.',
      },
      {
        type: 'code',
        title: 'Cancellation-aware stage',
        language: 'go',
        code: `func square(ctx context.Context, in <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for {
			select {
			case <-ctx.Done():
				return
			case n, ok := <-in:
				if !ok {
					return
				}

				select {
				case <-ctx.Done():
					return
				case out <- n * n:
				}
			}
		}
	}()
	return out
}`,
      },
      { type: 'h2', text: 'Fan-out and fan-in' },
      {
        type: 'p',
        text: 'Fan-out means many workers read from the same input channel. Fan-in means multiple output channels are merged into one output channel.',
      },
      {
        type: 'code',
        title: 'Merge several channels',
        language: 'go',
        code: `func merge[T any](channels ...<-chan T) <-chan T {
	var wg sync.WaitGroup
	out := make(chan T)

	for _, ch := range channels {
		wg.Add(1)
		go func(c <-chan T) {
			defer wg.Done()
			for value := range c {
				out <- value
			}
		}(ch)
	}

	go func() {
		wg.Wait()
		close(out)
	}()

	return out
}`,
      },
      {
        type: 'warning',
        text: 'Do not start one goroutine per untrusted item without limits. A burst of requests can become a burst of goroutines, memory, database calls, and timeouts.',
      },
      { type: 'h2', text: 'Production checklist' },
      {
        type: 'ul',
        items: [
          'Every goroutine has a reason to stop.',
          'The sender closes the channel, not the receiver.',
          'Channels communicate ownership or events; mutexes protect shared state.',
          'Queues are bounded when input can grow faster than processing.',
          'Context cancellation flows from request or process shutdown into workers.',
          'Tests run with -race when shared memory is involved.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Worker pools control parallelism.',
          'Pipelines make streaming transformations readable.',
          'Cancellation prevents goroutine leaks.',
          'Concurrency design is mostly about ownership and lifecycle.',
        ],
      },
    ],
  },
  {
    slug: 'go-performance',
    title: 'Performance Mindset & Profiling',
    description:
      'Learn how to improve Go performance with measurement, benchmarks, pprof, allocation awareness, and practical optimization habits.',
    level: 'advanced',
    section: 'Deep Go',
    order: 50,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Fast Go code starts with measurement. Guessing often leads to complicated code that is not faster. Profiling tells you where time, memory, locks, and goroutines are actually spent.',
      },
      { type: 'h2', text: 'The performance loop' },
      {
        type: 'ol',
        items: [
          'Define the user-visible goal: latency, throughput, memory, startup time, or cost.',
          'Write a realistic benchmark or load test.',
          'Capture a profile.',
          'Change one thing.',
          'Measure again and compare.',
          'Keep readability unless the speedup is real and important.',
        ],
      },
      { type: 'h2', text: 'Benchmark with testing.B' },
      {
        type: 'p',
        text: 'Benchmarks live next to tests and are named BenchmarkXxx. Use b.ResetTimer after setup and run with -bench.',
      },
      {
        type: 'code',
        title: 'A small benchmark',
        language: 'go',
        code: `package slug

import (
	"strings"
	"testing"
)

func Slugify(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	return strings.ReplaceAll(s, " ", "-")
}

func BenchmarkSlugify(b *testing.B) {
	input := "  Building Production Go Services  "

	b.ReportAllocs()
	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		_ = Slugify(input)
	}
}`,
      },
      {
        type: 'code',
        title: 'Run benchmarks',
        language: 'bash',
        code: `go test -bench=. -benchmem ./...
go test -bench=BenchmarkSlugify -count=5 ./...`,
      },
      {
        type: 'note',
        text: 'Use -count=5 or more when comparing small changes. One benchmark run can be noisy because of CPU scheduling, turbo boost, containers, and background work.',
      },
      { type: 'h2', text: 'CPU profiles with pprof' },
      {
        type: 'p',
        text: 'For command-line programs, use go test with -cpuprofile. For servers, expose net/http/pprof on an internal-only port or capture profiles in your observability platform.',
      },
      {
        type: 'code',
        title: 'Capture and inspect a CPU profile',
        language: 'bash',
        code: `go test -bench=. -cpuprofile=cpu.out ./...
go tool pprof cpu.out

# Inside pprof:
# top
# list Slugify
# web`,
      },
      {
        type: 'code',
        title: 'HTTP pprof endpoint for internal debugging',
        language: 'go',
        code: `import (
	"log"
	"net/http"
	_ "net/http/pprof"
)

func startDebugServer() {
	go func() {
		log.Println("debug server listening on localhost:6060")
		if err := http.ListenAndServe("localhost:6060", nil); err != nil {
			log.Println("debug server:", err)
		}
	}()
}`,
      },
      {
        type: 'warning',
        text: 'Never expose pprof publicly. Profiles can reveal URLs, SQL queries, tokens in memory, and internal architecture.',
      },
      { type: 'h2', text: 'Memory profiles and allocation pressure' },
      {
        type: 'p',
        text: 'Many Go slowdowns are really allocation problems. More allocations mean more work for the garbage collector and more cache misses.',
      },
      {
        type: 'code',
        title: 'Capture memory profile during benchmarks',
        language: 'bash',
        code: `go test -bench=. -benchmem -memprofile=mem.out ./...
go tool pprof -alloc_space mem.out`,
      },
      { type: 'h2', text: 'Common Go performance wins' },
      {
        type: 'table',
        headers: ['Area', 'Better habit', 'Why it helps'],
        rows: [
          ['Strings', 'Use strings.Builder for repeated concatenation', 'Avoids creating many temporary strings'],
          ['Slices', 'Preallocate when size is known', 'Reduces repeated growth and copying'],
          ['JSON', 'Avoid unnecessary map[string]any for known shapes', 'Typed structs allocate less and are safer'],
          ['I/O', 'Reuse clients and connections', 'Avoids handshakes and connection churn'],
          ['Logging', 'Avoid huge fields on hot paths', 'Reduces CPU, allocations, and log bill'],
          ['Concurrency', 'Bound worker counts', 'Prevents CPU thrashing and queue explosions'],
        ],
      },
      {
        type: 'code',
        title: 'Preallocate slices when you know the size',
        language: 'go',
        code: `func ActiveEmails(users []User) []string {
	emails := make([]string, 0, len(users))

	for _, user := range users {
		if user.Active {
			emails = append(emails, user.Email)
		}
	}

	return emails
}`,
      },
      { type: 'h2', text: 'Profile server latency' },
      {
        type: 'p',
        text: 'A p95 latency issue may not show up in one CPU profile. Combine traces, logs, metrics, database timings, and load tests. The bottleneck might be lock contention, a slow dependency, or too much work inside one request.',
      },
      {
        type: 'keypoints',
        items: [
          'Measure before optimizing.',
          'Benchmarks answer small questions; profiles explain where resources go.',
          'Allocation reduction often improves both speed and memory.',
          'Readable code plus evidence beats clever code plus guesses.',
        ],
      },
    ],
  },
  {
    slug: 'go-memory-gc',
    title: 'Memory & Garbage Collector Basics',
    description:
      'Understand stack vs heap, escape analysis, garbage collection, slices, memory retention, and safe memory habits in Go.',
    level: 'advanced',
    section: 'Deep Go',
    order: 51,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Go manages memory automatically, but advanced Go developers still need to understand allocation, object lifetime, and garbage collector trade-offs.',
      },
      { type: 'h2', text: 'Stack and heap' },
      {
        type: 'p',
        text: 'Each goroutine starts with a small stack that grows and shrinks. Values that can safely live only inside a function often stay on the stack. Values that must outlive the function usually escape to the heap.',
      },
      {
        type: 'code',
        title: 'A value that escapes',
        language: 'go',
        code: `type User struct {
	Name string
}

func NewUser(name string) *User {
	// This value can outlive NewUser because we return its address.
	// The compiler will place it where it remains valid.
	return &User{Name: name}
}`,
      },
      {
        type: 'code',
        title: 'Inspect escape analysis',
        language: 'bash',
        code: `go build -gcflags="-m" ./...

# More detail:
go build -gcflags="-m -m" ./...`,
      },
      { type: 'h2', text: 'Garbage collection in plain language' },
      {
        type: 'p',
        text: 'The garbage collector finds heap objects still reachable from running code and frees objects that are no longer reachable. Go uses a concurrent garbage collector designed for low pause times.',
      },
      {
        type: 'p',
        text: 'GC is not free. If your program allocates heavily, the collector must scan more memory and run more often. Reducing unnecessary allocations can improve throughput and latency.',
      },
      {
        type: 'code',
        title: 'View GC activity',
        language: 'bash',
        code: `GODEBUG=gctrace=1 go run ./cmd/server`,
      },
      { type: 'h2', text: 'Slices can retain large arrays' },
      {
        type: 'p',
        text: 'A slice is a small header pointing at an underlying array. If you keep a tiny slice of a huge array, the huge array may stay in memory.',
      },
      {
        type: 'code',
        title: 'Copy small data out of a large buffer',
        language: 'go',
        code: `func FirstLineCopy(file []byte) []byte {
	for i, b := range file {
		if b == '\\n' {
			line := make([]byte, i)
			copy(line, file[:i])
			return line
		}
	}

	line := make([]byte, len(file))
	copy(line, file)
	return line
}`,
      },
      { type: 'h2', text: 'Pointers are not always faster' },
      {
        type: 'p',
        text: 'Passing a pointer avoids copying a value, but it can also increase heap allocation, create shared mutable state, and reduce cache friendliness. Small structs are often fine to pass by value.',
      },
      {
        type: 'table',
        headers: ['Choice', 'Good for', 'Watch out for'],
        rows: [
          ['Value', 'Small immutable data, clear ownership', 'Large copies in hot loops'],
          ['Pointer', 'Mutation, optional values, large structs', 'Aliasing and escaping to heap'],
          ['Slice', 'Shared view over array data', 'Retaining more memory than expected'],
          ['Map', 'Fast lookup and mutation', 'Reference type; must initialize before writes'],
        ],
      },
      { type: 'h2', text: 'sync.Pool is specialized' },
      {
        type: 'p',
        text: 'sync.Pool can reuse temporary objects and reduce allocation pressure, especially for buffers. It is not a cache: items can disappear at any GC cycle.',
      },
      {
        type: 'code',
        title: 'Buffer pool example',
        language: 'go',
        code: `var bufferPool = sync.Pool{
	New: func() any {
		return new(bytes.Buffer)
	},
}

func EncodeJSON(v any) ([]byte, error) {
	buf := bufferPool.Get().(*bytes.Buffer)
	buf.Reset()
	defer bufferPool.Put(buf)

	if err := json.NewEncoder(buf).Encode(v); err != nil {
		return nil, err
	}

	out := make([]byte, buf.Len())
	copy(out, buf.Bytes())
	return out, nil
}`,
      },
      {
        type: 'warning',
        text: 'Never put objects containing user secrets back into a pool unless you clear them first. Reuse can accidentally expose data across requests.',
      },
      { type: 'h2', text: 'Memory checklist' },
      {
        type: 'ul',
        items: [
          'Use benchmarks with -benchmem to see allocations per operation.',
          'Use heap profiles to find allocation hotspots.',
          'Preallocate slices and maps when sizes are predictable.',
          'Avoid keeping tiny slices that point at huge buffers.',
          'Treat pointer use as an ownership decision, not an automatic optimization.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Go memory is automatic, but allocation cost still matters.',
          'Escape analysis explains stack vs heap placement.',
          'The garbage collector rewards programs with fewer short-lived allocations.',
          'Be careful with slices and object pools.',
        ],
      },
    ],
  },
  {
    slug: 'go-reflection',
    title: 'Reflection (When You Really Need It)',
    description:
      'Use the reflect package carefully for struct tags, generic utilities, validation, and framework-style code.',
    level: 'advanced',
    section: 'Deep Go',
    order: 52,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Reflection lets a Go program inspect types and values at runtime. It is powerful, but it is also slower, less type-safe, and easier to misuse than normal Go code.',
      },
      { type: 'h2', text: 'When reflection is appropriate' },
      {
        type: 'ul',
        items: [
          'Encoding and decoding libraries such as JSON, SQL mapping, or config loading.',
          'Validation based on struct tags.',
          'Developer tooling and test helpers.',
          'Framework code that must work with many unknown struct types.',
        ],
      },
      {
        type: 'warning',
        text: 'If normal interfaces, generics, or explicit code solve the problem clearly, prefer them over reflection.',
      },
      { type: 'h2', text: 'Type and Value' },
      {
        type: 'p',
        text: 'The reflect package mainly uses Type and Value. Type describes what something is. Value holds a runtime value and can sometimes be read or changed.',
      },
      {
        type: 'code',
        title: 'Inspect a struct',
        language: 'go',
        code: `package main

import (
	"fmt"
	"reflect"
)

type User struct {
	ID    int    \`json:"id"\`
	Email string \`json:"email"\`
}

func main() {
	user := User{ID: 7, Email: "dev@example.com"}

	t := reflect.TypeOf(user)
	v := reflect.ValueOf(user)

	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		value := v.Field(i)
		fmt.Printf("%s json=%q value=%v\\n", field.Name, field.Tag.Get("json"), value.Interface())
	}
}`,
      },
      { type: 'h2', text: 'Changing values requires addressability' },
      {
        type: 'p',
        text: 'Reflection can only set values that are addressable and exported. Usually that means you pass a pointer, then call Elem.',
      },
      {
        type: 'code',
        title: 'Set a field safely',
        language: 'go',
        code: `func SetStringField(target any, name string, value string) error {
	v := reflect.ValueOf(target)
	if v.Kind() != reflect.Pointer || v.IsNil() {
		return fmt.Errorf("target must be a non-nil pointer")
	}

	elem := v.Elem()
	if elem.Kind() != reflect.Struct {
		return fmt.Errorf("target must point to a struct")
	}

	field := elem.FieldByName(name)
	if !field.IsValid() {
		return fmt.Errorf("field %q not found", name)
	}
	if !field.CanSet() || field.Kind() != reflect.String {
		return fmt.Errorf("field %q cannot be set as string", name)
	}

	field.SetString(value)
	return nil
}`,
      },
      { type: 'h2', text: 'Struct tags for validation' },
      {
        type: 'p',
        text: 'Struct tags are strings attached to fields. Reflection can read them, which makes tag-based validation possible.',
      },
      {
        type: 'code',
        title: 'Tiny required-field validator',
        language: 'go',
        code: `func ValidateRequired(input any) error {
	v := reflect.ValueOf(input)
	if v.Kind() == reflect.Pointer {
		v = v.Elem()
	}
	if v.Kind() != reflect.Struct {
		return fmt.Errorf("input must be a struct")
	}

	t := v.Type()
	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		if field.Tag.Get("required") != "true" {
			continue
		}

		value := v.Field(i)
		if value.IsZero() {
			return fmt.Errorf("%s is required", field.Name)
		}
	}

	return nil
}`,
      },
      { type: 'h2', text: 'Reflection and panics' },
      {
        type: 'p',
        text: 'Many reflect operations panic when used on the wrong kind of value. Production reflection code checks Kind, IsValid, CanSet, CanInterface, and nil conditions before operating.',
      },
      {
        type: 'table',
        headers: ['Reflect check', 'Why it matters'],
        rows: [
          ['Kind()', 'Confirms whether a value is a struct, pointer, slice, string, and so on'],
          ['IsValid()', 'Detects missing fields or zero reflect.Value results'],
          ['CanSet()', 'Prevents setting unaddressable or unexported fields'],
          ['CanInterface()', 'Prevents panics when converting to interface{}'],
          ['IsNil()', 'Handles nil pointers, maps, slices, channels, and interfaces'],
        ],
      },
      {
        type: 'tip',
        text: 'Hide reflection behind a small tested function. Most of your application should call normal typed APIs.',
      },
      {
        type: 'keypoints',
        items: [
          'Reflection is for runtime type inspection.',
          'It is useful for libraries, serializers, validators, and tooling.',
          'It trades compile-time safety for flexibility.',
          'Check reflect.Value carefully to avoid panics.',
        ],
      },
    ],
  },
  {
    slug: 'go-security',
    title: 'Security Essentials for Go Services',
    description:
      'Protect Go services with secure HTTP defaults, validation, parameterized SQL, secrets management, timeouts, and safe error handling.',
    level: 'advanced',
    section: 'Production',
    order: 53,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Security is not a feature you add at the end. Production Go services need safe defaults in HTTP, data access, input handling, logging, dependency management, and deployment.',
      },
      { type: 'h2', text: 'Start with threat thinking' },
      {
        type: 'ul',
        items: [
          'What data would be damaging if leaked?',
          'Which endpoints change money, permissions, or identity?',
          'Which inputs reach SQL, files, shells, templates, or third-party APIs?',
          'What happens when dependencies are slow, malicious, or unavailable?',
        ],
      },
      { type: 'h2', text: 'HTTP server timeouts' },
      {
        type: 'p',
        text: 'The default http.ListenAndServe is convenient, but production servers should set timeouts to reduce slowloris-style attacks and stuck connections.',
      },
      {
        type: 'code',
        title: 'Safer HTTP server configuration',
        language: 'go',
        code: `srv := &http.Server{
	Addr:              ":8080",
	Handler:           routes,
	ReadHeaderTimeout: 5 * time.Second,
	ReadTimeout:       10 * time.Second,
	WriteTimeout:      30 * time.Second,
	IdleTimeout:       120 * time.Second,
	MaxHeaderBytes:    1 << 20,
}

if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
	log.Fatal(err)
}`,
      },
      { type: 'h2', text: 'Validate input at boundaries' },
      {
        type: 'p',
        text: 'Decode request data into typed structs, reject unknown fields when appropriate, limit request sizes, and validate before business logic.',
      },
      {
        type: 'code',
        title: 'Decode JSON with limits',
        language: 'go',
        code: `func decodeJSON(w http.ResponseWriter, r *http.Request, dst any) bool {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20) // 1 MB
	defer r.Body.Close()

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	if err := dec.Decode(dst); err != nil {
		http.Error(w, "invalid JSON body", http.StatusBadRequest)
		return false
	}
	return true
}`,
      },
      { type: 'h2', text: 'Use parameterized queries' },
      {
        type: 'p',
        text: 'Never build SQL by concatenating user input. Use placeholders from database/sql or your database library.',
      },
      {
        type: 'code',
        title: 'Safe SQL query',
        language: 'go',
        code: `func FindUserByEmail(ctx context.Context, db *sql.DB, email string) (User, error) {
	const query = \`SELECT id, email, created_at FROM users WHERE email = $1\`

	var user User
	err := db.QueryRowContext(ctx, query, email).Scan(&user.ID, &user.Email, &user.CreatedAt)
	if err != nil {
		return User{}, err
	}
	return user, nil
}`,
      },
      { type: 'h2', text: 'Secrets and configuration' },
      {
        type: 'ul',
        items: [
          'Load secrets from a secret manager or environment, not from committed files.',
          'Never log tokens, passwords, session cookies, or full authorization headers.',
          'Rotate credentials and design services to restart cleanly with new config.',
          'Use least-privilege database users and cloud IAM roles.',
        ],
      },
      { type: 'h2', text: 'Password and token basics' },
      {
        type: 'p',
        text: 'Do not invent password hashing. Use a well-reviewed package such as bcrypt, scrypt, or Argon2id through maintained libraries. Compare tokens with constant-time comparison when equality itself is sensitive.',
      },
      {
        type: 'code',
        title: 'Constant-time token comparison',
        language: 'go',
        code: `func EqualToken(got, want string) bool {
	if len(got) != len(want) {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(got), []byte(want)) == 1
}`,
      },
      { type: 'h2', text: 'Secure error responses' },
      {
        type: 'p',
        text: 'Return helpful but not revealing messages to clients. Log detailed internal errors with request IDs on the server side.',
      },
      {
        type: 'code',
        title: 'Public error with internal log',
        language: 'go',
        code: `func writeInternalError(w http.ResponseWriter, r *http.Request, err error) {
	requestID := r.Header.Get("X-Request-ID")
	slog.Error("request failed", "request_id", requestID, "error", err)
	http.Error(w, "internal server error", http.StatusInternalServerError)
}`,
      },
      { type: 'h2', text: 'Dependency and supply-chain safety' },
      {
        type: 'code',
        title: 'Useful checks',
        language: 'bash',
        code: `go test ./...
go vet ./...
govulncheck ./...`,
      },
      {
        type: 'keypoints',
        items: [
          'Use safe server timeouts and request size limits.',
          'Validate input before it reaches business logic.',
          'Use parameterized SQL and managed secrets.',
          'Avoid leaking sensitive details through logs, errors, profiles, or panic output.',
        ],
      },
    ],
  },
  {
    slug: 'go-docker',
    title: 'Dockerizing Go Apps',
    description:
      'Package Go services with multi-stage Docker builds, small runtime images, environment configuration, and container-friendly practices.',
    level: 'advanced',
    section: 'Production',
    order: 54,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Docker gives your Go service a repeatable runtime. A good container image is small, predictable, non-root, and easy to configure in different environments.',
      },
      { type: 'h2', text: 'A typical Go service layout' },
      {
        type: 'code',
        title: 'Project layout',
        language: 'text',
        code: `myservice/
  cmd/api/main.go
  internal/httpapi/
  go.mod
  go.sum
  Dockerfile
  .dockerignore`,
      },
      { type: 'h2', text: 'Multi-stage Dockerfile' },
      {
        type: 'p',
        text: 'Build in a full Go image, then copy only the compiled binary into a small runtime image.',
      },
      {
        type: 'code',
        title: 'Dockerfile',
        language: 'dockerfile',
        code: `FROM golang:1.23-alpine AS build

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/api ./cmd/api

FROM alpine:3.20

RUN addgroup -S app && adduser -S app -G app
RUN apk add --no-cache ca-certificates

USER app
WORKDIR /app

COPY --from=build /out/api /app/api

EXPOSE 8080
ENTRYPOINT ["/app/api"]`,
      },
      {
        type: 'code',
        title: '.dockerignore',
        language: 'text',
        code: `.git
.github
tmp
coverage.out
*.test
Dockerfile
README.md`,
      },
      { type: 'h2', text: 'Build and run locally' },
      {
        type: 'code',
        title: 'Docker commands',
        language: 'bash',
        code: `docker build -t myservice:dev .
docker run --rm -p 8080:8080 -e PORT=8080 myservice:dev`,
      },
      { type: 'h2', text: 'Read port and config from environment' },
      {
        type: 'code',
        title: 'Container-friendly main.go',
        language: 'go',
        code: `func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           routes(),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("listening on :%s", port)
	log.Fatal(srv.ListenAndServe())
}`,
      },
      { type: 'h2', text: 'Health checks' },
      {
        type: 'p',
        text: 'Containers should expose a simple health endpoint that orchestration platforms can call.',
      },
      {
        type: 'code',
        title: 'Health endpoint',
        language: 'go',
        code: `mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("ok\\n"))
})`,
      },
      { type: 'h2', text: 'Docker Compose for dependencies' },
      {
        type: 'code',
        title: 'docker-compose.yml',
        language: 'yaml',
        code: `services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      PORT: "8080"
      DATABASE_URL: "postgres://app:app@db:5432/app?sslmode=disable"
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    ports:
      - "5432:5432"`,
      },
      {
        type: 'warning',
        text: 'Compose examples often show plain passwords for local development. Production secrets should come from a secret manager or platform secret feature.',
      },
      { type: 'h2', text: 'Image checklist' },
      {
        type: 'ul',
        items: [
          'Use multi-stage builds.',
          'Run as a non-root user.',
          'Keep runtime images small and patched.',
          'Include CA certificates if your app calls HTTPS services.',
          'Avoid baking environment-specific secrets into images.',
          'Log to stdout and stderr so the platform can collect logs.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Go apps are excellent Docker candidates because they compile to single binaries.',
          'Separate build image from runtime image.',
          'Configure containers through environment variables.',
          'Design for health checks, logs, and graceful shutdown.',
        ],
      },
    ],
  },
  {
    slug: 'go-deploy',
    title: 'Deploying Go Services',
    description:
      'Prepare Go services for production deployment with config, graceful shutdown, health checks, migrations, logging, metrics, and release discipline.',
    level: 'advanced',
    section: 'Production',
    order: 55,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Deployment is more than copying a binary. A production Go service must start reliably, stop gracefully, expose health, manage configuration, and give operators enough visibility to solve incidents.',
      },
      { type: 'h2', text: 'Deployment targets' },
      {
        type: 'table',
        headers: ['Target', 'Good for', 'Notes'],
        rows: [
          ['Single VM', 'Small services, internal tools', 'Use systemd, logs, firewall, backups'],
          ['Docker host', 'Simple container deployment', 'Need image registry and restart policy'],
          ['Kubernetes', 'Multiple services and scaling', 'Requires readiness, liveness, resources, config'],
          ['Managed platform', 'Fast product teams', 'Understand platform limits, regions, logs, secrets'],
        ],
      },
      { type: 'h2', text: 'Configuration' },
      {
        type: 'p',
        text: 'Read configuration at startup, validate it, and fail fast if required values are missing. A service that starts with broken config is harder to debug than one that refuses to start.',
      },
      {
        type: 'code',
        title: 'Small config loader',
        language: 'go',
        code: `type Config struct {
	Port        string
	DatabaseURL string
}

func LoadConfig() (Config, error) {
	cfg := Config{
		Port:        getenv("PORT", "8080"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
	}
	if cfg.DatabaseURL == "" {
		return Config{}, fmt.Errorf("DATABASE_URL is required")
	}
	return cfg, nil
}

func getenv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}`,
      },
      { type: 'h2', text: 'Graceful shutdown' },
      {
        type: 'p',
        text: 'When the platform sends SIGTERM, stop accepting new requests and give in-flight requests a short window to finish.',
      },
      {
        type: 'code',
        title: 'Graceful HTTP shutdown',
        language: 'go',
        code: `func run(ctx context.Context, srv *http.Server) error {
	errCh := make(chan error, 1)
	go func() {
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
			return
		}
		errCh <- nil
	}()

	select {
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return srv.Shutdown(shutdownCtx)
	case err := <-errCh:
		return err
	}
}

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	srv := &http.Server{Addr: ":8080", Handler: routes()}
	if err := run(ctx, srv); err != nil {
		log.Fatal(err)
	}
}`,
      },
      { type: 'h2', text: 'Readiness vs liveness' },
      {
        type: 'ul',
        items: [
          'Readiness answers: should this instance receive traffic now?',
          'Liveness answers: should the platform restart this instance?',
          'Startup checks answer: has the app finished booting?',
          'Do not make liveness depend on every downstream service or you can create restart storms.',
        ],
      },
      {
        type: 'code',
        title: 'Kubernetes deployment sketch',
        language: 'yaml',
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: registry.example.com/api:1.0.0
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              path: /readyz
              port: 8080
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              memory: "256Mi"`,
      },
      { type: 'h2', text: 'Migrations and release safety' },
      {
        type: 'p',
        text: 'Database changes should be backward compatible across rolling deploys. A safe pattern is expand, deploy, backfill, switch reads/writes, then contract.',
      },
      {
        type: 'ol',
        items: [
          'Add new nullable columns or tables.',
          'Deploy code that writes both old and new shape when needed.',
          'Backfill existing data.',
          'Deploy code that reads the new shape.',
          'Remove old columns only after all old code is gone.',
        ],
      },
      { type: 'h2', text: 'Observability basics' },
      {
        type: 'ul',
        items: [
          'Structured logs with request IDs.',
          'Metrics for request count, latency, errors, queue depth, and dependency calls.',
          'Tracing across service boundaries.',
          'Alerts based on user impact, not only CPU usage.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Production deployment needs config, shutdown, health, and visibility.',
          'Graceful shutdown protects in-flight work.',
          'Readiness and liveness serve different purposes.',
          'Safe database changes are planned across multiple releases.',
        ],
      },
    ],
  },
  {
    slug: 'go-grpc-intro',
    title: 'gRPC Intro (Conceptual + Small Example)',
    description:
      'Understand where gRPC fits, how Protocol Buffers define APIs, and what a small Go gRPC service looks like.',
    level: 'advanced',
    section: 'Production',
    order: 56,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'gRPC is a high-performance RPC framework commonly used for service-to-service communication. Instead of designing endpoints around HTTP resources and JSON, you define typed services and messages in Protocol Buffers.',
      },
      { type: 'h2', text: 'When gRPC is a good fit' },
      {
        type: 'ul',
        items: [
          'Internal microservice communication with strict contracts.',
          'Low-latency APIs where binary encoding helps.',
          'Streaming request or response workflows.',
          'Polyglot teams that want generated clients for many languages.',
        ],
      },
      {
        type: 'note',
        text: 'For public browser APIs, JSON REST is still often simpler. gRPC-Web or a gateway can help, but plain HTTP may be easier for many products.',
      },
      { type: 'h2', text: 'The .proto file is the contract' },
      {
        type: 'code',
        title: 'proto/greeter/v1/greeter.proto',
        language: 'text',
        code: `syntax = "proto3";

package greeter.v1;

option go_package = "example.com/greeter/gen/greeter/v1;greeterv1";

service GreeterService {
  rpc SayHello(SayHelloRequest) returns (SayHelloResponse);
}

message SayHelloRequest {
  string name = 1;
}

message SayHelloResponse {
  string message = 1;
}`,
      },
      { type: 'h2', text: 'Generate Go code' },
      {
        type: 'code',
        title: 'Install tools and generate',
        language: 'bash',
        code: `go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

protoc --go_out=. --go-grpc_out=. proto/greeter/v1/greeter.proto`,
      },
      { type: 'h2', text: 'Server shape' },
      {
        type: 'code',
        title: 'Small gRPC server',
        language: 'go',
        code: `package main

import (
	"context"
	"fmt"
	"log"
	"net"

	greeterv1 "example.com/greeter/gen/greeter/v1"
	"google.golang.org/grpc"
)

type greeterServer struct {
	greeterv1.UnimplementedGreeterServiceServer
}

func (s *greeterServer) SayHello(ctx context.Context, req *greeterv1.SayHelloRequest) (*greeterv1.SayHelloResponse, error) {
	if req.GetName() == "" {
		return nil, status.Error(codes.InvalidArgument, "name is required")
	}

	return &greeterv1.SayHelloResponse{
		Message: fmt.Sprintf("Hello, %s!", req.GetName()),
	}, nil
}

func main() {
	listener, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatal(err)
	}

	server := grpc.NewServer()
	greeterv1.RegisterGreeterServiceServer(server, &greeterServer{})

	log.Println("gRPC listening on :50051")
	log.Fatal(server.Serve(listener))
}`,
      },
      {
        type: 'warning',
        text: 'The server example uses status and codes from google.golang.org/grpc/status and google.golang.org/grpc/codes. Keep generated imports and package names aligned with your proto option go_package.',
      },
      { type: 'h2', text: 'Client shape' },
      {
        type: 'code',
        title: 'Small gRPC client',
        language: 'go',
        code: `conn, err := grpc.DialContext(ctx, "localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
if err != nil {
	return err
}
defer conn.Close()

client := greeterv1.NewGreeterServiceClient(conn)
res, err := client.SayHello(ctx, &greeterv1.SayHelloRequest{Name: "Gopher"})
if err != nil {
	return err
}

fmt.Println(res.GetMessage())`,
      },
      { type: 'h2', text: 'Production concerns' },
      {
        type: 'table',
        headers: ['Concern', 'Practice'],
        rows: [
          ['Timeouts', 'Use context deadlines on client calls'],
          ['Errors', 'Return gRPC status codes instead of plain errors at API boundaries'],
          ['Compatibility', 'Never reuse proto field numbers for different meaning'],
          ['Security', 'Use TLS or platform service mesh security'],
          ['Observability', 'Add interceptors for logs, metrics, tracing, and auth'],
        ],
      },
      {
        type: 'keypoints',
        items: [
          'gRPC uses typed service contracts defined in proto files.',
          'Generated code provides server interfaces and clients.',
          'It is excellent for internal service-to-service APIs.',
          'Production gRPC requires deadlines, status codes, compatibility discipline, and secure transport.',
        ],
      },
    ],
  },
  {
    slug: 'go-architecture',
    title: 'Structuring Larger Go Services',
    description:
      'Organize larger Go codebases with clear packages, dependency direction, small interfaces, config, handlers, services, repositories, and tests.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 57,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Larger Go services stay maintainable when package boundaries are boring and obvious. Go does not require a framework, so your project structure should make ownership and dependencies clear.',
      },
      { type: 'h2', text: 'A practical service layout' },
      {
        type: 'code',
        title: 'Example layout',
        language: 'text',
        code: `orders/
  cmd/api/main.go
  internal/config/config.go
  internal/httpapi/routes.go
  internal/httpapi/order_handlers.go
  internal/orders/service.go
  internal/orders/repository.go
  internal/postgres/order_repository.go
  internal/platform/logging.go
  migrations/
  go.mod`,
      },
      {
        type: 'p',
        text: 'The cmd directory contains entry points. The internal directory contains application packages that cannot be imported by other modules. Domain packages contain business behavior. Infrastructure packages talk to external systems.',
      },
      { type: 'h2', text: 'Dependency direction' },
      {
        type: 'p',
        text: 'Keep business logic independent of HTTP and database details. Handlers translate HTTP into application calls. Repositories translate storage into domain data.',
      },
      {
        type: 'code',
        title: 'Service depends on an interface',
        language: 'go',
        code: `package orders

import "context"

type Order struct {
	ID     string
	UserID string
	Total  int64
}

type Repository interface {
	Save(ctx context.Context, order Order) error
	FindByID(ctx context.Context, id string) (Order, error)
}

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Create(ctx context.Context, userID string, total int64) (Order, error) {
	if userID == "" {
		return Order{}, ErrUserRequired
	}
	if total <= 0 {
		return Order{}, ErrInvalidTotal
	}

	order := Order{ID: NewID(), UserID: userID, Total: total}
	return order, s.repo.Save(ctx, order)
}`,
      },
      {
        type: 'tip',
        text: 'In Go, define interfaces where they are consumed, not where they are implemented. This keeps interfaces small and tied to real use.',
      },
      { type: 'h2', text: 'HTTP handlers are adapters' },
      {
        type: 'code',
        title: 'Handler calls service',
        language: 'go',
        code: `type OrderHandler struct {
	service *orders.Service
}

func (h *OrderHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req struct {
		UserID string \`json:"user_id"\`
		Total  int64  \`json:"total"\`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	order, err := h.service.Create(r.Context(), req.UserID, req.Total)
	if err != nil {
		writeOrderError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, order)
}`,
      },
      { type: 'h2', text: 'Package naming' },
      {
        type: 'ul',
        items: [
          'Use short lowercase package names: orders, billing, postgres, httpapi.',
          'Avoid generic names like utils, common, or helpers when a domain name exists.',
          'Do not create one package per type.',
          'Keep packages cohesive: files in one package should change for related reasons.',
        ],
      },
      { type: 'h2', text: 'Configuration and composition in main' },
      {
        type: 'p',
        text: 'The main package wires dependencies together. This is where config, database connections, repositories, services, handlers, and servers meet.',
      },
      {
        type: 'code',
        title: 'main wires the graph',
        language: 'go',
        code: `func main() {
	cfg := config.MustLoad()
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	db := postgres.MustOpen(cfg.DatabaseURL)
	defer db.Close()

	orderRepo := postgres.NewOrderRepository(db)
	orderService := orders.NewService(orderRepo)
	handler := httpapi.NewOrderHandler(orderService, logger)

	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: httpapi.Routes(handler),
	}

	log.Fatal(server.ListenAndServe())
}`,
      },
      { type: 'h2', text: 'Testing architecture' },
      {
        type: 'p',
        text: 'Architecture is good when it makes testing easy. Service tests can use fake repositories. Handler tests can use httptest. Repository tests can use a real test database when needed.',
      },
      {
        type: 'keypoints',
        items: [
          'Let package boundaries follow business concepts and infrastructure boundaries.',
          'Keep business logic away from HTTP and database packages.',
          'Define small interfaces at the consumer side.',
          'Use main for dependency wiring and startup behavior.',
        ],
      },
    ],
  },
  {
    slug: 'go-tooling-advanced',
    title: 'Advanced Tooling (vet, staticcheck mindset)',
    description:
      'Use Go tooling like gofmt, go test, go vet, staticcheck, govulncheck, race detection, coverage, and CI as a production quality system.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 58,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Go tooling is one of the language superpowers. Advanced teams treat tooling as a feedback system that catches bugs, style drift, security issues, and concurrency mistakes before production.',
      },
      { type: 'h2', text: 'The daily command set' },
      {
        type: 'code',
        title: 'Core checks',
        language: 'bash',
        code: `gofmt -w .
go test ./...
go test -race ./...
go vet ./...
govulncheck ./...`,
      },
      {
        type: 'p',
        text: 'gofmt removes style debates. go test checks behavior. -race finds data races at runtime. go vet catches suspicious code. govulncheck reports known vulnerabilities that affect reachable code.',
      },
      { type: 'h2', text: 'staticcheck mindset' },
      {
        type: 'p',
        text: 'Staticcheck is a popular advanced linter for Go. The most important habit is not memorizing every rule, but reading findings carefully and understanding the bug pattern.',
      },
      {
        type: 'code',
        title: 'Install and run staticcheck',
        language: 'bash',
        code: `go install honnef.co/go/tools/cmd/staticcheck@latest
staticcheck ./...`,
      },
      { type: 'h2', text: 'Race detector' },
      {
        type: 'p',
        text: 'The race detector instruments your program and reports unsafe concurrent access. It only finds races in code paths that actually run, so combine it with meaningful tests or staging traffic.',
      },
      {
        type: 'code',
        title: 'Race test and race run',
        language: 'bash',
        code: `go test -race ./...
go run -race ./cmd/server`,
      },
      { type: 'h2', text: 'Coverage without vanity metrics' },
      {
        type: 'p',
        text: 'Coverage tells you what ran, not whether assertions were good. Use it to find untested branches in important code, not as the only quality goal.',
      },
      {
        type: 'code',
        title: 'Coverage profile',
        language: 'bash',
        code: `go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out`,
      },
      { type: 'h2', text: 'A small Makefile' },
      {
        type: 'code',
        title: 'Makefile',
        language: 'text',
        code: `.PHONY: fmt test race vet vuln check

fmt:
	gofmt -w .

test:
	go test ./...

race:
	go test -race ./...

vet:
	go vet ./...

vuln:
	govulncheck ./...

check: fmt test race vet vuln`,
      },
      { type: 'h2', text: 'CI example' },
      {
        type: 'code',
        title: '.github/workflows/go.yml',
        language: 'yaml',
        code: `name: Go

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: "1.23"
          cache: true
      - run: go test ./...
      - run: go vet ./...
      - run: go test -race ./...`,
      },
      { type: 'h2', text: 'Tooling policy for teams' },
      {
        type: 'ul',
        items: [
          'Run fast checks locally before commit.',
          'Run slower checks in CI.',
          'Keep generated code separate from hand-written code.',
          'Document one command that verifies the project.',
          'Do not ignore linter findings without explaining why.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Go ships with excellent quality tools.',
          'staticcheck and govulncheck add useful production feedback.',
          'The race detector is essential for concurrent code.',
          'CI should make the correct workflow easy and repeatable.',
        ],
      },
    ],
  },
  {
    slug: 'go-project-cli',
    title: 'Mini Project: Task CLI',
    description:
      'Build a small task manager command-line application with modules, JSON persistence, commands, error handling, and a clean file structure.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 59,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project builds a practical command-line task manager. You will create tasks, list them, and mark them done using only the standard library.',
      },
      { type: 'h2', text: 'What you will build' },
      {
        type: 'ul',
        items: [
          'A Go module named taskcli.',
          'A command-line app with add, list, and done commands.',
          'JSON file persistence in the user config directory.',
          'Clear errors for invalid commands and missing task IDs.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the module' },
      {
        type: 'code',
        title: 'Commands',
        language: 'bash',
        code: `mkdir taskcli
cd taskcli
go mod init example.com/taskcli
mkdir -p cmd/taskcli internal/tasks`,
      },
      {
        type: 'code',
        title: 'File structure',
        language: 'text',
        code: `taskcli/
  go.mod
  cmd/taskcli/main.go
  internal/tasks/store.go
  internal/tasks/task.go`,
      },
      { type: 'h2', text: 'Step 2: Define the task model' },
      {
        type: 'code',
        title: 'internal/tasks/task.go',
        language: 'go',
        code: `package tasks

import "time"

type Task struct {
	ID        int       \`json:"id"\`
	Title     string    \`json:"title"\`
	Done      bool      \`json:"done"\`
	CreatedAt time.Time \`json:"created_at"\`
	DoneAt    time.Time \`json:"done_at,omitempty"\`
}`,
      },
      { type: 'h2', text: 'Step 3: Create a JSON store' },
      {
        type: 'code',
        title: 'internal/tasks/store.go',
        language: 'go',
        code: `package tasks

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

type Store struct {
	path string
}

func NewStore(path string) Store {
	return Store{path: path}
}

func DefaultPath() (string, error) {
	dir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "taskcli", "tasks.json"), nil
}

func (s Store) Load() ([]Task, error) {
	data, err := os.ReadFile(s.path)
	if errors.Is(err, os.ErrNotExist) {
		return []Task{}, nil
	}
	if err != nil {
		return nil, err
	}
	if len(data) == 0 {
		return []Task{}, nil
	}

	var tasks []Task
	if err := json.Unmarshal(data, &tasks); err != nil {
		return nil, fmt.Errorf("decode tasks: %w", err)
	}
	return tasks, nil
}

func (s Store) Save(tasks []Task) error {
	if err := os.MkdirAll(filepath.Dir(s.path), 0o755); err != nil {
		return err
	}

	data, err := json.MarshalIndent(tasks, "", "  ")
	if err != nil {
		return err
	}
	data = append(data, '\\n')

	return os.WriteFile(s.path, data, 0o600)
}

func Add(list []Task, title string) ([]Task, Task) {
	nextID := 1
	for _, task := range list {
		if task.ID >= nextID {
			nextID = task.ID + 1
		}
	}

	task := Task{ID: nextID, Title: title, CreatedAt: time.Now()}
	return append(list, task), task
}

func MarkDone(list []Task, id int) ([]Task, Task, error) {
	for i := range list {
		if list[i].ID == id {
			if !list[i].Done {
				list[i].Done = true
				list[i].DoneAt = time.Now()
			}
			return list, list[i], nil
		}
	}
	return list, Task{}, fmt.Errorf("task %d not found", id)
}`,
      },
      { type: 'h2', text: 'Step 4: Build the command-line interface' },
      {
        type: 'code',
        title: 'cmd/taskcli/main.go',
        language: 'go',
        code: `package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"example.com/taskcli/internal/tasks"
)

func main() {
	if err := run(os.Args[1:]); err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}
}

func run(args []string) error {
	if len(args) == 0 {
		printUsage()
		return nil
	}

	path, err := tasks.DefaultPath()
	if err != nil {
		return err
	}
	store := tasks.NewStore(path)

	list, err := store.Load()
	if err != nil {
		return err
	}

	switch args[0] {
	case "add":
		if len(args) < 2 {
			return fmt.Errorf("usage: taskcli add <title>")
		}
		title := strings.TrimSpace(strings.Join(args[1:], " "))
		if title == "" {
			return fmt.Errorf("task title cannot be empty")
		}

		updated, task := tasks.Add(list, title)
		if err := store.Save(updated); err != nil {
			return err
		}
		fmt.Printf("added #%d: %s\\n", task.ID, task.Title)

	case "list":
		printTasks(list)

	case "done":
		if len(args) != 2 {
			return fmt.Errorf("usage: taskcli done <id>")
		}
		id, err := strconv.Atoi(args[1])
		if err != nil {
			return fmt.Errorf("id must be a number")
		}

		updated, task, err := tasks.MarkDone(list, id)
		if err != nil {
			return err
		}
		if err := store.Save(updated); err != nil {
			return err
		}
		fmt.Printf("done #%d: %s\\n", task.ID, task.Title)

	default:
		return fmt.Errorf("unknown command %q", args[0])
	}

	return nil
}

func printTasks(list []tasks.Task) {
	if len(list) == 0 {
		fmt.Println("No tasks yet.")
		return
	}

	for _, task := range list {
		status := " "
		if task.Done {
			status = "x"
		}
		fmt.Printf("[%s] #%d %s\\n", status, task.ID, task.Title)
	}
}

func printUsage() {
	fmt.Println("taskcli - a tiny task manager")
	fmt.Println()
	fmt.Println("Usage:")
	fmt.Println("  taskcli add <title>")
	fmt.Println("  taskcli list")
	fmt.Println("  taskcli done <id>")
}`,
      },
      { type: 'h2', text: 'Step 5: Run it' },
      {
        type: 'code',
        title: 'Try the CLI',
        language: 'bash',
        code: `go run ./cmd/taskcli
go run ./cmd/taskcli add "Write README"
go run ./cmd/taskcli add "Ship first release"
go run ./cmd/taskcli list
go run ./cmd/taskcli done 1
go run ./cmd/taskcli list`,
      },
      { type: 'h2', text: 'Step 6: Build an executable' },
      {
        type: 'code',
        title: 'Build and install',
        language: 'bash',
        code: `go build -o taskcli ./cmd/taskcli
./taskcli list

# Optional:
go install ./cmd/taskcli`,
      },
      { type: 'h2', text: 'Practice upgrades' },
      {
        type: 'ul',
        items: [
          'Add a delete command.',
          'Add due dates with time.Parse.',
          'Add a --file flag for custom storage paths.',
          'Write unit tests for Add and MarkDone.',
          'Add table output or JSON output for scripting.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Small CLIs are a great way to practice modules, packages, and error handling.',
          'The standard library is enough for many useful tools.',
          'Separate command parsing from task operations when the project grows.',
          'JSON files are simple persistence for local developer tools.',
        ],
      },
    ],
  },
  {
    slug: 'go-project-api',
    title: 'Mini Project: JSON REST API',
    description:
      'Build a small JSON REST API with net/http, routing, JSON helpers, an in-memory store, validation, and curl-based testing.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 60,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project builds a JSON REST API for notes. It uses only the standard library so you understand the moving parts before adding a router or database package.',
      },
      { type: 'h2', text: 'API features' },
      {
        type: 'ul',
        items: [
          'GET /healthz for health checks.',
          'POST /notes to create a note.',
          'GET /notes to list notes.',
          'GET /notes/{id} to fetch one note.',
          'JSON errors and request validation.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the project' },
      {
        type: 'code',
        title: 'Commands',
        language: 'bash',
        code: `mkdir notesapi
cd notesapi
go mod init example.com/notesapi
mkdir -p cmd/api internal/notes internal/httpapi`,
      },
      {
        type: 'code',
        title: 'File structure',
        language: 'text',
        code: `notesapi/
  cmd/api/main.go
  internal/notes/store.go
  internal/httpapi/server.go
  go.mod`,
      },
      { type: 'h2', text: 'Step 2: Add the note store' },
      {
        type: 'code',
        title: 'internal/notes/store.go',
        language: 'go',
        code: `package notes

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type Note struct {
	ID        int       \`json:"id"\`
	Title     string    \`json:"title"\`
	Body      string    \`json:"body"\`
	CreatedAt time.Time \`json:"created_at"\`
}

type Store struct {
	mu     sync.RWMutex
	nextID int
	notes  map[int]Note
}

func NewStore() *Store {
	return &Store{
		nextID: 1,
		notes:  make(map[int]Note),
	}
}

func (s *Store) Create(ctx context.Context, title, body string) (Note, error) {
	if title == "" {
		return Note{}, fmt.Errorf("title is required")
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	note := Note{
		ID:        s.nextID,
		Title:     title,
		Body:      body,
		CreatedAt: time.Now(),
	}
	s.notes[note.ID] = note
	s.nextID++
	return note, nil
}

func (s *Store) List(ctx context.Context) []Note {
	s.mu.RLock()
	defer s.mu.RUnlock()

	out := make([]Note, 0, len(s.notes))
	for _, note := range s.notes {
		out = append(out, note)
	}
	return out
}

func (s *Store) Find(ctx context.Context, id int) (Note, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	note, ok := s.notes[id]
	return note, ok
}`,
      },
      { type: 'h2', text: 'Step 3: Add HTTP handlers' },
      {
        type: 'code',
        title: 'internal/httpapi/server.go',
        language: 'go',
        code: `package httpapi

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"example.com/notesapi/internal/notes"
)

type Server struct {
	store *notes.Store
}

func NewServer(store *notes.Store) *Server {
	return &Server{store: store}
}

func (s *Server) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", s.health)
	mux.HandleFunc("GET /notes", s.listNotes)
	mux.HandleFunc("POST /notes", s.createNote)
	mux.HandleFunc("GET /notes/{id}", s.getNote)
	return mux
}

func (s *Server) health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *Server) listNotes(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, s.store.List(r.Context()))
}

func (s *Server) createNote(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Title string \`json:"title"\`
		Body  string \`json:"body"\`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON")
		return
	}

	note, err := s.store.Create(r.Context(), strings.TrimSpace(req.Title), req.Body)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, note)
}

func (s *Server) getNote(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "id must be a number")
		return
	}

	note, ok := s.store.Find(r.Context(), id)
	if !ok {
		writeError(w, http.StatusNotFound, "note not found")
		return
	}

	writeJSON(w, http.StatusOK, note)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}`,
      },
      { type: 'h2', text: 'Step 4: Wire the server' },
      {
        type: 'code',
        title: 'cmd/api/main.go',
        language: 'go',
        code: `package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"example.com/notesapi/internal/httpapi"
	"example.com/notesapi/internal/notes"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	store := notes.NewStore()
	api := httpapi.NewServer(store)

	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           api.Routes(),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("listening on :%s", port)
	log.Fatal(srv.ListenAndServe())
}`,
      },
      { type: 'h2', text: 'Step 5: Run and test with curl' },
      {
        type: 'code',
        title: 'Run server',
        language: 'bash',
        code: `go run ./cmd/api`,
      },
      {
        type: 'code',
        title: 'Call the API',
        language: 'bash',
        code: `curl http://localhost:8080/healthz

curl -X POST http://localhost:8080/notes \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Learn Go","body":"Build a small API"}'

curl http://localhost:8080/notes
curl http://localhost:8080/notes/1`,
      },
      { type: 'h2', text: 'Step 6: Production upgrades' },
      {
        type: 'ol',
        items: [
          'Add graceful shutdown with signal.NotifyContext.',
          'Limit request body size with http.MaxBytesReader.',
          'Add request logging middleware.',
          'Replace the in-memory store with Postgres.',
          'Add tests with httptest.',
          'Add authentication for write endpoints.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'A REST API is handlers, validation, storage, and response format.',
          'net/http is powerful enough for small APIs.',
          'Use mutexes when an in-memory store is shared across requests.',
          'The next real step is persistent storage and tests.',
        ],
      },
    ],
  },
  {
    slug: 'go-project-worker',
    title: 'Mini Project: Background Worker',
    description:
      'Build a background worker with a job queue, worker goroutines, retries, context cancellation, graceful shutdown, and structured logs.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 61,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'Many production systems need background work: sending emails, resizing images, charging invoices, processing webhooks, or syncing data. This project builds an in-process worker queue.',
      },
      {
        type: 'warning',
        text: 'An in-process queue is useful for learning and small internal tools. For critical jobs, use durable storage or a queue system so jobs survive process restarts.',
      },
      { type: 'h2', text: 'What you will build' },
      {
        type: 'ul',
        items: [
          'A buffered job queue.',
          'Multiple worker goroutines.',
          'Retry logic with a maximum attempt count.',
          'Context cancellation for graceful shutdown.',
          'A tiny HTTP endpoint that enqueues jobs.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the module' },
      {
        type: 'code',
        title: 'Commands',
        language: 'bash',
        code: `mkdir workerapp
cd workerapp
go mod init example.com/workerapp
mkdir -p cmd/worker internal/jobs`,
      },
      {
        type: 'code',
        title: 'File structure',
        language: 'text',
        code: `workerapp/
  cmd/worker/main.go
  internal/jobs/queue.go
  internal/jobs/processor.go
  go.mod`,
      },
      { type: 'h2', text: 'Step 2: Define jobs and queue' },
      {
        type: 'code',
        title: 'internal/jobs/queue.go',
        language: 'go',
        code: `package jobs

import (
	"context"
	"fmt"
)

type Job struct {
	ID       int
	Kind     string
	Payload  string
	Attempts int
}

type Queue struct {
	ch chan Job
}

func NewQueue(size int) *Queue {
	return &Queue{ch: make(chan Job, size)}
}

func (q *Queue) Enqueue(ctx context.Context, job Job) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	case q.ch <- job:
		return nil
	default:
		return fmt.Errorf("queue is full")
	}
}

func (q *Queue) Jobs() <-chan Job {
	return q.ch
}

func (q *Queue) Close() {
	close(q.ch)
}`,
      },
      { type: 'h2', text: 'Step 3: Add a processor' },
      {
        type: 'code',
        title: 'internal/jobs/processor.go',
        language: 'go',
        code: `package jobs

import (
	"context"
	"fmt"
	"log/slog"
	"sync"
	"time"
)

type Processor struct {
	queue       *Queue
	workerCount int
	maxAttempts int
	logger      *slog.Logger
}

func NewProcessor(queue *Queue, workerCount int, maxAttempts int, logger *slog.Logger) *Processor {
	return &Processor{
		queue:       queue,
		workerCount: workerCount,
		maxAttempts: maxAttempts,
		logger:      logger,
	}
}

func (p *Processor) Run(ctx context.Context) {
	var wg sync.WaitGroup
	for i := 1; i <= p.workerCount; i++ {
		wg.Add(1)
		go p.worker(ctx, i, &wg)
	}

	<-ctx.Done()
	p.logger.Info("stopping workers")
	wg.Wait()
}

func (p *Processor) worker(ctx context.Context, id int, wg *sync.WaitGroup) {
	defer wg.Done()

	for {
		select {
		case <-ctx.Done():
			return
		case job, ok := <-p.queue.Jobs():
			if !ok {
				return
			}
			p.handle(ctx, id, job)
		}
	}
}

func (p *Processor) handle(ctx context.Context, workerID int, job Job) {
	logger := p.logger.With("worker", workerID, "job_id", job.ID, "kind", job.Kind)

	for {
		job.Attempts++
		if err := perform(ctx, job); err != nil {
			logger.Warn("job failed", "attempt", job.Attempts, "error", err)
			if job.Attempts >= p.maxAttempts {
				logger.Error("job abandoned")
				return
			}

			select {
			case <-ctx.Done():
				return
			case <-time.After(time.Duration(job.Attempts) * time.Second):
				continue
			}
		}

		logger.Info("job complete", "attempts", job.Attempts)
		return
	}
}

func perform(ctx context.Context, job Job) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-time.After(500 * time.Millisecond):
	}

	if job.Kind == "fail" {
		return fmt.Errorf("simulated failure")
	}
	return nil
}`,
      },
      { type: 'h2', text: 'Step 4: Add HTTP enqueue endpoint and shutdown' },
      {
        type: 'code',
        title: 'cmd/worker/main.go',
        language: 'go',
        code: `package main

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"sync/atomic"
	"syscall"
	"time"

	"example.com/workerapp/internal/jobs"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	queue := jobs.NewQueue(100)
	processor := jobs.NewProcessor(queue, 3, 3, logger)

	go processor.Run(ctx)

	var nextID atomic.Int64
	mux := http.NewServeMux()
	mux.HandleFunc("POST /jobs", func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Kind    string \`json:"kind"\`
			Payload string \`json:"payload"\`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}
		if req.Kind == "" {
			req.Kind = "email"
		}

		job := jobs.Job{
			ID:      int(nextID.Add(1)),
			Kind:    req.Kind,
			Payload: req.Payload,
		}
		if err := queue.Enqueue(r.Context(), job); err != nil {
			http.Error(w, err.Error(), http.StatusServiceUnavailable)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusAccepted)
		_ = json.NewEncoder(w).Encode(map[string]int{"id": job.ID})
	})

	srv := &http.Server{
		Addr:              ":8080",
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		_ = srv.Shutdown(shutdownCtx)
	}()

	logger.Info("listening", "addr", srv.Addr)
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}`,
      },
      { type: 'h2', text: 'Step 5: Run and enqueue jobs' },
      {
        type: 'code',
        title: 'Run worker app',
        language: 'bash',
        code: `go run ./cmd/worker`,
      },
      {
        type: 'code',
        title: 'Create jobs',
        language: 'bash',
        code: `curl -X POST http://localhost:8080/jobs \\
  -H "Content-Type: application/json" \\
  -d '{"kind":"email","payload":"welcome@example.com"}'

curl -X POST http://localhost:8080/jobs \\
  -H "Content-Type: application/json" \\
  -d '{"kind":"fail","payload":"retry me"}'`,
      },
      { type: 'h2', text: 'Step 6: Make it production-ready' },
      {
        type: 'ol',
        items: [
          'Store jobs in a database table with status, attempts, and next_run_at.',
          'Make job handlers idempotent so retries are safe.',
          'Add metrics for queue depth, processing time, success count, and failure count.',
          'Add a dead-letter queue for jobs that fail too many times.',
          'Use context deadlines for external API calls inside jobs.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Background workers need cancellation, retries, and observability.',
          'In-memory queues are simple but not durable.',
          'Bounded queues protect services under load.',
          'Idempotency is the difference between safe retries and duplicate side effects.',
        ],
      },
    ],
  },
  {
    slug: 'go-common-mistakes',
    title: 'Common Go Mistakes (and Fixes)',
    description:
      'Avoid common Go bugs around nil maps, defer, contexts, goroutines, loop variables, channels, errors, mutexes, and shadowing.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 62,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Advanced Go is often about avoiding simple-looking mistakes that become production bugs. This lesson collects common problems and practical fixes.',
      },
      { type: 'h2', text: 'Writing to a nil map' },
      {
        type: 'code',
        title: 'Initialize maps before writing',
        language: 'go',
        code: `var counts map[string]int
// counts["go"] = 1 // panic: assignment to entry in nil map

counts = make(map[string]int)
counts["go"] = 1`,
      },
      { type: 'h2', text: 'Ignoring context cancellation' },
      {
        type: 'p',
        text: 'If a request is canceled, downstream work should usually stop too. Pass context through database calls, HTTP requests, and worker operations.',
      },
      {
        type: 'code',
        title: 'Use request context',
        language: 'go',
        code: `func handler(w http.ResponseWriter, r *http.Request) {
	user, err := repo.FindUser(r.Context(), r.PathValue("id"))
	if err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	writeJSON(w, http.StatusOK, user)
}`,
      },
      { type: 'h2', text: 'Deferring inside long loops' },
      {
        type: 'p',
        text: 'defer runs when the surrounding function returns, not when the loop iteration ends. In long loops, this can keep files, response bodies, or locks open too long.',
      },
      {
        type: 'code',
        title: 'Close inside helper function',
        language: 'go',
        code: `func processFiles(paths []string) error {
	for _, path := range paths {
		if err := processOne(path); err != nil {
			return err
		}
	}
	return nil
}

func processOne(path string) error {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()

	// Process one file.
	return nil
}`,
      },
      { type: 'h2', text: 'Copying mutexes' },
      {
        type: 'p',
        text: 'Do not copy a struct after it contains a sync.Mutex, sync.RWMutex, sync.WaitGroup, or similar synchronization value. Pass pointers instead.',
      },
      {
        type: 'code',
        title: 'Use pointer receivers for locked state',
        language: 'go',
        code: `type Counter struct {
	mu sync.Mutex
	n  int
}

func (c *Counter) Inc() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.n++
}`,
      },
      { type: 'h2', text: 'Closing channels from the receiver' },
      {
        type: 'p',
        text: 'The goroutine that sends values usually owns closing the channel. Receivers should read until the channel closes or context is canceled.',
      },
      {
        type: 'code',
        title: 'Sender closes',
        language: 'go',
        code: `func produce() <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for i := 0; i < 3; i++ {
			out <- i
		}
	}()
	return out
}`,
      },
      { type: 'h2', text: 'Loop variable capture' },
      {
        type: 'p',
        text: 'Modern Go versions improved range loop variable behavior, but explicit copies are still helpful for clarity, older modules, and non-range cases.',
      },
      {
        type: 'code',
        title: 'Copy values when launching goroutines',
        language: 'go',
        code: `for _, url := range urls {
	url := url
	go func() {
		fetch(url)
	}()
}`,
      },
      { type: 'h2', text: 'Error wrapping without checking' },
      {
        type: 'p',
        text: 'Use %w when wrapping errors that callers may inspect with errors.Is or errors.As. Use %v when the underlying error should only be text.',
      },
      {
        type: 'code',
        title: 'Wrap for callers',
        language: 'go',
        code: `if err != nil {
	return fmt.Errorf("load config: %w", err)
}`,
      },
      { type: 'h2', text: 'Shadowing important variables' },
      {
        type: 'p',
        text: 'Short declarations can accidentally create a new variable in an inner scope. This is especially confusing with err, ctx, tx, and config variables.',
      },
      {
        type: 'tip',
        text: 'When a short declaration looks suspicious, split assignment from declaration or use go vet/staticcheck to catch likely mistakes.',
      },
      {
        type: 'keypoints',
        items: [
          'Initialize maps before writing.',
          'Pass context through request-scoped work.',
          'Be careful with defer in loops.',
          'Do not copy synchronization primitives.',
          'Use channel closing ownership and error wrapping intentionally.',
        ],
      },
    ],
  },
  {
    slug: 'go-ecosystem',
    title: 'Go Ecosystem & Useful Libraries',
    description:
      'Explore the Go ecosystem, standard library strengths, popular libraries, dependency selection, and when to keep things simple.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 63,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Go has a strong standard library and a practical ecosystem. The best Go teams do not avoid dependencies completely, but they choose them carefully.',
      },
      { type: 'h2', text: 'Standard library first' },
      {
        type: 'p',
        text: 'Before installing a package, check whether the standard library already solves the problem well enough. net/http, encoding/json, database/sql, testing, log/slog, context, and sync cover a lot of production needs.',
      },
      { type: 'h2', text: 'Common ecosystem areas' },
      {
        type: 'table',
        headers: ['Area', 'Examples', 'What to evaluate'],
        rows: [
          ['Routing', 'chi, gorilla/mux, httprouter', 'Pattern style, middleware, maintenance'],
          ['Database', 'pgx, sqlx, ent, gorm', 'Control vs abstraction, migrations, performance'],
          ['Config', 'envconfig, viper', 'Simplicity, environment support, surprises'],
          ['Validation', 'go-playground/validator', 'Tag clarity, custom rules, error messages'],
          ['CLI', 'cobra, urfave/cli', 'Command complexity and documentation generation'],
          ['Testing', 'testify, gomock, go-cmp', 'Readable assertions and maintainable mocks'],
          ['Observability', 'OpenTelemetry, Prometheus clients', 'Platform compatibility'],
        ],
      },
      { type: 'h2', text: 'Dependency selection checklist' },
      {
        type: 'ul',
        items: [
          'Is the package maintained and used by real projects?',
          'Does it solve a real problem in your app right now?',
          'Can your team understand and debug it?',
          'Does it pull in many transitive dependencies?',
          'Does it support your Go version and security requirements?',
          'Can you remove it later without rewriting the whole service?',
        ],
      },
      { type: 'h2', text: 'Module hygiene' },
      {
        type: 'code',
        title: 'Dependency maintenance commands',
        language: 'bash',
        code: `go list -m all
go list -m -u all
go get example.com/package@latest
go mod tidy
govulncheck ./...`,
      },
      {
        type: 'note',
        text: 'go mod tidy removes unused requirements and adds missing ones. Review go.mod and go.sum changes like code changes.',
      },
      { type: 'h2', text: 'Frameworks vs libraries' },
      {
        type: 'p',
        text: 'Go applications often use libraries instead of large frameworks. This keeps the main program explicit: you can see the router, database, logger, service wiring, and shutdown behavior.',
      },
      {
        type: 'tip',
        text: 'A dependency should reduce real complexity. If it only saves a few lines while hiding important behavior, the standard library may be better.',
      },
      {
        type: 'keypoints',
        items: [
          'The standard library is a serious production toolkit.',
          'Good dependencies are maintained, understandable, and scoped.',
          'Review transitive dependencies and vulnerability reports.',
          'Prefer libraries that fit Go style over magic-heavy frameworks.',
        ],
      },
    ],
  },
  {
    slug: 'go-portfolio',
    title: 'Building a Go Portfolio',
    description:
      'Design portfolio projects that prove production Go skills: APIs, CLIs, workers, databases, tests, Docker, deployment, and clear documentation.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 64,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A strong Go portfolio shows that you can build, test, explain, and operate real software. The goal is not many tiny demos; it is a few polished projects with production habits.',
      },
      { type: 'h2', text: 'Portfolio project ideas' },
      {
        type: 'ul',
        items: [
          'A JSON API with authentication, Postgres, migrations, tests, and Docker.',
          'A CLI that solves a real developer workflow problem.',
          'A background worker with retries, durable jobs, and metrics.',
          'A small gRPC service with generated clients and clear proto contracts.',
          'A URL shortener, invoice tracker, uptime monitor, or webhook processor.',
        ],
      },
      { type: 'h2', text: 'What employers and teams look for' },
      {
        type: 'table',
        headers: ['Signal', 'How to show it'],
        rows: [
          ['Readable code', 'Small packages, meaningful names, simple control flow'],
          ['Testing skill', 'Unit tests, handler tests, and documented test commands'],
          ['Production awareness', 'Dockerfile, graceful shutdown, config, health checks'],
          ['Data skills', 'Migrations, indexes, transactions, and safe queries'],
          ['Communication', 'README, architecture notes, trade-offs, screenshots'],
        ],
      },
      { type: 'h2', text: 'README structure' },
      {
        type: 'code',
        title: 'README outline',
        language: 'text',
        code: `# Project Name

Short explanation of the problem and solution.

## Features
- JSON API with authentication
- PostgreSQL persistence
- Background email jobs
- Docker Compose local environment

## Tech Stack
Go, net/http, PostgreSQL, Docker

## Run Locally
go test ./...
docker compose up --build

## API Examples
curl examples here

## Architecture Notes
Explain package layout, trade-offs, and next improvements.`,
      },
      { type: 'h2', text: 'Polish checklist' },
      {
        type: 'ol',
        items: [
          'Run gofmt, go test, go vet, and optionally staticcheck.',
          'Add a Dockerfile or docker-compose.yml if the app has services.',
          'Document environment variables.',
          'Include example requests or screenshots.',
          'Add clear seed data or setup instructions.',
          'Keep commit history readable enough to discuss.',
        ],
      },
      {
        type: 'tip',
        text: 'A deployed simple project is often more impressive than an unfinished complex one. Finish the loop: build, test, package, deploy, and explain.',
      },
      {
        type: 'keypoints',
        items: [
          'Portfolio projects should prove practical production skills.',
          'Documentation is part of the product.',
          'Show tests, deployment, and trade-off thinking.',
          'Depth beats a large collection of incomplete demos.',
        ],
      },
    ],
  },
  {
    slug: 'go-next-steps',
    title: 'What to Learn After Go',
    description:
      'Plan your next growth path after Go: systems design, databases, distributed systems, Kubernetes, observability, security, and open source.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 65,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Learning Go is a powerful step, but professional growth comes from combining Go with systems knowledge. The best next topic depends on what you want to build.',
      },
      { type: 'h2', text: 'If you want backend engineering' },
      {
        type: 'ul',
        items: [
          'HTTP internals, caching, authentication, authorization, and API design.',
          'PostgreSQL, indexes, transactions, isolation levels, and query plans.',
          'Message queues, background jobs, idempotency, and eventual consistency.',
          'Testing strategies: unit, integration, contract, and load tests.',
        ],
      },
      { type: 'h2', text: 'If you want cloud and platform work' },
      {
        type: 'ul',
        items: [
          'Docker, Kubernetes, service discovery, ingress, and resource limits.',
          'CI/CD pipelines, progressive delivery, rollbacks, and release safety.',
          'Observability with logs, metrics, traces, and SLOs.',
          'Infrastructure as code and secret management.',
        ],
      },
      { type: 'h2', text: 'If you want systems programming' },
      {
        type: 'ul',
        items: [
          'Operating system basics: processes, threads, files, sockets, signals.',
          'Networking: TCP, TLS, DNS, HTTP/2, and load balancing.',
          'Performance: profiling, memory layout, CPU caches, and lock contention.',
          'Compilers, parsers, and command-line tooling.',
        ],
      },
      { type: 'h2', text: 'A 90-day growth plan' },
      {
        type: 'table',
        headers: ['Weeks', 'Focus', 'Deliverable'],
        rows: [
          ['1-3', 'API + database depth', 'REST API with migrations and tests'],
          ['4-6', 'Background processing', 'Worker with durable jobs and retries'],
          ['7-9', 'Deployment and observability', 'Containerized app with logs and metrics'],
          ['10-12', 'Performance and reliability', 'Load test, profile, optimize, document'],
        ],
      },
      { type: 'h2', text: 'Read real code' },
      {
        type: 'p',
        text: 'Studying mature Go projects teaches naming, package boundaries, testing patterns, and production trade-offs. Read small parts at a time: one package, one feature, or one bug fix.',
      },
      { type: 'h2', text: 'Contribute carefully' },
      {
        type: 'ol',
        items: [
          'Start with documentation, tests, or small bug fixes.',
          'Read contribution guidelines and existing style.',
          'Open focused changes with clear explanations.',
          'Respond kindly to review feedback.',
          'Use the process to learn how experienced teams maintain Go code.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'After Go, deepen the systems around Go.',
          'Choose a path based on the work you want to do.',
          'Build projects that combine APIs, data, deployment, and observability.',
          'Reading and contributing to real Go code accelerates growth.',
        ],
      },
    ],
  },
];
