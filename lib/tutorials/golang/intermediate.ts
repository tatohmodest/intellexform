import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'go-interfaces-advanced',
    title: 'Interfaces in Practice',
    description:
      'Use Go interfaces to design small contracts, accept behavior instead of concrete types, and keep packages easy to test.',
    level: 'intermediate',
    section: 'Stronger Go',
    order: 26,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Interfaces are most powerful when they describe the behavior a function needs, not every method a type happens to have. In production Go, that usually means small interfaces with one or two methods.',
      },
      {
        type: 'p',
        text: 'A type satisfies an interface implicitly. You do not write an implements keyword. If the method set matches, the value can be used through the interface.',
      },
      { type: 'h2', text: 'Accept the behavior you need' },
      {
        type: 'code',
        language: 'go',
        title: 'A small interface for saving audit events',
        code: `package main

import "fmt"

type AuditWriter interface {
	Write(message string) error
}

type ConsoleAudit struct{}

func (ConsoleAudit) Write(message string) error {
	fmt.Println("AUDIT:", message)
	return nil
}

func RegisterUser(email string, audit AuditWriter) error {
	if email == "" {
		return fmt.Errorf("email is required")
	}

	return audit.Write("registered user " + email)
}

func main() {
	err := RegisterUser("ada@example.com", ConsoleAudit{})
	if err != nil {
		fmt.Println("error:", err)
	}
}`,
      },
      {
        type: 'p',
        text: 'RegisterUser does not know whether the audit event goes to the console, a file, a database, or a test fake. It only knows that it can call Write.',
      },
      { type: 'h2', text: 'Use interfaces at package boundaries' },
      {
        type: 'code',
        language: 'go',
        title: 'A fake implementation for tests or demos',
        code: `type MemoryAudit struct {
	Messages []string
}

func (m *MemoryAudit) Write(message string) error {
	m.Messages = append(m.Messages, message)
	return nil
}`,
      },
      {
        type: 'note',
        text: 'It is common for the consuming package to define the interface. That keeps the contract focused on what the consumer needs.',
      },
      {
        type: 'tip',
        text: 'Prefer small interfaces such as io.Reader, io.Writer, and http.Handler. Large interfaces are harder to satisfy and harder to test.',
      },
      {
        type: 'try',
        text: 'Create a Notifier interface with a Send(to, message string) error method, then write one implementation that prints and one implementation that stores sent messages in memory.',
      },
      {
        type: 'keypoints',
        items: [
          'Go interfaces are satisfied implicitly by method sets.',
          'Small interfaces make functions flexible without hiding too much.',
          'Define interfaces where they are consumed when that keeps the contract smaller.',
          'Interfaces are useful for package boundaries, tests, and replaceable dependencies.',
        ],
      },
    ],
  },
  {
    slug: 'go-embedding',
    title: 'Embedding & Composition',
    description:
      'Build larger Go types by composing smaller structs and interfaces instead of relying on inheritance.',
    level: 'intermediate',
    section: 'Stronger Go',
    order: 27,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Go does not have class inheritance. Instead, Go encourages composition: place one value inside another and give each type a clear responsibility.',
      },
      {
        type: 'p',
        text: 'Embedding is a shorthand for composition where the embedded field has no explicit field name. Its exported fields and methods are promoted to the outer type.',
      },
      { type: 'h2', text: 'Embed a struct' },
      {
        type: 'code',
        language: 'go',
        title: 'Promoting fields and methods',
        code: `package main

import "fmt"

type Contact struct {
	Email string
	Phone string
}

func (c Contact) Label() string {
	return c.Email + " / " + c.Phone
}

type Customer struct {
	ID int
	Contact
}

func main() {
	customer := Customer{
		ID: 101,
		Contact: Contact{
			Email: "grace@example.com",
			Phone: "555-0199",
		},
	}

	fmt.Println(customer.Email)
	fmt.Println(customer.Label())
}`,
      },
      {
        type: 'p',
        text: 'The Customer value still contains a Contact value. Promotion is syntax convenience, not inheritance. You can still access customer.Contact.Email when being explicit is clearer.',
      },
      { type: 'h2', text: 'Embed behavior' },
      {
        type: 'code',
        language: 'go',
        title: 'Composing a service with dependencies',
        code: `type Logger interface {
	Info(message string)
}

type UserService struct {
	Logger
}

func (s UserService) Create(email string) {
	s.Info("creating user " + email)
}`,
      },
      {
        type: 'warning',
        text: 'Avoid embedding only to save a few characters. If the relationship is not obvious, a named field such as Logger Logger can be easier to read.',
      },
      {
        type: 'tip',
        text: 'Use embedding when the outer type truly wants to expose the embedded type behavior as part of its own API.',
      },
      {
        type: 'try',
        text: 'Create an Address struct and embed it inside an Employee struct. Add a FullAddress method to Address and call it from an Employee value.',
      },
      {
        type: 'keypoints',
        items: [
          'Composition is the standard Go alternative to inheritance.',
          'Embedding promotes fields and methods from the embedded value.',
          'The embedded value still exists as a real field on the outer struct.',
          'Named fields are often clearer when you do not want to expose the dependency directly.',
        ],
      },
    ],
  },
  {
    slug: 'go-generics',
    title: 'Generics Basics',
    description:
      'Write reusable Go functions and types with type parameters while keeping constraints simple and readable.',
    level: 'intermediate',
    section: 'Stronger Go',
    order: 28,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Generics let you write functions and types that work with more than one concrete type while still keeping compile-time type safety.',
      },
      {
        type: 'p',
        text: 'Use generics when the algorithm is truly the same for several types. Do not use them just to avoid writing a clear concrete function.',
      },
      { type: 'h2', text: 'A generic function' },
      {
        type: 'code',
        language: 'go',
        title: 'Finding whether a slice contains a value',
        code: `package main

import "fmt"

func Contains[T comparable](items []T, target T) bool {
	for _, item := range items {
		if item == target {
			return true
		}
	}
	return false
}

func main() {
	fmt.Println(Contains([]string{"api", "worker", "web"}, "api"))
	fmt.Println(Contains([]int{10, 20, 30}, 25))
}`,
      },
      {
        type: 'p',
        text: 'T is a type parameter. The comparable constraint means values of T can be compared with == and !=.',
      },
      { type: 'h2', text: 'A generic type' },
      {
        type: 'code',
        language: 'go',
        title: 'A simple stack',
        code: `type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(item T) {
	s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, bool) {
	var zero T
	if len(s.items) == 0 {
		return zero, false
	}

	last := len(s.items) - 1
	item := s.items[last]
	s.items = s.items[:last]
	return item, true
}`,
      },
      {
        type: 'note',
        text: 'The any constraint is an alias for interface{}. It means the generic code does not require any specific operations on the type.',
      },
      {
        type: 'tip',
        text: 'Start with standard constraints such as any and comparable. Create custom constraints only when the operations inside the function require them.',
      },
      {
        type: 'try',
        text: 'Write a generic First[T any](items []T) (T, bool) function that returns the first item and false when the slice is empty.',
      },
      {
        type: 'keypoints',
        items: [
          'Generics use type parameters such as T inside square brackets.',
          'Constraints describe what operations are allowed on a type parameter.',
          'comparable is required when generic values are compared with ==.',
          'Use generics for shared algorithms, not as a replacement for simple concrete code.',
        ],
      },
    ],
  },
  {
    slug: 'go-goroutines',
    title: 'Goroutines',
    description:
      'Run functions concurrently with goroutines and understand how lightweight concurrent work differs from parallel execution.',
    level: 'intermediate',
    section: 'Concurrency',
    order: 29,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A goroutine is a lightweight concurrent execution path managed by the Go runtime. Start one by placing the go keyword before a function call.',
      },
      {
        type: 'p',
        text: 'Concurrency means dealing with multiple tasks in progress. Parallelism means executing multiple tasks at the same instant. Goroutines make concurrency easy, and the runtime decides how work maps to operating system threads.',
      },
      { type: 'h2', text: 'Start a goroutine' },
      {
        type: 'code',
        language: 'go',
        title: 'Running work in the background',
        code: `package main

import (
	"fmt"
	"time"
)

func sendEmail(to string) {
	time.Sleep(500 * time.Millisecond)
	fmt.Println("sent email to", to)
}

func main() {
	go sendEmail("ada@example.com")

	fmt.Println("request finished")
	time.Sleep(time.Second)
}`,
      },
      {
        type: 'p',
        text: 'The sleep at the end keeps main alive long enough for the example goroutine to finish. Real programs usually use synchronization tools such as WaitGroup, channels, or context cancellation.',
      },
      { type: 'h2', text: 'Capture loop variables carefully' },
      {
        type: 'code',
        language: 'go',
        title: 'Pass values into the goroutine',
        code: `users := []string{"ada", "grace", "linus"}

for _, user := range users {
	user := user
	go func() {
		fmt.Println("processing", user)
	}()
}`,
      },
      {
        type: 'note',
        text: 'In modern Go, range loop variables are safer than they used to be, but passing values explicitly or shadowing them still makes the goroutine boundary obvious.',
      },
      {
        type: 'tip',
        text: 'A goroutine should have a clear lifetime. Know what starts it, what stops it, and where errors are reported.',
      },
      {
        type: 'try',
        text: 'Start three goroutines that print different task names, then replace time.Sleep with a sync.WaitGroup after you learn the sync lesson.',
      },
      {
        type: 'keypoints',
        items: [
          'Use go functionCall() to start a goroutine.',
          'The main goroutine exiting stops the program, even if other goroutines are still running.',
          'Coordinate goroutines with channels, WaitGroup, Mutex, or context depending on the problem.',
          'Design goroutines with explicit ownership and shutdown behavior.',
        ],
      },
    ],
  },
  {
    slug: 'go-channels',
    title: 'Channels',
    description:
      'Communicate between goroutines with channels, including sends, receives, buffering, closing, and range loops.',
    level: 'intermediate',
    section: 'Concurrency',
    order: 30,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Channels let goroutines communicate by sending and receiving typed values. They are often used to pass results, stream work, or signal completion.',
      },
      {
        type: 'p',
        text: 'An unbuffered channel synchronizes sender and receiver: the send waits until another goroutine receives. A buffered channel can hold a limited number of values before senders block.',
      },
      { type: 'h2', text: 'Send and receive a value' },
      {
        type: 'code',
        language: 'go',
        title: 'Returning a result through a channel',
        code: `package main

import "fmt"

func calculateTotal(prices []int, result chan int) {
	total := 0
	for _, price := range prices {
		total += price
	}
	result <- total
}

func main() {
	result := make(chan int)

	go calculateTotal([]int{20, 35, 45}, result)

	total := <-result
	fmt.Println("total:", total)
}`,
      },
      { type: 'h2', text: 'Close a channel when sending is done' },
      {
        type: 'code',
        language: 'go',
        title: 'Ranging over received values',
        code: `func produceJobs(jobs chan<- string) {
	defer close(jobs)

	for _, job := range []string{"email", "report", "backup"} {
		jobs <- job
	}
}

func main() {
	jobs := make(chan string)
	go produceJobs(jobs)

	for job := range jobs {
		fmt.Println("received job:", job)
	}
}`,
      },
      {
        type: 'note',
        text: 'The sender closes the channel to say no more values are coming. Receivers should not close a channel they do not own.',
      },
      {
        type: 'tip',
        text: 'Use directional channel parameters, such as chan<- string or <-chan string, to document whether a function sends, receives, or both.',
      },
      {
        type: 'try',
        text: 'Create a jobs channel and a results channel. Start one worker goroutine that reads jobs, uppercases each job name, and sends the result back.',
      },
      {
        type: 'keypoints',
        items: [
          'Channels carry values of one declared type.',
          'Unbuffered channels synchronize senders and receivers.',
          'Buffered channels allow limited queueing.',
          'Close channels from the sending side when no more values will be sent.',
        ],
      },
    ],
  },
  {
    slug: 'go-select',
    title: 'select Statements',
    description:
      'Wait on multiple channel operations and implement timeouts, cancellation, and non-blocking communication.',
    level: 'intermediate',
    section: 'Concurrency',
    order: 31,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'The select statement waits for one of several channel operations to become ready. It looks like switch, but each case is a send or receive.',
      },
      {
        type: 'p',
        text: 'select is the foundation of many Go concurrency patterns: timeouts, cancellation, fan-in, worker coordination, and graceful shutdown.',
      },
      { type: 'h2', text: 'Handle whichever result arrives first' },
      {
        type: 'code',
        language: 'go',
        title: 'Selecting between two channels',
        code: `package main

import (
	"fmt"
	"time"
)

func fetch(name string, delay time.Duration) <-chan string {
	ch := make(chan string)
	go func() {
		defer close(ch)
		time.Sleep(delay)
		ch <- name + " finished"
	}()
	return ch
}

func main() {
	api := fetch("api", 300*time.Millisecond)
	cache := fetch("cache", 100*time.Millisecond)

	select {
	case result := <-api:
		fmt.Println(result)
	case result := <-cache:
		fmt.Println(result)
	}
}`,
      },
      { type: 'h2', text: 'Add a timeout' },
      {
        type: 'code',
        language: 'go',
        title: 'Using time.After',
        code: `select {
case result := <-api:
	fmt.Println("success:", result)
case <-time.After(200 * time.Millisecond):
	fmt.Println("request timed out")
}`,
      },
      {
        type: 'warning',
        text: 'A default case makes select non-blocking. Use it carefully, because a loop with default can spin quickly and waste CPU.',
      },
      {
        type: 'tip',
        text: 'For request-scoped cancellation, prefer context.Context. For small examples and simple timeouts, time.After is useful.',
      },
      {
        type: 'try',
        text: 'Create two channels that send different strings after different delays. Use select to print the first result or a timeout message.',
      },
      {
        type: 'keypoints',
        items: [
          'select waits until one channel operation can proceed.',
          'If multiple cases are ready, Go chooses one pseudo-randomly.',
          'time.After can add a timeout case.',
          'default makes select non-blocking and should be used intentionally.',
        ],
      },
    ],
  },
  {
    slug: 'go-sync',
    title: 'sync Package (WaitGroup, Mutex)',
    description:
      'Coordinate goroutines with sync.WaitGroup and protect shared data with sync.Mutex.',
    level: 'intermediate',
    section: 'Concurrency',
    order: 32,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'The sync package contains primitives for coordinating goroutines. Two essentials are WaitGroup for waiting and Mutex for protecting shared memory.',
      },
      {
        type: 'p',
        text: 'Channels are great for communication. Mutexes are useful when several goroutines must safely access the same in-memory value.',
      },
      { type: 'h2', text: 'Wait for goroutines to finish' },
      {
        type: 'code',
        language: 'go',
        title: 'sync.WaitGroup',
        code: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	users := []string{"ada", "grace", "linus"}

	for _, user := range users {
		user := user
		wg.Add(1)

		go func() {
			defer wg.Done()
			fmt.Println("processed", user)
		}()
	}

	wg.Wait()
	fmt.Println("all users processed")
}`,
      },
      { type: 'h2', text: 'Protect shared state' },
      {
        type: 'code',
        language: 'go',
        title: 'sync.Mutex',
        code: `type Counter struct {
	mu    sync.Mutex
	value int
}

