import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Shield, Lock, Eye, Trash2 } from 'lucide-react';
import { i18n } from '@/services/i18n';
import { storage } from '@/services/storage';

export const ConsentPage: React.FC = () => {
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleContinue = () => {
    if (agreedToTerms) {
      storage.saveProgress('consent-given', { timestamp: Date.now() });
      navigate('/profile');
    }
  };

  const handleBack = () => {
    navigate('/onboarding');
  };

  const handleEraseData = () => {
    if (confirm('Are you sure you want to erase all your data? This cannot be undone.')) {
      storage.clearAll();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">
          {i18n.t('consentTitle')}
        </h1>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Main Consent Card */}
          <Card className="card-soft">
            <CardHeader className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="mobile-subtitle">
                {i18n.t('consentTitle')}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="mobile-body text-muted-foreground leading-relaxed">
                {i18n.t('consentText')}
              </p>

              {/* Privacy Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Local Storage</p>
                    <p className="text-sm text-muted-foreground">
                      All your data stays on your device
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">No Tracking</p>
                    <p className="text-sm text-muted-foreground">
                      We don't track or share your information
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Easy Deletion</p>
                    <p className="text-sm text-muted-foreground">
                      Delete all your data anytime
                    </p>
                  </div>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="consent"
                    className="text-sm font-medium text-foreground cursor-pointer leading-relaxed"
                  >
                    {i18n.t('agreeTerms')}
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              disabled={!agreedToTerms}
              className="mobile-button w-full gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {i18n.t('continue')}
            </Button>

            <Button
              onClick={handleEraseData}
              variant="outline"
              className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Erase My Data
            </Button>
          </div>

          {/* Legal Text */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              This is a demo application. No real loans are processed. 
              Your data is stored locally for demonstration purposes only.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};