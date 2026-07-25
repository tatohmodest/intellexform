import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'django-cbv',
    title: 'Class-Based Views Intro',
    description:
      'Understand Django class-based views and rewrite common function views as reusable view classes.',
    level: 'intermediate',
    section: 'Views Deep Dive',
    order: 26,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Class-based views, often called CBVs, let you organize request handling into classes instead of plain functions. They are still normal Django views: a URL points to a callable, and Django passes an HttpRequest to it.',
      },
      {
        type: 'p',
        text: 'The main benefit is structure. A CBV gives named methods such as get() and post(), reusable attributes such as template_name, and extension points you can override as your pages grow.',
      },
      { type: 'h2', text: 'A function view first' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.shortcuts import render


def about(request):
    return render(request, "pages/about.html", {
        "company": "Acme Books",
    })`,
      },
      { type: 'h2', text: 'The same page as a class-based view' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.views import View
from django.shortcuts import render


class AboutView(View):
    template_name = "pages/about.html"

    def get(self, request):
        return render(request, self.template_name, {
            "company": "Acme Books",
        })`,
      },
      {
        type: 'p',
        text: 'A class view is connected to URLs with as_view(). This method creates the callable Django needs.',
      },
      {
        type: 'code',
        language: 'python',
        title: 'urls.py',
        code: `from django.urls import path

from .views import AboutView

urlpatterns = [
    path("about/", AboutView.as_view(), name="about"),
]`,
      },
      { type: 'h2', text: 'Handling GET and POST separately' },
      {
        type: 'p',
        text: 'With CBVs, HTTP methods become Python methods. That keeps form display and form submission logic in the same class without one large if request.method block.',
      },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.contrib import messages
from django.shortcuts import redirect, render
from django.views import View

from .forms import ContactForm


class ContactView(View):
    template_name = "contact.html"

    def get(self, request):
        return render(request, self.template_name, {"form": ContactForm()})

    def post(self, request):
        form = ContactForm(request.POST)
        if form.is_valid():
            form.send_email()
            messages.success(request, "Thanks, we received your message.")
            return redirect("contact")

        return render(request, self.template_name, {"form": form})`,
      },
      {
        type: 'note',
        text: 'Django creates a new view instance for each request, so request-specific data belongs on the method call, not in class attributes shared by everyone.',
      },
      {
        type: 'tip',
        text: 'Start with function views when the logic is tiny. Reach for CBVs when methods, shared attributes, or inheritance will make the view easier to extend.',
      },
      {
        type: 'try',
        text: 'Convert a simple function view named help_page into a HelpView class that renders help.html on GET, then connect it with HelpView.as_view().',
      },
      {
        type: 'keypoints',
        items: [
          'Class-based views are normal Django views exposed through as_view().',
          'HTTP methods map to methods such as get() and post().',
          'CBVs make repeated view behavior easier to share and override.',
          'Use instance methods and local variables for request-specific data.',
        ],
      },
    ],
  },
  {
    slug: 'django-generic-views',
    title: 'Generic List/Detail/Create/Update/Delete Views',
    description:
      'Use Django generic views to build common model pages with less repetitive code.',
    level: 'intermediate',
    section: 'Views Deep Dive',
    order: 27,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Generic views are class-based views that already know how to solve common web app tasks: list records, show one record, create records, update records, and delete records.',
      },
      {
        type: 'p',
        text: 'They are not magic replacements for learning views. They are shortcuts built on predictable conventions: set a model, choose a template, and override specific methods when the default behavior needs to change.',
      },
      { type: 'h2', text: 'A model to work with' },
      {
        type: 'code',
        language: 'python',
        title: 'models.py',
        code: `from django.conf import settings
from django.db import models
from django.urls import reverse


class Article(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("article-detail", kwargs={"pk": self.pk})`,
      },
      { type: 'h2', text: 'ListView and DetailView' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.views.generic import DetailView, ListView

from .models import Article


class ArticleListView(ListView):
    model = Article
    template_name = "articles/article_list.html"
    context_object_name = "articles"
    paginate_by = 10

    def get_queryset(self):
        return Article.objects.select_related("author").order_by("-created_at")


class ArticleDetailView(DetailView):
    model = Article
    template_name = "articles/article_detail.html"
    context_object_name = "article"`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/articles/article_list.html',
        code: `<h1>Articles</h1>

{% for article in articles %}
  <article>
    <h2><a href="{{ article.get_absolute_url }}">{{ article.title }}</a></h2>
    <p>By {{ article.author.username }}</p>
  </article>
{% empty %}
  <p>No articles yet.</p>
{% endfor %}`,
      },
      { type: 'h2', text: 'CreateView, UpdateView, and DeleteView' },
      {
        type: 'p',
        text: 'Editing generic views handle form display, validation, and saving. You decide which fields are editable and where the user goes after success.',
      },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView, DeleteView, UpdateView

from .models import Article


class ArticleCreateView(LoginRequiredMixin, CreateView):
    model = Article
    fields = ["title", "body"]
    template_name = "articles/article_form.html"

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)


class ArticleUpdateView(LoginRequiredMixin, UpdateView):
    model = Article
    fields = ["title", "body"]
    template_name = "articles/article_form.html"


class ArticleDeleteView(LoginRequiredMixin, DeleteView):
    model = Article
    template_name = "articles/article_confirm_delete.html"
    success_url = reverse_lazy("article-list")`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'urls.py',
        code: `from django.urls import path

from .views import (
    ArticleCreateView,
    ArticleDeleteView,
    ArticleDetailView,
    ArticleListView,
    ArticleUpdateView,
)

