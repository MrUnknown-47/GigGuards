// ==========================================
// GigShield AI — Fraud Defense Panel
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../engine/SimulationContext';
import { detectFraud } from '../engine/triggerEngine';
import { HiOutlineShieldCheck, HiOutlineExclamationTriangle, HiOutlineWifi } from 'react-icons/hi2';

export default function FraudDefensePanel() {
    const { claims, workers, simulateSyndicateAttack } = useSimulation();
    const [suspiciousClaims, setSuspiciousClaims] = useState([]);
    const [ringFraudAlerts, setRingFraudAlerts] = useState([]);
    const [scanStatus, setScanStatus] = useState('idle'); // 'idle' | 'scanning' | 'complete'

    const runFraudScan = () => {
        setScanStatus('scanning');
        
        setTimeout(() => {
            const workerMap = new Map(workers.map((w) => [w.id, w]));
            const analyzed = claims
                .filter((c) => c.status !== 'paid' && c.status !== 'rejected')
                .map((claim) => {
                    const worker = workerMap.get(claim.workerId);
                    const fraudAnalysis = detectFraud(claims, claim.workerId);
                    
                    return {
                        claim,
                        worker,
                        flags: fraudAnalysis.flags,
                        score: fraudAnalysis.score,
                    };
                })
                .filter((item) => item.score > 20 || item.flags.length > 0)
                .sort((a, b) => b.score - a.score);

            // Mock ring fraud grouping based on recent claims timestamp + type proximity
            const generatedRingAlerts = analyzed.filter(a => a.flags.some(f => f.type === 'ring_fraud')).length > 0 
                ? [{ location: 'Mumbai-Central', type: 'rain', count: 3, confidence: 94 }]
                : [];

            setSuspiciousClaims(analyzed);
            setRingFraudAlerts(generatedRingAlerts);
            setScanStatus('complete');
        }, 1500);
    };

    const handleSyndicateAttack = () => {
        setScanStatus('scanning');
        simulateSyndicateAttack();
        setTimeout(() => {
            runFraudScan();
        }, 100);
    }

    return (
        <div className="glass-card p-8 bg-gradient-to-br from-red-500/5 to-surface-container-high rounded-3xl border border-white/5 relative overflow-hidden">
            {/* Background glowing layer */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                        <HiOutlineShieldCheck className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Sentinel Fraud Defense</h3>
                        <p className="text-xs text-gray-400">Multi-Signal GPS Spoofing & Ring Fraud Analysis</p>
                    </div>
                </div>
                <div className="flex gap-3 relative z-10">
                    <button
                        onClick={runFraudScan}
                        disabled={scanStatus === 'scanning'}
                        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-500/50 text-white rounded-xl font-semibold text-sm transition-all focus:ring-2 focus:ring-primary-500/40 active:scale-95"
                    >
                        {scanStatus === 'scanning' ? 'Scanning Network...' : 'Run Fraud Scan'}
                    </button>
                    <button
                        onClick={handleSyndicateAttack}
                        disabled={scanStatus === 'scanning'}
                        className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 disabled:text-red-300/50 border border-red-500/30 rounded-xl font-semibold text-sm transition-all active:scale-95"
                    >
                        Simulate Syndicate Attack
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {ringFraudAlerts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 relative z-10"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"></span>
                            <span className="text-red-400 font-bold uppercase tracking-wider text-xs">Active Threat Detected</span>
                        </div>
                        <div className="space-y-3">
                            {ringFraudAlerts.map((alert, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <HiOutlineWifi className="w-5 h-5 text-red-400" />
                                        <div>
                                            <span className="text-white font-medium block text-sm">{alert.location}</span>
                                            <span className="text-gray-400 text-xs">Triggering: {alert.type} event</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-red-400 font-bold text-sm tracking-widest uppercase">{alert.count} Nodes Synchronized</span>
                                        <span className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-bold rounded-lg border border-red-500/30">
                                            {alert.confidence}% Confidence
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {suspiciousClaims.length > 0 ? (
                <div className="space-y-4 relative z-10 transition-all">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Suspicious Claims ({suspiciousClaims.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suspiciousClaims.map((item, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={idx}
                                className={`p-5 rounded-2xl border backdrop-blur-sm shadow-xl ${
                                    item.score >= 70 
                                        ? 'bg-red-500/5 border-red-500/20 shadow-red-500/5' 
                                        : 'bg-amber-500/5 border-amber-500/20 shadow-amber-500/5'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-white font-mono text-sm tracking-wider font-bold">{item.claim.id}</span>
                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-widest uppercase ${
                                            item.score >= 70 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        }`}>
                                            Risk: {item.score}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-bold tracking-tight">₹{item.claim.payout}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-2 bg-black/20 p-3 rounded-xl border border-white/5">
                                    {item.flags.map((flag, fIdx) => (
                                        <div key={fIdx} className="flex gap-2 items-start">
                                            <HiOutlineExclamationTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${flag.severity === 'critical' ? 'text-red-400' : 'text-amber-400'}`} />
                                            <p className={`text-xs ${flag.severity === 'critical' ? 'text-red-300' : 'text-amber-300'} leading-relaxed`}>{flag.message}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center justify-between text-[10px] font-medium text-gray-500">
                                    <span>Worker: {item.worker ? item.worker.name : item.claim.workerId}</span>
                                    <span>{new Date(item.claim.date).toLocaleDateString()}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : scanStatus === 'complete' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 relative z-10">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                        <HiOutlineShieldCheck className="w-10 h-10 text-emerald-400" />
                    </div>
                    <p className="text-emerald-400 font-bold text-lg tracking-tight">No suspicious activity detected</p>
                    <p className="text-xs text-emerald-400/50 mt-2 tracking-wide uppercase font-medium">Platform Liquidity is Secure</p>
                </motion.div>
            ) : (
                <div className="text-center py-12 text-gray-500 relative z-10">
                    <p className="text-sm font-medium">System Idle</p>
                    <p className="text-xs mt-2 uppercase tracking-widest opacity-60">Run Fraud Scan or Simulate Attack</p>
                </div>
            )}
        </div>
    );
}
