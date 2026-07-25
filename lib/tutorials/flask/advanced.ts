import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'flask-security',
    title: 'Flask Security Essentials',
    description:
      'Protect a Flask application with safe configuration, password hashing, session settings, authorization checks, and production habits.',
    level: 'advanced',
    section: 'Quality & Safety',
    order: 49,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Advanced Flask security starts with a simple idea: Flask gives you flexible building blocks, and your application must combine them carefully. You are responsible for secrets, authentication, authorization, safe redirects, database access, and production settings.',
      },
      {
        type: 'p',
        text: 'Security is not one package or one setting. It is a set of habits that keep user data private, prevent privilege mistakes, and make dangerous behavior hard to write by accident.',
      },
      { type: 'h2', text: 'Start with secure configuration' },
      {
        type: 'code',
        title: 'Production-minded config defaults',
        language: 'python',
        code: `# app/config.py
import os


class BaseConfig:
    SECRET_KEY = os.environ["SECRET_KEY"]
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    REMEMBER_COOKIE_HTTPONLY = True
    JSON_SORT_KEYS = False


class ProductionConfig(BaseConfig):
    DEBUG = False
    TESTING = False
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    SESSION_COOKIE_SECURE = False`,
      },
      {
        type: 'warning',
        text: 'Do not keep a fallback SECRET_KEY in production code. A missing secret should crash the app during startup so the deployment can be fixed.',
      },
      { type: 'h2', text: 'Hash passwords correctly' },
      {
        type: 'p',
        text: 'Never store plain text passwords. Werkzeug includes secure password hashing helpers that are enough for many Flask apps. Store only the hash, then verify a login attempt against that hash.',
      },
      {
        type: 'code',
        title: 'Password helpers on a user model',
        language: 'python',
        code: `# app/models.py
from werkzeug.security import check_password_hash, generate_password_hash


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)`,
      },
      { type: 'h2', text: 'Authentication is not authorization' },
      {
        type: 'p',
        text: 'Authentication answers: who is this user? Authorization answers: may this user perform this action? A logged-in user should not automatically be allowed to edit every record.',
      },
      {
        type: 'code',
        title: 'A small ownership guard',
        language: 'python',
        code: `# app/security.py
from flask import abort
from flask_login import current_user


def require_owner(resource):
    if not current_user.is_authenticated:
        abort(401)

    if resource.user_id != current_user.id and not current_user.is_admin:
        abort(403)

    return resource`,
      },
      {
        type: 'code',
        title: 'Use the guard inside a view',
        language: 'python',
        code: `# app/posts/routes.py
@bp.get("/posts/<int:post_id>/edit")
def edit_post(post_id):
    post = db.get_or_404(Post, post_id)
    require_owner(post)
    return render_template("posts/edit.html", post=post)`,
      },
      { type: 'h2', text: 'Avoid unsafe redirects' },
      {
        type: 'p',
        text: 'A login page often redirects users back to the page they wanted. If you trust any next URL, attackers can send users through your site to a fake page. Only allow local redirects.',
      },
      {
        type: 'code',
        title: 'Safe next URL helper',
        language: 'python',
        code: `# app/security.py
from urllib.parse import urljoin, urlparse

from flask import request


def is_safe_url(target):
    host_url = urlparse(request.host_url)
    redirect_url = urlparse(urljoin(request.host_url, target))
    return redirect_url.scheme in ("http", "https") and host_url.netloc == redirect_url.netloc`,
      },
      {
        type: 'table',
        headers: ['Area', 'Good default', 'Why it matters'],
        rows: [
          ['Secrets', 'Read from environment', 'Keeps keys out of Git and images'],
          ['Passwords', 'Store salted hashes only', 'Limits damage after data exposure'],
          ['Sessions', 'HttpOnly, Secure in production', 'Reduces cookie theft risk'],
          ['Authorization', 'Check ownership per action', 'Prevents horizontal privilege bugs'],
          ['Redirects', 'Allow local targets only', 'Blocks open redirect attacks'],
        ],
      },
      {
        type: 'tip',
        text: 'Treat every view that changes or reveals private data as a permission boundary. Ask: who can call this, and what record are they allowed to touch?',
      },
      {
        type: 'try',
        text: 'Review one authenticated route in your app. Add an ownership check, a forbidden test, and a happy-path test.',
      },
      {
        type: 'keypoints',
        items: [
          'Flask security depends on your application choices, not only framework defaults.',
          'Use strong secret management and secure session cookie settings.',
          'Hash passwords with a trusted helper and never store plain text passwords.',
          'Check authorization separately from authentication.',
          'Validate redirect targets before sending users to them.',
        ],
      },
    ],
  },
  {
    slug: 'flask-csrf-xss',
    title: 'CSRF, XSS & Secure Headers',
    description:
      'Defend Flask forms and templates against CSRF, XSS, clickjacking, MIME sniffing, and common browser-side security mistakes.',
    level: 'advanced',
    section: 'Quality & Safety',
    order: 50,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Browser security bugs often appear when an app mixes user input, cookies, forms, and HTML. Flask and Jinja help, but you still need clear rules for CSRF protection, template output, and response headers.',
      },
      { type: 'h2', text: 'CSRF in one paragraph' },
      {
        type: 'p',
        text: 'Cross-Site Request Forgery happens when a malicious site causes a browser to submit a request to your app using the victim user cookies. Protect state-changing requests with CSRF tokens and SameSite cookies.',
      },
      {
        type: 'code',
        title: 'Enable Flask-WTF CSRF protection',
        language: 'python',
        code: `# app/__init__.py
from flask import Flask
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect()


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.ProductionConfig")
    csrf.init_app(app)
    return app`,
      },
      {
        type: 'code',
        title: 'Include the CSRF token in a form',
        language: 'html',
        code: `<!-- templates/account/email.html -->
<form method="post">
  {{ form.csrf_token }}

  <label for="email">Email</label>
  {{ form.email(id="email") }}

  <button type="submit">Save email</button>
</form>`,
      },
      {
        type: 'note',
        text: 'GET requests should be safe and read-only. If a route creates, updates, deletes, logs out, or sends an email, use POST, PUT, PATCH, or DELETE with CSRF protection.',
      },
      { type: 'h2', text: 'Protect JSON routes too' },
      {
        type: 'p',
        text: 'Cookie-authenticated JSON endpoints can also need CSRF protection. For browser fetch calls, send a CSRF token header and verify it on the server. Token setup varies by library, but the pattern is consistent.',
      },
      {
        type: 'code',
        title: 'Fetch with a CSRF header',
        language: 'html',
        code: `<script>
  async function saveProfile(displayName) {
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.querySelector("meta[name='csrf-token']").content,
      },
      body: JSON.stringify({ display_name: displayName }),
    });

    if (!response.ok) {
      throw new Error("Could not save profile");
    }
  }
</script>`,
      },
      { type: 'h2', text: 'XSS: let Jinja escape output' },
      {
        type: 'p',
        text: 'Cross-Site Scripting happens when attacker-controlled content becomes executable JavaScript in another user browser. Jinja autoescapes HTML templates, so the safest default is to print values normally.',
      },
      {
        type: 'code',
        title: 'Safe output and dangerous output',
        language: 'html',
        code: `<!-- Safe: Jinja escapes HTML characters -->
<p>{{ comment.body }}</p>

<!-- Dangerous: only use safe for trusted, sanitized HTML -->
<div>{{ marketing_html|safe }}</div>`,
      },
      {
        type: 'warning',
        text: 'The safe filter means "do not escape this". It does not sanitize attacker input. If users can write rich text, sanitize it with a trusted library before saving or rendering.',
      },
      { type: 'h2', text: 'Add secure response headers' },
      {
        type: 'code',
        title: 'Basic security headers after each request',
        language: 'python',
        code: `# app/security_headers.py
def register_security_headers(app):
    @app.after_request
    def add_security_headers(response):
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault(
            "Permissions-Policy",
            "camera=(), microphone=(), geolocation=()",
        )
        return response`,
      },
      {
        type: 'code',
        title: 'A starter Content Security Policy',
        language: 'python',
        code: `# app/security_headers.py
def csp_header():
    return "; ".join([
        "default-src 'self'",
        "base-uri 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
    ])`,
      },
      {
        type: 'table',
        headers: ['Header', 'Purpose'],
        rows: [
          ['Content-Security-Policy', 'Limits where scripts, styles, frames, and assets can load from'],
          ['X-Frame-Options', 'Protects older browsers from clickjacking'],
          ['X-Content-Type-Options', 'Stops MIME sniffing surprises'],
          ['Referrer-Policy', 'Controls how much URL data is sent to other sites'],
          ['Permissions-Policy', 'Disables browser features your app does not need'],
        ],
      },
      {
        type: 'try',
        text: 'Add security headers to a Flask app, then inspect a response in your browser network tab.',
      },
      {
        type: 'keypoints',
        items: [
          'CSRF tokens protect cookie-authenticated state changes.',
          'Jinja autoescaping is a major XSS defense; avoid bypassing it casually.',
          'Secure headers reduce the damage from browser-side mistakes.',
          'A strict Content Security Policy is easier when inline scripts are rare.',
        ],
      },
    ],
  },
  {
    slug: 'flask-architecture',
    title: 'Structuring Larger Flask Apps',
    description:
      'Organize a larger Flask codebase with an application factory, extensions module, feature packages, service functions, and clear boundaries.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 51,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'A small Flask app can live in one file. A growing Flask app needs structure so routes, models, forms, templates, background work, and integrations do not collapse into a single module.',
      },
      {
        type: 'p',
        text: 'Good architecture in Flask is not about making the app look like another framework. It is about keeping responsibilities clear while preserving Flask flexibility.',
      },
      { type: 'h2', text: 'Use an application factory' },
      {
        type: 'code',
        title: 'Factory with extension initialization',
        language: 'python',
        code: `# app/__init__.py
from flask import Flask

from app.extensions import db, login_manager, migrate
from app.posts.routes import bp as posts_bp


def create_app(config_object="app.config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    app.register_blueprint(posts_bp)

    return app`,
      },
      {
        type: 'code',
        title: 'Keep extension instances importable',
        language: 'python',
        code: `# app/extensions.py
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
login_manager.login_view = "auth.login"`,
      },
      { type: 'h2', text: 'A scalable file layout' },
      {
        type: 'code',
        title: 'Feature package structure',
        language: 'text',
        code: `your-project/
  app/
    __init__.py
    config.py
    extensions.py
    auth/
      __init__.py
      forms.py
      models.py
      routes.py
      services.py
    posts/
      __init__.py
      forms.py
      models.py
      routes.py
      services.py
      templates/
        posts/
          detail.html
    templates/
      base.html
  migrations/
  tests/
  pyproject.toml
  wsgi.py`,
      },
      {
        type: 'p',
        text: 'Feature packages work well when a feature has routes, forms, templates, and service logic that change together. Shared infrastructure stays near the application root.',
      },
      { type: 'h2', text: 'Move business actions out of routes' },
      {
        type: 'p',
        text: 'Routes should translate HTTP into application actions: read request data, call a service, choose a response. Complex rules are easier to test when they live in plain Python functions.',
      },
      {
        type: 'code',
        title: 'Thin route, testable service',
        language: 'python',
        code: `# app/posts/routes.py
@bp.post("/posts")
@login_required
def create_post():
    form = PostForm()
    if not form.validate_on_submit():
        return render_template("posts/new.html", form=form), 400

    post = create_post_for_user(current_user, form.data)
    flash("Post created.", "success")
    return redirect(url_for("posts.detail", slug=post.slug))


# app/posts/services.py
def create_post_for_user(user, data):
    post = Post(
        author=user,
        title=data["title"],
        slug=slugify(data["title"]),
        body=data["body"],
    )
    db.session.add(post)
    db.session.commit()
    return post`,
      },
      { type: 'h2', text: 'Avoid circular imports' },
      {
        type: 'ul',
        items: [
          'Create extensions in app/extensions.py without binding them to an app immediately.',
          'Import blueprints inside the factory or from feature route modules.',
          'Keep model imports one-directional when possible.',
          'Put shared helper code in small modules, not inside route files.',
        ],
      },
      {
        type: 'table',
        headers: ['Layer', 'Owns', 'Should avoid'],
        rows: [
          ['Routes', 'HTTP, redirects, templates, status codes', 'Long business workflows'],
          ['Services', 'Use cases and business rules', 'Request globals when not needed'],
          ['Models', 'Persistence and domain behavior', 'Rendering HTML'],
          ['Extensions', 'Shared Flask extension objects', 'Importing the app instance'],
        ],
      },
      {
        type: 'tip',
        text: 'If a function can accept normal arguments instead of reading request, current_user, or current_app directly, it will usually be easier to test.',
      },
      {
        type: 'keypoints',
        items: [
          'Application factories make configuration, tests, and deployments cleaner.',
          'An extensions module prevents early binding and reduces circular imports.',
          'Feature packages keep related code close together.',
          'Thin routes and service functions make larger Flask apps easier to maintain.',
        ],
      },
    ],
  },
  {
    slug: 'flask-blueprints-advanced',
    title: 'Blueprints at Scale',
    description:
      'Use Flask blueprints for large features, nested URL design, error handlers, template organization, and reusable registration patterns.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 52,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Blueprints let you divide a Flask application into modules. At scale, they become a design tool for ownership: each feature can define its routes, templates, static files, errors, and API surface.',
      },
      { type: 'h2', text: 'Blueprint basics, production style' },
      {
        type: 'code',
        title: 'Feature blueprint with prefix and template folder',
        language: 'python',
        code: `# app/admin/routes.py
from flask import Blueprint, render_template
from flask_login import login_required

bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/admin",
    template_folder="templates",
)


@bp.get("/")
@login_required
def dashboard():
    return render_template("admin/dashboard.html")`,
      },
      {
        type: 'code',
        title: 'Register blueprints in one place',
        language: 'python',
        code: `# app/blueprints.py
from app.admin.routes import bp as admin_bp
from app.api.routes import bp as api_bp
from app.posts.routes import bp as posts_bp


def register_blueprints(app):
    app.register_blueprint(posts_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(api_bp, url_prefix="/api/v1")`,
      },
      { type: 'h2', text: 'Endpoint names are namespaced' },
      {
        type: 'p',
        text: 'A view called dashboard inside the admin blueprint becomes the endpoint admin.dashboard. Use the full endpoint in url_for so links remain stable when URL prefixes change.',
      },
      {
        type: 'code',
        title: 'Blueprint-aware links',
        language: 'html',
        code: `<a href="{{ url_for('admin.dashboard') }}">Admin</a>
<a href="{{ url_for('posts.detail', slug=post.slug) }}">{{ post.title }}</a>`,
      },
      { type: 'h2', text: 'Blueprint-specific error handling' },
      {
        type: 'p',
        text: 'A blueprint can customize errors for its own routes. This is especially useful when HTML pages and JSON APIs live in the same Flask application.',
      },
      {
        type: 'code',
        title: 'JSON errors for an API blueprint',
        language: 'python',
        code: `# app/api/routes.py
from flask import Blueprint, jsonify

bp = Blueprint("api", __name__)


@bp.errorhandler(404)
def api_not_found(error):
    return jsonify(error="not_found", message="Resource not found"), 404


@bp.errorhandler(400)
def api_bad_request(error):
    return jsonify(error="bad_request", message=str(error)), 400`,
      },
      { type: 'h2', text: 'Use registration options for reuse' },
      {
        type: 'p',
        text: 'A blueprint can be registered with different prefixes or defaults. This is useful for versioned APIs, tenant-aware sections, or an internal/admin split that shares some code.',
      },
      {
        type: 'code',
        title: 'Versioned API registration',
        language: 'python',
        code: `# app/__init__.py
from app.api.routes import bp as api_bp


def create_app():
    app = Flask(__name__)
    app.register_blueprint(api_bp, url_prefix="/api/v1")
    return app`,
      },
      {
        type: 'table',
        headers: ['Blueprint concern', 'Recommendation'],
        rows: [
          ['Name', 'Use short stable names such as auth, posts, admin, api'],
          ['URL prefix', 'Apply it at registration or blueprint creation, not in every route'],
          ['Templates', 'Nest templates by feature to avoid name collisions'],
          ['Errors', 'Use API-specific handlers for JSON responses'],
          ['Imports', 'Import blueprints in the factory layer to reduce circular dependencies'],
        ],
      },
      {
        type: 'warning',
        text: 'Avoid one blueprint per tiny route. Blueprints work best when they represent a meaningful feature or interface boundary.',
      },
      {
        type: 'keypoints',
        items: [
          'Blueprints group routes and related behavior under a named namespace.',
          'Endpoint names include the blueprint name, such as admin.dashboard.',
          'Blueprint-specific error handlers help separate HTML and JSON behavior.',
          'A central registration function keeps application startup readable.',
        ],
      },
    ],
  },
  {
    slug: 'flask-config-environments',
    title: 'Environments & Secrets',
    description:
      'Manage development, testing, staging, and production configuration without leaking secrets or hard-coding deployment values.',
    level: 'advanced',
    section: 'Pro Architecture',
    order: 53,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Configuration decides how your Flask app connects to databases, signs sessions, sends email, logs errors, and behaves in production. Advanced teams make configuration explicit, validated, and environment-driven.',
      },
      { type: 'h2', text: 'Use config classes for defaults' },
      {
        type: 'code',
        title: 'Environment-specific config classes',
        language: 'python',
        code: `# app/config.py
import os


class Config:
    SECRET_KEY = os.environ["SECRET_KEY"]
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_TIME_LIMIT = 3600


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///dev.db",
    )


class TestingConfig(Config):
    TESTING = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ["DATABASE_URL"]`,
      },
      {
        type: 'code',
        title: 'Select config during app creation',
        language: 'python',
        code: `# app/__init__.py
def create_app(config_object=None):
    app = Flask(__name__)
    app.config.from_object(config_object or "app.config.DevelopmentConfig")
    return app`,
      },
      { type: 'h2', text: 'Keep secrets out of Git' },
      {
        type: 'code',
        title: 'Local .env example',
        language: 'text',
        code: `# .env
FLASK_APP=wsgi.py
FLASK_DEBUG=1
SECRET_KEY=dev-only-change-me
DATABASE_URL=sqlite:///dev.db`,
      },
      {
        type: 'warning',
        text: 'Do not commit real .env files. Commit .env.example with placeholder names so teammates know which variables are required.',
      },
      {
        type: 'code',
        title: 'Document required variables',
        language: 'text',
        code: `# .env.example
SECRET_KEY=
DATABASE_URL=
MAIL_SERVER=
MAIL_USERNAME=
MAIL_PASSWORD=`,
      },
      { type: 'h2', text: 'Validate critical settings early' },
      {
        type: 'p',
        text: 'Production should fail fast when a required setting is missing or obviously unsafe. A startup crash is better than serving traffic with a default password or temporary secret.',
      },
      {
        type: 'code',
        title: 'Simple config validation',
        language: 'python',
        code: `# app/config_checks.py
def validate_config(app):
    if not app.config.get("SECRET_KEY"):
        raise RuntimeError("SECRET_KEY is required")

    if app.config["SECRET_KEY"] == "dev-only-change-me" and not app.debug:
        raise RuntimeError("Production SECRET_KEY must be unique")

    if not app.config.get("SQLALCHEMY_DATABASE_URI"):
        raise RuntimeError("Database configuration is required")`,
      },
      {
        type: 'table',
        headers: ['Environment', 'Typical behavior'],
        rows: [
          ['Development', 'Debug on, local database, friendly errors'],
          ['Testing', 'Testing on, temporary database, CSRF often disabled'],
          ['Staging', 'Production-like settings with test credentials'],
          ['Production', 'Debug off, secure cookies, real services, strict secrets'],
        ],
      },
      {
        type: 'tip',
        text: 'For services such as Postgres, Redis, S3, and email, prefer one URL or clearly named environment variables. This makes deployment dashboards easier to audit.',
      },
      {
        type: 'keypoints',
        items: [
          'Use config classes to express environment differences clearly.',
          'Read secrets from environment variables or a secret manager.',
          'Commit examples and documentation, not real secret values.',
          'Validate production config at startup.',
        ],
      },
    ],
  },
  {
    slug: 'flask-deployment',
    title: 'Deploying Flask (Gunicorn & Beyond)',
    description:
      'Prepare Flask for deployment with a WSGI entrypoint, Gunicorn, environment variables, process management, logging, and health checks.',
    level: 'advanced',
    section: 'Shipping',
    order: 54,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'The Flask development server is excellent for local learning, but production needs a real WSGI server, environment-based configuration, stable logging, and a platform that can restart failed processes.',
      },
      { type: 'h2', text: 'Create a WSGI entrypoint' },
      {
        type: 'code',
        title: 'wsgi.py',
        language: 'python',
        code: `# wsgi.py
from app import create_app

app = create_app("app.config.ProductionConfig")`,
      },
      {
        type: 'p',
        text: 'Gunicorn imports this app object and runs multiple worker processes. Your application factory still owns setup; the entrypoint only selects the production app.',
      },
      {
        type: 'code',
        title: 'Install and run Gunicorn locally',
        language: 'bash',
        code: `python -m pip install gunicorn
gunicorn "wsgi:app" --bind "0.0.0.0:8000" --workers 3`,
      },
      { type: 'h2', text: 'Use a production command' },
      {
        type: 'code',
        title: 'Procfile-style process command',
        language: 'text',
        code: `web: gunicorn "wsgi:app" --workers 3 --threads 2 --timeout 60 --access-logfile - --error-logfile -`,
      },
      {
        type: 'table',
        headers: ['Setting', 'Starting point', 'Notes'],
        rows: [
          ['workers', '2-4 per small instance', 'More workers can improve concurrency but use more memory'],
          ['threads', '2-4 for I/O-heavy apps', 'Useful when requests wait on APIs or databases'],
          ['timeout', '30-60 seconds', 'Long requests should move to background jobs'],
          ['logs', 'stdout and stderr', 'Platforms and containers collect these streams'],
        ],
      },
      { type: 'h2', text: 'Add a health check' },
      {
        type: 'code',
        title: 'Simple health route',
        language: 'python',
        code: `# app/health.py
from flask import Blueprint, jsonify

bp = Blueprint("health", __name__)


@bp.get("/healthz")
def healthz():
    return jsonify(status="ok")`,
      },
      {
        type: 'p',
        text: 'A health route lets load balancers and deployment platforms know whether the process can serve basic requests. Keep it fast and dependency-light unless you intentionally need a deep check.',
      },
      { type: 'h2', text: 'Container deployment example' },
      {
        type: 'code',
        title: 'Minimal Dockerfile',
        language: 'text',
        code: `FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
ENV PYTHONUNBUFFERED=1
EXPOSE 8000

CMD ["gunicorn", "wsgi:app", "--bind", "0.0.0.0:8000", "--workers", "3"]`,
      },
      {
        type: 'warning',
        text: 'Never deploy with DEBUG=True. Debug pages can reveal environment variables, code paths, and sensitive request data.',
      },
      {
        type: 'keypoints',
        items: [
          'Production Flask apps run behind a WSGI server such as Gunicorn.',
          'A tiny wsgi.py file exposes the app object for the server.',
          'Use environment variables for secrets and production settings.',
          'Log to stdout/stderr so your platform can collect logs.',
          'Health checks make deploys and restarts safer.',
        ],
      },
    ],
  },
  {
    slug: 'flask-postgres',
    title: 'PostgreSQL with Flask',
    description:
      'Connect Flask to PostgreSQL with SQLAlchemy, environment database URLs, migrations, connection pooling, and production-safe query habits.',
    level: 'advanced',
    section: 'Shipping',
    order: 55,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'SQLite is great for local learning. PostgreSQL is a strong default for production Flask apps because it supports concurrency, constraints, indexing, JSON data, transactions, and reliable operations.',
      },
      { type: 'h2', text: 'Install the database packages' },
      {
        type: 'code',
        title: 'Common Flask Postgres dependencies',
        language: 'bash',
        code: `python -m pip install Flask-SQLAlchemy Flask-Migrate psycopg[binary]`,
      },
      {
        type: 'code',
        title: 'Configure SQLAlchemy with DATABASE_URL',
        language: 'python',
        code: `# app/config.py
import os


class ProductionConfig:
    SQLALCHEMY_DATABASE_URI = os.environ["DATABASE_URL"]
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_size": 5,
        "max_overflow": 10,
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False`,
      },
      {
        type: 'note',
        text: 'pool_pre_ping helps SQLAlchemy recover from stale database connections after a database restart or idle timeout.',
      },
      { type: 'h2', text: 'Use migrations for schema changes' },
      {
        type: 'code',
        title: 'Initialize and apply migrations',
        language: 'bash',
        code: `flask db init
flask db migrate -m "create posts table"
flask db upgrade`,
      },
      {
        type: 'code',
        title: 'A model with Postgres-friendly constraints',
        language: 'python',
        code: `# app/posts/models.py
from app.extensions import db


class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(220), nullable=False, unique=True, index=True)
    body = db.Column(db.Text, nullable=False)
    published = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())`,
      },
      { type: 'h2', text: 'Keep transactions explicit' },
      {
        type: 'code',
        title: 'Commit once per business action',
        language: 'python',
        code: `# app/posts/services.py
def publish_post(post, user):
    if post.author_id != user.id and not user.is_admin:
        raise PermissionError("You cannot publish this post")

    post.published = True
    post.published_at = db.func.now()
    db.session.commit()
    return post`,
      },
      {
        type: 'p',
        text: 'A route can catch expected errors and roll back the session. Unexpected errors should normally be logged and handled by the framework or an error boundary.',
      },
      {
        type: 'code',
        title: 'Rollback on expected failure',
        language: 'python',
        code: `try:
    publish_post(post, current_user)
except PermissionError:
    db.session.rollback()
    abort(403)`,
      },
      {
        type: 'table',
        headers: ['Concern', 'Production habit'],
        rows: [
          ['Schema changes', 'Use Flask-Migrate and review generated migrations'],
          ['Connections', 'Use pooling and pre-ping'],
          ['Indexes', 'Index columns used for lookup, joins, and sorting'],
          ['Transactions', 'Commit around complete business actions'],
          ['Backups', 'Verify restore steps, not only backup creation'],
        ],
      },
      {
        type: 'try',
        text: 'Add an index to a frequently filtered column, generate a migration, and inspect the migration file before applying it.',
      },
      {
        type: 'keypoints',
        items: [
          'PostgreSQL is a reliable default for deployed Flask apps.',
          'Store the database URL in the environment.',
          'Use migrations for every schema change.',
          'Indexes and constraints are part of application correctness.',
          'Commit transactions at clear business boundaries.',
        ],
      },
    ],
  },
  {
    slug: 'flask-static-prod',
    title: 'Static Assets in Production',
    description:
      'Serve CSS, JavaScript, images, and uploaded media efficiently with cache headers, hashed filenames, CDNs, and clean Flask template links.',
    level: 'advanced',
    section: 'Shipping',
    order: 56,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'In development, Flask can serve files from the static folder. In production, static assets should be cached aggressively and often served by a reverse proxy, object storage bucket, or CDN.',
      },
      { type: 'h2', text: 'Link static files through url_for' },
      {
        type: 'code',
        title: 'Template links to static assets',
        language: 'html',
        code: `<link rel="stylesheet" href="{{ url_for('static', filename='css/app.css') }}">
<script src="{{ url_for('static', filename='js/app.js') }}" defer></script>
<img src="{{ url_for('static', filename='images/logo.svg') }}" alt="Acme">`,
      },
      {
        type: 'p',
        text: 'Using url_for keeps paths correct when your app is mounted under a prefix or when static URL behavior changes.',
      },
      { type: 'h2', text: 'Separate build assets from user uploads' },
      {
        type: 'table',
        headers: ['File type', 'Examples', 'Recommended handling'],
        rows: [
          ['Static assets', 'CSS, JS, logos, icons', 'Version with the app and cache aggressively'],
          ['Media uploads', 'Avatars, attachments, user images', 'Store outside the app package, often in object storage'],
          ['Private files', 'Invoices, exports, reports', 'Serve through authenticated routes or signed URLs'],
        ],
      },
      { type: 'h2', text: 'Cache static files' },
      {
        type: 'code',
        title: 'Set a long static cache lifetime',
        language: 'python',
        code: `# app/config.py
class ProductionConfig:
    SEND_FILE_MAX_AGE_DEFAULT = 31536000`,
      },
      {
        type: 'warning',
        text: 'Long cache lifetimes require versioned or hashed filenames. If app.css is cached for a year, users may not see your next CSS change.',
      },
      {
        type: 'code',
        title: 'Example hashed asset manifest',
        language: 'json',
        code: `{
  "css/app.css": "css/app.4f6c2a9.css",
  "js/app.js": "js/app.9d16b10.js"
}`,
      },
      {
        type: 'code',
        title: 'Template helper for manifest-based assets',
        language: 'python',
        code: `# app/assets.py
import json
from pathlib import Path

from flask import current_app, url_for


def register_asset_helpers(app):
    @app.context_processor
    def asset_context():
        manifest_path = Path(app.static_folder) / "manifest.json"
        manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}

        def asset(filename):
            return url_for("static", filename=manifest.get(filename, filename))

        return {"asset": asset}`,
      },
      {
        type: 'code',
        title: 'Use the asset helper in a template',
        language: 'html',
        code: `<link rel="stylesheet" href="{{ asset('css/app.css') }}">
<script src="{{ asset('js/app.js') }}" defer></script>`,
      },
      {
        type: 'tip',
        text: 'If a platform provides a CDN or static file service, use it. Flask should spend its time on dynamic requests, not repeatedly sending the same CSS file.',
      },
      {
        type: 'keypoints',
        items: [
          'Use url_for or a helper for static asset links.',
          'Cache static assets with hashed filenames.',
          'Keep user uploads separate from versioned app assets.',
          'Let a CDN, reverse proxy, or platform serve static files in production when possible.',
        ],
      },
    ],
  },
  {
    slug: 'flask-caching',
    title: 'Caching Strategies',
    description:
      'Improve Flask response time with safe caching layers, cache keys, Redis-style stores, invalidation habits, and template fragment caching.',
    level: 'advanced',
    section: 'Performance',
    order: 57,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Caching stores work so your app does not repeat it on every request. The hard part is not adding a cache. The hard part is choosing what can safely be reused and when it must be refreshed.',
      },
      { type: 'h2', text: 'Cache at the right layer' },
      {
        type: 'table',
        headers: ['Layer', 'Example', 'Best for'],
        rows: [
          ['HTTP/CDN', 'Cache public pages for 60 seconds', 'Anonymous pages and assets'],
          ['View function', 'Cache rendered category pages', 'Expensive read-only endpoints'],
          ['Data function', 'Cache query results or API calls', 'Shared data used by multiple views'],
          ['Template fragment', 'Cache sidebar or navigation', 'Repeated expensive page sections'],
        ],
      },
      {
        type: 'code',
        title: 'Flask-Caching setup',
        language: 'python',
        code: `# app/extensions.py
from flask_caching import Cache

cache = Cache()


# app/__init__.py
from app.extensions import cache


def create_app():
    app = Flask(__name__)
    app.config["CACHE_TYPE"] = "RedisCache"
    app.config["CACHE_REDIS_URL"] = app.config["REDIS_URL"]
    cache.init_app(app)
    return app`,
      },
      { type: 'h2', text: 'Cache a public view' },
      {
        type: 'code',
        title: 'Time-limited page cache',
        language: 'python',
        code: `# app/posts/routes.py
@bp.get("/popular")
@cache.cached(timeout=60)
def popular_posts():
    posts = Post.query.filter_by(published=True).order_by(Post.views.desc()).limit(20)
    return render_template("posts/popular.html", posts=posts)`,
      },
      {
        type: 'warning',
        text: 'Do not cache personalized pages with a shared key. If a page contains the current user name, account data, cart, or private messages, the cache key must include the user or the page should not be shared-cached.',
      },
      { type: 'h2', text: 'Cache data with clear keys' },
      {
        type: 'code',
        title: 'Manual cache get/set',
        language: 'python',
        code: `# app/posts/services.py
def get_tag_summary(tag_slug):
    cache_key = f"tag-summary:{tag_slug}"
    summary = cache.get(cache_key)
    if summary is not None:
        return summary

    summary = build_tag_summary(tag_slug)
    cache.set(cache_key, summary, timeout=300)
    return summary`,
      },
      { type: 'h2', text: 'Invalidate when writes happen' },
      {
        type: 'code',
        title: 'Delete affected keys after an update',
        language: 'python',
        code: `def publish_post(post):
    post.published = True
    db.session.commit()

    cache.delete("homepage")
    cache.delete(f"tag-summary:{post.primary_tag_slug}")`,
      },
      {
        type: 'p',
        text: 'Invalidation does not have to be perfect at first. Short timeouts plus deleting the most important keys often provide a good balance for content-heavy Flask apps.',
      },
      {
        type: 'tip',
        text: 'Use cache keys that include the data identity and version, such as post:42:v3. Versioned keys can be easier than trying to delete every old key.',
      },
      {
        type: 'keypoints',
        items: [
          'Cache only data that is safe to reuse.',
          'Choose cache keys deliberately, especially for user-specific content.',
          'Use short timeouts while learning a page behavior.',
          'Invalidate important cached data when writes happen.',
        ],
      },
    ],
  },
  {
    slug: 'flask-background-tasks',
    title: 'Background Tasks (Celery-style Intro)',
    description:
      'Understand when Flask work should move out of the request cycle and how Celery-style workers, queues, retries, and task status fit together.',
    level: 'advanced',
    section: 'Performance',
    order: 58,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'A web request should usually finish quickly. If a route sends email, generates a PDF, processes an image, calls a slow API, or imports a large file, users wait and failures become harder to recover from.',
      },
      {
        type: 'p',
        text: 'Background task systems move slow work to a worker process. Flask accepts the request, queues a job, returns a response, and the worker performs the job separately.',
      },
      { type: 'h2', text: 'The moving parts' },
      {
        type: 'ul',
        items: [
          'Flask web process: receives requests and enqueues work.',
          'Broker: holds queued jobs, commonly Redis or RabbitMQ.',
          'Worker: runs tasks outside the request cycle.',
          'Result store: optionally records task status and results.',
          'Scheduler: optionally runs tasks on a clock, such as nightly cleanup.',
        ],
      },
      { type: 'h2', text: 'A Celery-style setup' },
      {
        type: 'code',
        title: 'Celery app connected to Flask config',
        language: 'python',
        code: `# app/tasks.py
from celery import Celery


def make_celery(app):
    celery = Celery(
        app.import_name,
        broker=app.config["CELERY_BROKER_URL"],
        backend=app.config["CELERY_RESULT_BACKEND"],
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery`,
      },
      {
        type: 'code',
        title: 'Define a task',
        language: 'python',
        code: `# app/email_tasks.py
from app.mail import send_welcome_email


def register_email_tasks(celery):
    @celery.task(bind=True, max_retries=3)
    def send_welcome_email_task(self, user_id):
        try:
            send_welcome_email(user_id)
        except Exception as exc:
            raise self.retry(exc=exc, countdown=30)

    return send_welcome_email_task`,
      },
      {
        type: 'code',
        title: 'Queue work from a route',
        language: 'python',
        code: `# app/auth/routes.py
@bp.post("/register")
def register():
    user = create_user(request.form)
    send_welcome_email_task.delay(user.id)
    flash("Account created. Check your email.", "success")
    return redirect(url_for("auth.login"))`,
      },
      { type: 'h2', text: 'Run web and worker processes' },
      {
        type: 'code',
        title: 'Local process commands',
        language: 'bash',
        code: `redis-server
flask --app wsgi run
celery -A wsgi.celery worker --loglevel=info`,
      },
      {
        type: 'warning',
        text: 'Do not pass large objects, request objects, database sessions, or files directly into queued tasks. Pass small identifiers such as user_id or report_id, then load fresh data inside the task.',
      },
      { type: 'h2', text: 'Design tasks to be retry-safe' },
      {
        type: 'p',
        text: 'Workers may retry jobs after timeouts or crashes. A good task can run more than once without sending duplicate invoices, charging twice, or corrupting data. This is called idempotency.',
      },
      {
        type: 'table',
        headers: ['Task', 'Retry-safe habit'],
        rows: [
          ['Email', 'Record sent_at and check before sending again'],
          ['Payment', 'Use provider idempotency keys'],
          ['Import', 'Store progress and skip rows already imported'],
          ['Report', 'Write to a temporary file, then mark complete'],
        ],
      },
      {
        type: 'keypoints',
        items: [
          'Move slow or unreliable work out of request handlers.',
          'A queue needs a broker and at least one worker process.',
          'Pass identifiers to tasks, not request-specific objects.',
          'Retries are useful only when tasks are designed to be safe to repeat.',
        ],
      },
    ],
  },
  {
    slug: 'flask-performance',
    title: 'Performance Mindset',
    description:
      'Find Flask performance problems with measurement, query tuning, pagination, response size reduction, and request lifecycle awareness.',
    level: 'advanced',
    section: 'Performance',
    order: 59,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Performance work should begin with measurement, not guesses. A slow Flask app might be waiting on the database, rendering a huge template, calling an external API, sending too much JSON, or running with too few workers.',
      },
      { type: 'h2', text: 'Measure each request' },
      {
        type: 'code',
        title: 'Simple request timing logs',
        language: 'python',
        code: `# app/performance.py
import time

from flask import g, request


def register_request_timing(app):
    @app.before_request
    def start_timer():
        g.request_started_at = time.perf_counter()

    @app.after_request
    def log_request_time(response):
        elapsed_ms = (time.perf_counter() - g.request_started_at) * 1000
        app.logger.info(
            "request path=%s method=%s status=%s duration_ms=%.2f",
            request.path,
            request.method,
            response.status_code,
            elapsed_ms,
        )
        return response`,
      },
      { type: 'h2', text: 'Avoid N+1 query patterns' },
      {
        type: 'p',
        text: 'An N+1 problem happens when one query loads a list and then one extra query runs for each item. It is common in templates that access relationships lazily.',
      },
      {
        type: 'code',
        title: 'Eager load relationships used by the page',
        language: 'python',
        code: `# app/posts/routes.py
from sqlalchemy.orm import selectinload


@bp.get("/")
def index():
    posts = (
        Post.query.options(selectinload(Post.author), selectinload(Post.tags))
        .filter_by(published=True)
        .order_by(Post.created_at.desc())
        .limit(20)
        .all()
    )
    return render_template("posts/index.html", posts=posts)`,
      },
      { type: 'h2', text: 'Paginate large lists' },
      {
        type: 'code',
        title: 'Pagination with SQLAlchemy',
        language: 'python',
        code: `@bp.get("/archive")
def archive():
    page = request.args.get("page", 1, type=int)
    pagination = (
        Post.query.filter_by(published=True)
        .order_by(Post.created_at.desc())
        .paginate(page=page, per_page=25, error_out=False)
    )
    return render_template("posts/archive.html", pagination=pagination)`,
      },
      { type: 'h2', text: 'Reduce response size' },
      {
        type: 'ul',
        items: [
          'Return only fields the client needs in JSON APIs.',
          'Compress responses at the reverse proxy or platform layer.',
          'Use thumbnails instead of full-size images in list pages.',
          'Split very large pages into paginated or lazy-loaded sections.',
        ],
      },
      {
        type: 'table',
        headers: ['Symptom', 'Likely place to look'],
        rows: [
          ['High database time', 'Indexes, query count, eager loading, slow filters'],
          ['High CPU time', 'Template loops, serialization, image processing'],
          ['High external wait', 'Third-party APIs, timeouts, background tasks'],
          ['High transfer time', 'Large HTML, JSON, images, missing compression'],
        ],
      },
      {
        type: 'tip',
        text: 'Use production-like data when testing performance. A page that is fast with 10 rows can be painfully slow with 100,000 rows.',
      },
      {
        type: 'keypoints',
        items: [
          'Measure request time before optimizing.',
          'Database query count often matters more than Flask code speed.',
          'Use eager loading and pagination for list pages.',
          'Move slow work to background tasks and cache safe repeated work.',
        ],
      },
    ],
  },
  {
    slug: 'flask-project-blog',
    title: 'Mini Project: Blog App',
    description:
      'Build a small but production-shaped Flask blog with an app factory, blueprints, SQLAlchemy models, templates, forms, and publishing flow.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 60,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This capstone combines architecture, templates, forms, and database work into a followable blog application. The goal is not to build every feature, but to create a clean base you can extend.',
      },
      { type: 'h2', text: 'Step 1: Create the file structure' },
      {
        type: 'code',
        title: 'Blog project tree',
        language: 'text',
        code: `flask-blog/
  app/
    __init__.py
    config.py
    extensions.py
    posts/
      __init__.py
      forms.py
      models.py
      routes.py
      templates/
        posts/
          index.html
          detail.html
          new.html
    templates/
      base.html
  migrations/
  tests/
  wsgi.py
  pyproject.toml`,
      },
      {
        type: 'code',
        title: 'Install dependencies',
        language: 'bash',
        code: `python -m venv .venv
source .venv/bin/activate
python -m pip install Flask Flask-SQLAlchemy Flask-Migrate Flask-WTF python-slugify`,
      },
      { type: 'h2', text: 'Step 2: Configure the app factory' },
      {
        type: 'code',
        title: 'app/extensions.py',
        language: 'python',
        code: `from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()`,
      },
      {
        type: 'code',
        title: 'app/__init__.py',
        language: 'python',
        code: `from flask import Flask

from app.extensions import db, migrate
from app.posts.routes import bp as posts_bp


def create_app(config_object="app.config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(posts_bp)
    return app`,
      },
      {
        type: 'code',
        title: 'app/config.py and wsgi.py',
        language: 'python',
        code: `# app/config.py
class DevelopmentConfig:
    SECRET_KEY = "dev-blog-secret"
    SQLALCHEMY_DATABASE_URI = "sqlite:///blog.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False


# wsgi.py
from app import create_app

app = create_app()`,
      },
      { type: 'h2', text: 'Step 3: Add the post model and form' },
      {
        type: 'code',
        title: 'app/posts/models.py',
        language: 'python',
        code: `from app.extensions import db


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(220), unique=True, nullable=False, index=True)
    summary = db.Column(db.String(300), nullable=False)
    body = db.Column(db.Text, nullable=False)
    published = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())`,
      },
      {
        type: 'code',
        title: 'app/posts/forms.py',
        language: 'python',
        code: `from flask_wtf import FlaskForm
from wtforms import BooleanField, StringField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, Length


class PostForm(FlaskForm):
    title = StringField("Title", validators=[DataRequired(), Length(max=200)])
    summary = StringField("Summary", validators=[DataRequired(), Length(max=300)])
    body = TextAreaField("Body", validators=[DataRequired()])
    published = BooleanField("Publish now")
    submit = SubmitField("Save post")`,
      },
      { type: 'h2', text: 'Step 4: Build the routes' },
      {
        type: 'code',
        title: 'app/posts/routes.py',
        language: 'python',
        code: `from flask import Blueprint, flash, redirect, render_template, url_for
from slugify import slugify

from app.extensions import db
from app.posts.forms import PostForm
from app.posts.models import Post

bp = Blueprint("posts", __name__, template_folder="templates")


@bp.get("/")
def index():
    posts = Post.query.filter_by(published=True).order_by(Post.created_at.desc()).all()
    return render_template("posts/index.html", posts=posts)


@bp.route("/posts/new", methods=["GET", "POST"])
def new():
    form = PostForm()
    if form.validate_on_submit():
        post = Post(
            title=form.title.data,
            slug=slugify(form.title.data),
            summary=form.summary.data,
            body=form.body.data,
            published=form.published.data,
        )
        db.session.add(post)
        db.session.commit()
        flash("Post saved.", "success")
        return redirect(url_for("posts.detail", slug=post.slug))

    return render_template("posts/new.html", form=form)


@bp.get("/posts/<slug>")
def detail(slug):
    post = Post.query.filter_by(slug=slug, published=True).first_or_404()
    return render_template("posts/detail.html", post=post)`,
      },
      { type: 'h2', text: 'Step 5: Create the templates' },
      {
        type: 'code',
        title: 'app/templates/base.html',
        language: 'html',
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{% block title %}Flask Blog{% endblock %}</title>
  </head>
  <body>
    <nav>
      <a href="{{ url_for('posts.index') }}">Blog</a>
      <a href="{{ url_for('posts.new') }}">New post</a>
    </nav>

    {% for category, message in get_flashed_messages(with_categories=true) %}
      <p class="flash flash-{{ category }}">{{ message }}</p>
    {% endfor %}

    {% block content %}{% endblock %}
  </body>
</html>`,
      },
      {
        type: 'code',
        title: 'List and detail templates',
        language: 'html',
        code: `<!-- app/posts/templates/posts/index.html -->
{% extends "base.html" %}
{% block title %}Blog{% endblock %}
{% block content %}
  <h1>Latest posts</h1>
  {% for post in posts %}
    <article>
      <h2><a href="{{ url_for('posts.detail', slug=post.slug) }}">{{ post.title }}</a></h2>
      <p>{{ post.summary }}</p>
    </article>
  {% else %}
    <p>No published posts yet.</p>
  {% endfor %}
{% endblock %}

<!-- app/posts/templates/posts/detail.html -->
{% extends "base.html" %}
{% block title %}{{ post.title }}{% endblock %}
{% block content %}
  <article>
    <h1>{{ post.title }}</h1>
    <p>{{ post.summary }}</p>
    <div>{{ post.body }}</div>
  </article>
{% endblock %}`,
      },
      {
        type: 'code',
        title: 'New post template',
        language: 'html',
        code: `<!-- app/posts/templates/posts/new.html -->
{% extends "base.html" %}
{% block title %}New post{% endblock %}
{% block content %}
  <h1>New post</h1>
  <form method="post">
    {{ form.csrf_token }}
    <p>{{ form.title.label }} {{ form.title() }}</p>
    <p>{{ form.summary.label }} {{ form.summary() }}</p>
    <p>{{ form.body.label }} {{ form.body(rows=10) }}</p>
    <p>{{ form.published() }} {{ form.published.label }}</p>
    {{ form.submit() }}
  </form>
{% endblock %}`,
      },
      { type: 'h2', text: 'Step 6: Create the database and run' },
      {
        type: 'code',
        title: 'Migration and local server commands',
        language: 'bash',
        code: `export FLASK_APP=wsgi.py
flask db init
flask db migrate -m "create posts"
flask db upgrade
flask run`,
      },
      {
        type: 'try',
        text: 'Extend the project by adding draft preview links and an edit route. Keep the edit route thin by moving slug generation into a service function.',
      },
      {
        type: 'keypoints',
        items: [
          'A capstone blog can still use a production-shaped app factory.',
          'Blueprint templates stay organized under the feature package.',
          'Forms, models, routes, and templates work together as one feature.',
          'Migrations make the project safe to evolve.',
        ],
      },
    ],
  },
  {
    slug: 'flask-project-api',
    title: 'Mini Project: JSON API',
    description:
      'Build a small Flask JSON API with versioned blueprints, request validation, SQLAlchemy persistence, JSON errors, and curl-based testing.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 61,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This project builds a compact task API. It focuses on patterns you can reuse: versioned routes, JSON-only responses, validation, database models, and consistent error messages.',
      },
      { type: 'h2', text: 'Step 1: Create the API structure' },
      {
        type: 'code',
        title: 'JSON API file tree',
        language: 'text',
        code: `flask-task-api/
  app/
    __init__.py
    config.py
    extensions.py
    api/
      __init__.py
      errors.py
      routes.py
      schemas.py
    tasks/
      __init__.py
      models.py
      services.py
  migrations/
  tests/
  wsgi.py
  pyproject.toml`,
      },
      {
        type: 'code',
        title: 'Install dependencies',
        language: 'bash',
        code: `python -m venv .venv
source .venv/bin/activate
python -m pip install Flask Flask-SQLAlchemy Flask-Migrate marshmallow`,
      },
      { type: 'h2', text: 'Step 2: Configure Flask and register the API' },
      {
        type: 'code',
        title: 'Factory and extensions',
        language: 'python',
        code: `# app/extensions.py
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()


# app/__init__.py
from flask import Flask

from app.api.routes import bp as api_bp
from app.extensions import db, migrate


def create_app(config_object="app.config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_object)
    db.init_app(app)
    migrate.init_app(app, db)
    app.register_blueprint(api_bp, url_prefix="/api/v1")
    return app`,
      },
      {
        type: 'code',
        title: 'Configuration and entrypoint',
        language: 'python',
        code: `# app/config.py
class DevelopmentConfig:
    SECRET_KEY = "dev-api-secret"
    SQLALCHEMY_DATABASE_URI = "sqlite:///tasks.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False


# wsgi.py
from app import create_app

app = create_app()`,
      },
      { type: 'h2', text: 'Step 3: Add a task model' },
      {
        type: 'code',
        title: 'app/tasks/models.py',
        language: 'python',
        code: `from app.extensions import db


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())`,
      },
      { type: 'h2', text: 'Step 4: Validate JSON input' },
      {
        type: 'code',
        title: 'app/api/schemas.py',
        language: 'python',
        code: `from marshmallow import Schema, fields, validate


class TaskCreateSchema(Schema):
    title = fields.String(required=True, validate=validate.Length(min=1, max=160))


class TaskUpdateSchema(Schema):
    title = fields.String(validate=validate.Length(min=1, max=160))
    completed = fields.Boolean()`,
      },
      {
        type: 'code',
        title: 'app/tasks/services.py',
        language: 'python',
        code: `from app.extensions import db
from app.tasks.models import Task


def task_to_dict(task):
    return {
        "id": task.id,
        "title": task.title,
        "completed": task.completed,
        "created_at": task.created_at.isoformat() if task.created_at else None,
    }


def create_task(data):
    task = Task(title=data["title"])
    db.session.add(task)
    db.session.commit()
    return task`,
      },
      { type: 'h2', text: 'Step 5: Build JSON routes and errors' },
      {
        type: 'code',
        title: 'app/api/errors.py',
        language: 'python',
        code: `from flask import jsonify
from marshmallow import ValidationError


def register_api_errors(bp):
    @bp.errorhandler(ValidationError)
    def validation_error(error):
        return jsonify(error="validation_error", messages=error.messages), 400

    @bp.errorhandler(404)
    def not_found(error):
        return jsonify(error="not_found", message="Resource not found"), 404`,
      },
      {
        type: 'code',
        title: 'app/api/routes.py',
        language: 'python',
        code: `from flask import Blueprint, jsonify, request

from app.api.errors import register_api_errors
from app.api.schemas import TaskCreateSchema, TaskUpdateSchema
from app.extensions import db
from app.tasks.models import Task
from app.tasks.services import create_task, task_to_dict

bp = Blueprint("api", __name__)
register_api_errors(bp)


@bp.get("/tasks")
def list_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify(tasks=[task_to_dict(task) for task in tasks])


@bp.post("/tasks")
def create_task_route():
    data = TaskCreateSchema().load(request.get_json() or {})
    task = create_task(data)
    return jsonify(task=task_to_dict(task)), 201


@bp.patch("/tasks/<int:task_id>")
def update_task(task_id):
    task = db.get_or_404(Task, task_id)
    data = TaskUpdateSchema().load(request.get_json() or {})

    if "title" in data:
        task.title = data["title"]
    if "completed" in data:
        task.completed = data["completed"]

    db.session.commit()
    return jsonify(task=task_to_dict(task))


@bp.delete("/tasks/<int:task_id>")
def delete_task(task_id):
    task = db.get_or_404(Task, task_id)
    db.session.delete(task)
    db.session.commit()
    return "", 204`,
      },
      { type: 'h2', text: 'Step 6: Migrate and test with curl' },
      {
        type: 'code',
        title: 'Create the database',
        language: 'bash',
        code: `export FLASK_APP=wsgi.py
flask db init
flask db migrate -m "create tasks"
flask db upgrade
flask run`,
      },
      {
        type: 'code',
        title: 'Try the API',
        language: 'bash',
        code: `curl http://127.0.0.1:5000/api/v1/tasks

curl -X POST http://127.0.0.1:5000/api/v1/tasks \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Write API tutorial"}'

curl -X PATCH http://127.0.0.1:5000/api/v1/tasks/1 \\
  -H "Content-Type: application/json" \\
  -d '{"completed":true}'`,
      },
      {
        type: 'tip',
        text: 'For a real API, add authentication, pagination, rate limiting, and tests for validation errors before shipping.',
      },
      {
        type: 'keypoints',
        items: [
          'A versioned API blueprint keeps JSON routes organized.',
          'Validate request bodies before touching the database.',
          'Return consistent error shapes for API clients.',
          'Use curl or HTTP clients to test the contract from the outside.',
        ],
      },
    ],
  },
  {
    slug: 'flask-project-saas',
    title: 'Mini Project: SaaS Dashboard Shell',
    description:
      'Build a SaaS-style Flask dashboard shell with application layout, login-protected pages, organizations, settings, and extension points.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 62,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'A SaaS dashboard is less about one clever route and more about a repeatable product shell: authentication, navigation, account context, settings, billing placeholders, and clear feature boundaries.',
      },
      { type: 'h2', text: 'Step 1: Plan the structure' },
      {
        type: 'code',
        title: 'SaaS shell file tree',
        language: 'text',
        code: `flask-saas-shell/
  app/
    __init__.py
    config.py
    extensions.py
    auth/
      forms.py
      models.py
      routes.py
    dashboard/
      routes.py
      templates/
        dashboard/
          overview.html
          settings.html
    templates/
      base.html
      app_base.html
  migrations/
  wsgi.py
  pyproject.toml`,
      },
      {
        type: 'code',
        title: 'Install dependencies',
        language: 'bash',
        code: `python -m venv .venv
source .venv/bin/activate
python -m pip install Flask Flask-Login Flask-SQLAlchemy Flask-Migrate Flask-WTF`,
      },
      { type: 'h2', text: 'Step 2: Create extensions and the factory' },
      {
        type: 'code',
        title: 'app/extensions.py',
        language: 'python',
        code: `from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()

login_manager.login_view = "auth.login"`,
      },
      {
        type: 'code',
        title: 'app/__init__.py',
        language: 'python',
        code: `from flask import Flask

from app.auth.routes import bp as auth_bp
from app.dashboard.routes import bp as dashboard_bp
from app.extensions import db, login_manager, migrate


def create_app(config_object="app.config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp, url_prefix="/app")
    return app`,
      },
      { type: 'h2', text: 'Step 3: Model users and organizations' },
      {
        type: 'code',
        title: 'app/auth/models.py',
        language: 'python',
        code: `from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db, login_manager


class Organization(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(160), nullable=False)
    users = db.relationship("User", back_populates="organization")


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey("organization.id"), nullable=False)
    organization = db.relationship("Organization", back_populates="users")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))`,
      },
      { type: 'h2', text: 'Step 4: Add login form and routes' },
      {
        type: 'code',
        title: 'app/auth/forms.py',
        language: 'python',
        code: `from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField, SubmitField
