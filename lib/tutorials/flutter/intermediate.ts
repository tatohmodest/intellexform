import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'flutter-keys',
    title: 'Keys & Widget Identity',
    description:
      'Understand how Flutter matches widgets to existing elements, and use keys to preserve the right state when lists change.',
    level: 'intermediate',
    section: 'State Foundations',
    order: 26,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Flutter rebuilds widgets often. A rebuild does not automatically destroy state because Flutter keeps a separate element tree and tries to match new widgets with existing elements.',
      },
      {
        type: 'p',
        text: 'Keys help Flutter know which widget is which when siblings have the same type and their order can change. This matters most in dynamic lists, reorderable UI, animations, and form rows with local state.',
      },
      { type: 'h2', text: 'The identity problem' },
      {
        type: 'p',
        text: 'Without keys, Flutter usually matches children by position. If you insert, remove, or reorder stateful children, the state can appear to move to the wrong row.',
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Use stable keys for dynamic rows',
        code: `class Task {
  Task({required this.id, required this.title});

  final String id;
  final String title;
}

class TaskList extends StatelessWidget {
  const TaskList({super.key, required this.tasks});

  final List<Task> tasks;

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        for (final task in tasks)
          TaskTile(
            key: ValueKey(task.id),
            task: task,
          ),
      ],
    );
  }
}

class TaskTile extends StatefulWidget {
  const TaskTile({super.key, required this.task});

  final Task task;

  @override
  State<TaskTile> createState() => _TaskTileState();
}

class _TaskTileState extends State<TaskTile> {
  bool isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(widget.task.title),
      trailing: IconButton(
        icon: Icon(isExpanded ? Icons.expand_less : Icons.expand_more),
        onPressed: () => setState(() => isExpanded = !isExpanded),
      ),
    );
  }
}`,
      },
      { type: 'h2', text: 'Common key types' },
      {
        type: 'table',
        headers: ['Key', 'Use it when'],
        rows: [
          ['ValueKey(id)', 'A stable value uniquely identifies the item. This is the most common list key.'],
          ['ObjectKey(object)', 'The object identity itself should identify the widget.'],
          ['UniqueKey()', 'You intentionally want a fresh identity every time. Use rarely.'],
          ['GlobalKey()', 'You need access to a state object, context, or form state across the tree. Use sparingly.'],
        ],
      },
      {
        type: 'code',
        language: 'dart',
        title: 'A GlobalKey for form state',
        code: `class ProfileForm extends StatefulWidget {
  const ProfileForm({super.key});

  @override
  State<ProfileForm> createState() => _ProfileFormState();
}

class _ProfileFormState extends State<ProfileForm> {
  final formKey = GlobalKey<FormState>();

  void save() {
    if (formKey.currentState!.validate()) {
      formKey.currentState!.save();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: Column(
        children: [
          TextFormField(
            decoration: const InputDecoration(labelText: 'Name'),
            validator: (value) =>
                value == null || value.isEmpty ? 'Name is required' : null,
          ),
          ElevatedButton(onPressed: save, child: const Text('Save')),
        ],
      ),
    );
  }
}`,
      },
      {
        type: 'note',
        text: 'A key only needs to be unique among sibling widgets at the same level of the tree, not globally across the whole app.',
      },
      {
        type: 'tip',
        text: 'Prefer ValueKey with a real database ID, API ID, or stable local ID. Avoid using list indexes as keys when the list can be reordered or filtered.',
      },
      {
        type: 'try',
        text: 'Build a list of editable contact rows. Add a button that inserts a new contact at the top. Compare behavior with no key, ValueKey(contact.id), and UniqueKey().',
      },
      {
        type: 'keypoints',
        items: [
          'Flutter preserves state by matching widgets to existing elements.',
          'Keys make identity explicit when sibling widgets have the same type.',
          'Use ValueKey for dynamic list items with stable IDs.',
          'GlobalKey is powerful but should be reserved for cases like FormState access.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-setstate-limits',
    title: 'When setState Is Enough (and When Not)',
    description:
      'Use setState confidently for local UI state, and recognize when state needs to move into a shared model.',
    level: 'intermediate',
    section: 'State Foundations',
    order: 27,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'setState is not beginner-only. It is the right tool for state that belongs to one StatefulWidget, changes because of local interaction, and does not need to be read far away.',
      },
      {
        type: 'p',
        text: 'The limit appears when many widgets need the same data, business rules start living in build methods, or async work must survive navigation and screen rebuilds.',
      },
      { type: 'h2', text: 'Good setState use' },
      {
        type: 'code',
        language: 'dart',
        title: 'Local UI state',
        code: `class QuantityPicker extends StatefulWidget {
  const QuantityPicker({super.key});

  @override
  State<QuantityPicker> createState() => _QuantityPickerState();
}

class _QuantityPickerState extends State<QuantityPicker> {
  int quantity = 1;

  void increment() {
    setState(() {
      quantity++;
    });
  }

  void decrement() {
    if (quantity == 1) return;

    setState(() {
      quantity--;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(onPressed: decrement, icon: const Icon(Icons.remove)),
        Text('$quantity'),
        IconButton(onPressed: increment, icon: const Icon(Icons.add)),
      ],
    );
  }
}`,
      },
      { type: 'h2', text: 'Signs that state should move out' },
      {
        type: 'ul',
        items: [
          'Two unrelated screens need to read or update the same value.',
          'You pass callbacks and values through many widgets that do not use them.',
          'The state represents app data, such as a cart, session, profile, or settings.',
          'Testing the logic requires pumping a large widget tree instead of testing a small object.',
        ],
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Move business rules into a plain model',
        code: `class CartItem {
  const CartItem({required this.id, required this.name, required this.price});

  final String id;
  final String name;
  final double price;
}

class CartModel {
  final List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);
  double get total => _items.fold(0, (sum, item) => sum + item.price);

  void add(CartItem item) {
    _items.add(item);
  }

  void removeById(String id) {
    _items.removeWhere((item) => item.id == id);
  }
}`,
      },
      {
        type: 'p',
        text: 'A model like this can later be wrapped by ChangeNotifier, Provider, Riverpod, Bloc, or another state library. The important step is separating app logic from widget rebuilding.',
      },
      {
        type: 'note',
        text: 'setState tells Flutter that this State object needs to rebuild. It does not rebuild the entire app, but rebuilding a very large subtree repeatedly can still be wasteful.',
      },
      {
        type: 'tip',
        text: 'Keep the code inside setState short and synchronous. Do async work before or after it, then call setState only to store the finished result.',
      },
      {
        type: 'try',
        text: 'Create a favorite button with setState. Then imagine favorites must appear on a Favorites screen too. Write down what data would move into a shared model.',
      },
      {
        type: 'keypoints',
        items: [
          'setState is ideal for local, screen-owned UI state.',
          'Shared app data should move into a model or state management layer.',
          'Do not put long async work inside the setState callback.',
          'Extracting logic into plain Dart classes makes state easier to test.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-inherited',
    title: 'InheritedWidget & of(context)',
    description:
      'Learn the Flutter mechanism behind Theme.of, MediaQuery.of, and many state management libraries.',
    level: 'intermediate',
    section: 'State Foundations',
    order: 28,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'InheritedWidget is Flutter\'s built-in way to pass data down the widget tree without manually forwarding it through every constructor.',
      },
      {
        type: 'p',
        text: 'You already use this pattern when you call Theme.of(context), MediaQuery.of(context), Navigator.of(context), or ScaffoldMessenger.of(context).',
      },
      { type: 'h2', text: 'A small inherited settings object' },
      {
        type: 'code',
        language: 'dart',
        title: 'AppSettingsScope',
        code: `class AppSettings {
  const AppSettings({required this.isCompact});

  final bool isCompact;
}

class AppSettingsScope extends InheritedWidget {
  const AppSettingsScope({
    super.key,
    required this.settings,
    required super.child,
  });

  final AppSettings settings;

  static AppSettings of(BuildContext context) {
    final scope =
        context.dependOnInheritedWidgetOfExactType<AppSettingsScope>();

    assert(scope != null, 'No AppSettingsScope found in context');
    return scope!.settings;
  }

  @override
  bool updateShouldNotify(AppSettingsScope oldWidget) {
    return settings.isCompact != oldWidget.settings.isCompact;
  }
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Reading the inherited value',
        code: `class ProductGrid extends StatelessWidget {
  const ProductGrid({super.key});

  @override
  Widget build(BuildContext context) {
    final settings = AppSettingsScope.of(context);

    return GridView.count(
      crossAxisCount: settings.isCompact ? 3 : 2,
      children: const [
        Card(child: Center(child: Text('Keyboard'))),
        Card(child: Center(child: Text('Mouse'))),
        Card(child: Center(child: Text('Monitor'))),
      ],
    );
  }
}`,
      },
      { type: 'h2', text: 'Why dependOnInheritedWidgetOfExactType matters' },
      {
        type: 'p',
        text: 'When a build method calls dependOnInheritedWidgetOfExactType, Flutter records that dependency. If updateShouldNotify returns true later, dependent widgets rebuild.',
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Providing the scope',
        code: `class SettingsExample extends StatefulWidget {
  const SettingsExample({super.key});

  @override
  State<SettingsExample> createState() => _SettingsExampleState();
}

class _SettingsExampleState extends State<SettingsExample> {
  bool compact = false;

  @override
  Widget build(BuildContext context) {
    return AppSettingsScope(
      settings: AppSettings(isCompact: compact),
      child: Scaffold(
        appBar: AppBar(title: const Text('InheritedWidget')),
        body: const ProductGrid(),
        floatingActionButton: FloatingActionButton(
          onPressed: () => setState(() => compact = !compact),
          child: const Icon(Icons.view_compact),
        ),
      ),
    );
  }
}`,
      },
      {
        type: 'note',
        text: 'InheritedWidget is low-level. In everyday apps you often use Provider or another package, but understanding this mechanism makes those packages less mysterious.',
      },
      {
        type: 'tip',
        text: 'Create an of(context) method on your scope. It gives callers a clean API and keeps the lookup details in one place.',
      },
      {
        type: 'try',
        text: 'Create a LocaleScope that stores a language code. Read it from two text widgets and toggle the code from en to es.',
      },
      {
        type: 'keypoints',
        items: [
          'InheritedWidget passes data down the tree through BuildContext.',
          'of(context) methods are a common readable wrapper around inherited lookups.',
          'updateShouldNotify decides whether dependent widgets rebuild.',
          'Provider builds on the same dependency-tracking idea.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-provider',
    title: 'Provider State Management',
    description:
      'Manage shared Flutter state with ChangeNotifier, Provider, Consumer, context.watch, and context.read.',
    level: 'intermediate',
    section: 'State Foundations',
    order: 29,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Provider is a practical state management package built around Flutter\'s inherited widget system. It is popular because it keeps the mental model close to Flutter: provide data above, read it below, rebuild only the parts that depend on it.',
      },
      {
        type: 'p',
        text: 'The most common Provider pattern combines ChangeNotifier for mutable app state with ChangeNotifierProvider, Consumer, context.watch, and context.read.',
      },
      { type: 'h2', text: 'Add the package' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install Provider',
        code: `flutter pub add provider`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'A ChangeNotifier model',
        code: `import 'package:flutter/foundation.dart';

class CartItem {
  const CartItem({required this.id, required this.name, required this.price});

  final String id;
  final String name;
  final double price;
}

class CartModel extends ChangeNotifier {
  final List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);
  int get count => _items.length;
  double get total => _items.fold(0, (sum, item) => sum + item.price);

  void add(CartItem item) {
    _items.add(item);
    notifyListeners();
  }

  void remove(String id) {
    _items.removeWhere((item) => item.id == id);
    notifyListeners();
  }

  void clear() {
    _items.clear();
    notifyListeners();
  }
}`,
      },
      { type: 'h2', text: 'Provide the model near the top' },
      {
        type: 'code',
        language: 'dart',
        title: 'main.dart',
        code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => CartModel(),
      child: const ShopApp(),
    ),
  );
}

class ShopApp extends StatelessWidget {
  const ShopApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Provider Shop',
      theme: ThemeData(useMaterial3: true),
      home: const ProductPage(),
    );
  }
}`,
      },
      { type: 'h2', text: 'Read and update state' },
      {
        type: 'code',
        language: 'dart',
        title: 'watch, read, and Consumer',
        code: `class ProductPage extends StatelessWidget {
  const ProductPage({super.key});

  @override
  Widget build(BuildContext context) {
    final count = context.watch<CartModel>().count;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Products'),
        actions: [
          Center(child: Text('Cart: $count')),
          const SizedBox(width: 16),
        ],
      ),
      body: ListView(
        children: const [
          ProductTile(
            item: CartItem(id: 'p1', name: 'Notebook', price: 8.99),
          ),
          ProductTile(
            item: CartItem(id: 'p2', name: 'Backpack', price: 49.99),
          ),
          CartSummary(),
        ],
      ),
    );
  }
}

class ProductTile extends StatelessWidget {
  const ProductTile({super.key, required this.item});

  final CartItem item;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(item.name),
      subtitle: Text('\\$\${item.price.toStringAsFixed(2)}'),
      trailing: ElevatedButton(
        onPressed: () => context.read<CartModel>().add(item),
        child: const Text('Add'),
      ),
    );
  }
}

class CartSummary extends StatelessWidget {
  const CartSummary({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<CartModel>(
      builder: (context, cart, child) {
        return ListTile(
          title: Text('Total: \\$\${cart.total.toStringAsFixed(2)}'),
          trailing: TextButton(
            onPressed: cart.count == 0 ? null : cart.clear,
            child: const Text('Clear'),
          ),
        );
      },
    );
  }
}`,
      },
      {
        type: 'table',
        headers: ['API', 'Meaning'],
        rows: [
          ['context.watch<T>()', 'Read T and rebuild this widget when T notifies listeners.'],
          ['context.read<T>()', 'Read T once for callbacks or methods. Does not subscribe.'],
          ['Consumer<T>', 'Rebuild only a smaller builder area when T changes.'],
          ['Selector<T, S>', 'Rebuild only when a selected value changes. Useful for performance.'],
        ],
      },
      {
        type: 'note',
        text: 'Call notifyListeners after changing state. Widgets that used watch, Consumer, or Selector will rebuild with the new values.',
      },
      {
        type: 'tip',
        text: 'Use context.read inside button callbacks. Use context.watch in build when the displayed UI depends on the value.',
      },
      {
        type: 'try',
        text: 'Extend the cart model with a remove method and show each cart item with a delete icon. Use Consumer around only the cart list.',
      },
      {
        type: 'keypoints',
        items: [
          'Provider exposes objects to descendants using BuildContext.',
          'ChangeNotifier stores mutable state and calls notifyListeners after updates.',
          'context.watch rebuilds; context.read is best for event handlers.',
          'Consumer and Selector help keep rebuilds focused.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-futures',
    title: 'Futures, async & await',
    description:
      'Use Dart Futures in Flutter screens for delayed work, API calls, and one-time async loading.',
    level: 'intermediate',
    section: 'Async & Networking',
    order: 30,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A Future represents one value or error that will be available later. In Flutter, Futures appear in network requests, file reads, database calls, dialogs, navigation results, and timers.',
      },
      {
        type: 'p',
        text: 'The async and await keywords let you write asynchronous code in a readable top-to-bottom style while the UI thread stays free to draw frames.',
      },
      { type: 'h2', text: 'Return a Future from a function' },
      {
        type: 'code',
        language: 'dart',
        title: 'A simulated repository call',
        code: `class UserProfile {
  const UserProfile({required this.name, required this.email});

  final String name;
  final String email;
}

Future<UserProfile> loadProfile() async {
  await Future.delayed(const Duration(seconds: 1));

  return const UserProfile(
    name: 'Ada Lovelace',
    email: 'ada@example.com',
  );
}`,
      },
      { type: 'h2', text: 'Load once in initState' },
      {
        type: 'code',
        language: 'dart',
        title: 'Manual Future state',
        code: `class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  UserProfile? profile;
  Object? error;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchProfile();
  }

  Future<void> fetchProfile() async {
    try {
      final result = await loadProfile();
      if (!mounted) return;

      setState(() {
        profile = result;
        isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        error = e;
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (error != null) {
      return Center(child: Text('Could not load profile: $error'));
    }

    return ListTile(
      title: Text(profile!.name),
      subtitle: Text(profile!.email),
    );
  }
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'FutureBuilder for one Future',
        code: `class ProfileFutureBuilder extends StatelessWidget {
  const ProfileFutureBuilder({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<UserProfile>(
      future: loadProfile(),
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(child: Text('Error: \${snapshot.error}'));
        }

        final profile = snapshot.requireData;
        return ListTile(
          title: Text(profile.name),
          subtitle: Text(profile.email),
        );
      },
    );
  }
}`,
      },
      {
        type: 'warning',
        text: 'Do not create a new Future directly in build if rebuilds should not restart the operation. Store the Future in initState or use a state management layer.',
      },
      {
        type: 'tip',
        text: 'After an await in a State object, check mounted before calling setState or using context.',
      },
      {
        type: 'try',
        text: 'Create a screen that waits 800ms, then displays a list of three messages. Add a button that reloads the Future.',
      },
      {
        type: 'keypoints',
        items: [
          'Future<T> produces one T value or one error later.',
          'async functions return Futures, and await pauses the function until the Future completes.',
          'Use mounted checks before updating a disposed State after await.',
          'FutureBuilder is convenient for one-time asynchronous UI.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-streams',
    title: 'Streams & StreamBuilder',
    description:
      'Render data that changes over time with Dart Streams and Flutter StreamBuilder.',
    level: 'intermediate',
    section: 'Async & Networking',
    order: 31,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A Stream is a sequence of asynchronous values. Unlike a Future, which completes once, a Stream can emit many values over time.',
      },
      {
        type: 'p',
        text: 'Streams are common in realtime databases, authentication state, web sockets, sensors, timers, and form validation pipelines.',
      },
      { type: 'h2', text: 'Create a simple stream' },
      {
        type: 'code',
        language: 'dart',
        title: 'Counting values',
        code: `Stream<int> countToFive() async* {
  for (var i = 1; i <= 5; i++) {
    await Future.delayed(const Duration(seconds: 1));
    yield i;
  }
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'StreamBuilder UI',
        code: `class CounterStreamScreen extends StatelessWidget {
  const CounterStreamScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<int>(
      stream: countToFive(),
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return Center(child: Text('Stream error: \${snapshot.error}'));
        }

        if (!snapshot.hasData) {
          return const Center(child: Text('Waiting for values...'));
        }

        return Center(
          child: Text(
            'Latest value: \${snapshot.data}',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
        );
      },
    );
  }
}`,
      },
      { type: 'h2', text: 'Listen manually when you need side effects' },
      {
        type: 'code',
        language: 'dart',
        title: 'Managing a StreamSubscription',
        code: `class ConnectivityBanner extends StatefulWidget {
  const ConnectivityBanner({super.key, required this.statuses});

  final Stream<String> statuses;

  @override
  State<ConnectivityBanner> createState() => _ConnectivityBannerState();
}

class _ConnectivityBannerState extends State<ConnectivityBanner> {
  StreamSubscription<String>? subscription;
  String status = 'unknown';

  @override
  void initState() {
    super.initState();
    subscription = widget.statuses.listen((nextStatus) {
      setState(() => status = nextStatus);
    });
  }

  @override
  void dispose() {
    subscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialBanner(
      content: Text('Connection: $status'),
      actions: const [SizedBox.shrink()],
    );
  }
}`,
      },
      {
        type: 'note',
        text: 'StreamBuilder handles subscription and cancellation for you. Manual listen calls should usually be paired with cancel in dispose.',
      },
      {
        type: 'tip',
        text: 'Use Future for one result and Stream for continuing updates. Choosing the simpler async type keeps UI code easier to reason about.',
      },
      {
        type: 'try',
        text: 'Build a Stream.periodic clock that emits the current time every second and render it with StreamBuilder.',
      },
      {
        type: 'keypoints',
        items: [
          'Streams emit multiple asynchronous values over time.',
          'async* and yield create readable stream-producing functions.',
          'StreamBuilder rebuilds when the stream emits new values.',
          'Cancel manual StreamSubscription objects in dispose.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-http',
    title: 'HTTP Requests',
    description:
      'Fetch data from APIs in Flutter with the http package, status checks, JSON decoding, and timeout handling.',
    level: 'intermediate',
    section: 'Async & Networking',
    order: 32,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Most production apps talk to an API. In Flutter, the lightweight http package is a common first choice for REST requests. Larger apps may choose dio for interceptors, cancellation, and advanced configuration.',
      },
      { type: 'h2', text: 'Install http' },
      {
        type: 'code',
        language: 'bash',
        title: 'Add the dependency',
        code: `flutter pub add http`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'A small API client',
        code: `import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiException implements Exception {
  const ApiException(this.message);

  final String message;

  @override
  String toString() => message;
}

class PostSummary {
  const PostSummary({required this.id, required this.title});

  final int id;
  final String title;

  factory PostSummary.fromJson(Map<String, dynamic> json) {
    return PostSummary(
      id: json['id'] as int,
      title: json['title'] as String,
    );
  }
}

class PostsApi {
  PostsApi({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  Future<List<PostSummary>> fetchPosts() async {
    final uri = Uri.https('jsonplaceholder.typicode.com', '/posts');
    final response = await _client.get(uri).timeout(
          const Duration(seconds: 10),
        );

    if (response.statusCode != 200) {
      throw ApiException('Request failed: \${response.statusCode}');
    }

    final decoded = jsonDecode(response.body) as List<dynamic>;
    return decoded
        .map((item) => PostSummary.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  void close() {
    _client.close();
  }
}`,
      },
      { type: 'h2', text: 'Render API data' },
      {
        type: 'code',
        language: 'dart',
        title: 'FutureBuilder with an API client',
        code: `class PostsScreen extends StatefulWidget {
  const PostsScreen({super.key});

  @override
  State<PostsScreen> createState() => _PostsScreenState();
}

class _PostsScreenState extends State<PostsScreen> {
  late final PostsApi api;
  late Future<List<PostSummary>> postsFuture;

  @override
  void initState() {
    super.initState();
    api = PostsApi();
    postsFuture = api.fetchPosts();
  }

  @override
  void dispose() {
    api.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<PostSummary>>(
      future: postsFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(child: Text('Could not load posts'));
        }

        final posts = snapshot.requireData;
        return ListView.builder(
          itemCount: posts.length,
          itemBuilder: (context, index) {
            final post = posts[index];
            return ListTile(
              title: Text(post.title),
              subtitle: Text('Post #\${post.id}'),
            );
          },
        );
      },
    );
  }
}`,
      },
      {
        type: 'table',
        headers: ['Concern', 'Good habit'],
        rows: [
          ['URLs', 'Build with Uri.https or Uri.parse instead of string concatenation.'],
          ['Status codes', 'Check response.statusCode before trusting the body.'],
          ['Timeouts', 'Use timeout so the UI does not wait forever.'],
          ['Client lifetime', 'Reuse a Client and close it when the owner is disposed.'],
        ],
      },
      {
        type: 'note',
        text: 'On Android, iOS, macOS, and web, platform networking setup can differ. Check platform permissions and CORS rules when a request works in one place but not another.',
      },
      {
        type: 'tip',
        text: 'Keep HTTP code out of widgets when possible. A small API class is easier to test and later replace with dio or generated clients.',
      },
      {
        type: 'try',
        text: 'Create a CommentsApi that fetches /comments?postId=1 from JSONPlaceholder and displays the commenter email and body.',
      },
      {
        type: 'keypoints',
        items: [
          'The http package is a simple REST client for Flutter apps.',
          'Decode JSON with dart:convert after checking status codes.',
          'Use timeouts and clear exceptions for better failure handling.',
          'Put networking in API or repository classes, not directly in build methods.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-json-models',
    title: 'JSON Parsing & Model Classes',
    description:
      'Convert API JSON into typed Dart model classes with factory constructors, nullable fields, and toJson methods.',
    level: 'intermediate',
    section: 'Async & Networking',
    order: 33,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'JSON from an API is dynamic data. Flutter UI is easier to build when you convert that dynamic map data into typed Dart objects near the boundary of your app.',
      },
      {
        type: 'p',
        text: 'Model classes document the shape of the data, centralize parsing rules, and prevent repeated string-key lookups across widgets.',
      },
      { type: 'h2', text: 'A typed model class' },
      {
        type: 'code',
        language: 'dart',
        title: 'Product model',
        code: `class Product {
  const Product({
    required this.id,
    required this.name,
    required this.price,
    required this.tags,
    this.description,
  });

  final String id;
  final String name;
  final double price;
  final List<String> tags;
  final String? description;

  factory Product.fromJson(Map<String, dynamic> json) {
    final rawTags = json['tags'] as List<dynamic>? ?? const [];

    return Product(
      id: json['id'] as String,
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
      tags: rawTags.map((tag) => tag as String).toList(),
      description: json['description'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'price': price,
      'tags': tags,
      'description': description,
    };
  }
}`,
      },
      {
        type: 'code',
        language: 'json',
        title: 'Example API response',
        code: `{
  "id": "p100",
  "name": "Travel Mug",
  "price": 18.5,
  "tags": ["kitchen", "travel"],
  "description": null
}`,
      },
      { type: 'h2', text: 'Parse a list safely' },
      {
        type: 'code',
        language: 'dart',
        title: 'Decode and map',
        code: `import 'dart:convert';

List<Product> parseProducts(String responseBody) {
  final decoded = jsonDecode(responseBody) as List<dynamic>;

  return decoded
      .map((item) => Product.fromJson(item as Map<String, dynamic>))
      .toList();
}`,
      },
      {
        type: 'table',
        headers: ['JSON situation', 'Dart approach'],
        rows: [
          ['Number can be int or double', 'Cast as num, then call toDouble().'],
          ['Field may be missing', 'Use nullable types or a default value.'],
          ['Nested object', 'Create another model class and call Child.fromJson.'],
          ['List of objects', 'Cast to List<dynamic>, then map each item.'],
        ],
      },
      {
        type: 'note',
        text: 'Manual parsing is fine for small apps and tutorials. For larger APIs, packages such as json_serializable and freezed can generate repetitive parsing code.',
      },
      {
        type: 'tip',
        text: 'Avoid passing Map<String, dynamic> deep into UI widgets. Parse once near the API layer, then render typed objects.',
      },
      {
        type: 'try',
        text: 'Create an Order model with id, total, createdAt, and a list of Product objects. Add fromJson and toJson.',
      },
      {
        type: 'keypoints',
        items: [
          'JSON decoding returns dynamic maps and lists.',
          'Model classes turn dynamic API data into typed Dart objects.',
          'Use factory constructors for fromJson parsing.',
          'Handle nullable, missing, nested, and numeric fields deliberately.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-loading-error',
    title: 'Loading, Empty & Error UI',
    description:
      'Design async screens that clearly handle loading, successful data, empty results, and recoverable errors.',
    level: 'intermediate',
    section: 'Async & Networking',
    order: 34,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Async UI is not just showing a spinner. A reliable Flutter screen needs a state for loading, content, empty results, errors, and often retrying.',
      },
      {
        type: 'p',
        text: 'Making these states explicit keeps screens predictable and prevents awkward combinations like showing stale data and a full-screen spinner at the same time.',
      },
      { type: 'h2', text: 'Represent the screen state' },
      {
        type: 'code',
        language: 'dart',
        title: 'Small sealed state model',
        code: `sealed class ProductsState {
  const ProductsState();
}

class ProductsLoading extends ProductsState {
  const ProductsLoading();
}

class ProductsLoaded extends ProductsState {
  const ProductsLoaded(this.products);

  final List<Product> products;
}

class ProductsError extends ProductsState {
  const ProductsError(this.message);

  final String message;
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Render each state',
        code: `class ProductsView extends StatelessWidget {
  const ProductsView({
    super.key,
    required this.state,
    required this.onRetry,
  });

  final ProductsState state;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return switch (state) {
      ProductsLoading() => const Center(
          child: CircularProgressIndicator(),
        ),
      ProductsError(:final message) => ErrorPanel(
          message: message,
          onRetry: onRetry,
        ),
      ProductsLoaded(products: final products) when products.isEmpty =>
        const EmptyProducts(),
      ProductsLoaded(:final products) => ListView.builder(
          itemCount: products.length,
          itemBuilder: (context, index) {
            final product = products[index];
            return ListTile(title: Text(product.name));
          },
        ),
    };
  }
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Reusable empty and error widgets',
        code: `class EmptyProducts extends StatelessWidget {
  const EmptyProducts({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Padding(
        padding: EdgeInsets.all(24),
        child: Text('No products yet. Add your first product to begin.'),
      ),
    );
  }
}

class ErrorPanel extends StatelessWidget {
  const ErrorPanel({
    super.key,
    required this.message,
    required this.onRetry,
  });

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(message, textAlign: TextAlign.center),
          const SizedBox(height: 12),
          FilledButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh),
            label: const Text('Try again'),
          ),
        ],
      ),
    );
  }
}`,
      },
      {
        type: 'note',
        text: 'Empty is a successful state, not an error. Treating it separately lets you explain what the user can do next.',
      },
      {
        type: 'tip',
        text: 'Use inline loading indicators for refreshes when content is already visible. Save full-screen loading for the first load.',
      },
      {
        type: 'try',
        text: 'Create a UsersView that handles loading, empty, error, and loaded states. Make the empty message helpful instead of saying only "No data".',
      },
      {
        type: 'keypoints',
        items: [
          'Async screens need explicit loading, loaded, empty, and error states.',
          'Empty results are different from failed requests.',
          'Retry actions make many errors recoverable.',
          'Small reusable state widgets keep async screens consistent.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-shared-preferences',
    title: 'shared_preferences',
    description:
      'Store small pieces of local app data such as settings, flags, and simple user preferences.',
    level: 'intermediate',
    section: 'Local Data',
    order: 35,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'shared_preferences stores small key-value pairs on the device. It is useful for theme choice, onboarding completion, simple filters, and lightweight settings.',
      },
      {
        type: 'warning',
        text: 'Do not store passwords, access tokens, or sensitive personal data in shared_preferences. Use secure storage for secrets.',
      },
      { type: 'h2', text: 'Install the package' },
      {
        type: 'code',
        language: 'bash',
        title: 'Add shared_preferences',
        code: `flutter pub add shared_preferences`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'A small settings service',
        code: `import 'package:shared_preferences/shared_preferences.dart';

class SettingsStore {
  static const _darkModeKey = 'darkMode';
  static const _fontScaleKey = 'fontScale';

  Future<bool> loadDarkMode() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_darkModeKey) ?? false;
  }

  Future<void> saveDarkMode(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_darkModeKey, value);
  }

  Future<double> loadFontScale() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getDouble(_fontScaleKey) ?? 1.0;
  }

  Future<void> saveFontScale(double value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble(_fontScaleKey, value);
  }
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Use preferences in a settings screen',
        code: `class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final store = SettingsStore();
  bool darkMode = false;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    load();
  }

  Future<void> load() async {
    final savedDarkMode = await store.loadDarkMode();
    if (!mounted) return;

    setState(() {
      darkMode = savedDarkMode;
      isLoading = false;
    });
  }

  Future<void> updateDarkMode(bool value) async {
    setState(() => darkMode = value);
    await store.saveDarkMode(value);
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return SwitchListTile(
      title: const Text('Dark mode'),
      value: darkMode,
      onChanged: updateDarkMode,
    );
  }
}`,
      },
      {
        type: 'note',
        text: 'shared_preferences supports simple values: int, double, bool, String, and List<String>.',
      },
      {
        type: 'tip',
        text: 'Wrap preferences access in a service class. It keeps key names in one place and avoids scattering storage details through widgets.',
      },
      {
        type: 'try',
        text: 'Store a preferred username and a "show completed tasks" flag. Load both when the settings screen starts.',
      },
      {
        type: 'keypoints',
        items: [
          'shared_preferences is for small, non-sensitive key-value data.',
          'Access is asynchronous because it talks to platform storage.',
          'Use default values when a preference has not been saved yet.',
          'A store or service class keeps preference keys organized.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-local-db',
    title: 'Local Database (Hive or sqflite patterns)',
    description:
      'Use a local database pattern for offline Flutter data, with Hive as the primary example and sqflite as a relational alternative.',
    level: 'intermediate',
    section: 'Local Data',
    order: 36,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'When data becomes more than a few settings values, use a local database. Databases help with offline lists, cached API data, drafts, notes, and user-created records.',
      },
      {
        type: 'p',
        text: 'Hive is a lightweight key-value database for Dart and Flutter. It is friendly for local-first models and simple offline storage. sqflite is a good choice when you need SQL queries, joins, and relational constraints.',
      },
      { type: 'h2', text: 'Install Hive packages' },
      {
        type: 'code',
        language: 'bash',
        title: 'Add Hive',
        code: `flutter pub add hive hive_flutter`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Initialize Hive',
        code: `import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();
  await Hive.openBox<Map>('notes');

  runApp(const NotesApp());
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Repository pattern around a box',
        code: `class Note {
  const Note({
    required this.id,
    required this.title,
    required this.body,
  });

  final String id;
  final String title;
  final String body;

  Map<String, dynamic> toMap() {
    return {'id': id, 'title': title, 'body': body};
  }

  factory Note.fromMap(Map<dynamic, dynamic> map) {
    return Note(
      id: map['id'] as String,
      title: map['title'] as String,
      body: map['body'] as String,
    );
  }
}

class NotesRepository {
  NotesRepository(this.box);

  final Box<Map> box;

  List<Note> getAll() {
    return box.values.map(Note.fromMap).toList();
  }

  Future<void> save(Note note) {
    return box.put(note.id, note.toMap());
  }

  Future<void> delete(String id) {
    return box.delete(id);
  }
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Display saved notes',
        code: `class NotesScreen extends StatelessWidget {
  const NotesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final box = Hive.box<Map>('notes');
    final repository = NotesRepository(box);

    return ValueListenableBuilder(
      valueListenable: box.listenable(),
      builder: (context, Box<Map> box, child) {
        final notes = repository.getAll();

        if (notes.isEmpty) {
          return const Center(child: Text('No notes yet.'));
        }

        return ListView.builder(
          itemCount: notes.length,
          itemBuilder: (context, index) {
            final note = notes[index];
            return ListTile(
              title: Text(note.title),
              subtitle: Text(note.body),
              trailing: IconButton(
                icon: const Icon(Icons.delete),
                onPressed: () => repository.delete(note.id),
              ),
            );
          },
        );
      },
    );
  }
}`,
      },
      {
        type: 'note',
        text: 'Hive can store simple values and maps directly. For richer typed objects, Hive adapters and code generation can give better type safety.',
      },
      {
        type: 'tip',
        text: 'Keep database access behind a repository. If you later switch from Hive to sqflite or a remote sync layer, your widgets change less.',
      },
      {
        type: 'try',
        text: 'Create a TodoRepository with getAll, save, and delete. Add a completed boolean and render completed todos with a line-through style.',
      },
      {
        type: 'keypoints',
        items: [
          'Use a local database for offline records, caches, and user-created data.',
          'Hive is simple for key-value and document-like local storage.',
          'sqflite is better when your app needs SQL-style relational queries.',
          'A repository keeps persistence code separate from UI code.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-files-paths',
    title: 'Files & Path Access Basics',
    description:
      'Read and write app files with dart:io and path_provider, using platform-safe directories.',
    level: 'intermediate',
    section: 'Local Data',
    order: 37,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Some app data belongs in files instead of preferences or a database: exported text, generated reports, cached images, logs, and user drafts.',
      },
      {
        type: 'p',
        text: 'Flutter apps run on multiple platforms, so do not hard-code file paths. Ask the platform for safe app directories with path_provider.',
      },
      { type: 'h2', text: 'Install path_provider' },
      {
        type: 'code',
        language: 'bash',
        title: 'Add dependency',
        code: `flutter pub add path_provider`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Write and read a text file',
        code: `import 'dart:io';

import 'package:path_provider/path_provider.dart';

class DraftFileStore {
  Future<File> _draftFile() async {
    final directory = await getApplicationDocumentsDirectory();
    return File('\${directory.path}/draft.txt');
  }

  Future<void> saveDraft(String text) async {
    final file = await _draftFile();
    await file.writeAsString(text);
  }

  Future<String> loadDraft() async {
    final file = await _draftFile();

    if (!await file.exists()) {
      return '';
    }

    return file.readAsString();
  }

  Future<void> deleteDraft() async {
    final file = await _draftFile();

    if (await file.exists()) {
      await file.delete();
    }
  }
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Use the file store from a widget',
        code: `class DraftScreen extends StatefulWidget {
  const DraftScreen({super.key});

  @override
  State<DraftScreen> createState() => _DraftScreenState();
}

class _DraftScreenState extends State<DraftScreen> {
  final store = DraftFileStore();
  final controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    loadDraft();
  }

  Future<void> loadDraft() async {
    controller.text = await store.loadDraft();
  }

  Future<void> saveDraft() async {
    await store.saveDraft(controller.text);
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Draft saved')),
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          controller: controller,
          maxLines: 8,
          decoration: const InputDecoration(labelText: 'Draft'),
        ),
        FilledButton(onPressed: saveDraft, child: const Text('Save')),
      ],
    );
  }
}`,
      },
      {
        type: 'table',
        headers: ['Directory', 'Typical use'],
        rows: [
          ['Application documents', 'User-visible app data that should be backed up.'],
          ['Temporary directory', 'Caches or files that can be deleted by the system.'],
          ['Application support', 'App support files not normally shown to users.'],
        ],
      },
      {
        type: 'note',
        text: 'dart:io is not available on Flutter web. For web file workflows, use browser APIs or packages that support web storage and downloads.',
      },
      {
        type: 'tip',
        text: 'Use the path package to join path segments in larger apps. It avoids platform separator mistakes.',
      },
      {
        type: 'try',
        text: 'Create a ReportStore that writes a JSON string to report.json and reads it back. Show a message if the file does not exist.',
      },
      {
        type: 'keypoints',
        items: [
          'Use path_provider instead of hard-coded paths.',
          'dart:io File methods are asynchronous and should be awaited.',
          'Check whether a file exists before reading optional data.',
          'File access differs on web, mobile, and desktop platforms.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-bottom-nav',
    title: 'BottomNavigationBar',
    description:
      'Build tab-like top-level navigation with BottomNavigationBar, IndexedStack, and destination state preservation.',
    level: 'intermediate',
    section: 'Navigation Patterns',
    order: 38,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Bottom navigation is for switching between a small number of top-level destinations, such as Home, Search, Cart, and Profile.',
      },
      {
        type: 'p',
        text: 'The selected destination usually changes content inside one Scaffold instead of pushing a new route onto the stack.',
      },
      { type: 'h2', text: 'Basic bottom navigation' },
      {
        type: 'code',
        language: 'dart',
        title: 'IndexedStack keeps tab state alive',
        code: `class StoreShell extends StatefulWidget {
  const StoreShell({super.key});

  @override
  State<StoreShell> createState() => _StoreShellState();
}

class _StoreShellState extends State<StoreShell> {
  int selectedIndex = 0;

  static const pages = [
    HomeTab(),
    SearchTab(),
    CartTab(),
    ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: selectedIndex,
        children: pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: selectedIndex,
        type: BottomNavigationBarType.fixed,
        onTap: (index) => setState(() => selectedIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart),
            label: 'Cart',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'A simple tab page',
        code: `class SearchTab extends StatefulWidget {
  const SearchTab({super.key});

  @override
  State<SearchTab> createState() => _SearchTabState();
}

class _SearchTabState extends State<SearchTab> {
  final controller = TextEditingController();

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: TextField(
          controller: controller,
          decoration: const InputDecoration(
            labelText: 'Search products',
            prefixIcon: Icon(Icons.search),
          ),
        ),
      ),
    );
  }
}`,
      },
      {
        type: 'note',
        text: 'IndexedStack keeps every child mounted, so scroll position, text fields, and local tab state survive when switching tabs.',
      },
      {
        type: 'tip',
        text: 'Use bottom navigation for top-level destinations. Use Navigator.push for details, edit screens, and flows within a destination.',
      },
      {
        type: 'try',
        text: 'Create a three-tab app for Feed, Messages, and Settings. Put a TextField in Messages and verify its value stays when switching tabs.',
      },
      {
        type: 'keypoints',
        items: [
          'BottomNavigationBar switches between top-level destinations.',
          'Store the selected index in State or shared navigation state.',
          'IndexedStack preserves tab widget state while showing one child.',
          'Do not use bottom navigation for every screen in a deep flow.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-tabs-drawer',
    title: 'Tabs & Drawer',
    description:
      'Use TabBar, TabBarView, DefaultTabController, and Drawer for common Flutter navigation layouts.',
    level: 'intermediate',
    section: 'Navigation Patterns',
    order: 39,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Tabs are good for closely related views at the same level, such as Upcoming, Active, and Completed tasks. A Drawer is useful for secondary destinations, account areas, or less frequently used navigation.',
      },
      { type: 'h2', text: 'Tabs with DefaultTabController' },
      {
        type: 'code',
        language: 'dart',
        title: 'Orders tabs',
        code: `class OrdersScreen extends StatelessWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Orders'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'New'),
              Tab(text: 'Packed'),
              Tab(text: 'Shipped'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            OrdersList(status: 'new'),
            OrdersList(status: 'packed'),
            OrdersList(status: 'shipped'),
          ],
        ),
      ),
    );
  }
}

