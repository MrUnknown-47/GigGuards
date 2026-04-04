// ==========================================
// GigShield AI — Notification Toast
// ==========================================

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../engine/SimulationContext';
import { HiOutlineCheckCircle, HiOutlineExclamationTriangle, HiOutlineXMark } from 'react-icons/hi2';

export default function NotificationToast() {
    const { notifications, dismissNotification } = useSimulation();
    const latest = notifications[0];

    useEffect(() => {
        if (latest) {
            const timer = setTimeout(() => {
                dismissNotification(latest.id);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [latest, dismissNotification]);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
            <AnimatePresence>
                {latest && (
                    <motion.div
                        key={latest.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={`glass-card p-4 shadow-2xl shadow-black/50 flex items-start gap-3 border ${latest.type === 'success'
                                ? 'border-emerald-500/30'
                                : 'border-amber-500/30'
                            }`}
                    >
                        <div className={`rounded-full p-1 flex-shrink-0 ${latest.type === 'success' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                            }`}>
                            {latest.type === 'success' ? (
                                <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400" />
                            ) : (
                                <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${latest.type === 'success' ? 'text-emerald-300' : 'text-amber-300'
                                }`}>{latest.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{latest.message}</p>
                        </div>
                        <button
                            onClick={() => dismissNotification(latest.id)}
                            className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                        >
                            <HiOutlineXMark className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
