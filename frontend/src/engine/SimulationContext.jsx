// ==========================================
// GigShield AI — Simulation Context (Enhanced)
// ==========================================

import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { DEFAULT_WORKER, INITIAL_CLAIMS, EARNINGS_DATA, WORKER_PROFILES, ACTIVITY_EVENTS, AI_PREDICTIONS } from './mockData';
import { calculateRiskScore, calculatePremium, getWorkerTier } from './riskEngine';
import { evaluateTrigger, generateClaim, detectFraud } from './triggerEngine';

const SimulationContext = createContext(null);

const defaultRiskScore = calculateRiskScore({
    city: DEFAULT_WORKER.city,
    avgRain: 55,
    avgAQI: 320,
    floodZone: true,
    trafficDensity: 0.7,
});

const initialState = {
    worker: DEFAULT_WORKER,
    riskScore: defaultRiskScore,
    premium: calculatePremium(defaultRiskScore),
    tier: getWorkerTier(defaultRiskScore, INITIAL_CLAIMS.length),
    claims: INITIAL_CLAIMS,
    earnings: EARNINGS_DATA,
    notifications: [],
    activePolicy: 'standard',
    isSimulating: false,
    simulatingType: null,
    totalPayouts: INITIAL_CLAIMS.reduce((sum, c) => sum + c.payout, 0),
    workers: WORKER_PROFILES,

    // New: Slider controls
    sliders: {
        rainMM: 55,
        aqiLevel: 320,
        trafficPercent: 70,
    },

    // New: Demo mode
    demoMode: false,

    // New: Activity feed
    activityFeed: [...ACTIVITY_EVENTS],

    // New: AI predictions
    aiPredictions: AI_PREDICTIONS,

    // New: Pricing history
    pricingTrend: [65, 68, 71, 67, 72, 75, 71],
};

function reducer(state, action) {
    switch (action.type) {
        case 'START_SIMULATION':
            return {
                ...state,
                isSimulating: true,
                simulatingType: action.payload,
            };

        case 'TRIGGER_EVENT': {
            const { type, triggerResult } = action.payload;
            const newClaim = generateClaim(state.worker.id, type, triggerResult);
            const updatedClaims = [newClaim, ...state.claims];
            const fraudResult = detectFraud(updatedClaims, state.worker.id);

            if (fraudResult.isFlagged && fraudResult.riskLevel === 'high') {
                newClaim.status = 'flagged';
            }

            const notification = {
                id: Date.now(),
                type: newClaim.status === 'flagged' ? 'warning' : 'success',
                title: newClaim.status === 'flagged'
                    ? '⚠️ Claim Under Review'
                    : `₹${triggerResult.payout} Payout Credited!`,
                message: triggerResult.details?.description || `${type} event detected`,
                timestamp: new Date().toLocaleTimeString(),
                payout: triggerResult.payout,
            };

            const activityItem = {
                id: Date.now(),
                type: type,
                message: triggerResult.details?.description || `${type} event triggered`,
                payout: triggerResult.payout,
                timestamp: new Date().toLocaleTimeString(),
                city: state.worker.city,
                isNew: true,
            };

            return {
                ...state,
                isSimulating: false,
                simulatingType: null,
                claims: updatedClaims,
                totalPayouts: state.totalPayouts + triggerResult.payout,
                notifications: [notification, ...state.notifications],
                activityFeed: [activityItem, ...state.activityFeed].slice(0, 50),
            };
        }

        case 'DISMISS_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter((n) => n.id !== action.payload),
            };

        case 'UPDATE_RISK_SCORE':
            return {
                ...state,
                riskScore: action.payload,
                premium: calculatePremium(action.payload),
                tier: getWorkerTier(action.payload, state.claims.length),
            };

        case 'SELECT_POLICY':
            return {
                ...state,
                activePolicy: action.payload,
            };

        case 'SET_SLIDERS': {
            const sliders = { ...state.sliders, ...action.payload };
            const newRiskScore = calculateRiskScore({
                city: state.worker.city,
                avgRain: sliders.rainMM,
                avgAQI: sliders.aqiLevel,
                floodZone: sliders.rainMM > 70,
                trafficDensity: sliders.trafficPercent / 100,
            });
            return {
                ...state,
                sliders,
                riskScore: newRiskScore,
                premium: calculatePremium(newRiskScore),
                tier: getWorkerTier(newRiskScore, state.claims.length),
            };
        }

        case 'TOGGLE_DEMO_MODE':
            return {
                ...state,
                demoMode: !state.demoMode,
            };

        case 'ADD_ACTIVITY': {
            const newActivity = {
                id: Date.now() + Math.random(),
                ...action.payload,
                timestamp: new Date().toLocaleTimeString(),
                isNew: true,
            };
            return {
                ...state,
                activityFeed: [newActivity, ...state.activityFeed].slice(0, 50),
            };
        }

        default:
            return state;
    }
}

