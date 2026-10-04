import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

const variants = {
  primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-600 shadow-glow',
  secondary: 'bg-surface-100 text-ink hover:bg-surface-200 border border-white/5',
  outline: 'border border-primary-500/40 text-primary-400 hover:bg-primary-500/10',
  ghost: 'text-ink-muted hover:bg-white/5 hover:text-ink',
  danger: 'bg-red-500/90 text-white hover:bg-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
  icon: 'p-2',
};

const Button = forwardRef(({ children, variant = 'primary', size = 'md', loading = false, disabled = false, className, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;