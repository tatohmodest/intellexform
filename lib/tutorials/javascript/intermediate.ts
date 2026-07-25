import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'js-es6',
    title: 'Modern JavaScript (ES6+)',
    description:
      'Review the modern JavaScript features you will use constantly in browser code: block variables, arrow functions, template literals, and default parameters.',
    level: 'intermediate',
    section: 'Modern JavaScript',
    order: 28,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Modern JavaScript usually means the features added in ES6 and later. These features make code shorter, clearer, and easier to organize in frontend applications.',
      },
      {
        type: 'p',
        text: 'You already know let and const. In this lesson, you will connect them with other common ES6+ tools: arrow functions, template literals, and default parameters.',
      },
      { type: 'h2', text: 'Why ES6+ matters' },
      {
        type: 'ul',
        items: [
          'It reduces repetitive syntax in everyday UI code.',
          'It makes function behavior and variable scope easier to read.',
          'It is the style used by modern documentation, frameworks, and browser APIs.',
          'It helps you write code that is easier to refactor into modules later.',
        ],
      },
      { type: 'h2', text: 'A modern JavaScript example' },
      {
        type: 'code',
        language: 'javascript',
        title: 'ES6+ in a small UI helper',
        code:
          "const products = ['Keyboard', 'Mouse', 'Monitor'];\n" +
          '\n' +
          "const renderList = (items = []) => {\n" +
          "  return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;\n" +
          '};\n' +
          '\n' +
          "document.querySelector('#products').innerHTML = renderList(products);",
      },
      {
        type: 'note',
        text: 'This example uses const, a default parameter, an arrow function, template literals, and map(). You will study each of these pieces in more detail throughout the intermediate course.',
      },
      { type: 'h2', text: 'Default parameters' },
      {
        type: 'p',
        text: 'Default parameters let a function choose a safe value when an argument is missing. This is useful when a user does not enter optional data or when an API response is incomplete.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Using a default value',
        code:
          "function createGreeting(name = 'Guest') {\n" +
          "  return `Welcome, ${name}!`;\n" +
          '}\n' +
          '\n' +
          "console.log(createGreeting('Maya'));\n" +
          'console.log(createGreeting());',
      },
      {
        type: 'tip',
        text: 'Use const by default, let when the value must change, and avoid var in modern code unless you are maintaining older scripts.',
      },
      {
        type: 'try',
        text: 'Create a function named formatPrice(price, currency = "USD") that returns a friendly price label using a template literal.',
      },
      {
        type: 'keypoints',
        items: [
          'ES6+ is the everyday style of modern JavaScript.',
          'Default parameters make functions safer when arguments are optional.',
          'Arrow functions and template literals are especially common in frontend code.',
          'Modern syntax often makes intent easier to see at a glance.',
        ],
      },
    ],
  },
  {
    slug: 'js-arrow-functions',
    title: 'Arrow Functions',
    description:
      'Learn how arrow functions create shorter function expressions and how they behave differently with this.',
    level: 'intermediate',
    section: 'Modern JavaScript',
    order: 29,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Arrow functions are a shorter way to write function expressions. They are especially useful for callbacks, array methods, and small helper functions.',
      },
      { type: 'h2', text: 'Function expression vs arrow function' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Two ways to write the same callback',
        code:
          'const numbers = [1, 2, 3];\n' +
          '\n' +
          'const doubledOld = numbers.map(function (number) {\n' +
          '  return number * 2;\n' +
          '});\n' +
          '\n' +
          'const doubledNew = numbers.map(number => number * 2);\n' +
          '\n' +
          'console.log(doubledNew);',
      },
      {
        type: 'p',
        text: 'When an arrow function has one parameter, parentheses are optional. When the body is one expression, JavaScript returns that expression automatically.',
      },
      { type: 'h2', text: 'Multiple parameters and block bodies' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Arrow function variations',
        code:
          'const add = (a, b) => a + b;\n' +
          '\n' +
          'const formatUser = user => {\n' +
          '  const name = user.name.trim();\n' +
          "  return `${name} (${user.role})`;\n" +
          '};\n' +
          '\n' +
          "console.log(add(4, 6));\n" +
          "console.log(formatUser({ name: ' Lina ', role: 'admin' }));",
      },
      { type: 'h2', text: 'Arrow functions and this' },
      {
        type: 'p',
        text: 'Arrow functions do not create their own this value. They use this from the surrounding scope. That is helpful in some callbacks, but it means arrow functions are usually not the best choice for object methods.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Avoid arrows for object methods that use this',
        code:
          'const counter = {\n' +
          '  count: 0,\n' +
          '  increment() {\n' +
          '    this.count += 1;\n' +
          '    return this.count;\n' +
          '  },\n' +
          '};\n' +
          '\n' +
          'console.log(counter.increment());',
      },
      {
        type: 'warning',
        text: 'Do not automatically convert every function to an arrow function. If a method needs its own this, use regular method syntax.',
      },
      {
        type: 'try',
        text: 'Use an arrow function with filter() to create a new array containing only prices greater than 25.',
      },
      {
        type: 'keypoints',
        items: [
          'Arrow functions are concise function expressions.',
          'Single-expression arrow functions return automatically.',
          'Use parentheses for zero, two, or more parameters.',
          'Arrow functions inherit this from their surrounding scope.',
        ],
      },
    ],
  },
  {
    slug: 'js-template-literals',
    title: 'Template Literals',
    description:
      'Use backtick strings to build readable text, HTML snippets, and multiline strings.',
    level: 'intermediate',
    section: 'Modern JavaScript',
    order: 30,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Template literals are strings wrapped in backticks. They can include variables, expressions, and line breaks without heavy string concatenation.',
      },
      { type: 'h2', text: 'String interpolation' },
      {
        type: 'p',
        text: 'Interpolation means placing a value inside a string. In a template literal, use ${expression} to insert the result of an expression.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Creating a message',
        code:
          "const user = 'Ava';\n" +
          'const unread = 3;\n' +
          '\n' +
          'const message = `Hello, ${user}. You have ${unread} unread messages.`;\n' +
          '\n' +
          'console.log(message);',
      },
      { type: 'h2', text: 'Building small HTML templates' },
      {
        type: 'p',
        text: 'Frontend code often needs to create small pieces of HTML. Template literals make this easier to read than joining many string fragments.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Rendering a card',
        code:
          'const product = {\n' +
          "  name: 'Noise-Canceling Headphones',\n" +
          '  price: 149,\n' +
          '  inStock: true,\n' +
          '};\n' +
          '\n' +
          'const card = `\n' +
          '<article class="product-card">\n' +
          '  <h2>${product.name}</h2>\n' +
          '  <p>$${product.price}</p>\n' +
          '  <button>${product.inStock ? "Add to cart" : "Sold out"}</button>\n' +
          '</article>\n' +
          '`;\n' +
          '\n' +
          "document.querySelector('#featured').innerHTML = card;",
      },
      {
        type: 'warning',
        text: 'When inserting user-provided text into HTML, be careful. Setting innerHTML with unsafe text can create security problems such as cross-site scripting.',
      },
      {
        type: 'tip',
        text: 'Template literals are excellent for readable UI strings, but prefer DOM methods like textContent when displaying text from users.',
      },
      {
        type: 'try',
        text: 'Create a template literal that renders a profile summary with a name, location, and membership status.',
      },
      {
        type: 'keypoints',
        items: [
          'Template literals use backticks.',
          'Use ${expression} to insert values into a string.',
          'Template literals can span multiple lines.',
          'Avoid unsafe innerHTML when rendering user-provided content.',
        ],
      },
    ],
  },
  {
    slug: 'js-destructuring',
    title: 'Destructuring',
    description:
      'Pull values out of arrays and objects with concise destructuring syntax.',
    level: 'intermediate',
    section: 'Modern JavaScript',
    order: 31,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Destructuring lets you unpack values from arrays and objects into variables. It is common when working with API data, component props, and configuration objects.',
      },
      { type: 'h2', text: 'Object destructuring' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Reading object properties',
        code:
          'const user = {\n' +
          "  name: 'Nora',\n" +
          "  role: 'editor',\n" +
          "  city: 'Denver',\n" +
          '};\n' +
          '\n' +
          'const { name, role } = user;\n' +
          '\n' +
          'console.log(`${name} is an ${role}.`);',
      },
      {
        type: 'p',
        text: 'The variable names match the property names. This reduces repetition when you need several properties from the same object.',
      },
      { type: 'h2', text: 'Renaming and default values' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Safer destructuring',
        code:
          'const settings = {\n' +
          "  theme: 'dark',\n" +
          '  notifications: true,\n' +
          '};\n' +
          '\n' +
          "const { theme: selectedTheme, language = 'en' } = settings;\n" +
          '\n' +
          'console.log(selectedTheme);\n' +
          'console.log(language);',
      },
      { type: 'h2', text: 'Array destructuring' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Unpacking array positions',
        code:
          "const coordinates = [42.36, -71.05];\n" +
          'const [latitude, longitude] = coordinates;\n' +
          '\n' +
          'console.log(latitude);\n' +
          'console.log(longitude);',
      },
      {
        type: 'note',
        text: 'Object destructuring uses property names. Array destructuring uses positions, so the order matters.',
      },
      {
        type: 'try',
        text: 'Given a product object with name, price, and category, destructure the values and build a sentence with a template literal.',
      },
      {
        type: 'keypoints',
        items: [
          'Destructuring extracts values into variables.',
          'Object destructuring matches property names.',
          'Array destructuring follows item order.',
          'Defaults help when a property might be missing.',
        ],
      },
    ],
  },
  {
    slug: 'js-spread-rest',
    title: 'Spread & Rest',
    description:
      'Use the three-dot syntax to copy, combine, and collect values in arrays, objects, and functions.',
    level: 'intermediate',
    section: 'Modern JavaScript',
    order: 32,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Spread and rest both use three dots, but they do different jobs. Spread expands values. Rest collects values.',
      },
      { type: 'h2', text: 'Spread with arrays' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Combining arrays without changing the originals',
        code:
          "const primaryNav = ['Home', 'Products'];\n" +
          "const accountNav = ['Profile', 'Sign out'];\n" +
          '\n' +
          "const fullNav = [...primaryNav, 'Support', ...accountNav];\n" +
          '\n' +
          'console.log(fullNav);',
      },
      { type: 'h2', text: 'Spread with objects' },
      {
        type: 'p',
        text: 'Object spread is useful when you want to create an updated copy instead of changing the original object.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Updating a settings object',
        code:
          'const defaultSettings = {\n' +
          "  theme: 'light',\n" +
          '  showTips: true,\n' +
          '};\n' +
          '\n' +
          'const userSettings = {\n' +
          "  theme: 'dark',\n" +
          '};\n' +
          '\n' +
          'const settings = { ...defaultSettings, ...userSettings };\n' +
          '\n' +
          'console.log(settings);',
      },
      { type: 'h2', text: 'Rest parameters' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Collecting arguments',
        code:
          'function sum(...numbers) {\n' +
          '  return numbers.reduce((total, number) => total + number, 0);\n' +
          '}\n' +
          '\n' +
          'console.log(sum(4, 8, 15));',
      },
      {
        type: 'table',
        headers: ['Syntax', 'Meaning', 'Example'],
        rows: [
          ['Spread', 'Expands values', '[...items]'],
          ['Rest', 'Collects values', 'function log(...messages)'],
        ],
      },
      {
        type: 'tip',
        text: 'Object spread makes shallow copies. Nested objects are still shared unless you copy them too.',
      },
      {
        type: 'try',
        text: 'Create a new cart array by copying an existing cart and adding one new item with spread syntax.',
      },
      {
        type: 'keypoints',
        items: [
          'Spread expands arrays and objects into a new place.',
          'Rest collects remaining values into an array.',
          'Spread is a common way to avoid mutating existing data.',
          'Object spread copies only one level deep.',
        ],
      },
    ],
  },
  {
    slug: 'js-array-advanced',
    title: 'Array Methods (map, filter, find)',
    description:
      'Use map(), filter(), and find() to transform and search arrays without manual loops.',
    level: 'intermediate',
    section: 'Arrays & Objects Deep Dive',
    order: 33,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Modern frontend code often uses array methods instead of for loops for common data tasks. The big three are map(), filter(), and find().',
      },
      { type: 'h2', text: 'map() transforms every item' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Rendering list labels',
        code:
          'const users = [\n' +
          "  { name: 'Iris', active: true },\n" +
          "  { name: 'Mateo', active: false },\n" +
          "  { name: 'Zoe', active: true },\n" +
          '];\n' +
          '\n' +
          'const labels = users.map(user => user.name.toUpperCase());\n' +
          '\n' +
          'console.log(labels);',
      },
      { type: 'h2', text: 'filter() keeps matching items' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Keeping active users',
        code:
          'const activeUsers = users.filter(user => user.active);\n' +
          '\n' +
          'console.log(activeUsers);',
      },
      { type: 'h2', text: 'find() returns the first match' },
      {
        type: 'p',
        text: 'Use find() when you need one item. It returns undefined if no item matches.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Finding one user',
        code:
          "const selectedUser = users.find(user => user.name === 'Mateo');\n" +
          '\n' +
          'if (selectedUser) {\n' +
          '  console.log(`Selected: ${selectedUser.name}`);\n' +
          '}',
      },
      {
        type: 'table',
        headers: ['Method', 'Returns', 'Best for'],
        rows: [
          ['map()', 'A new array of the same length', 'Changing each item into something else'],
          ['filter()', 'A new array with matching items', 'Removing items that do not match'],
          ['find()', 'One item or undefined', 'Looking up a single record'],
        ],
      },
      {
        type: 'tip',
        text: 'Name callback parameters clearly. product, user, and button are often easier to read than x or item.',
      },
      {
        type: 'try',
        text: 'Start with an array of products. Use filter() to keep products in stock, then map() to create display names.',
      },
      {
        type: 'keypoints',
        items: [
          'map() transforms every array item.',
          'filter() keeps only items that pass a test.',
          'find() returns the first matching item.',
          'These methods return values, so remember to store or return the result.',
        ],
      },
    ],
  },
  {
    slug: 'js-reduce',
    title: 'reduce() & Chaining',
    description:
      'Learn how reduce() builds one result from many values and how to chain array methods clearly.',
    level: 'intermediate',
    section: 'Arrays & Objects Deep Dive',
    order: 34,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'The reduce() method turns an array into one result. That result might be a number, string, object, or even another array.',
      },
      { type: 'h2', text: 'The reduce() pattern' },
      {
        type: 'p',
        text: 'reduce() receives a callback and a starting value. The callback receives the accumulated result and the current item.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Calculating a cart total',
        code:
          'const cart = [\n' +
          "  { name: 'Keyboard', price: 80, quantity: 1 },\n" +
          "  { name: 'Mouse', price: 35, quantity: 2 },\n" +
          "  { name: 'USB-C Cable', price: 12, quantity: 3 },\n" +
          '];\n' +
          '\n' +
          'const total = cart.reduce((sum, item) => {\n' +
          '  return sum + item.price * item.quantity;\n' +
          '}, 0);\n' +
          '\n' +
          'console.log(total);',
      },
      { type: 'h2', text: 'Building an object with reduce()' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Counting items by status',
        code:
          'const tasks = [\n' +
          "  { title: 'Write copy', status: 'done' },\n" +
          "  { title: 'Build form', status: 'todo' },\n" +
          "  { title: 'Test checkout', status: 'done' },\n" +
          '];\n' +
          '\n' +
          'const counts = tasks.reduce((result, task) => {\n' +
          '  result[task.status] = (result[task.status] || 0) + 1;\n' +
          '  return result;\n' +
          '}, {});\n' +
          '\n' +
          'console.log(counts);',
      },
      { type: 'h2', text: 'Chaining methods' },
      {
        type: 'p',
        text: 'Chaining means calling one method after another. It is powerful when each step has a clear purpose.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Filter, map, and join',
        code:
          'const listItems = cart\n' +
          '  .filter(item => item.quantity > 1)\n' +
          '  .map(item => `<li>${item.name}: ${item.quantity}</li>`)\n' +
          "  .join('');\n" +
          '\n' +
          "document.querySelector('#cart-summary').innerHTML = listItems;",
      },
      {
        type: 'note',
        text: 'A chain should read like a pipeline. If a chain becomes hard to follow, split it into named variables.',
      },
      {
        type: 'try',
        text: 'Use reduce() to count the total number of unread messages in an array of conversation objects.',
      },
      {
        type: 'keypoints',
        items: [
          'reduce() builds one result from an array.',
          'Always choose a clear initial value for reduce().',
          'Chaining works best when each step is small and readable.',
          'Use named variables when a chain becomes too complex.',
        ],
      },
    ],
  },
  {
    slug: 'js-object-advanced',
    title: 'Advanced Objects',
    description:
      'Work with computed properties, object methods, optional chaining, and object utilities.',
    level: 'intermediate',
    section: 'Arrays & Objects Deep Dive',
    order: 35,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Objects are the main way JavaScript groups related data. Intermediate JavaScript adds tools for creating, reading, and transforming objects more safely.',
      },
      { type: 'h2', text: 'Computed property names' },
      {
        type: 'p',
        text: 'A computed property name uses square brackets to create or read a property from a variable.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Creating dynamic settings',
        code:
          "const settingName = 'fontSize';\n" +
          '\n' +
          'const preferences = {\n' +
          "  theme: 'dark',\n" +
          '  [settingName]: 18,\n' +
          '};\n' +
          '\n' +
          'console.log(preferences.fontSize);',
      },
      { type: 'h2', text: 'Object utility methods' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Keys, values, and entries',
        code:
          'const scores = {\n' +
          '  accessibility: 92,\n' +
          '  performance: 87,\n' +
          '  seo: 95,\n' +
          '};\n' +
          '\n' +
          'console.log(Object.keys(scores));\n' +
          'console.log(Object.values(scores));\n' +
          'console.log(Object.entries(scores));',
      },
      { type: 'h2', text: 'Optional chaining' },
      {
        type: 'p',
        text: 'Optional chaining uses ?. to safely read a nested property. If a value before ?. is null or undefined, the expression returns undefined instead of throwing an error.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Reading nested API data',
        code:
          'const response = {\n' +
          '  user: {\n' +
          "    profile: { displayName: 'Sam Rivera' },\n" +
          '  },\n' +
          '};\n' +
          '\n' +
          'const displayName = response.user?.profile?.displayName ?? "Anonymous";\n' +
          '\n' +
          'console.log(displayName);',
      },
      {
        type: 'tip',
        text: 'Use optional chaining for values that might truly be missing. If data is required, it is often better to validate it and show a clear error.',
      },
      {
        type: 'try',
        text: 'Use Object.entries() to render a settings object as a list of label/value rows.',
      },
      {
        type: 'keypoints',
        items: [
          'Computed property names create keys from expressions.',
          'Object.keys(), Object.values(), and Object.entries() help transform objects.',
          'Optional chaining safely reads nested optional data.',
          'The nullish coalescing operator ?? provides a fallback for null or undefined.',
        ],
      },
    ],
  },
  {
    slug: 'js-dates',
    title: 'Dates & Time',
    description:
      'Create dates, format them for users, and handle common browser time tasks.',
    level: 'intermediate',
    section: 'Browser Toolkit',
    order: 36,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'JavaScript Date objects represent moments in time. Browser apps use dates for timestamps, scheduling, countdowns, and user-friendly labels.',
      },
      { type: 'h2', text: 'Creating Date objects' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Current time and a specific date',
        code:
          'const now = new Date();\n' +
          "const launchDate = new Date('2026-09-15T09:00:00');\n" +
          '\n' +
          'console.log(now);\n' +
          'console.log(launchDate);',
      },
      {
        type: 'note',
        text: 'Date parsing can be affected by time zones. ISO-style strings are usually more predictable than informal date strings.',
      },
      { type: 'h2', text: 'Formatting dates for people' },
      {
        type: 'p',
        text: 'Users should not see raw Date objects. Use Intl.DateTimeFormat or toLocaleString() to format dates for a locale.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Formatting a date',
        code:
          "const formatter = new Intl.DateTimeFormat('en-US', {\n" +
          "  dateStyle: 'medium',\n" +
          "  timeStyle: 'short',\n" +
          '});\n' +
          '\n' +
          'console.log(formatter.format(launchDate));',
      },
      { type: 'h2', text: 'Measuring time differences' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Days until a deadline',
        code:
          "const deadline = new Date('2026-12-01T00:00:00');\n" +
          'const millisecondsPerDay = 1000 * 60 * 60 * 24;\n' +
          '\n' +
          'const daysLeft = Math.ceil((deadline - new Date()) / millisecondsPerDay);\n' +
          '\n' +
          'console.log(`${daysLeft} days left`);',
      },
      {
        type: 'tip',
        text: 'For simple display, built-in Date and Intl APIs are enough. For complex calendars, recurring events, or time zones, teams often use a dedicated date library.',
      },
      {
        type: 'try',
        text: 'Create a small message that shows today in a long date format, such as "Saturday, July 25, 2026".',
      },
      {
        type: 'keypoints',
        items: [
          'Date objects represent moments in time.',
          'Use Intl.DateTimeFormat for user-friendly formatting.',
          'Date math usually works with milliseconds.',
          'Time zones can change how a date appears to a user.',
        ],
      },
    ],
  },
  {
    slug: 'js-json',
    title: 'JSON',
    description:
      'Use JSON to exchange structured data between JavaScript, APIs, and browser storage.',
    level: 'intermediate',
    section: 'Browser Toolkit',
    order: 37,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'JSON stands for JavaScript Object Notation. It is a text format used to send structured data across the web.',
      },
      { type: 'h2', text: 'JSON looks like JavaScript objects' },
      {
        type: 'p',
        text: 'JSON is inspired by JavaScript object syntax, but it is stricter. Property names must use double quotes, and values must be valid JSON values.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'A JavaScript object and JSON text',
        code:
          'const user = {\n' +
          "  name: 'Kai',\n" +
          '  active: true,\n' +
          '  score: 42,\n' +
          '};\n' +
          '\n' +
          'const jsonText = JSON.stringify(user);\n' +
          '\n' +
          'console.log(jsonText);',
      },
      { type: 'h2', text: 'Parsing JSON' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Turning JSON into an object',
        code:
          'const savedText = \'{"theme":"dark","showTips":true}\';\n' +
          'const settings = JSON.parse(savedText);\n' +
          '\n' +
          'console.log(settings.theme);',
      },
      {
        type: 'table',
        headers: ['Method', 'Purpose'],
        rows: [
          ['JSON.stringify(value)', 'Convert a JavaScript value into JSON text'],
          ['JSON.parse(text)', 'Convert JSON text into a JavaScript value'],
        ],
      },
      {
        type: 'warning',
        text: 'JSON.parse() throws an error if the text is not valid JSON. Parse data from unknown sources inside try...catch.',
      },
      {
        type: 'try',
        text: 'Create a preferences object, convert it to JSON, then parse it back and read one property.',
      },
      {
        type: 'keypoints',
        items: [
          'JSON is a text format for structured data.',
          'Use JSON.stringify() before storing or sending objects as text.',
          'Use JSON.parse() to convert JSON text back into JavaScript data.',
          'Invalid JSON causes JSON.parse() to throw an error.',
        ],
      },
    ],
  },
  {
    slug: 'js-errors',
    title: 'Errors & try...catch',
    description:
      'Handle expected failures gracefully and create useful errors for debugging.',
    level: 'intermediate',
    section: 'Browser Toolkit',
    order: 38,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Errors happen in real applications: bad input, failed network requests, missing elements, and invalid JSON. Good error handling keeps the interface understandable.',
      },
      { type: 'h2', text: 'Using try...catch' },
      {
        type: 'p',
        text: 'try...catch lets you run code that might fail and respond if an error is thrown.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Safely parsing JSON',
        code:
          'const jsonText = "{ bad json }";\n' +
          '\n' +
          'try {\n' +
          '  const data = JSON.parse(jsonText);\n' +
          '  console.log(data);\n' +
          '} catch (error) {\n' +
          "  console.error('Could not parse settings:', error.message);\n" +
          '}',
      },
      { type: 'h2', text: 'Throwing your own errors' },
      {
        type: 'p',
        text: 'Throw an error when a function cannot complete its job. This makes the problem visible to the code that called the function.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Validating input',
        code:
          'function getDiscountedPrice(price, percent) {\n' +
          '  if (price < 0) {\n' +
          "    throw new Error('Price cannot be negative.');\n" +
          '  }\n' +
          '\n' +
          '  return price - price * percent;\n' +
          '}\n' +
          '\n' +
          'try {\n' +
          '  console.log(getDiscountedPrice(-10, 0.2));\n' +
          '} catch (error) {\n' +
          '  console.log(error.message);\n' +
          '}',
      },
      { type: 'h2', text: 'finally' },
      {
        type: 'p',
        text: 'A finally block runs whether the try block succeeds or fails. It is useful for cleanup, such as hiding a loading spinner.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Cleanup with finally',
        code:
          "const button = document.querySelector('#save');\n" +
          '\n' +
          'try {\n' +
          "  button.disabled = true;\n" +
          "  console.log('Saving...');\n" +
          '} catch (error) {\n' +
          '  console.error(error);\n' +
          '} finally {\n' +
          '  button.disabled = false;\n' +
          '}',
      },
      {
        type: 'tip',
        text: 'Show friendly messages to users, but log technical details where developers can inspect them.',
      },
      {
        type: 'try',
        text: 'Write a safeParseJson(text) function that returns null when parsing fails.',
      },
      {
        type: 'keypoints',
        items: [
          'try...catch handles code that might throw.',
          'throw new Error() communicates that a function cannot continue.',
          'finally is useful for cleanup that must always run.',
          'Good error handling improves both user experience and debugging.',
        ],
      },
    ],
  },
  {
    slug: 'js-classes',
    title: 'Classes',
    description:
      'Use JavaScript classes to group data and behavior into reusable blueprints.',
    level: 'intermediate',
    section: 'Object-Oriented JS',
    order: 39,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A class is a blueprint for creating objects with shared structure and behavior. Classes are common in UI widgets, models, and application services.',
      },
      { type: 'h2', text: 'Creating a class' },
      {
        type: 'code',
        language: 'javascript',
        title: 'A simple TodoItem class',
        code:
          'class TodoItem {\n' +
          '  constructor(title) {\n' +
          '    this.title = title;\n' +
          '    this.completed = false;\n' +
          '  }\n' +
          '\n' +
          '  complete() {\n' +
          '    this.completed = true;\n' +
          '  }\n' +
          '\n' +
          '  getLabel() {\n' +
          '    return this.completed ? `${this.title} (done)` : this.title;\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          "const task = new TodoItem('Review pull request');\n" +
          'task.complete();\n' +
          'console.log(task.getLabel());',
      },
      { type: 'h2', text: 'Constructors and methods' },
      {
        type: 'ul',
        items: [
          'constructor() runs when you create a new instance with new.',
          'Instance methods are functions shared by objects created from the class.',
          'this refers to the current instance inside class methods.',
        ],
      },
      { type: 'h2', text: 'Extending a class' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Inheritance with extends',
        code:
          'class Notification {\n' +
          '  constructor(message) {\n' +
          '    this.message = message;\n' +
          '  }\n' +
          '\n' +
          '  show() {\n' +
          '    return this.message;\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          'class ErrorNotification extends Notification {\n' +
          '  show() {\n' +
          '    return `Error: ${this.message}`;\n' +
          '  }\n' +
          '}\n' +
          '\n' +
          "const alert = new ErrorNotification('Payment failed');\n" +
          'console.log(alert.show());',
      },
      {
        type: 'note',
        text: 'Classes are syntax over JavaScript prototypes. You can use them without needing to understand every prototype detail right away.',
      },
      {
        type: 'try',
        text: 'Create a UserBadge class with a name property and a render() method that returns a small HTML string.',
      },
      {
        type: 'keypoints',
        items: [
          'Classes are blueprints for objects.',
          'constructor() initializes each new instance.',
          'Methods define behavior shared by instances.',
          'extends lets one class build on another class.',
        ],
      },
    ],
  },
  {
    slug: 'js-this',
    title: 'The this Keyword',
    description:
      'Understand how this is chosen and why it changes between methods, callbacks, and event handlers.',
    level: 'intermediate',
    section: 'Object-Oriented JS',
    order: 40,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'The this keyword refers to the object that is currently being used as the function context. Its value depends on how a function is called.',
      },
      { type: 'h2', text: 'this in object methods' },
      {
        type: 'code',
        language: 'javascript',
        title: 'A method using this',
        code:
          'const menu = {\n' +
          "  title: 'Main Menu',\n" +
          "  items: ['Home', 'Docs', 'Contact'],\n" +
          '  describe() {\n' +
          '    return `${this.title}: ${this.items.length} items`;\n' +
          '  },\n' +
          '};\n' +
          '\n' +
          'console.log(menu.describe());',
      },
      { type: 'h2', text: 'this in event handlers' },
      {
        type: 'p',
        text: 'In a regular DOM event handler, this often refers to the element that received the listener. Many developers still prefer event.currentTarget because it is more explicit.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Using currentTarget in a click handler',
        code:
          "const button = document.querySelector('#subscribe');\n" +
          '\n' +
          "button.addEventListener('click', function (event) {\n" +
          "  event.currentTarget.textContent = 'Subscribed';\n" +
          '});',
      },
      { type: 'h2', text: 'Arrow functions and this' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Keeping this in a class callback',
        code:
          'class TimerButton {\n' +
          '  constructor(button) {\n' +
          '    this.button = button;\n' +
          '    this.seconds = 0;\n' +
          '  }\n' +
          '\n' +
          '  start() {\n' +
          '    setInterval(() => {\n' +
          '      this.seconds += 1;\n' +
          '      this.button.textContent = `${this.seconds}s`;\n' +
          '    }, 1000);\n' +
          '  }\n' +
          '}',
      },
      {
        type: 'warning',
        text: 'The value of this is about the call site, not where the function was written. Arrow functions are the major exception because they inherit this.',
      },
      {
        type: 'try',
        text: 'Create an object named player with a score and an addPoint() method that uses this.score.',
      },
      {
        type: 'keypoints',
        items: [
          'this depends on how a function is called.',
          'In object methods, this usually refers to the object before the dot.',
          'Arrow functions inherit this from the surrounding scope.',
          'event.currentTarget is often clearer than relying on this in DOM handlers.',
        ],
      },
    ],
  },
  {
    slug: 'js-closures',
    title: 'Closures',
    description:
      'Learn how functions remember variables from their outer scope and why closures are useful in UI code.',
    level: 'intermediate',
    section: 'Object-Oriented JS',
    order: 41,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'A closure happens when a function remembers variables from the scope where it was created, even after that outer function has finished running.',
      },
      { type: 'h2', text: 'A function that remembers' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Creating a counter',
        code:
          'function createCounter() {\n' +
          '  let count = 0;\n' +
          '\n' +
          '  return function increment() {\n' +
          '    count += 1;\n' +
          '    return count;\n' +
          '  };\n' +
          '}\n' +
          '\n' +
          'const nextCount = createCounter();\n' +
          '\n' +
          'console.log(nextCount());\n' +
          'console.log(nextCount());',
      },
      {
        type: 'p',
        text: 'The increment function remembers count. Code outside createCounter() cannot directly change count, which makes closures useful for private state.',
      },
      { type: 'h2', text: 'Closures in event handlers' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Remembering state for one button',
        code:
          'function setupLikeButton(button) {\n' +
          '  let likes = 0;\n' +
          '\n' +
          "  button.addEventListener('click', () => {\n" +
          '    likes += 1;\n' +
          '    button.textContent = `${likes} likes`;\n' +
          '  });\n' +
          '}\n' +
          '\n' +
          "setupLikeButton(document.querySelector('#like-post'));",
      },
      { type: 'h2', text: 'Factory functions' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Creating configured validators',
        code:
          'function createMinLengthValidator(minLength) {\n' +
          '  return value => value.trim().length >= minLength;\n' +
          '}\n' +
          '\n' +
          'const isLongEnoughPassword = createMinLengthValidator(8);\n' +
          '\n' +
          "console.log(isLongEnoughPassword('secret'));\n" +
          "console.log(isLongEnoughPassword('better-secret'));",
      },
      {
        type: 'tip',
        text: 'Closures are not special syntax. They are a natural result of functions and scope working together.',
      },
      {
        type: 'try',
        text: 'Write createToggle() so it returns a function that switches between true and false every time it is called.',
      },
      {
        type: 'keypoints',
        items: [
          'A closure lets a function remember outer variables.',
          'Closures can protect private state.',
          'Event handlers often use closures to remember UI state.',
          'Factory functions can create customized behavior with closures.',
        ],
      },
    ],
  },
  {
    slug: 'js-modules',
    title: 'Modules (import/export)',
    description:
      'Split JavaScript into reusable files with named exports, default exports, and imports.',
    level: 'intermediate',
    section: 'Modules & Storage',
    order: 42,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Modules let you organize JavaScript across multiple files. Instead of placing everything in one script, you export values from one file and import them where needed.',
      },
      { type: 'h2', text: 'Named exports' },
      {
        type: 'code',
        language: 'javascript',
        title: 'utils/formatters.js',
        code:
          'export function formatCurrency(amount) {\n' +
          "  return new Intl.NumberFormat('en-US', {\n" +
          "    style: 'currency',\n" +
          "    currency: 'USD',\n" +
          '  }).format(amount);\n' +
          '}\n' +
          '\n' +
          'export const appName = "ShopDesk";',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'main.js',
        code:
          "import { appName, formatCurrency } from './utils/formatters.js';\n" +
          '\n' +
          'console.log(appName);\n' +
          'console.log(formatCurrency(29.99));',
      },
      { type: 'h2', text: 'Default exports' },
      {
        type: 'p',
        text: 'A file can also have one default export. Use it when a module has one primary value to share.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'toast.js',
        code:
          'export default function showToast(message) {\n' +
          "  const toast = document.querySelector('#toast');\n" +
          '  toast.textContent = message;\n' +
          "  toast.classList.add('is-visible');\n" +
          '}',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Importing a default export',
        code:
          "import showToast from './toast.js';\n" +
          '\n' +
          "showToast('Settings saved.');",
      },
      {
        type: 'note',
        text: 'In the browser, module scripts use <script type="module" src="main.js"></script>. Many projects also use bundlers, but the import/export syntax is the same idea.',
      },
      {
        type: 'try',
        text: 'Create a module that exports a taxRate constant and a calculateTax() function, then import both into another file.',
      },
      {
        type: 'keypoints',
        items: [
          'Modules help organize code into files.',
          'Named exports must be imported with matching names.',
          'Default exports can be imported with a name you choose.',
          'Browser module imports usually include the file extension.',
        ],
      },
    ],
  },
  {
    slug: 'js-storage',
    title: 'localStorage & sessionStorage',
    description:
      'Store small pieces of browser data with localStorage and sessionStorage.',
    level: 'intermediate',
    section: 'Modules & Storage',
    order: 43,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Web storage lets a browser save small string values for a site. localStorage keeps data after the browser closes. sessionStorage keeps data only for the current tab session.',
      },
      { type: 'h2', text: 'Saving and reading strings' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Saving a theme',
        code:
          "localStorage.setItem('theme', 'dark');\n" +
          '\n' +
          "const theme = localStorage.getItem('theme');\n" +
          '\n' +
          'document.documentElement.dataset.theme = theme;',
      },
      { type: 'h2', text: 'Storing objects with JSON' },
      {
        type: 'p',
        text: 'Storage values are strings. To store arrays or objects, convert them with JSON.stringify() and read them with JSON.parse().',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Saving preferences',
        code:
          'const preferences = {\n' +
          "  theme: 'dark',\n" +
          '  compactMode: true,\n' +
          '};\n' +
          '\n' +
          "localStorage.setItem('preferences', JSON.stringify(preferences));\n" +
          '\n' +
          "const saved = localStorage.getItem('preferences');\n" +
          'const parsedPreferences = saved ? JSON.parse(saved) : {};\n' +
          '\n' +
          'console.log(parsedPreferences);',
      },
      { type: 'h2', text: 'sessionStorage for temporary data' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Remembering a wizard step',
        code:
          "sessionStorage.setItem('checkoutStep', 'shipping');\n" +
          '\n' +
          "const currentStep = sessionStorage.getItem('checkoutStep') || 'cart';\n" +
          '\n' +
          'console.log(currentStep);',
      },
      {
        type: 'warning',
        text: 'Do not store passwords, tokens, payment details, or sensitive personal data in localStorage or sessionStorage.',
      },
      {
        type: 'try',
        text: 'Build two buttons: one saves a selected color to localStorage, and one clears it with removeItem().',
      },
      {
        type: 'keypoints',
        items: [
          'localStorage persists across browser restarts.',
          'sessionStorage lasts for the current tab session.',
          'Storage values are strings, so use JSON for objects and arrays.',
          'Web storage is not appropriate for sensitive secrets.',
        ],
      },
    ],
  },
  {
    slug: 'js-callbacks',
    title: 'Callbacks',
    description:
      'Pass functions into other functions to run code later or customize behavior.',
    level: 'intermediate',
    section: 'Asynchronous JavaScript',
    order: 44,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'A callback is a function passed as an argument to another function. The receiving function calls the callback at the right time.',
      },
      { type: 'h2', text: 'Callbacks in array methods' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Passing a function to map()',
        code:
          "const names = ['Ana', 'Ben', 'Chen'];\n" +
          '\n' +
          'const listItems = names.map(name => `<li>${name}</li>`);\n' +
          '\n' +
          'console.log(listItems);',
      },
      { type: 'h2', text: 'Callbacks in browser events' },
      {
        type: 'p',
        text: 'Event listeners are one of the most common callback patterns in frontend development. The browser calls your function when the event happens.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'A click callback',
        code:
          "const button = document.querySelector('#open-menu');\n" +
          "const menu = document.querySelector('#menu');\n" +
          '\n' +
          "button.addEventListener('click', () => {\n" +
          "  menu.classList.toggle('is-open');\n" +
          '});',
      },
      { type: 'h2', text: 'Custom callbacks' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Customizing a greeting',
        code:
          'function greetUser(name, formatter) {\n' +
          '  const message = formatter(name);\n' +
          '  console.log(message);\n' +
          '}\n' +
          '\n' +
          "greetUser('Priya', name => `Welcome back, ${name}!`);",
      },
      {
        type: 'note',
        text: 'Callbacks are not always asynchronous. map() callbacks run immediately during the method call, while event callbacks run later.',
      },
      {
        type: 'try',
        text: 'Write a runWhenReady(callback) function that logs "Preparing..." and then calls the callback.',
      },
      {
        type: 'keypoints',
        items: [
          'A callback is a function passed to another function.',
          'Callbacks customize behavior and allow code to run later.',
          'Array methods, timers, and events all use callbacks.',
          'Not every callback is asynchronous.',
        ],
      },
    ],
  },
  {
    slug: 'js-promises',
    title: 'Promises',
    description:
      'Represent future results with Promises and handle success or failure cleanly.',
    level: 'intermediate',
    section: 'Asynchronous JavaScript',
    order: 45,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'A Promise represents a value that may be available now, later, or never. Promises are central to modern asynchronous JavaScript.',
      },
      { type: 'h2', text: 'Promise states' },
      {
        type: 'table',
        headers: ['State', 'Meaning'],
        rows: [
          ['pending', 'The work is still happening'],
          ['fulfilled', 'The work completed successfully'],
          ['rejected', 'The work failed'],
        ],
      },
      { type: 'h2', text: 'Using then() and catch()' },
      {
        type: 'code',
        language: 'javascript',
        title: 'A promise that resolves later',
        code:
          'const wait = milliseconds => {\n' +
          '  return new Promise(resolve => {\n' +
          '    setTimeout(() => resolve("Done waiting"), milliseconds);\n' +
          '  });\n' +
          '};\n' +
          '\n' +
          'wait(1000)\n' +
          '  .then(message => {\n' +
          '    console.log(message);\n' +
          '  })\n' +
          '  .catch(error => {\n' +
          '    console.error(error);\n' +
          '  });',
      },
      { type: 'h2', text: 'Handling rejection' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Rejecting a promise',
        code:
          'function checkInventory(quantity) {\n' +
          '  return new Promise((resolve, reject) => {\n' +
          '    if (quantity > 0) {\n' +
          '      resolve("Item is available");\n' +
          '    } else {\n' +
          '      reject(new Error("Item is out of stock"));\n' +
          '    }\n' +
          '  });\n' +
          '}\n' +
          '\n' +
          'checkInventory(0)\n' +
          '  .then(message => console.log(message))\n' +
          '  .catch(error => console.log(error.message));',
      },
      {
        type: 'tip',
        text: 'Return promises from functions so callers can decide how to handle success, failure, loading states, and UI updates.',
      },
      {
        type: 'try',
        text: 'Create a promise that resolves with "Profile loaded" after 500 milliseconds, then log the message with then().',
      },
      {
        type: 'keypoints',
        items: [
          'Promises represent future results.',
          'then() handles fulfillment.',
          'catch() handles rejection.',
          'Promises make async code easier to compose than deeply nested callbacks.',
        ],
      },
    ],
  },
  {
    slug: 'js-async-await',
    title: 'Async / Await',
    description:
      'Write promise-based code in a readable, top-to-bottom style with async and await.',
    level: 'intermediate',
    section: 'Asynchronous JavaScript',
    order: 46,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'async and await are syntax for working with Promises. They help asynchronous code look more like normal step-by-step JavaScript.',
      },
      { type: 'h2', text: 'async functions return promises' },
      {
        type: 'code',
        language: 'javascript',
        title: 'A simple async function',
        code:
          'async function getGreeting() {\n' +
          '  return "Hello from async JavaScript";\n' +
          '}\n' +
          '\n' +
          'getGreeting().then(message => console.log(message));',
      },
      { type: 'h2', text: 'await pauses inside async functions' },
      {
        type: 'p',
        text: 'await waits for a Promise to settle and gives you the fulfilled value. You can only use await inside an async function in regular scripts.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Waiting for a promise',
        code:
          'const wait = milliseconds => {\n' +
          '  return new Promise(resolve => {\n' +
          '    setTimeout(resolve, milliseconds);\n' +
          '  });\n' +
          '};\n' +
          '\n' +
          'async function showSavedMessage() {\n' +
          '  console.log("Saving...");\n' +
          '  await wait(800);\n' +
          '  console.log("Saved!");\n' +
          '}\n' +
          '\n' +
          'showSavedMessage();',
      },
      { type: 'h2', text: 'Error handling with try...catch' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Catching async errors',
        code:
          'async function loadSettings() {\n' +
          '  try {\n' +
          '    const response = await fetch("/api/settings");\n' +
          '    const settings = await response.json();\n' +
          '    console.log(settings);\n' +
          '  } catch (error) {\n' +
          '    console.error("Could not load settings", error);\n' +
          '  }\n' +
          '}',
      },
      {
        type: 'note',
        text: 'await does not block the entire browser. It pauses the async function while the browser continues handling other work.',
      },
      {
        type: 'try',
        text: 'Rewrite a then() chain as an async function with await and try...catch.',
      },
      {
        type: 'keypoints',
        items: [
          'async functions always return Promises.',
          'await waits for a Promise inside an async function.',
          'Use try...catch to handle awaited failures.',
          'async/await improves readability for multi-step asynchronous code.',
        ],
      },
    ],
  },
  {
    slug: 'js-fetch',
    title: 'Fetch API',
    description:
      'Use fetch() to request data from APIs and update the page with the response.',
    level: 'intermediate',
    section: 'Asynchronous JavaScript',
    order: 47,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'The Fetch API lets browser JavaScript make HTTP requests. It is commonly used to load JSON, submit forms, and connect frontend interfaces to backend services.',
      },
      { type: 'h2', text: 'Fetching JSON' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Loading users',
        code:
          'async function loadUsers() {\n' +
          '  const response = await fetch("https://jsonplaceholder.typicode.com/users");\n' +
          '  const users = await response.json();\n' +
          '\n' +
          '  console.log(users);\n' +
          '}\n' +
          '\n' +
          'loadUsers();',
      },
      { type: 'h2', text: 'Checking response.ok' },
      {
        type: 'p',
        text: 'fetch() rejects for network problems, but a 404 or 500 response still fulfills the Promise. Check response.ok to detect unsuccessful HTTP status codes.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Handling HTTP errors',
        code:
          'async function loadProduct(id) {\n' +
          '  const response = await fetch(`/api/products/${id}`);\n' +
          '\n' +
          '  if (!response.ok) {\n' +
          '    throw new Error(`Request failed: ${response.status}`);\n' +
          '  }\n' +
          '\n' +
          '  return response.json();\n' +
          '}\n' +
          '\n' +
          'loadProduct(42)\n' +
          '  .then(product => console.log(product))\n' +
          '  .catch(error => console.error(error.message));',
      },
      { type: 'h2', text: 'Sending JSON with POST' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Submitting data',
        code:
          'async function saveFeedback(feedback) {\n' +
          '  const response = await fetch("/api/feedback", {\n' +
          '    method: "POST",\n' +
          '    headers: {\n' +
          '      "Content-Type": "application/json",\n' +
          '    },\n' +
          '    body: JSON.stringify(feedback),\n' +
          '  });\n' +
          '\n' +
          '  if (!response.ok) {\n' +
          '    throw new Error("Feedback could not be saved.");\n' +
          '  }\n' +
          '\n' +
          '  return response.json();\n' +
          '}',
      },
      {
        type: 'tip',
        text: 'Show loading, success, and error states around fetch calls. Users should never wonder whether the app is doing something.',
      },
      {
        type: 'try',
        text: 'Write an async function that fetches a list of posts, checks response.ok, and renders the first five titles into a list.',
      },
      {
        type: 'keypoints',
        items: [
          'fetch() makes HTTP requests from the browser.',
          'Call response.json() to read JSON response bodies.',
          'Check response.ok for HTTP errors.',
          'Use method, headers, and body to send JSON data.',
        ],
      },
    ],
  },
  {
    slug: 'js-dom-advanced',
    title: 'Advanced DOM',
    description:
      'Create, update, and organize DOM elements efficiently for interactive pages.',
    level: 'intermediate',
    section: 'DOM Power Skills',
    order: 48,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'The DOM is the browser representation of your page. Advanced DOM work focuses on creating elements safely, updating classes and attributes, and reducing unnecessary page work.',
      },
      { type: 'h2', text: 'Creating elements with JavaScript' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Building a notification element',
        code:
          'function createNotification(message, type = "info") {\n' +
          "  const notification = document.createElement('div');\n" +
          "  notification.className = `notification notification--${type}`;\n" +
          '  notification.textContent = message;\n' +
          '\n' +
          '  return notification;\n' +
          '}\n' +
          '\n' +
          "document.body.append(createNotification('Profile saved.', 'success'));",
      },
      {
        type: 'note',
        text: 'createElement() plus textContent is safer for user-facing text than building HTML strings with innerHTML.',
      },
      { type: 'h2', text: 'Using classList and dataset' },
      {
        type: 'code',
        language: 'javascript',
        title: 'Updating UI state',
        code:
          "const panel = document.querySelector('#settings-panel');\n" +
          '\n' +
          "panel.classList.add('is-open');\n" +
          "panel.dataset.state = 'open';\n" +
          "panel.setAttribute('aria-hidden', 'false');\n" +
          '\n' +
          "console.log(panel.dataset.state);",
      },
      { type: 'h2', text: 'Rendering with a DocumentFragment' },
      {
        type: 'p',
        text: 'A DocumentFragment lets you build a group of nodes before adding them to the page. This keeps rendering organized and can reduce repeated DOM updates.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Rendering a list efficiently',
        code:
          'const products = ["Laptop Stand", "Webcam", "Desk Lamp"];\n' +
          "const list = document.querySelector('#product-list');\n" +
          'const fragment = document.createDocumentFragment();\n' +
          '\n' +
          'products.forEach(product => {\n' +
          "  const item = document.createElement('li');\n" +
          '  item.textContent = product;\n' +
          '  fragment.append(item);\n' +
          '});\n' +
          '\n' +
          'list.replaceChildren(fragment);',
      },
      {
        type: 'tip',
        text: 'Prefer replaceChildren() when you want to replace all child nodes. It is clearer than manually clearing and appending.',
      },
      {
        type: 'try',
        text: 'Build a renderTags(tags) function that creates button elements for each tag and replaces the contents of a tag container.',
      },
      {
        type: 'keypoints',
        items: [
          'createElement() and textContent help build safe UI.',
          'classList, dataset, and attributes express element state.',
          'DocumentFragment helps prepare multiple nodes before insertion.',
          'replaceChildren() is useful for complete re-renders of a container.',
        ],
      },
    ],
  },
  {
    slug: 'js-event-delegation',
    title: 'Event Delegation',
    description:
      'Handle events from many child elements with one parent listener.',
    level: 'intermediate',
    section: 'DOM Power Skills',
    order: 49,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Event delegation means listening for an event on a parent element and responding when the event came from a matching child element.',
      },
      { type: 'h2', text: 'Why delegation works' },
      {
        type: 'p',
        text: 'Most DOM events bubble. That means an event starts on the target element and then travels up through its ancestors.',
      },
      {
        type: 'code',
        language: 'html',
        title: 'A delegated list',
        code:
          '<ul id="todo-list">\n' +
          '  <li><button data-action="complete">Complete</button> Buy milk</li>\n' +
          '  <li><button data-action="complete">Complete</button> Pay bill</li>\n' +
          '</ul>',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'One listener for many buttons',
        code:
          "const list = document.querySelector('#todo-list');\n" +
          '\n' +
          "list.addEventListener('click', event => {\n" +
          "  const button = event.target.closest('button[data-action=\"complete\"]');\n" +
          '\n' +
          '  if (!button || !list.contains(button)) {\n' +
          '    return;\n' +
          '  }\n' +
          '\n' +
          "  const item = button.closest('li');\n" +
          "  item.classList.toggle('is-complete');\n" +
          '});',
      },
      { type: 'h2', text: 'Delegation and dynamic elements' },
      {
        type: 'p',
        text: 'Delegation is very useful when elements are added later. The parent listener already exists, so new child elements can work without adding new listeners.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Adding a new item',
        code:
          "const item = document.createElement('li');\n" +
          'item.innerHTML = \'<button data-action="complete">Complete</button> New task\';\n' +
          'list.append(item);',
      },
      {
        type: 'tip',
        text: 'Use closest() to find the element you care about, then check that it belongs to the delegated container.',
      },
      {
        type: 'try',
        text: 'Create a gallery where one click listener on the gallery container detects which thumbnail button was clicked.',
      },
      {
        type: 'keypoints',
        items: [
          'Event delegation uses one parent listener for many child elements.',
          'It works because many events bubble through ancestors.',
          'Delegation supports elements added after the listener is created.',
          'closest() helps find matching child elements safely.',
        ],
      },
    ],
  },
  {
    slug: 'js-forms-advanced',
    title: 'Forms, UX & Validation Patterns',
    description:
      'Build friendlier forms with submit handling, validation messages, and accessible feedback.',
    level: 'intermediate',
    section: 'DOM Power Skills',
    order: 50,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Forms are one of the most important parts of frontend development. Good form code helps users complete tasks, understand errors, and avoid losing work.',
      },
      { type: 'h2', text: 'Handling submit events' },
      {
        type: 'p',
        text: 'Listen for the submit event on the form, not the click event on the button. This supports keyboard submission and other browser form behaviors.',
      },
      {
        type: 'code',
        language: 'html',
        title: 'A simple signup form',
        code:
          '<form id="signup-form" novalidate>\n' +
          '  <label>\n' +
          '    Email\n' +
          '    <input id="email" name="email" type="email" required />\n' +
          '  </label>\n' +
          '  <p id="email-error" class="error" aria-live="polite"></p>\n' +
          '  <button>Sign up</button>\n' +
          '</form>',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Validating on submit',
        code:
          "const form = document.querySelector('#signup-form');\n" +
          "const email = document.querySelector('#email');\n" +
          "const emailError = document.querySelector('#email-error');\n" +
          '\n' +
          "form.addEventListener('submit', event => {\n" +
          '  event.preventDefault();\n' +
          '\n' +
          '  if (!email.validity.valid) {\n' +
          "    emailError.textContent = 'Enter a valid email address.';\n" +
          "    email.setAttribute('aria-invalid', 'true');\n" +
          '    email.focus();\n' +
          '    return;\n' +
          '  }\n' +
          '\n' +
          "  emailError.textContent = '';\n" +
          "  email.removeAttribute('aria-invalid');\n" +
          "  console.log('Submit form data');\n" +
          '});',
      },
      { type: 'h2', text: 'Using FormData' },
      {
        type: 'p',
        text: 'FormData reads values from a form using the name attributes. It is helpful for collecting user input without querying every field separately.',
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Reading form values',
        code:
          "form.addEventListener('submit', event => {\n" +
          '  event.preventDefault();\n' +
          '\n' +
          '  const formData = new FormData(form);\n' +
          '  const values = Object.fromEntries(formData.entries());\n' +
          '\n' +
          '  console.log(values);\n' +
          '});',
      },
      { type: 'h2', text: 'Better validation UX' },
      {
        type: 'ul',
        items: [
          'Validate at submit time so users can type freely.',
          'Use clear messages that explain how to fix the problem.',
          'Move focus to the first invalid field after submit.',
          'Use aria-live or connected error text so assistive technology can announce changes.',
          'Keep server-side validation too, because browser validation can be bypassed.',
        ],
      },
      {
        type: 'warning',
        text: 'Client-side validation improves the experience, but it is not security. Always validate important data on the server as well.',
      },
      {
        type: 'try',
        text: 'Add password validation to a signup form. Show a helpful message when the password is shorter than 8 characters.',
      },
      {
        type: 'keypoints',
        items: [
          'Handle form submission with the submit event.',
          'Use constraint validation APIs like validity for built-in checks.',
          'FormData collects named form values.',
          'Accessible error messages make forms easier for everyone to use.',
          'Server-side validation is still required for real applications.',
        ],
      },
    ],
  },
];
