import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, IndianRupee, Calendar, Info, CheckCircle } from 'lucide-react';
import { i18n } from '@/services/i18n';
import { storage } from '@/services/storage';
import { llmStub, UnderwritingResult } from '@/services/llmStub';

export const EligibilityPage: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<UnderwritingResult | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedTenure, setSelectedTenure] = useState<number>(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    calculateEligibility();
  }, []);

  const calculateEligibility = async () => {
    setIsLoading(true);
    
    try {
      const profile = storage.getProfile();
      const progress = storage.getProgress();
      
      if (!profile) {
        navigate('/profile');
        return;
      }

      // Parse bank SMS if available
      const bankSMS = progress?.data?.bankSMS || '';
      const transactions = bankSMS ? llmStub.parseBankSMS(bankSMS) : [];
      
      // Calculate underwriting
      const underwritingResult = llmStub.calculateUnderwriting(profile, transactions);
      setResult(underwritingResult);
      setSelectedAmount(underwritingResult.eligibleAmount);

      // Save result
      storage.saveProgress('eligibility-calculated', {
        result: underwritingResult,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Error calculating eligibility:', error);
      alert('Error calculating eligibility. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateEMI = (amount: number, tenure: number): number => {
    return llmStub.calculateEMI(amount, tenure);
  };

  const handleAmountChange = (value: string) => {
    setSelectedAmount(parseInt(value));
  };

  const handleTenureChange = (value: string) => {
    setSelectedTenure(parseInt(value));
  };

  const handleProceed = () => {
    if (result) {
      storage.saveProgress('loan-selected', {
        amount: selectedAmount,
        tenure: selectedTenure,
        emi: calculateEMI(selectedAmount, selectedTenure),
        result
      });
      navigate('/terms');
    }
  };

  const handleBack = () => {
    navigate('/documents');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <p className="mobile-subtitle text-foreground">Analyzing your profile...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="mobile-subtitle text-destructive">Unable to calculate eligibility</p>
          <Button onClick={() => navigate('/documents')} variant="outline" className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const amountOptions = [];
  for (let i = 5000; i <= result.maxAmount; i += 5000) {
    if (i <= result.eligibleAmount) {
      amountOptions.push(i);
    }
  }

  const tenureOptions = [3, 6, 9, 12];

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
          <Progress value={80} className="h-2" />
        </div>
        <span className="text-sm text-muted-foreground">4/5</span>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="mobile-title text-foreground mb-2">
              {i18n.t('eligibilityTitle')}
            </h1>
            <p className="text-muted-foreground">
              Great news! You're eligible for a loan
            </p>
          </div>

          {/* Score Card */}
          <Card className="card-elevated gradient-success text-white">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="text-4xl font-bold mb-2">{result.score}/100</div>
                <p className="text-lg opacity-90">{i18n.t('yourScore')}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm opacity-90">{result.explanation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Loan Amount Selection */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-primary" />
                {i18n.t('eligibleAmount')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Amount</span>
                  <span className="font-semibold">₹{selectedAmount.toLocaleString()}</span>
                </div>
                <Select value={selectedAmount.toString()} onValueChange={handleAmountChange}>
                  <SelectTrigger className="mobile-button h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {amountOptions.map((amount) => (
                      <SelectItem key={amount} value={amount.toString()}>
                        ₹{amount.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* EMI Options */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {i18n.t('emiOptions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tenure</span>
                  <span className="font-semibold">{selectedTenure} {i18n.t('months')}</span>
                </div>
                <Select value={selectedTenure.toString()} onValueChange={handleTenureChange}>
                  <SelectTrigger className="mobile-button h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tenureOptions.map((tenure) => (
                      <SelectItem key={tenure} value={tenure.toString()}>
                        {tenure} months
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    ₹{calculateEMI(selectedAmount, selectedTenure).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Monthly EMI</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors & Recommendations */}
          {(result.riskFactors.length > 0 || result.recommendations.length > 0) && (
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-warning" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.riskFactors.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-warning mb-2">Points to consider:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {result.riskFactors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-warning">•</span>
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.recommendations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-success mb-2">Tips to improve:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-success">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleProceed}
              className="mobile-button w-full gradient-primary text-primary-foreground hover:opacity-90"
            >
              {i18n.t('proceedLoan')}
            </Button>

            <Button
              onClick={calculateEligibility}
              variant="outline"
              className="w-full"
            >
              Recalculate
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};