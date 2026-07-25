import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-flutter',
    title: 'What is Flutter?',
    description: 'Learn what Flutter is, what it is used for, and why it is a friendly way to build beautiful apps.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 8,
    content: [
      { type: 'p', text: 'Flutter is a toolkit from Google for building apps from one codebase. You can use Flutter to create apps for Android, iOS, web, desktop, and embedded screens.' },
      { type: 'p', text: 'Flutter apps are built with widgets. A widget can be a button, a row, a screen, a color theme, or even the whole app. You describe what the screen should look like, and Flutter draws it.' },
      { type: 'h2', text: 'Why developers like Flutter' },
      { type: 'ul', items: ['One codebase can target multiple platforms.', 'Hot reload lets you see many changes quickly while building.', 'Flutter includes a rich set of ready-made UI widgets.', 'Apps can look consistent across devices while still feeling native.', 'Dart, Flutter\'s language, is clear enough to learn as you build.'] },
      { type: 'h2', text: 'A tiny Flutter app' },
      { type: 'p', text: 'Every Flutter app starts with Dart code. The main function starts the app, and widgets describe the user interface.' },
      {
        type: 'code',
        title: 'lib/main.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text('Hello, Flutter!'),
        ),
      ),
    );
  }
}`
      },
      { type: 'h2', text: 'What Flutter gives you' },
      {
        type: 'table',
        headers: ['Flutter part', 'What it does'],
        rows: [
          ['Framework', 'Provides widgets, layout, navigation, animation, and app structure'],
          ['Engine', 'Draws your UI smoothly on each platform'],
          ['Tools', 'Create projects, run apps, test, build, and inspect problems'],
          ['Packages', 'Add features such as HTTP, storage, maps, or camera support']
        ]
      },
      { type: 'note', text: 'Flutter does not use HTML views for mobile UI. It draws its own interface, which gives you precise control over layout and styling.' },
      { type: 'try', text: 'Think of an app you use every day. List five visible pieces on one screen, such as a title, image, button, list item, or bottom bar. In Flutter, each piece can be represented by widgets.' },
      { type: 'keypoints', items: ['Flutter builds apps from a single Dart codebase.', 'Flutter UI is made from widgets.', 'Hot reload helps you build and experiment quickly.', 'This tutorial teaches Dart concepts inside Flutter as they become useful.'] }
    ]
  },
  {
    slug: 'flutter-without-dart-first',
    title: 'Learn Flutter Without a Separate Dart Course',
    description: 'Understand how this tutorial teaches Dart exactly when Flutter needs it.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 8,
    content: [
      { type: 'p', text: 'You do not need to finish a separate Dart course before learning Flutter. Flutter uses Dart, but the best beginner path is to learn each Dart idea inside a real Flutter example.' },
      { type: 'p', text: 'This tutorial introduces Dart in a practical order: variables when text and numbers appear, classes when widgets appear, state when screens need to change, and async later when apps load data.' },
      { type: 'h2', text: 'Dart concepts appear naturally' },
      {
        type: 'table',
        headers: ['Dart concept', 'When you learn it in Flutter'],
        rows: [
          ['Variables and types', 'When showing names, counts, prices, and colors'],
          ['Functions', 'When responding to taps or formatting text'],
          ['Classes', 'When creating widgets and simple data models'],
          ['Null safety', 'When a value might be missing, such as optional form input'],
          ['Lists and maps', 'When rendering notes, course cards, or settings'],
          ['async and Future', 'When loading files, APIs, or saved data later']
        ]
      },
      { type: 'h2', text: 'A Flutter-first Dart example' },
      { type: 'p', text: 'In this example, Dart variables feed a Flutter widget. You learn strings and numbers because the interface needs them.' },
      {
        type: 'code',
        title: 'lib/main.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(const CourseApp());
}

class CourseApp extends StatelessWidget {
  const CourseApp({super.key});

  @override
  Widget build(BuildContext context) {
    const courseName = 'Flutter Basics';
    const lessonCount = 25;

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('My Course')),
        body: const Center(
          child: Text('$courseName has $lessonCount lessons'),
        ),
      ),
    );
  }
}`
      },
      { type: 'h2', text: 'The learning order' },
      { type: 'ol', items: ['Start with widgets so you can see results on screen.', 'Use simple Dart values inside those widgets.', 'Create your own widget classes to organize screens.', 'Use setState when the user changes something.', 'Use async later when the app waits for data.'] },
      {
        type: 'code',
        title: 'A tap calls a Dart function',
        language: 'dart',
        code: `void showMessage() {
  print('Button tapped');
}

ElevatedButton(
  onPressed: showMessage,
  child: const Text('Save note'),
)`
      },
      { type: 'tip', text: 'When you see Dart syntax that looks new, ask: what Flutter job is this syntax helping with right now? That keeps the language connected to the app you are building.' },
      { type: 'try', text: 'Write a short learning promise: "I will learn Dart as Flutter needs it." Then list the first four Dart topics from this lesson in order.' },
      { type: 'keypoints', items: ['A separate Dart course is not required before Flutter.', 'Dart is introduced when it solves a Flutter problem.', 'Variables come early, widgets and classes come next, state follows, and async comes later.', 'You will still learn essential Dart, but always inside app examples.'] }
    ]
  },
  {
    slug: 'flutter-install',
    title: 'Install Flutter & Set Up Your Editor',
    description: 'Install Flutter, check your setup, and prepare an editor for building apps.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 12,
    content: [
      { type: 'p', text: 'To build Flutter apps, you need the Flutter SDK, an editor, and at least one place to run the app. That can be an Android emulator, iOS simulator, browser, desktop target, or physical device.' },
      { type: 'h2', text: 'Install Flutter' },
      { type: 'p', text: 'Download Flutter from the official Flutter website for your operating system. After installing, make sure the flutter command is available from your terminal.' },
      {
        type: 'code',
        title: 'Check Flutter',
        language: 'bash',
        code: `flutter --version
flutter doctor`
      },
      { type: 'h2', text: 'Understand flutter doctor' },
      { type: 'p', text: 'The flutter doctor command checks your machine and tells you what is ready or missing. Beginners should read the output slowly and fix one item at a time.' },
      {
        type: 'code',
        title: 'Common doctor output',
        language: 'text',
        code: `[✓] Flutter
[✓] Android toolchain
[✓] Chrome
[!] Xcode
[✓] VS Code`
      },
      { type: 'h2', text: 'Set up your editor' },
      { type: 'ul', items: ['Install Visual Studio Code or Android Studio.', 'Install the Flutter extension.', 'Install the Dart extension if your editor asks for it.', 'Open the whole project folder, not only one Dart file.', 'Use the editor command palette to start an emulator or choose a device.'] },
      { type: 'h2', text: 'Create a test project' },
      {
        type: 'code',
        title: 'Create and run',
        language: 'bash',
        code: `flutter create hello_flutter
cd hello_flutter
flutter run`
      },
      { type: 'note', text: 'On macOS, iOS development also requires Xcode. On Windows and Linux, you can still build Android, web, and desktop targets depending on your setup.' },
      { type: 'tip', text: 'If setup feels slow, start with Chrome as your first target. It is often the quickest way to verify that Flutter runs.' },
      { type: 'try', text: 'Run flutter doctor and write down every line that has a warning. Fix the first warning, run flutter doctor again, and repeat until you can run a sample app.' },
      { type: 'keypoints', items: ['Flutter SDK provides the flutter command.', 'flutter doctor checks your development setup.', 'An editor extension gives autocomplete, errors, and run controls.', 'You need at least one target device or platform to run apps.'] }
    ]
  },
  {
    slug: 'flutter-first-app',
    title: 'Your First Flutter App',
    description: 'Create a small Material 3 Flutter app and understand the main pieces.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 12,
    content: [
      { type: 'p', text: 'Your first Flutter app should be small enough to understand. In this lesson, you will create a simple notes welcome screen using MaterialApp, Scaffold, AppBar, Center, and Text.' },
      { type: 'h2', text: 'Create the project' },
      {
        type: 'code',
        title: 'Terminal',
        language: 'bash',
        code: `flutter create notes_app
cd notes_app
flutter run`
      },
      { type: 'h2', text: 'Replace the starter screen' },
      { type: 'p', text: 'Open lib/main.dart and replace the sample counter app with this beginner-friendly version.' },
      {
        type: 'code',
        title: 'lib/main.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(const NotesApp());
}

class NotesApp extends StatelessWidget {
  const NotesApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notes')),
      body: const Center(
        child: Text('Welcome to your notes app!'),
      ),
    );
  }
}`
      },
      { type: 'h2', text: 'What each part means' },
      {
        type: 'table',
        headers: ['Code', 'Meaning'],
        rows: [
          ['main', 'The function where the app starts'],
          ['runApp', 'Hands your root widget to Flutter'],
          ['MaterialApp', 'Sets up Material design, theme, navigation, and app behavior'],
          ['Scaffold', 'Provides a standard screen layout'],
          ['AppBar', 'Creates the top bar'],
          ['Center and Text', 'Place and display text in the body']
        ]
      },
      { type: 'h2', text: 'Try hot reload' },
      { type: 'p', text: 'Change the welcome text and save the file. Flutter should update the running app without restarting everything.' },
      {
        type: 'code',
        title: 'Change one line',
        language: 'dart',
        code: `child: Text('My first Flutter screen'),`
      },
      { type: 'note', text: 'const tells Dart that a value can be created at compile time. You will see const often in Flutter because many widgets do not change.' },
      { type: 'try', text: 'Change the app title to "Study Notes" and the body text to a sentence about what your app will store.' },
      { type: 'keypoints', items: ['main starts a Flutter app.', 'MaterialApp wraps the whole app with Material behavior.', 'Scaffold gives a screen structure.', 'Hot reload helps you quickly see UI changes.'] }
    ]
  },
  {
    slug: 'flutter-project-structure',
    title: 'Project Structure Explained',
    description: 'Understand the most important folders and files in a new Flutter project.',
    level: 'beginner',
    section: 'Getting Started',
    order: 5,
    minutes: 10,
    content: [
      { type: 'p', text: 'A Flutter project contains your Dart code, app configuration, platform folders, tests, and dependency settings. You do not need to understand every file on day one, but you should know where the important pieces live.' },
      { type: 'h2', text: 'Common project files' },
      {
        type: 'code',
        title: 'Project tree',
        language: 'text',
        code: `notes_app/
  android/
  ios/
  lib/
    main.dart
  test/
    widget_test.dart
  pubspec.yaml
  analysis_options.yaml`
      },
      {
        type: 'table',
        headers: ['Path', 'Purpose'],
        rows: [
          ['lib/main.dart', 'The default entry point for your Flutter app'],
          ['lib/', 'Where most of your Dart and Flutter code goes'],
          ['pubspec.yaml', 'Project name, assets, fonts, and package dependencies'],
          ['test/', 'Automated tests'],
          ['android/ and ios/', 'Native platform project files'],
          ['analysis_options.yaml', 'Rules for code analysis and linting']
        ]
      },
      { type: 'h2', text: 'The lib folder grows with your app' },
      { type: 'p', text: 'Small beginner apps can live in main.dart. As an app grows, you usually split screens, widgets, and models into separate files.' },
      {
        type: 'code',
        title: 'A simple beginner structure',
        language: 'text',
        code: `lib/
  main.dart
  screens/
    home_screen.dart
    note_detail_screen.dart
  widgets/
    note_card.dart
  models/
    note.dart`
      },
      { type: 'h2', text: 'pubspec.yaml matters' },
      { type: 'p', text: 'The pubspec file is written in YAML. It controls dependencies and declares assets such as images and fonts.' },
      {
        type: 'code',
        title: 'pubspec.yaml excerpt',
        language: 'yaml',
        code: `name: notes_app
