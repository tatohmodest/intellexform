import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-css',
    title: 'What is CSS?',
    description: 'Learn what CSS is, how it works with HTML, and why stylesheets matter for every web page.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 8,
    content: [
      { type: 'p', text: 'CSS stands for Cascading Style Sheets. It is the language that controls how HTML looks: colors, fonts, spacing, layout, and more. HTML builds the structure. CSS paints and arranges that structure on the screen.' },
      { type: 'h2', text: 'HTML without CSS' },
      { type: 'p', text: 'A plain HTML page still shows content, but it uses the browser default look. Headings are bold, paragraphs stack vertically, and links are usually blue and underlined. That default look is rarely what a product needs.' },
      {
        type: 'code',
        title: 'Plain HTML (no stylesheet yet)',
        language: 'html',
        code: `<h1>Intellex Cafe</h1>
<p>Fresh coffee and quiet corners.</p>
<a href="/menu">View menu</a>`
      },
      { type: 'h2', text: 'What CSS adds' },
      { type: 'p', text: 'With CSS you can change color, size, spacing, alignment, and layout. The same HTML can look like a newspaper, a mobile app, or a bold landing page.' },
      {
        type: 'code',
        title: 'A first CSS rule',
        language: 'css',
        code: `h1 {
  color: #1a3a2a;
  font-size: 2.5rem;
}

p {
  color: #334155;
  line-height: 1.6;
}`
      },
      { type: 'h2', text: 'The three layers of a web page' },
      {
        type: 'table',
        headers: ['Layer', 'Language', 'Job'],
        rows: [
          ['Structure', 'HTML', 'What content exists'],
          ['Presentation', 'CSS', 'How content looks and is laid out'],
          ['Behavior', 'JavaScript', 'How the page responds to users']
        ]
      },
      { type: 'h2', text: 'Why "cascading" matters' },
      { type: 'p', text: 'Cascading means multiple style sources can apply to the same element. Browser defaults, your stylesheet, and more specific rules all compete. Later lessons cover how the browser decides which rule wins.' },
      { type: 'note', text: 'CSS is not a programming language in the same way JavaScript is. It is a style language: you declare how things should look, and the browser applies those rules.' },
      { type: 'try', text: 'Open any website, right-click an element, and choose Inspect. Find the Styles panel and note two CSS properties you recognize, such as color or font-size.' },
      { type: 'keypoints', items: ['CSS controls presentation: color, typography, spacing, and layout.', 'HTML provides structure; CSS styles that structure.', 'Cascading means multiple style sources can apply to one element.', 'Learning CSS starts with rules: a selector plus a set of declarations.'] }
    ]
  },
  {
    slug: 'add-css',
    title: 'Ways to Add CSS',
    description: 'Learn the three ways to add CSS to a page: inline styles, internal stylesheets, and external CSS files.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 9,
    content: [
      { type: 'p', text: 'You can attach CSS to HTML in three main ways. For real projects, an external stylesheet is the best default. Inline and internal styles are still useful for learning and small demos.' },
      { type: 'h2', text: '1. Inline styles' },
      { type: 'p', text: 'Inline CSS uses the style attribute on a single HTML element. It is quick for experiments, but hard to maintain when many elements need the same look.' },
      {
        type: 'code',
        title: 'Inline style attribute',
        language: 'html',
        code: `<p style="color: #0f766e; font-size: 1.125rem;">
  Welcome to the studio.
</p>`
      },
      { type: 'h2', text: '2. Internal stylesheet' },
      { type: 'p', text: 'An internal stylesheet lives in a style element, usually inside the head. Rules apply to the whole page, but they are still tied to that one HTML file.' },
      {
        type: 'code',
        title: 'Internal CSS in the head',
        language: 'html',
        code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Georgia, serif;
      background: #f8fafc;
    }

    h1 {
      color: #0f172a;
    }
  </style>
</head>
<body>
  <h1>Studio Notes</h1>
</body>
</html>`
      },
      { type: 'h2', text: '3. External stylesheet' },
      { type: 'p', text: 'An external CSS file is linked from HTML with a link element. One stylesheet can style many pages, which keeps design consistent and HTML cleaner.' },
      {
        type: 'code',
        title: 'Linking styles.css',
        language: 'html',
        code: `<link rel="stylesheet" href="styles.css">`
      },
      {
        type: 'code',
        title: 'styles.css',
        language: 'css',
        code: `body {
  margin: 0;
  font-family: Georgia, serif;
  background: #f8fafc;
  color: #0f172a;
}

h1 {
  font-size: 2rem;
}`
      },
      {
        type: 'table',
        headers: ['Method', 'Best for', 'Downside'],
        rows: [
          ['Inline', 'One-off tests', 'Hard to reuse and override'],
          ['Internal', 'Single-page demos', 'Does not share across pages'],
          ['External', 'Real projects', 'Needs a separate file and link']
        ]
      },
      { type: 'tip', text: 'Prefer external CSS early. It trains the habit of separating structure (HTML) from presentation (CSS).' },
      { type: 'try', text: 'Create index.html and styles.css. Link the CSS file, then style the body background and an h1 color.' },
      { type: 'keypoints', items: ['Inline CSS lives on one element via the style attribute.', 'Internal CSS uses a style element in the page.', 'External CSS uses a linked .css file and scales best.', 'Real projects should default to external stylesheets.'] }
    ]
  },
  {
    slug: 'selectors-basics',
    title: 'Selectors Basics',
    description: 'Learn how element, class, and ID selectors target HTML so your CSS rules apply to the right parts of a page.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 10,
    content: [
      { type: 'p', text: 'A CSS rule has two parts: a selector (what to style) and declarations (how to style it). Selectors are how you aim CSS at the right HTML elements.' },
      {
        type: 'code',
        title: 'Selector and declarations',
        language: 'css',
        code: `/* selector */
p {
  /* declarations */
  color: #334155;
  font-size: 1rem;
}`
      },
      { type: 'h2', text: 'Element selectors' },
      { type: 'p', text: 'An element selector uses a tag name. It styles every matching element on the page.' },
      {
        type: 'code',
        title: 'Element selectors',
        language: 'css',
        code: `h1 {
  color: #0f172a;
}

a {
  color: #0f766e;
}`
      },
      { type: 'h2', text: 'Class selectors' },
      { type: 'p', text: 'A class selector starts with a dot. Classes are reusable labels you add to HTML. They are the most common way to style components.' },
      {
        type: 'code',
        title: 'HTML with a class',
        language: 'html',
        code: `<p class="lead">A short introduction for visitors.</p>
<p>Regular paragraph text.</p>`
      },
      {
        type: 'code',
        title: 'Class selector',
        language: 'css',
        code: `.lead {
  font-size: 1.25rem;
  color: #1e293b;
}`
      },
      { type: 'h2', text: 'ID selectors' },
      { type: 'p', text: 'An ID selector starts with a hash. An ID should be unique on a page. Prefer classes for styling and reserve IDs for unique landmarks or JavaScript hooks.' },
      {
        type: 'code',
        title: 'ID selector',
        language: 'css',
        code: `#site-header {
  background: #0f172a;
  color: #f8fafc;
}`
      },
      { type: 'h2', text: 'Grouping and combining' },
      {
        type: 'code',
        title: 'Shared styles and a combined selector',
        language: 'css',
        code: `/* same styles for both */
h1, h2 {
  font-family: Georgia, serif;
}

/* only a paragraph inside .card */
.card p {
  margin-bottom: 0.75rem;
}`
      },
      {
        type: 'table',
        headers: ['Selector', 'Example', 'Targets'],
        rows: [
          ['Element', 'p', 'All paragraphs'],
          ['Class', '.lead', 'Elements with class="lead"'],
          ['ID', '#site-header', 'The element with id="site-header"'],
          ['Descendant', '.card p', 'Paragraphs inside .card']
        ]
      },
      { type: 'warning', text: 'Do not overuse IDs for styling. Classes are easier to reuse and override as projects grow.' },
      { type: 'try', text: 'Write HTML with two buttons: one with class primary and one with class secondary. Style each class with a different background color.' },
      { type: 'keypoints', items: ['Selectors choose which elements a rule styles.', 'Element selectors target tag names.', 'Class selectors are reusable and preferred for most styling.', 'ID selectors target one unique element and should be used sparingly for CSS.'] }
    ]
  },
  {
    slug: 'colors-units',
    title: 'Colors and Units',
    description: 'Learn common CSS color formats and length units so you can set colors, sizes, and spacing with confidence.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 10,
    content: [
      { type: 'p', text: 'Almost every visual style uses a color or a size. CSS gives you several ways to write colors and several units for lengths. Learning a small reliable set is enough for beginner work.' },
      { type: 'h2', text: 'Color formats' },
      {
        type: 'code',
        title: 'Named colors, hex, rgb, and hsl',
        language: 'css',
        code: `.named {
  color: teal;
}

.hex {
  color: #0f766e;
}

.rgb {
  color: rgb(15, 118, 110);
}

.hsl {
  color: hsl(174, 77%, 26%);
}`
      },
      { type: 'p', text: 'Hex colors are very common in tutorials and design tools. rgb and hsl are useful when you want to adjust channels or lightness more clearly. Named colors are fine for learning, but hex or rgb values are clearer for real products.' },
      { type: 'h2', text: 'Background and text color' },
      {
        type: 'code',
        title: 'Text and background together',
        language: 'css',
        code: `body {
  background-color: #f8fafc;
  color: #0f172a;
}

.banner {
  background-color: #0f172a;
  color: #f8fafc;
}`
      },
      { type: 'tip', text: 'Always check contrast. Light gray text on a white background looks soft but can be hard to read.' },
      { type: 'h2', text: 'Common length units' },
      {
        type: 'table',
        headers: ['Unit', 'Meaning', 'Good for'],
        rows: [
          ['px', 'Pixels', 'Borders and precise control'],
          ['rem', 'Relative to root font size', 'Font sizes and spacing scales'],
          ['em', 'Relative to parent font size', 'Component-local sizing'],
          ['%', 'Percent of parent', 'Widths that scale with the container'],
          ['vh / vw', 'Viewport height / width', 'Full-screen sections']
        ]
      },
      {
        type: 'code',
        title: 'Mixing units thoughtfully',
        language: 'css',
        code: `html {
  font-size: 16px;
}

h1 {
  font-size: 2.5rem; /* 40px if root is 16px */
}

.card {
  width: 90%;
  max-width: 28rem;
  padding: 1.5rem;
  border: 1px solid #cbd5e1;
}`
      },
      { type: 'h2', text: 'Why rem is popular' },
      { type: 'p', text: 'rem sizes scale with the root font size. If a user enlarges text in the browser, rem-based type and spacing tend to grow more predictably than a page built only with px.' },
      { type: 'note', text: 'You do not need every unit on day one. Start with rem for type and spacing, px for thin borders, and % or max-width for flexible layouts.' },
      { type: 'try', text: 'Style a box with background-color, color, width in %, padding in rem, and a 1px border. Change the root font-size and watch rem values scale.' },
      { type: 'keypoints', items: ['Common color formats include named colors, hex, rgb, and hsl.', 'Use strong contrast between text and background.', 'px, rem, em, %, and viewport units cover most beginner needs.', 'rem is a strong default for typography and spacing scales.'] }
    ]
  },
  {
    slug: 'cascade-specificity',
    title: 'Cascade and Specificity Intro',
    description: 'Learn how CSS decides which rule wins when multiple rules target the same element.',
    level: 'beginner',
    section: 'Getting Started',
    order: 5,
    minutes: 11,
    content: [
      { type: 'p', text: 'When two CSS rules disagree, the browser does not guess randomly. It uses the cascade: origin, importance, specificity, and source order. For beginners, specificity and source order explain most surprises.' },
      { type: 'h2', text: 'Source order' },
      { type: 'p', text: 'If two rules have the same specificity, the one that appears later in the CSS wins.' },
      {
        type: 'code',
        title: 'Later rule wins when specificity matches',
        language: 'css',
        code: `p {
  color: blue;
}

p {
  color: green; /* wins */
}`
      },
      { type: 'h2', text: 'Specificity in plain words' },
      { type: 'p', text: 'Specificity measures how targeted a selector is. An ID beats a class. A class beats an element selector. Inline styles beat almost everything except !important (which you should avoid while learning).' },
      {
        type: 'table',
        headers: ['Selector type', 'Example', 'Relative strength'],
        rows: [
          ['Element', 'p', 'Lowest of these three'],
          ['Class', '.lead', 'Medium'],
          ['ID', '#hero', 'Highest of these three']
        ]
      },
      {
        type: 'code',
        title: 'Specificity example',
        language: 'html',
        code: `<p id="intro" class="lead">Hello</p>`
      },
      {
        type: 'code',
        title: 'Which color wins?',
        language: 'css',
        code: `p {
  color: black;
}

.lead {
  color: teal;
}

#intro {
  color: crimson; /* wins: ID is more specific */
}`
      },
      { type: 'h2', text: 'A practical beginner strategy' },
      { type: 'ol', items: ['Prefer classes for almost all styling.', 'Avoid styling with IDs when a class would work.', 'Keep selectors short: .card-title is usually better than div section .card h2.', 'When something will not change, check whether a more specific rule is overriding yours.'] },
      { type: 'h2', text: 'Inheritance' },
      { type: 'p', text: 'Some properties inherit from parents to children. Text color and font-family often inherit. Margin and padding do not. That is why setting font styles on body can affect the whole page.' },
      {
        type: 'code',
        title: 'Inherited font styles',
        language: 'css',
        code: `body {
  font-family: Georgia, serif;
  color: #0f172a;
}

