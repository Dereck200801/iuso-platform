import { useEffect, useRef, useState } from "react";

/**
 * Hook simple: ajoute l'animation quand l'élément entre dans le viewport.
 * Utilisation :
 * const { ref, isVisible } = useScrollReveal();
 * <div ref={ref} className={cn(base, isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>...</div>
 */
export const useScrollReveal = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible } as const;
}; 