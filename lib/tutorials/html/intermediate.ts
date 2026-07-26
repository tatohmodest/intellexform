import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'audio-video',
    title: 'Audio and Video',
    description:
      'Embed audio and video with native HTML controls, multiple sources, captions, and practical playback attributes.',
    level: 'intermediate',
    section: 'Media & Embeds',
    order: 26,
    minutes: 14,
    content: [
      { type: 'p', text: 'HTML gives you built-in media elements for sound and video. You can play files, offer multiple formats, show controls, and add captions without a third-party player for many simple cases.' },
      { type: 'p', text: 'In this lesson you will learn the audio and video elements, common attributes, source fallbacks, and how to keep media accessible and usable.' },
      { type: 'h2', text: 'Basic video markup' },
      {
        type: 'code',
        language: 'html',
        title: 'video with controls',
        code: `<video controls width="640" poster="poster.jpg">
  <source src="demo.mp4" type="video/mp4" />
  <source src="demo.webm" type="video/webm" />
  <track kind="captions" src="demo-en.vtt" srclang="en" label="English" default />
  <p>
    Your browser does not support HTML video.
    <a href="demo.mp4">Download the MP4</a> instead.
  </p>
</video>`,
      },
      {
        type: 'ul',
        items: [
          'controls shows play, pause, volume, and fullscreen UI.',
          'poster is the image shown before playback starts.',
          'Multiple source elements let the browser pick a supported format.',
          'track can provide captions or subtitles from a WebVTT file.',
        ],
      },
      { type: 'h2', text: 'Audio element' },
      {
        type: 'code',
        language: 'html',
        title: 'audio with sources',
        code: `<audio controls preload="metadata">
  <source src="lesson.mp3" type="audio/mpeg" />
  <source src="lesson.ogg" type="audio/ogg" />
  Download the
  <a href="lesson.mp3">MP3 audio file</a>.
</audio>`,
      },
      { type: 'h2', text: 'Useful media attributes' },
      {
        type: 'table',
        headers: ['Attribute', 'Purpose'],
        rows: [
          ['controls', 'Shows the native playback UI'],
          ['autoplay', 'Starts playback automatically (often blocked unless muted)'],
          ['muted', 'Starts with sound off; needed for many autoplay cases'],
          ['loop', 'Restarts when the media ends'],
          ['preload', 'Hints how much to load: none, metadata, or auto'],
          ['playsinline', 'Helps mobile browsers play video in place'],
        ],
      },
      { type: 'warning', text: 'Autoplaying sound is disruptive and often blocked. Prefer muted autoplay for decorative video backgrounds, or let users start playback themselves.' },
      { type: 'h2', text: 'Captions and accessibility' },
      { type: 'p', text: 'Captions help people who are deaf or hard of hearing, and they also help in quiet or noisy environments. Use a track element with kind="captions" and a .vtt file. Provide a clear download fallback inside the media element for older browsers.' },
      { type: 'tip', text: 'Keep media files reasonably sized. Offer compressed formats and avoid forcing a full download when preload="none" or preload="metadata" is enough.' },
      { type: 'try', text: 'Add a video element with two sources, a poster image, English captions, and a download link fallback. Then add an audio element for a short podcast clip with controls.' },
      {
        type: 'keypoints',
        items: [
          'Use video and audio for native media playback.',
          'Provide multiple source formats when you need broader support.',
          'Add captions with track and WebVTT.',
          'Use controls by default and treat autoplay carefully.',
        ],
      },
    ],
  },
  {
    slug: 'iframe-embeds',
    title: 'iframes and Embeds',
    description:
      'Embed maps, videos, and other documents with iframe, and learn title, sandbox, and loading practices.',
    level: 'intermediate',
    section: 'Media & Embeds',
    order: 27,
    minutes: 13,
    content: [
      { type: 'p', text: 'An iframe embeds another HTML document inside your page. Maps, hosted videos, calendars, and design previews often arrive as iframe embeds from a provider.' },
      { type: 'p', text: 'Iframes are powerful, but they also introduce security, accessibility, and performance concerns. Intermediate HTML authors should know how to label embeds and limit what they can do.' },
      { type: 'h2', text: 'A basic iframe' },
      {
        type: 'code',
        language: 'html',
        title: 'Embedded map',
        code: `<iframe
  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.15%2C51.50%2C-0.10%2C51.52&layer=mapnik"
  title="Map of central London"
  width="600"
  height="400"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
></iframe>`,
      },
      { type: 'note', text: 'Always give iframes a meaningful title. Screen reader users hear that title when they encounter the frame.' },
      { type: 'h2', text: 'Sandbox and allow' },
      {
        type: 'code',
        language: 'html',
        title: 'Restricted embed',
        code: `<iframe
  src="/preview/widget.html"
  title="Product widget preview"
  width="480"
  height="320"
  sandbox="allow-scripts allow-same-origin"
  allow="fullscreen"
></iframe>`,
      },
      {
        type: 'ul',
        items: [
          'sandbox restricts scripts, forms, popups, and more by default.',
          'You opt back into capabilities with space-separated tokens.',
          'allow controls browser features such as fullscreen or camera when relevant.',
          'Prefer the least privilege your embed actually needs.',
        ],
      },
      { type: 'h2', text: 'When to use iframe vs native media' },
      {
        type: 'table',
        headers: ['Use', 'Prefer'],
        rows: [
          ['Self-hosted MP4 or WebM', 'video element'],
          ['YouTube or Vimeo player', 'provider iframe embed'],
          ['Interactive map from a host', 'iframe'],
          ['Simple image gallery', 'img or picture, not iframe'],
        ],
      },
      { type: 'warning', text: 'Do not embed untrusted pages without sandboxing. An iframe can bring third-party scripts, cookies, and UI that compete with your own page.' },
      { type: 'tip', text: 'Use loading="lazy" for below-the-fold embeds so the browser can prioritize your main content first.' },
      { type: 'try', text: 'Embed a public map or video iframe with a clear title, lazy loading, and a short paragraph nearby explaining what the embed shows.' },
      {
        type: 'keypoints',
        items: [
          'iframe embeds another document in your page.',
          'title is required for accessible framing.',
          'sandbox and allow limit embed power.',
          'Prefer native media elements when you host the files yourself.',
        ],
      },
    ],
  },
  {
    slug: 'picture-srcset',
    title: 'picture and srcset',
    description:
      'Serve responsive images with srcset, sizes, and the picture element for art direction and format choice.',
    level: 'intermediate',
    section: 'Media & Embeds',
    order: 28,
    minutes: 14,
    content: [
      { type: 'p', text: 'One image file rarely fits every screen. Large photos waste bandwidth on phones, and a desktop crop may need a different composition than a square mobile crop.' },
      { type: 'p', text: 'HTML solves this with srcset and sizes on img, and with the picture element when you need art direction or alternate formats such as WebP and AVIF.' },
      { type: 'h2', text: 'Resolution switching with srcset' },
      {
        type: 'code',
        language: 'html',
        title: 'Width descriptors',
        code: `<img
  src="hero-800.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 600px"
  alt="Team working at a long wooden desk"
  width="800"
  height="500"
/>`,
      },
      {
        type: 'ul',
        items: [
          'w descriptors tell the browser the intrinsic width of each file.',
          'sizes tells the browser how wide the image will display.',
          'The browser picks a source based on viewport, density, and layout.',
          'Keep a src fallback for older clients.',
        ],
      },
      { type: 'h2', text: 'Art direction with picture' },
      {
        type: 'code',
        language: 'html',
        title: 'Different crops and formats',
        code: `<picture>
  <source
    media="(max-width: 600px)"
    srcset="hero-mobile.avif"
    type="image/avif"
  />
  <source
    media="(max-width: 600px)"
    srcset="hero-mobile.webp"
    type="image/webp"
  />
  <source
    media="(max-width: 600px)"
    srcset="hero-mobile.jpg"
  />
  <source srcset="hero-desktop.avif" type="image/avif" />
  <source srcset="hero-desktop.webp" type="image/webp" />
  <img
    src="hero-desktop.jpg"
    alt="Sunset over the coastal trail"
    width="1200"
    height="675"
  />
</picture>`,
      },
      { type: 'note', text: 'picture selects the first matching source. The img inside picture is required and provides the alt text, dimensions, and final fallback.' },
      { type: 'h2', text: 'srcset vs picture' },
      {
        type: 'table',
        headers: ['Need', 'Tool'],
        rows: [
          ['Same image, different resolutions', 'img with srcset and sizes'],
          ['Different crop or layout by breakpoint', 'picture with media'],
          ['Modern formats with fallbacks', 'picture with type'],
          ['Decorative icon that never changes', 'plain img is enough'],
        ],
      },
      { type: 'tip', text: 'Always include width and height (or CSS aspect-ratio) so the browser can reserve space and reduce layout shift.' },
      { type: 'try', text: 'Create a product image that uses three widths in srcset. Then build a picture element that shows a tall crop on small screens and a wide crop on large screens.' },
      {
        type: 'keypoints',
        items: [
          'srcset and sizes help browsers choose image resolution.',
          'picture supports art direction and format negotiation.',
          'The nested img carries alt text and fallback.',
          'Reserve space with width and height attributes.',
        ],
      },
    ],
  },
  {
    slug: 'svg-inline',
    title: 'Inline SVG Basics',
    description:
      'Add scalable vector graphics directly in HTML for icons and simple illustrations that stay crisp on any screen.',
    level: 'intermediate',
    section: 'Media & Embeds',
    order: 29,
    minutes: 13,
    content: [
      { type: 'p', text: 'SVG is a vector image format. Unlike JPEG or PNG, it describes shapes with points and paths, so it stays sharp at any size. You can link SVG as an img source, or place SVG markup directly in HTML.' },
      { type: 'p', text: 'Inline SVG is useful for icons you want to style with CSS, animate lightly, or expose to assistive tech with titles and labels.' },
      { type: 'h2', text: 'A simple inline icon' },
      {
        type: 'code',
        language: 'html',
        title: 'Accessible checkmark SVG',
        code: `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  role="img"
  aria-labelledby="check-title"
>
  <title id="check-title">Completed</title>
  <path
    d="M4 12.5 9.5 18 20 6"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>`,
      },
      {
        type: 'ul',
        items: [
          'viewBox defines the internal coordinate system.',
          'width and height set the display size.',
          'currentColor lets the icon inherit text color from CSS.',
          'title plus aria-labelledby gives a short accessible name.',
        ],
      },
      { type: 'h2', text: 'Decorative vs meaningful icons' },
      {
        type: 'code',
        language: 'html',
        title: 'Decorative icon beside visible text',
        code: `<a href="/settings">
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" fill="currentColor" />
  </svg>
  Settings
</a>`,
      },
      { type: 'p', text: 'If nearby text already names the control, hide the SVG from assistive tech with aria-hidden="true". If the SVG is the only label, give it an accessible name.' },
      { type: 'h2', text: 'Inline SVG vs img' },
      {
        type: 'table',
        headers: ['Approach', 'Strength'],
        rows: [
          ['Inline SVG', 'Easy to style per state; good for small icons'],
          ['img src=".svg"', 'Simple caching and reuse as a file'],
          ['CSS background', 'Decorative only; weaker semantics'],
        ],
      },
      { type: 'tip', text: 'Keep inline SVGs small. Complex illustrations are often better as external files so your HTML stays readable.' },
      { type: 'warning', text: 'Do not paste untrusted SVG from the web without reviewing it. SVG can include scripts and external references.' },
      { type: 'try', text: 'Replace a PNG menu icon with an inline SVG that uses currentColor. Mark it decorative if the button already has a text label.' },
      {
        type: 'keypoints',
        items: [
          'SVG scales cleanly for icons and simple graphics.',
          'Inline SVG can inherit color and receive accessible names.',
          'Hide decorative icons; name meaningful ones.',
          'Prefer small, reviewed SVG markup in pages.',
        ],
      },
    ],
  },
  {
    slug: 'favicon-icons',
    title: 'Favicons and Icons',
    description:
      'Add favicons, touch icons, and theme-related icon links so browsers and devices show your site identity clearly.',
    level: 'intermediate',
    section: 'Media & Embeds',
    order: 30,
    minutes: 12,
    content: [
      { type: 'p', text: 'A favicon is the small icon shown in browser tabs, bookmarks, and some history lists. Modern sites also provide larger icons for home screens and app-like installs.' },
      { type: 'p', text: 'You declare these icons in the document head with link elements. A clear set of icons makes your site easier to recognize across devices.' },
      { type: 'h2', text: 'Essential icon links' },
      {
        type: 'code',
        language: 'html',
        title: 'head icon links',
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Northwind Notes</title>
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" href="/icon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#0f766e" />
  </head>
  <body>
    <h1>Northwind Notes</h1>
  </body>
</html>`,
      },
      {
        type: 'ul',
        items: [
          'favicon.ico remains a widely supported classic tab icon.',
          'SVG icons scale cleanly in browsers that support them.',
          'apple-touch-icon is used when saving to an iOS home screen.',
          'A web manifest can list icons for installed web apps.',
        ],
      },
      { type: 'h2', text: 'Practical icon sizes' },
      {
        type: 'table',
        headers: ['File', 'Typical use'],
        rows: [
          ['favicon.ico', 'Browser tabs and older clients'],
          ['icon.svg', 'Modern scalable favicon'],
          ['apple-touch-icon.png (180x180)', 'iOS home screen'],
          ['192 and 512 PNG in manifest', 'Android and installed web apps'],
        ],
      },
      { type: 'h2', text: 'Design tips' },
      {
        type: 'ol',
        items: [
          'Use a simple shape that stays readable at 16 pixels.',
          'Avoid tiny text inside the icon.',
          'Test the icon on both light and dark browser chrome.',
          'Keep the brand mark consistent with your logo system.',
        ],
      },
      { type: 'note', text: 'Browsers cache favicons aggressively. After replacing an icon, hard-refresh or temporarily change the filename while testing.' },
      { type: 'tip', text: 'Start with SVG plus a PNG touch icon. Add ico and manifest icons when you need broader device coverage.' },
      { type: 'try', text: 'Add favicon, SVG icon, and apple-touch-icon links to a sample page. Open the page in a browser and confirm the tab icon updates.' },
      {
        type: 'keypoints',
        items: [
          'Favicons help users recognize your site in tabs and bookmarks.',
          'Use link rel="icon" and related head links to declare icons.',
          'Provide simple artwork that works at very small sizes.',
          'Touch icons and manifests cover home-screen and install cases.',
        ],
      },
    ],
  },
  {
    slug: 'accessibility-intro',
    title: 'Accessibility Intro',
    description:
      'Learn why accessible HTML matters and the core ideas of perceivable, operable, understandable, and robust content.',
    level: 'intermediate',
    section: 'Accessible HTML',
    order: 31,
    minutes: 12,
    content: [
      { type: 'p', text: 'Accessibility means designing pages so more people can use them, including people who use screen readers, keyboards, voice control, screen magnification, or captions.' },
      { type: 'p', text: 'Good HTML is the foundation of accessibility. Semantics, labels, contrast-friendly structure, and keyboard reach often matter more than decorative ARIA.' },
      { type: 'h2', text: 'The POUR principles' },
      {
        type: 'ul',
        items: [
          'Perceivable: users can sense the content (text alternatives, captions, adaptable layout).',
          'Operable: users can control the interface (keyboard access, enough time, clear targets).',
          'Understandable: content and UI behave in predictable, readable ways.',
          'Robust: markup works with current and future browsers and assistive tech.',
        ],
      },
      { type: 'h2', text: 'Start with semantics' },
      {
        type: 'code',
        language: 'html',
        title: 'Meaningful structure beats empty divs',
        code: `<!-- Weaker -->
<div class="title">Contact us</div>
<div class="btn" onclick="send()">Send</div>

<!-- Stronger -->
<h1>Contact us</h1>
<button type="submit">Send</button>`,
      },
      { type: 'p', text: 'Native elements bring keyboard behavior, roles, and expectations for free. A real button is focusable and activatable with Enter or Space. A div is not, unless you rebuild that behavior carefully.' },
      { type: 'h2', text: 'Who benefits' },
      {
        type: 'table',
        headers: ['Situation', 'Helpful HTML practice'],
        rows: [
          ['Screen reader user', 'Headings, landmarks, labels, alt text'],
          ['Keyboard-only user', 'Focusable controls and logical tab order'],
          ['Low vision', 'Scalable text and clear structure'],
          ['Temporary injury', 'Large targets and keyboard support'],
          ['Noisy or quiet places', 'Captions and transcripts'],
        ],
      },
      { type: 'note', text: 'Accessibility is not a special mode. It is quality engineering that improves usability for everyone.' },
      { type: 'tip', text: 'Test with a keyboard early: Tab through the page, activate links and buttons, and confirm focus is always visible.' },
      { type: 'try', text: 'Take a small page of div-based buttons and headings. Rewrite it with button, a, h1-h3, and main. Tab through both versions and compare.' },
      {
        type: 'keypoints',
        items: [
          'Accessible HTML helps more people complete tasks.',
          'POUR is a practical checklist for content and UI.',
          'Prefer semantic elements before custom widgets.',
          'Keyboard testing catches many issues quickly.',
        ],
      },
    ],
  },
  {
    slug: 'alt-text',
    title: 'Meaningful Alt Text',
    description:
      'Write alternative text that communicates image purpose, and know when empty alt is the correct choice.',
    level: 'intermediate',
    section: 'Accessible HTML',
    order: 32,
    minutes: 12,
    content: [
      { type: 'p', text: 'The alt attribute provides a text replacement for an image. Screen readers announce it, and it appears if the image fails to load. Good alt text describes the purpose of the image in context, not every visual detail.' },
      { type: 'h2', text: 'Write for purpose' },
      {
        type: 'code',
        language: 'html',
        title: 'Same photo, different alt by context',
        code: `<!-- In a news article about the event -->
<img
  src="mayor-ribbon.jpg"
  alt="Mayor Chen cutting the ribbon at the library opening"
/>

<!-- In a staff directory where the name is already in text -->
<figure>
  <img src="mayor-ribbon.jpg" alt="" />
  <figcaption>Mayor Chen at the library opening</figcaption>
</figure>`,
      },
      { type: 'h2', text: 'When alt should be empty' },
      { type: 'p', text: 'Use alt="" for decorative images that add atmosphere but do not communicate unique information. Empty alt tells assistive tech to skip the image. Do not omit the attribute entirely on meaningful content images.' },
      {
        type: 'code',
        language: 'html',
        title: 'Decorative divider',
        code: `<img src="flourish.svg" alt="" />`,
      },
      { type: 'h2', text: 'Patterns that work' },
      {
        type: 'ul',
        items: [
          'Keep alt concise: usually a short phrase or one sentence.',
          'Avoid starting with "image of" or "picture of".',
          'For linked images, alt should describe the destination or action.',
          'For complex charts, summarize the trend in alt and provide a longer text description nearby.',
        ],
      },
      {
        type: 'table',
        headers: ['Image type', 'Alt approach'],
        rows: [
          ['Product photo in a catalog', 'Name the product and key distinguishing detail'],
          ['Icon button with no text', 'Name the action, such as Search or Close'],
          ['Decorative background', 'alt=""'],
          ['Captcha or puzzle image', 'Provide an accessible alternative challenge'],
        ],
      },
      { type: 'warning', text: 'Filename-based alt such as IMG_4032.jpg is not useful. Write human language that fits the surrounding content.' },
      { type: 'tip', text: 'If you remove the image and the sentence still makes sense, the image may be decorative. If meaning disappears, write alt that restores that meaning.' },
      { type: 'try', text: 'Write alt text for: a logo linking home, a chart of monthly sales, and a decorative hero texture. Explain why each choice differs.' },
      {
        type: 'keypoints',
        items: [
          'alt is a text replacement for image purpose.',
          'Context decides how detailed alt should be.',
          'Decorative images should use empty alt.',
          'Linked images need alt that describes the action or destination.',
        ],
      },
    ],
  },
  {
    slug: 'landmarks-aria',
    title: 'Landmarks and ARIA Basics',
    description:
      'Structure pages with landmark elements and use ARIA only when native HTML is not enough.',
    level: 'intermediate',
    section: 'Accessible HTML',
    order: 33,
    minutes: 14,
    content: [
      { type: 'p', text: 'Landmarks help assistive tech users jump to major page regions such as navigation, main content, and complementary sidebars. HTML landmark elements are the best first choice.' },
      { type: 'h2', text: 'Common landmark elements' },
      {
        type: 'code',
        language: 'html',
        title: 'Page landmarks',
        code: `<header>
  <p>Coastal Weekly</p>
  <nav aria-label="Primary">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/local">Local</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Harbor path reopens</h1>
    <p>The city restored the south trail this week.</p>
  </article>
</main>

<aside>
  <h2>Related</h2>
  <p><a href="/parks">Park updates</a></p>
</aside>

<footer>
  <p>Contact: tips@example.com</p>
</footer>`,
      },
      {
        type: 'ul',
        items: [
          'main should appear once per page for the primary content.',
          'nav marks navigation; label it when you have more than one.',
          'header and footer can appear at page or section scope.',
          'aside is for complementary content related to the main flow.',
        ],
      },
      { type: 'h2', text: 'ARIA when HTML is not enough' },
      { type: 'p', text: 'ARIA (Accessible Rich Internet Applications) can add roles, states, and properties. The first rule of ARIA is not to use ARIA if a native element already does the job.' },
      {
        type: 'code',
        language: 'html',
        title: 'Useful ARIA examples',
        code: `<button aria-expanded="false" aria-controls="filters">
  Filters
</button>
<div id="filters" hidden>
  <!-- filter fields -->
</div>

<nav aria-label="Footer">
  <a href="/privacy">Privacy</a>
</nav>

<span class="badge" aria-label="3 unread messages">3</span>`,
      },
      {
        type: 'table',
        headers: ['Prefer native', 'Avoid unnecessary ARIA'],
        rows: [
          ['button', 'div role="button"'],
          ['nav', 'div role="navigation" unless unavoidable'],
          ['h1-h6', 'styled text with role="heading" as a first choice'],
        ],
      },
      { type: 'warning', text: 'Incorrect ARIA can make a page worse. If you set a role, you must also support the keyboard and state behavior users expect for that role.' },
      { type: 'tip', text: 'Use aria-label or aria-labelledby to distinguish repeated landmarks, such as Primary and Footer navigation.' },
      { type: 'try', text: 'Rebuild a blog layout with header, nav, main, article, aside, and footer. Add aria-label to the primary nav and confirm there is only one main.' },
      {
        type: 'keypoints',
        items: [
          'Landmark elements map major page regions.',
          'One main landmark keeps primary content easy to find.',
          'ARIA supplements native HTML; it does not replace it.',
          'Label repeated navigation regions for clarity.',
        ],
      },
    ],
  },
  {
    slug: 'focus-keyboard',
    title: 'Focus and Keyboard Access',
    description:
      'Make interactive HTML usable with the keyboard through natural focus order, focusable controls, and skip links.',
    level: 'intermediate',
    section: 'Accessible HTML',
    order: 34,
    minutes: 13,
    content: [
      { type: 'p', text: 'Many people navigate with a keyboard instead of a mouse. Links, buttons, form fields, and custom widgets must be reachable and operable without a pointer.' },
      { type: 'p', text: 'HTML gives you a strong start: anchors with href, buttons, and form controls are focusable by default. Problems appear when pages use non-interactive elements for actions or remove focus styles.' },
      { type: 'h2', text: 'Natural focus order' },
      {
        type: 'code',
        language: 'html',
        title: 'Logical source order',
        code: `<header>
  <a class="skip-link" href="#main">Skip to content</a>
  <nav aria-label="Primary">
    <a href="/">Home</a>
    <a href="/courses">Courses</a>
    <a href="/account">Account</a>
  </nav>
</header>

<main id="main">
  <h1>Courses</h1>
  <p><a href="/courses/html">HTML path</a></p>
</main>`,
      },
      { type: 'p', text: 'Tab order follows DOM order for focusable elements. Keep the source order aligned with the visual reading order whenever you can. Avoid positive tabindex values that scramble the sequence.' },
      { type: 'h2', text: 'Focusable controls' },
      {
        type: 'table',
        headers: ['Element', 'Keyboard behavior'],
        rows: [
          ['a href', 'Tab to focus, Enter to activate'],
          ['button', 'Tab to focus, Enter or Space to activate'],
          ['input, select, textarea', 'Tab to focus, type or arrow as relevant'],
          ['div or span', 'Not keyboard accessible unless you rebuild it'],
        ],
      },
      {
        type: 'code',
        language: 'html',
        title: 'Skip link pattern',
        code: `<a class="skip-link" href="#main">Skip to content</a>
<!-- CSS can visually hide the link until it receives focus -->`,
      },
      { type: 'h2', text: 'tabindex guidance' },
      {
        type: 'ul',
        items: [
          'Omit tabindex on native interactive elements.',
          'Use tabindex="0" only when you must include a custom element in tab order.',
          'Use tabindex="-1" to make an element programmatically focusable but not in the tab sequence.',
          'Avoid tabindex greater than 0.',
        ],
      },
      { type: 'warning', text: 'Do not remove focus outlines unless you replace them with an equally visible custom focus style. Invisible focus traps keyboard users.' },
      { type: 'tip', text: 'After opening a dialog or moving content, manage focus intentionally: move it into the new content, then restore it when the dialog closes.' },
      { type: 'try', text: 'Add a skip link to a page with a long nav. Unplug the mouse and complete a path using only Tab, Shift+Tab, Enter, and Space.' },
      {
        type: 'keypoints',
        items: [
          'Keyboard users depend on focusable native controls.',
          'DOM order should match a sensible tab order.',
          'Skip links help bypass repeated navigation.',
          'Keep focus visible at all times.',
        ],
      },
    ],
  },
  {
    slug: 'forms-a11y',
    title: 'Accessible Forms',
    description:
      'Label controls clearly, associate errors with fields, and group related inputs so forms work with assistive tech.',
    level: 'intermediate',
    section: 'Accessible HTML',
    order: 35,
    minutes: 14,
    content: [
      { type: 'p', text: 'Accessible forms start with labels, clear instructions, and predictable error handling. Every control needs an accessible name, and every error should point back to the field that needs fixing.' },
      { type: 'h2', text: 'Label every control' },
      {
        type: 'code',
        language: 'html',
        title: 'Explicit label association',
        code: `<form action="/subscribe" method="post">
  <div>
    <label for="email">Email address</label>
    <input id="email" name="email" type="email" autocomplete="email" required />
  </div>

  <div>
    <input id="updates" name="updates" type="checkbox" />
    <label for="updates">Send me product updates</label>
  </div>

  <button type="submit">Subscribe</button>
</form>`,
      },
      { type: 'note', text: 'The for attribute on label must match the control id. Placeholder text is not a label replacement.' },
      { type: 'h2', text: 'Describe errors and hints' },
      {
        type: 'code',
        language: 'html',
        title: 'aria-describedby for help and errors',
        code: `<label for="username">Username</label>
<input
  id="username"
  name="username"
  type="text"
  autocomplete="username"
  aria-describedby="username-hint username-error"
  aria-invalid="true"
/>
<p id="username-hint">Use 3 to 20 letters or numbers.</p>
<p id="username-error">Username must be at least 3 characters.</p>`,
      },
      { type: 'h2', text: 'Accessible form checklist' },
      {
        type: 'ul',
        items: [
          'Visible label for every input, select, and textarea.',
          'fieldset and legend for related radio or checkbox groups.',
          'autocomplete values that match the expected data.',
          'Clear required indicators in text, not color alone.',
          'Error messages that say what went wrong and how to fix it.',
        ],
      },
      { type: 'warning', text: 'Do not rely on color alone to mark invalid fields. Pair borders or icons with text messages tied to the control.' },
      { type: 'tip', text: 'Put the primary submit button at the end of the form and give it an action-oriented label such as Create account, not OK.' },
      { type: 'try', text: 'Build a signup form with labeled email and password fields, a short password hint, and an error message associated with aria-describedby.' },
      {
        type: 'keypoints',
        items: [
          'Labels give form controls their accessible names.',
          'Hints and errors should be programmatically tied to fields.',
          'Placeholders and color are not enough on their own.',
          'Clear button text helps everyone complete the task.',
        ],
      },
    ],
  },
  {
    slug: 'validation-attributes',
    title: 'Validation Attributes',
    description:
      'Use required, type, min, max, minlength, maxlength, pattern, and related attributes for built-in form checks.',
    level: 'intermediate',
    section: 'Advanced Forms',
    order: 36,
    minutes: 13,
    content: [
      { type: 'p', text: 'Browsers can validate many fields before a form is submitted. HTML validation attributes give users quick feedback and reduce obviously invalid data, though you still validate again on the server.' },
      { type: 'h2', text: 'Common validation attributes' },
      {
        type: 'code',
        language: 'html',
        title: 'Client-side constraints',
        code: `<form action="/register" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required autocomplete="email" />

  <label for="age">Age</label>
  <input id="age" name="age" type="number" min="13" max="120" required />

  <label for="code">Event code</label>
  <input
    id="code"
    name="code"
    type="text"
    pattern="[A-Z]{3}-[0-9]{3}"
    title="Use a code like ABC-123"
    required
  />

  <label for="bio">Short bio</label>
  <textarea id="bio" name="bio" minlength="20" maxlength="160"></textarea>

  <button type="submit">Register</button>
</form>`,
      },
      {
        type: 'table',
        headers: ['Attribute', 'What it checks'],
        rows: [
          ['required', 'Field must have a value'],
          ['type="email" / url / number', 'Basic format or numeric input'],
          ['min / max', 'Numeric or date bounds'],
          ['minlength / maxlength', 'Text length bounds'],
          ['pattern', 'Regular expression match'],
          ['step', 'Allowed numeric increments'],
        ],
      },
      { type: 'h2', text: 'Helpful validation UX' },
      {
        type: 'ul',
        items: [
          'Include a title or visible hint that explains pattern requirements.',
          'Use the correct type so mobile keyboards match the data.',
          'Keep patterns simple and human-readable.',
          'Remember that users can bypass client checks; validate on the server too.',
        ],
      },
      { type: 'note', text: 'novalidate on a form disables browser validation when you want to handle all messaging yourself with script. Use it intentionally, not by accident.' },
      { type: 'tip', text: 'For password rules, prefer clear bullet instructions near the field over a cryptic pattern alone.' },
      { type: 'try', text: 'Create a coupon field that accepts codes shaped like SAVE-2026 using pattern and title. Test valid and invalid submissions in the browser.' },
      {
        type: 'keypoints',
        items: [
          'HTML validation attributes catch many common mistakes early.',
          'required, type, min, max, length, and pattern cover most basics.',
          'Explain constraints with visible help text.',
          'Server-side validation remains mandatory.',
        ],
      },
    ],
  },
  {
    slug: 'fieldset-legend',
    title: 'Fieldset and Legend',
    description:
      'Group related form controls with fieldset and legend so radio sets and question groups are clear.',
    level: 'intermediate',
    section: 'Advanced Forms',
    order: 37,
    minutes: 11,
    content: [
      { type: 'p', text: 'fieldset wraps a group of related controls. legend provides the group label. Together they are especially important for radio buttons and checkbox sets that share one question.' },
      { type: 'h2', text: 'Radio group example' },
      {
        type: 'code',
        language: 'html',
        title: 'Shipping speed options',
        code: `<form action="/checkout" method="post">
  <fieldset>
    <legend>Shipping speed</legend>

    <div>
      <input id="standard" name="shipping" type="radio" value="standard" checked />
      <label for="standard">Standard (3 to 5 days)</label>
    </div>

    <div>
      <input id="express" name="shipping" type="radio" value="express" />
      <label for="express">Express (1 to 2 days)</label>
    </div>
  </fieldset>

  <button type="submit">Continue</button>
</form>`,
      },
      { type: 'p', text: 'Screen readers announce the legend with each option, so users hear both the question and the choice. Individual labels alone do not replace a group legend for radios.' },
      { type: 'h2', text: 'Nested groups and addresses' },
      {
        type: 'code',
        language: 'html',
        title: 'Address fieldset',
        code: `<fieldset>
  <legend>Billing address</legend>

  <label for="street">Street</label>
  <input id="street" name="street" autocomplete="address-line1" />

  <label for="city">City</label>
  <input id="city" name="city" autocomplete="address-level2" />

  <label for="postal">Postal code</label>
  <input id="postal" name="postal" autocomplete="postal-code" />
</fieldset>`,
      },
      {
        type: 'ul',
        items: [
          'One legend per fieldset, usually as the first child.',
          'Keep legend text short and question-like.',
          'Use the same name on radio inputs so only one can be selected.',
          'Do not use fieldset only for visual borders; use it for meaning.',
        ],
      },
      { type: 'tip', text: 'If a design hides the default fieldset border, keep the semantic grouping. Style with CSS instead of removing the elements.' },
      { type: 'try', text: 'Build a survey question with four radio options inside a fieldset. Add a second fieldset for a checkbox list of interests.' },
      {
        type: 'keypoints',
        items: [
          'fieldset groups related controls.',
          'legend labels the whole group.',
          'Radio questions need a group label plus per-option labels.',
          'Address and payment blocks are good fieldset candidates.',
        ],
      },
    ],
  },
  {
    slug: 'datalist-range',
    title: 'Datalist and Range Inputs',
    description:
      'Offer autocomplete suggestions with datalist and collect numeric scales with range inputs.',
    level: 'intermediate',
    section: 'Advanced Forms',
    order: 38,
    minutes: 12,
    content: [
      { type: 'p', text: 'Some inputs benefit from suggestions without forcing a fixed select list. datalist provides optional autocomplete choices. type="range" collects a value along a numeric scale.' },
      { type: 'h2', text: 'datalist suggestions' },
      {
        type: 'code',
        language: 'html',
        title: 'City suggestions',
        code: `<label for="city">City</label>
<input id="city" name="city" list="city-list" autocomplete="address-level2" />
<datalist id="city-list">
  <option value="Lisbon"></option>
  <option value="Porto"></option>
  <option value="Coimbra"></option>
  <option value="Faro"></option>
</datalist>`,
      },
      { type: 'note', text: 'Users can still type a value that is not in the list. Use select when the value must be one of a fixed set.' },
      { type: 'h2', text: 'Range input' },
      {
        type: 'code',
        language: 'html',
        title: 'Satisfaction scale markup',
        code: `<label for="rating">Satisfaction: <output id="rating-value">5</output></label>
<input
  id="rating"
  name="rating"
  type="range"
  min="1"
  max="10"
  step="1"
  value="5"
/>`,
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Show the live range value',
        code: `const rating = document.getElementById('rating');
const output = document.getElementById('rating-value');
rating.addEventListener('input', () => {
  output.textContent = rating.value;
});`,
      },
      { type: 'p', text: 'Range controls should expose the current value visually. An output element or adjacent text helps keyboard and screen reader users understand the selected number.' },
      { type: 'h2', text: 'When to choose each control' },
      {
        type: 'table',
        headers: ['Goal', 'Control'],
        rows: [
          ['Optional suggestions', 'input + datalist'],
          ['Must pick from fixed options', 'select'],
          ['Approximate numeric scale', 'input type="range"'],
          ['Exact number entry', 'input type="number"'],
        ],
      },
      { type: 'tip', text: 'Keep datalist options reasonably short. Huge lists are harder to scan and may feel like a poor substitute for searchable UI.' },
      { type: 'try', text: 'Create a color preference field with datalist suggestions, and a volume range from 0 to 100 that displays the live value.' },
      {
        type: 'keypoints',
        items: [
          'datalist offers optional autocomplete choices.',
          'Users may enter values outside the datalist.',
          'range collects values on a min/max scale.',
          'Always show the current range value in text.',
        ],
      },
    ],
  },
  {
    slug: 'file-upload',
    title: 'File Upload Inputs',
    description:
      'Build file inputs with accept filters, multiple selection, and clear labels for upload forms.',
    level: 'intermediate',
    section: 'Advanced Forms',
    order: 39,
    minutes: 12,
    content: [
      { type: 'p', text: 'type="file" lets users attach documents or images to a form. Uploads need careful labels, helpful constraints, and a form encoding that can send binary data.' },
      { type: 'h2', text: 'Basic upload field' },
      {
        type: 'code',
        language: 'html',
        title: 'Resume upload',
        code: `<form action="/apply" method="post" enctype="multipart/form-data">
  <label for="resume">Resume (PDF)</label>
  <input
    id="resume"
    name="resume"
    type="file"
    accept=".pdf,application/pdf"
    required
  />

  <button type="submit">Submit application</button>
</form>`,
      },
      {
        type: 'ul',
        items: [
          'enctype="multipart/form-data" is required for file uploads.',
          'accept hints allowed extensions or MIME types.',
          'Browsers do not fully enforce accept; validate on the server.',
          'Give the control a clear label that states expected file types.',
        ],
      },
      { type: 'h2', text: 'Multiple files and images' },
      {
        type: 'code',
        language: 'html',
        title: 'Photo gallery upload',
        code: `<label for="photos">Project photos</label>
<input
  id="photos"
  name="photos"
  type="file"
  accept="image/*"
  multiple
/>
<p>You can select up to 5 images. PNG or JPEG preferred.</p>`,
      },
      { type: 'h2', text: 'Practical upload guidance' },
      {
        type: 'table',
        headers: ['Topic', 'Practice'],
        rows: [
          ['Labeling', 'Say what to upload and which formats are allowed'],
          ['Size limits', 'State max size in help text and enforce on the server'],
          ['Security', 'Never trust file extension alone'],
          ['UX', 'Show selected file names after choice when possible'],
        ],
      },
      { type: 'warning', text: 'accept is a helper, not a security boundary. Malicious files can be renamed. Scan and validate uploads server-side.' },
      { type: 'tip', text: 'For profile photos, accept="image/*" is convenient, but documenting exact formats and dimensions reduces support issues.' },
      { type: 'try', text: 'Create a support form that accepts one screenshot image and an optional PDF log file. Use multipart/form-data and clear labels.' },
      {
        type: 'keypoints',
        items: [
          'File inputs need multipart/form-data forms.',
          'accept guides users toward suitable file types.',
          'multiple allows more than one file.',
          'Server validation and size limits are essential.',
        ],
      },
    ],
  },
  {
    slug: 'form-patterns',
    title: 'Practical Form Patterns',
    description:
      'Combine labels, fieldsets, validation, and autocomplete into real-world contact and checkout-style forms.',
    level: 'intermediate',
    section: 'Advanced Forms',
    order: 40,
    minutes: 15,
    content: [
      { type: 'p', text: 'Real forms combine many techniques at once: grouping, validation, autocomplete, accessible errors, and clear actions. This lesson ties those pieces into patterns you can reuse.' },
      { type: 'h2', text: 'Contact form pattern' },
      {
        type: 'code',
        language: 'html',
        title: 'Accessible contact form',
        code: `<form action="/contact" method="post" novalidate>
  <div>
    <label for="name">Full name</label>
    <input id="name" name="name" type="text" autocomplete="name" required />
  </div>

  <div>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email" required />
  </div>

  <fieldset>
    <legend>Topic</legend>
    <div>
      <input id="topic-billing" name="topic" type="radio" value="billing" required />
      <label for="topic-billing">Billing</label>
    </div>
    <div>
      <input id="topic-tech" name="topic" type="radio" value="tech" />
      <label for="topic-tech">Technical support</label>
    </div>
  </fieldset>

  <div>
    <label for="message">Message</label>
    <textarea id="message" name="message" required minlength="20"></textarea>
  </div>

  <button type="submit">Send message</button>
</form>`,
      },
      { type: 'h2', text: 'Checkout snippet pattern' },
      {
        type: 'code',
        language: 'html',
        title: 'Payment contact details',
        code: `<fieldset>
  <legend>Contact for receipt</legend>
  <label for="checkout-email">Email</label>
  <input id="checkout-email" name="email" type="email" autocomplete="email" required />

  <label for="phone">Phone</label>
  <input id="phone" name="phone" type="tel" autocomplete="tel" />
</fieldset>

<fieldset>
  <legend>Shipping address</legend>
  <label for="line1">Address</label>
  <input id="line1" name="line1" autocomplete="address-line1" required />

  <label for="postal">Postal code</label>
  <input id="postal" name="postal" autocomplete="postal-code" required />
</fieldset>`,
      },
      { type: 'h2', text: 'Pattern checklist' },
      {
        type: 'ol',
        items: [
          'Ask only for data you will use.',
          'Order fields from easiest to hardest.',
          'Use autocomplete tokens that match browser expectations.',
          'Put destructive or secondary actions away from the primary submit button.',
          'Preserve user input after validation errors whenever possible.',
        ],
      },
      { type: 'tip', text: 'Name buttons by outcome: Send message, Place order, Save profile. Generic labels slow people down.' },
      { type: 'try', text: 'Build a two-section form with contact details and a preference fieldset. Include required fields, autocomplete, and a specific submit label.' },
      {
        type: 'keypoints',
        items: [
          'Practical forms combine labels, groups, and validation.',
          'autocomplete improves speed and accuracy.',
          'Field order and button wording affect completion rates.',
          'Reuse patterns instead of inventing each form from scratch.',
        ],
      },
    ],
  },
  {
    slug: 'document-outline',
    title: 'Document Outline',
    description:
      'Build a clear heading hierarchy and section structure so pages are easier to scan and navigate.',
    level: 'intermediate',
    section: 'Document Skills',
    order: 41,
    minutes: 12,
    content: [
      { type: 'p', text: 'A document outline is the heading structure of a page. Clear h1 through h6 levels help sighted users scan and help assistive tech users jump between sections.' },
      { type: 'h2', text: 'One page, one primary h1' },
      {
        type: 'code',
        language: 'html',
        title: 'Logical heading levels',
        code: `<main>
  <h1>Gardening in small spaces</h1>

  <section>
    <h2>Balcony vegetables</h2>
    <h3>Containers</h3>
    <p>Choose pots with drainage holes.</p>
    <h3>Sunlight</h3>
    <p>Most vegetables need several hours of direct sun.</p>
  </section>

  <section>
    <h2>Indoor herbs</h2>
    <p>Start with basil, mint, and parsley.</p>
  </section>
</main>`,
      },
      {
        type: 'ul',
        items: [
          'Use one h1 for the page title in most content pages.',
          'Do not skip levels for style reasons (avoid h1 then h4).',
          'Style with CSS; do not choose a heading level only because of font size.',
          'Section headings should describe the content that follows.',
        ],
      },
      { type: 'h2', text: 'Outline anti-patterns' },
      {
        type: 'table',
        headers: ['Anti-pattern', 'Better approach'],
        rows: [
          ['Multiple unrelated h1s for visual punch', 'One h1, then h2 sections'],
          ['Bold paragraphs instead of headings', 'Real heading elements'],
          ['Heading text that is vague, such as More', 'Specific section titles'],
          ['Using headings only inside cards for style', 'Reserve headings for real structure'],
        ],
      },
      { type: 'tip', text: 'Open your page in a headings browser extension or accessibility tree view and read only the heading list. If that list is confusing, revise the outline.' },
      { type: 'try', text: 'Rewrite a messy page that uses bold text for section titles into a clean outline with one h1 and nested h2/h3 sections.' },
      {
        type: 'keypoints',
        items: [
          'Headings create the document outline.',
          'Prefer one h1 and nested levels without skips.',
          'Heading level communicates structure, not font size.',
          'A clear outline improves scanning and accessibility.',
        ],
      },
    ],
  },
  {
    slug: 'meta-seo-basics',
    title: 'Meta Tags and SEO Basics',
    description:
      'Write titles, descriptions, language, and essential meta tags that help search and social understanding.',
    level: 'intermediate',
    section: 'Document Skills',
    order: 42,
    minutes: 13,
    content: [
      { type: 'p', text: 'Search engines and browsers read metadata in the head of your document. Strong titles and descriptions do not replace good content, but they help people choose your page from search results.' },
      { type: 'h2', text: 'Essential head tags' },
      {
        type: 'code',
        language: 'html',
        title: 'Core SEO-related head',
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Balcony tomato guide | Green Pocket Farm</title>
    <meta
      name="description"
      content="Learn how to grow cherry tomatoes in containers, with soil tips, watering schedules, and sunlight advice."
    />
    <link rel="canonical" href="https://example.com/guides/balcony-tomatoes" />
  </head>
  <body>
    <main>
      <h1>Balcony tomato guide</h1>
    </main>
  </body>
</html>`,
      },
      {
        type: 'ul',
        items: [
          'title should be unique, readable, and include the primary topic.',
          'meta description summarizes the page in about one or two sentences.',
          'lang on html helps browsers and assistive tech pronounce content correctly.',
          'canonical points to the preferred URL when duplicates exist.',
        ],
      },
      { type: 'h2', text: 'SEO basics beyond meta tags' },
      {
        type: 'ol',
        items: [
          'Use a clear h1 that matches the page topic.',
          'Write descriptive link text instead of click here.',
          'Keep URLs readable when you control them.',
          'Make sure important content is in HTML, not locked inside images.',
          'Use fast, mobile-friendly pages with accessible structure.',
        ],
      },
      { type: 'warning', text: 'Do not stuff keywords into titles or descriptions. Write for humans first. Misleading snippets hurt trust even if they earn a temporary click.' },
      { type: 'tip', text: 'A practical title pattern is Primary topic | Brand. Keep the important words near the front.' },
      { type: 'try', text: 'Write title and meta description for a page about accessible form labels. Keep the title under roughly 60 characters and the description under roughly 160.' },
      {
        type: 'keypoints',
        items: [
          'title and description shape search result snippets.',
          'lang, charset, and viewport remain foundational.',
          'Canonical URLs help clarify the preferred page.',
          'On-page structure and useful content still matter most.',
        ],
      },
    ],
  },
  {
    slug: 'open-graph',
    title: 'Open Graph Basics',
    description:
      'Add Open Graph and Twitter-style meta tags so shared links show the right title, description, and image.',
    level: 'intermediate',
    section: 'Document Skills',
    order: 43,
    minutes: 12,
    content: [
      { type: 'p', text: 'When someone shares your URL in social apps or chat tools, those platforms look for Open Graph tags to build a preview card. Without them, previews may show a random image or a weak title.' },
      { type: 'h2', text: 'Core Open Graph tags' },
      {
        type: 'code',
        language: 'html',
        title: 'og meta tags',
        code: `<head>
  <title>Harbor path reopens | Coastal Weekly</title>
  <meta
    name="description"
    content="The south harbor trail is open again after restoration work."
  />

  <meta property="og:type" content="article" />
  <meta property="og:title" content="Harbor path reopens" />
  <meta
    property="og:description"
    content="The south harbor trail is open again after restoration work."
  />
  <meta property="og:url" content="https://example.com/news/harbor-path" />
  <meta property="og:image" content="https://example.com/images/harbor-og.jpg" />
  <meta property="og:site_name" content="Coastal Weekly" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Harbor path reopens" />
  <meta
    name="twitter:description"
    content="The south harbor trail is open again after restoration work."
  />
  <meta name="twitter:image" content="https://example.com/images/harbor-og.jpg" />
</head>`,
      },
      {
        type: 'ul',
        items: [
          'og:title and og:description power many link previews.',
          'og:image should be an absolute URL to a high-quality image.',
          'og:url should match the canonical page URL.',
          'twitter:card tags improve previews on X and compatible tools.',
        ],
      },
      { type: 'h2', text: 'Image tips for previews' },
      {
        type: 'table',
        headers: ['Tip', 'Why'],
        rows: [
          ['Use a dedicated share image', 'Crop and text stay readable in cards'],
          ['Prefer wide images around 1200x630', 'Common preview ratio'],
          ['Avoid tiny text in the image', 'It becomes unreadable when scaled down'],
          ['Keep file size reasonable', 'Previews fetch faster'],
        ],
      },
      { type: 'note', text: 'Platforms cache previews. After changing tags, use each platform debugger or cache clearer when you need to refresh an old card.' },
      { type: 'tip', text: 'Reuse your best page summary for both meta description and og:description unless the social context needs a shorter line.' },
      { type: 'try', text: 'Add Open Graph and Twitter card tags to a blog post template, including an absolute og:image URL.' },
      {
        type: 'keypoints',
        items: [
          'Open Graph tags control many social link previews.',
          'Include title, description, url, type, and image.',
          'Use absolute image URLs.',
          'Twitter card tags complement Open Graph on some platforms.',
        ],
      },
    ],
  },
  {
    slug: 'link-rel',
    title: 'link rel Stylesheets and Preload',
    description:
      'Connect CSS and prepare critical assets with link rel stylesheet, preload, and related resource hints.',
    level: 'intermediate',
    section: 'Document Skills',
    order: 44,
    minutes: 13,
    content: [
      { type: 'p', text: 'The link element connects your document to external resources. The most common use is stylesheets. You can also hint the browser to preload critical files so rendering starts sooner.' },
      { type: 'h2', text: 'Stylesheets and icons' },
      {
        type: 'code',
        language: 'html',
        title: 'Common link relations',
        code: `<head>
  <link rel="stylesheet" href="/styles/main.css" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="canonical" href="https://example.com/pricing" />
  <link rel="alternate" hreflang="es" href="https://example.com/es/pricing" />
</head>`,
      },
      { type: 'h2', text: 'Preload critical assets' },
      {
        type: 'code',
        language: 'html',
        title: 'preload and preconnect',
        code: `<head>
  <link
    rel="preload"
    href="/fonts/display.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
  <link rel="preload" href="/styles/critical.css" as="style" />
  <link rel="stylesheet" href="/styles/critical.css" />
  <link rel="preconnect" href="https://cdn.example.com" />
</head>`,
      },
      {
        type: 'ul',
        items: [
          'rel="stylesheet" applies CSS to the document.',
          'rel="preload" fetches a resource early for a near-term use.',
          'as tells the browser what kind of resource it is fetching.',
          'preconnect opens an early connection to an important origin.',
        ],
      },
      { type: 'h2', text: 'Use preload carefully' },
      {
        type: 'table',
        headers: ['Do', 'Avoid'],
        rows: [
          ['Preload the hero font actually used above the fold', 'Preloading every font file'],
          ['Preload one critical CSS file when needed', 'Preloading large unused images'],
          ['Match preload URLs to real requests', 'Preloading files the page never uses'],
        ],
      },
      { type: 'warning', text: 'Too many preloads compete for bandwidth. Preload only assets that are critical for the first render.' },
      { type: 'tip', text: 'Font preloads usually need crossorigin because fonts are fetched in CORS mode even from the same origin.' },
      { type: 'try', text: 'Link a stylesheet in the head, then add a preload for a local woff2 font that the CSS uses in the hero heading.' },
      {
        type: 'keypoints',
        items: [
          'link rel="stylesheet" attaches CSS.',
          'preload and preconnect are performance hints.',
          'The as attribute is required for effective preloads.',
          'Only preload assets that matter for first render.',
        ],
      },
    ],
  },
  {
    slug: 'script-defer-async',
    title: 'Script Loading Basics',
    description:
      'Understand default script loading versus async and defer so pages stay interactive without blocking rendering.',
    level: 'intermediate',
    section: 'Document Skills',
    order: 45,
    minutes: 13,
    content: [
      { type: 'p', text: 'Script tags can block HTML parsing if you are not careful. defer and async give you control over when external scripts download and run.' },
      { type: 'h2', text: 'Default, defer, and async' },
      {
        type: 'table',
        headers: ['Mode', 'Download', 'Execution'],
        rows: [
          ['Default script in head', 'Blocks parsing while downloading and running', 'Runs immediately, then parsing continues'],
          ['defer', 'Downloads in parallel with parsing', 'Runs in order after the document is parsed'],
          ['async', 'Downloads in parallel with parsing', 'Runs as soon as ready, order not guaranteed'],
        ],
      },
      {
        type: 'code',
        language: 'html',
        title: 'Recommended patterns',
        code: `<head>
  <script src="/js/analytics.js" async></script>
  <script src="/js/main.js" defer></script>
</head>
<body>
  <h1>Dashboard</h1>
</body>`,
      },
      {
        type: 'ul',
        items: [
          'Use defer for scripts that depend on DOM structure and on each other.',
          'Use async for independent scripts such as many analytics tags.',
          'Module scripts (type="module") defer by default.',
          'Place blocking scripts carefully; prefer defer for app code.',
        ],
      },
      { type: 'h2', text: 'A small DOM-safe script' },
      {
        type: 'code',
        language: 'javascript',
        title: 'main.js with defer',
        code: `document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.hidden = open;
  });
});`,
      },
      { type: 'note', text: 'With defer, the DOM is parsed before the script runs. DOMContentLoaded listeners still work, and querySelector can find elements declared in the body.' },
      { type: 'warning', text: 'Do not use async for scripts that must run in a specific order or that assume earlier scripts already defined helpers.' },
      { type: 'tip', text: 'For most site JavaScript files that enhance UI, defer is the safest default.' },
      { type: 'try', text: 'Move an app script from the end of body into the head with defer, then confirm menu toggle behavior still works after load.' },
      {
        type: 'keypoints',
        items: [
          'Default scripts can block parsing.',
          'defer preserves order and runs after HTML is parsed.',
          'async is best for independent scripts.',
          'module scripts are deferred by default.',
        ],
      },
    ],
  },
  {
    slug: 'blog-article-page',
    title: 'Project: Blog Article Page',
    description:
      'Build a complete blog article page with landmarks, headings, media, meta tags, and accessible structure.',
    level: 'intermediate',
    section: 'Projects',
    order: 46,
    minutes: 18,
    content: [
      { type: 'p', text: 'This project combines intermediate HTML skills into one publishable article page. You will structure content with landmarks, write a clean outline, include responsive media, and add document metadata.' },
      { type: 'h2', text: 'Project goals' },
      {
        type: 'ul',
        items: [
          'One article page with header, nav, main, article, aside, and footer.',
          'A clear heading outline and meaningful links.',
          'At least one image with thoughtful alt text.',
          'A video or audio element with controls and a fallback.',
          'title, description, and Open Graph tags in the head.',
        ],
      },
      { type: 'h2', text: 'Starter structure' },
      {
        type: 'code',
        language: 'html',
        title: 'article.html',
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Compost basics for small yards | Green Pocket Farm</title>
    <meta
      name="description"
      content="A practical guide to starting a compost bin at home, including what to add, what to avoid, and how to keep the pile healthy."
    />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="Compost basics for small yards" />
    <meta
      property="og:description"
      content="Start a healthy compost bin with simple household materials."
    />
    <meta property="og:image" content="https://example.com/images/compost-og.jpg" />
    <link rel="stylesheet" href="/styles/article.css" />
  </head>
  <body>
    <header>
      <p>Green Pocket Farm</p>
      <nav aria-label="Primary">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/guides">Guides</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <article>
        <h1>Compost basics for small yards</h1>
        <p>Published <time datetime="2026-07-01">July 1, 2026</time></p>

        <figure>
          <img
            src="/images/compost-bin.jpg"
            srcset="/images/compost-bin-640.jpg 640w, /images/compost-bin-1200.jpg 1200w"
            sizes="(max-width: 700px) 100vw, 700px"
            width="1200"
            height="800"
            alt="Wooden compost bin beside a garden bed"
          />
          <figcaption>A simple two-bin setup works for most homes.</figcaption>
        </figure>

        <h2>What belongs in the pile</h2>
        <p>Mix dry browns with moist greens and keep the pile aerated.</p>

        <h2>Watch a quick demo</h2>
        <video controls width="640" poster="/images/compost-poster.jpg">
          <source src="/media/compost-demo.mp4" type="video/mp4" />
          <track kind="captions" src="/media/compost-demo-en.vtt" srclang="en" label="English" default />
          <a href="/media/compost-demo.mp4">Download the demo video</a>
        </video>
      </article>

      <aside>
        <h2>Related guides</h2>
        <p><a href="/guides/soil">Soil health primer</a></p>
      </aside>
    </main>

    <footer>
      <p><a href="/about">About</a> · <a href="/contact">Contact</a></p>
    </footer>
  </body>
</html>`,
      },
      { type: 'h2', text: 'Acceptance checklist' },
      {
        type: 'ol',
        items: [
          'Validate that the page has one h1 and nested headings without skips.',
          'Confirm the image has useful alt text and width/height.',
          'Tab through navigation and article links with the keyboard.',
          'Check that the video includes controls and a caption track or transcript link.',
          'View the head tags and confirm title, description, and og:image exist.',
        ],
      },
      { type: 'tip', text: 'Write the article content first, then tighten metadata so the title and description match what the page actually teaches.' },
      { type: 'try', text: 'Finish the article page with two more h2 sections, an author byline, and a footer nav labeled separately from the primary nav.' },
      {
        type: 'keypoints',
        items: [
          'Article pages benefit from landmarks and a clean outline.',
          'Media should include accessible alternatives.',
          'Metadata helps sharing and search snippets.',
          'Projects prove you can combine techniques, not only recall tags.',
        ],
      },
    ],
  },
  {
    slug: 'landing-structure',
    title: 'Project: Landing Page Structure',
    description:
      'Structure a marketing landing page with a focused hero region, feature sections, and an accessible signup form.',
    level: 'intermediate',
    section: 'Projects',
    order: 47,
    minutes: 18,
    content: [
      { type: 'p', text: 'Landing pages often fail because the HTML is a pile of generic divs. In this project you will build a clear structure: brand and hero, one primary call to action, supporting sections, and a signup form that is accessible.' },
      { type: 'h2', text: 'Project goals' },
      {
        type: 'ul',
        items: [
          'A header with brand name and primary navigation.',
          'A hero section with one headline, one supporting sentence, and one CTA group.',
          'Two or three supporting sections with unique headings.',
          'An email signup form with labels and validation attributes.',
          'Document metadata and a favicon link.',
        ],
      },
      { type: 'h2', text: 'Starter structure' },
      {
        type: 'code',
        language: 'html',
        title: 'landing.html',
        code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>LedgerLite | Simple budgeting for freelancers</title>
    <meta
      name="description"
      content="LedgerLite helps freelancers track invoices, expenses, and monthly cash flow in one calm workspace."
    />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="stylesheet" href="/styles/landing.css" />
  </head>
  <body>
    <header>
      <p>LedgerLite</p>
      <nav aria-label="Primary">
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#signup">Sign up</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section id="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">LedgerLite</h1>
        <p>Track invoices and expenses without spreadsheet chaos.</p>
        <p>
          <a href="#signup">Start free</a>
          <a href="#features">See features</a>
        </p>
        <img
          src="/images/ledgerlite-hero.jpg"
          alt="LedgerLite dashboard showing monthly cash flow"
          width="1200"
          height="750"
        />
      </section>

      <section id="features" aria-labelledby="features-title">
        <h2 id="features-title">Everything in one place</h2>
        <p>Invoices, expenses, and payout dates stay on one timeline.</p>
      </section>

      <section id="pricing" aria-labelledby="pricing-title">
        <h2 id="pricing-title">Simple pricing</h2>
        <p>Free for solo freelancers. Team plans available later.</p>
      </section>

      <section id="signup" aria-labelledby="signup-title">
        <h2 id="signup-title">Create your workspace</h2>
        <form action="/signup" method="post">
          <div>
            <label for="email">Work email</label>
            <input id="email" name="email" type="email" autocomplete="email" required />
          </div>
          <div>
            <label for="name">Your name</label>
            <input id="name" name="name" type="text" autocomplete="name" required />
          </div>
          <button type="submit">Start free</button>
        </form>
      </section>
    </main>

    <footer>
      <nav aria-label="Footer">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </nav>
    </footer>
  </body>
</html>`,
      },
      { type: 'h2', text: 'Structure tips' },
      {
        type: 'ol',
        items: [
          'Keep the first viewport focused: brand, headline, support line, CTA, hero image.',
          'Give each section one job and one heading.',
          'Use in-page links that match real section ids.',
          'Make the signup form keyboard friendly and clearly labeled.',
        ],
      },
      { type: 'tip', text: 'If the brand disappears when you hide the header, strengthen the hero so the product name remains a primary signal.' },
      { type: 'try', text: 'Extend the landing page with a testimonials section that uses a single h2 and blockquote elements, plus an accessible footer nav.' },
      {
        type: 'keypoints',
        items: [
          'Landing HTML should emphasize brand, promise, and action.',
          'Sections need clear headings and one purpose each.',
          'Signup forms must stay labeled and validatable.',
          'Metadata and icons complete a shippable first version.',
        ],
      },
    ],
  },
  {
    slug: 'intermediate-review',
    title: 'Intermediate Review',
    description:
      'Review media, accessibility, forms, and document skills from the intermediate HTML path with a practical checklist.',
    level: 'intermediate',
    section: 'Projects',
    order: 48,
    minutes: 14,
    content: [
      { type: 'p', text: 'You have moved beyond basic tags into media embeds, accessible structure, stronger forms, and document-level skills. This review consolidates what to remember before advanced HTML topics.' },
      { type: 'h2', text: 'Media and embeds' },
      {
        type: 'ul',
        items: [
          'Use audio and video with controls, sources, and captions when needed.',
          'Give iframes titles and restrict them with sandbox when appropriate.',
          'Serve responsive images with srcset, sizes, and picture.',
          'Prefer small inline SVG icons with accessible names or aria-hidden when decorative.',
        ],
      },
      { type: 'h2', text: 'Accessibility and forms' },
      {
        type: 'ul',
        items: [
          'Start with semantics and landmarks before ARIA.',
          'Write alt text for purpose; use empty alt for decoration.',
          'Keep keyboard focus visible and logical.',
          'Label inputs, group radios with fieldset/legend, and connect errors with aria-describedby.',
          'Use validation attributes as helpers, not as your only validation layer.',
        ],
      },
      { type: 'h2', text: 'Document skills' },
      {
        type: 'code',
        language: 'html',
        title: 'Quick head checklist',
        code: `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Unique page title | Brand</title>
  <meta name="description" content="Clear summary of the page." />
  <meta property="og:title" content="Unique page title" />
  <meta property="og:image" content="https://example.com/share.jpg" />
  <link rel="stylesheet" href="/styles/main.css" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <script src="/js/main.js" defer></script>
</head>`,
      },
      { type: 'h2', text: 'Self-check quiz' },
      {
        type: 'ol',
        items: [
          'When should you choose picture instead of img with srcset alone?',
          'What is wrong with a clickable div that has no role, tabindex, or keyboard handlers?',
          'Why does a radio group need both legend and per-option labels?',
          'What is the difference between defer and async on a script tag?',
          'Which Open Graph tags are the minimum for a useful share preview?',
        ],
      },
      { type: 'p', text: 'Suggested answers: use picture for art direction or format switching; a div button is not keyboard accessible by default; legend names the question while labels name choices; defer keeps order after parse while async runs when ready; og:title, og:description, og:image, and og:url cover most previews.' },
      { type: 'try', text: 'Pick one earlier project page and improve it with one media upgrade, one accessibility fix, and one document-head improvement. List the three changes you made.' },
      {
        type: 'keypoints',
        items: [
          'Intermediate HTML connects media, accessibility, forms, and document metadata.',
          'Semantics first, ARIA second.',
          'Forms need labels, groups, and honest validation.',
          'Head tags and script loading shape discovery and performance.',
        ],
      },
    ],
  },
];
