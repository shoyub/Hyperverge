// i18n service for English and Hindi support
export interface Translations {
  // Navigation & Common
  back: string;
  next: string;
  continue: string;
  submit: string;
  loading: string;
  error: string;
  retry: string;

  // Landing Page
  appTitle: string;
  tagline: string;
  startVoice: string;
  startText: string;
  selectLanguage: string;

  // Onboarding
  easyTitle: string;
  easyDesc: string;
  fastTitle: string;
  fastDesc: string;
  privateTitle: string;
  privateDesc: string;
  getStarted: string;

  // Consent
  consentTitle: string;
  consentText: string;
  agreeTerms: string;

  // Profile
  profileTitle: string;
  yourName: string;
  namePlaceholder: string;
  ageRange: string;
  occupation: string;
  occupations: {
    farmer: string;
    shopkeeper: string;
    driver: string;
    worker: string;
    teacher: string;
    other: string;
  };
  monthlyIncome: string;
  incomePlaceholder: string;
  locality: string;
  localityPlaceholder: string;

  // Documents
  documentsTitle: string;
  uploadPAN: string;
  panHelper: string;
  bankSMSTitle: string;
  smsHelper: string;
  pasteSMS: string;
  uploadStatement: string;
  statementHelper: string;

  // Eligibility
  eligibilityTitle: string;
  yourScore: string;
  eligibleAmount: string;
  emiOptions: string;
  months: string;
  explainScore: string;
  adjustLoan: string;
  proceedLoan: string;

  // Voice
  voicePrompt: string;
  listening: string;
  processing: string;

  // Errors & Offline
  offline: string;
  offlineMessage: string;
  connectionRestored: string;
  uploadError: string;
}

const englishTranslations: Translations = {
  // Navigation & Common
  back: "Back",
  next: "Next",
  continue: "Continue",
  submit: "Submit",
  loading: "Loading...",
  error: "Error",
  retry: "Retry",

  // Landing Page
  appTitle: "Sahaj Loan",
  tagline: "Get instant loan approval with AI guidance",
  startVoice: "Start with Voice",
  startText: "Start with Text",
  selectLanguage: "Select Language",

  // Onboarding
  easyTitle: "Easy Process",
  easyDesc: "Simple steps, guided by AI",
  fastTitle: "Quick Approval",
  fastDesc: "Get results in minutes",
  privateTitle: "Your Privacy",
  privateDesc: "Data stays secure on your device",
  getStarted: "Get Started",

  // Consent
  consentTitle: "Privacy & Consent",
  consentText:
    "We'll use your data only to assess loan eligibility. Your information stays private and secure.",
  agreeTerms: "I agree to the terms",

  // Profile
  profileTitle: "Tell us about yourself",
  yourName: "Your full name",
  namePlaceholder: "Enter your name",
  ageRange: "Age group",
  occupation: "What do you do?",
  occupations: {
    farmer: "Farmer",
    shopkeeper: "Shop Owner",
    driver: "Driver",
    worker: "Daily Worker",
    teacher: "Teacher/Govt Job",
    other: "Other",
  },
  monthlyIncome: "Monthly income (optional)",
  incomePlaceholder: "₹15,000",
  locality: "Your area/village",
  localityPlaceholder: "Enter locality name",

  // Documents
  documentsTitle: "Upload Documents",
  uploadPAN: "Upload PAN Card",
  panHelper: "Take a clear photo of your PAN card",
  bankSMSTitle: "Bank SMS Messages",
  smsHelper: "Paste recent bank SMS or upload file",
  pasteSMS: "Paste bank SMS here...",
  uploadStatement: "Bank Statement (Optional)",
  statementHelper: "Upload PDF statement for better accuracy",

  // Eligibility
  eligibilityTitle: "Your Loan Eligibility",
  yourScore: "Your Score",
  eligibleAmount: "Eligible Amount",
  emiOptions: "EMI Options",
  months: "months",
  explainScore: "Score based on regular income patterns and account stability",
  adjustLoan: "Adjust Loan",
  proceedLoan: "Proceed with Loan",

  // Voice
  voicePrompt: "Tap to speak, I'm listening...",
  listening: "Listening...",
  processing: "Processing...",

  // Errors & Offline
  offline: "No Internet",
  offlineMessage:
    "Don't worry! We'll save your progress and submit when you're back online.",
  connectionRestored: "Connection restored! Syncing data...",
  uploadError: "Upload failed. Please try again.",
};

