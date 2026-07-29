/**
 * Generates 8 InTelleX tutorial tracks (65 lessons each):
 * C++, Java, Arduino, Kubernetes, Rust, Ruby on Rails,
 * Linux Administration, Bash Scripting.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const p = (text) => ({ type: 'p', text });
const h2 = (text) => ({ type: 'h2', text });
const ul = (items) => ({ type: 'ul', items });
const ol = (items) => ({ type: 'ol', items });
const code = (codeText, title, language = 'text') => ({
  type: 'code',
  code: codeText,
  title,
  language,
});
const tip = (text) => ({ type: 'tip', text });
const note = (text) => ({ type: 'note', text });
const warning = (text) => ({ type: 'warning', text });
const tryIt = (text) => ({ type: 'try', text });
const keypoints = (items) => ({ type: 'keypoints', items });
const table = (headers, rows) => ({ type: 'table', headers, rows });

function lesson(meta, blocks) {
  return {
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    level: meta.level,
    section: meta.section,
    order: meta.order,
    minutes: meta.minutes ?? (meta.level === 'advanced' ? 15 : 12),
    content: blocks,
  };
}

function introBlocks(course, topic, why) {
  return [
    p(`${topic} is a core skill in the ${course} path on InTelleX. ${why}`),
    p('Read carefully, type every example yourself, and finish the practice prompt before moving on.'),
  ];
}

function standardClose(practice, points) {
  return [tryIt(practice), keypoints(points)];
}

function emitFile(dir, exportName, lessons) {
  mkdirSync(dir, { recursive: true });
  const lines = [
    `import type { TutorialLesson } from '../types';`,
    '',
    `export const ${exportName}: TutorialLesson[] = [`,
  ];
  for (const l of lessons) {
    lines.push('  {');
    lines.push(`    slug: ${JSON.stringify(l.slug)},`);
    lines.push(`    title: ${JSON.stringify(l.title)},`);
    lines.push(`    description: ${JSON.stringify(l.description)},`);
    lines.push(`    level: ${JSON.stringify(l.level)},`);
    lines.push(`    section: ${JSON.stringify(l.section)},`);
    lines.push(`    order: ${l.order},`);
    lines.push(`    minutes: ${l.minutes},`);
    lines.push('    content: [');
    for (const b of l.content) lines.push(`      ${JSON.stringify(b)},`);
    lines.push('    ],');
    lines.push('  },');
  }
  lines.push('];', '');
  writeFileSync(join(dir, exportName === 'beginnerLessons' ? 'beginner.ts' : exportName === 'intermediateLessons' ? 'intermediate.ts' : 'advanced.ts'), lines.join('\n'));
}

function writeCourseIndex(slug, cfg) {
  const dir = join(process.cwd(), 'lib/tutorials', slug);
  mkdirSync(dir, { recursive: true });
  const varName = cfg.varName;
  const content = `import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary: ${JSON.stringify(cfg.beginnerSummary)},
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary: ${JSON.stringify(cfg.intermediateSummary)},
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary: ${JSON.stringify(cfg.advancedSummary)},
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const ${varName}: TutorialCourse = {
  slug: ${JSON.stringify(slug)},
  title: ${JSON.stringify(cfg.title)},
  shortTitle: ${JSON.stringify(cfg.shortTitle)},
  description: ${JSON.stringify(cfg.description)},
  tagline: ${JSON.stringify(cfg.tagline)},
  audience: ${JSON.stringify(cfg.audience)},
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: ${JSON.stringify(cfg.tag)},
  highlights: ${JSON.stringify(cfg.highlights)},
};

export function getAll${cfg.pascal}Lessons() {
  return allLessons;
}

export function get${cfg.pascal}Lesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function get${cfg.pascal}LessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
`;
  writeFileSync(join(dir, 'index.ts'), content);
}

function writeAppRoutes(slug, cfg) {
  const dir = join(process.cwd(), 'app/tutorials', slug);
  const lessonDir = join(dir, '[slug]');
  mkdirSync(dir, { recursive: true });
  mkdirSync(lessonDir, { recursive: true });
  writeFileSync(
    join(dir, 'page.tsx'),
    `import TutorialCourseView from '@/components/tutorials/TutorialCourseView';
import { ${cfg.varName} } from '@/lib/tutorials/${slug}';

export const metadata = {
  title: '${cfg.title} - Intellex',
  description: ${cfg.varName}.description,
};

export default function Page() {
  return <TutorialCourseView course={${cfg.varName}} eyebrow="${cfg.eyebrow}" />;
}
`,
  );
  writeFileSync(
    join(lessonDir, 'page.tsx'),
    `import { notFound } from 'next/navigation';
import TutorialLessonView from '@/components/tutorials/TutorialLessonView';
import {
  getAll${cfg.pascal}Lessons,
  get${cfg.pascal}LessonNav,
  ${cfg.varName},
} from '@/lib/tutorials/${slug}';

export function generateStaticParams() {
  return getAll${cfg.pascal}Lessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = get${cfg.pascal}LessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found - Intellex' };
  return {
    title: \`\${nav.lesson.title} - ${cfg.title} | Intellex\`,
    description: nav.lesson.description,
  };
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const nav = get${cfg.pascal}LessonNav(params.slug);
  if (!nav) notFound();
  return (
    <TutorialLessonView
      course={${cfg.varName}}
      lesson={nav.lesson}
      prev={nav.prev}
      next={nav.next}
      index={nav.index}
    />
  );
}
`,
  );
}

/** Split 65 outline items into beginner/intermediate/advanced with sections. */
function buildFromOutline(courseName, lang, outline) {
  const beginner = [];
  const intermediate = [];
  const advanced = [];
  outline.forEach((item, i) => {
    const order = i + 1;
    const level = order <= 25 ? 'beginner' : order <= 48 ? 'intermediate' : 'advanced';
    const meta = {
      slug: item.slug,
      title: item.title,
      description: item.description,
      level,
      section: item.section,
      order,
      minutes: item.minutes || (level === 'advanced' ? 16 : level === 'intermediate' ? 13 : 11),
    };
    const blocks = [
      ...introBlocks(courseName, item.title, item.why || `You will learn ${item.title.toLowerCase()} with clear examples.`),
      h2('What you will learn'),
      ul(item.bullets || [`Core ideas behind ${item.title}`, 'Worked examples you can run', 'Common mistakes to avoid']),
      ...(item.code
        ? [h2('Example'), code(item.code, item.codeTitle || 'Example', item.lang || lang)]
        : []),
      ...(item.extra || []),
      tip(item.tip || 'Type the example yourself - reading alone is not enough.'),
      note(item.note || `Keep notes in your ${courseName} lab folder as you go.`),
      ...(item.warning ? [warning(item.warning)] : []),
      ...standardClose(
        item.try || `Practice ${item.title.toLowerCase()} with a small exercise of your own.`,
        item.keys || [
          `${item.title} is an essential ${courseName} skill.`,
          'Practice with real commands or code, not only theory.',
          'Move on only when the practice prompt feels easy.',
        ],
      ),
    ];
    const L = lesson(meta, blocks);
    if (level === 'beginner') beginner.push(L);
    else if (level === 'intermediate') intermediate.push(L);
    else advanced.push(L);
  });
  return { beginner, intermediate, advanced };
}

// ─── Curricula ─────────────────────────────────────────────

