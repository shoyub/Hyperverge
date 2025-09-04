import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { connectivity, ConnectivityStatus } from '@/services/connectivity';
import { i18n } from '@/services/i18n';

interface RetryBannerProps {
  onRetry?: () => void;
  className?: string;
}

export const RetryBanner: React.FC<RetryBannerProps> = ({
  onRetry,
  className = ''
}) => {
  const [status, setStatus] = useState<ConnectivityStatus>(connectivity.getStatus());
  const [showBanner, setShowBanner] = useState(!status.isOnline);

  useEffect(() => {
    connectivity.init();
    
    const unsubscribe = connectivity.subscribe((newStatus) => {
      setStatus(newStatus);
      
      if (newStatus.isOnline) {
        // Show connection restored briefly, then hide
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 3000);
      } else {
        setShowBanner(true);
      }
    });

    return unsubscribe;
  }, []);

  if (!showBanner) return null;

  const handleRetry = () => {
    connectivity.checkConnection().then(() => {
      onRetry?.();
    });
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-4 ${className}`}>
      <Alert className={`
        ${status.isOnline 
          ? 'bg-success text-success-foreground border-success' 
          : 'bg-warning text-warning-foreground border-warning'
        }
        card-soft
      `}>
        <div className="flex items-center gap-3">
          {status.isOnline ? (
            <Wifi className="w-5 h-5" />
          ) : (
            <WifiOff className="w-5 h-5" />
          )}
          
          <div className="flex-1">
            <AlertDescription className="font-medium">
              {status.isOnline ? (
                i18n.t('connectionRestored')
              ) : (
                i18n.t('offlineMessage')
              )}
            </AlertDescription>
            
            {status.connectionType === 'slow' && status.isOnline && (
              <AlertDescription className="text-sm opacity-80 mt-1">
                Slow connection detected. Some features may be limited.
              </AlertDescription>
            )}
          </div>

          {!status.isOnline && (
            <Button
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="bg-transparent border-current text-current hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              {i18n.t('retry')}
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
};