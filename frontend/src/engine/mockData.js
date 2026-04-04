// ==========================================
// GigShield AI — Mock Data Layer (Enhanced)
// ==========================================

export const WORKER_PROFILES = [
    {
        id: 'W001',
        name: 'Raj Kumar',
        city: 'Delhi',
        platform: 'Zomato',
        dailyEarning: 1200,
        joinDate: '2024-08-15',
        phone: '+91 98XXX XXXXX',
        avatar: null,
        tier: 'verified',
        totalDeliveries: 2847,
        rating: 4.6,
    },
    {
        id: 'W002',
        name: 'Priya Sharma',
        city: 'Mumbai',
        platform: 'Swiggy',
        dailyEarning: 1400,
        joinDate: '2024-06-01',
        phone: '+91 87XXX XXXXX',
        avatar: null,
        tier: 'verified',
        totalDeliveries: 3120,
        rating: 4.8,
    },
    {
        id: 'W003',
        name: 'Suresh Patel',
        city: 'Ahmedabad',
        platform: 'Uber Eats',
        dailyEarning: 900,
        joinDate: '2024-11-20',
        phone: '+91 76XXX XXXXX',
        avatar: null,
        tier: 'standard',
        totalDeliveries: 1456,
        rating: 4.3,
    },
    {
        id: 'W004',
        name: 'Anita Devi',
        city: 'Bangalore',
        platform: 'Dunzo',
        dailyEarning: 1100,
        joinDate: '2024-09-10',
        phone: '+91 95XXX XXXXX',
        avatar: null,
        tier: 'standard',
        totalDeliveries: 2010,
        rating: 4.5,
    },
    {
        id: 'W005',
        name: 'Mohammed Ali',
        city: 'Hyderabad',
        platform: 'Zomato',
        dailyEarning: 1050,
        joinDate: '2025-01-05',
        phone: '+91 63XXX XXXXX',
        avatar: null,
        tier: 'review',
        totalDeliveries: 890,
        rating: 3.9,
    },
    {
        id: 'W006',
        name: 'Kavita Singh',
        city: 'Pune',
        platform: 'Swiggy',
        dailyEarning: 1300,
        joinDate: '2024-07-22',
        phone: '+91 82XXX XXXXX',
        avatar: null,
        tier: 'verified',
        totalDeliveries: 2690,
        rating: 4.7,
    },
];

export const DEFAULT_WORKER = WORKER_PROFILES[0];

export const POLICIES = [
    {
        id: 'basic',
        name: 'Basic Shield',
        description: 'Essential protection against heavy rain disruptions',
        coverage: ['Heavy Rain'],
        maxPayout: 800,
        basePrice: 35,
        color: 'from-blue-500 to-cyan-500',
        icon: '🛡️',
        popular: false,
    },
    {
        id: 'standard',
        name: 'Standard Shield',
        description: 'Comprehensive coverage for weather & air quality events',
        coverage: ['Heavy Rain', 'AQI Spike', 'Flood'],
        maxPayout: 1500,
        basePrice: 71,
        color: 'from-primary-500 to-purple-500',
        icon: '⚡',
        popular: true,
    },
    {
        id: 'premium',
        name: 'Premium Shield',
        description: 'Full protection including curfews & all disruptions',
        coverage: ['Heavy Rain', 'AQI Spike', 'Flood', 'Curfew'],
        maxPayout: 2500,
        basePrice: 120,
        color: 'from-amber-500 to-orange-500',
        icon: '👑',
        popular: false,
    },
];

