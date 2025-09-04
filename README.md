# QuickLoan Assistant - AI-Enabled Loan Underwriting

A production-ready web prototype for AI-powered loan underwriting targeting rural and semi-urban India. Built with React, TypeScript, and offline-first architecture.

## 🚀 Features

- **🎤 Voice-First Interface** - Hindi voice support with Web Speech API
- **📱 Mobile-Optimized** - Large buttons, clear typography, step-by-step guidance
- **🌐 Offline-First** - Works without internet, auto-syncs when online
- **🔐 Privacy-Focused** - All data stored locally, no external tracking
- **🤖 AI Underwriting** - Mock intelligent loan scoring based on SMS analysis
- **📄 Document Upload** - PAN card capture with auto-compression
- **💰 Real-time EMI Calculator** - Instant loan terms calculation
- **🌍 Multi-language** - English and Hindi support

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router v6
- **Storage**: LocalStorage + IndexedDB for offline data
- **Voice**: Web Speech API (STT/TTS)
- **PWA**: Service Worker ready, offline-first
- **Components**: Shadcn/ui with custom variants

## 📋 User Journey

1. **Landing** - Language selection, voice/text mode choice
2. **Onboarding** - 3-step introduction with privacy focus
3. **Consent** - Clear data usage explanation
4. **Profile** - Basic info collection (name, occupation, income)
5. **Documents** - PAN upload + bank SMS parsing
6. **Eligibility** - AI scoring with explainable results
7. **Terms** - Loan details with EMI breakdown
8. **Status** - Application confirmation

## 🛠️ Setup & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 AI Underwriting Logic

The mock AI analyzes:
- **Income Patterns**: Regular credit transactions
- **Account Stability**: Average balance, volatility
- **Cash Flow**: Credit-to-debit ratios
- **Profile Factors**: Occupation, declared income consistency

Scoring ranges from 0-100 with eligibility from ₹5,000 to ₹50,000.

## 🎯 Demo Features

- **Sample SMS Data** - Pre-loaded bank transaction examples
- **Offline Testing** - Disconnect internet to test offline flows
- **Voice Commands** - Try Hindi voice input on supported browsers
- **Mobile Simulation** - Best experienced on mobile viewport

## 🔒 Privacy & Security

- **Local-First**: No data leaves the device
- **No Tracking**: No analytics or external services
- **Data Control**: Easy data deletion option
- **Demo Safe**: No real financial processing

## 📱 PWA Support

- Offline functionality after first load
- Install prompt on mobile devices
- Background sync for pending operations
- App-like experience

Built with ❤️ for rural India's financial inclusion.