func (c *Counter) Add(n int) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.value += n
}

func (c *Counter) Value() int {
	c.mu.Lock()
	defer c.mu.Unlock()

	return c.value
}`,
      },
      {
        type: 'note',
        text: 'Call wg.Add before starting the goroutine. Calling Add from inside the goroutine can race with Wait.',
      },
      {
        type: 'tip',
        text: 'Keep mutex-protected sections small. Lock, update or read the shared value, then unlock promptly.',
      },
      {
        type: 'try',
        text: 'Build a safe counter, start 100 goroutines that each call Add(1), wait for them, and print the final value.',
      },
      {
        type: 'keypoints',
        items: [
          'WaitGroup waits for a collection of goroutines to finish.',
          'Use defer wg.Done() at the top of the goroutine body.',
          'Mutex protects shared memory from data races.',
          'Run go test -race or go run -race during development to detect many race conditions.',
        ],
      },
    ],
  },
  {
    slug: 'go-context',
    title: 'context Package',
    description:
      'Use context.Context to carry cancellation, deadlines, and request-scoped values through Go programs.',
    level: 'intermediate',
    section: 'Concurrency',
    order: 33,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'The context package helps coordinate cancellation and deadlines across API boundaries. HTTP servers, clients, database calls, and many libraries accept context.Context.',
      },
      {
        type: 'p',
        text: 'A context is usually the first parameter of a function when the operation may block, perform I/O, or need cancellation.',
      },
      { type: 'h2', text: 'Cancel work with a timeout' },
      {
        type: 'code',
        language: 'go',
        title: 'Using context.WithTimeout',
        code: `package main

