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
  User
} from '../types';
import yuriPhoto from '../assets/images/yuri_campos.jpg';
import { JSB_LOGO_BASE64 } from '../assets/logoBase64';

export const INITIAL_BAND_INFO: BandInfo = {
  name: 'JET SAMBA BLACK',
  genre: 'Samba Rock / Black Music / Groove Brasileiro',
  tagline: `Preparados para o som que vai balançar tudo?

O Jet Samba Black 🚀 chegou para transformar qualquer dia em um verdadeiro evento! Muita energia, talento de sobra e aquele swing inconfundível que não deixa ninguém parado.

Se você curte uma vibe lá em cima e muito ritmo, o seu lugar é com a gente. Vem sentir essa pressão! 🔥🎹🎶🥃 🍻

#JetSambaBlack #Samba #Swing #MúsicaAoVivo #EnergiaPura`,
  cityOrigin: 'São Paulo, Brasil',
  yearFormed: '2018',
  logoUrl: JSB_LOGO_BASE64,
  bio: 'Formada em 2018 nos palcos independentes de São Paulo, a banda JET SAMBA BLACK rapidamente conquistou o cenário nacional com sua mistura visceral de samba rock, black music e swing irresistível.',
  longBio: 'O que começou como encontros musicais e ensaios cheios de suingue transformou-se em uma das maiores potências do samba rock e black music contemporâneo brasileiro. Com milhões de streams acumulados nas plataformas digitais e apresentações memoráveis nos maiores festivais do país, a JET SAMBA BLACK é reconhecida pela entrega enérgica no palco e pela conexão apaixonada com seu público.',
  historyMilestones: [
    {
      year: '2018',
      title: 'A Centelha Inicial',
      description: 'Primeira formação oficial reunindo músicos experientes no swing do samba rock e da black music.',
      highlight: 'Primeiro show histórico em São Paulo com casa lotada.'
    },
    {
      year: '2020',
      title: 'EP de Estreia: "Ressonância & Swing"',
      description: 'Lançamento independente durante a pandemia alcança meio milhão de reproduções no Spotify sem gravadora.',
      highlight: 'Single "Suingue Black" viraliza em playlists editoriais e nas rádios.'
    },
    {
      year: '2022',
      title: 'Primeiro Álbum & Turnê Nacional',
      description: 'Álbum completo "Groove Sem Fronteiras" lançado com turnê por 14 capitais brasileiras com ingressos esgotados.',
      highlight: 'Indicados a Melhor Revelação da Música Brasileira no Prêmio Multishow.'
    },
    {
      year: '2024',
      title: 'Palco de Grandes Festivais',
      description: 'Apresentações eletrizantes em grandes festivais, consolidando o som maduro e arrebatador da banda.',
      highlight: 'Show histórico transmitido ao vivo para todo o país.'
    },
    {
      year: '2026',
      title: 'Turnê "Ecos do Groove" 2026',
      description: 'Novo álbum de estúdio e turnê nacional e internacional incluindo datas no Brasil e exterior.',
      highlight: 'Gravação do novo DVD ao vivo em grande arena.'
    }
  ],
  socialLinks: {
    spotify: 'https://open.spotify.com',
    appleMusic: 'https://music.apple.com',
    deezer: 'https://deezer.com',
    youtube: 'https://youtube.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    amazonMusic: 'https://music.amazon.com',
    tidal: 'https://tidal.com'
  },
  contactInfo: {
    email: 'booking@jetsambablack.com.br',
    phone: '+55 (11) 98765-4321',
    bookingManager: 'Carlos Eduardo (Kadu) - Star Booking & Management',
    pressContact: 'imprensa@jetsambablack.com.br',
    city: 'São Paulo - SP'
  }
};