/* paragraphs inherit the body font and color */`
      },
      { type: 'warning', text: 'Avoid !important as a beginner fix. It makes later overrides harder. Solve conflicts with clearer structure and better specificity instead.' },
      { type: 'try', text: 'Create a paragraph with a class and an ID. Write three color rules (element, class, ID) and predict which one wins before you check the browser.' },
      { type: 'keypoints', items: ['The cascade decides which conflicting CSS rule applies.', 'Equal specificity: later rules win.', 'IDs beat classes; classes beat elements.', 'Prefer class-based styling and short selectors.' ] }
    ]
  },
  {
    slug: 'box-model',
    title: 'The Box Model',
    description: 'Learn the CSS box model: content, padding, border, and margin, and how they build every element on the page.',
    level: 'beginner',
    section: 'Box Model',
    order: 6,
    minutes: 10,
    content: [
      { type: 'p', text: 'Every HTML element is drawn as a box. The box model describes the layers of that box: content in the center, then padding, then border, then margin outside.' },
      { type: 'h2', text: 'The four layers' },
      {
        type: 'table',
        headers: ['Layer', 'What it is'],
        rows: [
          ['Content', 'The text, image, or inner content area'],
          ['Padding', 'Space between content and border'],
          ['Border', 'The edge drawn around the padding'],
          ['Margin', 'Space outside the border, between this box and others']
        ]
      },
      {
        type: 'code',
        title: 'A visible box model',
        language: 'css',
        code: `.card {
  width: 240px;
  padding: 16px;
  border: 4px solid #0f766e;
  margin: 24px;
  background: #ecfdf5;
}`
      },
      { type: 'h2', text: 'How total size is calculated' },
      { type: 'p', text: 'In the default content-box model, width and height apply to the content area only. Padding and border add extra size outside that content width.' },
      {
        type: 'code',
        title: 'Default sizing mental model',
        language: 'css',
        code: `/* content width: 240px
   + left/right padding: 16px + 16px
   + left/right border: 4px + 4px
   = 280px total visual width */`
      },
      { type: 'p', text: 'That surprise is why box-sizing: border-box (covered soon) is popular: it makes width include padding and border.' },
      { type: 'h2', text: 'Block boxes and inline boxes' },
      { type: 'p', text: 'Block-level boxes (like div and p) usually take the full available width and stack vertically. Inline boxes (like span and a) sit within a line of text and ignore width/height in the usual way.' },
      {
        type: 'code',
        title: 'Block vs inline reminder',
        language: 'html',
        code: `<div class="card">Block box</div>
<p>A <span class="tag">inline</span> piece of text.</p>`
      },
      { type: 'note', text: 'When spacing looks wrong, inspect the box model in DevTools. Seeing content, padding, border, and margin as colored layers makes CSS much clearer.' },
      { type: 'try', text: 'Create a .box class with width, padding, border, and margin. Use DevTools to confirm each layer matches your CSS.' },
      { type: 'keypoints', items: ['Every element is a box with content, padding, border, and margin.', 'Padding is inside the border; margin is outside.', 'Default width applies to content only, unless box-sizing changes that.', 'DevTools is the fastest way to see the box model visually.'] }
    ]
  },
  {
    slug: 'margin-padding',
    title: 'Margin and Padding',
    description: 'Learn how margin and padding create space inside and outside elements, including shorthand and common layout patterns.',
    level: 'beginner',
    section: 'Box Model',
    order: 7,
    minutes: 10,
    content: [
      { type: 'p', text: 'Padding creates space inside an element. Margin creates space outside an element. Together they control breathing room and distance between parts of a layout.' },
      { type: 'h2', text: 'Padding: inner space' },
      {
        type: 'code',
        title: 'Padding on a button',
        language: 'css',
        code: `.button {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  background: #0f766e;
  color: white;
}`
      },
      { type: 'p', text: 'Without padding, text sits tight against the button edges. Padding makes controls feel clickable and comfortable.' },
      { type: 'h2', text: 'Margin: outer space' },
      {
        type: 'code',
        title: 'Margin between sections',
        language: 'css',
        code: `.section {
  margin-bottom: 3rem;
}

