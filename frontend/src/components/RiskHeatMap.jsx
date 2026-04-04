"use client"

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GigShieldAPI from '../engine/api'

export default function RiskHeatMap() {
    // Ensuring map safely loads inside React context without hydration mismatch
    const [mounted, setMounted] = useState(false);
    const [points, setPoints] = useState([]);
    
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 150);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        GigShieldAPI.getHeatmapZones()
            .then(({ data }) => setPoints(data))
            .catch(err => console.error("Risk heatmap API error:", err));
    }, []);

    const getRiskColor = (risk) => {
        if (risk < 0.3) return { fill: "#10B981", border: "#059669" }; // Low - Emerald
        if (risk < 0.6) return { fill: "#F59E0B", border: "#D97706" }; // Medium - Amber
        if (risk < 0.8) return { fill: "#EF4444", border: "#DC2626" }; // High - Red
        return { fill: "#A855F7", border: "#9333EA" }; // Extreme - Purple
    };

    const getRiskLabel = (risk) => {
        if (risk < 0.3) return "Low Risk";
        if (risk < 0.6) return "Medium Risk";
        if (risk < 0.8) return "High Risk";
        return "Extreme Risk";
    };

    if (!mounted) {
        return (
            <div className="w-full h-full bg-dark-600/50 flex flex-col gap-4 items-center justify-center animate-pulse rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-full border-2 border-primary-500/30 border-t-primary-500 animate-[spin_1.5s_linear_infinite]" />
                <p className="text-xs text-primary-400 uppercase tracking-wider font-semibold">Generating Risk Vectors...</p>
            </div>
        )
    }

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner isolate z-0">
            {/* Darker TileLayer mapping for premium contrast */}
            <MapContainer 
                center={[21.5, 78.0]} 
                zoom={4.5} 
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', backgroundColor: '#0f172a' }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                
                {points.map(([lat, lon, intensity], idx) => {
                    const colors = getRiskColor(intensity);
                    
                    return (
                        <CircleMarker
                            key={`heatmap-point-${idx}`}
                            center={[lat, lon]}
                            radius={Math.max(6, intensity * 20)}
                            pathOptions={{ 
                                fillColor: colors.fill, 
                                color: colors.border,
                                weight: 1, 
                                fillOpacity: Math.min(0.8, 0.3 + (intensity * 0.5)) 
                            }}
                        >
                            <Popup className="leaflet-custom-popup border-0 bg-transparent">
                                <div className="px-1 py-1">
                                    <div className="flex items-center justify-between border-b pb-1.5 mb-2 border-slate-200">
                                        <h3 className="font-bold text-slate-800 text-xs tracking-tight">Active Zone Vector</h3>
                                        <span className="text-[10px] font-bold text-white px-2 py-0.5 ml-2 rounded-full shadow-sm" style={{ backgroundColor: colors.fill }}>
                                            {(intensity * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-100 italic">
                                        Risk Profile: <span className="font-medium text-slate-700">{getRiskLabel(intensity)}</span>
                                    </p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    )
                })}
            </MapContainer>

            {/* Glowing Glass Legend */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-4 right-4 z-[400] bg-dark-600/80 backdrop-blur-md border border-white/10 rounded-xl p-3.5 shadow-xl pointer-events-none"
            >
                <h4 className="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2 border-b border-white/10 pb-1.5">Disaster Risk Array</h4>
                <div className="space-y-2 text-[10px]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-gray-300 font-medium tracking-wide">Low (0 - 0.3)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                        <span className="text-gray-300 font-medium tracking-wide">Medium (0.3 - 0.6)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        <span className="text-gray-300 font-medium tracking-wide">High (0.6 - 0.8)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                        <span className="text-gray-300 font-medium tracking-wide">Extreme (0.8 - 1.0)</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}