import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { ChatAssistant } from '@/components/ChatAssistant';
import { i18n } from '@/services/i18n';

export const AssistantPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleChatComplete = (data: any) => {
    console.log('Chat completed with data:', data);
    // Data is already saved in ChatAssistant, navigation handled there
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-secondary rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">
                {i18n.getLanguage() === 'hi' ? 'लोन असिस्टेंट' : 'Loan Assistant'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {i18n.getLanguage() === 'hi' ? 'आवाज़ या टेक्स्ट से बात करें' : 'Talk by voice or text'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Assistant */}
      <div className="flex-1">
        <ChatAssistant onComplete={handleChatComplete} />
      </div>

      {/* Footer Help */}
      <footer className="p-4 border-t bg-muted/30">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {i18n.getLanguage() === 'hi' 
              ? '💡 टिप: आप हिंदी में बोल या टाइप कर सकते हैं'
              : '💡 Tip: You can speak or type in Hindi'
            }
          </p>
        </div>
      </footer>
    </div>
  );
};