const hindiTranslations: Translations = {
  // Navigation & Common
  back: "वापस",
  next: "आगे",
  continue: "जारी रखें",
  submit: "जमा करें",
  loading: "लोड हो रहा है...",
  error: "गलती",
  retry: "फिर से कोशिश करें",

  // Landing Page
  appTitle: "त्वरित लोन सहायक",
  tagline: "AI गाइडेंस के साथ तुरंत लोन की मंजूरी पाएं",
  startVoice: "आवाज़ के साथ शुरू करें",
  startText: "टेक्स्ट के साथ शुरू करें",
  selectLanguage: "भाषा चुनें",

  // Onboarding
  easyTitle: "आसान प्रक्रिया",
  easyDesc: "सरल चरण, AI द्वारा निर्देशित",
  fastTitle: "तुरंत मंजूरी",
  fastDesc: "मिनटों में परिणाम पाएं",
  privateTitle: "आपकी गोपनीयता",
  privateDesc: "डेटा आपके डिवाइस पर ही सुरक्षित रहता है",
  getStarted: "शुरू करें",

  // Consent
  consentTitle: "गोपनीयता और सहमति",
  consentText:
    "हम आपका डेटा केवल लोन योग्यता के आकलन के लिए उपयोग करेंगे। आपकी जानकारी निजी और सुरक्षित रहती है।",
  agreeTerms: "मैं नियमों से सहमत हूं",

  // Profile
  profileTitle: "अपने बारे में बताएं",
  yourName: "आपका पूरा नाम",
  namePlaceholder: "अपना नाम दर्ज करें",
  ageRange: "आयु समूह",
  occupation: "आप क्या काम करते हैं?",
  occupations: {
    farmer: "किसान",
    shopkeeper: "दुकानदार",
    driver: "ड्राइवर",
    worker: "मजदूर",
    teacher: "शिक्षक/सरकारी नौकरी",
    other: "अन्य",
  },
  monthlyIncome: "मासिक आय (वैकल्पिक)",
  incomePlaceholder: "₹15,000",
  locality: "आपका क्षेत्र/गांव",
  localityPlaceholder: "क्षेत्र का नाम दर्ज करें",

  // Documents
  documentsTitle: "दस्तावेज़ अपलोड करें",
  uploadPAN: "PAN कार्ड अपलोड करें",
  panHelper: "अपने PAN कार्ड की स्पष्ट तस्वीर लें",
  bankSMSTitle: "बैंक SMS संदेश",
  smsHelper: "हाल का बैंक SMS पेस्ट करें या फ़ाइल अपलोड करें",
  pasteSMS: "बैंक SMS यहाँ पेस्ट करें...",
  uploadStatement: "बैंक स्टेटमेंट (वैकल्पिक)",
  statementHelper: "बेहतर सटीकता के लिए PDF स्टेटमेंट अपलोड करें",

  // Eligibility
  eligibilityTitle: "आपकी लोन योग्यता",
  yourScore: "आपका स्कोर",
  eligibleAmount: "योग्य राशि",
  emiOptions: "EMI विकल्प",
  months: "महीने",
  explainScore: "स्कोर नियमित आय पैटर्न और खाता स्थिरता पर आधारित",
  adjustLoan: "लोन समायोजित करें",
  proceedLoan: "लोन के साथ आगे बढ़ें",

  // Voice
  voicePrompt: "बोलने के लिए टैप करें, मैं सुन रहा हूं...",
  listening: "सुन रहा है...",
  processing: "प्रोसेसिंग...",

  // Errors & Offline
  offline: "इंटरनेट नहीं",
  offlineMessage:
    "चिंता न करें! हम आपकी प्रगति सेव करेंगे और जब आप ऑनलाइन होंगे तो सबमिट कर देंगे।",
  connectionRestored: "कनेक्शन बहाल! डेटा सिंक हो रहा है...",
  uploadError: "अपलोड फेल हो गया। कृपया फिर से कोशिश करें।",
};

export type Language = "en" | "hi";

class I18nService {
  private currentLanguage: Language = "en";
  private translations = {
    en: englishTranslations,
    hi: hindiTranslations,
  };

  setLanguage(lang: Language) {
    this.currentLanguage = lang;
    localStorage.setItem("preferred-language", lang);
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  t(key: string): string {
    const keys = key.split(".");
    let value: any = this.translations[this.currentLanguage];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key.toString();
  }

  // Initialize language from storage or browser
  init() {
    const stored = localStorage.getItem("preferred-language") as Language;
    if (stored && (stored === "en" || stored === "hi")) {
      this.currentLanguage = stored;
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("hi")) {
        this.currentLanguage = "hi";
      }
    }
  }
}

export const i18n = new I18nService();
