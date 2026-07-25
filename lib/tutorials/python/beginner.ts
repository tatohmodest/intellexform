import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-python',
    title: 'What is Python?',
    description: 'Learn what Python is, where it is used, and why it is a friendly first programming language.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 8,
    content: [
      { type: 'p', text: 'Python is a general-purpose programming language. You can use it to build websites, automate boring tasks, analyze data, create games, work with AI, and write small scripts that save time.' },
      { type: 'p', text: 'Python is popular with beginners because its syntax reads more like English than many other languages. That lets you focus on solving problems instead of fighting punctuation.' },
      { type: 'h2', text: 'Why people learn Python' },
      { type: 'p', text: 'Python is useful because it works in many areas. A student can use it for homework helpers, an office worker can clean spreadsheets, and a developer can build a web app or data pipeline.' },
      {
        type: 'table',
        headers: ['Use case', 'Example'],
        rows: [
          ['Automation', 'Rename files or organize downloads'],
          ['Data', 'Calculate sales totals from a CSV file'],
          ['Web apps', 'Build a backend for user accounts'],
          ['AI and machine learning', 'Train a model or call an AI API'],
          ['Learning programming', 'Practice variables, loops, and functions']
        ]
      },
      { type: 'h2', text: 'A tiny Python program' },
      { type: 'p', text: 'The print function shows text on the screen. It is often the first Python command beginners learn because it gives immediate feedback.' },
      {
        type: 'code',
        title: 'hello.py',
        language: 'python',
        code: `print("Hello, Python!")
print("I am learning to code.")`
      },
      { type: 'h2', text: 'Python can calculate too' },
      { type: 'p', text: 'Python is not only for displaying messages. It can store values, do math, and reuse results in later lines.' },
      {
        type: 'code',
        title: 'A simple bill',
        language: 'python',
        code: `coffee_price = 4.50
muffin_price = 3.25
total = coffee_price + muffin_price

print(total)`
      },
      { type: 'note', text: 'Python 3 is the modern version of Python. This tutorial uses Python 3 throughout.' },
      { type: 'try', text: 'Write down three everyday tasks you do on a computer. For each task, imagine how a Python script might help automate or calculate something.' },
      { type: 'keypoints', items: ['Python is a general-purpose programming language.', 'It is used for automation, data, web apps, AI, and learning.', 'Python code is known for being readable.', 'This tutorial uses Python 3.'] }
    ]
  },
  {
    slug: 'python-setup',
    title: 'Install Python & Your Editor',
    description: 'Install Python 3, check that it works, and choose a beginner-friendly code editor.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 10,
    content: [
      { type: 'p', text: 'Before you can run Python programs on your computer, you need Python itself and a place to write code. Python runs your programs, while an editor helps you type, save, and organize them.' },
      { type: 'h2', text: 'Install Python 3' },
      { type: 'p', text: 'Download Python from python.org or use your operating system package manager. During installation on Windows, choose the option that adds Python to PATH so your terminal can find it.' },
      {
        type: 'code',
        title: 'Check Python on macOS or Linux',
        language: 'bash',
        code: `python3 --version`
      },
      {
        type: 'code',
        title: 'Check Python on Windows',
        language: 'bash',
        code: `py --version`
      },
      { type: 'h2', text: 'Choose an editor' },
      { type: 'p', text: 'A code editor is different from a word processor. It understands code, highlights mistakes, and helps you run files. Visual Studio Code is a common beginner choice, but any editor that supports Python is fine.' },
      { type: 'ul', items: ['Visual Studio Code: popular, free, and flexible', 'PyCharm Community: Python-focused and beginner friendly', 'IDLE: included with many Python installs and good for small experiments'] },
      { type: 'h2', text: 'Create a project folder' },
      { type: 'p', text: 'Keeping your code in a project folder makes files easier to find. Start with a folder named python-practice and save each lesson example inside it.' },
      {
        type: 'code',
        title: 'Make and enter a practice folder',
        language: 'bash',
        code: `mkdir python-practice
cd python-practice`
      },
      {
        type: 'code',
        title: 'Run a saved Python file',
        language: 'bash',
        code: `python3 hello.py`
      },
      { type: 'tip', text: 'If python3 does not work, try python or py. The exact command depends on your operating system and installation.' },
      { type: 'warning', text: 'Avoid saving Python files with names like python.py, random.py, or math.py. Those names can conflict with Python tools and built-in modules.' },
      { type: 'try', text: 'Install Python 3, open a terminal, and run the version command. Then create a folder named python-practice for your examples.' },
      { type: 'keypoints', items: ['Python runs your programs; an editor helps you write them.', 'Use Python 3 for modern Python learning.', 'Check your install from the terminal.', 'Save practice files in a dedicated project folder.'] }
    ]
  },
  {
    slug: 'python-first-program',
    title: 'Your First Python Program',
    description: 'Write, save, and run a small Python program that prints messages and uses variables.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 9,
    content: [
      { type: 'p', text: 'A program is a set of instructions for the computer. In Python, you usually write those instructions in a file ending with .py, then ask Python to run the file.' },
      { type: 'h2', text: 'Print a message' },
      { type: 'p', text: 'The print function sends output to the terminal. It is perfect for your first program because you can see exactly what happened.' },
      {
        type: 'code',
        title: 'hello.py',
        language: 'python',
        code: `print("Hello!")
print("Welcome to Python.")`
      },
      { type: 'h2', text: 'Run the file' },
      { type: 'p', text: 'After saving the file, run it from the same folder in your terminal. Running from the right folder matters because Python needs to find the file name you typed.' },
      {
        type: 'code',
        title: 'Run hello.py',
        language: 'bash',
        code: `python3 hello.py`
      },
      { type: 'h2', text: 'Add a variable' },
      { type: 'p', text: 'A variable gives a name to a value. Names make code easier to understand because you can describe what a value means.' },
      {
        type: 'code',
        title: 'greeting.py',
        language: 'python',
        code: `name = "Maya"
course = "Python"

print("Hello, Maya!")
print("You are learning Python.")`
      },
      {
        type: 'code',
        title: 'Use variables in the message',
        language: 'python',
        code: `name = "Maya"
course = "Python"

print("Hello,", name)
print("You are learning", course)`
      },
      { type: 'note', text: 'Python runs files from top to bottom. If a line depends on a variable, define the variable before that line runs.' },
      { type: 'try', text: 'Create a file named about_me.py. Print your name, your favorite food, and one thing you want to build with Python.' },
      { type: 'keypoints', items: ['Python files commonly end in .py.', 'print shows output in the terminal.', 'Run saved files with a Python command and the file name.', 'Variables let you name values and reuse them.'] }
    ]
  },
  {
    slug: 'python-syntax',
    title: 'Syntax, Indentation & Style',
    description: 'Understand Python syntax rules, why indentation matters, and how clean style makes code easier to read.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 11,
    content: [
      { type: 'p', text: 'Syntax means the rules of a programming language. Python syntax is fairly small, but it is strict about indentation because indentation shows which lines belong together.' },
      { type: 'h2', text: 'Python reads line by line' },
      { type: 'p', text: 'Most Python statements go on their own line. You do not need semicolons at the end of normal Python lines.' },
      {
        type: 'code',
        title: 'Simple statements',
        language: 'python',
        code: `city = "Chicago"
temperature = 72

print(city)
print(temperature)`
      },
      { type: 'h2', text: 'Indentation creates blocks' },
      { type: 'p', text: 'A block is a group of lines that belong to a statement such as if, for, while, or def. Python uses spaces at the start of a line to mark the block.' },
      {
        type: 'code',
        title: 'Indented block',
        language: 'python',
        code: `score = 88

if score >= 70:
    print("You passed!")
    print("Nice work.")`
      },
      { type: 'p', text: 'The two print lines are indented, so they belong to the if statement. If the score is too low, neither message runs.' },
      {
        type: 'code',
        title: 'Indentation error',
        language: 'python',
        code: `score = 88

if score >= 70:
print("You passed!")`
      },
      { type: 'warning', text: 'The last example is invalid because the print line should be indented under the if statement.' },
      { type: 'h2', text: 'Beginner style rules' },
      { type: 'ul', items: ['Use 4 spaces for each indentation level.', 'Use clear variable names like total_price instead of tp.', 'Put spaces around operators, such as total = price * quantity.', 'Keep examples small while you are learning.'] },
      { type: 'tip', text: 'Most Python editors can insert 4 spaces when you press Tab. This keeps indentation consistent.' },
      { type: 'try', text: 'Write an if statement that prints two messages when a score is 90 or higher. Make sure both print lines are indented.' },
      { type: 'keypoints', items: ['Syntax is the set of rules Python expects.', 'Python uses indentation to create code blocks.', 'A colon often introduces an indented block.', 'Clean spacing and clear names make code easier to read.'] }
    ]
  },
  {
    slug: 'python-comments',
    title: 'Comments',
    description: 'Use comments to explain why code exists without changing how the program runs.',
    level: 'beginner',
    section: 'Getting Started',
    order: 5,
    minutes: 7,
    content: [
      { type: 'p', text: 'A comment is text in your code that Python ignores. Comments are for humans: you, your classmates, your teammates, or your future self.' },
      { type: 'h2', text: 'Single-line comments' },
      { type: 'p', text: 'In Python, a comment starts with #. Anything after # on that line is ignored by Python.' },
      {
        type: 'code',
        title: 'Explain a calculation',
        language: 'python',
        code: `# Calculate the total cost for a small order
price = 12.99
quantity = 3
total = price * quantity

print(total)`
      },
      { type: 'h2', text: 'Comments should explain why' },
      { type: 'p', text: 'Good comments explain the reason behind code when the reason is not obvious. Avoid comments that simply repeat what the code already says.' },
      {
        type: 'code',
        title: 'Useful and less useful comments',
        language: 'python',
        code: `# Less useful: add 1 to attempts
attempts = attempts + 1

# Useful: allow the user one more try before locking the account
attempts = attempts + 1`
      },
      { type: 'h2', text: 'Temporarily disable code' },
      { type: 'p', text: 'While learning, comments can help you turn off a line without deleting it. This is useful when comparing outputs.' },
      {
        type: 'code',
        title: 'Comment out a line',
        language: 'python',
        code: `print("Start")
# print("This line is skipped")
print("End")`
      },
      { type: 'tip', text: 'If you need a long explanation, write a short comment above the code instead of adding a crowded comment at the end of a line.' },
      { type: 'try', text: 'Write a small bill calculator with comments explaining the price, tax rate, and final total.' },
      { type: 'keypoints', items: ['Comments start with #.', 'Python ignores comments when running code.', 'Good comments explain why code exists.', 'Comments can temporarily disable lines during experiments.'] }
    ]
  },
  {
    slug: 'python-variables',
    title: 'Variables',
    description: 'Learn how variables store values, why names matter, and how reassignment works.',
    level: 'beginner',
    section: 'Foundations',
    order: 6,
    minutes: 10,
    content: [
      { type: 'p', text: 'A variable is a name that points to a value. Variables help you remember what a value represents and reuse it later in your program.' },
      { type: 'h2', text: 'Create variables' },
      { type: 'p', text: 'Use one equals sign to assign a value to a variable. The name goes on the left, and the value goes on the right.' },
      {
        type: 'code',
        title: 'Customer details',
        language: 'python',
        code: `customer_name = "Alex"
items_in_cart = 4
member_discount = True

print(customer_name)
print(items_in_cart)
print(member_discount)`
      },
      { type: 'h2', text: 'Choose useful names' },
      { type: 'p', text: 'Good variable names make code easier to understand. A name like total_price is clearer than x because it explains what the number means.' },
      {
        type: 'table',
        headers: ['Less clear', 'Clearer'],
        rows: [
          ['n', 'student_name'],
          ['p', 'product_price'],
          ['x', 'monthly_rent'],
          ['ok', 'is_logged_in']
        ]
      },
      { type: 'h2', text: 'Reassign variables' },
      { type: 'p', text: 'A variable can point to a new value later. This is called reassignment, and it is common when values change during a program.' },
      {
        type: 'code',
        title: 'Update a score',
        language: 'python',
        code: `score = 10
print(score)

score = score + 5
print(score)`
      },
      {
        type: 'code',
        title: 'Build a total',
        language: 'python',
        code: `total = 0
total = total + 19.99
total = total + 5.50

print(total)`
      },
      { type: 'note', text: 'Python variable names can contain letters, numbers, and underscores, but they cannot start with a number.' },
      { type: 'try', text: 'Create variables for a movie ticket: movie_title, ticket_price, and seats. Print a sentence using those values.' },
      { type: 'keypoints', items: ['Variables give names to values.', 'Use = to assign a value.', 'Clear names make code easier to read.', 'Variables can be reassigned as your program runs.'] }
    ]
  },
  {
    slug: 'python-data-types',
    title: 'Data Types',
    description: 'Meet the common Python data types: strings, integers, floats, booleans, and None.',
    level: 'beginner',
    section: 'Foundations',
    order: 7,
    minutes: 11,
    content: [
      { type: 'p', text: 'A data type tells Python what kind of value it is working with. The type matters because Python handles text, numbers, true-or-false values, and missing values differently.' },
      { type: 'h2', text: 'Common beginner types' },
      {
        type: 'table',
        headers: ['Type', 'Meaning', 'Example'],
        rows: [
          ['str', 'Text', '"Lina"'],
          ['int', 'Whole number', '42'],
          ['float', 'Decimal number', '19.99'],
          ['bool', 'True or false', 'True'],
          ['NoneType', 'No value', 'None']
        ]
      },
      { type: 'h2', text: 'Examples in code' },
      { type: 'p', text: 'Python usually figures out the type from the value you assign. You do not need to declare the type before creating the variable.' },
      {
        type: 'code',
        title: 'Different values',
        language: 'python',
        code: `name = "Lina"
age = 16
price = 12.50
is_student = True
middle_name = None

print(name)
print(age)
print(price)
print(is_student)
print(middle_name)`
      },
      { type: 'h2', text: 'Check a type' },
      { type: 'p', text: 'The type function shows the type of a value. It is useful when debugging or learning what Python thinks a value is.' },
      {
        type: 'code',
        title: 'Using type()',
        language: 'python',
        code: `score = 98
message = "Great job"

print(type(score))
print(type(message))`
      },
      { type: 'h2', text: 'Types affect behavior' },
      { type: 'p', text: 'The same symbol can behave differently with different types. Adding numbers calculates a sum, while adding strings joins text together.' },
      {
        type: 'code',
        title: 'Number addition and string joining',
        language: 'python',
        code: `print(10 + 5)
print("10" + "5")`
      },
      { type: 'note', text: 'True, False, and None start with capital letters in Python.' },
      { type: 'try', text: 'Create one variable for each common type in the table. Print each value and its type.' },
      { type: 'keypoints', items: ['Data types describe what kind of value you have.', 'Common types include str, int, float, bool, and NoneType.', 'Python infers types from assigned values.', 'Use type() to inspect a value while learning.'] }
    ]
  },
  {
    slug: 'python-type-conversion',
    title: 'Type Conversion',
    description: 'Convert values between strings, numbers, and booleans when your program needs a different type.',
    level: 'beginner',
    section: 'Foundations',
    order: 8,
    minutes: 11,
    content: [
      { type: 'p', text: 'Type conversion means changing a value from one type to another. This is common when reading input, building messages, or doing math with values that started as text.' },
      { type: 'h2', text: 'Convert text to numbers' },
      { type: 'p', text: 'Input from users often arrives as a string. To do math, convert it to an int or float first.' },
      {
        type: 'code',
        title: 'String to integer',
        language: 'python',
        code: `age_text = "21"
age = int(age_text)

print(age + 1)`
      },
      {
        type: 'code',
        title: 'String to float',
        language: 'python',
        code: `price_text = "19.99"
price = float(price_text)

print(price * 2)`
      },
      { type: 'h2', text: 'Convert numbers to text' },
      { type: 'p', text: 'If you join text with a number using +, Python needs both values to be strings. Use str to make the number text.' },
      {
        type: 'code',
        title: 'Build a message',
        language: 'python',
        code: `score = 87
message = "Your score is " + str(score)

print(message)`
      },
      { type: 'h2', text: 'Invalid conversions' },
      { type: 'p', text: 'Python can convert "42" to an integer, but it cannot convert "forty-two" because that text is not written as a number.' },
      {
        type: 'code',
        title: 'Conversion that fails',
        language: 'python',
        code: `number_text = "ten"
number = int(number_text)

print(number)`
      },
      { type: 'warning', text: 'The last example raises an error. Only convert text to a number when the text is actually numeric.' },
      { type: 'tip', text: 'Use float for prices, measurements, and averages. Use int for counts, ages, and whole-number quantities.' },
      { type: 'try', text: 'Start with price_text = "8.50" and quantity_text = "3". Convert both values, calculate the total, and print it.' },
      { type: 'keypoints', items: ['Type conversion changes a value from one type to another.', 'Use int() for whole numbers and float() for decimals.', 'Use str() when you need a number inside a text message.', 'Invalid numeric text causes a conversion error.'] }
    ]
  },
  {
    slug: 'python-numbers',
    title: 'Numbers',
    description: 'Work with integers, floats, arithmetic, rounding, and number-friendly shortcuts.',
    level: 'beginner',
    section: 'Working with Data',
    order: 9,
    minutes: 10,
    content: [
      { type: 'p', text: 'Python is comfortable with numbers. You can use it like a calculator, but numbers become more powerful when you store them in variables and combine them with logic.' },
      { type: 'h2', text: 'Integers and floats' },
      { type: 'p', text: 'An int is a whole number. A float is a number with a decimal point. Python chooses the type based on how the number is written.' },
      {
        type: 'code',
        title: 'Number types',
        language: 'python',
        code: `students = 24
average_score = 86.5

print(type(students))
print(type(average_score))`
      },
      { type: 'h2', text: 'Arithmetic operators' },
      {
        type: 'table',
        headers: ['Operator', 'Meaning', 'Example result'],
        rows: [
          ['+', 'Add', '8 + 2 is 10'],
          ['-', 'Subtract', '8 - 2 is 6'],
          ['*', 'Multiply', '8 * 2 is 16'],
          ['/', 'Divide', '8 / 2 is 4.0'],
          ['//', 'Floor divide', '9 // 2 is 4'],
          ['%', 'Remainder', '9 % 2 is 1'],
          ['**', 'Power', '3 ** 2 is 9']
        ]
      },
      {
        type: 'code',
        title: 'Shopping total',
        language: 'python',
        code: `price = 15.00
quantity = 3
tax_rate = 0.08

subtotal = price * quantity
tax = subtotal * tax_rate
total = subtotal + tax

print(total)`
      },
      { type: 'h2', text: 'Round a number' },
      { type: 'p', text: 'Calculations with decimals can produce long results. Use round when you want a friendlier display value.' },
      {
        type: 'code',
        title: 'Round to two decimals',
        language: 'python',
        code: `total = 48.599999999
rounded_total = round(total, 2)

print(rounded_total)`
      },
      { type: 'note', text: 'Division with / returns a float, even when the answer looks like a whole number.' },
      { type: 'try', text: 'Calculate the average of three test scores. Store each score in a variable, then print the rounded average.' },
      { type: 'keypoints', items: ['int represents whole numbers; float represents decimals.', 'Python supports common arithmetic operators.', 'Use // for floor division and % for remainders.', 'round() helps display decimal results neatly.'] }
    ]
  },
  {
    slug: 'python-strings',
    title: 'Strings',
    description: 'Store and work with text using strings, indexing, slicing, and simple formatting.',
    level: 'beginner',
    section: 'Working with Data',
    order: 10,
    minutes: 11,
    content: [
      { type: 'p', text: 'A string is text. Names, emails, product titles, addresses, and messages are all common examples of strings in real programs.' },
      { type: 'h2', text: 'Create strings' },
      { type: 'p', text: 'You can write strings with single quotes or double quotes. Choose one style and stay consistent in a file.' },
      {
        type: 'code',
        title: 'Text values',
        language: 'python',
        code: `first_name = "Nora"
last_name = "Patel"
email = "nora@example.com"

print(first_name)
print(email)`
      },
      { type: 'h2', text: 'Combine strings' },
      { type: 'p', text: 'Joining strings is called concatenation. You can use +, but f-strings are often clearer when values are mixed into messages.' },
      {
        type: 'code',
        title: 'Concatenation',
        language: 'python',
        code: `first_name = "Nora"
last_name = "Patel"
full_name = first_name + " " + last_name

print(full_name)`
      },
      {
        type: 'code',
        title: 'An f-string',
        language: 'python',
        code: `product = "Notebook"
price = 4.99

print(f"The {product} costs {price}.")`
      },
      { type: 'h2', text: 'Indexes and slices' },
      { type: 'p', text: 'Each character in a string has a position called an index. Python starts counting at 0, so the first character is index 0.' },
      {
        type: 'code',
        title: 'Read parts of a string',
        language: 'python',
        code: `word = "Python"

print(word[0])
print(word[1])
print(word[0:3])`
      },
      { type: 'tip', text: 'Think of a slice like word[start:stop]. It starts at start and stops before stop.' },
      { type: 'try', text: 'Create a variable with your favorite city. Print the first letter, the last letter, and the first three letters.' },
      { type: 'keypoints', items: ['Strings store text.', 'Use quotes to create string values.', 'Use + to concatenate strings or f-strings to insert values.', 'String indexes start at 0, and slices read part of a string.'] }
    ]
  },
  {
    slug: 'python-string-methods',
    title: 'String Methods',
    description: 'Use common string methods to clean, search, and transform text.',
    level: 'beginner',
    section: 'Working with Data',
    order: 11,
    minutes: 10,
    content: [
      { type: 'p', text: 'A method is an action attached to a value. Strings have many useful methods for cleaning user input, changing capitalization, and checking what text contains.' },
      { type: 'h2', text: 'Clean extra spaces' },
      { type: 'p', text: 'User input often has accidental spaces. strip removes spaces from the beginning and end of a string.' },
      {
        type: 'code',
        title: 'Using strip()',
        language: 'python',
        code: `username = "  maya42  "
clean_username = username.strip()

print(clean_username)`
      },
      { type: 'h2', text: 'Change capitalization' },
      { type: 'p', text: 'Capitalization methods help display names and labels consistently.' },
      {
        type: 'code',
        title: 'Capitalization methods',
        language: 'python',
        code: `name = "aLEX riVERa"

print(name.lower())
print(name.upper())
print(name.title())`
      },
      { type: 'h2', text: 'Search and replace text' },
      { type: 'p', text: 'Methods like in, startswith, endswith, and replace are useful for checking emails, file names, and messages.' },
      {
        type: 'code',
        title: 'Check text',
        language: 'python',
        code: `email = "sam@example.com"

print("@" in email)
print(email.endswith(".com"))`
      },
      {
        type: 'code',
        title: 'Replace text',
        language: 'python',
        code: `message = "I like Java."
updated_message = message.replace("Java", "Python")

print(updated_message)`
      },
      {
        type: 'table',
        headers: ['Method', 'What it does'],
        rows: [
          ['strip()', 'Removes spaces from both ends'],
          ['lower()', 'Makes text lowercase'],
          ['upper()', 'Makes text uppercase'],
          ['title()', 'Capitalizes each word'],
          ['replace(old, new)', 'Replaces matching text']
        ]
      },
      { type: 'note', text: 'String methods return a new string. They do not change the original string unless you assign the result back to a variable.' },
      { type: 'try', text: 'Start with user_email = "  STUDENT@EXAMPLE.COM  ". Clean it, lowercase it, and check whether it contains @.' },
      { type: 'keypoints', items: ['String methods perform actions on text.', 'strip() is useful for cleaning user input.', 'lower(), upper(), and title() change capitalization.', 'replace() creates a new string with changed text.'] }
    ]
  },
  {
    slug: 'python-booleans',
    title: 'Booleans & Comparisons',
    description: 'Use True and False values to ask questions and make decisions in Python.',
    level: 'beginner',
    section: 'Working with Data',
    order: 12,
    minutes: 9,
    content: [
      { type: 'p', text: 'A boolean is a value that is either True or False. Booleans are the foundation of decisions in Python programs.' },
      { type: 'h2', text: 'Comparison operators' },
      { type: 'p', text: 'Comparisons ask questions. The answer is always a boolean.' },
      {
        type: 'table',
        headers: ['Operator', 'Question'],
        rows: [
          ['==', 'Are these equal?'],
          ['!=', 'Are these different?'],
          ['>', 'Is the left value greater?'],
          ['<', 'Is the left value smaller?'],
          ['>=', 'Is the left value greater or equal?'],
          ['<=', 'Is the left value smaller or equal?']
        ]
      },
      {
        type: 'code',
        title: 'Compare scores',
        language: 'python',
        code: `score = 82

print(score >= 70)
print(score == 100)
print(score < 50)`
      },
      { type: 'h2', text: 'Boolean variables' },
      { type: 'p', text: 'Boolean variables often start with words like is, has, or can because they represent yes-or-no ideas.' },
      {
        type: 'code',
        title: 'Yes-or-no values',
        language: 'python',
        code: `is_member = True
has_coupon = False

print(is_member)
print(has_coupon)`
      },
      { type: 'h2', text: 'Combine conditions' },
      { type: 'p', text: 'Use and when both conditions must be true. Use or when at least one condition must be true. Use not to flip a boolean.' },
      {
        type: 'code',
        title: 'Membership discount',
        language: 'python',
        code: `is_member = True
cart_total = 65

gets_discount = is_member and cart_total >= 50

print(gets_discount)`
      },
      { type: 'tip', text: 'Read boolean expressions out loud. For example: is_member and cart_total >= 50 means "is a member and cart total is at least 50".' },
      { type: 'try', text: 'Create an age variable and a has_ticket variable. Print whether someone can enter an event that requires age 18 or older and a ticket.' },
      { type: 'keypoints', items: ['Booleans are True or False.', 'Comparisons produce booleans.', 'Use == to compare values, not =.', 'Use and, or, and not to combine boolean logic.'] }
    ]
  },
  {
    slug: 'python-operators',
    title: 'Operators',
    description: 'Learn the operators Python uses for math, comparison, assignment, and logic.',
    level: 'beginner',
    section: 'Working with Data',
    order: 13,
    minutes: 10,
    content: [
      { type: 'p', text: 'Operators are symbols or words that perform operations on values. You have already seen operators for math and comparison; now we will organize the common ones.' },
      { type: 'h2', text: 'Arithmetic operators' },
      {
        type: 'code',
        title: 'Math with operators',
        language: 'python',
        code: `a = 10
b = 3

print(a + b)
print(a - b)
print(a * b)
print(a / b)
print(a % b)`
      },
      { type: 'h2', text: 'Assignment operators' },
      { type: 'p', text: 'Assignment operators update variables. They are useful when building totals, counting attempts, or changing a score.' },
      {
        type: 'code',
        title: 'Update a total',
        language: 'python',
        code: `points = 10
points += 5
points -= 2

print(points)`
      },
      { type: 'h2', text: 'Comparison and logic' },
      { type: 'p', text: 'Comparison operators create True or False values. Logical operators combine those values into a larger decision.' },
      {
        type: 'code',
        title: 'Check checkout rules',
        language: 'python',
        code: `cart_total = 42
shipping_country = "US"

free_shipping = cart_total >= 40 and shipping_country == "US"

print(free_shipping)`
      },
      {
        type: 'table',
        headers: ['Category', 'Operators'],
        rows: [
          ['Arithmetic', '+, -, *, /, //, %, **'],
          ['Assignment', '=, +=, -=, *=, /='],
          ['Comparison', '==, !=, >, <, >=, <='],
          ['Logic', 'and, or, not']
        ]
      },
      { type: 'note', text: 'Operator precedence decides which operation happens first. Parentheses make your intention clear when an expression becomes hard to read.' },
      {
        type: 'code',
        title: 'Use parentheses for clarity',
        language: 'python',
        code: `price = 20
quantity = 3
discount = 5

total = (price * quantity) - discount
print(total)`
      },
      { type: 'try', text: 'Create a points variable. Add 10, multiply by 2, then check whether the final value is at least 50.' },
      { type: 'keypoints', items: ['Operators perform actions on values.', 'Arithmetic operators do math.', 'Assignment operators update variables.', 'Comparison and logical operators help make decisions.'] }
    ]
  },
  {
    slug: 'python-lists',
    title: 'Lists',
    description: 'Store ordered collections with lists, then read, update, add, and remove items.',
    level: 'beginner',
    section: 'Collections',
    order: 14,
    minutes: 12,
    content: [
      { type: 'p', text: 'A list stores multiple values in one variable. Lists are ordered, changeable, and useful whenever you have a group of related items.' },
      { type: 'h2', text: 'Create a list' },
      { type: 'p', text: 'Lists use square brackets. Each item is separated by a comma.' },
      {
        type: 'code',
        title: 'Shopping list',
        language: 'python',
        code: `groceries = ["apples", "rice", "eggs"]

print(groceries)
print(groceries[0])
print(groceries[1])`
      },
      { type: 'h2', text: 'Change list items' },
      { type: 'p', text: 'Lists are mutable, which means you can change them after they are created.' },
      {
        type: 'code',
        title: 'Update and add items',
        language: 'python',
        code: `groceries = ["apples", "rice", "eggs"]

groceries[1] = "pasta"
groceries.append("milk")

print(groceries)`
      },
      { type: 'h2', text: 'Remove items' },
      { type: 'p', text: 'You can remove an item by value with remove, or remove the last item with pop.' },
      {
        type: 'code',
        title: 'Remove from a list',
        language: 'python',
        code: `tasks = ["email Sam", "pay bill", "walk dog"]

tasks.remove("pay bill")
finished_task = tasks.pop()

print(tasks)
print(finished_task)`
      },
      { type: 'h2', text: 'Loop through a list' },
      {
        type: 'code',
        title: 'Print each item',
        language: 'python',
        code: `scores = [82, 95, 74]

for score in scores:
    print(score)`
      },
      { type: 'tip', text: 'Use plural names for list variables, such as students or prices. Use singular names inside loops, such as student or price.' },
      { type: 'try', text: 'Create a list of three favorite snacks. Add one snack, replace one snack, and print each snack on its own line.' },
      { type: 'keypoints', items: ['Lists store ordered collections.', 'List indexes start at 0.', 'Lists are mutable, so you can update them.', 'append, remove, and pop are common list methods.'] }
    ]
  },
  {
    slug: 'python-tuples',
    title: 'Tuples',
    description: 'Use tuples for ordered values that should stay together and not be changed.',
    level: 'beginner',
    section: 'Collections',
    order: 15,
    minutes: 9,
    content: [
      { type: 'p', text: 'A tuple is an ordered collection, like a list, but it is immutable. Immutable means the tuple cannot be changed after it is created.' },
      { type: 'h2', text: 'Create a tuple' },
      { type: 'p', text: 'Tuples use parentheses. They are useful for values that belong together, such as coordinates, RGB colors, or fixed settings.' },
      {
        type: 'code',
        title: 'Coordinates',
        language: 'python',
        code: `location = (40.7128, -74.0060)

print(location)
print(location[0])
print(location[1])`
      },
      { type: 'h2', text: 'Why use a tuple?' },
      { type: 'p', text: 'Use a tuple when the order matters and the values should not be accidentally changed. This makes your intention clearer to other readers.' },
      {
        type: 'code',
        title: 'RGB color',
        language: 'python',
        code: `brand_blue = (20, 90, 200)
red = brand_blue[0]
green = brand_blue[1]
blue = brand_blue[2]

print(red, green, blue)`
      },
      { type: 'h2', text: 'Unpack a tuple' },
      { type: 'p', text: 'Unpacking assigns tuple items to separate variables in one line. This is clean when the tuple has a known structure.' },
      {
        type: 'code',
        title: 'Unpack values',
        language: 'python',
        code: `city = ("Seattle", "WA", 755000)
name, state, population = city

print(name)
print(state)
print(population)`
      },
      { type: 'warning', text: 'If you try to assign a new value to a tuple item, Python raises an error because tuples are immutable.' },
      {
        type: 'code',
        title: 'Lists vs tuples',
        language: 'python',
        code: `shopping_list = ["tea", "bread"]
fixed_days = ("Mon", "Tue", "Wed")

shopping_list.append("jam")
print(shopping_list)
print(fixed_days)`
      },
      { type: 'try', text: 'Create a tuple for a product with name, price, and in-stock status. Unpack it into three variables and print a short product summary.' },
      { type: 'keypoints', items: ['Tuples are ordered collections.', 'Tuple indexes start at 0.', 'Tuples are immutable after creation.', 'Unpacking makes structured tuple values easy to read.'] }
    ]
  },
  {
    slug: 'python-sets',
    title: 'Sets',
    description: 'Use sets to store unique values and compare groups of items.',
    level: 'beginner',
    section: 'Collections',
    order: 16,
    minutes: 10,
    content: [
      { type: 'p', text: 'A set stores unique values. If you add the same value more than once, the set keeps only one copy.' },
      { type: 'h2', text: 'Create a set' },
      { type: 'p', text: 'Sets use curly braces, but unlike lists, they do not keep a reliable order for indexing.' },
      {
        type: 'code',
        title: 'Unique tags',
        language: 'python',
        code: `tags = {"python", "beginner", "python", "coding"}

print(tags)`
      },
      { type: 'h2', text: 'Add and remove values' },
      {
        type: 'code',
        title: 'Manage a set',
        language: 'python',
        code: `skills = {"html", "css"}

skills.add("python")
skills.add("css")
skills.remove("html")

print(skills)`
      },
      { type: 'h2', text: 'Membership tests' },
      { type: 'p', text: 'Sets are great when you need to quickly check whether a value is included.' },
      {
        type: 'code',
        title: 'Check membership',
        language: 'python',
        code: `allowed_roles = {"admin", "editor", "viewer"}
user_role = "editor"

print(user_role in allowed_roles)`
      },
      { type: 'h2', text: 'Compare sets' },
      { type: 'p', text: 'Set operations help compare groups, such as students in two clubs or products in two categories.' },
      {
        type: 'code',
        title: 'Set operations',
        language: 'python',
        code: `morning_students = {"Ava", "Ben", "Chloe"}
afternoon_students = {"Ben", "Diego", "Emma"}

print(morning_students | afternoon_students)
print(morning_students & afternoon_students)
print(morning_students - afternoon_students)`
      },
      { type: 'note', text: 'Use set() to create an empty set. Empty curly braces create an empty dictionary, not an empty set.' },
      { type: 'try', text: 'Create two sets of favorite fruits from two friends. Print the combined favorites and the fruits both friends chose.' },
      { type: 'keypoints', items: ['Sets store unique values.', 'Sets are not indexed like lists.', 'Use in to check membership.', 'Set operations can combine and compare groups.'] }
    ]
  },
  {
    slug: 'python-dicts',
    title: 'Dictionaries',
    description: 'Store labeled data with dictionaries using keys and values.',
    level: 'beginner',
    section: 'Collections',
    order: 17,
    minutes: 12,
    content: [
      { type: 'p', text: 'A dictionary stores key-value pairs. A key is a label, and the value is the data stored under that label.' },
      { type: 'h2', text: 'Create a dictionary' },
      { type: 'p', text: 'Dictionaries use curly braces with key-value pairs separated by colons. They are excellent for records, settings, and structured information.' },
      {
        type: 'code',
        title: 'Student record',
        language: 'python',
        code: `student = {
    "name": "Iris",
    "grade": 10,
    "average": 91.5
}

print(student["name"])
print(student["average"])`
      },
      { type: 'h2', text: 'Add and update values' },
      { type: 'p', text: 'Assigning to a key adds it if it does not exist, or updates it if it already exists.' },
      {
        type: 'code',
        title: 'Update a dictionary',
        language: 'python',
        code: `product = {
    "name": "Backpack",
    "price": 39.99
}

product["price"] = 34.99
product["in_stock"] = True

print(product)`
      },
      { type: 'h2', text: 'Use get for optional keys' },
      { type: 'p', text: 'Accessing a missing key with square brackets causes an error. The get method lets you provide a fallback value.' },
      {
        type: 'code',
        title: 'Safe lookup',
        language: 'python',
        code: `profile = {
    "username": "river77",
    "city": "Austin"
}

print(profile.get("city"))
print(profile.get("phone", "No phone saved"))`
      },
      { type: 'h2', text: 'Loop through a dictionary' },
      {
        type: 'code',
        title: 'Print keys and values',
        language: 'python',
        code: `menu_item = {
    "name": "Veggie Wrap",
    "price": 8.75,
    "calories": 520
}

for key, value in menu_item.items():
    print(key, value)`
      },
      { type: 'tip', text: 'Use dictionaries when each piece of data has a meaningful label, such as name, price, email, or score.' },
      { type: 'try', text: 'Create a dictionary for a book with title, author, pages, and is_finished. Update is_finished and print each key-value pair.' },
      { type: 'keypoints', items: ['Dictionaries store key-value pairs.', 'Use keys to read values.', 'Assigning to a key adds or updates data.', 'get() is helpful when a key might be missing.'] }
    ]
  },
  {
    slug: 'python-if-else',
    title: 'if, elif & else',
    description: 'Make decisions in Python with if statements, elif branches, and else fallbacks.',
    level: 'beginner',
    section: 'Control Flow',
    order: 18,
    minutes: 11,
    content: [
      { type: 'p', text: 'Programs become useful when they can make decisions. In Python, if statements run different code depending on whether a condition is True or False.' },
      { type: 'h2', text: 'A basic if statement' },
      {
        type: 'code',
        title: 'Check a passing score',
        language: 'python',
        code: `score = 84

if score >= 70:
    print("You passed!")`
      },
      { type: 'p', text: 'The indented line only runs when the condition is True. If the score is below 70, Python skips that block.' },
      { type: 'h2', text: 'Add else' },
      { type: 'p', text: 'An else block gives Python something to do when the if condition is False.' },
      {
        type: 'code',
        title: 'Pass or try again',
        language: 'python',
        code: `score = 62

if score >= 70:
    print("You passed!")
else:
    print("Keep practicing.")`
      },
      { type: 'h2', text: 'Use elif for more choices' },
      { type: 'p', text: 'elif means else if. It lets you check another condition when the previous one was False.' },
      {
        type: 'code',
        title: 'Letter grade',
        language: 'python',
        code: `score = 88

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "Needs practice"

print(grade)`
      },
      { type: 'h2', text: 'Order matters' },
      { type: 'p', text: 'Python checks branches from top to bottom and runs the first matching block. Put more specific or higher-priority conditions first.' },
      { type: 'tip', text: 'If your if statement is hard to read, give part of the condition a clear boolean variable name first.' },
      { type: 'try', text: 'Write a program that checks temperature. Print "cold" below 50, "warm" from 50 to 79, and "hot" at 80 or above.' },
      { type: 'keypoints', items: ['if runs code only when a condition is True.', 'else handles the fallback case.', 'elif checks additional conditions.', 'Branch order matters because Python uses the first match.'] }
    ]
  },
  {
    slug: 'python-loops',
    title: 'for & while Loops',
    description: 'Repeat work with for loops and while loops without copying the same code many times.',
    level: 'beginner',
    section: 'Control Flow',
    order: 19,
    minutes: 12,
    content: [
      { type: 'p', text: 'Loops repeat code. They are helpful when you need to process every item in a list, count through numbers, or keep asking until something changes.' },
      { type: 'h2', text: 'for loops' },
      { type: 'p', text: 'Use a for loop when you want to run code once for each item in a collection.' },
      {
        type: 'code',
        title: 'Print each student',
        language: 'python',
        code: `students = ["Ava", "Ben", "Chloe"]

for student in students:
    print(student)`
      },
      { type: 'h2', text: 'Loop with range' },
      { type: 'p', text: 'range creates a sequence of numbers. It is useful when you need to repeat something a specific number of times.' },
      {
        type: 'code',
        title: 'Count attempts',
        language: 'python',
        code: `for attempt in range(1, 4):
    print("Attempt", attempt)`
      },
      { type: 'h2', text: 'while loops' },
      { type: 'p', text: 'Use a while loop when the loop should continue as long as a condition is True. The condition must eventually become False, or the loop never ends.' },
      {
        type: 'code',
        title: 'Count down',
        language: 'python',
        code: `count = 3

while count > 0:
    print(count)
    count -= 1

print("Go!")`
      },
      { type: 'h2', text: 'Build a total with a loop' },
      {
        type: 'code',
        title: 'Sum prices',
        language: 'python',
        code: `prices = [9.99, 14.50, 3.25]
total = 0

for price in prices:
    total += price

print(round(total, 2))`
      },
      { type: 'warning', text: 'A while loop can run forever if its condition never changes. Make sure something inside the loop moves the program toward stopping.' },
      { type: 'try', text: 'Create a list of weekly step counts. Use a for loop to calculate and print the total steps.' },
      { type: 'keypoints', items: ['Loops repeat code.', 'for loops are ideal for collections and known ranges.', 'while loops continue while a condition is True.', 'Update while-loop values so the loop can stop.'] }
    ]
  },
  {
    slug: 'python-loop-control',
    title: 'break, continue & else on Loops',
    description: 'Control loop behavior with break, continue, and loop else blocks.',
    level: 'beginner',
    section: 'Control Flow',
    order: 20,
    minutes: 11,
    content: [
      { type: 'p', text: 'Sometimes a loop needs more control than simply running every time. Python gives you break, continue, and loop else blocks for common situations.' },
      { type: 'h2', text: 'Stop early with break' },
      { type: 'p', text: 'break exits the loop immediately. It is useful when you found what you were looking for and do not need to keep looping.' },
      {
        type: 'code',
        title: 'Find a matching name',
        language: 'python',
        code: `names = ["Ava", "Ben", "Chloe", "Diego"]

for name in names:
    if name == "Chloe":
        print("Found Chloe")
        break`
      },
      { type: 'h2', text: 'Skip one round with continue' },
      { type: 'p', text: 'continue skips the rest of the current loop round and moves to the next item.' },
      {
        type: 'code',
        title: 'Skip missing scores',
        language: 'python',
        code: `scores = [91, None, 78, 85]

for score in scores:
    if score is None:
        continue
    print(score)`
      },
      { type: 'h2', text: 'Loop else' },
      { type: 'p', text: 'A loop else block runs when the loop finishes normally. If break stops the loop, the else block does not run.' },
      {
        type: 'code',
        title: 'Search with loop else',
        language: 'python',
        code: `products = ["pen", "notebook", "eraser"]

for product in products:
    if product == "marker":
        print("Marker found")
        break
else:
    print("Marker is not in stock")`
      },
      {
        type: 'code',
        title: 'while with break',
        language: 'python',
        code: `attempts = 0

while attempts < 3:
    attempts += 1
    if attempts == 2:
        print("Correct PIN")
        break`
      },
      { type: 'tip', text: 'Use break and continue when they make a loop easier to read. If they make the flow confusing, rewrite the condition or split the work into smaller pieces.' },
      { type: 'try', text: 'Loop through a list of numbers. Skip negative numbers with continue, stop when you find 0 with break, and print the positive numbers.' },
      { type: 'keypoints', items: ['break exits a loop immediately.', 'continue skips to the next loop round.', 'Loop else runs only when no break happened.', 'Loop control is useful for searching and filtering.'] }
    ]
  },
  {
    slug: 'python-functions',
    title: 'Functions',
    description: 'Group reusable steps into functions so your programs are easier to read and maintain.',
    level: 'beginner',
    section: 'Functions',
    order: 21,
    minutes: 12,
    content: [
      { type: 'p', text: 'A function is a named block of code that performs a task. Functions help you avoid repeating code and make programs easier to understand.' },
      { type: 'h2', text: 'Define and call a function' },
      { type: 'p', text: 'Use def to define a function. The code inside the function is indented. The function runs only when you call it by name.' },
      {
        type: 'code',
        title: 'A simple greeting',
        language: 'python',
        code: `def greet():
    print("Hello!")
    print("Welcome back.")

greet()`
      },
      { type: 'h2', text: 'Why functions matter' },
      { type: 'p', text: 'Without functions, you may copy the same code many times. Copying makes mistakes harder to fix because every copy must be updated.' },
      {
        type: 'code',
        title: 'Reuse one task',
        language: 'python',
        code: `def print_receipt_header():
    print("Sunny Cafe")
    print("123 Market Street")
    print("----------------")

print_receipt_header()
print("Coffee - 4.50")

print_receipt_header()
print("Tea - 3.25")`
      },
      { type: 'h2', text: 'Function names should be verbs' },
      { type: 'p', text: 'Because functions do something, names often start with action words like calculate, print, get, send, or check.' },
      {
        type: 'table',
        headers: ['Less clear', 'Clearer'],
        rows: [
          ['data()', 'get_user_data()'],
          ['total()', 'calculate_total()'],
          ['msg()', 'print_welcome_message()']
        ]
      },
      { type: 'note', text: 'Defining a function does not run it. Calling the function runs the indented code inside it.' },
      { type: 'try', text: 'Write a function named print_daily_reminder that prints three reminders for your day. Call it twice.' },
      { type: 'keypoints', items: ['Functions are named blocks of reusable code.', 'Use def to define a function.', 'Indented lines belong to the function body.', 'A function runs when you call it.'] }
    ]
  },
  {
    slug: 'python-parameters',
    title: 'Parameters, Defaults & Return Values',
    description: 'Pass information into functions, set defaults, and return useful results.',
    level: 'beginner',
    section: 'Functions',
    order: 22,
    minutes: 13,
    content: [
      { type: 'p', text: 'Parameters let a function receive information. Return values let a function send information back to the code that called it.' },
      { type: 'h2', text: 'Use parameters' },
      { type: 'p', text: 'A parameter is a variable listed inside the function definition. An argument is the actual value you pass when calling the function.' },
      {
        type: 'code',
        title: 'Personal greeting',
        language: 'python',
        code: `def greet(name):
    print(f"Hello, {name}!")

greet("Maya")
greet("Jordan")`
      },
      { type: 'h2', text: 'Multiple parameters' },
      {
        type: 'code',
        title: 'Calculate line total',
        language: 'python',
        code: `def calculate_line_total(price, quantity):
    total = price * quantity
    return total

notebook_total = calculate_line_total(4.99, 3)
print(notebook_total)`
      },
      { type: 'h2', text: 'Default values' },
      { type: 'p', text: 'A default value is used when an argument is not provided. Defaults make functions easier to call for common cases.' },
      {
        type: 'code',
        title: 'Default discount',
        language: 'python',
        code: `def apply_discount(price, discount_rate=0.10):
    return price - (price * discount_rate)

print(apply_discount(50))
print(apply_discount(50, 0.20))`
      },
      { type: 'h2', text: 'Print vs return' },
      { type: 'p', text: 'print shows a value to the user. return gives a value back to the program so it can be saved, combined, or used later.' },
      {
        type: 'code',
        title: 'Return and reuse',
        language: 'python',
        code: `def add_tax(subtotal):
    return subtotal * 1.08

total = add_tax(25)
message = f"Your total is {round(total, 2)}"
print(message)`
      },
      { type: 'tip', text: 'Prefer returning values from calculation functions. That keeps the calculation separate from how you display the result.' },
      { type: 'try', text: 'Write a function named calculate_tip that accepts a bill amount and a tip rate with a default of 0.18. Return the tip amount and print it.' },
      { type: 'keypoints', items: ['Parameters receive values inside a function.', 'Arguments are values passed during a function call.', 'Default parameters provide fallback values.', 'return sends a result back to the caller.'] }
    ]
  },
  {
    slug: 'python-scope',
    title: 'Scope & LEGB',
    description: 'Understand where Python looks for variable names and why scope keeps programs organized.',
    level: 'beginner',
    section: 'Functions',
    order: 23,
    minutes: 13,
    content: [
      { type: 'p', text: 'Scope describes where a variable can be used. Understanding scope helps you avoid confusing bugs when the same name appears in different places.' },
      { type: 'h2', text: 'Local scope' },
      { type: 'p', text: 'A variable created inside a function is local to that function. Code outside the function cannot use it directly.' },
      {
        type: 'code',
        title: 'Local variable',
        language: 'python',
        code: `def calculate_total():
    subtotal = 25
    tax = 2
    return subtotal + tax

print(calculate_total())`
      },
      { type: 'h2', text: 'Global scope' },
      { type: 'p', text: 'A variable created outside functions is global to the module. Functions can read global values, but changing them inside functions should be done carefully.' },
      {
        type: 'code',
        title: 'Read a global value',
        language: 'python',
        code: `tax_rate = 0.08

def add_tax(price):
    return price + (price * tax_rate)

print(add_tax(20))`
      },
      { type: 'h2', text: 'The LEGB rule' },
      { type: 'p', text: 'When Python sees a name, it searches in this order: Local, Enclosing, Global, Built-in. Beginners mostly work with local and global scope.' },
      {
        type: 'table',
        headers: ['Letter', 'Meaning', 'Example'],
        rows: [
          ['L', 'Local', 'Inside the current function'],
          ['E', 'Enclosing', 'Inside an outer function'],
          ['G', 'Global', 'At the top level of the file'],
          ['B', 'Built-in', 'Names Python already provides, like print']
        ]
      },
      { type: 'h2', text: 'Avoid name surprises' },
      {
        type: 'code',
        title: 'Separate local names',
        language: 'python',
        code: `name = "Global Name"

def show_name():
    name = "Local Name"
    print(name)

show_name()
print(name)`
      },
      { type: 'tip', text: 'Pass values into functions with parameters and return results instead of relying heavily on global variables.' },
      { type: 'try', text: 'Create a global app_name variable. Write a function that has its own local app_name and prints it. Then print the global value after calling the function.' },
      { type: 'keypoints', items: ['Scope controls where names are available.', 'Variables created inside functions are local.', 'Variables created at the top level are global.', 'LEGB describes Python name lookup order.'] }
    ]
  },
  {
    slug: 'python-modules-intro',
    title: 'Modules & import',
    description: 'Use modules to organize code and import helpful tools from Python files and the standard library.',
    level: 'beginner',
    section: 'Functions',
    order: 24,
    minutes: 12,
    content: [
      { type: 'p', text: 'A module is a Python file that contains code you can reuse. Imports let one file use functions, variables, or classes from another file.' },
      { type: 'h2', text: 'Import from the standard library' },
      { type: 'p', text: 'Python comes with many built-in modules called the standard library. These modules help with math, dates, randomness, files, and more.' },
      {
        type: 'code',
        title: 'Use the random module',
        language: 'python',
        code: `import random

number = random.randint(1, 6)
print(f"You rolled a {number}")`
      },
      { type: 'h2', text: 'Import specific names' },
      { type: 'p', text: 'You can import the whole module or import one specific tool from it. Importing the whole module can make it clearer where a function came from.' },
      {
        type: 'code',
        title: 'Import one function',
        language: 'python',
        code: `from math import sqrt

print(sqrt(81))`
      },
      { type: 'h2', text: 'Create your own module' },
      { type: 'p', text: 'If you save helper functions in one file, another file can import and use them. This keeps large programs organized.' },
      {
        type: 'code',
        title: 'helpers.py',
        language: 'python',
        code: `def format_price(price):
    return f"\${price:.2f}"`
      },
      {
        type: 'code',
        title: 'app.py',
        language: 'python',
        code: `from helpers import format_price

print(format_price(12.5))`
      },
      { type: 'h2', text: 'Module file names' },
      { type: 'p', text: 'Module names should be short, lowercase, and descriptive. Avoid names that match standard library modules, such as random.py or math.py.' },
      { type: 'warning', text: 'If your file is named random.py, import random may import your file instead of Python\'s standard random module.' },
      { type: 'try', text: 'Create a file named messages.py with a function that returns a welcome message. Import it from app.py and print the message.' },
      { type: 'keypoints', items: ['A module is a reusable Python file.', 'import brings module code into another file.', 'Python includes many standard library modules.', 'Your own modules help organize larger programs.'] }
    ]
  },
  {
    slug: 'python-input-output',
    title: 'input(), print() & f-strings',
    description: 'Interact with users by reading input, printing output, and formatting messages with f-strings.',
    level: 'beginner',
    section: 'Everyday Python',
    order: 25,
    minutes: 12,
    content: [
      { type: 'p', text: 'Many beginner programs ask the user for information and then show a result. Python uses input for reading text and print for displaying output.' },
      { type: 'h2', text: 'Read user input' },
      { type: 'p', text: 'input shows a prompt and waits for the user to type. The value returned by input is always a string, even if the user typed digits.' },
      {
        type: 'code',
        title: 'Ask for a name',
        language: 'python',
        code: `name = input("What is your name? ")

print("Hello,", name)`
      },
      { type: 'h2', text: 'Convert input for math' },
      { type: 'p', text: 'Because input returns text, convert numeric input before doing calculations.' },
      {
        type: 'code',
        title: 'Age next year',
        language: 'python',
        code: `age_text = input("How old are you? ")
age = int(age_text)

print("Next year you will be", age + 1)`
      },
      { type: 'h2', text: 'Format output with f-strings' },
      { type: 'p', text: 'An f-string starts with f before the quote. Put variable names or expressions inside braces to insert them into the text.' },
      {
        type: 'code',
        title: 'Order summary',
        language: 'python',
        code: `item = "sandwich"
price = 7.5
quantity = 2
total = price * quantity

print(f"{quantity} {item}s cost \${total:.2f}")`
      },
      { type: 'h2', text: 'A small interactive script' },
      {
        type: 'code',
        title: 'tip_calculator.py',
        language: 'python',
        code: `bill_text = input("Bill amount: ")
tip_text = input("Tip percent: ")

bill = float(bill_text)
tip_percent = float(tip_text)
tip = bill * (tip_percent / 100)
total = bill + tip

print(f"Tip: \${tip:.2f}")
print(f"Total: \${total:.2f}")`
      },
      { type: 'tip', text: 'Use f-strings for readable output when mixing text with variables, calculations, or rounded numbers.' },
      { type: 'warning', text: 'If the user types non-numeric text where your program expects a number, int() or float() will raise an error. You will learn error handling later.' },
      { type: 'try', text: 'Build a simple minutes-to-hours converter. Ask for minutes, convert to a number, calculate hours, and print a friendly f-string result.' },
      { type: 'keypoints', items: ['input() reads text from the user.', 'print() displays output.', 'Convert input before numeric calculations.', 'f-strings make formatted messages clear and concise.'] }
    ]
  },
];
