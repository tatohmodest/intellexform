import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'flutter-architecture',
    title: 'App Architecture (feature-first / clean-ish)',
    description:
      'Structure a Flutter app so features, data access, state, and UI stay understandable as the project grows.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 49,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Architecture is how your app remains easy to change after the first exciting week. A small demo can keep everything in one file. A real app needs a predictable place for screens, state, repositories, models, services, tests, and app wiring.',
      },
      {
        type: 'p',
        text: 'A practical Flutter architecture is often feature-first with clean-ish boundaries. Feature-first means files are grouped by product area. Clean-ish means the UI does not know HTTP details, storage details, or platform details unless it truly owns them.',
      },
      { type: 'h2', text: 'The goal' },
      {
        type: 'ul',
        items: [
          'Screens should describe UI and user intent.',
          'Controllers, not widgets, should coordinate loading, saving, and errors.',
          'Repositories should hide where data comes from.',
          'Models should make invalid data harder to pass around.',
          'App wiring should be centralized so dependencies do not appear randomly.',
        ],
      },
      { type: 'h2', text: 'A feature-first folder structure' },
      {
        type: 'code',
        language: 'text',
        title: 'Suggested lib/ layout',
        code: `lib/
  main.dart
  app/
    app.dart
    router.dart
    theme.dart
  core/
    errors/
      app_error.dart
    networking/
      api_client.dart
    storage/
      secure_store.dart
  features/
    auth/
      data/
        auth_repository.dart
        auth_remote_data_source.dart
      domain/
        app_user.dart
      presentation/
        auth_controller.dart
        sign_in_page.dart
    courses/
      data/
        course_repository.dart
        course_remote_data_source.dart
      domain/
        course.dart
      presentation/
        course_list_page.dart
        course_detail_page.dart`,
      },
      {
        type: 'p',
        text: 'This structure does not force you into a giant enterprise pattern. It simply keeps each feature self-contained while sharing app-wide utilities through core and app folders.',
      },
      { type: 'h2', text: 'Keep widgets focused' },
      {
        type: 'code',
        language: 'dart',
        title: 'Widget receives state and callbacks',
        code: `class CourseCard extends StatelessWidget {
  const CourseCard({
    super.key,
    required this.title,
    required this.lessonCount,
    required this.onTap,
  });

  final String title;
  final int lessonCount;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(title),
        subtitle: Text('$lessonCount lessons'),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}`,
      },
      {
        type: 'tip',
        text: 'Reusable widgets are easiest to test and preview when they accept plain values and callbacks instead of reaching into global state directly.',
      },
      { type: 'h2', text: 'Use repositories at feature boundaries' },
      {
        type: 'code',
        language: 'dart',
        title: 'Repository hides HTTP implementation',
        code: `class Course {
  const Course({
    required this.id,
    required this.title,
    required this.lessonCount,
  });

  final String id;
  final String title;
  final int lessonCount;
}

abstract class CourseRepository {
  Future<List<Course>> fetchCourses();
}

class ApiCourseRepository implements CourseRepository {
  ApiCourseRepository(this._client);

  final ApiClient _client;

  @override
  Future<List<Course>> fetchCourses() async {
    final data = await _client.getJson('/courses') as List<dynamic>;

    return data.map((item) {
      final json = item as Map<String, dynamic>;
      return Course(
        id: json['id'] as String,
        title: json['title'] as String,
        lessonCount: json['lessonCount'] as int,
      );
    }).toList();
  }
}`,
      },
      { type: 'h2', text: 'Keep business decisions out of random buttons' },
      {
        type: 'p',
        text: 'When a button starts network requests, modifies cached data, catches errors, shows snack bars, navigates, and updates several widgets, the screen becomes hard to maintain. Move the coordination into a controller, notifier, cubit, bloc, or view model.',
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Controller coordinates a feature',
        code: `class CourseListState {
  const CourseListState({
    this.isLoading = false,
    this.courses = const [],
    this.errorMessage,
  });

  final bool isLoading;
  final List<Course> courses;
  final String? errorMessage;

  CourseListState copyWith({
    bool? isLoading,
    List<Course>? courses,
    String? errorMessage,
  }) {
    return CourseListState(
      isLoading: isLoading ?? this.isLoading,
      courses: courses ?? this.courses,
      errorMessage: errorMessage,
    );
  }
}

class CourseListController extends ChangeNotifier {
  CourseListController(this._repository);

  final CourseRepository _repository;
  CourseListState state = const CourseListState();

  Future<void> load() async {
    state = state.copyWith(isLoading: true);
    notifyListeners();

    try {
      final courses = await _repository.fetchCourses();
      state = CourseListState(courses: courses);
    } catch (_) {
      state = const CourseListState(
        errorMessage: 'Could not load courses. Try again.',
      );
    }

    notifyListeners();
  }
}`,
      },
      {
        type: 'warning',
        text: 'Architecture should reduce confusion, not add ceremony. If a feature is one local form, you probably do not need five layers. If a feature talks to APIs, caches data, and has multiple screens, stronger boundaries pay off quickly.',
      },
      {
        type: 'keypoints',
        items: [
          'Prefer feature-first folders for apps with many product areas.',
          'Keep UI, state coordination, data access, and app wiring separate.',
          'Use repositories to hide API, database, or cache details.',
          'Avoid architecture that is bigger than the problem.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-state-strategy',
    title: 'State Strategy: setState, Provider, Riverpod, Bloc',
    description:
      'Choose the right state tool for local UI, shared app state, async data, and large workflows.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 50,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'You do not need a separate Dart course to make good state decisions. By now you know variables, classes, async functions, streams, null safety, and callbacks in the context where they matter: Flutter apps. The advanced skill is choosing the smallest state tool that keeps the feature clear.',
      },
      {
        type: 'p',
        text: 'State is simply data that can change and cause UI to update. The real question is scope: who owns the state, who reads it, who changes it, and how long it should live.',
      },
      { type: 'h2', text: 'State decision table' },
      {
        type: 'table',
        headers: ['Use case', 'Good choice', 'Why'],
        rows: [
          ['Text field visibility, selected tab, animation toggle', 'setState', 'Local to one widget and easy to reset'],
          ['Theme, auth user, app settings', 'Provider or Riverpod', 'Shared across multiple screens'],
          ['Network data with loading/error states', 'Riverpod, Provider controller, or Bloc', 'Needs lifecycle and testable transitions'],
          ['Large event-driven flows', 'Bloc/Cubit', 'Explicit events, states, and predictable testing'],
        ],
      },
      { type: 'h2', text: 'Local state: use setState first' },
      {
        type: 'code',
        language: 'dart',
        title: 'Local UI state',
        code: `class PasswordField extends StatefulWidget {
  const PasswordField({super.key});

  @override
  State<PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<PasswordField> {
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    return TextField(
      obscureText: _obscureText,
      decoration: InputDecoration(
        labelText: 'Password',
        suffixIcon: IconButton(
          icon: Icon(
            _obscureText ? Icons.visibility : Icons.visibility_off,
          ),
          onPressed: () {
            setState(() {
              _obscureText = !_obscureText;
            });
          },
        ),
      ),
    );
  }
}`,
      },
      {
        type: 'tip',
        text: 'If only one widget cares and the state disappears when that widget is removed, setState is often the most readable answer.',
      },
      { type: 'h2', text: 'Provider: simple app-wide objects' },
      {
        type: 'code',
        language: 'dart',
        title: 'Provider with ChangeNotifier',
        code: `class ThemeController extends ChangeNotifier {
  ThemeMode mode = ThemeMode.system;

  void useDarkMode(bool value) {
    mode = value ? ThemeMode.dark : ThemeMode.light;
    notifyListeners();
  }
}

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => ThemeController(),
      child: const MyApp(),
    ),
  );
}

class ThemeSwitch extends StatelessWidget {
  const ThemeSwitch({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<ThemeController>();

    return SwitchListTile(
      title: const Text('Dark mode'),
      value: controller.mode == ThemeMode.dark,
      onChanged: controller.useDarkMode,
    );
  }
}`,
      },
      { type: 'h2', text: 'Riverpod: testable dependency graph' },
      {
        type: 'code',
        language: 'dart',
        title: 'Riverpod async state',
        code: `final courseRepositoryProvider = Provider<CourseRepository>((ref) {
  return ApiCourseRepository(ref.watch(apiClientProvider));
});

final coursesProvider = FutureProvider<List<Course>>((ref) {
  return ref.watch(courseRepositoryProvider).fetchCourses();
});

class CourseList extends ConsumerWidget {
  const CourseList({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final courses = ref.watch(coursesProvider);

    return courses.when(
      data: (items) => ListView.builder(
        itemCount: items.length,
        itemBuilder: (context, index) => ListTile(
          title: Text(items[index].title),
        ),
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stackTrace) => Text('Could not load courses: $error'),
    );
  }
}`,
      },
      {
        type: 'p',
        text: 'Riverpod works well when you want dependencies, caching, async values, and testing without depending on BuildContext for reads.',
      },
      { type: 'h2', text: 'Bloc: explicit events and states' },
      {
        type: 'code',
        language: 'dart',
        title: 'Bloc shape for complex flows',
        code: `sealed class CheckoutEvent {}

class CheckoutStarted extends CheckoutEvent {}

class PaymentSubmitted extends CheckoutEvent {
  PaymentSubmitted(this.token);

  final String token;
}

sealed class CheckoutState {}

class CheckoutIdle extends CheckoutState {}

class CheckoutLoading extends CheckoutState {}

class CheckoutSuccess extends CheckoutState {}

class CheckoutFailure extends CheckoutState {
  CheckoutFailure(this.message);

  final String message;
}

class CheckoutBloc extends Bloc<CheckoutEvent, CheckoutState> {
  CheckoutBloc(this._orders) : super(CheckoutIdle()) {
    on<PaymentSubmitted>(_submitPayment);
  }

  final OrderRepository _orders;

  Future<void> _submitPayment(
    PaymentSubmitted event,
    Emitter<CheckoutState> emit,
  ) async {
    emit(CheckoutLoading());
    try {
      await _orders.pay(event.token);
      emit(CheckoutSuccess());
    } catch (_) {
      emit(CheckoutFailure('Payment failed. Please try again.'));
    }
  }
}`,
      },
      {
        type: 'warning',
        text: 'Do not move every boolean into global state. Global state can create hidden coupling. Start local, lift state only when multiple widgets or screens need the same source of truth.',
      },
      {
        type: 'keypoints',
        items: [
          'Use setState for short-lived state owned by one widget.',
          'Use Provider or Riverpod for app-wide state and dependency access.',
          'Use Bloc/Cubit when explicit event-to-state transitions make a feature easier to reason about.',
          'The payoff of learning Dart inside Flutter is knowing exactly when local state becomes app-wide state.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-dependency-injection',
    title: 'Dependency Injection & App Wiring',
    description:
      'Wire repositories, services, clients, and configuration without hard-coding dependencies inside widgets.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 51,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Dependency injection means objects receive the things they need instead of creating them secretly. In Flutter, it keeps widgets testable, makes environments easier to configure, and prevents the app from becoming a pile of static singletons.',
      },
      { type: 'h2', text: 'Bad smell: creating infrastructure in widgets' },
      {
        type: 'code',
        language: 'dart',
        title: 'Hard to test and replace',
        code: `class CoursePage extends StatelessWidget {
  const CoursePage({super.key});

  @override
  Widget build(BuildContext context) {
    final repository = ApiCourseRepository(
      ApiClient(baseUrl: 'https://api.example.com'),
    );

    return FutureBuilder(
      future: repository.fetchCourses(),
      builder: (context, snapshot) {
        return const Text('...');
      },
    );
  }
}`,
      },
      {
        type: 'p',
        text: 'This widget knows the API URL, client class, repository class, and loading strategy. Replacing the API in tests or using a staging server becomes awkward.',
      },
      { type: 'h2', text: 'Inject through constructors' },
      {
        type: 'code',
        language: 'dart',
        title: 'Constructor injection',
        code: `class CourseController extends ChangeNotifier {
  CourseController(this._repository);

  final CourseRepository _repository;

  bool isLoading = false;
  List<Course> courses = const [];

  Future<void> load() async {
    isLoading = true;
    notifyListeners();
    courses = await _repository.fetchCourses();
    isLoading = false;
    notifyListeners();
  }
}`,
      },
      {
        type: 'tip',
        text: 'Constructor injection is boring in the best way. You can pass a fake repository in tests and a real repository in production.',
      },
      { type: 'h2', text: 'Centralize app wiring' },
      {
        type: 'code',
        language: 'dart',
        title: 'Manual composition root',
        code: `class AppDependencies {
  AppDependencies._({
    required this.apiClient,
    required this.courseRepository,
  });

  final ApiClient apiClient;
  final CourseRepository courseRepository;

  factory AppDependencies.production() {
    final apiClient = ApiClient(
      baseUrl: const String.fromEnvironment(
        'API_BASE_URL',
        defaultValue: 'https://api.example.com',
      ),
    );

    return AppDependencies._(
      apiClient: apiClient,
      courseRepository: ApiCourseRepository(apiClient),
    );
  }
}

void main() {
  final dependencies = AppDependencies.production();
  runApp(MyApp(dependencies: dependencies));
}`,
      },
      { type: 'h2', text: 'Expose dependencies with Provider' },
      {
        type: 'code',
        language: 'dart',
        title: 'Provider-based wiring',
        code: `class MyApp extends StatelessWidget {
  const MyApp({super.key, required this.dependencies});

  final AppDependencies dependencies;

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<ApiClient>.value(value: dependencies.apiClient),
        Provider<CourseRepository>.value(
          value: dependencies.courseRepository,
        ),
      ],
      child: MaterialApp(
        title: 'Intellex Courses',
        home: const CourseListPage(),
      ),
    );
  }
}`,
      },
      { type: 'h2', text: 'Use compile-time environment values' },
      {
        type: 'code',
        language: 'bash',
        title: 'Pass configuration at build time',
        code: `flutter run --dart-define=API_BASE_URL=https://staging-api.example.com
flutter build apk --release --dart-define=API_BASE_URL=https://api.example.com`,
      },
      {
        type: 'warning',
        text: 'Do not put secrets in --dart-define for mobile apps. Anything shipped inside the app can be extracted. Use server-side secrets, short-lived tokens, or platform-protected storage for sensitive values.',
      },
      {
        type: 'keypoints',
        items: [
          'Create dependencies at app startup, not deep inside widgets.',
          'Pass abstractions such as CourseRepository into controllers.',
          'Use Provider, Riverpod, get_it, or manual constructors consistently.',
          'Treat app wiring as production code, not setup clutter.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-performance',
    title: 'Performance, rebuilds & DevTools',
    description:
      'Find slow frames, reduce unnecessary rebuilds, and use Flutter DevTools like a production engineer.',
    level: 'advanced',
    section: 'Performance',
    order: 52,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Flutter is fast when each frame has a reasonable amount of work. Performance problems usually come from too much work during build, expensive painting, large images, heavy synchronous computation, or repeated work that could be cached.',
      },
      {
        type: 'p',
        text: 'The target is smooth frames. On a 60 Hz display, your app has about 16 ms to build, layout, paint, and hand work to the GPU. On 120 Hz screens, the budget is even smaller.',
      },
      { type: 'h2', text: 'Use DevTools before guessing' },
      {
        type: 'ol',
        items: [
          'Run the app in profile mode on a physical device when possible.',
          'Open Flutter DevTools from your IDE or terminal.',
          'Use the Performance tab to find janky frames.',
          'Use the Widget rebuild tracker to find excessive rebuilds.',
          'Use the Memory tab when lists, images, or caches grow unexpectedly.',
        ],
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Run in profile mode',
        code: `flutter run --profile
flutter pub global activate devtools
dart devtools`,
      },
      { type: 'h2', text: 'Reduce rebuild work' },
      {
        type: 'code',
        language: 'dart',
        title: 'Split widgets and use const where possible',
        code: `class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      appBar: AppBar(title: Text('Dashboard')),
      body: Column(
        children: [
          AccountSummary(),
          Expanded(child: RecentActivityList()),
        ],
      ),
    );
  }
}

class AccountSummary extends StatelessWidget {
  const AccountSummary({super.key});

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Text('Welcome back'),
      ),
    );
  }
}`,
      },
      {
        type: 'p',
        text: 'const widgets are not magic, but they help Flutter reuse immutable widget instances. More importantly, smaller widgets make it easier to rebuild only the part of the tree that depends on changing state.',
      },
      { type: 'h2', text: 'Build lists lazily' },
      {
        type: 'code',
        language: 'dart',
        title: 'Lazy list builder',
        code: `class MessagesList extends StatelessWidget {
  const MessagesList({super.key, required this.messages});

  final List<Message> messages;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: messages.length,
      itemBuilder: (context, index) {
        final message = messages[index];
        return ListTile(
          key: ValueKey(message.id),
          title: Text(message.sender),
          subtitle: Text(message.preview),
        );
      },
    );
  }
}`,
      },
      { type: 'h2', text: 'Avoid expensive work in build' },
      {
        type: 'code',
        language: 'dart',
        title: 'Cache derived data outside build',
        code: `class SearchResultsPage extends StatefulWidget {
  const SearchResultsPage({super.key, required this.items});

  final List<Product> items;

  @override
  State<SearchResultsPage> createState() => _SearchResultsPageState();
}

class _SearchResultsPageState extends State<SearchResultsPage> {
  String _query = '';
  List<Product> _visibleItems = const [];

  @override
  void initState() {
    super.initState();
    _visibleItems = widget.items;
  }

  void _updateQuery(String value) {
    setState(() {
      _query = value;
      _visibleItems = widget.items
          .where((item) => item.name.toLowerCase().contains(_query.toLowerCase()))
          .toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(onChanged: _updateQuery),
        Expanded(child: ProductList(items: _visibleItems)),
      ],
    );
  }
}`,
      },
      {
        type: 'warning',
        text: 'Do not optimize blindly. A rebuild is not automatically bad. A slow frame is bad. Measure first, then make the smallest change that removes the bottleneck.',
      },
      { type: 'h2', text: 'Common performance checklist' },
      {
        type: 'ul',
        items: [
          'Use image sizes that match the display size.',
          'Prefer ListView.builder or SliverList for long lists.',
          'Keep synchronous work out of build methods.',
          'Use RepaintBoundary around expensive independent painting when DevTools shows paint cost.',
          'Dispose controllers, streams, and animations.',
          'Test on slower real devices, not only an emulator.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Profile mode gives more realistic performance data than debug mode.',
          'Smooth apps control build, layout, paint, memory, and async work.',
          'Small widgets and lazy lists help keep frames under budget.',
          'DevTools should guide performance decisions.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-isolates',
    title: 'Isolates & Heavy Work',
    description:
      'Move CPU-heavy parsing, compression, and calculations off the UI isolate so the app stays responsive.',
    level: 'advanced',
    section: 'Performance',
    order: 53,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Flutter UI runs on an isolate. If you block that isolate with large JSON parsing, image processing, encryption, or complex calculations, the app cannot draw frames on time. The result is stutter, frozen buttons, and poor perceived quality.',
      },
      {
        type: 'p',
        text: 'An isolate is a separate Dart execution context with its own memory. Isolates communicate by sending messages, not by sharing normal objects directly.',
      },
      { type: 'h2', text: 'Use compute for simple one-off work' },
      {
        type: 'code',
        language: 'dart',
        title: 'Parse large JSON outside the UI isolate',
        code: `import 'dart:convert';

import 'package:flutter/foundation.dart';

class Course {
  const Course({required this.id, required this.title});

  final String id;
  final String title;
}

List<Course> parseCourses(String source) {
  final decoded = jsonDecode(source) as List<dynamic>;
  return decoded.map((item) {
    final json = item as Map<String, dynamic>;
    return Course(
      id: json['id'] as String,
      title: json['title'] as String,
    );
  }).toList();
}

Future<List<Course>> loadCourses(String responseBody) {
  return compute(parseCourses, responseBody);
}`,
      },
      {
        type: 'note',
        text: 'The function passed to compute must be a top-level or static function. Avoid capturing BuildContext, controllers, or open sockets.',
      },
      { type: 'h2', text: 'When compute is not enough' },
      {
        type: 'p',
        text: 'Use a long-lived isolate when work is repeated, has progress updates, or must stay alive for a batch of operations. Spawning isolates has overhead, so do not create one for tiny tasks.',
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Spawn an isolate for repeated work',
        code: `import 'dart:isolate';

class WorkerRequest {
  WorkerRequest(this.input, this.replyTo);

  final int input;
  final SendPort replyTo;
}

void workerMain(SendPort sendPort) {
  final receivePort = ReceivePort();
  sendPort.send(receivePort.sendPort);

  receivePort.listen((message) {
    final request = message as WorkerRequest;
    final result = request.input * request.input;
    request.replyTo.send(result);
  });
}

Future<int> squareInWorker(int value) async {
  final readyPort = ReceivePort();
  await Isolate.spawn(workerMain, readyPort.sendPort);

  final workerSendPort = await readyPort.first as SendPort;
  final responsePort = ReceivePort();

  workerSendPort.send(WorkerRequest(value, responsePort.sendPort));
  return await responsePort.first as int;
}`,
      },
      { type: 'h2', text: 'Good isolate candidates' },
      {
        type: 'ul',
        items: [
          'Parsing very large JSON responses.',
          'Importing CSV or local database seed files.',
          'Image processing or thumbnail generation.',
          'Encryption, hashing, or compression.',
          'Complex calculations that take more than a few milliseconds.',
        ],
      },
      {
        type: 'warning',
        text: 'Isolates are not a fix for slow network requests. Async I/O already frees the UI isolate while waiting. Use isolates for CPU-heavy work, not for ordinary HTTP calls.',
      },
      {
        type: 'keypoints',
        items: [
          'The UI isolate must stay free to draw frames.',
          'Use compute for simple one-off CPU work.',
          'Use long-lived isolates for repeated heavy work or progress updates.',
          'Only send data that can cross isolate boundaries.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-platform-channels',
    title: 'Platform Channels Intro',
    description:
      'Call Android and iOS native APIs from Flutter when a plugin does not already solve the problem.',
    level: 'advanced',
    section: 'Platform Power',
    order: 54,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Most Flutter apps should use existing plugins for camera, location, permissions, payments, maps, and notifications. Platform channels are for the moments when you need a native SDK or device capability that is not covered by a plugin.',
      },
      { type: 'h2', text: 'The shape of a method channel' },
      {
        type: 'code',
        language: 'dart',
        title: 'Flutter side',
        code: `import 'package:flutter/services.dart';

class BatteryService {
  static const _channel = MethodChannel('com.intellex.app/battery');

  Future<int> getBatteryLevel() async {
    final level = await _channel.invokeMethod<int>('getBatteryLevel');
    if (level == null) {
      throw StateError('Battery level was not returned');
    }
    return level;
  }
}`,
      },
      {
        type: 'p',
        text: 'The channel name must match on both sides. Use a reverse-domain style name to avoid collisions with plugins or other app modules.',
      },
      { type: 'h2', text: 'Android native side concept' },
      {
        type: 'code',
        language: 'text',
        title: 'Android wiring idea',
        code: `1. Open android/app/src/main/kotlin/.../MainActivity.kt
2. Create a MethodChannel with the same name.
3. Listen for getBatteryLevel.
4. Read the Android BatteryManager.
5. Return success(level) or error(code, message, details).`,
      },
      { type: 'h2', text: 'iOS native side concept' },
      {
        type: 'code',
        language: 'text',
        title: 'iOS wiring idea',
        code: `1. Open ios/Runner/AppDelegate.swift.
2. Create a FlutterMethodChannel with the same name.
3. Listen for getBatteryLevel.
4. Enable battery monitoring through UIDevice.
5. Return the integer level or a FlutterError.`,
      },
      { type: 'h2', text: 'Handle failure in Dart' },
      {
        type: 'code',
        language: 'dart',
        title: 'Graceful platform failure',
        code: `Future<String> readBatteryLabel(BatteryService service) async {
  try {
    final level = await service.getBatteryLevel();
    return 'Battery: $level%';
  } on PlatformException catch (error) {
    return 'Battery unavailable: \${error.message ?? error.code}';
  } on MissingPluginException {
    return 'Battery unavailable on this platform';
  }
}`,
      },
      {
        type: 'warning',
        text: 'Platform channels create native maintenance work. Before writing one, check whether a maintained plugin exists and whether the platform feature is allowed by store policies.',
      },
      {
        type: 'keypoints',
        items: [
          'Use plugins first, platform channels second.',
          'MethodChannel is useful for request-response calls.',
          'Keep platform APIs behind a Dart service class.',
          'Always handle PlatformException and unsupported platforms.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-deeplinks',
    title: 'Deep Links & App Links',
    description:
      'Open specific app screens from URLs, emails, notifications, QR codes, and verified web links.',
    level: 'advanced',
    section: 'Platform Power',
    order: 55,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Deep links let a URL open your app directly to a screen such as a course, order, reset-password page, or invite. Real apps use them for onboarding, marketing campaigns, notifications, support links, and sharing.',
      },
      {
        type: 'p',
        text: 'There are two common styles: custom schemes such as intellex://courses/flutter, and verified links such as https://example.com/courses/flutter. Verified Android App Links and iOS Universal Links are better for production because the operating system can prove your app owns the domain.',
      },
      { type: 'h2', text: 'Design URLs like public API' },
      {
        type: 'ul',
        items: [
          'Use stable paths: /courses/flutter instead of /screen/42.',
          'Handle missing or deleted content gracefully.',
          'Do not put secrets or long-lived tokens in URLs.',
          'Support links from cold start and while the app is already open.',
          'Track attribution without breaking privacy expectations.',
        ],
      },
      { type: 'h2', text: 'Route from a link' },
      {
        type: 'code',
        language: 'dart',
        title: 'Parse a link into a route intent',
        code: `sealed class LinkIntent {}

class CourseLinkIntent extends LinkIntent {
  CourseLinkIntent(this.slug);

  final String slug;
}

class UnknownLinkIntent extends LinkIntent {}

LinkIntent parseLink(Uri uri) {
  if (uri.pathSegments.length == 2 && uri.pathSegments.first == 'courses') {
    return CourseLinkIntent(uri.pathSegments[1]);
  }

  return UnknownLinkIntent();
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Use an intent with Navigator',
        code: `void openLink(BuildContext context, Uri uri) {
  final intent = parseLink(uri);

  switch (intent) {
    case CourseLinkIntent(:final slug):
      Navigator.of(context).pushNamed('/courses/detail', arguments: slug);
    case UnknownLinkIntent():
      Navigator.of(context).pushNamed('/not-found');
  }
}`,
      },
      { type: 'h2', text: 'Android App Links checklist' },
      {
        type: 'code',
        language: 'json',
        title: 'assetlinks.json concept',
        code: `[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.example.intellex",
      "sha256_cert_fingerprints": [
        "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
      ]
    }
  }
]`,
      },
      { type: 'h2', text: 'iOS Universal Links checklist' },
      {
        type: 'code',
        language: 'json',
        title: 'apple-app-site-association concept',
        code: `{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appIDs": ["TEAMID.com.example.intellex"],
        "components": [
          { "/": "/courses/*" },
          { "/": "/reset-password/*" }
        ]
      }
    ]
  }
}`,
      },
      {
        type: 'warning',
        text: 'Deep links are part of your security surface. Validate IDs on the server, expire sensitive actions, and never assume a link came from a trusted source.',
      },
      {
        type: 'keypoints',
        items: [
          'Prefer verified web links for production sharing.',
          'Parse URLs into app intents before navigating.',
          'Support cold start and warm app link handling.',
          'Keep sensitive data out of links.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-i18n',
    title: 'Internationalization (l10n)',
    description:
      'Prepare a Flutter app for multiple languages, plural rules, date formats, and right-to-left layouts.',
    level: 'advanced',
    section: 'Polish & Quality',
    order: 56,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Internationalization is the engineering work that makes localization possible. Localization is the translated text and regional formatting. Real apps should not scatter user-facing strings across widgets after they begin shipping.',
      },
      { type: 'h2', text: 'Enable generated localizations' },
      {
        type: 'code',
        language: 'yaml',
        title: 'pubspec.yaml',
        code: `dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  intl: any

flutter:
  generate: true`,
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'l10n.yaml',
        code: `arb-dir: lib/l10n
template-arb-file: app_en.arb
output-localization-file: app_localizations.dart
nullable-getter: false`,
      },
      { type: 'h2', text: 'Create ARB translation files' },
      {
        type: 'code',
        language: 'json',
        title: 'lib/l10n/app_en.arb',
        code: `{
  "@@locale": "en",
  "appTitle": "Intellex",
  "courseCount": "{count, plural, =0{No courses} =1{1 course} other{{count} courses}}",
  "@courseCount": {
    "placeholders": {
      "count": {
        "type": "int"
      }
    }
  }
}`,
      },
      {
        type: 'code',
        language: 'json',
        title: 'lib/l10n/app_es.arb',
        code: `{
  "@@locale": "es",
  "appTitle": "Intellex",
  "courseCount": "{count, plural, =0{No hay cursos} =1{1 curso} other{{count} cursos}}"
}`,
      },
      { type: 'h2', text: 'Use localizations in MaterialApp' },
      {
        type: 'code',
        language: 'dart',
        title: 'MaterialApp localization setup',
        code: `import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Intellex',
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      home: const CourseHomePage(),
    );
  }
}

