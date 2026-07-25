import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-go',
    title: 'What is Go (Golang)?',
    description: 'Learn what Go is, why developers use it, and what kinds of programs beginners can build with it.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 9,
    content: [
      { type: 'p', text: 'Go, often called Golang, is a modern programming language created at Google. It is designed to be simple to read, fast to compile, and practical for building real software.' },
      { type: 'p', text: 'Go is especially popular for command-line tools, web servers, APIs, cloud services, automation, and networking programs. Many teams like it because a small Go program can grow into a reliable production service without needing a complicated setup.' },
      { type: 'h2', text: 'Why beginners like Go' },
      { type: 'p', text: 'Go has fewer language features than many older languages. That does not make it weak. It means there are fewer rules to memorize before you can write useful programs.' },
      {
        type: 'table',
        headers: ['Go idea', 'What it means for beginners'],
        rows: [
          ['Small syntax', 'You can learn the main building blocks quickly'],
          ['Fast compiler', 'Mistakes are reported quickly while you practice'],
          ['Built-in tooling', 'Formatting, testing, documentation, and modules come with Go'],
          ['Static typing', 'Go catches many mistakes before your program runs'],
          ['Strong standard library', 'You can build useful tools without installing many packages']
        ]
      },
      { type: 'h2', text: 'A tiny Go program' },
      { type: 'p', text: 'Most Go programs begin in a package named main and run from a function named main. Do not worry if that feels formal at first; you will understand each piece soon.' },
      {
        type: 'code',
        title: 'hello.go',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	fmt.Println("Hello, Go!")
}`
      },
      { type: 'h2', text: 'Where Go is used' },
      { type: 'ul', items: ['Backend APIs that return JSON to web or mobile apps', 'Small command-line tools used by developers and operations teams', 'Cloud and infrastructure software such as containers and deployment tools', 'Data processing jobs and automation scripts', 'Network services that handle many requests efficiently'] },
      {
        type: 'code',
        title: 'A service-style idea',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	user := "Maya"
	fmt.Println("Preparing dashboard for", user)
}`
      },
      { type: 'note', text: 'The official language name is Go. Golang is a common nickname because the website is go.dev and the old domain was golang.org.' },
      { type: 'try', text: 'List three programs you use regularly. For each one, guess whether Go could be useful for a command-line tool, an API, a background service, or automation behind the scenes.' },
      { type: 'keypoints', items: ['Go is a modern, practical programming language.', 'It is common in APIs, command-line tools, cloud software, and services.', 'Go programs compile quickly and use built-in tools.', 'A Go program commonly starts with package main and func main.'] }
    ]
  },
  {
    slug: 'go-setup',
    title: 'Install Go & Set Up Your Editor',
    description: 'Install modern Go, check your terminal, and prepare an editor for beginner-friendly Go development.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 11,
    content: [
      { type: 'p', text: 'To write Go programs, you need the Go toolchain and a code editor. The toolchain includes the go command, compiler, formatter, test runner, module tools, and standard library.' },
      { type: 'h2', text: 'Install Go' },
      { type: 'p', text: 'Download Go from go.dev/dl or use a trusted package manager for your operating system. This tutorial is Go 1.21+ friendly, so use a current stable version if possible.' },
      {
        type: 'code',
        title: 'Check your Go version',
        language: 'bash',
        code: `go version`
      },
      {
        type: 'code',
        title: 'Example output',
        language: 'text',
        code: `go version go1.22.5 linux/amd64`
      },
      { type: 'h2', text: 'Choose an editor' },
      { type: 'p', text: 'Visual Studio Code with the official Go extension is a popular choice, but any editor with Go support is fine. Good editor support can format files, show errors, suggest completions, and run tests.' },
      { type: 'ul', items: ['VS Code: install the Go extension from the extensions panel', 'GoLand: a full Go-focused IDE', 'Neovim, Vim, or Emacs: good choices if you already use terminal editors'] },
      { type: 'h2', text: 'Create a practice folder' },
      { type: 'p', text: 'Modern Go projects use modules. A module is a project with a go.mod file at its root. You will create one in the next lessons, but it helps to start with a clean folder now.' },
      {
        type: 'code',
        title: 'Make a beginner project folder',
        language: 'bash',
        code: `mkdir go-beginner
cd go-beginner`
      },
      { type: 'h2', text: 'Useful environment checks' },
      {
        type: 'code',
        title: 'See Go environment information',
        language: 'bash',
        code: `go env GOPATH GOMOD`
      },
      { type: 'p', text: 'GOPATH is still used for downloaded packages and build cache details, but beginners should create normal module projects instead of placing source code inside GOPATH.' },
      { type: 'tip', text: 'If your terminal says go: command not found, close and reopen the terminal after installation. On Windows, make sure Go was added to PATH.' },
      { type: 'try', text: 'Install Go, open a new terminal, and run go version. Then create a folder named go-beginner where you will store the examples in this tutorial.' },
      { type: 'keypoints', items: ['The go command is the main tool for compiling, running, formatting, testing, and managing modules.', 'Use a current stable Go version, preferably Go 1.21 or newer.', 'A Go-aware editor helps catch mistakes early.', 'Modern Go projects are modules with a go.mod file.'] }
    ]
  },
  {
    slug: 'go-first-program',
    title: 'Your First Go Program',
    description: 'Write, save, and run a small Go program using package main, imports, and fmt.Println.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 10,
    content: [
      { type: 'p', text: 'Your first Go program will print a message in the terminal. This small example introduces the basic shape of an executable Go program.' },
      { type: 'h2', text: 'Create main.go' },
      { type: 'p', text: 'Go files end with .go. In a command-line program, the package is usually main, and the program starts by running the main function.' },
      {
        type: 'code',
        title: 'main.go',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	fmt.Println("Hello, Go!")
	fmt.Println("I am learning modern Go.")
}`
      },
      { type: 'h2', text: 'Run the program' },
      { type: 'p', text: 'The go run command compiles and runs your program in one step. It is perfect while learning because you can edit a file and quickly try it again.' },
      {
        type: 'code',
        title: 'Run main.go',
        language: 'bash',
        code: `go run main.go`
      },
      {
        type: 'code',
        title: 'Output',
        language: 'text',
        code: `Hello, Go!
I am learning modern Go.`
      },
      { type: 'h2', text: 'Understand the parts' },
      {
        type: 'table',
        headers: ['Line', 'Meaning'],
        rows: [
          ['package main', 'This file belongs to the executable program package'],
          ['import "fmt"', 'Use the fmt package from the standard library'],
          ['func main()', 'Define the function Go runs first'],
          ['fmt.Println', 'Print a line of text to the terminal']
        ]
      },
      {
        type: 'code',
        title: 'Print values too',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	name := "Ava"
	lessonsCompleted := 3

	fmt.Println("Student:", name)
	fmt.Println("Lessons completed:", lessonsCompleted)
}`
      },
      { type: 'note', text: 'Go requires imported packages to be used. If you import fmt but never call it, the compiler reports an error. This keeps code tidy.' },
      { type: 'try', text: 'Change the program so it prints your name and one thing you want to build with Go. Run it with go run main.go.' },
      { type: 'keypoints', items: ['A Go executable usually uses package main.', 'The main function is where the program starts.', 'fmt.Println prints text and values with a newline.', 'go run compiles and runs a program in one command.'] }
    ]
  },
  {
    slug: 'go-modules',
    title: 'Go Modules & go.mod',
    description: 'Understand Go modules, create a go.mod file, and learn why modules are the default for modern Go projects.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 12,
    content: [
      { type: 'p', text: 'A Go module is a project boundary. It tells Go the module path, the Go version, and which outside packages the project depends on.' },
      { type: 'p', text: 'Modern Go is modules-first. Even tiny beginner projects are easier to manage when they start with go mod init.' },
      { type: 'h2', text: 'Create a module' },
      {
        type: 'code',
        title: 'Initialize a module',
        language: 'bash',
        code: `mkdir hello-go
cd hello-go
go mod init example.com/hello-go`
      },
      {
        type: 'code',
        title: 'go.mod',
        language: 'toml',
        code: `module example.com/hello-go

go 1.22`
      },
      { type: 'p', text: 'The module path can be a real repository URL for shared code, such as github.com/yourname/project. For local learning, example.com/name is fine.' },
      { type: 'h2', text: 'Add a program' },
      {
        type: 'code',
        title: 'main.go',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	fmt.Println("This program belongs to a Go module.")
}`
      },
      {
        type: 'code',
        title: 'Run from the module folder',
        language: 'bash',
        code: `go run .`
      },
      { type: 'h2', text: 'Why go.mod matters' },
      { type: 'ul', items: ['It gives the project a name called a module path.', 'It records the Go language version expected by the project.', 'It lets Go download and track third-party packages.', 'It makes builds more repeatable for teammates and servers.'] },
      { type: 'h2', text: 'When dependencies appear' },
      { type: 'p', text: 'If you later import an outside package, Go can add it to go.mod and go.sum. The go.sum file records checksums so Go can verify downloaded code.' },
      {
        type: 'code',
        title: 'Clean up module requirements',
        language: 'bash',
        code: `go mod tidy`
      },
      { type: 'tip', text: 'Run Go commands from the folder that contains go.mod, or from a subfolder inside that module. This helps Go understand your project layout.' },
      { type: 'try', text: 'Create a new folder, run go mod init example.com/practice, add a main.go file, and run it with go run .' },
      { type: 'keypoints', items: ['A module is the modern project unit in Go.', 'go mod init creates go.mod.', 'The module path names your project.', 'go run . runs the package in the current module folder.', 'go mod tidy keeps module files clean.'] }
    ]
  },
  {
    slug: 'go-workspace-tools',
    title: 'go run, build, fmt & Tooling',
    description: 'Use the most important Go commands for running, building, formatting, testing, and inspecting beginner projects.',
    level: 'beginner',
    section: 'Getting Started',
    order: 5,
    minutes: 12,
    content: [
      { type: 'p', text: 'Go includes excellent tools by default. You do not need a separate formatter, compiler command, package manager, or test runner to begin.' },
      { type: 'h2', text: 'Run while developing' },
      { type: 'p', text: 'Use go run when you want to quickly compile and execute your program. The dot means the package in the current folder.' },
      {
        type: 'code',
        title: 'Run the current package',
        language: 'bash',
        code: `go run .`
      },
      { type: 'h2', text: 'Build an executable' },
      { type: 'p', text: 'Use go build when you want an executable file you can run later or share with another machine that uses the same operating system and CPU architecture.' },
      {
        type: 'code',
        title: 'Build the current package',
        language: 'bash',
        code: `go build`
      },
      {
        type: 'code',
        title: 'Build with an output name',
        language: 'bash',
        code: `go build -o tipcalc`
      },
      { type: 'h2', text: 'Format code automatically' },
      { type: 'p', text: 'Go has one standard formatting style. The gofmt command rewrites files into that style, which prevents many style arguments on teams.' },
      {
        type: 'code',
        title: 'Format all Go files in the module',
        language: 'bash',
        code: `gofmt -w .`
      },
      { type: 'h2', text: 'Useful everyday commands' },
      {
        type: 'table',
        headers: ['Command', 'Use'],
        rows: [
          ['go version', 'Show installed Go version'],
          ['go run .', 'Compile and run the current package'],
          ['go build', 'Create an executable'],
          ['gofmt -w .', 'Format Go files'],
          ['go test ./...', 'Run tests in this module and subpackages'],
          ['go doc fmt.Println', 'Read documentation in the terminal']
        ]
      },
      {
        type: 'code',
        title: 'A file gofmt will clean up',
        language: 'go',
        code: `package main

import "fmt"

func main() {
fmt.Println("gofmt fixes indentation")
}`
      },
      { type: 'note', text: 'Many editors run gofmt when you save. Even then, knowing the command is useful for checking code before commits or builds.' },
      { type: 'try', text: 'Create a main.go file with messy indentation, run gofmt -w ., and look at how the file changes. Then run go run .' },
      { type: 'keypoints', items: ['Go ships with practical tools.', 'go run is convenient while learning.', 'go build creates an executable file.', 'gofmt applies the standard Go style.', 'go test ./... is the common command for running tests across a module.'] }
    ]
  },
  {
    slug: 'go-variables',
    title: 'Variables & Short Declaration',
    description: 'Learn how to create variables with var, short declaration, type inference, and assignment.',
    level: 'beginner',
    section: 'Foundations',
    order: 6,
    minutes: 11,
    content: [
      { type: 'p', text: 'A variable is a named place to store a value. Variables help you reuse values and explain what the values mean.' },
      { type: 'h2', text: 'Declare with var' },
      { type: 'p', text: 'The var keyword creates a variable. You can write the type yourself or let Go infer it from the value.' },
      {
        type: 'code',
        title: 'Using var',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	var username string = "maya"
	var score int = 42
	var active = true

	fmt.Println(username, score, active)
}`
      },
      { type: 'h2', text: 'Short declaration' },
      { type: 'p', text: 'Inside a function, Go programmers often use := for new variables. This is called short declaration.' },
      {
        type: 'code',
        title: 'Using :=',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	city := "Austin"
	temperature := 78

	fmt.Println(city, temperature)
}`
      },
      { type: 'h2', text: 'Changing a variable' },
      { type: 'p', text: 'Use = to assign a new value to an existing variable. Use := only when at least one new variable is being created in that statement.' },
      {
        type: 'code',
        title: 'Assignment after declaration',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	count := 1
	fmt.Println(count)

	count = count + 1
	fmt.Println(count)
}`
      },
      { type: 'h2', text: 'Zero values' },
      { type: 'p', text: 'If you declare a variable without giving it a value, Go gives it a zero value. Numbers become 0, strings become an empty string, booleans become false, and pointers become nil.' },
      {
        type: 'code',
        title: 'Zero values',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	var total int
	var label string
	var paid bool

	fmt.Println(total)
	fmt.Println(label == "")
	fmt.Println(paid)
}`
      },
      { type: 'tip', text: 'Use clear names like totalPrice or userID. Go uses short names in small scopes, but beginner code is easier to read with descriptive names.' },
      { type: 'try', text: 'Create variables for a product name, quantity, and price. Print a sentence that includes all three values.' },
      { type: 'keypoints', items: ['Variables store named values.', 'var works inside and outside functions.', ':= creates variables inside functions.', '= changes an existing variable.', 'Variables declared without a value receive a zero value.'] }
    ]
  },
  {
    slug: 'go-types',
    title: 'Basic Types',
    description: 'Understand Go basic types including strings, integers, floats, booleans, and how to inspect them.',
    level: 'beginner',
    section: 'Foundations',
    order: 7,
    minutes: 12,
    content: [
      { type: 'p', text: 'Go is statically typed. Every value has a type, and the compiler checks that you use values in sensible ways before the program runs.' },
      { type: 'h2', text: 'Common basic types' },
      {
        type: 'table',
        headers: ['Type', 'Example value', 'Common use'],
        rows: [
          ['string', '"Go"', 'Text'],
          ['int', '42', 'Whole numbers'],
          ['float64', '19.99', 'Decimal numbers'],
          ['bool', 'true', 'Yes/no values'],
          ['byte', '65', 'Raw bytes and ASCII-like data'],
          ['rune', '\'A\'', 'Unicode code points']
        ]
      },
      {
        type: 'code',
        title: 'Basic values',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	name := "Maya"
	age := 29
	price := 12.50
	active := true

	fmt.Println(name, age, price, active)
}`
      },
      { type: 'h2', text: 'Show a value type' },
      { type: 'p', text: 'fmt.Printf can format output. The %T verb prints the type of a value, and %v prints the value in a default format.' },
      {
        type: 'code',
        title: 'Inspect types',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	total := 99.95
	inStock := false

	fmt.Printf("total has type %T and value %v\\n", total, total)
	fmt.Printf("inStock has type %T and value %v\\n", inStock, inStock)
}`
      },
      { type: 'h2', text: 'Converting between types' },
      { type: 'p', text: 'Go does not silently convert between different numeric types. Use an explicit conversion when you really want to change a value from one type to another.' },
      {
        type: 'code',
        title: 'Numeric conversion',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	items := 3
	price := 4.99
	total := float64(items) * price

	fmt.Println(total)
}`
      },
      { type: 'note', text: 'Use int for ordinary whole-number counts unless you have a specific reason to choose int64, uint, or another numeric type.' },
      { type: 'try', text: 'Create variables for a username, login count, account balance, and active status. Use fmt.Printf with %T to print each type.' },
      { type: 'keypoints', items: ['Go checks types at compile time.', 'Common basic types include string, int, float64, and bool.', 'fmt.Printf with %T shows a value type.', 'Go prefers explicit type conversions instead of hidden conversions.'] }
    ]
  },
  {
    slug: 'go-constants',
    title: 'Constants & iota',
    description: 'Use constants for fixed values and learn how iota can create simple related numeric constants.',
    level: 'beginner',
    section: 'Foundations',
    order: 8,
    minutes: 10,
    content: [
      { type: 'p', text: 'A constant is a value that cannot be changed after it is declared. Constants are useful for names, limits, labels, rates, and other values that should stay fixed.' },
      { type: 'h2', text: 'Declare constants' },
      {
        type: 'code',
        title: 'Simple constants',
        language: 'go',
        code: `package main

import "fmt"

const appName = "Tip Calculator"
const taxRate = 0.0825

func main() {
	subtotal := 40.00
	tax := subtotal * taxRate

	fmt.Println(appName)
	fmt.Println("Tax:", tax)
}`
      },
      { type: 'h2', text: 'Constants can be grouped' },
      { type: 'p', text: 'Related constants are often grouped in a const block. This keeps configuration-like values easy to scan.' },
      {
        type: 'code',
        title: 'A const block',
        language: 'go',
        code: `package main

import "fmt"

const (
	statusPending = "pending"
	statusPaid    = "paid"
	statusFailed  = "failed"
)

func main() {
	fmt.Println("Order status:", statusPaid)
}`
      },
      { type: 'h2', text: 'Use iota for counting constants' },
      { type: 'p', text: 'iota is a special identifier that increments inside a const block. It is often used for small sets of related numeric options.' },
      {
        type: 'code',
        title: 'iota example',
        language: 'go',
        code: `package main

import "fmt"

const (
	roleGuest = iota
	roleMember
	roleAdmin
)

func main() {
	fmt.Println(roleGuest)
	fmt.Println(roleMember)
	fmt.Println(roleAdmin)
}`
      },
      { type: 'h2', text: 'Constants are not variables' },
      { type: 'p', text: 'You cannot assign a new value to a constant. If a value must change while the program runs, use a variable instead.' },
      {
        type: 'code',
        title: 'This idea will not compile',
        language: 'go',
        code: `const maxRetries = 3

// maxRetries = 5 // cannot assign to maxRetries`
      },
      { type: 'tip', text: 'For beginner code, prefer obvious constant names over clever abbreviations. The name should explain why the value exists.' },
      { type: 'try', text: 'Create constants for a restaurant name, a default tip percent, and three order states using iota.' },
      { type: 'keypoints', items: ['Constants hold values that should not change.', 'const blocks group related constants.', 'iota creates incrementing numeric constants in a const block.', 'Use variables for values that change while a program runs.'] }
    ]
  },
  {
    slug: 'go-operators',
    title: 'Operators',
    description: 'Learn Go arithmetic, comparison, logical, and assignment operators with practical examples.',
    level: 'beginner',
    section: 'Foundations',
    order: 9,
    minutes: 10,
    content: [
      { type: 'p', text: 'Operators are symbols that perform work with values. Go includes operators for math, comparisons, logic, assignment, and more.' },
      { type: 'h2', text: 'Arithmetic operators' },
      {
        type: 'table',
        headers: ['Operator', 'Meaning', 'Example'],
        rows: [
          ['+', 'Add', 'a + b'],
          ['-', 'Subtract', 'a - b'],
          ['*', 'Multiply', 'a * b'],
          ['/', 'Divide', 'a / b'],
          ['%', 'Remainder', 'a % b']
        ]
      },
      {
        type: 'code',
        title: 'Basic math',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	items := 7
	boxSize := 3

	fmt.Println("full boxes:", items/boxSize)
	fmt.Println("left over:", items%boxSize)
}`
      },
      { type: 'h2', text: 'Comparison operators' },
      { type: 'p', text: 'Comparison operators return a bool: either true or false. They are commonly used in if statements and loops.' },
      {
        type: 'code',
        title: 'Compare values',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	age := 20

	fmt.Println(age >= 18)
	fmt.Println(age == 21)
	fmt.Println(age != 0)
}`
      },
      { type: 'h2', text: 'Logical operators' },
      {
        type: 'table',
        headers: ['Operator', 'Meaning', 'Example'],
        rows: [
          ['&&', 'and', 'loggedIn && isAdmin'],
          ['||', 'or', 'couponValid || isMember'],
          ['!', 'not', '!isClosed']
        ]
      },
      {
        type: 'code',
        title: 'Combine conditions',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	loggedIn := true
	isAdmin := false

	fmt.Println("can manage:", loggedIn && isAdmin)
	fmt.Println("can view:", loggedIn || isAdmin)
}`
      },
      { type: 'h2', text: 'Assignment shortcuts' },
      { type: 'p', text: 'Go supports shortcuts like += and -= when updating a variable based on its current value.' },
      {
        type: 'code',
        title: 'Update totals',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	total := 10
	total += 5
	total -= 2

	fmt.Println(total)
}`
      },
      { type: 'note', text: 'Integer division drops the decimal part. For money or measurements with decimals, use a floating-point type carefully or a cents-based integer approach for production code.' },
      { type: 'try', text: 'Write a small program that checks whether a cart total is at least 50 and whether the customer has free shipping enabled.' },
      { type: 'keypoints', items: ['Operators perform calculations, comparisons, and logic.', 'Comparison operators return bool values.', '&& means and, || means or, and ! means not.', 'Assignment shortcuts update existing variables.'] }
    ]
  },
  {
    slug: 'go-strings',
    title: 'Strings & Runes',
    description: 'Work with Go strings, string length, indexing, raw strings, and Unicode runes.',
    level: 'beginner',
    section: 'Working with Data',
    order: 10,
    minutes: 13,
    content: [
      { type: 'p', text: 'A string stores text. In Go, strings are read-only sequences of bytes, usually containing UTF-8 encoded text.' },
      { type: 'h2', text: 'Create and combine strings' },
      {
        type: 'code',
        title: 'String basics',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	first := "Go"
	second := "developer"
	message := first + " " + second

	fmt.Println(message)
}`
      },
      { type: 'h2', text: 'Escaped and raw strings' },
      { type: 'p', text: 'Double-quoted strings can use escape sequences like \\n for a newline. Backtick strings are raw strings and can span multiple lines.' },
      {
        type: 'code',
        title: 'Two string styles',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	escaped := "Line one\\nLine two"
	raw := \`Line one
Line two\`

	fmt.Println(escaped)
	fmt.Println(raw)
}`
      },
      { type: 'h2', text: 'Bytes and runes' },
      { type: 'p', text: 'len returns the number of bytes in a string, not always the number of human-visible characters. A rune represents a Unicode code point.' },
      {
        type: 'code',
        title: 'Count bytes and runes',
        language: 'go',
        code: `package main

import (
	"fmt"
	"unicode/utf8"
)

func main() {
	word := "cafe"
	accented := "café"

	fmt.Println(len(word))
	fmt.Println(len(accented))
	fmt.Println(utf8.RuneCountInString(accented))
}`
      },
      { type: 'h2', text: 'Loop over runes' },
      {
        type: 'code',
        title: 'Range over text',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	for index, r := range "Go!" {
		fmt.Println(index, r, string(r))
	}
}`
      },
      { type: 'note', text: 'The index from range over a string is a byte index. That is useful, but it is not the same as a character count for all languages.' },
      { type: 'try', text: 'Create a string with your first name. Print its byte length with len, then loop over it with range and print each rune as text.' },
      { type: 'keypoints', items: ['Go strings store read-only bytes, usually UTF-8 text.', 'Use + to concatenate strings.', 'Backtick strings are raw strings and can span lines.', 'len counts bytes; utf8.RuneCountInString counts Unicode code points.', 'range over a string gives byte indexes and runes.'] }
    ]
  },
  {
    slug: 'go-arrays-slices',
    title: 'Arrays & Slices',
    description: 'Learn the difference between fixed-size arrays and flexible slices, including append, len, cap, and range.',
    level: 'beginner',
    section: 'Working with Data',
    order: 11,
    minutes: 14,
    content: [
      { type: 'p', text: 'Arrays and slices store ordered collections of values. Arrays have a fixed length. Slices are flexible views over arrays and are used much more often in everyday Go.' },
      { type: 'h2', text: 'Arrays have fixed length' },
      {
        type: 'code',
        title: 'Array example',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	var scores [3]int
	scores[0] = 90
	scores[1] = 85
	scores[2] = 100

	fmt.Println(scores)
	fmt.Println(len(scores))
}`
      },
      { type: 'h2', text: 'Slices are flexible' },
      { type: 'p', text: 'A slice does not store its length in the type. You can append values to create a new slice value with more elements.' },
      {
        type: 'code',
        title: 'Slice with append',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	tasks := []string{"learn variables", "practice slices"}
	tasks = append(tasks, "build a CLI")

	fmt.Println(tasks)
	fmt.Println("length:", len(tasks))
}`
      },
      { type: 'h2', text: 'Slice parts' },
      { type: 'p', text: 'A slice has a length and a capacity. Length is how many elements are in the slice. Capacity is how many elements fit in the underlying array before Go needs more space.' },
      {
        type: 'code',
        title: 'Length and capacity',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	numbers := make([]int, 0, 5)
	numbers = append(numbers, 10, 20)

	fmt.Println(numbers)
	fmt.Println("len:", len(numbers))
	fmt.Println("cap:", cap(numbers))
}`
      },
      { type: 'h2', text: 'Loop with range' },
      {
        type: 'code',
        title: 'Range over a slice',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	names := []string{"Maya", "Ava", "Noah"}

	for index, name := range names {
		fmt.Println(index, name)
	}
}`
      },
      { type: 'tip', text: 'When you do not need the index in a range loop, use an underscore: for _, name := range names.' },
      { type: 'try', text: 'Create a slice of three favorite foods, append one more, and print each food on its own line with range.' },
      { type: 'keypoints', items: ['Arrays have a fixed length that is part of their type.', 'Slices are flexible and used more often than arrays.', 'append returns the updated slice.', 'len returns the number of elements, and cap returns available capacity.', 'range is the common way to loop over slices.'] }
    ]
  },
  {
    slug: 'go-maps',
    title: 'Maps',
    description: 'Use maps to store key-value data, check for missing keys, update values, and delete entries.',
    level: 'beginner',
    section: 'Working with Data',
    order: 12,
    minutes: 13,
    content: [
      { type: 'p', text: 'A map stores key-value pairs. You use a key to look up a value quickly, like finding a price by product name or a user by username.' },
      { type: 'h2', text: 'Create a map' },
      {
        type: 'code',
        title: 'Map literal',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	prices := map[string]float64{
		"coffee": 4.50,
		"tea":    3.25,
		"bagel":  2.75,
	}

	fmt.Println(prices["coffee"])
}`
      },
      { type: 'h2', text: 'Add and update values' },
      {
        type: 'code',
        title: 'Change a map',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	inventory := make(map[string]int)
	inventory["notebook"] = 12
	inventory["pen"] = 30
	inventory["pen"] = 28

	fmt.Println(inventory)
}`
      },
      { type: 'h2', text: 'Check whether a key exists' },
      { type: 'p', text: 'Reading a missing key returns the zero value for the map value type. Use the comma ok pattern when you need to know whether the key was actually present.' },
      {
        type: 'code',
        title: 'Comma ok pattern',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	users := map[string]string{
		"maya": "admin",
		"ava":  "member",
	}

	role, ok := users["noah"]
	if ok {
		fmt.Println("role:", role)
	} else {
		fmt.Println("user not found")
	}
}`
      },
      { type: 'h2', text: 'Delete and loop' },
      {
        type: 'code',
        title: 'Delete map entries',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	settings := map[string]bool{
		"email": true,
		"sms":   false,
	}

	delete(settings, "sms")

	for key, value := range settings {
		fmt.Println(key, value)
	}
}`
      },
      { type: 'note', text: 'Map iteration order is not guaranteed. If you need sorted output, collect and sort the keys first.' },
      { type: 'try', text: 'Create a map of menu item names to prices. Add one item, update one price, check whether a key exists, and print all entries.' },
      { type: 'keypoints', items: ['Maps store key-value pairs.', 'Use map[KeyType]ValueType to describe a map type.', 'make can create an empty map.', 'The comma ok pattern checks whether a key exists.', 'delete removes a key from a map.'] }
    ]
  },
  {
    slug: 'go-conditionals',
    title: 'if, else & switch',
    description: 'Control program decisions with if, else if, else, and switch statements.',
    level: 'beginner',
    section: 'Control Flow',
    order: 13,
    minutes: 12,
    content: [
      { type: 'p', text: 'Conditionals let your program choose what to do. In Go, if statements use boolean conditions and do not require parentheses around the condition.' },
      { type: 'h2', text: 'if and else' },
      {
        type: 'code',
        title: 'Age check',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	age := 20

	if age >= 18 {
		fmt.Println("adult")
	} else {
		fmt.Println("minor")
	}
}`
      },
      { type: 'h2', text: 'else if for multiple paths' },
      {
        type: 'code',
        title: 'Order status',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	total := 72.50

	if total >= 100 {
		fmt.Println("free express shipping")
	} else if total >= 50 {
		fmt.Println("free standard shipping")
	} else {
		fmt.Println("shipping added at checkout")
	}
}`
      },
      { type: 'h2', text: 'Short statement in if' },
      { type: 'p', text: 'An if statement can start with a short statement before the condition. The variable created there is available only inside the if and else branches.' },
      {
        type: 'code',
        title: 'Scoped condition value',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	if discount := 15; discount > 0 {
		fmt.Println("discount percent:", discount)
	}
}`
      },
      { type: 'h2', text: 'switch' },
      { type: 'p', text: 'A switch is clean when one value can match several cases. Go switch cases do not fall through by default.' },
      {
        type: 'code',
        title: 'Switch on status',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	status := "paid"

	switch status {
	case "pending":
		fmt.Println("waiting for payment")
	case "paid":
		fmt.Println("ready to ship")
	case "cancelled":
		fmt.Println("do not ship")
	default:
		fmt.Println("unknown status")
	}
}`
      },
      { type: 'tip', text: 'Prefer a switch when you are comparing the same value against several choices. It is usually easier to read than a long chain of else if statements.' },
      { type: 'try', text: 'Write a program that uses switch to print a message for plan names: free, pro, team, and an unknown default.' },
      { type: 'keypoints', items: ['if runs code when a condition is true.', 'else and else if handle other paths.', 'Go if conditions do not use parentheses.', 'An if can include a short statement before the condition.', 'switch is useful for several possible matches.'] }
    ]
  },
  {
    slug: 'go-loops',
    title: 'for Loops (Go’s Only Loop)',
    description: 'Use Go for loops as counters, while-style loops, infinite loops, and range loops.',
    level: 'beginner',
    section: 'Control Flow',
    order: 14,
    minutes: 13,
    content: [
      { type: 'p', text: 'Go has only one loop keyword: for. That single keyword handles traditional counted loops, while-style loops, infinite loops, and range loops over data.' },
      { type: 'h2', text: 'A counted loop' },
      {
        type: 'code',
        title: 'Count from 1 to 5',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	for i := 1; i <= 5; i++ {
		fmt.Println(i)
	}
}`
      },
      { type: 'h2', text: 'A while-style loop' },
      { type: 'p', text: 'Leave out the init and post parts when you want a loop that keeps going while a condition is true.' },
      {
        type: 'code',
        title: 'Loop while a condition is true',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	countdown := 3

	for countdown > 0 {
		fmt.Println(countdown)
		countdown--
	}

	fmt.Println("go")
}`
      },
      { type: 'h2', text: 'break and continue' },
      {
        type: 'code',
        title: 'Control a loop',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	for i := 1; i <= 6; i++ {
		if i == 3 {
			continue
		}
		if i == 5 {
			break
		}
		fmt.Println(i)
	}
}`
      },
      { type: 'h2', text: 'Range over collections' },
      {
        type: 'code',
        title: 'Range loop',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	tasks := []string{"write", "format", "run"}

	for index, task := range tasks {
		fmt.Println(index, task)
	}
}`
      },
      { type: 'h2', text: 'Infinite loops' },
      { type: 'p', text: 'A for loop with no condition runs forever until something inside stops it. Servers often run continuously, but beginner examples should include a clear break condition.' },
      {
        type: 'code',
        title: 'Loop until break',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	attempts := 0

	for {
		attempts++
		if attempts == 3 {
			break
		}
	}

	fmt.Println("attempts:", attempts)
}`
      },
      { type: 'warning', text: 'Be careful with infinite loops. If a beginner program seems stuck, stop it in the terminal with Ctrl+C.' },
      { type: 'tip', text: 'When practicing loops, print small values first. Short output makes it easier to spot off-by-one mistakes.' },
      { type: 'try', text: 'Create a slice of numbers and use range to add them into a total. Print the total after the loop.' },
      { type: 'keypoints', items: ['Go uses for for every kind of loop.', 'A counted loop has init, condition, and post parts.', 'A while-style loop uses only a condition.', 'break exits a loop; continue skips to the next iteration.', 'range loops over slices, arrays, maps, and strings.'] }
    ]
  },
  {
    slug: 'go-functions',
    title: 'Functions',
    description: 'Write reusable Go functions with parameters, return values, and clear names.',
    level: 'beginner',
    section: 'Functions & Scope',
    order: 15,
    minutes: 12,
    content: [
      { type: 'p', text: 'A function is a named block of code that performs a task. Functions help you organize programs into smaller pieces that are easier to test, read, and reuse.' },
      { type: 'h2', text: 'Create a function' },
      {
        type: 'code',
        title: 'Function without parameters',
        language: 'go',
        code: `package main

import "fmt"

func greet() {
	fmt.Println("Welcome to Go!")
}

func main() {
	greet()
}`
      },
      { type: 'h2', text: 'Parameters' },
      { type: 'p', text: 'Parameters let a function receive values. In Go, the type comes after the parameter name.' },
      {
        type: 'code',
        title: 'Function with parameters',
        language: 'go',
        code: `package main

import "fmt"

func greetUser(name string) {
	fmt.Println("Hello,", name)
}

func main() {
	greetUser("Maya")
	greetUser("Ava")
}`
      },
      { type: 'h2', text: 'Return values' },
      {
        type: 'code',
        title: 'Return a value',
        language: 'go',
        code: `package main

import "fmt"

func add(a int, b int) int {
	return a + b
}

func main() {
	total := add(3, 4)
	fmt.Println(total)
}`
      },
      { type: 'h2', text: 'Shorter parameter types' },
      { type: 'p', text: 'When neighboring parameters share the same type, you can write the type once after the last name.' },
      {
        type: 'code',
        title: 'Shared parameter type',
        language: 'go',
        code: `package main

import "fmt"

func multiply(a, b int) int {
	return a * b
}

func main() {
	fmt.Println(multiply(6, 7))
}`
      },
      { type: 'h2', text: 'Scope' },
      { type: 'p', text: 'A variable declared inside a function belongs to that function. Other functions cannot use it directly. This boundary is called scope.' },
      { type: 'tip', text: 'Keep functions focused. A function named calculateTotal should calculate a total, not read files, ask for input, and send emails too.' },
      { type: 'try', text: 'Write a function named calculateTip that accepts a bill amount and tip percent as float64 values and returns the tip amount.' },
      { type: 'keypoints', items: ['Functions organize reusable code.', 'Parameters pass values into functions.', 'Return values send results back to the caller.', 'The type appears after parameter names in Go.', 'Variables declared inside a function have local scope.'] }
    ]
  },
  {
    slug: 'go-multiple-returns',
    title: 'Multiple Return Values',
    description: 'Learn how Go functions return more than one value and why this pattern is central to error handling.',
    level: 'beginner',
    section: 'Functions & Scope',
    order: 16,
    minutes: 11,
    content: [
      { type: 'p', text: 'Go functions can return more than one value. This is a simple feature that makes many Go patterns clear, especially returning a result and an error.' },
      { type: 'h2', text: 'Return two values' },
      {
        type: 'code',
        title: 'Quotient and remainder',
        language: 'go',
        code: `package main

import "fmt"

func divideWhole(total, groupSize int) (int, int) {
	quotient := total / groupSize
	remainder := total % groupSize
	return quotient, remainder
}

func main() {
	boxes, leftover := divideWhole(17, 5)
	fmt.Println("boxes:", boxes)
	fmt.Println("leftover:", leftover)
}`
      },
      { type: 'h2', text: 'Ignore a value with underscore' },
      { type: 'p', text: 'Sometimes a function returns a value you do not need. Use _ to ignore that value.' },
      {
        type: 'code',
        title: 'Ignore one result',
        language: 'go',
        code: `package main

import "fmt"

func lookupUser(id int) (string, bool) {
	if id == 1 {
		return "Maya", true
	}
	return "", false
}

func main() {
	name, _ := lookupUser(1)
	fmt.Println(name)
}`
      },
      { type: 'h2', text: 'Result plus ok' },
      { type: 'p', text: 'The comma ok style is common when a lookup might not find something. You already saw it with maps.' },
      {
        type: 'code',
        title: 'Return a found flag',
        language: 'go',
        code: `package main

import "fmt"

func findPrice(item string) (float64, bool) {
	prices := map[string]float64{
		"coffee": 4.50,
		"tea":    3.25,
	}

	price, ok := prices[item]
	return price, ok
}

func main() {
	price, ok := findPrice("coffee")
	if ok {
		fmt.Println("price:", price)
	}
}`
      },
      { type: 'h2', text: 'Preview: result plus error' },
      {
        type: 'code',
        title: 'Common Go shape',
        language: 'go',
        code: `func loadConfig(path string) (string, error) {
	// You will learn real error handling soon.
	return "config data", nil
}`
      },
      { type: 'note', text: 'Go supports named return values, but beginners should usually start with explicit return values because they are easier to read.' },
      { type: 'try', text: 'Write a function that accepts a slice of numbers and returns both the total and the count.' },
      { type: 'keypoints', items: ['Go functions can return multiple values.', 'Use _ to ignore a returned value you do not need.', 'A value plus bool is common for lookups.', 'A value plus error is one of the most important Go patterns.'] }
    ]
  },
  {
    slug: 'go-pointers',
    title: 'Pointers',
    description: 'Understand what pointers are, how to use &, *, and when pointer parameters are useful.',
    level: 'beginner',
    section: 'Functions & Scope',
    order: 17,
    minutes: 14,
    content: [
      { type: 'p', text: 'A pointer stores the memory address of a value. Beginners sometimes find pointers intimidating, but the basic idea is simple: a pointer points to where a value lives.' },
      { type: 'h2', text: 'Address and dereference' },
      { type: 'p', text: 'Use & to get the address of a variable. Use * to read or change the value at that address.' },
      {
        type: 'code',
        title: 'Pointer basics',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	count := 10
	countPointer := &count

	fmt.Println(count)
	fmt.Println(countPointer)
	fmt.Println(*countPointer)
}`
      },
      { type: 'h2', text: 'Change a value through a pointer' },
      {
        type: 'code',
        title: 'Dereference assignment',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	count := 10
	countPointer := &count

	*countPointer = 15

	fmt.Println(count)
}`
      },
      { type: 'h2', text: 'Pointers as function parameters' },
      { type: 'p', text: 'Go passes function arguments by value. That means a function gets a copy. If a function should modify the caller variable, pass a pointer.' },
      {
        type: 'code',
        title: 'Modify a caller variable',
        language: 'go',
        code: `package main

import "fmt"

func addBonus(points *int) {
	*points += 10
}

func main() {
	score := 90
	addBonus(&score)

	fmt.Println(score)
}`
      },
      { type: 'h2', text: 'nil pointers' },
      { type: 'p', text: 'A pointer that points to nothing has the value nil. Do not dereference a nil pointer, because that causes a runtime panic.' },
      {
        type: 'code',
        title: 'Check nil before use',
        language: 'go',
        code: `package main

import "fmt"

func printName(name *string) {
	if name == nil {
		fmt.Println("no name provided")
		return
	}

	fmt.Println(*name)
}

func main() {
	user := "Maya"
	printName(&user)
	printName(nil)
}`
      },
      { type: 'tip', text: 'Use pointers when a function should modify a value, avoid copying a large value, or represent an optional value. Do not use pointers everywhere by habit.' },
      { type: 'try', text: 'Create a function named applyDiscount that accepts a pointer to a float64 price and reduces it by 10 percent.' },
      { type: 'keypoints', items: ['A pointer stores the address of a value.', '& gets an address; * reads or changes the value at an address.', 'Function arguments are passed by value in Go.', 'Pointer parameters can let a function modify caller data.', 'nil means a pointer points to nothing.'] }
    ]
  },
  {
    slug: 'go-structs',
    title: 'Structs',
    description: 'Group related fields into custom struct types for users, orders, products, and service data.',
    level: 'beginner',
    section: 'Types & Composition',
    order: 18,
    minutes: 13,
    content: [
      { type: 'p', text: 'A struct groups related fields into one custom type. Structs are how Go programs model things like users, orders, products, settings, and API responses.' },
      { type: 'h2', text: 'Define a struct' },
      {
        type: 'code',
        title: 'User struct',
        language: 'go',
        code: `package main

import "fmt"

type User struct {
	ID    int
	Name  string
	Email string
}

func main() {
	user := User{
		ID:    1,
		Name:  "Maya",
		Email: "maya@example.com",
	}

	fmt.Println(user.Name)
}`
      },
      { type: 'h2', text: 'Access and change fields' },
      {
        type: 'code',
        title: 'Update a field',
        language: 'go',
        code: `package main

import "fmt"

type Product struct {
	Name  string
	Price float64
}

func main() {
	product := Product{Name: "Notebook", Price: 4.99}
	product.Price = 3.99

	fmt.Println(product)
}`
      },
      { type: 'h2', text: 'Zero-value structs' },
      { type: 'p', text: 'A struct value can be created without setting fields. Each field receives its own zero value.' },
      {
        type: 'code',
        title: 'Zero values in a struct',
        language: 'go',
        code: `package main

import "fmt"

type ServerConfig struct {
	Port    int
	Host    string
	Enabled bool
}

func main() {
	var config ServerConfig
	fmt.Printf("%+v\\n", config)
}`
      },
      { type: 'h2', text: 'Nested structs' },
      {
        type: 'code',
        title: 'Struct inside a struct',
        language: 'go',
        code: `package main

import "fmt"

type Address struct {
	City  string
	State string
}

type Customer struct {
	Name    string
	Address Address
}

func main() {
	customer := Customer{
		Name: "Ava",
		Address: Address{
			City:  "Denver",
			State: "CO",
		},
	}

	fmt.Println(customer.Address.City)
}`
      },
      { type: 'note', text: 'Field names that start with a capital letter are exported, which means other packages can access them. You will learn more about packages soon.' },
      { type: 'try', text: 'Define a Book struct with Title, Author, and Pages fields. Create two book values and print their titles.' },
      { type: 'keypoints', items: ['Structs group related fields into a custom type.', 'Use dot syntax to read or update fields.', 'Struct fields have zero values when not set.', 'Structs can contain other structs.', 'Capitalized field names are exported from a package.'] }
    ]
  },
  {
    slug: 'go-methods',
    title: 'Methods',
    description: 'Attach functions to types with methods and understand value and pointer receivers.',
    level: 'beginner',
    section: 'Types & Composition',
    order: 19,
    minutes: 13,
    content: [
      { type: 'p', text: 'A method is a function attached to a type. Methods let you place behavior near the data it works with.' },
      { type: 'h2', text: 'Create a method' },
      { type: 'p', text: 'The receiver appears between func and the method name. It tells Go which type the method belongs to.' },
      {
        type: 'code',
        title: 'Value receiver method',
        language: 'go',
        code: `package main

import "fmt"

type Rectangle struct {
	Width  float64
	Height float64
}

func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}

func main() {
	box := Rectangle{Width: 10, Height: 5}
	fmt.Println(box.Area())
}`
      },
      { type: 'h2', text: 'Pointer receiver methods' },
      { type: 'p', text: 'Use a pointer receiver when a method should modify the receiver or when copying the value would be expensive.' },
      {
        type: 'code',
        title: 'Pointer receiver method',
        language: 'go',
        code: `package main

import "fmt"

type Counter struct {
	Value int
}

func (c *Counter) Increment() {
	c.Value++
}

func main() {
	counter := Counter{}
	counter.Increment()
	counter.Increment()

	fmt.Println(counter.Value)
}`
      },
      { type: 'h2', text: 'Methods are called with dot syntax' },
      {
        type: 'code',
        title: 'User display method',
        language: 'go',
        code: `package main

import "fmt"

type User struct {
	Name string
	Role string
}

func (u User) DisplayName() string {
	return u.Name + " (" + u.Role + ")"
}

func main() {
	user := User{Name: "Maya", Role: "admin"}
	fmt.Println(user.DisplayName())
}`
      },
      { type: 'h2', text: 'Receiver names' },
      { type: 'p', text: 'Go receiver names are usually short, such as u for User or c for Counter. Avoid names like this or self because they are not Go idiom.' },
      { type: 'tip', text: 'If one method on a type needs a pointer receiver, it is often clearer to use pointer receivers for the other methods on that type too.' },
      { type: 'try', text: 'Create a BankAccount struct with a Balance field. Add a Deposit method that uses a pointer receiver and increases the balance.' },
      { type: 'keypoints', items: ['Methods are functions attached to types.', 'A receiver tells Go which type a method belongs to.', 'Value receivers work with a copy of the value.', 'Pointer receivers can modify the original value.', 'Methods are called with dot syntax.'] }
    ]
  },
  {
    slug: 'go-interfaces-intro',
    title: 'Interfaces Intro',
    description: 'Learn the beginner idea behind Go interfaces: behavior described by method sets.',
    level: 'beginner',
    section: 'Types & Composition',
    order: 20,
    minutes: 14,
    content: [
      { type: 'p', text: 'An interface describes behavior. Instead of saying what concrete type a value must be, an interface says which methods the value must have.' },
      { type: 'h2', text: 'A small interface' },
      {
        type: 'code',
        title: 'Notifier interface',
        language: 'go',
        code: `package main

import "fmt"

type Notifier interface {
	Notify(message string)
}

type EmailNotifier struct {
	Address string
}

func (e EmailNotifier) Notify(message string) {
	fmt.Println("email to", e.Address+":", message)
}

func sendWelcome(n Notifier) {
	n.Notify("Welcome!")
}

func main() {
	email := EmailNotifier{Address: "maya@example.com"}
	sendWelcome(email)
}`
      },
      { type: 'h2', text: 'Implicit implementation' },
      { type: 'p', text: 'Go types satisfy interfaces automatically. There is no implements keyword. If a type has the methods an interface requires, it satisfies that interface.' },
      {
        type: 'code',
        title: 'Another type can satisfy the same interface',
        language: 'go',
        code: `package main

import "fmt"

type Logger interface {
	Log(message string)
}

type ConsoleLogger struct{}

func (ConsoleLogger) Log(message string) {
	fmt.Println("LOG:", message)
}

func saveOrder(logger Logger) {
	logger.Log("order saved")
}

func main() {
	saveOrder(ConsoleLogger{})
}`
      },
      { type: 'h2', text: 'Why interfaces help' },
      { type: 'ul', items: ['They let functions accept behavior instead of one exact type.', 'They make code easier to test by swapping real services for fake ones.', 'They reduce coupling between packages.', 'They are common in Go standard library packages such as io and net/http.'] },
      { type: 'h2', text: 'Keep interfaces small' },
      { type: 'p', text: 'Go interfaces are often small. A one-method interface can be very useful when it names one behavior clearly.' },
      {
        type: 'code',
        title: 'Small behavior contract',
        language: 'go',
        code: `type Stringer interface {
	String() string
}`
      },
      { type: 'note', text: 'Beginners do not need to create interfaces everywhere. Start with concrete types, then introduce interfaces when multiple types need to share behavior or when testing becomes easier.' },
      { type: 'try', text: 'Define a Speaker interface with a Speak method. Create Dog and Robot types that both satisfy it, then pass each to a function that accepts Speaker.' },
      { type: 'keypoints', items: ['Interfaces describe behavior through method sets.', 'Types satisfy interfaces implicitly in Go.', 'Functions can accept an interface instead of one concrete type.', 'Small interfaces are common and idiomatic.', 'Use interfaces when they make code more flexible or testable.'] }
    ]
  },
  {
    slug: 'go-packages',
    title: 'Packages & Imports',
    description: 'Organize Go code into packages, import standard library packages, and understand exported names.',
    level: 'beginner',
    section: 'Project Basics',
    order: 21,
    minutes: 13,
    content: [
      { type: 'p', text: 'A package is a way to group related Go files. Every Go file starts with a package declaration. Packages help organize code as projects grow.' },
      { type: 'h2', text: 'The main package' },
      { type: 'p', text: 'An executable program uses package main and has a main function. Library packages use other package names and provide code for programs to import.' },
      {
        type: 'code',
        title: 'main.go',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	fmt.Println("This is an executable package.")
}`
      },
      { type: 'h2', text: 'Import standard library packages' },
      {
        type: 'code',
        title: 'Multiple imports',
        language: 'go',
        code: `package main

import (
	"fmt"
	"strings"
)

func main() {
	title := "go packages"
	fmt.Println(strings.ToTitle(title))
}`
      },
      { type: 'h2', text: 'Create a small local package' },
      { type: 'p', text: 'Inside a module, you can create subfolders for packages. The import path starts with your module path, then the folder path.' },
      {
        type: 'code',
        title: 'Project layout',
        language: 'text',
        code: `hello-go/
  go.mod
  main.go
  greeting/
    greeting.go`
      },
      {
        type: 'code',
        title: 'greeting/greeting.go',
        language: 'go',
        code: `package greeting

func Message(name string) string {
	return "Hello, " + name
}`
      },
      {
        type: 'code',
        title: 'main.go',
        language: 'go',
        code: `package main

import (
	"fmt"

	"example.com/hello-go/greeting"
)

func main() {
	fmt.Println(greeting.Message("Maya"))
}`
      },
      { type: 'h2', text: 'Exported names' },
      { type: 'p', text: 'In Go, a name that starts with a capital letter is exported from its package. Other packages can use Message, but not message.' },
      { type: 'tip', text: 'Name packages after what they provide, not where they are used. For example, greeting is better than helpers for code focused on greetings.' },
      { type: 'try', text: 'Create a module with a convert package. Add an exported CelsiusToFahrenheit function and call it from main.go.' },
      { type: 'keypoints', items: ['Every Go file belongs to a package.', 'package main creates executable programs.', 'Imports let one package use another package.', 'Local package import paths start with the module path.', 'Capitalized names are exported from a package.'] }
    ]
  },
  {
    slug: 'go-errors',
    title: 'Error Handling the Go Way',
    description: 'Handle errors explicitly with error return values, nil checks, and clear control flow.',
    level: 'beginner',
    section: 'Project Basics',
    order: 22,
    minutes: 14,
    content: [
      { type: 'p', text: 'Go handles many failures with ordinary values. A function that can fail commonly returns a result and an error. If the error is nil, the operation succeeded.' },
      { type: 'h2', text: 'Return an error' },
      {
        type: 'code',
        title: 'Validate input',
        language: 'go',
        code: `package main

import (
	"errors"
	"fmt"
)

func calculateTip(bill float64, percent float64) (float64, error) {
	if bill < 0 {
		return 0, errors.New("bill cannot be negative")
	}
	if percent < 0 {
		return 0, errors.New("percent cannot be negative")
	}
	return bill * percent / 100, nil
}

func main() {
	tip, err := calculateTip(50, 20)
	if err != nil {
		fmt.Println("error:", err)
		return
	}

	fmt.Println("tip:", tip)
}`
      },
      { type: 'h2', text: 'Check errors immediately' },
      { type: 'p', text: 'The common Go style is to check err right after calling a function that can fail. This keeps the success path clear and avoids hidden exceptions.' },
      {
        type: 'code',
        title: 'A common error-checking shape',
        language: 'go',
        code: `value, err := doSomething()
if err != nil {
	return err
}

fmt.Println(value)`
      },
      { type: 'h2', text: 'Use fmt.Errorf for context' },
      { type: 'p', text: 'When passing an error upward, add context so the caller knows what operation failed. The %w verb wraps the original error for later inspection.' },
      {
        type: 'code',
        title: 'Add context to an error',
        language: 'go',
        code: `package main

import (
	"fmt"
	"strconv"
)

func parsePort(text string) (int, error) {
	port, err := strconv.Atoi(text)
	if err != nil {
		return 0, fmt.Errorf("parse port: %w", err)
	}
	return port, nil
}

func main() {
	port, err := parsePort("8080")
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("port:", port)
}`
      },
      { type: 'h2', text: 'Do not ignore errors' },
      { type: 'p', text: 'Ignoring errors can make bugs confusing. If you truly do not care about an error in a tiny example, use _ intentionally, but production code should handle it.' },
      { type: 'note', text: 'Go error handling may look repetitive at first. The benefit is that failure paths are visible in the code you are reading.' },
      { type: 'try', text: 'Write a function named withdraw that accepts a balance and amount. Return an error when the amount is greater than the balance.' },
      { type: 'keypoints', items: ['Go commonly returns a value and an error.', 'nil error means success.', 'Check err right after a call that can fail.', 'Use errors.New for simple errors.', 'Use fmt.Errorf with %w to add context when returning errors.'] }
    ]
  },
  {
    slug: 'go-defer-panic',
    title: 'defer, panic & recover',
    description: 'Use defer for cleanup and understand when panic and recover appear in Go programs.',
    level: 'beginner',
    section: 'Project Basics',
    order: 23,
    minutes: 13,
    content: [
      { type: 'p', text: 'defer, panic, and recover are special Go features. Beginners should use defer often for cleanup, understand panic, and use recover rarely.' },
      { type: 'h2', text: 'defer runs later' },
      { type: 'p', text: 'A deferred function call runs when the surrounding function returns. This is useful for cleanup such as closing files, unlocking resources, or printing final messages.' },
      {
        type: 'code',
        title: 'Defer order',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	defer fmt.Println("runs last")

	fmt.Println("runs first")
}`
      },
      { type: 'h2', text: 'Common cleanup shape' },
      {
        type: 'code',
        title: 'Defer a close',
        language: 'go',
        code: `file, err := os.Open("notes.txt")
if err != nil {
	return err
}
defer file.Close()

// Read from file here.`
      },
      { type: 'p', text: 'You will use this pattern frequently with files, network connections, response bodies, locks, and other resources that need cleanup.' },
      { type: 'h2', text: 'panic means the program cannot continue normally' },
      { type: 'p', text: 'panic stops normal execution and begins unwinding the stack, running deferred calls along the way. It is not Go normal error handling.' },
      {
        type: 'code',
        title: 'A panic example',
        language: 'go',
        code: `package main

func main() {
	panic("something went very wrong")
}`
      },
      { type: 'h2', text: 'recover catches a panic in deferred code' },
      {
        type: 'code',
        title: 'Recover demonstration',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	defer func() {
		if value := recover(); value != nil {
			fmt.Println("recovered:", value)
		}
	}()

	panic("demo panic")
}`
      },
      { type: 'warning', text: 'Do not use panic for normal problems like invalid user input or missing files. Return an error instead.' },
      { type: 'note', text: 'Most beginner Go programs need defer and error returns far more often than panic or recover.' },
      { type: 'try', text: 'Write a function that prints start, defers printing cleanup, then prints working. Call it and observe the output order.' },
      { type: 'keypoints', items: ['defer runs a function call when the surrounding function returns.', 'defer is commonly used for cleanup.', 'panic is for situations where normal execution cannot continue.', 'Deferred calls still run during panic unwinding.', 'recover is used rarely and only works inside deferred functions.'] }
    ]
  },
  {
    slug: 'go-fmt-io',
    title: 'fmt, input & basic I/O',
    description: 'Print formatted output, read beginner terminal input, and understand basic standard input/output ideas.',
    level: 'beginner',
    section: 'Project Basics',
    order: 24,
    minutes: 14,
    content: [
      { type: 'p', text: 'The fmt package helps you print output and read simple input. It is one of the first standard library packages most Go beginners use.' },
      { type: 'h2', text: 'Print, Println, and Printf' },
      {
        type: 'table',
        headers: ['Function', 'Use'],
        rows: [
          ['fmt.Print', 'Print without automatically adding a newline'],
          ['fmt.Println', 'Print values and add a newline'],
          ['fmt.Printf', 'Print using formatting verbs']
        ]
      },
      {
        type: 'code',
        title: 'Formatted output',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	name := "Maya"
	score := 95.5

	fmt.Print("Student: ")
	fmt.Println(name)
	fmt.Printf("Score: %.1f\\n", score)
}`
      },
      { type: 'h2', text: 'Common formatting verbs' },
      {
        type: 'table',
        headers: ['Verb', 'Meaning'],
        rows: [
          ['%v', 'Default value format'],
          ['%s', 'String'],
          ['%d', 'Decimal integer'],
          ['%f', 'Floating-point number'],
          ['%.2f', 'Floating-point number with 2 digits after the decimal'],
          ['%T', 'Type of the value']
        ]
      },
      { type: 'h2', text: 'Read simple input with fmt.Scanln' },
      {
        type: 'code',
        title: 'Ask for a name',
        language: 'go',
        code: `package main

import "fmt"

func main() {
	var name string

	fmt.Print("Enter your name: ")
	fmt.Scanln(&name)

	fmt.Println("Hello,", name)
}`
      },
      { type: 'h2', text: 'Read a whole line with bufio' },
      { type: 'p', text: 'fmt.Scanln is fine for tiny examples, but it stops at whitespace. Use bufio.NewReader when you want a full line of text.' },
      {
        type: 'code',
        title: 'Read a full line',
        language: 'go',
        code: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	reader := bufio.NewReader(os.Stdin)

	fmt.Print("Favorite language: ")
	line, _ := reader.ReadString('\\n')
	line = strings.TrimSpace(line)

	fmt.Println("You chose:", line)
}`
      },
      { type: 'note', text: 'The example ignores the ReadString error to keep the input lesson focused. In real programs, handle that error just like other Go errors.' },
      { type: 'try', text: 'Write a program that asks for a bill amount and tip percent using fmt.Scanln, then prints the calculated tip with two decimal places.' },
      { type: 'keypoints', items: ['fmt.Print, fmt.Println, and fmt.Printf produce terminal output.', 'Formatting verbs control how values appear.', 'fmt.Scanln reads simple input into variables through pointers.', 'bufio can read full lines from standard input.', 'Real I/O code should handle errors.'] }
    ]
  },
  {
    slug: 'go-mini-cli',
    title: 'Mini CLI: Tip Calculator',
    description: 'Put beginner Go skills together by building a small command-line tip calculator.',
    level: 'beginner',
    section: 'Putting It Together',
    order: 25,
    minutes: 15,
    content: [
      { type: 'p', text: 'Now you will combine variables, functions, errors, input, formatted output, and modules into a small command-line program. The program asks for a bill amount and tip percent, then prints the tip and total.' },
      { type: 'h2', text: 'Create the project' },
      {
        type: 'code',
        title: 'Start a module',
        language: 'bash',
        code: `mkdir tipcalc
