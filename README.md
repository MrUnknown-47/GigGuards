# GigShield AI — Parametric Insurance for Gig Workers

**AI-powered platform that automatically protects gig workers from income loss caused by weather, pollution, and disruptions.**

---

## 🎯 Executive Summary

GigShield AI is an insurance platform that:
- Automatically detects disruptions (rain, pollution, floods, curfews)
- Triggers instant payouts **without manual claims**
- Uses ML to calculate fair premiums and detect fraud
- Protects gig workers from income loss

**Key Innovation:** Parametric Insurance + Real-time APIs + ML Risk Assessment

---

## 🎯 At a Glance

| What | How | Why |
|------|-----|-----|
| **Problem** | Gig workers lose 20-30% income during disruptions | Rainfall, pollution, floods, curfews |
| **Solution** | Automatic parametric payouts (no manual claim) | Weather APIs trigger payout in seconds |
| **Premium** | ₹71/week (dynamic) | Varies by city risk score |
| **Payout** | Instant (< 2 seconds) | ML calculates income loss automatically |
| **Fraud** | Isolation Forest detects anomalies | 95%+ instant approval rate |
| **Innovation** | 6 advanced features | SHAP, Notifications, Pricing, Tiers, Heatmap, Chatbot |
| **Cost** | ₹0 (all free APIs + hosting) | Vercel, Render, Supabase, HuggingFace |
| **Timeline** | 6 weeks (MVP → Enhanced → Advanced) | Phase 1, 2, 3 phased rollout |

---

## 📖 Quick Navigation

