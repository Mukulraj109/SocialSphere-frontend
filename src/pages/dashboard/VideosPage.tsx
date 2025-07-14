import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { Video } from '../../types';
import Button from '../../components/ui/Button';
import { 
  Play, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  MoreVertical, 
  Upload,
  Search,
  Filter,
  Calendar,
  TrendingUp
} from 'lucide-react';

const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'views' | 'title'>('createdAt');
  const [sortType, setSortType] = useState<'asc' | 'desc'>('desc');
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchVideos();
  }, [sortBy, sortType]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getVideos({
        sortBy,
        sortType,
        limit: 50
      });
      
      if (response.success) {
        setVideos(response.data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (videoId: string) => {
    try {
      const response = await apiClient.togglePublishStatus(videoId);
      if (response.success) {
        setVideos(prev => prev.map(video => 
          video._id === videoId 
            ? { ...video, isPublished: !video.isPublished }
            : video
        ));
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiClient.deleteVideo(videoId);
      if (response.success) {
        setVideos(prev => prev.filter(video => video._id !== videoId));
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterPublished === 'all' ||
                         (filterPublished === 'published' && video.isPublished) ||
                         (filterPublished === 'draft' && !video.isPublished);
    
    return matchesSearch && matchesFilter;
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Videos</h1>
          <p className="text-gray-600 mt-1">Manage your video content</p>
        </div>
        <Link to="/dashboard/upload">
          <Button className="inline-flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload Video
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filter by Status */}
          <select
            value={filterPublished}
            onChange={(e) => setFilterPublished(e.target.value as 'all' | 'published' | 'draft')}
            className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Videos</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'views' | 'title')}
            className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="createdAt">Date Created</option>
            <option value="views">Views</option>
            <option value="title">Title</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as 'asc' | 'desc')}
            className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-t-2xl"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div key={video._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <Link
                    to={`/dashboard/video/${video._id}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Play className="w-12 h-12 text-white" />
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
                    {video.title}
                  </h3>
                  <div className="relative">
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {video.description || 'No description'}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {video.views.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(video.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    video.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {video.isPublished ? 'Published' : 'Draft'}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTogglePublish(video._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        video.isPublished
                          ? 'text-yellow-600 hover:bg-yellow-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={video.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {video.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    
                    <Link
                      to={`/dashboard/video/${video._id}/edit`}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteVideo(video._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Play className="w-12 h-12 text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {searchTerm || filterPublished !== 'all' ? 'No videos found' : 'No videos yet'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm || filterPublished !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start your content creation journey by uploading your first video'
            }
          </p>
          {(!searchTerm && filterPublished === 'all') && (
            <Link to="/dashboard/upload">
              <Button className="inline-flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Your First Video
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default VideosPage;