.card {
  margin: 1rem;
}`
      },
      { type: 'h2', text: 'Shorthand order' },
      { type: 'p', text: 'When you write two, three, or four values, CSS maps them to sides in a fixed order: top, right, bottom, left (clockwise from the top).' },
      {
        type: 'code',
        title: 'Padding and margin shorthand',
        language: 'css',
        code: `/* top/bottom | left/right */
.card {
  padding: 1.5rem 1rem;
}

/* top | left/right | bottom */
.hero {
  margin: 2rem 1rem 3rem;
}

/* top | right | bottom | left */
.panel {
  padding: 1rem 1.25rem 1.5rem 1.25rem;
}`
      },
      { type: 'h2', text: 'Centering with auto margins' },
      { type: 'p', text: 'A block element with a set width can be centered horizontally using margin-left and margin-right set to auto.' },
      {
        type: 'code',
        title: 'Center a content column',
        language: 'css',
        code: `.container {
  width: 90%;
  max-width: 40rem;
  margin-left: auto;
  margin-right: auto;
}`
      },
      { type: 'h2', text: 'Margin collapse (quick intro)' },
      { type: 'p', text: 'Vertical margins between stacked block elements can collapse into one shared margin. The larger value often wins. Padding does not collapse the same way, which is one reason people use padding inside cards and containers.' },
      { type: 'tip', text: 'A common pattern: use padding inside components for inner spacing, and margin (or gap in flex/grid) to separate siblings.' },
      { type: 'try', text: 'Build a card with padding: 1.5rem and margin-bottom: 1rem. Then add a second card and compare the space inside vs between the cards.' },
      { type: 'keypoints', items: ['Padding adds space inside the border.', 'Margin adds space outside the border.', 'Shorthand follows top, right, bottom, left.', 'Auto left/right margins can center a block with a width.'] }
    ]
  },
  {
    slug: 'borders-outline',
    title: 'Borders and Outline',
    description: 'Learn how to draw borders and outlines, including width, style, color, radius, and when outline is the better choice.',
    level: 'beginner',
    section: 'Box Model',
    order: 8,
    minutes: 9,
    content: [
      { type: 'p', text: 'Borders sit between padding and margin and affect layout size. Outlines are often used for focus states and usually do not take up space in the box model the same way.' },
      { type: 'h2', text: 'Border basics' },
      {
        type: 'code',
        title: 'Border shorthand',
        language: 'css',
        code: `.card {
  border: 1px solid #cbd5e1;
}

.highlight {
  border: 3px dashed #0f766e;
}`
      },
      { type: 'p', text: 'The shorthand order is width, style, color. Common styles include solid, dashed, dotted, and none.' },
      { type: 'h2', text: 'Individual sides' },
      {
        type: 'code',
        title: 'One-sided borders',
        language: 'css',
        code: `.quote {
  border-left: 4px solid #0f766e;
  padding-left: 1rem;
}

.tabs {
  border-bottom: 1px solid #e2e8f0;
}`
      },
      { type: 'h2', text: 'Border radius' },
      { type: 'p', text: 'border-radius rounds corners. Small values soften a box. Larger values can create pill-like buttons or circles when combined with equal width and height.' },
      {
        type: 'code',
        title: 'Rounded corners',
        language: 'css',
        code: `.card {
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}`
      },
      { type: 'h2', text: 'Outline vs border' },
      {
        type: 'table',
        headers: ['Feature', 'border', 'outline'],
        rows: [
          ['Affects layout size', 'Yes', 'Usually no'],
          ['Follows border-radius', 'Yes', 'Browser support varies by property'],
          ['Common use', 'Visible component edges', 'Keyboard focus rings'],
          ['Per-side control', 'Yes', 'No']
        ]
      },
      {
        type: 'code',
        title: 'Focus outline example',
        language: 'css',
        code: `.button:focus {
  outline: 2px solid #2563eb;
  outline-offset: 3px;
}`
      },
      { type: 'warning', text: 'Do not remove focus outlines without providing a clear replacement. Keyboard users rely on focus styles to know where they are.' },
      { type: 'try', text: 'Style a card with a light border and border-radius. Then add a :focus outline on a button inside the card.' },
      { type: 'keypoints', items: ['Borders have width, style, and color.', 'border-radius rounds corners.', 'Borders affect box size; outlines usually do not.', 'Keep visible focus styles for accessibility.'] }
    ]
  },
  {
    slug: 'width-height',
    title: 'Width, Height, and max-width',
    description: 'Learn how width, height, min/max constraints, and percentage sizing control element dimensions.',
    level: 'beginner',
    section: 'Box Model',
    order: 9,
    minutes: 10,
    content: [
      { type: 'p', text: 'Width and height set how large a box wants to be. In real layouts you often combine a flexible width with a max-width so content looks good on both phones and large screens.' },
      { type: 'h2', text: 'Fixed and fluid widths' },
      {
        type: 'code',
        title: 'px vs percentage width',
        language: 'css',
        code: `.sidebar {
  width: 280px;
}

.main {
  width: 70%;
}`
      },
      { type: 'p', text: 'Fixed pixel widths stay constant. Percentage widths scale with the parent. Fluid widths are usually better for page content.' },
      { type: 'h2', text: 'max-width for readable lines' },
      { type: 'p', text: 'Long lines of text are hard to read. A common pattern is width: 100% (or 90%) with a max-width that keeps the text column comfortable.' },
      {
        type: 'code',
        title: 'Readable content column',
        language: 'css',
        code: `.prose {
  width: 90%;
  max-width: 40rem;
  margin-inline: auto;
}`
      },
      { type: 'h2', text: 'Height behavior' },
      { type: 'p', text: 'Height is often left to content. Forcing height can clip text if content grows. Prefer min-height when you need a tall area that can still expand.' },
      {
        type: 'code',
        title: 'min-height instead of rigid height',
        language: 'css',
        code: `.hero {
  min-height: 60vh;
}

.thumbnail {
  width: 120px;
  height: 120px;
  object-fit: cover;
}`
      },
      { type: 'h2', text: 'min-width and max-height' },
      {
        type: 'table',
        headers: ['Property', 'Use'],
        rows: [
          ['min-width', 'Prevent a box from getting too narrow'],
          ['max-width', 'Prevent a box from getting too wide'],
          ['min-height', 'Keep a section tall enough while allowing growth'],
          ['max-height', 'Limit height, often with overflow scrolling']
        ]
      },
      {
        type: 'code',
        title: 'Scrollable panel',
        language: 'css',
        code: `.notes {
  max-height: 12rem;
  overflow: auto;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}`
      },
      { type: 'tip', text: 'For images, set max-width: 100% and height: auto so large images shrink inside their containers instead of overflowing.' },
      {
        type: 'code',
        title: 'Responsive images',
        language: 'css',
        code: `img {
  max-width: 100%;
  height: auto;
}`
      },
      { type: 'try', text: 'Create a .container with width: 92% and max-width: 720px, centered with auto margins. Place a paragraph inside and resize the browser.' },
      { type: 'keypoints', items: ['Width can be fixed or fluid.', 'max-width keeps layouts readable on large screens.', 'Prefer min-height over rigid height for growing content.', 'Images often need max-width: 100% to stay inside containers.'] }
    ]
  },
  {
    slug: 'box-sizing',
    title: 'box-sizing',
    description: 'Learn how box-sizing changes whether padding and border are included in an element width and height.',
    level: 'beginner',
    section: 'Box Model',
    order: 10,
    minutes: 9,
    content: [
      { type: 'p', text: 'box-sizing controls what width and height mean. The default is content-box. Most modern projects switch to border-box because sizing becomes more intuitive.' },
      { type: 'h2', text: 'content-box (default)' },
      { type: 'p', text: 'With content-box, width sets the content area only. Padding and border add extra size on top.' },
      {
        type: 'code',
        title: 'content-box surprise',
        language: 'css',
        code: `.box {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* total width becomes 250px */
}`
      },
      { type: 'h2', text: 'border-box' },
      { type: 'p', text: 'With border-box, width includes content, padding, and border. If width is 200px, the whole visible box stays 200px wide (margin still sits outside).' },
      {
        type: 'code',
        title: 'border-box behavior',
        language: 'css',
        code: `.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* total border+padding+content width stays 200px */
}`
      },
      { type: 'h2', text: 'A global reset many projects use' },
      {
        type: 'code',
        title: 'Universal border-box',
        language: 'css',
        code: `*,
