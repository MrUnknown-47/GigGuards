# 🏗 GigShield AI — System Architecture

GigShield AI is designed as a **real-time event-driven insurance platform** that detects disruptions and triggers payouts automatically.

---

# High-Level Architecture

Worker App
    ↓
Frontend (Next.js)
    ↓
Backend API (FastAPI)
    ↓
ML Decision Layer
    ↓
Trigger Engine
    ↓
Payout System

---

# Core System Layers

## 1. Data Ingestion Layer

Collects real-time environmental signals.

Sources:

• Weather APIs (rainfall, temperature)  
• AQI APIs (air pollution levels)  
• Traffic APIs (congestion data)  
• Disaster datasets (flood alerts)  
• Worker behavioral data  

These signals are continuously monitored.

---

# 2. ML Decision Layer

GigShield uses three machine learning models.

### Risk Prediction Model
RandomForestClassifier

Predicts disruption risk for a worker's location.

Output:
Risk Score (0–1)

Used for premium calculation.

---

### Income Loss Prediction Model
RandomForestRegressor

Estimates how much income a worker loses during disruptions.

Output:
Estimated payout amount.

---

### Fraud Detection Model
IsolationForest

Detects suspicious claims using anomaly detection.

Signals analyzed:

• claim frequency  
• GPS movement patterns  
• environmental consistency  
• worker behavior  

---

# 3. Trigger Engine

The trigger engine checks parametric conditions.

Example triggers:

Rainfall > 60mm  
AQI > 400  
Traffic congestion > 90%  
Flood alerts active  

When a trigger fires:

1. Income loss model calculates payout  
2. Fraud model verifies legitimacy  
3. Payout is processed automatically

---

# 4. Payout Layer

Once validated:

Payout amount is credited instantly.

Possible integrations:

• Razorpay  
• UPI wallet  
• internal wallet system

---

# 5. User Interface Layer

Workers access GigShield through a web dashboard.

Features:

• risk score visualization  
• policy purchase  
• payout history  
• disruption alerts  
• chatbot support  

---

# 6. Admin Dashboard

Admins monitor system health.

Metrics:

• total workers insured  
• payouts processed  
• fraud alerts  
• disruption patterns  

---

# Deployment Architecture

Frontend:  
Vercel (Next.js)

Backend:  
Render / FastAPI

Database:  
Supabase PostgreSQL

ML Models:  
Python scikit-learn

Map Visualization:  
Leaflet.js

AI Chatbot:  
HuggingFace Transformers

---

# Event Flow Example

Heavy rainfall detected (75mm)

↓  

Trigger engine fires

↓  

Income loss predicted = ₹800

↓  

Fraud model validates claim

↓  

Payout processed

↓  

Worker receives ₹800 instantly

---

# Scalability

GigShield is designed to support **thousands of workers simultaneously** using:

• stateless backend APIs  
• modular ML services  
• cloud-based infrastructure  

---

# Vision

GigShield AI transforms traditional insurance by making it:

• automatic  
• real-time  
• transparent  
• worker-centric