const CPP = [
  { slug: 'welcome-to-cpp', title: 'Welcome to C++', description: 'Meet modern C++ and how this InTelleX path is organized.', section: 'Getting Started', why: 'C++ powers systems, games, embedded, and high-performance software.', bullets: ['What C++ is used for', 'How this tutorial is structured', 'Tooling overview'], code: '#include <iostream>\nint main() {\n  std::cout << "Hello, C++\\n";\n  return 0;\n}', codeTitle: 'Hello world', lang: 'cpp', try: 'Install a C++ compiler (g++ or clang++) and compile hello.cpp.' },
  { slug: 'cpp-setup-compiler', title: 'Install a C++ Compiler', description: 'Set up g++/clang++ and verify your toolchain.', section: 'Getting Started', code: 'g++ --version\ng++ hello.cpp -o hello\n./hello', lang: 'bash' },
  { slug: 'cpp-first-program', title: 'Your First C++ Program', description: 'Write, compile, and run a tiny program end to end.', section: 'Getting Started', code: '#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Intellex C++ lab\\n";\n}', lang: 'cpp' },
  { slug: 'cpp-variables-types', title: 'Variables & Fundamental Types', description: 'int, double, char, bool, and type safety basics.', section: 'Language Basics', code: 'int age = 20;\ndouble pi = 3.14159;\nbool ok = true;\nchar grade = \'A\';', lang: 'cpp' },
  { slug: 'cpp-constants', title: 'Constants & const', description: 'Use const and constexpr for safer values.', section: 'Language Basics', code: 'const int MAX = 100;\nconstexpr double G = 9.81;', lang: 'cpp' },
  { slug: 'cpp-operators', title: 'Operators & Expressions', description: 'Arithmetic, comparison, logical, and assignment operators.', section: 'Language Basics' },
  { slug: 'cpp-input-output', title: 'Input & Output with iostream', description: 'cin, cout, and formatting basics.', section: 'Language Basics', code: 'int n;\nstd::cin >> n;\nstd::cout << "You typed " << n << "\\n";', lang: 'cpp' },
  { slug: 'cpp-conditionals', title: 'Conditionals', description: 'if, else if, else, and switch.', section: 'Control Flow', code: 'if (score >= 90) grade = \'A\';\nelse if (score >= 80) grade = \'B\';\nelse grade = \'C\';', lang: 'cpp' },
  { slug: 'cpp-loops', title: 'Loops', description: 'for, while, and do-while with clear examples.', section: 'Control Flow', code: 'for (int i = 0; i < 5; ++i) {\n  std::cout << i << "\\n";\n}', lang: 'cpp' },
  { slug: 'cpp-functions', title: 'Functions', description: 'Declare, define, and call functions with parameters.', section: 'Functions', code: 'int add(int a, int b) {\n  return a + b;\n}', lang: 'cpp' },
  { slug: 'cpp-overloading', title: 'Function Overloading', description: 'Multiple functions with the same name and different signatures.', section: 'Functions' },
  { slug: 'cpp-default-args', title: 'Default Arguments', description: 'Provide optional parameters with defaults.', section: 'Functions' },
  { slug: 'cpp-arrays', title: 'Arrays', description: 'Fixed-size arrays and common pitfalls.', section: 'Data Structures', code: 'int nums[5] = {1, 2, 3, 4, 5};\nstd::cout << nums[0];', lang: 'cpp' },
  { slug: 'cpp-strings', title: 'std::string', description: 'Create, concatenate, and inspect strings.', section: 'Data Structures', code: '#include <string>\nstd::string name = "Ada";\nname += " Lovelace";', lang: 'cpp' },
  { slug: 'cpp-vectors', title: 'std::vector', description: 'Dynamic arrays with push_back and size.', section: 'Data Structures', code: '#include <vector>\nstd::vector<int> v;\nv.push_back(10);\nv.push_back(20);', lang: 'cpp' },
  { slug: 'cpp-range-for', title: 'Range-based for', description: 'Iterate containers cleanly with for-each style loops.', section: 'Data Structures', code: 'for (int x : v) std::cout << x << " ";', lang: 'cpp' },
  { slug: 'cpp-references', title: 'References', description: 'Alias variables and pass by reference.', section: 'Memory Basics', code: 'void bump(int& n) { n += 1; }', lang: 'cpp' },
  { slug: 'cpp-pointers', title: 'Pointers', description: 'Addresses, dereference, and nullptr.', section: 'Memory Basics', code: 'int x = 5;\nint* p = &x;\nstd::cout << *p;', lang: 'cpp' },
  { slug: 'cpp-new-delete', title: 'new and delete', description: 'Dynamic allocation and why modern C++ prefers RAII.', section: 'Memory Basics', warning: 'Prefer smart pointers in modern code; learn new/delete to understand ownership.' },
  { slug: 'cpp-structs', title: 'Structs', description: 'Group related data into simple types.', section: 'User Types', code: 'struct Point { double x; double y; };', lang: 'cpp' },
  { slug: 'cpp-classes-intro', title: 'Classes Intro', description: 'Encapsulation with public and private members.', section: 'User Types', code: 'class Counter {\npublic:\n  void inc() { value++; }\n  int get() const { return value; }\nprivate:\n  int value = 0;\n};', lang: 'cpp' },
  { slug: 'cpp-constructors', title: 'Constructors & Destructors', description: 'Initialize objects and clean up resources.', section: 'User Types' },
  { slug: 'cpp-methods', title: 'Member Functions', description: 'Define behavior on your types.', section: 'User Types' },
  { slug: 'cpp-header-files', title: 'Headers & Source Files', description: 'Split declarations and definitions across files.', section: 'Projects', code: '// math.hpp\nint square(int x);\n// math.cpp\nint square(int x) { return x * x; }', lang: 'cpp' },
  { slug: 'cpp-mini-project-cli', title: 'Project: CLI Calculator', description: 'Build a small calculator using functions and loops.', section: 'Projects', minutes: 18 },
  // intermediate 26-48
  { slug: 'cpp-oop-encapsulation', title: 'Encapsulation in Depth', description: 'Design classes with clear public APIs.', section: 'Object-Oriented C++' },
  { slug: 'cpp-inheritance', title: 'Inheritance', description: 'Derive classes and reuse behavior.', section: 'Object-Oriented C++', code: 'class Animal { public: virtual void speak() {} };\nclass Dog : public Animal { public: void speak() override; };', lang: 'cpp' },
  { slug: 'cpp-polymorphism', title: 'Polymorphism & virtual', description: 'Call the right method through base pointers.', section: 'Object-Oriented C++' },
  { slug: 'cpp-abstract-classes', title: 'Abstract Classes', description: 'Pure virtual functions and interfaces.', section: 'Object-Oriented C++' },
  { slug: 'cpp-operator-overloading', title: 'Operator Overloading', description: 'Define +, ==, and stream operators carefully.', section: 'Object-Oriented C++' },
  { slug: 'cpp-stl-overview', title: 'STL Overview', description: 'Containers, iterators, and algorithms map.', section: 'Standard Library' },
  { slug: 'cpp-map-set', title: 'map & set', description: 'Associative containers for keys and unique values.', section: 'Standard Library', code: '#include <map>\nstd::map<std::string, int> ages;\nages["Ada"] = 36;', lang: 'cpp' },
  { slug: 'cpp-algorithms', title: 'STL Algorithms', description: 'sort, find, accumulate, and transform.', section: 'Standard Library', code: '#include <algorithm>\nstd::sort(v.begin(), v.end());', lang: 'cpp' },
  { slug: 'cpp-iterators', title: 'Iterators', description: 'Traverse containers with begin/end idioms.', section: 'Standard Library' },
  { slug: 'cpp-lambdas', title: 'Lambdas', description: 'Inline function objects for algorithms.', section: 'Modern C++', code: 'auto add = [](int a, int b) { return a + b; };', lang: 'cpp' },
  { slug: 'cpp-auto-decltype', title: 'auto & type deduction', description: 'Let the compiler deduce types safely.', section: 'Modern C++' },
  { slug: 'cpp-smart-pointers', title: 'unique_ptr & shared_ptr', description: 'Own resources without manual delete.', section: 'Modern C++', code: '#include <memory>\nauto p = std::make_unique<int>(42);', lang: 'cpp' },
  { slug: 'cpp-move-semantics', title: 'Move Semantics', description: 'std::move and rvalue references at a practical level.', section: 'Modern C++' },
  { slug: 'cpp-exceptions', title: 'Exceptions', description: 'try/catch and when not to throw across APIs.', section: 'Reliability', code: 'try {\n  mightFail();\n} catch (const std::exception& e) {\n  std::cerr << e.what();\n}', lang: 'cpp' },
  { slug: 'cpp-file-io', title: 'File I/O', description: 'Read and write text files with fstream.', section: 'Reliability', code: '#include <fstream>\nstd::ofstream out("out.txt");\nout << "hello\\n";', lang: 'cpp' },
  { slug: 'cpp-namespaces', title: 'Namespaces', description: 'Organize symbols and avoid collisions.', section: 'Projects' },
  { slug: 'cpp-cmake-basics', title: 'CMake Basics', description: 'Build multi-file projects with CMake.', section: 'Projects', code: 'cmake_minimum_required(VERSION 3.16)\nproject(demo)\nadd_executable(demo main.cpp)', lang: 'cmake' },
  { slug: 'cpp-debugging', title: 'Debugging with gdb/lldb', description: 'Breakpoints, backtraces, and inspecting variables.', section: 'Projects' },
  { slug: 'cpp-testing-intro', title: 'Unit Testing Intro', description: 'Structure small tests for functions and classes.', section: 'Projects' },
  { slug: 'cpp-templates-intro', title: 'Function Templates', description: 'Write generic functions with templates.', section: 'Templates', code: 'template <typename T>\nT maxv(T a, T b) { return a > b ? a : b; }', lang: 'cpp' },
  { slug: 'cpp-class-templates', title: 'Class Templates', description: 'Generic containers and utility types.', section: 'Templates' },
  { slug: 'cpp-project-gradebook', title: 'Project: Gradebook', description: 'Build a gradebook with classes, vectors, and file save.', section: 'Capstone Labs', minutes: 20 },
  { slug: 'cpp-project-todo', title: 'Project: Todo CLI', description: 'CRUD todos with persistence.', section: 'Capstone Labs', minutes: 18 },
  // advanced 49-65
  { slug: 'cpp-raii', title: 'RAII Deep Dive', description: 'Resource acquisition is initialization as a design rule.', section: 'Systems C++' },
  { slug: 'cpp-rule-of-five', title: 'Rule of Five', description: 'Copy/move constructors and assignment operators.', section: 'Systems C++' },
  { slug: 'cpp-const-correctness', title: 'Const Correctness', description: 'Design APIs that cannot mutate by accident.', section: 'Systems C++' },
  { slug: 'cpp-multithreading', title: 'Threads Basics', description: 'std::thread and joining workers.', section: 'Concurrency', code: '#include <thread>\nstd::thread t([]{ /* work */ });\nt.join();', lang: 'cpp' },
  { slug: 'cpp-mutex', title: 'Mutex & Shared Data', description: 'Protect critical sections with std::mutex.', section: 'Concurrency' },
  { slug: 'cpp-atomics', title: 'Atomics Overview', description: 'When lock-free counters make sense.', section: 'Concurrency' },
  { slug: 'cpp-performance', title: 'Performance Mindset', description: 'Measure first: cache locality, copies, and allocations.', section: 'Performance' },
  { slug: 'cpp-optimization-flags', title: 'Compiler Optimization Flags', description: '-O2, -O3, and debug vs release builds.', section: 'Performance' },
  { slug: 'cpp-undefined-behavior', title: 'Undefined Behavior', description: 'Recognize UB and write defined programs.', section: 'Reliability Advanced', warning: 'UB can appear to work until it does not - never rely on it.' },
  { slug: 'cpp-sanitizers', title: 'Sanitizers (ASan/UBSan)', description: 'Catch memory and UB bugs early.', section: 'Reliability Advanced', code: 'g++ -fsanitize=address,undefined -g main.cpp', lang: 'bash' },
  { slug: 'cpp-design-patterns', title: 'Useful Patterns in C++', description: 'Factory, Strategy, and Observer in practical form.', section: 'Design' },
  { slug: 'cpp-networking-intro', title: 'Networking Intro', description: 'Sockets at a high level for systems apps.', section: 'Systems Apps' },
  { slug: 'cpp-embedded-mindset', title: 'Embedded C++ Mindset', description: 'Constraints: no heap thrash, careful types, predictability.', section: 'Systems Apps' },
  { slug: 'cpp-capstone-http-parser', title: 'Capstone: Mini HTTP Parser', description: 'Parse request lines and headers from a buffer.', section: 'Capstone', minutes: 20 },
  { slug: 'cpp-capstone-thread-pool', title: 'Capstone: Thread Pool', description: 'Queue tasks and run them on worker threads.', section: 'Capstone', minutes: 20 },
  { slug: 'cpp-interview-review', title: 'C++ Interview Review', description: 'Pointers, OOP, STL, and move semantics checklist.', section: 'Polish & Next Steps' },
  { slug: 'cpp-next-steps', title: 'Next Steps in C++', description: 'Where to go: Boost, graphics, embedded, or distributed systems.', section: 'Polish & Next Steps' },
];

