import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Music, TrendingUp, BarChart3, Sparkles } from 'lucide-react';

export const Home = () => {
  const { login, isAuthenticated } = useAuth();

  const features = [
    {
      icon: TrendingUp,
      title: 'Top Artistas',
      description: 'Descubre tus artistas más escuchados',
    },
    {
      icon: Music,
      title: 'Top Canciones',
      description: 'Revisa tus canciones favoritas',
    },
    {
      icon: BarChart3,
      title: 'Estadísticas',
      description: 'Analiza tus hábitos de escucha',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-gray to-spotify-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-spotify-green rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-6"
          >
            <Music className="w-20 h-20 text-spotify-green mx-auto" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6 bg-gradient-to-r from-spotify-green to-white bg-clip-text text-transparent"
          >
            Spotify Stats
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Descubre tus estadísticas de música favoritas
          </motion.p>

          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={login}
                size="lg"
                className="relative overflow-hidden group"
              >
                <motion.span
                  className="relative z-10 flex items-center space-x-2"
                  whileHover={{ x: 5 }}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Conectar con Spotify</span>
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-spotify-green to-[#1ed760]"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          )}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-spotify-lightGray/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-spotify-green/20 rounded-full flex items-center justify-center mb-4"
                >
                  <Icon className="w-8 h-8 text-spotify-green" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