export const INITIAL_MEMBERS: BandMember[] = [
  {
    id: 'member-1',
    name: 'Iuri Campos',
    nickname: 'IURI CAMPOS',
    role: 'Bateria & Percussão',
    instruments: ['Bateria Mapex', 'Pratos Zildjian K Custom', 'Pads & Percussão'],
    photo: yuriPhoto,
    bio: 'Baterista com precisão técnica, carisma contagiante e o swing inconfundível do samba rock e da black music. Conhecido por suas viradas explosivas e presença vibrante no palco.',
    gear: 'Bateria Mapex Saturn Series, Pratos Zildjian K Custom 14/16/18/21, Roland SPD-SX PRO, Mapex Hardware',
    socials: {
      instagram: 'https://instagram.com',
      spotify: 'https://spotify.com'
    }
  },
  {
    id: 'member-2',
    name: 'Sofia Drummond',
    nickname: 'Sofi',
    role: 'Guitarra Solo, Cavaquinho & Backing Vocals',
    instruments: ['Guitarra Gibson Les Paul', 'Cavaquinho Elétrico', 'Backing Vocal'],
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    bio: 'Multi-instrumentista com solos melódicos, levadas rítmicas de samba rock e texturas modernas que definem a identidade do grupo.',
    gear: 'Gibson Les Paul Standard Goldtop, Fender Cavaquinho, Marshall JCM800, Line 6 Helix',
    socials: {
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com'
    }
  },
  {
    id: 'member-3',
    name: 'Mateus "Ganso" Rocha',
    nickname: 'Ganso',
    role: 'Contrabaixo & Synth Bass',
    instruments: ['Baixo Fender Jazz Bass', 'Baixo 5 Cordas Dingwall', 'Sintetizador Sub Phatty'],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
    bio: 'A espinha dorsal rítmica e groove inconfundível. Traz influências de funk soul, samba rock e linhas de baixo encorpadas e dançantes.',
    gear: 'Fender American Ultra Jazz Bass, Cabeçote Darkglass Microtubes 900, Ampeg 8x10',
    socials: {
      instagram: 'https://instagram.com'
    }
  },
  {
    id: 'member-4',
    name: 'Gabriel Silveira',
    nickname: 'Biel',
    role: 'Voz Principal & Violão / Guitarra Base',
    instruments: ['Voz', 'Violão Takamine Pro', 'Guitarra Fender Telecaster'],
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    bio: 'Voz marcante e compositor do grupo. Conhecido pela presença de palco magnética e pela interpretação apaixonada de cada canção.',
    gear: 'Violão Takamine Pro Series 6 Cordas, Fender Custom Shop Telecaster \'62, Shure Beta 58A',
    socials: {
      instagram: 'https://instagram.com'
    }
  }
];

export const INITIAL_SHOWS: ShowEvent[] = [
  {
    id: 'show-1',
    date: '2026-09-12',
    time: '21:30',
    title: 'Festival Ecos do Rock 2026',
    venue: 'Allianz Parque - Arena Principal',
    city: 'São Paulo',
    state: 'SP',
    ticketStatus: 'available',
    ticketUrl: 'https://eventim.com.br',
    ticketPrice: 'R$ 140 - R$ 380',
    description: 'Abertura oficial da turnê com palco 360° e convidados especiais.',
    featured: true
  },
  {
    id: 'show-2',
    date: '2026-09-19',
    time: '22:00',
    title: 'Noite Indie Circo Voador',
    venue: 'Circo Voador',
    city: 'Rio de Janeiro',
    state: 'RJ',
    ticketStatus: 'available',
    ticketUrl: 'https://eventim.com.br',
    ticketPrice: 'R$ 90 - R$ 180',
    description: 'Show completo com setlist estendido e estreia de faixas inéditas.',
    featured: true
  },
  {
    id: 'show-3',
    date: '2026-10-03',
    time: '20:00',
    title: 'Primavera Sound Side Show',
    venue: 'Ópera de Arame',
    city: 'Curitiba',
    state: 'PR',
    ticketStatus: 'sold_out',
    ticketUrl: 'https://eventim.com.br',
    ticketPrice: 'Esgotado',
    description: 'Lotação máxima esgotada em menos de 48 horas.',
    featured: false
  },
  {
    id: 'show-4',
    date: '2026-10-17',
    time: '21:00',
    title: 'Turnê Oficial 2026 - BH',
    venue: 'Autêntica',
    city: 'Belo Horizonte',
    state: 'MG',
    ticketStatus: 'available',
    ticketUrl: 'https://sympla.com.br',
    ticketPrice: 'R$ 80 - R$ 160',
    description: 'Encontro com fãs (Meet & Greet VIP para membros do fã clube).',
    featured: false
  },
  {
    id: 'show-5',
    date: '2026-11-07',
    time: '19:30',
    title: 'Festival Porto Alegre Vivo',
    venue: 'Auditório Araújo Vianna',
    city: 'Porto Alegre',
    state: 'RS',
    ticketStatus: 'available',
    ticketUrl: 'https://sympla.com.br',
    ticketPrice: 'R$ 95 - R$ 190',
    description: 'Apresentação com orquestra de cordas local em faixas selecionadas.',
    featured: false
  },
  {
    id: 'show-6',
    date: '2026-11-28',
    time: '22:00',
    title: 'Festival da Primavera Brasília',
    venue: 'Estádio Mané Garrincha',
    city: 'Brasília',
    state: 'DF',
    ticketStatus: 'coming_soon',
    ticketUrl: 'https://eventim.com.br',
    ticketPrice: 'Vendas em breve',
    description: 'Lineup principal com bandas nacionais e internacionais.',
    featured: false
  },
  {
    id: 'show-7',
    date: '2026-07-15',
    time: '21:00',
    title: 'Festival João Rock 2026',
    venue: 'Parque Permanente de Exposições',
    city: 'Ribeirão Preto',
    state: 'SP',
    ticketStatus: 'available',
    ticketUrl: 'https://joaorock.com.br',
    ticketPrice: 'Concluído',
    description: 'Show histórico para mais de 50.000 pessoas.',
    isPast: true
  }
];