export const INITIAL_CLAIMS = [
    {
        id: 'CLM001',
        workerId: 'W001',
        type: 'rain',
        triggerValue: 78,
        payout: 800,
        date: '2025-03-15',
        status: 'paid',
        description: 'Heavy rainfall detected in Delhi NCR region',
    },
    {
        id: 'CLM002',
        workerId: 'W001',
        type: 'aqi',
        triggerValue: 456,
        payout: 600,
        date: '2025-03-10',
        status: 'paid',
        description: 'Severe AQI levels exceeded safe threshold',
    },
    {
        id: 'CLM003',
        workerId: 'W002',
        type: 'flood',
        triggerValue: null,
        payout: 1200,
        date: '2025-03-08',
        status: 'paid',
        description: 'Flood warning issued for Mumbai region',
    },
    {
        id: 'CLM004',
        workerId: 'W003',
        type: 'rain',
        triggerValue: 65,
        payout: 800,
        date: '2025-03-05',
        status: 'flagged',
        description: 'Heavy rain in Ahmedabad — flagged for review',
    },
    {
        id: 'CLM005',
        workerId: 'W001',
        type: 'curfew',
        triggerValue: null,
        payout: 500,
        date: '2025-02-28',
        status: 'paid',
        description: 'Section 144 imposed in parts of Delhi',
    },
];

export const EARNINGS_DATA = [
    { day: 'Mon', earnings: 1200, payouts: 0 },
    { day: 'Tue', earnings: 1100, payouts: 0 },
    { day: 'Wed', earnings: 400, payouts: 800 },
    { day: 'Thu', earnings: 1300, payouts: 0 },
    { day: 'Fri', earnings: 1250, payouts: 0 },
    { day: 'Sat', earnings: 0, payouts: 600 },
    { day: 'Sun', earnings: 1400, payouts: 0 },
];

export const MONTHLY_DATA = [
    { month: 'Oct', claims: 2, payouts: 1600, premiums: 284 },
    { month: 'Nov', claims: 5, payouts: 3800, premiums: 284 },
    { month: 'Dec', claims: 1, payouts: 800, premiums: 284 },
    { month: 'Jan', claims: 3, payouts: 2400, premiums: 284 },
    { month: 'Feb', claims: 2, payouts: 1300, premiums: 284 },
    { month: 'Mar', claims: 4, payouts: 3100, premiums: 284 },
];

export const WEATHER_CONDITIONS = {
    rain: { label: 'Rainfall', unit: 'mm', threshold: 60, icon: '🌧️' },
    aqi: { label: 'Air Quality Index', unit: 'AQI', threshold: 400, icon: '😷' },
    flood: { label: 'Flood Alert', unit: '', threshold: null, icon: '🌊' },
    curfew: { label: 'Curfew / Restrictions', unit: '', threshold: null, icon: '🚫' },
};

export const TRIGGER_TYPES = {
    rain: {
        label: 'Heavy Rain',
        icon: '🌧️',
        color: 'blue',
        bgClass: 'from-blue-600/20 to-cyan-600/20',
        borderClass: 'border-blue-500/30',
        simulatedValue: 78,
        payout: 800,
        description: 'Torrential rain detected — 78mm in Delhi NCR',
    },
    aqi: {
        label: 'AQI Spike',
        icon: '😷',
        color: 'yellow',
        bgClass: 'from-yellow-600/20 to-orange-600/20',
        borderClass: 'border-yellow-500/30',
        simulatedValue: 456,
        payout: 600,
        description: 'Severe air quality — AQI 456 in Delhi',
    },
    flood: {
        label: 'Flood Alert',
        icon: '🌊',
        color: 'red',
        bgClass: 'from-red-600/20 to-pink-600/20',
        borderClass: 'border-red-500/30',
        simulatedValue: null,
        payout: 1200,
        description: 'NDMA flood warning issued for your zone',
    },
    curfew: {
        label: 'Curfew',
        icon: '🚫',
        color: 'purple',
        bgClass: 'from-purple-600/20 to-indigo-600/20',
        borderClass: 'border-purple-500/30',
        simulatedValue: null,
        payout: 500,
        description: 'Section 144 imposed — deliveries suspended',
    },
};

// ==========================================
// NEW: Activity Feed Events
// ==========================================

