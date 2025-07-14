import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { apiClient } from '../../lib/api';
import { Video } from '../../types';
import VideoCard from '../../components/video/VideoCard';
import { TrendingUp, Clock, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const { isDark } = useTheme();

  const filters = [
    { id: 'all', label: 'All', icon: null },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'liked', label: 'Most Liked', icon: ThumbsUp },
  ];

  useEffect(() => {
    fetchVideos();
  }, [activeFilter]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      let response;
      
      if (activeFilter === 'liked') {
        response = await apiClient.getLikedVideos();
        if (response.success) {
          setVideos(response.data.map((item: any) => item.video));
        }
      } else {
        const sortBy = activeFilter === 'recent' ? 'createdAt' : 'views';
        response = await apiClient.getVideos({
          sortBy,
          sortType: 'desc',
          limit: 50
        });
        
        if (response.success) {
          const publishedVideos = response.data.filter((video: Video) => video.isPublished);
          setVideos(publishedVideos);
        }
      }
    } catch (error: any) {
      toast.error('Failed to load videos');
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg'
                : isDark
                ? 'bg-gray-800/60 backdrop-blur-sm text-gray-300 hover:bg-gray-700/60 border border-gray-700'
                : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-gray-100/60 border border-gray-200'
            }`}
          >
            {filter.icon && <filter.icon className="w-4 h-4" />}
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Videos grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className={`aspect-video rounded-xl mb-3 ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}></div>
              <div className="flex space-x-3">
                <div className={`w-9 h-9 rounded-full ${
                  isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}></div>
                <div className="flex-1 space-y-2">
                  <div className={`h-4 rounded ${
                    isDark ? 'bg-gray-800' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-3 rounded w-2/3 ${
                    isDark ? 'bg-gray-800' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-3 rounded w-1/2 ${
                    isDark ? 'bg-gray-800' : 'bg-gray-200'
                  }`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <TrendingUp className={`w-12 h-12 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`} />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>No videos found</h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {activeFilter === 'liked' 
              ? "You haven't liked any videos yet" 
              : "No videos available at the moment"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;