import (
	"context"
	"fmt"
	"time"
)

func slowOperation(ctx context.Context) error {
	select {
	case <-time.After(2 * time.Second):
		fmt.Println("operation complete")
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	if err := slowOperation(ctx); err != nil {
		fmt.Println("failed:", err)
	}
}`,
      },
      { type: 'h2', text: 'Pass context through layers' },
      {
        type: 'code',
        language: 'go',
        title: 'Context-first function signatures',
        code: `func GetUser(ctx context.Context, id int) (User, error) {
	row := db.QueryRowContext(ctx, "select id, email from users where id = $1", id)

	var user User
	err := row.Scan(&user.ID, &user.Email)
	return user, err
}`,
      },
      {
        type: 'warning',
        text: 'Do not store context.Context in a struct for ordinary request work. Pass it as an argument so cancellation follows the call chain clearly.',
      },
      {
        type: 'tip',
        text: 'Use context values sparingly for request-scoped metadata such as request IDs. Do not use context as a general parameter bag.',
      },
      {
        type: 'try',
        text: 'Write a function that waits for either a simulated 1 second task or ctx.Done. Call it with context.WithTimeout using a 200 millisecond timeout.',
      },
      {
        type: 'keypoints',
        items: [
          'context.Context carries cancellation and deadlines.',
          'Use context.Background at program roots and request.Context inside HTTP handlers.',
          'Always call the cancel function returned by WithCancel, WithTimeout, or WithDeadline.',
          'Pass context as the first parameter for blocking or request-scoped operations.',
        ],
      },
    ],
  },
  {
    slug: 'go-testing',
    title: 'Testing with testing package',
    description:
      'Write focused Go unit tests using the standard testing package, test file naming, and helpful assertions.',
    level: 'intermediate',
    section: 'Quality',
    order: 34,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Go includes a standard testing package and a test runner in the go command. Test files end with _test.go, and test functions start with Test.',
      },
      {
        type: 'p',
        text: 'A good unit test is small, deterministic, and clear about the behavior it protects. You can test exported and unexported functions from the same package.',
      },
      { type: 'h2', text: 'Code to test' },
      {
        type: 'code',
        language: 'go',
        title: 'cart.go',
        code: `package cart

import "fmt"

func Discount(total float64, percent float64) (float64, error) {
	if total < 0 {
		return 0, fmt.Errorf("total cannot be negative")
	}
	if percent < 0 || percent > 100 {
		return 0, fmt.Errorf("percent must be between 0 and 100")
	}

	return total * (1 - percent/100), nil
}`,
      },
      {
        type: 'code',
        language: 'go',
        title: 'cart_test.go',
        code: `package cart

import "testing"

func TestDiscount(t *testing.T) {
	got, err := Discount(100, 15)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	want := 85.0
	if got != want {
		t.Fatalf("Discount(100, 15) = %v, want %v", got, want)
	}
}

func TestDiscountRejectsInvalidPercent(t *testing.T) {
	_, err := Discount(100, 120)
	if err == nil {
		t.Fatal("expected an error for invalid percent")
	}
}`,
      },
      { type: 'h2', text: 'Run tests' },
      {
        type: 'code',
        language: 'bash',
        title: 'Common test commands',
        code: `go test ./...
go test -v ./...
go test ./cart`,
      },
      {
        type: 'note',
        text: 'Use t.Fatal or t.Fatalf when the test cannot continue. Use t.Error or t.Errorf when you want the test to report a failure and keep checking more conditions.',
      },
      {
        type: 'tip',
        text: 'Make failure messages explain the call, the actual value, and the expected value. Future you will read those messages first.',
      },
      {
        type: 'try',
        text: 'Create a Multiply(a, b int) int function and write two tests: one for positive numbers and one for multiplying by zero.',
      },
      {
        type: 'keypoints',
        items: [
          'Go tests live in files ending with _test.go.',
          'Test functions are named TestSomething and receive *testing.T.',
          'go test ./... runs tests in the current module and subpackages.',
          'Clear failure messages make tests easier to maintain.',
        ],
      },
    ],
  },
  {
    slug: 'go-table-tests',
    title: 'Table-Driven Tests',
    description:
      'Use table-driven tests to cover many inputs clearly with less repetition and better failure names.',
    level: 'intermediate',
    section: 'Quality',
    order: 35,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Table-driven tests are a Go testing style where each test case is a row in a slice. The test loops over the rows and runs the same checks for each input.',
      },
      {
        type: 'p',
        text: 'This approach is useful when a function has many input and output combinations: parsing, validation, formatting, business rules, and edge cases.',
      },
      { type: 'h2', text: 'Create a test table' },
      {
        type: 'code',
        language: 'go',
        title: 'Testing several cases',
        code: `package slug

import (
	"strings"
	"testing"
)

func Normalize(input string) string {
	return strings.ToLower(strings.TrimSpace(input))
}

func TestNormalize(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{name: "lowercase already", input: "api", want: "api"},
		{name: "trims spaces", input: "  Worker  ", want: "worker"},
		{name: "empty string", input: "", want: ""},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			got := Normalize(tt.input)
			if got != tt.want {
				t.Fatalf("Normalize(%q) = %q, want %q", tt.input, got, tt.want)
			}
		})
	}
}`,
      },
      {
        type: 'note',
        text: 'The example needs imports for strings and testing in a real file. Keep examples complete in your codebase so tests can run directly.',
      },
      { type: 'h2', text: 'Test errors too' },
      {
        type: 'code',
        language: 'go',
        title: 'Include expected errors in the table',
        code: `tests := []struct {
	name    string
	age     int
	wantErr bool
}{
	{name: "adult", age: 35, wantErr: false},
	{name: "negative", age: -1, wantErr: true},
}