urlpatterns = [
    path("articles/", ArticleListView.as_view(), name="article-list"),
    path("articles/new/", ArticleCreateView.as_view(), name="article-create"),
    path("articles/<int:pk>/", ArticleDetailView.as_view(), name="article-detail"),
    path("articles/<int:pk>/edit/", ArticleUpdateView.as_view(), name="article-update"),
    path("articles/<int:pk>/delete/", ArticleDeleteView.as_view(), name="article-delete"),
]`,
      },
      {
        type: 'note',
        text: 'reverse_lazy is useful for class attributes because URL configuration may not be fully loaded when Python imports the view class.',
      },
      {
        type: 'tip',
        text: 'Override get_queryset() for list/detail filtering, form_valid() for save-time changes, and get_context_data() for extra template context.',
      },
      {
        type: 'try',
        text: 'Create a TaskListView and TaskDetailView for a Task model. Order tasks by due_date and show only tasks owned by request.user.',
      },
      {
        type: 'keypoints',
        items: [
          'Generic views provide built-in behavior for common model screens.',
          'ListView and DetailView display records; CreateView, UpdateView, and DeleteView modify records.',
          'Set model, template_name, context_object_name, fields, and success_url to control behavior.',
          'Override focused methods instead of rewriting the whole view.',
        ],
      },
    ],
  },
  {
    slug: 'django-mixins',
    title: 'Mixins & Reusable View Logic',
    description:
      'Share authentication, filtering, ownership, and context behavior across Django class-based views.',
    level: 'intermediate',
    section: 'Views Deep Dive',
    order: 28,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A mixin is a small class that adds one focused behavior to another class. Django uses mixins heavily for class-based views, especially auth and permission behavior.',
      },
      {
        type: 'p',
        text: 'Good mixins are narrow. They answer one question like "must the user be logged in?" or "should this queryset only include the current user\'s objects?"',
      },
      { type: 'h2', text: 'Built-in auth mixins' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView

from .models import Invoice


class InvoiceListView(LoginRequiredMixin, ListView):
    model = Invoice
    template_name = "billing/invoice_list.html"
    context_object_name = "invoices"

    def get_queryset(self):
        return Invoice.objects.filter(customer=self.request.user).order_by("-created_at")`,
      },
      {
        type: 'p',
        text: 'Mixin order matters. Put Django auth mixins before the generic view class so their dispatch() method can run before the request reaches the list, detail, or form logic.',
      },
      {
        type: 'code',
        language: 'python',
        title: 'Correct order',
        code: `class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = "dashboard.html"`,
      },
      { type: 'h2', text: 'Create a reusable owner queryset mixin' },
      {
        type: 'p',
        text: 'If several views need to filter records to the logged-in user, move that logic into a local mixin.',
      },
      {
        type: 'code',
        language: 'python',
        title: 'mixins.py',
        code: `class OwnerQuerySetMixin:
    owner_field = "owner"

    def get_queryset(self):
        queryset = super().get_queryset()
        filter_kwargs = {self.owner_field: self.request.user}
        return queryset.filter(**filter_kwargs)`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import DetailView, ListView

from .mixins import OwnerQuerySetMixin
from .models import Project


class ProjectListView(LoginRequiredMixin, OwnerQuerySetMixin, ListView):
    model = Project
    context_object_name = "projects"


class ProjectDetailView(LoginRequiredMixin, OwnerQuerySetMixin, DetailView):
    model = Project
    context_object_name = "project"`,
      },
      { type: 'h2', text: 'Add common context' },
      {
        type: 'code',
        language: 'python',
        title: 'mixins.py',
        code: `class AccountContextMixin:
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["active_account"] = self.request.user.account
        return context`,
      },
      {
        type: 'note',
        text: 'Mixins depend on cooperative inheritance. When you override a method that other classes may also use, call super() unless you intentionally want to stop the chain.',
      },
      {
        type: 'tip',
        text: 'Name mixins after behavior, such as OwnerQuerySetMixin or StaffRequiredMixin, not after pages, such as DashboardMixin.',
      },
      {
        type: 'try',
        text: 'Write a PublishedOnlyMixin that filters get_queryset() to published=True, then use it with a ListView and a DetailView.',
      },
      {
        type: 'keypoints',
        items: [
          'Mixins add one reusable behavior to class-based views.',
          'Place auth and behavior mixins before the generic view class.',
          'Use super() so multiple mixins can cooperate.',
          'Keep custom mixins focused and easy to test.',
        ],
      },
    ],
  },
  {
    slug: 'django-auth-users',
    title: 'Users & Authentication',
    description:
      'Use Django\'s built-in user system to check logged-in users and protect practical views.',
    level: 'intermediate',
    section: 'Auth & Permissions',
    order: 29,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Django includes a complete authentication system: users, password hashing, sessions, login/logout helpers, decorators, mixins, and forms. You do not need to build password storage yourself.',
      },
      {
        type: 'p',
        text: 'The current user is available as request.user. Anonymous visitors get an AnonymousUser object, while signed-in visitors get a User object from your authentication backend.',
      },
      { type: 'h2', text: 'Check the current user in a view' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.contrib.auth.decorators import login_required
from django.shortcuts import render


def home(request):
    return render(request, "home.html")


@login_required
def dashboard(request):
    return render(request, "accounts/dashboard.html", {
        "profile_name": request.user.get_username(),
    })`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/base.html',
        code: `<nav>
  <a href="{% url 'home' %}">Home</a>

  {% if user.is_authenticated %}
    <a href="{% url 'dashboard' %}">Dashboard</a>
    <span>Signed in as {{ user.get_username }}</span>
  {% else %}
    <a href="{% url 'login' %}">Log in</a>
  {% endif %}
</nav>`,
      },
      { type: 'h2', text: 'Configure auth redirects' },
      {
        type: 'p',
        text: 'Django needs to know where to send users for login and where to redirect after login or logout. Put these settings in your project settings file.',
      },
      {
        type: 'code',
        language: 'python',
        title: 'settings.py',
        code: `LOGIN_URL = "login"
LOGIN_REDIRECT_URL = "dashboard"
LOGOUT_REDIRECT_URL = "home"`,
      },
      { type: 'h2', text: 'Use the user model correctly' },
      {
        type: 'p',
        text: 'When you connect your models to users, prefer settings.AUTH_USER_MODEL instead of importing User directly. This keeps your app compatible with custom user models.',
      },
      {
        type: 'code',
        language: 'python',
        title: 'models.py',
        code: `from django.conf import settings
from django.db import models


class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title`,
      },
      {
        type: 'note',
        text: 'Passwords are stored as secure hashes, not plain text. Always create or change passwords through Django APIs such as create_user(), set_password(), or the built-in forms.',
      },
      {
        type: 'tip',
        text: 'Use request.user.is_authenticated in templates and views when you only need to branch UI. Use login_required or LoginRequiredMixin when the whole view must be protected.',
      },
      {
        type: 'try',
        text: 'Create a protected profile view that displays request.user.email and redirects anonymous users to your login page.',
      },
      {
        type: 'keypoints',
        items: [
          'Django auth gives you users, password hashing, sessions, forms, and helpers.',
          'request.user represents either the signed-in user or AnonymousUser.',
          'Protect function views with login_required and CBVs with LoginRequiredMixin.',
          'Use settings.AUTH_USER_MODEL for model relationships to users.',
        ],
      },
    ],
  },
  {
    slug: 'django-login-logout',
    title: 'Login, Logout & Signup Flows',
    description:
      'Build practical login, logout, and signup pages using Django auth views and forms.',
    level: 'intermediate',
    section: 'Auth & Permissions',
    order: 30,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Django ships with secure login and logout views. You provide URL routes and templates, while Django handles password checking, session creation, and session cleanup.',
      },
      {
        type: 'p',
        text: 'A complete auth flow usually includes login, logout, signup, protected pages, redirect settings, and template links that change based on user.is_authenticated.',
      },
      { type: 'h2', text: 'Project URLs for auth' },
      {
        type: 'code',
        language: 'python',
        title: 'urls.py',
        code: `from django.contrib.auth import views as auth_views
from django.urls import path

from accounts.views import SignUpView, dashboard

urlpatterns = [
    path("accounts/login/", auth_views.LoginView.as_view(
        template_name="registration/login.html",
    ), name="login"),
    path("accounts/logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("accounts/signup/", SignUpView.as_view(), name="signup"),
    path("dashboard/", dashboard, name="dashboard"),
]`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'settings.py',
        code: `LOGIN_URL = "login"
LOGIN_REDIRECT_URL = "dashboard"
LOGOUT_REDIRECT_URL = "home"`,
      },
      { type: 'h2', text: 'Login template' },
      {
        type: 'code',
        language: 'html',
        title: 'templates/registration/login.html',
        code: `<h1>Log in</h1>

{% if form.errors %}
  <p class="error">Your username and password did not match.</p>
{% endif %}

<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Log in</button>
</form>

<p>
  Need an account?
  <a href="{% url 'signup' %}">Sign up</a>
</p>`,
      },
      { type: 'h2', text: 'Logout with POST' },
      {
        type: 'p',
        text: 'Modern Django encourages logout through POST so another site cannot log a user out by making them load an image or link.',
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/base.html',
        code: `{% if user.is_authenticated %}
  <form method="post" action="{% url 'logout' %}">
    {% csrf_token %}
    <button type="submit">Log out</button>
  </form>
{% else %}
  <a href="{% url 'login' %}">Log in</a>
{% endif %}`,
      },
      { type: 'h2', text: 'Signup with UserCreationForm' },
      {
        type: 'code',
        language: 'python',
        title: 'accounts/views.py',
        code: `from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView


class SignUpView(CreateView):
    form_class = UserCreationForm
    template_name = "registration/signup.html"
    success_url = reverse_lazy("dashboard")

    def form_valid(self, form):
        response = super().form_valid(form)
        login(self.request, self.object)
        return response`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/registration/signup.html',
        code: `<h1>Create an account</h1>

<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Sign up</button>
</form>`,
      },
      {
        type: 'note',
        text: 'LoginView automatically supports a next query parameter, so users can be sent back to the protected page they originally requested.',
      },
      {
        type: 'tip',
        text: 'Keep templates in templates/registration/ when you use Django auth conventions. Many built-in auth views look there by default.',
      },
      {
        type: 'try',
        text: 'Add a protected settings page. Visit it while logged out, sign in, and confirm Django redirects you back using the next parameter.',
      },
      {
        type: 'keypoints',
        items: [
          'Use Django LoginView and LogoutView for secure built-in auth behavior.',
          'Provide templates and redirect settings to shape the user flow.',
          'Use POST plus CSRF protection for logout actions.',
          'UserCreationForm is a quick starting point for a signup page.',
        ],
      },
    ],
  },
  {
    slug: 'django-permissions',
    title: 'Permissions & User Passes Test',
    description:
      'Protect views with permissions, groups, user_passes_test, and class-based auth mixins.',
    level: 'intermediate',
    section: 'Auth & Permissions',
    order: 31,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Authentication answers "who is this user?" Permissions answer "what is this user allowed to do?" Django creates add, change, delete, and view permissions for each model by default.',
      },
      {
        type: 'p',
        text: 'You can assign permissions directly to users, assign them through groups, or write custom checks for business rules that do not fit model permissions.',
      },
      { type: 'h2', text: 'Model permissions in function views' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.contrib.auth.decorators import login_required, permission_required
from django.shortcuts import render

from .models import Report


@login_required
@permission_required("reports.view_report", raise_exception=True)
def report_list(request):
    reports = Report.objects.order_by("-created_at")
    return render(request, "reports/report_list.html", {"reports": reports})`,
      },
      {
        type: 'p',
        text: 'The permission name uses app_label.action_modelname. For a Report model in a reports app, the view permission is reports.view_report.',
      },
      { type: 'h2', text: 'Permissions in class-based views' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.views.generic import UpdateView

from .models import Report


class ReportUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Report
    fields = ["title", "status", "summary"]
    permission_required = "reports.change_report"
    template_name = "reports/report_form.html"`,
      },
      { type: 'h2', text: 'Custom tests for special rules' },
      {
        type: 'p',
        text: 'Some checks are not just permissions. For example, staff-only dashboards or email-domain rules can use user_passes_test.',
      },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render