export const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    title: 'Explosão no Palco Principal - Lollapalooza',
    category: 'shows',
    date: 'Março 2026',
    location: 'Autódromo de Interlagos, SP',
    photographer: 'Renato Furtado'
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    title: 'Mar de Luzes dos Fãs',
    category: 'shows',
    date: 'Fevereiro 2026',
    location: 'Allianz Parque, SP',
    photographer: 'Marina Duarte'
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    title: 'Momento Solo de Guitarra - Sofia Drummond',
    category: 'shows',
    date: 'Janeiro 2026',
    location: 'Circo Voador, RJ',
    photographer: 'Lucas Mendes'
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    title: 'Gravação de Guitarras no Estúdio Toca do Bandido',
    category: 'studio',
    date: 'Maio 2026',
    location: 'Rio de Janeiro, RJ',
    photographer: 'Banda JET SAMBA BLACK'
  },
  {
    id: 'photo-5',
    url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    title: 'Bastidores & Ritual Pré-Show',
    category: 'backstage',
    date: 'Abril 2026',
    location: 'Camarim Principal',
    photographer: 'Felipe Rocha'
  },
  {
    id: 'photo-6',
    url: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=1200&q=80',
    title: 'Mixagem Analógica e Ajuste de Timbres',
    category: 'studio',
    date: 'Maio 2026',
    location: 'Estúdio Gargolândia',
    photographer: 'Renato Furtado'
  },
  {
    id: 'photo-7',
    url: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=1200&q=80',
    title: 'Sessão Promocional Oficial - Álbum "Ecos do Groove"',
    category: 'promo',
    date: 'Junho 2026',
    location: 'São Paulo, SP',
    photographer: 'Camila Albuquerque'
  },
  {
    id: 'photo-8',
    url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=80',
    title: 'Celebração com a Plateia ao Final do Concerto',
    category: 'shows',
    date: 'Julho 2026',
    location: 'Audio Club, SP',
    photographer: 'Marina Duarte'
  }
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'video-1',
    youtubeId: 'k4V3gWVO3l0',
    title: 'JET SAMBA BLACK - "Suingue & Liberdade" (Videoclipe Oficial)',
    type: 'clip',
    views: '2.4M visualizações',
    duration: '4:15',
    releaseDate: '2025',
    description: 'Videoclipe dirigido por Pedro Alvarenga. Gravado nas dunas de Florianópolis e estúdio em São Paulo.',
    featured: true
  },
  {
    id: 'video-2',
    youtubeId: 'fJ9rUzIMcZQ',
    title: 'JET SAMBA BLACK - "Groove da Cidade" (Ao Vivo no Allianz Parque)',
    type: 'live',
    views: '890k visualizações',
    duration: '5:32',
    releaseDate: '2026',
    description: 'Performance explosiva com swing marcante e participação de 45.000 vozes.'
  },
  {
    id: 'video-3',
    youtubeId: 'L_XJ_s5IsQc',
    title: 'JET SAMBA BLACK - "Samba de Raiz e Alma" (Sessão Acústica no Estúdio)',
    type: 'acoustic',
    views: '540k visualizações',
    duration: '3:50',
    releaseDate: '2026',
    description: 'Versão intimista com arranjo de violão de 7 cordas, cavaquinho e harmonia vocal.'
  },
  {
    id: 'video-4',
    youtubeId: 'bv_cEeDlop0',
    title: 'Documentário: A Estrada do Swing - Turnê Nacional (Bastidores)',
    type: 'documentary',
    views: '320k visualizações',
    duration: '18:45',
    releaseDate: '2025',
    description: 'Mini documentário acompanhando 30 dias na van da banda durante a turnê do Nordeste ao Sul.'
  }
];

