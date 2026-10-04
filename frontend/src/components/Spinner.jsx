import { motion } from 'framer-motion';

export default function Spinner({ size = 40, className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className="rounded-full border-2 border-primary-500/20 border-t-primary-500"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}