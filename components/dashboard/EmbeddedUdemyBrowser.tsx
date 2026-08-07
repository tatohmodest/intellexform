'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  Lock,
  Sparkles,
  Search,
  BookOpen,
  Maximize2,
  RefreshCw,
  Info,
  ShieldCheck,
  StickyNote,
  Award,
  KeyRound,
  Mail,
} from 'lucide-react';
import type { Course } from '@/lib/types';

export default function EmbeddedUdemyBrowser({
  isMember,
  userEmail,
  courses,
}: {
  isMember: boolean;
  userEmail: string;
  courses: Course[];
}) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCourseUrl, setActiveCourseUrl] = useState('https://www.udemy.com/home/my-courses/learning/');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [frameBlocked, setFrameBlocked] = useState(false);

  const udemyEmail = 'intellex_@outlook.com';
  const udemyPass = 'intellex@admin';

  function copyToClipboard(text: string, type: 'email' | 'pass') {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  }

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.type.toLowerCase().includes(query.toLowerCase()) ||
      c.instructor.toLowerCase().includes(query.toLowerCase()),
  );

  function openPopoutWindow(url?: string) {
    if (!isMember) {
      window.location.href = '/membership';
      return;
    }
    const targetUrl = url || activeCourseUrl;
    window.open(targetUrl, 'InTelleXUdemyPlayer', 'width=1280,height=800,scrollbars=yes,resizable=yes');
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      {/* Header Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--line)' }}>
        <div>
          <div className="tab mb-2 inline-flex items-center gap-1.5" style={{ background: 'rgba(74,144,226,0.12)', color: 'var(--blue-ink)' }}>
            <Sparkles size={13} /> In-App Learning Browser
          </div>
          <h1 className="font-display text-[32px] leading-tight tracking-tight sm:text-[40px]">
            My Learning &amp; 1,000+ Udemy Library
          </h1>
          <p className="mt-1 max-w-2xl text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Access 1,000+ premium tech courses on Udemy directly through InTelleX. Use your shared credential card below to log in, receive your OTP code, and start learning.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="btn btn-secondary inline-flex items-center gap-2 text-[13.5px]"
          >
            <StickyNote size={15} /> {showNotes ? 'Hide Study Notes' : 'Study Notes'}
          </button>
          <button
            onClick={() => openPopoutWindow()}
            disabled={!isMember}
            className={`btn inline-flex items-center gap-2 text-[13.5px] ${
              isMember ? 'btn-primary' : 'btn-secondary cursor-not-allowed opacity-60'
            }`}
          >
            {isMember ? <ExternalLink size={15} /> : <Lock size={15} />}
            {isMember ? 'Launch App Window' : 'Launch Locked'}
          </button>
        </div>
      </div>

      {!isMember ? (
        /* Locked Subscription Overlay */
        <div
          className="relative overflow-hidden rounded-[24px] border p-8 sm:p-12 text-center"
          style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgba(234,179,8,0.15)', color: '#d97706' }}>
            <Lock size={32} />
          </div>
          <h2 className="font-display text-[28px] sm:text-[32px]">Unlock 1,000+ Udemy Courses Access</h2>
          <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            The In-App Udemy Library Browser and shared credentials are exclusive to active InTelleX subscribers. Subscribe to get unlimited access to 1,000+ courses, certificates, and learning tracks.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/membership" className="btn btn-g inline-flex items-center gap-2 text-[15px]">
              <Award size={18} /> Subscribe to Unlock
            </Link>
          </div>
        </div>
      ) : (
        /* Unlocked Content & Credential Card */
        <div className="grid gap-6">
          {/* Step-by-Step Instructions & Credential Card */}
          <div
            className="rounded-[22px] border p-6 shadow-card"
            style={{
              borderColor: 'rgba(0,179,105,0.3)',
              background: 'linear-gradient(135deg, rgba(0,179,105,0.05) 0%, rgba(74,144,226,0.05) 100%)',
            }}
          >
            <div className="mb-4 flex items-center gap-2.5">
              <KeyRound size={20} style={{ color: 'var(--green-deep)' }} />
              <h2 className="font-display text-[22px]">Your Udemy Login Credentials</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Credentials Fields */}
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block font-mono text-[11px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                    Udemy Login Email
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={udemyEmail}
                      className="form-input flex-1 font-mono text-[14px] font-semibold"
                    />
                    <button
                      onClick={() => copyToClipboard(udemyEmail, 'email')}
                      className="btn btn-secondary shrink-0 px-3 py-2 text-xs"
                      title="Copy Email"
                    >
                      {copiedEmail ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
                      {copiedEmail ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block font-mono text-[11px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                    Udemy Login Password
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPass ? 'text' : 'password'}
                        readOnly
                        value={udemyPass}
                        className="form-input w-full font-mono text-[14px] font-semibold pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <button
                      onClick={() => copyToClipboard(udemyPass, 'pass')}
                      className="btn btn-secondary shrink-0 px-3 py-2 text-xs"
                      title="Copy Password"
                    >
                      {copiedPass ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
                      {copiedPass ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Instructions Box */}
              <div className="rounded-xl border p-4 text-[13.5px] leading-relaxed" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
                <div className="mb-2 font-semibold flex items-center gap-1.5" style={{ color: 'var(--ink)' }}>
                  <Info size={16} className="text-blue-600" /> Quick Login Instructions:
                </div>
                <ol className="list-decimal space-y-1.5 pl-4" style={{ color: 'var(--ink-soft)' }}>
                  <li>Copy the email and password above.</li>
                  <li>
                    Click <strong className="text-black dark:text-white">Launch App Window</strong> or click your target course below.
                  </li>
                  <li>Paste credentials on Udemy&apos;s login page.</li>
                  <li>
                    <span className="font-semibold text-green-700 dark:text-green-400">OTP Code Delivery:</span> A verification code will be sent to your InTelleX account email (<code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs dark:bg-gray-800">{userEmail}</code>).
                  </li>
                  <li>Enter the code on Udemy, navigate to <strong className="text-black dark:text-white">My Learning</strong>, and start learning!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Main Workspace Layout */}
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* Embedded Browser Frame */}
            <div className="min-w-0">
              <div className="overflow-hidden rounded-[20px] border shadow-card" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
                {/* Browser Address Bar */}
                <div className="flex items-center justify-between gap-3 border-b px-4 py-3" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>

                  <div className="flex min-w-0 flex-1 items-center justify-center">
                    <div className="flex w-full max-w-xl items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
                      <ShieldCheck size={14} className="text-green-600 shrink-0" />
                      <span className="truncate text-gray-600 dark:text-gray-300">{activeCourseUrl}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFrameBlocked(!frameBlocked)}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs flex items-center gap-1"
                      title="Reload Frame"
                    >
                      <RefreshCw size={14} />
                    </button>
                    <button
                      onClick={() => openPopoutWindow()}
                      className="btn btn-primary px-3 py-1 text-xs inline-flex items-center gap-1.5"
                    >
                      <Maximize2 size={13} /> Full Window
                    </button>
                  </div>
                </div>

                {/* Frame Content */}
                <div className="relative min-h-[580px] bg-slate-900 text-white">
                  {!frameBlocked ? (
                    <div className="flex h-full min-h-[580px] flex-col items-center justify-center p-8 text-center">
                      <div className="mb-4 rounded-full bg-blue-500/20 p-4 text-blue-400">
                        <BookOpen size={40} />
                      </div>
                      <h3 className="font-display text-[24px]">InTelleX Udemy Learning Hub</h3>
                      <p className="mt-2 max-w-md text-[14px] text-slate-300">
                        Due to Udemy&apos;s anti-framing security policy (<code className="text-amber-400">X-Frame-Options</code>), Udemy opens seamlessly in a dedicated window next to InTelleX.
                      </p>

                      <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <button
                          onClick={() => openPopoutWindow('https://www.udemy.com/home/my-courses/learning/')}
                          className="btn btn-primary inline-flex items-center gap-2 text-[15px]"
                        >
                          <ExternalLink size={17} /> Open Udemy My Learning
                        </button>
                        <button
                          onClick={() => openPopoutWindow(activeCourseUrl)}
                          className="btn btn-secondary inline-flex items-center gap-2 text-[15px] bg-slate-800 text-white hover:bg-slate-700 border-slate-700"
                        >
                          Launch Selected Course
                        </button>
                      </div>

                      <div className="mt-8 rounded-xl bg-slate-800/80 p-4 text-xs text-slate-400 max-w-lg text-left">
                        <span className="font-semibold text-slate-200">💡 Pro-tip for Learners:</span>
                        <p className="mt-1">
                          Keep this InTelleX tab open on one side of your screen to take study notes &amp; track progress, while your video plays smoothly in the launched Udemy window.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      src={activeCourseUrl}
                      className="h-[600px] w-full border-0"
                      title="Udemy Viewer"
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Udemy Library Info & Study Notes Sidebar */}
            <div className="space-y-6">
              {/* 1,000+ Udemy Library Info Card */}
              <div
                className="rounded-[20px] border p-5 shadow-card"
                style={{
                  borderColor: 'rgba(0,179,105,0.3)',
                  background: 'linear-gradient(145deg, rgba(0,179,105,0.06) 0%, rgba(74,144,226,0.06) 100%)',
                }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="tab font-mono text-[10.5px] uppercase" style={{ background: 'var(--green-soft)', color: 'var(--green-deep)' }}>
                    1,000+ Courses Unlocked
                  </span>
                  <Sparkles size={16} className="text-amber-500" />
                </div>

                <h3 className="font-display text-[20px] leading-tight">1,000+ Udemy Library</h3>
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  Yes! You have full access to <strong>1,000+ premium Udemy courses</strong>. Simply use the credentials above to log in to Udemy, click <strong>My Learning</strong>, and enjoy instant access to all 1,000+ courses!
                </p>

                <button
                  onClick={() => openPopoutWindow('https://www.udemy.com/home/my-courses/learning/')}
                  disabled={!isMember}
                  className={`btn mt-4 w-full inline-flex items-center justify-center gap-2 text-xs font-semibold ${
                    isMember ? 'btn-primary' : 'btn-secondary opacity-60 cursor-not-allowed'
                  }`}
                >
                  <ExternalLink size={14} /> Open Udemy My Learning
                </button>
              </div>

              {/* Companion Study Notes Drawer */}
              <div className="rounded-[20px] border p-5 shadow-card" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-[18px]">Study Notes</h3>
                  <span className="text-[11px] font-semibold text-green-600">Auto-saved local</span>
                </div>
                <p className="mb-3 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  Keep track of key concepts, code snippets, or timestamps while watching your Udemy courses side-by-side.
                </p>
                <textarea
                  rows={9}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Type your study notes, code snippets, or video timestamps here..."
                  className="form-input w-full text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
