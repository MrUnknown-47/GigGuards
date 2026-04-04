// ==========================================
// GigGuards — Admin Dashboard (Premium)
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../engine/SimulationContext';
import GigShieldAPI from '../engine/api';
import { getTierInfo } from '../engine/riskEngine';
import { detectFraud } from '../engine/triggerEngine';
import TierBadge from '../components/TierBadge';
import AnimatedCounter from '../components/AnimatedCounter';
import RiskHeatMap from "../components/RiskHeatMap"
import { HiOutlineMap } from "react-icons/hi2";
import { MONTHLY_DATA, CITY_RISK_DATA } from '../engine/mockData';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell,
} from 'recharts';
import {
    HiOutlineUserGroup,
    HiOutlineShieldCheck,
    HiOutlineBanknotes,
    HiOutlineExclamationTriangle,
    HiOutlineChartBarSquare,
    HiOutlineTableCells,
    HiOutlineSignal,
    HiOutlineMapPin,
    HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
    }),
};

const PIE_COLORS = ['#6C2BD9', '#10B981', '#F59E0B', '#EF4444'];

const payoutDistribution = [
    { name: 'Rain', value: 45 },
    { name: 'AQI', value: 25 },
    { name: 'Flood', value: 20 },
    { name: 'Curfew', value: 10 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-3 text-xs">
                <p className="text-white font-medium">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color || p.fill }}>
                        {p.name}: {typeof p.value === 'number' && p.name !== 'Claims' ? '₹' : ''}{p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function AdminDashboard() {
    const { workers, claims, totalPayouts, activityFeed, demoMode } = useSimulation();

    const [stats, setStats] = useState(null);

    useEffect(() => {
        GigShieldAPI.getAdminStats()
            .then(({ data }) => setStats(data))
            .catch(err => console.error("Admin API fetch failed:", err));
    }, []);

    const fraudFlags = stats?.fraud_flags ?? workers.filter((w) => {
        const result = detectFraud(claims, w.id);
        return result.isFlagged;
    }).length;

    const activePoliciesCount = stats?.active_policies ?? workers.length;
    const totalRevenueValue = stats?.total_revenue ?? (workers.length * 71 * 400);
    const totalWorkersCount = stats?.total_workers ?? (workers.length * 8333);

    const adminStats = [
        {
            icon: HiOutlineUserGroup,
            label: 'Total Workers',
            value: totalWorkersCount,
            change: '+12%',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: HiOutlineShieldCheck,
            label: 'Active Policies',
            value: activePoliciesCount,
            change: '+8%',
            color: 'from-primary-500 to-purple-500',
        },
        {
            icon: HiOutlineBanknotes,
            label: 'Total Revenue',
            value: totalRevenueValue,
            prefix: '₹',
            change: '+23%',
            color: 'from-emerald-500 to-teal-500',
        },
        {
            icon: HiOutlineExclamationTriangle,
            label: 'Fraud Flags',
            value: fraudFlags,
            change: fraudFlags > 0 ? 'Action needed' : 'All clear',
            color: fraudFlags > 0 ? 'from-red-500 to-pink-500' : 'from-emerald-500 to-teal-500',
        },
    ];

    return (
        <div className={`min-h-screen pb-12 px-4 ${demoMode ? 'pt-24' : 'pt-20'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold text-white">
                        Admin <span className="gradient-text">Dashboard</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Platform overview and worker management
                    </p>
                </motion.div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {adminStats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            custom={i}
                            className="stat-card group hover:scale-[1.02] transition-transform duration-300"
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <div className="text-2xl font-bold text-white mt-1">
                                <AnimatedCounter value={stat.value} prefix={stat.prefix || ''} duration={1.5} />
                            </div>
                            <p className={`text-xs mt-1 ${stat.change.includes('+') ? 'text-emerald-400' : stat.change === 'All clear' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {stat.change}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Monthly Claims Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 glass-card p-6"
                    >
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <HiOutlineChartBarSquare className="w-5 h-5 text-primary-400" />
                            Monthly Claims & Payouts
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MONTHLY_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="payouts" fill="#6C2BD9" radius={[4, 4, 0, 0]} name="Payouts" />
                                    <Bar dataKey="premiums" fill="#10B981" radius={[4, 4, 0, 0]} name="Premiums" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Payout Distribution Pie */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-6"
                    >
                        <h3 className="font-semibold text-white mb-4">Payout Distribution</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={payoutDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {payoutDistribution.map((entry, index) => (
                                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 justify-center">
                            {payoutDistribution.map((entry, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                                    {entry.name} ({entry.value}%)
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* City Risk + Fraud + Activity Grid */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* City-wise Risk Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="glass-card p-6"
                    >
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <HiOutlineMapPin className="w-5 h-5 text-primary-400" />
                            City Risk Distribution
                        </h3>
                        <div className="space-y-3">
                            {CITY_RISK_DATA.map((city, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-300">{city.city}</span>
                                        <span className={`font-medium ${city.risk > 0.7 ? 'text-red-400' :
                                            city.risk > 0.5 ? 'text-amber-400' : 'text-emerald-400'
                                            }`}>{(city.risk * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${city.risk * 100}%` }}
                                            transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                                            className={`h-full rounded-full ${city.risk > 0.7 ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                                                city.risk > 0.5 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                                                    'bg-gradient-to-r from-emerald-500 to-teal-500'
                                                }`}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                                        <span>{city.workers.toLocaleString()} workers</span>
                                        <span>₹{(city.payouts / 1000).toFixed(0)}K payouts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Fraud Detection Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-card p-6"
                    >
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <HiOutlineExclamationTriangle className="w-5 h-5 text-red-400" />
                            Fraud Detection
                        </h3>
                        <div className="space-y-3">
                            {workers.map((w) => {
                                const fraud = detectFraud(claims, w.id);
                                if (!fraud.isFlagged) return null;
                                return (
                                    <div key={w.id} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                {w.name.charAt(0)}
                                            </div>
                                            <span className="text-xs font-medium text-white">{w.name}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium
                                                ${fraud.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {fraud.riskLevel.toUpperCase()}
                                            </span>
                                        </div>
                                        {fraud.flags.map((flag, fi) => (
                                            <p key={fi} className="text-[11px] text-gray-400 ml-8">⚠ {flag.message}</p>
                                        ))}
                                    </div>
                                );
                            })}
                            {fraudFlags === 0 && (
                                <div className="p-6 text-center">
                                    <HiOutlineShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                                    <p className="text-xs text-emerald-400 font-medium">All Clear</p>
                                    <p className="text-[11px] text-gray-500 mt-1">No fraud flags detected</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Live Trigger Logs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        className="glass-card p-6"
                    >
                        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                            <HiOutlineSignal className="w-5 h-5 text-primary-400" />
                            Live Trigger Logs
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </h3>
                        <div className="space-y-2 max-h-72 overflow-y-auto">
                            <AnimatePresence initial={false}>
                                {activityFeed.slice(0, 10).map((event) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`p-2.5 rounded-lg text-xs ${event.isNew ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-white/5'
                                            }`}
                                    >
                                        <p className="text-gray-300 truncate">{event.message}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[10px] text-gray-500">{event.timestamp}</span>
                                            {event.payout && (
                                                <span className="text-[10px] font-medium text-emerald-400">₹{event.payout}</span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>

                {/* Disaster Risk Heatmap */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.58 }}
                    className="glass-card p-6 mb-8"
                >
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <HiOutlineMap className="w-5 h-5 text-primary-400" />
                        Disaster Risk Heatmap
                    </h3>

                    <div className="h-[420px] rounded-xl overflow-hidden">
                        <RiskHeatMap />
                    </div>

                    <p className="text-xs text-gray-400 mt-3">
                        AI-powered map showing disruption risk zones using weather, AQI, traffic,
                        and historical disaster data.
                    </p>
                </motion.div>

                {/* Workers Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-card p-6 overflow-hidden"
                >
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <HiOutlineTableCells className="w-5 h-5 text-primary-400" />
                        Worker Registry
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Worker</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">City</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Platform</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Daily Earn</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Rating</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Tier</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Fraud</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workers.map((w, i) => {
                                    const fraud = detectFraud(claims, w.id);
                                    return (
                                        <motion.tr
                                            key={w.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * i }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-400 flex items-center justify-center text-xs font-bold text-white">
                                                        {w.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{w.name}</p>
                                                        <p className="text-xs text-gray-500">{w.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-300">{w.city}</td>
                                            <td className="py-3 px-4 text-gray-300">{w.platform}</td>
                                            <td className="py-3 px-4 text-white font-medium">₹{w.dailyEarning}</td>
                                            <td className="py-3 px-4">
                                                <span className="text-yellow-400">★</span> {w.rating}
                                            </td>
                                            <td className="py-3 px-4">
                                                <TierBadge tier={w.tier} size="sm" />
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                                    ${fraud.isFlagged
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-emerald-500/20 text-emerald-400'
                                                    }`}>
                                                    {fraud.isFlagged ? `${fraud.flags.length} flags` : 'Clear'}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
