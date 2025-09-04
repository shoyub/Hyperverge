import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MessageSquare, Globe } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { i18n, Language } from '@/services/i18n';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState<Language>('en');

  useEffect(() => {
    i18n.init();
    setCurrentLang(i18n.getLanguage());
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLang(language);
    // Force re-render by updating state
  };

  const startWithVoice = () => {
    navigate('/assistant?mode=voice');
  };

  const startWithText = () => {
    navigate('/onboarding?mode=text');
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-white" />
          <h1 className="text-xl font-bold text-white">{i18n.t('appTitle')}</h1>
        </div>
        <LanguageSelector onLanguageChange={handleLanguageChange} />
      </header>

      {/* Main Content */}
      <main className="px-4 pb-8">
        <div className="max-w-md mx-auto">
          {/* Hero Section */}
          <div className="text-center text-white mb-12 mt-16">
            <div className="w-20 h-20 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6 card-elevated">
              <Globe className="w-10 h-10 text-secondary-foreground" />
            </div>
            
            <h2 className="mobile-title mb-4">
              {i18n.t('appTitle')}
            </h2>
            
            <p className="mobile-subtitle opacity-90 mb-8">
              {i18n.t('tagline')}
            </p>
          </div>

          {/* Action Cards */}
          <div className="space-y-4">
            {/* Voice Option */}
            <Card className="card-elevated bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-smooth">
              <CardContent className="p-6">
                <Button
                  onClick={startWithVoice}
                  className="w-full mobile-button bg-secondary hover:bg-secondary-light text-secondary-foreground"
                >
                  <Mic className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">{i18n.t('startVoice')}</div>
                    <div className="text-sm opacity-80">
                      {currentLang === 'hi' ? 'AI के साथ हिंदी में बात करें' : 'Chat with AI in Hindi'}
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Text Option */}
            <Card className="card-elevated bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-smooth">
              <CardContent className="p-6">
                <Button
                  onClick={startWithText}
                  variant="outline"
                  className="w-full mobile-button bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  <MessageSquare className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">{i18n.t('startText')}</div>
                    <div className="text-sm opacity-80">
                      {currentLang === 'hi' ? 'नॉर्मल प्रोसेस से आगे बढ़ें' : 'Continue with normal process'}
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Preview */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center text-white">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl">⚡</span>
              </div>
              <p className="text-sm font-medium">{i18n.t('fastTitle')}</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl">🔒</span>
              </div>
              <p className="text-sm font-medium">{i18n.t('privateTitle')}</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl">✨</span>
              </div>
              <p className="text-sm font-medium">{i18n.t('easyTitle')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};