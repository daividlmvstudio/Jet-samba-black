import React, { useState } from 'react';
import { useBand } from '../context/BandContext';
import {
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Download,
  CheckCircle,
  FileText,
  Send,
  Sparkles,
  Users,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { BookingRequest } from '../types';

export const BookingSection: React.FC = () => {
  const { bandInfo, createBooking, currentUser, openAuthModal } = useBand();

  const [formData, setFormData] = useState({
    contractorName: currentUser?.name || '',
    contractorEmail: currentUser?.email || '',
    contractorPhone: '',
    companyOrOrg: currentUser?.company || '',
    eventType: 'festival' as BookingRequest['eventType'],
    eventDate: '',
    eventCity: '',
    eventState: 'SP',
    venueName: '',
    estimatedAudience: '1.000 a 3.000 pessoas',
    budgetOffer: 'R$ 45.000,00',
    technicalStructureProvided: true,
    notes: ''
  });

  const [submittedBooking, setSubmittedBooking] = useState<BookingRequest | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contractorName || !formData.contractorEmail || !formData.eventDate) return;

    const created = createBooking({
      contractorName: formData.contractorName,
      contractorEmail: formData.contractorEmail,
      contractorPhone: formData.contractorPhone,
      companyOrOrg: formData.companyOrOrg,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      eventCity: formData.eventCity || 'São Paulo',
      eventState: formData.eventState,
      venueName: formData.venueName || 'Espaço de Eventos',
      estimatedAudience: formData.estimatedAudience,
      budgetOffer: formData.budgetOffer,
      technicalStructureProvided: formData.technicalStructureProvided,
      notes: formData.notes
    });

    setSubmittedBooking(created);
  };

  const handleDownloadRider = () => {
    // Generate text/rider file content
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
    <section id="contratacoes" className="py-24 bg-zinc-900/80 text-zinc-100 border-t border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Booking & Contratações</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Leve o Show do {bandInfo.name} para a Sua Cidade
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Festivais, casas de show, eventos corporativos e prefeituras. Solicite uma proposta e receba retorno oficial com notificação por e-mail em até 24 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contacts & Rider Download */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-zinc-950/90 border border-zinc-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Contatos Oficiais da Produção</span>
              </h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Atendimento direto com a gerência artística e assessoria de imprensa da banda.
              </p>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <Mail className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] uppercase font-bold text-zinc-500">E-mail de Booking</div>
                    <a href={`mailto:${bandInfo.contactInfo.email}`} className="text-zinc-200 font-semibold hover:text-white">
                      {bandInfo.contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] uppercase font-bold text-zinc-500">Telefone / WhatsApp Produção</div>
                    <span className="text-zinc-200 font-semibold font-mono">
                      {bandInfo.contactInfo.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <Briefcase className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] uppercase font-bold text-zinc-500">Gerência de Turnê</div>
                    <span className="text-zinc-300 font-medium">
                      {bandInfo.contactInfo.bookingManager}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rider Técnico Button */}
              <div className="mt-8 pt-6 border-t border-zinc-800">
                <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                    <FileText className="w-4 h-4" />
                    <span>Rider Técnico & Mapa de Palco (2026)</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Especificações completas de P.A., microfonação, iluminação e camarim para técnicos de áudio e produtores.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadRider}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-zinc-700 hover:border-zinc-500"
                >
                  <Download className="w-4 h-4 text-rose-400" />
                  <span>Baixar Rider Técnico & Mapa de Palco (.TXT)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Proposal Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-zinc-950/90 border border-zinc-800 shadow-2xl relative">
              {submittedBooking ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Solicitação de Show Enviada com Sucesso!
                  </h3>
                  <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                    Sua proposta para o evento em <strong>{submittedBooking.eventCity}/{submittedBooking.eventState}</strong> foi registrada sob o protocolo oficial:
                  </p>

                  <div className="inline-block p-4 bg-zinc-900 border-2 border-dashed border-emerald-500/60 rounded-xl my-4">
                    <span className="text-2xl font-mono font-black text-emerald-400 tracking-wider">
                      {submittedBooking.protocolNumber}
                    </span>
                  </div>

                  <div className="bg-zinc-900/90 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-400 max-w-md mx-auto text-left space-y-1.5">
                    <p className="text-white font-semibold flex items-center gap-1.5 text-emerald-400">
                      <Mail className="w-3.5 h-3.5" />
                      Disparos de E-mail Automáticos Concluídos:
                    </p>
                    <p>• Notificação enviada para a gerência da banda (<code>booking@auroraeclipse.com.br</code>)</p>
                    <p>• Confirmação e cópia enviadas para <code>{submittedBooking.contractorEmail}</code></p>
                  </div>

                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => setSubmittedBooking(null)}
                      className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Enviar Nova Solicitação
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-zinc-800 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-white">Formulário de Cotação de Show</h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Preencha os dados do seu evento para gerarmos uma proposta técnica e comercial.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Nome do Responsável *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: João da Silva"
                        value={formData.contractorName}
                        onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Empresa / Produtora / Órgão
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Live Fest Produções"
                        value={formData.companyOrOrg}
                        onChange={(e) => setFormData({ ...formData, companyOrOrg: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        E-mail de Contato *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: contratante@eventos.com"
                        value={formData.contractorEmail}
                        onChange={(e) => setFormData({ ...formData, contractorEmail: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: (11) 98765-4321"
                        value={formData.contractorPhone}
                        onChange={(e) => setFormData({ ...formData, contractorPhone: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Tipo de Evento *
                      </label>
                      <select
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value as BookingRequest['eventType'] })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500 cursor-pointer"
                      >
                        <option value="festival">Festival Aberto</option>
                        <option value="venue">Casa de Shows / Club</option>
                        <option value="corporate">Corporativo / Empresa</option>
                        <option value="city_hall">Prefeitura / Edital</option>
                        <option value="wedding">Casamento / Particular</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Data Prevista *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Público Estimado
                      </label>
                      <select
                        value={formData.estimatedAudience}
                        onChange={(e) => setFormData({ ...formData, estimatedAudience: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-rose-500 cursor-pointer"
                      >
                        <option value="Até 500 pessoas">Até 500 pessoas</option>
                        <option value="500 a 1.500 pessoas">500 a 1.500 pessoas</option>
                        <option value="1.500 a 5.000 pessoas">1.500 a 5.000 pessoas</option>
                        <option value="+ de 5.000 pessoas">+ de 5.000 pessoas</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Cidade e Estado do Evento *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Cidade"
                          value={formData.eventCity}
                          onChange={(e) => setFormData({ ...formData, eventCity: e.target.value })}
                          className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                        />
                        <input
                          type="text"
                          maxLength={2}
                          placeholder="UF"
                          value={formData.eventState}
                          onChange={(e) => setFormData({ ...formData, eventState: e.target.value.toUpperCase() })}
                          className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-100 text-center font-bold uppercase focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                        Local / Espaço do Show
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Arena Principal ou Teatro"
                        value={formData.venueName}
                        onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Proposta de Cachê Estimado
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: R$ 45.000,00 a R$ 60.000,00"
                      value={formData.budgetOffer}
                      onChange={(e) => setFormData({ ...formData, budgetOffer: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-bold placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Detalhes Adicionais ou Observações Técnicas
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Informações sobre palco, horário do show, artistas que dividirão a noite..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm tracking-wide shadow-xl shadow-rose-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6 hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Solicitação Oficial & Disparar Notificação</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