class CourseHomePage extends StatelessWidget {
  const CourseHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(title: Text(l10n.appTitle)),
      body: Center(child: Text(l10n.courseCount(12))),
    );
  }
}`,
      },
      { type: 'h2', text: 'Design for changing text length' },
      {
        type: 'ul',
        items: [
          'Avoid fixed-width text containers unless the design truly requires them.',
          'Test long strings, short strings, and right-to-left languages.',
          'Use plural/select messages instead of building sentences with string concatenation.',
          'Format dates, times, currency, and numbers for the locale.',
          'Keep placeholders clear for translators.',
        ],
      },
      {
        type: 'warning',
        text: 'Do not concatenate localized fragments like "Hello " + name + "!". Word order changes across languages. Use one message with placeholders.',
      },
      {
        type: 'keypoints',
        items: [
          'Use ARB files and generated localizations for production apps.',
          'Pluralization and placeholders are essential, not optional polish.',
          'Test layouts with longer translations and right-to-left text.',
          'Keep user-facing strings out of random widget code.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-accessibility',
    title: 'Accessibility Essentials',
    description:
      'Build Flutter screens that work with screen readers, large text, keyboard navigation, contrast, and touch targets.',
    level: 'advanced',
    section: 'Polish & Quality',
    order: 57,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Accessibility is not a separate version of your app. It is the quality of the real app for people using screen readers, larger text, keyboard navigation, switch devices, reduced motion, or high contrast settings.',
      },
      { type: 'h2', text: 'Start with semantic widgets' },
      {
        type: 'p',
        text: 'Flutter Material widgets already expose many accessibility semantics. Prefer Button, TextField, Checkbox, Switch, Slider, ListTile, and IconButton before building custom gesture-only controls.',
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Icon button with a screen reader label',
        code: `IconButton(
  tooltip: 'Save course',
  icon: const Icon(Icons.bookmark_border),
  onPressed: saveCourse,
)`,
      },
      { type: 'h2', text: 'Add Semantics for custom UI' },
      {
        type: 'code',
        language: 'dart',
        title: 'Custom tappable card semantics',
        code: `Semantics(
  button: true,
  label: 'Open Flutter architecture lesson',
  child: InkWell(
    onTap: openLesson,
    borderRadius: BorderRadius.circular(16),
    child: const Padding(
      padding: EdgeInsets.all(16),
      child: Text('App Architecture'),
    ),
  ),
)`,
      },
      {
        type: 'warning',
        text: 'A GestureDetector around a Container may look clickable but can be invisible to assistive technologies. Use InkWell, buttons, or Semantics when building custom interactions.',
      },
      { type: 'h2', text: 'Respect text scaling' },
      {
        type: 'code',
        language: 'dart',
        title: 'Avoid clipping large text',
        code: `class CourseHeader extends StatelessWidget {
  const CourseHeader({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Text(
        title,
        style: Theme.of(context).textTheme.headlineMedium,
        softWrap: true,
      ),
    );
  }
}`,
      },
      { type: 'h2', text: 'Use focus and keyboard support' },
      {
        type: 'code',
        language: 'dart',
        title: 'Keyboard-activatable action',
        code: `FocusableActionDetector(
  shortcuts: const {
    SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
    SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
  },
  actions: {
    ActivateIntent: CallbackAction<ActivateIntent>(
      onInvoke: (_) {
        openLesson();
        return null;
      },
    ),
  },
  child: ListTile(
    title: const Text('Open lesson'),
    onTap: openLesson,
  ),
)`,
      },
      { type: 'h2', text: 'Production accessibility checklist' },
      {
        type: 'ul',
        items: [
          'Touch targets should be large enough, commonly at least 48 by 48 logical pixels.',
          'Text should remain readable with large system text settings.',
          'Important images need labels; decorative images should not create noise.',
          'Color should not be the only way to communicate state.',
          'Forms need labels, useful errors, and predictable focus order.',
          'Test with TalkBack on Android and VoiceOver on iOS.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Accessibility starts with normal widgets and clear labels.',
          'Custom controls need explicit semantics.',
          'Large text and keyboard navigation are real app requirements.',
          'Manual device testing catches problems automated checks miss.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-ci-cd',
    title: 'CI/CD & Release Mindset',
    description:
      'Automate formatting, analysis, tests, builds, versioning, and release checks before shipping Flutter apps.',
    level: 'advanced',
    section: 'Shipping',
    order: 58,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Shipping is a system. CI/CD helps you prove the app still builds, tests still pass, and release artifacts are produced the same way every time. The goal is not just automation; the goal is confidence.',
      },
      { type: 'h2', text: 'Minimum CI checks' },
      {
        type: 'code',
        language: 'bash',
        title: 'Local release gate',
        code: `flutter pub get
