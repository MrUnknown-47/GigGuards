// ==========================================
// GigGuards — Login Page (Premium)
// ==========================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../engine/AuthContext';
import {
    HiOutlineShieldCheck,
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeSlash,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineArrowRight,
    HiOutlineSparkles,
} from 'react-icons/hi2';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, error, isLoading, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result) {
            setShowSuccess(true);
            setTimeout(() => {
                navigate(result.role === 'admin' ? '/admin' : '/register');
            }, 1500);
        }
    };

    const fillDemoCredentials = (type) => {
        clearError();
        if (type === 'worker') {
            setEmail('raj@gigguard.ai');
            setPassword('demo123');
        } else {
            setEmail('admin@gigguard.ai');
            setPassword('demo123');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
            {/* Animated background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[150px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary-400/40 rounded-full"
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 50 - 25, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 4 + Math.random() * 3,
                        repeat: Infinity,
                        delay: i * 0.8,
                    }}
                    style={{
                        left: `${15 + Math.random() * 70}%`,
                        top: `${30 + Math.random() * 40}%`,
                    }}
                />
            ))}

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="relative w-full max-w-md"
            >
                <AnimatePresence mode="wait">
                    {showSuccess ? (
                        /* Success State */
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-10 text-center glow-purple"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                                className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
                            >
                                <HiOutlineCheckCircle className="w-10 h-10 text-emerald-400" />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl font-bold text-white mb-2"
                            >
                                Welcome Back! 🎉
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-gray-400"
                            >
                                Redirecting to your dashboard...
                            </motion.p>
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1.2, delay: 0.3, ease: 'linear' }}
                                className="h-1 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full mt-6 origin-left"
                            />
                        </motion.div>
                    ) : (
                        /* Login Form */
                        <motion.div
                            key="form"
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card p-8 md:p-10"
                        >
                            {/* Logo */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30"
                                >
                                    <HiOutlineShieldCheck className="w-9 h-9 text-white" />
                                </motion.div>
                                <h1 className="text-2xl font-bold text-white">
                                    Welcome to <span className="gradient-text">GigGuards</span>
                                </h1>
                                <p className="text-gray-400 text-sm mt-2">
                                    Sign in to access your dashboard
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label className="text-xs text-gray-400 font-medium mb-1.5 block uppercase tracking-wider">
                                        Email
                                    </label>
                                    <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'email'
                                            ? 'border-primary-500/50 bg-primary-500/5 shadow-lg shadow-primary-500/10'
                                            : 'border-white/10 bg-white/5'
                                        }`}>
                                        <HiOutlineEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-primary-400' : 'text-gray-500'
                                            }`} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); clearError(); }}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="you@gigshield.ai"
                                            required
                                            className="w-full bg-transparent pl-12 pr-4 py-3.5 text-white text-sm outline-none placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="text-xs text-gray-400 font-medium mb-1.5 block uppercase tracking-wider">
                                        Password
                                    </label>
                                    <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'password'
                                            ? 'border-primary-500/50 bg-primary-500/5 shadow-lg shadow-primary-500/10'
                                            : 'border-white/10 bg-white/5'
                                        }`}>
                                        <HiOutlineLockClosed className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-primary-400' : 'text-gray-500'
                                            }`} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); clearError(); }}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Enter your password"
                                            required
                                            className="w-full bg-transparent pl-12 pr-12 py-3.5 text-white text-sm outline-none placeholder:text-gray-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? (
                                                <HiOutlineEyeSlash className="w-5 h-5" />
                                            ) : (
                                                <HiOutlineEye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Error Message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, y: -10, height: 0 }}
                                            className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                                        >
                                            <HiOutlineExclamationCircle className="w-4 h-4 flex-shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading || !email || !password}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className={`w-full py-4 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all duration-300 ${isLoading
                                            ? 'bg-primary-500/50 cursor-wait'
                                            : 'bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-400 hover:to-purple-400 shadow-lg shadow-primary-500/25 hover:shadow-primary-400/40'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isLoading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                            />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <HiOutlineArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-6">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Demo Accounts</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            {/* Quick Login Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => fillDemoCredentials('worker')}
                                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"
                                >
                                    <HiOutlineSparkles className="w-4 h-4" />
                                    Worker Login
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => fillDemoCredentials('admin')}
                                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-medium hover:bg-primary-500/20 transition-all"
                                >
                                    <HiOutlineSparkles className="w-4 h-4" />
                                    Admin Login
                                </motion.button>
                            </div>

                            <p className="text-center text-[11px] text-gray-600 mt-4">
                                Password for all demo accounts: <span className="text-gray-400 font-mono">demo123</span>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
