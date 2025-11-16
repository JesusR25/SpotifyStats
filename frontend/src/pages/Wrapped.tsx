import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { spotifyService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { WrappedCard } from '../components/wrapped/WrappedCard';
import { Download, Sparkles, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import type { TopArtist, TopTracks, Artist, Track } from '../types/spotify';

export const Wrapped = () => {
  const { user } = useAuth();
  const [topArtists, setTopArtists] = useState<TopArtist | null>(null);
  const [topTracks, setTopTracks] = useState<TopTracks | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetchWrappedData();
  }, []);

  useEffect(() => {
    // Esperar a que todas las imágenes se carguen
    if (topArtists && topTracks && user) {
      const images: HTMLImageElement[] = [];
      
      // Imagen de perfil
      if (user.images) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = user.images.url;
        images.push(img);
      }

      // Imágenes de artistas
      topArtists.artists.slice(0, 5).forEach((artist) => {
        if (artist.image) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = artist.image.url;
          images.push(img);
        }
      });

      // Imágenes de álbumes
      topTracks.tracks.slice(0, 5).forEach((track) => {
        if (track.album.cover) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = track.album.cover.url;
          images.push(img);
        }
      });

      let loadedCount = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        setImagesLoaded(true);
        return;
      }

      images.forEach((img) => {
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
      });
    }
  }, [topArtists, topTracks, user]);

  const fetchWrappedData = async () => {
    try {
      setLoading(true);
      const [artists, tracks] = await Promise.all([
        spotifyService.getTopArtists('medium_term', 5, 0),
        spotifyService.getTopTracks('medium_term', 5, 0),
      ]);
      setTopArtists(artists);
      setTopTracks(tracks);
    } catch (error) {
      console.error('Error fetching wrapped data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCard = async (index: number) => {
    const cardElement = cardRefs.current[index];
    if (!cardElement) return;

    try {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: true,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // Asegurar que las imágenes se muestren en el documento clonado
          const clonedImages = clonedDoc.querySelectorAll('img');
          clonedImages.forEach((img) => {
            if (img.src && !img.complete) {
              img.style.display = 'none';
            }
          });
        },
      });
      
      const link = document.createElement('a');
      link.download = `spotify-wrapped-${index + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const downloadAll = async () => {
    for (let i = 0; i < cardRefs.current.length; i++) {
      if (cardRefs.current[i]) {
        await downloadCard(i);
        // Pequeña pausa entre descargas
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!topArtists || !topTracks || !user) return null;

  const top5Artists = topArtists.artists.slice(0, 5);
  const top5Tracks = topTracks.tracks.slice(0, 5);

  const totalCards = 3;

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % totalCards);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-gray to-spotify-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
            <Sparkles className="w-10 h-10 text-spotify-green" />
            <span>Tu Spotify Wrapped</span>
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Descubre tus estadísticas del año
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={downloadAll} variant="primary" size="lg" disabled={!imagesLoaded}>
              <Download className="w-5 h-5 mr-2" />
              Descargar Todas
            </Button>
          </div>
          {!imagesLoaded && (
            <p className="text-gray-500 text-sm mt-2">Cargando imágenes...</p>
          )}
        </motion.div>

        {/* Carrusel */}
        <div className="relative flex items-center justify-center">
          {/* Botón anterior */}
          <button
            onClick={prevCard}
            className="absolute left-4 z-10 p-3 rounded-full bg-spotify-lightGray/80 hover:bg-spotify-lightGray text-white transition-all"
            aria-label="Tarjeta anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Contenedor del carrusel */}
          <div className="relative w-full max-w-[1080px] h-[1080px] overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Card 1: Portada */}
              {currentCardIndex === 0 && (
                <motion.div
                  key="card-0"
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div ref={(el) => { cardRefs.current[0] = el; }}>
                    <WrappedCard gradient="from-spotify-green via-green-400 to-emerald-500">
                      <div className="flex flex-col items-center justify-center h-full text-center text-white">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring' }}
                          className="mb-8"
                        >
                          <Calendar className="w-32 h-32" />
                        </motion.div>
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-7xl font-bold mb-4"
                        >
                          Tu Año en Spotify
                        </motion.h1>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-5xl font-semibold"
                        >
                          {new Date().getFullYear()}
                        </motion.p>
                        {user.images && (
                          <motion.img
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            src={user.images.url}
                            alt={user.display_name}
                            className="w-32 h-32 rounded-full border-4 border-white mt-8"
                            crossOrigin="anonymous"
                          />
                        )}
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-3xl font-semibold mt-4"
                        >
                          {user.display_name}
                        </motion.p>
                      </div>
                      <div className="absolute bottom-8 right-8">
                        <Button
                          onClick={() => downloadCard(0)}
                          variant="secondary"
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                          disabled={!imagesLoaded}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </WrappedCard>
                  </div>
                </motion.div>
              )}

              {/* Card 2: Top 5 Artistas */}
              {currentCardIndex === 1 && (
                <motion.div
                  key="card-1"
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div ref={(el) => { cardRefs.current[1] = el; }}>
                    <WrappedCard gradient="from-purple-500 via-pink-500 to-red-500">
                      <div className="flex flex-col h-full">
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-8"
                        >
                          <h2 className="text-6xl font-bold text-white mb-2">Top 5 Artistas</h2>
                          <p className="text-3xl text-white/80">Tus favoritos</p>
                        </motion.div>

                        <div className="flex-1 flex flex-col justify-center space-y-6">
                          {top5Artists.map((artist: Artist, index: number) => (
                            <motion.div
                              key={artist.uri}
                              initial={{ opacity: 0, x: -50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                              className="flex items-center space-x-6"
                            >
                              <div className="text-5xl font-bold text-white/30 w-16">
                                #{index + 1}
                              </div>
                              {artist.image && (
                                <img
                                  src={artist.image.url}
                                  alt={artist.name}
                                  className="w-24 h-24 rounded-full border-4 border-white/30"
                                  crossOrigin="anonymous"
                                />
                              )}
                              <div className="flex-1">
                                <h3 className="text-4xl font-bold text-white mb-1">{artist.name}</h3>
                                <p className="text-2xl text-white/80">
                                  {artist.followers.toLocaleString()} seguidores
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute bottom-8 right-8">
                        <Button
                          onClick={() => downloadCard(1)}
                          variant="secondary"
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                          disabled={!imagesLoaded}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </WrappedCard>
                  </div>
                </motion.div>
              )}

              {/* Card 3: Top 5 Canciones */}
              {currentCardIndex === 2 && (
                <motion.div
                  key="card-2"
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div ref={(el) => { cardRefs.current[2] = el; }}>
                    <WrappedCard gradient="from-blue-500 via-cyan-500 to-teal-500">
                      <div className="flex flex-col h-full">
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-8"
                        >
                          <h2 className="text-6xl font-bold text-white mb-2">Top 5 Canciones</h2>
                          <p className="text-3xl text-white/80">Las que más escuchaste</p>
                        </motion.div>

                        <div className="flex-1 flex flex-col justify-center space-y-6">
                          {top5Tracks.map((track: Track, index: number) => (
                            <motion.div
                              key={`${track.name}-${index}`}
                              initial={{ opacity: 0, x: -50 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                              className="flex items-center space-x-6"
                            >
                              <div className="text-5xl font-bold text-white/30 w-16">
                                #{index + 1}
                              </div>
                              {track.album.cover && (
                                <img
                                  src={track.album.cover.url}
                                  alt={track.album.name}
                                  className="w-24 h-24 rounded-xl border-4 border-white/30"
                                  crossOrigin="anonymous"
                                />
                              )}
                              <div className="flex-1">
                                <h3 className="text-4xl font-bold text-white mb-1">{track.name}</h3>
                                <p className="text-2xl text-white/80">
                                  {Array.isArray(track.artist) ? track.artist.join(', ') : track.artist}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute bottom-8 right-8">
                        <Button
                          onClick={() => downloadCard(2)}
                          variant="secondary"
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                          disabled={!imagesLoaded}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </Button>
                      </div>
                    </WrappedCard>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botón siguiente */}
          <button
            onClick={nextCard}
            className="absolute right-4 z-10 p-3 rounded-full bg-spotify-lightGray/80 hover:bg-spotify-lightGray text-white transition-all"
            aria-label="Siguiente tarjeta"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Indicadores de página */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalCards }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCardIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentCardIndex === index
                  ? 'bg-spotify-green w-8'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Ir a tarjeta ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

