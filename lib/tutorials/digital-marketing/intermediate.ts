import type { TutorialLesson } from '../types';

export const intermediateLessons: TutorialLesson[] = [
  {
    slug: 'dm-google-ads-intro',
    title: 'Google Ads Intro',
    description:
      'Understand how Google Ads works, where campaigns appear, and how to build a practical account structure before spending budget.',
    level: 'intermediate',
    section: 'Paid Media',
    order: 26,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Google Ads is a paid media platform for reaching people across Search, Shopping, YouTube, Display, Maps, Gmail, Discover, and partner inventory. The platform is powerful because it connects your offer with high-intent searches and measurable conversions.',
      },
      {
        type: 'p',
        text: 'Intermediate marketers should treat Google Ads as a business system, not a button that buys traffic. You need a clear offer, conversion tracking, keyword intent, landing pages, budgets, and a testing rhythm before optimization can mean anything.',
      },
      { type: 'h2', text: 'The paid search operating model' },
      {
        type: 'ol',
        items: [
          'Choose a business goal: leads, purchases, booked calls, app installs, or store visits.',
          'Define the conversion event that proves progress toward that goal.',
          'Create campaigns around major budget and targeting differences.',
          'Create ad groups around tightly related search intent.',
          'Write ads that match the searcher problem and landing page promise.',
          'Review search terms, conversions, cost, and quality signals every week.',
        ],
      },
      { type: 'h2', text: 'Common campaign types' },
      {
        type: 'table',
        headers: ['Campaign type', 'Best for', 'Watch closely'],
        rows: [
          ['Search', 'Capturing active demand from typed queries', 'Keyword intent, match types, search terms, and cost per conversion'],
          ['Performance Max', 'Broad automation across Google inventory', 'Asset quality, audience signals, final URL expansion, and conversion quality'],
          ['Display', 'Awareness, retargeting, and visual reach', 'Placement quality, frequency, and view-through assumptions'],
          ['YouTube', 'Video reach, education, remarketing, and demand creation', 'Creative hook, audience fit, and engaged-view conversions'],
          ['Shopping', 'Ecommerce product demand', 'Feed quality, margins, product groups, and search terms'],
        ],
      },
      { type: 'h2', text: 'Starter account structure' },
      {
        type: 'code',
        language: 'text',
        title: 'Example Google Ads structure',
        code: `Account
  Campaign: Search - Brand - US
    Ad group: Brand terms
    Ad group: Brand + product terms
  Campaign: Search - Nonbrand - High Intent - US
    Ad group: project management software
    Ad group: task management tool
    Ad group: team workflow app
  Campaign: Remarketing - Display - 30 Day Visitors
    Ad group: pricing page visitors
    Ad group: trial starters not converted
  Campaign: YouTube - Product Demo - US
    Ad group: in-market productivity software`,
      },
      {
        type: 'note',
        text: 'Separate campaigns when you need separate budgets, locations, languages, bidding strategies, or reporting. Do not create campaigns only because you have a new keyword idea.',
      },
      {
        type: 'tip',
        text: 'Before launch, confirm conversion tracking, billing, location targeting, final URLs, policy status, and at least one negative keyword list for obvious irrelevant traffic.',
      },
      {
        type: 'try',
        text: 'Draft a Google Ads account structure for one product. Include one brand campaign, one high-intent nonbrand search campaign, and one remarketing campaign with clear ad groups.',
      },
      {
        type: 'keypoints',
        items: [
          'Google Ads works best when campaign structure follows business goals and search intent.',
          'Search campaigns capture demand; Display and YouTube often support awareness and remarketing.',
          'Conversion tracking and landing pages must be ready before meaningful optimization begins.',
          'Campaigns should be separated for budget, targeting, bidding, and reporting reasons.',
        ],
      },
    ],
  },
  {
    slug: 'dm-search-ads',
    title: 'Search Ads That Convert',
    description:
      'Build search campaigns with strong keyword intent, focused ad groups, useful assets, and landing page alignment.',
    level: 'intermediate',
    section: 'Paid Media',
    order: 27,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Search ads convert when they match the language, urgency, and problem behind a search query. The keyword is only the starting point. The query, ad, offer, and landing page must all feel like one continuous answer.',
      },
      {
        type: 'p',
        text: 'A strong search campaign starts with intent tiers. Not every keyword deserves the same bid, budget, or landing page because not every searcher is equally ready to act.',
      },
      { type: 'h2', text: 'Intent tiers for search keywords' },
      {
        type: 'table',
        headers: ['Intent tier', 'Example query', 'Likely goal'],
        rows: [
          ['Brand', 'acme crm pricing', 'Protect demand and route users to the right page'],
          ['Problem aware', 'how to reduce churn', 'Educate and capture early leads'],
          ['Solution aware', 'customer retention software', 'Generate demos or trials'],
          ['Comparison', 'acme vs hubspot crm', 'Win evaluation-stage buyers'],
          ['Transactional', 'buy email marketing software', 'Drive purchase or sales contact'],
        ],
      },
      { type: 'h2', text: 'Search ad group blueprint' },
      {
        type: 'code',
        language: 'text',
        title: 'High-intent ad group example',
        code: `Campaign: Search - Nonbrand - CRM - US
Ad group: sales crm software

Keywords
  "sales crm software"
  [sales crm software]
  "crm software for sales teams"
  [best sales crm software]

Negative keywords
  free template
  job
  definition
  course

Landing page
  /sales-crm/

Primary conversion
  Book demo`,
      },
      { type: 'h2', text: 'Responsive search ad structure' },
      {
        type: 'ul',
        items: [
          'Include 2 or 3 headlines that mirror the highest-intent query.',
          'Include benefit headlines such as "Cut Manual Follow-Up" or "Track Every Deal".',
          'Include proof headlines such as ratings, customer counts, or compliance claims when true.',
          'Include clear calls to action such as "Book a Demo" or "Start Free Trial".',
          'Use descriptions to connect the problem, benefit, proof, and next step.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        title: 'Ad copy pattern',
        code: `Headline ideas
  Sales CRM Software
  Manage Every Deal in One Place
  Built for Growing Sales Teams
  Start Your Free Trial
  See Pipeline Reporting

Description ideas
  Replace scattered spreadsheets with a CRM your team can use every day.
  Track leads, deals, notes, and follow-ups in one simple sales workspace.`,
      },
      {
        type: 'note',
        text: 'Match types control how closely a search query must match your keyword, but search terms show what users actually typed. Use both views when optimizing.',
      },
      {
        type: 'tip',
        text: 'Create landing pages around one intent theme. If an ad group contains many different problems, the page will usually feel generic and conversion rate will suffer.',
      },
      {
        type: 'try',
        text: 'Choose one offer and create a search ad group with 8 keywords, 6 negative keywords, 8 headline ideas, 3 description ideas, and a landing page URL.',
      },
      {
        type: 'keypoints',
        items: [
          'Search ads convert when query, keyword, ad, offer, and landing page match.',
          'Separate brand, nonbrand, comparison, and transactional intent when budgets allow.',
          'Use negative keywords to protect spend from irrelevant searches.',
          'Review search terms regularly to find waste, new keywords, and copy insights.',
        ],
      },
    ],
  },
  {
    slug: 'dm-display-remarketing',
    title: 'Display & Remarketing',
    description:
      'Use display ads and remarketing audiences to re-engage visitors without wasting budget on low-quality impressions.',
    level: 'intermediate',
    section: 'Paid Media',
    order: 28,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Display advertising shows visual ads across websites, apps, and Google properties. It can create awareness, reinforce a message, and bring previous visitors back, but it can also waste money quickly if audiences, placements, and frequency are ignored.',
      },
      {
        type: 'p',
        text: 'Remarketing is usually the most practical display use case for intermediate teams. Instead of reaching everyone, you reach people who already visited, viewed key pages, abandoned a cart, watched a video, or engaged with your brand.',
      },
      { type: 'h2', text: 'Remarketing audience ladder' },
      {
        type: 'table',
        headers: ['Audience', 'Window', 'Message angle'],
        rows: [
          ['All website visitors', '30 days', 'General reminder and brand promise'],
          ['Pricing page visitors', '14 days', 'Proof, plan fit, and objection handling'],
          ['Cart abandoners', '7 days', 'Return to checkout, shipping, guarantee, or incentive'],
          ['Trial starters not activated', '14 days', 'Activation tips and onboarding help'],
          ['Past customers', '90-180 days', 'Upsell, cross-sell, referral, or repeat purchase'],
        ],
      },
      { type: 'h2', text: 'Creative framework' },
      {
        type: 'ul',
        items: [
          'Hook: remind the user of the problem or product they explored.',
          'Value: state one specific benefit, not a vague brand slogan.',
          'Proof: include ratings, customer logos, numbers, or guarantees when allowed.',
          'Action: tell the user exactly what to do next.',
          'Variant: create multiple sizes and messages for different audience stages.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        title: 'Display ad brief',
        code: `Audience: Pricing page visitors, last 14 days
Offer: Free demo with implementation checklist
Message: See which plan fits your team before you commit
CTA: Book a Demo
Proof: Trusted by 2,000+ support teams
Sizes: 300x250, 728x90, 160x600, 300x600, 320x100
Exclusions: Current customers, converted leads, internal traffic`,
      },
      { type: 'h2', text: 'Placement and frequency checklist' },
      {
        type: 'ol',
        items: [
          'Exclude converted users when the conversion makes the ad irrelevant.',
          'Review placements and exclude low-quality apps, parked domains, or irrelevant content.',
          'Set frequency controls where available to avoid annoying users.',
          'Segment recent high-intent visitors from broad low-intent visitors.',
          'Use UTM parameters so display traffic can be analyzed outside the ad platform.',
        ],
      },
      {
        type: 'warning',
        text: 'View-through conversions can make display campaigns look better than they are. Compare click-through conversions, assisted conversions, and incrementality when possible.',
      },
      {
        type: 'tip',
        text: 'Refresh remarketing creative every few weeks for small audiences. The same banner repeated too often can reduce trust instead of increasing recall.',
      },
      {
        type: 'try',
        text: 'Create a remarketing plan with three audiences, one message for each audience, exclusion rules, and a frequency guideline.',
      },
      {
        type: 'keypoints',
        items: [
          'Display works best with clear audience control and creative discipline.',
          'Remarketing should reflect what the user already did, not treat every visitor the same.',
          'Frequency, placement quality, and exclusions protect user experience and budget.',
          'Evaluate display with caution because view-through attribution can overstate impact.',
        ],
      },
    ],
  },
  {
    slug: 'dm-social-ads',
    title: 'Social Ads (Meta & Beyond)',
    description:
      'Plan social ad campaigns across Meta, LinkedIn, TikTok, and other platforms with audience, creative, and funnel fit.',
    level: 'intermediate',
    section: 'Paid Media',
    order: 29,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Social ads interrupt people while they browse feeds, stories, reels, videos, groups, and professional networks. Because intent is usually lower than search, creative and audience fit do much more of the work.',
      },
      {
        type: 'p',
        text: 'Meta, TikTok, LinkedIn, Pinterest, Reddit, X, and Snapchat all have different cultures and ad products, but the planning questions are similar: who should see the ad, why should they care now, and what action is realistic?',
      },
      { type: 'h2', text: 'Platform fit overview' },
      {
        type: 'table',
        headers: ['Platform', 'Strength', 'Common use'],
        rows: [
          ['Meta', 'Scale, creative testing, interests, lookalikes, remarketing', 'DTC, local, B2C, lead gen, ecommerce'],
          ['TikTok', 'Native short video discovery and creator-style content', 'Awareness, product education, viral creative testing'],
          ['LinkedIn', 'Professional targeting by company, role, industry, and seniority', 'B2B lead gen, events, ABM, thought leadership'],
          ['Pinterest', 'Visual planning and shopping intent', 'Home, fashion, food, beauty, lifestyle, ecommerce'],
          ['Reddit', 'Interest communities and candid discussion', 'Niche products, developer tools, research-driven campaigns'],
        ],
      },
      { type: 'h2', text: 'Creative-first campaign framework' },
      {
        type: 'ol',
        items: [
          'Define the awareness level: unaware, problem aware, solution aware, product aware, or ready to buy.',
          'Write one creative hypothesis for the audience, such as "new managers need a faster weekly planning ritual".',
          'Produce 3 to 5 creative angles before changing targeting.',
          'Match the landing page or lead form to the promise in the ad.',
          'Measure thumb-stop signals, click quality, conversion rate, and downstream revenue.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        title: 'Social ad creative matrix',
        code: `Audience: First-time ecommerce buyers
Offer: Starter bundle

Angle 1: Problem
  Hook: Tired of replacing cheap gear every month?
  Format: 15-second founder demo

Angle 2: Proof
  Hook: 18,000 hikers switched to our weekend kit
  Format: UGC testimonial

Angle 3: Comparison
  Hook: The weekend kit vs buying pieces separately
  Format: Split-screen product comparison

Angle 4: Objection
  Hook: Not sure what size to choose?
  Format: Fitting guide carousel`,
      },
      { type: 'h2', text: 'Social ads launch checklist' },
      {
        type: 'ul',
        items: [
          'Install and test platform pixels or conversion APIs where appropriate.',
          'Confirm privacy, consent, and data sharing settings.',
          'Create naming conventions for campaign, ad set, and ad names.',
          'Prepare at least 3 creative angles and 2 formats when budget allows.',
          'Check mobile landing page speed and message match.',
          'Exclude recent purchasers or converted leads when the offer no longer applies.',
        ],
      },
      {
        type: 'note',
        text: 'Audience targeting matters, but modern social platforms often optimize heavily from conversion data. Weak creative cannot usually be fixed by adding more interests.',
      },
      {
        type: 'tip',
        text: 'Write social ads like posts from the platform, not like display banners. Native language, fast hooks, and real visuals usually beat polished but generic ads.',
      },
      {
        type: 'try',
        text: 'Create a creative matrix for one offer with four angles, each including a hook, format, audience, and landing page promise.',
      },
      {
        type: 'keypoints',
        items: [
          'Social ads create or redirect attention, so creative quality is central.',
          'Different platforms have different cultures, targeting strengths, and realistic actions.',
          'Test creative angles before assuming targeting is the main problem.',
          'Track downstream lead or purchase quality, not only in-platform conversions.',
        ],
      },
    ],
  },
  {
    slug: 'dm-budgets-bidding',
    title: 'Budgets, Bidding & Optimization',
    description:
      'Manage paid media budgets, bidding strategies, pacing, and optimization decisions without overreacting to noisy data.',
    level: 'intermediate',
    section: 'Paid Media',
    order: 30,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Budget and bidding decisions determine how fast campaigns learn, how much risk you accept, and how efficiently you acquire customers. Optimization is not constant tinkering; it is a disciplined process for moving budget toward reliable performance.',
      },
      {
        type: 'p',
        text: 'Intermediate marketers need to understand the difference between daily platform budgets, true monthly spend, bid strategies, learning periods, conversion volume, and business-level profitability.',
      },
      { type: 'h2', text: 'Core budget math' },
      {
        type: 'code',
        language: 'text',
        title: 'Simple acquisition budget model',
        code: `Monthly paid media budget: $12,000
Target cost per qualified lead: $80
Expected leads: 12,000 / 80 = 150

Lead-to-customer rate: 12%
Expected customers: 150 * 0.12 = 18

Average gross profit per customer: $900
Expected gross profit: 18 * 900 = $16,200

Gross profit after media: $16,200 - $12,000 = $4,200`,
      },
      { type: 'h2', text: 'Bidding strategy map' },
      {
        type: 'table',
        headers: ['Strategy', 'Use when', 'Risk'],
        rows: [
          ['Manual CPC', 'You need tight keyword control or have little conversion data', 'Can miss auctions or require heavy management'],
          ['Maximize clicks', 'You need traffic for research or remarketing pools', 'May buy low-quality traffic'],
          ['Maximize conversions', 'Tracking is reliable and you want volume', 'Can overspend if conversion quality is weak'],
          ['Target CPA', 'You have enough conversion volume and a realistic CPA goal', 'Too-low targets can restrict delivery'],
          ['Target ROAS', 'Ecommerce value tracking is accurate', 'Poor feed or value data can mislead automation'],
        ],
      },
      { type: 'h2', text: 'Optimization rhythm' },
      {
        type: 'ol',
        items: [
          'Daily: check spend, disapprovals, tracking outages, and severe anomalies.',
          'Twice weekly: review search terms, placements, creative fatigue, and budget pacing.',
          'Weekly: compare CPA, ROAS, conversion rate, and lead quality by campaign.',
          'Biweekly: move budget between campaigns with enough data to justify changes.',
          'Monthly: evaluate creative learnings, funnel economics, and next experiment priorities.',
        ],
      },
      {
        type: 'code',
        language: 'json',
        title: 'Budget pacing snapshot',
        code: `{
  "month_budget": 12000,
  "days_in_month": 30,
  "current_day": 10,
  "planned_spend_to_date": 4000,
  "actual_spend_to_date": 4650,
  "pacing_status": "16.25% over planned pace",
  "action": "hold changes until conversion quality is reviewed"
}`,
      },
      {
        type: 'note',
        text: 'Optimization decisions need enough data. A campaign with two conversions may look amazing or terrible by chance. Use thresholds before making major budget moves.',
      },
      {
        type: 'tip',
        text: 'When using automated bidding, change budgets and targets gradually when possible. Large sudden changes can restart learning or destabilize delivery.',
      },
      {
        type: 'try',
        text: 'Create a monthly budget plan for three campaigns. Include target CPA or ROAS, expected conversions, pacing checks, and rules for increasing or decreasing spend.',
      },
      {
        type: 'keypoints',
        items: [
          'Budgets should connect platform spend to business economics.',
          'Bidding strategies depend on conversion data quality and campaign maturity.',
          'Optimization should follow a rhythm instead of reactive daily guessing.',
          'Move budget toward campaigns with both efficient cost and acceptable conversion quality.',
        ],
      },
    ],
  },
  {
    slug: 'dm-analytics-intro',
    title: 'Marketing Analytics Intro',
    description:
      'Use marketing analytics to connect campaigns, channels, user behavior, conversions, and business outcomes.',
    level: 'intermediate',
    section: 'Measurement',
    order: 31,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Marketing analytics is the practice of collecting, organizing, and interpreting data so marketing decisions improve. It helps you answer what happened, why it happened, what to do next, and whether the next action worked.',
      },
      {
        type: 'p',
        text: 'At the intermediate level, analytics is not just dashboard viewing. You need campaign naming, UTM hygiene, event tracking, conversion definitions, channel grouping, and a habit of turning data into decisions.',
      },
      { type: 'h2', text: 'Measurement questions' },
      {
        type: 'ul',
        items: [
          'Acquisition: where did visitors, leads, or customers come from?',
          'Behavior: what pages, content, or actions did they engage with?',
          'Conversion: which actions predict revenue or retention?',
          'Efficiency: what did each channel, campaign, or experiment cost?',
          'Quality: did the acquired users become qualified leads, customers, or repeat buyers?',
        ],
      },
      { type: 'h2', text: 'Metric hierarchy' },
      {
        type: 'table',
        headers: ['Level', 'Examples', 'Decision supported'],
        rows: [
          ['Business outcome', 'Revenue, profit, pipeline, customers', 'Where should we invest?'],
          ['Conversion', 'Purchases, demos, trials, qualified leads', 'Which campaigns produce value?'],
          ['Engagement', 'Scrolls, video plays, page depth, email clicks', 'What content or page experience works?'],
          ['Acquisition', 'Users, sessions, impressions, clicks', 'Where is attention coming from?'],
          ['Diagnostic', 'CTR, CPC, bounce rate, form errors', 'What should we fix or test?'],
        ],
      },
      {
        type: 'code',
        language: 'text',
        title: 'Analytics brief',
        code: `Business question
  Which paid campaigns generated qualified sales opportunities last month?

Required data
  Ad spend by campaign
  Sessions and leads by UTM campaign
  CRM opportunity stage and value
  Conversion dates and source fields

Primary metrics
  Cost per qualified opportunity
  Pipeline value by campaign
  Lead-to-opportunity rate

Decision
  Increase, hold, reduce, or test each campaign`,
      },
      {
        type: 'note',
        text: 'A dashboard is not automatically analytics. Analytics begins when a number is connected to a question, a comparison, and a possible decision.',
      },
      {
        type: 'tip',
        text: 'Define metrics in a shared document. If sales, marketing, and leadership use different definitions for lead or conversion, reports will create arguments instead of clarity.',
      },
      {
        type: 'try',
        text: 'Write three marketing questions for a real or fictional business. For each question, list the metrics, data sources, and decision the answer would support.',
      },
      {
        type: 'keypoints',
        items: [
          'Marketing analytics connects campaigns and channels to business decisions.',
          'Useful measurement starts with questions, not dashboards.',
          'Metric hierarchy helps separate outcomes from diagnostic signals.',
          'Consistent definitions and tracking hygiene make reports trustworthy.',
        ],
      },
    ],
  },
  {
    slug: 'dm-ga4-basics',
    title: 'GA4 Basics for Marketers',
    description:
      'Learn the GA4 concepts marketers need: events, conversions, traffic acquisition, explorations, audiences, and reports.',
    level: 'intermediate',
    section: 'Measurement',
    order: 32,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Google Analytics 4 uses an event-based data model. Page views, clicks, scrolls, form submissions, purchases, and custom actions can all be events. This gives marketers more flexibility than older session-only reporting, but it also requires cleaner planning.',
      },
      {
        type: 'p',
        text: 'GA4 is useful for understanding acquisition, engagement, conversions, audiences, and user paths. It is not a perfect source of truth for every paid media number because attribution settings, consent, sampling, and platform differences can change what you see.',
      },
      { type: 'h2', text: 'GA4 concepts that matter' },
      {
        type: 'table',
        headers: ['Concept', 'Meaning', 'Marketing use'],
        rows: [
          ['Event', 'A tracked user action', 'Measure actions such as sign_up, generate_lead, purchase, or video_start'],
          ['Parameter', 'Extra detail attached to an event', 'Capture plan name, form location, content type, or value'],
          ['Conversion', 'An event marked as important', 'Report key actions and optimize campaigns'],
          ['User property', 'A persistent user attribute', 'Build audiences such as account type or plan level'],
          ['Audience', 'A group of users matching rules', 'Remarketing, analysis, or personalization'],
        ],
      },
      { type: 'h2', text: 'Recommended marketer workflow' },
      {
        type: 'ol',
        items: [
          'Open Reports > Acquisition to review users and sessions by channel.',
          'Open Engagement > Events to confirm important actions are firing.',
          'Mark key events as conversions only when they represent meaningful progress.',
          'Use Explore for deeper path, funnel, or segment analysis.',
          'Compare GA4 data with ad platforms, CRM, and ecommerce systems before major decisions.',
        ],
      },
      {
        type: 'code',
        language: 'json',
        title: 'Example GA4 event plan',
        code: `[
  {
    "event_name": "generate_lead",
    "trigger": "contact form success",
    "parameters": {
      "form_name": "demo_request",
      "form_location": "pricing_page",
      "lead_type": "sales_demo"
    },
    "mark_as_conversion": true
  },
  {
    "event_name": "content_download",
    "trigger": "guide download success",
    "parameters": {
      "content_title": "crm_buyers_guide",
      "content_format": "pdf"
    },
    "mark_as_conversion": false
  }
]`,
      },
      { type: 'h2', text: 'GA4 QA checklist' },
      {
        type: 'ul',
        items: [
          'Use DebugView or real-time reports to confirm events.',
          'Check that UTMs appear in traffic acquisition reports.',
          'Confirm conversions are not firing on page load before a real action.',
          'Exclude internal traffic where appropriate.',
          'Connect Google Ads only after account access and conversion goals are understood.',
        ],
      },
      {
        type: 'note',
        text: 'Do not mark every engagement event as a conversion. Too many conversions make reports noisy and can mislead automated bidding.',
      },
      {
        type: 'tip',
        text: 'Use clear event names that describe the action, such as form_submit_success or trial_started. Avoid names that only make sense to one campaign team.',
      },
      {
        type: 'try',
        text: 'Create a GA4 event plan for a landing page with a demo form, video, pricing CTA, and guide download. Decide which events should be conversions.',
      },
      {
        type: 'keypoints',
        items: [
          'GA4 is event-based, so event planning is central to useful reporting.',
          'Conversions should represent meaningful business progress.',
          'Explorations help marketers analyze funnels, paths, and segments.',
          'GA4 should be compared with ad platforms, CRM, and sales data before final decisions.',
        ],
      },
    ],
  },
  {
    slug: 'dm-utm-tracking',
    title: 'UTM Tracking & Campaign URLs',
    description:
      'Build consistent UTM campaign URLs so traffic sources, campaigns, content, and offers can be analyzed accurately.',
    level: 'intermediate',
    section: 'Measurement',
    order: 33,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'UTM parameters are tags added to URLs so analytics tools can identify where traffic came from. They are essential for email, paid social, influencer links, partner campaigns, QR codes, and any link that might otherwise be hard to classify.',
      },
      {
        type: 'p',
        text: 'The goal is not to tag links randomly. The goal is to create a naming system that lets you compare campaigns without cleaning a spreadsheet for hours.',
      },
      { type: 'h2', text: 'The five common UTM parameters' },
      {
        type: 'table',
        headers: ['Parameter', 'Purpose', 'Example'],
        rows: [
          ['utm_source', 'The platform, publisher, or sender', 'google, meta, newsletter, partnername'],
          ['utm_medium', 'The channel or traffic type', 'cpc, paid_social, email, affiliate'],
          ['utm_campaign', 'The campaign initiative', 'spring_launch_2026'],
          ['utm_content', 'The creative, placement, or link variant', 'video_hook_a, footer_cta'],
          ['utm_term', 'Keyword or audience detail when useful', 'crm_software, lookalike_1pct'],
        ],
      },
      { type: 'h2', text: 'UTM naming rules' },
      {
        type: 'ul',
        items: [
          'Use lowercase to avoid duplicate source names like Facebook and facebook.',
          'Use underscores or hyphens consistently; avoid spaces.',
          'Keep medium values standardized across teams.',
          'Include campaign dates or seasons only when they help reporting.',
          'Document every campaign value before launch.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        title: 'Campaign URL examples',
        code: `Email newsletter
https://example.com/demo?utm_source=newsletter&utm_medium=email&utm_campaign=q3_pipeline_push&utm_content=hero_cta

Paid social ad
https://example.com/demo?utm_source=meta&utm_medium=paid_social&utm_campaign=q3_pipeline_push&utm_content=video_hook_a

Influencer link
https://example.com/starter?utm_source=creator_maya&utm_medium=influencer&utm_campaign=starter_bundle_launch&utm_content=story_link`,
      },
      {
        type: 'code',
        language: 'markdown',
        title: 'Simple UTM governance sheet',
        code: `| Field | Rule | Example |
| --- | --- | --- |
| source | platform or partner name | linkedin |
| medium | approved channel list | paid_social |
| campaign | initiative_goal_period | webinar_reg_q4 |
| content | creative or placement | carousel_problem_a |
| owner | person responsible | alex |`,
      },
      {
        type: 'warning',
        text: 'Never use UTM parameters on internal site links. Internal UTMs can overwrite the original acquisition source and damage attribution.',
      },
      {
        type: 'tip',
        text: 'Use a shared URL builder template so campaign managers, creators, and partners create links the same way.',
      },
      {
        type: 'try',
        text: 'Create UTM URLs for one campaign promoted through email, LinkedIn ads, a partner blog, and a QR code. Keep source and medium values consistent.',
      },
      {
        type: 'keypoints',
        items: [
          'UTMs make campaign traffic easier to classify and compare.',
          'Consistent naming matters more than clever naming.',
          'Source, medium, campaign, content, and term each answer a different reporting question.',
          'Do not tag internal links with UTMs.',
        ],
      },
    ],
  },
  {
    slug: 'dm-conversion-tracking',
    title: 'Conversion Tracking',
    description:
      'Plan, implement, and QA conversion tracking across websites, ad platforms, analytics tools, and CRM systems.',
    level: 'intermediate',
    section: 'Measurement',
    order: 34,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Conversion tracking measures the actions that matter to your business, such as purchases, qualified leads, trial starts, booked calls, subscriptions, or account activations. Without it, paid media platforms optimize toward clicks and traffic instead of outcomes.',
      },
      {
        type: 'p',
        text: 'Good conversion tracking is a system. It includes event definitions, trigger rules, values, consent handling, deduplication, QA, and agreement between analytics, ad platforms, and sales systems.',
      },
      { type: 'h2', text: 'Conversion planning framework' },
      {
        type: 'ol',
        items: [
          'List business outcomes and supporting micro-conversions.',
          'Choose the primary conversion used for reporting and bidding.',
          'Define exactly when the conversion fires.',
          'Assign values when revenue, lead score, or expected value is known.',
          'Document where each conversion is sent: GA4, ad platforms, CRM, warehouse, or email system.',
        ],
      },
      {
        type: 'table',
        headers: ['Conversion', 'Trigger', 'Primary?', 'Value idea'],
        rows: [
          ['Purchase', 'Order confirmation page or server event', 'Yes', 'Order revenue minus discounts'],
          ['Demo request', 'Form success event after validation', 'Yes', 'Expected opportunity value by segment'],
          ['Newsletter signup', 'Successful subscription', 'No', 'Optional estimated lead value'],
          ['Pricing CTA click', 'Click on pricing call to action', 'No', 'Diagnostic only'],
          ['Trial activation', 'User completes key onboarding action', 'Yes', 'Expected customer value by plan'],
        ],
      },
      {
        type: 'code',
        language: 'json',
        title: 'Conversion tracking spec',
        code: `{
  "event_name": "demo_request_success",
  "business_name": "Demo Request",
  "trigger": "server confirms CRM lead was created",
  "platforms": ["GA4", "Google Ads", "LinkedIn Ads", "CRM"],
  "deduplication_key": "lead_id",
  "parameters": {
    "form_name": "enterprise_demo",
    "lead_segment": "enterprise",
    "estimated_value": 350
  },
  "qa_steps": [
    "submit test lead",
    "verify network request",
    "verify GA4 DebugView",
    "verify ad platform test event",
    "verify CRM source fields"
  ]
}`,
      },
      { type: 'h2', text: 'QA checklist' },
      {
        type: 'ul',
        items: [
          'Test happy paths and validation errors.',
          'Confirm conversions fire once, not on every page refresh.',
          'Verify values, currencies, and order IDs for ecommerce.',
          'Check consent behavior and regional privacy requirements.',
          'Confirm internal test conversions can be identified or excluded.',
          'Compare event counts across systems after launch.',
        ],
      },
      {
        type: 'note',
        text: 'Micro-conversions are useful for diagnosis, but ad platforms should usually optimize toward the deepest reliable event with enough volume.',
      },
      {
        type: 'tip',
        text: 'When possible, trigger high-value conversions from a server-side success event or confirmed backend state instead of only a front-end button click.',
      },
      {
        type: 'try',
        text: 'Write a conversion tracking spec for a webinar registration, including trigger, platforms, parameters, deduplication, and QA steps.',
      },
      {
        type: 'keypoints',
        items: [
          'Conversion tracking tells analytics and ad platforms what outcomes matter.',
          'Each conversion needs a clear trigger, destination, value, and QA process.',
          'Deduplication prevents one action from being counted multiple times.',
          'Primary conversions should reflect business value, not just easy-to-track clicks.',
        ],
      },
    ],
  },
  {
    slug: 'dm-cro-intro',
    title: 'Conversion Rate Optimization',
    description:
      'Improve landing pages and funnels with structured CRO research, prioritization, and testing.',
    level: 'intermediate',
    section: 'Optimization',
    order: 35,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Conversion rate optimization, or CRO, improves the percentage of visitors who take a desired action. CRO is not just changing button colors. It is a research-driven process for reducing friction and increasing motivation.',
      },
      {
        type: 'p',
        text: 'The best CRO work combines quantitative data, qualitative feedback, UX review, copywriting, offer strategy, and controlled experiments where traffic volume supports testing.',
      },
      { type: 'h2', text: 'CRO equation' },
      {
        type: 'code',
        language: 'text',
        title: 'Conversion motivation model',
        code: `Conversion likelihood increases when:
  motivation is high
  value proposition is clear
  friction is low
  anxiety is reduced
  next step is obvious

Conversion likelihood decreases when:
  the offer is unclear
  the page loads slowly
  the form asks too much too soon
  proof is weak
  the visitor does not trust the brand`,
      },
      { type: 'h2', text: 'CRO research inputs' },
      {
        type: 'table',
        headers: ['Input', 'What it reveals', 'Example action'],
        rows: [
          ['Analytics', 'Drop-offs, device issues, traffic quality', 'Fix mobile checkout abandonment'],
          ['Heatmaps', 'Attention, clicks, scrolling', 'Move key CTA above common drop-off area'],
          ['Session recordings', 'UX confusion and form friction', 'Clarify form error messages'],
          ['User surveys', 'Objections and missing information', 'Add pricing explanation or guarantee'],
          ['Sales/support feedback', 'Repeated questions and objections', 'Add FAQ and proof near CTA'],
        ],
      },
      { type: 'h2', text: 'Landing page CRO checklist' },
      {
        type: 'ul',
        items: [
          'Headline states the visitor problem or desired outcome.',
          'Subheadline explains who the offer is for and why it matters.',
          'CTA is specific and repeated at logical decision points.',
          'Proof appears before or near high-commitment actions.',
          'Forms ask only for information needed at this stage.',
          'Page loads quickly on mobile.',
          'Ad promise and page promise match closely.',
        ],
      },
      {
        type: 'note',
        text: 'A higher conversion rate is not always better if lead quality drops. Track downstream quality whenever a CRO change affects who converts.',
      },
      {
        type: 'tip',
        text: 'Write hypotheses in a clear format: because we observed X, changing Y for audience Z should improve metric M.',
      },
      {
        type: 'try',
        text: 'Audit one landing page using the checklist. Write three CRO hypotheses and rank them by expected impact, confidence, and effort.',
      },
      {
        type: 'keypoints',
        items: [
          'CRO reduces friction and improves motivation across a funnel.',
          'Research should guide changes before experiments are launched.',
          'Conversion rate must be evaluated alongside lead or customer quality.',
          'Strong hypotheses make CRO work easier to prioritize and learn from.',
        ],
      },
    ],
  },
  {
    slug: 'dm-ab-testing',
    title: 'A/B Testing for Marketers',
    description:
      'Design practical A/B tests with clear hypotheses, clean variants, valid metrics, and realistic sample expectations.',
    level: 'intermediate',
    section: 'Optimization',
    order: 36,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'A/B testing compares two or more versions of a page, email, ad, or experience to learn which performs better. It is valuable when the question is important, traffic is sufficient, and the result will change what you do next.',
      },
      {
        type: 'p',
        text: 'Many marketing tests fail because they are too small, run too briefly, change too many things at once, or measure a metric that does not match the business decision.',
      },
      { type: 'h2', text: 'A/B test planning template' },
      {
        type: 'code',
        language: 'markdown',
        title: 'Experiment brief',
        code: `## Hypothesis
Because pricing page visitors often ask whether setup is included,
adding an implementation section near the CTA will increase demo requests.

## Audience
New visitors to the pricing page on desktop and mobile.

## Variants
Control: current pricing page.
Variant A: pricing page with implementation support block.

## Primary metric
Demo request conversion rate.

## Guardrail metrics
Lead quality, page load time, bounce rate.

## Minimum run rules
Run for at least 2 full business cycles and until the sample target is reached.`,
      },
      { type: 'h2', text: 'What to test' },
      {
        type: 'table',
        headers: ['Area', 'Good test idea', 'Weak test idea'],
        rows: [
          ['Offer', 'Free audit vs free template for cold leads', 'Changing CTA color only'],
          ['Message', 'Outcome headline vs feature headline', 'Rewriting three sections at random'],
          ['Proof', 'Customer logo row near form', 'Adding a vague award badge'],
          ['Form', 'Two-step form vs long single form', 'Removing required fields without sales input'],
          ['Email', 'Problem-led subject line vs benefit-led subject line', 'Testing tiny punctuation changes'],
        ],
      },
      { type: 'h2', text: 'Testing checklist' },
      {
        type: 'ol',
        items: [
          'Choose one primary metric before launch.',
          'Estimate sample size or minimum detectable effect.',
          'Run the test long enough to include normal weekday and weekend behavior.',
          'Avoid stopping early just because one variant is ahead.',
          'QA tracking and user experience for every variant.',
          'Document results, decision, and follow-up learning.',
        ],
      },
      {
        type: 'note',
        text: 'If traffic is too low for a valid A/B test, use research, usability testing, before-and-after analysis, or paid traffic tests instead of pretending small numbers are proof.',
      },
      {
        type: 'tip',
        text: 'Keep variants clean. When you change headline, layout, form, and offer at once, you may get a winner but you will not know what caused the result.',
      },
      {
        type: 'try',
        text: 'Write an A/B test brief for an email signup page. Include hypothesis, audience, variants, primary metric, guardrails, and minimum run rules.',
      },
      {
        type: 'keypoints',
        items: [
          'A/B tests should answer important decisions with enough traffic to trust the result.',
          'A clear hypothesis connects an observation, a change, an audience, and a metric.',
          'Primary and guardrail metrics prevent narrow wins that hurt the business.',
          'Documenting tests builds institutional learning beyond one campaign.',
        ],
      },
    ],
  },
  {
    slug: 'dm-crm-basics',
    title: 'CRM Basics for Marketing',
    description:
      'Use CRM systems to connect campaigns, contacts, lifecycle stages, lead quality, and revenue outcomes.',
    level: 'intermediate',
    section: 'Systems',
    order: 37,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'A customer relationship management system, or CRM, stores information about leads, contacts, companies, deals, customers, and interactions. For marketers, the CRM connects campaigns to pipeline and revenue.',
      },
      {
        type: 'p',
        text: 'Popular CRM platforms include HubSpot, Salesforce, Pipedrive, Zoho, and many industry-specific tools. The platform matters less than clean data, lifecycle definitions, source tracking, and sales follow-up discipline.',
      },
      { type: 'h2', text: 'Marketing fields that matter' },
      {
        type: 'table',
        headers: ['Field', 'Purpose', 'Example'],
        rows: [
          ['Original source', 'First known acquisition channel', 'paid_search'],
          ['Latest source', 'Most recent campaign touch', 'webinar_partner'],
          ['Lifecycle stage', 'Current funnel status', 'subscriber, lead, MQL, SQL, customer'],
          ['Lead score', 'Fit and engagement estimate', '72'],
          ['Campaign ID', 'Connects contact to campaign reporting', 'q4_demo_push'],
          ['Consent status', 'Determines communication permissions', 'email_opt_in'],
        ],
      },
      { type: 'h2', text: 'Lifecycle stage example' },
      {
        type: 'code',
        language: 'text',
        title: 'Simple B2B lifecycle',
        code: `Subscriber
  Joined email list or downloaded content

Lead
  Submitted a form with contact information

Marketing Qualified Lead
  Matches target profile and shows meaningful engagement

Sales Qualified Lead
  Accepted by sales for direct follow-up

Opportunity
  Has an active deal or buying process

Customer
  Purchased or signed a contract`,
      },
      { type: 'h2', text: 'CRM hygiene checklist' },
      {
        type: 'ul',
        items: [
          'Use required fields only when they are truly needed.',
          'Standardize source, medium, campaign, industry, and country values.',
          'Deduplicate contacts and companies regularly.',
          'Define ownership and handoff rules between marketing and sales.',
          'Sync form submissions, ad leads, chat, events, and email engagement consistently.',
          'Create reports that show both volume and quality by source.',
        ],
      },
      {
        type: 'note',
        text: 'CRM data can become messy quickly when every integration creates fields freely. Protect core reporting fields with naming rules and ownership.',
      },
      {
        type: 'tip',
        text: 'Ask sales which fields actually help prioritization. A shorter form with better routing often beats a long form full of unused data.',
      },
      {
        type: 'try',
        text: 'Design a CRM record for a new demo lead. Include required fields, source fields, lifecycle stage, owner routing, and follow-up SLA.',
      },
      {
        type: 'keypoints',
        items: [
          'A CRM connects marketing activity to sales outcomes and customer history.',
          'Lifecycle stages need shared definitions between marketing and sales.',
          'Source fields and campaign IDs make attribution and quality reporting possible.',
          'CRM hygiene is a marketing responsibility, not only a sales operations task.',
        ],
      },
    ],
  },
  {
    slug: 'dm-automation',
    title: 'Marketing Automation',
    description:
      'Build useful marketing automation workflows for segmentation, nurturing, lead routing, reminders, and customer lifecycle moments.',
    level: 'intermediate',
    section: 'Systems',
    order: 38,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Marketing automation uses rules, triggers, and workflows to send the right message or update the right system at the right time. It can save time, improve follow-up, and personalize journeys when the logic is clear.',
      },
      {
        type: 'p',
        text: 'Automation can also create bad experiences at scale. Duplicate emails, wrong personalization, stale segments, and broken routing are common when teams automate before defining rules and ownership.',
      },
      { type: 'h2', text: 'Common automation types' },
      {
        type: 'table',
        headers: ['Automation', 'Trigger', 'Purpose'],
        rows: [
          ['Welcome sequence', 'New subscriber joins list', 'Set expectations and introduce value'],
          ['Lead nurture', 'Content download or webinar registration', 'Educate and move toward sales conversation'],
          ['Lead routing', 'Demo request created', 'Assign owner and notify sales'],
          ['Re-engagement', 'No engagement for 90 days', 'Confirm interest or suppress inactive contacts'],
          ['Customer onboarding', 'Purchase or account created', 'Drive activation and reduce churn'],
        ],
      },
      { type: 'h2', text: 'Workflow planning template' },
      {
        type: 'code',
        language: 'markdown',
        title: 'Automation workflow spec',
        code: `## Workflow name
Demo Request Routing

## Entry trigger
Contact submits enterprise demo form and email is valid.

## Suppression rules
Exclude existing customers and open opportunities.

## Actions
1. Set lifecycle stage to SQL.
2. Assign owner by territory.
3. Create task due in 2 business hours.
4. Send internal Slack or email alert.
5. Send prospect confirmation email.

## Exit criteria
Contact books meeting, becomes customer, or is disqualified.

## QA
Test each territory, duplicate submission, invalid email, and existing customer path.`,
      },
      { type: 'h2', text: 'Automation checklist' },
      {
        type: 'ul',
        items: [
          'Define entry criteria and exit criteria clearly.',
          'Add suppression rules for customers, competitors, employees, and inactive contacts where needed.',
          'Use delays that match the buyer journey and sales SLA.',
          'Personalize only with fields that are reliably populated.',
          'Include error monitoring for failed syncs and bounced emails.',
          'Review workflows quarterly for stale logic.',
        ],
      },
      {
        type: 'warning',
        text: 'Do not let multiple workflows update the same lifecycle fields without a clear hierarchy. Conflicting automation can move contacts backward or trigger the wrong messages.',
      },
      {
        type: 'tip',
        text: 'Start with operational automations that protect follow-up, such as lead routing and task creation, before building complex personalization paths.',
      },
      {
        type: 'try',
        text: 'Map one automation workflow from trigger to exit. Include suppression rules, fields updated, messages sent, owner, and QA cases.',
      },
      {
        type: 'keypoints',
        items: [
          'Automation combines triggers, rules, actions, and exits.',
          'Good automation improves timing and consistency without removing human judgment.',
          'Suppression and QA prevent embarrassing or harmful automated messages.',
          'Workflow documentation is essential when multiple teams rely on the same system.',
        ],
      },
    ],
  },
  {
    slug: 'dm-lead-generation',
    title: 'Lead Generation Systems',
    description:
      'Design lead generation systems that attract the right audience, capture useful information, and create reliable follow-up.',
    level: 'intermediate',
    section: 'Systems',
    order: 39,
    minutes: 14,
    content: [
      {
        type: 'p',
        text: 'Lead generation is the process of attracting potential customers and collecting enough information to continue the conversation. A lead generation system includes the audience, offer, traffic source, landing page, form, tracking, CRM, and follow-up.',
      },
      {
        type: 'p',
        text: 'The biggest mistake is optimizing for lead volume alone. A campaign can produce many cheap leads that never become customers. Intermediate marketers balance quantity, quality, speed, and sales readiness.',
      },
      { type: 'h2', text: 'Lead magnet and intent map' },
      {
        type: 'table',
        headers: ['Offer type', 'Buyer stage', 'Best follow-up'],
        rows: [
          ['Checklist or template', 'Early problem aware', 'Educational nurture'],
          ['Webinar', 'Problem or solution aware', 'Reminder, replay, related consultation'],
          ['Calculator or assessment', 'Solution aware', 'Personalized results and sales handoff'],
          ['Demo request', 'Product aware', 'Fast sales follow-up'],
          ['Free trial', 'Ready to evaluate', 'Activation onboarding and product usage prompts'],
        ],
      },
      { type: 'h2', text: 'Lead generation flow' },
      {
        type: 'code',
        language: 'text',
        title: 'End-to-end lead gen system',
        code: `Traffic source
  LinkedIn sponsored content

Offer
  B2B Retention Benchmark Report

Landing page
  Problem statement, report preview, proof, short form

Form fields
  Work email, company size, role, main challenge

CRM actions
  Create contact, set source, attach campaign, score lead

Follow-up
  Send report, enroll nurture, alert sales for high-fit accounts

Measurement
  Cost per lead, MQL rate, opportunity rate, pipeline value`,
      },
      { type: 'h2', text: 'Lead quality checklist' },
      {
        type: 'ul',
        items: [
          'Does the offer attract people who could actually buy?',
          'Does the form capture enough fit data without killing conversion?',
          'Are junk leads, students, competitors, and vendors filtered or scored lower?',
          'Is follow-up fast enough for high-intent leads?',
          'Can leads be traced from campaign to CRM outcome?',
          'Do sales and marketing agree on qualification criteria?',
        ],
      },
      {
        type: 'note',
        text: 'A lead magnet should create a bridge to your product or service. If the offer is popular but unrelated to buying intent, downstream conversion will be weak.',
      },
      {
        type: 'tip',
        text: 'Use progressive profiling when possible. Ask for less information on the first conversion and enrich the profile over later interactions.',
      },
      {
        type: 'try',
        text: 'Design a lead generation campaign for a B2B service. Include audience, offer, landing page sections, form fields, CRM actions, and success metrics.',
      },
      {
        type: 'keypoints',
        items: [
          'Lead generation is a system, not only a form or downloadable asset.',
          'Lead quality matters as much as lead volume.',
          'Offer intent should match the follow-up and sales process.',
          'CRM tracking is required to learn which campaigns create real opportunities.',
        ],
      },
    ],
  },
  {
    slug: 'dm-nurture',
    title: 'Lead Nurture Sequences',
    description:
      'Create nurture sequences that educate leads, handle objections, and move the right people toward the next step.',
    level: 'intermediate',
    section: 'Systems',
    order: 40,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'A lead nurture sequence is a planned series of messages that helps a lead understand the problem, evaluate options, trust your brand, and choose a next step. It is most useful when buyers need time before talking to sales or purchasing.',
      },
      {
        type: 'p',
        text: 'Good nurture is not a disguised hard sell every day. It mixes education, proof, objection handling, segmentation, and timely calls to action based on lead intent.',
      },
      { type: 'h2', text: 'Nurture sequence structure' },
      {
        type: 'code',
        language: 'text',
        title: 'Five-email nurture example',
        code: `Email 1: Deliver the promised asset
  Goal: Build trust and set expectations
  CTA: Read the guide

Email 2: Teach the core problem
  Goal: Help the lead diagnose their situation
  CTA: Use the checklist

Email 3: Show proof
  Goal: Demonstrate results with a case study
  CTA: See customer story

Email 4: Handle objections
  Goal: Address price, implementation, risk, or timing
  CTA: Compare options

Email 5: Invite action
  Goal: Offer a demo, trial, consultation, or purchase path
  CTA: Book a call`,
      },
      { type: 'h2', text: 'Segmentation ideas' },
      {
        type: 'table',
        headers: ['Segment', 'Signal', 'Nurture adjustment'],
        rows: [
          ['Role', 'Founder, manager, practitioner', 'Change examples and benefits'],
          ['Company size', 'Small business vs enterprise', 'Change proof, pricing, and implementation detail'],
          ['Intent', 'Pricing page or demo page visit', 'Increase urgency and sales CTA'],
          ['Industry', 'Healthcare, ecommerce, SaaS', 'Use relevant use cases and compliance notes'],
          ['Engagement', 'Clicked multiple emails', 'Route to sales or stronger CTA'],
        ],
      },
      { type: 'h2', text: 'Nurture QA checklist' },
      {
        type: 'ul',
        items: [
          'Confirm the entry trigger matches the promised content.',
          'Suppress current customers, active opportunities, and unsubscribed contacts.',
          'Test personalization fields for missing values.',
          'Check links, UTMs, mobile rendering, and plain-text version.',
          'Define exit rules when a lead books a meeting or buys.',
          'Monitor unsubscribe rate, reply quality, and downstream conversion.',
        ],
      },
      {
        type: 'note',
        text: 'Nurture timing depends on buyer context. A demo request may need minutes, while a benchmark report download may need several days of education.',
      },
      {
        type: 'tip',
        text: 'Use behavior to branch only when it changes the message meaningfully. Overly complex nurture maps are hard to QA and often provide little extra value.',
      },
      {
        type: 'try',
        text: 'Write a five-message nurture sequence for a webinar attendee. Include each email goal, subject idea, CTA, timing, and exit criteria.',
      },
      {
        type: 'keypoints',
        items: [
          'Lead nurture guides interested people toward readiness over time.',
          'A useful sequence includes education, proof, objection handling, and action.',
          'Segmentation should change the message in a meaningful way.',
          'Suppression, exit rules, and QA protect recipients from irrelevant automation.',
        ],
      },
    ],
  },
  {
    slug: 'dm-influencer',
    title: 'Influencer & Creator Marketing',
    description:
      'Plan creator campaigns with clear goals, creator fit, briefs, tracking, usage rights, and performance evaluation.',
    level: 'intermediate',
    section: 'Growth Channels',
    order: 41,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Influencer and creator marketing uses trusted individuals to introduce, demonstrate, review, or recommend a brand. It can drive awareness, content production, community trust, and sales when creator fit is strong.',
      },
      {
        type: 'p',
        text: 'The best campaigns respect the creator audience. A creator who understands the product and can communicate naturally often beats a larger account with weak relevance.',
      },
      { type: 'h2', text: 'Creator evaluation framework' },
      {
        type: 'table',
        headers: ['Factor', 'What to check', 'Why it matters'],
        rows: [
          ['Audience fit', 'Demographics, interests, geography, buyer stage', 'Reach is valuable only if the audience can buy or influence'],
          ['Engagement quality', 'Comments, saves, shares, repeat viewers', 'Fake or shallow engagement weakens performance'],
          ['Content style', 'Voice, format, pacing, production level', 'Ads should feel native to the creator feed'],
          ['Brand safety', 'Past controversies, claims, topics, competitor ties', 'Protects reputation and compliance'],
          ['Performance history', 'Case studies, affiliate results, past brand work', 'Improves forecasting and negotiation'],
        ],
      },
      { type: 'h2', text: 'Creator brief structure' },
      {
        type: 'code',
        language: 'markdown',
        title: 'Influencer campaign brief',
        code: `## Campaign goal
Drive trial signups for the new planning app.

## Audience
Freelancers and small agency owners who manage multiple client projects.

## Key message
Plan the week in 15 minutes and keep client tasks in one place.

## Required points
- Show the weekly planning board.
- Mention the free 14-day trial.
- Include tracking link and disclosure.

## Creative freedom
Creator chooses hook, story, and demo flow.

## Deliverables
1 short-form video, 3 story frames, 30-day usage rights for paid social.

## Tracking
Unique UTM link, creator code, landing page, post date, spend if boosted.`,
      },
      { type: 'h2', text: 'Campaign checklist' },
      {
        type: 'ul',
        items: [
          'Confirm disclosure requirements such as ad or sponsored labels.',
          'Agree on deliverables, deadlines, revision limits, and usage rights.',
          'Provide product access and real talking points before scripting.',
          'Create unique links, codes, or landing pages for measurement.',
          'Track both direct conversions and reusable content value.',
          'Save learnings about hooks, objections, and audience language.',
        ],
      },
      {
        type: 'note',
        text: 'Usage rights matter. Organic creator posts and paid ad usage are different rights and should be agreed before content is reused in ads.',
      },
      {
        type: 'tip',
        text: 'Brief the outcome and guardrails, then leave room for creator voice. Over-scripted creator content often performs like a weak brand ad.',
      },
      {
        type: 'try',
        text: 'Create a creator shortlist for one product with five evaluation criteria, campaign goal, deliverables, tracking plan, and usage rights needed.',
      },
      {
        type: 'keypoints',
        items: [
          'Creator fit is more important than follower count alone.',
          'A good brief balances required claims with authentic creator style.',
          'Tracking should include links, codes, content dates, and downstream performance.',
          'Disclosure and usage rights are essential parts of campaign operations.',
        ],
      },
    ],
  },
  {
    slug: 'dm-affiliate',
    title: 'Affiliate & Partnership Marketing',
    description:
      'Build affiliate and partner programs with clear economics, tracking, partner enablement, and quality controls.',
    level: 'intermediate',
    section: 'Growth Channels',
    order: 42,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Affiliate marketing rewards partners for driving tracked actions such as sales, leads, trials, or subscriptions. Partnership marketing is broader and may include co-marketing, integrations, referrals, resellers, and strategic alliances.',
      },
      {
        type: 'p',
        text: 'A sustainable program aligns partner incentives with customer quality. If commissions reward low-quality leads or coupon poaching, the program can look successful while hurting profit.',
      },
      { type: 'h2', text: 'Partner program types' },
      {
        type: 'table',
        headers: ['Type', 'Best for', 'Measurement'],
        rows: [
          ['Affiliate', 'Content sites, creators, newsletters, review sites', 'Tracked sales, leads, commission cost'],
          ['Referral', 'Customers or users recommending peers', 'Referral codes, invited accounts, retained customers'],
          ['Co-marketing', 'Brands with similar audiences', 'Registrations, leads, reach, pipeline'],
          ['Integration partner', 'Products that work together', 'Marketplace installs, shared customers, influenced revenue'],
          ['Reseller or agency', 'Services teams selling or implementing your product', 'Closed deals, margin, customer retention'],
        ],
      },
      { type: 'h2', text: 'Affiliate economics' },
      {
        type: 'code',
        language: 'text',
        title: 'Commission model example',
        code: `Average order value: $120
Gross margin: 65%
Gross profit per order: $78
Target max acquisition cost: $35

Commission options
  20% of sale = $24 commission
  $30 flat CPA = $30 commission
  15% recurring for 6 months = depends on retention

Quality controls
  No trademark bidding
  No unauthorized coupon sites
  Commission approved after refund window
  Higher tier only for retained customers`,
      },
      { type: 'h2', text: 'Partner enablement checklist' },
      {
        type: 'ul',
        items: [
          'Provide approved positioning, logos, screenshots, and product claims.',
          'Create landing pages or partner pages with strong message match.',
          'Use unique links, codes, or partner IDs.',
          'Define commission, approval rules, payout timing, and prohibited tactics.',
          'Share launch calendars and content ideas.',
          'Review partner performance by revenue quality, not just conversion volume.',
        ],
      },
      {
        type: 'warning',
        text: 'Protect your brand terms. Some affiliates bid on your branded search terms or intercept customers who were already going to buy.',
      },
      {
        type: 'tip',
        text: 'Start with a small group of high-fit partners before opening a public program. Early quality is easier to manage than cleaning up a noisy network later.',
      },
      {
        type: 'try',
        text: 'Design a simple affiliate program for an ecommerce product. Include commission, approval rules, partner assets, tracking method, and prohibited tactics.',
      },
      {
        type: 'keypoints',
        items: [
          'Affiliate and partnership programs extend distribution through trusted third parties.',
          'Commission design must fit product margin and customer quality.',
          'Partner enablement improves accuracy, consistency, and conversion.',
          'Rules and audits prevent brand bidding, coupon abuse, and low-quality leads.',
        ],
      },
    ],
  },
  {
    slug: 'dm-community',
    title: 'Community Marketing',
    description:
      'Use community marketing to create trust, participation, feedback loops, advocacy, and customer learning.',
    level: 'intermediate',
    section: 'Growth Channels',
    order: 43,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Community marketing builds relationships around shared interests, goals, identities, or problems. Communities can live in forums, Slack, Discord, LinkedIn groups, events, user groups, comment sections, or owned platforms.',
      },
      {
        type: 'p',
        text: 'A community is not just an audience you broadcast to. Healthy communities create participation between members, not only attention toward the brand.',
      },
      { type: 'h2', text: 'Community strategy questions' },
      {
        type: 'ul',
        items: [
          'Who is the community for, and what do they want to become better at?',
          'What recurring value will members receive without needing to buy immediately?',
          'What behaviors should members perform: ask, answer, share, attend, review, refer, or create?',
          'What role will the brand play: host, educator, connector, curator, or participant?',
          'How will moderation, onboarding, and rituals keep the space useful?',
        ],
      },
      { type: 'h2', text: 'Community program structure' },
      {
        type: 'code',
        language: 'markdown',
        title: 'Monthly community calendar',
        code: `Week 1: Expert AMA
  Goal: Education and member questions

Week 2: Member wins thread
  Goal: Participation and peer recognition

Week 3: Live workshop
  Goal: Skill building and product-adjacent use cases

Week 4: Feedback circle
  Goal: Customer insight and roadmap learning

Always on:
  New member welcome
  Resource library
  Moderation queue
  Top contributor recognition`,
      },
      { type: 'h2', text: 'Community metrics' },
      {
        type: 'table',
        headers: ['Metric type', 'Examples', 'Meaning'],
        rows: [
          ['Health', 'Active members, posts, replies, response time', 'Is the space alive and useful?'],
          ['Value', 'Event attendance, resource downloads, solved questions', 'Are members getting help?'],
          ['Advocacy', 'Referrals, reviews, testimonials, user-generated content', 'Are members promoting the brand?'],
          ['Insight', 'Feature requests, objections, support themes', 'What can the business learn?'],
          ['Revenue influence', 'Community-attributed trials, expansion, retention', 'Does community support business goals?'],
        ],
      },
      {
        type: 'note',
        text: 'Community ROI often appears through retention, advocacy, feedback, and trust, not only immediate last-click conversions.',
      },
      {
        type: 'tip',
        text: 'Create rituals that are easy to repeat. Weekly prompts, monthly workshops, and member spotlights make participation easier than one-off announcements.',
      },
      {
        type: 'try',
        text: 'Design a one-month community plan with audience, platform, weekly rituals, moderation rules, and five success metrics.',
      },
      {
        type: 'keypoints',
        items: [
          'Community marketing creates participation and trust around shared value.',
          'The brand should define its role and support member-to-member interaction.',
          'Rituals, moderation, and onboarding keep communities healthy.',
          'Community impact can include retention, advocacy, insight, and revenue influence.',
        ],
      },
    ],
  },
  {
    slug: 'dm-reputation',
    title: 'Reviews & Reputation',
    description:
      'Manage reviews, testimonials, social proof, and reputation workflows ethically and consistently.',
    level: 'intermediate',
    section: 'Growth Channels',
    order: 44,
    minutes: 12,
    content: [
      {
        type: 'p',
        text: 'Reviews and reputation shape whether people trust your brand before they ever speak with you. Search results, marketplaces, social comments, review sites, app stores, and local listings all influence conversion.',
      },
      {
        type: 'p',
        text: 'Reputation marketing is not manipulation. It is the disciplined work of earning customer feedback, responding well, fixing repeated issues, and turning authentic proof into useful marketing assets.',
      },
      { type: 'h2', text: 'Reputation system components' },
      {
        type: 'table',
        headers: ['Component', 'Purpose', 'Examples'],
        rows: [
          ['Monitoring', 'Find reviews and mentions quickly', 'Google Business Profile, G2, Capterra, App Store, social listening'],
          ['Request workflow', 'Ask satisfied customers at the right moment', 'Post-purchase email, NPS promoter request, support resolution'],
          ['Response process', 'Handle praise and complaints consistently', 'Templates, escalation rules, ownership'],
          ['Proof library', 'Reuse approved quotes and stories', 'Testimonials, star ratings, case study notes'],
          ['Feedback loop', 'Fix root causes', 'Share patterns with product, support, operations'],
        ],
      },
      { type: 'h2', text: 'Review request template' },
      {
        type: 'code',
        language: 'text',
        title: 'Ethical review request',
        code: `Subject: Would you share your experience?

Hi Jordan,

Thanks for using Acme to launch your new store. If the setup has been helpful,
would you be willing to leave an honest review?

Your feedback helps other teams understand what to expect, and it helps us keep improving.

Review link: https://example.com/review

Thank you,
The Acme Team`,
      },
      { type: 'h2', text: 'Response checklist' },
      {
        type: 'ul',
        items: [
          'Respond quickly, especially to negative reviews.',
          'Thank the reviewer and acknowledge the specific issue or praise.',
          'Avoid arguing, blaming, or revealing private customer information.',
          'Move sensitive issue resolution to a private channel.',
          'Tag recurring themes for product, operations, or support follow-up.',
          'Ask permission before turning a customer quote into marketing material.',
        ],
      },
      {
        type: 'warning',
        text: 'Do not buy fake reviews or offer incentives that violate platform rules. Short-term review manipulation can create legal, platform, and brand risk.',
      },
      {
        type: 'tip',
        text: 'Ask for reviews after a value moment, such as successful onboarding, a resolved support issue, repeat purchase, or positive NPS response.',
      },
      {
        type: 'try',
        text: 'Create a review workflow for a local service or SaaS company. Include trigger, message, review sites, response SLA, escalation rules, and proof library tags.',
      },
      {
        type: 'keypoints',
        items: [
          'Reviews influence trust, SEO, marketplace conversion, and sales conversations.',
          'Reputation work includes monitoring, requests, responses, proof, and feedback loops.',
          'Ethical review generation asks for honest feedback at appropriate moments.',
          'Negative reviews can reveal operational issues that marketing alone cannot fix.',
        ],
      },
    ],
  },
  {
    slug: 'dm-video-marketing',
    title: 'Video Marketing Strategy',
    description:
      'Plan marketing videos for awareness, education, conversion, onboarding, and retention across modern channels.',
    level: 'intermediate',
    section: 'Growth Channels',
    order: 45,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'Video marketing uses motion, voice, demonstration, and story to communicate faster than text alone. It can support ads, social, SEO, sales enablement, onboarding, customer success, and community.',
      },
      {
        type: 'p',
        text: 'A strong video strategy starts with the viewer job. Are they discovering a problem, comparing solutions, learning how to use a product, or looking for proof before buying?',
      },
      { type: 'h2', text: 'Video funnel map' },
      {
        type: 'table',
        headers: ['Funnel stage', 'Video type', 'Primary metric'],
        rows: [
          ['Awareness', 'Short social hook, educational clip, founder POV', 'Reach, hold rate, shares'],
          ['Consideration', 'Explainer, webinar, comparison, product tour', 'Watch time, clicks, assisted conversions'],
          ['Conversion', 'Demo, testimonial, objection handling, case study', 'Leads, purchases, booked calls'],
          ['Onboarding', 'Setup guide, tutorial, checklist walkthrough', 'Activation, support ticket reduction'],
          ['Retention', 'Feature education, community recap, customer story', 'Expansion, adoption, renewal influence'],
        ],
      },
      { type: 'h2', text: 'Short-form video script' },
      {
        type: 'code',
        language: 'text',
        title: '30-second product education video',
        code: `0-3 seconds: Hook
  "Your team does not need another status meeting."

3-10 seconds: Problem
  Show messy notes, chat messages, and missed tasks.

10-20 seconds: Solution
  Demonstrate one weekly planning board and owner assignments.

20-26 seconds: Proof
  "Agencies use this to cut project check-ins by 30%."

26-30 seconds: CTA
  "Try the free planning template."`,
      },
      { type: 'h2', text: 'Production checklist' },
      {
        type: 'ul',
        items: [
          'Define audience, stage, promise, and CTA before filming.',
          'Write the hook first for social video.',
          'Capture captions or add subtitles for sound-off viewing.',
          'Film product screens clearly and zoom on important actions.',
          'Create cutdowns for different placements and aspect ratios.',
          'Track links, landing pages, and video engagement metrics.',
        ],
      },
      {
        type: 'note',
        text: 'Production quality should match the channel. A polished homepage video may need high production, while a TikTok or Reels ad may perform better when it feels native and direct.',
      },
      {
        type: 'tip',
        text: 'Turn one long video into multiple assets: short clips, quote graphics, blog embeds, email content, help docs, and sales follow-up snippets.',
      },
      {
        type: 'try',
        text: 'Plan a video campaign for one product with three videos: awareness, consideration, and conversion. Include hook, CTA, channel, and metric for each.',
      },
      {
        type: 'keypoints',
        items: [
          'Video can support every stage of the customer journey.',
          'The viewer job should determine format, message, and CTA.',
          'Hooks, pacing, captions, and platform fit are critical for social video.',
          'Repurposing increases the return from planning and production effort.',
        ],
      },
    ],
  },
  {
    slug: 'dm-ecommerce-marketing',
    title: 'Ecommerce Marketing Basics',
    description:
      'Manage ecommerce growth with product pages, paid traffic, lifecycle email, merchandising, retention, and key metrics.',
    level: 'intermediate',
    section: 'Growth Channels',
    order: 46,
    minutes: 15,
    content: [
      {
        type: 'p',
        text: 'Ecommerce marketing combines traffic acquisition, product merchandising, conversion optimization, lifecycle messaging, retention, and customer economics. The goal is not only to get the first order, but to acquire customers profitably and keep them buying.',
      },
      {
        type: 'p',
        text: 'Intermediate ecommerce marketers pay close attention to average order value, gross margin, contribution margin, repeat purchase rate, customer acquisition cost, and lifetime value.',
      },
      { type: 'h2', text: 'Ecommerce metric map' },
      {
        type: 'table',
        headers: ['Metric', 'Meaning', 'Improvement levers'],
        rows: [
          ['Conversion rate', 'Percent of visitors who purchase', 'Product page clarity, trust, offers, checkout'],
          ['Average order value', 'Average revenue per order', 'Bundles, thresholds, upsells, merchandising'],
          ['Gross margin', 'Revenue after product costs', 'Pricing, sourcing, discount discipline'],
          ['CAC', 'Cost to acquire a customer', 'Channel mix, creative, targeting, landing page'],
          ['Repeat purchase rate', 'Percent who buy again', 'Email, subscriptions, replenishment, loyalty'],
          ['LTV', 'Expected customer value over time', 'Retention, cross-sell, product quality, service'],
        ],
      },
      { type: 'h2', text: 'Product page checklist' },
      {
        type: 'ul',
        items: [
          'Clear product title and primary benefit.',
          'High-quality images or video showing use, scale, and detail.',
          'Price, shipping, returns, and delivery expectations visible.',
          'Social proof such as reviews, ratings, or customer photos.',
          'Variant selection is easy on mobile.',
          'FAQ addresses sizing, compatibility, ingredients, warranty, or care.',
          'CTA is obvious and checkout path is short.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        title: 'Ecommerce lifecycle flows',
        code: `Welcome flow
  New subscriber -> brand story -> best sellers -> first purchase offer

Browse abandonment
  Viewed product -> benefit reminder -> reviews -> related products

Cart abandonment
  Added to cart -> checkout reminder -> objection handling -> incentive if needed

Post-purchase
  Order confirmation -> usage tips -> review request -> replenishment or cross-sell

Winback
  No purchase in 120 days -> new arrivals -> personalized offer -> suppress if inactive`,
      },
      { type: 'h2', text: 'Paid media economics example' },
      {
        type: 'code',
        language: 'text',
        title: 'Contribution margin check',
        code: `Average order value: $80
Gross margin: 60% = $48
Shipping subsidy: $6
Payment and platform fees: $3
Contribution before ads: $39

If target first-order profit is $4:
Maximum CAC = $35

If repeat purchases are strong:
You may accept a higher first-order CAC with a clear payback window.`,
      },
      {
        type: 'note',
        text: 'Discounts can increase conversion rate while lowering profit. Always evaluate promotions with margin and repeat purchase behavior, not revenue alone.',
      },
      {
        type: 'tip',
        text: 'Segment first-time buyers, repeat buyers, VIPs, discount buyers, and lapsed customers. Each group should receive different lifecycle messages.',
      },
      {
        type: 'try',
        text: 'Audit an ecommerce product page and lifecycle system. List five conversion improvements, three email flows, and the metrics you would monitor.',
      },
      {
        type: 'keypoints',
        items: [
          'Ecommerce growth depends on traffic, conversion, order value, margin, and retention.',
          'Product pages must answer trust, fit, shipping, and value questions quickly.',
          'Lifecycle email and SMS flows improve recovery, repeat purchases, and customer education.',
          'Paid acquisition should be evaluated with contribution margin and payback period.',
        ],
      },
    ],
  },
  {
    slug: 'dm-reporting',
    title: 'Marketing Reports That Matter',
    description:
      'Create marketing reports that connect performance to decisions, not just dashboards full of disconnected metrics.',
    level: 'intermediate',
    section: 'Delivery',
    order: 47,
    minutes: 13,
    content: [
      {
        type: 'p',
        text: 'A marketing report should help someone make a better decision. It should explain what changed, why it matters, what actions are recommended, and what risks or questions remain.',
      },
      {
        type: 'p',
        text: 'Intermediate reporting moves beyond screenshots from ad platforms. It combines channel data, analytics, CRM or ecommerce outcomes, budget pacing, experiment learnings, and next steps.',
      },
      { type: 'h2', text: 'Report outline' },
      {
        type: 'code',
        language: 'markdown',
        title: 'Monthly marketing report structure',
        code: `# Monthly Marketing Report

## 1. Executive summary
- Biggest wins
- Biggest risks
- Decisions needed

## 2. Goal progress
- Target vs actual for revenue, pipeline, leads, purchases, or retention

## 3. Channel performance
- Spend, traffic, conversions, cost, quality, and trend by channel

## 4. Campaign highlights
- What worked, what did not, and why

## 5. Funnel and conversion insights
- Landing pages, lead quality, ecommerce checkout, or lifecycle performance

## 6. Experiments and learnings
- Tests launched, results, and decisions

## 7. Next actions
- Start, stop, continue, and owners`,
      },
      { type: 'h2', text: 'Metrics by audience' },
      {
        type: 'table',
        headers: ['Audience', 'Needs', 'Report focus'],
        rows: [
          ['Executive', 'Business progress and decisions', 'Revenue, pipeline, CAC, ROAS, risks, forecast'],
          ['Marketing team', 'Optimization detail', 'Campaign, creative, channel, funnel, experiment data'],
          ['Sales team', 'Lead quality and follow-up', 'MQLs, SQLs, source quality, speed to lead'],
          ['Finance', 'Spend and efficiency', 'Budget pacing, margin, payback, forecast'],
          ['Product', 'Market and customer insight', 'Feature demand, objections, content engagement'],
        ],
      },
      { type: 'h2', text: 'Reporting checklist' },
      {
        type: 'ul',
        items: [
          'Start with goals and decisions, not metric dumps.',
          'Use consistent date ranges and comparison periods.',
          'Separate leading indicators from business outcomes.',
          'Call out data caveats such as tracking changes or delayed CRM updates.',
          'Show trend, benchmark, or target context for important metrics.',
          'End with recommended actions, owners, and due dates.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        title: 'Insight statement formula',
        code: `Observation
  Paid search CPA increased 22% week over week.

Context
  The increase came from nonbrand ad group B, where CPC rose and conversion rate fell on mobile.

Implication
  Budget efficiency is at risk, but branded and comparison campaigns remain stable.

Action
  Reduce ad group B budget by 20%, review search terms, and test a mobile-specific landing page variant.`,
      },
      {
        type: 'note',
        text: 'A report that only says what happened is incomplete. Stakeholders also need interpretation, recommendation, and confidence level.',
      },
      {
        type: 'tip',
        text: 'Keep a decision log beside recurring reports. It helps teams remember why budgets changed and whether past recommendations worked.',
      },
      {
        type: 'try',
        text: 'Create a one-page weekly report for a lead generation campaign. Include goal progress, channel table, one insight, one risk, and three next actions.',
      },
      {
        type: 'keypoints',
        items: [
          'Marketing reports should support decisions, not just display metrics.',
          'Different stakeholders need different levels of detail.',
          'Useful reports include context, caveats, interpretation, and actions.',
          'Consistent definitions and date ranges make trends trustworthy.',
        ],
      },
    ],
  },
  {
    slug: 'dm-campaign-ops',
    title: 'Campaign Operations & QA',
    description:
      'Run campaigns with operational discipline: briefs, naming conventions, approvals, tracking QA, launch checks, and post-launch monitoring.',
    level: 'intermediate',
    section: 'Delivery',
    order: 48,
    minutes: 16,
    content: [
      {
        type: 'p',
        text: 'Campaign operations is the system that turns marketing ideas into clean launches. It includes briefs, timelines, assets, approvals, tracking, QA, launch monitoring, reporting, and retrospectives.',
      },
      {
        type: 'p',
        text: 'Strong campaign ops prevents common failures: broken links, missing UTMs, wrong audiences, unapproved claims, bad budgets, duplicate emails, landing page mismatch, and reports that cannot connect results back to the plan.',
      },
      { type: 'h2', text: 'Campaign brief structure' },
      {
        type: 'code',
        language: 'markdown',
        title: 'Campaign brief template',
        code: `# Campaign Brief

## Goal
Generate 300 qualified demo requests in Q4.

## Audience
Operations leaders at B2B SaaS companies with 50-500 employees.

## Offer
Workflow audit plus product demo.

## Message
Find the manual handoffs slowing your team down.

## Channels
Google Search, LinkedIn Ads, email nurture, partner webinar.

## Assets
Landing page, search ads, LinkedIn creative, webinar page, email sequence.

## Tracking
UTM naming, GA4 events, ad conversions, CRM campaign, dashboard.

## Budget
$30,000 total with weekly pacing review.

## Approval
Marketing owner, sales owner, legal review for claims.

## Launch date
October 7, 2026`,
      },
      { type: 'h2', text: 'Naming convention example' },
      {
        type: 'code',
        language: 'text',
        title: 'Campaign naming system',
        code: `Campaign name
  region_channel_objective_audience_offer_period

Example
  us_linkedin_leadgen_opsleaders_workflowaudit_q4-2026

Ad name
  angle_format_version_date

Example
  manualhandoffs_video_v03_2026-10-01

UTM campaign
  q4_workflow_audit

Asset folder
  /campaigns/2026-q4-workflow-audit/`,
      },
      { type: 'h2', text: 'Pre-launch QA checklist' },
      {
        type: 'ul',
        items: [
          'Brief approved and goals documented.',
          'Audience, geography, language, exclusions, and frequency settings checked.',
          'Budgets, bids, flight dates, and pacing plan confirmed.',
          'Ad copy, creative, landing pages, forms, and emails approved.',
          'All links work on desktop and mobile.',
          'UTMs match the naming convention.',
          'GA4 events, ad platform conversions, pixels, and CRM campaign fields tested.',
          'Legal, brand, and compliance reviews completed where needed.',
          'Fallback owner assigned for launch day issues.',
        ],
      },
      { type: 'h2', text: 'Launch and post-launch rhythm' },
      {
        type: 'ol',
        items: [
          'Launch in a controlled window when owners are available.',
          'Check delivery, spend, disapprovals, links, and conversion events within the first few hours.',
          'Review early traffic quality and form submissions within 24 hours.',
          'Hold major optimization until enough data is collected unless something is clearly broken.',
          'Update stakeholders with launch status, early risks, and next review time.',
          'Run a retrospective after the campaign or first major phase.',
        ],
      },
      {
        type: 'code',
        language: 'json',
        title: 'Campaign QA record',
        code: `{
  "campaign": "q4_workflow_audit",
  "launch_owner": "Maya",
  "launch_date": "2026-10-07",
  "checks": {
    "landing_page_mobile": "pass",
    "utm_links": "pass",
    "ga4_debugview": "pass",
    "google_ads_conversion": "pass",
    "crm_campaign_assignment": "pass",
    "email_rendering": "pass",
    "legal_approval": "pass"
  },
  "open_risks": [
    "LinkedIn lead sync can take up to 30 minutes",
    "Partner webinar reminder email pending final speaker bio"
  ]
}`,
      },
      {
        type: 'note',
        text: 'Campaign QA should be documented. If a launch breaks, the team needs to know what was checked, who checked it, and what changed afterward.',
      },
      {
        type: 'tip',
        text: 'Create reusable checklists for repeated campaign types. The first checklist takes time, but every future launch becomes faster and safer.',
      },
      {
        type: 'try',
        text: 'Build a launch checklist for a multi-channel campaign with paid search, paid social, landing page, email, CRM routing, and reporting. Assign an owner to every check.',
      },
      {
        type: 'keypoints',
        items: [
          'Campaign operations turns strategy into reliable execution.',
          'Briefs, naming conventions, QA, and approvals prevent expensive mistakes.',
          'Launch monitoring should check delivery, tracking, spend, and lead quality early.',
          'Documented retrospectives improve the next campaign instead of repeating the same issues.',
        ],
      },
    ],
  },
];
