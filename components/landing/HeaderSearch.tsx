'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import SiteSearch from '@/components/landing/SiteSearch';
import { useSearchIndex } from '@/lib/search/useSearchIndex';

export default function HeaderSearch() {
  const { courses, tutorials, loading, ensureLoaded } = useSearchIndex();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const mobileSheet =
    mounted &&
    createPortal(
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-[10000] flex flex-col md:hidden"
            style={{ background: 'var(--paper)' }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--line)' }}>
              <span className="font-display text-[18px]">Search</span>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: 'var(--paper-dim)' }}
                aria-label="Close search"
                onClick={() => setMobileOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <SiteSearch
                variant="header"
                autoFocus
                courses={courses}
                tutorialIndex={tutorials}
                loading={loading}
                onFocusSearch={() => {
                  void ensureLoaded();
                }}
                onNavigate={() => setMobileOpen(false)}
                placeholder="Courses, tutorials, lessons…"
                className="w-full"
              />
              <p className="mt-3 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                Search the full catalogue — paid courses and free tutorial paths.
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body,
    );

  return (
    <>
      {/* Desktop / tablet inline search */}
      <div className="relative hidden min-w-0 flex-1 overflow-visible md:block md:max-w-[18rem] lg:max-w-[22rem] xl:max-w-[28rem]">
        <SiteSearch
          variant="header"
          compact
          courses={courses}
          tutorialIndex={tutorials}
          loading={loading}
          onFocusSearch={() => {
            void ensureLoaded();
          }}
          placeholder="Search courses & tutorials…"
          className="w-full"
        />
      </div>

      {/* Mobile search trigger — left cluster; menu stays far right */}
      <button
        type="button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:hidden"
        style={{ background: 'var(--paper-dim)' }}
        aria-label="Search"
        onClick={() => {
          setMobileOpen(true);
          void ensureLoaded();
        }}
      >
        <Search size={18} />
      </button>

      {mobileSheet}
    </>
  );
}
