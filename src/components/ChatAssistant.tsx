import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mic, Send, Volume2, User, Bot, VolumeX } from 'lucide-react';
import { VoiceControls } from './VoiceControls';
import { i18n } from '@/services/i18n';
import { storage } from '@/services/storage';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface ChatAssistantProps {
  onComplete?: (data: any) => void;
  className?: string;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  onComplete,
  className = ''
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentStep, setCurrentStep] = useState('greeting');
  const [collectedData, setCollectedData] = useState<any>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conversation flow steps
  const conversationSteps = {
    greeting: {
      hi: 'नमस्ते! मैं आपका लोन असिस्टेंट हूं। आपका नाम क्या है?',
      en: 'Hello! I am your loan assistant. What is your name?'
    },
    name: {
      hi: 'धन्यवाद! आपकी मासिक आय कितनी है?',
      en: 'Thank you! What is your monthly income?'
    },
    income: {
      hi: 'अच्छा! आप किस काम में हैं?',
      en: 'Good! What work do you do?'
    },
    occupation: {
      hi: 'समझ गया। क्या आपके पास PAN कार्ड है?',
      en: 'I understand. Do you have a PAN card?'
    },
    documents: {
      hi: 'बहुत अच्छा! क्या आप अपने बैंक के SMS मैसेज शेयर कर सकते हैं?',
      en: 'Very good! Can you share your bank SMS messages?'
    },
    sms: {
      hi: 'परफेक्ट! अब मैं आपकी लोन एलिजिबिलिटी चेक करता हूं।',
      en: 'Perfect! Now I will check your loan eligibility.'
    },
    complete: {
      hi: 'बधाई हो! आप लोन के लिए एलिजिबल हैं। आगे बढ़ें?',
      en: 'Congratulations! You are eligible for a loan. Shall we proceed?'
    }
  };

  const occupationOptions = {
    hi: ['किसान', 'दुकानदार', 'ड्राइवर', 'मजदूर', 'शिक्षक', 'अन्य'],
    en: ['Farmer', 'Shopkeeper', 'Driver', 'Worker', 'Teacher', 'Other']
  };

  useEffect(() => {
    // Start conversation
    addAssistantMessage(conversationSteps.greeting);
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (content: string, type: 'user' | 'assistant', isVoice = false) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      isVoice
    };
    setMessages(prev => [...prev, message]);
  };

  const addAssistantMessage = (stepContent: { hi: string; en: string }) => {
    const content = i18n.getLanguage() === 'hi' ? stepContent.hi : stepContent.en;
    addMessage(content, 'assistant');
    
    // Speak the message
    speakText(content);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = i18n.getLanguage() === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const processUserResponse = (response: string, isVoice = false) => {
    addMessage(response, 'user', isVoice);
    
    const updatedData = { ...collectedData };
    
    switch (currentStep) {
      case 'greeting':
        updatedData.name = response;
        setCurrentStep('name');
        setTimeout(() => addAssistantMessage(conversationSteps.name), 1000);
        break;
        
      case 'name':
        const income = parseInt(response.replace(/[^0-9]/g, ''));
        if (income && income > 0) {
          updatedData.monthlyIncome = income;
          setCurrentStep('income');
          setTimeout(() => addAssistantMessage(conversationSteps.income), 1000);
        } else {
          setTimeout(() => {
            const retry = i18n.getLanguage() === 'hi' 
              ? 'कृपया अपनी मासिक आय रुपयों में बताएं। जैसे: 15000'
              : 'Please tell your monthly income in rupees. Like: 15000';
            addMessage(retry, 'assistant');
            speakText(retry);
          }, 1000);
        }
        break;
        
      case 'income':
        updatedData.occupation = response.toLowerCase();
        setCurrentStep('occupation');
        setTimeout(() => addAssistantMessage(conversationSteps.documents), 1000);
        break;
        
      case 'occupation':
        const hasPan = response.toLowerCase().includes('yes') || 
                      response.toLowerCase().includes('हां') || 
                      response.toLowerCase().includes('hai');
        updatedData.hasPAN = hasPan;
        setCurrentStep('documents');
        setTimeout(() => addAssistantMessage(conversationSteps.sms), 1000);
        break;
        
      case 'documents':
        updatedData.bankSMS = response;
        setCurrentStep('sms');
        setTimeout(() => {
          addAssistantMessage(conversationSteps.complete);
          setCurrentStep('complete');
        }, 2000);
        break;
        
      case 'complete':
        if (response.toLowerCase().includes('yes') || 
            response.toLowerCase().includes('हां') || 
            response.toLowerCase().includes('हा')) {
          // Save collected data and navigate
          storage.saveProfile({
            name: updatedData.name || 'User',
            ageRange: '26-35',
            occupation: updatedData.occupation || 'other',
            monthlyIncome: updatedData.monthlyIncome,
            locality: 'Unknown'
          });
          
          storage.saveProgress('chat-complete', updatedData);
          
          setTimeout(() => {
            navigate('/eligibility');
          }, 1000);
        }
        break;
    }
    
    setCollectedData(updatedData);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      processUserResponse(inputText.trim());
      setInputText('');
    }
  };

  const handleVoiceInput = (text: string) => {
    processUserResponse(text, true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const renderQuickReplies = () => {
    if (currentStep === 'income') {
      const options = ['10000', '15000', '20000', '25000', '30000'];
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {options.map((option) => (
            <Button
              key={option}
              variant="outline"
              size="sm"
              onClick={() => processUserResponse(`₹${option}`)}
              className="text-xs"
            >
              ₹{option}
            </Button>
          ))}
        </div>
      );
    }

    if (currentStep === 'occupation') {
      const options = occupationOptions[i18n.getLanguage()];
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {options.map((option, index) => (
            <Button
              key={option}
              variant="outline"
              size="sm"
              onClick={() => processUserResponse(option)}
              className="text-xs"
            >
              {option}
            </Button>
          ))}
        </div>
      );
    }

    if (currentStep === 'documents' || currentStep === 'complete') {
      const yesText = i18n.getLanguage() === 'hi' ? 'हां' : 'Yes';
      const noText = i18n.getLanguage() === 'hi' ? 'नहीं' : 'No';
      return (
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => processUserResponse(yesText)}
            className="text-xs"
          >
            {yesText}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => processUserResponse(noText)}
            className="text-xs"
          >
            {noText}
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-[80%] ${
              message.type === 'user' ? 'flex-row-reverse' : ''
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'gradient-secondary text-white'
              }`}>
                {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              <Card className={`${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card'
              }`}>
                <CardContent className="p-3">
                  <p className="text-sm">{message.content}</p>
                  {message.isVoice && (
                    <div className="flex items-center gap-1 mt-1 opacity-70">
                      <Mic className="w-3 h-3" />
                      <span className="text-xs">Voice</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        
        {/* Quick Replies */}
        {messages.length > 0 && renderQuickReplies()}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Controls */}
      <div className="p-4 border-t bg-background">
        <VoiceControls
          onVoiceInput={handleVoiceInput}
          onVoiceStart={() => setIsListening(true)}
          onVoiceEnd={() => setIsListening(false)}
          className="mb-4"
        />

        {/* Text Input */}
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={i18n.getLanguage() === 'hi' ? 'यहाँ टाइप करें...' : 'Type here...'}
            className="flex-1"
            disabled={isListening}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isListening}
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>

          {/* Stop Speaking Button */}
          {isSpeaking && (
            <Button
              onClick={stopSpeaking}
              variant="outline"
              className="px-4"
            >
              <VolumeX className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Status */}
        {isListening && (
          <div className="text-center mt-2">
            <div className="inline-flex items-center gap-2 text-sm text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              {i18n.getLanguage() === 'hi' ? 'सुन रहा हूं...' : 'Listening...'}
            </div>
          </div>
        )}

        {isSpeaking && (
          <div className="text-center mt-2">
            <div className="inline-flex items-center gap-2 text-sm text-secondary">
              <Volume2 className="w-4 h-4 animate-pulse" />
              {i18n.getLanguage() === 'hi' ? 'बोल रहा हूं...' : 'Speaking...'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};