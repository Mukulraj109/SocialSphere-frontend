import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { LikedVideo } from '../../types';
import VideoCard from '../../components/video/VideoCard';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const LikedVideosPage: React.FC = () => {
  const [likedVideos, setLikedVideos] = useState<LikedVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const fetchLikedVideos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getLikedVideos();
      if (response.success) {
        setLikedVideos(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load liked videos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Heart className="w-8 h-8 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold text-white">Liked Videos</h1>
          <p className="text-gray-400">Videos you've liked</p>
        </div>
      </div>

      {/* Videos grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-800 rounded-lg mb-3"></div>
              <div className="flex space-x-3">
                <div className="w-9 h-9 bg-gray-800 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-800 rounded"></div>
                  <div className="h-3 bg-gray-800 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : likedVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {likedVideos.map((likedVideo) => (
            <VideoCard key={likedVideo._id} video={likedVideo.video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No liked videos</h3>
          <p className="text-gray-400">Videos you like will appear here</p>
        </div>
      )}
    </div>
  );
};

export default LikedVideosPage;