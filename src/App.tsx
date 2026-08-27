import React from 'react';
import { BandProvider, useBand } from './context/BandContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { MembersSection } from './components/MembersSection';
import { TourSection } from './components/TourSection';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { VideoGallerySection } from './components/VideoGallerySection';
import { MusicPlayerSection } from './components/MusicPlayerSection';
import { BookingSection } from './components/BookingSection';
import { FanClubSection } from './components/FanClubSection';
import { Footer } from './components/Footer';

// Portals
import { AdminPanel } from './components/AdminPanel';
import { ContractorPortal } from './components/ContractorPortal';
import { FanClubPortal } from './components/FanClubPortal';

// Modals & Notifications
import { AuthModal } from './components/AuthModal';
import { EmailInboxModal } from './components/EmailInboxModal';
import { PhotoLightboxModal, VideoPlayerModal } from './components/MediaModals';
import { ToastNotification } from './components/ToastNotification';
import { SoundCloudLadyPlayer } from './components/SoundCloudLadyPlayer';

const MainContent: React.FC = () => {
  const { activeView } = useBand();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden w-full max-w-full">
      {/* Autoplay Single Lady Player with Controls */}
      <SoundCloudLadyPlayer />
      {/* View routing based on activeView */}
      {activeView === 'admin' && <AdminPanel />}
      {activeView === 'contractor' && <ContractorPortal />}
      {activeView === 'fan_club' && <FanClubPortal />}

      {activeView === 'public' && (
        <>
          <Navbar />
          <main className="w-full max-w-full overflow-x-hidden">
            <Hero />
            <AboutSection />
            <MembersSection />
            <TourSection />
            <PhotoGallerySection />
            <VideoGallerySection />
            <MusicPlayerSection />
            <BookingSection />
            <FanClubSection />
          </main>
          <Footer />
        </>
      )}

      {/* Global Application Modals & Overlays */}
      <AuthModal />
      <EmailInboxModal />
      <PhotoLightboxModal />
      <VideoPlayerModal />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <BandProvider>
      <MainContent />
    </BandProvider>
  );
}
