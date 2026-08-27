export type UserRole = 'admin' | 'contractor' | 'fan' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  city?: string;
  fanClubTier?: 'Silver' | 'Gold' | 'VIP Master';
  memberNumber?: string;
  joinedDate: string;
}

export interface BandMember {
  id: string;
  name: string;
  nickname: string;
  role: string;
  instruments: string[];
  photo: string;
  bio: string;
  gear: string;
  socials: {
    instagram?: string;
    spotify?: string;
    youtube?: string;
  };
}

export interface HistoryMilestone {
  year: string;
  title: string;
  description: string;
  highlight?: string;
}

export interface BandInfo {
  name: string;
  genre: string;
  tagline: string;
  cityOrigin: string;
  yearFormed: string;
  logoUrl?: string;
  heroLogoUrl?: string;
  navbarLogoUrl?: string;
  bio: string;
  longBio: string;
  historyMilestones: HistoryMilestone[];
  socialLinks: {
    spotify: string;
    appleMusic: string;
    deezer: string;
    youtube: string;
    instagram: string;
    tiktok: string;
    amazonMusic: string;
    tidal: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    bookingManager: string;
    pressContact: string;
    city: string;
  };
}

export interface ShowEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  title: string;
  venue: string;
  city: string;
  state: string;
  ticketStatus: 'available' | 'sold_out' | 'free' | 'coming_soon' | 'private';
  ticketUrl: string;
  ticketPrice?: string;
  description?: string;
  isPast?: boolean;
  featured?: boolean;
}

export interface PhotoItem {
  id: string;
  url: string;
  title: string;
  category: 'shows' | 'backstage' | 'studio' | 'promo';
  date: string;
  location?: string;
  photographer?: string;
}

export interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  type: 'clip' | 'live' | 'acoustic' | 'documentary';
  views?: string;
  duration?: string;
  releaseDate: string;
  description?: string;
  featured?: boolean;
}

export interface RadioSettings {
  title: string;
  artist: string;
  badgeLabel: string; // e.g. "Single: Lady", "Rádio JET", "Lançamento"
  sourceType: 'url' | 'file' | 'soundcloud' | 'default';
  audioUrl: string; // Direct audio web link or base64 data URL
  soundCloudTrackUrl?: string;
  soundCloudEmbedUrl?: string;
  duration?: string;
  description?: string;
  fileName?: string;
  fileSize?: string;
  updatedAt?: string;
}

export interface RadioTrackItem {
  id: string;
  title: string;
  artist: string;
  badgeLabel: string;
  sourceType: 'url' | 'file' | 'soundcloud' | 'default';
  audioUrl: string;
  soundCloudTrackUrl?: string;
  soundCloudEmbedUrl?: string;
  duration?: string;
  description?: string;
  fileName?: string;
  fileSize?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  album: string;
  duration: string;
  durationSeconds: number;
  coverUrl: string;
  audioTone: 'energetic' | 'ballad' | 'acoustic' | 'anthem';
  spotifyUrl?: string;
  youtubeMusicUrl?: string;
  soundCloudUrl?: string;
  audioUrl?: string; // Direct audio stream / web URL or uploaded audio Data URL / Blob URL
  audioSourceType?: 'url' | 'file' | 'soundcloud' | 'default';
  audioFileName?: string;
  lyrics?: string;
  plays: number;
  isExclusive?: boolean;
  isMainRadioSingle?: boolean; // Featured active song on the main public screen (Single: Lady)
  badgeLabel?: string; // e.g. "Single: Lady", "Ao Vivo", "Novo Single", "Rádio JET"
}

export interface BookingRequest {
  id: string;
  contractorName: string;
  contractorEmail: string;
  contractorPhone: string;
  companyOrOrg?: string;
  eventType: 'festival' | 'venue' | 'corporate' | 'wedding' | 'city_hall' | 'private';
  eventDate: string;
  eventCity: string;
  eventState: string;
  venueName: string;
  estimatedAudience: string;
  budgetOffer: string;
  technicalStructureProvided: boolean;
  notes?: string;
  status: 'pending' | 'analyzing' | 'approved' | 'declined' | 'confirmed';
  createdAt: string;
  contractorUserId?: string;
  adminResponse?: string;
  protocolNumber: string;
}

export interface ExclusiveFanContent {
  id: string;
  title: string;
  type: 'photo' | 'video' | 'audio_demo' | 'behind_the_scenes' | 'poll';
  thumbnailUrl: string;
  mediaUrl?: string;
  description: string;
  publishedAt: string;
  likes: number;
  commentsCount: number;
  minTier: 'Silver' | 'Gold' | 'VIP Master';
}

export interface FanMessage {
  id: string;
  fanId: string;
  fanName: string;
  fanAvatar: string;
  fanTier: string;
  content: string;
  date: string;
  likes: number;
  bandReply?: {
    author: string;
    text: string;
    date: string;
  };
}

export interface SetlistVoteItem {
  id: string;
  songTitle: string;
  album: string;
  votes: number;
  hasVoted?: boolean;
}

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  recipientType: 'admin' | 'contractor' | 'fan';
  subject: string;
  previewText: string;
  htmlContent: string;
  sentAt: string;
  read: boolean;
  type: 'new_booking' | 'booking_status_updated' | 'exclusive_fan_alert' | 'ticket_alert' | 'fan_reply';
  relatedId?: string;
}
