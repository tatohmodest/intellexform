'use client';

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import { PROGRAMS } from '@/lib/programs';

const BASE: string = typeof window !== 'undefined' ? window.location.origin : '';

const C = {
  navy: '#0A1628',
  navyMid: '#112240',
  navyLight: '#1a3356',
  green: '#0dbc66',
  greenDim: '#0a9450',
  white: '#FFFFFF',
  text: '#111827',
  textMid: '#374151',
  muted: '#6B7280',
  mutedLight: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  bg: '#FFFFFF',
  bgAlt: '#F8FAFC',
  bgCard: '#FAFBFC',
  greenPale: '#e6f9f0',
  greenPaleBorder: 'rgba(13,188,102,0.25)',
};

const ICON: Record<string, string> = {
  html: `${BASE}/icons/html5.png`,
  css: `${BASE}/icons/css3.png`,
  js: `${BASE}/icons/js.png`,
  react: `${BASE}/icons/react.png`,
  nextjs: `${BASE}/icons/nextjs.png`,
  node: `${BASE}/icons/nodejs.png`,
  express: `${BASE}/icons/express.png`,
  mongodb: `${BASE}/icons/mongodb.png`,
  postgres: `${BASE}/icons/postgres.png`,
  python: `${BASE}/icons/python.png`,
  django: `${BASE}/icons/django.png`,
  kali: `${BASE}/icons/kali.png`,
  linux: `${BASE}/icons/linux.png`,
  git: `${BASE}/icons/git.png`,
  redux: `${BASE}/icons/redux.png`,
  pandas: `${BASE}/icons/pandas.png`,
  numpy: `${BASE}/icons/numpy.png`,
  flutter: `${BASE}/icons/flutter.png`,
  reactNative: `${BASE}/icons/react-native.png`,
};

const TECH_ICON: Record<string, string> = {
  'HTML5': ICON.html,
  'CSS3': ICON.css,
  'JavaScript': ICON.js,
  'Basic JavaScript': ICON.js,
  'ES6+': ICON.js,
  'React': ICON.react,
  'Next.js': ICON.nextjs,
  'React Native': ICON.reactNative,
  'Node.js': ICON.node,
  'Express': ICON.express,
  'Express.js': ICON.express,
  'MongoDB': ICON.mongodb,
  'Mongoose': ICON.mongodb,
  'PostgreSQL': ICON.postgres,
  'Python': ICON.python,
  'Django': ICON.django,
  'Django REST Framework': ICON.django,
  'Git & GitHub': ICON.git,
  'Git basics': ICON.git,
  'Redux/Context': ICON.redux,
  'Pandas': ICON.pandas,
  'NumPy': ICON.numpy,
  'Kali Linux': ICON.kali,
  'Linux': ICON.linux,
  'Flutter': ICON.flutter,
};

const FULL = PROGRAMS.filter((p) => p.type === 'full');
const PARTIAL = PROGRAMS.filter((p) => p.type === 'partial');

const fmtXAF = (n: number) => `XAF ${new Intl.NumberFormat('fr-CM').format(n)}`;

// ─── Shared page layout ────────────────────────────────────────────────────────
const PAGE = {
  size: 'A4' as const,
  orientation: 'landscape' as const,
};

