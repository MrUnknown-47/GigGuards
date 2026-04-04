// ==========================================
// GigGuards AI — Landing Page (Premium)
// ==========================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedCounter from '../components/AnimatedCounter';
import LiveTicker from '../components/LiveTicker';
import {
    HiOutlineShieldCheck,
    HiOutlineBolt,
    HiOutlineCpuChip,
    HiOutlineBanknotes,
    HiOutlineCloudArrowDown,
    HiOutlineChartBarSquare,
    HiOutlineUserGroup,
    HiOutlineClock,
    HiOutlineSparkles,
    HiOutlineStar,
} from 'react-icons/hi2';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
    }),
};

const stats = [
    { value: 50000, label: 'Workers Protected', suffix: '+' },
    { value: 2.1, label: 'Payouts Disbursed', prefix: '₹', suffix: 'Cr', decimals: 1 },
    { value: 30, label: 'Payout Time', prefix: '<', suffix: 's' },
    { value: 99.7, label: 'Uptime', suffix: '%', decimals: 1 },
];

const features = [
    {
        icon: HiOutlineCpuChip,
        title: 'AI Risk Scoring',
        description: 'ML-powered risk assessment using weather, AQI, traffic & historical data',
        color: 'from-purple-500 to-indigo-500',
    },
    {
        icon: HiOutlineBolt,
        title: 'Auto Triggers',
        description: 'No manual claims — payouts trigger automatically when conditions are met',
        color: 'from-amber-500 to-orange-500',
    },
    {
        icon: HiOutlineBanknotes,
        title: 'Instant Payouts',
        description: 'Funds credited to UPI within 30 seconds of trigger detection',
        color: 'from-emerald-500 to-teal-500',
    },
    {
        icon: HiOutlineShieldCheck,
        title: 'Fraud Detection',
        description: 'Built-in anomaly detection prevents fraudulent claims automatically',
        color: 'from-rose-500 to-pink-500',
    },
];

const howItWorks = [
    {
        step: '01',
        icon: HiOutlineUserGroup,
        title: 'Worker Enrolls',
        description: 'Gig worker signs up and selects an insurance plan based on their risk profile',
    },
    {
        step: '02',
        icon: HiOutlineCloudArrowDown,
        title: 'AI Monitors Events',
        description: 'Our AI continuously monitors weather, AQI, traffic and government alerts',
    },
    {
        step: '03',
        icon: HiOutlineChartBarSquare,
        title: 'Trigger Detected',
        description: 'When conditions exceed thresholds, the system auto-detects the disruption',
    },
    {
        step: '04',
        icon: HiOutlineBanknotes,
        title: 'Instant Payout',
        description: 'Payout is calculated and credited instantly — zero paperwork, zero delay',
    },
];

