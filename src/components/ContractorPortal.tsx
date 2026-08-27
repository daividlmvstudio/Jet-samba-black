import React, { useState } from 'react';
import { useBand } from '../context/BandContext';
import {
  Briefcase,
  Calendar,
  Clock,
  Download,
  FileText,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { BookingRequest } from '../types';

export const ContractorPortal: React.FC = () => {
  const {
    bandInfo,
    currentUser,
    bookings,
    createBooking,
    setActiveView,
    setEmailModalOpen,
    unreadEmailCount
  } = useBand();

  const [showNewBookingModal, setShowNewBookingModal] = useState(false);

  // Filter bookings for this contractor if email matches, or show sample ones
  const myBookings = bookings.filter(
    b => b.contractorEmail.toLowerCase() === (currentUser?.email?.toLowerCase() || '') || b.contractorName.toLowerCase().includes('produtora')
  );

  const displayedBookings = myBookings.length > 0 ? myBookings : bookings;

  const [formData, setFormData] = useState({
    contractorName: currentUser?.name || 'Produtora Parceira',
    contractorEmail: currentUser?.email || 'eventos@produtora.com.br',
    contractorPhone: '(11) 98765-4321',
    companyOrOrg: currentUser?.company || 'Live Fest Shows',
    eventType: 'festival' as BookingRequest['eventType'],
    eventDate: '2026-11-20',
    eventCity: 'Curitiba',
    eventState: 'PR',
    venueName: 'Pedreira Paulo Leminski',
    estimatedAudience: '10.000 pessoas',
    budgetOffer: 'R$ 75.000,00',
    technicalStructureProvided: true,
    notes: 'Festival de Primavera com 4 bandas principais. Passagem de som às 16h.'
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    createBooking({
      ...formData,
      contractorName: formData.contractorName,
      contractorEmail: formData.contractorEmail
    });
    setShowNewBookingModal(false);
  };

  const handleDownloadRider = () => {
    const riderText = `================================================
${bandInfo.name.toUpperCase()} - RIDER TÉCNICO & MAPA DE PALCO OFICIAL (2026)
================================================
GERÊNCIA ARTÍSTICA: ${bandInfo.contactInfo.bookingManager}
CONTATO: ${bandInfo.contactInfo.email} | ${bandInfo.contactInfo.phone}

1. FORMAÇÃO DE PALCO:
- Iuri Campos: Bateria & Percussão Brasileira (Microfonação padrão 8 canais + pads estéreo)
- Gabriel Silveira: Voz Principal + Violão / Guitarra Base (Amplificador valvulado + Mic Shure Beta 58A)
- Sofia Drummond: Guitarra Solo / Cavaquinho + Backing Vocals (Amplificador valvulado + Direct Box Estéreo)
- Mateus Rocha: Baixo Elétrico + Synth Bass (Direct Box Ativo + Cabeçote 500W+)

2. SISTEMA DE SOM (P.A.):
- Line Array com resposta de frequência linear de 35Hz a 20kHz dimensionado para a lotação do espaço.
- Sistema de In-Ear Monitor (IEM) estéreo sem fio para todos os integrantes (fornecido pela banda).

3. CAMARIM & HOSPEDAGEM:
- Camarim climatizado e seguro para 8 pessoas (banda + equipe técnica).
- Água mineral, frutas frescas, café e alimentação leve.

Documento emitido para contratações JET OFICIAL ${new Date().getFullYear()}.
================================================`;

    const blob = new Blob([riderText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rider_Tecnico_JET_SAMBA_BLACK_${new Date().getFullYear()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      {/* Top Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveView('public')}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Voltar ao site público"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">Portal do Contratante & Produtor</h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentUser?.company || 'Contratante Verificado'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Acompanhe o status de propostas, minutas de contrato e especificações técnicas de palco
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setEmailModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-2 border border-zinc-700 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Meus E-mails & Notificações</span>
              {unreadEmailCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  {unreadEmailCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowNewBookingModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Proposta de Show</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        {/* Top Info Banner & Rider Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Atendimento Prioritário à Produção</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Contratações & Logística JET OFICIAL {new Date().getFullYear()}
              </h3>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                Todas as propostas enviadas recebem número de protocolo e notificação automática para os e-mails da produção da banda e do contratante.
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <span>📞 Telefone: <strong>{bandInfo.contactInfo.phone}</strong></span>
              <span>✉️ E-mail: <strong>{bandInfo.contactInfo.email}</strong></span>
            </div>
          </div>

          {/* Quick Technical Rider Download */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <FileText className="w-4 h-4" />
                <span>Material Técnico</span>
              </div>
              <h4 className="text-base font-bold text-white">Rider Técnico & Mapa de Palco</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Documento atualizado com canais de P.A., microfones e iluminação.
              </p>
            </div>

            <button
              onClick={handleDownloadRider}
              className="mt-4 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-zinc-700 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Baixar Rider Oficial (.TXT)</span>
            </button>
          </div>
        </div>

        {/* Contractor's Proposals List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Minhas Solicitações de Show & Cotações</h3>
            <span className="text-xs text-zinc-400">{displayedBookings.length} registro(s)</span>
          </div>

          <div className="space-y-4">
            {displayedBookings.map((booking) => (
              <div
                key={booking.id}
                className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 hover:border-zinc-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-mono font-black text-emerald-400">
                      {booking.protocolNumber}
                    </span>
                    <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-zinc-800 text-zinc-200">
                      {booking.eventType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-mono">Data Prevista:</span>
                    <strong className="text-white font-mono text-sm">{booking.eventDate}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 uppercase font-bold">Local do Show:</span>
                    <p className="text-white font-semibold text-sm">{booking.venueName}</p>
                    <p className="text-zinc-400">{booking.eventCity}/{booking.eventState}</p>
                    <p className="text-zinc-400">Público: {booking.estimatedAudience}</p>
                  </div>

                  <div>
                    <span className="text-zinc-500 uppercase font-bold">Proposta de Cachê:</span>
                    <p className="text-emerald-400 font-bold text-sm">{booking.budgetOffer}</p>
                    <p className="text-zinc-400">
                      Rider: {booking.technicalStructureProvided ? 'Fornecido pelo local' : 'Sob consulta'}
                    </p>
                  </div>

                  <div>
                    <span className="text-zinc-500 uppercase font-bold">Status da Produção:</span>
                    <div className="mt-1">
                      {booking.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          ⏳ Aguardando Análise
                        </span>
                      )}
                      {booking.status === 'analyzing' && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          🔍 Em Análise Técnica
                        </span>
                      )}
                      {booking.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ Show Aprovado & Confirmado
                        </span>
                      )}
                      {booking.status === 'declined' && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          ✕ Data Indisponível
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {booking.adminResponse && (
                  <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                    <strong className="block text-emerald-300">Resposta da Gerência da Banda:</strong>
                    <p>{booking.adminResponse}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: New Booking */}
      {showNewBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl">
            <h4 className="text-lg font-bold text-white mb-4">Nova Cotação de Show</h4>
            <form onSubmit={handleCreateBooking} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300">Data do Evento</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300">Tipo de Evento</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value as BookingRequest['eventType'] })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                  >
                    <option value="festival">Festival</option>
                    <option value="venue">Casa de Shows</option>
                    <option value="corporate">Corporativo</option>
                    <option value="city_hall">Prefeitura</option>
                    <option value="wedding">Particular</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-zinc-300">Cidade</label>
                  <input
                    type="text"
                    required
                    value={formData.eventCity}
                    onChange={(e) => setFormData({ ...formData, eventCity: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300">UF</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formData.eventState}
                    onChange={(e) => setFormData({ ...formData, eventState: e.target.value.toUpperCase() })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">Local / Casa de Eventos</label>
                <input
                  type="text"
                  required
                  value={formData.venueName}
                  onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">Proposta de Cachê</label>
                <input
                  type="text"
                  required
                  value={formData.budgetOffer}
                  onChange={(e) => setFormData({ ...formData, budgetOffer: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300">Observações Técnicas</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewBookingModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  Enviar Proposta Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
