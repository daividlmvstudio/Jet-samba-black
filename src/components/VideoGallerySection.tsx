import React, { useState } from 'react';
import { useBand } from '../context/BandContext';
import { Youtube, Play, Film, Clock, Eye, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { VideoItem } from '../types';

export const VideoGallerySection: React.FC = () => {
  const { videos, setSelectedVideoModal, bandInfo } = useBand();
  const [activeVideoTab, setActiveVideoTab] = useState<'all' | 'clip' | 'live' | 'acoustic' | 'documentary'>('all');

  const filteredVideos = videos.filter(v => {
    if (activeVideoTab === 'all') return true;
    return v.type === activeVideoTab;
  });

  const featuredVideo = videos.find(v => v.featured) || videos[0];
  const otherVideos = videos.filter(v => v.id !== featuredVideo?.id);

  return (
    <section id="videos" className="py-24 bg-zinc-900/60 text-zinc-100 border-t border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube Oficial</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Galeria de Vídeos & Clipes
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Assista a videoclipes oficiais, transmissões ao vivo em festivais e documentários exclusivos.
            </p>
          </div>

          {/* YouTube Channel Button */}
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 flex items-center gap-2 transition-all hover:scale-105 self-start md:self-auto"
          >
            <Youtube className="w-4 h-4" />
            <span>Inscrever-se no Canal</span>
          </a>
        </div>

        {/* Featured Video Embed Showcase */}
        {featuredVideo && (
          <div className="mb-14 bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-8 relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${featuredVideo.youtubeId}?rel=0`}
                  title={featuredVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-zinc-900 to-zinc-950">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                      Lançamento em Destaque
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {featuredVideo.releaseDate}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {featuredVideo.title}
                  </h3>

                  <p className="text-xs text-zinc-300 mt-4 leading-relaxed">
                    {featuredVideo.description}
                  </p>

                  <div className="mt-6 flex items-center gap-4 text-xs text-zinc-400 font-medium">
                    {featuredVideo.views && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                        {featuredVideo.views}
                      </span>
                    )}
                    {featuredVideo.duration && (
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        {featuredVideo.duration}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">
                    Produção Oficial {bandInfo.name}
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${featuredVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <span>Abrir no YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherVideos.map((video) => (
            <motion.div
              key={video.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedVideoModal(video)}
              className="bg-zinc-950/80 rounded-2xl overflow-hidden border border-zinc-800/90 group cursor-pointer shadow-lg hover:border-red-500/40 transition-all"
            >
              {/* Thumbnail with YouTube play overlay */}
              <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {video.duration && (
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                    {video.duration}
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-4">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">
                  <span className="text-red-400">{video.type.toUpperCase()}</span>
                  <span>{video.releaseDate}</span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-red-300 transition-colors">
                  {video.title}
                </h4>
                {video.views && (
                  <p className="text-[11px] text-zinc-400 mt-2 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-zinc-500" />
                    {video.views}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
