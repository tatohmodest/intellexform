import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    "slug": "useeffect-fundamentals",
    "title": "useEffect Fundamentals",
    "description": "Synchronize with external systems: fetch, timers, and subscriptions.",
    "level": "intermediate",
    "section": "Hooks",
    "order": 9,
    "minutes": 15,
    "content": [
      {
        "type": "p",
        "text": "useEffect runs after paint to sync React with the outside world - APIs, document title, WebSocket listeners. It is not for deriving state from other state (compute that during render instead)."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Fetch on mount",
        "code": "import { useEffect, useState } from 'react';\n\nexport default function Profile({ userId }) {\n  const [user, setUser] = useState(null);\n\n  useEffect(() => {\n    let cancelled = false;\n    fetch(`/api/users/${userId}`)\n      .then((r) => r.json())\n      .then((data) => {\n        if (!cancelled) setUser(data);\n      });\n    return () => {\n      cancelled = true;\n    };\n  }, [userId]);\n\n  if (!user) return <p>Loading…</p>;\n  return <h1>{user.name}</h1>;\n}"
      },
      {
        "type": "h2",
        "text": "Dependency array"
      },
      {
        "type": "ul",
        "items": [
          "[] - run once after mount (and cleanup on unmount).",
          "[userId] - re-run when userId changes.",
          "Omit the array only when you truly need every render (rare)."
        ]
      },
      {
        "type": "warning",
        "text": "Always clean up subscriptions and ignore stale fetch results to avoid memory leaks and race conditions."
      },
      {
        "type": "try",
        "text": "Set document.title to the lesson name in an effect and reset it on cleanup."
      },
      {
        "type": "keypoints",
        "items": [
          "Effects sync with external systems.",
          "Dependencies control when effects re-run.",
          "Return a cleanup function when needed."
        ]
      }
    ]
  },
  {
    "slug": "custom-hooks",
    "title": "Custom Hooks",
    "description": "Extract reusable stateful logic into hooks that start with use.",
    "level": "intermediate",
    "section": "Hooks",
    "order": 10,
    "minutes": 12,
    "content": [
      {
        "type": "p",
        "text": "When two components share the same state + effect pattern, pull it into a custom hook. Hooks are just functions that call other hooks - they must start with use so lint rules can enforce the Rules of Hooks."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "useLocalStorage",
        "code": "import { useEffect, useState } from 'react';\n\nexport function useLocalStorage(key, initial) {\n  const [value, setValue] = useState(() => {\n    if (typeof window === 'undefined') return initial;\n    const raw = window.localStorage.getItem(key);\n    return raw ? JSON.parse(raw) : initial;\n  });\n\n  useEffect(() => {\n    window.localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue];\n}"
      },
      {
        "type": "tip",
        "text": "Keep hooks focused: one concern per hook (storage, media query, debounce) beats a mega-hook."
      },
      {
        "type": "try",
        "text": "Write useToggle(initial) returning [on, toggle, setOn]."
      },
      {
        "type": "keypoints",
        "items": [
          "Custom hooks share stateful logic.",
          "Name them useSomething.",
          "They compose useState, useEffect, and friends."
        ]
      }
    ]
  },
  {
    "slug": "context-api",
    "title": "Context API",
    "description": "Share theme, auth, or locale without prop drilling.",
    "level": "intermediate",
    "section": "Data Flow",
    "order": 11,
    "minutes": 14,
    "content": [
      {
        "type": "p",
        "text": "Prop drilling happens when many layers only pass props downward. Context lets a provider publish a value that any descendant can read with useContext."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Auth context sketch",
        "code": "import { createContext, useContext, useState } from 'react';\n\nconst AuthContext = createContext(null);\n\nexport function AuthProvider({ children }) {\n  const [user, setUser] = useState(null);\n  const value = { user, login: setUser, logout: () => setUser(null) };\n  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;\n}\n\nexport function useAuth() {\n  const ctx = useContext(AuthContext);\n  if (!ctx) throw new Error('useAuth requires AuthProvider');\n  return ctx;\n}"
      },
      {
        "type": "note",
        "text": "Do not put fast-changing values in context without splitting providers - every consumer re-renders when the value changes."
      },
      {
        "type": "try",
        "text": "Add a ThemeProvider with light/dark and a button that toggles it."
      },
      {
        "type": "keypoints",
        "items": [
          "Context avoids deep prop drilling.",
          "Wrap trees in a Provider.",
          "Guard useContext with a custom hook."
        ]
      }
    ]
  },
  {
    "slug": "refs-and-dom",
    "title": "Refs and the DOM",
    "description": "Use useRef for DOM nodes and mutable values that should not re-render.",
    "level": "intermediate",
    "section": "Data Flow",
    "order": 12,
    "minutes": 12,
    "content": [
      {
        "type": "p",
        "text": "Refs hold a mutable .current that survives renders without causing a re-render. Common uses: focus an input, measure an element, keep a timer id, or store the latest callback."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Focus on mount",
        "code": "import { useEffect, useRef } from 'react';\n\nexport default function SearchField() {\n  const inputRef = useRef(null);\n\n  useEffect(() => {\n    inputRef.current?.focus();\n  }, []);\n\n  return <input ref={inputRef} placeholder=\"Search tutorials\" />;\n}"
      },
      {
        "type": "warning",
        "text": "Do not read or write ref.current during render for rendering logic - that belongs in state."
      },
      {
        "type": "try",
        "text": "Scroll a chat container to the bottom when messages.length changes using a ref."
      },
      {
        "type": "keypoints",
        "items": [
          "useRef stores mutable .current.",
          "Attach refs to DOM with the ref prop.",
          "Refs do not trigger re-renders."
        ]
      }
    ]
  },
  {
    "slug": "lifting-state-patterns",
    "title": "Lifting State Patterns",
    "description": "Decide where state lives as features grow.",
    "level": "intermediate",
    "section": "Data Flow",
    "order": 13,
    "minutes": 11,
    "content": [
      {
        "type": "p",
        "text": "As screens grow, push state down until two siblings need the same data - then lift it. For distant trees, prefer composition or context over endless props."
      },
      {
        "type": "table",
        "headers": [
          "Situation",
          "Approach"
        ],
        "rows": [
          [
            "One component uses it",
            "Local useState"
          ],
          [
            "Siblings share it",
            "Lift to parent"
          ],
          [
            "Many distant consumers",
            "Context or store"
          ],
          [
            "Server data",
            "Fetch in parent / loader / React Query"
          ]
        ]
      },
      {
        "type": "try",
        "text": "Refactor a parent that keeps both filter text and selected lesson id; pass only what each child needs."
      },
      {
        "type": "keypoints",
        "items": [
          "Colocate state with its UI.",
          "Lift when siblings must sync.",
          "Context is for broad, stable concerns."
        ]
      }
    ]
  },
  {
    "slug": "react-router-basics",
    "title": "Client Routing Basics",
    "description": "Map URLs to screens with a router (React Router or Next.js App Router concepts).",
    "level": "intermediate",
    "section": "Apps",
    "order": 14,
    "minutes": 13,
    "content": [
      {
        "type": "p",
        "text": "Single-page apps need client routing so /tutorials/react and /tutorials/react/jsx-basics are different screens without full reloads. In Vite apps you often use React Router; in Next.js the filesystem is the router."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "React Router sketch",
        "code": "import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';\n\nexport default function App() {\n  return (\n    <BrowserRouter>\n      <nav>\n        <Link to=\"/\">Home</Link>\n        <Link to=\"/tutorials/react\">React</Link>\n      </nav>\n      <Routes>\n        <Route path=\"/\" element={<Home />} />\n        <Route path=\"/tutorials/react\" element={<ReactHub />} />\n        <Route path=\"/tutorials/react/:slug\" element={<Lesson />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}"
      },
      {
        "type": "note",
        "text": "On InTelleX, tutorial URLs already follow /tutorials/[track]/[slug] - the same idea as nested routes."
      },
      {
        "type": "try",
        "text": "Add a NotFound route and a link back to the React hub."
      },
      {
        "type": "keypoints",
        "items": [
          "Routers map paths to components.",
          "Link navigates without reload.",
          "Params capture dynamic segments like :slug."
        ]
      }
    ]
  },
  {
    "slug": "fetching-data-patterns",
    "title": "Fetching Data Patterns",
    "description": "Handle loading, error, and empty states cleanly.",
    "level": "intermediate",
    "section": "Apps",
    "order": 15,
    "minutes": 14,
    "content": [
      {
        "type": "p",
        "text": "Every network request has three UI states: loading, success, error (plus empty). Model them explicitly so users never see a blank flash."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Status enum pattern",
        "code": "const [status, setStatus] = useState('idle');\nconst [data, setData] = useState(null);\nconst [error, setError] = useState(null);\n\nasync function load() {\n  setStatus('loading');\n  setError(null);\n  try {\n    const res = await fetch('/api/lessons');\n    if (!res.ok) throw new Error('Failed');\n    setData(await res.json());\n    setStatus('success');\n  } catch (e) {\n    setError(e);\n    setStatus('error');\n  }\n}"
      },
      {
        "type": "tip",
        "text": "Libraries like TanStack Query add caching and retries - learn the manual pattern first so you understand what they automate."
      },
      {
        "type": "try",
        "text": "Build a lessons loader UI with Retry on error and a skeleton while loading."
      },
      {
        "type": "keypoints",
        "items": [
          "Model loading / success / error explicitly.",
          "Surface Retry for failures.",
          "Empty states need their own copy."
        ]
      }
    ]
  }
];
