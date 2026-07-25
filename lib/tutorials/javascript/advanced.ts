import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'js-prototypes',
    title: 'Prototypes & Inheritance',
    description: 'Understand how JavaScript objects share behavior through prototypes, constructor functions, classes, and delegation.',
    level: 'advanced',
    section: 'Deep JavaScript',
    order: 51,
    minutes: 16,
    content: [
      { type: 'p', text: 'JavaScript inheritance is based on prototypes. A prototype is another object that JavaScript can search when a property or method is not found on the current object.' },
      { type: 'p', text: 'Think of an object as a backpack. If the thing you need is not inside the backpack, JavaScript checks a shared classroom shelf called the prototype. This is called delegation.' },
      { type: 'h2', text: 'The prototype chain' },
      { type: 'p', text: 'When you read a property, JavaScript looks in one place at a time: the object itself, then its prototype, then that prototype\'s prototype, and so on until it reaches null.' },
      {
        type: 'code',
        title: 'Looking up a method through the prototype chain',
        language: 'javascript',
        code: `const user = {
  name: 'Amina'
};

console.log(user.name); // Found directly on user
console.log(user.toString()); // Found on Object.prototype

console.log(Object.getPrototypeOf(user) === Object.prototype); // true`,
      },
      { type: 'note', text: 'Methods like toString are not copied into every object. They are shared through Object.prototype, which saves memory and keeps behavior consistent.' },
      { type: 'h2', text: 'Creating shared behavior' },
      { type: 'p', text: 'You can create an object and choose another object as its prototype with Object.create. This is one of the clearest ways to see prototype delegation.' },
      {
        type: 'code',
        title: 'Object.create for delegation',
        language: 'javascript',
        code: `const animalActions = {
  eat() {
    return this.name + ' is eating.';
  },
  sleep() {
    return this.name + ' is sleeping.';
  }
};

const cat = Object.create(animalActions);
cat.name = 'Milo';

console.log(cat.eat()); // Milo is eating.`,
      },
      { type: 'h2', text: 'Constructor functions' },
      { type: 'p', text: 'Before class syntax, JavaScript commonly used constructor functions. When a function is called with new, JavaScript creates a new object, links it to the function prototype, and returns it.' },
      {
        type: 'code',
        title: 'Constructor function with prototype methods',
        language: 'javascript',
        code: `function Product(name, price) {
  this.name = name;
  this.price = price;
}

Product.prototype.formatPrice = function () {
  return '$' + this.price.toFixed(2);
};

const keyboard = new Product('Keyboard', 49.99);
console.log(keyboard.formatPrice()); // $49.99`,
      },
      { type: 'h2', text: 'Classes are prototype syntax' },
      { type: 'p', text: 'The class keyword is friendlier syntax over the same prototype system. Methods written inside a class are placed on the prototype, not recreated on every instance.' },
      {
        type: 'code',
        title: 'Class syntax still uses prototypes',
        language: 'javascript',
        code: `class CartItem {
  constructor(name, quantity) {
    this.name = name;
    this.quantity = quantity;
  }

  label() {
    return this.quantity + ' x ' + this.name;
  }
}

const item = new CartItem('Notebook', 3);

console.log(item.label()); // 3 x Notebook
console.log(Object.getPrototypeOf(item) === CartItem.prototype); // true`,
      },
      { type: 'h2', text: 'Inheritance with extends' },
      { type: 'p', text: 'The extends keyword creates a prototype chain between classes. Use it when a child object truly is a more specific kind of parent object.' },
      {
        type: 'code',
        title: 'Extending a class',
        language: 'javascript',
        code: `class NotificationMessage {
  constructor(text) {
    this.text = text;
  }

  preview() {
    return this.text.slice(0, 30);
  }
}

class SuccessMessage extends NotificationMessage {
  icon() {
    return 'check';
  }
}

const message = new SuccessMessage('Saved successfully');
console.log(message.preview()); // Saved successfully
console.log(message.icon()); // check`,
      },
      { type: 'warning', text: 'Avoid deep inheritance trees in frontend code. They can make behavior hard to trace. Composition and small helper functions are often easier to maintain.' },
      {
        type: 'table',
        headers: ['Tool', 'Use it for', 'Frontend example'],
        rows: [
          ['Object.create', 'Direct prototype delegation', 'Create simple shared behavior for objects'],
          ['Constructor function', 'Older JavaScript patterns', 'Understanding older libraries'],
          ['class', 'Readable object blueprints', 'UI models, services, reusable data objects'],
          ['extends', 'Specialized versions of a base type', 'A specific validator that extends a generic validator'],
        ],
      },
      { type: 'try', text: 'Create a base object called formField with a validate method. Then create emailField from it using Object.create and call the inherited method.' },
      {
        type: 'keypoints',
        items: [
          'JavaScript objects delegate missing property lookups to their prototype.',
          'A prototype chain continues until JavaScript reaches null.',
          'Class syntax is easier to read, but it still uses prototypes underneath.',
          'Favor shallow inheritance and clear composition in frontend applications.',
        ],
      },
    ],
  },
  {
    slug: 'js-execution',
    title: 'Execution Context & Call Stack',
    description: 'Learn how JavaScript runs code, stores local variables, handles function calls, and reports stack errors.',
    level: 'advanced',
    section: 'Deep JavaScript',
    order: 52,
    minutes: 15,
    content: [
      { type: 'p', text: 'JavaScript does not run all your code at once. It creates execution contexts, which are like workspaces for the currently running code.' },
      { type: 'p', text: 'Each function call gets its own workspace. That workspace contains parameters, local variables, the value of this, and a reference to the outer scope.' },
      { type: 'h2', text: 'Global and function execution contexts' },
      { type: 'p', text: 'The global execution context is created first. Then each function call creates a new function execution context while it is running.' },
      {
        type: 'code',
        title: 'Each function call has its own local workspace',
        language: 'javascript',
        code: `const taxRate = 0.08;

function calculateTotal(price) {
  const tax = price * taxRate;
  return price + tax;
}

const total = calculateTotal(100);
console.log(total); // 108`,
      },
      { type: 'note', text: 'The calculateTotal function can read taxRate because it remembers the outer scope where it was created.' },
      { type: 'h2', text: 'The call stack' },
      { type: 'p', text: 'The call stack is a stack of active function calls. The most recent function is placed on top. When that function finishes, it is removed.' },
      {
        type: 'code',
        title: 'Following stack order',
        language: 'javascript',
        code: `function first() {
  second();
  console.log('First done');
}

function second() {
  third();
  console.log('Second done');
}

function third() {
  console.log('Third done');
}

first();`,
      },
      {
        type: 'ol',
        items: [
          'JavaScript starts in the global context.',
          'first is called and added to the stack.',
          'second is called from inside first and added on top.',
          'third is called from inside second and added on top.',
          'third finishes first, then second, then first.',
        ],
      },
      { type: 'h2', text: 'Stack traces help you debug' },
      { type: 'p', text: 'When an error happens, the browser shows a stack trace. Read it from the error location back through the calls that led there.' },
      {
        type: 'code',
        title: 'A useful stack trace example',
        language: 'javascript',
        code: `function renderUser(user) {
  return user.profile.name;
}

function renderPage() {
  const currentUser = null;
  renderUser(currentUser);
}

renderPage(); // TypeError: Cannot read properties of null`,
      },
      { type: 'tip', text: 'In DevTools, click a stack frame to jump to the line that was running at that moment. This is often faster than searching manually.' },
      { type: 'h2', text: 'Hoisting and the creation phase' },
      { type: 'p', text: 'Before JavaScript executes a context line by line, it prepares declarations. Function declarations are ready to call. let and const exist but cannot be used before their declaration line.' },
      {
        type: 'code',
        title: 'Hoisting differences',
        language: 'javascript',
        code: `sayHello(); // Works

function sayHello() {
  console.log('Hello');
}

// console.log(count); // ReferenceError
const count = 1;`,
      },
      { type: 'h2', text: 'Recursion and stack limits' },
      { type: 'p', text: 'A recursive function calls itself. It must have a stopping condition, or it will keep adding calls until the stack overflows.' },
      {
        type: 'code',
        title: 'Safe recursion with a base case',
        language: 'javascript',
        code: `function countdown(number) {
  if (number <= 0) {
    return 'Done';
  }

  console.log(number);
  return countdown(number - 1);
}

countdown(3);`,
      },
      {
        type: 'keypoints',
        items: [
          'An execution context is the environment for currently running code.',
          'The call stack tracks active function calls in last-in, first-out order.',
          'Stack traces show the path of function calls that caused an error.',
          'Hoisting prepares declarations before code executes line by line.',
        ],
      },
    ],
  },
  {
    slug: 'js-event-loop',
    title: 'Event Loop & Microtasks',
    description: 'Understand asynchronous JavaScript, browser task queues, promises, timers, rendering, and microtasks.',
    level: 'advanced',
    section: 'Deep JavaScript',
    order: 53,
    minutes: 18,
    content: [
      { type: 'p', text: 'JavaScript runs one piece of code at a time, but browsers still handle clicks, network responses, timers, and screen updates. The event loop coordinates this work.' },
      { type: 'p', text: 'Imagine a single cashier. Customers can wait in different lines, but only one customer is served at a time. The event loop decides which line gets served next.' },
      { type: 'h2', text: 'Synchronous code runs first' },
      {
        type: 'code',
        title: 'Synchronous lines finish before queued callbacks',
        language: 'javascript',
        code: `console.log('A');

setTimeout(function () {
  console.log('B');
}, 0);

console.log('C');

// A
// C
// B`,
      },
      { type: 'p', text: 'Even with a delay of 0, setTimeout does not interrupt the current script. Its callback waits until the current call stack is empty.' },
      { type: 'h2', text: 'Tasks and microtasks' },
      { type: 'p', text: 'Timers, events, and many browser callbacks use the task queue. Promise callbacks use the microtask queue, which runs before the browser takes the next task.' },
      {
        type: 'code',
        title: 'Promise microtasks run before timer tasks',
        language: 'javascript',
        code: `console.log('start');

setTimeout(function () {
  console.log('timer');
}, 0);

Promise.resolve().then(function () {
  console.log('promise');
});

console.log('end');

// start
// end
// promise
// timer`,
      },
      {
        type: 'table',
        headers: ['Queue', 'Common examples', 'When it runs'],
        rows: [
          ['Call stack', 'Current script and active functions', 'Immediately'],
          ['Microtask queue', 'Promise.then, queueMicrotask', 'After stack clears, before next task'],
          ['Task queue', 'setTimeout, click events, message events', 'One task at a time after microtasks'],
          ['Render step', 'Paint and layout updates', 'Between tasks when the browser is ready'],
        ],
      },
      { type: 'h2', text: 'Why microtasks matter in UI code' },
      { type: 'p', text: 'Microtasks are useful for finishing tiny async follow-up work before the browser handles the next event. Too many microtasks can delay rendering and make the page feel frozen.' },
      {
        type: 'code',
        title: 'queueMicrotask for small follow-up work',
        language: 'javascript',
        code: `function updateState(nextValue) {
  state.value = nextValue;

  queueMicrotask(function () {
    console.log('State changed to', state.value);
  });
}

const state = { value: 'idle' };
updateState('loading');`,
      },
      { type: 'warning', text: 'Do not create endless chains of Promise callbacks. Microtasks run before rendering, so a long chain can block the browser from painting updates.' },
      { type: 'h2', text: 'Animation frames' },
      { type: 'p', text: 'requestAnimationFrame schedules code before the next paint. It is the right place for visual updates that should match the browser refresh rate.' },
      {
        type: 'code',
        title: 'Using requestAnimationFrame for visual work',
        language: 'javascript',
        code: `const box = document.querySelector('.box');
let x = 0;

function move() {
  x += 2;
  box.style.transform = 'translateX(' + x + 'px)';

  if (x < 200) {
    requestAnimationFrame(move);
  }
}

requestAnimationFrame(move);`,
      },
      { type: 'h2', text: 'Async and await still use promises' },
      { type: 'p', text: 'async and await make promise code easier to read. After an await, the rest of the function continues later as a microtask.' },
      {
        type: 'code',
        title: 'Await pauses the async function, not the whole page',
        language: 'javascript',
        code: `async function loadUser() {
  console.log('before fetch');
  const response = await fetch('/api/user');
  const user = await response.json();
  console.log(user.name);
}

loadUser();
console.log('page can keep working');`,
      },
      { type: 'try', text: 'Predict the output order of a script that uses console.log, Promise.resolve().then, setTimeout, and requestAnimationFrame. Then run it in DevTools to check yourself.' },
      {
        type: 'keypoints',
        items: [
          'JavaScript executes one call stack at a time.',
          'Promise callbacks are microtasks and usually run before timer callbacks.',
          'Rendering happens between turns of the event loop when the browser gets a chance.',
          'Use requestAnimationFrame for smooth visual updates.',
        ],
      },
    ],
  },
  {
    slug: 'js-memory',
    title: 'Memory, References & Immutability',
    description: 'Learn how JavaScript stores values, shares object references, copies data, and uses immutable update patterns.',
    level: 'advanced',
    section: 'Deep JavaScript',
    order: 54,
    minutes: 17,
    content: [
      { type: 'p', text: 'Frontend applications constantly move data around: user objects, cart items, form state, API responses, and cached values. Understanding references helps prevent surprising bugs.' },
      { type: 'h2', text: 'Primitive values vs object references' },
      { type: 'p', text: 'Primitive values like strings, numbers, booleans, null, undefined, symbols, and bigints behave like copied notes. Objects and arrays behave like addresses to shared data.' },
      {
        type: 'code',
        title: 'Objects are shared by reference',
        language: 'javascript',
        code: `const firstUser = { name: 'Lina', role: 'admin' };
const secondUser = firstUser;

secondUser.role = 'editor';

console.log(firstUser.role); // editor`,
      },
      { type: 'note', text: 'secondUser did not copy the object. It copied the reference, so both variables point to the same object in memory.' },
      { type: 'h2', text: 'Shallow copies' },
      { type: 'p', text: 'A shallow copy creates a new outer object or array, but nested objects are still shared. This is enough for many simple updates, but not for deeply nested state.' },
      {
        type: 'code',
        title: 'Copying objects and arrays',
        language: 'javascript',
        code: `const settings = {
  theme: 'dark',
  layout: {
    sidebar: true
  }
};

const copy = { ...settings };
copy.theme = 'light';
copy.layout.sidebar = false;

console.log(settings.theme); // dark
console.log(settings.layout.sidebar); // false`,
      },
      { type: 'warning', text: 'The spread operator only copied the first level. The nested layout object was still shared.' },
      { type: 'h2', text: 'Immutable updates' },
      { type: 'p', text: 'An immutable update creates new data instead of changing existing data. This makes changes easier to track, especially in React, Vue stores, reducers, and undo systems.' },
      {
        type: 'code',
        title: 'Immutable update for nested data',
        language: 'javascript',
        code: `const profile = {
  name: 'Noah',
  preferences: {
    theme: 'dark',
    emailUpdates: true
  }
};

const updatedProfile = {
  ...profile,
  preferences: {
    ...profile.preferences,
    theme: 'light'
  }
};

console.log(profile.preferences.theme); // dark
console.log(updatedProfile.preferences.theme); // light`,
      },
      { type: 'h2', text: 'Array updates without mutation' },
      {
        type: 'code',
        title: 'Common immutable array patterns',
        language: 'javascript',
        code: `const tasks = [
  { id: 1, text: 'Learn prototypes', done: false },
  { id: 2, text: 'Practice fetch', done: false }
];

const withNewTask = [...tasks, { id: 3, text: 'Build app', done: false }];

const completedTasks = tasks.map(function (task) {
  if (task.id === 2) {
    return { ...task, done: true };
  }

  return task;
});

const remainingTasks = tasks.filter(function (task) {
  return task.id !== 1;
});`,
      },
      {
        type: 'table',
        headers: ['Goal', 'Mutable approach', 'Immutable approach'],
        rows: [
          ['Add item', 'array.push(item)', '[...array, item]'],
          ['Remove item', 'array.splice(index, 1)', 'array.filter(...)'],
          ['Update item', 'array[index] = next', 'array.map(...)'],
          ['Update property', 'object.name = next', '{ ...object, name: next }'],
        ],
      },
      { type: 'h2', text: 'Garbage collection' },
      { type: 'p', text: 'JavaScript automatically frees memory when values are no longer reachable. If your app accidentally keeps references, the browser cannot clean those values up.' },
      {
        type: 'code',
        title: 'Cleaning up event listeners',
        language: 'javascript',
        code: `function openPanel(button) {
  function handleClick() {
    console.log('Panel button clicked');
  }

  button.addEventListener('click', handleClick);

  return function cleanup() {
    button.removeEventListener('click', handleClick);
  };
}

const cleanupPanel = openPanel(document.querySelector('#panel-button'));
cleanupPanel();`,
      },
      { type: 'tip', text: 'When a component, modal, or page section is removed, also remove timers, observers, and event listeners created for it.' },
      {
        type: 'keypoints',
        items: [
          'Objects and arrays are assigned by reference.',
          'Shallow copies do not copy nested objects.',
          'Immutable updates make frontend state changes easier to reason about.',
          'Memory leaks often happen when old event listeners, timers, or references are kept alive.',
        ],
      },
    ],
  },
  {
    slug: 'js-debounce-throttle',
    title: 'Debounce & Throttle',
    description: 'Control noisy events like typing, scrolling, and resizing with debounce and throttle performance patterns.',
    level: 'advanced',
    section: 'Performance Patterns',
    order: 55,
    minutes: 14,
    content: [
      { type: 'p', text: 'Some browser events fire many times per second. Search input, resize, scroll, and mousemove can call your code more often than needed.' },
      { type: 'p', text: 'Debounce and throttle are two patterns that slow down event handling. They protect your UI from unnecessary work.' },
      { type: 'h2', text: 'Debounce: wait until the user pauses' },
      { type: 'p', text: 'Debounce is like waiting until someone stops talking before replying. It runs the function only after events stop for a chosen delay.' },
      {
        type: 'code',
        title: 'Debounce helper',
        language: 'javascript',
        code: `function debounce(callback, delay) {
  let timerId;

  return function (...args) {
    clearTimeout(timerId);

    timerId = setTimeout(function () {
      callback.apply(this, args);
    }.bind(this), delay);
  };
}`,
      },
      {
        type: 'code',
        title: 'Debounced search input',
        language: 'javascript',
        code: `const input = document.querySelector('#search');
const results = document.querySelector('#results');

const searchProducts = debounce(async function (event) {
  const query = event.target.value.trim();

  if (query.length < 2) {
    results.textContent = 'Type at least 2 characters.';
    return;
  }

  results.textContent = 'Searching...';
  const response = await fetch('/api/products?q=' + encodeURIComponent(query));
  const products = await response.json();
  results.textContent = products.length + ' products found';
}, 400);

input.addEventListener('input', searchProducts);`,
      },
      { type: 'h2', text: 'Throttle: run at a steady maximum rate' },
      { type: 'p', text: 'Throttle is like checking your mailbox once every hour. Even if many events happen, the function runs at most once per interval.' },
      {
        type: 'code',
        title: 'Throttle helper',
        language: 'javascript',
        code: `function throttle(callback, delay) {
  let lastRun = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastRun >= delay) {
      lastRun = now;
      callback.apply(this, args);
    }
  };
}`,
      },
      {
        type: 'code',
        title: 'Throttled scroll progress',
        language: 'javascript',
        code: `const progress = document.querySelector('#scroll-progress');

const updateProgress = throttle(function () {
  const scrollTop = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = Math.round((scrollTop / pageHeight) * 100);

  progress.style.width = percent + '%';
}, 100);

window.addEventListener('scroll', updateProgress);`,
      },
      {
        type: 'table',
        headers: ['Pattern', 'Best for', 'Example'],
        rows: [
          ['Debounce', 'Run after activity stops', 'Search box, username availability check'],
          ['Throttle', 'Run at a steady limit', 'Scroll progress, resize measurements'],
          ['requestAnimationFrame', 'Visual updates before paint', 'Animating position or opacity'],
        ],
      },
      { type: 'h2', text: 'Choosing the right delay' },
      { type: 'ul', items: ['Search input: 300 to 500ms often feels natural.', 'Resize or scroll calculations: 100 to 250ms is usually enough.', 'Visual animation: prefer requestAnimationFrame instead of a fixed timer.', 'Accessibility: do not delay critical feedback such as form errors for too long.'] },
      { type: 'warning', text: 'Debouncing a submit button is not a replacement for disabling it during a request. Protect both the frontend and the backend from duplicate actions.' },
      { type: 'try', text: 'Create an input that logs its value. First log every input event, then wrap the logger in debounce and compare how often it runs.' },
      {
        type: 'keypoints',
        items: [
          'Debounce waits until events pause.',
          'Throttle runs at most once per interval.',
          'Use these patterns for noisy browser events.',
          'Choose delays that improve performance without making the interface feel slow.',
        ],
      },
    ],
  },
  {
    slug: 'js-intersection',
    title: 'Intersection Observer',
    description: 'Use Intersection Observer to detect visible elements, lazy-load content, trigger animations, and improve scroll performance.',
    level: 'advanced',
    section: 'Performance Patterns',
    order: 56,
    minutes: 13,
    content: [
      { type: 'p', text: 'Intersection Observer tells you when an element enters or leaves another visible area, usually the browser viewport.' },
      { type: 'p', text: 'Instead of constantly asking "is this element visible yet?" during scroll events, you ask the browser to notify you at the right time.' },
      { type: 'h2', text: 'Basic observer setup' },
      {
        type: 'code',
        title: 'Observe when cards enter the viewport',
        language: 'javascript',
        code: `const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
});

cards.forEach(function (card) {
  observer.observe(card);
});`,
      },
      { type: 'h2', text: 'Understanding entries' },
      { type: 'p', text: 'Each entry describes one observed element at one moment. The most common properties are target, isIntersecting, intersectionRatio, and boundingClientRect.' },
      {
        type: 'table',
        headers: ['Property', 'Meaning'],
        rows: [
          ['target', 'The element being observed'],
          ['isIntersecting', 'true when the element crosses the visibility rule'],
          ['intersectionRatio', 'How much of the element is visible, from 0 to 1'],
          ['boundingClientRect', 'The element size and position'],
        ],
      },
      { type: 'h2', text: 'Lazy-loading images' },
      {
        type: 'code',
        title: 'Load image src only when needed',
        language: 'javascript',
        code: `const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) {
      return;
    }

    const image = entry.target;
    image.src = image.dataset.src;
    image.removeAttribute('data-src');
    observer.unobserve(image);
  });
}, {
  rootMargin: '200px'
});

lazyImages.forEach(function (image) {
  imageObserver.observe(image);
});`,
      },
      { type: 'tip', text: 'rootMargin lets you load content before it is actually visible. A value like 200px gives images time to download before the user reaches them.' },
      { type: 'h2', text: 'Infinite scrolling sentinel' },
      { type: 'p', text: 'A sentinel is a small marker element near the bottom of a list. When it becomes visible, you load the next page.' },
      {
        type: 'code',
        title: 'Load more when the sentinel appears',
        language: 'javascript',
        code: `const list = document.querySelector('#posts');
const sentinel = document.querySelector('#load-more-sentinel');
let page = 1;
let loading = false;

async function loadMorePosts() {
  if (loading) {
    return;
  }

  loading = true;
  const response = await fetch('/api/posts?page=' + page);
  const posts = await response.json();

  posts.forEach(function (post) {
    const item = document.createElement('li');
    item.textContent = post.title;
    list.append(item);
  });

  page += 1;
  loading = false;
}

const sentinelObserver = new IntersectionObserver(function (entries) {
  if (entries[0].isIntersecting) {
    loadMorePosts();
  }
});

sentinelObserver.observe(sentinel);`,
      },
      { type: 'warning', text: 'Always guard against duplicate loads. Intersection callbacks can fire more than once while the sentinel remains visible.' },
      { type: 'h2', text: 'Cleaning up observers' },
      {
        type: 'code',
        title: 'Disconnect when no longer needed',
        language: 'javascript',
        code: `const observer = new IntersectionObserver(function (entries) {
  console.log(entries);
});

observer.observe(document.querySelector('#panel'));

function destroyPanel() {
  observer.disconnect();
}`,
      },
      {
        type: 'keypoints',
        items: [
          'Intersection Observer is usually better than scroll events for visibility checks.',
          'Use rootMargin to preload content before it reaches the viewport.',
          'Unobserve elements after one-time work such as lazy-loading an image.',
          'Disconnect observers when a feature or page section is destroyed.',
        ],
      },
    ],
  },
  {
    slug: 'js-web-apis',
    title: 'Useful Web APIs',
    description: 'Explore practical browser APIs for storage, URLs, forms, network status, dialogs, history, and small frontend features.',
    level: 'advanced',
    section: 'Browser APIs',
    order: 57,
    minutes: 18,
    content: [
      { type: 'p', text: 'JavaScript in the browser has access to many Web APIs. These are features provided by the browser, not by the JavaScript language itself.' },
      { type: 'p', text: 'Good frontend developers know when the browser already has a built-in tool. This can reduce dependencies and make features lighter.' },
      { type: 'h2', text: 'Storage APIs' },
      { type: 'p', text: 'localStorage stores small strings that remain after the browser closes. sessionStorage stores small strings for the current tab session.' },
      {
        type: 'code',
        title: 'Saving simple preferences',
        language: 'javascript',
        code: `const themeSelect = document.querySelector('#theme');

themeSelect.value = localStorage.getItem('theme') || 'light';

themeSelect.addEventListener('change', function () {
  localStorage.setItem('theme', themeSelect.value);
  document.documentElement.dataset.theme = themeSelect.value;
});`,
      },
      { type: 'warning', text: 'Do not store passwords, tokens, or sensitive personal data in localStorage for learning projects. Treat browser storage as readable by scripts on the page.' },
      { type: 'h2', text: 'URL and URLSearchParams' },
      {
        type: 'code',
        title: 'Read and update query parameters',
        language: 'javascript',
        code: `const url = new URL(window.location.href);
const params = url.searchParams;

const currentPage = Number(params.get('page') || '1');
params.set('page', String(currentPage + 1));

history.pushState(null, '', url);`,
      },
      { type: 'h2', text: 'FormData' },
      { type: 'p', text: 'FormData reads fields from a form element. It is useful for submitting forms with fetch, especially when files are involved.' },
      {
        type: 'code',
        title: 'Submit a form with FormData',
        language: 'javascript',
        code: `const form = document.querySelector('#profile-form');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const data = new FormData(form);
  const response = await fetch('/api/profile', {
    method: 'POST',
    body: data
  });

  console.log('Saved?', response.ok);
});`,
      },
      { type: 'h2', text: 'Network status' },
      {
        type: 'code',
        title: 'Show online and offline messages',
        language: 'javascript',
        code: `const status = document.querySelector('#network-status');

function updateNetworkStatus() {
  status.textContent = navigator.onLine ? 'Online' : 'Offline';
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

updateNetworkStatus();`,
      },
      { type: 'h2', text: 'Dialog element' },
      {
        type: 'code',
        title: 'Native modal dialog',
        language: 'html',
        code: `<button id="open-dialog">Open settings</button>

<dialog id="settings-dialog">
  <h2>Settings</h2>
  <p>Choose your preferences.</p>
  <button id="close-dialog">Close</button>
</dialog>

<script>
  const dialog = document.querySelector('#settings-dialog');

  document.querySelector('#open-dialog').addEventListener('click', function () {
    dialog.showModal();
  });

  document.querySelector('#close-dialog').addEventListener('click', function () {
    dialog.close();
  });
</script>`,
      },
      {
        type: 'table',
        headers: ['API', 'Use case', 'Quick reminder'],
        rows: [
          ['localStorage', 'Small saved preferences', 'Stores strings only'],
          ['URLSearchParams', 'Filters, pages, shareable state', 'Works with query strings'],
          ['FormData', 'Form submission', 'Great for files and regular fields'],
          ['History API', 'Update URL without reload', 'Use pushState or replaceState'],
          ['Dialog', 'Native modal UI', 'Remember accessibility and focus behavior'],
        ],
      },
      { type: 'try', text: 'Build a filter bar that stores the selected category in the URL query string and restores it when the page reloads.' },
      {
        type: 'keypoints',
        items: [
          'Web APIs are browser-provided features available to JavaScript.',
          'Use URLSearchParams for readable filter and pagination URLs.',
          'Use FormData for practical form submissions.',
          'Choose built-in browser APIs before adding a dependency for small features.',
        ],
      },
    ],
  },
  {
    slug: 'js-clipboard-share',
    title: 'Clipboard, Share & Notifications',
    description: 'Use permission-aware browser APIs for copying text, native sharing, and showing notifications.',
    level: 'advanced',
    section: 'Browser APIs',
    order: 58,
    minutes: 12,
    content: [
      { type: 'p', text: 'Clipboard, sharing, and notifications can make a web app feel more native. They also involve user trust, so browsers place limits around them.' },
      { type: 'h2', text: 'Clipboard API' },
      { type: 'p', text: 'The Clipboard API can copy text after a user action, such as clicking a button. Most browsers require HTTPS or localhost.' },
      {
        type: 'code',
        title: 'Copy a link to the clipboard',
        language: 'javascript',
        code: `const copyButton = document.querySelector('#copy-link');
const message = document.querySelector('#copy-message');

copyButton.addEventListener('click', async function () {
  try {
    await navigator.clipboard.writeText(window.location.href);
    message.textContent = 'Link copied!';
  } catch (error) {
    message.textContent = 'Copy failed. Please copy the address manually.';
  }
});`,
      },
      { type: 'tip', text: 'Always show feedback after copying. Users cannot see the clipboard, so a small message confirms the action worked.' },
      { type: 'h2', text: 'Web Share API' },
      { type: 'p', text: 'The Web Share API opens the device native share sheet when available. It is especially useful on mobile.' },
      {
        type: 'code',
        title: 'Share a page when supported',
        language: 'javascript',
        code: `const shareButton = document.querySelector('#share');

shareButton.addEventListener('click', async function () {
  if (!navigator.share) {
    alert('Sharing is not supported in this browser.');
    return;
  }

  try {
    await navigator.share({
      title: document.title,
      text: 'Check out this page.',
      url: window.location.href
    });
  } catch (error) {
    console.log('Share cancelled or failed');
  }
});`,
      },
      { type: 'h2', text: 'Notifications' },
      { type: 'p', text: 'Notifications should be used carefully. Ask permission only when the user understands why notifications are useful.' },
      {
        type: 'code',
        title: 'Request permission and show a notification',
        language: 'javascript',
        code: `const notifyButton = document.querySelector('#notify');

notifyButton.addEventListener('click', async function () {
  if (!('Notification' in window)) {
    alert('Notifications are not supported.');
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    new Notification('Reminder', {
      body: 'Your timer is complete.'
    });
  }
});`,
      },
      {
        type: 'table',
        headers: ['Feature', 'Needs user gesture?', 'Common fallback'],
        rows: [
          ['Clipboard write', 'Usually yes', 'Select text and ask user to copy'],
          ['Web Share', 'Yes', 'Copy link button'],
          ['Notifications', 'Permission required', 'In-page alert or badge'],
        ],
      },
      { type: 'warning', text: 'Do not ask for notification permission on page load. This often feels spammy and can make users block your site.' },
      { type: 'h2', text: 'Progressive enhancement' },
      { type: 'p', text: 'Progressive enhancement means you check whether a feature exists and provide a simple fallback when it does not.' },
      {
        type: 'code',
        title: 'Feature detection pattern',
        language: 'javascript',
        code: `function canCopy() {
  return Boolean(navigator.clipboard && navigator.clipboard.writeText);
}

if (canCopy()) {
  console.log('Modern copy supported');
} else {
  console.log('Show manual copy instructions');
}`,
      },
      {
        type: 'keypoints',
        items: [
          'Clipboard, sharing, and notifications depend on browser support and user trust.',
          'Use feature detection before calling optional APIs.',
          'Ask for permission only when there is clear value.',
          'Provide visible feedback and fallbacks.',
        ],
      },
    ],
  },
  {
    slug: 'js-patterns',
    title: 'Clean Frontend Patterns',
    description: 'Write cleaner frontend JavaScript with state, rendering, event delegation, modules, data attributes, and pure functions.',
    level: 'advanced',
    section: 'Pro Patterns',
    order: 59,
    minutes: 18,
    content: [
      { type: 'p', text: 'Clean frontend code is code you can change without fear. It separates data, UI rendering, and user events so each part has a clear job.' },
      { type: 'h2', text: 'Keep state in one obvious place' },
      { type: 'p', text: 'State is the data your UI depends on. For a small app, a plain object can be enough.' },
      {
        type: 'code',
        title: 'Simple central state',
        language: 'javascript',
        code: `const state = {
  filter: 'all',
  todos: [
    { id: 1, text: 'Learn JavaScript patterns', done: false }
  ]
};`,
      },
      { type: 'h2', text: 'Render from state' },
      { type: 'p', text: 'A reliable UI can be recreated from the current state. Instead of manually changing many small DOM pieces, update state and render the view.' },
      {
        type: 'code',
        title: 'Render list items from state',
        language: 'javascript',
        code: `function renderTodos() {
  const list = document.querySelector('#todo-list');
  list.innerHTML = '';

  state.todos.forEach(function (todo) {
    const item = document.createElement('li');
    item.textContent = todo.text;
    item.className = todo.done ? 'done' : '';
    list.append(item);
  });
}`,
      },
      { type: 'h2', text: 'Use event delegation' },
      { type: 'p', text: 'Event delegation means listening on a parent element and checking which child was clicked. This works well for dynamic lists.' },
      {
        type: 'code',
        title: 'Handle clicks from a list parent',
        language: 'javascript',
        code: `document.querySelector('#todo-list').addEventListener('click', function (event) {
  const button = event.target.closest('[data-action]');

  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'toggle') {
    toggleTodo(id);
  }

  if (action === 'delete') {
    deleteTodo(id);
  }
});`,
      },
      { type: 'tip', text: 'Data attributes are a clean bridge between HTML and JavaScript. They let markup describe what action should happen without hard-coding many separate selectors.' },
      { type: 'h2', text: 'Prefer pure helpers' },
      { type: 'p', text: 'A pure function uses its inputs and returns a result without changing outside state. Pure helpers are easier to test and reuse.' },
      {
        type: 'code',
        title: 'Pure state update helper',
        language: 'javascript',
        code: `function toggleTodoById(todos, id) {
  return todos.map(function (todo) {
    if (todo.id === id) {
      return { ...todo, done: !todo.done };
    }

    return todo;
  });
}`,
      },
      { type: 'h2', text: 'Small modules' },
      { type: 'p', text: 'Modules let you split code by responsibility. A small frontend app might have files for state, API calls, rendering, and event setup.' },
      {
        type: 'code',
        title: 'Example module exports',
        language: 'javascript',
        code: `// api.js
export async function getProducts() {
  const response = await fetch('/api/products');

  if (!response.ok) {
    throw new Error('Failed to load products');
  }

  return response.json();
}

// format.js
export function formatMoney(value) {
  return '$' + value.toFixed(2);
}`,
      },
      {
        type: 'table',
        headers: ['Pattern', 'Benefit'],
        rows: [
          ['Central state', 'You know where data lives'],
          ['Render from state', 'UI stays predictable'],
          ['Event delegation', 'Dynamic lists need fewer listeners'],
          ['Pure helpers', 'Logic is easier to test'],
          ['Modules', 'Files have clear responsibilities'],
        ],
      },
      { type: 'try', text: 'Take a small script with many querySelector calls and refactor it into state, render, and event handler sections.' },
      {
        type: 'keypoints',
        items: [
          'Separate state, rendering, events, and side effects.',
          'Use data attributes for flexible event handling.',
          'Pure helper functions make logic easier to trust.',
          'Clean patterns are useful even before you learn a framework.',
        ],
      },
    ],
  },
  {
    slug: 'js-architecture',
    title: 'Structuring Frontend JS',
    description: 'Organize frontend JavaScript applications with modules, feature folders, services, state, rendering, and cleanup boundaries.',
    level: 'advanced',
    section: 'Pro Patterns',
    order: 60,
    minutes: 17,
    content: [
      { type: 'p', text: 'As a frontend project grows, code organization becomes a feature. Good structure helps you find code, change behavior, and avoid accidental bugs.' },
      { type: 'h2', text: 'Start with responsibilities' },
      { type: 'p', text: 'A useful structure often separates API access, state changes, DOM rendering, event binding, and utilities. Each file should answer one main question.' },
      {
        type: 'code',
        title: 'Small app folder idea',
        language: 'javascript',
        code: `src/
  app.js
  features/
    cart/
      cart-api.js
      cart-state.js
      cart-render.js
      cart-events.js
  shared/
    format-money.js
    storage.js`,
      },
      { type: 'h2', text: 'The app entry file' },
      { type: 'p', text: 'The entry file should wire the app together. Keep detailed logic in feature files so app.js stays readable.' },
      {
        type: 'code',
        title: 'Entry module that initializes features',
        language: 'javascript',
        code: `import { initCart } from './features/cart/cart-events.js';
import { restoreCart } from './features/cart/cart-state.js';
import { renderCart } from './features/cart/cart-render.js';

restoreCart();
renderCart();
initCart();`,
      },
      { type: 'h2', text: 'Services for side effects' },
      { type: 'p', text: 'A service function wraps a side effect such as fetch, storage, or analytics. This keeps side effects from spreading through every file.' },
      {
        type: 'code',
        title: 'API service with error handling',
        language: 'javascript',
        code: `export async function requestJson(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error('Request failed with status ' + response.status);
  }

  return response.json();
}`,
      },
      { type: 'h2', text: 'Feature state module' },
      {
        type: 'code',
        title: 'State module with controlled updates',
        language: 'javascript',
        code: `const state = {
  items: []
};

export function getCartItems() {
  return state.items;
}

export function addCartItem(product) {
  state.items = [...state.items, product];
}

export function removeCartItem(id) {
  state.items = state.items.filter(function (item) {
    return item.id !== id;
  });
}`,
      },
      { type: 'h2', text: 'Rendering module' },
      {
        type: 'code',
        title: 'Renderer reads state and updates DOM',
        language: 'javascript',
        code: `import { getCartItems } from './cart-state.js';

export function renderCart() {
  const list = document.querySelector('#cart-items');
  const items = getCartItems();

  list.innerHTML = '';

  items.forEach(function (item) {
    const row = document.createElement('li');
    row.textContent = item.name + ' - $' + item.price.toFixed(2);
    list.append(row);
  });
}`,
      },
      { type: 'h2', text: 'Lifecycle and cleanup' },
      { type: 'p', text: 'When a page section is mounted, it may add listeners, timers, and observers. Return a cleanup function so the section can be removed safely.' },
      {
        type: 'code',
        title: 'Setup function that returns cleanup',
        language: 'javascript',
        code: `export function mountSearch(element) {
  function handleInput(event) {
    console.log('Searching for', event.target.value);
  }

  element.addEventListener('input', handleInput);

  return function cleanupSearch() {
    element.removeEventListener('input', handleInput);
  };
}`,
      },
      {
        type: 'table',
        headers: ['Layer', 'Responsibility'],
        rows: [
          ['Entry', 'Start the app and connect features'],
          ['Feature state', 'Store and update feature data'],
          ['Render', 'Turn state into DOM'],
          ['Events', 'Translate user actions into state changes'],
          ['Services', 'Handle fetch, storage, and other side effects'],
          ['Shared utilities', 'Small reusable helpers'],
        ],
      },
      { type: 'tip', text: 'Do not split files only to look professional. Split when a file has more than one clear responsibility or becomes hard to scan.' },
      {
        type: 'keypoints',
        items: [
          'Structure frontend JavaScript around responsibilities.',
          'Keep app entry files small and readable.',
          'Wrap side effects in service functions.',
          'Return cleanup functions for features that add listeners, timers, or observers.',
        ],
      },
    ],
  },
  {
    slug: 'js-testing-mindset',
    title: 'Debugging & Testing Mindset',
    description: 'Develop a practical debugging and testing mindset for frontend JavaScript, from DevTools to small automated checks.',
    level: 'advanced',
    section: 'Pro Patterns',
    order: 61,
    minutes: 16,
    content: [
      { type: 'p', text: 'Advanced developers are not people who never write bugs. They are people who can find bugs calmly, reduce confusion, and protect important behavior with tests.' },
      { type: 'h2', text: 'Debugging starts with a question' },
      { type: 'p', text: 'Before changing code, write down what you expected and what actually happened. This turns a vague problem into something you can investigate.' },
      {
        type: 'ol',
        items: [
          'Reproduce the issue.',
          'Read the error message carefully.',
          'Find the smallest piece of code involved.',
          'Inspect values at the moment the bug happens.',
          'Make one change and test again.',
        ],
      },
      { type: 'h2', text: 'Use DevTools like a microscope' },
      {
        type: 'ul',
        items: [
          'Console: inspect values, warnings, and stack traces.',
          'Sources: add breakpoints and step through code.',
          'Network: inspect requests, responses, status codes, and timing.',
          'Elements: verify classes, attributes, layout, and event listeners.',
          'Performance: find slow rendering, long tasks, and layout thrashing.',
        ],
      },
      {
        type: 'code',
        title: 'Debug with clear labels',
        language: 'javascript',
        code: `function calculateDiscount(price, percent) {
  console.log('calculateDiscount input', { price: price, percent: percent });

  const discount = price * (percent / 100);
  console.log('calculateDiscount output', discount);

  return discount;
}`,
      },
      { type: 'tip', text: 'Use console.log with labels or objects. A label makes it much easier to understand logs when several functions run at the same time.' },
      { type: 'h2', text: 'What to test first' },
      { type: 'p', text: 'Start with functions that contain decisions: filtering, sorting, validation, formatting, permissions, and state updates. These are easier to test than visual details.' },
      {
        type: 'code',
        title: 'A tiny test without a library',
        language: 'javascript',
        code: `function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message + ': expected ' + expected + ', got ' + actual);
  }
}

function formatCount(count) {
  return count === 1 ? '1 item' : count + ' items';
}

assertEqual(formatCount(1), '1 item', 'singular label');
assertEqual(formatCount(3), '3 items', 'plural label');`,
      },
      { type: 'h2', text: 'Test pure logic separately from the DOM' },
      {
        type: 'code',
        title: 'Pure function that is easy to test',
        language: 'javascript',
        code: `export function getVisibleTodos(todos, filter) {
  if (filter === 'active') {
    return todos.filter(function (todo) {
      return !todo.done;
    });
  }

  if (filter === 'completed') {
    return todos.filter(function (todo) {
      return todo.done;
    });
  }

  return todos;
}`,
      },
      { type: 'h2', text: 'Manual test checklist' },
      {
        type: 'ul',
        items: [
          'Does the feature work with empty data?',
          'Does it work with one item and many items?',
          'What happens when the network fails?',
          'Can the user repeat the action quickly?',
          'Does keyboard navigation still work?',
          'Does the page recover after a refresh?',
        ],
      },
      { type: 'warning', text: 'Do not treat a passing happy path as complete testing. Many frontend bugs live in loading, empty, error, and repeated-action states.' },
      {
        type: 'table',
        headers: ['Problem', 'Useful tool'],
        rows: [
          ['Wrong value', 'Breakpoint or labeled console.log'],
          ['Request failed', 'Network panel'],
          ['Click not working', 'Elements event listeners and selector checks'],
          ['Slow page', 'Performance panel'],
          ['State changed unexpectedly', 'Immutable updates and step debugging'],
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Debugging is a repeatable process, not guessing.',
          'DevTools helps you inspect code, network, DOM, and performance.',
          'Pure functions are the easiest frontend code to test.',
          'Good testing includes empty, loading, error, and repeated-action states.',
        ],
      },
    ],
  },
  {
    slug: 'js-project-todo',
    title: 'Mini Project: Todo App',
    description: 'Build a complete todo app with state, rendering, event delegation, filters, persistence, and clean update functions.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 62,
    minutes: 20,
    content: [
      { type: 'p', text: 'This project brings together state, rendering, event handling, immutable updates, and localStorage. The app will add, complete, filter, delete, and save todos.' },
      { type: 'h2', text: 'What you will build' },
      { type: 'ul', items: ['A todo form for adding tasks.', 'A filter bar for all, active, and completed tasks.', 'A list rendered from state.', 'Buttons to toggle and delete tasks.', 'Persistence using localStorage.'] },
      { type: 'h2', text: 'Step 1: Create the HTML' },
      {
        type: 'code',
        title: 'index.html',
        language: 'html',
        code: `<main class="todo-app">
  <h1>Todo App</h1>

  <form id="todo-form">
    <label for="todo-input">New task</label>
    <input id="todo-input" name="todo" autocomplete="off" required>
    <button>Add</button>
  </form>

  <div id="filters" aria-label="Todo filters">
    <button data-filter="all">All</button>
    <button data-filter="active">Active</button>
    <button data-filter="completed">Completed</button>
  </div>

  <p id="todo-summary"></p>
  <ul id="todo-list"></ul>
</main>

<script type="module" src="app.js"></script>`,
      },
      { type: 'h2', text: 'Step 2: Create state and storage helpers' },
      {
        type: 'code',
        title: 'app.js - state setup',
        language: 'javascript',
        code: `const STORAGE_KEY = 'intellex.todos';

const state = {
  filter: 'all',
  todos: loadTodos()
};

function loadTodos() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
}`,
      },
      { type: 'h2', text: 'Step 3: Add pure update functions' },
      {
        type: 'code',
        title: 'app.js - state updates',
        language: 'javascript',
        code: `function addTodo(text) {
  const todo = {
    id: Date.now(),
    text: text,
    done: false
  };

  state.todos = [todo, ...state.todos];
  saveTodos();
}

function toggleTodo(id) {
  state.todos = state.todos.map(function (todo) {
    if (todo.id === id) {
      return { ...todo, done: !todo.done };
    }

    return todo;
  });

  saveTodos();
}

function deleteTodo(id) {
  state.todos = state.todos.filter(function (todo) {
    return todo.id !== id;
  });

  saveTodos();
}`,
      },
      { type: 'h2', text: 'Step 4: Filter and render todos' },
      {
        type: 'code',
        title: 'app.js - rendering',
        language: 'javascript',
        code: `const list = document.querySelector('#todo-list');
const summary = document.querySelector('#todo-summary');

function getVisibleTodos() {
  if (state.filter === 'active') {
    return state.todos.filter(function (todo) {
      return !todo.done;
    });
  }

  if (state.filter === 'completed') {
    return state.todos.filter(function (todo) {
      return todo.done;
    });
  }

  return state.todos;
}

function renderTodos() {
  const visibleTodos = getVisibleTodos();
  list.innerHTML = '';

  visibleTodos.forEach(function (todo) {
    const item = document.createElement('li');
    item.innerHTML =
      '<span>' + todo.text + '</span>' +
      '<button data-action="toggle" data-id="' + todo.id + '">' +
      (todo.done ? 'Undo' : 'Done') +
      '</button>' +
      '<button data-action="delete" data-id="' + todo.id + '">Delete</button>';

    if (todo.done) {
      item.classList.add('is-done');
    }

    list.append(item);
  });

  const activeCount = state.todos.filter(function (todo) {
    return !todo.done;
  }).length;

  summary.textContent = activeCount + ' active task(s)';
}`,
      },
      { type: 'warning', text: 'This lesson uses innerHTML to keep the project short. In production, prefer createElement and textContent for user-entered text to avoid injecting unsafe HTML.' },
      { type: 'h2', text: 'Step 5: Wire up events' },
      {
        type: 'code',
        title: 'app.js - events',
        language: 'javascript',
        code: `const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const filters = document.querySelector('#filters');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    return;
  }

  addTodo(text);
  input.value = '';
  renderTodos();
});

list.addEventListener('click', function (event) {
  const button = event.target.closest('[data-action]');

  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);

  if (button.dataset.action === 'toggle') {
    toggleTodo(id);
  }

  if (button.dataset.action === 'delete') {
    deleteTodo(id);
  }

  renderTodos();
});

filters.addEventListener('click', function (event) {
  const button = event.target.closest('[data-filter]');

  if (!button) {
    return;
  }

  state.filter = button.dataset.filter;
  renderTodos();
});

renderTodos();`,
      },
      { type: 'h2', text: 'Step 6: Improve it' },
      { type: 'ol', items: ['Disable the add button when the input is empty.', 'Highlight the active filter button.', 'Add a clear completed button.', 'Use createElement instead of innerHTML for safer rendering.', 'Move state, rendering, and events into separate modules.'] },
      { type: 'try', text: 'Add a search input that filters todos by text while keeping the all, active, and completed filters working.' },
      {
        type: 'keypoints',
        items: [
          'The todo app uses state as the source of truth.',
          'Rendering recreates the list from current state.',
          'Event delegation handles buttons inside a dynamic list.',
          'localStorage persists todos after page refresh.',
        ],
      },
    ],
  },
  {
    slug: 'js-project-quiz',
    title: 'Mini Project: Quiz App',
    description: 'Build an interactive quiz app with question state, answer selection, scoring, progress, and restart behavior.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 63,
    minutes: 20,
    content: [
      { type: 'p', text: 'This project builds an interactive quiz. It practices arrays of data, state transitions, conditional rendering, event handling, and user feedback.' },
      { type: 'h2', text: 'What you will build' },
      { type: 'ul', items: ['A question screen with multiple answers.', 'A next button that appears after selection.', 'A score screen at the end.', 'A restart button.', 'Clear state for current question, selected answer, and score.'] },
      { type: 'h2', text: 'Step 1: Add the HTML shell' },
      {
        type: 'code',
        title: 'index.html',
        language: 'html',
        code: `<main class="quiz-app">
  <h1>JavaScript Quiz</h1>
  <section id="quiz"></section>
</main>

<script type="module" src="quiz.js"></script>`,
      },
      { type: 'h2', text: 'Step 2: Define questions and state' },
      {
        type: 'code',
        title: 'quiz.js - data and state',
        language: 'javascript',
        code: `const questions = [
  {
    text: 'Which queue runs Promise callbacks?',
    answers: ['Task queue', 'Microtask queue', 'Render queue'],
    correctIndex: 1
  },
  {
    text: 'What does debounce do?',
    answers: ['Runs after events pause', 'Runs every event immediately', 'Blocks all clicks'],
    correctIndex: 0
  },
  {
    text: 'Which method creates a new array?',
    answers: ['push', 'splice', 'map'],
    correctIndex: 2
  }
];

const state = {
  currentIndex: 0,
  selectedIndex: null,
  score: 0,
  finished: false
};

const quiz = document.querySelector('#quiz');`,
      },
      { type: 'h2', text: 'Step 3: Render the current question' },
      {
        type: 'code',
        title: 'quiz.js - question rendering',
        language: 'javascript',
        code: `function renderQuiz() {
  if (state.finished) {
    renderResults();
    return;
  }

  const question = questions[state.currentIndex];
  quiz.innerHTML = '';

  const progress = document.createElement('p');
  progress.textContent = 'Question ' + (state.currentIndex + 1) + ' of ' + questions.length;

  const title = document.createElement('h2');
  title.textContent = question.text;

  const answers = document.createElement('div');
  answers.id = 'answers';

  question.answers.forEach(function (answer, index) {
    const button = document.createElement('button');
    button.textContent = answer;
    button.dataset.index = String(index);

    if (state.selectedIndex === index) {
      button.classList.add('selected');
    }

    answers.append(button);
  });

  const nextButton = document.createElement('button');
  nextButton.id = 'next-question';
  nextButton.textContent = state.currentIndex === questions.length - 1 ? 'Finish' : 'Next';
  nextButton.disabled = state.selectedIndex === null;

  quiz.append(progress, title, answers, nextButton);
}`,
      },
      { type: 'h2', text: 'Step 4: Handle answer selection' },
      {
        type: 'code',
        title: 'quiz.js - answer events',
        language: 'javascript',
        code: `quiz.addEventListener('click', function (event) {
  const answerButton = event.target.closest('#answers button');

  if (answerButton) {
    state.selectedIndex = Number(answerButton.dataset.index);
    renderQuiz();
    return;
  }

  if (event.target.id === 'next-question') {
    submitAnswer();
  }

  if (event.target.id === 'restart-quiz') {
    restartQuiz();
  }
});`,
      },
      { type: 'h2', text: 'Step 5: Score answers and move forward' },
      {
        type: 'code',
        title: 'quiz.js - scoring',
        language: 'javascript',
        code: `function submitAnswer() {
  const question = questions[state.currentIndex];

  if (state.selectedIndex === question.correctIndex) {
    state.score += 1;
  }

  if (state.currentIndex === questions.length - 1) {
    state.finished = true;
  } else {
    state.currentIndex += 1;
    state.selectedIndex = null;
  }

  renderQuiz();
}`,
      },
      { type: 'h2', text: 'Step 6: Show results and restart' },
      {
        type: 'code',
        title: 'quiz.js - results',
        language: 'javascript',
        code: `function renderResults() {
  quiz.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = 'Quiz complete!';

  const score = document.createElement('p');
  score.textContent = 'You scored ' + state.score + ' out of ' + questions.length + '.';

  const restart = document.createElement('button');
  restart.id = 'restart-quiz';
  restart.textContent = 'Restart';

  quiz.append(title, score, restart);
}

function restartQuiz() {
  state.currentIndex = 0;
  state.selectedIndex = null;
  state.score = 0;
  state.finished = false;

  renderQuiz();
}

renderQuiz();`,
      },
      { type: 'h2', text: 'Step 7: Make it more advanced' },
      { type: 'ol', items: ['Show correct and incorrect feedback before moving on.', 'Shuffle questions at the start of each game.', 'Store the best score in localStorage.', 'Add a timer for each question.', 'Load questions from a JSON file or API.'] },
      { type: 'tip', text: 'Notice how the quiz has no separate pages. It feels like multiple screens because renderQuiz chooses what to show based on state.' },
      {
        type: 'keypoints',
        items: [
          'The quiz app uses state to track progress, selected answer, score, and completion.',
          'Rendering changes based on the current state.',
          'Event delegation keeps all quiz clicks in one listener.',
          'Restarting is just resetting state and rendering again.',
        ],
      },
    ],
  },
  {
    slug: 'js-project-api',
    title: 'Mini Project: API Dashboard',
    description: 'Build an API-powered dashboard with loading states, error states, fetch, filtering, refresh, and clean rendering.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 64,
    minutes: 20,
    content: [
      { type: 'p', text: 'This project builds a small API dashboard. It practices fetch, async and await, loading states, error handling, filtering, and rendering from state.' },
      { type: 'h2', text: 'What you will build' },
      { type: 'ul', items: ['A dashboard that loads users from an API.', 'A loading message while data is being fetched.', 'An error message if the request fails.', 'A search filter.', 'A refresh button.'] },
      { type: 'h2', text: 'Step 1: Create the dashboard HTML' },
      {
        type: 'code',
        title: 'index.html',
        language: 'html',
        code: `<main class="dashboard">
  <header>
    <h1>User Dashboard</h1>
    <button id="refresh">Refresh</button>
  </header>

  <label for="search">Search users</label>
  <input id="search" placeholder="Type a name or email">

  <p id="status" role="status"></p>
  <section id="cards" aria-live="polite"></section>
</main>

<script type="module" src="dashboard.js"></script>`,
      },
      { type: 'h2', text: 'Step 2: Create state and selectors' },
      {
        type: 'code',
        title: 'dashboard.js - state',
        language: 'javascript',
        code: `const API_URL = 'https://jsonplaceholder.typicode.com/users';

const state = {
  users: [],
  loading: false,
  error: '',
  search: ''
};

const status = document.querySelector('#status');
const cards = document.querySelector('#cards');
const searchInput = document.querySelector('#search');
const refreshButton = document.querySelector('#refresh');`,
      },
      { type: 'h2', text: 'Step 3: Fetch users with error handling' },
      {
        type: 'code',
        title: 'dashboard.js - data loading',
        language: 'javascript',
        code: `async function loadUsers() {
  state.loading = true;
  state.error = '';
  render();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    state.users = await response.json();
  } catch (error) {
    state.error = 'Could not load users. Please try again.';
  } finally {
    state.loading = false;
    render();
  }
}`,
      },
      { type: 'h2', text: 'Step 4: Filter users from state' },
      {
        type: 'code',
        title: 'dashboard.js - filtering',
        language: 'javascript',
        code: `function getVisibleUsers() {
  const query = state.search.toLowerCase().trim();

  if (!query) {
    return state.users;
  }

  return state.users.filter(function (user) {
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.company.name.toLowerCase().includes(query)
    );
  });
}`,
      },
      { type: 'h2', text: 'Step 5: Render loading, error, empty, and success states' },
      {
        type: 'code',
        title: 'dashboard.js - rendering',
        language: 'javascript',
        code: `function render() {
  refreshButton.disabled = state.loading;

  if (state.loading) {
    status.textContent = 'Loading users...';
  } else if (state.error) {
    status.textContent = state.error;
  } else {
    status.textContent = state.users.length + ' users loaded';
  }

  cards.innerHTML = '';

  if (state.loading || state.error) {
    return;
  }

  const visibleUsers = getVisibleUsers();

  if (visibleUsers.length === 0) {
    cards.textContent = 'No users match your search.';
    return;
  }

  visibleUsers.forEach(function (user) {
    const article = document.createElement('article');
    article.className = 'user-card';

    const title = document.createElement('h2');
    title.textContent = user.name;

    const email = document.createElement('p');
    email.textContent = user.email;

    const company = document.createElement('p');
    company.textContent = user.company.name;

    article.append(title, email, company);
    cards.append(article);
  });
}`,
      },
      { type: 'h2', text: 'Step 6: Add interactions' },
      {
        type: 'code',
        title: 'dashboard.js - events',
        language: 'javascript',
        code: `searchInput.addEventListener('input', function (event) {
  state.search = event.target.value;
  render();
});

refreshButton.addEventListener('click', function () {
  loadUsers();
});

loadUsers();`,
      },
      { type: 'h2', text: 'Step 7: Upgrade the dashboard' },
      { type: 'ol', items: ['Debounce the search input for larger lists.', 'Add sorting by name or company.', 'Show skeleton cards while loading.', 'Cache the last successful response in localStorage.', 'Add a retry button inside the error state.'] },
      { type: 'warning', text: 'Network requests can fail for many reasons. A polished frontend always has loading, error, empty, and success states.' },
      {
        type: 'keypoints',
        items: [
          'API dashboards need state for data, loading, errors, and filters.',
          'Fetch should check response.ok before trusting the response.',
          'Render each state clearly: loading, error, empty, and success.',
          'A refresh button should be disabled while a request is already running.',
        ],
      },
    ],
  },
  {
    slug: 'js-next-steps',
    title: 'From JavaScript to Frameworks',
    description: 'Plan your next steps from strong JavaScript fundamentals into React, Vue, Svelte, TypeScript, tooling, and real projects.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 65,
    minutes: 15,
    content: [
      { type: 'p', text: 'Frameworks are not a replacement for JavaScript. They are organized ways to build interfaces using the same core ideas: state, events, rendering, modules, and asynchronous data.' },
      { type: 'h2', text: 'The skills that transfer' },
      {
        type: 'table',
        headers: ['JavaScript skill', 'How it appears in frameworks'],
        rows: [
          ['State objects', 'React useState, Vue reactive, Svelte variables'],
          ['Render from state', 'Components re-render when data changes'],
          ['Event listeners', 'onClick, v-on, event directives and handlers'],
          ['Modules', 'Component files and shared utility files'],
          ['Async fetch', 'Data loading hooks, loaders, actions, and services'],
          ['Immutable updates', 'Predictable state changes and change detection'],
        ],
      },
      { type: 'h2', text: 'React roadmap' },
      { type: 'p', text: 'React is a popular library for building component-based interfaces. It teaches you to describe UI as a function of state.' },
      {
        type: 'ol',
        items: [
          'Learn JSX as HTML-like syntax inside JavaScript.',
          'Build small components with props.',
          'Use useState for local component state.',
          'Use useEffect for effects such as fetching and subscriptions.',
          'Practice lists, keys, forms, and conditional rendering.',
          'Then learn routing, data fetching patterns, and performance tools.',
        ],
      },
      {
        type: 'code',
        title: 'React idea: UI from state',
        language: 'javascript',
        code: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={function () { setCount(count + 1); }}>
      Count: {count}
    </button>
  );
}`,
      },
      { type: 'h2', text: 'Vue roadmap' },
      { type: 'p', text: 'Vue is a progressive framework with approachable templates and a clear reactivity system. It is friendly for developers moving from HTML, CSS, and JavaScript.' },
      {
        type: 'ol',
        items: [
          'Learn template syntax, directives, and event binding.',
          'Use ref and reactive for state.',
          'Create reusable components with props and emits.',
          'Practice computed values and watchers.',
          'Add routing with Vue Router.',
          'Explore Pinia for shared app state.',
        ],
      },
      { type: 'h2', text: 'Svelte roadmap' },
      { type: 'p', text: 'Svelte compiles components into efficient JavaScript. It often feels close to plain HTML, CSS, and JavaScript while still giving you component structure.' },
      {
        type: 'ol',
        items: [
          'Learn single-file components.',
          'Use variables as reactive state.',
          'Practice events, props, and slots.',
          'Use reactive statements for derived values.',
          'Try SvelteKit for routes, loading, and full apps.',
        ],
      },
      { type: 'h2', text: 'TypeScript and tooling' },
      { type: 'p', text: 'TypeScript adds types to JavaScript. It helps catch mistakes before the browser runs your code, especially in larger apps and teams.' },
      { type: 'ul', items: ['Start by typing function parameters and return values.', 'Use interfaces or types for API data.', 'Let the editor help you discover properties and mistakes.', 'Learn build tools such as Vite after you understand modules.', 'Use ESLint and formatting tools to keep code consistent.'] },
      { type: 'h2', text: 'A practical learning path' },
      {
        type: 'ol',
        items: [
          'Rebuild your todo app in one framework.',
          'Rebuild the API dashboard with components and state.',
          'Add routing between pages.',
          'Add form validation and error messages.',
          'Deploy the project and share the link.',
          'Read the framework docs for the features you used.',
        ],
      },
      { type: 'tip', text: 'Choose one framework first and build several small projects. Depth in one tool teaches more than switching tools every week.' },
      { type: 'warning', text: 'Do not skip JavaScript fundamentals. Framework errors are much easier to solve when you understand objects, arrays, async code, modules, and the browser.' },
      { type: 'try', text: 'Pick React, Vue, or Svelte. Rebuild the quiz project as components: App, QuestionCard, AnswerList, Progress, and Results.' },
      {
        type: 'keypoints',
        items: [
          'Frameworks organize the JavaScript skills you already learned.',
          'State, events, rendering, modules, and async data transfer directly.',
          'React, Vue, and Svelte have different styles but solve similar UI problems.',
          'TypeScript and tooling become more valuable as projects grow.',
        ],
      },
    ],
  },
];