class OrdersList extends StatelessWidget {
  const OrdersList({super.key, required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    return Center(child: Text('Orders with status: $status'));
  }
}`,
      },
      { type: 'h2', text: 'Add a Drawer' },
      {
        type: 'code',
        language: 'dart',
        title: 'Drawer navigation items',
        code: `class AdminHome extends StatelessWidget {
  const AdminHome({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Admin')),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              child: Text('Store Admin'),
            ),
            ListTile(
              leading: const Icon(Icons.dashboard),
              title: const Text('Dashboard'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.settings),
              title: const Text('Settings'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/settings');
              },
            ),
          ],
        ),
      ),
      body: const Center(child: Text('Dashboard content')),
    );
  }
}`,
      },
      {
        type: 'note',
        text: 'TabBar and TabBarView must agree on length. DefaultTabController is the simplest way to coordinate them.',
      },
      {
        type: 'tip',
        text: 'Close the Drawer with Navigator.pop(context) before navigating. It keeps the back stack and visual transition clean.',
      },
      {
        type: 'try',
        text: 'Build a Recipes screen with Breakfast, Lunch, and Dinner tabs. Add a Drawer item that opens an About screen.',
      },
      {
        type: 'keypoints',
        items: [
          'Tabs group closely related views at the same hierarchy level.',
          'DefaultTabController connects TabBar and TabBarView.',
          'Drawer is best for secondary or less frequent navigation.',
          'Use Navigator.pop to close a drawer before pushing another route.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-named-routes',
    title: 'Named Routes & onGenerateRoute',
    description:
      'Organize Flutter navigation with named routes, route arguments, and a central onGenerateRoute function.',
    level: 'intermediate',
    section: 'Navigation Patterns',
    order: 40,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Named routes give important screens stable names like /settings or /products/detail. They can make navigation easier to centralize, especially in medium-sized apps.',
      },
      {
        type: 'p',
        text: 'For simple apps, the routes map is enough. When routes need arguments, validation, custom transitions, or unknown-route handling, use onGenerateRoute.',
      },
      { type: 'h2', text: 'Start with named routes' },
      {
        type: 'code',
        language: 'dart',
        title: 'MaterialApp routes',
        code: `class ShopApp extends StatelessWidget {
  const ShopApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      initialRoute: '/',
      routes: {
        '/': (context) => const HomeScreen(),
        '/settings': (context) => const SettingsScreen(),
      },
    );
  }
}

