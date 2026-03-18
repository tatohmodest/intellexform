'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, BookOpen, Zap, Globe, Star, Calendar } from 'lucide-react';
import { PROGRAMS } from '@/lib/programs';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const STATS = [
  { icon: Users, label: 'Learners since 2023', value: '600+' },
  { icon: BookOpen, label: 'Programs available', value: '11' },
  { icon: Globe, label: 'Online - Cameroon', value: '100%' },
  { icon: Calendar, label: 'Founded', value: 'Oct 2023' },
];

const FEATURED_PROGRAMS = PROGRAMS.filter((p) => p.type === 'full').slice(0, 6);

export default function HomePage() {
  return (
    <main className="min-h-screen bg-navy-900 relative overflow-x-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid-pattern opacity-100 pointer-events-none" />

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-6 border-b border-gold-500/10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Intellex" className="h-8 w-auto object-contain" />
          <span className="text-xs text-intellex-muted font-body tracking-widest uppercase">
            Early Access
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <a
            href="https://wa.me/237650318856"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-sm text-intellex-muted hover:text-gold-400 transition-colors"
          >
            <span>WhatsApp Support</span>
          </a>
          <Link
            href="/register"
            className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-navy-900 text-sm font-semibold rounded-full hover:bg-gold-300 transition-all duration-200 hover:scale-105"
          >
            Register Now <ArrowRight size={14} />
          </Link>
        </motion.div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative z-10 pt-20 pb-16 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-semibold tracking-wider uppercase mb-8"
        >
          <Zap size={12} className="fill-gold-400" />
          Early Access Now Open
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="font-display text-5xl md:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
        >
          The future of{' '}
          <span className="gradient-text">tech education</span>
          <br />
          in Cameroon.
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="text-intellex-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Intellex is a multi-mode digital learning platform - self-paced courses, live
          tutoring, mentorship, and AI assistance - built to turn you from curious to capable.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/register"
            className="flex items-center gap-3 px-8 py-4 bg-gold-500 text-navy-900 font-semibold text-base rounded-full hover:bg-gold-300 transition-all duration-200 hover:scale-105 gold-glow w-full sm:w-auto justify-center"
          >
            Get Early Access
            <ArrowRight size={18} />
          </Link>
          <a
            href="#programs"
            className="flex items-center gap-2 px-8 py-4 border border-gold-500/25 text-intellex-text rounded-full hover:border-gold-500/50 hover:bg-gold-500/5 transition-all duration-200 text-base w-full sm:w-auto justify-center"
          >
            Explore Programs
          </a>
        </motion.div>
      </section>

      {/* ── STATS ───────────────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i + 4}
              className="glass-card p-5 text-center"
            >
              <stat.icon size={20} className="text-gold-400 mx-auto mb-2" />
              <div className="font-display text-2xl font-bold text-intellex-text mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-intellex-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PROGRAMS ────────────────────────────────────────── */}
      <section id="programs" className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Programs that <span className="gradient-text">build careers</span>
          </h2>
          <p className="text-intellex-muted text-lg max-w-xl mx-auto">
            From absolute beginner to production-ready developer. Full programs or focused
            modules - you choose your pace and path.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_PROGRAMS.map((prog, i) => (
            <motion.div
              key={prog.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="glass-card p-6 hover:border-gold-500/25 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
            >
              {prog.badge && (
                <span className="absolute top-4 right-4 text-xs bg-gold-500/20 text-gold-400 px-3 py-1 rounded-full font-semibold border border-gold-500/20">
                  {prog.badge}
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={prog.logoUrl}
                  alt={prog.shortTitle}
                  width={36}
                  height={36}
                  className="rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div>
                  <div className="font-display font-semibold text-intellex-text text-base leading-tight">
                    {prog.shortTitle}
                  </div>
                  <div className="text-xs text-intellex-muted">{prog.duration}</div>
                </div>
              </div>

              <p className="text-intellex-muted text-sm leading-relaxed mb-4 line-clamp-2">
                {prog.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {prog.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-intellex-muted border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
                {prog.technologies.length > 4 && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-intellex-muted">
                    +{prog.technologies.length - 4} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div>
                  <div className="text-gold-400 font-display font-bold text-lg">
                    {prog.monthlyXAF
                      ? `${(prog.monthlyXAF / 1000).toFixed(0)}k XAF/mo`
                      : `${(prog.priceXAF / 1000).toFixed(0)}k XAF`}
                  </div>
                  <div className="text-xs text-intellex-muted">{prog.level}</div>
                </div>
                <Link
                  href="/register"
                  className="text-xs flex items-center gap-1.5 text-gold-400 hover:text-gold-300 transition-colors group-hover:gap-2.5"
                >
                  Enroll <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mt-8"
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-intellex-muted hover:text-gold-400 transition-colors text-sm"
          >
            + 5 more module programs available → Register to see all
          </Link>
        </motion.div>
      </section>

      {/* ── WHAT MAKES US DIFFERENT ─────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="glass-card p-8 md:p-12 text-center"
        >
          <Star size={28} className="text-gold-400 mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Started with a WhatsApp group.
            <br />
            <span className="gradient-text">Growing into a movement.</span>
          </h2>
          <p className="text-intellex-muted text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Intellex was born in October 2023 with one mission: make real tech education
            accessible in Cameroon. Within a year, over 600 learners joined through a simple
            WhatsApp community. Now we&apos;re building the platform that community deserves -
            structured, supported, and built for outcomes.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gold-500 text-navy-900 font-semibold rounded-full hover:bg-gold-300 transition-all duration-200 hover:scale-105"
          >
            Be part of what&apos;s next <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-gold-500/10 px-6 py-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Intellex" className="h-7 w-auto object-contain mx-auto mb-2" />
        <p className="text-intellex-muted text-sm mb-3">
          Digital Learning Platform · Cameroon · Online Only
        </p>
        <div className="flex items-center justify-center gap-6 text-xs text-intellex-muted">
          <a
            href="https://wa.me/237650318856"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-400 transition-colors"
          >
            WhatsApp: +237 650 318 856
          </a>
          <span>·</span>
          <span>MTN MoMo: 674 435 138</span>
          <span>·</span>
          <span>Orange: 686 705 607</span>
        </div>
      </footer>
    </main>
  );
}