from wtforms.validators import DataRequired, Email


class LoginForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Sign in")`,
      },
      {
        type: 'code',
        title: 'app/auth/routes.py',
        language: 'python',
        code: `from flask import Blueprint, flash, redirect, render_template, url_for
from flask_login import login_user, logout_user

from app.auth.forms import LoginForm
from app.auth.models import User

bp = Blueprint("auth", __name__)


@bp.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data.lower()).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            return redirect(url_for("dashboard.overview"))
        flash("Invalid email or password.", "error")
    return render_template("login.html", form=form)


@bp.post("/logout")
def logout():
    logout_user()
    return redirect(url_for("auth.login"))`,
      },
      { type: 'h2', text: 'Step 5: Create protected dashboard routes' },
      {
        type: 'code',
        title: 'app/dashboard/routes.py',
        language: 'python',
        code: `from flask import Blueprint, render_template
from flask_login import current_user, login_required

bp = Blueprint("dashboard", __name__, template_folder="templates")


@bp.get("/")
@login_required
def overview():
    return render_template(
        "dashboard/overview.html",
        organization=current_user.organization,
    )


@bp.get("/settings")
@login_required
def settings():
    return render_template(
        "dashboard/settings.html",
        organization=current_user.organization,
    )`,
      },
      { type: 'h2', text: 'Step 6: Build reusable app templates' },
      {
        type: 'code',
        title: 'app/templates/app_base.html',
        language: 'html',
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{% block title %}Dashboard{% endblock %}</title>
  </head>
  <body>
    <aside>
      <strong>{{ current_user.organization.name }}</strong>
      <nav>
        <a href="{{ url_for('dashboard.overview') }}">Overview</a>
        <a href="{{ url_for('dashboard.settings') }}">Settings</a>
      </nav>
      <form method="post" action="{{ url_for('auth.logout') }}">
        <button type="submit">Sign out</button>
      </form>
    </aside>

    <main>
      {% block content %}{% endblock %}
    </main>
  </body>
</html>`,
      },
      {
        type: 'code',
        title: 'Dashboard page templates',
        language: 'html',
        code: `<!-- app/dashboard/templates/dashboard/overview.html -->
{% extends "app_base.html" %}
{% block title %}Overview{% endblock %}
{% block content %}
  <h1>Overview</h1>
  <p>Welcome to {{ organization.name }}.</p>
  <section>
    <h2>Next steps</h2>
    <ul>
      <li>Invite teammates</li>
      <li>Connect billing</li>
      <li>Create your first project</li>
    </ul>
  </section>
{% endblock %}

<!-- app/dashboard/templates/dashboard/settings.html -->
{% extends "app_base.html" %}
{% block title %}Settings{% endblock %}
{% block content %}
  <h1>Settings</h1>
  <p>Organization settings for {{ organization.name }} will live here.</p>
{% endblock %}`,
      },
      { type: 'h2', text: 'Step 7: Seed a first organization' },
      {
        type: 'code',
        title: 'One-time seed command idea',
        language: 'python',
        code: `# app/commands.py
import click

from app.auth.models import Organization, User
from app.extensions import db


def register_commands(app):
    @app.cli.command("seed-admin")
    @click.argument("email")
    @click.argument("password")
    def seed_admin(email, password):
        organization = Organization(name="Demo Company")
        user = User(email=email.lower(), organization=organization)
        user.set_password(password)
        db.session.add_all([organization, user])
        db.session.commit()
        click.echo("Admin user created")`,
      },
      {
        type: 'code',
        title: 'Run migrations and seed data',
        language: 'bash',
        code: `export FLASK_APP=wsgi.py
flask db init
flask db migrate -m "create saas shell"
flask db upgrade
flask seed-admin admin@example.com change-me-now
flask run`,
      },
      {
        type: 'try',
        text: 'Add an invite model next. Keep invitations scoped to an organization so users cannot join the wrong workspace.',
      },
      {
        type: 'keypoints',
        items: [
          'A SaaS shell needs authentication, organization context, and reusable layout.',
          'Flask-Login protects dashboard routes with login_required.',
          'Organization-aware models prepare the app for team features.',
          'A clean shell makes future billing, projects, and settings easier to add.',
        ],
      },
    ],
  },
  {
    slug: 'flask-common-mistakes',
    title: 'Common Flask Mistakes (and Fixes)',
    description:
      'Recognize frequent Flask problems around globals, debug mode, database sessions, templates, forms, blueprints, and production readiness.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 63,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Flask makes it easy to start, which also makes it easy to grow accidental complexity. Most common mistakes are fixable once you understand the boundary between request handling, application setup, data access, and production operations.',
      },
      { type: 'h2', text: 'Mistake 1: One giant app.py forever' },
      {
        type: 'p',
        text: 'A single file is fine for experiments. When forms, models, auth, and templates grow, move to an application factory and feature blueprints.',
      },
      {
        type: 'code',
        title: 'From global app to factory',
        language: 'python',
        code: `# Better structure
def create_app():
    app = Flask(__name__)
    register_extensions(app)
    register_blueprints(app)
    return app`,
      },
      { type: 'h2', text: 'Mistake 2: Debug mode in production' },
      {
        type: 'warning',
        text: 'DEBUG=True can expose sensitive data and interactive debugging tools. Production should run with debug disabled and secrets loaded from the environment.',
      },
      { type: 'h2', text: 'Mistake 3: Trusting user input' },
      {
        type: 'p',
        text: 'Validate request data with forms, schemas, or explicit checks. Never build SQL strings from request values, and never mark user HTML safe unless it has been sanitized.',
      },
      {
        type: 'code',
        title: 'Use parameters or ORM filters',
        language: 'python',
        code: `# Good: SQLAlchemy binds values safely
user = User.query.filter_by(email=request.form["email"]).first()

# Bad idea: building SQL with string formatting
# db.session.execute(f"select * from users where email = '{email}'")`,
      },
      { type: 'h2', text: 'Mistake 4: Committing too often' },
      {
        type: 'p',
        text: 'A database commit should usually represent a complete business action. If you commit halfway through a workflow, later failures can leave data in a strange state.',
      },
      {
        type: 'code',
        title: 'Commit once after related changes',
        language: 'python',
        code: `order = Order(user=current_user)
payment = Payment(order=order, status="pending")
db.session.add_all([order, payment])
db.session.commit()`,
      },
      { type: 'h2', text: 'Mistake 5: Mixing API and HTML responses casually' },
      {
        type: 'p',
        text: 'HTML routes should redirect, flash, and render templates. API routes should return JSON and status codes. Mixing the two makes clients and error handling harder.',
      },
      {
        type: 'table',
        headers: ['Mistake', 'Fix'],
        rows: [
          ['Hard-coded URLs', 'Use url_for with endpoint names'],
          ['Plain text passwords', 'Use generate_password_hash and check_password_hash'],
          ['Missing CSRF on forms', 'Use Flask-WTF or another CSRF strategy'],
          ['No migrations', 'Use Flask-Migrate for schema changes'],
          ['Slow route sends email', 'Move email to a background task'],
          ['Huge list page', 'Add pagination and indexes'],
        ],
      },
      {
        type: 'tip',
        text: 'When you feel tempted to add a quick fix inside a route, ask whether it belongs in a form, service, model, template, or config setting instead.',
      },
      {
        type: 'keypoints',
        items: [
          'Move beyond one-file apps as soon as features become related but crowded.',
          'Never run production with debug mode enabled.',
          'Validate input and keep user HTML escaped by default.',
          'Use migrations, clear transactions, and separate response styles.',
        ],
      },
    ],
  },
  {
    slug: 'flask-ecosystem',
    title: 'Flask Ecosystem & When to Use Flask',
    description:
      'Understand the Flask extension ecosystem and decide when Flask is a strong fit compared with larger frameworks or async-first tools.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 64,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Flask is a microframework, not a tiny toy. It gives you routing, request handling, responses, templating, and extension hooks while letting you choose the rest of your stack.',
      },
      { type: 'h2', text: 'Popular extension categories' },
      {
        type: 'table',
        headers: ['Need', 'Common Flask choice', 'What it adds'],
        rows: [
          ['Database ORM', 'Flask-SQLAlchemy', 'SQLAlchemy integration and app context handling'],
          ['Migrations', 'Flask-Migrate', 'Alembic commands through Flask CLI'],
          ['Forms and CSRF', 'Flask-WTF', 'WTForms integration and CSRF protection'],
          ['Login sessions', 'Flask-Login', 'User session helpers and login_required'],
          ['Caching', 'Flask-Caching', 'Redis, filesystem, and memory cache adapters'],
          ['Admin screens', 'Flask-Admin', 'Quick CRUD-style admin interfaces'],
        ],
      },
      { type: 'h2', text: 'When Flask is a strong fit' },
      {
        type: 'ul',
        items: [
          'You want control over architecture and dependencies.',
          'The app starts small but may grow in specific directions.',
          'You are building APIs, dashboards, internal tools, prototypes, or custom backends.',
          'Your team understands Python and wants explicit choices.',
        ],
      },
      { type: 'h2', text: 'When another tool may fit better' },
      {
        type: 'ul',
        items: [
          'Use Django when you want a batteries-included admin, ORM conventions, auth, and project layout from day one.',
          'Use FastAPI when your main product is an async-first typed API and OpenAPI generation is central.',
          'Use a static site generator when most pages are content and do not need dynamic server behavior.',
          'Use a managed backend when the project mostly needs auth, storage, and CRUD with minimal custom logic.',
        ],
      },
      {
        type: 'code',
        title: 'A practical Flask stack',
        language: 'toml',
        code: `[project]
dependencies = [
  "Flask",
  "Flask-SQLAlchemy",
  "Flask-Migrate",
  "Flask-Login",
  "Flask-WTF",
  "gunicorn",
  "psycopg[binary]",
]`,
      },
      {
        type: 'p',
        text: 'The best Flask apps are intentionally assembled. Choose extensions because they solve a real problem, not because every project template includes them.',
      },
      {
        type: 'keypoints',
        items: [
          'Flask is flexible because many decisions are left to the application.',
          'Extensions cover common needs such as ORM, migrations, forms, login, caching, and admin.',
          'Flask is a strong fit for custom backends, APIs, dashboards, and tools.',
          'Choose a larger or more specialized framework when its defaults match the product better.',
        ],
      },
    ],
  },
  {
    slug: 'flask-next-steps',
    title: 'What to Learn After Flask',
    description:
      'Choose a practical learning path after Flask: testing, databases, security, deployment, APIs, frontend integration, and system design.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 65,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Finishing a Flask path means you can build useful web apps. The next step is to deepen the skills around Flask: reliable tests, stronger database design, secure production deployment, better APIs, and frontend collaboration.',
      },
      { type: 'h2', text: 'Path 1: Testing and maintainability' },
      {
        type: 'ul',
        items: [
          'Learn pytest fixtures for app, client, database, and logged-in users.',
          'Test permission failures, validation errors, redirects, and JSON contracts.',
          'Practice refactoring route logic into service functions.',
          'Add coverage for every bug fix before changing the code.',
        ],
      },
      { type: 'h2', text: 'Path 2: Databases and data modeling' },
      {
        type: 'ul',
        items: [
          'Study SQL joins, indexes, constraints, transactions, and isolation.',
          'Read generated Alembic migrations before applying them.',
          'Learn how to explain slow queries and add useful indexes.',
          'Practice backup and restore workflows locally.',
        ],
      },
      { type: 'h2', text: 'Path 3: Production operations' },
      {
        type: 'code',
        title: 'Production readiness checklist',
        language: 'text',
        code: `Flask production checklist:
- DEBUG is false
- SECRET_KEY and DATABASE_URL come from secrets
- HTTPS is enforced by the platform or proxy
- Session cookies are Secure and HttpOnly
- Migrations run during deploy
- Logs are structured enough to debug incidents
- Health checks are configured
- Backups and restores are tested`,
      },
      { type: 'h2', text: 'Path 4: APIs and frontend integration' },
      {
        type: 'p',
        text: 'If Flask powers a frontend app, learn API versioning, pagination, filtering, authentication tokens, CORS rules, and schema validation. A good API is a contract, not just a collection of routes.',
      },
      {
        type: 'code',
        title: 'Simple API response shape',
        language: 'json',
        code: `{
  "data": [
    {
      "id": 1,
      "title": "Learn Flask deeply"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20
  }
}`,
      },
      { type: 'h2', text: 'A 30-day practice plan' },
      {
        type: 'ol',
        items: [
          'Week 1: Add tests to an existing Flask project.',
          'Week 2: Move from SQLite to PostgreSQL with migrations.',
          'Week 3: Deploy with Gunicorn, environment secrets, and health checks.',
          'Week 4: Add caching, a background task, and performance logs.',
        ],
      },
      {
        type: 'tip',
        text: 'The best portfolio project is not the biggest app. It is an app that shows clean structure, tests, database migrations, auth, deployment notes, and thoughtful tradeoffs.',
      },
      {
        type: 'keypoints',
        items: [
          'After Flask, deepen the surrounding production skills.',
          'Testing, SQL, security, deployment, and observability make Flask apps trustworthy.',
          'APIs should be designed as stable contracts.',
          'A focused project with documentation is more impressive than a large unfinished clone.',
        ],
      },
    ],
  },
];
