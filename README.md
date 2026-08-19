# BharathShield — Multilingual Phishing SMS Detection & Alert System

**Project ID:** AP-083  
**Category:** Software (Cybersecurity + Regional Language Accessibility)  
**Tagline:** Understand. Detect. Stay Safe. (తెలుసుకోండి. గుర్తించండి. సురక్షితంగా ఉండండి. / समझें। पहचानें। सुरक्षित रहें। / புரிந்துகொள்ளுங்கள். கண்டறியுங்கள். பாதுகாப்பாக இருங்கள்.)

---

## 🛡️ Project Overview

**PhishGuard** is an accessible, cybersecurity-grade mobile and desktop web application engineered to detect, score, and explain SMS phishing scams in **English, Telugu, Hindi, and Tamil**.

The system utilizes an explainable multi-stage hybrid detection engine (Unicode Normalizer -> Regional Language Detector -> URL Analysis -> Multilingual Keyword Matching -> Context/False-Positive Guard -> Sender Verification -> Scam Classifier -> Score & Confidence Calculation -> Localized Explainer) and provides actionable safety recommendations tailored for non-technical and regional-language users.

---

## 🌟 Key Features

1. **Multilingual Regional Accessibility**: Full i18n support across **English (en)**, **Telugu (te)**, **Hindi (hi)**, and **Tamil (ta)** with instant switching and persistence.
2. **Code-Mixed Language Analysis**: Accurately detects and analyzes mixed script messages (e.g. Telugu script + English words like "మీ account block అవుతుంది. Click link").
3. **False-Positive Protection Guard**: Prevents false alarms on legitimate bank OTPs and transactional SMS with safety warnings ("Do not share") while flagging coercive phishing threats.
4. **Transparent Risk Score & Confidence**: Separates **Risk Score (0-100)** from **Detection Confidence (%)** with itemized signal contributions (`+30 URL`, `+25 Credential`, etc.).
5. **URL Security Analysis**: Analyzes HTTP vs HTTPS, IP-based links, shorteners (`bit.ly`, `tinyurl`), suspicious TLDs (`.xyz`, `.top`), and brand/domain mismatches.
6. **Localized Scam Classification**: Categorizes threats into **KYC Verification Scam**, **Account Blocking Fraud**, **Bank Impersonation**, **Lottery Scam**, **UPI Fraud**, and **OTP Theft**.
7. **Privacy-First Architecture**: SHA-256 message hashing, sanitized previews (masks OTP numbers), zero sensitive credential storage, and history opt-out control.
8. **Presentation Demo Mode**: 1-Click test presets for hackathon and presentation demonstrations.
9. **Zero-Configuration Execution**: Seamless dual storage—runs out of the box using an in-memory store without requiring MongoDB installation.

---

## 📐 Architecture & Pipeline

```text
SMS Text Input + Sender ID
   ↓
Input Sanitization & Body Limits
   ↓
Unicode Normalization (textNormalizer.js)
   ↓
Regional Script Detector (languageDetector.js -> EN, TE, HI, TA, Mixed)
   ↓
URL Risk Extraction & Brand Mismatch (urlAnalyzer.js)
   ↓
Multilingual Keyword Engine (keywordAnalyzer.js)
   ↓
False-Positive Guard Context Analyzer (contextAnalyzer.js)
   ↓
Sender Header Verification (senderAnalyzer.js)
   ↓
Scam Category Classification (scamClassifier.js)
   ↓
Deduplicated Risk & Confidence Scoring (riskScorer.js)
   ↓
Localized Human-Readable Explanation (localizedExplainer.js)
   ↓
REST API / Frontend UI Rendering
```

---

## 📁 Project Structure

```text
d:/you/sih/
├── backend/
│   ├── controllers/         # API endpoint handlers (Analyze, Report, History, Stats)
│   ├── detection/           # 9 Independent Modular Detection Engine files
│   │   ├── textNormalizer.js
│   │   ├── languageDetector.js
│   │   ├── urlAnalyzer.js
│   │   ├── keywordAnalyzer.js
│   │   ├── contextAnalyzer.js
│   │   ├── senderAnalyzer.js
│   │   ├── scamClassifier.js
│   │   ├── riskScorer.js
│   │   └── localizedExplainer.js
│   ├── routes/              # Express REST routes
│   ├── services/            # StorageService (MongoDB + In-Memory Fallback)
│   ├── test-data/           # Sample multilingual SMS test corpus
│   ├── tests/               # Automated unit tests (node --test)
│   ├── package.json
│   └── server.js            # Express server with Helmet, CORS, Rate-Limiting
├── frontend/
│   ├── src/
│   │   ├── components/      # React UI components (Header, Nav, Analyzer, ResultCard, etc.)
│   │   ├── locales/         # i18n JSON files (en.json, te.json, hi.json, ta.json)
│   │   ├── services/        # API service client with offline fallback
│   │   ├── App.jsx
│   │   ├── i18n.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── ml/                      # Optional Python FastAPI microservice
│   ├── app.py
│   ├── train_model.py
│   └── preprocessing.py
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup & Automated Unit Tests

```bash
cd backend
npm install

# Run Automated Test Suite across all 9 Detection Modules
npm test

# Start Backend Server (runs on http://localhost:5000)
npm start
```

### 2. Frontend Setup

```bash
cd ../frontend
npm install

# Start Vite Development Server (runs on http://localhost:3000)
npm run dev
```

---

## 🧪 Verification & Test Results

The backend includes a comprehensive automated test suite verifying all 9 detection modules:

```bash
✔ LanguageDetector - Identifies Telugu, Hindi, Tamil, English & Code-Mixed Text
✔ TextNormalizer - Cleans zero-width characters and homoglyphs
✔ UrlAnalyzer - Detects Shorteners, IP links, and Suspicious TLDs
✔ ContextAnalyzer - Protects Legitimate OTP Messages (False Positive Guard)
✔ PhishingDetector Master API - Classifies Safe OTP vs Phishing Link correctly

ℹ tests 5 | pass 5 | fail 0
```

---

## ⚠️ Safety Disclaimer

> **PhishGuard** provides risk assessment and educational guidance based on automated pattern detection. A low-risk result does not guarantee that a message is genuine. Users must always verify sensitive financial or personal requests directly with official bank customer service channels.
