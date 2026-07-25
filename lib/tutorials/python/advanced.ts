import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'python-iterators-generators',
    title: 'Iterators & Generators',
    description:
      'Understand Python iteration deeply: iterable objects, iterator state, generator functions, yield, lazy pipelines, and generator expressions.',
    level: 'advanced',
    section: 'Deep Python',
    order: 49,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Python loops look simple, but there is a powerful protocol underneath them. Advanced Python code often becomes clearer and faster when you understand how iteration works.',
      },
      {
        type: 'p',
        text: 'An iterable is an object that can give you an iterator. An iterator is an object that remembers where it is and returns one item at a time.',
      },
      { type: 'h2', text: 'Iterable vs iterator' },
      {
        type: 'p',
        text: 'Lists, tuples, strings, dictionaries, files, and many custom objects are iterable. Calling iter() asks an iterable for an iterator. Calling next() asks the iterator for the next value.',
      },
      {
        type: 'code',
        title: 'The protocol behind a for loop',
        language: 'python',
        code: `numbers = [10, 20, 30]
iterator = iter(numbers)

print(next(iterator))  # 10
print(next(iterator))  # 20
print(next(iterator))  # 30

# The next call would raise StopIteration`,
      },
      {
        type: 'note',
        text: 'A for loop catches StopIteration for you. That is why normal loops stop cleanly instead of showing an exception.',
      },
      { type: 'h2', text: 'Writing your own iterator class' },
      {
        type: 'p',
        text: 'A custom iterator implements __iter__ and __next__. Use this when the object needs to keep explicit iteration state.',
      },
      {
        type: 'code',
        title: 'Countdown iterator',
        language: 'python',
        code: `class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration

        value = self.current
        self.current -= 1
        return value


for number in Countdown(3):
    print(number)`,
      },
      { type: 'h2', text: 'Generators: iterator classes made simple' },
      {
        type: 'p',
        text: 'A generator function uses yield. Python pauses the function at each yield and resumes from that same spot when the next value is requested.',
      },
      {
        type: 'code',
        title: 'The same countdown as a generator',
        language: 'python',
        code: `def countdown(start):
    current = start
    while current > 0:
        yield current
        current -= 1


for number in countdown(3):
    print(number)`,
      },
      {
        type: 'tip',
        text: 'If your iterator can be described as a sequence of yielded values, a generator is usually easier to read than a full class.',
      },
      { type: 'h2', text: 'Lazy data pipelines' },
      {
        type: 'p',
        text: 'Generators are lazy. They do not build the whole result in memory. This is excellent for files, API pages, logs, streams, and large datasets.',
      },
      {
        type: 'code',
        title: 'Read only matching lines from a file',
        language: 'python',
        code: `def read_error_lines(path):
    with open(path, encoding="utf-8") as file:
        for line in file:
            if "ERROR" in line:
                yield line.strip()


for line in read_error_lines("app.log"):
    print(line)`,
      },
      { type: 'h2', text: 'Generator expressions' },
      {
        type: 'p',
        text: 'A generator expression looks like a list comprehension with parentheses. It produces values on demand instead of creating a list immediately.',
      },
      {
        type: 'code',
        title: 'Generator expression for memory-friendly sums',
        language: 'python',
        code: `prices = [12.50, 8.99, 24.00, 5.25]

total_tax = sum(price * 0.08 for price in prices)
print(round(total_tax, 2))`,
      },
      {
        type: 'table',
        headers: ['Tool', 'Creates all values now?', 'Best for'],
        rows: [
          ['List comprehension', 'Yes', 'Small and medium lists you need to reuse'],
          ['Generator expression', 'No', 'One-pass calculations and large inputs'],
          ['Generator function', 'No', 'Readable multi-step lazy pipelines'],
          ['Iterator class', 'No', 'Stateful iteration with custom behavior'],
        ],
      },
      {
        type: 'warning',
        text: 'Most iterators are consumed. Once you loop over them, they may be empty. If you need to reuse the values, store them in a list intentionally.',
      },
      {
        type: 'try',
        text: 'Write a generator called chunked(items, size) that yields small lists of a chosen size from a larger list.',
      },
      {
        type: 'keypoints',
        items: [
          'Iterable objects can produce iterators with iter().',
          'Iterator objects return values with next() until StopIteration.',
          'Generators are a concise way to build iterators with yield.',
          'Lazy iteration helps process large inputs without loading everything into memory.',
        ],
      },
    ],
  },
  {
    slug: 'python-decorators',
    title: 'Decorators',
    description:
      'Learn how decorators wrap functions, preserve metadata, accept arguments, and cleanly add cross-cutting behavior.',
    level: 'advanced',
    section: 'Deep Python',
    order: 50,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'A decorator is a function that receives another function and returns a replacement function. It lets you add behavior without editing the original function body.',
      },
      {
        type: 'p',
        text: 'Decorators are common in web routes, permission checks, caching, logging, validation, retries, timing, and test frameworks.',
      },
      { type: 'h2', text: 'Functions are values' },
      {
        type: 'p',
        text: 'In Python, a function can be assigned to a variable, passed into another function, and returned from a function. Decorators use this feature.',
      },
      {
        type: 'code',
        title: 'Passing a function into another function',
        language: 'python',
        code: `def greet(name):
    return f"Hello, {name}!"


def call_twice(func, value):
    print(func(value))
    print(func(value))


call_twice(greet, "Mina")`,
      },
      { type: 'h2', text: 'A basic decorator' },
      {
        type: 'p',
        text: 'The wrapper function runs before and after the original function. The @ syntax is short for assigning the decorated result back to the same name.',
      },
      {
        type: 'code',
        title: 'Timing a function',
        language: 'python',
        code: `from functools import wraps
from time import perf_counter


def timed(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = perf_counter()
        result = func(*args, **kwargs)
        elapsed = perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result

    return wrapper


@timed
def add(a, b):
    return a + b


print(add(3, 4))`,
      },
      {
        type: 'note',
        text: 'functools.wraps copies useful metadata like the original function name and docstring onto the wrapper. Use it in almost every function decorator.',
      },
      { type: 'h2', text: 'Decorators with arguments' },
      {
        type: 'p',
        text: 'A decorator that accepts settings has three layers: one function receives the settings, one receives the function, and one wraps the call.',
      },
      {
        type: 'code',
        title: 'Retry decorator with settings',
        language: 'python',
        code: `from functools import wraps
from time import sleep


def retry(times=3, delay=0.2):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_error = None

            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as error:
                    last_error = error
                    print(f"Attempt {attempt} failed: {error}")
                    sleep(delay)

            raise last_error

        return wrapper

    return decorator


@retry(times=2, delay=0.1)
def fetch_user():
    raise RuntimeError("Temporary outage")`,
      },
      { type: 'h2', text: 'Real-world decorator shape' },
      {
        type: 'p',
        text: 'A decorator should usually do one job. Keep wrappers small and make the behavior obvious from the decorator name.',
      },
      {
        type: 'code',
        title: 'Permission check decorator',
        language: 'python',
        code: `from functools import wraps


def require_role(role):
    def decorator(func):
        @wraps(func)
        def wrapper(user, *args, **kwargs):
            if role not in user["roles"]:
                raise PermissionError(f"{role} role required")
            return func(user, *args, **kwargs)

        return wrapper

    return decorator


@require_role("admin")
def delete_project(user, project_id):
    return f"Deleted project {project_id}"


admin = {"name": "Ava", "roles": ["admin"]}
print(delete_project(admin, 42))`,
      },
      {
        type: 'table',
        headers: ['Decorator use', 'What it adds', 'Common example'],
        rows: [
          ['Logging', 'Records calls and results', 'Audit important actions'],
          ['Timing', 'Measures execution duration', 'Find slow functions'],
          ['Validation', 'Checks inputs before running', 'API request validation'],
          ['Authorization', 'Blocks callers without permission', 'Admin-only routes'],
          ['Caching', 'Reuses previous results', 'Expensive pure calculations'],
        ],
      },
      {
        type: 'warning',
        text: 'Do not hide surprising behavior inside decorators. If a decorator changes return types, swallows errors, or performs network work, document it clearly.',
      },
      {
        type: 'try',
        text: 'Create a decorator called print_args that prints positional and keyword arguments before calling the original function.',
      },
      {
        type: 'keypoints',
        items: [
          'A decorator takes a function and returns a function.',
          'Use *args and **kwargs so wrappers work with many function signatures.',
          'Use functools.wraps to preserve metadata.',
          'Decorator factories let you pass configuration into decorators.',
        ],
      },
    ],
  },
  {
    slug: 'python-context-managers',
    title: 'Context Managers',
    description:
      'Use with statements, __enter__, __exit__, contextlib, and ExitStack to manage resources safely and clearly.',
    level: 'advanced',
    section: 'Deep Python',
    order: 51,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'A context manager sets something up, lets your code run, and then cleans up reliably. The with statement is the visible part of this pattern.',
      },
      {
        type: 'p',
        text: 'Files, locks, database sessions, temporary directories, network connections, and test patches are common context managers.',
      },
      { type: 'h2', text: 'Why with matters' },
      {
        type: 'p',
        text: 'Cleanup should happen even if an exception occurs. A context manager makes that rule local and easy to read.',
      },
      {
        type: 'code',
        title: 'File cleanup is automatic',
        language: 'python',
        code: `with open("report.txt", "w", encoding="utf-8") as file:
    file.write("Revenue report\\n")
    file.write("Status: draft\\n")

# The file is closed here, even if writing raised an exception.`,
      },
      { type: 'h2', text: 'Class-based context managers' },
      {
        type: 'p',
        text: 'A class becomes a context manager by implementing __enter__ and __exit__. __enter__ returns the value assigned after as. __exit__ receives exception details.',
      },
      {
        type: 'code',
        title: 'Measure a block of code',
        language: 'python',
        code: `from time import perf_counter


class Timer:
    def __enter__(self):
        self.start = perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = perf_counter() - self.start
        print(f"Elapsed: {self.elapsed:.4f}s")
        return False


with Timer() as timer:
    sum(range(1_000_000))`,
      },
      {
        type: 'note',
        text: 'Returning False from __exit__ means exceptions should continue normally. Returning True suppresses the exception, which should be rare and intentional.',
      },
      { type: 'h2', text: 'Function-based context managers' },
      {
        type: 'p',
        text: 'contextlib.contextmanager lets you write a context manager as a generator. Code before yield is setup. Code after yield is cleanup.',
      },
      {
        type: 'code',
        title: 'Temporary current directory',
        language: 'python',
        code: `from contextlib import contextmanager
from pathlib import Path
import os


@contextmanager
def change_dir(path):
    previous = Path.cwd()
    os.chdir(path)
    try:
        yield Path.cwd()
    finally:
        os.chdir(previous)


with change_dir("data") as current:
    print(f"Working in {current}")`,
      },
      { type: 'h2', text: 'Managing many resources with ExitStack' },
      {
        type: 'p',
        text: 'When the number of resources is dynamic, ExitStack can enter multiple context managers and clean them up in the correct reverse order.',
      },
      {
        type: 'code',
        title: 'Open several files safely',
        language: 'python',
        code: `from contextlib import ExitStack


paths = ["a.txt", "b.txt", "c.txt"]

with ExitStack() as stack:
    files = [
        stack.enter_context(open(path, encoding="utf-8"))
        for path in paths
    ]

    for file in files:
        print(file.readline().strip())`,
      },
      {
        type: 'table',
        headers: ['Pattern', 'Use when'],
        rows: [
          ['with open(...)', 'A built-in object already supports context management'],
          ['Class with __enter__/__exit__', 'You need explicit state and reusable behavior'],
          ['@contextmanager', 'Setup and cleanup fit naturally around one yield'],
          ['ExitStack', 'The number of managed resources is decided at runtime'],
        ],
      },
      {
        type: 'try',
        text: 'Create a context manager called temporary_env that sets an environment variable inside the with block and restores the old value afterward.',
      },
      {
        type: 'keypoints',
        items: [
          'Context managers make setup and cleanup reliable.',
          '__enter__ prepares the resource and __exit__ cleans it up.',
          'Use finally in generator-based context managers for safe cleanup.',
          'Suppress exceptions only when that behavior is truly expected.',
        ],
      },
    ],
  },
  {
    slug: 'python-async',
    title: 'Async IO Basics',
    description:
      'Learn async, await, tasks, gather, timeouts, and the difference between concurrent I/O and faster CPU work.',
    level: 'advanced',
    section: 'Concurrency',
    order: 52,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Async IO is Python concurrency for waiting. It helps one thread make progress on other work while network requests, timers, files, or sockets are waiting.',
      },
      {
        type: 'p',
        text: 'Async code is not automatically faster. It shines when your program spends a lot of time waiting for I/O.',
      },
      { type: 'h2', text: 'Coroutines and await' },
      {
        type: 'p',
        text: 'An async def function returns a coroutine. The coroutine does not run to completion until it is awaited or scheduled as a task.',
      },
      {
        type: 'code',
        title: 'A small async program',
        language: 'python',
        code: `import asyncio


async def say_after(delay, message):
    await asyncio.sleep(delay)
    print(message)


async def main():
    await say_after(1, "hello")
    await say_after(1, "world")


asyncio.run(main())`,
      },
      {
        type: 'note',
        text: 'asyncio.sleep does not block the event loop. It gives control back so other async work can run.',
      },
      { type: 'h2', text: 'Running tasks concurrently' },
      {
        type: 'p',
        text: 'If you await one operation and then await another, they run one after the other. Use tasks or gather when independent operations can overlap.',
      },
      {
        type: 'code',
        title: 'Overlap independent work',
        language: 'python',
        code: `import asyncio


async def fetch_profile(user_id):
    await asyncio.sleep(1)
    return {"id": user_id, "name": "User " + str(user_id)}


async def main():
    users = await asyncio.gather(
        fetch_profile(1),
        fetch_profile(2),
        fetch_profile(3),
    )
    print(users)


asyncio.run(main())`,
      },
      { type: 'h2', text: 'Tasks for work you schedule now' },
      {
        type: 'p',
        text: 'create_task schedules a coroutine to run soon. Keep a reference to the task so you can await it, inspect it, or cancel it.',
      },
      {
        type: 'code',
        title: 'Create and await tasks',
        language: 'python',
        code: `import asyncio


async def download(name, seconds):
    await asyncio.sleep(seconds)
    return f"{name} complete"


async def main():
    first = asyncio.create_task(download("images", 2))
    second = asyncio.create_task(download("metadata", 1))

    print(await second)
    print(await first)


asyncio.run(main())`,
      },
      { type: 'h2', text: 'Timeouts and cancellation' },
      {
        type: 'p',
        text: 'Production async code should avoid waiting forever. Use timeouts around external calls and handle cancellation cleanly.',
      },
      {
        type: 'code',
        title: 'Add a timeout',
        language: 'python',
        code: `import asyncio


async def slow_operation():
    await asyncio.sleep(5)
    return "done"


async def main():
    try:
        result = await asyncio.wait_for(slow_operation(), timeout=1)
        print(result)
    except asyncio.TimeoutError:
        print("Operation took too long")


asyncio.run(main())`,
      },
      {
        type: 'table',
        headers: ['Concept', 'Means'],
        rows: [
          ['Coroutine', 'Async work that can be awaited'],
          ['Event loop', 'Scheduler that runs async tasks'],
          ['await', 'Pause this coroutine until another awaitable finishes'],
          ['Task', 'A scheduled coroutine'],
          ['gather', 'Wait for multiple awaitables and collect results'],
        ],
      },
      {
        type: 'warning',
        text: 'Do not call blocking functions like time.sleep or heavy CPU loops inside async functions. They block the event loop and prevent other tasks from running.',
      },
      {
        type: 'try',
        text: 'Write an async function that checks three fake URLs concurrently with asyncio.sleep and prints the fastest result first.',
      },
      {
        type: 'keypoints',
        items: [
          'Async IO is best for overlapping waiting time.',
          'Use await to pause one coroutine without blocking the whole event loop.',
          'Use gather or tasks for independent concurrent operations.',
          'Add timeouts around external services.',
        ],
      },
    ],
  },
  {
    slug: 'python-concurrency',
    title: 'Threads, Processes & When to Use What',
    description:
      'Compare synchronous code, threading, multiprocessing, async IO, queues, and practical decision rules for Python concurrency.',
    level: 'advanced',
    section: 'Concurrency',
    order: 53,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Concurrency means dealing with multiple tasks during the same period of time. It does not always mean multiple CPU cores are doing work at the same instant.',
      },
      {
        type: 'p',
        text: 'Python gives you several concurrency tools. The right choice depends on whether your program is waiting on I/O or burning CPU.',
      },
      { type: 'h2', text: 'The practical decision' },
      {
        type: 'table',
        headers: ['Workload', 'Good choice', 'Why'],
        rows: [
          ['Many web requests', 'async IO or threads', 'Most time is spent waiting for networks'],
          ['File downloads', 'threads or async IO', 'Waiting can overlap'],
          ['Image resizing', 'processes', 'CPU-heavy work can use multiple cores'],
          ['Data parsing with pure Python loops', 'processes', 'Avoids the GIL for CPU-bound code'],
          ['Simple scripts', 'synchronous code', 'Often easiest and fast enough'],
        ],
      },
      {
        type: 'note',
        text: 'The Global Interpreter Lock, or GIL, means Python threads do not usually speed up CPU-bound Python bytecode. Threads can still help I/O-bound tasks.',
      },
      { type: 'h2', text: 'Threads for blocking I/O' },
      {
        type: 'p',
        text: 'Threads are useful when you need to call blocking libraries and wait for I/O. The concurrent.futures API is a clean starting point.',
      },
      {
        type: 'code',
        title: 'Thread pool example',
        language: 'python',
        code: `from concurrent.futures import ThreadPoolExecutor
from time import sleep


def fetch_report(report_id):
    sleep(1)
    return f"report-{report_id}"


with ThreadPoolExecutor(max_workers=4) as executor:
    results = executor.map(fetch_report, [1, 2, 3, 4])

for result in results:
    print(result)`,
      },
      { type: 'h2', text: 'Processes for CPU-heavy work' },
      {
        type: 'p',
        text: 'Processes have separate Python interpreters. They cost more memory than threads, but they can run CPU-heavy Python code on multiple cores.',
      },
      {
        type: 'code',
        title: 'Process pool example',
        language: 'python',
        code: `from concurrent.futures import ProcessPoolExecutor


def count_factors(number):
    count = 0
    for candidate in range(1, number + 1):
        if number % candidate == 0:
            count += 1
    return number, count


if __name__ == "__main__":
    numbers = [80_000, 90_000, 100_000]

    with ProcessPoolExecutor() as executor:
        for number, count in executor.map(count_factors, numbers):
            print(number, count)`,
      },
      {
        type: 'warning',
        text: 'On Windows and macOS, protect multiprocessing startup code with if __name__ == "__main__". This prevents child processes from accidentally starting more child processes.',
      },
      { type: 'h2', text: 'Queues for communication' },
      {
        type: 'p',
        text: 'Shared mutable state is where many concurrency bugs begin. Queues make communication explicit and safer.',
      },
      {
        type: 'code',
        title: 'Threaded producer and consumer',
        language: 'python',
        code: `from queue import Queue
from threading import Thread


def worker(queue):
    while True:
        item = queue.get()
        if item is None:
            break
        print(f"Processing {item}")
        queue.task_done()


queue = Queue()
thread = Thread(target=worker, args=(queue,))
thread.start()

for item in ["email", "invoice", "backup"]:
    queue.put(item)

queue.join()
queue.put(None)
thread.join()`,
      },
      { type: 'h2', text: 'A simple choice checklist' },
      {
        type: 'ol',
        items: [
          'Start with clear synchronous code.',
          'Measure where time is spent.',
          'If the program waits on I/O, consider async IO or threads.',
          'If the program uses CPU heavily, consider multiprocessing or native/vectorized libraries.',
          'Limit concurrency with worker counts, semaphores, or queues.',
          'Add timeouts, retries, cancellation, and logging before production use.',
        ],
      },
      {
        type: 'try',
        text: 'Take a slow script you wrote before. Identify whether it is I/O-bound or CPU-bound, then choose the simplest concurrency tool that matches.',
      },
      {
        type: 'keypoints',
        items: [
          'Threads are practical for blocking I/O.',
          'Processes are practical for CPU-bound Python work.',
          'Async IO is powerful for many concurrent I/O operations.',
          'Queues reduce shared-state bugs by making handoff explicit.',
        ],
      },
    ],
  },
  {
    slug: 'python-oop-patterns',
    title: 'Practical OOP Patterns',
    description:
      'Use dataclasses, composition, protocols, dependency injection, factories, and repositories without over-engineering.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 54,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Object-oriented Python is most useful when objects model responsibilities, not just data shapes. Good OOP makes change easier because behavior has a clear home.',
      },
      {
        type: 'p',
        text: 'Advanced OOP in Python is often lighter than in other languages. You can combine classes, dataclasses, functions, and protocols instead of forcing every idea into inheritance.',
      },
      { type: 'h2', text: 'Dataclasses for simple domain objects' },
      {
        type: 'p',
        text: 'A dataclass removes boilerplate for objects that mostly store fields. Add methods when behavior naturally belongs with the data.',
      },
      {
        type: 'code',
        title: 'A small value object',
        language: 'python',
        code: `from dataclasses import dataclass


@dataclass(frozen=True)
class Money:
    amount: int
    currency: str = "USD"

    def format(self):
        dollars = self.amount / 100
        return f"{self.currency} {dollars:.2f}"


price = Money(1299)
print(price.format())`,
      },
      { type: 'h2', text: 'Composition over deep inheritance' },
      {
        type: 'p',
        text: 'Inheritance is useful for true is-a relationships. Composition is often better when an object simply uses another object to do part of its job.',
      },
      {
        type: 'code',
        title: 'Inject a notifier instead of subclassing',
        language: 'python',
        code: `class EmailNotifier:
    def send(self, message):
        print(f"Email: {message}")


class OrderService:
    def __init__(self, notifier):
        self.notifier = notifier

    def place_order(self, item):
        order_id = "ORD-1001"
        self.notifier.send(f"Order {order_id} placed for {item}")
        return order_id


service = OrderService(EmailNotifier())
service.place_order("keyboard")`,
      },
      { type: 'h2', text: 'Protocols for flexible contracts' },
      {
        type: 'p',
        text: 'A protocol describes the methods an object must have. This supports duck typing while still helping type checkers understand your design.',
      },
      {
        type: 'code',
        title: 'Notifier protocol',
        language: 'python',
        code: `from typing import Protocol


class Notifier(Protocol):
    def send(self, message: str) -> None:
        ...


class SmsNotifier:
    def send(self, message: str) -> None:
        print(f"SMS: {message}")


def alert_admin(notifier: Notifier, message: str) -> None:
    notifier.send("[admin] " + message)


alert_admin(SmsNotifier(), "Disk space low")`,
      },
      { type: 'h2', text: 'Factories for creation decisions' },
      {
        type: 'p',
        text: 'A factory function keeps object creation rules in one place. Use one when callers should not know which concrete class to instantiate.',
      },
      {
        type: 'code',
        title: 'Create a notifier from config',
        language: 'python',
        code: `class ConsoleNotifier:
    def send(self, message):
        print(message)


class SilentNotifier:
    def send(self, message):
        pass


def create_notifier(environment):
    if environment == "test":
        return SilentNotifier()
    return ConsoleNotifier()


notifier = create_notifier("prod")
notifier.send("Application started")`,
      },
      { type: 'h2', text: 'Repository pattern for persistence boundaries' },
      {
        type: 'p',
        text: 'A repository hides storage details from business logic. Your service should ask for customers, orders, or tasks without caring if they come from SQLite, Postgres, JSON, or an API.',
      },
      {
        type: 'code',
        title: 'Service depending on a repository',
        language: 'python',
        code: `class TaskService:
    def __init__(self, repository):
        self.repository = repository

    def complete_task(self, task_id):
        task = self.repository.get(task_id)
        task["done"] = True
        self.repository.save(task)
        return task`,
      },
      {
        type: 'table',
        headers: ['Pattern', 'Use it when'],
        rows: [
          ['Dataclass', 'You need a clear data object with little boilerplate'],
          ['Composition', 'An object delegates work to another object'],
          ['Protocol', 'Many classes can satisfy the same behavior contract'],
          ['Factory', 'Creation rules would otherwise spread through the codebase'],
          ['Repository', 'Business logic should not know storage details'],
        ],
      },
      {
        type: 'warning',
        text: 'Do not add patterns just because they sound professional. Add a pattern when it removes real duplication, isolates change, or makes testing easier.',
      },
      {
        type: 'try',
        text: 'Refactor a script with global functions into a TaskService that receives a repository object in its constructor.',
      },
      {
        type: 'keypoints',
        items: [
          'Prefer small classes with one clear responsibility.',
          'Use composition when behavior can be delegated.',
          'Protocols give structure without requiring inheritance.',
          'Factories and repositories help isolate decisions that change.',
        ],
      },
    ],
  },
  {
    slug: 'python-project-structure',
    title: 'Structuring Larger Python Projects',
    description:
      'Organize Python applications with packages, src layout, tests, configuration, entry points, and clear boundaries.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 55,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'A larger Python project needs more than working files. It needs a structure that makes imports predictable, tests reliable, and ownership understandable.',
      },
      {
        type: 'p',
        text: 'There is no single perfect layout, but many professional projects use a src layout because it prevents accidental imports from the project root.',
      },
      { type: 'h2', text: 'A reliable application layout' },
      {
        type: 'code',
        title: 'Example src layout',
        language: 'text',
        code: `taskflow/
  pyproject.toml
  README.md
  .gitignore
  src/
    taskflow/
      __init__.py
      cli.py
      config.py
      services.py
      repositories.py
  tests/
    test_services.py
    test_repositories.py`,
      },
      {
        type: 'p',
        text: 'The importable package lives in src/taskflow. Tests live outside the package and import it like real users would.',
      },
      { type: 'h2', text: 'Keep modules focused' },
      {
        type: 'table',
        headers: ['Module', 'Responsibility'],
        rows: [
          ['cli.py', 'Parse command-line input and call application services'],
          ['config.py', 'Read environment variables and settings'],
          ['services.py', 'Business actions and use cases'],
          ['repositories.py', 'Persistence and external storage'],
          ['models.py', 'Dataclasses or typed domain objects'],
          ['exceptions.py', 'Custom exceptions used across the package'],
        ],
      },
      {
        type: 'code',
        title: 'Imports from the package, not from random paths',
        language: 'python',
        code: `# src/taskflow/cli.py
from taskflow.config import load_config
from taskflow.services import TaskService


def main():
    config = load_config()
    service = TaskService(config.task_file)
    print(service.list_tasks())`,
      },
      { type: 'h2', text: 'Use pyproject.toml as the project center' },
      {
        type: 'p',
        text: 'Modern Python tools use pyproject.toml for package metadata and tool configuration. It keeps setup information in one predictable file.',
      },
      {
        type: 'code',
        title: 'Minimal pyproject.toml',
        language: 'toml',
        code: `[project]
name = "taskflow"
version = "0.1.0"
description = "A small task management tool"
requires-python = ">=3.11"
dependencies = []

[project.scripts]
taskflow = "taskflow.cli:main"

[tool.pytest.ini_options]
testpaths = ["tests"]`,
      },
      { type: 'h2', text: 'Separate boundaries' },
      {
        type: 'p',
        text: 'Good structure separates external details from core decisions. A service should not parse command-line arguments, and a CLI should not know how JSON is stored on disk.',
      },
      {
        type: 'code',
        title: 'A service boundary',
        language: 'python',
        code: `# src/taskflow/services.py
class TaskService:
    def __init__(self, repository):
        self.repository = repository

    def add_task(self, title):
        if not title.strip():
            raise ValueError("Task title is required")

        return self.repository.create(title.strip())`,
      },
      {
        type: 'tip',
        text: 'A simple test: if you can replace the CLI with a web API without rewriting the service layer, your boundaries are probably healthy.',
      },
      { type: 'h2', text: 'Common structure mistakes' },
      {
        type: 'ul',
        items: [
          'Putting every function into one large utils.py file.',
          'Making tests depend on the current working directory.',
          'Mixing printing, input parsing, file storage, and business rules in one function.',
          'Using sys.path hacks instead of installing the package in editable mode.',
          'Letting module names shadow standard library modules, such as json.py or email.py.',
        ],
      },
      {
        type: 'try',
        text: 'Take a one-file script and sketch a src layout with separate CLI, service, and repository modules.',
      },
      {
        type: 'keypoints',
        items: [
          'Use packages to make imports and ownership clear.',
          'The src layout helps tests import your package like real users do.',
          'pyproject.toml is the modern home for package metadata and tool settings.',
          'Separate interfaces, business logic, and storage details.',
        ],
      },
    ],
  },
  {
    slug: 'python-packaging',
    title: 'Packaging & Distributing Python Code',
    description:
      'Package Python code with pyproject.toml, build wheels, expose console scripts, and understand versioning and distribution basics.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 56,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Packaging turns your code into something other people, servers, and tools can install reliably. Even private application teams benefit from packaging discipline.',
      },
      {
        type: 'p',
        text: 'Modern Python packaging starts with pyproject.toml. It describes the project and tells build tools how to create installable artifacts.',
      },
      { type: 'h2', text: 'Project metadata' },
      {
        type: 'code',
        title: 'pyproject.toml with setuptools',
        language: 'toml',
        code: `[build-system]
requires = ["setuptools>=69", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "weather-tools"
version = "0.1.0"
description = "Utilities for working with weather data"
readme = "README.md"
requires-python = ">=3.11"
authors = [{ name = "Your Name" }]
dependencies = [
  "requests",
]

[project.optional-dependencies]
dev = ["pytest", "ruff"]

[project.scripts]
weather-tools = "weather_tools.cli:main"`,
      },
      {
        type: 'note',
        text: 'The import package name can use underscores, while the distribution package name often uses hyphens. For example, weather-tools may import as weather_tools.',
      },
      { type: 'h2', text: 'Build artifacts' },
      {
        type: 'p',
        text: 'A wheel is the common installable artifact. A source distribution contains source files and metadata. Build both when publishing a reusable library.',
      },
      {
        type: 'code',
        title: 'Build a package locally',
        language: 'bash',
        code: `python -m pip install --upgrade build
python -m build

# Artifacts appear in dist/
python -m pip install dist/weather_tools-0.1.0-py3-none-any.whl`,
      },
      { type: 'h2', text: 'Editable installs for development' },
      {
        type: 'p',
        text: 'An editable install makes your package importable while pointing at your working source files. It is ideal for local development and tests.',
      },
      {
        type: 'code',
        title: 'Install your package for development',
        language: 'bash',
        code: `python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
pytest`,
      },
      { type: 'h2', text: 'Console scripts' },
      {
        type: 'p',
        text: 'A console script creates a command that calls a Python function. The function should take no required arguments and usually delegates to argparse or another CLI parser.',
      },
      {
        type: 'code',
        title: 'CLI entry point target',
        language: 'python',
        code: `# src/weather_tools/cli.py
def main():
    print("Weather tools ready")


if __name__ == "__main__":
    main()`,
      },
      { type: 'h2', text: 'Versioning basics' },
      {
        type: 'p',
        text: 'Semantic versioning uses MAJOR.MINOR.PATCH. Increase PATCH for bug fixes, MINOR for backward-compatible features, and MAJOR for breaking changes.',
      },
      {
        type: 'table',
        headers: ['Change', 'Example', 'Version bump'],
        rows: [
          ['Bug fix', 'Fix timezone parsing', '0.1.0 to 0.1.1'],
          ['Feature', 'Add CSV export', '0.1.1 to 0.2.0'],
          ['Breaking change', 'Rename public function', '0.2.0 to 1.0.0'],
        ],
      },
      {
        type: 'warning',
        text: 'Never publish secrets, tokens, private test data, or local configuration files in a package. Review your MANIFEST and built artifacts before publishing.',
      },
      {
        type: 'try',
        text: 'Create a tiny package with a console script called hello-python, install it with pip install -e ., and run the command from your terminal.',
      },
      {
        type: 'keypoints',
        items: [
          'pyproject.toml is the central packaging configuration file.',
          'Wheels are installable package artifacts.',
          'Editable installs make local development smoother.',
          'Console scripts expose Python functions as terminal commands.',
        ],
      },
    ],
  },
  {
    slug: 'python-performance',
    title: 'Performance Mindset & Profiling',
    description:
      'Approach Python performance scientifically with measurement, profiling, better algorithms, caching, streaming, and focused optimization.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 57,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Performance work starts with a question: what is slow for the user or system? Guessing usually leads to changes that make code harder without making it meaningfully faster.',
      },
      {
        type: 'p',
        text: 'Advanced Python developers measure first, improve the biggest bottleneck, and keep code readable unless the performance win is worth the complexity.',
      },
      { type: 'h2', text: 'Measure a small piece with timeit' },
      {
        type: 'p',
        text: 'Use timeit for small expressions or functions. It runs code many times to reduce noise.',
      },
      {
        type: 'code',
        title: 'Compare membership checks',
        language: 'python',
        code: `from timeit import timeit


setup = """
values_list = list(range(10_000))
values_set = set(values_list)
"""

list_time = timeit("9999 in values_list", setup=setup, number=10_000)
set_time = timeit("9999 in values_set", setup=setup, number=10_000)

print(f"list: {list_time:.4f}s")
print(f"set:  {set_time:.4f}s")`,
      },
      { type: 'h2', text: 'Profile whole programs with cProfile' },
      {
        type: 'p',
        text: 'A profiler shows where time is actually spent. cProfile is built into Python and is often enough for a first pass.',
      },
      {
        type: 'code',
        title: 'Run cProfile from the terminal',
        language: 'bash',
        code: `python -m cProfile -s cumulative app.py`,
      },
      {
        type: 'code',
        title: 'Profile a function in code',
        language: 'python',
        code: `import cProfile
import pstats


def main():
    total = sum(i * i for i in range(2_000_000))
    print(total)


profiler = cProfile.Profile()
profiler.enable()
main()
profiler.disable()

stats = pstats.Stats(profiler).sort_stats("cumulative")
stats.print_stats(10)`,
      },
      { type: 'h2', text: 'Improve algorithms before micro-optimizing' },
      {
        type: 'p',
        text: 'The biggest wins often come from choosing better data structures or avoiding repeated work.',
      },
      {
        type: 'code',
        title: 'Avoid nested search with a dictionary',
        language: 'python',
        code: `users = [
    {"id": 1, "name": "Ava"},
    {"id": 2, "name": "Noah"},
]
orders = [
    {"id": 101, "user_id": 2},
    {"id": 102, "user_id": 1},
]

users_by_id = {user["id"]: user for user in users}

for order in orders:
    user = users_by_id[order["user_id"]]
    print(order["id"], user["name"])`,
      },
      { type: 'h2', text: 'Cache expensive pure work' },
      {
        type: 'p',
        text: 'If a function is deterministic and called repeatedly with the same arguments, functools.lru_cache can remove repeated computation.',
      },
      {
        type: 'code',
        title: 'Memoize repeated calls',
        language: 'python',
        code: `from functools import lru_cache


@lru_cache(maxsize=1024)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


print(fibonacci(35))`,
      },
      {
        type: 'warning',
        text: 'Do not cache functions that depend on hidden changing state, such as the current time, database contents, random numbers, or user permissions.',
      },
      { type: 'h2', text: 'Stream large data' },
      {
        type: 'p',
        text: 'Memory is part of performance. A script that loads a huge file into a list may be slower and less reliable than one that streams line by line.',
      },
      {
        type: 'code',
        title: 'Process a large file one line at a time',
        language: 'python',
        code: `def count_matching_lines(path, word):
    count = 0
    with open(path, encoding="utf-8") as file:
        for line in file:
            if word in line:
                count += 1
    return count`,
      },
      {
        type: 'table',
        headers: ['Technique', 'Use for'],
        rows: [
          ['timeit', 'Small code comparisons'],
          ['cProfile', 'Finding hot functions in a program'],
          ['Better data structures', 'Large algorithmic wins'],
          ['lru_cache', 'Repeated pure calculations'],
          ['Generators', 'Memory-friendly pipelines'],
        ],
      },
      {
        type: 'try',
        text: 'Profile one Python script with cProfile and write down the top three functions by cumulative time.',
      },
      {
        type: 'keypoints',
        items: [
          'Measure before optimizing.',
          'Algorithm and data structure changes usually beat tiny syntax tricks.',
          'Use caching only when repeated results are safe to reuse.',
          'Streaming can improve both speed and memory use.',
        ],
      },
    ],
  },
  {
    slug: 'python-security',
    title: 'Security Basics for Python Apps',
    description:
      'Protect Python applications with safe input handling, secret management, dependency hygiene, authentication basics, and secure defaults.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 58,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Security is not one library or one final checklist. It is a habit of treating input, configuration, dependencies, and permissions with care.',
      },
      {
        type: 'p',
        text: 'Python apps often touch files, databases, APIs, queues, templates, and user data. Each boundary is a place where assumptions can become vulnerabilities.',
      },
      { type: 'h2', text: 'Never trust raw input' },
      {
        type: 'p',
        text: 'Validate input at the boundary. Convert it to the types your application expects before deeper logic uses it.',
      },
      {
        type: 'code',
        title: 'Validate and normalize input',
        language: 'python',
        code: `def parse_quantity(raw_value):
    try:
        quantity = int(raw_value)
    except ValueError as error:
        raise ValueError("Quantity must be a number") from error

    if quantity < 1 or quantity > 100:
        raise ValueError("Quantity must be between 1 and 100")

    return quantity`,
      },
      { type: 'h2', text: 'Use parameterized database queries' },
      {
        type: 'p',
        text: 'Do not build SQL by joining strings with user input. Parameterized queries tell the database which parts are data.',
      },
      {
        type: 'code',
        title: 'Parameterized SQLite query',
        language: 'python',
        code: `import sqlite3


def find_user_by_email(connection, email):
    cursor = connection.execute(
        "SELECT id, email FROM users WHERE email = ?",
        (email,),
    )
    return cursor.fetchone()


connection = sqlite3.connect("app.db")
print(find_user_by_email(connection, "admin@example.com"))`,
      },
      {
        type: 'warning',
        text: 'String formatting SQL with f-strings or + can create SQL injection vulnerabilities. Use your database driver or ORM parameter system.',
      },
      { type: 'h2', text: 'Keep secrets out of code' },
      {
        type: 'p',
        text: 'API keys, tokens, database passwords, and private keys should come from environment variables or a secret manager. They should not be committed to Git.',
      },
      {
        type: 'code',
        title: 'Read a required secret from the environment',
        language: 'python',
        code: `import os


def get_required_env(name):
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


database_url = get_required_env("DATABASE_URL")`,
      },
      { type: 'h2', text: 'Handle passwords with purpose-built tools' },
      {
        type: 'p',
        text: 'Never store plain-text passwords. In real applications, use proven password hashing libraries such as argon2-cffi, bcrypt, or passlib with a modern algorithm.',
      },
      {
        type: 'code',
        title: 'Shape of password hashing code',
        language: 'python',
        code: `# Example shape only. Use a trusted password hashing library in real apps.
def register_user(email, raw_password, password_hasher):
    password_hash = password_hasher.hash(raw_password)
    return {"email": email, "password_hash": password_hash}


def verify_login(user, raw_password, password_hasher):
    return password_hasher.verify(raw_password, user["password_hash"])`,
      },
      { type: 'h2', text: 'Dependency hygiene' },
      {
        type: 'p',
        text: 'Dependencies are part of your application. Pin versions for applications, update regularly, and pay attention to security advisories.',
      },
      {
        type: 'code',
        title: 'Common dependency checks',
        language: 'bash',
        code: `python -m pip list --outdated
python -m pip audit`,
      },
      {
        type: 'note',
        text: 'pip audit may need to be installed in your environment. Many teams run dependency scanning in CI so security checks happen continuously.',
      },
      {
        type: 'table',
        headers: ['Risk', 'Safer habit'],
        rows: [
          ['SQL injection', 'Use parameterized queries'],
          ['Secret leakage', 'Use environment variables or secret managers'],
          ['Path traversal', 'Resolve and restrict file paths'],
          ['Unsafe deserialization', 'Avoid loading untrusted pickle data'],
          ['Over-permissioned tokens', 'Use least privilege and rotate credentials'],
        ],
      },
      {
        type: 'try',
        text: 'Review a small Python app and list every place data crosses a boundary: HTTP, CLI arguments, files, environment variables, and database calls.',
      },
      {
        type: 'keypoints',
        items: [
          'Validate input at the boundary.',
          'Use parameterized queries for database access.',
          'Keep secrets out of source code and logs.',
          'Do not deserialize untrusted data with pickle.',
          'Keep dependencies updated and scanned.',
        ],
      },
    ],
  },
  {
    slug: 'python-project-cli',
    title: 'Mini Project: CLI Task Manager',
    description:
      'Build a small command-line task manager with argparse, JSON storage, a clean file structure, and practical commands.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 59,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project builds a command-line task manager. You will practice project structure, argparse, JSON files, dataclasses, and clean separation between interface and storage.',
      },
      { type: 'h2', text: 'What you will build' },
      {
        type: 'ul',
        items: [
          'task add "Buy milk" adds a task.',
          'task list shows all tasks.',
          'task done 1 marks a task complete.',
          'task delete 1 removes a task.',
          'Tasks are stored in a local JSON file.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the file structure' },
      {
        type: 'code',
        title: 'Project tree',
        language: 'text',
        code: `task-manager/
  pyproject.toml
  src/
    task_manager/
      __init__.py
      cli.py
      models.py
      storage.py
  tests/
    test_storage.py`,
      },
      {
        type: 'code',
        title: 'Create folders',
        language: 'bash',
        code: `mkdir -p task-manager/src/task_manager task-manager/tests
cd task-manager
touch src/task_manager/__init__.py`,
      },
      { type: 'h2', text: 'Step 2: Add package configuration' },
      {
        type: 'code',
        title: 'pyproject.toml',
        language: 'toml',
        code: `[build-system]
requires = ["setuptools>=69", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "task-manager"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []

[project.scripts]
task = "task_manager.cli:main"

[project.optional-dependencies]
dev = ["pytest"]`,
      },
      { type: 'h2', text: 'Step 3: Model a task' },
      {
        type: 'p',
        text: 'Use a dataclass for the task shape. Add conversion helpers so JSON storage stays simple.',
      },
      {
        type: 'code',
        title: 'src/task_manager/models.py',
        language: 'python',
        code: `from dataclasses import dataclass


@dataclass
class Task:
    id: int
    title: str
    done: bool = False

    @classmethod
    def from_dict(cls, data):
        return cls(
            id=data["id"],
            title=data["title"],
            done=data.get("done", False),
        )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "done": self.done,
        }`,
      },
      { type: 'h2', text: 'Step 4: Store tasks in JSON' },
      {
        type: 'p',
        text: 'The storage module owns file reading and writing. The CLI should not know JSON details.',
      },
      {
        type: 'code',
        title: 'src/task_manager/storage.py',
        language: 'python',
        code: `import json
from pathlib import Path

from task_manager.models import Task


DEFAULT_PATH = Path.home() / ".task-manager.json"


class TaskStore:
    def __init__(self, path=DEFAULT_PATH):
        self.path = Path(path)

    def load(self):
        if not self.path.exists():
            return []

        with self.path.open(encoding="utf-8") as file:
            return [Task.from_dict(item) for item in json.load(file)]

    def save(self, tasks):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.open("w", encoding="utf-8") as file:
            json.dump([task.to_dict() for task in tasks], file, indent=2)

    def next_id(self, tasks):
        if not tasks:
            return 1
        return max(task.id for task in tasks) + 1`,
      },
      { type: 'h2', text: 'Step 5: Build the CLI commands' },
      {
        type: 'code',
        title: 'src/task_manager/cli.py',
        language: 'python',
        code: `import argparse

from task_manager.models import Task
from task_manager.storage import TaskStore


def add_task(args, store):
    tasks = store.load()
    task = Task(id=store.next_id(tasks), title=args.title)
    tasks.append(task)
    store.save(tasks)
    print(f"Added task {task.id}: {task.title}")


def list_tasks(args, store):
    tasks = store.load()
    if not tasks:
        print("No tasks yet.")
        return

    for task in tasks:
        marker = "x" if task.done else " "
        print(f"{task.id}. [{marker}] {task.title}")


def mark_done(args, store):
    tasks = store.load()
    for task in tasks:
        if task.id == args.id:
            task.done = True
            store.save(tasks)
            print(f"Completed task {task.id}")
            return
    raise SystemExit(f"Task {args.id} not found")


def delete_task(args, store):
    tasks = store.load()
    remaining = [task for task in tasks if task.id != args.id]
    if len(remaining) == len(tasks):
        raise SystemExit(f"Task {args.id} not found")
    store.save(remaining)
    print(f"Deleted task {args.id}")


def build_parser():
    parser = argparse.ArgumentParser(prog="task")
    subcommands = parser.add_subparsers(required=True)

    add = subcommands.add_parser("add")
    add.add_argument("title")
    add.set_defaults(handler=add_task)

    show = subcommands.add_parser("list")
    show.set_defaults(handler=list_tasks)

    done = subcommands.add_parser("done")
    done.add_argument("id", type=int)
    done.set_defaults(handler=mark_done)

    delete = subcommands.add_parser("delete")
    delete.add_argument("id", type=int)
    delete.set_defaults(handler=delete_task)

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()
    args.handler(args, TaskStore())


if __name__ == "__main__":
    main()`,
      },
      { type: 'h2', text: 'Step 6: Install and run it' },
      {
        type: 'code',
        title: 'Local development install',
        language: 'bash',
        code: `python -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[dev]"

task add "Write tutorial"
task add "Review pull request"
task list
task done 1
task delete 2`,
      },
      { type: 'h2', text: 'Step 7: Test the storage boundary' },
      {
        type: 'code',
        title: 'tests/test_storage.py',
        language: 'python',
        code: `from task_manager.models import Task
from task_manager.storage import TaskStore


def test_save_and_load_tasks(tmp_path):
    path = tmp_path / "tasks.json"
    store = TaskStore(path)

    store.save([Task(id=1, title="Test task")])

    tasks = store.load()
    assert tasks == [Task(id=1, title="Test task", done=False)]`,
      },
      {
        type: 'tip',
        text: 'The storage test uses tmp_path so it never touches your real home directory task file.',
      },
      {
        type: 'try',
        text: 'Add an edit command: task edit 1 "New title". Keep the command parsing in cli.py and the JSON details inside storage.py.',
      },
      {
        type: 'keypoints',
        items: [
          'A CLI should parse input and delegate real work.',
          'JSON conversion helpers keep storage code simple.',
          'Console scripts make local commands easy to run.',
          'Tests should use temporary files instead of real user data.',
        ],
      },
    ],
  },
  {
    slug: 'python-project-api',
    title: 'Mini Project: Small REST API (FastAPI-style)',
    description:
      'Build a small FastAPI-style REST API with models, routes, validation, in-memory storage, and a professional project shape.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 60,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project teaches the pattern of a small REST API. The examples use FastAPI because it is popular, readable, and built around type hints.',
      },
      {
        type: 'note',
        text: 'You can follow the architecture even if you later use another framework: route layer, data models, service/storage layer, validation, and tests.',
      },
      { type: 'h2', text: 'What you will build' },
      {
        type: 'ul',
        items: [
          'GET /health returns a status message.',
          'GET /tasks returns all tasks.',
          'POST /tasks creates a task.',
          'PATCH /tasks/{task_id} marks a task done or updates the title.',
          'DELETE /tasks/{task_id} removes a task.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the file structure' },
      {
        type: 'code',
        title: 'Project tree',
        language: 'text',
        code: `task-api/
  pyproject.toml
  src/
    task_api/
      __init__.py
      main.py
      models.py
      store.py
  tests/
    test_api.py`,
      },
      {
        type: 'code',
        title: 'Create and install',
        language: 'bash',
        code: `mkdir -p task-api/src/task_api task-api/tests
cd task-api
touch src/task_api/__init__.py
python -m venv .venv
source .venv/bin/activate`,
      },
      { type: 'h2', text: 'Step 2: Add dependencies' },
      {
        type: 'code',
        title: 'pyproject.toml',
        language: 'toml',
        code: `[build-system]
requires = ["setuptools>=69", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "task-api"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
  "fastapi",
  "uvicorn[standard]",
]

[project.optional-dependencies]
dev = ["pytest", "httpx"]

[tool.pytest.ini_options]
testpaths = ["tests"]`,
      },
      {
        type: 'code',
        title: 'Install dependencies',
        language: 'bash',
        code: `python -m pip install --upgrade pip
python -m pip install -e ".[dev]"`,
      },
      { type: 'h2', text: 'Step 3: Define request and response models' },
      {
        type: 'p',
        text: 'FastAPI uses Pydantic models for validation and documentation. Separate create, update, and output models so each endpoint has the right shape.',
      },
      {
        type: 'code',
        title: 'src/task_api/models.py',
        language: 'python',
        code: `from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=120)
    done: bool | None = None


class TaskOut(BaseModel):
    id: int
    title: str
    done: bool`,
      },
      { type: 'h2', text: 'Step 4: Add a small storage layer' },
      {
        type: 'p',
        text: 'This tutorial uses in-memory storage so the API stays focused. A real app would replace this class with a database-backed repository.',
      },
      {
        type: 'code',
        title: 'src/task_api/store.py',
        language: 'python',
        code: `class TaskStore:
    def __init__(self):
        self._tasks = {}
        self._next_id = 1

    def list_tasks(self):
        return list(self._tasks.values())

    def create_task(self, title):
        task = {"id": self._next_id, "title": title, "done": False}
        self._tasks[self._next_id] = task
        self._next_id += 1
        return task

    def update_task(self, task_id, *, title=None, done=None):
        task = self._tasks.get(task_id)
        if task is None:
            return None

        if title is not None:
            task["title"] = title
        if done is not None:
            task["done"] = done

        return task

    def delete_task(self, task_id):
        return self._tasks.pop(task_id, None) is not None`,
      },
      { type: 'h2', text: 'Step 5: Create the FastAPI app' },
      {
        type: 'code',
        title: 'src/task_api/main.py',
        language: 'python',
        code: `from fastapi import FastAPI, HTTPException, status

from task_api.models import TaskCreate, TaskOut, TaskUpdate
from task_api.store import TaskStore


app = FastAPI(title="Task API")
store = TaskStore()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/tasks", response_model=list[TaskOut])
def list_tasks():
    return store.list_tasks()


@app.post("/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate):
    return store.create_task(payload.title)


@app.patch("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, payload: TaskUpdate):
    task = store.update_task(
        task_id,
        title=payload.title,
        done=payload.done,
    )
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int):
    deleted = store.delete_task(task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")`,
      },
      { type: 'h2', text: 'Step 6: Run and try the API' },
      {
        type: 'code',
        title: 'Start the server',
        language: 'bash',
        code: `uvicorn task_api.main:app --reload`,
      },
      {
        type: 'code',
        title: 'Example requests',
        language: 'bash',
        code: `curl http://127.0.0.1:8000/health
curl -X POST http://127.0.0.1:8000/tasks \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Learn FastAPI"}'
curl http://127.0.0.1:8000/tasks`,
      },
      {
        type: 'tip',
        text: 'FastAPI automatically serves interactive docs at /docs while the app is running.',
      },
      { type: 'h2', text: 'Step 7: Test the API' },
      {
        type: 'code',
        title: 'tests/test_api.py',
        language: 'python',
        code: `from fastapi.testclient import TestClient

from task_api.main import app


client = TestClient(app)


def test_create_and_list_task():
    response = client.post("/tasks", json={"title": "Test API"})
    assert response.status_code == 201
    created = response.json()
    assert created["title"] == "Test API"
    assert created["done"] is False

    response = client.get("/tasks")
    assert response.status_code == 200
    assert any(task["id"] == created["id"] for task in response.json())`,
      },
      {
        type: 'warning',
        text: 'The global in-memory store is simple for learning, but tests can affect each other. Larger apps should create app factories and inject a fresh store or test database per test.',
      },
      {
        type: 'try',
        text: 'Replace the in-memory TaskStore with a SQLite-backed store while keeping the route functions almost unchanged.',
      },
      {
        type: 'keypoints',
        items: [
          'Routes should be thin and delegate storage or business rules.',
          'Request and response models make validation explicit.',
          'HTTP status codes communicate what happened.',
          'A storage layer makes future database changes easier.',
        ],
      },
    ],
  },
  {
    slug: 'python-project-data',
    title: 'Mini Project: Data Cleaning Script',
    description:
      'Build a data cleaning script that reads CSV files, validates rows, normalizes values, writes clean output, and reports rejected records.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 61,
    minutes: 19,
    content: [
      {
        type: 'p',
        text: 'Data cleaning is one of the most useful Python automation skills. This project reads a messy CSV, normalizes it, writes a clean CSV, and saves rejected rows for review.',
      },
      { type: 'h2', text: 'What you will build' },
      {
        type: 'ul',
        items: [
          'A command-line script called clean-customers.',
          'Input CSV columns: name, email, signup_date, spend.',
          'Output clean CSV with normalized values.',
          'Reject file with rows that could not be safely cleaned.',
          'Summary counts printed at the end.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the file structure' },
      {
        type: 'code',
        title: 'Project tree',
        language: 'text',
        code: `data-cleaner/
  pyproject.toml
  data/
    raw_customers.csv
  src/
    data_cleaner/
      __init__.py
      cli.py
      cleaning.py
  tests/
    test_cleaning.py`,
      },
      {
        type: 'code',
        title: 'Create folders',
        language: 'bash',
        code: `mkdir -p data-cleaner/src/data_cleaner data-cleaner/tests data-cleaner/data
cd data-cleaner
touch src/data_cleaner/__init__.py`,
      },
      { type: 'h2', text: 'Step 2: Add a sample CSV' },
      {
        type: 'code',
        title: 'data/raw_customers.csv',
        language: 'text',
        code: `name,email,signup_date,spend
 Ava Stone ,AVA@example.com,2026-01-05,$19.99
Noah Reed,noah@example.com,01/07/2026,42
Missing Email,,2026-01-09,10
Bad Spend,bad@example.com,2026-01-10,not-a-number`,
      },
      { type: 'h2', text: 'Step 3: Configure the command' },
      {
        type: 'code',
        title: 'pyproject.toml',
        language: 'toml',
        code: `[build-system]
requires = ["setuptools>=69", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "data-cleaner"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []

[project.scripts]
clean-customers = "data_cleaner.cli:main"

[project.optional-dependencies]
dev = ["pytest"]`,
      },
      { type: 'h2', text: 'Step 4: Write cleaning functions' },
      {
        type: 'p',
        text: 'Keep small cleaning functions separate from file I/O. This makes them easy to test.',
      },
      {
        type: 'code',
        title: 'src/data_cleaner/cleaning.py',
        language: 'python',
        code: `from datetime import datetime
from decimal import Decimal, InvalidOperation


def clean_name(value):
    name = " ".join(value.strip().split())
    if not name:
        raise ValueError("name is required")
    return name.title()


def clean_email(value):
    email = value.strip().lower()
    if "@" not in email:
        raise ValueError("valid email is required")
    return email


def clean_date(value):
    value = value.strip()
    for pattern in ("%Y-%m-%d", "%m/%d/%Y"):
        try:
            return datetime.strptime(value, pattern).date().isoformat()
        except ValueError:
            pass
    raise ValueError("unsupported signup date")


def clean_spend(value):
    normalized = value.strip().replace("$", "")
    try:
        amount = Decimal(normalized)
    except InvalidOperation as error:
        raise ValueError("spend must be a number") from error

    if amount < 0:
        raise ValueError("spend cannot be negative")

    return str(amount.quantize(Decimal("0.01")))


def clean_row(row):
    return {
        "name": clean_name(row.get("name", "")),
        "email": clean_email(row.get("email", "")),
        "signup_date": clean_date(row.get("signup_date", "")),
        "spend": clean_spend(row.get("spend", "")),
    }`,
      },
      { type: 'h2', text: 'Step 5: Read, write, and report' },
      {
        type: 'code',
        title: 'src/data_cleaner/cli.py',
        language: 'python',
        code: `import argparse
import csv

from data_cleaner.cleaning import clean_row


FIELDS = ["name", "email", "signup_date", "spend"]


def process_file(input_path, output_path, reject_path):
    total = 0
    cleaned = 0
    rejected = 0

    with open(input_path, newline="", encoding="utf-8") as input_file, \\
        open(output_path, "w", newline="", encoding="utf-8") as output_file, \\
        open(reject_path, "w", newline="", encoding="utf-8") as reject_file:

        reader = csv.DictReader(input_file)
        writer = csv.DictWriter(output_file, fieldnames=FIELDS)
        reject_writer = csv.DictWriter(
            reject_file,
            fieldnames=list(reader.fieldnames or []) + ["error"],
        )

        writer.writeheader()
        reject_writer.writeheader()

        for row in reader:
            total += 1
            try:
                writer.writerow(clean_row(row))
                cleaned += 1
            except ValueError as error:
                row["error"] = str(error)
                reject_writer.writerow(row)
                rejected += 1

    return {"total": total, "cleaned": cleaned, "rejected": rejected}


def build_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument("input")
    parser.add_argument("--output", default="clean_customers.csv")
    parser.add_argument("--rejects", default="rejected_customers.csv")
    return parser


def main():
    args = build_parser().parse_args()
    summary = process_file(args.input, args.output, args.rejects)
    print(
        f"Processed {summary['total']} rows: "
        f"{summary['cleaned']} cleaned, {summary['rejected']} rejected"
    )`,
      },
      { type: 'h2', text: 'Step 6: Run the cleaner' },
      {
        type: 'code',
        title: 'Install and run',
        language: 'bash',
        code: `python -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[dev]"

clean-customers data/raw_customers.csv \\
  --output data/clean_customers.csv \\
  --rejects data/rejected_customers.csv`,
      },
      {
        type: 'code',
        title: 'Expected clean output',
        language: 'text',
        code: `name,email,signup_date,spend
Ava Stone,ava@example.com,2026-01-05,19.99
Noah Reed,noah@example.com,2026-01-07,42.00`,
      },
      { type: 'h2', text: 'Step 7: Test cleaning rules' },
      {
        type: 'code',
        title: 'tests/test_cleaning.py',
        language: 'python',
        code: `import pytest

from data_cleaner.cleaning import clean_email, clean_row, clean_spend


def test_clean_email_lowercases_and_trims():
    assert clean_email(" AVA@EXAMPLE.COM ") == "ava@example.com"


def test_clean_spend_formats_two_decimals():
    assert clean_spend("$42") == "42.00"


def test_clean_row_rejects_missing_email():
    with pytest.raises(ValueError):
        clean_row({
            "name": "Ava",
            "email": "",
            "signup_date": "2026-01-05",
            "spend": "10",
        })`,
      },
      {
        type: 'try',
        text: 'Add a --min-spend option that only writes customers whose spend is at least a chosen amount.',
      },
      {
        type: 'keypoints',
        items: [
          'Separate cleaning logic from file I/O.',
          'Reject questionable rows instead of silently guessing.',
          'Use Decimal for money-like values.',
          'Print summaries so scripts are useful in automation logs.',
        ],
      },
    ],
  },
  {
    slug: 'python-project-scraper',
    title: 'Mini Project: Web Scraper (Responsible)',
    description:
      'Build a respectful web scraper that checks rules, rate limits requests, parses HTML, saves JSON, and avoids harmful scraping behavior.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 62,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'A web scraper downloads pages and extracts information. Scraping can be useful, but it must be done responsibly and legally.',
      },
      {
        type: 'warning',
        text: 'Before scraping a site, review its terms of service, robots.txt, copyright rules, and API options. Do not bypass logins, paywalls, CAPTCHAs, rate limits, or access controls.',
      },
      { type: 'h2', text: 'Responsible scraping checklist' },
      {
        type: 'ol',
        items: [
          'Prefer an official API when one exists.',
          'Read robots.txt and site terms before collecting pages.',
          'Identify your script with a clear User-Agent.',
          'Request slowly and use small batches.',
          'Cache results while developing.',
          'Do not collect personal data unless you have a lawful reason and a safe storage plan.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the file structure' },
      {
        type: 'code',
        title: 'Project tree',
        language: 'text',
        code: `responsible-scraper/
  pyproject.toml
  src/
    responsible_scraper/
      __init__.py
      cli.py
      fetch.py
      parse.py
      robots.py
  output/
    pages.json`,
      },
      {
        type: 'code',
        title: 'Create folders',
        language: 'bash',
        code: `mkdir -p responsible-scraper/src/responsible_scraper responsible-scraper/output
cd responsible-scraper
touch src/responsible_scraper/__init__.py`,
      },
      { type: 'h2', text: 'Step 2: Add dependencies' },
      {
        type: 'code',
        title: 'pyproject.toml',
        language: 'toml',
        code: `[build-system]
requires = ["setuptools>=69", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "responsible-scraper"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
  "beautifulsoup4",
  "requests",
]

[project.scripts]
scrape-pages = "responsible_scraper.cli:main"`,
      },
      { type: 'h2', text: 'Step 3: Check robots.txt' },
      {
        type: 'p',
        text: 'Python includes urllib.robotparser. It is not a full legal review, but it helps your script respect robots.txt rules.',
      },
      {
        type: 'code',
        title: 'src/responsible_scraper/robots.py',
        language: 'python',
        code: `from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser


def can_fetch(url, user_agent):
    parsed = urlparse(url)
    robots_url = urljoin(f"{parsed.scheme}://{parsed.netloc}", "/robots.txt")

    parser = RobotFileParser()
    parser.set_url(robots_url)
    parser.read()
    return parser.can_fetch(user_agent, url)`,
      },
      { type: 'h2', text: 'Step 4: Fetch slowly with a user agent' },
      {
        type: 'p',
        text: 'Use a descriptive User-Agent and a delay between requests. Keep timeouts so the script does not hang forever.',
      },
      {
        type: 'code',
        title: 'src/responsible_scraper/fetch.py',
        language: 'python',
        code: `from time import sleep

import requests


USER_AGENT = "ResponsibleTutorialScraper/0.1 (learning project)"


def fetch_page(url, delay=1.0):
    sleep(delay)
    response = requests.get(
        url,
        headers={"User-Agent": USER_AGENT},
        timeout=10,
    )
    response.raise_for_status()
    return response.text`,
      },
      { type: 'h2', text: 'Step 5: Parse HTML' },
      {
        type: 'p',
        text: 'Parsing should be separate from downloading so it is easy to test with saved HTML snippets.',
      },
      {
        type: 'code',
        title: 'src/responsible_scraper/parse.py',
        language: 'python',
        code: `from bs4 import BeautifulSoup


def parse_page(html, url):
    soup = BeautifulSoup(html, "html.parser")
    title = soup.title.string.strip() if soup.title and soup.title.string else ""
    heading = soup.find("h1")

    return {
        "url": url,
        "title": title,
        "heading": heading.get_text(strip=True) if heading else "",
    }`,
      },
      { type: 'h2', text: 'Step 6: Build the CLI' },
      {
        type: 'code',
        title: 'src/responsible_scraper/cli.py',
        language: 'python',
        code: `import argparse
import json
from pathlib import Path

from responsible_scraper.fetch import USER_AGENT, fetch_page
from responsible_scraper.parse import parse_page
from responsible_scraper.robots import can_fetch


def build_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument("urls", nargs="+")
    parser.add_argument("--output", default="output/pages.json")
    parser.add_argument("--delay", type=float, default=1.0)
    return parser


def main():
    args = build_parser().parse_args()
    results = []

    for url in args.urls:
        if not can_fetch(url, USER_AGENT):
            print(f"Skipping disallowed URL: {url}")
            continue

        print(f"Fetching {url}")
        html = fetch_page(url, delay=args.delay)
        results.append(parse_page(html, url))

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"Wrote {len(results)} records to {output_path}")`,
      },
      { type: 'h2', text: 'Step 7: Install and run carefully' },
      {
        type: 'code',
        title: 'Run the scraper',
        language: 'bash',
        code: `python -m venv .venv
source .venv/bin/activate
python -m pip install -e .

scrape-pages https://example.com --delay 2 --output output/pages.json`,
      },
      {
        type: 'code',
        title: 'Example JSON output',
        language: 'json',
        code: `[
  {
    "url": "https://example.com",
    "title": "Example Domain",
    "heading": "Example Domain"
  }
]`,
      },
      { type: 'h2', text: 'Step 8: Improve it safely' },
      {
        type: 'ul',
        items: [
          'Add caching so repeated development runs do not hit the site again.',
          'Add a maximum page count and stop early.',
          'Log skipped URLs and HTTP errors without retry storms.',
          'Store only the fields you truly need.',
          'Ask for permission before scraping a site at scale.',
        ],
      },
      {
        type: 'try',
        text: 'Add a simple cache directory that stores HTML by a safe hash of the URL. Read from cache before making a network request.',
      },
      {
        type: 'keypoints',
        items: [
          'Responsible scraping starts with permission, terms, and robots.txt.',
          'Use clear user agents, delays, and timeouts.',
          'Separate fetching from parsing.',
          'Prefer APIs and avoid collecting more data than needed.',
        ],
      },
    ],
  },
  {
    slug: 'python-common-mistakes',
    title: 'Common Python Mistakes (and Fixes)',
    description:
      'Review frequent Python bugs and design problems: mutable defaults, broad exceptions, shadowing, late binding, imports, and hidden state.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 63,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Advanced Python includes knowing the traps. Many bugs come from features that are useful but easy to misunderstand.',
      },
      { type: 'h2', text: 'Mistake 1: Mutable default arguments' },
      {
        type: 'p',
        text: 'Default argument values are created once when the function is defined, not each time the function is called.',
      },
      {
        type: 'code',
        title: 'Avoid shared default lists',
        language: 'python',
        code: `def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items


print(add_item("a"))
print(add_item("b"))`,
      },
      { type: 'h2', text: 'Mistake 2: Catching every exception' },
      {
        type: 'p',
        text: 'A bare except or broad except Exception can hide programming errors. Catch the exceptions you can actually handle.',
      },
      {
        type: 'code',
        title: 'Catch the specific error',
        language: 'python',
        code: `def parse_port(value):
    try:
        return int(value)
    except ValueError as error:
        raise ValueError("Port must be an integer") from error`,
      },
      { type: 'h2', text: 'Mistake 3: Shadowing built-ins or modules' },
      {
        type: 'p',
        text: 'Names like list, dict, id, file, json, email, and logging already mean something in Python or the standard library.',
      },
      {
        type: 'code',
        title: 'Choose clear names',
        language: 'python',
        code: `# Avoid: list = [1, 2, 3]
numbers = [1, 2, 3]

# Avoid naming a file json.py if you need to import the json module.
import json

print(json.dumps(numbers))`,
      },
      { type: 'h2', text: 'Mistake 4: Late binding in closures' },
      {
        type: 'p',
        text: 'Functions created in a loop remember the variable, not the value at that moment. Bind the current value intentionally.',
      },
      {
        type: 'code',
        title: 'Bind loop values',
        language: 'python',
        code: `handlers = []

for index in range(3):
    def handler(index=index):
        return index

    handlers.append(handler)

print([handler() for handler in handlers])  # [0, 1, 2]`,
      },
      { type: 'h2', text: 'Mistake 5: Import side effects' },
      {
        type: 'p',
        text: 'Importing a module should usually define functions and classes, not immediately start network calls, parse CLI arguments, or run the whole program.',
      },
      {
        type: 'code',
        title: 'Protect script entry points',
        language: 'python',
        code: `def main():
    print("Program starts here")


if __name__ == "__main__":
    main()`,
      },
      { type: 'h2', text: 'Mistake 6: Hidden shared state' },
      {
        type: 'p',
        text: 'Global variables make code harder to test and reason about. Pass dependencies into functions or classes when practical.',
      },
      {
        type: 'code',
        title: 'Pass dependencies explicitly',
        language: 'python',
        code: `def send_welcome_email(user, email_client):
    subject = "Welcome"
    body = f"Hello {user['name']}"
    email_client.send(user["email"], subject, body)`,
      },
      {
        type: 'table',
        headers: ['Mistake', 'Fix'],
        rows: [
          ['Mutable defaults', 'Use None and create the object inside'],
          ['Broad exceptions', 'Catch specific exceptions'],
          ['Shadowing names', 'Use descriptive project names'],
          ['Import side effects', 'Use main guards'],
          ['Hidden globals', 'Pass dependencies explicitly'],
        ],
      },
      {
        type: 'try',
        text: 'Search one of your Python files for broad except blocks, mutable default arguments, and module-level work that should move under main().',
      },
      {
        type: 'keypoints',
        items: [
          'Python defaults are evaluated once at function definition time.',
          'Specific exceptions make failures easier to understand.',
          'Names matter because imports and built-ins live in the same namespace rules.',
          'Keep imports safe and side-effect light.',
        ],
      },
    ],
  },
  {
    slug: 'python-ecosystem',
    title: 'The Python Ecosystem (Web, Data, Automation)',
    description:
      'Map the Python ecosystem across web development, data science, automation, testing, packaging, tooling, and deployment.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 64,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Python is not one narrow path. It is a large ecosystem used for web apps, APIs, data analysis, machine learning, automation, testing, infrastructure, education, and scripting.',
      },
      {
        type: 'p',
        text: 'Knowing the ecosystem helps you choose tools without trying to learn everything at once.',
      },
      { type: 'h2', text: 'Web and APIs' },
      {
        type: 'table',
        headers: ['Tool', 'Use it for'],
        rows: [
          ['Django', 'Full-featured web applications with admin, ORM, auth, and templates'],
          ['FastAPI', 'Modern APIs with type hints and automatic documentation'],
          ['Flask', 'Small web apps and flexible APIs'],
          ['SQLAlchemy', 'Database toolkit and ORM'],
          ['Alembic', 'Database migrations with SQLAlchemy'],
        ],
      },
      { type: 'h2', text: 'Data and analytics' },
      {
        type: 'table',
        headers: ['Tool', 'Use it for'],
        rows: [
          ['Jupyter', 'Interactive notebooks and exploration'],
          ['NumPy', 'Fast numerical arrays'],
          ['pandas', 'Tabular data cleaning and analysis'],
          ['Matplotlib', 'General plotting'],
          ['Polars', 'Fast DataFrame workflows'],
        ],
      },
      { type: 'h2', text: 'Automation and operations' },
      {
        type: 'ul',
        items: [
          'Use pathlib, shutil, csv, json, and subprocess for everyday automation.',
          'Use requests or httpx for HTTP clients.',
          'Use schedule, cron, task queues, or workflow tools for repeated jobs.',
          'Use boto3, google-cloud libraries, or Azure SDKs for cloud automation.',
        ],
      },
      { type: 'h2', text: 'Testing and quality tools' },
      {
        type: 'table',
        headers: ['Tool', 'Purpose'],
        rows: [
          ['pytest', 'Writing and running tests'],
          ['unittest', 'Standard library testing framework'],
          ['ruff', 'Fast linting and formatting'],
          ['mypy', 'Static type checking'],
          ['coverage.py', 'Measure test coverage'],
          ['pre-commit', 'Run checks before commits'],
        ],
      },
      { type: 'h2', text: 'Packaging and environments' },
      {
        type: 'p',
        text: 'For environments, start with venv and pip. For packaging, understand pyproject.toml, wheels, editable installs, and dependency groups. Teams may also use uv, Poetry, Hatch, or PDM.',
      },
      {
        type: 'code',
        title: 'A dependable local workflow',
        language: 'bash',
        code: `python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
pytest`,
      },
      { type: 'h2', text: 'Deployment directions' },
      {
        type: 'ul',
        items: [
          'Package web apps into containers when the platform expects Docker.',
          'Use WSGI or ASGI servers such as gunicorn, uvicorn, or hypercorn.',
          'Move secrets into environment variables or a secret manager.',
          'Run tests, linting, and security checks in CI.',
          'Use logs, metrics, and error tracking after deployment.',
        ],
      },
      {
        type: 'tip',
        text: 'Choose a track for a season. For example: web APIs with FastAPI, data analysis with pandas, or automation with standard library scripts.',
      },
      {
        type: 'try',
        text: 'Pick one ecosystem track and create a three-project roadmap: one tiny project, one useful project, and one portfolio-quality project.',
      },
      {
        type: 'keypoints',
        items: [
          'Python has strong ecosystems for web, data, automation, and tooling.',
          'Start with core tools before adding complex frameworks.',
          'Good testing, packaging, and deployment habits transfer across tracks.',
          'Depth in one track is more valuable than shallow knowledge of every library.',
        ],
      },
    ],
  },
  {
    slug: 'python-next-steps',
    title: 'What to Learn After This Path',
    description:
      'Plan your next Python learning path with specialization tracks, portfolio projects, testing habits, reading practice, and professional growth.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 65,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Finishing a Python path is not the end. It is the point where you can choose a direction and build depth through real projects.',
      },
      {
        type: 'p',
        text: 'The best next step is usually not another random tutorial. It is a focused project that forces you to practice design, testing, debugging, and delivery.',
      },
      { type: 'h2', text: 'Choose a specialization track' },
      {
        type: 'table',
        headers: ['Track', 'Learn next', 'Project idea'],
        rows: [
          ['Backend web', 'FastAPI or Django, databases, auth, deployment', 'Habit tracker API with users and reports'],
          ['Data analysis', 'pandas, visualization, notebooks, statistics', 'Personal finance analysis dashboard'],
          ['Automation', 'APIs, scheduling, files, email, cloud SDKs', 'Weekly report generator'],
          ['Testing and tooling', 'pytest, CI, packaging, static analysis', 'Reusable internal CLI package'],
          ['Machine learning', 'NumPy, pandas, scikit-learn, model evaluation', 'Prediction project with a documented dataset'],
        ],
      },
      { type: 'h2', text: 'Build a portfolio project' },
      {
        type: 'p',
        text: 'A strong portfolio project solves a clear problem, has a README, includes tests, explains trade-offs, and can be run by another person.',
      },
      {
        type: 'ol',
        items: [
          'Write a one-paragraph problem statement.',
          'Create a small but realistic feature list.',
          'Design the file structure before writing everything.',
          'Add tests for the important behavior.',
          'Write setup and run instructions.',
          'Deploy it or provide a reproducible demo.',
          'Write a short section about what you would improve next.',
        ],
      },
      { type: 'h2', text: 'Practice reading code' },
      {
        type: 'p',
        text: 'Reading professional code teaches naming, structure, error handling, tests, and trade-offs. Pick small libraries first and trace how one feature works.',
      },
      {
        type: 'ul',
        items: [
          'Read the public API first.',
          'Find tests for one behavior.',
          'Trace the implementation from entry point to helper functions.',
          'Write notes about patterns you want to reuse.',
          'Avoid copying code you do not understand.',
        ],
      },
      { type: 'h2', text: 'Strengthen professional habits' },
      {
        type: 'code',
        title: 'A practical project checklist',
        language: 'text',
        code: `Before calling a Python project complete:
- Can a new person install and run it from the README?
- Are important paths covered by tests?
- Are secrets kept out of the repository?
- Are errors clear enough to debug?
- Is the structure easy to extend?
- Did you remove dead code and temporary prints?`,
      },
      { type: 'h2', text: 'Keep learning with documentation' },
      {
        type: 'p',
        text: 'Tutorials are helpful, but documentation is where mature learning happens. Get comfortable reading Python docs, library docs, changelogs, and error messages.',
      },
      {
        type: 'try',
        text: 'Choose one next project today. Create the repository, write the README first, and build the smallest useful version in one week.',
      },
      {
        type: 'keypoints',
        items: [
          'Pick a focused track instead of trying to learn every Python library.',
          'Portfolio projects should be runnable, tested, and documented.',
          'Reading real code accelerates your judgment.',
          'Professional Python is a combination of design, testing, delivery, and maintenance.',
        ],
      },
    ],
  },
];
