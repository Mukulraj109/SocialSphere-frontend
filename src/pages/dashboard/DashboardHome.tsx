import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api';
import { Play, Users, Eye, TrendingUp, Upload, Settings, Video, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Video as VideoType } from '../../types';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    subscribers: 0,
    watchTime: 0,
  });
  const [recentVideos, setRecentVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const videosResponse = await apiClient.getVideos({ limit: 6, sortBy: 'createdAt', sortType: 'desc' });
      
      if (videosResponse.success) {
        const videos = videosResponse.data;
        setRecentVideos(videos);
        
        // Calculate stats from actual data
        const totalViews = videos.reduce((sum: number, video: VideoType) => sum + video.views, 0);
        const totalWatchTime = videos.reduce((sum: number, video: VideoType) => sum + video.duration, 0);
        
        setStats({
          totalVideos: videos.length,
          totalViews,
          subscribers: user?.subscribersCount || 0,
          watchTime: totalWatchTime / 3600, // Convert to hours
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data
      setStats({
        totalVideos: 0,
        totalViews: 0,
        subscribers: 0,
        watchTime: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Upload Video',
      description: 'Share your latest content',
      icon: Upload,
      href: '/dashboard/upload',
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'My Videos',
      description: 'Manage your content',
      icon: Video,
      href: '/dashboard/videos',
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'View Analytics',
      description: 'Track your performance',
      icon: TrendingUp,
      href: '/dashboard/analytics',
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50',
    },
  ];

  const statCards = [
    {
      title: 'Total Videos',
      value: stats.totalVideos.toLocaleString(),
      icon: Play,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Subscribers',
      value: stats.subscribers.toLocaleString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Watch Time (hrs)',
      value: stats.watchTime.toFixed(1),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white/30 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.fullName}!</h1>
              <p className="text-indigo-100 text-lg">
                Ready to create something amazing today?
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-pink-300" />
                  <span className="text-sm text-indigo-200">Creator since {new Date(user?.createdAt || '').getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className={`absolute inset-0 ${action.bgColor} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${action.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Videos */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Videos</h2>
          <Link
            to="/dashboard/videos"
            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            View all →
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : recentVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVideos.map((video) => (
              <Link
                key={video._id}
                to={`/dashboard/video/${video._id}`}
                className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
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
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{video.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{video.views.toLocaleString()} views</span>
                    <span>{formatDate(video.createdAt)}</span>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      video.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {video.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <Video className="w-12 h-12 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No videos yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start your content creation journey by uploading your first video
            </p>
            <Link
              to="/dashboard/upload"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Your First Video
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;