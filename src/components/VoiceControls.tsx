import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { i18n } from '@/services/i18n';

interface VoiceControlsProps {
  onVoiceInput?: (text: string) => void;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  onVoiceInput,
  onVoiceStart,
  onVoiceEnd,
  disabled = false,
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;

    if (SpeechRecognition && speechSynthesis) {
      setSpeechSupported(true);
      setSynthesis(speechSynthesis);

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = i18n.getLanguage() === 'hi' ? 'hi-IN' : 'en-IN';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        onVoiceStart?.();
      };

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsProcessing(true);
        onVoiceInput?.(transcript);
        
        // Simulate processing time
        setTimeout(() => {
          setIsProcessing(false);
        }, 1000);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
        onVoiceEnd?.();
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        onVoiceEnd?.();
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognition && !isListening && !disabled) {
      // Update language before starting
      recognition.lang = i18n.getLanguage() === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const speakText = (text: string) => {
    if (synthesis && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = i18n.getLanguage() === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      synthesis.speak(utterance);
    }
  };

  const getButtonText = () => {
    if (isProcessing) return i18n.t('processing');
    if (isListening) return i18n.t('listening');
    return i18n.t('voicePrompt');
  };

  const getButtonIcon = () => {
    if (isProcessing) return <Volume2 className="w-5 h-5 animate-pulse" />;
    if (isListening) return <Mic className="w-5 h-5 text-destructive animate-pulse" />;
    return <MicOff className="w-5 h-5" />;
  };

  if (!speechSupported) {
    return (
      <div className={`text-center text-muted-foreground text-sm ${className}`}>
        Voice controls not supported in this browser
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <Button
        onClick={isListening ? stopListening : startListening}
        disabled={disabled || isProcessing}
        variant={isListening ? "destructive" : "secondary"}
        className={`mobile-button gradient-secondary text-secondary-foreground hover:opacity-90 ${
          isListening ? 'animate-pulse' : ''
        }`}
      >
        {getButtonIcon()}
        <span className="ml-2">{getButtonText()}</span>
      </Button>

      {(isListening || isProcessing) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span>
            {isProcessing ? 'Processing your request...' : 'Listening...'}
          </span>
        </div>
      )}
    </div>
  );
};