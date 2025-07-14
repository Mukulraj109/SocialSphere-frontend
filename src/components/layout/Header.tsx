import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Search, 
  Menu, 
  Bell, 
  Upload, 
  User, 
  Settings, 
  LogOut,
  Plus,
  Sun,
  Moon
} from 'lucide-react';
import toast from 'react-hot-toast';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info('Search functionality coming soon!');
    }
  };

  return (
    <header className={`border-b px-4 py-3 ${
      isDark 
        ? 'bg-gray-900/95 backdrop-blur-xl border-gray-800' 
        : 'bg-white/95 backdrop-blur-xl border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className={`p-2 rounded-lg transition-colors lg:hidden ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo for mobile */}
          <Link to="/dashboard" className="flex items-center space-x-2 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SocialSphere</span>
          </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-full py-2 pl-4 pr-12 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <button
              type="submit"
              className={`absolute right-0 top-0 h-full px-4 rounded-r-full transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Search className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </form>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Upload button */}
          <Link
            to="/dashboard/upload"
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </Link>

          {/* Notifications */}
          <button className={`p-2 rounded-lg transition-colors relative ${
            isDark 
              ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}>
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center space-x-2 p-1 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-200"
              />
              <span className={`text-sm font-medium hidden sm:inline ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {user?.username || 'User'}
              </span>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className={`absolute right-0 mt-2 w-48 border rounded-lg shadow-lg z-50 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="py-2">
                  <div className={`px-4 py-2 border-b ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user?.fullName}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      @{user?.username}
                    </p>
                  </div>
                  
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setShowUserMenu(false)}
                    className={`flex items-center px-4 py-2 transition-colors ${
                      isDark 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Your Profile
                  </Link>
                  
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setShowUserMenu(false)}
                    className={`flex items-center px-4 py-2 transition-colors ${
                      isDark 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center px-4 py-2 transition-colors ${
                      isDark 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;