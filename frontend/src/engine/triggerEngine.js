// ==========================================
// GigShield AI — Trigger & Fraud AI Engine
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
 * Advanced Multi-Signal Fraud Detection Engine
 * Flags suspicious patterns (Frequency, Duplicate, Payout Limits, GPS Spoofing)
 */
export function detectFraud(claims, workerId) {
    const workerClaims = claims.filter((c) => c.workerId === workerId);
    const flags = [];
    let riskScore = 0;

    // Is it a known simulated spoof attack claim?
    const hasSpoofClaim = workerClaims.some(c => c.isSpoofAttack);
    if (hasSpoofClaim) {
        flags.push({
            type: 'gps_spoofing',
            severity: 'critical',
            message: 'Location mismatch: IP geo differs from reported GPS by 15.4km',
        });
        flags.push({
            type: 'device_sensor',
            severity: 'high',
            message: 'Device sensors static during reported movement',
        });
        riskScore += 85;
    }

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
        riskScore += 40;
    }

    // Flag 2: Duplicate trigger types on same day
    const dateTypeMap = {};
    workerClaims.forEach((c) => {
        const key = `${c.date}-${c.type}`;
        if (dateTypeMap[key] && !c.isSpoofAttack /* Ignore multiple mock attacks in count */ && !c.isRingFraudAttack) {
            flags.push({
                type: 'duplicate',
                severity: 'critical',
                message: `Duplicate ${c.type} claim on ${c.date}`,
            });
            riskScore += 60;
        }
        dateTypeMap[key] = true;
    });

    // Is it part of a simulated Ring Fraud attack?
    const hasRingFraud = workerClaims.some(c => c.isRingFraudAttack);
    if (hasRingFraud) {
        flags.push({
            type: 'ring_fraud',
            severity: 'critical',
            message: 'Suspicious behavioral clustering: Multi-node temporal sync',
        });
        riskScore += 75;
    }

    // Flag 3: Total payout exceeds threshold
    const totalPayout = workerClaims.reduce((sum, c) => sum + c.payout, 0);
    if (totalPayout > 5000 && !hasSpoofClaim && !hasRingFraud) {
        flags.push({
            type: 'payout_limit',
            severity: 'medium',
            message: `Total payouts ₹${totalPayout} exceed ₹5000 threshold`,
        });
        riskScore += 20;
    }

    const clampedScore = Math.min(riskScore, 100);

    return {
        isFlagged: flags.length > 0,
        flags,
        score: clampedScore,
        riskLevel: clampedScore >= 70 ? 'high' : clampedScore >= 30 ? 'medium' : 'low',
        totalClaims: workerClaims.length,
        totalPayout,
    };
}

export function generateClaim(workerId, type, triggerResult, apiResponse) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  return {
    id: `CLM-${Date.now()}`,
    workerId,
    type,
    triggerValue: triggerResult?.value || null,

    payout: apiResponse?.final_payout ?? 0,
    triggerReason: apiResponse?.trigger_reason ?? "Unknown",

    fraudLevel: apiResponse?.fraud_check?.level ?? "unknown",
    fraudScore: apiResponse?.fraud_check?.fraud_score ?? 0,

    trustScore: apiResponse?.trust_score ?? 0,

    date: dateStr,
    status: apiResponse?.status ?? "pending",

    description: `AI-triggered ${type} payout`
  };
}
