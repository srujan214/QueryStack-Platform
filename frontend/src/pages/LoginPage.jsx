import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import Input from '../components/Input';
import Button from '../components/Button';

const schema = z.object({
  usernameOrEmail: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setError('');
    const res = await login(data.usernameOrEmail, data.password);
    if (res.success) {
      toast.success('Welcome back!');
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
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-3xl p-8 shadow-card">
            <div className="text-center mb-8">
              <h1 className="font-display text-4xl font-bold gradient-text">QueryStack</h1>
              <p className="text-ink-muted mt-2 text-sm">Log in to continue your journey</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Username or Email" placeholder="srujan" icon={User} error={errors.usernameOrEmail?.message} {...register('usernameOrEmail')} />
              <Input type="password" label="Password" placeholder="••••••••" icon={Lock} error={errors.password?.message} {...register('password')} />
              <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" />Logging in...</>) : ('Log In')}
              </Button>
            </form>

            <p className="text-center text-sm text-ink-muted mt-6">
              New here?{' '}
              <Link to="/register" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">Create an account</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}