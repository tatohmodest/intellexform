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

// react-pdf's web worker requires absolute URLs — relative paths like /icons/x.png
// do not resolve inside the worker. We compute the origin at module-load time;
// this module is only ever loaded client-side (ssr: false in the parent import).
const BASE: string = typeof window !== 'undefined' ? window.location.origin : '';

// ── Brand Colors ──────────────────────────────────────────────────────
const C = {
  navy:       '#0A1628',
  navyMid:    '#112240',
  navyLight:  '#1C3461',
  green:      '#0dbc66',
  greenDim:   '#0a8f4f',
  greenPale:  '#e6f9f0',
  white:      '#FFFFFF',
  offWhite:   '#F8FAFC',
  text:       '#111827',
  textMid:    '#374151',
  muted:      '#6B7280',
  mutedLight: '#9CA3AF',
  border:     '#E5E7EB',
  borderDark: '#D1D5DB',
  bg:         '#FFFFFF',
  bgAlt:      '#F9FAFB',
  amber:      '#F59E0B',
  blue:       '#3B82F6',
  purple:     '#6D28D9',
  red:        '#DC2626',
};

// ── Tech logos — served from /public/icons/ to avoid external rate-limits ──
const ICON: Record<string, string> = {
  html:     `${BASE}/icons/html5.png`,
  css:      `${BASE}/icons/css3.png`,
  js:       `${BASE}/icons/js.png`,
  react:    `${BASE}/icons/react.png`,
  node:     `${BASE}/icons/nodejs.png`,
  express:  `${BASE}/icons/express.png`,
  mongodb:  `${BASE}/icons/mongodb.png`,
  postgres: `${BASE}/icons/postgres.png`,
  python:   `${BASE}/icons/python.png`,
  django:   `${BASE}/icons/django.png`,
  kali:     `${BASE}/icons/kali.png`,
  linux:    `${BASE}/icons/linux.png`,
  git:      `${BASE}/icons/git.png`,
  redux:    `${BASE}/icons/redux.png`,
  pandas:   `${BASE}/icons/pandas.png`,
  numpy:    `${BASE}/icons/numpy.png`,
};

// Maps technology display names → icon image URLs (used in program card tech pills)
const TECH_ICON: Record<string, string> = {
  'HTML5':                  ICON.html,
  'CSS3':                   ICON.css,
  'JavaScript':             ICON.js,
  'Basic JavaScript':       ICON.js,
  'ES6+':                   ICON.js,
  'React':                  ICON.react,
  'Node.js':                ICON.node,
  'Express':                ICON.express,
  'Express.js':             ICON.express,
  'MongoDB':                ICON.mongodb,
  'Mongoose':               ICON.mongodb,
  'PostgreSQL':             ICON.postgres,
  'Python':                 ICON.python,
  'Django':                 ICON.django,
  'Django REST Framework':  ICON.django,
  'Git & GitHub':           ICON.git,
  'Git basics':             ICON.git,
  'Redux/Context':          ICON.redux,
  'Pandas':                 ICON.pandas,
  'NumPy':                  ICON.numpy,
  'Kali Linux':             ICON.kali,
  'Linux':                  ICON.linux,
};

const PROG_ACCENT: Record<string, string> = {
  fullstack:          '#3B82F6',
  mern:               '#38BDF8',
  pern:               '#336791',
  'data-analysis':    '#F59E0B',
  django:             '#0dbc66',
  python:             '#3776AB',
  javascript:         '#F59E0B',
  cybersecurity:      '#6D28D9',
  'cybersecurity-ceh':'#DC2626',
  webfundamentals:    '#E34F26',
  htmlcss:            '#1572B6',
  jsessentials:       '#F7DF1E',
  'react-basics':     '#38BDF8',
  'python-basics':    '#3776AB',
};

// Cover tech icons (PNG sources that @react-pdf can render)
const COVER_ICONS = [ICON.html, ICON.css, ICON.js, ICON.react, ICON.node, ICON.python, ICON.django, ICON.postgres];

type P = typeof PROGRAMS[0];

const fmtXAF = (n: number) => `XAF ${new Intl.NumberFormat('fr-CM').format(n)}`;
const FULL    = PROGRAMS.filter(p => p.type === 'full');
const PARTIAL = PROGRAMS.filter(p => p.type === 'partial');

