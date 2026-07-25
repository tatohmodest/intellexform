import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-data-analysis',
    title: 'What is Data Analysis?',
    description: 'Understand what data analysis means, what analysts do, and how Python helps turn raw data into useful answers.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 10,
    content: [
      { type: 'p', text: 'Data analysis is the process of asking questions, collecting data, cleaning it, exploring patterns, and explaining what you found. It helps people make decisions with evidence instead of guesses.' },
      { type: 'p', text: 'In this beginner track, you will use Python with pandas and NumPy. These tools are popular because they make spreadsheet-style work, calculations, and summaries easier to repeat.' },
      { type: 'h2', text: 'What analysts usually do' },
      { type: 'p', text: 'An analyst often starts with a question such as "Which products sold best?" or "Which students need extra support?" Then they use data to investigate the question.' },
      {
        type: 'table',
        headers: ['Step', 'Example'],
        rows: [
          ['Ask', 'Which store had the highest revenue this month?'],
          ['Collect', 'Download sales rows from a checkout system'],
          ['Clean', 'Fix missing prices and inconsistent product names'],
          ['Explore', 'Group sales by store and product'],
          ['Explain', 'Share the top stores and possible reasons']
        ]
      },
      { type: 'h2', text: 'A first tiny analysis' },
      { type: 'p', text: 'The code below creates a small sales table, calculates revenue, and summarizes revenue by product. Do not worry if every line is new. You will learn these pieces step by step.' },
      {
        type: 'code',
        title: 'Small sales analysis',
        language: 'python',
        code: `import pandas as pd

sales = pd.DataFrame({
    "product": ["Notebook", "Pen", "Notebook", "Backpack"],
    "units": [3, 10, 2, 1],
    "price": [4.50, 1.25, 4.50, 32.00]
})

sales["revenue"] = sales["units"] * sales["price"]
summary = sales.groupby("product")["revenue"].sum()

print(summary)`
      },
      { type: 'h2', text: 'Data analysis is not only code' },
      { type: 'p', text: 'Good analysis also needs clear thinking. You need to understand the data source, check for mistakes, choose fair comparisons, and explain limitations honestly.' },
      { type: 'note', text: 'A chart or table is not automatically an insight. An insight connects the data back to the question someone cares about.' },
      { type: 'try', text: 'Think of a decision you made recently. What data could have helped you make that decision more confidently?' },
      { type: 'keypoints', items: ['Data analysis turns raw data into useful answers.', 'Python, pandas, and NumPy help make analysis repeatable.', 'Most projects involve asking, cleaning, exploring, and explaining.', 'Good analysis combines code with careful thinking.'] }
    ]
  },
  {
    slug: 'da-analysis-workflow',
    title: 'The Analysis Workflow',
    description: 'Learn a practical step-by-step workflow for starting, organizing, and finishing a data analysis project.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 11,
    content: [
      { type: 'p', text: 'A workflow is a repeatable way to move through a project. Beginners often jump straight into code, but analysis becomes easier when you follow a simple path.' },
      { type: 'h2', text: 'The beginner workflow' },
      {
        type: 'ol',
        items: [
          'Write the question in plain language.',
          'Load the data into Python.',
          'Inspect the rows, columns, and data types.',
          'Clean obvious problems.',
          'Calculate summaries and compare groups.',
          'Write down findings and next questions.'
        ]
      },
      { type: 'h2', text: 'Start with a question' },
      { type: 'p', text: 'A clear question prevents random clicking and endless charts. It also tells you which columns matter most.' },
      {
        type: 'code',
        title: 'Analysis notes',
        language: 'text',
        code: `Question:
Which course has the highest average student score?

Data needed:
- student name
- course name
- score

Possible output:
A table showing average score by course.`
      },
      { type: 'h2', text: 'Turn the workflow into code' },
      { type: 'p', text: 'The following example uses a small student dataset. Notice how the code follows the same path: create data, inspect it, clean it, then summarize it.' },
      {
        type: 'code',
        title: 'Workflow in pandas',
        language: 'python',
        code: `import pandas as pd

students = pd.DataFrame({
    "name": ["Ava", "Leo", "Mia", "Noah"],
    "course": ["Math", "Math", "Science", "Science"],
    "score": [88, 92, 79, 85]
})

print(students.head())
print(students.info())

average_scores = students.groupby("course")["score"].mean()
print(average_scores)`
      },
      { type: 'tip', text: 'Keep a short text cell or comment near the top of each notebook that states the question and data source.' },
      { type: 'try', text: 'Write one business, school, or personal question that could be answered with a small table of data. List three columns you would need.' },
      { type: 'keypoints', items: ['A workflow keeps analysis organized.', 'Start with a clear question before writing much code.', 'Inspection and cleaning come before final conclusions.', 'A good project ends with findings and follow-up questions.'] }
    ]
  },
  {
    slug: 'da-setup',
    title: 'Install Python, pip & Analysis Libraries',
    description: 'Install Python and the core libraries used for beginner data analysis: pandas, NumPy, Jupyter, and openpyxl.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 12,
    content: [
      { type: 'p', text: 'To analyze data with Python, you need Python itself, pip for installing packages, and a few analysis libraries. The most important beginner libraries are pandas and NumPy.' },
      { type: 'h2', text: 'Check Python and pip' },
      { type: 'p', text: 'Open a terminal and check that Python and pip are available. On some systems the command is python, and on others it is python3.' },
      {
        type: 'code',
        title: 'Check versions',
        language: 'bash',
        code: `python3 --version
python3 -m pip --version`
      },
      { type: 'h2', text: 'Create a project folder' },
      { type: 'p', text: 'A project folder keeps your notebooks, scripts, and data files together. This makes it easier to find files and share your work later.' },
      {
        type: 'code',
        title: 'Create an analysis folder',
        language: 'bash',
        code: `mkdir data-analysis-practice
cd data-analysis-practice`
      },
      { type: 'h2', text: 'Install analysis libraries' },
      { type: 'p', text: 'Install pandas for tables, NumPy for fast numeric arrays, Jupyter for notebooks, and openpyxl for Excel files.' },
      {
        type: 'code',
        title: 'Install packages',
        language: 'bash',
        code: `python3 -m pip install pandas numpy jupyter openpyxl`
      },
      {
        type: 'code',
        title: 'Test the install',
        language: 'python',
        code: `import pandas as pd
import numpy as np

print(pd.__version__)
print(np.__version__)`
      },
      { type: 'note', text: 'A package is reusable code someone else has published. pip downloads packages and installs them into your Python environment.' },
      { type: 'tip', text: 'If a command fails, copy the exact error message. Error messages are clues, and searching the exact text often leads to the solution.' },
      { type: 'try', text: 'Install pandas and NumPy, then run the test code in a Python file or notebook cell.' },
      { type: 'keypoints', items: ['Python runs your analysis code.', 'pip installs libraries.', 'pandas handles table-shaped data.', 'NumPy supports efficient numeric calculations.', 'Jupyter is useful for step-by-step exploration.'] }
    ]
  },
  {
    slug: 'da-jupyter',
    title: 'Jupyter Notebooks & VS Code',
    description: 'Learn how notebooks help analysts experiment, document steps, and run code in small pieces.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 10,
    content: [
      { type: 'p', text: 'A Jupyter notebook lets you mix code, output, notes, and charts in one document. Analysts like notebooks because they support exploration: run a small step, inspect the result, then decide what to do next.' },
      { type: 'h2', text: 'Start Jupyter' },
      { type: 'p', text: 'From your project folder, start Jupyter Notebook. Your browser will open a local page where you can create a new notebook.' },
      {
        type: 'code',
        title: 'Launch Jupyter Notebook',
        language: 'bash',
        code: `jupyter notebook`
      },
      { type: 'h2', text: 'Use cells' },
      { type: 'p', text: 'A notebook is made of cells. Code cells run Python. Markdown cells hold explanations, headings, and notes.' },
      {
        type: 'code',
        title: 'A notebook code cell',
        language: 'python',
        code: `import pandas as pd

customers = pd.DataFrame({
    "customer": ["Ava", "Ben", "Chloe"],
    "orders": [3, 1, 5]
})

customers`
      },
      {
        type: 'code',
        title: 'A notebook markdown cell',
        language: 'text',
        code: `# Customer order analysis

Goal: Find which customers placed the most orders.`
      },
      { type: 'h2', text: 'VS Code notebooks' },
      { type: 'p', text: 'Visual Studio Code can also open .ipynb notebook files. This is helpful if you want notebooks and regular Python files in one editor.' },
      { type: 'ul', items: ['Use notebooks for exploration and explanation.', 'Use .py files for reusable scripts and functions.', 'Keep notebook cells short so outputs are easy to understand.'] },
      { type: 'warning', text: 'Notebooks can be run out of order. If something looks strange, restart the kernel and run all cells from the top.' },
      { type: 'try', text: 'Create a new notebook with one markdown cell explaining your question and one code cell that imports pandas.' },
      { type: 'keypoints', items: ['Notebooks combine code, output, and notes.', 'Code cells run Python one step at a time.', 'Markdown cells document your thinking.', 'Restart and run all cells to check that a notebook works from top to bottom.'] }
    ]
  },
  {
    slug: 'da-python-refresh',
    title: 'Python Refresh for Analysts',
    description: 'Review the Python essentials you need for data analysis: variables, lists, dictionaries, loops, and functions.',
    level: 'beginner',
    section: 'Foundations',
    order: 5,
    minutes: 15,
    content: [
      { type: 'p', text: 'You do not need to finish a full Python course before learning data analysis. You do need a few essentials: variables, data types, lists, dictionaries, conditions, loops, and functions.' },
      { type: 'h2', text: 'Variables and basic types' },
      { type: 'p', text: 'A variable stores a value with a name. In analysis, variable names often describe columns, totals, filters, or intermediate results.' },
      {
        type: 'code',
        title: 'Variables for a sale',
        language: 'python',
        code: `product = "Notebook"
units = 3
price = 4.50
revenue = units * price

print(product)
print(revenue)`
      },
      { type: 'h2', text: 'Lists and dictionaries' },
      { type: 'p', text: 'Lists store ordered values. Dictionaries store labeled values. pandas can build DataFrames from dictionaries of lists.' },
      {
        type: 'code',
        title: 'Data containers',
        language: 'python',
        code: `products = ["Notebook", "Pen", "Backpack"]
prices = [4.50, 1.25, 32.00]

sale = {
    "product": "Notebook",
    "units": 3,
    "price": 4.50
}

print(products[0])
print(sale["product"])`
      },
      { type: 'h2', text: 'Loops and conditions' },
      { type: 'p', text: 'Loops repeat work. Conditions let code choose what to do. pandas often reduces the need for loops, but understanding them helps you read Python examples.' },
      {
        type: 'code',
        title: 'Loop through scores',
        language: 'python',
        code: `scores = [88, 64, 91, 73]

for score in scores:
    if score >= 70:
        print("pass")
    else:
        print("review")`
      },
      { type: 'h2', text: 'Functions' },
      { type: 'p', text: 'A function is reusable code. Python already has functions like print and len. You can also define your own when a calculation repeats.' },
      {
        type: 'code',
        title: 'A small function',
        language: 'python',
        code: `def revenue(units, price):
    return units * price

print(revenue(5, 2.99))
print(revenue(2, 12.50))`
      },
      { type: 'tip', text: 'Use clear names like average_score and total_revenue. In analysis code, readable names are more valuable than short names.' },
      { type: 'try', text: 'Create a list of five prices. Use a loop to print "expensive" for prices over 20 and "regular" for the others.' },
      { type: 'keypoints', items: ['Variables name values.', 'Lists hold ordered values.', 'Dictionaries hold labeled values.', 'Loops repeat work and conditions make choices.', 'Functions make repeated logic reusable.'] }
    ]
  },
  {
    slug: 'da-numpy-intro',
    title: 'NumPy Intro',
    description: 'Meet NumPy, the numeric library behind much of the Python data analysis ecosystem.',
    level: 'beginner',
    section: 'Foundations',
    order: 6,
    minutes: 10,
    content: [
      { type: 'p', text: 'NumPy is a Python library for fast numeric computing. pandas uses NumPy internally, and many data science libraries build on it.' },
      { type: 'h2', text: 'Why NumPy matters' },
      { type: 'p', text: 'Regular Python lists are flexible, but NumPy arrays are designed for numeric calculations. They can apply math to many values at once.' },
      {
        type: 'code',
        title: 'Import NumPy',
        language: 'python',
        code: `import numpy as np

prices = np.array([4.50, 1.25, 32.00])
print(prices)`
      },
      { type: 'h2', text: 'Vectorized calculations' },
      { type: 'p', text: 'Vectorized means an operation runs across many values without writing a manual loop. This is common in analysis code.' },
      {
        type: 'code',
        title: 'Apply a discount',
        language: 'python',
        code: `import numpy as np

prices = np.array([4.50, 1.25, 32.00])
discounted = prices * 0.90

print(discounted)`
      },
      { type: 'h2', text: 'Common numeric helpers' },
      {
        type: 'code',
        title: 'Summary statistics',
        language: 'python',
        code: `import numpy as np

scores = np.array([88, 92, 79, 85, 90])

print(scores.mean())
print(scores.min())
print(scores.max())`
      },
      { type: 'note', text: 'You will often use pandas directly, but NumPy helps you understand arrays, missing numeric values, and fast calculations.' },
      { type: 'try', text: 'Create a NumPy array of five order totals. Print the average, the largest value, and each total after adding 8 percent tax.' },
      { type: 'keypoints', items: ['NumPy is used for numeric computing.', 'The common import is import numpy as np.', 'Arrays can apply math to many values at once.', 'NumPy provides useful statistics like mean, min, and max.'] }
    ]
  },
  {
    slug: 'da-numpy-arrays',
    title: 'NumPy Arrays & Operations',
    description: 'Create arrays, inspect their shape, select values, and run useful numeric operations.',
    level: 'beginner',
    section: 'Foundations',
    order: 7,
    minutes: 13,
    content: [
      { type: 'p', text: 'A NumPy array is a grid of values. Arrays can be one-dimensional like a single column or two-dimensional like a table of numbers.' },
      { type: 'h2', text: 'Create arrays' },
      {
        type: 'code',
        title: 'One-dimensional and two-dimensional arrays',
        language: 'python',
        code: `import numpy as np

units = np.array([3, 10, 2, 1])

weekly_sales = np.array([
    [3, 10, 2],
    [5, 8, 4],
    [2, 6, 7]
])

print(units)
print(weekly_sales)`
      },
      { type: 'h2', text: 'Shape and size' },
      { type: 'p', text: 'The shape tells you the dimensions of an array. For a 2D array, shape is rows by columns.' },
      {
        type: 'code',
        title: 'Inspect an array',
        language: 'python',
        code: `import numpy as np

weekly_sales = np.array([
    [3, 10, 2],
    [5, 8, 4],
    [2, 6, 7]
])

print(weekly_sales.shape)
print(weekly_sales.size)`
      },
      { type: 'h2', text: 'Select and calculate' },
      { type: 'p', text: 'Array indexing starts at 0. You can select a single value, a row, a column, or calculate across an axis.' },
      {
        type: 'code',
        title: 'Select values and sum columns',
        language: 'python',
        code: `import numpy as np

weekly_sales = np.array([
    [3, 10, 2],
    [5, 8, 4],
    [2, 6, 7]
])

print(weekly_sales[0, 1])
print(weekly_sales[0])
print(weekly_sales[:, 0])
print(weekly_sales.sum(axis=0))`
      },
      { type: 'tip', text: 'In a 2D NumPy array, axis=0 usually means down the rows for each column, and axis=1 usually means across columns for each row.' },
      { type: 'try', text: 'Create a 2D array with three students and two test scores each. Print each student average using mean(axis=1).' },
      { type: 'keypoints', items: ['NumPy arrays can be one-dimensional or two-dimensional.', 'shape describes the dimensions.', 'Indexing starts at 0.', 'Axis controls the direction of calculations.'] }
    ]
  },
  {
    slug: 'da-pandas-intro',
    title: 'pandas Intro',
    description: 'Meet pandas, the main Python library for loading, cleaning, exploring, and summarizing table data.',
    level: 'beginner',
    section: 'pandas Core',
    order: 8,
    minutes: 10,
    content: [
      { type: 'p', text: 'pandas is the most common Python library for working with table-shaped data. If you have used spreadsheets, many pandas ideas will feel familiar: rows, columns, filters, and summaries.' },
      { type: 'h2', text: 'Import pandas' },
      { type: 'p', text: 'The standard pandas import is pd. You will see this abbreviation in almost every pandas example.' },
      {
        type: 'code',
        title: 'Import convention',
        language: 'python',
        code: `import pandas as pd`
      },
      { type: 'h2', text: 'Create a DataFrame' },
      { type: 'p', text: 'A DataFrame is a table with rows and columns. One easy way to create a small DataFrame is with a dictionary of lists.' },
      {
        type: 'code',
        title: 'Customer orders',
        language: 'python',
        code: `import pandas as pd

orders = pd.DataFrame({
    "customer": ["Ava", "Ben", "Chloe"],
    "city": ["Austin", "Denver", "Austin"],
    "orders": [3, 1, 5]
})

print(orders)`
      },
      { type: 'h2', text: 'Why analysts use pandas' },
      {
        type: 'ul',
        items: [
          'Read CSV, Excel, JSON, and database data.',
          'Select columns and filter rows.',
          'Clean missing, duplicate, and inconsistent values.',
          'Group data and calculate summaries.',
          'Prepare data for charts, reports, and machine learning.'
        ]
      },
      {
        type: 'code',
        title: 'Quick pandas summary',
        language: 'python',
        code: `import pandas as pd

orders = pd.DataFrame({
    "customer": ["Ava", "Ben", "Chloe"],
    "city": ["Austin", "Denver", "Austin"],
    "orders": [3, 1, 5]
})

print(orders.groupby("city")["orders"].sum())`
      },
      { type: 'note', text: 'pandas is powerful, but beginners should focus on a small set of common operations first: load, inspect, select, filter, clean, group, and combine.' },
      { type: 'try', text: 'Create a DataFrame with three products, their categories, and their prices. Print the whole DataFrame.' },
      { type: 'keypoints', items: ['pandas is used for table-shaped data.', 'The common import is import pandas as pd.', 'A DataFrame is like a spreadsheet table.', 'pandas supports loading, cleaning, filtering, grouping, and combining data.'] }
    ]
  },
  {
    slug: 'da-series-dataframe',
    title: 'Series & DataFrame',
    description: 'Understand the two main pandas objects: Series for one column and DataFrame for a full table.',
    level: 'beginner',
    section: 'pandas Core',
    order: 9,
    minutes: 12,
    content: [
      { type: 'p', text: 'pandas has two core objects: Series and DataFrame. A Series is like one column. A DataFrame is like a complete table made of columns.' },
      { type: 'h2', text: 'Series' },
      { type: 'p', text: 'A Series stores a sequence of values with an index. The index is a label for each value.' },
      {
        type: 'code',
        title: 'Create a Series',
        language: 'python',
        code: `import pandas as pd

scores = pd.Series([88, 92, 79], index=["Ava", "Leo", "Mia"])

print(scores)
print(scores["Leo"])`
      },
      { type: 'h2', text: 'DataFrame' },
      { type: 'p', text: 'A DataFrame has rows and columns. Each column is a Series, and columns can have different data types.' },
      {
        type: 'code',
        title: 'Create a DataFrame',
        language: 'python',
        code: `import pandas as pd

students = pd.DataFrame({
    "name": ["Ava", "Leo", "Mia"],
    "course": ["Math", "Math", "Science"],
    "score": [88, 92, 79]
})

print(students)
print(students["score"])`
      },
      { type: 'h2', text: 'Index and columns' },
      {
        type: 'code',
        title: 'Inspect labels',
        language: 'python',
        code: `import pandas as pd

students = pd.DataFrame({
    "name": ["Ava", "Leo", "Mia"],
    "course": ["Math", "Math", "Science"],
    "score": [88, 92, 79]
})

print(students.index)
print(students.columns)`
      },
      { type: 'tip', text: 'When you select one column with square brackets, pandas returns a Series. When you select a list of columns, pandas returns a DataFrame.' },
      { type: 'try', text: 'Create a DataFrame with columns product, category, and price. Select the price column and print its type with type().' },
      { type: 'keypoints', items: ['A Series is one labeled sequence of values.', 'A DataFrame is a table of rows and columns.', 'Each DataFrame column is a Series.', 'Indexes label rows, and columns label variables.'] }
    ]
  },
  {
    slug: 'da-read-csv',
    title: 'Reading CSV Files',
    description: 'Load CSV data into pandas and understand common options such as separators, headers, and selected columns.',
    level: 'beginner',
    section: 'Loading Data',
    order: 10,
    minutes: 12,
    content: [
      { type: 'p', text: 'CSV stands for comma-separated values. It is a plain text format where each line is a row and commas separate columns. CSV files are one of the most common data sources for beginners.' },
      { type: 'h2', text: 'What a CSV looks like' },
      {
        type: 'code',
        title: 'sales.csv',
        language: 'csv',
        code: `date,store,product,units,price
2026-01-05,Downtown,Notebook,3,4.50
2026-01-05,Downtown,Pen,10,1.25
2026-01-06,Uptown,Backpack,1,32.00`
      },
      { type: 'h2', text: 'Read a CSV with pandas' },
      { type: 'p', text: 'Use read_csv to load a CSV file into a DataFrame. The file path is a string pointing to the file location.' },
      {
        type: 'code',
        title: 'Load sales.csv',
        language: 'python',
        code: `import pandas as pd

sales = pd.read_csv("sales.csv")

print(sales.head())
print(sales.shape)`
      },
      { type: 'h2', text: 'Common read_csv options' },
      {
        type: 'code',
        title: 'Useful CSV options',
        language: 'python',
        code: `import pandas as pd

sales = pd.read_csv(
    "sales.csv",
    usecols=["date", "store", "product", "units", "price"],
    parse_dates=["date"]
)

print(sales.dtypes)`
      },
      {
        type: 'table',
        headers: ['Option', 'Use'],
        rows: [
          ['sep', 'Use a separator other than comma, such as tab or semicolon'],
          ['usecols', 'Load only selected columns'],
          ['parse_dates', 'Convert date columns while loading'],
          ['nrows', 'Load only the first number of rows for a quick test']
        ]
      },
      { type: 'warning', text: 'A file path error usually means Python is running from a different folder than you expect. Check your working directory and file name carefully.' },
      { type: 'try', text: 'Create a small CSV named sales.csv using the sample text, then load it with pd.read_csv and print the first rows.' },
      { type: 'keypoints', items: ['CSV is a common plain text data format.', 'pd.read_csv loads CSV files into DataFrames.', 'File paths must point to the correct location.', 'Options like usecols and parse_dates make loading cleaner.'] }
    ]
  },
  {
    slug: 'da-read-excel-json',
    title: 'Excel, JSON & Other Sources',
    description: 'Load data from Excel files, JSON data, and other common sources with pandas.',
    level: 'beginner',
    section: 'Loading Data',
    order: 11,
    minutes: 12,
    content: [
      { type: 'p', text: 'CSV is common, but real analysis work also uses Excel files, JSON data, databases, and web exports. pandas has functions for many formats.' },
      { type: 'h2', text: 'Read Excel files' },
      { type: 'p', text: 'Excel files can contain multiple sheets. pandas can read one sheet at a time. The openpyxl package is commonly used for .xlsx files.' },
      {
        type: 'code',
        title: 'Read an Excel sheet',
        language: 'python',
        code: `import pandas as pd

students = pd.read_excel("students.xlsx", sheet_name="Scores")

print(students.head())`
      },
      { type: 'h2', text: 'Read JSON data' },
      { type: 'p', text: 'JSON is common in web APIs. It stores data with braces, brackets, keys, and values.' },
      {
        type: 'code',
        title: 'customers.json',
        language: 'json',
        code: `[
  {"customer_id": 101, "name": "Ava", "city": "Austin"},
  {"customer_id": 102, "name": "Ben", "city": "Denver"},
  {"customer_id": 103, "name": "Chloe", "city": "Austin"}
]`
      },
      {
        type: 'code',
        title: 'Read JSON',
        language: 'python',
        code: `import pandas as pd

customers = pd.read_json("customers.json")

print(customers)`
      },
      { type: 'h2', text: 'Other sources' },
      {
        type: 'table',
        headers: ['Source', 'pandas function'],
        rows: [
          ['CSV', 'pd.read_csv'],
          ['Excel', 'pd.read_excel'],
          ['JSON', 'pd.read_json'],
          ['SQL query', 'pd.read_sql'],
          ['HTML tables', 'pd.read_html']
        ]
      },
      { type: 'note', text: 'Loading data is only the first step. Always inspect the result after reading a file because formats, headers, and data types may not load the way you expect.' },
      { type: 'try', text: 'Save the sample JSON to customers.json and load it with pd.read_json. Print the city column.' },
      { type: 'keypoints', items: ['pandas can read many data formats.', 'Excel files may have multiple sheets.', 'JSON is common in APIs and web data.', 'Always inspect data after loading it.'] }
    ]
  },
  {
    slug: 'da-inspect',
    title: 'Inspecting Data (head, info, describe)',
    description: 'Use the most important first-look pandas methods to understand a DataFrame before analyzing it.',
    level: 'beginner',
    section: 'Exploring',
    order: 12,
    minutes: 11,
    content: [
      { type: 'p', text: 'Before cleaning or summarizing data, inspect it. A quick inspection helps you notice column names, missing values, wrong data types, and surprising ranges.' },
      { type: 'h2', text: 'Create sample data' },
      {
        type: 'code',
        title: 'Sales data',
        language: 'python',
        code: `import pandas as pd

sales = pd.DataFrame({
    "date": ["2026-01-05", "2026-01-05", "2026-01-06", "2026-01-07"],
    "store": ["Downtown", "Downtown", "Uptown", "Uptown"],
    "product": ["Notebook", "Pen", "Backpack", "Notebook"],
    "units": [3, 10, 1, 2],
    "price": [4.50, 1.25, 32.00, 4.50]
})`
      },
      { type: 'h2', text: 'head and tail' },
      { type: 'p', text: 'head shows the first rows. tail shows the last rows. These are fast ways to check whether the data loaded correctly.' },
      {
        type: 'code',
        title: 'Preview rows',
        language: 'python',
        code: `print(sales.head())
print(sales.tail(2))`
      },
      { type: 'h2', text: 'info and shape' },
      { type: 'p', text: 'info shows column names, non-null counts, and data types. shape shows the number of rows and columns.' },
      {
        type: 'code',
        title: 'Inspect structure',
        language: 'python',
        code: `print(sales.shape)
print(sales.info())`
      },
      { type: 'h2', text: 'describe' },
      { type: 'p', text: 'describe calculates quick summary statistics for numeric columns, such as count, mean, minimum, maximum, and quartiles.' },
      {
        type: 'code',
        title: 'Numeric summary',
        language: 'python',
        code: `print(sales.describe())`
      },
      { type: 'tip', text: 'Make inspection a habit. Run head, info, and describe before writing filters or summaries.' },
      { type: 'try', text: 'Add a revenue column to the sample sales DataFrame, then run head, info, and describe again.' },
      { type: 'keypoints', items: ['Inspect data before analyzing it.', 'head and tail preview rows.', 'info shows data types and missing values.', 'describe gives quick numeric summaries.', 'shape shows rows and columns.'] }
    ]
  },
  {
    slug: 'da-select-columns',
    title: 'Selecting Columns',
    description: 'Select one column, multiple columns, and columns by name to focus your analysis.',
    level: 'beginner',
    section: 'Exploring',
    order: 13,
    minutes: 10,
    content: [
      { type: 'p', text: 'Real datasets can have many columns. Selecting columns lets you focus on the variables needed for your question.' },
      { type: 'h2', text: 'Sample DataFrame' },
      {
        type: 'code',
        title: 'Course enrollments',
        language: 'python',
        code: `import pandas as pd

courses = pd.DataFrame({
    "course_id": [101, 102, 103],
    "course": ["Python Basics", "Excel for Work", "Data Analysis"],
    "category": ["Programming", "Productivity", "Data"],
    "students": [120, 85, 140],
    "rating": [4.8, 4.5, 4.9]
})`
      },
      { type: 'h2', text: 'Select one column' },
      { type: 'p', text: 'Use square brackets with a column name to select one column. This returns a Series.' },
      {
        type: 'code',
        title: 'One column',
        language: 'python',
        code: `course_names = courses["course"]

print(course_names)
print(type(course_names))`
      },
      { type: 'h2', text: 'Select multiple columns' },
      { type: 'p', text: 'Use a list of column names to select multiple columns. This returns a DataFrame.' },
      {
        type: 'code',
        title: 'Multiple columns',
        language: 'python',
        code: `course_summary = courses[["course", "students", "rating"]]

print(course_summary)
print(type(course_summary))`
      },
      { type: 'h2', text: 'Select with loc' },
      { type: 'p', text: 'loc selects by labels. The first part selects rows, and the second part selects columns. A colon means all rows.' },
      {
        type: 'code',
        title: 'Column labels with loc',
        language: 'python',
        code: `print(courses.loc[:, ["course", "rating"]])`
      },
      { type: 'note', text: 'Column names are strings. If a name has spaces or capital letters, match it exactly or rename it before analysis.' },
      { type: 'try', text: 'Select only the course and students columns from the sample DataFrame. Then select only the rating column and check its type.' },
      { type: 'keypoints', items: ['Selecting columns narrows your focus.', 'One column returns a Series.', 'A list of columns returns a DataFrame.', 'loc can select rows and columns by labels.'] }
    ]
  },
  {
    slug: 'da-filter-rows',
    title: 'Filtering Rows',
    description: 'Use conditions to keep only the rows that match your analysis question.',
    level: 'beginner',
    section: 'Exploring',
    order: 14,
    minutes: 12,
    content: [
      { type: 'p', text: 'Filtering rows means keeping only records that match a condition. This is one of the most common analysis tasks.' },
      { type: 'h2', text: 'Sample sales data' },
      {
        type: 'code',
        title: 'Sales rows',
        language: 'python',
        code: `import pandas as pd

sales = pd.DataFrame({
    "store": ["Downtown", "Downtown", "Uptown", "Uptown", "Airport"],
    "product": ["Notebook", "Pen", "Backpack", "Notebook", "Pen"],
    "units": [3, 10, 1, 2, 20],
    "price": [4.50, 1.25, 32.00, 4.50, 1.25]
})

sales["revenue"] = sales["units"] * sales["price"]`
      },
      { type: 'h2', text: 'One condition' },
      { type: 'p', text: 'A condition creates True or False values. pandas uses that boolean result to keep matching rows.' },
      {
        type: 'code',
        title: 'Filter high unit sales',
        language: 'python',
        code: `high_units = sales[sales["units"] >= 10]

print(high_units)`
      },
      { type: 'h2', text: 'Multiple conditions' },
      { type: 'p', text: 'Use & for and, and | for or. Put each condition in parentheses so pandas understands the logic.' },
      {
        type: 'code',
        title: 'Filter by store and revenue',
        language: 'python',
        code: `downtown_revenue = sales[
    (sales["store"] == "Downtown") & (sales["revenue"] > 10)
]

print(downtown_revenue)`
      },
      { type: 'h2', text: 'Filter with isin' },
      {
        type: 'code',
        title: 'Keep selected products',
        language: 'python',
        code: `school_products = sales[sales["product"].isin(["Notebook", "Pen"])]

print(school_products)`
      },
      { type: 'warning', text: 'Use == to compare values. A single = assigns a value and is not used inside a filter condition.' },
      { type: 'try', text: 'Filter the sample sales data to rows where product is Pen or revenue is greater than 20.' },
      { type: 'keypoints', items: ['Filtering keeps rows that match a condition.', 'Conditions produce True and False values.', 'Use & for and, | for or, and parentheses around each condition.', 'isin checks whether values are in a list.'] }
    ]
  },
  {
    slug: 'da-sort-rank',
    title: 'Sorting & Ranking',
    description: 'Sort rows and rank values to find top products, highest scores, and lowest performers.',
    level: 'beginner',
    section: 'Exploring',
    order: 15,
    minutes: 10,
    content: [
      { type: 'p', text: 'Sorting changes the order of rows. Ranking assigns positions based on values. Both are useful for finding top and bottom records.' },
      { type: 'h2', text: 'Sample data' },
      {
        type: 'code',
        title: 'Product sales',
        language: 'python',
        code: `import pandas as pd

products = pd.DataFrame({
    "product": ["Notebook", "Pen", "Backpack", "Marker", "Binder"],
    "category": ["Paper", "Writing", "Bags", "Writing", "Paper"],
    "revenue": [54.00, 37.50, 96.00, 22.00, 45.00]
})`
      },
      { type: 'h2', text: 'Sort values' },
      { type: 'p', text: 'sort_values orders rows by one or more columns. Use ascending=False for largest to smallest.' },
      {
        type: 'code',
        title: 'Top revenue products',
        language: 'python',
        code: `top_products = products.sort_values("revenue", ascending=False)

print(top_products)`
      },
      { type: 'h2', text: 'Sort by multiple columns' },
      {
        type: 'code',
        title: 'Sort category then revenue',
        language: 'python',
        code: `sorted_products = products.sort_values(
    ["category", "revenue"],
    ascending=[True, False]
)

print(sorted_products)`
      },
      { type: 'h2', text: 'Rank values' },
      { type: 'p', text: 'rank creates numeric ranks. A rank of 1 can mean best when you rank in descending order.' },
      {
        type: 'code',
        title: 'Revenue rank',
        language: 'python',
        code: `products["revenue_rank"] = products["revenue"].rank(ascending=False)

print(products.sort_values("revenue_rank"))`
      },
      { type: 'tip', text: 'Use head after sorting to show only the top rows, such as products.sort_values("revenue", ascending=False).head(3).' },
      { type: 'try', text: 'Sort the products by revenue from smallest to largest, then create a rank where the lowest revenue is rank 1.' },
      { type: 'keypoints', items: ['sort_values orders rows.', 'ascending=False sorts from largest to smallest.', 'You can sort by multiple columns.', 'rank assigns positions based on values.'] }
    ]
  },
  {
    slug: 'da-missing-values',
    title: 'Missing Values',
    description: 'Find, understand, remove, and fill missing values safely in pandas.',
    level: 'beginner',
    section: 'Cleaning Data',
    order: 16,
    minutes: 13,
    content: [
      { type: 'p', text: 'Missing values are empty or unknown values in your dataset. They can happen because a field was skipped, a system failed, or a value does not apply.' },
      { type: 'h2', text: 'Sample data with missing values' },
      {
        type: 'code',
        title: 'Customers',
        language: 'python',
        code: `import pandas as pd
import numpy as np

customers = pd.DataFrame({
    "customer": ["Ava", "Ben", "Chloe", "Diego"],
    "city": ["Austin", np.nan, "Austin", "Denver"],
    "orders": [3, 1, np.nan, 4]
})`
      },
      { type: 'h2', text: 'Find missing values' },
      { type: 'p', text: 'isna marks missing values as True. Combining it with sum counts missing values by column.' },
      {
        type: 'code',
        title: 'Count missing values',
        language: 'python',
        code: `print(customers.isna())
print(customers.isna().sum())`
      },
      { type: 'h2', text: 'Drop missing rows' },
      { type: 'p', text: 'dropna removes rows or columns with missing values. This is simple, but it can throw away useful data.' },
      {
        type: 'code',
        title: 'Remove rows with missing values',
        language: 'python',
        code: `complete_customers = customers.dropna()

print(complete_customers)`
      },
      { type: 'h2', text: 'Fill missing values' },
      { type: 'p', text: 'fillna replaces missing values. Choose replacements that make sense for the column and the question.' },
      {
        type: 'code',
        title: 'Fill missing values',
        language: 'python',
        code: `filled_customers = customers.copy()
filled_customers["city"] = filled_customers["city"].fillna("Unknown")
filled_customers["orders"] = filled_customers["orders"].fillna(0)

print(filled_customers)`
      },
      { type: 'warning', text: 'Do not fill missing values automatically without thinking. Filling unknown income with 0, for example, could create a misleading analysis.' },
      { type: 'try', text: 'Add a missing value to a product price column. Count missing values, then decide whether dropping or filling makes more sense.' },
      { type: 'keypoints', items: ['Missing values are common in real data.', 'isna helps find missing values.', 'dropna removes missing rows or columns.', 'fillna replaces missing values.', 'Cleaning choices should match the meaning of the data.'] }
    ]
  },
  {
    slug: 'da-duplicates',
    title: 'Duplicates',
    description: 'Detect and remove duplicate rows so repeated records do not distort your analysis.',
    level: 'beginner',
    section: 'Cleaning Data',
    order: 17,
    minutes: 10,
    content: [
      { type: 'p', text: 'Duplicates are repeated records. Sometimes duplicates are mistakes, and sometimes they are valid repeated events. The key is to understand what one row represents.' },
      { type: 'h2', text: 'Sample duplicate data' },
      {
        type: 'code',
        title: 'Orders with duplicates',
        language: 'python',
        code: `import pandas as pd

orders = pd.DataFrame({
    "order_id": [1001, 1002, 1002, 1003],
    "customer": ["Ava", "Ben", "Ben", "Chloe"],
    "total": [45.00, 18.50, 18.50, 72.25]
})`
      },
      { type: 'h2', text: 'Find duplicates' },
      { type: 'p', text: 'duplicated returns True for rows that are duplicates of earlier rows. You can check the whole row or selected columns.' },
      {
        type: 'code',
        title: 'Detect duplicate rows',
        language: 'python',
        code: `print(orders.duplicated())
print(orders[orders.duplicated()])`
      },
      {
        type: 'code',
        title: 'Detect duplicate order IDs',
        language: 'python',
        code: `duplicate_ids = orders[orders.duplicated(subset=["order_id"], keep=False)]

print(duplicate_ids)`
      },
      { type: 'h2', text: 'Remove duplicates' },
      {
        type: 'code',
        title: 'Drop repeated order rows',
        language: 'python',
        code: `clean_orders = orders.drop_duplicates(subset=["order_id"])

print(clean_orders)`
      },
      { type: 'note', text: 'keep=False marks all copies of duplicated values. This is useful when you want to inspect every row involved in a duplicate.' },
      { type: 'try', text: 'Create a DataFrame with repeated student IDs. Find all duplicated IDs, then drop duplicates while keeping the first row.' },
      { type: 'keypoints', items: ['Duplicates can be mistakes or valid repeated events.', 'duplicated finds repeated rows.', 'subset checks duplicates using selected columns.', 'drop_duplicates removes repeated records.', 'Always understand what one row represents before deleting duplicates.'] }
    ]
  },
  {
    slug: 'da-dtypes',
    title: 'Data Types & Casting',
    description: 'Inspect and convert pandas data types so numbers, dates, and categories behave correctly.',
    level: 'beginner',
    section: 'Cleaning Data',
    order: 18,
    minutes: 13,
    content: [
      { type: 'p', text: 'A data type tells pandas what kind of values a column contains. Common types include integers, floats, strings, booleans, and datetimes.' },
      { type: 'h2', text: 'Why data types matter' },
      { type: 'p', text: 'If a number is stored as text, pandas may not calculate it correctly. If a date is stored as text, sorting and date filtering may behave strangely.' },
      {
        type: 'code',
        title: 'Messy types',
        language: 'python',
        code: `import pandas as pd

sales = pd.DataFrame({
    "date": ["2026-01-05", "2026-01-06", "2026-01-07"],
    "units": ["3", "10", "2"],
    "price": ["4.50", "1.25", "4.50"]
})

print(sales.dtypes)`
      },
      { type: 'h2', text: 'Convert numbers' },
      {
        type: 'code',
        title: 'Cast numeric columns',
        language: 'python',
        code: `sales["units"] = sales["units"].astype(int)
sales["price"] = sales["price"].astype(float)

sales["revenue"] = sales["units"] * sales["price"]

print(sales)
print(sales.dtypes)`
      },
      { type: 'h2', text: 'Convert dates' },
      {
        type: 'code',
        title: 'Convert text to datetime',
        language: 'python',
        code: `sales["date"] = pd.to_datetime(sales["date"])

print(sales.dtypes)
print(sales["date"].dt.month)`
      },
      { type: 'h2', text: 'Handle conversion errors' },
      {
        type: 'code',
        title: 'Safer numeric conversion',
        language: 'python',
        code: `messy = pd.Series(["10", "15", "unknown", "8"])
numbers = pd.to_numeric(messy, errors="coerce")

print(numbers)`
      },
      { type: 'tip', text: 'After loading data, run df.dtypes or df.info. Wrong data types are one of the most common beginner issues.' },
      { type: 'try', text: 'Create a DataFrame where score values are strings. Convert score to an integer column and calculate the average.' },
      { type: 'keypoints', items: ['Data types affect calculations, sorting, and filtering.', 'astype converts columns to a chosen type.', 'pd.to_datetime converts date-like text.', 'pd.to_numeric can coerce invalid values to missing values.', 'Check data types early in every analysis.'] }
    ]
  },
  {
    slug: 'da-string-clean',
    title: 'Cleaning Text Columns',
    description: 'Use pandas string methods to clean spaces, casing, categories, and simple patterns in text columns.',
    level: 'beginner',
    section: 'Cleaning Data',
    order: 19,
    minutes: 12,
    content: [
      { type: 'p', text: 'Text data is often messy. Extra spaces, inconsistent capitalization, and small spelling differences can split categories that should be the same.' },
      { type: 'h2', text: 'Sample messy text' },
      {
        type: 'code',
        title: 'Customer cities',
        language: 'python',
        code: `import pandas as pd

customers = pd.DataFrame({
    "customer": ["Ava", "Ben", "Chloe", "Diego"],
    "city": [" Austin ", "austin", "DENVER", "Denver "],
    "email": ["AVA@EXAMPLE.COM", "ben@example.com ", " chloe@example.com", "diego@example.com"]
})`
      },
      { type: 'h2', text: 'Strip spaces and fix case' },
      { type: 'p', text: 'Use the .str accessor to apply string methods to a whole pandas column.' },
      {
        type: 'code',
        title: 'Clean city and email',
        language: 'python',
        code: `customers["city"] = customers["city"].str.strip().str.title()
customers["email"] = customers["email"].str.strip().str.lower()

print(customers)`
      },
      { type: 'h2', text: 'Replace category values' },
      {
        type: 'code',
        title: 'Standardize categories',
        language: 'python',
        code: `products = pd.DataFrame({
    "category": ["office supplies", "Office Supplies", "OFFICE", "bags"]
})

products["category"] = products["category"].str.strip().str.lower()
products["category"] = products["category"].replace({
    "office": "office supplies"
})

print(products)`
      },
      { type: 'h2', text: 'Check the result' },
      {
        type: 'code',
        title: 'Count cleaned categories',
        language: 'python',
        code: `print(customers["city"].value_counts())`
      },
      { type: 'note', text: 'String cleaning is not only cosmetic. Inconsistent labels can change groupby results and make totals look incorrect.' },
      { type: 'try', text: 'Create a DataFrame with messy course names such as " python ", "PYTHON", and "Python". Clean them so they become one consistent value.' },
      { type: 'keypoints', items: ['Text columns often need cleaning.', '.str.strip removes extra spaces.', '.str.lower and .str.title standardize casing.', 'replace can map inconsistent labels to standard labels.', 'Always check category counts after cleaning.'] }
    ]
  },
  {
    slug: 'da-rename-reindex',
    title: 'Renaming Columns & Reindexing',
    description: 'Rename unclear columns, reorder columns, reset indexes, and set meaningful indexes in pandas.',
    level: 'beginner',
    section: 'Cleaning Data',
    order: 20,
    minutes: 11,
    content: [
      { type: 'p', text: 'Clear column names make analysis easier to read. Indexes also matter because they label rows and affect how pandas aligns data.' },
      { type: 'h2', text: 'Rename columns' },
      {
        type: 'code',
        title: 'Messy column names',
        language: 'python',
        code: `import pandas as pd

sales = pd.DataFrame({
    "Product Name": ["Notebook", "Pen", "Backpack"],
    "Units Sold": [3, 10, 1],
    "Unit Price": [4.50, 1.25, 32.00]
})

sales = sales.rename(columns={
    "Product Name": "product",
    "Units Sold": "units",
    "Unit Price": "price"
})

print(sales)`
      },
      { type: 'h2', text: 'Reorder columns' },
      { type: 'p', text: 'Selecting columns in a chosen order creates a DataFrame with that order.' },
      {
        type: 'code',
        title: 'Choose column order',
        language: 'python',
        code: `sales["revenue"] = sales["units"] * sales["price"]
sales = sales[["product", "units", "price", "revenue"]]

print(sales)`
      },
      { type: 'h2', text: 'Set and reset index' },
      { type: 'p', text: 'An index labels rows. Sometimes a meaningful ID makes a useful index. Other times, a simple 0-based index is easier.' },
      {
        type: 'code',
        title: 'Index examples',
        language: 'python',
        code: `students = pd.DataFrame({
    "student_id": [501, 502, 503],
    "name": ["Ava", "Leo", "Mia"],
    "score": [88, 92, 79]
})

by_id = students.set_index("student_id")
print(by_id)

back_to_rows = by_id.reset_index()
print(back_to_rows)`
      },
      { type: 'tip', text: 'Many teams use lowercase snake_case column names, such as unit_price, because they are easy to type and consistent with Python style.' },
      { type: 'try', text: 'Rename three columns from messy names to snake_case, then reorder the DataFrame so the identifier column comes first.' },
      { type: 'keypoints', items: ['rename changes column labels.', 'Clear column names improve readability.', 'Selecting a column list can reorder columns.', 'set_index uses a column as row labels.', 'reset_index turns the index back into a regular column.'] }
    ]
  },
  {
    slug: 'da-groupby',
    title: 'groupby Basics',
    description: 'Use groupby to split data into groups and calculate summaries for each group.',
    level: 'beginner',
    section: 'Summarizing',
    order: 21,
    minutes: 12,
    content: [
      { type: 'p', text: 'groupby is one of the most important pandas tools. It lets you answer questions like "total revenue by store" or "average score by course".' },
      { type: 'h2', text: 'The groupby idea' },
      { type: 'p', text: 'A groupby operation usually has three parts: split the rows into groups, apply a calculation, and combine the results.' },
      {
        type: 'code',
        title: 'Sales by store',
        language: 'python',
        code: `import pandas as pd

sales = pd.DataFrame({
    "store": ["Downtown", "Downtown", "Uptown", "Uptown", "Airport"],
    "product": ["Notebook", "Pen", "Backpack", "Notebook", "Pen"],
    "units": [3, 10, 1, 2, 20],
    "price": [4.50, 1.25, 32.00, 4.50, 1.25]
})

sales["revenue"] = sales["units"] * sales["price"]

store_revenue = sales.groupby("store")["revenue"].sum()
print(store_revenue)`
      },
      { type: 'h2', text: 'Group by one column' },
      {
        type: 'code',
        title: 'Average units by product',
        language: 'python',
        code: `average_units = sales.groupby("product")["units"].mean()

print(average_units)`
      },
      { type: 'h2', text: 'Group by multiple columns' },
      {
        type: 'code',
        title: 'Revenue by store and product',
        language: 'python',
        code: `store_product_revenue = sales.groupby(["store", "product"])["revenue"].sum()

print(store_product_revenue)`
      },
      { type: 'h2', text: 'Return a DataFrame' },
      {
        type: 'code',
        title: 'Reset the grouped index',
        language: 'python',
        code: `summary = sales.groupby("store")["revenue"].sum().reset_index()

print(summary)`
      },
      { type: 'tip', text: 'If groupby output looks different than expected, add reset_index to turn grouped labels back into regular columns.' },
      { type: 'try', text: 'Group the sales data by product and calculate total revenue for each product.' },
      { type: 'keypoints', items: ['groupby splits rows into groups.', 'Choose grouping columns and a value column.', 'Common calculations include sum, mean, count, min, and max.', 'reset_index turns grouped output back into a normal DataFrame.'] }
    ]
  },
  {
    slug: 'da-aggregations',
    title: 'Aggregations (sum, mean, count, agg)',
    description: 'Calculate single and multiple summary statistics with pandas aggregation methods.',
    level: 'beginner',
    section: 'Summarizing',
    order: 22,
    minutes: 13,
    content: [
      { type: 'p', text: 'An aggregation reduces many values into a summary value. Examples include total revenue, average score, number of orders, and maximum price.' },
      { type: 'h2', text: 'Common aggregation methods' },
      {
        type: 'code',
        title: 'Student scores',
        language: 'python',
        code: `import pandas as pd

students = pd.DataFrame({
    "course": ["Math", "Math", "Science", "Science", "History"],
    "student": ["Ava", "Leo", "Mia", "Noah", "Zoe"],
    "score": [88, 92, 79, 85, 91]
})

print(students["score"].mean())
print(students["score"].min())
print(students["score"].max())
print(students["score"].count())`
      },
      { type: 'h2', text: 'Aggregate by group' },
      {
        type: 'code',
        title: 'Average score by course',
        language: 'python',
        code: `course_average = students.groupby("course")["score"].mean()

print(course_average)`
      },
      { type: 'h2', text: 'Use agg for multiple summaries' },
      { type: 'p', text: 'agg lets you calculate several summaries at once. This is useful for quick reports.' },
      {
        type: 'code',
        title: 'Multiple aggregations',
        language: 'python',
        code: `course_summary = students.groupby("course").agg(
    average_score=("score", "mean"),
    highest_score=("score", "max"),
    student_count=("student", "count")
).reset_index()

print(course_summary)`
      },
      { type: 'h2', text: 'Named aggregations' },
      { type: 'p', text: 'The named aggregation style creates readable output column names. Each line uses output_name=(input_column, aggregation).' },
      { type: 'note', text: 'count ignores missing values in the selected column. If you need row counts, choose a column that should always be present or use size.' },
      { type: 'try', text: 'Create a sales summary by product with total revenue, average units, and number of rows.' },
      { type: 'keypoints', items: ['Aggregations summarize many values.', 'sum, mean, count, min, and max are common.', 'groupby plus aggregation summarizes by category.', 'agg can calculate multiple summaries at once.', 'Named aggregations make output columns clearer.'] }
    ]
  },
  {
    slug: 'da-merge-join',
    title: 'merge & join',
    description: 'Combine related tables with shared keys using pandas merge and understand common join types.',
    level: 'beginner',
    section: 'Combining Data',
    order: 23,
    minutes: 14,
    content: [
      { type: 'p', text: 'Real data is often split across multiple tables. For example, orders may contain customer IDs while a separate customers table contains names and cities.' },
      { type: 'h2', text: 'Two related tables' },
      {
        type: 'code',
        title: 'Orders and customers',
        language: 'python',
        code: `import pandas as pd

orders = pd.DataFrame({
    "order_id": [1001, 1002, 1003, 1004],
    "customer_id": [1, 2, 1, 4],
    "total": [45.00, 18.50, 72.25, 16.00]
})

customers = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "name": ["Ava", "Ben", "Chloe"],
    "city": ["Austin", "Denver", "Austin"]
})`
      },
      { type: 'h2', text: 'Inner merge' },
      { type: 'p', text: 'An inner merge keeps only matching keys in both tables. It is useful when you only want complete matches.' },
      {
        type: 'code',
        title: 'Inner merge on customer_id',
        language: 'python',
        code: `inner = orders.merge(customers, on="customer_id", how="inner")

print(inner)`
      },
      { type: 'h2', text: 'Left merge' },
      { type: 'p', text: 'A left merge keeps all rows from the left table and adds matching data from the right table when available.' },
      {
        type: 'code',
        title: 'Left merge keeps all orders',
        language: 'python',
        code: `left = orders.merge(customers, on="customer_id", how="left")

print(left)`
      },
      { type: 'h2', text: 'Common join types' },
      {
        type: 'table',
        headers: ['Join type', 'What it keeps'],
        rows: [
          ['inner', 'Only rows with matching keys in both tables'],
          ['left', 'All left rows and matching right data'],
          ['right', 'All right rows and matching left data'],
          ['outer', 'All keys from both tables']
        ]
      },
      {
        type: 'code',
        title: 'Check unmatched rows after a left merge',
        language: 'python',
        code: `left = orders.merge(customers, on="customer_id", how="left")
missing_customers = left[left["name"].isna()]

print(missing_customers)`
      },
      { type: 'warning', text: 'Before merging, check whether the key columns have the same meaning and data type. Mismatched keys can create missing values or duplicated rows.' },
      { type: 'try', text: 'Create a courses table and an enrollments table linked by course_id. Merge them so each enrollment shows the course name.' },
      { type: 'keypoints', items: ['merge combines tables using shared keys.', 'Inner merges keep only matches.', 'Left merges keep all rows from the left table.', 'Join type changes which rows appear.', 'Always check keys before and after merging.'] }
    ]
  },
  {
    slug: 'da-concat',
    title: 'concat & append patterns',
    description: 'Stack similar DataFrames with concat and replace old append-style workflows.',
    level: 'beginner',
    section: 'Combining Data',
    order: 24,
    minutes: 11,
    content: [
      { type: 'p', text: 'concat combines DataFrames by stacking rows or placing columns side by side. It is commonly used when you receive the same kind of data in separate files.' },
      { type: 'h2', text: 'Stack rows' },
      { type: 'p', text: 'If two DataFrames have the same columns, concat can stack one under the other.' },
      {
        type: 'code',
        title: 'Monthly sales',
        language: 'python',
        code: `import pandas as pd

january = pd.DataFrame({
    "month": ["Jan", "Jan"],
    "product": ["Notebook", "Pen"],
    "revenue": [54.00, 37.50]
})

february = pd.DataFrame({
    "month": ["Feb", "Feb"],
    "product": ["Notebook", "Backpack"],
    "revenue": [72.00, 96.00]
})

sales = pd.concat([january, february], ignore_index=True)

print(sales)`
      },
      { type: 'h2', text: 'Why ignore_index helps' },
      { type: 'p', text: 'Each original DataFrame has its own index. ignore_index=True creates a fresh 0-based index in the combined result.' },
      {
        type: 'code',
        title: 'Without ignore_index',
        language: 'python',
        code: `sales_with_old_index = pd.concat([january, february])

print(sales_with_old_index)`
      },
      { type: 'h2', text: 'Append pattern' },
      { type: 'p', text: 'Older pandas examples may use DataFrame.append. Modern pandas uses pd.concat instead.' },
      {
        type: 'code',
        title: 'Add one new row with concat',
        language: 'python',
        code: `new_sale = pd.DataFrame([{
    "month": "Mar",
    "product": "Marker",
    "revenue": 22.00
}])

sales = pd.concat([sales, new_sale], ignore_index=True)

print(sales)`
      },
      { type: 'h2', text: 'Combine columns carefully' },
      {
        type: 'code',
        title: 'Column-wise concat',
        language: 'python',
        code: `details = pd.DataFrame({
    "category": ["Paper", "Writing", "Paper", "Bags", "Writing"]
})

combined = pd.concat([sales, details], axis=1)

print(combined)`
      },
      { type: 'warning', text: 'When concatenating columns with axis=1, pandas aligns rows by index. Make sure the row order and index really match.' },
      { type: 'try', text: 'Create two DataFrames for March and April sales with the same columns. Stack them with pd.concat and reset the index.' },
      { type: 'keypoints', items: ['pd.concat combines DataFrames.', 'axis=0 stacks rows.', 'axis=1 combines columns.', 'ignore_index=True creates a fresh index.', 'Use concat instead of old append-style code.'] }
    ]
  },
  {
    slug: 'da-first-eda',
    title: 'Your First Mini EDA',
    description: 'Put the beginner skills together in a small exploratory data analysis project using pandas.',
    level: 'beginner',
    section: 'Putting It Together',
    order: 25,
    minutes: 15,
    content: [
      { type: 'p', text: 'EDA means exploratory data analysis. It is the first serious look at a dataset: inspect it, clean obvious issues, calculate summaries, and note patterns worth investigating.' },
      { type: 'h2', text: 'Project question' },
      { type: 'p', text: 'In this mini EDA, you will answer: Which store and product categories are driving revenue in a small sales dataset?' },
      { type: 'h2', text: 'Create the dataset' },
      {
        type: 'code',
        title: 'Mini sales dataset',
        language: 'python',
        code: `import pandas as pd
import numpy as np

sales = pd.DataFrame({
    "date": ["2026-01-05", "2026-01-05", "2026-01-06", "2026-01-06", "2026-01-07", "2026-01-07"],
    "store": ["Downtown", "Downtown", "Uptown", "Uptown", "Airport", "Airport"],
    "product": ["Notebook", "Pen", "Backpack", "Notebook", "Pen", "Backpack"],
    "category": ["Paper", "Writing", "Bags", "Paper", "Writing", "Bags"],
    "units": [3, 10, 1, 2, 20, np.nan],
    "price": [4.50, 1.25, 32.00, 4.50, 1.25, 32.00]
})`
      },
      { type: 'h2', text: 'Inspect and clean' },
      { type: 'p', text: 'Start by checking shape, column types, and missing values. Then make a simple cleaning decision for missing units.' },
      {
        type: 'code',
        title: 'First inspection',
        language: 'python',
        code: `print(sales.head())
print(sales.info())
print(sales.isna().sum())

sales["date"] = pd.to_datetime(sales["date"])
sales["units"] = sales["units"].fillna(0)
sales["revenue"] = sales["units"] * sales["price"]`
      },
      { type: 'h2', text: 'Summarize revenue' },
      {
        type: 'code',
        title: 'Revenue summaries',
        language: 'python',
        code: `store_summary = sales.groupby("store").agg(
    total_revenue=("revenue", "sum"),
    total_units=("units", "sum")
).reset_index().sort_values("total_revenue", ascending=False)

category_summary = sales.groupby("category").agg(
    total_revenue=("revenue", "sum"),
    average_price=("price", "mean")
).reset_index().sort_values("total_revenue", ascending=False)

print(store_summary)
print(category_summary)`
      },
      { type: 'h2', text: 'Ask one follow-up question' },
      { type: 'p', text: 'EDA should create better questions. For example, if one store has low revenue, is it because it sold fewer units, sold cheaper products, or has missing data?' },
      {
        type: 'code',
        title: 'Product detail by store',
        language: 'python',
        code: `detail = sales.groupby(["store", "product"]).agg(
    revenue=("revenue", "sum"),
    units=("units", "sum")
).reset_index()

print(detail.sort_values(["store", "revenue"], ascending=[True, False]))`
      },
      { type: 'h2', text: 'Write findings' },
      {
        type: 'code',
        title: 'Example findings',
        language: 'text',
        code: `Findings:
- Airport has strong Pen revenue because it sold many units.
- Backpack revenue depends heavily on whether units are recorded.
- Bags have the highest average price, but not always the highest total revenue.

Next questions:
- Why is one Backpack units value missing?
- Are these six rows enough to represent normal store performance?`
      },
      { type: 'note', text: 'A mini EDA is not the final truth. It is a structured first pass that helps you understand the data and decide what to investigate next.' },
      { type: 'try', text: 'Extend the dataset with two more sales rows. Rerun the summaries and write three findings in plain language.' },
      { type: 'keypoints', items: ['EDA means exploratory data analysis.', 'Start with a question, then inspect and clean the data.', 'Create useful summary tables with groupby and agg.', 'Sort summaries to find top and bottom groups.', 'End with findings, limitations, and next questions.'] }
    ]
  }
];