ElevatedButton(
  onPressed: () => Navigator.pushNamed(context, '/settings'),
  child: const Text('Open settings'),
)`,
      },
      { type: 'h2', text: 'Pass typed arguments' },
      {
        type: 'code',
        language: 'dart',
        title: 'Arguments object and route generator',
        code: `class ProductDetailsArgs {
  const ProductDetailsArgs({required this.productId});

  final String productId;
}

Route<dynamic> onGenerateRoute(RouteSettings settings) {
  switch (settings.name) {
    case '/':
      return MaterialPageRoute(builder: (_) => const HomeScreen());
    case '/product':
      final args = settings.arguments;

      if (args is! ProductDetailsArgs) {
        return MaterialPageRoute(
          builder: (_) => const ErrorScreen(message: 'Missing product ID'),
        );
      }

      return MaterialPageRoute(
        builder: (_) => ProductDetailsScreen(productId: args.productId),
      );
    default:
      return MaterialPageRoute(
        builder: (_) => const ErrorScreen(message: 'Route not found'),
      );
  }
}

class ShopApp extends StatelessWidget {
  const ShopApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(onGenerateRoute: onGenerateRoute);
  }
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Navigate with arguments',
        code: `ListTile(
  title: const Text('Travel Mug'),
  onTap: () {
    Navigator.pushNamed(
      context,
      '/product',
      arguments: const ProductDetailsArgs(productId: 'p100'),
    );
  },
)`,
      },
      {
        type: 'note',
        text: 'Named routes are not the only option. Apps with browser URLs, deep links, or complex nested navigation often use Router API packages such as go_router.',
      },
      {
        type: 'tip',
        text: 'Define route names as constants to avoid typos: static const product = "/product";',
      },
      {
        type: 'try',
        text: 'Create a /profile route that requires a ProfileArgs object with userId. Show a friendly error screen if arguments are missing.',
      },
      {
        type: 'keypoints',
        items: [
          'Named routes give screens stable string names.',
          'onGenerateRoute centralizes route creation and argument validation.',
          'Use typed argument classes instead of passing loose maps.',
          'Consider go_router for deep linking and complex route trees.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-animations-basics',
    title: 'Implicit Animations',
    description:
      'Add motion with AnimatedContainer, AnimatedOpacity, AnimatedSwitcher, and other implicit animation widgets.',
    level: 'intermediate',
    section: 'Motion',
    order: 41,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Implicit animations are the easiest way to add motion in Flutter. You change a property, and Flutter animates from the old value to the new value.',
      },
      {
        type: 'p',
        text: 'Use them when animation should follow state changes without needing manual playback controls.',
      },
      { type: 'h2', text: 'Animate layout and color' },
      {
        type: 'code',
        language: 'dart',
        title: 'AnimatedContainer card',
        code: `class ExpandingCard extends StatefulWidget {
  const ExpandingCard({super.key});

  @override
  State<ExpandingCard> createState() => _ExpandingCardState();
}

class _ExpandingCardState extends State<ExpandingCard> {
  bool selected = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => setState(() => selected = !selected),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
        width: selected ? 260 : 180,
        padding: EdgeInsets.all(selected ? 24 : 16),
        decoration: BoxDecoration(
          color: selected ? Colors.indigo : Colors.blueGrey,
          borderRadius: BorderRadius.circular(selected ? 28 : 12),
        ),
        child: const Text(
          'Tap me',
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }
}`,
      },
      { type: 'h2', text: 'Animate between child widgets' },
      {
        type: 'code',
        language: 'dart',
        title: 'AnimatedSwitcher',
        code: `class SaveButton extends StatefulWidget {
  const SaveButton({super.key});

  @override
  State<SaveButton> createState() => _SaveButtonState();
}

class _SaveButtonState extends State<SaveButton> {
  bool saved = false;

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: () => setState(() => saved = !saved),
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 250),
        child: saved
            ? const Row(
                key: ValueKey('saved'),
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.check),
                  SizedBox(width: 8),
                  Text('Saved'),
                ],
              )
            : const Text(
                'Save',
                key: ValueKey('save'),
              ),
      ),
    );
  }
}`,
      },
      {
        type: 'table',
        headers: ['Widget', 'Animates'],
        rows: [
          ['AnimatedContainer', 'Size, padding, color, decoration, alignment, and more.'],
          ['AnimatedOpacity', 'Fade in or out.'],
          ['AnimatedPadding', 'Spacing changes.'],
          ['AnimatedSwitcher', 'Transitions between different child widgets.'],
        ],
      },
      {
        type: 'note',
        text: 'AnimatedSwitcher uses child identity to decide whether the child changed. Keys help when children have the same widget type.',
      },
      {
        type: 'tip',
        text: 'Start with durations between 150ms and 350ms for small UI feedback. Longer animations should have a strong purpose.',
      },
      {
        type: 'try',
        text: 'Create a favorite button that animates icon color, size, and label text when toggled.',
      },
      {
        type: 'keypoints',
        items: [
          'Implicit animations animate automatically when widget properties change.',
          'They are ideal for simple UI feedback tied to state.',
          'AnimatedSwitcher transitions between child widgets.',
          'Keys help Flutter recognize when animated children are truly different.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-explicit-animations',
    title: 'Explicit Animations & AnimationController',
    description:
      'Use AnimationController when you need to start, stop, repeat, reverse, or coordinate animation timing.',
    level: 'intermediate',
    section: 'Motion',
    order: 42,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Explicit animations give you control over time. Instead of only changing a property and letting Flutter animate, you own an AnimationController and decide when it moves.',
      },
      {
        type: 'p',
        text: 'Use explicit animations for repeated motion, custom choreography, progress-driven UI, and animations that need play, pause, reverse, or reset.',
      },
      { type: 'h2', text: 'Controller, tween, and builder' },
      {
        type: 'code',
        language: 'dart',
        title: 'Pulsing icon animation',
        code: `class PulsingIcon extends StatefulWidget {
  const PulsingIcon({super.key});

  @override
  State<PulsingIcon> createState() => _PulsingIconState();
}

class _PulsingIconState extends State<PulsingIcon>
    with SingleTickerProviderStateMixin {
  late final AnimationController controller;
  late final Animation<double> scale;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);

    scale = Tween<double>(begin: 0.9, end: 1.15).animate(
      CurvedAnimation(parent: controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: scale,
      child: const Icon(Icons.favorite, color: Colors.red, size: 64),
    );
  }
}`,
      },
      { type: 'h2', text: 'Animate more than one property' },
      {
        type: 'code',
        language: 'dart',
        title: 'AnimatedBuilder with multiple tweens',
        code: `class SlideFadePanel extends StatefulWidget {
  const SlideFadePanel({super.key});

  @override
  State<SlideFadePanel> createState() => _SlideFadePanelState();
}

class _SlideFadePanelState extends State<SlideFadePanel>
    with SingleTickerProviderStateMixin {
  late final AnimationController controller;
  late final Animation<Offset> offset;
  late final Animation<double> opacity;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );

    offset = Tween(begin: const Offset(0, 0.2), end: Offset.zero).animate(
      CurvedAnimation(parent: controller, curve: Curves.easeOut),
    );

    opacity = Tween<double>(begin: 0, end: 1).animate(controller);
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        FilledButton(
          onPressed: () {
            controller.isCompleted ? controller.reverse() : controller.forward();
          },
          child: const Text('Toggle panel'),
        ),
        FadeTransition(
          opacity: opacity,
          child: SlideTransition(
            position: offset,
            child: const Card(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Text('Animated content'),
              ),
            ),
          ),
        ),
      ],
    );
  }
}`,
      },
      {
        type: 'note',
        text: 'AnimationController needs a TickerProvider. SingleTickerProviderStateMixin is perfect when the State owns one controller.',
      },
      {
        type: 'tip',
        text: 'Dispose every AnimationController. Controllers hold ticker resources and can keep work running after a widget is gone.',
      },
      {
        type: 'try',
        text: 'Build a loading logo that rotates continuously. Add a button that stops and starts the controller.',
      },
      {
        type: 'keypoints',
        items: [
          'Explicit animations are driven by AnimationController.',
          'Tweens map controller values into useful ranges such as scale, color, or offset.',
          'CurvedAnimation changes the feel of the timing.',
          'Always dispose controllers owned by State objects.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-hero',
    title: 'Hero Animations',
    description:
      'Create shared-element transitions between routes with Flutter Hero widgets and matching tags.',
    level: 'intermediate',
    section: 'Motion',
    order: 43,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'A Hero animation makes one widget appear to fly from one route to another. It is perfect for product images, avatars, cards, and thumbnails that expand into detail screens.',
      },
      {
        type: 'p',
        text: 'Both the source route and destination route wrap matching widgets in Hero with the same tag.',
      },
      { type: 'h2', text: 'List thumbnail to detail header' },
      {
        type: 'code',
        language: 'dart',
        title: 'Product card',
        code: `class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.id,
    required this.name,
    required this.imageUrl,
  });

  final String id;
  final String name;
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => ProductDetailsScreen(
                id: id,
                name: name,
                imageUrl: imageUrl,
              ),
            ),
          );
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Hero(
              tag: 'product-image-$id',
              child: Image.network(imageUrl, height: 140, fit: BoxFit.cover),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Text(name),
            ),
          ],
        ),
      ),
    );
  }
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Details route',
        code: `class ProductDetailsScreen extends StatelessWidget {
  const ProductDetailsScreen({
    super.key,
    required this.id,
    required this.name,
    required this.imageUrl,
  });

  final String id;
  final String name;
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(name)),
      body: ListView(
        children: [
          Hero(
            tag: 'product-image-$id',
            child: Image.network(imageUrl, height: 320, fit: BoxFit.cover),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              name,
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ),
        ],
      ),
    );
  }
}`,
      },
      {
        type: 'note',
        text: 'Hero tags must be unique within a route. In lists, include the item ID in the tag.',
      },
      {
        type: 'tip',
        text: 'Use similar aspect ratios and shapes on both routes for the smoothest Hero transition.',
      },
      {
        type: 'try',
        text: 'Create an avatar list where tapping a person opens a profile page and the avatar animates into the page header.',
      },
      {
        type: 'keypoints',
        items: [
          'Hero creates shared-element transitions between routes.',
          'The source and destination Hero widgets need matching tags.',
          'Tags should be stable and unique within each route.',
          'Hero works best when the visual element is recognizable on both screens.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-gestures-advanced',
    title: 'Gestures & Dismissible',
    description:
      'Handle richer interaction with GestureDetector, InkWell, long press menus, drag callbacks, and Dismissible list rows.',
    level: 'intermediate',
    section: 'Interaction',
    order: 44,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Flutter has high-level Material interactions such as InkWell and lower-level gesture tools such as GestureDetector. Choose the widget that matches the visual behavior you want.',
      },
      {
        type: 'p',
        text: 'For Material surfaces, InkWell gives ripple feedback and accessibility expectations. GestureDetector is useful for custom areas, drag handling, and non-Material visuals.',
      },
      { type: 'h2', text: 'Tap and long press' },
      {
        type: 'code',
        language: 'dart',
        title: 'Interactive card',
        code: `class ActionCard extends StatelessWidget {
  const ActionCard({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => debugPrint('Open $title'),
        onLongPress: () {
          showModalBottomSheet<void>(
            context: context,
            builder: (context) {
              return ListTile(
                leading: const Icon(Icons.delete),
                title: const Text('Delete'),
                onTap: () => Navigator.pop(context),
              );
            },
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Text(title),
        ),
      ),
    );
  }
}`,
      },
      { type: 'h2', text: 'Swipe to dismiss' },
      {
        type: 'code',
        language: 'dart',
        title: 'Dismissible todo rows',
        code: `class Todo {
  const Todo({required this.id, required this.title});

  final String id;
  final String title;
}

class TodoList extends StatefulWidget {
  const TodoList({super.key});

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  final todos = [
    const Todo(id: '1', title: 'Write proposal'),
    const Todo(id: '2', title: 'Review design'),
    const Todo(id: '3', title: 'Ship update'),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: todos.length,
      itemBuilder: (context, index) {
        final todo = todos[index];

        return Dismissible(
          key: ValueKey(todo.id),
          background: Container(
            color: Colors.green,
            alignment: Alignment.centerLeft,
            padding: const EdgeInsets.only(left: 16),
            child: const Icon(Icons.check, color: Colors.white),
          ),
          secondaryBackground: Container(
            color: Colors.red,
            alignment: Alignment.centerRight,
            padding: const EdgeInsets.only(right: 16),
            child: const Icon(Icons.delete, color: Colors.white),
          ),
          confirmDismiss: (direction) async {
            return direction == DismissDirection.endToStart;
          },
          onDismissed: (direction) {
            setState(() => todos.removeAt(index));
          },
          child: ListTile(title: Text(todo.title)),
        );
      },
    );
  }
}`,
      },
      {
        type: 'note',
        text: 'Dismissible requires a key because rows are removed from a list. Use a stable item ID, not the index.',
      },
      {
        type: 'tip',
        text: 'Use confirmDismiss to ask for confirmation, block one swipe direction, or perform async validation before removal.',
      },
      {
        type: 'try',
        text: 'Create an email list where swiping right archives and swiping left deletes. Show different background colors and icons.',
      },
      {
        type: 'keypoints',
        items: [
          'InkWell is best for Material tap feedback; GestureDetector is lower-level.',
          'Long press can reveal menus, sheets, or selection mode.',
          'Dismissible adds swipe actions to list rows.',
          'Stable keys are essential when dismissing dynamic list items.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-packages',
    title: 'Packages & pub.dev',
    description:
      'Find, evaluate, install, import, and maintain Flutter packages from pub.dev.',
    level: 'intermediate',
    section: 'Tooling',
    order: 45,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Flutter\'s package ecosystem lets you add platform features, UI helpers, state management, networking clients, database tools, and more without writing everything yourself.',
      },
      {
        type: 'p',
        text: 'A package is a dependency listed in pubspec.yaml. pub.dev is the main package registry for Dart and Flutter.',
      },
      { type: 'h2', text: 'Install and import a package' },
      {
        type: 'code',
        language: 'bash',
        title: 'Add a package',
        code: `flutter pub add url_launcher`,
      },
      {
        type: 'code',
        language: 'yaml',
        title: 'pubspec.yaml dependency',
        code: `dependencies:
  flutter:
    sdk: flutter
  url_launcher: ^6.3.0`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Use the package',
        code: `import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class HelpLink extends StatelessWidget {
  const HelpLink({super.key});

  Future<void> openDocs() async {
    final uri = Uri.https('docs.flutter.dev');

    if (!await launchUrl(uri)) {
      throw Exception('Could not open $uri');
    }
  }

  @override
  Widget build(BuildContext context) {
    return TextButton.icon(
      onPressed: openDocs,
      icon: const Icon(Icons.open_in_new),
      label: const Text('Flutter docs'),
    );
  }
}`,
      },
      { type: 'h2', text: 'Evaluate before adding' },
      {
        type: 'table',
        headers: ['Check', 'Why it matters'],
        rows: [
          ['Pub points and likes', 'Signals quality, maintenance, and community usage.'],
          ['Last published date', 'Old packages may break on new Flutter versions.'],
          ['Platform support', 'Not every package supports web, desktop, iOS, and Android.'],
          ['Issue tracker', 'Open bugs and maintainer response show project health.'],
          ['License', 'Your app must be allowed to use the package.'],
        ],
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Maintenance commands',
        code: `flutter pub outdated