def is_support_member(user):
    return user.is_authenticated and user.groups.filter(name="Support").exists()


@user_passes_test(is_support_member)
def support_queue(request):
    return render(request, "support/queue.html")`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'A class-based test',
        code: `from django.contrib.auth.mixins import UserPassesTestMixin
from django.views.generic import TemplateView


class StaffDashboardView(UserPassesTestMixin, TemplateView):
    template_name = "staff/dashboard.html"

    def test_func(self):
        return self.request.user.is_staff`,
      },
      {
        type: 'note',
        text: 'Use raise_exception=True when you want unauthorized logged-in users to receive a 403 Forbidden response instead of being redirected to login.',
      },
      {
        type: 'tip',
        text: 'Groups are usually easier to manage than assigning individual permissions one user at a time. Create groups such as Editors, Support, or Billing Managers.',
      },
      {
        type: 'try',
        text: 'Protect an ArticleUpdateView so only users with blog.change_article can edit articles. Then add a separate user_passes_test check for staff-only analytics.',
      },
      {
        type: 'keypoints',
        items: [
          'Authentication identifies a user; permissions decide allowed actions.',
          'Django creates default model permissions for add, change, delete, and view.',
          'Use permission_required or PermissionRequiredMixin for model permissions.',
          'Use user_passes_test or UserPassesTestMixin for custom business rules.',
        ],
      },
    ],
  },
  {
    slug: 'django-password-reset',
    title: 'Password Reset Flow',
    description:
      'Wire Django\'s built-in password reset views with email settings and templates.',
    level: 'intermediate',
    section: 'Auth & Permissions',
    order: 32,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Password reset is a multi-step flow: the user enters an email, Django sends a signed reset link, the user chooses a new password, and Django confirms the change.',
      },
      {
        type: 'p',
        text: 'Django provides the views and forms. Your job is to add URLs, templates, and email backend settings appropriate for development or production.',
      },
      { type: 'h2', text: 'Add reset URLs' },
      {
        type: 'code',
        language: 'python',
        title: 'urls.py',
        code: `from django.contrib.auth import views as auth_views
from django.urls import path

urlpatterns = [
    path("accounts/password-reset/", auth_views.PasswordResetView.as_view(
        template_name="registration/password_reset_form.html",
        email_template_name="registration/password_reset_email.html",
        subject_template_name="registration/password_reset_subject.txt",
    ), name="password_reset"),
    path("accounts/password-reset/done/", auth_views.PasswordResetDoneView.as_view(
        template_name="registration/password_reset_done.html",
    ), name="password_reset_done"),
    path("accounts/reset/<uidb64>/<token>/", auth_views.PasswordResetConfirmView.as_view(
        template_name="registration/password_reset_confirm.html",
    ), name="password_reset_confirm"),
    path("accounts/reset/done/", auth_views.PasswordResetCompleteView.as_view(
        template_name="registration/password_reset_complete.html",
    ), name="password_reset_complete"),
]`,
      },
      { type: 'h2', text: 'Development email backend' },
      {
        type: 'p',
        text: 'During local development, print emails to the terminal. This lets you copy the reset link without configuring a real mail provider.',
      },
      {
        type: 'code',
        language: 'python',
        title: 'settings.py',
        code: `EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
DEFAULT_FROM_EMAIL = "noreply@example.com"`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/registration/password_reset_form.html',
        code: `<h1>Reset your password</h1>
<p>Enter your account email and we will send reset instructions.</p>

<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Send reset email</button>
</form>`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'templates/registration/password_reset_subject.txt',
        code: `Reset your password`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'templates/registration/password_reset_email.html',
        code: `Hello,

Use this link to reset your password:
{{ protocol }}://{{ domain }}{% url 'password_reset_confirm' uidb64=uid token=token %}

If you did not request this, you can ignore this email.`,
      },
      { type: 'h2', text: 'New password template' },
      {
        type: 'code',
        language: 'html',
        title: 'templates/registration/password_reset_confirm.html',
        code: `<h1>Choose a new password</h1>

