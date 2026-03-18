'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PROGRAMS } from '@/lib/programs';

const c = {
  navy: '#0A1628',
  navyMid: '#162B52',
  gold: '#0dbc66',
  goldLight: '#2bdb84',
  text: '#1A2236',
  muted: '#6B7A94',
  mutedLight: '#9BA8BA',
  border: '#E2E6ED',
  bg: '#FFFFFF',
  bgAlt: '#F7F9FC',
  white: '#FFFFFF',
  accent: '#3B82F6',
};

const s = StyleSheet.create({
  page: { backgroundColor: c.bg, fontFamily: 'Helvetica', color: c.text, fontSize: 10 },

  // Cover
  cover: { flex: 1, backgroundColor: c.navy, justifyContent: 'center', alignItems: 'center', padding: 60 },
  coverEyebrow: { fontSize: 9, color: c.gold, letterSpacing: 2, marginBottom: 16 },
  coverTitle: { fontSize: 40, fontFamily: 'Helvetica-Bold', color: c.white, textAlign: 'center', lineHeight: 1.15, marginBottom: 16 },
  coverSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 1.6, maxWidth: 380, marginBottom: 40 },
  goldLine: { width: 48, height: 3, backgroundColor: c.gold, borderRadius: 2, marginBottom: 40 },
  coverMeta: { fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textAlign: 'center' },
  coverStrip: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: c.gold },

  // Section header
  sectionPage: { padding: '40 40 32 40' },
  sectionEyebrow: { fontSize: 8, color: c.gold, letterSpacing: 2, marginBottom: 8 },
  sectionTitle: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: c.navy, marginBottom: 10, lineHeight: 1.2 },
  sectionDivider: { height: 0.5, backgroundColor: c.border, marginBottom: 16 },
  bodyText: { fontSize: 10, color: c.muted, lineHeight: 1.7, marginBottom: 10 },

  // Program card
  progCard: { backgroundColor: c.bgAlt, borderRadius: 8, padding: 16, marginBottom: 14, borderWidth: 0.5, borderColor: c.border },
  progHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  progTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: c.navy, marginBottom: 2 },
  progMeta: { fontSize: 9, color: c.muted },
  progBadge: { backgroundColor: c.navyMid, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  progBadgeText: { fontSize: 8, color: c.white, fontFamily: 'Helvetica-Bold' },
  fullBadge: { backgroundColor: c.gold, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  fullBadgeText: { fontSize: 8, color: c.navy, fontFamily: 'Helvetica-Bold' },
  progDesc: { fontSize: 10, color: c.muted, lineHeight: 1.6, marginBottom: 10 },
  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 10 },
  techPill: { backgroundColor: c.white, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 0.5, borderColor: c.border },
  techPillText: { fontSize: 8, color: c.muted },
  hlRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  hlBullet: { fontSize: 9, color: c.gold, marginRight: 6, lineHeight: 1.5 },
  hlText: { fontSize: 9, color: c.muted, lineHeight: 1.5, flex: 1 },
  progPrice: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 0.5, borderTopColor: c.border, marginTop: 4 },
  priceLabel: { fontSize: 9, color: c.muted },
  priceValue: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: c.navy },
  priceMonthly: { fontSize: 9, color: c.gold, fontFamily: 'Helvetica-Bold' },

  // Pricing table
  pricingHeader: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: c.border, paddingBottom: 8, marginBottom: 0 },
  pricingRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: c.border },
  pcol1: { flex: 2.5 },
  pcol2: { flex: 1, alignItems: 'center' },
  pcol3: { flex: 1, alignItems: 'center' },
  pcol4: { flex: 1, alignItems: 'flex-end' },
  thText: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: c.muted, letterSpacing: 0.8 },
  ptitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: c.navy, marginBottom: 1 },
  psubtitle: { fontSize: 9, color: c.muted },
  ptd: { fontSize: 10, color: c.muted },
  ptdBold: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: c.navy },
  ptdGold: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: c.gold },

  // Mode cards
  modeCard: { backgroundColor: c.bgAlt, borderRadius: 8, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: c.border, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  modeIcon: { fontSize: 20, width: 36, height: 36, textAlign: 'center', lineHeight: 2 },
  modeContent: { flex: 1 },
  modeTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: c.navy, marginBottom: 3 },
  modeDesc: { fontSize: 10, color: c.muted, lineHeight: 1.6 },

  // About
  aboutCard: { backgroundColor: c.navy, borderRadius: 10, padding: 24, marginTop: 16 },
  aboutTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: c.white, marginBottom: 10 },
  aboutText: { fontSize: 10, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 6 },
  statRow: { flexDirection: 'row', marginTop: 16, gap: 12 },
  statBox: { flex: 1, backgroundColor: 'rgba(13,188,102,0.15)', borderRadius: 6, padding: 10, alignItems: 'center' },
  statValue: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: c.gold, marginBottom: 3 },
  statLabel: { fontSize: 8, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },

  // Benefits card
  benefitsCard: { backgroundColor: c.bgAlt, borderRadius: 8, padding: 16, marginTop: 14, borderWidth: 0.5, borderColor: c.border },
  benefitsTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: c.navy, marginBottom: 10 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  benefitBullet: { fontSize: 9, color: c.gold, marginRight: 6, lineHeight: 1.5 },
  benefitText: { fontSize: 9, color: c.muted, lineHeight: 1.5, flex: 1 },

  // Footer
  pageFooter: { position: 'absolute', bottom: 20, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageFooterText: { fontSize: 8, color: c.mutedLight },
  pageNumber: { fontSize: 8, color: c.mutedLight },
});