flutter pub upgrade
flutter pub deps`,
      },
      {
        type: 'note',
        text: 'pubspec.lock pins the exact versions used by your app. Commit it for application projects so builds are repeatable.',
      },
      {
        type: 'tip',
        text: 'Prefer a small, well-maintained package over a large dependency that solves many unrelated problems.',
      },
      {
        type: 'try',
        text: 'Pick one package from pub.dev. Check its platform support, last update, license, and example tab before installing it.',
      },
      {
        type: 'keypoints',
        items: [
          'pub.dev is the main registry for Dart and Flutter packages.',
          'flutter pub add updates pubspec.yaml for you.',
          'Evaluate package health before depending on it.',
          'Use pub outdated and pub upgrade to maintain dependencies.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-firebase-intro',
    title: 'Firebase Intro for Flutter',
    description:
      'Understand where Firebase fits in Flutter apps and the basic setup flow for core backend features.',
    level: 'intermediate',
    section: 'Backend Basics',
    order: 46,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Firebase is a backend platform that can provide authentication, hosted databases, file storage, analytics, crash reporting, remote config, messaging, and more.',
      },
      {
        type: 'p',
        text: 'You do not need Firebase for every Flutter app, and it is not the only backend choice. It is useful when you want managed backend features quickly without running your own servers at first.',
      },
      { type: 'h2', text: 'Common Firebase services' },
      {
        type: 'table',
        headers: ['Service', 'Typical Flutter use'],
        rows: [
          ['Firebase Auth', 'Email, social, anonymous, and phone sign-in.'],
          ['Cloud Firestore', 'Realtime document database for app data.'],
          ['Cloud Storage', 'User-uploaded images, videos, and files.'],
          ['Crashlytics', 'Production crash reports.'],
          ['Remote Config', 'Feature flags and remote app settings.'],
        ],
      },
      { type: 'h2', text: 'Setup outline' },
      {
        type: 'ol',
        items: [
          'Create a Firebase project in the Firebase console.',
          'Install the Firebase CLI and FlutterFire CLI.',
          'Run flutterfire configure to connect platforms and generate firebase_options.dart.',
          'Add firebase_core and any service packages you need.',
          'Initialize Firebase before runApp.',
        ],
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Typical setup commands',
        code: `dart pub global activate flutterfire_cli
