import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    "slug": "performance-memo",
    "title": "Performance: memo and friends",
    "description": "Know when memo, useMemo, and useCallback help — and when they hurt.",
    "level": "advanced",
    "section": "Performance",
    "order": 16,
    "minutes": 14,
    "content": [
      {
        "type": "p",
        "text": "React is fast by default. Optimize when you measure a problem: expensive pure subtrees re-rendering too often, or huge lists. Premature memoization adds complexity."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Targeted memo",
        "code": "import { memo, useMemo } from 'react';\n\nconst LessonRow = memo(function LessonRow({ lesson }) {\n  return <li>{lesson.title}</li>;\n});\n\nfunction LessonList({ lessons, query }) {\n  const filtered = useMemo(\n    () => lessons.filter((l) => l.title.includes(query)),\n    [lessons, query],\n  );\n  return filtered.map((l) => <LessonRow key={l.id} lesson={l} />);\n}"
      },
      {
        "type": "ul",
        "items": [
          "memo skips re-render when props are shallow-equal.",
          "useMemo caches expensive calculations.",
          "useCallback stabilizes function identity for memoized children."
        ]
      },
      {
        "type": "warning",
        "text": "If props are new objects/functions every render, memo buys you nothing. Fix the parent first."
      },
      {
        "type": "try",
        "text": "Profile a list of 500 rows and memoize the row component only if needed."
      },
      {
        "type": "keypoints",
        "items": [
          "Measure before optimizing.",
          "memo helps stable props.",
          "Avoid memoizing everything by default."
        ]
      }
    ]
  },
  {
    "slug": "error-boundaries",
    "title": "Error Boundaries",
    "description": "Catch render errors so one broken widget does not blank the whole app.",
    "level": "advanced",
    "section": "Resilience",
    "order": 17,
    "minutes": 12,
    "content": [
      {
        "type": "p",
        "text": "Error boundaries are class components (or libraries) that catch errors in their child tree during render and show a fallback. They do not catch event handler or async errors — use try/catch there."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Boundary sketch",
        "code": "class LessonBoundary extends React.Component {\n  state = { hasError: false };\n  static getDerivedStateFromError() {\n    return { hasError: true };\n  }\n  render() {\n    if (this.state.hasError) {\n      return <p>This lesson failed to render. Try refreshing.</p>;\n    }\n    return this.props.children;\n  }\n}"
      },
      {
        "type": "try",
        "text": "Wrap a risky chart widget in a boundary while leaving the rest of the lesson page intact."
      },
      {
        "type": "keypoints",
        "items": [
          "Boundaries catch render-time errors.",
          "Show a useful fallback UI.",
          "Handlers still need try/catch."
        ]
      }
    ]
  },
  {
    "slug": "concurrent-patterns",
    "title": "Concurrent Patterns",
    "description": "Use startTransition and useDeferredValue for snappy UIs under load.",
    "level": "advanced",
    "section": "Performance",
    "order": 18,
    "minutes": 13,
    "content": [
      {
        "type": "p",
        "text": "React 18+ can interrupt non-urgent updates. Mark expensive state updates as transitions so typing stays responsive while a heavy list filters in the background."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "startTransition",
        "code": "import { useState, startTransition } from 'react';\n\nfunction Search({ items }) {\n  const [text, setText] = useState('');\n  const [query, setQuery] = useState('');\n\n  function onChange(e) {\n    const next = e.target.value;\n    setText(next); // urgent: keep input instant\n    startTransition(() => setQuery(next)); // non-urgent filter\n  }\n\n  const visible = items.filter((i) => i.includes(query));\n  return (\n    <>\n      <input value={text} onChange={onChange} />\n      <List items={visible} />\n    </>\n  );\n}"
      },
      {
        "type": "tip",
        "text": "useDeferredValue(value) is similar when you cannot wrap the setter yourself."
      },
      {
        "type": "try",
        "text": "Defer filtering a 2,000-item catalogue while the search box stays instant."
      },
      {
        "type": "keypoints",
        "items": [
          "Transitions mark updates as non-urgent.",
          "Keep input state urgent.",
          "useDeferredValue softens expensive derived UI."
        ]
      }
    ]
  },
  {
    "slug": "testing-components",
    "title": "Testing Components",
    "description": "Test behavior with React Testing Library — user-centric queries.",
    "level": "advanced",
    "section": "Quality",
    "order": 19,
    "minutes": 12,
    "content": [
      {
        "type": "p",
        "text": "Prefer testing what the user sees and does over implementation details. React Testing Library queries by role, label, and text."
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Example test",
        "code": "import { render, screen } from '@testing-library/react';\nimport userEvent from '@testing-library/user-event';\nimport Counter from './Counter';\n\ntest('increments on click', async () => {\n  const user = userEvent.setup();\n  render(<Counter />);\n  await user.click(screen.getByRole('button', { name: /clicked/i }));\n  expect(screen.getByRole('button')).toHaveTextContent('Clicked 1 times');\n});"
      },
      {
        "type": "try",
        "text": "Write a test for your SearchBox that types a query and submits the form."
      },
      {
        "type": "keypoints",
        "items": [
          "Query like a user (roles, labels).",
          "Assert on visible outcomes.",
          "Avoid testing internal state variables."
        ]
      }
    ]
  },
  {
    "slug": "react-architecture",
    "title": "App Architecture",
    "description": "Structure folders, feature modules, and boundaries for growing React apps.",
    "level": "advanced",
    "section": "Architecture",
    "order": 20,
    "minutes": 14,
    "content": [
      {
        "type": "p",
        "text": "As apps grow, organize by feature (courses/, tutor/, admin/) rather than only by type (components/, hooks/). Keep UI components dumb when possible; put data fetching at route or feature edges."
      },
      {
        "type": "ul",
        "items": [
          "features/react-path — pages + hooks for this track",
          "components/ui — buttons, inputs, code blocks",
          "lib/ — pure helpers with no React",
          "app/ or pages/ — routing entrypoints"
        ]
      },
      {
        "type": "note",
        "text": "Next stop after this track: the Next.js tutorial on InTelleX, where React meets server components, routing, and production deployment."
      },
      {
        "type": "try",
        "text": "Sketch a folder tree for a mini “lesson player” feature with progress API hooks."
      },
      {
        "type": "keypoints",
        "items": [
          "Feature folders scale better than type-only folders.",
          "Keep pure logic in lib/.",
          "Continue into Next.js for full-stack React."
        ]
      }
    ]
  },
  {
    "slug": "react-capstone",
    "title": "Capstone: Lesson Player UI",
    "description": "Build a mini lesson player with list, active lesson, progress, and lock state.",
    "level": "advanced",
    "section": "Projects",
    "order": 21,
    "minutes": 20,
    "content": [
      {
        "type": "p",
        "text": "Bring the track together: state, lists, conditionals, effects, and composition. Build a lesson player that mirrors InTelleX — sidebar curriculum, main content, and a progress bar."
      },
      {
        "type": "h2",
        "text": "Requirements"
      },
      {
        "type": "ol",
        "items": [
          "Sidebar lists lessons grouped by level.",
          "Clicking a lesson shows its title + description in the main pane.",
          "Mark complete toggles a Set of completed slugs in state (persist with localStorage via your custom hook).",
          "If a lesson is marked locked, show a paywall panel instead of content.",
          "Progress bar = completed / total."
        ]
      },
      {
        "type": "code",
        "language": "jsx",
        "title": "Starter shape",
        "code": "function LessonPlayer({ lessons }) {\n  const [active, setActive] = useState(lessons[0].slug);\n  const [done, setDone] = useLocalStorage('react-done', []);\n  const lesson = lessons.find((l) => l.slug === active);\n  const pct = Math.round((done.length / lessons.length) * 100);\n\n  return (\n    <div className=\"player\">\n      <aside>\n        {lessons.map((l) => (\n          <button key={l.slug} onClick={() => setActive(l.slug)}>\n            {done.includes(l.slug) ? '✓' : '○'} {l.title}\n          </button>\n        ))}\n        <div>Progress: {pct}%</div>\n      </aside>\n      <main>\n        {lesson.locked ? <Paywall /> : <Article lesson={lesson} />}\n        <button onClick={() => setDone((d) => [...new Set([...d, active])])}>\n          Mark complete\n        </button>\n      </main>\n    </div>\n  );\n}"
      },
      {
        "type": "try",
        "text": "Ship the capstone in a Vite + React sandbox, then compare it to /dashboard/courses/react on InTelleX."
      },
      {
        "type": "keypoints",
        "items": [
          "Compose small components into a player.",
          "Persist progress with a custom hook.",
          "Locked content is just conditional UI + access rules."
        ]
      }
    ]
  }
];