dart format --set-exit-if-changed .
flutter analyze
flutter test
flutter build apk --release`,
      },
      {
        type: 'p',
        text: 'Run the same commands locally before pushing a release branch. CI should catch mistakes, but developers should know how to reproduce failures on their own machines.',
      },
      { type: 'h2', text: 'Example GitHub Actions workflow' },
      {
        type: 'code',
        language: 'yaml',
        title: '.github/workflows/flutter-ci.yml',
        code: `name: Flutter CI

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: subosito/flutter-action@v2
        with:
          channel: stable
          cache: true

      - run: flutter pub get
      - run: dart format --set-exit-if-changed .
      - run: flutter analyze
      - run: flutter test`,
      },
      { type: 'h2', text: 'Version like a product' },
      {
        type: 'code',
        language: 'yaml',
        title: 'pubspec.yaml version',
        code: `version: 1.4.0+27`,
      },
      {
        type: 'p',
        text: 'The first part is the user-facing version name. The number after + is the build number. Stores require build numbers to increase for each uploaded artifact.',
      },
      { type: 'h2', text: 'Protect secrets and signing keys' },
      {
        type: 'ul',
        items: [
          'Keep signing keys out of source control.',
          'Use CI secret storage for passwords, service account files, and keychain values.',
          'Restrict who can trigger production release workflows.',
          'Rotate credentials when team members or vendors change.',
          'Log enough to debug failures without printing secrets.',
        ],
      },
      { type: 'h2', text: 'Release checklist' },
      {
        type: 'ol',
        items: [
          'Update app version and build number.',
          'Run format, analyze, tests, and release build.',
          'Review crash reporting, analytics, and feature flags.',
          'Check permissions, privacy text, screenshots, and store metadata.',
          'Upload to internal testing first.',
          'Promote gradually and monitor crashes, reviews, and server metrics.',
        ],
      },
      {
        type: 'warning',
        text: 'A release pipeline that only builds is incomplete. Real release readiness includes signing, privacy, rollout strategy, rollback thinking, and observability.',
      },
      {
        type: 'keypoints',
        items: [
          'CI should run the same quality gates developers can run locally.',
          'Release artifacts need repeatable signing and versioning.',
          'Secrets belong in CI secret storage, not Git.',
          'Shipping includes monitoring after the upload succeeds.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-play-store',
    title: 'Publish to Google Play',
    description:
      'Prepare Android signing, app bundles, store listing assets, testing tracks, and rollout decisions for Google Play.',
    level: 'advanced',
    section: 'Shipping',
    order: 59,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Publishing to Google Play is more than running a build command. You need a stable package name, signing setup, privacy answers, quality checks, store assets, and a rollout plan.',
      },
      { type: 'h2', text: 'Set the app identity early' },
      {
        type: 'p',
        text: 'Your Android applicationId is the permanent package name in Play Console. Changing it later means publishing a different app. Choose a reverse-domain value such as com.company.product.',
      },
      {
        type: 'code',
        language: 'text',
        title: 'Android files to review',
        code: `android/app/build.gradle
  applicationId "com.example.intellex"
  versionCode flutterVersionCode
  versionName flutterVersionName

