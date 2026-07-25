import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-nodejs',
    title: 'What is Node.js?',
    description: 'Learn what Node.js is, where it runs, and why JavaScript developers use it for servers and tools.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 10,
    content: [
      { type: 'p', text: 'Node.js is a JavaScript runtime. A runtime is the program that actually runs your code. In the browser, the browser runs JavaScript. In Node.js, the node command runs JavaScript on your computer, a server, or a cloud platform.' },
      { type: 'p', text: 'Node.js is commonly used to build web servers, APIs, command-line tools, scripts, build systems, chat apps, and real-time services. It lets JavaScript move beyond web page interaction and into backend development.' },
      { type: 'h2', text: 'Node.js in simple words' },
      { type: 'p', text: 'Think of Node.js as JavaScript with access to operating system features. It can read files, create servers, talk to databases, use environment variables, and install reusable packages from npm.' },
      {
        type: 'table',
        headers: ['Browser JavaScript', 'Node.js JavaScript'],
        rows: [
          ['Runs in Chrome, Firefox, Safari, or Edge', 'Runs with the node command'],
          ['Works with the DOM and web page events', 'Works with files, servers, processes, and networks'],
          ['Used for user interfaces', 'Used for backend apps, tools, and automation'],
          ['Uses browser APIs like document and window', 'Uses Node APIs like fs, path, http, and process'],
        ],
      },
      { type: 'h2', text: 'A tiny Node program' },
      {
        type: 'code',
        title: 'hello.js',
        language: 'javascript',
        code: `const name = 'Node learner';

console.log('Hello, ' + name + '!');
console.log('This JavaScript is running outside the browser.');`,
      },
      {
        type: 'code',
        title: 'Run the file',
        language: 'bash',
        code: `node hello.js`,
      },
      { type: 'h2', text: 'Why Node became popular' },
      { type: 'ul', items: ['Frontend developers can use JavaScript on the backend too.', 'npm provides a huge ecosystem of reusable packages.', 'Node handles many network requests efficiently with an event-driven model.', 'It works well for APIs, real-time apps, tooling, and server-side rendering.'] },
      { type: 'note', text: 'Node.js is not a programming language. The language is JavaScript. Node.js is the runtime that executes JavaScript outside the browser.' },
      { type: 'try', text: 'Write down three things you have used JavaScript for in the browser. Then write one thing Node.js could do that browser JavaScript normally cannot, such as reading a local file or starting a web server.' },
      { type: 'keypoints', items: ['Node.js runs JavaScript outside the browser.', 'It is often used for servers, APIs, scripts, and developer tools.', 'Node gives JavaScript access to files, networking, and process information.', 'The node command runs JavaScript files from your terminal.'] },
    ],
  },
  {
    slug: 'node-vs-browser',
    title: 'Node.js vs Browser JavaScript',
    description: 'Compare Node.js and browser JavaScript so you know which APIs exist in each environment.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 10,
    content: [
      { type: 'p', text: 'JavaScript syntax is the same language in both places, but the environment changes what your code can access. A browser page has the DOM, buttons, forms, cookies, and browser storage. Node.js has files, operating system details, server sockets, and terminal input/output.' },
      { type: 'h2', text: 'Same language, different surroundings' },
      { type: 'p', text: 'Variables, functions, arrays, objects, promises, async/await, classes, and modules are JavaScript concepts. They work in modern browsers and in modern Node. APIs like document.querySelector are browser APIs, while fs.readFile is a Node API.' },
      {
        type: 'table',
        headers: ['Question', 'Browser', 'Node.js'],
        rows: [
          ['Can it change HTML on a page?', 'Yes, with the DOM', 'No DOM by default'],
          ['Can it read a local project file?', 'No direct filesystem access', 'Yes, with fs'],
          ['Can it start an HTTP server?', 'No', 'Yes'],
          ['Can it use npm packages?', 'Usually through a build tool', 'Yes, directly in many projects'],
        ],
      },
      { type: 'h2', text: 'Browser-only example' },
      {
        type: 'code',
        title: 'Runs in a web page, not plain Node',
        language: 'javascript',
        code: `const button = document.querySelector('button');

button.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});`,
      },
      { type: 'h2', text: 'Node-only example' },
      {
        type: 'code',
        title: 'Runs with node',
        language: 'javascript',
        code: `const os = require('node:os');

console.log('Platform:', os.platform());
console.log('Home folder:', os.homedir());`,
      },
      { type: 'h2', text: 'Global values are different' },
      { type: 'p', text: 'In browsers you often see window, document, and navigator. In Node you often see process, __dirname in CommonJS files, Buffer, and globalThis. Modern code should prefer explicit imports for most features.' },
      {
        type: 'code',
        title: 'Node process information',
        language: 'javascript',
        code: `console.log('Node version:', process.version);
console.log('Current folder:', process.cwd());
console.log('Command arguments:', process.argv);`,
      },
      { type: 'tip', text: 'When code fails with "document is not defined" in Node, it usually means browser-only code is being run on the server side.' },
      { type: 'try', text: 'Make two columns named Browser APIs and Node APIs. Place document, fetch, fs, path, process, localStorage, and http in the column where you expect to use them most often.' },
      { type: 'keypoints', items: ['JavaScript syntax is shared, but runtime APIs differ.', 'Browsers provide DOM APIs for web pages.', 'Node provides APIs for files, processes, networking, and servers.', 'Knowing the runtime helps you understand error messages and available tools.'] },
    ],
  },
  {
    slug: 'node-install',
    title: 'Install Node.js & npm',
    description: 'Install a modern Node.js version, check npm, and understand common version choices.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 12,
    content: [
      { type: 'p', text: 'To run Node.js programs, install Node.js on your computer. npm is installed with Node and is used to install packages, run scripts, and manage project dependencies.' },
      { type: 'h2', text: 'Choose a modern version' },
      { type: 'p', text: 'For beginner projects, choose the current Long Term Support (LTS) version from nodejs.org. Node 18 and newer support modern JavaScript features, built-in fetch, improved test tooling, and current package ecosystem expectations. Node 20+ is a great choice when available.' },
      {
        type: 'table',
        headers: ['Term', 'Meaning'],
        rows: [
          ['Node.js', 'The runtime that runs JavaScript'],
          ['npm', 'The default package manager installed with Node'],
          ['LTS', 'A stable release line supported for a longer time'],
          ['npx', 'A tool for running package commands without installing them globally'],
        ],
      },
      { type: 'h2', text: 'Check your installation' },
      {
        type: 'code',
        title: 'Version commands',
        language: 'bash',
        code: `node --version
npm --version
npx --version`,
      },
      {
        type: 'code',
        title: 'Example output',
        language: 'text',
        code: `v20.15.1
10.7.0
10.7.0`,
      },
      { type: 'h2', text: 'A quick health check' },
      {
        type: 'code',
        title: 'Run JavaScript without a file',
        language: 'bash',
        code: `node -e "console.log('Node is ready')"`,
      },
      { type: 'h2', text: 'Version managers' },
      { type: 'p', text: 'Many developers use a version manager such as nvm, fnm, Volta, or asdf. A version manager lets different projects use different Node versions without reinstalling Node manually each time.' },
      {
        type: 'code',
        title: 'Check the version from a project folder',
        language: 'bash',
        code: `node --version
npm doctor`,
      },
      { type: 'note', text: 'If your terminal says node is not found after installation, close and reopen the terminal. Some installers update your PATH only for new terminal sessions.' },
      { type: 'warning', text: 'Avoid installing random global packages to fix project errors. Most project tools belong in package.json so every developer uses the same version.' },
      { type: 'try', text: 'Install Node.js LTS, open a new terminal, and run node --version. Confirm that the major version is 18 or higher before continuing.' },
      { type: 'keypoints', items: ['Node.js runs JavaScript and npm manages packages.', 'Use a modern LTS version, preferably Node 20+ when possible.', 'node --version and npm --version confirm the installation.', 'Version managers help when projects need different Node versions.'] },
    ],
  },
  {
    slug: 'node-first-script',
    title: 'Your First Node Script',
    description: 'Create a JavaScript file, run it with Node, and read command-line arguments.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 10,
    content: [
      { type: 'p', text: 'A Node script is a JavaScript file you run from the terminal. Scripts are useful for learning, automation, small tools, project setup, and backend programs.' },
      { type: 'h2', text: 'Create a project folder' },
      {
        type: 'code',
        title: 'Make a practice folder',
        language: 'bash',
        code: `mkdir node-practice
cd node-practice
touch hello.js`,
      },
      { type: 'h2', text: 'Write your first script' },
      {
        type: 'code',
        title: 'hello.js',
        language: 'javascript',
        code: `const message = 'Hello from Node.js!';

console.log(message);
console.log('Current folder:', process.cwd());`,
      },
      {
        type: 'code',
        title: 'Run it',
        language: 'bash',
        code: `node hello.js`,
      },
      { type: 'h2', text: 'Read command-line arguments' },
      { type: 'p', text: 'Node stores command-line arguments in process.argv. The first two values are the node executable path and the script path. Your custom values start at index 2.' },
      {
        type: 'code',
        title: 'greet.js',
        language: 'javascript',
        code: `const name = process.argv[2] || 'friend';
const hobby = process.argv[3] || 'coding';

console.log('Hello, ' + name + '!');
console.log('Have fun with ' + hobby + '.');`,
      },
      {
        type: 'code',
        title: 'Run with arguments',
        language: 'bash',
        code: `node greet.js Maya photography`,
      },
      { type: 'h2', text: 'Exit codes' },
      { type: 'p', text: 'A script exits with code 0 when it succeeds. Non-zero exit codes usually mean something went wrong. Build tools and CI systems use exit codes to decide whether a command passed.' },
      {
        type: 'code',
        title: 'Set an error exit code',
        language: 'javascript',
        code: `const fileName = process.argv[2];

if (!fileName) {
  console.error('Please provide a file name.');
  process.exitCode = 1;
} else {
  console.log('You provided:', fileName);
}`,
      },
      { type: 'tip', text: 'Use console.log for normal output and console.error for error messages. This makes scripts easier to use in terminals and automation.' },
      { type: 'try', text: 'Create greet.js and run it three times: with no arguments, with one name, and with a name plus a hobby. Notice how default values keep the script friendly.' },
      { type: 'keypoints', items: ['A Node script is a JavaScript file run with node filename.js.', 'process.cwd() shows the current working directory.', 'process.argv contains command-line arguments.', 'Exit codes tell other tools whether a script succeeded.'] },
    ],
  },
  {
    slug: 'node-repl-scripts',
    title: 'REPL, Scripts & package scripts',
    description: 'Use the Node REPL for quick experiments and npm scripts for repeatable project commands.',
    level: 'beginner',
    section: 'Getting Started',
    order: 5,
    minutes: 11,
    content: [
      { type: 'p', text: 'Node can run JavaScript in several ways. You can type experiments in the REPL, run a file directly, or define repeatable commands in package.json scripts.' },
      { type: 'h2', text: 'The Node REPL' },
      { type: 'p', text: 'REPL means Read, Evaluate, Print, Loop. It reads what you type, evaluates it as JavaScript, prints the result, and waits for the next input. It is useful for quick experiments.' },
      {
        type: 'code',
        title: 'Start and use the REPL',
        language: 'bash',
        code: `node
> 2 + 2
4
> ['a', 'b'].join('-')
'a-b'
> .exit`,
      },
      { type: 'h2', text: 'Run a script file' },
      {
        type: 'code',
        title: 'math.js',
        language: 'javascript',
        code: `function double(number) {
  return number * 2;
}

console.log(double(21));`,
      },
      {
        type: 'code',
        title: 'Run the script',
        language: 'bash',
        code: `node math.js`,
      },
      { type: 'h2', text: 'Use package scripts' },
      { type: 'p', text: 'A package script is a named command in package.json. Scripts make common commands easy to remember and share with teammates.' },
      {
        type: 'code',
        title: 'Create package.json',
        language: 'bash',
        code: `npm init -y`,
      },
      {
        type: 'code',
        title: 'package.json scripts',
        language: 'json',
        code: `{
  "scripts": {
    "start": "node server.js",
    "hello": "node hello.js"
  }
}`,
      },
      {
        type: 'code',
        title: 'Run package scripts',
        language: 'bash',
        code: `npm run hello
npm start`,
      },
      { type: 'note', text: 'npm start is a shortcut for npm run start. Most other scripts use npm run, such as npm run dev, npm run test, and npm run lint.' },
      { type: 'tip', text: 'Package scripts are project documentation. A new developer can open package.json and see the important commands for running the app.' },
      { type: 'try', text: 'Create a package.json and add a script named today that runs node today.js. Make today.js print the current date with new Date().toLocaleDateString().' },
      { type: 'keypoints', items: ['The REPL is useful for quick JavaScript experiments.', 'Script files are better for saved programs.', 'package.json scripts make project commands repeatable.', 'Use npm run script-name for most custom scripts.'] },
    ],
  },
  {
    slug: 'node-commonjs',
    title: 'CommonJS Modules (require/module.exports)',
    description: 'Learn the classic Node module system using require and module.exports.',
    level: 'beginner',
    section: 'Node Foundations',
    order: 6,
    minutes: 12,
    content: [
      { type: 'p', text: 'Modules let you split code into separate files. CommonJS is the original Node.js module system. You load another file with require and share values from a file with module.exports.' },
      { type: 'h2', text: 'Export one value' },
      {
        type: 'code',
        title: 'formatCurrency.js',
        language: 'javascript',
        code: `function formatCurrency(amount) {
  return '$' + amount.toFixed(2);
}

module.exports = formatCurrency;`,
      },
      {
        type: 'code',
        title: 'app.js',
        language: 'javascript',
        code: `const formatCurrency = require('./formatCurrency');

console.log(formatCurrency(19.5));`,
      },
      { type: 'h2', text: 'Export multiple values' },
      {
        type: 'code',
        title: 'mathTools.js',
        language: 'javascript',
        code: `function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = {
  add,
  multiply,
};`,
      },
      {
        type: 'code',
        title: 'useMathTools.js',
        language: 'javascript',
        code: `const { add, multiply } = require('./mathTools');

console.log(add(2, 3));
console.log(multiply(4, 5));`,
      },
      { type: 'h2', text: 'How require finds modules' },
      { type: 'ul', items: ['A relative path like ./mathTools loads your own file.', 'A package name like express loads from node_modules.', 'A built-in module like node:fs loads from Node itself.', 'CommonJS files are loaded and cached after the first require call.'] },
      {
        type: 'code',
        title: 'Built-in module with node: prefix',
        language: 'javascript',
        code: `const path = require('node:path');

const filePath = path.join('notes', 'today.txt');
console.log(filePath);`,
      },
      { type: 'note', text: 'The node: prefix makes it clear that a module comes from Node.js itself. Examples include node:fs, node:path, node:http, and node:events.' },
      { type: 'warning', text: 'Do not mix CommonJS and ES module syntax randomly in the same file. Pick the module style your project is configured to use.' },
      { type: 'try', text: 'Create a file named temperature.js that exports celsiusToFahrenheit. Import it in app.js with require and print the result for 20 degrees Celsius.' },
      { type: 'keypoints', items: ['CommonJS uses require to import code.', 'CommonJS uses module.exports to export code.', 'Relative imports usually start with ./ or ../.', 'Node caches modules after loading them once.'] },
    ],
  },
  {
    slug: 'node-esm',
    title: 'ES Modules (import/export)',
    description: 'Learn modern JavaScript modules in Node.js using import and export.',
    level: 'beginner',
    section: 'Node Foundations',
    order: 7,
    minutes: 12,
    content: [
      { type: 'p', text: 'ES Modules, often called ESM, are the standard JavaScript module system. They use import and export. Modern Node supports ESM, and many newer packages and tools prefer it.' },
      { type: 'h2', text: 'Enable ES Modules' },
      { type: 'p', text: 'Node treats .mjs files as ES modules automatically. You can also set "type": "module" in package.json so .js files use ESM syntax.' },
      {
        type: 'code',
        title: 'package.json',
        language: 'json',
        code: `{
  "type": "module",
  "scripts": {
    "start": "node app.js"
  }
}`,
      },
      { type: 'h2', text: 'Named exports' },
      {
        type: 'code',
        title: 'strings.js',
        language: 'javascript',
        code: `export function titleCase(text) {
  return text
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export const appName = 'Notes API';`,
      },
      {
        type: 'code',
        title: 'app.js',
        language: 'javascript',
        code: `import { appName, titleCase } from './strings.js';

console.log(appName);
console.log(titleCase('learning node modules'));`,
      },
      { type: 'h2', text: 'Default exports' },
      {
        type: 'code',
        title: 'logger.js',
        language: 'javascript',
        code: `export default function log(message) {
  console.log('[app]', message);
}`,
      },
      {
        type: 'code',
        title: 'useLogger.js',
        language: 'javascript',
        code: `import log from './logger.js';

log('Server is starting');`,
      },
      { type: 'h2', text: 'CommonJS vs ESM' },
      {
        type: 'table',
        headers: ['CommonJS', 'ES Modules'],
        rows: [
          ['const fs = require("node:fs")', 'import fs from "node:fs"'],
          ['module.exports = value', 'export default value'],
          ['exports.name = value', 'export const name = value'],
          ['Often used in older Node code', 'Common in modern JavaScript projects'],
        ],
      },
      { type: 'tip', text: 'In ESM, include the file extension for local imports, such as ./logger.js. This is different from many CommonJS examples.' },
      { type: 'note', text: 'Many Express tutorials still use CommonJS because it is simple and widely supported. Modern projects can use either CommonJS or ESM if configured consistently.' },
      { type: 'try', text: 'Create an ESM project with "type": "module". Export a function named slugify from text.js and import it in app.js.' },
      { type: 'keypoints', items: ['ES Modules use import and export syntax.', 'Use "type": "module" or .mjs to enable ESM in Node.', 'Named exports and default exports solve different sharing needs.', 'Be consistent with one module style in a project.'] },
    ],
  },
  {
    slug: 'node-npm',
    title: 'npm Basics',
    description: 'Understand npm, install packages, and distinguish dependencies from development dependencies.',
    level: 'beginner',
    section: 'Node Foundations',
    order: 8,
    minutes: 12,
    content: [
      { type: 'p', text: 'npm is the default package manager that comes with Node.js. It helps you install third-party packages, run project scripts, and record the exact packages your project needs.' },
      { type: 'h2', text: 'Start a package' },
      {
        type: 'code',
        title: 'Create package.json',
        language: 'bash',
        code: `mkdir npm-practice
cd npm-practice
npm init -y`,
      },
      { type: 'h2', text: 'Install a package' },
      { type: 'p', text: 'When you install a package, npm downloads it into node_modules and records it in package.json. It also updates package-lock.json with exact dependency versions.' },
      {
        type: 'code',
        title: 'Install dayjs',
        language: 'bash',
        code: `npm install dayjs`,
      },
      {
        type: 'code',
        title: 'Use the package',
        language: 'javascript',
        code: `const dayjs = require('dayjs');

console.log(dayjs().format('YYYY-MM-DD'));`,
      },
      { type: 'h2', text: 'Install a development tool' },
      {
        type: 'code',
        title: 'Install nodemon as a dev dependency',
        language: 'bash',
        code: `npm install --save-dev nodemon`,
      },
      {
        type: 'table',
        headers: ['Type', 'Purpose', 'Example'],
        rows: [
          ['dependencies', 'Packages the app needs to run', 'express, pg, mongoose'],
          ['devDependencies', 'Tools used while developing', 'nodemon, eslint, prettier'],
        ],
      },
      { type: 'h2', text: 'Remove and update packages' },
      {
        type: 'code',
        title: 'Common npm package commands',
        language: 'bash',
        code: `npm uninstall dayjs
npm outdated
npm update`,
      },
      { type: 'note', text: 'node_modules can be very large and is usually not committed to Git. Commit package.json and package-lock.json instead so npm install can recreate node_modules.' },
      { type: 'tip', text: 'Use npm install package-name for runtime packages and npm install --save-dev package-name for development tools.' },
      { type: 'try', text: 'Create a practice package, install dayjs, print today in a friendly format, then inspect package.json to see where dayjs was added.' },
      { type: 'keypoints', items: ['npm installs packages and runs scripts.', 'package.json lists project dependencies and scripts.', 'package-lock.json records exact resolved versions.', 'dependencies are for runtime; devDependencies are for development tools.'] },
    ],
  },
  {
    slug: 'node-package-json',
    title: 'package.json Explained',
    description: 'Learn the important fields in package.json and how they shape a Node.js project.',
    level: 'beginner',
    section: 'Node Foundations',
    order: 9,
    minutes: 11,
    content: [
      { type: 'p', text: 'package.json is the main configuration file for most Node.js projects. It describes the project, lists scripts, records dependencies, and can configure how Node treats modules.' },
      { type: 'h2', text: 'A practical package.json' },
      {
        type: 'code',
        title: 'package.json',
        language: 'json',
        code: `{
  "name": "notes-api",
  "version": "1.0.0",
  "description": "A beginner Express API",
  "type": "commonjs",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}`,
      },
      { type: 'h2', text: 'Fields beginners should know' },
      {
        type: 'table',
        headers: ['Field', 'What it does'],
        rows: [
          ['name', 'The package or project name'],
          ['version', 'The project version'],
          ['type', 'Controls whether .js files use CommonJS or ESM'],
          ['main', 'The default entry file for packages'],
          ['scripts', 'Named commands run by npm'],
          ['dependencies', 'Runtime packages'],
          ['devDependencies', 'Development-only tools'],
        ],
      },
      { type: 'h2', text: 'Scripts are commands' },
      {
        type: 'code',
        title: 'Run scripts',
        language: 'bash',
        code: `npm start
npm run dev`,
      },
      { type: 'p', text: 'Scripts can call local tools installed in node_modules. For example, npm run dev can run nodemon even if nodemon is not installed globally on your computer.' },
      { type: 'h2', text: 'Semantic version ranges' },
      {
        type: 'code',
        title: 'Common version examples',
        language: 'text',
        code: `"express": "^4.18.3"   Allows compatible minor and patch updates
"express": "~4.18.3"   Allows patch updates
"express": "4.18.3"    Uses exactly this version`,
      },
      { type: 'note', text: 'The package-lock.json file stores the exact dependency tree npm installed. This helps teammates and deployment systems install the same package versions.' },
      { type: 'tip', text: 'Open package.json whenever you join a Node project. It tells you how to run the app, test it, and which packages matter.' },
      { type: 'try', text: 'Create package.json with npm init -y, add a script named check that runs node --version, and run it with npm run check.' },
      { type: 'keypoints', items: ['package.json describes a Node project.', 'scripts define repeatable npm commands.', 'dependencies and devDependencies have different purposes.', 'The type field controls CommonJS vs ES Module behavior for .js files.'] },
    ],
  },
  {
    slug: 'node-core-modules',
    title: 'Core Modules Overview',
    description: 'Meet the built-in Node.js modules you will use before reaching for npm packages.',
    level: 'beginner',
    section: 'Node Foundations',
    order: 10,
    minutes: 10,
    content: [
      { type: 'p', text: 'Node.js includes built-in modules, also called core modules. You do not install them from npm. They come with Node and provide important features such as files, paths, servers, events, streams, and operating system information.' },
      { type: 'h2', text: 'Importing core modules' },
      { type: 'p', text: 'Modern examples often use the node: prefix for built-in modules. It makes the import clear and avoids confusion with packages that might have similar names.' },
      {
        type: 'code',
        title: 'CommonJS imports',
        language: 'javascript',
        code: `const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');`,
      },
      {
        type: 'code',
        title: 'ES Module imports',
        language: 'javascript',
        code: `import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';`,
      },
      { type: 'h2', text: 'Useful core modules' },
      {
        type: 'table',
        headers: ['Module', 'Used for'],
        rows: [
          ['node:fs', 'Reading and writing files'],
          ['node:path', 'Building safe file paths'],
          ['node:url', 'Working with URLs'],
          ['node:http', 'Creating HTTP servers and clients'],
          ['node:events', 'Working with event emitters'],
          ['node:os', 'Operating system information'],
          ['node:crypto', 'Hashes, random bytes, and security helpers'],
        ],
      },
      { type: 'h2', text: 'Small core module example' },
      {
        type: 'code',
        title: 'system-info.js',
        language: 'javascript',
        code: `const os = require('node:os');
const path = require('node:path');

const notesPath = path.join(os.homedir(), 'notes.txt');

console.log('Platform:', os.platform());
console.log('Notes file:', notesPath);`,
      },
      { type: 'note', text: 'Core modules are documented in the official Node.js docs. The docs are detailed, so beginners should focus on examples first and use the reference as needed.' },
      { type: 'tip', text: 'Before installing a package, ask whether Node already includes the feature you need. For paths, URLs, HTTP basics, crypto, and files, it often does.' },
      { type: 'try', text: 'Import node:os and print your platform, CPU count, and home directory. Then import node:path and join your home directory with a file name.' },
      { type: 'keypoints', items: ['Core modules are built into Node.js.', 'Use the node: prefix to clearly import built-in modules.', 'fs, path, url, http, events, os, and crypto are common core modules.', 'Core modules reduce the need for extra packages in basic tasks.'] },
    ],
  },
  {
    slug: 'node-fs',
    title: 'File System (fs)',
    description: 'Read and write files with Node.js using the fs module and promise-based APIs.',
    level: 'beginner',
    section: 'Node Foundations',
    order: 11,
    minutes: 13,
    content: [
      { type: 'p', text: 'The fs module lets Node.js work with files and folders. You can read configuration files, save user data, create logs, scan directories, and build tools that modify project files.' },
      { type: 'h2', text: 'Use the promise API' },
      { type: 'p', text: 'Modern beginner code can use node:fs/promises with async and await. This style avoids callback nesting and reads naturally.' },
      {
        type: 'code',
        title: 'write-read.js',
        language: 'javascript',
        code: `const fs = require('node:fs/promises');

async function main() {
  await fs.writeFile('message.txt', 'Hello from the file system!\\n');

  const text = await fs.readFile('message.txt', 'utf8');
  console.log(text);
}

main();`,
      },
      { type: 'h2', text: 'Handle errors' },
      {
        type: 'code',
        title: 'read-config.js',
        language: 'javascript',
        code: `const fs = require('node:fs/promises');

async function readConfig() {
  try {
    const text = await fs.readFile('config.json', 'utf8');
    const config = JSON.parse(text);
    console.log(config);
  } catch (error) {
    console.error('Could not read config.json');
    console.error(error.message);
  }
}

readConfig();`,
      },
      { type: 'h2', text: 'Work with folders' },
      {
        type: 'code',
        title: 'list-files.js',
        language: 'javascript',
        code: `const fs = require('node:fs/promises');

async function listFiles() {
  const entries = await fs.readdir('.');

  for (const entry of entries) {
    console.log(entry);
  }
}

listFiles();`,
      },
      {
        type: 'table',
        headers: ['Method', 'Purpose'],
        rows: [
          ['readFile', 'Read a whole file'],
          ['writeFile', 'Create or replace a file'],
          ['appendFile', 'Add text to the end of a file'],
          ['readdir', 'List folder contents'],
          ['mkdir', 'Create a folder'],
          ['stat', 'Get file or folder information'],
        ],
      },
      { type: 'warning', text: 'Be careful with writeFile. It replaces the file if it already exists. For logs or additions, appendFile may be safer.' },
      { type: 'tip', text: 'Always provide an encoding like utf8 when reading text. Without it, readFile returns a Buffer instead of a string.' },
      { type: 'try', text: 'Create a script that writes three lines to journal.txt, reads the file back, and prints how many characters it contains.' },
      { type: 'keypoints', items: ['node:fs/promises provides promise-based file operations.', 'Use async/await for readable filesystem code.', 'readFile needs utf8 when you want text.', 'Handle file errors because files may be missing, locked, or invalid.'] },
    ],
  },
  {
    slug: 'node-path-url',
    title: 'path & URL utilities',
    description: 'Use Node path and URL helpers to safely build paths and parse web addresses.',
    level: 'beginner',
    section: 'Node Foundations',
    order: 12,
    minutes: 12,
    content: [
      { type: 'p', text: 'Paths and URLs look like simple strings, but they have rules. Node provides node:path for file system paths and node:url plus the standard URL class for web addresses.' },
      { type: 'h2', text: 'Why path helpers matter' },
      { type: 'p', text: 'Different operating systems use different path separators. Windows often uses backslashes, while macOS and Linux use forward slashes. path.join and path.resolve build paths correctly for the current platform.' },
      {
        type: 'code',
        title: 'build-paths.js',
        language: 'javascript',
        code: `const path = require('node:path');

const filePath = path.join('data', 'notes', 'today.txt');
const absolutePath = path.resolve('data', 'notes', 'today.txt');

console.log(filePath);
console.log(absolutePath);
console.log(path.extname(filePath));`,
      },
      { type: 'h2', text: 'Useful path methods' },
      {
        type: 'table',
        headers: ['Method', 'Purpose'],
        rows: [
          ['path.join', 'Join path parts using the right separator'],
          ['path.resolve', 'Build an absolute path'],
          ['path.basename', 'Get the file name'],
          ['path.dirname', 'Get the folder path'],
          ['path.extname', 'Get the file extension'],
        ],
      },
      { type: 'h2', text: 'Parse URLs' },
      {
        type: 'code',
        title: 'parse-url.js',
        language: 'javascript',
        code: `const address = new URL('https://example.com/search?q=node&page=2');

console.log(address.hostname);
console.log(address.pathname);
console.log(address.searchParams.get('q'));
console.log(address.searchParams.get('page'));`,
      },
      { type: 'h2', text: 'Use URL with file paths in ES modules' },
      {
        type: 'code',
        title: 'esm-dirname.js',
        language: 'javascript',
        code: `import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);`,
      },
      { type: 'note', text: 'CommonJS gives you __dirname and __filename automatically. ES modules do not, so you can build them with import.meta.url and fileURLToPath when needed.' },
      { type: 'tip', text: 'Avoid building file paths with manual string concatenation. path.join is clearer and safer across operating systems.' },
      { type: 'try', text: 'Write a script that uses path.join to build data/users/alex.json, then uses new URL to read the q value from https://example.com/search?q=express.' },
      { type: 'keypoints', items: ['Use node:path for file paths.', 'Use URL and searchParams for web addresses and query strings.', 'path.join handles platform differences.', 'ES modules can recreate __dirname with import.meta.url and fileURLToPath.'] },
    ],
  },
  {
    slug: 'node-events',
    title: 'Events & EventEmitter',
    description: 'Understand event-driven code and use EventEmitter for simple Node.js events.',
    level: 'beginner',
    section: 'Node Foundations',
    order: 13,
    minutes: 12,
    content: [
      { type: 'p', text: 'Node.js uses events in many places. Servers emit request events, streams emit data events, and custom objects can emit events too. Event-driven code means one part of the program announces something happened, and listeners respond.' },
      { type: 'h2', text: 'A simple EventEmitter' },
      {
        type: 'code',
        title: 'events-demo.js',
        language: 'javascript',
        code: `const EventEmitter = require('node:events');

const bus = new EventEmitter();

bus.on('user:created', (user) => {
  console.log('Welcome email sent to', user.email);
});

bus.on('user:created', (user) => {
  console.log('Analytics event recorded for', user.id);
});

bus.emit('user:created', {
  id: 42,
  email: 'maya@example.com',
});`,
      },
      { type: 'h2', text: 'on, once, and emit' },
      {
        type: 'table',
        headers: ['Method', 'Purpose'],
        rows: [
          ['on(event, listener)', 'Run the listener every time the event happens'],
          ['once(event, listener)', 'Run the listener only the next time the event happens'],
          ['emit(event, data)', 'Trigger an event and send data to listeners'],
          ['off(event, listener)', 'Remove a listener'],
        ],
      },
      {
        type: 'code',
        title: 'once-example.js',
        language: 'javascript',
        code: `const EventEmitter = require('node:events');
const door = new EventEmitter();

door.once('open', () => {
  console.log('The door opened for the first time.');
});

door.emit('open');
door.emit('open');`,
      },
      { type: 'h2', text: 'Events in real Node programs' },
      { type: 'p', text: 'You do not always create EventEmitter objects yourself. You will often use objects that already emit events, such as HTTP servers and file streams.' },
      {
        type: 'code',
        title: 'Server request event preview',
        language: 'javascript',
        code: `const http = require('node:http');

const server = http.createServer();

server.on('request', (req, res) => {
  res.end('Hello from an event-driven server');
});

server.listen(3000);`,
      },
      { type: 'note', text: 'Event names are strings. Teams often choose clear names like user:created or order:paid so event meaning is obvious.' },
      { type: 'tip', text: 'Keep event listeners focused. If a listener does too much, move logic into a separate function and call that function from the listener.' },
      { type: 'try', text: 'Create an EventEmitter named game. Listen for score and game-over events. Emit score twice and game-over once.' },
      { type: 'keypoints', items: ['Event-driven code reacts when something happens.', 'EventEmitter provides on, once, emit, and off.', 'Many Node APIs use events internally.', 'Clear event names make event-based code easier to understand.'] },
    ],
  },
  {
    slug: 'node-http',
    title: 'Creating a Server with http',
    description: 'Build a small HTTP server using Node.js before learning Express.',
    level: 'beginner',
    section: 'Node Foundations',
    order: 14,
    minutes: 15,
    content: [
      { type: 'p', text: 'Node.js can create web servers using the built-in node:http module. Express is built on top of Node HTTP concepts, so learning a small http server first makes Express easier to understand.' },
      { type: 'h2', text: 'A first HTTP server' },
      {
        type: 'code',
        title: 'server.js',
        language: 'javascript',
        code: `const http = require('node:http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello from Node HTTP!');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});`,
      },
      {
        type: 'code',
        title: 'Run and test',
        language: 'bash',
        code: `node server.js
# Open http://localhost:3000 in your browser`,
      },
      { type: 'h2', text: 'Request and response' },
      { type: 'p', text: 'The request object, often named req, contains information about what the client asked for. The response object, often named res, lets your server send status codes, headers, and body content back.' },
      {
        type: 'table',
        headers: ['Object', 'Contains or controls'],
        rows: [
          ['req.method', 'The HTTP method, such as GET or POST'],
          ['req.url', 'The path and query string requested by the client'],
          ['res.statusCode', 'The numeric HTTP status code to send'],
          ['res.setHeader', 'Response metadata such as content type'],
          ['res.end', 'Finishes the response'],
        ],
      },
      { type: 'h2', text: 'Route by URL and method' },
      {
        type: 'code',
        title: 'manual-routing.js',
        language: 'javascript',
        code: `const http = require('node:http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.setHeader('Content-Type', 'text/plain');
    return res.end('Home page');
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ status: 'ok' }));
  }

  res.statusCode = 404;
  res.end('Not found');
});

server.listen(3000);`,
      },
      { type: 'h2', text: 'Why Express exists' },
      { type: 'p', text: 'The built-in http module is powerful but low level. Express adds routing helpers, middleware, JSON body parsing, static file serving, error handling patterns, and a cleaner developer experience.' },
      { type: 'note', text: 'A server keeps running until you stop it. In most terminals, press Ctrl+C to stop a local Node server.' },
      { type: 'try', text: 'Create the manual-routing.js server. Add a new GET /about route that returns plain text: About this app.' },
      { type: 'keypoints', items: ['node:http can create web servers without extra packages.', 'req describes the incoming request and res sends the response.', 'Routing manually with http works but gets repetitive.', 'Express builds on these HTTP basics with friendlier tools.'] },
    ],
  },
  {
    slug: 'express-intro',
    title: 'What is Express?',
    description: 'Learn what Express adds to Node.js and when to use it for backend apps.',
    level: 'beginner',
    section: 'Express Basics',
    order: 15,
    minutes: 10,
    content: [
      { type: 'p', text: 'Express is a small, flexible web framework for Node.js. It helps you build web servers and APIs with less boilerplate than the built-in http module.' },
      { type: 'h2', text: 'Express in simple words' },
      { type: 'p', text: 'Express gives you convenient functions for routes, middleware, request bodies, response helpers, static files, and error handling. Instead of manually checking req.method and req.url for every route, you write app.get, app.post, and similar methods.' },
      {
        type: 'table',
        headers: ['Need', 'Express feature'],
        rows: [
          ['Respond to GET /users', 'app.get("/users", handler)'],
          ['Handle POST JSON', 'express.json() middleware'],
          ['Share logic across routes', 'Middleware functions'],
          ['Split routes into files', 'express.Router()'],
          ['Serve images and CSS', 'express.static()'],
        ],
      },
      { type: 'h2', text: 'Express vs plain http' },
      {
        type: 'code',
        title: 'Plain http route',
        language: 'javascript',
        code: `if (req.method === 'GET' && req.url === '/api/health') {
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify({ status: 'ok' }));
}`,
      },
      {
        type: 'code',
        title: 'Express route',
        language: 'javascript',
        code: `app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});`,
      },
      { type: 'h2', text: 'Where Express is used' },
      { type: 'ul', items: ['REST APIs for frontend apps', 'Backend services for mobile apps', 'Small web apps and dashboards', 'Webhook receivers', 'Learning backend fundamentals before larger frameworks'] },
      { type: 'note', text: 'Express 4 is still widely used and is the pattern shown in many beginner resources. Express 5 modernizes some behavior, especially around promises, but the core ideas remain familiar.' },
      { type: 'tip', text: 'Express does not replace Node.js. Express runs on Node.js and uses Node HTTP underneath.' },
      { type: 'try', text: 'Look back at the manual Node HTTP route from the previous lesson. Describe how app.get and res.json make that code shorter.' },
      { type: 'keypoints', items: ['Express is a web framework for Node.js.', 'It makes routes, JSON responses, middleware, and static files easier.', 'Express is excellent for APIs and beginner backend projects.', 'Express builds on the Node HTTP server model.'] },
    ],
  },
  {
    slug: 'express-first-app',
    title: 'Your First Express App',
    description: 'Install Express, create a server, and respond to your first routes.',
    level: 'beginner',
    section: 'Express Basics',
    order: 16,
    minutes: 13,
    content: [
      { type: 'p', text: 'An Express app starts with a Node project, the express package, and a server file. You create the app, define routes, and listen on a port.' },
      { type: 'h2', text: 'Create the project' },
      {
        type: 'code',
        title: 'Setup commands',
        language: 'bash',
        code: `mkdir my-express-app
cd my-express-app
npm init -y
npm install express`,
      },
      { type: 'h2', text: 'Create server.js' },
      {
        type: 'code',
        title: 'server.js',
        language: 'javascript',
        code: `const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});`,
      },
      {
        type: 'code',
        title: 'Run the app',
        language: 'bash',
        code: `node server.js`,
      },
      { type: 'h2', text: 'Add npm scripts' },
      {
        type: 'code',
        title: 'package.json',
        language: 'json',
        code: `{
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.3"
  }
}`,
      },
      {
        type: 'code',
        title: 'Start with npm',
        language: 'bash',
        code: `npm start`,
      },
      { type: 'h2', text: 'What app.listen does' },
      { type: 'p', text: 'app.listen starts the HTTP server and tells it which port to use. A port is like a numbered door on your computer. For local development, ports such as 3000, 3001, 5000, and 8000 are common.' },
      { type: 'note', text: 'If port 3000 is already in use, stop the other server or change PORT to another number such as 3001.' },
      { type: 'tip', text: 'Keep server startup near the bottom of server.js. Define middleware and routes first, then call app.listen.' },
      { type: 'try', text: 'Add a GET /about route that sends an HTML string with an h1 and a short paragraph. Visit it in your browser.' },
      { type: 'keypoints', items: ['Install Express with npm install express.', 'Create an app with express().', 'Use app.get to define GET routes.', 'Use app.listen to start the local server.'] },
    ],
  },
  {
    slug: 'express-routing',
    title: 'Routes & HTTP Methods',
    description: 'Understand Express routes and the common HTTP methods used in APIs.',
    level: 'beginner',
    section: 'Express Basics',
    order: 17,
    minutes: 13,
    content: [
      { type: 'p', text: 'A route connects an HTTP method and a URL path to a handler function. The handler receives req and res, then sends a response.' },
      { type: 'h2', text: 'Common HTTP methods' },
      {
        type: 'table',
        headers: ['Method', 'Common purpose', 'Example route'],
        rows: [
          ['GET', 'Read data', 'GET /api/notes'],
          ['POST', 'Create data', 'POST /api/notes'],
          ['PUT', 'Replace data', 'PUT /api/notes/1'],
          ['PATCH', 'Update part of data', 'PATCH /api/notes/1'],
          ['DELETE', 'Delete data', 'DELETE /api/notes/1'],
        ],
      },
      { type: 'h2', text: 'Route examples' },
      {
        type: 'code',
        title: 'routes-demo.js',
        language: 'javascript',
        code: `const express = require('express');

const app = express();

app.get('/api/notes', (req, res) => {
  res.json([{ id: 1, text: 'Learn routing' }]);
});

app.post('/api/notes', (req, res) => {
  res.status(201).json({ message: 'Note created' });
});

app.delete('/api/notes/1', (req, res) => {
  res.status(204).send();
});

app.listen(3000);`,
      },
      { type: 'h2', text: 'Test routes with curl' },
      {
        type: 'code',
        title: 'curl requests',
        language: 'bash',
        code: `curl http://localhost:3000/api/notes
curl -X POST http://localhost:3000/api/notes
curl -X DELETE -i http://localhost:3000/api/notes/1`,
      },
      { type: 'h2', text: 'Status codes' },
      { type: 'p', text: 'HTTP status codes tell the client what happened. Use 200 for success with content, 201 for created, 204 for success with no content, 400 for bad input, 404 for not found, and 500 for unexpected server errors.' },
      {
        type: 'code',
        title: 'Response helpers',
        language: 'javascript',
        code: `app.get('/api/profile', (req, res) => {
  res.status(200).json({
    username: 'maya',
    role: 'student',
  });
});`,
      },
      { type: 'note', text: 'Browsers make GET requests when you type a URL in the address bar. To test POST, PATCH, PUT, or DELETE, use curl, a REST client, or frontend code.' },
      { type: 'tip', text: 'Name API routes with nouns, not verbs. Prefer GET /api/notes over GET /api/getNotes because the HTTP method already describes the action.' },
      { type: 'try', text: 'Create routes for GET /api/books, POST /api/books, and DELETE /api/books/1. Return different status codes and messages for each route.' },
      { type: 'keypoints', items: ['A route combines an HTTP method, path, and handler.', 'GET reads data; POST creates data; PATCH/PUT update data; DELETE removes data.', 'res.status sets the HTTP status code.', 'Good API paths usually use nouns like notes, users, and books.'] },
    ],
  },
  {
    slug: 'express-params-query',
    title: 'Route Params & Query Strings',
    description: 'Read dynamic path values with req.params and optional URL filters with req.query.',
    level: 'beginner',
    section: 'Express Basics',
    order: 18,
    minutes: 12,
    content: [
      { type: 'p', text: 'Express lets routes include dynamic values. A route parameter is part of the path, such as /api/notes/:id. A query string comes after a question mark, such as /api/notes?tag=work.' },
      { type: 'h2', text: 'Route parameters' },
      {
        type: 'code',
        title: 'params.js',
        language: 'javascript',
        code: `const express = require('express');

const app = express();

const notes = [
  { id: 1, text: 'Learn params', tag: 'node' },
  { id: 2, text: 'Build an API', tag: 'express' },
];

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((item) => item.id === id);

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  res.json(note);
});

app.listen(3000);`,
      },
      { type: 'h2', text: 'Query strings' },
      {
        type: 'code',
        title: 'query.js',
        language: 'javascript',
        code: `app.get('/api/notes', (req, res) => {
  const tag = req.query.tag;

  if (!tag) {
    return res.json(notes);
  }

  const filteredNotes = notes.filter((note) => note.tag === tag);
  res.json(filteredNotes);
});`,
      },
      { type: 'h2', text: 'Try the URLs' },
      {
        type: 'code',
        title: 'Example requests',
        language: 'bash',
        code: `curl http://localhost:3000/api/notes/1
curl "http://localhost:3000/api/notes?tag=node"`,
      },
      {
        type: 'table',
        headers: ['URL part', 'Express property', 'Best for'],
        rows: [
          ['/api/notes/2', 'req.params.id', 'Identifying one resource'],
          ['?tag=node', 'req.query.tag', 'Filtering or sorting a list'],
          ['?page=2', 'req.query.page', 'Pagination'],
        ],
      },
      { type: 'note', text: 'Route params and query values arrive as strings. Convert them to numbers or booleans when your logic needs those types.' },
      { type: 'tip', text: 'Use route params for required identity values and query strings for optional filters, search, sorting, and pagination.' },
      { type: 'try', text: 'Add GET /api/books/:id and GET /api/books?author=Octavia. Use req.params for the id and req.query for the author filter.' },
      { type: 'keypoints', items: ['req.params contains dynamic path values.', 'req.query contains query string values.', 'URL values usually arrive as strings.', 'Params identify resources; queries usually filter or modify a list request.'] },
    ],
  },
  {
    slug: 'express-body',
    title: 'Request Body & JSON',
    description: 'Accept JSON request bodies in Express and validate basic input before creating data.',
    level: 'beginner',
    section: 'Express Basics',
    order: 19,
    minutes: 13,
    content: [
      { type: 'p', text: 'POST, PUT, and PATCH requests often send data in the request body. For JSON APIs, Express can parse that body with express.json() middleware.' },
      { type: 'h2', text: 'Enable JSON parsing' },
      {
        type: 'code',
        title: 'json-body.js',
        language: 'javascript',
        code: `const express = require('express');

const app = express();

app.use(express.json());

const notes = [];

app.post('/api/notes', (req, res) => {
  const text = req.body.text;

  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  const note = {
    id: notes.length + 1,
    text,
  };

  notes.push(note);
  res.status(201).json(note);
});

app.listen(3000);`,
      },
      { type: 'h2', text: 'Send JSON with curl' },
      {
        type: 'code',
        title: 'POST request',
        language: 'bash',
        code: `curl -X POST http://localhost:3000/api/notes \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Learn request bodies"}'`,
      },
      { type: 'h2', text: 'What express.json does' },
      { type: 'p', text: 'express.json() reads JSON request bodies, parses them into JavaScript values, and assigns the result to req.body. Without it, req.body will be undefined for JSON requests in a basic Express app.' },
      {
        type: 'code',
        title: 'Inspect req.body',
        language: 'javascript',
        code: `app.post('/api/debug', (req, res) => {
  console.log(req.body);
  res.json({
    received: req.body,
  });
});`,
      },
      { type: 'h2', text: 'Basic validation' },
      { type: 'p', text: 'Never assume the client sent correct data. Beginner validation can start with required fields and type checks. Later, you can use validation libraries for larger APIs.' },
      {
        type: 'code',
        title: 'Validate a string',
        language: 'javascript',
        code: `if (typeof req.body.text !== 'string' || req.body.text.trim() === '') {
  return res.status(400).json({ error: 'text must be a non-empty string' });
}`,
      },
      { type: 'warning', text: 'Do not trust request bodies just because your own frontend sends them. Anyone can send requests to an API endpoint if it is exposed.' },
      { type: 'tip', text: 'Use 400 Bad Request when the client sends missing or invalid data.' },
      { type: 'try', text: 'Build a POST /api/tasks route that requires a title string. Return 400 for missing titles and 201 with the new task for valid requests.' },
      { type: 'keypoints', items: ['Request bodies carry data for POST, PUT, and PATCH requests.', 'express.json() parses JSON bodies into req.body.', 'Set Content-Type: application/json when sending JSON.', 'Validate request data before using or saving it.'] },
    ],
  },
  {
    slug: 'express-middleware',
    title: 'Middleware Explained',
    description: 'Learn how Express middleware runs between the request and the final route response.',
    level: 'beginner',
    section: 'Express Basics',
    order: 20,
    minutes: 13,
    content: [
      { type: 'p', text: 'Middleware is a function that runs during the request-response cycle. It can log information, parse data, check permissions, add values to req, stop the request, or pass control to the next function.' },
      { type: 'h2', text: 'A logger middleware' },
      {
        type: 'code',
        title: 'middleware-demo.js',
        language: 'javascript',
        code: `const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.get('/', (req, res) => {
  res.send('Home');
});

app.listen(3000);`,
      },
      { type: 'h2', text: 'The next function' },
      { type: 'p', text: 'Calling next() tells Express to continue to the next middleware or route handler. If middleware sends a response and does not call next, the request stops there.' },
      {
        type: 'code',
        title: 'Stop a request early',
        language: 'javascript',
        code: `function requireApiKey(req, res, next) {
  const apiKey = req.header('x-api-key');

  if (apiKey !== 'secret') {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
}

app.get('/api/private', requireApiKey, (req, res) => {
  res.json({ message: 'Protected data' });
});`,
      },
      { type: 'h2', text: 'Order matters' },
      { type: 'p', text: 'Express runs middleware in the order you register it. Put app.use(express.json()) before routes that need req.body. Put logging middleware near the top if you want to log most requests.' },
      {
        type: 'code',
        title: 'Common app order',
        language: 'javascript',
        code: `app.use(express.json());
app.use(requestLogger);

app.get('/api/health', healthHandler);
app.post('/api/notes', createNoteHandler);`,
      },
      {
        type: 'table',
        headers: ['Middleware can', 'Example'],
        rows: [
          ['Read request data', 'Log method and path'],
          ['Change req', 'Attach req.user after authentication'],
          ['Send a response', 'Reject missing API keys'],
          ['Call next', 'Continue to the next handler'],
        ],
      },
      { type: 'note', text: 'express.json() is middleware. You have already used middleware even before writing your own.' },
      { type: 'tip', text: 'If a request hangs forever, check whether a middleware forgot to send a response or call next().' },
      { type: 'try', text: 'Write middleware that adds req.requestTime = new Date().toISOString(). Return that value from GET /api/time.' },
      { type: 'keypoints', items: ['Middleware runs before route handlers or between handlers.', 'Call next() to continue the request pipeline.', 'Middleware order affects behavior.', 'Middleware can log, validate, authenticate, parse, or respond early.'] },
    ],
  },
  {
    slug: 'express-static',
    title: 'Serving Static Files',
    description: 'Use express.static to serve images, CSS, JavaScript, and simple public files.',
    level: 'beginner',
    section: 'Express Basics',
    order: 21,
    minutes: 10,
    content: [
      { type: 'p', text: 'Static files are files the server sends as-is, such as images, CSS files, browser JavaScript files, PDFs, and simple HTML pages. Express can serve a folder of static files with express.static().' },
      { type: 'h2', text: 'Create a public folder' },
      {
        type: 'code',
        title: 'Project structure',
        language: 'text',
        code: `my-express-app/
  server.js
  public/
    index.html
    styles.css
    logo.png`,
      },
      { type: 'h2', text: 'Serve the folder' },
      {
        type: 'code',
        title: 'server.js',
        language: 'javascript',
        code: `const express = require('express');
const path = require('node:path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
  console.log('Static server running at http://localhost:3000');
});`,
      },
      { type: 'h2', text: 'Create a simple page' },
      {
        type: 'code',
        title: 'public/index.html',
        language: 'text',
        code: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Express Static Files</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <h1>Hello from public/index.html</h1>
  </body>
</html>`,
      },
      {
        type: 'code',
        title: 'public/styles.css',
        language: 'text',
        code: `body {
  font-family: system-ui, sans-serif;
  margin: 2rem;
}

h1 {
  color: seagreen;
}`,
      },
      { type: 'h2', text: 'Static paths' },
      { type: 'p', text: 'If public contains styles.css, the browser can request /styles.css. If public contains images/logo.png, the browser can request /images/logo.png. The folder name public is not included in the URL.' },
      { type: 'note', text: 'For APIs, static files are often used for uploaded images, documentation pages, or a frontend build. Large production apps may use a CDN or dedicated web server for static assets.' },
      { type: 'tip', text: 'Use path.join(__dirname, "public") so Express receives an absolute folder path, even when the app starts from a different working directory.' },
      { type: 'try', text: 'Create public/about.html and visit http://localhost:3000/about.html. Add a link from index.html to about.html.' },
      { type: 'keypoints', items: ['Static files are served without custom route handlers.', 'express.static serves a folder of public assets.', 'The public folder name is not part of the URL path.', 'Use path helpers to point Express to the correct folder.'] },
    ],
  },
  {
    slug: 'express-router',
    title: 'express.Router()',
    description: 'Organize related Express routes into smaller router modules.',
    level: 'beginner',
    section: 'Express Basics',
    order: 22,
    minutes: 12,
    content: [
      { type: 'p', text: 'As an Express app grows, putting every route in server.js becomes messy. express.Router() lets you group related routes in separate files and mount them under a shared path.' },
      { type: 'h2', text: 'Project structure' },
      {
        type: 'code',
        title: 'Folders and files',
        language: 'text',
        code: `notes-api/
  server.js
  routes/
    notes.js`,
      },
      { type: 'h2', text: 'Create a router' },
      {
        type: 'code',
        title: 'routes/notes.js',
        language: 'javascript',
        code: `const express = require('express');

const router = express.Router();

const notes = [
  { id: 1, text: 'Learn Express Router' },
];

router.get('/', (req, res) => {
  res.json(notes);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((item) => item.id === id);

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  res.json(note);
});

module.exports = router;`,
      },
      { type: 'h2', text: 'Mount the router' },
      {
        type: 'code',
        title: 'server.js',
        language: 'javascript',
        code: `const express = require('express');
const notesRouter = require('./routes/notes');

const app = express();

app.use(express.json());
app.use('/api/notes', notesRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
      },
      { type: 'h2', text: 'How mounted paths combine' },
      {
        type: 'table',
        headers: ['In server.js', 'In router', 'Final URL'],
        rows: [
          ['app.use("/api/notes", notesRouter)', 'router.get("/")', 'GET /api/notes'],
          ['app.use("/api/notes", notesRouter)', 'router.get("/:id")', 'GET /api/notes/1'],
          ['app.use("/api/users", usersRouter)', 'router.post("/")', 'POST /api/users'],
        ],
      },
      { type: 'note', text: 'A router behaves like a mini Express app for a group of routes. It does not call listen; the main app still starts the server.' },
      { type: 'tip', text: 'Group routes by resource, such as notes, users, products, or orders. This keeps files focused.' },
      { type: 'try', text: 'Create routes/books.js with GET / and GET /:id, then mount it at /api/books from server.js.' },
      { type: 'keypoints', items: ['express.Router() groups related routes.', 'Routers are mounted with app.use.', 'Router paths combine with the mount path.', 'Routers help keep server.js small and organized.'] },
    ],
  },
  {
    slug: 'express-errors',
    title: 'Basic Error Handling',
    description: 'Return helpful error responses and add a basic Express error-handling middleware.',
    level: 'beginner',
    section: 'Express Basics',
    order: 23,
    minutes: 13,
    content: [
      { type: 'p', text: 'Errors happen in every backend app. A route might receive invalid input, look up missing data, or hit an unexpected bug. Good error handling sends clear status codes and avoids leaking sensitive details.' },
      { type: 'h2', text: 'Expected errors in routes' },
      {
        type: 'code',
        title: 'not-found-route.js',
        language: 'javascript',
        code: `app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((item) => item.id === id);

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  res.json(note);
});`,
      },
      { type: 'h2', text: 'A 404 fallback route' },
      {
        type: 'code',
        title: 'Place after all routes',
        language: 'javascript',
        code: `app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});`,
      },
      { type: 'h2', text: 'Error-handling middleware' },
      { type: 'p', text: 'Express recognizes error middleware by its four parameters: error, req, res, and next. Place it after your routes and after the 404 fallback.' },
      {
        type: 'code',
        title: 'Error middleware',
        language: 'javascript',
        code: `app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: 'Something went wrong',
  });
});`,
      },
      { type: 'h2', text: 'Forward an error' },
      {
        type: 'code',
        title: 'Use next(error)',
        language: 'javascript',
        code: `app.get('/api/crash', (req, res, next) => {
  try {
    throw new Error('Demo failure');
  } catch (error) {
    next(error);
  }
});`,
      },
      {
        type: 'table',
        headers: ['Status', 'Use when'],
        rows: [
          ['400', 'Client sent invalid input'],
          ['401', 'Authentication is missing or invalid'],
          ['403', 'Client is authenticated but not allowed'],
          ['404', 'Resource or route was not found'],
          ['500', 'Unexpected server problem'],
        ],
      },
      { type: 'note', text: 'Express 5 can automatically forward rejected promises from async route handlers. In Express 4, use try/catch or a helper for async errors.' },
      { type: 'warning', text: 'Do not send full stack traces to users in production. Log details on the server and send a safe message to the client.' },
      { type: 'try', text: 'Add a 404 fallback and error middleware to an Express app. Visit a missing route and confirm the response is JSON.' },
      { type: 'keypoints', items: ['Use status codes to describe error types.', 'A 404 fallback handles unknown routes.', 'Error middleware has four parameters.', 'Log detailed errors on the server but send safe messages to clients.'] },
    ],
  },
  {
    slug: 'express-env-nodemon',
    title: 'Environment Variables & nodemon',
    description: 'Configure ports with environment variables and restart your app automatically during development.',
    level: 'beginner',
    section: 'Express Basics',
    order: 24,
    minutes: 12,
    content: [
      { type: 'p', text: 'Backend apps often need configuration that changes between environments. A local app might use port 3000, while a hosting platform gives your app a port through an environment variable. nodemon helps during development by restarting Node when files change.' },
      { type: 'h2', text: 'Read environment variables' },
      {
        type: 'code',
        title: 'server.js',
        language: 'javascript',
        code: `const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Configured Express app');
});

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});`,
      },
      { type: 'h2', text: 'Set PORT from the terminal' },
      {
        type: 'code',
        title: 'macOS, Linux, and many cloud shells',
        language: 'bash',
        code: `PORT=4000 node server.js`,
      },
      {
        type: 'code',
        title: 'Windows PowerShell',
        language: 'bash',
        code: `$env:PORT=4000; node server.js`,
      },
      { type: 'h2', text: 'Install and use nodemon' },
      {
        type: 'code',
        title: 'Install development dependency',
        language: 'bash',
        code: `npm install --save-dev nodemon`,
      },
      {
        type: 'code',
        title: 'package.json scripts',
        language: 'json',
        code: `{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}`,
      },
      {
        type: 'code',
        title: 'Run development server',
        language: 'bash',
        code: `npm run dev`,
      },
      { type: 'h2', text: 'Secrets and configuration' },
      { type: 'p', text: 'Environment variables are also used for database URLs, API keys, and feature flags. Keep secrets out of source code and avoid committing .env files unless the file is clearly an example without real secrets.' },
      {
        type: 'code',
        title: 'Use an example env file',
        language: 'text',
        code: `.env.example
PORT=3000
DATABASE_URL=replace-with-your-local-database-url`,
      },
      { type: 'note', text: 'Node itself reads process.env. Loading a local .env file usually requires a package such as dotenv, which you will often see in real projects.' },
      { type: 'tip', text: 'Use npm start for production-like startup and npm run dev for development conveniences such as nodemon.' },
      { type: 'try', text: 'Change your app to use process.env.PORT || 3000. Start it once on port 3000 and once with PORT=4000.' },
      { type: 'keypoints', items: ['process.env contains environment variables.', 'PORT is commonly supplied by hosting platforms.', 'nodemon restarts your app when files change.', 'Keep real secrets out of committed source code.'] },
    ],
  },
  {
    slug: 'express-mini-api',
    title: 'Mini Project: Notes API',
    description: 'Put beginner Node.js and Express ideas together by building a small in-memory Notes API.',
    level: 'beginner',
    section: 'Putting It Together',
    order: 25,
    minutes: 15,
    content: [
      { type: 'p', text: 'Now you can combine Node.js, npm, Express, routing, params, JSON bodies, middleware, and error responses into a mini Notes API. This beginner project stores notes in memory, so data resets when the server restarts.' },
      { type: 'h2', text: 'Create the project' },
      {
        type: 'code',
        title: 'Setup commands',
        language: 'bash',
        code: `mkdir notes-api
cd notes-api
npm init -y
npm install express
npm install --save-dev nodemon`,
      },
      {
        type: 'code',
        title: 'package.json scripts',
        language: 'json',
        code: `{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}`,
      },
      { type: 'h2', text: 'Build server.js' },
      {
        type: 'code',
        title: 'server.js',
        language: 'javascript',
        code: `const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let nextId = 3;
const notes = [
  { id: 1, text: 'Learn Node.js basics', completed: true },
  { id: 2, text: 'Build an Express API', completed: false },
];

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/notes', (req, res) => {
  const completed = req.query.completed;

  if (completed === undefined) {
    return res.json(notes);
  }

  const isCompleted = completed === 'true';
  const filteredNotes = notes.filter((note) => note.completed === isCompleted);
  res.json(filteredNotes);
});

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((item) => item.id === id);

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  res.json(note);
});

app.post('/api/notes', (req, res) => {
  const text = req.body.text;

  if (typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'text is required' });
  }

  const note = {
    id: nextId,
    text: text.trim(),
    completed: false,
  };

  nextId += 1;
  notes.push(note);

  res.status(201).json(note);
});

app.patch('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((item) => item.id === id);

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  if (typeof req.body.completed === 'boolean') {
    note.completed = req.body.completed;
  }

  if (typeof req.body.text === 'string' && req.body.text.trim() !== '') {
    note.text = req.body.text.trim();
  }

  res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = notes.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  notes.splice(index, 1);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log('Notes API running at http://localhost:' + PORT);
});`,
      },
      { type: 'h2', text: 'Test the API' },
      {
        type: 'code',
        title: 'Run and request',
        language: 'bash',
        code: `npm run dev

curl http://localhost:3000/api/health
curl http://localhost:3000/api/notes
curl "http://localhost:3000/api/notes?completed=false"`,
      },
      {
        type: 'code',
        title: 'Create and update notes',
        language: 'bash',
        code: `curl -X POST http://localhost:3000/api/notes \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Practice Express routes"}'

curl -X PATCH http://localhost:3000/api/notes/2 \\
  -H "Content-Type: application/json" \\
  -d '{"completed":true}'

curl -X DELETE -i http://localhost:3000/api/notes/1`,
      },
      { type: 'h2', text: 'What this project includes' },
      {
        type: 'ul',
        items: [
          'A health check route for quick testing.',
          'GET routes for all notes and one note by id.',
          'Query string filtering with completed=true or completed=false.',
          'POST JSON body parsing and validation.',
          'PATCH updates for completed and text.',
          'DELETE with a 204 No Content response.',
          '404 and basic error middleware.',
        ],
      },
      { type: 'note', text: 'This API stores data in memory. That is perfect for learning routes, but real apps usually save data in a database so it survives restarts.' },
      { type: 'tip', text: 'After this project, good next steps are validation libraries, databases, authentication, testing, and organizing routes with express.Router().' },
      { type: 'try', text: 'Extend the API with a priority field. Allow POST to set priority to low, medium, or high, and add a query string filter: /api/notes?priority=high.' },
      { type: 'keypoints', items: ['A small API can combine many beginner Express skills.', 'In-memory arrays are useful for practice but not persistent.', 'Use status codes and JSON responses consistently.', 'The same route ideas apply when you later add a database.'] },
    ],
  },
];
