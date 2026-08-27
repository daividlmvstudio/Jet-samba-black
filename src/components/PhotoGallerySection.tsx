import React, { useState } from 'react';
import { useBand } from '../context/BandContext';
import { Camera, Image as ImageIcon, ZoomIn, Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { PhotoItem } from '../types';

export const PhotoGallerySection: React.FC = () => {
  const { photos, setSelectedPhotoLightbox } = useBand();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'shows' | 'backstage' | 'studio' | 'promo'>('all');

  const filteredPhotos = photos.filter(photo => {
    if (selectedCategory === 'all') return true;
    return photo.category === selectedCategory;
  });

  const categories = [
    { id: 'all', label: 'Todas as Fotos' },
    { id: 'shows', label: 'Shows ao Vivo' },
    { id: 'backstage', label: 'Bastidores' },
    { id: 'studio', label: 'Estúdio' },
    { id: 'promo', label: 'Ensaio Promo' }
  ];

  return (
    <section id="fotos" className="py-24 bg-zinc-950 text-zinc-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>Galeria Visual</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Fotos dos Shows & Bastidores
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Registros da energia frenética no palco e momentos intimistas de bastidores.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPhotoLightbox(photo)}
              className="group relative h-72 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 cursor-pointer shadow-lg shadow-black/40"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 contrast-110"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Category Tag */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30">
                  {photo.category}
                </span>
              </div>

              {/* Zoom Trigger Button on Hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full bg-black/70 text-white backdrop-blur-md">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Photo Details at Bottom */}
              <div className="absolute bottom-3 left-3 right-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {photo.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                  <span>{photo.date}</span>
                  {photo.photographer && (
                    <span className="truncate max-w-[120px]">📷 {photo.photographer}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