const s = StyleSheet.create({
  // ── Page shell ─────────────────────────────────────────────────────────────
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: C.bg,
    color: C.text,
    fontSize: 9,
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 14,
  },

  // ── Page header banner ─────────────────────────────────────────────────────
  header: {
    backgroundColor: C.navy,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleWrap: { flex: 1 },
  eye: {
    color: C.green,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.4,
    marginBottom: 3,
  },
  h1: {
    color: C.white,
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  sub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 8,
    maxWidth: 520,
    lineHeight: 1.45,
  },
  logo: { width: 32, height: 32, borderRadius: 6, marginLeft: 12 },

  // ── Section heading ─────────────────────────────────────────────────────────
  secHead: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.greenDim,
    letterSpacing: 1.1,
    marginBottom: 6,
    marginTop: 2,
  },

  // ── Metrics row (page 1) ────────────────────────────────────────────────────
  metricsRow: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 9,
  },
  metricCard: {
    flex: 1,
    backgroundColor: C.bgAlt,
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: C.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  metricVal: {
    fontSize: 16,
    color: C.navy,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1,
  },
  metricLbl: { fontSize: 7.5, color: C.muted },

  // ── Generic panel ───────────────────────────────────────────────────────────
  panel: {
    backgroundColor: C.bgAlt,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: C.border,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  panelTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: C.navy,
    marginBottom: 5,
    letterSpacing: 0.3,
  },
  bodyTxt: {
    fontSize: 8,
    color: C.textMid,
    lineHeight: 1.55,
    marginBottom: 3,
  },

  // ── Two-column wrapper ──────────────────────────────────────────────────────
  twoCol: { flexDirection: 'row', gap: 9, marginBottom: 9 },
  col: { flex: 1 },

  // ── Learning mode cards ─────────────────────────────────────────────────────
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  modeCard: {
    width: '49%',
    backgroundColor: C.white,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  modeTitle: {
    fontSize: 8,
    color: C.navy,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1,
  },
  modeTxt: { fontSize: 7.2, color: C.muted, lineHeight: 1.4 },

  // ── Bullet list ─────────────────────────────────────────────────────────────
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3 },
  bulletDot: {
    width: 11,
    color: C.greenDim,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    paddingTop: 0.5,
  },
  bulletTxt: { flex: 1, fontSize: 7.8, color: C.textMid, lineHeight: 1.45 },

  // ── Tech pills ──────────────────────────────────────────────────────────────
  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 3 },
  techPill: {
    backgroundColor: C.white,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  techIcon: { width: 9, height: 9, marginRight: 3 },
  techTxt: { fontSize: 6.5, color: C.muted },

  // ── Program card (detail pages) ─────────────────────────────────────────────
  progCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progCardAccent: { height: 3 },
  progCardBody: { paddingHorizontal: 9, paddingTop: 8, paddingBottom: 7 },
  progCardRow: { flexDirection: 'row', gap: 7 },
  progCardGrid2: { flexDirection: 'row', gap: 7, marginBottom: 7 },
  progCardGrid3: { flexDirection: 'row', gap: 7, marginBottom: 7 },
  progBadge: {
    alignSelf: 'flex-start',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginBottom: 4,
  },
  progBadgeTxt: { fontSize: 6, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
  progTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: C.navy,
    marginBottom: 1,
  },
  progMeta: { fontSize: 7, color: C.muted, marginBottom: 4 },
  progDesc: { fontSize: 7.5, color: C.textMid, lineHeight: 1.5, marginBottom: 5 },
  progSection: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: C.greenDim,
    letterSpacing: 0.8,
    marginBottom: 3,
    marginTop: 1,
  },
  progHighlightRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2 },
  progHighlightDot: { fontSize: 7, color: C.greenDim, width: 9, paddingTop: 0.5 },
  progHighlightTxt: { flex: 1, fontSize: 7, color: C.textMid, lineHeight: 1.4 },
  progPricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 0.5,
    borderTopColor: C.border,
  },
  progPriceTotal: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.navy },
  progPriceMonthly: { fontSize: 7.5, color: C.greenDim, fontFamily: 'Helvetica-Bold' },
  progDuration: { fontSize: 7, color: C.muted },

  // ── Pricing overview table ──────────────────────────────────────────────────
  table: {
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 7,
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: C.navyMid,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  th: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.7,
  },
  trow: {
    flexDirection: 'row',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderTopWidth: 0.5,
    borderTopColor: C.borderLight,
    alignItems: 'center',
  },
  trowAlt: { backgroundColor: C.bgAlt },
  tc1: { flex: 2.4 },
  tc2: { flex: 0.9, alignItems: 'center' },
  tc3: { flex: 1.1, alignItems: 'flex-end' },
  tc4: { flex: 1.1, alignItems: 'flex-end' },
  tTitleTxt: { fontSize: 7.8, color: C.navy, fontFamily: 'Helvetica-Bold', marginBottom: 0.5 },
  tSubTxt: { fontSize: 6.5, color: C.muted },
  td: { fontSize: 7.2, color: C.textMid },
  tdBold: { fontSize: 7.5, color: C.navy, fontFamily: 'Helvetica-Bold' },
  tdGreen: { fontSize: 7.5, color: C.greenDim, fontFamily: 'Helvetica-Bold' },

  // ── Payment & enrollment panels ─────────────────────────────────────────────
  payPanel: {
    backgroundColor: C.navy,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 7,
  },
  payTitle: {
    fontSize: 7.5,
    color: C.green,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    marginBottom: 5,
  },
  payTxt: { fontSize: 7.5, color: 'rgba(255,255,255,0.72)', marginBottom: 3, lineHeight: 1.4 },
  payStrong: { color: C.white, fontFamily: 'Helvetica-Bold' },

  stepsPanel: {
    backgroundColor: C.greenPale,
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: C.greenPaleBorder,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 7,
  },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  stepNum: {
    width: 14,
    color: C.greenDim,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    paddingTop: 0.5,
  },
  stepTxt: { flex: 1, fontSize: 7.5, color: C.textMid, lineHeight: 1.4 },

  contactPanel: {
    backgroundColor: C.bgAlt,
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: C.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    borderTopWidth: 0.5,
    borderTopColor: C.border,
    paddingTop: 5,
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  footLogo: { width: 11, height: 11, borderRadius: 2 },
  footTxt: { fontSize: 6.5, color: C.mutedLight },
  footNum: { fontSize: 6.5, color: C.mutedLight },
});

