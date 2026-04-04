// ==========================================
// GigShield AI — Trigger & Fraud Engine
// ==========================================

import { TRIGGER_TYPES } from './mockData';

/**
 * Check if a weather event should trigger a payout
 */
export function evaluateTrigger(type, value) {
    const thresholds = {
        rain: { min: 60, payout: 800 },
        aqi: { min: 400, payout: 600 },
        flood: { min: null, payout: 1200 }, // Always triggers if event exists
        curfew: { min: null, payout: 500 }, // Always triggers if event exists
    };

    const config = thresholds[type];
    if (!config) return { triggered: false };

    const triggered = config.min === null ? true : value >= config.min;

    return {
        triggered,
        type,
        value,
        payout: triggered ? config.payout : 0,
        threshold: config.min,
        details: TRIGGER_TYPES[type],
    };
}

/**
 * Calculate income loss based on disruption
 */
export function calculateIncomeLoss(dailyEarning, hoursLost = 8) {
    const hourlyRate = dailyEarning / 10; // Assume 10-hour work day
    return Math.round(hourlyRate * hoursLost);
}

/**
 * Basic fraud detection
 * Flags suspicious patterns
 */
export function detectFraud(claims, workerId) {
    const workerClaims = claims.filter((c) => c.workerId === workerId);
    const flags = [];

    // Flag 1: Too many claims in recent period (3+ in 7 days)
    const recentClaims = workerClaims.filter((c) => {
        const claimDate = new Date(c.date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return claimDate >= sevenDaysAgo;
    });

    if (recentClaims.length >= 3) {
        flags.push({
            type: 'frequency',
            severity: 'high',
            message: `${recentClaims.length} claims in the last 7 days`,
        });
    }

    // Flag 2: Duplicate trigger types on same day
    const dateTypeMap = {};
    workerClaims.forEach((c) => {
        const key = `${c.date}-${c.type}`;
        if (dateTypeMap[key]) {
            flags.push({
                type: 'duplicate',
                severity: 'critical',
                message: `Duplicate ${c.type} claim on ${c.date}`,
            });
        }
        dateTypeMap[key] = true;
    });

    // Flag 3: Total payout exceeds threshold
    const totalPayout = workerClaims.reduce((sum, c) => sum + c.payout, 0);
    if (totalPayout > 5000) {
        flags.push({
            type: 'payout_limit',
            severity: 'medium',
            message: `Total payouts ₹${totalPayout} exceed ₹5000 threshold`,
        });
    }

    return {
        isFlagged: flags.length > 0,
        flags,
        riskLevel: flags.length >= 2 ? 'high' : flags.length === 1 ? 'medium' : 'low',
        totalClaims: workerClaims.length,
        totalPayout,
    };
}

/**
 * Generate a new claim from a trigger event
 */
export function generateClaim(workerId, type, triggerResult) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const claimId = `CLM${String(Date.now()).slice(-6)}`;

    return {
        id: claimId,
        workerId,
        type,
        triggerValue: triggerResult.value || null,
        payout: triggerResult.payout,
        date: dateStr,
        status: 'paid',
        description: triggerResult.details?.description || `Auto-triggered ${type} payout`,
    };
}
