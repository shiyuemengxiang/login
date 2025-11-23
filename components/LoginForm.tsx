import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { authService } from '../services/authService';
import { AuthResponse } from '../types';

interface LoginFormProps {
  onSuccess: (data: AuthResponse) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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

    try {
      const response = await authService.login(formData.email, formData.password);
      onSuccess(response);
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please sign in to your account
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-black hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        <Button type="button" variant="primary" fullWidth isLoading={isLoading} onClick={handleSubmit}>
          Sign in <ArrowRight className="w-4 h-4 ml-2" />
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
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="font-medium text-black hover:underline focus:outline-none">
            Sign up for free
          </button>
        </p>
      </div>
    </div>
  );
};