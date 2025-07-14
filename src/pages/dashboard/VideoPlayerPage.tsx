import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api';
import { Video, Comment, User } from '../../types';
import Button from '../../components/ui/Button';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  Clock,
  Share2,
  Download,
  MoreVertical,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  Heart,
  UserPlus,
  UserMinus
} from 'lucide-react';
import toast from 'react-hot-toast';

const VideoPlayerPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (videoId) {
      fetchVideo();
      fetchComments();
    }
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getVideoById(videoId!);
      
      if (response.success) {
        setVideo(response.data);
      } else {
        setError('Video not found');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await apiClient.getVideoComments(videoId!);
      if (response.success) {
        setComments(response.data);
      }
    } catch (error: any) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleLikeVideo = async () => {
    if (!video) return;
    
    try {
      const response = await apiClient.toggleVideoLike(video._id);
      if (response.success) {
        setIsLiked(response.data.isVideoLiked || false);
        toast.success(response.data.isVideoLiked ? 'Video liked' : 'Like removed');
      }
    } catch (error: any) {
      toast.error('Failed to like video');
    }
  };

  const handleSubscribe = async () => {
    if (!video || typeof video.owner === 'string') return;
    
    try {
      const response = await apiClient.toggleSubscription(video.owner._id);
      if (response.success) {
        setIsSubscribed(response.data.isSubscribed);
        toast.success(response.data.isSubscribed ? 'Subscribed' : 'Unsubscribed');
      }
    } catch (error: any) {
      toast.error('Failed to subscribe');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !video) return;

    try {
      const response = await apiClient.addComment(user._id, video._id, newComment);
      if (response.success) {
        setNewComment('');
        fetchComments(); // Refresh comments
        toast.success('Comment added');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await apiClient.deleteComment(commentId);
      if (response.success) {
        setComments(comments.filter(c => c._id !== commentId));
        toast.success('Comment deleted');
      }
    } catch (error: any) {
      toast.error('Failed to delete comment');
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await apiClient.updateComment(commentId, editContent);
      if (response.success) {
        setEditingComment(null);
        setEditContent('');
        fetchComments(); // Refresh comments
        toast.success('Comment updated');
      }
    } catch (error: any) {
      toast.error('Failed to update comment');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await apiClient.toggleCommentLike(commentId);
      if (response.success) {
        toast.success(response.data.isCommentLiked ? 'Comment liked' : 'Like removed');
      }
    } catch (error: any) {
      toast.error('Failed to like comment');
    }
  };
  const handleTogglePublish = async () => {
    if (!video) return;

    try {
      const response = await apiClient.togglePublishStatus(video._id);
      if (response.success) {
        setVideo(prev => prev ? { ...prev, isPublished: !prev.isPublished } : null);
        toast.success(video.isPublished ? 'Video unpublished' : 'Video published');
      }
    } catch (error) {
      toast.error('Failed to update publish status');
    }
  };

  const handleDeleteVideo = async () => {
    if (!video) return;

    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiClient.deleteVideo(video._id);
      if (response.success) {
        toast.success('Video deleted successfully');
        navigate('/dashboard/videos');
      }
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="aspect-video bg-gray-800 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-800 rounded mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-2/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-32 bg-gray-800 rounded-lg"></div>
            </div>
            <div className="h-64 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-6">
          <Play className="w-12 h-12 text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Video Not Found</h1>
        <p className="text-gray-400 mb-8">{error || 'The video you\'re looking for doesn\'t exist or has been removed.'}</p>
        <Button onClick={() => navigate('/dashboard/videos')} variant="outline">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Videos
        </Button>
      </div>
    );
  }

  const videoOwner = typeof video.owner === 'object' ? video.owner : null;
  const isOwner = user?._id === (typeof video.owner === 'string' ? video.owner : videoOwner?._id);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        onClick={() => navigate('/dashboard/videos')}
        variant="outline"
        className="inline-flex items-center"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>

      {/* Video Player */}
      <div className="bg-black rounded-lg overflow-hidden">
        <div className="relative aspect-video">
          <video
            src={video.videoFile}
            poster={video.thumbnail}
            controls
            className="w-full h-full"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Video Info */}
      <div className="space-y-4">
        {/* Title and basic info */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {video.views.toLocaleString()} views
            </span>
            <span>•</span>
            <span>{formatDate(video.createdAt)}</span>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between py-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            {/* Like/Dislike */}
            <div className="flex items-center bg-gray-800 rounded-full">
              <button
                onClick={handleLikeVideo}
                className={`flex items-center space-x-2 px-4 py-2 rounded-l-full transition-colors ${
                  isLiked ? 'text-blue-500' : 'text-gray-300 hover:text-white'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span className="text-sm font-medium">Like</span>
              </button>
              <div className="w-px h-6 bg-gray-700"></div>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-r-full text-gray-300 hover:text-white transition-colors">
                <ThumbsDown className="w-5 h-5" />
              </button>
            </div>

            {/* Share */}
            <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-gray-300 hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>

            {/* Download */}
            <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-gray-300 hover:text-white transition-colors">
              <Download className="w-5 h-5" />
              <span className="text-sm font-medium">Download</span>
            </button>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                video.isPublished 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-yellow-900 text-yellow-300'
              }`}>
                {video.isPublished ? 'Published' : 'Draft'}
              </span>
              
              <button
                onClick={handleTogglePublish}
                className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {video.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              
              <Link
                to={`/dashboard/video/${video._id}/edit`}
                className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </Link>
              
              <button
                onClick={handleDeleteVideo}
                className="p-2 text-gray-400 hover:text-red-500 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Channel info */}
        {videoOwner && (
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <img
                src={videoOwner.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={videoOwner.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-white font-medium">{videoOwner.fullName}</h3>
                <p className="text-gray-400 text-sm">@{videoOwner.username}</p>
                <p className="text-gray-500 text-xs">{videoOwner.subscribersCount || 0} subscribers</p>
              </div>
            </div>
            
            {!isOwner && (
              <button
                onClick={handleSubscribe}
                className={`flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition-colors ${
                  isSubscribed
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isSubscribed ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Description and Comments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              {video.description ? (
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {video.description}
                </p>
              ) : (
                <p className="text-gray-500 italic">No description provided</p>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Comments ({comments.length})
            </h2>
            
            {/* Add comment */}
            {user && (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex space-x-3">
                  <img
                    src={user.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150'}
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        <span>Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
            
            {/* Comments list */}
            <div className="space-y-4">
              {comments.map((comment) => {
                const commentOwner = Array.isArray(comment.owner) ? comment.owner[0] : null;
                const isCommentOwner = user?._id === (typeof comment.owner === 'string' ? comment.owner : commentOwner?._id);
                
                return (
                  <div key={comment._id} className="flex space-x-3">
                    <img
                      src={commentOwner?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150'}
                      alt={commentOwner?.fullName || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium text-sm">
                          {commentOwner?.fullName || 'Unknown User'}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      
                      {editingComment === comment._id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm resize-none"
                            rows={2}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditComment(comment._id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingComment(null);
                                setEditContent('');
                              }}
                              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-300 text-sm mb-2">{comment.content}</p>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleLikeComment(comment._id)}
                              className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Heart className="w-3 h-3" />
                              <span className="text-xs">Like</span>
                            </button>
                            
                            {isCommentOwner && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingComment(comment._id);
                                    setEditContent(comment.content);
                                  }}
                                  className="text-gray-400 hover:text-yellow-500 text-xs transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="text-gray-400 hover:text-red-500 text-xs transition-colors"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {comments.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No comments yet</p>
                  <p className="text-gray-500 text-sm">Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Video Stats and Related */}
        <div className="space-y-6">
          {/* Video Stats */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Video Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Views</span>
                <span className="font-semibold text-white">{video.views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Duration</span>
                <span className="font-semibold text-white">{formatDuration(video.duration)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Published</span>
                <span className="font-semibold text-white">{formatDate(video.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last Updated</span>
                <span className="font-semibold text-white">{formatDate(video.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Related Videos */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Up Next</h3>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">Related videos coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;