for _, tt := range tests {
	t.Run(tt.name, func(t *testing.T) {
		err := ValidateAge(tt.age)
		if (err != nil) != tt.wantErr {
			t.Fatalf("ValidateAge(%d) error = %v, wantErr %v", tt.age, err, tt.wantErr)
		}
	})
}`,
      },
      {
        type: 'tip',
        text: 'Give every table row a name. Named subtests make failures easy to identify with go test -run.',
      },
      {
        type: 'try',
        text: 'Write table-driven tests for an IsValidUsername function with empty, short, valid, and too-long usernames.',
      },
      {
        type: 'keypoints',
        items: [
          'A table test stores cases in a slice of structs.',
          't.Run creates named subtests for each case.',
          'Table tests reduce repetition while making edge cases visible.',
          'Add wantErr or expected error fields when testing validation behavior.',
        ],
      },
    ],
  },
  {
    slug: 'go-benchmarks',
    title: 'Benchmarks & Coverage Basics',
    description:
      'Measure Go code with benchmarks and use coverage reports to see which lines your tests execute.',
    level: 'intermediate',
    section: 'Quality',
    order: 36,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Benchmarks measure how fast code runs under the Go test runner. Coverage reports show which statements were executed by tests.',
      },
      {
        type: 'p',
        text: 'Use benchmarks to compare realistic alternatives, not to guess at performance. Use coverage to find untested branches, not as the only measure of quality.',
      },
      { type: 'h2', text: 'Write a benchmark' },
      {
        type: 'code',
        language: 'go',
        title: 'Benchmark function naming',
        code: `package format

import (
	"strings"
	"testing"
)

func JoinTags(tags []string) string {
	return strings.Join(tags, ",")
}

func BenchmarkJoinTags(b *testing.B) {
	tags := []string{"go", "api", "database", "testing"}

	for i := 0; i < b.N; i++ {
		_ = JoinTags(tags)
	}
}`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Run benchmarks and coverage',
        code: `go test -bench=. ./...
go test -cover ./...
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out`,
      },
      { type: 'h2', text: 'Avoid benchmark traps' },
      {
        type: 'ul',
        items: [
          'Keep setup outside the timed loop when possible.',
          'Use b.ReportAllocs() when allocations matter.',
          'Benchmark realistic input sizes, not only tiny examples.',
          'Compare benchmark results with benchstat when making performance changes.',
        ],
      },
      {
        type: 'note',
        text: 'The testing package chooses b.N automatically. Your benchmark loop must run the code under test exactly b.N times.',
      },
      {
        type: 'tip',
        text: 'Coverage can be high while important behavior is still untested. Read tests for meaningful assertions, not only coverage percentages.',
      },
      {
        type: 'try',
        text: 'Write two functions that build a comma-separated string: one with string concatenation and one with strings.Builder. Benchmark both with the same input.',
      },
      {
        type: 'keypoints',
        items: [
          'Benchmark functions start with Benchmark and receive *testing.B.',
          'The benchmarked operation belongs inside for i := 0; i < b.N; i++.',
          'go test -bench=. runs benchmarks.',
          'Coverage reports show executed statements but do not prove behavior is correct.',
        ],
      },
    ],
  },
  {
    slug: 'go-json',
    title: 'JSON Encoding & Decoding',
    description:
      'Convert Go structs to and from JSON using encoding/json, struct tags, streams, and validation checks.',
    level: 'intermediate',
    section: 'Data & I/O',
    order: 37,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'JSON is the most common format for web APIs. Go provides encoding/json in the standard library for encoding Go values and decoding JSON input.',
      },
      {
        type: 'p',
        text: 'Struct tags control JSON field names. Exported struct fields can be encoded and decoded; unexported fields are ignored.',
      },
      { type: 'h2', text: 'Encode a struct' },
      {
        type: 'code',
        language: 'go',
        title: 'json.Marshal',
        code: `package main

import (
	"encoding/json"
	"fmt"
)

