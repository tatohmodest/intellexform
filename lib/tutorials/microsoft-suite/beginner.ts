import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-microsoft-365',
    title: 'What is Microsoft 365?',
    description: 'Understand Microsoft 365, the apps it includes, and how schools and workplaces in Africa use the suite for learning and productivity.',
    level: 'beginner',
    section: 'Microsoft 365 Foundations',
    order: 1,
    minutes: 12,
    content: [
      { type: 'p', text: 'Microsoft 365 (formerly Office 365) is a subscription service that gives you access to Microsoft productivity apps, cloud storage, and collaboration tools. Instead of buying Word or Excel once on a CD, you sign in with an account and use the latest versions online or on your device.' },
      { type: 'p', text: 'For students and professionals in Cameroon and across Africa, Microsoft 365 is common in universities, NGOs, government offices, and companies that partner with Microsoft. Many schools provide free or discounted licenses through programs like Microsoft 365 Education.' },
      { type: 'h2', text: 'What is included in Microsoft 365?' },
      {
        type: 'table',
        headers: ['Category', 'Apps and services', 'Typical use'],
        rows: [
          ['Documents', 'Word, Excel, PowerPoint', 'Reports, budgets, presentations'],
          ['Communication', 'Outlook, Teams', 'Email, meetings, chat'],
          ['Storage', 'OneDrive', 'Save, sync, and share files in the cloud'],
          ['Notes and forms', 'OneNote, Forms', 'Class notes, surveys, quizzes'],
          ['Collaboration', 'SharePoint, Planner, To Do', 'Team sites, tasks, project tracking'],
        ],
      },
      { type: 'h2', text: 'Desktop apps vs web apps vs mobile apps' },
      { type: 'p', text: 'You can use Microsoft 365 in three main ways. Desktop apps (Word, Excel, PowerPoint installed on Windows or Mac) work best offline and offer the fullest features. Web apps (office.com in a browser) need internet but work on any computer, including Linux or a school lab PC. Mobile apps let you view and edit files on Android or iPhone, which is useful when you only have a phone.' },
      { type: 'ul', items: ['Desktop: best for heavy work, large files, and offline editing.', 'Web: best when you are on a shared computer or have limited storage.', 'Mobile: best for quick edits, checking email, and joining Teams meetings on the go.'] },
      { type: 'h2', text: 'Why Microsoft 365 matters for African learners' },
      { type: 'p', text: 'Employers and universities often expect you to know Word, Excel, PowerPoint, and email. Cloud storage through OneDrive protects your work if a laptop is lost or a power cut shuts down your computer before you save locally. Teams became essential for online classes and remote meetings during and after the COVID period.' },
      { type: 'note', text: 'Microsoft 365 is not the only option. Google Workspace and LibreOffice also exist. This course focuses on Microsoft 365 because it is widely used in African workplaces and international organizations.' },
      { type: 'h3', text: 'Common license types' },
      { type: 'ol', items: ['Personal or Family: paid subscription for home use.', 'Business: paid plans for companies with admin controls.', 'Education: often free for students and teachers with a school email.', 'Work: provided by your employer through a work account.'] },
      { type: 'tip', text: 'Check if your university email (for example @student.uninet.cm or similar) unlocks Microsoft 365 Education before paying for a personal subscription.' },
      { type: 'try', text: 'List three tasks you do for school or work (writing, budgeting, presenting). Match each task to a Microsoft 365 app you would use.' },
      { type: 'keypoints', items: ['Microsoft 365 is a subscription with apps, cloud storage, and collaboration tools.', 'Core apps include Word, Excel, PowerPoint, Outlook, Teams, and OneDrive.', 'You can use desktop, web, or mobile versions depending on your device and internet.', 'Education and work accounts often provide access at no personal cost.'] },
    ],
  },
  {
    slug: 'accounts-sign-in-mfa',
    title: 'Accounts, Sign-In, and MFA Basics',
    description: 'Create and manage your Microsoft account, sign in safely across devices, and set up multi-factor authentication to protect your work.',
    level: 'beginner',
    section: 'Microsoft 365 Foundations',
    order: 2,
    minutes: 11,
    content: [
      { type: 'p', text: 'Every Microsoft 365 service starts with an account. Your account is your email address plus a password. It connects you to OneDrive, Outlook, Teams, and all the Office apps. Treat your account like a key to your digital life.' },
      { type: 'h2', text: 'Types of Microsoft accounts' },
      {
        type: 'table',
        headers: ['Account type', 'Example email', 'Who manages it'],
        rows: [
          ['Personal', 'you@gmail.com or you@outlook.com', 'You'],
          ['Work or school', 'name@company.com or name@university.edu', 'Your IT department or school admin'],
          ['Shared device', 'Lab PC at an internet cafe', 'Whoever owns the device'],
        ],
      },
      { type: 'h2', text: 'Signing in step by step' },
      { type: 'ol', items: ['Open office.com or the app you need (Word, Outlook, Teams).', 'Click Sign in and enter your email address.', 'Enter your password. Use a strong password you do not reuse on other sites.', 'If prompted, approve sign-in on your phone (this is MFA).', 'Choose Stay signed in only on your personal device, not on public computers.'] },
      { type: 'h2', text: 'What is multi-factor authentication (MFA)?' },
      { type: 'p', text: 'MFA adds a second proof that you are really you. Even if someone steals your password, they cannot sign in without the second factor. Common methods include a code from the Microsoft Authenticator app, an SMS text message, or a phone call.' },
      { type: 'h3', text: 'Set up Microsoft Authenticator' },
      { type: 'ol', items: ['Install Microsoft Authenticator from Google Play or the App Store.', 'Go to account.microsoft.com and sign in.', 'Select Security, then Advanced security options.', 'Under Additional security, turn on two-step verification.', 'Follow the prompts to scan the QR code with Authenticator.'] },
      { type: 'warning', text: 'Never share MFA codes with anyone. Scammers pretend to be IT support and ask for your code. Real Microsoft support will never ask for your password or MFA code.' },
      { type: 'note', text: 'If your school or employer requires MFA, you must complete setup before accessing email or Teams. Ask your IT help desk if you get locked out.' },
      { type: 'tip', text: 'On slow mobile networks in rural areas, Authenticator app codes work offline once set up. SMS codes need a signal and can be delayed.' },
      { type: 'try', text: 'Sign in to office.com with your account. Check whether MFA is already enabled under your security settings. If not, plan to set it up on a day when you have stable internet.' },
      { type: 'keypoints', items: ['Your Microsoft account is your email plus password for all 365 services.', 'Work and school accounts are managed by an organization; personal accounts are managed by you.', 'MFA adds a second verification step and greatly improves security.', 'Only stay signed in on devices you own and trust.'] },
    ],
  },
  {
    slug: 'onedrive-save-sync-share',
    title: 'OneDrive: Save, Sync, Share, and Permissions',
    description: 'Use OneDrive to store files in the cloud, sync across devices, share links, and control who can view or edit your documents.',
    level: 'beginner',
    section: 'Microsoft 365 Foundations',
    order: 3,
    minutes: 14,
    content: [
      { type: 'p', text: 'OneDrive is your personal cloud storage in Microsoft 365. When you save a file to OneDrive, it is stored on Microsoft servers and can sync to your phone, laptop, and tablet. If your computer fails, your files remain safe online.' },
      { type: 'h2', text: 'Saving files to OneDrive' },
      { type: 'ol', items: ['Open Word, Excel, or PowerPoint.', 'Click File, then Save As.', 'Choose OneDrive as the location (not This PC unless you also want a local copy).', 'Pick a folder or create a new one.', 'Click Save. Watch for the sync icon in the taskbar or menu bar.'] },
      { type: 'h3', text: 'Sync with the OneDrive app' },
      { type: 'p', text: 'Install the OneDrive desktop app to mirror your cloud files on your computer. Files appear in File Explorer (Windows) or Finder (Mac). When you edit a synced file, changes upload automatically when internet is available.' },
      { type: 'h2', text: 'Sharing files with links' },
      { type: 'ol', items: ['Right-click the file in OneDrive (web or File Explorer) and choose Share.', 'Enter email addresses or click Copy link.', 'Choose permission: Anyone with the link, People in your organization, or Specific people.', 'Set whether recipients can edit or only view.', 'Click Send or Copy link and share via WhatsApp, email, or Teams.'] },
      {
        type: 'table',
        headers: ['Permission level', 'Who can access', 'Best for'],
        rows: [
          ['View only', 'Can open and read, not edit', 'Finished reports, certificates'],
          ['Edit', 'Can change the file', 'Group assignments, shared budgets'],
          ['Specific people', 'Only named emails', 'Confidential school or work files'],
          ['Anyone with link', 'Anyone who has the URL', 'Public flyers (use with caution)'],
        ],
      },
      { type: 'warning', text: 'Anyone with the link can forward it. For sensitive data (grades, salaries, medical info), use Specific people and View only. Avoid Anyone with the link for private documents.' },
      { type: 'note', text: 'Free personal OneDrive offers about 5 GB. Education and work plans often include 1 TB or more. Check your storage at onedrive.com under Settings.' },
      { type: 'tip', text: 'On unreliable internet, work on synced files offline. OneDrive uploads changes when connection returns. Look for the green checkmark on synced files.' },
      { type: 'try', text: 'Create a Word document called "OneDrive Test". Save it to OneDrive. Share it with a classmate as View only and confirm they can open but not edit.' },
      { type: 'keypoints', items: ['OneDrive stores files in the cloud and syncs across your devices.', 'Save to OneDrive from Office apps or upload at onedrive.com.', 'Share with links and set View or Edit permissions carefully.', 'Use Specific people for sensitive files; avoid open links for private data.'] },
    ],
  },
  {
    slug: 'file-naming-folders',
    title: 'File Naming and Folders for School and Work',
    description: 'Organize your digital files with clear names and folder structures so you and your team can find documents quickly.',
    level: 'beginner',
    section: 'Microsoft 365 Foundations',
    order: 4,
    minutes: 10,
    content: [
      { type: 'p', text: 'Poor file names like "Document1.docx" or "Final_FINAL2.pptx" waste time. Good naming and folder habits help you find work during exams, submit assignments on deadline, and collaborate without confusion.' },
      { type: 'h2', text: 'File naming best practices' },
      { type: 'ul', items: ['Use dates in YYYY-MM-DD format so files sort correctly (2026-03-15_Report.docx).', 'Include the project or course code (ENG201_Essay_Marie.docx).', 'Avoid spaces in some systems; use underscores or hyphens instead.', 'Never use special characters like / \\ : * ? " < > | in file names.', 'Version clearly: v1, v2, or date-based updates instead of "final".'] },
      {
        type: 'table',
        headers: ['Bad name', 'Better name', 'Why'],
        rows: [
          ['doc.docx', '2026-01-10_CV_Jean.docx', 'Identifies content, date, and owner'],
          ['budget.xlsx', '2026-Q1_NGO_Budget.xlsx', 'Shows period and purpose'],
          ['presentation.pptx', '2026-04-15_Startup_Pitch_v2.pptx', 'Shows event date and version'],
        ],
      },
      { type: 'h2', text: 'Folder structure example for a student' },
      {
        type: 'code',
        title: 'Suggested OneDrive folder layout',
        language: 'text',
        code: `OneDrive/
  School/
    2026_Semester1/
      MAT101/
      ENG201/
      CSC150/
    2026_Semester2/
  Work/
    Internship_ACME/
  Personal/
    CV_and_Certificates/
    ID_Scans/`
      },
      { type: 'h2', text: 'Folder structure example for a small team' },
      { type: 'ol', items: ['Create a top folder for the project name and year.', 'Add subfolders: Admin, Reports, Presentations, Data, Archive.', 'Move old versions to Archive instead of deleting immediately.', 'Agree on naming rules in a short README.txt file in the main folder.'] },
      { type: 'tip', text: 'Pin your most-used folders in File Explorer or add them to Quick Access. In OneDrive web, click the star to favorite a folder.' },
      { type: 'note', text: 'In Cameroon and many African offices, files may be shared via USB, WhatsApp, and email as well as OneDrive. Use the same naming rules everywhere so copies stay identifiable.' },
      { type: 'try', text: 'Reorganize one messy folder on your computer or OneDrive. Rename at least five files and create a semester or project folder structure.' },
      { type: 'keypoints', items: ['Use dates, project names, and versions in file names.', 'Build a consistent folder tree for school, work, and personal files.', 'Avoid vague names like "final" or "document1".', 'Agree on naming rules when working in a team.'] },
    ],
  },
  {
    slug: 'word-interface-basics',
    title: 'Word Interface and Creating Documents',
    description: 'Navigate Microsoft Word, understand the ribbon and key tools, and create your first professional document from scratch.',
    level: 'beginner',
    section: 'Word Essentials',
    order: 5,
    minutes: 12,
    content: [
      { type: 'p', text: 'Microsoft Word is the standard tool for writing letters, reports, essays, CVs, and proposals. Whether you use the desktop app, Word on the web, or the mobile app, the core ideas are the same: type text, format it, and save or share the file.' },
      { type: 'h2', text: 'Main parts of the Word window' },
      {
        type: 'table',
        headers: ['Area', 'Purpose'],
        rows: [
          ['Ribbon tabs (Home, Insert, Layout)', 'Commands grouped by task'],
          ['Quick Access Toolbar', 'Save, Undo, Redo shortcuts'],
          ['Document area', 'Where you type and edit'],
          ['Status bar', 'Page count, word count, zoom'],
          ['Navigation pane', 'Headings, pages, search (View tab)'],
        ],
      },
      { type: 'h2', text: 'Create a new document step by step' },
      { type: 'ol', items: ['Open Word from the Start menu, office.com, or your phone.', 'Select Blank document or choose a template.', 'Type a title at the top. Press Enter twice before the first paragraph.', 'Save immediately: File, Save As, choose OneDrive, name the file with date and topic.', 'Continue writing. Word saves automatically in recent versions when using OneDrive.'] },
      { type: 'h3', text: 'Example content to type' },
      {
        type: 'code',
        title: 'Practice document: short business letter',
        language: 'text',
        code: `LETTER OF APPLICATION

Dear Hiring Manager,

I am writing to apply for the Administrative Assistant
position advertised on your company website. I recently
completed my BSc in Business Administration at the
University of Buea and gained practical experience during
a three-month internship at a local NGO.

I am proficient in Microsoft Word, Excel, and Outlook,
and I am eager to contribute to your team.

Sincerely,
Amina Ngufor`
      },
      { type: 'h2', text: 'Essential Home tab commands' },
      { type: 'ul', items: ['Font: change typeface, size, bold, italic, underline.', 'Paragraph: alignment (left, center, right, justify), line spacing, bullets.', 'Styles: apply heading styles for structure (covered in the next lesson).', 'Find and Replace: search text across the document (Ctrl+H).'] },
      { type: 'tip', text: 'Turn on Show/Hide paragraph marks (Home ribbon, pilcrow icon) to see where you pressed Enter. Extra blank lines often come from double Enter keys.' },
      { type: 'note', text: 'Word on the web has fewer features than desktop Word but is enough for most school essays. Use desktop Word for long theses, complex tables, or mail merge.' },
      { type: 'try', text: 'Create a one-page letter applying for a real or practice job. Save it to OneDrive with a clear file name. Check word count on the status bar.' },
      { type: 'keypoints', items: ['The ribbon organizes Word commands into tabs like Home, Insert, and Layout.', 'Save early to OneDrive with a descriptive file name.', 'Use the Home tab for fonts, paragraphs, and styles.', 'Desktop, web, and mobile Word share the same basic workflow.'] },
    ],
  },
  {
    slug: 'word-formatting-styles-templates',
    title: 'Word Formatting, Styles, and Templates',
    description: 'Apply professional formatting with fonts, spacing, styles, and built-in templates so documents look consistent and polished.',
    level: 'beginner',
    section: 'Word Essentials',
    order: 6,
    minutes: 13,
    content: [
      { type: 'p', text: 'Formatting is more than making text bold. Professional documents use consistent fonts, heading levels, spacing, and margins. Styles let you apply a whole format package with one click and update every heading at once when requirements change.' },
      { type: 'h2', text: 'Character vs paragraph formatting' },
      { type: 'ul', items: ['Character: bold, italic, font size, color (applies to selected text only).', 'Paragraph: alignment, indentation, space before/after, line spacing (applies to the whole paragraph).'] },
      { type: 'h2', text: 'Using styles instead of manual formatting' },
      { type: 'ol', items: ['Select a line of text that should be a main heading.', 'On the Home tab, click Heading 1 in the Styles gallery.', 'For subsections, use Heading 2 and Heading 3.', 'For normal body text, use the Normal style.', 'To change all Heading 1 text at once, right-click Heading 1, Modify, and update font or color.'] },
      {
        type: 'table',
        headers: ['Style', 'Typical use', 'Example'],
        rows: [
          ['Title', 'Document title once at top', 'Annual Report 2026'],
          ['Heading 1', 'Major sections', 'Introduction, Methodology'],
          ['Heading 2', 'Subsections', 'Data Collection, Results'],
          ['Normal', 'Body paragraphs', 'All standard text'],
        ],
      },
      { type: 'h2', text: 'Page layout basics' },
      { type: 'ol', items: ['Open the Layout tab.', 'Set Margins to Normal (2.54 cm) or your school requirement.', 'Choose Orientation: Portrait for essays, Landscape for wide tables.', 'Set Spacing: Line spacing 1.5 is common for academic work in many African universities.'] },
      { type: 'h3', text: 'Using templates' },
      { type: 'p', text: 'Templates are pre-designed documents. Go to File, New, and search for Resume, Report, Business Plan, or Invoice. Templates save time and teach good layout. Customize the placeholder text with your own information.' },
      { type: 'tip', text: 'Many universities publish thesis templates. Ask your department or search for "Word template" plus your school name before formatting a long dissertation manually.' },
      { type: 'note', text: 'Avoid using more than two font families in one document. Common professional pairs: Calibri for body and Calibri Bold for headings, or Times New Roman for formal academic papers.' },
      { type: 'try', text: 'Take a plain essay and apply Heading 1, Heading 2, and Normal styles. Modify Heading 1 to use a different color. Generate a Table of Contents (References tab) to see styles in action.' },
      { type: 'keypoints', items: ['Use styles for headings and body text instead of manual formatting each line.', 'Set margins, orientation, and line spacing on the Layout tab.', 'Templates provide professional starting points for CVs, reports, and letters.', 'Modify a style once to update every instance in the document.'] },
    ],
  },
  {
    slug: 'word-headers-footers-page-numbers',
    title: 'Word Headers, Footers, and Page Numbers',
    description: 'Add headers, footers, and page numbers to long documents such as reports, theses, and official letters.',
    level: 'beginner',
    section: 'Word Essentials',
    order: 7,
    minutes: 11,
    content: [
      { type: 'p', text: 'Headers and footers repeat content at the top or bottom of every page. They are standard on school reports, company letters, and research papers. Page numbers help readers and examiners reference specific sections.' },
      { type: 'h2', text: 'Insert a header and footer' },
      { type: 'ol', items: ['Double-click the top margin of the page (or Insert, Header).', 'Type your text, such as the report title or your name.', 'Double-click the bottom margin for the footer (or Insert, Footer).', 'Add page numbers, date, or course code in the footer.', 'Click Close Header and Footer or double-click the main document.'] },
      { type: 'h2', text: 'Add page numbers' },
      { type: 'ol', items: ['Go to Insert, Page Number.', 'Choose position: Top of page, Bottom of page, or Page margins.', 'Select a style (plain number is fine for academic work).', 'For "Page 1 of 10" format, use Page Number, Format Page Numbers, or field codes in the footer.'] },
      { type: 'h3', text: 'Different first page' },
      { type: 'p', text: 'Cover pages often have no page number. In Header and Footer tools, check Different First Page. Page numbering can start on page 2. For theses, you may need Roman numerals (i, ii, iii) for front matter and Arabic (1, 2, 3) for the main body.' },
      {
        type: 'code',
        title: 'Example footer content for a university report',
        language: 'text',
        code: `Left footer:  CSC150 Assignment 2
Center footer:  Page 3
Right footer:   Marie T. | March 2026`
      },
      { type: 'h2', text: 'Section breaks for complex documents' },
      { type: 'p', text: 'When one part of a document needs different headers (for example, chapter titles), insert a Section Break (Layout, Breaks, Next Page) before that chapter. Then unlink the header from the previous section (turn off Link to Previous in Header tools).' },
      { type: 'warning', text: 'If page numbers restart at 1 in the middle of a document, you likely need section breaks and to unlink headers. This is a common thesis formatting problem.' },
      { type: 'tip', text: 'Keep headers minimal: document title or short chapter name. Long headers waste space on every page.' },
      { type: 'try', text: 'Create a three-page report with a cover page (no number), table of contents (Roman numerals optional), and body starting at page 1. Put your name in the header and page numbers in the footer.' },
      { type: 'keypoints', items: ['Headers and footers repeat on each page for titles, names, and page numbers.', 'Use Insert, Page Number for standard numbering.', 'Different First Page hides numbers on cover pages.', 'Section breaks allow different headers in different chapters.'] },
    ],
  },
  {
    slug: 'word-tables-images-accessibility',
    title: 'Word Tables, Images, and Accessibility',
    description: 'Insert and format tables and images in Word, and add alt text so documents are accessible to everyone.',
    level: 'beginner',
    section: 'Word Essentials',
    order: 8,
    minutes: 13,
    content: [
      { type: 'p', text: 'Tables organize data in rows and columns. Images illustrate reports and presentations. Accessible documents include alt text descriptions so screen readers can explain visuals to people with visual impairments.' },
      { type: 'h2', text: 'Create and format a table' },
      { type: 'ol', items: ['Place the cursor where you want the table.', 'Go to Insert, Table, and drag to select rows and columns (for example 4x3).', 'Type headers in the first row: Item, Quantity, Unit Price, Total.', 'Tab between cells to move forward; add rows with Tab on the last cell.', 'Use Table Design to apply a style and Table Layout to merge cells or adjust width.'] },
      {
        type: 'code',
        title: 'Example table content: monthly expenses',
        language: 'text',
        code: `| Expense      | Amount (FCFA) | Notes           |
|--------------|---------------|-----------------|
| Transport    | 15,000        | Moto-taxi       |
| Internet     | 10,000        | Monthly data    |
| Food         | 45,000        | Campus meals    |
| Total        | 70,000        |                 |`
      },
      { type: 'h2', text: 'Insert and position images' },
      { type: 'ol', items: ['Click Insert, Pictures, and choose This Device or Stock Images.', 'Select your image file (JPEG or PNG).', 'Drag corners to resize proportionally (hold Shift if needed).', 'Use Picture Format, Wrap Text to choose In Line or Square for text flow.', 'Add a caption: right-click image, Insert Caption (Figure 1: Map of study area).'] },
      { type: 'h2', text: 'Alt text for accessibility' },
      { type: 'ol', items: ['Right-click the image and choose View Alt Text (or Edit Alt Text).', 'Write a short description of what the image shows, not "image" or "photo".', 'Example: "Bar chart showing rainfall in Douala from January to June 2025".', 'Mark decorative images as decorative if they add no information.', 'Run Review, Check Accessibility to find missing alt text.'] },
      { type: 'note', text: 'Accessibility helps everyone: clear tables, captions, and alt text also make documents easier to understand when printed in black and white or viewed on a small phone screen.' },
      { type: 'tip', text: 'Compress large images (Picture Format, Compress Pictures) before emailing documents. This saves data and speeds up opening on slow connections.' },
      { type: 'try', text: 'Build a table of five products with prices in FCFA. Insert one image with proper alt text. Run the Accessibility Checker and fix any issues.' },
      { type: 'keypoints', items: ['Insert tables from Insert, Table and use the first row for headers.', 'Resize images and set text wrap for clean layout.', 'Add meaningful alt text to every informative image.', 'Use the Accessibility Checker under the Review tab.'] },
    ],
  },
  {
    slug: 'word-comments-track-changes',
    title: 'Word Comments and Track Changes',
    description: 'Collaborate on documents with comments and Track Changes so teachers, supervisors, and teammates can review edits clearly.',
    level: 'beginner',
    section: 'Word Essentials',
    order: 9,
    minutes: 12,
    content: [
      { type: 'p', text: 'When a supervisor reviews your thesis or a teammate edits a proposal, you need a clear record of who changed what. Comments add notes without changing the text. Track Changes records every edit for approval or rejection.' },
      { type: 'h2', text: 'Add and reply to comments' },
      { type: 'ol', items: ['Select the text you want to discuss.', 'Go to Review, New Comment (or right-click, New Comment).', 'Type your note: "Please cite a source for this statistic."', 'Others reply in the same comment thread.', 'Resolve the comment when the issue is fixed (Review, Resolve).'] },
      { type: 'h2', text: 'Turn on Track Changes' },
      { type: 'ol', items: ['Open the Review tab.', 'Click Track Changes to turn it on (button highlighted).', 'Edit the document normally. Insertions appear in color; deletions show as strikethrough.', 'Choose All Markup in the Display for Review dropdown to see everything.', 'Use Accept and Reject buttons to approve or undo each change.'] },
      {
        type: 'table',
        headers: ['Feature', 'When to use', 'Visible to others'],
        rows: [
          ['Comment', 'Ask questions, give feedback without editing', 'Yes, in margin'],
          ['Track Changes', 'Suggest actual text edits', 'Yes, inline markup'],
          ['Simple edit', 'You own the document and need no record', 'Only final text'],
        ],
      },
      { type: 'h3', text: 'Sharing for review' },
      { type: 'p', text: 'Save the document to OneDrive and share with Edit permission. Multiple people can comment and track changes at the same time. Each person\'s edits appear in a different color with their name.' },
      { type: 'warning', text: 'Before submitting a final version to a professor or client, accept or reject all changes and delete comments. Use Review, Accept, Accept All Changes and Delete All Comments.' },
      { type: 'tip', text: 'If Track Changes makes the document hard to read, switch Display for Review to Simple Markup or No Markup while editing, then back to All Markup before sending for review.' },
      { type: 'try', text: 'Share a short essay with a partner on OneDrive. Each person adds one comment and one tracked change. Practice accepting and rejecting changes.' },
      { type: 'keypoints', items: ['Comments are for notes; Track Changes records text edits.', 'Turn on Track Changes from the Review tab before collaborative editing.', 'Accept or reject changes and remove comments before final submission.', 'OneDrive sharing enables real-time co-editing with review markup.'] },
    ],
  },
  {
    slug: 'excel-interface-basics',
    title: 'Excel Interface, Cells, and Sheets',
    description: 'Learn the Excel workbook layout, how cells, rows, and columns work, and how to enter and format basic data.',
    level: 'beginner',
    section: 'Excel Essentials',
    order: 10,
    minutes: 12,
    content: [
      { type: 'p', text: 'Microsoft Excel is a spreadsheet program for organizing numbers, lists, budgets, grades, and inventories. Data lives in cells. Cells are identified by column letter and row number, such as B5. Multiple sheets in one file keep related tables together.' },
      { type: 'h2', text: 'Parts of the Excel window' },
      {
        type: 'table',
        headers: ['Element', 'Description'],
        rows: [
          ['Workbook', 'The entire Excel file (.xlsx)'],
          ['Worksheet (sheet)', 'One tab at the bottom, like Sheet1, Sheet2'],
          ['Cell', 'One box, address like C10'],
          ['Name box', 'Shows active cell address'],
          ['Formula bar', 'Shows cell contents or formulas'],
          ['Ribbon', 'Home, Insert, Formulas, Data tabs'],
        ],
      },
      { type: 'h2', text: 'Enter data step by step' },
      { type: 'ol', items: ['Click cell A1 and type a column header, for example Product.', 'Press Tab to move right or Enter to move down.', 'Fill headers in row 1: Product, Quantity, Price, Total.', 'Enter data starting in row 2.', 'Save to OneDrive: File, Save As, name file 2026_Inventory_Practice.xlsx.'] },
      {
        type: 'code',
        title: 'Sample data to type in Excel',
        language: 'text',
        code: `A1: Product    B1: Quantity    C1: Price (FCFA)    D1: Total
A2: Rice       B2: 10          C2: 5000            D2: (formula later)
A3: Oil        B3: 5           C3: 3500            D3: (formula later)
A4: Sugar      B4: 8           C4: 2000            D4: (formula later)`
      },
      { type: 'h2', text: 'Basic formatting' },
      { type: 'ul', items: ['Select a column. Home, Format, Column Width to fit content.', 'Format numbers as Currency or Number with thousand separators.', 'Bold row 1 headers. Home, Fill Color for a light header background.', 'Freeze top row: View, Freeze Panes, Freeze Top Row (keeps headers visible when scrolling).'] },
      { type: 'note', text: 'Excel uses your regional settings for dates and currency. In Cameroon, you may see FCFA or XAF depending on system settings. Consistency matters more than the symbol shown.' },
      { type: 'tip', text: 'Double-click the line between column headers (for example between A and B) to auto-fit column width to the longest entry.' },
      { type: 'try', text: 'Create a sheet listing five items you sell or buy weekly. Add headers, ten rows of data, bold headers, and freeze the top row.' },
      { type: 'keypoints', items: ['Cells are addressed by column letter and row number (B5).', 'Row 1 usually holds column headers; data starts in row 2.', 'A workbook can have multiple sheets for different tables.', 'Format numbers, freeze headers, and save to OneDrive early.'] },
    ],
  },
  {
    slug: 'excel-formulas-basics',
    title: 'Excel Formulas Basics',
    description: 'Write your first Excel formulas, understand the equals sign, and apply order of operations correctly.',
    level: 'beginner',
    section: 'Excel Essentials',
    order: 11,
    minutes: 13,
    content: [
      { type: 'p', text: 'Formulas are what make Excel more than a typing grid. A formula always starts with = and can add, subtract, multiply, divide, or combine cell references. When you change input cells, results update automatically.' },
      { type: 'h2', text: 'Create your first formula' },
      { type: 'ol', items: ['Click cell D2 where you want the total.', 'Type = (equals sign). Excel knows a formula is coming.', 'Click cell B2 (quantity), type *, click C2 (price).', 'Press Enter. You should see =B2*C2 in the formula bar.', 'Click D2 again and drag the fill handle (small square at bottom-right) down to copy the formula to other rows.'] },
      {
        type: 'code',
        title: 'Basic arithmetic formulas',
        language: 'excel',
        code: `=B2*C2          (multiply quantity by price)
=B2+C2           (add two cells)
=(B2+C2)*0.1     (add then multiply by 10%)
=B2/C2           (divide)
=B2-C2           (subtract)`
      },
      { type: 'h2', text: 'Order of operations' },
      { type: 'p', text: 'Excel follows math rules: parentheses first, then multiplication and division, then addition and subtraction. Use parentheses to make intent clear.' },
      {
        type: 'table',
        headers: ['Formula', 'Result if B2=10, C2=5', 'Why'],
        rows: [
          ['=B2+C2*2', '20', 'Multiplication before addition: 10+10'],
          ['=(B2+C2)*2', '30', 'Parentheses first: 15*2'],
          ['=B2/C2+C2', '7', 'Division then addition: 2+5'],
        ],
      },
      { type: 'h2', text: 'Common mistakes' },
      { type: 'ul', items: ['Forgetting = at the start (Excel treats text as plain text).', 'Typing numbers instead of cell references (hard to update).', 'Leaving a circular reference (a formula that refers to its own cell).', 'Mixing commas and semicolons in some locales (Excel uses ; as argument separator in French locale).'] },
      { type: 'warning', text: 'If you see ##### in a cell, the column is too narrow for the number. Widen the column. If you see #DIV/0!, you divided by zero.' },
      { type: 'tip', text: 'Press F2 to edit a formula in place. Use arrow keys to move between cell references while editing.' },
      { type: 'try', text: 'Build a simple invoice: Quantity, Unit Price, Line Total (=Qty*Price), and Grand Total (=SUM of line totals). Change one quantity and confirm totals update.' },
      { type: 'keypoints', items: ['Every formula starts with =.', 'Use cell references so values update when inputs change.', 'Parentheses control order of operations.', 'Drag the fill handle to copy formulas to other rows.'] },
    ],
  },
  {
    slug: 'excel-sum-average-count-if',
    title: 'Excel SUM, AVERAGE, COUNT, and IF',
    description: 'Use essential Excel functions to total, average, count, and make simple logical decisions in your spreadsheets.',
    level: 'beginner',
    section: 'Excel Essentials',
    order: 12,
    minutes: 14,
    content: [
      { type: 'p', text: 'Functions are built-in formulas that perform common tasks. SUM adds numbers. AVERAGE finds the mean. COUNT counts cells with numbers. IF returns one value when a condition is true and another when it is false.' },
      { type: 'h2', text: 'SUM, AVERAGE, and COUNT' },
      {
        type: 'code',
        title: 'Core functions with examples',
        language: 'excel',
        code: `=SUM(B2:B10)           (add all values in B2 through B10)
=AVERAGE(C2:C10)       (mean of range)
=COUNT(B2:B10)         (count cells with numbers)
=COUNTA(A2:A10)        (count non-empty cells)
=MAX(B2:B10)           (largest value)
=MIN(B2:B10)           (smallest value)`
      },
      { type: 'ol', items: ['Click the cell below your data column (for example B11).', 'Click AutoSum on the Home tab (or type =SUM().', 'Select the range B2:B10 and press Enter.', 'Repeat for AVERAGE in another cell.', 'Label your total row: put "Total" in A11 and formulas in B11, C11.'] },
      { type: 'h2', text: 'The IF function' },
      { type: 'p', text: 'IF tests a condition. Syntax: =IF(logical_test, value_if_true, value_if_false). Example: pass or fail based on a score of 50 or higher.' },
      {
        type: 'code',
        title: 'IF examples for student grades',
        language: 'excel',
        code: `=IF(B2>=50,"Pass","Fail")
=IF(B2>=80,"A",IF(B2>=70,"B",IF(B2>=60,"C","D")))
=IF(C2="Paid","OK","Follow up")`
      },
      {
        type: 'table',
        headers: ['Student', 'Score', 'Result formula', 'Output'],
        rows: [
          ['Jean', '72', '=IF(B2>=50,"Pass","Fail")', 'Pass'],
          ['Aisha', '45', '=IF(B3>=50,"Pass","Fail")', 'Fail'],
          ['Paul', '88', '=IF(B4>=80,"A","B")', 'A'],
        ],
      },
      { type: 'h3', text: 'Practical exercise: class marks' },
      { type: 'ol', items: ['Column A: student names. Column B: scores out of 100.', 'Column C: =IF(B2>=50,"Pass","Fail").', 'Below the data: =AVERAGE(B2:B20) and =COUNTIF(B2:B20,"Pass") if you learn COUNTIF next, or count passes manually first.'] },
      { type: 'note', text: 'Text in formulas must be in quotation marks. In French Excel, use semicolons instead of commas: =IF(B2>=50;"Pass";"Fail").' },
      { type: 'tip', text: 'Use the Insert Function (fx) button if you forget argument order. Search for SUM, AVERAGE, or IF and follow the wizard.' },
      { type: 'try', text: 'Create a grade sheet for 10 students. Add SUM and AVERAGE for the class. Use IF to label Pass/Fail at 50 points.' },
      { type: 'keypoints', items: ['SUM, AVERAGE, and COUNT summarize ranges quickly.', 'IF returns different results based on a true/false test.', 'Use AutoSum or type functions starting with =.', 'Quote text arguments inside IF formulas.'] },
    ],
  },
  {
    slug: 'excel-cell-references',
    title: 'Excel Cell References: Relative vs Absolute',
    description: 'Understand relative and absolute cell references so formulas copy correctly across rows and columns.',
    level: 'beginner',
    section: 'Excel Essentials',
    order: 13,
    minutes: 12,
    content: [
      { type: 'p', text: 'When you copy a formula, Excel adjusts cell references by default. That is usually what you want. Sometimes you need one cell (like a tax rate) to stay fixed. Absolute references use dollar signs to lock rows, columns, or both.' },
      { type: 'h2', text: 'Relative references (default)' },
      { type: 'p', text: 'In cell D2 you write =B2*C2. When you copy down to D3, Excel changes it to =B3*C3. Each row multiplies its own quantity and price. No dollar signs needed.' },
      { type: 'h2', text: 'Absolute references' },
      {
        type: 'code',
        title: 'Reference types',
        language: 'excel',
        code: `=B2*C2      (relative: both shift when copied)
=$B$2*C2     ($B$2 locked: always row 2 column B)
=B2*$C$1     (C1 locked: tax rate in C1 for all rows)
=$B2*C$2     (mixed: column B and row 2 partially locked)`
      },
      {
        type: 'table',
        headers: ['Symbol', 'Meaning', 'When copied down'],
        rows: [
          ['B2', 'Relative', 'Becomes B3, B4, ...'],
          ['$B$2', 'Absolute', 'Stays $B$2'],
          ['$B2', 'Column fixed', 'Column B fixed, row changes'],
          ['B$2', 'Row fixed', 'Row 2 fixed, column changes'],
        ],
      },
      { type: 'h2', text: 'Example: apply VAT to many items' },
      { type: 'ol', items: ['Put VAT rate 0.1925 (19.25%) in cell E1.', 'In F2 type =D2*$E$1 to multiply total by VAT rate.', 'Copy F2 down. $E$1 stays locked; D2 becomes D3, D4, etc.', 'Press F4 while editing to cycle through $B$2, B$2, $B2, B2.'] },
      { type: 'tip', text: 'Name a rate cell instead of absolute references: Formulas, Define Name, call E1 VAT_Rate. Then use =D2*VAT_Rate in formulas. Easier to read.' },
      { type: 'warning', text: 'Copying formulas across sheets or using cut/paste can break references. After major edits, spot-check a few calculated cells against a calculator.' },
      { type: 'try', text: 'Build a price list with a single discount rate in cell G1. Use absolute reference so every row applies the same discount. Change G1 and confirm all prices update.' },
      { type: 'keypoints', items: ['Relative references shift when you copy formulas (default).', 'Absolute references use $ to lock row and/or column.', 'Press F4 to toggle reference types while editing.', 'Use $E$1 for fixed rates, tax, or exchange rates.'] },
    ],
  },
  {
    slug: 'excel-charts',
    title: 'Excel Charts',
    description: 'Create clear charts from spreadsheet data to visualize sales, grades, survey results, and trends.',
    level: 'beginner',
    section: 'Excel Essentials',
    order: 14,
    minutes: 13,
    content: [
      { type: 'p', text: 'Charts turn numbers into visuals. A well-chosen chart helps a manager, teacher, or investor understand patterns quickly. Excel can build column, line, pie, and bar charts from your data in seconds.' },
      { type: 'h2', text: 'Create a chart step by step' },
      { type: 'ol', items: ['Enter data with headers: Month in column A, Sales in column B.', 'Select the data including headers (A1:B7).', 'Go to Insert, Recommended Charts or choose Column, Line, or Pie.', 'Pick a simple style. Avoid 3D effects for professional work.', 'Click the chart. Use Chart Design to add Chart Title and Axis Titles.', 'Move or resize the chart on the sheet or move to its own sheet.'] },
      {
        type: 'table',
        headers: ['Chart type', 'Best for', 'Example'],
        rows: [
          ['Column / Bar', 'Comparing categories', 'Sales by product'],
          ['Line', 'Trends over time', 'Monthly revenue'],
          ['Pie', 'Parts of a whole (few slices)', 'Budget allocation'],
          ['Stacked column', 'Composition over time', 'Expenses by category per month'],
        ],
      },
      {
        type: 'code',
        title: 'Sample data for a column chart',
        language: 'text',
        code: `Month      Sales (FCFA)
January    120000
February   95000
March      150000
April      180000
May        140000`
      },
      { type: 'h2', text: 'Chart design tips' },
      { type: 'ul', items: ['Title the chart clearly: "Monthly Sales, Q1 2026".', 'Label axes with units: FCFA, %, students, etc.', 'Use contrasting colors but keep a consistent palette.', 'Remove chart junk: excessive gridlines, legends for single series, 3D.', 'For presentations with projectors, use larger fonts on labels.'] },
      { type: 'note', text: 'Pie charts work poorly with more than five slices. Use a bar chart instead for many categories.' },
      { type: 'h3', text: 'Update charts when data changes' },
      { type: 'p', text: 'If your source data grows, click the chart and drag the colored outline on the sheet to include new rows. Alternatively, convert the source range to an Excel Table so the chart expands automatically when you add months or products.' },
      { type: 'tip', text: 'Click a chart and press Ctrl+C, then Ctrl+V in PowerPoint or Word to paste a linked or embedded chart into a report.' },
      { type: 'try', text: 'Chart your class scores or a weekly expense log. Try both column and line charts. Add titles and axis labels.' },
      { type: 'keypoints', items: ['Select data with headers before inserting a chart.', 'Column and bar charts compare categories; line charts show trends.', 'Add titles and axis labels; avoid cluttered 3D styles.', 'Copy charts into Word or PowerPoint for reports and slides.'] },
    ],
  },
  {
    slug: 'excel-tables-filters',
    title: 'Excel Tables and Filters',
    description: 'Convert data ranges to Excel Tables and use filters and sorting to analyze lists quickly.',
    level: 'beginner',
    section: 'Excel Essentials',
    order: 15,
    minutes: 12,
    content: [
      { type: 'p', text: 'An Excel Table is a formatted data range with automatic filters, banded rows, and formulas that expand when you add data. Filters let you show only rows that match criteria, such as one department or paid invoices.' },
      { type: 'h2', text: 'Create an Excel Table' },
      { type: 'ol', items: ['Click any cell in your data range with headers.', 'Press Ctrl+T (or Insert, Table).', 'Confirm the range includes headers. Check My table has headers.', 'Choose a table style. Click OK.', 'Notice filter dropdown arrows in each header cell.'] },
      { type: 'h2', text: 'Sort and filter' },
      { type: 'ul', items: ['Click the dropdown on a header. Sort A to Z or largest to smallest.', 'Uncheck Select All, then check one value to filter (for example one city).', 'Text Filters: Contains, Begins with (useful for partial names).', 'Number Filters: Greater than, top 10, above average.', 'Clear filter from the same menu to show all rows again.'] },
      {
        type: 'code',
        title: 'Example: employee list columns',
        language: 'text',
        code: `Name          | Department | City      | Salary (FCFA)
Jean Mbarga   | Finance    | Douala    | 250000
Amina N.      | HR         | Yaounde   | 220000
Paul E.       | Finance    | Douala    | 280000`
      },
      { type: 'h2', text: 'Benefits of Tables' },
      { type: 'ul', items: ['Structured references in formulas: =SUM(Table1[Salary]).', 'Automatic expansion when you type new rows at the bottom.', 'Total row: Table Design, Total Row adds SUM, AVERAGE, etc.', 'Consistent formatting and easy filtering without selecting ranges manually.'] },
      { type: 'tip', text: 'Rename your table (Table Design, Table Name) to something meaningful like Staff2026 instead of Table1. Formulas become easier to read.' },
      { type: 'note', text: 'Filters hide rows; they do not delete data. Hidden rows still appear in SUM if you reference whole columns outside the table. Prefer structured table totals for accuracy.' },
      { type: 'try', text: 'Convert a 20-row list to a Table. Filter by one department. Sort by salary descending. Turn on Total Row and sum salaries.' },
      { type: 'keypoints', items: ['Ctrl+T creates an Excel Table with filters and formatting.', 'Use header dropdowns to sort and filter data.', 'Tables expand automatically and support structured formulas.', 'Filters hide rows without deleting them.'] },
    ],
  },
  {
    slug: 'powerpoint-interface-layouts',
    title: 'PowerPoint Interface and Slide Layouts',
    description: 'Navigate PowerPoint, choose slide layouts, and build a structured presentation from a blank deck.',
    level: 'beginner',
    section: 'PowerPoint Essentials',
    order: 16,
    minutes: 12,
    content: [
      { type: 'p', text: 'Microsoft PowerPoint creates slide decks for classes, business pitches, training sessions, and church or community announcements. Good slides support what you say; they do not replace you as the speaker.' },
      { type: 'h2', text: 'PowerPoint window overview' },
      {
        type: 'table',
        headers: ['Area', 'Purpose'],
        rows: [
          ['Slide pane (left)', 'Thumbnail list of all slides'],
          ['Main slide area', 'Edit current slide content'],
          ['Notes pane (bottom)', 'Speaker notes (optional)'],
          ['Ribbon', 'Home, Insert, Design, Transitions, Animations'],
          ['Slide Show tab', 'Present from beginning or current slide'],
        ],
      },
      { type: 'h2', text: 'Slide layouts' },
      { type: 'p', text: 'Layouts are pre-built placeholders for titles, text, images, and charts. Right-click a slide, Layout, and choose Title Slide, Title and Content, Two Content, Section Header, or Blank.' },
      { type: 'ol', items: ['Start with Title Slide: presentation name and your name.', 'Add Title and Content slides for main points (one idea per slide).', 'Use Two Content for before/after or image plus bullets.', 'Use Section Header to divide chapters.', 'Avoid Title Only with tiny text crammed in; split into more slides instead.'] },
      { type: 'h3', text: 'Build a five-slide deck' },
      {
        type: 'code',
        title: 'Outline for a school project presentation',
        language: 'text',
        code: `Slide 1: Title - "Impact of Mobile Money in Rural Cameroon"
Slide 2: Problem - bullet points, max 4 lines
Slide 3: Method - how you collected data
Slide 4: Results - chart or key numbers
Slide 5: Conclusion and thank you`
      },
      { type: 'tip', text: 'Use the outline view (View, Outline View) to plan text before worrying about design. Structure first, visuals second.' },
      { type: 'note', text: 'Default slide size is widescreen 16:9. If presenting on an old projector, check Slide Size under Design and switch to Standard 4:3 if needed.' },
      { type: 'try', text: 'Create a six-slide presentation on a topic you know. Use at least three different layouts. Save to OneDrive.' },
      { type: 'keypoints', items: ['Slide layouts provide placeholders for titles, text, and media.', 'Use one main idea per slide with Title and Content layout.', 'Plan structure in Outline View before heavy design work.', 'Save early to OneDrive and match slide size to the display.'] },
    ],
  },
  {
    slug: 'powerpoint-design-speaker-notes',
    title: 'PowerPoint Design, Images, and Speaker Notes',
    description: 'Apply themes, use images effectively, and write speaker notes so your presentation looks professional and delivers well.',
    level: 'beginner',
    section: 'PowerPoint Essentials',
    order: 17,
    minutes: 13,
    content: [
      { type: 'p', text: 'Design choices affect credibility. A clean theme, readable fonts, and relevant images help audiences in bright classrooms or conference rooms follow your message. Speaker notes hold what you say while slides stay minimal.' },
      { type: 'h2', text: 'Apply a theme and keep consistency' },
      { type: 'ol', items: ['Open the Design tab.', 'Choose a theme (Office Theme or Variant for colors).', 'Use the same fonts throughout: one for titles, one for body.', 'Set font size: titles 32-40 pt, body 24-28 pt minimum for rooms.', 'Align objects: select multiple shapes, Shape Format, Align.'] },
      { type: 'h2', text: 'Images and icons' },
      { type: 'ol', items: ['Insert, Pictures or Stock Images (copyright-safe options).', 'One strong image per slide beats six small clipart images.', 'Crop distracting edges: Picture Format, Crop.', 'Add alt text: right-click image, Edit Alt Text.', 'Compress pictures for smaller file size before sharing on slow internet.'] },
      { type: 'h2', text: 'Speaker notes' },
      { type: 'p', text: 'Click Notes below the slide or View, Notes. Type what you will say, statistics to quote, and transitions between topics. Notes appear on your screen in Presenter View but not on the projector for the audience.' },
      {
        type: 'code',
        title: 'Example speaker notes for one slide',
        language: 'text',
        code: `Slide: "Results"
Notes:
- Mention sample size: 120 respondents in Bamenda
- Highlight 68% use mobile money weekly
- Pause for questions before conclusion slide
- Transition: "Next I will explain limitations..."`
      },
      { type: 'h2', text: 'Design rules for African classrooms and halls' },
      { type: 'ul', items: ['High contrast: dark text on light background or reverse with care.', 'Avoid full sentences on slides; use keywords only.', 'Test on the actual projector if possible; colors look different on walls.', 'Keep file size under 20 MB when emailing; use OneDrive links for large decks.'] },
      { type: 'warning', text: 'Do not read slides word for word. Audiences can read faster than you speak. Slides are anchors; notes carry the detail.' },
      { type: 'try', text: 'Redesign one cluttered slide: reduce text to four bullets, add one image, write speaker notes, and apply a consistent theme.' },
      { type: 'keypoints', items: ['Use Design themes and large readable fonts.', 'One focal image per slide with alt text.', 'Speaker notes hold your script; slides stay minimal.', 'Test contrast and file size for real presentation conditions.'] },
    ],
  },
  {
    slug: 'beginner-capstone-word-excel',
    title: 'Capstone: Word Report and Excel Sheet',
    description: 'Combine Word and Excel skills in a mini project: a one-page report with a supporting data table and chart.',
    level: 'beginner',
    section: 'Beginner Capstone',
    order: 18,
    minutes: 20,
    content: [
      { type: 'p', text: 'This capstone ties together OneDrive, Word formatting, Excel formulas, charts, and professional file naming. You will produce a short report on a real or fictional topic with a data appendix in Excel.' },
      { type: 'h2', text: 'Project brief' },
      { type: 'p', text: 'Topic example: "Monthly Study Group Expenses" or "Small Shop Sales Summary". Deliver two files in OneDrive: a Word report (one page) and an Excel workbook with data, formulas, and one chart.' },
      { type: 'h2', text: 'Part 1: Excel workbook' },
      { type: 'ol', items: ['Create 2026_Capstone_Data.xlsx in OneDrive/ School/ Capstone/.', 'At least two columns of data, 8+ rows (items, amounts, dates, or scores).', 'Use SUM and AVERAGE in a total row.', 'Use at least one IF formula (for example over/under budget).', 'Create a column or line chart with title and axis labels.', 'Format as Table with filters.'] },
      { type: 'h2', text: 'Part 2: Word report' },
      { type: 'ol', items: ['Create 2026_Capstone_Report.docx in the same folder.', 'Use Heading 1 for title, Heading 2 for sections: Introduction, Findings, Conclusion.', 'Write 150-250 words summarizing what the data shows.', 'Insert a table (3x3 minimum) or reference key numbers from Excel.', 'Add header with your name and footer with page number.', 'Optional: paste chart from Excel (copy chart, paste in Word).'] },
      { type: 'h2', text: 'Submission checklist' },
      {
        type: 'table',
        headers: ['Requirement', 'Done?'],
        rows: [
          ['Both files saved to OneDrive with clear names', ''],
          ['Excel: formulas, chart, table', ''],
          ['Word: styles, header/footer, one page', ''],
          ['Spelling and grammar checked (Review tab)', ''],
          ['Shared link tested (View only) with classmate', ''],
        ],
      },
      { type: 'tip', text: 'Work on Excel first. The Word report is easier when you already know the numbers and chart you will describe.' },
      { type: 'note', text: 'If internet fails, save locally and sync when connected. Add a comment in Word noting sync time if submitting close to a deadline.' },
      { type: 'try', text: 'Complete the full capstone and ask a peer to review using one Word comment and one suggested change. Revise and mark final versions v1.' },
      { type: 'keypoints', items: ['Capstone combines Excel data, formulas, charts, and a Word summary.', 'Use consistent folder and file naming in OneDrive.', 'Apply styles, headers, and tables for a professional look.', 'Review with a peer before considering the project complete.'] },
    ],
  },
];
