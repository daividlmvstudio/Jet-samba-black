import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BandInfo,
  BandMember,
  ShowEvent,
  PhotoItem,
  VideoItem,
  AudioTrack,
  RadioSettings,
  RadioTrackItem,
  BookingRequest,
  ExclusiveFanContent,
  FanMessage,
  SetlistVoteItem,
  EmailNotification,
  User,
  UserRole
} from '../types';
import {
  INITIAL_BAND_INFO,
  INITIAL_MEMBERS,
  INITIAL_SHOWS,
  INITIAL_PHOTOS,
  INITIAL_VIDEOS,
  INITIAL_TRACKS,
  INITIAL_RADIO_SETTINGS,
  INITIAL_RADIO_TRACKS,
  INITIAL_BOOKINGS,
  INITIAL_FAN_CONTENT,
  INITIAL_FAN_MESSAGES,
  INITIAL_SETLIST_VOTES,
  INITIAL_USERS,
  INITIAL_EMAILS
} from '../data/initialData';
import { audioEngine } from '../utils/audioEngine';
import confetti from 'canvas-confetti';
import {
  saveAudioToIndexedDB,
  getAudioFromIndexedDB,
  deleteAudioFromIndexedDB
} from '../utils/audioStorage';

interface ToastInfo {
  id: string;
  type: 'success' | 'email' | 'info' | 'error';
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

interface BandContextType {
  // Band Info
  bandInfo: BandInfo;
  updateBandInfo: (info: Partial<BandInfo>) => void;

  // Members
  members: BandMember[];
  addMember: (member: Omit<BandMember, 'id'>) => void;
  updateMember: (id: string, member: Partial<BandMember>) => void;
  deleteMember: (id: string) => void;
  moveMember: (id: string, direction: 'up' | 'down') => void;
  reorderMembers: (newMembers: BandMember[]) => void;

  // Shows
  shows: ShowEvent[];
  addShow: (show: Omit<ShowEvent, 'id'>) => void;
  updateShow: (id: string, show: Partial<ShowEvent>) => void;
  deleteShow: (id: string) => void;

  // Photos
  photos: PhotoItem[];
  addPhoto: (photo: Omit<PhotoItem, 'id'>) => void;
  deletePhoto: (id: string) => void;

  // Videos
  videos: VideoItem[];
  addVideo: (video: Omit<VideoItem, 'id'>) => void;
  updateVideo: (id: string, video: Partial<VideoItem>) => void;
  deleteVideo: (id: string) => void;
  moveVideo: (id: string, direction: 'up' | 'down') => void;
  reorderVideos: (newVideos: VideoItem[]) => void;
  setFeaturedVideo: (id: string) => void;

  // Music & Audio Player (Faixas Principais & Demos da Tela Principal)
  tracks: AudioTrack[];
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  togglePlayTrack: (track?: AudioTrack) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTrack: (seconds: number) => void;
  setTrackVolume: (val: number) => void;
  addTrack: (track: Omit<AudioTrack, 'id' | 'plays'> & { id?: string; plays?: number }) => void;
  updateTrack: (id: string, track: Partial<AudioTrack>) => void;
  deleteTrack: (id: string) => void;
  reorderTracks: (newTracks: AudioTrack[]) => void;
  moveTrack: (id: string, direction: 'up' | 'down') => void;
  restoreDefaultTracks: () => void;
  clearTracksCache: () => void;

  // Radio JET & Main Screen Single ("Radio JET")
  radioSettings: RadioSettings;
  radioTracks: RadioTrackItem[];
  isRadioPlaying: boolean;
  isRadioMuted: boolean;
  isRadioVisible: boolean;
  updateRadioSettings: (settings: Partial<RadioSettings>) => void;
  addRadioTrack: (track: Omit<RadioTrackItem, 'id' | 'createdAt'>) => void;
  addMultipleRadioTracks: (tracks: Omit<RadioTrackItem, 'id' | 'createdAt'>[]) => void;
  updateRadioTrack: (id: string, track: Partial<RadioTrackItem>) => void;
  deleteRadioTrack: (id: string) => void;
  setActiveRadioTrack: (id: string) => void;
  reorderRadioTracks: (newTracks: RadioTrackItem[]) => void;
  moveRadioTrack: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  restoreDefaultRadioSingle: () => void;
  clearRadioCache: () => void;
  playRadio: () => void;
  pauseRadio: () => void;
  stopRadio: () => void;
  toggleRadioPlay: () => void;
  toggleRadioMute: () => void;
  setRadioVisible: (visible: boolean) => void;
  setIsRadioPlaying: (playing: boolean) => void;
  playNextRadioTrack: () => void;
  playPrevRadioTrack: () => void;

  // Bookings
  bookings: BookingRequest[];
  createBooking: (booking: Omit<BookingRequest, 'id' | 'createdAt' | 'status' | 'protocolNumber'>) => BookingRequest;
  updateBookingStatus: (id: string, status: BookingRequest['status'], adminResponse?: string) => void;

  // Fan Club
  fanContent: ExclusiveFanContent[];
  addFanContent: (content: Omit<ExclusiveFanContent, 'id' | 'publishedAt' | 'likes' | 'commentsCount'>) => void;
  deleteFanContent: (id: string) => void;
  likeFanContent: (id: string) => void;

  fanMessages: FanMessage[];
  addFanMessage: (content: string) => void;
  replyToFanMessage: (messageId: string, replyAuthor: string, replyText: string) => void;

  setlistVotes: SetlistVoteItem[];
  voteSong: (id: string) => void;

  // Emails & Notifications
  emails: EmailNotification[];
  unreadEmailCount: number;
  markEmailAsRead: (id: string) => void;
  deleteEmail: (id: string) => void;
  sendEmailNotification: (notification: Omit<EmailNotification, 'id' | 'sentAt' | 'read'>) => void;

  // Auth & Navigation
  currentUser: User | null;
  userRole: UserRole;
  loginAsDemoUser: (role: 'admin' | 'contractor' | 'fan') => void;
  loginCustom: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;

  // Active View / Modals
  activeView: 'public' | 'admin' | 'contractor' | 'fan_club';
  setActiveView: (view: 'public' | 'admin' | 'contractor' | 'fan_club') => void;
  authModalOpen: boolean;
  openAuthModal: (initialRole?: UserRole) => void;
  closeAuthModal: () => void;
  emailModalOpen: boolean;
  setEmailModalOpen: (open: boolean) => void;
  selectedEmailForView: EmailNotification | null;
  setSelectedEmailForView: (email: EmailNotification | null) => void;

  selectedPhotoLightbox: PhotoItem | null;
  setSelectedPhotoLightbox: (photo: PhotoItem | null) => void;
  selectedVideoModal: VideoItem | null;
  setSelectedVideoModal: (video: VideoItem | null) => void;

  // Site Statistics
  siteVisits: number;
  incrementSiteVisits: () => void;

