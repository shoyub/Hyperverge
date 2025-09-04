import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileText, AlertTriangle, IndianRupee, Calendar, Percent } from 'lucide-react';
import { i18n } from '@/services/i18n';
import { storage } from '@/services/storage';

interface LoanTerms {
  amount: number;
  tenure: number;
  emi: number;
  interestRate: number;
  totalAmount: number;
  totalInterest: number;
}

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const [terms, setTerms] = useState<LoanTerms | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const progress = storage.getProgress();
    const loanData = progress?.data;
    
    if (loanData?.amount && loanData?.tenure && loanData?.emi) {
      const interestRate = 24; // 24% annual rate
      const totalAmount = loanData.emi * loanData.tenure;
      const totalInterest = totalAmount - loanData.amount;
      
      setTerms({
        amount: loanData.amount,
        tenure: loanData.tenure,
        emi: loanData.emi,
        interestRate,
        totalAmount,
        totalInterest
      });
    } else {
      navigate('/eligibility');
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!agreedToTerms || !terms) return;

    setIsSubmitting(true);
    
    try {
      // Create final loan application
      const profile = storage.getProfile();
      const progress = storage.getProgress();
      
      const application = {
        profile: profile!,
        eligibility: progress?.data?.result,
        loanTerms: terms,
        status: 'processing' as const,
        submittedAt: new Date().toISOString(),
        applicationId: 'LOAN' + Date.now()
      };

      // Save application
      storage.saveApplication({
        profile: profile!,
        bankSMS: progress?.data?.bankSMS,
        eligibility: progress?.data?.result,
        status: 'processing',
        timestamp: Date.now()
      });

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      navigate('/status');
      
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/eligibility');
  };

  if (!terms) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="mobile-subtitle text-muted-foreground">Loading loan terms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="p-2"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <Progress value={100} className="h-2" />
        </div>
        <span className="text-sm text-muted-foreground">5/5</span>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="mobile-title text-foreground mb-2">
              Loan Terms & Conditions
            </h1>
            <p className="text-muted-foreground">
              Review your loan details before final submission
            </p>
          </div>

          {/* Loan Summary */}
          <Card className="card-elevated border-primary/20">
            <CardHeader>
              <CardTitle className="text-center gradient-primary bg-clip-text text-transparent">
                Loan Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <IndianRupee className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="font-bold text-lg text-foreground">₹{terms.amount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Loan Amount</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="font-bold text-lg text-foreground">{terms.tenure}</div>
                  <div className="text-xs text-muted-foreground">Months</div>
                </div>
              </div>

              <div className="text-center p-4 gradient-secondary rounded-lg text-white">
                <div className="text-2xl font-bold mb-1">₹{terms.emi.toLocaleString()}</div>
                <div className="text-sm opacity-90">Monthly EMI</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest Rate:</span>
                  <span className="font-medium">{terms.interestRate}% per annum</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Interest:</span>
                  <span className="font-medium">₹{terms.totalInterest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold">₹{terms.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Terms */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-5 h-5" />
                Important Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <p className="font-medium text-foreground">Key Points:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• This is a pre-approval, final approval subject to verification</li>
                  <li>• EMI will be auto-debited from your registered bank account</li>
                  <li>• Late payment charges: ₹500 + 2% per month on overdue amount</li>
                  <li>• Pre-payment allowed after 6 months with 2% charges</li>
                  <li>• Processing fee: 2% of loan amount (min ₹1000)</li>
                </ul>
              </div>

              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-destructive font-medium mb-1">Risk Warning:</p>
                <p className="text-destructive text-xs">
                  Borrowing money involves risk. Ensure you can repay on time to avoid 
                  penalties and protect your credit score.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Consent */}
          <Card className="card-soft">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="final-consent"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="final-consent"
                  className="text-sm text-foreground cursor-pointer leading-relaxed"
                >
                  I have read and agree to the loan terms and conditions. I understand 
                  the risks involved and commit to repaying the loan as per the agreed schedule.
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!agreedToTerms || isSubmitting}
            className="mobile-button w-full gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Submitting Application...
              </>
            ) : (
              i18n.t('submit')
            )}
          </Button>

          {/* Legal Disclaimer */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              This is a demo application for showcasing AI-powered loan underwriting. 
              No real financial transactions will be processed.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};