// ── StyleSheet ─────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page:      { backgroundColor: C.bg, fontFamily: 'Helvetica', color: C.text, fontSize: 10 },
  coverPage: { backgroundColor: C.navy, fontFamily: 'Helvetica' },

  // Cover
  coverTopBar:   { height: 5, backgroundColor: C.green },
  coverSideBar:  { position: 'absolute', top: 0, left: 0, bottom: 0, width: 6, backgroundColor: C.green },
  coverInner:    { flex: 1, paddingLeft: 60, paddingRight: 44, paddingTop: 52, paddingBottom: 36, justifyContent: 'space-between' },
  coverPill:     { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  coverPillDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: C.green, marginRight: 10 },
  coverPillTxt:  { fontSize: 9, color: C.green, letterSpacing: 2.5, fontFamily: 'Helvetica-Bold' },
  coverIconRow:  { flexDirection: 'row', gap: 8, marginBottom: 28 },
  coverIconWrap: { width: 38, height: 38, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', padding: 5, alignItems: 'center', justifyContent: 'center' },
  coverIconImg:  { width: 28, height: 28 },
  coverH1:       { fontSize: 46, fontFamily: 'Helvetica-Bold', color: C.white, lineHeight: 1.09, marginBottom: 20, maxWidth: 400 },
  coverAccent:   { color: C.green },
  coverRule:     { width: 52, height: 3, backgroundColor: C.green, borderRadius: 2, marginBottom: 16 },
  coverSub:      { fontSize: 11.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.72, maxWidth: 360, marginBottom: 32 },
  coverStats:    { flexDirection: 'row', gap: 0, marginBottom: 4 },
  coverStatItem: { alignItems: 'center', paddingHorizontal: 18 },
  coverStatDiv:  { width: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginVertical: 4 },
  coverStatVal:  { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.white, marginBottom: 3, lineHeight: 1 },
  coverStatLbl:  { fontSize: 7.5, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.2, textAlign: 'center' },
  coverFoot:     { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coverFootLogo: { width: 28, height: 28, borderRadius: 6 },
  coverFootMeta: { fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 },

  // TOC layout
  tocWrap:      { flexDirection: 'row', minHeight: '100%' },
  tocSide:      { width: 176, backgroundColor: C.navyMid, padding: '46 22 46 30', justifyContent: 'space-between' },
  tocSideTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.green, letterSpacing: 2, marginBottom: 28 },
  tocSideStat:  { marginBottom: 20 },
  tocSideVal:   { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.white, lineHeight: 1.1, marginBottom: 3 },
  tocSideLbl:   { fontSize: 7.5, color: 'rgba(255,255,255,0.38)', lineHeight: 1.4 },
  tocQuote:     { borderLeftWidth: 2, borderLeftColor: C.green, paddingLeft: 10, marginTop: 16 },
  tocQuoteTxt:  { fontSize: 8.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, fontStyle: 'italic' },
  tocMain:      { flex: 1, padding: '46 38 46 34' },
  tocEye:       { fontSize: 8, color: C.green, letterSpacing: 2.5, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  tocTitle:     { fontSize: 28, fontFamily: 'Helvetica-Bold', color: C.navy, marginBottom: 22 },
  tocRule:      { height: 0.5, backgroundColor: C.border, marginBottom: 16 },
  tocItem:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: C.border },
  tocNum:       { width: 28, height: 28, borderRadius: 14, backgroundColor: C.navyMid, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  tocNumTxt:    { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.white },
  tocLabelWrap: { flex: 1 },
  tocLabel:     { fontSize: 11, color: C.text, fontFamily: 'Helvetica-Bold' },
  tocSub:       { fontSize: 8.5, color: C.muted, marginTop: 1 },
  tocDots:      { flex: 1, borderBottomWidth: 1, borderBottomColor: C.border, borderStyle: 'dashed', marginHorizontal: 8, marginBottom: 2 },
  tocPageNum:   { fontSize: 8.5, color: C.muted },
  tocNote:      { marginTop: 22, backgroundColor: C.greenPale, borderRadius: 8, padding: 13, borderWidth: 0.5, borderColor: 'rgba(13,188,102,0.2)' },
  tocNoteTit:   { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.greenDim, marginBottom: 4 },
  tocNoteTxt:   { fontSize: 8.5, color: C.textMid, lineHeight: 1.6 },

  // Section header banner
  secBanner:    { backgroundColor: C.navyMid, padding: '26 38 22 38', position: 'relative', overflow: 'hidden' },
  secBannerBar: { position: 'absolute', top: 0, left: 0, bottom: 0, width: 5, backgroundColor: C.green },
  secBannerNum: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: C.green, letterSpacing: 2.5, marginBottom: 7 },
  secBannerH2:  { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.white, marginBottom: 5 },
  secBannerSub: { fontSize: 9.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, maxWidth: 450 },

  // Page body
  body:    { padding: '24 38 24 38', flex: 1 },
  bodyTxt: { fontSize: 9.5, color: C.muted, lineHeight: 1.72, marginBottom: 14 },

  // Page footer
  pFoot:     { position: 'absolute', bottom: 18, left: 38, right: 38, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 0.5, borderTopColor: C.border, paddingTop: 7 },
  pFootLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  pFootLogo: { width: 14, height: 14, borderRadius: 3 },
  pFootTxt:  { fontSize: 7.5, color: C.mutedLight },
  pFootNum:  { fontSize: 7.5, color: C.mutedLight },

  // About
  storyCard:     { backgroundColor: C.navy, borderRadius: 10, padding: 22, marginBottom: 14, position: 'relative', overflow: 'hidden' },
  storyGlow:     { position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(13,188,102,0.07)' },
  storyH3:       { fontSize: 15, fontFamily: 'Helvetica-Bold', color: C.white, marginBottom: 9, lineHeight: 1.3 },
  storyTxt:      { fontSize: 9.5, color: 'rgba(255,255,255,0.58)', lineHeight: 1.75, marginBottom: 7 },
  statsRow:      { flexDirection: 'row', gap: 7, marginTop: 14 },
  statBox:       { flex: 1, backgroundColor: 'rgba(13,188,102,0.12)', borderRadius: 7, borderWidth: 1, borderColor: 'rgba(13,188,102,0.2)', padding: 11, alignItems: 'center' },
  statVal:       { fontSize: 20, fontFamily: 'Helvetica-Bold', color: C.green, marginBottom: 3, lineHeight: 1 },
  statLbl:       { fontSize: 7.5, color: 'rgba(255,255,255,0.42)', textAlign: 'center', letterSpacing: 0.4, lineHeight: 1.4 },

  // Registration benefits  
  regPill:       { backgroundColor: C.greenPale, borderRadius: 6, padding: '9 13', borderWidth: 0.5, borderColor: 'rgba(13,188,102,0.2)', flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 7 },
  regPillDot:    { width: 16, height: 16, borderRadius: 8, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  regPillDotTxt: { fontSize: 7.5, color: C.white, fontFamily: 'Helvetica-Bold' },
  regPillTxt:    { flex: 1, fontSize: 9, color: C.textMid, lineHeight: 1.5 },

  // Enrollment benefits (upon enrolling in a program)
  benefitGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 4 },
  benefitCard:   { width: '48.8%', backgroundColor: C.offWhite, borderRadius: 8, padding: 11, borderWidth: 0.5, borderColor: C.border, flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  benefitDot:    { width: 18, height: 18, borderRadius: 9, backgroundColor: C.greenPale, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  benefitDotTxt: { fontSize: 8, color: C.greenDim, fontFamily: 'Helvetica-Bold' },
  benefitTxt:    { flex: 1, fontSize: 9, color: C.textMid, lineHeight: 1.55 },
  sectionLbl:    { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.green, letterSpacing: 2, marginBottom: 10, marginTop: 14 },

  // Learning modes
  modeCard:      { backgroundColor: C.offWhite, borderRadius: 10, padding: 0, marginBottom: 9, borderWidth: 0.5, borderColor: C.border, flexDirection: 'row', alignItems: 'stretch', overflow: 'hidden' },
  modeBar:       { width: 4 },
  modeIcon:      { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 14, marginTop: 14, marginRight: 14, flexShrink: 0 },
  modeIconTxt:   { fontSize: 13, fontFamily: 'Helvetica-Bold' },
  modeBody:      { flex: 1, paddingTop: 12, paddingRight: 16, paddingBottom: 12 },
  modeTitle:     { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.navy, marginBottom: 4 },
  modeDesc:      { fontSize: 9.5, color: C.muted, lineHeight: 1.65, marginBottom: 8 },
  modeBadge:     { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  modeBadgeTxt:  { fontSize: 7.5, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
  modeCallout:   { borderRadius: 8, padding: 13, borderWidth: 0.5, flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 10 },
  modeCallIcon:  { fontSize: 14, lineHeight: 1.4, marginTop: 1 },
  modeCallBody:  { flex: 1 },
  modeCallTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  modeCallTxt:   { fontSize: 9, lineHeight: 1.6 },

  // Program card
  progCard:      { backgroundColor: C.bg, borderRadius: 10, marginBottom: 12, borderWidth: 0.5, borderColor: C.border, overflow: 'hidden' },
  progAccentBar: { height: 4 },
  progHeader:    { padding: '13 16 11 16', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: C.border },
  progTitle:     { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.navy, marginBottom: 3 },
  progMeta:      { fontSize: 8.5, color: C.muted, letterSpacing: 0.3 },
  progBadge:     { borderRadius: 4, paddingHorizontal: 9, paddingVertical: 4 },
  progBadgeTxt:  { fontSize: 7.5, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
  progBody:      { padding: '11 16 0 16' },
  progDesc:      { fontSize: 9.5, color: C.muted, lineHeight: 1.65, marginBottom: 9 },
  techRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 9 },
  techPill:      { backgroundColor: C.bgAlt, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2.5, borderWidth: 0.5, borderColor: C.borderDark, flexDirection: 'row', alignItems: 'center' },
  techPillTxt:   { fontSize: 7.5, color: C.muted },
  techIconImg:   { width: 13, height: 13, marginRight: 3 },
  hlRow:         { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  hlBullet:      { fontSize: 8, color: C.green, marginRight: 6, marginTop: 1 },
  hlTxt:         { flex: 1, fontSize: 9, color: C.textMid, lineHeight: 1.55 },
  progFoot:      { padding: '9 16 11 16', borderTopWidth: 0.5, borderTopColor: C.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9, backgroundColor: C.bgAlt },
  priceLbl:      { fontSize: 7.5, color: C.muted, marginBottom: 2, letterSpacing: 0.3 },
  priceVal:      { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.navy },
  priceGreen:    { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.green },

  // Module grid
  modGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  modCard:       { width: '47.8%', backgroundColor: C.bg, borderRadius: 9, borderWidth: 0.5, borderColor: C.border, overflow: 'hidden' },
  modTop:        { padding: '12 13 9 13' },
  modHdr:        { flexDirection: 'row', alignItems: 'center', marginBottom: 7, gap: 7 },
  modTitle:      { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: C.navy, flex: 1 },
  modMeta:       { fontSize: 8, color: C.muted, marginBottom: 5 },
  modDesc:       { fontSize: 8.5, color: C.muted, lineHeight: 1.55, marginBottom: 7 },
  modPills:      { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  modPill:       { backgroundColor: C.bgAlt, borderRadius: 3, paddingHorizontal: 5, paddingVertical: 1.5, borderWidth: 0.5, borderColor: C.border },
  modPillTxt:    { fontSize: 7, color: C.muted },
  modFoot:       { padding: '8 13', borderTopWidth: 0.5, borderTopColor: C.border, backgroundColor: C.bgAlt, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modPrice:      { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.navy },
  modReg:        { fontSize: 7.5, color: C.green, fontFamily: 'Helvetica-Bold' },

  // Pricing table
  table:         { borderRadius: 9, overflow: 'hidden', borderWidth: 0.5, borderColor: C.border },
  tableHead:     { flexDirection: 'row', backgroundColor: C.navyMid, padding: '9 15' },
  tableHeadTxt:  { fontSize: 8, fontFamily: 'Helvetica-Bold', color: 'rgba(255,255,255,0.58)', letterSpacing: 0.9 },
  tableGroupRow: { flexDirection: 'row', backgroundColor: C.bgAlt, padding: '8 15' },
  tableGroupTxt: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5 },
  tableRow:      { flexDirection: 'row', padding: '10 15', borderTopWidth: 0.5, borderTopColor: C.border, alignItems: 'center' },
  tableRowAlt:   { backgroundColor: C.offWhite },
  tc1:           { flex: 2.4 },
  tc2:           { flex: 1, alignItems: 'center' },
  tc3:           { flex: 1, alignItems: 'center' },
  tc4:           { flex: 1.2, alignItems: 'flex-end' },
  ttitle:        { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.navy, marginBottom: 1 },
  tsub:          { fontSize: 7.5, color: C.muted },
  td:            { fontSize: 9.5, color: C.muted },
  tdBold:        { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.navy },
  tdGreen:       { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: C.green },
  tdSub:         { fontSize: 7.5, color: C.muted },
  payRow:        { flexDirection: 'row', gap: 10, marginTop: 14 },
  payCard:       { flex: 1, backgroundColor: C.offWhite, borderRadius: 9, padding: 13, borderWidth: 0.5, borderColor: C.border },
  payDot:        { width: 8, height: 8, borderRadius: 4, marginBottom: 6 },
  payLogo:       { width: 44, height: 30, borderRadius: 5, marginBottom: 8, resizeMode: 'contain' },
  payLbl:        { fontSize: 7.5, color: C.muted, fontFamily: 'Helvetica-Bold', letterSpacing: 0.6, marginBottom: 4 },
  payNum:        { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.navy, marginBottom: 1 },
  payHolder:     { fontSize: 8, color: C.muted },
  payInstr:      { flex: 1.3, backgroundColor: C.navy, borderRadius: 9, padding: 13, justifyContent: 'center' },
  payInstrLbl:   { fontSize: 7.5, color: 'rgba(255,255,255,0.38)', fontFamily: 'Helvetica-Bold', letterSpacing: 0.6, marginBottom: 5 },
  payInstrTxt:   { fontSize: 9, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 },
  payInstrHL:    { fontFamily: 'Helvetica-Bold', color: C.white },

  // Steps
  stepWrap:      { position: 'relative', marginBottom: 9 },
  stepRow:       { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  stepCircle:    { width: 34, height: 34, borderRadius: 17, backgroundColor: C.navyMid, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNum:       { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.green },
  stepConnLine:  { position: 'absolute', left: 16, top: 34, width: 2, height: 10, backgroundColor: C.border },
  stepCard:      { flex: 1, backgroundColor: C.offWhite, borderRadius: 8, padding: '11 13', borderWidth: 0.5, borderColor: C.border },
  stepTitle:     { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.navy, marginBottom: 4 },
  stepDesc:      { fontSize: 9.5, color: C.muted, lineHeight: 1.65 },
  ctaCard:       { backgroundColor: C.navyMid, borderRadius: 11, padding: 22, marginTop: 14, position: 'relative', overflow: 'hidden' },
  ctaGlow:       { position: 'absolute', bottom: -24, right: -24, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(13,188,102,0.08)' },
  ctaTitle:      { fontSize: 15, fontFamily: 'Helvetica-Bold', color: C.white, marginBottom: 7 },
  ctaTxt:        { fontSize: 9.5, color: 'rgba(255,255,255,0.58)', lineHeight: 1.7, marginBottom: 14 },
  ctaGrid:       { flexDirection: 'row', gap: 9, flexWrap: 'wrap' },
  ctaItem:       { flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 7, padding: '10 13', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)', minWidth: 120 },
  ctaItemLbl:    { fontSize: 7.5, color: 'rgba(255,255,255,0.38)', letterSpacing: 1, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  ctaItemVal:    { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.white, marginBottom: 2 },
  ctaItemSub:    { fontSize: 7.5, color: C.green },
});

// ── Page footer ────────────────────────────────────────────────────────
const Footer = ({ n }: { n: number }) => (
  <View style={s.pFoot}>
    <View style={s.pFootLeft}>
      <Image src={`${BASE}/logo.png`} style={s.pFootLogo} />
      <Text style={s.pFootTxt}>Intellex · Program Guide 2026 · intellex.loopingbinary.com</Text>
    </View>
    <Text style={s.pFootNum}>{n}</Text>
  </View>
);

// ── Full Program Card ──────────────────────────────────────────────────
const ProgCard = ({ p }: { p: P }) => {
  const accent = PROG_ACCENT[p.id] || C.green;
  return (
    <View style={s.progCard}>
      <View style={[s.progAccentBar, { backgroundColor: accent }]} />
      <View style={s.progHeader}>
        <View style={{ flex: 1 }}>
          <Text style={s.progTitle}>{p.title}</Text>
          <Text style={s.progMeta}>{p.duration}  ·  {p.level}</Text>
        </View>
        <View style={[s.progBadge, { backgroundColor: p.badge ? C.greenPale : C.bgAlt }]}>
          <Text style={[s.progBadgeTxt, { color: p.badge ? C.greenDim : C.muted }]}>
            {p.badge ? p.badge.toUpperCase() : (p.type === 'full' ? 'FULL PROGRAM' : 'MODULE')}
          </Text>
        </View>
      </View>
      <View style={s.progBody}>
        <Text style={s.progDesc}>{p.description}</Text>
        <View style={s.techRow}>
          {p.technologies.map(t => (
            <View key={t} style={s.techPill}>
              {TECH_ICON[t] && <Image src={TECH_ICON[t]} style={s.techIconImg} />}
              <Text style={s.techPillTxt}>{t}</Text>
            </View>
          ))}
        </View>
        {p.highlights.map(h => (
          <View key={h} style={s.hlRow}>
            <Text style={s.hlBullet}>✓</Text>
            <Text style={s.hlTxt}>{h}</Text>
          </View>
        ))}
      </View>
      <View style={s.progFoot}>
        <View>
          <Text style={s.priceLbl}>TOTAL PROGRAM</Text>
          <Text style={s.priceVal}>{fmtXAF(p.priceXAF)}</Text>
        </View>
        {p.monthlyXAF && (
          <View>
            <Text style={s.priceLbl}>MONTHLY OPTION</Text>
            <Text style={s.priceGreen}>{fmtXAF(p.monthlyXAF)}/month</Text>
          </View>
        )}
        <View>
          <Text style={s.priceLbl}>REGISTRATION FEE</Text>
          <Text style={[s.priceVal, { color: C.greenDim, fontSize: 10 }]}>{fmtXAF(p.registrationFee)}</Text>
        </View>
      </View>
    </View>
  );
};

// ── Modes ──────────────────────────────────────────────────────────────
const MODES = [
  { title: 'Self-Paced Learning',  icon: 'SP', color: C.blue,   badge: 'MOST FLEXIBLE',   badgeBg: '#EFF6FF', badgeTxt: '#1D4ED8', desc: 'Access all recordings, notes, and project materials anytime. Early morning, late night, weekends — you set the pace. Perfect for people with jobs, family, or irregular schedules.' },
  { title: 'Live Classes',         icon: 'LC', color: C.green,  badge: 'REAL-TIME',        badgeBg: C.greenPale, badgeTxt: C.greenDim, desc: 'Scheduled sessions with instructors via video call. Ask questions as they happen, get instant feedback, and enjoy a real classroom atmosphere from home. Every session is recorded.' },
  { title: 'Mentorship Program',   icon: 'M',  color: C.amber,  badge: 'HIGHEST SUPPORT',  badgeBg: '#FFFBEB', badgeTxt: '#92400E', desc: 'Dedicated 1-on-1 guidance throughout your journey. Your mentor reviews your code, guides your projects, and pushes you personally. The most hands-on experience we offer.' },
  { title: 'Priority Access',      icon: 'PA', color: C.purple, badge: 'FAST TRACK',       badgeBg: '#F5F3FF', badgeTxt: '#6D28D9', desc: 'Daily support, direct instructor access, priority code reviews, accelerated curriculum. For those who want to go from zero to job-ready as fast as humanly possible.' },
];

// ── Document ───────────────────────────────────────────────────────────
export const CurriculumDocument = () => (
  <Document
    title="Intellex Program Guide 2026"
    author="Intellex"
    subject="Official curriculum and enrollment guide"
    keywords="Intellex, Cameroon, coding, cybersecurity, web development, mentorship"
  >

    {/* ── PAGE 1 · COVER ──────────────────────────────────────────── */}
    <Page size="A4" style={s.coverPage}>
      <View style={s.coverTopBar} />
      <View style={{ flex: 1, position: 'relative' }}>
        <View style={s.coverSideBar} />
        <View style={s.coverInner}>

          <View style={s.coverPill}>
            <View style={s.coverPillDot} />
            <Text style={s.coverPillTxt}>INTELLEX · OFFICIAL PROGRAM GUIDE · 2026</Text>
          </View>

          {/* Tech logos row */}
          <View style={s.coverIconRow}>
            {COVER_ICONS.map((url, i) => (
              <View key={i} style={s.coverIconWrap}>
                <Image src={url} style={s.coverIconImg} />
              </View>
            ))}
          </View>

          <Text style={s.coverH1}>
            Become the{'\n'}
            developer{'\n'}
            <Text style={s.coverAccent}>you were meant{'\n'}to be.</Text>
          </Text>

          <View style={s.coverRule} />

          <Text style={s.coverSub}>
            Intellex is Cameroon's most intensive online tech education platform — self-paced courses, live
            classes, 1-on-1 mentorship, and AI assistance — built to turn you from curious to genuinely capable.
          </Text>

          <View style={s.coverStats}>
            {[
              { v: '600+', l: 'LEARNERS' },
              { v: '13', l: 'PROGRAMS' },
              { v: '4', l: 'MODES' },
              { v: '2023', l: 'FOUNDED' },
            ].map((st, i) => (
              <View key={st.l} style={{ flexDirection: 'row', alignItems: 'center' }}>
                {i > 0 && <View style={s.coverStatDiv} />}
                <View style={s.coverStatItem}>
                  <Text style={s.coverStatVal}>{st.v}</Text>
                  <Text style={s.coverStatLbl}>{st.l}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ flex: 1 }} />

          <View style={s.coverFoot}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Image src={`${BASE}/logo.png`} style={s.coverFootLogo} />
              <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.white }}>Intellex</Text>
            </View>
            <Text style={s.coverFootMeta}>EARLY ACCESS EDITION · CAMEROON · ONLINE ONLY</Text>
          </View>

        </View>
      </View>
    </Page>

    {/* ── PAGE 2 · TABLE OF CONTENTS ──────────────────────────────── */}
    <Page size="A4" style={[s.page, { padding: 0 }]}>
      <View style={s.tocWrap}>
        <View style={s.tocSide}>
          <View>
            <Text style={s.tocSideTitle}>CONTENTS</Text>
            {[
              { v: '600+', l: 'Active learners\nsince 2023' },
              { v: '8',    l: 'Full development\nprograms' },
              { v: '5',    l: 'Focused skill\nmodules' },
              { v: '4',    l: 'Learning modes\nto choose from' },
            ].map(st => (
              <View key={st.v} style={s.tocSideStat}>
                <Text style={s.tocSideVal}>{st.v}</Text>
                <Text style={s.tocSideLbl}>{st.l}</Text>
              </View>
            ))}
          </View>
          <View style={s.tocQuote}>
            <Text style={s.tocQuoteTxt}>"Not just learning — becoming capable. That is the Intellex standard."</Text>
          </View>
        </View>

        <View style={s.tocMain}>
          <Text style={s.tocEye}>TABLE OF CONTENTS</Text>
          <Text style={s.tocTitle}>What's inside</Text>
          <View style={s.tocRule} />
          {[
            { n: '01', label: 'About Intellex',      sub: 'Our story, what registration gives you, and program benefits',  pg: '3' },
            { n: '02', label: 'Learning Modes',      sub: 'Self-paced, live, mentorship & priority access',                 pg: '4' },
            { n: '03', label: 'Web Dev Programs',    sub: 'Full Stack, MERN, PERN, Django, Python, JS',                     pg: '5–7' },
            { n: '04', label: 'Cybersecurity',       sub: 'Fundamentals & CEH Certification Prep (EC-Council)',             pg: '8' },
            { n: '05', label: 'Module Programs',     sub: 'Focused 4–6 week skill tracks',                                  pg: '9' },
            { n: '06', label: 'Pricing Overview',    sub: 'All fees and payment options at a glance',                       pg: '10' },
            { n: '07', label: 'How to Enroll',       sub: 'Step-by-step from registration to first class',                  pg: '11' },
          ].map(item => (
            <View key={item.n} style={s.tocItem}>
              <View style={s.tocNum}><Text style={s.tocNumTxt}>{item.n}</Text></View>
              <View style={s.tocLabelWrap}>
                <Text style={s.tocLabel}>{item.label}</Text>
                <Text style={s.tocSub}>{item.sub}</Text>
              </View>
              <View style={s.tocDots} />
              <Text style={s.tocPageNum}>p.{item.pg}</Text>
            </View>
          ))}
          <View style={s.tocNote}>
            <Text style={s.tocNoteTit}>Early Access — Limited Spots</Text>
            <Text style={s.tocNoteTxt}>
              Intellex is currently in early access. Register now to secure your spot at the founding
              registration fee before full launch pricing takes effect.
            </Text>
          </View>
        </View>
      </View>
    </Page>

    {/* ── PAGE 3 · ABOUT INTELLEX ─────────────────────────────────── */}
    <Page size="A4" style={[s.page, { paddingBottom: 52 }]}>
      <View style={s.secBanner}>
        <View style={s.secBannerBar} />
        <Text style={s.secBannerNum}>01 · WHO WE ARE</Text>
        <Text style={s.secBannerH2}>About Intellex</Text>
        <Text style={s.secBannerSub}>From a WhatsApp community to Cameroon's most ambitious tech education platform.</Text>
      </View>
      <View style={s.body}>
        <View style={s.storyCard}>
          <View style={s.storyGlow} />
          <Text style={s.storyH3}>Started with a message.{'\n'}Built into a movement.</Text>
          <Text style={s.storyTxt}>
            Intellex was founded on October 21, 2023 with one simple, powerful idea: real tech education
            should be accessible to everyone in Cameroon — not just those who can afford expensive physical
            schools or platforms priced in dollars.
          </Text>
          <Text style={s.storyTxt}>
            We started as a WhatsApp community and grew to over 600 learners within our first year through
            consistent courses, hands-on mentorship, and a relentless focus on outcomes. Now, we're building
            the platform that community deserves — structured, supported, and built for the long term.
          </Text>
          <Text style={s.storyTxt}>
            Our vision: become the most respected tech training institution in Central Africa and a gateway
            for Cameroonian talent into the global digital economy.
          </Text>
          <View style={s.statsRow}>
            {[
              { v: '600+', l: 'Learners since\n2023' },
              { v: '13',   l: 'Programs &\nmodules' },
              { v: '100%', l: 'Online — no\ncommute' },
              { v: '24h',  l: 'Account activation\nafter payment' },
            ].map(st => (
              <View key={st.v} style={s.statBox}>
                <Text style={s.statVal}>{st.v}</Text>
                <Text style={s.statLbl}>{st.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* What registering gives you */}
        <Text style={s.sectionLbl}>WHAT REGISTRATION GIVES YOU (BEFORE ENROLLING IN A PROGRAM)</Text>
        {[
          'Access to the Intellex platform and community — you become an official Intellex member',
          'Ability to browse all programs, pricing, and learning modes from your dashboard',
          'Eligibility to enroll in any program once the registration fee is confirmed',
          'Early access priority — your spot is reserved while full-launch pricing is pending',
        ].map(b => (
          <View key={b} style={s.regPill}>
            <View style={s.regPillDot}><Text style={s.regPillDotTxt}>✓</Text></View>
            <Text style={s.regPillTxt}>{b}</Text>
          </View>
        ))}

        {/* What you get when you enroll in a program */}
        <Text style={[s.sectionLbl, { marginTop: 14 }]}>WHAT YOU GET WHEN YOU ENROLL IN A PROGRAM</Text>
        <View style={s.benefitGrid}>
          {[
            'Free Amazon Books library access for the duration of your program',
            'Perplexity Pro AI research & study assistant — fully included',
            'Certificate of Completion for every program you finish',
            '1,000+ self-paced courses unlocked alongside live enrollment',
            'Lifetime Intellex learner community access — free forever',
            'Real portfolio projects built during your course to show employers',
          ].map(b => (
            <View key={b} style={s.benefitCard}>
              <View style={s.benefitDot}><Text style={s.benefitDotTxt}>✓</Text></View>
              <Text style={s.benefitTxt}>{b}</Text>
            </View>
          ))}
        </View>
      </View>
      <Footer n={3} />
    </Page>

    {/* ── PAGE 4 · LEARNING MODES ─────────────────────────────────── */}
    <Page size="A4" style={[s.page, { paddingBottom: 52 }]}>
      <View style={s.secBanner}>
        <View style={s.secBannerBar} />
        <Text style={s.secBannerNum}>02 · HOW YOU LEARN</Text>
        <Text style={s.secBannerH2}>Four ways to learn at Intellex</Text>
        <Text style={s.secBannerSub}>Every learner is different. Pick the mode that fits your lifestyle, schedule, and budget.</Text>
      </View>
      <View style={s.body}>
        {MODES.map(mode => (
          <View key={mode.title} style={s.modeCard}>
            <View style={[s.modeBar, { backgroundColor: mode.color }]} />
            <View style={[s.modeIcon, { backgroundColor: mode.color + '1A' }]}>
              <Text style={[s.modeIconTxt, { color: mode.color }]}>{mode.icon}</Text>
            </View>
            <View style={s.modeBody}>
              <Text style={s.modeTitle}>{mode.title}</Text>
              <Text style={s.modeDesc}>{mode.desc}</Text>
              <View style={[s.modeBadge, { backgroundColor: mode.badgeBg }]}>
                <Text style={[s.modeBadgeTxt, { color: mode.badgeTxt }]}>{mode.badge}</Text>
              </View>
            </View>
          </View>
        ))}
        <View style={[s.modeCallout, { backgroundColor: C.greenPale, borderColor: 'rgba(13,188,102,0.22)' }]}>
          <View style={{ backgroundColor: C.greenDim, borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 }}>
            <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.white }}>i</Text>
          </View>
          <View style={s.modeCallBody}>
            <Text style={[s.modeCallTitle, { color: C.greenDim }]}>Not sure which mode to pick?</Text>
            <Text style={[s.modeCallTxt, { color: C.textMid }]}>
              Most beginners start with Self-Paced or Live Classes. For fastest results, Priority Access is
              designed for total commitment. Message us on WhatsApp (+237 650 318 856) before registering — we'll help you choose.
            </Text>
          </View>
        </View>
      </View>
      <Footer n={4} />
    </Page>

    {/* ── PAGE 5 · FULL PROGRAMS (1/3) ────────────────────────────── */}
    <Page size="A4" style={[s.page, { paddingBottom: 52 }]}>
      <View style={s.secBanner}>
        <View style={s.secBannerBar} />
        <Text style={s.secBannerNum}>03 · FULL PROGRAMS  (1 of 3)</Text>
        <Text style={s.secBannerH2}>Complete development paths</Text>
        <Text style={s.secBannerSub}>End-to-end programs: beginner → production-ready. 3–6 months, upfront or monthly payment.</Text>
      </View>
      <View style={s.body}>
        {FULL.slice(0, 2).map(p => <ProgCard key={p.id} p={p} />)}
      </View>
      <Footer n={5} />
    </Page>

    {/* ── PAGE 6 · FULL PROGRAMS (2/3) ────────────────────────────── */}
    <Page size="A4" style={[s.page, { paddingBottom: 52 }]}>
      <View style={s.secBanner}>
        <View style={s.secBannerBar} />
        <Text style={s.secBannerNum}>03 · FULL PROGRAMS  (2 of 3)</Text>
        <Text style={s.secBannerH2}>Complete development paths</Text>
        <Text style={s.secBannerSub}>Each program includes projects, live Q&A sessions, code reviews, and a portfolio-ready final build.</Text>
      </View>
      <View style={s.body}>
        {FULL.slice(2, 4).map(p => <ProgCard key={p.id} p={p} />)}
      </View>
      <Footer n={6} />
    </Page>

    {/* ── PAGE 7 · FULL PROGRAMS (3/3) ────────────────────────────── */}
    <Page size="A4" style={[s.page, { paddingBottom: 52 }]}>
      <View style={s.secBanner}>
        <View style={s.secBannerBar} />
        <Text style={s.secBannerNum}>03 · FULL PROGRAMS  (3 of 3)</Text>
        <Text style={s.secBannerH2}>Python, JavaScript & Data Analysis</Text>
        <Text style={s.secBannerSub}>Two of the most in-demand entry points into software development, plus data analysis — all at Intellex.</Text>
      </View>
      <View style={s.body}>
        {FULL.slice(4, 6).map(p => <ProgCard key={p.id} p={p} />)}
        <View style={{ backgroundColor: C.navyMid, borderRadius: 8, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 4 }}>
          <View style={{ backgroundColor: 'rgba(13,188,102,0.3)', borderRadius: 6, width: 28, height: 28, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.green }}>INC</Text>
          </View>
          <Text style={{ flex: 1, fontSize: 9, color: 'rgba(255,255,255,0.62)', lineHeight: 1.65 }}>
            All full programs include weekly live Q&amp;A, 1-on-1 code reviews, real project builds, Certificate of Completion, and lifetime community access.
          </Text>
        </View>
      </View>
      <Footer n={7} />
    </Page>

    {/* ── PAGE 8 · CYBERSECURITY ──────────────────────────────────── */}
    <Page size="A4" style={[s.page, { paddingBottom: 52 }]}>
      <View style={[s.secBanner, { backgroundColor: '#1A0A2E' }]}>
        <View style={[s.secBannerBar, { backgroundColor: C.purple }]} />
        <Text style={[s.secBannerNum, { color: '#A78BFA' }]}>04 · CYBERSECURITY</Text>
        <Text style={s.secBannerH2}>Protect. Detect. Defend.</Text>
        <Text style={s.secBannerSub}>EC-Council aligned training — with or without certification preparation. Build a career in the most in-demand tech field.</Text>
      </View>
      <View style={s.body}>
        {FULL.filter(p => p.id === 'cybersecurity' || p.id === 'cybersecurity-ceh').map(p => <ProgCard key={p.id} p={p} />)}

        <View style={{ backgroundColor: '#1A0A2E', borderRadius: 9, padding: 14, marginTop: 4, borderWidth: 0.5, borderColor: 'rgba(167,139,250,0.2)' }}>
          <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#A78BFA', marginBottom: 6 }}>About EC-Council & CEH Certification</Text>
          <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            EC-Council is the world's largest cybersecurity technical certification body. The Certified Ethical Hacker (CEH) credential is recognized globally by employers and government agencies.{'\n\n'}
            <Text style={{ fontFamily: 'Helvetica-Bold', color: 'rgba(255,255,255,0.85)' }}>Without Certification (XAF 200,000):</Text>
            {'  '}Our full cybersecurity training — all skills, labs, and Intellex certificate. No EC-Council exam fee required.{'\n\n'}
            <Text style={{ fontFamily: 'Helvetica-Bold', color: 'rgba(255,255,255,0.85)' }}>With CEH Certification Prep (XAF 380,000):</Text>
            {'  '}All of the above + structured preparation for the official CEH exam. EC-Council exam voucher (~$550 USD) purchased separately via ec-council.org. Exam price is a universal EC-Council standard fee.
          </Text>
        </View>
      </View>
      <Footer n={8} />
    </Page>

    {/* ── PAGE 9 · MODULE PROGRAMS ────────────────────────────────── */}
    <Page size="A4" style={[s.page, { paddingBottom: 52 }]}>
      <View style={s.secBanner}>
        <View style={s.secBannerBar} />
        <Text style={s.secBannerNum}>05 · MODULE PROGRAMS</Text>
        <Text style={s.secBannerH2}>Focused skill modules</Text>
        <Text style={s.secBannerSub}>4–6 week standalone tracks. Start small, master one skill, build up from there.</Text>
      </View>
      <View style={s.body}>
        <Text style={s.bodyTxt}>
          Not ready for a full 3–6 month commitment? Or need one specific skill right now? Our modules
          let you learn a focused area at a fraction of the full program cost. Perfect for testing the
          platform, filling a gap, or starting small before going all-in.
        </Text>
        <View style={s.modGrid}>
          {PARTIAL.map(p => {
            const accent = PROG_ACCENT[p.id] || C.green;
            return (
              <View key={p.id} style={s.modCard}>
                <View style={{ height: 3, backgroundColor: accent }} />
                <View style={s.modTop}>
                  <View style={s.modHdr}>
                    <Text style={s.modTitle}>{p.shortTitle}</Text>
                  </View>
                  <Text style={s.modMeta}>{p.duration} · {p.level}</Text>
                  <Text style={s.modDesc}>{p.description}</Text>
                  <View style={s.modPills}>
                    {p.technologies.slice(0, 4).map(t => (
                      <View key={t} style={s.modPill}><Text style={s.modPillTxt}>{t}</Text></View>
                    ))}
                  </View>
                </View>
                <View style={s.modFoot}>
                  <Text style={s.modPrice}>{fmtXAF(p.priceXAF)}</Text>
                  <Text style={s.modReg}>Reg: {fmtXAF(p.registrationFee)}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={{ backgroundColor: '#FFFBEB', borderRadius: 8, padding: 13, borderWidth: 0.5, borderColor: 'rgba(245,158,11,0.25)', flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 14 }}>
          <View style={{ backgroundColor: '#F59E0B', borderRadius: 6, width: 22, height: 22, alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 }}>
            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#FFFFFF' }}>+</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#92400E', marginBottom: 3 }}>Modules stack into full programs</Text>
            <Text style={{ fontSize: 9, color: C.textMid, lineHeight: 1.6 }}>
              Web Fundamentals → JS Essentials → React Basics = the foundation of the Full Stack program.
              Module fees may be credited toward full program enrollment at Intellex's discretion.
            </Text>
          </View>
        </View>
      </View>
      <Footer n={9} />
    </Page>

    {/* ── PAGE 10 · PRICING ───────────────────────────────────────── */}
    <Page size="A4" style={[s.page, { paddingBottom: 52 }]}>
      <View style={s.secBanner}>
        <View style={s.secBannerBar} />
        <Text style={s.secBannerNum}>06 · PRICING</Text>
        <Text style={s.secBannerH2}>Complete pricing overview</Text>
        <Text style={s.secBannerSub}>All prices in XAF. Registration fee paid once to activate your account. Monthly payment available on full programs.</Text>
      </View>
      <View style={s.body}>
        <View style={s.table}>
          <View style={s.tableHead}>
            <View style={s.tc1}><Text style={s.tableHeadTxt}>PROGRAM</Text></View>
            <View style={s.tc2}><Text style={s.tableHeadTxt}>DURATION</Text></View>
            <View style={s.tc3}><Text style={s.tableHeadTxt}>REG. FEE</Text></View>
            <View style={s.tc4}><Text style={s.tableHeadTxt}>TOTAL</Text></View>
          </View>
          <View style={s.tableGroupRow}>
            <View style={s.tc1}><Text style={[s.tableGroupTxt, { color: C.green }]}>FULL PROGRAMS</Text></View>
          </View>
          {FULL.map((p, i) => (
            <View key={p.id} style={[s.tableRow, i % 2 !== 0 ? s.tableRowAlt : {}]}>
              <View style={s.tc1}>
                <Text style={s.ttitle}>{p.shortTitle}</Text>
                <Text style={s.tsub}>{p.level}</Text>
              </View>
              <View style={s.tc2}><Text style={s.td}>{p.duration}</Text></View>
              <View style={s.tc3}><Text style={s.tdGreen}>{fmtXAF(p.registrationFee)}</Text></View>
              <View style={s.tc4}>
                <Text style={s.tdBold}>{fmtXAF(p.priceXAF)}</Text>
                {p.monthlyXAF && <Text style={s.tdSub}>{fmtXAF(p.monthlyXAF)}/mo</Text>}
              </View>
            </View>
          ))}
          <View style={s.tableGroupRow}>
            <View style={s.tc1}><Text style={[s.tableGroupTxt, { color: C.muted }]}>MODULE PROGRAMS</Text></View>
          </View>
          {PARTIAL.map((p, i) => (
            <View key={p.id} style={[s.tableRow, i % 2 !== 0 ? s.tableRowAlt : {}]}>
              <View style={s.tc1}>
                <Text style={s.ttitle}>{p.shortTitle}</Text>
                <Text style={s.tsub}>{p.level}</Text>
              </View>
              <View style={s.tc2}><Text style={s.td}>{p.duration}</Text></View>
              <View style={s.tc3}><Text style={s.tdGreen}>{fmtXAF(p.registrationFee)}</Text></View>
              <View style={s.tc4}><Text style={s.tdBold}>{fmtXAF(p.priceXAF)}</Text></View>
            </View>
          ))}
        </View>

        <Text style={[s.sectionLbl, { marginTop: 16 }]}>PAYMENT METHODS</Text>
        <View style={s.payRow}>
          <View style={s.payCard}>
            <Image src={`${BASE}/mtn.png`} style={s.payLogo} />
            <Text style={s.payLbl}>MTN MOBILE MONEY</Text>
            <Text style={s.payNum}>674 435 138</Text>
            <Text style={s.payHolder}>MODESTE TATOH</Text>
          </View>
          <View style={s.payCard}>
            <Image src={`${BASE}/orange.png`} style={s.payLogo} />
            <Text style={s.payLbl}>ORANGE MONEY</Text>
            <Text style={s.payNum}>686 705 607</Text>
            <Text style={s.payHolder}>MODESTE TATOH</Text>
          </View>
          <View style={s.payInstr}>
            <Text style={s.payInstrLbl}>AFTER PAYMENT</Text>
            <Text style={s.payInstrTxt}>
              {'Send your payment screenshot\nto WhatsApp '}
              <Text style={s.payInstrHL}>+237 650 318 856</Text>
              {'\nwith your full name.\nAccount activated within 24 hrs.'}
            </Text>
          </View>
        </View>
      </View>
      <Footer n={10} />
    </Page>

    {/* ── PAGE 11 · HOW TO ENROLL ─────────────────────────────────── */}
    <Page size="A4" style={[s.page, { paddingBottom: 52 }]}>
      <View style={s.secBanner}>
        <View style={s.secBannerBar} />
        <Text style={s.secBannerNum}>07 · GET STARTED</Text>
        <Text style={s.secBannerH2}>How to join Intellex</Text>
        <Text style={s.secBannerSub}>Five steps from right now to your first lesson. The whole process takes under 10 minutes.</Text>
      </View>
      <View style={s.body}>
        {[
          { n: '01', title: 'Fill the Registration Form',     desc: 'Visit intellex.loopingbinary.com/register, fill in your details, choose your program, and select your learning mode. Takes about 3 minutes.' },
          { n: '02', title: 'Download Your Invoice',          desc: 'At the end of the form, your personalized invoice is generated automatically — pre-filled with your details, program, and payment info.' },
          { n: '03', title: 'Pay via Mobile Money',           desc: 'Transfer the registration fee to MTN MoMo (674 435 138) or Orange Money (686 705 607). Account name: MODESTE TATOH.' },
          { n: '04', title: 'Send Your Payment Screenshot',   desc: 'Take a screenshot of your confirmed transaction and send it to WhatsApp +237 650 318 856 with your full name included.' },
          { n: '05', title: 'Access Granted Within 24 Hours', desc: 'Your Intellex account is activated. You receive login credentials, onboarding instructions, and your learning journey officially begins.' },
        ].map((step, i) => (
          <View key={step.n} style={s.stepWrap}>
            <View style={s.stepRow}>
              <View style={s.stepCircle}><Text style={s.stepNum}>{step.n}</Text></View>
              {i < 4 && <View style={s.stepConnLine} />}
              <View style={s.stepCard}>
                <Text style={s.stepTitle}>{step.title}</Text>
                <Text style={s.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={s.ctaCard}>
          <View style={s.ctaGlow} />
          <Text style={s.ctaTitle}>Contact & Support</Text>
          <Text style={s.ctaTxt}>
            We're available on WhatsApp every day. Have a question about which program to choose, how
            payment works, or anything else? Reach out before you register — we respond fast.
          </Text>
          <View style={s.ctaGrid}>
            {[
              { lbl: 'WHATSAPP',  val: '+237 650 318 856',          sub: 'Primary support channel' },
              { lbl: 'EMAIL',     val: 'intellexplatform@gmail.com', sub: 'For formal inquiries' },
              { lbl: 'WEBSITE',   val: 'intellex.loopingbinary.com', sub: 'Register & get your invoice' },
            ].map(ct => (
              <View key={ct.lbl} style={s.ctaItem}>
                <Text style={s.ctaItemLbl}>{ct.lbl}</Text>
                <Text style={s.ctaItemVal}>{ct.val}</Text>
                <Text style={s.ctaItemSub}>{ct.sub}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <Footer n={11} />
    </Page>

  </Document>
);
