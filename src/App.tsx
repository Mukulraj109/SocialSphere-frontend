import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Toast from './components/ui/Toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/dashboard/HomePage';
import CommunityPage from './pages/dashboard/CommunityPage';
import LikedVideosPage from './pages/dashboard/LikedVideosPage';
import PlaylistsPage from './pages/dashboard/PlaylistsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import UploadPage from './pages/dashboard/UploadPage';
import VideosPage from './pages/dashboard/VideosPage';
import VideoPlayerPage from './pages/dashboard/VideoPlayerPage';
import BrowseVideosPage from './pages/dashboard/BrowseVideosPage';

function App() {
  return (
    <>
      <Toast />
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<HomePage />} />
                <Route path="trending" element={<HomePage />} />
                <Route path="browse" element={<BrowseVideosPage />} />
                <Route path="communities" element={<CommunityPage />} />
                <Route path="history" element={<div className="text-center p-8">Watch History feature coming soon!</div>} />
                <Route path="liked" element={<LikedVideosPage />} />
                <Route path="playlists" element={<PlaylistsPage />} />
                <Route path="favorites" element={<div className="text-center p-8">Favorites feature coming soon!</div>} />
                <Route path="upload" element={<UploadPage />} />
                <Route path="videos" element={<VideosPage />} />
                <Route path="comments" element={<div className="text-center p-8">Comments management coming soon!</div>} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<div className="text-center p-8">Settings feature coming soon!</div>} />
                <Route path="video/:videoId" element={<VideoPlayerPage />} />
                {/* Placeholder routes for future features */}
                <Route path="video/:videoId/edit" element={<div className="text-center p-8">Video editing feature coming soon!</div>} />
                <Route path="analytics" element={<div className="text-center p-8">Analytics feature coming soon!</div>} />
                <Route path="subscribers" element={<div className="text-center p-8">Subscribers feature coming soon!</div>} />
              </Route>

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;