{% if validlink %}
  <form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Change password</button>
  </form>
{% else %}
  <p>This reset link is invalid or has expired.</p>
{% endif %}`,
      },
      {
        type: 'note',
        text: 'Django password reset links contain a signed token. You should still serve the site over HTTPS in production so reset links and sessions are protected in transit.',
      },
      {
        type: 'tip',
        text: 'Keep reset messages generic. Do not reveal whether an email address exists in your system.',
      },
      {
        type: 'try',
        text: 'Enable the console email backend, request a password reset for a test user, copy the terminal link, and complete the reset in your browser.',
      },
      {
        type: 'keypoints',
        items: [
          'Django provides built-in views for the full password reset flow.',
          'You need URL patterns, templates, and email settings.',
          'Use the console email backend during local development.',
          'Production password reset should run over HTTPS with a real email backend.',
        ],
      },
    ],
  },
  {
    slug: 'django-sessions-cookies',
    title: 'Sessions & Cookies',
    description:
      'Store per-browser state safely with Django sessions and understand how cookies fit in.',
    level: 'intermediate',
    section: 'Auth & Permissions',
    order: 33,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'HTTP is stateless: each request is separate. Cookies and sessions let a web app remember information between requests, such as a logged-in user or a shopping cart ID.',
      },
      {
        type: 'p',
        text: 'A cookie is stored in the browser. A session usually stores data on the server and gives the browser a small session key cookie. Django uses sessions for authentication.',
      },
      { type: 'h2', text: 'Store simple session data' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.shortcuts import redirect, render


def choose_theme(request):
    if request.method == "POST":
        request.session["theme"] = request.POST.get("theme", "light")
        return redirect("home")

    return render(request, "settings/theme.html")


def home(request):
    theme = request.session.get("theme", "light")
    return render(request, "home.html", {"theme": theme})`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/settings/theme.html',
        code: `<h1>Choose a theme</h1>

<form method="post">
  {% csrf_token %}
  <button name="theme" value="light">Light</button>
  <button name="theme" value="dark">Dark</button>
</form>`,
      },
      { type: 'h2', text: 'A small cart example' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.shortcuts import get_object_or_404, redirect

from .models import Product


def add_to_cart(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    cart = request.session.get("cart", {})

    product_key = str(product.pk)
    cart[product_key] = cart.get(product_key, 0) + 1

    request.session["cart"] = cart
    return redirect("cart-detail")`,
      },
      { type: 'h2', text: 'Cookie settings to know' },
      {
        type: 'code',
        language: 'python',
        title: 'settings.py',
        code: `SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG`,
      },
      {
        type: 'note',
        text: 'Session data should be small and serializable. Store IDs and preferences, not large objects or sensitive payment details.',
      },
      {
        type: 'tip',
        text: 'When you mutate a nested session object in place, reassign it back to request.session or set request.session.modified = True so Django knows it changed.',
      },
      {
        type: 'try',
        text: 'Build a recently_viewed session list that stores the last five product IDs a visitor opened.',
      },
      {
        type: 'keypoints',
        items: [
          'Cookies live in the browser; sessions usually store data server-side.',
          'Django authentication relies on sessions.',
          'Use request.session like a dictionary for small per-browser state.',
          'Secure session cookies with HttpOnly, SameSite, and Secure settings.',
        ],
      },
    ],
  },
  {
    slug: 'django-queryset-advanced',
    title: 'Advanced QuerySets & Lookups',
    description:
      'Filter, combine, slice, and inspect QuerySets using Django ORM lookups and Q objects.',
    level: 'intermediate',
    section: 'ORM Power',
    order: 34,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'A QuerySet represents a database query. It is lazy, which means Django usually does not hit the database until you iterate over it, slice it, count it, or otherwise ask for results.',
      },
      {
        type: 'p',
        text: 'Intermediate Django work often means composing precise QuerySets: multiple filters, relationship lookups, OR conditions, exclusions, ordering, and limiting results.',
      },
      { type: 'h2', text: 'Useful field lookups' },
      {
        type: 'code',
        language: 'python',
        title: 'Example lookups',
        code: `from datetime import date

from shop.models import Product

active_products = Product.objects.filter(is_active=True)
python_books = Product.objects.filter(title__icontains="python")
cheap_products = Product.objects.filter(price__lt=25)
recent_products = Product.objects.filter(created_at__date__gte=date(2026, 1, 1))
uncategorized = Product.objects.filter(category__isnull=True)`,
      },
      {
        type: 'table',
        headers: ['Lookup', 'Meaning'],
        rows: [
          ['icontains', 'Case-insensitive text contains'],
          ['lt / lte / gt / gte', 'Less than, less than or equal, greater than, greater than or equal'],
          ['in', 'Value appears in a list'],
          ['isnull', 'Field is or is not NULL'],
          ['date / year / month', 'Extract parts of dates and datetimes'],
        ],
      },
      { type: 'h2', text: 'Combine conditions with Q' },
      {
        type: 'code',
        language: 'python',
        title: 'OR and NOT queries',
        code: `from django.db.models import Q

from shop.models import Product

queryset = Product.objects.filter(
    Q(title__icontains="django") | Q(description__icontains="django"),
    is_active=True,
).exclude(stock=0)`,
      },
      { type: 'h2', text: 'Relationship lookups' },
      {
        type: 'code',
        language: 'python',
        title: 'Crossing relationships',
        code: `from orders.models import Order

orders = Order.objects.filter(
    customer__email__icontains="@example.com",
    lines__product__category__slug="books",
).distinct()`,
      },
      { type: 'h2', text: 'Order and slice results' },
      {
        type: 'code',
        language: 'python',
        title: 'Top results',
        code: `top_products = (
    Product.objects
    .filter(is_active=True)
    .order_by("-rating", "title")[:10]
)`,
      },
      {
        type: 'note',
        text: 'QuerySets are chainable and usually lazy. Printing the SQL with str(queryset.query) can help you understand what Django will send to the database.',
      },
      {
        type: 'tip',
        text: 'Use distinct() when filtering across reverse or many-to-many relationships can produce duplicate parent rows.',
      },
      {
        type: 'try',
        text: 'Write a QuerySet for active products that are either under 20 dollars or tagged "sale", ordered by newest first.',
      },
      {
        type: 'keypoints',
        items: [
          'QuerySets are lazy, chainable database queries.',
          'Double-underscore lookups express comparisons and relationship traversal.',
          'Q objects let you build OR and NOT conditions.',
          'Use order_by(), slicing, and distinct() to shape result sets.',
        ],
      },
    ],
  },
  {
    slug: 'django-aggregates',
    title: 'annotate, aggregate & F()',
    description:
      'Calculate totals, counts, and database-side expressions with Django ORM aggregation tools.',
    level: 'intermediate',
    section: 'ORM Power',
    order: 35,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'The ORM can ask the database to calculate values for you. This is faster and safer than loading every row into Python when you only need a count, total, average, or derived value.',
      },
      {
        type: 'p',
        text: 'Use aggregate() for one summary result. Use annotate() to add calculated values to each row in a QuerySet. Use F() when a query should refer to another database field.',
      },
      { type: 'h2', text: 'aggregate() returns one summary dictionary' },
      {
        type: 'code',
        language: 'python',
        title: 'Order totals',
        code: `from django.db.models import Avg, Count, Sum

from orders.models import Order

summary = Order.objects.filter(status="paid").aggregate(
    total_revenue=Sum("total"),
    average_order=Avg("total"),
    order_count=Count("id"),
)

print(summary["total_revenue"])`,
      },
      { type: 'h2', text: 'annotate() adds values per row' },
      {
        type: 'code',
        language: 'python',
        title: 'Authors with article counts',
        code: `from django.contrib.auth import get_user_model
from django.db.models import Count

User = get_user_model()

authors = User.objects.annotate(
    article_count=Count("article")
).order_by("-article_count")

for author in authors:
    print(author.username, author.article_count)`,
      },
      { type: 'h2', text: 'F() compares or updates using fields' },
      {
        type: 'code',
        language: 'python',
        title: 'Database-side field expressions',
        code: `from django.db.models import F

from shop.models import Product

low_stock = Product.objects.filter(stock__lt=F("reorder_level"))

Product.objects.filter(pk=42).update(
    stock=F("stock") - 1
)`,
      },
      {
        type: 'p',
        text: 'The update above happens inside the database. It avoids a common race where two requests read the same old stock value, subtract one in Python, and save the same result.',
      },
      { type: 'h2', text: 'Conditional aggregation' },
      {
        type: 'code',
        language: 'python',
        title: 'Counting specific rows',
        code: `from django.db.models import Count, Q

from shop.models import Category

categories = Category.objects.annotate(
    active_products=Count("product", filter=Q(product__is_active=True)),
    draft_products=Count("product", filter=Q(product__is_active=False)),
)`,
      },
      {
        type: 'note',
        text: 'Aggregation names become dictionary keys or object attributes. Use clear aliases such as total_revenue instead of relying on default names like total__sum.',
      },
      {
        type: 'tip',
        text: 'Check generated SQL when annotations surprise you. Relationship joins can affect counts; distinct=True may be needed for some Count annotations.',
      },
      {
        type: 'try',
        text: 'Annotate each Project with task_count and completed_task_count, then order projects by the number of incomplete tasks.',
      },
      {
        type: 'keypoints',
        items: [
          'aggregate() returns one summary result for the whole QuerySet.',
          'annotate() adds calculated values to each row.',
          'F() lets the database compare or update using field values.',
          'Conditional aggregates use filter= with Q objects.',
        ],
      },
    ],
  },
  {
    slug: 'django-select-prefetch',
    title: 'select_related & prefetch_related',
    description:
      'Avoid N+1 queries by loading related data efficiently with select_related and prefetch_related.',
    level: 'intermediate',
    section: 'ORM Power',
    order: 36,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'An N+1 query problem happens when one query loads a list, then each row triggers another query for related data. It can turn one page into dozens or hundreds of database queries.',
      },
      {
        type: 'p',
        text: 'Django gives two main tools for this: select_related() for single-valued relationships and prefetch_related() for multi-valued relationships.',
      },
      { type: 'h2', text: 'The N+1 problem' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.shortcuts import render

from .models import Book


def book_list(request):
    books = Book.objects.order_by("title")
    return render(request, "books/book_list.html", {"books": books})`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/books/book_list.html',
        code: `{% for book in books %}
  <h2>{{ book.title }}</h2>
  <p>Author: {{ book.author.name }}</p>
{% endfor %}`,
      },
      {
        type: 'p',
        text: 'If author is a ForeignKey, the template can cause one extra query per book unless the author was loaded with the original query.',
      },
      { type: 'h2', text: 'Use select_related for ForeignKey and OneToOneField' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `def book_list(request):
    books = Book.objects.select_related("author").order_by("title")
    return render(request, "books/book_list.html", {"books": books})`,
      },
      { type: 'h2', text: 'Use prefetch_related for many relationships' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `def author_list(request):
    authors = Author.objects.prefetch_related("books").order_by("name")
    return render(request, "authors/author_list.html", {"authors": authors})`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/authors/author_list.html',
        code: `{% for author in authors %}
  <h2>{{ author.name }}</h2>
  <ul>
    {% for book in author.books.all %}
      <li>{{ book.title }}</li>
    {% endfor %}
  </ul>
{% endfor %}`,
      },
      { type: 'h2', text: 'Custom prefetch query' },
      {
        type: 'code',
        language: 'python',
        title: 'Prefetch only published books',
        code: `from django.db.models import Prefetch

authors = Author.objects.prefetch_related(
    Prefetch(
        "books",
        queryset=Book.objects.filter(is_published=True).order_by("-published_at"),
        to_attr="published_books",
    )
)`,
      },
      {
        type: 'note',
        text: 'select_related uses SQL joins and is best for one related object per row. prefetch_related uses separate queries and joins the results in Python.',
      },
      {
        type: 'tip',
        text: 'Use Django Debug Toolbar during development to see query counts and catch N+1 problems before they reach production.',
      },
      {
        type: 'try',
        text: 'Optimize a blog post list that shows each post author and all tags. Use select_related for the author and prefetch_related for the tags.',
      },
      {
        type: 'keypoints',
        items: [
          'N+1 queries happen when related data is fetched row by row.',
          'select_related is for ForeignKey and OneToOneField relationships.',
          'prefetch_related is for many-to-many and reverse foreign key relationships.',
          'Prefetch lets you customize the related query and store it with to_attr.',
        ],
      },
    ],
  },
  {
    slug: 'django-managers',
    title: 'Custom Managers & QuerySets',
    description:
      'Move reusable ORM filters and domain-specific query methods into managers and QuerySets.',
    level: 'intermediate',
    section: 'ORM Power',
    order: 37,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'As an app grows, the same filters appear in many views: published posts, active subscriptions, unpaid invoices, visible projects. Custom QuerySets and managers give those queries names.',
      },
      {
        type: 'p',
        text: 'A QuerySet method should return another QuerySet so it can be chained. A manager is the object you access as Model.objects, and it exposes those methods from the model class.',
      },
      { type: 'h2', text: 'Create a custom QuerySet' },
      {
        type: 'code',
        language: 'python',
        title: 'models.py',
        code: `from django.db import models
from django.utils import timezone


class PostQuerySet(models.QuerySet):
    def published(self):
        return self.filter(status=Post.Status.PUBLISHED, published_at__lte=timezone.now())

    def by_author(self, user):
        return self.filter(author=user)

    def search(self, term):
        return self.filter(title__icontains=term) | self.filter(body__icontains=term)


class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    title = models.CharField(max_length=200)
    body = models.TextField()
    author = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    published_at = models.DateTimeField(null=True, blank=True)

    objects = PostQuerySet.as_manager()`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'Using the methods',
        code: `posts = Post.objects.published().select_related("author")
my_posts = Post.objects.by_author(request.user).published()
results = Post.objects.published().search("django")`,
      },
      { type: 'h2', text: 'When you need a Manager class' },
      {
        type: 'p',
        text: 'as_manager() is enough for many apps. Use a custom Manager class when you need manager-only methods, multiple managers, or special creation helpers.',
      },
      {
        type: 'code',
        language: 'python',
        title: 'models.py',
        code: `class TeamManager(models.Manager):
    def create_with_owner(self, *, name, owner):
        team = self.create(name=name)
        team.members.create(user=owner, role="owner")
        return team


class Team(models.Model):
    name = models.CharField(max_length=120)

    objects = TeamManager()`,
      },
      { type: 'h2', text: 'Use managers in views' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.views.generic import ListView

from .models import Post


class PublishedPostListView(ListView):
    model = Post
    context_object_name = "posts"

    def get_queryset(self):
        return Post.objects.published().select_related("author")`,
      },
      {
        type: 'note',
        text: 'The first manager declared on a model can become the default manager. Be careful if you make it filter rows by default, because admin and related queries may also use it.',
      },
      {
        type: 'tip',
        text: 'Put query logic on QuerySets when you want chaining. Put creation workflows or manager-only entry points on Managers.',
      },
      {
        type: 'try',
        text: 'Create an InvoiceQuerySet with unpaid(), overdue(), and for_customer(user) methods, then use it in a customer invoice list view.',
      },
      {
        type: 'keypoints',
        items: [
          'Custom QuerySets give reusable filters readable names.',
          'QuerySet methods should usually return QuerySets so they can chain.',
          'as_manager() exposes QuerySet methods through Model.objects.',
          'Custom managers are useful for creation helpers and special entry points.',
        ],
      },
    ],
  },
  {
    slug: 'django-media',
    title: 'Media Uploads & FileFields',
    description:
      'Accept user-uploaded files with FileField, ImageField, forms, templates, and development media URLs.',
    level: 'intermediate',
    section: 'Files & Media',
    order: 38,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Static files are assets you ship with your app, such as CSS and JavaScript. Media files are uploaded by users, such as avatars, PDFs, and product photos.',
      },
      {
        type: 'p',
        text: 'Django stores upload paths in the database and file bytes in your configured storage. In development, files often live under MEDIA_ROOT. In production, use durable storage such as S3-compatible object storage.',
      },
      { type: 'h2', text: 'Configure media in development' },
      {
        type: 'code',
        language: 'python',
        title: 'settings.py',
        code: `from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'project urls.py',
        code: `from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("profiles.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)`,
      },
      { type: 'h2', text: 'Add an upload field' },
      {
        type: 'code',
        language: 'python',
        title: 'models.py',
        code: `from django.conf import settings
from django.db import models


def avatar_upload_path(instance, filename):
    return f"avatars/user_{instance.user_id}/{filename}"


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to=avatar_upload_path, blank=True)`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'forms.py',
        code: `from django import forms

from .models import Profile


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ["bio", "avatar"]`,
      },
      { type: 'h2', text: 'Handle multipart forms' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

from .forms import ProfileForm


@login_required
def edit_profile(request):
    profile = request.user.profile

    if request.method == "POST":
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            return redirect("profile-detail")
    else:
        form = ProfileForm(instance=profile)

    return render(request, "profiles/profile_form.html", {"form": form})`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/profiles/profile_form.html',
        code: `<h1>Edit profile</h1>

<form method="post" enctype="multipart/form-data">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Save profile</button>
</form>`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'Display an uploaded image',
        code: `{% if profile.avatar %}
  <img src="{{ profile.avatar.url }}" alt="{{ profile.user.username }} avatar">
{% endif %}`,
      },
      {
        type: 'note',
        text: 'ImageField requires Pillow to be installed. If you do not need image validation, FileField can store any uploaded file path.',
      },
      {
        type: 'tip',
        text: 'Validate file size and content type for user uploads, especially when files are public or processed later.',
      },
      {
        type: 'try',
        text: 'Add a resume FileField to a Profile model, create a ModelForm for it, and render a download link when a resume exists.',
      },
      {
        type: 'keypoints',
        items: [
          'Static files are app assets; media files are user uploads.',
          'MEDIA_URL and MEDIA_ROOT configure development media serving.',
          'File upload forms need enctype="multipart/form-data" and request.FILES.',
          'Use production-ready external storage for deployed user uploads.',
        ],
      },
    ],
  },
  {
    slug: 'django-signals',
    title: 'Signals (Practical Use)',
    description:
      'Use Django signals carefully for side effects such as creating profiles and reacting to saves.',
    level: 'intermediate',
    section: 'App Internals',
    order: 39,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Signals let parts of a Django app react when something happens elsewhere. Common examples include creating a profile after a user is created or clearing a cache after a model changes.',
      },
      {
        type: 'p',
        text: 'Signals are powerful, but hidden behavior can be hard to follow. Use them for cross-cutting side effects, not for core business logic that should be explicit in a view, form, or service function.',
      },
      { type: 'h2', text: 'Create a profile when a user is created' },
      {
        type: 'code',
        language: 'python',
        title: 'profiles/models.py',
        code: `from django.conf import settings
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=120, blank=True)`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'profiles/signals.py',
        code: `from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Profile


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_profile_for_new_user(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)`,
      },
      { type: 'h2', text: 'Load signal handlers in AppConfig' },
      {
        type: 'code',
        language: 'python',
        title: 'profiles/apps.py',
        code: `from django.apps import AppConfig


class ProfilesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "profiles"

    def ready(self):
        import profiles.signals`,
      },
      {
        type: 'p',
        text: 'Importing signals in ready() ensures Django registers the receiver when the app starts. Without this import, the signal function may never connect.',
      },
      { type: 'h2', text: 'A cache invalidation example' },
      {
        type: 'code',
        language: 'python',
        title: 'signals.py',
        code: `from django.core.cache import cache
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Product


@receiver([post_save, post_delete], sender=Product)
def clear_product_cache(sender, instance, **kwargs):
    cache.delete("featured_products")`,
      },
      {
        type: 'note',
        text: 'Signal receivers run during the same request or command unless you hand work to a background job. Slow email, API, or image processing work should not happen directly in a signal.',
      },
      {
        type: 'tip',
        text: 'Give signal functions specific names. create_profile_for_new_user is easier to debug than handle_user_save.',
      },
      {
        type: 'try',
        text: 'Write a post_save signal that creates a Notification when a Comment is created, then register it from the app config ready() method.',
      },
      {
        type: 'keypoints',
        items: [
          'Signals let code react to events such as model saves and deletes.',
          'Register receivers by importing them in AppConfig.ready().',
          'Use signals for side effects, not hidden core workflow decisions.',
          'Keep receivers fast and hand slow work to background processing.',
        ],
      },
    ],
  },
  {
    slug: 'django-middleware',
    title: 'Middleware Basics',
    description:
      'Understand Django middleware and write small request/response hooks for cross-cutting behavior.',
    level: 'intermediate',
    section: 'App Internals',
    order: 40,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Middleware is code that wraps every request and response. Django uses middleware for security headers, sessions, CSRF protection, authentication, messages, and more.',
      },
      {
        type: 'p',
        text: 'Custom middleware is useful for behavior that applies across many views, such as request logging, tenant selection, or adding response headers.',
      },
      { type: 'h2', text: 'A simple modern middleware class' },
      {
        type: 'code',
        language: 'python',
        title: 'core/middleware.py',
        code: `import time


class RequestTimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        started = time.perf_counter()
        response = self.get_response(request)
        elapsed_ms = (time.perf_counter() - started) * 1000
        response["X-Response-Time-Ms"] = f"{elapsed_ms:.1f}"
        return response`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'settings.py',
        code: `MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "core.middleware.RequestTimingMiddleware",
]`,
      },
      { type: 'h2', text: 'Middleware order matters' },
      {
        type: 'p',
        text: 'Request middleware runs from top to bottom. Response middleware unwinds from bottom to top. That means later middleware can depend on work done by earlier middleware.',
      },
      {
        type: 'table',
        headers: ['Middleware', 'Why order matters'],
        rows: [
          ['SessionMiddleware', 'Must run before AuthenticationMiddleware because auth uses sessions'],
          ['CsrfViewMiddleware', 'Needs to see requests before unsafe POST handling reaches views'],
          ['MessageMiddleware', 'Uses sessions or cookies to store messages'],
          ['SecurityMiddleware', 'Runs early to add security behavior'],
        ],
      },
      { type: 'h2', text: 'Short-circuit a request' },
      {
        type: 'code',
        language: 'python',
        title: 'maintenance middleware',
        code: `from django.http import HttpResponse
from django.conf import settings


class MaintenanceModeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if settings.MAINTENANCE_MODE and not request.user.is_staff:
            return HttpResponse("Site maintenance in progress.", status=503)

        return self.get_response(request)`,
      },
      {
        type: 'note',
        text: 'If middleware needs request.user, it must appear after AuthenticationMiddleware in the MIDDLEWARE list.',
      },
      {
        type: 'tip',
        text: 'Keep middleware small. If the logic only applies to one view, a decorator, mixin, or helper function is usually clearer.',
      },
      {
        type: 'try',
        text: 'Write middleware that adds an X-App-Version response header using a value from settings.APP_VERSION.',
      },
      {
        type: 'keypoints',
        items: [
          'Middleware wraps request and response processing for the whole app.',
          'Modern middleware is usually a class with __init__ and __call__.',
          'Middleware order affects what data is available and when hooks run.',
          'Use middleware for cross-cutting behavior shared by many views.',
        ],
      },
    ],
  },
  {
    slug: 'django-context-processors',
    title: 'Context Processors',
    description:
      'Add shared template variables with context processors while keeping global context lean.',
    level: 'intermediate',
    section: 'App Internals',
    order: 41,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'A context processor is a function that adds variables to every template rendered with a RequestContext. Django uses them for variables such as user, messages, and request.',
      },
      {
        type: 'p',
        text: 'They are helpful for truly global template data like navigation settings, feature flags, or support contact information. They should not become a dumping ground for page-specific data.',
      },
      { type: 'h2', text: 'Write a context processor' },
      {
        type: 'code',
        language: 'python',
        title: 'core/context_processors.py',
        code: `from django.conf import settings


def site_settings(request):
    return {
        "site_name": getattr(settings, "SITE_NAME", "My Django Site"),
        "support_email": getattr(settings, "SUPPORT_EMAIL", "support@example.com"),
    }`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'settings.py',
        code: `TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "core.context_processors.site_settings",
            ],
        },
    },
]`,
      },
      { type: 'h2', text: 'Use the variables in a base template' },
      {
        type: 'code',
        language: 'html',
        title: 'templates/base.html',
        code: `<header>
  <a href="{% url 'home' %}">{{ site_name }}</a>
</header>

<footer>
  Need help? Email <a href="mailto:{{ support_email }}">{{ support_email }}</a>
</footer>`,
      },
      { type: 'h2', text: 'Example: global navigation' },
      {
        type: 'code',
        language: 'python',
        title: 'core/context_processors.py',
        code: `def main_navigation(request):
    return {
        "main_nav": [
            {"label": "Home", "url_name": "home"},
            {"label": "Articles", "url_name": "article-list"},
            {"label": "Contact", "url_name": "contact"},
        ]
    }`,
      },
      {
        type: 'note',
        text: 'Context processors run for many template responses, so avoid expensive database queries unless the data is cached and truly needed everywhere.',
      },
      {
        type: 'tip',
        text: 'Use context processors for shared layout data. Use get_context_data() or view context for data that belongs to one page.',
      },
      {
        type: 'try',
        text: 'Create a context processor that exposes a CONTACT_PHONE setting, then display it in your site footer.',
      },
      {
        type: 'keypoints',
        items: [
          'Context processors add variables to templates globally.',
          'They are configured in TEMPLATES OPTIONS context_processors.',
          'Django auth and messages are exposed through built-in processors.',
          'Keep global context small and avoid unnecessary database work.',
        ],
      },
    ],
  },
  {
    slug: 'django-pagination',
    title: 'Pagination',
    description:
      'Split long QuerySets into pages with Django Paginator and generic view pagination.',
    level: 'intermediate',
    section: 'UX Patterns',
    order: 42,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Pagination keeps list pages fast and readable by showing a limited number of records at a time. Django includes a Paginator class and generic ListView support.',
      },
      {
        type: 'p',
        text: 'A paginated page should preserve ordering, handle invalid page numbers gracefully, and provide simple links for moving between pages.',
      },
      { type: 'h2', text: 'Pagination with ListView' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.views.generic import ListView

from .models import Article


class ArticleListView(ListView):
    model = Article
    template_name = "articles/article_list.html"
    context_object_name = "articles"
    paginate_by = 10

    def get_queryset(self):
        return Article.objects.filter(is_published=True).order_by("-published_at")`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/articles/article_list.html',
        code: `{% for article in articles %}
  <article>
    <h2>{{ article.title }}</h2>
    <p>{{ article.published_at|date:"M j, Y" }}</p>
  </article>
{% empty %}
  <p>No articles found.</p>
{% endfor %}

{% if is_paginated %}
  <nav aria-label="Pagination">
    {% if page_obj.has_previous %}
      <a href="?page={{ page_obj.previous_page_number }}">Previous</a>
    {% endif %}

    <span>Page {{ page_obj.number }} of {{ page_obj.paginator.num_pages }}</span>

    {% if page_obj.has_next %}
      <a href="?page={{ page_obj.next_page_number }}">Next</a>
    {% endif %}
  </nav>
{% endif %}`,
      },
      { type: 'h2', text: 'Pagination in a function view' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.core.paginator import Paginator
from django.shortcuts import render

from .models import Product


def product_list(request):
    product_queryset = Product.objects.filter(is_active=True).order_by("name")
    paginator = Paginator(product_queryset, 12)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "shop/product_list.html", {
        "page_obj": page_obj,
        "products": page_obj.object_list,
    })`,
      },
      { type: 'h2', text: 'Preserve search parameters' },
      {
        type: 'code',
        language: 'html',
        title: 'Pagination link with a search query',
        code: `<a href="?q={{ request.GET.q|urlencode }}&page={{ page_obj.next_page_number }}">
  Next
