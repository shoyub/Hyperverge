import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-soft text-center">
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">404</span>
          </div>
          
          <h1 className="mobile-title text-foreground mb-4">
            Page Not Found
          </h1>
          
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Button
            onClick={handleGoHome}
            className="mobile-button gradient-primary text-primary-foreground hover:opacity-90"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Home
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
