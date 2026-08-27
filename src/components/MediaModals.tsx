import React from 'react';
import { useBand } from '../context/BandContext';
import { X, Calendar, MapPin, Camera, Youtube, Play, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PhotoLightboxModal: React.FC = () => {
  const { selectedPhotoLightbox, setSelectedPhotoLightbox } = useBand();

  return (
    <AnimatePresence>
      {selectedPhotoLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-zinc-900 border border-zinc-700/80 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col text-zinc-100 relative max-h-[90vh]"
          >
            <button
              onClick={() => setSelectedPhotoLightbox(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full bg-black flex items-center justify-center min-h-[320px] max-h-[65vh] overflow-hidden">
              <img
                src={selectedPhotoLightbox.url}
                alt={selectedPhotoLightbox.title}
                className="max-h-[65vh] w-auto max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-5 bg-zinc-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {selectedPhotoLightbox.category.toUpperCase()}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedPhotoLightbox.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {selectedPhotoLightbox.title}
                </h3>
                {selectedPhotoLightbox.location && (
                  <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {selectedPhotoLightbox.location}
                  </p>
                )}
              </div>

              {selectedPhotoLightbox.photographer && (
                <div className="text-xs text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 flex items-center gap-1.5 shrink-0">
                  <Camera className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Foto por: <strong className="text-zinc-200">{selectedPhotoLightbox.photographer}</strong></span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const VideoPlayerModal: React.FC = () => {
  const { selectedVideoModal, setSelectedVideoModal, bandInfo } = useBand();

  return (
    <AnimatePresence>
      {selectedVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-zinc-900 border border-zinc-700/80 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col text-zinc-100 relative"
          >
            <div className="p-4 bg-zinc-950 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-red-600 rounded-lg text-white">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {selectedVideoModal.title}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    YouTube Oficial • {bandInfo.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideoModal.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800 px-2.5 py-1 rounded-lg"
                >
                  <span>Ver no YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setSelectedVideoModal(null)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
                  title="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* YouTube Embed Container */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideoModal.youtubeId}?autoplay=1&rel=0`}
                title={selectedVideoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {selectedVideoModal.description && (
              <div className="p-4 bg-zinc-950 text-xs text-zinc-400">
                <p className="leading-relaxed text-zinc-300">{selectedVideoModal.description}</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const MediaModals: React.FC = () => {
  return (
    <>
      <PhotoLightboxModal />
      <VideoPlayerModal />
    </>
  );
};