*::before,
*::after {
  box-sizing: border-box;
}`
      },
      { type: 'p', text: 'This rule makes percentage widths and side-by-side layouts much easier. Two columns at width: 50% with padding will still fit on one row.' },
      {
        type: 'code',
        title: 'Two columns that fit',
        language: 'css',
        code: `.col {
  box-sizing: border-box;
  width: 50%;
  float: left; /* simple demo only; flex is better later */
  padding: 1rem;
}`
      },
      {
        type: 'table',
        headers: ['box-sizing', 'width includes'],
        rows: [
          ['content-box', 'Content only'],
          ['border-box', 'Content + padding + border']
        ]
      },
      { type: 'note', text: 'Margin is never included in width for either box-sizing value. Margin always sits outside the border edge.' },
      { type: 'try', text: 'Create two boxes with the same width, padding, and border. Set one to content-box and one to border-box. Compare their measured widths in DevTools.' },
      { type: 'keypoints', items: ['content-box width excludes padding and border.', 'border-box width includes padding and border.', 'Global border-box is a common modern default.', 'Margin is always outside the sized box.'] }
    ]
  },
  {
    slug: 'fonts-text',
    title: 'Fonts and Text',
    description: 'Learn core typography properties: font-family, font-size, font-weight, and related text styling controls.',
    level: 'beginner',
    section: 'Typography',
    order: 11,
    minutes: 10,
    content: [
      { type: 'p', text: 'Typography is one of the fastest ways to make a page feel intentional. CSS gives you control over the font stack, size, weight, and how text is rendered.' },
      { type: 'h2', text: 'font-family and fallbacks' },
      { type: 'p', text: 'A font-family list should end with a generic family such as serif, sans-serif, or monospace. If the first font is missing, the browser tries the next option.' },
      {
        type: 'code',
        title: 'Font stacks',
        language: 'css',
        code: `body {
  font-family: Georgia, "Times New Roman", serif;
}

code {
  font-family: "Courier New", Courier, monospace;
}`
      },
      { type: 'h2', text: 'font-size' },
      {
        type: 'code',
        title: 'Sizing type with rem',
        language: 'css',
        code: `body {
  font-size: 1rem;
}

h1 {
  font-size: 2.25rem;
}

.small {
  font-size: 0.875rem;
}`
      },
      { type: 'h2', text: 'font-weight and font-style' },
      {
        type: 'code',
        title: 'Weight and style',
        language: 'css',
        code: `.title {
  font-weight: 700;
}

.emphasis {
  font-style: italic;
}

.meta {
  font-weight: 500;
}`
      },
      { type: 'p', text: 'Common weights are 400 (normal) and 700 (bold). Not every font file includes every weight, especially when you load custom web fonts later.' },
      { type: 'h2', text: 'Useful text properties' },
      {
        type: 'table',
        headers: ['Property', 'Example use'],
        rows: [
          ['color', 'Set text color'],
          ['text-transform', 'uppercase labels or buttons'],
          ['letter-spacing', 'Slight tracking on headings'],
          ['font-variant', 'Small caps for special labels']
        ]
      },
      {
        type: 'code',
        title: 'Label styling',
        language: 'css',
        code: `.label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
}`
      },
      { type: 'tip', text: 'Quote font names that contain spaces, such as "Times New Roman". Generic families like serif do not need quotes.' },
      { type: 'try', text: 'Style body text with a serif stack and a heading with a different size and weight. Add a .label class with uppercase and letter-spacing.' },
      { type: 'keypoints', items: ['font-family lists should include fallbacks and a generic family.', 'rem is a strong default for font-size.', 'font-weight and font-style control emphasis.', 'Small typography details like letter-spacing can refine UI labels.'] }
    ]
  },
  {
    slug: 'line-height-spacing',
    title: 'Line Height and Spacing',
    description: 'Learn how line-height, letter-spacing, and word-spacing affect readability and rhythm in text blocks.',
    level: 'beginner',
    section: 'Typography',
    order: 12,
    minutes: 9,
    content: [
      { type: 'p', text: 'Good spacing makes text easier to read. line-height controls the vertical rhythm between lines. letter-spacing and word-spacing fine-tune horizontal spacing.' },
      { type: 'h2', text: 'line-height' },
      { type: 'p', text: 'line-height can be a number, a length, or a percentage. A unitless number (like 1.6) is usually best because it scales with the font size.' },
      {
        type: 'code',
        title: 'Readable body text',
        language: 'css',
        code: `body {
  font-size: 1rem;
  line-height: 1.6;
}

h1, h2, h3 {
  line-height: 1.2;
}`
      },
      { type: 'p', text: 'Body text often wants more line-height. Headings often want tighter line-height so multi-line titles feel compact.' },
      { type: 'h2', text: 'Spacing between paragraphs' },
      {
        type: 'code',
        title: 'Paragraph rhythm',
        language: 'css',
        code: `p {
  margin-top: 0;
  margin-bottom: 1rem;
}

.lead {
  margin-bottom: 1.5rem;
}`
      },
      { type: 'h2', text: 'letter-spacing and word-spacing' },
      {
        type: 'code',
        title: 'Horizontal spacing',
        language: 'css',
        code: `.display {
  letter-spacing: -0.02em; /* slightly tighter for large headings */
}

.caps {
  letter-spacing: 0.08em;
}

.wide-words {
  word-spacing: 0.15em;
}`
      },
      {
        type: 'table',
        headers: ['Property', 'Beginner guidance'],
        rows: [
          ['line-height', 'Use unitless values; ~1.5 to 1.7 for body text'],
          ['letter-spacing', 'Use small adjustments; large values reduce readability'],
          ['word-spacing', 'Rarely needed for normal paragraphs'],
          ['margin on text blocks', 'Create clear separation between paragraphs and headings']
        ]
      },
      { type: 'h2', text: 'A simple type scale' },
      {
        type: 'code',
        title: 'Consistent vertical rhythm',
        language: 'css',
        code: `h1 {
  font-size: 2.5rem;
  line-height: 1.15;
  margin-bottom: 0.75rem;
}

p {
  font-size: 1rem;
  line-height: 1.65;
  margin-bottom: 1rem;
}`
      },
      { type: 'note', text: 'If text feels cramped, increase line-height before shrinking the font. Readability often improves more from spacing than from tiny type.' },
      { type: 'try', text: 'Create a short article with an h1 and three paragraphs. Set body line-height to 1.2, then to 1.7, and compare readability.' },
      { type: 'keypoints', items: ['line-height controls space between lines of text.', 'Unitless line-height values scale cleanly with font-size.', 'Headings often use tighter line-height than body copy.', 'letter-spacing is useful in small amounts for labels and display type.'] }
    ]
  },
  {
    slug: 'text-align-decoration',
    title: 'Align and Decorations',
    description: 'Learn text-align, text-decoration, text-indent, and related properties for alignment and text ornaments.',
    level: 'beginner',
    section: 'Typography',
    order: 13,
    minutes: 9,
    content: [
      { type: 'p', text: 'Alignment and decorations help you shape how text sits in its box and how links or emphasis appear. These properties are simple, but they appear on almost every page.' },
      { type: 'h2', text: 'text-align' },
      {
        type: 'code',
        title: 'Horizontal text alignment',
        language: 'css',
        code: `.hero-copy {
  text-align: center;
}

.article {
  text-align: left;
}

.price {
  text-align: right;
}`
      },
      { type: 'p', text: 'text-align affects inline content inside a block. For long paragraphs, left alignment is usually easiest to read in left-to-right languages.' },
      { type: 'h2', text: 'text-decoration' },
      {
        type: 'code',
        title: 'Underlines and link styles',
        language: 'css',
        code: `a {
  color: #0f766e;
  text-decoration: underline;
}

a.button {
  text-decoration: none;
}

