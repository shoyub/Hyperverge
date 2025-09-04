import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Zap, Shield, Smile } from 'lucide-react';
import { i18n } from '@/services/i18n';
import { storage } from '@/services/storage';

const onboardingSteps = [
  {
    icon: Zap,
    titleKey: 'easyTitle' as const,
    descKey: 'easyDesc' as const,
    gradient: 'gradient-primary'
  },
  {
    icon: Zap,
    titleKey: 'fastTitle' as const,
    descKey: 'fastDesc' as const,
    gradient: 'gradient-secondary'
  },
  {
    icon: Shield,
    titleKey: 'privateTitle' as const,
    descKey: 'privateDesc' as const,
    gradient: 'gradient-success'
  }
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  
  const mode = searchParams.get('mode') || 'text';

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save the chosen mode and proceed to consent
      storage.saveProgress('onboarding-complete', { mode });
      navigate('/consent');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const currentStepData = onboardingSteps[currentStep];
  const Icon = currentStepData.icon;

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
        <div className="flex-1">
          <Progress value={progress} className="h-2" />
        </div>
        <span className="text-sm text-muted-foreground">
          {currentStep + 1}/{onboardingSteps.length}
        </span>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          {/* Icon */}
          <div className={`w-24 h-24 ${currentStepData.gradient} rounded-full flex items-center justify-center mx-auto mb-8 card-elevated`}>
            <Icon className="w-12 h-12 text-white" />
          </div>

          {/* Content */}
          <div className="space-y-6 mb-12">
            <h1 className="mobile-title text-foreground">
              {i18n.t(currentStepData.titleKey)}
            </h1>
            
            <p className="mobile-body text-muted-foreground leading-relaxed">
              {i18n.t(currentStepData.descKey)}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-primary'
                    : index < currentStep
                    ? 'bg-primary/60'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <Button
            onClick={handleNext}
            className="mobile-button w-full gradient-primary text-primary-foreground hover:opacity-90"
          >
            {currentStep < onboardingSteps.length - 1 ? (
              <>
                {i18n.t('next')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              i18n.t('getStarted')
            )}
          </Button>

          {/* Skip Option */}
          {currentStep < onboardingSteps.length - 1 && (
            <Button
              onClick={() => navigate('/consent')}
              variant="ghost"
              className="mt-4 text-muted-foreground"
            >
              Skip introduction
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};