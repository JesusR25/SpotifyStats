import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import { Button } from '../components/ui/Button';

export const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      // Si hay un error en los parámetros de Spotify
      if (error) {
        setStatus('error');
        setErrorMessage('Spotify rechazó la autorización. Por favor, intenta de nuevo.');
        return;
      }

      // Si no hay code o state, es un error
      if (!code || !state) {
        setStatus('error');
        setErrorMessage('No se recibieron los parámetros necesarios de Spotify.');
        return;
      }

      try {
        // Llamar al endpoint de callback del backend
        await authService.callback(code, state);
        
        // Si todo salió bien, refrescar el usuario y mostrar éxito
        await refreshUser();
        setStatus('success');
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error: any) {
        setStatus('error');
        const message = error?.response?.data?.detail || 
                       error?.message || 
                       'Ocurrió un error al vincular tu cuenta de Spotify. Por favor, intenta de nuevo.';
        setErrorMessage(message);
      }
    };

    handleCallback();
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-gray to-spotify-black flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        {status === 'loading' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="mb-6"
            >
              <Loader2 className="w-24 h-24 text-spotify-green mx-auto" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Procesando...
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-lg"
            >
              Vinculando tu cuenta de Spotify
            </motion.p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <CheckCircle className="w-24 h-24 text-spotify-green mx-auto" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-4"
            >
              ¡Vinculación exitosa!
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-lg mb-6"
            >
              Tu cuenta de Spotify ha sido vinculada correctamente. Redirigiendo a tu dashboard...
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </motion.div>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <XCircle className="w-24 h-24 text-red-500 mx-auto" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Error al vincular
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-red-400 text-lg mb-6"
            >
              {errorMessage}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => navigate('/')}
                variant="primary"
              >
                Volver al inicio
              </Button>
              <Button
                onClick={() => {
                  setStatus('loading');
                  authService.login();
                }}
                variant="outline"
              >
                Intentar de nuevo
              </Button>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};
