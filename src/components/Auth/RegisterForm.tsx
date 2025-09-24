'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

export default function RegisterForm({ onSwitchToLogin, onSuccess }: RegisterFormProps) {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAllPasswords, setShowAllPasswords] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);

  // Password requirements are displayed in tooltip; validation happens on submit

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Backend password policy:
    // - at least 8 chars
    // - at least one uppercase, one lowercase, one number, one special char
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/\d/.test(formData.password)) {
      setError('Password must contain at least one number');
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError('Password must contain at least one special character');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (formData.username.length > 20) {
      setError('Username must be less than 20 characters long');
      return false;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      setError('Username can only contain letters, numbers, underscores, and hyphens');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    const result = await register(formData.username, formData.email, formData.password);
    
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="luxury-card p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gold-gradient mb-2">Join Knightfall</h2>
        <p className="text-gray-400">Create your account and start playing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-white placeholder-gray-400"
            placeholder="Choose a username"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-white placeholder-gray-400"
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>

        <div className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <button
                type="button"
                aria-label="Password requirements"
                title="Password requirements"
                className="w-5 h-5 rounded-full border border-gray-500/70 text-gray-300 text-xs flex items-center justify-center hover:text-white hover:border-gray-400 ml-[3px]"
                onMouseEnter={() => setShowPasswordTooltip(true)}
                onMouseLeave={() => setShowPasswordTooltip(false)}
                onFocus={() => setShowPasswordTooltip(true)}
                onBlur={() => setShowPasswordTooltip(false)}
              >
                ?
              </button>
              {/* Tooltip */}
              <div className={`pointer-events-none absolute left-1/2 -translate-x-1/2 mt-2 z-50 ${showPasswordTooltip ? 'block' : 'hidden'}`}>
                <div className="w-96 luxury-card p-3 text-xs text-gray-300 border border-gray-500 shadow-xl">
                  <p className="font-semibold text-white mb-2">Password requirements</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter (A-Z)</li>
                    <li>One lowercase letter (a-z)</li>
                    <li>One number (0-9)</li>
                    <li>One special character (!@#$%^&* etc.)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-white placeholder-gray-400 pr-12"
              placeholder="Create a password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-white placeholder-gray-400 pr-12"
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Show passwords toggle */}
        <div className="flex items-center gap-2 -mt-2">
          <input
            id="showPasswords"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-600 bg-gray-800/50 text-gold-500 focus:ring-gold"
            checked={showAllPasswords}
            onChange={(e) => {
              const checked = e.target.checked;
              setShowAllPasswords(checked);
              setShowPassword(checked);
              setShowConfirmPassword(checked);
            }}
            disabled={isLoading}
          />
          <label htmlFor="showPasswords" className="text-sm text-gray-300 select-none">
            Show passwords
          </label>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gold-gradient hover:bg-gold-gradient-hover text-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-gold hover:text-gold-light font-medium transition-colors"
            disabled={isLoading}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}