flutter pub add firebase_core
flutterfire configure`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Initialize Firebase',
        code: `import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const MyApp());
}`,
      },
      {
        type: 'note',
        text: 'Only add the Firebase services your app actually uses. Each service has its own package, setup steps, security rules, and cost considerations.',
      },
      {
        type: 'tip',
        text: 'Design your app around repositories or service interfaces. That keeps UI code from depending directly on Firebase APIs everywhere.',
      },
      {
        type: 'try',
        text: 'Sketch a Flutter app that uses Auth and Firestore. Write which data belongs in Auth, which belongs in Firestore, and which security rules you would need.',
      },
      {
        type: 'keypoints',
        items: [
          'Firebase provides managed backend services for Flutter apps.',
          'firebase_core initializes the connection to your Firebase project.',
          'FlutterFire CLI generates platform-specific configuration.',
          'Use Firebase deliberately, with attention to security rules and costs.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-auth-patterns',
    title: 'Auth UI & Session Patterns',
    description:
      'Build authentication flows with session state, auth gates, forms, and sign-in/sign-out patterns.',
    level: 'intermediate',
    section: 'Backend Basics',
    order: 47,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Authentication is both backend logic and UI state. The app must know whether a user is signed out, signing in, signed in, or unable to restore a session.',
      },
      {
        type: 'p',
        text: 'Most Flutter apps use an auth gate near the top of the app. It watches session state and chooses between signed-out screens and the main app shell.',
      },
      { type: 'h2', text: 'Represent a session' },
      {
        type: 'code',
        language: 'dart',
        title: 'Auth state model',
        code: `sealed class AuthState {
  const AuthState();
}

