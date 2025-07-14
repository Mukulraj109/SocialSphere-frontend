import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../lib/api';
import { Playlist } from '../../types';
import { List, Plus, Play, MoreVertical, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const PlaylistsPage: React.FC = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });

  useEffect(() => {
    if (user) {
      fetchPlaylists();
    }
  }, [user]);

  const fetchPlaylists = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await apiClient.getUserPlaylists(user._id);
      if (response.success) {
        setPlaylists(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylist.name.trim()) return;

    try {
      const response = await apiClient.createPlaylist(newPlaylist);
      if (response.success) {
        toast.success('Playlist created successfully');
        setShowCreateModal(false);
        setNewPlaylist({ name: '', description: '' });
        fetchPlaylists();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create playlist');
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    try {
      const response = await apiClient.deletePlaylist(playlistId);
      if (response.success) {
        toast.success('Playlist deleted successfully');
        setPlaylists(playlists.filter(p => p._id !== playlistId));
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete playlist');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <List className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">My Playlists</h1>
            <p className="text-gray-400">Organize your favorite videos</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Playlist</span>
        </button>
      </div>

      {/* Playlists grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-lg p-4 animate-pulse">
              <div className="aspect-video bg-gray-800 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-800 rounded mb-2"></div>
              <div className="h-3 bg-gray-800 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => {
            const videoCount = Array.isArray(playlist.video) ? playlist.video.length : 0;
            const firstVideo = Array.isArray(playlist.video) && playlist.video.length > 0 ? playlist.video[0] : null;
            
            return (
              <div key={playlist._id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors group">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-800">
                  {firstVideo && typeof firstVideo === 'object' ? (
                    <img
                      src={firstVideo.thumbnail}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <List className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  
                  {/* Video count overlay */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    {videoCount} videos
                  </div>

                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Playlist info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium line-clamp-2 flex-1">
                      {playlist.name}
                    </h3>
                    <div className="relative ml-2">
                      <button className="p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {playlist.description && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                      {playlist.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">
                      {videoCount} video{videoCount !== 1 ? 's' : ''}
                    </span>
                    
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-1 text-gray-400 hover:text-yellow-500 transition-colors">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeletePlaylist(playlist._id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <List className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No playlists yet</h3>
          <p className="text-gray-400 mb-6">Create your first playlist to organize your videos</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Create Your First Playlist
          </button>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Create New Playlist</h2>
            
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  value={newPlaylist.name}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter playlist name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newPlaylist.description}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Enter playlist description"
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  Create Playlist
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewPlaylist({ name: '', description: '' });
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;