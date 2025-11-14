import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { spotifyService } from '../services/api';
import { Card } from '../components/ui/Card';
import { User, Music, TrendingUp, Users } from 'lucide-react';

export const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState({
    topArtists: 0,
    topTracks: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [artists, tracks] = await Promise.all([
          spotifyService.getTopArtists('medium_term', 1),
          spotifyService.getTopTracks('medium_term', 1),
        ]);
        setStats({
          topArtists: artists.total,
          topTracks: tracks.total,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  useEffect(() => {
    refreshUser();
  }, []);

  if (!user) return null;

  const statCards = [
    {
      icon: User,
      label: 'Seguidores',
      value: user.followers.toLocaleString(),
      color: 'text-blue-400',
    },
    {
      icon: Music,
      label: 'Top Artistas',
      value: stats.topArtists,
      color: 'text-spotify-green',
    },
    {
      icon: TrendingUp,
      label: 'Top Canciones',
      value: stats.topTracks,
      color: 'text-purple-400',
    },
    {
      icon: Users,
      label: 'País',
      value: user.country,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-gray to-spotify-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Bienvenido, {user.display_name}!
          </h1>
          <p className="text-gray-400 text-lg">Tu dashboard de estadísticas</p>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-spotify-green/20 to-purple-500/20 border border-spotify-green/30">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {user.images && (
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  src={user.images.url}
                  alt={user.display_name}
                  className="w-32 h-32 rounded-full border-4 border-spotify-green shadow-2xl"
                />
              )}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">{user.display_name}</h2>
                <p className="text-gray-300 mb-1">{user.email}</p>
                <p className="text-gray-400">Plan: {user.product}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`w-12 h-12 ${stat.color}`} />
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

