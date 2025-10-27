import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * - Observa pathname + search + hash para cobrir mais tipos de navegação
 * - Tenta rolar o `document.scrollingElement` (window) e, se existir um
 *   container com overflow (ex: main, #root ou um elemento com
 *   [data-scroll-container]), também rola esse container.
 * - Passar `behavior="smooth"` permite transição suave.
 */
export default function ScrollToTop({ behavior = 'smooth' }) {
  const location = useLocation();
  const watch = `${location.pathname}${location.search}${location.hash}${location.key ?? ''}`;

  useEffect(() => {
    // 1) tentar rolar o scrollingElement (document)
    const scrollingEl = document.scrollingElement || document.documentElement || document.body;
    try {
      scrollingEl.scrollTo({ top: 0, left: 0, behavior });
    } catch (e) {
      scrollingEl.scrollTop = 0;
    }

    // fallback extra para casos onde body/documentElement controla o scroll
    try {
      document.documentElement && (document.documentElement.scrollTop = 0);
      document.body && (document.body.scrollTop = 0);
    } catch (e) {
      // ignore
    }

    // 2) se existir um container rolável dentro do app (ex: main, #root,
    //    [data-scroll-container]), rolar também esse container.
    const candidates = [
      document.querySelector('[data-scroll-container]'),
      document.querySelector('main'),
      document.getElementById('root'),
      document.querySelector('.app'),
    ];

    for (const el of candidates) {
      if (!el) continue;
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      const isScrollable = (el.scrollHeight > el.clientHeight) && (overflowY && overflowY !== 'visible' && overflowY !== 'hidden');
      // se o elemento permite scroll vertical, resetar seu scrollTop
      if (isScrollable) {
        try {
          el.scrollTo({ top: 0, left: 0, behavior });
        } catch (e) {
          el.scrollTop = 0;
        }
      }
    }
  }, [watch, behavior]);

  return null;
}
