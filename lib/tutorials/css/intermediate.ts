import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'responsive-intro',
    title: 'Responsive Design Intro',
    description:
      'Learn why responsive design matters and how fluid layouts, flexible media, and breakpoints work together across screen sizes.',
    level: 'intermediate',
    section: 'Responsive',
    order: 26,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Responsive design means a page adapts to the device that opens it. The same HTML can look clear on a phone, tablet, laptop, and wide desktop without separate sites for each screen.',
      },
      {
        type: 'p',
        text: 'At the intermediate level, you move past fixed pixel layouts. You combine flexible widths, readable type, scalable images, and CSS rules that change at carefully chosen breakpoints.',
      },
      { type: 'h2', text: 'The three pillars' },
      {
        type: 'ul',
        items: [
          'Fluid layouts: use percentages, fr units, minmax(), and modern layout tools instead of only fixed widths.',
          'Flexible media: images, video, and iframes should shrink and grow with their containers.',
          'Media queries (and later container queries): adjust spacing, columns, and navigation when the viewport or container changes.',
        ],
      },
      { type: 'h2', text: 'Start with a viewport meta tag' },
      {
        type: 'p',
        text: 'On mobile browsers, the viewport meta tag tells the browser to match the device width instead of zooming a desktop-sized page.',
      },
      {
        type: 'code',
        language: 'html',
        title: 'Required in the document head',
        code: `<meta name="viewport" content="width=device-width, initial-scale=1">`,
      },
      { type: 'h2', text: 'A simple fluid layout' },
      {
        type: 'code',
        language: 'css',
        title: 'Flexible content width',
        code: `.page {
  width: min(100% - 2rem, 72rem);
  margin-inline: auto;
}

.hero {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 48rem) {
  .hero {
    grid-template-columns: 1.2fr 1fr;
    align-items: center;
  }
}`,
      },
      {
        type: 'note',
        text: 'min(100% - 2rem, 72rem) keeps side padding on small screens and caps the content width on large screens. This is a common modern pattern for readable page shells.',
      },
      {
        type: 'tip',
        text: 'Design for content first. Decide when the layout becomes hard to read or cramped, then choose a breakpoint. Do not invent breakpoints only because a popular device size exists.',
      },
      {
        type: 'try',
        text: 'Build a page shell with a max-width container, fluid padding, and one media query that switches a single-column stack into two columns.',
      },
      {
        type: 'keypoints',
        items: [
          'Responsive design adapts one site to many screen sizes.',
          'Fluid layout, flexible media, and breakpoints work together.',
          'The viewport meta tag is required for mobile browsers.',
          'Choose breakpoints based on content needs, not device names alone.',
        ],
      },
    ],
  },
  {
    slug: 'media-queries',
    title: 'Media Queries',
    description:
      'Write media queries that change layout, typography, and component behavior at the right viewport conditions.',
    level: 'intermediate',
    section: 'Responsive',
    order: 27,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'A media query lets CSS apply only when a condition is true. The most common condition is viewport width, but you can also target height, orientation, resolution, and user preferences.',
      },
      { type: 'h2', text: 'Basic syntax' },
      {
        type: 'code',
        language: 'css',
        title: 'Width-based media query',
        code: `.nav-links {
  display: none;
}

@media (min-width: 48rem) {
  .nav-links {
    display: flex;
    gap: 1.25rem;
  }

  .menu-toggle {
    display: none;
  }
}`,
      },
      {
        type: 'p',
        text: 'With min-width, styles inside the query apply from that width and up. With max-width, they apply from that width and down. Intermediate projects usually favor min-width with a mobile-first base.',
      },
      { type: 'h2', text: 'Useful features and ranges' },
      {
        type: 'code',
        language: 'css',
        title: 'Modern range syntax and other features',
        code: `@media (width >= 48rem) {
  .sidebar {
    position: sticky;
    top: 1rem;
  }
}

@media (orientation: landscape) and (height <= 30rem) {
  .hero {
    min-height: auto;
    padding-block: 1rem;
  }
}

@media (hover: hover) and (pointer: fine) {
  .card:hover {
    transform: translateY(-0.25rem);
  }
}`,
      },
      {
        type: 'table',
        headers: ['Feature', 'What it checks', 'Common use'],
        rows: [
          ['min-width / max-width', 'Viewport width', 'Column count, nav pattern'],
          ['orientation', 'Portrait or landscape', 'Short-height landscape fixes'],
          ['hover / pointer', 'Input capability', 'Hover effects only when useful'],
          ['prefers-reduced-motion', 'Motion preference', 'Safer animations'],
        ],
      },
      {
        type: 'warning',
        text: 'Avoid stacking many overlapping max-width and min-width rules for the same component. Prefer a clear mobile-first ladder so later queries only add or override what they need.',
      },
      {
        type: 'try',
        text: 'Create a card grid that is one column by default, two columns from 40rem, and three columns from 64rem. Use either classic min-width or modern range syntax.',
      },
      {
        type: 'keypoints',
        items: [
          'Media queries apply CSS only when a condition matches.',
          'min-width queries pair well with mobile-first base styles.',
          'You can query width, orientation, hover ability, and preferences.',
          'Keep breakpoint logic simple and content-driven.',
        ],
      },
    ],
  },
  {
    slug: 'fluid-images',
    title: 'Fluid Images and Media',
    description:
      'Make images, video, and embedded media scale safely inside responsive layouts without overflow or distortion.',
    level: 'intermediate',
    section: 'Responsive',
    order: 28,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Large images are a common cause of horizontal scrolling on small screens. Fluid media keeps visual content inside its container while preserving a sensible aspect ratio.',
      },
      { type: 'h2', text: 'The essential image rule' },
      {
        type: 'code',
        language: 'css',
        title: 'Prevent image overflow',
        code: `img,
video,
iframe {
  max-width: 100%;
  height: auto;
  display: block;
}`,
      },
      {
        type: 'p',
        text: 'max-width: 100% stops the media from growing wider than its parent. height: auto keeps the natural aspect ratio when the width changes.',
      },
      { type: 'h2', text: 'Control crop and fit' },
      {
        type: 'code',
        language: 'css',
        title: 'Object-fit for fixed frames',
        code: `.thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 0.75rem;
}

.logo {
  width: 8rem;
  height: 2.5rem;
  object-fit: contain;
}`,
      },
      {
        type: 'ul',
        items: [
          'object-fit: cover fills the box and may crop edges.',
          'object-fit: contain keeps the full image visible and may leave empty space.',
          'aspect-ratio reserves space before the image loads and reduces layout shift.',
        ],
      },
      { type: 'h2', text: 'Responsive sources in HTML' },
      {
        type: 'code',
        language: 'html',
        title: 'srcset and picture',
        code: `<img
  src="hero-800.jpg"
  srcset="hero-800.jpg 800w, hero-1600.jpg 1600w"
  sizes="(min-width: 48rem) 50vw, 100vw"
  alt="Studio workspace with soft daylight">

<picture>
  <source media="(min-width: 48rem)" srcset="banner-wide.jpg">
  <img src="banner-narrow.jpg" alt="Product lineup on a shelf">
</picture>`,
      },
      {
        type: 'tip',
        text: 'CSS makes media flexible. HTML srcset and picture help the browser download an appropriately sized file. Use both when performance matters.',
      },
      {
        type: 'try',
        text: 'Style a gallery where every image uses aspect-ratio: 4 / 3 and object-fit: cover, then add a logo rule that uses object-fit: contain.',
      },
      {
        type: 'keypoints',
        items: [
          'max-width: 100% and height: auto prevent most media overflow.',
          'object-fit controls cropping inside fixed frames.',
          'aspect-ratio reserves space and stabilizes layout.',
          'srcset and picture improve performance across devices.',
        ],
      },
    ],
  },
  {
    slug: 'mobile-first',
    title: 'Mobile-First CSS',
    description:
      'Write base styles for small screens first, then progressively enhance the layout with min-width media queries.',
    level: 'intermediate',
    section: 'Responsive',
    order: 29,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Mobile-first CSS means your default rules work on a narrow screen. Wider layouts are enhancements added with min-width media queries. This keeps the base stylesheet simpler and usually reduces overrides.',
      },
      { type: 'h2', text: 'Desktop-first vs mobile-first' },
      {
        type: 'code',
        language: 'css',
        title: 'Same result, clearer mobile-first structure',
        code: `/* Desktop-first (harder to maintain) */
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 47.99rem) {
  .cards {
    grid-template-columns: 1fr;
  }
}

/* Mobile-first (preferred) */
.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 48rem) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}`,
      },
      { type: 'h2', text: 'Progressive enhancement pattern' },
      {
        type: 'ol',
        items: [
          'Style typography, spacing, and single-column flow for small screens.',
          'Add navigation and component adjustments at the first content breakpoint.',
          'Introduce multi-column layouts and sticky sidebars only when there is room.',
          'Polish hover states and denser spacing for large screens and fine pointers.',
        ],
      },
      {
        type: 'code',
        language: 'css',
        title: 'Component growing with the viewport',
        code: `.feature {
  padding: 1rem;
}

.feature__media {
  margin-bottom: 1rem;
}

@media (min-width: 40rem) {
  .feature {
    display: grid;
    grid-template-columns: 10rem 1fr;
    gap: 1.25rem;
    align-items: start;
  }

  .feature__media {
    margin-bottom: 0;
  }
}`,
      },
      {
        type: 'note',
        text: 'Mobile-first does not mean phone-only design. It means the narrow layout is the foundation, and larger screens receive additional structure.',
      },
      {
        type: 'try',
        text: 'Refactor a max-width-based stylesheet into mobile-first min-width queries for a header, card list, and footer.',
      },
      {
        type: 'keypoints',
        items: [
          'Write small-screen styles as the default.',
          'Use min-width queries to enhance larger viewports.',
          'Mobile-first usually needs fewer overrides than desktop-first.',
          'Add complexity only when the content has enough space.',
        ],
      },
    ],
  },
  {
    slug: 'container-queries-intro',
    title: 'Container Queries Intro',
    description:
      'Style components based on their parent container size instead of only the viewport width.',
    level: 'intermediate',
    section: 'Responsive',
    order: 30,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Media queries look at the viewport. Container queries look at a parent container. That difference matters for reusable cards, sidebars, and widgets that appear in both narrow and wide regions of the same page.',
      },
      { type: 'h2', text: 'Define a containment context' },
      {
        type: 'code',
        language: 'css',
        title: 'container-type on the parent',
        code: `.sidebar,
.main {
  container-type: inline-size;
  container-name: panel;
}

.card {
  padding: 1rem;
}

.card__meta {
  display: none;
}

@container panel (min-width: 22rem) {
  .card {
    display: grid;
    grid-template-columns: 5rem 1fr;
    gap: 1rem;
  }

  .card__meta {
    display: block;
  }
}`,
      },
      {
        type: 'p',
        text: 'container-type: inline-size lets the browser measure the container width for queries. Naming the container makes queries clearer when nested layouts exist.',
      },
      { type: 'h2', text: 'When to use container queries' },
      {
        type: 'ul',
        items: [
          'A card component can sit in a narrow sidebar or a wide main column.',
          'A form widget needs a stacked layout in small regions and an inline layout in large regions.',
          'A design system component should adapt without knowing the full page breakpoint map.',
        ],
      },
      {
        type: 'code',
        language: 'html',
        title: 'Same card in two containers',
        code: `<aside class="sidebar">
  <article class="card">...</article>
</aside>

<main class="main">
  <article class="card">...</article>
</main>`,
      },
      {
        type: 'tip',
        text: 'Keep using media queries for page-level decisions such as navigation patterns. Use container queries for component-level decisions that depend on available local space.',
      },
      {
        type: 'warning',
        text: 'A container cannot query itself in a way that creates circular sizing. Put container-type on a parent wrapper, then query that wrapper from descendants.',
      },
      {
        type: 'try',
        text: 'Build a .card that stacks by default and becomes a two-column layout when its container is at least 24rem wide.',
      },
      {
        type: 'keypoints',
        items: [
          'Container queries respond to parent size, not only viewport size.',
          'Set container-type on a wrapping parent.',
          'They are ideal for reusable components in mixed layouts.',
          'Combine them with media queries for page-level structure.',
        ],
      },
    ],
  },
  {
    slug: 'grid-intro',
    title: 'CSS Grid Intro',
    description:
      'Understand CSS Grid as a two-dimensional layout system for rows and columns working together.',
    level: 'intermediate',
    section: 'Grid',
    order: 31,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'CSS Grid creates layouts with rows and columns at the same time. Flexbox is excellent for one direction. Grid shines when you need full page structure, card matrices, or aligned regions in both axes.',
      },
      { type: 'h2', text: 'Create a grid' },
      {
        type: 'code',
        language: 'css',
        title: 'Basic grid container',
        code: `.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.gallery__item {
  min-height: 8rem;
}`,
      },
      {
        type: 'p',
        text: 'display: grid turns an element into a grid container. Direct children become grid items. fr units share free space, so 1fr 1fr 1fr creates three equal columns.',
      },
      { type: 'h2', text: 'Explicit tracks and auto placement' },
      {
        type: 'code',
        language: 'css',
        title: 'Rows, columns, and flowing items',
        code: `.board {
  display: grid;
  grid-template-columns: 12rem 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 1rem;
}`,
      },
      {
        type: 'ul',
        items: [
          'Columns define vertical tracks across the layout.',
          'Rows define horizontal tracks down the layout.',
          'Items fill cells automatically unless you place them manually.',
          'gap controls spacing between tracks without margin tricks.',
        ],
      },
      {
        type: 'note',
        text: 'Grid does not replace Flexbox. Many strong interfaces use Grid for the page skeleton and Flexbox inside components for alignment of buttons, tags, or nav items.',
      },
      {
        type: 'try',
        text: 'Create a 2-by-2 gallery with equal columns, a 1rem gap, and four child items. Then change it to three equal columns.',
      },
      {
        type: 'keypoints',
        items: [
          'Grid is two-dimensional: rows and columns together.',
          'display: grid creates the container; children become items.',
          'fr units share available free space.',
          'Use Grid for structure and Flexbox for many one-axis tasks.',
        ],
      },
    ],
  },
  {
    slug: 'grid-template',
    title: 'grid-template-columns/rows',
    description:
      'Define grid tracks with fixed sizes, fr units, repeat(), minmax(), and auto-fit patterns.',
    level: 'intermediate',
    section: 'Grid',
    order: 32,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Track definitions decide how columns and rows are sized. Mastering repeat(), fr, and minmax() is the core of practical Grid work.',
      },
      { type: 'h2', text: 'Common track recipes' },
      {
        type: 'code',
        language: 'css',
        title: 'Fixed, flexible, and mixed tracks',
        code: `.layout-a {
  grid-template-columns: 200px 1fr;
}

.layout-b {
  grid-template-columns: 1fr 2fr 1fr;
}

.layout-c {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.layout-d {
  grid-template-rows: auto 1fr auto;
}`,
      },
      {
        type: 'p',
        text: 'minmax(0, 1fr) is a useful defensive pattern. It lets tracks shrink properly when content is large, which avoids unexpected overflow in nested grids.',
      },
      { type: 'h2', text: 'Responsive columns without many breakpoints' },
      {
        type: 'code',
        language: 'css',
        title: 'auto-fit and minmax',
        code: `.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1.25rem;
}`,
      },
      {
        type: 'p',
        text: 'auto-fit creates as many columns as will fit. Each column is at least 16rem wide and can grow equally to fill the row. This is one of the most useful intermediate Grid techniques.',
      },
      { type: 'h2', text: 'Named lines (optional power tool)' },
      {
        type: 'code',
        language: 'css',
        title: 'Named grid lines',
        code: `.page {
  display: grid;
  grid-template-columns: [full-start] 1rem [content-start] 1fr [content-end] 1rem [full-end];
}

.page > * {
  grid-column: content;
}

.page > .banner {
  grid-column: full;
}`,
      },
      {
        type: 'tip',
        text: 'Start with repeat(), fr, and minmax(). Add named lines when a page shell needs full-bleed sections beside constrained content.',
      },
      {
        type: 'try',
        text: 'Build a product grid using repeat(auto-fit, minmax(14rem, 1fr)) and verify how many columns appear as you resize the browser.',
      },
      {
        type: 'keypoints',
        items: [
          'grid-template-columns and grid-template-rows define tracks.',
          'fr distributes free space; minmax() sets flexible bounds.',
          'auto-fit with minmax() creates fluid responsive columns.',
          'Named lines help with full-bleed and constrained content bands.',
        ],
      },
    ],
  },
  {
    slug: 'grid-areas',
    title: 'Grid Template Areas',
    description:
      'Name layout regions with grid-template-areas and assign items to those areas for readable page structure.',
    level: 'intermediate',
    section: 'Grid',
    order: 33,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'grid-template-areas lets you draw a layout with words. Each string is a row. Matching names form rectangular regions that items can occupy by name.',
      },
      { type: 'h2', text: 'Define and assign areas' },
      {
        type: 'code',
        language: 'css',
        title: 'Named page regions',
        code: `.dashboard {
  display: grid;
  grid-template-columns: 14rem 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "nav nav"
    "side main"
    "foot foot";
  min-height: 100vh;
  gap: 1rem;
}

.nav  { grid-area: nav; }
.side { grid-area: side; }
.main { grid-area: main; }
.foot { grid-area: foot; }`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'Matching HTML landmarks',
        code: `<div class="dashboard">
  <header class="nav">...</header>
  <aside class="side">...</aside>
  <main class="main">...</main>
  <footer class="foot">...</footer>
</div>`,
      },
      { type: 'h2', text: 'Rearrange areas at breakpoints' },
      {
        type: 'code',
        language: 'css',
        title: 'Stack on small screens',
        code: `.dashboard {
  grid-template-columns: 1fr;
  grid-template-areas:
    "nav"
    "main"
    "side"
    "foot";
}

@media (min-width: 48rem) {
  .dashboard {
    grid-template-columns: 14rem 1fr;
    grid-template-areas:
      "nav nav"
      "side main"
      "foot foot";
  }
}`,
      },
      {
        type: 'warning',
        text: 'Every area name must form a solid rectangle. Do not create disconnected or L-shaped regions with the same name.',
      },
      {
        type: 'note',
        text: 'A period (.) in the template creates an empty cell. That can help with alignment when a region should not span the full row.',
      },
      {
        type: 'try',
        text: 'Create a blog layout with areas for header, sidebar, article, and footer. On small screens, place article above sidebar.',
      },
      {
        type: 'keypoints',
        items: [
          'grid-template-areas names rectangular layout regions.',
          'grid-area assigns an item to a named region.',
          'You can rearrange areas in media queries without changing HTML order.',
          'Area shapes must stay rectangular.',
        ],
      },
    ],
  },
  {
    slug: 'grid-gap-align',
    title: 'Gap and Alignment in Grid',
    description:
      'Control spacing with gap and align grid items or tracks using justify and align properties.',
    level: 'intermediate',
    section: 'Grid',
    order: 34,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Gap sets the space between tracks. Alignment properties control how items sit inside their cells and how the whole grid sits inside its container when extra space remains.',
      },
      { type: 'h2', text: 'Gap shorthand' },
      {
        type: 'code',
        language: 'css',
        title: 'row-gap, column-gap, and gap',
        code: `.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 1rem;
  column-gap: 1.25rem;
}`,
      },
      { type: 'h2', text: 'Align items inside cells' },
      {
        type: 'code',
        language: 'css',
        title: 'Item alignment',
        code: `.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  align-items: stretch; /* default: fill cell height */
}

.stats__item {
  display: grid;
  place-items: center;
  min-height: 6rem;
}

.icon-cell {
  justify-self: end;
  align-self: start;
}`,
      },
      {
        type: 'table',
        headers: ['Property', 'Controls', 'Common values'],
        rows: [
          ['justify-items', 'Inline axis inside cells', 'start, center, end, stretch'],
          ['align-items', 'Block axis inside cells', 'start, center, end, stretch'],
          ['justify-content', 'Grid along inline axis', 'start, center, space-between'],
          ['align-content', 'Grid along block axis', 'start, center, space-between'],
          ['place-items', 'Shorthand for align + justify items', 'center, start stretch'],
        ],
      },
      {
        type: 'tip',
        text: 'Use gap for gutters between tracks. Prefer padding on the container for outer spacing. Mixing both intentionally keeps rhythm clearer than large item margins.',
      },
      {
        type: 'try',
        text: 'Build a four-cell stats row where each cell centers its content with place-items: center and uses a 1rem gap.',
      },
      {
        type: 'keypoints',
        items: [
          'gap sets spacing between grid tracks.',
          'justify-items and align-items position content inside cells.',
          'justify-content and align-content position the grid when extra space exists.',
          'place-items is a convenient shorthand for centering.',
        ],
      },
    ],
  },
  {
    slug: 'grid-vs-flex',
    title: 'Grid vs Flexbox',
    description:
      'Choose Grid or Flexbox with confidence by comparing one-dimensional and two-dimensional layout needs.',
    level: 'intermediate',
    section: 'Grid',
    order: 35,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Flexbox and Grid overlap, but they solve different default problems. Flexbox distributes items along one main axis. Grid defines a full track structure in two dimensions.',
      },
      { type: 'h2', text: 'Quick decision guide' },
      {
        type: 'table',
        headers: ['Need', 'Prefer', 'Why'],
        rows: [
          ['Nav links in a row', 'Flexbox', 'One-axis distribution and wrapping'],
          ['Page with sidebar + main + footer', 'Grid', 'Named regions and row/column control'],
          ['Button group with equal height actions', 'Flexbox', 'Simple alignment and gap'],
          ['Card matrix that stays aligned in columns', 'Grid', 'Shared column tracks'],
          ['Toolbar with left cluster and right actions', 'Flexbox', 'space-between on one row'],
          ['Magazine-style featured + side cards', 'Grid', 'Spans and template areas'],
        ],
      },
      { type: 'h2', text: 'They work best together' },
      {
        type: 'code',
        language: 'css',
        title: 'Grid page, Flexbox component',
        code: `.page {
  display: grid;
  grid-template-columns: 16rem 1fr;
  gap: 1.5rem;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.toolbar__actions {
  display: flex;
  gap: 0.5rem;
}`,
      },
      {
        type: 'note',
        text: 'If you find yourself forcing Flexbox into complex row and column spanning, switch that section to Grid. If Grid feels heavy for a simple row of controls, use Flexbox.',
      },
      {
        type: 'tip',
        text: 'A practical rule: Grid for the skeleton, Flexbox for the content inside the bones.',
      },
      {
        type: 'try',
        text: 'Rebuild a small UI with Grid for the outer layout and Flexbox for a header toolbar. Note which properties feel natural in each layer.',
      },
      {
        type: 'keypoints',
        items: [
          'Flexbox is primarily one-dimensional.',
          'Grid is designed for two-dimensional structure.',
          'Use both in the same interface for cleaner CSS.',
          'Choose the tool that matches the alignment problem you actually have.',
        ],
      },
    ],
  },
  {
    slug: 'custom-properties',
    title: 'CSS Variables',
    description:
      'Define reusable design tokens with custom properties for color, spacing, type, and theme switches.',
    level: 'intermediate',
    section: 'Visual Design',
    order: 36,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'CSS custom properties (variables) store values you can reuse and override. They make design systems easier to maintain and unlock theme changes without duplicating large rule sets.',
      },
      { type: 'h2', text: 'Declare and use variables' },
      {
        type: 'code',
        language: 'css',
        title: 'Tokens on :root',
        code: `:root {
  --color-bg: #f6f3ee;
  --color-text: #1d1a16;
  --color-accent: #0f6a5a;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --radius: 0.75rem;
  --font-sans: "Segoe UI", sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  color: var(--color-text);
  background: var(--color-bg);
}

.button {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius);
  background: var(--color-accent);
  color: white;
}`,
      },
      { type: 'h2', text: 'Local overrides' },
      {
        type: 'code',
        language: 'css',
        title: 'Scoped variable changes',
        code: `.card {
  --card-pad: 1rem;
  padding: var(--card-pad);
  background: white;
}

.card--compact {
  --card-pad: 0.5rem;
}

.theme-dark {
  --color-bg: #121417;
  --color-text: #f2f4f7;
}`,
      },
      {
        type: 'p',
        text: 'Variables inherit. A class on a parent can redefine tokens for an entire section. This is the foundation of many dark mode and brand theme patterns.',
      },
      {
        type: 'code',
        language: 'css',
        title: 'Fallback values',
        code: `.badge {
  background: var(--badge-bg, #e8eef0);
  color: var(--badge-fg, #10353b);
}`,
      },
      {
        type: 'tip',
        text: 'Name tokens by role (--color-accent, --space-4), not only by raw appearance (--teal-500), when the value represents meaning in the UI.',
      },
      {
        type: 'try',
        text: 'Create :root tokens for background, text, accent, and radius. Build a button and card that use only those tokens, then override accent inside a .promo section.',
      },
      {
        type: 'keypoints',
        items: [
          'Custom properties store reusable CSS values.',
          ':root is a common place for global design tokens.',
          'Variables inherit and can be overridden locally.',
          'Fallbacks keep components resilient when a token is missing.',
        ],
      },
    ],
  },
  {
    slug: 'gradients-shadows',
    title: 'Gradients and Shadows',
    description:
      'Add depth and atmosphere with linear and radial gradients plus layered box and text shadows.',
    level: 'intermediate',
    section: 'Visual Design',
    order: 37,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Gradients and shadows help surfaces feel dimensional. Used with restraint, they guide attention and separate layers. Used everywhere, they create noise.',
      },
      { type: 'h2', text: 'Linear and radial gradients' },
      {
        type: 'code',
        language: 'css',
        title: 'Background gradients',
        code: `.hero {
  background:
    linear-gradient(160deg, #0b3d3a 0%, #17806d 55%, #c7f0d8 100%);
  color: white;
}

.orb {
  background:
    radial-gradient(circle at 30% 30%, #fff6, transparent 55%),
    #204060;
}`,
      },
      {
        type: 'p',
        text: 'linear-gradient transitions along a line. radial-gradient transitions outward from a point. You can stack multiple backgrounds, with the first layer painted on top.',
      },
      { type: 'h2', text: 'Box shadows for elevation' },
      {
        type: 'code',
        language: 'css',
        title: 'Soft elevation scale',
        code: `:root {
  --shadow-1: 0 1px 2px rgb(0 0 0 / 0.08);
  --shadow-2: 0 8px 24px rgb(0 0 0 / 0.12);
}

.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-1);
}

.card:hover {
  box-shadow: var(--shadow-2);
}

.button-primary {
  box-shadow: 0 1px 0 rgb(255 255 255 / 0.25) inset, var(--shadow-1);
}`,
      },
      { type: 'h2', text: 'Text shadow sparingly' },
      {
        type: 'code',
        language: 'css',
        title: 'Readable text on photography',
        code: `.hero h1 {
  text-shadow: 0 1px 2px rgb(0 0 0 / 0.45);
}`,
      },
      {
        type: 'warning',
        text: 'Heavy shadows and loud gradients can hurt contrast and make interfaces feel dated. Prefer subtle elevation and purposeful accent washes.',
      },
      {
        type: 'try',
        text: 'Style a hero with a linear gradient overlay and a card with two elevation levels using custom properties.',
      },
      {
        type: 'keypoints',
        items: [
          'Gradients create smooth color transitions for backgrounds.',
          'box-shadow communicates elevation between surfaces.',
          'Stack backgrounds when you need overlay plus color.',
          'Keep shadows subtle and reusable with tokens.',
        ],
      },
    ],
  },
  {
    slug: 'transforms',
    title: 'Transforms',
    description:
      'Move, scale, rotate, and skew elements with transform functions for polish and interactive feedback.',
    level: 'intermediate',
    section: 'Visual Design',
    order: 38,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'The transform property changes how an element is drawn without affecting normal document flow the way margin or top/left repositioning does. Transforms are efficient for hover feedback and micro-interactions.',
      },
      { type: 'h2', text: 'Common transform functions' },
      {
        type: 'code',
        language: 'css',
        title: 'translate, scale, rotate',
        code: `.card:hover {
  transform: translateY(-0.35rem);
}

.badge-new {
  transform: rotate(-8deg);
}

.avatar:active {
  transform: scale(0.96);
}

.stack-preview {
  transform: translate(1rem, 0.5rem) rotate(3deg);
}`,
      },
      {
        type: 'ul',
        items: [
          'translate() moves an element on X/Y axes.',
          'scale() grows or shrinks from the transform origin.',
          'rotate() turns an element by a degree or turn value.',
          'Multiple functions can be combined in one transform list.',
        ],
      },
      { type: 'h2', text: 'Transform origin and 3D hints' },
      {
        type: 'code',
        language: 'css',
        title: 'Origin and perspective',
        code: `.door {
  transform-origin: left center;
}

.door.is-open {
  transform: rotateY(-55deg);
}

.stage {
  perspective: 800px;
}`,
      },
      {
        type: 'note',
        text: 'Transformed elements still occupy their original layout space. Nearby content does not reflow when a card lifts on hover.',
      },
      {
        type: 'tip',
        text: 'Prefer transform and opacity for animated UI changes. They are generally cheaper than animating width, height, top, or left.',
      },
      {
        type: 'try',
        text: 'Add a hover lift to a card with translateY and a slight scale, and set transform-origin on a badge that rotates from its top-left corner.',
      },
      {
        type: 'keypoints',
        items: [
          'transform visually moves or reshapes an element.',
          'translate, scale, and rotate cover most UI needs.',
          'Layout space stays the same after transforms.',
          'Transforms pair well with transitions for interaction polish.',
        ],
      },
    ],
  },
  {
    slug: 'transitions',
    title: 'Transitions',
    description:
      'Animate property changes smoothly over time with transition-property, duration, easing, and delay.',
    level: 'intermediate',
    section: 'Visual Design',
    order: 39,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Transitions interpolate from an old value to a new value when a property changes, such as on hover, focus, or a class toggle. They make interfaces feel responsive without full keyframe animation.',
      },
      { type: 'h2', text: 'Transition fundamentals' },
      {
        type: 'code',
        language: 'css',
        title: 'Smooth interactive states',
        code: `.button {
  background: #0f6a5a;
  color: white;
  transform: translateY(0);
  transition:
    background-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.button:hover {
  background: #0c574a;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgb(15 106 90 / 0.25);
}

.button:active {
  transform: translateY(0);
}`,
      },
      { type: 'h2', text: 'What to transition' },
      {
        type: 'ul',
        items: [
          'Good candidates: color, background-color, opacity, transform, box-shadow.',
          'Risky candidates: width, height, top, left, and large layout shifts.',
          'transition: all is convenient but can animate unintended properties. Prefer an explicit list.',
        ],
      },
      {
        type: 'code',
        language: 'css',
        title: 'Timing and delay',
        code: `.menu {
  opacity: 0;
  transform: translateY(-0.25rem);
  transition-property: opacity, transform;
  transition-duration: 180ms;
  transition-timing-function: ease-out;
  transition-delay: 40ms;
}

.menu.is-open {
  opacity: 1;
  transform: translateY(0);
}`,
      },
      {
        type: 'warning',
        text: 'Respect prefers-reduced-motion. Offer an instant or near-instant alternative when users ask for less animation.',
      },
      {
        type: 'code',
        language: 'css',
        title: 'Reduced motion safeguard',
        code: `@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}`,
      },
      {
        type: 'try',
        text: 'Create a link underline or button background transition that lasts about 150-200ms and include a reduced-motion media query.',
      },
      {
        type: 'keypoints',
        items: [
          'Transitions smooth changes between states.',
          'List specific properties instead of relying on all.',
          'Short durations often feel snappier for UI controls.',
          'Always consider prefers-reduced-motion.',
        ],
      },
    ],
  },
  {
    slug: 'animations-basics',
    title: 'Animations Basics',
    description:
      'Build keyframe animations for attention, loading states, and entrance effects with control over timing and iteration.',
    level: 'intermediate',
    section: 'Visual Design',
    order: 40,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Animations use @keyframes to describe a sequence of styles over time. Unlike transitions, they can run automatically, loop, and move through multiple stages without a property toggle.',
      },
      { type: 'h2', text: 'Define and apply keyframes' },
      {
        type: 'code',
        language: 'css',
        title: 'Fade and rise entrance',
        code: `@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero__title {
  animation: fade-up 500ms ease-out both;
}`,
      },
      {
        type: 'p',
        text: 'The both fill mode keeps the from styles before starting and retains the to styles after ending. This avoids a flash of the unanimated state.',
      },
      { type: 'h2', text: 'Loops and loading indicators' },
      {
        type: 'code',
        language: 'css',
        title: 'Simple spinner',
        code: `@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid #d7e2e0;
  border-top-color: #0f6a5a;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}`,
      },
      { type: 'h2', text: 'Animation properties to know' },
      {
        type: 'ul',
        items: [
          'animation-name links to @keyframes.',
          'animation-duration sets how long one cycle lasts.',
          'animation-timing-function controls easing.',
          'animation-iteration-count can be a number or infinite.',
          'animation-direction supports normal, reverse, and alternate.',
        ],
      },
      {
        type: 'tip',
        text: 'Use animation for meaningful feedback: loading, success confirmation, or a short entrance. Avoid endless decorative motion near critical reading content.',
      },
      {
        type: 'try',
        text: 'Write a pulse keyframe that scales a notification dot between 1 and 1.15, then apply it with a 1s ease-in-out infinite alternate animation.',
      },
      {
        type: 'keypoints',
        items: [
          '@keyframes define multi-step animation sequences.',
          'Animations can run without hover or class changes.',
          'Fill modes and iteration count control start and repeat behavior.',
          'Use motion intentionally and keep reduced-motion support.',
        ],
      },
    ],
  },
  {
    slug: 'nav-styles',
    title: 'Navigation Styles',
    description:
      'Style site navigation for desktop and small screens, including flex toolbars and mobile menu patterns.',
    level: 'intermediate',
    section: 'Components',
    order: 41,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Navigation is one of the most reused components on a site. Intermediate CSS focuses on clear hierarchy, touch-friendly targets, and a layout that adapts from a compact menu to a horizontal bar.',
      },
      { type: 'h2', text: 'Desktop navigation bar' },
      {
        type: 'code',
        language: 'html',
        title: 'Semantic header structure',
        code: `<header class="site-header">
  <a class="logo" href="/">Northline</a>
  <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav id="site-nav" class="site-nav">
    <ul class="nav-list">
      <li><a href="/work">Work</a></li>
      <li><a href="/studio">Studio</a></li>
      <li><a class="nav-cta" href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>`,
      },
      {
        type: 'code',
        language: 'css',
        title: 'Flex header with mobile-first nav',
        code: `.site-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}

.site-nav {
  display: none;
  width: 100%;
}

.site-nav.is-open {
  display: block;
}

.site-nav a {
  display: block;
  padding: 0.65rem 0.75rem;
  text-decoration: none;
  color: inherit;
}

@media (min-width: 48rem) {
  .menu-toggle {
    display: none;
  }

  .site-nav {
    display: block;
    width: auto;
  }

  .nav-list {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}`,
      },
      {
        type: 'note',
        text: 'JavaScript typically toggles .is-open and aria-expanded. Your CSS should make both closed and open states clear without relying on hover alone.',
      },
      {
        type: 'tip',
        text: 'Give links enough padding for touch targets. A compact visual style can still use a generous clickable area.',
      },
      {
        type: 'try',
        text: 'Style a header where links stack under a Menu button on small screens and sit in a horizontal flex row from 48rem upward.',
      },
      {
        type: 'keypoints',
        items: [
          'Use semantic header and nav markup.',
          'Flexbox is a natural fit for top navigation bars.',
          'Mobile menus usually start hidden and open with a class.',
          'Desktop breakpoints can reveal an inline link row.',
        ],
      },
    ],
  },
  {
    slug: 'buttons-badges',
    title: 'Buttons and Badges',
    description:
      'Build consistent button variants and compact badges with shared tokens, states, and accessible contrast.',
    level: 'intermediate',
    section: 'Components',
    order: 42,
    minutes: 11,
    content: [
      {
        type: 'p',
        text: 'Buttons and badges are small components with outsized impact. Consistent padding, radius, type size, and state styles make an interface feel intentional.',
      },
      { type: 'h2', text: 'Button variants' },
      {
        type: 'code',
        language: 'css',
        title: 'Base button plus variants',
        code: `.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.6rem;
  font: inherit;
  font-weight: 600;
  line-height: 1.1;
  cursor: pointer;
  text-decoration: none;
}

.button--primary {
  background: #0f6a5a;
  color: #fff;
}

.button--ghost {
  background: transparent;
  border-color: #0f6a5a;
  color: #0f6a5a;
}

.button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.button:focus-visible {
  outline: 3px solid #7cc4b8;
  outline-offset: 2px;
}`,
      },
      { type: 'h2', text: 'Badges and status chips' },
      {
        type: 'code',
        language: 'css',
        title: 'Compact status badge',
        code: `.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.badge--success {
  background: #e5f6ef;
  color: #0b5b43;
}

.badge--warn {
  background: #fff3d6;
  color: #7a4d00;
}`,
      },
      {
        type: 'warning',
        text: 'Do not rely on color alone for status meaning. Pair a badge color with clear text such as Paid, Pending, or Failed.',
      },
      {
        type: 'try',
        text: 'Create primary and ghost buttons that share base styles, plus success and warning badges that use the same radius token.',
      },
      {
        type: 'keypoints',
        items: [
          'Share a base .button class across variants.',
          'Include hover, disabled, and focus-visible states.',
          'Badges should stay compact and high-contrast.',
          'Status meaning needs text, not only color.',
        ],
      },
    ],
  },
  {
    slug: 'forms-styling',
    title: 'Styling Forms',
    description:
      'Style labels, inputs, textareas, and focus states so forms are readable, consistent, and keyboard-friendly.',
    level: 'intermediate',
    section: 'Components',
    order: 43,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Forms are where users complete important tasks. Intermediate styling focuses on alignment, clear labels, comfortable input size, and visible focus states rather than decorative novelty.',
      },
      { type: 'h2', text: 'Structure and spacing' },
      {
        type: 'code',
        language: 'html',
        title: 'Accessible field pattern',
        code: `<form class="form" action="/subscribe" method="post">
  <div class="field">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email" required>
  </div>
  <div class="field">
    <label for="plan">Plan</label>
    <select id="plan" name="plan">
      <option>Starter</option>
      <option>Pro</option>
    </select>
  </div>
  <button class="button button--primary" type="submit">Join waitlist</button>
</form>`,
      },
      {
        type: 'code',
        language: 'css',
        title: 'Clean form controls',
        code: `.form {
  display: grid;
  gap: 1rem;
  max-width: 28rem;
}

.field {
  display: grid;
  gap: 0.35rem;
}

.field label {
  font-weight: 600;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 0.7rem 0.8rem;
  border: 1px solid #c9d2cf;
  border-radius: 0.55rem;
  font: inherit;
  background: #fff;
}

.field input:focus-visible,
.field select:focus-visible,
.field textarea:focus-visible {
  outline: 3px solid #7cc4b8;
  outline-offset: 1px;
  border-color: #0f6a5a;
}

.field input[aria-invalid="true"] {
  border-color: #b42318;
}`,
      },
      {
        type: 'tip',
        text: 'Use font: inherit on inputs so form controls match the page typeface. Browsers often default to system UI fonts that look inconsistent.',
      },
      {
        type: 'note',
        text: 'Grid gap on .form and .field keeps vertical rhythm even when error text or helper text appears under a control.',
      },
      {
        type: 'try',
        text: 'Style a two-field form with stacked labels, full-width controls, and a clear focus-visible outline that is not only a color change.',
      },
      {
        type: 'keypoints',
        items: [
          'Pair every control with a visible label.',
          'Shared input styles keep forms consistent.',
          'Focus states must remain obvious for keyboard users.',
          'Grid gap is an easy way to manage field spacing.',
        ],
      },
    ],
  },
  {
    slug: 'cards-lists',
    title: 'Cards and Lists',
    description:
      'Compose card surfaces and structured lists for content collections, dashboards, and feature grids.',
    level: 'intermediate',
    section: 'Components',
    order: 44,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Cards group related content into scannable units. Lists organize repeated items. Together they power pricing grids, blog indexes, settings pages, and product catalogs.',
      },
      { type: 'h2', text: 'Card anatomy' },
      {
        type: 'code',
        language: 'html',
        title: 'Article card markup',
        code: `<article class="card">
  <img class="card__media" src="trail.jpg" alt="">
  <div class="card__body">
    <p class="card__eyebrow">Guide</p>
    <h3 class="card__title">Packing for a weekend hike</h3>
    <p class="card__text">A short checklist for weather layers, food, and safety gear.</p>
    <a class="card__link" href="/guides/weekend-hike">Read guide</a>
  </div>
</article>`,
      },
      {
        type: 'code',
        language: 'css',
        title: 'Card surface and list reset',
        code: `.card {
  display: grid;
  background: #fff;
  border: 1px solid #e4e8e6;
  border-radius: 0.9rem;
  overflow: hidden;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
}

.card__media {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.card__body {
  display: grid;
  gap: 0.5rem;
  padding: 1rem 1.1rem 1.2rem;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.list__item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border: 1px solid #e4e8e6;
  border-radius: 0.7rem;
}`,
      },
      {
        type: 'tip',
        text: 'If a whole card is clickable, keep one clear link in the markup and stretch its hit area carefully. Avoid nesting interactive elements inside each other.',
      },
      {
        type: 'try',
        text: 'Build a responsive card grid with auto-fit columns and a separate stacked list of compact row items for a sidebar.',
      },
      {
        type: 'keypoints',
        items: [
          'Cards group media, title, text, and actions.',
          'Grid is ideal for card collections.',
          'List resets remove default bullets when designing custom rows.',
          'Keep interactive nesting simple for accessibility.',
        ],
      },
    ],
  },
  {
    slug: 'dark-mode-pref',
    title: 'prefers-color-scheme',
    description:
      'Support light and dark themes with prefers-color-scheme and CSS variables that swap design tokens.',
    level: 'intermediate',
    section: 'Components',
    order: 45,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'prefers-color-scheme lets your CSS respond to the user operating system theme. Combined with custom properties, you can theme an entire interface by swapping tokens instead of rewriting every rule.',
      },
      { type: 'h2', text: 'Token-based theming' },
      {
        type: 'code',
        language: 'css',
        title: 'Light defaults, dark overrides',
        code: `:root {
  color-scheme: light dark;
  --bg: #f4f7f6;
  --surface: #ffffff;
  --text: #15201d;
  --muted: #51605b;
  --border: #d7e0dc;
  --accent: #0f6a5a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f1413;
    --surface: #1a2220;
    --text: #ecf3f0;
    --muted: #a8b8b2;
    --border: #2c3834;
    --accent: #3db89a;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
}`,
      },
      {
        type: 'p',
        text: 'color-scheme: light dark helps native form controls adapt. Your custom surfaces should still use your own tokens for full visual consistency.',
      },
      { type: 'h2', text: 'Manual theme class (optional companion)' },
      {
        type: 'code',
        language: 'css',
        title: 'User-selected dark class',
        code: `:root[data-theme="dark"] {
  --bg: #0f1413;
  --surface: #1a2220;
  --text: #ecf3f0;
  --muted: #a8b8b2;
  --border: #2c3834;
  --accent: #3db89a;
}`,
      },
      {
        type: 'note',
        text: 'A production theme switcher often stores a user choice and sets data-theme on the document element. prefers-color-scheme remains a strong default when no choice is saved.',
      },
      {
        type: 'warning',
        text: 'Check contrast in both themes. A soft gray that works on white may disappear on dark surfaces.',
      },
      {
        type: 'try',
        text: 'Theme a page shell and card using CSS variables, then provide dark values under prefers-color-scheme: dark.',
      },
      {
        type: 'keypoints',
        items: [
          'prefers-color-scheme detects light or dark OS preference.',
          'CSS variables make theme swaps maintainable.',
          'color-scheme helps native controls adapt.',
          'Test contrast separately for each theme.',
        ],
      },
    ],
  },
  {
    slug: 'project-landing',
    title: 'Project: Responsive Landing',
    description:
      'Build a responsive landing page that combines fluid layout, media queries, visual polish, and reusable components.',
    level: 'intermediate',
    section: 'Projects',
    order: 46,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'This project pulls intermediate skills into one page: a responsive header, hero, feature grid, and final call to action. Focus on structure and clarity before heavy decoration.',
      },
      { type: 'h2', text: 'Project goals' },
      {
        type: 'ol',
        items: [
          'Create a mobile-first landing page with a max-width shell.',
          'Use Flexbox for the header and Grid for feature cards.',
          'Add fluid images, subtle shadows, and one tasteful transition.',
          'Support a dark theme through prefers-color-scheme and CSS variables.',
        ],
      },
      { type: 'h2', text: 'Suggested HTML outline' },
      {
        type: 'code',
        language: 'html',
        title: 'Landing page skeleton',
        code: `<body>
  <header class="site-header">...</header>
  <main>
    <section class="hero">
      <div>
        <h1>Northline Field Kits</h1>
        <p>Pack light. Stay ready. Built for early starts.</p>
        <a class="button button--primary" href="#cta">Shop kits</a>
      </div>
      <img src="hero.jpg" alt="Packed daypack on a trail railing">
    </section>
    <section class="features">
      <article class="card">...</article>
      <article class="card">...</article>
      <article class="card">...</article>
    </section>
    <section id="cta" class="cta">...</section>
  </main>
  <footer>...</footer>
</body>`,
      },
      { type: 'h2', text: 'Core CSS pieces' },
      {
        type: 'code',
        language: 'css',
        title: 'Shell, hero, and features',
        code: `:root {
  --bg: #f6f3ee;
  --text: #1d1a16;
  --accent: #0f6a5a;
  --surface: #fff;
}

body {
  margin: 0;
  font-family: "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--text);
}

.shell {
  width: min(100% - 2rem, 70rem);
  margin-inline: auto;
}

.hero {
  display: grid;
  gap: 1.5rem;
  padding-block: 2.5rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
}

@media (min-width: 48rem) {
  .hero {
    grid-template-columns: 1.1fr 1fr;
    align-items: center;
  }
}`,
      },
      {
        type: 'try',
        text: 'Ship a complete landing page with header, hero, three feature cards, and a CTA section. Resize from 320px to a wide desktop and fix any overflow.',
      },
      {
        type: 'keypoints',
        items: [
          'Combine mobile-first layout with component styling.',
          'Use Grid for feature collections and Flexbox for the header.',
          'Keep the first viewport focused: brand, one promise, one CTA.',
          'Test fluid images and theme tokens before adding extras.',
        ],
      },
    ],
  },
  {
    slug: 'project-dashboard-layout',
    title: 'Project: Dashboard Layout',
    description:
      'Construct a dashboard shell with grid areas, responsive stacking, cards, and a compact toolbar.',
    level: 'intermediate',
    section: 'Projects',
    order: 47,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Dashboards reward clear structure. This project uses CSS Grid template areas for the shell, Flexbox for toolbars, and cards/lists for content panels.',
      },
      { type: 'h2', text: 'Layout requirements' },
      {
        type: 'ul',
        items: [
          'Top bar with product name, search, and profile actions.',
          'Sidebar navigation on medium screens and up.',
          'Main content with a stats row and two supporting panels.',
          'Stacked single-column flow on small screens.',
        ],
      },
      {
        type: 'code',
        language: 'css',
        title: 'Dashboard grid areas',
        code: `.dashboard {
  min-height: 100vh;
  display: grid;
  gap: 1rem;
  padding: 1rem;
  grid-template-columns: 1fr;
  grid-template-areas:
    "top"
    "main"
    "side";
}

.top  { grid-area: top; }
.side { grid-area: side; }
.main { grid-area: main; }

@media (min-width: 56rem) {
  .dashboard {
    grid-template-columns: 14rem 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "top top"
      "side main";
  }
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0.75rem;
}

.panels {
  display: grid;
  gap: 1rem;
}

@media (min-width: 48rem) {
  .panels {
    grid-template-columns: 1.4fr 1fr;
  }
}`,
      },
      {
        type: 'code',
        language: 'html',
        title: 'Shell markup',
        code: `<div class="dashboard">
  <header class="top">...</header>
  <aside class="side">...</aside>
  <main class="main">
    <section class="stats">...</section>
    <section class="panels">
      <article class="card">Recent activity</article>
      <article class="card">Tasks</article>
    </section>
  </main>
</div>`,
      },
      {
        type: 'tip',
        text: 'Keep dashboard density readable. Compact spacing is fine, but do not shrink text or tap targets below comfortable sizes.',
      },
      {
        type: 'try',
        text: 'Implement the dashboard shell, then place four stat cards and two panels. Verify sidebar placement at the 56rem breakpoint.',
      },
      {
        type: 'keypoints',
        items: [
          'Grid template areas clarify complex shells.',
          'Stack dashboard regions on small viewports.',
          'Mix Grid for structure with Flexbox for toolbars.',
          'Cards and lists fill the content panels.',
        ],
      },
    ],
  },
  {
    slug: 'intermediate-review',
    title: 'Intermediate Review',
    description:
      'Review responsive techniques, Grid, visual design tools, and component patterns from the intermediate CSS path.',
    level: 'intermediate',
    section: 'Projects',
    order: 48,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'You now have the intermediate CSS toolkit for real interfaces: responsive foundations, Grid layout, visual polish, and reusable component styling.',
      },
      { type: 'h2', text: 'Responsive checklist' },
      {
        type: 'ul',
        items: [
          'Viewport meta tag is present.',
          'Layouts start mobile-first and enhance with min-width queries.',
          'Images and embeds use max-width: 100% and thoughtful object-fit.',
          'Container queries handle component-level space when needed.',
        ],
      },
      { type: 'h2', text: 'Layout checklist' },
      {
        type: 'ul',
        items: [
          'Grid defines page skeletons, template areas, and card matrices.',
          'Flexbox handles toolbars, nav rows, and local alignment.',
          'gap replaces most margin hacks between siblings.',
          'auto-fit with minmax() reduces breakpoint clutter for card grids.',
        ],
      },
      { type: 'h2', text: 'Visual design and components' },
      {
        type: 'ul',
        items: [
          'Custom properties centralize color, space, and radius tokens.',
          'Gradients and shadows support hierarchy without overwhelming content.',
          'Transitions and animations add feedback while respecting reduced motion.',
          'Nav, buttons, forms, cards, and theme tokens form a small design system.',
        ],
      },
      {
        type: 'code',
        language: 'css',
        title: 'Mini review snippet',
        code: `:root {
  --accent: #0f6a5a;
  --surface: #fff;
}

.page {
  width: min(100% - 2rem, 72rem);
  margin-inline: auto;
  display: grid;
  gap: 1.5rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --surface: #1a2220;
  }
}`,
      },
      {
        type: 'table',
        headers: ['Topic', 'Can you explain it?', 'Practice idea'],
        rows: [
          ['Media queries', 'min-width vs max-width', 'Refactor one desktop-first sheet'],
          ['Grid tracks', 'fr, repeat, minmax', 'Build an auto-fit gallery'],
          ['Grid areas', 'named regions', 'Dashboard shell'],
          ['Variables', 'tokens and inheritance', 'Theme a card set'],
          ['Motion', 'transition vs animation', 'Button hover + spinner'],
        ],
      },
      {
        type: 'try',
        text: 'Rebuild a one-page UI from memory that includes a responsive header, Grid feature section, themed tokens, and at least one transition.',
      },
      {
        type: 'keypoints',
        items: [
          'Responsive CSS adapts layout and media across devices.',
          'Grid and Flexbox solve different layout jobs and combine well.',
          'Variables, shadows, transforms, and motion polish components.',
          'Projects prove you can assemble these skills into complete pages.',
        ],
      },
    ],
  },
];
