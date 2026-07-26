import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'clamp-minmax',
    title: 'Fluid Sizing with clamp, min, and max',
    description:
      'Build responsive type, spacing, and layout values with min(), max(), and clamp() instead of endless media query breakpoints.',
    level: 'advanced',
    section: 'Modern CSS',
    order: 49,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Modern CSS can scale values smoothly between a floor and a ceiling. The comparison functions min(), max(), and clamp() let you express responsive sizing in one declaration, which keeps stylesheets shorter and layouts more fluid.',
      },
      {
        type: 'p',
        text: 'These functions shine for font sizes, padding, gaps, widths, and container-friendly spacing. You still use media queries for layout shifts, but you no longer need a breakpoint for every tiny size tweak.',
      },
      { type: 'h2', text: 'min() picks the smaller value' },
      {
        type: 'p',
        text: 'min() returns the smallest of its arguments. A common pattern is capping a width so an element can grow with the viewport but never exceed a design maximum.',
      },
      {
        type: 'code',
        title: 'Width that shrinks on small screens',
        language: 'css',
        code: `.hero {
  width: min(100% - 2rem, 72rem);
  margin-inline: auto;
}

/* On a 400px screen: ~368px
   On a 1600px screen: 72rem (capped) */`,
      },
      {
        type: 'note',
        text: 'You can mix units inside min() and max(). The browser compares computed pixel values, so 100% and 72rem can live in the same call.',
      },
      { type: 'h2', text: 'max() picks the larger value' },
      {
        type: 'p',
        text: 'max() returns the largest argument. Use it when you want a value to grow, but never fall below a usable minimum.',
      },
      {
        type: 'code',
        title: 'Readable line length and touch-friendly gaps',
        language: 'css',
        code: `.content {
  padding-inline: max(1rem, 4vw);
}

.button {
  min-height: max(2.75rem, 44px);
}`,
      },
      { type: 'h2', text: 'clamp() sets a range' },
      {
        type: 'p',
        text: 'clamp(MIN, PREFERRED, MAX) is the function you will use most. It returns PREFERRED when that value sits between MIN and MAX. If PREFERRED is too small, you get MIN. If it is too large, you get MAX.',
      },
      {
        type: 'code',
        title: 'Fluid type scale',
        language: 'css',
        code: `:root {
  --step-0: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --step-1: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --step-2: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
  --step-3: clamp(2rem, 1.5rem + 2.5vw, 3rem);
}

h1 {
  font-size: var(--step-3);
  line-height: 1.15;
}

p {
  font-size: var(--step-0);
  line-height: 1.6;
}`,
      },
      {
        type: 'tip',
        text: 'A practical fluid formula is often written as clamp(min, preferred, max) where preferred mixes a rem base with vw. Keep the preferred slope gentle so text does not jump aggressively between phone and desktop.',
      },
      { type: 'h2', text: 'Fluid spacing without breakpoint soup' },
      {
        type: 'code',
        title: 'Section padding that scales with the viewport',
        language: 'css',
        code: `.section {
  padding-block: clamp(2.5rem, 1.5rem + 4vw, 6rem);
  padding-inline: clamp(1rem, 0.5rem + 3vw, 2.5rem);
}

.grid {
  gap: clamp(1rem, 0.75rem + 1vw, 2rem);
}`,
      },
      {
        type: 'table',
        headers: ['Function', 'Returns', 'Typical use'],
        rows: [
          ['min()', 'Smallest argument', 'Cap widths, limit growth'],
          ['max()', 'Largest argument', 'Enforce minimum sizes'],
          ['clamp()', 'Preferred value within bounds', 'Fluid type, spacing, radii'],
        ],
      },
      {
        type: 'warning',
        text: 'Fluid sizing is not a substitute for testing. Check that clamped text still meets accessibility expectations, and that preferred values cannot collapse below your minimum on unusual zoom settings.',
      },
      {
        type: 'try',
        text: 'Replace a heading font-size media query chain with one clamp() declaration. Compare phone, tablet, and desktop sizes, then tune the preferred middle value until the growth feels natural.',
      },
      {
        type: 'keypoints',
        items: [
          'min() and max() compare values and return the smaller or larger result.',
          'clamp(min, preferred, max) is ideal for fluid type and spacing.',
          'Mixing units is allowed because the browser compares computed sizes.',
          'Use clamp for continuous scaling and keep media queries for structural layout changes.',
        ],
      },
    ],
  },
  {
    slug: 'logical-properties',
    title: 'Logical Properties',
    description:
      'Write direction-aware CSS with inline and block axes so layouts adapt cleanly for left-to-right and right-to-left writing modes.',
    level: 'advanced',
    section: 'Modern CSS',
    order: 50,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Physical properties like margin-left and border-top assume a left-to-right, top-to-bottom page. Logical properties describe space relative to the writing mode instead: the inline axis runs along the line of text, and the block axis stacks those lines.',
      },
      {
        type: 'p',
        text: 'If your product may support Arabic, Hebrew, or vertical writing modes, logical properties reduce duplicated CSS and prevent mirrored layouts from fighting your styles.',
      },
      { type: 'h2', text: 'Inline and block axes' },
      {
        type: 'ul',
        items: [
          'Inline start and end follow the reading direction of a line.',
          'Block start and end follow the stacking direction of paragraphs.',
          'In English, inline-start is left and block-start is top.',
          'In Arabic, inline-start is right while block-start remains top.',
        ],
      },
      {
        type: 'code',
        title: 'Physical vs logical spacing',
        language: 'css',
        code: `/* Physical (direction-locked) */
.card {
  margin-left: 1rem;
  padding-right: 1.5rem;
  border-top: 2px solid navy;
}

/* Logical (writing-mode aware) */
.card {
  margin-inline-start: 1rem;
  padding-inline-end: 1.5rem;
  border-block-start: 2px solid navy;
}`,
      },
      { type: 'h2', text: 'Shorthands you will use daily' },
      {
        type: 'code',
        title: 'Logical shorthands for layout chrome',
        language: 'css',
        code: `.panel {
  margin-block: 2rem;          /* top + bottom in horizontal writing */
  margin-inline: auto;         /* left + right centering in LTR */
  padding-inline: 1.25rem;
  padding-block: 1rem;
  border-inline-start: 4px solid teal;
  inset-inline-end: 1rem;      /* instead of right: 1rem */
}`,
      },
      {
        type: 'table',
        headers: ['Physical', 'Logical equivalent', 'Meaning in LTR horizontal'],
        rows: [
          ['margin-left', 'margin-inline-start', 'Start of the line'],
          ['margin-right', 'margin-inline-end', 'End of the line'],
          ['padding-top', 'padding-block-start', 'Start of the block flow'],
          ['width', 'inline-size', 'Size along the line'],
          ['height', 'block-size', 'Size across stacked lines'],
        ],
      },
      { type: 'h2', text: 'Sizing with inline-size and block-size' },
      {
        type: 'code',
        title: 'Direction-friendly component sizing',
        language: 'css',
        code: `.sidebar {
  inline-size: min(100%, 20rem);
  block-size: auto;
  max-inline-size: 24rem;
}

.avatar {
  inline-size: 3rem;
  block-size: 3rem;
  border-radius: 999px;
}`,
      },
      {
        type: 'tip',
        text: 'Prefer margin-inline: auto for horizontal centering. It reads clearly and still works when the inline axis flips.',
      },
      { type: 'h2', text: 'Borders and radius corners' },
      {
        type: 'code',
        title: 'Logical border radii',
        language: 'css',
        code: `.chip {
  border-start-start-radius: 999px;
  border-end-start-radius: 999px;
  border-start-end-radius: 0.35rem;
  border-end-end-radius: 0.35rem;
}`,
      },
      {
        type: 'note',
        text: 'Corner names follow block then inline order: border-start-start-radius is the corner at block-start and inline-start.',
      },
      {
        type: 'warning',
        text: 'Do not mix physical and logical properties for the same edge without care. Competing left and inline-start rules make overrides hard to reason about.',
      },
      {
        type: 'try',
        text: 'Take a card component that uses margin-left, padding-right, and border-left. Rewrite it with logical properties, then toggle dir="rtl" on the document and confirm the chrome mirrors correctly.',
      },
      {
        type: 'keypoints',
        items: [
          'Logical properties describe layout relative to writing direction.',
          'Inline is along the text line; block is the stacking axis.',
          'margin-inline, padding-block, inline-size, and inset-* cover most daily needs.',
          'Logical CSS reduces RTL bugs and keeps components portable across locales.',
        ],
      },
    ],
  },
  {
    slug: 'has-selector',
    title: 'The :has() Selector',
    description:
      'Style a parent based on its children or descendants with :has(), unlocking patterns that once required JavaScript.',
    level: 'advanced',
    section: 'Modern CSS',
    order: 51,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: ':has() is often called a parent selector. It matches an element when something inside (or relative to) that element matches the condition you pass. That means cards, forms, and navigation can react to their contents without extra classes from JavaScript.',
      },
      {
        type: 'p',
        text: 'Use :has() for progressive enhancement. Keep markup semantic, then layer visual states when supporting browsers evaluate the relationship.',
      },
      { type: 'h2', text: 'Style a parent when it contains a match' },
      {
        type: 'code',
        title: 'Card that highlights when it contains an image',
        language: 'html',
        code: `<article class="card">
  <h2>Plain update</h2>
  <p>No media in this card.</p>
</article>

<article class="card">
  <img src="cover.jpg" alt="Studio workspace">
  <h2>Visual story</h2>
  <p>This card has a cover image.</p>
</article>`,
      },
      {
        type: 'code',
        title: 'Parent styling with :has()',
        language: 'css',
        code: `.card:has(img) {
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: 1rem;
  align-items: start;
}

.card:not(:has(img)) {
  padding-block: 1.25rem;
}`,
      },
      { type: 'h2', text: 'Form validation without scripting classes' },
      {
        type: 'code',
        title: 'Field group reacts to invalid input',
        language: 'css',
        code: `.field:has(:invalid:not(:placeholder-shown)) {
  border-color: crimson;
}

.field:has(:focus-visible) {
  outline: 2px solid dodgerblue;
  outline-offset: 2px;
}

.field:has(:checked) label {
  font-weight: 700;
}`,
      },
      {
        type: 'tip',
        text: 'Combine :has() with :focus-visible, :checked, and :invalid to keep interactive states in CSS when the markup already exposes those states.',
      },
      { type: 'h2', text: 'Relational selectors beyond direct children' },
      {
        type: 'code',
        title: 'Navigation and sibling-aware layouts',
        language: 'css',
        code: `/* Style nav when any link is current */
.nav:has(a[aria-current="page"]) {
  border-block-end: 2px solid currentColor;
}

/* Shrink hero when a promo banner exists above it */
body:has(.promo-banner) .hero {
  min-block-size: 60vh;
}

/* Card with an error message */
.card:has(.error) {
  box-shadow: inset 0 0 0 2px crimson;
}`,
      },
      {
        type: 'note',
        text: ':has() accepts a relative selector list. .card:has(> img) only matches a direct child image, while .card:has(img) matches any descendant image.',
      },
      { type: 'h2', text: 'Practical patterns and restraint' },
      {
        type: 'ul',
        items: [
          'Toggle layout density when optional slots are present.',
          'Mark list items that contain unread badges.',
          'Adjust grid tracks when a sidebar contains a sticky widget.',
          'Avoid deeply nested :has() chains that are hard to debug.',
        ],
      },
      {
        type: 'warning',
        text: ':has() can be expensive if overused on huge DOMs with very broad selectors. Prefer specific relationships such as .card:has(.error) over document-wide guesses.',
      },
      {
        type: 'try',
        text: 'Build a pricing card. When the card contains an element with class "featured", give the parent a stronger border and move the price to a larger type size using only :has().',
      },
      {
        type: 'keypoints',
        items: [
          ':has() matches an element based on related matches inside or beside it.',
          'It unlocks parent and contextual styling without JavaScript class toggles.',
          'Pair it with form and ARIA states for clean interactive CSS.',
          'Keep selectors specific so intent stays readable and performance stays sane.',
        ],
      },
    ],
  },
  {
    slug: 'layers-cascade',
    title: 'Cascade Layers with @layer',
    description:
      'Organize cascade priority with @layer so resets, tokens, components, and utilities stop fighting each other.',
    level: 'advanced',
    section: 'Modern CSS',
    order: 52,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Cascade layers let you declare whole buckets of styles and control which bucket wins, even when selector specificity would normally say otherwise. That is powerful for design systems, third-party CSS, and large codebases.',
      },
      {
        type: 'p',
        text: 'Instead of escalating specificity wars with longer selectors or !important, you put low-level foundations in earlier layers and intentional overrides in later layers.',
      },
      { type: 'h2', text: 'Declare layer order first' },
      {
        type: 'code',
        title: 'Explicit layer order',
        language: 'css',
        code: `@layer reset, tokens, base, components, utilities;

@layer reset {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

@layer tokens {
  :root {
    --color-bg: #f7f4ef;
    --color-fg: #1c1a17;
    --space-3: 1rem;
  }
}`,
      },
      {
        type: 'note',
        text: 'The first @layer statement that lists names establishes order. Later layers override earlier ones when both match, regardless of ordinary specificity between those layered rules.',
      },
      { type: 'h2', text: 'Components stay weaker than utilities' },
      {
        type: 'code',
        title: 'Utilities win without !important',
        language: 'css',
        code: `@layer components {
  .button {
    display: inline-flex;
    padding: 0.75rem 1.25rem;
    background: navy;
    color: white;
  }
}

@layer utilities {
  .bg-transparent {
    background: transparent;
  }

  .text-navy {
    color: navy;
  }
}

/* Even though both are single classes,
   utilities layer beats components layer */`,
      },
      {
        type: 'code',
        title: 'Using layered classes in markup',
        language: 'html',
        code: `<button class="button bg-transparent text-navy">
  Ghost button
</button>`,
      },
      { type: 'h2', text: 'Importing into layers' },
      {
        type: 'code',
        title: 'Place vendor CSS into a controlled layer',
        language: 'css',
        code: `@import url('vendor-carousel.css') layer(vendor);

@layer vendor, tokens, components, utilities;

@layer components {
  .carousel__dot {
    /* Your overrides can win predictably */
    inline-size: 0.75rem;
    block-size: 0.75rem;
  }
}`,
      },
      {
        type: 'tip',
        text: 'Unlayered styles beat layered styles. That is useful for emergency overrides, but treat unlayered CSS as an exception so your architecture stays predictable.',
      },
      { type: 'h2', text: 'A practical layer map' },
      {
        type: 'table',
        headers: ['Layer', 'Owns', 'Should override'],
        rows: [
          ['reset', 'Box model and element defaults', 'Browser defaults only'],
          ['tokens', 'Custom properties and themes', 'Reset values'],
          ['base', 'Element typography and links', 'Tokens as needed'],
          ['components', 'Reusable UI blocks', 'Base styles'],
          ['utilities', 'One-off intentional helpers', 'Components'],
        ],
      },
      {
        type: 'warning',
        text: '!important inside a layer reverses layer order for those declarations. Avoid relying on that behavior unless you are maintaining a framework escape hatch.',
      },
      {
        type: 'try',
        text: 'Create three layers named base, components, and utilities. Put a .card background in components and a .bg-sand utility in utilities. Confirm the utility wins without increasing specificity.',
      },
      {
        type: 'keypoints',
        items: [
          '@layer groups rules into cascade buckets with a declared order.',
          'Later layers beat earlier layers even with equal or lower specificity.',
          'Import third-party CSS into a named layer to keep overrides sane.',
          'Unlayered CSS outranks layered CSS, so use it sparingly.',
        ],
      },
    ],
  },
  {
    slug: 'nesting-css',
    title: 'Native CSS Nesting',
    description:
      'Write nested CSS rules natively in the browser, keeping component styles readable without a preprocessor requirement.',
    level: 'advanced',
    section: 'Modern CSS',
    order: 53,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Native CSS nesting lets you group related selectors inside a parent rule. The result reads like the structure of your component, and modern browsers understand it without Sass or Less.',
      },
      {
        type: 'p',
        text: 'Nesting is a clarity tool. Keep nesting shallow, mirror your component boundaries, and avoid selectors that become impossible to reuse.',
      },
      { type: 'h2', text: 'Basic nesting with &' },
      {
        type: 'code',
        title: 'Component styles grouped together',
        language: 'css',
        code: `.card {
  padding: 1.25rem;
  background: white;

  & h2 {
    margin-block: 0 0.5rem;
    font-size: 1.25rem;
  }

  & p {
    margin: 0;
    color: #444;
  }

  &:hover {
    box-shadow: 0 8px 24px rgb(0 0 0 / 0.08);
  }

  &.is-featured {
    border-inline-start: 4px solid teal;
  }
}`,
      },
      {
        type: 'note',
        text: 'The & symbol represents the parent selector. &:hover compiles conceptually to .card:hover, and &.is-featured becomes .card.is-featured.',
      },
      { type: 'h2', text: 'Nesting media queries' },
      {
        type: 'code',
        title: 'Keep breakpoints next to the component',
        language: 'css',
        code: `.hero {
  padding-block: 2rem;

  @media (min-width: 48rem) {
    padding-block: 4rem;
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 2rem;
  }
}`,
      },
      { type: 'h2', text: 'Nested combinators and lists' },
      {
        type: 'code',
        title: 'Readable descendant and sibling patterns',
        language: 'css',
        code: `.menu {
  display: flex;
  gap: 0.5rem;

  & a {
    text-decoration: none;
    padding: 0.5rem 0.75rem;
  }

  & a:hover,
  & a:focus-visible {
    background: #eee;
  }

  & li + li {
    border-inline-start: 1px solid #ddd;
  }
}`,
      },
      {
        type: 'tip',
        text: 'If a nested selector starts with an identifier, include &. Writing .card { .title {} } is invalid in native nesting; write .card { & .title {} } or .card { .title & {} } depending on intent.',
      },
      { type: 'h2', text: 'Nesting with @layer' },
      {
        type: 'code',
        title: 'Layered nested component',
        language: 'css',
        code: `@layer components {
  .tabs {
    display: flex;
    gap: 0.25rem;

    & [role="tab"] {
      border: 0;
      background: transparent;
      padding: 0.75rem 1rem;
    }

    & [role="tab"][aria-selected="true"] {
      border-block-end: 2px solid currentColor;
      font-weight: 700;
    }
  }
}`,
      },
      {
        type: 'warning',
        text: 'Deep nesting recreates the old specificity trap. Prefer two levels for most UI work. If you need a third, ask whether a new class would communicate intent better.',
      },
      {
        type: 'try',
        text: 'Rewrite a flat .card, .card__title, .card__body, .card:hover rule set into nested native CSS. Keep the same specificity and confirm hover and featured states still work.',
      },
      {
        type: 'keypoints',
        items: [
          'Native nesting groups related selectors inside a parent rule.',
          '& stands in for the parent selector in compound and pseudo-class patterns.',
          'Nested media queries keep responsive tweaks next to the component.',
          'Shallow nesting stays maintainable; deep trees become brittle.',
        ],
      },
    ],
  },
  {
    slug: 'bem-naming',
    title: 'BEM Naming',
    description:
      'Name CSS classes with Block, Element, Modifier so large stylesheets stay searchable, predictable, and low in specificity.',
    level: 'advanced',
    section: 'CSS Architecture',
    order: 54,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'BEM stands for Block, Element, Modifier. It is a naming convention that makes class names describe structure and state instead of visual accidents. Teams use it so components remain portable and styles rarely leak.',
      },
      {
        type: 'p',
        text: 'You do not need a framework to benefit from BEM. The value is clarity: a class tells you which component owns the style, which piece of that component is targeted, and which variation is active.',
      },
      { type: 'h2', text: 'The three parts' },
      {
        type: 'ul',
        items: [
          'Block: a standalone component, such as card or site-header.',
          'Element: a piece of the block, written as block__element.',
          'Modifier: a variation or state, written as block--modifier or block__element--modifier.',
        ],
      },
      {
        type: 'code',
        title: 'BEM markup for a media card',
        language: 'html',
        code: `<article class="card card--featured">
  <img class="card__media" src="desk.jpg" alt="">
  <div class="card__body">
    <h2 class="card__title">Focus rituals</h2>
    <p class="card__text">A short guide to deep work setups.</p>
    <a class="card__action card__action--primary" href="/guide">Read guide</a>
  </div>
</article>`,
      },
      {
        type: 'code',
        title: 'Matching BEM CSS',
        language: 'css',
        code: `.card {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  background: white;
}

.card--featured {
  border-inline-start: 4px solid teal;
}

.card__title {
  margin: 0;
  font-size: 1.25rem;
}

.card__action {
  display: inline-flex;
  text-decoration: none;
}

.card__action--primary {
  background: teal;
  color: white;
  padding: 0.6rem 1rem;
}`,
      },
      {
        type: 'note',
        text: 'Elements belong to one block. Avoid .card__body__title. If nesting gets deep, promote a nested piece into its own block, such as .price-tag.',
      },
      { type: 'h2', text: 'Why BEM keeps specificity calm' },
      {
        type: 'p',
        text: 'BEM prefers single classes over element and descendant selectors. That means overrides are usually another class, not a specificity climb.',
      },
      {
        type: 'table',
        headers: ['Pattern', 'Example', 'Risk'],
        rows: [
          ['BEM class', '.card__title', 'Low specificity, clear ownership'],
          ['Tag + class', 'h2.card__title', 'Harder reuse, tighter HTML coupling'],
          ['Deep descendant', '.card .body .title', 'Leakage and override pain'],
        ],
      },
      { type: 'h2', text: 'Modifiers for state and variation' },
      {
        type: 'code',
        title: 'State modifiers without nesting traps',
        language: 'css',
        code: `.nav__link {
  color: inherit;
}

.nav__link--active {
  font-weight: 700;
  text-decoration: underline;
}

.button {
  border: 0;
  padding: 0.75rem 1rem;
}

.button--ghost {
  background: transparent;
  box-shadow: inset 0 0 0 1px currentColor;
}

.button--disabled,
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`,
      },
      {
        type: 'tip',
        text: 'Use modifiers for intentional variants. Do not invent .card--margin-top-large for one-off spacing; that belongs in layout utilities or a composition wrapper.',
      },
      {
        type: 'warning',
        text: 'BEM class names can get long. That length is a feature when it removes ambiguity. Abbreviate only when the whole team shares a glossary.',
      },
      {
        type: 'try',
        text: 'Convert a nested .sidebar h2 / .sidebar .link.active stylesheet into BEM classes. Keep the visual result identical and confirm no tag selectors remain in the component CSS.',
      },
      {
        type: 'keypoints',
        items: [
          'BEM names communicate block, element, and modifier roles.',
          'Single-class selectors keep specificity low and overrides predictable.',
          'Elements should not nest endlessly; extract new blocks when needed.',
          'Modifiers express variation and state without fragile descendant chains.',
        ],
      },
    ],
  },
  {
    slug: 'utility-vs-semantic',
    title: 'Utility vs Semantic CSS',
    description:
      'Choose when to write semantic component classes and when utility classes are the clearer, faster tool.',
    level: 'advanced',
    section: 'CSS Architecture',
    order: 55,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Semantic CSS names the thing: .invoice-table, .profile-header, .checkout-summary. Utility CSS names the visual job: .mt-4, .flex, .text-center. Strong teams usually mix both, with a clear rule for where each belongs.',
      },
      {
        type: 'p',
        text: 'The goal is not purity. The goal is speed of change without chaos. Semantic classes excel for reusable UI meaning. Utilities excel for one-off composition and spacing decisions.',
      },
      { type: 'h2', text: 'Semantic classes encode product language' },
      {
        type: 'code',
        title: 'A semantic component owns its look',
        language: 'css',
        code: `.pricing-card {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #d9d2c5;
  background: #fffdf8;
}

.pricing-card__price {
  font-size: clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem);
  font-weight: 700;
}`,
      },
      {
        type: 'note',
        text: 'If designers and developers both say "pricing card," a semantic class keeps that shared language in the codebase.',
      },
      { type: 'h2', text: 'Utilities encode implementation details' },
      {
        type: 'code',
        title: 'Utility composition in markup',
        language: 'html',
        code: `<section class="mx-auto max-w-3xl px-4 py-12">
  <p class="text-sm uppercase tracking-wide">Journal</p>
  <h1 class="mt-2 text-4xl font-semibold">Field notes</h1>
</section>`,
      },
      {
        type: 'code',
        title: 'Small utility set in plain CSS',
        language: 'css',
        code: `@layer utilities {
  .mx-auto { margin-inline: auto; }
  .max-w-3xl { max-inline-size: 48rem; }
  .px-4 { padding-inline: 1rem; }
  .py-12 { padding-block: 3rem; }
  .mt-2 { margin-block-start: 0.5rem; }
  .text-sm { font-size: 0.875rem; }
  .text-4xl { font-size: 2.25rem; }
  .font-semibold { font-weight: 600; }
  .uppercase { text-transform: uppercase; }
  .tracking-wide { letter-spacing: 0.06em; }
}`,
      },
      { type: 'h2', text: 'A practical decision guide' },
      {
        type: 'table',
        headers: ['Situation', 'Prefer', 'Why'],
        rows: [
          ['Reusable UI with meaning', 'Semantic component', 'One place to redesign the pattern'],
          ['Page-specific spacing', 'Utilities', 'Avoid inventing one-off class names'],
          ['Complex interactive widget', 'Semantic + light utilities', 'Behavior stays named; layout stays flexible'],
          ['Design system primitives', 'Both', 'Components for UI, utilities for composition'],
        ],
      },
      {
        type: 'tip',
        text: 'If you reuse the same three utility clusters often, extract a semantic component. If a semantic class is only used once and describes layout trivia, it is probably a utility in disguise.',
      },
      { type: 'h2', text: 'Hybrid architecture that scales' },
      {
        type: 'ol',
        items: [
          'Put tokens and base element styles in early layers.',
          'Build semantic components for product UI patterns.',
          'Expose a small, consistent utility layer for spacing, type, and visibility.',
          'Document when contributors should extract a new component.',
        ],
      },
      {
        type: 'warning',
        text: 'Unlimited utility soup can hide design intent. Unlimited semantic classes can create a graveyard of never-reused names. Review both during pull requests.',
      },
      {
        type: 'try',
        text: 'Restyle a landing section twice: once with only semantic classes, once with mostly utilities. Note which version is easier to tweak for spacing and which is easier to reuse as a product pattern.',
      },
      {
        type: 'keypoints',
        items: [
          'Semantic CSS names UI meaning; utility CSS names visual jobs.',
          'Use semantic classes for reusable product patterns.',
          'Use utilities for composition, spacing, and one-off layout tweaks.',
          'A hybrid system with clear extraction rules usually wins in real teams.',
        ],
      },
    ],
  },
  {
    slug: 'design-tokens',
    title: 'Design Tokens in CSS',
    description:
      'Centralize color, space, type, and motion decisions as CSS custom properties so themes and products stay consistent.',
    level: 'advanced',
    section: 'CSS Architecture',
    order: 56,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Design tokens are named decisions. Instead of scattering #0b3d2e or 1.25rem through components, you store --color-brand and --space-4 once, then reference those names everywhere.',
      },
      {
        type: 'p',
        text: 'In CSS, custom properties are the practical token format. They theme well, cascade naturally, and can be overridden per section, brand, or color scheme.',
      },
      { type: 'h2', text: 'Token tiers' },
      {
        type: 'ul',
        items: [
          'Primitive tokens: raw values such as --green-700 or --space-16.',
          'Semantic tokens: purpose names such as --color-success or --space-section.',
          'Component tokens: local aliases such as --button-bg referencing semantic tokens.',
        ],
      },
      {
        type: 'code',
        title: 'Primitives mapped to semantic tokens',
        language: 'css',
        code: `:root {
  /* primitives */
  --green-700: #0b3d2e;
  --green-100: #e5f2ec;
  --sand-50: #f7f4ef;
  --ink-900: #1c1a17;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
  --radius-md: 0.75rem;
  --font-sans: "Source Serif 4", "Georgia", serif;

  /* semantic */
  --color-bg: var(--sand-50);
  --color-fg: var(--ink-900);
  --color-brand: var(--green-700);
  --color-brand-soft: var(--green-100);
  --space-section: clamp(2.5rem, 1.5rem + 4vw, 5rem);
}`,
      },
      { type: 'h2', text: 'Use tokens in components' },
      {
        type: 'code',
        title: 'Components consume meaning, not raw hex',
        language: 'css',
        code: `.button {
  --button-bg: var(--color-brand);
  --button-fg: white;

  background: var(--button-bg);
  color: var(--button-fg);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
}

.button--soft {
  --button-bg: var(--color-brand-soft);
  --button-fg: var(--color-brand);
}`,
      },
      {
        type: 'tip',
        text: 'Alias component tokens when a component needs multiple themes. Swapping --button-bg is clearer than rewriting every property in a modifier.',
      },
      { type: 'h2', text: 'Theming with cascade' },
      {
        type: 'code',
        title: 'Dark scheme and branded region overrides',
        language: 'css',
        code: `@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #12110f;
    --color-fg: #f4f0e8;
    --color-brand-soft: #163528;
  }
}

.theme-forest {
  --color-brand: #14532d;
  --color-brand-soft: #dcfce7;
}

.banner {
  background: var(--color-brand);
  color: white;
  padding: var(--space-8);
}`,
      },
      {
        type: 'code',
        title: 'Scoped theme in HTML',
        language: 'html',
        code: `<section class="theme-forest">
  <div class="banner">
    <h2>Seasonal collection</h2>
  </div>
</section>`,
      },
      {
        type: 'note',
        text: 'Semantic names protect components when primitives change. If marketing swaps brand green, you update tokens, not every component file.',
      },
      { type: 'h2', text: 'What belongs in the token set' },
      {
        type: 'table',
        headers: ['Category', 'Examples', 'Advice'],
        rows: [
          ['Color', 'bg, fg, brand, danger', 'Prefer semantic names in UI code'],
          ['Space', '2, 4, 8, section', 'Use a limited scale'],
          ['Typography', 'font families, step sizes', 'Clamp fluid steps as tokens'],
          ['Motion', 'duration, easing', 'Respect reduced motion later'],
          ['Elevation', 'shadow-sm, shadow-lg', 'Keep soft and consistent'],
        ],
      },
      {
        type: 'warning',
        text: 'Do not tokenize every magic number on day one. Start with color, space, radius, and type. Grow the set when repetition becomes obvious.',
      },
      {
        type: 'try',
        text: 'Extract colors and spacing from an existing page into :root tokens. Refactor two components to use only semantic tokens, then create a .theme-contrast scope that remaps those semantic values.',
      },
      {
        type: 'keypoints',
        items: [
          'Tokens are named design decisions stored as custom properties.',
          'Separate primitives from semantic and component aliases.',
          'Theme by reassigning semantic tokens in a cascade scope.',
          'Keep the token set small enough that people actually reuse it.',
        ],
      },
    ],
  },
  {
    slug: 'accessibility-css',
    title: 'Accessibility-Friendly CSS',
    description:
      'Use CSS to support keyboard users, motion preferences, contrast, focus visibility, and content that remains usable when styles change.',
    level: 'advanced',
    section: 'CSS Architecture',
    order: 57,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Accessible CSS does not replace good HTML. It supports the experience after the markup is sound: visible focus, readable contrast, flexible text, and respect for user motion and zoom preferences.',
      },
      {
        type: 'p',
        text: 'Advanced CSS skills include knowing which visual flourishes help and which ones hide meaning. The best interfaces stay clear under keyboard navigation, high zoom, and forced colors.',
      },
      { type: 'h2', text: 'Never remove focus without a better replacement' },
      {
        type: 'code',
        title: 'Focus styles that respect keyboard users',
        language: 'css',
        code: `:focus {
  outline: none; /* do not stop here */
}

:focus-visible {
  outline: 3px solid #0b5fff;
  outline-offset: 3px;
}

.button:focus-visible {
  outline-color: #ffb703;
}`,
      },
      {
        type: 'warning',
        text: 'outline: none with no replacement is a common accessibility failure. If you restyle focus, make the replacement at least as obvious as the browser default.',
      },
      { type: 'h2', text: 'Support reduced motion' },
      {
        type: 'code',
        title: 'Motion preferences',
        language: 'css',
        code: `.hero__art {
  transition: transform 400ms ease;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`,
      },
      {
        type: 'tip',
        text: 'Prefer a project-wide reduced-motion reset, then re-enable tiny transitions only where they still aid understanding.',
      },
      { type: 'h2', text: 'Keep text flexible' },
      {
        type: 'code',
        title: 'Avoid locking users out of zoom and wrapping',
        language: 'css',
        code: `html {
  font-size: 100%;
}

body {
  line-height: 1.5;
  text-wrap: pretty;
}

.card__title {
  font-size: clamp(1.25rem, 1.1rem + 0.8vw, 1.75rem);
  overflow-wrap: anywhere;
}

.truncate-safe {
  max-inline-size: 100%;
  overflow-wrap: break-word;
}`,
      },
      {
        type: 'note',
        text: 'Fixed pixel font sizes on html can fight user browser settings. Prefer rem-based type and flexible containers.',
      },
      { type: 'h2', text: 'Visible states and target sizes' },
      {
        type: 'code',
        title: 'Interactive affordances',
        language: 'css',
        code: `.link {
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.18em;
}

.icon-button {
  inline-size: 2.75rem;
  block-size: 2.75rem;
}

@media (forced-colors: active) {
  .button {
    border: 1px solid ButtonText;
  }
}`,
      },
      {
        type: 'ul',
        items: [
          'Do not use color alone to signal errors; add icons or text.',
          'Ensure body text contrast is strong against backgrounds.',
          'Keep hit targets large enough for pointers and touch.',
          'Preserve meaning when images or decorative icons fail to load.',
        ],
      },
      { type: 'h2', text: 'Content that remains available to assistive tech' },
      {
        type: 'code',
        title: 'Visually hidden, not removed',
        language: 'css',
        code: `.visually-hidden {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

[hidden] {
  display: none !important;
}`,
      },
      {
        type: 'try',
        text: 'Audit a page by tabbing through every control. Improve any missing :focus-visible styles, then add a prefers-reduced-motion block that quiets nonessential animation.',
      },
      {
        type: 'keypoints',
        items: [
          'Accessible CSS supports keyboard focus, contrast, and flexible text.',
          'Replace focus outlines carefully; never delete them outright.',
          'Honor prefers-reduced-motion and forced-colors where relevant.',
          'Use visually hidden patterns when text must remain available but not visible.',
        ],
      },
    ],
  },
  {
    slug: 'print-css',
    title: 'Print Stylesheets',
    description:
      'Craft print-ready pages with @media print so articles, invoices, and reports stay readable on paper and PDFs.',
    level: 'advanced',
    section: 'CSS Architecture',
    order: 58,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Print stylesheets are still part of professional frontend work. Users print boarding passes, receipts, documentation, and reports. A few targeted rules can turn a noisy web layout into a clean paper document.',
      },
      {
        type: 'p',
        text: 'Treat print as another viewport with different constraints: no sticky chrome, limited color, careful page breaks, and links that may need visible URLs.',
      },
      { type: 'h2', text: 'Start with a print media block' },
      {
        type: 'code',
        title: 'Baseline print resets',
        language: 'css',
        code: `@media print {
  @page {
    margin: 1.5cm;
  }

  body {
    background: white;
    color: black;
    font-size: 12pt;
    line-height: 1.45;
  }

  .site-header,
  .site-footer,
  .promo,
  .cookie-banner,
  .no-print {
    display: none !important;
  }
}`,
      },
      { type: 'h2', text: 'Make content flow for pages' },
      {
        type: 'code',
        title: 'Page breaks and link affordances',
        language: 'css',
        code: `@media print {
  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.9em;
    word-break: break-all;
  }

  h2,
  h3 {
    break-after: avoid;
    page-break-after: avoid;
  }

  table,
  figure,
  pre {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .invoice-table {
    width: 100%;
    border-collapse: collapse;
  }

  .invoice-table th,
  .invoice-table td {
    border-bottom: 1px solid #333;
    padding: 0.35rem 0.25rem;
    text-align: start;
  }
}`,
      },
      {
        type: 'tip',
        text: 'Use both the modern break-* properties and older page-break-* aliases when you need broader print engine support.',
      },
      { type: 'h2', text: 'Expand collapsed or interactive content if needed' },
      {
        type: 'code',
        title: 'Reveal content that screen UI may hide',
        language: 'css',
        code: `@media print {
  details {
    open: true;
  }

  details > *:not(summary) {
    display: block !important;
  }

  .tabs__panel {
    display: block !important;
  }

  .shadow-card {
    box-shadow: none;
    border: 1px solid #444;
  }
}`,
      },
      {
        type: 'note',
        text: 'Not every browser honors open styling for details the same way. For critical print documents, render a dedicated print view in HTML when interactive widgets are too complex.',
      },
      { type: 'h2', text: 'Color and contrast on paper' },
      {
        type: 'ul',
        items: [
          'Prefer dark text on white for body copy.',
          'Convert low-contrast gray text to a darker ink color.',
          'Avoid relying on background colors to convey meaning.',
          'Test PDF export as well as a physical printer when possible.',
        ],
      },
      {
        type: 'warning',
        text: 'Browsers may suppress backgrounds by default to save ink. Important branding blocks should not depend solely on background-color for meaning.',
      },
      {
        type: 'try',
        text: 'Add a print stylesheet to an article page. Hide navigation and ads, enlarge body text to a print-friendly size, and ensure code blocks or tables do not split awkwardly across pages.',
      },
      {
        type: 'keypoints',
        items: [
          '@media print lets you tailor a page for paper and PDFs.',
          'Hide chrome, simplify color, and control page breaks.',
          'Reveal content that screen interactions might leave collapsed.',
          'Verify real print/PDF output, not only the on-screen preview.',
        ],
      },
    ],
  },
  {
    slug: 'capstone-design-system',
    title: 'Capstone: Mini Design System',
    description:
      'Build a compact CSS design system with tokens, layers, base styles, components, and utilities you can reuse across pages.',
    level: 'advanced',
    section: 'Capstones',
    order: 59,
    minutes: 22,
    content: [
      {
        type: 'p',
        text: 'This capstone pulls modern CSS and architecture together. You will create a mini design system that can power a marketing page and an app shell without rewriting foundational decisions each time.',
      },
      {
        type: 'p',
        text: 'Keep the system intentionally small. A useful starter kit beats an unfinished mega library. Focus on tokens, typography, buttons, forms, cards, and layout helpers.',
      },
      { type: 'h2', text: 'Project goals' },
      {
        type: 'ol',
        items: [
          'Define primitive and semantic tokens.',
          'Establish cascade layers for reset, tokens, base, components, and utilities.',
          'Ship at least five reusable components.',
          'Document how to add a new component without breaking layer order.',
        ],
      },
      { type: 'h2', text: 'Starter file structure' },
      {
        type: 'code',
        title: 'Suggested CSS entry structure',
        language: 'css',
        code: `/* styles/system.css */
@layer reset, tokens, base, components, utilities;

@import url('./reset.css') layer(reset);
@import url('./tokens.css') layer(tokens);
@import url('./base.css') layer(base);
@import url('./components.css') layer(components);
@import url('./utilities.css') layer(utilities);`,
      },
      {
        type: 'code',
        title: 'Token foundation',
        language: 'css',
        code: `/* tokens.css */
@layer tokens {
  :root {
    --font-display: "Fraunces", "Georgia", serif;
    --font-body: "Manrope", "Segoe UI", sans-serif;

    --ink-900: #171412;
    --sand-50: #f6f1ea;
    --teal-700: #0f5c56;
    --teal-100: #d8f1ee;
    --coral-600: #c24a2b;

    --color-bg: var(--sand-50);
    --color-fg: var(--ink-900);
    --color-brand: var(--teal-700);
    --color-accent: var(--coral-600);

    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --radius-sm: 0.5rem;
    --radius-lg: 1rem;
    --shadow-md: 0 10px 30px rgb(23 20 18 / 0.08);
  }
}`,
      },
      { type: 'h2', text: 'Base and components' },
      {
        type: 'code',
        title: 'Base typography and a button component',
        language: 'css',
        code: `/* base.css */
@layer base {
  body {
    margin: 0;
    font-family: var(--font-body);
    background: var(--color-bg);
    color: var(--color-fg);
    line-height: 1.6;
  }

  h1, h2, h3 {
    font-family: var(--font-display);
    line-height: 1.2;
  }

  a {
    color: var(--color-brand);
  }

  :focus-visible {
    outline: 3px solid var(--color-accent);
    outline-offset: 3px;
  }
}

/* components.css */
@layer components {
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: 0.7rem 1.1rem;
    border: 0;
    border-radius: var(--radius-sm);
    background: var(--color-brand);
    color: white;
    font: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  .button--ghost {
    background: transparent;
    color: var(--color-brand);
    box-shadow: inset 0 0 0 1px currentColor;
  }

  .card {
    background: white;
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    box-shadow: var(--shadow-md);
  }

  .field {
    display: grid;
    gap: var(--space-2);
  }

  .field input,
  .field textarea {
    font: inherit;
    padding: 0.7rem 0.8rem;
    border: 1px solid #cfc5b8;
    border-radius: var(--radius-sm);
    background: white;
  }
}`,
      },
      {
        type: 'code',
        title: 'Sample page using the system',
        language: 'html',
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mini Design System Demo</title>
    <link rel="stylesheet" href="/styles/system.css">
  </head>
  <body>
    <main class="container py-8">
      <article class="card">
        <h1>Design tokens at work</h1>
        <p>Buttons, fields, and cards share one token source.</p>
        <p>
          <a class="button" href="#join">Get started</a>
          <a class="button button--ghost" href="#docs">Docs</a>
        </p>
      </article>
    </main>
  </body>
</html>`,
      },
      { type: 'h2', text: 'Acceptance checklist' },
      {
        type: 'ul',
        items: [
          'All colors and spacing in components come from tokens.',
          'Utilities can override component visuals through layer order.',
          'Focus styles are visible on every interactive component.',
          'A second theme scope can remap semantic tokens without rewriting components.',
        ],
      },
      {
        type: 'try',
        text: 'Finish the mini system with card, button, field, badge, and container components. Then build a tiny kitchen-sink page that renders every component and both button variants.',
      },
      {
        type: 'keypoints',
        items: [
          'A mini design system starts with tokens and cascade layers.',
          'Keep the first component set small and reusable.',
          'Base styles handle document defaults; components handle UI patterns.',
          'Document extension rules so the system stays coherent as it grows.',
        ],
      },
    ],
  },
  {
    slug: 'capstone-marketing-page',
    title: 'Capstone: Marketing Page',
    description:
      'Compose a polished marketing landing page with fluid type, logical spacing, modern selectors, and your mini design system.',
    level: 'advanced',
    section: 'Capstones',
    order: 60,
    minutes: 22,
    content: [
      {
        type: 'p',
        text: 'Marketing pages test taste and structure at once. You need a strong first viewport, clear sections, and CSS that stays maintainable after the campaign copy changes.',
      },
      {
        type: 'p',
        text: 'Use the mini design system from the previous lesson. This capstone is about composition: hero, social proof strip, feature story, and final call to action.',
      },
      { type: 'h2', text: 'Page outline' },
      {
        type: 'ol',
        items: [
          'Header with brand and primary CTA.',
          'Full-bleed hero with one headline and one supporting sentence.',
          'Feature section with three points.',
          'Testimonial or proof section.',
          'Closing CTA band and simple footer.',
        ],
      },
      {
        type: 'code',
        title: 'Semantic marketing structure',
        language: 'html',
        code: `<body>
  <header class="site-header">
    <a class="brand" href="/">Northlane Studio</a>
    <nav aria-label="Primary">
      <a href="#work">Work</a>
      <a href="#services">Services</a>
      <a class="button" href="#contact">Book a call</a>
    </nav>
  </header>

  <main>
    <section class="hero">
      <h1>Brand systems that feel inevitable</h1>
      <p>We design identity, web, and launch campaigns for product-led teams.</p>
      <p>
        <a class="button" href="#contact">Start a project</a>
        <a class="button button--ghost" href="#work">See selected work</a>
      </p>
    </section>

    <section id="services" class="section">
      <h2>Services</h2>
      <div class="feature-grid">
        <article class="card"><h3>Identity</h3><p>Logos, type, and color tokens.</p></article>
        <article class="card"><h3>Web</h3><p>Marketing sites with disciplined CSS.</p></article>
        <article class="card"><h3>Launch</h3><p>Campaign pages that convert cleanly.</p></article>
      </div>
    </section>
  </main>
</body>`,
      },
      { type: 'h2', text: 'Hero and section CSS' },
      {
        type: 'code',
        title: 'Atmospheric hero with fluid type',
        language: 'css',
        code: `.hero {
  min-block-size: 100svh;
  display: grid;
  align-content: center;
  gap: var(--space-4);
  padding-inline: clamp(1rem, 0.5rem + 3vw, 3rem);
  padding-block: clamp(3rem, 2rem + 6vw, 7rem);
  background:
    linear-gradient(120deg, rgb(15 92 86 / 0.92), rgb(23 20 18 / 0.55)),
    url("/images/studio.jpg") center / cover no-repeat;
  color: white;
}

.hero h1 {
  max-inline-size: 14ch;
  font-size: clamp(2.4rem, 1.4rem + 4vw, 5rem);
  margin: 0;
}

.hero p {
  max-inline-size: 40ch;
  font-size: clamp(1rem, 0.95rem + 0.4vw, 1.2rem);
}

.section {
  padding-block: var(--space-section);
  padding-inline: clamp(1rem, 0.5rem + 3vw, 3rem);
}

.feature-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
}

.site-header:has(a:focus-visible) {
  outline: 2px dashed var(--color-accent);
  outline-offset: 4px;
}`,
      },
      {
        type: 'tip',
        text: 'Keep the first viewport disciplined: brand, one headline, one sentence, one CTA group, and one dominant visual plane. Push stats and secondary promos further down the page.',
      },
      { type: 'h2', text: 'Quality bar for this capstone' },
      {
        type: 'ul',
        items: [
          'Logical properties for spacing and alignment.',
          'clamp() for type and section padding.',
          'No em dash characters in copy.',
          'Print stylesheet that hides navigation and keeps article-like sections readable.',
          'Works at 320px width without horizontal scrolling.',
        ],
      },
      {
        type: 'warning',
        text: 'Do not solve every layout with nested absolute positioning. Prefer flow, grid, and constrained measure for readable marketing sections.',
      },
      {
        type: 'try',
        text: 'Ship the full landing page with hero, services, proof, and closing CTA. Then create a second color theme by remapping semantic tokens only.',
      },
      {
        type: 'keypoints',
        items: [
          'Marketing pages succeed when hierarchy stays simple and visual.',
          'Compose with your system tokens instead of one-off magic values.',
          'Fluid type and logical spacing keep campaigns responsive.',
          'Validate mobile width, focus states, and print output before calling it done.',
        ],
      },
    ],
  },
  {
    slug: 'capstone-app-shell',
    title: 'Capstone: App Shell Layout',
    description:
      'Build a responsive application shell with sticky header, collapsible navigation, main content, and utility regions.',
    level: 'advanced',
    section: 'Capstones',
    order: 61,
    minutes: 22,
    content: [
      {
        type: 'p',
        text: 'An app shell is the frame around product UI: top bar, navigation, main workspace, and optional aside. Getting this layout right once saves every future screen from reinventing structure.',
      },
      {
        type: 'p',
        text: 'This capstone emphasizes grid template areas, sticky regions, overflow behavior, and CSS that adapts from a compact mobile stack to a multi-pane desktop workspace.',
      },
      { type: 'h2', text: 'Shell requirements' },
      {
        type: 'ul',
        items: [
          'Sticky header with brand, search, and account menu trigger.',
          'Navigation that becomes a drawer pattern on small screens.',
          'Scrollable main content that does not force the whole page to jump awkwardly.',
          'Optional aside for filters or contextual help.',
        ],
      },
      {
        type: 'code',
        title: 'App shell markup',
        language: 'html',
        code: `<div class="app-shell">
  <header class="app-shell__header">
    <button class="button button--ghost" type="button" aria-controls="app-nav" aria-expanded="false">
      Menu
    </button>
    <a class="brand" href="/app">Ledgerly</a>
    <form role="search">
      <label class="visually-hidden" for="q">Search</label>
      <input id="q" name="q" type="search" placeholder="Search records">
    </form>
  </header>

  <nav id="app-nav" class="app-shell__nav" aria-label="App">
    <a href="/app" aria-current="page">Dashboard</a>
    <a href="/app/invoices">Invoices</a>
    <a href="/app/clients">Clients</a>
  </nav>

  <main class="app-shell__main">
    <h1>Dashboard</h1>
    <section class="card">Welcome back.</section>
  </main>

  <aside class="app-shell__aside" aria-label="Context">
    <h2>Today</h2>
    <p>3 invoices awaiting review.</p>
  </aside>
</div>`,
      },
      {
        type: 'code',
        title: 'Responsive shell with grid areas',
        language: 'css',
        code: `.app-shell {
  min-block-size: 100svh;
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "aside";
  grid-template-rows: auto 1fr auto;
}

.app-shell__header {
  grid-area: header;
  position: sticky;
  inset-block-start: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: white;
  border-block-end: 1px solid #e4ddd2;
}

.app-shell__nav {
  display: none;
  padding: var(--space-4);
  background: #fffdf9;
  border-block-end: 1px solid #e4ddd2;
}

.app-shell__nav.is-open,
.app-shell:has(#app-nav:target) .app-shell__nav {
  display: grid;
  gap: var(--space-2);
}

.app-shell__main {
  grid-area: main;
  padding: var(--space-4);
  overflow: auto;
}

.app-shell__aside {
  grid-area: aside;
  padding: var(--space-4);
  border-block-start: 1px solid #e4ddd2;
  background: white;
}

@media (min-width: 64rem) {
  .app-shell {
    grid-template-areas:
      "header header header"
      "nav main aside";
    grid-template-columns: 14rem 1fr 18rem;
    grid-template-rows: auto 1fr;
  }

  .app-shell__nav {
    display: grid;
    gap: var(--space-2);
    grid-area: nav;
    border-block-end: 0;
    border-inline-end: 1px solid #e4ddd2;
    position: sticky;
    inset-block-start: 3.5rem;
    block-size: calc(100svh - 3.5rem);
    overflow: auto;
  }

  .app-shell__aside {
    border-block-start: 0;
    border-inline-start: 1px solid #e4ddd2;
    position: sticky;
    inset-block-start: 3.5rem;
    block-size: calc(100svh - 3.5rem);
    overflow: auto;
  }
}`,
      },
      {
        type: 'note',
        text: 'For production apps, pair the menu button with a small script or details/summary pattern to toggle aria-expanded and the is-open class. The layout CSS above is ready either way.',
      },
      { type: 'h2', text: 'Interaction and accessibility details' },
      {
        type: 'ul',
        items: [
          'Trap focus only if you use a true modal drawer; otherwise keep tab order natural.',
          'Mark the current nav item with aria-current="page".',
          'Ensure sticky panes do not hide focus outlines behind the header.',
          'Test keyboard access for search and navigation at mobile width.',
        ],
      },
      {
        type: 'tip',
        text: 'Use 100svh carefully. It improves mobile shell height behavior, but still verify on iOS and Android browsers where toolbars resize.',
      },
      {
        type: 'try',
        text: 'Implement the full shell and place two sample screens into main: a dashboard card grid and an invoice table. Confirm sticky nav and aside behavior on desktop and stacked flow on mobile.',
      },
      {
        type: 'keypoints',
        items: [
          'App shells define durable structure for product pages.',
          'Grid template areas keep header, nav, main, and aside understandable.',
          'Sticky regions need explicit overflow and height rules.',
          'Mobile navigation should preserve accessibility semantics while changing presentation.',
        ],
      },
    ],
  },
  {
    slug: 'performance-css',
    title: 'CSS Performance Tips',
    description:
      'Write CSS that stays fast: fewer layout thrash risks, lean selectors, efficient animations, and delivery habits that reduce render delay.',
    level: 'advanced',
    section: 'Capstones',
    order: 62,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'CSS performance is usually about avoiding unnecessary work. Browsers are excellent at styling, but huge stylesheets, expensive selectors, and layout-triggering animations can still make interfaces feel heavy.',
      },
      {
        type: 'p',
        text: 'Focus on the wins that matter in real products: critical CSS delivery, containment where useful, compositor-friendly motion, and selectors that are specific without being pathological.',
      },
      { type: 'h2', text: 'Selector and cascade hygiene' },
      {
        type: 'ul',
        items: [
          'Prefer class-based component selectors over long descendant chains.',
          'Avoid universal selectors in hot paths when a clearer class exists.',
          'Use layers so you do not escalate specificity as the app grows.',
          'Delete dead CSS during refactors; unused rules still cost download and parse time.',
        ],
      },
      {
        type: 'code',
        title: 'Cheaper, clearer selectors',
        language: 'css',
        code: `/* Costly and brittle */
body .layout .sidebar ul li a.active span.label {
  color: crimson;
}

/* Prefer */
.sidebar__link.is-active {
  color: crimson;
}`,
      },
      { type: 'h2', text: 'Animate properties the browser can composite' },
      {
        type: 'code',
        title: 'Transform and opacity over layout-affecting properties',
        language: 'css',
        code: `.toast {
  transition: transform 200ms ease, opacity 200ms ease;
}

.toast.is-hidden {
  transform: translateY(0.5rem);
  opacity: 0;
}

/* Avoid animating top/left/width/height when transform can express the motion */`,
      },
      {
        type: 'tip',
        text: 'content-visibility and contain can help long pages and complex widgets, but measure before sprinkling them everywhere.',
      },
      {
        type: 'code',
        title: 'Containment for long feeds',
        language: 'css',
        code: `.feed-item {
  content-visibility: auto;
  contain-intrinsic-size: 720px;
}

.widget {
  contain: layout paint style;
}`,
      },
      { type: 'h2', text: 'Delivery and rendering tips' },
      {
        type: 'table',
        headers: ['Technique', 'Benefit', 'Watch-out'],
        rows: [
          ['Critical CSS for above-the-fold', 'Faster first paint', 'Do not inline megabytes'],
          ['Split rarely used routes', 'Less unused CSS', 'Manage load order carefully'],
          ['font-display: swap', 'Text appears sooner', 'Prepare for brief fallback metrics'],
          ['Avoid huge filter/blur stacks', 'Less GPU strain', 'Especially on low-end phones'],
        ],
      },
      {
        type: 'code',
        title: 'Font loading that stays readable',
        language: 'css',
        code: `@font-face {
  font-family: "Manrope";
  src: url("/fonts/manrope.woff2") format("woff2");
  font-weight: 400 700;
  font-style: normal;
  font-display: swap;
}`,
      },
      {
        type: 'warning',
        text: 'Profiling beats folklore. Use browser performance tools when an interaction stutters. Guessing often optimizes the wrong thing.',
      },
      {
        type: 'try',
        text: 'Pick one animated component and rewrite any width, height, or top transitions to transform and opacity. Compare smoothness on a throttled CPU profile.',
      },
      {
        type: 'keypoints',
        items: [
          'Class-based, shallow selectors keep styling work predictable.',
          'Animate transform and opacity when possible.',
          'Containment and content-visibility can help large documents.',
          'Measure real bottlenecks instead of applying every tip blindly.',
        ],
      },
    ],
  },
  {
    slug: 'css-checklist',
    title: 'Production CSS Checklist',
    description:
      'Run a practical pre-release checklist covering architecture, accessibility, responsiveness, print, and maintainability.',
    level: 'advanced',
    section: 'Capstones',
    order: 63,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Production CSS fails in boring ways: missing focus styles, broken small screens, unreachable contrast, leftover debug rules, or a cascade that only one person understands. A checklist catches those before users do.',
      },
      {
        type: 'p',
        text: 'Use this lesson as a release gate for landing pages, design systems, and app shells. Adapt the items to your team, then keep the list short enough that people actually run it.',
      },
      { type: 'h2', text: 'Architecture and maintainability' },
      {
        type: 'ul',
        items: [
          'Tokens cover color, space, radius, and type steps used by components.',
          'Cascade layers or an equivalent convention prevent specificity wars.',
          'Component names are consistent (BEM or an agreed alternative).',
          'No commented-out dead blocks left in shipped files.',
          'Global styles do not accidentally target third-party widgets.',
        ],
      },
      { type: 'h2', text: 'Responsive and layout QA' },
      {
        type: 'ul',
        items: [
          '320px to large desktop widths checked for overflow.',
          'Fluid type remains readable at min and max clamps.',
          'Grids collapse without crushed text or overlapping controls.',
          'Sticky headers do not hide focus rings or section titles.',
          'Logical properties behave correctly with dir="rtl" smoke tests if locales need them.',
        ],
      },
      { type: 'h2', text: 'Accessibility and preference checks' },
      {
        type: 'ol',
        items: [
          'Keyboard tab order reaches every interactive control.',
          ':focus-visible styles are obvious on light and dark backgrounds.',
          'prefers-reduced-motion disables nonessential motion.',
          'Text contrast meets your product standard for body and UI chrome.',
          'Visible labels remain for form fields; placeholders are not the only label.',
        ],
      },
      {
        type: 'code',
        title: 'Quick debug helpers you should remove before ship',
        language: 'css',
        code: `/* temporary only */
.debug * {
  outline: 1px solid rgb(255 0 0 / 0.25);
}

/* delete before production */`,
      },
      { type: 'h2', text: 'Content, print, and delivery' },
      {
        type: 'table',
        headers: ['Area', 'Check', 'Pass looks like'],
        rows: [
          ['Images', 'Aspect ratios reserved', 'No major layout jump while media loads'],
          ['Print', '@media print reviewed', 'Chrome hidden, content readable'],
          ['CSS size', 'Bundle audited', 'No accidental duplicate frameworks'],
          ['Theming', 'Semantic tokens remap', 'Components follow theme scopes'],
          ['Fallbacks', 'Older syntax considered', 'Critical layout still usable'],
        ],
      },
      {
        type: 'note',
        text: 'A checklist is not bureaucracy when it prevents the same five bugs every release. Automate what you can with linting and visual tests, and keep human checks for judgment calls.',
      },
      {
        type: 'warning',
        text: 'Do not mark accessibility items as optional polish. Focus, contrast, and zoom support are production requirements.',
      },
      {
        type: 'try',
        text: 'Run this checklist against your marketing page and app shell capstones. Log every miss as a fix ticket and resolve them before you call the CSS track complete.',
      },
      {
        type: 'keypoints',
        items: [
          'Production readiness covers architecture, layout, a11y, and delivery.',
          'Short checklists get used; endless checklists get ignored.',
          'Remove debug CSS and dead code before release.',
          'Automate repeats, and keep human review for visual judgment.',
        ],
      },
    ],
  },
  {
    slug: 'frameworks-overview',
    title: 'CSS Frameworks Overview',
    description:
      'Compare utility-first, component kits, and CSS-in-JS-adjacent approaches so you can choose tools without abandoning core CSS skills.',
    level: 'advanced',
    section: 'Capstones',
    order: 64,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Frameworks accelerate delivery, but they do not replace CSS fundamentals. If you understand cascade, layout, tokens, and accessibility, you can adopt Tailwind, Bootstrap, or a component library with intention instead of dependence.',
      },
      {
        type: 'p',
        text: 'This lesson is a map, not a brand endorsement. Evaluate frameworks by the constraints of your team size, design maturity, and product lifespan.',
      },
      { type: 'h2', text: 'Major categories' },
      {
        type: 'table',
        headers: ['Category', 'Examples', 'Strength', 'Trade-off'],
        rows: [
          ['Utility-first', 'Tailwind CSS', 'Fast composition, shared scale', 'Markup can get noisy without components'],
          ['Component kits', 'Bootstrap, Bulma', 'Ready-made UI patterns', 'Custom brand work may fight defaults'],
          ['Low-level libraries', 'Open Props, modern normalize sets', 'Tokens and primitives', 'You still design most components'],
          ['Framework-integrated', 'CSS Modules, styled systems in JS apps', 'Scoped ownership in components', 'Requires tooling discipline'],
        ],
      },
      { type: 'h2', text: 'What core CSS still gives you' },
      {
        type: 'ul',
        items: [
          'Debugging computed styles in browser tools.',
          'Writing escape hatches when a utility does not exist.',
          'Designing tokens that frameworks can consume.',
          'Shipping print, focus, and motion preferences correctly.',
        ],
      },
      {
        type: 'code',
        title: 'Same button intent in utility and semantic form',
        language: 'html',
        code: `<!-- Utility-first style -->
<button class="inline-flex items-center rounded-md bg-teal-700 px-4 py-2 text-white">
  Save
</button>

<!-- Semantic system style -->
<button class="button button--primary">Save</button>`,
      },
      {
        type: 'code',
        title: 'Bridge utilities to tokens when needed',
        language: 'css',
        code: `:root {
  --color-brand: #0f5c56;
}

/* Custom utility that matches your system */
@layer utilities {
  .bg-brand {
    background: var(--color-brand);
  }
}`,
      },
      {
        type: 'tip',
        text: 'If your team already thinks in utilities, a utility framework can be a productivity win. If your team thinks in product components, invest in a semantic design system and borrow utilities only for composition.',
      },
      { type: 'h2', text: 'Selection questions' },
      {
        type: 'ol',
        items: [
          'Do you need a full visual kit or only a consistent styling language?',
          'How often will brand design diverge from defaults?',
          'Can the team maintain the chosen toolchain for years?',
          'Will the framework help accessibility defaults or hide them?',
          'Is the hiring market around your stack a real constraint?',
        ],
      },
      {
        type: 'warning',
        text: 'Do not add multiple overlapping UI kits to one product. Two sources of buttons, spacing scales, and breakpoints create long-term drag.',
      },
      {
        type: 'try',
        text: 'Rebuild one card component three ways: plain semantic CSS, utility classes, and a UI kit class set. Compare readability, redesign speed, and accessibility defaults.',
      },
      {
        type: 'keypoints',
        items: [
          'Frameworks are accelerators on top of CSS fundamentals.',
          'Utility-first and component kits solve different team problems.',
          'Choose tools based on brand flexibility and maintenance reality.',
          'Avoid stacking multiple competing styling systems in one codebase.',
        ],
      },
    ],
  },
  {
    slug: 'next-steps-css',
    title: 'Next Steps After CSS',
    description:
      'Map what to learn next after advanced CSS: deeper layout mastery, design systems, frontend frameworks, and real project practice.',
    level: 'advanced',
    section: 'Capstones',
    order: 65,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'You now have modern CSS features, architecture habits, accessibility practices, and capstone projects. The next step is not collecting more tricks. It is applying judgment on real pages under real constraints.',
      },
      {
        type: 'p',
        text: 'Treat CSS as a long-term craft. Layout engines evolve, but the core skills of cascade control, clear naming, token thinking, and accessible UI remain valuable across frameworks.',
      },
      { type: 'h2', text: 'Strengthen what you already started' },
      {
        type: 'ul',
        items: [
          'Refine your mini design system until it can theme two products.',
          'Add form controls, alerts, and data table patterns to the component set.',
          'Write visual regression tests for critical components if your stack supports them.',
          'Practice RTL and print passes on every major template.',
        ],
      },
      { type: 'h2', text: 'Natural learning paths from here' },
      {
        type: 'table',
        headers: ['Path', 'Why it fits', 'First project'],
        rows: [
          ['Deeper HTML semantics', 'CSS is only as clear as the markup', 'Rebuild a complex form with perfect labels and errors'],
          ['JavaScript for UI behavior', 'Wire drawers, tabs, and toasts accessibly', 'Make the app shell navigation production-ready'],
          ['Design systems', 'Scale tokens and components across teams', 'Publish a documented component gallery'],
          ['Frontend frameworks', 'Apply CSS skills inside component architectures', 'Style a Next.js or similar app with your token system'],
        ],
      },
      {
        type: 'code',
        title: 'A personal practice backlog',
        language: 'html',
        code: `<!-- Portfolio practice set -->
<article>
  <h1>CSS practice roadmap</h1>
  <ol>
    <li>Design system kitchen sink</li>
    <li>Marketing redesign with fluid type</li>
    <li>App shell with accessible nav</li>
    <li>Invoice print stylesheet</li>
    <li>Themeable component library docs</li>
  </ol>
</article>`,
      },
      {
        type: 'tip',
        text: 'Publish your capstones. A public marketing page, app shell, and design system sample communicate practical CSS skill better than a list of finished tutorials.',
      },
      { type: 'h2', text: 'Habits of strong CSS engineers' },
      {
        type: 'ol',
        items: [
          'Read computed styles before guessing.',
          'Prefer the simplest layout primitive that works.',
          'Document tokens and component APIs for future teammates.',
          'Test keyboard, zoom, and small screens as routinely as desktop Chrome.',
          'Leave the cascade cleaner than you found it.',
        ],
      },
      {
        type: 'note',
        text: 'If you continue into JavaScript frameworks, keep owning CSS decisions. Framework conventions change; understanding the browser does not expire.',
      },
      {
        type: 'try',
        text: 'Choose one next path and schedule three practice sessions this week. For example: improve the design system on Monday, add accessible shell behavior on Wednesday, and publish a write-up on Friday.',
      },
      {
        type: 'keypoints',
        items: [
          'Advanced CSS becomes valuable through shipped projects, not trivia.',
          'Deepen systems, accessibility, and real UI behavior next.',
          'HTML, JavaScript, design systems, and frameworks are natural follow-ons.',
          'Keep browser fundamentals at the center as tools change.',
        ],
      },
    ],
  },
];