description: A beginner Flutter notes app

dependencies:
  flutter:
    sdk: flutter

flutter:
  uses-material-design: true`
      },
      { type: 'tip', text: 'YAML uses spaces for indentation. Do not use tabs in pubspec.yaml.' },
      { type: 'note', text: 'You can ignore most generated platform files at first. Spend your beginner energy in lib/main.dart and pubspec.yaml.' },
      { type: 'try', text: 'Open a Flutter project and find lib/main.dart, pubspec.yaml, and test/widget_test.dart. Explain the purpose of each file in one sentence.' },
      { type: 'keypoints', items: ['Most Flutter code lives in lib/.', 'main.dart is the usual starting point.', 'pubspec.yaml controls dependencies, assets, and fonts.', 'Generated platform folders are important but not the first place beginners edit.'] }
    ]
  },
  {
    slug: 'dart-variables-types',
    title: 'Dart Variables & Types (Inside Flutter)',
    description: 'Learn Dart variables and common types by placing real values in Flutter widgets.',
    level: 'beginner',
    section: 'Dart Essentials Inside Flutter',
    order: 6,
    minutes: 12,
    content: [
      { type: 'p', text: 'Variables store values so your app can reuse them. Flutter screens often need names, prices, counts, colors, and booleans, so variables appear quickly in real apps.' },
      { type: 'h2', text: 'Common Dart types' },
      {
        type: 'table',
        headers: ['Type', 'Example value', 'Common Flutter use'],
        rows: [
          ['String', '"Notebook"', 'Text shown in a widget'],
          ['int', '3', 'Counts, selected indexes, item quantities'],
          ['double', '19.99', 'Prices, sizes, opacity values'],
          ['bool', 'true', 'Switches, loading flags, visibility choices'],
          ['Color', 'Colors.indigo', 'UI color values']
        ]
      },
      { type: 'h2', text: 'Variables inside a widget' },
      {
        type: 'code',
        title: 'lib/main.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(const ShopApp());
}

class ShopApp extends StatelessWidget {
  const ShopApp({super.key});

  @override
  Widget build(BuildContext context) {
    const itemName = 'Notebook';
    const quantity = 3;
    const price = 4.99;
    const inStock = true;

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('Shop List')),
        body: Center(
          child: Text('$quantity x $itemName = \${quantity * price}'),
        ),
        floatingActionButton: inStock
            ? const FloatingActionButton(
                onPressed: null,
                child: Icon(Icons.check),
              )
            : null,
      ),
    );
  }
}`
      },
      { type: 'h2', text: 'var, final, and const' },
      { type: 'p', text: 'Dart can infer types, which means it can often figure out the type from the value. Flutter code commonly uses final and const to express values that should not be reassigned.' },
      {
        type: 'code',
        title: 'Choosing variable keywords',
        language: 'dart',
        code: `var title = 'Today';
title = 'Tomorrow';

final createdAt = DateTime.now();

const appName = 'Notes';`
      },
      {
        type: 'table',
        headers: ['Keyword', 'Use it when'],
        rows: [
          ['var', 'The value can change and Dart can infer the type'],
          ['final', 'The value is assigned once at runtime'],
          ['const', 'The value is known at compile time']
        ]
      },
      { type: 'note', text: 'A variable declared as const is also final, but not every final value can be const. DateTime.now() is final-friendly, but not const because it is calculated when the app runs.' },
      { type: 'try', text: 'Create variables for a profile screen: name, age, premium member status, and favorite color. Display at least two of them in a Text widget.' },
      { type: 'keypoints', items: ['Variables store values used by widgets.', 'Dart has types such as String, int, double, and bool.', 'final means assigned once; const means compile-time constant.', 'Dart string interpolation can insert values into text.'] }
    ]
  },
  {
    slug: 'dart-functions-classes',
    title: 'Dart Functions, Classes & Null Safety',
    description: 'Learn functions, widget classes, simple model classes, and Dart null safety essentials.',
    level: 'beginner',
    section: 'Dart Essentials Inside Flutter',
    order: 7,
    minutes: 15,
    content: [
      { type: 'p', text: 'Functions group reusable behavior. Classes group related data and behavior. Flutter uses both constantly: event handlers are functions, and widgets are classes.' },
      { type: 'h2', text: 'Functions in Flutter' },
      { type: 'p', text: 'A function can receive input, do work, and return a value. In Flutter, functions are often used for button taps, formatting display text, and building repeated UI pieces.' },
      {
        type: 'code',
        title: 'A helper function',
        language: 'dart',
        code: `String formatCourseTitle(String name, int lessons) {
  return '$name ($lessons lessons)';
}

Text(formatCourseTitle('Flutter Basics', 25))`
      },
      { type: 'h2', text: 'Classes for data' },
      { type: 'p', text: 'A class is a blueprint for objects. A notes app might use a Note class to keep the title and body together.' },
      {
        type: 'code',
        title: 'lib/models/note.dart',
        language: 'dart',
        code: `class Note {
  final String title;
  final String body;
  final bool isPinned;

  const Note({
    required this.title,
    required this.body,
    this.isPinned = false,
  });
}

const firstNote = Note(
  title: 'Grocery list',
  body: 'Milk, bread, apples',
);`
      },
      { type: 'h2', text: 'Classes for widgets' },
      { type: 'p', text: 'A Flutter widget class extends another widget class, such as StatelessWidget. The build method returns the UI for that widget.' },
      {
        type: 'code',
        title: 'A reusable widget class',
        language: 'dart',
        code: `class NoteCard extends StatelessWidget {
  final Note note;

  const NoteCard({super.key, required this.note});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(note.title),
        subtitle: Text(note.body),
        trailing: note.isPinned ? const Icon(Icons.push_pin) : null,
      ),
    );
  }
}`
      },
      { type: 'h2', text: 'Null safety essentials' },
      { type: 'p', text: 'Null means no value. Dart uses null safety to help you avoid accidentally using a missing value. By default, variables cannot be null unless you add a question mark to the type.' },
      {
        type: 'code',
        title: 'Nullable values',
        language: 'dart',
        code: `String title = 'Profile';
// title = null; // Not allowed.

String? nickname;
nickname = 'Ace';
nickname = null;

Text(nickname ?? 'No nickname yet')`
      },
      {
        type: 'table',
        headers: ['Syntax', 'Meaning'],
        rows: [
          ['String', 'Must contain a string'],
          ['String?', 'May contain a string or null'],
          ['value ?? fallback', 'Use fallback when value is null'],
          ['required', 'Caller must provide this named argument'],
          ['!', 'Tell Dart a nullable value is not null; use sparingly']
        ]
      },
      { type: 'note', text: 'Null safety is not extra theory in Flutter. It appears when form fields, route results, images, or optional profile data may be missing.' },
      { type: 'warning', text: 'Avoid using ! just to silence an error. It can crash if the value is actually null. Prefer checking the value or using ?? when possible.' },
      { type: 'try', text: 'Create a Profile class with required name, optional bio, and optional avatarUrl. Display the bio with a fallback message when it is null.' },
      { type: 'keypoints', items: ['Functions reuse behavior and can return values.', 'Classes define data models and custom widgets.', 'Flutter widget classes usually implement a build method.', 'Dart null safety requires you to mark nullable values with ?.'] }
    ]
  },
  {
    slug: 'dart-collections-async-preview',
    title: 'Lists, Maps & a First Look at async',
    description: 'Use Dart lists and maps in Flutter, then preview async code for future data loading.',
    level: 'beginner',
    section: 'Dart Essentials Inside Flutter',
    order: 8,
    minutes: 13,
    content: [
      { type: 'p', text: 'Apps rarely show only one value. A notes app shows many notes, a course app shows many lessons, and a shop app shows many products. Dart collections help store groups of values.' },
      { type: 'h2', text: 'Lists store ordered items' },
      {
        type: 'code',
        title: 'List of notes',
        language: 'dart',
        code: `final notes = ['Buy milk', 'Read Flutter docs', 'Plan weekend'];

Column(
  children: [
    Text(notes[0]),
    Text(notes[1]),
    Text(notes[2]),
  ],
)`
      },
      { type: 'h2', text: 'Use map to build widgets' },
      { type: 'p', text: 'The map method transforms each list item into something else. In Flutter, you often transform data into widgets.' },
      {
        type: 'code',
        title: 'Build widgets from a list',
        language: 'dart',
        code: `final courses = ['Flutter', 'Dart', 'Firebase'];

Column(
  children: courses
      .map((course) => ListTile(
            leading: const Icon(Icons.school),
            title: Text(course),
          ))
      .toList(),
)`
      },
      { type: 'h2', text: 'Maps store key-value pairs' },
      {
        type: 'code',
        title: 'A map for profile data',
        language: 'dart',
        code: `final profile = {
  'name': 'Maya',
  'role': 'Student',
  'city': 'Lagos',
};

Text('\${profile['name']} is a \${profile['role']}')`
      },
      { type: 'h2', text: 'A first look at async' },
      { type: 'p', text: 'Some work takes time: loading a file, calling an API, or reading saved settings. Dart represents a future result with Future, and async functions let you wait for it using await.' },
      {
        type: 'code',
        title: 'Async preview',
        language: 'dart',
        code: `Future<String> loadWelcomeMessage() async {
  await Future.delayed(const Duration(seconds: 1));
  return 'Welcome back!';
}`
      },
      { type: 'note', text: 'This is only a preview of async. Later lessons can use FutureBuilder, HTTP, and storage after you are comfortable with widgets and state.' },
      { type: 'try', text: 'Create a list of three shopping items. Use map to turn each item into a ListTile with a shopping cart icon.' },
      { type: 'keypoints', items: ['Lists store ordered groups of values.', 'map can transform data into widgets.', 'Maps store values by keys.', 'Future, async, and await are used when work finishes later.'] }
    ]
  },
  {
    slug: 'flutter-widgets-intro',
    title: 'Widgets: The Building Blocks',
    description: 'Understand widgets, widget trees, composition, and why Flutter UI is built by nesting widgets.',
    level: 'beginner',
    section: 'Widgets & UI',
    order: 9,
    minutes: 10,
    content: [
      { type: 'p', text: 'Widgets are the building blocks of Flutter apps. Everything you see on screen is described by widgets, and many invisible layout or styling choices are widgets too.' },
      { type: 'h2', text: 'Widgets describe UI' },
      { type: 'p', text: 'A widget is a description of part of the interface. Flutter reads your widget tree and creates the actual pixels on the screen.' },
      {
        type: 'code',
        title: 'A small widget tree',
        language: 'dart',
        code: `MaterialApp(
  home: Scaffold(
    appBar: AppBar(
      title: const Text('Profile'),
    ),
    body: const Center(
      child: Text('Hello, Maya'),
    ),
  ),
)`
      },
      { type: 'h2', text: 'Parent and child widgets' },
      {
        type: 'table',
        headers: ['Widget', 'Role'],
        rows: [
          ['MaterialApp', 'Root app configuration'],
          ['Scaffold', 'Page structure'],
          ['AppBar', 'Top app bar'],
          ['Center', 'Places one child in the center'],
          ['Text', 'Displays text']
        ]
      },
      { type: 'h2', text: 'Composition is the Flutter style' },
      { type: 'p', text: 'Flutter apps are built by composing small widgets together. Instead of making one giant screen, you create smaller widgets and combine them.' },
      {
        type: 'code',
        title: 'Compose a profile card',
        language: 'dart',
        code: `Card(
  child: Padding(
    padding: const EdgeInsets.all(16),
    child: Row(
      children: const [
        Icon(Icons.person),
        SizedBox(width: 12),
        Text('Maya Chen'),
      ],
    ),
  ),
)`
      },
      { type: 'tip', text: 'When reading Flutter code, start from the outer widget and move inward. Ask what each parent does for its child.' },
      { type: 'try', text: 'Draw a widget tree for a screen with an app bar, centered column, title text, subtitle text, and button.' },
      { type: 'keypoints', items: ['Flutter UI is built from widgets.', 'Widgets can be visible or structural.', 'Widgets are nested into a widget tree.', 'Composition means building larger UI from smaller widgets.'] }
    ]
  },
  {
    slug: 'flutter-stateless',
    title: 'StatelessWidget',
    description: 'Create UI that depends only on the values passed into it.',
    level: 'beginner',
    section: 'Widgets & UI',
    order: 10,
    minutes: 12,
    content: [
      { type: 'p', text: 'A StatelessWidget describes UI that does not manage changing data inside itself. It can still receive values, but it does not call setState to change its own screen.' },
      { type: 'h2', text: 'When to use StatelessWidget' },
      { type: 'ul', items: ['A title section that only displays text', 'A product card that receives product data', 'A profile header that receives a name and image', 'A reusable button style', 'A screen that does not change after it is built'] },
      { type: 'h2', text: 'Create a reusable card' },
      {
        type: 'code',
        title: 'lib/widgets/course_card.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

class CourseCard extends StatelessWidget {
  final String title;
  final int lessons;
  final IconData icon;

  const CourseCard({
    super.key,
    required this.title,
    required this.lessons,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        subtitle: Text('$lessons lessons'),
      ),
    );
  }
}`
      },
      { type: 'h2', text: 'Use the widget' },
      {
        type: 'code',
        title: 'Inside a screen',
        language: 'dart',
        code: `const Column(
  children: [
    CourseCard(
      title: 'Flutter Basics',
      lessons: 25,
      icon: Icons.phone_android,
    ),
    CourseCard(
      title: 'Firebase Starter',
      lessons: 12,
      icon: Icons.cloud,
    ),
  ],
)`
      },
      { type: 'h2', text: 'Constructor basics' },
      { type: 'p', text: 'The constructor lets callers provide values. The required keyword means the caller must pass that value. super.key passes a widget key to the parent class.' },
      {
        type: 'code',
        title: 'Constructor pattern',
        language: 'dart',
        code: `const CourseCard({
  super.key,
  required this.title,
  required this.lessons,
  required this.icon,
});`
      },
      { type: 'note', text: 'Stateless does not mean boring. Many production widgets are stateless because their values come from a parent widget, database, API, or state manager.' },
      { type: 'try', text: 'Create a StatelessWidget named ProfileBadge with required name and role strings. Display them in a Card with a person icon.' },
      { type: 'keypoints', items: ['StatelessWidget is for UI that does not manage its own changing state.', 'Values can be passed through constructor parameters.', 'required makes important arguments mandatory.', 'Reusable stateless widgets keep screens smaller and easier to read.'] }
    ]
  },
  {
    slug: 'flutter-stateful',
    title: 'StatefulWidget & setState',
    description: 'Build interactive UI that changes when the user taps a button.',
    level: 'beginner',
    section: 'Widgets & UI',
    order: 11,
    minutes: 14,
    content: [
      { type: 'p', text: 'A StatefulWidget is used when a widget needs to remember changing data. A counter, selected tab, checkbox, form input, or expanded card often needs state.' },
      { type: 'h2', text: 'State changes the screen' },
      { type: 'p', text: 'In beginner Flutter, setState is the simplest way to tell Flutter: a value changed, please rebuild this widget with the new value.' },
      {
        type: 'code',
        title: 'lib/main.dart',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(const MaterialApp(home: CounterScreen()));
}

class CounterScreen extends StatefulWidget {
  const CounterScreen({super.key});

  @override
  State<CounterScreen> createState() => _CounterScreenState();
}

class _CounterScreenState extends State<CounterScreen> {
  int count = 0;

  void increment() {
    setState(() {
      count++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Counter')),
      body: Center(
        child: Text('Count: $count'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: increment,
        child: const Icon(Icons.add),
      ),
    );
  }
}`
      },
      { type: 'h2', text: 'StatefulWidget has two classes' },
      {
        type: 'table',
        headers: ['Class', 'Purpose'],
        rows: [
          ['CounterScreen', 'The widget configuration'],
          ['_CounterScreenState', 'The mutable state and build method'],
          ['createState', 'Connects the widget to its State object'],
          ['setState', 'Schedules a rebuild after values change']
        ]
      },
      { type: 'h2', text: 'A notes example' },
      {
        type: 'code',
        title: 'Toggle pinned state',
        language: 'dart',
        code: `bool isPinned = false;

void togglePinned() {
  setState(() {
    isPinned = !isPinned;
  });
}

IconButton(
  onPressed: togglePinned,
  icon: Icon(isPinned ? Icons.push_pin : Icons.push_pin_outlined),
)`
      },
      { type: 'warning', text: 'Only change state inside setState when that change should update the UI. Do not put slow network calls inside setState.' },
      { type: 'try', text: 'Create a StatefulWidget with a bool named isFavorite. Show a filled heart when true and an outlined heart when false. Toggle it with an IconButton.' },
      { type: 'keypoints', items: ['StatefulWidget is for UI with changing values.', 'State values usually live in the State class.', 'setState tells Flutter to rebuild with new values.', 'Keep setState focused on quick state changes.'] }
    ]
  },
  {
    slug: 'flutter-text-images-icons',
    title: 'Text, Images & Icons',
    description: 'Display readable text, icons, network images, and local image assets.',
    level: 'beginner',
    section: 'Widgets & UI',
    order: 12,
    minutes: 12,
    content: [
      { type: 'p', text: 'Most apps display text, images, and icons on almost every screen. Flutter gives you Text, Image, Icon, and many styling options to make content clear and attractive.' },
      { type: 'h2', text: 'Style text' },
      {
        type: 'code',
        title: 'Text examples',
        language: 'dart',
        code: `Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: const [
    Text(
      'Course of the Day',
      style: TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
      ),
    ),
    SizedBox(height: 8),
    Text('Learn Flutter with small daily lessons.'),
  ],
)`
      },
      { type: 'h2', text: 'Use icons' },
      {
        type: 'code',
        title: 'Icon row',
        language: 'dart',
        code: `Row(
  children: const [
    Icon(Icons.star, color: Colors.amber),
    SizedBox(width: 8),
    Text('Beginner friendly'),
  ],
)`
      },
      { type: 'h2', text: 'Show network images' },
      {
        type: 'code',
        title: 'Network image',
        language: 'dart',
        code: `Image.network(
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
  height: 160,
  width: double.infinity,
  fit: BoxFit.cover,
)`
      },
      { type: 'h2', text: 'Show local assets' },
      { type: 'p', text: 'Local images must be placed in your project and declared in pubspec.yaml. The asset path must match exactly.' },
      {
        type: 'code',
        title: 'pubspec.yaml',
        language: 'yaml',
        code: `flutter:
  uses-material-design: true
  assets:
    - assets/images/profile.png`
      },
      {
        type: 'code',
        title: 'Use the asset',
        language: 'dart',
        code: `Image.asset(
  'assets/images/profile.png',
  width: 96,
  height: 96,
)`
      },
      { type: 'tip', text: 'Use fit: BoxFit.cover when an image should fill a fixed area without leaving empty space.' },
      { type: 'try', text: 'Build a profile header with a circular image, a name, a short bio, and two icons that describe interests.' },
      { type: 'keypoints', items: ['Text displays words and can be styled.', 'Icon uses Material icon names such as Icons.star.', 'Image.network loads images from URLs.', 'Image.asset needs a matching pubspec.yaml asset declaration.'] }
    ]
  },
  {
    slug: 'flutter-buttons-gestures',
    title: 'Buttons & Basic Gestures',
    description: 'Handle taps with Flutter buttons, IconButton, and GestureDetector.',
    level: 'beginner',
    section: 'Widgets & UI',
    order: 13,
    minutes: 11,
    content: [
      { type: 'p', text: 'Interactive apps respond when people tap, press, or gesture. Flutter includes ready-made button widgets and lower-level gesture widgets for custom interactions.' },
      { type: 'h2', text: 'Common buttons' },
      {
        type: 'code',
        title: 'Button examples',
        language: 'dart',
        code: `Column(
  children: [
    ElevatedButton(
      onPressed: () {
        print('Saved');
      },
      child: const Text('Save note'),
    ),
    TextButton(
      onPressed: () {
        print('Canceled');
      },
      child: const Text('Cancel'),
    ),
    OutlinedButton(
      onPressed: () {
        print('Shared');
      },
      child: const Text('Share'),
    ),
  ],
)`
      },
      { type: 'h2', text: 'IconButton for compact actions' },
      {
        type: 'code',
        title: 'Favorite button',
        language: 'dart',
        code: `IconButton(
  onPressed: () {
    print('Favorite tapped');
  },
  icon: const Icon(Icons.favorite_border),
)`
      },
      { type: 'h2', text: 'GestureDetector for custom taps' },
      { type: 'p', text: 'Use GestureDetector when the tappable thing is not a standard button, such as a custom card or image.' },
      {
        type: 'code',
        title: 'Tappable card',
        language: 'dart',
        code: `GestureDetector(
  onTap: () {
    print('Course card tapped');
  },
  child: Card(
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: const [
          Icon(Icons.school),
          SizedBox(width: 12),
          Text('Open Flutter course'),
        ],
      ),
    ),
  ),
)`
      },
      { type: 'h2', text: 'Disable a button' },
      {
        type: 'code',
        title: 'Disabled button',
        language: 'dart',
        code: `ElevatedButton(
  onPressed: null,
  child: const Text('Save'),
)`
      },
      { type: 'note', text: 'A Flutter button is disabled when onPressed is null. This is useful when a form is incomplete or an action is not available.' },
      { type: 'try', text: 'Create a screen with Save, Delete, and Favorite actions. Use different button types and print a message from each onPressed callback.' },
      { type: 'keypoints', items: ['Buttons receive functions through onPressed.', 'Use ElevatedButton for primary actions.', 'Use IconButton for compact icon actions.', 'GestureDetector can make custom widgets respond to taps.'] }
    ]
  },
  {
    slug: 'flutter-row-column',
    title: 'Row, Column & Expanded',
    description: 'Arrange widgets horizontally and vertically with Flutter layout basics.',
    level: 'beginner',
    section: 'Layout',
    order: 14,
    minutes: 13,
    content: [
      { type: 'p', text: 'Layout is how widgets are arranged on the screen. Row places children horizontally, Column places children vertically, and Expanded helps a child fill available space.' },
      { type: 'h2', text: 'Column for vertical layout' },
      {
        type: 'code',
        title: 'Profile summary',
        language: 'dart',
        code: `Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: const [
    Text(
      'Maya Chen',
      style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
    ),
    SizedBox(height: 8),
    Text('Flutter learner and note-taking fan.'),
  ],
)`
      },
      { type: 'h2', text: 'Row for horizontal layout' },
      {
        type: 'code',
        title: 'Icon and text',
        language: 'dart',
        code: `Row(
  children: const [
    Icon(Icons.check_circle, color: Colors.green),
    SizedBox(width: 8),
    Text('Lesson completed'),
  ],
)`
      },
      { type: 'h2', text: 'Expanded fills available space' },
      { type: 'p', text: 'Expanded is useful when one child should take leftover space. In a Row, it can prevent long text from pushing buttons off the screen.' },
      {
        type: 'code',
        title: 'Expanded in a note row',
        language: 'dart',
        code: `Row(
  children: [
    const Icon(Icons.note),
    const SizedBox(width: 12),
    const Expanded(
      child: Text(
        'A very long note title that should wrap instead of breaking the row',
      ),
    ),
    IconButton(
      onPressed: () {},
      icon: const Icon(Icons.more_vert),
    ),
  ],
)`
      },
      { type: 'h2', text: 'Main axis and cross axis' },
      {
        type: 'table',
        headers: ['Widget', 'Main axis', 'Cross axis'],
        rows: [
          ['Row', 'Horizontal', 'Vertical'],
          ['Column', 'Vertical', 'Horizontal']
        ]
      },
      { type: 'tip', text: 'If a Row overflows, look for text or images that need Expanded, Flexible, or a fixed size.' },
      { type: 'try', text: 'Build a course card with a Row: icon on the left, Expanded title and subtitle in the middle, and a chevron icon on the right.' },
      { type: 'keypoints', items: ['Row lays out children horizontally.', 'Column lays out children vertically.', 'SizedBox adds fixed spacing.', 'Expanded lets a child take available space.'] }
    ]
  },
  {
    slug: 'flutter-container-box',
    title: 'Container, Padding, Margin & BoxDecoration',
    description: 'Use Flutter box widgets to add spacing, backgrounds, borders, and rounded corners.',
    level: 'beginner',
    section: 'Layout',
    order: 15,
    minutes: 12,
    content: [
      { type: 'p', text: 'Good UI needs space and shape. Flutter uses widgets such as Padding, Container, and DecoratedBox-style properties to control spacing, size, color, borders, and corners.' },
      { type: 'h2', text: 'Padding adds inner space' },
      {
        type: 'code',
        title: 'Padding around text',
        language: 'dart',
        code: `const Padding(
  padding: EdgeInsets.all(16),
  child: Text('This text has space around it.'),
)`
      },
      { type: 'h2', text: 'Container can size and decorate' },
      {
        type: 'code',
        title: 'Decorated note box',
        language: 'dart',
        code: `Container(
  margin: const EdgeInsets.all(16),
  padding: const EdgeInsets.all(20),
  decoration: BoxDecoration(
    color: Colors.indigo.shade50,
    borderRadius: BorderRadius.circular(16),
    border: Border.all(color: Colors.indigo.shade200),
  ),
  child: const Text('Remember to practice Flutter today.'),
)`
      },
      { type: 'h2', text: 'Padding vs margin' },
      {
        type: 'table',
        headers: ['Spacing', 'Meaning'],
        rows: [
          ['Padding', 'Space inside a box, between the border and child'],
          ['Margin', 'Space outside a box, between this widget and neighbors']
        ]
      },
      { type: 'h2', text: 'Build a polished card' },
      {
        type: 'code',
        title: 'Course highlight',
        language: 'dart',
        code: `Container(
  width: double.infinity,
  margin: const EdgeInsets.all(16),
  padding: const EdgeInsets.all(24),
  decoration: BoxDecoration(
    gradient: const LinearGradient(
      colors: [Colors.indigo, Colors.deepPurple],
    ),
    borderRadius: BorderRadius.circular(24),
  ),
  child: const Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        'Flutter Beginner Path',
        style: TextStyle(color: Colors.white, fontSize: 22),
      ),
      SizedBox(height: 8),
      Text(
        '25 lessons to build your foundation.',
        style: TextStyle(color: Colors.white70),
      ),
    ],
  ),
)`
      },
      { type: 'note', text: 'Container is convenient, but do not use it for everything. If you only need padding, Padding is clearer. If you only need spacing, SizedBox is clearer.' },
      { type: 'try', text: 'Create a reminder card with margin, padding, a light background color, rounded corners, and a border.' },
      { type: 'keypoints', items: ['Padding adds inner space.', 'Margin adds outer space.', 'Container can combine size, padding, margin, and decoration.', 'BoxDecoration can add color, border, radius, gradient, and shadow.'] }
    ]
  },
  {
    slug: 'flutter-stack-positioned',
    title: 'Stack & Positioned',
    description: 'Layer widgets on top of each other for badges, overlays, and custom layouts.',
    level: 'beginner',
    section: 'Layout',
    order: 16,
    minutes: 11,
    content: [
      { type: 'p', text: 'Most beginner layouts use Row and Column. Stack is different: it places widgets on top of each other. This is useful for badges, image overlays, and floating labels.' },
      { type: 'h2', text: 'A basic Stack' },
      {
        type: 'code',
        title: 'Layer text over an image',
        language: 'dart',
        code: `Stack(
  children: [
    Image.network(
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      height: 220,
      width: double.infinity,
      fit: BoxFit.cover,
    ),
    Container(
      height: 220,
      color: Colors.black38,
    ),
    const Positioned(
      left: 16,
      bottom: 16,
      child: Text(
        'Study anywhere',
        style: TextStyle(color: Colors.white, fontSize: 24),
      ),
    ),
  ],
)`
      },
      { type: 'h2', text: 'Positioned controls placement' },
      { type: 'p', text: 'Positioned only works as a direct child of Stack. It can place a child using left, right, top, and bottom values.' },
      {
        type: 'code',
        title: 'Notification badge',
        language: 'dart',
        code: `Stack(
  clipBehavior: Clip.none,
  children: [
    const Icon(Icons.notifications, size: 40),
    Positioned(
      right: -4,
      top: -4,
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: const BoxDecoration(
          color: Colors.red,
          shape: BoxShape.circle,
        ),
        child: const Text(
          '3',
          style: TextStyle(color: Colors.white, fontSize: 12),
        ),
      ),
    ),
  ],
)`
      },
      { type: 'h2', text: 'Stack order matters' },
      { type: 'p', text: 'Children are painted in order. The first child is at the back, and later children appear on top.' },
      { type: 'tip', text: 'Use Stack for intentional layers. If you only need normal vertical or horizontal layout, Row and Column are easier to maintain.' },
      { type: 'try', text: 'Create a profile avatar with a small green online-status circle positioned at the bottom right.' },
      { type: 'keypoints', items: ['Stack layers children on top of each other.', 'Later children appear above earlier children.', 'Positioned places a Stack child using edges.', 'Stack is useful for badges, overlays, and custom visual effects.'] }
    ]
  },
  {
    slug: 'flutter-listview',
    title: 'ListView & ListTile',
    description: 'Display scrollable lists with beginner-friendly ListView and ListTile patterns.',
    level: 'beginner',
    section: 'Lists & Grids',
    order: 17,
    minutes: 12,
    content: [
      { type: 'p', text: 'Many apps show lists: notes, messages, products, lessons, songs, or settings. ListView creates a scrollable list, and ListTile gives you a clean row layout.' },
      { type: 'h2', text: 'A simple ListView' },
      {
        type: 'code',
        title: 'Static note list',
        language: 'dart',
        code: `ListView(
  children: const [
    ListTile(
      leading: Icon(Icons.note),
      title: Text('Grocery list'),
      subtitle: Text('Milk, bread, apples'),
    ),
    ListTile(
      leading: Icon(Icons.note),
      title: Text('Flutter ideas'),
      subtitle: Text('Build a notes app'),
    ),
  ],
)`
      },
      { type: 'h2', text: 'Build from data' },
      { type: 'p', text: 'When a list comes from data, ListView.builder is usually better. It builds rows as needed, which helps performance for long lists.' },
      {
        type: 'code',
        title: 'ListView.builder',
        language: 'dart',
        code: `final notes = [
  'Grocery list',
  'Flutter ideas',
  'Books to read',
  'Weekend plan',
];

ListView.builder(
  itemCount: notes.length,
  itemBuilder: (context, index) {
    return ListTile(
      leading: const Icon(Icons.note_alt_outlined),
      title: Text(notes[index]),
      trailing: const Icon(Icons.chevron_right),
    );
  },
)`
      },
      { type: 'h2', text: 'Add separators' },
      {
        type: 'code',
        title: 'ListView.separated',
        language: 'dart',
        code: `ListView.separated(
  itemCount: notes.length,
  separatorBuilder: (context, index) => const Divider(height: 1),
  itemBuilder: (context, index) {
    return ListTile(title: Text(notes[index]));
  },
)`
      },
      { type: 'note', text: 'A ListView wants available height. If you put it inside a Column, wrap it with Expanded so it knows how much space it can use.' },
      { type: 'try', text: 'Create a list of five course names and render them with ListView.builder. Add an icon on the left and a chevron on the right.' },
      { type: 'keypoints', items: ['ListView creates scrollable lists.', 'ListTile is a convenient row for common list items.', 'ListView.builder builds items from data.', 'Use Expanded when placing a ListView inside a Column.'] }
    ]
  },
  {
    slug: 'flutter-gridview',
    title: 'GridView',
    description: 'Display cards in rows and columns using GridView.',
    level: 'beginner',
    section: 'Lists & Grids',
    order: 18,
    minutes: 11,
    content: [
      { type: 'p', text: 'GridView displays items in a two-dimensional scrollable layout. It is useful for photo galleries, product cards, course tiles, and dashboards.' },
      { type: 'h2', text: 'A simple grid' },
      {
        type: 'code',
        title: 'Course grid',
        language: 'dart',
        code: `GridView.count(
  crossAxisCount: 2,
  padding: const EdgeInsets.all(16),
  crossAxisSpacing: 12,
  mainAxisSpacing: 12,
  children: const [
    CourseTile(title: 'Flutter', icon: Icons.phone_android),
    CourseTile(title: 'Dart', icon: Icons.code),
    CourseTile(title: 'Firebase', icon: Icons.cloud),
    CourseTile(title: 'Design', icon: Icons.palette),
  ],
)`
      },
      { type: 'h2', text: 'Create a reusable tile' },
      {
        type: 'code',
        title: 'CourseTile widget',
        language: 'dart',
        code: `class CourseTile extends StatelessWidget {
  final String title;
  final IconData icon;

  const CourseTile({
    super.key,
    required this.title,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: () {},
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40),
            const SizedBox(height: 12),
            Text(title),
          ],
        ),
      ),
    );
  }
}`
      },
      { type: 'h2', text: 'GridView.builder for data' },
      {
        type: 'code',
        title: 'Build many grid items',
        language: 'dart',
        code: `GridView.builder(
  padding: const EdgeInsets.all(16),
  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    crossAxisSpacing: 12,
    mainAxisSpacing: 12,
  ),
  itemCount: courses.length,
  itemBuilder: (context, index) {
    return CourseTile(
      title: courses[index],
      icon: Icons.school,
    );
  },
)`
      },
      {
        type: 'table',
        headers: ['Property', 'Meaning'],
        rows: [
          ['crossAxisCount', 'How many items fit across the grid'],
          ['crossAxisSpacing', 'Space between columns'],
          ['mainAxisSpacing', 'Space between rows'],
          ['childAspectRatio', 'Width-to-height ratio for each tile']
        ]
      },
      { type: 'tip', text: 'On narrow phones, two columns often works well. On tablets, you may increase the column count later with responsive layout.' },
      { type: 'try', text: 'Build a 2-column grid of six shop categories. Each tile should have an icon, title, and tap handler.' },
      { type: 'keypoints', items: ['GridView displays scrollable rows and columns.', 'GridView.count is simple for fixed grids.', 'GridView.builder is useful for data-driven grids.', 'Spacing and aspect ratio control the feel of each tile.'] }
    ]
  },
  {
    slug: 'flutter-forms-textfields',
    title: 'Forms & TextFields',
    description: 'Collect user input with TextField, TextEditingController, and Form.',
    level: 'beginner',
    section: 'Input',
    order: 19,
    minutes: 13,
    content: [
      { type: 'p', text: 'Forms let users type information into your app. A notes app might ask for a title and body. A profile app might ask for a name and bio.' },
      { type: 'h2', text: 'Start with TextField' },
      {
        type: 'code',
        title: 'Simple TextField',
        language: 'dart',
        code: `const TextField(
  decoration: InputDecoration(
    labelText: 'Note title',
    hintText: 'Enter a short title',
    border: OutlineInputBorder(),
  ),
)`
      },
      { type: 'h2', text: 'Read typed text with a controller' },
      { type: 'p', text: 'A TextEditingController stores and controls the current text. Because controllers hold resources, dispose them in a StatefulWidget.' },
      {
        type: 'code',
        title: 'lib/main.dart',
        language: 'dart',
        code: `class NewNoteScreen extends StatefulWidget {
  const NewNoteScreen({super.key});

  @override
  State<NewNoteScreen> createState() => _NewNoteScreenState();
}

class _NewNoteScreenState extends State<NewNoteScreen> {
  final titleController = TextEditingController();

  @override
  void dispose() {
    titleController.dispose();
    super.dispose();
  }

  void saveNote() {
    final title = titleController.text;
    print('Saving: $title');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('New Note')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: titleController,
              decoration: const InputDecoration(
                labelText: 'Title',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: saveNote,
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
  }
}`
      },
      { type: 'h2', text: 'Form groups fields' },
      {
        type: 'code',
        title: 'Form skeleton',
        language: 'dart',
        code: `Form(
  child: Column(
    children: const [
      TextField(
        decoration: InputDecoration(labelText: 'Name'),
      ),
      SizedBox(height: 12),
      TextField(
        decoration: InputDecoration(labelText: 'Email'),
      ),
    ],
  ),
)`
      },
      { type: 'note', text: 'TextField is fine for simple input. TextFormField adds validation support and works closely with Form, which you will use in the next lesson.' },
      { type: 'try', text: 'Create a NewProfileScreen with controllers for name and bio. Add a button that prints both values.' },
      { type: 'keypoints', items: ['TextField collects text input.', 'InputDecoration adds labels, hints, and borders.', 'TextEditingController lets you read and control text.', 'Dispose controllers when the State object is removed.'] }
    ]
  },
  {
    slug: 'flutter-validation',
    title: 'Form Validation Basics',
    description: 'Use Form, TextFormField, validators, and GlobalKey to check input before saving.',
    level: 'beginner',
    section: 'Input',
    order: 20,
    minutes: 14,
    content: [
      { type: 'p', text: 'Validation checks whether user input is acceptable. A note title may be required, an email should look like an email, and a password may need a minimum length.' },
      { type: 'h2', text: 'Form validation pattern' },
      { type: 'p', text: 'A Form uses a key so you can ask it to validate all fields. TextFormField has a validator function that returns an error message or null when the value is valid.' },
      {
        type: 'code',
        title: 'Validated note form',
        language: 'dart',
        code: `class NoteFormScreen extends StatefulWidget {
  const NoteFormScreen({super.key});

  @override
  State<NoteFormScreen> createState() => _NoteFormScreenState();
}

class _NoteFormScreenState extends State<NoteFormScreen> {
  final formKey = GlobalKey<FormState>();
  final titleController = TextEditingController();

  @override
  void dispose() {
    titleController.dispose();
    super.dispose();
  }

  void save() {
    final isValid = formKey.currentState!.validate();

    if (!isValid) {
      return;
    }

    print('Saved note: \${titleController.text}');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Validate Note')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: formKey,
          child: Column(
            children: [
              TextFormField(
                controller: titleController,
                decoration: const InputDecoration(
                  labelText: 'Title',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please enter a title';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: save,
                child: const Text('Save'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`
      },
      { type: 'h2', text: 'Validator return values' },
      {
        type: 'table',
        headers: ['Return value', 'Meaning'],
        rows: [
          ['null', 'The field is valid'],
          ['A string', 'The field is invalid and the string appears as the error message']
        ]
      },
      { type: 'h2', text: 'Email validation example' },
      {
        type: 'code',
        title: 'Simple email validator',
        language: 'dart',
        code: `validator: (value) {
  if (value == null || value.trim().isEmpty) {
    return 'Email is required';
  }

  if (!value.contains('@')) {
    return 'Enter a valid email';
  }

  return null;
}`
      },
      { type: 'tip', text: 'Keep validation messages specific and friendly. A helpful message tells the user exactly what to fix.' },
      { type: 'warning', text: 'The ! after currentState tells Dart the value is not null. In this common Form pattern, the key is attached before validation. In other nullable situations, prefer explicit checks.' },
      { type: 'try', text: 'Add a bio field that is optional but cannot be longer than 120 characters when filled in.' },
      { type: 'keypoints', items: ['Form groups fields for validation.', 'TextFormField supports validator functions.', 'Return null when input is valid.', 'Use a GlobalKey<FormState> to call validate on the form.'] }
    ]
  },
  {
    slug: 'flutter-navigation',
    title: 'Navigator & Routes',
    description: 'Move between screens with Navigator.push and Navigator.pop.',
    level: 'beginner',
    section: 'Navigation',
    order: 21,
    minutes: 13,
    content: [
      { type: 'p', text: 'Most apps have more than one screen. Navigation is how users move from a list to details, from home to settings, or from login to profile.' },
      { type: 'h2', text: 'Push a new screen' },
      { type: 'p', text: 'Navigator.push places a new route on top of the navigation stack. MaterialPageRoute creates a platform-friendly route transition for Material apps.' },
      {
        type: 'code',
        title: 'Open a details screen',
        language: 'dart',
        code: `ElevatedButton(
  onPressed: () {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const DetailsScreen(),
      ),
    );
  },
  child: const Text('Open details'),
)`
      },
      { type: 'h2', text: 'Create the destination screen' },
      {
        type: 'code',
        title: 'DetailsScreen',
        language: 'dart',
        code: `class DetailsScreen extends StatelessWidget {
  const DetailsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Details')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('Go back'),
        ),
      ),
    );
  }
}`
      },
      { type: 'h2', text: 'Navigation stack' },
      {
        type: 'table',
        headers: ['Action', 'What happens'],
        rows: [
          ['push', 'Adds a new screen on top'],
          ['pop', 'Removes the current screen and returns to the previous one'],
          ['Back button', 'Usually pops the current route automatically']
        ]
      },
      { type: 'h2', text: 'Named routes preview' },
      {
        type: 'code',
        title: 'Simple named routes',
        language: 'dart',
        code: `MaterialApp(
  initialRoute: '/',
  routes: {
    '/': (context) => const HomeScreen(),
    '/settings': (context) => const SettingsScreen(),
  },
)

Navigator.pushNamed(context, '/settings');`
      },
      { type: 'note', text: 'For beginners, Navigator.push with MaterialPageRoute is very clear because you can see exactly which screen is opening.' },
      { type: 'try', text: 'Create a HomeScreen with a button that opens a SettingsScreen. Add a button on SettingsScreen that pops back to HomeScreen.' },
      { type: 'keypoints', items: ['Navigator manages a stack of screens.', 'push opens a new screen.', 'pop goes back to the previous screen.', 'MaterialPageRoute is a common beginner route type in Material apps.'] }
    ]
  },
  {
    slug: 'flutter-pass-data',
    title: 'Passing Data Between Screens',
    description: 'Send values to another screen and return results back to the previous screen.',
    level: 'beginner',
    section: 'Navigation',
    order: 22,
    minutes: 14,
    content: [
      { type: 'p', text: 'Navigation becomes more useful when screens share data. A notes list can pass the selected note title to a details screen. A form screen can return a new note to the list.' },
      { type: 'h2', text: 'Pass data through a constructor' },
      {
        type: 'code',
        title: 'Note details screen',
        language: 'dart',
        code: `class NoteDetailsScreen extends StatelessWidget {
  final String title;
  final String body;

  const NoteDetailsScreen({
    super.key,
    required this.title,
    required this.body,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Text(body),
      ),
    );
  }
}`
      },
      {
        type: 'code',
        title: 'Open with data',
        language: 'dart',
        code: `ListTile(
  title: const Text('Grocery list'),
  subtitle: const Text('Milk, bread, apples'),
  onTap: () {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const NoteDetailsScreen(
          title: 'Grocery list',
          body: 'Milk, bread, apples',
        ),
      ),
    );
  },
)`
      },
      { type: 'h2', text: 'Return data with pop' },
      { type: 'p', text: 'Navigator.pop can send a result back. The previous screen can await Navigator.push and receive that result.' },
      {
        type: 'code',
        title: 'Return a new note title',
        language: 'dart',
        code: `ElevatedButton(
  onPressed: () {
    Navigator.pop(context, 'New note from form');
  },
  child: const Text('Save'),
)`
      },
      {
        type: 'code',
        title: 'Await the result',
        language: 'dart',
        code: `Future<void> openNewNoteScreen() async {
  final newTitle = await Navigator.push<String>(
    context,
    MaterialPageRoute(
      builder: (context) => const NewNoteScreen(),
    ),
  );

  if (newTitle != null) {
    setState(() {
      notes.add(newTitle);
    });
  }
}`
      },
      { type: 'note', text: 'The await keyword pauses this function until the pushed screen pops. This is a practical first use of async in navigation.' },
      { type: 'try', text: 'Pass a course title into a CourseDetailsScreen. Then create a second screen that returns a selected difficulty such as "Beginner".' },
      { type: 'keypoints', items: ['Constructor parameters are a clear way to pass data forward.', 'Navigator.pop can return data backward.', 'await Navigator.push waits for the destination screen to close.', 'Returned values are often nullable because the user may go back without choosing anything.'] }
    ]
  },
  {
    slug: 'flutter-themes-assets',
    title: 'Themes, Colors, Fonts & Assets',
    description: 'Polish a Flutter app with Material 3 themes, colors, fonts, and declared assets.',
    level: 'beginner',
    section: 'App Polish',
    order: 23,
    minutes: 14,
    content: [
      { type: 'p', text: 'Polish makes an app feel consistent. Flutter themes let you define colors and styles once, then reuse them across screens and widgets.' },
      { type: 'h2', text: 'Use a Material 3 theme' },
      {
        type: 'code',
        title: 'lib/main.dart',
        language: 'dart',
        code: `MaterialApp(
  theme: ThemeData(
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.deepPurple,
    ),
    useMaterial3: true,
  ),
  home: const HomeScreen(),
)`
      },
      { type: 'h2', text: 'Read theme values inside widgets' },
      {
        type: 'code',
        title: 'Theme in a widget',
        language: 'dart',
        code: `final theme = Theme.of(context);

Text(
  'Featured course',
  style: theme.textTheme.headlineSmall?.copyWith(
    color: theme.colorScheme.primary,
    fontWeight: FontWeight.bold,
  ),
)`
      },
      { type: 'h2', text: 'Declare image assets' },
      {
        type: 'code',
        title: 'pubspec.yaml',
        language: 'yaml',
        code: `flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/app_icon.png`
      },
      { type: 'h2', text: 'Declare fonts' },
      {
        type: 'code',
        title: 'pubspec.yaml',
        language: 'yaml',
        code: `flutter:
  fonts:
    - family: Inter
      fonts:
        - asset: assets/fonts/Inter-Regular.ttf
        - asset: assets/fonts/Inter-Bold.ttf
          weight: 700`
      },
      {
        type: 'code',
        title: 'Use the font in a theme',
        language: 'dart',
        code: `ThemeData(
  colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
  useMaterial3: true,
  fontFamily: 'Inter',
)`
      },
      { type: 'tip', text: 'Prefer theme styles for repeated design choices. Use one-off TextStyle values only when a widget truly needs a unique style.' },
      { type: 'warning', text: 'YAML indentation must be exact. If Flutter cannot find an asset or font, check spelling, folder location, and spaces in pubspec.yaml.' },
      { type: 'try', text: 'Create a theme with a seed color you like. Add one image asset folder and display an image from it on a home screen.' },
      { type: 'keypoints', items: ['ThemeData stores app-wide visual choices.', 'ColorScheme.fromSeed is a Material 3-friendly way to build colors.', 'Assets and fonts must be declared in pubspec.yaml.', 'Theme.of(context) reads theme values inside widgets.'] }
    ]
  },
  {
    slug: 'flutter-material-cupertino',
    title: 'Material & Cupertino',
    description: 'Understand Flutter design systems and when to use Material or Cupertino widgets.',
    level: 'beginner',
    section: 'App Polish',
    order: 24,
    minutes: 11,
    content: [
      { type: 'p', text: 'Flutter includes widgets for different design styles. Material widgets follow Google\'s Material Design. Cupertino widgets follow many iOS-style patterns.' },
      { type: 'h2', text: 'Material apps' },
      { type: 'p', text: 'Most beginners start with Material because MaterialApp, Scaffold, AppBar, buttons, themes, forms, and navigation are well documented and work across platforms.' },
      {
        type: 'code',
        title: 'Material starter',
        language: 'dart',
        code: `import 'package:flutter/material.dart';

void main() {
  runApp(
    MaterialApp(
      theme: ThemeData(useMaterial3: true),
      home: const Scaffold(
        body: Center(
          child: Text('Material app'),
        ),
      ),
    ),
  );
}`
      },
      { type: 'h2', text: 'Cupertino widgets' },
      {
        type: 'code',
        title: 'Cupertino starter',
        language: 'dart',
        code: `import 'package:flutter/cupertino.dart';

void main() {
  runApp(
    const CupertinoApp(
      home: CupertinoPageScaffold(
        navigationBar: CupertinoNavigationBar(
          middle: Text('Cupertino app'),
        ),
        child: Center(
          child: Text('Hello iOS style'),
        ),
      ),
    ),
  );
}`
      },
      { type: 'h2', text: 'Choosing a style' },
      {
        type: 'table',
        headers: ['Choice', 'Good for'],
        rows: [
          ['Material', 'Most cross-platform apps, Android-friendly UI, fastest beginner path'],
          ['Cupertino', 'iOS-style screens or controls'],
          ['Mixed', 'Apps that use mostly Material with selected iOS-style widgets where appropriate']
        ]
      },
      { type: 'h2', text: 'Mix carefully' },
      {
        type: 'code',
        title: 'Use a Cupertino switch in a Material screen',
        language: 'dart',
        code: `CupertinoSwitch(
  value: notificationsEnabled,
  onChanged: (value) {
    setState(() {
      notificationsEnabled = value;
    });
  },
)`
      },
      { type: 'note', text: 'This beginner path uses Material 3 for most examples because it is consistent, modern, and beginner friendly.' },
      { type: 'try', text: 'Compare a Material Switch and a CupertinoSwitch in a settings row. Which style better fits the app you want to build?' },
      { type: 'keypoints', items: ['Material widgets follow Material Design.', 'Cupertino widgets follow iOS-style patterns.', 'MaterialApp is the common beginner starting point.', 'You can mix styles, but keep the app experience consistent.'] }
    ]
  },
  {
    slug: 'flutter-responsive-basics',
    title: 'Responsive UI Basics',
    description: 'Build layouts that adapt to different screen widths using MediaQuery, LayoutBuilder, Wrap, and flexible widgets.',
    level: 'beginner',
    section: 'App Polish',
    order: 25,
    minutes: 15,
    content: [
      { type: 'p', text: 'Flutter can run on many screen sizes, from small phones to tablets, desktops, and web browsers. Responsive UI means your layout adapts instead of breaking or feeling cramped.' },
      { type: 'h2', text: 'Use flexible layout first' },
      { type: 'p', text: 'Before adding complex breakpoints, use Row, Column, Expanded, Flexible, Wrap, and scroll views well. Many beginner overflow problems are solved with these basics.' },
      {
        type: 'code',
        title: 'Wrap chips to the next line',
        language: 'dart',
        code: `Wrap(
  spacing: 8,
  runSpacing: 8,
  children: const [
    Chip(label: Text('Flutter')),
    Chip(label: Text('Dart')),
    Chip(label: Text('Widgets')),
    Chip(label: Text('State')),
  ],
)`
      },
      { type: 'h2', text: 'Read screen size with MediaQuery' },
      {
        type: 'code',
        title: 'MediaQuery width check',
        language: 'dart',
        code: `final width = MediaQuery.sizeOf(context).width;
final isWide = width >= 700;

Text(isWide ? 'Wide layout' : 'Compact layout')`
      },
      { type: 'h2', text: 'Use LayoutBuilder for local constraints' },
      { type: 'p', text: 'MediaQuery reads the whole screen. LayoutBuilder reads the space available to this part of the UI, which is often more accurate for reusable widgets.' },
      {
        type: 'code',
        title: 'Responsive course section',
        language: 'dart',
        code: `LayoutBuilder(
  builder: (context, constraints) {
    final isWide = constraints.maxWidth >= 700;

    final courseList = Expanded(
      child: ListView(
        children: const [
          ListTile(title: Text('Flutter Basics')),
          ListTile(title: Text('Layouts')),
          ListTile(title: Text('Navigation')),
        ],
      ),
    );

    final details = Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Text(
            isWide
                ? 'Details can sit beside the list.'
                : 'Details can appear below the list.',
          ),
        ),
      ),
    );

    if (isWide) {
      return Row(children: [courseList, details]);
    }

    return Column(children: [courseList, details]);
  },
)`
      },
      { type: 'h2', text: 'Responsive thinking' },
      {
        type: 'table',
        headers: ['Question', 'Example decision'],
        rows: [
          ['Is the screen narrow?', 'Use one column and larger tap targets'],
          ['Is the screen wide?', 'Place list and details side by side'],
          ['Can text grow?', 'Use Expanded, Flexible, or wrapping'],
          ['Can content exceed height?', 'Use a scrollable widget']
        ]
      },
      { type: 'tip', text: 'Test responsive layouts by resizing a desktop or web window, rotating an emulator, and trying larger text settings.' },
      { type: 'try', text: 'Create a dashboard that shows cards in a single Column on narrow screens and a two-column GridView on wider screens.' },
      { type: 'keypoints', items: ['Responsive UI adapts to different screen sizes.', 'Flexible widgets solve many layout issues before breakpoints are needed.', 'MediaQuery reads screen information.', 'LayoutBuilder reacts to the space available to one widget.'] }
    ]
  }
];
