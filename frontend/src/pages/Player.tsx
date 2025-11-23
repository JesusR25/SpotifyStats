import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { playerService } from '../services/api';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Music, 
  Smartphone, 
  Volume2,
  RefreshCw
} from 'lucide-react';
import type { PlaybackState } from '../types/spotify';

export const PlayerPage = () => {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchPlaybackState();
    // Actualizar cada 5 segundos
    const interval = setInterval(fetchPlaybackState, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPlaybackState = async () => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      const state = await playerService.getPlaybackState();
      setPlaybackState(state);
    } catch (error) {
      console.error('Error fetching playback state:', error);
      setPlaybackState(null);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handlePlayPause = async () => {
    if (!playbackState) return;
    
    try {
      setIsActionLoading(true);
      if (playbackState.is_playing) {
        await playerService.pausePlayback(playbackState.device.deviceID);
      } else {
        await playerService.playResumePlayback(playbackState.device.deviceID);
      }
      // Esperar un momento y refrescar
      setTimeout(() => {
        fetchPlaybackState();
      }, 500);
    } catch (error) {
      console.error('Error toggling playback:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSkipNext = async () => {
    if (!playbackState) return;
    
    try {
      setIsActionLoading(true);
      await playerService.skipToNext(playbackState.device.deviceID);
      setTimeout(() => {
        fetchPlaybackState();
      }, 500);
    } catch (error) {
      console.error('Error skipping to next:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSkipPrevious = async () => {
    if (!playbackState) return;
    
    try {
      setIsActionLoading(true);
      await playerService.skipToPrevious(playbackState.device.deviceID);
      setTimeout(() => {
        fetchPlaybackState();
      }, 500);
    } catch (error) {
      console.error('Error skipping to previous:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatProgress = (current: number, total: number) => {
    const percentage = (current / total) * 100;
    return percentage;
  };

  if (loading) return <LoadingSpinner />;

  if (!playbackState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-gray to-spotify-black py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="text-center py-12">
              <Music className="w-24 h-24 text-gray-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">No hay nada reproduciéndose</h2>
              <p className="text-gray-400 mb-6">
                Reproduce algo en Spotify para ver la información aquí
              </p>
              <Button onClick={fetchPlaybackState} variant="primary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const { track, device, is_playing, progress_ms } = playbackState;
  const progressPercentage = formatProgress(progress_ms, track.duration_ms);

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-gray to-spotify-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center space-x-3">
              <Music className="w-10 h-10 text-spotify-green" />
              <span>Reproductor</span>
            </h1>
            <Button
              onClick={() => {
                setIsRefreshing(true);
                fetchPlaybackState();
              }}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </motion.div>

        {/* Información del dispositivo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-spotify-green/20 to-blue-500/20 border border-spotify-green/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-spotify-green/20 rounded-full">
                  <Smartphone className="w-6 h-6 text-spotify-green" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{device.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {device.deviceType} • {device.is_active ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Volume2 className="w-5 h-5" />
                <span className="text-sm">{device.volume_percent}%</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Información de la canción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {track.album?.cover && (
                <motion.img
                  animate={{ rotate: is_playing ? 360 : 0 }}
                  transition={{ duration: 20, repeat: is_playing ? Infinity : 0, ease: 'linear' }}
                  src={track.album.cover.url}
                  alt={track.album.name}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-2xl shadow-2xl"
                />
              )}
              
              <div className="flex-1 text-center md:text-left">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  {track.name}
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl md:text-2xl text-gray-300 mb-4"
                >
                  {track.artists.map(a => a.name).join(', ')}
                </motion.p>

                {track.album && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 mb-4"
                  >
                    {track.album.name}
                  </motion.p>
                )}

                {/* Barra de progreso */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>{formatDuration(progress_ms)}</span>
                    <span>{formatDuration(track.duration_ms)}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-spotify-green h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Controles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSkipPrevious}
                disabled={isActionLoading || !playbackState}
                className="p-4 rounded-full bg-spotify-lightGray hover:bg-gray-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Canción anterior"
              >
                <SkipBack className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlayPause}
                disabled={isActionLoading || !playbackState}
                className="p-6 rounded-full bg-spotify-green hover:bg-[#1ed760] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                aria-label={is_playing ? 'Pausar' : 'Reproducir'}
              >
                {is_playing ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSkipNext}
                disabled={isActionLoading || !playbackState}
                className="p-4 rounded-full bg-spotify-lightGray hover:bg-gray-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Siguiente canción"
              >
                <SkipForward className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Estado de reproducción */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-spotify-green/20">
                <div className={`w-2 h-2 rounded-full ${is_playing ? 'bg-spotify-green animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-gray-300">
                  {is_playing ? 'Reproduciendo' : 'Pausado'}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

