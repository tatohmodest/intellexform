import { PLATFORM_CONTACT } from '@/lib/contact';
import { translateUiText } from '@/lib/i18n/translate';
import type { Locale } from '@/lib/i18n/locale';
import { PROGRAMMES, dailyXaf, priceNumber, type Programme } from '@/lib/programmes';
import { STUDENT_MONTHLY_XAF } from '@/lib/learn/studentMembership';

/**
 * Public "Chat with AI" orientation advisor.
 *
 * Its job is the one a good admissions counsellor does: understand the person first (how they
 * feel, what they like, where they are starting, what they want the skill to do for them), then
 * recommend one clear path at InTelleX, handle doubts honestly, and end with a next step.
 * With OPENAI_API_KEY set it runs on an LLM with the playbook below; without it, the
 * rule-based engine further down follows the same playbook across the whole conversation.
 */

export type OrientationMessage = { role: 'user' | 'assistant'; content: string };

function programmeLine(p: Programme) {
  const monthly = p.monthlyXAF ? `, or ${priceNumber(p.monthlyXAF)} XAF/month (about ${priceNumber(dailyXaf(p.monthlyXAF))} a day)` : '';
  return `- ${p.title} [${p.categoryLabel}] - ${p.duration}, ${p.level}, ${priceNumber(p.priceXAF)} XAF${monthly}, registration ${priceNumber(p.registrationFee)} XAF. Covers: ${p.technologies.slice(0, 8).join(', ')}. Link: /programmes/${p.id}`;
}