.sold-out {
  text-decoration: line-through;
  color: #94a3b8;
}`
      },
      { type: 'h2', text: 'Modern decoration controls' },
      {
        type: 'code',
        title: 'Underline styling',
        language: 'css',
        code: `.fancy-link {
  text-decoration-line: underline;
  text-decoration-color: #99f6e4;
  text-decoration-thickness: 2px;
  text-underline-offset: 0.2em;
}`
      },
      { type: 'h2', text: 'text-indent and white-space' },
      {
        type: 'table',
        headers: ['Property', 'Use'],
        rows: [
          ['text-indent', 'Indent the first line of a paragraph'],
          ['white-space: nowrap', 'Keep text on one line'],
          ['white-space: pre-wrap', 'Preserve line breaks and wrap long lines'],
          ['text-overflow: ellipsis', 'Show ... when text overflows (with overflow hidden)']
        ]
      },
      {
        type: 'code',
        title: 'Truncated single-line label',
        language: 'css',
        code: `.filename {
  max-width: 12rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`
      },
      { type: 'warning', text: 'Centered body paragraphs look stylish in short hero lines, but long centered articles are harder to read. Use center mainly for short headings and captions.' },
      { type: 'try', text: 'Style navigation links with no underline by default and an underline on :hover. Center a short hero heading above left-aligned article text.' },
      { type: 'keypoints', items: ['text-align controls horizontal alignment of inline content.', 'text-decoration handles underlines, strike-through, and related effects.', 'Underline offset and thickness can refine link styles.', 'Ellipsis truncation needs nowrap, overflow hidden, and a width constraint.'] }
    ]
  },
  {
    slug: 'web-fonts-intro',
    title: 'Web Fonts Intro',
    description: 'Learn how web fonts work at a beginner level, including system fonts, @font-face ideas, and practical loading tips.',
    level: 'beginner',
    section: 'Typography',
    order: 14,
    minutes: 10,
    content: [
      { type: 'p', text: 'Web fonts let you use typefaces that are not installed on every visitor computer. You can also stay with system fonts for speed and simplicity. Both approaches are valid.' },
      { type: 'h2', text: 'System font stacks' },
      { type: 'p', text: 'A system stack uses fonts already on the device. Pages load fast and still look native on each platform.' },
      {
        type: 'code',
        title: 'System UI stack',
        language: 'css',
        code: `body {
  font-family:
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
}`
      },
      { type: 'h2', text: 'Loading a font with a link' },
      { type: 'p', text: 'Many beginners load fonts from a font host by adding a link in HTML, then referencing the family in CSS. Always keep a fallback family.' },
      {
        type: 'code',
        title: 'HTML link to a font stylesheet',
        language: 'html',
        code: `<link rel="stylesheet" href="https://fonts.example.com/css2?family=Source+Serif+4&display=swap">`
      },
      {
        type: 'code',
        title: 'Use the loaded family',
        language: 'css',
        code: `body {
  font-family: "Source Serif 4", Georgia, serif;
}`
      },
      { type: 'h2', text: '@font-face in concept' },
      { type: 'p', text: '@font-face tells the browser the name of a font and where to download the font file. Hosted font CSS often writes this for you. Self-hosting means you provide the files and the @font-face rules.' },
      {
        type: 'code',
        title: 'Simplified @font-face shape',
        language: 'css',
        code: `@font-face {
  font-family: "Demo Serif";
  src: url("/fonts/demo-serif.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Demo Serif", Georgia, serif;
}`
      },
      { type: 'h2', text: 'Practical tips' },
      { type: 'ul', items: ['Limit the number of families and weights you load.', 'Prefer woff2 when you control the files.', 'Use font-display: swap so text stays visible while fonts load.', 'Always declare fallback fonts after the custom family.'] },
      { type: 'note', text: 'Custom fonts can improve brand feel, but they add download cost. For learning projects, a strong system stack is often enough.' },
      { type: 'try', text: 'Build two versions of a heading: one with a system stack and one with a custom family plus Georgia as fallback. Compare load feel and appearance.' },
      { type: 'keypoints', items: ['System fonts are fast and reliable.', 'Web fonts load extra typefaces for branding and design control.', '@font-face maps a family name to font files.', 'Use fallbacks, fewer weights, and font-display for better performance.'] }
    ]
  },
  {
    slug: 'display-property',
    title: 'The display Property',
    description: 'Learn how display controls whether elements behave as block, inline, inline-block, none, flex, and more.',
    level: 'beginner',
    section: 'Layout Basics',
    order: 15,
    minutes: 10,
    content: [
      { type: 'p', text: 'The display property is one of the most important layout switches in CSS. It changes how a box participates in the page flow and what layout features are available inside it.' },
      { type: 'h2', text: 'block and inline' },
      {
        type: 'code',
        title: 'Default mental model',
        language: 'css',
        code: `div, p, h1, section {
  display: block; /* usually the default for these */
}

span, a, strong {
  display: inline; /* usually the default for these */
}`
      },
      { type: 'ul', items: ['Block boxes start on a new line and can take width and height.', 'Inline boxes sit in a text line and largely ignore width/height.', 'Margins and padding on inline boxes behave differently on the vertical axis.'] },
      { type: 'h2', text: 'inline-block' },
      { type: 'p', text: 'inline-block sits in a line like inline content, but accepts width, height, and vertical margin more like a block. It is useful for nav items and compact chips.' },
      {
        type: 'code',
        title: 'inline-block buttons in a row',
        language: 'css',
        code: `.chip {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  margin: 0.25rem;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
}`
      },
      { type: 'h2', text: 'display: none vs visibility' },
      {
        type: 'table',
        headers: ['Declaration', 'Result'],
        rows: [
          ['display: none', 'Removed from layout; takes no space'],
          ['visibility: hidden', 'Invisible but still occupies space'],
          ['opacity: 0', 'Invisible, still in layout, and can still receive some events']
        ]
      },
      {
        type: 'code',
        title: 'Hiding an element',
        language: 'css',
        code: `.is-hidden {
  display: none;
}`
      },
      { type: 'h2', text: 'Layout display values' },
      {
        type: 'code',
        title: 'Flex and grid as display values',
        language: 'css',
        code: `.row {
  display: flex;
}

.gallery {
  display: grid;
}`
      },
      { type: 'p', text: 'Setting display: flex turns an element into a flex container. Its children become flex items. The next lessons focus on that model.' },
      { type: 'tip', text: 'If width or margin: auto seems ignored, check whether the element is still display: inline.' },
      { type: 'try', text: 'Turn a span into inline-block, give it width and padding, and place two of them side by side. Then set one to display: none and observe the layout change.' },
      { type: 'keypoints', items: ['display controls box behavior in layout.', 'block, inline, and inline-block are core beginner values.', 'display: none removes an element from layout.', 'flex and grid are display values that unlock stronger layout systems.'] }
    ]
  },
  {
    slug: 'position-basics',
    title: 'Position Basics',
    description: 'Learn static, relative, absolute, fixed, and sticky positioning, plus top/right/bottom/left offsets.',
    level: 'beginner',
    section: 'Layout Basics',
    order: 16,
    minutes: 11,
    content: [
      { type: 'p', text: 'The position property changes how an element is placed relative to normal document flow. Most elements use static positioning. The other values unlock overlays, badges, sticky headers, and more.' },
      { type: 'h2', text: 'static (default)' },
      { type: 'p', text: 'In static positioning, top, right, bottom, and left have no effect. The element stays in normal flow.' },
      { type: 'h2', text: 'relative' },
      { type: 'p', text: 'relative keeps the element in normal flow, but lets you nudge it with offsets. Importantly, it also becomes a positioning context for absolute children.' },
      {
        type: 'code',
        title: 'Relative nudge',
        language: 'css',
        code: `.badge-host {
  position: relative;
}

.icon {
  position: relative;
  top: 2px;
}`
      },
      { type: 'h2', text: 'absolute' },
      { type: 'p', text: 'absolute removes the element from normal flow and places it relative to the nearest positioned ancestor (not static). If none exists, it uses the page.' },
      {
        type: 'code',
        title: 'Corner badge',
        language: 'html',
        code: `<div class="card">
  <span class="badge">New</span>
  <h2>Weekend workshop</h2>
</div>`
      },
      {
        type: 'code',
        title: 'Absolute badge styles',
        language: 'css',
        code: `.card {
  position: relative;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
}

.badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #0f766e;
  color: white;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
}`
      },
      { type: 'h2', text: 'fixed and sticky' },
      {
        type: 'table',
        headers: ['Value', 'Behavior'],
        rows: [
          ['fixed', 'Positioned relative to the viewport; stays put while scrolling'],
          ['sticky', 'Acts like relative until a scroll threshold, then sticks']
        ]
      },
      {
        type: 'code',
        title: 'Sticky header sketch',
        language: 'css',
        code: `.site-header {
  position: sticky;
  top: 0;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}`
      },
      { type: 'warning', text: 'Overusing absolute and fixed positioning can make responsive layouts fragile. Prefer normal flow and flexbox for page structure; use positioning for overlays and small accents.' },
      { type: 'try', text: 'Build a relative card with an absolute "Sale" badge in the top-left corner. Then make a sticky bar with top: 0.' },
      { type: 'keypoints', items: ['static is normal flow and ignores offsets.', 'relative nudges an element and creates a containing block.', 'absolute positions against the nearest positioned ancestor.', 'fixed and sticky are useful for viewport-related UI like headers.'] }
    ]
  },
  {
    slug: 'flexbox-intro',
    title: 'Flexbox Intro',
    description: 'Learn what flexbox is, how to create a flex container, and how children become flex items.',
    level: 'beginner',
    section: 'Layout Basics',
    order: 17,
    minutes: 10,
    content: [
      { type: 'p', text: 'Flexbox is a one-dimensional layout system. It excels at aligning items in a row or a column, distributing space, and building navigation bars, toolbars, and card rows.' },
      { type: 'h2', text: 'Create a flex container' },
      { type: 'p', text: 'Set display: flex on a parent. That parent becomes a flex container. Its direct children become flex items.' },
      {
        type: 'code',
        title: 'HTML structure',
        language: 'html',
        code: `<nav class="nav">
  <a href="/">Home</a>
  <a href="/courses">Courses</a>
  <a href="/about">About</a>
</nav>`
      },
      {
        type: 'code',
        title: 'Flex container',
        language: 'css',
        code: `.nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #0f172a;
}

