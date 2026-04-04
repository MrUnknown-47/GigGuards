// ==========================================
// GigShield AI — Simulation Panel (Enhanced)
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../engine/SimulationContext';
import { TRIGGER_TYPES } from '../engine/mockData';
import {
    HiOutlineBolt,
    HiOutlineAdjustmentsHorizontal,
    HiOutlinePlayCircle,
} from 'react-icons/hi2';

export default function SimulationPanel() {
    const { simulateEvent, isSimulating, simulatingType, sliders, setSliders, demoMode } = useSimulation();
    const [mode, setMode] = useState('sliders'); // 'sliders' | 'triggers'

    const triggers = Object.entries(TRIGGER_TYPES);

    const sliderConfigs = [
        {
            key: 'rainMM',
            label: 'Rainfall',
            icon: '🌧️',
            unit: 'mm',
            min: 0,
            max: 100,
            threshold: 60,
            color: 'from-blue-500 to-cyan-500',
            trackColor: 'bg-blue-500',
        },
        {
            key: 'aqiLevel',
            label: 'Air Quality (AQI)',
            icon: '😷',
            unit: '',
            min: 0,
            max: 500,
            threshold: 400,
            color: 'from-yellow-500 to-orange-500',
            trackColor: 'bg-yellow-500',
        },
        {
            key: 'trafficPercent',
            label: 'Traffic Density',
            icon: '🚗',
            unit: '%',
            min: 0,
            max: 100,
            threshold: 80,
            color: 'from-red-500 to-pink-500',
            trackColor: 'bg-red-500',
        },
    ];

    return (
        <div className="glass-card p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <HiOutlineBolt className="w-5 h-5 text-primary-400" />
                    <h3 className="font-semibold text-white">Simulation</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 font-medium uppercase tracking-wider">
                        Live
                    </span>
                </div>
            </div>

            {/* Toggle Tabs */}
            <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-4">
                <button
                    onClick={() => setMode('sliders')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${mode === 'sliders'
                            ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <HiOutlineAdjustmentsHorizontal className="w-3.5 h-3.5" />
                    Sliders
                </button>
                <button
                    onClick={() => setMode('triggers')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${mode === 'triggers'
                            ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <HiOutlinePlayCircle className="w-3.5 h-3.5" />
                    Triggers
                </button>
            </div>

            <AnimatePresence mode="wait">
                {mode === 'sliders' ? (
                    /* Slider Mode */
                    <motion.div
                        key="sliders"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-5"
                    >
                        {sliderConfigs.map((config) => {
                            const value = sliders[config.key];
                            const isAboveThreshold = value >= config.threshold;
                            const percentage = ((value - config.min) / (config.max - config.min)) * 100;

                            return (
                                <div key={config.key}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-400 flex items-center gap-1.5">
                                            <span>{config.icon}</span>
                                            {config.label}
                                        </span>
                                        <span className={`text-sm font-bold ${isAboveThreshold ? 'text-red-400' : 'text-white'}`}>
                                            {value}{config.unit}
                                            {isAboveThreshold && (
                                                <span className="text-[9px] ml-1 text-red-400 animate-pulse">⚠ TRIGGER</span>
                                            )}
                                        </span>
                                    </div>

                                    {/* Custom slider track */}
                                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r ${config.color}`}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.15 }}
                                        />
                                        {/* Threshold marker */}
                                        <div
                                            className="absolute top-0 bottom-0 w-0.5 bg-white/30"
                                            style={{ left: `${((config.threshold - config.min) / (config.max - config.min)) * 100}%` }}
                                        />
                                    </div>

                                    <input
                                        type="range"
                                        min={config.min}
                                        max={config.max}
                                        value={value}
                                        onChange={(e) => setSliders({ [config.key]: parseInt(e.target.value) })}
                                        className="w-full h-2 opacity-0 absolute mt-[-10px] cursor-pointer"
                                        style={{ position: 'relative', marginTop: '-10px' }}
                                    />

                                    <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                                        <span>{config.min}{config.unit}</span>
                                        <span className="text-gray-500">Threshold: {config.threshold}{config.unit}</span>
                                        <span>{config.max}{config.unit}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                ) : (
                    /* Trigger Mode */
                    <motion.div
                        key="triggers"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="grid grid-cols-2 gap-3"
                    >
                        {triggers.map(([key, config]) => {
                            const isActive = isSimulating && simulatingType === key;
                            return (
                                <motion.button
                                    key={key}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => !isSimulating && simulateEvent(key)}
                                    disabled={isSimulating}
                                    className={`relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300
                                        ${isActive
                                            ? `bg-gradient-to-br ${config.bgClass} ${config.borderClass} glow-purple`
                                            : `bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20`
                                        }
                                        ${isSimulating && !isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                >
                                    <div className="text-2xl mb-2">{config.icon}</div>
                                    <div className="font-medium text-sm text-white">{config.label}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">₹{config.payout} payout</div>

                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    )}

                                    {isActive && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="text-[11px] text-gray-500 mt-4 text-center">
                {mode === 'sliders' ? 'Adjust values to see risk changes in real-time' : 'Click to simulate disruption events'}
            </p>
        </div>
    );
}
