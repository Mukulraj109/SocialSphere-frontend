import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Camera, Upload, X, Eye, EyeOff } from 'lucide-react';
import { formatFileSize } from '../../lib/utils';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [files, setFiles] = useState<{
    avatar?: File;
    coverImage?: File;
  }>({});

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await apiClient.updateUserDetails(formData);
      if (response.success) {
        updateUser(response.data);
        setIsEditing(false);
      }
    } catch (error: any) {
      setErrors({ profile: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ password: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await apiClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (response.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        // Show success message
      }
    } catch (error: any) {
      setErrors({ password: error.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'avatar' | 'coverImage') => {
    setLoading(true);
    try {
      let response;
      if (type === 'avatar') {
        response = await apiClient.updateAvatar(file);
      } else {
        response = await apiClient.updateCoverImage(file);
      }

      if (response.success) {
        updateUser(response.data);
        setFiles(prev => ({ ...prev, [type]: undefined }));
      }
    } catch (error: any) {
      setErrors({ [type]: error.message || `Failed to update ${type}` });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ [type]: 'File size must be less than 5MB' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors({ [type]: 'Please select an image file' });
        return;
      }
      setFiles(prev => ({ ...prev, [type]: file }));
      setErrors(prev => ({ ...prev, [type]: '' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Cover Image Section */}
      <div className="relative">
        <div 
          className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl relative overflow-hidden"
          style={{
            backgroundImage: user?.coverImage ? `url(${user.coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <label className="absolute bottom-4 right-4 cursor-pointer">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-colors">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'coverImage')}
              className="hidden"
            />
          </label>
        </div>

        {/* Cover Image Upload Preview */}
        {files.coverImage && (
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{files.coverImage.name}</p>
                <p className="text-xs text-gray-600">{formatFileSize(files.coverImage.size)}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleFileUpload(files.coverImage!, 'coverImage')}
                  isLoading={loading}
                >
                  Upload
                </Button>
                <button
                  onClick={() => setFiles(prev => ({ ...prev, coverImage: undefined }))}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <div className="relative -mt-20 ml-8">
        <div className="flex items-end space-x-6">
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt="Profile"
              className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
            <label className="absolute bottom-2 right-2 cursor-pointer">
              <div className="bg-white rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow">
                <Camera className="w-4 h-4 text-gray-600" />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'avatar')}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">{user?.fullName}</h1>
            <p className="text-gray-600">@{user?.username}</p>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
          </div>

          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
            className="mb-4"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {/* Avatar Upload Preview */}
        {files.avatar && (
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{files.avatar.name}</p>
                <p className="text-xs text-gray-600">{formatFileSize(files.avatar.size)}</p>
              </div>
              <div className="flex space-x-2 ml-auto">
                <Button
                  size="sm"
                  onClick={() => handleFileUpload(files.avatar!, 'avatar')}
                  isLoading={loading}
                >
                  Upload
                </Button>
                <button
                  onClick={() => setFiles(prev => ({ ...prev, avatar: undefined }))}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
        
        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              error={errors.fullName}
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              error={errors.email}
            />
            
            {errors.profile && (
              <div className="text-red-600 text-sm bg-red-50 rounded-lg p-3">
                {errors.profile}
              </div>
            )}

            <div className="flex space-x-4">
              <Button type="submit" isLoading={loading}>
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="mt-1 text-gray-900">{user?.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <p className="mt-1 text-gray-900">@{user?.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Member Since</label>
              <p className="mt-1 text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="relative">
            <Input
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {errors.password && (
            <div className="text-red-600 text-sm bg-red-50 rounded-lg p-3">
              {errors.password}
            </div>
          )}

          <Button type="submit" isLoading={loading}>
            Change Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;