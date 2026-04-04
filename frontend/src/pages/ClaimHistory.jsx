// ==========================================
// GigGuards — Claim History Page (Premium)
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../engine/SimulationContext';
import { TRIGGER_TYPES } from '../engine/mockData';
import SimulationPanel from '../components/SimulationPanel';
import AnimatedCounter from '../components/AnimatedCounter';
import {
    HiOutlineFunnel,
    HiOutlineDocumentText,
    HiOutlineArrowPath,
} from 'react-icons/hi2';

const filters = ['all', 'rain', 'aqi', 'flood', 'curfew'];
const statusFilters = ['all', 'paid', 'flagged', 'pending'];

export default function ClaimHistory() {
    const { claims, demoMode } = useSimulation();
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredClaims = claims.filter((claim) => {
        const matchType = typeFilter === 'all' || claim.type === typeFilter;
        const matchStatus = statusFilter === 'all' || claim.status === statusFilter;
        return matchType && matchStatus;
    });

    const totalPaid = claims.filter(c => c.status === 'paid').reduce((s, c) => s + c.payout, 0);
    const totalClaims = claims.length;
    const flaggedCount = claims.filter(c => c.status === 'flagged').length;

    return (
        <div className={`min-h-screen pb-12 px-4 ${demoMode ? 'pt-24' : 'pt-20'}`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold text-white">
                        Claim <span className="gradient-text">History</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        View and track all your insurance claims
                    </p>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="stat-card text-center group hover:scale-[1.02] transition-transform"
                    >
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Total Claims</p>
                        <div className="text-2xl font-bold text-white mt-1">
                            <AnimatedCounter value={totalClaims} duration={1} />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="stat-card text-center group hover:scale-[1.02] transition-transform"
                    >
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Total Paid</p>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">
                            <AnimatedCounter value={totalPaid} prefix="₹" duration={1.5} />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="stat-card text-center group hover:scale-[1.02] transition-transform"
                    >
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Flagged</p>
                        <div className="text-2xl font-bold text-red-400 mt-1">
                            <AnimatedCounter value={flaggedCount} duration={1} />
                        </div>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Claims Timeline */}
                    <div className="lg:col-span-2">
                        {/* Filters */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-4 mb-6"
                        >
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                        <HiOutlineFunnel className="w-3 h-3" /> Event Type
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {filters.map((f) => (
                                            <button
                                                key={f}
                                                onClick={() => setTypeFilter(f)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                                    ${typeFilter === f
                                                        ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
                                                    }`}
                                            >
                                                {f === 'all' ? 'All' : TRIGGER_TYPES[f]?.icon + ' ' + TRIGGER_TYPES[f]?.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-2">Status</p>
                                    <div className="flex flex-wrap gap-2">
                                        {statusFilters.map((f) => (
                                            <button
                                                key={f}
                                                onClick={() => setStatusFilter(f)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize
                                                    ${statusFilter === f
                                                        ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
                                                    }`}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Claims List */}
                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {filteredClaims.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="glass-card p-12 text-center"
                                    >
                                        <HiOutlineDocumentText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                        <p className="text-gray-400">No claims match your filters</p>
                                    </motion.div>
                                ) : (
                                    filteredClaims.map((claim, i) => {
                                        const trigger = TRIGGER_TYPES[claim.type];
                                        return (
                                            <motion.div
                                                key={claim.id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ delay: 0.03 * i }}
                                                className="glass-card-hover p-5"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="flex flex-col items-center mt-1">
                                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${trigger?.bgClass || 'from-gray-600/20 to-gray-600/20'} ${trigger?.borderClass || 'border-gray-500/30'} border flex items-center justify-center text-xl`}>
                                                            {trigger?.icon || '📋'}
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-medium text-white text-sm">{trigger?.label || claim.type}</h4>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase
                                                                ${claim.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                    claim.status === 'flagged' ? 'bg-red-500/20 text-red-400' :
                                                                        'bg-yellow-500/20 text-yellow-400'}`}
                                                            >
                                                                {claim.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-400 text-xs mb-2">{claim.description}</p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span>{claim.date}</span>
                                                            <span>ID: {claim.id}</span>
                                                            {claim.triggerValue && (
                                                                <span>Trigger: {claim.triggerValue}{claim.type === 'rain' ? 'mm' : ''}</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="text-right flex-shrink-0">
                                                        <p className="text-lg font-bold text-emerald-400">+₹{claim.payout}</p>
                                                        <p className="text-[10px] text-gray-500">
                                                            {claim.status === 'paid' ? 'Credited via UPI' : claim.status === 'flagged' ? 'Under review' : 'Processing'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        <SimulationPanel />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="glass-card p-6"
                        >
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <HiOutlineArrowPath className="w-4 h-4 text-primary-400" />
                                How Auto-Claims Work
                            </h4>
                            <ul className="space-y-2 text-xs text-gray-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary-400 mt-0.5">1.</span>
                                    Weather/AQI sensors detect disruption
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary-400 mt-0.5">2.</span>
                                    AI verifies trigger exceeds threshold
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary-400 mt-0.5">3.</span>
                                    Fraud detection engine runs checks
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary-400 mt-0.5">4.</span>
                                    Payout auto-credited to UPI in 30 seconds
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
