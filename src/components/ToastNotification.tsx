import React from 'react';
import { useBand } from '../context/BandContext';
import { CheckCircle2, Mail, Info, AlertCircle, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useBand();

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isEmail = toast.type === 'email';
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="pointer-events-auto bg-zinc-900/95 border border-zinc-700/80 backdrop-blur-md text-white rounded-xl shadow-2xl p-4 flex items-start space-x-3 transition-all"
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'email' && <Mail className="w-5 h-5 text-amber-400 animate-bounce" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                  {toast.title}
                </p>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed line-clamp-2">
                  {toast.message}
                </p>
                {toast.actionText && toast.onAction && (
                  <button
                    onClick={() => {
                      toast.onAction?.();
                      removeToast(toast.id);
                    }}
                    className="mt-2 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer underline underline-offset-2"
                  >
                    <span>{toast.actionText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800"
                aria-label="Fechar notificação"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
