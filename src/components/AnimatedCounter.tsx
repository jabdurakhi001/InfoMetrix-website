import { useRef, useState, useEffect } from 'react';
import { useInView, animate } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({ value, suffix = '', prefix = '' }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate(latest) {
          setDisplayValue(Math.round(latest));
        }
      });
      return controls.stop;
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