export const INITIAL_TRACKS: AudioTrack[] = [
  {
    id: 'track-juras-de-amor',
    title: 'Juras de Amor',
    album: 'Samba Rock & Paixão (2026)',
    duration: '3:45',
    durationSeconds: 225,
    coverUrl: JSB_LOGO_BASE64,
    audioTone: 'anthem',
    spotifyUrl: 'https://open.spotify.com',
    youtubeMusicUrl: 'https://music.youtube.com',
    soundCloudUrl: 'https://soundcloud.com/user-330902255/jet-samba-black-godbar-ao-vivo',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=brazil-party-samba-carnival-122979.mp3',
    plays: 1980000,
    lyrics: `[Intro com Swingueira e Balanço - JET SAMBA BLACK]
(Iuri Campos na batera marcando a pressão, baixo pulsante e guitarra suingada)

Juras de amor sob a luz do luar
Você me olhou e me fez viajar
No compasso do samba, na dança colada
A nossa história já estava marcada!

[Refrão]
Juras de amor, promessas ao vento
Você é a dona do meu sentimento
Vem pro meu samba, não para de dançar
Que a noite é nossa até o sol raiar!

[Solo de Cavaquinho e Guitarra Suingada]
Vem no balanço que o Jet Samba Black vai tocar!
Deixa a batucada esquentar!`
  },
  {
    id: 'track-to-legal',
    title: 'TÔ LEGAL',
    album: 'Single Oficial (2022)',
    duration: '3:13',
    durationSeconds: 193,
    coverUrl: JSB_LOGO_BASE64,
    audioTone: 'energetic',
    spotifyUrl: 'https://open.spotify.com',
    youtubeMusicUrl: 'https://music.youtube.com',
    soundCloudUrl: 'https://soundcloud.com/user-330902255/jet-samba-black-godbar-ao-vivo',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=brazilian-street-samba-10022.mp3',
    plays: 1420000,
    lyrics: `[Intro com Cavaquinho e Groovão - JET SAMBA BLACK]
(Batidão animado, guitarra suingada e pandeiro na pressão)

Hoje eu acordei numa vibe positiva
Deixei a tristeza pra lá da esquina
Botei meu melhor tênis, camisa estampada
Que hoje o samba não tem hora de parada!

[Refrão]
Eu tô legal, tô numa boa
Com o Jet Samba Black a vida toda ecoa
Eu tô legal, com alegria no olhar
Vem pro suingue que a festa vai começar!

[Verso 2]
Quem tem balanço na alma não perde o compasso
A gente se abraça e vence o cansaço
No compasso do samba, na palma da mão
Vem cantar com a gente esse refrão!

[Refrão Final]
Eu tô legal, tô numa boa
Com o Jet Samba Black a vida toda ecoa!`
  },
  {
    id: 'track-1',
    title: 'LADY (Ao Vivo no God Bar)',
    album: 'Single Oficial (2023)',
    duration: '3:19',
    durationSeconds: 199,
    coverUrl: JSB_LOGO_BASE64,
    audioTone: 'anthem',
    spotifyUrl: 'https://open.spotify.com',
    youtubeMusicUrl: 'https://music.youtube.com/watch?v=5Jj0yQ6t-3A&si=ccl9CCUIQDFHie4R',
    soundCloudUrl: 'https://soundcloud.com/user-330902255/jet-samba-black-godbar-ao-vivo',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=brazilian-street-carnival-batucada-samba-112194.mp3',
    plays: 1845000,
    lyrics: `[Intro com Swing e Balanço Inconfundível - JET SAMBA BLACK]
(Iuri Campos na batera marcando o compasso, baixo pulsante e guitarra suingada)

Lady, o teu jeito me fascina quando você entra na pista
O balanço do samba rock contagia quem tá por perto
Na ginga dos teus passos, na cadência do coração
A noite inteira é festa, não tem erro nem solidão!

[Refrão]
Ô Lady, vem cá dançar
Que o Jet Samba Black fez esse som pra te embalar
Ô Lady, deixa o suingue levar
Na batida perfeita até o dia clarear!

[Solo de Guitarra e Cavaquinho Suingado]
Vem no compasso, solta o cabelo
Que essa levada não tem segredo!

[Refrão Final]
Ô Lady, vem cá dançar
Que o Jet Samba Black fez esse som pra te embalar!`
  },
  {
    id: 'track-2',
    title: 'Ecos do Amanhã',
    album: 'Ecos do Infinito (2026)',
    duration: '4:22',
    durationSeconds: 262,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=400&q=80',
    audioTone: 'energetic',
    spotifyUrl: 'https://open.spotify.com',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_34190fa6e1.mp3?filename=samba-brasil-11004.mp3',
    plays: 980200,
    lyrics: `[Verso 1]
Cinzas no asfalto, marcas do temporal
O relógio não para no compasso visceral
Dois acordes soltos e uma decisão
A noite nos chama em rotação!

[Refrão]
Ouça os ecos, sinta o trovão
Nossa história escrita com o coração!`
  },
  {
    id: 'track-3',
    title: 'Horizonte de Vidro',
    album: 'Horizontes Fractais (2024)',
    duration: '3:15',
    durationSeconds: 195,
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80',
    audioTone: 'ballad',
    spotifyUrl: 'https://open.spotify.com',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8230554.mp3?filename=brazilian-bossa-nova-samba-10702.mp3',
    plays: 2350000,
    lyrics: `[Arpejo Acústico Suave]
Se as paredes refletem o que não queremos ver
Eu quebro o vidro pra te reencontrar
Cada cicatriz me ensina a viver
No silêncio que o mar costuma guardar...`
  },
  {
    id: 'track-4',
    title: 'Pulsação 140 (Demo Exclusiva VIP)',
    album: 'Sessões Secretas (Inédito)',
    duration: '3:05',
    durationSeconds: 185,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    audioTone: 'energetic',
    spotifyUrl: 'https://open.spotify.com',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_03d9225f8a.mp3?filename=rio-de-janeiro-carnival-samba-125692.mp3',
    plays: 48900,
    isExclusive: true,
    lyrics: `[Faixa Exclusiva do Fã Clube Oficial]
Linha de baixo pulsante em 140 BPM.
Gravação direta da mesa de som do ensaio técnico de pré-produção.`
  }
];

