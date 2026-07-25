import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-django',
    title: 'What is Django?',
    description: 'Learn what Django is, what it includes, and why it is a popular framework for building Python web applications.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 8,
    content: [
      { type: 'p', text: 'Django is a Python web framework. A web framework gives you a ready-made structure for building websites and web applications, so you do not have to write every low-level feature yourself.' },
      { type: 'p', text: 'Django is often described as "batteries included" because it ships with many tools real websites need: URL routing, database models, templates, forms, authentication, an admin site, security features, and more.' },
      { type: 'h2', text: 'Django in simple words' },
      { type: 'p', text: 'Imagine you want to build a course website. You need pages, users, lessons, database records, forms, and an admin screen. Django gives you a clear way to organize those pieces using normal Python files.' },
      {
        type: 'table',
        headers: ['Website need', 'Django feature'],
        rows: [
          ['Pages', 'Views, URLs, and templates'],
          ['Database records', 'Models and the ORM'],
          ['Admin screens', 'Django admin'],
          ['User input', 'Forms and validation'],
          ['Security basics', 'Built-in protections for common web risks'],
        ],
      },
      { type: 'h2', text: 'A tiny Django view' },
      { type: 'p', text: 'A view is Python code that receives a web request and returns a web response. You will learn views in detail later, but this small example shows the basic idea.' },
      {
        type: 'code',
        title: 'blog/views.py',
        language: 'python',
        code: `from django.http import HttpResponse


def home(request):
    return HttpResponse("Welcome to my Django site!")`,
      },
      { type: 'h2', text: 'Django helps you build complete apps' },
      { type: 'p', text: 'Django is used for content sites, dashboards, internal tools, online stores, learning platforms, booking systems, APIs, and many other database-backed web applications.' },
      {
        type: 'code',
        title: 'A model for a blog post',
        language: 'python',
        code: `from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    published = models.BooleanField(default=False)`,
      },
      { type: 'tip', text: 'If you know basic Python variables, functions, and classes, you already know enough Python to begin learning Django.' },
      { type: 'try', text: 'Think of a website you might build. List three things it needs, such as pages, database records, forms, user accounts, or an admin area.' },
      { type: 'keypoints', items: ['Django is a Python framework for building web applications.', 'It includes many features that real websites commonly need.', 'Django projects are organized with views, URLs, templates, models, and apps.', 'This tutorial uses modern Django 5.x patterns.'] },
    ],
  },
  {
    slug: 'django-vs-flask',
    title: 'Django vs Other Python Web Options',
    description: 'Compare Django with Flask, FastAPI, and smaller Python web tools so you know when Django is a good choice.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 9,
    content: [
      { type: 'p', text: 'Python has several web frameworks. Django is one of the most complete choices, but it is not the only option. Understanding the difference helps you choose the right tool for a project.' },
      { type: 'h2', text: 'The main idea' },
      { type: 'p', text: 'Django gives you a full application framework. Flask gives you a smaller foundation and lets you choose more pieces yourself. FastAPI is often used for modern APIs, especially when automatic API documentation and type hints are important.' },
      {
        type: 'table',
        headers: ['Tool', 'Common style', 'Beginner summary'],
        rows: [
          ['Django', 'Full-stack web framework', 'Great when you need database models, admin, forms, auth, and pages together'],
          ['Flask', 'Microframework', 'Great for small apps or when you want to choose many libraries yourself'],
          ['FastAPI', 'API framework', 'Great for JSON APIs with Python type hints'],
          ['Plain Python', 'Low-level code', 'Useful for learning, but too much work for most real web apps'],
        ],
      },
      { type: 'h2', text: 'Django includes more by default' },
      { type: 'p', text: 'A Django app usually starts with official tools for routing, settings, database access, and templates. You can still install extra packages, but the starting point is already productive.' },
      {
        type: 'code',
        title: 'Create a Django project',
        language: 'bash',
        code: `python -m django --version
django-admin startproject mysite`,
      },
      { type: 'h2', text: 'Flask starts smaller' },
      { type: 'p', text: 'A tiny Flask app can fit in one file. That can be wonderful for small demos. For a larger app, you usually add more packages and make more structure decisions yourself.' },
      {
        type: 'code',
        title: 'Small Flask-style example',
        language: 'python',
        code: `from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    return "Hello from Flask"`,
      },
      { type: 'note', text: 'This is not a contest. Good developers choose tools based on the project. Django is a strong beginner choice because its official path teaches many professional web development ideas.' },
      { type: 'try', text: 'For a blog with authors, posts, comments, login, and an admin screen, explain why Django might save time compared with choosing every piece separately.' },
      { type: 'keypoints', items: ['Django is a full-featured Python web framework.', 'Flask is smaller and more flexible from the start.', 'FastAPI is especially popular for JSON APIs.', 'Django is a good fit for database-backed websites with admin and user features.'] },
    ],
  },
  {
    slug: 'django-setup',
    title: 'Install Django & Create a Project',
    description: 'Install Django 5.x in a virtual environment and create your first project with django-admin startproject.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 12,
    content: [
      { type: 'p', text: 'A Django project starts with Python, a virtual environment, and the Django package. A virtual environment keeps project packages separate from the rest of your computer.' },
      { type: 'h2', text: 'Create and activate a virtual environment' },
      { type: 'p', text: 'Make a folder for your work, create a virtual environment inside it, and activate it before installing Django.' },
      {
        type: 'code',
        title: 'macOS or Linux',
        language: 'bash',
        code: `mkdir django-practice
cd django-practice
python3 -m venv .venv
source .venv/bin/activate`,
      },
      {
        type: 'code',
        title: 'Windows PowerShell',
        language: 'bash',
        code: `mkdir django-practice
cd django-practice
py -m venv .venv
.venv\\Scripts\\Activate.ps1`,
      },
      { type: 'h2', text: 'Install Django' },
      { type: 'p', text: 'Install the latest Django 5.x release available in your environment. The command below asks pip for Django version 5 or newer, but still below version 6.' },
      {
        type: 'code',
        title: 'Install Django 5.x',
        language: 'bash',
        code: `python -m pip install "Django>=5,<6"
python -m django --version`,
      },
      { type: 'h2', text: 'Create a project' },
      { type: 'p', text: 'Use django-admin startproject to create the project. The dot at the end puts manage.py in the current folder, which is a common beginner-friendly layout.' },
      {
        type: 'code',
        title: 'Start a project named mysite',
        language: 'bash',
        code: `django-admin startproject mysite .
python manage.py runserver`,
      },
      { type: 'p', text: 'Open http://127.0.0.1:8000 in your browser. If you see the Django welcome page, your project is working.' },
      { type: 'tip', text: 'Always activate the virtual environment before running Django commands. Your terminal prompt may show (.venv) when it is active.' },
      { type: 'warning', text: 'Do not name your project django.py or create a file named django.py. That can confuse Python when it tries to import the real Django package.' },
      { type: 'try', text: 'Create a new folder, make a virtual environment, install Django 5.x, start a project named mysite, and run the development server.' },
      { type: 'keypoints', items: ['Use a virtual environment for each Django project.', 'Install Django with pip inside the active environment.', 'django-admin startproject creates the project files.', 'python manage.py runserver starts the local development server.'] },
    ],
  },
  {
    slug: 'django-project-structure',
    title: 'Project Structure Explained',
    description: 'Understand the files created by django-admin startproject and where your Django code belongs.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 10,
    content: [
      { type: 'p', text: 'After you create a Django project, you will see a few files and folders. At first they may look mysterious, but each one has a clear job.' },
      { type: 'h2', text: 'The starter layout' },
      {
        type: 'code',
        title: 'Project files after startproject',
        language: 'text',
        code: `django-practice/
  manage.py
  mysite/
    __init__.py
    asgi.py
    settings.py
    urls.py
    wsgi.py`,
      },
      { type: 'p', text: 'The outer folder is your workspace. The inner mysite folder is the Python package for your Django project settings and top-level routing.' },
      {
        type: 'table',
        headers: ['File', 'Purpose'],
        rows: [
          ['manage.py', 'Runs project commands such as runserver, migrate, and createsuperuser'],
          ['mysite/settings.py', 'Stores configuration such as installed apps, database settings, templates, and static files'],
          ['mysite/urls.py', 'Maps top-level URL paths to views or app URL files'],
          ['mysite/asgi.py', 'Entry point for ASGI servers'],
          ['mysite/wsgi.py', 'Entry point for WSGI servers'],
        ],
      },
      { type: 'h2', text: 'Projects contain apps' },
      { type: 'p', text: 'A Django project is the whole website. A Django app is one focused part of the website, such as a blog, courses section, store, or inventory system.' },
      {
        type: 'code',
        title: 'Create an app',
        language: 'bash',
        code: `python manage.py startapp blog`,
      },
      {
        type: 'code',
        title: 'Layout after creating a blog app',
        language: 'text',
        code: `django-practice/
  manage.py
  mysite/
    settings.py
    urls.py
  blog/
    admin.py
    apps.py
    models.py
    tests.py
    views.py
    migrations/`,
      },
      { type: 'note', text: 'One project can have many apps. For example, a learning site might have courses, accounts, payments, and blog apps.' },
      { type: 'try', text: 'Create a project and then run python manage.py startapp courses. Identify which folder is the project package and which folder is the app.' },
      { type: 'keypoints', items: ['A Django project represents the whole website.', 'A Django app represents one focused feature area.', 'manage.py runs project commands.', 'settings.py configures the project and urls.py controls top-level routing.'] },
    ],
  },
  {
    slug: 'django-runserver',
    title: 'runserver, Settings & Apps',
    description: 'Run the development server, register apps, and understand the settings that make Django project pieces work together.',
    level: 'beginner',
    section: 'Getting Started',
    order: 5,
    minutes: 11,
    content: [
      { type: 'p', text: 'Django includes a development server so you can test your project locally. You also need to tell Django which apps are installed in your project settings.' },
      { type: 'h2', text: 'Start and stop the server' },
      { type: 'p', text: 'Run the server from the folder that contains manage.py. Django watches your files and reloads when you save many types of changes.' },
      {
        type: 'code',
        title: 'Start the local server',
        language: 'bash',
        code: `python manage.py runserver`,
      },
      {
        type: 'code',
        title: 'Use a different port',
        language: 'bash',
        code: `python manage.py runserver 8080`,
      },
      { type: 'p', text: 'Press Ctrl+C in the terminal to stop the server. The development server is for learning and local development, not production hosting.' },
      { type: 'h2', text: 'Register an app' },
      { type: 'p', text: 'After creating an app, add it to INSTALLED_APPS. This lets Django find the app models, templates, static files, migrations, and admin settings.' },
      {
        type: 'code',
        title: 'mysite/settings.py',
        language: 'python',
        code: `INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "blog",
]`,
      },
      { type: 'h2', text: 'Important beginner settings' },
      {
        type: 'table',
        headers: ['Setting', 'What it controls'],
        rows: [
          ['DEBUG', 'Shows helpful error pages during development'],
          ['INSTALLED_APPS', 'Lists apps enabled in the project'],
          ['ROOT_URLCONF', 'Points to the top-level URL configuration'],
          ['TEMPLATES', 'Controls how Django finds and renders templates'],
          ['DATABASES', 'Controls the database connection'],
          ['STATIC_URL', 'Sets the URL prefix for CSS, JavaScript, and images'],
        ],
      },
      { type: 'warning', text: 'Keep DEBUG = True only while developing locally. Production sites should use DEBUG = False and proper security settings.' },
      { type: 'try', text: 'Create a blog app, add it to INSTALLED_APPS, start the server, change the port to 8080, then stop the server with Ctrl+C.' },
      { type: 'keypoints', items: ['runserver starts Django locally for development.', 'Run manage.py commands from the folder containing manage.py.', 'Apps must be registered in INSTALLED_APPS.', 'settings.py controls project configuration.'] },
    ],
  },
  {
    slug: 'django-mtv',
    title: 'MTV Architecture (Model-Template-View)',
    description: 'Learn Django MTV architecture and how models, templates, and views work together to create pages.',
    level: 'beginner',
    section: 'Core Ideas',
    order: 6,
    minutes: 10,
    content: [
      { type: 'p', text: 'Django organizes web apps with a pattern called MTV: Model, Template, View. MTV helps keep database code, page appearance, and request logic in separate places.' },
      { type: 'h2', text: 'What each part does' },
      {
        type: 'table',
        headers: ['Part', 'Common file', 'Job'],
        rows: [
          ['Model', 'blog/models.py', 'Defines data and database behavior'],
          ['Template', 'blog/templates/blog/home.html', 'Controls HTML shown to the user'],
          ['View', 'blog/views.py', 'Receives a request and returns a response'],
          ['URLconf', 'blog/urls.py', 'Connects a URL path to a view'],
        ],
      },
      { type: 'p', text: 'The URLconf is not in the name MTV, but it is how a browser request reaches the correct view.' },
      { type: 'h2', text: 'A simple MTV flow' },
      {
        type: 'code',
        title: 'blog/views.py',
        language: 'python',
        code: `from django.shortcuts import render


def home(request):
    posts = [
        {"title": "Learning Django", "author": "Maya"},
        {"title": "Building a Blog", "author": "Noah"},
    ]
    return render(request, "blog/home.html", {"posts": posts})`,
      },
      {
        type: 'code',
        title: 'blog/templates/blog/home.html',
        language: 'html',
        code: `<h1>Blog Posts</h1>

{% for post in posts %}
  <article>
    <h2>{{ post.title }}</h2>
    <p>By {{ post.author }}</p>
  </article>
{% endfor %}`,
      },
      { type: 'h2', text: 'Where models fit' },
      { type: 'p', text: 'In a real blog, posts usually come from the database instead of a list written inside the view. Models define what a post is, and the view asks the model for records.' },
      {
        type: 'code',
        title: 'blog/models.py',
        language: 'python',
        code: `from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)`,
      },
      { type: 'tip', text: 'Django views are not the same as views in some other frameworks. In Django, the view is the Python function or class that handles the request.' },
      { type: 'try', text: 'For an inventory app, decide what belongs in the model, what belongs in the template, and what belongs in the view for a product list page.' },
      { type: 'keypoints', items: ['MTV stands for Model, Template, View.', 'Models describe data, templates describe HTML, and views handle requests.', 'URL patterns connect browser paths to views.', 'Separating responsibilities keeps Django apps easier to understand.'] },
    ],
  },
  {
    slug: 'django-urls',
    title: 'URLs & Routing',
    description: 'Map browser paths to Django views using project URL files, app URL files, path converters, and named routes.',
    level: 'beginner',
    section: 'Core Ideas',
    order: 7,
    minutes: 11,
    content: [
      { type: 'p', text: 'Routing is the process of matching a browser URL to the code that should handle it. In Django, URL patterns usually live in urls.py files.' },
      { type: 'h2', text: 'Project URLs include app URLs' },
      { type: 'p', text: 'A common pattern is to keep top-level routes in mysite/urls.py and feature-specific routes in each app. This keeps routing files small as the project grows.' },
      {
        type: 'code',
        title: 'mysite/urls.py',
        language: 'python',
        code: `from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("blog/", include("blog.urls")),
]`,
      },
      {
        type: 'code',
        title: 'blog/urls.py',
        language: 'python',
        code: `from django.urls import path

from . import views

app_name = "blog"

urlpatterns = [
    path("", views.post_list, name="post_list"),
    path("<int:post_id>/", views.post_detail, name="post_detail"),
]`,
      },
      { type: 'h2', text: 'Path converters' },
      { type: 'p', text: 'A path converter captures part of the URL and passes it to the view. In <int:post_id>, Django only matches numbers and passes the value as post_id.' },
      {
        type: 'code',
        title: 'blog/views.py',
        language: 'python',
        code: `from django.http import HttpResponse


def post_detail(request, post_id):
    return HttpResponse(f"Showing blog post {post_id}")`,
      },
      { type: 'h2', text: 'Named routes' },
      { type: 'p', text: 'The name value lets templates and Python code refer to a route without hard-coding the full URL. Names become more useful when URLs change later.' },
      {
        type: 'code',
        title: 'Link to a named route',
        language: 'html',
        code: `<a href="{% url 'blog:post_detail' post.id %}">
  Read {{ post.title }}
</a>`,
      },
      { type: 'note', text: 'Use include() when an app has its own urls.py file. This is the normal structure for apps such as blog, courses, or inventory.' },
      { type: 'try', text: 'Create URL patterns for /courses/ and /courses/5/. Name them course_list and course_detail.' },
      { type: 'keypoints', items: ['Django routes URLs with urlpatterns.', 'Project URLs can include app URLs.', 'Path converters capture values from the URL.', 'Named routes help avoid hard-coded links.'] },
    ],
  },
  {
    slug: 'django-views-function',
    title: 'Function-Based Views',
    description: 'Write beginner-friendly Django views with Python functions, HttpResponse, render, request data, and context dictionaries.',
    level: 'beginner',
    section: 'Core Ideas',
    order: 8,
    minutes: 10,
    content: [
      { type: 'p', text: 'A function-based view is a regular Python function that takes a request object and returns a response. It is the easiest type of Django view to learn first.' },
      { type: 'h2', text: 'Return plain text' },
      { type: 'p', text: 'The simplest view returns an HttpResponse. This is useful for tiny tests, but most real pages return rendered templates.' },
      {
        type: 'code',
        title: 'blog/views.py',
        language: 'python',
        code: `from django.http import HttpResponse


def home(request):
    return HttpResponse("Hello from Django")`,
      },
      { type: 'h2', text: 'Render a template' },
      { type: 'p', text: 'The render shortcut combines a request, a template file, and optional data called context. The context dictionary makes Python values available inside the template.' },
      {
        type: 'code',
        title: 'blog/views.py',
        language: 'python',
        code: `from django.shortcuts import render


def post_list(request):
    posts = [
        {"title": "Django Setup", "published": True},
        {"title": "Templates", "published": True},
    ]
    return render(request, "blog/post_list.html", {"posts": posts})`,
      },
      {
        type: 'code',
        title: 'blog/templates/blog/post_list.html',
        language: 'html',
        code: `<h1>Posts</h1>

{% for post in posts %}
  <p>{{ post.title }}</p>
{% endfor %}`,
      },
      { type: 'h2', text: 'Use request information' },
      { type: 'p', text: 'The request object contains information about the incoming browser request, such as the method, user, path, and query string.' },
      {
        type: 'code',
        title: 'Read a query string value',
        language: 'python',
        code: `from django.shortcuts import render


def search(request):
    query = request.GET.get("q", "")
    return render(request, "blog/search.html", {"query": query})`,
      },
      { type: 'tip', text: 'Start with function-based views while learning. They make the request-to-response flow very visible.' },
      { type: 'try', text: 'Write a function-based view named about that renders blog/about.html with a site_name value in the context.' },
      { type: 'keypoints', items: ['Function-based views are normal Python functions.', 'Every view receives a request and returns a response.', 'HttpResponse returns simple response text.', 'render returns HTML from a template and context.'] },
    ],
  },
  {
    slug: 'django-templates',
    title: 'Templates Basics',
    description: 'Create Django HTML templates, pass data from views, display variables, and loop over lists.',
    level: 'beginner',
    section: 'Templates',
    order: 9,
    minutes: 10,
    content: [
      { type: 'p', text: 'Templates are HTML files with small Django template language features added. They let you build dynamic pages without mixing all your HTML into Python strings.' },
      { type: 'h2', text: 'Where templates go' },
      { type: 'p', text: 'A common app template path includes the app name twice: blog/templates/blog/post_list.html. The second blog folder helps avoid name conflicts between apps.' },
      {
        type: 'code',
        title: 'Template folder structure',
        language: 'text',
        code: `blog/
  templates/
    blog/
      post_list.html
      post_detail.html`,
      },
      { type: 'h2', text: 'Pass context from a view' },
      {
        type: 'code',
        title: 'blog/views.py',
        language: 'python',
        code: `from django.shortcuts import render


def post_list(request):
    context = {
        "page_title": "Latest Posts",
        "posts": ["Django Setup", "Templates", "Models"],
    }
    return render(request, "blog/post_list.html", context)`,
      },
      {
        type: 'code',
        title: 'blog/templates/blog/post_list.html',
        language: 'html',
        code: `<h1>{{ page_title }}</h1>

<ul>
  {% for post in posts %}
    <li>{{ post }}</li>
  {% endfor %}
</ul>`,
      },
      { type: 'h2', text: 'Variables and tags' },
      { type: 'p', text: 'Double curly braces display a value. Curly braces with percent signs run template tags such as for loops and if statements.' },
      {
        type: 'table',
        headers: ['Syntax', 'Meaning'],
        rows: [
          ['{{ page_title }}', 'Display the page_title value'],
          ['{% for post in posts %}', 'Start a loop'],
          ['{% if posts %}', 'Start a condition'],
          ['{% endfor %}', 'End a loop'],
        ],
      },
      { type: 'note', text: 'Django templates are intentionally simpler than Python. Put business logic in views and models, then keep templates focused on presentation.' },
      { type: 'try', text: 'Create a courses/index.html template that displays a heading and loops over a list of course names passed from a view.' },
      { type: 'keypoints', items: ['Templates are HTML files with Django template syntax.', 'Views pass data to templates through context dictionaries.', '{{ value }} displays data.', '{% tags %} handle template features such as loops and conditions.'] },
    ],
  },
  {
    slug: 'django-template-tags',
    title: 'Template Tags & Filters',
    description: 'Use common Django template tags and filters to display lists, conditions, URLs, dates, defaults, and formatted values.',
    level: 'beginner',
    section: 'Templates',
    order: 10,
    minutes: 11,
    content: [
      { type: 'p', text: 'Django templates include tags and filters. Tags do actions such as looping, checking conditions, loading static files, and building URLs. Filters change how a value is displayed.' },
      { type: 'h2', text: 'Common tags' },
      {
        type: 'code',
        title: 'blog/templates/blog/post_list.html',
        language: 'html',
        code: `<h1>Posts</h1>

{% if posts %}
  {% for post in posts %}
    <article>
      <h2>{{ post.title }}</h2>
      <a href="{% url 'blog:post_detail' post.id %}">Read more</a>
    </article>
  {% endfor %}
{% else %}
  <p>No posts yet.</p>
{% endif %}`,
      },
      { type: 'p', text: 'The if tag checks whether posts has content. The for tag loops over each post. The url tag builds a link from a named URL pattern.' },
      { type: 'h2', text: 'Common filters' },
      {
        type: 'code',
        title: 'Useful filters',
        language: 'html',
        code: `<h2>{{ post.title|title }}</h2>
<p>{{ post.body|truncatewords:30 }}</p>
<p>Published {{ post.created_at|date:"M j, Y" }}</p>
<p>Author: {{ post.author|default:"Unknown" }}</p>`,
      },
      {
        type: 'table',
        headers: ['Filter', 'What it does'],
        rows: [
          ['title', 'Capitalizes words for display'],
          ['truncatewords:30', 'Shows only the first 30 words'],
          ['date:"M j, Y"', 'Formats a date'],
          ['default:"Unknown"', 'Shows fallback text for empty values'],
          ['length', 'Returns the number of items or characters'],
        ],
      },
      { type: 'h2', text: 'Load tag libraries' },
      { type: 'p', text: 'Some tags live in libraries that must be loaded first. Static file tags are a common example.' },
      {
        type: 'code',
        title: 'Load static tags',
        language: 'html',
        code: `{% load static %}

<link rel="stylesheet" href="{% static 'blog/styles.css' %}">`,
      },
      { type: 'tip', text: 'Filters are for display changes. If you are deciding which records to show, do that in the view or model instead of hiding many things in the template.' },
      { type: 'try', text: 'Make a template that shows a course title in title case, displays a short description with truncatewords, and shows "Beginner" when a level is missing.' },
      { type: 'keypoints', items: ['Template tags perform actions inside templates.', 'Filters format or transform displayed values.', 'Use the url tag for named route links.', 'Use load static before using the static tag.'] },
    ],
  },
  {
    slug: 'django-template-inheritance',
    title: 'Template Inheritance',
    description: 'Create a base template and extend it so pages can share layout, navigation, styles, and reusable blocks.',
    level: 'beginner',
    section: 'Templates',
    order: 11,
    minutes: 10,
    content: [
      { type: 'p', text: 'Most websites have repeated HTML: the same document structure, header, navigation, footer, and CSS links. Template inheritance lets you write that shared layout once.' },
      { type: 'h2', text: 'Create a base template' },
      { type: 'p', text: 'A base template defines blocks. Child templates fill those blocks with page-specific content.' },
      {
        type: 'code',
        title: 'templates/base.html',
        language: 'html',
        code: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{% block title %}My Django Site{% endblock %}</title>
</head>
<body>
  <header>
    <a href="/">My Django Site</a>
    <nav>
      <a href="/blog/">Blog</a>
      <a href="/courses/">Courses</a>
    </nav>
  </header>

  <main>
    {% block content %}{% endblock %}
  </main>
</body>
</html>`,
      },
      { type: 'h2', text: 'Extend the base template' },
      {
        type: 'code',
        title: 'blog/templates/blog/post_list.html',
        language: 'html',
        code: `{% extends "base.html" %}

{% block title %}Blog Posts{% endblock %}

{% block content %}
  <h1>Blog Posts</h1>
  {% for post in posts %}
    <article>
      <h2>{{ post.title }}</h2>
    </article>
  {% endfor %}
{% endblock %}`,
      },
      { type: 'h2', text: 'Configure project templates' },
      { type: 'p', text: 'If you put base.html in a project-level templates folder, make sure settings.py includes that folder in DIRS.' },
      {
        type: 'code',
        title: 'mysite/settings.py',
        language: 'python',
        code: `from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]`,
      },
      { type: 'note', text: 'App templates still work when APP_DIRS is True. The project-level templates folder is useful for shared files such as base.html.' },
      { type: 'try', text: 'Create a base.html template with title and content blocks. Then make an about page template that extends it.' },
      { type: 'keypoints', items: ['Template inheritance avoids repeated layout HTML.', 'A base template defines blocks.', 'Child templates use extends and block to fill content.', 'Project-level templates can be added with TEMPLATES DIRS.'] },
    ],
  },
  {
    slug: 'django-static',
    title: 'Static Files (CSS/JS/Images)',
    description: 'Add CSS, JavaScript, and images to Django pages using static files, app static folders, and the static template tag.',
    level: 'beginner',
    section: 'Templates',
    order: 12,
    minutes: 10,
    content: [
      { type: 'p', text: 'Static files are files that are sent to the browser as-is: CSS, JavaScript, images, icons, fonts, and downloads. Django has a built-in static files system for development.' },
      { type: 'h2', text: 'Create an app static folder' },
      { type: 'p', text: 'A common app-level path repeats the app name, similar to templates. This avoids conflicts when multiple apps have files with the same name.' },
      {
        type: 'code',
        title: 'Static file layout',
        language: 'text',
        code: `blog/
  static/
    blog/
      styles.css
      main.js
      logo.png`,
      },
      { type: 'h2', text: 'Load CSS in a template' },
      {
        type: 'code',
        title: 'templates/base.html',
        language: 'html',
        code: `{% load static %}
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{% block title %}My Site{% endblock %}</title>
  <link rel="stylesheet" href="{% static 'blog/styles.css' %}">
</head>
<body>
  {% block content %}{% endblock %}
</body>
</html>`,
      },
      {
        type: 'code',
        title: 'blog/static/blog/styles.css',
        language: 'text',
        code: `body {
  font-family: Arial, sans-serif;
  margin: 2rem;
}

.post-card {
  border: 1px solid #ddd;
  padding: 1rem;
}`,
      },
      { type: 'h2', text: 'Static settings' },
      { type: 'p', text: 'New Django projects include STATIC_URL by default. During development, Django can serve static files when django.contrib.staticfiles is installed.' },
      {
        type: 'code',
        title: 'mysite/settings.py',
        language: 'python',
        code: `INSTALLED_APPS = [
    "django.contrib.staticfiles",
    "blog",
]

STATIC_URL = "static/"`,
      },
      { type: 'tip', text: 'If your CSS does not load, check the browser developer tools Network tab and confirm that the href path matches the file location.' },
      { type: 'try', text: 'Create blog/static/blog/styles.css, load it in base.html with the static tag, and change the color of h1 headings.' },
      { type: 'keypoints', items: ['Static files include CSS, JavaScript, images, and fonts.', 'Use app/static/app_name/ to avoid filename conflicts.', 'Load {% static %} before using the static tag.', 'STATIC_URL sets the URL prefix for static files.'] },
    ],
  },
  {
    slug: 'django-models',
    title: 'Models & the ORM Intro',
    description: 'Define Django models and understand how the ORM maps Python classes to database tables.',
    level: 'beginner',
    section: 'Models & Database',
    order: 13,
    minutes: 12,
    content: [
      { type: 'p', text: 'Models describe the data your app stores. Django uses models to create database tables and to let you work with database records using Python code.' },
      { type: 'h2', text: 'A model is a Python class' },
      { type: 'p', text: 'If you know basic Python classes, this will look familiar. A Django model class inherits from models.Model and defines fields as class attributes.' },
      {
        type: 'code',
        title: 'blog/models.py',
        language: 'python',
        code: `from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title`,
      },
      {
        type: 'table',
        headers: ['Field', 'Use'],
        rows: [
          ['CharField', 'Short text with a max_length'],
          ['TextField', 'Long text'],
          ['BooleanField', 'True or false values'],
          ['DateTimeField', 'Dates and times'],
          ['IntegerField', 'Whole numbers'],
          ['DecimalField', 'Precise decimal numbers such as prices'],
        ],
      },
      { type: 'h2', text: 'The ORM' },
      { type: 'p', text: 'ORM means Object-Relational Mapper. It lets you write Python instead of raw SQL for many common database tasks.' },
      {
        type: 'code',
        title: 'Working with model objects',
        language: 'python',
        code: `post = Post(title="Learning Models", body="Models store data.")
post.published = True
post.save()

all_posts = Post.objects.all()`,
      },
      { type: 'h2', text: 'Model metadata' },
      { type: 'p', text: 'The inner Meta class can define model options, such as default ordering. You do not need Meta for every model, but it is common in real apps.' },
      {
        type: 'code',
        title: 'Add default ordering',
        language: 'python',
        code: `class Post(models.Model):
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]`,
      },
      { type: 'note', text: '__str__ is a normal Python special method. Django uses it in places like the admin so objects display with helpful names.' },
      { type: 'try', text: 'Design a Product model for an inventory app with name, description, price, quantity, and active fields.' },
      { type: 'keypoints', items: ['Models define database-backed data using Python classes.', 'Fields describe the type of data stored in each column.', 'The ORM lets you create, read, update, and delete records with Python.', '__str__ gives model objects a friendly display name.'] },
    ],
  },
  {
    slug: 'django-migrations',
    title: 'Migrations',
    description: 'Use makemigrations and migrate to turn Django model changes into database table changes safely.',
    level: 'beginner',
    section: 'Models & Database',
    order: 14,
    minutes: 10,
    content: [
      { type: 'p', text: 'Migrations are Django files that describe database changes. When you add or edit models, migrations help update the database structure in a repeatable way.' },
      { type: 'h2', text: 'The two-step workflow' },
      { type: 'p', text: 'First, create migration files from model changes. Second, apply those migrations to the database.' },
      {
        type: 'code',
        title: 'Create and apply migrations',
        language: 'bash',
        code: `python manage.py makemigrations
python manage.py migrate`,
      },
      { type: 'p', text: 'makemigrations writes migration files into an app migrations folder. migrate applies unapplied migrations to the database.' },
      { type: 'h2', text: 'Example model change' },
      {
        type: 'code',
        title: 'blog/models.py',
        language: 'python',
        code: `from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    published = models.BooleanField(default=False)`,
      },
      {
        type: 'code',
        title: 'Migration commands',
        language: 'bash',
        code: `python manage.py makemigrations blog
python manage.py migrate`,
      },
      { type: 'h2', text: 'Check migration status' },
      {
        type: 'code',
        title: 'Show migrations',
        language: 'bash',
        code: `python manage.py showmigrations`,
      },
      {
        type: 'table',
        headers: ['Command', 'Purpose'],
        rows: [
          ['makemigrations', 'Creates migration files from model changes'],
          ['migrate', 'Applies migrations to the database'],
          ['showmigrations', 'Shows which migrations are applied'],
          ['sqlmigrate', 'Shows SQL for a migration'],
        ],
      },
      { type: 'warning', text: 'Do not edit the database tables by hand while learning Django migrations. Let Django manage schema changes through migration files.' },
      { type: 'try', text: 'Add a created_at DateTimeField to a Post model, run makemigrations, inspect the generated migration file name, then run migrate.' },
      { type: 'keypoints', items: ['Migrations describe database schema changes.', 'Run makemigrations after model changes.', 'Run migrate to apply migration files to the database.', 'Migration files should be committed with your code in real projects.'] },
    ],
  },
  {
    slug: 'django-admin',
    title: 'Django Admin',
    description: 'Use Django admin to manage database records and customize how models appear in the built-in admin site.',
    level: 'beginner',
    section: 'Models & Database',
    order: 15,
    minutes: 11,
    content: [
      { type: 'p', text: 'Django admin is a built-in web interface for managing your app data. It is one of Django\'s most loved features because it gives you a working admin area quickly.' },
      { type: 'h2', text: 'Prepare the database and superuser' },
      { type: 'p', text: 'The admin uses Django\'s authentication and session tables, so run migrations first. Then create a superuser account.' },
      {
        type: 'code',
        title: 'Set up admin access',
        language: 'bash',
        code: `python manage.py migrate
python manage.py createsuperuser
python manage.py runserver`,
      },
      { type: 'p', text: 'Open http://127.0.0.1:8000/admin/ and sign in with the superuser credentials you created.' },
      { type: 'h2', text: 'Register a model' },
      { type: 'p', text: 'A model will not appear in the admin until you register it in the app admin.py file.' },
      {
        type: 'code',
        title: 'blog/admin.py',
        language: 'python',
        code: `from django.contrib import admin

from .models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "published", "created_at"]
    list_filter = ["published", "created_at"]
    search_fields = ["title", "body"]`,
      },
      { type: 'h2', text: 'Useful admin options' },
      {
        type: 'table',
        headers: ['Option', 'What it changes'],
        rows: [
          ['list_display', 'Columns shown on the model list page'],
          ['list_filter', 'Sidebar filters'],
          ['search_fields', 'Search box fields'],
          ['ordering', 'Default order in the admin list'],
          ['readonly_fields', 'Fields visible but not editable'],
        ],
      },
      {
        type: 'code',
        title: 'blog/models.py',
        language: 'python',
        code: `class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title`,
      },
      { type: 'tip', text: 'The admin is excellent for staff workflows and learning your data model. It is not usually the public-facing user interface for customers.' },
      { type: 'try', text: 'Register a Product model in the admin with list_display for name, price, quantity, and active.' },
      { type: 'keypoints', items: ['Django admin is a built-in data management interface.', 'Run migrations and create a superuser before using it.', 'Register models in admin.py to make them appear.', 'ModelAdmin options customize list columns, filters, and search.'] },
    ],
  },
  {
    slug: 'django-queryset-basics',
    title: 'QuerySet Basics (CRUD)',
    description: 'Use Django QuerySets to create, read, update, and delete database records with Python.',
    level: 'beginner',
    section: 'Models & Database',
    order: 16,
    minutes: 12,
    content: [
      { type: 'p', text: 'A QuerySet represents a database query. You use QuerySets to fetch model objects, filter them, order them, create new records, update records, and delete records.' },
      { type: 'h2', text: 'Open the Django shell' },
      { type: 'p', text: 'The Django shell loads your project settings so you can experiment with models safely while learning.' },
      {
        type: 'code',
        title: 'Start the shell',
        language: 'bash',
        code: `python manage.py shell`,
      },
      { type: 'h2', text: 'Create and read records' },
      {
        type: 'code',
        title: 'Create posts',
        language: 'python',
        code: `from blog.models import Post

