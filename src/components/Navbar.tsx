import React, { useState } from 'react';
import { useBand } from '../context/BandContext';
import {
  Music2,
  Calendar,
  Image as ImageIcon,
  Film,
  Users,
  Briefcase,
  Star,
  ShieldCheck,
  Mail,
  Volume2,
  Play,
  Pause,
  LogOut,
  Menu,
  X,
  Radio,
  BookOpen,
  ExternalLink,
  Disc3
} from 'lucide-react';
import { SOUNDCLOUD_TRACK_URL } from './SoundCloudLadyPlayer';
import { MarqueeText } from './MarqueeText';
import { DEFAULT_BAND_LOGO } from '../data/bandLogos';

export const Navbar: React.FC = () => {
  const {
    bandInfo,
    currentUser,
    userRole,
    logout,
    openAuthModal,
    activeView,
    setActiveView,
    unreadEmailCount,
    setEmailModalOpen,
    currentTrack,
    isPlaying,
    togglePlayTrack,
    radioSettings,
    isRadioPlaying,
    toggleRadioPlay
  } = useBand();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (activeView !== 'public') {
      setActiveView('public');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 text-zinc-100">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between min-h-[4rem] sm:min-h-[4.25rem] py-1.5 gap-1.5 sm:gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 cursor-pointer group shrink-0" onClick={() => setActiveView('public')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-orange-950/40 p-0.5 group-hover:border-amber-400/80 transition-all duration-300 shrink-0">
              <img
                id="navbar-brand-logo-img"
                src={bandInfo.navbarLogoUrl || bandInfo.logoUrl || DEFAULT_BAND_LOGO}
                alt={bandInfo.name}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== DEFAULT_BAND_LOGO) {
                    target.src = DEFAULT_BAND_LOGO;
                  }
                }}
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm sm:text-base lg:text-lg font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-amber-200 whitespace-nowrap leading-tight">
                {bandInfo.name}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[9px] sm:text-[10px] tracking-widest text-zinc-400 uppercase font-semibold whitespace-nowrap leading-none">
                  JET OFICIAL
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1.5 xl:gap-3 px-2 sm:px-4 max-w-2xl mx-auto">
            <button
              onClick={() => scrollToSection('historia')}
              className="px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors whitespace-nowrap"
            >
              História
            </button>
            <button
              onClick={() => scrollToSection('integrantes')}
              className="px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors whitespace-nowrap"
            >
              Integrantes
            </button>
            <button
              onClick={() => scrollToSection('fotos')}
              className="px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors whitespace-nowrap"
            >
              Fotos
            </button>
            <button
              onClick={() => scrollToSection('videos')}
              className="px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors whitespace-nowrap"
            >
              Vídeos
            </button>
            <button
              onClick={() => {
                if (userRole === 'fan') {
                  setActiveView('fan_club');
                } else {
                  scrollToSection('fa-clube');
                }
              }}
              className="px-2.5 py-1.5 text-xs xl:text-sm font-bold text-amber-400 hover:text-amber-300 rounded-lg hover:bg-amber-950/40 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
              <span>Fã Clube</span>
            </button>
          </nav>

          {/* Right Controls: Mini Audio Pill + Email Notifications + User Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Radio JET Control Button */}
            <div className="flex items-center gap-1 p-0.5 sm:p-1 rounded-full bg-zinc-900/90 border border-rose-500/40 shadow-inner w-28 sm:w-36 md:w-44 lg:w-48 shrink-0">
              <button
                type="button"
                id="navbar-radio-jet-pill-btn"
                onClick={() => toggleRadioPlay()}
                className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-rose-600/30 to-amber-500/20 hover:from-rose-600/50 hover:to-amber-500/40 text-rose-300 hover:text-white transition-all text-xs font-bold cursor-pointer min-w-0 flex-1 overflow-hidden"
                title="Radio JET Oficial - Clique para ouvir ou pausar"
              >
                <Radio className={`w-3.5 h-3.5 text-rose-400 shrink-0 ${isRadioPlaying ? 'animate-pulse' : ''}`} />
                <div className="min-w-0 flex-1 overflow-hidden">
                  <MarqueeText
                    text={`${radioSettings?.artist || 'JET SAMBA BLACK'} • ${radioSettings?.title || 'Lady'}`}
                    badge={radioSettings?.badgeLabel || 'Radio JET'}
                    className="text-[10px] sm:text-[11px] font-bold text-amber-200"
                    speed="normal"
                  />
                </div>
              </button>

              <button
                type="button"
                id="navbar-radio-jet-toggle-btn"
                onClick={() => toggleRadioPlay()}
                className={`p-1 sm:p-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
                  isRadioPlaying
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-900/50'
                    : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
                }`}
                title={isRadioPlaying ? 'Pausar reprodução da Radio JET' : 'Dar play na Radio JET'}
              >
                {isRadioPlaying ? (
                  <Pause className="w-3 h-3 fill-current" />
                ) : (
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                )}
              </button>
            </div>

            {/* Email Notifications Drawer Button */}
            <button
              onClick={() => setEmailModalOpen(true)}
              className="relative p-1.5 sm:p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer shrink-0"
              title="Central de Notificações de E-mail"
            >
              <Mail className="w-4 h-4" />
              {unreadEmailCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-rose-500 text-white rounded-full text-[9px] sm:text-[10px] font-extrabold flex items-center justify-center shadow-lg animate-bounce">
                  {unreadEmailCount}
                </span>
              )}
            </button>

            {/* Portal Role Badges / Switchers */}
            {currentUser ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
                <button
                  onClick={() => {
                    if (currentUser.role === 'admin') setActiveView('admin');
                    else if (currentUser.role === 'contractor') setActiveView('contractor');
                    else if (currentUser.role === 'fan') setActiveView('fan_club');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    currentUser.role === 'admin'
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30'
                      : currentUser.role === 'contractor'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
                  }`}
                >
                  {currentUser.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                  {currentUser.role === 'contractor' && <Briefcase className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  {currentUser.role === 'fan' && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />}
                  <span className="hidden sm:inline">
                    {currentUser.role === 'admin' ? 'Painel Admin' : currentUser.role === 'contractor' ? 'Área Contratante' : 'Fã VIP'}
                  </span>
                  <span className="sm:hidden">Painel</span>
                </button>

                <button
                  onClick={logout}
                  className="p-1.5 sm:p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors shrink-0"
                  title="Sair da Conta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('admin')}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold tracking-wide shadow-md shadow-rose-900/30 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Entrar / Painel</span>
                <span className="sm:hidden">Entrar</span>
              </button>
            )}

            {/* Compact / Mobile Menu Toggle Button (Visible on screens < lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white shrink-0 cursor-pointer"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Menu for < lg screens */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-zinc-950 px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => {
                setActiveView('public');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-left text-xs font-bold text-zinc-200"
            >
              🏠 Site Principal
            </button>
            <button
              onClick={() => {
                setEmailModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-left text-xs font-bold text-amber-400 flex items-center justify-between"
            >
              <span>✉️ E-mails / Avisos</span>
              {unreadEmailCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {unreadEmailCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Radio JET Bar */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-rose-950/50 to-zinc-900 border border-rose-500/30 mb-3 gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <Radio className={`w-4 h-4 text-rose-400 shrink-0 ${isRadioPlaying ? 'animate-pulse' : ''}`} />
              <div className="min-w-0 flex-1">
                <MarqueeText
                  text={`${radioSettings?.artist || 'JET SAMBA BLACK'} • ${radioSettings?.title || 'Lady (God Bar Ao Vivo)'}`}
                  badge={radioSettings?.badgeLabel || 'Radio JET'}
                  className="text-xs font-bold text-white"
                  speed="normal"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleRadioPlay()}
              className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                isRadioPlaying
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
              }`}
              title={isRadioPlaying ? 'Pausar Radio JET' : 'Tocar Radio JET'}
            >
              {isRadioPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => scrollToSection('historia')}
              className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 rounded-lg"
            >
              História da Banda
            </button>
            <button
              onClick={() => scrollToSection('integrantes')}
              className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 rounded-lg"
            >
              Integrantes & Instrumentos
            </button>
            <button
              onClick={() => scrollToSection('fotos')}
              className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 rounded-lg"
            >
              Galeria de Fotos
            </button>
            <button
              onClick={() => scrollToSection('videos')}
              className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 rounded-lg"
            >
              Vídeos do YouTube
            </button>
            <button
              onClick={() => scrollToSection('fa-clube')}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-amber-400 hover:bg-amber-950/30 rounded-lg"
            >
              Fã Clube
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
