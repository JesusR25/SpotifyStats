import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { spotifyService } from '../services/api';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { TrendingUp, Users, Music } from 'lucide-react';
import type { TopArtist, Artist } from '../types/spotify';

type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export const TopArtists = () => {
  const [artists, setArtists] = useState<TopArtist | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  useEffect(() => {
    fetchArtists();
  }, [timeRange]);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const data = await spotifyService.getTopArtists(timeRange, 50);
      setArtists(data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeLabels = {
    short_term: 'Últimas 4 semanas',
    medium_term: 'Últimos 6 meses',
    long_term: 'Todo el tiempo',
  };

  if (loading) return <LoadingSpinner />;

  if (!artists) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-gray to-spotify-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center space-x-3">
                <TrendingUp className="w-10 h-10 text-spotify-green" />
                <span>Top Artistas</span>
              </h1>
              <p className="text-gray-400">Total: {artists.total} artistas</p>
            </div>

            <div className="flex space-x-2 mt-4 md:mt-0">
              {(Object.keys(timeRangeLabels) as TimeRange[]).map((range) => (
                <Button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  variant={timeRange === range ? 'primary' : 'outline'}
                  size="sm"
                >
                  {timeRangeLabels[range]}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {artists.artists.map((artist, index) => (
              <motion.div
                key={artist.uri}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10, scale: 1.05 }}
                onClick={() => setSelectedArtist(artist)}
              >
                <Card className="cursor-pointer h-full">
                  <div className="relative mb-4">
                    {artist.image ? (
                      <motion.img
                        src={artist.image.url}
                        alt={artist.name}
                        className="w-full aspect-square object-cover rounded-xl"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <div className="w-full aspect-square bg-spotify-lightGray rounded-xl flex items-center justify-center">
                        <Music className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                    <motion.div
                      className="absolute top-2 right-2 bg-spotify-green text-white px-2 py-1 rounded-full text-xs font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.3 }}
                    >
                      #{index + 1}
                    </motion.div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 truncate">{artist.name}</h3>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {artist.followers.toLocaleString()} seguidores
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-spotify-green" />
                    <span className="text-sm text-gray-400">Popularidad: {artist.popularity}%</span>
                  </div>

                  {artist.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {artist.genres.slice(0, 2).map((genre) => (
                        <span
                          key={genre}
                          className="text-xs bg-spotify-green/20 text-spotify-green px-2 py-1 rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal for artist details */}
        <AnimatePresence>
          {selectedArtist && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedArtist(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-spotify-lightGray rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {selectedArtist.image && (
                  <img
                    src={selectedArtist.image.url}
                    alt={selectedArtist.name}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                )}
                <h2 className="text-3xl font-bold text-white mb-4">{selectedArtist.name}</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 mb-1">Seguidores</p>
                    <p className="text-2xl font-bold text-white">
                      {selectedArtist.followers.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Popularidad</p>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedArtist.popularity}%` }}
                        className="bg-spotify-green h-4 rounded-full"
                      />
                    </div>
                    <p className="text-white mt-1">{selectedArtist.popularity}%</p>
                  </div>
                  {selectedArtist.genres.length > 0 && (
                    <div>
                      <p className="text-gray-400 mb-2">Géneros</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedArtist.genres.map((genre) => (
                          <span
                            key={genre}
                            className="bg-spotify-green/20 text-spotify-green px-3 py-1 rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setSelectedArtist(null)}
                  className="mt-6 w-full"
                  variant="secondary"
                >
                  Cerrar
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

