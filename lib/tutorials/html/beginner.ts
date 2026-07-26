import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-html',
    title: 'What is HTML?',
    description: 'Learn what HTML is, how it structures web pages, and how it works with CSS and JavaScript.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 8,
    content: [
      { type: 'p', text: 'HTML stands for HyperText Markup Language. It is the language that describes the structure and meaning of content on a web page: headings, paragraphs, links, images, forms, and more.' },
      { type: 'p', text: 'When you open a website, the browser reads HTML and builds a document you can see and interact with. HTML does not style the page or add complex behavior. It defines what is on the page and what each part means.' },
      { type: 'h2', text: 'Markup, not a programming language' },
      { type: 'p', text: 'HTML uses tags to mark up content. A tag wraps content and tells the browser what that content is. For example, a paragraph tag marks a block of text as a paragraph.' },
      {
        type: 'code',
        title: 'A tiny HTML snippet',
        language: 'html',
        code: `<h1>Welcome to Intellex</h1>
<p>HTML gives structure to web content.</p>`
      },
      { type: 'h2', text: 'How HTML fits with CSS and JavaScript' },
      { type: 'ul', items: ['HTML answers: What is on the page?', 'CSS answers: How should it look?', 'JavaScript answers: What should happen when the user interacts?'] },
      {
        type: 'table',
        headers: ['Technology', 'Role'],
        rows: [
          ['HTML', 'Structure and meaning'],
          ['CSS', 'Layout, color, typography'],
          ['JavaScript', 'Interactivity and logic']
        ]
      },
      { type: 'note', text: 'You can build readable pages with HTML alone. CSS and JavaScript improve appearance and behavior, but HTML is the foundation.' },
      { type: 'h2', text: 'HyperText and links' },
      { type: 'p', text: 'The "HyperText" part of HTML refers to links that connect documents. Links let users move from one page to another, which is the core idea of the web.' },
      {
        type: 'code',
        title: 'A simple link',
        language: 'html',
        code: `<a href="https://example.com">Visit Example</a>`
      },
      { type: 'tip', text: 'Think of HTML as a blueprint. It names each part of the page so browsers, search engines, and assistive tools can understand it.' },
      { type: 'try', text: 'Open any website, look at the visible content, and list five pieces you think are marked with HTML tags (for example: logo text, navigation, article title, image, footer).' },
      { type: 'keypoints', items: ['HTML is the markup language that structures web pages.', 'Tags wrap content and describe what that content is.', 'HTML works with CSS for style and JavaScript for behavior.', 'Links are a core idea of HyperText on the web.'] }
    ]
  },
  {
    slug: 'html-document',
    title: 'Anatomy of an HTML Document',
    description: 'Learn the required pieces of a valid HTML page: doctype, html, head, and body.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 10,
    content: [
      { type: 'p', text: 'Every HTML page follows a common skeleton. Once you recognize that skeleton, new pages become much easier to build and read.' },
      { type: 'h2', text: 'The document skeleton' },
      { type: 'p', text: 'A basic HTML document includes a doctype declaration, an html root element, a head section for metadata, and a body section for visible content.' },
      {
        type: 'code',
        title: 'Minimal HTML document',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Page</title>
</head>
<body>
  <h1>Hello, HTML</h1>
  <p>This is my first page.</p>
</body>
</html>`
      },
      { type: 'h2', text: 'What each part does' },
      { type: 'ul', items: ['<!DOCTYPE html> tells the browser to use modern HTML standards.', '<html> is the root element that wraps the whole document.', '<head> holds metadata such as the title and character encoding.', '<body> holds the content users see on the page.'] },
      { type: 'h2', text: 'The lang attribute' },
      { type: 'p', text: 'Adding lang="en" on the html element helps browsers, search engines, and screen readers know the primary language of the page.' },
      {
        type: 'code',
        title: 'Language on the root element',
        language: 'html',
        code: `<html lang="en">`
      },
      { type: 'h2', text: 'Title appears in the browser tab' },
      { type: 'p', text: 'The text inside the title element is not shown in the main page area. It appears in the browser tab, bookmarks, and search results.' },
      { type: 'note', text: 'Always put visible content in the body. Put page setup information such as title, charset, and links to CSS in the head.' },
      { type: 'tip', text: 'Save HTML files with a .html extension, such as index.html, so your computer and browser treat them as web pages.' },
      { type: 'try', text: 'Create a file named about.html with a doctype, html, head, title, and body. Put your name in an h1 and one short sentence in a paragraph.' },
      { type: 'keypoints', items: ['A valid page needs doctype, html, head, and body.', 'Metadata belongs in the head; visible content belongs in the body.', 'lang helps tools understand the page language.', 'The title element sets the browser tab text.'] }
    ]
  },
  {
    slug: 'headings-paragraphs',
    title: 'Headings and Paragraphs',
    description: 'Use heading levels and paragraphs to organize readable page content.',
    level: 'beginner',
    section: 'Getting Started',
    order: 3,
    minutes: 9,
    content: [
      { type: 'p', text: 'Headings and paragraphs are the most common text elements on the web. They give your content a clear outline and make pages easier to scan.' },
      { type: 'h2', text: 'Heading levels h1 through h6' },
      { type: 'p', text: 'HTML provides six heading levels. h1 is the highest level, usually the main page title. h2 introduces major sections. Lower levels nest under higher ones.' },
      {
        type: 'code',
        title: 'Heading hierarchy',
        language: 'html',
        code: `<h1>Cooking Basics</h1>
<h2>Kitchen Tools</h2>
<p>Start with a cutting board and a sharp knife.</p>
<h2>Simple Recipes</h2>
<h3>Overnight Oats</h3>
<p>Mix oats, milk, and fruit, then chill.</p>`
      },
      { type: 'h2', text: 'One main h1 per page' },
      { type: 'p', text: 'As a beginner rule, use a single h1 for the main topic of the page. Then use h2 for sections and h3 for subsections. Do not skip levels just to change size.' },
      { type: 'warning', text: 'Do not choose a heading level only because of how big it looks. Use CSS for visual size. Choose heading tags for document structure.' },
      { type: 'h2', text: 'Paragraphs with p' },
      { type: 'p', text: 'Wrap each block of prose in a p element. Browsers add spacing between paragraphs automatically.' },
      {
        type: 'code',
        title: 'Paragraphs',
        language: 'html',
        code: `<p>HTML organizes content into meaningful pieces.</p>
<p>Clear structure helps both people and machines read your page.</p>`
      },
      { type: 'h2', text: 'Line breaks vs new paragraphs' },
      { type: 'p', text: 'Use a new p element for a new idea. The br element creates a line break inside the same paragraph and should be used sparingly, such as in addresses or poetry.' },
      {
        type: 'code',
        title: 'Address with line breaks',
        language: 'html',
        code: `<p>
  12 Maple Street<br>
  Springfield, IL 62701
</p>`
      },
      { type: 'tip', text: 'If your content has a title, sections, and body text, start with h1, h2, and p before adding more complex elements.' },
      { type: 'try', text: 'Write a short page about a hobby using one h1, two h2 headings, and at least three paragraphs.' },
      { type: 'keypoints', items: ['Use h1-h6 to create a logical outline.', 'Prefer one h1 as the main page title.', 'Wrap prose in p elements.', 'Choose headings for meaning, not for font size.'] }
    ]
  },
  {
    slug: 'comments-whitespace',
    title: 'Comments and Whitespace',
    description: 'Learn how HTML comments work and how browsers treat spaces and blank lines.',
    level: 'beginner',
    section: 'Getting Started',
    order: 4,
    minutes: 8,
    content: [
      { type: 'p', text: 'Comments and whitespace help you write HTML that humans can maintain. Browsers mostly ignore them when displaying the page.' },
      { type: 'h2', text: 'HTML comments' },
      { type: 'p', text: 'A comment starts with <!-- and ends with -->. Anything inside is ignored by the browser display, so you can leave notes for yourself or teammates.' },
      {
        type: 'code',
        title: 'Using a comment',
        language: 'html',
        code: `<!-- Main introduction -->
<h1>Portfolio</h1>
<p>Projects and contact details.</p>

<!-- TODO: add project gallery below -->`
      },
      { type: 'note', text: 'Comments are still visible if someone views the page source. Never put passwords, secrets, or private data in HTML comments.' },
      { type: 'h2', text: 'Whitespace in HTML' },
      { type: 'p', text: 'Spaces, tabs, and blank lines in your source file usually collapse into a single space in the rendered page. Indentation is for readability, not for visual layout.' },
      {
        type: 'code',
        title: 'These paragraphs render similarly',
        language: 'html',
        code: `<p>Hello     world</p>
<p>
  Hello
  world
</p>`
      },
      { type: 'h2', text: 'When whitespace matters' },
      { type: 'p', text: 'Inside some elements, such as pre, whitespace is preserved. For normal paragraphs and headings, extra spaces do not create bigger gaps on the page.' },
      {
        type: 'code',
        title: 'Preserved whitespace with pre',
        language: 'html',
        code: `<pre>
Line 1
  Indented line
Line 3
</pre>`
      },
      { type: 'tip', text: 'Indent nested tags consistently, such as two spaces per level. Consistent formatting makes missing closing tags easier to spot.' },
      { type: 'try', text: 'Add three comments to a small HTML page that label the header area, the main content, and a future section you plan to add.' },
      { type: 'keypoints', items: ['Comments use <!-- and --> and do not appear on the page.', 'Do not store secrets in HTML comments.', 'Extra spaces and blank lines usually collapse in normal content.', 'Indent HTML for clarity even when whitespace does not change layout.'] }
    ]
  },
  {
    slug: 'view-source-devtools',
    title: 'View Source and DevTools',
    description: 'Inspect real HTML with View Source and browser DevTools so you can learn from live pages.',
    level: 'beginner',
    section: 'Getting Started',
    order: 5,
    minutes: 10,
    content: [
      { type: 'p', text: 'Browsers let you inspect the HTML behind any page. Learning these tools helps you debug your own work and understand how professional sites are structured.' },
      { type: 'h2', text: 'View Page Source' },
      { type: 'p', text: 'View Source shows the original HTML the browser received. On most browsers you can right-click the page and choose View Page Source, or use a keyboard shortcut.' },
      { type: 'ul', items: ['Chrome / Edge: Ctrl+U (Windows/Linux) or Cmd+Option+U (macOS)', 'Firefox: Ctrl+U or Cmd+U', 'Safari: enable Develop menu, then show page source'] },
      { type: 'h2', text: 'What View Source is good for' },
      { type: 'p', text: 'Use View Source to see the raw document: doctype, head metadata, linked files, and the initial markup. It is a snapshot of the source before JavaScript changes the page.' },
      { type: 'h2', text: 'Open DevTools Elements panel' },
      { type: 'p', text: 'DevTools shows the live Document Object Model (DOM). That includes HTML that may have been added or changed by JavaScript after the page loaded.' },
      {
        type: 'ol',
        items: [
          'Right-click an element on the page and choose Inspect.',
          'Find the Elements (or Inspector) panel.',
          'Hover over tags to highlight matching parts of the page.',
          'Expand and collapse nested elements to explore structure.'
        ]
      },
      {
        type: 'code',
        title: 'What you might see in Elements',
        language: 'html',
        code: `<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
<main>
  <h1>About Us</h1>
</main>`
      },
      { type: 'note', text: 'View Source shows the original file. DevTools shows the current live DOM, which can differ if scripts modify the page.' },
      { type: 'tip', text: 'While learning HTML, keep DevTools open on your own pages. Click around and match tags to what you see on screen.' },
      { type: 'try', text: 'Open a news website, inspect the main headline, and write down the heading tag and two parent elements that wrap it.' },
      { type: 'keypoints', items: ['View Source shows the original HTML document.', 'DevTools shows the live DOM, including dynamic changes.', 'Inspect helps you connect tags to visible page parts.', 'These tools are essential for learning and debugging HTML.'] }
    ]
  },
  {
    slug: 'text-formatting',
    title: 'Bold, Italic, and Text Formatting',
    description: 'Format text with strong, em, mark, and related inline elements for meaning and emphasis.',
    level: 'beginner',
    section: 'Text & Links',
    order: 6,
    minutes: 9,
    content: [
      { type: 'p', text: 'HTML includes inline elements that emphasize or highlight parts of a sentence. Prefer semantic tags that describe meaning, not only appearance.' },
      { type: 'h2', text: 'strong and em' },
      { type: 'p', text: 'Use strong for important text and em for emphasized text. Browsers often show strong as bold and em as italic, but the tags also carry meaning for assistive technology.' },
      {
        type: 'code',
        title: 'Importance and emphasis',
        language: 'html',
        code: `<p>Your password reset link expires in <strong>15 minutes</strong>.</p>
<p>I <em>really</em> enjoyed that workshop.</p>`
      },
      { type: 'h2', text: 'b and i vs strong and em' },
      { type: 'p', text: 'The b and i tags are more presentational. Use strong and em when the meaning matters. Use b or i when you only need a visual style without special importance.' },
      {
        type: 'table',
        headers: ['Element', 'Typical use'],
        rows: [
          ['strong', 'Important warnings or key terms'],
          ['em', 'Stress emphasis in a sentence'],
          ['b', 'Stylistic bold without extra importance'],
          ['i', 'Technical terms, thoughts, or foreign phrases']
        ]
      },
      { type: 'h2', text: 'Other useful inline tags' },
      {
        type: 'code',
        title: 'mark, small, and code',
        language: 'html',
        code: `<p>Search result: <mark>HTML tutorials</mark></p>
<p><small>Prices subject to change.</small></p>
<p>Use the <code>&lt;p&gt;</code> element for paragraphs.</p>`
      },
      { type: 'h2', text: 'Nesting inline elements' },
      { type: 'p', text: 'You can nest inline tags inside paragraphs and headings, but keep markup simple. Do not wrap every word in a formatting tag.' },
      {
        type: 'code',
        title: 'Nested formatting',
        language: 'html',
        code: `<p><strong>Note:</strong> Save your file as <code>index.html</code>.</p>`
      },
      { type: 'tip', text: 'If you only want bold or italic for design, CSS is often the better long-term tool. Use HTML tags when the text has meaning.' },
      { type: 'try', text: 'Write a short product blurb that uses strong once, em once, and code once for a filename or tag name.' },
      { type: 'keypoints', items: ['Prefer strong and em for meaningful emphasis.', 'b and i are more visual than semantic.', 'mark highlights relevant text; code marks code fragments.', 'Keep inline formatting sparse and purposeful.'] }
    ]
  },
  {
    slug: 'lists',
    title: 'Ordered and Unordered Lists',
    description: 'Create bullet lists and numbered lists with ul, ol, and li elements.',
    level: 'beginner',
    section: 'Text & Links',
    order: 7,
    minutes: 9,
    content: [
      { type: 'p', text: 'Lists help readers scan steps, features, and collections of related items. HTML supports unordered lists, ordered lists, and nested lists.' },
      { type: 'h2', text: 'Unordered lists with ul' },
      { type: 'p', text: 'Use ul when order does not matter. Each item is an li element. Browsers usually show bullets.' },
      {
        type: 'code',
        title: 'Unordered list',
        language: 'html',
        code: `<h2>Packing List</h2>
<ul>
  <li>Notebook</li>
  <li>Water bottle</li>
  <li>Headphones</li>
</ul>`
      },
      { type: 'h2', text: 'Ordered lists with ol' },
      { type: 'p', text: 'Use ol when sequence matters, such as recipes or setup steps. Browsers usually show numbers.' },
      {
        type: 'code',
        title: 'Ordered list',
        language: 'html',
        code: `<h2>Make Tea</h2>
<ol>
  <li>Boil water</li>
  <li>Steep the tea bag</li>
  <li>Remove the bag and serve</li>
</ol>`
      },
      { type: 'h2', text: 'Nesting lists' },
      { type: 'p', text: 'You can place a list inside an li to create sub-items. Indent nested lists so the structure stays clear in your source file.' },
      {
        type: 'code',
        title: 'Nested list',
        language: 'html',
        code: `<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </li>
  <li>Backend</li>
</ul>`
      },
      { type: 'h2', text: 'Common list mistakes' },
      { type: 'ul', items: ['Do not put text directly inside ul or ol without an li wrapper.', 'Do not use lists only for indentation; use them for real list content.', 'Keep each li focused on one item.'] },
      { type: 'note', text: 'There is also dl for description lists (term and definition pairs). You will use ul and ol most often at the beginner level.' },
      { type: 'tip', text: 'If you can count the items or rearrange them without changing meaning, you probably want a list element instead of separate paragraphs.' },
      { type: 'try', text: 'Create a page with one unordered packing list and one ordered morning routine list, each with at least four items.' },
      { type: 'keypoints', items: ['ul is for unordered items; ol is for sequenced steps.', 'Every list item must be an li.', 'Lists can nest inside list items.', 'Use lists for real collections, not for layout tricks.'] }
    ]
  },
  {
    slug: 'links-anchors',
    title: 'Links and Anchors',
    description: 'Connect pages and sections with anchor elements, href values, and link targets.',
    level: 'beginner',
    section: 'Text & Links',
    order: 8,
    minutes: 11,
    content: [
      { type: 'p', text: 'Links make the web work. The a element creates a hyperlink to another page, a file, an email address, or a place on the same page.' },
      { type: 'h2', text: 'Basic links with href' },
      { type: 'p', text: 'The href attribute holds the destination URL or path. The text between the opening and closing a tags is what users click.' },
      {
        type: 'code',
        title: 'Absolute and relative links',
        language: 'html',
        code: `<a href="https://example.com">Example website</a>
<a href="about.html">About page</a>
<a href="/contact.html">Contact page</a>`
      },
      { type: 'h2', text: 'Absolute vs relative URLs' },
      {
        type: 'table',
        headers: ['Type', 'Example', 'Meaning'],
        rows: [
          ['Absolute', 'https://example.com/page', 'Full address including protocol and domain'],
          ['Relative', 'about.html', 'Path relative to the current page'],
          ['Root-relative', '/contact.html', 'Path from the site root']
        ]
      },
      { type: 'h2', text: 'Same-page anchors' },
      { type: 'p', text: 'Give a target element an id, then link to it with a hash. This is useful for tables of contents and "Back to top" links.' },
      {
        type: 'code',
        title: 'In-page anchor links',
        language: 'html',
        code: `<a href="#projects">Jump to projects</a>

<h2 id="projects">Projects</h2>
<p>Selected work appears below.</p>

<a href="#top">Back to top</a>`
      },
      { type: 'h2', text: 'Opening links in a new tab' },
      { type: 'p', text: 'target="_blank" opens a link in a new browsing context. When you use it, also add rel="noopener noreferrer" for safer behavior.' },
      {
        type: 'code',
        title: 'External link in a new tab',
        language: 'html',
        code: `<a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">
  MDN Web Docs
</a>`
      },
      { type: 'h2', text: 'Email and phone links' },
      {
        type: 'code',
        title: 'mailto and tel',
        language: 'html',
        code: `<a href="mailto:hello@example.com">Email us</a>
<a href="tel:+15551234567">Call us</a>`
      },
      { type: 'tip', text: 'Write link text that makes sense out of context. Prefer "View pricing" over vague phrases like "Click here".' },
      { type: 'try', text: 'Build a tiny three-page mini site (home, about, contact) with relative links between them and one in-page jump link on the home page.' },
      { type: 'keypoints', items: ['Use a with href to create links.', 'Relative paths are great for linking pages in your own site.', 'Hash links jump to elements with matching ids.', 'Use clear link text and careful target="_blank" attributes.'] }
    ]
  },
  {
    slug: 'images',
    title: 'Images with img',
    description: 'Add images with the img element, including src, alt, width, and height attributes.',
    level: 'beginner',
    section: 'Text & Links',
    order: 9,
    minutes: 10,
    content: [
      { type: 'p', text: 'Images make pages clearer and more engaging. In HTML, the img element embeds an image in the document.' },
      { type: 'h2', text: 'Required pieces: src and alt' },
      { type: 'p', text: 'src tells the browser where to find the image file. alt provides alternative text for screen readers and for cases when the image cannot load.' },
      {
        type: 'code',
        title: 'Basic image',
        language: 'html',
        code: `<img src="photos/team.jpg" alt="Three teammates collaborating at a whiteboard">`
      },
      { type: 'h2', text: 'Writing good alt text' },
      { type: 'ul', items: ['Describe the purpose of the image in context.', 'Keep it concise but useful.', 'Use alt="" for purely decorative images that add no information.', 'Do not start with "image of" unless that phrasing truly helps.'] },
      {
        type: 'code',
        title: 'Meaningful vs decorative',
        language: 'html',
        code: `<img src="chart-sales.png" alt="Bar chart showing sales rising from January to June">
<img src="divider.svg" alt="">`
      },
      { type: 'h2', text: 'Width and height' },
      { type: 'p', text: 'You can set width and height to help the browser reserve space before the image loads. Use the intrinsic pixel values when possible.' },
      {
        type: 'code',
        title: 'Image with dimensions',
        language: 'html',
        code: `<img
  src="logo.png"
  alt="Northwind Cafe logo"
  width="160"
  height="48"
>`
      },
      { type: 'h2', text: 'File paths and formats' },
      { type: 'p', text: 'Common web image formats include JPG/JPEG for photos, PNG for graphics with transparency, SVG for icons and logos, and WebP for efficient modern images.' },
      {
        type: 'table',
        headers: ['Format', 'Good for'],
        rows: [
          ['JPG / JPEG', 'Photographs'],
          ['PNG', 'Graphics with transparency'],
          ['SVG', 'Icons, logos, simple illustrations'],
          ['WebP', 'Efficient photos and graphics']
        ]
      },
      { type: 'note', text: 'img is a void element. It has no closing tag and no text content between tags.' },
      { type: 'tip', text: 'If an image is important content, put meaningful information nearby in text too. Do not rely on the image alone.' },
      { type: 'try', text: 'Add two images to a page: one photo with descriptive alt text and one decorative divider with an empty alt attribute.' },
      { type: 'keypoints', items: ['img needs src and should almost always include alt.', 'Alt text describes meaning and purpose, not only appearance.', 'width and height help reduce layout jumps while images load.', 'Choose image formats that fit the content type.'] }
    ]
  },
  {
    slug: 'figure-caption',
    title: 'Figures and Captions',
    description: 'Group images or media with captions using figure and figcaption.',
    level: 'beginner',
    section: 'Text & Links',
    order: 10,
    minutes: 8,
    content: [
      { type: 'p', text: 'When an image, diagram, or code sample needs its own caption, wrap it in a figure element and add a figcaption.' },
      { type: 'h2', text: 'Why figure exists' },
      { type: 'p', text: 'A figure is self-contained content that can be moved or referenced without breaking the main flow of the article. Captions explain what the reader is looking at.' },
      {
        type: 'code',
        title: 'Image with caption',
        language: 'html',
        code: `<figure>
  <img src="bridge.jpg" alt="Steel bridge over a river at sunset" width="640" height="400">
  <figcaption>Fig. 1 - Sunset view from the east walkway.</figcaption>
</figure>`
      },
      { type: 'h2', text: 'Where to place figcaption' },
      { type: 'p', text: 'figcaption can appear as the first or last child of figure. Choose one style and stay consistent in a project.' },
      {
        type: 'code',
        title: 'Caption above the image',
        language: 'html',
        code: `<figure>
  <figcaption>Weekly traffic by device</figcaption>
  <img src="traffic-chart.png" alt="Pie chart of desktop, mobile, and tablet traffic">
</figure>`
      },
      { type: 'h2', text: 'Figures are not only for images' },
      { type: 'p', text: 'You can caption code samples, quotes, audio, or video. The pattern is the same: group the media and its caption inside figure.' },
      {
        type: 'code',
        title: 'Figure around a code sample',
        language: 'html',
        code: `<figure>
  <pre><code>&lt;p&gt;Hello&lt;/p&gt;</code></pre>
  <figcaption>A minimal paragraph element.</figcaption>
</figure>`
      },
      { type: 'note', text: 'Not every image needs a figure. Use figure when the caption is part of the content unit. A logo in the header usually does not need figure.' },
      { type: 'tip', text: 'Keep alt text focused on the image itself. Put longer explanation or credit information in figcaption.' },
      { type: 'try', text: 'Create a short article with one figure that includes an image, descriptive alt text, and a caption that names the location or source.' },
      { type: 'keypoints', items: ['figure groups self-contained media with an optional caption.', 'figcaption provides the visible caption text.', 'Use figure when the caption belongs with the media unit.', 'Alt text and captions serve related but different jobs.'] }
    ]
  },
  {
    slug: 'block-vs-inline',
    title: 'Block vs Inline Elements',
    description: 'Understand how block-level and inline elements flow differently on a page.',
    level: 'beginner',
    section: 'Page Structure',
    order: 11,
    minutes: 10,
    content: [
      { type: 'p', text: 'HTML elements generally behave as block or inline by default. Knowing the difference helps you predict layout and nest tags correctly.' },
      { type: 'h2', text: 'Block-level elements' },
      { type: 'p', text: 'Block elements usually start on a new line and take the full available width. Examples include h1-h6, p, ul, ol, div, section, and article.' },
      {
        type: 'code',
        title: 'Blocks stack vertically',
        language: 'html',
        code: `<h1>Travel Journal</h1>
<p>Day one in Lisbon.</p>
<p>Day two at the coast.</p>`
      },
      { type: 'h2', text: 'Inline elements' },
      { type: 'p', text: 'Inline elements flow within a line of text and only take as much width as needed. Examples include a, strong, em, span, img, and code.' },
      {
        type: 'code',
        title: 'Inline elements inside a paragraph',
        language: 'html',
        code: `<p>
  Read the <a href="guide.html">beginner guide</a> and note the
  <strong>key terms</strong> in each section.
</p>`
      },
      { type: 'h2', text: 'Nesting rules to remember' },
      { type: 'ul', items: ['Inline elements can live inside block elements.', 'Block elements generally should not go inside inline elements.', 'A paragraph should not contain other block elements like div or ul.'] },
      {
        type: 'code',
        title: 'Valid nesting example',
        language: 'html',
        code: `<!-- Good -->
<p>Contact <a href="mailto:hi@example.com">hi@example.com</a> today.</p>

<!-- Avoid putting a block inside a paragraph -->
<!-- <p><div>Oops</div></p> -->`
      },
      { type: 'h2', text: 'Default behavior can change with CSS' },
      { type: 'p', text: 'CSS can change display behavior, but HTML defaults still matter for readable markup and accessibility. Start with the natural element for the content.' },
      {
        type: 'table',
        headers: ['Category', 'Examples', 'Default flow'],
        rows: [
          ['Block', 'p, h2, ul, section', 'New line, full width'],
          ['Inline', 'a, strong, span', 'Flows with text'],
          ['Inline replaced', 'img', 'Flows with text but has intrinsic size']
        ]
      },
      { type: 'tip', text: 'If something should be its own chunk of content, choose a block element. If it is part of a sentence, choose an inline element.' },
      { type: 'try', text: 'Write one paragraph that includes a link and strong text, then add a separate unordered list below it. Confirm you did not put the list inside the paragraph.' },
      { type: 'keypoints', items: ['Block elements stack and usually take full width.', 'Inline elements flow inside text.', 'Do not put blocks inside paragraphs or anchors casually.', 'Choose elements for meaning first; CSS can adjust display later.'] }
    ]
  },
  {
    slug: 'semantic-intro',
    title: 'Semantic HTML Intro',
    description: 'Learn why semantic elements make pages clearer for people, browsers, and assistive tools.',
    level: 'beginner',
    section: 'Page Structure',
    order: 12,
    minutes: 9,
    content: [
      { type: 'p', text: 'Semantic HTML means choosing elements that describe the meaning of content. A header, nav, and article tell more than a page full of anonymous div tags.' },
      { type: 'h2', text: 'Why semantics matter' },
      { type: 'ul', items: ['Screen readers can announce landmarks and skip to main content.', 'Search engines better understand page structure.', 'Your teammates can read the markup faster.', 'CSS and JavaScript hooks become clearer.'] },
      { type: 'h2', text: 'Non-semantic vs semantic' },
      {
        type: 'code',
        title: 'Less semantic',
        language: 'html',
        code: `<div class="top">
  <div class="menu">...</div>
</div>
<div class="content">
  <div class="post">...</div>
</div>`
      },
      {
        type: 'code',
        title: 'More semantic',
        language: 'html',
        code: `<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
</main>`
      },
      { type: 'h2', text: 'Common semantic building blocks' },
      {
        type: 'table',
        headers: ['Element', 'Meaning'],
        rows: [
          ['header', 'Introductory or navigational content for a page or section'],
          ['nav', 'Primary navigation links'],
          ['main', 'Dominant unique content of the page'],
          ['article', 'Self-contained composition'],
          ['section', 'Thematic grouping of content'],
          ['aside', 'Side content related to nearby content'],
          ['footer', 'Footer for a page or section']
        ]
      },
      { type: 'note', text: 'Semantic tags do not magically style a page. They describe structure. You still use CSS for appearance.' },
      { type: 'h2', text: 'A practical mindset' },
      { type: 'p', text: 'Ask: "What is this content?" If it is navigation, use nav. If it is the main page story, use main and article. Reach for div only when no better element fits.' },
      { type: 'tip', text: 'You do not need every semantic element on every page. Use the ones that match real content regions.' },
      { type: 'try', text: 'Sketch a blog homepage on paper and label regions as header, nav, main, article, aside, and footer before writing any CSS.' },
      { type: 'keypoints', items: ['Semantic HTML describes meaning, not just boxes.', 'Landmarks improve accessibility and clarity.', 'Prefer specific elements over generic divs when they fit.', 'Semantics and CSS solve different problems.'] }
    ]
  },
  {
    slug: 'header-nav-main',
    title: 'header, nav, and main',
    description: 'Build page landmarks with header, navigation, and main content regions.',
    level: 'beginner',
    section: 'Page Structure',
    order: 13,
    minutes: 10,
    content: [
      { type: 'p', text: 'Most pages share a familiar top-level layout: a header with branding and navigation, plus a main region for the unique page content.' },
      { type: 'h2', text: 'The header element' },
      { type: 'p', text: 'header often contains the site name, logo, and top navigation. A header can also introduce an article or section, but beginners usually start with a page-level header.' },
      {
        type: 'code',
        title: 'Page header',
        language: 'html',
        code: `<header>
  <h1>River Studio</h1>
  <p>Design notes and project updates</p>
</header>`
      },
      { type: 'h2', text: 'The nav element' },
      { type: 'p', text: 'nav wraps major navigation blocks. You do not need to put every link on the page inside nav - reserve it for primary navigation menus.' },
      {
        type: 'code',
        title: 'Navigation links',
        language: 'html',
        code: `<nav aria-label="Primary">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/projects.html">Projects</a></li>
    <li><a href="/contact.html">Contact</a></li>
  </ul>
</nav>`
      },
      { type: 'h2', text: 'The main element' },
      { type: 'p', text: 'main holds the dominant content that is unique to the page. There should be only one main element visible per page.' },
      {
        type: 'code',
        title: 'header, nav, and main together',
        language: 'html',
        code: `<header>
  <h1>River Studio</h1>
  <nav aria-label="Primary">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about.html">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <h2>Welcome</h2>
  <p>We document process, prototypes, and finished work.</p>
</main>`
      },
      { type: 'note', text: 'Skip links and screen reader landmark navigation often rely on a clear main region. Using main is a small change with a big accessibility benefit.' },
      { type: 'tip', text: 'If navigation sits in the header visually, you can nest nav inside header. That is a common and valid pattern.' },
      { type: 'try', text: 'Rebuild a simple homepage shell with header (site title), nav (three links), and main (heading plus paragraph).' },
      { type: 'keypoints', items: ['header introduces a page or section.', 'nav marks major navigation groups.', 'main wraps the unique primary content.', 'Use one main landmark per page.'] }
    ]
  },
  {
    slug: 'section-article',
    title: 'section and article',
    description: 'Group thematic content with section and self-contained pieces with article.',
    level: 'beginner',
    section: 'Page Structure',
    order: 14,
    minutes: 10,
    content: [
      { type: 'p', text: 'section and article help you organize content inside main. They look similar at first, but they signal different kinds of grouping.' },
      { type: 'h2', text: 'When to use section' },
      { type: 'p', text: 'Use section for a thematic group of content, usually with its own heading. Examples include "Features", "Pricing", or "FAQs" on a landing page.' },
      {
        type: 'code',
        title: 'Sections with headings',
        language: 'html',
        code: `<main>
  <h1>Course Overview</h1>

  <section>
    <h2>What you will learn</h2>
    <p>HTML structure, links, images, and forms.</p>
  </section>

  <section>
    <h2>Who this is for</h2>
    <p>Beginners building their first web pages.</p>
  </section>
</main>`
      },
      { type: 'h2', text: 'When to use article' },
      { type: 'p', text: 'Use article for self-contained content that still makes sense on its own, such as a blog post, news story, or product card that could be syndicated.' },
      {
        type: 'code',
        title: 'Articles in a list',
        language: 'html',
        code: `<section>
  <h2>Latest posts</h2>

  <article>
    <h3>Learning semantic HTML</h3>
    <p>Start with landmarks, then refine each region.</p>
  </article>

  <article>
    <h3>Accessible images</h3>
    <p>Write alt text that supports the page goal.</p>
  </article>
</section>`
      },
      { type: 'h2', text: 'Choosing between them' },
      {
        type: 'table',
        headers: ['Question', 'Prefer'],
        rows: [
          ['Is this a thematic chapter of the page?', 'section'],
          ['Could this piece stand alone elsewhere?', 'article'],
          ['Is it only a styling wrapper?', 'div instead']
        ]
      },
      { type: 'note', text: 'An article can contain sections, and a section can contain articles. Nest based on meaning, not on a fixed formula.' },
      { type: 'tip', text: 'If a region has no natural heading, ask whether it is really a section. Many sections should have a heading.' },
      { type: 'try', text: 'Create a news page with one section titled "Today" that contains two short article elements, each with a heading and paragraph.' },
      { type: 'keypoints', items: ['section groups thematic content, usually with a heading.', 'article marks self-contained compositions.', 'You can nest articles and sections when meaning requires it.', 'Do not use section or article as generic styling boxes.'] }
    ]
  },
  {
    slug: 'aside-footer',
    title: 'aside and footer',
    description: 'Add complementary side content and footers with aside and footer elements.',
    level: 'beginner',
    section: 'Page Structure',
    order: 15,
    minutes: 9,
    content: [
      { type: 'p', text: 'aside and footer complete a typical page landmark set. They give related side content and closing information a clear home.' },
      { type: 'h2', text: 'The aside element' },
      { type: 'p', text: 'aside is for content that relates to the surrounding content but could be separated from it. Common examples include related links, pull quotes, definitions, or a sidebar of tips.' },
      {
        type: 'code',
        title: 'Article with related aside',
        language: 'html',
        code: `<article>
  <h2>Choosing heading levels</h2>
  <p>Use headings to outline your document.</p>

  <aside>
    <h3>Related tip</h3>
    <p>Prefer one h1 for the main page topic.</p>
  </aside>
</article>`
      },
      { type: 'h2', text: 'Sidebars vs asides' },
      { type: 'p', text: 'A visual sidebar is a design choice. Use aside when the content is complementary. If the sidebar is primary content, a section or another structure may fit better.' },
      { type: 'h2', text: 'The footer element' },
      { type: 'p', text: 'footer typically contains copyright notes, secondary links, contact details, or authorship information. A page can have a site footer, and articles can have their own footers.' },
      {
        type: 'code',
        title: 'Page footer',
        language: 'html',
        code: `<footer>
  <p>&copy; 2026 River Studio</p>
  <nav aria-label="Footer">
    <a href="/privacy.html">Privacy</a>
    <a href="/contact.html">Contact</a>
  </nav>
</footer>`
      },
      { type: 'h2', text: 'Putting landmarks together' },
      {
        type: 'code',
        title: 'Simple semantic page shell',
        language: 'html',
        code: `<header>
  <h1>Daily Notes</h1>
  <nav aria-label="Primary">
    <a href="/">Home</a>
    <a href="/archive.html">Archive</a>
  </nav>
</header>

<main>
  <article>
    <h2>Monday</h2>
    <p>Practiced HTML landmarks.</p>
    <aside>
      <p>Next up: forms.</p>
    </aside>
  </article>
</main>

<footer>
  <p>Built for learning.</p>
</footer>`
      },
      { type: 'tip', text: 'Footer navigation is still navigation. A nested nav inside footer is valid when you have a distinct set of footer links.' },
      { type: 'try', text: 'Extend a page shell with an aside of related resources and a footer that includes copyright text plus two links.' },
      { type: 'keypoints', items: ['aside holds complementary related content.', 'footer closes a page or a section with supporting info.', 'Articles and pages can both have footers.', 'Landmark elements make page regions easier to navigate.'] }
    ]
  },
  {
    slug: 'div-span',
    title: 'When to Use div and span',
    description: 'Learn the right role for generic div and span containers after semantic options.',
    level: 'beginner',
    section: 'Page Structure',
    order: 16,
    minutes: 9,
    content: [
      { type: 'p', text: 'div and span are generic containers. They have no special meaning by themselves. Use them when you need a hook for styling or scripting and no semantic element fits better.' },
      { type: 'h2', text: 'div for block-level grouping' },
      { type: 'p', text: 'div is a block-level generic box. It is useful for layout wrappers, card shells used only for CSS, or grouping elements that do not form a landmark or article.' },
      {
        type: 'code',
        title: 'div as a layout wrapper',
        language: 'html',
        code: `<div class="card-row">
  <article class="card">
    <h2>Course A</h2>
    <p>HTML foundations.</p>
  </article>
  <article class="card">
    <h2>Course B</h2>
    <p>CSS layout.</p>
  </article>
</div>`
      },
      { type: 'h2', text: 'span for inline grouping' },
      { type: 'p', text: 'span is an inline generic box. Use it to style or target part of a sentence when strong, em, code, or another semantic tag is not appropriate.' },
      {
        type: 'code',
        title: 'span inside text',
        language: 'html',
        code: `<p>Status: <span class="status-ok">Available</span></p>`
      },
      { type: 'h2', text: 'A simple decision guide' },
      {
        type: 'ol',
        items: [
          'Ask what the content means.',
          'Choose a semantic element if one fits (nav, main, article, p, strong, and so on).',
          'If nothing fits and you only need a styling or script hook, use div (block) or span (inline).'
        ]
      },
      {
        type: 'table',
        headers: ['Need', 'Prefer'],
        rows: [
          ['Primary page content', 'main'],
          ['Self-contained post', 'article'],
          ['Important phrase', 'strong'],
          ['Style-only inline target', 'span'],
          ['Style-only block wrapper', 'div']
        ]
      },
      { type: 'warning', text: 'A page built only from div and span is harder to maintain and often worse for accessibility. Start semantic, then add generics as needed.' },
      { type: 'tip', text: 'Class names on div and span should describe purpose (for example, card-row or status-ok), not only appearance details that may change.' },
      { type: 'try', text: 'Refactor a small markup snippet that overuses divs. Replace regions with header, main, and article where possible, and leave one div only as a CSS wrapper.' },
      { type: 'keypoints', items: ['div is a generic block container; span is a generic inline container.', 'Prefer semantic elements when they match the content.', 'Use div/span for styling or scripting hooks without extra meaning.', 'Avoid div soup by choosing landmarks and text elements first.'] }
    ]
  },
  {
    slug: 'forms-intro',
    title: 'Forms Intro',
    description: 'Learn what HTML forms are and how form, input, and submit pieces work together.',
    level: 'beginner',
    section: 'Forms Basics',
    order: 17,
    minutes: 10,
    content: [
      { type: 'p', text: 'Forms collect information from users: search queries, sign-up details, feedback, and more. In HTML, the form element groups controls that can be submitted together.' },
      { type: 'h2', text: 'The form element' },
      { type: 'p', text: 'A form wraps fields and buttons. Later you will add action and method attributes to control where and how data is sent. For now, focus on structure.' },
      {
        type: 'code',
        title: 'Minimal form shell',
        language: 'html',
        code: `<form>
  <label for="email">Email</label>
  <input id="email" name="email" type="email">

  <button type="submit">Subscribe</button>
</form>`
      },
      { type: 'h2', text: 'Key building blocks' },
      { type: 'ul', items: ['form: groups controls for submission', 'label: names a control for users and assistive tech', 'input: single-line fields and many other controls', 'button: actions such as submit or reset', 'name: identifies each value when the form is submitted'] },
      { type: 'h2', text: 'name attributes matter' },
      { type: 'p', text: 'When a form is submitted, successful controls send their values using the name attribute as the key. Without name, a field may not be included in the submitted data.' },
      {
        type: 'code',
        title: 'Named fields',
        language: 'html',
        code: `<form>
  <label for="q">Search</label>
  <input id="q" name="q" type="search">
  <button type="submit">Go</button>
</form>`
      },
      { type: 'h2', text: 'What happens on submit' },
      { type: 'p', text: 'By default, submitting a form sends data to the current page using a GET-style query string unless you configure action and method. Browsers also handle basic keyboard behavior, such as submitting with Enter in many text fields.' },
      { type: 'note', text: 'HTML forms can work without JavaScript. Client-side scripts can enhance validation and user experience, but the basics start with HTML.' },
      { type: 'tip', text: 'Build the labels and fields first. Add styling and advanced validation after the structure is clear and accessible.' },
      { type: 'try', text: 'Create a newsletter form with an email field, a name field, and a submit button. Make sure every input has a label and a name.' },
      { type: 'keypoints', items: ['form groups controls that submit together.', 'Labels, inputs, and buttons are the core pieces.', 'name identifies values in submitted data.', 'Forms can function with plain HTML before JavaScript is added.'] }
    ]
  },
  {
    slug: 'input-types',
    title: 'Common Input Types',
    description: 'Explore useful input types such as text, email, password, number, checkbox, and radio.',
    level: 'beginner',
    section: 'Forms Basics',
    order: 18,
    minutes: 11,
    content: [
      { type: 'p', text: 'The input element supports many type values. Choosing the right type improves mobile keyboards, built-in validation hints, and clarity for users.' },
      { type: 'h2', text: 'Text-like inputs' },
      {
        type: 'code',
        title: 'text, email, password, and search',
        language: 'html',
        code: `<label for="name">Name</label>
<input id="name" name="name" type="text">

<label for="email">Email</label>
<input id="email" name="email" type="email">

<label for="password">Password</label>
<input id="password" name="password" type="password">

<label for="q">Search</label>
<input id="q" name="q" type="search">`
      },
      { type: 'h2', text: 'Numbers and dates' },
      {
        type: 'code',
        title: 'number and date',
        language: 'html',
        code: `<label for="seats">Seats</label>
<input id="seats" name="seats" type="number" min="1" max="10">

<label for="day">Date</label>
<input id="day" name="day" type="date">`
      },
      { type: 'h2', text: 'Checkboxes and radio buttons' },
      { type: 'p', text: 'Checkboxes allow multiple selections. Radio buttons belong to a group that shares the same name and allow one selection.' },
      {
        type: 'code',
        title: 'checkbox and radio',
        language: 'html',
        code: `<fieldset>
  <legend>Interests</legend>
  <label><input type="checkbox" name="interests" value="html"> HTML</label>
  <label><input type="checkbox" name="interests" value="css"> CSS</label>
</fieldset>

<fieldset>
  <legend>Experience</legend>
  <label><input type="radio" name="level" value="beginner" checked> Beginner</label>
  <label><input type="radio" name="level" value="intermediate"> Intermediate</label>
</fieldset>`
      },
      { type: 'h2', text: 'Other helpful types' },
      {
        type: 'table',
        headers: ['type', 'Typical use'],
        rows: [
          ['url', 'Website addresses'],
          ['tel', 'Phone numbers'],
          ['file', 'File uploads'],
          ['hidden', 'Values sent but not shown'],
          ['submit', 'Submit control (button is often clearer)']
        ]
      },
      { type: 'note', text: 'Browser support and UI for date, color, and similar types can vary. Still, choosing a meaningful type is better than using text for everything.' },
      { type: 'tip', text: 'For grouped checkboxes, reuse the same name and give each control a distinct value so every selected option can be identified.' },
      { type: 'try', text: 'Build a registration form that uses text, email, password, number, one checkbox group, and one radio group.' },
      { type: 'keypoints', items: ['type changes input behavior and on-screen keyboards.', 'email, password, number, and date cover many common needs.', 'Checkboxes allow many selections; radios allow one per name group.', 'fieldset and legend help label related control groups.'] }
    ]
  },
  {
    slug: 'labels-buttons',
    title: 'Labels and Buttons',
    description: 'Connect labels to controls correctly and choose the right button types for forms.',
    level: 'beginner',
    section: 'Forms Basics',
    order: 19,
    minutes: 10,
    content: [
      { type: 'p', text: 'Labels and buttons make forms usable. A label tells users what a field is for, and a button triggers an action such as submit or reset.' },
      { type: 'h2', text: 'Explicit labels with for and id' },
      { type: 'p', text: 'The most reliable pattern is pairing label for with the input id. Clicking the label focuses the control, which helps mouse, touch, and assistive technology users.' },
      {
        type: 'code',
        title: 'Explicit label pairing',
        language: 'html',
        code: `<label for="username">Username</label>
<input id="username" name="username" type="text">`
      },
      { type: 'h2', text: 'Wrapping labels' },
      { type: 'p', text: 'You can also wrap the control inside the label. This is common for checkboxes and radios.' },
      {
        type: 'code',
        title: 'Label wrapping a checkbox',
        language: 'html',
        code: `<label>
  <input type="checkbox" name="terms" value="yes">
  I agree to the terms
</label>`
      },
      { type: 'h2', text: 'Button types' },
      {
        type: 'table',
        headers: ['Button type', 'Behavior'],
        rows: [
          ['submit', 'Sends the form (default inside a form)'],
          ['button', 'No default form action; often used with JavaScript'],
          ['reset', 'Resets fields to initial values (use carefully)']
        ]
      },
      {
        type: 'code',
        title: 'Buttons in a form',
        language: 'html',
        code: `<form>
  <label for="email">Email</label>
  <input id="email" name="email" type="email">

  <button type="submit">Save</button>
  <button type="button">Validate</button>
  <button type="reset">Clear</button>
</form>`
      },
      { type: 'warning', text: 'Reset buttons can erase user work by accident. Many modern forms omit reset or place it carefully with confirmation.' },
      { type: 'h2', text: 'Button text vs input submit' },
      { type: 'p', text: 'You can use <button type="submit"> or <input type="submit">. The button element is usually preferred because it can contain richer text and is easier to style consistently.' },
      {
        type: 'code',
        title: 'Preferred submit button',
        language: 'html',
        code: `<button type="submit">Create account</button>`
      },
      { type: 'tip', text: 'Visible label text should match what users call the information. Avoid placeholder-only labeling; placeholders disappear when typing.' },
      { type: 'try', text: 'Build a login form with labeled username and password fields, a submit button, and a separate type="button" that does nothing yet.' },
      { type: 'keypoints', items: ['Connect labels with for/id or by wrapping the control.', 'Labels improve usability and accessibility.', 'Use type="submit", type="button", and type="reset" intentionally.', 'Prefer button elements for clearer submit controls.'] }
    ]
  },
  {
    slug: 'textarea-select',
    title: 'Textarea and Select',
    description: 'Collect longer text with textarea and choose options with select and option elements.',
    level: 'beginner',
    section: 'Forms Basics',
    order: 20,
    minutes: 10,
    content: [
      { type: 'p', text: 'Not every answer fits in a single-line input. textarea handles multi-line text, and select presents a list of predefined choices.' },
      { type: 'h2', text: 'Multi-line text with textarea' },
      { type: 'p', text: 'Unlike input, textarea is not a void element. Put the default text between the opening and closing tags if you need a starting value.' },
      {
        type: 'code',
        title: 'Feedback textarea',
        language: 'html',
        code: `<label for="feedback">Feedback</label>
<textarea id="feedback" name="feedback" rows="5" cols="40" placeholder="Tell us what you think"></textarea>`
      },
      { type: 'h2', text: 'Dropdowns with select' },
      { type: 'p', text: 'select contains option elements. The selected option\'s value is submitted with the field name.' },
      {
        type: 'code',
        title: 'Basic select menu',
        language: 'html',
        code: `<label for="country">Country</label>
<select id="country" name="country">
  <option value="">Choose one</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
  <option value="gb">United Kingdom</option>
</select>`
      },
      { type: 'h2', text: 'option groups and defaults' },
      {
        type: 'code',
        title: 'optgroup and selected',
        language: 'html',
        code: `<label for="topic">Topic</label>
<select id="topic" name="topic">
  <optgroup label="Frontend">
    <option value="html" selected>HTML</option>
    <option value="css">CSS</option>
  </optgroup>
  <optgroup label="Backend">
    <option value="node">Node.js</option>
    <option value="python">Python</option>
  </optgroup>
</select>`
      },
      { type: 'h2', text: 'Multiple selections' },
      { type: 'p', text: 'Adding the multiple attribute lets users choose more than one option. This can be harder to use on some devices, so checkboxes are sometimes clearer for multi-select lists.' },
      {
        type: 'code',
        title: 'Multiple select',
        language: 'html',
        code: `<label for="skills">Skills</label>
<select id="skills" name="skills" multiple size="4">
  <option value="html">HTML</option>
  <option value="css">CSS</option>
  <option value="js">JavaScript</option>
</select>`
      },
      { type: 'note', text: 'rows and cols on textarea suggest size, but CSS usually controls the final visual dimensions in modern layouts.' },
      { type: 'tip', text: 'Always include a clear label above select menus. The first option can be a prompt like "Choose one" with an empty value when a choice is required.' },
      { type: 'try', text: 'Create a contact form with a short text input for subject, a textarea for message, and a select for urgency (low, normal, high).' },
      { type: 'keypoints', items: ['textarea collects multi-line text between its tags.', 'select and option create dropdown choices.', 'optgroup can organize long option lists.', 'multiple select is powerful but not always the most usable UI.'] }
    ]
  },
  {
    slug: 'form-attributes',
    title: 'Form Attributes (action, method)',
    description: 'Control where form data goes and how it is sent with action, method, and related attributes.',
    level: 'beginner',
    section: 'Forms Basics',
    order: 21,
    minutes: 11,
    content: [
      { type: 'p', text: 'The form element can declare where data is sent and which HTTP method to use. Understanding action and method is essential before you connect forms to a server.' },
      { type: 'h2', text: 'action: where data goes' },
      { type: 'p', text: 'action is the URL that receives the form submission. It can be a relative path on your site or an absolute URL.' },
      {
        type: 'code',
        title: 'Form with action',
        language: 'html',
        code: `<form action="/subscribe" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>
  <button type="submit">Join</button>
</form>`
      },
      { type: 'h2', text: 'method: GET vs POST' },
      {
        type: 'table',
        headers: ['method', 'What it does', 'Common use'],
        rows: [
          ['get', 'Appends data to the URL as a query string', 'Search forms and filters'],
          ['post', 'Sends data in the request body', 'Sign-up, login, and data changes']
        ]
      },
      {
        type: 'code',
        title: 'GET search form',
        language: 'html',
        code: `<form action="/search" method="get">
  <label for="q">Search</label>
  <input id="q" name="q" type="search">
  <button type="submit">Search</button>
</form>`
      },
      { type: 'h2', text: 'Useful companion attributes' },
      { type: 'ul', items: ['required: browser blocks submit if the field is empty', 'placeholder: hint text inside an empty field (not a label replacement)', 'autocomplete: helps browsers suggest known values', 'novalidate on form: skips built-in browser validation'] },
      {
        type: 'code',
        title: 'required and autocomplete',
        language: 'html',
        code: `<form action="/checkout" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required autocomplete="email">

  <label for="name">Full name</label>
  <input id="name" name="name" type="text" required autocomplete="name">

  <button type="submit">Continue</button>
</form>`
      },
      { type: 'note', text: 'If action is omitted, the form submits to the current page URL. If method is omitted, browsers default to GET.' },
      { type: 'warning', text: 'Never send sensitive data with GET. Query strings can appear in browser history, logs, and referrer headers.' },
      { type: 'tip', text: 'Match method to intent: GET for reading/filtering, POST for creating or changing data.' },
      { type: 'try', text: 'Write two forms: a GET search form that posts to /search, and a POST profile form that posts to /profile with required email and name fields.' },
      { type: 'keypoints', items: ['action sets the submission URL.', 'GET puts data in the URL; POST puts data in the request body.', 'Use POST for sensitive or state-changing submissions.', 'required and autocomplete improve real-world form quality.'] }
    ]
  },
  {
    slug: 'tables-basics',
    title: 'Tables Basics',
    description: 'Present tabular data with table, thead, tbody, tr, th, and td elements.',
    level: 'beginner',
    section: 'First Pages',
    order: 22,
    minutes: 11,
    content: [
      { type: 'p', text: 'HTML tables are for tabular data: information that belongs in rows and columns. Do not use tables to build page layouts.' },
      { type: 'h2', text: 'Core table elements' },
      { type: 'ul', items: ['table: the whole table', 'tr: a table row', 'th: a header cell', 'td: a data cell', 'thead / tbody: optional groups for header and body rows'] },
      {
        type: 'code',
        title: 'Simple data table',
        language: 'html',
        code: `<table>
  <thead>
    <tr>
      <th>Course</th>
      <th>Level</th>
      <th>Hours</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>HTML Beginner</td>
      <td>Beginner</td>
      <td>8</td>
    </tr>
    <tr>
      <td>CSS Layout</td>
      <td>Beginner</td>
      <td>6</td>
    </tr>
  </tbody>
</table>`
      },
      { type: 'h2', text: 'Header cells and scope' },
      { type: 'p', text: 'Use th for headers and add scope when it helps clarify whether a header labels a column or a row.' },
      {
        type: 'code',
        title: 'scope on headers',
        language: 'html',
        code: `<table>
  <tr>
    <th scope="col">Day</th>
    <th scope="col">Topic</th>
  </tr>
  <tr>
    <th scope="row">Monday</th>
    <td>Headings</td>
  </tr>
  <tr>
    <th scope="row">Tuesday</th>
    <td>Links</td>
  </tr>
</table>`
      },
      { type: 'h2', text: 'Captions for tables' },
      { type: 'p', text: 'The caption element gives the table a title. Place it as the first child inside table.' },
      {
        type: 'code',
        title: 'Table with caption',
        language: 'html',
        code: `<table>
  <caption>Workshop schedule</caption>
  <tr>
    <th scope="col">Time</th>
    <th scope="col">Session</th>
  </tr>
  <tr>
    <td>10:00</td>
    <td>HTML landmarks</td>
  </tr>
</table>`
      },
      { type: 'note', text: 'Screen readers announce table structure. Clear headers and captions make data tables much easier to understand.' },
      { type: 'warning', text: 'Avoid layout tables. Use semantic regions and CSS for page structure and visual arrangement.' },
      { type: 'tip', text: 'If you can describe the content as "a grid of comparable values", a table is probably the right element.' },
      { type: 'try', text: 'Build a 3-column table of your weekly study plan with a caption, column headers, and at least three data rows.' },
      { type: 'keypoints', items: ['Tables are for data, not page layout.', 'Use th for headers and td for data cells.', 'thead, tbody, and caption improve structure and clarity.', 'scope helps associate headers with rows or columns.'] }
    ]
  },
  {
    slug: 'meta-charset-viewport',
    title: 'Meta Charset and Viewport',
    description: 'Set character encoding and mobile viewport so pages render correctly on modern devices.',
    level: 'beginner',
    section: 'First Pages',
    order: 23,
    minutes: 9,
    content: [
      { type: 'p', text: 'Two meta tags appear near the top of almost every modern HTML document: charset for text encoding and viewport for mobile layout.' },
      { type: 'h2', text: 'Character encoding with charset' },
      { type: 'p', text: 'charset tells the browser how to interpret characters in the file. UTF-8 supports characters from many languages and is the web standard.' },
      {
        type: 'code',
        title: 'UTF-8 charset meta',
        language: 'html',
        code: `<head>
  <meta charset="UTF-8">
  <title>Correct Characters</title>
</head>`
      },
      { type: 'note', text: 'Put the charset meta tag early in head, before title text that might include special characters.' },
      { type: 'h2', text: 'Viewport for responsive pages' },
      { type: 'p', text: 'Mobile browsers may pretend the screen is wider than it is and scale the page down. The viewport meta tag tells the browser to match the device width.' },
      {
        type: 'code',
        title: 'Common viewport setting',
        language: 'html',
        code: `<meta name="viewport" content="width=device-width, initial-scale=1">`
      },
      { type: 'h2', text: 'Recommended beginner head' },
      {
        type: 'code',
        title: 'Solid starter head',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Site</title>
</head>
<body>
  <h1>Ready for every screen</h1>
</body>
</html>`
      },
      { type: 'h2', text: 'What these tags do not do' },
      { type: 'ul', items: ['charset does not translate languages; it encodes characters correctly.', 'viewport does not create a responsive design by itself; CSS still controls layout.', 'Neither replaces semantic structure in the body.'] },
      { type: 'tip', text: 'Whenever you start a new HTML file, paste the charset and viewport tags immediately so you never forget them.' },
      { type: 'try', text: 'Create a blank starter template that includes doctype, lang, charset, viewport, title, and an empty body ready for content.' },
      { type: 'keypoints', items: ['meta charset="UTF-8" sets modern text encoding.', 'Viewport meta helps pages size correctly on phones.', 'Put charset early in the head.', 'These tags are standard in nearly every new HTML document.'] }
    ]
  },
  {
    slug: 'mini-profile-page',
    title: 'Mini Project: Profile Page',
    description: 'Build a complete beginner profile page that combines structure, media, links, and a contact form.',
    level: 'beginner',
    section: 'First Pages',
    order: 24,
    minutes: 15,
    content: [
      { type: 'p', text: 'This mini project combines the beginner skills you have learned into one coherent page: landmarks, text, lists, an image, links, and a simple form.' },
      { type: 'h2', text: 'Project goal' },
      { type: 'p', text: 'Create profile.html for a personal or fictional profile. The page should introduce someone, show skills, link to resources, and offer a contact form.' },
      { type: 'h2', text: 'Required pieces' },
      {
        type: 'ol',
        items: [
          'Document shell with doctype, lang, charset, viewport, and title',
          'header with the person\'s name and a nav of in-page links',
          'main with an intro section and a skills section',
          'A profile image with meaningful alt text (figure optional)',
          'An unordered list of skills or interests',
          'A contact form with labeled name, email, message, and submit button',
          'footer with a short copyright or credit line'
        ]
      },
      {
        type: 'code',
        title: 'Starter structure',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Alex Rivera - Profile</title>
</head>
<body>
  <header>
    <h1>Alex Rivera</h1>
    <nav aria-label="Primary">
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="about">
      <h2>About</h2>
      <figure>
        <img src="alex.jpg" alt="Alex Rivera smiling outdoors" width="240" height="240">
        <figcaption>Alex - junior frontend learner</figcaption>
      </figure>
      <p>I build clear, accessible web pages with HTML first.</p>
    </section>

    <section id="skills">
      <h2>Skills</h2>
      <ul>
        <li>Semantic HTML</li>
        <li>Accessible forms</li>
        <li>Readable document structure</li>
      </ul>
    </section>

    <section id="contact">
      <h2>Contact</h2>
      <form action="/contact" method="post">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" required>

        <label for="email">Email</label>
        <input id="email" name="email" type="email" required>

        <label for="message">Message</label>
        <textarea id="message" name="message" rows="4" required></textarea>

        <button type="submit">Send</button>
      </form>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 Alex Rivera</p>
  </footer>
</body>
</html>`
      },
      { type: 'h2', text: 'Stretch goals' },
      { type: 'ul', items: ['Add an aside with related links.', 'Add a small table of weekly learning hours.', 'Mark one important sentence with strong.', 'Open an external portfolio link in a new tab with rel="noopener noreferrer".'] },
      { type: 'tip', text: 'Validate your nesting before styling. Open the page, inspect landmarks in DevTools, and confirm each section has a heading.' },
      { type: 'try', text: 'Finish profile.html with your own content, then use View Source to confirm charset, viewport, labels, and landmark elements are all present.' },
      { type: 'keypoints', items: ['Combine landmarks, media, lists, and forms in one page.', 'In-page nav links should match real section ids.', 'Every form control needs a label and a name.', 'A complete beginner page still starts with a solid document head.'] }
    ]
  },
  {
    slug: 'beginner-review',
    title: 'Beginner Review',
    description: 'Review the core HTML beginner skills and check that you can build a sound first page.',
    level: 'beginner',
    section: 'First Pages',
    order: 25,
    minutes: 12,
    content: [
      { type: 'p', text: 'You now have the foundations for reading and writing beginner HTML: documents, text, media, landmarks, forms, and tables. This lesson reviews the essentials before you move on.' },
      { type: 'h2', text: 'Document essentials' },
      { type: 'ul', items: ['Start with <!DOCTYPE html> and an html root with lang.', 'Put charset, viewport, and title in head.', 'Put visible content in body.'] },
      {
        type: 'code',
        title: 'Checklist skeleton',
        language: 'html',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Review Page</title>
</head>
<body>
  <!-- landmarks and content go here -->
</body>
</html>`
      },
      { type: 'h2', text: 'Text, media, and links' },
      {
        type: 'table',
        headers: ['Topic', 'Remember'],
        rows: [
          ['Headings', 'One main h1; nest levels logically'],
          ['Paragraphs', 'Use p for prose blocks'],
          ['Lists', 'ul/ol with li children'],
          ['Links', 'Clear a text and correct href values'],
          ['Images', 'src plus meaningful alt text'],
          ['Figures', 'Use figure/figcaption when a caption belongs with media']
        ]
      },
      { type: 'h2', text: 'Structure and semantics' },
      { type: 'ol', items: ['Prefer header, nav, main, section, article, aside, and footer when they fit.', 'Use div and span only as generic hooks.', 'Keep block and inline nesting valid.', 'Inspect your page with DevTools to verify structure.'] },
      { type: 'h2', text: 'Forms and tables' },
      { type: 'ul', items: ['Label every control and give inputs a name.', 'Choose useful input types.', 'Set action and method intentionally; prefer POST for sensitive data.', 'Use tables for data with th, td, and captions - not for layout.'] },
      {
        type: 'code',
        title: 'Quick form reminder',
        language: 'html',
        code: `<form action="/feedback" method="post">
  <label for="msg">Message</label>
  <textarea id="msg" name="msg" required></textarea>
  <button type="submit">Send</button>
</form>`
      },
      { type: 'h2', text: 'Self-check questions' },
      { type: 'ol', items: ['Can you explain the difference between head and body?', 'Can you write a nav with three relative links?', 'Can you pair labels and inputs with for and id?', 'Can you choose between section, article, and div?', 'Can you add charset and viewport without looking them up?'] },
      { type: 'note', text: 'If any answer is "not yet", revisit that lesson and rebuild a tiny example from scratch. Repetition is how HTML becomes automatic.' },
      { type: 'tip', text: 'Your next step after beginner HTML is usually CSS for layout and visual design, while keeping this semantic structure intact.' },
      { type: 'try', text: 'Without copying, recreate a one-page profile from memory: document head, landmarks, image, list, links, and a small form. Then compare with your earlier mini project.' },
      { type: 'keypoints', items: ['HTML documents need a clear head and body setup.', 'Semantic structure makes pages clearer and more accessible.', 'Text, links, images, forms, and tables cover most beginner pages.', 'Practice by building small complete pages, not only isolated snippets.'] }
    ]
  }
];
