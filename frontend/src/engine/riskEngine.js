// ==========================================
// GigShield AI — Risk & Premium Engine
// ==========================================

/**
 * Calculate risk score (0–1) based on multiple factors
 */
export function calculateRiskScore({
    city = 'Delhi',
    avgRain = 50,
    avgAQI = 300,
    floodZone = false,
    trafficDensity = 0.6, // 0-1
} = {}) {
    // Weights for each factor
    const weights = {
        rain: 0.3,
        aqi: 0.25,
        flood: 0.25,
        traffic: 0.2,
    };

    // Normalize each factor to 0-1
    const rainScore = Math.min(avgRain / 100, 1);
    const aqiScore = Math.min(avgAQI / 500, 1);
    const floodScore = floodZone ? 0.9 : 0.2;
    const trafficScore = trafficDensity;

    // City risk multipliers
    const cityRisk = {
        Delhi: 1.15,
        Mumbai: 1.2,
        Bangalore: 0.9,
        Hyderabad: 0.95,
        Ahmedabad: 1.0,
        Pune: 0.85,
        Chennai: 1.1,
        Kolkata: 1.05,
    };

    const multiplier = cityRisk[city] || 1.0;

    const rawScore =
        rainScore * weights.rain +
        aqiScore * weights.aqi +
        floodScore * weights.flood +
        trafficScore * weights.traffic;

    return Math.min(parseFloat((rawScore * multiplier).toFixed(2)), 1.0);
}

/**
 * Calculate weekly premium based on risk score
 * Formula: ₹10 + risk × 75
 */
export function calculatePremium(riskScore) {
    return Math.round(10 + riskScore * 75);
}

/**
 * Determine worker tier based on risk score and history
 */
export function getWorkerTier(riskScore, claimCount = 0) {
    if (riskScore < 0.4 && claimCount <= 3) return 'verified';
    if (riskScore < 0.7 && claimCount <= 6) return 'standard';
    return 'review';
}

/**
 * Get tier display info
 */
export function getTierInfo(tier) {
    const tiers = {
        verified: {
            label: 'Verified',
            color: '#34d399',
            bgColor: 'bg-emerald-500/20',
            borderColor: 'border-emerald-500/30',
            icon: '✓',
            description: 'Low risk, trusted worker',
        },
        standard: {
            label: 'Standard',
            color: '#facc15',
            bgColor: 'bg-yellow-500/20',
            borderColor: 'border-yellow-500/30',
            icon: '◆',
            description: 'Moderate risk profile',
        },
        review: {
            label: 'Under Review',
            color: '#f87171',
            bgColor: 'bg-red-500/20',
            borderColor: 'border-red-500/30',
            icon: '!',
            description: 'High risk — requires review',
        },
    };
    return tiers[tier] || tiers.standard;
}

/**
 * Get risk level label
 */
export function getRiskLevel(score) {
    if (score < 0.3) return { label: 'Low', color: 'text-emerald-400' };
    if (score < 0.5) return { label: 'Moderate', color: 'text-yellow-400' };
    if (score < 0.7) return { label: 'High', color: 'text-orange-400' };
    return { label: 'Critical', color: 'text-red-400' };
}