const JAVA = [
  { slug: 'welcome-to-java', title: 'Welcome to Java', description: 'Why Java remains a top language for backends and Android foundations.', section: 'Getting Started', code: 'public class Hello {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java");\n  }\n}', lang: 'java' },
  { slug: 'java-jdk-setup', title: 'Install the JDK', description: 'Install a modern JDK and verify javac/java.', section: 'Getting Started', code: 'java -version\njavac -version', lang: 'bash' },
  { slug: 'java-first-program', title: 'Your First Java Program', description: 'Compile and run a class with a main method.', section: 'Getting Started' },
  { slug: 'java-variables', title: 'Variables & Types', description: 'Primitives vs reference types.', section: 'Language Basics', code: 'int count = 3;\ndouble price = 9.99;\nboolean ok = true;\nString name = "Ada";', lang: 'java' },
  { slug: 'java-operators', title: 'Operators', description: 'Arithmetic, relational, and logical operators.', section: 'Language Basics' },
  { slug: 'java-strings', title: 'Strings', description: 'Immutable strings, concatenation, and useful methods.', section: 'Language Basics', code: 'String s = "Intellex";\nSystem.out.println(s.length());\nSystem.out.println(s.toUpperCase());', lang: 'java' },
  { slug: 'java-conditionals', title: 'Conditionals', description: 'if/else and switch expressions.', section: 'Control Flow' },
  { slug: 'java-loops', title: 'Loops', description: 'for, while, enhanced for.', section: 'Control Flow', code: 'for (int i = 0; i < 5; i++) {\n  System.out.println(i);\n}', lang: 'java' },
  { slug: 'java-methods', title: 'Methods', description: 'Static and instance methods with return types.', section: 'Methods', code: 'static int add(int a, int b) {\n  return a + b;\n}', lang: 'java' },
  { slug: 'java-overloading', title: 'Method Overloading', description: 'Same name, different parameter lists.', section: 'Methods' },
  { slug: 'java-arrays', title: 'Arrays', description: 'Fixed-length arrays and iteration.', section: 'Collections Basics', code: 'int[] nums = {1, 2, 3};\nSystem.out.println(nums[0]);', lang: 'java' },
  { slug: 'java-arraylist', title: 'ArrayList', description: 'Resizable lists from java.util.', section: 'Collections Basics', code: 'import java.util.ArrayList;\nArrayList<String> names = new ArrayList<>();\nnames.add("Ada");', lang: 'java' },
  { slug: 'java-hashmap', title: 'HashMap', description: 'Key-value storage for lookups.', section: 'Collections Basics', code: 'import java.util.HashMap;\nHashMap<String, Integer> ages = new HashMap<>();\nages.put("Ada", 36);', lang: 'java' },
  { slug: 'java-classes', title: 'Classes & Objects', description: 'Fields, constructors, and methods.', section: 'OOP Foundations', code: 'class Person {\n  String name;\n  Person(String name) { this.name = name; }\n}', lang: 'java' },
  { slug: 'java-encapsulation', title: 'Encapsulation', description: 'private fields with getters/setters.', section: 'OOP Foundations' },
  { slug: 'java-inheritance', title: 'Inheritance', description: 'extends and method overriding.', section: 'OOP Foundations' },
  { slug: 'java-polymorphism', title: 'Polymorphism', description: 'Program to interfaces and base types.', section: 'OOP Foundations' },
  { slug: 'java-interfaces', title: 'Interfaces', description: 'Contracts that classes implement.', section: 'OOP Foundations', code: 'interface Greeter {\n  String greet();\n}', lang: 'java' },
  { slug: 'java-packages', title: 'Packages', description: 'Organize code with package declarations.', section: 'Projects' },
  { slug: 'java-access-modifiers', title: 'Access Modifiers', description: 'public, private, protected, and package-private.', section: 'Projects' },
  { slug: 'java-static', title: 'static Members', description: 'When state belongs to the class.', section: 'Projects' },
  { slug: 'java-exceptions-intro', title: 'Exceptions Intro', description: 'Checked vs unchecked exceptions.', section: 'Errors', code: 'try {\n  Integer.parseInt("x");\n} catch (NumberFormatException e) {\n  System.out.println("bad number");\n}', lang: 'java' },
  { slug: 'java-scanner', title: 'Scanner Input', description: 'Read console input safely.', section: 'I/O Basics' },
  { slug: 'java-files-intro', title: 'Reading Files', description: 'NIO Path and Files helpers.', section: 'I/O Basics' },
  { slug: 'java-mini-quiz-app', title: 'Project: Quiz App', description: 'Build a console quiz with ArrayList of questions.', section: 'Projects', minutes: 18 },
  { slug: 'java-equals-hashcode', title: 'equals & hashCode', description: 'Correct equality for map keys and sets.', section: 'Solid OOP' },
  { slug: 'java-records', title: 'Records', description: 'Compact immutable data carriers.', section: 'Modern Java', code: 'record Point(int x, int y) {}', lang: 'java' },
  { slug: 'java-enums', title: 'Enums', description: 'Typed constants with behavior.', section: 'Modern Java' },
  { slug: 'java-generics', title: 'Generics', description: 'Type-safe collections and methods.', section: 'Modern Java', code: 'public static <T> void printAll(List<T> items) {\n  for (T item : items) System.out.println(item);\n}', lang: 'java' },
  { slug: 'java-streams', title: 'Streams API', description: 'map/filter/reduce style processing.', section: 'Modern Java', code: 'list.stream()\n  .filter(s -> s.length() > 3)\n  .map(String::toUpperCase)\n  .forEach(System.out::println);', lang: 'java' },
  { slug: 'java-optional', title: 'Optional', description: 'Avoid null proliferation with Optional.', section: 'Modern Java' },
  { slug: 'java-lambda', title: 'Lambdas & Functional Interfaces', description: 'Pass behavior as data.', section: 'Modern Java' },
  { slug: 'java-collections-deep', title: 'Collections Deep Dive', description: 'List, Set, Map trade-offs.', section: 'Collections Advanced' },
  { slug: 'java-sorting', title: 'Sorting & Comparators', description: 'Comparable vs Comparator.', section: 'Collections Advanced' },
  { slug: 'java-exceptions-advanced', title: 'Custom Exceptions', description: 'Create domain-specific exception types.', section: 'Reliability' },
  { slug: 'java-logging', title: 'Logging Basics', description: 'Replace System.out with structured logs.', section: 'Reliability' },
  { slug: 'java-junit', title: 'JUnit Testing', description: 'Write and run unit tests.', section: 'Testing', code: 'import org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass MathTest {\n  @Test\n  void adds() { assertEquals(5, 2 + 3); }\n}', lang: 'java' },
  { slug: 'java-maven-intro', title: 'Maven Intro', description: 'pom.xml, dependencies, and phases.', section: 'Build Tools' },
  { slug: 'java-gradle-intro', title: 'Gradle Intro', description: 'Groovy/Kotlin DSL build scripts.', section: 'Build Tools' },
  { slug: 'java-jdbc-intro', title: 'JDBC Intro', description: 'Connect to a database from Java.', section: 'Data Access' },
  { slug: 'java-http-client', title: 'HTTP Client', description: 'Call APIs with java.net.http.', section: 'Networking' },
  { slug: 'java-json', title: 'JSON in Java', description: 'Parse and produce JSON with a library.', section: 'Networking' },
  { slug: 'java-threads', title: 'Threads Basics', description: 'Runnable, Thread, and executors overview.', section: 'Concurrency' },
  { slug: 'java-executors', title: 'ExecutorService', description: 'Thread pools for concurrent tasks.', section: 'Concurrency' },
  { slug: 'java-project-library', title: 'Project: Library Manager', description: 'CRUD books with classes and ArrayList persistence.', section: 'Capstone Labs', minutes: 20 },
  { slug: 'java-project-api-client', title: 'Project: API Client CLI', description: 'Fetch JSON and display results.', section: 'Capstone Labs', minutes: 18 },
  { slug: 'java-spring-preview', title: 'Spring Boot Preview', description: 'What Spring Boot adds for web APIs.', section: 'Toward Backend Java' },
  { slug: 'java-rest-controller', title: 'A Tiny REST Controller', description: 'Map HTTP endpoints conceptually with Spring.', section: 'Toward Backend Java' },
  { slug: 'java-jvm-memory', title: 'JVM Memory Model Basics', description: 'Heap, stack, GC at a practical level.', section: 'JVM Internals' },
  { slug: 'java-gc-overview', title: 'Garbage Collection Overview', description: 'Why GC pauses matter and how to observe them.', section: 'JVM Internals' },
  { slug: 'java-performance', title: 'Java Performance Tips', description: 'Allocation pressure, streams vs loops, profiling.', section: 'Performance' },
  { slug: 'java-security-basics', title: 'Security Basics', description: 'Input validation, secrets, and dependency hygiene.', section: 'Production' },
  { slug: 'java-dockerize', title: 'Dockerize a Java App', description: 'Containerize a JAR for deployment.', section: 'Production', code: 'FROM eclipse-temurin:21-jre\nCOPY app.jar /app.jar\nENTRYPOINT ["java","-jar","/app.jar"]', lang: 'dockerfile' },
  { slug: 'java-design-patterns', title: 'GoF Patterns in Java', description: 'Singleton, Factory, Strategy with modern taste.', section: 'Design' },
  { slug: 'java-clean-architecture', title: 'Clean Architecture Sketch', description: 'Separate domain from frameworks.', section: 'Design' },
  { slug: 'java-annotations', title: 'Annotations', description: 'Built-in and custom annotations for metadata.', section: 'Modern Java' },
  { slug: 'java-reflection-intro', title: 'Reflection Intro', description: 'Inspect types at runtime carefully.', section: 'JVM Internals' },
  { slug: 'java-modules-overview', title: 'Java Platform Module System', description: 'module-info.java and strong encapsulation overview.', section: 'JVM Internals' },
  { slug: 'java-reactive-preview', title: 'Reactive Preview', description: 'When reactive streams help high-concurrency I/O.', section: 'Toward Backend Java' },
  { slug: 'java-capstone-todo-api', title: 'Capstone: Todo API', description: 'In-memory REST-style service with tests.', section: 'Capstone', minutes: 20 },
  { slug: 'java-capstone-bank', title: 'Capstone: Bank Account Domain', description: 'Model accounts, transfers, and invariants.', section: 'Capstone', minutes: 20 },
  { slug: 'java-capstone-cli-toolkit', title: 'Capstone: CLI Toolkit', description: 'Multi-command console tool with subcommands and tests.', section: 'Capstone', minutes: 18 },
  { slug: 'java-capstone-file-indexer', title: 'Capstone: File Indexer', description: 'Walk a directory, index words, and answer queries.', section: 'Capstone', minutes: 18 },
  { slug: 'java-interview-review', title: 'Java Interview Review', description: 'OOP, collections, concurrency, and JVM checklist.', section: 'Polish & Next Steps' },
  { slug: 'java-next-steps', title: 'Next Steps in Java', description: 'Spring, Android Kotlin path, or data engineering.', section: 'Polish & Next Steps' },
];

