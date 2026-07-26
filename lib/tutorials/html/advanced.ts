import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'dialog-element',
    title: 'The dialog Element',
    description:
      'Build accessible modals and lightboxes with the native HTML dialog element, showModal, and form method dialog.',
    level: 'advanced',
    section: 'Modern HTML',
    order: 49,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'The dialog element gives you a native way to create modals, confirmations, and lightweight overlays without a custom component library. Browsers handle focus trapping, Escape to close (for modal dialogs), and a built-in backdrop.',
      },
      {
        type: 'p',
        text: 'Before dialog, teams often built modals with divs, ARIA roles, and carefully managed focus. Native dialog covers most of that work when you use it correctly.',
      },
      { type: 'h2', text: 'Basic structure' },
      {
        type: 'code',
        title: 'A simple dialog with open and close controls',
        language: 'html',
        code: `<button type="button" id="open-settings">Open settings</button>

<dialog id="settings-dialog">
  <form method="dialog">
    <h2>Settings</h2>
    <p>Choose your preferences, then close the dialog.</p>
    <label>
      Theme
      <select name="theme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    <menu>
      <button value="cancel">Cancel</button>
      <button value="save">Save</button>
    </menu>
  </form>
</dialog>

<script>
  const dialog = document.getElementById('settings-dialog');
  document.getElementById('open-settings').addEventListener('click', () => {
    dialog.showModal();
  });
</script>`,
      },
      { type: 'h2', text: 'show() vs showModal()' },
      {
        type: 'ul',
        items: [
          'show() opens a non-modal dialog. The rest of the page stays interactive.',
          'showModal() opens a modal dialog with a backdrop and focus trapping.',
          'close() or form method="dialog" closes the dialog and can return a returnValue.',
        ],
      },
      {
        type: 'table',
        headers: ['Method', 'Backdrop', 'Focus trap', 'Typical use'],
        rows: [
          ['show()', 'No', 'No', 'Inline panels, non-blocking tips'],
          ['showModal()', 'Yes', 'Yes', 'Confirmations, forms, alerts'],
          ['close(value)', 'Removes dialog', 'Restores focus', 'Programmatic close with a result'],
        ],
      },
      { type: 'h2', text: 'Closing with method="dialog"' },
      {
        type: 'p',
        text: 'A form inside a dialog can use method="dialog". Submitting that form closes the dialog. The clicked submit button value becomes dialog.returnValue, which is useful for Yes / No flows.',
      },
      {
        type: 'code',
        title: 'Confirm delete with returnValue',
        language: 'html',
        code: `<dialog id="confirm-delete">
  <form method="dialog">
    <p>Delete this article? This cannot be undone.</p>
    <button value="cancel">Keep it</button>
    <button value="confirm">Delete</button>
  </form>
</dialog>

<script>
  const confirmDialog = document.getElementById('confirm-delete');

  confirmDialog.addEventListener('close', () => {
    if (confirmDialog.returnValue === 'confirm') {
      console.log('User confirmed delete');
    }
  });
</script>`,
      },
      {
        type: 'note',
        text: 'The open attribute can mark a dialog as visible in markup, but for modal behavior you should call showModal() from script so the browser applies the modal state correctly.',
      },
      { type: 'h2', text: 'Accessibility habits' },
      {
        type: 'ol',
        items: [
          'Give the dialog a clear heading as the first meaningful content.',
          'Use showModal() for true interruptions so focus stays inside.',
          'Provide an obvious close control, not only Escape.',
          'Do not nest interactive dialogs unless you have a strong reason.',
        ],
      },
      {
        type: 'tip',
        text: 'Style the backdrop with the ::backdrop pseudo-element. Keep contrast high enough that the dialog remains the clear focus of the screen.',
      },
      {
        type: 'try',
        text: 'Build a newsletter signup dialog that opens with showModal(), includes an email field, and closes with Cancel or Subscribe using method="dialog".',
      },
      {
        type: 'keypoints',
        items: [
          'dialog is the native element for modals and light overlays.',
          'Prefer showModal() when the user should finish a task before continuing.',
          'form method="dialog" closes the dialog and sets returnValue.',
          'Pair dialog with a clear heading and an explicit close action.',
        ],
      },
    ],
  },
  {
    slug: 'details-summary',
    title: 'details and summary',
    description:
      'Create disclosure widgets, FAQs, and progressive disclosure with native details and summary elements.',
    level: 'advanced',
    section: 'Modern HTML',
    order: 50,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'The details and summary elements create a disclosure widget: a control that expands and collapses related content. No JavaScript is required for the basic open and close behavior.',
      },
      {
        type: 'p',
        text: 'Use them for FAQs, optional settings, long footnotes, and any content that should stay available without crowding the first screen.',
      },
      { type: 'h2', text: 'Minimal pattern' },
      {
        type: 'code',
        title: 'A single disclosure',
        language: 'html',
        code: `<details>
  <summary>Shipping options</summary>
  <p>Standard shipping arrives in 5 to 7 business days.</p>
  <p>Express shipping arrives in 1 to 2 business days.</p>
</details>`,
      },
      { type: 'h2', text: 'The open attribute' },
      {
        type: 'p',
        text: 'Add open when the content should start expanded. Remove it (or omit it) for the collapsed default. Users can still toggle either state.',
      },
      {
        type: 'code',
        title: 'FAQ list with one item open by default',
        language: 'html',
        code: `<section aria-labelledby="faq-heading">
  <h2 id="faq-heading">FAQ</h2>

  <details open>
    <summary>Do I need an account?</summary>
    <p>You can browse without an account. Checkout requires an email address.</p>
  </details>

  <details>
    <summary>Can I change my plan later?</summary>
    <p>Yes. Plan changes take effect on your next billing date.</p>
  </details>

  <details>
    <summary>How do refunds work?</summary>
    <p>Request a refund within 14 days of purchase from your account page.</p>
  </details>
</section>`,
      },
      { type: 'h2', text: 'Nesting and name groups' },
      {
        type: 'p',
        text: 'You can nest details for hierarchical content. Some browsers also support a name attribute so a group of details behaves like an accordion: opening one closes others that share the same name.',
      },
      {
        type: 'code',
        title: 'Accordion-style details with a shared name',
        language: 'html',
        code: `<details name="docs-toc">
  <summary>Getting started</summary>
  <p>Install the CLI, then run the init command.</p>
</details>

<details name="docs-toc">
  <summary>Configuration</summary>
  <p>Edit config.json to set your project name and theme.</p>
</details>

<details name="docs-toc">
  <summary>Deployment</summary>
  <p>Push to main to trigger the production pipeline.</p>
</details>`,
      },
      {
        type: 'warning',
        text: 'Do not put interactive controls that must stay visible inside summary if collapse would hide critical actions. Keep summary short and descriptive.',
      },
      { type: 'h2', text: 'When to prefer details over custom widgets' },
      {
        type: 'ul',
        items: [
          'Content is useful but secondary to the main reading path.',
          'You want progressive disclosure without shipping accordion JavaScript.',
          'Search engines and no-JS browsers should still see the content in the DOM.',
          'You can accept browser default markers, or restyle them carefully.',
        ],
      },
      {
        type: 'tip',
        text: 'Listen for the toggle event if you need analytics when a panel opens. Keep the core experience working without that script.',
      },
      {
        type: 'try',
        text: 'Mark up a product page section with three details panels: Ingredients, Care instructions, and Size guide. Open only Ingredients by default.',
      },
      {
        type: 'keypoints',
        items: [
          'details and summary create native expand and collapse UI.',
          'summary is the visible control; the rest is the disclosed content.',
          'Use open for a default expanded state.',
          'Shared name values can create accordion-like exclusive opening.',
        ],
      },
    ],
  },
  {
    slug: 'template-slot',
    title: 'template Element Basics',
    description:
      'Use the HTML template element to hold inert markup you can clone into the page with JavaScript.',
    level: 'advanced',
    section: 'Modern HTML',
    order: 51,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'The template element stores HTML that is parsed by the browser but not rendered and not active. Scripts inside a template do not run. Images do not load. The content waits until your code clones it into the live document.',
      },
      {
        type: 'p',
        text: 'Templates are ideal for repeating cards, list items, toast messages, and any markup you want to define once in HTML instead of building with createElement calls.',
      },
      { type: 'h2', text: 'Declaring a template' },
      {
        type: 'code',
        title: 'A product card template',
        language: 'html',
        code: `<template id="product-card">
  <article class="product-card">
    <h3 class="product-name"></h3>
    <p class="product-price"></p>
    <button type="button" class="add-to-cart">Add to cart</button>
  </article>
</template>

<div id="product-grid"></div>`,
      },
      { type: 'h2', text: 'Cloning into the document' },
      {
        type: 'code',
        title: 'Clone, fill, and append',
        language: 'html',
        code: `<script>
  const template = document.getElementById('product-card');
  const grid = document.getElementById('product-grid');

  const products = [
    { name: 'Notebook', price: '$12' },
    { name: 'Desk lamp', price: '$48' },
  ];

  for (const product of products) {
    const node = template.content.cloneNode(true);
    node.querySelector('.product-name').textContent = product.name;
    node.querySelector('.product-price').textContent = product.price;
    grid.appendChild(node);
  }
</script>`,
      },
      {
        type: 'note',
        text: 'Always clone template.content, not the template element itself. cloneNode(true) copies the full fragment so you can fill fields before appending.',
      },
      { type: 'h2', text: 'How template differs from hidden markup' },
      {
        type: 'table',
        headers: ['Approach', 'Rendered?', 'Resources load?', 'Best for'],
        rows: [
          ['template', 'No until cloned', 'No until cloned', 'Reusable client-side fragments'],
          ['hidden div', 'In DOM layout as hidden', 'Yes, often', 'Content that may show later without cloning'],
          ['display:none block', 'In DOM, not visible', 'Yes', 'Toggleable UI already on the page'],
        ],
      },
      { type: 'h2', text: 'Slots in a sentence' },
      {
        type: 'p',
        text: 'The slot element belongs to the Shadow DOM world of web components. A host element can project light-DOM children into named slots inside a shadow tree. You will use slots when you build custom elements with encapsulated markup.',
      },
      {
        type: 'code',
        title: 'Conceptual slot placeholders inside a shadow template',
        language: 'html',
        code: `<template id="info-card-template">
  <style>
    :host { display: block; border: 1px solid #ccc; padding: 1rem; }
  </style>
  <h2><slot name="title">Untitled</slot></h2>
  <div><slot>Default body content</slot></div>
</template>`,
      },
      {
        type: 'tip',
        text: 'Start with plain template cloning for lists and cards. Move to shadow DOM and slots only when you need encapsulation across a design system.',
      },
      {
        type: 'try',
        text: 'Create a template for a comment item with author, time, and body. Clone it three times into a comments list using sample data.',
      },
      {
        type: 'keypoints',
        items: [
          'template holds inert HTML that is not rendered until cloned.',
          'Clone template.content with cloneNode(true) before inserting.',
          'Templates keep repeating markup in HTML instead of long createElement chains.',
          'slot is used with Shadow DOM to project content into custom elements.',
        ],
      },
    ],
  },
  {
    slug: 'custom-elements-intro',
    title: 'Custom Elements Intro',
    description:
      'Learn the basics of custom elements: defining a class, registering a tag, lifecycle callbacks, and attributes.',
    level: 'advanced',
    section: 'Modern HTML',
    order: 52,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Custom elements let you teach the browser new HTML tags backed by JavaScript classes. They are the foundation of web components and work well when you need reusable UI with clear boundaries.',
      },
      {
        type: 'p',
        text: 'You do not need a framework to start. A custom element can be as small as a styled badge or as rich as a date picker with its own events.',
      },
      { type: 'h2', text: 'Define and register' },
      {
        type: 'code',
        title: 'A minimal custom element',
        language: 'html',
        code: `<script>
  class SiteBadge extends HTMLElement {
    connectedCallback() {
      this.textContent = this.getAttribute('label') || 'New';
      this.setAttribute('role', 'status');
    }
  }

  customElements.define('site-badge', SiteBadge);
</script>

<site-badge label="Beta"></site-badge>`,
      },
      {
        type: 'warning',
        text: 'Custom element names must include a hyphen, such as site-badge or user-card. Single-word tags are reserved for native HTML.',
      },
      { type: 'h2', text: 'Lifecycle callbacks' },
      {
        type: 'ul',
        items: [
          'connectedCallback runs when the element is inserted into the document.',
          'disconnectedCallback runs when it is removed.',
          'attributeChangedCallback runs when observed attributes change.',
          'adoptedCallback runs when the element moves to a new document.',
        ],
      },
      {
        type: 'code',
        title: 'Observing an attribute',
        language: 'html',
        code: `<script>
  class ProgressMeter extends HTMLElement {
    static get observedAttributes() {
      return ['value'];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'value' && oldValue !== newValue) {
        this.render();
      }
    }

    render() {
      const value = Number(this.getAttribute('value') || 0);
      this.innerHTML = \`<progress max="100" value="\${value}"></progress> <span>\${value}%</span>\`;
    }
  }

  customElements.define('progress-meter', ProgressMeter);
</script>

<progress-meter value="40"></progress-meter>`,
      },
      { type: 'h2', text: 'Autonomous vs customized built-ins' },
      {
        type: 'p',
        text: 'Autonomous custom elements extend HTMLElement and use a new tag name. Customized built-ins extend a native element such as HTMLButtonElement and are used with is="my-button". Support and ergonomics differ across browsers, so autonomous elements are the common starting point.',
      },
      { type: 'h2', text: 'When custom elements help' },
      {
        type: 'table',
        headers: ['Situation', 'Custom element?', 'Why'],
        rows: [
          ['Reusable widget used on many pages', 'Yes', 'One definition, consistent API'],
          ['One-off page layout', 'Usually no', 'Plain HTML is simpler'],
          ['Need Shadow DOM style isolation', 'Often yes', 'Encapsulate CSS and markup'],
          ['Team already uses a framework component model', 'Maybe later', 'Avoid two competing systems'],
        ],
      },
      {
        type: 'tip',
        text: 'Expose a small attribute and event API. Treat the custom element like a native control: clear inputs in, clear events out.',
      },
      {
        type: 'try',
        text: 'Create a <time-label> custom element that reads a datetime attribute and displays a human-readable date in connectedCallback.',
      },
      {
        type: 'keypoints',
        items: [
          'Custom elements are classes registered with customElements.define.',
          'Tag names must contain a hyphen.',
          'Lifecycle callbacks manage setup, teardown, and attribute updates.',
          'Start with autonomous HTMLElement subclasses for the widest, simplest path.',
        ],
      },
    ],
  },
  {
    slug: 'data-attributes',
    title: 'data-* Attributes',
    description:
      'Store custom data on elements with data-* attributes and read them safely from CSS and JavaScript.',
    level: 'advanced',
    section: 'Modern HTML',
    order: 53,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'data-* attributes let you attach private data to HTML elements without inventing non-standard attributes. They are valid HTML, easy to select, and map cleanly to the dataset API in JavaScript.',
      },
      { type: 'h2', text: 'Writing data attributes' },
      {
        type: 'code',
        title: 'Markup with custom data',
        language: 'html',
        code: `<button
  type="button"
  class="plan-button"
  data-plan="pro"
  data-price-monthly="29"
  data-trial-days="14"
>
  Start Pro trial
</button>

<article
  class="lesson-card"
  data-level="advanced"
  data-duration-minutes="16"
  data-complete="false"
>
  <h2>The dialog Element</h2>
</article>`,
      },
      {
        type: 'note',
        text: 'Names after data- should be lowercase with hyphens. In JavaScript, data-price-monthly becomes element.dataset.priceMonthly.',
      },
      { type: 'h2', text: 'Reading with dataset' },
      {
        type: 'code',
        title: 'Accessing data attributes from script',
        language: 'html',
        code: `<script>
  const button = document.querySelector('.plan-button');

  console.log(button.dataset.plan); // "pro"
  console.log(button.dataset.priceMonthly); // "29"
  console.log(button.dataset.trialDays); // "14"

  button.addEventListener('click', () => {
    const price = Number(button.dataset.priceMonthly);
    console.log('Selected plan costs', price);
  });
</script>`,
      },
      { type: 'h2', text: 'Using data attributes in CSS' },
      {
        type: 'code',
        title: 'Attribute selectors and attr()',
        language: 'html',
        code: `<style>
  .lesson-card[data-level="advanced"] {
    border-left: 4px solid #0b6e4f;
  }

  .lesson-card[data-complete="true"] {
    opacity: 0.7;
  }

  .lesson-card::after {
    content: attr(data-duration-minutes) " min";
  }
</style>`,
      },
      { type: 'h2', text: 'Good practices' },
      {
        type: 'ul',
        items: [
          'Store configuration and UI state hooks, not large blobs of JSON when a script module would be clearer.',
          'Keep values simple strings; convert numbers and booleans in JavaScript.',
          'Prefer data attributes over inventing attributes like plan="pro" that are not part of HTML.',
          'Do not put secrets in data attributes. Anything in HTML is visible to users.',
        ],
      },
      {
        type: 'warning',
        text: 'Avoid duplicating visible text into data attributes unless a script truly needs a separate machine value. Duplication drifts out of sync.',
      },
      {
        type: 'try',
        text: 'Build a list of city buttons with data-lat and data-lng. On click, log the coordinates from dataset.',
      },
      {
        type: 'keypoints',
        items: [
          'data-* is the standard way to store custom values on elements.',
          'dataset converts hyphenated names to camelCase properties.',
          'CSS can select and display data attributes with attribute selectors and attr().',
          'Keep data attribute values small, public, and purposeful.',
        ],
      },
    ],
  },
  {
    slug: 'html-validation',
    title: 'Validating HTML',
    description:
      'Catch structural mistakes early with validators, doctype rules, and habits that keep markup maintainable.',
    level: 'advanced',
    section: 'Quality & Standards',
    order: 54,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Valid HTML is not about perfectionism. It is about predictable parsing, better accessibility tooling, and fewer layout surprises when browsers forgive different mistakes in different ways.',
      },
      {
        type: 'p',
        text: 'A validator checks your markup against the HTML living standard: correct nesting, allowed attributes, required content models, and duplicate IDs.',
      },
      { type: 'h2', text: 'What validation catches' },
      {
        type: 'ul',
        items: [
          'Elements in the wrong parent, such as a div directly inside a ul.',
          'Duplicate id values on one page.',
          'Obsolete attributes and elements.',
          'Missing required attributes on certain controls.',
          'Incorrect nesting of interactive content.',
        ],
      },
      { type: 'h2', text: 'A valid document skeleton' },
      {
        type: 'code',
        title: 'Start from a clean baseline',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Project brief</title>
  </head>
  <body>
    <header>
      <h1>Project brief</h1>
    </header>
    <main>
      <article>
        <h2>Goal</h2>
        <p>Ship a documented HTML prototype by Friday.</p>
      </article>
    </main>
  </body>
</html>`,
      },
      { type: 'h2', text: 'Common validity mistakes' },
      {
        type: 'table',
        headers: ['Mistake', 'Why it hurts', 'Fix'],
        rows: [
          ['Multiple h1 headings without a clear outline plan', 'Confusing document structure', 'Use one page title h1, then h2+'],
          ['label without for or wrapping control', 'Weaker accessible names', 'Associate labels correctly'],
          ['Interactive element inside another interactive element', 'Broken activation and AT behavior', 'Restructure the markup'],
          ['Unclosed tags in complex fragments', 'Unexpected auto-correction', 'Validate fragments during review'],
        ],
      },
      {
        type: 'code',
        title: 'Invalid vs valid list markup',
        language: 'html',
        code: `<!-- Invalid: div is not allowed as a direct child of ul -->
<ul>
  <div><li>One</li></div>
</ul>

<!-- Valid -->
<ul>
  <li><div>One</div></li>
</ul>`,
      },
      { type: 'h2', text: 'Make validation part of the workflow' },
      {
        type: 'ol',
        items: [
          'Validate early when you introduce a new page template.',
          'Re-check after large refactors that move landmarks or forms.',
          'Treat repeated validator warnings as design system bugs, not one-off noise.',
          'Combine automated checks with a quick keyboard and screen reader pass.',
        ],
      },
      {
        type: 'tip',
        text: 'The W3C Nu Html Checker and editor extensions are enough for most teams. Run them on the rendered HTML if a framework generates markup.',
      },
      {
        type: 'try',
        text: 'Paste a recent page into a validator. Fix every error, then decide which warnings are real quality issues for your project.',
      },
      {
        type: 'keypoints',
        items: [
          'Validation finds structural problems before users do.',
          'Browsers may recover from bad markup in inconsistent ways.',
          'A correct doctype, lang, charset, and title are the baseline.',
          'Make validation a habit on templates, not only on final releases.',
        ],
      },
    ],
  },
  {
    slug: 'progressive-enhancement',
    title: 'Progressive Enhancement',
    description:
      'Design HTML that works first as content and forms, then layer CSS and JavaScript as enhancements.',
    level: 'advanced',
    section: 'Quality & Standards',
    order: 55,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Progressive enhancement starts with a usable HTML document. CSS improves presentation. JavaScript improves convenience. If styles or scripts fail, the core task should still be possible.',
      },
      {
        type: 'p',
        text: 'This mindset produces resilient sites: faster first paint, better resilience on poor networks, and clearer separation between content and behavior.',
      },
      { type: 'h2', text: 'The three layers' },
      {
        type: 'table',
        headers: ['Layer', 'Responsibility', 'Example'],
        rows: [
          ['HTML', 'Meaning, structure, and basic actions', 'A search form that submits to a results URL'],
          ['CSS', 'Layout, hierarchy, and visual clarity', 'Grid layout and focus styles'],
          ['JavaScript', 'Enhancements and richer interaction', 'Live suggestions as the user types'],
        ],
      },
      { type: 'h2', text: 'Enhance a form, do not replace it' },
      {
        type: 'code',
        title: 'HTML that works without JavaScript',
        language: 'html',
        code: `<form action="/search" method="get" id="site-search">
  <label for="q">Search the docs</label>
  <input id="q" name="q" type="search" required>
  <button type="submit">Search</button>
</form>

<script>
  const form = document.getElementById('site-search');
  form.addEventListener('submit', async (event) => {
    if (!window.fetch) return; // let the browser submit normally
    event.preventDefault();
    const data = new FormData(form);
    const response = await fetch('/search?' + new URLSearchParams(data));
    // render results into the page
  });
</script>`,
      },
      {
        type: 'note',
        text: 'The enhancement checks for capability and then improves the flow. Without script, the form still navigates to /search.',
      },
      { type: 'h2', text: 'Practical rules' },
      {
        type: 'ul',
        items: [
          'Use real links for navigation and real forms for data submission.',
          'Do not hide critical content behind script-only rendering if you can ship HTML.',
          'Prefer buttons and inputs that work with keyboard and assistive tech by default.',
          'Build custom widgets as upgrades of native controls when possible.',
        ],
      },
      { type: 'h2', text: 'Progressive enhancement vs graceful degradation' },
      {
        type: 'p',
        text: 'Progressive enhancement builds up from a solid base. Graceful degradation starts from a rich experience and tries to survive failures. Both matter, but starting from HTML keeps the base honest.',
      },
      {
        type: 'tip',
        text: 'When reviewing a feature, ask: what happens with CSS disabled? With JavaScript disabled? With a slow network? Fix the worst answer first.',
      },
      {
        type: 'try',
        text: 'Rebuild a tabbed interface as a list of in-page links and sections first. Then add JavaScript to switch panels without a full jump if available.',
      },
      {
        type: 'keypoints',
        items: [
          'Start with meaningful HTML that completes the core task.',
          'CSS and JavaScript should enhance, not be the only path.',
          'Real links and forms are the backbone of resilient UI.',
          'Test features with scripts and styles unavailable.',
        ],
      },
    ],
  },
  {
    slug: 'content-security',
    title: 'Content Security Basics for Markup',
    description:
      'Write HTML with fewer XSS and injection risks: safe embedding, careful scripts, and CSP-friendly patterns.',
    level: 'advanced',
    section: 'Quality & Standards',
    order: 56,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Markup choices affect security. Cross-site scripting (XSS) often starts when untrusted text is inserted into HTML as if it were trusted code. Good HTML habits reduce the attack surface before your framework even runs.',
      },
      { type: 'h2', text: 'Treat user content as text' },
      {
        type: 'p',
        text: 'Never drop raw user input into innerHTML, or into a page template without escaping. Prefer textContent in the DOM, or the escaping tools your server framework provides.',
      },
      {
        type: 'code',
        title: 'Unsafe vs safer client rendering',
        language: 'html',
        code: `<div id="comment"></div>
<script>
  const userComment = '<img src=x onerror=alert(1)>';

  // Unsafe: parses markup and can run handlers
  // document.getElementById('comment').innerHTML = userComment;

  // Safer for plain text
  document.getElementById('comment').textContent = userComment;
</script>`,
      },
      { type: 'h2', text: 'Be careful with embedding' },
      {
        type: 'ul',
        items: [
          'Use iframe sandbox attributes when embedding third-party documents.',
          'Avoid javascript: URLs in href or action.',
          'Do not put secrets in HTML comments, data attributes, or hidden fields if they must stay private.',
          'Limit third-party scripts; every script is full power inside your origin unless CSP restricts it.',
        ],
      },
      {
        type: 'code',
        title: 'A sandboxed embed',
        language: 'html',
        code: `<iframe
  src="https://maps.example.com/embed/venue"
  title="Venue map"
  sandbox="allow-scripts allow-same-origin"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
></iframe>`,
      },
      { type: 'h2', text: 'CSP-friendly markup' },
      {
        type: 'p',
        text: 'Content Security Policy (CSP) is an HTTP header (or meta tag in limited cases) that tells the browser which scripts, styles, images, and frames are allowed. Inline scripts and inline event handlers are common CSP headaches.',
      },
      {
        type: 'code',
        title: 'Prefer external scripts over inline handlers',
        language: 'html',
        code: `<!-- Harder to allow under strict CSP -->
<button onclick="save()">Save</button>

<!-- Easier to reason about with CSP + external JS -->
<button type="button" id="save">Save</button>
<script src="/assets/save.js" nonce="randomServerNonce"></script>`,
      },
      {
        type: 'warning',
        text: 'A meta CSP can help in demos, but production policies usually belong in HTTP headers so they cover the whole response reliably.',
      },
      { type: 'h2', text: 'Forms and open redirects' },
      {
        type: 'p',
        text: 'Keep form actions pointing at known paths on your site. If you accept a next or return URL from the query string, validate it on the server so attackers cannot send users to a lookalike domain after login.',
      },
      {
        type: 'try',
        text: 'Audit one page for inline event handlers, user-generated HTML, and third-party iframes. List one hardening change for each finding.',
      },
      {
        type: 'keypoints',
        items: [
          'Untrusted data must be escaped or inserted as text, not raw HTML.',
          'Sandbox third-party iframes and minimize third-party scripts.',
          'CSP works better when scripts are external and free of inline handlers.',
          'Security is a markup concern, not only a backend concern.',
        ],
      },
    ],
  },
  {
    slug: 'internationalization',
    title: 'lang, dir, and i18n',
    description:
      'Prepare pages for multiple languages with lang, dir, translate hints, and writing-system aware markup.',
    level: 'advanced',
    section: 'Quality & Standards',
    order: 57,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Internationalization (i18n) in HTML starts with declaring language and text direction correctly. Assistive technologies, fonts, quotation styles, and hyphenation all benefit from accurate lang and dir values.',
      },
      { type: 'h2', text: 'Set the document language' },
      {
        type: 'code',
        title: 'Primary language on the html element',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Course catalog</title>
  </head>
  <body>
    <main>
      <h1>Course catalog</h1>
      <p>Browse HTML and CSS paths.</p>
    </main>
  </body>
</html>`,
      },
      {
        type: 'p',
        text: 'When a passage uses another language, override lang on the nearest element. Screen readers can switch pronunciation rules.',
      },
      {
        type: 'code',
        title: 'Mixed-language content',
        language: 'html',
        code: `<p>
  The French phrase
  <span lang="fr">c'est la vie</span>
  appears often in English writing.
</p>

<p lang="es">
  Bienvenido al curso de HTML avanzado.
</p>`,
      },
      { type: 'h2', text: 'Text direction with dir' },
      {
        type: 'ul',
        items: [
          'dir="ltr" is left-to-right (English, most Latin scripts).',
          'dir="rtl" is right-to-left (Arabic, Hebrew).',
          'dir="auto" lets the browser guess from the first strong character; useful for user-generated content.',
        ],
      },
      {
        type: 'code',
        title: 'RTL page shell',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8">
    <title>الدليل</title>
  </head>
  <body>
    <main>
      <h1>مرحبا</h1>
      <p>هذه صفحة تجريبية باتجاه من اليمين إلى اليسار.</p>
      <p dir="ltr" lang="en">English product codes stay LTR: SKU-1044.</p>
    </main>
  </body>
</html>`,
      },
      { type: 'h2', text: 'Helpful i18n attributes' },
      {
        type: 'table',
        headers: ['Attribute', 'Purpose'],
        rows: [
          ['lang', 'Declares the human language of text'],
          ['dir', 'Declares base direction for bidirectional layout'],
          ['translate="no"', 'Hints that a fragment should not be machine-translated'],
          ['hreflang on links', 'Indicates the language of a linked document'],
        ],
      },
      {
        type: 'code',
        title: 'Protecting brand names from translation',
        language: 'html',
        code: `<p>
  Learn with
  <span translate="no">Intellex</span>
  tutorials.
</p>

<nav>
  <a href="/es/" hreflang="es" lang="es">Español</a>
  <a href="/fr/" hreflang="fr" lang="fr">Français</a>
</nav>`,
      },
      {
        type: 'tip',
        text: 'Design layouts that mirror gracefully for RTL. Logical CSS properties such as margin-inline-start pair well with dir.',
      },
      {
        type: 'try',
        text: 'Take an English article page and add a French quotation with lang="fr". Then create an Arabic variant of the shell using lang and dir.',
      },
      {
        type: 'keypoints',
        items: [
          'Always set lang on the html element.',
          'Override lang for passages in another language.',
          'Use dir for RTL scripts and mixed-direction fragments.',
          'hreflang and translate help navigation and translation tools.',
        ],
      },
    ],
  },
  {
    slug: 'print-friendly-html',
    title: 'Print-Friendly Markup',
    description:
      'Structure pages so printing and PDF output stay readable: semantics, link clarity, and print CSS hooks.',
    level: 'advanced',
    section: 'Quality & Standards',
    order: 58,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'People still print lesson pages, invoices, tickets, and reports. Print-friendly HTML is mostly good structure, with a few hooks that CSS can use in a print stylesheet.',
      },
      { type: 'h2', text: 'Semantic structure prints better' },
      {
        type: 'ul',
        items: [
          'Use article, section, and headings so page breaks can follow meaning.',
          'Put the main title in h1 and keep supporting chrome in header or nav.',
          'Keep tables simple: clear th headers and short cells.',
          'Ensure critical data is real text, not only painted by CSS background images.',
        ],
      },
      {
        type: 'code',
        title: 'A document ready for screen and print',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Invoice 1042</title>
    <link rel="stylesheet" href="screen.css">
    <link rel="stylesheet" href="print.css" media="print">
  </head>
  <body>
    <header class="site-header">
      <p class="brand">Northwind Studio</p>
      <nav class="site-nav">...</nav>
    </header>

    <main>
      <article class="invoice">
        <h1>Invoice 1042</h1>
        <p>Billed to: Ada Lovelace</p>
        <table>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Hours</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>HTML audit</td>
              <td>4</td>
              <td>$480</td>
            </tr>
          </tbody>
        </table>
      </article>
    </main>
  </body>
</html>`,
      },
      { type: 'h2', text: 'Hide chrome, keep content' },
      {
        type: 'code',
        title: 'print.css ideas tied to markup hooks',
        language: 'css',
        code: `@media print {
  .site-nav,
  .cookie-banner,
  .no-print {
    display: none !important;
  }

  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.9em;
  }

  .invoice {
    break-inside: avoid;
  }
}`,
      },
      {
        type: 'note',
        text: 'Showing full URLs after links helps on paper, but skip it for internal anchors like href="#top" by tightening your CSS selectors.',
      },
      { type: 'h2', text: 'Page break hints in HTML' },
      {
        type: 'p',
        text: 'You cannot fully control printers from HTML alone, but you can avoid awkward splits by keeping headings with their next paragraph and by wrapping logical units in articles or sections that CSS can protect with break-inside: avoid.',
      },
      {
        type: 'warning',
        text: 'Do not rely on tiny gray text for legal copy. Print contrast and paper size vary. Keep important terms readable.',
      },
      {
        type: 'try',
        text: 'Add class="no-print" to a page newsletter signup, link a print stylesheet, and preview Print in your browser for a blog post.',
      },
      {
        type: 'keypoints',
        items: [
          'Clean semantics make printed output easier to follow.',
          'Use media="print" stylesheets to hide navigation and extras.',
          'Expose real text and useful link information for paper.',
          'Group related content so CSS can reduce awkward page breaks.',
        ],
      },
    ],
  },
  {
    slug: 'capstone-docs-site',
    title: 'Capstone: Documentation Site Structure',
    description:
      'Plan and mark up a small documentation site with navigation, article layout, code samples, and landmarks.',
    level: 'advanced',
    section: 'Capstones',
    order: 59,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This capstone pulls advanced HTML into a realistic docs site: a persistent sidebar, an article with a table of contents, code examples, and clear landmarks for assistive tech.',
      },
      { type: 'h2', text: 'Information architecture' },
      {
        type: 'ol',
        items: [
          'Home / overview page explaining the product.',
          'Guides section with multi-step tutorials.',
          'API reference pages with headings that match endpoints or components.',
          'A search form that works as a normal GET request.',
        ],
      },
      {
        type: 'code',
        title: 'Documentation page shell',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Buttons - UI Kit Docs</title>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>

    <header>
      <p class="brand"><a href="/">UI Kit Docs</a></p>
      <form action="/search" method="get" role="search">
        <label for="doc-q">Search docs</label>
        <input id="doc-q" name="q" type="search">
        <button type="submit">Search</button>
      </form>
    </header>

    <div class="docs-layout">
      <nav aria-labelledby="sidebar-label">
        <h2 id="sidebar-label">Topics</h2>
        <ul>
          <li><a href="/guides/install">Install</a></li>
          <li><a href="/components/buttons" aria-current="page">Buttons</a></li>
          <li><a href="/components/dialogs">Dialogs</a></li>
        </ul>
      </nav>

      <main id="main">
        <article>
          <h1>Buttons</h1>
          <nav aria-labelledby="toc-label">
            <h2 id="toc-label">On this page</h2>
            <ol>
              <li><a href="#usage">Usage</a></li>
              <li><a href="#variants">Variants</a></li>
              <li><a href="#accessibility">Accessibility</a></li>
            </ol>
          </nav>

          <section id="usage">
            <h2>Usage</h2>
            <p>Use a Button for actions, not for navigation.</p>
            <pre><code>&lt;button type="button"&gt;Save&lt;/button&gt;</code></pre>
          </section>

          <section id="variants">
            <h2>Variants</h2>
            <p>Primary, secondary, and danger variants share the same control semantics.</p>
          </section>

          <section id="accessibility">
            <h2>Accessibility</h2>
            <p>Buttons must have a discernible name and a clear focus style.</p>
          </section>
        </article>
      </main>
    </div>
  </body>
</html>`,
      },
      { type: 'h2', text: 'Docs-specific HTML checklist' },
      {
        type: 'ul',
        items: [
          'Mark the active sidebar link with aria-current="page".',
          'Wrap examples in pre and code; escape angle brackets in HTML samples.',
          'Give each major section a stable id for deep links.',
          'Keep the skip link as the first focusable element.',
        ],
      },
      {
        type: 'tip',
        text: 'For long API pages, group members with h2 and h3 only. Avoid skipping heading levels to make the outline match the sidebar.',
      },
      {
        type: 'try',
        text: 'Build two docs pages that share the same header and sidebar structure: Install and Buttons. Only the article content should change.',
      },
      {
        type: 'keypoints',
        items: [
          'Docs sites need landmarks, a skip link, and persistent navigation.',
          'Articles should include a local table of contents with fragment links.',
          'aria-current marks the active docs page in the sidebar.',
          'Code samples belong in pre and code with escaped markup.',
        ],
      },
    ],
  },
  {
    slug: 'capstone-portfolio',
    title: 'Capstone: Portfolio Markup',
    description:
      'Mark up a personal portfolio with a strong hero region, project list, and contact path using semantic HTML.',
    level: 'advanced',
    section: 'Capstones',
    order: 60,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'A portfolio is a branding surface and a content site at once. The HTML should spotlight your name, present a short positioning line, and lead to projects and contact without turning the first screen into a dashboard of widgets.',
      },
      { type: 'h2', text: 'First viewport composition' },
      {
        type: 'ul',
        items: [
          'Brand or name as the dominant text signal.',
          'One headline that supports the brand, not a separate competing title.',
          'One short supporting sentence.',
          'One CTA group (View projects / Contact).',
          'One dominant visual plane for atmosphere or your work.',
        ],
      },
      {
        type: 'code',
        title: 'Portfolio home structure',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Maya Chen - Product Designer</title>
  </head>
  <body>
    <header class="site-header">
      <p class="brand">Maya Chen</p>
      <nav aria-label="Primary">
        <ul>
          <li><a href="#work">Work</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section class="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">Maya Chen</h1>
        <p class="tagline">Product designer for calm, useful interfaces.</p>
        <p>
          <a class="button" href="#work">View projects</a>
          <a class="button button-secondary" href="#contact">Contact</a>
        </p>
      </section>

      <section id="work" aria-labelledby="work-title">
        <h2 id="work-title">Selected work</h2>
        <ul class="project-list">
          <li>
            <article>
              <h3><a href="/work/ledger">Ledger</a></h3>
              <p>A budgeting app redesign focused on clarity.</p>
            </article>
          </li>
          <li>
            <article>
              <h3><a href="/work/harbor">Harbor</a></h3>
              <p>Marketing site system for a ferry booking service.</p>
            </article>
          </li>
        </ul>
      </section>

      <section id="about" aria-labelledby="about-title">
        <h2 id="about-title">About</h2>
        <p>I design interfaces for teams who value restraint and readability.</p>
      </section>

      <section id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Contact</h2>
        <p><a href="mailto:maya@example.com">maya@example.com</a></p>
      </section>
    </main>
  </body>
</html>`,
      },
      { type: 'h2', text: 'Project pages' },
      {
        type: 'p',
        text: 'Each case study can be an article with h1 project name, a short summary, problem and outcome sections, and figures with useful alt text. Link back to the work index.',
      },
      {
        type: 'code',
        title: 'Case study outline',
        language: 'html',
        code: `<article>
  <header>
    <p><a href="/#work">All work</a></p>
    <h1>Ledger</h1>
    <p>A budgeting app redesign focused on clarity.</p>
  </header>
  <section>
    <h2>Problem</h2>
    <p>People could not tell which bills were due this week.</p>
  </section>
  <section>
    <h2>Outcome</h2>
    <p>Task completion for "pay bill" improved in usability tests.</p>
  </section>
</article>`,
      },
      {
        type: 'warning',
        text: 'Avoid packing stats strips, pill clusters, and promo stickers into the hero. Let the name and craft lead.',
      },
      {
        type: 'try',
        text: 'Mark up your own portfolio home with brand-first hero, three project articles in a list, and a contact section using only semantic HTML.',
      },
      {
        type: 'keypoints',
        items: [
          'Portfolio HTML should put the personal or studio brand first.',
          'Keep the hero limited to brand, line, support, CTAs, and one visual idea.',
          'Projects work well as a list of articles with clear headings.',
          'Case studies reuse article structure with problem and outcome sections.',
        ],
      },
    ],
  },
  {
    slug: 'capstone-checkout-form',
    title: 'Capstone: Checkout Form',
    description:
      'Build an accessible multi-section checkout form with labels, autocomplete, validation attributes, and error messaging hooks.',
    level: 'advanced',
    section: 'Capstones',
    order: 61,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'Checkout is where HTML quality becomes revenue quality. Clear labels, correct input types, autocomplete tokens, and thoughtful error regions help users finish under time pressure.',
      },
      { type: 'h2', text: 'Section the form' },
      {
        type: 'code',
        title: 'Checkout form foundation',
        language: 'html',
        code: `<form action="/checkout" method="post" novalidate>
  <h1>Checkout</h1>

  <fieldset>
    <legend>Contact</legend>
    <p>
      <label for="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autocomplete="email"
        required
        aria-describedby="email-hint"
      >
      <span id="email-hint">Receipts are sent to this address.</span>
    </p>
  </fieldset>

  <fieldset>
    <legend>Shipping address</legend>
    <p>
      <label for="name">Full name</label>
      <input id="name" name="name" autocomplete="name" required>
    </p>
    <p>
      <label for="address">Address</label>
      <input id="address" name="address" autocomplete="street-address" required>
    </p>
    <p>
      <label for="city">City</label>
      <input id="city" name="city" autocomplete="address-level2" required>
    </p>
    <p>
      <label for="postal">Postal code</label>
      <input id="postal" name="postal" autocomplete="postal-code" required>
    </p>
    <p>
      <label for="country">Country</label>
      <select id="country" name="country" autocomplete="country" required>
        <option value="">Select a country</option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
      </select>
    </p>
  </fieldset>

  <fieldset>
    <legend>Payment</legend>
    <p>
      <label for="cc-name">Name on card</label>
      <input id="cc-name" name="cc-name" autocomplete="cc-name" required>
    </p>
    <p>
      <label for="cc-number">Card number</label>
      <input
        id="cc-number"
        name="cc-number"
        inputmode="numeric"
        autocomplete="cc-number"
        required
      >
    </p>
    <p>
      <label for="cc-exp">Expiration</label>
      <input id="cc-exp" name="cc-exp" autocomplete="cc-exp" placeholder="MM/YY" required>
    </p>
    <p>
      <label for="cc-csc">Security code</label>
      <input id="cc-csc" name="cc-csc" autocomplete="cc-csc" inputmode="numeric" required>
    </p>
  </fieldset>

  <div role="alert" id="form-errors" hidden></div>
  <button type="submit">Pay now</button>
</form>`,
      },
      { type: 'h2', text: 'Why these attributes matter' },
      {
        type: 'table',
        headers: ['Attribute', 'Benefit'],
        rows: [
          ['fieldset / legend', 'Groups related controls for screen readers'],
          ['autocomplete tokens', 'Faster, more accurate browser autofill'],
          ['type and inputmode', 'Better keyboards and basic format checks'],
          ['aria-describedby', 'Connects hints and errors to inputs'],
          ['role="alert" region', 'Announces server or script errors when shown'],
        ],
      },
      { type: 'h2', text: 'Error messaging pattern' },
      {
        type: 'code',
        title: 'Inline error linked to a field',
        language: 'html',
        code: `<p>
  <label for="email">Email</label>
  <input
    id="email"
    name="email"
    type="email"
    required
    aria-invalid="true"
    aria-describedby="email-error"
  >
  <span id="email-error">Enter an email address that includes @.</span>
</p>`,
      },
      {
        type: 'note',
        text: 'novalidate is optional when you replace native bubbles with custom messages. If you use it, you must provide equivalent validation yourself.',
      },
      {
        type: 'tip',
        text: 'Never put card data into a page that logs form bodies to analytics. Keep payment fields on PCI-appropriate flows or hosted widgets.',
      },
      {
        type: 'try',
        text: 'Extend the checkout with a billing address checkbox that reveals a second fieldset when billing differs from shipping. Use clear labels either way.',
      },
      {
        type: 'keypoints',
        items: [
          'Checkout forms should use fieldset groups and explicit labels.',
          'autocomplete values dramatically improve completion speed.',
          'Connect hints and errors with aria-describedby.',
          'Keep a visible alert region for form-level problems.',
        ],
      },
    ],
  },
  {
    slug: 'component-patterns',
    title: 'Reusable HTML Patterns',
    description:
      'Standardize breadcrumbs, cards-as-interactions, empty states, and other HTML patterns for a consistent design system.',
    level: 'advanced',
    section: 'Capstones',
    order: 62,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Reusable HTML patterns keep a site coherent. When every team invents a different breadcrumb or modal shell, accessibility and CSS both suffer. Document patterns as small, copyable snippets.',
      },
      { type: 'h2', text: 'Breadcrumb navigation' },
      {
        type: 'code',
        title: 'Breadcrumb with list semantics',
        language: 'html',
        code: `<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/guides">Guides</a></li>
    <li aria-current="page">Dialogs</li>
  </ol>
</nav>`,
      },
      { type: 'h2', text: 'Media object / content row' },
      {
        type: 'code',
        title: 'Figure plus text without unnecessary wrappers',
        language: 'html',
        code: `<article class="media">
  <img src="/avatars/lee.jpg" alt="" width="64" height="64">
  <div>
    <h2>Lee Okonkwo</h2>
    <p>Wrote the progressive enhancement checklist.</p>
  </div>
</article>`,
      },
      {
        type: 'note',
        text: 'Empty alt is correct when the name in the heading already identifies the person and the image is decorative.',
      },
      { type: 'h2', text: 'Empty state' },
      {
        type: 'code',
        title: 'Meaningful empty state inside a region',
        language: 'html',
        code: `<section aria-labelledby="notifications-title">
  <h2 id="notifications-title">Notifications</h2>
  <p>You are all caught up. New alerts will show here.</p>
  <p><a href="/settings/alerts">Manage alert settings</a></p>
</section>`,
      },
      { type: 'h2', text: 'Pattern rules of thumb' },
      {
        type: 'ul',
        items: [
          'Prefer native elements before ARIA widget roles.',
          'Name landmarks with aria-label only when multiple regions of the same type exist.',
          'Keep interactive cards as a single link wrapping the heading, or use a clearly labeled button; avoid nested links.',
          'Document which attributes are required for each pattern.',
        ],
      },
      {
        type: 'table',
        headers: ['Pattern', 'Core elements', 'Key attribute'],
        rows: [
          ['Breadcrumb', 'nav > ol > li', 'aria-current="page"'],
          ['Search', 'form role="search"', 'label + input type="search"'],
          ['Disclosure', 'details > summary', 'open when needed'],
          ['Modal', 'dialog', 'showModal() in script'],
          ['Alert', 'role="alert" or aria-live', 'visible text on change'],
        ],
      },
      {
        type: 'try',
        text: 'Create a one-page pattern library with breadcrumb, empty state, and disclosure snippets. Each pattern gets a short heading and the HTML sample.',
      },
      {
        type: 'keypoints',
        items: [
          'Shared HTML patterns reduce accessibility drift.',
          'Breadcrumbs, empty states, and disclosures cover many product UIs.',
          'Native semantics beat custom roles when both can work.',
          'Document required attributes beside each snippet.',
        ],
      },
    ],
  },
  {
    slug: 'html-checklist',
    title: 'Production HTML Checklist',
    description:
      'Use a practical pre-launch checklist for document setup, semantics, forms, media, and resilience.',
    level: 'advanced',
    section: 'Capstones',
    order: 63,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Before you call HTML production-ready, run a checklist. It is faster than rediscovering the same omissions on every project.',
      },
      { type: 'h2', text: 'Document setup' },
      {
        type: 'ul',
        items: [
          'Doctype is <!DOCTYPE html>.',
          'html has a correct lang (and dir when needed).',
          'meta charset appears early in head.',
          'Viewport meta is present for responsive pages.',
          'title is unique and meaningful per page.',
        ],
      },
      { type: 'h2', text: 'Structure and semantics' },
      {
        type: 'ul',
        items: [
          'One clear h1 that matches the page purpose.',
          'Heading levels do not skip without reason.',
          'main, nav, header, footer landmarks are used thoughtfully.',
          'Lists are real ul/ol/li structures, not styled div stacks.',
          'Tables have th with scope when they present data.',
        ],
      },
      { type: 'h2', text: 'Links, buttons, and forms' },
      {
        type: 'code',
        title: 'Checklist snippet you can paste into a PR template',
        language: 'text',
        code: `HTML production checklist
[ ] Links navigate; buttons trigger actions
[ ] Every input has a label
[ ] Required fields use required (or equivalent server rules)
[ ] Errors are linked with aria-describedby / aria-invalid
[ ] autocomplete is set on common profile and payment fields
[ ] Forms still work without custom JavaScript`,
      },
      { type: 'h2', text: 'Media and embeds' },
      {
        type: 'ul',
        items: [
          'Images that convey meaning have useful alt text.',
          'Decorative images use empty alt.',
          'iframe elements have title.',
          'Video and audio provide captions or transcripts when content matters.',
        ],
      },
      { type: 'h2', text: 'Resilience and quality' },
      {
        type: 'ol',
        items: [
          'Validate major templates.',
          'Keyboard through the page: skip link, nav, forms, dialogs.',
          'Check the no-JS path for critical tasks.',
          'Confirm print view for invoices, tickets, or articles if relevant.',
          'Scan for inline handlers and untrusted HTML insertion points.',
        ],
      },
      {
        type: 'tip',
        text: 'Turn this checklist into a short living document for your team. Delete items that never apply; add project-specific risks.',
      },
      {
        type: 'try',
        text: 'Run this checklist against one of your earlier capstone pages and fix every failing item.',
      },
      {
        type: 'keypoints',
        items: [
          'Production HTML needs document, semantics, interaction, and media checks.',
          'Forms and keyboard paths deserve explicit review.',
          'Validation plus a quick AT pass catch different classes of bugs.',
          'Keep the checklist short enough that people actually use it.',
        ],
      },
    ],
  },
  {
    slug: 'html5-apis-overview',
    title: 'HTML5 APIs Overview',
    description:
      'Connect advanced HTML to browser APIs: canvas, drag and drop, geolocation, storage, and more, from a markup-first view.',
    level: 'advanced',
    section: 'Capstones',
    order: 64,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'HTML is not only tags. Many browser capabilities are reached through elements plus JavaScript APIs. Knowing which element unlocks which API helps you choose the right primitive.',
      },
      { type: 'h2', text: 'Elements that gate APIs' },
      {
        type: 'table',
        headers: ['Element / feature', 'API area', 'Typical use'],
        rows: [
          ['canvas', '2D / WebGL drawing', 'Charts, editors, games'],
          ['video / audio', 'Media playback & streams', 'Players, captions, media sessions'],
          ['input type="file"', 'File / FileReader', 'Uploads and local previews'],
          ['draggable + Drop events', 'Drag and Drop', 'Reorderable lists, upload targets'],
          ['dialog', 'HTMLDialogElement', 'Modals and prompts'],
        ],
      },
      {
        type: 'code',
        title: 'Canvas markup hooked to a tiny script',
        language: 'html',
        code: `<canvas id="spark" width="320" height="80" role="img" aria-label="Weekly signups sparkline"></canvas>
<script>
  const canvas = document.getElementById('spark');
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(0, 60);
  ctx.lineTo(80, 40);
  ctx.lineTo(160, 50);
  ctx.lineTo(240, 20);
  ctx.lineTo(320, 30);
  ctx.stroke();
</script>`,
      },
      { type: 'h2', text: 'Storage and offline-related APIs' },
      {
        type: 'ul',
        items: [
          'localStorage and sessionStorage for small key-value preferences.',
          'IndexedDB for larger structured client data.',
          'Service workers (registered from script) for offline caching strategies.',
          'Keep sensitive tokens out of long-lived local storage when possible.',
        ],
      },
      { type: 'h2', text: 'Device and environment APIs' },
      {
        type: 'code',
        title: 'Geolocation is permissioned and script-driven',
        language: 'html',
        code: `<button type="button" id="locate">Use my location</button>
<p id="coords" aria-live="polite"></p>
<script>
  document.getElementById('locate').addEventListener('click', () => {
    if (!navigator.geolocation) {
      document.getElementById('coords').textContent = 'Geolocation is not supported.';
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      document.getElementById('coords').textContent =
        latitude.toFixed(4) + ', ' + longitude.toFixed(4);
    });
  });
</script>`,
      },
      {
        type: 'warning',
        text: 'Permissioned APIs must be user-initiated whenever possible. Do not prompt for location or camera on page load.',
      },
      { type: 'h2', text: 'How to study them' },
      {
        type: 'ol',
        items: [
          'Identify the HTML element or browser interface involved.',
          'Read the permissions and security requirements.',
          'Build a 20-line demo that fails gracefully when unsupported.',
          'Only then integrate the API into a product feature.',
        ],
      },
      {
        type: 'try',
        text: 'Create a file input that accepts images and shows the chosen file name with textContent. Optional stretch: preview the image with URL.createObjectURL.',
      },
      {
        type: 'keypoints',
        items: [
          'Many HTML5 capabilities pair a specific element with a JavaScript API.',
          'canvas, media elements, file inputs, and dialog are common entry points.',
          'Storage and device APIs need careful permission and privacy handling.',
          'Prototype small demos before product integration.',
        ],
      },
    ],
  },
  {
    slug: 'next-steps-html',
    title: 'Next Steps After HTML',
    description:
      'Choose a learning path after advanced HTML: CSS architecture, accessibility depth, JavaScript, frameworks, and content systems.',
    level: 'advanced',
    section: 'Capstones',
    order: 65,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'If you can structure documents, forms, dialogs, and resilient patterns, you already think like a strong front-of-the-frontend engineer. Next, deepen the skills that surround HTML.',
      },
      { type: 'h2', text: 'Path 1: CSS systems' },
      {
        type: 'ul',
        items: [
          'Learn layout with flexbox and grid until page composition feels predictable.',
          'Study responsive design with fluid type and logical properties.',
          'Practice designing focus states, motion preferences, and print styles.',
          'Explore design tokens and structured CSS architectures used by your team.',
        ],
      },
      { type: 'h2', text: 'Path 2: Accessibility depth' },
      {
        type: 'ul',
        items: [
          'Read WCAG success criteria that affect structure, forms, and media.',
          'Practice with a screen reader on your capstone pages.',
          'Learn when ARIA is necessary and when it is redundant.',
          'Add accessibility acceptance checks to pull requests.',
        ],
      },
      { type: 'h2', text: 'Path 3: JavaScript and components' },
      {
        type: 'code',
        title: 'A learning order that respects progressive enhancement',
        language: 'text',
        code: `1. DOM selection, events, and form data
2. Fetch and rendering enhancements on real HTML
3. Custom elements for reusable widgets
4. A framework (React, Vue, Svelte, etc.) with SSR/HTML-aware patterns
5. Testing Library-style tests that assert roles and names`,
      },
      { type: 'h2', text: 'Path 4: Content and delivery' },
      {
        type: 'ul',
        items: [
          'Templating and static site generators that still emit clean HTML.',
          'CMS models that map to articles, sections, and media metadata.',
          'Performance basics: image types, loading attributes, critical HTML size.',
          'SEO fundamentals grounded in titles, headings, and linkable structure.',
        ],
      },
      { type: 'h2', text: 'A 30-day practice plan' },
      {
        type: 'ol',
        items: [
          'Week 1: Rebuild your docs capstone CSS without breaking semantics.',
          'Week 2: Add keyboard and screen reader notes to the checkout form.',
          'Week 3: Enhance one form with fetch while keeping the no-JS path.',
          'Week 4: Publish a tiny pattern library and a short case study write-up.',
        ],
      },
      {
        type: 'tip',
        text: 'The best next project is one that ships. A small, valid, accessible site beats an unfinished framework rewrite.',
      },
      {
        type: 'keypoints',
        items: [
          'After HTML, grow into CSS systems, accessibility, and JS enhancement.',
          'Keep progressive enhancement as you adopt frameworks.',
          'Content models and performance still depend on solid markup.',
          'Ship small projects that prove structure, resilience, and clarity.',
        ],
      },
    ],
  },
];
