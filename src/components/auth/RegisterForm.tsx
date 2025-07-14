import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { validateEmail, validatePassword, formatFileSize } from '../../lib/utils';
import { Eye, EyeOff, Upload, X, Image } from 'lucide-react';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [files, setFiles] = useState<{
    avatar?: File;
    coverImage?: File;
  }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('username', formData.username);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('password', formData.password);
      formDataToSubmit.append('fullName', formData.fullName);
      
      if (files.avatar) {
        formDataToSubmit.append('avatar', files.avatar);
      }
      if (files.coverImage) {
        formDataToSubmit.append('coverImage', files.coverImage);
      }

      await register(formDataToSubmit);
      navigate('/dashboard');
    } catch (error: any) {
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, [type]: 'File size must be less than 5MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, [type]: 'Please select an image file' }));
        return;
      }
      setFiles(prev => ({ ...prev, [type]: file }));
      setErrors(prev => ({ ...prev, [type]: '' }));
    }
  };

  const removeFile = (type: 'avatar' | 'coverImage') => {
    setFiles(prev => ({ ...prev, [type]: undefined }));
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">SS</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Join SocialSphere</h1>
            <p className="text-gray-300">Create your account and connect with the world</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username}
                className="bg-white/15 border-white/30 text-white placeholder:text-gray-400 backdrop-blur-xl"
              />
              <Input
                name="fullName"
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
                className="bg-white/15 border-white/30 text-white placeholder:text-gray-400 backdrop-blur-xl"
              />
            </div>

            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              className="bg-white/15 border-white/30 text-white placeholder:text-gray-400 backdrop-blur-xl"
            />

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
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

            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                className="bg-white/15 border-white/30 text-white placeholder:text-gray-400 pr-12 backdrop-blur-xl"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* File Upload Sections */}
            <div className="space-y-4">
              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Picture (Optional)
                </label>
                {!files.avatar ? (
                  <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer hover:border-white/50 transition-all duration-300 hover:bg-white/5 backdrop-blur-sm">
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1 transition-transform hover:scale-110" />
                      <p className="text-sm text-gray-400">Upload Avatar</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'avatar')}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <Image className="w-5 h-5 text-indigo-400" />
                      <div>
                        <p className="text-white text-sm font-medium">{files.avatar.name}</p>
                        <p className="text-gray-400 text-xs">{formatFileSize(files.avatar.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('avatar')}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {errors.avatar && <p className="text-red-400 text-sm mt-1">{errors.avatar}</p>}
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Image (Optional)
                </label>
                {!files.coverImage ? (
                  <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer hover:border-white/50 transition-all duration-300 hover:bg-white/5 backdrop-blur-sm">
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1 transition-transform hover:scale-110" />
                      <p className="text-sm text-gray-400">Upload Cover</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'coverImage')}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
                    <div className="flex items-center space-x-3">
                      <Image className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white text-sm font-medium">{files.coverImage.name}</p>
                        <p className="text-gray-400 text-xs">{formatFileSize(files.coverImage.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('coverImage')}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {errors.coverImage && <p className="text-red-400 text-sm mt-1">{errors.coverImage}</p>}
              </div>
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;