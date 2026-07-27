import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    "slug": "what-is-react",
    "title": "What is React?",
    "description": "Understand React as a UI library: components, declarative views, and why teams use it.",
    "level": "beginner",
    "section": "Getting Started",
    "order": 1,
    "minutes": 10,
    "content": [
      {
        "type": "p",
        "text": "React is a JavaScript library for building user interfaces. Instead of manually updating the DOM every time data changes, you describe what the UI should look like for a given state, and React updates the page efficiently."
      },
      {
        "type": "p",
        "text": "It is component-based: you break the screen into small reusable pieces (buttons, cards, forms) and compose them into pages. That model powers everything from small widgets to apps like InTelleX dashboards."
      },
      {
        "type": "h2",
        "text": "Declarative UI"
      },
      {
        "type": "ul",
        "items": [
          "You describe the end result: \"show a list of lessons\".",
          "React figures out the DOM updates.",
          "You focus on data and components, not document.querySelector loops."
        ]
      },
      {
        "type": "h2",
        "text": "A tiny mental model"
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "UI = f(state)",
        "code": "function Greeting({ name }) {\n  return <h1>Hello, {name}</h1>;\n}\n\n// Same input → same UI\n<Greeting name=\"Ada\" />"
      },
      {
        "type": "note",
        "text": "React is a library, not a full framework. Routing, data fetching, and build tools usually come from the ecosystem (for example Next.js, which you can learn after this track)."
      },
      {
        "type": "try",
        "text": "List three UI pieces on any website that could become React components (nav, card, form)."
      },
      {
        "type": "keypoints",
        "items": [
          "React builds UIs with reusable components.",
          "You declare UI from state; React updates the DOM.",
          "It pairs well with tools like Next.js for full apps."
        ]
      }
    ]
  },
  {
    "slug": "jsx-basics",
    "title": "JSX Basics",
    "description": "Write JSX: elements, expressions, attributes, and the rules that keep it valid.",
    "level": "beginner",
    "section": "Getting Started",
    "order": 2,
    "minutes": 12,
    "content": [
      {
        "type": "p",
        "text": "JSX looks like HTML inside JavaScript. It is syntactic sugar that compiles to React.createElement calls. Browsers do not run JSX directly — your bundler (Vite, Next.js, etc.) transforms it."
      },
      {
        "type": "h2",
        "text": "Expressions in curly braces"
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Embedding JS",
        "code": "const topic = 'React';\nconst minutes = 12;\n\nexport default function Lesson() {\n  return (\n    <article>\n      <h2>{topic}</h2>\n      <p>About {minutes} minutes to complete.</p>\n    </article>\n  );\n}"
      },
      {
        "type": "h2",
        "text": "JSX rules you must know"
      },
      {
        "type": "ul",
        "items": [
          "Return one root element (or a Fragment <>...</>).",
          "Use className instead of class, htmlFor instead of for.",
          "Self-close tags with no children: <img />, <br />.",
          "Attributes use camelCase: onClick, tabIndex."
        ]
      },
      {
        "type": "warning",
        "text": "You cannot put if/else statements directly inside JSX. Use ternaries, &&, or compute values above the return."
      },
      {
        "type": "try",
        "text": "Rewrite a static HTML card as a JSX function that interpolates title and price variables."
      },
      {
        "type": "keypoints",
        "items": [
          "JSX mixes markup with JavaScript expressions.",
          "className and camelCase events are required.",
          "One parent (or Fragment) per return."
        ]
      }
    ]
  },
  {
    "slug": "components-and-props",
    "title": "Components and Props",
    "description": "Build function components and pass data with props.",
    "level": "beginner",
    "section": "Components",
    "order": 3,
    "minutes": 14,
    "content": [
      {
        "type": "p",
        "text": "A component is a function that returns JSX. Props are the inputs — read-only data from the parent. Treat props like function arguments: never mutate them inside the child."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Props in action",
        "code": "function TrackCard({ title, lessons, tag }) {\n  return (\n    <div className=\"card\">\n      <span>{tag}</span>\n      <h3>{title}</h3>\n      <p>{lessons} lessons</p>\n    </div>\n  );\n}\n\nexport default function Catalog() {\n  return (\n    <TrackCard title=\"React\" lessons={24} tag=\"Frontend\" />\n  );\n}"
      },
      {
        "type": "h2",
        "text": "children prop"
      },
      {
        "type": "p",
        "text": "Anything nested between opening and closing tags becomes props.children — perfect for layout wrappers."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Wrapper with children",
        "code": "function Panel({ children }) {\n  return <section className=\"panel\">{children}</section>;\n}\n\n<Panel>\n  <h2>Welcome</h2>\n  <p>Start the React path.</p>\n</Panel>"
      },
      {
        "type": "tip",
        "text": "Destructure props in the parameter list for clearer components: function Button({ label, onClick }) { ... }."
      },
      {
        "type": "try",
        "text": "Create Avatar({ name, size }) and render three sizes on one page."
      },
      {
        "type": "keypoints",
        "items": [
          "Components are functions returning JSX.",
          "Props flow parent → child and are read-only.",
          "children lets you compose layouts."
        ]
      }
    ]
  },
  {
    "slug": "rendering-lists",
    "title": "Rendering Lists",
    "description": "Map arrays to elements and use stable keys.",
    "level": "beginner",
    "section": "Components",
    "order": 4,
    "minutes": 12,
    "content": [
      {
        "type": "p",
        "text": "Most UIs render collections: lessons, messages, products. In React you map an array to JSX and give each item a key so React can track identity across updates."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "List with keys",
        "code": "const lessons = [\n  { id: 'jsx', title: 'JSX Basics' },\n  { id: 'props', title: 'Components and Props' },\n];\n\nexport default function LessonList() {\n  return (\n    <ul>\n      {lessons.map((lesson) => (\n        <li key={lesson.id}>{lesson.title}</li>\n      ))}\n    </ul>\n  );\n}"
      },
      {
        "type": "h2",
        "text": "Key rules"
      },
      {
        "type": "ul",
        "items": [
          "Prefer stable IDs from your data, not array index (index breaks when you insert/reorder).",
          "Keys must be unique among siblings.",
          "Do not use keys as props — they are for React internals."
        ]
      },
      {
        "type": "try",
        "text": "Render a filtered list of tutorials where tag === \"Frontend\"."
      },
      {
        "type": "keypoints",
        "items": [
          "Use .map to render lists.",
          "Keys identify items across renders.",
          "Stable IDs beat index keys."
        ]
      }
    ]
  },
  {
    "slug": "conditional-rendering",
    "title": "Conditional Rendering",
    "description": "Show or hide UI with ternaries, &&, and early returns.",
    "level": "beginner",
    "section": "Components",
    "order": 5,
    "minutes": 10,
    "content": [
      {
        "type": "p",
        "text": "Interfaces change with state: loading spinners, empty states, locked lessons. React conditional rendering is plain JavaScript inside JSX."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Common patterns",
        "code": "function LessonGate({ locked, title }) {\n  if (locked) {\n    return <p>Unlock {title} to continue.</p>;\n  }\n\n  return (\n    <>\n      <h1>{title}</h1>\n      {title && <p>Ready when you are.</p>}\n      {locked ? <Lock /> : <Play />}\n    </>\n  );\n}"
      },
      {
        "type": "warning",
        "text": "Avoid {count && <Badge />} when count can be 0 — React will render 0. Prefer count > 0 && <Badge />."
      },
      {
        "type": "try",
        "text": "Build a banner that shows \"Free\" or \"Payable\" based on a boolean prop."
      },
      {
        "type": "keypoints",
        "items": [
          "Use if, ternary, or && for UI branches.",
          "Early return keeps components readable.",
          "Watch for falsy 0 rendering bugs."
        ]
      }
    ]
  },
  {
    "slug": "usestate-basics",
    "title": "useState Basics",
    "description": "Add interactive state with the useState hook.",
    "level": "beginner",
    "section": "State",
    "order": 6,
    "minutes": 14,
    "content": [
      {
        "type": "p",
        "text": "Props come from outside. State lives inside a component and can change over time — toggles, form fields, counters. useState is the hook that gives you that local state."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Counter",
        "code": "import { useState } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}"
      },
      {
        "type": "h2",
        "text": "Updater form"
      },
      {
        "type": "p",
        "text": "When the next value depends on the previous one, pass a function to the setter so you never read a stale value."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Functional updates",
        "code": "setCount((c) => c + 1);\nsetItems((prev) => [...prev, newItem]);"
      },
      {
        "type": "tip",
        "text": "Do not mutate state arrays/objects in place. Create a new value so React knows to re-render."
      },
      {
        "type": "try",
        "text": "Build a like button that toggles liked true/false and changes the label."
      },
      {
        "type": "keypoints",
        "items": [
          "useState returns [value, setter].",
          "Calling the setter re-renders the component.",
          "Prefer functional updates for derived next state."
        ]
      }
    ]
  },
  {
    "slug": "forms-and-events",
    "title": "Forms and Events",
    "description": "Handle clicks, inputs, and controlled form fields.",
    "level": "beginner",
    "section": "State",
    "order": 7,
    "minutes": 14,
    "content": [
      {
        "type": "p",
        "text": "React events use camelCase (onClick, onChange) and receive a SyntheticEvent. Controlled inputs keep the value in state so React owns the field."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Controlled input",
        "code": "import { useState } from 'react';\n\nexport default function SearchBox() {\n  const [query, setQuery] = useState('');\n\n  function handleSubmit(e) {\n    e.preventDefault();\n    console.log('Search:', query);\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input\n        value={query}\n        onChange={(e) => setQuery(e.target.value)}\n        placeholder=\"Find a lesson\"\n      />\n      <button type=\"submit\">Search</button>\n    </form>\n  );\n}"
      },
      {
        "type": "ul",
        "items": [
          "Always call preventDefault on form submit to avoid full page reloads.",
          "One state field per input keeps forms predictable.",
          "Disable the submit button while saving to prevent double posts."
        ]
      },
      {
        "type": "try",
        "text": "Create a login form with email + password state and log both on submit."
      },
      {
        "type": "keypoints",
        "items": [
          "Events are camelCase and take handlers.",
          "Controlled inputs sync value with state.",
          "preventDefault stops native form navigation."
        ]
      }
    ]
  },
  {
    "slug": "thinking-in-components",
    "title": "Thinking in Components",
    "description": "Split a UI mock into a component tree and lift state when needed.",
    "level": "beginner",
    "section": "Projects",
    "order": 8,
    "minutes": 12,
    "content": [
      {
        "type": "p",
        "text": "Good React design starts on paper: identify repeating UI, name components, decide which data is local vs shared. Shared state belongs in the closest common parent (lifting state up)."
      },
      {
        "type": "h2",
        "text": "Example: course hub"
      },
      {
        "type": "ul",
        "items": [
          "CourseHub — page layout",
          "LevelTabs — beginner / intermediate / advanced",
          "LessonCard — title, minutes, lock icon",
          "ProgressBar — completion percent"
        ]
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Lifted filter state",
        "code": "function CourseHub({ lessons }) {\n  const [level, setLevel] = useState('beginner');\n  const visible = lessons.filter((l) => l.level === level);\n\n  return (\n    <>\n      <LevelTabs value={level} onChange={setLevel} />\n      {visible.map((l) => (\n        <LessonCard key={l.slug} lesson={l} />\n      ))}\n    </>\n  );\n}"
      },
      {
        "type": "try",
        "text": "Sketch components for a chat UI (message list, composer, suggestion chips) before coding."
      },
      {
        "type": "keypoints",
        "items": [
          "Name components from the UI structure.",
          "Keep state as local as possible.",
          "Lift state to the nearest shared parent."
        ]
      }
    ]
  }
];