Post.objects.create(
    title="First Post",
    body="This post was created from the shell.",
    published=True,
)

Post.objects.create(
    title="Draft Post",
    body="This one is not public yet.",
    published=False,
)`,
      },
      {
        type: 'code',
        title: 'Read posts',
        language: 'python',
        code: `all_posts = Post.objects.all()
published_posts = Post.objects.filter(published=True)
first_post = Post.objects.get(id=1)

for post in published_posts:
    print(post.title)`,
      },
      { type: 'h2', text: 'Update and delete records' },
      {
        type: 'code',
        title: 'Update one object',
        language: 'python',
        code: `post = Post.objects.get(id=1)
post.title = "Updated First Post"
post.save()`,
      },
      {
        type: 'code',
        title: 'Delete one object',
        language: 'python',
        code: `post = Post.objects.get(id=1)
post.delete()`,
      },
      {
        type: 'table',
        headers: ['Method', 'Purpose'],
        rows: [
          ['all()', 'Return all records'],
          ['filter()', 'Return records matching conditions'],
          ['get()', 'Return exactly one record or raise an error'],
          ['create()', 'Create and save a new record'],
          ['order_by()', 'Sort records'],
          ['delete()', 'Delete records'],
        ],
      },
      { type: 'warning', text: 'Use get() only when you expect exactly one object. If no object or multiple objects match, Django raises an exception.' },
      { type: 'try', text: 'Create three Product records in the shell, filter active products, update one quantity, and delete one test product.' },
      { type: 'keypoints', items: ['QuerySets let you work with database records in Python.', 'CRUD means create, read, update, and delete.', 'filter returns a QuerySet; get returns one object.', 'Call save after changing an object field.'] },
    ],
  },
  {
    slug: 'django-relations',
    title: 'Model Relationships (FK, M2M, O2O)',
    description: 'Connect Django models with ForeignKey, ManyToManyField, and OneToOneField relationships.',
    level: 'beginner',
    section: 'Models & Database',
    order: 17,
    minutes: 13,
    content: [
      { type: 'p', text: 'Real apps have related data. Blog posts have authors, products have categories, students enroll in many courses, and user profiles belong to users. Django models can describe these relationships.' },
      { type: 'h2', text: 'ForeignKey: many to one' },
      { type: 'p', text: 'A ForeignKey means many objects can point to one object. Many posts can belong to one author.' },
      {
        type: 'code',
        title: 'blog/models.py',
        language: 'python',
        code: `from django.conf import settings