android/app/src/main/AndroidManifest.xml
  permissions
  deep link intent filters
  app label
  exported activities`,
      },
      { type: 'h2', text: 'Create a release app bundle' },
      {
        type: 'code',
        language: 'bash',
        title: 'Android release build',
        code: `flutter clean
flutter pub get
flutter test
flutter build appbundle --release`,
      },
      {
        type: 'p',
        text: 'Google Play expects Android App Bundles for most new apps. The output is usually in build/app/outputs/bundle/release/app-release.aab.',
      },
      { type: 'h2', text: 'Signing checklist' },
      {
        type: 'ol',
        items: [
          'Generate or obtain the upload key.',
          'Store key files and passwords securely.',
          'Configure signing in android/key.properties and Gradle.',
          'Enroll in Play App Signing.',
          'Back up the upload key information in a secure team vault.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        title: 'Do not commit key.properties',
        code: `storePassword=...
keyPassword=...
keyAlias=upload
storeFile=/secure/path/upload-keystore.jks`,
      },
      { type: 'h2', text: 'Store listing essentials' },
      {
        type: 'ul',
        items: [
          'App name, short description, and full description.',
          'High-quality icon, feature graphic, screenshots, and optional video.',
          'Privacy policy URL when required.',
          'Data safety form with accurate collection and sharing details.',
          'Content rating questionnaire.',
          'Target audience and ads declarations.',
        ],
      },
      { type: 'h2', text: 'Use testing tracks' },
      {
        type: 'p',
        text: 'Upload first to internal testing, then closed or open testing if needed. Fix install, login, payment, permission, and crash issues before production rollout.',
      },
      {
        type: 'warning',
        text: 'Do not request permissions you do not need. Permissions affect user trust, Play review, privacy forms, and conversion rates.',
      },
      {
        type: 'keypoints',
        items: [
          'The Android package name is a long-term identity decision.',
          'Build app bundles for Play releases.',
          'Signing keys must be protected and backed up.',
          'Use internal testing before production rollout.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-app-store',
    title: 'Publish to App Store',
    description:
      'Prepare iOS signing, bundle IDs, archives, TestFlight, App Store metadata, and review readiness.',
    level: 'advanced',
    section: 'Shipping',
    order: 60,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Publishing to the App Store requires Apple Developer Program access, a stable bundle identifier, signing certificates, provisioning, App Store Connect metadata, and review compliance.',
      },
      { type: 'h2', text: 'Set the bundle identifier' },
      {
        type: 'code',
        language: 'text',
        title: 'iOS identity places',
        code: `ios/Runner.xcodeproj
  PRODUCT_BUNDLE_IDENTIFIER = com.example.intellex

