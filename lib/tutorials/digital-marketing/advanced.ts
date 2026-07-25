import type { TutorialLesson } from '../types';

export const advancedLessons: TutorialLesson[] = [
  {
    slug: 'dm-strategy-framework',
    title: 'Full-Funnel Strategy Framework',
    description:
      'Build a complete marketing strategy across awareness, consideration, conversion, retention, and referral.',
    level: 'advanced',
    section: 'Pro Strategy',
    order: 49,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Advanced digital marketing starts with a system. A full-funnel strategy connects the people you want to reach, the problem they feel, the channels they use, the proof they need, and the action you want them to take.',
      },
      {
        type: 'p',
        text: 'A beginner often asks, "What should we post?" A strategist asks, "Where is demand leaking, and what message, offer, or experience will move the right audience to the next step?"',
      },
      { type: 'h2', text: 'The five funnel stages' },
      {
        type: 'table',
        headers: ['Stage', 'Audience state', 'Marketing job', 'Example metric'],
        rows: [
          ['Awareness', 'They do not know you yet', 'Create relevant reach and memory', 'Qualified reach, branded search lift'],
          ['Consideration', 'They know the problem and compare options', 'Educate, differentiate, and build trust', 'Content engagement, return visits'],
          ['Conversion', 'They are close to action', 'Reduce friction and increase confidence', 'Lead rate, trial starts, purchases'],
          ['Retention', 'They already bought or joined', 'Increase value, usage, and repeat behavior', 'Repeat purchase, active users, churn'],
          ['Referral', 'They can spread the product', 'Make sharing easy and rewarding', 'Reviews, referrals, social shares'],
        ],
      },
      { type: 'h2', text: 'Start with business objective, not channel' },
      {
        type: 'p',
        text: 'A good strategy translates business goals into marketing goals. Revenue might require more qualified leads. Qualified leads might require stronger positioning, better targeting, or a landing page that explains the offer more clearly.',
      },
      {
        type: 'ol',
        items: [
          'Define the business outcome: revenue, pipeline, retention, market share, launch adoption, or community growth.',
          'Identify the customer segment that can produce that outcome fastest.',
          'Map the customer journey from first trigger to repeat value.',
          'Choose the biggest bottleneck in that journey.',
          'Design campaigns that fix the bottleneck before adding more tactics.',
        ],
      },
      { type: 'h2', text: 'Full-funnel planning canvas' },
      {
        type: 'table',
        headers: ['Question', 'What to write', 'Example'],
        rows: [
          ['Who is this for?', 'Segment and situation', 'Freelance designers who need faster client approvals'],
          ['What trigger starts demand?', 'Moment of pain or ambition', 'A client requests another revision by email'],
          ['What promise matters?', 'Outcome in plain language', 'Collect approvals in one organized workspace'],
          ['What proof is needed?', 'Evidence that lowers risk', 'Before and after workflow, testimonials, case study'],
          ['What action comes next?', 'One clear conversion step', 'Start a free project board'],
        ],
      },
      { type: 'h2', text: 'Metrics by funnel layer' },
      {
        type: 'p',
        text: 'Use different metrics for different jobs. Awareness metrics should not be judged like sales metrics, and conversion metrics should not ignore lead quality.',
      },
      {
        type: 'table',
        headers: ['Layer', 'Primary metric', 'Quality check'],
        rows: [
          ['Reach', 'Impressions or unique reach', 'Is the audience actually relevant?'],
          ['Traffic', 'Sessions or clicks', 'Do visitors stay, scroll, or return?'],
          ['Leads', 'Conversion rate and lead volume', 'Do leads match the ideal customer profile?'],
          ['Sales', 'CAC, ROAS, pipeline, revenue', 'Are deals profitable and retained?'],
          ['Retention', 'Repeat purchase, activation, churn', 'Are customers getting value after conversion?'],
        ],
      },
      {
        type: 'note',
        text: 'A funnel is not always linear. People may discover you on social, search your brand later, read reviews, join an email list, and convert weeks later. The framework helps you design for that messy reality.',
      },
      { type: 'h2', text: 'Strategy before campaign: the one-page brief' },
      {
        type: 'code',
        title: 'Full-funnel strategy brief',
        language: 'text',
        code: `Business goal:
Primary audience:
Audience pain or desire:
Positioning promise:
Main offer:
Funnel bottleneck:
Awareness channels:
Consideration content:
Conversion path:
Retention or referral motion:
Primary KPI:
Guardrail metrics:
Testing plan:
Budget and timeline:`,
      },
      {
        type: 'try',
        text: 'Choose a product you know. Fill the one-page brief, then circle the single funnel bottleneck you would fix first.',
      },
      {
        type: 'keypoints',
        items: [
          'A full-funnel strategy connects audience, message, channel, offer, and measurement.',
          'Different funnel stages need different content, metrics, and expectations.',
          'The best campaign usually fixes a specific journey bottleneck.',
          'Retention and referral are part of marketing strategy, not afterthoughts.',
        ],
      },
    ],
  },
  {
    slug: 'dm-budget-planning',
    title: 'Budget Planning & Channel Mix',
    description:
      'Plan marketing budgets across paid, owned, earned, and experimental channels with clear goals and measurement rules.',
    level: 'advanced',
    section: 'Pro Strategy',
    order: 50,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Budget planning is the discipline of deciding where money, time, creative energy, and attention should go. A budget is not only ad spend. It includes tools, content production, freelancers, testing, analytics, and the time needed to manage campaigns.',
      },
      {
        type: 'p',
        text: 'A strong channel mix balances short-term demand capture with long-term demand creation. If all spend goes to bottom-funnel ads, growth becomes expensive. If all effort goes to awareness, revenue may arrive too slowly.',
      },
      { type: 'h2', text: 'The four budget buckets' },
      {
        type: 'table',
        headers: ['Bucket', 'Purpose', 'Examples'],
        rows: [
          ['Demand capture', 'Reach people already looking', 'Search ads, SEO pages, comparison pages, retargeting'],
          ['Demand creation', 'Make more people care over time', 'Social content, video, partnerships, PR, creator campaigns'],
          ['Conversion improvement', 'Turn traffic into action', 'Landing pages, CRO tests, onboarding, email flows'],
          ['Learning budget', 'Find future growth', 'Small experiments, new audiences, new offers, new channels'],
        ],
      },
      { type: 'h2', text: 'Simple allocation model' },
      {
        type: 'p',
        text: 'There is no universal split, but a practical starting point is to protect proven channels while reserving enough budget to learn. Mature brands may invest heavily in brand and retention. New brands often need faster validation.',
      },
      {
        type: 'table',
        headers: ['Business stage', 'Proven channels', 'Brand and content', 'Experiments'],
        rows: [
          ['New offer', '50%', '25%', '25%'],
          ['Growing offer', '60%', '25%', '15%'],
          ['Established offer', '65%', '25%', '10%'],
          ['Brand refresh', '45%', '40%', '15%'],
        ],
      },
      { type: 'h2', text: 'Work backward from targets' },
      {
        type: 'ol',
        items: [
          'Set the revenue, lead, signup, or retention target.',
          'Estimate conversion rates between each funnel step.',
          'Calculate the traffic or reach needed to hit the target.',
          'Estimate cost per click, cost per lead, or cost per acquisition by channel.',
          'Check whether the required budget is realistic.',
          'Adjust the offer, audience, creative, or target before spending.',
        ],
      },
      {
        type: 'code',
        title: 'Back-of-the-envelope budget math',
        language: 'text',
        code: `Goal: 100 new customers
Lead-to-customer rate: 20%
Needed leads: 500
Landing page conversion rate: 5%
Needed visits: 10,000
Estimated CPC: $1.80
Media budget estimate: $18,000

Question: Can customer lifetime value support this cost?`,
      },
      { type: 'h2', text: 'Channel mix decision table' },
      {
        type: 'table',
        headers: ['Channel', 'Best for', 'Watch out for'],
        rows: [
          ['SEO', 'Durable demand capture and authority', 'Slow feedback and competitive topics'],
          ['Paid search', 'High-intent demand capture', 'Rising costs and narrow volume'],
          ['Paid social', 'Audience testing and creative scale', 'Creative fatigue and weak intent'],
          ['Email', 'Nurture, activation, retention', 'List quality and consent requirements'],
          ['Organic social', 'Community, proof, personality', 'Inconsistent reach and high content demand'],
          ['Partnerships', 'Borrowed trust and new audiences', 'Long setup time and tracking gaps'],
        ],
      },
      { type: 'h2', text: 'Budget rules of thumb' },
      {
        type: 'ul',
        items: [
          'Do not judge a new paid channel before it has enough data for a fair test.',
          'Do not scale a campaign that has poor unit economics.',
          'Do not cut all awareness activity just because it is harder to attribute.',
          'Fund creative production because ads fail when creative is weak.',
          'Keep a testing reserve so the team does not become trapped in yesterday best channel.',
        ],
      },
      {
        type: 'warning',
        text: 'ROAS can look strong while the business is weak if it ignores discounts, returns, churn, sales time, or low-quality customers.',
      },
      {
        type: 'try',
        text: 'Create a $10,000 monthly budget for a product launch. Split it across four buckets and write one KPI for each bucket.',
      },
      {
        type: 'keypoints',
        items: [
          'A budget should support both short-term sales and long-term demand.',
          'Start from targets, conversion rates, and unit economics.',
          'Channel mix depends on stage, audience, market, and proof.',
          'Keep a dedicated learning budget for future growth.',
        ],
      },
    ],
  },
  {
    slug: 'dm-competitive-research',
    title: 'Competitive & Market Research',
    description:
      'Research competitors, customers, search demand, and market signals to find better strategy choices.',
    level: 'advanced',
    section: 'Pro Strategy',
    order: 51,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Competitive research is not copying competitors. It is learning how the market talks, where customers compare options, which promises are overused, and where there is space for a stronger angle.',
      },
      {
        type: 'p',
        text: 'Advanced marketers combine customer voice, search behavior, competitor messaging, pricing, reviews, and channel activity. The goal is to find useful patterns, not collect screenshots forever.',
      },
      { type: 'h2', text: 'What to research' },
      {
        type: 'table',
        headers: ['Area', 'What to collect', 'Why it matters'],
        rows: [
          ['Audience', 'Jobs, pains, objections, triggers', 'Shows what message should lead'],
          ['Competitors', 'Positioning, offers, pricing, proof', 'Reveals category norms and gaps'],
          ['Search demand', 'Keywords, questions, comparisons', 'Shows active demand and content opportunities'],
          ['Social demand', 'Posts, comments, communities, creators', 'Shows language and emotional context'],
          ['Reviews', 'Praise, complaints, alternatives', 'Shows what customers value after buying'],
        ],
      },
      { type: 'h2', text: 'Research sources' },
      {
        type: 'ul',
        items: [
          'Competitor homepages, landing pages, pricing pages, help centers, and case studies.',
          'Search engine results pages for category, problem, comparison, and alternative keywords.',
          'Customer reviews on marketplaces, directories, app stores, YouTube comments, and social threads.',
          'Sales calls, support tickets, chat transcripts, surveys, and community discussions.',
          'Ad libraries, email signup flows, webinars, events, podcasts, and partner pages.',
        ],
      },
      { type: 'h2', text: 'Competitive matrix' },
      {
        type: 'table',
        headers: ['Competitor', 'Primary promise', 'Main audience', 'Proof used', 'Weak spot'],
        rows: [
          ['Brand A', 'Save time with automation', 'Small teams', 'Customer logos', 'Generic examples'],
          ['Brand B', 'Enterprise-grade control', 'Large companies', 'Security claims', 'Feels complex'],
          ['Brand C', 'Simple and affordable', 'Freelancers', 'Pricing comparison', 'Limited credibility'],
          ['Your brand', 'Fast setup with expert templates', 'Growing teams', 'Before and after workflows', 'Needs more case studies'],
        ],
      },
      { type: 'h2', text: 'Voice of customer mining' },
      {
        type: 'p',
        text: 'Voice of customer research captures the exact words people use. These phrases are powerful because they often become headlines, email subject lines, FAQ sections, and ad hooks.',
      },
      {
        type: 'code',
        title: 'Voice of customer notes template',
        language: 'text',
        code: `Source:
Customer phrase:
Emotion:
Problem mentioned:
Desired outcome:
Objection or risk:
Possible headline:
Possible content idea:
Confidence level:`,
      },
      { type: 'h2', text: 'Find strategic openings' },
      {
        type: 'ol',
        items: [
          'List the top competitors and alternatives, including doing nothing.',
          'Group their messages into common themes.',
          'Mark which themes are crowded, credible, or weak.',
          'Compare those themes to customer complaints and desires.',
          'Choose an opening where the customer cares and competitors are not clearly winning.',
          'Turn that opening into positioning, content, and offer tests.',
        ],
      },
      {
        type: 'tip',
        text: 'Research becomes useful when it changes a decision: a sharper audience, a better offer, a clearer headline, a stronger proof asset, or a channel priority.',
      },
      {
        type: 'try',
        text: 'Pick three competitors. Fill the matrix, then write one strategic opening your brand could own without making a false claim.',
      },
      {
        type: 'keypoints',
        items: [
          'Competitive research should reveal market patterns and customer language.',
          'Look beyond direct competitors to substitutes and the choice to do nothing.',
          'Reviews and comments often contain better copy than internal brainstorming.',
          'The final output should be a strategic decision, not a folder of screenshots.',
        ],
      },
    ],
  },
  {
    slug: 'dm-positioning',
    title: 'Positioning & Messaging Systems',
    description:
      'Create positioning and messaging that make your offer easier to understand, remember, and choose.',
    level: 'advanced',
    section: 'Pro Strategy',
    order: 52,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'Positioning defines how your offer should be understood in the mind of the market. Messaging turns that position into headlines, pages, ads, emails, and sales conversations.',
      },
      {
        type: 'p',
        text: 'Great marketing is often not louder. It is clearer. When people understand who it is for, what problem it solves, why it is different, and why to trust it, every channel performs better.',
      },
      { type: 'h2', text: 'Positioning ingredients' },
      {
        type: 'table',
        headers: ['Ingredient', 'Question', 'Example'],
        rows: [
          ['Audience', 'Who is the best-fit buyer?', 'Operations managers at 20-100 person agencies'],
          ['Problem', 'What painful situation do they face?', 'Client work approvals are scattered across tools'],
          ['Category', 'What mental shelf do they place you on?', 'Client approval software'],
          ['Differentiator', 'Why are you a better fit?', 'Built around visual approval workflows'],
          ['Value', 'What outcome improves?', 'Fewer revision cycles and faster sign-off'],
          ['Proof', 'Why should they believe it?', 'Template library, case studies, workflow analytics'],
        ],
      },
      { type: 'h2', text: 'Positioning statement formula' },
      {
        type: 'code',
        title: 'Internal positioning statement',
        language: 'text',
        code: `For [best-fit audience]
who struggle with [painful situation],
[product] is a [category]
that helps them [valuable outcome].
Unlike [main alternative],
we [meaningful differentiator],
proven by [evidence].`,
      },
      {
        type: 'note',
        text: 'The positioning statement is usually internal. Public copy should sound natural, specific, and customer-friendly.',
      },
      { type: 'h2', text: 'Messaging hierarchy' },
      {
        type: 'table',
        headers: ['Level', 'Purpose', 'Example'],
        rows: [
          ['Core promise', 'One memorable outcome', 'Get client approvals without messy email threads'],
          ['Value pillars', 'Three to five reasons to care', 'Organize feedback, track versions, speed up sign-off'],
          ['Proof points', 'Evidence for each pillar', 'Workflow screenshots, customer quote, time saved'],
          ['Objection answers', 'Reduce hesitation', 'Works with existing file tools, no client login required'],
          ['Calls to action', 'Move the buyer forward', 'Create your first approval board'],
        ],
      },
      { type: 'h2', text: 'Message map' },
      {
        type: 'code',
        title: 'Message map template',
        language: 'text',
        code: `Audience segment:
Pain trigger:
Primary promise:
Value pillar 1:
  Proof:
  Example copy:
Value pillar 2:
  Proof:
  Example copy:
Value pillar 3:
  Proof:
  Example copy:
Top objection:
Objection response:
CTA:`,
      },
      { type: 'h2', text: 'Good messaging is specific' },
      {
        type: 'table',
        headers: ['Weak copy', 'Stronger copy', 'Why stronger'],
        rows: [
          ['All-in-one solution for teams', 'Plan, approve, and launch client campaigns in one workspace', 'Names the work'],
          ['Save time and money', 'Cut weekly reporting from 4 hours to 30 minutes', 'Uses measurable value'],
          ['Easy to use', 'Your team can publish the first campaign calendar today', 'Shows speed and action'],
          ['Trusted by businesses', 'Used by 800 ecommerce teams to recover abandoned carts', 'Adds audience and proof'],
        ],
      },
      {
        type: 'warning',
        text: 'Do not position around a differentiator customers do not care about. Different is only useful when it improves a meaningful outcome.',
      },
      {
        type: 'try',
        text: 'Write a positioning statement for a product, then turn it into one homepage headline, three value pillars, and one CTA.',
      },
      {
        type: 'keypoints',
        items: [
          'Positioning decides how the market should understand your offer.',
          'Messaging turns positioning into repeatable copy across channels.',
          'Specific copy usually beats broad claims.',
          'A message map keeps ads, landing pages, emails, and sales materials consistent.',
        ],
      },
    ],
  },
  {
    slug: 'dm-growth-loops',
    title: 'Growth Loops & Retention',
    description:
      'Move beyond one-time campaigns by designing growth loops, activation paths, retention systems, and referral motion.',
    level: 'advanced',
    section: 'Pro Strategy',
    order: 53,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'A campaign produces a temporary push. A growth loop is a system where one user action helps create the next user action. Advanced marketers look for loops because they can compound over time.',
      },
      {
        type: 'p',
        text: 'Retention matters because acquisition is expensive. If users do not activate, return, buy again, or refer, more traffic only fills a leaky bucket.',
      },
      { type: 'h2', text: 'Loop thinking vs funnel thinking' },
      {
        type: 'table',
        headers: ['Model', 'How it works', 'Use it for'],
        rows: [
          ['Funnel', 'People move through stages toward conversion', 'Diagnosing journey drop-off'],
          ['Loop', 'An action produces an output that attracts or activates more users', 'Building compounding growth'],
          ['Flywheel', 'Multiple loops reinforce each other', 'Connecting acquisition, product value, and advocacy'],
        ],
      },
      { type: 'h2', text: 'Common growth loops' },
      {
        type: 'table',
        headers: ['Loop', 'User action', 'Output', 'Growth effect'],
        rows: [
          ['Content loop', 'Team publishes useful content', 'Search and social discovery', 'More qualified visitors'],
          ['Referral loop', 'Customer invites a peer', 'New account or purchase', 'Lower acquisition cost'],
          ['Collaboration loop', 'User shares a workspace or file', 'Recipient experiences product', 'Product-led acquisition'],
          ['Review loop', 'Happy customer leaves review', 'More trust in marketplace', 'Higher conversion rate'],
          ['Community loop', 'Members answer and share', 'More useful community content', 'Higher retention and discovery'],
        ],
      },
      { type: 'h2', text: 'Activation comes before retention' },
      {
        type: 'p',
        text: 'Activation is the moment a new user experiences meaningful value. It is not the same as signup. For an email tool, activation may be sending the first campaign. For a marketplace, it may be receiving the first qualified inquiry.',
      },
      {
        type: 'ol',
        items: [
          'Define the first value moment.',
          'Measure how many new users reach it.',
          'Find where users drop before that moment.',
          'Improve onboarding, education, templates, prompts, or support.',
          'Trigger retention campaigns only after the user has enough context.',
        ],
      },
      { type: 'h2', text: 'Retention system map' },
      {
        type: 'table',
        headers: ['Moment', 'Marketing support', 'Example'],
        rows: [
          ['New signup', 'Onboarding and expectation setting', 'Welcome email with first-step checklist'],
          ['First value', 'Celebrate and deepen usage', 'You published your first campaign. Try segmentation next.'],
          ['Usage drop', 'Helpful reactivation', 'Need help finishing your setup? Here are 3 templates.'],
          ['Repeat value', 'Upgrade or expansion education', 'Invite your team to review results together.'],
          ['Advocacy', 'Review and referral ask', 'Share your template with another marketer.'],
        ],
      },
      { type: 'h2', text: 'Loop design template' },
      {
        type: 'code',
        title: 'Growth loop template',
        language: 'text',
        code: `Loop name:
Target user:
Trigger:
User action:
Output created:
Who sees the output:
Why they care:
Next action:
Metric for loop speed:
Metric for loop quality:
Friction to remove:`,
      },
      {
        type: 'tip',
        text: 'A loop should have a natural reason to repeat. If the only reason people share is a coupon, the loop may stop when the incentive stops.',
      },
      {
        type: 'try',
        text: 'Choose a product you use. Identify its activation moment and design one retention email that helps users reach the next value moment.',
      },
      {
        type: 'keypoints',
        items: [
          'Funnels help diagnose movement; loops help design compounding growth.',
          'Retention improves the value of every acquisition channel.',
          'Activation is the first meaningful value moment, not merely signup.',
          'Good loops connect user value with business growth.',
        ],
      },
    ],
  },
  {
    slug: 'dm-privacy-compliance',
    title: 'Privacy, Consent & Compliant Marketing',
    description:
      'Understand privacy-aware marketing, consent, data minimization, tracking limits, email rules, and ethical personalization.',
    level: 'advanced',
    section: 'Pro Strategy',
    order: 54,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Modern marketing must earn attention and respect privacy. Tracking has changed, regulations are stricter, browsers limit cookies, and customers expect more control over their data.',
      },
      {
        type: 'p',
        text: 'Privacy-aware marketing is not only a legal checkbox. It improves trust, data quality, brand reputation, and long-term deliverability.',
      },
      {
        type: 'warning',
        text: 'This lesson is educational and not legal advice. Work with qualified legal counsel for specific compliance requirements in your market.',
      },
      { type: 'h2', text: 'Core privacy principles' },
      {
        type: 'table',
        headers: ['Principle', 'Plain meaning', 'Marketing example'],
        rows: [
          ['Transparency', 'Explain what data you collect and why', 'Clear cookie and email signup language'],
          ['Consent', 'Ask before using data when required', 'Opt-in for marketing emails or non-essential cookies'],
          ['Data minimization', 'Collect only what you need', 'Do not ask for phone number if email is enough'],
          ['Purpose limitation', 'Use data for the stated reason', 'Do not upload event registrants to ad platforms without proper basis'],
          ['Control', 'Let people opt out or update preferences', 'Unsubscribe link and preference center'],
          ['Security', 'Protect data from misuse', 'Limit access to CRM exports and ad account audiences'],
        ],
      },
      { type: 'h2', text: 'Common rules marketers should know' },
      {
        type: 'table',
        headers: ['Area', 'What it affects', 'Practical requirement'],
        rows: [
          ['Email marketing', 'Newsletters and promotional campaigns', 'Use permission, identify sender, include unsubscribe'],
          ['Cookies and pixels', 'Analytics, retargeting, ad measurement', 'Disclose and collect consent where required'],
          ['Customer data uploads', 'Custom audiences and lookalikes', 'Confirm rights and platform terms before upload'],
          ['SMS marketing', 'Text messages and mobile offers', 'Use explicit opt-in and easy opt-out'],
          ['Children or sensitive data', 'Protected groups and high-risk categories', 'Avoid targeting or personalization without expert guidance'],
        ],
      },
      { type: 'h2', text: 'Consent quality checklist' },
      {
        type: 'ol',
        items: [
          'Use clear language that a normal person can understand.',
          'Separate required account messages from optional marketing messages.',
          'Avoid pre-checked boxes where they are not allowed or not trustworthy.',
          'Record when, where, and how consent was collected.',
          'Make unsubscribe and preference updates simple.',
          'Respect opt-outs across tools, not only in one email platform.',
        ],
      },
      { type: 'h2', text: 'Tracking in a privacy-first world' },
      {
        type: 'p',
        text: 'Third-party cookies, device identifiers, and platform attribution are less reliable than they used to be. Marketers need better first-party data, cleaner UTMs, server-side or consent-aware measurement where appropriate, and more decision-making from trends instead of perfect user-level tracking.',
      },
      {
        type: 'table',
        headers: ['Old habit', 'Better habit'],
        rows: [
          ['Track everything because we can', 'Track what supports a clear decision'],
          ['Rely only on platform-reported conversions', 'Compare platform, analytics, CRM, and finance data'],
          ['Use vague cookie notices', 'Explain categories and choices clearly'],
          ['Personalize with hidden data', 'Personalize from declared preferences and behavior users expect'],
        ],
      },
      { type: 'h2', text: 'Ethical personalization' },
      {
        type: 'ul',
        items: [
          'Use personalization to help, not to pressure.',
          'Avoid sensitive inferences that could surprise or harm people.',
          'Prefer context and declared preferences over hidden profiling.',
          'Keep frequency reasonable so automation does not become harassment.',
          'Review campaigns for fairness, exclusion, and unintended impact.',
        ],
      },
      {
        type: 'code',
        title: 'Privacy-aware campaign review',
        language: 'text',
        code: `Campaign:
Data used:
Source of data:
Consent or legal basis:
User expectation:
Opt-out path:
Sensitive data risk:
Data retention plan:
Owner responsible:
Decision: approve, revise, or reject`,
      },
      {
        type: 'try',
        text: 'Audit one signup form. Rewrite the consent language so it clearly explains what the person will receive and how they can opt out.',
      },
      {
        type: 'keypoints',
        items: [
          'Privacy-aware marketing protects trust and improves data quality.',
          'Consent should be clear, recorded, and easy to withdraw.',
          'Collect only data that supports a real customer or business purpose.',
          'Modern measurement needs first-party data, clean tagging, and realistic attribution expectations.',
        ],
      },
    ],
  },
  {
    slug: 'dm-ai-marketing',
    title: 'AI Tools for Marketers (Practical & Ethical)',
    description:
      'Use AI for research, ideation, copy, reporting, and workflow acceleration while protecting quality, privacy, and brand trust.',
    level: 'advanced',
    section: 'Pro Strategy',
    order: 55,
    minutes: 17,
    content: [
      {
        type: 'p',
        text: 'AI can speed up marketing work, but it does not replace strategy, taste, customer understanding, or accountability. The best marketers use AI as a capable assistant, not as an autopilot.',
      },
      {
        type: 'p',
        text: 'Useful AI workflows have clear inputs, constraints, examples, review steps, and human ownership. Weak workflows ask a vague question and publish the answer without checking it.',
      },
      { type: 'h2', text: 'High-value AI use cases' },
      {
        type: 'table',
        headers: ['Use case', 'Good task for AI', 'Human must verify'],
        rows: [
          ['Research synthesis', 'Summarize customer interviews into themes', 'Accuracy, missing context, bias'],
          ['Content planning', 'Generate topic clusters and outlines', 'Search intent and originality'],
          ['Copy variations', 'Draft hooks, subject lines, ads', 'Brand voice, claims, compliance'],
          ['Reporting', 'Explain metric changes from notes', 'Data source and business interpretation'],
          ['Repurposing', 'Turn a webinar into posts and emails', 'Nuance, examples, and permissions'],
          ['Workflow automation', 'Classify leads or tag feedback', 'Edge cases and data privacy'],
        ],
      },
      { type: 'h2', text: 'Prompt structure that works' },
      {
        type: 'code',
        title: 'Marketing prompt framework',
        language: 'text',
        code: `Role:
Context:
Audience:
Goal:
Inputs:
Brand voice:
Constraints:
Examples:
Output format:
What to avoid:
Questions to ask before final answer:`,
      },
      { type: 'h2', text: 'Example: ask for useful content ideas' },
      {
        type: 'code',
        title: 'Content ideation prompt',
        language: 'text',
        code: `Role: You are a B2B content strategist.
Context: We sell project approval software to small agencies.
Audience: Agency owners who lose time in client revision cycles.
Goal: Create SEO-friendly article ideas for consideration-stage buyers.
Inputs: Common objections are "clients will not use another tool" and "setup takes too long."
Brand voice: Clear, practical, calm, not hype-driven.
Output format: Table with topic, search intent, angle, CTA, and proof needed.
What to avoid: Generic productivity advice and unsupported statistics.
Questions: Ask if you need the product features before finalizing.`,
      },
      { type: 'h2', text: 'AI quality control' },
      {
        type: 'ol',
        items: [
          'Check factual claims, names, numbers, and legal or health-related statements.',
          'Replace generic claims with specific proof, examples, or customer language.',
          'Edit for brand voice and remove repetitive phrasing.',
          'Verify that recommendations match the actual funnel stage and audience.',
          'Run a compliance and privacy review before using customer data.',
          'Measure performance against human-created benchmarks.',
        ],
      },
      { type: 'h2', text: 'Ethical AI rules for marketers' },
      {
        type: 'ul',
        items: [
          'Do not paste private customer data into tools that are not approved for that data.',
          'Do not invent testimonials, reviews, statistics, awards, or case studies.',
          'Do not impersonate real people or create deceptive social proof.',
          'Disclose AI-generated content when policy, law, platform rules, or audience trust requires it.',
          'Use AI to improve accessibility and clarity, not to manipulate vulnerable audiences.',
        ],
      },
      {
        type: 'warning',
        text: 'AI output can sound confident while being wrong. Treat it like a draft from a fast junior assistant: useful, but always reviewed.',
      },
      { type: 'h2', text: 'Team AI workflow' },
      {
        type: 'table',
        headers: ['Step', 'Owner', 'Output'],
        rows: [
          ['Strategy input', 'Marketer', 'Audience, offer, goal, constraints'],
          ['AI draft', 'AI tool', 'Ideas, outlines, copy, summaries'],
          ['Editorial review', 'Marketer or editor', 'Clear, accurate, on-brand content'],
          ['Expert review', 'Subject matter expert', 'Correct claims and stronger examples'],
          ['Performance review', 'Marketing team', 'Results, learnings, prompt improvements'],
        ],
      },
      {
        type: 'try',
        text: 'Take a vague prompt you have used before and rewrite it with role, audience, goal, inputs, constraints, and output format.',
      },
      {
        type: 'keypoints',
        items: [
          'AI is strongest when the marketer provides clear context and review standards.',
          'Use AI for speed, variations, synthesis, and structure.',
          'Humans remain responsible for accuracy, ethics, privacy, and brand quality.',
          'Never invent proof or use sensitive data carelessly.',
        ],
      },
    ],
  },
  {
    slug: 'dm-project-seo',
    title: 'Mini Project: SEO Content Plan',
    description:
      'Create a portfolio-ready SEO content plan with audience research, keyword mapping, content briefs, and measurement.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 56,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'In this project, you will build an SEO content plan that could be shown to a client, hiring manager, or founder. The goal is not to list random keywords. The goal is to connect search demand to business outcomes.',
      },
      {
        type: 'p',
        text: 'Choose one product, service, nonprofit, creator brand, or local business. If you do not have one, use this sample: an online course platform for small business owners.',
      },
      { type: 'h2', text: 'Project deliverables' },
      {
        type: 'ul',
        items: [
          'Audience and business goal summary.',
          'Keyword and intent map.',
          'Content pillar plan.',
          'Three detailed content briefs.',
          'Internal linking and conversion plan.',
          'Measurement dashboard outline.',
        ],
      },
      { type: 'h2', text: 'Step-by-step guide' },
      {
        type: 'ol',
        items: [
          'Define the business goal and ideal audience.',
          'List seed topics from customer problems, product features, and competitor pages.',
          'Group keywords by search intent: informational, commercial, transactional, or navigational.',
          'Create content pillars that organize related topics.',
          'Choose priority pages based on business value, ranking difficulty, and conversion potential.',
          'Write content briefs for the top three pages.',
          'Plan internal links from supporting articles to conversion pages.',
          'Define how SEO performance will be measured over 30, 60, and 90 days.',
        ],
      },
      { type: 'h2', text: 'SEO plan outline' },
      {
        type: 'code',
        title: 'Portfolio SEO plan structure',
        language: 'text',
        code: `1. Business context
2. Audience and search behavior
3. Keyword research method
4. Keyword and intent map
5. Content pillars
6. Priority content roadmap
7. Content briefs
8. Internal linking plan
9. Conversion paths
10. Measurement plan
11. Risks and assumptions`,
      },
      { type: 'h2', text: 'Sample keyword and intent map' },
      {
        type: 'table',
        headers: ['Topic', 'Keyword idea', 'Intent', 'Page type', 'Business value'],
        rows: [
          ['Course planning', 'how to create an online course', 'Informational', 'Guide', 'Medium'],
          ['Platform comparison', 'best online course platforms for small business', 'Commercial', 'Comparison article', 'High'],
          ['Pricing', 'online course platform pricing', 'Commercial', 'Pricing guide', 'High'],
          ['Launch help', 'online course launch checklist', 'Informational', 'Checklist', 'Medium'],
          ['Product category', 'course platform for coaches', 'Transactional', 'Landing page', 'High'],
        ],
      },
      { type: 'h2', text: 'Content pillar model' },
      {
        type: 'table',
        headers: ['Pillar', 'Purpose', 'Supporting pages'],
        rows: [
          ['Plan your course', 'Capture early problem research', 'Topic validation, outline template, pricing lesson'],
          ['Build your course', 'Show product relevance', 'Video lessons, quizzes, community setup'],
          ['Launch your course', 'Capture action-ready demand', 'Launch checklist, email sequence, sales page examples'],
          ['Choose a platform', 'Win comparison searches', 'Best tools, alternatives, pricing, feature comparison'],
        ],
      },
      { type: 'h2', text: 'Sample content brief' },
      {
        type: 'code',
        title: 'SEO content brief example',
        language: 'text',
        code: `Title: Best Online Course Platforms for Small Business Owners
Primary intent: Commercial investigation
Target reader: Owner who wants to package expertise into a paid course
Primary keyword: best online course platforms for small business
Secondary topics: pricing, templates, email, payments, community, support
Angle: Help readers choose based on business model, not longest feature list
Required sections:
- Quick recommendation table
- How to choose a platform
- Comparison criteria
- Platform examples
- Common mistakes
- Final checklist
Conversion CTA: Download the course launch checklist
Proof needed: Screenshots, customer quote, feature comparison, pricing notes`,
      },
      { type: 'h2', text: 'Internal linking plan' },
      {
        type: 'table',
        headers: ['From page', 'Link to', 'Anchor text', 'Reason'],
        rows: [
          ['Course outline template', 'Course launch checklist', 'launch your course with this checklist', 'Move reader from planning to action'],
          ['Best course platforms', 'Product landing page', 'course platform for small businesses', 'Capture commercial intent'],
          ['Pricing guide', 'Demo page', 'see how pricing works in a real launch', 'Convert high-intent visitors'],
          ['Launch email examples', 'Email funnel template', 'welcome funnel template', 'Offer useful next step'],
        ],
      },
      { type: 'h2', text: 'Measurement plan' },
      {
        type: 'table',
        headers: ['Timeframe', 'What to watch', 'Decision'],
        rows: [
          ['30 days', 'Indexing, impressions, technical issues', 'Fix crawl and metadata problems'],
          ['60 days', 'Queries, positions, early clicks', 'Improve titles and sections that match search demand'],
          ['90 days', 'Traffic, assisted conversions, leads', 'Update roadmap and expand winning pillars'],
        ],
      },
      {
        type: 'try',
        text: 'Build the SEO plan as a one-page strategy plus an appendix with the keyword map and three briefs. This is a strong portfolio artifact.',
      },
      {
        type: 'keypoints',
        items: [
          'A professional SEO plan connects search demand to business goals.',
          'Intent matters more than keyword volume alone.',
          'Content briefs make execution clearer and easier to delegate.',
          'Internal links and conversion paths turn SEO traffic into business value.',
        ],
      },
    ],
  },
  {
    slug: 'dm-project-social',
    title: 'Mini Project: 30-Day Social Calendar',
    description:
      'Plan a 30-day social media calendar with content pillars, formats, posting rhythm, sample copy, and measurement.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 57,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'In this project, you will create a 30-day social media calendar. The goal is to show strategic consistency: clear audience, useful pillars, repeatable formats, and measurable learning.',
      },
      {
        type: 'p',
        text: 'A strong calendar is not just a grid of captions. It explains why each post exists, who it serves, and what the team should learn from it.',
      },
      { type: 'h2', text: 'Project deliverables' },
      {
        type: 'ul',
        items: [
          'Audience and platform choice.',
          'Content pillar strategy.',
          '30-day posting calendar.',
          'Sample captions and creative notes.',
          'Engagement and community plan.',
          'Measurement and iteration plan.',
        ],
      },
      { type: 'h2', text: 'Step-by-step guide' },
      {
        type: 'ol',
        items: [
          'Choose one primary platform based on audience behavior.',
          'Define one business goal and one audience goal.',
          'Create three to five content pillars.',
          'Choose repeatable formats such as tips, stories, demos, myths, customer proof, and behind-the-scenes posts.',
          'Plan posts across 30 days with a balanced mix of awareness, trust, and conversion.',
          'Write sample copy for at least five posts.',
          'Add engagement actions such as comment prompts, replies, and community outreach.',
          'Define weekly review metrics and what you will change based on results.',
        ],
      },
      { type: 'h2', text: 'Content pillar setup' },
      {
        type: 'table',
        headers: ['Pillar', 'Audience need', 'Example formats'],
        rows: [
          ['Education', 'Learn how to solve the problem', 'Tips, tutorials, checklists, myth busting'],
          ['Proof', 'Believe the product works', 'Case studies, testimonials, before and afters'],
          ['Personality', 'Know the brand and people', 'Founder notes, behind the scenes, opinions'],
          ['Community', 'Feel seen and invited', 'Questions, polls, user stories, reposts'],
          ['Conversion', 'Take the next step', 'Offer posts, demos, lead magnets, event invites'],
        ],
      },
      { type: 'h2', text: 'Sample 30-day calendar' },
      {
        type: 'table',
        headers: ['Day', 'Pillar', 'Format', 'Topic', 'CTA'],
        rows: [
          ['1', 'Education', 'Carousel', '5 mistakes that slow campaign launches', 'Save this checklist'],
          ['2', 'Personality', 'Short video', 'Why we built this workflow', 'Comment with your bottleneck'],
          ['3', 'Proof', 'Image post', 'Before and after reporting dashboard', 'Ask for the template'],
          ['4', 'Community', 'Poll', 'What takes longest: copy, design, approval, reporting?', 'Vote'],
          ['5', 'Conversion', 'Demo clip', 'How to plan a campaign in 10 minutes', 'Start a free plan'],
          ['6', 'Education', 'Text post', 'The difference between goals and KPIs', 'Share with a teammate'],
          ['7', 'Proof', 'Customer quote', 'How one team cut review time', 'Read the story'],
          ['8', 'Education', 'Carousel', 'Campaign brief template', 'Download the brief'],
          ['9', 'Personality', 'Behind the scenes', 'How our team reviews creative', 'Reply with a question'],
          ['10', 'Community', 'Question', 'What tool does your team overuse?', 'Comment'],
          ['11', 'Conversion', 'Offer post', 'Free launch checklist', 'Get the checklist'],
          ['12', 'Education', 'Short video', 'How to write one clear CTA', 'Try it today'],
          ['13', 'Proof', 'Mini case', 'From 12 revisions to 3', 'View workflow'],
          ['14', 'Community', 'Repost', 'User workspace example', 'Tag your team'],
          ['15', 'Education', 'Carousel', '30-minute weekly marketing review', 'Save for Monday'],
          ['16', 'Personality', 'Founder note', 'Our view on simple marketing systems', 'Follow for more'],
          ['17', 'Conversion', 'Demo clip', 'Build a content calendar view', 'Create yours'],
          ['18', 'Education', 'Text post', 'How to prioritize channels', 'Bookmark'],
          ['19', 'Proof', 'Screenshot', 'Approval analytics example', 'See the report'],
          ['20', 'Community', 'Prompt', 'Drop your campaign goal for feedback', 'Comment'],
          ['21', 'Education', 'Carousel', 'How to run a retro after launch', 'Share'],
          ['22', 'Personality', 'Team post', 'Meet the marketer behind support docs', 'Ask a question'],
          ['23', 'Conversion', 'Lead magnet', 'Campaign planning worksheet', 'Download'],
          ['24', 'Education', 'Short video', 'One way to reduce creative feedback chaos', 'Try the tip'],
          ['25', 'Proof', 'Testimonial', 'Customer quote about faster approvals', 'Read more'],
          ['26', 'Community', 'Poll', 'Would templates help your team launch faster?', 'Vote'],
          ['27', 'Education', 'Carousel', 'What to include in a launch brief', 'Save'],
          ['28', 'Personality', 'Opinion', 'Why busy marketing is not the same as growth', 'Reply'],
          ['29', 'Conversion', 'Demo clip', 'Turn a brief into tasks', 'Start free'],
          ['30', 'Community', 'Roundup', 'Best questions from this month', 'Follow next month'],
        ],
      },
      { type: 'h2', text: 'Sample post copy' },
      {
        type: 'code',
        title: 'Carousel caption example',
        language: 'text',
        code: `Campaigns usually slow down for one of five reasons:
1. The goal is vague.
2. The audience is too broad.
3. The offer is unclear.
4. Review ownership is missing.
5. Reporting is planned too late.

Fix one before adding another channel.

CTA: Save this for your next launch meeting.`,
      },
      { type: 'h2', text: 'Weekly review table' },
      {
        type: 'table',
        headers: ['Metric', 'What it tells you', 'Action'],
        rows: [
          ['Saves', 'Content is useful enough to keep', 'Create deeper follow-up content'],
          ['Shares', 'Content has social value', 'Turn into a series'],
          ['Comments', 'Topic invites conversation', 'Reply and mine language for future posts'],
          ['Profile clicks', 'Audience wants more context', 'Improve bio and pinned posts'],
          ['Leads or trials', 'Content drives business action', 'Connect topic to landing page or offer'],
        ],
      },
      {
        type: 'try',
        text: 'Create your own 30-day calendar. Include at least five full captions and one weekly measurement note.',
      },
      {
        type: 'keypoints',
        items: [
          'A social calendar should reflect strategy, not random posting.',
          'Content pillars help keep the calendar balanced and repeatable.',
          'Sample copy and creative notes make the plan execution-ready.',
          'Weekly review turns social activity into learning.',
        ],
      },
    ],
  },
  {
    slug: 'dm-project-email',
    title: 'Mini Project: Email Welcome Funnel',
    description:
      'Design an email welcome funnel with segmentation, triggers, copy, CTAs, and performance metrics.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 58,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'A welcome funnel is one of the most valuable owned marketing assets. It introduces the brand, sets expectations, teaches the audience, and guides new subscribers toward a meaningful next step.',
      },
      {
        type: 'p',
        text: 'In this project, you will create a welcome funnel that is clear enough to build in an email platform and polished enough for a portfolio.',
      },
      { type: 'h2', text: 'Project deliverables' },
      {
        type: 'ul',
        items: [
          'Subscriber source and audience segment.',
          'Welcome funnel goal and success metrics.',
          'Five-email sequence map.',
          'Sample subject lines and body copy.',
          'Segmentation and automation notes.',
          'Testing and optimization plan.',
        ],
      },
      { type: 'h2', text: 'Step-by-step guide' },
      {
        type: 'ol',
        items: [
          'Define the signup source, such as newsletter, lead magnet, webinar, or product trial.',
          'Define what the subscriber expects to receive.',
          'Choose the primary goal: education, purchase, demo booking, activation, or community join.',
          'Map five emails over 7 to 14 days.',
          'Write subject lines, preview text, main message, CTA, and personalization notes.',
          'Add segmentation rules for engaged and unengaged subscribers.',
          'Plan A/B tests for subject line, CTA, or offer.',
          'Define the metrics that show quality, not only opens.',
        ],
      },
      { type: 'h2', text: 'Welcome funnel map' },
      {
        type: 'table',
        headers: ['Email', 'Timing', 'Purpose', 'CTA'],
        rows: [
          ['1. Welcome and promise', 'Immediately', 'Confirm signup and deliver expected value', 'Access the resource'],
          ['2. Problem education', 'Day 2', 'Teach the cost of the problem', 'Read the guide'],
          ['3. Method or framework', 'Day 4', 'Show your approach', 'Use the checklist'],
          ['4. Proof and objection handling', 'Day 7', 'Build trust with evidence', 'See customer story'],
          ['5. Conversion invitation', 'Day 10', 'Invite the next step', 'Book demo or start trial'],
        ],
      },
      { type: 'h2', text: 'Sample email brief table' },
      {
        type: 'table',
        headers: ['Email', 'Subject line', 'Preview text', 'Main idea'],
        rows: [
          ['1', 'Your campaign checklist is here', 'Start with the first 10-minute step', 'Deliver resource and set expectations'],
          ['2', 'Why campaigns stall before launch', 'The issue is usually not effort', 'Name the hidden bottlenecks'],
          ['3', 'A simple launch system you can copy', 'Use this framework before choosing channels', 'Teach the process'],
          ['4', 'How a small team reduced review chaos', 'A practical before and after', 'Show proof and answer objections'],
          ['5', 'Ready to plan your next launch?', 'Here is the easiest next step', 'Invite demo, trial, or consultation'],
        ],
      },
      { type: 'h2', text: 'Sample email copy' },
      {
        type: 'code',
        title: 'Email 1 draft',
        language: 'text',
        code: `Subject: Your campaign checklist is here
Preview: Start with the first 10-minute step.

Hi {{first_name}},

Thanks for downloading the campaign launch checklist.

Most campaigns do not fail because the team lacks ideas. They struggle because the goal, audience, offer, creative review, and reporting plan are not aligned early enough.

Start with section one today:
- Define the campaign goal.
- Choose one primary audience.
- Write the offer in one sentence.

CTA: Open the checklist

Tomorrow, I will show you the five bottlenecks that slow launches down.`,
      },
      { type: 'h2', text: 'Segmentation rules' },
      {
        type: 'table',
        headers: ['Segment', 'Rule', 'Message adjustment'],
        rows: [
          ['Highly engaged', 'Clicked at least 2 emails', 'Offer demo, trial, or deeper guide'],
          ['Interested but not clicking', 'Opened but no click', 'Send shorter benefit-led reminder'],
          ['Inactive', 'No opens or clicks after 10 days', 'Send preference check or pause campaign'],
          ['Product trial users', 'Signed up during sequence', 'Switch to onboarding emails'],
        ],
      },
      { type: 'h2', text: 'Metrics and tests' },
      {
        type: 'table',
        headers: ['Metric', 'Why it matters', 'Optimization idea'],
        rows: [
          ['Deliverability', 'Emails must reach inboxes', 'Clean list and avoid spammy patterns'],
          ['Click rate', 'Shows interest in the message', 'Improve CTA and offer relevance'],
          ['Reply rate', 'Shows trust and conversation', 'Ask a useful question'],
          ['Conversion rate', 'Shows business impact', 'Align sequence with landing page'],
          ['Unsubscribe rate', 'Shows expectation mismatch', 'Improve signup promise and frequency'],
        ],
      },
      {
        type: 'try',
        text: 'Write the full five-email welcome funnel for one lead magnet. Include timing, subject line, CTA, and one paragraph of body copy for each email.',
      },
      {
        type: 'keypoints',
        items: [
          'A welcome funnel should match the signup promise.',
          'Each email needs a job: deliver, educate, build trust, or convert.',
          'Segmentation makes the funnel more relevant after behavior is observed.',
          'Clicks, replies, conversions, and unsubscribes reveal more than opens alone.',
        ],
      },
    ],
  },
  {
    slug: 'dm-project-ads',
    title: 'Mini Project: Paid Ads Campaign Brief',
    description:
      'Build a paid ads campaign brief with objective, audience, offer, creative angles, budget, landing page, and testing plan.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 59,
    minutes: 18,
    content: [
      {
        type: 'p',
        text: 'Paid ads move faster than most channels, which makes planning even more important. A campaign brief keeps strategy, creative, targeting, budget, landing page, and measurement aligned before money is spent.',
      },
      {
        type: 'p',
        text: 'In this project, you will create a paid ads brief that a media buyer, designer, copywriter, or founder could use to launch a controlled test.',
      },
      { type: 'h2', text: 'Project deliverables' },
      {
        type: 'ul',
        items: [
          'Campaign objective and funnel stage.',
          'Audience definition and exclusions.',
          'Offer and landing page notes.',
          'Creative angle matrix.',
          'Budget and test structure.',
          'Tracking and success criteria.',
        ],
      },
      { type: 'h2', text: 'Step-by-step guide' },
      {
        type: 'ol',
        items: [
          'Choose one campaign objective, such as leads, purchases, trials, or webinar registrations.',
          'Choose the platform based on audience intent and creative fit.',
          'Define the audience, exclusions, location, device, and buyer stage.',
          'Write the offer and explain why it is worth attention now.',
          'Map the landing page message to the ad promise.',
          'Create at least three creative angles and two copy variations for each.',
          'Set budget, testing period, and minimum decision thresholds.',
          'Define tracking, UTMs, conversion events, and reporting cadence.',
        ],
      },
      { type: 'h2', text: 'Campaign brief outline' },
      {
        type: 'code',
        title: 'Paid ads brief template',
        language: 'text',
        code: `Campaign name:
Objective:
Funnel stage:
Platform:
Audience:
Exclusions:
Offer:
Landing page URL:
Creative angles:
Budget:
Test duration:
Primary KPI:
Secondary metrics:
Tracking plan:
Decision rules:
Risks and assumptions:`,
      },
      { type: 'h2', text: 'Creative angle matrix' },
      {
        type: 'table',
        headers: ['Angle', 'Audience insight', 'Hook example', 'Creative idea'],
        rows: [
          ['Pain point', 'Teams lose time chasing approvals', 'Still waiting on client feedback?', 'Split-screen messy inbox vs organized board'],
          ['Outcome', 'Managers want faster launches', 'Launch campaigns without approval chaos', 'Timeline animation from brief to launch'],
          ['Proof', 'Buyers need trust', 'See how one team cut review cycles by 40%', 'Customer quote and workflow screenshot'],
          ['Comparison', 'People use spreadsheets today', 'Spreadsheets were not built for campaign approvals', 'Spreadsheet chaos visual'],
        ],
      },
      { type: 'h2', text: 'Sample ad copy' },
      {
        type: 'code',
        title: 'Ad copy variations',
        language: 'text',
        code: `Variation A - Pain
Primary text: Client feedback scattered across email, chat, and docs? Bring every approval into one simple campaign workspace.
Headline: End approval chaos
CTA: Start free

Variation B - Outcome
Primary text: Plan, review, and launch campaigns faster with a workspace built for marketing teams.
Headline: Launch with fewer revision cycles
CTA: Try it free

Variation C - Proof
Primary text: See how a small agency reduced campaign review time and kept every stakeholder aligned.
Headline: A cleaner approval workflow
CTA: Read the story`,
      },
      { type: 'h2', text: 'Budget and test plan' },
      {
        type: 'table',
        headers: ['Item', 'Plan', 'Reason'],
        rows: [
          ['Daily budget', '$75 per day', 'Enough to gather early directional data'],
          ['Duration', '14 days', 'Avoid judging too early'],
          ['Campaign structure', '1 campaign, 2 ad sets, 6 ads', 'Simple test with controlled variables'],
          ['Optimization event', 'Lead form submit or trial start', 'Matches campaign objective'],
          ['Decision threshold', 'At least 30 conversions if possible', 'Reduce random conclusions'],
        ],
      },
      { type: 'h2', text: 'Landing page alignment checklist' },
      {
        type: 'ul',
        items: [
          'The headline repeats or strengthens the ad promise.',
          'The page explains who the offer is for.',
          'The proof matches the claim made in the ad.',
          'The CTA is visible and specific.',
          'The form asks only for necessary information.',
          'The page loads quickly on mobile.',
        ],
      },
      {
        type: 'warning',
        text: 'Do not change audience, creative, budget, landing page, and bid strategy all at once during a test. If everything changes, learning becomes unclear.',
      },
      {
        type: 'try',
        text: 'Write a complete paid ads brief for one product. Include three creative angles, three ads, budget, KPIs, UTMs, and decision rules.',
      },
      {
        type: 'keypoints',
        items: [
          'Paid ads need a clear objective, audience, offer, creative, landing page, and measurement plan.',
          'Creative angles should come from audience insight, not random design ideas.',
          'A good test has enough time, budget, and structure to learn.',
          'Landing page alignment is essential for conversion.',
        ],
      },
    ],
  },
  {
    slug: 'dm-project-full',
    title: 'Mini Project: Full Go-To-Market Campaign',
    description:
      'Plan a full go-to-market campaign with strategy, messaging, channels, launch timeline, assets, metrics, and retrospective.',
    level: 'advanced',
    section: 'Capstone Projects',
    order: 60,
    minutes: 20,
    content: [
      {
        type: 'p',
        text: 'This capstone pulls the course together. You will create a full go-to-market campaign for a product, service, event, or feature launch.',
      },
      {
        type: 'p',
        text: 'The final output should look like a real campaign plan: strategic enough for leadership, practical enough for the team, and clear enough to execute.',
      },
      { type: 'h2', text: 'Project deliverables' },
      {
        type: 'ul',
        items: [
          'Campaign brief and objective.',
          'Audience, positioning, and message map.',
          'Channel plan and asset list.',
          'Launch timeline.',
          'Sample copy for multiple channels.',
          'Measurement dashboard and retrospective template.',
        ],
      },
      { type: 'h2', text: 'Step-by-step guide' },
      {
        type: 'ol',
        items: [
          'Define the launch goal, timeline, and business context.',
          'Choose the primary audience and describe the trigger that makes the offer relevant now.',
          'Write the positioning statement, core promise, proof, and CTA.',
          'Select channels for awareness, consideration, conversion, and retention.',
          'Create the asset list: landing page, emails, ads, posts, sales enablement, and reporting.',
          'Build a launch timeline with owners and deadlines.',
          'Write sample copy for at least one landing page hero, one email, one ad, and three social posts.',
          'Define metrics, guardrails, and review meetings.',
          'Create a retrospective template so the campaign produces learning.',
        ],
      },
      { type: 'h2', text: 'GTM campaign brief' },
      {
        type: 'code',
        title: 'Go-to-market campaign brief',
        language: 'text',
        code: `Campaign name:
Launch date:
Business goal:
Primary audience:
Audience trigger:
Positioning promise:
Offer:
Primary CTA:
Key proof:
Channels:
Budget:
Assets needed:
Owner:
Risks:
Success metrics:
Decision cadence:`,
      },
      { type: 'h2', text: 'Channel plan' },
      {
        type: 'table',
        headers: ['Funnel stage', 'Channel', 'Asset', 'Goal'],
        rows: [
          ['Awareness', 'Organic social', 'Launch story posts and short videos', 'Explain problem and create interest'],
          ['Awareness', 'Partner newsletter', 'Co-marketing blurb', 'Borrow trust from relevant audience'],
          ['Consideration', 'SEO or blog', 'Problem-solution guide', 'Educate and capture search demand'],
          ['Consideration', 'Webinar', 'Live demo and Q&A', 'Handle objections and deepen trust'],
          ['Conversion', 'Landing page', 'Offer page with proof', 'Convert visitors into leads or buyers'],
          ['Conversion', 'Email', 'Launch sequence', 'Move warm audience to action'],
          ['Retention', 'Onboarding email', 'First success checklist', 'Help new users reach value'],
        ],
      },
      { type: 'h2', text: 'Launch timeline' },
      {
        type: 'table',
        headers: ['Week', 'Focus', 'Key tasks', 'Output'],
        rows: [
          ['-4', 'Strategy', 'Audience, positioning, offer, KPI alignment', 'Approved brief'],
          ['-3', 'Production', 'Landing page, email drafts, social concepts, ad plan', 'Asset drafts'],
          ['-2', 'Review', 'Creative review, tracking setup, QA, partner coordination', 'Final assets'],
          ['-1', 'Pre-launch', 'Teasers, internal enablement, list segmentation', 'Ready checklist'],
          ['Launch', 'Go live', 'Publish page, send email, launch posts, monitor tracking', 'Live campaign'],
          ['+1', 'Optimize', 'Review early signals, fix issues, boost winning messages', 'Optimization notes'],
          ['+2', 'Report', 'Measure results, collect learning, plan follow-up', 'Retrospective'],
        ],
      },
      { type: 'h2', text: 'Sample messaging system' },
      {
        type: 'table',
        headers: ['Element', 'Sample copy'],
        rows: [
          ['Core promise', 'Launch campaigns faster with one workspace for planning, approvals, and reporting.'],
          ['Proof', 'Built from workflows used by small teams managing weekly launches.'],
          ['Objection response', 'No complex setup. Start with a ready-made campaign template.'],
          ['Primary CTA', 'Create your launch workspace'],
          ['Secondary CTA', 'Download the campaign checklist'],
        ],
      },
      { type: 'h2', text: 'Sample launch copy' },
      {
        type: 'code',
        title: 'Cross-channel copy samples',
        language: 'text',
        code: `Landing page hero:
Launch campaigns without approval chaos.
Plan the brief, collect feedback, track changes, and report results from one marketing workspace.
CTA: Create your launch workspace

Email opener:
If your launch plan lives in one doc, feedback in another, and approvals in three chat threads, the campaign is already harder than it needs to be.

Paid ad hook:
Your campaign should not slow down at the approval stage.

Social post:
A campaign launch is not only a publish date. It is a system of goals, messages, assets, approvals, tracking, and follow-up. We built a workspace to keep all of that together.`,
      },
      { type: 'h2', text: 'Measurement dashboard' },
      {
        type: 'table',
        headers: ['Metric type', 'Metric', 'Question answered'],
        rows: [
          ['Awareness', 'Reach, video views, branded search', 'Did the market notice?'],
          ['Engagement', 'Clicks, saves, replies, webinar attendance', 'Did the message create interest?'],
          ['Conversion', 'Lead rate, trial starts, purchases, demos', 'Did people take action?'],
          ['Quality', 'Qualified leads, activation, sales feedback', 'Were they the right people?'],
          ['Efficiency', 'CAC, cost per lead, payback', 'Was the campaign economically sensible?'],
          ['Retention', 'First value completion, repeat usage', 'Did new customers succeed?'],
        ],
      },
      { type: 'h2', text: 'Retrospective template' },
      {
        type: 'code',
        title: 'Campaign retro',
        language: 'text',
        code: `Goal:
Actual result:
What worked:
What did not work:
Best performing message:
Best performing channel:
Audience quality notes:
Tracking issues:
Customer feedback:
What we would repeat:
What we would change:
Next experiment:`,
      },
      {
        type: 'try',
        text: 'Assemble the full GTM plan into a portfolio deck or document. Include strategy, timeline, asset samples, dashboard, and retrospective template.',
      },
      {
        type: 'keypoints',
        items: [
          'A go-to-market campaign connects strategy and execution.',
          'The campaign brief prevents channel teams from working from different assumptions.',
          'Launch planning should include retention and learning, not only promotion.',
          'A strong portfolio project shows decisions, assets, metrics, and reflection.',
        ],
      },
    ],
  },
  {
    slug: 'dm-common-mistakes',
    title: 'Common Digital Marketing Mistakes (and Fixes)',
    description:
      'Recognize common marketing mistakes and learn practical fixes for strategy, channels, content, measurement, and execution.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 61,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Advanced marketers are not perfect. They simply notice problems earlier and use better systems to fix them. Many marketing failures are predictable: unclear audience, weak offer, inconsistent tracking, scattered channels, and no learning loop.',
      },
      { type: 'h2', text: 'Mistake 1: Starting with channels' },
      {
        type: 'p',
        text: 'The question is not "Should we be on TikTok, LinkedIn, or Google Ads?" The better question is "Where does our audience already look for this problem, and what do they need to believe before acting?"',
      },
      {
        type: 'tip',
        text: 'Fix: Write the audience, problem, offer, and funnel stage before choosing the channel.',
      },
      { type: 'h2', text: 'Mistake 2: Vague positioning' },
      {
        type: 'table',
        headers: ['Vague', 'Better'],
        rows: [
          ['We help businesses grow online', 'We help local clinics book more qualified patient consultations from search'],
          ['The best platform for teams', 'A campaign approval workspace for lean marketing teams'],
          ['Easy automation for everyone', 'Automate follow-up emails for abandoned carts in under an hour'],
        ],
      },
      { type: 'h2', text: 'Mistake 3: Measuring the wrong success' },
      {
        type: 'p',
        text: 'Likes, opens, impressions, and clicks can be useful, but they can also distract. Good measurement follows the job of the campaign and includes quality checks.',
      },
      {
        type: 'table',
        headers: ['Campaign job', 'Do not stop at', 'Add this quality metric'],
        rows: [
          ['Awareness', 'Impressions', 'Relevant reach or brand search lift'],
          ['Lead generation', 'Lead volume', 'Qualified lead rate'],
          ['Email nurture', 'Open rate', 'Click, reply, and conversion rate'],
          ['Paid acquisition', 'ROAS', 'Profit, retention, and payback period'],
        ],
      },
      { type: 'h2', text: 'Mistake 4: No testing discipline' },
      {
        type: 'ul',
        items: [
          'Changing too many variables at once.',
          'Stopping tests after one day of weak data.',
          'Testing button colors before offer clarity.',
          'Ignoring the losing results instead of learning from them.',
          'Failing to document what was tested and why.',
        ],
      },
      { type: 'h2', text: 'Mistake 5: Ignoring retention' },
      {
        type: 'p',
        text: 'Acquisition gets attention because it is visible. Retention compounds because satisfied customers buy again, refer, review, and make paid channels more profitable.',
      },
      { type: 'h2', text: 'Fix-it checklist' },
      {
        type: 'ol',
        items: [
          'Clarify the primary audience and use their language.',
          'Sharpen the offer before scaling traffic.',
          'Match the landing page to the ad or content promise.',
          'Install clean tracking and naming conventions.',
          'Review quality metrics, not only volume metrics.',
          'Document tests and decisions in a simple learning log.',
          'Add onboarding, nurture, and retention campaigns.',
        ],
      },
      {
        type: 'code',
        title: 'Campaign learning log',
        language: 'text',
        code: `Date:
Campaign:
Hypothesis:
Change made:
Expected result:
Actual result:
What we learned:
Next decision:
Owner:`,
      },
      {
        type: 'try',
        text: 'Audit a past campaign or a sample brand. Identify three mistakes, write the likely impact, and propose one fix for each.',
      },
      {
        type: 'keypoints',
        items: [
          'Most marketing mistakes come from unclear strategy or weak measurement.',
          'Fix audience, offer, and message before scaling channels.',
          'Quality metrics prevent false wins.',
          'A learning log makes the team smarter after every campaign.',
        ],
      },
    ],
  },
  {
    slug: 'dm-tools-stack',
    title: 'Modern Marketing Tools Stack',
    description:
      'Understand the modern marketing tools stack and how to choose tools for analytics, CRM, email, ads, content, automation, and reporting.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 62,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Marketing tools should support the strategy. A stack is useful when it helps teams collect consented data, plan work, publish campaigns, communicate with customers, measure results, and learn faster.',
      },
      {
        type: 'p',
        text: 'A common mistake is buying tools to solve process problems. If the team lacks a clear campaign brief, naming convention, owner, or reporting habit, a new platform may only make the mess more expensive.',
      },
      { type: 'h2', text: 'Core tool categories' },
      {
        type: 'table',
        headers: ['Category', 'What it does', 'Examples of capability'],
        rows: [
          ['Analytics', 'Measures behavior and outcomes', 'Events, goals, funnels, attribution, dashboards'],
          ['CRM', 'Stores contacts, companies, deals, and lifecycle stages', 'Lead management, sales notes, pipeline reporting'],
          ['Email and automation', 'Sends targeted messages', 'Welcome flows, newsletters, behavior triggers'],
          ['CMS and SEO', 'Publishes and optimizes content', 'Blog pages, metadata, internal links, technical checks'],
          ['Ads platforms', 'Runs paid campaigns', 'Audience targeting, creative tests, conversion tracking'],
          ['Social management', 'Plans and publishes posts', 'Calendar, approvals, comments, reporting'],
          ['CRO and landing pages', 'Improves conversion paths', 'Page building, forms, A/B tests, heatmaps'],
          ['Data and reporting', 'Combines sources for decisions', 'Dashboards, warehouse, BI, spreadsheets'],
        ],
      },
      { type: 'h2', text: 'Minimum viable stack' },
      {
        type: 'table',
        headers: ['Stage', 'Recommended stack', 'Why'],
        rows: [
          ['Solo or new project', 'Analytics, email tool, spreadsheet, simple CMS', 'Low cost and enough learning'],
          ['Growing team', 'CRM, automation, landing page builder, social scheduler', 'Better handoff and segmentation'],
          ['Scale-up', 'Warehouse or BI, advanced attribution, lifecycle automation', 'Cross-channel decisions and governance'],
          ['Enterprise', 'Customer data platform, consent management, security workflows', 'Complex privacy, roles, and integration needs'],
        ],
      },
      { type: 'h2', text: 'Tool selection scorecard' },
      {
        type: 'table',
        headers: ['Criterion', 'Question'],
        rows: [
          ['Fit', 'Does it solve a current high-value problem?'],
          ['Usability', 'Will the team actually use it every week?'],
          ['Integration', 'Does it connect to the existing stack cleanly?'],
          ['Data quality', 'Does it improve or damage reporting trust?'],
          ['Privacy', 'Can consent, access, and retention be managed properly?'],
          ['Cost', 'Does the value justify subscription, setup, and training time?'],
          ['Portability', 'Can data be exported if the tool changes later?'],
        ],
      },
      { type: 'h2', text: 'Naming and governance basics' },
      {
        type: 'p',
        text: 'Tools become powerful when the team uses shared rules. Campaign names, UTM tags, lifecycle stages, dashboards, and owner fields should be predictable.',
      },
      {
        type: 'code',
        title: 'Simple campaign naming convention',
        language: 'text',
        code: `Format:
YYYY-Q#_region_channel_campaign-audience_offer

Example:
2026-Q1_us_paid-social_launch-agencies_checklist

UTM source: platform
UTM medium: channel type
UTM campaign: same campaign name
UTM content: creative angle or asset`,
      },
      { type: 'h2', text: 'Avoid stack bloat' },
      {
        type: 'ul',
        items: [
          'Remove tools that duplicate another tool without a clear reason.',
          'Document who owns each tool and what data it contains.',
          'Review access permissions regularly.',
          'Create simple dashboards before complex attribution models.',
          'Train the team on workflows, not only features.',
        ],
      },
      {
        type: 'try',
        text: 'Map the tool stack for a brand you know. Mark each tool as keep, replace, consolidate, or investigate.',
      },
      {
        type: 'keypoints',
        items: [
          'The best tool stack supports strategy, workflow, measurement, and privacy.',
          'Start simple and add complexity only when the team needs it.',
          'Naming conventions and governance are part of the stack.',
          'Tool bloat creates cost, confusion, and unreliable data.',
        ],
      },
    ],
  },
  {
    slug: 'dm-freelance-agency',
    title: 'Freelancing & Agency Paths',
    description:
      'Learn how digital marketers can package services, price work, manage clients, and grow as freelancers or agencies.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 63,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Digital marketing skills can become a job, freelance practice, consulting offer, or agency. The professional challenge is not only doing the work. It is choosing a niche, packaging value, setting expectations, and delivering repeatable outcomes.',
      },
      { type: 'h2', text: 'Common service paths' },
      {
        type: 'table',
        headers: ['Path', 'Typical work', 'Good fit if you like'],
        rows: [
          ['SEO specialist', 'Audits, content plans, technical fixes, reporting', 'Research, structure, long-term growth'],
          ['Paid ads manager', 'Campaign setup, creative testing, optimization', 'Numbers, fast feedback, experiments'],
          ['Email marketer', 'Newsletters, automations, segmentation, deliverability', 'Copy, lifecycle, owned channels'],
          ['Content strategist', 'Editorial calendars, briefs, thought leadership', 'Audience insight and storytelling'],
          ['CRO consultant', 'Landing pages, testing, user research', 'Behavior, design, and conversion'],
          ['Fractional marketing lead', 'Strategy, planning, vendor management, reporting', 'Cross-channel leadership'],
        ],
      },
      { type: 'h2', text: 'Package services clearly' },
      {
        type: 'table',
        headers: ['Package', 'Deliverables', 'Best for'],
        rows: [
          ['Audit', 'Find problems and priorities', 'Clients who need clarity before execution'],
          ['Setup', 'Build tracking, funnel, automation, or campaign', 'Clients who need implementation'],
          ['Retainer', 'Ongoing campaigns, optimization, reporting', 'Clients who need continuous growth'],
          ['Sprint', 'Focused project in 2-6 weeks', 'Clients who need a fast outcome'],
          ['Advisory', 'Calls, reviews, strategy guidance', 'Teams that execute internally'],
        ],
      },
      { type: 'h2', text: 'Pricing models' },
      {
        type: 'table',
        headers: ['Model', 'How it works', 'Watch out for'],
        rows: [
          ['Hourly', 'Charge for time', 'Can punish efficiency and create scope debates'],
          ['Project', 'Fixed fee for defined deliverables', 'Requires clear scope and change process'],
          ['Retainer', 'Monthly fee for ongoing work', 'Needs clear capacity and reporting'],
          ['Performance', 'Pay tied to results', 'Needs clean attribution and risk control'],
          ['Hybrid', 'Base fee plus performance bonus', 'Requires strong agreement on metrics'],
        ],
      },
      { type: 'h2', text: 'Client onboarding checklist' },
      {
        type: 'ol',
        items: [
          'Confirm goals, timeline, budget, stakeholders, and decision process.',
          'Request access to analytics, ad accounts, CRM, CMS, email platform, and brand assets.',
          'Document current baseline metrics.',
          'Clarify approvals, meeting cadence, response times, and reporting format.',
          'Define what is in scope and what requires a new estimate.',
          'Agree on how success will be judged.',
        ],
      },
      { type: 'h2', text: 'Simple proposal structure' },
      {
        type: 'code',
        title: 'Marketing proposal outline',
        language: 'text',
        code: `1. Situation summary
2. Goals
3. Recommended approach
4. Scope and deliverables
5. Timeline
6. Client responsibilities
7. Investment
8. Measurement and reporting
9. Assumptions
10. Next steps`,
      },
      {
        type: 'tip',
        text: 'The easiest services to sell are specific, painful, and tied to a business outcome. "Marketing help" is vague. "Fixing a broken welcome funnel" is concrete.',
      },
      { type: 'h2', text: 'Protect your work' },
      {
        type: 'ul',
        items: [
          'Use written agreements and clear scopes.',
          'Do not guarantee results you cannot control.',
          'Keep records of approvals and decisions.',
          'Separate strategy recommendations from platform spending.',
          'Report honestly, including what did not work.',
        ],
      },
      {
        type: 'try',
        text: 'Design one freelance package: name, target client, problem solved, deliverables, timeline, price range, and success metric.',
      },
      {
        type: 'keypoints',
        items: [
          'Freelance and agency success depends on packaging, expectation-setting, and delivery systems.',
          'Choose a service path that matches your strengths and market demand.',
          'Clear proposals reduce scope confusion.',
          'Report learning and business impact, not only task completion.',
        ],
      },
    ],
  },
  {
    slug: 'dm-portfolio',
    title: 'Building a Marketing Portfolio',
    description:
      'Create a digital marketing portfolio that proves strategy, execution, measurement, and communication skills.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 64,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'A marketing portfolio is evidence. It shows how you think, what you made, what happened, and what you learned. It is especially useful when you do not yet have years of job titles.',
      },
      {
        type: 'p',
        text: 'Your portfolio does not need secret client data. You can use public brand audits, mock campaigns, volunteer projects, personal projects, or anonymized work with permission.',
      },
      { type: 'h2', text: 'What to include' },
      {
        type: 'table',
        headers: ['Portfolio item', 'What it proves'],
        rows: [
          ['SEO content plan', 'Research, intent mapping, content strategy'],
          ['Social calendar', 'Audience understanding and campaign consistency'],
          ['Email funnel', 'Lifecycle thinking, copy, segmentation'],
          ['Paid ads brief', 'Creative testing, offer alignment, measurement'],
          ['Landing page audit', 'CRO, messaging, user journey'],
          ['Campaign report', 'Analysis, learning, business communication'],
        ],
      },
      { type: 'h2', text: 'Case study structure' },
      {
        type: 'code',
        title: 'Portfolio case study outline',
        language: 'text',
        code: `Title:
Context:
Goal:
Audience:
Problem:
Strategy:
Execution:
Sample assets:
Measurement plan:
Results or expected impact:
What I learned:
What I would do next:`,
      },
      { type: 'h2', text: 'Make process visible' },
      {
        type: 'p',
        text: 'Hiring managers and clients want to see judgment. Show why you chose the audience, channel, message, offer, and metric. A polished screenshot without reasoning is less persuasive than a clear decision trail.',
      },
      {
        type: 'table',
        headers: ['Weak portfolio', 'Stronger portfolio'],
        rows: [
          ['A folder of social graphics', 'Calendar with pillars, goals, captions, and performance notes'],
          ['A list of keywords', 'SEO map with intent, priority, briefs, and conversion path'],
          ['An ad screenshot', 'Campaign brief with creative angles, budget, and decision rules'],
          ['A dashboard screenshot', 'Report explaining what changed and what to do next'],
        ],
      },
      { type: 'h2', text: 'If you have no clients yet' },
      {
        type: 'ol',
        items: [
          'Choose a real brand, nonprofit, local business, creator, or fictional sample.',
          'State clearly that the work is a self-directed project if it is not client work.',
          'Use public information and avoid claiming access you do not have.',
          'Create realistic assets and explain assumptions.',
          'Include measurement plans even if you cannot access real results.',
          'Ask for feedback from marketers, founders, or target customers.',
        ],
      },
      { type: 'h2', text: 'Portfolio polish checklist' },
      {
        type: 'ul',
        items: [
          'Use clear titles that describe the business problem.',
          'Keep each case study easy to skim.',
          'Include screenshots, tables, and sample copy where helpful.',
          'Explain your role and constraints honestly.',
          'Remove confidential data or get written permission.',
          'End each case with the next decision you would make.',
        ],
      },
      {
        type: 'try',
        text: 'Turn one mini project from this tutorial into a one-page case study using the case study outline.',
      },
      {
        type: 'keypoints',
        items: [
          'A portfolio proves thinking, execution, measurement, and reflection.',
          'Self-directed projects can be useful when clearly labeled.',
          'Process and decisions are as important as final assets.',
          'Protect confidential data and present results honestly.',
        ],
      },
    ],
  },
  {
    slug: 'dm-next-steps',
    title: 'What to Learn After Digital Marketing',
    description:
      'Choose your next learning path after digital marketing: analytics, brand, product marketing, lifecycle, CRO, media buying, or leadership.',
    level: 'advanced',
    section: 'Polish & Next Steps',
    order: 65,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Digital marketing is broad. After learning the essentials and completing projects, the next step is to choose depth. Depth turns general knowledge into professional advantage.',
      },
      {
        type: 'p',
        text: 'Your next path depends on what you enjoy, what the market needs, and where you want to create value: analysis, creative, strategy, operations, product, or leadership.',
      },
      { type: 'h2', text: 'Specialization paths' },
      {
        type: 'table',
        headers: ['Path', 'Learn next', 'Good fit if you enjoy'],
        rows: [
          ['Marketing analytics', 'SQL, dashboards, attribution, experimentation', 'Finding truth in messy data'],
          ['SEO and content', 'Technical SEO, topic authority, editorial systems', 'Research and durable growth'],
          ['Paid media', 'Platform buying, creative testing, incrementality', 'Fast feedback and optimization'],
          ['Lifecycle marketing', 'Segmentation, automation, retention, CRM', 'Customer journeys and owned channels'],
          ['CRO', 'UX research, testing, landing pages, persuasion', 'Improving conversion and experience'],
          ['Product marketing', 'Positioning, launches, sales enablement, competitive intel', 'Connecting product and market'],
          ['Brand strategy', 'Category design, creative direction, memory structures', 'Long-term meaning and differentiation'],
          ['Growth leadership', 'Planning, teams, budgets, forecasting, systems', 'Leading cross-functional growth'],
        ],
      },
      { type: 'h2', text: 'Build your learning roadmap' },
      {
        type: 'ol',
        items: [
          'Choose one specialization for the next 90 days.',
          'Pick one real project that forces you to practice it.',
          'Choose one tool or technical skill that supports the path.',
          'Study five strong examples from brands in that specialty.',
          'Publish or document one portfolio artifact.',
          'Ask for review from someone who has done the work professionally.',
        ],
      },
      { type: 'h2', text: '90-day growth plan' },
      {
        type: 'table',
        headers: ['Month', 'Focus', 'Output'],
        rows: [
          ['1', 'Foundations and examples', 'Swipe file, notes, skill checklist'],
          ['2', 'Hands-on project', 'Campaign, audit, dashboard, or experiment'],
          ['3', 'Publish and improve', 'Portfolio case study and feedback revisions'],
        ],
      },
      { type: 'h2', text: 'Professional habits to keep' },
      {
        type: 'ul',
        items: [
          'Read customer language every week.',
          'Review campaign results with curiosity instead of ego.',
          'Keep a swipe file of strong ads, pages, emails, and reports.',
          'Document assumptions before a campaign starts.',
          'Protect privacy and trust as part of performance.',
          'Learn enough analytics to question easy conclusions.',
          'Practice writing because clear writing improves every marketing role.',
        ],
      },
      { type: 'h2', text: 'Your final checklist' },
      {
        type: 'code',
        title: 'Digital marketing next-step checklist',
        language: 'text',
        code: `I can explain a funnel strategy.
I can research an audience and competitors.
I can write positioning and messaging.
I can plan SEO, social, email, and paid campaigns.
I can define KPIs and guardrail metrics.
I can respect privacy and consent.
I can present a campaign as a portfolio case study.
My next specialization is:
My next project is:
My review date is:`,
      },
      {
        type: 'try',
        text: 'Choose one specialization and write a 90-day plan with one project, one tool, one portfolio artifact, and one feedback source.',
      },
      {
        type: 'keypoints',
        items: [
          'After broad digital marketing, choose a specialization to build depth.',
          'The best learning path includes real projects and feedback.',
          'Analytics, writing, privacy, and customer understanding help every specialization.',
          'Your portfolio should keep growing as your judgment improves.',
        ],
      },
    ],
  },
];
