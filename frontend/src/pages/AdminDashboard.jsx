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
import FraudDefensePanel from '../components/FraudDefensePanel';
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
            <div className="glass-card p-3 text-xs border border-white/5 shadow-2xl backdrop-blur-xl">
                <p className="text-white font-bold mb-1 opacity-80">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color || p.fill }} className="font-medium">
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
    const [activeTab, setActiveTab] = useState('overview');

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
            <div className="max-w-[1400px] mx-auto">
                {/* Header & Tabs */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Ledger</span>
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                            Real-time risk distribution and system oversight
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-2 p-1.5 bg-surface-container-high/50 rounded-2xl border border-white/5 backdrop-blur-md"
                    >
                        {[
                            { id: 'overview', label: 'Overview', icon: HiOutlineChartBarSquare },
                            { id: 'defense', label: 'Sentinel Defense', icon: HiOutlineShieldCheck },
                            { id: 'workers', label: 'Network Nodes', icon: HiOutlineUserGroup }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                                    activeTab === tab.id 
                                        ? 'bg-primary-500 shadow-lg shadow-primary-500/20 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Stat Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {adminStats.map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeUp}
                                        custom={i}
                                        className="glass-card p-6 rounded-3xl border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                                    >
                                        <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}></div>
                                        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                                        <div className="text-3xl font-headline font-black text-white mb-3">
                                            <AnimatedCounter value={stat.value} prefix={stat.prefix || ''} duration={1.5} />
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mt-auto">
                                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                                <stat.icon className="w-4 h-4 text-white" />
                                            </div>
                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${stat.change.includes('+') ? 'text-emerald-400' : stat.change === 'All clear' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {stat.change}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Charts Grid */}
                            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                                {/* Monthly Claims Bar Chart */}
                                <div className="lg:col-span-2 glass-card p-8 rounded-3xl border-white/5">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-white flex items-center gap-2">
                                            <HiOutlineChartBarSquare className="w-5 h-5 text-primary-400" />
                                            Monthly Yields & Payouts
                                        </h3>
                                    </div>
                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                                                <Bar dataKey="payouts" fill="url(#colorPayouts)" radius={[6, 6, 0, 0]} name="Payouts" barSize={32} />
                                                <Bar dataKey="premiums" fill="url(#colorPremiums)" radius={[6, 6, 0, 0]} name="Premiums" barSize={32} />
                                                
                                                <defs>
                                                    <linearGradient id="colorPayouts" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                                                        <stop offset="95%" stopColor="#6C2BD9" stopOpacity={0.9}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorPremiums" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.9}/>
                                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.9}/>
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Payout Distribution Pie */}
                                <div className="glass-card p-8 rounded-3xl border-white/5 flex flex-col">
                                    <h3 className="font-bold text-white mb-6">Payout Distribution</h3>
                                    <div className="h-48 flex-1">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={payoutDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={85}
                                                    paddingAngle={6}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {payoutDistribution.map((entry, index) => (
                                                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        {payoutDistribution.map((entry, i) => (
                                            <div key={i} className="flex flex-col gap-1 p-3 rounded-2xl bg-white/5 border border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                                                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{entry.name}</span>
                                                </div>
                                                <span className="text-sm font-bold text-white pl-4.5">{entry.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                                {/* City-wise Risk Distribution */}
                                <div className="glass-card p-8 rounded-3xl border-white/5">
                                    <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                        <HiOutlineMapPin className="w-5 h-5 text-primary-400" />
                                        City Risk Distribution
                                    </h3>
                                    <div className="space-y-4">
                                        {CITY_RISK_DATA.slice(0, 5).map((city, i) => (
                                            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-white font-bold text-sm tracking-wide">{city.city}</span>
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${city.risk > 0.7 ? 'bg-red-500/20 text-red-400' :
                                                        city.risk > 0.5 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                                                        }`}>{(city.risk * 100).toFixed(0)}% Risk</span>
                                                </div>
                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
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
                                                <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                                                    <span>{city.workers.toLocaleString()} Active Nodes</span>
                                                    <span>₹{(city.payouts / 1000).toFixed(0)}K Total Yield</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Disaster Risk Heatmap */}
                                <div className="glass-card p-8 rounded-3xl border-white/5 flex flex-col">
                                    <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                        <HiOutlineMap className="w-5 h-5 text-primary-400" />
                                        Disaster Risk Heatmap
                                    </h3>
                                    <div className="flex-1 h-[340px] rounded-2xl overflow-hidden border border-white/10 relative">
                                        <RiskHeatMap />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* DEFENSE TAB */}
                    {activeTab === 'defense' && (
                        <motion.div
                            key="defense"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <FraudDefensePanel />

                            {/* Live Trigger Logs Inside Defense for context */}
                            <div className="glass-card p-8 rounded-3xl border-white/5">
                                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                    <HiOutlineSignal className="w-5 h-5 text-primary-400" />
                                    Live Event Protocol
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)] ml-2" />
                                </h3>
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    <AnimatePresence initial={false}>
                                        {activityFeed.slice(0, 15).map((event) => (
                                            <motion.div
                                                key={event.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`p-4 rounded-2xl border ${event.isNew ? 'bg-primary-500/10 border-primary-500/20 shadow-lg shadow-primary-500/5' : 'bg-white/5 border-white/5'
                                                    }`}
                                            >
                                                <p className="text-gray-200 text-sm font-medium truncate">{event.message}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-[10px] text-gray-500 font-black tracking-widest">{event.timestamp}</span>
                                                    {event.payout && (
                                                        <span className="text-xs font-black text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded">₹{event.payout}</span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* WORKERS TAB */}
                    {activeTab === 'workers' && (
                        <motion.div
                            key="workers"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="glass-card p-8 rounded-3xl border-white/5 overflow-hidden">
                                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                                    <HiOutlineTableCells className="w-5 h-5 text-primary-400" />
                                    Worker Ledger Master
                                </h3>
                                <div className="overflow-x-auto rounded-xl border border-white/5">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-surface-container-high/50 border-b border-white/10">
                                                <th className="text-left py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Worker Node</th>
                                                <th className="text-left py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Geo Zone</th>
                                                <th className="text-left py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Platform</th>
                                                <th className="text-left py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Daily Earn</th>
                                                <th className="text-left py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Reputation</th>
                                                <th className="text-left py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
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
                                                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                                    >
                                                        <td className="py-4 px-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-sm font-black text-white shadow-lg group-hover:scale-110 transition-transform">
                                                                    {w.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-white font-bold tracking-tight">{w.name}</p>
                                                                    <p className="text-[10px] tracking-widest uppercase text-gray-500 font-medium mt-0.5">{w.id}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6 text-gray-300 font-medium">{w.city}</td>
                                                        <td className="py-4 px-6">
                                                            <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-semibold text-gray-300 border border-white/10">
                                                                {w.platform}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6 text-white font-bold">₹{w.dailyEarning}</td>
                                                        <td className="py-4 px-6">
                                                            <TierBadge tier={w.tier} size="sm" />
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className={`text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-widest border
                                                                ${fraud.isFlagged
                                                                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                }`}>
                                                                {fraud.isFlagged ? `Flagged (${fraud.score}/100)` : 'Secure'}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