export const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: 'booking-101',
    protocolNumber: 'JET-2026-089',
    contractorName: 'Roberto Silveira',
    contractorEmail: 'contratante@eventos.com',
    contractorPhone: '+55 (21) 99887-1122',
    companyOrOrg: 'Produtora Rio Music Live',
    eventType: 'festival',
    eventDate: '2026-11-14',
    eventCity: 'Niterói',
    eventState: 'RJ',
    venueName: 'Teatro Popular Oscar Niemeyer',
    estimatedAudience: '4.500 pessoas',
    budgetOffer: 'R$ 65.000',
    technicalStructureProvided: true,
    notes: 'Festival comemorativo de Primavera. Estrutura completa de P.A. L-Acoustics K2 e iluminação DMX fornecidas conforme Rider.',
    status: 'approved',
    createdAt: '2026-08-15T14:30:00Z',
    adminResponse: 'Proposta pré-aprovada pela equipe de produção! Contrato e rider técnico complementar enviados por e-mail.',
    contractorUserId: 'user-contractor-1'
  },
  {
    id: 'booking-102',
    protocolNumber: 'JET-2026-092',
    contractorName: 'Mariana Castilho',
    contractorEmail: 'mariana.eventos@spcorp.com.br',
    contractorPhone: '+55 (11) 97123-4567',
    companyOrOrg: 'Grupo Alfa Eventos Corporativos',
    eventType: 'corporate',
    eventDate: '2026-12-05',
    eventCity: 'Campinas',
    eventState: 'SP',
    venueName: 'Royal Palm Plaza Hall',
    estimatedAudience: '1.200 pessoas',
    budgetOffer: 'R$ 45.000',
    technicalStructureProvided: true,
    notes: 'Festa de fim de ano corporativa. Show de 1h30 com os maiores sucessos da banda e clássicos do samba rock e black music.',
    status: 'analyzing',
    createdAt: '2026-08-18T10:15:00Z',
    adminResponse: 'Analisando logística com a data anterior em São Paulo. Retorno oficial em até 24h.'
  }
];

export const INITIAL_FAN_CONTENT: ExclusiveFanContent[] = [
  {
    id: 'fan-content-1',
    title: 'Audição Prévia: Gravação de Vozes da Nova Faixa "Luz Própria"',
    type: 'audio_demo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    description: 'Gabriel Silveira gravando o take vocal definitivo com o microfone Neumann U87 no estúdio. Ouçam em primeira mão o refrão!',
    publishedAt: 'Ontem às 18:30',
    likes: 342,
    commentsCount: 56,
    minTier: 'Silver'
  },
  {
    id: 'fan-content-2',
    title: 'Galeria Exclusiva: Ensaio de Fotos Não Utilizadas no Álbum',
    type: 'photo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    description: 'Fotos brutas da sessão no rooftop com a fotógrafa Camila Albuquerque. Alta resolução para download de wallpapers!',
    publishedAt: '3 dias atrás',
    likes: 512,
    commentsCount: 89,
    minTier: 'Gold'
  },
  {
    id: 'fan-content-3',
    title: 'Vlog dos Bastidores: Correria na Van e Passagem de Som em Curitiba',
    type: 'behind_the_scenes',
    thumbnailUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    description: 'Gabriel e Sofia mostram como afinam os instrumentos antes do portão abrir e o que comem no camarim.',
    publishedAt: '5 dias atrás',
    likes: 678,
    commentsCount: 120,
    minTier: 'VIP Master'
  }
];

