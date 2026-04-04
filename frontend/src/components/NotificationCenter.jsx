// ==========================================
// GigShield AI — Notification Center Dropdown
// ==========================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../engine/SimulationContext';
import {
    HiOutlineBell,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
    HiOutlineXMark,
    HiOutlineTrash,
} from 'react-icons/hi2';

export default function NotificationCenter() {
    const { notifications, dismissNotification } = useSimulation();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    const unreadCount = notifications.length;

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
                <HiOutlineBell className="w-5 h-5 text-gray-400" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden rounded-2xl bg-dark-300/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <h3 className="text-sm font-semibold text-white">Notifications</h3>
                            {notifications.length > 0 && (
                                <button
                                    onClick={() => notifications.forEach(n => dismissNotification(n.id))}
                                    className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
                                >
                                    <HiOutlineTrash className="w-3 h-3" />
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto max-h-72">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <HiOutlineBell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notif) => {
                                    const isSuccess = notif.type === 'success';
                                    return (
                                        <motion.div
                                            key={notif.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-start gap-3 p-3 border-b border-white/5 hover:bg-white/5 transition-colors group"
                                        >
                                            <div className={`mt-0.5 rounded-full p-1 flex-shrink-0 ${isSuccess ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                                                {isSuccess ? (
                                                    <HiOutlineCheckCircle className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <HiOutlineExclamationTriangle className="w-4 h-4 text-amber-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-medium ${isSuccess ? 'text-emerald-300' : 'text-amber-300'}`}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{notif.message}</p>
                                                <p className="text-[10px] text-gray-600 mt-0.5">{notif.timestamp}</p>
                                            </div>
                                            <button
                                                onClick={() => dismissNotification(notif.id)}
                                                className="text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <HiOutlineXMark className="w-3.5 h-3.5" />
                                            </button>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
