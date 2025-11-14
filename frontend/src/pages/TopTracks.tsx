import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { spotifyService } from '../services/api';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Music, Clock, TrendingUp, Play } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { TopTracks, Track } from '../types/spotify';

type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export const TopTracksPage = () => {
  const [tracks, setTracks] = useState<TopTracks | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  useEffect(() => {
    fetchTracks();
  }, [timeRange]);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const data = await spotifyService.getTopTracks(timeRange, 50);
      setTracks(data);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const timeRangeLabels = {
    short_term: 'Últimas 4 semanas',
    medium_term: 'Últimos 6 meses',
    long_term: 'Todo el tiempo',
  };

  if (loading) return <LoadingSpinner />;

  if (!tracks) return null;

  // Prepare data for chart (top 10)
  const chartData = tracks.tracks.slice(0, 10).map((track, index) => ({
    name: track.name.length > 15 ? track.name.substring(0, 15) + '...' : track.name,
    popularity: track.popularity,
    index: index + 1,
  }));

  const colors = ['#1DB954', '#1ed760', '#1DB954', '#1ed760', '#1DB954', '#1ed760', '#1DB954', '#1ed760', '#1DB954', '#1ed760'];

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
                <Music className="w-10 h-10 text-spotify-green" />
                <span>Top Canciones</span>
              </h1>
              <p className="text-gray-400">Total: {tracks.total} canciones</p>
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

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">Top 10 Canciones - Popularidad</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#9ca3af' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tick={{ fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="popularity" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Tracks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {tracks.tracks.map((track, index) => (
              <motion.div
                key={`${track.name}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -10, scale: 1.05 }}
                onClick={() => setSelectedTrack(track)}
              >
                <Card className="cursor-pointer h-full">
                  <div className="relative mb-4">
                    {track.album.cover ? (
                      <motion.img
                        src={track.album.cover.url}
                        alt={track.album.name}
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
                      transition={{ delay: index * 0.03 + 0.3 }}
                    >
                      #{index + 1}
                    </motion.div>
                    {track.explicit && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        E
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 truncate">{track.name}</h3>
                  
                  <p className="text-gray-400 mb-2 truncate">
                    {Array.isArray(track.artist) ? track.artist.join(', ') : track.artist}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(track.duration)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{track.popularity}%</span>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Play className="w-6 h-6 text-spotify-green" />
                    </motion.div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {track.album.name} • {new Date(track.album.release_date).getFullYear()}
                  </p>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal for track details */}
        <AnimatePresence>
          {selectedTrack && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTrack(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-spotify-lightGray rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {selectedTrack.album.cover && (
                  <img
                    src={selectedTrack.album.cover.url}
                    alt={selectedTrack.album.name}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                )}
                <h2 className="text-3xl font-bold text-white mb-2">{selectedTrack.name}</h2>
                <p className="text-xl text-gray-300 mb-6">
                  {Array.isArray(selectedTrack.artist)
                    ? selectedTrack.artist.join(', ')
                    : selectedTrack.artist}
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 mb-1">Álbum</p>
                    <p className="text-white text-lg">{selectedTrack.album.name}</p>
                    <p className="text-gray-400 text-sm">
                      {selectedTrack.album.album_type} • {new Date(selectedTrack.album.release_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 mb-1">Duración</p>
                      <p className="text-white">{formatDuration(selectedTrack.duration)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Popularidad</p>
                      <div className="w-full bg-gray-700 rounded-full h-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedTrack.popularity}%` }}
                          className="bg-spotify-green h-4 rounded-full"
                        />
                      </div>
                      <p className="text-white mt-1">{selectedTrack.popularity}%</p>
                    </div>
                  </div>
                  {selectedTrack.explicit && (
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-3">
                      <p className="text-red-400 font-semibold">Contenido explícito</p>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setSelectedTrack(null)}
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

