import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface WrappedCardProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
}

export const WrappedCard = ({ children, className = '', gradient = 'from-spotify-green to-purple-500' }: WrappedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-3xl p-8 bg-gradient-to-br ${gradient} shadow-2xl overflow-hidden ${className}`}
      style={{ width: '1080px', height: '1080px' }}
    >
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};