from django.db import models


class Post(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts",
    )
    title = models.CharField(max_length=200)
    body = models.TextField()`,
      },
      { type: 'p', text: 'on_delete=models.CASCADE means that if the author is deleted, their posts are deleted too. Other on_delete choices exist for different rules.' },
      { type: 'h2', text: 'ManyToManyField: many to many' },
      { type: 'p', text: 'A ManyToManyField means objects on both sides can relate to many objects. A course can have many students, and a student can join many courses.' },
      {
        type: 'code',
        title: 'courses/models.py',
        language: 'python',
        code: `from django.conf import settings
from django.db import models


class Course(models.Model):
    title = models.CharField(max_length=200)
    students = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="courses",
        blank=True,
    )`,
      },
      { type: 'h2', text: 'OneToOneField: one to one' },
      { type: 'p', text: 'A OneToOneField means each object connects to only one object on the other side. A profile is a common example.' },
      {
        type: 'code',
        title: 'accounts/models.py',
        language: 'python',
        code: `from django.conf import settings
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    bio = models.TextField(blank=True)`,
      },
      {
        type: 'table',
        headers: ['Relationship', 'Example'],
        rows: [
          ['ForeignKey', 'Many posts belong to one author'],
          ['ManyToManyField', 'Many students join many courses'],
          ['OneToOneField', 'One user has one profile'],
        ],
      },
      { type: 'tip', text: 'Use settings.AUTH_USER_MODEL when relating to Django\'s user model. It keeps your code compatible with custom user models.' },
      { type: 'try', text: 'Design models for an inventory app where each Product belongs to one Category and each Product can have many Supplier records.' },
      { type: 'keypoints', items: ['ForeignKey represents many-to-one relationships.', 'ManyToManyField represents many-to-many relationships.', 'OneToOneField represents one-to-one relationships.', 'related_name controls the reverse lookup name.'] },
    ],
  },
  {
    slug: 'django-forms',
    title: 'Forms Basics',
    description: 'Build Django forms, display them in templates, handle GET and POST requests, and read cleaned data.',
    level: 'beginner',
    section: 'Forms',
    order: 18,
    minutes: 12,
    content: [
      { type: 'p', text: 'Forms let users send data to your Django app. Django forms help you define fields, display form HTML, validate input, and work with cleaned data.' },
      { type: 'h2', text: 'Create a basic form' },
      {
        type: 'code',
        title: 'blog/forms.py',
        language: 'python',
        code: `from django import forms


class ContactForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    message = forms.CharField(widget=forms.Textarea)`,
      },
      { type: 'p', text: 'This form is not connected to a model. It is useful for contact forms, search filters, signup interest forms, and other input that may not map directly to one database table.' },
      { type: 'h2', text: 'Handle GET and POST' },
      { type: 'p', text: 'A browser normally uses GET to request the blank form page and POST to submit form data.' },
      {
        type: 'code',
        title: 'blog/views.py',
        language: 'python',
        code: `from django.shortcuts import render

from .forms import ContactForm


def contact(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data["name"]
            message = form.cleaned_data["message"]
            return render(request, "blog/thanks.html", {"name": name})
    else:
        form = ContactForm()

    return render(request, "blog/contact.html", {"form": form})`,
      },
      { type: 'h2', text: 'Display the form' },
      {
        type: 'code',
        title: 'blog/templates/blog/contact.html',
        language: 'html',
        code: `<h1>Contact us</h1>

<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Send</button>
</form>`,
      },
      { type: 'note', text: 'csrf_token helps protect POST forms from cross-site request forgery attacks. Include it in Django templates for POST forms.' },
      { type: 'try', text: 'Create a FeedbackForm with name, rating, and comments fields. Display it in a template and handle a valid POST in a view.' },
      { type: 'keypoints', items: ['Django forms define expected user input.', 'GET commonly shows a blank form; POST submits data.', 'is_valid checks input and fills cleaned_data.', 'Use csrf_token in POST forms.'] },
    ],
  },
  {
    slug: 'django-modelforms',
    title: 'ModelForms',
    description: 'Use ModelForm to create and edit model objects with less repeated form code.',
    level: 'beginner',
    section: 'Forms',
    order: 19,
    minutes: 11,
    content: [
      { type: 'p', text: 'A ModelForm builds a form from a model. It saves time when a form creates or edits database records because Django can reuse model field information.' },
      { type: 'h2', text: 'Create a model and ModelForm' },
      {
        type: 'code',
        title: 'blog/models.py',
        language: 'python',
        code: `from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    published = models.BooleanField(default=False)`,
      },
      {
        type: 'code',
        title: 'blog/forms.py',
        language: 'python',
        code: `from django import forms

from .models import Post


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ["title", "body", "published"]`,
      },
      { type: 'h2', text: 'Create an object with a ModelForm' },
      {
        type: 'code',
        title: 'blog/views.py',
        language: 'python',
        code: `from django.shortcuts import redirect, render

from .forms import PostForm


def post_create(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("blog:post_list")
    else:
        form = PostForm()

    return render(request, "blog/post_form.html", {"form": form})`,
      },
      { type: 'h2', text: 'Edit an existing object' },
      {
        type: 'code',
        title: 'Use instance for editing',
        language: 'python',
        code: `from django.shortcuts import get_object_or_404, redirect, render

from .forms import PostForm
from .models import Post


def post_edit(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    if request.method == "POST":
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            form.save()
            return redirect("blog:post_detail", post_id=post.id)
    else:
        form = PostForm(instance=post)

    return render(request, "blog/post_form.html", {"form": form})`,
      },
      { type: 'warning', text: 'Prefer listing fields explicitly instead of using fields = "__all__". Explicit fields help prevent accidentally exposing fields users should not edit.' },
      { type: 'try', text: 'Create a ProductForm for a Product model and include only name, price, quantity, and active fields.' },
      { type: 'keypoints', items: ['ModelForm creates form fields from a model.', 'The Meta class connects the form to a model and selected fields.', 'form.save creates or updates the model object.', 'Pass instance when editing an existing object.'] },
    ],
  },
  {
    slug: 'django-form-validation',
    title: 'Form Validation',
    description: 'Validate Django form fields with built-in validators, custom clean methods, and user-friendly error messages.',
    level: 'beginner',
    section: 'Forms',
    order: 20,
    minutes: 12,
    content: [
      { type: 'p', text: 'Validation checks whether submitted form data is acceptable. Django forms validate field types, required values, lengths, choices, and your own custom rules.' },
      { type: 'h2', text: 'Built-in validation' },
      { type: 'p', text: 'Fields such as EmailField and IntegerField already know how to validate common input. Field options add more rules.' },
      {
        type: 'code',
        title: 'courses/forms.py',
        language: 'python',
        code: `from django import forms


class EnrollmentForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    age = forms.IntegerField(min_value=13)
    agree_to_terms = forms.BooleanField()`,
      },
      { type: 'h2', text: 'Custom field validation' },
      { type: 'p', text: 'Add a clean_fieldname method to validate one field. Raise forms.ValidationError when the value is not allowed.' },
      {
        type: 'code',
        title: 'Validate one field',
        language: 'python',
        code: `from django import forms


class EnrollmentForm(forms.Form):
    email = forms.EmailField()

    def clean_email(self):
        email = self.cleaned_data["email"]
        if not email.endswith("@example.com"):
            raise forms.ValidationError("Use your example.com email address.")
        return email`,
      },
      { type: 'h2', text: 'Validate fields together' },
      {
        type: 'code',
        title: 'Validate related fields',
        language: 'python',
        code: `class DiscountForm(forms.Form):
    subtotal = forms.DecimalField(min_value=0)
    discount = forms.DecimalField(min_value=0)

    def clean(self):
        cleaned_data = super().clean()
        subtotal = cleaned_data.get("subtotal")
        discount = cleaned_data.get("discount")

        if subtotal is not None and discount is not None:
            if discount > subtotal:
                raise forms.ValidationError("Discount cannot be larger than subtotal.")

        return cleaned_data`,
      },
      { type: 'h2', text: 'Show errors in a template' },
      {
        type: 'code',
        title: 'blog/templates/blog/form.html',
        language: 'html',
        code: `<form method="post">
  {% csrf_token %}
  {{ form.non_field_errors }}

  {% for field in form %}
    <p>
      {{ field.label_tag }}
      {{ field }}
      {{ field.errors }}
    </p>
  {% endfor %}

  <button type="submit">Save</button>
</form>`,
      },
      { type: 'tip', text: 'Use clear validation messages that tell the user how to fix the problem, not just that something is wrong.' },
      { type: 'try', text: 'Create a SignupForm that rejects usernames shorter than 4 characters and rejects passwords that do not match a confirm_password field.' },
      { type: 'keypoints', items: ['Validation runs when you call form.is_valid().', 'Built-in form fields provide many common checks.', 'clean_fieldname validates one field.', 'clean validates combinations of fields.'] },
    ],
  },
  {
    slug: 'django-messages',
    title: 'Messages Framework',
    description: 'Show one-time success, error, warning, and info messages after form submissions and redirects.',
    level: 'beginner',
    section: 'Request & Response',
    order: 21,
    minutes: 9,
    content: [
      { type: 'p', text: 'The messages framework lets you store short one-time messages for the next page load. It is commonly used after creating, updating, deleting, logging in, or logging out.' },
      { type: 'h2', text: 'Add a success message' },
      { type: 'p', text: 'Messages are especially useful with redirects. The view sets the message, redirects, and the next template displays it.' },
      {
        type: 'code',
        title: 'blog/views.py',
        language: 'python',
        code: `from django.contrib import messages
from django.shortcuts import redirect, render

from .forms import PostForm


def post_create(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Post created successfully.")
            return redirect("blog:post_list")
    else:
        form = PostForm()

    return render(request, "blog/post_form.html", {"form": form})`,
      },
      { type: 'h2', text: 'Display messages in a base template' },
      {
        type: 'code',
        title: 'templates/base.html',
        language: 'html',
        code: `{% if messages %}
  <ul class="messages">
    {% for message in messages %}
      <li class="{{ message.tags }}">{{ message }}</li>
    {% endfor %}
  </ul>
{% endif %}`,
      },
      { type: 'h2', text: 'Message levels' },
      {
        type: 'table',
        headers: ['Function', 'Common meaning'],
        rows: [
          ['messages.success', 'An action worked'],
          ['messages.error', 'An action failed'],
          ['messages.warning', 'The user should be careful'],
          ['messages.info', 'Neutral information'],
          ['messages.debug', 'Development-only detail'],
        ],
      },
      {
        type: 'code',
        title: 'Different message levels',
        language: 'python',
        code: `messages.info(request, "Draft saved.")
messages.warning(request, "Inventory is running low.")
messages.error(request, "Payment could not be processed.")`,
      },
      { type: 'note', text: 'New Django projects include the messages app and context processor by default. If messages do not appear, check INSTALLED_APPS, MIDDLEWARE, and TEMPLATES context_processors.' },
      { type: 'try', text: 'After a product is created, redirect to the product list and show "Product added successfully." using messages.success.' },
      { type: 'keypoints', items: ['Messages are one-time notifications stored for the next response.', 'They are commonly used before redirects.', 'Display messages in a shared base template.', 'Message tags can be used as CSS classes.'] },
    ],
  },
  {
    slug: 'django-redirects',
    title: 'Redirects & HttpResponse',
    description: 'Return simple responses, redirect users after actions, and choose the right response type for beginner Django views.',
    level: 'beginner',
    section: 'Request & Response',
    order: 22,
    minutes: 9,
    content: [
      { type: 'p', text: 'Every Django view returns an HTTP response. Sometimes that response is HTML, sometimes it is plain text, and sometimes it tells the browser to go to a different URL.' },
      { type: 'h2', text: 'HttpResponse' },
      { type: 'p', text: 'HttpResponse returns content directly. It is useful for tiny examples, health checks, downloads, or special responses, but full pages usually use templates.' },
      {
        type: 'code',
        title: 'blog/views.py',
        language: 'python',
        code: `from django.http import HttpResponse


def status(request):
    return HttpResponse("The site is running.")`,
      },
      { type: 'h2', text: 'render returns HTML from a template' },
      {
        type: 'code',
        title: 'Render a page',
        language: 'python',
        code: `from django.shortcuts import render


def about(request):
    return render(request, "blog/about.html", {"team_size": 4})`,
      },
      { type: 'h2', text: 'redirect sends the browser elsewhere' },
      { type: 'p', text: 'After a successful POST request, redirect to another page. This avoids duplicate form submissions if the user refreshes the browser.' },
      {
        type: 'code',
        title: 'Redirect after saving',
        language: 'python',
        code: `from django.shortcuts import redirect, render

from .forms import PostForm


def post_create(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save()
            return redirect("blog:post_detail", post_id=post.id)
    else:
        form = PostForm()

    return render(request, "blog/post_form.html", {"form": form})`,
      },
      {
        type: 'table',
        headers: ['Return helper', 'Use when'],
        rows: [
          ['HttpResponse', 'You want to return simple content directly'],
          ['render', 'You want to return an HTML template'],
          ['redirect', 'You want the browser to request another URL'],
        ],
      },
      { type: 'tip', text: 'Use the POST-redirect-GET pattern for successful form submissions: receive POST, save data, redirect to a GET page.' },
      { type: 'try', text: 'Create a view that returns HttpResponse for /status/ and another view that redirects from /home/ to your blog post list.' },
      { type: 'keypoints', items: ['Django views must return response objects.', 'HttpResponse returns direct content.', 'render combines a template with context.', 'redirect tells the browser to visit another URL.'] },
    ],
  },
  {
    slug: 'django-404-500',
    title: 'Custom 404/500 & Raising 404',
    description: 'Raise 404 errors, use get_object_or_404, and create custom 404 and 500 error templates.',
    level: 'beginner',
    section: 'Request & Response',
    order: 23,
    minutes: 10,
    content: [
      { type: 'p', text: 'Web apps need friendly error pages. A 404 means a page was not found. A 500 means the server hit an unexpected error.' },
      { type: 'h2', text: 'Raise a 404' },
      { type: 'p', text: 'If a requested object does not exist, return a 404 instead of crashing or showing the wrong page.' },
      {
        type: 'code',
        title: 'blog/views.py',
        language: 'python',
        code: `from django.http import Http404

from .models import Post


def post_detail(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        raise Http404("Post not found")

    return render(request, "blog/post_detail.html", {"post": post})`,
      },
      { type: 'h2', text: 'Use get_object_or_404' },
      { type: 'p', text: 'Django provides a shortcut for the common pattern of getting one object or raising a 404.' },
      {
        type: 'code',
        title: 'Cleaner detail view',
        language: 'python',
        code: `from django.shortcuts import get_object_or_404, render

from .models import Post


def post_detail(request, post_id):
    post = get_object_or_404(Post, id=post_id, published=True)
    return render(request, "blog/post_detail.html", {"post": post})`,
      },
      { type: 'h2', text: 'Custom error templates' },
      { type: 'p', text: 'Django looks for 404.html and 500.html templates. In development, you must set DEBUG = False to see the custom 404 and 500 pages.' },
      {
        type: 'code',
        title: 'templates/404.html',
        language: 'html',
        code: `{% extends "base.html" %}

{% block title %}Page not found{% endblock %}

{% block content %}
  <h1>Page not found</h1>
  <p>We could not find the page you requested.</p>
  <a href="/">Go back home</a>
{% endblock %}`,
      },
      {
        type: 'code',
        title: 'templates/500.html',
        language: 'html',
        code: `{% extends "base.html" %}

{% block title %}Server error{% endblock %}

{% block content %}
  <h1>Something went wrong</h1>
  <p>Please try again later.</p>
{% endblock %}`,
      },
      { type: 'warning', text: 'When DEBUG = False, Django also requires ALLOWED_HOSTS to include the host you are using, such as "127.0.0.1" during a local test.' },
      { type: 'try', text: 'Update a product detail view to use get_object_or_404(Product, id=product_id, active=True), then create a simple 404.html template.' },
      { type: 'keypoints', items: ['404 means the requested page or object was not found.', 'Http404 manually raises a not-found response.', 'get_object_or_404 is the common shortcut for detail pages.', 'Custom 404.html and 500.html templates improve the user experience.'] },
    ],
  },
  {
    slug: 'django-slug-detail',
    title: 'Detail Pages & Slugs',
    description: 'Create readable detail page URLs with slug fields, unique slugs, URL patterns, and get_object_or_404.',
    level: 'beginner',
    section: 'Building Pages',
    order: 24,
    minutes: 12,
    content: [
      { type: 'p', text: 'A detail page shows one object, such as one blog post, one course, or one product. Slugs make detail URLs readable for people and search engines.' },
      { type: 'h2', text: 'What is a slug?' },
      { type: 'p', text: 'A slug is a URL-friendly piece of text, usually lowercase words separated by hyphens. For example, "learning-django-templates" is easier to read than "42".' },
      {
        type: 'code',
        title: 'blog/models.py',
        language: 'python',
        code: `from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    body = models.TextField()
    published = models.BooleanField(default=False)

    def __str__(self):
        return self.title`,
      },
      { type: 'h2', text: 'Add a slug URL' },
      {
        type: 'code',
        title: 'blog/urls.py',
        language: 'python',
        code: `from django.urls import path

from . import views

app_name = "blog"

urlpatterns = [
    path("", views.post_list, name="post_list"),
    path("<slug:slug>/", views.post_detail, name="post_detail"),
]`,
      },
      { type: 'h2', text: 'Write the detail view' },
      {
        type: 'code',
        title: 'blog/views.py',
        language: 'python',
        code: `from django.shortcuts import get_object_or_404, render

from .models import Post


def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, published=True)
    return render(request, "blog/post_detail.html", {"post": post})`,
      },
      {
        type: 'code',
        title: 'blog/templates/blog/post_detail.html',
        language: 'html',
        code: `{% extends "base.html" %}

{% block title %}{{ post.title }}{% endblock %}

{% block content %}
  <article>
    <h1>{{ post.title }}</h1>
    <p>{{ post.body }}</p>
  </article>
{% endblock %}`,
      },
      { type: 'h2', text: 'Link to the detail page' },
      {
        type: 'code',
        title: 'blog/templates/blog/post_list.html',
        language: 'html',
        code: `{% for post in posts %}
  <h2>
    <a href="{% url 'blog:post_detail' post.slug %}">
      {{ post.title }}
    </a>
  </h2>
{% endfor %}`,
      },
      { type: 'tip', text: 'In the admin, you can often type slugs by hand while learning. Later you can add prepopulated_fields or automatic slug creation.' },
      { type: 'try', text: 'Add a slug field to a Course model, create a course_detail URL using <slug:slug>, and write a view that fetches only published courses.' },
      { type: 'keypoints', items: ['Detail pages show one object.', 'Slugs create readable URLs.', 'SlugField stores URL-friendly text.', 'Use get_object_or_404 to fetch the object or return a 404.'] },
    ],
  },
  {
    slug: 'django-list-detail',
    title: 'List + Detail Pattern',
    description: 'Build the common Django list and detail page pattern for blogs, courses, inventory apps, and other real projects.',
    level: 'beginner',
    section: 'Building Pages',
    order: 25,
    minutes: 14,
    content: [
      { type: 'p', text: 'Many Django features use the same page pattern: a list page shows many objects, and a detail page shows one selected object. Blogs, courses, products, events, and documentation sites all use it.' },
      { type: 'h2', text: 'Model for the pattern' },
      {
        type: 'code',
        title: 'courses/models.py',
        language: 'python',
        code: `from django.db import models


class Course(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    summary = models.TextField()
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title`,
      },
      { type: 'h2', text: 'URLs for list and detail' },
      {
        type: 'code',
        title: 'courses/urls.py',
        language: 'python',
        code: `from django.urls import path

from . import views

app_name = "courses"

urlpatterns = [
    path("", views.course_list, name="course_list"),
    path("<slug:slug>/", views.course_detail, name="course_detail"),
]`,
      },
      { type: 'h2', text: 'Views for list and detail' },
      {
        type: 'code',
        title: 'courses/views.py',
        language: 'python',
        code: `from django.shortcuts import get_object_or_404, render

from .models import Course


def course_list(request):
    courses = Course.objects.filter(is_published=True)
    return render(request, "courses/course_list.html", {"courses": courses})


def course_detail(request, slug):
    course = get_object_or_404(Course, slug=slug, is_published=True)
    return render(request, "courses/course_detail.html", {"course": course})`,
      },
      { type: 'h2', text: 'Templates for the pattern' },
      {
        type: 'code',
        title: 'courses/templates/courses/course_list.html',
        language: 'html',
        code: `{% extends "base.html" %}

{% block title %}Courses{% endblock %}

{% block content %}
  <h1>Courses</h1>

  {% for course in courses %}
    <article>
      <h2>
        <a href="{% url 'courses:course_detail' course.slug %}">
          {{ course.title }}
        </a>
      </h2>
      <p>{{ course.summary|truncatewords:25 }}</p>
    </article>
  {% empty %}
    <p>No courses are available yet.</p>
  {% endfor %}
{% endblock %}`,
      },
      {
        type: 'code',
        title: 'courses/templates/courses/course_detail.html',
        language: 'html',
        code: `{% extends "base.html" %}

{% block title %}{{ course.title }}{% endblock %}

{% block content %}
  <article>
    <h1>{{ course.title }}</h1>
    <p>{{ course.summary }}</p>
  </article>

  <p><a href="{% url 'courses:course_list' %}">Back to all courses</a></p>
{% endblock %}`,
      },
      { type: 'h2', text: 'Why this pattern matters' },
      { type: 'p', text: 'Once you understand list plus detail, you can build many beginner Django pages. Change the model and template text, but keep the same routing and view ideas.' },
      {
        type: 'table',
        headers: ['App', 'List page', 'Detail page'],
        rows: [
          ['Blog', 'All published posts', 'One post'],
          ['Courses', 'All published courses', 'One course'],
          ['Inventory', 'All active products', 'One product'],
          ['Events', 'Upcoming events', 'One event'],
        ],
      },
      { type: 'tip', text: 'Keep unpublished or inactive objects out of both the list and detail queries. Otherwise someone might guess a URL and view hidden content.' },
      { type: 'try', text: 'Build the list plus detail pattern for an inventory Product model with active products, product slugs, product_list, and product_detail.' },
      { type: 'keypoints', items: ['List pages show many objects; detail pages show one object.', 'The list template links to detail pages with named URLs.', 'The detail view should use get_object_or_404.', 'The list plus detail pattern appears throughout real Django projects.'] },
    ],
  },
];
