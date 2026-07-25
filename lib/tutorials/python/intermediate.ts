import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'python-list-comprehensions',
    title: 'List Comprehensions',
    description:
      'Create new lists from existing data with clear, compact Python expressions.',
    level: 'intermediate',
    section: 'Pythonic Tools',
    order: 26,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'A list comprehension is a concise way to build a new list. It combines a loop, an optional condition, and the value you want to collect.',
      },
      {
        type: 'p',
        text: 'Use comprehensions when the transformation is simple enough to read in one line. For multi-step logic, a normal for loop is still the clearer choice.',
      },
      { type: 'h2', text: 'From loop to comprehension' },
      {
        type: 'code',
        language: 'python',
        title: 'Building a cleaned list',
        code: `names = [" ada ", "GRACE", "", " linus "]

clean_names = []

for name in names:
    cleaned = name.strip().title()
    if cleaned:
        clean_names.append(cleaned)

print(clean_names)`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'The same idea as a comprehension',
        code: `names = [" ada ", "GRACE", "", " linus "]

clean_names = [name.strip().title() for name in names if name.strip()]

print(clean_names)`,
      },
      { type: 'h2', text: 'Transform data for a small report' },
      {
        type: 'p',
        text: 'Comprehensions are useful in scripts that prepare data for display, export, or analysis.',
      },
      {
        type: 'code',
        language: 'python',
        title: 'Extracting expensive orders',
        code: `orders = [
    {"id": "A100", "total": 42.50},
    {"id": "A101", "total": 130.00},
    {"id": "A102", "total": 89.99},
    {"id": "A103", "total": 240.00},
]

large_order_labels = [
    f"{order['id']}: \${order['total']:.2f}"
    for order in orders
    if order["total"] >= 100
]

for label in large_order_labels:
    print(label)`,
      },
      {
        type: 'note',
        text: 'The expression before for is the value that goes into the new list. The if clause filters which input items are included.',
      },
      {
        type: 'tip',
        text: 'If a comprehension becomes hard to explain out loud, rewrite it as a normal loop with named intermediate variables.',
      },
      {
        type: 'try',
        text: 'Create a list named short_titles that contains title-cased task names shorter than 12 characters from [" email ", "WRITE REPORT", "plan sprint", "deploy"].',
      },
      {
        type: 'keypoints',
        items: [
          'List comprehensions create a new list from an iterable.',
          'Use the expression at the beginning to transform each item.',
          'Add an if clause at the end to filter input items.',
          'Prefer normal loops when the logic needs several steps.',
        ],
      },
    ],
  },
  {
    slug: 'python-dict-set-comprehensions',
    title: 'Dict & Set Comprehensions',
    description:
      'Build dictionaries and sets from existing data without repetitive loop boilerplate.',
    level: 'intermediate',
    section: 'Pythonic Tools',
    order: 27,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Dictionary and set comprehensions use the same idea as list comprehensions, but they produce mappings or unique collections.',
      },
      {
        type: 'p',
        text: 'They are especially handy when reshaping rows from a file, indexing data by an ID, or removing duplicates while normalizing values.',
      },
      { type: 'h2', text: 'Build a lookup dictionary' },
      {
        type: 'code',
        language: 'python',
        title: 'Indexing users by ID',
        code: `users = [
    {"id": 101, "name": "Ada", "role": "admin"},
    {"id": 102, "name": "Grace", "role": "editor"},
    {"id": 103, "name": "Linus", "role": "viewer"},
]

users_by_id = {user["id"]: user for user in users}

print(users_by_id[102]["name"])`,
      },
      { type: 'h2', text: 'Create a set of normalized values' },
      {
        type: 'code',
        language: 'python',
        title: 'Collecting unique tags',
        code: `raw_tags = [" Python ", "cli", "PYTHON", "Data", "data", " automation "]

tags = {tag.strip().lower() for tag in raw_tags if tag.strip()}

print(tags)`,
      },
      { type: 'h2', text: 'Filter while building' },
      {
        type: 'code',
        language: 'python',
        title: 'Only active product prices',
        code: `products = [
    {"sku": "KB-1", "price": 49.99, "active": True},
    {"sku": "MS-2", "price": 24.50, "active": False},
    {"sku": "HD-3", "price": 89.00, "active": True},
]

active_prices = {
    product["sku"]: product["price"]
    for product in products
    if product["active"]
}

print(active_prices)`,
      },
      {
        type: 'note',
        text: 'Dictionary keys must be unique. If two input items create the same key, the later value replaces the earlier one.',
      },
      {
        type: 'tip',
        text: 'Use a set comprehension when you only care whether a value exists once, not how many times it appeared.',
      },
      {
        type: 'try',
        text: 'Given a list of customer dictionaries, build a dictionary that maps each email address to the customer name, but only for verified customers.',
      },
      {
        type: 'keypoints',
        items: [
          'Dict comprehensions use key: value before the for clause.',
          'Set comprehensions use braces with a single expression.',
          'Both can include if clauses for filtering.',
          'Duplicate dictionary keys are overwritten by later values.',
        ],
      },
    ],
  },
  {
    slug: 'python-lambda',
    title: 'Lambda Functions',
    description:
      'Use small anonymous functions in places where Python expects a callable.',
    level: 'intermediate',
    section: 'Pythonic Tools',
    order: 28,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'A lambda function is a short function expression. It can take arguments and returns the value of one expression automatically.',
      },
      {
        type: 'p',
        text: 'Lambdas are most useful as tiny callbacks for tools like sorted(), min(), max(), map(), and filter().',
      },
      { type: 'h2', text: 'A lambda has one expression' },
      {
        type: 'code',
        language: 'python',
        title: 'Regular function vs lambda',
        code: `def add_tax(price):
    return price * 1.08

add_tax_lambda = lambda price: price * 1.08

print(add_tax(25))
print(add_tax_lambda(25))`,
      },
      { type: 'h2', text: 'Use lambdas as sorting keys' },
      {
        type: 'code',
        language: 'python',
        title: 'Sorting dictionaries by a field',
        code: `tickets = [
    {"id": "T-3", "priority": 2, "title": "Update docs"},
    {"id": "T-1", "priority": 1, "title": "Fix login"},
    {"id": "T-2", "priority": 3, "title": "Clean reports"},
]

by_priority = sorted(tickets, key=lambda ticket: ticket["priority"])

for ticket in by_priority:
    print(ticket["id"], ticket["title"])`,
      },
      {
        type: 'note',
        text: 'Lambda functions are still function objects. The difference is that they are written as expressions and do not need a def block.',
      },
      {
        type: 'tip',
        text: 'If the lambda needs a name, comments, or more than one expression, write a normal def function instead.',
      },
      {
        type: 'try',
        text: 'Sort a list of products by price using sorted(products, key=lambda product: product["price"]).',
      },
      {
        type: 'keypoints',
        items: [
          'lambda creates a small anonymous function.',
          'A lambda body is one expression, returned automatically.',
          'Lambdas are common as callback functions.',
          'Use def when the function deserves a descriptive name or multiple lines.',
        ],
      },
    ],
  },
  {
    slug: 'python-map-filter-sorted',
    title: 'map, filter & sorted',
    description:
      'Transform, filter, and order data with Python built-ins and readable callbacks.',
    level: 'intermediate',
    section: 'Pythonic Tools',
    order: 29,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Python includes built-in tools for common data tasks: map() transforms values, filter() keeps values that pass a test, and sorted() returns a new ordered list.',
      },
      {
        type: 'p',
        text: 'These tools are useful in data cleanup scripts, but list comprehensions may be more readable for simple transformations and filters.',
      },
      { type: 'h2', text: 'map() transforms each item' },
      {
        type: 'code',
        language: 'python',
        title: 'Convert strings to numbers',
        code: `raw_prices = ["19.99", "5.50", "42.00"]

prices = list(map(float, raw_prices))

print(prices)`,
      },
      { type: 'h2', text: 'filter() keeps matching items' },
      {
        type: 'code',
        language: 'python',
        title: 'Keep only successful jobs',
        code: `jobs = [
    {"name": "import-customers", "status": "ok"},
    {"name": "send-email", "status": "failed"},
    {"name": "build-report", "status": "ok"},
]

successful_jobs = list(filter(lambda job: job["status"] == "ok", jobs))

print(successful_jobs)`,
      },
      { type: 'h2', text: 'sorted() returns a new list' },
      {
        type: 'code',
        language: 'python',
        title: 'Sort by multiple ideas',
        code: `students = [
    {"name": "Mina", "grade": 92},
    {"name": "Omar", "grade": 88},
    {"name": "Zoe", "grade": 92},
]

ranked = sorted(students, key=lambda student: (-student["grade"], student["name"]))

for student in ranked:
    print(student["name"], student["grade"])`,
      },
      {
        type: 'note',
        text: 'map() and filter() return lazy iterator objects. Convert them with list() when you need to see or reuse all results immediately.',
      },
      {
        type: 'tip',
        text: 'For simple cases, compare map/filter with a comprehension and keep whichever version your team can read fastest.',
      },
      {
        type: 'try',
        text: 'Use sorted() to order a list of invoices by due date, then by customer name.',
      },
      {
        type: 'keypoints',
        items: [
          'map() applies a function to each input item.',
          'filter() keeps items where the callback returns True.',
          'sorted() does not change the original list.',
          'key functions let you sort complex objects and dictionaries.',
        ],
      },
    ],
  },
  {
    slug: 'python-files',
    title: 'Reading & Writing Files',
    description:
      'Read text files, write reports, and use context managers to close files safely.',
    level: 'intermediate',
    section: 'Files & Data',
    order: 30,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Many Python scripts read input from files and write output to files. Logs, exports, configuration, and reports all use the same basic patterns.',
      },
      {
        type: 'p',
        text: 'The with statement opens a file for a block of work and closes it automatically, even if an error happens.',
      },
      { type: 'h2', text: 'Read a whole text file' },
      {
        type: 'code',
        language: 'text',
        title: 'tasks.txt',
        code: `email customer
write weekly report
deploy website`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'Reading file contents',
        code: `with open("tasks.txt", "r", encoding="utf-8") as file:
    contents = file.read()

print(contents)`,
      },
      { type: 'h2', text: 'Read line by line' },
      {
        type: 'code',
        language: 'python',
        title: 'Number each task',
        code: `with open("tasks.txt", "r", encoding="utf-8") as file:
    for line_number, line in enumerate(file, start=1):
        task = line.strip()
        print(f"{line_number}. {task}")`,
      },
      { type: 'h2', text: 'Write a small report' },
      {
        type: 'code',
        language: 'python',
        title: 'Writing output',
        code: `completed = ["email customer", "deploy website"]

with open("summary.txt", "w", encoding="utf-8") as file:
    file.write("Completed tasks\\n")
    file.write("===============\\n")

    for task in completed:
        file.write(f"- {task}\\n")`,
      },
      {
        type: 'note',
        text: 'Mode "w" replaces a file if it already exists. Mode "a" appends to the end instead.',
      },
      {
        type: 'tip',
        text: 'Always pass an encoding such as "utf-8" when working with text files. It makes scripts more predictable across computers.',
      },
      {
        type: 'try',
        text: 'Write a script that reads notes.txt and creates uppercase-notes.txt containing the same lines in uppercase.',
      },
      {
        type: 'keypoints',
        items: [
          'Use with open(...) to close files automatically.',
          'read() loads the full file as one string.',
          'Looping over a file reads it line by line.',
          'Use "w" to write, "a" to append, and "r" to read.',
        ],
      },
    ],
  },
  {
    slug: 'python-paths',
    title: 'Paths with pathlib',
    description:
      'Use pathlib to create, combine, inspect, and read filesystem paths cleanly.',
    level: 'intermediate',
    section: 'Files & Data',
    order: 31,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'pathlib is the modern standard-library way to work with file paths. It gives you Path objects instead of plain strings.',
      },
      {
        type: 'p',
        text: 'Path objects know how to join paths, check whether files exist, create folders, and read or write text.',
      },
      { type: 'h2', text: 'Create paths safely' },
      {
        type: 'code',
        language: 'python',
        title: 'Joining path parts',
        code: `from pathlib import Path

project_dir = Path("reports")
input_file = project_dir / "january.txt"

print(input_file)
print(input_file.suffix)
print(input_file.stem)`,
      },
      { type: 'h2', text: 'Create folders and write files' },
      {
        type: 'code',
        language: 'python',
        title: 'Generating a report file',
        code: `from pathlib import Path

reports_dir = Path("reports")
reports_dir.mkdir(exist_ok=True)

report_path = reports_dir / "summary.txt"
report_path.write_text("Sales summary\\nTotal: $1200\\n", encoding="utf-8")

print(f"Wrote {report_path}")`,
      },
      { type: 'h2', text: 'Find matching files' },
      {
        type: 'code',
        language: 'python',
        title: 'List CSV files',
        code: `from pathlib import Path

data_dir = Path("data")

for csv_path in data_dir.glob("*.csv"):
    print(csv_path.name)`,
      },
      {
        type: 'note',
        text: 'Path("data") is relative to the current working directory, which is where you run the script from.',
      },
      {
        type: 'tip',
        text: 'Use Path(__file__).parent when a script needs paths relative to the script file instead of the terminal location.',
      },
      {
        type: 'try',
        text: 'Create an exports folder with pathlib, then write a file named users.txt inside it.',
      },
      {
        type: 'keypoints',
        items: [
          'pathlib.Path represents filesystem paths.',
          'Use the / operator to join path parts.',
          'mkdir(exist_ok=True) creates a folder if needed.',
          'Path objects provide convenient read_text(), write_text(), and glob() methods.',
        ],
      },
    ],
  },
  {
    slug: 'python-json',
    title: 'Working with JSON',
    description:
      'Read, write, and validate JSON data with Python dictionaries and lists.',
    level: 'intermediate',
    section: 'Files & Data',
    order: 32,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'JSON is a common format for APIs, configuration files, and exported data. Python converts JSON objects into dictionaries and JSON arrays into lists.',
      },
      {
        type: 'p',
        text: 'The standard json module gives you functions for parsing JSON strings and reading or writing JSON files.',
      },
      { type: 'h2', text: 'Load JSON from a string' },
      {
        type: 'code',
        language: 'python',
        title: 'Parsing an API-like response',
        code: `import json

raw_response = '{"id": 101, "name": "Ada", "active": true}'

user = json.loads(raw_response)

print(user["name"])
print(user["active"])`,
      },
      { type: 'h2', text: 'Read and write JSON files' },
      {
        type: 'code',
        language: 'json',
        title: 'settings.json',
        code: `{
  "theme": "dark",
  "notifications": true,
  "refresh_minutes": 15
}`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'Updating settings',
        code: `import json
from pathlib import Path

settings_path = Path("settings.json")
settings = json.loads(settings_path.read_text(encoding="utf-8"))

settings["refresh_minutes"] = 30
settings["last_updated_by"] = "admin"

settings_path.write_text(
    json.dumps(settings, indent=2),
    encoding="utf-8",
)`,
      },
      { type: 'h2', text: 'Handle missing keys' },
      {
        type: 'code',
        language: 'python',
        title: 'Safer access',
        code: `profile = {"name": "Grace", "city": "London"}

timezone = profile.get("timezone", "UTC")

print(f"{profile['name']} uses {timezone}")`,
      },
      {
        type: 'note',
        text: 'JSON has true, false, and null. Python converts them to True, False, and None when loading JSON.',
      },
      {
        type: 'tip',
        text: 'Use indent=2 when writing JSON that humans will read. Compact JSON is smaller, but formatted JSON is easier to review.',
      },
      {
        type: 'try',
        text: 'Create a contacts.json file containing a list of contacts, load it, add one contact, and write it back with indentation.',
      },
      {
        type: 'keypoints',
        items: [
          'json.loads() parses a JSON string.',
          'json.dumps() converts Python data to a JSON string.',
          'JSON objects become dictionaries and arrays become lists.',
          'Use dictionary get() for optional fields.',
        ],
      },
    ],
  },
  {
    slug: 'python-csv',
    title: 'CSV Files',
    description:
      'Read and write spreadsheet-friendly CSV files with Python’s csv module.',
    level: 'intermediate',
    section: 'Files & Data',
    order: 33,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'CSV means comma-separated values. It is a simple table format used by spreadsheets, exports, and many business tools.',
      },
      {
        type: 'p',
        text: 'Python’s csv module handles quoting, commas inside values, and line endings more safely than splitting strings yourself.',
      },
      { type: 'h2', text: 'Read rows as dictionaries' },
      {
        type: 'code',
        language: 'text',
        title: 'sales.csv',
        code: `date,customer,total
2026-01-02,Ada,120.50
2026-01-03,Grace,89.99
2026-01-04,Linus,240.00`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'Summing sales',
        code: `import csv

total_sales = 0

with open("sales.csv", "r", encoding="utf-8", newline="") as file:
    reader = csv.DictReader(file)

    for row in reader:
        total_sales += float(row["total"])

print(f"Total sales: \${total_sales:.2f}")`,
      },
      { type: 'h2', text: 'Write rows from dictionaries' },
      {
        type: 'code',
        language: 'python',
        title: 'Creating a CSV export',
        code: `import csv

rows = [
    {"name": "Ada", "role": "admin"},
    {"name": "Grace", "role": "editor"},
]

with open("users.csv", "w", encoding="utf-8", newline="") as file:
    fieldnames = ["name", "role"]
    writer = csv.DictWriter(file, fieldnames=fieldnames)

    writer.writeheader()
    writer.writerows(rows)`,
      },
      {
        type: 'note',
        text: 'Use newline="" when opening CSV files. It lets the csv module manage line endings correctly across platforms.',
      },
      {
        type: 'tip',
        text: 'Use DictReader and DictWriter when your CSV has headers. Named columns make scripts easier to maintain.',
      },
      {
        type: 'try',
        text: 'Read expenses.csv with columns category and amount, then print the total amount for the "travel" category.',
      },
      {
        type: 'keypoints',
        items: [
          'CSV stores table-like data in plain text.',
          'csv.DictReader reads rows as dictionaries using header names.',
          'csv.DictWriter writes dictionaries as rows.',
          'Convert numeric fields from strings before doing math.',
        ],
      },
    ],
  },
  {
    slug: 'python-exceptions',
    title: 'Exceptions & try/except',
    description:
      'Handle predictable errors without crashing your Python scripts.',
    level: 'intermediate',
    section: 'Errors & Robustness',
    order: 34,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'An exception is Python’s way of saying something went wrong while the program was running. Common examples include missing files, invalid numbers, and failed network calls.',
      },
      {
        type: 'p',
        text: 'try/except lets you handle specific failures and keep control of the program flow.',
      },
      { type: 'h2', text: 'Catch a specific error' },
      {
        type: 'code',
        language: 'python',
        title: 'Converting user input',
        code: `raw_quantity = input("Quantity: ")

try:
    quantity = int(raw_quantity)
except ValueError:
    print("Please enter a whole number.")
else:
    print(f"You ordered {quantity} items.")`,
      },
      { type: 'h2', text: 'Handle missing files' },
      {
        type: 'code',
        language: 'python',
        title: 'Reading optional configuration',
        code: `from pathlib import Path

config_path = Path("config.txt")

try:
    config = config_path.read_text(encoding="utf-8")
except FileNotFoundError:
    config = "mode=development"
    print("No config file found. Using defaults.")

print(config)`,
      },
      { type: 'h2', text: 'Use finally for cleanup' },
      {
        type: 'code',
        language: 'python',
        title: 'finally always runs',
        code: `try:
    print("Starting import...")
    count = int("12")
except ValueError:
    print("Import count was invalid.")
finally:
    print("Import attempt finished.")`,
      },
      {
        type: 'note',
        text: 'Catch the most specific exception you expect. A broad except can hide bugs you did not mean to handle.',
      },
      {
        type: 'tip',
        text: 'Use else for code that should run only when the try block succeeds.',
      },
      {
        type: 'try',
        text: 'Ask for a filename, try to read it, and print a friendly message if the file does not exist.',
      },
      {
        type: 'keypoints',
        items: [
          'try contains code that might fail.',
          'except handles a specific exception type.',
          'else runs only if no exception happened.',
          'finally runs whether the operation succeeds or fails.',
        ],
      },
    ],
  },
  {
    slug: 'python-custom-errors',
    title: 'Raising & Custom Exceptions',
    description:
      'Signal invalid situations clearly by raising exceptions and defining custom error types.',
    level: 'intermediate',
    section: 'Errors & Robustness',
    order: 35,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Sometimes your code detects a problem and should stop the current operation. The raise statement creates an exception on purpose.',
      },
      {
        type: 'p',
        text: 'Custom exception classes make errors easier to catch and understand in larger programs.',
      },
      { type: 'h2', text: 'Raise a built-in exception' },
      {
        type: 'code',
        language: 'python',
        title: 'Validating a discount',
        code: `def apply_discount(price, percent):
    if percent < 0 or percent > 100:
        raise ValueError("percent must be between 0 and 100")

    return price * (1 - percent / 100)

print(apply_discount(80, 15))`,
      },
      { type: 'h2', text: 'Create a custom exception' },
      {
        type: 'code',
        language: 'python',
        title: 'Domain-specific errors',
        code: `class InventoryError(Exception):
    """Raised when inventory cannot satisfy an order."""


def reserve_stock(sku, requested, available):
    if requested > available:
        raise InventoryError(
            f"Only {available} units available for {sku}; requested {requested}"
        )

    return available - requested


try:
    remaining = reserve_stock("KB-1", requested=8, available=3)
except InventoryError as error:
    print(f"Could not reserve stock: {error}")
else:
    print(f"Remaining stock: {remaining}")`,
      },
      {
        type: 'note',
        text: 'A custom exception usually inherits from Exception and often does not need any extra methods at first.',
      },
      {
        type: 'tip',
        text: 'Raise errors close to where invalid data is discovered. Catch them at a level that can decide what to do next.',
      },
      {
        type: 'try',
        text: 'Create a PasswordTooShortError and raise it when a password has fewer than 8 characters.',
      },
      {
        type: 'keypoints',
        items: [
          'raise starts an exception intentionally.',
          'Use built-in exceptions like ValueError for common invalid values.',
          'Custom exceptions make application-specific failures clearer.',
          'Catch custom exceptions when you can recover or show a useful message.',
        ],
      },
    ],
  },
  {
    slug: 'python-classes',
    title: 'Classes & Objects',
    description:
      'Define classes that group data and behavior into reusable Python objects.',
    level: 'intermediate',
    section: 'Object-Oriented Python',
    order: 36,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'A class is a blueprint for objects. An object is a specific instance created from that blueprint.',
      },
      {
        type: 'p',
        text: 'Classes are useful when your program has concepts with related data and behavior, such as users, orders, accounts, or tickets.',
      },
      { type: 'h2', text: 'Define a simple class' },
      {
        type: 'code',
        language: 'python',
        title: 'A Customer class',
        code: `class Customer:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    def summary(self):
        return f"{self.name} <{self.email}>"


customer = Customer("Ada", "ada@example.com")

print(customer.name)
print(customer.summary())`,
      },
      { type: 'h2', text: 'Create multiple objects' },
      {
        type: 'code',
        language: 'python',
        title: 'Objects keep their own data',
        code: `class Task:
    def __init__(self, title, done=False):
        self.title = title
        self.done = done

    def complete(self):
        self.done = True


first = Task("Write report")
second = Task("Deploy site")

first.complete()

print(first.title, first.done)
print(second.title, second.done)`,
      },
      {
        type: 'note',
        text: '__init__ is called when you create a new object. It usually stores the starting attributes on self.',
      },
      {
        type: 'tip',
        text: 'Name classes with CapWords, such as CustomerProfile or InvoiceLine. Name objects with normal lowercase variable names.',
      },
      {
        type: 'try',
        text: 'Create a Book class with title, author, and a description() method that returns "Title by Author".',
      },
      {
        type: 'keypoints',
        items: [
          'A class defines the structure and behavior of objects.',
          'An object is an instance of a class.',
          '__init__ initializes new objects.',
          'Methods are functions that belong to a class.',
        ],
      },
    ],
  },
  {
    slug: 'python-methods',
    title: 'Instance Methods, Attributes & self',
    description:
      'Understand how object attributes and instance methods work together through self.',
    level: 'intermediate',
    section: 'Object-Oriented Python',
    order: 37,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Instance attributes are values stored on a specific object. Instance methods are functions that read or change those values.',
      },
      {
        type: 'p',
        text: 'The first parameter of an instance method is self. It refers to the object receiving the method call.',
      },
      { type: 'h2', text: 'self points to the current object' },
      {
        type: 'code',
        language: 'python',
        title: 'A small bank account',
        code: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("not enough funds")

        self.balance -= amount

    def display_balance(self):
        return f"{self.owner}: \${self.balance:.2f}"


account = BankAccount("Maya", 100)
account.deposit(50)
account.withdraw(30)

print(account.display_balance())`,
      },
      { type: 'h2', text: 'Class attributes vs instance attributes' },
      {
        type: 'code',
        language: 'python',
        title: 'Shared defaults',
        code: `class SupportTicket:
    default_status = "open"

    def __init__(self, title):
        self.title = title
        self.status = self.default_status


ticket = SupportTicket("Cannot log in")

print(ticket.title)
print(ticket.status)
print(SupportTicket.default_status)`,
      },
      {
        type: 'note',
        text: 'Python passes the object automatically when you call account.deposit(50). Inside the method, that object is named self.',
      },
      {
        type: 'tip',
        text: 'Avoid mutable class attributes such as [] or {} unless you intentionally want all instances to share one object.',
      },
      {
        type: 'try',
        text: 'Add a transfer_to(other_account, amount) method that withdraws from one BankAccount and deposits into another.',
      },
      {
        type: 'keypoints',
        items: [
          'Instance attributes belong to one object.',
          'Instance methods receive self as their first parameter.',
          'self lets methods read and change the current object.',
          'Class attributes are shared through the class unless overridden on an instance.',
        ],
      },
    ],
  },
  {
    slug: 'python-inheritance',
    title: 'Inheritance & super()',
    description:
      'Reuse and extend class behavior with inheritance and super().',
    level: 'intermediate',
    section: 'Object-Oriented Python',
    order: 38,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Inheritance lets one class reuse behavior from another class. The child class can add new methods or override existing ones.',
      },
      {
        type: 'p',
        text: 'Use inheritance when classes truly share an is-a relationship, such as AdminUser being a type of User.',
      },
      { type: 'h2', text: 'Create a child class' },
      {
        type: 'code',
        language: 'python',
        title: 'User and AdminUser',
        code: `class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    def profile(self):
        return f"{self.name} <{self.email}>"


class AdminUser(User):
    def can_delete_users(self):
        return True


admin = AdminUser("Ada", "ada@example.com")

print(admin.profile())
print(admin.can_delete_users())`,
      },
      { type: 'h2', text: 'Extend initialization with super()' },
      {
        type: 'code',
        language: 'python',
        title: 'Adding child-specific data',
        code: `class Employee:
    def __init__(self, name, department):
        self.name = name
        self.department = department

    def label(self):
        return f"{self.name} ({self.department})"


class Manager(Employee):
    def __init__(self, name, department, team_size):
        super().__init__(name, department)
        self.team_size = team_size

    def label(self):
        return f"{super().label()} - manages {self.team_size} people"


manager = Manager("Grace", "Engineering", 6)

print(manager.label())`,
      },
      {
        type: 'note',
        text: 'super() calls behavior from the parent class. It is commonly used to reuse parent initialization before adding child-specific attributes.',
      },
      {
        type: 'tip',
        text: 'Favor composition when an object has another object. Use inheritance when the child really is a more specific version of the parent.',
      },
      {
        type: 'try',
        text: 'Create a Vehicle class and a DeliveryVan child class that adds cargo_capacity and overrides description().',
      },
      {
        type: 'keypoints',
        items: [
          'Inheritance lets a child class reuse parent behavior.',
          'Child classes can add or override methods.',
          'super() calls methods from the parent class.',
          'Use inheritance for clear is-a relationships.',
        ],
      },
    ],
  },
  {
    slug: 'python-magic-methods',
    title: 'Dunder / Magic Methods',
    description:
      'Make objects work naturally with print(), len(), comparisons, and other Python behavior.',
    level: 'intermediate',
    section: 'Object-Oriented Python',
    order: 39,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Dunder methods have double underscores before and after their names, such as __str__. Python calls these methods in response to built-in operations.',
      },
      {
        type: 'p',
        text: 'You do not call most dunder methods directly. You implement them so your objects feel natural in normal Python code.',
      },
      { type: 'h2', text: 'Readable string output' },
      {
        type: 'code',
        language: 'python',
        title: '__str__ and __repr__',
        code: `class Product:
    def __init__(self, sku, name, price):
        self.sku = sku
        self.name = name
        self.price = price

    def __str__(self):
        return f"{self.name} (\${self.price:.2f})"

    def __repr__(self):
        return f"Product(sku={self.sku!r}, name={self.name!r}, price={self.price!r})"


product = Product("KB-1", "Keyboard", 49.99)

print(product)
print(repr(product))`,
      },
      { type: 'h2', text: 'Length and equality' },
      {
        type: 'code',
        language: 'python',
        title: 'A collection-like object',
        code: `class Playlist:
    def __init__(self, name, songs):
        self.name = name
        self.songs = list(songs)

    def __len__(self):
        return len(self.songs)

    def __contains__(self, song):
        return song in self.songs


playlist = Playlist("Focus", ["Intro", "Deep Work", "Break"])

print(len(playlist))
print("Deep Work" in playlist)`,
      },
      {
        type: 'note',
        text: '__repr__ is usually aimed at developers and debugging. __str__ is usually aimed at friendly display.',
      },
      {
        type: 'tip',
        text: 'Only implement magic methods that make your object clearer to use. Do not add them just because they exist.',
      },
      {
        type: 'try',
        text: 'Create a Cart class where len(cart) returns the number of items and str(cart) returns a friendly summary.',
      },
      {
        type: 'keypoints',
        items: [
          'Dunder methods connect custom classes to Python syntax and built-ins.',
          '__str__ controls friendly string output.',
          '__repr__ controls developer-focused representation.',
          '__len__ and __contains__ support len(obj) and value in obj.',
        ],
      },
    ],
  },
  {
    slug: 'python-packages',
    title: 'Packages & Project Layout',
    description:
      'Organize Python code into modules and packages that are easier to run, import, and test.',
    level: 'intermediate',
    section: 'Tooling',
    order: 40,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'As scripts grow, putting everything in one file becomes hard to maintain. Modules and packages help you split code by responsibility.',
      },
      {
        type: 'p',
        text: 'A module is a Python file. A package is a folder of modules, usually with an __init__.py file.',
      },
      { type: 'h2', text: 'A practical project layout' },
      {
        type: 'code',
        language: 'text',
        title: 'Project folders',
        code: `sales_report/
  README.md
  pyproject.toml
  sales_report/
    __init__.py
    cli.py
    calculations.py
  tests/
    test_calculations.py`,
      },
      { type: 'h2', text: 'Split logic into modules' },
      {
        type: 'code',
        language: 'python',
        title: 'sales_report/calculations.py',
        code: `def total_sales(rows):
    return sum(float(row["total"]) for row in rows)


def average_sale(rows):
    if not rows:
        return 0

    return total_sales(rows) / len(rows)`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'sales_report/cli.py',
        code: `from sales_report.calculations import average_sale, total_sales


def main():
    rows = [
        {"customer": "Ada", "total": "120.50"},
        {"customer": "Grace", "total": "89.99"},
    ]

    print(f"Total: \${total_sales(rows):.2f}")
    print(f"Average: \${average_sale(rows):.2f}")


if __name__ == "__main__":
    main()`,
      },
      {
        type: 'note',
        text: 'The if __name__ == "__main__" block lets a file run as a script while still being safe to import from tests or other modules.',
      },
      {
        type: 'tip',
        text: 'Keep calculation and business logic separate from command-line input and printing. It makes the logic easier to test.',
      },
      {
        type: 'try',
        text: 'Move a temperature conversion function into conversions.py, then import and use it from cli.py.',
      },
      {
        type: 'keypoints',
        items: [
          'A module is a Python file.',
          'A package is a folder of importable Python modules.',
          'Project layout should separate reusable logic from scripts.',
          '__name__ == "__main__" protects script-only code when importing.',
        ],
      },
    ],
  },
  {
    slug: 'python-venv-pip',
    title: 'Virtual Environments & pip',
    description:
      'Create isolated Python environments and install third-party packages safely.',
    level: 'intermediate',
    section: 'Tooling',
    order: 41,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A virtual environment is an isolated Python workspace for one project. It keeps project dependencies separate from your system Python and other projects.',
      },
      {
        type: 'p',
        text: 'pip is Python’s package installer. You use it to install packages such as requests, pytest, or rich into the active environment.',
      },
      { type: 'h2', text: 'Create and activate a virtual environment' },
      {
        type: 'code',
        language: 'bash',
        title: 'macOS and Linux',
        code: `python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Windows PowerShell',
        code: `py -m venv .venv
.venv\\Scripts\\Activate.ps1
python -m pip install --upgrade pip`,
      },
      { type: 'h2', text: 'Install and record dependencies' },
      {
        type: 'code',
        language: 'bash',
        title: 'Installing packages',
        code: `python -m pip install requests pytest
python -m pip freeze > requirements.txt`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Installing from requirements.txt',
        code: `python -m pip install -r requirements.txt`,
      },
      {
        type: 'note',
        text: 'Use python -m pip instead of plain pip when possible. It makes sure pip belongs to the Python interpreter you are using.',
      },
      {
        type: 'tip',
        text: 'Name the environment folder .venv and do not commit it to Git. Commit requirements.txt or pyproject.toml instead.',
      },
      {
        type: 'try',
        text: 'Create a new folder, make a virtual environment, activate it, install requests, and run python -c "import requests; print(requests.__version__)".',
      },
      {
        type: 'keypoints',
        items: [
          'Virtual environments isolate dependencies per project.',
          'venv is included with Python 3.',
          'pip installs third-party packages into the active environment.',
          'requirements.txt records package versions for repeatable installs.',
        ],
      },
    ],
  },
  {
    slug: 'python-datetime',
    title: 'Dates & Time',
    description:
      'Work with dates, times, timedeltas, formatting, and timezone-aware values.',
    level: 'intermediate',
    section: 'Standard Library Power',
    order: 42,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Dates and times appear in logs, reports, APIs, invoices, and schedules. Python’s datetime module provides types for date, time, datetime, and durations.',
      },
      {
        type: 'p',
        text: 'The most important skill is knowing whether you have a date only, a time only, or a full datetime.',
      },
      { type: 'h2', text: 'Create and format dates' },
      {
        type: 'code',
        language: 'python',
        title: 'Dates and formatted strings',
        code: `from datetime import date, timedelta

today = date.today()
due_date = today + timedelta(days=14)

print(today)
print(due_date.strftime("%B %d, %Y"))`,
      },
      { type: 'h2', text: 'Parse date strings' },
      {
        type: 'code',
        language: 'python',
        title: 'Reading dates from data',
        code: `from datetime import datetime

raw_order_date = "2026-07-25 10:30"
order_date = datetime.strptime(raw_order_date, "%Y-%m-%d %H:%M")

print(order_date)
print(order_date.weekday())`,
      },
      { type: 'h2', text: 'Use timezone-aware datetimes' },
      {
        type: 'code',
        language: 'python',
        title: 'UTC timestamps',
        code: `from datetime import datetime, timezone

created_at = datetime.now(timezone.utc)

print(created_at.isoformat())`,
      },
      {
        type: 'note',
        text: 'strftime() formats a date or datetime as text. strptime() parses text into a datetime using the same style of format codes.',
      },
      {
        type: 'tip',
        text: 'Store timestamps in UTC when possible, then convert for display at the edges of your application.',
      },
      {
        type: 'try',
        text: 'Parse "2026-12-31" into a date-like datetime, add 30 days, and print the result as "Jan 30, 2027".',
      },
      {
        type: 'keypoints',
        items: [
          'date stores year, month, and day.',
          'datetime stores date and time together.',
          'timedelta represents a duration.',
          'Prefer timezone-aware datetimes for real timestamps.',
        ],
      },
    ],
  },
  {
    slug: 'python-regex',
    title: 'Regular Expressions',
    description:
      'Find, validate, and extract text patterns with Python’s re module.',
    level: 'intermediate',
    section: 'Standard Library Power',
    order: 43,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Regular expressions, often called regex, describe text patterns. They are useful for validation, searching logs, and extracting pieces of messy text.',
      },
      {
        type: 'p',
        text: 'Python’s re module provides functions such as search(), findall(), and sub() for working with patterns.',
      },
      { type: 'h2', text: 'Search for a pattern' },
      {
        type: 'code',
        language: 'python',
        title: 'Find an order ID',
        code: `import re

message = "Order A-1042 shipped on 2026-07-25"
match = re.search(r"Order ([A-Z]-\\d+)", message)

if match:
    print(match.group(1))`,
      },
      { type: 'h2', text: 'Validate simple input' },
      {
        type: 'code',
        language: 'python',
        title: 'Checking a product code',
        code: `import re

def is_product_code(value):
    return re.fullmatch(r"[A-Z]{2}-\\d{4}", value) is not None


print(is_product_code("KB-1024"))
print(is_product_code("keyboard-1024"))`,
      },
      { type: 'h2', text: 'Extract repeated matches' },
      {
        type: 'code',
        language: 'python',
        title: 'Find email-like values',
        code: `import re

text = "Contact ada@example.com or support@example.org for help."
emails = re.findall(r"[\\w.-]+@[\\w.-]+\\.\\w+", text)

print(emails)`,
      },
      {
        type: 'note',
        text: 'Prefix regex strings with r, such as r"\\d+". Raw strings reduce confusion with backslashes.',
      },
      {
        type: 'tip',
        text: 'Do not use a complicated regex when normal string methods are enough. Regex is powerful, but readability matters.',
      },
      {
        type: 'try',
        text: 'Write a regex that extracts invoice numbers like INV-2026-0042 from a block of text.',
      },
      {
        type: 'keypoints',
        items: [
          'Regex patterns describe text to find or validate.',
          're.search() finds the first match anywhere in a string.',
          're.fullmatch() requires the entire string to match.',
          'Groups let you extract specific parts of a match.',
        ],
      },
    ],
  },
  {
    slug: 'python-typing',
    title: 'Type Hints',
    description:
      'Add readable type hints that help editors, teammates, and static checkers understand your code.',
    level: 'intermediate',
    section: 'Modern Python',
    order: 44,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Type hints describe the kinds of values a function expects and returns. Python still runs dynamically, but hints improve documentation and editor feedback.',
      },
      {
        type: 'p',
        text: 'Modern Python can type common containers directly with list[str], dict[str, int], and tuple[str, int].',
      },
      { type: 'h2', text: 'Annotate functions' },
      {
        type: 'code',
        language: 'python',
        title: 'Function type hints',
        code: `def format_total(customer: str, amount: float) -> str:
    return f"{customer}: \${amount:.2f}"


print(format_total("Ada", 42.5))`,
      },
      { type: 'h2', text: 'Type collections' },
      {
        type: 'code',
        language: 'python',
        title: 'Lists and dictionaries',
        code: `def total_by_category(expenses: list[dict[str, float]]) -> dict[str, float]:
    totals: dict[str, float] = {}

    for expense in expenses:
        category = str(expense["category"])
        amount = float(expense["amount"])
        totals[category] = totals.get(category, 0) + amount

    return totals`,
      },
      { type: 'h2', text: 'Optional values' },
      {
        type: 'code',
        language: 'python',
        title: 'None as a possible value',
        code: `def find_user_email(user_id: int) -> str | None:
    emails = {
        1: "ada@example.com",
        2: "grace@example.com",
    }

    return emails.get(user_id)


email = find_user_email(3)

if email is None:
    print("User not found")
else:
    print(email.lower())`,
      },
      {
        type: 'note',
        text: 'Type hints do not enforce types at runtime by themselves. Tools such as mypy, pyright, and editors use them for checking and autocomplete.',
      },
      {
        type: 'tip',
        text: 'Start by typing function parameters and return values. You do not need to annotate every local variable.',
      },
      {
        type: 'try',
        text: 'Add type hints to a function that accepts a list of prices and returns the average as a float.',
      },
      {
        type: 'keypoints',
        items: [
          'Type hints document expected value types.',
          'Use -> to annotate a function return type.',
          'Use | None when a value may be missing.',
          'Static checkers can find mistakes before runtime.',
        ],
      },
    ],
  },
  {
    slug: 'python-dataclasses',
    title: 'Dataclasses',
    description:
      'Use dataclasses to create clean data-focused classes with less boilerplate.',
    level: 'intermediate',
    section: 'Modern Python',
    order: 45,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Dataclasses are a standard-library feature for classes that mostly store data. They automatically create methods such as __init__ and __repr__.',
      },
      {
        type: 'p',
        text: 'They work especially well with type hints and are great for small records, configuration objects, and parsed data.',
      },
      { type: 'h2', text: 'Create a dataclass' },
      {
        type: 'code',
        language: 'python',
        title: 'An invoice line item',
        code: `from dataclasses import dataclass


@dataclass
class LineItem:
    sku: str
    quantity: int
    unit_price: float

    def total(self) -> float:
        return self.quantity * self.unit_price


item = LineItem("KB-1", 2, 49.99)

print(item)
print(item.total())`,
      },
      { type: 'h2', text: 'Defaults and default factories' },
      {
        type: 'code',
        language: 'python',
        title: 'Avoid shared mutable defaults',
        code: `from dataclasses import dataclass, field


@dataclass
class Project:
    name: str
    tags: list[str] = field(default_factory=list)


website = Project("Website redesign")
website.tags.append("frontend")

api = Project("API cleanup")

print(website)
print(api)`,
      },
      { type: 'h2', text: 'Immutable data objects' },
      {
        type: 'code',
        language: 'python',
        title: 'Frozen dataclass',
        code: `from dataclasses import dataclass


@dataclass(frozen=True)
class Money:
    amount: float
    currency: str = "USD"


price = Money(19.99)
print(price)`,
      },
      {
        type: 'note',
        text: 'field(default_factory=list) creates a new list for each object. This avoids accidentally sharing one list across all instances.',
      },
      {
        type: 'tip',
        text: 'Use dataclasses for data containers. Use regular classes when behavior and invariants are more important than stored fields.',
      },
      {
        type: 'try',
        text: 'Create a dataclass named Task with title, completed defaulting to False, and a tags list using default_factory.',
      },
      {
        type: 'keypoints',
        items: [
          '@dataclass generates common methods from typed fields.',
          'Dataclasses reduce boilerplate for data-focused classes.',
          'Use default_factory for mutable defaults.',
          'frozen=True creates objects that cannot be changed after creation.',
        ],
      },
    ],
  },
  {
    slug: 'python-http',
    title: 'HTTP Requests & APIs',
    description:
      'Call web APIs from Python, inspect responses, and handle common request problems.',
    level: 'intermediate',
    section: 'Talking to the Web',
    order: 46,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'HTTP APIs let programs exchange data over the web. A Python script can request JSON from a service, send form data, or automate an internal workflow.',
      },
      {
        type: 'p',
        text: 'The popular requests package is not included with Python, but it is widely used because it makes HTTP calls straightforward.',
      },
      { type: 'h2', text: 'Install requests' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install the third-party package',
        code: `python -m pip install requests`,
      },
      { type: 'h2', text: 'Make a GET request' },
      {
        type: 'code',
        language: 'python',
        title: 'Fetching JSON from an API',
        code: `import requests

url = "https://api.example.com/products"
response = requests.get(url, timeout=10)

response.raise_for_status()
products = response.json()

for product in products:
    print(product["name"], product["price"])`,
      },
      { type: 'h2', text: 'Send JSON with POST' },
      {
        type: 'code',
        language: 'python',
        title: 'Creating a ticket',
        code: `import requests

payload = {
    "title": "Cannot log in",
    "priority": "high",
}

response = requests.post(
    "https://api.example.com/tickets",
    json=payload,
    timeout=10,
)

if response.status_code == 201:
    ticket = response.json()
    print(f"Created ticket {ticket['id']}")
else:
    print(f"Request failed: {response.status_code}")`,
      },
      { type: 'h2', text: 'Pass headers and query parameters' },
      {
        type: 'code',
        language: 'python',
        title: 'Authenticated request shape',
        code: `import requests

headers = {"Authorization": "Bearer YOUR_API_TOKEN"}
params = {"status": "open", "limit": 10}

response = requests.get(
    "https://api.example.com/tickets",
    headers=headers,
    params=params,
    timeout=10,
)

response.raise_for_status()
print(response.json())`,
      },
      {
        type: 'note',
        text: 'These examples show requests-style usage. Replace api.example.com with the real API endpoint and read that API’s authentication rules.',
      },
      {
        type: 'tip',
        text: 'Always set a timeout for network requests. Without one, a script can hang much longer than you expect.',
      },
      {
        type: 'try',
        text: 'Install requests and write a script that fetches JSON from a public test API, prints the response status code, and displays one field from the JSON.',
      },
      {
        type: 'keypoints',
        items: [
          'requests is a third-party package installed with pip.',
          'GET requests fetch data; POST requests often create data.',
          'response.json() parses a JSON response into Python data.',
          'Use timeouts and raise_for_status() for more reliable scripts.',
        ],
      },
    ],
  },
  {
    slug: 'python-testing',
    title: 'Testing Basics with pytest',
    description:
      'Write beginner-friendly but useful tests for Python functions with pytest.',
    level: 'intermediate',
    section: 'Quality',
    order: 47,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Tests are small programs that check whether your code behaves as expected. pytest is a popular testing tool with a simple style.',
      },
      {
        type: 'p',
        text: 'Good tests let you change code with more confidence because they catch regressions quickly.',
      },
      { type: 'h2', text: 'Install and run pytest' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install pytest',
        code: `python -m pip install pytest
python -m pytest`,
      },
      { type: 'h2', text: 'Test a simple function' },
      {
        type: 'code',
        language: 'python',
        title: 'calculator.py',
        code: `def add(a, b):
    return a + b


def divide(a, b):
    if b == 0:
        raise ValueError("cannot divide by zero")

    return a / b`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'test_calculator.py',
        code: `import pytest

from calculator import add, divide


def test_adds_two_numbers():
    assert add(2, 3) == 5


def test_divides_two_numbers():
    assert divide(10, 2) == 5


def test_divide_rejects_zero():
    with pytest.raises(ValueError):
        divide(10, 0)`,
      },
      { type: 'h2', text: 'Use parameterized tests' },
      {
        type: 'code',
        language: 'python',
        title: 'Testing several examples',
        code: `import pytest


def slugify(text):
    return text.strip().lower().replace(" ", "-")


@pytest.mark.parametrize(
    "text, expected",
    [
        ("Hello World", "hello-world"),
        ("  Python Tips  ", "python-tips"),
        ("api", "api"),
    ],
)
def test_slugify(text, expected):
    assert slugify(text) == expected`,
      },
      {
        type: 'note',
        text: 'pytest automatically discovers files named test_*.py and functions named test_*.',
      },
      {
        type: 'tip',
        text: 'Test behavior, not implementation details. A useful test should still make sense if the function is rewritten internally.',
      },
      {
        type: 'try',
        text: 'Create a function that calculates a cart total and write pytest tests for an empty cart, one item, and multiple items.',
      },
      {
        type: 'keypoints',
        items: [
          'pytest runs test functions whose names start with test_.',
          'Use assert to state the expected behavior.',
          'pytest.raises checks that an exception is raised.',
          'Parameterized tests check several examples without repeating test code.',
        ],
      },
    ],
  },
  {
    slug: 'python-debugging',
    title: 'Debugging & Logging',
    description:
      'Find problems with tracebacks, breakpoints, and practical logging.',
    level: 'intermediate',
    section: 'Quality',
    order: 48,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Debugging is the process of finding why code behaves differently than expected. Python gives you tracebacks, breakpoints, and the logging module to help.',
      },
      {
        type: 'p',
        text: 'Print statements can help while learning, but logging is better for scripts and applications because it supports levels, formatting, and output control.',
      },
      { type: 'h2', text: 'Read a traceback from the bottom up' },
      {
        type: 'code',
        language: 'text',
        title: 'Example traceback',
        code: `Traceback (most recent call last):
  File "report.py", line 9, in <module>
    total = calculate_total(rows)
  File "report.py", line 4, in calculate_total
    return sum(row["amount"] for row in rows)
KeyError: 'amount'`,
      },
      {
        type: 'p',
        text: 'The last line names the exception. The lines above show the path Python took to reach the error. In this example, one row did not have an "amount" key.',
      },
      { type: 'h2', text: 'Pause with breakpoint()' },
      {
        type: 'code',
        language: 'python',
        title: 'Inspect values interactively',
        code: `def calculate_total(rows):
    breakpoint()
    return sum(float(row["amount"]) for row in rows)


rows = [
    {"amount": "10.50"},
    {"total": "4.00"},
]

print(calculate_total(rows))`,
      },
      { type: 'h2', text: 'Use logging in scripts' },
      {
        type: 'code',
        language: 'python',
        title: 'Logging progress and problems',
        code: `import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s:%(name)s:%(message)s",
)

logger = logging.getLogger("importer")


def import_row(row):
    if "email" not in row:
        logger.warning("Skipping row without email: %s", row)
        return False

    logger.info("Imported %s", row["email"])
    return True


rows = [{"email": "ada@example.com"}, {"name": "Missing Email"}]

for row in rows:
    import_row(row)`,
      },
      {
        type: 'note',
        text: 'breakpoint() opens Python’s debugger in supported terminals. Type c to continue or q to quit the debugging session.',
      },
      {
        type: 'tip',
        text: 'Use logging levels intentionally: DEBUG for detailed developer information, INFO for normal progress, WARNING for recoverable problems, and ERROR for failures.',
      },
      {
        type: 'try',
        text: 'Add logging to a file-processing script so it logs how many rows were read and warns when a row is skipped.',
      },
      {
        type: 'keypoints',
        items: [
          'Tracebacks show where an exception happened and how Python got there.',
          'breakpoint() lets you pause and inspect values interactively.',
          'logging is better than print for ongoing scripts and applications.',
          'Logging levels help separate normal progress from problems.',
        ],
      },
    ],
  },
];