cd tipcalc
go mod init example.com/tipcalc`
      },
      { type: 'h2', text: 'Write the program' },
      {
        type: 'code',
        title: 'main.go',
        language: 'go',
        code: `package main

import (
	"errors"
	"fmt"
)

func calculateTip(bill, percent float64) (float64, float64, error) {
	if bill < 0 {
		return 0, 0, errors.New("bill cannot be negative")
	}
	if percent < 0 {
		return 0, 0, errors.New("tip percent cannot be negative")
	}

	tip := bill * percent / 100
	total := bill + tip
	return tip, total, nil
}

func main() {
	var bill float64
	var percent float64

	fmt.Print("Bill amount: ")
	if _, err := fmt.Scanln(&bill); err != nil {
		fmt.Println("Please enter a valid bill amount.")
		return
	}

	fmt.Print("Tip percent: ")
	if _, err := fmt.Scanln(&percent); err != nil {
		fmt.Println("Please enter a valid tip percent.")
		return
	}

	tip, total, err := calculateTip(bill, percent)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	fmt.Printf("Tip: $%.2f\\n", tip)
	fmt.Printf("Total: $%.2f\\n", total)
}`
      },
      { type: 'h2', text: 'Run it' },
      {
        type: 'code',
        title: 'Run the CLI',
        language: 'bash',
        code: `go run .`
      },
      {
        type: 'code',
        title: 'Example session',
        language: 'text',
        code: `Bill amount: 50
