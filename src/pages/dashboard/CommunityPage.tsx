import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api';
import { CommunityPost, User } from '../../types';
import { MessageSquare, Heart, MoreVertical, Edit, Trash2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAllCommunityPosts();
      if (response.success) {
        setPosts(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load community posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await apiClient.createCommunityPost(newPost);
      if (response.success) {
        toast.success('Post created successfully');
        setNewPost('');
        fetchPosts(); // Refresh posts
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await apiClient.deleteCommunityPost(postId);
      if (response.success) {
        toast.success('Post deleted successfully');
        setPosts(posts.filter(post => post._id !== postId));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete post');
    }
  };

  const handleEditPost = async (postId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await apiClient.updateCommunityPost(postId, editContent);
      if (response.success) {
        toast.success('Post updated successfully');
        setEditingPost(null);
        setEditContent('');
        fetchPosts(); // Refresh posts
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update post');
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await apiClient.toggleCommunityPostLike(postId);
      if (response.success) {
        // Update UI optimistically
        toast.success(response.data.isCommunityLiked ? 'Post liked' : 'Post unliked');
      }
    } catch (error: any) {
      toast.error('Failed to like post');
    }
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Community</h1>
        <p className="text-gray-400">Share your thoughts with the community</p>
      </div>

      {/* Create post */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="flex space-x-3">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt="Your avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newPost.trim()}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Post</span>
            </button>
          </div>
        </form>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-lg p-6 border border-gray-800 animate-pulse">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => {
            const postOwner = Array.isArray(post.owner) ? post.owner[0] : null;
            const isOwner = user?._id === (typeof post.owner === 'string' ? post.owner : postOwner?._id);

            return (
              <div key={post._id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                {/* Post header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex space-x-3">
                    <img
                      src={postOwner?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150'}
                      alt={postOwner?.fullName || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-white font-medium">{postOwner?.fullName || 'Unknown User'}</h3>
                      <p className="text-gray-400 text-sm">@{postOwner?.username || 'unknown'}</p>
                      <p className="text-gray-500 text-xs">{formatTimeAgo(post.createdAt)}</p>
                    </div>
                  </div>

                  {isOwner && (
                    <div className="relative">
                      <button className="p-1 text-gray-400 hover:text-white rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {/* Add dropdown menu for edit/delete */}
                    </div>
                  )}
                </div>

                {/* Post content */}
                {editingPost === post._id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white resize-none"
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPost(post._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingPost(null);
                          setEditContent('');
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-white mb-4 whitespace-pre-wrap">{post.content}</p>
                )}

                {/* Post actions */}
                <div className="flex items-center space-x-4 pt-3 border-t border-gray-800">
                  <button
                    onClick={() => handleLikePost(post._id)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">Like</span>
                  </button>

                  <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm">Comment</span>
                  </button>

                  {isOwner && (
                    <>
                      <button
                        onClick={() => {
                          setEditingPost(post._id);
                          setEditContent(post.content);
                        }}
                        className="flex items-center space-x-2 text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-sm">Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
          <p className="text-gray-400">Be the first to share something with the community!</p>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;