const testimonials = [
    {
        name: 'Amit Verma',
        role: 'Delivery Partner, Zomato',
        city: 'Delhi',
        quote: 'Got ₹800 automatically when it rained heavily. No forms, no waiting. This is what insurance should be.',
        rating: 5,
    },
    {
        name: 'Sneha Iyer',
        role: 'Driver, Uber',
        city: 'Mumbai',
        quote: 'During the floods, I received ₹1,200 within 30 seconds. GigGuards literally saved my week.',
        rating: 5,
    },
    {
        name: 'Ravi Patel',
        role: 'Delivery Partner, Swiggy',
        city: 'Bangalore',
        quote: 'The AI predicts risks before they happen. I feel genuinely protected now.',
        rating: 5,
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1.5s' }} />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary-400/30 rounded-full"
                        animate={{
                            y: [0, -120, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 3,
                            repeat: Infinity,
                            delay: i * 0.7,
                        }}
                        style={{
                            left: `${10 + Math.random() * 80}%`,
                            top: `${20 + Math.random() * 60}%`,
                        }}
                    />
                ))}

                <div className="relative max-w-6xl mx-auto px-4 text-center pt-24">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Now protecting 50,000+ gig workers across India
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
                    >
                        <span className="text-white">AI-Powered</span>
                        <br />
                        <span className="gradient-text">Income Protection</span>
                        <br />
                        <span className="text-white">for Gig Workers</span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Parametric insurance that automatically detects disruptions — heavy rain, poor AQI,
                        floods — and instantly pays out. No claims. No paperwork. Just protection.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/dashboard" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                            <HiOutlineBolt className="w-5 h-5" />
                            Open Dashboard
                        </Link>
                        <Link to="/buy-policy" className="btn-secondary text-base px-8 py-4">
                            View Plans →
                        </Link>
                    </motion.div>

                    {/* Stats with Animated Counters */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
                    >
                        {stats.map((stat, i) => (
                            <div key={i} className="glass-card p-5 hover:bg-white/10 transition-colors duration-300 group">
                                <div className="text-2xl md:text-3xl font-bold gradient-text">
                                    <AnimatedCounter
                                        value={stat.value}
                                        prefix={stat.prefix || ''}
                                        suffix={stat.suffix || ''}
                                        decimals={stat.decimals || 0}
                                        duration={2}
                                    />
                                </div>
                                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Live Ticker */}
            <LiveTicker />

            {/* Features Section */}
            <section className="py-24 relative">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        className="text-center mb-16"
                    >
                        <motion.span variants={fadeUp} custom={0} className="text-primary-400 text-sm font-semibold uppercase tracking-wider">
                            Why GigGuards?
                        </motion.span>
                        <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-white mt-3">
                            Built Different. Built for You.
                        </motion.h2>
                        <motion.p variants={fadeUp} custom={2} className="text-gray-400 mt-4 max-w-2xl mx-auto">
                            Traditional insurance fails gig workers. We reimagined it from scratch with AI.
                        </motion.p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-50px' }}
                                variants={fadeUp}
                                custom={i}
                                className="glass-card-hover p-8 group"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-900/5 via-primary-900/10 to-transparent" />
                <div className="relative max-w-6xl mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        className="text-center mb-16"
                    >
                        <motion.span variants={fadeUp} custom={0} className="text-primary-400 text-sm font-semibold uppercase tracking-wider">
                            How It Works
                        </motion.span>
                        <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-white mt-3">
                            From Disruption to Payout in Seconds
                        </motion.h2>
                    </motion.div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {howItWorks.map((item, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-50px' }}
                                variants={fadeUp}
                                custom={i}
                                className="relative"
                            >
                                <div className="glass-card p-6 text-center h-full hover:bg-white/10 transition-colors duration-300 group">
                                    <span className="text-5xl font-black text-primary-500/20 absolute top-3 left-5">{item.step}</span>
                                    <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-4 mt-4 group-hover:scale-110 transition-transform">
                                        <item.icon className="w-7 h-7 text-primary-400" />
                                    </div>
                                    <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                                </div>
                                {i < 3 && (
                                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 text-primary-500/30 text-2xl">→</div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 relative">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        className="text-center mb-16"
                    >
                        <motion.span variants={fadeUp} custom={0} className="text-primary-400 text-sm font-semibold uppercase tracking-wider">
                            Testimonials
                        </motion.span>
                        <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-white mt-3">
                            Loved by Gig Workers
                        </motion.h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                                className="glass-card-hover p-6"
                            >
                                <div className="flex gap-0.5 mb-3">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <HiOutlineStar key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-400 flex items-center justify-center text-sm font-bold text-white">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm">{t.name}</p>
                                        <p className="text-gray-500 text-xs">{t.role} · {t.city}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="glass-card p-12 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10" />
                        <div className="relative">
                            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-medium mb-4">
                                <HiOutlineSparkles className="w-3 h-3" />
                                Limited Time Offer
                            </motion.div>
                            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to Protect Your Income?
                            </motion.h2>
                            <motion.p variants={fadeUp} custom={2} className="text-gray-400 mb-8 max-w-lg mx-auto">
                                Join 50,000+ gig workers who never worry about income loss from disruptions.
                            </motion.p>
                            <motion.div variants={fadeUp} custom={3}>
                                <Link to="/buy-policy" className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2">
                                    <HiOutlineShieldCheck className="w-5 h-5" />
                                    Get Protected Now
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-gray-500 text-sm">
                        © 2026 GigGuards · Parametric Insurance for India's Gig Economy
                    </p>
                </div>
            </footer>
        </div>
    );
}
