import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'excel-xlookup-vlookup',
    title: 'Excel XLOOKUP and VLOOKUP Intro',
    description: 'Look up values in large tables to pull prices, grades, or employee details without manual searching.',
    level: 'intermediate',
    section: 'Excel Power Skills',
    order: 19,
    minutes: 15,
    content: [
      { type: 'p', text: 'Lookup functions search a table and return a matching value. If you have a product code in one column and need the price from another sheet, VLOOKUP or XLOOKUP does it automatically. This saves hours on payroll, inventory, and student records.' },
      { type: 'h2', text: 'VLOOKUP basics' },
      { type: 'p', text: 'VLOOKUP searches the leftmost column of a range and returns a value from a column to the right. Syntax: =VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup]).' },
      {
        type: 'code',
        title: 'VLOOKUP example: product price',
        language: 'excel',
        code: `=VLOOKUP(A2, ProductTable, 3, FALSE)
A2 = product code to find
ProductTable = range including code and price columns
3 = return value from 3rd column of range
FALSE = exact match only`
      },
      { type: 'ol', items: ['Build a lookup table: codes in column A, names in B, prices in C.', 'Convert range to Table (Ctrl+T) named Products.', 'In your invoice sheet, type product code in A2.', 'In B2: =VLOOKUP(A2, Products, 2, FALSE) for name.', 'In C2: =VLOOKUP(A2, Products, 3, FALSE) for price.'] },
      { type: 'h2', text: 'XLOOKUP (modern alternative)' },
      { type: 'p', text: 'XLOOKUP is more flexible: search any column, return any column, handle missing values. Available in Microsoft 365 Excel. Syntax: =XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found]).' },
      {
        type: 'code',
        title: 'XLOOKUP examples',
        language: 'excel',
        code: `=XLOOKUP(A2, Products[Code], Products[Price])
=XLOOKUP(A2, Products[Code], Products[Name], "Not found")
=XLOOKUP(A2, Staff[Email], Staff[Department])`
      },
      {
        type: 'table',
        headers: ['Function', 'Pros', 'Cons'],
        rows: [
          ['VLOOKUP', 'Works in older Excel', 'Lookup column must be leftmost; fragile col index'],
          ['XLOOKUP', 'Simpler syntax, exact match default', 'Requires newer Excel / Microsoft 365'],
        ],
      },
      { type: 'warning', text: 'VLOOKUP with TRUE (approximate match) can return wrong results on unsorted data. For IDs and codes, always use FALSE or XLOOKUP.' },
      { type: 'tip', text: 'If XLOOKUP is not available, use INDEX/MATCH as a robust alternative: =INDEX(return_range, MATCH(lookup, lookup_range, 0)).' },
      { type: 'try', text: 'Create a price list of 10 items. Build an order form that pulls name and price by product code using VLOOKUP or XLOOKUP.' },
      { type: 'keypoints', items: ['Lookup functions match a key and return related data.', 'VLOOKUP searches the left column; XLOOKUP is more flexible.', 'Use exact match (FALSE) for IDs and product codes.', 'Name tables for readable, maintainable formulas.'] },
    ],
  },
  {
    slug: 'excel-pivot-tables',
    title: 'Excel Pivot Tables Intro',
    description: 'Summarize thousands of rows into clear reports with pivot tables for sales, attendance, and survey data.',
    level: 'intermediate',
    section: 'Excel Power Skills',
    order: 20,
    minutes: 16,
    content: [
      { type: 'p', text: 'A pivot table summarizes large datasets without writing complex formulas. Drag fields to Rows, Columns, Values, and Filters to answer questions like "total sales by region" or "average score by course".' },
      { type: 'h2', text: 'Create your first pivot table' },
      { type: 'ol', items: ['Prepare data: headers in row 1, no blank rows or columns in the middle.', 'Click any cell in the data. Insert, PivotTable.', 'Choose New Worksheet. Click OK.', 'In the PivotTable Fields pane, drag Region to Rows.', 'Drag Sales to Values (defaults to SUM).', 'Drag Product to Columns for a cross-tab if needed.'] },
      {
        type: 'code',
        title: 'Sample sales data columns',
        language: 'text',
        code: `Date       | Region  | Product  | Sales (FCFA)
2026-01-05 | Douala  | Rice     | 45000
2026-01-06 | Yaounde | Oil      | 32000
2026-01-07 | Douala  | Rice     | 51000`
      },
      { type: 'h2', text: 'Customize values' },
      { type: 'ul', items: ['Click the field in Values, Value Field Settings: change SUM to COUNT or AVERAGE.', 'Right-click a value, Show Values As, % of Grand Total for share analysis.', 'Add slicers: PivotTable Analyze, Insert Slicer for interactive filters (Region, Month).', 'Refresh data: PivotTable Analyze, Refresh after source data changes.'] },
      { type: 'h2', text: 'Common pivot table uses in Africa' },
      {
        type: 'table',
        headers: ['Scenario', 'Rows', 'Values', 'Insight'],
        rows: [
          ['NGO expenses', 'Category', 'SUM Amount', 'Where money goes'],
          ['School attendance', 'Class', 'COUNT Student', 'Enrollment by level'],
          ['Shop sales', 'Month', 'SUM Revenue', 'Seasonal trends'],
        ],
      },
      { type: 'note', text: 'Pivot tables need clean data. Fix merged cells, split combined fields, and remove totals rows from the source before creating the pivot.' },
      { type: 'tip', text: 'Double-click a pivot total cell to open the detail rows that make up that number (drill-down).' },
      { type: 'try', text: 'Build a pivot from 50+ rows of sample data. Show sum by one category and count by another. Add a slicer.' },
      { type: 'keypoints', items: ['Pivot tables summarize data by dragging fields to areas.', 'Use clean tabular data with headers and no blank rows.', 'Change aggregation from SUM to COUNT or AVERAGE as needed.', 'Refresh the pivot when source data updates.'] },
    ],
  },
  {
    slug: 'excel-data-cleaning',
    title: 'Excel Data Cleaning',
    description: 'Clean messy spreadsheets with Text to Columns, remove duplicates, trim spaces, and fix common import problems.',
    level: 'intermediate',
    section: 'Excel Power Skills',
    order: 21,
    minutes: 14,
    content: [
      { type: 'p', text: 'Data from WhatsApp exports, web forms, or old paper records often arrives messy: extra spaces, combined names and phones, duplicate rows, wrong date formats. Cleaning data before analysis prevents wrong pivot tables and charts.' },
      { type: 'h2', text: 'Text to Columns' },
      { type: 'ol', items: ['Select the column with combined text (for example "Jean Mbarga, 677123456").', 'Data tab, Text to Columns.', 'Choose Delimited, Next.', 'Check Comma or Space as delimiter, Next.', 'Set column data format (Text for phone numbers). Finish.', 'Insert columns if needed so split data does not overwrite existing cells.'] },
      { type: 'h2', text: 'Remove duplicates' },
      { type: 'ol', items: ['Select the data range including headers.', 'Data, Remove Duplicates.', 'Choose which columns define a duplicate (for example Email only).', 'Click OK. Excel reports how many duplicates were removed.'] },
      { type: 'h2', text: 'Other cleaning tricks' },
      {
        type: 'code',
        title: 'Useful cleaning formulas',
        language: 'excel',
        code: `=TRIM(A2)              (remove extra spaces)
=PROPER(A2)            (capitalize names)
=TEXT(B2,"0")          (force phone as text, no scientific notation)
=DATEVALUE(A2)         (convert text dates if locale allows)
=SUBSTITUTE(A2,"-","") (remove dashes from IDs)`
      },
      {
        type: 'table',
        headers: ['Problem', 'Symptom', 'Fix'],
        rows: [
          ['Leading zeros lost', 'Phone 0677123456 becomes 677123456', 'Format column as Text before entry'],
          ['Dates as text', 'Sort order wrong', 'Text to Columns or DATEVALUE'],
          ['Hidden spaces', 'VLOOKUP fails', 'TRIM both sides'],
          ['Duplicate entries', 'Inflated counts', 'Remove Duplicates'],
        ],
      },
      { type: 'warning', text: 'Always copy cleaned data to a new sheet or save a backup before Remove Duplicates. You cannot undo after closing the file in some cases.' },
      { type: 'tip', text: 'Use Find and Replace (Ctrl+H) to fix common typos: "Yaounde" vs "Younde", or standardize "FCFA" vs "cfa".' },
      { type: 'try', text: 'Import or type a messy list of 15 names with extra spaces and duplicate emails. Clean with TRIM, split phone numbers, and remove duplicates.' },
      { type: 'keypoints', items: ['Text to Columns splits combined fields by delimiter.', 'Remove Duplicates based on chosen key columns.', 'TRIM and PROPER fix spacing and capitalization.', 'Format phone and ID columns as Text before entering leading zeros.'] },
    ],
  },
  {
    slug: 'excel-conditional-formatting',
    title: 'Excel Conditional Formatting',
    description: 'Highlight cells automatically by rules, color scales, and data bars to spot trends and exceptions fast.',
    level: 'intermediate',
    section: 'Excel Power Skills',
    order: 22,
    minutes: 13,
    content: [
      { type: 'p', text: 'Conditional formatting changes cell appearance based on values or formulas. Red for overdue invoices, green for targets met, color scales for heat maps. Managers and teachers use it to scan large sheets without reading every number.' },
      { type: 'h2', text: 'Quick highlight rules' },
      { type: 'ol', items: ['Select the range (for example scores in B2:B30).', 'Home, Conditional Formatting, Highlight Cells Rules.', 'Choose Greater Than, enter 50, pick green fill for pass.', 'Add another rule Less Than 50 with red fill for fail.', 'Rules apply dynamically when values change.'] },
      { type: 'h2', text: 'Color scales and data bars' },
      { type: 'ul', items: ['Color Scales: gradient from low to high (useful for regional sales comparison).', 'Data Bars: horizontal bars inside cells showing relative size.', 'Icon Sets: arrows or traffic lights for KPI dashboards.', 'Top/Bottom Rules: highlight top 10% or bottom 5 items.'] },
      {
        type: 'code',
        title: 'Formula-based rule example',
        language: 'excel',
        code: `Select range A2:D20
Conditional Formatting > New Rule > Use a formula
Formula: =$D2<TODAY()
Format: red fill
(Highlights rows where date in column D is before today)`
      },
      { type: 'h2', text: 'Professional use cases' },
      {
        type: 'table',
        headers: ['Use case', 'Rule type', 'Benefit'],
        rows: [
          ['Stock below minimum', 'Cell less than threshold', 'Reorder alerts'],
          ['Budget variance', 'Formula compares actual vs plan', 'Overspend visible'],
          ['Attendance', 'Duplicate values highlight', 'Spot double entries'],
        ],
      },
      { type: 'note', text: 'Too many colors confuse readers. Use two or three meaningful colors and a legend in a dashboard or report cover slide.' },
      { type: 'tip', text: 'Conditional formatting copies with paste special if you paste formats only. Useful for monthly report templates.' },
      { type: 'try', text: 'Apply pass/fail colors to a grade column, data bars to sales, and a formula rule to flag dates in the past.' },
      { type: 'keypoints', items: ['Conditional formatting highlights cells by value or formula.', 'Use highlight rules for thresholds; color scales for gradients.', 'Formula rules can reference other columns (e.g. overdue dates).', 'Keep color schemes simple and meaningful.'] },
    ],
  },
  {
    slug: 'powerpoint-animations-transitions',
    title: 'PowerPoint Animations and Transitions',
    description: 'Add professional animations and slide transitions that support your message without distracting the audience.',
    level: 'intermediate',
    section: 'Presentation Skills',
    order: 23,
    minutes: 12,
    content: [
      { type: 'p', text: 'Transitions move between slides. Animations reveal content on one slide. Used well, they guide attention. Used poorly, they look gimmicky and slow down business or academic presentations.' },
      { type: 'h2', text: 'Transitions between slides' },
      { type: 'ol', items: ['Select a slide in the thumbnail pane.', 'Transitions tab, choose Fade or Push (subtle options).', 'Set Duration to 0.5-1 second. Avoid Flip, Cube, or random effects.', 'Click Apply to All only if every slide should behave the same.', 'Uncheck On Mouse Click if using automatic timing (rare in live talks).'] },
      { type: 'h2', text: 'Animations on slide content' },
      { type: 'ol', items: ['Select a bullet or chart element.', 'Animations tab, Add Animation, choose Appear or Fade.', 'Animation Pane (right side) shows order of effects.', 'Set Start: On Click for live control, or After Previous for sequenced reveals.', 'Use Wipe or Fly In sparingly; prefer Appear or Fade for text.'] },
      {
        type: 'table',
        headers: ['Do', 'Avoid'],
        rows: [
          ['Fade bullets one at a time while explaining', 'Spinning or bouncing text on every slide'],
          ['Animate one chart series to emphasize growth', 'Sound effects on transitions'],
          ['Consistent transition across deck', 'Different wild effect per slide'],
        ],
      },
      { type: 'h2', text: 'When animation helps' },
      { type: 'ul', items: ['Reveal process steps in order (procurement workflow).', 'Build a complex diagram piece by piece.', 'Show before and after on the same slide.', 'Emphasize one number on a crowded slide.'] },
      { type: 'warning', text: 'Heavy animation can lag on older laptops common in school labs. Test Slide Show on the machine you will use. Prefer simple fades.' },
      { type: 'tip', text: 'For investor or NGO board pitches, many presenters use no animation at all. Clarity beats flash.' },
      { type: 'try', text: 'Take a five-slide deck. Add Fade transition to all. Animate bullets On Click on two slides only. Present to a friend and ask if anything distracted them.' },
      { type: 'keypoints', items: ['Use subtle transitions like Fade; avoid flashy effects.', 'Animate to reveal content in logical order, not for decoration.', 'Control timing with Animation Pane and On Click.', 'Test performance on the actual presentation computer.'] },
    ],
  },
  {
    slug: 'delivering-presentations',
    title: 'Delivering Presentations',
    description: 'Present with confidence using Presenter View, timing, audience engagement, and handling Q&A in African settings.',
    level: 'intermediate',
    section: 'Presentation Skills',
    order: 24,
    minutes: 14,
    content: [
      { type: 'p', text: 'A strong deck fails if delivery is weak. Speaking clearly, managing time, and engaging the room matter whether you present in a university hall in Yaounde, a startup pitch in Lagos, or a Teams call with patchy internet.' },
      { type: 'h2', text: 'Before you present' },
      { type: 'ol', items: ['Rehearse aloud with a timer. Aim for 80% of allotted time to leave room for questions.', 'Check equipment: HDMI adapter, clicker, microphone, backup USB with PDF export.', 'Open Presenter View: Slide Show, Use Presenter View (needs second screen or projector).', 'Export PDF backup if PowerPoint might not open on venue PC.', 'Charge laptop; bring power cable for long sessions.'] },
      { type: 'h2', text: 'Presenter View features' },
      { type: 'ul', items: ['Current slide and next slide preview.', 'Speaker notes visible only to you.', 'Timer and elapsed time.', 'Pen and laser tools to highlight on screen.', 'Black or white screen (B or W key) to pause discussion.'] },
      { type: 'h2', text: 'Engaging the audience' },
      {
        type: 'table',
        headers: ['Technique', 'Example', 'Why it works'],
        rows: [
          ['Hook opening', 'Ask a question about mobile money use', 'Grabs attention immediately'],
          ['Pause after key stat', 'Wait 3 seconds after "68%"', 'Lets number sink in'],
          ['Eye contact', 'Scan left, center, right', 'Builds connection'],
          ['Summarize', 'Three takeaways at end', 'Aids memory'],
        ],
      },
      { type: 'h2', text: 'Handling challenges' },
      { type: 'ul', items: ['Projector fails: switch to PDF on another laptop or describe slides verbally.', 'Running over time: skip optional slides marked in notes as backup.', 'Difficult question: "I will verify and follow up" beats guessing.', 'Low engagement: ask a show of hands poll related to your topic.'] },
      { type: 'note', text: 'In multilingual rooms, speak slightly slower and define acronyms. Repeat key numbers.' },
      { type: 'try', text: 'Deliver a 5-minute presentation to two classmates. Use Presenter View and notes. Get feedback on pace, volume, and eye contact.' },
      { type: 'keypoints', items: ['Rehearse with timer and test room equipment early.', 'Presenter View shows notes, timer, and next slide.', 'Engage with hooks, pauses, and clear summaries.', 'Have PDF backup and a plan for technical failures.'] },
    ],
  },
  {
    slug: 'outlook-mail-inbox',
    title: 'Outlook Mail: Inbox Habits and Search',
    description: 'Manage email overload with folders, focused inbox, search, and habits that keep school and work communication under control.',
    level: 'intermediate',
    section: 'Outlook Essentials',
    order: 25,
    minutes: 13,
    content: [
      { type: 'p', text: 'Outlook is the email and calendar hub for many organizations. Students use it for university mail; professionals use it daily. Without habits, inbox becomes a stressful pile of unread messages.' },
      { type: 'h2', text: 'Inbox Zero habits (practical version)' },
      { type: 'ol', items: ['Process email in batches 2-3 times per day, not constantly.', 'For each message: delete, archive, reply, or move to a folder.', 'If reply takes more than 2 minutes, flag and schedule time later.', 'Unsubscribe from newsletters you never read.', 'Use Focused Inbox (Outlook separates important vs other).'] },
      { type: 'h2', text: 'Folders and categories' },
      { type: 'ul', items: ['Create folders: Action, Waiting, Reference, Archive by project or course.', 'Drag messages or right-click, Move. Rules can auto-file (next lesson).', 'Categories: color tags like @Red Urgent, @Blue School without moving mail.', 'Pin important threads to top in some Outlook versions.'] },
      { type: 'h2', text: 'Search effectively' },
      {
        type: 'code',
        title: 'Outlook search operators',
        language: 'text',
        code: `from:professor@university.edu
subject:assignment
hasattachment:yes
received:last week
folder:inbox internship
"exact phrase"`
      },
      { type: 'h2', text: 'Email etiquette for African workplaces' },
      {
        type: 'table',
        headers: ['Practice', 'Why'],
        rows: [
          ['Clear subject line', 'Helps recipient prioritize on mobile data'],
          ['Greeting and sign-off', 'Shows professionalism'],
          ['Attach or OneDrive link for large files', 'Avoids bounced emails over size limit'],
          ['Reply all only when needed', 'Reduces noise for entire team'],
        ],
      },
      { type: 'tip', text: 'When internet is expensive, download attachments on Wi-Fi and read offline. Outlook mobile supports offline folders.' },
      { type: 'try', text: 'Create three folders and move 20 old emails. Find all messages from one sender using search. Write one email with a clear subject and attachment.' },
      { type: 'keypoints', items: ['Batch-process email; decide delete, file, or act on each item.', 'Use folders and categories to organize by project or course.', 'Search operators find mail faster than scrolling.', 'Professional subject lines and attachments matter on slow networks.'] },
    ],
  },
  {
    slug: 'outlook-calendar-meetings',
    title: 'Outlook Calendar and Meeting Invites',
    description: 'Schedule meetings, send invites, manage time zones, and use calendar sharing for teams and study groups.',
    level: 'intermediate',
    section: 'Outlook Essentials',
    order: 26,
    minutes: 14,
    content: [
      { type: 'p', text: 'Outlook Calendar coordinates your schedule with others. Send meeting invites with Teams links, book rooms, set reminders, and avoid double-booking when juggling classes, work, and family commitments.' },
      { type: 'h2', text: 'Create an event or meeting' },
      { type: 'ol', items: ['Open Calendar in Outlook or outlook.com.', 'Click New Event or double-click a time slot.', 'Add title, location (room name or Teams meeting).', 'Set start and end time. Check time zone if attendees are abroad.', 'Add attendees in the Required or Optional field.', 'Write agenda in the description. Click Send.'] },
      { type: 'h2', text: 'Teams meeting from Outlook' },
      { type: 'p', text: 'In the meeting form, click Teams Meeting. Outlook adds a Join link automatically. Attendees in Cameroon, Europe, or North America click the link at the scheduled time. Test audio before important calls.' },
      {
        type: 'table',
        headers: ['Field', 'Good example', 'Poor example'],
        rows: [
          ['Title', 'CSC150 Group Project Sync', 'Meeting'],
          ['Agenda', '1. Divide tasks 2. Deadline review', 'Blank'],
          ['Duration', '30 min with end time', 'Open-ended 2 hours'],
        ],
      },
      { type: 'h2', text: 'Respond to invites' },
      { type: 'ul', items: ['Accept, Tentative, or Decline promptly.', 'Propose New Time if conflict (Outlook suggests alternatives).', 'Add to calendar on phone so reminders work offline after sync.'] },
      { type: 'h3', text: 'Sharing calendars' },
      { type: 'p', text: 'Right-click your calendar, Sharing and permissions. Share with view or edit rights for assistants or family. Free/busy view hides details but shows availability.' },
      { type: 'note', text: 'Africa has one time zone band (WAT, CAT, EAT) but countries differ. Confirm WAT vs CAT when scheduling across Nigeria and Cameroon.' },
      { type: 'tip', text: 'Set default reminder 15 minutes before. For exams or flights, set multiple reminders days ahead.' },
      { type: 'try', text: 'Schedule a 30-minute study group meeting with two classmates. Include Teams link and three-point agenda. Accept your own invite and verify it appears on mobile.' },
      { type: 'keypoints', items: ['Create meetings with title, agenda, time zone, and attendees.', 'Teams Meeting button adds a video link automatically.', 'Respond Accept/Decline promptly; propose new time if needed.', 'Share calendars for coordination without exposing every detail.'] },
    ],
  },
  {
    slug: 'outlook-rules-signatures',
    title: 'Outlook Rules and Signatures',
    description: 'Automate inbox sorting with rules and create professional email signatures for school and work.',
    level: 'intermediate',
    section: 'Outlook Essentials',
    order: 27,
    minutes: 12,
    content: [
      { type: 'p', text: 'Rules move or flag mail automatically. Signatures add your name, title, and contact info to every message. Both save time and present a consistent professional image.' },
      { type: 'h2', text: 'Create a mail rule' },
      { type: 'ol', items: ['Home tab, Rules, Create Rule (or Manage Rules).', 'Choose condition: from specific person, subject contains, has attachment.', 'Choose action: move to folder, mark as read, forward to delegate.', 'Name the rule. Run on existing messages if desired.', 'Example: If subject contains "Invoice", move to Finance folder.'] },
      {
        type: 'code',
        title: 'Example rules for students',
        language: 'text',
        code: `Rule 1: From @university.edu -> Folder "University"
Rule 2: Subject contains "Internship" -> Flag red
Rule 3: Newsletter from X -> Move to "Newsletters" or Delete`
      },
      { type: 'h2', text: 'Email signatures' },
      { type: 'ol', items: ['File, Options, Mail, Signatures (desktop) or Settings, Mail, Compose on web.', 'New signature. Name it Work or School.', 'Include: full name, program or job title, phone, LinkedIn optional.', 'Keep images small (logo under 50 KB) for mobile recipients.', 'Assign to New messages and Replies/forwards.'] },
      {
        type: 'code',
        title: 'Sample signature',
        language: 'text',
        code: `Marie Tchinda
BSc Computer Science | University of Buea
+237 6XX XXX XXX | marie.t@student.ubuea.cm`
      },
      { type: 'h3', text: 'Test rules safely' },
      { type: 'p', text: 'Create a test folder called Rules_Test before running rules on your whole inbox. Apply the rule to one sender first. Check the folder after 24 hours, then enable the rule for all matching mail once it behaves correctly.' },
      { type: 'warning', text: 'Do not auto-forward all work email to personal Gmail without employer permission. Confidential data may leave approved systems.' },
      { type: 'tip', text: 'Use different signatures for internal vs external mail if your org requires legal disclaimers on outbound messages.' },
      { type: 'try', text: 'Create one rule that files newsletters and one signature for job applications. Send a test email to yourself.' },
      { type: 'keypoints', items: ['Rules automate filing, flagging, and forwarding based on conditions.', 'Signatures should be short, readable, and mobile-friendly.', 'Test rules on a few messages before applying to entire inbox.', 'Follow employer policy on forwarding and external signatures.'] },
    ],
  },
  {
    slug: 'teams-chats-channels',
    title: 'Teams: Chats, Channels, and Mentions',
    description: 'Use Microsoft Teams for class and work communication with chats, team channels, and @mentions.',
    level: 'intermediate',
    section: 'Teams Collaboration',
    order: 28,
    minutes: 14,
    content: [
      { type: 'p', text: 'Microsoft Teams combines chat, meetings, and file sharing. Schools create Teams for courses; companies create Teams for departments. Understanding chats vs channels prevents lost messages and notification overload.' },
      { type: 'h2', text: 'Chat vs channel' },
      {
        type: 'table',
        headers: ['Feature', 'Chat', 'Channel'],
        rows: [
          ['Scope', '1:1 or small group private', 'Whole team, topic-based'],
          ['Best for', 'Quick questions, private talk', 'Project updates, shared resources'],
          ['Files', 'Shared in chat thread', 'Files tab per channel'],
          ['Visibility', 'Participants only', 'All team members'],
        ],
      },
      { type: 'h2', text: 'Working in channels' },
      { type: 'ol', items: ['Join a team via link from teacher or manager.', 'Use General for announcements; use named channels (Assignments, Resources) for topics.', 'Post in the Posts tab. Start a new conversation for new topics; reply in thread for follow-up.', 'Pin important messages. Save messages for later (bookmark icon).'] },
      { type: 'h2', text: '@mentions and notifications' },
      { type: 'ul', items: ['@person name notifies one person.', '@team name notifies everyone (use sparingly).', '@channel notifies channel members.', 'Set notification settings: Settings, Notifications, mute channels you only read occasionally.'] },
      { type: 'h3', text: 'Formatting messages' },
      { type: 'p', text: 'Use bold, lists, and code blocks in the compose box. Attach files from OneDrive or upload. GIFs are fine in casual student teams; avoid in formal client channels.' },
      { type: 'note', text: 'Mobile data costs matter. Download large files on Wi-Fi. Teams compresses some media but video previews still consume data.' },
      { type: 'tip', text: 'Search (Ctrl+E) finds messages, files, and people across Teams. Faster than scrolling old channels.' },
      { type: 'try', text: 'In a practice team, post in a channel with a threaded reply. @mention one person. Upload a file to the Files tab.' },
      { type: 'keypoints', items: ['Chats are private; channels are team-wide and topic-based.', 'Reply in threads to keep conversations organized.', '@mentions notify people; use team-wide mentions rarely.', 'Adjust notifications and use search to manage volume.'] },
    ],
  },
  {
    slug: 'teams-meetings-recording',
    title: 'Teams Meetings, Screen Share, and Recording',
    description: 'Join and host Teams meetings, share your screen safely, and follow recording etiquette for class and work.',
    level: 'intermediate',
    section: 'Teams Collaboration',
    order: 29,
    minutes: 15,
    content: [
      { type: 'p', text: 'Teams meetings replaced many in-person classes and client calls. Knowing how to join, share content, mute, and record (when allowed) makes you effective on slow internet and mobile connections.' },
      { type: 'h2', text: 'Join and host a meeting' },
      { type: 'ol', items: ['Click Join in calendar invite or Teams calendar.', 'Choose camera and microphone. Turn off video on weak connection.', 'Use background blur if available and background is distracting.', 'Host: admit participants from lobby if enabled.', 'Use Raise Hand and Chat for questions without interrupting.'] },
      { type: 'h2', text: 'Screen sharing' },
      { type: 'ul', items: ['Share, choose Window (one app) or Entire Screen.', 'Prefer Window when showing Excel or PowerPoint to avoid notification popups.', 'Include computer sound only when playing a video clip.', 'Stop sharing immediately after demo. Accidental share of private email is a common mistake.'] },
      { type: 'h2', text: 'Recording etiquette' },
      {
        type: 'table',
        headers: ['Rule', 'Reason'],
        rows: [
          ['Ask permission before recording', 'Legal and cultural respect'],
          ['Announce recording at start', 'Transparency for all participants'],
          ['Know school/employer policy', 'Some ban recording without consent'],
          ['Store recordings in approved location', 'Often Teams cloud or SharePoint'],
        ],
      },
      { type: 'h2', text: 'Tips for low bandwidth' },
      { type: 'ol', items: ['Turn off incoming video (View, disable video for participants).', 'Use phone for audio only, computer for screen share if needed.', 'Close other apps using internet.', 'Download shared files after call instead of streaming repeatedly.'] },
      { type: 'warning', text: 'Never share meeting links publicly on social media. Use lobby and authenticated join for sensitive discussions.' },
      { type: 'try', text: 'Host a 15-minute practice meeting with a friend. Share one PowerPoint window, use mute/unmute, and practice Raise Hand.' },
      { type: 'keypoints', items: ['Join early to test audio; disable video on slow links.', 'Share a single window, not whole screen, when possible.', 'Get consent before recording; follow org policy.', 'Optimize bandwidth by limiting video and closing background apps.'] },
    ],
  },
  {
    slug: 'teams-files-onedrive',
    title: 'Teams Files and OneDrive Together',
    description: 'Understand how Teams stores files in SharePoint and OneDrive and collaborate without creating duplicate copies.',
    level: 'intermediate',
    section: 'Teams Collaboration',
    order: 30,
    minutes: 13,
    content: [
      { type: 'p', text: 'Files shared in Teams channels live in SharePoint behind the scenes. Files you upload in chat may go to your OneDrive. Knowing where files live helps you find them after a course ends or a project closes.' },
      { type: 'h2', text: 'Where Teams files are stored' },
      {
        type: 'table',
        headers: ['Action', 'Storage location', 'Who sees it'],
        rows: [
          ['Upload to channel Files tab', 'Team SharePoint site', 'All team members'],
          ['Share in group chat', 'Uploader OneDrive', 'Chat participants'],
          ['Attach in meeting chat', 'Often OneDrive or SharePoint', 'Meeting attendees'],
        ],
      },
      { type: 'h2', text: 'Open and edit from Teams' },
      { type: 'ol', items: ['Go to team channel, Files tab.', 'Click file to open in Word/Excel online or desktop.', 'Co-edit with teammates in real time.', 'Sync library: Open in SharePoint, Sync to sync folder to PC via OneDrive app.', 'Version history available from file menu (covered in advanced lessons).'] },
      { type: 'h2', text: 'Avoid duplicate confusion' },
      { type: 'ul', items: ['Work from the channel copy when collaborating, not a downloaded duplicate on Desktop.', 'If you must download, rename with date and upload back when done.', 'Use "Open in Teams" links in chat instead of emailing attachments.', 'Pin important files in channel for quick access.'] },
      { type: 'note', text: 'When a university deletes a team after graduation, files may be removed. Copy personal portfolio pieces to your own OneDrive before leaving.' },
      { type: 'h3', text: 'Find files after a Teams search' },
      { type: 'p', text: 'Use the Files app in Teams left rail to see recent files across all teams. Filter by file type or person. This helps when you remember editing an Excel file but forgot which channel it was in.' },
      { type: 'tip', text: 'In OneDrive web, look under Shared to find files others shared with you from Teams chats.' },
      { type: 'try', text: 'Upload a document to a team channel. Edit with a partner simultaneously. Find the same file in SharePoint or OneDrive web.' },
      { type: 'keypoints', items: ['Channel files live in SharePoint; chat files often in OneDrive.', 'Co-edit in Teams or Office online to avoid version chaos.', 'Sync team libraries to your PC through OneDrive app.', 'Copy important files to personal OneDrive before team deletion.'] },
    ],
  },
  {
    slug: 'onenote-class-work-notes',
    title: 'OneNote for Class and Work Notes',
    description: 'Organize lecture notes, meeting minutes, and project research in OneNote notebooks synced across devices.',
    level: 'intermediate',
    section: 'Productivity Apps',
    order: 31,
    minutes: 13,
    content: [
      { type: 'p', text: 'OneNote is a digital notebook with sections and pages. Type, draw, clip web pages, and search handwriting. It syncs through OneDrive and works offline on mobile during commutes or power outages.' },
      { type: 'h2', text: 'Notebook structure' },
      {
        type: 'code',
        title: 'Example student notebook',
        language: 'text',
        code: `Notebook: 2026 University
  Section: MAT101
    Page: Lecture 1 - Introduction
    Page: Lecture 2 - Algebra
  Section: CSC150
    Page: Lab 3 - Excel
  Section: Personal Admin
    Page: Registration deadlines`
      },
      { type: 'h2', text: 'Create and organize notes' },
      { type: 'ol', items: ['Open OneNote desktop, web, or mobile.', 'Create notebook stored on OneDrive (not only local).', 'Add sections by course or project. Add pages per lecture or meeting.', 'Use headings (Ctrl+Alt+1) and tags (Important, Question) for review.', 'Insert tables, files, PDF printouts, and meeting details from Outlook.'] },
      { type: 'h2', text: 'Useful features' },
      { type: 'ul', items: ['Search across all notebooks for a keyword.', 'Audio recording linked to typed notes during lecture.', 'Draw with stylus or finger on tablet; convert handwriting to text.', 'Share notebook section with study group for shared revision notes.'] },
      { type: 'tip', text: 'Use a consistent page template: date, topic, learning objectives, summary box at bottom for exam revision.' },
      { type: 'h3', text: 'Offline notes during power cuts' },
      { type: 'p', text: 'OneNote mobile and desktop cache recent notebooks. Continue typing during short outages; changes sync when power and internet return. Mark pages with a sync pending icon and verify sync before deleting local copies.' },
      { type: 'note', text: 'OneNote is not ideal for heavy calculations; link to Excel files instead of huge tables in notes.' },
      { type: 'try', text: 'Create a notebook with two sections and five pages. Tag two items as Question. Search for a word and insert a meeting note from Outlook if available.' },
      { type: 'keypoints', items: ['Notebooks contain sections and pages; store on OneDrive for sync.', 'Use tags and search for revision and follow-ups.', 'Combine typing, drawing, audio, and file attachments.', 'Share sections for collaborative study notes.'] },
    ],
  },
  {
    slug: 'microsoft-forms-surveys',
    title: 'Microsoft Forms for Surveys and Quizzes',
    description: 'Build surveys, feedback forms, and simple quizzes with Microsoft Forms and collect responses in Excel.',
    level: 'intermediate',
    section: 'Productivity Apps',
    order: 32,
    minutes: 14,
    content: [
      { type: 'p', text: 'Microsoft Forms lets you create questionnaires without coding. Teachers use it for quizzes; NGOs for field surveys; student groups for event registration. Responses export to Excel for analysis.' },
      { type: 'h2', text: 'Create a form step by step' },
      { type: 'ol', items: ['Go to forms.office.com and sign in.', 'New Form or New Quiz (quiz adds points and correct answers).', 'Add question: Choice, Text, Rating, Date, Likert scale.', 'Toggle Required on important questions.', 'Theme button to apply colors and logo.', 'Collect responses, copy link, share via WhatsApp, email, or Teams.'] },
      { type: 'h2', text: 'Question types' },
      {
        type: 'table',
        headers: ['Type', 'Use for', 'Example'],
        rows: [
          ['Choice', 'Single or multiple select', 'Which faculty are you in?'],
          ['Text', 'Short or long answer', 'Suggest improvements'],
          ['Rating', 'Satisfaction 1-5', 'Rate the workshop'],
          ['Date', 'Event signup', 'Preferred interview date'],
        ],
      },
      { type: 'h2', text: 'Quiz mode for teachers' },
      { type: 'ol', items: ['Create New Quiz.', 'Add question, mark correct answer, assign points.', 'Settings: start/end date, shuffle questions, show score after submit.', 'Assign in Teams: Assignments tab can link Forms quiz to class team.'] },
      { type: 'h2', text: 'Analyze responses' },
      { type: 'p', text: 'Open Responses tab for charts per question. Click Open in Excel for full export. Clean and pivot in Excel (use skills from earlier lessons).' },
      { type: 'tip', text: 'Keep forms short on mobile. Long surveys have higher drop-off on expensive data plans.' },
      { type: 'warning', text: 'Do not collect passwords, bank PINs, or national ID numbers in unsecured forms. Follow data protection rules for your organization.' },
      { type: 'try', text: 'Create a 5-question feedback form for a fictional event. Submit two test responses and export to Excel.' },
      { type: 'keypoints', items: ['Forms builds surveys and quizzes with shareable links.', 'Quizzes support scoring and correct answers for education.', 'Responses analyze in Forms or export to Excel.', 'Keep forms short and avoid collecting sensitive data.'] },
    ],
  },
  {
    slug: 'sharing-securely',
    title: 'Sharing Securely: Internal vs External',
    description: 'Share Microsoft 365 files safely with classmates, clients, and partners inside and outside your organization.',
    level: 'intermediate',
    section: 'Productivity Apps',
    order: 33,
    minutes: 13,
    content: [
      { type: 'p', text: 'Sharing is easy; sharing safely is harder. Wrong permissions leak grades, contracts, or patient data. Learn when to share inside your organization only, when guests are OK, and how link settings affect risk.' },
      { type: 'h2', text: 'Internal vs external sharing' },
      {
        type: 'table',
        headers: ['Type', 'Who', 'Typical setting'],
        rows: [
          ['Internal', 'Same school or company tenant', 'People in organization with link'],
          ['External', 'Personal Gmail, other universities', 'Specific people or guest access'],
          ['Anonymous', 'Anyone with link, no sign-in', 'Highest risk; avoid for private data'],
        ],
      },
      { type: 'h2', text: 'Secure sharing checklist' },
      { type: 'ol', items: ['Classify data: public, internal, confidential.', 'Use Specific people for confidential files.', 'Prefer View only unless editing is required.', 'Set expiration date on links for temporary access.', 'Revoke access when project ends: Manage Access on file.'] },
      { type: 'h2', text: 'Guest access in Teams' },
      { type: 'p', text: 'External collaborators can join a team as guests with limited rights. IT admins control whether guests are allowed. Never invite unknown emails from spam.' },
      { type: 'h3', text: 'Common mistakes in Africa' },
      { type: 'ul', items: ['Posting OneDrive "Anyone" links in public Facebook groups.', 'Forwarding edit links for CV templates that get vandalized.', 'Leaving intern access after internship ends.', 'Sharing entire folder when only one file was needed.'] },
      { type: 'warning', text: 'WhatsApp forwards can spread private links globally. Treat every share link like a key. Use password-protected PDF for highly sensitive one-time sends when policy allows.' },
      { type: 'tip', text: 'Audit sharing: right-click file, Manage Access, see all people and links. Remove stale entries monthly.' },
      { type: 'try', text: 'Share a file three ways: internal view, specific external view, and note why you would not use Anyone link. Revoke one link after testing.' },
      { type: 'keypoints', items: ['Match sharing level to data sensitivity.', 'Specific people and View only are safest defaults.', 'Set link expiration and revoke access when done.', 'Audit Manage Access regularly; avoid public Anyone links.'] },
    ],
  },
  {
    slug: 'intermediate-capstone-schedule-teams',
    title: 'Intermediate Project: Schedule Workbook and Teams Plan',
    description: 'Build a class schedule Excel workbook and document a Teams channel plan for a group project.',
    level: 'intermediate',
    section: 'Intermediate Capstone',
    order: 34,
    minutes: 25,
    content: [
      { type: 'p', text: 'This project combines Excel lookups or pivots, conditional formatting, and Teams collaboration design. You will deliver a workbook plus a short planning document for how your team will work in Microsoft 365.' },
      { type: 'h2', text: 'Part A: Class schedule workbook' },
      { type: 'ol', items: ['Create 2026_Schedule_Project.xlsx in OneDrive.', 'Sheet 1: weekly timetable (courses, times, rooms, lecturers).', 'Sheet 2: assignment tracker (course, due date, status, priority).', 'Use at least one lookup or pivot summarizing hours per course.', 'Apply conditional formatting for overdue assignments (date before today).', 'Include a chart: hours per course or assignments by status.'] },
      { type: 'h2', text: 'Part B: Teams channel plan (Word or OneNote)' },
      { type: 'ol', items: ['Document team name and purpose (real group project or simulated).', 'List channels: General, Tasks, Resources, Meetings (explain each).', 'Write posting rules: what goes in chat vs channel, @mention policy.', 'Meeting cadence: weekly 30-min sync, who takes notes.', 'File strategy: which docs live in channel Files vs personal OneDrive.'] },
      {
        type: 'code',
        title: 'Teams plan outline',
        language: 'text',
        code: `Team: CSC150 Group 4
Channels:
  General - announcements only
  Tasks - weekly updates, blockers
  Resources - briefs, data files
Meetings: Tuesdays 18:00 WAT, 30 min
Files: Master Excel in channel; drafts in OneDrive`
      },
      { type: 'h2', text: 'Rubric' },
      {
        type: 'table',
        headers: ['Criteria', 'Points focus'],
        rows: [
          ['Excel accuracy and formulas', 'Lookups/pivot work correctly'],
          ['Visual clarity', 'Formatting, chart, conditional rules'],
          ['Teams plan completeness', 'Channels, rules, meetings defined'],
          ['Professional naming', 'Files in organized OneDrive folder'],
        ],
      },
      { type: 'tip', text: 'Create a real Teams team with classmates if allowed. Otherwise write the plan as if the team existed; instructors value realistic structure.' },
      { type: 'note', text: 'Submit share links with View permission for grading unless edit is required. Test links in a private browser window.' },
      { type: 'try', text: 'Complete both deliverables and peer-review another student plan with two Word comments on clarity and security.' },
      { type: 'keypoints', items: ['Excel workbook demonstrates lookup/pivot and conditional formatting.', 'Teams plan defines channels, rules, and file strategy.', 'Use realistic collaboration policies for African student teams.', 'Test share links and file organization before submission.'] },
    ],
  },
];