ios/Runner/Info.plist
  Display name
  Permission descriptions
  URL schemes
  Supported orientations`,
      },
      {
        type: 'p',
        text: 'The bundle identifier connects your app to signing, capabilities, push notifications, Universal Links, and App Store Connect. Treat it as permanent.',
      },
      { type: 'h2', text: 'Build and archive' },
      {
        type: 'code',
        language: 'bash',
        title: 'Flutter iOS release preparation',
        code: `flutter clean
flutter pub get
flutter test
flutter build ipa --release`,
      },
      {
        type: 'note',
        text: 'Many teams archive and upload from Xcode or CI tools such as fastlane. The important idea is the same: a signed release artifact is uploaded to App Store Connect.',
      },
      { type: 'h2', text: 'Info.plist privacy strings' },
      {
        type: 'code',
        language: 'text',
        title: 'Examples of permission text',
        code: `NSCameraUsageDescription
  Intellex uses the camera so you can upload a profile photo.

NSPhotoLibraryUsageDescription
  Intellex lets you choose images from your library for course notes.

NSLocationWhenInUseUsageDescription
  Intellex uses location to show nearby learning events.`,
      },
      {
        type: 'warning',
        text: 'Vague permission descriptions can fail review and reduce user trust. Explain the feature benefit in plain language.',
      },
      { type: 'h2', text: 'TestFlight flow' },
      {
        type: 'ol',
        items: [
          'Upload a signed build to App Store Connect.',
          'Wait for processing to complete.',
          'Add internal testers first.',
          'Fix launch, login, purchase, and permission issues.',
          'Add external testers if you need broader validation.',
          'Submit the production version for review.',
        ],
      },
      { type: 'h2', text: 'Review readiness' },
      {
        type: 'ul',
        items: [
          'Provide demo credentials when review needs login.',
          'Make paid features, subscriptions, and account deletion clear.',
          'Ensure privacy policy and data collection answers are accurate.',
          'Avoid hidden features that require undocumented gestures.',
          'Handle no-network, denied permission, and empty data states.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'iOS shipping depends on bundle ID, signing, capabilities, and metadata.',
          'TestFlight is the normal path before App Store review.',
          'Permission descriptions must be specific and user-focused.',
          'Review can fail for policy, privacy, payment, or broken flows.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-project-todo',
    title: 'Mini Project: Todo App',
    description:
      'Build a polished local Todo app with feature-first folders, local state, validation, filtering, and persistence-ready structure.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 61,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project turns architecture and state strategy into a small shippable feature. You will build a Todo app that uses local state first, separates model and UI files, and leaves a clean path for persistence later.',
      },
      { type: 'h2', text: 'What you will build' },
      {
        type: 'ul',
        items: [
          'A list of todos with completed and active states.',
          'A form to add new todos.',
          'Filters for all, active, and completed items.',
          'A folder structure that can grow into storage or sync.',
          'Accessible list actions and empty states.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the project' },
      {
        type: 'code',
        language: 'bash',
        title: 'Create and run',
        code: `flutter create intellex_todo
cd intellex_todo
flutter run`,
      },
      { type: 'h2', text: 'Step 2: Create folders' },
      {
        type: 'code',
        language: 'text',
        title: 'Project structure',
        code: `lib/
  main.dart
  features/
    todos/
      domain/
        todo.dart
      presentation/
        todo_filter.dart
        todo_home_page.dart
        todo_input.dart
        todo_list.dart`,
      },
      { type: 'h2', text: 'Step 3: Add the model' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/todos/domain/todo.dart',
        code: `class Todo {
  const Todo({
    required this.id,
    required this.title,
    this.isDone = false,
  });

  final String id;
  final String title;
  final bool isDone;

  Todo copyWith({
    String? id,
    String? title,
    bool? isDone,
  }) {
    return Todo(
      id: id ?? this.id,
      title: title ?? this.title,
      isDone: isDone ?? this.isDone,
    );
  }
}`,
      },
      { type: 'h2', text: 'Step 4: Add filter values' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/todos/presentation/todo_filter.dart',
        code: `enum TodoFilter {
  all,
  active,
  completed,
}

extension TodoFilterLabel on TodoFilter {
  String get label {
    switch (this) {
      case TodoFilter.all:
        return 'All';
      case TodoFilter.active:
        return 'Active';
      case TodoFilter.completed:
        return 'Completed';
    }
  }
}`,
      },
      { type: 'h2', text: 'Step 5: Build the input widget' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/todos/presentation/todo_input.dart',
        code: `import 'package:flutter/material.dart';