export function orientationSystemPrompt(locale: Locale = 'en') {
  const language =
    locale === 'fr'
      ? 'Reply in French (the visitor browses InTelleX in French). Translate programme titles naturally but keep links unchanged. If the visitor clearly writes in English, reply in English.'
      : 'Reply in English unless the visitor writes in French, then reply in French. Match their register: if they write casually or with typos, stay simple and warm, never correct them.';
  return `You are the InTelleX advisor: the friendly admissions counsellor on the InTelleX website. You talk like a smart older sibling who works in tech, not like a brochure. Many visitors are young Cameroonians who feel lost, broke, behind or unsure they are smart enough. Your job is to make them feel understood, give them a clear path, and show them that InTelleX is the place that will walk that path with them.

ABOUT INTELLEX (use this to sell, in your own words)
- An online teaching school by Looping Binary (Douala, Cameroon). Line: "Tutorials show you how. We make sure you can."
- Programmes are taught live by InTelleX-approved instructors: live classes at set times, a cohort, real projects that an instructor reviews line by line, an AI tutor for questions between classes, and a certificate when the programme and its projects are completed.
- Why not just YouTube: the information is free, but nobody decides what you learn next, nobody checks your work and nobody notices when you stop. That is what InTelleX provides.
- Pay in full or monthly with MTN MoMo, Orange Money or card. Foundations programmes (4-6 weeks) are the low-cost way to start. A self-paced library membership is ${priceNumber(STUDENT_MONTHLY_XAF)} XAF/month for people who only want materials.
- Visitors can talk to a real person before paying: WhatsApp ${PLATFORM_CONTACT.phoneDisplay}.

HOW YOU HAVE THE CONVERSATION
1. Feelings first. If they say they are confused, lost, stressed, broke or afraid, acknowledge it in one human sentence before anything else ("That's a really normal place to be, and it's fixable.").
2. Understand before recommending. If you do not know enough, ask at most TWO short questions, for example: what they enjoy (building things, numbers and patterns, solving puzzles and protecting systems, or people and content), where they are starting from, and what they want the skill to do (a job, freelancing, their own business). If they already told you enough, skip the questions and recommend.
3. Reflect back what you heard in one line, so they feel listened to ("So you're starting from zero, you like building things, and you want a job you can grow in.").
4. Recommend ONE main path and at most one alternative, by exact programme title with its markdown link, e.g. [Full Stack Web Development](/programmes/fullstack). Say why it fits THEM. For complete beginners who are unsure, suggest starting with a Foundations programme.
5. Paint the picture: what their first weeks would actually look like at InTelleX (live class, first small project, instructor feedback).
6. Handle doubts honestly:
   - Price: frame it as an investment in an income skill; show the monthly price and the rough daily cost; mention Foundations and the library as smaller first steps.
   - "Am I smart enough / too old / I failed before": reassure with substance; programmes start from the basics and an instructor checks their progress.
   - Time: classes are at set times; the team confirms a schedule that fits before they pay.
   - No laptop: be honest that a laptop or desktop is needed for programmes; suggest getting access to one first.
   - Trust: they can talk to a person on WhatsApp before paying anything.
7. Always end with ONE clear next step or one question that moves them forward (open the programme page, ask what the first month looks like, or WhatsApp the team for the next start date). Make it feel like InTelleX will be with them the whole way.

HONESTY (never break these)
- Do not invent statistics, salaries, job guarantees, placement rates or student numbers. You may say skills are widely hired, including remotely and as freelancers. If asked for exact salaries, explain they depend on country, level, portfolio and employer, and what raises pay.
- Recommend only programmes from the list below. If unsure about dates or details, send them to WhatsApp ${PLATFORM_CONTACT.phoneDisplay}.
- Stay on learning, careers, technology and InTelleX; gently steer back if they drift.

STYLE
- Short: usually 60-140 words. Short paragraphs, light bullets only when listing options. No walls of text, no corporate tone, no emojis spam (one at most).
- ${language}

INTELLEX PROGRAMMES
${PROGRAMMES.map(programmeLine).join('\n')}`;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Rule-based engine (no LLM): builds a small profile from the whole conversation
 * and answers like the counsellor above would.
 * ──────────────────────────────────────────────────────────────────────────── */

type Path = 'software' | 'data' | 'security' | 'marketing' | 'mobile';
type Goal = 'job' | 'freelance' | 'business';

type Profile = {
  path?: Path;
  level?: 'zero' | 'some';
  goal?: Goal;
  wantsMoney: boolean;
  /** Assistant turns so far; we only run discovery once before recommending anyway. */
  turns: number;
  askedDiscovery: boolean;
};

const has = (text: string, words: string[]) =>
  words.some((w) => new RegExp(`(^|[^a-zà-ÿ])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(text));

const PATH_WORDS: Record<Path, string[]> = {
  software: ['web', 'website', 'site', 'frontend', 'front-end', 'backend', 'react', 'javascript', 'full stack', 'fullstack', 'developer', 'développeur', 'programm', 'coding', 'code', 'build', 'construire', 'software', 'logiciel', 'python', 'django', 'node'],
  data: ['data', 'donnée', 'donnee', 'analyst', 'analyste', 'analys', 'excel', 'power bi', 'sql', 'statistic', 'statistique', 'number', 'chiffre', 'pattern', 'machine learning', 'ai ', ' ia ', 'intelligence artificielle'],
  security: ['security', 'sécurité', 'securite', 'cyber', 'hack', 'ceh', 'network', 'réseau', 'reseau', 'protect', 'protéger', 'puzzle', 'ethical'],
  marketing: ['marketing', 'social media', 'réseaux sociaux', 'reseaux sociaux', 'seo', 'ads', 'publicité', 'content', 'contenu', 'brand', 'marque', 'community', 'influenc', 'people', 'gens', 'persuad', 'creative', 'créati', 'design'],
  mobile: ['mobile', 'android', 'ios', 'flutter', 'react native', 'app', 'application'],
};

const PICKS: Record<Path, { zero: string[]; some: string[] }> = {
  software: { zero: ['webfundamentals', 'fullstack'], some: ['fullstack', 'mern'] },
  data: { zero: ['python-basics', 'data-analysis'], some: ['data-analysis', 'data-science'] },
  security: { zero: ['cybersecurity'], some: ['cybersecurity', 'cybersecurity-ceh'] },
  marketing: { zero: ['digital-marketing'], some: ['digital-marketing'] },
  mobile: { zero: ['webfundamentals', 'flutter-mobile-design'], some: ['flutter-mobile-design', 'react-native-mobile-design'] },
};

const PATH_COPY: Record<Path, { label: [string, string]; why: [string, string] }> = {
  software: {
    label: ['building websites and apps', 'la création de sites et d’applications'],
    why: [
      'Every business needs a website or web app, so people who can build them are hired by companies, startups and clients abroad, and many work remotely or freelance.',
      'Chaque entreprise a besoin d’un site ou d’une application web : ceux qui savent les construire sont recrutés par des entreprises, des startups et des clients à l’étranger, souvent à distance ou en freelance.',
    ],
  },
  data: {
    label: ['working with data', 'les données'],
    why: [
      'Banks, telecoms, NGOs and startups all need people who can turn messy numbers into decisions, and it is one of the most transferable skills you can learn.',
      'Banques, télécoms, ONG et startups ont toutes besoin de personnes capables de transformer des chiffres en décisions : c’est l’une des compétences les plus transférables.',
    ],
  },
  security: {
    label: ['cybersecurity', 'la cybersécurité'],
    why: [
      'As everything moves online, organisations need people who can protect their systems, and certification prep makes your skills easy to prove to an employer.',
      'Tout passe en ligne : les organisations ont besoin de personnes capables de protéger leurs systèmes, et la préparation à la certification rend vos compétences faciles à prouver.',
    ],
  },
  marketing: {
    label: ['digital marketing', 'le marketing digital'],
    why: [
      'Every business needs customers online, so people who can run social media, SEO and ads that bring real results are always in demand, including as freelancers.',
      'Chaque entreprise a besoin de clients en ligne : ceux qui savent gérer réseaux sociaux, SEO et publicités avec de vrais résultats sont toujours recherchés, y compris en freelance.',
    ],
  },
  mobile: {
    label: ['building mobile apps', 'la création d’applications mobiles'],
    why: [
      'Most people in Africa use the internet through their phone, so developers who can build mobile apps are in steady demand.',
      'En Afrique, la plupart des gens utilisent Internet via leur téléphone : les développeurs d’applications mobiles sont donc très demandés.',
    ],
  },
};

function detectPath(text: string): Path | undefined {
  const t = ` ${text.toLowerCase()} `;
  // Answers to the discovery question ("1", "number 2", "the third one").
  const pick = /(^|\s)(1|one|first|premier|un)(\s|$|[.,!)])/.test(t)
    ? 'software'
    : /(^|\s)(2|two|second|deux|deuxième)(\s|$|[.,!)])/.test(t)
      ? 'data'
      : /(^|\s)(3|three|third|trois|troisième)(\s|$|[.,!)])/.test(t)
        ? 'security'
        : /(^|\s)(4|four|fourth|quatre|quatrième)(\s|$|[.,!)])/.test(t)
          ? 'marketing'
          : undefined;
  // A reply that leads with the option number ("2, never coded") answers the question.
  if (pick && (t.trim().length <= 14 || /^\s*[1-4]\b/.test(t))) return pick;
  // Mobile before software: "app" alone is too generic, so require a mobile-specific word.
  if (has(t, ['mobile', 'android', 'ios', 'flutter', 'react native'])) return 'mobile';
  for (const p of ['security', 'data', 'marketing', 'software'] as Path[]) {
    if (has(t, PATH_WORDS[p])) return p;
  }
  // Number words inside a longer sentence ("je veux un métier") are not answers.
  return undefined;
}

function buildProfile(messages: OrientationMessage[]): Profile {
  const profile: Profile = { wantsMoney: false, turns: 0, askedDiscovery: false };
  for (const m of messages) {
    if (m.role === 'assistant') {
      profile.turns += 1;
      if (/sounds most like you|vous ressemble le plus/i.test(m.content)) profile.askedDiscovery = true;
      continue;
    }
    const t = m.content.toLowerCase();
    profile.path = detectPath(t) || profile.path;
    if (has(t, ['zero', 'zéro', 'beginner', 'débutant', 'debutant', 'never', 'jamais', 'nothing', 'rien', 'no experience', 'from scratch', 'new to'])) profile.level = 'zero';
    if (has(t, ['some experience', 'a bit', 'un peu', 'tutorial', 'tried', 'déjà', 'already', 'html', 'i know', 'je connais', 'student in', 'étudiant en'])) profile.level = profile.level || 'some';
    if (has(t, ['freelanc', 'client', 'side hustle'])) profile.goal = 'freelance';
    else if (has(t, ['business', 'entreprise', 'my own', 'startup', 'mon propre'])) profile.goal = 'business';
    else if (has(t, ['job', 'emploi', 'travail', 'work', 'career', 'carrière', 'hired', 'employ'])) profile.goal = profile.goal || 'job';
    if (has(t, ['money', 'argent', 'income', 'revenu', 'salary', 'salaire', 'pay well', 'bien pay', 'rich', 'high income', 'high-income', 'rentable'])) profile.wantsMoney = true;
  }
  return profile;
}

const L = (fr: boolean, en: string, frText: string) => (fr ? frText : en);

function programmeBullet(p: Programme, fr: boolean, tr: (s: string) => string) {
  const monthly = p.monthlyXAF
    ? L(fr, ` or ${priceNumber(p.monthlyXAF)} XAF/month (about ${priceNumber(dailyXaf(p.monthlyXAF))} a day)`, ` ou ${priceNumber(p.monthlyXAF)} XAF/mois (environ ${priceNumber(dailyXaf(p.monthlyXAF))} par jour)`)
    : '';
  return `- **[${tr(p.title)}](/programmes/${p.id})** · ${tr(p.duration)} · ${priceNumber(p.priceXAF)} XAF${monthly}`;
}

/** Rule-based answer used when no LLM is configured or the LLM call fails. */
export function fallbackOrientationAnswer(messages: OrientationMessage[], locale: Locale = 'en'): string {
  const fr = locale === 'fr';
  const tr = (s: string) => translateUiText(s, locale);
  const last = ([...messages].reverse().find((m) => m.role === 'user')?.content || '').toLowerCase();
  const profile = buildProfile(messages);
  const wa = L(fr, `WhatsApp us on ${PLATFORM_CONTACT.phoneDisplay}`, `écrivez-nous sur WhatsApp au ${PLATFORM_CONTACT.phoneDisplay}`);
  const waInf = L(fr, `WhatsApp us on ${PLATFORM_CONTACT.phoneDisplay}`, `nous écrire sur WhatsApp au ${PLATFORM_CONTACT.phoneDisplay}`);
  const lastPath = detectPath(last);

  const confused = has(last, ['confus', 'comfus', 'lost', 'perdu', "don't know", 'dont know', 'do not know', 'idk', 'not sure', 'unsure', 'je ne sais pas', 'sais pas', 'help me', 'aide', 'stuck', 'bloqué', 'what to do', 'quoi faire', 'stress', 'worried', 'inquiet', 'hopeless', 'tired of']);
  const doubt = has(last, ['smart enough', 'not smart', 'too old', 'trop vieux', 'trop âgé', 'too late', 'trop tard', 'failed', 'échoué', 'bad at math', 'nul en math', 'can i really', 'can i learn', 'est-ce que je peux', 'afraid', 'peur', 'hard for me', 'difficile pour moi']);
  const price = has(last, ['expensive', 'cher', 'afford', 'dont have money', 'do not have money', 'have no money', 'not enough money', 'no cash', 'how much', 'combien', 'cost', 'coût', 'price', 'prix', 'money for', 'no money', "don't have money", 'pas d’argent', "pas d'argent", 'broke', 'fauché', 'cheap', 'budget', 'payment', 'paiement', 'installment', 'tranche']);
  const time = has(last, ['busy', 'occupé', 'work during', 'during the day', 'full time', 'full-time', 'after work', 'at night', 'job already', 'je travaille', 'la journée', 'can i still', 'no time', 'pas le temps', 'work full', 'school', 'école', 'university', 'université', 'schedule', 'horaire', 'weekend', 'evening', 'soir', 'how many hours', 'combien d’heures']);
  const laptop = has(last, ['laptop', 'computer', 'ordinateur', 'pc', 'phone only', 'only a phone', 'only have a phone', 'only my phone', 'just a phone', 'just my phone', 'que mon téléphone', 'que un téléphone', 'smartphone', 'téléphone seulement']);
  const trust = has(last, ['scam', 'arnaque', 'legit', 'real?', 'trust', 'confiance', 'fake', 'sérieux', 'serious']);
  const greeting = /^(hi|hello|hey|hy|bonjour|bonsoir|salut|good (morning|afternoon|evening)|yo)\b[!. ]*$/i.test(last.trim());
  const thanks = has(last, ['thank', 'merci', 'thx', 'ok thanks', 'bye', 'au revoir']);

  const close = L(
    fr,
    `You don't have to figure this out alone. That's exactly what InTelleX is for.`,
    `Vous n’avez pas à trouver la voie tout seul : c’est exactement le rôle d’InTelleX.`,
  );

  if (greeting) {
    return L(
      fr,
      `Hey, welcome to InTelleX! I'm here to help you figure out your next step in tech, whether you're starting from zero or trying to level up.\n\nWhat's on your mind right now? Tell me a bit about where you are and what you'd love to be doing.`,
      `Bonjour et bienvenue chez InTelleX ! Je suis là pour vous aider à trouver votre prochaine étape dans la tech, que vous partiez de zéro ou que vous vouliez progresser.\n\nQu’est-ce qui vous préoccupe en ce moment ? Dites-m’en un peu sur votre situation et ce que vous aimeriez faire.`,
    );
  }

  if (thanks && !confused && !lastPath) {
    return L(
      fr,
      `Anytime! When you're ready, the easiest next step is to ${wa} and tell the team what we discussed. They'll confirm the next start date and a class schedule that fits you before you pay anything.\n\nRooting for you. 💚`,
      `Avec plaisir ! Quand vous serez prêt, le plus simple est de ${waInf} et de résumer notre échange : l’équipe vous confirmera la prochaine rentrée et un horaire adapté avant tout paiement.\n\nJe vous souhaite plein de réussite. 💚`,
    );
  }

  const lastBot = [...messages].reverse().find((m) => m.role === 'assistant')?.content || '';
  const offeredFirstMonth = /first month looks like|décrive le premier mois/i.test(lastBot);
  const wantsFirstMonth =
    has(last, ['first month', 'premier mois', 'explain', 'explique', 'tell me more', 'dis-m', 'dites-m']) ||
    (offeredFirstMonth && /^(yes|yeah|yep|ok|okay|sure|please|oui|d'accord|ouais|go on|vas-y)\b/i.test(last.trim()));
  if (wantsFirstMonth && profile.path) {
    const p = PROGRAMMES.find((x) => x.id === PICKS[profile.path as Path][profile.level || 'zero'][0]);
    const name = p ? `[${tr(p.title)}](/programmes/${p.id})` : L(fr, 'your programme', 'votre programme');
    return L(
      fr,
      `Here's roughly what your first month in ${name} looks like:

- **Before you start**: a quick chat with the team to confirm your class times and that the level fits you.
- **Week 1**: your first live class with your instructor and cohort. You set up your tools and build something tiny the same week.
- **Weeks 2-3**: new concepts every class, with exercises in your dashboard and the AI tutor for questions between sessions.
- **Week 4**: your first small project, reviewed by your instructor with clear notes on what to fix.

By the end of month one you've built something real and you know exactly what to improve next. Ready to grab a spot? ${wa} and they'll confirm the next start date.`,
      `Voici à peu près votre premier mois dans ${name} :

- **Avant de commencer** : un échange rapide avec l’équipe pour confirmer vos horaires et le bon niveau.
- **Semaine 1** : premier cours en direct avec votre formateur et votre promotion. Vous installez vos outils et construisez déjà quelque chose.
- **Semaines 2-3** : de nouvelles notions à chaque cours, des exercices dans votre espace et le tuteur IA entre les séances.
- **Semaine 4** : votre premier petit projet, corrigé par votre formateur avec des remarques claires.

À la fin du premier mois, vous avez construit quelque chose de concret. Prêt à réserver votre place ? ${wa} pour connaître la prochaine rentrée.`,
    );
  }

  if (trust) {
    return L(
      fr,
      `Fair question, and you should ask it before paying anyone. InTelleX is run by Looping Binary in Douala. Every price is on the [pricing page](/pricing), and you can talk to a real person first: ${wa}. They'll explain the programme, introduce the schedule and answer anything before you pay a franc.\n\nWhat would make you feel confident: seeing the full syllabus, or speaking to the team?`,
      `Bonne question, à poser avant de payer qui que ce soit. InTelleX est géré par Looping Binary à Douala. Tous les prix sont sur la [page tarifs](/pricing), et vous pouvez parler à une vraie personne d’abord : ${wa}. L’équipe vous explique le programme et l’horaire avant tout paiement.\n\nQu’est-ce qui vous rassurerait le plus : voir le programme complet ou parler à l’équipe ?`,
    );
  }

  if (price) {
    const foundationsFrom = Math.min(...PROGRAMMES.filter((p) => p.short).map((p) => p.priceXAF));
    const careerMonthly = Math.min(...PROGRAMMES.filter((p) => !p.short && p.monthlyXAF).map((p) => p.monthlyXAF as number));
    return L(
      fr,
      `I get it, money is real and every franc matters. A few honest options:\n\n- **Pay monthly**: career programmes start from ${priceNumber(careerMonthly)} XAF/month with MoMo or Orange Money, so you're not paying everything at once.\n- **Start smaller**: Foundations programmes are 4-6 weeks from ${priceNumber(foundationsFrom)} XAF, a low-risk way to see if tech is for you.\n- **Learn on your own first**: the self-paced library is ${priceNumber(STUDENT_MONTHLY_XAF)} XAF/month.\n\nThe difference with a programme is an instructor checking your work until you can actually do it, and that's what turns a skill into income.\n\nWhich of those fits your budget right now? See everything on the [pricing page](/pricing).`,
      `Je comprends, l’argent compte et chaque franc aussi. Quelques options honnêtes :\n\n- **Payer par mois** : les programmes métier commencent à ${priceNumber(careerMonthly)} XAF/mois via MoMo ou Orange Money.\n- **Commencer petit** : les programmes Fondamentaux durent 4 à 6 semaines, dès ${priceNumber(foundationsFrom)} XAF, pour tester sans grand risque.\n- **Apprendre seul d’abord** : la bibliothèque en autonomie coûte ${priceNumber(STUDENT_MONTHLY_XAF)} XAF/mois.\n\nLa différence avec un programme, c’est un formateur qui vérifie votre travail jusqu’à ce que vous sachiez vraiment le faire.\n\nLaquelle de ces options correspond à votre budget ? Tout est sur la [page tarifs](/pricing).`,
    );
  }

  if (laptop) {
    return L(
      fr,
      `Honest answer: for a programme you'll need a laptop or desktop (Windows, Mac or Linux) and a stable internet connection for live classes. A phone is great for the AI tutor and reading, but you can't build real projects on it.\n\nIf you can borrow or share one a few hours a week, that's enough to start. Do you have access to one, even part-time?`,
      `Réponse honnête : pour un programme, il faut un ordinateur (Windows, Mac ou Linux) et une connexion stable pour les cours en direct. Le téléphone suffit pour le tuteur IA et la lecture, mais pas pour construire de vrais projets.\n\nSi vous pouvez en emprunter un quelques heures par semaine, c’est suffisant pour commencer. Avez-vous accès à un ordinateur, même à temps partiel ?`,
    );
  }

  if (time) {
    return L(
      fr,
      `Plenty of people learn alongside school or work. Live classes happen at set times, and the team confirms a schedule that fits you before you pay. Between classes, materials and the AI tutor are there whenever you have time.\n\nHow many hours a week could you realistically give it? That helps me point you to the right length of programme.`,
      `Beaucoup de gens apprennent en parallèle de l’école ou du travail. Les cours en direct ont lieu à heures fixes, et l’équipe vous confirme un horaire adapté avant tout paiement.\n\nCombien d’heures par semaine pourriez-vous y consacrer ? Cela m’aide à vous orienter vers la bonne durée.`,
    );
  }

  if (doubt && !lastPath) {
    return L(
      fr,
      `I hear you, and almost everyone who starts in tech feels exactly like this. Here's the truth: you don't need to be a genius, you need a clear path and someone who checks your work. That's how InTelleX programmes are built: we start from the basics, you build small things first, and an instructor tells you exactly what to fix.\n\nTo point you in the right direction, which of these sounds most like you?\n1. Building websites and apps\n2. Numbers, patterns and figuring things out\n3. Solving puzzles and protecting systems\n4. People, content and persuading`,
      `Je vous comprends, et presque tout le monde ressent ça en débutant dans la tech. La vérité : pas besoin d’être un génie, il faut un chemin clair et quelqu’un qui vérifie votre travail. C’est comme ça que sont conçus les programmes InTelleX.\n\nPour vous orienter, laquelle de ces options vous ressemble le plus ?\n1. Créer des sites et des applications\n2. Les chiffres et l’analyse\n3. Résoudre des énigmes et protéger des systèmes\n4. Les gens, le contenu et la persuasion`,
    );
  }

  const path = lastPath || profile.path;

  // Not enough to recommend yet: acknowledge, then discover (once).
  if (!path && !profile.askedDiscovery) {
    const opener = confused
      ? L(
          fr,
          `First, breathe. Feeling confused about what to study is really normal, and the fact you're asking means you're already moving. Let's figure it out together.`,
          `D’abord, respirez. Se sentir perdu sur quoi étudier est vraiment normal, et le fait de demander montre que vous avancez déjà. Trouvons ensemble.`,
        )
      : profile.wantsMoney
        ? L(
            fr,
            `Love that you're thinking about income. Tech is one of the best places to build a skill that pays, but the right path depends on you, not on whatever is trending.`,
            `Bonne idée de penser au revenu. La tech est l’un des meilleurs domaines pour une compétence qui rapporte, mais le bon chemin dépend de vous, pas des tendances.`,
          )
        : L(fr, `Happy to help you find your path.`, `Avec plaisir, trouvons votre voie.`);
    return L(
      fr,
      `${opener}\n\nQuick question: which of these sounds most like you?\n1. I like **building things** people can use (websites, apps)\n2. I like **numbers and patterns**, figuring out what's really going on\n3. I like **solving puzzles** and protecting things\n4. I like **people and content**: social media, persuading, creating\n\nAnd are you starting from zero, or have you tried a bit already? Just reply with a number and a word or two.`,
      `${opener}\n\nPetite question : laquelle de ces options vous ressemble le plus ?\n1. J’aime **construire** des choses utiles (sites, applications)\n2. J’aime **les chiffres** et comprendre ce qui se passe vraiment\n3. J’aime **résoudre des énigmes** et protéger des systèmes\n4. J’aime **les gens et le contenu** : réseaux sociaux, persuasion, création\n\nEt partez-vous de zéro ou avez-vous déjà un peu essayé ? Répondez simplement avec un chiffre et un ou deux mots.`,
    );
  }

  // Still no path after asking: recommend the most open door and offer a human.
  const chosen: Path = path || 'software';
  const level = profile.level || 'zero';
  const picks = PICKS[chosen][level]
    .map((id) => PROGRAMMES.find((p) => p.id === id))
    .filter((p): p is Programme => Boolean(p));
  const copy = PATH_COPY[chosen];
  const levelText =
    level === 'zero'
      ? L(fr, 'starting from zero', 'en partant de zéro')
      : L(fr, 'with a bit of experience already', 'avec déjà un peu d’expérience');
  const goalText = profile.goal
    ? L(
        fr,
        { job: ', aiming for a job', freelance: ', aiming to freelance', business: ', aiming to build your own thing' }[profile.goal],
        { job: ', avec un emploi en vue', freelance: ', pour travailler en freelance', business: ', pour lancer votre propre projet' }[profile.goal],
      )
    : '';
  const reflect = path
    ? L(fr, `Got it: you're into ${copy.label[0]}, ${levelText}${goalText}.`, `Compris : vous êtes attiré par ${copy.label[1]}, ${levelText}${goalText}.`)
    : L(
        fr,
        `No stress if you're not sure yet. For most beginners the most open door is ${copy.label[0]}, because it leads to jobs, freelancing and your own projects.`,
        `Pas de souci si vous n’êtes pas encore sûr. Pour la plupart des débutants, la porte la plus ouverte est ${copy.label[1]}, car elle mène à l’emploi, au freelance et à vos propres projets.`,
      );
  const firstWeeks = L(
    fr,
    `At InTelleX you'd learn this live with an instructor and a small cohort: in your first weeks you build something small, your instructor reviews it and tells you exactly what to fix, and the AI tutor helps with the 11pm questions. You finish with real projects you can show and a certificate.`,
    `Chez InTelleX, vous apprenez en direct avec un formateur et une petite promotion : dès les premières semaines vous construisez quelque chose, votre formateur le corrige et vous dit quoi améliorer, et le tuteur IA vous aide le soir. Vous finissez avec de vrais projets à montrer et un certificat.`,
  );
  const startHint =
    level === 'zero' && picks.length > 1
      ? L(fr, `My suggestion: start with the first one to build confidence, then move into the second.`, `Ma suggestion : commencez par le premier pour prendre confiance, puis passez au second.`)
      : '';
  return [
    reflect,
    copy.why[fr ? 1 : 0],
    `${L(fr, 'Where I would start you:', 'Par où je vous ferais commencer :')}\n${picks.map((p) => programmeBullet(p, fr, tr)).join('\n')}${startHint ? `\n\n${startHint}` : ''}`,
    firstWeeks,
    `${close} ${L(fr, `Want me to explain what the first month looks like, or would you rather ${wa} to get the next start date?`, `Voulez-vous que je vous décrive le premier mois, ou préférez-vous ${waInf} pour connaître la prochaine rentrée ?`)}`,
  ].join('\n\n');
}

export async function orientationStream(
  messages: OrientationMessage[],
  locale: Locale = 'en',
): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch(`${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      stream: true,
      temperature: 0.7,
      max_tokens: 600,
      messages: [{ role: 'system', content: orientationSystemPrompt(locale) }, ...messages.slice(-12)],
    }),
  });
  if (!res.ok || !res.body) {
    const err = await res.text().catch(() => '');
    throw new Error(`Orientation LLM failed (${res.status}): ${err.slice(0, 200)}`);
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const reader = res.body.getReader();
  let buffer = '';
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') continue;
        try {
          const token = JSON.parse(data).choices?.[0]?.delta?.content;
          if (token) controller.enqueue(encoder.encode(token));
        } catch {
          // ignore keep-alives
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}
