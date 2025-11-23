import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { authService } from '../services/authService';
import { AuthResponse } from '../types';

interface RegisterFormProps {
  onSuccess: (data: AuthResponse) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register(formData.name, formData.email, formData.password);
      onSuccess(response);
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Start your journey with us today
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            icon={<UserIcon className="w-5 h-5" />}
          />
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            icon={<Mail className="w-5 h-5" />}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            icon={<Lock className="w-5 h-5" />}
            error={error || undefined}
          />
        </div>

        <Button type="button" variant="primary" fullWidth isLoading={isLoading} onClick={handleSubmit}>
          Sign up <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="flex justify-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-medium text-black hover:underline focus:outline-none">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};