import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Home, 
  Play, 
  Clock, 
  ThumbsUp, 
  TrendingUp, 
  Users, 
  Bookmark,
  Settings,
  Upload,
  User,
  Video,
  MessageSquare,
  List
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isDark } = useTheme();

  const mainNavigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Trending', href: '/dashboard/trending', icon: TrendingUp },
    { name: 'Browse Videos', href: '/dashboard/browse', icon: Play },
  ];

  const exploreNavigation = [
    { name: 'Communities', href: '/dashboard/communities', icon: Users },
  ];

  const youNavigation = [
    { name: 'History', href: '/dashboard/history', icon: Clock },
    { name: 'Liked Videos', href: '/dashboard/liked', icon: ThumbsUp },
    { name: 'Playlists', href: '/dashboard/playlists', icon: List },
    { name: 'Favorites', href: '/dashboard/favorites', icon: Bookmark },
  ];

  const creatorNavigation = [
    { name: 'Upload', href: '/dashboard/upload', icon: Upload },
    { name: 'My Videos', href: '/dashboard/videos', icon: Video },
    { name: 'Comments', href: '/dashboard/comments', icon: MessageSquare },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (href: string) => location.pathname === href;

  const NavSection = ({ title, items }: { title: string; items: typeof mainNavigation }) => (
    <div className="mb-6">
      <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 px-3 ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={`flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
              isActive(item.href)
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                : isDark
                ? 'text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50/10 hover:to-purple-50/10 hover:text-white'
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700'
            }`}
          >
            <item.icon className={`mr-3 h-5 w-5 transition-colors ${
              isActive(item.href) 
                ? 'text-white' 
                : isDark 
                ? 'text-gray-400 group-hover:text-white' 
                : 'text-gray-400 group-hover:text-indigo-600'
            }`} />
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 border-r z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:z-auto ${
        isDark 
          ? 'bg-gray-900/95 backdrop-blur-xl border-gray-800' 
          : 'bg-white/95 backdrop-blur-xl border-gray-200'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center px-6 py-4 border-b ${
            isDark ? 'border-gray-800 bg-gradient-to-r from-indigo-900/20 to-purple-900/20' : 'border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50'
          }`}>
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <span className="text-lg font-bold text-white">SS</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SocialSphere</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <NavSection title="" items={mainNavigation} />
            <NavSection title="Explore" items={exploreNavigation} />
            <NavSection title="You" items={youNavigation} />
            <NavSection title="Creator Studio" items={creatorNavigation} />
          </div>

          {/* Footer */}
          <div className={`p-4 border-t ${
            isDark 
              ? 'border-gray-800 bg-gradient-to-r from-gray-900/50 to-indigo-900/20' 
              : 'border-gray-200 bg-gradient-to-r from-gray-50 to-indigo-50'
          }`}>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              © SocialSphere 2025
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;