export function SimulationProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const demoIntervalRef = useRef(null);

    const simulateEvent = useCallback((type) => {
        dispatch({ type: 'START_SIMULATION', payload: type });

        setTimeout(() => {
            const triggerResult = evaluateTrigger(
                type,
                type === 'rain' ? 78 : type === 'aqi' ? 456 : null
            );

            if (triggerResult.triggered) {
                dispatch({ type: 'TRIGGER_EVENT', payload: { type, triggerResult } });
            }
        }, 2000);
    }, []);

    const dismissNotification = useCallback((id) => {
        dispatch({ type: 'DISMISS_NOTIFICATION', payload: id });
    }, []);

    const updateRiskScore = useCallback((score) => {
        dispatch({ type: 'UPDATE_RISK_SCORE', payload: score });
    }, []);

    const selectPolicy = useCallback((policyId) => {
        dispatch({ type: 'SELECT_POLICY', payload: policyId });
    }, []);

    const setSliders = useCallback((values) => {
        dispatch({ type: 'SET_SLIDERS', payload: values });
    }, []);

    const toggleDemoMode = useCallback(() => {
        dispatch({ type: 'TOGGLE_DEMO_MODE' });
    }, []);

    const addActivity = useCallback((activity) => {
        dispatch({ type: 'ADD_ACTIVITY', payload: activity });
    }, []);

    // Demo mode auto-simulation
    useEffect(() => {
        if (state.demoMode) {
            const eventTypes = ['rain', 'aqi', 'flood', 'curfew'];
            const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];
            const messages = [
                { type: 'rain', msg: (c) => `🌧️ Heavy rainfall detected in ${c} — 78mm recorded` },
                { type: 'aqi', msg: (c) => `😷 AQI spike in ${c} — Level 456 (Severe)` },
                { type: 'flood', msg: (c) => `🌊 NDMA flood warning issued for ${c}` },
                { type: 'curfew', msg: (c) => `🚫 Section 144 imposed in parts of ${c}` },
                { type: 'info', msg: (c) => `📊 Risk recalculated for ${c} zone` },
                { type: 'info', msg: (c) => `✅ 3 workers in ${c} received payouts` },
                { type: 'info', msg: (c) => `⚡ Auto-trigger processed for ${c}` },
            ];

            demoIntervalRef.current = setInterval(() => {
                const city = cities[Math.floor(Math.random() * cities.length)];
                const msgItem = messages[Math.floor(Math.random() * messages.length)];

                addActivity({
                    type: msgItem.type,
                    message: msgItem.msg(city),
                    city,
                    payout: msgItem.type !== 'info' ? [500, 600, 800, 1200][Math.floor(Math.random() * 4)] : null,
                });

                // Occasionally trigger actual simulation
                if (Math.random() > 0.7 && !state.isSimulating) {
                    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
                    simulateEvent(eventType);
                }
            }, 5000 + Math.random() * 5000);
        }

        return () => {
            if (demoIntervalRef.current) {
                clearInterval(demoIntervalRef.current);
                demoIntervalRef.current = null;
            }
        };
    }, [state.demoMode, state.isSimulating, simulateEvent, addActivity]);

    return (
        <SimulationContext.Provider
            value={{
                ...state,
                simulateEvent,
                dismissNotification,
                updateRiskScore,
                selectPolicy,
                setSliders,
                toggleDemoMode,
                addActivity,
            }}
        >
            {children}
        </SimulationContext.Provider>
    );
}

export function useSimulation() {
    const context = useContext(SimulationContext);
    if (!context) {
        throw new Error('useSimulation must be used within SimulationProvider');
    }
    return context;
}
