import React, { useState, useRef } from 'react';
import {
  Radio,
  Globe,
  UploadCloud,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Trash2,
  Edit3,
  RotateCcw,
  Music,
  Disc3,
  FileAudio,
  Plus,
  ExternalLink,
  Info,
  Layers,
  ArrowUpRight,
  Headphones,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  ListOrdered
} from 'lucide-react';
import { useBand } from '../context/BandContext';
import { RadioTrackItem } from '../types';
import { MarqueeText } from './MarqueeText';
import { AdminMainTracksSection } from './AdminMainTracksSection';

interface UploadedAudioItem {
  id: string;
  title: string;
  artist: string;
  badgeLabel: string;
  fileName: string;
  fileSize: string;
  duration: string;
  description: string;
  audioDataUrl: string;
}

export const AdminRadioJetTab: React.FC = () => {
  const {
    radioSettings,
    radioTracks,
    updateRadioSettings,
    addRadioTrack,
    addMultipleRadioTracks,
    updateRadioTrack,
    deleteRadioTrack,
    setActiveRadioTrack,
    moveRadioTrack,
    restoreDefaultRadioSingle
  } = useBand();

  // Mode: 'url' or 'file' for inclusion
  const [inclusionMode, setInclusionMode] = useState<'url' | 'file'>('file');

  // Preview player in admin tab
  const [adminPlayingTrackId, setAdminPlayingTrackId] = useState<string | null>(null);
  const [adminIsPlaying, setAdminIsPlaying] = useState<boolean>(false);
  const adminAudioRef = useRef<HTMLAudioElement | null>(null);

  // Form State: Internet URL
  const [urlForm, setUrlForm] = useState({
    title: '',
    artist: 'JET SAMBA BLACK',
    badgeLabel: 'Radio JET',
    audioUrl: '',
    soundCloudTrackUrl: '',
    soundCloudEmbedUrl: '',
    duration: '4:00',
    description: '',
    setAsActiveImmediately: true
  });

  // Form State: Device File Upload
  const [pendingAudioFiles, setPendingAudioFiles] = useState<UploadedAudioItem[]>([]);
  const [fileForm, setFileForm] = useState({
    title: '',
    artist: 'JET SAMBA BLACK',
    badgeLabel: 'Radio JET',
    audioDataUrl: '',
    fileName: '',
    fileSize: '',
    duration: '3:45',
    description: '',
    setAsActiveImmediately: true
  });
  const [uploadError, setUploadError] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Editing existing track modal
  const [editingTrack, setEditingTrack] = useState<RadioTrackItem | null>(null);

  // Deleting track confirmation modal
  const [trackToDelete, setTrackToDelete] = useState<RadioTrackItem | null>(null);

  // Filter search
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Handle URL Form Submit
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlForm.title.trim()) {
      alert('Por favor, informe o título da música.');
      return;
    }
    if (!urlForm.audioUrl.trim() && !urlForm.soundCloudTrackUrl.trim()) {
      alert('Por favor, insira o endereço de internet (URL do áudio/stream ou link do SoundCloud).');
      return;
    }

    const audioTarget = urlForm.audioUrl.trim() || urlForm.soundCloudTrackUrl.trim();
    const isSoundCloud = audioTarget.includes('soundcloud.com');

    addRadioTrack({
      title: urlForm.title.trim(),
      artist: urlForm.artist.trim() || 'JET SAMBA BLACK',
      badgeLabel: urlForm.badgeLabel.trim() || 'Radio JET',
      sourceType: isSoundCloud ? 'soundcloud' : 'url',
      audioUrl: audioTarget,
      soundCloudTrackUrl: urlForm.soundCloudTrackUrl.trim() || (isSoundCloud ? audioTarget : undefined),
      soundCloudEmbedUrl: urlForm.soundCloudEmbedUrl.trim() || undefined,
      duration: urlForm.duration.trim() || '4:00',
      description: urlForm.description.trim() || 'Faixa adicionada via link da Web na Rádio JET.',
      isActive: urlForm.setAsActiveImmediately
    });

    // Reset Form
    setUrlForm({
      title: '',
      artist: 'JET SAMBA BLACK',
      badgeLabel: 'Radio JET',
      audioUrl: '',
      soundCloudTrackUrl: '',
      soundCloudEmbedUrl: '',
      duration: '4:00',
      description: '',
      setAsActiveImmediately: true
    });

    // Scroll to Library
    setTimeout(() => {
      document.getElementById('radio-jet-library')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Helper to format clean song title from filename
  const formatSongTitle = (filename: string) => {
    return filename
      .replace(/\.[^/.]+$/, '')
      .replace(/^\d+[\s\-_.]*/, '')
      .replace(/[-_]/g, ' ')
      .trim();
  };

  // Process a list of audio files (single or multiple)
  const processAudioFileList = async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList).filter(f =>
      f.type.startsWith('audio/') || f.name.match(/\.(mp3|wav|ogg|m4a|aac|flac|wma)$/i)
    );

    if (filesArray.length === 0) {
      setUploadError('Por favor selecione arquivos de áudio válidos (MP3, WAV, OGG, M4A, AAC, FLAC).');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const readAudioPromises = filesArray.map((file, idx) => {
        return new Promise<UploadedAudioItem>((resolve) => {
          const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
          const cleanTitle = formatSongTitle(file.name) || `Música ${idx + 1}`;

          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            const tempAudio = new Audio();
            tempAudio.src = dataUrl;

            tempAudio.onloadedmetadata = () => {
              const totalSeconds = Math.floor(tempAudio.duration);
              const mins = Math.floor(totalSeconds / 60);
              const secs = totalSeconds % 60;
              const formattedDuration = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

              resolve({
                id: 'upload-' + Date.now() + '-' + idx,
                title: cleanTitle,
                artist: fileForm.artist || 'JET SAMBA BLACK',
                badgeLabel: fileForm.badgeLabel || 'Radio JET',
                fileName: file.name,
                fileSize: sizeInMB,
                duration: formattedDuration,
                description: `Faixa "${file.name}" carregada do aparelho.`,
                audioDataUrl: dataUrl
              });
            };

            tempAudio.onerror = () => {
              resolve({
                id: 'upload-' + Date.now() + '-' + idx,
                title: cleanTitle,
                artist: fileForm.artist || 'JET SAMBA BLACK',
                badgeLabel: fileForm.badgeLabel || 'Radio JET',
                fileName: file.name,
                fileSize: sizeInMB,
                duration: '3:30',
                description: `Faixa "${file.name}" carregada do aparelho.`,
                audioDataUrl: dataUrl
              });
            };
          };

          reader.onerror = () => {
            resolve({
              id: 'upload-' + Date.now() + '-' + idx,
              title: cleanTitle,
              artist: fileForm.artist || 'JET SAMBA BLACK',
              badgeLabel: fileForm.badgeLabel || 'Radio JET',
              fileName: file.name,
              fileSize: sizeInMB,
              duration: '3:30',
              description: `Faixa "${file.name}" carregada do aparelho.`,
              audioDataUrl: ''
            });
          };

          reader.readAsDataURL(file);
        });
      });

      const results = await Promise.all(readAudioPromises);
      const validResults = results.filter(r => r.audioDataUrl);

      if (validResults.length > 0) {
        setPendingAudioFiles(validResults);
        // If single file, also update single file form
        if (validResults.length === 1) {
          const first = validResults[0];
          setFileForm(prev => ({
            ...prev,
            title: first.title,
            fileName: first.fileName,
            fileSize: first.fileSize,
            audioDataUrl: first.audioDataUrl,
            duration: first.duration
          }));
        }
      }
    } catch {
      setUploadError('Ocorreu um erro ao processar os arquivos de áudio.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle File Input Change
  const handleDeviceAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    processAudioFileList(e.target.files);
  };

  // Remove single pending file from multi-upload list
  const removePendingFile = (id: string) => {
    setPendingAudioFiles(prev => {
      const remaining = prev.filter(f => f.id !== id);
      if (remaining.length === 1) {
        const first = remaining[0];
        setFileForm(curr => ({
          ...curr,
          title: first.title,
          fileName: first.fileName,
          fileSize: first.fileSize,
          audioDataUrl: first.audioDataUrl,
          duration: first.duration
        }));
      } else if (remaining.length === 0) {
        setFileForm(curr => ({
          ...curr,
          title: '',
          fileName: '',
          fileSize: '',
          audioDataUrl: '',
          duration: '3:45'
        }));
      }
      return remaining;
    });
  };

  // Update title of pending file in multi-upload list
  const updatePendingFileTitle = (id: string, newTitle: string) => {
    setPendingAudioFiles(prev =>
      prev.map(f => (f.id === id ? { ...f, title: newTitle } : f))
    );
  };

  // Handle File Form Submit (Saves 1 or multiple songs to Rádio JET library)
  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (pendingAudioFiles.length === 0 && !fileForm.audioDataUrl) {
      alert('Selecione primeiro um arquivo de áudio do seu aparelho.');
      return;
    }

    if (pendingAudioFiles.length > 1) {
      // Multiple tracks batch save
      const tracksToSave = pendingAudioFiles.map((item, index) => ({
        title: item.title.trim() || `Música ${index + 1}`,
        artist: fileForm.artist.trim() || item.artist || 'JET SAMBA BLACK',
        badgeLabel: fileForm.badgeLabel.trim() || item.badgeLabel || 'Radio JET',
        sourceType: 'file' as const,
        audioUrl: item.audioDataUrl,
        duration: item.duration || '3:30',
        description: item.description || `Música "${item.fileName}" enviada direto do aparelho.`,
        fileName: item.fileName,
        fileSize: item.fileSize,
        isActive: index === 0 ? fileForm.setAsActiveImmediately : false
      }));

      addMultipleRadioTracks(tracksToSave);
    } else {
      // Single track save
      const singleItem = pendingAudioFiles[0];
      const titleToUse = fileForm.title.trim() || singleItem?.title || 'Nova Música';
      const audioUrlToUse = fileForm.audioDataUrl || singleItem?.audioDataUrl;
      const fileNameToUse = fileForm.fileName || singleItem?.fileName || 'audio.mp3';
      const fileSizeToUse = fileForm.fileSize || singleItem?.fileSize || '';
      const durationToUse = fileForm.duration || singleItem?.duration || '3:30';

      if (!audioUrlToUse) {
        alert('Selecione primeiro um arquivo de áudio do seu aparelho.');
        return;
      }

      addRadioTrack({
        title: titleToUse,
        artist: fileForm.artist.trim() || 'JET SAMBA BLACK',
        badgeLabel: fileForm.badgeLabel.trim() || 'Radio JET',
        sourceType: 'file',
        audioUrl: audioUrlToUse,
        duration: durationToUse,
        description: fileForm.description.trim() || `Música "${fileNameToUse}" enviada direto do aparelho.`,
        fileName: fileNameToUse,
        fileSize: fileSizeToUse,
        isActive: fileForm.setAsActiveImmediately
      });
    }

    // Reset Form
    setPendingAudioFiles([]);
    setFileForm({
      title: '',
      artist: 'JET SAMBA BLACK',
      badgeLabel: 'Radio JET',
      audioDataUrl: '',
      fileName: '',
      fileSize: '',
      duration: '3:45',
      description: '',
      setAsActiveImmediately: true
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Scroll to Library view
    setTimeout(() => {
      document.getElementById('radio-jet-library')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Quick Play / Test Audio
  const toggleAdminPlay = (track: { id: string; audioUrl: string; title: string }) => {
    if (adminPlayingTrackId === track.id) {
      if (adminIsPlaying) {
        adminAudioRef.current?.pause();
        setAdminIsPlaying(false);
      } else {
        adminAudioRef.current?.play().catch(() => {});
        setAdminIsPlaying(true);
      }
    } else {
      setAdminPlayingTrackId(track.id);
      if (adminAudioRef.current) {
        adminAudioRef.current.src = track.audioUrl;
        adminAudioRef.current.play().then(() => {
          setAdminIsPlaying(true);
        }).catch(() => {});
      }
    }
  };

  // Save Edit Track
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack) return;

    updateRadioTrack(editingTrack.id, {
      title: editingTrack.title,
      artist: editingTrack.artist,
      badgeLabel: editingTrack.badgeLabel,
      audioUrl: editingTrack.audioUrl,
      soundCloudTrackUrl: editingTrack.soundCloudTrackUrl,
      duration: editingTrack.duration,
      description: editingTrack.description,
      isActive: editingTrack.isActive
    });

    setEditingTrack(null);
  };

  const filteredTracks = radioTracks.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.badgeLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hidden Audio Player for Preview Testing */}
      <audio
        ref={adminAudioRef}
        onEnded={() => setAdminIsPlaying(false)}
        onPause={() => setAdminIsPlaying(false)}
        onPlay={() => setAdminIsPlaying(true)}
      />

      {/* Top Banner: Rádio JET Live Monitor */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-rose-500/30 p-5 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Broadcast Marquee Ticker moving Right to Left */}
        <div className="relative z-10 mb-5 p-2.5 sm:p-3 rounded-xl bg-zinc-950/90 border border-amber-500/40 shadow-inner flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-300 shrink-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-[11px] font-black tracking-wider uppercase whitespace-nowrap">
              No Ar Agora
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <MarqueeText
              text={`${radioSettings.artist || 'JET SAMBA BLACK'} • ${radioSettings.title || 'God Bar Ao Vivo'}  —  Rádio JET Oficial`}
              badge={radioSettings.badgeLabel || 'Radio JET'}
              icon={<Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />}
              className="text-xs text-amber-300"
              speed="normal"
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
                Rádio JET • No Ar na Tela Principal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Acesso Público sem Login
              </span>
            </div>

            <div className="py-1">
              <MarqueeText
                text={`${radioSettings.artist || 'JET SAMBA BLACK'} — ${radioSettings.title}`}
                className="text-xl sm:text-2xl font-black text-white"
                speed="slow"
                fadeEdges={false}
              />
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Esta é a música reproduzida na <strong>Rádio JET</strong> para qualquer visitante que acessar a página inicial sem precisar fazer login. Você pode adicionar músicas por links da Web ou enviar arquivos diretamente do seu aparelho.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-zinc-400 flex-wrap">
              <span className="flex items-center gap-1.5 bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700">
                {radioSettings.sourceType === 'file' ? (
                  <>
                    <FileAudio className="w-3.5 h-3.5 text-emerald-400" />
                    <strong className="text-emerald-400">Arquivo do Aparelho:</strong> {radioSettings.fileName || 'Áudio Carregado'} {radioSettings.fileSize && `(${radioSettings.fileSize})`}
                  </>
                ) : radioSettings.sourceType === 'url' ? (
                  <>
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <strong className="text-sky-400">Origem:</strong> Endereço Web / Stream
                  </>
                ) : (
                  <>
                    <Disc3 className="w-3.5 h-3.5 text-amber-400" />
                    <strong className="text-amber-400">Origem:</strong> SoundCloud Oficial
                  </>
                )}
              </span>

              <span className="bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700">
                <strong>Selo Visual:</strong> <span className="text-rose-300 font-bold">{radioSettings.badgeLabel}</span>
              </span>

              {radioSettings.duration && (
                <span className="bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700">
                  <strong>Duração:</strong> {radioSettings.duration}
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions for Current On-Air Track */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0">
            <button
              onClick={() => toggleAdminPlay({ id: 'active-radio', audioUrl: radioSettings.audioUrl, title: radioSettings.title })}
              className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                adminPlayingTrackId === 'active-radio' && adminIsPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-950/60'
                  : 'bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-rose-950/40'
              }`}
            >
              {adminPlayingTrackId === 'active-radio' && adminIsPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar Teste</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Testar Faixa no Painel</span>
                </>
              )}
            </button>

            <button
              onClick={restoreDefaultRadioSingle}
              className="px-3.5 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Restaurar para a gravação original do God Bar Ao Vivo"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Restaurar Padrão (God Bar)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Selector for Adding: Web URL vs Device File */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-rose-500" />
              <span>Incluir Nova Música na Rádio JET</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Escolha entre inserir uma URL da internet ou selecionar um arquivo de áudio direto do seu aparelho.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setInclusionMode('url')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                inclusionMode === 'url'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Endereço de Internet (URL)</span>
            </button>

            <button
              type="button"
              onClick={() => setInclusionMode('file')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                inclusionMode === 'file'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Arquivo do Aparelho</span>
            </button>
          </div>
        </div>

        {/* Form Mode 1: Internet URL */}
        {inclusionMode === 'url' && (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Título da Música *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lady (Nova Versão Estúdio)"
                  value={urlForm.title}
                  onChange={(e) => setUrlForm({ ...urlForm, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Artista / Banda
                </label>
                <input
                  type="text"
                  placeholder="JET SAMBA BLACK"
                  value={urlForm.artist}
                  onChange={(e) => setUrlForm({ ...urlForm, artist: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Endereço de Internet da Música (URL de Áudio / Stream) *</span>
                  <span className="text-[10px] text-zinc-500">.mp3, .aac, shoutcast, link web</span>
                </label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/musicas/minha-faixa.mp3"
                  value={urlForm.audioUrl}
                  onChange={(e) => setUrlForm({ ...urlForm, audioUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Link da Faixa no SoundCloud (Opcional)</span>
                  <span className="text-[10px] text-zinc-500">soundcloud.com/banda/...</span>
                </label>
                <input
                  type="url"
                  placeholder="https://soundcloud.com/user-330902255/jet-samba-black-godbar-ao-vivo"
                  value={urlForm.soundCloudTrackUrl}
                  onChange={(e) => setUrlForm({ ...urlForm, soundCloudTrackUrl: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Selo de Exibição
                </label>
                <input
                  type="text"
                  placeholder="Single: Lady, Rádio JET, Ao Vivo"
                  value={urlForm.badgeLabel}
                  onChange={(e) => setUrlForm({ ...urlForm, badgeLabel: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Duração Estimada
                </label>
                <input
                  type="text"
                  placeholder="Ex: 4:15"
                  value={urlForm.duration}
                  onChange={(e) => setUrlForm({ ...urlForm, duration: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  Descrição Breve
                </label>
                <input
                  type="text"
                  placeholder="Ex: Gravado no estúdio central"
                  value={urlForm.description}
                  onChange={(e) => setUrlForm({ ...urlForm, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-zinc-800">
              <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={urlForm.setAsActiveImmediately}
                  onChange={(e) => setUrlForm({ ...urlForm, setAsActiveImmediately: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 text-rose-600 focus:ring-rose-500"
                />
                <span>Definir imediatamente como música ativa na <strong>Rádio JET</strong> da tela principal</span>
              </label>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Salvar Música via Link da Internet</span>
              </button>
            </div>
          </form>
        )}

        {/* Form Mode 2: Device File Upload */}
        {inclusionMode === 'file' && (
          <form onSubmit={handleFileSubmit} className="space-y-4">
            {/* Dropzone / File Picker */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  processAudioFileList(e.dataTransfer.files);
                }
              }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/10 scale-[1.005]'
                  : 'border-zinc-700 hover:border-amber-500/80 bg-zinc-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.wma"
                onChange={handleDeviceAudioFile}
                className="hidden"
                id="radio-device-audio-input"
              />

              <label
                htmlFor="radio-device-audio-input"
                className="flex flex-col items-center justify-center cursor-pointer space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Clique aqui ou arraste seus arquivos de áudio do aparelho
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Suporta MP3, WAV, OGG, M4A, AAC, FLAC — Selecione 1 ou várias músicas de uma só vez
                  </p>
                </div>

                {isUploading && (
                  <div className="text-xs text-amber-400 font-semibold animate-pulse flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Lendo arquivos de áudio e detectando durações...</span>
                  </div>
                )}
              </label>

              {uploadError && (
                <div className="mt-3 text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 rounded-xl p-2.5">
                  {uploadError}
                </div>
              )}
            </div>

            {/* If MULTIPLE files are loaded */}
            {pendingAudioFiles.length > 1 && (
              <div className="space-y-3 p-4 bg-zinc-950/80 border border-amber-500/30 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">
                      {pendingAudioFiles.length} Arquivos de Áudio Carregados
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Você pode ajustar o título de cada música antes de salvar na biblioteca
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {pendingAudioFiles.map((fileItem, index) => (
                    <div
                      key={fileItem.id}
                      className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <input
                            type="text"
                            value={fileItem.title}
                            onChange={(e) => updatePendingFileTitle(fileItem.id, e.target.value)}
                            placeholder="Título da música"
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400">
                            <span className="truncate">{fileItem.fileName}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-medium">{fileItem.duration}</span>
                            <span>•</span>
                            <span className="font-mono">{fileItem.fileSize}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleAdminPlay({ id: fileItem.id, audioUrl: fileItem.audioDataUrl, title: fileItem.title })}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1"
                          title="Ouvir prévia"
                        >
                          {adminPlayingTrackId === fileItem.id && adminIsPlaying ? (
                            <Pause className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => removePendingFile(fileItem.id)}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-900/60 text-zinc-400 hover:text-rose-400 transition-colors"
                          title="Remover da seleção"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Common metadata for the batch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                      Artista / Banda (Padrão para o lote)
                    </label>
                    <input
                      type="text"
                      placeholder="JET SAMBA BLACK"
                      value={fileForm.artist}
                      onChange={(e) => setFileForm({ ...fileForm, artist: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                      Selo de Exibição
                    </label>
                    <input
                      type="text"
                      placeholder="Radio JET"
                      value={fileForm.badgeLabel}
                      onChange={(e) => setFileForm({ ...fileForm, badgeLabel: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* If SINGLE file is loaded */}
            {(pendingAudioFiles.length === 1 || (!pendingAudioFiles.length && fileForm.audioDataUrl)) && (
              <div className="space-y-4">
                <div className="p-3.5 bg-zinc-900 border border-emerald-500/40 rounded-xl text-left flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <FileAudio className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{fileForm.fileName || pendingAudioFiles[0]?.fileName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                          {fileForm.fileSize || pendingAudioFiles[0]?.fileSize}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400">
                        Duração detectada: <strong className="text-amber-400">{fileForm.duration || pendingAudioFiles[0]?.duration}</strong>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleAdminPlay({
                      id: 'upload-preview',
                      audioUrl: fileForm.audioDataUrl || pendingAudioFiles[0]?.audioDataUrl,
                      title: fileForm.title
                    })}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 flex items-center gap-1.5 shrink-0"
                  >
                    {adminPlayingTrackId === 'upload-preview' && adminIsPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                        <span>Ouvir Prévia</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Additional Fields for Single Device File */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      Título da Música *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nome da música"
                      value={fileForm.title}
                      onChange={(e) => setFileForm({ ...fileForm, title: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      Artista / Banda
                    </label>
                    <input
                      type="text"
                      placeholder="JET SAMBA BLACK"
                      value={fileForm.artist}
                      onChange={(e) => setFileForm({ ...fileForm, artist: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      Selo de Exibição
                    </label>
                    <input
                      type="text"
                      placeholder="Radio JET"
                      value={fileForm.badgeLabel}
                      onChange={(e) => setFileForm({ ...fileForm, badgeLabel: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      Duração
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 3:45"
                      value={fileForm.duration}
                      onChange={(e) => setFileForm({ ...fileForm, duration: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      Descrição
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Faixa autoral gravada no estúdio"
                      value={fileForm.description}
                      onChange={(e) => setFileForm({ ...fileForm, description: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-zinc-800">
              <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fileForm.setAsActiveImmediately}
                  onChange={(e) => setFileForm({ ...fileForm, setAsActiveImmediately: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500"
                />
                <span>Definir imediatamente como música ativa na <strong>Rádio JET</strong> da tela principal</span>
              </label>

              <button
                type="submit"
                disabled={pendingAudioFiles.length === 0 && !fileForm.audioDataUrl}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-black text-xs shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <UploadCloud className="w-4 h-4" />
                <span>
                  {pendingAudioFiles.length > 1
                    ? `Salvar ${pendingAudioFiles.length} Músicas na Biblioteca da Rádio JET`
                    : 'Salvar Arquivo de Áudio na Rádio JET'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Playlist / Library Management */}
      <div id="radio-jet-library" className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Headphones className="w-5 h-5 text-amber-400" />
              <span>Biblioteca de Músicas da Rádio JET</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Organize a sequência de reprodução contínua e defina quais músicas tocarão automaticamente para todos os visitantes.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar por título ou selo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Informative Sequence Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-zinc-900 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <ListOrdered className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-300">
              Sequência de Reprodução Automática da Rádio JET
            </p>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              As músicas são reproduzidas em sequência contínua (<strong>#1 → #2 → #3...</strong>). Quando uma faixa chega ao fim, a próxima toca automaticamente. Use as setas <strong>⬆ Subir</strong> e <strong>⬇ Descer</strong> para alterar a ordem da playlist.
            </p>
          </div>
        </div>

        {/* Tracks List */}
        <div className="space-y-3 pt-2">
          {filteredTracks.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl">
              <Music className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-400">Nenhuma música encontrada com esse termo.</p>
            </div>
          ) : (
            filteredTracks.map((track, displayIndex) => {
              const isCurrentlyActive = track.isActive;
              const isTestingThis = adminPlayingTrackId === track.id && adminIsPlaying;
              // Find real index in full radioTracks array for sequential movement
              const realIndex = radioTracks.findIndex(t => t.id === track.id);
              const isFirst = realIndex === 0;
              const isLast = realIndex === radioTracks.length - 1;

              return (
                <div
                  key={track.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCurrentlyActive
                      ? 'bg-zinc-950/90 border-rose-500/60 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/30'
                      : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Reordering Controls (Up / Down) */}
                    <div className="flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 shrink-0 gap-0.5">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => moveRadioTrack(track.id, 'up')}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 disabled:opacity-20 disabled:hover:text-zinc-400 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                        title="Subir posição na sequência automática"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] font-black text-amber-400 px-1">
                        #{realIndex + 1}
                      </span>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => moveRadioTrack(track.id, 'down')}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 disabled:opacity-20 disabled:hover:text-zinc-400 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                        title="Descer posição na sequência automática"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Play test button */}
                    <button
                      type="button"
                      onClick={() => toggleAdminPlay({ id: track.id, audioUrl: track.audioUrl, title: track.title })}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-md ${
                        isTestingThis
                          ? 'bg-rose-600 text-white animate-pulse'
                          : isCurrentlyActive
                          ? 'bg-gradient-to-br from-rose-600 to-amber-600 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
                      }`}
                      title={isTestingThis ? 'Pausar prévia' : 'Ouvir prévia'}
                    >
                      {isTestingThis ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                          {track.title}
                        </span>

                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {track.badgeLabel}
                        </span>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {realIndex + 1}º a Tocar
                        </span>

                        {isCurrentlyActive && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            ★ No Ar na Tela Principal
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 text-[11px] text-zinc-400 mt-1 flex-wrap">
                        <span>{track.artist || 'JET SAMBA BLACK'}</span>
                        <span>•</span>
                        <span>Duração: {track.duration || '4:00'}</span>
                        <span>•</span>
                        {track.sourceType === 'file' ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <FileAudio className="w-3 h-3" />
                            <span>Aparelho ({track.fileSize || 'Áudio'})</span>
                          </span>
                        ) : track.sourceType === 'url' ? (
                          <span className="text-sky-400 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>Link Web</span>
                          </span>
                        ) : (
                          <span className="text-amber-400 flex items-center gap-1">
                            <Disc3 className="w-3 h-3" />
                            <span>SoundCloud</span>
                          </span>
                        )}

                        {track.description && (
                          <>
                            <span>•</span>
                            <span className="text-zinc-500 truncate max-w-xs">{track.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {!isCurrentlyActive ? (
                      <button
                        type="button"
                        onClick={() => setActiveRadioTrack(track.id)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                        title="Iniciar reprodução desta música na Rádio JET"
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span>Tocar na Tela Principal</span>
                      </button>
                    ) : (
                      <span className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Música Ativa</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setEditingTrack(track)}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
                      title="Editar metadados da música"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setTrackToDelete(track)}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-950/80 text-zinc-400 hover:text-rose-400 border border-zinc-700 hover:border-rose-500/40 transition-colors cursor-pointer"
                      title="Excluir música da biblioteca"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Campo para Inclusão e Gerenciamento das Faixas da Tela Principal ("Faixas Principais & Demos") */}
      <AdminMainTracksSection />

      {/* Delete Confirmation Modal */}
      {trackToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Excluir Música da Rádio JET</h3>
                <p className="text-xs text-zinc-400">Esta ação removerá a faixa da biblioteca.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <p className="text-xs font-bold text-white">{trackToDelete.title}</p>
              <p className="text-[11px] text-zinc-400">{trackToDelete.artist} • Selo: {trackToDelete.badgeLabel}</p>
              {trackToDelete.isActive && (
                <p className="text-[11px] text-amber-400 font-semibold mt-1">
                  ⚠️ Esta faixa está tocando atualmente na tela principal. Ao excluir, a próxima música da sequência assumirá a reprodução.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTrackToDelete(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteRadioTrack(trackToDelete.id);
                  setTrackToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/60 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmar e Excluir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Track Modal */}
      {editingTrack && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-400" />
              <span>Editar Música da Rádio JET</span>
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={editingTrack.title}
                  onChange={(e) => setEditingTrack({ ...editingTrack, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Artista</label>
                <input
                  type="text"
                  value={editingTrack.artist}
                  onChange={(e) => setEditingTrack({ ...editingTrack, artist: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Selo / Rótulo de Exibição</label>
                <input
                  type="text"
                  value={editingTrack.badgeLabel}
                  onChange={(e) => setEditingTrack({ ...editingTrack, badgeLabel: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Duração</label>
                <input
                  type="text"
                  value={editingTrack.duration || ''}
                  onChange={(e) => setEditingTrack({ ...editingTrack, duration: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Descrição</label>
                <input
                  type="text"
                  value={editingTrack.description || ''}
                  onChange={(e) => setEditingTrack({ ...editingTrack, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                />
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
    </div>
  );
};
