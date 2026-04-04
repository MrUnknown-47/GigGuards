// ==========================================
// GigGuards — Worker Dashboard (Premium)
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../engine/SimulationContext';
import GigShieldAPI from '../engine/api';
import { calculatePremium, getRiskLevel } from '../engine/riskEngine';
import RiskGauge from '../components/RiskGauge';
import SimulationPanel from '../components/SimulationPanel';
import TierBadge from '../components/TierBadge';
import AnimatedCounter from '../components/AnimatedCounter';
import { EARNINGS_DATA, TRIGGER_TYPES, PLATFORM_WORKERS } from '../engine/mockData';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
    HiOutlineBanknotes,
    HiOutlineChartBar,
    HiOutlineShieldCheck,
    HiOutlineClock,
    HiOutlineDocumentText,
    HiOutlineCpuChip,
    HiOutlineSparkles,
    HiOutlineLightBulb,
    HiOutlineSignal,
    HiOutlineChevronDown,
    HiOutlineChevronUp,
} from 'react-icons/hi2';


const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
    }),
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-3 text-xs">
                <p className="text-white font-medium">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }}>
                        {p.name}: ₹{p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function WorkerDashboard() {
    const { worker: defaultWorkerObj, riskScore, premium, tier, claims, totalPayouts, activityFeed, aiPredictions, demoMode } = useSimulation();
    
    // Check local storage for dynamic API verified worker profile, otherwise fallback to static mock mapping
    const storedProfile = localStorage.getItem('verifiedWorkerProfile');
    let worker = defaultWorkerObj;
    
    if (storedProfile) {
        try {
            worker = JSON.parse(storedProfile);
        } catch (e) {
            console.error("Failed to parse verified worker profile");
        }
    } else {
        const storedId = localStorage.getItem('verifiedWorkerId');
        if (storedId && PLATFORM_WORKERS[storedId]) {
            worker = PLATFORM_WORKERS[storedId];
        }
    }

    const riskLevel = getRiskLevel(riskScore);
    const [showExplainability, setShowExplainability] = useState(false);
    const [isTriggering, setIsTriggering] = useState(false);
    
    // Live ML trigger endpoint test
    const triggerClaim = async () => {
        setIsTriggering(true);
        try {
            const { data, ok } = await GigShieldAPI.triggerClaim({
                daily_income: worker.dailyEarning || 1200,
                rainfall: 80,
                aqi: 250,
                traffic: 90
            });
            
            if (ok) {
                alert(`Payout Verified: ₹${data.payout_amount}\nTrigger: ${data.trigger_reason}`);
            } else {
                alert(`Claim Rejected or Failed: ${data.message || 'Fraud detected / Unmet param'}`);
            }
        } catch (error) {
            console.error("Failed to connect to API", error);
            alert("API connection failed.");
        } finally {
            setIsTriggering(false);
        }
    };

    const recentClaims = claims.slice(0, 5);
    const thisWeekPayouts = claims
        .filter((c) => c.status === 'paid')
        .slice(0, 3)
        .reduce((sum, c) => sum + c.payout, 0);

    const protectedEarnings = totalPayouts + worker.dailyEarning * 30;

    const statCards = [
        {
            icon: HiOutlineShieldCheck,
            label: 'Protected Earnings',
            value: protectedEarnings,
            prefix: '₹',
            sub: 'Total coverage value',
            color: 'from-emerald-500 to-teal-500',
            glow: 'shadow-emerald-500/20',
        },
        {
            icon: HiOutlineChartBar,
            label: 'Total Payouts',
            value: totalPayouts,
            prefix: '₹',
            sub: `${claims.filter(c => c.status === 'paid').length} claims paid`,
            color: 'from-primary-500 to-purple-500',
            glow: 'shadow-primary-500/20',
        },
        {
            icon: HiOutlineBanknotes,
            label: 'Weekly Premium',
            value: premium,
            prefix: '₹',
            sub: `Risk: ${riskScore.toFixed(2)}`,
            color: 'from-amber-500 to-orange-500',
            glow: 'shadow-amber-500/20',
        },
        {
            icon: HiOutlineClock,
            label: 'This Week',
            value: thisWeekPayouts,
            prefix: '₹',
            sub: 'Payouts received',
            color: 'from-blue-500 to-cyan-500',
            glow: 'shadow-blue-500/20',
        },
    ];

    const prediction = aiPredictions.tomorrow;

    return (
        <div className={`min-h-screen pb-12 px-4 ${demoMode ? 'pt-24' : 'pt-20'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Welcome back, <span className="gradient-text">{worker.name}</span> 👋
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">
                                {worker.city} · {worker.platform} · {worker.totalDeliveries} deliveries
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <motion.button 
                                onClick={triggerClaim}
                                disabled={isTriggering}
                                className={`px-4 py-2 border rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${isTriggering ? 'bg-primary-500/20 border-primary-500/20 text-primary-500/50 cursor-wait' : 'bg-primary-500/10 border-primary-500/30 text-primary-400 hover:bg-primary-500/20 hover:scale-[1.02]'}`}
                            >
                                {isTriggering ? 'Evaluating...' : 'Test Trigger'}
                            </motion.button>
                            <TierBadge tier={tier} size="lg" />
                        </div>
                    </div>
                </motion.div>

                {/* Stat Cards with Animated Counters */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            custom={i}
                            className={`stat-card shadow-lg ${stat.glow} group hover:scale-[1.02] transition-transform duration-300`}
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <div className="text-2xl font-bold text-white mt-1">
                                <AnimatedCounter value={stat.value} prefix={stat.prefix} duration={1.5} />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Chart + Activity Feed + Claims */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Earnings Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card p-6"
                        >
                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <HiOutlineChartBar className="w-5 h-5 text-primary-400" />
                                Earnings vs Payouts
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={EARNINGS_DATA}>
                                        <defs>
                                            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6C2BD9" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6C2BD9" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorPayouts" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="earnings"
                                            stroke="#6C2BD9"
                                            fillOpacity={1}
                                            fill="url(#colorEarnings)"
                                            strokeWidth={2}
                                            name="Earnings"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="payouts"
                                            stroke="#10B981"
                                            fillOpacity={1}
                                            fill="url(#colorPayouts)"
                                            strokeWidth={2}
                                            name="Payouts"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* AI Prediction Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="glass-card p-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-full" />
                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <HiOutlineCpuChip className="w-5 h-5 text-primary-400" />
                                AI Risk Forecast
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                                    Tomorrow
                                </span>
                            </h3>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Risk Level</p>
                                    <p className="text-lg font-bold text-red-400">{prediction.riskLevel}</p>
                                </div>
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Expected Loss</p>
                                    <p className="text-lg font-bold text-amber-400">₹{prediction.expectedLoss}</p>
                                </div>
                                <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3 text-center">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Confidence</p>
                                    <p className="text-lg font-bold text-primary-400">{prediction.confidence}%</p>
                                </div>
                            </div>

                            {/* Risk Factors */}
                            <div className="space-y-2 mb-4">
                                {prediction.factors.map((factor, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400 w-24 truncate">{factor.name}</span>
                                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${factor.probability}%` }}
                                                transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                                                className={`h-full rounded-full ${factor.impact === 'high' ? 'bg-red-500' :
                                                        factor.impact === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                                    }`}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400 w-8 text-right">{factor.probability}%</span>
                                    </div>
                                ))}
                            </div>

                            {/* AI Recommendation */}
                            <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3 flex items-start gap-2">
                                <HiOutlineLightBulb className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-primary-300">{prediction.recommendation}</p>
                            </div>
                        </motion.div>

                        {/* Real-time Activity Feed */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass-card p-6"
                        >
                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <HiOutlineSignal className="w-5 h-5 text-primary-400" />
                                Live Activity Feed
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            </h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                                <AnimatePresence initial={false}>
                                    {activityFeed.slice(0, 8).map((event) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, x: -20, height: 0 }}
                                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                                            transition={{ duration: 0.3 }}
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${event.isNew ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-white/5'
                                                }`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-300 truncate">{event.message}</p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">{event.timestamp} · {event.city}</p>
                                            </div>
                                            {event.payout && (
                                                <span className="text-xs font-semibold text-emerald-400 flex-shrink-0">
                                                    +₹{event.payout}
                                                </span>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Recent Claims with Explainability */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="glass-card p-6"
                        >
                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <HiOutlineDocumentText className="w-5 h-5 text-primary-400" />
                                Recent Claims
                            </h3>
                            <div className="space-y-3">
                                {recentClaims.map((claim, i) => {
                                    const trigger = TRIGGER_TYPES[claim.type];
                                    return (
                                        <div key={claim.id}>
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * i }}
                                                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                                                onClick={() => setShowExplainability(showExplainability === claim.id ? false : claim.id)}
                                            >
                                                <div className="text-2xl">{trigger?.icon || '📋'}</div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-white truncate">{claim.description}</p>
                                                    <p className="text-xs text-gray-400">{claim.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-emerald-400">+₹{claim.payout}</p>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                                                        ${claim.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                                                            claim.status === 'flagged' ? 'bg-red-500/20 text-red-400' :
                                                                'bg-yellow-500/20 text-yellow-400'}`}
                                                    >
                                                        {claim.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="text-gray-500">
                                                    {showExplainability === claim.id ? (
                                                        <HiOutlineChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <HiOutlineChevronDown className="w-4 h-4" />
                                                    )}
                                                </div>
                                            </motion.div>

                                            {/* Explainability Card */}
                                            <AnimatePresence>
                                                {showExplainability === claim.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-2 ml-12 p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-purple-500/5 border border-primary-500/20">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <HiOutlineSparkles className="w-4 h-4 text-primary-400" />
                                                                <span className="text-xs font-semibold text-primary-300">Why this payout?</span>
                                                            </div>
                                                            <div className="space-y-2 text-xs text-gray-400">
                                                                <p>• <span className="text-white">{trigger?.label}</span> event detected at {claim.date}</p>
                                                                {claim.triggerValue && (
                                                                    <p>• Trigger value: <span className="text-white">{claim.triggerValue}{claim.type === 'rain' ? 'mm' : ''}</span> (threshold: {claim.type === 'rain' ? '60mm' : '400 AQI'})</p>
                                                                )}
                                                                <p>• Payout calculated: <span className="text-emerald-400 font-medium">₹{claim.payout}</span> based on your {tier} tier</p>
                                                                <p>• Fraud check: <span className="text-emerald-400">{claim.status === 'flagged' ? 'Flagged for review' : 'Passed ✓'}</span></p>
                                                                <p>• Processing time: <span className="text-white">&lt;30 seconds</span></p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Risk Gauge + Simulation */}
                    <div className="space-y-6">
                        {/* Risk Score */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card p-6"
                        >
                            <h3 className="font-semibold text-white mb-4 text-center">Risk Score</h3>
                            <RiskGauge score={riskScore} />
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="text-center p-3 rounded-xl bg-white/5">
                                    <p className="text-xs text-gray-400">Premium</p>
                                    <p className="text-lg font-bold text-white">₹{premium}<span className="text-xs text-gray-400">/wk</span></p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-white/5">
                                    <p className="text-xs text-gray-400">Risk Level</p>
                                    <p className={`text-lg font-bold ${riskLevel.color}`}>{riskLevel.label}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Simulation Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <SimulationPanel />
                        </motion.div>

                        {/* AI Smart Recommendations */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="glass-card p-6"
                        >
                            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <HiOutlineSparkles className="w-5 h-5 text-primary-400" />
                                Smart Tips
                            </h3>
                            <div className="space-y-3">
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <p className="text-xs text-emerald-300 font-medium">💡 Increase coverage now</p>
                                    <p className="text-[11px] text-gray-400 mt-1">Premium is 12% lower than average — great time to upgrade</p>
                                </div>
                                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <p className="text-xs text-amber-300 font-medium">⚡ Monsoon alert</p>
                                    <p className="text-[11px] text-gray-400 mt-1">Heavy rain forecasted next week — ensure full coverage</p>
                                </div>
                                <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
                                    <p className="text-xs text-primary-300 font-medium">📊 Claim efficiency</p>
                                    <p className="text-[11px] text-gray-400 mt-1">Your avg payout time: 24s — 20% faster than average</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
