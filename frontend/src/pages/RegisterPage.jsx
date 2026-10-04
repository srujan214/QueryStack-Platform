import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Mail, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import Input from '../components/Input';
import Button from '../components/Button';

const schema = z.object({
  username: z.string().min(3, 'At least 3 characters').max(50).regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores'),
  email: z.string().email('Invalid email'),
  displayName: z.string().min(1, 'Required').max(100),
  password: z.string().min(6, 'At least 6 characters'),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setError('');
    const res = await registerUser(data);
    if (res.success) {
      toast.success('Account created!');
      navigate('/');
    } else {
      setError(res.message);
      toast.error(res.message);
    }
  };

  return (
    <>
      <div className="aurora-bg" />
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="glass rounded-3xl p-8 shadow-card">
            <div className="text-center mb-8">
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-glow">
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="font-display text-4xl font-bold gradient-text">Join QueryStack</h1>
              <p className="text-ink-muted mt-2 text-sm">Ask questions. Share answers.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Username" placeholder="srujan" icon={User} error={errors.username?.message} {...register('username')} />
              <Input label="Display Name" placeholder="Srujan Kumar" icon={Sparkles} error={errors.displayName?.message} {...register('displayName')} />
              <Input label="Email" type="email" placeholder="srujan@example.com" icon={Mail} error={errors.email?.message} {...register('email')} />
              <Input type="password" label="Password" placeholder="At least 6 characters" icon={Lock} error={errors.password?.message} {...register('password')} />
              <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" />Creating account...</>) : ('Create Account')}
              </Button>
            </form>

            <p className="text-center text-sm text-ink-muted mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">Log in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}