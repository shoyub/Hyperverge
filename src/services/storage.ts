// Local storage service for offline-first architecture
export interface UserProfile {
  name: string;
  ageRange: string;
  occupation: string;
  monthlyIncome?: number;
  locality: string;
}

export interface LoanApplication {
  profile: UserProfile;
  panImage?: string;
  bankSMS?: string;
  bankStatement?: File;
  eligibility?: {
    score: number;
    amount: number;
    explanation: string;
  };
  status: 'draft' | 'processing' | 'approved' | 'rejected';
  timestamp: number;
}

class StorageService {
  private readonly PROFILE_KEY = 'loan_profile';
  private readonly APPLICATION_KEY = 'loan_application';
  private readonly LANGUAGE_KEY = 'preferred_language';
  private readonly PROGRESS_KEY = 'application_progress';

  // Profile management
  saveProfile(profile: UserProfile): void {
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
  }

  getProfile(): UserProfile | null {
    const stored = localStorage.getItem(this.PROFILE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Application management
  saveApplication(application: LoanApplication): void {
    localStorage.setItem(this.APPLICATION_KEY, JSON.stringify({
      ...application,
      timestamp: Date.now()
    }));
  }

  getApplication(): LoanApplication | null {
    const stored = localStorage.getItem(this.APPLICATION_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Progress tracking
  saveProgress(step: string, data?: any): void {
    const progress = {
      currentStep: step,
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
  }

  getProgress(): { currentStep: string; data?: any; timestamp: number } | null {
    const stored = localStorage.getItem(this.PROGRESS_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Language management
  saveLanguage(language: string): void {
    localStorage.setItem(this.LANGUAGE_KEY, language);
  }

  getLanguage(): string | null {
    return localStorage.getItem(this.LANGUAGE_KEY);
  }

  // Clear all data
  clearAll(): void {
    localStorage.removeItem(this.PROFILE_KEY);
    localStorage.removeItem(this.APPLICATION_KEY);
    localStorage.removeItem(this.PROGRESS_KEY);
  }

  // Document management (using base64 for images)
  saveDocument(key: string, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const data = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result
        };
        localStorage.setItem(`doc_${key}`, JSON.stringify(data));
        resolve();
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  getDocument(key: string): { name: string, type: string, size: number, data: string } | null {
    const stored = localStorage.getItem(`doc_${key}`);
    return stored ? JSON.parse(stored) : null;
  }

  // Check storage usage
  getStorageUsage(): { used: number; available: number } {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length;
      }
    }
    
    // Rough estimate of available space (5MB typical limit)
    const available = 5 * 1024 * 1024 - used;
    
    return { used, available };
  }
}

export const storage = new StorageService();