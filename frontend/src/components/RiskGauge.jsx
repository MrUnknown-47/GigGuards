// ==========================================
// GigShield AI — Risk Gauge Component
// ==========================================

import { motion } from 'framer-motion';
import { getRiskLevel } from '../engine/riskEngine';

export default function RiskGauge({ score, size = 180 }) {
    const riskLevel = getRiskLevel(score);
    const percentage = score * 100;
    const circumference = 2 * Math.PI * 70; // radius = 70
    const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75; // 270 degrees

    const getGradientColors = () => {
        if (score < 0.3) return ['#10B981', '#34D399'];
        if (score < 0.5) return ['#F59E0B', '#FBBF24'];
        if (score < 0.7) return ['#F97316', '#FB923C'];
        return ['#EF4444', '#F87171'];
    };

    const [color1, color2] = getGradientColors();

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 160 160"
                    className="transform -rotate-[135deg]"
                >
                    {/* Background arc */}
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * 0.25}
                    />
                    {/* Foreground arc */}
                    <defs>
                        <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={color1} />
                            <stop offset="100%" stopColor={color2} />
                        </linearGradient>
                    </defs>
                    <motion.circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="url(#riskGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-3xl font-bold text-white"
                    >
                        {score.toFixed(2)}
                    </motion.span>
                    <span className={`text-xs font-medium ${riskLevel.color}`}>
                        {riskLevel.label} Risk
                    </span>
                </div>
            </div>
        </div>
    );
}
