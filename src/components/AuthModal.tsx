import React, { useState } from 'react';
import { useBand } from '../context/BandContext';
import { UserRole } from '../types';
import { X, ShieldCheck, Briefcase, Star, Lock, Mail, ArrowRight, User as UserIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, closeAuthModal, loginAsDemoUser, loginCustom } = useBand();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    loginCustom(emailInput, selectedRole, nameInput || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-zinc-100 relative"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-wide text-white">
                  {activeTab === 'login' ? 'Acesso ao Portal Oficial' : 'Criar Nova Conta'}
                </h3>
                <p className="text-xs text-zinc-400">
                  Selecione seu perfil de acesso para continuar
                </p>
              </div>
            </div>

            <button
              onClick={closeAuthModal}
              className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Demo Selector Fast Buttons */}
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Acesso Rápido de Demonstração (1 Clique):
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemoUser('admin')}
                className="p-2.5 bg-rose-950/40 border border-rose-500/40 hover:border-rose-400 hover:bg-rose-900/50 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5 group-hover:text-zinc-200">
                  Gestão Geral
                </p>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemoUser('contractor')}
                className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-900/50 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Contratante</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5 group-hover:text-zinc-200">
                  Rider & Shows
                </p>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemoUser('fan')}
                className="p-2.5 bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-900/50 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <Star className="w-3.5 h-3.5" />
                  <span>Fã VIP</span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5 group-hover:text-zinc-200">
                  Mural & Votos
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Role Type Selector Pills */}
        <div className="p-6">
          <div className="mb-5">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Tipo de Perfil
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-900/30'
                    : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('contractor')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedRole === 'contractor'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/30'
                    : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Contratante</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('fan')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedRole === 'fan'
                    ? 'bg-amber-500 text-zinc-950 font-extrabold border-amber-400 shadow-md shadow-amber-900/30'
                    : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Fã Clube</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'register' && selectedRole === 'contractor' && (
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Empresa / Produtora de Eventos</label>
                <input
                  type="text"
                  placeholder="Nome da sua produtora ou agência"
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl py-2.5 px-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">E-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder={
                    selectedRole === 'admin'
                      ? 'admin@banda.com'
                      : selectedRole === 'contractor'
                      ? 'produtor@eventos.com'
                      : 'fa@clube.com'
                  }
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-900/30 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{activeTab === 'login' ? 'Entrar no Painel' : 'Cadastrar e Entrar'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between login / register */}
          <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
            {activeTab === 'login' ? (
              <p className="text-xs text-zinc-400">
                Não possui conta ainda?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-rose-400 hover:text-rose-300 font-semibold underline cursor-pointer"
                >
                  Cadastre-se gratuitamente
                </button>
              </p>
            ) : (
              <p className="text-xs text-zinc-400">
                Já possui cadastro?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-rose-400 hover:text-rose-300 font-semibold underline cursor-pointer"
                >
                  Faça login aqui
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
