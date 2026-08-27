import React, { useState } from 'react';
import { useBand } from '../context/BandContext';
import {
  Instagram,
  Youtube,
  Radio,
  Mail,
  Heart,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Star
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { bandInfo, openAuthModal, resetAllDataToDefault, sendEmailNotification } = useBand();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    sendEmailNotification({
      recipientEmail: newsletterEmail,
      recipientName: 'Fã de Carteirinha',
      recipientType: 'fan',
      subject: `🎸 Bem-vindo(a) à Newsletter Oficial do ${bandInfo.name}!`,
      previewText: 'Você agora recebe em primeira mão datas de shows, lançamentos de clipes e descontos de ingressos...',
      type: 'ticket_alert',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; background: #0f1015; color: #fff; padding: 24px; border-radius: 12px;">
          <h2 style="color: #e11d48;">Inscrição Confirmada!</h2>
          <p>Obrigado por se inscrever na nossa lista oficial. Prometemos não enviar spam — apenas novidades quentes de shows e novas faixas!</p>
        </div>
      `
    });

    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-900">
          {/* Col 1: Band Brand */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-900 border border-amber-500/30 flex items-center justify-center p-0.5 shadow-lg shadow-orange-950/40">
                {bandInfo.logoUrl ? (
                  <img
                    src={bandInfo.logoUrl}
                    alt={bandInfo.name}
                    className="w-full h-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-amber-500 font-black text-xs">JSB</span>
                )}
              </div>
              <span className="text-xl font-black tracking-wider text-white">
                {bandInfo.name}
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm whitespace-pre-line">
              {bandInfo.tagline}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={bandInfo.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors border border-zinc-800"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={bandInfo.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors border border-zinc-800"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={bandInfo.socialLinks.spotify}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors border border-zinc-800"
                title="Spotify"
              >
                <Radio className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#historia" className="hover:text-white transition-colors">História da Banda</a></li>
              <li><a href="#integrantes" className="hover:text-white transition-colors">Integrantes</a></li>
              <li><a href="#shows" className="hover:text-white transition-colors">Agenda de Shows</a></li>
              <li><a href="#fotos" className="hover:text-white transition-colors">Galeria de Fotos</a></li>
              <li><a href="#videos" className="hover:text-white transition-colors">Vídeos no YouTube</a></li>
              <li><a href="#streaming" className="hover:text-white transition-colors">Músicas & Áudios</a></li>
            </ul>
          </div>

          {/* Col 3: Portal Access Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Áreas Restritas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => openAuthModal('admin')}
                  className="hover:text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Painel Administrativo</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openAuthModal('contractor')}
                  className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Área do Contratante</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openAuthModal('fan')}
                  className="hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Fã Clube</span>
                </button>
              </li>
              <li>
                <a href="#contratacoes" className="hover:text-white transition-colors">
                  Solicitar Cotação
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Newsletter & Lançamentos
            </h4>
            <p className="text-xs text-zinc-400">
              Receba anúncios de turnês, pré-vendas e lançamentos exclusivos de clipes.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                ✓ Inscrição confirmada! E-mail de boas-vindas enviado.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Seu melhor e-mail"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow transition-colors cursor-pointer"
                >
                  Inscrever
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Reset Defaults */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            © 2026 {bandInfo.name}. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={resetAllDataToDefault}
              className="text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1 hover:underline cursor-pointer"
              title="Restaurar dados de exemplo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Dados Demo</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
