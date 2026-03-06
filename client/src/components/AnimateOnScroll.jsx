import { useRef, useEffect, useState } from 'react';

/**
 * Wraps content and reveals it with an animation when the element enters the viewport.
 * @param {string} variant - 'up' | 'scale' | 'left' | 'right' (default: 'up')
 * @param {number} delay - optional delay in ms before animation runs
 * @param {number} threshold - intersection ratio 0-1 (default 0.1 = trigger when 10% visible)
 * @param {string} className - extra classes for the wrapper
 */
export default function AnimateOnScroll({
  children,
  variant = 'up',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  className = '',
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutId = setTimeout(() => setVisible(true), delay);
          } else {
            setVisible(true);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [threshold, rootMargin, delay]);

  const variantClass = {
    up: 'reveal-in',
    scale: 'reveal-in reveal-scale',
    left: 'reveal-in reveal-left',
    right: 'reveal-in reveal-right',
    fade: 'reveal-in reveal-fade',
  }[variant] ?? 'reveal-in';

  return (
    <Tag
      ref={ref}
      className={`${variantClass} ${visible ? 'reveal-visible' : ''} ${className}`.trim()}
      style={delay && visible ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