type User struct {
	ID    int    \`json:"id"\`
	Email string \`json:"email"\`
	Admin bool   \`json:"admin,omitempty"\`
}

func main() {
	user := User{ID: 1, Email: "ada@example.com"}

	data, err := json.Marshal(user)
	if err != nil {
		panic(err)
	}

	fmt.Println(string(data))
}`,
      },
      { type: 'h2', text: 'Decode request data' },
      {
        type: 'code',
        language: 'go',
        title: 'json.Decoder',
        code: `type CreateUserRequest struct {
	Email string \`json:"email"\`
	Name  string \`json:"name"\`
}

func decodeCreateUser(body io.Reader) (CreateUserRequest, error) {
	var req CreateUserRequest

	decoder := json.NewDecoder(body)
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(&req); err != nil {
		return CreateUserRequest{}, err
	}
	if req.Email == "" {
		return CreateUserRequest{}, fmt.Errorf("email is required")
	}

	return req, nil
}`,
      },
      {
        type: 'code',
        language: 'json',
        title: 'Example JSON body',
        code: `{
  "email": "grace@example.com",
  "name": "Grace Hopper"
}`,
      },
      {
        type: 'note',
        text: 'json.Decoder is useful for streams such as HTTP request bodies. json.Unmarshal is convenient when you already have a []byte.',
      },
      {
        type: 'tip',
        text: 'Check decoded input after parsing. JSON decoding confirms shape, but your application still owns validation rules.',
      },
      {
        type: 'try',
        text: 'Define a Product struct with id, name, price, and in_stock JSON fields. Decode a JSON string into it and print a validation error if price is negative.',
      },
      {
        type: 'keypoints',
        items: [
          'encoding/json is the standard library package for JSON.',
          'Struct tags such as json:"email" control field names.',
          'Only exported fields are encoded and decoded.',
          'Validate decoded values before trusting input.',
        ],
      },
    ],
  },
  {
    slug: 'go-files',
    title: 'Working with Files',
    description:
      'Read, write, append, and scan files using os, io, bufio, and path/filepath from the standard library.',
    level: 'intermediate',
    section: 'Data & I/O',
    order: 38,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Go file work starts with the standard library. The os package handles files and permissions, io provides helpers, bufio adds buffered reading, and filepath builds safe paths.',
      },
      {
        type: 'p',
        text: 'For small files, os.ReadFile and os.WriteFile are simple. For large files or streams, use os.Open with bufio.Scanner or io.Copy.',
      },
      { type: 'h2', text: 'Read and write a small file' },
      {
        type: 'code',
        language: 'go',
        title: 'os.ReadFile and os.WriteFile',
        code: `package main

import (
	"fmt"
	"os"
	"path/filepath"
)

func main() {
	path := filepath.Join("data", "message.txt")

	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		panic(err)
	}

	if err := os.WriteFile(path, []byte("hello files\\n"), 0644); err != nil {
		panic(err)
	}

	data, err := os.ReadFile(path)
	if err != nil {
		panic(err)
	}

	fmt.Print(string(data))
}`,
      },
      { type: 'h2', text: 'Scan a file line by line' },
      {
        type: 'code',
        language: 'go',
        title: 'bufio.Scanner',
        code: `file, err := os.Open("access.log")
if err != nil {
	return err
}
defer file.Close()

scanner := bufio.NewScanner(file)
for scanner.Scan() {
	line := scanner.Text()
	fmt.Println("line:", line)
}

if err := scanner.Err(); err != nil {
	return err
}`,
      },
      {
        type: 'note',
        text: 'Always check errors from file operations. Missing files, permissions, disk limits, and partial writes are normal runtime conditions.',
      },
      {
        type: 'tip',
        text: 'Use filepath.Join instead of manual string concatenation so paths work across operating systems.',
      },
      {
        type: 'try',
        text: 'Write a small program that appends a timestamped line to app.log, then reads the file back and prints each line.',
      },
      {
        type: 'keypoints',
        items: [
          'os.ReadFile and os.WriteFile are best for small files.',
          'Use os.Open plus bufio.Scanner for line-by-line reading.',
          'defer file.Close after a successful open.',
          'filepath.Join builds paths safely for different platforms.',
        ],
      },
    ],
  },
  {
    slug: 'go-http-client',
    title: 'HTTP Client',
    description:
      'Make outbound HTTP requests with net/http, timeouts, context, headers, JSON decoding, and response handling.',
    level: 'intermediate',
    section: 'Networking',
    order: 39,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Go includes a strong HTTP client in net/http. Production code should use a client with timeouts, pass context, check status codes, and close response bodies.',
      },
      {
        type: 'p',
        text: 'The package-level http.Get is fine for quick experiments, but a configured http.Client is better for services and command-line tools.',
      },
      { type: 'h2', text: 'GET JSON from an API' },
      {
        type: 'code',
        language: 'go',
        title: 'HTTP client with timeout and JSON decoding',
        code: `package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Todo struct {
	ID        int    \`json:"id"\`
	Title     string \`json:"title"\`
	Completed bool   \`json:"completed"\`
}

func FetchTodo(ctx context.Context, client *http.Client, id int) (Todo, error) {
	url := fmt.Sprintf("https://jsonplaceholder.typicode.com/todos/%d", id)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return Todo{}, err
	}
	req.Header.Set("Accept", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return Todo{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return Todo{}, fmt.Errorf("unexpected status: %s", resp.Status)
	}

	var todo Todo
	if err := json.NewDecoder(resp.Body).Decode(&todo); err != nil {
		return Todo{}, err
	}

	return todo, nil
}

func main() {
	client := &http.Client{Timeout: 5 * time.Second}
	ctx := context.Background()

	todo, err := FetchTodo(ctx, client, 1)
	if err != nil {
		panic(err)
	}

	fmt.Println(todo.Title)
}`,
      },
      {
        type: 'note',
        text: 'Always close resp.Body after a successful client.Do call. This lets the transport reuse connections.',
      },
      {
        type: 'tip',
        text: 'Pass an *http.Client into functions instead of creating one everywhere. It is safe to reuse and easy to replace in tests.',
      },
      {
        type: 'try',
        text: 'Write a PostJSON function that sends a JSON body with http.MethodPost, sets Content-Type, and decodes a JSON response.',
      },
      {
        type: 'keypoints',
        items: [
          'Use net/http for standard HTTP client work.',
          'Configure timeouts on http.Client for production code.',
          'Use http.NewRequestWithContext to support cancellation.',
          'Check status codes and close response bodies.',
        ],
      },
    ],
  },
  {
    slug: 'go-http-server',
    title: 'net/http Server Basics',
    description:
      'Create HTTP handlers, write responses, parse requests, and run a server with sensible timeouts.',
    level: 'intermediate',
    section: 'Networking',
    order: 40,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'The net/http package can build real web servers without a framework. A handler receives an http.ResponseWriter and an *http.Request.',
      },
      {
        type: 'p',
        text: 'Handlers should validate input, return clear status codes, and avoid writing a response twice. Configure server timeouts for internet-facing services.',
      },
      { type: 'h2', text: 'A small HTTP server' },
      {
        type: 'code',
        language: 'go',
        title: 'Serving JSON with net/http',
        code: `package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type HealthResponse struct {
	Status string \`json:"status"\`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(HealthResponse{Status: "ok"})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)

	server := &http.Server{
		Addr:         ":8080",
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Fatal(server.ListenAndServe())
}`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Try the endpoint',
        code: `curl http://localhost:8080/health`,
      },
      {
        type: 'note',
        text: 'Set headers before writing the body. Once bytes are written, Go sends the status code and headers.',
      },
      {
        type: 'tip',
        text: 'Use http.NewServeMux for standard routing first. Popular routers such as chi and gin add features, but the standard library is enough for many APIs.',
      },
      {
        type: 'try',
        text: 'Add a GET /time endpoint that returns JSON with the current UTC time in RFC3339 format.',
      },
      {
        type: 'keypoints',
        items: [
          'An HTTP handler has the shape func(http.ResponseWriter, *http.Request).',
          'http.NewServeMux maps paths to handlers.',
          'Use status codes to communicate success and failure.',
          'Configure ReadTimeout, WriteTimeout, and IdleTimeout on production servers.',
        ],
      },
    ],
  },
  {
    slug: 'go-routing',
    title: 'Routing Patterns',
    description:
      'Organize routes with ServeMux, method checks, path parameters, route groups, and lightweight router libraries.',
    level: 'intermediate',
    section: 'Networking',
    order: 41,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Routing maps an HTTP request to the correct handler. With the standard library, http.ServeMux handles paths and each handler can check the method and parse path values.',
      },
      {
        type: 'p',
        text: 'For larger APIs, routers such as chi and gin can reduce boilerplate, add route groups, and provide middleware helpers. Learn the standard pattern first so frameworks feel predictable.',
      },
      { type: 'h2', text: 'Method and path routing with ServeMux' },
      {
        type: 'code',
        language: 'go',
        title: 'Go 1.22 style method patterns',
        code: `mux := http.NewServeMux()

mux.HandleFunc("GET /users", listUsers)
mux.HandleFunc("POST /users", createUser)
mux.HandleFunc("GET /users/{id}", getUser)

func getUser(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "missing user id", http.StatusBadRequest)
		return
	}

	w.Write([]byte("user " + id))
}`,
      },
      { type: 'h2', text: 'Older compatible pattern' },
      {
        type: 'code',
        language: 'go',
        title: 'Manual method checks',
        code: `mux.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		listUsers(w, r)
	case http.MethodPost:
		createUser(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
})`,
      },
      {
        type: 'note',
        text: 'Go 1.22 added method-aware patterns and path variables to ServeMux. If your project targets older Go versions, use manual parsing or a router library.',
      },
      {
        type: 'tip',
        text: 'Group route registration in one function, such as routes(api *API) http.Handler, so main stays focused on configuration and startup.',
      },
      {
        type: 'try',
        text: 'Register GET /products, POST /products, and GET /products/{id}. Return a simple text response from each route.',
      },
      {
        type: 'keypoints',
        items: [
          'Routing connects paths and methods to handler functions.',
          'ServeMux is enough for many small and medium APIs.',
          'Go 1.22 ServeMux supports method patterns and path values.',
          'chi and gin are popular choices when you need extra routing features.',
        ],
      },
    ],
  },
  {
    slug: 'go-middleware',
    title: 'Middleware Patterns',
    description:
      'Wrap HTTP handlers to add logging, recovery, authentication checks, request IDs, and shared behavior.',
    level: 'intermediate',
    section: 'Networking',
    order: 42,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Middleware is code that runs before or after a handler. In Go, middleware commonly accepts an http.Handler and returns a new http.Handler.',
      },
      {
        type: 'p',
        text: 'Use middleware for cross-cutting concerns: logging, panic recovery, authentication checks, CORS, compression, and request IDs.',
      },
      { type: 'h2', text: 'Write logging middleware' },
      {
        type: 'code',
        language: 'go',
        title: 'Wrapping an http.Handler',
        code: `package main

import (
	"log/slog"
	"net/http"
	"time"
)

func Logging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		next.ServeHTTP(w, r)

		slog.Info("request completed",
			"method", r.Method,
			"path", r.URL.Path,
			"duration", time.Since(start).String(),
		)
	})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello"))
	})

	http.ListenAndServe(":8080", Logging(mux))
}`,
      },
      { type: 'h2', text: 'Chain middleware' },
      {
        type: 'code',
        language: 'go',
        title: 'A small chain helper',
        code: `type Middleware func(http.Handler) http.Handler

func Chain(h http.Handler, middleware ...Middleware) http.Handler {
	for i := len(middleware) - 1; i >= 0; i-- {
		h = middleware[i](h)
	}
	return h
}`,
      },
      {
        type: 'note',
        text: 'If middleware needs to stop the request, it should write the response and return without calling next.ServeHTTP.',
      },
      {
        type: 'tip',
        text: 'Keep middleware focused. A small Auth middleware is easier to test and reuse than one function that logs, authenticates, and mutates many values.',
      },
      {
        type: 'try',
        text: 'Write middleware that checks for an X-API-Key header. If it is missing, return 401. If it exists, call the next handler.',
      },
      {
        type: 'keypoints',
        items: [
          'Go middleware usually wraps http.Handler.',
          'Call next.ServeHTTP to pass control to the next handler.',
          'Middleware can add behavior before and after the handler runs.',
          'Use middleware for shared HTTP concerns instead of duplicating code in handlers.',
        ],
      },
    ],
  },
  {
    slug: 'go-rest-api',
    title: 'Building a REST API',
    description:
      'Combine routing, JSON, validation, handlers, and status codes to build a small REST API in Go.',
    level: 'intermediate',
    section: 'Networking',
    order: 43,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'A REST API exposes resources through URLs and HTTP methods. For example, GET /tasks lists tasks and POST /tasks creates a task.',
      },
      {
        type: 'p',
        text: 'Good APIs are consistent: parse JSON carefully, validate input, return appropriate status codes, and use a predictable error shape.',
      },
      { type: 'h2', text: 'A tiny in-memory task API' },
      {
        type: 'code',
        language: 'go',
        title: 'REST handlers with JSON',
        code: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
)