export const INITIAL_FAN_MESSAGES: FanMessage[] = [
  {
    id: 'msg-1',
    fanId: 'fan-101',
    fanName: 'Júlia Medeiros',
    fanAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    fanTier: 'VIP Master ⭐',
    content: 'O show de vocês no Circo Voador mudou a minha vida! Vocês pretendem incluir a música "Horizonte de Vidro" na versão estendida no Allianz Parque?',
    date: 'Hoje às 11:20',
    likes: 24,
    bandReply: {
      author: 'Gabriel Silveira (Vocal)',
      text: 'Oi Júlia! Que carinho incrível! Sim, estamos preparando um arranjo especial de 7 minutos com orquestra para o Allianz! Nos vemos na grade!',
      date: 'Hoje às 12:05'
    }
  },
  {
    id: 'msg-2',
    fanId: 'fan-102',
    fanName: 'Rodrigo Santoro Farias',
    fanAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    fanTier: 'Gold Member',
    content: 'Sofia, que levada espetacular na guitarra em "Lady"! Aquele suingue com o Iuri na bateria é bom demais!',
    date: 'Ontem às 19:40',
    likes: 24,
    bandReply: {
      author: 'Sofia Drummond (Guitarra)',
      text: 'Fala Rodrigo! Misturamos guitarra suingada, cavaquinho e o beat firme do Iuri. É pura energia pro baile!',
      date: 'Ontem às 21:15'
    }
  },
  {
    id: 'msg-3',
    fanId: 'fan-103',
    fanName: 'Carla Vasconcellos',
    fanAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    fanTier: 'Silver Member',
    content: 'Quando sai o merch oficial da turnê 2026? Quero muito a camiseta com a coroa oficial JSB!',
    date: '2 dias atrás',
    likes: 31,
    bandReply: {
      author: 'Mateus "Ganso" (Baixo)',
      text: 'Carla! Lote exclusivo para membros do Fã Clube abre na próxima segunda-feira com 25% de desconto antes da loja pública!',
      date: '2 dias atrás'
    }
  }
];

export const INITIAL_SETLIST_VOTES: SetlistVoteItem[] = [
  { id: 'vote-1', songTitle: 'Lady (Versão Estendida com Solo do Iuri)', album: 'Single Oficial 2026', votes: 1680 },
  { id: 'vote-2', songTitle: 'Horizonte de Vidro (Acústico + Cordas)', album: 'Horizontes Fractais', votes: 1195 },
  { id: 'vote-3', songTitle: 'Ecos do Amanhã (Com Solo Duplo)', album: 'Turnê 2026', votes: 980 },
  { id: 'vote-4', songTitle: 'Cicatriz Urbana (Lado B)', album: 'Ressonância EP', votes: 760 },
  { id: 'vote-5', songTitle: 'Tributo Especial Samba Rock (Cover Secreto)', album: 'Especial Turnê', votes: 645 }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Carlos Eduardo (Kadu Manager)',
    email: 'admin@banda.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    company: 'Star Booking & JET SAMBA BLACK Management',
    city: 'São Paulo - SP',
    joinedDate: '2018-01-10'
  },
  {
    id: 'user-contractor-1',
    name: 'Roberto Silveira',
    email: 'contratante@eventos.com',
    role: 'contractor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    company: 'Produtora Rio Music Live',
    city: 'Rio de Janeiro - RJ',
    joinedDate: '2023-04-12'
  },
  {
    id: 'user-fan-1',
    name: 'Júlia Medeiros',
    email: 'fa@clube.com',
    role: 'fan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    city: 'São Paulo - SP',
    fanClubTier: 'VIP Master',
    memberNumber: 'JET-VIP-0042',
    joinedDate: '2021-08-20'
  }
];

