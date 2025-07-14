import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Upload, Video, Image, X, CheckCircle, AlertCircle } from 'lucide-react';
import { formatFileSize } from '../../lib/utils';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [files, setFiles] = useState<{
    videoFile?: File;
    thumbnail?: File;
  }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'videoFile' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (file) {
      // File size validation
      const maxSize = type === 'videoFile' ? 100 * 1024 * 1024 : 5 * 1024 * 1024; // 100MB for video, 5MB for thumbnail
      if (file.size > maxSize) {
        setErrors(prev => ({ 
          ...prev, 
          [type]: `File size must be less than ${type === 'videoFile' ? '100MB' : '5MB'}` 
        }));
        return;
      }

      // File type validation
      const allowedTypes = type === 'videoFile' 
        ? ['video/mp4', 'video/avi', 'video/mov', 'video/wmv']
        : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          [type]: `Please select a valid ${type === 'videoFile' ? 'video' : 'image'} file` 
        }));
        return;
      }

      setFiles(prev => ({ ...prev, [type]: file }));
      setErrors(prev => ({ ...prev, [type]: '' }));
    }
  };

  const removeFile = (type: 'videoFile' | 'thumbnail') => {
    setFiles(prev => ({ ...prev, [type]: undefined }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!files.videoFile) {
      newErrors.videoFile = 'Video file is required';
    }

    if (!files.thumbnail) {
      newErrors.thumbnail = 'Thumbnail is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('videoFile', files.videoFile!);
      uploadFormData.append('thumbnail', files.thumbnail!);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      const response = await apiClient.publishVideo(uploadFormData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        setTimeout(() => {
          navigate('/dashboard/videos');
        }, 1000);
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Upload failed. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Video</h1>
        <p className="text-gray-600">Share your content with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Video Upload */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Video File</h2>
          
          {!files.videoFile ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all duration-300 hover:bg-indigo-50 group">
              <div className="text-center">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4 group-hover:text-indigo-500 transition-colors" />
                <p className="text-lg font-medium text-gray-700 mb-2">Upload your video</p>
                <p className="text-sm text-gray-500 mb-4">MP4, AVI, MOV, WMV up to 100MB</p>
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Video File
                </div>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, 'videoFile')}
                className="hidden"
              />
            </label>
          ) : (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{files.videoFile.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(files.videoFile.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile('videoFile')}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          {errors.videoFile && <p className="text-red-600 text-sm mt-2">{errors.videoFile}</p>}
        </div>

        {/* Thumbnail Upload */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thumbnail</h2>
          
          {!files.thumbnail ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-purple-500 transition-all duration-300 hover:bg-purple-50 group">
              <div className="text-center">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-3 group-hover:text-purple-500 transition-colors" />
                <p className="text-lg font-medium text-gray-700 mb-2">Upload thumbnail</p>
                <p className="text-sm text-gray-500 mb-4">JPG, PNG, WEBP up to 5MB</p>
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Thumbnail
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'thumbnail')}
                className="hidden"
              />
            </label>
          ) : (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={URL.createObjectURL(files.thumbnail)}
                    alt="Thumbnail preview"
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{files.thumbnail.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(files.thumbnail.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile('thumbnail')}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          {errors.thumbnail && <p className="text-red-600 text-sm mt-2">{errors.thumbnail}</p>}
        </div>

        {/* Video Details */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Video Details</h2>
          
          <div className="space-y-4">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={errors.title}
              placeholder="Enter video title"
              className="text-lg"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell viewers about your video"
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="font-medium text-gray-900">Uploading your video...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{Math.round(uploadProgress)}% complete</p>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-600 font-medium">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isUploading}
            disabled={isUploading}
            className="px-8"
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;