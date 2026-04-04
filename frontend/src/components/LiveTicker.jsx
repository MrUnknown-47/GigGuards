// ==========================================
// GigShield AI — Live Ticker Component
// ==========================================

import { motion } from 'framer-motion';

const tickerEvents = [
    '🌧️ Rain detected in Delhi — 3 workers affected',
    '😷 AQI 456 in Mumbai — payouts triggered',
    '✅ ₹2,400 credited to Priya S. via UPI',
    '🌊 Flood alert: Kolkata zone 4 activated',
    '⚡ 12 auto-triggers processed in last hour',
    '📊 Risk recalculated for 5,000+ workers',
    '🚫 Curfew detected — 8 workers covered',
    '✅ ₹800 credited to Raj K. in Delhi',
    '🛡️ 150 new workers enrolled today',
    '😷 AQI improving in Delhi — risk dropping',
];

export default function LiveTicker() {
    const doubledEvents = [...tickerEvents, ...tickerEvents];

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-900/30 via-primary-800/20 to-primary-900/30 border-y border-primary-500/10">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-dark-500 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-dark-500 to-transparent z-10" />

            <motion.div
                className="flex items-center gap-8 py-3 whitespace-nowrap"
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                    x: {
                        duration: 40,
                        repeat: Infinity,
                        ease: 'linear',
                    },
                }}
            >
                {doubledEvents.map((event, i) => (
                    <span key={i} className="text-sm text-gray-300 flex items-center gap-3">
                        <span>{event}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50" />
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
