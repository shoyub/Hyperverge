import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MessageSquare, Mic } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { i18n, Language } from '@/services/i18n';

export const ChatOnlyPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState<Language>(i18n.getLanguage());

  const handleLanguageChange = (language: Language) => {
    setCurrentLang(language);
  };

  const startChat = () => {
    navigate('/assistant');
  };

  const goToNormalFlow = () => {
    navigate('/onboarding');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="p-2 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1" />
        <LanguageSelector onLanguageChange={handleLanguageChange} />
      </header>

      {/* Main Content */}
      <main className="px-4 pb-8">
        <div className="max-w-md mx-auto">
          {/* Hero Section */}
          <div className="text-center text-white mb-12 mt-8">
            <div className="w-20 h-20 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6 card-elevated">
              <MessageSquare className="w-10 h-10 text-secondary-foreground" />
            </div>
            
            <h2 className="mobile-title mb-4">
              {currentLang === 'hi' ? 'चैट असिस्टेंट' : 'Chat Assistant'}
            </h2>
            
            <p className="mobile-subtitle opacity-90 mb-8">
              {currentLang === 'hi' 
                ? 'हिंदी में बात करें और लोन पाएं'
                : 'Talk in Hindi and get your loan'
              }
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Mic className="w-6 h-6 text-white" />
                  <div>
                    <p className="text-white font-medium">
                      {currentLang === 'hi' ? 'आवाज़ से बात करें' : 'Voice Chat'}
                    </p>
                    <p className="text-white/70 text-sm">
                      {currentLang === 'hi' 
                        ? 'हिंदी में बोलें, AI सुनेगा और जवाब देगा'
                        : 'Speak in Hindi, AI will listen and respond'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-white" />
                  <div>
                    <p className="text-white font-medium">
                      {currentLang === 'hi' ? 'सवाल-जवाब' : 'Q&A Flow'}
                    </p>
                    <p className="text-white/70 text-sm">
                      {currentLang === 'hi' 
                        ? 'AI आपसे सवाल पूछेगा, आप जवाब दें'
                        : 'AI will ask questions, you answer'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={startChat}
              className="w-full mobile-button gradient-secondary text-secondary-foreground hover:opacity-90"
            >
              <MessageSquare className="w-6 h-6 mr-3" />
              {currentLang === 'hi' ? 'चैट शुरू करें' : 'Start Chat'}
            </Button>

            <Button
              onClick={goToNormalFlow}
              variant="outline"
              className="w-full mobile-button bg-transparent border-white/30 text-white hover:bg-white/10"
            >
              {currentLang === 'hi' ? 'नॉर्मल प्रोसेस' : 'Normal Process'}
            </Button>
          </div>

          {/* Example Questions */}
          <div className="mt-8 text-center text-white/80">
            <p className="text-sm mb-3">
              {currentLang === 'hi' ? 'आप यह पूछ सकते हैं:' : 'You can ask:'}
            </p>
            <div className="space-y-2 text-xs">
              <p className="bg-white/10 rounded-lg p-2">
                "{currentLang === 'hi' ? 'मुझे कितना लोन मिल सकता है?' : 'How much loan can I get?'}"
              </p>
              <p className="bg-white/10 rounded-lg p-2">
                "{currentLang === 'hi' ? 'EMI कितनी होगी?' : 'What will be the EMI?'}"
              </p>
              <p className="bg-white/10 rounded-lg p-2">
                "{currentLang === 'hi' ? 'कितने दिन में अप्रूव होगा?' : 'How many days for approval?'}"
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};