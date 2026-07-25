import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'django-testing',
    title: 'Testing Views, Models & Forms',
    description:
      'Use Django tests to protect models, forms, views, permissions, redirects, and templates before bugs reach users.',
    level: 'advanced',
    section: 'Quality & Safety',
    order: 49,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Advanced Django teams treat tests as a safety net for behavior. A good test does not prove that every line exists. It proves that important user-facing rules keep working after refactors.',
      },
      {
        type: 'p',
        text: 'Django includes a strong testing toolkit: a temporary test database, model assertions, form validation, a request client, login helpers, URL reversing, and template checks.',
      },
      { type: 'h2', text: 'Run the test suite' },
      {
        type: 'code',
        title: 'Running all tests or one app',
        language: 'bash',
        code: `python manage.py test
python manage.py test blog
python manage.py test blog.tests.PostModelTests`,
      },
      {
        type: 'note',
        text: 'Django creates a separate test database, applies migrations, runs the tests, then destroys the database. Your development data should not be touched.',
      },
      { type: 'h2', text: 'Test model behavior' },
      {
        type: 'p',
        text: 'Model tests are best for business rules: string output, computed properties, custom managers, validation, default values, and methods that should stay stable.',
      },
      {
        type: 'code',
        title: 'A model test for publish rules',
        language: 'python',
        code: `# blog/tests/test_models.py
from django.test import TestCase
from django.utils import timezone

from blog.models import Post


class PostModelTests(TestCase):
    def test_published_posts_are_visible(self):
        post = Post.objects.create(
            title="Testing Django",
            slug="testing-django",
            body="A practical testing guide.",
            status=Post.Status.PUBLISHED,
            published_at=timezone.now(),
        )

        self.assertTrue(post.is_public)
        self.assertEqual(str(post), "Testing Django")

    def test_draft_posts_are_not_public(self):
        post = Post.objects.create(
            title="Draft",
            slug="draft",
            body="Not ready yet.",
            status=Post.Status.DRAFT,
        )

        self.assertFalse(post.is_public)`,
      },
      { type: 'h2', text: 'Test forms as validation contracts' },
      {
        type: 'p',
        text: 'Form tests should focus on valid inputs, invalid inputs, helpful error messages, and cleaned data. They are faster and clearer than testing the same validation only through a browser-style view test.',
      },
      {
        type: 'code',
        title: 'Testing valid and invalid form data',
        language: 'python',
        code: `# blog/tests/test_forms.py
from django.test import SimpleTestCase

from blog.forms import CommentForm


class CommentFormTests(SimpleTestCase):
    def test_valid_comment(self):
        form = CommentForm(data={
            "name": "Ada",
            "email": "ada@example.com",
            "body": "Clear and useful post.",
        })

        self.assertTrue(form.is_valid())

    def test_rejects_short_comment(self):
        form = CommentForm(data={
            "name": "Ada",
            "email": "ada@example.com",
            "body": "Ok",
        })

        self.assertFalse(form.is_valid())
        self.assertIn("body", form.errors)`,
      },
      { type: 'h2', text: 'Test views with the Django client' },
      {
        type: 'p',
        text: 'The test client sends fake HTTP requests through URL routing, middleware, views, templates, and responses. Use it to verify status codes, redirects, context data, authentication, and rendered content.',
      },
      {
        type: 'code',
        title: 'Testing a list page and a detail page',
        language: 'python',
        code: `# blog/tests/test_views.py
from django.test import TestCase
from django.urls import reverse

from blog.models import Post


class BlogViewTests(TestCase):
    def setUp(self):
        self.post = Post.objects.create(
            title="Ship Better Django",
            slug="ship-better-django",
            body="Use tests for confidence.",
            status=Post.Status.PUBLISHED,
        )

    def test_post_list_shows_published_posts(self):
        response = self.client.get(reverse("blog:post_list"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Ship Better Django")
        self.assertTemplateUsed(response, "blog/post_list.html")

    def test_post_detail_uses_slug(self):
        response = self.client.get(
            reverse("blog:post_detail", kwargs={"slug": self.post.slug})
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["post"], self.post)`,
      },
      { type: 'h2', text: 'Test authentication and permissions' },
      {
        type: 'code',
        title: 'Login and redirect checks',
        language: 'python',
        code: `# accounts/tests/test_dashboard.py
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse


class DashboardTests(TestCase):
    def test_anonymous_user_redirects_to_login(self):
        response = self.client.get(reverse("dashboard"))

        self.assertEqual(response.status_code, 302)
        self.assertIn("/accounts/login/", response["Location"])

    def test_authenticated_user_can_view_dashboard(self):
        User = get_user_model()
        user = User.objects.create_user(
            username="sam",
            email="sam@example.com",
            password="safe-test-password",
        )
        self.client.force_login(user)

        response = self.client.get(reverse("dashboard"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Dashboard")`,
      },
      {
        type: 'table',
        headers: ['Test target', 'Good assertions', 'Avoid'],
        rows: [
          ['Model', 'Methods, validation, custom managers', 'Duplicating Django ORM internals'],
          ['Form', 'is_valid, errors, cleaned_data', 'Only testing through views'],
          ['View', 'status, template, context, redirects', 'Large tests that know every HTML detail'],
          ['Permission', 'anonymous, owner, staff, forbidden', 'Testing only the happy path'],
        ],
      },
      {
        type: 'tip',
        text: 'Write one test for every bug you fix. The test should fail before the fix and pass after the fix.',
      },
      {
        type: 'try',
        text: 'Pick one view in your project and add three tests: anonymous access, authenticated access, and invalid input.',
      },
      {
        type: 'keypoints',
        items: [
          'Django tests run against an isolated test database.',
          'Model tests protect business rules and computed behavior.',
          'Form tests make validation easy to understand and maintain.',
          'View tests should verify user-visible behavior, not implementation details.',
        ],
      },
    ],
  },
  {
    slug: 'django-security',
    title: 'Django Security Essentials',
    description:
      'Configure production security settings, protect secrets, avoid unsafe query patterns, and use Django security checks.',
    level: 'advanced',
    section: 'Quality & Safety',
    order: 50,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Django ships with many security protections, but production safety still depends on correct settings and disciplined code. Security is not one feature. It is a collection of defaults, habits, reviews, and monitoring.',
      },
      { type: 'h2', text: 'Start with Django security checks' },
      {
        type: 'code',
        title: 'Run deployment checks',
        language: 'bash',
        code: `python manage.py check --deploy`,
      },
      {
        type: 'p',
        text: 'The deploy check points out risky settings such as DEBUG enabled, missing secure cookie settings, missing HSTS, or overly broad hosts. Treat these warnings as a production readiness checklist.',
      },
      { type: 'h2', text: 'Core production settings' },
      {
        type: 'code',
        title: 'Security-focused settings',
        language: 'python',
        code: `# config/settings/production.py
DEBUG = False

ALLOWED_HOSTS = ["www.example.com", "example.com"]
CSRF_TRUSTED_ORIGINS = ["https://www.example.com"]

SECRET_KEY = env("DJANGO_SECRET_KEY")

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SECURE_HSTS_SECONDS = 60 * 60 * 24 * 30
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
REFERRER_POLICY = "same-origin"`,
      },
      {
        type: 'warning',
        text: 'Enable HSTS only after HTTPS is working correctly for your domain. Browsers remember HSTS, so a bad rollout can lock users out until the policy expires.',
      },
      { type: 'h2', text: 'Keep secrets outside Git' },
      {
        type: 'p',
        text: 'A secret committed to Git should be considered leaked. Store secrets in environment variables or a secret manager, rotate exposed values, and keep local `.env` files ignored.',
      },
      {
        type: 'code',
        title: 'Example environment file',
        language: 'text',
        code: `DJANGO_SECRET_KEY=replace-me-with-a-long-random-value
DATABASE_URL=postgres://app:password@localhost:5432/app
DJANGO_ALLOWED_HOSTS=example.com,www.example.com
DJANGO_DEBUG=false`,
      },
      { type: 'h2', text: 'Use ORM parameters instead of string SQL' },
      {
        type: 'p',
        text: 'Django querysets safely parameterize values. The most common way to lose that protection is to build raw SQL strings with user input.',
      },
      {
        type: 'code',
        title: 'Unsafe and safe raw SQL',
        language: 'python',
        code: `# Unsafe: never build SQL by formatting user input.
User.objects.raw(f"SELECT * FROM auth_user WHERE username = '{username}'")

# Safer: pass parameters separately.
User.objects.raw(
    "SELECT * FROM auth_user WHERE username = %s",
    [username],
)`,
      },
      { type: 'h2', text: 'Passwords and authentication' },
      {
        type: 'ul',
        items: [
          'Use Django password hashers, never store raw passwords.',
          'Keep password validators enabled for public applications.',
          'Use `login_required`, permission decorators, or mixins consistently.',
          'Prefer object-level ownership checks for private resources.',
          'Enable multi-factor authentication for admin and staff where possible.',
        ],
      },
      {
        type: 'code',
        title: 'Object ownership check',
        language: 'python',
        code: `# documents/views.py
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required

from .models import Document


@login_required
def document_detail(request, pk):
    document = get_object_or_404(Document, pk=pk, owner=request.user)
    return render(request, "documents/detail.html", {"document": document})`,
      },
      { type: 'h2', text: 'Admin safety' },
      {
        type: 'p',
        text: 'The Django admin is powerful and should be treated as a privileged operations surface. Use strong staff passwords, limit staff permissions, avoid exposing unnecessary models, and keep audit logs for important actions.',
      },
      {
        type: 'table',
        headers: ['Risk', 'Django tool', 'Your responsibility'],
        rows: [
          ['SQL injection', 'ORM parameterization', 'Do not format raw SQL with input'],
          ['Host header attacks', 'ALLOWED_HOSTS', 'List only real hostnames'],
          ['Secret leakage', 'Settings from environment', 'Never commit secrets'],
          ['Session theft', 'Secure cookies over HTTPS', 'Serve production over TLS'],
          ['Over-permission', 'Auth permissions and groups', 'Check ownership and staff scope'],
        ],
      },
      {
        type: 'try',
        text: 'Run `python manage.py check --deploy` on a practice project and fix each warning in a production settings file.',
      },
      {
        type: 'keypoints',
        items: [
          'Django provides strong security defaults, but settings still matter.',
          'Production must run with DEBUG disabled and strict ALLOWED_HOSTS.',
          'Secrets belong in environment variables or a secret manager.',
          'Always validate permissions at both login and object ownership levels.',
        ],
      },
    ],
  },
  {
    slug: 'django-csrf-xss',
    title: 'CSRF, XSS & Clickjacking in Practice',
    description:
      'Understand the browser attacks Django helps prevent and how to keep those protections working in real apps.',
    level: 'advanced',
    section: 'Quality & Safety',
    order: 51,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'CSRF, XSS, and clickjacking are browser-centered attacks. They are common because web apps trust cookies, render user content, and allow pages to be embedded unless told otherwise.',
      },
      { type: 'h2', text: 'CSRF: forged form submissions' },
      {
        type: 'p',
        text: 'Cross-Site Request Forgery tricks a logged-in browser into submitting a request the user did not intend. Django protects unsafe HTTP methods by requiring a CSRF token.',
      },
      {
        type: 'code',
        title: 'CSRF token in a Django form',
        language: 'html',
        code: `<form method="post" action="{% url 'billing:update_card' %}">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Save card</button>
</form>`,
      },
      {
        type: 'code',
        title: 'CSRF token in fetch',
        language: 'html',
        code: `<script>
  function getCookie(name) {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1];
  }

  async function savePreference(value) {
    await fetch('/settings/theme/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ theme: value }),
    });
  }
</script>`,
      },
      {
        type: 'warning',
        text: 'Do not mark a view `csrf_exempt` to make a bug disappear. If an external webhook cannot send a CSRF token, verify a signature or shared secret instead.',
      },
      { type: 'h2', text: 'XSS: unsafe content in the page' },
      {
        type: 'p',
        text: 'Cross-Site Scripting happens when user-controlled content becomes executable JavaScript. Django templates escape variables by default, which is one of the strongest protections in the framework.',
      },
      {
        type: 'code',
        title: 'Escaped by default',
        language: 'html',
        code: `<h1>{{ post.title }}</h1>
<p>{{ comment.body }}</p>`,
      },
      {
        type: 'code',
        title: 'Dangerous output',
        language: 'html',
        code: `<!-- Avoid this unless the content is sanitized and trusted. -->
<div>{{ comment.body|safe }}</div>`,
      },
      {
        type: 'p',
        text: 'Use `safe` only for content that has been sanitized or generated by trusted code. Rich text from users should go through an allowlist sanitizer that removes scripts, event handlers, and unsafe URLs.',
      },
      { type: 'h2', text: 'Safer JSON in templates' },
      {
        type: 'p',
        text: 'Passing raw JSON into a script tag can create XSS bugs. Django provides `json_script` to safely embed data that JavaScript can read later.',
      },
      {
        type: 'code',
        title: 'Safely embedding JSON',
        language: 'html',
        code: `{{ chart_data|json_script:"chart-data" }}

<script>
  const element = document.getElementById('chart-data');
  const chartData = JSON.parse(element.textContent);
</script>`,
      },
      { type: 'h2', text: 'Clickjacking: invisible frames' },
      {
        type: 'p',
        text: 'Clickjacking places your site inside an invisible or misleading frame so a user clicks something they did not intend. Django protects this with the `X_FRAME_OPTIONS` setting and clickjacking middleware.',
      },
      {
        type: 'code',
        title: 'Frame protection settings',
        language: 'python',
        code: `MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # other middleware...
]

X_FRAME_OPTIONS = "DENY"`,
      },
      {
        type: 'table',
        headers: ['Attack', 'Main protection', 'Common mistake'],
        rows: [
          ['CSRF', 'CSRF middleware and tokens', 'Exempting normal browser forms'],
          ['XSS', 'Template autoescaping', 'Using safe on user content'],
          ['JSON XSS', 'json_script', 'Printing raw JSON inside script tags'],
          ['Clickjacking', 'X_FRAME_OPTIONS', 'Allowing frames without a reason'],
        ],
      },
      {
        type: 'try',
        text: 'Create a form view, remove `{% csrf_token %}`, confirm Django rejects the POST, then restore the token and confirm the request works.',
      },
      {
        type: 'keypoints',
        items: [
          'CSRF tokens prove that unsafe browser requests came from your site.',
          'Django templates escape variables by default to reduce XSS risk.',
          'Use json_script when passing server data to JavaScript.',
          'Clickjacking protection should stay enabled unless a view truly must be framed.',
        ],
      },
    ],
  },
  {
    slug: 'django-deployment',
    title: 'Deploying Django (Gunicorn, WhiteNoise, Env Vars)',
    description:
      'Prepare Django for production with Gunicorn, WhiteNoise, environment variables, static collection, and deployment checks.',
    level: 'advanced',
    section: 'Shipping',
    order: 52,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'Deploying Django means running it with production settings, a real WSGI server, static files collected, secrets outside source control, and a database that will survive restarts.',
      },
      { type: 'h2', text: 'The production request path' },
      {
        type: 'p',
        text: 'A common setup is: browser to HTTPS load balancer or reverse proxy, then Gunicorn, then Django. Gunicorn runs worker processes that import your Django WSGI application.',
      },
      {
        type: 'code',
        title: 'Install common production packages',
        language: 'bash',
        code: `python -m pip install gunicorn whitenoise dj-database-url django-environ psycopg[binary]`,
      },
      { type: 'h2', text: 'Read configuration from environment variables' },
      {
        type: 'code',
        title: 'Production settings with django-environ',
        language: 'python',
        code: `# config/settings.py
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
)
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("DJANGO_SECRET_KEY")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=[])

DATABASES = {
    "default": env.db("DATABASE_URL"),
}

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"`,
      },
      {
        type: 'warning',
        text: 'If `DEBUG=False` and `ALLOWED_HOSTS` is empty, Django will reject requests. This is a feature, not a deployment problem.',
      },
      { type: 'h2', text: 'Add WhiteNoise middleware' },
      {
        type: 'code',
        title: 'WhiteNoise near the top of middleware',
        language: 'python',
        code: `MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    # remaining middleware...
]`,
      },
      {
        type: 'p',
        text: 'WhiteNoise lets Django serve collected static files efficiently for many small and medium deployments. Larger teams often move static files to a CDN later, but WhiteNoise is a strong default for a first production deployment.',
      },
      { type: 'h2', text: 'Collect static files' },
      {
        type: 'code',
        title: 'Build command',
        language: 'bash',
        code: `python manage.py check --deploy
python manage.py collectstatic --noinput
python manage.py migrate`,
      },
      { type: 'h2', text: 'Start Gunicorn' },
      {
        type: 'code',
        title: 'Gunicorn command',
        language: 'bash',
        code: `gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 60`,
      },
      {
        type: 'p',
        text: 'The `config.wsgi:application` value means import `application` from `config/wsgi.py`. Your project name may be different.',
      },
      { type: 'h2', text: 'Example Procfile-style deployment' },
      {
        type: 'code',
        title: 'Procfile',
        language: 'text',
        code: `release: python manage.py migrate
web: gunicorn config.wsgi:application --log-file -`,
      },
      {
        type: 'table',
        headers: ['Concern', 'Development', 'Production'],
        rows: [
          ['Server', 'runserver', 'Gunicorn or uWSGI behind HTTPS'],
          ['Secrets', 'Local .env', 'Platform env vars or secret manager'],
          ['Static files', 'Served by Django dev server', 'collectstatic plus WhiteNoise or CDN'],
          ['Database', 'SQLite or local Postgres', 'Managed Postgres with backups'],
          ['Debugging', 'Browser error pages', 'Logs, error tracking, health checks'],
        ],
      },
      {
        type: 'try',
        text: 'Set `DEBUG=False` locally with a temporary secret and allowed host of `localhost`, then run `check --deploy` and `collectstatic`.',
      },
      {
        type: 'keypoints',
        items: [
          'Production Django should run under Gunicorn or another production WSGI server.',
          'Use environment variables for secrets and deployment-specific settings.',
          'WhiteNoise is a simple, reliable static file option for many deployments.',
          'Run checks, collectstatic, and migrations as part of deployment.',
        ],
      },
    ],
  },
  {
    slug: 'django-postgres',
    title: 'PostgreSQL in Production',
    description:
      'Configure Django for PostgreSQL, use migrations carefully, understand indexes, and operate production databases safely.',
    level: 'advanced',
    section: 'Shipping',
    order: 53,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'SQLite is excellent for learning and small local experiments. PostgreSQL is the common production choice because it handles concurrency, indexes, constraints, backups, JSON, full-text search, and operational tooling well.',
      },
      { type: 'h2', text: 'Connect Django to Postgres' },
      {
        type: 'code',
        title: 'Install driver and set DATABASE_URL',
        language: 'bash',
        code: `python -m pip install "psycopg[binary]" dj-database-url
export DATABASE_URL="postgres://app:secret@localhost:5432/appdb"`,
      },
      {
        type: 'code',
        title: 'Database settings',
        language: 'python',
        code: `# config/settings.py
import dj_database_url

DATABASES = {
    "default": dj_database_url.config(
        default="postgres://app:secret@localhost:5432/appdb",
        conn_max_age=600,
        conn_health_checks=True,
    )
}`,
      },
      {
        type: 'note',
        text: '`conn_max_age` keeps database connections open for reuse. This reduces connection overhead, but your database plan still needs enough connection capacity for your workers.',
      },
      { type: 'h2', text: 'Use constraints for data integrity' },
      {
        type: 'p',
        text: 'Application checks are helpful, but database constraints are the final guard. Use unique constraints, check constraints, non-null fields, and foreign keys for rules that must never be broken.',
      },
      {
        type: 'code',
        title: 'Model constraints',
        language: 'python',
        code: `# subscriptions/models.py
from django.conf import settings
from django.db import models
from django.db.models import Q


class Subscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    plan = models.CharField(max_length=30)
    status = models.CharField(max_length=20)
    seats = models.PositiveIntegerField(default=1)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user"],
                condition=Q(status="active"),
                name="one_active_subscription_per_user",
            ),
            models.CheckConstraint(
                check=Q(seats__gte=1),
                name="subscription_seats_at_least_one",
            ),
        ]`,
      },
      { type: 'h2', text: 'Add indexes intentionally' },
      {
        type: 'p',
        text: 'Indexes speed up reads but slow down writes and take space. Add them for common filters, joins, ordering, and uniqueness. Confirm with query plans when performance matters.',
      },
      {
        type: 'code',
        title: 'Indexes for common query patterns',
        language: 'python',
        code: `class Order(models.Model):
    customer = models.ForeignKey("customers.Customer", on_delete=models.CASCADE)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["customer", "-created_at"]),
            models.Index(fields=["status", "-created_at"]),
        ]`,
      },
      { type: 'h2', text: 'Inspect SQL and query plans' },
      {
        type: 'code',
        title: 'Using QuerySet.explain',
        language: 'python',
        code: `queryset = Order.objects.filter(
    customer=request.user.customer,
    status="paid",
).order_by("-created_at")

print(queryset.explain())`,
      },
      { type: 'h2', text: 'Production migration habits' },
      {
        type: 'ul',
        items: [
          'Review generated migrations before committing them.',
          'Avoid huge data migrations in a request path.',
          'Deploy nullable fields first, backfill data, then add non-null constraints.',
          'Do not rename or delete columns casually on very large tables.',
          'Take backups and know how to restore them before a risky migration.',
        ],
      },
      {
        type: 'code',
        title: 'Safer multi-step field rollout',
        language: 'text',
        code: `1. Add new field as nullable.
2. Deploy code that writes both old and new values.
3. Backfill existing rows in batches.
4. Deploy code that reads the new field.
5. Add NOT NULL or remove old field in a later deploy.`,
      },
      {
        type: 'table',
        headers: ['Postgres feature', 'Django use case', 'Example'],
        rows: [
          ['Constraints', 'Protect data rules', 'Unique active subscription'],
          ['Indexes', 'Speed common filters', 'Orders by customer and date'],
          ['Transactions', 'Keep multi-step writes atomic', 'Create order and payment record'],
          ['JSONB', 'Flexible metadata', 'Event payloads with known access patterns'],
          ['Full-text search', 'Search content', 'Articles, products, documents'],
        ],
      },
      {
        type: 'try',
        text: 'Choose a slow queryset, add an index in `Meta.indexes`, run migrations, and compare `queryset.explain()` before and after.',
      },
      {
        type: 'keypoints',
        items: [
          'PostgreSQL is a strong default for production Django applications.',
          'Constraints protect data even when application code has a bug.',
          'Indexes should match real query patterns.',
          'Large production migrations need staged rollouts and backups.',
        ],
      },
    ],
  },
  {
    slug: 'django-static-prod',
    title: 'Static/Media in Production',
    description:
      'Understand the difference between static and media files, collect assets, serve uploads, and avoid common production file mistakes.',
    level: 'advanced',
    section: 'Shipping',
    order: 54,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Static files and media files are different. Static files are versioned assets that ship with your code, such as CSS, JavaScript, icons, and admin assets. Media files are user uploads, such as avatars, documents, and product images.',
      },
      { type: 'h2', text: 'Static files: build-time assets' },
      {
        type: 'code',
        title: 'Static settings for production',
        language: 'python',
        code: `STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"`,
      },
      {
        type: 'code',
        title: 'Collect static before deployment',
        language: 'bash',
        code: `python manage.py collectstatic --noinput`,
      },
      {
        type: 'note',
        text: 'Manifest storage adds hashed filenames such as `app.3f4a9d.css`. This lets browsers cache files for a long time while still receiving updates when content changes.',
      },
      { type: 'h2', text: 'Using static files in templates' },
      {
        type: 'code',
        title: 'Template static tag',
        language: 'html',
        code: `{% load static %}

<link rel="stylesheet" href="{% static 'css/site.css' %}">
<img src="{% static 'img/logo.svg' %}" alt="Company logo">`,
      },
      { type: 'h2', text: 'Media files: user uploads' },
      {
        type: 'p',
        text: 'Media files must persist across deployments. Do not store important user uploads only inside an application container or temporary server disk unless that disk is persistent and backed up.',
      },
      {
        type: 'code',
        title: 'Local media settings for development',
        language: 'python',
        code: `MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"`,
      },
      {
        type: 'code',
        title: 'Development-only media serving',
        language: 'python',
        code: `# config/urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("pages.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)`,
      },
      {
        type: 'warning',
        text: 'The `static()` helper for media is for development only. In production, serve media from object storage, a CDN, or a web server configured for uploaded files.',
      },
      { type: 'h2', text: 'A common production layout' },
      {
        type: 'code',
        title: 'Production file responsibilities',
        language: 'text',
        code: `Django app:
  - Generates HTML
  - References static and media URLs

WhiteNoise or CDN:
  - Serves collected static files

Object storage or web server:
  - Stores user uploads
  - Serves media files
  - Keeps files through deploys`,
      },
      { type: 'h2', text: 'Upload validation' },
      {
        type: 'p',
        text: 'Uploaded files are user input. Validate size, type, extension, and ownership. Avoid trusting file names, and store uploads under paths controlled by your code.',
      },
      {
        type: 'code',
        title: 'Controlled upload path',
        language: 'python',
        code: `# profiles/models.py
from pathlib import Path
from uuid import uuid4

from django.db import models


def avatar_upload_path(instance, filename):
    extension = Path(filename).suffix.lower()
    return f"avatars/user-{instance.user_id}/{uuid4()}{extension}"


class Profile(models.Model):
    user = models.OneToOneField("auth.User", on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to=avatar_upload_path, blank=True)`,
      },
      {
        type: 'table',
        headers: ['File type', 'Created by', 'Collected?', 'Should persist?'],
        rows: [
          ['Static', 'Developers and packages', 'Yes, with collectstatic', 'Can be rebuilt from code'],
          ['Media', 'Users or admins', 'No', 'Yes, must be stored safely'],
          ['Generated reports', 'Application jobs', 'Usually no', 'Depends on business need'],
        ],
      },
      {
        type: 'try',
        text: 'Add one CSS file with `{% static %}`, run `collectstatic`, and inspect the generated `staticfiles` directory.',
      },
      {
        type: 'keypoints',
        items: [
          'Static files ship with code; media files are user uploads.',
          'Run collectstatic during deployment.',
          'Use hashed static filenames for long browser caching.',
          'Production media storage must be persistent and backed up.',
        ],
      },
    ],
  },
  {
    slug: 'django-caching',
    title: 'Caching Strategies',
    description:
      'Use Django caching at the right layer: per-view, fragment, low-level, database query, and HTTP cache headers.',
    level: 'advanced',
    section: 'Performance',
    order: 55,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Caching stores expensive results so future requests can reuse them. It can make a Django site much faster, but only when you cache the right thing and know when it becomes stale.',
      },
      { type: 'h2', text: 'Choose a cache backend' },
      {
        type: 'code',
        title: 'Local memory cache for development',
        language: 'python',
        code: `CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-dev-cache",
    }
}`,
      },
      {
        type: 'code',
        title: 'Redis-style cache configuration',
        language: 'python',
        code: `CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
    }
}`,
      },
      {
        type: 'note',
        text: 'Local memory cache is not shared between processes. Use Redis or Memcached when multiple workers need the same cache.',
      },
      { type: 'h2', text: 'Per-view caching' },
      {
        type: 'p',
        text: 'Per-view caching is simple for pages that are mostly the same for everyone, such as public landing pages, documentation, or marketing pages.',
      },
      {
        type: 'code',
        title: 'Cache one view for five minutes',
        language: 'python',
        code: `# pages/urls.py
from django.urls import path
from django.views.decorators.cache import cache_page

from . import views

urlpatterns = [
    path(
        "pricing/",
        cache_page(60 * 5)(views.pricing),
        name="pricing",
    ),
]`,
      },
      { type: 'h2', text: 'Template fragment caching' },
      {
        type: 'p',
        text: 'Fragment caching stores part of a template. It is useful when one expensive section sits inside a page that still needs fresh user-specific content.',
      },
      {
        type: 'code',
        title: 'Cache an expensive sidebar',
        language: 'html',
        code: `{% load cache %}

{% cache 600 popular_posts %}
  <aside>
    <h2>Popular posts</h2>
    {% for post in popular_posts %}
      <a href="{{ post.get_absolute_url }}">{{ post.title }}</a>
    {% endfor %}
  </aside>
{% endcache %}`,
      },
      { type: 'h2', text: 'Low-level cache API' },
      {
        type: 'p',
        text: 'The low-level cache API is good for expensive computations, API responses, counts, permission summaries, or data that is expensive to assemble.',
      },
      {
        type: 'code',
        title: 'Cache a dashboard summary',
        language: 'python',
        code: `# analytics/services.py
from django.core.cache import cache


def get_account_summary(account_id):
    cache_key = f"account-summary:{account_id}"
    summary = cache.get(cache_key)

    if summary is not None:
        return summary

    summary = build_expensive_summary(account_id)
    cache.set(cache_key, summary, timeout=300)
    return summary`,
      },
      { type: 'h2', text: 'Invalidate deliberately' },
      {
        type: 'p',
        text: 'Every cache needs an invalidation plan. You can use short timeouts, delete specific keys after writes, or include a version value in the cache key.',
      },
      {
        type: 'code',
        title: 'Delete a cache key after a write',
        language: 'python',
        code: `from django.core.cache import cache


def update_account_name(account, name):
    account.name = name
    account.save(update_fields=["name"])

    cache.delete(f"account-summary:{account.id}")`,
      },
      { type: 'h2', text: 'HTTP cache headers' },
      {
        type: 'code',
        title: 'Browser and proxy cache headers',
        language: 'python',
        code: `from django.views.decorators.cache import cache_control


@cache_control(public=True, max_age=300)
def public_report(request):
    return render(request, "reports/public.html")`,
      },
      {
        type: 'table',
        headers: ['Layer', 'Best for', 'Risk'],
        rows: [
          ['Per-view', 'Public pages', 'Serving user-specific data to the wrong user'],
          ['Fragment', 'Expensive template sections', 'Forgetting a key that changes output'],
          ['Low-level API', 'Computed summaries', 'Stale data after writes'],
          ['HTTP headers', 'Browser and CDN caching', 'Caching private responses'],
        ],
      },
      {
        type: 'warning',
        text: 'Never cache a full response that includes private user data unless the cache key varies by user and all headers are correct. Public caches can leak data when configured carelessly.',
      },
      {
        type: 'try',
        text: 'Add low-level caching to an expensive count on a dashboard, then delete the key whenever the related object changes.',
      },
      {
        type: 'keypoints',
        items: [
          'Cache only after you know what is expensive or frequently repeated.',
          'Choose a cache backend that matches your deployment.',
          'Every cached value needs an invalidation or expiration plan.',
          'Be extremely careful caching pages that include user-specific data.',
        ],
      },
    ],
  },
  {
    slug: 'django-async-views',
    title: 'Async Views & When They Help',
    description:
      'Learn what async Django views can and cannot improve, how to call async services, and how to avoid blocking the event loop.',
    level: 'advanced',
    section: 'Performance',
    order: 56,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Async views let Django handle certain I/O waits without blocking a worker thread. They are useful for views that wait on network APIs, chat services, search services, or multiple independent I/O calls.',
      },
      {
        type: 'p',
        text: 'Async is not a magic speed switch. CPU-heavy work, slow database queries, and poorly indexed pages do not become fast just because the view uses `async def`.',
      },
      { type: 'h2', text: 'A basic async view' },
      {
        type: 'code',
        title: 'Async view calling an external API',
        language: 'python',
        code: `# weather/views.py
import httpx
from django.http import JsonResponse


async def current_weather(request):
    async with httpx.AsyncClient(timeout=5) as client:
        response = await client.get("https://api.example.com/weather")
        response.raise_for_status()

    return JsonResponse(response.json())`,
      },
      {
        type: 'note',
        text: 'Use async-compatible libraries inside async views. A synchronous HTTP client inside an async view still blocks.',
      },
      { type: 'h2', text: 'Run independent calls concurrently' },
      {
        type: 'code',
        title: 'Gather two API calls',
        language: 'python',
        code: `# dashboard/views.py
import asyncio

import httpx
from django.shortcuts import render


async def partner_dashboard(request):
    async with httpx.AsyncClient(timeout=5) as client:
        profile_task = client.get("https://api.example.com/profile")
        billing_task = client.get("https://api.example.com/billing")
        profile_response, billing_response = await asyncio.gather(
            profile_task,
            billing_task,
        )

    context = {
        "profile": profile_response.json(),
        "billing": billing_response.json(),
    }
    return render(request, "dashboard/partner.html", context)`,
      },
      { type: 'h2', text: 'Database access still needs care' },
      {
        type: 'p',
        text: 'Django has async ORM capabilities, but many database operations and third-party packages are still synchronous. When you must call synchronous code from an async view, wrap it safely.',
      },
      {
        type: 'code',
        title: 'Wrapping sync ORM work',
        language: 'python',
        code: `# reports/views.py
from asgiref.sync import sync_to_async
from django.shortcuts import render

from .models import Report


@sync_to_async
def get_latest_reports(user):
    return list(
        Report.objects.filter(owner=user)
        .select_related("owner")
        .order_by("-created_at")[:10]
    )


async def report_list(request):
    reports = await get_latest_reports(request.user)
    return render(request, "reports/list.html", {"reports": reports})`,
      },
      { type: 'h2', text: 'ASGI deployment' },
      {
        type: 'p',
        text: 'Async views show their full value when the project runs under ASGI. WSGI can still call async views, but it cannot provide the same concurrency benefits.',
      },
      {
        type: 'code',
        title: 'Example ASGI server command',
        language: 'bash',
        code: `python -m pip install uvicorn
uvicorn config.asgi:application --host 0.0.0.0 --port 8000`,
      },
      {
        type: 'table',
        headers: ['Situation', 'Async helps?', 'Why'],
        rows: [
          ['Waiting on several HTTP APIs', 'Yes', 'Concurrent I/O can reduce total wait time'],
          ['Large CPU calculation', 'No', 'The event loop still has to do the work'],
          ['Slow unindexed database query', 'Not much', 'Fix the query and indexes first'],
          ['Long report generation', 'Usually no', 'Use a background task instead'],
        ],
      },
      {
        type: 'warning',
        text: 'Do not block the event loop with `time.sleep`, synchronous HTTP calls, or heavy CPU loops inside async views. Use async libraries or move work to a task queue.',
      },
      {
        type: 'try',
        text: 'Write an async view that fetches two public API endpoints concurrently, then compare the time to fetching them one after another.',
      },
      {
        type: 'keypoints',
        items: [
          'Async views help most with network I/O waits.',
          'Use async-compatible libraries in async views.',
          'Synchronous ORM or package calls must be handled carefully.',
          'Background jobs are better than async views for long-running work.',
        ],
      },
    ],
  },
  {
    slug: 'django-celery-intro',
    title: 'Background Tasks (Celery-style Intro)',
    description:
      'Move slow work out of requests with a Celery-style task queue mental model, task definitions, retries, and status tracking.',
    level: 'advanced',
    section: 'Performance',
    order: 57,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'A web request should return quickly. Email sending, image processing, report generation, imports, exports, and third-party syncs often belong in background tasks instead of blocking the user.',
      },
      { type: 'h2', text: 'The task queue idea' },
      {
        type: 'p',
        text: 'A task queue has three main pieces: Django adds a job to a broker, a worker process picks up the job, and the worker runs the task outside the request-response cycle.',
      },
      {
        type: 'code',
        title: 'Task queue flow',
        language: 'text',
        code: `Browser request
  -> Django view validates input
  -> Django enqueues "send welcome email"
  -> Django returns response quickly

Worker process
  -> receives job from broker
  -> sends email
  -> records success or failure`,
      },
      { type: 'h2', text: 'Celery-style project setup' },
      {
        type: 'code',
        title: 'Install Celery and Redis support',
        language: 'bash',
        code: `python -m pip install celery redis`,
      },
      {
        type: 'code',
        title: 'Celery app file',
        language: 'python',
        code: `# config/celery.py
import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("config")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()`,
      },
      {
        type: 'code',
        title: 'Load the Celery app',
        language: 'python',
        code: `# config/__init__.py
from .celery import app as celery_app

__all__ = ("celery_app",)`,
      },
      {
        type: 'code',
        title: 'Settings for a Redis broker',
        language: 'python',
        code: `CELERY_BROKER_URL = "redis://localhost:6379/0"
CELERY_RESULT_BACKEND = "redis://localhost:6379/1"
CELERY_TASK_TIME_LIMIT = 60 * 5`,
      },
      { type: 'h2', text: 'Define a task' },
      {
        type: 'code',
        title: 'Email task',
        language: 'python',
        code: `# accounts/tasks.py
from celery import shared_task
from django.core.mail import send_mail


@shared_task(bind=True, max_retries=3)
def send_welcome_email(self, user_email):
    try:
        send_mail(
            subject="Welcome!",
            message="Thanks for creating an account.",
            from_email="hello@example.com",
            recipient_list=[user_email],
        )
    except Exception as exc:
        raise self.retry(exc=exc, countdown=30)`,
      },
      { type: 'h2', text: 'Call the task from a view or signal' },
      {
        type: 'code',
        title: 'Queue work after user creation',
        language: 'python',
        code: `# accounts/views.py
from django.shortcuts import redirect, render

from .forms import SignupForm
from .tasks import send_welcome_email


def signup(request):
    if request.method == "POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            send_welcome_email.delay(user.email)
            return redirect("signup_done")
    else:
        form = SignupForm()

    return render(request, "accounts/signup.html", {"form": form})`,
      },
      { type: 'h2', text: 'Run a worker locally' },
      {
        type: 'code',
        title: 'Worker process',
        language: 'bash',
        code: `celery -A config worker --loglevel=info`,
      },
      {
        type: 'warning',
        text: 'Do not pass full model objects to background tasks. Pass simple IDs or strings, then load fresh data inside the task.',
      },
      { type: 'h2', text: 'Task status model pattern' },
      {
        type: 'p',
        text: 'For user-visible jobs, create a model that records status. The view creates the record, queues a task with the record ID, and the task updates progress.',
      },
      {
        type: 'code',
        title: 'Report job status',
        language: 'python',
        code: `class ReportJob(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        RUNNING = "running", "Running"
        DONE = "done", "Done"
        FAILED = "failed", "Failed"

    owner = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    result_file = models.FileField(upload_to="reports/", blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)`,
      },
      {
        type: 'table',
        headers: ['Work type', 'Request or task?', 'Reason'],
        rows: [
          ['Validate a small form', 'Request', 'User needs immediate feedback'],
          ['Send email', 'Task', 'Network I/O can be slow or fail'],
          ['Generate CSV export', 'Task', 'May take seconds or minutes'],
          ['Charge payment', 'Request plus task', 'Authorize immediately, handle follow-up asynchronously'],
        ],
      },
      {
        type: 'try',
        text: 'Move a slow email send from a view into a task and return a success page immediately after queuing it.',
      },
      {
        type: 'keypoints',
        items: [
          'Background tasks keep web requests fast.',
          'Celery workers run outside Django request handling.',
          'Pass simple task arguments such as IDs, not model instances.',
          'Use retries and status records for work that users care about.',
        ],
      },
    ],
  },
  {
    slug: 'django-architecture',
    title: 'Structuring Larger Django Projects',
    description:
      'Organize large Django apps with clear boundaries, service modules, query modules, templates, and URL structure.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 58,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Small Django projects can keep most logic in models, forms, and views. Larger projects need more deliberate structure so features remain understandable as the codebase grows.',
      },
      { type: 'h2', text: 'Apps should represent product areas' },
      {
        type: 'p',
        text: 'A Django app should be a cohesive product or domain area, not a folder for one type of file. Good app names often sound like business concepts: accounts, billing, catalog, orders, courses, documents.',
      },
      {
        type: 'code',
        title: 'Example larger project tree',
        language: 'text',
        code: `config/
  settings/
  urls.py
  wsgi.py
  asgi.py
apps/
  accounts/
    models.py
    forms.py
    views.py
    urls.py
    services.py
    selectors.py
    tests/
  billing/
    models.py
    services.py
    webhooks.py
    tests/
  catalog/
    models.py
    admin.py
    views.py
    urls.py
templates/
static/`,
      },
      { type: 'h2', text: 'Keep views thin' },
      {
        type: 'p',
        text: 'Views should handle HTTP details: request method, form binding, authentication, messages, redirects, and response rendering. Complex business actions are easier to test when moved into service functions.',
      },
      {
        type: 'code',
        title: 'Thin view calling a service',
        language: 'python',
        code: `# billing/views.py
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

from .services import start_subscription


@login_required
def subscribe(request, plan_id):
    if request.method != "POST":
        return redirect("billing:plans")

    start_subscription(user=request.user, plan_id=plan_id)
    messages.success(request, "Subscription started.")
    return redirect("dashboard")`,
      },
      {
        type: 'code',
        title: 'Service function owns the business action',
        language: 'python',
        code: `# billing/services.py
from django.db import transaction

from .models import Plan, Subscription


@transaction.atomic
def start_subscription(*, user, plan_id):
    plan = Plan.objects.get(id=plan_id, is_active=True)
    Subscription.objects.filter(user=user, status="active").update(status="canceled")
    return Subscription.objects.create(
        user=user,
        plan=plan,
        status="active",
    )`,
      },
      { type: 'h2', text: 'Use selectors for complex reads' },
      {
        type: 'p',
        text: 'Some teams call read-focused functions selectors, queries, or repositories. The name matters less than the idea: complex query construction should have a home and tests.',
      },
      {
        type: 'code',
        title: 'Selector for dashboard data',
        language: 'python',
        code: `# projects/selectors.py
from .models import Project


def projects_for_dashboard(user):
    return (
        Project.objects.filter(members=user)
        .select_related("owner")
        .prefetch_related("tags")
        .order_by("-updated_at")
    )`,
      },
      { type: 'h2', text: 'Templates can be organized by app' },
      {
        type: 'code',
        title: 'Template structure',
        language: 'text',
        code: `templates/
  base.html
  includes/
    messages.html
    pagination.html
  accounts/
    login.html
    profile.html
  billing/
    plans.html
    invoice_detail.html`,
      },
      {
        type: 'table',
        headers: ['Code type', 'Good location', 'Example'],
        rows: [
          ['HTTP handling', 'views.py or views package', 'Bind form and redirect'],
          ['Business action', 'services.py', 'Start subscription'],
          ['Complex read', 'selectors.py or queries.py', 'Dashboard queryset'],
          ['Validation', 'forms.py or model clean', 'Signup form checks'],
          ['Integration edge', 'clients.py or gateways.py', 'Payment provider API'],
        ],
      },
      {
        type: 'tip',
        text: 'Do not create architecture folders before the project needs them. Add structure when it makes real code easier to find, test, and change.',
      },
      {
        type: 'try',
        text: 'Find a view with more than one business action and move one action into a service function with a focused unit test.',
      },
      {
        type: 'keypoints',
        items: [
          'Large Django projects need clear feature boundaries.',
          'Views should stay focused on HTTP concerns.',
          'Service functions are useful for transactional business actions.',
          'Selectors or query modules give complex reads a testable home.',
        ],
      },
    ],
  },
  {
    slug: 'django-settings-split',
    title: 'Split Settings & Environments',
    description:
      'Split Django settings into base, development, test, and production modules without losing clarity.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 59,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'One settings file is fine when a project is small. As soon as development, testing, staging, and production need different values, a settings package can make configuration safer and easier to reason about.',
      },
      { type: 'h2', text: 'Settings package layout' },
      {
        type: 'code',
        title: 'Split settings file tree',
        language: 'text',
        code: `config/
  settings/
    __init__.py
    base.py
    development.py
    test.py
    production.py
  urls.py
  wsgi.py
  asgi.py`,
      },
      { type: 'h2', text: 'Base settings contain shared values' },
      {
        type: 'code',
        title: 'Base settings',
        language: 'python',
        code: `# config/settings/base.py
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "apps.accounts",
    "apps.blog",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"`,
      },
      { type: 'h2', text: 'Development settings are convenient' },
      {
        type: 'code',
        title: 'Development settings',
        language: 'python',
        code: `# config/settings/development.py
from .base import *

SECRET_KEY = "dev-only-secret-key"
DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"`,
      },
      { type: 'h2', text: 'Production settings are strict' },
      {
        type: 'code',
        title: 'Production settings',
        language: 'python',
        code: `# config/settings/production.py
from .base import *

import environ

env = environ.Env()

SECRET_KEY = env("DJANGO_SECRET_KEY")
DEBUG = False
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS")
CSRF_TRUSTED_ORIGINS = env.list("DJANGO_CSRF_TRUSTED_ORIGINS", default=[])

DATABASES = {
    "default": env.db("DATABASE_URL"),
}

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 60 * 60 * 24 * 30`,
      },
      { type: 'h2', text: 'Test settings optimize repeatability' },
      {
        type: 'code',
        title: 'Test settings',
        language: 'python',
        code: `# config/settings/test.py
from .base import *

SECRET_KEY = "test-secret-key"
DEBUG = False
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"`,
      },
      { type: 'h2', text: 'Select settings with an environment variable' },
      {
        type: 'code',
        title: 'manage.py default for local development',
        language: 'python',
        code: `# manage.py
import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()`,
      },
      {
        type: 'code',
        title: 'Production command selects production settings',
        language: 'bash',
        code: `export DJANGO_SETTINGS_MODULE=config.settings.production
gunicorn config.wsgi:application`,
      },
      {
        type: 'table',
        headers: ['Environment', 'DEBUG', 'Database', 'Secret source'],
        rows: [
          ['Development', 'True', 'SQLite or local Postgres', 'Local dev value'],
          ['Test', 'False', 'Test database', 'Hardcoded test-only value'],
          ['Staging', 'False', 'Staging Postgres', 'Environment variable'],
          ['Production', 'False', 'Production Postgres', 'Secret manager or platform env'],
        ],
      },
      {
        type: 'warning',
        text: 'Avoid importing production settings from development settings. Keep production strict and explicit.',
      },
      {
        type: 'try',
        text: 'Convert a single settings file into `base.py` and `development.py`, then run `python manage.py check` with the new settings module.',
      },
      {
        type: 'keypoints',
        items: [
          'Split settings help keep environment-specific choices explicit.',
          'Base settings should hold shared app configuration.',
          'Production settings should read secrets from the environment and disable debug.',
          'The DJANGO_SETTINGS_MODULE value selects the active settings module.',
        ],
      },
    ],
  },
  {
    slug: 'django-project-blog',
    title: 'Mini Project: Blog Platform',
    description:
      'Build a production-shaped blog with posts, slugs, comments, moderation, tests, templates, and clean URL structure.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 60,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This mini project builds a small blog platform using production-friendly patterns: public posts, draft status, slug URLs, comment moderation, class or function views, templates, admin setup, and focused tests.',
      },
      { type: 'h2', text: 'What you will build' },
      {
        type: 'ul',
        items: [
          'A post list that shows only published posts.',
          'A post detail page at a slug URL.',
          'A comment form that saves comments as unapproved by default.',
          'Admin tools for publishing posts and approving comments.',
          'Tests for model behavior, list visibility, and comment posting.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create the app and file structure' },
      {
        type: 'code',
        title: 'Commands',
        language: 'bash',
        code: `python manage.py startapp blog
mkdir -p templates/blog
mkdir -p blog/tests`,
      },
      {
        type: 'code',
        title: 'Target structure',
        language: 'text',
        code: `blog/
  admin.py
  forms.py
  models.py
  urls.py
  views.py
  tests/
    __init__.py
    test_models.py
    test_views.py
templates/
  base.html
  blog/
    post_list.html
    post_detail.html`,
      },
      { type: 'h2', text: 'Step 2: Add the models' },
      {
        type: 'code',
        title: 'Post and Comment models',
        language: 'python',
        code: `# blog/models.py
from django.db import models
from django.urls import reverse
from django.utils import timezone


class PostQuerySet(models.QuerySet):
    def published(self):
        return self.filter(status=Post.Status.PUBLISHED, published_at__lte=timezone.now())


class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    body = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = PostQuerySet.as_manager()

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title

    @property
    def is_public(self):
        return self.status == self.Status.PUBLISHED and self.published_at <= timezone.now()

    def get_absolute_url(self):
        return reverse("blog:post_detail", kwargs={"slug": self.slug})


class Comment(models.Model):
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    email = models.EmailField()
    body = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Comment by {self.name} on {self.post}"`,
      },
      {
        type: 'code',
        title: 'Run migrations',
        language: 'bash',
        code: `python manage.py makemigrations blog
python manage.py migrate`,
      },
      { type: 'h2', text: 'Step 3: Create a comment form' },
      {
        type: 'code',
        title: 'Comment form',
        language: 'python',
        code: `# blog/forms.py
from django import forms

from .models import Comment


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ["name", "email", "body"]
        widgets = {
            "body": forms.Textarea(attrs={"rows": 4}),
        }`,
      },
      { type: 'h2', text: 'Step 4: Add views' },
      {
        type: 'code',
        title: 'List and detail views',
        language: 'python',
        code: `# blog/views.py
from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render

from .forms import CommentForm
from .models import Post


def post_list(request):
    posts = Post.objects.published()
    return render(request, "blog/post_list.html", {"posts": posts})


def post_detail(request, slug):
    post = get_object_or_404(Post.objects.published(), slug=slug)
    comments = post.comments.filter(is_approved=True)

    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.save()
            messages.success(request, "Comment submitted for moderation.")
            return redirect(post)
    else:
        form = CommentForm()

    return render(
        request,
        "blog/post_detail.html",
        {"post": post, "comments": comments, "form": form},
    )`,
      },
      { type: 'h2', text: 'Step 5: Wire URLs' },
      {
        type: 'code',
        title: 'Blog URLs',
        language: 'python',
        code: `# blog/urls.py
from django.urls import path

from . import views

app_name = "blog"

urlpatterns = [
    path("", views.post_list, name="post_list"),
    path("<slug:slug>/", views.post_detail, name="post_detail"),
]`,
      },
      {
        type: 'code',
        title: 'Project URLs',
        language: 'python',
        code: `# config/urls.py
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("blog/", include("blog.urls")),
]`,
      },
      { type: 'h2', text: 'Step 6: Add templates' },
      {
        type: 'code',
        title: 'Base template',
        language: 'html',
        code: `<!-- templates/base.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{% block title %}Django Blog{% endblock %}</title>
  </head>
  <body>
    {% if messages %}
      {% for message in messages %}
        <p>{{ message }}</p>
      {% endfor %}
    {% endif %}

    {% block content %}{% endblock %}
  </body>
</html>`,
      },
      {
        type: 'code',
        title: 'Post list template',
        language: 'html',
        code: `<!-- templates/blog/post_list.html -->
{% extends "base.html" %}

{% block title %}Blog{% endblock %}

{% block content %}
  <h1>Blog</h1>

  {% for post in posts %}
    <article>
      <h2><a href="{{ post.get_absolute_url }}">{{ post.title }}</a></h2>
      <p>{{ post.published_at|date:"M j, Y" }}</p>
      <p>{{ post.body|truncatewords:30 }}</p>
    </article>
  {% empty %}
    <p>No posts published yet.</p>
  {% endfor %}
{% endblock %}`,
      },
      {
        type: 'code',
        title: 'Post detail template',
        language: 'html',
        code: `<!-- templates/blog/post_detail.html -->
{% extends "base.html" %}

{% block title %}{{ post.title }}{% endblock %}

{% block content %}
  <article>
    <h1>{{ post.title }}</h1>
    <p>{{ post.published_at|date:"M j, Y" }}</p>
    <div>{{ post.body|linebreaks }}</div>
  </article>

  <section>
    <h2>Comments</h2>
    {% for comment in comments %}
      <article>
        <strong>{{ comment.name }}</strong>
        <p>{{ comment.body|linebreaks }}</p>
      </article>
    {% empty %}
      <p>No approved comments yet.</p>
    {% endfor %}
  </section>

  <section>
    <h2>Leave a comment</h2>
    <form method="post">
      {% csrf_token %}
      {{ form.as_p }}
      <button type="submit">Submit</button>
    </form>
  </section>
{% endblock %}`,
      },
      { type: 'h2', text: 'Step 7: Register admin tools' },
      {
        type: 'code',
        title: 'Admin configuration',
        language: 'python',
        code: `# blog/admin.py
from django.contrib import admin

from .models import Comment, Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "published_at", "updated_at")
    list_filter = ("status", "published_at")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "body")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("name", "post", "is_approved", "created_at")
    list_filter = ("is_approved", "created_at")
    search_fields = ("name", "email", "body")`,
      },
      { type: 'h2', text: 'Step 8: Add focused tests' },
      {
        type: 'code',
        title: 'Model and view tests',
        language: 'python',
        code: `# blog/tests/test_views.py
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from blog.models import Comment, Post


class BlogTests(TestCase):
    def create_post(self, **overrides):
        data = {
            "title": "First Post",
            "slug": "first-post",
            "body": "Hello from the blog.",
            "status": Post.Status.PUBLISHED,
            "published_at": timezone.now(),
        }
        data.update(overrides)
        return Post.objects.create(**data)

    def test_list_shows_published_post(self):
        self.create_post()

        response = self.client.get(reverse("blog:post_list"))

        self.assertContains(response, "First Post")

    def test_list_hides_draft_post(self):
        self.create_post(status=Post.Status.DRAFT, published_at=None)

        response = self.client.get(reverse("blog:post_list"))

        self.assertNotContains(response, "First Post")

    def test_comment_post_is_unapproved(self):
        post = self.create_post()

        response = self.client.post(post.get_absolute_url(), {
            "name": "Reader",
            "email": "reader@example.com",
            "body": "Great article.",
        })

        self.assertEqual(response.status_code, 302)
        comment = Comment.objects.get()
        self.assertEqual(comment.post, post)
        self.assertFalse(comment.is_approved)`,
      },
      {
        type: 'try',
        text: 'Extend the blog with author pages, tags, or a search form. Add tests before changing the query logic.',
      },
      {
        type: 'keypoints',
        items: [
          'A blog capstone combines models, querysets, forms, views, templates, admin, and tests.',
          'Draft and published states should be enforced in querysets, not only templates.',
          'Comments should be moderated before public display.',
          'Tests protect the most important publishing and commenting behavior.',
        ],
      },
    ],
  },
  {
    slug: 'django-project-store',
    title: 'Mini Project: Mini Store / Catalog',
    description:
      'Build a simple product catalog with categories, product detail pages, admin editing, query optimization, and a contact form.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 61,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project builds a small catalog, not a full payment store. You will model categories and products, show active products publicly, use slug URLs, optimize queries, and collect product inquiries.',
      },
      { type: 'h2', text: 'Project goals' },
      {
        type: 'ul',
        items: [
          'Category pages with active products.',
          'Product detail pages with price and description.',
          'Admin editing with filters and search.',
          'Inquiry form that records customer interest.',
          'Tests for visibility and inquiry creation.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create app and folders' },
      {
        type: 'code',
        title: 'Commands',
        language: 'bash',
        code: `python manage.py startapp catalog
mkdir -p templates/catalog
mkdir -p catalog/tests`,
      },
      {
        type: 'code',
        title: 'Target structure',
        language: 'text',
        code: `catalog/
  admin.py
  forms.py
  models.py
  urls.py
  views.py
  tests/
    __init__.py
    test_catalog.py
templates/
  catalog/
    category_list.html
    product_detail.html`,
      },
      { type: 'h2', text: 'Step 2: Create catalog models' },
      {
        type: 'code',
        title: 'Category, Product, and Inquiry',
        language: 'python',
        code: `# catalog/models.py
from django.db import models
from django.urls import reverse


class Category(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("catalog:category_detail", kwargs={"slug": self.slug})


class Product(models.Model):
    category = models.ForeignKey(Category, related_name="products", on_delete=models.PROTECT)
    name = models.CharField(max_length=160)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["is_active", "name"]),
        ]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("catalog:product_detail", kwargs={"slug": self.slug})


class ProductInquiry(models.Model):
    product = models.ForeignKey(Product, related_name="inquiries", on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]`,
      },
      {
        type: 'code',
        title: 'Migrate',
        language: 'bash',
        code: `python manage.py makemigrations catalog
python manage.py migrate`,
      },
      { type: 'h2', text: 'Step 3: Add the inquiry form' },
      {
        type: 'code',
        title: 'Inquiry form',
        language: 'python',
        code: `# catalog/forms.py
from django import forms

from .models import ProductInquiry


class ProductInquiryForm(forms.ModelForm):
    class Meta:
        model = ProductInquiry
        fields = ["name", "email", "message"]
        widgets = {
            "message": forms.Textarea(attrs={"rows": 4}),
        }`,
      },
      { type: 'h2', text: 'Step 4: Build optimized views' },
      {
        type: 'code',
        title: 'Catalog views',
        language: 'python',
        code: `# catalog/views.py
from django.contrib import messages
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404, redirect, render

from .forms import ProductInquiryForm
from .models import Category, Product


def category_list(request):
    categories = Category.objects.prefetch_related(
        Prefetch(
            "products",
            queryset=Product.objects.filter(is_active=True).order_by("name"),
        )
    )
    return render(request, "catalog/category_list.html", {"categories": categories})


def product_detail(request, slug):
    product = get_object_or_404(
        Product.objects.select_related("category"),
        slug=slug,
        is_active=True,
    )

    if request.method == "POST":
        form = ProductInquiryForm(request.POST)
        if form.is_valid():
            inquiry = form.save(commit=False)
            inquiry.product = product
            inquiry.save()
            messages.success(request, "Your inquiry was sent.")
            return redirect(product)
    else:
        form = ProductInquiryForm()

    return render(
        request,
        "catalog/product_detail.html",
        {"product": product, "form": form},
    )`,
      },
      { type: 'h2', text: 'Step 5: Add URLs' },
      {
        type: 'code',
        title: 'Catalog URL patterns',
        language: 'python',
        code: `# catalog/urls.py
from django.urls import path

from . import views

app_name = "catalog"

urlpatterns = [
    path("", views.category_list, name="category_list"),
    path("products/<slug:slug>/", views.product_detail, name="product_detail"),
]`,
      },
      {
        type: 'code',
        title: 'Project URL include',
        language: 'python',
        code: `# config/urls.py
from django.urls import include, path

urlpatterns = [
    path("catalog/", include("catalog.urls")),
]`,
      },
      { type: 'h2', text: 'Step 6: Write templates' },
      {
        type: 'code',
        title: 'Category list',
        language: 'html',
        code: `<!-- templates/catalog/category_list.html -->
{% extends "base.html" %}

{% block content %}
  <h1>Catalog</h1>

  {% for category in categories %}
    <section>
      <h2>{{ category.name }}</h2>
      <p>{{ category.description }}</p>

      <ul>
        {% for product in category.products.all %}
          <li>
            <a href="{{ product.get_absolute_url }}">{{ product.name }}</a>
            - {{ product.price }}
          </li>
        {% empty %}
          <li>No active products in this category.</li>
        {% endfor %}
      </ul>
    </section>
  {% endfor %}
{% endblock %}`,
      },
      {
        type: 'code',
        title: 'Product detail',
        language: 'html',
        code: `<!-- templates/catalog/product_detail.html -->
{% extends "base.html" %}

{% block content %}
  <p><a href="{% url 'catalog:category_list' %}">Back to catalog</a></p>

  <article>
    <p>{{ product.category.name }}</p>
    <h1>{{ product.name }}</h1>
    <p><strong>{{ product.price }}</strong></p>
    <div>{{ product.description|linebreaks }}</div>
  </article>

  <section>
    <h2>Ask about this product</h2>
    <form method="post">
      {% csrf_token %}
      {{ form.as_p }}
      <button type="submit">Send inquiry</button>
    </form>
  </section>
{% endblock %}`,
      },
      { type: 'h2', text: 'Step 7: Admin setup' },
      {
        type: 'code',
        title: 'Catalog admin',
        language: 'python',
        code: `# catalog/admin.py
from django.contrib import admin

from .models import Category, Product, ProductInquiry


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "is_active")
    list_filter = ("is_active", "category")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "description")


@admin.register(ProductInquiry)
class ProductInquiryAdmin(admin.ModelAdmin):
    list_display = ("product", "name", "email", "created_at")
    list_filter = ("created_at", "product")
    search_fields = ("name", "email", "message")`,
      },
      { type: 'h2', text: 'Step 8: Tests' },
      {
        type: 'code',
        title: 'Catalog behavior tests',
        language: 'python',
        code: `# catalog/tests/test_catalog.py
from django.test import TestCase
from django.urls import reverse

from catalog.models import Category, Product, ProductInquiry


class CatalogTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Books", slug="books")
        self.product = Product.objects.create(
            category=self.category,
            name="Django Field Guide",
            slug="django-field-guide",
            description="A practical book.",
            price="29.00",
        )

    def test_category_list_shows_active_product(self):
        response = self.client.get(reverse("catalog:category_list"))

        self.assertContains(response, "Django Field Guide")

    def test_inactive_product_detail_is_404(self):
        self.product.is_active = False
        self.product.save(update_fields=["is_active"])

        response = self.client.get(self.product.get_absolute_url())

        self.assertEqual(response.status_code, 404)

    def test_product_inquiry_is_created(self):
        response = self.client.post(self.product.get_absolute_url(), {
            "name": "Buyer",
            "email": "buyer@example.com",
            "message": "Is this available?",
        })

        self.assertEqual(response.status_code, 302)
        self.assertEqual(ProductInquiry.objects.count(), 1)`,
      },
      {
        type: 'try',
        text: 'Add product images and category detail pages. Remember that uploaded product images are media files, not collected static files.',
      },
      {
        type: 'keypoints',
        items: [
          'A catalog project practices relationships, slugs, forms, templates, admin, and tests.',
          'Use select_related and prefetch_related to avoid unnecessary queries.',
          'Public views should hide inactive products.',
          'Inquiry forms are a safe first step before building payments.',
        ],
      },
    ],
  },
  {
    slug: 'django-project-saas',
    title: 'Mini Project: SaaS Dashboard Shell',
    description:
      'Build an authenticated SaaS dashboard shell with organizations, membership, protected views, settings, and tests.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 62,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'A SaaS application usually starts with accounts, organizations, membership roles, protected dashboard pages, and settings screens. This project builds the shell without billing so the architecture is easy to follow.',
      },
      { type: 'h2', text: 'What the shell includes' },
      {
        type: 'ul',
        items: [
          'Organizations owned by users.',
          'Membership records with roles.',
          'Dashboard pages protected by login.',
          'A current organization selected from the URL.',
          'Tests for access and ownership.',
        ],
      },
      { type: 'h2', text: 'Step 1: Create app and structure' },
      {
        type: 'code',
        title: 'Commands',
        language: 'bash',
        code: `python manage.py startapp organizations
mkdir -p templates/organizations
mkdir -p organizations/tests`,
      },
      {
        type: 'code',
        title: 'Target structure',
        language: 'text',
        code: `organizations/
  admin.py
  decorators.py
  forms.py
  models.py
  urls.py
  views.py
  tests/
    __init__.py
    test_dashboard.py
templates/
  organizations/
    dashboard.html
    organization_settings.html
    organization_switcher.html`,
      },
      { type: 'h2', text: 'Step 2: Model organizations and memberships' },
      {
        type: 'code',
        title: 'Organization models',
        language: 'python',
        code: `# organizations/models.py
from django.conf import settings
from django.db import models
from django.urls import reverse


class Organization(models.Model):
    name = models.CharField(max_length=160)
    slug = models.SlugField(unique=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="owned_organizations",
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("organizations:dashboard", kwargs={"org_slug": self.slug})


class Membership(models.Model):
    class Role(models.TextChoices):
        OWNER = "owner", "Owner"
        ADMIN = "admin", "Admin"
        MEMBER = "member", "Member"

    organization = models.ForeignKey(
        Organization,
        related_name="memberships",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="memberships",
        on_delete=models.CASCADE,
    )
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.MEMBER)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "user"],
                name="unique_user_membership_per_organization",
            )
        ]

    def __str__(self):
        return f"{self.user} in {self.organization}"`,
      },
      {
        type: 'code',
        title: 'Migrate',
        language: 'bash',
        code: `python manage.py makemigrations organizations
python manage.py migrate`,
      },
      { type: 'h2', text: 'Step 3: Create an organization creation service' },
      {
        type: 'p',
        text: 'Creating an organization should also create the owner membership. A service function keeps that multi-step action in one transaction.',
      },
      {
        type: 'code',
        title: 'Organization service',
        language: 'python',
        code: `# organizations/services.py
from django.db import transaction
from django.utils.text import slugify

from .models import Membership, Organization


@transaction.atomic
def create_organization(*, owner, name):
    base_slug = slugify(name)
    slug = base_slug
    counter = 2

    while Organization.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1

    organization = Organization.objects.create(
        owner=owner,
        name=name,
        slug=slug,
    )
    Membership.objects.create(
        organization=organization,
        user=owner,
        role=Membership.Role.OWNER,
    )
    return organization`,
      },
      { type: 'h2', text: 'Step 4: Forms' },
      {
        type: 'code',
        title: 'Organization forms',
        language: 'python',
        code: `# organizations/forms.py
from django import forms

from .models import Organization


class OrganizationCreateForm(forms.Form):
    name = forms.CharField(max_length=160)


class OrganizationSettingsForm(forms.ModelForm):
    class Meta:
        model = Organization
        fields = ["name"]`,
      },
      { type: 'h2', text: 'Step 5: Membership helper' },
      {
        type: 'code',
        title: 'Load organization only when user is a member',
        language: 'python',
        code: `# organizations/decorators.py
from functools import wraps

from django.shortcuts import get_object_or_404

from .models import Organization


def organization_member_required(view_func):
    @wraps(view_func)
    def wrapper(request, org_slug, *args, **kwargs):
        organization = get_object_or_404(
            Organization.objects.filter(memberships__user=request.user).distinct(),
            slug=org_slug,
        )
        request.organization = organization
        return view_func(request, org_slug, *args, **kwargs)

    return wrapper`,
      },
      { type: 'h2', text: 'Step 6: Protected views' },
      {
        type: 'code',
        title: 'Dashboard and settings views',
        language: 'python',
        code: `# organizations/views.py
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

from .decorators import organization_member_required
from .forms import OrganizationCreateForm, OrganizationSettingsForm
from .models import Organization
from .services import create_organization


@login_required
def organization_create(request):
    if request.method == "POST":
        form = OrganizationCreateForm(request.POST)
        if form.is_valid():
            organization = create_organization(
                owner=request.user,
                name=form.cleaned_data["name"],
            )
            return redirect(organization)
    else:
        form = OrganizationCreateForm()

    return render(request, "organizations/organization_settings.html", {"form": form})


@login_required
@organization_member_required
def dashboard(request, org_slug):
    return render(
        request,
        "organizations/dashboard.html",
        {"organization": request.organization},
    )


@login_required
@organization_member_required
def organization_settings(request, org_slug):
    organization = request.organization

    if request.method == "POST":
        form = OrganizationSettingsForm(request.POST, instance=organization)
        if form.is_valid():
            form.save()
            messages.success(request, "Organization updated.")
            return redirect(organization)
    else:
        form = OrganizationSettingsForm(instance=organization)

    return render(
        request,
        "organizations/organization_settings.html",
        {"organization": organization, "form": form},
    )`,
      },
      { type: 'h2', text: 'Step 7: URLs' },
      {
        type: 'code',
        title: 'Organization URLs',
        language: 'python',
        code: `# organizations/urls.py
from django.urls import path

from . import views

app_name = "organizations"

urlpatterns = [
    path("new/", views.organization_create, name="organization_create"),
    path("<slug:org_slug>/", views.dashboard, name="dashboard"),
    path("<slug:org_slug>/settings/", views.organization_settings, name="settings"),
]`,
      },
      { type: 'h2', text: 'Step 8: Templates' },
      {
        type: 'code',
        title: 'Dashboard template',
        language: 'html',
        code: `<!-- templates/organizations/dashboard.html -->
{% extends "base.html" %}

{% block content %}
  <h1>{{ organization.name }} Dashboard</h1>

  <nav>
    <a href="{% url 'organizations:settings' organization.slug %}">Settings</a>
  </nav>

  <section>
    <h2>Overview</h2>
    <p>This is the starting point for SaaS metrics, activity, and team workflows.</p>
  </section>
{% endblock %}`,
      },
      {
        type: 'code',
        title: 'Create and settings template',
        language: 'html',
        code: `<!-- templates/organizations/organization_settings.html -->
{% extends "base.html" %}

{% block content %}
  <h1>{% if organization %}Organization Settings{% else %}Create Organization{% endif %}</h1>

  <form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Save</button>
  </form>
{% endblock %}`,
      },
      { type: 'h2', text: 'Step 9: Admin and tests' },
      {
        type: 'code',
        title: 'Admin',
        language: 'python',
        code: `# organizations/admin.py
from django.contrib import admin

from .models import Membership, Organization


class MembershipInline(admin.TabularInline):
    model = Membership
    extra = 0


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "created_at")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "owner__username")
    inlines = [MembershipInline]`,
      },
      {
        type: 'code',
        title: 'Access tests',
        language: 'python',
        code: `# organizations/tests/test_dashboard.py
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from organizations.models import Membership, Organization


class OrganizationDashboardTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user("owner", password="test-pass")
        self.other_user = User.objects.create_user("other", password="test-pass")
        self.organization = Organization.objects.create(
            name="Acme",
            slug="acme",
            owner=self.user,
        )
        Membership.objects.create(
            organization=self.organization,
            user=self.user,
            role=Membership.Role.OWNER,
        )

    def test_login_required(self):
        response = self.client.get(self.organization.get_absolute_url())

        self.assertEqual(response.status_code, 302)

    def test_member_can_view_dashboard(self):
        self.client.force_login(self.user)

        response = self.client.get(self.organization.get_absolute_url())

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Acme Dashboard")

    def test_non_member_gets_404(self):
        self.client.force_login(self.other_user)

        response = self.client.get(self.organization.get_absolute_url())

        self.assertEqual(response.status_code, 404)`,
      },
      {
        type: 'try',
        text: 'Add role-based settings access so only owners and admins can edit organization settings.',
      },
      {
        type: 'keypoints',
        items: [
          'SaaS shells usually start with organizations, memberships, roles, and protected routes.',
          'Create organization and owner membership in one transaction.',
          'Load organization from the URL and verify membership before rendering private data.',
          'Tests should cover anonymous users, members, and non-members.',
        ],
      },
    ],
  },
  {
    slug: 'django-common-mistakes',
    title: 'Common Django Mistakes (and Fixes)',
    description:
      'Recognize frequent Django mistakes in settings, queries, templates, forms, security, migrations, and project organization.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 63,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Many Django bugs are not mysterious. They come from repeated patterns: too much logic in templates, missing query optimization, unsafe settings, weak validation, and migrations created without review.',
      },
      { type: 'h2', text: 'Mistake 1: Leaving DEBUG on' },
      {
        type: 'p',
        text: 'DEBUG pages expose settings, environment details, SQL, and traceback information. Production must use `DEBUG=False` and real logging.',
      },
      {
        type: 'code',
        title: 'Production debug guard',
        language: 'python',
        code: `DEBUG = env.bool("DJANGO_DEBUG", default=False)
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS")`,
      },
      { type: 'h2', text: 'Mistake 2: N+1 queries' },
      {
        type: 'p',
        text: 'An N+1 query happens when a page loads a list, then runs another query for each item. Use `select_related` for foreign keys and one-to-one relationships. Use `prefetch_related` for many-to-many and reverse foreign keys.',
      },
      {
        type: 'code',
        title: 'Fixing repeated author queries',
        language: 'python',
        code: `# Before: each post.author may trigger another query.
posts = Post.objects.published()

# After: author joins happen in the main query.
posts = Post.objects.published().select_related("author")`,
      },
      { type: 'h2', text: 'Mistake 3: Business logic hidden in templates' },
      {
        type: 'code',
        title: 'Move display decisions into model methods or context',
        language: 'python',
        code: `# Better than complex template conditions repeated everywhere.
class Invoice(models.Model):
    due_at = models.DateField()
    paid_at = models.DateField(null=True, blank=True)

    @property
    def is_overdue(self):
        return self.paid_at is None and self.due_at < timezone.localdate()`,
      },
      { type: 'h2', text: 'Mistake 4: Trusting form input too late' },
      {
        type: 'p',
        text: 'Forms should validate and normalize input before the view performs business actions. Do not scatter validation across templates, views, and model saves without a clear contract.',
      },
      {
        type: 'code',
        title: 'Form-level validation',
        language: 'python',
        code: `class InviteForm(forms.Form):
    email = forms.EmailField()

    def clean_email(self):
        email = self.cleaned_data["email"].lower()
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This user already has an account.")
        return email`,
      },
      { type: 'h2', text: 'Mistake 5: Catching every exception' },
      {
        type: 'p',
        text: 'A broad `except Exception` can hide bugs and make operations look successful when they failed. Catch specific exceptions and log useful context.',
      },
      {
        type: 'code',
        title: 'Specific exception handling',
        language: 'python',
        code: `try:
    profile = Profile.objects.get(user=request.user)
except Profile.DoesNotExist:
    profile = Profile.objects.create(user=request.user)`,
      },
      { type: 'h2', text: 'Mistake 6: Careless migrations' },
      {
        type: 'ul',
        items: [
          'Committing migrations you did not inspect.',
          'Editing old migrations after they have been applied by teammates or production.',
          'Combining huge data backfills with schema changes.',
          'Adding non-null fields to large tables without a staged plan.',
        ],
      },
      {
        type: 'code',
        title: 'Migration review commands',
        language: 'bash',
        code: `python manage.py makemigrations --check --dry-run
python manage.py sqlmigrate orders 0004`,
      },
      { type: 'h2', text: 'Mistake 7: URL names are not used' },
      {
        type: 'p',
        text: 'Hardcoded URLs break during refactors. Use named URLs in views and templates.',
      },
      {
        type: 'code',
        title: 'Reverse URLs',
        language: 'python',
        code: `from django.shortcuts import redirect

return redirect("orders:detail", pk=order.pk)`,
      },
      {
        type: 'table',
        headers: ['Mistake', 'Symptom', 'Fix'],
        rows: [
          ['DEBUG in production', 'Sensitive error pages', 'Use strict production settings'],
          ['N+1 queries', 'Page slows as rows grow', 'select_related and prefetch_related'],
          ['Fat templates', 'Hard-to-test display rules', 'Move logic to models, forms, or views'],
          ['Broad exceptions', 'Hidden failures', 'Catch specific exceptions and log'],
          ['Unsafe migrations', 'Deploy risk', 'Review SQL and stage changes'],
        ],
      },
      {
        type: 'try',
        text: 'Open a Django view you wrote earlier and check it for three mistakes: hardcoded URLs, repeated queries, and validation outside the form.',
      },
      {
        type: 'keypoints',
        items: [
          'Most Django mistakes have recognizable patterns.',
          'Production settings must be intentionally strict.',
          'Query count matters as data grows.',
          'Forms, services, and model methods should keep behavior testable.',
        ],
      },
    ],
  },
  {
    slug: 'django-ecosystem',
    title: 'Django Ecosystem (DRF, Admin, Packages)',
    description:
      'Know the major tools around Django, when to reach for them, and how to evaluate packages responsibly.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 64,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Django is more than the core framework. Its ecosystem includes API frameworks, admin extensions, authentication packages, storage backends, debugging tools, deployment helpers, and CMS options.',
      },
      { type: 'h2', text: 'Django REST Framework' },
      {
        type: 'p',
        text: 'Django REST Framework, often called DRF, is the most common way to build JSON APIs with Django. It adds serializers, API views, viewsets, routers, permissions, throttling, pagination, and browsable API pages.',
      },
      {
        type: 'code',
        title: 'Small DRF-style example',
        language: 'python',
        code: `# api/serializers.py
from rest_framework import serializers

from blog.models import Post


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "title", "slug", "published_at"]


# api/views.py
from rest_framework import viewsets


class PostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Post.objects.published()
    serializer_class = PostSerializer`,
      },
      { type: 'h2', text: 'The Django admin' },
      {
        type: 'p',
        text: 'The admin is a productivity superpower for internal teams. It is best for trusted staff workflows, content moderation, back-office support, and data inspection. It is usually not a replacement for polished customer-facing product screens.',
      },
      {
        type: 'code',
        title: 'Useful admin customization',
        language: 'python',
        code: `@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "status", "total", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("customer__email", "id")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"`,
      },
      { type: 'h2', text: 'Common package categories' },
      {
        type: 'table',
        headers: ['Need', 'Common ecosystem choice', 'What it helps with'],
        rows: [
          ['APIs', 'Django REST Framework', 'Serializers, permissions, routers'],
          ['Filtering APIs', 'django-filter', 'Declarative filtering'],
          ['Authentication', 'django-allauth', 'Registration, social login, email flows'],
          ['Debugging', 'django-debug-toolbar', 'SQL and request inspection in development'],
          ['Static files', 'WhiteNoise', 'Serving collected static assets'],
          ['Storage', 'django-storages', 'S3 and cloud object storage backends'],
          ['Background jobs', 'Celery', 'Workers, queues, scheduled tasks'],
          ['CMS', 'Wagtail', 'Editorial content management on Django'],
        ],
      },
      { type: 'h2', text: 'How to evaluate a package' },
      {
        type: 'ol',
        items: [
          'Check compatibility with your Django and Python versions.',
          'Read the documentation for configuration and migration impact.',
          'Check recent releases and issue activity.',
          'Look for security history and maintenance signals.',
          'Add the smallest integration first and write a test around your usage.',
        ],
      },
      {
        type: 'warning',
        text: 'Do not install a package for every small problem. Dependencies add upgrade work, security surface, and operational assumptions.',
      },
      { type: 'h2', text: 'A practical package policy' },
      {
        type: 'code',
        title: 'Package decision checklist',
        language: 'text',
        code: `Use a package when:
  - It solves a real repeated problem.
  - It is maintained and compatible.
  - It reduces risk compared with custom code.
  - The team understands its configuration.

Avoid a package when:
  - The requirement is small and project-specific.
  - The package controls a critical path you cannot debug.
  - It is unmaintained or pins old Django versions.`,
      },
      {
        type: 'try',
        text: 'Pick one Django package you use or want to use. Check its supported Django versions, release history, and setup steps before installing it.',
      },
      {
        type: 'keypoints',
        items: [
          'DRF is the standard Django ecosystem tool for APIs.',
          'The admin is excellent for trusted internal workflows.',
          'Popular packages can save time, but each dependency has a cost.',
          'Evaluate compatibility, maintenance, and project fit before adopting a package.',
        ],
      },
    ],
  },
  {
    slug: 'django-next-steps',
    title: 'What to Learn After Django',
    description:
      'Choose a learning path after Django: APIs, databases, deployment, security, performance, frontend integration, and professional habits.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 65,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Finishing an advanced Django path does not mean you are done learning. It means you have enough foundation to choose a direction: APIs, product engineering, backend depth, DevOps, security, data, or full-stack development.',
      },
      { type: 'h2', text: 'Path 1: Build stronger APIs' },
      {
        type: 'ul',
        items: [
          'Learn Django REST Framework serializers, permissions, viewsets, and routers.',
          'Practice API pagination, filtering, throttling, and versioning.',
          'Write API tests for authentication, validation, and permission boundaries.',
          'Document APIs with OpenAPI.',
        ],
      },
      { type: 'h2', text: 'Path 2: Go deeper on databases' },
      {
        type: 'ul',
        items: [
          'Study indexes, query plans, transactions, locks, and isolation levels.',
          'Use `select_related`, `prefetch_related`, annotations, and aggregations fluently.',
          'Practice safe migration rollouts on large tables.',
          'Learn backup and restore operations for PostgreSQL.',
        ],
      },
      { type: 'h2', text: 'Path 3: Ship production systems' },
      {
        type: 'code',
        title: 'Production skills checklist',
        language: 'text',
        code: `Deployment:
  - Gunicorn or ASGI server
  - Static and media strategy
  - Environment variables
  - Database backups

Operations:
  - Structured logs
  - Error tracking
  - Health checks
  - Metrics and alerts

Reliability:
  - Tests in CI
  - Rollback plan
  - Safe migrations
  - Security updates`,
      },
      { type: 'h2', text: 'Path 4: Improve security skill' },
      {
        type: 'p',
        text: 'Learn the OWASP Top 10, browser security basics, password and session safety, dependency updates, permission design, audit logging, and incident response. Security becomes easier when it is part of normal engineering, not a final checklist.',
      },
      { type: 'h2', text: 'Path 5: Add frontend depth' },
      {
        type: 'p',
        text: 'Django works well with server-rendered templates, HTMX-style interactions, or a separate frontend application. Choose based on product needs, team skill, and complexity.',
      },
      {
        type: 'table',
        headers: ['Frontend approach', 'Good for', 'Watch for'],
        rows: [
          ['Django templates', 'Content sites, dashboards, admin-like products', 'Keep template logic simple'],
          ['Templates plus HTMX', 'Interactive pages without a full SPA', 'Clear partial rendering conventions'],
          ['Separate React or Next.js app', 'Large frontend teams or rich client apps', 'API design, auth, and deployment complexity'],
        ],
      },
      { type: 'h2', text: 'Path 6: Practice professional habits' },
      {
        type: 'ol',
        items: [
          'Write small pull requests with clear descriptions.',
          'Add tests for important behavior and every bug fix.',
          'Review migrations before deployment.',
          'Measure performance before guessing.',
          'Keep dependencies updated.',
          'Document decisions that future teammates will need.',
        ],
      },
      { type: 'h2', text: 'Suggested capstone challenge' },
      {
        type: 'p',
        text: 'Build one complete product: accounts, CRUD, permissions, background email, tests, deployment, and monitoring. The goal is not a huge feature list. The goal is to finish something production-shaped.',
      },
      {
        type: 'code',
        title: 'Capstone ideas',
        language: 'text',
        code: `1. Team notes app with organizations and roles.
2. Appointment booking system with email reminders.
3. Job board with paid listings and moderation.
4. Learning tracker with dashboards and exports.
5. Support ticket system with staff workflow.`,
      },
      {
        type: 'try',
        text: 'Choose one capstone idea and write a one-page technical plan: models, URLs, permissions, background tasks, tests, and deployment steps.',
      },
      {
        type: 'keypoints',
        items: [
          'After Django, choose a direction based on the products you want to build.',
          'APIs, databases, deployment, security, and frontend integration are natural next steps.',
          'Professional Django skill includes testing, migrations, monitoring, and maintenance.',
          'The best next project is a small, finished, production-shaped application.',
        ],
      },
    ],
  },
];