const fmtXAF = (n: number) => `XAF ${new Intl.NumberFormat('fr-CM').format(n)}`;
const FULL = PROGRAMS.filter(p => p.type === 'full');
const PARTIAL = PROGRAMS.filter(p => p.type === 'partial');

export const CurriculumDocument = () => (
  <Document title="Intellex Program Guide 2026" author="Intellex">

    {/* ── COVER ── */}
    <Page size="A4" style={s.page}>
      <View style={s.cover}>
        <Text style={s.coverEyebrow}>INTELLEX · OFFICIAL PROGRAM GUIDE</Text>
        <View style={s.goldLine} />
        <Text style={s.coverTitle}>Become the developer{'\n'}you were meant to be.</Text>
        <Text style={s.coverSub}>
          Intellex is Cameroon&apos;s most intensive online tech education platform.
          Real skills, real projects, real outcomes - through self-paced learning,
          live classes, mentorship, and AI assistance.
        </Text>
        <Text style={s.coverMeta}>PROGRAM GUIDE 2026 · EARLY ACCESS EDITION · ONLINE ONLY</Text>
      </View>
      <View style={s.coverStrip} />
    </Page>

    {/* ── ABOUT INTELLEX ── */}
    <Page size="A4" style={s.page}>
      <View style={s.sectionPage}>
        <Text style={s.sectionEyebrow}>WHO WE ARE</Text>
        <Text style={s.sectionTitle}>About Intellex</Text>
        <View style={s.sectionDivider} />

        <View style={s.aboutCard}>
          <Text style={s.aboutTitle}>Started with a message. Built into a movement.</Text>
          <Text style={s.aboutText}>
            Intellex was founded on October 21, 2023, with one simple, powerful idea: real tech
            education should be accessible to everyone in Cameroon - not just those who can afford
            expensive physical schools or international platforms.
          </Text>
          <Text style={s.aboutText}>
            We started as a WhatsApp community and grew to over 600 learners within our first year
            through consistent courses, mentorship, and a relentless focus on outcomes. Now, we are
            building the platform that community deserves - structured, supported, and built for
            the long term.
          </Text>
          <Text style={s.aboutText}>
            Our vision is to become the most respected tech training institution in Central Africa,
            and to be a gateway for Cameroonian talent to reach the global digital economy.
          </Text>
          <View style={s.statRow}>
            <View style={s.statBox}>
              <Text style={s.statValue}>600+</Text>
              <Text style={s.statLabel}>Learners since{'\n'}2023</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>1,000+</Text>
              <Text style={s.statLabel}>Self-paced{'\n'}programs</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>100%</Text>
              <Text style={s.statLabel}>Online - no{'\n'}commute</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>2023</Text>
              <Text style={s.statLabel}>Founded in{'\n'}Cameroon</Text>
            </View>
          </View>
        </View>

        <View style={s.benefitsCard}>
          <Text style={s.benefitsTitle}>What you get as a registered student</Text>
          {[
            { benefit: 'Free Amazon Books access - full library during your learning journey' },
            { benefit: 'Perplexity Pro - AI-powered research & study assistant included' },
            { benefit: '1,000+ self-paced courses - unlocked with any live mentorship enrollment' },
            { benefit: 'Certificate of Completion - for every program you finish' },
            { benefit: 'Lifetime community access - Intellex learner network' },
          ].map((item) => (
            <View key={item.benefit} style={s.benefitRow}>
              <Text style={s.benefitBullet}>✓</Text>
              <Text style={s.benefitText}>{item.benefit}</Text>
            </View>
          ))}
        </View>

        <Text style={[s.bodyText, { marginTop: 20 }]}>
          Intellex offers multiple ways to learn because people learn differently. Whether you
          prefer working at your own pace, joining live classes with an instructor, being guided
          one-on-one through mentorship, or accelerating your growth with priority access - we
          have a mode built for you.
        </Text>
        <Text style={s.bodyText}>
          Every program at Intellex is designed around one outcome: making you genuinely capable.
          Not just certificate-collecting - but building, shipping, and demonstrating real skills
          that lead to real opportunities.
        </Text>
      </View>
      <View style={s.pageFooter}>
        <Text style={s.pageFooterText}>Intellex · Program Guide 2026 · intellex.loopingbinary.com</Text>
        <Text style={s.pageNumber}>2</Text>
      </View>
    </Page>

    {/* ── LEARNING MODES ── */}
    <Page size="A4" style={s.page}>
      <View style={s.sectionPage}>
        <Text style={s.sectionEyebrow}>HOW YOU LEARN</Text>
        <Text style={s.sectionTitle}>Four ways to learn at Intellex</Text>
        <View style={s.sectionDivider} />
        <Text style={[s.bodyText, { marginBottom: 16 }]}>
          Every learner is different. That&apos;s why Intellex offers four distinct learning modes.
          You can enroll in any program under any mode that fits your lifestyle, budget, and pace.
        </Text>

        {[
          { title: 'Self-Paced Learning', icon: '📚', desc: 'Access all course recordings, notes, and project materials at any time. Learn when it suits you - early morning, late night, weekends. Perfect for people with jobs, family commitments, or irregular schedules. You set the timeline, we provide the structure.' },
          { title: 'Live Classes', icon: '🎥', desc: 'Join scheduled real-time sessions with instructors via video call. Ask questions as they happen, get immediate feedback, and experience a classroom atmosphere from home. Sessions are recorded and shared so you never miss one.' },
          { title: 'Mentorship Program', icon: '🎯', desc: '1-on-1 dedicated guidance throughout your learning journey. Your mentor will review your code, answer your questions personally, guide your project choices, and push you when you need it. The highest-touch learning experience we offer.' },
          { title: 'Priority Access', icon: '⚡', desc: 'The fast lane at Intellex. Daily support, direct instructor access, priority code reviews, and an accelerated curriculum. For those who want to go from zero to job-ready as fast as humanly possible. Intense, focused, and results-driven.' },
        ].map((mode) => (
          <View key={mode.title} style={s.modeCard}>
            <Text style={s.modeIcon}>{mode.icon}</Text>
            <View style={s.modeContent}>
              <Text style={s.modeTitle}>{mode.title}</Text>
              <Text style={s.modeDesc}>{mode.desc}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={s.pageFooter}>
        <Text style={s.pageFooterText}>Intellex · Program Guide 2026 · intellex.loopingbinary.com</Text>
        <Text style={s.pageNumber}>3</Text>
      </View>
    </Page>

    {/* ── FULL PROGRAMS ── */}
    <Page size="A4" style={s.page}>
      <View style={s.sectionPage}>
        <Text style={s.sectionEyebrow}>FULL PROGRAMS</Text>
        <Text style={s.sectionTitle}>Complete development paths</Text>
        <View style={s.sectionDivider} />
        <Text style={[s.bodyText, { marginBottom: 8 }]}>
          Full programs are comprehensive, end-to-end training tracks designed to take you from
          Live Mentorship Programs (4–6 months) - can be paid in installments where indicated.
        </Text>

        {FULL.slice(0, 3).map((p) => (
          <View key={p.id} style={s.progCard}>
            <View style={s.progHeader}>
              <View>
                <Text style={s.progTitle}>{p.title}</Text>
                <Text style={s.progMeta}>{p.duration} · {p.level}</Text>
              </View>
              <View style={s.fullBadge}>
                <Text style={s.fullBadgeText}>FULL PROGRAM</Text>
              </View>
            </View>
            <Text style={s.progDesc}>{p.description}</Text>
            <View style={s.techRow}>
              {p.technologies.map(t => (
                <View key={t} style={s.techPill}><Text style={s.techPillText}>{t}</Text></View>
              ))}
            </View>
            <View>
              {p.highlights.map(h => (
                <View key={h} style={s.hlRow}>
                  <Text style={s.hlBullet}>✓</Text>
                  <Text style={s.hlText}>{h}</Text>
                </View>
              ))}
            </View>
            <View style={s.progPrice}>
              <View>
                <Text style={s.priceLabel}>Total program</Text>
                <Text style={s.priceValue}>{fmtXAF(p.priceXAF)}</Text>
              </View>
              {p.monthlyXAF && (
                <View>
                  <Text style={s.priceLabel}>Monthly option</Text>
                  <Text style={s.priceMonthly}>{fmtXAF(p.monthlyXAF)}/month</Text>
                </View>
              )}
              <View>
                <Text style={s.priceLabel}>Registration fee</Text>
                <Text style={s.priceValue}>{fmtXAF(p.registrationFee)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View style={s.pageFooter}>
        <Text style={s.pageFooterText}>Intellex · Program Guide 2026 · intellex.loopingbinary.com</Text>
        <Text style={s.pageNumber}>4</Text>
      </View>
    </Page>

    {/* ── FULL PROGRAMS PAGE 2 ── */}
    <Page size="A4" style={s.page}>
      <View style={s.sectionPage}>
        <Text style={s.sectionEyebrow}>FULL PROGRAMS (CONTINUED)</Text>
        <View style={s.sectionDivider} />

        {FULL.slice(3).map((p) => (
          <View key={p.id} style={s.progCard}>
            <View style={s.progHeader}>
              <View>
                <Text style={s.progTitle}>{p.title}</Text>
                <Text style={s.progMeta}>{p.duration} · {p.level}</Text>
              </View>
              <View style={s.fullBadge}>
                <Text style={s.fullBadgeText}>FULL PROGRAM</Text>
              </View>
            </View>
            <Text style={s.progDesc}>{p.description}</Text>
            <View style={s.techRow}>
              {p.technologies.map(t => (
                <View key={t} style={s.techPill}><Text style={s.techPillText}>{t}</Text></View>
              ))}
            </View>
            <View>
              {p.highlights.map(h => (
                <View key={h} style={s.hlRow}>
                  <Text style={s.hlBullet}>✓</Text>
                  <Text style={s.hlText}>{h}</Text>
                </View>
              ))}
            </View>
            <View style={s.progPrice}>
              <View>
                <Text style={s.priceLabel}>Total program</Text>
                <Text style={s.priceValue}>{fmtXAF(p.priceXAF)}</Text>
              </View>
              {p.monthlyXAF && (
                <View>
                  <Text style={s.priceLabel}>Monthly option</Text>
                  <Text style={s.priceMonthly}>{fmtXAF(p.monthlyXAF)}/month</Text>
                </View>
              )}
              <View>
                <Text style={s.priceLabel}>Registration fee</Text>
                <Text style={s.priceValue}>{fmtXAF(p.registrationFee)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View style={s.pageFooter}>
        <Text style={s.pageFooterText}>Intellex · Program Guide 2026 · intellex.loopingbinary.com</Text>
        <Text style={s.pageNumber}>5</Text>
      </View>
    </Page>

    {/* ── MODULE PROGRAMS ── */}
    <Page size="A4" style={s.page}>
      <View style={s.sectionPage}>
        <Text style={s.sectionEyebrow}>MODULE PROGRAMS</Text>
        <Text style={s.sectionTitle}>Focused skill modules</Text>
        <View style={s.sectionDivider} />
        <Text style={[s.bodyText, { marginBottom: 12 }]}>
          Not ready for a full program? Or want to target a specific skill? Our module programs
          let you learn one focused area in 4–6 weeks, at a fraction of the full program cost.
          Perfect for those who want to start small, test the waters, or fill a specific skill gap.
        </Text>

        {PARTIAL.map((p) => (
          <View key={p.id} style={s.progCard}>
            <View style={s.progHeader}>
              <View>
                <Text style={s.progTitle}>{p.title}</Text>
                <Text style={s.progMeta}>{p.duration} · {p.level}</Text>
              </View>
              <View style={s.progBadge}>
                <Text style={s.progBadgeText}>MODULE</Text>
              </View>
            </View>
            <Text style={s.progDesc}>{p.description}</Text>
            <View style={s.techRow}>
              {p.technologies.map(t => (
                <View key={t} style={s.techPill}><Text style={s.techPillText}>{t}</Text></View>
              ))}
            </View>
            <View style={s.progPrice}>
              <View>
                <Text style={s.priceLabel}>Module fee</Text>
                <Text style={s.priceValue}>{fmtXAF(p.priceXAF)}</Text>
              </View>
              <View>
                <Text style={s.priceLabel}>Registration fee</Text>
                <Text style={s.priceValue}>{fmtXAF(p.registrationFee)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View style={s.pageFooter}>
        <Text style={s.pageFooterText}>Intellex · Program Guide 2026 · intellex.loopingbinary.com</Text>
        <Text style={s.pageNumber}>6</Text>
      </View>
    </Page>

    {/* ── PRICING OVERVIEW ── */}
    <Page size="A4" style={s.page}>
      <View style={s.sectionPage}>
        <Text style={s.sectionEyebrow}>PRICING</Text>
        <Text style={s.sectionTitle}>Complete pricing overview</Text>
        <View style={s.sectionDivider} />
        <Text style={[s.bodyText, { marginBottom: 16 }]}>
          All prices in XAF (Central African Franc). Registration fee is paid once to activate
          your account. Program fees can be paid fully upfront or monthly where indicated.
          Payment via MTN Mobile Money or Orange Money.
        </Text>

        <View style={s.pricingHeader}>
          <View style={s.pcol1}><Text style={s.thText}>PROGRAM</Text></View>
          <View style={s.pcol2}><Text style={s.thText}>DURATION</Text></View>
          <View style={s.pcol3}><Text style={s.thText}>REG. FEE</Text></View>
          <View style={s.pcol4}><Text style={s.thText}>TOTAL</Text></View>
        </View>

        {PROGRAMS.map((p) => (
          <View key={p.id} style={s.pricingRow}>
            <View style={s.pcol1}>
              <Text style={s.ptitle}>{p.shortTitle}</Text>
              <Text style={s.psubtitle}>{p.type === 'full' ? 'Full program' : 'Module'}</Text>
            </View>
            <View style={s.pcol2}><Text style={s.ptd}>{p.duration}</Text></View>
            <View style={s.pcol3}><Text style={s.ptdGold}>{fmtXAF(p.registrationFee)}</Text></View>
            <View style={s.pcol4}>
              <Text style={s.ptdBold}>{fmtXAF(p.priceXAF)}</Text>
              {p.monthlyXAF && <Text style={[s.ptd, { fontSize: 8 }]}>{fmtXAF(p.monthlyXAF)}/mo</Text>}
            </View>
          </View>
        ))}

        <View style={[s.modeCard, { marginTop: 24 }]}>
          <View style={s.modeContent}>
            <Text style={s.modeTitle}>How to pay</Text>
            <Text style={s.modeDesc}>
              {'MTN Mobile Money: 674 435 138  ·  Orange Money: 686 705 607\n'}
              {'Account name: MODESTE TATOH\n'}
              {'After payment, send your transaction screenshot to WhatsApp: +237 650 318 856\n'}
              Your account will be activated within 24 hours of confirmed payment.
            </Text>
          </View>
        </View>
      </View>
      <View style={s.pageFooter}>
        <Text style={s.pageFooterText}>Intellex · Program Guide 2026 · intellex.loopingbinary.com</Text>
        <Text style={s.pageNumber}>7</Text>
      </View>
    </Page>

    {/* ── HOW TO ENROLL ── */}
    <Page size="A4" style={s.page}>
      <View style={s.sectionPage}>
        <Text style={s.sectionEyebrow}>GET STARTED</Text>
        <Text style={s.sectionTitle}>How to join Intellex</Text>
        <View style={s.sectionDivider} />

        {[
          { step: '01', title: 'Fill the Registration Form', desc: 'Visit our registration page and fill in your personal details, choose your program, and select your preferred learning mode. This takes about 3 minutes.' },
          { step: '02', title: 'Download Your Invoice', desc: 'At the end of the form, your personalized registration invoice will be generated automatically with your details and the program you selected.' },
          { step: '03', title: 'Make Payment via Mobile Money', desc: 'Transfer the registration fee to MTN MoMo (674 435 138) or Orange Money (686 705 607), account name MODESTE TATOH.' },
          { step: '04', title: 'Send Payment Confirmation', desc: 'Take a screenshot of your payment and send it to WhatsApp: +237 650 318 856. Include your full name in the message.' },
          { step: '05', title: 'Get Access Within 24 Hours', desc: 'Your Intellex account will be activated and you\'ll receive your login details and onboarding instructions within 24 hours.' },
        ].map((item) => (
          <View key={item.step} style={[s.modeCard, { marginBottom: 8 }]}>
            <View style={{ width: 36, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: c.gold }}>{item.step}</Text>
            </View>
            <View style={s.modeContent}>
              <Text style={s.modeTitle}>{item.title}</Text>
              <Text style={s.modeDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}

        <View style={[s.aboutCard, { marginTop: 20, padding: 20 }]}>
          <Text style={[s.aboutTitle, { fontSize: 14, marginBottom: 8 }]}>Contact & Support</Text>
          <Text style={s.aboutText}>WhatsApp: +237 650 318 856 (primary support channel)</Text>
          <Text style={s.aboutText}>Email: intellexplatform@gmail.com</Text>
          <Text style={s.aboutText}>MTN MoMo: 674 435 138 · Orange Money: 686 705 607</Text>
          <Text style={s.aboutText}>Account name: MODESTE TATOH</Text>
          <Text style={[s.aboutText, { marginTop: 8, color: c.gold }]}>intellex.loopingbinary.com</Text>
        </View>
      </View>
      <View style={s.pageFooter}>
        <Text style={s.pageFooterText}>Intellex · Program Guide 2026 · intellex.loopingbinary.com</Text>
        <Text style={s.pageNumber}>8</Text>
      </View>
    </Page>

  </Document>
);
