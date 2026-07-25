import type { TutorialLesson } from '../types';

export const beginnerLessons: TutorialLesson[] = [
  {
    slug: 'what-is-digital-marketing',
    title: 'What is Digital Marketing?',
    description: 'Learn what digital marketing means, why it matters, and how businesses use online channels to attract and keep customers.',
    level: 'beginner',
    section: 'Getting Started',
    order: 1,
    minutes: 10,
    content: [
      { type: 'p', text: 'Digital marketing is the practice of promoting products, services, brands, or ideas through online channels. It includes websites, search engines, social media, email, online ads, video platforms, marketplaces, and analytics tools.' },
      { type: 'p', text: 'The goal is simple: reach the right people, give them useful reasons to care, help them take the next step, and measure what happened so you can improve.' },
      { type: 'h2', text: 'What digital marketers actually do' },
      { type: 'p', text: 'Digital marketers combine strategy, creativity, communication, and measurement. A small business marketer might write posts, update a website, send emails, run local ads, and check which activities created bookings.' },
      {
        type: 'table',
        headers: ['Activity', 'Beginner example', 'Why it matters'],
        rows: [
          ['Content', 'Publish a guide called "How to Choose Running Shoes"', 'Attracts people who are researching a problem'],
          ['SEO', 'Improve a bakery page so it appears for "birthday cakes near me"', 'Brings free search traffic over time'],
          ['Social media', 'Post before-and-after photos for a salon', 'Builds trust and keeps the brand visible'],
          ['Email', 'Send a welcome offer to new subscribers', 'Turns interest into repeat communication'],
          ['Analytics', 'Check which page produced the most quote requests', 'Shows what to improve next']
        ]
      },
      { type: 'h2', text: 'Digital marketing is not just posting online' },
      { type: 'p', text: 'Posting without a plan is activity, not strategy. Good marketing starts with an audience, a clear offer, a message that matches the audience need, and a way to measure the result.' },
      {
        type: 'code',
        title: 'Simple digital marketing plan',
        language: 'text',
        code: `Business: Local yoga studio
Audience: Busy adults within 5 miles
Offer: First class for $10
Channel: Google Business Profile, Instagram, email
Action: Book a beginner class
Metric: Class bookings from new students`
      },
      { type: 'h2', text: 'Why digital marketing is powerful' },
      { type: 'ul', items: ['You can start with a small budget and improve over time.', 'You can target specific interests, locations, search terms, or behaviors.', 'You can measure clicks, signups, sales, calls, and repeat visits.', 'You can test different messages instead of guessing forever.'] },
      { type: 'note', text: 'Digital marketing does not guarantee instant results. It rewards clear thinking, consistent execution, and honest measurement.' },
      { type: 'try', text: 'Choose one business you know. Write the audience, main offer, best online channel, and the action you would want people to take.' },
      { type: 'keypoints', items: ['Digital marketing uses online channels to reach and convert people.', 'It includes content, SEO, social, email, ads, websites, and analytics.', 'Good digital marketing starts with audience, offer, message, and measurement.', 'The best beginners learn one channel at a time while keeping the whole customer journey in mind.'] }
    ]
  },
  {
    slug: 'dm-vs-traditional',
    title: 'Digital vs Traditional Marketing',
    description: 'Compare digital and traditional marketing so you can choose the right mix for a product, service, or local business.',
    level: 'beginner',
    section: 'Getting Started',
    order: 2,
    minutes: 9,
    content: [
      { type: 'p', text: 'Traditional marketing uses offline channels such as print ads, flyers, billboards, direct mail, radio, TV, events, and sponsorships. Digital marketing uses online channels such as search, social, email, websites, apps, and digital ads.' },
      { type: 'p', text: 'Both can work. The right choice depends on where the audience pays attention, how complex the purchase is, the budget, and how quickly you need feedback.' },
      { type: 'h2', text: 'Main differences' },
      {
        type: 'table',
        headers: ['Area', 'Digital marketing', 'Traditional marketing'],
        rows: [
          ['Targeting', 'Can target searches, locations, interests, lists, and behaviors', 'Often targets broad locations or media audiences'],
          ['Measurement', 'Clicks, views, conversions, revenue, and attribution can be tracked', 'Measurement often uses surveys, codes, calls, or estimates'],
          ['Speed', 'Campaigns can launch, pause, and edit quickly', 'Production and placement can take longer'],
          ['Cost', 'Can start small and scale', 'Often needs larger upfront spend'],
          ['Trust', 'Reviews, useful content, and retargeting build familiarity', 'Physical presence and mass media can feel established']
        ]
      },
      { type: 'h2', text: 'A practical local example' },
      { type: 'p', text: 'Imagine a new dental clinic. A flyer mailed to nearby homes can create local awareness. A Google Business Profile, review strategy, search-friendly service pages, and appointment landing page can capture people searching right now.' },
      {
        type: 'code',
        title: 'Channel mix for a dental clinic',
        language: 'text',
        code: `Traditional:
- Mailer to nearby households
- Signage outside the clinic
- Community event sponsorship

Digital:
- Google Business Profile
- Local SEO service pages
- Appointment reminder emails
- Search ads for "emergency dentist near me"`
      },
      { type: 'h2', text: 'When traditional still helps' },
      { type: 'ul', items: ['You need local awareness in a tight geographic area.', 'The audience is less active online for the buying decision.', 'The physical presence of the brand matters, such as events or retail.', 'Offline material supports online action, such as a QR code to book.'] },
      { type: 'tip', text: 'Avoid thinking "digital or traditional" too early. Many strong campaigns combine both, then use digital tracking to learn which messages and offers create action.' },
      { type: 'try', text: 'Pick a local restaurant, online course, or ecommerce product. List one traditional tactic and one digital tactic that could support the same campaign goal.' },
      { type: 'keypoints', items: ['Digital marketing is easier to target, edit, and measure.', 'Traditional marketing can still build local awareness and credibility.', 'The best channel is the one your audience notices and acts on.', 'Offline and online tactics often work better together than separately.'] }
    ]
  },
  {
    slug: 'dm-customer-journey',
    title: 'The Customer Journey',
    description: 'Understand the path people take from first discovering a brand to buying, returning, and recommending it.',
    level: 'beginner',
    section: 'Strategy Foundations',
    order: 3,
    minutes: 11,
    content: [
      { type: 'p', text: 'The customer journey is the path a person follows before, during, and after becoming a customer. People rarely buy the first time they hear about a brand. They notice, compare, ask questions, look for proof, and decide when the timing feels right.' },
      { type: 'p', text: 'Marketing becomes easier when you understand what the customer needs at each step instead of sending the same message to everyone.' },
      { type: 'h2', text: 'Common journey stages' },
      {
        type: 'table',
        headers: ['Stage', 'Customer question', 'Marketing job', 'Example content'],
        rows: [
          ['Awareness', 'What is this problem or opportunity?', 'Educate and get noticed', 'Beginner guide, short video, social post'],
          ['Consideration', 'Which solution is right for me?', 'Build trust and explain fit', 'Comparison page, case study, webinar'],
          ['Decision', 'Why should I choose this now?', 'Remove doubt and make action easy', 'Offer page, demo, testimonials'],
          ['Retention', 'How do I get value again?', 'Support usage and repeat purchase', 'Onboarding email, tips, loyalty offer'],
          ['Advocacy', 'Who else should know?', 'Encourage reviews and referrals', 'Review request, referral program']
        ]
      },
      { type: 'h2', text: 'Example: ecommerce skincare store' },
      { type: 'p', text: 'A shopper may first search "why is my skin dry," then watch a routine video, then read reviews, then add a moisturizer to cart, then wait for a discount email. Each touchpoint has a job.' },
      {
        type: 'code',
        title: 'Journey notes',
        language: 'text',
        code: `Audience: People with dry sensitive skin
Awareness: Blog post about causes of dry skin
Consideration: Ingredient guide and routine quiz
Decision: Product page with reviews and guarantee
Retention: Email with usage tips after purchase
Advocacy: Review request 14 days after delivery`
      },
      { type: 'h2', text: 'Map touchpoints, not just channels' },
      { type: 'p', text: 'A touchpoint is any interaction with the brand. It could be a search result, ad, product page, review, email, checkout page, support reply, packaging insert, or receipt.' },
      { type: 'ul', items: ['List what the customer sees.', 'List what the customer thinks or worries about.', 'List what action you want next.', 'List what proof or help would make that action easier.'] },
      { type: 'note', text: 'A journey map is a working tool, not a perfect diagram. Start simple and improve it when you learn from real customers.' },
      { type: 'try', text: 'Map the journey for buying an online course. Write one customer question and one useful marketing asset for awareness, consideration, decision, and retention.' },
      { type: 'keypoints', items: ['The customer journey explains how people move from discovery to loyalty.', 'Different stages need different messages and proof.', 'Touchpoints include pages, ads, emails, reviews, support, and offline moments.', 'Journey thinking helps beginners avoid pushing for a sale too early.'] }
    ]
  },
  {
    slug: 'dm-funnels',
    title: 'Marketing Funnels Explained',
    description: 'Learn how funnels organize customer actions from first visit to conversion and reveal where campaigns need improvement.',
    level: 'beginner',
    section: 'Strategy Foundations',
    order: 4,
    minutes: 10,
    content: [
      { type: 'p', text: 'A marketing funnel is a simple model that shows how many people move through a series of steps. It is called a funnel because many people may see a message, fewer click, fewer sign up, and fewer buy.' },
      { type: 'p', text: 'Funnels help marketers find leaks. If many people click an ad but almost nobody signs up, the landing page or offer may need work.' },
      { type: 'h2', text: 'A basic funnel' },
      {
        type: 'table',
        headers: ['Funnel step', 'Example action', 'Question to ask'],
        rows: [
          ['Reach', '1,000 people see an Instagram Reel', 'Is the right audience seeing the message?'],
          ['Visit', '120 people click the profile link', 'Is the hook strong enough?'],
          ['Lead', '30 people join the email list', 'Is the offer valuable enough?'],
          ['Customer', '6 people buy the starter kit', 'Is the checkout clear and trustworthy?'],
          ['Repeat', '2 people buy again next month', 'Did the product and follow-up create value?']
        ]
      },
      { type: 'h2', text: 'Funnel math beginners should know' },
      { type: 'p', text: 'Conversion rate means the percentage of people who took the next action. If 100 visitors produce 5 purchases, the purchase conversion rate is 5%.' },
      {
        type: 'code',
        title: 'Simple funnel report',
        language: 'text',
        code: `Course launch funnel:
Landing page visitors: 1,000
Webinar signups: 250
Webinar attendees: 120
Course buyers: 24

Signup rate: 25%
Attendance rate: 48%
Buyer rate from attendees: 20%
Overall visitor-to-buyer rate: 2.4%`
      },
      { type: 'h2', text: 'Top, middle, and bottom of funnel' },
      { type: 'ul', items: ['Top of funnel: educate and attract people who may not know you yet.', 'Middle of funnel: build trust with comparisons, proof, demos, and useful emails.', 'Bottom of funnel: help ready buyers take action with clear offers, urgency, guarantees, and easy checkout.'] },
      { type: 'tip', text: 'Do not judge every channel by immediate sales. A helpful YouTube tutorial may be top-of-funnel content that supports later search, email, or direct visits.' },
      { type: 'try', text: 'Write a four-step funnel for a local gym, a SaaS free trial, or an ecommerce backpack. Include one metric for each step.' },
      { type: 'keypoints', items: ['Funnels show how people move through marketing steps.', 'Conversion rate measures how many people take the next action.', 'Funnel leaks reveal where to improve copy, targeting, offer, or page experience.', 'Top, middle, and bottom funnel content have different jobs.'] }
    ]
  },
  {
    slug: 'dm-personas',
    title: 'Audience Research & Personas',
    description: 'Learn how to research an audience and create practical personas that guide messages, channels, and offers.',
    level: 'beginner',
    section: 'Strategy Foundations',
    order: 5,
    minutes: 12,
    content: [
      { type: 'p', text: 'Audience research means learning who you are trying to reach, what they care about, what problems they have, and how they choose solutions. A persona is a short profile that summarizes a key audience segment.' },
      { type: 'p', text: 'Personas are useful when they help you make better marketing decisions. They are not useful when they become fictional biographies with no connection to real behavior.' },
      { type: 'h2', text: 'What to research' },
      {
        type: 'table',
        headers: ['Research area', 'Questions to ask', 'Where to learn'],
        rows: [
          ['Problem', 'What is frustrating, expensive, confusing, or urgent?', 'Customer interviews, support tickets, reviews'],
          ['Motivation', 'What outcome do they want?', 'Sales calls, survey responses, social comments'],
          ['Objections', 'What could stop them from buying?', 'FAQs, abandoned carts, competitor reviews'],
          ['Language', 'What words do they use?', 'Search queries, forums, comments, review headlines'],
          ['Channels', 'Where do they spend attention?', 'Analytics, audience surveys, platform insights']
        ]
      },
      { type: 'h2', text: 'Persona example' },
      { type: 'p', text: 'A persona should fit on one page and focus on buying behavior. Here is an example for a beginner coding course.' },
      {
        type: 'code',
        title: 'Practical persona',
        language: 'text',
        code: `Name: Career Switcher Chris
Situation: Works full-time and studies at night
Goal: Build enough skill to apply for junior developer roles
Pain points: Feels overwhelmed, lacks a clear path, worries about wasting money
Needs to believe: The course is beginner-friendly and project-based
Best channels: YouTube tutorials, search, email, LinkedIn
Message angle: "Learn by building portfolio projects in small weekly steps"`
      },
      { type: 'h2', text: 'Research without a big budget' },
      { type: 'ul', items: ['Read 20 positive and 20 negative reviews of similar products.', 'Search Reddit, Quora, YouTube comments, and niche communities for repeated questions.', 'Talk to five customers or prospects and ask what they tried before.', 'Check search autocomplete for phrases people use.', 'Review analytics to see which pages, emails, or posts already get attention.'] },
      { type: 'note', text: 'Do not reduce a persona to age and job title. Two people with the same demographics can have completely different motivations and buying triggers.' },
      { type: 'try', text: 'Create one persona for an ecommerce store, SaaS product, or local service. Include problem, desired outcome, objection, best channel, and message angle.' },
      { type: 'keypoints', items: ['Audience research helps you understand real customer needs and language.', 'Personas should guide messaging, channels, offers, and content decisions.', 'Useful personas focus on goals, pains, objections, and behavior.', 'Reviews, interviews, search data, and support questions are beginner-friendly research sources.'] }
    ]
  },
  {
    slug: 'dm-value-proposition',
    title: 'Value Proposition & Offers',
    description: 'Learn how to explain why people should choose you and how to package offers that are easy to understand.',
    level: 'beginner',
    section: 'Strategy Foundations',
    order: 6,
    minutes: 11,
    content: [
      { type: 'p', text: 'A value proposition explains why someone should choose your product, service, or content instead of doing nothing or choosing another option. An offer is the specific thing you ask them to accept, such as a consultation, discount, trial, bundle, or purchase.' },
      { type: 'p', text: 'Beginners often write messages about features. Customers usually care more about outcomes, speed, confidence, convenience, risk reduction, and identity.' },
      { type: 'h2', text: 'Value proposition formula' },
      {
        type: 'code',
        title: 'Plain-language formula',
        language: 'text',
        code: `For [audience]
who want [desired outcome],
we provide [product or service]
that helps them [main benefit]
without [common pain or objection].`
      },
      { type: 'h2', text: 'Examples' },
      {
        type: 'table',
        headers: ['Business', 'Weak message', 'Stronger value proposition'],
        rows: [
          ['Local meal prep', 'Healthy meals delivered', 'Fresh high-protein meals for busy professionals who want dinner ready in 3 minutes without grocery shopping'],
          ['SaaS invoicing app', 'Easy invoices', 'Send professional invoices and get paid faster without building spreadsheets'],
          ['Online course', 'Learn design', 'Build a job-ready UX portfolio through weekly beginner projects and feedback'],
          ['Pet grooming', 'We groom dogs', 'Stress-light grooming for small dogs with online booking and photo updates']
        ]
      },
      { type: 'h2', text: 'Offer building blocks' },
      { type: 'ul', items: ['Core result: what the customer gets.', 'Audience fit: who the offer is best for.', 'Proof: testimonials, results, samples, reviews, or guarantees.', 'Risk reversal: free trial, refund policy, consultation, or clear cancellation.', 'Urgency or reason to act: launch bonus, limited seats, seasonal deadline, or expiring quote.'] },
      { type: 'h2', text: 'Make the offer specific' },
      { type: 'p', text: 'Specific offers are easier to understand and compare. "Free website audit with 3 prioritized fixes" is clearer than "contact us to learn more."' },
      { type: 'tip', text: 'If people understand the offer quickly, they are more likely to continue. Clarity usually beats cleverness in beginner marketing.' },
      { type: 'try', text: 'Rewrite this offer for a local cleaning service: "Quality cleaning at affordable prices." Include audience, result, convenience, and risk reduction.' },
      { type: 'keypoints', items: ['A value proposition explains why someone should choose you.', 'An offer packages the next step in a clear and compelling way.', 'Strong messages focus on outcomes and objections, not just features.', 'Specific offers are easier to trust, compare, and act on.'] }
    ]
  },
  {
    slug: 'dm-brand-basics',
    title: 'Brand Basics for Marketers',
    description: 'Understand brand positioning, voice, visuals, trust signals, and consistency from a beginner marketing perspective.',
    level: 'beginner',
    section: 'Strategy Foundations',
    order: 7,
    minutes: 10,
    content: [
      { type: 'p', text: 'A brand is the set of expectations and feelings people connect with a business. It is shaped by the name, visuals, tone, promises, customer experience, reviews, product quality, and every marketing touchpoint.' },
      { type: 'p', text: 'Branding is not only a logo. For marketers, brand basics help messages sound consistent and make the business easier to recognize and trust.' },
      { type: 'h2', text: 'Core brand elements' },
      {
        type: 'table',
        headers: ['Element', 'Beginner question', 'Example'],
        rows: [
          ['Positioning', 'What place do we want in the market?', 'Affordable bookkeeping for solo creators'],
          ['Voice', 'How should we sound?', 'Helpful, simple, confident, never intimidating'],
          ['Visual identity', 'How should we look?', 'Clean colors, readable type, consistent product photos'],
          ['Promise', 'What can customers expect every time?', 'Reports delivered by the 5th business day'],
          ['Trust signals', 'Why should people believe us?', 'Reviews, certifications, case studies, guarantees']
        ]
      },
      { type: 'h2', text: 'Brand voice example' },
      {
        type: 'code',
        title: 'Voice guide snapshot',
        language: 'text',
        code: `Brand: Beginner-friendly budgeting app
Sound like: Calm coach, not strict accountant
Use: "Plan next month's spending in 10 minutes"
Avoid: "Optimize your fiscal allocation strategy"
Personality words: clear, encouraging, practical`
      },
      { type: 'h2', text: 'Consistency builds memory' },
      { type: 'p', text: 'People need repeated, consistent signals before they remember and trust a brand. Use the same core message, colors, call-to-action style, and proof points across your website, emails, social profiles, and ads.' },
      { type: 'h2', text: 'Brand trust checklist' },
      { type: 'ul', items: ['Clear contact information or support path.', 'Recent testimonials or reviews.', 'Real product, service, or team photos where possible.', 'Accurate claims that can be supported.', 'Consistent promise across ads, pages, and sales conversations.'] },
      { type: 'note', text: 'A strong brand does not require a huge budget. It requires clarity, consistency, and keeping promises.' },
      { type: 'try', text: 'Choose a brand you like. Write three words that describe its voice, then find one website or social example that proves those words.' },
      { type: 'keypoints', items: ['A brand is the expectation people have about a business.', 'Brand basics include positioning, voice, visuals, promise, and proof.', 'Consistency helps people recognize and remember you.', 'Trust grows when marketing promises match the real customer experience.'] }
    ]
  },
  {
    slug: 'dm-channels-overview',
    title: 'Digital Channels Overview',
    description: 'Get a beginner-friendly map of major digital marketing channels and learn when each channel is useful.',
    level: 'beginner',
    section: 'Strategy Foundations',
    order: 8,
    minutes: 12,
    content: [
      { type: 'p', text: 'A digital marketing channel is a place or method used to reach people online. Common channels include search engines, social platforms, email, websites, paid ads, video, affiliates, communities, marketplaces, and messaging apps.' },
      { type: 'p', text: 'No beginner needs to master every channel at once. The goal is to understand the role of each channel, then choose the few that match your audience and offer.' },
      { type: 'h2', text: 'Owned, earned, and paid channels' },
      {
        type: 'table',
        headers: ['Type', 'Meaning', 'Examples', 'Main benefit'],
        rows: [
          ['Owned', 'Channels you control more directly', 'Website, blog, email list, app, SMS list', 'Long-term asset building'],
          ['Earned', 'Attention others give you', 'SEO traffic, reviews, shares, press, referrals', 'Credibility and compounding reach'],
          ['Paid', 'Attention you buy', 'Search ads, social ads, sponsorships, display ads', 'Speed and targeting']
        ]
      },
      { type: 'h2', text: 'Channel roles' },
      {
        type: 'table',
        headers: ['Channel', 'Best for', 'Beginner example'],
        rows: [
          ['SEO', 'Capturing active search demand', 'Blog post for "best plants for low light apartments"'],
          ['Social media', 'Awareness, community, proof, and conversation', 'Short video showing a product transformation'],
          ['Email', 'Nurturing, retention, launches, and repeat sales', 'Welcome sequence after a free checklist download'],
          ['Paid search', 'High-intent demand', 'Ad for "book emergency plumber"'],
          ['Paid social', 'Demand creation and retargeting', 'Ad for a new fitness challenge'],
          ['Landing pages', 'Focused conversion', 'Single page for a webinar signup']
        ]
      },
      { type: 'h2', text: 'How to choose channels' },
      { type: 'ol', items: ['Start with the audience: where do they already pay attention?', 'Match the buying intent: are they searching now or need education first?', 'Consider resources: do you have time for content, budget for ads, or a strong email list?', 'Pick one primary channel and one support channel for the first campaign.', 'Measure results for at least a full learning cycle before switching.'] },
      { type: 'tip', text: 'A common beginner setup is website plus one traffic channel plus email capture. This gives you a home base, a way to attract people, and a way to follow up.' },
      { type: 'try', text: 'For a handmade candle ecommerce store, choose one owned, one earned, and one paid channel. Explain the role of each in one sentence.' },
      { type: 'keypoints', items: ['Digital channels include search, social, email, websites, ads, video, and more.', 'Owned, earned, and paid channels play different roles.', 'Choose channels based on audience behavior, buying intent, and available resources.', 'Beginners should focus before expanding.'] }
    ]
  },
  {
    slug: 'dm-goals-kpis',
    title: 'Goals, KPIs & Metrics',
    description: 'Learn how to set practical marketing goals and choose metrics that show whether your work is improving.',
    level: 'beginner',
    section: 'Strategy Foundations',
    order: 9,
    minutes: 12,
    content: [
      { type: 'p', text: 'A marketing goal is the result you want. A KPI, or key performance indicator, is a metric that tells you whether you are moving toward that result. Metrics are the numbers you track along the way.' },
      { type: 'p', text: 'Good measurement protects beginners from two common problems: celebrating empty activity and ignoring useful progress.' },
      { type: 'h2', text: 'Goal versus KPI versus metric' },
      {
        type: 'table',
        headers: ['Term', 'Meaning', 'Example'],
        rows: [
          ['Goal', 'Business or campaign outcome', 'Generate 40 qualified consultation requests this quarter'],
          ['KPI', 'Important number tied to the goal', 'Qualified leads per month'],
          ['Metric', 'Any tracked number that gives context', 'Page visits, click-through rate, form completion rate, cost per lead']
        ]
      },
      { type: 'h2', text: 'Useful beginner KPIs' },
      {
        type: 'table',
        headers: ['Objective', 'Possible KPIs', 'Watch out for'],
        rows: [
          ['Awareness', 'Reach, impressions, branded search, video views', 'Views from the wrong audience'],
          ['Traffic', 'Website sessions, landing page visits, source quality', 'Traffic that never takes action'],
          ['Lead generation', 'Form submissions, booked calls, cost per lead', 'Low-quality leads'],
          ['Sales', 'Conversion rate, revenue, average order value, cost per purchase', 'Discount-driven sales with poor margin'],
          ['Retention', 'Repeat purchase rate, email engagement, churn', 'Engagement that does not predict revenue']
        ]
      },
      { type: 'h2', text: 'SMART goals' },
      { type: 'p', text: 'SMART goals are specific, measurable, achievable, relevant, and time-bound. They turn vague hopes into a clear target.' },
      {
        type: 'code',
        title: 'SMART goal examples',
        language: 'text',
        code: `Weak: Get more traffic.
SMART: Increase organic website visits from 2,000 to 3,000 per month within 90 days.

Weak: Grow email.
SMART: Add 500 new email subscribers before the course launch on September 1.

Weak: Improve ads.
SMART: Reduce cost per qualified demo request from $120 to $90 this quarter.`
      },
      { type: 'h2', text: 'Vanity metrics and useful metrics' },
      { type: 'p', text: 'A vanity metric looks impressive but may not connect to business results. Followers, likes, or impressions can matter, but only when they support a goal.' },
      { type: 'note', text: 'Measure what you can act on. If a metric will not change a decision, it may not deserve a prominent place in your report.' },
      { type: 'try', text: 'Write one SMART goal for a local business, one KPI for that goal, and three supporting metrics you would review weekly.' },
      { type: 'keypoints', items: ['Goals define the result you want.', 'KPIs are the most important indicators of progress.', 'Metrics add context and help diagnose performance.', 'Good goals are specific, measurable, achievable, relevant, and time-bound.'] }
    ]
  },
  {
    slug: 'dm-content-marketing',
    title: 'Content Marketing Intro',
    description: 'Learn how content marketing attracts, educates, builds trust, and supports the customer journey.',
    level: 'beginner',
    section: 'Content',
    order: 10,
    minutes: 11,
    content: [
      { type: 'p', text: 'Content marketing means creating useful or interesting material that helps an audience before asking for a sale. It can include articles, videos, guides, podcasts, newsletters, case studies, templates, webinars, and social posts.' },
      { type: 'p', text: 'Good content earns attention by solving real problems. It helps people understand their situation, compare options, and trust your brand.' },
      { type: 'h2', text: 'What content can do' },
      {
        type: 'table',
        headers: ['Goal', 'Content example', 'Business example'],
        rows: [
          ['Educate', 'Beginner guide', 'A SaaS company explains how project dashboards work'],
          ['Build trust', 'Case study', 'A marketing agency shows how a client grew leads'],
          ['Generate leads', 'Checklist download', 'A realtor offers a first-time buyer checklist'],
          ['Support sales', 'Comparison page', 'An ecommerce brand compares product sizes'],
          ['Retain customers', 'Usage tips email', 'A fitness app sends weekly workout suggestions']
        ]
      },
      { type: 'h2', text: 'Start with content pillars' },
      { type: 'p', text: 'Content pillars are broad topics your brand can talk about repeatedly. They keep ideas organized and make your marketing feel consistent.' },
      {
        type: 'code',
        title: 'Content pillars for a local coffee shop',
        language: 'text',
        code: `Pillar 1: Brewing tips at home
Pillar 2: Behind the scenes with baristas
Pillar 3: Local community events
Pillar 4: New drinks and seasonal offers
Pillar 5: Customer stories and reviews`
      },
      { type: 'h2', text: 'Match content to journey stage' },
      { type: 'ul', items: ['Awareness: answer common beginner questions.', 'Consideration: compare methods, products, or approaches.', 'Decision: show proof, pricing, demos, and customer results.', 'Retention: teach people how to get more value after they buy.'] },
      { type: 'h2', text: 'Content quality checklist' },
      { type: 'ul', items: ['Useful to a specific audience.', 'Clear headline and promise.', 'One main idea per piece.', 'Easy to skim with headings or bullets.', 'Includes a natural next step.', 'Accurate, current, and consistent with brand voice.'] },
      { type: 'tip', text: 'One strong idea can become many formats: blog post, email, short video, carousel, checklist, and sales page FAQ.' },
      { type: 'try', text: 'Create three content pillars for an online course launch. For each pillar, write one beginner article idea and one short video idea.' },
      { type: 'keypoints', items: ['Content marketing helps before it sells.', 'Useful content builds attention, trust, leads, and retention.', 'Content pillars keep topics organized.', 'Match content to the customer journey and include a clear next step.'] }
    ]
  },
  {
    slug: 'dm-content-types',
    title: 'Content Types & Formats',
    description: 'Explore common content formats and learn how to choose the right format for the message, channel, and audience.',
    level: 'beginner',
    section: 'Content',
    order: 11,
    minutes: 10,
    content: [
      { type: 'p', text: 'A content type is the kind of material you create, such as a tutorial, case study, checklist, review, webinar, or product demo. A format is how it is packaged, such as blog article, video, carousel, email, PDF, or landing page.' },
      { type: 'p', text: 'The best format depends on what the audience needs to understand and where they are most likely to consume it.' },
      { type: 'h2', text: 'Common content types' },
      {
        type: 'table',
        headers: ['Content type', 'Best use', 'Example'],
        rows: [
          ['How-to guide', 'Teach a step-by-step task', 'How to plan a 7-day meal prep menu'],
          ['Checklist', 'Help people complete a process', 'Landing page launch checklist'],
          ['Case study', 'Prove results with a story', 'How a clinic increased bookings by 32%'],
          ['Comparison', 'Help people choose', 'Mailchimp vs ConvertKit for creators'],
          ['Product demo', 'Show how something works', '3-minute walkthrough of a CRM dashboard'],
          ['FAQ', 'Remove objections', 'Shipping, returns, sizing, and setup questions']
        ]
      },
      { type: 'h2', text: 'Format selection guide' },
      {
        type: 'table',
        headers: ['If the idea is...', 'Try this format', 'Why'],
        rows: [
          ['Detailed and searchable', 'Blog article or guide', 'Search engines and readers can revisit it'],
          ['Visual or emotional', 'Short video or image carousel', 'People can see the result quickly'],
          ['Data-heavy', 'Infographic or table', 'Structure makes comparison easier'],
          ['Trust-building', 'Case study or testimonial video', 'Proof feels more concrete'],
          ['Action-oriented', 'Checklist or template', 'The audience can use it immediately']
        ]
      },
      { type: 'h2', text: 'Repurposing example' },
      {
        type: 'code',
        title: 'Turn one topic into many formats',
        language: 'text',
        code: `Topic: How to prepare for a first sales call
Blog: 9 questions to ask before a sales call
PDF: Sales call prep checklist
Short video: 3 mistakes beginners make before a sales call
LinkedIn post: A story about a call that improved after better prep
Email: Checklist plus invitation to book a coaching session`
      },
      { type: 'h2', text: 'Beginner production checklist' },
      { type: 'ul', items: ['Define the audience and one main takeaway.', 'Choose the format that makes the idea easiest to understand.', 'Add examples, screenshots, numbers, or steps where helpful.', 'Include a next action: read, subscribe, book, download, compare, or buy.', 'Track performance by format and topic, not just by platform.'] },
      { type: 'note', text: 'A simple helpful checklist can outperform a polished video if it solves the right problem at the right time.' },
      { type: 'try', text: 'Choose one topic for a SaaS product, local service, or ecommerce store. Repurpose it into a blog title, short video hook, email subject, and checklist idea.' },
      { type: 'keypoints', items: ['Content types describe the purpose; formats describe the package.', 'Choose formats based on audience behavior and idea complexity.', 'Repurposing helps one strong idea work across multiple channels.', 'The best beginner content is useful, specific, and easy to act on.'] }
    ]
  },
  {
    slug: 'dm-copywriting',
    title: 'Copywriting Basics',
    description: 'Learn beginner copywriting principles for headlines, calls to action, benefits, proof, and clear marketing messages.',
    level: 'beginner',
    section: 'Content',
    order: 12,
    minutes: 12,
    content: [
      { type: 'p', text: 'Copywriting is writing that encourages a reader to take action. The action might be clicking, subscribing, booking, trying a demo, replying, adding to cart, or buying.' },
      { type: 'p', text: 'Good copy is clear before it is clever. It connects the audience problem to a believable benefit and tells the reader exactly what to do next.' },
      { type: 'h2', text: 'Features versus benefits' },
      {
        type: 'table',
        headers: ['Feature', 'Benefit', 'Stronger copy angle'],
        rows: [
          ['30-minute workouts', 'Fits a busy schedule', 'Get stronger before work with workouts you can finish in 30 minutes'],
          ['Automated invoices', 'Saves admin time', 'Send invoices in two clicks and spend less time chasing paperwork'],
          ['Waterproof fabric', 'Keeps items dry', 'Protect your laptop and notes during rainy commutes'],
          ['Live feedback', 'Improves faster', 'Ask questions and fix mistakes while you practice']
        ]
      },
      { type: 'h2', text: 'AIDA framework' },
      { type: 'p', text: 'AIDA stands for Attention, Interest, Desire, and Action. It is a classic structure for ads, emails, landing pages, and social posts.' },
      {
        type: 'code',
        title: 'AIDA example for an online course',
        language: 'text',
        code: `Attention: Learn Excel without feeling lost.
Interest: Follow 20 short lessons built for complete beginners.
Desire: Create budgets, reports, and charts you can use at work.
Action: Join the free first lesson today.`
      },
      { type: 'h2', text: 'Headlines and CTAs' },
      { type: 'ul', items: ['A headline should promise a clear result or create useful curiosity.', 'A CTA, or call to action, should use action words such as Start, Book, Download, Compare, Try, or Get.', 'Buttons should be specific when possible: "Download the checklist" is clearer than "Submit."', 'Match the CTA to the journey stage. A cold visitor may prefer "See examples" before "Buy now."'] },
      { type: 'h2', text: 'Copywriting checklist' },
      { type: 'ul', items: ['Write for one audience.', 'Lead with the customer problem or desired outcome.', 'Use simple words and short sentences.', 'Show proof with numbers, reviews, examples, or demonstrations.', 'Remove unnecessary claims, jargon, and vague hype.', 'End with one clear next step.'] },
      { type: 'tip', text: 'Read your copy out loud. If it sounds like something a real customer would never say or understand, simplify it.' },
      { type: 'try', text: 'Rewrite this CTA: "Submit your information." Make it specific for a free website audit, a course waitlist, and an ecommerce discount.' },
      { type: 'keypoints', items: ['Copywriting encourages a reader to take action.', 'Benefits explain why features matter.', 'AIDA is a useful beginner structure for persuasive messages.', 'Clear headlines, proof, and specific calls to action improve marketing performance.'] }
    ]
  },
  {
    slug: 'dm-seo-intro',
    title: 'SEO Intro',
    description: 'Learn what search engine optimization is and how it helps people find your content, pages, products, and services.',
    level: 'beginner',
    section: 'SEO',
    order: 13,
    minutes: 11,
    content: [
      { type: 'p', text: 'SEO stands for search engine optimization. It is the practice of improving pages so search engines can understand them and people can find useful answers, products, or services through search.' },
      { type: 'p', text: 'SEO is valuable because search traffic often includes people with active intent. Someone searching "best accounting software for freelancers" is already trying to solve a problem.' },
      { type: 'h2', text: 'How search works at a high level' },
      {
        type: 'table',
        headers: ['Step', 'Meaning', 'Beginner focus'],
        rows: [
          ['Crawling', 'Search engines discover pages through links and sitemaps', 'Make important pages accessible'],
          ['Indexing', 'Search engines store and understand page content', 'Use clear titles, text, and structure'],
          ['Ranking', 'Search engines choose which pages to show for a query', 'Match search intent and provide useful content'],
          ['Result click', 'Searchers decide which result to open', 'Write clear titles and descriptions']
        ]
      },
      { type: 'h2', text: 'Three parts of SEO' },
      { type: 'ul', items: ['On-page SEO: content, headings, titles, internal links, and search intent.', 'Technical SEO: speed, mobile usability, crawlability, structured data, and site health.', 'Off-page SEO: links, mentions, reviews, authority, and reputation signals.'] },
      { type: 'h2', text: 'Search intent matters' },
      { type: 'p', text: 'Search intent is what the searcher wants to accomplish. A page about "running shoes" could be informational, commercial, or transactional depending on the query.' },
      {
        type: 'table',
        headers: ['Query', 'Likely intent', 'Good page type'],
        rows: [
          ['how to choose running shoes', 'Learn', 'Beginner guide'],
          ['best running shoes for flat feet', 'Compare', 'Product comparison'],
          ['buy trail running shoes size 10', 'Purchase', 'Category or product page'],
          ['Nike store near me', 'Navigate or visit', 'Local listing or store page']
        ]
      },
      { type: 'note', text: 'SEO is not about tricking search engines. Modern SEO is about making helpful, crawlable, trustworthy pages that match real searches.' },
      { type: 'try', text: 'Search a phrase related to your business idea. Look at the top results and identify whether the intent is learn, compare, buy, or find a local option.' },
      { type: 'keypoints', items: ['SEO helps people find pages through search engines.', 'Search engines crawl, index, rank, and display pages.', 'SEO includes on-page, technical, and off-page work.', 'Matching search intent is one of the most important beginner SEO skills.'] }
    ]
  },
  {
    slug: 'dm-keywords',
    title: 'Keyword Research',
    description: 'Learn how to find and organize search terms that reveal what your audience wants and how they describe it.',
    level: 'beginner',
    section: 'SEO',
    order: 14,
    minutes: 12,
    content: [
      { type: 'p', text: 'Keyword research is the process of finding the words and phrases people type into search engines. Keywords reveal demand, questions, pain points, comparisons, and buying intent.' },
      { type: 'p', text: 'A keyword is not just a word. It represents a topic, a need, and a likely page type. Beginner SEO improves when you group keywords by intent instead of writing one page for every tiny variation.' },
      { type: 'h2', text: 'Keyword research sources' },
      {
        type: 'table',
        headers: ['Source', 'What to look for', 'Example'],
        rows: [
          ['Google autocomplete', 'Common phrase completions', 'meal prep for beginners'],
          ['People Also Ask', 'Questions people commonly search', 'How long does meal prep last?'],
          ['Search Console', 'Queries already bringing impressions', 'budget meal prep ideas'],
          ['Competitor pages', 'Topics competitors rank for', 'high protein meal prep recipes'],
          ['Customer language', 'Exact words from reviews and calls', 'healthy meals that do not taste bland']
        ]
      },
      { type: 'h2', text: 'Keyword intent groups' },
      {
        type: 'code',
        title: 'Keyword list for a meal prep service',
        language: 'text',
        code: `Informational:
- how to start meal prepping
- meal prep ideas for busy professionals
- how long do prepared meals last

Commercial:
- best meal prep services in Austin
- healthy meal delivery reviews
- meal prep service vs cooking at home

Transactional:
- order weekly meal prep Austin
- keto meal delivery near me
- family meal prep subscription`
      },
      { type: 'h2', text: 'Evaluate keyword opportunities' },
      { type: 'ul', items: ['Relevance: Does the query match what you sell or teach?', 'Intent: Is the searcher learning, comparing, buying, or looking locally?', 'Difficulty: Are top results huge brands or reachable competitors?', 'Value: Would ranking for the query support leads, sales, or trust?', 'Content fit: Can you create a genuinely helpful page for this query?'] },
      { type: 'h2', text: 'Long-tail keywords' },
      { type: 'p', text: 'Long-tail keywords are longer, more specific searches. They usually have lower volume but clearer intent, such as "best beginner DSLR camera for travel under $500."' },
      { type: 'tip', text: 'Start with long-tail keywords when building a new site. They are often more specific, easier to satisfy, and closer to real customer language.' },
      { type: 'try', text: 'Create a keyword list for a local dog trainer or SaaS time-tracking app. Put at least three keywords into informational, commercial, and transactional groups.' },
      { type: 'keypoints', items: ['Keyword research reveals what people search and why.', 'Group keywords by intent, not just by similar words.', 'Use search results, customer language, analytics, and competitor pages as sources.', 'Long-tail keywords are useful for beginners because they are specific and practical.'] }
    ]
  },
  {
    slug: 'dm-on-page-seo',
    title: 'On-Page SEO',
    description: 'Learn how to optimize titles, headings, content, links, URLs, images, and page structure for search and users.',
    level: 'beginner',
    section: 'SEO',
    order: 15,
    minutes: 12,
    content: [
      { type: 'p', text: 'On-page SEO is the work you do on a page to help search engines and visitors understand it. It includes the page title, headings, content quality, URLs, images, internal links, and the visible structure of the page.' },
      { type: 'p', text: 'The goal is not to repeat keywords unnaturally. The goal is to make the page the best clear answer for a specific search intent.' },
      { type: 'h2', text: 'On-page SEO checklist' },
      {
        type: 'table',
        headers: ['Element', 'Beginner best practice', 'Example'],
        rows: [
          ['Title tag', 'Describe the page and include the main topic', 'Beginner Meal Prep Guide: Plan 5 Healthy Lunches'],
          ['H1 heading', 'Use one clear main heading', 'How to Meal Prep Lunch for the Week'],
          ['Headings', 'Break sections into logical questions or steps', 'Choose recipes, shop ingredients, store safely'],
          ['URL', 'Keep it readable and specific', '/meal-prep-beginner-guide'],
          ['Intro', 'Confirm the page solves the query quickly', 'This guide shows a simple 2-hour weekly process'],
          ['Internal links', 'Link to related useful pages', 'Meal prep containers, grocery checklist, recipe ideas']
        ]
      },
      { type: 'h2', text: 'Example page outline' },
      {
        type: 'code',
        title: 'SEO-friendly article structure',
        language: 'markdown',
        code: `# How to Choose a Beginner Road Bike

Intro: Explain who this guide is for and what they will learn.

## Decide where you will ride
## Choose the right frame size
## Understand gears and brakes
## Set a realistic first-bike budget
## Compare three beginner bike options
## Frequently asked questions
## Next step: download the bike fit checklist`
      },
      { type: 'h2', text: 'Images and accessibility' },
      { type: 'p', text: 'Images can help readers understand products, steps, and results. Use descriptive file names when practical and add alt text that explains the image for users who cannot see it.' },
      { type: 'h2', text: 'Common on-page mistakes' },
      { type: 'ul', items: ['Writing for a keyword but ignoring the searcher question.', 'Using vague titles like "Home" or "Services."', 'Creating very thin pages with little useful detail.', 'Forgetting internal links to related pages.', 'Using large images that slow down the page.', 'Writing meta descriptions that do not match the page.'] },
      { type: 'note', text: 'A well-structured page helps both search engines and humans. If readers can skim and understand the page, SEO often improves too.' },
      { type: 'try', text: 'Choose one target keyword and draft a title tag, H1, URL, three H2 headings, and one internal link idea for a page.' },
      { type: 'keypoints', items: ['On-page SEO improves individual pages for search and users.', 'Titles, headings, URLs, content, images, and internal links all matter.', 'Match search intent before polishing details.', 'Clear structure and helpful content are beginner SEO fundamentals.'] }
    ]
  },
  {
    slug: 'dm-technical-seo',
    title: 'Technical SEO Basics',
    description: 'Learn the beginner technical SEO concepts that help search engines crawl, index, and understand a website.',
    level: 'beginner',
    section: 'SEO',
    order: 16,
    minutes: 12,
    content: [
      { type: 'p', text: 'Technical SEO focuses on the website foundation that helps search engines discover, crawl, index, and display pages correctly. You do not need to be a developer to understand the basics, but you do need to know what to check.' },
      { type: 'p', text: 'A beautiful page cannot perform in search if it is blocked, broken, extremely slow, hard to use on mobile, or duplicated in confusing ways.' },
      { type: 'h2', text: 'Beginner technical SEO areas' },
      {
        type: 'table',
        headers: ['Area', 'What it means', 'Beginner check'],
        rows: [
          ['Crawlability', 'Search engines can access important pages', 'Important pages are linked and not blocked'],
          ['Indexability', 'Pages can be stored in search results', 'No accidental noindex tags on key pages'],
          ['Site speed', 'Pages load quickly enough for users', 'Compress large images and avoid heavy pages'],
          ['Mobile usability', 'Pages work well on phones', 'Text, buttons, and layout are usable on small screens'],
          ['HTTPS', 'Site uses secure connection', 'URL starts with https://'],
          ['Broken links', 'Links lead to working pages', 'Fix 404s that hurt user paths']
        ]
      },
      { type: 'h2', text: 'Helpful files and signals' },
      {
        type: 'table',
        headers: ['Item', 'Purpose', 'Beginner note'],
        rows: [
          ['XML sitemap', 'Lists important URLs for search engines', 'Submit it in search tools when available'],
          ['robots.txt', 'Gives crawl instructions', 'Be careful not to block important sections'],
          ['Canonical tag', 'Indicates preferred version of similar pages', 'Useful for duplicate or filtered pages'],
          ['Structured data', 'Adds machine-readable details', 'Can support rich results for products, FAQs, recipes, and events']
        ]
      },
      { type: 'h2', text: 'Simple technical audit checklist' },
      { type: 'ol', items: ['Open the site on a phone and complete an important action.', 'Check that important pages load and do not show errors.', 'Search for the brand name and a key page title to see if pages are indexed.', 'Review page speed suggestions for the homepage and a product or article page.', 'Make sure navigation links point to important pages.', 'Look for duplicate title tags or very similar pages.'] },
      {
        type: 'code',
        title: 'robots.txt example',
        language: 'text',
        code: `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`
      },
      { type: 'note', text: 'Never edit robots.txt, noindex tags, redirects, or canonical tags on a live site unless you understand the impact. These settings can remove pages from search.' },
      { type: 'try', text: 'Open a website you use often on your phone. Check whether the main menu, buttons, page speed, and checkout or signup path feel easy to use.' },
      { type: 'keypoints', items: ['Technical SEO helps search engines crawl, index, and display pages.', 'Speed, mobile usability, HTTPS, broken links, and indexability are beginner priorities.', 'Sitemaps, robots.txt, canonicals, and structured data support search discovery and clarity.', 'Small technical mistakes can block strong content from performing.'] }
    ]
  },
  {
    slug: 'dm-off-page-seo',
    title: 'Off-Page SEO & Authority',
    description: 'Learn how links, mentions, reviews, reputation, and partnerships can support search visibility and trust.',
    level: 'beginner',
    section: 'SEO',
    order: 17,
    minutes: 11,
    content: [
      { type: 'p', text: 'Off-page SEO includes signals outside your own website that influence trust and visibility. The most famous signal is backlinks, which are links from other websites to yours. Reviews, mentions, citations, partnerships, and brand reputation also matter.' },
      { type: 'p', text: 'Search engines use outside signals partly because anyone can claim to be great on their own site. When trustworthy others mention, link, review, or recommend you, that can support authority.' },
      { type: 'h2', text: 'Authority signals' },
      {
        type: 'table',
        headers: ['Signal', 'What it means', 'Beginner example'],
        rows: [
          ['Backlinks', 'Other websites link to your pages', 'A local newspaper links to a bakery event page'],
          ['Mentions', 'Brand is named even without a link', 'A podcast mentions a SaaS tool'],
          ['Reviews', 'Customers rate and describe their experience', 'Google reviews for a dentist'],
          ['Citations', 'Business name, address, and phone appear in directories', 'Local chamber of commerce listing'],
          ['Social sharing', 'People discuss or share content', 'A helpful checklist spreads on LinkedIn']
        ]
      },
      { type: 'h2', text: 'Good ways to earn links' },
      { type: 'ul', items: ['Create genuinely useful resources, tools, templates, data, or guides.', 'Partner with local organizations, podcasts, newsletters, or events.', 'Publish case studies or original examples worth referencing.', 'Offer expert quotes to journalists or industry blogs.', 'Make product, service, or location pages accurate enough to be cited.'] },
      { type: 'h2', text: 'Local authority example' },
      {
        type: 'code',
        title: 'Local fitness studio authority plan',
        language: 'text',
        code: `Goal: Improve local trust and search visibility
Actions:
- Sponsor a charity 5K and get listed on the event page
- Ask happy members for specific Google reviews
- Create a "Beginner Guide to Strength Training in Denver"
- Partner with a local nutritionist for a workshop
- Keep business details consistent across local directories`
      },
      { type: 'h2', text: 'What to avoid' },
      { type: 'ul', items: ['Buying spammy links from unknown networks.', 'Posting low-quality comments only for links.', 'Creating fake reviews.', 'Using misleading directories or irrelevant link exchanges.', 'Chasing link quantity while ignoring relevance and trust.'] },
      { type: 'note', text: 'Low-quality link schemes can harm a site. Authority should come from relevance, usefulness, relationships, and real reputation.' },
      { type: 'try', text: 'List five websites, organizations, creators, or local partners that could naturally mention or link to a business you choose. Write why each connection would be relevant.' },
      { type: 'keypoints', items: ['Off-page SEO includes backlinks, mentions, reviews, citations, and reputation.', 'Authority signals help search engines and users trust a brand.', 'Strong links are earned through useful assets, relationships, and relevance.', 'Avoid spammy shortcuts and fake reputation signals.'] }
    ]
  },
  {
    slug: 'dm-social-intro',
    title: 'Social Media Marketing Intro',
    description: 'Learn how social media supports awareness, trust, community, content distribution, and customer relationships.',
    level: 'beginner',
    section: 'Social',
    order: 18,
    minutes: 11,
    content: [
      { type: 'p', text: 'Social media marketing uses platforms such as Instagram, Facebook, TikTok, LinkedIn, YouTube, Pinterest, X, Reddit, and communities to reach and communicate with people.' },
      { type: 'p', text: 'Social is not only a place to publish promotions. It is a place to show personality, demonstrate expertise, listen to customers, build proof, and start conversations.' },
      { type: 'h2', text: 'What social media can do' },
      {
        type: 'table',
        headers: ['Role', 'Example', 'Metric'],
        rows: [
          ['Awareness', 'Short video showing a product transformation', 'Reach, views, follower growth'],
          ['Engagement', 'Question post asking about customer challenges', 'Comments, saves, replies'],
          ['Trust', 'Customer testimonial carousel', 'Saves, profile visits, assisted conversions'],
          ['Traffic', 'Link to a new guide or landing page', 'Clicks, sessions, signups'],
          ['Support', 'Reply to product questions in comments', 'Response time, resolved questions']
        ]
      },
      { type: 'h2', text: 'Choose platforms by fit' },
      {
        type: 'table',
        headers: ['Platform type', 'Good fit for', 'Example'],
        rows: [
          ['Visual lifestyle', 'Products, local businesses, creators', 'Instagram post for a new cafe drink'],
          ['Short video', 'Demonstrations, entertainment, education', 'TikTok showing a 30-second cleaning hack'],
          ['Professional', 'B2B, careers, expertise, SaaS', 'LinkedIn post about a customer onboarding lesson'],
          ['Search-based video', 'Tutorials and evergreen education', 'YouTube guide for beginner budgeting'],
          ['Community', 'Niche discussions and research', 'Reddit thread about home office setups']
        ]
      },
      { type: 'h2', text: 'Simple social content mix' },
      { type: 'ul', items: ['Teach: tips, tutorials, mistakes, myths, and checklists.', 'Show: behind the scenes, product use, process, before-and-after.', 'Prove: testimonials, case studies, reviews, numbers, user-generated content.', 'Connect: questions, polls, stories, founder notes, community highlights.', 'Convert: offers, launches, demos, limited-time reminders, booking prompts.'] },
      { type: 'tip', text: 'Beginners usually improve faster by publishing consistently on one or two platforms than by posting randomly everywhere.' },
      { type: 'try', text: 'Pick one platform for a local bakery, B2B SaaS tool, or handmade jewelry shop. Write five post ideas using teach, show, prove, connect, and convert.' },
      { type: 'keypoints', items: ['Social media supports awareness, engagement, trust, traffic, and support.', 'Platform choice should match audience behavior and content strengths.', 'A balanced content mix teaches, shows, proves, connects, and converts.', 'Consistency and conversation matter more than posting on every platform.'] }
    ]
  },
  {
    slug: 'dm-social-meta',
    title: 'Facebook & Instagram Marketing',
    description: 'Learn beginner strategies for using Facebook and Instagram to reach audiences, build trust, and support campaigns.',
    level: 'beginner',
    section: 'Social',
    order: 19,
    minutes: 12,
    content: [
      { type: 'p', text: 'Facebook and Instagram are part of Meta. They are useful for visual storytelling, local businesses, ecommerce, creators, communities, events, customer proof, and both organic and paid campaigns.' },
      { type: 'p', text: 'Instagram often emphasizes visual discovery and short-form content. Facebook can be strong for local communities, groups, events, older audiences, retargeting, and customer communication.' },
      { type: 'h2', text: 'Where content appears' },
      {
        type: 'table',
        headers: ['Placement', 'Best for', 'Example'],
        rows: [
          ['Feed posts', 'Polished updates and evergreen profile content', 'New product photo with customer benefit'],
          ['Stories', 'Casual timely updates and behind the scenes', 'Today-only lunch special'],
          ['Reels', 'Discovery, education, entertainment, reach', '15-second styling tip'],
          ['Lives', 'Real-time demos and Q&A', 'Course launch Q&A session'],
          ['Groups', 'Community and discussion', 'Local parent group event announcement'],
          ['Shops', 'Product discovery and ecommerce browsing', 'Tagged skincare product in a tutorial']
        ]
      },
      { type: 'h2', text: 'Organic content ideas' },
      {
        type: 'code',
        title: 'Instagram week for a boutique',
        language: 'text',
        code: `Monday Reel: 3 ways to style one jacket
Tuesday Story: Poll asking favorite color
Wednesday Feed: Customer photo with permission
Thursday Reel: Behind the scenes unpacking new arrivals
Friday Story: Weekend sale reminder with product link
Saturday Feed: Outfit guide for brunch
Sunday Story: Q&A about sizing and returns`
      },
      { type: 'h2', text: 'Meta ads basics' },
      { type: 'p', text: 'Meta ads can reach people by location, interests, behaviors, custom audiences, website visitors, email lists, and lookalike audiences. Beginners should start with a clear campaign goal and one offer, then test creative and audiences carefully.' },
      {
        type: 'table',
        headers: ['Campaign goal', 'Example', 'Useful metric'],
        rows: [
          ['Awareness', 'Introduce a new local cafe', 'Reach, frequency, video views'],
          ['Traffic', 'Send people to a gift guide', 'Link clicks, landing page views'],
          ['Leads', 'Promote a free consultation form', 'Cost per lead, lead quality'],
          ['Sales', 'Promote an ecommerce bundle', 'Purchases, revenue, return on ad spend']
        ]
      },
      { type: 'note', text: 'Meta content often performs best when it feels native to the platform: clear visuals, quick hook, human proof, and simple next step.' },
      { type: 'try', text: 'Draft one Reel idea, one Story idea, one feed post idea, and one simple Meta ad offer for a local fitness studio.' },
      { type: 'keypoints', items: ['Facebook and Instagram support visual content, community, local marketing, ecommerce, and ads.', 'Different placements have different strengths.', 'Organic content should mix education, proof, personality, and offers.', 'Meta ads need a clear goal, audience, creative, offer, and measurement plan.'] }
    ]
  },
  {
    slug: 'dm-social-short-video',
    title: 'TikTok, Reels & Short Video',
    description: 'Learn why short video works and how to create beginner-friendly videos that hook attention and provide value quickly.',
    level: 'beginner',
    section: 'Social',
    order: 20,
    minutes: 12,
    content: [
      { type: 'p', text: 'Short video platforms such as TikTok, Instagram Reels, YouTube Shorts, and Facebook Reels help brands reach people through fast, visual, mobile-first content. Videos are often discovered by interest, behavior, and engagement rather than only by followers.' },
      { type: 'p', text: 'Short video works well for demonstrations, before-and-after results, quick education, opinions, storytelling, trends, and humanizing a brand.' },
      { type: 'h2', text: 'Short video structure' },
      {
        type: 'table',
        headers: ['Part', 'Job', 'Example'],
        rows: [
          ['Hook', 'Stop the scroll in the first seconds', 'Stop wasting money on plants that hate low light'],
          ['Value', 'Teach, show, prove, or entertain', 'Show three low-light plant options'],
          ['Proof', 'Make the message believable', 'Show the plant thriving in a dark apartment corner'],
          ['CTA', 'Tell viewers the next step', 'Save this before your next plant shop visit']
        ]
      },
      { type: 'h2', text: 'Beginner video ideas' },
      { type: 'ul', items: ['3 mistakes beginners make with...', 'Before and after using...', 'Pack an order with me.', 'A day in the life of...', 'What I would buy with a $50 budget.', 'Customer question answered in 30 seconds.', 'Myth versus truth in your industry.', 'Step 1, step 2, step 3 tutorial.'] },
      { type: 'h2', text: 'Example scripts' },
      {
        type: 'code',
        title: 'Short video hooks and outlines',
        language: 'text',
        code: `Local bakery:
Hook: "This is why our croissants take three days."
Value: Show dough, butter block, folding, resting, baking.
CTA: "Comment CROISSANT and we will send tomorrow's pickup times."

SaaS tool:
Hook: "Your team does not need another spreadsheet for this."
Value: Show one dashboard replacing three manual updates.
CTA: "Try the free template linked in our bio."

Course launch:
Hook: "If you are learning design, build this first."
Value: Show a simple portfolio project structure.
CTA: "Save this and join the free workshop."`
      },
      { type: 'h2', text: 'Production tips' },
      { type: 'ul', items: ['Use clear lighting and readable text overlays.', 'Make the first frame visually specific.', 'Keep one main idea per video.', 'Use captions because many people watch without sound.', 'Show the result early when possible.', 'Batch record several videos from one setup.'] },
      { type: 'tip', text: 'Do not wait for perfect gear. A phone, clear audio, good light, and a useful idea are enough for beginner short video.' },
      { type: 'try', text: 'Write three hooks for an ecommerce product, local service, or online course. For one hook, outline the value, proof, and CTA.' },
      { type: 'keypoints', items: ['Short video is mobile-first, fast, visual, and discovery-friendly.', 'Strong videos usually include a hook, value, proof, and CTA.', 'Demonstrations, tutorials, myths, behind-the-scenes, and customer questions work well.', 'Clarity, consistency, and useful ideas matter more than expensive production.'] }
    ]
  },
  {
    slug: 'dm-social-pro',
    title: 'LinkedIn & Professional Platforms',
    description: 'Learn how LinkedIn and professional platforms support B2B marketing, expertise, networking, hiring, and trust.',
    level: 'beginner',
    section: 'Social',
    order: 21,
    minutes: 11,
    content: [
      { type: 'p', text: 'LinkedIn is a professional social platform used for B2B marketing, recruiting, thought leadership, career growth, partnerships, and sales conversations. Other professional platforms include niche communities, Slack groups, industry forums, GitHub, Behance, Dribbble, Product Hunt, and professional newsletters.' },
      { type: 'p', text: 'Professional marketing usually works best when it teaches, shares credible experience, and starts useful conversations instead of pushing hard sales messages immediately.' },
      { type: 'h2', text: 'What works on LinkedIn' },
      {
        type: 'table',
        headers: ['Content type', 'Purpose', 'Example'],
        rows: [
          ['Practical lesson', 'Show expertise', 'What we learned onboarding 50 SaaS customers'],
          ['Case study', 'Build proof', 'How a client reduced support tickets by 28%'],
          ['Point of view', 'Clarify positioning', 'Why small teams should document sales handoffs earlier'],
          ['Personal founder note', 'Humanize the brand', 'The mistake we made during our first launch'],
          ['Carousel or document', 'Make ideas easy to save', 'Checklist for running a better demo call'],
          ['Hiring or culture post', 'Support employer brand', 'How our remote team handles async planning']
        ]
      },
      { type: 'h2', text: 'Profile basics' },
      { type: 'ul', items: ['Use a clear headline that says who you help and how.', 'Add a banner or description that supports your positioning.', 'Pin featured content such as a case study, lead magnet, portfolio, or demo.', 'Keep company pages updated with accurate links and proof.', 'Make it easy to understand the next step: follow, connect, book, subscribe, or view work.'] },
      { type: 'h2', text: 'Example LinkedIn post outline' },
      {
        type: 'code',
        title: 'B2B post outline',
        language: 'text',
        code: `Opening: "Most demo calls fail before the product is shown."
Point 1: The prospect's real problem was never confirmed.
Point 2: The demo follows features instead of goals.
Point 3: Next steps are vague.
Example: Share a short before/after agenda.
CTA: "Want the agenda template? Comment DEMO."`
      },
      { type: 'h2', text: 'Professional community etiquette' },
      { type: 'ul', items: ['Read community rules before posting.', 'Answer questions before promoting yourself.', 'Share specific examples instead of vague advice.', 'Respect private conversations and customer information.', 'Follow up politely and avoid automated spam.'] },
      { type: 'note', text: 'In professional channels, reputation compounds. Helpful comments, clear expertise, and reliable follow-through often matter more than viral reach.' },
      { type: 'try', text: 'Write a LinkedIn headline and one post idea for a freelance designer, B2B SaaS founder, or course creator.' },
      { type: 'keypoints', items: ['LinkedIn and professional platforms are strong for B2B, careers, expertise, and partnerships.', 'Helpful, credible content usually performs better than direct pitching.', 'Profiles should clearly explain who you help and the next step.', 'Professional communities reward relevance, specificity, and respect.'] }
    ]
  },
  {
    slug: 'dm-email-intro',
    title: 'Email Marketing Intro',
    description: 'Learn why email remains a powerful owned channel for nurturing, selling, onboarding, and retaining customers.',
    level: 'beginner',
    section: 'Email & Pages',
    order: 22,
    minutes: 11,
    content: [
      { type: 'p', text: 'Email marketing means sending useful, timely messages to people who have given permission to hear from you. It can support newsletters, welcome sequences, promotions, onboarding, cart recovery, event reminders, launches, and customer education.' },
      { type: 'p', text: 'Email is powerful because it is an owned relationship channel. Algorithms can change, ad costs can rise, and social reach can drop, but a permission-based email list gives you a direct way to communicate.' },
      { type: 'h2', text: 'What email is good for' },
      {
        type: 'table',
        headers: ['Use case', 'Example', 'Goal'],
        rows: [
          ['Welcome', 'Introduce brand story and best resources', 'Build trust after signup'],
          ['Newsletter', 'Weekly tips and curated links', 'Stay top of mind'],
          ['Launch', 'Announce course enrollment', 'Drive sales during a window'],
          ['Abandoned cart', 'Remind shopper about items left behind', 'Recover potential revenue'],
          ['Onboarding', 'Teach new users how to succeed', 'Increase activation and retention'],
          ['Reactivation', 'Win back inactive subscribers or customers', 'Restart engagement']
        ]
      },
      { type: 'h2', text: 'Email terms beginners should know' },
      {
        type: 'table',
        headers: ['Term', 'Meaning'],
        rows: [
          ['Subscriber', 'A person who gave permission to receive emails'],
          ['List', 'A collection of subscribers'],
          ['Segment', 'A smaller group based on behavior, interest, or profile'],
          ['Campaign', 'A one-time or planned email send'],
          ['Sequence', 'Automated emails sent over time'],
          ['Open rate', 'Percentage of delivered emails opened, useful but imperfect'],
          ['Click rate', 'Percentage of recipients who clicked a link'],
          ['Unsubscribe rate', 'Percentage who opted out']
        ]
      },
      { type: 'h2', text: 'Simple welcome email outline' },
      {
        type: 'code',
        title: 'Welcome email',
        language: 'text',
        code: `Subject: Welcome to beginner meal prep

Hi Maya,

Thanks for downloading the grocery checklist.

Here is what to do next:
1. Pick three recipes for the week.
2. Shop using the checklist.
3. Prep ingredients on Sunday in under two hours.

Helpful link: 5 easy lunches for your first week

Reply and tell us your biggest meal prep challenge.`
      },
      { type: 'tip', text: 'Every email should have a job. Before writing, decide whether the email should teach, remind, invite, sell, onboard, or ask for feedback.' },
      { type: 'try', text: 'Write the goal, subject line, and main CTA for a welcome email after someone downloads a free guide from a course creator.' },
      { type: 'keypoints', items: ['Email is a permission-based owned marketing channel.', 'It supports welcome, newsletter, launch, cart, onboarding, and retention messages.', 'Lists can be segmented by behavior, interest, or customer stage.', 'Good emails are useful, clear, and focused on one main job.'] }
    ]
  },
  {
    slug: 'dm-email-lists',
    title: 'Building & Managing Email Lists',
    description: 'Learn how to grow an email list ethically, use lead magnets, collect consent, segment subscribers, and maintain list health.',
    level: 'beginner',
    section: 'Email & Pages',
    order: 23,
    minutes: 12,
    content: [
      { type: 'p', text: 'An email list is a group of people who have agreed to receive messages from you. Building a list is not about collecting as many addresses as possible. It is about earning permission from people who want the value you provide.' },
      { type: 'p', text: 'Healthy lists perform better because subscribers recognize you, expect your emails, and find the content relevant.' },
      { type: 'h2', text: 'Ethical list growth methods' },
      {
        type: 'table',
        headers: ['Method', 'Example', 'Why it works'],
        rows: [
          ['Lead magnet', 'Free budget template', 'Offers immediate value for signup'],
          ['Newsletter promise', 'Weekly local events list', 'Sets clear expectations'],
          ['Checkout opt-in', 'Product care tips after purchase', 'Relevant to customers'],
          ['Webinar registration', 'Free class on landing page mistakes', 'Connects learning to follow-up'],
          ['In-store signup', 'QR code for loyalty updates', 'Connects offline attention to email']
        ]
      },
      { type: 'h2', text: 'Lead magnet ideas' },
      { type: 'ul', items: ['Checklist: 10 steps before launching your website.', 'Template: Social media content calendar.', 'Calculator: Estimate monthly ad budget.', 'Mini-course: 5 daily emails for beginners.', 'Coupon: 10% off first ecommerce order.', 'Quiz: Find your skincare routine.'] },
      { type: 'h2', text: 'Consent and expectations' },
      { type: 'p', text: 'People should understand what they are signing up for. Forms should clearly say what they will receive, how often they might hear from you, and how they can unsubscribe.' },
      {
        type: 'code',
        title: 'Signup form copy',
        language: 'text',
        code: `Headline: Get the free landing page checklist
Text: Join our email list and receive the checklist plus weekly conversion tips.
Field: Email address
Button: Send me the checklist
Small print: Unsubscribe anytime. No spam.`
      },
      { type: 'h2', text: 'List management basics' },
      { type: 'ul', items: ['Segment subscribers by interest, purchase status, lead magnet, or engagement.', 'Remove or re-engage inactive subscribers over time.', 'Use double opt-in when it fits your compliance and quality needs.', 'Avoid buying email lists.', 'Keep sender name and email recognizable.', 'Honor unsubscribes quickly.'] },
      { type: 'note', text: 'Buying email lists is risky and often ineffective. It can damage deliverability, violate platform rules, and annoy people who never asked to hear from you.' },
      { type: 'try', text: 'Create a lead magnet idea for a local business, course launch, ecommerce store, and SaaS product. Write the signup headline and button text for one of them.' },
      { type: 'keypoints', items: ['A healthy email list is built with permission and clear value.', 'Lead magnets give people a reason to subscribe.', 'Signup forms should set expectations and make consent clear.', 'Segmentation and list hygiene improve relevance and deliverability.'] }
    ]
  },
  {
    slug: 'dm-email-campaigns',
    title: 'Campaigns, Newsletters & Sequences',
    description: 'Learn the difference between campaigns, newsletters, and automated sequences, with practical outlines for each.',
    level: 'beginner',
    section: 'Email & Pages',
    order: 24,
    minutes: 13,
    content: [
      { type: 'p', text: 'Email campaigns, newsletters, and sequences all use email, but they work differently. A campaign is usually tied to a specific goal or time period. A newsletter is a recurring relationship email. A sequence is an automated series triggered by an action or date.' },
      { type: 'p', text: 'Understanding the difference helps you plan messages without overwhelming subscribers or sending random emails.' },
      { type: 'h2', text: 'Campaign versus newsletter versus sequence' },
      {
        type: 'table',
        headers: ['Email type', 'How it works', 'Example', 'Main metric'],
        rows: [
          ['Campaign', 'Planned send or series around a goal', 'Black Friday sale', 'Revenue, orders, clicks'],
          ['Newsletter', 'Regular email sent to a list or segment', 'Weekly marketing tips', 'Clicks, replies, engagement'],
          ['Sequence', 'Automated emails triggered by behavior', 'Welcome series after signup', 'Completion, clicks, activation']
        ]
      },
      { type: 'h2', text: 'Newsletter structure' },
      {
        type: 'code',
        title: 'Simple newsletter outline',
        language: 'text',
        code: `Subject: 3 landing page fixes you can make today

Opening: One short personal or timely note
Main value: Tip 1, Tip 2, Tip 3
Example: Before/after headline rewrite
CTA: Read the full landing page checklist
Footer: Reply with your biggest page question`
      },
      { type: 'h2', text: 'Welcome sequence example' },
      {
        type: 'table',
        headers: ['Email', 'Timing', 'Purpose', 'CTA'],
        rows: [
          ['1', 'Immediately', 'Deliver promised resource and introduce brand', 'Download the checklist'],
          ['2', 'Day 1', 'Teach a quick win', 'Try the first step'],
          ['3', 'Day 3', 'Share proof or story', 'Read a case study'],
          ['4', 'Day 5', 'Address common objection', 'Compare options'],
          ['5', 'Day 7', 'Invite next action', 'Book a call or start trial']
        ]
      },
      { type: 'h2', text: 'Course launch campaign example' },
      {
        type: 'code',
        title: '7-day launch email plan',
        language: 'text',
        code: `Day 1: Enrollment is open + who the course is for
Day 2: Student story and transformation
Day 3: Behind the curriculum + project preview
Day 4: Live Q&A invitation
Day 5: Objection email: "What if I am too busy?"
Day 6: Bonus reminder and FAQ
Day 7: Final day reminder with clear deadline`
      },
      { type: 'h2', text: 'Email performance checks' },
      { type: 'ul', items: ['Delivery: Did the email reach inboxes?', 'Open: Did the sender and subject create interest?', 'Click: Did the content and CTA motivate action?', 'Conversion: Did the landing page or offer complete the job?', 'Unsubscribe and spam complaints: Did expectations or frequency miss the mark?', 'Replies: What qualitative feedback did subscribers provide?'] },
      { type: 'note', text: 'Open rates are affected by privacy features and tracking limits. Use them as directional signals, but judge important emails by clicks, replies, conversions, and revenue when possible.' },
      { type: 'try', text: 'Plan a three-email sequence for someone who signs up for a free SaaS trial. Include timing, purpose, subject idea, and CTA for each email.' },
      { type: 'keypoints', items: ['Campaigns support specific goals, newsletters build recurring relationships, and sequences automate follow-up.', 'Email planning should match timing, audience stage, and one main CTA.', 'Welcome sequences help turn new subscribers into engaged leads or customers.', 'Measure clicks, conversions, unsubscribes, replies, and revenue in context.'] }
    ]
  },
  {
    slug: 'dm-landing-pages',
    title: 'Landing Pages That Convert',
    description: 'Learn the essential structure of landing pages that turn visitors into leads, signups, bookings, trials, or customers.',
    level: 'beginner',
    section: 'Email & Pages',
    order: 25,
    minutes: 13,
    content: [
      { type: 'p', text: 'A landing page is a focused page built for one campaign goal. The goal might be downloading a checklist, booking a consultation, joining a waitlist, starting a trial, registering for a webinar, or buying a product.' },
      { type: 'p', text: 'Unlike a homepage, a landing page removes distractions and guides visitors toward one main action.' },
      { type: 'h2', text: 'Landing page structure' },
      {
        type: 'table',
        headers: ['Section', 'Job', 'Example'],
        rows: [
          ['Hero', 'Explain the offer quickly', 'Free guide: Plan your first 30 days of content'],
          ['Benefits', 'Show why it matters', 'Save planning time, avoid blank-page stress, post consistently'],
          ['Proof', 'Build trust', 'Used by 4,000 creators or includes testimonials'],
          ['Details', 'Clarify what is included', 'Calendar template, 25 prompts, weekly workflow'],
          ['Objections', 'Answer doubts', 'No design experience needed, works for any niche'],
          ['CTA', 'Ask for one action', 'Download the free planner']
        ]
      },
      { type: 'h2', text: 'Hero section formula' },
      {
        type: 'code',
        title: 'Landing page hero copy',
        language: 'text',
        code: `Headline: Launch your first email course in 7 days
Subheadline: Get the beginner checklist, email outline, and launch calendar used by solo creators.
Bullets:
- Choose a course promise people understand
- Write five useful lesson emails
- Create a simple signup page
CTA button: Get the free launch kit`
      },
      { type: 'h2', text: 'Conversion checklist' },
      { type: 'ul', items: ['One clear audience and one clear offer.', 'Headline matches the ad, email, or post that sent the visitor.', 'Benefits are visible before too many details.', 'Form asks only for necessary information.', 'CTA buttons are specific and repeated on longer pages.', 'Proof is close to the claim it supports.', 'Page loads fast and works on mobile.', 'Thank-you page or confirmation explains the next step.'] },
      { type: 'h2', text: 'Common landing page mistakes' },
      {
        type: 'table',
        headers: ['Mistake', 'Why it hurts', 'Fix'],
        rows: [
          ['Too many CTAs', 'Visitors do not know what to do', 'Choose one primary action'],
          ['Vague headline', 'Visitors cannot tell if the page is for them', 'State audience and result'],
          ['Weak proof', 'Claims feel risky', 'Add testimonials, examples, numbers, or guarantees'],
          ['Long form', 'Creates friction', 'Ask only what you need now'],
          ['Slow mobile page', 'People leave before reading', 'Compress images and simplify layout']
        ]
      },
      { type: 'h2', text: 'Testing ideas' },
      { type: 'ul', items: ['Test headline clarity before color changes.', 'Test offer strength before tiny design tweaks.', 'Test shorter forms when completion rate is low.', 'Test proof placement when visitors click but do not convert.', 'Test page-message match when ad clicks are high but signups are low.'] },
      { type: 'tip', text: 'A landing page is part of a full path. The ad, email, or post creates the promise; the landing page must continue that promise without confusing the visitor.' },
      { type: 'try', text: 'Draft a landing page outline for a webinar signup. Include hero headline, three benefits, one proof element, form fields, CTA text, and thank-you page message.' },
      { type: 'keypoints', items: ['Landing pages focus visitors on one campaign goal.', 'Strong pages explain the offer, show benefits, prove trust, answer objections, and repeat a clear CTA.', 'Message match between traffic source and page is critical.', 'Conversion improves when friction is reduced and the next step is obvious.'] }
    ]
  }
];
