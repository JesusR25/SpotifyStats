import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Music, BarChart3, LogOut, Disc, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/top-artists', label: 'Top Artistas', icon: Music },
    { path: '/top-tracks', label: 'Top Canciones', icon: Music },
    { path: '/albums', label: 'Álbumes', icon: Disc },
    { path: '/wrapped', label: 'Wrapped', icon: Sparkles },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-spotify-black/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Music className="w-8 h-8 text-spotify-green" />
            </motion.div>
            <span className="text-xl font-bold text-white">Spotify Stats</span>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-1 text-sm font-medium transition-colors"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${
                        isActive
                          ? 'text-spotify-green bg-spotify-lightGray'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}

              {user && (
                <div className="flex items-center space-x-3">
                  {user.images && (
                    <img
                      src={user.images.url}
                      alt={user.display_name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-300">{user.display_name}</span>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