  toasts: ToastInfo[];
  removeToast: (id: string) => void;
  triggerConfetti: () => void;
  resetAllDataToDefault: () => void;
}

const BandContext = createContext<BandContextType | undefined>(undefined);

export const BandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage loaders with graceful brand migration
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const newKeyItem = localStorage.getItem(`jetsamba_band_${key}`);
      if (newKeyItem) {
        const parsed = JSON.parse(newKeyItem);
        if (key === 'info' && parsed) {
          const isOldTagline = !parsed.tagline || parsed.tagline.includes('Groove autêntico, swing contagiante');
          return {
            ...parsed,
            logoUrl: parsed.logoUrl || INITIAL_BAND_INFO.logoUrl,
            navbarLogoUrl: parsed.navbarLogoUrl || parsed.logoUrl || INITIAL_BAND_INFO.logoUrl,
            heroLogoUrl: parsed.heroLogoUrl || parsed.logoUrl || INITIAL_BAND_INFO.logoUrl,
            tagline: isOldTagline ? INITIAL_BAND_INFO.tagline : parsed.tagline
          } as unknown as T;
        }
        if (key === 'members' && Array.isArray(parsed)) {
          return parsed.map((m: BandMember) => {
            if (m.nickname === 'Becker' || m.name.includes('Becker') || m.id === 'member-1') {
              return { ...INITIAL_MEMBERS[0] };
            }
            return m;
          }) as unknown as T;
        }
        if (key === 'tracks' && Array.isArray(parsed)) {
          if (parsed.length > 0) {
            return parsed as unknown as T;
          }
          return fallback;
        }
        if (key === 'setlist_votes' && Array.isArray(parsed)) {
          return parsed.map((v: SetlistVoteItem) => {
            if (v.id === 'vote-1' || v.songTitle.toLowerCase().includes('neblina')) {
              return { ...INITIAL_SETLIST_VOTES[0] };
            }
            return v;
          }) as unknown as T;
        }
        if (key === 'fan_messages' && Array.isArray(parsed)) {
          return parsed.map((fm: FanMessage) => {
            if (fm.id === 'msg-2' && fm.content.includes('Neblina')) {
              return { ...INITIAL_FAN_MESSAGES[1] };
            }
            return fm;
          }) as unknown as T;
        }
        return parsed;
      }
      
