// ==========================================
// GigGuards — Buy Policy Page (Premium)
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../engine/SimulationContext';
import { calculatePremium, getRiskLevel } from '../engine/riskEngine';
import { POLICIES, PRICING_HISTORY } from '../engine/mockData';
import AnimatedCounter from '../components/AnimatedCounter';
import PremiumCard from '../components/PremiumCard';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
    HiOutlineShieldCheck,
    HiOutlineCheckCircle,
    HiOutlineXMark,
    HiOutlineSparkles,
    HiOutlineArrowTrendingUp,
    HiOutlineArrowTrendingDown,
    HiOutlineClock,
} from 'react-icons/hi2';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.5 },
    }),
};

function getBuyIndicator(riskScore) {
    if (riskScore < 0.4) return { label: 'Great time to buy!', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: HiOutlineArrowTrendingDown };
    if (riskScore < 0.6) return { label: 'Fair pricing', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: HiOutlineClock };
    return { label: 'Prices rising — act now', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: HiOutlineArrowTrendingUp };
}

export default function BuyPolicyPage() {
    const { riskScore, activePolicy, selectPolicy, demoMode } = useSimulation();
    const [selectedPlan, setSelectedPlan] = useState(activePolicy);
    const [showModal, setShowModal] = useState(false);
    const buyIndicator = getBuyIndicator(riskScore);
    const BuyIcon = buyIndicator.icon;

    const handlePurchase = (planId) => {
        setSelectedPlan(planId);
        setShowModal(true);
        selectPolicy(planId);
    };

    return (
        <div className={`min-h-screen pb-12 px-4 ${demoMode ? 'pt-24' : 'pt-20'}`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">
                        Insurance Plans
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">
                        Choose Your <span className="gradient-text">Shield</span>
                    </h1>
                    <p className="text-gray-400 mt-3 max-w-lg mx-auto">
                        Select a plan that matches your risk profile and coverage needs
                    </p>
                </motion.div>

                {/* Best Time to Buy Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`max-w-md mx-auto mb-8 p-3 rounded-xl border flex items-center justify-center gap-2 ${buyIndicator.bg}`}
                >
                    <BuyIcon className={`w-4 h-4 ${buyIndicator.color}`} />
                    <span className={`text-sm font-medium ${buyIndicator.color}`}>{buyIndicator.label}</span>
                </motion.div>

                {/* Plan Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {POLICIES.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            custom={i}
                            className={`relative glass-card p-8 flex flex-col transition-all duration-300 group hover:scale-[1.02]
                                ${selectedPlan === plan.id ? 'border-primary-500/50 glow-purple' : 'hover:border-white/20'}
                                ${plan.popular ? 'ring-2 ring-primary-500/30' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                        <HiOutlineSparkles className="w-3 h-3" />
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-3xl mb-3">{plan.icon}</div>
                            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                            <p className="text-gray-400 text-sm mt-1 mb-4">{plan.description}</p>

                            <div className="mb-6">
                                <span className="text-3xl font-bold text-white">₹{plan.basePrice}</span>
                                <span className="text-gray-400 text-sm">/week</span>
                            </div>

                            {/* Coverage items */}
                            <div className="space-y-2 mb-6 flex-1">
                                {['Heavy Rain', 'AQI Spike', 'Flood', 'Curfew'].map((item) => {
                                    const included = plan.coverage.includes(item);
                                    return (
                                        <div key={item} className="flex items-center gap-2 text-sm">
                                            {included ? (
                                                <HiOutlineCheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                            ) : (
                                                <HiOutlineXMark className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                            )}
                                            <span className={included ? 'text-gray-300' : 'text-gray-600'}>{item}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="text-xs text-gray-400 mb-4">
                                Max payout: <span className="text-white font-semibold">₹{plan.maxPayout}</span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handlePurchase(plan.id)}
                                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300
                                    ${selectedPlan === plan.id
                                        ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-500/25'
                                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                {selectedPlan === plan.id ? '✓ Current Plan' : 'Select Plan'}
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                {/* Pricing Trend + Calculator */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Pricing Trend */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <HiOutlineArrowTrendingUp className="w-5 h-5 text-primary-400" />
                            7-Day Pricing Trend
                        </h3>
                        <p className="text-gray-400 text-xs mb-4">
                            Premium changes based on city-wide risk conditions
                        </p>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={PRICING_HISTORY}>
                                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                                    <YAxis stroke="#6b7280" fontSize={12} domain={['dataMin - 5', 'dataMax + 5']} />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(15, 10, 26, 0.9)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            padding: '8px 12px',
                                        }}
                                        labelStyle={{ color: '#fff', fontSize: '12px' }}
                                        itemStyle={{ color: '#a78bfa', fontSize: '12px' }}
                                        formatter={(value) => [`₹${value}`, 'Premium']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="premium"
                                        stroke="#6C2BD9"
                                        strokeWidth={2}
                                        dot={{ fill: '#6C2BD9', r: 4 }}
                                        activeDot={{ r: 6, fill: '#9333ea' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                    {/* Premium Card Link */}
                    <PremiumCard />
                </div>
            </div>

            {/* Purchase Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] px-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-card p-8 max-w-md w-full text-center glow-purple"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                                className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
                            >
                                <HiOutlineCheckCircle className="w-10 h-10 text-emerald-400" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-white mb-2">Policy Activated! 🎉</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Your <span className="text-primary-300 font-medium">{POLICIES.find(p => p.id === selectedPlan)?.name}</span> plan
                                is now active. You&apos;re protected against income disruptions.
                            </p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn-primary w-full"
                            >
                                Got it!
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
