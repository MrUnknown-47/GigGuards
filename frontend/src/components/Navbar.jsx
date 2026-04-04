// ==========================================
// GigShield AI — Navbar (Enhanced)
// ==========================================

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../engine/SimulationContext';
import { useAuth } from '../engine/AuthContext';
import NotificationCenter from './NotificationCenter';
import {
    HiOutlineShieldCheck,
    HiOutlineArrowRightOnRectangle,
    HiOutlinePlayCircle,
    HiOutlineBars3,
    HiOutlineXMark,
} from 'react-icons/hi2';

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    // { path: '/admin', label: 'Admin' },
    { path: '/buy-policy', label: 'Buy Policy' },
    { path: '/claims', label: 'Claims' },
];

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { demoMode, toggleDemoMode } = useSimulation();
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-0 left-0 right-0 z-50 bg-dark-500/80 backdrop-blur-xl border-b border-white/5"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-400 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-400/50 transition-shadow">
                                <HiOutlineShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">
                                Gig<span className="gradient-text">Shield</span>
                                <span className="text-primary-400 text-xs ml-1 font-medium">AI</span>
                            </span>
                        </Link>

                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                            ${isActive
                                                ? 'text-white'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-indicator"
                                                className="absolute inset-0 bg-primary-500/20 border border-primary-500/30 rounded-lg"
                                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-2">
                            {/* Demo Mode Toggle */}
                            <motion.button
                                onClick={toggleDemoMode}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${demoMode
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <HiOutlinePlayCircle className="w-4 h-4" />
                                {demoMode ? 'Demo ON' : 'Demo'}
                                {demoMode && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                            </motion.button>

                            {/* Notification Center */}
                            <NotificationCenter />

                            {/* User Avatar */}
                            {user && (
                                <div className="hidden sm:flex items-center gap-2 ml-1 pl-2 border-l border-white/10">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-400 flex items-center justify-center text-[10px] font-bold text-white">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="text-xs font-medium text-white leading-tight">{user.name}</p>
                                        <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
                                    </div>
                                </div>
                            )}

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-red-400"
                                title="Logout"
                            >
                                <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                            </button>

                            {/* Mobile menu */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400"
                            >
                                {mobileOpen ? (
                                    <HiOutlineXMark className="w-5 h-5" />
                                ) : (
                                    <HiOutlineBars3 className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed top-16 left-0 right-0 z-40 bg-dark-400/95 backdrop-blur-xl border-b border-white/10 md:hidden"
                    >
                        <div className="p-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === link.path
                                            ? 'bg-primary-500/20 text-primary-300'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-2 border-t border-white/10 mt-2">
                                <button
                                    onClick={() => { toggleDemoMode(); setMobileOpen(false); }}
                                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5"
                                >
                                    <HiOutlinePlayCircle className="w-4 h-4" />
                                    {demoMode ? 'Stop Demo Mode' : 'Start Demo Mode'}
                                </button>
                                <button
                                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10"
                                >
                                    <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