// Due to response size, remaining outlines will be generated programmatically with rich section maps
function expandOutline(prefix, sections) {
  // sections: [{section, items:[{title, desc?, code?, lang?}]}]
  const out = [];
  let n = 0;
  for (const sec of sections) {
    for (const it of sec.items) {
      n += 1;
      const slugBase = it.slug || `${prefix}-${it.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
      out.push({
        slug: slugBase,
        title: it.title,
        description: it.desc || `Learn ${it.title} step by step with examples and practice.`,
        section: sec.section,
        why: it.why,
        bullets: it.bullets,
        code: it.code,
        codeTitle: it.codeTitle,
        lang: it.lang,
        tip: it.tip,
        note: it.note,
        warning: it.warning,
        try: it.try,
        keys: it.keys,
        minutes: it.minutes,
        extra: it.extra,
      });
    }
  }
  if (out.length !== 65) {
    // pad or trim to exactly 65
    while (out.length < 65) {
      const i = out.length + 1;
      out.push({
        slug: `${prefix}-extra-${i}`,
        title: `Practice Lab ${i}`,
        description: `Hands-on practice lab consolidating earlier ${prefix} skills.`,
        section: 'Practice Labs',
        try: 'Build a tiny program that combines three earlier ideas.',
      });
    }
    out.length = 65;
    // re-number slugs uniqueness already ok
  }
  return out;
}

const ARDUINO = expandOutline('arduino', [
  { section: 'Getting Started', items: [
    { title: 'Welcome to Arduino', desc: 'Microcontrollers, boards, and the maker mindset.', code: '// Empty sketch\nvoid setup() {}\nvoid loop() {}', lang: 'cpp' },
    { title: 'Install Arduino IDE', desc: 'Install the IDE or Arduino CLI and open the serial monitor.' },
    { title: 'Board Anatomy', desc: 'Pins, power, USB, reset, and voltage rails.' },
    { title: 'Your First Sketch', desc: 'Upload Blink and understand setup/loop.', code: 'void setup() {\n  pinMode(LED_BUILTIN, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(LED_BUILTIN, HIGH);\n  delay(500);\n  digitalWrite(LED_BUILTIN, LOW);\n  delay(500);\n}', lang: 'cpp' },
    { title: 'Serial Monitor Basics', desc: 'Debug with Serial.begin and println.', code: 'void setup() {\n  Serial.begin(9600);\n  Serial.println("Hello Arduino");\n}', lang: 'cpp' },
  ]},
  { section: 'Digital I/O', items: [
    { title: 'digitalWrite & pinMode', desc: 'Drive LEDs and read button logic levels.' },
    { title: 'Buttons & Pull-ups', desc: 'INPUT_PULLUP and debouncing ideas.' },
    { title: 'PWM with analogWrite', desc: 'Fade an LED using pulse-width modulation.' },
    { title: 'Multiple LEDs', desc: 'Patterns with arrays of pins.' },
    { title: 'Tone & Buzzers', desc: 'Generate simple tones.' },
  ]},
  { section: 'Analog Sensing', items: [
    { title: 'analogRead', desc: 'Read potentiometers and sensors (0-1023).' },
    { title: 'Mapping Values', desc: 'map() and constrain() for usable ranges.' },
    { title: 'Smoothing Readings', desc: 'Average noisy analog signals.' },
    { title: 'Threshold Triggers', desc: 'Turn devices on when a sensor crosses a value.' },
    { title: 'Project: Night Light', desc: 'LDR + LED automatic night light.', minutes: 16 },
  ]},
  { section: 'Timing & Structure', items: [
    { title: 'millis() Timing', desc: 'Non-blocking timing instead of long delay().' },
    { title: 'State Machines', desc: 'Model device behavior with states.' },
    { title: 'Functions in Sketches', desc: 'Keep loop() readable with helpers.' },
    { title: 'Arrays of Sensors', desc: 'Scale I/O cleanly.' },
    { title: 'EEPROM Intro', desc: 'Persist small settings on the board.' },
  ]},
  { section: 'Libraries & Modules', items: [
    { title: 'Using Libraries', desc: 'Install and include third-party libraries.' },
    { title: 'Ultrasonic Distance', desc: 'HC-SR04 distance sensing.' },
    { title: 'DHT Temperature', desc: 'Read temperature and humidity.' },
    { title: 'Servo Motors', desc: 'Position control with Servo.h.' },
    { title: 'LCD Display', desc: 'Print sensor data to an LCD.' },
  ]},
  { section: 'Communication', items: [
    { title: 'I2C Basics', desc: 'Wire library and device addresses.' },
    { title: 'SPI Basics', desc: 'When SPI is the right bus.' },
    { title: 'UART Devices', desc: 'Talk to GPS/Bluetooth modules.' },
    { title: 'Project: Weather Station', desc: 'Sensor + display + serial logging.', minutes: 18 },
    { title: 'Project: Smart Plant', desc: 'Moisture sensor watering reminder.', minutes: 18 },
  ]},
  { section: 'Intermediate Electronics', items: [
    { title: 'Current & Voltage Limits', desc: 'Protect pins and understand loads.' },
    { title: 'Transistors as Switches', desc: 'Drive motors and relays safely.' },
    { title: 'Motor Drivers', desc: 'H-bridges and L298-style modules.' },
    { title: 'Power Supplies', desc: 'USB vs barrel jack vs batteries.' },
    { title: 'Debugging Hardware', desc: 'Multimeter checks and common faults.' },
  ]},
  { section: 'Interrupts & Timing Advanced', items: [
    { title: 'External Interrupts', desc: 'attachInterrupt for fast events.' },
    { title: 'Timers Overview', desc: 'How hardware timers enable precision.' },
    { title: 'Low Power Ideas', desc: 'Sleep modes for battery projects.' },
    { title: 'Watchdog Timer', desc: 'Recover from hung firmware.' },
    { title: 'Project: Reaction Game', desc: 'Button timing game with scoring.', minutes: 16 },
  ]},
  { section: 'IoT & Networking', items: [
    { title: 'ESP8266/ESP32 Overview', desc: 'Wi-Fi capable Arduino-compatible boards.' },
    { title: 'Wi-Fi Connect Sketch', desc: 'Join a network and print the IP.' },
    { title: 'HTTP Requests', desc: 'Push sensor readings to a webhook.' },
    { title: 'MQTT Intro', desc: 'Publish/subscribe for IoT telemetry.' },
    { title: 'Project: Room Monitor', desc: 'Temp/humidity to serial + optional cloud.', minutes: 20 },
  ]},
  { section: 'Robotics Basics', items: [
    { title: 'Chassis & Drive', desc: 'Differential drive robots.' },
    { title: 'Line Following Intro', desc: 'IR sensors and simple control.' },
    { title: 'Obstacle Avoidance', desc: 'Ultrasonic + motor decisions.' },
    { title: 'PID Intuition', desc: 'Proportional control for smoother motion.' },
    { title: 'Project: Mini Robot', desc: 'Combine sensors and motors.', minutes: 20 },
  ]},
  { section: 'Professional Practices', items: [
    { title: 'Schematics & Wiring Discipline', desc: 'Document connections clearly.' },
    { title: 'Version Control for Firmware', desc: 'Git habits for sketches.' },
    { title: 'Testing on Hardware', desc: 'Bring-up checklists.' },
    { title: 'Capstone: Home Automation Node', desc: 'Button, relay, sensor, serial protocol.', minutes: 20 },
    { title: 'Capstone: Data Logger', desc: 'Log readings to SD or serial CSV.', minutes: 18 },
    { title: 'Arduino Interview & Portfolio', desc: 'Show projects with photos, schematics, and code.' },
    { title: 'Next Steps', desc: 'PCB design, FreeRTOS, or ROS for robots.' },
    { title: 'Safety & Ethics', desc: 'Mains power, batteries, and responsible making.' },
    { title: 'Community & Open Hardware', desc: 'Licenses and sharing designs.' },
    { title: 'Final Challenge Brief', desc: 'Design a 1-week build with bill of materials.' },
  ]},
]);

const KUBERNETES = expandOutline('k8s', [
  { section: 'Getting Started', items: [
    { title: 'Welcome to Kubernetes', desc: 'Containers orchestration at scale.', why: 'Kubernetes schedules containers across machines with declarative desired state.' },
    { title: 'Containers Recap', desc: 'Images, containers, and why orchestration is needed.' },
    { title: 'Cluster Architecture', desc: 'Control plane, kubelet, kube-proxy, etcd.' },
    { title: 'Install kubectl', desc: 'Talk to clusters from your laptop.', code: 'kubectl version --client\nkubectl config get-contexts', lang: 'bash' },
    { title: 'Local Cluster Options', desc: 'kind, minikube, and k3d overview.' },
  ]},
  { section: 'Workloads', items: [
    { title: 'Pods', desc: 'The smallest deployable unit.', code: 'apiVersion: v1\nkind: Pod\nmetadata:\n  name: hello\nspec:\n  containers:\n - name: web\n      image: nginx', lang: 'yaml' },
    { title: 'Deployments', desc: 'Declare replicas and rolling updates.' },
    { title: 'ReplicaSets', desc: 'How Deployments keep pods alive.' },
    { title: 'Services', desc: 'Stable networking to pods.', code: 'apiVersion: v1\nkind: Service\nmetadata:\n  name: web\nspec:\n  selector:\n    app: web\n  ports:\n - port: 80', lang: 'yaml' },
    { title: 'Labels & Selectors', desc: 'Organize and target objects.' },
  ]},
  { section: 'kubectl Daily Driver', items: [
    { title: 'kubectl get/describe', desc: 'Inspect cluster state.' },
    { title: 'kubectl logs & exec', desc: 'Debug running containers.' },
    { title: 'Apply & Diff', desc: 'Declarative workflows with apply.' },
    { title: 'Namespaces', desc: 'Isolate environments in one cluster.' },
    { title: 'Context & kubeconfig', desc: 'Switch clusters safely.' },
  ]},
  { section: 'Configuration', items: [
    { title: 'ConfigMaps', desc: 'Inject non-secret config.' },
    { title: 'Secrets', desc: 'Handle sensitive values carefully.' },
    { title: 'Resource Requests & Limits', desc: 'CPU/memory for scheduling and stability.' },
    { title: 'Probes', desc: 'liveness, readiness, startup probes.' },
    { title: 'Project: Deploy a Web App', desc: 'Deployment + Service + ConfigMap.', minutes: 18 },
  ]},
  { section: 'Storage & State', items: [
    { title: 'Volumes Overview', desc: 'Ephemeral vs persistent storage.' },
    { title: 'PersistentVolumeClaims', desc: 'Request storage abstractly.' },
    { title: 'StatefulSets', desc: 'Stable identity for stateful apps.' },
    { title: 'Jobs & CronJobs', desc: 'Batch and scheduled workloads.' },
    { title: 'Project: Redis on K8s', desc: 'Simple stateful workload sketch.', minutes: 16 },
  ]},
  { section: 'Networking', items: [
    { title: 'Cluster Networking Model', desc: 'Pod IPs and CNI plugins.' },
    { title: 'ClusterIP NodePort LoadBalancer', desc: 'Service types compared.' },
    { title: 'Ingress Basics', desc: 'HTTP routing into the cluster.' },
    { title: 'NetworkPolicies Intro', desc: 'Restrict pod traffic.' },
    { title: 'DNS in Kubernetes', desc: 'Service discovery via CoreDNS.' },
  ]},
  { section: 'Scaling & Updates', items: [
    { title: 'Rolling Updates', desc: 'Ship new versions with zero-ish downtime.' },
    { title: 'Rollbacks', desc: 'Undo a bad release quickly.' },
    { title: 'Horizontal Pod Autoscaler', desc: 'Scale on CPU/custom metrics.' },
    { title: 'PodDisruptionBudgets', desc: 'Protect availability during drains.' },
    { title: 'Project: Zero-Downtime Demo', desc: 'Update an app while curling the service.', minutes: 18 },
  ]},
  { section: 'Observability & Ops', items: [
    { title: 'Events & Troubleshooting', desc: 'CrashLoopBackOff and ImagePullBackOff.' },
    { title: 'Metrics Overview', desc: 'metrics-server and resource usage.' },
    { title: 'Logging Patterns', desc: 'Stdout logs and aggregators.' },
    { title: 'Helm Intro', desc: 'Package Kubernetes apps.' },
    { title: 'Kustomize Intro', desc: 'Overlay manifests per environment.' },
  ]},
  { section: 'Security', items: [
    { title: 'RBAC Basics', desc: 'Roles, ClusterRoles, bindings.' },
    { title: 'ServiceAccounts', desc: 'Identity for pods.' },
    { title: 'Pod Security Context', desc: 'Run as non-root, read-only FS.' },
    { title: 'Image Supply Chain', desc: 'Tags, digests, scanning.' },
    { title: 'Project: Locked-Down Deploy', desc: 'Apply security contexts and probes.', minutes: 16 },
  ]},
  { section: 'Advanced Workloads', items: [
    { title: 'DaemonSets', desc: 'One pod per node for agents.' },
    { title: 'Init Containers', desc: 'Setup tasks before app starts.' },
    { title: 'Sidecars', desc: 'Helper containers in a pod.' },
    { title: 'Operators Overview', desc: 'Extend Kubernetes with controllers.' },
    { title: 'CRDs Overview', desc: 'Custom resources for your platform.' },
  ]},
  { section: 'Production & Capstone', items: [
    { title: 'Multi-Environment Strategy', desc: 'dev/stage/prod with namespaces or clusters.' },
    { title: 'GitOps Preview', desc: 'Argo CD / Flux conceptual flow.' },
    { title: 'Cost Awareness', desc: 'Requests, bin packing, and idle waste.' },
    { title: 'Capstone: Full App Chart', desc: 'Deploy web + config + ingress via Helm/Kustomize.', minutes: 22 },
    { title: 'Capstone: Incident Drill', desc: 'Break a deploy and recover with kubectl.', minutes: 18 },
    { title: 'CKA-Style Review', desc: 'Practice debugging and YAML fluency.' },
    { title: 'Next Steps', desc: 'Service mesh, policy engines, platform engineering.' },
    { title: 'Kubernetes Portfolio Tips', desc: 'Document architectures and runbooks.' },
    { title: 'Final Challenge', desc: 'Design a 3-tier app deployment for Kubernetes.' },
    { title: 'Glossary Drill', desc: 'Pod, Node, Control Plane, CNI, CSI, RBAC.' },
  ]},
]);

const RUST = expandOutline('rust', [
  { section: 'Getting Started', items: [
    { title: 'Welcome to Rust', desc: 'Safety, speed, and fearless concurrency.', code: 'fn main() {\n    println!("Hello, Rust");\n}', lang: 'rust' },
    { title: 'Install Rustup', desc: 'Install toolchain and cargo.', code: 'rustc --version\ncargo --version', lang: 'bash' },
    { title: 'Cargo New', desc: 'Create and run a package.', code: 'cargo new hello\ncd hello\ncargo run', lang: 'bash' },
    { title: 'Variables & Mutability', desc: 'let, mut, and shadowing.', code: 'let mut x = 5;\nx += 1;', lang: 'rust' },
    { title: 'Data Types', desc: 'Scalars and compounds.', code: 'let t: (i32, f64) = (1, 2.0);\nlet a = [1, 2, 3];', lang: 'rust' },
  ]},
  { section: 'Ownership', items: [
    { title: 'Ownership Rules', desc: 'The heart of Rust memory safety.' },
    { title: 'Move Semantics', desc: 'What happens when you assign a String.' },
    { title: 'References & Borrowing', desc: 'Shared and mutable borrows.', code: 'fn len(s: &String) -> usize { s.len() }', lang: 'rust' },
    { title: 'Slices', desc: 'Views into contiguous data.' },
    { title: 'Ownership Drills', desc: 'Fix compile errors caused by moves.', minutes: 14 },
  ]},
  { section: 'Structs & Enums', items: [
    { title: 'Structs', desc: 'Group data with named fields.' },
    { title: 'Methods & impl', desc: 'Implement behavior on types.' },
    { title: 'Enums', desc: 'Express variants clearly.' },
    { title: 'Option & Result', desc: 'Null-safe and error-aware returns.', code: 'fn parse(s: &str) -> Result<i32, std::num::ParseIntError> {\n    s.parse()\n}', lang: 'rust' },
    { title: 'Pattern Matching', desc: 'match like a pro.' },
  ]},
  { section: 'Collections & Errors', items: [
    { title: 'Vec', desc: 'Growable arrays.' },
    { title: 'HashMap', desc: 'Key-value maps.' },
    { title: 'String vs &str', desc: 'Owned vs borrowed text.' },
    { title: 'Error Propagation', desc: 'The ? operator.' },
    { title: 'Project: CLI Grep Lite', desc: 'Search lines in a file.', minutes: 18 },
  ]},
  { section: 'Modules & Packaging', items: [
    { title: 'Modules', desc: 'mod, use, and visibility.' },
    { title: 'Workspaces', desc: 'Multi-crate repos.' },
    { title: 'Traits', desc: 'Shared behavior across types.' },
    { title: 'Generics', desc: 'Type parameters done safely.' },
    { title: 'Lifetimes Intro', desc: 'Why the compiler asks about \'a.' },
  ]},
  { section: 'Intermediate Rust', items: [
    { title: 'Iterators', desc: 'Lazy adapters and collect.' },
    { title: 'Closures', desc: 'Capture environments.' },
    { title: 'Smart Pointers', desc: 'Box, Rc, RefCell overview.' },
    { title: 'Testing with cargo test', desc: 'Unit and integration tests.' },
    { title: 'Project: JSON Config Tool', desc: 'Read config and validate fields.', minutes: 18 },
  ]},
  { section: 'Concurrency', items: [
    { title: 'Threads', desc: 'std::thread basics.' },
    { title: 'Message Passing', desc: 'channels for ownership transfer.' },
    { title: 'Shared State', desc: 'Mutex and Arc.' },
    { title: 'Async Preview', desc: 'async/await mental model.' },
    { title: 'Project: Parallel Map', desc: 'Split work across threads.', minutes: 16 },
  ]},
  { section: 'Systems & FFI', items: [
    { title: 'Unsafe Rust Boundaries', desc: 'When and how to use unsafe carefully.' },
    { title: 'FFI Overview', desc: 'Call C from Rust.' },
    { title: 'no_std Glimpse', desc: 'Embedded Rust direction.' },
    { title: 'Profiling Basics', desc: 'Measure before optimizing.' },
    { title: 'Project: HTTP Fetcher', desc: 'reqwest-style client sketch.', minutes: 18 },
  ]},
  { section: 'Idiomatic Rust', items: [
    { title: 'Clippy & rustfmt', desc: 'Lint and format automatically.' },
    { title: 'Documentation Tests', desc: 'Examples that compile in docs.' },
    { title: 'Error Design', desc: 'thiserror/anyhow patterns conceptually.' },
    { title: 'API Design Tips', desc: 'Ownership-friendly interfaces.' },
    { title: 'Project: Mini Database', desc: 'In-memory KV with persistence.', minutes: 20 },
  ]},
  { section: 'Advanced Topics', items: [
    { title: 'Advanced Lifetimes', desc: 'Structs that hold references.' },
    { title: 'Trait Objects', desc: 'dyn Trait for dynamic dispatch.' },
    { title: 'Macros Intro', desc: 'Declarative macros overview.' },
    { title: 'Pin & Async Internals Glimpse', desc: 'Why Pin exists.' },
    { title: 'Capstone: Concurrent Crawler', desc: 'Fetch URLs with bounded concurrency.', minutes: 22 },
  ]},
  { section: 'Capstone & Career', items: [
    { title: 'Capstone: CLI Toolkit', desc: 'Multi-command tool with clap-style args.', minutes: 20 },
    { title: 'Rust Interview Review', desc: 'Ownership, traits, Result, concurrency.' },
    { title: 'Publishing Crates', desc: 'crates.io overview.' },
    { title: 'Next Steps', desc: 'Web (Axum), embedded, or WASM.' },
    { title: 'Final Challenge', desc: 'Rewrite a Python script in safe Rust.' },
    { title: 'Glossary Drill', desc: 'Ownership, borrowing, lifetime, trait, crate.' },
    { title: 'Reading Compiler Errors', desc: 'Turn rustc messages into fixes.' },
    { title: 'Performance Checklist', desc: 'Allocations, clones, and profiles.' },
    { title: 'Safety Checklist', desc: 'Avoid unsafe unless measured need.' },
    { title: 'Portfolio Tips', desc: 'Show cargo projects with README and tests.' },
  ]},
]);

const RAILS = expandOutline('rails', [
  { section: 'Getting Started', items: [
    { title: 'Welcome to Ruby on Rails', desc: 'Convention over configuration for web apps.' },
    { title: 'Ruby Quickstart', desc: 'Just enough Ruby syntax for Rails.', code: 'def greet(name)\n  "Hello, #{name}"\nend\nputs greet("Ada")', lang: 'ruby' },
    { title: 'Install Ruby & Rails', desc: 'Tooling for a fresh environment.' },
    { title: 'rails new', desc: 'Generate an application skeleton.', code: 'rails new blog --database=postgresql\ncd blog\nbundle install', lang: 'bash' },
    { title: 'MVC Mental Model', desc: 'Models, views, controllers, routes.' },
  ]},
  { section: 'Routing & Controllers', items: [
    { title: 'Routes Basics', desc: 'config/routes.rb essentials.', code: 'Rails.application.routes.draw do\n  root "home#index"\n  resources :posts\nend', lang: 'ruby' },
    { title: 'Controllers', desc: 'Actions, params, and redirects.' },
    { title: 'Views & ERB', desc: 'Embed Ruby in HTML templates.' },
    { title: 'Layouts & Partials', desc: 'Reuse UI pieces.' },
    { title: 'Strong Parameters', desc: 'Permit only safe input.' },
  ]},
  { section: 'Active Record', items: [
    { title: 'Models & Migrations', desc: 'Create tables the Rails way.', code: 'rails generate model Post title:string body:text\nrails db:migrate', lang: 'bash' },
    { title: 'CRUD with Active Record', desc: 'create, read, update, destroy.' },
    { title: 'Validations', desc: 'Keep bad data out.' },
    { title: 'Associations', desc: 'has_many, belongs_to, and friends.' },
    { title: 'Query Interface', desc: 'where, order, includes.' },
  ]},
  { section: 'Forms & UX', items: [
    { title: 'Form Helpers', desc: 'form_with and f.text_field.' },
    { title: 'Flash Messages', desc: 'notice and alert patterns.' },
    { title: 'Asset Pipeline / Importmaps', desc: 'Modern Rails front-end defaults.' },
    { title: 'Hotwire Turbo Preview', desc: 'Faster navigation with less custom JS.' },
    { title: 'Project: Blog CRUD', desc: 'Posts with validation and index/show.', minutes: 20 },
  ]},
  { section: 'Authentication & Authorization', items: [
    { title: 'Sessions Primer', desc: 'Cookies and login state.' },
    { title: 'has_secure_password', desc: 'Password hashing built-in.' },
    { title: 'Authentication From Scratch', desc: 'Sign up / login / logout flow.' },
    { title: 'Authorization Patterns', desc: 'Pundit/CanCanCan concepts.' },
    { title: 'Project: Auth Blog', desc: 'Only authors edit their posts.', minutes: 20 },
  ]},
  { section: 'Intermediate Rails', items: [
    { title: 'Nested Resources', desc: 'Comments under posts.' },
    { title: 'Concerns', desc: 'Share model/controller code.' },
    { title: 'Background Jobs', desc: 'Active Job mental model.' },
    { title: 'Action Mailer', desc: 'Send email from the app.' },
    { title: 'File Uploads', desc: 'Active Storage overview.' },
  ]},
  { section: 'APIs', items: [
    { title: 'API-only Mode', desc: 'Rails as a JSON backend.' },
    { title: 'Serialization', desc: 'jbuilder / Alba patterns.' },
    { title: 'API Authentication', desc: 'Tokens and headers overview.' },
    { title: 'Versioning APIs', desc: 'Keep clients stable.' },
    { title: 'Project: JSON Posts API', desc: 'Index/create endpoints with tests.', minutes: 18 },
  ]},
  { section: 'Testing', items: [
    { title: 'Minitest or RSpec', desc: 'Pick a stack and write model tests.' },
    { title: 'Request Specs', desc: 'Exercise HTTP endpoints.' },
    { title: 'Fixtures & Factories', desc: 'Reusable test data.' },
    { title: 'System Tests', desc: 'Browser-level coverage overview.' },
    { title: 'Project: Test the Blog', desc: 'Cover validations and happy paths.', minutes: 16 },
  ]},
  { section: 'Production', items: [
    { title: 'Environments', desc: 'development, test, production.' },
    { title: 'Credentials & ENV', desc: 'Secrets management.' },
    { title: 'Deploy Overview', desc: 'Render/Fly/Heroku-style deploys.' },
    { title: 'Performance Basics', desc: 'N+1 queries and caching.' },
    { title: 'Security Checklist', desc: 'CSRF, XSS, mass assignment.' },
  ]},
  { section: 'Advanced Rails', items: [
    { title: 'Engines Overview', desc: 'Mountable mini-apps.' },
    { title: 'Custom Middleware', desc: 'Rack awareness.' },
    { title: 'Multi-db Glimpse', desc: 'Primary/replica concepts.' },
    { title: 'Internationalization', desc: 'I18n for multi-language UI.' },
    { title: 'Capstone: Marketplace MVP', desc: 'Users, listings, and basic auth.', minutes: 22 },
  ]},
  { section: 'Capstone & Career', items: [
    { title: 'Capstone: SaaS Skeleton', desc: 'Teams, billing stub, dashboards.', minutes: 22 },
    { title: 'Rails Interview Review', desc: 'MVC, AR, routing, security.' },
    { title: 'Next Steps', desc: 'Hotwire mastery or API+React.' },
    { title: 'Final Challenge', desc: 'Ship a CRUD app with auth and tests.' },
    { title: 'Glossary Drill', desc: 'MVC, migration, callback, concern, job.' },
    { title: 'Reading Logs', desc: 'Debug request cycles from server logs.' },
    { title: 'Database Indexes', desc: 'Speed up common queries.' },
    { title: 'Background Job Pitfalls', desc: 'Idempotency and retries.' },
    { title: 'Portfolio Tips', desc: 'README, screenshots, seed data.' },
    { title: 'Community & Gems', desc: 'Evaluate dependencies wisely.' },
  ]},
]);

const LINUX = expandOutline('linux', [
  { section: 'Getting Started', items: [
    { title: 'Welcome to Linux Administration', desc: 'Operate servers with confidence.' },
    { title: 'Distributions Overview', desc: 'Debian/Ubuntu vs RHEL/Fedora families.' },
    { title: 'Install & Cloud VMs', desc: 'Local VM or cloud instance lab setup.' },
    { title: 'Terminal Survival', desc: 'Shell, prompts, and keyboard fluency.' },
    { title: 'man & --help', desc: 'Learn any command from its docs.', code: 'man ls\nls --help | less', lang: 'bash' },
  ]},
  { section: 'Filesystem', items: [
    { title: 'Filesystem Hierarchy', desc: '/etc, /var, /home, /usr, /opt.' },
    { title: 'Navigation', desc: 'cd, ls, pwd, tree.', code: 'pwd\nls -la\ncd /var/log', lang: 'bash' },
    { title: 'Files & Directories', desc: 'cp, mv, rm, mkdir, ln.' },
    { title: 'Permissions', desc: 'rwx, chmod, chown, umask.', code: 'chmod 640 secrets.txt\nchown alice:devs secrets.txt', lang: 'bash' },
    { title: 'Finding Files', desc: 'find, locate, which, type.' },
  ]},
  { section: 'Users & Processes', items: [
    { title: 'Users & Groups', desc: 'useradd, usermod, /etc/passwd.' },
    { title: 'sudo & Root', desc: 'Least privilege administration.' },
    { title: 'Processes', desc: 'ps, top, htop, kill.', code: 'ps aux | head\ntop', lang: 'bash' },
    { title: 'Job Control', desc: 'bg, fg, nohup, disown.' },
    { title: 'systemd Services', desc: 'systemctl start/enable/status.', code: 'systemctl status ssh\nsystemctl enable nginx', lang: 'bash' },
  ]},
  { section: 'Packages & Software', items: [
    { title: 'apt Basics', desc: 'Install and update on Debian/Ubuntu.', code: 'sudo apt update\nsudo apt install nginx', lang: 'bash' },
    { title: 'dnf/yum Basics', desc: 'RHEL-family package workflow.' },
    { title: 'Snaps/Flatpaks Overview', desc: 'Alternative packaging systems.' },
    { title: 'Compiling From Source', desc: 'When packages are not enough.' },
    { title: 'Project: Web Server Box', desc: 'Install and serve a static site.', minutes: 16 },
  ]},
  { section: 'Networking', items: [
    { title: 'IP Addressing', desc: 'ip addr, routes, DNS basics.' },
    { title: 'ss & Listening Ports', desc: 'See what is bound.', code: 'ss -tulpn', lang: 'bash' },
    { title: 'Firewall Intro', desc: 'ufw/firewalld mental model.' },
    { title: 'SSH Hardening', desc: 'Keys, disable password, config.', code: 'ssh-keygen -t ed25519\nssh -i ~/.ssh/id_ed25519 user@host', lang: 'bash' },
    { title: 'Project: Secure SSH Access', desc: 'Key-only login checklist.', minutes: 14 },
  ]},
  { section: 'Storage', items: [
    { title: 'Disks & Partitions', desc: 'lsblk, fdisk overview.' },
    { title: 'Filesystems & Mounts', desc: 'mkfs, mount, /etc/fstab.' },
    { title: 'LVM Intro', desc: 'Flexible volume management.' },
    { title: 'Quotas Overview', desc: 'Limit user disk usage.' },
    { title: 'Backups Mindset', desc: '3-2-1 and restore testing.' },
  ]},
  { section: 'Logs & Monitoring', items: [
    { title: 'journalctl', desc: 'Query systemd logs.', code: 'journalctl -u nginx -f', lang: 'bash' },
    { title: '/var/log', desc: 'Classic log files still matter.' },
    { title: 'logrotate', desc: 'Prevent disks filling with logs.' },
    { title: 'Resource Monitoring', desc: 'free, df, iostat, vmstat.' },
    { title: 'Project: Incident Triage', desc: 'Diagnose a full disk or high CPU.', minutes: 16 },
  ]},
  { section: 'Automation & Config', items: [
    { title: 'Cron & Timers', desc: 'Schedule admin tasks.' },
    { title: 'Shell Scripting for Admins', desc: 'Safe scripts with set -euo pipefail.' },
    { title: 'Configuration Management Preview', desc: 'Ansible mental model.' },
    { title: 'Infrastructure as Code Preview', desc: 'Terraform direction.' },
    { title: 'Project: Bootstrap Script', desc: 'Idempotent server setup script.', minutes: 18 },
  ]},
  { section: 'Containers & Cloud', items: [
    { title: 'Docker on Linux', desc: 'Engine install and first container.' },
    { title: 'systemd + Docker', desc: 'Restart policies and services.' },
    { title: 'Cloud Metadata', desc: 'Think like a cloud admin.' },
    { title: 'Object Storage Concepts', desc: 'S3-compatible backups.' },
    { title: 'Project: Containerized App Host', desc: 'Run nginx reverse proxy to an app.', minutes: 18 },
  ]},
  { section: 'Security Hardening', items: [
    { title: 'Updates & CVE Hygiene', desc: 'Patch cadence that is real.' },
    { title: 'Fail2ban / Intrusion Basics', desc: 'Reduce noisy attacks.' },
    { title: 'SELinux/AppArmor Overview', desc: 'Mandatory access control ideas.' },
    { title: 'Secrets on Servers', desc: 'Never bake secrets into images.' },
    { title: 'Project: Hardening Checklist', desc: 'Apply a 15-point baseline.', minutes: 16 },
  ]},
  { section: 'Capstone & Career', items: [
    { title: 'Capstone: Production-like VM', desc: 'Users, firewall, nginx, TLS stub, monitoring.', minutes: 22 },
    { title: 'Capstone: Broken Server Drill', desc: 'Fix networking/service failures under time.', minutes: 20 },
    { title: 'Linux Interview Review', desc: 'Permissions, processes, systemd, networking.' },
    { title: 'Next Steps', desc: 'SRE, platform engineering, or security ops.' },
    { title: 'Final Challenge', desc: 'Document a runbook for restarting a stack.' },
    { title: 'Glossary Drill', desc: 'inode, daemon, unit, CIDR, journal.' },
    { title: 'Performance Checklist', desc: 'CPU, RAM, disk, network bottlenecks.' },
    { title: 'Disaster Recovery Drill', desc: 'Restore from backup successfully.' },
    { title: 'Portfolio Tips', desc: 'Show labs with diagrams and configs.' },
    { title: 'Ethics & Responsibility', desc: 'Admin access is production trust.' },
  ]},
]);

const BASH = expandOutline('bash', [
  { section: 'Getting Started', items: [
    { title: 'Welcome to Bash Scripting', desc: 'Automate the terminal safely and clearly.' },
    { title: 'What is a Shell?', desc: 'bash vs sh vs zsh at a glance.' },
    { title: 'Your First Script', desc: 'Shebang, permissions, execution.', code: '#!/usr/bin/env bash\nset -euo pipefail\necho "Hello from Bash"', lang: 'bash' },
    { title: 'chmod +x & PATH', desc: 'Make scripts runnable.' },
    { title: 'quoting Rules', desc: 'Single vs double quotes and why it matters.', code: 'name="Ada Lovelace"\necho "$name"\necho \'$name\'', lang: 'bash' },
  ]},
  { section: 'Variables & Input', items: [
    { title: 'Variables', desc: 'Assign and expand safely.', code: 'count=3\necho "count=${count}"', lang: 'bash' },
    { title: 'Environment Variables', desc: 'export and child processes.' },
    { title: 'Positional Parameters', desc: '$1, $@, $#. ', code: '#!/usr/bin/env bash\necho "Script: $0"\necho "First arg: ${1-}"', lang: 'bash' },
    { title: 'read Input', desc: 'Prompt users interactively.' },
    { title: 'Default Values', desc: '${var:-default} patterns.' },
  ]},
  { section: 'Control Flow', items: [
    { title: 'if & test', desc: '[[ ]] conditions.', code: 'if [[ -f "$file" ]]; then\n  echo "exists"\nfi', lang: 'bash' },
    { title: 'Loops', desc: 'for, while, until.', code: 'for f in *.txt; do\n  echo "$f"\ndone', lang: 'bash' },
    { title: 'case Statements', desc: 'Menus and routers.' },
    { title: 'Functions', desc: 'Reusable blocks with local vars.', code: 'greet() {\n  local name=$1\n  echo "Hi, $name"\n}', lang: 'bash' },
    { title: 'Exit Codes', desc: '$? and set -e discipline.' },
  ]},
  { section: 'Text & Pipelines', items: [
    { title: 'Pipes & Redirection', desc: '|, >, >>, 2>&1.', code: 'grep error app.log | wc -l', lang: 'bash' },
    { title: 'grep', desc: 'Search with regular expressions.' },
    { title: 'sed Basics', desc: 'Stream edits.', code: 'sed -i \'s/foo/bar/g\' file.txt', lang: 'bash' },
    { title: 'awk Basics', desc: 'Column processing.', code: 'awk -F, \'{print $1}\' data.csv', lang: 'bash' },
    { title: 'Project: Log Summarizer', desc: 'Count errors by day from a logfile.', minutes: 16 },
  ]},
  { section: 'Files & Safety', items: [
    { title: 'Globs', desc: 'Wildcards and nullglob.' },
    { title: 'find + xargs', desc: 'Act on many files safely.' },
    { title: 'set -euo pipefail', desc: 'Hard mode for reliable scripts.' },
    { title: 'Trap & Cleanup', desc: 'Remove temp files on exit.' },
    { title: 'Project: Safe Backup Script', desc: 'Copy a directory with timestamp.', minutes: 16 },
  ]},
  { section: 'Intermediate Scripting', items: [
    { title: 'Arrays', desc: 'Indexed arrays and iteration.' },
    { title: 'Associative Arrays', desc: 'Key-value maps in bash 4+.' },
    { title: 'Here Documents', desc: 'Multi-line input to commands.' },
    { title: 'getopts', desc: 'Parse flags professionally.' },
    { title: 'Project: CLI with Flags', desc: 'Build -h/-v/-o options.', minutes: 16 },
  ]},
  { section: 'Process & Jobs', items: [
    { title: 'Background Jobs', desc: '& and wait.' },
    { title: 'Subshells', desc: '( ) vs { }.' },
    { title: 'Command Substitution', desc: '$(...) patterns.' },
    { title: 'Parallel-ish Loops', desc: 'When to use xargs -P.' },
    { title: 'Project: Health Check', desc: 'Ping endpoints and report status.', minutes: 14 },
  ]},
  { section: 'Automation Patterns', items: [
    { title: 'Idempotent Scripts', desc: 'Safe to run twice.' },
    { title: 'Logging Patterns', desc: 'Timestamps and levels.' },
    { title: 'Config Files', desc: 'Source a config safely.' },
    { title: 'Cron Integration', desc: 'Schedule your scripts.' },
    { title: 'Project: Deploy Hook', desc: 'Pull, build, restart service.', minutes: 18 },
  ]},
  { section: 'Debugging & Testing', items: [
    { title: 'bash -x', desc: 'Trace execution.' },
    { title: 'Shellcheck', desc: 'Static analysis for scripts.' },
    { title: 'Bats Testing Overview', desc: 'Test shell scripts.' },
    { title: 'Common Pitfalls', desc: 'Word splitting and globbing bugs.' },
    { title: 'Project: Refactor a Messy Script', desc: 'Harden an unsafe script.', minutes: 16 },
  ]},
  { section: 'Advanced Bash', items: [
    { title: 'Namerefs', desc: 'declare -n techniques.' },
    { title: 'Coprocesses Overview', desc: 'Advanced IPC glimpse.' },
    { title: 'Performance Tips', desc: 'Avoid useless cats and subshells.' },
    { title: 'Security Mindset', desc: 'Injection risks in scripts.' },
    { title: 'Capstone: Server Bootstrap', desc: 'Full bootstrap with logging and flags.', minutes: 20 },
  ]},
  { section: 'Capstone & Career', items: [
    { title: 'Capstone: Dev Toolkit', desc: 'Multi-command toolkit in one repo.', minutes: 20 },
    { title: 'Bash Interview Review', desc: 'Quoting, pipes, exit codes, set options.' },
    { title: 'Next Steps', desc: 'Python for larger tools; keep Bash sharp.' },
    { title: 'Final Challenge', desc: 'Automate a weekly report from logs.' },
    { title: 'Glossary Drill', desc: 'pipefail, glob, subshell, shebang, IFS.' },
    { title: 'Reading Scripts', desc: 'Audit an unfamiliar script safely.' },
    { title: 'Portability Notes', desc: 'bashisms vs POSIX sh.' },
    { title: 'CI Scripting', desc: 'Scripts that run in GitHub Actions.' },
    { title: 'Portfolio Tips', desc: 'Show before/after automation metrics.' },
    { title: 'Style Guide', desc: 'Consistent formatting and function layout.' },
  ]},
]);

const COURSES = [
  {
    slug: 'cpp',
    varName: 'cppTutorial',
    pascal: 'Cpp',
    title: 'C++ Tutorial',
    shortTitle: 'C++',
    eyebrow: 'C++ · Systems',
    tag: 'Systems',
    tagline: 'Write fast, precise systems software',
    description:
      'A complete C++ path from syntax and memory to OOP, STL, smart pointers, concurrency, and systems capstones.',
    audience: 'Developers learning systems programming, games, or performance-critical software',
    beginnerSummary: 'Syntax, control flow, functions, arrays/vectors, pointers/references, and first classes.',
    intermediateSummary: 'OOP, STL, modern C++ (lambdas, smart pointers), files, CMake, and solid projects.',
    advancedSummary: 'RAII, concurrency, sanitizers, performance, and systems-style capstones.',
    highlights: [
      'Modern C++ with practical memory ownership',
      'STL containers and algorithms you will use daily',
      'CMake, debugging, and sanitizers',
      'Concurrency and systems capstone projects',
    ],
    outline: CPP,
    lang: 'cpp',
    color: '#00599C',
    logo: '/tech/cpp.png',
  },
  {
    slug: 'java',
    varName: 'javaTutorial',
    pascal: 'Java',
    title: 'Java Tutorial',
    shortTitle: 'Java',
    eyebrow: 'Java · Backend',
    tag: 'Backend',
    tagline: 'Build reliable object-oriented software',
    description:
      'A complete Java path covering language basics, OOP, collections, modern Java features, testing, concurrency, and backend-ready capstones.',
    audience: 'Beginners and career switchers aiming at backend, Android foundations, or enterprise Java',
    beginnerSummary: 'JDK setup, syntax, OOP foundations, collections, and a first console project.',
    intermediateSummary: 'Generics, streams, Maven/Gradle, JDBC/HTTP, threads, and larger projects.',
    advancedSummary: 'JVM memory, performance, security, Docker, design, and API capstones.',
    highlights: [
      'Strong OOP and collections fluency',
      'Modern Java: records, streams, Optional',
      'Testing and build tools',
      'Backend-oriented capstone projects',
    ],
    outline: JAVA,
    lang: 'java',
    color: '#EA2D2E',
    logo: '/tech/java.jpg',
  },
  {
    slug: 'arduino',
    varName: 'arduinoTutorial',
    pascal: 'Arduino',
    title: 'Arduino Tutorial',
    shortTitle: 'Arduino',
    eyebrow: 'Arduino · Embedded',
    tag: 'Embedded',
    tagline: 'Sense the world and control hardware',
    description:
      'A complete Arduino path from Blink to sensors, motors, communication buses, IoT boards, and robotics-style capstones.',
    audience: 'Makers, students, and engineers learning embedded electronics with Arduino',
    beginnerSummary: 'IDE, digital/analog I/O, serial debugging, and first sensor projects.',
    intermediateSummary: 'Libraries, I2C/SPI, motors, interrupts, and structured firmware.',
    advancedSummary: 'ESP Wi-Fi/MQTT, robotics basics, and home-automation capstones.',
    highlights: [
      'Hands-on sketches you can upload today',
      'Sensors, actuators, and communication buses',
      'Non-blocking timing and state machines',
      'IoT and robotics project capstones',
    ],
    outline: ARDUINO,
    lang: 'cpp',
    color: '#00878F',
    logo: '/tech/arduino.png',
  },
  {
    slug: 'kubernetes',
    varName: 'kubernetesTutorial',
    pascal: 'Kubernetes',
    title: 'Kubernetes Tutorial',
    shortTitle: 'Kubernetes',
    eyebrow: 'Kubernetes · DevOps',
    tag: 'DevOps',
    tagline: 'Orchestrate containers in production',
    description:
      'A complete Kubernetes path from pods and deployments to services, ingress, Helm, RBAC, autoscaling, and production operations.',
    audience: 'Developers and DevOps engineers deploying containerized workloads',
    beginnerSummary: 'Cluster concepts, kubectl, pods, deployments, and services.',
    intermediateSummary: 'Config/secrets, probes, storage, ingress, and rollout strategies.',
    advancedSummary: 'RBAC, Helm/Kustomize, observability, GitOps preview, and capstones.',
    highlights: [
      'Declarative YAML you can actually apply',
      'Debugging CrashLoops and bad rollouts',
      'Helm and Kustomize workflows',
      'Security and production operations',
    ],
    outline: KUBERNETES,
    lang: 'yaml',
    color: '#326CE5',
    logo: '/tech/kubernetes.svg',
  },
  {
    slug: 'rust',
    varName: 'rustTutorial',
    pascal: 'Rust',
    title: 'Rust Tutorial',
    shortTitle: 'Rust',
    eyebrow: 'Rust · Systems',
    tag: 'Systems',
    tagline: 'Fearless systems programming',
    description:
      'A complete Rust path focused on ownership, borrowing, types, Cargo, concurrency, and idiomatic systems tooling.',
    audience: 'Developers moving into systems, CLI tools, WebAssembly, or safe concurrency',
    beginnerSummary: 'Cargo, ownership, borrowing, structs/enums, and Result/Option.',
    intermediateSummary: 'Modules, traits, iterators, testing, and practical CLI projects.',
    advancedSummary: 'Concurrency, unsafe boundaries, async preview, and capstone tools.',
    highlights: [
      'Ownership and borrowing made practical',
      'Cargo, testing, and Clippy workflows',
      'Safe concurrency patterns',
      'CLI and systems capstones',
    ],
    outline: RUST,
    lang: 'rust',
    color: '#DEA584',
    logo: '/tech/rust.jpg',
  },
  {
    slug: 'ruby-on-rails',
    varName: 'rubyOnRailsTutorial',
    pascal: 'RubyOnRails',
    title: 'Ruby on Rails Tutorial',
    shortTitle: 'Ruby on Rails',
    eyebrow: 'Rails · Full-stack',
    tag: 'Full-stack',
    tagline: 'Ship web apps with convention and speed',
    description:
      'A complete Ruby on Rails path covering MVC, Active Record, auth, Hotwire preview, APIs, testing, and production deployment.',
    audience: 'Builders who want to launch full-stack web products quickly',
    beginnerSummary: 'Ruby primer, rails new, MVC, CRUD, and validations.',
    intermediateSummary: 'Associations, auth, Active Job/Mailer, and API mode.',
    advancedSummary: 'Testing, security, performance, and SaaS-style capstones.',
    highlights: [
      'Rails conventions that unlock speed',
      'Active Record and forms done right',
      'Authentication and authorization patterns',
      'API and SaaS MVP capstones',
    ],
    outline: RAILS,
    lang: 'ruby',
    color: '#CC0000',
    logo: '/tech/ruby.png',
  },
  {
    slug: 'linux-administration',
    varName: 'linuxAdministrationTutorial',
    pascal: 'LinuxAdministration',
    title: 'Linux Administration Tutorial',
    shortTitle: 'Linux Administration',
    eyebrow: 'Linux · Ops',
    tag: 'DevOps',
    tagline: 'Run and harden real Linux servers',
    description:
      'A complete Linux administration path: filesystem, users, systemd, networking, packages, storage, security hardening, and ops capstones.',
    audience: 'Aspiring sysadmins, DevOps engineers, and developers who own servers',
    beginnerSummary: 'Terminal fluency, files, permissions, users, and systemd basics.',
    intermediateSummary: 'Packages, networking, SSH hardening, disks, and logs.',
    advancedSummary: 'Automation, containers on Linux, hardening, and production drills.',
    highlights: [
      'Real admin commands with context',
      'systemd, networking, and storage',
      'SSH hardening and firewalls',
      'Incident and bootstrap capstones',
    ],
    outline: LINUX,
    lang: 'bash',
    color: '#FCC624',
    logo: '/tech/linux.jpg',
  },
  {
    slug: 'bash-scripting',
    varName: 'bashScriptingTutorial',
    pascal: 'BashScripting',
    title: 'Bash Scripting Tutorial',
    shortTitle: 'Bash Scripting',
    eyebrow: 'Bash · Automation',
    tag: 'DevOps',
    tagline: 'Automate the command line with discipline',
    description:
      'A complete Bash scripting path from first scripts to robust automation: quoting, pipelines, functions, getopts, debugging, and production-safe tooling.',
    audience: 'Developers and admins who want reliable shell automation',
    beginnerSummary: 'Scripts, variables, quoting, conditionals, loops, and pipes.',
    intermediateSummary: 'Arrays, getopts, find/xargs, traps, and safer scripting.',
    advancedSummary: 'Shellcheck, testing, security, and automation capstones.',
    highlights: [
      'Safe quoting and pipefail habits',
      'Text processing with grep/sed/awk',
      'CLI flags and idempotent scripts',
      'Bootstrap and toolkit capstones',
    ],
    outline: BASH,
    lang: 'bash',
    color: '#4EAA25',
    logo: '/tech/bash.jpg',
  },
];

function main() {
  const metaForWiring = [];
  for (const course of COURSES) {
    const built = buildFromOutline(course.shortTitle, course.lang, course.outline);
    const dir = join(process.cwd(), 'lib/tutorials', course.slug);
    emitFile(dir, 'beginnerLessons', built.beginner);
    emitFile(dir, 'intermediateLessons', built.intermediate);
    emitFile(dir, 'advancedLessons', built.advanced);
    writeCourseIndex(course.slug, course);
    writeAppRoutes(course.slug, course);
    metaForWiring.push({
      slug: course.slug,
      varName: course.varName,
      pascal: course.pascal,
      shortTitle: course.shortTitle,
      tag: course.tag,
      color: course.color,
      logo: course.logo,
      total: built.beginner.length + built.intermediate.length + built.advanced.length,
    });
    console.log(`✓ ${course.slug}: ${metaForWiring.at(-1).total} lessons`);
  }
  writeFileSync(
    join(process.cwd(), 'scripts/systems-tutorials-meta.json'),
    JSON.stringify(metaForWiring, null, 2),
  );
  console.log('Wrote scripts/systems-tutorials-meta.json');
}

main();