.nav a {
  color: #f8fafc;
  text-decoration: none;
}`
      },
      { type: 'h2', text: 'Main axis and cross axis' },
      { type: 'p', text: 'Flexbox has two axes. By default, the main axis runs horizontally (left to right) and the cross axis runs vertically. Many flex properties align items along one of these axes.' },
      {
        type: 'table',
        headers: ['Idea', 'Default row direction'],
        rows: [
          ['Main axis', 'Horizontal'],
          ['Cross axis', 'Vertical'],
          ['Main start', 'Left'],
          ['Cross start', 'Top']
        ]
      },
      { type: 'h2', text: 'Why flexbox feels easier' },
      { type: 'ul', items: ['Vertical centering becomes simple.', 'Equal-height items in a row are natural.', 'Spacing can use gap instead of margin hacks.', 'Items can grow or shrink to fill space.'] },
      {
        type: 'code',
        title: 'Center content in a panel',
        language: 'css',
        code: `.panel {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 12rem;
  border: 1px solid #cbd5e1;
}`
      },
      { type: 'note', text: 'Flexbox is one-dimensional: row or column. CSS Grid is better when you need full two-dimensional page grids. Beginners can build a lot with flex alone.' },
      { type: 'try', text: 'Create a nav with four links. Use display: flex and gap to space them. Then add a second row of three cards with display: flex on a wrapper.' },
      { type: 'keypoints', items: ['display: flex creates a flex container.', 'Direct children become flex items.', 'Flexbox is one-dimensional: row or column.', 'Flex is ideal for alignment, navbars, and simple item groups.'] }
    ]
  },
  {
    slug: 'flex-direction-wrap',
    title: 'flex-direction and wrap',
    description: 'Learn how flex-direction and flex-wrap control the direction of the main axis and whether items wrap to new lines.',
    level: 'beginner',
    section: 'Layout Basics',
    order: 18,
    minutes: 10,
    content: [
      { type: 'p', text: 'By default, flex items sit in a single row and do not wrap. flex-direction and flex-wrap let you switch to columns and allow items to flow onto multiple lines.' },
      { type: 'h2', text: 'flex-direction' },
      {
        type: 'code',
        title: 'Row and column',
        language: 'css',
        code: `.row {
  display: flex;
  flex-direction: row; /* default */
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}`
      },
      {
        type: 'table',
        headers: ['Value', 'Main axis'],
        rows: [
          ['row', 'Left to right'],
          ['row-reverse', 'Right to left'],
          ['column', 'Top to bottom'],
          ['column-reverse', 'Bottom to top']
        ]
      },
      { type: 'h2', text: 'flex-wrap' },
      { type: 'p', text: 'With nowrap (default), items stay on one line and may shrink or overflow. With wrap, items move to the next line when there is not enough space.' },
      {
        type: 'code',
        title: 'Wrapping card row',
        language: 'css',
        code: `.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 220px; /* grow, shrink, basis */
  padding: 1rem;
  border: 1px solid #e2e8f0;
}`
      },
      { type: 'h2', text: 'flex-flow shorthand' },
      {
        type: 'code',
        title: 'direction + wrap together',
        language: 'css',
        code: `.toolbar {
  display: flex;
  flex-flow: row wrap;
  gap: 0.5rem;
}`
      },
      { type: 'h2', text: 'A responsive pattern without media queries' },
      { type: 'p', text: 'A flex basis around a minimum comfortable width, plus wrap and grow, creates a simple responsive card grid. Cards sit in a row when space allows and stack as the viewport shrinks.' },
      {
        type: 'code',
        title: 'HTML for wrapping cards',
        language: 'html',
        code: `<div class="cards">
  <article class="card">One</article>
  <article class="card">Two</article>
  <article class="card">Three</article>
</div>`
      },
      { type: 'tip', text: 'When switching to flex-direction: column, remember that justify-content and align-items swap which axis they affect relative to a row layout.' },
      { type: 'try', text: 'Build a .stack column for a form (label/input pairs) and a .cards row with flex-wrap for three feature cards.' },
      { type: 'keypoints', items: ['flex-direction sets row or column orientation.', 'flex-wrap allows items to move onto new lines.', 'flex-flow combines direction and wrap.', 'wrap + flexible basis is a simple responsive pattern.'] }
    ]
  },
  {
    slug: 'justify-align',
    title: 'Justify and Align',
    description: 'Learn justify-content, align-items, and align-self to distribute and align flex items on the main and cross axes.',
    level: 'beginner',
    section: 'Layout Basics',
    order: 19,
    minutes: 11,
    content: [
      { type: 'p', text: 'Once you have a flex container, alignment properties control where items sit and how free space is distributed. These properties are the heart of practical flexbox.' },
      { type: 'h2', text: 'justify-content (main axis)' },
      {
        type: 'code',
        title: 'Main-axis distribution',
        language: 'css',
        code: `.nav {
  display: flex;
  justify-content: space-between;
}

.center-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
}`
      },
      {
        type: 'table',
        headers: ['justify-content', 'Effect'],
        rows: [
          ['flex-start', 'Items pack toward the start'],
          ['flex-end', 'Items pack toward the end'],
          ['center', 'Items pack in the center'],
          ['space-between', 'First at start, last at end, space between'],
          ['space-around', 'Equal space around items'],
          ['space-evenly', 'Equal space between and at edges']
        ]
      },
      { type: 'h2', text: 'align-items (cross axis)' },
      {
        type: 'code',
        title: 'Cross-axis alignment',
        language: 'css',
        code: `.media {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stretch-row {
  display: flex;
  align-items: stretch; /* default */
}`
      },
      { type: 'p', text: 'align-items: center is the classic way to vertically center items in a horizontal flex row.' },
      { type: 'h2', text: 'align-self for one item' },
      {
        type: 'code',
        title: 'Override alignment on one child',
        language: 'css',
        code: `.row {
  display: flex;
  align-items: center;
}

.row .top {
  align-self: flex-start;
}`
      },
      { type: 'h2', text: 'A navbar pattern' },
      {
        type: 'code',
        title: 'Logo left, links right',
        language: 'html',
        code: `<header class="header">
  <div class="logo">Intellex</div>
  <nav class="links">
    <a href="/learn">Learn</a>
    <a href="/pricing">Pricing</a>
  </nav>
</header>`
      },
      {
        type: 'code',
        title: 'Header flex styles',
        language: 'css',
        code: `.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
}

.links {
  display: flex;
  gap: 1rem;
}`
      },
      { type: 'note', text: 'If justify-content seems to do nothing, the container may not have extra free space on the main axis. Give the container a wider width or min-height and try again.' },
      { type: 'try', text: 'Build a header with space-between and centered items. Then create a testimonial row with align-items: flex-start so cards of different heights align to the top.' },
      { type: 'keypoints', items: ['justify-content distributes items on the main axis.', 'align-items aligns items on the cross axis.', 'align-self overrides alignment for one item.', 'Navbar and media-object layouts are common flex alignment patterns.'] }
    ]
  },
  {
    slug: 'gap-flex',
    title: 'Gap in Flex Layouts',
    description: 'Learn how the gap property spaces flex items cleanly without margin tricks.',
    level: 'beginner',
    section: 'Layout Basics',
    order: 20,
    minutes: 9,
    content: [
      { type: 'p', text: 'gap sets the space between flex items (and grid items). It is clearer than adding margins to every child and then removing margin from the last item.' },
      { type: 'h2', text: 'Basic gap' },
      {
        type: 'code',
        title: 'Uniform spacing',
        language: 'css',
        code: `.row {
  display: flex;
  gap: 1rem;
}`
      },
      { type: 'h2', text: 'Row and column gaps' },
      { type: 'p', text: 'You can set one value for both directions, or two values: row-gap then column-gap.' },
      {
        type: 'code',
        title: 'Two-value gap',
        language: 'css',
        code: `.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem 1rem; /* row column */
}`
      },
      { type: 'h2', text: 'gap vs margin' },
      {
        type: 'table',
        headers: ['Approach', 'Pros', 'Cons'],
        rows: [
          ['gap', 'Space only between items; clean wrapping', 'Needs a flex/grid container'],
          ['margin on children', 'Works in older patterns', 'Easy to get uneven outer spacing'],
          ['padding on container', 'Insets the whole group', 'Does not separate items from each other']
        ]
      },
      {
        type: 'code',
        title: 'Before: margin trick',
        language: 'css',
        code: `/* older pattern */
