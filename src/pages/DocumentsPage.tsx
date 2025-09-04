import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, FileText, MessageSquare, Upload } from 'lucide-react';
import { DocumentUpload } from '@/components/DocumentUpload';
import { i18n } from '@/services/i18n';
import { storage } from '@/services/storage';
import { llmStub } from '@/services/llmStub';

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [panImage, setPanImage] = useState<File | null>(null);
  const [bankSMS, setBankSMS] = useState('');
  const [bankStatement, setBankStatement] = useState<File | null>(null);
  const [showSampleSMS, setShowSampleSMS] = useState(false);

  useEffect(() => {
    // Load existing documents if available
    const panDoc = storage.getDocument('pan');
    if (panDoc) {
      // Create a mock file from stored data (for display purposes)
      const mockFile = new File([''], panDoc.name, { type: panDoc.type });
      setPanImage(mockFile);
    }

    const progress = storage.getProgress();
    if (progress?.data?.bankSMS) {
      setBankSMS(progress.data.bankSMS);
    }
  }, []);

  const handlePanUpload = async (file: File) => {
    setPanImage(file);
    try {
      await storage.saveDocument('pan', file);
    } catch (error) {
      console.error('Error saving PAN document:', error);
    }
  };

  const handlePanRemove = () => {
    setPanImage(null);
    localStorage.removeItem('doc_pan');
  };

  const handleSMSChange = (value: string) => {
    setBankSMS(value);
    storage.saveProgress('documents-sms', { bankSMS: value });
  };

  const handleStatementUpload = (file: File) => {
    setBankStatement(file);
    storage.saveDocument('statement', file);
  };

  const handleStatementRemove = () => {
    setBankStatement(null);
    localStorage.removeItem('doc_statement');
  };

  const loadSampleSMS = () => {
    const sampleSMS = llmStub.generateSampleSMS();
    setBankSMS(sampleSMS);
    handleSMSChange(sampleSMS);
    setShowSampleSMS(false);
  };

  const handleContinue = () => {
    if (!panImage && !bankSMS.trim()) {
      alert('Please upload PAN card or provide bank SMS to continue');
      return;
    }

    // Save documents to storage
    storage.saveProgress('documents-complete', {
      hasPAN: !!panImage,
      hasSMS: !!bankSMS.trim(),
      hasStatement: !!bankStatement,
      bankSMS
    });

    navigate('/eligibility');
  };

  const handleBack = () => {
    navigate('/profile');
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
        <div className="flex-1">
          <Progress value={60} className="h-2" />
        </div>
        <span className="text-sm text-muted-foreground">3/5</span>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="mobile-title text-foreground mb-2">
              {i18n.t('documentsTitle')}
            </h1>
            <p className="text-muted-foreground">
              Upload documents to verify your identity and income
            </p>
          </div>

          {/* PAN Card Upload */}
          <DocumentUpload
            title={i18n.t('uploadPAN')}
            description={i18n.t('panHelper')}
            onFileSelect={handlePanUpload}
            onFileRemove={handlePanRemove}
            currentFile={panImage}
            acceptedTypes="image/*"
            maxSize={5}
          />

          {/* Bank SMS Section */}
          <Card className="card-soft">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="mobile-subtitle font-semibold text-foreground">
                    {i18n.t('bankSMSTitle')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {i18n.t('smsHelper')}
                  </p>
                </div>
              </div>

              <Textarea
                placeholder={i18n.t('pasteSMS')}
                value={bankSMS}
                onChange={(e) => handleSMSChange(e.target.value)}
                className="min-h-[120px] resize-none"
              />

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowSampleSMS(!showSampleSMS)}
                  variant="outline"
                  size="sm"
                  className="text-sm"
                >
                  {showSampleSMS ? 'Hide' : 'Show'} Sample SMS
                </Button>
                
                {showSampleSMS && (
                  <Button
                    onClick={loadSampleSMS}
                    variant="outline"
                    size="sm"
                    className="text-sm"
                  >
                    Use Sample
                  </Button>
                )}
              </div>

              {showSampleSMS && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Sample Bank SMS:</p>
                  <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">
                    {llmStub.generateSampleSMS()}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bank Statement Upload (Optional) */}
          <DocumentUpload
            title={i18n.t('uploadStatement')}
            description={i18n.t('statementHelper')}
            onFileSelect={handleStatementUpload}
            onFileRemove={handleStatementRemove}
            currentFile={bankStatement}
            acceptedTypes=".pdf"
            maxSize={10}
          />

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!panImage && !bankSMS.trim()}
            className="mobile-button w-full gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {i18n.t('continue')}
          </Button>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Upload at least PAN card or bank SMS to proceed. 
              All documents are processed locally on your device.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};