class TodoInput extends StatefulWidget {
  const TodoInput({super.key, required this.onSubmitted});

  final ValueChanged<String> onSubmitted;

  @override
  State<TodoInput> createState() => _TodoInputState();
}

class _TodoInputState extends State<TodoInput> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submit() {
    final title = _controller.text.trim();
    if (title.isEmpty) {
      return;
    }

    widget.onSubmitted(title);
    _controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: _controller,
            decoration: const InputDecoration(
              labelText: 'New todo',
              border: OutlineInputBorder(),
            ),
            onSubmitted: (_) => _submit(),
          ),
        ),
        const SizedBox(width: 8),
        FilledButton(
          onPressed: _submit,
          child: const Text('Add'),
        ),
      ],
    );
  }
}`,
      },
      { type: 'h2', text: 'Step 6: Build the list widget' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/todos/presentation/todo_list.dart',
        code: `import 'package:flutter/material.dart';

import '../domain/todo.dart';

class TodoList extends StatelessWidget {
  const TodoList({
    super.key,
    required this.todos,
    required this.onToggle,
    required this.onDelete,
  });

  final List<Todo> todos;
  final ValueChanged<String> onToggle;
  final ValueChanged<String> onDelete;

  @override
  Widget build(BuildContext context) {
    if (todos.isEmpty) {
      return const Center(
        child: Text('No todos match this filter.'),
      );
    }

    return ListView.separated(
      itemCount: todos.length,
      separatorBuilder: (_, __) => const Divider(height: 1),
      itemBuilder: (context, index) {
        final todo = todos[index];

        return CheckboxListTile(
          key: ValueKey(todo.id),
          value: todo.isDone,
          title: Text(
            todo.title,
            style: TextStyle(
              decoration: todo.isDone ? TextDecoration.lineThrough : null,
            ),
          ),
          secondary: IconButton(
            tooltip: 'Delete todo',
            icon: const Icon(Icons.delete_outline),
            onPressed: () => onDelete(todo.id),
          ),
          onChanged: (_) => onToggle(todo.id),
        );
      },
    );
  }
}`,
      },
      { type: 'h2', text: 'Step 7: Compose the page' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/todos/presentation/todo_home_page.dart',
        code: `import 'package:flutter/material.dart';

import '../domain/todo.dart';
import 'todo_filter.dart';
import 'todo_input.dart';
import 'todo_list.dart';

class TodoHomePage extends StatefulWidget {
  const TodoHomePage({super.key});

  @override
  State<TodoHomePage> createState() => _TodoHomePageState();
}

class _TodoHomePageState extends State<TodoHomePage> {
  final List<Todo> _todos = [];
  TodoFilter _filter = TodoFilter.all;

  List<Todo> get _visibleTodos {
    switch (_filter) {
      case TodoFilter.all:
        return _todos;
      case TodoFilter.active:
        return _todos.where((todo) => !todo.isDone).toList();
      case TodoFilter.completed:
        return _todos.where((todo) => todo.isDone).toList();
    }
  }

  void _addTodo(String title) {
    setState(() {
      _todos.insert(
        0,
        Todo(
          id: DateTime.now().microsecondsSinceEpoch.toString(),
          title: title,
        ),
      );
    });
  }

  void _toggleTodo(String id) {
    setState(() {
      final index = _todos.indexWhere((todo) => todo.id == id);
      if (index == -1) {
        return;
      }
      final todo = _todos[index];
      _todos[index] = todo.copyWith(isDone: !todo.isDone);
    });
  }

  void _deleteTodo(String id) {
    setState(() {
      _todos.removeWhere((todo) => todo.id == id);
    });
  }

  @override
  Widget build(BuildContext context) {
    final visibleTodos = _visibleTodos;

    return Scaffold(
      appBar: AppBar(title: const Text('Intellex Todo')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TodoInput(onSubmitted: _addTodo),
            const SizedBox(height: 16),
            SegmentedButton<TodoFilter>(
              segments: TodoFilter.values
                  .map(
                    (filter) => ButtonSegment(
                      value: filter,
                      label: Text(filter.label),
                    ),
                  )
                  .toList(),
              selected: {_filter},
              onSelectionChanged: (selection) {
                setState(() {
                  _filter = selection.first;
                });
              },
            ),
            const SizedBox(height: 16),
            Expanded(
              child: TodoList(
                todos: visibleTodos,
                onToggle: _toggleTodo,
                onDelete: _deleteTodo,
              ),
            ),
          ],
        ),
      ),
    );
  }
}`,
      },
      { type: 'h2', text: 'Step 8: Replace main.dart' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/main.dart',
        code: `import 'package:flutter/material.dart';

import 'features/todos/presentation/todo_home_page.dart';

void main() {
  runApp(const TodoApp());
}

class TodoApp extends StatelessWidget {
  const TodoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Intellex Todo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const TodoHomePage(),
    );
  }
}`,
      },
      { type: 'h2', text: 'Step 9: Ship-minded improvements' },
      {
        type: 'ul',
        items: [
          'Persist todos with shared_preferences, Hive, Drift, or SQLite.',
          'Add undo after delete with ScaffoldMessenger.',
          'Move state to a controller when persistence or sync is added.',
          'Add widget tests for empty, active, completed, add, toggle, and delete flows.',
          'Add localization for all labels before publishing.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Local state is enough for this first version.',
          'Feature-first folders make the app easy to extend.',
          'Small widgets keep UI readable and testable.',
          'Persistence can be added behind the same Todo model later.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-project-api',
    title: 'Mini Project: API-powered Course Browser',
    description:
      'Build an API-backed Flutter course browser with models, repository boundaries, loading states, errors, and retry.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 62,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project practices the production pattern behind many apps: fetch data from an API, parse it into models, display loading and error states, and keep network code out of widgets.',
      },
      { type: 'h2', text: 'What you will build' },
      {
        type: 'ul',
        items: [
          'A course list screen loaded from a repository.',
          'A reusable API client.',
          'A typed Course model.',
          'Loading, error, empty, and retry states.',
          'A structure ready for caching or authentication later.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the app and add http' },
      {
        type: 'code',
        language: 'bash',
        title: 'Project setup',
        code: `flutter create course_browser
cd course_browser
flutter pub add http
flutter run`,
      },
      { type: 'h2', text: 'Step 2: Create folders' },
      {
        type: 'code',
        language: 'text',
        title: 'Project structure',
        code: `lib/
  main.dart
  core/
    networking/
      api_client.dart
  features/
    courses/
      data/
        course_repository.dart
      domain/
        course.dart
      presentation/
        course_browser_page.dart
        course_card.dart`,
      },
      { type: 'h2', text: 'Step 3: Add a model' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/courses/domain/course.dart',
        code: `class Course {
  const Course({
    required this.id,
    required this.title,
    required this.description,
    required this.level,
    required this.lessonCount,
  });

  final String id;
  final String title;
  final String description;
  final String level;
  final int lessonCount;

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      level: json['level'] as String,
      lessonCount: json['lessonCount'] as int,
    );
  }
}`,
      },
      { type: 'h2', text: 'Step 4: Add the API client' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/core/networking/api_client.dart',
        code: `import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiClient {
  ApiClient({
    required this.baseUrl,
    http.Client? httpClient,
  }) : _httpClient = httpClient ?? http.Client();

  final String baseUrl;
  final http.Client _httpClient;

  Future<dynamic> getJson(String path) async {
    final uri = Uri.parse('$baseUrl$path');
    final response = await _httpClient.get(uri);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiException(
        'Request failed with status \${response.statusCode}',
      );
    }

    return jsonDecode(response.body);
  }

  void close() {
    _httpClient.close();
  }
}

class ApiException implements Exception {
  ApiException(this.message);

  final String message;

  @override
  String toString() => message;
}`,
      },
      { type: 'h2', text: 'Step 5: Add the repository' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/courses/data/course_repository.dart',
        code: `import '../../../core/networking/api_client.dart';
import '../domain/course.dart';

class CourseRepository {
  CourseRepository(this._apiClient);

  final ApiClient _apiClient;

  Future<List<Course>> fetchCourses() async {
    final data = await _apiClient.getJson('/courses') as List<dynamic>;

    return data
        .map((item) => Course.fromJson(item as Map<String, dynamic>))
        .toList();
  }
}`,
      },
      { type: 'h2', text: 'Step 6: Create a reusable card' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/courses/presentation/course_card.dart',
        code: `import 'package:flutter/material.dart';

import '../domain/course.dart';

class CourseCard extends StatelessWidget {
  const CourseCard({super.key, required this.course});

