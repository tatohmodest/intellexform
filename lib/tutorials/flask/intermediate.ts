import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'flask-sqlalchemy-setup',
    title: 'Flask-SQLAlchemy Setup',
    description:
      'Install Flask-SQLAlchemy, configure a database URL, and initialize the extension with the application factory pattern.',
    level: 'intermediate',
    section: 'Database',
    order: 26,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Most real Flask apps need persistent data. Flask-SQLAlchemy connects Flask to SQLAlchemy, the most widely used Python ORM, while still keeping access to the full SQLAlchemy toolkit when you need it.',
      },
      {
        type: 'p',
        text: 'Modern Flask projects usually initialize extensions outside the app factory, then bind them to the app inside create_app(). This avoids circular imports and makes tests easier to configure.',
      },
      { type: 'h2', text: 'Install the packages' },
      {
        type: 'code',
        language: 'bash',
        title: 'Terminal',
        code: `python -m venv .venv
source .venv/bin/activate
pip install Flask Flask-SQLAlchemy`,
      },
      { type: 'h2', text: 'Create a database extension object' },
      {
        type: 'code',
        language: 'python',
        title: 'app/extensions.py',
        code: `from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)`,
      },
      {
        type: 'p',
        text: 'Flask-SQLAlchemy 3 supports SQLAlchemy 2 style models. Defining a DeclarativeBase lets your models use mapped_column() and type annotations cleanly.',
      },
      { type: 'h2', text: 'Configure the application' },
      {
        type: 'code',
        language: 'python',
        title: 'app/__init__.py',
        code: `from flask import Flask

from .extensions import db


def create_app(config_object=None):
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY="dev",
        SQLALCHEMY_DATABASE_URI="sqlite:///app.db",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    if config_object is not None:
        app.config.from_object(config_object)

    db.init_app(app)

    return app`,
      },
      {
        type: 'note',
        text: 'The sqlite:///app.db path is relative to Flask instance_path, not always your project root. For production, use a full database URL such as postgresql+psycopg://user:password@host/dbname.',
      },
      { type: 'h2', text: 'Create tables during early development' },
      {
        type: 'code',
        language: 'python',
        title: 'app/__init__.py',
        code: `def create_app(config_object=None):
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY="dev",
        SQLALCHEMY_DATABASE_URI="sqlite:///app.db",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    if config_object is not None:
        app.config.from_object(config_object)

    db.init_app(app)

    with app.app_context():
        from . import models

        db.create_all()

    return app`,
      },
      {
        type: 'warning',
        text: 'db.create_all() is convenient while learning, but it does not alter existing tables safely. Use Flask-Migrate for schema changes once your app grows.',
      },
      {
        type: 'tip',
        text: 'Keep database configuration in app.config and initialize db only once. Import db from app.extensions everywhere instead of creating multiple SQLAlchemy() instances.',
      },
      {
        type: 'try',
        text: 'Create a tiny Flask app package with app/__init__.py and app/extensions.py. Configure SQLite, run the app shell, and confirm current_app.config["SQLALCHEMY_DATABASE_URI"] contains your database URL.',
      },
      {
        type: 'keypoints',
        items: [
          'Create one SQLAlchemy extension object and bind it inside create_app().',
          'Flask-SQLAlchemy 3 works well with SQLAlchemy 2 DeclarativeBase models.',
          'SQLALCHEMY_DATABASE_URI controls the database connection.',
          'Use create_all() only for simple local learning; use migrations for evolving schemas.',
        ],
      },
    ],
  },
  {
    slug: 'flask-models',
    title: 'Models & Tables',
    description:
      'Define SQLAlchemy models with columns, constraints, defaults, and helpful representation methods.',
    level: 'intermediate',
    section: 'Database',
    order: 27,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'A model is a Python class that maps to a database table. Each object represents one row, and each mapped attribute represents a column or relationship.',
      },
      {
        type: 'p',
        text: 'Good models describe your data rules close to the data: required fields, uniqueness, indexes, defaults, and relationships all belong in the model layer.',
      },
      { type: 'h2', text: 'A SQLAlchemy 2 style model' },
      {
        type: 'code',
        language: 'python',
        title: 'app/models.py',
        code: `from datetime import datetime

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .extensions import db


class Post(db.Model):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(140), unique=True, index=True)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    published: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<Post {self.slug}>"`,
      },
      {
        type: 'p',
        text: 'Mapped[type] tells SQLAlchemy and your editor what type a model attribute has. mapped_column() stores the database configuration for that attribute.',
      },
      { type: 'h2', text: 'Common column options' },
      {
        type: 'table',
        headers: ['Option', 'Meaning'],
        rows: [
          ['primary_key=True', 'Makes the column the row identifier.'],
          ['nullable=False', 'Requires a value before the row can be saved.'],
          ['unique=True', 'Prevents duplicate values in that column.'],
          ['index=True', 'Adds an index for faster lookup by that column.'],
          ['default=value', 'Sets a Python-side default when a new object is created.'],
        ],
      },
      { type: 'h2', text: 'Create and inspect a model instance' },
      {
        type: 'code',
        language: 'python',
        title: 'Flask shell',
        code: `from app.extensions import db
from app.models import Post

post = Post(
    title="First Flask Post",
    slug="first-flask-post",
    body="Models make database rows feel like Python objects.",
)

db.session.add(post)
db.session.commit()

Post.query.first()`,
      },
      {
        type: 'note',
        text: 'The database, not Python, enforces constraints such as unique and nullable. Handle IntegrityError when user input might violate a constraint.',
      },
      { type: 'h2', text: 'Keep models focused' },
      {
        type: 'code',
        language: 'python',
        title: 'app/models.py',
        code: `class Post(db.Model):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(140), unique=True, index=True)
    body: Mapped[str] = mapped_column(Text, nullable=False)

    @property
    def excerpt(self) -> str:
        if len(self.body) <= 120:
            return self.body
        return self.body[:117] + "..."`,
      },
      {
        type: 'tip',
        text: 'Small derived properties such as excerpt are fine on a model. Keep request handling, form validation, and template decisions in views and forms.',
      },
      {
        type: 'try',
        text: 'Add a Category model with id, name, slug, and created_at fields. Make slug unique and indexed, then create one category from the Flask shell.',
      },
      {
        type: 'keypoints',
        items: [
          'Models are Python classes mapped to database tables.',
          'Use Mapped and mapped_column for modern Flask-SQLAlchemy models.',
          'Column constraints document and enforce important data rules.',
          'Model methods should stay close to data behavior, not request behavior.',
        ],
      },
    ],
  },
  {
    slug: 'flask-migrations',
    title: 'Flask-Migrate & Alembic',
    description:
      'Use Flask-Migrate to create, review, and apply Alembic migrations as your database schema changes.',
    level: 'intermediate',
    section: 'Database',
    order: 28,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'A migration is a versioned database change. Instead of deleting your database whenever a model changes, you create a migration that can upgrade or downgrade the schema safely.',
      },
      {
        type: 'p',
        text: 'Flask-Migrate integrates Alembic with the Flask command line. Alembic compares your models to the current database and generates migration scripts.',
      },
      { type: 'h2', text: 'Install and initialize Flask-Migrate' },
      {
        type: 'code',
        language: 'bash',
        title: 'Terminal',
        code: `pip install Flask-Migrate
flask db init`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'app/extensions.py',
        code: `from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
migrate = Migrate()`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'app/__init__.py',
        code: `from flask import Flask

from .extensions import db, migrate


def create_app():
    app = Flask(__name__)
    app.config.from_mapping(
        SQLALCHEMY_DATABASE_URI="sqlite:///app.db",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    db.init_app(app)
    migrate.init_app(app, db)

    return app`,
      },
      { type: 'h2', text: 'Create and run a migration' },
      {
        type: 'code',
        language: 'bash',
        title: 'Terminal',
        code: `flask db migrate -m "create posts table"
flask db upgrade`,
      },
      {
        type: 'p',
        text: 'Always open generated migration files before applying them. Autogeneration is helpful, but it cannot understand every rename, data migration, or production safety concern.',
      },
      {
        type: 'code',
        language: 'python',
        title: 'migrations/versions/xxxx_create_posts_table.py',
        code: `def upgrade():
    op.create_table(
        "posts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=120), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("posts")`,
      },
      { type: 'h2', text: 'A safe workflow' },
      {
        type: 'ol',
        items: [
          'Change your model code.',
          'Run flask db migrate with a clear message.',
          'Review and edit the generated migration file.',
          'Run flask db upgrade locally.',
          'Commit the model change and migration together.',
        ],
      },
      {
        type: 'warning',
        text: 'Renaming a model attribute may be detected as drop column plus add column. Edit the migration to use op.alter_column() or batch operations so you do not lose data.',
      },
      {
        type: 'tip',
        text: 'For SQLite column changes, Flask-Migrate may use batch mode. In production PostgreSQL or MySQL, review locks and long-running table changes carefully.',
      },
      {
        type: 'try',
        text: 'Add a published boolean column to Post, generate a migration, inspect the script, and apply it with flask db upgrade.',
      },
      {
        type: 'keypoints',
        items: [
          'Migrations are versioned schema changes.',
          'Flask-Migrate adds flask db commands powered by Alembic.',
          'Autogenerated migrations must be reviewed before use.',
          'Commit migrations with the model code that requires them.',
        ],
      },
    ],
  },
  {
    slug: 'flask-crud',
    title: 'CRUD with SQLAlchemy',
    description:
      'Build create, read, update, and delete routes using SQLAlchemy sessions and Flask redirects.',
    level: 'intermediate',
    section: 'Database',
    order: 29,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'CRUD stands for create, read, update, and delete. These four actions make up the core of most admin pages, dashboards, and user-generated content features.',
      },
      {
        type: 'p',
        text: 'In Flask, CRUD usually combines routes, templates, form handling, model queries, and database session commits.',
      },
      { type: 'h2', text: 'Read: list and detail pages' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/routes.py',
        code: `from flask import Blueprint, abort, render_template

from app.models import Post

bp = Blueprint("posts", __name__, url_prefix="/posts")


@bp.get("/")
def index():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return render_template("posts/index.html", posts=posts)


@bp.get("/<string:slug>")
def detail(slug):
    post = Post.query.filter_by(slug=slug).first_or_404()
    return render_template("posts/detail.html", post=post)`,
      },
      { type: 'h2', text: 'Create: add a new row' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/routes.py',
        code: `from flask import flash, redirect, request, url_for

from app.extensions import db
from app.models import Post


@bp.route("/new", methods=["GET", "POST"])
def create():
    if request.method == "POST":
        post = Post(
            title=request.form["title"],
            slug=request.form["slug"],
            body=request.form["body"],
        )
        db.session.add(post)
        db.session.commit()
        flash("Post created.", "success")
        return redirect(url_for("posts.detail", slug=post.slug))

    return render_template("posts/form.html", post=None)`,
      },
      {
        type: 'note',
        text: 'This example uses request.form directly to focus on CRUD. In a production form, validate input with Flask-WTF, WTForms, or your own validation layer before committing.',
      },
      { type: 'h2', text: 'Update: change an existing row' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/routes.py',
        code: `@bp.route("/<int:post_id>/edit", methods=["GET", "POST"])
def edit(post_id):
    post = db.get_or_404(Post, post_id)

    if request.method == "POST":
        post.title = request.form["title"]
        post.slug = request.form["slug"]
        post.body = request.form["body"]
        db.session.commit()
        flash("Post updated.", "success")
        return redirect(url_for("posts.detail", slug=post.slug))

    return render_template("posts/form.html", post=post)`,
      },
      { type: 'h2', text: 'Delete: remove a row intentionally' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/routes.py',
        code: `@bp.post("/<int:post_id>/delete")
def delete(post_id):
    post = db.get_or_404(Post, post_id)
    db.session.delete(post)
    db.session.commit()
    flash("Post deleted.", "info")
    return redirect(url_for("posts.index"))`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/posts/detail.html',
        code: `<form method="post" action="{{ url_for('posts.delete', post_id=post.id) }}">
  <button type="submit">Delete post</button>
</form>`,
      },
      {
        type: 'warning',
        text: 'Use POST for destructive actions. A delete link with GET can be triggered by crawlers, previews, or accidental browser prefetching.',
      },
      {
        type: 'tip',
        text: 'Use db.get_or_404(Model, id) when loading by primary key. Use first_or_404() when loading by filters such as a slug.',
      },
      {
        type: 'try',
        text: 'Build CRUD routes for a Category model: list categories, create a category, edit the category name, and delete it through a POST form.',
      },
      {
        type: 'keypoints',
        items: [
          'CRUD routes combine request handling, model queries, templates, and commits.',
          'Add new objects with db.session.add() and save changes with db.session.commit().',
          'Existing loaded objects are tracked, so assigning attributes then committing updates the row.',
          'Destructive actions should use POST and authorization checks.',
        ],
      },
    ],
  },
  {
    slug: 'flask-relationships',
    title: 'Model Relationships',
    description:
      'Connect models with one-to-many and many-to-many relationships using foreign keys and relationship attributes.',
    level: 'intermediate',
    section: 'Database',
    order: 30,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Relationships let rows refer to each other. A blog post belongs to a user, a user has many posts, and posts may have many tags.',
      },
      {
        type: 'p',
        text: 'SQLAlchemy relationships give you Python attributes that load related objects while foreign keys keep the database structure explicit.',
      },
      { type: 'h2', text: 'One user, many posts' },
      {
        type: 'code',
        language: 'python',
        title: 'app/models.py',
        code: `from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .extensions import db


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    posts: Mapped[list["Post"]] = relationship(back_populates="author")


class Post(db.Model):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    author: Mapped["User"] = relationship(back_populates="posts")`,
      },
      {
        type: 'p',
        text: 'The foreign key column stores the user id on posts. The relationship attributes, user.posts and post.author, are Python conveniences for navigating related data.',
      },
      { type: 'h2', text: 'Create related objects' },
      {
        type: 'code',
        language: 'python',
        title: 'Flask shell',
        code: `from app.extensions import db
from app.models import Post, User

user = User(email="ada@example.com")
post = Post(title="Relationships", body="Connected data.", author=user)

db.session.add(post)
db.session.commit()

post.author.email
user.posts[0].title`,
      },
      { type: 'h2', text: 'Many posts, many tags' },
      {
        type: 'code',
        language: 'python',
        title: 'app/models.py',
        code: `from sqlalchemy import Column, ForeignKey, Table

post_tags = Table(
    "post_tags",
    db.metadata,
    Column("post_id", ForeignKey("posts.id"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id"), primary_key=True),
)


class Tag(db.Model):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)
    posts: Mapped[list["Post"]] = relationship(
        secondary=post_tags,
        back_populates="tags",
    )


class Post(db.Model):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    tags: Mapped[list["Tag"]] = relationship(
        secondary=post_tags,
        back_populates="posts",
    )`,
      },
      { type: 'h2', text: 'Cascades and deletes' },
      {
        type: 'code',
        language: 'python',
        title: 'app/models.py',
        code: `class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    posts: Mapped[list["Post"]] = relationship(
        back_populates="author",
        cascade="all, delete-orphan",
    )`,
      },
      {
        type: 'warning',
        text: 'Cascade settings can delete related rows automatically. Use them only when the child row truly should not exist without the parent.',
      },
      {
        type: 'tip',
        text: 'Name both sides of a relationship with back_populates. It is explicit, readable, and easier to refactor than relying on implicit backrefs.',
      },
      {
        type: 'try',
        text: 'Add Comment objects that belong to a Post. Give Post a comments relationship and create a post with two comments from the Flask shell.',
      },
      {
        type: 'keypoints',
        items: [
          'Foreign keys define relationships in the database.',
          'relationship() creates convenient Python attributes for related objects.',
          'One-to-many uses a foreign key on the child table.',
          'Many-to-many uses an association table between the two models.',
        ],
      },
    ],
  },
  {
    slug: 'flask-queries',
    title: 'Querying Like a Pro',
    description:
      'Write focused SQLAlchemy queries with filters, ordering, joins, pagination, eager loading, and aggregate counts.',
    level: 'intermediate',
    section: 'Database',
    order: 31,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Good queries fetch the data a page needs and no more. Flask-SQLAlchemy exposes simple query helpers while still letting you use SQLAlchemy select() for powerful statements.',
      },
      {
        type: 'p',
        text: 'As data grows, small choices such as filtering in the database, limiting result sizes, and eager loading relationships become important.',
      },
      { type: 'h2', text: 'Filter, order, and limit' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/routes.py',
        code: `from app.models import Post

recent = (
    Post.query
    .filter_by(published=True)
    .order_by(Post.created_at.desc())
    .limit(10)
    .all()
)`,
      },
      { type: 'h2', text: 'Use SQLAlchemy select()' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/queries.py',
        code: `from sqlalchemy import select

from app.extensions import db
from app.models import Post


def published_posts():
    stmt = (
        select(Post)
        .where(Post.published.is_(True))
        .order_by(Post.created_at.desc())
    )
    return db.session.scalars(stmt).all()`,
      },
      {
        type: 'note',
        text: 'In SQLAlchemy 2 style, select(Post) builds a statement and db.session.scalars(stmt) returns model objects from that statement.',
      },
      { type: 'h2', text: 'Search with ilike' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/queries.py',
        code: `def search_posts(term: str):
    pattern = f"%{term.strip()}%"
    stmt = (
        select(Post)
        .where(Post.title.ilike(pattern))
        .order_by(Post.created_at.desc())
    )
    return db.session.scalars(stmt).all()`,
      },
      { type: 'h2', text: 'Avoid N+1 queries with eager loading' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/queries.py',
        code: `from sqlalchemy.orm import selectinload


def posts_with_authors():
    stmt = (
        select(Post)
        .options(selectinload(Post.author))
        .order_by(Post.created_at.desc())
    )
    return db.session.scalars(stmt).all()`,
      },
      {
        type: 'p',
        text: 'Without eager loading, rendering post.author.email inside a loop can trigger one extra query per post. selectinload() loads related authors in a second efficient query.',
      },
      { type: 'h2', text: 'Counts and joins' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/queries.py',
        code: `from sqlalchemy import func

from app.models import Comment


def comment_counts_by_post():
    stmt = (
        select(Post.title, func.count(Comment.id).label("comment_count"))
        .join(Comment, Comment.post_id == Post.id, isouter=True)
        .group_by(Post.id)
        .order_by(func.count(Comment.id).desc())
    )
    return db.session.execute(stmt).all()`,
      },
      {
        type: 'tip',
        text: 'Inspect generated SQL during development by enabling SQLALCHEMY_ECHO=True or configuring SQL logging. It helps you catch accidental extra queries.',
      },
      {
        type: 'try',
        text: 'Write a query function that returns the five newest published posts for a specific author email, eager-loading the author relationship.',
      },
      {
        type: 'keypoints',
        items: [
          'Filter and sort in the database instead of in Python lists.',
          'select() plus db.session.scalars() is the modern SQLAlchemy query style.',
          'Use eager loading to avoid N+1 query problems.',
          'Aggregates such as count() belong in database queries for accuracy and speed.',
        ],
      },
    ],
  },
  {
    slug: 'flask-password-hash',
    title: 'Password Hashing',
    description:
      'Store passwords safely with Werkzeug hashing helpers and never keep raw passwords in the database.',
    level: 'intermediate',
    section: 'Auth',
    order: 32,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Authentication starts with one rule: never store plain text passwords. If your database leaks, password hashes are much harder for attackers to use than raw passwords.',
      },
      {
        type: 'p',
        text: 'Flask includes Werkzeug, which provides secure password hashing helpers that encode the algorithm, salt, and hash into one string.',
      },
      { type: 'h2', text: 'Add password helpers to the user model' },
      {
        type: 'code',
        language: 'python',
        title: 'app/models.py',
        code: `from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)`,
      },
      {
        type: 'note',
        text: 'The generated hash includes a random salt, so hashing the same password twice produces different strings. Compare passwords with check_password_hash(), not string equality.',
      },
      { type: 'h2', text: 'Use the helpers during signup and login' },
      {
        type: 'code',
        language: 'python',
        title: 'app/auth/routes.py',
        code: `from flask import Blueprint, flash, redirect, request, url_for

from app.extensions import db
from app.models import User

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.post("/signup")
def signup():
    user = User(email=request.form["email"].lower().strip())
    user.set_password(request.form["password"])
    db.session.add(user)
    db.session.commit()
    flash("Account created. Please log in.", "success")
    return redirect(url_for("auth.login"))`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'app/auth/routes.py',
        code: `@bp.post("/login")
def login():
    user = User.query.filter_by(
        email=request.form["email"].lower().strip(),
    ).first()

    if user is None or not user.check_password(request.form["password"]):
        flash("Invalid email or password.", "error")
        return redirect(url_for("auth.login"))

    flash("Welcome back.", "success")
    return redirect(url_for("dashboard.index"))`,
      },
      {
        type: 'warning',
        text: 'Do not log passwords, send them back to templates, store them in sessions, or include them in debug messages.',
      },
      { type: 'h2', text: 'Basic password rules' },
      {
        type: 'ul',
        items: [
          'Require a reasonable minimum length.',
          'Allow long passwords and password managers.',
          'Avoid arbitrary maximum lengths such as 16 characters.',
          'Use HTTPS in production so passwords are encrypted in transit.',
        ],
      },
      {
        type: 'tip',
        text: 'Keep password validation separate from password hashing. Validation decides whether a password is acceptable; hashing protects the accepted password at rest.',
      },
      {
        type: 'try',
        text: 'Add a change_password method to User that accepts the old password and new password, verifies the old password, then replaces password_hash.',
      },
      {
        type: 'keypoints',
        items: [
          'Never store raw passwords.',
          'Use generate_password_hash() when saving a password.',
          'Use check_password_hash() when verifying a login.',
          'Password hashes include a salt and algorithm metadata.',
        ],
      },
    ],
  },
  {
    slug: 'flask-login',
    title: 'Flask-Login',
    description:
      'Add session-based user authentication with Flask-Login, user loaders, login_user, logout_user, and current_user.',
    level: 'intermediate',
    section: 'Auth',
    order: 33,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Flask-Login handles the common parts of session authentication: remembering the user id in the session, loading the user for each request, and exposing current_user.',
      },
      {
        type: 'p',
        text: 'It does not decide how users sign up, how passwords are stored, or what roles exist. You keep those choices in your app.',
      },
      { type: 'h2', text: 'Install and initialize' },
      {
        type: 'code',
        language: 'bash',
        title: 'Terminal',
        code: `pip install Flask-Login`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'app/extensions.py',
        code: `from flask_login import LoginManager

login_manager = LoginManager()
login_manager.login_view = "auth.login"
login_manager.login_message_category = "warning"`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'app/__init__.py',
        code: `from flask import Flask

from .extensions import db, login_manager


def create_app():
    app = Flask(__name__)
    app.config.from_mapping(SECRET_KEY="dev")

    db.init_app(app)
    login_manager.init_app(app)

    from .auth import bp as auth_bp

    app.register_blueprint(auth_bp)
    return app`,
      },
      { type: 'h2', text: 'Make User compatible with Flask-Login' },
      {
        type: 'code',
        language: 'python',
        title: 'app/models.py',
        code: `from flask_login import UserMixin

from .extensions import db, login_manager


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)


@login_manager.user_loader
def load_user(user_id: str):
    return db.session.get(User, int(user_id))`,
      },
      {
        type: 'p',
        text: 'UserMixin supplies default is_authenticated, is_active, is_anonymous, and get_id() behavior. The user_loader turns the stored session id back into a User object.',
      },
      { type: 'h2', text: 'Log users in and out' },
      {
        type: 'code',
        language: 'python',
        title: 'app/auth/routes.py',
        code: `from flask import Blueprint, redirect, render_template, request, url_for
from flask_login import login_user, logout_user

from app.models import User

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = User.query.filter_by(email=request.form["email"]).first()
        if user and user.check_password(request.form["password"]):
            login_user(user)
            return redirect(url_for("dashboard.index"))

    return render_template("auth/login.html")


@bp.post("/logout")
def logout():
    logout_user()
    return redirect(url_for("auth.login"))`,
      },
      { type: 'h2', text: 'Use current_user in templates' },
      {
        type: 'code',
        language: 'html',
        title: 'templates/base.html',
        code: `{% if current_user.is_authenticated %}
  <p>Signed in as {{ current_user.email }}</p>
  <form method="post" action="{{ url_for('auth.logout') }}">
    <button>Log out</button>
  </form>
{% else %}
  <a href="{{ url_for('auth.login') }}">Log in</a>
{% endif %}`,
      },
      {
        type: 'tip',
        text: 'Use Flask-Login for browser session auth. For token-based APIs, use a token strategy instead of depending on browser cookies.',
      },
      {
        type: 'try',
        text: 'Add Flask-Login to a small app, create one user in the database, log in through a form, and show current_user.email in the navigation bar.',
      },
      {
        type: 'keypoints',
        items: [
          'Flask-Login manages session-based authentication for Flask apps.',
          'UserMixin gives your User model the methods Flask-Login expects.',
          'The user_loader reloads a user from the id stored in the session.',
          'Use login_user(), logout_user(), and current_user in auth routes and templates.',
        ],
      },
    ],
  },
  {
    slug: 'flask-auth-flows',
    title: 'Signup, Login & Logout Flows',
    description:
      'Put practical authentication routes, templates, validation, flash messages, and redirects together.',
    level: 'intermediate',
    section: 'Auth',
    order: 34,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'A complete auth flow is more than checking a password. Users need clear forms, duplicate email handling, safe redirects, flash messages, and a reliable logout action.',
      },
      {
        type: 'p',
        text: 'Blueprints keep auth routes grouped together so your project stays organized as the app grows.',
      },
      { type: 'h2', text: 'Auth blueprint layout' },
      {
        type: 'code',
        language: 'text',
        title: 'Project files',
        code: `app/
  auth/
    __init__.py
    routes.py
  templates/
    auth/
      signup.html
      login.html`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'app/auth/__init__.py',
        code: `from flask import Blueprint

bp = Blueprint("auth", __name__, url_prefix="/auth")

from . import routes`,
      },
      { type: 'h2', text: 'Signup route' },
      {
        type: 'code',
        language: 'python',
        title: 'app/auth/routes.py',
        code: `from sqlalchemy.exc import IntegrityError
from flask import flash, redirect, render_template, request, url_for
from flask_login import current_user, login_user, logout_user

from app.extensions import db
from app.models import User
from . import bp


@bp.route("/signup", methods=["GET", "POST"])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard.index"))

    if request.method == "POST":
        email = request.form["email"].lower().strip()
        password = request.form["password"]

        if len(password) < 12:
            flash("Use at least 12 characters.", "error")
            return render_template("auth/signup.html", email=email)

        user = User(email=email)
        user.set_password(password)
        db.session.add(user)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            flash("That email is already registered.", "error")
            return render_template("auth/signup.html", email=email)

        login_user(user)
        flash("Welcome! Your account is ready.", "success")
        return redirect(url_for("dashboard.index"))

    return render_template("auth/signup.html")`,
      },
      { type: 'h2', text: 'Login route with next redirect' },
      {
        type: 'code',
        language: 'python',
        title: 'app/auth/routes.py',
        code: `from urllib.parse import urlsplit


def is_safe_next_url(target: str | None) -> bool:
    if not target:
        return False
    parts = urlsplit(target)
    return parts.scheme == "" and parts.netloc == ""


@bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard.index"))

    if request.method == "POST":
        email = request.form["email"].lower().strip()
        user = User.query.filter_by(email=email).first()

        if user is None or not user.check_password(request.form["password"]):
            flash("Invalid email or password.", "error")
            return render_template("auth/login.html", email=email)

        login_user(user, remember="remember" in request.form)
        next_url = request.args.get("next")
        if is_safe_next_url(next_url):
            return redirect(next_url)
        return redirect(url_for("dashboard.index"))

    return render_template("auth/login.html")`,
      },
      {
        type: 'warning',
        text: 'Never redirect to an arbitrary next URL. Only allow relative URLs so attackers cannot turn your login page into an open redirect.',
      },
      { type: 'h2', text: 'Logout route and template form' },
      {
        type: 'code',
        language: 'python',
        title: 'app/auth/routes.py',
        code: `@bp.post("/logout")
def logout():
    logout_user()
    flash("You have been logged out.", "info")
    return redirect(url_for("auth.login"))`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/auth/login.html',
        code: `<form method="post">
  <label>Email <input type="email" name="email" value="{{ email or '' }}" required></label>
  <label>Password <input type="password" name="password" required></label>
  <label><input type="checkbox" name="remember"> Remember me</label>
  <button type="submit">Log in</button>
</form>`,
      },
      {
        type: 'note',
        text: 'If your app uses Flask-WTF or another CSRF protection system, include CSRF tokens in signup, login, and logout forms.',
      },
      {
        type: 'tip',
        text: 'Keep auth messages specific enough to help users but not so detailed that they reveal which emails are registered during login.',
      },
      {
        type: 'try',
        text: 'Build signup.html with email, password, and confirm password fields. Validate that the two passwords match before creating the user.',
      },
      {
        type: 'keypoints',
        items: [
          'Auth flows need validation, database error handling, redirects, and user feedback.',
          'Blueprints keep auth routes and templates organized.',
          'Validate next redirects before using them.',
          'Logout should be a POST action and should clear the login session.',
        ],
      },
    ],
  },
  {
    slug: 'flask-protect-routes',
    title: 'Protecting Routes & Roles',
    description:
      'Restrict pages to logged-in users and add role-based authorization decorators for admin-only behavior.',
    level: 'intermediate',
    section: 'Auth',
    order: 35,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Authentication asks who the user is. Authorization asks what that user is allowed to do. A user may be signed in but still not allowed to access admin pages.',
      },
      {
        type: 'p',
        text: 'Flask-Login gives you login_required for authentication. You can layer your own decorators on top for roles and permissions.',
      },
      { type: 'h2', text: 'Require a logged-in user' },
      {
        type: 'code',
        language: 'python',
        title: 'app/dashboard/routes.py',
        code: `from flask import Blueprint, render_template
from flask_login import login_required

bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")


@bp.get("/")
@login_required
def index():
    return render_template("dashboard/index.html")`,
      },
      {
        type: 'p',
        text: 'When an anonymous user visits this page, Flask-Login redirects to login_manager.login_view and includes a next query string.',
      },
      { type: 'h2', text: 'Add a simple role column' },
      {
        type: 'code',
        language: 'python',
        title: 'app/models.py',
        code: `class User(UserMixin, db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    role: Mapped[str] = mapped_column(String(20), default="member")

    @property
    def is_admin(self) -> bool:
        return self.role == "admin"`,
      },
      { type: 'h2', text: 'Create a role decorator' },
      {
        type: 'code',
        language: 'python',
        title: 'app/auth/decorators.py',
        code: `from functools import wraps

from flask import abort
from flask_login import current_user, login_required


def admin_required(view):
    @wraps(view)
    @login_required
    def wrapped_view(*args, **kwargs):
        if not current_user.is_admin:
            abort(403)
        return view(*args, **kwargs)

    return wrapped_view`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'app/admin/routes.py',
        code: `from flask import Blueprint, render_template

from app.auth.decorators import admin_required

bp = Blueprint("admin", __name__, url_prefix="/admin")


@bp.get("/")
@admin_required
def index():
    return render_template("admin/index.html")`,
      },
      {
        type: 'note',
        text: 'Decorator order matters. The route decorator should be closest to the function name in Flask examples, and your protection decorators should wrap the view logic.',
      },
      { type: 'h2', text: 'Show or hide UI, but protect the route' },
      {
        type: 'code',
        language: 'html',
        title: 'templates/base.html',
        code: `{% if current_user.is_authenticated and current_user.is_admin %}
  <a href="{{ url_for('admin.index') }}">Admin</a>
{% endif %}`,
      },
      {
        type: 'warning',
        text: 'Hiding a link is not security. Always enforce authorization in the route or service layer that performs the action.',
      },
      {
        type: 'tip',
        text: 'For more complex apps, replace a single role string with a permissions table or policy functions such as can_edit_post(user, post).',
      },
      {
        type: 'try',
        text: 'Create an owner_required decorator for editing posts. It should allow admins or the user who owns the post.',
      },
      {
        type: 'keypoints',
        items: [
          'Authentication and authorization solve different problems.',
          'Use login_required for pages that need a signed-in user.',
          'Use custom decorators or policy functions for roles and permissions.',
          'Never rely on hidden template links as the only protection.',
        ],
      },
    ],
  },
  {
    slug: 'flask-uploads',
    title: 'File Uploads',
    description:
      'Accept uploaded files safely, validate filenames and extensions, store files, and serve uploaded assets.',
    level: 'intermediate',
    section: 'App Features',
    order: 36,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'File uploads are common for avatars, documents, and images. They also expand your security surface because users control the file name and file contents.',
      },
      {
        type: 'p',
        text: 'A safe upload flow validates size and extension, sanitizes the filename, stores files outside your code directory, and records metadata in the database.',
      },
      { type: 'h2', text: 'Configure upload limits' },
      {
        type: 'code',
        language: 'python',
        title: 'app/__init__.py',
        code: `from pathlib import Path


def create_app():
    app = Flask(__name__)
    app.config.from_mapping(
        UPLOAD_FOLDER=Path(app.instance_path) / "uploads",
        MAX_CONTENT_LENGTH=4 * 1024 * 1024,
    )
    app.config["UPLOAD_FOLDER"].mkdir(parents=True, exist_ok=True)
    return app`,
      },
      {
        type: 'note',
        text: 'MAX_CONTENT_LENGTH rejects requests larger than the configured number of bytes. This example limits uploads to 4 MB.',
      },
      { type: 'h2', text: 'Create an upload form' },
      {
        type: 'code',
        language: 'html',
        title: 'templates/profile/avatar.html',
        code: `<form method="post" enctype="multipart/form-data">
  <label>Avatar
    <input type="file" name="avatar" accept="image/png,image/jpeg" required>
  </label>
  <button type="submit">Upload</button>
</form>`,
      },
      { type: 'h2', text: 'Save a validated file' },
      {
        type: 'code',
        language: 'python',
        title: 'app/profile/routes.py',
        code: `from uuid import uuid4

from flask import Blueprint, current_app, flash, redirect, render_template, request, url_for
from flask_login import login_required
from werkzeug.utils import secure_filename

bp = Blueprint("profile", __name__, url_prefix="/profile")
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@bp.route("/avatar", methods=["GET", "POST"])
@login_required
def avatar():
    if request.method == "POST":
        file = request.files.get("avatar")
        if file is None or file.filename == "":
            flash("Choose a file first.", "error")
            return redirect(url_for("profile.avatar"))

        if not allowed_file(file.filename):
            flash("Only JPG and PNG files are allowed.", "error")
            return redirect(url_for("profile.avatar"))

        safe_name = secure_filename(file.filename)
        extension = safe_name.rsplit(".", 1)[1].lower()
        stored_name = f"{uuid4().hex}.{extension}"
        destination = current_app.config["UPLOAD_FOLDER"] / stored_name
        file.save(destination)

        flash("Avatar uploaded.", "success")
        return redirect(url_for("profile.avatar"))

    return render_template("profile/avatar.html")`,
      },
      { type: 'h2', text: 'Serve uploaded files during development' },
      {
        type: 'code',
        language: 'python',
        title: 'app/uploads/routes.py',
        code: `from flask import Blueprint, current_app, send_from_directory

bp = Blueprint("uploads", __name__, url_prefix="/uploads")


@bp.get("/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)`,
      },
      {
        type: 'warning',
        text: 'Do not trust extensions alone for high-risk uploads. For production image handling, validate MIME type, inspect content, and consider storing files in object storage such as S3.',
      },
      {
        type: 'tip',
        text: 'Store the generated filename in the database, not the user-provided filename. Generated names avoid collisions and reduce privacy leaks.',
      },
      {
        type: 'try',
        text: 'Add a Document model with original_filename, stored_filename, and uploaded_at. Save a PDF upload and list uploaded documents on a page.',
      },
      {
        type: 'keypoints',
        items: [
          'Upload forms need enctype="multipart/form-data".',
          'Use secure_filename() and generate your own stored filenames.',
          'Limit upload size with MAX_CONTENT_LENGTH.',
          'Validate file type and store upload metadata in the database.',
        ],
      },
    ],
  },
  {
    slug: 'flask-mail',
    title: 'Sending Email',
    description:
      'Configure Flask-Mailman style SMTP settings, send transactional email, and keep email sending testable.',
    level: 'intermediate',
    section: 'App Features',
    order: 37,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Apps send email for account confirmation, password resets, receipts, alerts, and contact forms. Flask does not include mail support by default, so you add an extension or service client.',
      },
      {
        type: 'p',
        text: 'The Flask ecosystem has several mail extensions. This lesson uses Flask-Mailman because it is actively maintained and follows familiar Flask extension patterns.',
      },
      { type: 'h2', text: 'Install and configure' },
      {
        type: 'code',
        language: 'bash',
        title: 'Terminal',
        code: `pip install Flask-Mailman`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'app/extensions.py',
        code: `from flask_mailman import Mail

mail = Mail()`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'app/__init__.py',
        code: `from .extensions import mail


def create_app():
    app = Flask(__name__)
    app.config.from_mapping(
        MAIL_SERVER="smtp.example.com",
        MAIL_PORT=587,
        MAIL_USE_TLS=True,
        MAIL_USERNAME="apikey",
        MAIL_PASSWORD="replace-in-env",
        MAIL_DEFAULT_SENDER="noreply@example.com",
    )
    mail.init_app(app)
    return app`,
      },
      {
        type: 'warning',
        text: 'Do not hard-code real SMTP passwords. Load them from environment variables or your deployment platform secret manager.',
      },
      { type: 'h2', text: 'Send a simple message' },
      {
        type: 'code',
        language: 'python',
        title: 'app/email.py',
        code: `from flask import current_app, render_template
from flask_mailman import EmailMessage


def send_welcome_email(user):
    message = EmailMessage(
        subject="Welcome to Flask Notes",
        body=render_template("email/welcome.txt", user=user),
        from_email=current_app.config["MAIL_DEFAULT_SENDER"],
        to=[user.email],
    )
    message.send()`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'templates/email/welcome.txt',
        code: `Hi {{ user.email }},

Welcome to Flask Notes. Your account is ready.

Thanks,
The Flask Notes Team`,
      },
      { type: 'h2', text: 'Call email from an app flow' },
      {
        type: 'code',
        language: 'python',
        title: 'app/auth/routes.py',
        code: `from app.email import send_welcome_email


@bp.post("/signup")
def signup():
    user = User(email=request.form["email"])
    user.set_password(request.form["password"])
    db.session.add(user)
    db.session.commit()

    send_welcome_email(user)
    flash("Check your inbox for a welcome email.", "success")
    return redirect(url_for("auth.login"))`,
      },
      {
        type: 'note',
        text: 'Sending email inside the request is simple but can slow responses. For production, push email work to a background queue when reliability and speed matter.',
      },
      {
        type: 'tip',
        text: 'During testing, configure a local SMTP catcher or set the extension to an in-memory backend if available so tests do not send real email.',
      },
      {
        type: 'try',
        text: 'Create a contact form that sends an email to the site owner and flashes a success message after the message is accepted.',
      },
      {
        type: 'keypoints',
        items: [
          'Flask apps use extensions or provider SDKs to send email.',
          'Keep mail credentials in environment variables.',
          'Render email bodies from templates for maintainability.',
          'Consider background jobs for production transactional email.',
        ],
      },
    ],
  },
  {
    slug: 'flask-pagination',
    title: 'Pagination',
    description:
      'Split long result sets into pages using Flask-SQLAlchemy paginate() and build page navigation links.',
    level: 'intermediate',
    section: 'App Features',
    order: 38,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Pagination keeps pages fast and readable by loading a small slice of records at a time. Blog archives, search results, and admin tables all benefit from it.',
      },
      {
        type: 'p',
        text: 'Flask-SQLAlchemy provides paginate() for both query objects and SQLAlchemy select statements.',
      },
      { type: 'h2', text: 'Paginate a list route' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/routes.py',
        code: `from flask import Blueprint, render_template, request

from app.models import Post

bp = Blueprint("posts", __name__, url_prefix="/posts")


@bp.get("/")
def index():
    page = request.args.get("page", 1, type=int)
    pagination = (
        Post.query
        .filter_by(published=True)
        .order_by(Post.created_at.desc())
        .paginate(page=page, per_page=10, error_out=False)
    )
    return render_template("posts/index.html", pagination=pagination)`,
      },
      {
        type: 'p',
        text: 'The pagination object contains items for the current page plus metadata such as page, pages, total, has_next, and has_prev.',
      },
      { type: 'h2', text: 'Render pagination links' },
      {
        type: 'code',
        language: 'html',
        title: 'templates/posts/index.html',
        code: `{% for post in pagination.items %}
  <article>
    <h2>{{ post.title }}</h2>
    <p>{{ post.excerpt }}</p>
  </article>
{% endfor %}

<nav aria-label="Pagination">
  {% if pagination.has_prev %}
    <a href="{{ url_for('posts.index', page=pagination.prev_num) }}">Previous</a>
  {% endif %}

  <span>Page {{ pagination.page }} of {{ pagination.pages }}</span>

  {% if pagination.has_next %}
    <a href="{{ url_for('posts.index', page=pagination.next_num) }}">Next</a>
  {% endif %}
</nav>`,
      },
      { type: 'h2', text: 'Preserve query string filters' },
      {
        type: 'code',
        language: 'python',
        title: 'app/helpers.py',
        code: `from flask import request, url_for


def page_url(endpoint: str, page: int, **values):
    args = request.args.to_dict()
    args.update(values)
    args["page"] = page
    return url_for(endpoint, **args)`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/posts/index.html',
        code: `<a href="{{ page_url('posts.index', pagination.next_num) }}">Next</a>`,
      },
      {
        type: 'note',
        text: 'Set error_out=True if an out-of-range page should return 404. Set it to False when you prefer showing an empty page or redirecting.',
      },
      {
        type: 'tip',
        text: 'Choose per_page based on page complexity. A heavy card layout with images may need fewer records per page than a simple text list.',
      },
      {
        type: 'try',
        text: 'Add pagination to a users admin table with 25 users per page and Previous/Next links that preserve a role filter.',
      },
      {
        type: 'keypoints',
        items: [
          'Pagination improves performance and usability for long result sets.',
          'paginate() returns items and useful page metadata.',
          'Read the page number from request.args with a default.',
          'Preserve search and filter parameters in pagination links.',
        ],
      },
    ],
  },
  {
    slug: 'flask-search-filter',
    title: 'Search & Filtering',
    description:
      'Build search and filter routes that compose SQLAlchemy conditions from query string parameters.',
    level: 'intermediate',
    section: 'App Features',
    order: 39,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Search and filtering turn a static list page into a useful data browser. Users expect to filter by status, category, date, role, or a text query.',
      },
      {
        type: 'p',
        text: 'The route should read query string parameters, validate them, build a query, and pass the active values back to the template.',
      },
      { type: 'h2', text: 'Compose a filtered query' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/routes.py',
        code: `from flask import Blueprint, render_template, request
from sqlalchemy import select

from app.extensions import db
from app.models import Category, Post

bp = Blueprint("posts", __name__, url_prefix="/posts")


@bp.get("/")
def index():
    q = request.args.get("q", "", type=str).strip()
    category = request.args.get("category", "", type=str)
    status = request.args.get("status", "published", type=str)

    stmt = select(Post).order_by(Post.created_at.desc())

    if q:
        stmt = stmt.where(Post.title.ilike(f"%{q}%"))

    if category:
        stmt = stmt.join(Post.category).where(Category.slug == category)

    if status == "published":
        stmt = stmt.where(Post.published.is_(True))
    elif status == "draft":
        stmt = stmt.where(Post.published.is_(False))

    posts = db.session.scalars(stmt).all()
    return render_template(
        "posts/index.html",
        posts=posts,
        filters={"q": q, "category": category, "status": status},
    )`,
      },
      {
        type: 'note',
        text: 'SQLAlchemy binds values safely, so f"%{q}%" is still sent as a parameter, not pasted into raw SQL. Avoid building raw SQL strings from user input.',
      },
      { type: 'h2', text: 'Build a search form' },
      {
        type: 'code',
        language: 'html',
        title: 'templates/posts/index.html',
        code: `<form method="get">
  <label>Search
    <input type="search" name="q" value="{{ filters.q }}">
  </label>

  <label>Status
    <select name="status">
      <option value="published" {% if filters.status == 'published' %}selected{% endif %}>Published</option>
      <option value="draft" {% if filters.status == 'draft' %}selected{% endif %}>Draft</option>
      <option value="all" {% if filters.status == 'all' %}selected{% endif %}>All</option>
    </select>
  </label>

  <button type="submit">Apply</button>
  <a href="{{ url_for('posts.index') }}">Clear</a>
</form>`,
      },
      { type: 'h2', text: 'Whitelist sort fields' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/routes.py',
        code: `SORTS = {
    "newest": Post.created_at.desc(),
    "oldest": Post.created_at.asc(),
    "title": Post.title.asc(),
}

sort = request.args.get("sort", "newest")
stmt = stmt.order_by(SORTS.get(sort, SORTS["newest"]))`,
      },
      {
        type: 'warning',
        text: 'Do not pass a user-provided sort field directly into order_by() or text(). Use a whitelist that maps safe query string values to known model columns.',
      },
      { type: 'h2', text: 'Combine search with pagination' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/routes.py',
        code: `page = request.args.get("page", 1, type=int)
pagination = db.paginate(stmt, page=page, per_page=10, error_out=False)
return render_template("posts/index.html", pagination=pagination, filters=filters)`,
      },
      {
        type: 'tip',
        text: 'Normalize empty filter values to "" or None. Templates become easier when every expected filter key always exists.',
      },
      {
        type: 'try',
        text: 'Add filters for author email and tag slug, then preserve those filters when moving between pagination pages.',
      },
      {
        type: 'keypoints',
        items: [
          'Read search filters from request.args for bookmarkable URLs.',
          'Build SQLAlchemy statements conditionally as filters are present.',
          'Whitelist sort fields and directions.',
          'Pass active filter values back to templates so forms stay filled in.',
        ],
      },
    ],
  },
  {
    slug: 'flask-rest-basics',
    title: 'REST API Basics with Flask',
    description:
      'Design resource-oriented Flask routes with HTTP methods, status codes, and JSON responses.',
    level: 'intermediate',
    section: 'APIs',
    order: 40,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'A REST-style API exposes resources through URLs and uses HTTP methods to describe actions. The same Flask routing tools work for APIs and HTML pages.',
      },
      {
        type: 'p',
        text: 'The difference is the response format and contract. API clients expect predictable JSON, status codes, and error shapes.',
      },
      { type: 'h2', text: 'Resource routes' },
      {
        type: 'table',
        headers: ['Method', 'Path', 'Purpose'],
        rows: [
          ['GET', '/api/posts', 'List posts'],
          ['POST', '/api/posts', 'Create a post'],
          ['GET', '/api/posts/42', 'Fetch one post'],
          ['PATCH', '/api/posts/42', 'Update part of a post'],
          ['DELETE', '/api/posts/42', 'Delete a post'],
        ],
      },
      { type: 'h2', text: 'Create an API blueprint' },
      {
        type: 'code',
        language: 'python',
        title: 'app/api/routes.py',
        code: `from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import Post

bp = Blueprint("api", __name__, url_prefix="/api")


def post_to_dict(post: Post) -> dict:
    return {
        "id": post.id,
        "title": post.title,
        "body": post.body,
        "published": post.published,
    }


@bp.get("/posts")
def list_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify({"data": [post_to_dict(post) for post in posts]})`,
      },
      { type: 'h2', text: 'Create a resource with POST' },
      {
        type: 'code',
        language: 'python',
        title: 'app/api/routes.py',
        code: `@bp.post("/posts")
def create_post():
    payload = request.get_json(silent=True) or {}

    if not payload.get("title") or not payload.get("body"):
        return jsonify({"error": "title and body are required"}), 400

    post = Post(
        title=payload["title"],
        body=payload["body"],
        published=payload.get("published", False),
    )
    db.session.add(post)
    db.session.commit()

    return jsonify({"data": post_to_dict(post)}), 201`,
      },
      { type: 'h2', text: 'Update and delete' },
      {
        type: 'code',
        language: 'python',
        title: 'app/api/routes.py',
        code: `@bp.patch("/posts/<int:post_id>")
def update_post(post_id):
    post = db.get_or_404(Post, post_id)
    payload = request.get_json(silent=True) or {}

    if "title" in payload:
        post.title = payload["title"]
    if "body" in payload:
        post.body = payload["body"]
    if "published" in payload:
        post.published = bool(payload["published"])

    db.session.commit()
    return jsonify({"data": post_to_dict(post)})


@bp.delete("/posts/<int:post_id>")
def delete_post(post_id):
    post = db.get_or_404(Post, post_id)
    db.session.delete(post)
    db.session.commit()
    return "", 204`,
      },
      {
        type: 'note',
        text: 'jsonify() sets the response content type to application/json and serializes dictionaries and lists into JSON.',
      },
      {
        type: 'tip',
        text: 'Keep API routes under a prefix such as /api or /api/v1. Versioning becomes easier when clients depend on your API contract.',
      },
      {
        type: 'try',
        text: 'Add GET /api/posts/<id> that returns one post as JSON, and make sure a missing post returns a 404 response.',
      },
      {
        type: 'keypoints',
        items: [
          'REST-style APIs organize behavior around resources and HTTP methods.',
          'Use status codes such as 201 for created and 204 for deleted.',
          'Validate JSON payloads before creating or updating database rows.',
          'Return predictable JSON shapes for clients.',
        ],
      },
    ],
  },
  {
    slug: 'flask-json-apis',
    title: 'Building JSON APIs',
    description:
      'Create consistent JSON serialization, request validation, and response envelopes for Flask APIs.',
    level: 'intermediate',
    section: 'APIs',
    order: 41,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'A useful JSON API has a clear contract. Clients should know which fields exist, how dates are formatted, and what error responses look like.',
      },
      {
        type: 'p',
        text: 'For small apps, explicit serializer functions are easy to read. Larger apps may use Marshmallow, Pydantic, or another schema library.',
      },
      { type: 'h2', text: 'Serialize models intentionally' },
      {
        type: 'code',
        language: 'python',
        title: 'app/api/serializers.py',
        code: `def post_to_dict(post):
    return {
        "id": post.id,
        "title": post.title,
        "slug": post.slug,
        "body": post.body,
        "published": post.published,
        "created_at": post.created_at.isoformat(),
        "author": {
            "id": post.author.id,
            "email": post.author.email,
        } if post.author else None,
    }`,
      },
      {
        type: 'warning',
        text: 'Do not return model.__dict__. It can leak internal SQLAlchemy state, password hashes, private fields, or data your API did not promise.',
      },
      { type: 'h2', text: 'Validate incoming JSON' },
      {
        type: 'code',
        language: 'python',
        title: 'app/api/validation.py',
        code: `from flask import abort, request


def require_json_object():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        abort(400, description="Request body must be a JSON object.")
    return payload


def validate_post_payload(payload):
    errors = {}

    title = str(payload.get("title", "")).strip()
    body = str(payload.get("body", "")).strip()

    if not title:
        errors["title"] = "Title is required."
    if not body:
        errors["body"] = "Body is required."

    if errors:
        return None, errors

    return {"title": title, "body": body}, {}`,
      },
      {
        type: 'note',
        text: 'This helper keeps API routes focused on behavior. If you later use a schema library, the same route can call that schema instead.',
      },
      { type: 'h2', text: 'Use a consistent response envelope' },
      {
        type: 'code',
        language: 'python',
        title: 'app/api/routes.py',
        code: `from flask import jsonify

from .serializers import post_to_dict
from .validation import require_json_object, validate_post_payload


@bp.post("/posts")
def create_post():
    payload = require_json_object()
    data, errors = validate_post_payload(payload)
    if errors:
        return jsonify({"errors": errors}), 422

    post = Post(**data)
    db.session.add(post)
    db.session.commit()

    return jsonify({"data": post_to_dict(post)}), 201`,
      },
      { type: 'h2', text: 'Test with curl' },
      {
        type: 'code',
        language: 'bash',
        title: 'Terminal',
        code: `curl -X POST http://localhost:5000/api/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title":"JSON APIs","body":"Explicit contracts help clients."}'`,
      },
      {
        type: 'code',
        language: 'json',
        title: 'Example response',
        code: `{
  "data": {
    "id": 12,
    "title": "JSON APIs",
    "slug": "json-apis",
    "body": "Explicit contracts help clients.",
    "published": false,
    "created_at": "2026-07-25T11:28:00"
  }
}`,
      },
      {
        type: 'tip',
        text: 'Use 422 Unprocessable Content for well-formed JSON that fails validation, and 400 Bad Request for malformed or non-object JSON bodies.',
      },
      {
        type: 'try',
        text: 'Add a comment_to_dict serializer and POST /api/posts/<id>/comments endpoint that validates body text and returns the new comment.',
      },
      {
        type: 'keypoints',
        items: [
          'Serialize only the fields your API should expose.',
          'Validate JSON payloads before constructing models.',
          'Use consistent response shapes such as data and errors.',
          'Explicit serializers are fine for small APIs; schema libraries help larger APIs.',
        ],
      },
    ],
  },
  {
    slug: 'flask-api-errors',
    title: 'API Error Handling',
    description:
      'Return useful JSON errors with custom error handlers, abort descriptions, validation errors, and database rollback.',
    level: 'intermediate',
    section: 'APIs',
    order: 42,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'HTML error pages are not helpful to API clients. API routes should return JSON errors with clear messages and appropriate HTTP status codes.',
      },
      {
        type: 'p',
        text: 'Centralized error handlers reduce duplicated error response code and make your API contract more predictable.',
      },
      { type: 'h2', text: 'Register JSON error handlers' },
      {
        type: 'code',
        language: 'python',
        title: 'app/api/errors.py',
        code: `from flask import jsonify
from werkzeug.exceptions import HTTPException


def register_error_handlers(app):
    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        response = {
            "error": {
                "code": error.code,
                "name": error.name,
                "message": error.description,
            }
        }
        return jsonify(response), error.code

    @app.errorhandler(500)
    def handle_internal_error(error):
        return jsonify({
            "error": {
                "code": 500,
                "name": "Internal Server Error",
                "message": "An unexpected error occurred.",
            }
        }), 500`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'app/__init__.py',
        code: `from app.api.errors import register_error_handlers


def create_app():
    app = Flask(__name__)
    register_error_handlers(app)
    return app`,
      },
      {
        type: 'note',
        text: 'If your app serves both HTML and JSON, register API error handlers on an API blueprint or branch based on request.path or the Accept header.',
      },
      { type: 'h2', text: 'Use abort descriptions' },
      {
        type: 'code',
        language: 'python',
        title: 'app/api/routes.py',
        code: `from flask import abort


@bp.get("/posts/<int:post_id>")
def get_post(post_id):
    post = db.session.get(Post, post_id)
    if post is None:
        abort(404, description="Post not found.")
    return jsonify({"data": post_to_dict(post)})`,
      },
      { type: 'h2', text: 'Return validation errors' },
      {
        type: 'code',
        language: 'python',
        title: 'app/api/routes.py',
        code: `@bp.post("/posts")
def create_post():
    payload = request.get_json(silent=True) or {}
    errors = {}

    if not payload.get("title"):
        errors["title"] = "Title is required."
    if not payload.get("body"):
        errors["body"] = "Body is required."

    if errors:
        return jsonify({"errors": errors}), 422

    post = Post(title=payload["title"], body=payload["body"])
    db.session.add(post)
    db.session.commit()
    return jsonify({"data": post_to_dict(post)}), 201`,
      },
      { type: 'h2', text: 'Rollback on database errors' },
      {
        type: 'code',
        language: 'python',
        title: 'app/api/errors.py',
        code: `from sqlalchemy.exc import IntegrityError

from app.extensions import db


def register_error_handlers(app):
    @app.errorhandler(IntegrityError)
    def handle_integrity_error(error):
        db.session.rollback()
        return jsonify({
            "error": {
                "code": 409,
                "name": "Conflict",
                "message": "The requested change conflicts with existing data.",
            }
        }), 409`,
      },
      {
        type: 'warning',
        text: 'Do not return raw exception messages from production APIs. They can reveal table names, SQL fragments, file paths, or infrastructure details.',
      },
      {
        type: 'tip',
        text: 'Document your API error shape. Frontend code becomes simpler when every error response follows the same structure.',
      },
      {
        type: 'try',
        text: 'Add a 401 JSON handler for authentication failures and a 403 JSON handler for forbidden admin actions.',
      },
      {
        type: 'keypoints',
        items: [
          'API clients need JSON errors, not HTML error pages.',
          'Centralized error handlers keep responses consistent.',
          'Use status codes that match the problem: 400, 401, 403, 404, 409, or 422.',
          'Rollback the database session after database exceptions.',
        ],
      },
    ],
  },
  {
    slug: 'flask-cors',
    title: 'CORS for Frontend Apps',
    description:
      'Configure Cross-Origin Resource Sharing so browser frontends can call your Flask API safely.',
    level: 'intermediate',
    section: 'APIs',
    order: 43,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'CORS controls whether a browser lets JavaScript from one origin call an API on another origin. It is enforced by browsers, not by curl or server-to-server requests.',
      },
      {
        type: 'p',
        text: 'If your React app runs on localhost:3000 and Flask runs on localhost:5000, the browser treats them as different origins.',
      },
      { type: 'h2', text: 'Install Flask-CORS' },
      {
        type: 'code',
        language: 'bash',
        title: 'Terminal',
        code: `pip install Flask-Cors`,
      },
      { type: 'h2', text: 'Allow a specific frontend origin' },
      {
        type: 'code',
        language: 'python',
        title: 'app/__init__.py',
        code: `from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": ["http://localhost:3000"],
            }
        },
    )

    return app`,
      },
      {
        type: 'note',
        text: 'CORS does not authenticate users or secure your API by itself. It only tells browsers which cross-origin JavaScript calls are allowed.',
      },
      { type: 'h2', text: 'Credentials and cookies' },
      {
        type: 'code',
        language: 'python',
        title: 'app/__init__.py',
        code: `CORS(
    app,
    resources={r"/api/*": {"origins": ["https://app.example.com"]}},
    supports_credentials=True,
)`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'Frontend fetch',
        code: `await fetch("https://api.example.com/api/me", {
  credentials: "include",
});`,
      },
      {
        type: 'warning',
        text: 'When supports_credentials=True, do not use "*" as the allowed origin. Browsers require a specific origin for credentialed requests.',
      },
      { type: 'h2', text: 'Handle preflight requests' },
      {
        type: 'p',
        text: 'For methods such as PATCH or requests with custom headers, browsers send an OPTIONS preflight request. Flask-CORS can answer these automatically with the required headers.',
      },
      {
        type: 'code',
        language: 'text',
        title: 'Common CORS headers',
        code: `Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization`,
      },
      {
        type: 'tip',
        text: 'Configure allowed origins from environment variables so development, staging, and production can use different frontend URLs.',
      },
      {
        type: 'try',
        text: 'Configure CORS for /api/* to allow http://localhost:5173 during development and https://frontend.example.com in production.',
      },
      {
        type: 'keypoints',
        items: [
          'CORS is a browser security policy for cross-origin JavaScript calls.',
          'Allow specific frontend origins instead of opening every origin.',
          'Credentialed cookie requests require supports_credentials and frontend credentials settings.',
          'Preflight OPTIONS requests happen before some cross-origin API calls.',
        ],
      },
    ],
  },
  {
    slug: 'flask-cli',
    title: 'Custom Flask CLI Commands',
    description:
      'Add flask commands for database seeding, user creation, maintenance tasks, and local automation.',
    level: 'intermediate',
    section: 'Tooling',
    order: 44,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Flask includes a Click-powered command line interface. You already use it when running flask run or flask shell.',
      },
      {
        type: 'p',
        text: 'Custom commands are useful for repeatable app tasks such as creating an admin user, seeding demo data, clearing caches, or importing files.',
      },
      { type: 'h2', text: 'Register commands in the app factory' },
      {
        type: 'code',
        language: 'python',
        title: 'app/cli.py',
        code: `import click

from app.extensions import db
from app.models import Post, User


def register_cli(app):
    @app.cli.command("create-admin")
    @click.argument("email")
    @click.password_option()
    def create_admin(email, password):
        user = User(email=email.lower(), role="admin")
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        click.echo(f"Created admin user {email}")`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'app/__init__.py',
        code: `from .cli import register_cli


def create_app():
    app = Flask(__name__)
    register_cli(app)
    return app`,
      },
      { type: 'h2', text: 'Run the command' },
      {
        type: 'code',
        language: 'bash',
        title: 'Terminal',
        code: `flask create-admin ada@example.com
# Password:`,
      },
      {
        type: 'note',
        text: '@click.password_option() prompts securely and avoids putting the password in shell history.',
      },
      { type: 'h2', text: 'Seed demo data' },
      {
        type: 'code',
        language: 'python',
        title: 'app/cli.py',
        code: `@app.cli.command("seed")
def seed():
    if Post.query.count():
        click.echo("Posts already exist. Skipping.")
        return

    posts = [
        Post(title="Welcome", body="First demo post.", published=True),
        Post(title="Draft idea", body="Not public yet.", published=False),
    ]
    db.session.add_all(posts)
    db.session.commit()
    click.echo("Seeded demo posts.")`,
      },
      { type: 'h2', text: 'Commands can accept options' },
      {
        type: 'code',
        language: 'python',
        title: 'app/cli.py',
        code: `@app.cli.command("publish-all")
@click.option("--dry-run", is_flag=True, help="Show what would change.")
def publish_all(dry_run):
    drafts = Post.query.filter_by(published=False).all()
    click.echo(f"Found {len(drafts)} drafts.")

    if dry_run:
        return

    for post in drafts:
        post.published = True
    db.session.commit()
    click.echo("Published all drafts.")`,
      },
      {
        type: 'tip',
        text: 'Keep commands idempotent when possible. If running a command twice would duplicate data or break state, add checks and clear output.',
      },
      {
        type: 'try',
        text: 'Create a flask stats command that prints user count, post count, and number of published posts.',
      },
      {
        type: 'keypoints',
        items: [
          'Flask CLI commands are powered by Click.',
          'Register custom commands during app creation.',
          'Use arguments and options for command input.',
          'CLI commands are great for repeatable maintenance and setup tasks.',
        ],
      },
    ],
  },
  {
    slug: 'flask-logging',
    title: 'Logging',
    description:
      'Use Python logging in Flask apps to record errors, request context, and operational events.',
    level: 'intermediate',
    section: 'Tooling',
    order: 45,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Logs help you understand what happened before, during, and after a bug. print() is fine for quick experiments, but applications should use Python logging.',
      },
      {
        type: 'p',
        text: 'Flask provides app.logger, and you can configure standard Python handlers and formatters to control where logs go and what they include.',
      },
      { type: 'h2', text: 'Log from routes' },
      {
        type: 'code',
        language: 'python',
        title: 'app/posts/routes.py',
        code: `from flask import Blueprint, current_app, request

bp = Blueprint("posts", __name__, url_prefix="/posts")


@bp.post("/")
def create():
    current_app.logger.info("Creating post from %s", request.remote_addr)
    try:
        # create the post here
        ...
    except Exception:
        current_app.logger.exception("Failed to create post")
        raise`,
      },
      {
        type: 'note',
        text: 'logger.exception() records the stack trace for the current exception. Use it inside an except block.',
      },
      { type: 'h2', text: 'Configure logging once' },
      {
        type: 'code',
        language: 'python',
        title: 'app/logging.py',
        code: `import logging
from logging.config import dictConfig


def configure_logging():
    dictConfig({
        "version": 1,
        "formatters": {
            "default": {
                "format": "[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
            }
        },
        "handlers": {
            "wsgi": {
                "class": "logging.StreamHandler",
                "stream": "ext://flask.logging.wsgi_errors_stream",
                "formatter": "default",
            }
        },
        "root": {
            "level": "INFO",
            "handlers": ["wsgi"],
        },
    })`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'app/__init__.py',
        code: `from .logging import configure_logging


def create_app():
    configure_logging()
    app = Flask(__name__)
    return app`,
      },
      { type: 'h2', text: 'Log levels' },
      {
        type: 'table',
        headers: ['Level', 'Use it for'],
        rows: [
          ['DEBUG', 'Detailed developer information.'],
          ['INFO', 'Normal important events such as startup or completed jobs.'],
          ['WARNING', 'Unexpected but recoverable situations.'],
          ['ERROR', 'Failures that prevented an operation.'],
          ['CRITICAL', 'Severe failures requiring immediate attention.'],
        ],
      },
      { type: 'h2', text: 'Add request context' },
      {
        type: 'code',
        language: 'python',
        title: 'app/hooks.py',
        code: `import time

from flask import g, request


def register_request_logging(app):
    @app.before_request
    def start_timer():
        g.start_time = time.perf_counter()

    @app.after_request
    def log_response(response):
        elapsed_ms = (time.perf_counter() - g.start_time) * 1000
        app.logger.info(
            "%s %s %s %.1fms",
            request.method,
            request.path,
            response.status_code,
            elapsed_ms,
        )
        return response`,
      },
      {
        type: 'warning',
        text: 'Never log passwords, authentication tokens, session cookies, or full payment details. Treat logs as sensitive production data.',
      },
      {
        type: 'tip',
        text: 'Use structured JSON logs in container platforms if your log collector understands them. Plain text is fine for local development.',
      },
      {
        type: 'try',
        text: 'Add logging around a file upload route: log successful uploads at info level and rejected extensions at warning level.',
      },
      {
        type: 'keypoints',
        items: [
          'Use Python logging instead of print() in application code.',
          'Configure handlers and formatters once during startup.',
          'Use the correct log level for the importance of the event.',
          'Avoid logging secrets or sensitive user data.',
        ],
      },
    ],
  },
  {
    slug: 'flask-testing',
    title: 'Testing Flask Apps',
    description:
      'Write pytest tests for Flask routes, app factories, database behavior, and authenticated clients.',
    level: 'intermediate',
    section: 'Quality',
    order: 46,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Tests let you change a Flask app with confidence. A good test suite covers routes, redirects, validation, database writes, and permissions.',
      },
      {
        type: 'p',
        text: 'The app factory pattern makes testing easier because each test can create an app with temporary configuration.',
      },
      { type: 'h2', text: 'Install pytest' },
      {
        type: 'code',
        language: 'bash',
        title: 'Terminal',
        code: `pip install pytest`,
      },
      { type: 'h2', text: 'Create test fixtures' },
      {
        type: 'code',
        language: 'python',
        title: 'tests/conftest.py',
        code: `import pytest

from app import create_app
from app.extensions import db


class TestConfig:
    TESTING = True
    SECRET_KEY = "test"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False


@pytest.fixture()
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()`,
      },
      {
        type: 'note',
        text: 'If your create_app accepts a config object, tests can override the database URL, secret key, mail backend, and other risky production settings.',
      },
      { type: 'h2', text: 'Test a page' },
      {
        type: 'code',
        language: 'python',
        title: 'tests/test_pages.py',
        code: `def test_homepage(client):
    response = client.get("/")
    assert response.status_code == 200
    assert b"Welcome" in response.data`,
      },
      { type: 'h2', text: 'Test creating data' },
      {
        type: 'code',
        language: 'python',
        title: 'tests/test_posts.py',
        code: `from app.models import Post


def test_create_post(client, app):
    response = client.post("/posts/new", data={
        "title": "Testing Flask",
        "slug": "testing-flask",
        "body": "Tests protect behavior.",
    }, follow_redirects=True)

    assert response.status_code == 200

    with app.app_context():
        post = Post.query.filter_by(slug="testing-flask").first()
        assert post is not None
        assert post.title == "Testing Flask"`,
      },
      { type: 'h2', text: 'Authenticate a test client' },
      {
        type: 'code',
        language: 'python',
        title: 'tests/conftest.py',
        code: `from app.models import User


@pytest.fixture()
def user(app):
    with app.app_context():
        user = User(email="test@example.com")
        user.set_password("correct horse battery staple")
        db.session.add(user)
        db.session.commit()
        return user


@pytest.fixture()
def auth_client(client, user):
    client.post("/auth/login", data={
        "email": "test@example.com",
        "password": "correct horse battery staple",
    })
    return client`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'tests/test_dashboard.py',
        code: `def test_dashboard_requires_login(client):
    response = client.get("/dashboard/")
    assert response.status_code == 302
    assert "/auth/login" in response.headers["Location"]


def test_dashboard_for_logged_in_user(auth_client):
    response = auth_client.get("/dashboard/")
    assert response.status_code == 200`,
      },
      {
        type: 'tip',
        text: 'Prefer testing behavior over implementation details. A route test should assert response status, visible content, redirects, and database effects.',
      },
      {
        type: 'try',
        text: 'Write tests for deleting a post: anonymous users should redirect to login, the owner should delete successfully, and the database row should be gone.',
      },
      {
        type: 'keypoints',
        items: [
          'pytest fixtures keep Flask tests small and reusable.',
          'The app factory pattern lets tests use a temporary configuration.',
          'Use client.get() and client.post() to test routes.',
          'Assert both HTTP behavior and database state for important flows.',
        ],
      },
    ],
  },
  {
    slug: 'flask-hooks',
    title: 'before_request & Context Processors',
    description:
      'Use Flask request hooks and context processors to prepare request data and share template helpers.',
    level: 'intermediate',
    section: 'Quality',
    order: 47,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Flask hooks let you run code before or after requests. Context processors inject values into templates without passing them from every view.',
      },
      {
        type: 'p',
        text: 'Used carefully, hooks remove duplication. Used too broadly, they can hide expensive work that runs on every request.',
      },
      { type: 'h2', text: 'before_request for per-request setup' },
      {
        type: 'code',
        language: 'python',
        title: 'app/hooks.py',
        code: `from flask import g, request

from app.models import Category


def register_hooks(app):
    @app.before_request
    def load_request_id():
        g.request_id = request.headers.get("X-Request-ID")

    @app.before_request
    def load_categories():
        if request.endpoint and request.endpoint.startswith("posts."):
            g.categories = Category.query.order_by(Category.name).all()`,
      },
      {
        type: 'note',
        text: 'Use flask.g for request-scoped data. It is cleared after the request and is safer than storing request data in module globals.',
      },
      { type: 'h2', text: 'after_request for response changes' },
      {
        type: 'code',
        language: 'python',
        title: 'app/hooks.py',
        code: `def register_hooks(app):
    @app.after_request
    def add_security_headers(response):
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
        return response`,
      },
      { type: 'h2', text: 'teardown_request for cleanup' },
      {
        type: 'code',
        language: 'python',
        title: 'app/hooks.py',
        code: `def register_hooks(app):
    @app.teardown_request
    def close_external_client(error=None):
        client = g.pop("external_client", None)
        if client is not None:
            client.close()`,
      },
      {
        type: 'warning',
        text: 'teardown_request runs even if an exception happened. Keep teardown code defensive and do not rely on it to change the response.',
      },
      { type: 'h2', text: 'Context processors for templates' },
      {
        type: 'code',
        language: 'python',
        title: 'app/context.py',
        code: `from datetime import datetime


def register_context_processors(app):
    @app.context_processor
    def inject_globals():
        return {
            "current_year": datetime.utcnow().year,
            "site_name": "Flask Notes",
        }`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/base.html',
        code: `<footer>
  &copy; {{ current_year }} {{ site_name }}
</footer>`,
      },
      {
        type: 'tip',
        text: 'Context processors should return cheap, broadly useful values. If a value requires a database query, consider loading it only for the blueprint or route that needs it.',
      },
      {
        type: 'try',
        text: 'Add a context processor that injects a nav_links list, then render it from base.html.',
      },
      {
        type: 'keypoints',
        items: [
          'before_request runs before matching view logic for each request.',
          'after_request can modify the response before it is sent.',
          'teardown_request is useful for cleanup and runs after request handling.',
          'Context processors make template-wide values available automatically.',
        ],
      },
    ],
  },
  {
    slug: 'flask-extensions',
    title: 'Useful Flask Extensions',
    description:
      'Choose common Flask extensions for forms, auth, databases, APIs, admin panels, caching, and background jobs.',
    level: 'intermediate',
    section: 'Quality',
    order: 48,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'Flask is intentionally small. Extensions add focused capabilities while letting you choose the pieces your project needs.',
      },
      {
        type: 'p',
        text: 'A healthy extension fits your app, is actively maintained, supports current Flask versions, and has documentation you can trust.',
      },
      { type: 'h2', text: 'Common extension categories' },
      {
        type: 'table',
        headers: ['Need', 'Extension examples'],
        rows: [
          ['Database ORM', 'Flask-SQLAlchemy, SQLAlchemy'],
          ['Migrations', 'Flask-Migrate, Alembic'],
          ['Forms and CSRF', 'Flask-WTF, WTForms'],
          ['Login sessions', 'Flask-Login'],
          ['Admin interface', 'Flask-Admin'],
          ['APIs and schemas', 'Marshmallow, Flask-Smorest'],
          ['CORS', 'Flask-CORS'],
          ['Caching', 'Flask-Caching'],
          ['Email', 'Flask-Mailman'],
        ],
      },
      { type: 'h2', text: 'Initialize extensions consistently' },
      {
        type: 'code',
        language: 'python',
        title: 'app/extensions.py',
        code: `from flask_caching import Cache
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
cache = Cache()`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'app/__init__.py',
        code: `from .extensions import cache, db, login_manager, migrate


def create_app():
    app = Flask(__name__)

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    cache.init_app(app, config={"CACHE_TYPE": "SimpleCache"})

    return app`,
      },
      {
        type: 'note',
        text: 'Not every extension uses init_app(), but many Flask extensions do. Follow the extension documentation and keep initialization in one predictable place.',
      },
      { type: 'h2', text: 'Evaluate before installing' },
      {
        type: 'ul',
        items: [
          'Does it support your Flask and Python versions?',
          'Is it maintained and tested?',
          'Does it solve a real problem in your app?',
          'Can you replace it if the project becomes unmaintained?',
          'Does it add security-sensitive behavior you need to understand?',
        ],
      },
      { type: 'h2', text: 'Pin dependencies for applications' },
      {
        type: 'code',
        language: 'text',
        title: 'requirements.txt',
        code: `Flask
Flask-SQLAlchemy
Flask-Migrate
Flask-Login
Flask-WTF
Flask-Cors`,
      },
      {
        type: 'warning',
        text: 'An extension can save time, but it is still code running in your app. Read security notes for auth, admin, file upload, and API extensions before production use.',
      },
      {
        type: 'tip',
        text: 'Prefer extension APIs that match normal Flask patterns: app factories, blueprints, config keys, and test-friendly initialization.',
      },
      {
        type: 'try',
        text: 'Pick one feature from your app and decide whether to build it yourself or use an extension. Write down the trade-offs in maintenance, security, and complexity.',
      },
      {
        type: 'keypoints',
        items: [
          'Flask extensions add focused capabilities to the small Flask core.',
          'Choose maintained extensions that support modern Flask versions.',
          'Centralize extension objects in app/extensions.py when possible.',
          'Understand security-sensitive extensions before using them in production.',
        ],
      },
    ],
  },
];