class AuthLoading extends AuthState {
  const AuthLoading();
}

class SignedOut extends AuthState {
  const SignedOut();
}

class SignedIn extends AuthState {
  const SignedIn(this.user);

  final AppUser user;
}

class AppUser {
  const AppUser({required this.id, required this.email});

  final String id;
  final String email;
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'Auth gate',
        code: `class AuthGate extends StatelessWidget {
  const AuthGate({super.key, required this.authState});

  final AuthState authState;

  @override
  Widget build(BuildContext context) {
    return switch (authState) {
      AuthLoading() => const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        ),
      SignedOut() => const SignInScreen(),
      SignedIn(:final user) => AppShell(user: user),
    };
  }
}`,
      },
      { type: 'h2', text: 'Sign-in form pattern' },
      {
        type: 'code',
        language: 'dart',
        title: 'Form with loading and validation',
        code: `class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  final formKey = GlobalKey<FormState>();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  bool isSubmitting = false;

  Future<void> submit() async {
    if (!formKey.currentState!.validate()) return;

    setState(() => isSubmitting = true);

    try {
      await Future<void>.delayed(const Duration(seconds: 1));
      // Call your auth repository here.
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Sign in failed')),
      );
    } finally {
      if (mounted) {
        setState(() => isSubmitting = false);
      }
    }
  }

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Form(
        key: formKey,
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            TextFormField(
              controller: emailController,
              decoration: const InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
              validator: (value) =>
                  value == null || !value.contains('@') ? 'Enter email' : null,
            ),
            TextFormField(
              controller: passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
              validator: (value) =>
                  value == null || value.length < 8 ? 'Min 8 characters' : null,
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: isSubmitting ? null : submit,
              child: Text(isSubmitting ? 'Signing in...' : 'Sign in'),
            ),
          ],
        ),
      ),
    );
  }
}`,
      },
      {
        type: 'note',
        text: 'A restored session should be verified with your auth provider or backend. Do not trust only a locally saved "logged in" flag for protected data.',
      },
      {
        type: 'tip',
        text: 'Keep auth provider details inside an AuthRepository. UI should call signIn and signOut instead of knowing whether the backend is Firebase, Supabase, custom REST, or another service.',
      },
      {
        type: 'try',
        text: 'Add a sign-out button to AppShell. Make it call an AuthRepository.signOut method and return the app to SignedOut state.',
      },
      {
        type: 'keypoints',
        items: [
          'Auth UI should handle loading, signed-out, and signed-in states.',
          'An auth gate chooses which part of the app to show.',
          'Forms need validation, disabled submit buttons, and error feedback.',
          'Keep backend-specific auth code out of widgets.',
        ],
      },
    ],
  },
  {
    slug: 'flutter-widget-testing',
    title: 'Widget Testing Basics',
    description:
      'Write Flutter widget tests that pump widgets, find UI elements, interact with them, and assert visible behavior.',
    level: 'intermediate',
    section: 'Quality',
    order: 48,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Widget tests run Flutter widgets in a test environment. They are faster than full device tests and catch many UI regressions: missing text, broken interactions, validation behavior, and state changes.',
      },
      {
        type: 'p',
        text: 'A widget test usually pumps a widget, finds elements, performs gestures, pumps frames, and checks expectations.',
      },
      { type: 'h2', text: 'A widget worth testing' },
      {
        type: 'code',
        language: 'dart',
        title: 'CounterButton widget',
        code: `class CounterButton extends StatefulWidget {
  const CounterButton({super.key});

  @override
  State<CounterButton> createState() => _CounterButtonState();
}

class _CounterButtonState extends State<CounterButton> {
  int count = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('Count: $count'),
        ElevatedButton(
          onPressed: () => setState(() => count++),
          child: const Text('Add'),
        ),
      ],
    );
  }
}`,
      },
      {
        type: 'code',
        language: 'dart',
        title: 'test/counter_button_test.dart',
        code: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:my_app/counter_button.dart';

void main() {
  testWidgets('increments the visible count', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: CounterButton(),
        ),
      ),
    );

    expect(find.text('Count: 0'), findsOneWidget);
    expect(find.text('Count: 1'), findsNothing);

    await tester.tap(find.text('Add'));
    await tester.pump();

    expect(find.text('Count: 1'), findsOneWidget);
  });
}`,
      },
      { type: 'h2', text: 'Test form validation' },
      {
        type: 'code',
        language: 'dart',
        title: 'Entering text and submitting',
        code: `testWidgets('shows validation error for short password', (tester) async {
  await tester.pumpWidget(const MaterialApp(home: SignInScreen()));

  await tester.enterText(
    find.byType(TextFormField).first,
    'ada@example.com',
  );
  await tester.enterText(
    find.byType(TextFormField).last,
    'short',
  );

  await tester.tap(find.text('Sign in'));
  await tester.pump();

  expect(find.text('Min 8 characters'), findsOneWidget);
});`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Run tests',
        code: `flutter test`,
      },
      {
        type: 'table',
        headers: ['Finder', 'Use'],
        rows: [
          ['find.text("Save")', 'Locate visible text.'],
          ['find.byType(TextField)', 'Locate widgets by class.'],
          ['find.byKey(ValueKey("submit"))', 'Locate a specific widget with a stable key.'],
          ['find.byIcon(Icons.add)', 'Locate icon buttons and icon widgets.'],
        ],
      },
      {
        type: 'note',
        text: 'Wrap widgets in MaterialApp, Scaffold, Provider, or other ancestors they need. Test failures often come from missing inherited context.',
      },
      {
        type: 'tip',
        text: 'Prefer testing visible behavior over private implementation details. A user does not care what variable changed; they care what the screen shows and does.',
      },
      {
        type: 'try',
        text: 'Write a widget test for a TodoTile. Verify the title appears, tap the checkbox, pump, and expect the completed style or icon to appear.',
      },
      {
        type: 'keypoints',
        items: [
          'Widget tests verify Flutter UI behavior without a real device.',
          'pumpWidget builds the widget tree for the test.',
          'Finder objects locate text, types, keys, and icons.',
          'tap, enterText, and pump let tests interact with the UI and assert results.',
        ],
      },
    ],
  },
];