export const ACTIVITY_EVENTS = [
    {
        id: 1,
        type: 'rain',
        message: '🌧️ Heavy rainfall detected in Delhi — 78mm recorded',
        payout: 800,
        timestamp: '2:45 PM',
        city: 'Delhi',
        isNew: false,
    },
    {
        id: 2,
        type: 'info',
        message: '📊 Risk score recalculated for Mumbai zone',
        payout: null,
        timestamp: '2:30 PM',
        city: 'Mumbai',
        isNew: false,
    },
    {
        id: 3,
        type: 'aqi',
        message: '😷 AQI spike in Delhi — Level 456 (Severe)',
        payout: 600,
        timestamp: '1:15 PM',
        city: 'Delhi',
        isNew: false,
    },
    {
        id: 4,
        type: 'info',
        message: '✅ 5 workers in Bangalore received payouts',
        payout: null,
        timestamp: '12:40 PM',
        city: 'Bangalore',
        isNew: false,
    },
    {
        id: 5,
        type: 'flood',
        message: '🌊 NDMA flood warning issued for Mumbai',
        payout: 1200,
        timestamp: '11:20 AM',
        city: 'Mumbai',
        isNew: false,
    },
    {
        id: 6,
        type: 'info',
        message: '⚡ Auto-trigger processed for 3 workers in Chennai',
        payout: null,
        timestamp: '10:55 AM',
        city: 'Chennai',
        isNew: false,
    },
    {
        id: 7,
        type: 'curfew',
        message: '🚫 Section 144 imposed in parts of Delhi',
        payout: 500,
        timestamp: '10:10 AM',
        city: 'Delhi',
        isNew: false,
    },
];

// ==========================================
// NEW: AI Predictions
// ==========================================

export const AI_PREDICTIONS = {
    tomorrow: {
        riskLevel: 'HIGH',
        confidence: 87,
        expectedLoss: 800,
        factors: [
            { name: 'Heavy Rain', probability: 82, impact: 'high' },
            { name: 'AQI Spike', probability: 65, impact: 'medium' },
            { name: 'Traffic Surge', probability: 40, impact: 'low' },
        ],
        recommendation: 'Increase coverage now — premium will likely rise by 15% tomorrow',
    },
    nextWeek: {
        riskLevel: 'MODERATE',
        confidence: 72,
        expectedLoss: 1200,
        factors: [
            { name: 'Monsoon Season', probability: 90, impact: 'high' },
            { name: 'Festival Traffic', probability: 55, impact: 'medium' },
        ],
        recommendation: 'Lock in current premium rate before monsoon season begins',
    },
};

// ==========================================
// NEW: City Risk Data
// ==========================================

export const CITY_RISK_DATA = [
    { city: 'Delhi', risk: 0.82, workers: 12500, payouts: 450000 },
    { city: 'Mumbai', risk: 0.78, workers: 15200, payouts: 520000 },
    { city: 'Bangalore', risk: 0.45, workers: 8900, payouts: 180000 },
    { city: 'Hyderabad', risk: 0.52, workers: 6700, payouts: 210000 },
    { city: 'Pune', risk: 0.38, workers: 5400, payouts: 120000 },
    { city: 'Chennai', risk: 0.65, workers: 7800, payouts: 320000 },
];

// ==========================================
// NEW: Pricing History
// ==========================================

export const PRICING_HISTORY = [
    { day: 'Mon', premium: 65, risk: 0.55 },
    { day: 'Tue', premium: 68, risk: 0.58 },
    { day: 'Wed', premium: 71, risk: 0.62 },
    { day: 'Thu', premium: 67, risk: 0.57 },
    { day: 'Fri', premium: 72, risk: 0.65 },
    { day: 'Sat', premium: 75, risk: 0.68 },
    { day: 'Sun', premium: 71, risk: 0.63 },
];

// ==========================================
// NEW: Platform Verification DB Simulation
// ==========================================

export const PLATFORM_WORKERS = {
    "ZEPT123": {
      id: "ZEPT123",
      name: "Raj Kumar",
      platform: "Zepto",
      city: "Mumbai",
      dailyEarning: 1200,
      rating: 4.8,
      tier: "verified"
    },
    "BLINK456": {
      id: "BLINK456",
      name: "Priya Singh",
      platform: "Blinkit",
      city: "Bangalore",
      dailyEarning: 900,
      rating: 4.6,
      tier: "standard"
    }
};
