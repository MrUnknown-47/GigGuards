"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShieldCheck, HiOutlineSparkles } from 'react-icons/hi2';
import AnimatedCounter from './AnimatedCounter';
import GigShieldAPI from '../engine/api';

export default function PremiumCard() {
    const [premium, setPremium] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    
    // Dynamic input state for interactivity
    const [stats, setStats] = useState({
        rainfall: 70,
        aqi: 300,
        temperature: 30,
        traffic: 2
    });

    const getPremium = async () => {
        setIsCalculating(true);
        try {
            const { data } = await GigShieldAPI.getPremium(
                stats.rainfall, 
                stats.aqi, 
                stats.temperature, 
                stats.traffic
            );
            setPremium(data);
        } catch (error) {
            console.error("Failed to fetch premium:", error);
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="glass-card p-6 border-primary-500/20 glow-purple relative overflow-hidden h-full flex flex-col justify-between"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-[50px] pointer-events-none" />
            
            <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 relative z-10">
                    <HiOutlineShieldCheck className="w-5 h-5 text-primary-400" />
                    Live ML Actuary
                </h3>
                <p className="text-gray-400 text-xs mb-6 relative z-10">
                    Connects directly to the Python FastAPI risk-pricing endpoints. Use sliders to trigger dynamic premiums.
                </p>

                {/* Granular Actuarial Triggers */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-6 relative z-10">
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2 flex justify-between">
                            Rainfall
                            <span className="text-blue-400">{stats.rainfall}mm</span>
                        </label>
                        <input 
                            type="range" min="0" max="200" 
                            value={stats.rainfall}
                            onChange={(e) => setStats({...stats, rainfall: e.target.value})}
                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2 flex justify-between">
                            Air Quality (AQI)
                            <span className="text-amber-400">{stats.aqi}</span>
                        </label>
                        <input 
                            type="range" min="0" max="500" 
                            value={stats.aqi}
                            onChange={(e) => setStats({...stats, aqi: e.target.value})}
                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2 flex justify-between">
                            Traffic Delay %
                            <span className="text-red-400">{stats.traffic}%</span>
                        </label>
                        <input 
                            type="range" min="0" max="100" 
                            value={stats.traffic}
                            onChange={(e) => setStats({...stats, traffic: e.target.value})}
                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-400 [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2 flex justify-between">
                            Temperature
                            <span className="text-orange-400">{stats.temperature}°C</span>
                        </label>
                        <input 
                            type="range" min="-10" max="55" 
                            value={stats.temperature}
                            onChange={(e) => setStats({...stats, temperature: e.target.value})}
                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-400 [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={getPremium}
                    disabled={isCalculating}
                    className={`w-full py-3 mb-4 rounded-xl font-bold text-white shadow-lg text-sm flex items-center justify-center gap-2 transition-all duration-300 ${isCalculating ? 'bg-primary-500/50 cursor-wait' : 'bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-400 hover:to-purple-500 shadow-primary-500/30'}`}
                >
                    {isCalculating ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                    ) : (
                        <>Calculate Premium <HiOutlineSparkles className="w-4 h-4" /></>
                    )}
                </motion.button>

                <AnimatePresence>
                    {premium && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 text-center overflow-hidden"
                        >
                            <p className="text-xs text-primary-300 mb-1 font-semibold uppercase tracking-wider">Computed Actuarial Premium</p>
                            <div className="flex items-center justify-center gap-2">
                               <div className="text-3xl font-bold text-white relative z-10 drop-shadow-md">
                                   <AnimatedCounter value={premium.weekly_premium} prefix="₹" duration={0.8} />
                                   <span className="text-sm text-primary-200/80 font-medium tracking-wide">/week</span>
                               </div>
                            </div>
                            <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-primary-500/20 text-[10px] text-primary-300 font-semibold tracking-wide">
                                Baseline Risk Vector: {(premium.risk_score * 100).toFixed(1)}%
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
