import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const Input = forwardRef(({ label, error, icon: Icon, className, ...props }, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-ink-muted mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className={cn('relative rounded-xl transition-all duration-200', focused && 'shadow-glow')}>
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />}
        <input
          ref={ref}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={cn(
            'w-full bg-surface-50 border border-white/5 rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-subtle',
            'focus:border-primary-500/50 focus:bg-surface-100 transition-all duration-200',
            Icon && 'pl-10',
            error && 'border-red-500/50',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5 ml-1">
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;