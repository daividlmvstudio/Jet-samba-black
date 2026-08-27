import React, { useState, useRef } from 'react';
import {
  Disc3,
  Music,
  Plus,
  Edit3,
  Trash2,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Link2,
  Eye,
  Volume2,
  ListOrdered,
  RefreshCw
} from 'lucide-react';
import { useBand } from '../context/BandContext';
import { AudioTrack } from '../types';
import { JSB_LOGO_BASE64 } from '../assets/logoBase64';

export const AdminMainTracksSection: React.FC = () => {
  const {
    tracks,
    addTrack,
    updateTrack,
    deleteTrack,
    moveTrack,
    restoreDefaultTracks,
    currentTrack,
    isPlaying,
    playTrack,
    pauseTrack
  } = useBand();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Audio tone helper labels
  const toneOptions = [
    { value: 'anthem', label: '⚡ Hino & Suingue (Anthem)', desc: 'Batida marcante, refrão contagiante e presença forte' },
    { value: 'energetic', label: '🔥 Enérgico & Rápido', desc: 'Samba rock acelerado com alta dinâmica' },
    { value: 'ballad', label: '🌙 Balada & Suave', desc: 'Melodia relaxante e harmonias envolventes' },
    { value: 'acoustic', label: '🎸 Acústico & Intimista', desc: 'Arranjos orgânicos voz e violão/cavaquinho' }
  ];

  // New Track Form State
  const [form, setForm] = useState({
    title: '',
    album: 'Single Oficial (2026)',
    duration: '3:38',
    audioTone: 'anthem' as AudioTrack['audioTone'],
    coverType: 'default' as 'default' | 'upload' | 'url',
    customCoverUrl: '',
    uploadedCoverUrl: '',
    audioSourceType: 'tone' as 'tone' | 'url' | 'file',
    audioUrl: '',
    uploadedAudioUrl: '',
    youtubeMusicUrl: '',
    spotifyUrl: '',
    soundCloudUrl: '',
    lyrics: '',
    isExclusive: false,
    plays: 125000
  });

  const [coverFileName, setCoverFileName] = useState<string>('');
  const [audioFileName, setAudioFileName] = useState<string>('');
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  // Edit Modal State
  const [editingTrack, setEditingTrack] = useState<AudioTrack | null>(null);
  const [editCoverType, setEditCoverType] = useState<'current' | 'default' | 'upload' | 'url'>('current');
  const [editCustomCoverUrl, setEditCustomCoverUrl] = useState<string>('');
  const [editUploadedCoverUrl, setEditUploadedCoverUrl] = useState<string>('');
  const editCoverInputRef = useRef<HTMLInputElement | null>(null);

  const [editAudioSourceType, setEditAudioSourceType] = useState<'current' | 'tone' | 'file' | 'url'>('current');
  const [editAudioUrl, setEditAudioUrl] = useState<string>('');
  const [editUploadedAudioUrl, setEditUploadedAudioUrl] = useState<string>('');
  const [editAudioFileName, setEditAudioFileName] = useState<string>('');
  const editAudioInputRef = useRef<HTMLInputElement | null>(null);

  // Delete Modal State
  const [trackToDelete, setTrackToDelete] = useState<AudioTrack | null>(null);

  // Restore Default Modal State
  const [showRestoreModal, setShowRestoreModal] = useState<boolean>(false);

  // Lyrics Preview Modal State
  const [previewLyricsTrack, setPreviewLyricsTrack] = useState<AudioTrack | null>(null);

  // Dedicated Lyrics Edit Modal State
  const [editingLyricsTrack, setEditingLyricsTrack] = useState<AudioTrack | null>(null);
  const [lyricsDraft, setLyricsDraft] = useState<string>('');

  const handleOpenLyricsEdit = (track: AudioTrack) => {
    setEditingLyricsTrack(track);
    setLyricsDraft(track.lyrics || '');
  };

  const handleSaveLyrics = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLyricsTrack) return;
    updateTrack(editingLyricsTrack.id, {
      lyrics: lyricsDraft.trim()
    });
    setEditingLyricsTrack(null);
    setLyricsDraft('');
  };

  // Helper: parse duration mm:ss to seconds
  const parseDurationToSeconds = (durationStr: string): number => {
    const parts = durationStr.split(':');
    if (parts.length === 2) {
      const mins = parseInt(parts[0], 10) || 0;
      const secs = parseInt(parts[1], 10) || 0;
      return mins * 60 + secs;
    }
    return 218;
  };

  // Handle Cover Upload
  const handleCoverUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione uma imagem válida (JPG, PNG, WEBP).');
      return;
    }
    setCoverFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm(prev => ({
        ...prev,
        uploadedCoverUrl: e.target?.result as string,
        coverType: 'upload'
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Edit Cover Upload
  const handleEditCoverUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione uma imagem válida.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditUploadedCoverUrl(e.target?.result as string);
      setEditCoverType('upload');
    };
    reader.readAsDataURL(file);
  };

  // Handle Edit Audio File Upload
  const handleEditAudioUpload = (file: File) => {
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
      alert('Por favor selecione um arquivo de áudio válido.');
      return;
    }
    setEditAudioFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const tempAudio = new Audio();
      tempAudio.src = dataUrl;
      tempAudio.onloadedmetadata = () => {
        const totalSecs = Math.floor(tempAudio.duration);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        const durStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        setEditUploadedAudioUrl(dataUrl);
        setEditAudioSourceType('file');
        if (editingTrack) {
          setEditingTrack({
            ...editingTrack,
            duration: durStr,
            durationSeconds: totalSecs
          });
        }
      };
      tempAudio.onerror = () => {
        setEditUploadedAudioUrl(dataUrl);
        setEditAudioSourceType('file');
      };
    };
    reader.readAsDataURL(file);
  };

  // Handle Audio File Upload
  const handleAudioUpload = (file: File) => {
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
      alert('Por favor selecione um arquivo de áudio válido.');
      return;
    }
    setAudioFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const tempAudio = new Audio();
      tempAudio.src = dataUrl;
      tempAudio.onloadedmetadata = () => {
        const totalSecs = Math.floor(tempAudio.duration);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        const durStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        setForm(prev => ({
          ...prev,
          uploadedAudioUrl: dataUrl,
          duration: durStr,
          audioSourceType: 'file'
        }));
      };
      tempAudio.onerror = () => {
        setForm(prev => ({
          ...prev,
          uploadedAudioUrl: dataUrl,
          audioSourceType: 'file'
        }));
      };
    };
    reader.readAsDataURL(file);
  };

  // Handle Submit New Track
  const handleSubmitNewTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('Por favor informe o título da música.');
      return;
    }

    let finalCoverUrl = JSB_LOGO_BASE64;
    if (form.coverType === 'upload' && form.uploadedCoverUrl) {
      finalCoverUrl = form.uploadedCoverUrl;
    } else if (form.coverType === 'url' && form.customCoverUrl.trim()) {
      finalCoverUrl = form.customCoverUrl.trim();
    }

    let finalAudioUrl = form.soundCloudUrl.trim() || form.youtubeMusicUrl.trim() || undefined;
    if (form.audioSourceType === 'file' && form.uploadedAudioUrl) {
      finalAudioUrl = form.uploadedAudioUrl;
    } else if (form.audioSourceType === 'url' && form.audioUrl.trim()) {
      finalAudioUrl = form.audioUrl.trim();
    }

    const durationSeconds = parseDurationToSeconds(form.duration.trim() || '3:30');

    addTrack({
      title: form.title.trim(),
      album: form.album.trim() || 'Single JET SAMBA BLACK',
      duration: form.duration.trim() || '3:30',
      durationSeconds: durationSeconds,
      coverUrl: finalCoverUrl,
      audioTone: form.audioTone,
      audioUrl: finalAudioUrl,
      youtubeMusicUrl: form.youtubeMusicUrl.trim() || undefined,
      spotifyUrl: form.spotifyUrl.trim() || undefined,
      soundCloudUrl: form.soundCloudUrl.trim() || undefined,
      lyrics: form.lyrics.trim() || undefined,
      isExclusive: form.isExclusive,
      plays: form.plays || Math.floor(Math.random() * 50000) + 12000
    });

    // Reset Form
    setForm({
      title: '',
      album: 'Single Oficial (2026)',
      duration: '3:38',
      audioTone: 'anthem',
      coverType: 'default',
      customCoverUrl: '',
      uploadedCoverUrl: '',
      audioSourceType: 'tone',
      audioUrl: '',
      uploadedAudioUrl: '',
      youtubeMusicUrl: '',
      spotifyUrl: '',
      soundCloudUrl: '',
      lyrics: '',
      isExclusive: false,
      plays: 125000
    });
    setCoverFileName('');
    setAudioFileName('');
    setIsFormOpen(false);
  };

  // Handle Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack) return;

    let finalCoverUrl = editingTrack.coverUrl;
    if (editCoverType === 'default') {
      finalCoverUrl = JSB_LOGO_BASE64;
    } else if (editCoverType === 'upload' && editUploadedCoverUrl) {
      finalCoverUrl = editUploadedCoverUrl;
    } else if (editCoverType === 'url' && editCustomCoverUrl.trim()) {
      finalCoverUrl = editCustomCoverUrl.trim();
    }

    let finalAudioUrl = editingTrack.audioUrl?.trim() || undefined;
    if (editAudioSourceType === 'file' && editUploadedAudioUrl) {
      finalAudioUrl = editUploadedAudioUrl;
    } else if (editAudioSourceType === 'url' && editAudioUrl.trim()) {
      finalAudioUrl = editAudioUrl.trim();
    } else if (editAudioSourceType === 'tone') {
      finalAudioUrl = undefined;
    }

    const durationSeconds = parseDurationToSeconds(editingTrack.duration || '3:30');

    updateTrack(editingTrack.id, {
      title: editingTrack.title.trim(),
      album: editingTrack.album.trim(),
      duration: editingTrack.duration.trim(),
      durationSeconds: durationSeconds,
      coverUrl: finalCoverUrl,
      audioTone: editingTrack.audioTone,
      audioUrl: finalAudioUrl,
      youtubeMusicUrl: editingTrack.youtubeMusicUrl?.trim() || undefined,
      spotifyUrl: editingTrack.spotifyUrl?.trim() || undefined,
      soundCloudUrl: editingTrack.soundCloudUrl?.trim() || undefined,
      lyrics: editingTrack.lyrics?.trim() || undefined,
      isExclusive: editingTrack.isExclusive,
      plays: editingTrack.plays
    });

    setEditingTrack(null);
    setEditUploadedCoverUrl('');
    setEditCustomCoverUrl('');
    setEditCoverType('current');
    setEditUploadedAudioUrl('');
    setEditAudioUrl('');
    setEditAudioFileName('');
    setEditAudioSourceType('current');
  };

  const filteredTracks = tracks.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.album.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.lyrics && t.lyrics.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div id="main-screen-tracks-manager" className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6 mt-8">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Disc3 className="w-3.5 h-3.5" />
            <span>Player da Tela Principal</span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Faixas Principais & Demos</span>
          </h3>
          <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
            Cadastre e organize as músicas exibidas publicamente na seção <strong>"Faixas Principais & Demos"</strong> da tela inicial. Inclua singles oficiais, demos de estúdio, capas personalizadas, letras completas e links diretos do YouTube Music e Spotify.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowRestoreModal(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-700/60"
            title="Restaurar faixas originais padrão"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isFormOpen
                ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                : 'bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-rose-950/50'
            }`}
          >
            <Plus className={`w-4 h-4 transition-transform ${isFormOpen ? 'rotate-45' : ''}`} />
            <span>{isFormOpen ? 'Fechar Formulário' : '+ Adicionar Nova Faixa Principal'}</span>
          </button>
        </div>
      </div>

      {/* Inclusion Form */}
      {isFormOpen && (
        <div className="bg-zinc-950/80 border border-rose-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Cadastrar Nova Faixa no Player Público</span>
            </h4>
            <span className="text-[11px] text-rose-400 font-semibold">Exibição imediata na Home</span>
          </div>

          <form onSubmit={handleSubmitNewTrack} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Título */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Título da Música <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Swing no Asfalto (Ao Vivo)"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Álbum / Projeto */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Álbum / Projeto / Single
                </label>
                <input
                  type="text"
                  placeholder="Ex: Lady - Ao Vivo (Single Oficial)"
                  value={form.album}
                  onChange={(e) => setForm({ ...form, album: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Duração */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Duração (mm:ss)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 3:38"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              {/* Estilo Sonoro */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Clima / Estilo Musical
                </label>
                <select
                  value={form.audioTone}
                  onChange={(e) => setForm({ ...form, audioTone: e.target.value as AudioTrack['audioTone'] })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  {toneOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* YouTube Music Link */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Link YouTube Music (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://music.youtube.com/watch?v=..."
                  value={form.youtubeMusicUrl}
                  onChange={(e) => setForm({ ...form, youtubeMusicUrl: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Spotify Link */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Link Spotify (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://open.spotify.com/track/..."
                  value={form.spotifyUrl}
                  onChange={(e) => setForm({ ...form, spotifyUrl: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Capa do Álbum Selection */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <label className="block text-xs font-bold text-zinc-200 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Capa da Música / Álbum</span>
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, coverType: 'default' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                    form.coverType === 'default'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  Logo Oficial JSB (Padrão)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, coverType: 'upload' });
                    coverInputRef.current?.click();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors flex items-center gap-1.5 ${
                    form.coverType === 'upload'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload de Foto do Aparelho</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, coverType: 'url' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors flex items-center gap-1.5 ${
                    form.coverType === 'url'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>URL Externa</span>
                </button>

                <input
                  type="file"
                  ref={coverInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleCoverUpload(f);
                  }}
                  className="hidden"
                />
              </div>

              {/* Cover URL Input */}
              {form.coverType === 'url' && (
                <input
                  type="url"
                  placeholder="Cole o link da imagem (https://...)"
                  value={form.customCoverUrl}
                  onChange={(e) => setForm({ ...form, customCoverUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              )}

              {/* Preview Cover Thumbnail */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-700 shrink-0">
                  <img
                    src={
                      form.coverType === 'upload' && form.uploadedCoverUrl
                        ? form.uploadedCoverUrl
                        : form.coverType === 'url' && form.customCoverUrl
                        ? form.customCoverUrl
                        : JSB_LOGO_BASE64
                    }
                    alt="Prévia da Capa"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[11px] text-zinc-400">
                  {form.coverType === 'upload' && coverFileName && (
                    <p className="text-amber-400 font-semibold">Arquivo: {coverFileName}</p>
                  )}
                  <p>Esta imagem será exibida na listagem e no player da página inicial.</p>
                </div>
              </div>
            </div>

            {/* Áudio / Fonte Sonora (Upload ou URL) */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <label className="block text-xs font-bold text-zinc-200 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-rose-400" />
                <span>Arquivo de Áudio / Link da Música</span>
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, audioSourceType: 'tone' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                    form.audioSourceType === 'tone'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  Sintetizador Web Audio (Padrão)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, audioSourceType: 'file' });
                    audioInputRef.current?.click();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors flex items-center gap-1.5 ${
                    form.audioSourceType === 'file'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload de Arquivo de Áudio (MP3 / WAV)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, audioSourceType: 'url' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors flex items-center gap-1.5 ${
                    form.audioSourceType === 'url'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>URL Direta de Áudio</span>
                </button>

                <input
                  type="file"
                  ref={audioInputRef}
                  accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleAudioUpload(f);
                  }}
                  className="hidden"
                />
              </div>

              {form.audioSourceType === 'url' && (
                <input
                  type="url"
                  placeholder="https://exemplo.com/musica.mp3"
                  value={form.audioUrl}
                  onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              )}

              {form.audioSourceType === 'file' && audioFileName && (
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Arquivo carregado: <strong>{audioFileName}</strong> (Duração detectada: {form.duration})</span>
                </div>
              )}
            </div>

            {/* Letra da Música */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-rose-400" />
                  <span>Letra Completa da Música (Lyrics)</span>
                </span>
                <span className="text-[11px] text-zinc-500 font-normal">Exibida no modal "Ver Letra" da Home</span>
              </label>
              <textarea
                rows={4}
                placeholder="[Verso 1]&#10;Na ginga do samba rock...&#10;&#10;[Refrão]&#10;Ô Lady vem cá dançar..."
                value={form.lyrics}
                onChange={(e) => setForm({ ...form, lyrics: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 leading-relaxed font-sans"
              />
            </div>

            {/* VIP Checkbox & Submit */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-zinc-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.isExclusive}
                  onChange={(e) => setForm({ ...form, isExclusive: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-900 accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-300">
                  Marcar como "Exclusivo VIP / Demo Inédita" (adiciona badge dourada na home)
                </span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-rose-950/60 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar no Player da Tela Principal</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tracks List Search and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-zinc-800/80 pt-5">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-amber-400" />
              <span>Sequência das Faixas no Player da Home</span>
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
              {tracks.length} {tracks.length === 1 ? 'faixa' : 'faixas'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            A ordem definida abaixo é exatamente a mesma em que as músicas aparecem na tela principal.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar por título ou álbum..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Tracks List */}
      <div className="space-y-3">
        {filteredTracks.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40">
            <Music className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">Nenhuma faixa encontrada na lista principal.</p>
          </div>
        ) : (
          filteredTracks.map((track, idx) => {
            const isPlayingThis = currentTrack?.id === track.id && isPlaying;
            const isFirst = idx === 0;
            const isLast = idx === tracks.length - 1;

            return (
              <div
                key={track.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isPlayingThis
                    ? 'bg-zinc-950/90 border-rose-500/60 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/30'
                    : 'bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Reorder Buttons (Up / Down) */}
                  <div className="flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 shrink-0 gap-0.5">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => moveTrack(track.id, 'up')}
                      className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 disabled:opacity-20 disabled:hover:text-zinc-400 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                      title="Subir posição na lista da Home"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-black text-rose-400 px-1">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => moveTrack(track.id, 'down')}
                      className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 disabled:opacity-20 disabled:hover:text-zinc-400 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                      title="Descer posição na lista da Home"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Cover Thumbnail */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 relative group">
                    <img
                      src={track.coverUrl || JSB_LOGO_BASE64}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Play Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isPlayingThis) pauseTrack();
                      else playTrack(track);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-md ${
                      isPlayingThis
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                    }`}
                    title={isPlayingThis ? 'Pausar áudio' : 'Ouvir faixa'}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  {/* Track Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-sm">
                        {track.title}
                      </span>
                      {track.isExclusive && (
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Exclusivo VIP
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                        {track.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1 flex-wrap">
                      <span className="truncate">{track.album}</span>
                      {track.youtubeMusicUrl && (
                        <span className="text-red-400 flex items-center gap-1 font-semibold">
                          • YouTube Music
                        </span>
                      )}
                      {track.spotifyUrl && (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          • Spotify
                        </span>
                      )}
                      {track.lyrics ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewLyricsTrack(track)}
                            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium hover:underline text-[11px]"
                            title="Visualizar letra completa"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Ver Letra</span>
                          </button>
                          <span className="text-zinc-600">•</span>
                          <button
                            type="button"
                            onClick={() => handleOpenLyricsEdit(track)}
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-medium hover:underline text-[11px]"
                            title="Editar letra desta música"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Editar Letra</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenLyricsEdit(track)}
                          className="text-zinc-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer font-medium hover:underline text-[11px]"
                          title="Cadastrar letra para esta música"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Adicionar Letra</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
                  {track.youtubeMusicUrl && (
                    <a
                      href={track.youtubeMusicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-white border border-red-500/30 transition-colors"
                      title="Abrir no YouTube Music"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenLyricsEdit(track)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      track.lyrics
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border-amber-500/30'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-amber-400 border-zinc-700/50'
                    }`}
                    title={track.lyrics ? 'Editar Letra da Música' : 'Cadastrar Letra da Música'}
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingTrack({ ...track });
                      setEditCoverType('current');
                      setEditCustomCoverUrl('');
                      setEditUploadedCoverUrl('');
                      setEditAudioSourceType(track.audioUrl ? (track.audioUrl.startsWith('data:') ? 'file' : 'url') : 'tone');
                      setEditAudioUrl(track.audioUrl && !track.audioUrl.startsWith('data:') ? track.audioUrl : '');
                      setEditUploadedAudioUrl(track.audioUrl && track.audioUrl.startsWith('data:') ? track.audioUrl : '');
                      setEditAudioFileName('');
                    }}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 transition-colors cursor-pointer"
                    title="Editar dados da faixa"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setTrackToDelete(track)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-950/80 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Excluir faixa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Track Modal */}
      {editingTrack && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <span>Editar Faixa da Tela Principal</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingTrack(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Título da Música</label>
                <input
                  type="text"
                  required
                  value={editingTrack.title}
                  onChange={(e) => setEditingTrack({ ...editingTrack, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Álbum / Single</label>
                <input
                  type="text"
                  value={editingTrack.album}
                  onChange={(e) => setEditingTrack({ ...editingTrack, album: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Duração (mm:ss)</label>
                  <input
                    type="text"
                    value={editingTrack.duration}
                    onChange={(e) => setEditingTrack({ ...editingTrack, duration: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">Clima Sonoro</label>
                  <select
                    value={editingTrack.audioTone}
                    onChange={(e) => setEditingTrack({ ...editingTrack, audioTone: e.target.value as AudioTrack['audioTone'] })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    {toneOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Link YouTube Music</label>
                <input
                  type="url"
                  placeholder="https://music.youtube.com/..."
                  value={editingTrack.youtubeMusicUrl || ''}
                  onChange={(e) => setEditingTrack({ ...editingTrack, youtubeMusicUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Link Spotify</label>
                <input
                  type="url"
                  placeholder="https://open.spotify.com/..."
                  value={editingTrack.spotifyUrl || ''}
                  onChange={(e) => setEditingTrack({ ...editingTrack, spotifyUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Capa da Faixa */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Capa da Faixa</label>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setEditCoverType('default')}
                    className={`px-2.5 py-1 rounded-lg text-xs ${editCoverType === 'default' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    Logo Oficial JSB
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditCoverType('upload');
                      editCoverInputRef.current?.click();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs ${editCoverType === 'upload' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    Upload Nova Imagem
                  </button>
                  <input
                    type="file"
                    ref={editCoverInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleEditCoverUpload(f);
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Fonte de Áudio */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Fonte de Áudio da Música</label>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setEditAudioSourceType('tone')}
                    className={`px-2.5 py-1 rounded-lg text-xs ${editAudioSourceType === 'tone' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    Sintetizador Web Audio
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditAudioSourceType('file');
                      editAudioInputRef.current?.click();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs ${editAudioSourceType === 'file' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    Upload Arquivo (MP3/WAV)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditAudioSourceType('url')}
                    className={`px-2.5 py-1 rounded-lg text-xs ${editAudioSourceType === 'url' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    Link / URL Direta
                  </button>
                  <input
                    type="file"
                    ref={editAudioInputRef}
                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleEditAudioUpload(f);
                    }}
                    className="hidden"
                  />
                </div>

                {editAudioSourceType === 'url' && (
                  <input
                    type="url"
                    placeholder="https://exemplo.com/audio.mp3"
                    value={editAudioUrl}
                    onChange={(e) => setEditAudioUrl(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                )}

                {editAudioSourceType === 'file' && (
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {editAudioFileName ? (
                      <span>Novo áudio selecionado: <strong className="text-white">{editAudioFileName}</strong></span>
                    ) : editUploadedAudioUrl ? (
                      <span className="text-emerald-400">Arquivo de áudio já configurado.</span>
                    ) : (
                      <span>Clique em "Upload Arquivo" para selecionar um novo MP3/WAV.</span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Letra da Música (Lyrics)</label>
                <textarea
                  rows={4}
                  value={editingTrack.lyrics || ''}
                  onChange={(e) => setEditingTrack({ ...editingTrack, lyrics: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-rose-500 font-sans"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingTrack.isExclusive || false}
                    onChange={(e) => setEditingTrack({ ...editingTrack, isExclusive: e.target.checked })}
                    className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-950 accent-amber-500"
                  />
                  <span className="text-xs font-bold text-amber-300">
                    Selo Exclusivo VIP / Demo
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingTrack(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {trackToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Excluir Faixa Principal</h3>
                <p className="text-xs text-zinc-400">Esta ação removerá a faixa da tela pública.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <p className="text-xs font-bold text-white">{trackToDelete.title}</p>
              <p className="text-[11px] text-zinc-400">{trackToDelete.album} • {trackToDelete.duration}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTrackToDelete(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteTrack(trackToDelete.id);
                  setTrackToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/60 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmar Exclusão</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Default Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Restaurar Faixas Originais</h3>
                <p className="text-xs text-zinc-400">Deseja restaurar as faixas padrão da banda?</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              A lista de faixas principais da tela inicial será restaurada para a seleção original de lançamentos e demos da banda JET SAMBA BLACK.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  restoreDefaultTracks();
                  setShowRestoreModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md cursor-pointer"
              >
                Restaurar Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lyrics Preview Modal */}
      {previewLyricsTrack && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white">{previewLyricsTrack.title}</h4>
                <p className="text-xs text-rose-400">{previewLyricsTrack.album}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewLyricsTrack(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 text-xs text-zinc-300 whitespace-pre-line leading-relaxed font-sans bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              {previewLyricsTrack.lyrics || 'Nenhuma letra cadastrada para esta faixa.'}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => {
                  const trackToEdit = previewLyricsTrack;
                  setPreviewLyricsTrack(null);
                  handleOpenLyricsEdit(trackToEdit);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Esta Letra</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewLyricsTrack(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Lyrics Edit Modal */}
      {editingLyricsTrack && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Editar Letra da Música</span>
                  </h3>
                  <p className="text-xs text-rose-400 font-semibold">
                    {editingLyricsTrack.title} {editingLyricsTrack.album ? `• ${editingLyricsTrack.album}` : ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingLyricsTrack(null);
                  setLyricsDraft('');
                }}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLyrics} className="space-y-4 overflow-y-auto pr-1 flex-1 flex flex-col">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Digite ou cole a letra completa da faixa:</span>
                <span className="font-mono text-[11px] text-zinc-500">
                  {lyricsDraft.length} caracteres • {lyricsDraft ? lyricsDraft.split('\n').length : 0} linhas
                </span>
              </div>

              <div className="flex-1 flex flex-col min-h-[220px]">
                <textarea
                  rows={10}
                  autoFocus
                  value={lyricsDraft}
                  onChange={(e) => setLyricsDraft(e.target.value)}
                  placeholder="Cole ou digite a letra da música aqui...&#10;&#10;Exemplo:&#10;No balanço do samba ela vem&#10;Na batida que faz o coração bater..."
                  className="w-full flex-1 bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-500 font-sans resize-y placeholder-zinc-600"
                />
              </div>

              <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between gap-3">
                <span>Esta letra será exibida no botão <strong>"Ver Letra"</strong> do player principal na Home.</span>
                {lyricsDraft.trim() && (
                  <button
                    type="button"
                    onClick={() => setLyricsDraft('')}
                    className="text-rose-400 hover:underline cursor-pointer shrink-0 font-medium"
                  >
                    Limpar Texto
                  </button>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingLyricsTrack(null);
                    setLyricsDraft('');
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-black font-extrabold text-xs shadow-lg shadow-amber-950/50 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Salvar Letra</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
