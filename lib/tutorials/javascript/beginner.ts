import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-javascript',
    title: 'What is JavaScript?',
    description: 'Learn what JavaScript is, why it matters, and how it makes web pages interactive.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 7,
    content: [
      { type: 'p', text: 'JavaScript is the programming language of the web browser. HTML creates the structure of a page, CSS controls how it looks, and JavaScript makes it respond to users.' },
      { type: 'h2', text: 'Why JavaScript exists' },
      { type: 'p', text: 'A web page without JavaScript can still show text, images, and links. JavaScript adds behavior, such as opening a menu, checking a form, updating a price, or reacting when a button is clicked.' },
      { type: 'ul', items: ['HTML answers: What is on the page?', 'CSS answers: How should it look?', 'JavaScript answers: What should happen?'] },
      {
        type: 'code',
        title: 'A first JavaScript idea',
        language: 'javascript',
        code: `const buttonText = 'Add to cart';
console.log(buttonText);`
      },
      { type: 'h2', text: 'What JavaScript can do in the browser' },
      { type: 'p', text: 'Browser JavaScript can read and change page content, listen for user actions, store small pieces of data, call APIs, and update the screen without loading a whole new page.' },
      {
        type: 'table',
        headers: ['Task', 'Example'],
        rows: [
          ['Respond to clicks', 'Show a dropdown menu'],
          ['Change content', 'Replace a heading with a welcome message'],
          ['Validate input', 'Check that an email field is not empty'],
          ['Calculate values', 'Update a shopping cart total']
        ]
      },
      {
        type: 'code',
        title: 'A browser-style action',
        language: 'javascript',
        code: `const price = 25;
const quantity = 2;
const total = price * quantity;

console.log('Total: $' + total);`
      },
      { type: 'note', text: 'JavaScript is not the same as Java. The names are similar for historical reasons, but they are different languages.' },
      { type: 'try', text: 'Think of three things you clicked today on a website or app. For each one, describe what JavaScript might have done after the click.' },
      { type: 'keypoints', items: ['JavaScript adds behavior to web pages.', 'HTML, CSS, and JavaScript work together in the browser.', 'JavaScript can react to users, change the DOM, and calculate values.', 'You can start learning JavaScript with small examples and build up gradually.'] }
    ]
  },
  {
    slug: 'js-in-html',
    title: 'JavaScript in HTML',
    description: 'Learn the common ways to place JavaScript in an HTML page.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 8,
    content: [
      { type: 'p', text: 'JavaScript runs in the browser when it is connected to an HTML document. You can write JavaScript directly inside HTML or link to a separate JavaScript file.' },
      { type: 'h2', text: 'The script element' },
      { type: 'p', text: 'The HTML script element tells the browser that the content is JavaScript. For small demos, writing JavaScript inside a script element is convenient.' },
      {
        type: 'code',
        title: 'Inline JavaScript in HTML',
        language: 'html',
        code: `<!DOCTYPE html>
<html>
<body>
  <h1>Hello JavaScript</h1>

  <script>
    console.log('JavaScript is running');
  </script>
</body>
</html>`
      },
      { type: 'h2', text: 'External JavaScript files' },
      { type: 'p', text: 'For real projects, JavaScript usually belongs in a separate file. This keeps HTML cleaner and makes the code easier to reuse and maintain.' },
      {
        type: 'code',
        title: 'Linking a script file',
        language: 'html',
        code: `<script src="app.js"></script>`
      },
      {
        type: 'code',
        title: 'app.js',
        language: 'javascript',
        code: `const message = 'Loaded from app.js';
console.log(message);`
      },
      { type: 'h2', text: 'Where should scripts go?' },
      { type: 'p', text: 'If JavaScript needs to read elements from the page, the browser must create those elements first. A common beginner-friendly choice is placing the script near the end of the body.' },
      {
        type: 'code',
        title: 'Script after page content',
        language: 'html',
        code: `<button id="saveButton">Save</button>

<script src="app.js"></script>`
      },
      { type: 'tip', text: 'Modern projects often use the defer attribute on script tags so JavaScript loads without blocking the page.' },
      { type: 'try', text: 'Create a simple HTML file with a heading and a script that logs your name to the console.' },
      { type: 'keypoints', items: ['Use script tags to run JavaScript in an HTML page.', 'Inline scripts are useful for tiny examples.', 'External JavaScript files are better for real projects.', 'Place scripts after the HTML they need to use, or use defer in modern pages.'] }
    ]
  },
  {
    slug: 'js-output',
    title: 'JavaScript Output',
    description: 'Learn beginner-friendly ways to show JavaScript results while developing web pages.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 8,
    content: [
      { type: 'p', text: 'Output means showing the result of your JavaScript code. When you are learning, output helps you see what your code is doing.' },
      { type: 'h2', text: 'Using console.log' },
      { type: 'p', text: 'The console is a developer tool built into the browser. console.log is the safest and most common way to inspect values while learning and debugging.' },
      {
        type: 'code',
        title: 'Print values to the console',
        language: 'javascript',
        code: `const username = 'Amina';
const points = 42;

console.log(username);
console.log(points);`
      },
      { type: 'h2', text: 'Changing text on the page' },
      { type: 'p', text: 'JavaScript can also write output into an HTML element. This is more realistic for web pages because users see the result on the screen.' },
      {
        type: 'code',
        title: 'Write to an element',
        language: 'html',
        code: `<p id="result">Waiting...</p>

<script>
  document.getElementById('result').textContent = 'Order saved!';
</script>`
      },
      { type: 'h2', text: 'Alerts and document.write' },
      { type: 'p', text: 'alert shows a popup message, but it interrupts the user. document.write can replace the whole page after it loads, so it is mostly used in old examples and should be avoided in modern projects.' },
      {
        type: 'table',
        headers: ['Output method', 'Good for'],
        rows: [
          ['console.log', 'Debugging and learning'],
          ['textContent', 'Showing results on the page'],
          ['alert', 'Very small demos only'],
          ['document.write', 'Rarely recommended']
        ]
      },
      {
        type: 'code',
        title: 'A simple message popup',
        language: 'javascript',
        code: `alert('Welcome to the site!');`
      },
      { type: 'warning', text: 'Do not use alert for normal page feedback. It blocks the page until the user closes the popup.' },
      { type: 'try', text: 'Make a paragraph with id message, then use JavaScript to change its text to a short welcome message.' },
      { type: 'keypoints', items: ['console.log is ideal for learning and debugging.', 'Use DOM properties like textContent to show output on a page.', 'alert is disruptive and should be used carefully.', 'Avoid document.write in modern web pages.'] }
    ]
  },
  {
    slug: 'js-statements',
    title: 'Statements & Syntax',
    description: 'Learn how JavaScript statements are written and how syntax rules help the browser understand your code.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 8,
    content: [
      { type: 'p', text: 'A JavaScript program is made of statements. A statement is one instruction that tells the browser to do something.' },
      { type: 'h2', text: 'Statements run in order' },
      { type: 'p', text: 'JavaScript usually reads statements from top to bottom. That order matters because later statements can use values created earlier.' },
      {
        type: 'code',
        title: 'Statements in order',
        language: 'javascript',
        code: `const itemPrice = 30;
const shipping = 5;
const total = itemPrice + shipping;

console.log(total);`
      },
      { type: 'h2', text: 'Semicolons and whitespace' },
      { type: 'p', text: 'A semicolon marks the end of a statement. JavaScript can often insert semicolons automatically, but writing them consistently can make beginner code easier to read.' },
      {
        type: 'code',
        title: 'Whitespace is for humans',
        language: 'javascript',
        code: `const firstName = 'Kai';
const lastName = 'Rivera';

const fullName = firstName + ' ' + lastName;
console.log(fullName);`
      },
      { type: 'p', text: 'Spaces, blank lines, and indentation do not usually change what code means, but they make your code much easier to scan.' },
      { type: 'h2', text: 'Blocks group statements' },
      { type: 'p', text: 'Curly braces create a block. Blocks are used with features like if statements, loops, and functions.' },
      {
        type: 'code',
        title: 'A block of code',
        language: 'javascript',
        code: `const isLoggedIn = true;

if (isLoggedIn) {
  console.log('Show account menu');
  console.log('Load saved settings');
}`
      },
      { type: 'note', text: 'Syntax errors happen when JavaScript cannot understand the code structure, such as a missing quote, parenthesis, or brace.' },
      { type: 'try', text: 'Write three statements: store a product name, store a price, and log a sentence that includes both values.' },
      { type: 'keypoints', items: ['Statements are individual instructions.', 'JavaScript commonly runs statements from top to bottom.', 'Semicolons, indentation, and spacing improve readability.', 'Curly braces group statements into blocks.'] }
    ]
  },
  {
    slug: 'js-comments',
    title: 'Comments',
    description: 'Learn how to write comments that explain JavaScript code without changing how it runs.',
    level: 'beginner',
    section: 'Getting Started',
    order: 5,
    minutes: 6,
    content: [
      { type: 'p', text: 'Comments are notes inside your code. JavaScript ignores comments when it runs, but humans can read them.' },
      { type: 'h2', text: 'Single-line comments' },
      { type: 'p', text: 'Use two forward slashes for a comment that lasts until the end of the line. This is useful for short explanations.' },
      {
        type: 'code',
        title: 'Single-line comments',
        language: 'javascript',
        code: `// Store the user's selected plan.
const plan = 'Pro';

console.log(plan);`
      },
      { type: 'h2', text: 'Multi-line comments' },
      { type: 'p', text: 'Use a slash-star comment for longer notes that span multiple lines. These are less common in everyday beginner code but useful for larger explanations.' },
      {
        type: 'code',
        title: 'Multi-line comments',
        language: 'javascript',
        code: `/*
  Calculate the final price.
  The discount is subtracted before tax is added.
*/
const finalPrice = 100 - 20;

console.log(finalPrice);`
      },
      { type: 'h2', text: 'What makes a good comment?' },
      { type: 'p', text: 'A helpful comment explains why code exists or why a decision was made. It should not repeat something obvious that the code already says.' },
      {
        type: 'table',
        headers: ['Less helpful', 'More helpful'],
        rows: [
          ['Set total to price plus tax', 'Include tax because checkout totals must match the receipt'],
          ['Click button', 'Save only after the user confirms the form']
        ]
      },
      { type: 'tip', text: 'Good variable names reduce the need for comments. Use comments for context that code cannot easily show by itself.' },
      { type: 'try', text: 'Write a short price calculation and add one comment that explains why the calculation is needed.' },
      { type: 'keypoints', items: ['Comments are ignored by JavaScript.', 'Use // for single-line comments.', 'Use slash-star comments for longer notes.', 'Good comments explain why, not just what.'] }
    ]
  },
  {
    slug: 'js-variables',
    title: 'Variables',
    description: 'Learn how variables store values so your JavaScript can remember and reuse information.',
    level: 'beginner',
    section: 'Foundations',
    order: 6,
    minutes: 9,
    content: [
      { type: 'p', text: 'A variable is a named container for a value. Variables let your code remember information and use it later.' },
      { type: 'h2', text: 'Creating variables' },
      { type: 'p', text: 'Use let or const, then choose a meaningful name. The name should describe what the value represents.' },
      {
        type: 'code',
        title: 'Store simple values',
        language: 'javascript',
        code: `const firstName = 'Maya';
let cartItems = 3;

console.log(firstName);
console.log(cartItems);`
      },
      { type: 'h2', text: 'Changing values' },
      { type: 'p', text: 'A variable created with let can be changed later. This is useful for values that naturally update, such as a counter or form status.' },
      {
        type: 'code',
        title: 'Update a variable',
        language: 'javascript',
        code: `let likes = 0;

likes = likes + 1;
likes = likes + 1;

console.log(likes);`
      },
      { type: 'h2', text: 'Naming variables clearly' },
      { type: 'p', text: 'JavaScript variable names often use camelCase. In camelCase, the first word is lowercase and each later word starts with a capital letter.' },
      {
        type: 'table',
        headers: ['Good name', 'Why it helps'],
        rows: [
          ['userEmail', 'Clearly stores an email address'],
          ['totalPrice', 'Clearly stores a calculated price'],
          ['isMenuOpen', 'Clearly stores a yes-or-no state']
        ]
      },
      { type: 'warning', text: 'Variable names cannot contain spaces and cannot start with a number.' },
      { type: 'try', text: 'Create variables for a product name, price, and quantity. Then calculate and log the total cost.' },
      { type: 'keypoints', items: ['Variables store values under useful names.', 'Use const for values that should not be reassigned.', 'Use let for values that need to change.', 'Clear variable names make code easier to understand.'] }
    ]
  },
  {
    slug: 'js-let-const',
    title: 'let, const & var',
    description: 'Learn the difference between let, const, and var when declaring JavaScript variables.',
    level: 'beginner',
    section: 'Foundations',
    order: 7,
    minutes: 9,
    content: [
      { type: 'p', text: 'JavaScript has three common keywords for declaring variables: let, const, and var. Modern code mainly uses const and let.' },
      { type: 'h2', text: 'Use const by default' },
      { type: 'p', text: 'const means the variable cannot be reassigned to a different value. This protects your code from accidental changes and makes your intention clear.' },
      {
        type: 'code',
        title: 'const prevents reassignment',
        language: 'javascript',
        code: `const appName = 'Recipe Finder';

console.log(appName);`
      },
      { type: 'h2', text: 'Use let when the value changes' },
      { type: 'p', text: 'let is useful for values that update over time, like a score, a counter, or whether a menu is open.' },
      {
        type: 'code',
        title: 'let allows reassignment',
        language: 'javascript',
        code: `let score = 0;

score = score + 10;
score = score + 5;

console.log(score);`
      },
      { type: 'h2', text: 'What about var?' },
      { type: 'p', text: 'var is the older way to create variables. You will see it in older tutorials and codebases, but let and const have clearer behavior and are preferred today.' },
      {
        type: 'table',
        headers: ['Keyword', 'Can reassign?', 'Modern recommendation'],
        rows: [
          ['const', 'No', 'Use first when the binding should not change'],
          ['let', 'Yes', 'Use when the value must change'],
          ['var', 'Yes', 'Recognize it, but avoid in new code']
        ]
      },
      {
        type: 'code',
        title: 'Choosing let or const',
        language: 'javascript',
        code: `const taxRate = 0.08;
let subtotal = 40;

subtotal = subtotal + 12;

const tax = subtotal * taxRate;
console.log(tax);`
      },
      { type: 'tip', text: 'Start with const. If your code needs to reassign the variable later, change it to let.' },
      { type: 'try', text: 'Write a shopping cart example with a const tax rate and a let item count that increases by one.' },
      { type: 'keypoints', items: ['Modern JavaScript uses const and let.', 'const blocks reassignment of the variable name.', 'let allows reassignment.', 'var is older and usually avoided in new beginner code.'] }
    ]
  },
  {
    slug: 'js-data-types',
    title: 'Data Types',
    description: 'Learn the basic kinds of values JavaScript can work with.',
    level: 'beginner',
    section: 'Foundations',
    order: 8,
    minutes: 10,
    content: [
      { type: 'p', text: 'A data type describes what kind of value you have. JavaScript uses different types for text, numbers, true-or-false values, lists, objects, and empty values.' },
      { type: 'h2', text: 'Common beginner data types' },
      { type: 'p', text: 'Knowing the type of a value helps you choose what you can do with it. You can add numbers, join strings, and test booleans in conditions.' },
      {
        type: 'table',
        headers: ['Type', 'Example', 'Use'],
        rows: [
          ['string', "'Hello'", 'Text'],
          ['number', '29.99', 'Math and amounts'],
          ['boolean', 'true', 'Yes-or-no choices'],
          ['array', "['red', 'blue']", 'Ordered lists'],
          ['object', "{ name: 'Ava' }", 'Grouped information'],
          ['null', 'null', 'Intentionally empty'],
          ['undefined', 'undefined', 'Not assigned yet']
        ]
      },
      {
        type: 'code',
        title: 'Different types',
        language: 'javascript',
        code: `const productName = 'Notebook';
const price = 4.99;
const inStock = true;
const tags = ['school', 'paper'];
const product = { name: 'Notebook', price: 4.99 };

console.log(productName);
console.log(price);
console.log(inStock);
console.log(tags);
console.log(product);`
      },
      { type: 'h2', text: 'Checking a type' },
      { type: 'p', text: 'The typeof operator tells you the type of many values. It is helpful when you are learning or debugging.' },
      {
        type: 'code',
        title: 'Use typeof',
        language: 'javascript',
        code: `console.log(typeof 'Hello');
console.log(typeof 42);
console.log(typeof true);
console.log(typeof undefined);`
      },
      { type: 'note', text: 'Arrays are a special kind of object in JavaScript, so typeof returns object for arrays. You will learn arrays separately soon.' },
      { type: 'try', text: 'Create one variable for each of these types: string, number, boolean, array, and object. Log each value and its typeof result.' },
      { type: 'keypoints', items: ['Data types describe the kind of value stored.', 'Strings hold text and numbers hold numeric values.', 'Booleans hold true or false.', 'Arrays and objects help organize larger sets of data.', 'typeof can help inspect many values.'] }
    ]
  },
  {
    slug: 'js-operators',
    title: 'Operators',
    description: 'Learn how operators combine, compare, and update JavaScript values.',
    level: 'beginner',
    section: 'Foundations',
    order: 9,
    minutes: 10,
    content: [
      { type: 'p', text: 'Operators are symbols or words that perform actions on values. They can do math, compare values, assign values, and build conditions.' },
      { type: 'h2', text: 'Arithmetic operators' },
      { type: 'p', text: 'Arithmetic operators work with numbers. They are useful for prices, totals, scores, measurements, and counts.' },
      {
        type: 'table',
        headers: ['Operator', 'Meaning', 'Example'],
        rows: [
          ['+', 'Add', '2 + 3'],
          ['-', 'Subtract', '10 - 4'],
          ['*', 'Multiply', '5 * 6'],
          ['/', 'Divide', '20 / 4'],
          ['%', 'Remainder', '7 % 2']
        ]
      },
      {
        type: 'code',
        title: 'Calculate a total',
        language: 'javascript',
        code: `const price = 18;
const quantity = 3;
const discount = 5;

const total = price * quantity - discount;
console.log(total);`
      },
      { type: 'h2', text: 'Assignment and comparison' },
      { type: 'p', text: 'Assignment stores a value. Comparison checks values and returns true or false, which is important for decisions.' },
      {
        type: 'code',
        title: 'Compare values',
        language: 'javascript',
        code: `let cartItems = 2;
cartItems = cartItems + 1;

const hasEnoughForDiscount = cartItems >= 3;
console.log(hasEnoughForDiscount);`
      },
      {
        type: 'table',
        headers: ['Operator', 'Meaning'],
        rows: [
          ['=', 'Assign a value'],
          ['===', 'Equal value and type'],
          ['!==', 'Not equal value or type'],
          ['>', 'Greater than'],
          ['<=', 'Less than or equal to']
        ]
      },
      { type: 'h2', text: 'Logical operators' },
      { type: 'p', text: 'Logical operators combine boolean expressions. They help answer questions like: is the user logged in and is the form valid?' },
      {
        type: 'code',
        title: 'Combine conditions',
        language: 'javascript',
        code: `const isLoggedIn = true;
const hasAcceptedTerms = true;

const canContinue = isLoggedIn && hasAcceptedTerms;
console.log(canContinue);`
      },
      { type: 'tip', text: 'Use === instead of == in beginner code because it avoids surprising type conversion.' },
      { type: 'try', text: 'Create a price, quantity, and coupon value. Calculate a final total and check whether the total is greater than 50.' },
      { type: 'keypoints', items: ['Operators perform actions on values.', 'Arithmetic operators calculate numbers.', 'Comparison operators return booleans.', 'Logical operators combine conditions.', 'Use === for strict equality.'] }
    ]
  },
  {
    slug: 'js-strings',
    title: 'Strings',
    description: 'Learn how JavaScript stores and combines text with strings.',
    level: 'beginner',
    section: 'Working with Data',
    order: 10,
    minutes: 9,
    content: [
      { type: 'p', text: 'A string is text inside quotes. JavaScript uses strings for names, labels, messages, emails, button text, and many other pieces of page content.' },
      { type: 'h2', text: 'Creating strings' },
      { type: 'p', text: 'You can create strings with single quotes or double quotes. Choose one style and use it consistently in a file.' },
      {
        type: 'code',
        title: 'String examples',
        language: 'javascript',
        code: `const firstName = 'Lena';
const buttonLabel = 'Save changes';
const email = 'lena@example.com';

console.log(firstName);
console.log(buttonLabel);
console.log(email);`
      },
      { type: 'h2', text: 'Joining strings' },
      { type: 'p', text: 'Joining strings is called concatenation. It lets you build messages from smaller pieces of text and values.' },
      {
        type: 'code',
        title: 'Concatenate strings',
        language: 'javascript',
        code: `const firstName = 'Lena';
const lastName = 'Park';
const fullName = firstName + ' ' + lastName;

console.log('Welcome, ' + fullName + '!');`
      },
      { type: 'h2', text: 'String length' },
      { type: 'p', text: 'Every string has a length property that tells you how many characters are in it. This is useful for simple form checks.' },
      {
        type: 'code',
        title: 'Check length',
        language: 'javascript',
        code: `const password = 'sunnyday';

console.log(password.length);
console.log(password.length >= 8);`
      },
      { type: 'note', text: 'Spaces count as characters in a string. The string "Hi there" has 8 characters because the space is included.' },
      { type: 'try', text: 'Create firstName and favoriteColor variables, then build a sentence like "Noah likes green" and log it.' },
      { type: 'keypoints', items: ['Strings store text.', 'Use quotes to create string values.', 'Use + to concatenate strings.', 'The length property counts characters.', 'Strings are common when working with page text and forms.'] }
    ]
  },
  {
    slug: 'js-string-methods',
    title: 'String Methods',
    description: 'Learn useful string methods for cleaning, searching, and changing text.',
    level: 'beginner',
    section: 'Working with Data',
    order: 11,
    minutes: 10,
    content: [
      { type: 'p', text: 'String methods are built-in actions you can call on strings. They help you clean user input, search text, and display text consistently.' },
      { type: 'h2', text: 'Changing case' },
      { type: 'p', text: 'toUpperCase and toLowerCase return new strings with changed letter case. This is useful when comparing input or formatting labels.' },
      {
        type: 'code',
        title: 'Uppercase and lowercase',
        language: 'javascript',
        code: `const city = 'London';

console.log(city.toUpperCase());
console.log(city.toLowerCase());`
      },
      { type: 'h2', text: 'Cleaning whitespace' },
      { type: 'p', text: 'Users often type extra spaces into form fields. trim removes spaces from the beginning and end of a string.' },
      {
        type: 'code',
        title: 'Trim user input',
        language: 'javascript',
        code: `const typedName = '  Sam Lee  ';
const cleanName = typedName.trim();

console.log(cleanName);`
      },
      { type: 'h2', text: 'Searching strings' },
      { type: 'p', text: 'includes checks whether a string contains another string. startsWith and endsWith check the beginning or end.' },
      {
        type: 'code',
        title: 'Search inside text',
        language: 'javascript',
        code: `const email = 'student@example.com';

console.log(email.includes('@'));
console.log(email.endsWith('.com'));`
      },
      {
        type: 'table',
        headers: ['Method', 'What it returns'],
        rows: [
          ['toUpperCase()', 'A new uppercase string'],
          ['toLowerCase()', 'A new lowercase string'],
          ['trim()', 'A new string without outer spaces'],
          ['includes(text)', 'true or false'],
          ['replace(old, new)', 'A new string with a replacement']
        ]
      },
      {
        type: 'code',
        title: 'Replace text',
        language: 'javascript',
        code: `const message = 'Your order is pending';
const updatedMessage = message.replace('pending', 'confirmed');

console.log(updatedMessage);`
      },
      { type: 'tip', text: 'String methods usually return a new string. The original string value does not change unless you store the result.' },
      { type: 'try', text: 'Create an email string with spaces around it. Trim it, convert it to lowercase, and check whether it includes @.' },
      { type: 'keypoints', items: ['String methods are built-in tools for text.', 'Use trim to clean form input.', 'Use case methods to format or compare text.', 'Use includes, startsWith, and endsWith to search strings.', 'Most string methods return a new string.'] }
    ]
  },
  {
    slug: 'js-numbers',
    title: 'Numbers & Math Basics',
    description: 'Learn how JavaScript works with numbers, calculations, and common Math helpers.',
    level: 'beginner',
    section: 'Working with Data',
    order: 12,
    minutes: 10,
    content: [
      { type: 'p', text: 'JavaScript uses the number type for both whole numbers and decimals. Numbers are used for prices, sizes, scores, ratings, positions, and many calculations.' },
      { type: 'h2', text: 'Basic calculations' },
      { type: 'p', text: 'You can calculate with numbers using arithmetic operators. Parentheses help control which operation happens first.' },
      {
        type: 'code',
        title: 'Calculate checkout total',
        language: 'javascript',
        code: `const price = 19.99;
const quantity = 2;
const shipping = 4.5;

const total = price * quantity + shipping;
console.log(total);`
      },
      { type: 'h2', text: 'Rounding numbers' },
      { type: 'p', text: 'Real calculations often produce long decimals. Math.round, Math.floor, and Math.ceil help round numbers in different ways.' },
      {
        type: 'code',
        title: 'Round values',
        language: 'javascript',
        code: `const rating = 4.6;

console.log(Math.round(rating));
console.log(Math.floor(rating));
console.log(Math.ceil(rating));`
      },
      {
        type: 'table',
        headers: ['Method', 'Result idea'],
        rows: [
          ['Math.round(4.6)', '5'],
          ['Math.floor(4.6)', '4'],
          ['Math.ceil(4.1)', '5'],
          ['Math.max(3, 9)', '9'],
          ['Math.min(3, 9)', '3']
        ]
      },
      { type: 'h2', text: 'Formatting decimals' },
      { type: 'p', text: 'toFixed returns a string with a fixed number of decimal places. It is common when displaying money.' },
      {
        type: 'code',
        title: 'Show money format',
        language: 'javascript',
        code: `const subtotal = 29.5;
const tax = 2.36;
const total = subtotal + tax;

console.log('$' + total.toFixed(2));`
      },
      { type: 'warning', text: 'Decimal math can sometimes produce tiny precision differences. Always format money for display instead of showing raw calculation results.' },
      { type: 'try', text: 'Calculate the total for three items priced at 7.99 each, add 2.5 for shipping, and display the result with two decimal places.' },
      { type: 'keypoints', items: ['JavaScript has one main number type.', 'Use arithmetic operators for calculations.', 'Math helpers round and compare numbers.', 'toFixed is useful when displaying currency-like values.', 'Parentheses make calculation order clear.'] }
    ]
  },
  {
    slug: 'js-booleans',
    title: 'Booleans & Comparisons',
    description: 'Learn how true and false values help JavaScript make decisions.',
    level: 'beginner',
    section: 'Working with Data',
    order: 13,
    minutes: 9,
    content: [
      { type: 'p', text: 'A boolean has only two possible values: true or false. Booleans are the foundation of decisions in JavaScript.' },
      { type: 'h2', text: 'Boolean variables' },
      { type: 'p', text: 'Boolean variable names often start with words like is, has, or can because they answer a yes-or-no question.' },
      {
        type: 'code',
        title: 'Boolean names',
        language: 'javascript',
        code: `const isLoggedIn = true;
const hasDiscount = false;
const canCheckout = true;

console.log(isLoggedIn);`
      },
      { type: 'h2', text: 'Comparisons create booleans' },
      { type: 'p', text: 'A comparison checks two values and returns true or false. This result can be stored or used directly in an if statement.' },
      {
        type: 'code',
        title: 'Compare numbers and strings',
        language: 'javascript',
        code: `const age = 17;
const password = 'sunnyday';

console.log(age >= 18);
console.log(password.length >= 8);
console.log(password === 'sunnyday');`
      },
      {
        type: 'table',
        headers: ['Expression', 'Meaning'],
        rows: [
          ['age >= 18', 'Is age at least 18?'],
          ['name === "Ava"', 'Is name exactly Ava?'],
          ['items !== 0', 'Are items not zero?'],
          ['total < 100', 'Is total less than 100?']
        ]
      },
      { type: 'h2', text: 'Combining boolean expressions' },
      { type: 'p', text: 'Use && for and, || for or, and ! for not. These operators let you build more realistic checks.' },
      {
        type: 'code',
        title: 'Combine checks',
        language: 'javascript',
        code: `const isLoggedIn = true;
const cartItems = 2;

const canCheckout = isLoggedIn && cartItems > 0;
console.log(canCheckout);`
      },
      { type: 'tip', text: 'Read boolean expressions like questions. If the question sounds clear, the code is usually easier to understand.' },
      { type: 'try', text: 'Create a password variable and a hasAcceptedTerms boolean. Check whether the password is at least 8 characters and terms are accepted.' },
      { type: 'keypoints', items: ['Booleans are true or false values.', 'Comparisons return booleans.', 'Boolean names should read like yes-or-no questions.', '&& means and, || means or, and ! means not.', 'Booleans drive if statements and form validation.'] }
    ]
  },
  {
    slug: 'js-type-conversion',
    title: 'Type Conversion',
    description: 'Learn how and why JavaScript values are converted from one type to another.',
    level: 'beginner',
    section: 'Working with Data',
    order: 14,
    minutes: 10,
    content: [
      { type: 'p', text: 'Type conversion means changing a value from one data type to another. This matters because form values often arrive as strings, even when they look like numbers.' },
      { type: 'h2', text: 'Convert strings to numbers' },
      { type: 'p', text: 'If a user types 5 into an input, JavaScript often receives the value as the string "5". Convert it before doing math.' },
      {
        type: 'code',
        title: 'Number conversion',
        language: 'javascript',
        code: `const quantityInput = '5';
const quantity = Number(quantityInput);

console.log(quantity + 2);`
      },
      { type: 'h2', text: 'Convert numbers to strings' },
      { type: 'p', text: 'When displaying values in messages, JavaScript can join strings and numbers. You can also explicitly convert numbers with String.' },
      {
        type: 'code',
        title: 'String conversion',
        language: 'javascript',
        code: `const points = 120;
const message = 'You have ' + String(points) + ' points.';

console.log(message);`
      },
      { type: 'h2', text: 'Truthy and falsy values' },
      { type: 'p', text: 'JavaScript can convert values to booleans in conditions. Some values act like false, and most other values act like true.' },
      {
        type: 'table',
        headers: ['Falsy value', 'Meaning'],
        rows: [
          ['false', 'The boolean false'],
          ['0', 'The number zero'],
          ['""', 'An empty string'],
          ['null', 'Intentionally empty'],
          ['undefined', 'No value assigned'],
          ['NaN', 'Not a valid number']
        ]
      },
      {
        type: 'code',
        title: 'Check an empty input',
        language: 'javascript',
        code: `const nameInput = '';

if (nameInput) {
  console.log('Name was entered');
} else {
  console.log('Name is missing');
}`
      },
      { type: 'warning', text: 'Avoid relying on hidden conversion when doing important checks. Convert values clearly so your code says what you mean.' },
      { type: 'try', text: 'Start with the string "12.50", convert it to a number, add 3.25, and display the result as a price with two decimals.' },
      { type: 'keypoints', items: ['Type conversion changes a value from one type to another.', 'Use Number to convert numeric strings before math.', 'Use String when you want an explicit text value.', 'Form input values are commonly strings.', 'Truthy and falsy values affect conditions.'] }
    ]
  },
  {
    slug: 'js-if-else',
    title: 'if, else & else if',
    description: 'Learn how JavaScript chooses between different paths with if statements.',
    level: 'beginner',
    section: 'Control Flow',
    order: 15,
    minutes: 10,
    content: [
      { type: 'p', text: 'Control flow is the order in which code runs. if statements let JavaScript run code only when a condition is true.' },
      { type: 'h2', text: 'The if statement' },
      { type: 'p', text: 'An if statement checks a condition inside parentheses. If the condition is true, the code inside the curly braces runs.' },
      {
        type: 'code',
        title: 'Run code conditionally',
        language: 'javascript',
        code: `const cartItems = 2;

if (cartItems > 0) {
  console.log('Show checkout button');
}`
      },
      { type: 'h2', text: 'Adding else' },
      { type: 'p', text: 'else gives JavaScript a backup path when the if condition is false. This is useful for messages like success or error, available or sold out.' },
      {
        type: 'code',
        title: 'Use else for a backup path',
        language: 'javascript',
        code: `const isLoggedIn = false;

if (isLoggedIn) {
  console.log('Welcome back!');
} else {
  console.log('Please sign in.');
}`
      },
      { type: 'h2', text: 'Checking multiple conditions' },
      { type: 'p', text: 'Use else if when you have more than two possible outcomes. JavaScript checks each condition from top to bottom and runs the first matching block.' },
      {
        type: 'code',
        title: 'Use else if',
        language: 'javascript',
        code: `const score = 84;

if (score >= 90) {
  console.log('Excellent');
} else if (score >= 70) {
  console.log('Good job');
} else {
  console.log('Keep practicing');
}`
      },
      { type: 'tip', text: 'Put the most specific or highest-priority condition first when using else if.' },
      { type: 'try', text: 'Write an if, else if, else chain that shows "Free shipping" when total is at least 50, "Almost there" when total is at least 40, and "Shipping added" otherwise.' },
      { type: 'keypoints', items: ['if runs code only when a condition is true.', 'else handles the false case.', 'else if checks additional conditions.', 'Conditions are checked from top to bottom.', 'Control flow helps pages respond to data and user choices.'] }
    ]
  },
  {
    slug: 'js-switch',
    title: 'Switch Statements',
    description: 'Learn how switch statements select behavior from several exact choices.',
    level: 'beginner',
    section: 'Control Flow',
    order: 16,
    minutes: 8,
    content: [
      { type: 'p', text: 'A switch statement compares one value against several possible cases. It is useful when one variable can have a known set of exact values.' },
      { type: 'h2', text: 'Basic switch syntax' },
      { type: 'p', text: 'Each case checks for one matching value. The break statement stops JavaScript from continuing into the next case.' },
      {
        type: 'code',
        title: 'Choose a shipping message',
        language: 'javascript',
        code: `const shippingMethod = 'express';

switch (shippingMethod) {
  case 'standard':
    console.log('Arrives in 5 to 7 days');
    break;
  case 'express':
    console.log('Arrives in 2 days');
    break;
  default:
    console.log('Choose a shipping method');
}`
      },
      { type: 'h2', text: 'The default case' },
      { type: 'p', text: 'default runs when no case matches. It is like the else at the end of an if chain.' },
      {
        type: 'code',
        title: 'Use default for unknown values',
        language: 'javascript',
        code: `const theme = 'purple';

switch (theme) {
  case 'light':
    console.log('Use light colors');
    break;
  case 'dark':
    console.log('Use dark colors');
    break;
  default:
    console.log('Use the system theme');
}`
      },
      { type: 'h2', text: 'When to use switch' },
      { type: 'p', text: 'Use switch when you compare the same value to many exact options. Use if statements when conditions involve ranges or more complex logic.' },
      {
        type: 'table',
        headers: ['Use if', 'Use switch'],
        rows: [
          ['age >= 18', "role is 'admin', 'editor', or 'viewer'"],
          ['total > 100 && isMember', "status is 'pending', 'paid', or 'failed'"]
        ]
      },
      { type: 'warning', text: 'Forgetting break can make JavaScript continue into the next case, which often causes bugs for beginners.' },
      { type: 'try', text: 'Create a switch for a user role of admin, editor, viewer, and a default guest message.' },
      { type: 'keypoints', items: ['switch compares one value against multiple cases.', 'case handles one exact match.', 'break stops the switch from falling through.', 'default handles unmatched values.', 'Use switch for clean exact-choice logic.'] }
    ]
  },
  {
    slug: 'js-loops',
    title: 'Loops (for, while, do...while)',
    description: 'Learn how loops repeat JavaScript code without writing the same statements again and again.',
    level: 'beginner',
    section: 'Control Flow',
    order: 17,
    minutes: 12,
    content: [
      { type: 'p', text: 'A loop repeats code. Loops are helpful when you need to process a list, count steps, retry a task, or create repeated page content.' },
      { type: 'h2', text: 'for loops' },
      { type: 'p', text: 'A for loop is useful when you know how many times the loop should run. It has a starting value, a condition, and an update.' },
      {
        type: 'code',
        title: 'Count with a for loop',
        language: 'javascript',
        code: `for (let count = 1; count <= 5; count = count + 1) {
  console.log('Step ' + count);
}`
      },
      { type: 'h2', text: 'Looping through arrays' },
      { type: 'p', text: 'One of the most common beginner uses for loops is reading each item in an array.' },
      {
        type: 'code',
        title: 'Read every array item',
        language: 'javascript',
        code: `const tasks = ['Plan', 'Build', 'Test'];

for (let index = 0; index < tasks.length; index = index + 1) {
  console.log(tasks[index]);
}`
      },
      { type: 'h2', text: 'while and do...while loops' },
      { type: 'p', text: 'A while loop repeats while a condition is true. A do...while loop runs at least once before checking the condition.' },
      {
        type: 'code',
        title: 'while loop',
        language: 'javascript',
        code: `let tries = 0;

while (tries < 3) {
  console.log('Try number ' + tries);
  tries = tries + 1;
}`
      },
      {
        type: 'code',
        title: 'do...while loop',
        language: 'javascript',
        code: `let answer = '';

do {
  answer = 'yes';
  console.log('Ask the question once');
} while (answer === '');`
      },
      { type: 'warning', text: 'Make sure a loop condition eventually becomes false. Otherwise, you create an infinite loop that can freeze the page.' },
      { type: 'try', text: 'Create an array of three product names and use a for loop to log "Product: " plus each name.' },
      { type: 'keypoints', items: ['Loops repeat code.', 'for loops are great when you know the count or are using indexes.', 'while loops repeat while a condition remains true.', 'do...while loops run at least once.', 'Always update loop values so loops can end.'] }
    ]
  },
  {
    slug: 'js-arrays',
    title: 'Arrays',
    description: 'Learn how arrays store ordered lists of values in JavaScript.',
    level: 'beginner',
    section: 'Collections',
    order: 18,
    minutes: 10,
    content: [
      { type: 'p', text: 'An array stores a list of values in one variable. Arrays are perfect for product names, menu items, tasks, messages, and search results.' },
      { type: 'h2', text: 'Creating arrays' },
      { type: 'p', text: 'Create an array with square brackets. Separate each item with a comma.' },
      {
        type: 'code',
        title: 'Array of products',
        language: 'javascript',
        code: `const products = ['Laptop', 'Mouse', 'Keyboard'];

console.log(products);`
      },
      { type: 'h2', text: 'Array indexes' },
      { type: 'p', text: 'Array positions start at 0, not 1. The first item is index 0, the second item is index 1, and so on.' },
      {
        type: 'code',
        title: 'Read array items',
        language: 'javascript',
        code: `const colors = ['red', 'green', 'blue'];

console.log(colors[0]);
console.log(colors[1]);
console.log(colors[2]);`
      },
      { type: 'h2', text: 'Changing arrays' },
      { type: 'p', text: 'Arrays can change over time. You can update an item by assigning a new value at its index.' },
      {
        type: 'code',
        title: 'Update an array item',
        language: 'javascript',
        code: `const cart = ['Book', 'Pen', 'Bag'];

cart[1] = 'Notebook';

console.log(cart);`
      },
      {
        type: 'table',
        headers: ['Expression', 'Meaning'],
        rows: [
          ['items[0]', 'First item'],
          ['items.length', 'Number of items'],
          ['items[items.length - 1]', 'Last item']
        ]
      },
      { type: 'note', text: 'An array can be stored in a const variable and still have its items changed. const prevents reassigning the variable name, not changing the array contents.' },
      { type: 'try', text: 'Create an array of three favorite websites. Log the first item, the last item, and the total length.' },
      { type: 'keypoints', items: ['Arrays store ordered lists.', 'Array indexes start at 0.', 'Use square brackets to read or update an item.', 'length tells you how many items are in an array.', 'Arrays are common when rendering repeated page content.'] }
    ]
  },
  {
    slug: 'js-array-basics',
    title: 'Array Methods (Basics)',
    description: 'Learn basic array methods for adding, removing, finding, and transforming list items.',
    level: 'beginner',
    section: 'Collections',
    order: 19,
    minutes: 12,
    content: [
      { type: 'p', text: 'Array methods are built-in actions for working with lists. They make common tasks easier than writing everything from scratch.' },
      { type: 'h2', text: 'Adding and removing items' },
      { type: 'p', text: 'push adds an item to the end of an array. pop removes the last item. These are common for carts, queues, and dynamic lists.' },
      {
        type: 'code',
        title: 'push and pop',
        language: 'javascript',
        code: `const cart = ['Shirt', 'Hat'];

cart.push('Socks');
console.log(cart);

const removedItem = cart.pop();
console.log(removedItem);
console.log(cart);`
      },
      { type: 'h2', text: 'Finding and checking items' },
      { type: 'p', text: 'includes checks whether an array contains a value. indexOf returns the index of a value or -1 when the value is not found.' },
      {
        type: 'code',
        title: 'includes and indexOf',
        language: 'javascript',
        code: `const tags = ['new', 'sale', 'popular'];

console.log(tags.includes('sale'));
console.log(tags.indexOf('popular'));
console.log(tags.indexOf('featured'));`
      },
      { type: 'h2', text: 'Transforming arrays' },
      { type: 'p', text: 'map creates a new array by transforming each item. This is very useful in frontend work when creating display labels from data.' },
      {
        type: 'code',
        title: 'Create display labels with map',
        language: 'javascript',
        code: `const prices = [10, 20, 30];

const labels = prices.map(function (price) {
  return '$' + price;
});

console.log(labels);`
      },
      {
        type: 'table',
        headers: ['Method', 'What it does'],
        rows: [
          ['push(item)', 'Adds to the end'],
          ['pop()', 'Removes from the end'],
          ['includes(item)', 'Checks for a value'],
          ['indexOf(item)', 'Finds the index or returns -1'],
          ['map(callback)', 'Creates a transformed array']
        ]
      },
      { type: 'tip', text: 'Some array methods change the original array, like push and pop. Others return a new array, like map.' },
      { type: 'try', text: 'Create an array of usernames, add one name, check if your name is included, then use map to create greeting messages.' },
      { type: 'keypoints', items: ['Array methods are built-in tools for lists.', 'push and pop change the original array.', 'includes and indexOf help search arrays.', 'map returns a new transformed array.', 'Array methods are heavily used in frontend interfaces.'] }
    ]
  },
  {
    slug: 'js-objects',
    title: 'Objects',
    description: 'Learn how objects group related information using properties and values.',
    level: 'beginner',
    section: 'Collections',
    order: 20,
    minutes: 10,
    content: [
      { type: 'p', text: 'An object stores related data together. Objects are useful for users, products, settings, form values, and almost any real-world thing in an app.' },
      { type: 'h2', text: 'Creating objects' },
      { type: 'p', text: 'Objects use curly braces. Each property has a name, a colon, and a value.' },
      {
        type: 'code',
        title: 'Product object',
        language: 'javascript',
        code: `const product = {
  name: 'Desk Lamp',
  price: 34.99,
  inStock: true
};

console.log(product);`
      },
      { type: 'h2', text: 'Reading object properties' },
      { type: 'p', text: 'Use dot notation to read common property names. Dot notation is clear and beginner-friendly.' },
      {
        type: 'code',
        title: 'Read properties',
        language: 'javascript',
        code: `const user = {
  firstName: 'Ivy',
  email: 'ivy@example.com',
  isMember: true
};

console.log(user.firstName);
console.log(user.email);`
      },
      { type: 'h2', text: 'Updating objects' },
      { type: 'p', text: 'You can update a property by assigning a new value. This is common when a user edits a profile or changes a setting.' },
      {
        type: 'code',
        title: 'Update a property',
        language: 'javascript',
        code: `const settings = {
  theme: 'light',
  notifications: true
};

settings.theme = 'dark';

console.log(settings.theme);`
      },
      {
        type: 'table',
        headers: ['Concept', 'Example'],
        rows: [
          ['Object', 'A group of related values'],
          ['Property', 'name, price, or email'],
          ['Value', "'Desk Lamp' or 34.99"],
          ['Dot notation', 'product.name']
        ]
      },
      { type: 'note', text: 'Objects and arrays often work together. For example, an array of product objects can represent a product list on a shopping page.' },
      { type: 'try', text: 'Create a profile object with name, age, and city. Log one property, update the city, and log the object again.' },
      { type: 'keypoints', items: ['Objects group related data.', 'Properties have names and values.', 'Dot notation reads and updates properties.', 'Objects model real app data like users and products.', 'Arrays and objects are often combined.'] }
    ]
  },
  {
    slug: 'js-functions',
    title: 'Functions',
    description: 'Learn how functions package reusable JavaScript steps under one name.',
    level: 'beginner',
    section: 'Functions & Scope',
    order: 21,
    minutes: 11,
    content: [
      { type: 'p', text: 'A function is a reusable block of code. Instead of repeating the same steps, you put them in a function and call that function when needed.' },
      { type: 'h2', text: 'Declaring and calling functions' },
      { type: 'p', text: 'A function declaration uses the function keyword, a name, parentheses, and a block of code. The code runs when you call the function.' },
      {
        type: 'code',
        title: 'A simple function',
        language: 'javascript',
        code: `function showWelcome() {
  console.log('Welcome to the dashboard!');
}

showWelcome();`
      },
      { type: 'h2', text: 'Parameters and arguments' },
      { type: 'p', text: 'Parameters are placeholders listed in the function definition. Arguments are the real values you pass when calling the function.' },
      {
        type: 'code',
        title: 'Function with a parameter',
        language: 'javascript',
        code: `function greetUser(name) {
  console.log('Hello, ' + name + '!');
}

greetUser('Mina');
greetUser('Leo');`
      },
      { type: 'h2', text: 'Returning values' },
      { type: 'p', text: 'return sends a value back to the place where the function was called. This lets functions calculate results without directly logging them.' },
      {
        type: 'code',
        title: 'Return a calculated value',
        language: 'javascript',
        code: `function calculateTotal(price, quantity) {
  return price * quantity;
}

const total = calculateTotal(12, 3);
console.log(total);`
      },
      {
        type: 'table',
        headers: ['Term', 'Meaning'],
        rows: [
          ['Function', 'Reusable block of code'],
          ['Parameter', 'Named input in a function'],
          ['Argument', 'Actual value passed into a function'],
          ['Return value', 'Result sent back by a function']
        ]
      },
      { type: 'tip', text: 'Name functions with verbs, such as calculateTotal, showMessage, validateEmail, or updateCart.' },
      { type: 'try', text: 'Write a function named formatPrice that takes a number and returns a string with a dollar sign and two decimal places.' },
      { type: 'keypoints', items: ['Functions make code reusable.', 'Call a function to run its code.', 'Parameters let functions accept input.', 'return sends a result back.', 'Good function names describe an action.'] }
    ]
  },
  {
    slug: 'js-scope',
    title: 'Scope',
    description: 'Learn where variables can be accessed in JavaScript code.',
    level: 'beginner',
    section: 'Functions & Scope',
    order: 22,
    minutes: 9,
    content: [
      { type: 'p', text: 'Scope describes where a variable is available. Understanding scope helps you avoid confusing bugs and name conflicts.' },
      { type: 'h2', text: 'Global scope' },
      { type: 'p', text: 'A variable declared outside functions and blocks is in the global scope. It can be accessed from many places, which can be useful but also risky in large codebases.' },
      {
        type: 'code',
        title: 'Global variable',
        language: 'javascript',
        code: `const appName = 'Budget Tracker';

function showAppName() {
  console.log(appName);
}

showAppName();`
      },
      { type: 'h2', text: 'Function scope' },
      { type: 'p', text: 'Variables declared inside a function are available only inside that function. This keeps temporary values private to the function.' },
      {
        type: 'code',
        title: 'Function scope',
        language: 'javascript',
        code: `function calculateTax(price) {
  const taxRate = 0.08;
  return price * taxRate;
}

console.log(calculateTax(50));`
      },
      { type: 'h2', text: 'Block scope' },
      { type: 'p', text: 'let and const are block scoped. A block is usually code inside curly braces, such as an if statement or loop.' },
      {
        type: 'code',
        title: 'Block scoped variable',
        language: 'javascript',
        code: `const isMember = true;

if (isMember) {
  const discount = 10;
  console.log('Discount: ' + discount);
}`
      },
      { type: 'warning', text: 'Avoid creating many global variables. They can accidentally conflict with other scripts on the same page.' },
      { type: 'tip', text: 'Declare variables as close as possible to where they are used. This makes scope easier to understand.' },
      { type: 'try', text: 'Write a function that declares a local message variable and logs it. Then explain why code outside the function should not use that variable.' },
      { type: 'keypoints', items: ['Scope controls where variables can be accessed.', 'Global variables are available broadly.', 'Function variables stay inside the function.', 'let and const are block scoped.', 'Smaller scopes make code safer and easier to read.'] }
    ]
  },
  {
    slug: 'js-dom-intro',
    title: 'DOM Introduction',
    description: 'Learn what the DOM is and how JavaScript uses it to work with web pages.',
    level: 'beginner',
    section: 'Browser & DOM',
    order: 23,
    minutes: 10,
    content: [
      { type: 'p', text: 'The DOM, or Document Object Model, is the browser\'s representation of an HTML page. JavaScript uses the DOM to read and change what users see.' },
      { type: 'h2', text: 'HTML becomes a document tree' },
      { type: 'p', text: 'When a browser loads HTML, it creates objects for the document, elements, text, attributes, and more. These objects are arranged like a tree.' },
      {
        type: 'code',
        title: 'HTML on the page',
        language: 'html',
        code: `<main>
  <h1>Shopping List</h1>
  <ul>
    <li>Apples</li>
    <li>Bread</li>
  </ul>
</main>`
      },
      { type: 'p', text: 'JavaScript can select these elements, read their text, change their styles, add new elements, and respond to events.' },
      { type: 'h2', text: 'The document object' },
      { type: 'p', text: 'In browser JavaScript, document represents the current web page. Many DOM tasks start with document.' },
      {
        type: 'code',
        title: 'Read the page title',
        language: 'javascript',
        code: `console.log(document.title);`
      },
      { type: 'h2', text: 'Why the DOM matters' },
      { type: 'p', text: 'Frontend JavaScript is often about connecting data and user actions to the DOM. When a user clicks a button, JavaScript can update the DOM to show the result.' },
      {
        type: 'code',
        title: 'Change a heading',
        language: 'html',
        code: `<h1 id="pageTitle">Welcome</h1>

<script>
  document.getElementById('pageTitle').textContent = 'Welcome back!';
</script>`
      },
      { type: 'note', text: 'The DOM is not the same as the original HTML file. It is the live page structure the browser creates and JavaScript can update.' },
      { type: 'try', text: 'Open any simple HTML page in the browser, inspect it with developer tools, and identify the document, body, and one element node.' },
      { type: 'keypoints', items: ['The DOM is the browser\'s live model of a page.', 'JavaScript uses document to access the DOM.', 'DOM elements can be read and changed.', 'Frontend interactivity often means responding to events and updating the DOM.', 'The DOM can differ from the original HTML after JavaScript runs.'] }
    ]
  },
  {
    slug: 'js-dom-select',
    title: 'Selecting Elements',
    description: 'Learn how JavaScript finds HTML elements before reading or changing them.',
    level: 'beginner',
    section: 'Browser & DOM',
    order: 24,
    minutes: 10,
    content: [
      { type: 'p', text: 'Before JavaScript can change an element, it must select it. Selecting means finding an element in the DOM and storing a reference to it.' },
      { type: 'h2', text: 'Select by id' },
      { type: 'p', text: 'getElementById finds one element with a matching id. An id should be unique on the page.' },
      {
        type: 'code',
        title: 'Select an element by id',
        language: 'html',
        code: `<h1 id="mainTitle">Products</h1>

<script>
  const title = document.getElementById('mainTitle');
  console.log(title.textContent);
</script>`
      },
      { type: 'h2', text: 'Select with CSS selectors' },
      { type: 'p', text: 'querySelector uses CSS selector syntax and returns the first matching element. querySelectorAll returns all matching elements.' },
      {
        type: 'code',
        title: 'querySelector and querySelectorAll',
        language: 'html',
        code: `<button class="filter-button">All</button>
<button class="filter-button">Sale</button>

<script>
  const firstButton = document.querySelector('.filter-button');
  const allButtons = document.querySelectorAll('.filter-button');

  console.log(firstButton.textContent);
  console.log(allButtons.length);
</script>`
      },
      {
        type: 'table',
        headers: ['Method', 'Returns'],
        rows: [
          ['getElementById("id")', 'One element or null'],
          ['querySelector(".class")', 'First matching element or null'],
          ['querySelectorAll(".class")', 'A list of matching elements']
        ]
      },
      { type: 'h2', text: 'Store selections in variables' },
      { type: 'p', text: 'Storing a selected element in a variable lets you use it more than once without searching the DOM again.' },
      {
        type: 'code',
        title: 'Reuse a selected element',
        language: 'javascript',
        code: `const message = document.querySelector('#message');

message.textContent = 'Ready';
message.classList.add('success');`
      },
      { type: 'warning', text: 'If a selector does not match anything, many selection methods return null. Trying to use null like an element causes an error.' },
      { type: 'try', text: 'Create an HTML button with an id, select it with JavaScript, and log its textContent.' },
      { type: 'keypoints', items: ['Select elements before reading or changing them.', 'getElementById finds one unique id.', 'querySelector uses CSS selector syntax.', 'querySelectorAll returns a list of matches.', 'A missing element can return null.'] }
    ]
  },
  {
    slug: 'js-dom-change',
    title: 'Changing the DOM',
    description: 'Learn how JavaScript changes page text, classes, attributes, and elements.',
    level: 'beginner',
    section: 'Browser & DOM',
    order: 25,
    minutes: 11,
    content: [
      { type: 'p', text: 'Changing the DOM means updating the live page after it loads. This is how JavaScript shows messages, updates buttons, displays errors, and creates dynamic interfaces.' },
      { type: 'h2', text: 'Change text content' },
      { type: 'p', text: 'textContent sets or reads the text inside an element. It is a safe choice when you want to show plain text.' },
      {
        type: 'code',
        title: 'Update text',
        language: 'html',
        code: `<p id="status">Saving...</p>

<script>
  const status = document.getElementById('status');
  status.textContent = 'Saved successfully';
</script>`
      },
      { type: 'h2', text: 'Change classes and attributes' },
      { type: 'p', text: 'Classes usually control styling, so classList is a common way to change how an element looks. Attributes store extra element information, such as disabled, src, href, or alt.' },
      {
        type: 'code',
        title: 'Use classList and attributes',
        language: 'html',
        code: `<button id="submitButton">Submit</button>

<script>
  const button = document.getElementById('submitButton');

  button.classList.add('primary');
  button.setAttribute('disabled', '');
  button.textContent = 'Submitting...';
</script>`
      },
      { type: 'h2', text: 'Create and add elements' },
      { type: 'p', text: 'JavaScript can create new elements and add them to the page. This is useful for lists, search results, notifications, and comments.' },
      {
        type: 'code',
        title: 'Create a list item',
        language: 'html',
        code: `<ul id="tasks"></ul>

<script>
  const tasks = document.getElementById('tasks');
  const item = document.createElement('li');

  item.textContent = 'Review JavaScript notes';
  tasks.appendChild(item);
</script>`
      },
      {
        type: 'table',
        headers: ['DOM feature', 'Use'],
        rows: [
          ['textContent', 'Read or set plain text'],
          ['classList.add', 'Add a CSS class'],
          ['classList.remove', 'Remove a CSS class'],
          ['setAttribute', 'Set an HTML attribute'],
          ['createElement', 'Create a new element']
        ]
      },
      { type: 'tip', text: 'Use textContent for user-provided text. It avoids accidentally treating text as HTML.' },
      { type: 'try', text: 'Create an empty ul and use JavaScript to add three li elements for a simple to-do list.' },
      { type: 'keypoints', items: ['JavaScript can update the live DOM.', 'textContent changes visible text safely.', 'classList changes CSS classes.', 'setAttribute changes element attributes.', 'createElement and appendChild add new content.'] }
    ]
  },
  {
    slug: 'js-events',
    title: 'Events',
    description: 'Learn how JavaScript responds when users click, type, submit, and interact with a page.',
    level: 'beginner',
    section: 'Browser & DOM',
    order: 26,
    minutes: 11,
    content: [
      { type: 'p', text: 'An event is something that happens in the browser. Common events include clicks, typing, submitting a form, loading a page, and moving the mouse.' },
      { type: 'h2', text: 'Listening for clicks' },
      { type: 'p', text: 'addEventListener tells JavaScript to run a function when a specific event happens on an element.' },
      {
        type: 'code',
        title: 'Click event',
        language: 'html',
        code: `<button id="likeButton">Like</button>
<p id="count">0 likes</p>

<script>
  const button = document.getElementById('likeButton');
  const count = document.getElementById('count');
  let likes = 0;

  button.addEventListener('click', function () {
    likes = likes + 1;
    count.textContent = likes + ' likes';
  });
</script>`
      },
      { type: 'h2', text: 'The event object' },
      { type: 'p', text: 'Event listener functions can receive an event object. It contains useful information about what happened.' },
      {
        type: 'code',
        title: 'Read input as the user types',
        language: 'html',
        code: `<input id="nameInput" placeholder="Your name">
<p id="preview"></p>

<script>
  const input = document.getElementById('nameInput');
  const preview = document.getElementById('preview');

  input.addEventListener('input', function (event) {
    preview.textContent = 'Hello, ' + event.target.value;
  });
</script>`
      },
      { type: 'h2', text: 'Common browser events' },
      {
        type: 'table',
        headers: ['Event', 'When it happens'],
        rows: [
          ['click', 'The user clicks an element'],
          ['input', 'The value of an input changes'],
          ['submit', 'A form is submitted'],
          ['change', 'A field value is committed'],
          ['keydown', 'A keyboard key is pressed']
        ]
      },
      { type: 'p', text: 'Events connect user actions to page updates. Most interactive frontend features are built from selecting elements, listening for events, and changing the DOM.' },
      { type: 'tip', text: 'Keep event listener functions short when possible. If the work grows, move the logic into a named function.' },
      { type: 'try', text: 'Create a button and paragraph. Each time the button is clicked, update the paragraph to show how many times it was clicked.' },
      { type: 'keypoints', items: ['Events are browser actions like clicks and typing.', 'addEventListener runs code when an event happens.', 'The event object gives details about the event.', 'Events often update the DOM.', 'Clicks, inputs, and submits are common beginner events.'] }
    ]
  },
  {
    slug: 'js-forms',
    title: 'Forms & Simple Validation',
    description: 'Learn how JavaScript reads form values and checks them before continuing.',
    level: 'beginner',
    section: 'Browser & DOM',
    order: 27,
    minutes: 12,
    content: [
      { type: 'p', text: 'Forms let users send information, such as names, emails, passwords, search terms, and checkout details. JavaScript can read form values and validate them before submission.' },
      { type: 'h2', text: 'Reading form values' },
      { type: 'p', text: 'Input elements have a value property. JavaScript can read that value when a user submits a form or clicks a button.' },
      {
        type: 'code',
        title: 'Read a form field',
        language: 'html',
        code: `<form id="signupForm">
  <label>
    Name
    <input id="nameInput" type="text">
  </label>
  <button type="submit">Sign up</button>
</form>
<p id="message"></p>

<script>
  const form = document.getElementById('signupForm');
  const nameInput = document.getElementById('nameInput');
  const message = document.getElementById('message');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    message.textContent = 'Hello, ' + nameInput.value;
  });
</script>`
      },
      { type: 'h2', text: 'Simple validation' },
      { type: 'p', text: 'Validation checks whether input is acceptable. Beginner validation often checks for required values, minimum lengths, and simple text patterns like an email containing @.' },
      {
        type: 'code',
        title: 'Validate name and email',
        language: 'html',
        code: `<form id="contactForm">
  <input id="contactName" type="text" placeholder="Name">
  <input id="contactEmail" type="email" placeholder="Email">
  <button type="submit">Send</button>
</form>
<p id="formMessage"></p>

<script>
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const formMessage = document.getElementById('formMessage');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (name === '') {
      formMessage.textContent = 'Please enter your name.';
    } else if (!email.includes('@')) {
      formMessage.textContent = 'Please enter a valid email.';
    } else {
      formMessage.textContent = 'Thanks, ' + name + '!';
    }
  });
</script>`
      },
      { type: 'h2', text: 'Why preventDefault matters' },
      { type: 'p', text: 'By default, submitting a form can reload the page or navigate away. event.preventDefault stops that default behavior so your JavaScript can validate and show feedback first.' },
      {
        type: 'table',
        headers: ['Validation check', 'Example'],
        rows: [
          ['Required text', "name.trim() !== ''"],
          ['Minimum length', 'password.length >= 8'],
          ['Contains symbol', "email.includes('@')"],
          ['Number range', 'age >= 13']
        ]
      },
      { type: 'warning', text: 'Client-side validation improves the user experience, but important apps must also validate on the server because browser JavaScript can be bypassed.' },
      { type: 'try', text: 'Build a form with username and password fields. On submit, show an error if the username is empty or the password has fewer than 8 characters.' },
      { type: 'keypoints', items: ['Forms collect user input.', 'Input values are read with the value property.', 'submit events let JavaScript validate forms.', 'preventDefault keeps the page from reloading while you show feedback.', 'Client-side validation helps users but does not replace server validation.'] }
    ]
  }
];
