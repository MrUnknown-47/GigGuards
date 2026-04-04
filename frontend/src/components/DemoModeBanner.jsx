// ==========================================
// GigShield AI — Demo Mode Banner
// ==========================================

import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../engine/SimulationContext';
import { HiOutlinePlayCircle } from 'react-icons/hi2';

export default function DemoModeBanner() {
    const { demoMode } = useSimulation();

    return (
        <AnimatePresence>
            {demoMode && (
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-primary-600/90 via-purple-600/90 to-primary-600/90 backdrop-blur-sm border-b border-primary-400/30"
                >
                    <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-3">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <HiOutlinePlayCircle className="w-4 h-4 text-white" />
                        </motion.div>
                        <span className="text-xs font-medium text-white">
                            Demo Mode Active — Events are being simulated in real-time
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
