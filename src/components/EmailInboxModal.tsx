import React, { useState } from 'react';
import { useBand } from '../context/BandContext';
import { Mail, MailOpen, Trash2, X, Clock, User, Shield, CheckCheck, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EmailNotification } from '../types';

export const EmailInboxModal: React.FC = () => {
  const {
    emailModalOpen,
    setEmailModalOpen,
    emails,
    markEmailAsRead,
    deleteEmail,
    selectedEmailForView,
    setSelectedEmailForView
  } = useBand();

  const [activeFilter, setActiveFilter] = useState<'all' | 'admin' | 'contractor' | 'fan'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!emailModalOpen) return null;

  const filteredEmails = emails.filter(email => {
    if (activeFilter !== 'all' && email.recipientType !== activeFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        email.subject.toLowerCase().includes(q) ||
        email.recipientName.toLowerCase().includes(q) ||
        email.recipientEmail.toLowerCase().includes(q) ||
        email.previewText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelectEmail = (email: EmailNotification) => {
    setSelectedEmailForView(email);
    if (!email.read) {
      markEmailAsRead(email.id);
    }
  };

  const getRecipientBadge = (type: EmailNotification['recipientType']) => {
    switch (type) {
      case 'admin':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Banda / Admin</span>;
      case 'contractor':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Contratante</span>;
      case 'fan':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Fã Clube VIP</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-5xl h-[85vh] max-h-[750px] shadow-2xl flex flex-col overflow-hidden text-zinc-100"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-wide">Central de Notificações por E-mail</h2>
                <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
                  {emails.length} mensagens
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Simulador dos disparos automáticos para Administrador, Contratantes e Fãs
              </p>
            </div>
          </div>

          <button
            onClick={() => setEmailModalOpen(false)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="px-6 py-3 border-b border-zinc-800 bg-zinc-900/90 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-zinc-100 text-zinc-900 font-bold'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
              }`}
            >
              Todos ({emails.length})
            </button>
            <button
              onClick={() => setActiveFilter('admin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'admin'
                  ? 'bg-rose-500 text-white'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-rose-300'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Banda / Admin ({emails.filter(e => e.recipientType === 'admin').length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('contractor')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'contractor'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-emerald-300'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Contratantes ({emails.filter(e => e.recipientType === 'contractor').length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('fan')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'fan'
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-amber-300'
              }`}
            >
              <span>⭐ Fãs VIP ({emails.filter(e => e.recipientType === 'fan').length})</span>
            </button>
          </div>

          <div className="w-full sm:w-56">
            <input
              type="text"
              placeholder="Buscar e-mails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-zinc-950 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Modal Body: Split view (List & Preview) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Email List */}
          <div className={`w-full md:w-5/12 border-r border-zinc-800 overflow-y-auto ${selectedEmailForView ? 'hidden md:block' : 'block'}`}>
            {filteredEmails.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">
                <MailOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Nenhum e-mail encontrado neste filtro.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60">
                {filteredEmails.map((email) => {
                  const isSelected = selectedEmailForView?.id === email.id;
                  return (
                    <div
                      key={email.id}
                      onClick={() => handleSelectEmail(email)}
                      className={`p-4 cursor-pointer transition-colors relative group ${
                        isSelected
                          ? 'bg-zinc-800/90 border-l-4 border-rose-500'
                          : email.read
                          ? 'bg-zinc-900/40 hover:bg-zinc-800/50'
                          : 'bg-zinc-800/40 hover:bg-zinc-800/70'
                      }`}
                    >
                      {!email.read && (
                        <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                      )}

                      <div className="flex items-center justify-between mb-1.5 pr-4">
                        <div className="flex items-center gap-2">
                          {getRecipientBadge(email.recipientType)}
                        </div>
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {email.sentAt}
                        </span>
                      </div>

                      <h4 className={`text-sm tracking-tight mb-1 truncate ${email.read ? 'text-zinc-200 font-normal' : 'text-white font-semibold'}`}>
                        {email.subject}
                      </h4>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {email.previewText}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Para: <strong className="text-zinc-400">{email.recipientName}</strong></span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEmail(email.id);
                              if (selectedEmailForView?.id === email.id) {
                                setSelectedEmailForView(null);
                              }
                            }}
                            className="p-1 text-zinc-400 hover:text-rose-400 rounded hover:bg-zinc-700"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Email Reader Pane */}
          <div className={`w-full md:w-7/12 flex flex-col bg-zinc-950/70 overflow-hidden ${!selectedEmailForView ? 'hidden md:flex' : 'flex'}`}>
            {selectedEmailForView ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Email Header */}
                <div className="p-5 border-b border-zinc-800 bg-zinc-900/60">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setSelectedEmailForView(null)}
                      className="md:hidden text-xs text-rose-400 hover:underline flex items-center gap-1"
                    >
                      ← Voltar à lista
                    </button>
                    <div className="flex items-center gap-2">
                      {getRecipientBadge(selectedEmailForView.recipientType)}
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {selectedEmailForView.sentAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteEmail(selectedEmailForView.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition-colors"
                        title="Excluir e-mail"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {selectedEmailForView.subject}
                  </h3>

                  <div className="text-xs text-zinc-400 space-y-1 bg-zinc-950 p-3 rounded-lg border border-zinc-800/80">
                    <div className="flex items-center justify-between">
                      <span><strong>De:</strong> Sistema Oficial Aurora Eclipse &lt;notificacoes@auroraeclipse.com.br&gt;</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCheck className="w-3.5 h-3.5" /> Entregue
                      </span>
                    </div>
                    <div>
                      <strong>Para:</strong> {selectedEmailForView.recipientName} &lt;{selectedEmailForView.recipientEmail}&gt;
                    </div>
                  </div>
                </div>

                {/* Email HTML Content Body */}
                <div className="flex-1 p-6 overflow-y-auto bg-zinc-950/40">
                  <div
                    className="email-render-wrapper rounded-xl overflow-hidden shadow-lg border border-zinc-800"
                    dangerouslySetInnerHTML={{ __html: selectedEmailForView.htmlContent }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-zinc-500">
                <Mail className="w-12 h-12 mb-3 text-zinc-600" />
                <p className="text-base font-semibold text-zinc-400">Selecione um e-mail para visualizar</p>
                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                  Veja a prévia real das mensagens e notificações disparadas automaticamente pelo sistema.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