  final Course course;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              course.title,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(course.description),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: [
                Chip(label: Text(course.level)),
                Chip(label: Text('\${course.lessonCount} lessons')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}`,
      },
      { type: 'h2', text: 'Step 7: Build the browser page' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/courses/presentation/course_browser_page.dart',
        code: `import 'package:flutter/material.dart';

import '../data/course_repository.dart';
import '../domain/course.dart';
import 'course_card.dart';

class CourseBrowserPage extends StatefulWidget {
  const CourseBrowserPage({super.key, required this.repository});

  final CourseRepository repository;

  @override
  State<CourseBrowserPage> createState() => _CourseBrowserPageState();
}

class _CourseBrowserPageState extends State<CourseBrowserPage> {
  late Future<List<Course>> _future;

  @override
  void initState() {
    super.initState();
    _future = widget.repository.fetchCourses();
  }

  void _retry() {
    setState(() {
      _future = widget.repository.fetchCourses();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Course Browser')),
      body: FutureBuilder<List<Course>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('Could not load courses.'),
                  const SizedBox(height: 8),
                  FilledButton(
                    onPressed: _retry,
                    child: const Text('Try again'),
                  ),
                ],
              ),
            );
          }

          final courses = snapshot.data ?? const [];
          if (courses.isEmpty) {
            return const Center(child: Text('No courses yet.'));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: courses.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              return CourseCard(course: courses[index]);
            },
          );
        },
      ),
    );
  }
}`,
      },
      { type: 'h2', text: 'Step 8: Wire dependencies in main.dart' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/main.dart',
        code: `import 'package:flutter/material.dart';

import 'core/networking/api_client.dart';
import 'features/courses/data/course_repository.dart';
import 'features/courses/presentation/course_browser_page.dart';

void main() {
  final apiClient = ApiClient(
    baseUrl: const String.fromEnvironment(
      'API_BASE_URL',
      defaultValue: 'https://example.com/api',
    ),
  );

  runApp(CourseBrowserApp(repository: CourseRepository(apiClient)));
}

class CourseBrowserApp extends StatelessWidget {
  const CourseBrowserApp({super.key, required this.repository});

