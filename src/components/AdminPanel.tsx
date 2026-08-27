import React, { useState, useRef, useEffect } from 'react';
import { useBand } from '../context/BandContext';
import { AdminRadioJetTab } from './AdminRadioJetTab';
import { AdminBrandVisualsSection } from './AdminBrandVisualsSection';
import { MarqueeText } from './MarqueeText';
import {
  ShieldCheck,
  Calendar,
  Image as ImageIcon,
  Film,
  Users,
  Briefcase,
  Star,
  Settings,
  Mail,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  Clock,
  X,
  ExternalLink,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Search,
  Ticket,
  Flame,
  Gift,
  Lock,
  Camera,
  Upload,
  RefreshCw,
  FolderOpen,
  AlertTriangle,
  BookOpen,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  GripVertical,
  ListOrdered,
  Youtube,
  Play,
  Pause,
  Eye,
  Radio
} from 'lucide-react';
import { BandMember, ShowEvent, PhotoItem, VideoItem, BookingRequest } from '../types';

export const AdminPanel: React.FC = () => {
  const {
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
    bookings,
    updateBookingStatus,
    fanContent,
    addFanContent,
    deleteFanContent,
    fanMessages,
    replyToFanMessage,
    setActiveView,
    setEmailModalOpen,
    unreadEmailCount,
    radioSettings,
    isRadioPlaying,
    toggleRadioPlay,
    siteVisits
  } = useBand();

  const [activeTab, setActiveTab] = useState<'overview' | 'radio' | 'shows' | 'photos_videos' | 'members_bio' | 'bookings' | 'fan_club' | 'settings'>('overview');

  // Form states for adding items
  const [showModalAddShow, setShowModalAddShow] = useState(false);
  const [showModalAddPhoto, setShowModalAddPhoto] = useState(false);
  const [showModalAddVideo, setShowModalAddVideo] = useState(false);
  const [showModalAddMember, setShowModalAddMember] = useState(false);
  const [showModalAddFanPost, setShowModalAddFanPost] = useState(false);

  // Editing Band Info form
  const [infoForm, setInfoForm] = useState(bandInfo);

  // New Show state
  const [newShow, setNewShow] = useState({
    title: '',
    date: '',
    time: '21:00',
    venue: '',
    city: '',
    state: 'SP',
    ticketStatus: 'available' as ShowEvent['ticketStatus'],
    ticketUrl: 'https://eventim.com.br',
    ticketPrice: 'R$ 80 - R$ 160',
    description: '',
    featured: false
  });

  // New Photo state
  const [newPhoto, setNewPhoto] = useState({
    url: '',
    title: '',
    category: 'shows' as PhotoItem['category'],
    date: 'Agosto 2026',
    location: '',
    photographer: 'Produção Oficial'
  });

  // New / Edit Video state
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [showReorderVideosModal, setShowReorderVideosModal] = useState<boolean>(false);
  const [tempReorderedVideos, setTempReorderedVideos] = useState<VideoItem[]>([]);
  const [newVideo, setNewVideo] = useState({
    youtubeId: '',
    title: '',
    type: 'clip' as VideoItem['type'],
    releaseDate: '2026',
    views: 'Recém lançado',
    duration: '4:00',
    description: '',
    featured: false
  });

  // New / Edit Member state
  const [editingMember, setEditingMember] = useState<BandMember | null>(null);
  const [memberToDeleteConfirm, setMemberToDeleteConfirm] = useState<BandMember | null>(null);
  const [showReorderModal, setShowReorderModal] = useState<boolean>(false);
  const [tempReorderedMembers, setTempReorderedMembers] = useState<BandMember[]>([]);
  const [newMember, setNewMember] = useState({
    name: '',
    nickname: '',
    role: '',
    instruments: '',
    photo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    bio: '',
    gear: '',
    socials: { instagram: 'https://instagram.com' }
  });

  // Member photo capture & gallery picker states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    stopCamera();
    setCameraLoading(true);
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Câmera não suportada neste dispositivo/navegador.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1080 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      mediaStreamRef.current = stream;
      setIsCameraActive(true);
      setCameraLoading(false);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Erro ao acessar câmera:', err);
      setCameraLoading(false);
      setCameraError(
        err?.name === 'NotAllowedError'
          ? 'Permissão de acesso à câmera negada. Autorize o navegador.'
          : 'Não foi possível inicializar a câmera do dispositivo.'
      );
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraLoading(false);
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // If user facing mode, flip horizontally for natural mirror effect
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setNewMember((prev) => ({ ...prev, photo: dataUrl }));
    }
    stopCamera();
  };

  const handleMemberFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewMember((prev) => ({ ...prev, photo: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // New Fan post state
  const [newFanPost, setNewFanPost] = useState({
    title: '',
    type: 'behind_the_scenes' as const,
    thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    description: '',
    minTier: 'Silver' as const
  });

  // Reply fan message state
  const [replyMessageId, setReplyMessageId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('Iuri Campos (Bateria)');
  const [replyText, setReplyText] = useState('');

  // Booking response modal
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<BookingRequest | null>(null);
  const [adminResponseText, setAdminResponseText] = useState('');

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateBandInfo(infoForm);
  };

  const handleCreateShow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShow.title || !newShow.date || !newShow.city) return;
    const showToAdd = {
      ...newShow,
      ticketPrice: newShow.ticketStatus === 'free' ? 'Entrada Franca' : newShow.ticketStatus === 'private' ? 'Evento Fechado' : newShow.ticketPrice,
      ticketUrl: (newShow.ticketStatus === 'free' || newShow.ticketStatus === 'private') ? '' : newShow.ticketUrl
    };
    addShow(showToAdd);
    setShowModalAddShow(false);
    setNewShow({
      title: '',
      date: '',
      time: '21:00',
      venue: '',
      city: '',
      state: 'SP',
      ticketStatus: 'available',
      ticketUrl: 'https://eventim.com.br',
      ticketPrice: 'R$ 80 - R$ 160',
      description: '',
      featured: false
    });
  };

  const handleCreatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.url || !newPhoto.title) return;
    addPhoto(newPhoto);
    setShowModalAddPhoto(false);
    setNewPhoto({
      url: '',
      title: '',
      category: 'shows',
      date: 'Agosto 2026',
      location: '',
      photographer: 'Produção Oficial'
    });
  };

  // Video Handlers
  const handleOpenAddVideo = () => {
    setEditingVideo(null);
    setNewVideo({
      youtubeId: '',
      title: '',
      type: 'clip',
      releaseDate: '2026',
      views: 'Recém lançado',
      duration: '4:00',
      description: '',
      featured: videos.length === 0
    });
    setShowModalAddVideo(true);
  };

  const handleOpenEditVideo = (vid: VideoItem) => {
    setEditingVideo(vid);
    setNewVideo({
      youtubeId: vid.youtubeId,
      title: vid.title,
      type: vid.type,
      releaseDate: vid.releaseDate || '2026',
      views: vid.views || '',
      duration: vid.duration || '4:00',
      description: vid.description || '',
      featured: vid.featured || false
    });
    setShowModalAddVideo(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.youtubeId || !newVideo.title) return;
    
    // Extract video ID cleanly from various YouTube URL formats
    let vidId = newVideo.youtubeId.trim();
    if (vidId.includes('v=')) {
      vidId = vidId.split('v=')[1].split('&')[0];
    } else if (vidId.includes('youtu.be/')) {
      vidId = vidId.split('youtu.be/')[1].split('?')[0];
    } else if (vidId.includes('youtube.com/embed/')) {
      vidId = vidId.split('youtube.com/embed/')[1].split('?')[0];
    } else if (vidId.includes('youtube.com/live/')) {
      vidId = vidId.split('youtube.com/live/')[1].split('?')[0];
    }

    if (editingVideo) {
      updateVideo(editingVideo.id, {
        youtubeId: vidId,
        title: newVideo.title,
        type: newVideo.type,
        releaseDate: newVideo.releaseDate,
        views: newVideo.views,
        duration: newVideo.duration,
        description: newVideo.description,
        featured: newVideo.featured
      });
      if (newVideo.featured) {
        setFeaturedVideo(editingVideo.id);
      }
    } else {
      addVideo({
        youtubeId: vidId,
        title: newVideo.title,
        type: newVideo.type,
        releaseDate: newVideo.releaseDate,
        views: newVideo.views,
        duration: newVideo.duration,
        description: newVideo.description,
        featured: newVideo.featured
      });
    }

    setShowModalAddVideo(false);
    setEditingVideo(null);
    setNewVideo({
      youtubeId: '',
      title: '',
      type: 'clip',
      releaseDate: '2026',
      views: 'Recém lançado',
      duration: '4:00',
      description: '',
      featured: false
    });
  };

  const handleOpenReorderVideosModal = () => {
    setTempReorderedVideos([...videos]);
    setShowReorderVideosModal(true);
  };

  const handleMoveVideoInModal = (index: number, direction: 'up' | 'down' | 'top' | 'bottom') => {
    const list = [...tempReorderedVideos];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    } else if (direction === 'top' && index > 0) {
      const [item] = list.splice(index, 1);
      list.unshift(item);
    } else if (direction === 'bottom' && index < list.length - 1) {
      const [item] = list.splice(index, 1);
      list.push(item);
    }
    setTempReorderedVideos(list);
  };

  const handleSaveReorderedVideos = () => {
    reorderVideos(tempReorderedVideos);
    setShowReorderVideosModal(false);
  };

  const handleMoveVideoDirect = (id: string, direction: 'up' | 'down') => {
    moveVideo(id, direction);
  };

  const handleDirectVideoPositionChange = (videoId: string, newPos: number) => {
    const currentIndex = videos.findIndex(v => v.id === videoId);
    if (currentIndex === -1 || newPos === currentIndex) return;
    const updated = [...videos];
    const [moved] = updated.splice(currentIndex, 1);
    updated.splice(newPos, 0, moved);
    reorderVideos(updated);
  };

  const handleSetFeaturedVideo = (id: string) => {
    setFeaturedVideo(id);
  };

  // Member Handlers
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setNewMember({
      name: '',
      nickname: '',
      role: '',
      instruments: '',
      photo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      bio: '',
      gear: '',
      socials: { instagram: 'https://instagram.com' }
    });
    setShowModalAddMember(true);
  };

  const handleOpenEditMember = (member: BandMember) => {
    setEditingMember(member);
    setNewMember({
      name: member.name,
      nickname: member.nickname || '',
      role: member.role,
      instruments: Array.isArray(member.instruments) ? member.instruments.join(', ') : (member.instruments || ''),
      photo: member.photo || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      bio: member.bio || '',
      gear: member.gear || '',
      socials: member.socials || { instagram: 'https://instagram.com' }
    });
    setShowModalAddMember(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role) return;

    const instrumentsArray = newMember.instruments.split(',').map((i) => i.trim()).filter(Boolean);

    if (editingMember) {
      updateMember(editingMember.id, {
        name: newMember.name,
        nickname: newMember.nickname || newMember.name.split(' ')[0],
        role: newMember.role,
        instruments: instrumentsArray,
        photo: newMember.photo,
        bio: newMember.bio,
        gear: newMember.gear,
        socials: newMember.socials
      });
    } else {
      addMember({
        name: newMember.name,
        nickname: newMember.nickname || newMember.name.split(' ')[0],
        role: newMember.role,
        instruments: instrumentsArray,
        photo: newMember.photo,
        bio: newMember.bio,
        gear: newMember.gear,
        socials: newMember.socials
      });
    }

    stopCamera();
    setShowGalleryPicker(false);
    setEditingMember(null);
    setShowModalAddMember(false);
    setNewMember({
      name: '',
      nickname: '',
      role: '',
      instruments: '',
      photo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      bio: '',
      gear: '',
      socials: { instagram: 'https://instagram.com' }
    });
  };

  const handleOpenReorderModal = () => {
    setTempReorderedMembers([...members]);
    setShowReorderModal(true);
  };

  const handleMoveInModal = (index: number, direction: 'up' | 'down' | 'top' | 'bottom') => {
    const list = [...tempReorderedMembers];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    } else if (direction === 'top' && index > 0) {
      const [item] = list.splice(index, 1);
      list.unshift(item);
    } else if (direction === 'bottom' && index < list.length - 1) {
      const [item] = list.splice(index, 1);
      list.push(item);
    }
    setTempReorderedMembers(list);
  };

  const handleSaveReorderedList = () => {
    reorderMembers(tempReorderedMembers);
    setShowReorderModal(false);
  };

  const handleMoveMemberDirect = (id: string, direction: 'up' | 'down') => {
    moveMember(id, direction);
  };

  const handleDirectPositionChange = (memberId: string, newPos: number) => {
    const currentIndex = members.findIndex(m => m.id === memberId);
    if (currentIndex === -1 || newPos === currentIndex) return;
    const updated = [...members];
    const [moved] = updated.splice(currentIndex, 1);
    updated.splice(newPos, 0, moved);
    reorderMembers(updated);
  };

  const handleCreateFanPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFanPost.title || !newFanPost.description) return;
    addFanContent(newFanPost);
    setShowModalAddFanPost(false);
    setNewFanPost({
      title: '',
      type: 'behind_the_scenes',
      thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      description: '',
      minTier: 'Silver'
    });
  };

  const handleSendFanReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessageId || !replyText) return;
    replyToFanMessage(replyMessageId, replyAuthor, replyText);
    setReplyMessageId(null);
    setReplyText('');
  };

  const handleUpdateBookingWithMsg = (status: BookingRequest['status']) => {
    if (!selectedBookingForAction) return;
    updateBookingStatus(selectedBookingForAction.id, status, adminResponseText);
    setSelectedBookingForAction(null);
    setAdminResponseText('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      {/* Top Admin Header Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveView('public')}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title="Voltar ao site público"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="p-2 bg-rose-600/20 text-rose-400 rounded-xl border border-rose-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-wide text-white">Painel Administrativo da Banda</h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Gerente / Produção
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Gerencie shows, mídias, integrantes, contratos e notificações de e-mail da banda {bandInfo.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setEmailModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-2 border border-zinc-700"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Notificações por E-mail</span>
              {unreadEmailCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  {unreadEmailCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('public')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold shadow-md shadow-rose-950/40"
            >
              Ver Site Público
            </button>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-800 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            📊 Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('radio')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'radio'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Radio JET</span>
          </button>
          <button
            onClick={() => setActiveTab('shows')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'shows'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agenda de Shows ({shows.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Contratações ({bookings.length})</span>
            {bookings.filter(b => b.status === 'pending').length > 0 && (
              <span className="bg-amber-400 text-zinc-950 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {bookings.filter(b => b.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('photos_videos')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'photos_videos'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Fotos & Vídeos ({photos.length + videos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('members_bio')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'members_bio'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Integrantes & História</span>
          </button>
          <button
            onClick={() => setActiveTab('fan_club')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'fan_club'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-lg shadow-amber-950/50'
                : 'text-amber-400 hover:text-amber-300 hover:bg-zinc-900'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Fã Clube & Mural</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configurações Gerais</span>
          </button>
        </div>

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8">
            {/* Brand Logo & Visual Identity Management for Public Homepage */}
            <AdminBrandVisualsSection />

            {/* Live Radio JET Monitor Ticker */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-rose-500/40 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center shrink-0 shadow-md">
                  <Radio className={`w-5 h-5 text-white ${isRadioPlaying ? 'animate-pulse' : ''}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      Rádio JET • No Ar
                    </span>
                    <span className="text-[10px] font-bold text-amber-400">
                      Transmissão Oficial
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <MarqueeText
                      text={`${radioSettings?.artist || 'JET SAMBA BLACK'} • ${radioSettings?.title || 'God Bar Ao Vivo'}  —  [Selo: ${radioSettings?.badgeLabel || 'Radio JET'}]`}
                      badge={radioSettings?.badgeLabel || 'Radio JET'}
                      className="text-xs sm:text-sm font-black text-white"
                      speed="normal"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleRadioPlay()}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isRadioPlaying
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {isRadioPlaying ? <><Pause className="w-3.5 h-3.5 fill-current" /><span>Pausar</span></> : <><Play className="w-3.5 h-3.5 fill-current" /><span>Ouvir</span></>}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('radio')}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 transition-colors"
                >
                  Gerenciar Rádio JET
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-bold">
                  <span>Visitas no Site</span>
                  <Eye className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-black text-white mt-2">+{siteVisits.toLocaleString('pt-BR')}</div>
                <div className="text-xs text-rose-400 mt-1 font-semibold">
                  Contador da página inicial
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-bold">
                  <span>Shows na Agenda</span>
                  <Calendar className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-black text-white mt-2">{shows.length}</div>
                <div className="text-xs text-emerald-400 mt-1 font-semibold">
                  {shows.filter(s => !s.isPast).length} confirmados para 2026
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-bold">
                  <span>Solicitações de Shows</span>
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white mt-2">{bookings.length}</div>
                <div className="text-xs text-amber-400 mt-1 font-semibold">
                  {bookings.filter(b => b.status === 'pending').length} aguardando resposta
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-bold">
                  <span>Fotos & Vídeos</span>
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-white mt-2">{photos.length + videos.length}</div>
                <div className="text-xs text-zinc-400 mt-1">
                  {photos.length} fotos • {videos.length} vídeos YouTube
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-bold">
                  <span>Recados de Fãs VIP</span>
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white mt-2">{fanMessages.length}</div>
                <div className="text-xs text-amber-300 mt-1 font-semibold">
                  {fanMessages.filter(m => !m.bandReply).length} aguardando resposta da banda
                </div>
              </div>
            </div>

            {/* Recent Bookings Quick Table */}
            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <span>Últimas Solicitações de Contratação</span>
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Ver todas ({bookings.length})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Protocolo</th>
                      <th className="p-3">Contratante</th>
                      <th className="p-3">Data Evento</th>
                      <th className="p-3">Cidade/Local</th>
                      <th className="p-3">Cachê Oferecido</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {bookings.slice(0, 4).map((b) => (
                      <tr key={b.id} className="hover:bg-zinc-800/40">
                        <td className="p-3 font-mono font-bold text-emerald-400">{b.protocolNumber}</td>
                        <td className="p-3 font-semibold text-white">{b.contractorName} ({b.companyOrOrg || 'Particular'})</td>
                        <td className="p-3 font-mono">{b.eventDate}</td>
                        <td className="p-3">{b.eventCity}/{b.eventState} ({b.venueName})</td>
                        <td className="p-3 font-bold text-emerald-300">{b.budgetOffer}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedBookingForAction(b);
                              setActiveTab('bookings');
                            }}
                            className="px-2.5 py-1 bg-zinc-800 hover:bg-rose-600 text-white rounded-lg font-bold"
                          >
                            Gerenciar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Radio JET */}
        {activeTab === 'radio' && (
          <div className="mt-8">
            <AdminRadioJetTab />
          </div>
        )}

        {/* Tab 2: Shows Management */}
        {activeTab === 'shows' && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Gerenciar Agenda de Shows & Turnê</h3>
                <p className="text-xs text-zinc-400">Adicione, edite ou exclua datas da turnê da banda.</p>
              </div>

              <button
                onClick={() => setShowModalAddShow(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Show</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shows.map((show) => (
                <div key={show.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <span className="text-xs font-mono font-bold text-rose-400">
                        {show.date} • {show.time}
                      </span>
                      
                      {show.ticketStatus === 'free' ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400" /> Livre / Entrada Franca
                        </span>
                      ) : show.ticketStatus === 'private' ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-purple-400" /> Show Privado
                        </span>
                      ) : show.ticketStatus === 'sold_out' ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-rose-400" /> Esgotado
                        </span>
                      ) : show.ticketStatus === 'coming_soon' ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" /> Vendas em Breve
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                          <Ticket className="w-3 h-3 text-blue-400" /> Ingressos À Venda
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white">{show.title}</h4>
                    <p className="text-xs text-zinc-300 mt-0.5">{show.venue} — {show.city}/{show.state}</p>
                    
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      {show.ticketStatus === 'free' ? (
                        <span className="text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                          Acesso: Gratuito (Sem ingressos)
                        </span>
                      ) : show.ticketStatus === 'private' ? (
                        <span className="text-purple-300 font-semibold bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-purple-400" /> Acesso: Evento Fechado / Privado
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">
                          Ingresso: {show.ticketPrice || 'A definir'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={show.ticketStatus}
                        onChange={(e) => {
                          const val = e.target.value as ShowEvent['ticketStatus'];
                          updateShow(show.id, {
                            ticketStatus: val,
                            ticketPrice: val === 'free' ? 'Entrada Franca' : val === 'private' ? 'Evento Fechado' : show.ticketPrice
                          });
                        }}
                        className="bg-zinc-950 border border-zinc-700 text-zinc-300 text-xs rounded-lg px-2 py-1 cursor-pointer"
                        title="Alterar status de ingressos"
                      >
                        <option value="free">Livre / Entrada Franca</option>
                        <option value="private">Show Privado (Evento Fechado)</option>
                        <option value="available">Ingressos À Venda</option>
                        <option value="coming_soon">Vendas em Breve</option>
                        <option value="sold_out">Esgotado</option>
                      </select>

                      <button
                        onClick={() => updateShow(show.id, { featured: !show.featured })}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer ${
                          show.featured ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'text-zinc-500 border-zinc-800'
                        }`}
                      >
                        {show.featured ? '★ Destaque' : 'Destacar'}
                      </button>
                    </div>

                    <button
                      onClick={() => deleteShow(show.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800 cursor-pointer"
                      title="Excluir show"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Bookings Management */}
        {activeTab === 'bookings' && (
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Solicitações de Contratação & Propostas</h3>
              <p className="text-xs text-zinc-400">Responda a contratantes e atualize o status de cada show.</p>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-mono font-black text-emerald-400">{booking.protocolNumber}</span>
                      <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-zinc-800 text-zinc-200">
                        {booking.eventType.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400 font-mono">Data do Evento:</span>
                      <strong className="text-rose-400 font-mono">{booking.eventDate}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-500 uppercase font-bold">Contratante:</span>
                      <p className="text-white font-semibold text-sm">{booking.contractorName}</p>
                      <p className="text-zinc-400">{booking.companyOrOrg}</p>
                      <p className="text-zinc-400">{booking.contractorEmail} | {booking.contractorPhone}</p>
                    </div>

                    <div>
                      <span className="text-zinc-500 uppercase font-bold">Local & Público:</span>
                      <p className="text-white font-semibold">{booking.venueName}</p>
                      <p className="text-zinc-400">{booking.eventCity}/{booking.eventState}</p>
                      <p className="text-zinc-400">Público: {booking.estimatedAudience}</p>
                    </div>

                    <div>
                      <span className="text-zinc-500 uppercase font-bold">Proposta Comercial:</span>
                      <p className="text-emerald-400 font-bold text-sm">{booking.budgetOffer}</p>
                      <p className="text-zinc-400">Rider: {booking.technicalStructureProvided ? 'Fornecido pelo contratante' : 'A negociar'}</p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-300">
                      <strong>Observações do Contratante:</strong> {booking.notes}
                    </div>
                  )}

                  {booking.adminResponse && (
                    <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 text-xs text-rose-200">
                      <strong>Última Resposta da Produção:</strong> {booking.adminResponse}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Alterar Status:</span>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'analyzing', 'Sua proposta está sob análise da produção.')}
                        className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-400 rounded-lg text-xs font-bold"
                      >
                        Em Análise
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'approved', 'Proposta APROVADA! Minuta de contrato encaminhada.')}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold"
                      >
                        ✓ Aprovar Show
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'declined', 'Infelizmente data indisponível na agenda.')}
                        className="px-3 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-bold"
                      >
                        ✕ Recusar
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedBookingForAction(booking)}
                      className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold"
                    >
                      Enviar Mensagem Personalizada
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Photos & Videos Management */}
        {activeTab === 'photos_videos' && (
          <div className="mt-8 space-y-8">
            {/* Photos Sub-section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Galeria de Fotos Oficiais</h3>
                  <p className="text-xs text-zinc-400">{photos.length} fotos cadastradas</p>
                </div>
                <button
                  onClick={() => setShowModalAddPhoto(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Foto</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 h-44">
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                      <span className="text-[10px] uppercase font-bold text-rose-300">{photo.category}</span>
                      <p className="text-xs font-bold text-white line-clamp-2">{photo.title}</p>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="self-end p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                        title="Excluir foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Videos Sub-section */}
            <div className="space-y-5 pt-8 border-t border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                      <Youtube className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>Galeria de Vídeos do YouTube</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold">
                          {videos.length} {videos.length === 1 ? 'vídeo' : 'vídeos'}
                        </span>
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Altere a ordem dos clipes, defina o Lançamento em Destaque (reprodutor principal) ou adicione novos vídeos oficiais.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {videos.length > 1 && (
                    <button
                      type="button"
                      onClick={handleOpenReorderVideosModal}
                      className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                      title="Organizar a sequência completa de vídeos na galeria"
                    >
                      <ListOrdered className="w-4 h-4 text-red-400" />
                      <span>Organizar Sequência</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleOpenAddVideo}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-950/40 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Vídeo YouTube</span>
                  </button>
                </div>
              </div>

              {/* Informative Notice about Featured Video */}
              {videos.length > 0 && (
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-zinc-300">
                      <strong className="text-amber-400 font-semibold">Lançamento em Destaque atual:</strong>{' '}
                      <span className="text-white font-bold">
                        {(videos.find(v => v.featured) || videos[0])?.title}
                      </span>
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 hidden md:inline">
                    Exibido no reprodutor de vídeo principal no topo da página
                  </span>
                </div>
              )}

              {/* Video Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((vid, idx) => {
                  const isFeatured = vid.featured || (idx === 0 && !videos.some(v => v.featured));
                  return (
                    <div
                      key={vid.id}
                      className={`rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 ${
                        isFeatured
                          ? 'bg-zinc-900/90 border-2 border-amber-500/60 shadow-xl shadow-amber-950/20'
                          : 'bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Top bar: Position Badge, Order buttons and Destaque Button */}
                        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-zinc-800">
                          {/* Order Badges & Select */}
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-black font-mono flex items-center gap-1 ${
                                isFeatured
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                              }`}
                            >
                              #{idx + 1}
                            </span>

                            {/* Up / Down arrows */}
                            <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800 p-0.5">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveVideoDirect(vid.id, 'up')}
                                className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                                title="Mover vídeo para cima (posição anterior)"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === videos.length - 1}
                                onClick={() => handleMoveVideoDirect(vid.id, 'down')}
                                className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                                title="Mover vídeo para baixo (próxima posição)"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Direct Position Selector */}
                            <select
                              value={idx}
                              onChange={(e) => handleDirectVideoPositionChange(vid.id, Number(e.target.value))}
                              className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-[11px] rounded-lg px-2 py-1 cursor-pointer hover:border-zinc-700 focus:outline-none focus:border-red-500"
                              title="Mudar posição do vídeo diretamente"
                            >
                              {videos.map((_, i) => (
                                <option key={i} value={i}>
                                  {i + 1}º {i === 0 ? '(Destaque)' : ''}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Featured Action / Badge */}
                          {isFeatured ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>Destaque</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetFeaturedVideo(vid.id)}
                              className="px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300 border border-zinc-700/80 hover:border-amber-500/40 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                              title="Colocar como Lançamento em Destaque no topo do site"
                            >
                              <Star className="w-3 h-3 text-amber-400" />
                              <span>Destacar</span>
                            </button>
                          )}
                        </div>

                        {/* Thumbnail Preview */}
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden group shadow-md">
                          <img
                            src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                            alt={vid.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                              <Play className="w-4 h-4 fill-white ml-0.5" />
                            </div>
                          </div>

                          {vid.duration && (
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                              {vid.duration}
                            </div>
                          )}
                        </div>

                        {/* Video Metadata */}
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">
                            <span className="text-red-400">{vid.type}</span>
                            <span>{vid.releaseDate}</span>
                          </div>

                          <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                            {vid.title}
                          </h4>

                          {vid.description && (
                            <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                              {vid.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-500 font-medium">
                            {vid.views && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3 text-zinc-500" />
                                {vid.views}
                              </span>
                            )}
                            <span className="font-mono">ID: {vid.youtubeId}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                        <a
                          href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-zinc-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                        >
                          <span>Assistir</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditVideo(vid)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Editar informações deste vídeo"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteVideo(vid.id)}
                            className="px-2.5 py-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="Excluir vídeo da galeria"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {videos.length === 0 && (
                  <div className="col-span-full p-8 text-center bg-zinc-900/60 border border-dashed border-zinc-800 rounded-2xl">
                    <Youtube className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                    <p className="text-sm text-zinc-400 font-semibold">Nenhum vídeo cadastrado na galeria.</p>
                    <button
                      type="button"
                      onClick={handleOpenAddVideo}
                      className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Cadastrar Primeiro Vídeo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Members & Bio */}
        {activeTab === 'members_bio' && (
          <div className="mt-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-rose-400" />
                    <span>Integrantes Oficiais Cadastrados</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                    {members.length} {members.length === 1 ? 'integrante' : 'integrantes'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Altere a ordem de exibição dos músicos, adicione novos integrantes, edite fotos e biografias ou remova membros da banda.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={handleOpenReorderModal}
                    className="px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/40 hover:border-amber-500/70 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    title="Organizar sequência completa de todos os integrantes da banda"
                  >
                    <ListOrdered className="w-4 h-4 text-amber-400" />
                    <span>Organizar Sequência</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleOpenAddMember}
                  className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-950/50 transition-all cursor-pointer w-fit"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Novo Integrante</span>
                </button>
              </div>
            </div>

            {/* List of Members with Reorder & Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row gap-4 hover:border-zinc-700 transition-all shadow-md group relative"
                >
                  <div className="relative shrink-0 self-center sm:self-start flex flex-col items-center gap-2">
                    <div className="relative">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-24 h-28 object-cover rounded-xl border border-zinc-700 bg-zinc-950 shadow-inner"
                      />
                      <span className="absolute -top-2 -left-2 px-2 py-0.5 bg-amber-500 text-zinc-950 font-black rounded-lg text-xs shadow-md border border-amber-300 flex items-center gap-0.5">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Quick Move Up/Down Buttons below thumbnail */}
                    {members.length > 1 && (
                      <div className="flex items-center gap-1 bg-zinc-950/90 border border-zinc-800 p-1 rounded-lg">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveMemberDirect(member.id, 'up')}
                          className={`p-1 rounded transition-colors ${
                            index === 0
                              ? 'opacity-25 cursor-not-allowed text-zinc-600'
                              : 'hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 cursor-pointer'
                          }`}
                          title={index === 0 ? 'Já é o primeiro da lista' : `Mover ${member.name} para cima (Posição ${index})`}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <span className="text-[10px] font-mono text-zinc-500 px-0.5">{index + 1}/{members.length}</span>
                        <button
                          type="button"
                          disabled={index === members.length - 1}
                          onClick={() => handleMoveMemberDirect(member.id, 'down')}
                          className={`p-1 rounded transition-colors ${
                            index === members.length - 1
                              ? 'opacity-25 cursor-not-allowed text-zinc-600'
                              : 'hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 cursor-pointer'
                          }`}
                          title={index === members.length - 1 ? 'Já é o último da lista' : `Mover ${member.name} para baixo (Posição ${index + 2})`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      {/* Top Bar with Order Selector & Info */}
                      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-zinc-800">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h4 className="text-base font-bold text-white truncate">{member.name}</h4>
                          {member.nickname && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                              "{member.nickname}"
                            </span>
                          )}
                        </div>

                        {/* Direct Position Dropdown */}
                        {members.length > 1 && (
                          <div className="flex items-center gap-1 shrink-0" title="Alterar posição direta deste integrante">
                            <span className="text-[11px] text-zinc-400 hidden xs:inline">Posição:</span>
                            <select
                              value={index}
                              onChange={(e) => handleDirectPositionChange(member.id, Number(e.target.value))}
                              className="bg-zinc-950 border border-zinc-700 hover:border-amber-500 text-amber-300 font-bold text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-rose-500 cursor-pointer"
                            >
                              {members.map((_, i) => (
                                <option key={i} value={i} className="bg-zinc-900 text-white">
                                  {i + 1}º {i === 0 ? '(1º lugar)' : i === members.length - 1 ? '(Último)' : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-rose-400 font-semibold truncate">{member.role}</p>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{member.bio}</p>
                      <p className="text-[11px] text-zinc-500 mt-1 truncate">
                        <strong className="text-zinc-400">Instrumentos:</strong>{' '}
                        {Array.isArray(member.instruments) ? member.instruments.join(', ') : member.instruments}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-zinc-800/80">
                      <button
                        type="button"
                        onClick={() => handleOpenEditMember(member)}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Editar todos os dados deste integrante"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMemberToDeleteConfirm(member)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500/60 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Remover integrante da formação da banda"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remover Integrante</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {members.length === 0 && (
                <div className="col-span-full p-8 text-center bg-zinc-900/60 border border-dashed border-zinc-800 rounded-2xl">
                  <Users className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm text-zinc-400 font-semibold">Nenhum integrante cadastrado no momento.</p>
                  <button
                    type="button"
                    onClick={handleOpenAddMember}
                    className="mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Primeiro Integrante</span>
                  </button>
                </div>
              )}
            </div>

            {/* Band History & Trajectory Section inside Integrantes & História */}
            <div className="mt-10 p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-base font-bold text-white">História & Trajetória Oficial da Banda</h4>
                    <p className="text-xs text-zinc-400">Biografia, origem e marcos históricos exibidos no site público.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    updateBandInfo({
                      bio: infoForm.bio,
                      longBio: infoForm.longBio,
                      yearFormed: infoForm.yearFormed,
                      cityOrigin: infoForm.cityOrigin
                    });
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar História da Banda</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Ano de Formação</label>
                  <input
                    type="text"
                    value={infoForm.yearFormed}
                    onChange={(e) => setInfoForm({ ...infoForm, yearFormed: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Cidade de Origem</label>
                  <input
                    type="text"
                    value={infoForm.cityOrigin}
                    onChange={(e) => setInfoForm({ ...infoForm, cityOrigin: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Resumo da História / Sinopse</label>
                <textarea
                  rows={2}
                  value={infoForm.bio}
                  onChange={(e) => setInfoForm({ ...infoForm, bio: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Biografia Completa & Trajetória</label>
                <textarea
                  rows={4}
                  value={infoForm.longBio}
                  onChange={(e) => setInfoForm({ ...infoForm, longBio: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:border-rose-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Fan Club & Mural */}
        {activeTab === 'fan_club' && (
          <div className="mt-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Postar Conteúdo Exclusivo no Feed VIP</h3>
                <p className="text-xs text-zinc-400">Envie prévias de estúdio, fotos inéditas e responda aos recados dos fãs.</p>
              </div>

              <button
                onClick={() => setShowModalAddFanPost(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Post Exclusivo VIP</span>
              </button>
            </div>

            {/* Fan Messages to Reply */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                Mural de Recados dos Fãs
              </h4>

              <div className="space-y-3">
                {fanMessages.map((msg) => (
                  <div key={msg.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={msg.fanAvatar} alt={msg.fanName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <strong className="text-sm text-white">{msg.fanName}</strong>
                          <span className="ml-2 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                            {msg.fanTier}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-zinc-400">{msg.date}</span>
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                      "{msg.content}"
                    </p>

                    {msg.bandReply ? (
                      <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 text-xs text-rose-200">
                        <strong>Resposta de {msg.bandReply.author}:</strong> "{msg.bandReply.text}"
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setReplyMessageId(msg.id);
                            setReplyText('');
                          }}
                          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Responder como Integrante da Banda</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Settings & Band Info */}
        {activeTab === 'settings' && (
          <div className="mt-8 max-w-3xl">
            <form onSubmit={handleSaveInfo} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
              <h3 className="text-xl font-bold text-white mb-2">Informações Gerais & Biografia da Banda</h3>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">Nome da Banda</label>
                <input
                  type="text"
                  value={infoForm.name}
                  onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">Slogan / Tagline</label>
                <input
                  type="text"
                  value={infoForm.tagline}
                  onChange={(e) => setInfoForm({ ...infoForm, tagline: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">Cidade de Origem</label>
                  <input
                    type="text"
                    value={infoForm.cityOrigin}
                    onChange={(e) => setInfoForm({ ...infoForm, cityOrigin: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">Ano de Formação</label>
                  <input
                    type="text"
                    value={infoForm.yearFormed}
                    onChange={(e) => setInfoForm({ ...infoForm, yearFormed: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">Biografia Resumida</label>
                <textarea
                  rows={3}
                  value={infoForm.bio}
                  onChange={(e) => setInfoForm({ ...infoForm, bio: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">E-mail de Booking</label>
                  <input
                    type="email"
                    value={infoForm.contactInfo.email}
                    onChange={(e) => setInfoForm({
                      ...infoForm,
                      contactInfo: { ...infoForm.contactInfo, email: e.target.value }
                    })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">Telefone da Produção</label>
                  <input
                    type="text"
                    value={infoForm.contactInfo.phone}
                    onChange={(e) => setInfoForm({
                      ...infoForm,
                      contactInfo: { ...infoForm.contactInfo, phone: e.target.value }
                    })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-sm text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold rounded-xl text-sm shadow-lg hover:brightness-110 cursor-pointer"
              >
                Salvar Todas as Alterações
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Modal: Add Show */}
      {showModalAddShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-4">Adicionar Show à Agenda 2026</h4>
            <form onSubmit={handleCreateShow} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300">Título / Nome do Evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Turnê Oficial 2026"
                  value={newShow.title}
                  onChange={(e) => setNewShow({ ...newShow, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300">Data (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    required
                    value={newShow.date}
                    onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300">Horário</label>
                  <input
                    type="text"
                    value={newShow.time}
                    onChange={(e) => setNewShow({ ...newShow, time: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-zinc-300">Cidade</label>
                  <input
                    type="text"
                    required
                    placeholder="São Paulo"
                    value={newShow.city}
                    onChange={(e) => setNewShow({ ...newShow, city: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300">UF</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={newShow.state}
                    onChange={(e) => setNewShow({ ...newShow, state: e.target.value.toUpperCase() })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white text-center font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300">Local / Casa de Show</label>
                <input
                  type="text"
                  placeholder="Ex: Circo Voador"
                  value={newShow.venue}
                  onChange={(e) => setNewShow({ ...newShow, venue: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                />
              </div>

              {/* Tipo de Ingresso / Acesso */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-zinc-200 mb-2">
                  Tipo de Ingresso / Acesso ao Evento
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewShow({ ...newShow, ticketStatus: 'free', ticketPrice: 'Entrada Franca' })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      newShow.ticketStatus === 'free'
                        ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-bold text-emerald-300">Livre</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 leading-tight">
                      Entrada Franca
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewShow({ ...newShow, ticketStatus: 'private', ticketPrice: 'Evento Fechado' })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      newShow.ticketStatus === 'private'
                        ? 'bg-purple-950/70 border-purple-500 text-white shadow-lg shadow-purple-950/40 ring-1 ring-purple-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="text-xs font-bold text-purple-300">Show Privado</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 leading-tight">
                      Evento Fechado
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewShow({ ...newShow, ticketStatus: 'available' })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      newShow.ticketStatus === 'available'
                        ? 'bg-rose-950/70 border-rose-500 text-white shadow-lg shadow-rose-950/40 ring-1 ring-rose-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Ticket className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="text-xs font-bold text-rose-300">À Venda</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 leading-tight">
                      Comprar Ingressos
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewShow({ ...newShow, ticketStatus: 'coming_soon' })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      newShow.ticketStatus === 'coming_soon'
                        ? 'bg-amber-950/70 border-amber-500 text-white ring-1 ring-amber-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-xs font-semibold">Em Breve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewShow({ ...newShow, ticketStatus: 'sold_out' })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 col-span-1 sm:col-span-2 ${
                      newShow.ticketStatus === 'sold_out'
                        ? 'bg-zinc-800 border-zinc-600 text-white ring-1 ring-zinc-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="text-xs font-semibold">Esgotado</span>
                  </button>
                </div>
              </div>

              {/* Informações de Ingressos ou Banners Informativos */}
              {newShow.ticketStatus === 'free' ? (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2.5 text-xs text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Show com Entrada Livre:</strong> Gratuito ao público! Nenhum link é necessário e o botão <em>"Comprar Ingresso"</em> <strong>NÃO</strong> aparecerá na agenda.
                  </span>
                </div>
              ) : newShow.ticketStatus === 'private' ? (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center gap-2.5 text-xs text-purple-300">
                  <Lock className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>
                    <strong>Show Privado / Evento Fechado:</strong> Casamento, evento corporativo ou festa fechada. Nenhum link é necessário e o botão <em>"Comprar Ingresso"</em> <strong>NÃO</strong> aparecerá na agenda.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300">Link de Ingressos</label>
                    <input
                      type="url"
                      placeholder="https://eventim.com.br"
                      value={newShow.ticketUrl}
                      onChange={(e) => setNewShow({ ...newShow, ticketUrl: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300">Faixa de Preço</label>
                    <input
                      type="text"
                      placeholder="Ex: R$ 80 - R$ 160"
                      value={newShow.ticketPrice}
                      onChange={(e) => setNewShow({ ...newShow, ticketPrice: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-300">Descrição / Observações (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Entrada franca mediante ordem de chegada"
                  value={newShow.description}
                  onChange={(e) => setNewShow({ ...newShow, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModalAddShow(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold"
                >
                  Salvar Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Photo */}
      {showModalAddPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-4">Adicionar Foto à Galeria</h4>
            <form onSubmit={handleCreatePhoto} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300">URL da Imagem</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newPhoto.url}
                  onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300">Título / Legenda</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Solo de Guitarra no Festival"
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300">Categoria</label>
                  <select
                    value={newPhoto.category}
                    onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value as PhotoItem['category'] })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="shows">Shows</option>
                    <option value="backstage">Bastidores</option>
                    <option value="studio">Estúdio</option>
                    <option value="promo">Promo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300">Fotógrafo</label>
                  <input
                    type="text"
                    value={newPhoto.photographer}
                    onChange={(e) => setNewPhoto({ ...newPhoto, photographer: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModalAddPhoto(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold"
                >
                  Salvar Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit YouTube Video */}
      {showModalAddVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl my-8 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {editingVideo ? 'Editar Vídeo do YouTube' : 'Adicionar Vídeo do YouTube'}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {editingVideo ? 'Atualize as informações, link ou destaque deste vídeo' : 'Cadastre um novo vídeo ou clipe oficial da banda'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowModalAddVideo(false);
                  setEditingVideo(null);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Link Completo ou ID do YouTube <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ ou youtu.be/..."
                  value={newVideo.youtubeId}
                  onChange={(e) => setNewVideo({ ...newVideo, youtubeId: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-red-500 focus:outline-none rounded-lg p-2.5 text-sm text-white"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Cole o link normal do navegador, link compartilhado (youtu.be) ou o código ID de 11 caracteres.
                </p>
              </div>

              {/* Live Preview if ID is present */}
              {newVideo.youtubeId.trim() && (
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3">
                  <div className="w-24 aspect-video bg-black rounded-lg overflow-hidden shrink-0">
                    <img
                      src={`https://img.youtube.com/vi/${
                        newVideo.youtubeId.includes('v=')
                          ? newVideo.youtubeId.split('v=')[1].split('&')[0]
                          : newVideo.youtubeId.includes('youtu.be/')
                          ? newVideo.youtubeId.split('youtu.be/')[1].split('?')[0]
                          : newVideo.youtubeId.trim()
                      }/hqdefault.jpg`}
                      alt="Preview do vídeo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="text-xs">
                    <span className="text-zinc-400 font-semibold block">Miniatura identificada</span>
                    <span className="text-[11px] text-zinc-500">O reprodutor oficial carregará este vídeo</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Título do Vídeo <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aurora Eclipse - Novo Videoclipe Oficial"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-red-500 focus:outline-none rounded-lg p-2.5 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Tipo de Conteúdo</label>
                  <select
                    value={newVideo.type}
                    onChange={(e) => setNewVideo({ ...newVideo, type: e.target.value as VideoItem['type'] })}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-red-500 focus:outline-none rounded-lg p-2.5 text-sm text-white"
                  >
                    <option value="clip">Videoclipe Oficial</option>
                    <option value="live">Ao Vivo (Live Show)</option>
                    <option value="acoustic">Sessão Acústica</option>
                    <option value="documentary">Bastidores / Doc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Ano / Lançamento</label>
                  <input
                    type="text"
                    placeholder="Ex: 2026"
                    value={newVideo.releaseDate}
                    onChange={(e) => setNewVideo({ ...newVideo, releaseDate: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-red-500 focus:outline-none rounded-lg p-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Duração</label>
                  <input
                    type="text"
                    placeholder="Ex: 4:18"
                    value={newVideo.duration}
                    onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-red-500 focus:outline-none rounded-lg p-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Visualizações / Status</label>
                  <input
                    type="text"
                    placeholder="Ex: 145K visualizações"
                    value={newVideo.views}
                    onChange={(e) => setNewVideo({ ...newVideo, views: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-red-500 focus:outline-none rounded-lg p-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Descrição / Sinopse</label>
                <textarea
                  rows={2}
                  placeholder="Breve descrição ou contexto do clipe/show..."
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-red-500 focus:outline-none rounded-lg p-2.5 text-sm text-white resize-none"
                />
              </div>

              {/* Featured Switch */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Star className={`w-4 h-4 ${newVideo.featured ? 'fill-amber-400 text-amber-400' : 'text-amber-400'}`} />
                  <div>
                    <label htmlFor="video-featured-checkbox" className="text-xs font-bold text-amber-300 cursor-pointer">
                      Definir como Lançamento em Destaque
                    </label>
                    <p className="text-[11px] text-zinc-400">
                      Exibe este vídeo como reprodutor principal no topo da página de vídeos
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  id="video-featured-checkbox"
                  checked={newVideo.featured}
                  onChange={(e) => setNewVideo({ ...newVideo, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-900 border-zinc-700 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowModalAddVideo(false);
                    setEditingVideo(null);
                  }}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  {editingVideo ? 'Salvar Alterações' : 'Salvar Vídeo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Organizar Sequência de Vídeos */}
      {showReorderVideosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-xl w-full p-6 text-zinc-100 shadow-2xl my-8 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Organizar Sequência de Vídeos</h4>
                  <p className="text-xs text-zinc-400">
                    Defina a ordem exata de exibição dos clipes. O vídeo #1 (ou destacado) será o reprodutor principal.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReorderVideosModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
              {tempReorderedVideos.map((vid, idx) => {
                const isFeatured = vid.featured || (idx === 0 && !tempReorderedVideos.some(v => v.featured));
                return (
                  <div
                    key={vid.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      isFeatured
                        ? 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                        : 'bg-zinc-950/70 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Position number */}
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          isFeatured
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {idx + 1}
                      </span>

                      {/* Video Thumbnail */}
                      <div className="w-14 aspect-video bg-black rounded-md overflow-hidden shrink-0">
                        <img
                          src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                          alt={vid.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase text-red-400">{vid.type}</span>
                          {isFeatured && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-amber-400" /> Destaque
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-white truncate">{vid.title}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">ID: {vid.youtubeId}</p>
                      </div>
                    </div>

                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveVideoInModal(idx, 'top')}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Mover para o 1º Lugar (Topo)"
                      >
                        1º Topo
                      </button>

                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveVideoInModal(idx, 'up')}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Subir 1 posição"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === tempReorderedVideos.length - 1}
                        onClick={() => handleMoveVideoInModal(idx, 'down')}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Descer 1 posição"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === tempReorderedVideos.length - 1}
                        onClick={() => handleMoveVideoInModal(idx, 'bottom')}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Mover para a última posição"
                      >
                        Último
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setTempReorderedVideos([...videos])}
                className="px-3.5 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Restaurar Ordem Inicial
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowReorderVideosModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveReorderedVideos}
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  Salvar Nova Sequência
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Member */}
      {showModalAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl my-8 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {editingMember ? `Editar Integrante: ${editingMember.name}` : 'Adicionar Integrante Oficial'}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {editingMember ? 'Altere qualquer campo deste integrante cadastrado' : 'Cadastre um músico ou integrante da equipe da banda'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setEditingMember(null);
                  setShowGalleryPicker(false);
                  setShowModalAddMember(false);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4">
              {/* Foto do Integrante - Câmera, Galeria, Upload e URL */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                <label className="block text-xs font-semibold text-zinc-200">
                  Foto do Integrante
                </label>

                {/* Live Camera View */}
                {isCameraActive ? (
                  <div className="relative rounded-xl overflow-hidden bg-black border border-rose-500/50 aspect-video flex flex-col items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Camera Overlay Guide */}
                    <div className="absolute inset-0 border-2 border-dashed border-rose-500/40 pointer-events-none rounded-xl m-4" />

                    {/* Camera Controls */}
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3 px-4">
                      <button
                        type="button"
                        onClick={toggleCameraFacing}
                        className="p-2 rounded-full bg-zinc-900/90 text-zinc-200 hover:text-white border border-zinc-700 shadow-lg text-xs flex items-center gap-1"
                        title="Alternar Câmera"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-rose-950/50 border border-rose-400 animate-pulse"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Capturar Foto</span>
                      </button>

                      <button
                        type="button"
                        onClick={stopCamera}
                        className="p-2 rounded-full bg-zinc-900/90 text-zinc-400 hover:text-rose-400 border border-zinc-700 shadow-lg text-xs"
                        title="Cancelar Câmera"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Photo Preview & Options */
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={newMember.photo || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'}
                        alt="Preview integrante"
                        className="w-20 h-24 object-cover rounded-xl border-2 border-zinc-700 bg-zinc-900 shadow-md"
                      />
                      <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-rose-600 text-white text-[10px]">
                        <CheckCircle className="w-3 h-3" />
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Botão 1: Câmera */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowGalleryPicker(false);
                            startCamera();
                          }}
                          disabled={cameraLoading}
                          className="p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>{cameraLoading ? 'Iniciando...' : 'Tirar Foto'}</span>
                        </button>

                        {/* Botão 2: Galeria de Fotos Salvas */}
                        <button
                          type="button"
                          onClick={() => {
                            stopCamera();
                            setShowGalleryPicker(!showGalleryPicker);
                          }}
                          className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                            showGalleryPicker
                              ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-amber-300'
                          }`}
                        >
                          <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                          <span>Galeria Salva</span>
                        </button>

                        {/* Botão 3: Upload do Arquivo / Celular */}
                        <button
                          type="button"
                          onClick={() => {
                            stopCamera();
                            setShowGalleryPicker(false);
                            fileInputRef.current?.click();
                          }}
                          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer col-span-2"
                        >
                          <Upload className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>Buscar Foto no Dispositivo (Upload)</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleMemberFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Mensagem de Erro da Câmera se houver */}
                {cameraError && (
                  <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300 flex items-center justify-between">
                    <span>{cameraError}</span>
                    <button
                      type="button"
                      onClick={() => setCameraError(null)}
                      className="text-rose-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Gaveta / Seletor de Fotos da Galeria Salva */}
                {showGalleryPicker && (
                  <div className="p-3 rounded-xl bg-zinc-900 border border-amber-500/40 space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5" /> Fotos da Galeria Oficial da Banda ({photos.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowGalleryPicker(false)}
                        className="text-zinc-400 hover:text-white text-xs"
                      >
                        Fechar
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1 bg-zinc-950 rounded-lg border border-zinc-800">
                      {photos.map((photo) => (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={() => {
                            setNewMember({ ...newMember, photo: photo.url });
                            setShowGalleryPicker(false);
                          }}
                          className={`group relative rounded-lg overflow-hidden border aspect-square cursor-pointer transition-all ${
                            newMember.photo === photo.url
                              ? 'border-amber-400 ring-2 ring-amber-400'
                              : 'border-zinc-800 hover:border-zinc-500'
                          }`}
                        >
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-bold p-1 text-center leading-none">
                            Escolher
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Campo URL Direta da Foto */}
                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Ou cole uma URL da Imagem diretamente:</label>
                  <input
                    type="url"
                    value={newMember.photo}
                    onChange={(e) => setNewMember({ ...newMember, photo: e.target.value })}
                    placeholder="https://exemplo.com/foto.jpg"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200"
                  />
                </div>
              </div>

              {/* Informações Pessoais do Integrante */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Santana"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Apelido / Nickname</label>
                  <input
                    type="text"
                    placeholder="Ex: Carlinhos"
                    value={newMember.nickname}
                    onChange={(e) => setNewMember({ ...newMember, nickname: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Função Principal</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Teclados & Moog Synth"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Instrumentos (separados por vírgula)</label>
                <input
                  type="text"
                  placeholder="Ex: Piano Nord Stage 3, Sintetizador Moog, Backing Vocal"
                  value={newMember.instruments}
                  onChange={(e) => setNewMember({ ...newMember, instruments: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Equipamentos & Setup Técnico (Gear)</label>
                <input
                  type="text"
                  placeholder="Ex: Bateria Pearl Masters, Pratos Zildjian K Custom, Pedais DW 9000"
                  value={newMember.gear || ''}
                  onChange={(e) => setNewMember({ ...newMember, gear: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Instagram (URL)</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={newMember.socials?.instagram || ''}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      socials: { ...newMember.socials, instagram: e.target.value }
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Biografia Resumida</label>
                <textarea
                  rows={2}
                  placeholder="Conte um pouco sobre a trajetória e o estilo do integrante..."
                  value={newMember.bio}
                  onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-rose-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <div>
                  {editingMember && (
                    <button
                      type="button"
                      onClick={() => {
                        setMemberToDeleteConfirm(editingMember);
                      }}
                      className="px-3.5 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover Integrante</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setEditingMember(null);
                      setShowGalleryPicker(false);
                      setShowModalAddMember(false);
                    }}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/50 transition-colors cursor-pointer"
                  >
                    {editingMember ? 'Salvar Alterações' : 'Cadastrar Integrante'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Fan Post */}
      {showModalAddFanPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-4">Postar Conteúdo Exclusivo VIP</h4>
            <form onSubmit={handleCreateFanPost} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300">Título do Post</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Audição da Nova Demo Acústica"
                  value={newFanPost.title}
                  onChange={(e) => setNewFanPost({ ...newFanPost, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300">Descrição / Mensagem aos Fãs</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contem aos fãs os segredos deste momento..."
                  value={newFanPost.description}
                  onChange={(e) => setNewFanPost({ ...newFanPost, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModalAddFanPost(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-zinc-950 font-black rounded-lg text-xs"
                >
                  Publicar & Disparar Notificação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reply to Fan */}
      {replyMessageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-2">Responder Recado do Fã</h4>
            <form onSubmit={handleSendFanReply} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300">Quem está respondendo?</label>
                <select
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                >
                  <option value="Iuri Campos (Bateria)">Iuri Campos (Bateria)</option>
                  <option value="Gabriel Silveira (Voz & Violão)">Gabriel Silveira (Voz & Violão)</option>
                  <option value="Sofia Drummond (Guitarra & Cavaquinho)">Sofia Drummond (Guitarra & Cavaquinho)</option>
                  <option value="Mateus 'Ganso' (Baixo)">Mateus 'Ganso' (Baixo)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300">Sua Resposta</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escreva sua mensagem com carinho..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setReplyMessageId(null)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold"
                >
                  Publicar Resposta & Enviar E-mail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Custom Response to Booking */}
      {selectedBookingForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-2">
              Mensagem para Contratante: {selectedBookingForAction.contractorName}
            </h4>
            <p className="text-xs text-zinc-400 mb-4">
              Protocolo {selectedBookingForAction.protocolNumber} — {selectedBookingForAction.eventCity}/{selectedBookingForAction.eventState}
            </p>

            <div className="space-y-3">
              <textarea
                rows={4}
                placeholder="Digite os detalhes da negociação, valor do cachê, exigências de rider..."
                value={adminResponseText}
                onChange={(e) => setAdminResponseText(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-sm text-white"
              />

              <div className="flex flex-wrap justify-between gap-2 pt-4">
                <button
                  onClick={() => setSelectedBookingForAction(null)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold"
                >
                  Cancelar
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateBookingWithMsg('analyzing')}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold"
                  >
                    Em Análise
                  </button>
                  <button
                    onClick={() => handleUpdateBookingWithMsg('approved')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                  >
                    Aprovar & Notificar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal: Custom Confirmation to Delete Member */}
      {memberToDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 text-zinc-100 shadow-2xl shadow-rose-950/80 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 text-rose-400 mb-4 pb-3 border-b border-zinc-800">
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Remover Integrante</h4>
                <p className="text-xs text-zinc-400">Confirmação de exclusão da formação oficial</p>
              </div>
            </div>

            {/* Member preview */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 mb-4">
              <img
                src={memberToDeleteConfirm.photo}
                alt={memberToDeleteConfirm.name}
                className="w-14 h-16 object-cover rounded-lg border border-zinc-700 bg-zinc-900 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-bold text-white truncate">{memberToDeleteConfirm.name}</h5>
                  {memberToDeleteConfirm.nickname && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                      "{memberToDeleteConfirm.nickname}"
                    </span>
                  )}
                </div>
                <p className="text-xs text-rose-400 font-semibold truncate mt-0.5">{memberToDeleteConfirm.role}</p>
                <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                  {Array.isArray(memberToDeleteConfirm.instruments)
                    ? memberToDeleteConfirm.instruments.join(', ')
                    : memberToDeleteConfirm.instruments}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-6">
              Tem certeza que deseja remover <strong>{memberToDeleteConfirm.name}</strong> da lista de integrantes? Essa alteração será refletida imediatamente na seção pública de integrantes do site.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setMemberToDeleteConfirm(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const idToRemove = memberToDeleteConfirm.id;
                  deleteMember(idToRemove);
                  setMemberToDeleteConfirm(null);
                  if (editingMember?.id === idToRemove) {
                    stopCamera();
                    setEditingMember(null);
                    setShowGalleryPicker(false);
                    setShowModalAddMember(false);
                  }
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/60 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirmar e Remover</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reorder All Members */}
      {showReorderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full p-6 text-zinc-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                  <ListOrdered className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Organizar Ordem dos Integrantes</h4>
                  <p className="text-xs text-zinc-400">
                    Defina a sequência exata de apresentação dos músicos no site oficial.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReorderModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-2.5 pr-1">
              {tempReorderedMembers.map((member, idx) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40 text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-11 h-11 object-cover rounded-lg border border-zinc-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-white truncate">{member.name}</h5>
                        {member.nickname && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                            "{member.nickname}"
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-rose-400 font-semibold truncate">{member.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Top Jump */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveInModal(idx, 'top')}
                      className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                        idx === 0
                          ? 'opacity-20 cursor-not-allowed border-zinc-800 text-zinc-600'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 hover:border-amber-500/50 cursor-pointer'
                      }`}
                      title="Mover direto para a primeira posição (Topo)"
                    >
                      1º Topo
                    </button>

                    {/* Step Up */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveInModal(idx, 'up')}
                      className={`p-1.5 rounded-lg border transition-all ${
                        idx === 0
                          ? 'opacity-20 cursor-not-allowed border-zinc-800 text-zinc-600'
                          : 'bg-zinc-800 hover:bg-rose-600 text-zinc-300 hover:text-white border-zinc-700 cursor-pointer active:scale-95'
                      }`}
                      title="Subir uma posição"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>

                    {/* Step Down */}
                    <button
                      type="button"
                      disabled={idx === tempReorderedMembers.length - 1}
                      onClick={() => handleMoveInModal(idx, 'down')}
                      className={`p-1.5 rounded-lg border transition-all ${
                        idx === tempReorderedMembers.length - 1
                          ? 'opacity-20 cursor-not-allowed border-zinc-800 text-zinc-600'
                          : 'bg-zinc-800 hover:bg-rose-600 text-zinc-300 hover:text-white border-zinc-700 cursor-pointer active:scale-95'
                      }`}
                      title="Descer uma posição"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Bottom Jump */}
                    <button
                      type="button"
                      disabled={idx === tempReorderedMembers.length - 1}
                      onClick={() => handleMoveInModal(idx, 'bottom')}
                      className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition-all ${
                        idx === tempReorderedMembers.length - 1
                          ? 'opacity-20 cursor-not-allowed border-zinc-800 text-zinc-600'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 hover:border-amber-500/50 cursor-pointer'
                      }`}
                      title="Mover direto para a última posição (Final)"
                    >
                      Último
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800 shrink-0">
              <button
                type="button"
                onClick={() => setTempReorderedMembers([...members])}
                className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                title="Desfazer alterações e voltar à ordem original"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar Ordem Atual</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowReorderModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveReorderedList}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/60 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Nova Sequência</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