.nav a {
  margin-right: 1rem;
}

.nav a:last-child {
  margin-right: 0;
}`
      },
      {
        type: 'code',
        title: 'After: gap',
        language: 'css',
        code: `.nav {
  display: flex;
  gap: 1rem;
}`
      },
      { type: 'h2', text: 'Gap with wrapping layouts' },
      { type: 'p', text: 'When items wrap, gap applies between rows as well as columns. That keeps a card grid even without special nth-child margin rules.' },
      {
        type: 'code',
        title: 'Wrapped chips',
        language: 'html',
        code: `<div class="chips">
  <span class="chip">CSS</span>
  <span class="chip">Flexbox</span>
  <span class="chip">Typography</span>
  <span class="chip">Box model</span>
</div>`
      },
      {
        type: 'code',
        title: 'Chip group styles',
        language: 'css',
        code: `.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  padding: 0.35rem 0.7rem;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
}`
      },
      { type: 'tip', text: 'Use padding for space inside a component and gap for space between sibling items in a flex container.' },
      { type: 'try', text: 'Replace child margins in a flex nav with gap. Then build a wrapping chip list and adjust row/column gap separately.' },
      { type: 'keypoints', items: ['gap spaces items inside flex and grid containers.', 'One or two values control row and column gaps.', 'gap avoids last-child margin hacks.', 'gap works cleanly with flex-wrap.'] }
    ]
  },
  {
    slug: 'backgrounds',
    title: 'Backgrounds',
    description: 'Learn background-color, background-image, size, position, and practical layering basics for surfaces and heroes.',
    level: 'beginner',
    section: 'Practice',
    order: 21,
    minutes: 10,
    content: [
      { type: 'p', text: 'Backgrounds set the surface behind content. Start with solid colors, then learn images, gradients, and how size and position control the result.' },
      { type: 'h2', text: 'background-color' },
      {
        type: 'code',
        title: 'Solid surfaces',
        language: 'css',
        code: `body {
  background-color: #f8fafc;
}

.card {
  background-color: #ffffff;
}`
      },
      { type: 'h2', text: 'background-image and gradients' },
      {
        type: 'code',
        title: 'Image and gradient',
        language: 'css',
        code: `.hero {
  background-image: url("/images/studio.jpg");
  background-size: cover;
  background-position: center;
}

.band {
  background-image: linear-gradient(160deg, #0f766e, #115e59);
  color: white;
}`
      },
      { type: 'h2', text: 'Size, position, and repeat' },
      {
        type: 'table',
        headers: ['Property', 'Common values'],
        rows: [
          ['background-size', 'cover, contain, 100% 100%'],
          ['background-position', 'center, top, 20% 40%'],
          ['background-repeat', 'no-repeat, repeat, repeat-x'],
          ['background-attachment', 'scroll, fixed']
        ]
      },
      {
        type: 'code',
        title: 'Covered photo panel',
        language: 'css',
        code: `.photo-panel {
  min-height: 20rem;
  background-image: url("/images/desk.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}`
      },
      { type: 'h2', text: 'Shorthand' },
      {
        type: 'code',
        title: 'background shorthand',
        language: 'css',
        code: `.hero {
  background: #0f172a url("/images/grain.png") center / cover no-repeat;
}`
      },
      { type: 'h2', text: 'Readable text on images' },
      { type: 'p', text: 'Text on busy photos needs help. A common approach is a darker gradient overlay or a semi-opaque panel behind the text.' },
      {
        type: 'code',
        title: 'Overlay using layered backgrounds',
        language: 'css',
        code: `.hero {
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)),
    url("/images/studio.jpg");
  background-size: cover;
  background-position: center;
  color: #f8fafc;
}`
      },
      { type: 'warning', text: 'Background images are decorative. Important meaning should live in HTML text (or an img with alt text), not only in a CSS background.' },
      { type: 'try', text: 'Create a hero section with a gradient overlay on a background image, white text, and min-height: 50vh. Ensure the heading stays readable.' },
      { type: 'keypoints', items: ['background-color sets solid surfaces.', 'background-image can use photos or gradients.', 'cover and center are common for hero photos.', 'Layer a gradient over images to protect text contrast.'] }
    ]
  },
  {
    slug: 'pseudo-classes',
    title: 'Pseudo-classes (:hover, :focus)',
    description: 'Learn interactive pseudo-classes such as :hover, :focus, and :active to style user interaction states.',
    level: 'beginner',
    section: 'Practice',
    order: 22,
    minutes: 10,
    content: [
      { type: 'p', text: 'Pseudo-classes style elements in a special state. :hover and :focus are the most important beginner interactive states for links, buttons, and form fields.' },
      { type: 'h2', text: ':hover' },
      {
        type: 'code',
        title: 'Hover styles',
        language: 'css',
        code: `.button {
  background: #0f766e;
  color: white;
  padding: 0.75rem 1.25rem;
  border: none;
}

.button:hover {
  background: #115e59;
}`
      },
      { type: 'h2', text: ':focus and :focus-visible' },
      { type: 'p', text: ':focus applies when an element receives keyboard or pointer focus. :focus-visible is especially useful for showing a focus ring mainly for keyboard users.' },
      {
        type: 'code',
        title: 'Accessible focus style',
        language: 'css',
        code: `.button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 3px;
}

input:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
}`
      },
      { type: 'h2', text: ':active and link states' },
      {
        type: 'code',
        title: 'Link pseudo-classes',
        language: 'css',
        code: `a:link {
  color: #0f766e;
}

a:visited {
  color: #0f766e;
}

a:hover {
  text-decoration: underline;
}

a:active {
  color: #115e59;
}`
      },
      {
        type: 'table',
        headers: ['Pseudo-class', 'When it applies'],
        rows: [
          [':hover', 'Pointer is over the element'],
          [':focus', 'Element has focus'],
          [':focus-visible', 'Focus should be visibly indicated'],
          [':active', 'Element is being activated (e.g. mouse down)'],
          [':visited', 'Link has been visited']
        ]
      },
      { type: 'h2', text: 'Combine with classes' },
      {
        type: 'code',
        title: 'Stateful class selector',
        language: 'css',
        code: `.card:hover {
  border-color: #0f766e;
}

.nav a:focus-visible {
  outline: 2px solid white;
  outline-offset: 2px;
}`
      },
      { type: 'warning', text: 'Do not rely on hover alone for important information. Touch devices may have little or no hover, and keyboard users need focus styles.' },
      { type: 'try', text: 'Style a button with distinct default, :hover, :active, and :focus-visible states. Tab to the button to test the focus ring.' },
      { type: 'keypoints', items: [':hover styles the pointer-over state.', ':focus and :focus-visible support keyboard accessibility.', ':active is the pressed state.', 'Interactive components should have clear default and focus styles.'] }
    ]
  },
  {
    slug: 'pseudo-elements',
    title: 'Pseudo-elements',
    description: 'Learn ::before, ::after, and other pseudo-elements for decorative content and text fragments.',
    level: 'beginner',
    section: 'Practice',
    order: 23,
    minutes: 10,
    content: [
      { type: 'p', text: 'Pseudo-elements let you style a part of an element or insert decorative content without extra HTML. The most common are ::before and ::after.' },
      { type: 'h2', text: '::before and ::after' },
      { type: 'p', text: 'These create virtual children inside an element. They need a content property, even if content is an empty string.' },
      {
        type: 'code',
        title: 'Decorative label marker',
        language: 'css',
        code: `.note::before {
  content: "Note: ";
  font-weight: 700;
  color: #0f766e;
}`
      },
      {
        type: 'code',
        title: 'Empty decorative bar',
        language: 'css',
        code: `.section-title::after {
  content: "";
  display: block;
  width: 3rem;
  height: 3px;
  margin-top: 0.5rem;
  background: #0f766e;
}`
      },
      { type: 'h2', text: 'Required pieces' },
      { type: 'ul', items: ['content is required for ::before and ::after.', 'By default they are inline; set display if you need a block bar or sized box.', 'They are great for icons, markers, and flourishes that are not real page content.'] },
      { type: 'h2', text: 'Other useful pseudo-elements' },
      {
        type: 'table',
        headers: ['Pseudo-element', 'Targets'],
        rows: [
          ['::placeholder', 'Placeholder text in inputs'],
          ['::selection', 'Highlighted text selection'],
          ['::first-line', 'First line of a block of text'],
          ['::first-letter', 'First letter of a block of text']
        ]
      },
      {
        type: 'code',
        title: 'Placeholder and selection',
        language: 'css',
        code: `input::placeholder {
  color: #94a3b8;
}

::selection {
  background: #99f6e4;
  color: #042f2e;
}`
      },
      { type: 'h2', text: 'A quote flourish' },
      {
        type: 'code',
        title: 'HTML',
        language: 'html',
        code: `<blockquote class="quote">
  Design is how it works.
</blockquote>`
      },
      {
        type: 'code',
        title: 'CSS',
        language: 'css',
        code: `.quote {
  position: relative;
  padding-left: 1.5rem;
  font-size: 1.25rem;
}

.quote::before {
  content: "“";
  position: absolute;
  left: 0;
  top: -0.2em;
  font-size: 2rem;
  color: #0f766e;
}`
      },
      { type: 'note', text: 'Use real HTML for meaningful content. Pseudo-element text may be ignored by some assistive technologies, so do not hide important words only in content:.' },
      { type: 'try', text: 'Add a ::before marker to a .tip class and an ::after underline bar to a section heading.' },
      { type: 'keypoints', items: ['::before and ::after create decorative virtual children.', 'content is required, and may be "".', '::placeholder and ::selection are useful text-related pseudo-elements.', 'Keep meaningful content in HTML, not only in CSS content.'] }
    ]
  },
  {
    slug: 'mini-card-layout',
    title: 'Mini Project: Card Layout',
    description: 'Build a small responsive card layout that practices the box model, typography, flexbox, and hover states.',
    level: 'beginner',
    section: 'Practice',
    order: 24,
    minutes: 14,
    content: [
      { type: 'p', text: 'This mini project combines beginner CSS into one practical UI: a page title and a responsive row of cards. You will use external CSS, the box model, typography, flexbox, gap, and a hover state.' },
      { type: 'h2', text: 'Project goal' },
      { type: 'ul', items: ['Center a content container with max-width.', 'Display three cards in a wrapping flex row.', 'Style typography and spacing consistently.', 'Add a subtle hover border or lift on each card.'] },
      { type: 'h2', text: 'HTML scaffold' },
      {
        type: 'code',
        title: 'index.html',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Course Cards</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main class="container">
    <header class="page-header">
      <p class="eyebrow">Intellex</p>
      <h1>Beginner CSS tracks</h1>
      <p class="lede">Short paths that teach layout one clear idea at a time.</p>
    </header>

    <section class="cards" aria-label="Course cards">
      <article class="card">
        <h2>Selectors</h2>
        <p>Target the right elements with classes and clear structure.</p>
        <a class="text-link" href="#">Start lesson</a>
      </article>
      <article class="card">
        <h2>Box model</h2>
        <p>Control padding, border, and margin without layout surprises.</p>
        <a class="text-link" href="#">Start lesson</a>
      </article>
      <article class="card">
        <h2>Flexbox</h2>
        <p>Align navbars and card rows with direction, gap, and wrap.</p>
        <a class="text-link" href="#">Start lesson</a>
      </article>
    </section>
  </main>
</body>
</html>`
      },
      { type: 'h2', text: 'CSS foundation' },
      {
        type: 'code',
        title: 'styles.css',
        language: 'css',
        code: `*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  background: #f1f5f9;
  color: #0f172a;
  line-height: 1.6;
}

.container {
  width: 92%;
  max-width: 960px;
  margin: 0 auto;
  padding: 2.5rem 0 4rem;
}

.page-header {
  margin-bottom: 2rem;
}

.eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f766e;
  font-weight: 700;
}

.page-header h1 {
  margin: 0 0 0.5rem;
  font-size: 2.25rem;
  line-height: 1.15;
}

.lede {
  margin: 0;
  max-width: 36rem;
  color: #475569;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 220px;
  padding: 1.25rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
}

.card h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}