  final CourseRepository repository;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Course Browser',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
        useMaterial3: true,
      ),
      home: CourseBrowserPage(repository: repository),
    );
  }
}`,
      },
      { type: 'h2', text: 'Step 9: Test with a real base URL' },
      {
        type: 'code',
        language: 'bash',
        title: 'Run with environment config',
        code: `flutter run --dart-define=API_BASE_URL=https://your-api.example.com`,
      },
      { type: 'h2', text: 'Step 10: Production upgrades' },
      {
        type: 'ul',
        items: [
          'Use generated JSON code for larger models.',
          'Add timeout handling and clearer error messages.',
          'Cache responses for offline reading.',
          'Add pull-to-refresh with RefreshIndicator.',
          'Move FutureBuilder state into Riverpod, Provider, or Bloc when more screens need the same data.',
          'Add integration tests with a fake HTTP client or local test server.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Keep API code out of widgets.',
          'Parse JSON into typed models before rendering.',
          'Show loading, error, empty, and data states.',
          'Wire environment-specific base URLs at startup.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-project-shop',
    title: 'Mini Project: Shop / Catalog App',
    description:
      'Build a catalog app with product cards, filters, cart state, derived totals, and a shipping-ready feature structure.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 63,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project combines UI composition, app-wide state, and architecture. You will build a small shop/catalog app with products and a cart. It is still small, but it uses the same ideas as larger commerce apps.',
      },
      { type: 'h2', text: 'What you will build' },
      {
        type: 'ul',
        items: [
          'A product catalog grid.',
          'Category filtering.',
          'A cart controller shared across screens.',
          'Derived cart totals.',
          'Clear folders for catalog and cart features.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the app' },
      {
        type: 'code',
        language: 'bash',
        title: 'Project setup',
        code: `flutter create shop_catalog
cd shop_catalog
flutter run`,
      },
      { type: 'h2', text: 'Step 2: Create folders' },
      {
        type: 'code',
        language: 'text',
        title: 'Project structure',
        code: `lib/
  main.dart
  features/
    catalog/
      data/
        sample_products.dart
      domain/
        product.dart
      presentation/
        catalog_page.dart
        product_card.dart
    cart/
      application/
        cart_controller.dart
      domain/
        cart_item.dart
      presentation/
        cart_page.dart`,
      },
      { type: 'h2', text: 'Step 3: Add product and sample data' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/catalog/domain/product.dart',
        code: `class Product {
  const Product({
    required this.id,
    required this.name,
    required this.category,
    required this.priceCents,
  });

  final String id;
  final String name;
  final String category;
  final int priceCents;

  String get priceLabel {
    final dollars = priceCents / 100;
    return '\$ \${dollars.toStringAsFixed(2)}';
  }
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/catalog/data/sample_products.dart',
        code: `import '../domain/product.dart';

const sampleProducts = [
  Product(
    id: 'flutter-pro',
    name: 'Flutter Pro Course',
    category: 'Courses',
    priceCents: 4900,
  ),
  Product(
    id: 'dart-pocket',
    name: 'Dart Pocket Guide',
    category: 'Books',
    priceCents: 1900,
  ),
  Product(
    id: 'ui-kit',
    name: 'Mobile UI Kit',
    category: 'Assets',
    priceCents: 2900,
  ),
];`,
      },
      { type: 'h2', text: 'Step 4: Add cart domain and controller' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/cart/domain/cart_item.dart',
        code: `import '../../catalog/domain/product.dart';

class CartItem {
  const CartItem({
    required this.product,
    required this.quantity,
  });

  final Product product;
  final int quantity;

  int get lineTotalCents => product.priceCents * quantity;

  CartItem copyWith({int? quantity}) {
    return CartItem(
      product: product,
      quantity: quantity ?? this.quantity,
    );
  }
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/cart/application/cart_controller.dart',
        code: `import 'package:flutter/foundation.dart';

import '../../catalog/domain/product.dart';
import '../domain/cart_item.dart';

class CartController extends ChangeNotifier {
  final Map<String, CartItem> _items = {};

  List<CartItem> get items => _items.values.toList(growable: false);

  int get itemCount {
    return _items.values.fold(0, (total, item) => total + item.quantity);
  }

  int get totalCents {
    return _items.values.fold(
      0,
      (total, item) => total + item.lineTotalCents,
    );
  }

  String get totalLabel {
    final dollars = totalCents / 100;
    return '\$ \${dollars.toStringAsFixed(2)}';
  }

  void add(Product product) {
    final existing = _items[product.id];
    if (existing == null) {
      _items[product.id] = CartItem(product: product, quantity: 1);
    } else {
      _items[product.id] = existing.copyWith(
        quantity: existing.quantity + 1,
      );
    }
    notifyListeners();
  }

  void removeOne(String productId) {
    final existing = _items[productId];
    if (existing == null) {
      return;
    }

    if (existing.quantity == 1) {
      _items.remove(productId);
    } else {
      _items[productId] = existing.copyWith(
        quantity: existing.quantity - 1,
      );
    }
    notifyListeners();
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }
}`,
      },
      { type: 'h2', text: 'Step 5: Build product cards' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/catalog/presentation/product_card.dart',
        code: `import 'package:flutter/material.dart';

import '../domain/product.dart';

class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.product,
    required this.onAddToCart,
  });

  final Product product;
  final VoidCallback onAddToCart;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              product.name,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const Spacer(),
            Text(product.category),
            const SizedBox(height: 8),
            Text(product.priceLabel),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: onAddToCart,
              child: const Text('Add to cart'),
            ),
          ],
        ),
      ),
    );
  }
}`,
      },
      { type: 'h2', text: 'Step 6: Build the catalog page' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/catalog/presentation/catalog_page.dart',
        code: `import 'package:flutter/material.dart';

import '../../cart/application/cart_controller.dart';
import '../../cart/presentation/cart_page.dart';
import '../data/sample_products.dart';
import 'product_card.dart';

class CatalogPage extends StatefulWidget {
  const CatalogPage({super.key, required this.cart});

  final CartController cart;

  @override
  State<CatalogPage> createState() => _CatalogPageState();
}

class _CatalogPageState extends State<CatalogPage> {
  String _category = 'All';

  List<String> get _categories {
    return ['All', ...sampleProducts.map((product) => product.category).toSet()];
  }

  @override
  Widget build(BuildContext context) {
    final products = _category == 'All'
        ? sampleProducts
        : sampleProducts
            .where((product) => product.category == _category)
            .toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Shop Catalog'),
        actions: [
          ListenableBuilder(
            listenable: widget.cart,
            builder: (context, _) {
              return TextButton.icon(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => CartPage(cart: widget.cart),
                    ),
                  );
                },
                icon: const Icon(Icons.shopping_cart_outlined),
                label: Text('\${widget.cart.itemCount}'),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          SizedBox(
            height: 56,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              scrollDirection: Axis.horizontal,
              itemCount: _categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final category = _categories[index];
                return ChoiceChip(
                  label: Text(category),
                  selected: category == _category,
                  onSelected: (_) {
                    setState(() {
                      _category = category;
                    });
                  },
                );
              },
            ),
          ),
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.82,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: products.length,
              itemBuilder: (context, index) {
                final product = products[index];
                return ProductCard(
                  product: product,
                  onAddToCart: () => widget.cart.add(product),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}`,
      },
      { type: 'h2', text: 'Step 7: Build the cart page' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/features/cart/presentation/cart_page.dart',
        code: `import 'package:flutter/material.dart';

import '../application/cart_controller.dart';

class CartPage extends StatelessWidget {
  const CartPage({super.key, required this.cart});

  final CartController cart;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cart')),
      body: ListenableBuilder(
        listenable: cart,
        builder: (context, _) {
          if (cart.items.isEmpty) {
            return const Center(child: Text('Your cart is empty.'));
          }

          return Column(
            children: [
              Expanded(
                child: ListView.separated(
                  itemCount: cart.items.length,
                  separatorBuilder: (_, __) => const Divider(height: 1),
                  itemBuilder: (context, index) {
                    final item = cart.items[index];
                    return ListTile(
                      title: Text(item.product.name),
                      subtitle: Text('Quantity: \${item.quantity}'),
                      trailing: IconButton(
                        tooltip: 'Remove one',
                        icon: const Icon(Icons.remove_circle_outline),
                        onPressed: () => cart.removeOne(item.product.id),
                      ),
                    );
                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        'Total: \${cart.totalLabel}',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ),
                    FilledButton(
                      onPressed: cart.clear,
                      child: const Text('Clear'),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}`,
      },
      { type: 'h2', text: 'Step 8: Wire main.dart' },
      {
        type: 'code',
        language: 'dart',
        title: 'lib/main.dart',
        code: `import 'package:flutter/material.dart';

import 'features/cart/application/cart_controller.dart';
import 'features/catalog/presentation/catalog_page.dart';

void main() {
  runApp(ShopApp(cart: CartController()));
}

class ShopApp extends StatelessWidget {
  const ShopApp({super.key, required this.cart});

  final CartController cart;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Shop Catalog',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
        useMaterial3: true,
      ),
      home: CatalogPage(cart: cart),
    );
  }
}`,
      },
      { type: 'h2', text: 'Step 9: Production upgrades' },
      {
        type: 'ul',
        items: [
          'Load products from an API repository instead of sample data.',
          'Persist cart state locally so users do not lose work.',
          'Move cart to Provider or Riverpod when more screens need it.',
          'Add product detail pages and deep links.',
          'Add checkout only through a real payment provider and server-side verification.',
          'Add analytics for add-to-cart and checkout funnel events.',
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Shared state belongs in a controller, not duplicated across screens.',
          'Derived totals should be calculated from cart items.',
          'Catalog and cart are separate features that collaborate through clear APIs.',
          'Commerce apps need extra care for payments, privacy, and analytics.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-common-mistakes',
    title: 'Common Flutter Mistakes (and Fixes)',
    description:
      'Avoid the bugs and maintainability traps that commonly appear when Flutter apps move from demo to production.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 64,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Most Flutter mistakes are understandable. The framework makes it easy to build quickly, so it is also easy to let demo habits leak into production. This lesson gives you fixes you can apply immediately.',
      },
      { type: 'h2', text: 'Mistake 1: Doing too much in build' },
      {
        type: 'code',
        language: 'dart',
        title: 'Move side effects out of build',
        code: `class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  late Future<UserProfile> _future;

  @override
  void initState() {
    super.initState();
    _future = loadProfile();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<UserProfile>(
      future: _future,
      builder: (context, snapshot) {
        return const Text('Profile');
      },
    );
  }
}`,
      },
      {
        type: 'p',
        text: 'Build can run often. Starting requests, navigation, analytics calls, or controller creation in build can cause repeated work and strange bugs.',
      },
      { type: 'h2', text: 'Mistake 2: Forgetting dispose' },
      {
        type: 'code',
        language: 'dart',
        title: 'Dispose owned controllers',
        code: `class SearchBox extends StatefulWidget {
  const SearchBox({super.key});

  @override
  State<SearchBox> createState() => _SearchBoxState();
}

class _SearchBoxState extends State<SearchBox> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(controller: _controller);
  }
}`,
      },
      { type: 'h2', text: 'Mistake 3: Using BuildContext after await' },
      {
        type: 'code',
        language: 'dart',
        title: 'Check mounted after async work',
        code: `Future<void> saveAndClose() async {
  await saveChanges();

  if (!mounted) {
    return;
  }

  Navigator.of(context).pop();
}`,
      },
      { type: 'h2', text: 'Mistake 4: No error or empty states' },
      {
        type: 'ul',
        items: [
          'Every network screen needs loading, error, retry, empty, and success states.',
          'Every form needs validation and clear submit errors.',
          'Every permission flow needs denied and permanently denied states.',
          'Every media or file workflow needs cancellation handling.',
        ],
      },
      { type: 'h2', text: 'Mistake 5: Hard-coded sizes and strings' },
      {
        type: 'p',
        text: 'Fixed heights, clipped text, and hard-coded English strings work in a screenshot but fail with real users. Prefer flexible layout, theming, and localization from the start of shipping work.',
      },
      { type: 'h2', text: 'Mistake 6: Treating debug mode as performance proof' },
      {
        type: 'code',
        language: 'bash',
        title: 'Profile before deciding',
        code: `flutter run --profile
flutter build apk --release
flutter build ipa --release`,
      },
      {
        type: 'warning',
        text: 'Debug mode includes development overhead. A debug performance problem may not exist in release, and a release-only problem may be hidden in debug. Measure the right build mode.',
      },
      {
        type: 'keypoints',
        items: [
          'Keep side effects out of build methods.',
          'Dispose anything your State object owns.',
          'Check mounted before using context after await.',
          'Design for loading, error, empty, accessibility, localization, and release performance.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-next-steps',
    title: 'Web/Desktop, Ecosystem & What to Learn Next',
    description:
      'Decide where to take Flutter next: web, desktop, packages, native integrations, testing, design systems, and production depth.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 65,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'You now have the core Flutter path: widgets, Dart inside Flutter, state, navigation, forms, async, storage, architecture, performance, platform integration, accessibility, localization, CI/CD, and publishing. The next step depends on the kind of apps you want to ship.',
      },
      { type: 'h2', text: 'Flutter for web' },
      {
        type: 'p',
        text: 'Flutter web is useful for app-like experiences, internal tools, dashboards, and products that share a codebase with mobile. It is not always the best choice for content-heavy SEO-first sites.',
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Build for web',
        code: `flutter config --enable-web
flutter devices
flutter build web --release`,
      },
      { type: 'h2', text: 'Flutter for desktop' },
      {
        type: 'code',
        language: 'bash',
        title: 'Enable desktop targets',
        code: `flutter config --enable-windows-desktop
flutter config --enable-macos-desktop
flutter config --enable-linux-desktop
flutter devices`,
      },
      {
        type: 'p',
        text: 'Desktop apps need attention to window sizes, keyboard shortcuts, menus, file access, update delivery, and platform expectations. A mobile layout copied directly to desktop usually feels unfinished.',
      },
      { type: 'h2', text: 'Ecosystem areas worth learning' },
      {
        type: 'ul',
        items: [
          'go_router for declarative routing and deep links.',
          'Riverpod, Bloc, or Provider for shared state at app scale.',
          'Drift, SQLite, Hive, or Isar for local persistence.',
          'Firebase or Supabase for authentication, data, storage, and notifications.',
          'freezed and json_serializable for immutable models and JSON code generation.',
          'fastlane or Codemagic for release automation.',
        ],
      },
      { type: 'h2', text: 'Testing depth' },
      {
        type: 'ul',
        items: [
          'Unit test models, repositories, validators, and controllers.',
          'Widget test important screens and state transitions.',
          'Integration test login, checkout, onboarding, and critical paths.',
          'Use fake repositories and fake clients to keep tests fast.',
          'Run tests in CI before every merge.',
        ],
      },
      { type: 'h2', text: 'Portfolio project ideas' },
      {
        type: 'ol',
        items: [
          'Offline-first habit tracker with charts and reminders.',
          'Course browser with auth, bookmarks, search, and sync.',
          'Small shop with catalog, cart, checkout mock, and order history.',
          'Travel planner with maps, deep links, and local caching.',
          'Desktop productivity timer with keyboard shortcuts and settings.',
        ],
      },
      {
        type: 'tip',
        text: 'The strongest next project is one you can finish, polish, test, and publish. A small shipped app teaches more than a giant unfinished clone.',
      },
      {
        type: 'keypoints',
        items: [
          'Flutter can target web and desktop, but each platform has its own expectations.',
          'Choose ecosystem packages that solve real problems in your app.',
          'Testing and release automation are part of advanced Flutter skill.',
          'Your next goal should be a polished shipped app, not just more tutorials.',
        ],
      },
    ],
  },
];