Tip percent: 20
Tip: $10.00
Total: $60.00`
      },
      { type: 'h2', text: 'Build an executable' },
      {
        type: 'code',
        title: 'Build tipcalc',
        language: 'bash',
        code: `go build -o tipcalc`
      },
      {
        type: 'code',
        title: 'Run the built program',
        language: 'bash',
        code: `./tipcalc`
      },
      { type: 'h2', text: 'What this project used' },
      { type: 'ul', items: ['A module created with go mod init', 'Variables for user input', 'A function with multiple return values', 'Explicit error handling', 'fmt.Scanln for simple input', 'fmt.Printf for currency-style output', 'go run and go build from the Go toolchain'] },
      { type: 'h2', text: 'Ideas to improve it' },
      { type: 'ul', items: ['Ask for the number of people and split the total.', 'Use a loop so the user can calculate more than one bill.', 'Move calculation code into a separate package.', 'Add tests for calculateTip.', 'Accept command-line flags for bill and percent.'] },
      { type: 'tip', text: 'Small command-line projects are a great way to practice Go because they use real programming skills without needing a web server or database yet.' },
      { type: 'try', text: 'Add a split feature: ask how many people are paying and print the amount each person owes. Validate that the number of people is greater than zero.' },
      { type: 'keypoints', items: ['The mini CLI combines the beginner Go basics.', 'calculateTip returns tip, total, and error values.', 'Input should be validated before using it.', 'go run is useful during development, and go build creates a reusable executable.', 'You are ready to continue into testing, files, JSON, HTTP, and APIs next.'] }
    ]
  }
];