// ─── Sub-components ─────────────────────────────────────────────────────────────

const Footer = ({ page, total }: { page: number; total: number }) => (
  <View style={s.footer}>
    <View style={s.footerLeft}>
      <Image src={`${BASE}/logo.png`} style={s.footLogo} />
      <Text style={s.footTxt}>Intellex Program Guide 2026 · intellex.loopingbinary.com · intellexplatform@gmail.com</Text>
    </View>
    <Text style={s.footNum}>Page {page} of {total}</Text>
  </View>
);

const PageHeader = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) => (
  <View style={s.header}>
    <View style={s.headerTitleWrap}>
      <Text style={s.eye}>{eyebrow}</Text>
      <Text style={s.h1}>{title}</Text>
      <Text style={s.sub}>{subtitle}</Text>
    </View>
    <Image src={`${BASE}/logo.png`} style={s.logo} />
  </View>
);

const TechPills = ({ techs }: { techs: string[] }) => (
  <View style={s.techRow}>
    {techs.map((t) => (
      <View key={t} style={s.techPill}>
        {TECH_ICON[t] && <Image src={TECH_ICON[t]} style={s.techIcon} />}
        <Text style={s.techTxt}>{t}</Text>
      </View>
    ))}
  </View>
);

type ProgType = (typeof PROGRAMS)[number];

const ProgramCard = ({ p }: { p: ProgType }) => (
  <View style={s.progCard}>
    <View style={[s.progCardAccent, { backgroundColor: p.accentColor ?? C.green }]} />
    <View style={s.progCardBody}>
      {p.badge && (
        <View style={[s.progBadge, { backgroundColor: (p.accentColor ?? C.green) + '22' }]}>
          <Text style={[s.progBadgeTxt, { color: p.accentColor ?? C.green }]}>{p.badge.toUpperCase()}</Text>
        </View>
      )}
      <Text style={s.progTitle}>{p.emoji}  {p.title}</Text>
      <Text style={s.progMeta}>{p.duration} · {p.level}</Text>
      <Text style={s.progDesc}>{p.description}</Text>

      <Text style={s.progSection}>KEY OUTCOMES</Text>
      {p.highlights.map((h) => (
        <View key={h} style={s.progHighlightRow}>
          <Text style={s.progHighlightDot}>›</Text>
          <Text style={s.progHighlightTxt}>{h}</Text>
        </View>
      ))}

      <Text style={[s.progSection, { marginTop: 4 }]}>TECHNOLOGIES</Text>
      <TechPills techs={p.technologies} />

      <View style={s.progPricingRow}>
        <View>
          <Text style={s.progDuration}>Registration fee: {fmtXAF(p.registrationFee)}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.progPriceTotal}>{fmtXAF(p.priceXAF)}</Text>
          {p.monthlyXAF && (
            <Text style={s.progPriceMonthly}>{fmtXAF(p.monthlyXAF)}/mo</Text>
          )}
        </View>
      </View>
    </View>
  </View>
);

const MODES = [
  { title: 'Self-Paced', desc: 'Learn at your own speed with recorded lessons available 24/7. Great for flexible schedules.' },
  { title: 'Live Classes', desc: 'Scheduled real-time sessions with instructors. Live Q&A and interaction every session.' },
  { title: 'Mentorship', desc: 'Dedicated 1-on-1 guidance with a personal dev coach throughout your full program.' },
  { title: 'Priority Access', desc: 'Fast-track intensive with daily support, priority review, and direct instructor access.' },
];