.card p {
  margin: 0 0 1rem;
  color: #475569;
}

.text-link {
  color: #0f766e;
  font-weight: 600;
  text-decoration: none;
}

.text-link:hover {
  text-decoration: underline;
}

.card:hover {
  border-color: #0f766e;
}`
      },
      { type: 'h2', text: 'What to notice' },
      { type: 'ol', items: ['border-box keeps padded cards predictable.', 'max-width + width + auto margins center the page.', 'flex-wrap + flex basis create a simple responsive grid.', 'gap spaces cards without margin hacks.', 'Hover styles give feedback without changing layout drastically.'] },
      { type: 'tip', text: 'Stretch goal: add a sticky header or a ::before accent bar on each card title using what you learned earlier.' },
      { type: 'try', text: 'Build the project in two files. Resize the browser until the cards wrap. Then change the card flex-basis from 220px to 300px and observe the wrapping point.' },
      { type: 'keypoints', items: ['A small project should reuse selectors, box model, typography, and flex.', 'External CSS keeps structure and presentation separate.', 'Wrapping flex cards are a practical beginner layout pattern.', 'Hover and link states finish the interactive polish.'] }
    ]
  },
  {
    slug: 'beginner-review',
    title: 'Beginner Review',
    description: 'Review the core beginner CSS ideas: cascade, box model, typography, display, positioning, and flexbox.',
    level: 'beginner',
    section: 'Practice',
    order: 25,
    minutes: 12,
    content: [
      { type: 'p', text: 'You have covered the foundations of CSS: attaching styles, selecting elements, sizing boxes, styling text, and building simple layouts with flexbox. This lesson reviews the ideas you should be able to explain and use.' },
      { type: 'h2', text: 'Getting started checklist' },
      { type: 'ul', items: ['CSS styles HTML presentation.', 'Prefer external stylesheets for real projects.', 'Classes are the main tool for reusable styling.', 'Colors and units (especially rem) show up in almost every rule.', 'Specificity and source order explain many "why did this not apply?" bugs.'] },
      { type: 'h2', text: 'Box model checklist' },
      {
        type: 'table',
        headers: ['Topic', 'Remember'],
        rows: [
          ['Box model', 'content + padding + border + margin'],
          ['Padding vs margin', 'inside vs outside the border'],
          ['Borders', 'width, style, color, radius'],
          ['Sizing', 'width, max-width, min-height'],
          ['box-sizing', 'border-box includes padding and border in width']
        ]
      },
      { type: 'h2', text: 'Typography checklist' },
      {
        type: 'code',
        title: 'A compact type starter',
        language: 'css',
        code: `body {
  font-family: Georgia, serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #0f172a;
}

h1 {
  font-size: 2.25rem;
  line-height: 1.2;
  margin-bottom: 0.75rem;
}

a {
  color: #0f766e;
  text-decoration-thickness: 2px;
  text-underline-offset: 0.15em;
}`
      },
      { type: 'h2', text: 'Layout checklist' },
      { type: 'ul', items: ['display switches block, inline, none, flex, and more.', 'position handles overlays, badges, fixed and sticky UI.', 'flexbox aligns items in a row or column.', 'flex-direction and flex-wrap control orientation and wrapping.', 'justify-content, align-items, and gap handle distribution and spacing.'] },
      {
        type: 'code',
        title: 'A layout recipe worth memorizing',
        language: 'css',
        code: `.container {
  width: 92%;
  max-width: 960px;
  margin-inline: auto;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: stretch;
}

.card {
  flex: 1 1 220px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #fff;
}`
      },
      { type: 'h2', text: 'Practice skills' },
      { type: 'ol', items: ['Backgrounds and overlays for surfaces and heroes', 'Pseudo-classes for hover and focus', 'Pseudo-elements for decorative markers', 'A mini card layout that combines the pieces'] },
      { type: 'h2', text: 'Quick self-test' },
      { type: 'ol', items: ['What is the difference between padding and margin?', 'Why do many projects set box-sizing: border-box globally?', 'Which is usually better for reusable styles: an ID or a class?', 'In a flex row, which property centers items vertically?', 'How do you space flex items without margins on each child?'] },
      {
        type: 'code',
        title: 'Self-test answers (check after you try)',
        language: 'css',
        code: `/* 1) padding = inside border, margin = outside
   2) width becomes more predictable with padding/border
   3) class
   4) align-items: center
   5) gap */`
      },
      { type: 'note', text: 'If any answer felt fuzzy, revisit that lesson and rebuild one tiny example from scratch. CSS sticks best through short, repeated practice.' },
      { type: 'try', text: 'Without looking back, recreate a centered container with three wrapping cards, a heading stack, and a :focus-visible style on links. Then compare with your mini project.' },
      { type: 'keypoints', items: ['Beginner CSS centers on selectors, cascade, and the box model.', 'Typography and spacing make pages readable.', 'Flexbox is the main beginner layout tool for rows and columns.', 'Interactive states and small projects prove the skills work together.'] }
    ]
  }
];