      const oldItem = localStorage.getItem(`aurora_band_${key}`);
      if (oldItem) {
        const parsed = JSON.parse(oldItem);
        if (key === 'info' && parsed) {
          return { ...parsed, name: 'JET SAMBA BLACK', logoUrl: INITIAL_BAND_INFO.logoUrl } as unknown as T;
        }
        if (key === 'tracks' && Array.isArray(parsed)) {
          return INITIAL_TRACKS as unknown as T;
        }
        if (key === 'setlist_votes' && Array.isArray(parsed)) {
          return parsed.map((v: SetlistVoteItem) => {
            if (v.id === 'vote-1' || v.songTitle.toLowerCase().includes('neblina')) {
              return { ...INITIAL_SETLIST_VOTES[0] };
            }
            return v;
          }) as unknown as T;
        }
        if (key === 'members' && Array.isArray(parsed)) {
          return parsed as unknown as T;
        }
        return parsed;
      }
      return fallback;
    } catch {
      return fallback;
    }
  };

  const [bandInfo, setBandInfo] = useState<BandInfo>(() => loadStored('info', INITIAL_BAND_INFO));
  const [members, setMembers] = useState<BandMember[]>(() => loadStored('members', INITIAL_MEMBERS));
  const [shows, setShows] = useState<ShowEvent[]>(() => loadStored('shows', INITIAL_SHOWS));
  const [photos, setPhotos] = useState<PhotoItem[]>(() => loadStored('photos', INITIAL_PHOTOS));
  const [videos, setVideos] = useState<VideoItem[]>(() => loadStored('videos', INITIAL_VIDEOS));
  const [tracks, setTracks] = useState<AudioTrack[]>(() => loadStored('tracks', INITIAL_TRACKS));
  const [radioSettings, setRadioSettings] = useState<RadioSettings>(() => loadStored('radio_settings', INITIAL_RADIO_SETTINGS));
  const [radioTracks, setRadioTracks] = useState<RadioTrackItem[]>(() => loadStored('radio_tracks', INITIAL_RADIO_TRACKS));
  const [bookings, setBookings] = useState<BookingRequest[]>(() => loadStored('bookings', INITIAL_BOOKINGS));
  const [fanContent, setFanContent] = useState<ExclusiveFanContent[]>(() => loadStored('fan_content', INITIAL_FAN_CONTENT));
  const [fanMessages, setFanMessages] = useState<FanMessage[]>(() => loadStored('fan_messages', INITIAL_FAN_MESSAGES));
  const [setlistVotes, setSetlistVotes] = useState<SetlistVoteItem[]>(() => loadStored('setlist_votes', INITIAL_SETLIST_VOTES));
  const [emails, setEmails] = useState<EmailNotification[]>(() => loadStored('emails', INITIAL_EMAILS));

  // Current user state (Default to guest)
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadStored('current_user', null));

  // Radio JET Player State (Default to auto-play true on initial open)
  const [isRadioPlaying, setIsRadioPlaying] = useState<boolean>(true);
  const [isRadioMuted, setIsRadioMuted] = useState<boolean>(false);
  const [isRadioVisible, setIsRadioVisible] = useState<boolean>(true);

  // Player state
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(() => {
    try {
      const savedTrackId = localStorage.getItem('jetsamba_band_current_track_id');
      if (savedTrackId && tracks.length > 0) {
        const found = tracks.find(t => t.id === savedTrackId);
        if (found) return found;
      }
      return tracks[0] || null;
    } catch {
      return tracks[0] || null;
    }
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);

  // View state
  const [activeView, setActiveView] = useState<'public' | 'admin' | 'contractor' | 'fan_club'>('public');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<UserRole>('admin');
  const [emailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [selectedEmailForView, setSelectedEmailForView] = useState<EmailNotification | null>(null);

  // Media modals
  const [selectedPhotoLightbox, setSelectedPhotoLightbox] = useState<PhotoItem | null>(null);
  const [selectedVideoModal, setSelectedVideoModal] = useState<VideoItem | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Site visits counter (Loaded from localStorage with fallback base number)
  const [siteVisits, setSiteVisits] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('jetsamba_site_visits');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val > 0) return val;
      }
      return 15420;
    } catch {
      return 15420;
    }
  });

  const incrementSiteVisits = () => {
    setSiteVisits(prev => {
      const next = prev + 1;
      try {
        localStorage.setItem('jetsamba_site_visits', next.toString());
      } catch {}
      return next;
    });
  };

  // Automatically count visit per browser session
  useEffect(() => {
    try {
      const alreadyCountedInSession = sessionStorage.getItem('jetsamba_session_visited');
      if (!alreadyCountedInSession) {
        sessionStorage.setItem('jetsamba_session_visited', 'true');
        incrementSiteVisits();
      }
    } catch (e) {
      console.warn('Could not record site visit session:', e);
    }
  }, []);

  // Sync to localStorage safely (handling quota exceptions for audio dataUrls)
  useEffect(() => {
    try {
      localStorage.setItem('jetsamba_site_visits', siteVisits.toString());
    } catch {}
  }, [siteVisits]);

  useEffect(() => { localStorage.setItem('jetsamba_band_info', JSON.stringify(bandInfo)); }, [bandInfo]);
  useEffect(() => { localStorage.setItem('jetsamba_band_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('jetsamba_band_shows', JSON.stringify(shows)); }, [shows]);
  useEffect(() => { localStorage.setItem('jetsamba_band_photos', JSON.stringify(photos)); }, [photos]);
  useEffect(() => { localStorage.setItem('jetsamba_band_videos', JSON.stringify(videos)); }, [videos]);

  useEffect(() => {
    try {
      localStorage.setItem('jetsamba_band_radio_settings', JSON.stringify(radioSettings));
    } catch {
      try {
        const lightSettings = {
          ...radioSettings,
          audioUrl: radioSettings.audioUrl?.startsWith('data:') ? '' : radioSettings.audioUrl
        };
        localStorage.setItem('jetsamba_band_radio_settings', JSON.stringify(lightSettings));
      } catch (e) {
        console.warn('Could not save radio_settings to localStorage:', e);
      }
    }
  }, [radioSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('jetsamba_band_radio_tracks', JSON.stringify(radioTracks));
    } catch {
      try {
        const lightTracks = radioTracks.map(t => ({
          ...t,
          audioUrl: t.audioUrl?.startsWith('data:') ? '' : t.audioUrl
        }));
        localStorage.setItem('jetsamba_band_radio_tracks', JSON.stringify(lightTracks));
      } catch (e) {
        console.warn('Could not save radio_tracks to localStorage:', e);
      }
    }
  }, [radioTracks]);

  useEffect(() => {
    try {
      localStorage.setItem('jetsamba_band_tracks', JSON.stringify(tracks));
    } catch {
      try {
        const lightTracks = tracks.map(t => ({
          ...t,
          audioUrl: t.audioUrl?.startsWith('data:') ? '' : t.audioUrl
        }));
        localStorage.setItem('jetsamba_band_tracks', JSON.stringify(lightTracks));
      } catch (e) {
        console.warn('Could not save tracks to localStorage:', e);
      }
    }
  }, [tracks]);

  // Rehydrate any missing audio data from IndexedDB on initial mount
  useEffect(() => {
    async function rehydrateAudio() {
      let changed = false;
      const updatedTracks = await Promise.all(
        radioTracks.map(async (t) => {
          if ((!t.audioUrl || t.audioUrl === '') && t.sourceType === 'file') {
            const dbAudio = await getAudioFromIndexedDB(t.id);
            if (dbAudio) {
              changed = true;
              return { ...t, audioUrl: dbAudio };
            }
          }
          return t;
        })
      );

      if (changed) {
        setRadioTracks(updatedTracks);
        const activeT = updatedTracks.find(t => t.isActive);
        if (activeT && activeT.audioUrl) {
          setRadioSettings(prev => ({
            ...prev,
            audioUrl: activeT.audioUrl
          }));
        }
      }

      // Also rehydrate main tracks if any was stored in indexedDB
      const updatedMainTracks = await Promise.all(
        tracks.map(async (t) => {
          if (!t.audioUrl || t.audioUrl === '') {
            const dbAudio = await getAudioFromIndexedDB(t.id);
            if (dbAudio) {
              return { ...t, audioUrl: dbAudio };
            }
          }
          return t;
        })
      );
      if (JSON.stringify(updatedMainTracks) !== JSON.stringify(tracks)) {
        setTracks(updatedMainTracks);
      }
    }
    rehydrateAudio();
  }, []);

  useEffect(() => {
    if (currentTrack?.id) {
      try {
        localStorage.setItem('jetsamba_band_current_track_id', currentTrack.id);
      } catch (e) {
        console.warn('Could not save current_track_id to localStorage:', e);
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (tracks.length > 0) {
      if (!currentTrack || !tracks.some(t => t.id === currentTrack.id)) {
        setCurrentTrack(tracks[0]);
      }
    } else {
      setCurrentTrack(null);
    }
  }, [tracks]);

  useEffect(() => { localStorage.setItem('jetsamba_band_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('jetsamba_band_fan_content', JSON.stringify(fanContent)); }, [fanContent]);
  useEffect(() => { localStorage.setItem('jetsamba_band_fan_messages', JSON.stringify(fanMessages)); }, [fanMessages]);
  useEffect(() => { localStorage.setItem('jetsamba_band_setlist_votes', JSON.stringify(setlistVotes)); }, [setlistVotes]);
  useEffect(() => { localStorage.setItem('jetsamba_band_emails', JSON.stringify(emails)); }, [emails]);

  useEffect(() => { localStorage.setItem('jetsamba_band_current_user', JSON.stringify(currentUser)); }, [currentUser]);

  const addToast = (toast: Omit<ToastInfo, 'id'>) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast: ToastInfo = { ...toast, id };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // Band Info
  const updateBandInfo = (info: Partial<BandInfo>) => {
    setBandInfo(prev => ({ ...prev, ...info }));
    addToast({
      type: 'success',
      title: 'Informações Atualizadas',
      message: 'Os dados públicos da banda foram salvos com sucesso!'
    });
  };

  // Members
  const addMember = (memberData: Omit<BandMember, 'id'>) => {
    const newMember: BandMember = {
      ...memberData,
      id: 'member-' + Date.now()
    };
    setMembers(prev => [...prev, newMember]);
    addToast({
      type: 'success',
      title: 'Integrante Adicionado',
      message: `${memberData.name} foi adicionado à formação oficial da banda.`
    });
  };

  const updateMember = (id: string, memberData: Partial<BandMember>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...memberData } : m));
    addToast({
      type: 'success',
      title: 'Integrante Atualizado',
      message: 'As alterações do integrante foram salvas.'
    });
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    addToast({
      type: 'info',
      title: 'Integrante Removido',
      message: 'O integrante foi removido da listagem.'
    });
  };

  const moveMember = (id: string, direction: 'up' | 'down') => {
    setMembers(prev => {
      const index = prev.findIndex(m => m.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      const [movedItem] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, movedItem);
      return updated;
    });
    addToast({
      type: 'info',
      title: 'Posição Alterada',
      message: 'A ordem dos integrantes foi atualizada com sucesso!'
    });
  };

  const reorderMembers = (newMembers: BandMember[]) => {
    setMembers(newMembers);
    addToast({
      type: 'success',
      title: 'Ordem Salva',
      message: 'A nova sequência de integrantes foi salva!'
    });
  };

  // Shows
  const addShow = (showData: Omit<ShowEvent, 'id'>) => {
    const newShow: ShowEvent = {
      ...showData,
      id: 'show-' + Date.now()
    };
    setShows(prev => [newShow, ...prev]);
    addToast({
      type: 'success',
      title: 'Show Adicionado à Agenda',
      message: `${showData.title} em ${showData.city}/${showData.state} foi publicado!`
    });
  };

  const updateShow = (id: string, showData: Partial<ShowEvent>) => {
    setShows(prev => prev.map(s => s.id === id ? { ...s, ...showData } : s));
    addToast({
      type: 'success',
      title: 'Evento Atualizado',
      message: 'Informações do show foram atualizadas na agenda.'
    });
  };

  const deleteShow = (id: string) => {
    setShows(prev => prev.filter(s => s.id !== id));
    addToast({
      type: 'info',
      title: 'Show Removido',
      message: 'O evento foi removido da agenda.'
    });
  };

  // Photos
  const addPhoto = (photoData: Omit<PhotoItem, 'id'>) => {
    const newPhoto: PhotoItem = {
      ...photoData,
      id: 'photo-' + Date.now()
    };
    setPhotos(prev => [newPhoto, ...prev]);
    addToast({
      type: 'success',
      title: 'Foto Publicada',
      message: 'A imagem foi adicionada à galeria oficial de fotos.'
    });
  };

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
    addToast({
      type: 'info',
      title: 'Foto Excluída',
      message: 'A foto foi removida da galeria.'
    });
  };

  // Videos
  const addVideo = (videoData: Omit<VideoItem, 'id'>) => {
    const newVideo: VideoItem = {
      ...videoData,
      id: 'video-' + Date.now()
    };
    setVideos(prev => [newVideo, ...prev]);
    addToast({
      type: 'success',
      title: 'Vídeo do YouTube Adicionado',
      message: `"${videoData.title}" está disponível na galeria de vídeos.`
    });
  };

  const updateVideo = (id: string, videoData: Partial<VideoItem>) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...videoData } : v));
    addToast({
      type: 'success',
      title: 'Vídeo Atualizado',
      message: 'Dados do vídeo foram alterados.'
    });
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    addToast({
      type: 'info',
      title: 'Vídeo Removido',
      message: 'O vídeo foi excluído da galeria.'
    });
  };

  const moveVideo = (id: string, direction: 'up' | 'down') => {
    setVideos(prev => {
      const index = prev.findIndex(v => v.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
    addToast({
      type: 'info',
      title: 'Posição do Vídeo Alterada',
      message: 'A ordem de exibição dos vídeos foi atualizada!'
    });
  };

  const reorderVideos = (newVideos: VideoItem[]) => {
    setVideos(newVideos);
    addToast({
      type: 'success',
      title: 'Sequência de Vídeos Salva',
      message: 'A nova ordem dos vídeos foi salva com sucesso!'
    });
  };

  const setFeaturedVideo = (id: string) => {
    setVideos(prev => {
      const target = prev.find(v => v.id === id);
      if (!target) return prev;

      // Mark the selected video as featured, others as false
      const updated = prev.map(v => ({
        ...v,
        featured: v.id === id
      }));

      // Move featured video to the first position so it naturally leads the lineup and banner
      const featuredItem = updated.find(v => v.id === id);
      const otherItems = updated.filter(v => v.id !== id);
      return featuredItem ? [featuredItem, ...otherItems] : updated;
    });

    addToast({
      type: 'success',
      title: 'Lançamento em Destaque Definido',
      message: 'O vídeo foi configurado como destaque principal na página de vídeos.'
    });
  };

  // Audio Player (Faixas Principais & Demos da Tela Principal)
  const playTrack = (track: AudioTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (isRadioPlaying) {
      setIsRadioPlaying(false);
    }
    audioEngine.playTrack(
      track.id,
      track.durationSeconds,
      track.audioUrl,
      track.audioTone,
      (sec) => setCurrentTime(sec),
      () => nextTrack()
    );
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    audioEngine.pause();
  };

  const togglePlayTrack = (track?: AudioTrack) => {
    const target = track || currentTrack || tracks[0];
    if (!target) return;

    if (currentTrack?.id === target.id) {
      if (isPlaying) {
        pauseTrack();
      } else {
        setIsPlaying(true);
        if (isRadioPlaying) {
          setIsRadioPlaying(false);
        }
        audioEngine.resume();
      }
    } else {
      playTrack(target);
    }
  };

  const nextTrack = () => {
    if (!tracks.length) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  const prevTrack = () => {
    if (!tracks.length) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIndex]);
  };

  const seekTrack = (seconds: number) => {
    audioEngine.seek(seconds);
    setCurrentTime(seconds);
  };

  const setTrackVolume = (val: number) => {
    setVolumeState(val);
    audioEngine.setVolume(val);
  };

  const addTrack = (trackData: Omit<AudioTrack, 'id' | 'plays'> & { id?: string; plays?: number }) => {
    const newId = trackData.id || ('track-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6));
    const newTrack: AudioTrack = {
      ...trackData,
      id: newId,
      plays: trackData.plays || Math.floor(Math.random() * 50000) + 12000
    };

    // Save audio file to IndexedDB for persistent storage if it's a data url
    if (newTrack.audioUrl && newTrack.audioUrl.startsWith('data:')) {
      saveAudioToIndexedDB(newId, newTrack.audioUrl);
    }

    setTracks(prev => [newTrack, ...prev]);

    addToast({
      type: 'success',
      title: 'Faixa Principal Adicionada',
      message: `"${newTrack.title}" agora está visível na seção de Faixas Principais & Demos da tela principal!`
    });
  };

  const updateTrack = (id: string, updatedFields: Partial<AudioTrack>) => {
    setTracks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updatedFields };
        if (currentTrack?.id === id) {
          setCurrentTrack(updated);
        }
        if (updatedFields.audioUrl && updatedFields.audioUrl.startsWith('data:')) {
          saveAudioToIndexedDB(id, updatedFields.audioUrl);
        }
        return updated;
      }
      return t;
    }));

    addToast({
      type: 'success',
      title: 'Faixa Atualizada',
      message: 'As alterações na faixa foram salvas com sucesso!'
    });
  };

  const deleteTrack = (id: string) => {
    setTracks(prev => {
      const remaining = prev.filter(t => t.id !== id);
      if (currentTrack?.id === id) {
        if (isPlaying) {
          pauseTrack();
        }
        setCurrentTrack(remaining[0] || null);
      }
      return remaining;
    });

    addToast({
      type: 'info',
      title: 'Faixa Removida',
      message: 'A música foi removida da lista de Faixas Principais da tela inicial.'
    });
  };

  const reorderTracks = (newTracks: AudioTrack[]) => {
    setTracks(newTracks);
  };

  const moveTrack = (id: string, direction: 'up' | 'down') => {
    setTracks(prev => {
      const index = prev.findIndex(t => t.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, item);
      return copy;
    });
  };

  const restoreDefaultTracks = () => {
    setTracks(INITIAL_TRACKS);
    if (currentTrack && !INITIAL_TRACKS.some(t => t.id === currentTrack.id)) {
      setCurrentTrack(INITIAL_TRACKS[0] || null);
    }
    addToast({
      type: 'info',
      title: 'Faixas Restauradas',
      message: 'A lista de Faixas Principais & Demos foi restaurada para a configuração original da banda.'
    });
  };

  const clearTracksCache = () => {
    try {
      localStorage.removeItem('jetsamba_band_tracks');
      localStorage.removeItem('jetsamba_band_current_track');
      sessionStorage.removeItem('jetsamba_band_tracks');
    } catch (e) {
      console.warn('Erro ao limpar cache de faixas:', e);
    }
    setTracks(INITIAL_TRACKS);
    setCurrentTrack(INITIAL_TRACKS[0] || null);
    addToast({
      type: 'success',
      title: 'Cache de Faixas Limpo!',
      message: 'O cache local foi limpo e as Faixas Principais & Demos foram sincronizadas com sucesso.'
    });
  };

  // Radio JET & Main Screen Single ("Single: Lady")
  const updateRadioSettings = (settings: Partial<RadioSettings>) => {
    setRadioSettings(prev => {
      const updated = {
        ...prev,
        ...settings,
        updatedAt: new Date().toISOString()
      };
      return updated;
    });

    addToast({
      type: 'success',
      title: 'Rádio JET Atualizada',
      message: 'A faixa principal da tela inicial ("Single: Lady") foi atualizada com sucesso!'
    });
  };

  const addRadioTrack = (track: Omit<RadioTrackItem, 'id' | 'createdAt'>) => {
    const newId = 'radio-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const dateStr = new Date().toISOString().split('T')[0];
    const newTrackItem: RadioTrackItem = {
      ...track,
      id: newId,
      createdAt: dateStr
    };

    // Save audio file to IndexedDB for persistent storage
    if (track.audioUrl && track.audioUrl.startsWith('data:')) {
      saveAudioToIndexedDB(newId, track.audioUrl);
    }

    setRadioTracks(prev => {
      if (track.isActive) {
        return [newTrackItem, ...prev.map(t => ({ ...t, isActive: false }))];
      }
      return [newTrackItem, ...prev];
    });

    if (track.isActive) {
      setRadioSettings({
        title: track.title,
        artist: track.artist || 'JET SAMBA BLACK',
        badgeLabel: track.badgeLabel || 'Radio JET',
        sourceType: track.sourceType,
        audioUrl: track.audioUrl,
        soundCloudTrackUrl: track.soundCloudTrackUrl,
        soundCloudEmbedUrl: track.soundCloudEmbedUrl,
        duration: track.duration,
        description: track.description,
        fileName: track.fileName,
        fileSize: track.fileSize,
        updatedAt: dateStr
      });
      setIsRadioPlaying(true);
      setIsRadioVisible(true);
    }

    addToast({
      type: 'success',
      title: 'Música Adicionada à Biblioteca da Rádio JET',
      message: `A faixa "${track.title}" foi cadastrada com sucesso na biblioteca da Rádio.`
    });
  };

  const addMultipleRadioTracks = (tracksList: Omit<RadioTrackItem, 'id' | 'createdAt'>[]) => {
    if (!tracksList || tracksList.length === 0) return;

    const dateStr = new Date().toISOString().split('T')[0];
    const newTrackItems: RadioTrackItem[] = tracksList.map((t, idx) => {
      const newId = 'radio-' + Date.now() + '-' + idx + '-' + Math.random().toString(36).substring(2, 6);
      if (t.audioUrl && t.audioUrl.startsWith('data:')) {
        saveAudioToIndexedDB(newId, t.audioUrl);
      }
      return {
        ...t,
        id: newId,
        createdAt: dateStr
      };
    });

    const hasActive = newTrackItems.some(t => t.isActive);
    const activeTrack = hasActive ? newTrackItems.find(t => t.isActive) : undefined;

    setRadioTracks(prev => {
      if (hasActive) {
        return [...newTrackItems, ...prev.map(t => ({ ...t, isActive: false }))];
      }
      return [...newTrackItems, ...prev];
    });

    if (activeTrack) {
      setRadioSettings({
        title: activeTrack.title,
        artist: activeTrack.artist || 'JET SAMBA BLACK',
        badgeLabel: activeTrack.badgeLabel || 'Radio JET',
        sourceType: activeTrack.sourceType,
        audioUrl: activeTrack.audioUrl,
        soundCloudTrackUrl: activeTrack.soundCloudTrackUrl,
        soundCloudEmbedUrl: activeTrack.soundCloudEmbedUrl,
        duration: activeTrack.duration,
        description: activeTrack.description,
        fileName: activeTrack.fileName,
        fileSize: activeTrack.fileSize,
        updatedAt: dateStr
      });
      setIsRadioPlaying(true);
      setIsRadioVisible(true);
    }

    addToast({
      type: 'success',
      title: 'Músicas Adicionadas à Rádio JET',
      message: `${newTrackItems.length} nova(s) música(s) adicionada(s) à Biblioteca da Rádio JET com sucesso!`
    });
  };

  const updateRadioTrack = (id: string, updatedFields: Partial<RadioTrackItem>) => {
    setRadioTracks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const updated = { ...t, ...updatedFields };
          if (updated.isActive) {
            setRadioSettings({
              title: updated.title,
              artist: updated.artist || 'JET SAMBA BLACK',
              badgeLabel: updated.badgeLabel || 'Single: Lady',
              sourceType: updated.sourceType,
              audioUrl: updated.audioUrl,
              soundCloudTrackUrl: updated.soundCloudTrackUrl,
              soundCloudEmbedUrl: updated.soundCloudEmbedUrl,
              duration: updated.duration,
              description: updated.description,
              fileName: updated.fileName,
              fileSize: updated.fileSize,
              updatedAt: new Date().toISOString()
            });
          }
          return updated;
        }
        if (updatedFields.isActive) {
          return { ...t, isActive: false };
        }
        return t;
      })
    );

    addToast({
      type: 'success',
      title: 'Música Atualizada',
      message: 'As alterações na faixa da Rádio JET foram salvas.'
    });
  };

  const deleteRadioTrack = (id: string) => {
    deleteAudioFromIndexedDB(id);
    setRadioTracks(prev => {
      const target = prev.find(t => t.id === id);
      const remaining = prev.filter(t => t.id !== id);
      const wasActive = target?.isActive;

      if (wasActive) {
        if (remaining.length > 0) {
          const nextActive = remaining[0];
          nextActive.isActive = true;
          setRadioSettings({
            title: nextActive.title,
            artist: nextActive.artist || 'JET SAMBA BLACK',
            badgeLabel: nextActive.badgeLabel || 'Radio JET',
            sourceType: nextActive.sourceType,
            audioUrl: nextActive.audioUrl,
            soundCloudTrackUrl: nextActive.soundCloudTrackUrl,
            soundCloudEmbedUrl: nextActive.soundCloudEmbedUrl,
            duration: nextActive.duration,
            description: nextActive.description,
            fileName: nextActive.fileName,
            fileSize: nextActive.fileSize,
            updatedAt: new Date().toISOString()
          });
        } else {
          setRadioSettings(INITIAL_RADIO_SETTINGS);
        }
      }
      return remaining;
    });

    addToast({
      type: 'info',
      title: 'Música Removida',
      message: 'A faixa foi excluída da Biblioteca da Rádio JET.'
    });
  };

  const setActiveRadioTrack = (id: string) => {
    setRadioTracks(prev => {
      const target = prev.find(t => t.id === id);
      if (!target) return prev;

      setRadioSettings({
        title: target.title,
        artist: target.artist || 'JET SAMBA BLACK',
        badgeLabel: target.badgeLabel || 'Radio JET',
        sourceType: target.sourceType,
        audioUrl: target.audioUrl,
        soundCloudTrackUrl: target.soundCloudTrackUrl,
        soundCloudEmbedUrl: target.soundCloudEmbedUrl,
        duration: target.duration,
        description: target.description,
        fileName: target.fileName,
        fileSize: target.fileSize,
        updatedAt: new Date().toISOString()
      });

      return prev.map(t => ({
        ...t,
        isActive: t.id === id
      }));
    });

    setIsRadioPlaying(true);
    setIsRadioVisible(true);

    addToast({
      type: 'success',
      title: 'Música Ativa na Tela Principal!',
      message: 'Esta música agora está tocando na Rádio JET para todos os visitantes.'
    });
  };

  const reorderRadioTracks = (newTracks: RadioTrackItem[]) => {
    setRadioTracks(newTracks);
    addToast({
      type: 'success',
      title: 'Ordem da Rádio Salva',
      message: 'A sequência de músicas da Rádio JET foi reordenada com sucesso.'
    });
  };

  const moveRadioTrack = (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    setRadioTracks(prev => {
      const index = prev.findIndex(t => t.id === id);
      if (index === -1) return prev;
      const newTracks = [...prev];
      const [movedItem] = newTracks.splice(index, 1);

      if (direction === 'up' && index > 0) {
        newTracks.splice(index - 1, 0, movedItem);
      } else if (direction === 'down' && index < prev.length - 1) {
        newTracks.splice(index + 1, 0, movedItem);
      } else if (direction === 'top') {
        newTracks.unshift(movedItem);
      } else if (direction === 'bottom') {
        newTracks.push(movedItem);
      } else {
        newTracks.splice(index, 0, movedItem);
      }
      return newTracks;
    });

    addToast({
      type: 'success',
      title: 'Sequência Atualizada',
      message: 'A posição da faixa na sequência automática foi alterada.'
    });
  };

  const playNextRadioTrack = () => {
    setRadioTracks(prev => {
      if (prev.length === 0) return prev;
      const currentIndex = prev.findIndex(t => t.isActive);
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % prev.length : 0;
      const nextTrack = prev[nextIndex];

      setRadioSettings({
        title: nextTrack.title,
        artist: nextTrack.artist || 'JET SAMBA BLACK',
        badgeLabel: nextTrack.badgeLabel || 'Radio JET',
        sourceType: nextTrack.sourceType,
        audioUrl: nextTrack.audioUrl,
        soundCloudTrackUrl: nextTrack.soundCloudTrackUrl,
        soundCloudEmbedUrl: nextTrack.soundCloudEmbedUrl,
        duration: nextTrack.duration,
        description: nextTrack.description,
        fileName: nextTrack.fileName,
        fileSize: nextTrack.fileSize,
        updatedAt: new Date().toISOString()
      });

      return prev.map((t, idx) => ({
        ...t,
        isActive: idx === nextIndex
      }));
    });
    setIsRadioPlaying(true);
    setIsRadioVisible(true);
  };

  const playPrevRadioTrack = () => {
    setRadioTracks(prev => {
      if (prev.length === 0) return prev;
      const currentIndex = prev.findIndex(t => t.isActive);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : prev.length - 1;
      const prevTrack = prev[prevIndex];

      setRadioSettings({
        title: prevTrack.title,
        artist: prevTrack.artist || 'JET SAMBA BLACK',
        badgeLabel: prevTrack.badgeLabel || 'Radio JET',
        sourceType: prevTrack.sourceType,
        audioUrl: prevTrack.audioUrl,
        soundCloudTrackUrl: prevTrack.soundCloudTrackUrl,
        soundCloudEmbedUrl: prevTrack.soundCloudEmbedUrl,
        duration: prevTrack.duration,
        description: prevTrack.description,
        fileName: prevTrack.fileName,
        fileSize: prevTrack.fileSize,
        updatedAt: new Date().toISOString()
      });

      return prev.map((t, idx) => ({
        ...t,
        isActive: idx === prevIndex
      }));
    });
    setIsRadioPlaying(true);
    setIsRadioVisible(true);
  };

  const restoreDefaultRadioSingle = () => {
    setRadioSettings(INITIAL_RADIO_SETTINGS);
    setRadioTracks(INITIAL_RADIO_TRACKS);
    addToast({
      type: 'info',
      title: 'Padrão Restaurado',
      message: 'A Rádio JET e a faixa principal foram restauradas para a gravação original do God Bar Ao Vivo.'
    });
  };

  const clearRadioCache = () => {
    try {
      localStorage.removeItem('jetsamba_band_radio_settings');
      localStorage.removeItem('jetsamba_band_radio_tracks');
      sessionStorage.removeItem('jetsamba_band_radio_settings');
      sessionStorage.removeItem('jetsamba_band_radio_tracks');
    } catch (e) {
      console.warn('Erro ao limpar cache da rádio:', e);
    }
    setRadioSettings(INITIAL_RADIO_SETTINGS);
    setRadioTracks(INITIAL_RADIO_TRACKS);
    addToast({
      type: 'success',
      title: 'Cache da Rádio JET Limpo!',
      message: 'O cache da Rádio JET e a playlist foram limpos e sincronizados com sucesso.'
    });
  };

  const playRadio = () => {
    if (isPlaying) {
      pauseTrack();
    }
    setIsRadioVisible(true);
    setIsRadioPlaying(true);
  };

  const pauseRadio = () => {
    setIsRadioPlaying(false);
  };

  const stopRadio = () => {
    setIsRadioPlaying(false);
    setIsRadioVisible(false);
  };

  const toggleRadioPlay = () => {
    setIsRadioVisible(true);
    setIsRadioPlaying(prev => {
      const next = !prev;
      if (next && isPlaying) {
        pauseTrack();
      }
      return next;
    });
  };

  const toggleRadioMute = () => {
    setIsRadioMuted(prev => !prev);
  };

  const setRadioVisible = (visible: boolean) => {
    setIsRadioVisible(visible);
  };

  // Emails & Notifications
  const sendEmailNotification = (notifData: Omit<EmailNotification, 'id' | 'sentAt' | 'read'>) => {
    const dateStr = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    const newEmail: EmailNotification = {
      ...notifData,
      id: 'email-' + Date.now() + Math.random().toString(36).substring(2, 5),
      sentAt: dateStr,
      read: false
    };
    setEmails(prev => [newEmail, ...prev]);

    // Show simulated notification toast
    addToast({
      type: 'email',
      title: `✉️ Novo E-mail: ${notifData.recipientType === 'admin' ? 'Banda/Admin' : notifData.recipientName}`,
      message: notifData.subject,
      actionText: 'Abrir Caixa',
      onAction: () => {
        setSelectedEmailForView(newEmail);
        setEmailModalOpen(true);
      }
    });
  };

  const markEmailAsRead = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
  };

  const deleteEmail = (id: string) => {
    setEmails(prev => prev.filter(e => e.id !== id));
  };

  // Bookings
  const createBooking = (bookingData: Omit<BookingRequest, 'id' | 'createdAt' | 'status' | 'protocolNumber'>): BookingRequest => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const protocolNumber = `AE-2026-${randomSuffix}`;
    const newBooking: BookingRequest = {
      ...bookingData,
      id: 'booking-' + Date.now(),
      protocolNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
      contractorUserId: currentUser?.id || undefined
    };

    setBookings(prev => [newBooking, ...prev]);

    // Trigger celebratory confetti
    triggerConfetti();

    // 1. Dispatch simulated email notification to the Band Admin
    sendEmailNotification({
      recipientEmail: 'booking@auroraeclipse.com.br',
      recipientName: 'Gestão Artística Aurora Eclipse',
      recipientType: 'admin',
      subject: `🎸 Nova Solicitação de Show! Protocolo ${protocolNumber} (${bookingData.eventCity}/${bookingData.eventState})`,
      previewText: `${bookingData.contractorName} solicitou data para ${bookingData.eventDate} em ${bookingData.venueName}...`,
      type: 'new_booking',
      relatedId: newBooking.id,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background: #0f1015; color: #f3f4f6; padding: 24px; border-radius: 10px; border: 1px solid #27272a;">
          <div style="background: linear-gradient(135deg, #e11d48, #f59e0b); padding: 18px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #fff; text-transform: uppercase;">Nova Solicitação de Show</h2>
            <p style="margin: 4px 0 0 0; color: #fef08a; font-size: 13px;">Protocolo Oficial: ${protocolNumber}</p>
          </div>
          <p>Olá Equipe de Produção,</p>
          <p>Uma nova proposta de contratação de show acaba de ser enviada através do site oficial:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background: #18181b; border-radius: 6px; overflow: hidden;">
            <tr style="border-bottom: 1px solid #27272a;"><td style="padding: 10px; color: #a1a1aa; width: 140px;">Contratante:</td><td style="padding: 10px; font-weight: bold; color: #fff;">${bookingData.contractorName} ${bookingData.companyOrOrg ? `(${bookingData.companyOrOrg})` : ''}</td></tr>
            <tr style="border-bottom: 1px solid #27272a;"><td style="padding: 10px; color: #a1a1aa;">Contato:</td><td style="padding: 10px; color: #fff;">${bookingData.contractorEmail} | ${bookingData.contractorPhone}</td></tr>
            <tr style="border-bottom: 1px solid #27272a;"><td style="padding: 10px; color: #a1a1aa;">Data do Show:</td><td style="padding: 10px; font-weight: bold; color: #f43f5e;">${bookingData.eventDate}</td></tr>
            <tr style="border-bottom: 1px solid #27272a;"><td style="padding: 10px; color: #a1a1aa;">Local / Cidade:</td><td style="padding: 10px; color: #fff;">${bookingData.venueName} - ${bookingData.eventCity}/${bookingData.eventState}</td></tr>
            <tr style="border-bottom: 1px solid #27272a;"><td style="padding: 10px; color: #a1a1aa;">Tipo de Evento:</td><td style="padding: 10px; color: #fff;">${bookingData.eventType.toUpperCase()}</td></tr>
            <tr style="border-bottom: 1px solid #27272a;"><td style="padding: 10px; color: #a1a1aa;">Público Estimado:</td><td style="padding: 10px; color: #fff;">${bookingData.estimatedAudience}</td></tr>
            <tr style="border-bottom: 1px solid #27272a;"><td style="padding: 10px; color: #a1a1aa;">Proposta de Cachê:</td><td style="padding: 10px; font-weight: bold; color: #10b981;">${bookingData.budgetOffer}</td></tr>
            <tr><td style="padding: 10px; color: #a1a1aa;">Estrutura de Som/Luz:</td><td style="padding: 10px; color: #fff;">${bookingData.technicalStructureProvided ? 'Fornecida pelo Contratante (conforme Rider)' : 'A ser cotada'}</td></tr>
          </table>

          ${bookingData.notes ? `<div style="background: #27272a; padding: 12px; border-radius: 6px; margin-bottom: 16px;"><strong>Observações:</strong><p style="margin: 6px 0 0 0; color: #d4d4d8;">${bookingData.notes}</p></div>` : ''}

          <p style="font-size: 13px; color: #71717a;">Acesse o Painel Administrativo para aprovar ou enviar resposta formal.</p>
        </div>
      `
    });

    // 2. Dispatch simulated confirmation email to the Contractor
    sendEmailNotification({
      recipientEmail: bookingData.contractorEmail,
      recipientName: bookingData.contractorName,
      recipientType: 'contractor',
      subject: `📋 Confirmação de Proposta de Show - Protocolo ${protocolNumber}`,
      previewText: `Recebemos sua solicitação de show para ${bookingData.eventDate}. Nossa gerência responderá em até 24h úteis...`,
      type: 'booking_status_updated',
      relatedId: newBooking.id,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background: #0f1015; color: #f3f4f6; padding: 24px; border-radius: 10px; border: 1px solid #27272a;">
          <div style="background: linear-gradient(135deg, #10b981, #06b6d4); padding: 18px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #fff;">Proposta Recebida com Sucesso!</h2>
            <p style="margin: 4px 0 0 0; color: #ccfbf1; font-size: 13px;">Banda Aurora Eclipse • Booking Oficial</p>
          </div>
          <p>Prezado(a) <strong>${bookingData.contractorName}</strong>,</p>
          <p>Obrigado pelo contato! Sua solicitação de contratação para o evento em <strong>${bookingData.eventCity}/${bookingData.eventState}</strong> foi registrada no nosso sistema com o número de protocolo:</p>
          
          <div style="text-align: center; margin: 20px 0; padding: 16px; background: #18181b; border: 2px dashed #10b981; border-radius: 8px;">
            <span style="font-size: 24px; font-weight: bold; color: #34d399; letter-spacing: 2px;">${protocolNumber}</span>
          </div>

          <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">
            Nossa equipe de logística e produção artística avaliará a viabilidade da data (<strong>${bookingData.eventDate}</strong>) e entrará em contato em até 24 horas úteis com a minuta de contrato e direcionamento técnico.
          </p>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #27272a; font-size: 12px; color: #71717a; text-align: center;">
            Produção Aurora Eclipse | booking@auroraeclipse.com.br | +55 (11) 98765-4321
          </div>
        </div>
      `
    });

    addToast({
      type: 'success',
      title: 'Proposta Enviada com Sucesso!',
      message: `Protocolo ${protocolNumber} gerado. E-mails de notificação disparados!`
    });

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingRequest['status'], adminResponse?: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    setBookings(prev => prev.map(b => b.id === id ? { ...b, status, adminResponse: adminResponse || b.adminResponse } : b));

    const statusLabels: Record<BookingRequest['status'], string> = {
      pending: 'Pendente',
      analyzing: 'Em Análise Logística',
      approved: 'Aprovada',
      declined: 'Recusada',
      confirmed: 'Contrato Assinado & Confirmado'
    };

    // Dispatch email alert to contractor
    sendEmailNotification({
      recipientEmail: booking.contractorEmail,
      recipientName: booking.contractorName,
      recipientType: 'contractor',
      subject: `🔔 Atualização de Status da Proposta ${booking.protocolNumber}: ${statusLabels[status]}`,
      previewText: `O status da sua solicitação de show foi alterado para "${statusLabels[status]}"...`,
      type: 'booking_status_updated',
      relatedId: booking.id,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background: #0f1015; color: #f3f4f6; padding: 24px; border-radius: 10px;">
          <h2>Status do Agendamento Atualizado</h2>
          <p>Prezado(a) ${booking.contractorName},</p>
          <p>Sua proposta para o evento em <strong>${booking.eventCity}</strong> (Protocolo: <strong>${booking.protocolNumber}</strong>) teve o status atualizado para:</p>
          <div style="font-size: 18px; font-weight: bold; color: #f59e0b; padding: 12px; background: #1c1917; border-radius: 6px;">
            ${statusLabels[status]}
          </div>
          ${adminResponse ? `<p style="margin-top: 16px; color: #d4d4d8;"><strong>Mensagem da Produção:</strong><br/>${adminResponse}</p>` : ''}
        </div>
      `
    });

    addToast({
      type: 'success',
      title: 'Status da Proposta Atualizado',
      message: `Proposta ${booking.protocolNumber} marcada como "${statusLabels[status]}". Contratante notificado por e-mail.`
    });
  };

  // Fan Club
  const addFanContent = (contentData: Omit<ExclusiveFanContent, 'id' | 'publishedAt' | 'likes' | 'commentsCount'>) => {
    const newContent: ExclusiveFanContent = {
      ...contentData,
      id: 'fan-content-' + Date.now(),
      publishedAt: 'Agora há pouco',
      likes: 1,
      commentsCount: 0
    };
    setFanContent(prev => [newContent, ...prev]);

    // Send email blast to VIP fans
    sendEmailNotification({
      recipientEmail: 'fa@clube.com',
      recipientName: 'Membros do Fã Clube VIP',
      recipientType: 'fan',
      subject: `✨ Novo Conteúdo Exclusivo no Fã Clube: "${contentData.title}"`,
      previewText: `${contentData.description.substring(0, 80)}... Acesse já sua área VIP!`,
      type: 'exclusive_fan_alert',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background: #0f1015; color: #f3f4f6; padding: 24px; border-radius: 10px;">
          <h2 style="color: #f59e0b;">✨ Exclusivo para Fãs VIP</h2>
          <p>Acabamos de postar uma novidade que só vocês têm acesso:</p>
          <h3 style="color: #fff;">${contentData.title}</h3>
          <p style="color: #a1a1aa;">${contentData.description}</p>
        </div>
      `
    });

    addToast({
      type: 'success',
      title: 'Conteúdo VIP Publicado',
      message: 'Post publicado no feed exclusivo e alerta enviado aos fãs.'
    });
  };

  const deleteFanContent = (id: string) => {
    setFanContent(prev => prev.filter(c => c.id !== id));
  };

  const likeFanContent = (id: string) => {
    setFanContent(prev => prev.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c));
  };

  const addFanMessage = (content: string) => {
    const newMsg: FanMessage = {
      id: 'msg-' + Date.now(),
      fanId: currentUser?.id || 'fan-anon',
      fanName: currentUser?.name || 'Fã Apaixonado(a)',
      fanAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      fanTier: currentUser?.fanClubTier ? `${currentUser.fanClubTier} Member` : 'Fã Clube Oficial',
      content,
      date: 'Agora mesmo',
      likes: 0
    };
    setFanMessages(prev => [newMsg, ...prev]);
    triggerConfetti();
    addToast({
      type: 'success',
      title: 'Recado Enviado ao Mural',
      message: 'Sua mensagem foi enviada para os integrantes da banda!'
    });
  };

  const replyToFanMessage = (messageId: string, replyAuthor: string, replyText: string) => {
    const targetMsg = fanMessages.find(m => m.id === messageId);
    if (!targetMsg) return;

    setFanMessages(prev => prev.map(m => m.id === messageId ? {
      ...m,
      bandReply: {
        author: replyAuthor,
        text: replyText,
        date: 'Agora mesmo'
      }
    } : m));

    // Send email alert to the fan
    sendEmailNotification({
      recipientEmail: 'fa@clube.com',
      recipientName: targetMsg.fanName,
      recipientType: 'fan',
      subject: `🎸 ${replyAuthor} respondeu ao seu recado no Fã Clube!`,
      previewText: `"${replyText.substring(0, 80)}..."`,
      type: 'fan_reply',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background: #0f1015; color: #f3f4f6; padding: 24px; border-radius: 10px;">
          <h2 style="color: #ec4899;">Resposta Direta da Banda!</h2>
          <p>Olá ${targetMsg.fanName},</p>
          <p><strong>${replyAuthor}</strong> deixou uma resposta especial para o seu comentário:</p>
          <blockquote style="border-left: 3px solid #ec4899; padding-left: 12px; font-style: italic; color: #e5e7eb;">
            "${replyText}"
          </blockquote>
        </div>
      `
    });

    addToast({
      type: 'success',
      title: 'Resposta da Banda Publicada',
      message: `Resposta de ${replyAuthor} postada e fã notificado por e-mail!`
    });
  };

  const voteSong = (id: string) => {
    setSetlistVotes(prev => prev.map(v => v.id === id ? { ...v, votes: v.votes + 1, hasVoted: true } : v));
    triggerConfetti();
    addToast({
      type: 'success',
      title: 'Voto Computado na Setlist!',
      message: 'Seu voto foi registrado com sucesso para os próximos shows.'
    });
  };

  // Auth & Roles
  const loginAsDemoUser = (role: 'admin' | 'contractor' | 'fan') => {
    const demoUser = INITIAL_USERS.find(u => u.role === role);
    if (demoUser) {
      setCurrentUser(demoUser);
      setAuthModalOpen(false);
      if (role === 'admin') setActiveView('admin');
      else if (role === 'contractor') setActiveView('contractor');
      else if (role === 'fan') setActiveView('fan_club');

      addToast({
        type: 'success',
        title: `Conectado como ${demoUser.name}`,
        message: `Acesso liberado ao painel de ${role === 'admin' ? 'Administrador' : role === 'contractor' ? 'Contratante' : 'Fã VIP'}.`
      });
    }
  };

  const loginCustom = (email: string, role: UserRole, name?: string) => {
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: name || (role === 'admin' ? 'Administrador Banda' : role === 'contractor' ? 'Produtor / Contratante' : 'Fã Oficial'),
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      fanClubTier: role === 'fan' ? 'Gold' : undefined,
      memberNumber: role === 'fan' ? `AE-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setCurrentUser(newUser);
    setAuthModalOpen(false);
    if (role === 'admin') setActiveView('admin');
    else if (role === 'contractor') setActiveView('contractor');
    else if (role === 'fan') setActiveView('fan_club');

    addToast({
      type: 'success',
      title: `Bem-vindo(a), ${newUser.name}!`,
      message: `Login efetuado com sucesso no perfil ${role}.`
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('public');
    addToast({
      type: 'info',
      title: 'Sessão Encerrada',
      message: 'Você saiu da conta.'
    });
  };

  const openAuthModal = (initialRole: UserRole = 'admin') => {
    setAuthModalInitialRole(initialRole);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const resetAllDataToDefault = () => {
    setBandInfo(INITIAL_BAND_INFO);
    setMembers(INITIAL_MEMBERS);
    setShows(INITIAL_SHOWS);
    setPhotos(INITIAL_PHOTOS);
    setVideos(INITIAL_VIDEOS);
    setBookings(INITIAL_BOOKINGS);
    setFanContent(INITIAL_FAN_CONTENT);
    setFanMessages(INITIAL_FAN_MESSAGES);
    setSetlistVotes(INITIAL_SETLIST_VOTES);
    setEmails(INITIAL_EMAILS);
    setSiteVisits(15420);
    setCurrentUser(null);
    setActiveView('public');
    localStorage.clear();
    localStorage.setItem('jetsamba_site_visits', '15420');
    addToast({
      type: 'info',
      title: 'Dados Restaurados',
      message: 'Todas as informações da banda e demonstrações foram restauradas ao padrão original.'
    });
  };

  const unreadEmailCount = emails.filter(e => !e.read).length;
  const userRole: UserRole = currentUser?.role || 'guest';

  return (
    <BandContext.Provider
      value={{
        bandInfo,
        updateBandInfo,
        members,
        addMember,
        updateMember,
        deleteMember,
        moveMember,
        reorderMembers,
        shows,
        addShow,
        updateShow,
        deleteShow,
        photos,
        addPhoto,
        deletePhoto,
        videos,
        addVideo,
        updateVideo,
        deleteVideo,
        moveVideo,
        reorderVideos,
        setFeaturedVideo,
        tracks,
        currentTrack,
        isPlaying,
        currentTime,
        volume,
        playTrack,
        pauseTrack,
        togglePlayTrack,
        nextTrack,
        prevTrack,
        seekTrack,
        setTrackVolume,
        addTrack,
        updateTrack,
        deleteTrack,
        reorderTracks,
        moveTrack,
        restoreDefaultTracks,
        clearTracksCache,
        radioSettings,
        radioTracks,
        isRadioPlaying,
        isRadioMuted,
        isRadioVisible,
        updateRadioSettings,
        addRadioTrack,
        addMultipleRadioTracks,
        updateRadioTrack,
        deleteRadioTrack,
        setActiveRadioTrack,
        reorderRadioTracks,
        moveRadioTrack,
        restoreDefaultRadioSingle,
        clearRadioCache,
        playRadio,
        pauseRadio,
        stopRadio,
        toggleRadioPlay,
        toggleRadioMute,
        setRadioVisible,
        setIsRadioPlaying,
        playNextRadioTrack,
        playPrevRadioTrack,
        bookings,
        createBooking,
        updateBookingStatus,
        fanContent,
        addFanContent,
        deleteFanContent,
        likeFanContent,
        fanMessages,
        addFanMessage,
        replyToFanMessage,
        setlistVotes,
        voteSong,
        emails,
        unreadEmailCount,
        markEmailAsRead,
        deleteEmail,
        sendEmailNotification,
        currentUser,
        userRole,
        loginAsDemoUser,
        loginCustom,
        logout,
        activeView,
        setActiveView,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        emailModalOpen,
        setEmailModalOpen,
        selectedEmailForView,
        setSelectedEmailForView,
        selectedPhotoLightbox,
        setSelectedPhotoLightbox,
        selectedVideoModal,
        setSelectedVideoModal,
        siteVisits,
        incrementSiteVisits,
        toasts,
        removeToast,
        triggerConfetti,
        resetAllDataToDefault
      }}
    >
      {children}
    </BandContext.Provider>
  );
};

export const useBand = () => {
  const context = useContext(BandContext);
  if (!context) {
    throw new Error('useBand must be used within a BandProvider');
  }
  return context;
};