const BENEFITS = [
  'Certificate of Completion for each finished program',
  'Project-based training with portfolio-ready deliverables',
  'Mentor feedback loops and practical code reviews',
  'Perplexity Pro AI-powered study and research workflows',
  'Access to Intellex community and collaboration channels',
  'Dedicated WhatsApp support group per program cohort',
];

const TOTAL_PAGES = 5;

// Split full programs: 4 on page 2, 3 on page 3, 3 on page 4
const FULL_P2 = FULL.slice(0, 4);
const FULL_P3 = FULL.slice(4, 7);
const FULL_P4 = FULL.slice(7);

export const CurriculumDocument = () => (
  <Document
    title="Intellex Program Guide 2026"
    author="Intellex"
    subject="Full landscape curriculum, program details, and pricing guide"
    keywords="Intellex, programs, mobile, web, data, cybersecurity, pricing, mentorship"
  >
    {/* ═══════════════════════════════════════════════════════════════════
        PAGE 1 — Introduction, About, Learning Modes, Benefits
    ════════════════════════════════════════════════════════════════════ */}
    <Page size={PAGE.size} orientation={PAGE.orientation} style={s.page}>
      <PageHeader
        eyebrow="INTELLEX PROGRAM GUIDE 2026"
        title="Your Path to Tech Mastery"
        subtitle="Practical, project-first training built for Cameroon — from zero to job-ready across web development, full stack mobile development, data, and cybersecurity."
      />

      {/* Metrics */}
      <View style={s.metricsRow}>
        {[
          { val: '600+', lbl: 'Learners since 2023' },
          { val: `${FULL.length}`, lbl: 'Full programs' },
          { val: `${PARTIAL.length}`, lbl: 'Module programs' },
          { val: '4', lbl: 'Learning modes' },
          { val: 'XAF 35K', lbl: 'Starting price' },
          { val: '24h', lbl: 'Activation time' },
        ].map((m) => (
          <View key={m.lbl} style={s.metricCard}>
            <Text style={s.metricVal}>{m.val}</Text>
            <Text style={s.metricLbl}>{m.lbl}</Text>
          </View>
        ))}
      </View>

      {/* About + Learning Modes */}
      <View style={s.twoCol}>
        <View style={[s.col, s.panel]}>
          <Text style={s.panelTitle}>ABOUT INTELLEX</Text>
          <Text style={s.bodyTxt}>
            Intellex started as a WhatsApp learning community in October 2023 and has grown into a structured
            online training platform designed for Cameroonian learners and beyond. We are not just another
            coding school — we pair modern curriculum with real mentorship, community, and accountability.
          </Text>
          <Text style={s.bodyTxt}>
            Every program focuses on shipping real projects, not just watching lectures. From your first
            registration you gain platform access, early-access positioning, and onboarding readiness.
            Full enrollment unlocks project reviews, certificate eligibility, mentor coaching, and
            lifelong access to the Intellex community.
          </Text>
          <Text style={s.bodyTxt}>
            Registration fee activates your slot. Program fee covers the full training, mentorship, materials,
            and certification. Monthly installments available for all full programs.
          </Text>
        </View>

        <View style={[s.col, s.panel]}>
          <Text style={s.panelTitle}>LEARNING MODES</Text>
          <View style={s.modeGrid}>
            {MODES.map((m) => (
              <View key={m.title} style={s.modeCard}>
                <Text style={s.modeTitle}>{m.title}</Text>
                <Text style={s.modeTxt}>{m.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Benefits + Tech coverage */}
      <View style={s.panel}>
        <Text style={s.panelTitle}>WHAT EVERY ENROLLMENT INCLUDES</Text>
        <View style={s.twoCol}>
          {[BENEFITS.slice(0, 3), BENEFITS.slice(3)].map((col, ci) => (
            <View key={ci} style={{ flex: 1 }}>
              {col.map((b) => (
                <View key={b} style={s.bulletRow}>
                  <Text style={s.bulletDot}>✓</Text>
                  <Text style={s.bulletTxt}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <Text style={[s.secHead, { marginTop: 4 }]}>TECHNOLOGIES COVERED ACROSS ALL PROGRAMS</Text>
        <TechPills techs={['HTML5','CSS3','JavaScript','React','Next.js','Node.js','Express','MongoDB','PostgreSQL','Python','Django','Pandas','NumPy','Git & GitHub','Redux/Context','Flutter','React Native','Kali Linux','Linux']} />
      </View>

      <Footer page={1} total={TOTAL_PAGES} />
    </Page>

    {/* ═══════════════════════════════════════════════════════════════════
        PAGE 2 — Full Programs 1–4
    ════════════════════════════════════════════════════════════════════ */}
    <Page size={PAGE.size} orientation={PAGE.orientation} style={s.page}>
      <PageHeader
        eyebrow="FULL PROGRAMS — PAGE 1 OF 3"
        title="Structured Career Programs"
        subtitle="Each full program includes live projects, milestone reviews, certificate of completion, and mentorship support. Monthly payment plans available."
      />

      <View style={[s.progCardGrid2, { flex: 1 }]}>
        {FULL_P2.map((p) => (
          <ProgramCard key={p.id} p={p} />
        ))}
      </View>

      <Footer page={2} total={TOTAL_PAGES} />
    </Page>

    {/* ═══════════════════════════════════════════════════════════════════
        PAGE 3 — Full Programs 5–7
    ════════════════════════════════════════════════════════════════════ */}
    <Page size={PAGE.size} orientation={PAGE.orientation} style={s.page}>
      <PageHeader
        eyebrow="FULL PROGRAMS — PAGE 2 OF 3"
        title="Specialized & Advanced Programs"
        subtitle="Deep-dive programs for learners who want to go further — Python, JavaScript mastery, web development, and data careers."
      />

      <View style={[s.progCardGrid3, { flex: 1 }]}>
        {FULL_P3.map((p) => (
          <ProgramCard key={p.id} p={p} />
        ))}
      </View>

      <Footer page={3} total={TOTAL_PAGES} />
    </Page>

    {/* ═══════════════════════════════════════════════════════════════════
        PAGE 4 — Full Programs 8–10 (Cybersecurity + Mobile)
    ════════════════════════════════════════════════════════════════════ */}
    <Page size={PAGE.size} orientation={PAGE.orientation} style={s.page}>
      <PageHeader
        eyebrow="FULL PROGRAMS — PAGE 3 OF 3"
        title="Security, Mobile & Certification Tracks"
        subtitle="Cybersecurity fundamentals, CEH exam preparation, and full stack mobile development with Flutter and React Native."
      />

      <View style={[s.progCardGrid3, { flex: 1 }]}>
        {FULL_P4.map((p) => (
          <ProgramCard key={p.id} p={p} />
        ))}
      </View>

      <Footer page={4} total={TOTAL_PAGES} />
    </Page>

    {/* ═══════════════════════════════════════════════════════════════════
        PAGE 5 — Module Programs + Pricing Summary + Enrollment
    ════════════════════════════════════════════════════════════════════ */}
    <Page size={PAGE.size} orientation={PAGE.orientation} style={s.page}>
      <PageHeader
        eyebrow="MODULES · PRICING · ENROLLMENT"
        title="Quick-Start Modules & How to Enroll"
        subtitle="Standalone skill modules for focused learning, full pricing overview, payment methods, and step-by-step enrollment guide."
      />

      {/* Three-column layout: Module cards | Pricing table | Enrollment */}
      <View style={{ flexDirection: 'row', gap: 10, flex: 1 }}>

        {/* Column 1: Module program cards */}
        <View style={{ flex: 1.2 }}>
          <Text style={s.secHead}>MODULE PROGRAMS</Text>
          <View style={{ gap: 6 }}>
            {PARTIAL.map((p) => (
              <View key={p.id} style={[s.panel, { borderLeftWidth: 3, borderLeftColor: p.accentColor ?? C.green }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Text style={[s.panelTitle, { marginBottom: 0 }]}>{p.emoji}  {p.shortTitle}</Text>
                  <Text style={{ fontSize: 7, color: C.muted }}>{p.duration} · {p.level}</Text>
                </View>
                <Text style={s.bodyTxt}>{p.description}</Text>
                <TechPills techs={p.technologies} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                  <Text style={{ fontSize: 7, color: C.muted }}>Reg. fee: {fmtXAF(p.registrationFee)}</Text>
                  <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.navy }}>{fmtXAF(p.priceXAF)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Column 2: Pricing summary tables */}
        <View style={{ flex: 1.3 }}>
          <Text style={s.secHead}>FULL PROGRAMS — PRICING OVERVIEW</Text>
          <View style={s.table}>
            <View style={s.tableHead}>
              <View style={s.tc1}><Text style={s.th}>PROGRAM</Text></View>
              <View style={s.tc2}><Text style={s.th}>DURATION</Text></View>
              <View style={s.tc3}><Text style={s.th}>TOTAL PRICE</Text></View>
              <View style={s.tc4}><Text style={s.th}>MONTHLY</Text></View>
            </View>
            {FULL.map((p, i) => (
              <View key={p.id} style={[s.trow, i % 2 ? s.trowAlt : {}]}>
                <View style={s.tc1}>
                  <Text style={s.tTitleTxt}>{p.shortTitle}</Text>
                  <Text style={s.tSubTxt}>{p.level}</Text>
                </View>
                <View style={s.tc2}><Text style={s.td}>{p.duration}</Text></View>
                <View style={s.tc3}><Text style={s.tdBold}>{fmtXAF(p.priceXAF)}</Text></View>
                <View style={s.tc4}>
                  <Text style={s.tdGreen}>{p.monthlyXAF ? `${fmtXAF(p.monthlyXAF)}/mo` : '—'}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={[s.secHead, { marginTop: 4 }]}>MODULE PROGRAMS — PRICING OVERVIEW</Text>
          <View style={s.table}>
            <View style={s.tableHead}>
              <View style={s.tc1}><Text style={s.th}>MODULE</Text></View>
              <View style={s.tc2}><Text style={s.th}>DURATION</Text></View>
              <View style={s.tc3}><Text style={s.th}>TOTAL PRICE</Text></View>
              <View style={s.tc4}><Text style={s.th}>REG. FEE</Text></View>
            </View>
            {PARTIAL.map((p, i) => (
              <View key={p.id} style={[s.trow, i % 2 ? s.trowAlt : {}]}>
                <View style={s.tc1}>
                  <Text style={s.tTitleTxt}>{p.shortTitle}</Text>
                  <Text style={s.tSubTxt}>{p.level}</Text>
                </View>
                <View style={s.tc2}><Text style={s.td}>{p.duration}</Text></View>
                <View style={s.tc3}><Text style={s.tdBold}>{fmtXAF(p.priceXAF)}</Text></View>
                <View style={s.tc4}><Text style={s.tdGreen}>{fmtXAF(p.registrationFee)}</Text></View>
              </View>
            ))}
          </View>
        </View>

        {/* Column 3: Payment + enrollment steps + contact */}
        <View style={{ flex: 0.9 }}>
          <Text style={s.secHead}>PAYMENT METHODS</Text>
          <View style={s.payPanel}>
            <Text style={s.payTitle}>MOBILE MONEY</Text>
            <Text style={s.payTxt}>
              MTN MoMo: <Text style={s.payStrong}>674 435 138</Text>{'\n'}MODESTE TATOH
            </Text>
            <Text style={[s.payTxt, { marginTop: 3 }]}>
              Orange Money: <Text style={s.payStrong}>686 705 607</Text>{'\n'}MODESTE TATOH
            </Text>
            <Text style={[s.payTxt, { marginTop: 5, fontSize: 7 }]}>
              After payment, send your screenshot to WhatsApp{' '}
              <Text style={s.payStrong}>+237 650 318 856</Text> with your full name and program.
            </Text>
          </View>

          <Text style={s.secHead}>HOW TO ENROLL</Text>
          <View style={s.stepsPanel}>
            {[
              'Go to intellex.loopingbinary.com and click Register.',
              'Fill in your details and choose your program.',
              'Download your personalized invoice from the form.',
              'Transfer the registration fee via MTN or Orange Money.',
              'Send payment screenshot to WhatsApp: +237 650 318 856.',
              'Receive account activation within 24 hours.',
            ].map((step, i) => (
              <View key={step} style={s.stepRow}>
                <Text style={s.stepNum}>0{i + 1}</Text>
                <Text style={s.stepTxt}>{step}</Text>
              </View>
            ))}
          </View>

          <View style={s.contactPanel}>
            <Text style={s.panelTitle}>CONTACT & SUPPORT</Text>
            <Text style={s.bodyTxt}>🌐  intellex.loopingbinary.com</Text>
            <Text style={s.bodyTxt}>📧  intellexplatform@gmail.com</Text>
            <Text style={s.bodyTxt}>💬  WhatsApp: +237 650 318 856</Text>
            <Text style={s.bodyTxt}>📍  Cameroon — Online nationwide</Text>
          </View>
        </View>

      </View>

      <Footer page={5} total={TOTAL_PAGES} />
    </Page>
  </Document>
);
