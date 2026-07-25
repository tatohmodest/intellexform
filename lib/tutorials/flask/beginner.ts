import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: "what-is-flask",
    title: "What is Flask?",
    description: "Learn what Flask is, why it is called a microframework, and what kinds of Python web apps it can build.",
    level: "beginner",
    section: "Getting Started",
    order: 1,
    minutes: 8,
    content: [
      { type: "p", text: "Flask is a lightweight Python web framework. It helps you turn Python functions into web pages, APIs, forms, dashboards, and small web applications." },
      { type: "p", text: "Flask is called a microframework because the core is intentionally small. It gives you routing, requests, responses, templates, sessions, and helpful tools, then lets you choose extra packages when your app needs them." },
      { type: "h2", text: "What Flask gives you" },
      { type: "p", text: "A web framework handles common web work so you can focus on your application. Flask connects URLs to Python functions, reads form data, renders HTML templates, returns JSON, and manages small pieces of user state." },
      {
        type: "table",
        headers: ["Need", "Flask feature"],
        rows: [
          ["Show pages", "Routes and view functions"],
          ["Display HTML", "Jinja2 templates"],
          ["Handle forms", "The request object"],
          ["Return API data", "JSON responses"],
          ["Remember users briefly", "Sessions and cookies"],
        ],
      },
      { type: "h2", text: "A tiny Flask app" },
      { type: "p", text: "A Flask app can begin in one file. The app object receives requests, and a route decorator maps a URL to a function." },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask

app = Flask(__name__)


@app.get("/")
def home():
    return "Hello, Flask!"`,
      },
      {
        type: "code",
        title: "Run the app",
        language: "bash",
        code: `flask --app app run --debug`,
      },
      { type: "h2", text: "Where Flask fits" },
      { type: "p", text: "Flask is great for learning web fundamentals because you can see each piece clearly. You can start with a few routes, then add templates, forms, a database, authentication, and blueprints as the app grows." },
      { type: "tip", text: "If you know Python functions, dictionaries, lists, and modules, you know enough Python to start learning Flask." },
      { type: "try", text: "Imagine a simple notes website. List three URLs it might need, such as a home page, a list of notes, and a page for creating a note." },
      { type: "keypoints", items: ["Flask is a lightweight Python web framework.", "Routes connect URLs to Python functions.", "Jinja templates help Flask return HTML pages.", "Flask starts small and lets you add packages as needed.", "This course uses modern Flask 3.x command and routing patterns."] },
    ],
  },
  {
    slug: "flask-vs-django",
    title: "Flask vs Django (When to Choose)",
    description: "Compare Flask and Django so you can choose the right Python web framework for different beginner projects.",
    level: "beginner",
    section: "Getting Started",
    order: 2,
    minutes: 9,
    content: [
      { type: "p", text: "Flask and Django are both popular Python web frameworks. They can build many of the same kinds of applications, but they start from different philosophies." },
      { type: "p", text: "Flask gives you a small, flexible foundation. Django gives you a larger full-stack framework with many official features included from the beginning." },
      { type: "h2", text: "The short comparison" },
      {
        type: "table",
        headers: ["Question", "Flask", "Django"],
        rows: [
          ["Starting size", "Small and minimal", "Larger and feature-rich"],
          ["Project decisions", "You choose many tools", "Many choices are already made"],
          ["Admin site", "Add a package or build one", "Included"],
          ["Database layer", "Choose an extension such as Flask-SQLAlchemy", "Built-in ORM"],
          ["Best first use", "Small apps, APIs, prototypes, learning fundamentals", "Database-backed sites with admin, auth, and forms"],
        ],
      },
      { type: "h2", text: "Flask starts with the route" },
      { type: "p", text: "In Flask, the first thing you often write is a route. This makes Flask feel direct and friendly when learning how web requests become responses." },
      {
        type: "code",
        title: "Small Flask route",
        language: "python",
        code: `from flask import Flask

app = Flask(__name__)


@app.get("/courses")
def courses():
    return "Course list coming soon"`,
      },
      { type: "h2", text: "Django starts with more structure" },
      { type: "p", text: "Django projects usually include settings, URL configuration, apps, models, migrations, templates, and an admin area. That structure is helpful when the application is clearly large." },
      {
        type: "code",
        title: "Typical Django setup command",
        language: "bash",
        code: `django-admin startproject school_site
python manage.py startapp courses`,
      },
      { type: "h2", text: "When to choose Flask" },
      { type: "ul", items: ["You want to understand web basics one piece at a time.", "You are building a small app, internal tool, or JSON API.", "You want freedom to choose database, forms, auth, and project layout.", "You like starting simple and adding structure only when it helps."] },
      { type: "note", text: "Framework choice is not a personality test. A professional developer can choose Flask for one project and Django for another based on the requirements." },
      { type: "try", text: "For a recipe app with public pages, a few forms, and no admin requirement, explain why Flask could be a comfortable first choice." },
      { type: "keypoints", items: ["Flask is smaller and more flexible than Django.", "Django includes more official features by default.", "Choose Flask when you want a lightweight start or more control.", "Choose Django when you need a full built-in stack quickly.", "Both frameworks are good Python web tools."] },
    ],
  },
  {
    slug: "flask-setup",
    title: "Install Flask & Virtual Environments",
    description: "Set up a Flask 3.x project with a virtual environment, install Flask, and confirm the command line tools work.",
    level: "beginner",
    section: "Getting Started",
    order: 3,
    minutes: 12,
    content: [
      { type: "p", text: "Before writing Flask code, create a project folder and a virtual environment. A virtual environment keeps the packages for one project separate from packages used by other projects." },
      { type: "p", text: "This lesson assumes you already have Python installed and know how to open a terminal." },
      { type: "h2", text: "Create a project folder" },
      {
        type: "code",
        title: "Terminal",
        language: "bash",
        code: `mkdir flask-notes
cd flask-notes`,
      },
      { type: "h2", text: "Create and activate a virtual environment" },
      { type: "p", text: "The virtual environment folder is commonly named `.venv`. It should stay inside the project and should not be committed to Git." },
      {
        type: "code",
        title: "macOS or Linux",
        language: "bash",
        code: `python3 -m venv .venv
source .venv/bin/activate`,
      },
      {
        type: "code",
        title: "Windows PowerShell",
        language: "bash",
        code: `py -m venv .venv
.venv\\Scripts\\Activate.ps1`,
      },
      { type: "h2", text: "Install Flask" },
      { type: "p", text: "Install Flask from PyPI with pip. This installs Flask and its core dependencies, including Werkzeug, Jinja2, Click, ItsDangerous, and Blinker." },
      {
        type: "code",
        title: "Install and verify",
        language: "bash",
        code: `python -m pip install --upgrade pip
python -m pip install Flask
python -m flask --version`,
      },
      { type: "h2", text: "Save dependencies" },
      { type: "p", text: "A requirements file records the packages needed to recreate the environment later." },
      {
        type: "code",
        title: "requirements.txt",
        language: "bash",
        code: `python -m pip freeze > requirements.txt`,
      },
      { type: "note", text: "When the virtual environment is active, terminal prompts often show `(.venv)`. That is a reminder that Python and pip are using the project environment." },
      { type: "try", text: "Create a new folder named `flask-shop-list`, make a virtual environment, activate it, install Flask, and run `python -m flask --version`." },
      { type: "keypoints", items: ["Use a virtual environment for each Flask project.", "Install Flask with pip inside the active environment.", "Use `python -m flask --version` to confirm Flask is available.", "Record dependencies in `requirements.txt` for reproducible setup.", "Do not commit the `.venv` folder."] },
    ],
  },
  {
    slug: "flask-first-app",
    title: "Your First Flask App",
    description: "Create a first Flask app with routes, simple responses, and the modern `flask --app` command.",
    level: "beginner",
    section: "Getting Started",
    order: 4,
    minutes: 12,
    content: [
      { type: "p", text: "A Flask application begins with an application object. The app object knows how to receive web requests and send web responses." },
      { type: "p", text: "In this lesson, you will create a tiny notes app with a home page and a notes page." },
      { type: "h2", text: "Create `app.py`" },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask

app = Flask(__name__)


@app.get("/")
def home():
    return "Welcome to Flask Notes"


@app.get("/notes")
def notes():
    return "No notes yet, but the app is running!"`,
      },
      { type: "h2", text: "Run the app" },
      { type: "p", text: "Use the Flask command line interface. The `--app app` option means Flask should import the `app.py` module. The `run` command starts the development server." },
      {
        type: "code",
        title: "Terminal",
        language: "bash",
        code: `flask --app app run`,
      },
      { type: "h2", text: "Open the URLs" },
      { type: "p", text: "By default, Flask shows your app at `http://127.0.0.1:5000`. Visit `/` for the home page and `/notes` for the notes page." },
      {
        type: "code",
        title: "URLs to try",
        language: "text",
        code: `http://127.0.0.1:5000/
http://127.0.0.1:5000/notes`,
      },
      { type: "h2", text: "Return HTML strings" },
      { type: "p", text: "A response can be plain text or HTML. Templates are better for real pages, but short HTML strings are useful while learning." },
      {
        type: "code",
        title: "HTML response from a view",
        language: "python",
        code: `@app.get("/about")
def about():
    return "<h1>About Flask Notes</h1><p>A tiny learning app.</p>"`,
      },
      { type: "tip", text: "Keep your first app small. One file with a few routes is enough to understand the request and response cycle." },
      { type: "try", text: "Add a `/contact` route that returns an email address or a short contact message." },
      { type: "keypoints", items: ["Create the Flask app object with `Flask(__name__)`.", "Use route decorators such as `@app.get('/')` to connect URLs to functions.", "Run modern Flask apps with `flask --app app run`.", "The development server usually runs on port 5000.", "View functions return response content."] },
    ],
  },
  {
    slug: "flask-dev-server",
    title: "Dev Server, Debug Mode & Reloader",
    description: "Use the Flask development server safely, understand debug mode, and work with the automatic reloader.",
    level: "beginner",
    section: "Getting Started",
    order: 5,
    minutes: 10,
    content: [
      { type: "p", text: "Flask includes a development server for local work. It is convenient while learning, but it is not the production server you use for a deployed public website." },
      { type: "p", text: "Debug mode makes local development friendlier by showing detailed errors and restarting the server when files change." },
      { type: "h2", text: "Start debug mode" },
      {
        type: "code",
        title: "Terminal",
        language: "bash",
        code: `flask --app app run --debug`,
      },
      { type: "h2", text: "What debug mode does" },
      { type: "ul", items: ["Enables the interactive debugger for local errors.", "Turns on the reloader so changes usually restart the app automatically.", "Shows useful traceback details in the terminal and browser.", "Makes mistakes faster to find while you are learning."] },
      { type: "h2", text: "Try an intentional error" },
      { type: "p", text: "If a view raises an exception in debug mode, Flask shows a helpful error page. This is useful locally and dangerous in production." },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask

app = Flask(__name__)


@app.get("/")
def home():
    return "Home page"


@app.get("/broken")
def broken():
    raise RuntimeError("This route is only for testing debug mode")`,
      },
      { type: "h2", text: "Choose a host or port" },
      { type: "p", text: "You can change the port when another process is already using 5000. Binding to all interfaces is useful in containers or cloud environments." },
      {
        type: "code",
        title: "Custom host and port",
        language: "bash",
        code: `flask --app app run --debug --host 0.0.0.0 --port 8000`,
      },
      { type: "warning", text: "Never expose the Flask debug server or interactive debugger on the public internet. Use it only for trusted local development." },
      { type: "try", text: "Run your app with `--debug`, change the text returned by the home route, save the file, and refresh the browser." },
      { type: "keypoints", items: ["Use `flask --app app run --debug` for local development.", "Debug mode shows detailed errors and enables the reloader.", "The development server is not a production web server.", "Use `--port` when the default port is busy.", "Disable debug mode for deployed apps."] },
    ],
  },
  {
    slug: "flask-routing",
    title: "Routes & View Functions",
    description: "Learn how Flask routes map URLs to view functions and how to organize simple page handlers.",
    level: "beginner",
    section: "Routing",
    order: 6,
    minutes: 11,
    content: [
      { type: "p", text: "Routing is the process of matching a URL to code. In Flask, a route decorator sits above a view function. When a matching request arrives, Flask calls the function." },
      { type: "p", text: "View functions should do one clear job: receive a request, prepare data, and return a response." },
      { type: "h2", text: "Basic routes" },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask

app = Flask(__name__)


@app.get("/")
def home():
    return "Course Home"


@app.get("/courses")
def course_list():
    return "Python, Flask, SQL"


@app.get("/about")
def about():
    return "About this learning site"`,
      },
      { type: "h2", text: "Decorators connect URLs to functions" },
      { type: "p", text: "The URL path goes inside the decorator. The function name becomes the endpoint name unless you choose a custom one." },
      {
        type: "code",
        title: "One route, one endpoint",
        language: "python",
        code: `@app.get("/help")
def help_page():
    return "How can we help?"`,
      },
      { type: "h2", text: "Trailing slashes" },
      { type: "p", text: "Flask treats `/projects` and `/projects/` differently. A rule ending in a slash behaves like a folder and may redirect from the no-slash version." },
      {
        type: "code",
        title: "Slash behavior",
        language: "python",
        code: `@app.get("/projects/")
def projects():
    return "Project index"`,
      },
      { type: "h2", text: "Keep routes readable" },
      { type: "ul", items: ["Use nouns for pages, such as `/courses` and `/profile`.", "Use clear function names, such as `course_list` and `profile`.", "Avoid doing too much work inside one route.", "Move repeated data or helper logic into separate functions as your app grows."] },
      { type: "tip", text: "Start with `@app.get()` for pages that only display information. Add other methods later when a route needs to receive submitted data." },
      { type: "try", text: "Create a small shop list app with routes for `/`, `/items`, and `/about`. Return a different short message from each route." },
      { type: "keypoints", items: ["Routes map URL paths to view functions.", "The decorator sits directly above the function it belongs to.", "A view function returns the response for a request.", "Function names are also endpoint names by default.", "Trailing slashes affect how URLs match."] },
    ],
  },
  {
    slug: "flask-dynamic-routes",
    title: "Dynamic Routes & Converters",
    description: "Use dynamic URL segments and converters to capture values from paths in Flask routes.",
    level: "beginner",
    section: "Routing",
    order: 7,
    minutes: 11,
    content: [
      { type: "p", text: "Dynamic routes let part of the URL become a Python value. They are useful for profile pages, note details, product pages, and any page identified by an ID or slug." },
      { type: "p", text: "Flask captures dynamic segments with angle brackets, then passes the values as arguments to the view function." },
      { type: "h2", text: "Capture a text value" },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask

app = Flask(__name__)


@app.get("/users/<username>")
def profile(username):
    return f"Profile page for {username}"`,
      },
      { type: "h2", text: "Use converters" },
      { type: "p", text: "Converters tell Flask what kind of value should match. For example, `<int:note_id>` only matches integer path segments and passes an `int` to the function." },
      {
        type: "code",
        title: "Route converters",
        language: "python",
        code: `notes = {
    1: "Buy notebooks",
    2: "Read Flask docs",
}


@app.get("/notes/<int:note_id>")
def note_detail(note_id):
    note = notes.get(note_id)
    if note is None:
        return "Note not found", 404
    return note`,
      },
      { type: "h2", text: "Common converters" },
      {
        type: "table",
        headers: ["Converter", "Example", "Matches"],
        rows: [
          ["string", "/tags/<name>", "Text without slashes"],
          ["int", "/notes/<int:note_id>", "Whole numbers"],
          ["float", "/prices/<float:amount>", "Decimal numbers"],
          ["path", "/files/<path:filename>", "Text that may include slashes"],
          ["uuid", "/orders/<uuid:order_id>", "UUID values"],
        ],
      },
      { type: "h2", text: "Build readable detail URLs" },
      {
        type: "code",
        title: "Course slug route",
        language: "python",
        code: `@app.get("/courses/<slug>")
def course_detail(slug):
    return f"Showing course: {slug}"`,
      },
      { type: "note", text: "Dynamic values come from the URL, so treat them as user input. Validate them before using them for sensitive work." },
      { type: "try", text: "Add a route `/items/<int:item_id>` to a shop list app. Return a special message for item 1 and a 404 tuple for unknown IDs." },
      { type: "keypoints", items: ["Use angle brackets to capture dynamic path values.", "View function parameters must match the dynamic segment names.", "Converters such as `int` and `path` control what matches.", "Return a 404 status code when a requested resource does not exist.", "Dynamic routes are ideal for detail pages."] },
    ],
  },
  {
    slug: "flask-http-methods",
    title: "GET, POST & Other Methods",
    description: "Understand HTTP methods and configure Flask routes that respond to GET, POST, and other request types.",
    level: "beginner",
    section: "Routing",
    order: 8,
    minutes: 12,
    content: [
      { type: "p", text: "HTTP methods describe what the browser or client wants to do. A GET request usually asks for information. A POST request usually sends data to create or submit something." },
      { type: "p", text: "Modern Flask provides shortcuts such as `@app.get()` and `@app.post()` as readable alternatives to writing a methods list every time." },
      { type: "h2", text: "GET routes display information" },
      {
        type: "code",
        title: "GET route",
        language: "python",
        code: `from flask import Flask

app = Flask(__name__)


@app.get("/notes")
def notes():
    return "Show all notes"`,
      },
      { type: "h2", text: "POST routes receive submitted data" },
      { type: "p", text: "A POST route is commonly used for forms. You will learn form handling in detail later, but this example shows the routing idea." },
      {
        type: "code",
        title: "POST route",
        language: "python",
        code: `@app.post("/notes")
def create_note():
    return "Create a new note", 201`,
      },
      { type: "h2", text: "One route can accept multiple methods" },
      { type: "p", text: "Sometimes the same URL displays a form on GET and processes the form on POST. In that case, use `@app.route()` with a methods list." },
      {
        type: "code",
        title: "GET and POST together",
        language: "python",
        code: `from flask import request


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        return "Thanks for the message"
    return "Show the contact form"`,
      },
      { type: "h2", text: "Common HTTP methods" },
      {
        type: "table",
        headers: ["Method", "Common meaning", "Example"],
        rows: [
          ["GET", "Read or display data", "Show a list of notes"],
          ["POST", "Create or submit data", "Add a new note"],
          ["PUT", "Replace data", "Update a whole profile"],
          ["PATCH", "Partially update data", "Mark one task as done"],
          ["DELETE", "Delete data", "Remove a note"],
        ],
      },
      { type: "tip", text: "Use the most specific decorator when possible. `@app.get('/path')` communicates intent more clearly than a generic route with a methods list." },
      { type: "try", text: "Create `/items` as a GET route and `/items` as a POST route. Return different text from each route so you can see which method is used." },
      { type: "keypoints", items: ["GET requests usually read or display information.", "POST requests usually submit or create information.", "Flask 3.x supports readable method decorators such as `@app.get()` and `@app.post()`.", "Use `@app.route(..., methods=[...])` when one function handles multiple methods.", "The request method is available as `request.method`."] },
    ],
  },
  {
    slug: "flask-url-for",
    title: "url_for & Endpoint Names",
    description: "Generate URLs with `url_for()` instead of hardcoding paths in Flask views and templates.",
    level: "beginner",
    section: "Routing",
    order: 9,
    minutes: 10,
    content: [
      { type: "p", text: "`url_for()` builds a URL for a Flask endpoint. This helps avoid broken links when a path changes later." },
      { type: "p", text: "By default, the endpoint name is the view function name. A function named `course_list` can be linked with `url_for('course_list')`." },
      { type: "h2", text: "Generate URLs in Python" },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask, redirect, url_for

app = Flask(__name__)


@app.get("/")
def home():
    return "Home"


@app.get("/courses")
def course_list():
    return "Course list"


@app.get("/start")
def start():
    return redirect(url_for("course_list"))`,
      },
      { type: "h2", text: "Pass dynamic values" },
      { type: "p", text: "If the route has a dynamic segment, pass the value as a keyword argument to `url_for()`." },
      {
        type: "code",
        title: "Dynamic URL generation",
        language: "python",
        code: `@app.get("/courses/<slug>")
def course_detail(slug):
    return f"Course detail: {slug}"


@app.get("/featured")
def featured_course():
    return redirect(url_for("course_detail", slug="flask-basics"))`,
      },
      { type: "h2", text: "Use `url_for` in templates" },
      { type: "p", text: "Templates can also call `url_for()`. This is the normal way to create links to routes and static files." },
      {
        type: "code",
        title: "templates/nav.html",
        language: "html",
        code: `<nav>
  <a href="{{ url_for('home') }}">Home</a>
  <a href="{{ url_for('course_list') }}">Courses</a>
  <a href="{{ url_for('course_detail', slug='flask-basics') }}">Flask Basics</a>
</nav>`,
      },
      { type: "h2", text: "Why not hardcode links?" },
      { type: "p", text: "Hardcoded links are easy at first, but they spread URL details throughout your app. Endpoint names let you update a route path in one place." },
      { type: "tip", text: "Think in endpoints, not paths. The endpoint is the stable name for the view; the URL path is how users reach it." },
      { type: "try", text: "Create a `/notes/<int:note_id>` route and a `/latest` route that redirects to note 1 using `url_for()`." },
      { type: "keypoints", items: ["`url_for()` builds URLs from endpoint names.", "Endpoint names are view function names by default.", "Pass dynamic route values as keyword arguments.", "Use `url_for()` in templates for links and static assets.", "Generated URLs are easier to maintain than hardcoded paths."] },
    ],
  },
  {
    slug: "flask-request",
    title: "The request Object",
    description: "Read query strings, form data, headers, and JSON input from Flask requests.",
    level: "beginner",
    section: "Request & Response",
    order: 10,
    minutes: 12,
    content: [
      { type: "p", text: "The `request` object represents the incoming HTTP request. It contains the method, query string, form data, JSON body, headers, cookies, and other details." },
      { type: "p", text: "Import `request` from Flask inside the modules that need it. Flask makes sure `request` points to the current request while a view is running." },
      { type: "h2", text: "Read query string values" },
      { type: "p", text: "Query string values appear after `?` in a URL, such as `/search?q=flask`. They are commonly used for search terms, filters, and page numbers." },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask, request

app = Flask(__name__)


@app.get("/search")
def search():
    query = request.args.get("q", "")
    return f"Searching for: {query}"`,
      },
      { type: "h2", text: "Read form data" },
      { type: "p", text: "Form data from a submitted HTML form is available in `request.form`. Use `.get()` when a field may be missing." },
      {
        type: "code",
        title: "Form handler",
        language: "python",
        code: `@app.post("/notes")
def create_note():
    title = request.form.get("title", "").strip()
    body = request.form.get("body", "").strip()

    if not title:
        return "Title is required", 400

    return f"Saved note: {title}"`,
      },
      { type: "h2", text: "Read JSON data" },
      { type: "p", text: "JSON request bodies are common in APIs. Use `request.get_json()` to parse the body into Python data." },
      {
        type: "code",
        title: "JSON input",
        language: "python",
        code: `@app.post("/api/notes")
def create_note_api():
    data = request.get_json(silent=True) or {}
    title = data.get("title", "").strip()

    if not title:
        return {"error": "Title is required"}, 400

    return {"title": title}, 201`,
      },
      { type: "h2", text: "Other useful request properties" },
      { type: "ul", items: ["`request.method` is the HTTP method.", "`request.path` is the requested path.", "`request.headers` contains HTTP headers.", "`request.cookies` contains cookies sent by the browser.", "`request.files` contains uploaded files."] },
      { type: "note", text: "Request data comes from the browser or client. Validate and clean it before trusting it." },
      { type: "try", text: "Create a `/hello` route that reads a query string value named `name` and returns `Hello, name`. Use `Friend` as the default." },
      { type: "keypoints", items: ["The `request` object describes the current incoming request.", "Use `request.args` for query string values.", "Use `request.form` for HTML form submissions.", "Use `request.get_json()` for JSON request bodies.", "Always validate user input before using it."] },
    ],
  },
  {
    slug: "flask-response",
    title: "Responses, JSON & Status Codes",
    description: "Return strings, HTML, JSON, tuples, response objects, and meaningful status codes from Flask views.",
    level: "beginner",
    section: "Request & Response",
    order: 11,
    minutes: 12,
    content: [
      { type: "p", text: "Every Flask view returns a response. A response includes body content, a status code, and headers." },
      { type: "p", text: "Flask accepts several return styles. Beginners often start with strings, then use templates, JSON dictionaries, tuples, and full response objects when needed." },
      { type: "h2", text: "Return text or HTML" },
      {
        type: "code",
        title: "Simple responses",
        language: "python",
        code: `from flask import Flask

app = Flask(__name__)


@app.get("/")
def home():
    return "Welcome"


@app.get("/about")
def about():
    return "<h1>About</h1><p>This is a Flask app.</p>"`,
      },
      { type: "h2", text: "Return status codes" },
      { type: "p", text: "A tuple can include response body and status code. This is helpful for success, validation errors, and not found messages." },
      {
        type: "code",
        title: "Body plus status",
        language: "python",
        code: `@app.get("/notes/<int:note_id>")
def note_detail(note_id):
    notes = {1: "Learn Flask"}
    note = notes.get(note_id)

    if note is None:
        return "Note not found", 404

    return note, 200`,
      },
      { type: "h2", text: "Return JSON" },
      { type: "p", text: "In modern Flask, returning a dictionary or list automatically creates a JSON response. You can also use `jsonify()` when you want an explicit helper." },
      {
        type: "code",
        title: "JSON API route",
        language: "python",
        code: `@app.get("/api/notes")
def notes_api():
    notes = [
        {"id": 1, "title": "Install Flask"},
        {"id": 2, "title": "Write routes"},
    ]
    return {"notes": notes}`,
      },
      { type: "h2", text: "Customize headers" },
      {
        type: "code",
        title: "Response object",
        language: "python",
        code: `from flask import make_response


@app.get("/download-info")
def download_info():
    response = make_response("Download will be ready soon")
    response.headers["X-App-Name"] = "Flask Notes"
    return response`,
      },
      { type: "note", text: "Status codes matter. A page that failed validation should not return 200 OK just because it displayed an error message." },
      { type: "try", text: "Create `/api/items` that returns a JSON object with an `items` list and a 200 status code. Then create `/api/items/99` that returns an error object with 404." },
      { type: "keypoints", items: ["Flask views return responses.", "A tuple can include body and status code.", "Dictionaries and lists become JSON responses in modern Flask.", "Use 201 for successful creation and 404 for missing resources.", "Use `make_response()` when you need to adjust headers or cookies."] },
    ],
  },
  {
    slug: "flask-redirects",
    title: "Redirects & abort()",
    description: "Send users to another URL with redirects and stop requests with `abort()` for standard error responses.",
    level: "beginner",
    section: "Request & Response",
    order: 12,
    minutes: 10,
    content: [
      { type: "p", text: "A redirect tells the browser to make a new request to another URL. Redirects are common after forms, login actions, and old URLs that have moved." },
      { type: "p", text: "`abort()` stops the current request and raises a standard HTTP error, such as 404 Not Found or 403 Forbidden." },
      { type: "h2", text: "Redirect after an action" },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask, redirect, url_for

app = Flask(__name__)


@app.get("/")
def home():
    return "Home"


@app.post("/notes")
def create_note():
    # Save the note here in a real app.
    return redirect(url_for("home"))`,
      },
      { type: "h2", text: "Why redirect after POST?" },
      { type: "p", text: "After a form submission, redirecting prevents the browser from resubmitting the same data when the user refreshes. This pattern is often called Post/Redirect/Get." },
      {
        type: "code",
        title: "Post/Redirect/Get shape",
        language: "text",
        code: `GET  /notes/new   -> show the form
POST /notes       -> process the form
302  redirect     -> send browser to /notes
GET  /notes       -> show the updated list`,
      },
      { type: "h2", text: "Abort with an HTTP error" },
      {
        type: "code",
        title: "abort() example",
        language: "python",
        code: `from flask import abort

notes = {1: "Learn redirects"}


@app.get("/notes/<int:note_id>")
def note_detail(note_id):
    note = notes.get(note_id)
    if note is None:
        abort(404)
    return note`,
      },
      { type: "h2", text: "Common abort codes" },
      {
        type: "table",
        headers: ["Code", "Meaning", "Beginner example"],
        rows: [
          ["400", "Bad Request", "Missing required input"],
          ["401", "Unauthorized", "Login required"],
          ["403", "Forbidden", "User is not allowed"],
          ["404", "Not Found", "Note does not exist"],
        ],
      },
      { type: "tip", text: "Combine `redirect()` with `url_for()` so the redirect target is generated from an endpoint name instead of a hardcoded path." },
      { type: "try", text: "Create a `/go-home` route that redirects to `/` using `url_for()`. Then create a detail route that calls `abort(404)` when an item ID is missing." },
      { type: "keypoints", items: ["Use `redirect()` to send the browser to another URL.", "Use `url_for()` to build redirect targets.", "Redirect after POST to avoid duplicate form submissions.", "Use `abort()` for standard HTTP error responses.", "Custom error pages can make abort responses friendlier."] },
    ],
  },
  {
    slug: "flask-templates",
    title: "Jinja2 Templates Basics",
    description: "Render HTML templates with Flask and pass Python data into Jinja2 pages.",
    level: "beginner",
    section: "Templates",
    order: 13,
    minutes: 13,
    content: [
      { type: "p", text: "Templates let you keep HTML in separate files instead of returning long strings from Python functions. Flask uses the Jinja2 template engine." },
      { type: "p", text: "By default, Flask looks for templates inside a folder named `templates` beside your `app.py` file." },
      { type: "h2", text: "Create the folder structure" },
      {
        type: "code",
        title: "Project files",
        language: "text",
        code: `flask-notes/
  app.py
  templates/
    index.html`,
      },
      { type: "h2", text: "Render a template" },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask, render_template

app = Flask(__name__)


@app.get("/")
def home():
    title = "Flask Notes"
    notes = ["Install Flask", "Create a route", "Render a template"]
    return render_template("index.html", title=title, notes=notes)`,
      },
      { type: "h2", text: "Use variables and loops" },
      {
        type: "code",
        title: "templates/index.html",
        language: "html",
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
  </head>
  <body>
    <h1>{{ title }}</h1>

    <ul>
      {% for note in notes %}
        <li>{{ note }}</li>
      {% endfor %}
    </ul>
  </body>
</html>`,
      },
      { type: "h2", text: "Escaping keeps pages safer" },
      { type: "p", text: "Jinja escapes variables by default in HTML templates. If a note contains `<script>`, Jinja displays it as text instead of running it as code." },
      { type: "h2", text: "Pass dictionaries" },
      {
        type: "code",
        title: "Template data",
        language: "python",
        code: `@app.get("/profile")
def profile():
    user = {"name": "Maya", "role": "Student"}
    return render_template("profile.html", user=user)`,
      },
      { type: "tip", text: "Use templates for HTML pages and keep Python code focused on data preparation and decisions." },
      { type: "try", text: "Create `templates/courses.html` and render a list of three course names from a `/courses` route." },
      { type: "keypoints", items: ["Flask uses Jinja2 templates for HTML.", "Templates live in the `templates/` folder by default.", "Use `render_template()` to render a template file.", "Pass data as keyword arguments.", "Jinja variables use `{{ }}` and control structures use `{% %}`."] },
    ],
  },
  {
    slug: "flask-template-inheritance",
    title: "Template Inheritance",
    description: "Create a shared base template with Jinja blocks so pages can reuse layout, navigation, and structure.",
    level: "beginner",
    section: "Templates",
    order: 14,
    minutes: 12,
    content: [
      { type: "p", text: "Most websites repeat the same layout on many pages: doctype, head, navigation, main area, and footer. Template inheritance lets you define that shared structure once." },
      { type: "p", text: "A child template extends a base template and fills named blocks with page-specific content." },
      { type: "h2", text: "Create a base template" },
      {
        type: "code",
        title: "templates/base.html",
        language: "html",
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{% block title %}Flask Notes{% endblock %}</title>
  </head>
  <body>
    <nav>
      <a href="{{ url_for('home') }}">Home</a>
      <a href="{{ url_for('note_list') }}">Notes</a>
    </nav>

    <main>
      {% block content %}{% endblock %}
    </main>
  </body>
</html>`,
      },
      { type: "h2", text: "Extend the base template" },
      {
        type: "code",
        title: "templates/index.html",
        language: "html",
        code: `{% extends "base.html" %}

{% block title %}Home - Flask Notes{% endblock %}

{% block content %}
  <h1>Welcome to Flask Notes</h1>
  <p>Write small notes while learning Flask.</p>
{% endblock %}`,
      },
      { type: "h2", text: "Render normal views" },
      { type: "p", text: "The Python route does not need to know that inheritance is happening. It simply renders the child template." },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask, render_template

app = Flask(__name__)


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/notes")
def note_list():
    notes = ["Learn templates", "Reuse layout"]
    return render_template("notes.html", notes=notes)`,
      },
      { type: "h2", text: "A second child template" },
      {
        type: "code",
        title: "templates/notes.html",
        language: "html",
        code: `{% extends "base.html" %}

{% block title %}Notes - Flask Notes{% endblock %}

{% block content %}
  <h1>Notes</h1>
  <ul>
    {% for note in notes %}
      <li>{{ note }}</li>
    {% endfor %}
  </ul>
{% endblock %}`,
      },
      { type: "note", text: "Template inheritance reduces duplication. When navigation changes, edit `base.html` once instead of editing every page." },
      { type: "try", text: "Add an `about.html` child template that extends `base.html`, fills the title block, and shows a short paragraph in the content block." },
      { type: "keypoints", items: ["Template inheritance shares layout across pages.", "A base template defines named blocks.", "Child templates use `{% extends %}` and fill blocks.", "Routes render child templates normally.", "Shared navigation belongs in the base template."] },
    ],
  },
  {
    slug: "flask-template-filters",
    title: "Template Filters & Control Structures",
    description: "Use Jinja filters, if statements, loops, and empty states to make templates more expressive.",
    level: "beginner",
    section: "Templates",
    order: 15,
    minutes: 12,
    content: [
      { type: "p", text: "Jinja templates can do more than display variables. Filters transform values, and control structures decide what HTML appears." },
      { type: "p", text: "Keep heavy business logic in Python, but use template features for presentation decisions such as formatting, loops, and empty states." },
      { type: "h2", text: "Use filters" },
      {
        type: "code",
        title: "templates/profile.html",
        language: "html",
        code: `<h1>{{ user.name|title }}</h1>
<p>Email: {{ user.email|lower }}</p>
<p>Bio length: {{ user.bio|length }} characters</p>
<p>{{ user.bio|default("No bio yet.") }}</p>`,
      },
      { type: "h2", text: "Use if statements" },
      {
        type: "code",
        title: "templates/dashboard.html",
        language: "html",
        code: `{% if current_user %}
  <h1>Welcome, {{ current_user.name }}</h1>
{% else %}
  <h1>Welcome, guest</h1>
  <p>Please sign in to save your notes.</p>
{% endif %}`,
      },
      { type: "h2", text: "Loop with an empty state" },
      { type: "p", text: "Jinja has a useful `else` block for loops. It runs when the list is empty." },
      {
        type: "code",
        title: "templates/notes.html",
        language: "html",
        code: `<ul>
  {% for note in notes %}
    <li>
      <strong>{{ note.title }}</strong>
      {% if note.done %}
        <span>Done</span>
      {% endif %}
    </li>
  {% else %}
    <li>No notes yet.</li>
  {% endfor %}
</ul>`,
      },
      { type: "h2", text: "Prepare clean data in Python" },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `@app.get("/notes")
def note_list():
    notes = [
        {"title": "install flask", "done": True},
        {"title": "learn jinja", "done": False},
    ]
    return render_template("notes.html", notes=notes)`,
      },
      { type: "tip", text: "If a template starts to look like a full program, move decisions back into Python and pass simpler data to the template." },
      { type: "try", text: "Render a list of shop items. Use `|title` for item names, show `In cart` only when `item.in_cart` is true, and show `No items yet` for an empty list." },
      { type: "keypoints", items: ["Filters transform displayed values with the pipe syntax.", "Use `{% if %}` for conditional HTML.", "Use `{% for %}` to loop through lists.", "A Jinja loop can include an `{% else %}` empty state.", "Keep complex application rules in Python rather than templates."] },
    ],
  },
  {
    slug: "flask-static",
    title: "Static Files (CSS/JS/Images)",
    description: "Serve CSS, JavaScript, and images from Flask's `static/` folder and link to them with `url_for()`.",
    level: "beginner",
    section: "Templates",
    order: 16,
    minutes: 10,
    content: [
      { type: "p", text: "Static files are files the server sends as-is, such as CSS, JavaScript, images, fonts, and icons. Flask serves them from a folder named `static` by default." },
      { type: "p", text: "Templates should link static files with `url_for('static', filename='...')` so URLs are generated correctly." },
      { type: "h2", text: "Use the standard folder layout" },
      {
        type: "code",
        title: "Project files",
        language: "text",
        code: `flask-notes/
  app.py
  static/
    css/
      site.css
    js/
      app.js
    images/
      logo.png
  templates/
    base.html`,
      },
      { type: "h2", text: "Link CSS and JavaScript" },
      {
        type: "code",
        title: "templates/base.html",
        language: "html",
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{% block title %}Flask Notes{% endblock %}</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/site.css') }}">
  </head>
  <body>
    {% block content %}{% endblock %}
    <script src="{{ url_for('static', filename='js/app.js') }}"></script>
  </body>
</html>`,
      },
      { type: "h2", text: "Write a small stylesheet" },
      {
        type: "code",
        title: "static/css/site.css",
        language: "text",
        code: `body {
  font-family: system-ui, sans-serif;
  margin: 2rem;
  background: #f8fafc;
}

.card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
}`,
      },
      { type: "h2", text: "Display an image" },
      {
        type: "code",
        title: "Template image tag",
        language: "html",
        code: `<img
  src="{{ url_for('static', filename='images/logo.png') }}"
  alt="Flask Notes logo"
  width="120"
>`,
      },
      { type: "note", text: "During development, Flask can serve static files. In production, static files are often served by a web server, CDN, or hosting platform." },
      { type: "try", text: "Create `static/css/site.css`, add a body font rule, and link it from `templates/base.html` using `url_for()`." },
      { type: "keypoints", items: ["Static files live in the `static/` folder by default.", "Use subfolders such as `css`, `js`, and `images` for organization.", "Link static assets with `url_for('static', filename='...')`.", "CSS and images should not be stored in the templates folder.", "Production deployments may serve static files differently from local development."] },
    ],
  },
  {
    slug: "flask-forms-html",
    title: "HTML Forms with Flask",
    description: "Build plain HTML forms, submit them to Flask routes, validate simple input, and redirect after POST.",
    level: "beginner",
    section: "Forms & Feedback",
    order: 17,
    minutes: 14,
    content: [
      { type: "p", text: "HTML forms let users send data to your Flask app. A form has fields, a method, and an action URL." },
      { type: "p", text: "For beginner Flask apps, plain HTML forms plus `request.form` are enough to learn the full submit, validate, redirect flow." },
      { type: "h2", text: "Create routes for new and create" },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask, redirect, render_template, request, url_for

app = Flask(__name__)

notes = []


@app.get("/notes")
def note_list():
    return render_template("notes.html", notes=notes)


@app.get("/notes/new")
def new_note():
    return render_template("new_note.html")


@app.post("/notes")
def create_note():
    title = request.form.get("title", "").strip()
    body = request.form.get("body", "").strip()

    if not title:
        return render_template("new_note.html", error="Title is required"), 400

    notes.append({"title": title, "body": body})
    return redirect(url_for("note_list"))`,
      },
      { type: "h2", text: "Build the form template" },
      {
        type: "code",
        title: "templates/new_note.html",
        language: "html",
        code: `<h1>New Note</h1>

{% if error %}
  <p class="error">{{ error }}</p>
{% endif %}

<form method="post" action="{{ url_for('create_note') }}">
  <label for="title">Title</label>
  <input id="title" name="title" required>

  <label for="body">Body</label>
  <textarea id="body" name="body"></textarea>

  <button type="submit">Save note</button>
</form>`,
      },
      { type: "h2", text: "Show submitted notes" },
      {
        type: "code",
        title: "templates/notes.html",
        language: "html",
        code: `<h1>Notes</h1>
<p><a href="{{ url_for('new_note') }}">Create a note</a></p>

<ul>
  {% for note in notes %}
    <li>
      <strong>{{ note.title }}</strong>
      <p>{{ note.body }}</p>
    </li>
  {% else %}
    <li>No notes yet.</li>
  {% endfor %}
</ul>`,
      },
      { type: "h2", text: "Understand method and action" },
      { type: "ul", items: ["`method=\"post\"` sends form data in the request body.", "`action` is the URL that receives the submission.", "Each input needs a `name` so Flask can read it from `request.form`.", "`required` helps in the browser but server-side validation is still needed."] },
      { type: "tip", text: "Use Post/Redirect/Get after a successful form submission. It keeps refresh from submitting the form again." },
      { type: "try", text: "Add a shop item form with a required `name` field and optional `quantity` field. Store submitted items in a list and redirect to the item list." },
      { type: "keypoints", items: ["HTML forms submit named fields to Flask.", "Use `request.form.get()` to read submitted values.", "Validate input on the server even when fields use `required`.", "Return a 400 status code when form input is invalid.", "Redirect after successful POST submissions."] },
    ],
  },
  {
    slug: "flask-wtforms",
    title: "Flask-WTF & WTForms",
    description: "Use Flask-WTF and WTForms for structured form classes, validation, CSRF protection, and cleaner templates.",
    level: "beginner",
    section: "Forms & Feedback",
    order: 18,
    minutes: 14,
    content: [
      { type: "p", text: "Plain HTML forms are great for learning. As forms grow, a form library can reduce repetition and centralize validation." },
      { type: "p", text: "Flask-WTF integrates WTForms with Flask. It provides form classes, validators, rendering helpers, and CSRF protection." },
      { type: "h2", text: "Install Flask-WTF" },
      {
        type: "code",
        title: "Terminal",
        language: "bash",
        code: `python -m pip install Flask-WTF`,
      },
      { type: "h2", text: "Configure a secret key" },
      { type: "p", text: "CSRF protection needs a secret key. You will learn configuration in more detail later. For now, set a development value." },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask

app = Flask(__name__)
app.config["SECRET_KEY"] = "dev-secret-change-me"`,
      },
      { type: "h2", text: "Create a form class" },
      {
        type: "code",
        title: "forms.py",
        language: "python",
        code: `from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, Length


class NoteForm(FlaskForm):
    title = StringField("Title", validators=[DataRequired(), Length(max=100)])
    body = TextAreaField("Body", validators=[Length(max=1000)])
    submit = SubmitField("Save note")`,
      },
      { type: "h2", text: "Use the form in a route" },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import redirect, render_template, url_for
from forms import NoteForm

notes = []


@app.route("/notes/new", methods=["GET", "POST"])
def new_note():
    form = NoteForm()
    if form.validate_on_submit():
        notes.append({"title": form.title.data, "body": form.body.data})
        return redirect(url_for("note_list"))
    return render_template("new_note.html", form=form)`,
      },
      { type: "h2", text: "Render the form" },
      {
        type: "code",
        title: "templates/new_note.html",
        language: "html",
        code: `<h1>New Note</h1>

<form method="post">
  {{ form.hidden_tag() }}

  <p>
    {{ form.title.label }}
    {{ form.title() }}
    {% for error in form.title.errors %}
      <span class="error">{{ error }}</span>
    {% endfor %}
  </p>

  <p>
    {{ form.body.label }}
    {{ form.body(rows=5) }}
  </p>

  {{ form.submit() }}
</form>`,
      },
      { type: "note", text: "Flask-WTF is an extension, not part of Flask itself. Add it when your app benefits from form classes, validation helpers, and CSRF protection." },
      { type: "try", text: "Create a `ContactForm` with `name`, `email`, and `message` fields. Add `DataRequired()` to each and `Length(max=500)` to the message." },
      { type: "keypoints", items: ["Flask-WTF connects WTForms to Flask.", "Form classes keep field definitions and validators together.", "`validate_on_submit()` checks that the request is POST and valid.", "`form.hidden_tag()` renders hidden CSRF fields.", "Use extensions when they simplify real repeated work."] },
    ],
  },
  {
    slug: "flask-flash",
    title: "Flash Messages",
    description: "Show one-time success, error, and info messages after redirects with Flask's flashing system.",
    level: "beginner",
    section: "Forms & Feedback",
    order: 19,
    minutes: 10,
    content: [
      { type: "p", text: "Flash messages are short messages stored for the next request. They are useful after redirects because the message survives long enough to be displayed once." },
      { type: "p", text: "Common flash messages include `Note created`, `Please fill out the title`, and `You have been signed out`." },
      { type: "h2", text: "Set a secret key" },
      { type: "p", text: "Flash messages use the session, so the app needs a secret key." },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask

app = Flask(__name__)
app.config["SECRET_KEY"] = "dev-secret-change-me"`,
      },
      { type: "h2", text: "Flash before redirecting" },
      {
        type: "code",
        title: "Route with flash",
        language: "python",
        code: `from flask import flash, redirect, request, url_for


@app.post("/notes")
def create_note():
    title = request.form.get("title", "").strip()

    if not title:
        flash("Title is required.", "error")
        return redirect(url_for("new_note"))

    flash("Note created successfully.", "success")
    return redirect(url_for("note_list"))`,
      },
      { type: "h2", text: "Display messages in the base template" },
      {
        type: "code",
        title: "templates/base.html",
        language: "html",
        code: `{% with messages = get_flashed_messages(with_categories=true) %}
  {% if messages %}
    <ul class="flash-list">
      {% for category, message in messages %}
        <li class="flash flash-{{ category }}">{{ message }}</li>
      {% endfor %}
    </ul>
  {% endif %}
{% endwith %}`,
      },
      { type: "h2", text: "Style categories" },
      {
        type: "code",
        title: "static/css/site.css",
        language: "text",
        code: `.flash {
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  padding: 0.75rem;
}

.flash-success {
  background: #dcfce7;
}

.flash-error {
  background: #fee2e2;
}`,
      },
      { type: "tip", text: "Put flash display markup in `base.html` so every page can show messages without duplicating template code." },
      { type: "try", text: "Flash a success message after adding a shop item and an error message when the submitted item name is blank." },
      { type: "keypoints", items: ["Flash messages are shown once on the next request.", "Flashing requires a configured secret key because it uses sessions.", "Use categories such as `success`, `error`, and `info` for styling.", "Flash before redirecting after form actions.", "Display messages in a shared base template."] },
    ],
  },
  {
    slug: "flask-sessions",
    title: "Sessions",
    description: "Store small pieces of user-specific state with Flask sessions, such as display names or simple preferences.",
    level: "beginner",
    section: "State",
    order: 20,
    minutes: 12,
    content: [
      { type: "p", text: "HTTP is stateless, which means each request is separate. Sessions let Flask remember small pieces of information between requests for the same browser." },
      { type: "p", text: "Flask's default session stores signed data in a browser cookie. Signed means users cannot change it without Flask detecting the change, but they can still see the data." },
      { type: "h2", text: "Configure the secret key" },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask

app = Flask(__name__)
app.config["SECRET_KEY"] = "dev-secret-change-me"`,
      },
      { type: "h2", text: "Write to the session" },
      {
        type: "code",
        title: "Store a display name",
        language: "python",
        code: `from flask import redirect, request, session, url_for


@app.post("/set-name")
def set_name():
    name = request.form.get("name", "").strip()
    session["display_name"] = name or "Guest"
    return redirect(url_for("dashboard"))`,
      },
      { type: "h2", text: "Read from the session" },
      {
        type: "code",
        title: "Read session data",
        language: "python",
        code: `from flask import render_template, session


@app.get("/dashboard")
def dashboard():
    display_name = session.get("display_name", "Guest")
    return render_template("dashboard.html", display_name=display_name)`,
      },
      { type: "h2", text: "Remove session data" },
      {
        type: "code",
        title: "Clear a value",
        language: "python",
        code: `@app.post("/forget-name")
def forget_name():
    session.pop("display_name", None)
    return redirect(url_for("dashboard"))`,
      },
      { type: "h2", text: "What belongs in a session?" },
      { type: "ul", items: ["Small preferences, such as a theme choice.", "A user ID after login, not the full user record.", "Temporary form flow information.", "Simple flags that do not reveal sensitive private data."] },
      { type: "warning", text: "Do not store passwords, secret tokens, credit card data, or large objects in Flask's default client-side session." },
      { type: "try", text: "Create a form that stores a favorite course in the session, then display it on a `/profile` route." },
      { type: "keypoints", items: ["Sessions remember small user-specific state between requests.", "Flask's default session is stored in a signed cookie.", "A secret key is required for sessions.", "Use `session.get()` to read optional values safely.", "Keep sensitive or large data out of client-side sessions."] },
    ],
  },
  {
    slug: "flask-cookies",
    title: "Cookies",
    description: "Read, set, and delete browser cookies in Flask while understanding how cookies differ from sessions.",
    level: "beginner",
    section: "State",
    order: 21,
    minutes: 10,
    content: [
      { type: "p", text: "Cookies are small pieces of text stored by the browser for a website. The browser sends matching cookies back to the server on future requests." },
      { type: "p", text: "Flask sessions use cookies internally, but you can also work with regular cookies yourself for simple preferences." },
      { type: "h2", text: "Read a cookie" },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask, request

app = Flask(__name__)


@app.get("/")
def home():
    theme = request.cookies.get("theme", "light")
    return f"Current theme: {theme}"`,
      },
      { type: "h2", text: "Set a cookie" },
      { type: "p", text: "To set a cookie, create or modify a response object and call `set_cookie()`." },
      {
        type: "code",
        title: "Set theme cookie",
        language: "python",
        code: `from flask import make_response, redirect, url_for


@app.post("/theme/dark")
def dark_theme():
    response = make_response(redirect(url_for("home")))
    response.set_cookie("theme", "dark", max_age=60 * 60 * 24 * 30)
    return response`,
      },
      { type: "h2", text: "Delete a cookie" },
      {
        type: "code",
        title: "Delete theme cookie",
        language: "python",
        code: `@app.post("/theme/reset")
def reset_theme():
    response = make_response(redirect(url_for("home")))
    response.delete_cookie("theme")
    return response`,
      },
      { type: "h2", text: "Cookies vs sessions" },
      {
        type: "table",
        headers: ["Feature", "Cookie", "Session"],
        rows: [
          ["Purpose", "Store a small browser value", "Store small user state through Flask"],
          ["Protection", "Plain unless you add protection", "Signed by Flask"],
          ["Visibility", "User can read it", "User can read default Flask session data too"],
          ["Typical use", "Theme, language, tracking consent", "User ID, flashes, temporary preferences"],
        ],
      },
      { type: "note", text: "Cookies are sent with requests, so keep them small. Large cookies slow down every request to your app." },
      { type: "try", text: "Add two POST routes: one that sets a `font_size` cookie to `large`, and one that deletes it." },
      { type: "keypoints", items: ["Cookies are stored in the browser.", "Read cookies with `request.cookies`.", "Set cookies on response objects with `set_cookie()`.", "Delete cookies with `delete_cookie()`.", "Use sessions for signed Flask-managed state and plain cookies for simple non-sensitive preferences."] },
    ],
  },
  {
    slug: "flask-error-pages",
    title: "Custom Error Pages",
    description: "Create friendly custom pages for common Flask errors such as 404 Not Found and 500 Server Error.",
    level: "beginner",
    section: "State",
    order: 22,
    minutes: 11,
    content: [
      { type: "p", text: "Users should not see a confusing default error page when something goes wrong. Flask lets you register custom error handlers for specific status codes." },
      { type: "p", text: "A custom error handler returns a normal response plus the correct status code." },
      { type: "h2", text: "Register a 404 handler" },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask, render_template

app = Flask(__name__)


@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404`,
      },
      { type: "h2", text: "Create the 404 template" },
      {
        type: "code",
        title: "templates/404.html",
        language: "html",
        code: `{% extends "base.html" %}

{% block title %}Page not found{% endblock %}

{% block content %}
  <h1>Page not found</h1>
  <p>The page you requested does not exist.</p>
  <p><a href="{{ url_for('home') }}">Return home</a></p>
{% endblock %}`,
      },
      { type: "h2", text: "Handle server errors" },
      { type: "p", text: "A 500 error means something unexpected failed on the server. In production, show a friendly message and log the real error for developers." },
      {
        type: "code",
        title: "500 handler",
        language: "python",
        code: `@app.errorhandler(500)
def internal_server_error(error):
    return render_template("500.html"), 500`,
      },
      { type: "h2", text: "Use abort with custom pages" },
      {
        type: "code",
        title: "abort triggers the handler",
        language: "python",
        code: `from flask import abort

notes = {1: "Learn error handlers"}


@app.get("/notes/<int:note_id>")
def note_detail(note_id):
    if note_id not in notes:
        abort(404)
    return notes[note_id]`,
      },
      { type: "note", text: "Debug mode shows detailed error pages for developers. Custom 500 pages are most visible when debug mode is off." },
      { type: "try", text: "Create a custom 404 page for a course app. Include a link back to the course list using `url_for()`." },
      { type: "keypoints", items: ["Error handlers customize responses for HTTP errors.", "Return the correct status code with the template.", "`abort(404)` uses the registered 404 handler.", "Friendly error pages improve user experience.", "Detailed stack traces belong in development logs, not public pages."] },
    ],
  },
  {
    slug: "flask-config",
    title: "Configuration Basics",
    description: "Manage Flask configuration values for secrets, debug settings, feature flags, and environment-specific behavior.",
    level: "beginner",
    section: "App Structure",
    order: 23,
    minutes: 12,
    content: [
      { type: "p", text: "Configuration is how an app changes behavior without rewriting routes. Common settings include `SECRET_KEY`, database URLs, upload limits, API keys, and feature flags." },
      { type: "p", text: "Flask stores configuration in `app.config`, which behaves like a dictionary with uppercase keys." },
      { type: "h2", text: "Set simple config values" },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask

app = Flask(__name__)
app.config["SECRET_KEY"] = "dev-secret-change-me"
app.config["MAX_CONTENT_LENGTH"] = 2 * 1024 * 1024`,
      },
      { type: "h2", text: "Read configuration" },
      {
        type: "code",
        title: "Using app config",
        language: "python",
        code: `@app.get("/settings")
def settings():
    max_bytes = app.config["MAX_CONTENT_LENGTH"]
    return f"Upload limit: {max_bytes} bytes"`,
      },
      { type: "h2", text: "Use environment variables" },
      { type: "p", text: "Secrets should not be hardcoded in committed files. Read them from environment variables and provide safe development defaults only when appropriate." },
      {
        type: "code",
        title: "config.py",
        language: "python",
        code: `import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-me")
    NOTES_PER_PAGE = int(os.environ.get("NOTES_PER_PAGE", "10"))`,
      },
      {
        type: "code",
        title: "app.py",
        language: "python",
        code: `from flask import Flask
from config import Config

app = Flask(__name__)
app.config.from_object(Config)`,
      },
      { type: "h2", text: "Set variables in the terminal" },
      {
        type: "code",
        title: "Terminal",
        language: "bash",
        code: `export SECRET_KEY="a-long-random-development-secret"
export NOTES_PER_PAGE="20"
flask --app app run --debug`,
      },
      { type: "warning", text: "Do not commit real production secrets to Git. Use environment variables or your hosting platform's secret manager." },
      { type: "try", text: "Add a `SITE_NAME` configuration value. Read it from the environment with a default of `Flask Notes`, then display it on the home page." },
      { type: "keypoints", items: ["Flask configuration lives in `app.config`.", "Configuration keys are usually uppercase.", "Use config for values that change between environments.", "Read secrets from environment variables.", "A config class keeps settings organized as apps grow."] },
    ],
  },
  {
    slug: "flask-app-factory",
    title: "Application Factory Pattern",
    description: "Structure Flask apps with a `create_app()` function so configuration, tests, extensions, and blueprints are easier to manage.",
    level: "beginner",
    section: "App Structure",
    order: 24,
    minutes: 14,
    content: [
      { type: "p", text: "A one-file Flask app is perfect for learning. As an app grows, it helps to create the app inside a function called an application factory." },
      { type: "p", text: "The factory pattern makes it easier to create different app instances for development, testing, and production." },
      { type: "h2", text: "Start with a package layout" },
      {
        type: "code",
        title: "Project files",
        language: "text",
        code: `flask-notes/
  app/
    __init__.py
    routes.py
    templates/
      index.html
  config.py`,
      },
      { type: "h2", text: "Create the app in a function" },
      {
        type: "code",
        title: "app/__init__.py",
        language: "python",
        code: `from flask import Flask


def create_app():
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY="dev-secret-change-me",
    )

    from .routes import main

    app.register_blueprint(main)

    return app`,
      },
      { type: "h2", text: "Move routes to another module" },
      {
        type: "code",
        title: "app/routes.py",
        language: "python",
        code: `from flask import Blueprint, render_template

main = Blueprint("main", __name__)


@main.get("/")
def home():
    return render_template("index.html")`,
      },
      { type: "h2", text: "Run a factory app" },
      { type: "p", text: "When using an app factory, tell Flask the module and factory function. The parentheses mean Flask should call the function." },
      {
        type: "code",
        title: "Terminal",
        language: "bash",
        code: `flask --app app:create_app run --debug`,
      },
      { type: "h2", text: "Why factories help" },
      { type: "ul", items: ["Tests can create a fresh app with test configuration.", "Extensions can be initialized cleanly.", "Blueprints can be registered in one central place.", "The project can grow beyond one file without circular imports.", "Different environments can load different configuration."] },
      { type: "note", text: "You do not need an application factory for the first five routes you write. Learn the simple app first, then use a factory when structure starts helping." },
      { type: "try", text: "Convert a one-file notes app into an `app/` package with `create_app()` and a `routes.py` file containing the home route." },
      { type: "keypoints", items: ["An application factory is a function that creates and returns a Flask app.", "The common factory name is `create_app`.", "Run factory apps with `flask --app app:create_app run --debug`.", "Factories make testing, configuration, and extensions cleaner.", "Factories pair naturally with blueprints."] },
    ],
  },
  {
    slug: "flask-blueprints-intro",
    title: "Blueprints Intro",
    description: "Organize related routes with Flask blueprints and register them in an application factory.",
    level: "beginner",
    section: "App Structure",
    order: 25,
    minutes: 13,
    content: [
      { type: "p", text: "Blueprints help organize a Flask app into groups of related routes. They are useful when one file starts to hold too many view functions." },
      { type: "p", text: "A blueprint is not a separate app. It is a collection of routes and related setup that gets registered on the main Flask app." },
      { type: "h2", text: "Create a notes blueprint" },
      {
        type: "code",
        title: "app/notes.py",
        language: "python",
        code: `from flask import Blueprint, render_template

bp = Blueprint("notes", __name__, url_prefix="/notes")

notes = [
    {"id": 1, "title": "Learn blueprints"},
    {"id": 2, "title": "Organize routes"},
]


@bp.get("/")
def index():
    return render_template("notes/index.html", notes=notes)


@bp.get("/<int:note_id>")
def detail(note_id):
    note = next((item for item in notes if item["id"] == note_id), None)
    if note is None:
        return "Note not found", 404
    return render_template("notes/detail.html", note=note)`,
      },
      { type: "h2", text: "Register the blueprint" },
      {
        type: "code",
        title: "app/__init__.py",
        language: "python",
        code: `from flask import Flask


def create_app():
    app = Flask(__name__)
    app.config.from_mapping(SECRET_KEY="dev-secret-change-me")

    from . import notes

    app.register_blueprint(notes.bp)

    return app`,
      },
      { type: "h2", text: "Create blueprint templates" },
      {
        type: "code",
        title: "templates/notes/index.html",
        language: "html",
        code: `<h1>Notes</h1>

<ul>
  {% for note in notes %}
    <li>
      <a href="{{ url_for('notes.detail', note_id=note.id) }}">
        {{ note.title }}
      </a>
    </li>
  {% endfor %}
</ul>`,
      },
      { type: "h2", text: "Understand blueprint endpoint names" },
      { type: "p", text: "Blueprint endpoints are prefixed with the blueprint name. The `detail` view inside the `notes` blueprint becomes `notes.detail` for `url_for()`." },
      {
        type: "code",
        title: "Endpoint examples",
        language: "python",
        code: `from flask import url_for

url_for("notes.index")
url_for("notes.detail", note_id=1)`,
      },
      { type: "h2", text: "When to add blueprints" },
      { type: "ul", items: ["Use one blueprint for notes routes and another for account routes.", "Group API routes separately from HTML page routes.", "Keep feature-specific templates in matching subfolders.", "Register blueprints inside `create_app()`.", "Avoid creating too many tiny blueprints before the app needs them."] },
      { type: "tip", text: "A good first split is by feature: `notes`, `auth`, `admin`, or `api`. Each blueprint should have a clear purpose." },
      { type: "try", text: "Create a `courses` blueprint with `url_prefix='/courses'`, an index route, and a detail route for `/courses/<slug>`." },
      { type: "keypoints", items: ["Blueprints group related routes.", "Register blueprints on the Flask app, often inside `create_app()`.", "`url_prefix` adds a shared URL prefix to blueprint routes.", "Blueprint endpoint names use the `blueprint.view_function` pattern.", "Blueprints help Flask apps grow without one giant routes file."] },
    ],
  },
];
