import React from 'react';
import path from 'path';
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { CurriculumDoc, CurriculumItem } from '@/lib/pdf/curriculumTypes';

Font.registerHyphenationCallback((word) => [word]);

const INK = '#12324f';
const SOFT = '#5b6b7a';
const LINE = '#e4e9ee';

/** Built-in PDF fonts only cover Latin text; drop anything that would render as garbage. */
function clean(text: string | undefined | null): string {
  return String(text ?? '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\u0020-\u007E\u00A0-\u00FF\u2013\u2014\u2022\u2026\u20AC\n]/g, '')
    .replace(/\s+\n/g, '\n')
    .trim();
}

function safeHex(c: string): string {
  return /^#[0-9a-f]{6}$/i.test(c) ? c : '#00a86b';
}

function tint(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (v: number) => Math.round(v + (255 - v) * amount);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function minutesLabel(m?: number) {
  if (!m || m <= 0) return '';
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h}h ${r}m` : `${h}h`;
}

export default function CurriculumPdf({ doc }: { doc: CurriculumDoc }) {
  const accent = safeHex(doc.accent);
  const soft = tint(accent, 0.88);
  const logo = path.join(process.cwd(), 'public', 'logo.png');

  const s = StyleSheet.create({
    page: { paddingTop: 54, paddingBottom: 56, paddingHorizontal: 44, fontFamily: 'Helvetica', fontSize: 10, color: INK },
    cover: { padding: 0, fontFamily: 'Helvetica', color: INK, backgroundColor: '#ffffff' },
    coverBand: { backgroundColor: accent, paddingHorizontal: 48, paddingTop: 44, paddingBottom: 56, height: 470 },
    logoWrap: { backgroundColor: INK, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
    logo: { width: 92, height: 37 },
    kind: { marginTop: 70, fontSize: 10, letterSpacing: 2.4, color: '#ffffff', opacity: 0.85, fontFamily: 'Helvetica-Bold' },
    title: { marginTop: 12, fontSize: 38, lineHeight: 1.08, color: '#ffffff', fontFamily: 'Helvetica-Bold' },
    subtitle: { marginTop: 14, fontSize: 14, lineHeight: 1.4, color: '#ffffff', opacity: 0.92 },
    factsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: -34, paddingHorizontal: 40 },
    fact: { backgroundColor: '#ffffff', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, margin: 6, minWidth: 110, borderWidth: 1, borderColor: LINE },
    factLabel: { fontSize: 7.5, letterSpacing: 1.4, color: SOFT, fontFamily: 'Helvetica-Bold' },
    factValue: { marginTop: 4, fontSize: 14, fontFamily: 'Helvetica-Bold', color: INK },
    coverFoot: { paddingHorizontal: 48, marginTop: 30 },
    coverFootTitle: { fontSize: 9, letterSpacing: 1.6, color: accent, fontFamily: 'Helvetica-Bold' },
    coverFootText: { marginTop: 6, fontSize: 11, lineHeight: 1.5, color: SOFT },
    h2: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: INK },
    h2Rule: { width: 36, height: 3, backgroundColor: accent, marginTop: 6, marginBottom: 14, borderRadius: 2 },
    p: { fontSize: 10.5, lineHeight: 1.6, color: SOFT },
    twoCol: { flexDirection: 'row', marginTop: 22 },
    card: { flex: 1, borderRadius: 14, padding: 16, backgroundColor: soft },
    cardGap: { width: 14 },
    cardTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 8 },
    bulletRow: { flexDirection: 'row', marginBottom: 6 },
    bulletDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: accent, marginTop: 4.5, marginRight: 8 },
    bulletText: { flex: 1, fontSize: 10, lineHeight: 1.45 },
    module: { marginBottom: 14, borderRadius: 14, borderWidth: 1, borderColor: LINE, overflow: 'hidden' },
    moduleHead: { flexDirection: 'row', alignItems: 'center', backgroundColor: soft, paddingVertical: 10, paddingHorizontal: 12 },
    moduleNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: accent, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    moduleNumText: { color: '#ffffff', fontSize: 11, fontFamily: 'Helvetica-Bold' },
    moduleTitle: { flex: 1, fontSize: 12, fontFamily: 'Helvetica-Bold' },
    badge: { fontSize: 7.5, letterSpacing: 1, color: accent, fontFamily: 'Helvetica-Bold' },
    moduleSummary: { paddingHorizontal: 12, paddingTop: 8, fontSize: 9.5, lineHeight: 1.5, color: SOFT },
    item: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 7, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: LINE },
    itemNo: { width: 24, fontSize: 9, color: SOFT, fontFamily: 'Helvetica-Bold' },
    itemBody: { flex: 1 },
    itemTitle: { fontSize: 10.5 },
    itemNote: { marginTop: 2, fontSize: 8.5, lineHeight: 1.4, color: SOFT },
    itemTime: { fontSize: 8.5, color: SOFT, marginLeft: 8 },
    check: { width: 11, height: 11, borderRadius: 3, borderWidth: 1, borderColor: '#b9c4cf', marginRight: 8, marginTop: 1 },
    header: { position: 'absolute', top: 22, left: 44, right: 44, flexDirection: 'row', justifyContent: 'space-between' },
    headerText: { fontSize: 8, color: SOFT },
    footer: { position: 'absolute', bottom: 22, left: 44, right: 44, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: LINE, paddingTop: 8 },
    footText: { fontSize: 8, color: SOFT },
  });

  const Bullets = ({ items }: { items: string[] }) => (
    <View>
      {items.map((t, i) => (
        <View key={i} style={s.bulletRow} wrap={false}>
          <View style={s.bulletDot} />
          <Text style={s.bulletText}>{clean(t)}</Text>
        </View>
      ))}
    </View>
  );

  const Item = ({ it, n }: { it: CurriculumItem; n: string }) => (
    <View style={s.item} wrap={false}>
      <Text style={s.itemNo}>{n}</Text>
      <View style={s.check} />
      <View style={s.itemBody}>
        <Text style={s.itemTitle}>{clean(it.title)}</Text>
        {it.note ? <Text style={s.itemNote}>{clean(it.note)}</Text> : null}
      </View>
      {it.minutes ? <Text style={s.itemTime}>{minutesLabel(it.minutes)}</Text> : null}
    </View>
  );

  const hasOverview = doc.outcomes.length > 0 || doc.requirements.length > 0;
  const title = clean(doc.title);
  const totalLessons =
    doc.modules.reduce((n, m) => n + m.items.length, 0) + doc.lessons.length;

  return (
    <Document title={`${title} - Curriculum`} author="InTelleX" subject="Course curriculum">
      <Page size="A4" style={s.cover}>
        <View style={s.coverBand}>
          <View style={s.logoWrap}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={logo} style={s.logo} />
          </View>
          <Text style={s.kind}>{clean(doc.kind).toUpperCase()}  |  CURRICULUM</Text>
          <Text style={s.title}>{title}</Text>
          {doc.subtitle ? <Text style={s.subtitle}>{clean(doc.subtitle)}</Text> : null}
        </View>
        <View style={s.factsRow}>
          {doc.facts.slice(0, 6).map((f) => (
            <View key={f.label} style={s.fact}>
              <Text style={s.factLabel}>{clean(f.label).toUpperCase()}</Text>
              <Text style={s.factValue}>{clean(f.value)}</Text>
            </View>
          ))}
        </View>
        <View style={s.coverFoot}>
          {doc.instructor ? (
            <View style={{ marginBottom: 18 }}>
              <Text style={s.coverFootTitle}>INSTRUCTOR</Text>
              <Text style={[s.coverFootText, { color: INK, fontSize: 13, fontFamily: 'Helvetica-Bold' }]}>
                {clean(doc.instructor)}
              </Text>
            </View>
          ) : null}
          {doc.description ? (
            <View>
              <Text style={s.coverFootTitle}>ABOUT THIS COURSE</Text>
              <Text style={s.coverFootText}>{clean(doc.description).slice(0, 700)}</Text>
            </View>
          ) : null}
          <Text style={[s.footText, { marginTop: 28 }]}>
            {doc.preparedFor ? `Prepared for ${clean(doc.preparedFor)}  |  ` : ''}
            {doc.generatedAt}
          </Text>
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.header} fixed>
          <Text style={s.headerText}>{title}</Text>
          <Text style={s.headerText}>InTelleX</Text>
        </View>
        <View style={s.footer} fixed>
          <Text style={s.footText}>intellex.loopingbinary.com</Text>
          <Text style={s.footText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>

        {hasOverview ? (
          <View wrap={false}>
            <Text style={s.h2}>What you will get</Text>
            <View style={s.h2Rule} />
            <View style={s.twoCol}>
              {doc.outcomes.length > 0 ? (
                <View style={s.card}>
                  <Text style={s.cardTitle}>You will be able to</Text>
                  <Bullets items={doc.outcomes} />
                </View>
              ) : null}
              {doc.outcomes.length > 0 && doc.requirements.length > 0 ? <View style={s.cardGap} /> : null}
              {doc.requirements.length > 0 ? (
                <View style={[s.card, { backgroundColor: '#f4f6f8' }]}>
                  <Text style={s.cardTitle}>Before you start</Text>
                  <Bullets items={doc.requirements} />
                </View>
              ) : null}
            </View>
          </View>
        ) : null}

        <View style={{ marginTop: hasOverview ? 28 : 0 }}>
          <Text style={s.h2}>Curriculum</Text>
          <View style={s.h2Rule} />
          <Text style={[s.p, { marginBottom: 14 }]}>
            {doc.modules.length > 0 ? `${doc.modules.length} modules  |  ` : ''}
            {totalLessons} {totalLessons === 1 ? 'lesson' : 'lessons'}. Tick each box as you finish.
          </Text>
        </View>

        {doc.modules.map((m, mi) => (
          <View key={mi} style={s.module}>
            <View style={s.moduleHead} wrap={false}>
              <View style={s.moduleNum}>
                <Text style={s.moduleNumText}>{mi + 1}</Text>
              </View>
              <Text style={s.moduleTitle}>{clean(m.title)}</Text>
              {m.badge ? <Text style={s.badge}>{clean(m.badge).toUpperCase()}</Text> : null}
            </View>
            {m.summary ? <Text style={s.moduleSummary}>{clean(m.summary)}</Text> : null}
            <View style={{ marginTop: m.summary ? 8 : 0 }}>
              {m.items.map((it, ii) => (
                <Item key={ii} it={it} n={`${mi + 1}.${ii + 1}`} />
              ))}
            </View>
          </View>
        ))}

        {doc.lessons.length > 0 ? (
          <View style={s.module}>
            <View style={s.moduleHead} wrap={false}>
              <Text style={s.moduleTitle}>{doc.modules.length ? 'Lessons' : 'Course lessons'}</Text>
            </View>
            {doc.lessons.map((it, i) => (
              <Item key={i} it={it} n={String(i + 1).padStart(2, '0')} />
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
