import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Video, User } from '../../types';
import { Play, MoreVertical, Clock, Eye } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  showOwner?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  showOwner = true, 
  size = 'medium' 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isDark } = useTheme();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

  const owner = typeof video.owner === 'object' ? video.owner : null;

  const sizeClasses = {
    small: 'w-full max-w-sm',
    medium: 'w-full max-w-md',
    large: 'w-full max-w-lg'
  };

  return (
    <div className={`${sizeClasses[size]} group cursor-pointer`}>
      <Link to={`/dashboard/video/${video._id}`}>
        {/* Thumbnail */}
        <div className={`relative aspect-video rounded-xl overflow-hidden mb-3 ${
          isDark ? 'bg-gray-800' : 'bg-gray-200'
        }`}>
          {!imageLoaded && (
            <div className={`absolute inset-0 animate-pulse flex items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <Play className={`w-8 h-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
          )}
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
            {formatDuration(video.duration)}
          </div>

          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Video info */}
        <div className="flex space-x-3">
          {/* Owner avatar */}
          {showOwner && owner && (
            <div className="flex-shrink-0">
              <img
                src={owner.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={owner.fullName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-200"
              />
            </div>
          )}

          {/* Video details */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-sm line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {video.title}
            </h3>
            
            {showOwner && owner && (
              <p className={`text-sm mb-1 hover:text-indigo-600 transition-colors ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {owner.fullName}
              </p>
            )}
            
            <div className={`flex items-center text-sm space-x-1 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {formatViews(video.views)} views
              </span>
              <span>•</span>
              <span>{formatTimeAgo(video.createdAt)}</span>
            </div>
          </div>

          {/* More options */}
          <div className="flex-shrink-0">
            <button className={`p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;