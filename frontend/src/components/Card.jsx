import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export default function Card({ children, className, hover = false, ...props }) {
  const Comp = hover ? motion.div : 'div';
  const motionProps = hover
    ? {
        whileHover: { y: -2, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' },
        transition: { type: 'spring', stiffness: 300, damping: 25 },
      }
    : {};

  return (
    <Comp
      className={cn(
        'bg-surface-100/80 backdrop-blur-sm border border-white/5 rounded-2xl shadow-card transition-all duration-200',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  );
}