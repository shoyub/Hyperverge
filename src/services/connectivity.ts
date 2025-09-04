// Connectivity service for offline-first architecture
export interface ConnectivityStatus {
  isOnline: boolean;
  connectionType: 'slow' | 'fast' | 'offline';
  lastOnline?: Date;
  retryCount: number;
}

class ConnectivityService {
  private listeners: Array<(status: ConnectivityStatus) => void> = [];
  private status: ConnectivityStatus = {
    isOnline: navigator.onLine,
    connectionType: 'fast',
    retryCount: 0
  };
  
  private retryTimer?: NodeJS.Timeout;
  private connectionCheckTimer?: NodeJS.Timeout;

  init() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Initial connection check
    this.checkConnection();
    
    // Periodic connection quality check
    this.startConnectionMonitoring();
  }

  getStatus(): ConnectivityStatus {
    return { ...this.status };
  }

  subscribe(callback: (status: ConnectivityStatus) => void) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Test connection quality
  async checkConnection(): Promise<ConnectivityStatus> {
    if (!navigator.onLine) {
      this.updateStatus({
        isOnline: false,
        connectionType: 'offline',
        retryCount: this.status.retryCount
      });
      return this.status;
    }

    try {
      const startTime = Date.now();
      
      // Use a small test request to check connection
      const response = await fetch('data:text/plain,test', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      const duration = Date.now() - startTime;
      
      // Determine connection speed based on response time
      const connectionType = duration > 1000 ? 'slow' : 'fast';
      
      this.updateStatus({
        isOnline: true,
        connectionType,
        lastOnline: new Date(),
        retryCount: 0
      });
      
    } catch (error) {
      this.updateStatus({
        isOnline: false,
        connectionType: 'offline',
        retryCount: this.status.retryCount + 1
      });
    }

    return this.status;
  }

  // Retry connection with exponential backoff
  scheduleRetry(callback: () => void, maxRetries: number = 5) {
    if (this.status.retryCount >= maxRetries) {
      console.log('Max retries reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.status.retryCount), 30000); // Max 30s
    
    this.retryTimer = setTimeout(async () => {
      await this.checkConnection();
      
      if (this.status.isOnline) {
        callback();
      } else {
        this.scheduleRetry(callback, maxRetries);
      }
    }, delay);
  }

  cancelRetry() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = undefined;
    }
  }

  // Handle network events
  private handleOnline() {
    this.checkConnection().then(() => {
      if (this.status.isOnline) {
        this.notifyListeners();
      }
    });
  }

  private handleOffline() {
    this.updateStatus({
      isOnline: false,
      connectionType: 'offline',
      retryCount: 0
    });
  }

  private updateStatus(newStatus: Partial<ConnectivityStatus>) {
    const wasOnline = this.status.isOnline;
    this.status = { ...this.status, ...newStatus };
    
    // If we just came back online, reset retry count
    if (!wasOnline && this.status.isOnline) {
      this.status.retryCount = 0;
    }
    
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.status);
      } catch (error) {
        console.error('Error in connectivity listener:', error);
      }
    });
  }

  private startConnectionMonitoring() {
    // Check connection quality every 30 seconds when online
    this.connectionCheckTimer = setInterval(() => {
      if (navigator.onLine) {
        this.checkConnection();
      }
    }, 30000);
  }

  cleanup() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    
    if (this.connectionCheckTimer) {
      clearInterval(this.connectionCheckTimer);
    }
  }
}

export const connectivity = new ConnectivityService();