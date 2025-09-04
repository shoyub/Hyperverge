import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Home, RefreshCw, Download } from 'lucide-react';
import { i18n } from '@/services/i18n';
import { storage } from '@/services/storage';

export const StatusPage: React.FC = () => {
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const savedApplication = storage.getApplication();
    if (savedApplication) {
      setApplication(savedApplication);
    } else {
      navigate('/');
    }

    // Simulate time elapsed
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleStartNew = () => {
    storage.clearAll();
    navigate('/');
  };

  const handleDownloadSummary = () => {
    if (!application) return;

    const summary = {
      applicationId: 'LOAN' + Date.now(),
      applicantName: application.profile?.name || 'User',
      submittedAt: new Date().toISOString(),
      status: 'Pre-approved',
      loanAmount: application.eligibility?.eligibleAmount || 0,
      creditScore: application.eligibility?.score || 0
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loan-application-summary.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!application) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="mobile-subtitle text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-4 text-center">
        <h1 className="text-lg font-semibold text-foreground">Application Status</h1>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Status Card */}
          <Card className="card-elevated gradient-success text-white text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h2 className="mobile-title mb-2">Application Submitted!</h2>
              <p className="text-lg opacity-90 mb-4">
                Your loan application has been successfully processed
              </p>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm font-medium">Application ID</p>
                <p className="text-xs opacity-80">LOAN{Date.now()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Application Summary */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applicant:</span>
                <span className="font-medium">{application.profile?.name || 'User'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credit Score:</span>
                <span className="font-medium">{application.eligibility?.score || 0}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Eligible Amount:</span>
                <span className="font-medium">₹{(application.eligibility?.eligibleAmount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-success font-medium">Pre-approved</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success text-success-foreground flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Application Submitted</p>
                    <p className="text-sm text-muted-foreground">Your application has been received and is being processed</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Document Verification</p>
                    <p className="text-sm text-muted-foreground">Our team will verify your documents (1-2 business days)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Final Approval</p>
                    <p className="text-sm text-muted-foreground">Receive final loan approval and disbursement details</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Information */}
          <Card className="card-soft border-warning/20 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-warning/20 text-warning flex items-center justify-center">
                  <span className="text-sm">ℹ️</span>
                </div>
                <div>
                  <p className="font-medium text-warning mb-1">Demo Application</p>
                  <p className="text-sm text-muted-foreground">
                    This is a demonstration of AI-powered loan underwriting. 
                    No real loan will be processed or disbursed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleDownloadSummary}
              variant="outline"
              className="w-full mobile-button"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Summary
            </Button>

            <Button
              onClick={handleStartNew}
              className="w-full mobile-button gradient-primary text-primary-foreground hover:opacity-90"
            >
              <Home className="w-4 h-4 mr-2" />
              Start New Application
            </Button>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">
              Questions about your application?
            </p>
            <p className="text-sm font-medium text-foreground">
              Call: 1800-XXX-XXXX (Demo Number)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};