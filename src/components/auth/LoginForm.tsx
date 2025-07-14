import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { validateEmail } from '../../lib/utils';
import { Eye, EyeOff, User, Mail } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'email' | 'username'>('username');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = `${loginType === 'email' ? 'Email' : 'Username'} is required`;
    } else if (loginType === 'email' && !validateEmail(formData.emailOrUsername)) {
      newErrors.emailOrUsername = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const credentials = {
        password: formData.password,
        ...(loginType === 'email' 
          ? { email: formData.emailOrUsername }
          : { username: formData.emailOrUsername }
        )
      };

      await login(credentials);
      navigate(from, { replace: true });
    } catch (error: any) {
      setErrors({ submit: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">SS</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Welcome Back</h1>
            <p className="text-gray-300">Sign in to SocialSphere</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login Type Toggle */}
            <div className="flex rounded-lg bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setLoginType('username')}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  loginType === 'username'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Username
              </button>
              <button
                type="button"
                onClick={() => setLoginType('email')}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  loginType === 'email'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </button>
            </div>

            <Input
              name="emailOrUsername"
              type={loginType === 'email' ? 'email' : 'text'}
              placeholder={loginType === 'email' ? 'Enter your email' : 'Enter your username'}
              value={formData.emailOrUsername}
              onChange={handleInputChange}
              error={errors.emailOrUsername}
              className="bg-white/15 border-white/30 text-white placeholder:text-gray-400 backdrop-blur-xl"
            />

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                className="bg-white/15 border-white/30 text-white placeholder:text-gray-400 pr-12 backdrop-blur-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {errors.submit && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg p-3">
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full text-lg font-semibold"
              size="lg"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;