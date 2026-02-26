import { useState, useEffect, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';

const SCROLL_THRESHOLD = 400;

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    setVisible(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed z-[80] flex items-center justify-center rounded-full border border-white/30 bg-primary-500/75 backdrop-blur-md text-white shadow-xl shadow-primary-500/20 hover:bg-primary-500/90 hover:shadow-2xl hover:shadow-primary-500/25 hover:-translate-y-0.5 hover:border-white/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-400/80 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 ease-out animate-scale-in
        h-12 w-12 right-4 bottom-[calc(1.5rem+env(safe-area-inset-bottom))]
        sm:h-14 sm:w-14 sm:right-6 sm:bottom-6"
    >
      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} aria-hidden />
    </button>
  );
}