type Task struct {
	ID    int    \`json:"id"\`
	Title string \`json:"title"\`
	Done  bool   \`json:"done"\`
}

type API struct {
	mu     sync.Mutex
	nextID int
	tasks  []Task
}

func (api *API) listTasks(w http.ResponseWriter, r *http.Request) {
	api.mu.Lock()
	defer api.mu.Unlock()

	writeJSON(w, http.StatusOK, api.tasks)
}

func (api *API) createTask(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title string \`json:"title"\`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON")
		return
	}
	if input.Title == "" {
		writeError(w, http.StatusBadRequest, "title is required")
		return
	}

	api.mu.Lock()
	defer api.mu.Unlock()

	api.nextID++
	task := Task{ID: api.nextID, Title: input.Title}
	api.tasks = append(api.tasks, task)

	writeJSON(w, http.StatusCreated, task)
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(value)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func main() {
	api := &API{}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /tasks", api.listTasks)
	mux.HandleFunc("POST /tasks", api.createTask)

	fmt.Println("listening on :8080")
	http.ListenAndServe(":8080", mux)
}`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Create and list tasks',
        code: `curl -X POST http://localhost:8080/tasks \\
  -H "Content-Type: application/json" \\
  -d '{"title":"write tests"}'

curl http://localhost:8080/tasks`,
      },
      {
        type: 'note',
        text: 'This example uses in-memory storage so the API shape stays visible. A real service would move persistence into a separate store type and add graceful shutdown.',
      },
      {
        type: 'tip',
        text: 'Keep handlers thin: decode input, call application logic, then encode a response. This makes business logic easier to test without HTTP.',
      },
      {
        type: 'try',
        text: 'Add GET /tasks/{id}. Parse the id path value, find the task, return 404 when it does not exist, and return JSON when it does.',
      },
      {
        type: 'keypoints',
        items: [
          'REST APIs model resources with paths and HTTP methods.',
          'Use JSON request and response bodies consistently.',
          'Return meaningful status codes such as 201, 400, 404, and 500.',
          'Separate handler code from storage and business rules as the API grows.',
        ],
      },
    ],
  },
  {
    slug: 'go-sql-database',
    title: 'database/sql Basics',
    description:
      'Use the standard database/sql package for connections, queries, commands, rows, scanning, and transactions.',
    level: 'intermediate',
    section: 'Persistence',
    order: 44,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'The database/sql package defines a common interface for SQL databases. You use it with a database driver such as a PostgreSQL, MySQL, or SQLite driver.',
      },
      {
        type: 'p',
        text: '*sql.DB is a pool of connections, not a single connection. Create one for your application, reuse it, and close it during shutdown.',
      },
      { type: 'h2', text: 'Open and ping a database' },
      {
        type: 'code',
        language: 'go',
        title: 'database/sql setup',
        code: `package main

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"
)

func OpenDB(ctx context.Context, dsn string) (*sql.DB, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(time.Hour)

	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, err
	}

	return db, nil
}

func main() {
	ctx := context.Background()
	db, err := OpenDB(ctx, "postgres://user:pass@localhost:5432/app?sslmode=disable")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	fmt.Println("database connected")
}`,
      },
      { type: 'h2', text: 'Query and scan rows' },
      {
        type: 'code',
        language: 'go',
        title: 'QueryContext and Scan',
        code: `type User struct {
	ID    int
	Email string
}

func ListUsers(ctx context.Context, db *sql.DB) ([]User, error) {
	rows, err := db.QueryContext(ctx, "select id, email from users order by id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.ID, &user.Email); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}`,
      },
      {
        type: 'code',
        language: 'sql',
        title: 'Example table',
        code: `create table users (
  id bigserial primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);`,
      },
      {
        type: 'note',
        text: 'Use parameter placeholders instead of building SQL with string concatenation. Placeholder syntax depends on the driver: PostgreSQL commonly uses $1, $2, and so on.',
      },
      {
        type: 'tip',
        text: 'Keep SQL access behind a small store or repository type. Handlers can then depend on methods such as ListUsers instead of raw SQL.',
      },
      {
        type: 'try',
        text: 'Write a CreateUser(ctx, db, email) function that inserts a user with ExecContext or QueryRowContext and returns the new id.',
      },
      {
        type: 'keypoints',
        items: [
          'database/sql provides common SQL database APIs.',
          '*sql.DB is a connection pool and should be reused.',
          'Use context-aware methods such as QueryContext and ExecContext.',
          'Always close rows and check rows.Err after iteration.',
        ],
      },
    ],
  },
  {
    slug: 'go-postgres-go',
    title: 'PostgreSQL with Go',
    description:
      'Connect Go applications to PostgreSQL using environment-based connection strings, migrations, queries, and safe configuration.',
    level: 'intermediate',
    section: 'Persistence',
    order: 45,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'PostgreSQL is a common production database for Go services. You can use database/sql with a PostgreSQL driver or the popular pgx driver and toolkit.',
      },
      {
        type: 'p',
        text: 'Keep connection strings in environment variables or a secret manager. Do not hard-code real usernames, passwords, or hostnames into source files.',
      },
      { type: 'h2', text: 'Read the connection string from the environment' },
      {
        type: 'code',
        language: 'bash',
        title: 'Local development variable',
        code: `export DATABASE_URL="postgres://app_user:local_password@localhost:5432/app_dev?sslmode=disable"
go run ./cmd/api`,
      },
      {
        type: 'code',
        language: 'go',
        title: 'Connect using database/sql and lib/pq',
        code: `package main

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"time"

	_ "github.com/lib/pq"
)

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		panic("DATABASE_URL is required")
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		panic(err)
	}

	fmt.Println("connected to PostgreSQL")
}`,
      },
      { type: 'h2', text: 'Use placeholders and migrations' },
      {
        type: 'code',
        language: 'sql',
        title: 'A simple migration',
        code: `create table if not exists notes (
  id bigserial primary key,
  body text not null,
  created_at timestamptz not null default now()
);`,
      },
      {
        type: 'code',
        language: 'go',
        title: 'Insert safely with parameters',
        code: `func CreateNote(ctx context.Context, db *sql.DB, body string) (int64, error) {
	var id int64
	err := db.QueryRowContext(
		ctx,
		"insert into notes (body) values ($1) returning id",
		body,
	).Scan(&id)
	return id, err
}`,
      },
      {
        type: 'note',
        text: 'pgx is a popular PostgreSQL-focused option with strong support for PostgreSQL features. database/sql is still a good standard-library-first place to learn the concepts.',
      },
      {
        type: 'tip',
        text: 'Use sslmode=require or stronger settings for hosted databases unless your provider documents a different secure configuration.',
      },
      {
        type: 'try',
        text: 'Create a DATABASE_URL for a local database with placeholder credentials, connect with a timeout, and run a select now() query.',
      },
      {
        type: 'keypoints',
        items: [
          'Store PostgreSQL connection strings outside source code.',
          'Use context timeouts for startup checks and database operations.',
          'Use parameter placeholders to avoid SQL injection.',
          'Use migrations to version database schema changes.',
        ],
      },
    ],
  },
  {
    slug: 'go-env-config',
    title: 'Env Vars & Configuration',
    description:
      'Load application configuration from environment variables with validation, defaults, and safe secret handling.',
    level: 'intermediate',
    section: 'App Structure',
    order: 46,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Configuration changes between environments: local development, tests, staging, and production. Environment variables are a common standard for deployment-friendly Go apps.',
      },
      {
        type: 'p',
        text: 'Load configuration once at startup, validate required values, and pass a typed config struct to the parts of the app that need it.',
      },
      { type: 'h2', text: 'A typed config loader' },
      {
        type: 'code',
        language: 'go',
        title: 'Reading env vars with defaults',
        code: `package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

type Config struct {
	Addr        string
	DatabaseURL string
	ReadTimeout time.Duration
}

func Load() (Config, error) {
	readSeconds, err := strconv.Atoi(getenv("READ_TIMEOUT_SECONDS", "5"))
	if err != nil {
		return Config{}, fmt.Errorf("READ_TIMEOUT_SECONDS must be a number: %w", err)
	}

	cfg := Config{
		Addr:        getenv("ADDR", ":8080"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
		ReadTimeout: time.Duration(readSeconds) * time.Second,
	}

	if cfg.DatabaseURL == "" {
		return Config{}, fmt.Errorf("DATABASE_URL is required")
	}

	return cfg, nil
}

func getenv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'Example local environment',
        code: `ADDR=:8080
READ_TIMEOUT_SECONDS=5
DATABASE_URL=postgres://app_user:local_password@localhost:5432/app_dev?sslmode=disable`,
      },
      {
        type: 'note',
        text: 'Do not log secret values. It is fine to log that DATABASE_URL is configured, but not the full connection string.',
      },
      {
        type: 'tip',
        text: 'Small projects can use os.Getenv directly. As configuration grows, a typed Load function keeps validation and defaults in one place.',
      },
      {
        type: 'try',
        text: 'Add a LogLevel field that defaults to info and accepts debug, info, warn, or error. Return an error for any other value.',
      },
      {
        type: 'keypoints',
        items: [
          'Environment variables are a common way to configure deployed Go apps.',
          'Load and validate configuration at startup.',
          'Use typed config structs instead of passing raw strings everywhere.',
          'Never commit or print real secrets.',
        ],
      },
    ],
  },
  {
    slug: 'go-logging',
    title: 'Structured Logging',
    description:
      'Use Go 1.21 log/slog for structured logs that are readable locally and useful in production systems.',
    level: 'intermediate',
    section: 'App Structure',
    order: 47,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Structured logs store events as key-value pairs instead of only free-form text. They are easier to search, filter, and connect to metrics or traces.',
      },
      {
        type: 'p',
        text: 'Go 1.21 added log/slog to the standard library. Popular third-party loggers such as zap and zerolog are still common, but slog is a strong default.',
      },
      { type: 'h2', text: 'Create a JSON logger' },
      {
        type: 'code',
        language: 'go',
        title: 'log/slog basics',
        code: `package main

import (
	"log/slog"
	"os"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))

	slog.SetDefault(logger)

	slog.Info("server starting",
		"addr", ":8080",
		"env", "development",
	)

	slog.Warn("request failed",
		"method", "GET",
		"path", "/users/42",
		"status", 404,
	)
}`,
      },
      { type: 'h2', text: 'Add request-scoped fields' },
      {
        type: 'code',
        language: 'go',
        title: 'Using With for shared attributes',
        code: `func handleCreateUser(logger *slog.Logger, email string) {
	requestLogger := logger.With(
		"component", "users",
		"operation", "create",
	)

	requestLogger.Info("creating user", "email", email)
}`,
      },
      {
        type: 'note',
        text: 'Choose a consistent set of field names, such as method, path, status, duration_ms, request_id, and user_id.',
      },
      {
        type: 'tip',
        text: 'Avoid logging passwords, tokens, full connection strings, or sensitive personal data. Structured logs make leaks easier to search, but still dangerous.',
      },
      {
        type: 'try',
        text: 'Configure a slog text handler for local development and a JSON handler for production based on an APP_ENV environment variable.',
      },
      {
        type: 'keypoints',
        items: [
          'Structured logging records key-value pairs.',
          'log/slog is available in Go 1.21 and newer.',
          'Use logger.With to attach common fields.',
          'Be careful not to log secrets or sensitive data.',
        ],
      },
    ],
  },
  {
    slug: 'go-project-layout',
    title: 'Standard Project Layout',
    description:
      'Organize Go applications with packages, cmd directories, internal code, configuration, tests, and migrations.',
    level: 'intermediate',
    section: 'App Structure',
    order: 48,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Go projects do not require a single official layout, but common patterns make applications easier to navigate. Keep the layout as simple as the project allows.',
      },
      {
        type: 'p',
        text: 'A command-line tool may only need a main.go and a few packages. A web API often benefits from cmd, internal packages, migrations, and focused tests.',
      },
      { type: 'h2', text: 'A practical API layout' },
      {
        type: 'code',
        language: 'text',
        title: 'Example directory tree',
        code: `my-api/
  go.mod
  cmd/
    api/
      main.go
  internal/
    config/
      config.go
    httpapi/
      routes.go
      handlers.go
    store/
      users.go
  migrations/
    001_create_users.sql
  README.md`,
      },
      { type: 'h2', text: 'Keep main small' },
      {
        type: 'code',
        language: 'go',
        title: 'cmd/api/main.go',
        code: `package main

import (
	"log"
	"net/http"

	"example.com/my-api/internal/config"
	"example.com/my-api/internal/httpapi"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	handler := httpapi.NewHandler()

	log.Println("listening on", cfg.Addr)
	log.Fatal(http.ListenAndServe(cfg.Addr, handler))
}`,
      },
      {
        type: 'code',
        language: 'toml',
        title: 'Tool configuration example',
        code: `[tools]
go = "1.22"

[env]
APP_ENV = "development"`,
      },
      {
        type: 'note',
        text: 'The internal directory is enforced by the Go toolchain. Packages outside the parent tree cannot import code inside internal.',
      },
      {
        type: 'tip',
        text: 'Do not copy a huge template before you need it. Start small, then split packages when responsibilities become clear.',
      },
      {
        type: 'try',
        text: 'Sketch a layout for a notes API with cmd/api, internal/config, internal/httpapi, internal/store, and migrations. Decide where tests for handlers and store code should live.',
      },
      {
        type: 'keypoints',
        items: [
          'Go project layout should match the size and shape of the application.',
          'cmd/appname/main.go is a common place for executable entry points.',
          'internal protects application-only packages from external imports.',
          'Keep main focused on wiring configuration, dependencies, routes, and startup.',
        ],
      },
    ],
  },
];
