import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { albumService } from '../services/api';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Music, Clock, Play, Disc, Calendar } from 'lucide-react';
import type { AlbumDetail, AlbumTracks, AlbumTrack } from '../types/spotify';

export const AlbumDetailPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<AlbumDetail | null>(null);
  const [tracks, setTracks] = useState<AlbumTracks | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(true);

  useEffect(() => {
    if (albumId) {
      fetchAlbum();
      fetchTracks();
    }
  }, [albumId]);

  const fetchAlbum = async () => {
    if (!albumId) return;
    try {
      setLoading(true);
      const data = await albumService.getAlbum(albumId);
      setAlbum(data);
    } catch (error) {
      console.error('Error fetching album:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTracks = async () => {
    if (!albumId) return;
    try {
      setLoadingTracks(true);
      const data = await albumService.getAlbumTracks(albumId, 50);
      setTracks(data);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoadingTracks(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) return <LoadingSpinner />;

  if (!album) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-gray to-spotify-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Botón de regreso */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => navigate('/albums')}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a álbumes</span>
          </Button>
        </motion.div>

        {/* Header del álbum */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-spotify-green/20 to-purple-500/20 border border-spotify-green/30">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {album.image && (
                <motion.img
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  src={album.image.url}
                  alt={album.name}
                  className="w-64 h-64 md:w-80 md:h-80 rounded-2xl shadow-2xl"
                />
              )}
              
              <div className="flex-1 text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-4"
                >
                  {album.name}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl text-gray-300 mb-4"
                >
                  {album.artist.map(a => a.name).join(', ')}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400"
                >
                  <div className="flex items-center space-x-2">
                    <Disc className="w-5 h-5" />
                    <span>{album.total_tracks} canciones</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(album.release_date).getFullYear()}</span>
                  </div>
                  <span className="capitalize">{album.album_type}</span>
                </motion.div>

                {album.genres.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start"
                  >
                    {album.genres.map((genre) => (
                      <span
                        key={genre}
                        className="bg-spotify-green/20 text-spotify-green px-3 py-1 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Lista de canciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Music className="w-6 h-6 text-spotify-green" />
              <span>Canciones</span>
            </h2>

            {loadingTracks ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : tracks && tracks.tracks.length > 0 ? (
              <div className="space-y-2">
                {tracks.tracks.map((track: AlbumTrack, index) => (
                  <motion.div
                    key={track.trackID}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-spotify-lightGray/50 transition-colors group"
                  >
                    <div className="w-8 text-center text-gray-400 group-hover:text-white transition-colors">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{track.name}</h3>
                      <p className="text-gray-400 text-sm truncate">
                        {track.artists.map(a => a.name).join(', ')}
                        {track.explicit && (
                          <span className="ml-2 text-red-400 text-xs">E</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 text-gray-400 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(track.duration_ms)}</span>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="w-5 h-5 text-spotify-green cursor-pointer" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-12">No hay canciones disponibles</p>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