</a>`,
      },
      {
        type: 'note',
        text: 'Paginator.get_page() is forgiving: invalid page numbers become the first or last page instead of raising an exception.',
      },
      {
        type: 'tip',
        text: 'Always use a stable order_by() before paginating. Without stable ordering, records can appear on multiple pages or be skipped as data changes.',
      },
      {
        type: 'try',
        text: 'Add pagination to a customer list with 25 customers per page and previous/next links that preserve a search query.',
      },
      {
        type: 'keypoints',
        items: [
          'Pagination improves performance and usability for long lists.',
          'ListView supports pagination with paginate_by.',
          'Function views can use django.core.paginator.Paginator.',
          'Preserve filters and search terms in pagination links.',
        ],
      },
    ],
  },
  {
    slug: 'django-search-filter',
    title: 'Search & Filtering',
    description:
      'Build beginner-friendly search and filter pages with GET parameters and QuerySets.',
    level: 'intermediate',
    section: 'UX Patterns',
    order: 43,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Search and filtering let users narrow a list without leaving the page. A common Django approach is to read GET parameters, build a QuerySet, and render the current filter values back into the form.',
      },
      {
        type: 'p',
        text: 'Use GET for search forms because the result is a URL users can bookmark, refresh, and share.',
      },
      { type: 'h2', text: 'Search in a function view' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.db.models import Q
from django.shortcuts import render

from .models import Product


def product_list(request):
    query = request.GET.get("q", "").strip()
    category = request.GET.get("category", "")

    products = Product.objects.filter(is_active=True).select_related("category")

    if query:
        products = products.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )

    if category:
        products = products.filter(category__slug=category)

    return render(request, "shop/product_list.html", {
        "products": products.order_by("name"),
        "query": query,
        "selected_category": category,
    })`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/shop/product_list.html',
        code: `<form method="get">
  <label>
    Search
    <input type="search" name="q" value="{{ query }}">
  </label>

  <label>
    Category
    <select name="category">
      <option value="">All categories</option>
      <option value="books" {% if selected_category == "books" %}selected{% endif %}>Books</option>
      <option value="courses" {% if selected_category == "courses" %}selected{% endif %}>Courses</option>
    </select>
  </label>

  <button type="submit">Apply</button>
  <a href="{% url 'product-list' %}">Clear</a>
</form>

{% for product in products %}
  <h2>{{ product.name }}</h2>
  <p>{{ product.category.name }}</p>
{% empty %}
  <p>No products matched your search.</p>
{% endfor %}`,
      },
      { type: 'h2', text: 'Filtering in a ListView' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.db.models import Q
from django.views.generic import ListView

from .models import Product


class ProductListView(ListView):
    model = Product
    context_object_name = "products"
    paginate_by = 12

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        self.query = self.request.GET.get("q", "").strip()

        if self.query:
            queryset = queryset.filter(
                Q(name__icontains=self.query) | Q(description__icontains=self.query)
            )

        return queryset.order_by("name")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["query"] = self.query
        return context`,
      },
      {
        type: 'note',
        text: 'icontains is convenient for small apps, but large production search may need database indexes, PostgreSQL full-text search, or a search service.',
      },
      {
        type: 'tip',
        text: 'Strip whitespace from search input and pass the cleaned value back to the template so the form keeps what the user typed.',
      },
      {
        type: 'try',
        text: 'Add a status filter to a ticket list so users can search text and choose open, waiting, or closed tickets from a select box.',
      },
      {
        type: 'keypoints',
        items: [
          'GET search forms create bookmarkable result URLs.',
          'Build filters step by step by reassigning a QuerySet.',
          'Q objects are useful for searching multiple fields.',
          'Render current filter values back into the form for better UX.',
        ],
      },
    ],
  },
  {
    slug: 'django-messages-flash',
    title: 'Flash Messages & UX Feedback',
    description:
      'Show one-time success, error, warning, and info messages after redirects.',
    level: 'intermediate',
    section: 'UX Patterns',
    order: 44,
    minutes: 10,
    content: [
      {
        type: 'p',
        text: 'The messages framework lets you show one-time feedback after a request. It is perfect for "Profile saved", "Could not delete item", or "You have been logged out" messages.',
      },
      {
        type: 'p',
        text: 'Messages survive a redirect. That matters because good Django form handling usually follows the POST/Redirect/GET pattern.',
      },
      { type: 'h2', text: 'Add messages in a view' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

from .forms import ProfileForm


@login_required
def edit_profile(request):
    form = ProfileForm(request.POST or None, instance=request.user.profile)

    if request.method == "POST":
        if form.is_valid():
            form.save()
            messages.success(request, "Your profile was updated.")
            return redirect("profile-detail")

        messages.error(request, "Please correct the errors below.")

    return render(request, "profiles/profile_form.html", {"form": form})`,
      },
      { type: 'h2', text: 'Render messages once in the base template' },
      {
        type: 'code',
        language: 'html',
        title: 'templates/base.html',
        code: `{% if messages %}
  <div class="messages">
    {% for message in messages %}
      <div class="message message-{{ message.tags }}">
        {{ message }}
      </div>
    {% endfor %}
  </div>
{% endif %}`,
      },
      { type: 'h2', text: 'Message levels' },
      {
        type: 'code',
        language: 'python',
        title: 'Common message helpers',
        code: `messages.debug(request, "Debug details for developers.")
messages.info(request, "Your export is being prepared.")
messages.success(request, "Invoice paid successfully.")
messages.warning(request, "Your subscription expires soon.")
messages.error(request, "Payment failed. Try another card.")`,
      },
      {
        type: 'p',
        text: 'The default tags match the level names, so your CSS can style message-success, message-error, and other classes differently.',
      },
      {
        type: 'note',
        text: 'The messages framework depends on MessageMiddleware and a context processor. Both are included in Django\'s default project template.',
      },
      {
        type: 'tip',
        text: 'Add success messages immediately before redirects. Add error messages when redisplaying a form with validation errors.',
      },
      {
        type: 'try',
        text: 'Add a success message after creating a blog post and an error message when a contact form fails validation.',
      },
      {
        type: 'keypoints',
        items: [
          'Flash messages provide one-time user feedback.',
          'Messages work well with POST/Redirect/GET.',
          'Render messages in a shared base template.',
          'Use message levels to style success, info, warning, and error states.',
        ],
      },
    ],
  },
  {
    slug: 'django-email',
    title: 'Sending Email',
    description:
      'Send transactional email from Django with console, SMTP, and template-based messages.',
    level: 'intermediate',
    section: 'Talking Outward',
    order: 45,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Django can send email for password resets, contact forms, receipts, invitations, and notifications. The same email API works with different backends.',
      },
      {
        type: 'p',
        text: 'In development, use the console backend so emails print to your terminal. In production, use SMTP or an email service backend configured with environment variables.',
      },
      { type: 'h2', text: 'Development settings' },
      {
        type: 'code',
        language: 'python',
        title: 'settings.py',
        code: `EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
DEFAULT_FROM_EMAIL = "Acme Support <support@example.com>"`,
      },
      { type: 'h2', text: 'Send a simple email' },
      {
        type: 'code',
        language: 'python',
        title: 'views.py',
        code: `from django.contrib import messages
from django.core.mail import send_mail
from django.shortcuts import redirect, render

from .forms import ContactForm


def contact(request):
    form = ContactForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        send_mail(
            subject=f"Contact request from {form.cleaned_data['name']}",
            message=form.cleaned_data["message"],
            from_email=None,
            recipient_list=["support@example.com"],
            fail_silently=False,
        )
        messages.success(request, "Thanks, your message was sent.")
        return redirect("contact")

    return render(request, "contact.html", {"form": form})`,
      },
      { type: 'h2', text: 'Template-based email' },
      {
        type: 'code',
        language: 'python',
        title: 'emails.py',
        code: `from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def send_welcome_email(user):
    context = {"user": user}
    subject = "Welcome to Acme"
    text_body = render_to_string("emails/welcome.txt", context)
    html_body = render_to_string("emails/welcome.html", context)

    message = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    message.attach_alternative(html_body, "text/html")
    message.send()`,
      },
      {
        type: 'code',
        language: 'text',
        title: 'templates/emails/welcome.txt',
        code: `Hi {{ user.get_username }},

Welcome to Acme. We are glad you are here.`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'templates/emails/welcome.html',
        code: `<p>Hi {{ user.get_username }},</p>
<p>Welcome to <strong>Acme</strong>. We are glad you are here.</p>`,
      },
      { type: 'h2', text: 'SMTP settings outline' },
      {
        type: 'code',
        language: 'python',
        title: 'settings.py',
        code: `EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.example.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "smtp-user"
EMAIL_HOST_PASSWORD = "set-this-from-the-environment"`,
      },
      {
        type: 'note',
        text: 'Do not commit real SMTP passwords or API keys. Read secrets from environment variables or your deployment platform.',
      },
      {
        type: 'tip',
        text: 'For slow or high-volume email, enqueue the work in a background task instead of making the user wait for an SMTP request.',
      },
      {
        type: 'try',
        text: 'Create a send_invitation_email(user, invite_url) helper that sends both plain text and HTML versions using templates.',
      },
      {
        type: 'keypoints',
        items: [
          'Django email APIs work with interchangeable email backends.',
          'Use the console backend in development.',
          'send_mail is fine for simple messages; EmailMultiAlternatives supports HTML plus text.',
          'Keep email credentials out of source code.',
        ],
      },
    ],
  },
  {
    slug: 'django-rest-intro',
    title: 'Django REST Framework Intro',
    description:
      'Create your first JSON API with Django REST Framework and understand API basics.',
    level: 'intermediate',
    section: 'APIs',
    order: 46,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'A traditional Django view usually returns HTML for a browser. An API view returns data, commonly JSON, so another program can use it: a React app, mobile app, CLI, partner integration, or another server.',
      },
      {
        type: 'p',
        text: 'Django REST Framework, often called DRF, adds tools for building APIs with serializers, request parsing, response rendering, authentication, permissions, and browsable API pages.',
      },
      { type: 'h2', text: 'Install and enable DRF' },
      {
        type: 'code',
        language: 'bash',
        title: 'Install package',
        code: `python -m pip install djangorestframework`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'settings.py',
        code: `INSTALLED_APPS = [
    # ...
    "rest_framework",
]`,
      },
      { type: 'h2', text: 'Create a simple API view' },
      {
        type: 'code',
        language: 'python',
        title: 'api/views.py',
        code: `from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def api_status(request):
    return Response({
        "status": "ok",
        "version": "1.0",
    })`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'api/urls.py',
        code: `from django.urls import path

from .views import api_status

urlpatterns = [
    path("status/", api_status, name="api-status"),
]`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'project urls.py',
        code: `from django.urls import include, path

urlpatterns = [
    path("api/", include("api.urls")),
]`,
      },
      { type: 'h2', text: 'Try the endpoint' },
      {
        type: 'code',
        language: 'bash',
        title: 'Request JSON',
        code: `curl http://127.0.0.1:8000/api/status/`,
      },
      {
        type: 'code',
        language: 'json',
        title: 'Example response',
        code: `{
  "status": "ok",
  "version": "1.0"
}`,
      },
      { type: 'h2', text: 'API vocabulary' },
      {
        type: 'table',
        headers: ['Term', 'Meaning'],
        rows: [
          ['Endpoint', 'A URL that exposes API behavior'],
          ['HTTP method', 'GET, POST, PUT, PATCH, DELETE, and others'],
          ['Request body', 'Data sent to the API, often JSON'],
          ['Response body', 'Data returned by the API, often JSON'],
          ['Status code', 'Number that describes the result, such as 200, 201, 400, or 404'],
        ],
      },
      {
        type: 'note',
        text: 'DRF Response objects choose the right renderer, so the same view can show JSON to curl and a browsable HTML interface in your browser during development.',
      },
      {
        type: 'tip',
        text: 'Keep API URLs under a clear prefix such as /api/. That makes routing, permissions, and documentation easier later.',
      },
      {
        type: 'try',
        text: 'Create an /api/health/ endpoint that returns service, status, and timestamp keys as JSON.',
      },
      {
        type: 'keypoints',
        items: [
          'APIs return data for programs instead of full HTML pages for browsers.',
          'Django REST Framework adds serializers, API views, auth, permissions, and renderers.',
          '@api_view is a beginner-friendly way to write a DRF endpoint.',
          'JSON APIs use HTTP methods and status codes to communicate results.',
        ],
      },
    ],
  },
  {
    slug: 'django-serializers-viewsets',
    title: 'Serializers & ViewSets',
    description:
      'Use DRF serializers and viewsets to turn Django models into practical CRUD API endpoints.',
    level: 'intermediate',
    section: 'APIs',
    order: 47,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Serializers translate between Django model instances and API-friendly data such as JSON. They also validate incoming API data before it becomes a model object.',
      },
      {
        type: 'p',
        text: 'ViewSets group related API actions such as list, retrieve, create, update, and destroy into one class. Routers then generate the URL patterns for those actions.',
      },
      { type: 'h2', text: 'A model for the API' },
      {
        type: 'code',
        language: 'python',
        title: 'models.py',
        code: `from django.conf import settings
from django.db import models


class Note(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=120)
    body = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title`,
      },
      { type: 'h2', text: 'Create a ModelSerializer' },
      {
        type: 'code',
        language: 'python',
        title: 'api/serializers.py',
        code: `from rest_framework import serializers

from notes.models import Note


class NoteSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "body",
            "owner_username",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "owner_username"]`,
      },
      {
        type: 'p',
        text: 'read_only_fields tells DRF which fields clients can see but not set. The owner will come from request.user inside the viewset.',
      },
      { type: 'h2', text: 'Create a ModelViewSet' },
      {
        type: 'code',
        language: 'python',
        title: 'api/views.py',
        code: `from rest_framework import permissions, viewsets

from notes.models import Note

from .serializers import NoteSerializer


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)`,
      },
      { type: 'h2', text: 'Register the viewset with a router' },
      {
        type: 'code',
        language: 'python',
        title: 'api/urls.py',
        code: `from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import NoteViewSet

router = DefaultRouter()
router.register("notes", NoteViewSet, basename="note")

urlpatterns = [
    path("", include(router.urls)),
]`,
      },
      { type: 'h2', text: 'Example API requests' },
      {
        type: 'code',
        language: 'bash',
        title: 'List notes',
        code: `curl -H "Accept: application/json" http://127.0.0.1:8000/api/notes/`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Create a note with JSON',
        code: `curl -X POST http://127.0.0.1:8000/api/notes/ \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Learn DRF", "body": "Serializers validate API input."}'`,
      },
      {
        type: 'note',
        text: 'ModelViewSet is convenient, but you are still responsible for queryset scoping and permissions. Never expose all objects when users should only see their own.',
      },
      {
        type: 'tip',
        text: 'Use perform_create() for values that come from the request, such as owner, organization, or IP address, instead of trusting clients to send them.',
      },
      {
        type: 'try',
        text: 'Build a TaskSerializer and TaskViewSet that lists only tasks assigned to request.user and sets created_by during perform_create().',
      },
      {
        type: 'keypoints',
        items: [
          'Serializers convert model instances to API data and validate incoming data.',
          'ModelSerializer reduces boilerplate for model-backed APIs.',
          'ModelViewSet provides common CRUD actions in one class.',
          'Routers generate URL patterns for registered viewsets.',
        ],
      },
    ],
  },
  {
    slug: 'django-api-auth',
    title: 'API Authentication Basics',
    description:
      'Protect DRF endpoints with session authentication, token authentication concepts, and permissions.',
    level: 'intermediate',
    section: 'APIs',
    order: 48,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'API authentication identifies the client making a request. In DRF, authentication sets request.user and request.auth. Permissions then decide whether the authenticated user may perform the action.',
      },
      {
        type: 'p',
        text: 'For browser-based development, session authentication works with Django login. For external clients, APIs commonly use tokens, signed JWTs, or OAuth depending on the app\'s needs.',
      },
      { type: 'h2', text: 'Default DRF authentication settings' },
      {
        type: 'code',
        language: 'python',
        title: 'settings.py',
        code: `REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}`,
      },
      {
        type: 'p',
        text: 'SessionAuthentication is convenient for the browsable API because it uses your normal Django login session. BasicAuthentication is useful for local testing but is rarely the final production choice by itself.',
      },
      { type: 'h2', text: 'Set permissions per viewset' },
      {
        type: 'code',
        language: 'python',
        title: 'api/views.py',
        code: `from rest_framework import permissions, viewsets

from notes.models import Note

from .serializers import NoteSerializer


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)`,
      },
      { type: 'h2', text: 'Allow read-only access to anonymous users' },
      {
        type: 'code',
        language: 'python',
        title: 'api/views.py',
        code: `from rest_framework import permissions, viewsets


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(is_published=True).order_by("-published_at")
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]`,
      },
      { type: 'h2', text: 'Token authentication concept' },
      {
        type: 'p',
        text: 'A token is a secret string a client sends with each request, usually in an Authorization header. The server checks the token and identifies the user.',
      },
      {
        type: 'code',
        language: 'text',
        title: 'Authorization header shape',
        code: `Authorization: Token abc123exampletoken`,
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Request with an auth header',
        code: `curl http://127.0.0.1:8000/api/notes/ \\
  -H "Authorization: Token abc123exampletoken"`,
      },
      {
        type: 'p',
        text: 'DRF includes a simple TokenAuthentication package, but many modern projects use maintained JWT packages or OAuth providers for production APIs. Choose the approach that matches your client and security requirements.',
      },
      { type: 'h2', text: 'Object-level ownership check' },
      {
        type: 'code',
        language: 'python',
        title: 'api/permissions.py',
        code: `from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user`,
      },
      {
        type: 'code',
        language: 'python',
        title: 'api/views.py',
        code: `class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Note.objects.filter(owner=self.request.user)`,
      },
      {
        type: 'note',
        text: 'Authentication and permissions are separate. An authenticated user can still be denied if permissions fail.',
      },
      {
        type: 'tip',
        text: 'Always scope get_queryset() to the current user or tenant for private data. Object permissions are helpful, but queryset scoping prevents accidental listing leaks.',
      },
      {
        type: 'try',
        text: 'Create a read-only public Article API and a private Note API. The public API should allow anyone; the private API should require login and only return the current user\'s notes.',
      },
      {
        type: 'keypoints',
        items: [
          'DRF authentication identifies the requester and sets request.user.',
          'DRF permissions decide whether that requester can access an endpoint or object.',
          'SessionAuthentication works well with Django login and the browsable API.',
          'Private APIs should combine permissions with carefully scoped querysets.',
        ],
      },
    ],
  },
];
