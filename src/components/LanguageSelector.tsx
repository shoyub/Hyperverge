import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { i18n, Language } from '@/services/i18n';

interface LanguageSelectorProps {
  onLanguageChange?: (language: Language) => void;
  className?: string;
}

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
  className = ''
}) => {
  const [currentLang, setCurrentLang] = useState<Language>(i18n.getLanguage());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    i18n.init();
    setCurrentLang(i18n.getLanguage());
  }, []);

  const handleLanguageSelect = (language: Language) => {
    setCurrentLang(language);
    i18n.setLanguage(language);
    setIsOpen(false);
    onLanguageChange?.(language);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-button flex items-center gap-2 bg-card border-border hover:bg-accent transition-smooth"
      >
        <span className="text-sm font-medium">{currentLanguage.nativeName}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute top-full left-0 mt-2 w-full min-w-[150px] z-50 card-soft">
            <div className="p-2">
              {languages.map((language) => (
                <Button
                  key={language.code}
                  variant="ghost"
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`w-full justify-start text-left px-3 py-2 ${
                    currentLang === language.code 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{language.nativeName}</span>
                    <span className="text-xs opacity-70">{language.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};