**Understanding the Idea:**
- 👥 [Persona-Based Scenarios](#-persona-based-scenarios) — Real worker examples
- 🔄 [End-to-End Workflow](#-end-to-end-application-workflow) — Week 1-8 journey
- 📊 [Weekly Premium Model](#-weekly-premium-model) — How pricing works

**Core Features:**
- 💰 [Smart Premium Calculation](#-smart-premium-calculation) — Risk scoring + dynamic pricing
- 🔍 [Fraud Detection](#-automated-fraud-detection) — Isolation Forest implementation

**Advanced Features (6 Innovations):**
- 🚀 [Advanced Features](#-advanced-features-6-innovations) — All 6 described in detail

**Technical:**
- 🏗️ [Tech Stack](#-full-tech-stack-breakdown) — Frontend, Backend, ML, APIs
- 📋 [Development Plan](#-phased-development-plan) — 3 phases over 6 weeks
- 🎮 [Demo Flow](#-demo-flow-7-minutes) — How to present

---

## 👥 Persona-Based Scenarios

### Persona 1: Raj Kumar (Mumbai Delivery Driver)

**Profile:**
- Works for Zepto
- Daily income: ₹1,200
- Zone: Andheri East, Mumbai
- Working hours: 6am-11pm

**Scenario: Rain Day Impact**
```
Normal day:      150 orders → ₹1,200 earnings
Rain day (75mm): 50 orders  → ₹400 earnings
Income loss:     ₹800

WITHOUT GigShield:
- Loses ₹800
- Manually files claim next day
- Waits 5-7 days for approval
- Gets ₹600 (75% of loss)
- Total loss: ₹200

WITH GigShield:
- System detects 75mm rainfall
- Payout triggers automatically at 10am
- ₹800 credited to wallet in seconds
- Zero manual work
- Notification: "₹800 payout credited due to heavy rain"
```

### Persona 2: Priya Singh (Bangalore Delivery Worker)

**Profile:**
- Works for Blinkit
- Daily income: ₹900
- Zone: Koramangala
- Working hours: 5am-10pm

**Scenario: Pollution Alert**
```
Day conditions:
- AQI: 425 (very unhealthy)
- Visibility: 100m
- Workers reluctant to work

WITHOUT GigShield:
- Works anyway (needs money)
- Respiratory issues later
- No compensation

WITH GigShield:
- System detects AQI > 400
- Automatic payout: ₹450
- Worker notification: "Take care! Your insurance covers today."
- Worker can rest safely
```

### Persona 3: Ahmed Hassan (Jaipur Curfew Scenario)

**Profile:**
- Works for Amazon Flex
- Daily income: ₹1,100
- Zone: Central Jaipur
- Working hours: 7am-9pm

**Scenario: Curfew During Strike**
```
Day conditions:
- Strike called in city
- News API detects: "City-wide curfew 2pm-6pm"
- Movement restricted

WITHOUT GigShield:
- Can't work during curfew
- Loses ₹550 (5 hours of work)
- No compensation
- Financial stress

WITH GigShield:
- System detects curfew in News API
- Automatic payout: ₹550
- Worker notification: "Curfew detected. ₹550 payout processed."
- Can rest without worrying
```

---

## 🔄 End-to-End Application Workflow

### Week 1: Onboarding & Registration

```
Step 1: Worker Opens App
   ↓
Step 2: Fill Registration Form
   • Name, phone, email
   • City & working zone
   • Delivery platform (Zomato/Swiggy/Blinkit/Zepto)
   • Average daily income
   ↓
Step 3: AI Calculates Risk Score
   • Analyzes city disruption history
   • Weather patterns
   • Traffic conditions
   • Generates risk score (0-1)
   • Delhi: 0.81 (high risk)
   ↓
Step 4: System Shows Premium
   • Base: ₹10
   • Risk: 0.81 × ₹75 = ₹60.75
   • Weekly cost: ₹71
   ↓
Step 5: Worker Buys Policy
   • Pays ₹71
   • Policy active: 7 days
   • Automatic coverage starts
   ↓
Step 6: Notification
   ✅ "You're now protected! Insurance active until Friday."
```

### Week 1-7: Active Coverage

```
System monitors 24/7:

Every 5 minutes:
├─ Weather API checks rainfall
├─ AQI API checks pollution
├─ Traffic API checks congestion
├─ Google Maps API checks traffic conditions
└─ News API checks curfews/strikes

If condition triggers:
   ├─ Rainfall > 60mm → Payout triggered
   ├─ AQI > 400 → Payout triggered
   ├─ Traffic > 90% → Payout triggered
   ├─ Curfew detected → Payout triggered
   └─ Flood alert → Payout triggered

Fraud Check (Isolation Forest):
   • Checks claim patterns
   • Verifies location matches weather
   • Detects anomalies
   → 95% legitimate claims approved instantly
   → 5% suspicious claims flagged for review

Payout Processing:
   • Income loss calculated: ₹750
   • Fraud check: PASSED ✅
   • Worker tier: VERIFIED
   • Payout: Instant (< 5 seconds)
   • Method: Razorpay wallet
   → Worker gets ₹750 in wallet

Worker Notification:
   "₹750 payout received. Heavy rainfall detected at 2:15 PM.
    View breakdown: [Link]"
```

### Week 8: Renewal

```
Day 1-3 of Week 8:
   • New risk score calculated
   • Premium shown dynamically
   • Worker gets renewal offer
   • Can buy for next week or skip

Example:
   "Your new premium: ₹65/week (↓ 8% lower)
    Reason: Fewer disruptions this season
    [Buy Now] [See Pricing Details]"
```

---

## 📊 Weekly Premium Model

### Premium Calculation Logic

```
FORMULA:
Weekly Premium = Base Premium + (Risk Score × Risk Factor)

COMPONENTS:
├─ Base Premium: ₹10 (weekly minimum)
├─ Risk Score: 0-1 (city disruption likelihood)
└─ Risk Factor: ₹75 (multiplier for risk)

EXAMPLES:

Delhi (High Risk: 0.81):
   ₹10 + (0.81 × ₹75) = ₹71/week

Bangalore (Low Risk: 0.45):
   ₹10 + (0.45 × ₹75) = ₹44/week

Mumbai Monsoon (Very High: 0.95):
   ₹10 + (0.95 × ₹75) = ₹81/week

Jaipur Off-season (Very Low: 0.25):
   ₹10 + (0.25 × ₹75) = ₹29/week
```

### Parametric Triggers (Automatic Payouts)

| Trigger | Threshold | Payout |
|---------|-----------|--------|
| **Rainfall** | > 60mm | Income loss estimate |
| **AQI** | > 400 | Income loss estimate |
| **Traffic** | > 90% congestion | Income loss estimate |
| **Flood Alert** | Active | Income loss estimate |
| **Curfew/Strike** | Detected | Income loss estimate |

**Key Point:** Payouts trigger **automatically** — no manual claim needed.

---

## 💰 Smart Premium Calculation

### Dynamic Risk Scoring

The system continuously updates risk scores based on:

```
RISK FACTORS:
├─ Historical rainfall (past 10 years)
├─ Flood zone proximity
├─ Air quality patterns
├─ Traffic baseline
├─ Worker claim history
└─ Current season/weather patterns

MODEL: Random Forest Classifier
├─ Trained on Indian weather datasets
├─ Updated weekly
├─ 85%+ accuracy
└─ Explainable (shows top 3 factors)

EXAMPLE OUTPUT:
"Delhi risk: 0.81
Top factors:
  • Monsoon history: +0.35
  • Traffic congestion: +0.28
  • Flood zone: +0.18"
```

### Income Loss Prediction

When a trigger fires, system calculates compensation:

```
PREDICTION MODEL: RandomForestRegressor

INPUT FEATURES:
├─ Normal daily income
├─ Orders completed today
├─ Working hours
├─ Weather conditions
├─ Traffic level
└─ City

OUTPUT: Estimated income loss in ₹

EXAMPLE:
Normal earnings: ₹1,200 (150 orders)
Rainy day orders: 50
Predicted earnings: ₹400
Loss: ₹800
Model confidence: 94%

PAYOUT: ₹800 (instant)
```

---

## 🔍 Automated Fraud Detection

### Fraud Detection Model (Isolation Forest)

Detects suspicious claims automatically:

```
ANOMALY DETECTION:
├─ Claim frequency (≤3/month normal)
├─ Location consistency (GPS continuity)
├─ Weather match (rain prediction vs claim)
├─ Behavioral patterns
└─ Payment history

FRAUD FLAGS:
❌ 10 claims in 15 days (extreme frequency)
❌ Worker location jumps 500km in 1 hour
❌ Claims spike before expensive purchase
❌ Weather data shows no rain but claims heavy rain

ACTION:
├─ Anomaly score < 0.3: APPROVE instantly ✅
├─ Anomaly score 0.3-0.7: 2-4 hour review ⚠️
└─ Anomaly score > 0.7: Manual investigation ❌

RESULT:
95%+ legitimate claims processed instantly
Fraud attempts blocked before payout
```

---

## 🔐 Adversarial Defense & Anti-Spoofing Strategy

### 🚨 The Problem

Recent simulations revealed a critical vulnerability: coordinated groups of delivery workers can exploit **GPS spoofing** to fake their location inside high-risk zones (e.g., heavy rainfall areas) and trigger false payouts at scale. Relying solely on GPS-based validation is insufficient and can lead to mass fraud and liquidity drain.

### 🧠 Our Solution: Multi-Signal AI Fraud Defense System

GigShield AI introduces a **multi-layered adversarial defense architecture** that goes beyond GPS verification by analyzing behavioral, environmental, and network-level signals. Instead of trusting a single data point, the system validates real-world consistency using multiple independent signals.

---

### 🔍 Multi-Signal Verification Engine

| Signal | Data Source | Fraud Indicator |
|--------|------------|-----------------|
| **📍 Movement Pattern Analysis** | Speed consistency, route continuity, distance covered | Static location or teleport-like jumps |
| **📱 Device Sensor Validation** | Accelerometer & gyroscope data | Device remains static during claimed activity |
| **🌐 Network & IP Cross-Verification** | GPS location vs IP-based location vs mobile tower triangulation | Mismatched geo-locations (e.g., GPS = Delhi, IP = Noida) |
| **🌧 Environmental Consistency** | Real-time weather APIs, nearby worker data | Isolated claim not matching surrounding conditions |
| **👥 Group Behavior Analysis** | Clustering of simultaneous claims, movement inactivity patterns | Coordinated fraud rings with similar behavior |

---

### 🤖 AI/ML Models for Fraud Detection

**Behavior Classification Model** — *Random Forest / XGBoost*
- Classifies workers as `REAL` vs `SUSPICIOUS`
- Features: speed, movement variance, delivery activity, session duration

**Anomaly Detection Model** — *Isolation Forest*
- Detects unusual claim patterns: repeated claims, abnormal inactivity, inconsistent behavior

**Graph-Based Fraud Detection** — *Advanced*
- Builds a worker interaction graph (nodes = workers, edges = behavioral similarity)
- Detects coordinated fraud clusters and syndicate-level attacks

---

### ⚖️ UX Balance Strategy (Fairness for Workers)

Honest workers are never penalized. The system uses a **tiered response model**:

| Risk Level | Action | Worker Communication |
|------------|--------|---------------------|
| 🟢 **Low** | Instant payout | Standard confirmation |
| 🟡 **Medium** | Delayed payout + additional verification | *"We are verifying your claim due to unusual activity. Your payout will be processed shortly."* |
| 🔴 **High** | Claim flagged for review + AI re-validation | Manual review notification |

---

### ⭐ Dynamic Trust Score System

Each worker is assigned a **Trust Score (0–100)** based on:
- Historical behavior & claim consistency
- Fraud signal frequency
- Verification pass rate

| Trust Level | Score Range | Effect |
|-------------|------------|--------|
| High Trust | 80–100 | Faster payouts, reduced checks |
| Normal Trust | 50–79 | Standard verification |
| Low Trust | 0–49 | Stricter validation, manual review |

---

### 🏗 Fraud Defense Architecture

```
┌──────────────────────────────────┐
│     Fraud Intelligence Layer     │
│  (Weather, GPS, IP, Sensors)     │
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│  Multi-Signal Verification Engine│
│  (5 independent signal checks)   │
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│   Behavior Model + Anomaly       │
│   Detection + Graph Analysis     │
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│       Trust Score Engine         │
│       (Dynamic 0-100 score)      │
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│     Claim Decision System        │
│  (Approve / Delay / Flag)        │
└──────────────────────────────────┘
```

### 🚀 Impact

- **Prevents** large-scale payout exploitation via GPS spoofing
- **Ensures** platform sustainability and liquidity protection
- **Protects** genuine gig workers from being penalized
- **Builds trust** in the parametric insurance ecosystem through multi-signal behavioral intelligence

---
GigShield AI — Protecting gig workers from disruptions, one payout at a time.

---

## 🚀 Advanced Features (6 Innovations)

These features make GigShield stand out from typical hackathon projects.

### 1. 🤖 Explainable AI Dashboard (SHAP)

**What:** Show workers exactly WHY they received a payout using SHAP feature importance.

**Example:**
```
PAYOUT: ₹850

Breakdown:
├─ Rainfall impact:   75% (₹637) ███████████████
├─ AQI impact:        15% (₹127) ███
└─ Traffic impact:    10% (₹85)  ██

Model confidence: 94%
```

**Why it wins:**
- Builds trust through transparency
- Judges see real ML understanding (not just data)
- Differentiator (most platforms don't explain)

**Tech:** Python SHAP library + TreeExplainer

---

### 2. 📢 Predictive Notifications (6-12 hours ahead)

**What:** Alert workers BEFORE disruptions happen using weather forecasts.

**Example:**
```
Friday 2:30 PM notification:

"Heavy rain predicted tomorrow 6am-10am in Andheri East.
Your insurance is active. Earnings protected: ₹700-800.
Click to increase coverage."
```

**Why it wins:**
- Workers can prepare ahead
- Shows system is predictive (not just reactive)
- Higher claim accuracy (forecasts are 80%+ accurate)
- Judges love foresight

**Tech:** OpenWeather 5-day forecast API + scheduled tasks

---

### 3. 💹 Dynamic Premium Pricing (Hourly updates)

**What:** Adjust premiums hourly based on forecasted disruptions.

**Example:**
```
Monday:    ₹71/week  (Low disruption)
Wednesday: ₹85/week  (70% rain forecast) ↑ +19%
Thursday:  ₹95/week  (Rain + AQI high)   ↑ +34%
Friday:    ₹72/week  (Rain clears)       ↓ -24%
```

**Why it wins:**
- Real business logic (not fixed pricing)
- Revenue optimization
- Fair to workers (cheaper when safe)
- Encourages buying at optimal times

**Tech:** ML risk prediction + real-time forecast APIs

---

### 4. ⭐ Worker Reputation Tiers (Fraud prevention)

**What:** Categorize workers into tiers based on behavior and claim history.

**Tiers:**
```
TIER 1: VERIFIED (5+ claims, 0 fraud flags)
├─ 100% payout
├─ Instant processing (0 hours)
└─ Priority support

TIER 2: STANDARD (Default)
├─ 100% payout
├─ 2-4 hour review
└─ Standard support

TIER 3: REVIEW (Suspicious activity)
├─ 80% payout (20% held)
├─ 24-48 hour manual review
└─ Limited support
```

**Why it wins:**
- Drastically reduces fraud
- Incentivizes good behavior
- Fair to new workers (still get paid)
- Scalable (no manual review for Tier 1)

**Tech:** ML tier scoring + Isolation Forest anomaly detection

---

### 5. 🌍 Disaster Prediction Heatmap (Risk Intelligence Map)

**What:** A real-time AI-powered risk heatmap that predicts disruption hotspots across a city using weather forecasts, historical disaster data, and traffic patterns.

**Example Conversations:**
```
Mumbai Risk Heatmap (Tomorrow)

LOW RISK      🟢
MEDIUM RISK   🟡
HIGH RISK     🔴
EXTREME RISK  🟣

Zones:

Andheri East      🔴 Heavy rainfall forecast
Bandra West       🟡 Moderate traffic disruption
Lower Parel       🟣 Flood risk detected
Powai             🟢 Normal conditions
```

**Why it wins:**
- Workers can avoid dangerous routes
- Insurance pricing becomes more accurate
- Fraud detection improves (verify real disruptions)

**Tech:** Leaflet.js for interactive risk map openheatmaps

---

### 6. 💬 AI Chatbot (24/7 Support)

**What:** Answer worker questions about claims, premiums, weather using LLM.

**Example Conversations:**
```
Worker: "Why did I get ₹750 payout?"
Bot: "Heavy rainfall detected (72mm > 60mm threshold).
     Estimated income loss: ₹750.
     [View detailed breakdown]"

Worker: "Will it rain tomorrow?"
Bot: "85% rain probability tomorrow.
     Expecting 45mm rainfall.
     Your current premium: ₹85/week.
     [Buy extra coverage?]"

Worker: "How is my premium calculated?"
Bot: "Your risk score: 0.72 (Mumbai, monsoon).
     Base ₹10 + Risk ₹60.75 = ₹71/week.
     Current surge: +₹14 (rain forecast).
     Total: ₹85/week (expires Friday 8pm)."
```

**Why it wins:**
- 24/7 support (no hiring needed)
- Reduces support tickets
- Better worker experience
- Shows full AI integration

**Tech:** HuggingFace transformers (free LLM) + context from database

---

## 📊 Feature Timeline

```
PHASE 1 (Weeks 1-2): MVP
├─ Core insurance
├─ Risk scoring
├─ Parametric triggers
└─ Basic fraud detection

PHASE 2 (Weeks 3-4): Enhanced
├─ ✅ Explainable AI (SHAP)
├─ ✅ Predictive Notifications
├─ ✅ Worker Tiers
└─ Web + Mobile dashboards

PHASE 3 (Weeks 5-6): Advanced
├─ ✅ Dynamic Premium Pricing
├─ ✅ AI Chatbot
├─ Risk heatmap
└─ Admin simulation engine

RESULT: Production-grade insurance platform
```

---

## 🏗️ Full Tech Stack Breakdown

### Tech Stack by Feature

| Feature | Frontend | Backend | ML | APIs |
|---------|----------|---------|----|----|
| **Core Insurance** | Dashboard | Risk calculator | Random Forest | Weather, AQI |
| **🤖 Explainable AI** | SHAP charts | TreeExplainer | SHAP library | — |
| **📢 Notifications** | Push alerts | Scheduler | Forecast model | OpenWeather 5-day |
| **💹 Dynamic Pricing** | Price display | Hourly updater | Risk scoring | Forecast APIs |
| **⭐ Reputation Tiers** | Tier badge | Tier calculator | Tier ML model | — |
| **🛰️ Disaster Prediction Heatmap** | Risk Map | HeatMap API | Risk detection | Google Maps, GEE |
| **💬 AI Chatbot** | Chat UI | Chatbot service | HuggingFace LLM | — |

---

### Frontend Layer

| Technology | Purpose | Why |
|-----------|---------|-----|
| **Next.js** | Web app | Fast, SEO, real-time updates |
| **React** | UI components | Industry standard |
| **Tailwind CSS** | Styling | Fast, responsive |
| **Leaflet.js** | Risk heatmap | Open-source, free |

### Backend Layer

| Technology | Purpose | Why |
|-----------|---------|-----|
| **FastAPI** | REST API | Python, async, fast |
| **PostgreSQL** | Database | ACID compliance, free (Supabase) |
| **Redis** | Caching | Real-time triggers |
| **JWT** | Authentication | Secure, stateless |

### ML/AI Layer

| Technology | Purpose | Model |
|-----------|---------|-------|
| **scikit-learn** | Risk scoring | Random Forest |
| **scikit-learn** | Income loss | Random Forest Regressor |
| **scikit-learn** | Fraud detection | Isolation Forest |
| **SHAP** | Explainability | Feature importance |
| **pandas** | Data processing | Feature engineering |

### External APIs (Free Tier)

| API | Purpose | Calls/day |
|-----|---------|-----------|
| **OpenWeather** | Rainfall, temperature | 1,000 free |
| **AQICN** | Air quality index | 500 free |
| **News API** | Curfews, strikes | 100 free |
| **Google Maps** | Traffic congestion | 25K free |
| **HeatMap API** | Map hotspots | Unlimited |

### Hosting

| Service | Component | Cost |
|---------|-----------|------|
| **Vercel** | Frontend | Free tier (Hobby) |
| **Render** | Backend | Free tier (Hobby) |
| **Supabase** | Database | Free tier (500MB) |
| **HuggingFace Spaces** | ML models | Free tier |

**Total Cost: ₹0**

---

## 📋 Phased Development Plan

### Phase 1: MVP (Weeks 1-2)

**Goal:** Core insurance platform with parametric triggers

```
Week 1:
├─ Backend setup (FastAPI + Supabase)
├─ Worker registration API
├─ Risk scoring model training
└─ Premium calculation logic

Week 2:
├─ Weather API integration
├─ Trigger engine implementation
├─ Payout simulation
└─ Basic fraud detection
```

**Deliverables:**
- ✅ Worker can register
- ✅ Premium calculates dynamically
- ✅ System detects rainfall and triggers payout
- ✅ Basic fraud detection works

---

### Phase 2: Enhanced Features (Weeks 3-4)

**Goal:** Production-ready features + 3 Advanced Features

```
Week 3:
├─ Frontend (Next.js) dashboard
├─ 🤖 SHAP Explainability (Feature 1)
│  └─ Show "why" breakdown for every payout
├─ 📢 Predictive Notifications (Feature 2)
│  └─ 6-12 hour alerts before disruptions
└─ ⭐ Worker Reputation Tiers (Feature 4)
   └─ VERIFIED/STANDARD/REVIEW tiers

Week 4:
├─ Admin dashboard
├─ Fraud analytics
├─ AQI + Traffic triggers
├─ Curfew detection (News API)
└─ Real-time notification system
```

**Deliverables:**
- ✅ Worker sees "Why ₹750?" with SHAP breakdown
- ✅ Workers get alerts 6 hours before rain
- ✅ Verified workers get instant payouts
- ✅ Admin sees fraud flags in real-time
- ✅ All parametric triggers working

---

### Phase 3: Advanced Features (Weeks 5-6)

**Goal:** Differentiation + Innovation (3 More Advanced Features)

```
Week 5:
├─ 💹 Dynamic Premium Pricing (Feature 3)
│  └─ Hourly premium updates based on forecast
└─ 💬 AI Chatbot (Feature 6)
   └─ LLM-powered worker support

Week 6:
├─ Risk heatmap visualization (Leaflet.js)
├─ Simulation engine (admin can simulate rain)
└─ Business analytics dashboard
```

**Deliverables:**
- ✅ Premium updates hourly (₹71 → ₹85 → ₹72 as forecast changes)
- ✅ Chatbot answers: "Why payout?", "When rain?", "How calculate?"
- ✅ Heatmap shows flood zones + high-risk areas
- ✅ Admin can simulate rainstorm and see affected workers
- ✅ Dashboard shows: workers insured, revenue, fraud rate

---

## 🌐 Deployment Options

### Option 1: Web-First (Recommended for Hackathon)

```
ARCHITECTURE:
Frontend (Next.js)          Backend (FastAPI)           Database (PostgreSQL)
├─ Worker dashboard         ├─ REST APIs                ├─ Workers
├─ Admin dashboard          ├─ Trigger engine           ├─ Policies
├─ Claims page              ├─ Risk calculator          ├─ Claims
├─ Chatbot widget           ├─ Fraud detector           └─ Payouts
└─ Notifications            └─ Payment handler

HOSTING:
Frontend:  Vercel (vercel.com)
Backend:   Render (render.com)
Database:  Supabase (supabase.com)
ML:        HuggingFace Spaces

SETUP TIME: 2 hours
DEPLOYMENT TIME: 15 minutes
COST: ₹0
```

**Why Web First:**
- Faster to develop
- Works on all devices
- Easy to demo
- No app store review

---

### Option 2: Mobile-First (Post-Hackathon)

```
STACK:
React Native / Expo
├─ iOS app
├─ Android app
└─ Same backend (FastAPI)

BENEFITS:
├─ Push notifications
├─ Offline mode
├─ Native performance
└─ Higher engagement

TIMELINE: 4-6 weeks post-hackathon
```

**Technical Justification:**
- Workers use phones more than web
- Push notifications = higher retention
- Native app = better UX
- Same backend = minimal additional work

---

## 🎮 Demo Flow (7 Minutes)

### Demo Sequence

```
1. REGISTRATION (1 min)
   ├─ Create test worker: Raj, Delhi, Zomato, ₹1,200/day
   ├─ System calculates risk: 0.81
   ├─ Premium shown: ₹71/week
   └─ Worker buys policy: ✅ Registered

2. PREMIUM CALCULATION (30 sec)
   ├─ Show risk score breakdown
   ├─ Explain: ₹10 base + ₹60.75 risk = ₹71
   └─ Highlight: Dynamic pricing changes hourly

3. LIVE MONITORING (1 min)
   ├─ Show weather API updating
   ├─ Show traffic API updating
   ├─ Show AQI API updating
   └─ Point: "System watches 24/7"

4. SIMULATE DISRUPTION (2 min)
   ├─ Admin clicks: "Simulate heavy rainfall"
   ├─ System detects: 75mm rainfall
   ├─ Fraud check: ✅ Passed
   ├─ Income loss calculated: ₹800
   └─ Status: "Payout triggered"

5. AUTOMATIC PAYOUT (1 min)
   ├─ Show payout processing
   ├─ Display SHAP explanation (why ₹800?)
   │  • Rainfall: 75% impact (₹600)
   │  • Traffic: 25% impact (₹200)
   ├─ Razorpay confirmation: ✅ ₹800 transferred
   └─ Worker notification: "₹800 credited"

6. DASHBOARDS (1.5 min)
   ├─ Worker dashboard: "Protected earnings: ₹800"
   ├─ Admin dashboard: "Payouts today: ₹800, Workers: 1"
   ├─ Fraud dashboard: "0 flags, 100% approval rate"
   └─ Analytics: "Claim approved in 2 seconds"

DEMO ENDS: Complete working system demonstrated
```

---

## 🏆 Why This Project stands out:

### Problem
Gig workers lose 20-30% income during disruptions. Traditional insurance requires manual claims (slow, bureaucratic).

### Solution
Parametric insurance + real-time APIs + ML = **instant automatic payouts**.

### Differentiation

| Aspect | Typical Project | GigShield AI |
|--------|-----------------|-------------|
| Claims | Manual form filling | Automatic detection |
| Processing | 5-7 days | Instant (< 2 seconds) |
| Fraud | Rules-based | ML anomaly detection |
| Risk | Fixed | Dynamic ML scoring |
| Insights | Dashboard only | SHAP explanations |
| Predictions | None | 6-12 hour forecasts |

### Core Strengths

**Foundation:**
- ✅ **Real problem** — Gig workers actually lose 20-30% income during disruptions
- ✅ **AI-driven** — 3 ML models (risk scoring, income loss, fraud detection)
- ✅ **Live APIs** — Weather, AQI, Traffic, News (real data, not hardcoded)
- ✅ **Parametric innovation** — Auto-triggers are novel vs manual claim processes
- ✅ **Production-ready** — Looks like real product, not prototype
- ✅ **Scalable architecture** — Design works for 100K workers
- ✅ **Business model** — Sustainable weekly pricing with dynamic adjustments

### 6 Advanced Features 

| Feature | What | Why Impressive |
|---------|------|-----------------|
| **🤖 Explainable AI (SHAP)** | Show exactly why payouts happened | Trust through transparency |
| **📢 Predictive Notifications** | Alert workers 6-12 hours before rain | Proactive not reactive |
| **💹 Dynamic Pricing** | Hourly premium updates (₹71 → ₹85 → ₹72) | Real business logic |
| **⭐ Reputation Tiers** | VERIFIED/STANDARD/REVIEW based on history | Fraud prevention at scale |
| **🛰️ Disaster Prediction Heatmap** | HeatMap verifies risk  | Space tech + accuracy |
| **💬 AI Chatbot** | LLM answers worker questions 24/7 | Full AI integration |

---

## 🚀 Quick Start

### Prerequisites
```bash
Python 3.9+
Node.js 16+
PostgreSQL (or Supabase)
Git
```

### Setup Backend

```bash
# Clone repo
git clone https://github.com/MrUnknown-47/gigshield-ai.git
cd gigshield-ai/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train ML models
python ml_models/train_all.py

# Start server
uvicorn app:app --reload
```

Backend runs at: `http://localhost:8000`

### Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:3000`

### Access

```
Worker app: http://localhost:3000
Admin panel: http://localhost:3000/admin
API docs: http://localhost:8000/docs
```

---

## 📁 Repository Structure

```
gigshield-ai/
│
├── README.md                     (This file)
├── ADVANCEMENTS.md              (6 advanced features)
├── ARCHITECTURE.md              (System design)
│
├── frontend/
│   ├── pages/
│   │   ├── index.js            (Home)
│   │   ├── register.js         (Onboarding)
│   │   ├── dashboard.js        (Worker dashboard)
│   │   └── admin.js            (Admin panel)
│   ├── components/
│   │   ├── PremiumCard.jsx
│   │   ├── ClaimHistory.jsx
│   │   └── ChatBot.jsx
│   └── package.json
│
├── backend/
│   ├── app.py                  (FastAPI main)
│   ├── routes/
│   │   ├── workers.py
│   │   ├── policies.py
│   │   ├── claims.py
│   │   └── admin.py
│   ├── services/
│   │   ├── risk_calculator.py
│   │   ├── trigger_engine.py
│   │   └── fraud_detector.py
│   ├── models/
│   │   ├── database.py
│   │   └── schemas.py
│   └── requirements.txt
│
├── ml_models/
│   ├── risk_model/
│   │   ├── train.py
│   │   └── model.pkl
│   ├── income_model/
│   │   ├── train.py
│   │   └── model.pkl
│   └── fraud_model/
│       ├── train.py
│       └── model.pkl
│
└── datasets/
    ├── weather.csv
    ├── rainfall.csv
    ├── aqi.csv
    └── disasters.csv
```

---

**Built for Hackathon 2026**

GigShield AI — Protecting gig workers from disruptions, one payout at a time.
