'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  detectBrowserLocale,
  persistLocaleCookie,
  type Locale,
} from '@/lib/i18n/locale';
import { translateUiText, TRANSLATABLE_ATTRS } from '@/lib/i18n/translate';

const LocaleContext = createContext<Locale>('en');

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useT() {
  const locale = useLocale();
  return useCallback((text: string) => translateUiText(text, locale), [locale]);
}

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'IFRAME',
  'OBJECT',
  'EMBED',
  'SVG',
  'MATH',
  'PRE',
  'CODE',
  'KBD',
  'SAMP',
  'TEXTAREA',
  'INPUT',
  'SELECT',
  'OPTION',
  'CANVAS',
  'VIDEO',
  'AUDIO',
]);

function isBlockedElement(el: Element): boolean {
  if (SKIP_TAGS.has(el.tagName)) return true;
  if (el.hasAttribute('data-no-i18n')) return true;
  if (el.classList.contains('tutorial-code') || el.classList.contains('tutorial-prose')) return true;
  // html[translate=no] blocks Google Translate, not our dictionary walker.
  if (el !== document.documentElement && el.getAttribute('translate') === 'no') return true;
  if (el !== document.documentElement && el.classList.contains('notranslate')) return true;
  const editable = el.getAttribute('contenteditable');
  return editable === 'true' || editable === '';
}

function skipSubtree(el: Element | null): boolean {
  let current: Element | null = el;
  while (current && current !== document.documentElement) {
    if (isBlockedElement(current)) return true;
    current = current.parentElement;
  }
  return false;
}

function translateAttributes(el: Element, locale: Locale) {
  if (skipSubtree(el)) return;
  for (const attr of TRANSLATABLE_ATTRS) {
    const current = el.getAttribute(attr);
    if (!current) continue;
    const next = translateUiText(current, locale);
    if (next !== current) el.setAttribute(attr, next);
  }
}

function applyInRoot(root: Node, locale: Locale) {
  if (locale !== 'fr') return;
  if (root.nodeType === Node.TEXT_NODE) {
    const node = root as Text;
    if (skipSubtree(node.parentElement)) return;
    const raw = node.nodeValue;
    if (!raw || !raw.trim()) return;
    const next = translateUiText(raw, locale);
    if (next !== raw) node.nodeValue = next;
    return;
  }
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return skipSubtree(node as Element) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
      }
      const parent = node.parentElement;
      if (!parent || skipSubtree(parent)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let current: Node | null;
  const texts: Text[] = [];
  while ((current = walker.nextNode())) {
    if (current.nodeType === Node.TEXT_NODE) texts.push(current as Text);
  }
  for (const node of texts) {
    const raw = node.nodeValue;
    if (!raw || !raw.trim()) continue;
    const next = translateUiText(raw, locale);
    if (next !== raw) node.nodeValue = next;
  }

  const scope: ParentNode | null =
    root.nodeType === Node.ELEMENT_NODE
      ? (root as Element)
      : root.nodeType === Node.DOCUMENT_FRAGMENT_NODE
        ? (root as DocumentFragment)
        : document.body;
  if (!scope || !('querySelectorAll' in scope)) return;
  if (root instanceof Element) translateAttributes(root, locale);
  scope.querySelectorAll('[placeholder], [title], [aria-label], [alt]').forEach((el) => {
    translateAttributes(el, locale);
  });
}

export default function I18nRoot({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const localeRef = useRef<Locale>(initialLocale);

  useEffect(() => {
    const resolved = detectBrowserLocale();
    localeRef.current = resolved;
    setLocale(resolved);
    persistLocaleCookie(resolved);
    document.documentElement.lang = resolved;
    document.documentElement.setAttribute('translate', 'no');
    document.documentElement.classList.add('notranslate');
    applyInRoot(document.body, resolved);

    if (resolved === 'en') return undefined;

    const observer = new MutationObserver((mutations) => {
      observer.disconnect();
      for (const mutation of mutations) {
        if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
          const node = mutation.target as Text;
          if (skipSubtree(node.parentElement)) continue;
          const raw = node.nodeValue;
          if (!raw) continue;
          const next = translateUiText(raw, localeRef.current);
          if (next !== raw) node.nodeValue = next;
        } else if (mutation.type === 'attributes' && mutation.target instanceof Element) {
          translateAttributes(mutation.target, localeRef.current);
        } else if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => applyInRoot(node, localeRef.current));
        }
      }
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: [...TRANSLATABLE_ATTRS],
      });
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRS],
    });

    return () => observer.disconnect();
  }, [initialLocale]);

  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
