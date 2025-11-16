import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { albumService } from '../services/api';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Disc, Music, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import type { SavedAlbumsByUser, AlbumSaved } from '../types/spotify';

const ITEMS_PER_PAGE = 20;

export const SavedAlbums = () => {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<SavedAlbumsByUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchAlbums(0);
  }, []);

  const fetchAlbums = async (offset: number = 0) => {
    try {
      setLoading(true);
      const data = await albumService.getSavedAlbums(ITEMS_PER_PAGE, offset);
      setAlbums(data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const offset = newPage * ITEMS_PER_PAGE;
    setCurrentPage(newPage);
    fetchAlbums(offset);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading && !albums) return <LoadingSpinner />;

  if (!albums) return null;

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
                <Disc className="w-10 h-10 text-spotify-green" />
                <span>Álbumes Guardados</span>
              </h1>
              <p className="text-gray-400">
                Total: {albums.total} álbumes • Mostrando {albums.AlbumsSaved.length} de {albums.total}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {albums.AlbumsSaved.map((albumSaved: AlbumSaved, index) => (
              <motion.div
                key={albumSaved.album.id_album}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10, scale: 1.05 }}
                onClick={() => navigate(`/album/${albumSaved.album.id_album}`)}
              >
                <Card className="cursor-pointer h-full">
                  <div className="relative mb-4">
                    {albumSaved.album.image ? (
                      <motion.img
                        src={albumSaved.album.image.url}
                        alt={albumSaved.album.name}
                        className="w-full aspect-square object-cover rounded-xl"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <div className="w-full aspect-square bg-spotify-lightGray rounded-xl flex items-center justify-center">
                        <Music className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 truncate">{albumSaved.album.name}</h3>
                  
                  <p className="text-gray-400 mb-2 truncate">
                    {albumSaved.album.artist.map(a => a.name).join(', ')}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <Disc className="w-4 h-4" />
                      <span>{albumSaved.album.total_tracks} canciones</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(albumSaved.album.release_date).getFullYear()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    Guardado el {formatDate(albumSaved.added_at)}
                  </p>

                  {albumSaved.album.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {albumSaved.album.genres.slice(0, 2).map((genre) => (
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

        {/* Paginación */}
        {albums && albums.total > ITEMS_PER_PAGE && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="text-gray-400 text-sm">
              Página {currentPage + 1} de {Math.ceil(albums.total / ITEMS_PER_PAGE)}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || loading}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </Button>
              
              <div className="flex items-center space-x-1">
                {(() => {
                  const totalPages = Math.ceil(albums.total / ITEMS_PER_PAGE);
                  const maxButtons = 5;
                  const buttonsToShow = Math.min(maxButtons, totalPages);
                  
                  let startPage = 0;
                  if (totalPages > maxButtons) {
                    if (currentPage < 2) {
                      startPage = 0;
                    } else if (currentPage > totalPages - 3) {
                      startPage = totalPages - maxButtons;
                    } else {
                      startPage = currentPage - 2;
                    }
                  }
                  
                  return Array.from({ length: buttonsToShow }, (_, i) => {
                    const pageNum = startPage + i;
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        variant={currentPage === pageNum ? 'primary' : 'outline'}
                        size="sm"
                        className="min-w-[40px]"
                      >
                        {pageNum + 1}
                      </Button>
                    );
                  });
                })()}
              </div>
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(albums.total / ITEMS_PER_PAGE) - 1 || loading}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

