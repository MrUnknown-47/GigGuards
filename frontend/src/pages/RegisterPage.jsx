import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GigShieldAPI from '../engine/api';
import {
    HiOutlineBriefcase,
    HiOutlineIdentification,
    HiOutlineShieldCheck,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineArrowRight,
    HiOutlineStar
} from 'react-icons/hi2';
import { PLATFORM_WORKERS } from '../engine/mockData';

export default function RegisterPage() {
    const navigate = useNavigate();
    
    // Form state
    const [platform, setPlatform] = useState('Zepto');
    const [workerId, setWorkerId] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    
    // Lifecycle state
    const [isVerifying, setIsVerifying] = useState(false);
    const [verifiedWorker, setVerifiedWorker] = useState(null);
    const [error, setError] = useState(null);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!workerId.trim()) return;
        
        setError(null);
        setIsVerifying(true);
        
        try {
            const { data } = await GigShieldAPI.verifyWorker(workerId);
            
            if (data.platform !== platform) {
                throw new Error("Provider mismatch. Make sure you select the correct platform dropdown.");
            }

            const workerProfile = {
                id: workerId,
                name: data.name,
                platform: data.platform,
                city: data.city,
                dailyEarning: data.daily_income,
                rating: 4.8, 
                tier: "verified"
            };
            
            setVerifiedWorker(workerProfile);
            localStorage.setItem('verifiedWorkerId', workerId);
            localStorage.setItem('verifiedWorkerProfile', JSON.stringify(workerProfile));
        } catch (err) {
            setError(err.message || "An unexpected error occurred during API verification.");
            console.error(err);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleContinue = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen py-24 px-4 relative overflow-hidden flex items-center justify-center">
            {/* Animated background layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[150px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="relative w-full max-w-md z-10"
            >
                <div className="glass-card p-8 md:p-10 relative overflow-hidden">
                    {/* Header */}
                    <div className="text-center mb-8 relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30"
                        >
                            {verifiedWorker ? (
                                <HiOutlineCheckCircle className="w-9 h-9 text-white" />
                            ) : (
                                <HiOutlineShieldCheck className="w-9 h-9 text-white" />
                            )}
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {verifiedWorker ? 'Verification Complete' : 'Platform Link'}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {verifiedWorker 
                                ? 'Your profile has been successfully synced.' 
                                : 'Connect your platform to compute your risk baselines.'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {!verifiedWorker ? (
                            <motion.form
                                key="verify-form"
                                exit={{ opacity: 0, x: -20 }}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleVerify}
                                className="space-y-5 relative z-10"
                            >
                                {/* Platform Dropdown */}
                                <div>
                                    <label className="text-xs text-gray-400 font-medium mb-1.5 block uppercase tracking-wider">
                                        Platform
                                    </label>
                                    <div className="relative rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                                        <HiOutlineBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                                        <select
                                            value={platform}
                                            onChange={(e) => {setPlatform(e.target.value); setError(null);}}
                                            className="w-full bg-transparent pl-12 pr-4 py-3.5 text-white text-sm outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="Zepto" className="bg-dark-600 text-white">Zepto</option>
                                            <option value="Blinkit" className="bg-dark-600 text-white">Blinkit</option>
                                            <option value="Swiggy" className="bg-dark-600 text-white">Swiggy</option>
                                            <option value="Amazon Flex" className="bg-dark-600 text-white">Amazon Flex</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Worker ID Entry */}
                                <div>
                                    <label className="text-xs text-gray-400 font-medium mb-1.5 block uppercase tracking-wider">
                                        Worker ID
                                    </label>
                                    <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'workerId'
                                            ? 'border-primary-500/50 bg-primary-500/5 shadow-lg shadow-primary-500/10'
                                            : 'border-white/10 bg-white/5'
                                        }`}>
                                        <HiOutlineIdentification className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'workerId' ? 'text-primary-400' : 'text-gray-500'
                                            }`} />
                                        <input
                                            type="text"
                                            value={workerId}
                                            onChange={(e) => {setWorkerId(e.target.value.toUpperCase()); setError(null);}}
                                            onFocus={() => setFocusedField('workerId')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Enter ID (e.g. ZEPT123)"
                                            required
                                            className="w-full bg-transparent pl-12 pr-4 py-3.5 text-white text-sm outline-none placeholder:text-gray-600 uppercase"
                                        />
                                    </div>
                                </div>

                                {/* Error Output */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, y: -10, height: 0 }}
                                            className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                                        >
                                            <HiOutlineExclamationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                            <span>{error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Action Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isVerifying || !workerId}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className={`w-full py-4 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all duration-300 mt-4 ${isVerifying
                                            ? 'bg-primary-500/50 cursor-wait'
                                            : 'bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-400 hover:to-purple-400 shadow-lg shadow-primary-500/25 hover:shadow-primary-400/40'
                                        } disabled:opacity-50`}
                                >
                                    {isVerifying ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                            />
                                            Securely Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify Identity
                                            <HiOutlineArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6 relative z-10"
                            >
                                {/* Verified Worker Render Box */}
                                <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 backdrop-blur-md">
                                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/10">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xl font-bold text-white shadow-inner">
                                            {verifiedWorker.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold text-lg leading-tight">{verifiedWorker.name}</h3>
                                            <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">{verifiedWorker.tier} Tier</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                                        <div>
                                            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Platform</p>
                                            <p className="text-white font-medium">{verifiedWorker.platform}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">City</p>
                                            <p className="text-white font-medium">{verifiedWorker.city}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Daily Avg</p>
                                            <p className="text-white font-medium">₹{verifiedWorker.dailyEarning}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Rating</p>
                                            <div className="flex items-center gap-1 text-white font-medium">
                                                {verifiedWorker.rating}
                                                <HiOutlineStar className="w-4 h-4 text-amber-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    onClick={handleContinue}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25"
                                >
                                    Continue to Dashboard
                                    <HiOutlineArrowRight className="w-4 h-4" />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}