export const INITIAL_EMAILS: EmailNotification[] = [
  {
    id: 'email-1',
    recipientEmail: 'booking@jetsambablack.com.br',
    recipientName: 'Gestão JET SAMBA BLACK (Admin)',
    recipientType: 'admin',
    subject: '🔥 Nova Proposta de Contratação Recebida - Protocolo JET-2026-089',
    previewText: 'Roberto Silveira enviou uma proposta para Festival Ecos de Primavera no Teatro Popular de Niterói...',
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #12131a; color: #f3f4f6; border-radius: 12px; overflow: hidden; border: 1px solid #2d303e;">
        <div style="background: linear-gradient(135deg, #e11d48, #8b5cf6); padding: 24px; text-align: center;">
          <h2 style="margin: 0; color: #fff; font-size: 22px; text-transform: uppercase; letter-spacing: 2px;">JET SAMBA BLACK • Booking Oficial</h2>
          <p style="margin: 6px 0 0 0; color: #fecdd3; font-size: 14px;">Alerta Automático de Nova Solicitação de Show</p>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px; line-height: 1.6;">Olá equipe de produção,</p>
          <p style="font-size: 15px; color: #d1d5db;">Uma nova proposta oficial de agendamento de show foi submetida pelo portal:</p>
          
          <div style="background: #1c1e29; padding: 18px; border-radius: 8px; border-left: 4px solid #e11d48; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Protocolo:</strong> JET-2026-089</p>
            <p style="margin: 4px 0;"><strong>Contratante:</strong> Roberto Silveira (Produtora Rio Music Live)</p>
            <p style="margin: 4px 0;"><strong>E-mail:</strong> contratante@eventos.com | <strong>Tel:</strong> (21) 99887-1122</p>
            <p style="margin: 4px 0;"><strong>Tipo de Evento:</strong> Festival Aberto</p>
            <p style="margin: 4px 0;"><strong>Data Prevista:</strong> 14/11/2026</p>
            <p style="margin: 4px 0;"><strong>Local:</strong> Teatro Popular Oscar Niemeyer - Niterói/RJ</p>
            <p style="margin: 4px 0;"><strong>Público Estimado:</strong> 4.500 pessoas</p>
            <p style="margin: 4px 0; color: #34d399;"><strong>Proposta de Cachê:</strong> R$ 65.000,00</p>
          </div>

          <p style="font-size: 14px; color: #9ca3af;">Acesse o Painel Administrativo para aprovar, ajustar valores ou recusar a proposta.</p>
        </div>
        <div style="background: #0d0e14; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
          JET SAMBA BLACK Management Inc. • Todos os direitos reservados.
        </div>
      </div>
    `,
    sentAt: '2026-08-15 14:30',
    read: false,
    type: 'new_booking',
    relatedId: 'booking-101'
  },
  {
    id: 'email-2',
    recipientEmail: 'contratante@eventos.com',
    recipientName: 'Roberto Silveira',
    recipientType: 'contractor',
    subject: '✅ Confirmação de Recebimento de Proposta de Show - Protocolo JET-2026-089',
    previewText: 'Recebemos com sucesso sua solicitação de show para a turnê JET SAMBA BLACK. Número de protocolo: JET-2026-089...',
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #12131a; color: #f3f4f6; border-radius: 12px; overflow: hidden; border: 1px solid #2d303e;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 24px; text-align: center;">
          <h2 style="margin: 0; color: #fff; font-size: 22px; text-transform: uppercase; letter-spacing: 2px;">JET SAMBA BLACK</h2>
          <p style="margin: 6px 0 0 0; color: #d1fae5; font-size: 14px;">Confirmação de Solicitação de Agendamento</p>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px; line-height: 1.6;">Prezado(a) <strong>Roberto Silveira</strong>,</p>
          <p style="font-size: 15px; color: #d1d5db;">Agradecemos pelo interesse em levar o espetáculo da banda <strong>JET SAMBA BLACK</strong> ao seu evento!</p>
          
          <div style="background: #1c1e29; padding: 18px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Seu Protocolo:</strong> <span style="color: #34d399; font-weight: bold;">JET-2026-089</span></p>
            <p style="margin: 4px 0;"><strong>Data Solicitada:</strong> 14/11/2026</p>
            <p style="margin: 4px 0;"><strong>Local:</strong> Teatro Popular Oscar Niemeyer, Niterói - RJ</p>
            <p style="margin: 4px 0;"><strong>Status Atual:</strong> <span style="background: #065f46; color: #6ee7b7; padding: 2px 8px; border-radius: 4px;">Aprovado Preliminarmente</span></p>
          </div>

          <p style="font-size: 14px; color: #d1d5db; line-height: 1.6;">
            Nossa gerência artística já está em contato com os detalhes de logística e contrato. Você também pode acompanhar o status em tempo real acessando a <strong>Área do Contratante</strong> no site oficial.
          </p>
        </div>
        <div style="background: #0d0e14; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
          Contato direto da produção: booking@jetsambablack.com.br | +55 (11) 98765-4321
        </div>
      </div>
    `,
    sentAt: '2026-08-15 14:31',
    read: true,
    type: 'booking_status_updated',
    relatedId: 'booking-101'
  },
  {
    id: 'email-3',
    recipientEmail: 'fa@clube.com',
    recipientName: 'Júlia Medeiros',
    recipientType: 'fan',
    subject: '🥁 Iuri Campos respondeu ao seu recado no Mural VIP do Fã Clube!',
    previewText: 'Iuri Campos acabou de responder à sua mensagem sobre o show no Allianz Parque...',
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #12131a; color: #f3f4f6; border-radius: 12px; overflow: hidden; border: 1px solid #2d303e;">
        <div style="background: linear-gradient(135deg, #f59e0b, #e11d48); padding: 24px; text-align: center;">
          <h2 style="margin: 0; color: #fff; font-size: 22px; text-transform: uppercase; letter-spacing: 2px;">Fã Clube VIP JET SAMBA BLACK</h2>
          <p style="margin: 6px 0 0 0; color: #fef3c7; font-size: 14px;">Nova Resposta Direta da Banda</p>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px;">Oi <strong>Júlia</strong>,</p>
          <p style="font-size: 14px; color: #d1d5db;">Iuri Campos deixou uma resposta especial para o seu comentário:</p>
          
          <div style="background: #1c1e29; padding: 16px; border-radius: 8px; margin: 18px 0; border-left: 3px solid #f59e0b;">
            <p style="font-style: italic; color: #e5e7eb; margin: 0 0 8px 0;">"Oi Júlia! Que carinho incrível! Sim, estamos preparando um arranjo especial e muito swing para o Allianz! Nos vemos na grade!"</p>
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">— Iuri Campos (Bateria)</p>
          </div>

          <p style="font-size: 14px; color: #9ca3af;">Acesse agora a sua área VIP para ver mais bastidores e votar na setlist do próximo show!</p>
        </div>
      </div>
    `,
    sentAt: '2026-08-20 12:05',
    read: false,
    type: 'fan_reply'
  }
];

export const INITIAL_RADIO_SETTINGS: RadioSettings = {
  title: 'Lady (God Bar Ao Vivo)',
  artist: 'JET SAMBA BLACK',
  badgeLabel: 'Radio JET',
  sourceType: 'soundcloud',
  audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=brazilian-street-carnival-batucada-samba-112194.mp3',
  soundCloudTrackUrl: 'https://soundcloud.com/user-330902255/jet-samba-black-godbar-ao-vivo',
  soundCloudEmbedUrl: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/user-330902255/jet-samba-black-godbar-ao-vivo&color=%23e11d48&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
  duration: '4:15',
  description: 'Gravação ao vivo eletrizante no God Bar com o balanço do Samba Rock autêntico do JET SAMBA BLACK.',
  fileName: '',
  updatedAt: '2026-08-22'
};

export const INITIAL_RADIO_TRACKS: RadioTrackItem[] = [
  {
    id: 'radio-1',
    title: 'Lady (God Bar Ao Vivo)',
    artist: 'JET SAMBA BLACK',
    badgeLabel: 'Radio JET',
    sourceType: 'soundcloud',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=brazilian-street-carnival-batucada-samba-112194.mp3',
    soundCloudTrackUrl: 'https://soundcloud.com/user-330902255/jet-samba-black-godbar-ao-vivo',
    soundCloudEmbedUrl: 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/user-330902255/jet-samba-black-godbar-ao-vivo&color=%23e11d48&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
    duration: '4:15',
    description: 'Faixa principal tocada no player flutuante e no botão Radio JET da tela inicial.',
    isActive: true,
    createdAt: '2026-08-22'
  },
  {
    id: 'radio-2',
    title: 'Samba Rock da Madrugada',
    artist: 'JET SAMBA BLACK',
    badgeLabel: 'Rádio JET',
    sourceType: 'url',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=brazil-party-samba-carnival-122979.mp3',
    duration: '3:48',
    description: 'Groove contagiante de samba rock com metais quentes e percussão marcante.',
    isActive: false,
    createdAt: '2026-08-22'
  },
  {
    id: 'radio-3',
    title: 'Swing Black Paulista',
    artist: 'JET SAMBA BLACK',
    badgeLabel: 'Ao Vivo',
    sourceType: 'url',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_34190fa6e1.mp3?filename=samba-brasil-11004.mp3',
    duration: '4:02',
    description: 'Versão de palco com improviso de bateria de Iuri Campos e solo de guitarra.',
    isActive: false,
    createdAt: '2026-08-22'
  }
];

