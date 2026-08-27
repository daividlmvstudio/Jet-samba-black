import React, { useState } from 'react';
import { useBand } from '../context/BandContext';
import { Users, Music, Wrench, Instagram, Youtube, Edit2, Trash2, X, Check, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { BandMember } from '../types';

export const MembersSection: React.FC = () => {
  const { members, updateMember, deleteMember, userRole, setActiveView } = useBand();
  const [selectedMember, setSelectedMember] = useState<BandMember | null>(null);
  const [editingMember, setEditingMember] = useState<BandMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<BandMember | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    nickname: string;
    role: string;
    instruments: string;
    photo: string;
    bio: string;
    gear: string;
    instagram: string;
  }>({
    name: '',
    nickname: '',
    role: '',
    instruments: '',
    photo: '',
    bio: '',
    gear: '',
    instagram: ''
  });

  const handleOpenEdit = (member: BandMember) => {
    setEditingMember(member);
    setEditForm({
      name: member.name,
      nickname: member.nickname || '',
      role: member.role,
      instruments: Array.isArray(member.instruments) ? member.instruments.join(', ') : (member.instruments || ''),
      photo: member.photo || '',
      bio: member.bio || '',
      gear: member.gear || '',
      instagram: member.socials?.instagram || ''
    });
    setSelectedMember(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const instrumentsArray = editForm.instruments.split(',').map((i) => i.trim()).filter(Boolean);

    updateMember(editingMember.id, {
      name: editForm.name,
      nickname: editForm.nickname || editForm.name.split(' ')[0],
      role: editForm.role,
      instruments: instrumentsArray,
      photo: editForm.photo,
      bio: editForm.bio,
      gear: editForm.gear,
      socials: {
        ...editingMember.socials,
        instagram: editForm.instagram
      }
    });

    setEditingMember(null);
  };

  return (
    <section id="integrantes" className="py-24 bg-zinc-950 text-zinc-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Formação Oficial</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Integrantes da Banda
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Quatro mentes criativas unidas pela paixão pela música ao vivo, timbres marcantes e energia explosiva nos palcos.
          </p>
        </div>

        {/* Members Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -6 }}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group transition-all duration-300 hover:border-rose-500/40 hover:shadow-rose-950/20"
            >
              {/* Member Photo */}
              <div className="relative h-80 w-full overflow-hidden bg-zinc-950">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />

                {/* Nickname Badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30">
                    "{member.nickname}"
                  </span>
                </div>

                {/* Admin Quick Controls (Only visible when logged in as admin) */}
                {userRole === 'admin' && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(member);
                      }}
                      className="p-2 rounded-lg bg-black/80 backdrop-blur-md text-amber-300 hover:text-amber-200 border border-amber-500/50 hover:border-amber-400 transition-colors shadow-lg cursor-pointer"
                      title="Editar informações deste integrante (Admin)"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMemberToDelete(member);
                      }}
                      className="p-2 rounded-lg bg-black/80 backdrop-blur-md text-rose-400 hover:text-rose-300 border border-rose-500/50 hover:border-rose-400 transition-colors shadow-lg cursor-pointer"
                      title="Excluir integrante (Admin)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {member.name}
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-rose-400 mt-0.5">
                    {member.role}
                  </p>

                  <p className="text-xs text-zinc-300 mt-3 line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Instruments Tags */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/80">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1 mb-1.5">
                      <Music className="w-3 h-3 text-amber-400" />
                      Instrumentos:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(member.instruments) ? member.instruments : [member.instruments]).map((inst, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-zinc-950 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800"
                        >
                          {inst}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gear Specs & Action */}
                <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Wrench className="w-3 h-3 text-rose-400" />
                      <span>Setup</span>
                    </button>
                    {userRole === 'admin' && (
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 hover:underline cursor-pointer ml-2"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {member.socials?.instagram && (
                      <a
                        href={member.socials.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-rose-400 transition-colors p-1"
                        title="Instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {member.socials?.youtube && (
                      <a
                        href={member.socials.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-red-400 transition-colors p-1"
                        title="YouTube"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Member Gear Modal */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl relative"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedMember.photo}
                    alt={selectedMember.name}
                    className="w-16 h-16 rounded-xl object-cover border border-zinc-700 bg-zinc-950"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-white">{selectedMember.name}</h4>
                    <p className="text-xs text-rose-400">{selectedMember.role}</p>
                    {selectedMember.nickname && (
                      <span className="text-[10px] text-amber-300">"{selectedMember.nickname}"</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                    <Wrench className="w-4 h-4" />
                    <span>Setup & Equipamentos de Palco (Gear)</span>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed font-mono">
                    {selectedMember.gear || 'Setup sob consulta técnica da produção.'}
                  </p>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {selectedMember.bio}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between pt-3 border-t border-zinc-800">
                {userRole === 'admin' ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(selectedMember)}
                      className="px-3.5 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const m = selectedMember;
                        setSelectedMember(null);
                        setMemberToDelete(m);
                      }}
                      className="px-3.5 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Excluir este integrante (Admin)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>
                ) : (
                  <div />
                )}

                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Direct Edit Member Modal */}
        {editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl my-8 relative"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Editar Integrante</h4>
                    <p className="text-xs text-zinc-400">Atualize qualquer informação de {editingMember.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                {/* Foto Preview & URL */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">URL da Foto</label>
                  <div className="flex gap-2">
                    <img
                      src={editForm.photo}
                      alt="Preview"
                      className="w-12 h-14 object-cover rounded-lg border border-zinc-700 bg-zinc-950 shrink-0"
                    />
                    <input
                      type="url"
                      required
                      value={editForm.photo}
                      onChange={(e) => setEditForm({ ...editForm, photo: e.target.value })}
                      className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Apelido / Nickname</label>
                    <input
                      type="text"
                      value={editForm.nickname}
                      onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Função Principal</label>
                  <input
                    type="text"
                    required
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Instrumentos (separados por vírgula)</label>
                  <input
                    type="text"
                    value={editForm.instruments}
                    onChange={(e) => setEditForm({ ...editForm, instruments: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Equipamentos & Setup Técnico (Gear)</label>
                  <input
                    type="text"
                    value={editForm.gear}
                    onChange={(e) => setEditForm({ ...editForm, gear: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Instagram (URL)</label>
                  <input
                    type="url"
                    value={editForm.instagram}
                    onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Biografia Resumida</label>
                  <textarea
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-amber-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-xs font-black shadow-lg shadow-amber-950/50 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Salvar Alterações</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Member Confirmation Modal */}
        {memberToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-6 text-zinc-100 shadow-2xl relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Excluir Integrante</h4>
                  <p className="text-xs text-zinc-400">Esta ação removerá o músico da banda</p>
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center gap-3 mb-5">
                <img
                  src={memberToDelete.photo}
                  alt={memberToDelete.name}
                  className="w-12 h-14 object-cover rounded-lg border border-zinc-700"
                />
                <div>
                  <p className="text-sm font-bold text-white">{memberToDelete.name}</p>
                  <p className="text-xs text-rose-400">{memberToDelete.role}</p>
                  {memberToDelete.nickname && (
                    <span className="text-[10px] text-amber-300">"{memberToDelete.nickname}"</span>
                  )}
                </div>
              </div>

              <p className="text-xs text-zinc-300 mb-6">
                Tem certeza que deseja excluir <strong>{memberToDelete.name}</strong> da formação da banda? Os dados serão apagados.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setMemberToDelete(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteMember(memberToDelete.id);
                    setMemberToDelete(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-950/50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Confirmar Exclusão</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};
