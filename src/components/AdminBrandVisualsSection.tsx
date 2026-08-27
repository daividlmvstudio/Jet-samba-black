import React, { useState, useRef, useEffect } from 'react';
import { useBand } from '../context/BandContext';
import {
  Upload,
  Link as LinkIcon,
  Camera,
  RotateCw,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  Crown,
  Trash2,
  Plus,
  AlertTriangle,
  X,
  Check,
  Info
} from 'lucide-react';
import { PREDEFINED_BAND_LOGOS, DEFAULT_BAND_LOGO, PredefinedLogo } from '../data/bandLogos';

const STORAGE_GALLERY_KEY = 'jsb_brand_logos_gallery_v2';

export const AdminBrandVisualsSection: React.FC = () => {
  const { bandInfo, updateBandInfo, addToast } = useBand();

  // Selected target: 'both' (general logo), 'navbar' (only navbar), 'hero' (only hero)
  const [targetScope, setTargetScope] = useState<'both' | 'navbar' | 'hero'>('both');

  // Input mode: 'upload' | 'gallery' | 'url' | 'camera'
  const [inputMode, setInputMode] = useState<'upload' | 'gallery' | 'url' | 'camera'>('gallery');

  // Dynamic gallery items persisted in localStorage
  const [galleryLogos, setGalleryLogos] = useState<PredefinedLogo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_GALLERY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar galeria de logos:', e);
    }
    return PREDEFINED_BAND_LOGOS;
  });

  // Photo pending deletion confirmation modal/prompt
  const [logoToDelete, setLogoToDelete] = useState<PredefinedLogo | null>(null);

  // Local state for draft URLs
  const [generalLogoUrl, setGeneralLogoUrl] = useState<string>(bandInfo.logoUrl || DEFAULT_BAND_LOGO);
  const [navbarLogoUrl, setNavbarLogoUrl] = useState<string>(bandInfo.navbarLogoUrl || bandInfo.logoUrl || DEFAULT_BAND_LOGO);
  const [heroLogoUrl, setHeroLogoUrl] = useState<string>(bandInfo.heroLogoUrl || bandInfo.logoUrl || DEFAULT_BAND_LOGO);

  const [urlInput, setUrlInput] = useState<string>('');
  const [urlNameInput, setUrlNameInput] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync gallery to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GALLERY_KEY, JSON.stringify(galleryLogos));
    } catch (e) {
      console.warn('Erro ao salvar galeria:', e);
    }
  }, [galleryLogos]);

  // Sync state when bandInfo changes from context
  useEffect(() => {
    setGeneralLogoUrl(bandInfo.logoUrl || DEFAULT_BAND_LOGO);
    setNavbarLogoUrl(bandInfo.navbarLogoUrl || bandInfo.logoUrl || DEFAULT_BAND_LOGO);
    setHeroLogoUrl(bandInfo.heroLogoUrl || bandInfo.logoUrl || DEFAULT_BAND_LOGO);
  }, [bandInfo.logoUrl, bandInfo.navbarLogoUrl, bandInfo.heroLogoUrl]);

  // Apply a photo URL to the active target scope
  const applyPhotoUrl = (url: string, addToGalleryName?: string) => {
    if (!url) return;

    // Optionally save to gallery if requested
    if (addToGalleryName) {
      const newLogoItem: PredefinedLogo = {
        id: `custom-logo-${Date.now()}`,
        name: addToGalleryName || 'Foto Personalizada',
        url: url,
        description: 'Foto adicionada manualmente pelo painel admin',
        isCustom: true
      };
      setGalleryLogos((prev) => [newLogoItem, ...prev]);
    }

    if (targetScope === 'both') {
      setGeneralLogoUrl(url);
      setNavbarLogoUrl(url);
      setHeroLogoUrl(url);
      updateBandInfo({
        logoUrl: url,
        navbarLogoUrl: url,
        heroLogoUrl: url
      });
      addToast({
        type: 'success',
        title: 'Foto Atualizada',
        message: 'Logotipo atualizado no Topo (Navbar) e no Emblema da Tela Inicial!'
      });
    } else if (targetScope === 'navbar') {
      setNavbarLogoUrl(url);
      updateBandInfo({
        navbarLogoUrl: url
      });
      addToast({
        type: 'success',
        title: 'Foto da Barra Superior Atualizada',
        message: 'A foto do topo (Navbar) foi atualizada com sucesso!'
      });
    } else if (targetScope === 'hero') {
      setHeroLogoUrl(url);
      updateBandInfo({
        heroLogoUrl: url
      });
      addToast({
        type: 'success',
        title: 'Emblema da Tela Inicial Atualizado',
        message: 'A foto do emblema central da tela inicial (Hero) foi atualizada!'
      });
    }
  };

  // Delete a photo from the gallery
  const handleDeleteLogo = (logo: PredefinedLogo) => {
    const updated = galleryLogos.filter((item) => item.id !== logo.id);
    setGalleryLogos(updated);
    setLogoToDelete(null);

    // If currently active logo was deleted, fall back to default
    if (bandInfo.logoUrl === logo.url || bandInfo.navbarLogoUrl === logo.url || bandInfo.heroLogoUrl === logo.url) {
      const fallbackUrl = updated.length > 0 ? updated[0].url : DEFAULT_BAND_LOGO;
      updateBandInfo({
        logoUrl: bandInfo.logoUrl === logo.url ? fallbackUrl : bandInfo.logoUrl,
        navbarLogoUrl: bandInfo.navbarLogoUrl === logo.url ? fallbackUrl : bandInfo.navbarLogoUrl,
        heroLogoUrl: bandInfo.heroLogoUrl === logo.url ? fallbackUrl : bandInfo.heroLogoUrl
      });
    }

    addToast({
      type: 'info',
      title: 'Foto Excluída',
      message: `A foto "${logo.name}" foi removida da galeria com sucesso.`
    });
  };

  // Restore predefined default gallery
  const handleRestoreDefaultGallery = () => {
    setGalleryLogos(PREDEFINED_BAND_LOGOS);
    try {
      localStorage.setItem(STORAGE_GALLERY_KEY, JSON.stringify(PREDEFINED_BAND_LOGOS));
    } catch (e) {}
    addToast({
      type: 'success',
      title: 'Galeria Restaurada',
      message: 'Todas as fotos originais da galeria foram restauradas com sucesso!'
    });
  };

  // Handle local file upload
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast({
        type: 'error',
        title: 'Arquivo Inválido',
        message: 'Selecione um arquivo de imagem válido (PNG, JPG, WEBP, SVG).'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const fileNameClean = file.name.replace(/\.[^/.]+$/, '').slice(0, 25);
        applyPhotoUrl(reader.result, `Foto: ${fileNameClean}`);
        setInputMode('gallery');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Camera handling
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
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      applyPhotoUrl(dataUrl, `Foto Câmera ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`);
      setInputMode('gallery');
    }
    stopCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    applyPhotoUrl(urlInput.trim(), urlNameInput.trim() || 'Foto da Web');
    setUrlInput('');
    setUrlNameInput('');
    setInputMode('gallery');
  };

  const handleResetToDefault = () => {
    applyPhotoUrl(DEFAULT_BAND_LOGO);
  };

  // Determine current active preview depending on scope
  const activePreviewUrl =
    targetScope === 'navbar'
      ? navbarLogoUrl
      : targetScope === 'hero'
      ? heroLogoUrl
      : generalLogoUrl;

  return (
    <div id="admin-brand-visuals-card" className="p-5 sm:p-7 rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-zinc-950 border-2 border-amber-500/40 shadow-2xl shadow-black/60 relative overflow-hidden">
      {/* Top ambient glow */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Confirmation Modal for Deleting Photo */}
      {logoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border-2 border-rose-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">Excluir Foto da Galeria?</h4>
                <p className="text-xs text-zinc-400">Esta foto será removida das opções disponíveis.</p>
              </div>
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0">
                <img
                  src={logoToDelete.url}
                  alt={logoToDelete.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_BAND_LOGO;
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{logoToDelete.name}</p>
                <p className="text-[11px] text-zinc-400 line-clamp-1">{logoToDelete.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLogoToDelete(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDeleteLogo(logoToDelete)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-950/50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Excluir Foto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center shrink-0 shadow-lg shadow-orange-950/50">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Identidade Visual • Tela Inicial Pública
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> Sem Login
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              Fotos e Logotipos Oficiais da Banda
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
              Alterne ou <strong>exclua fotos da galeria</strong> e selecione a imagem da <strong>Barra de Navegação (Navbar)</strong> e do <strong>Emblema Principal (Hero)</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold border border-zinc-700/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Restaurar o logotipo oficial dourado original"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Restaurar Logo Padrão</span>
          </button>
        </div>
      </div>

      {/* Target Scope Selection & Live Previews */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Column: Scope selector & Input Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Scope Selector Chips */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2">
              1. Onde você deseja aplicar a foto selecionada?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetScope('both')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  targetScope === 'both'
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-950/30 ring-1 ring-amber-500/50'
                    : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Geral (Ambos)</span>
                  {targetScope === 'both' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <span className="text-[11px] text-zinc-400 leading-tight">
                  Atualiza o Topo (Navbar) e o Hero juntos
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTargetScope('navbar')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  targetScope === 'navbar'
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-950/30 ring-1 ring-amber-500/50'
                    : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Barra Superior</span>
                  {targetScope === 'navbar' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <span className="text-[11px] text-zinc-400 leading-tight">
                  Apenas ícone da barra de navegação
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTargetScope('hero')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  targetScope === 'hero'
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-950/30 ring-1 ring-amber-500/50'
                    : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Emblema Hero</span>
                  {targetScope === 'hero' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <span className="text-[11px] text-zinc-400 leading-tight">
                  Apenas moldura central da página inicial
                </span>
              </button>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                2. Como você quer incluir ou gerenciar a foto?
              </label>
              {inputMode === 'gallery' && galleryLogos.length < PREDEFINED_BAND_LOGOS.length && (
                <button
                  type="button"
                  onClick={handleRestoreDefaultGallery}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restaurar Fotos Originais</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setInputMode('gallery')}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  inputMode === 'gallery'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-950 shadow-md font-extrabold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Galeria de Fotos ({galleryLogos.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('upload')}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  inputMode === 'upload'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-950 shadow-md font-extrabold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Enviar Nova Foto</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('url')}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  inputMode === 'url'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-950 shadow-md font-extrabold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Link da Web</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputMode('camera');
                  if (!isCameraActive) startCamera();
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  inputMode === 'camera'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-zinc-950 shadow-md font-extrabold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Câmera</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Gallery with Delete Photo Actions */}
          {inputMode === 'gallery' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <span>Clique em uma foto para aplicar, ou no ícone vermelho de lixeira para excluir.</span>
                <span className="text-[11px] font-bold text-amber-400">{galleryLogos.length} foto(s)</span>
              </div>

              {galleryLogos.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-zinc-800 rounded-2xl text-center bg-zinc-950/60 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-zinc-300">Nenhuma foto na galeria no momento</p>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto">Você excluiu todas as fotos. Envie uma nova foto ou restaure a galeria original.</p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleRestoreDefaultGallery}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Restaurar Fotos Oficiais
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('upload')}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs cursor-pointer transition-colors"
                    >
                      Enviar Nova Foto
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryLogos.map((logo) => {
                    const isSelected = activePreviewUrl === logo.url;
                    return (
                      <div
                        key={logo.id}
                        className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/50 shadow-lg'
                            : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80'
                        }`}
                      >
                        {/* Delete Button Header */}
                        <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
                          {isSelected && (
                            <div className="bg-amber-500 text-zinc-950 p-1 rounded-full shadow-md">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLogoToDelete(logo);
                            }}
                            className="w-7 h-7 rounded-lg bg-rose-950/80 hover:bg-rose-600 border border-rose-600/50 text-rose-300 hover:text-white flex items-center justify-center shadow-md cursor-pointer transition-all hover:scale-110"
                            title={`Excluir foto: ${logo.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Clickable Image Body */}
                        <div
                          onClick={() => applyPhotoUrl(logo.url)}
                          className="cursor-pointer"
                        >
                          <div className="w-full aspect-square rounded-lg overflow-hidden bg-black border border-zinc-800 mb-2 relative">
                            <img
                              src={logo.url}
                              alt={logo.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = DEFAULT_BAND_LOGO;
                              }}
                            />
                          </div>
                          <div className="text-xs font-bold text-white truncate pr-6">{logo.name}</div>
                          <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{logo.description}</div>
                        </div>

                        {/* Action footer button */}
                        <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => applyPhotoUrl(logo.url)}
                            className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-zinc-950'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white'
                            }`}
                          >
                            {isSelected ? '✓ Aplicado' : 'Aplicar'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Mode 2: File Upload (Drag & Drop) */}
          {inputMode === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                  : 'border-zinc-700/80 bg-zinc-950/60 hover:border-amber-500/60 hover:bg-zinc-900/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                Clique para selecionar ou arraste uma foto aqui
              </h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Formatos suportados: PNG (transparência), JPG ou WEBP. A foto será aplicada e salva na sua galeria.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-200 border border-zinc-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Inclusão instantânea na Galeria</span>
              </div>
            </div>
          )}

          {/* Mode 3: Web Image URL */}
          {inputMode === 'url' && (
            <form onSubmit={handleApplyUrl} className="space-y-3 bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Título / Nome da Foto (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Foto Show Arena 2026"
                  value={urlNameInput}
                  onChange={(e) => setUrlNameInput(e.target.value)}
                  className="w-full mb-3 bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />

                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Cole o link direto da imagem na internet (URL HTTP/HTTPS)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://exemplo.com/foto-jet-samba-black.png"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!urlInput.trim()}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Adicionar à Galeria</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Mode 4: Camera Capture */}
          {inputMode === 'camera' && (
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-4">
              {cameraError ? (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  <p className="font-bold mb-2">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Tentar Novamente
                  </button>
                </div>
              ) : isCameraActive ? (
                <div className="space-y-3">
                  <div className="relative w-full max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden bg-black border-2 border-amber-500 shadow-2xl">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-zinc-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Fotografar e Salvar</span>
                    </button>
                    <button
                      type="button"
                      onClick={toggleCameraFacing}
                      className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold cursor-pointer"
                      title="Alternar câmera frontal / traseira"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6">
                  <Camera className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                  <p className="text-xs text-zinc-400 mb-3">Abra a câmera do aparelho para capturar um logo ou foto</p>
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Iniciar Câmera
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Mockup Previews (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400">
            Pré-visualização em Tempo Real (Tela Pública)
          </label>

          {/* Preview 1: Navbar Top Logo */}
          <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                1. Topo da Barra de Navegação (Navbar)
              </span>
              <span className="text-[10px] text-amber-400 uppercase font-black">Ao Vivo</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-950 border-2 border-amber-500/60 p-0.5 shadow-lg shadow-orange-950/40 shrink-0">
                  <img
                    src={navbarLogoUrl}
                    alt={bandInfo.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_BAND_LOGO;
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black tracking-wider text-white">
                    {bandInfo.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] tracking-widest text-zinc-400 uppercase font-bold">
                      JET OFICIAL
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                Menu Público
              </span>
            </div>
          </div>

          {/* Preview 2: Hero Emblem */}
          <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                2. Emblema Central da Seção Principal (Hero)
              </span>
              <span className="text-[10px] text-orange-400 uppercase font-black">Ao Vivo</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-950 border-2 border-orange-500 shadow-2xl shadow-orange-950/70 p-1">
                <img
                  src={heroLogoUrl}
                  alt={bandInfo.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_BAND_LOGO;
                  }}
                />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-orange-500/40 shadow-md">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-300">
                  {`JET OFICIAL ${new Date().getFullYear()}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
