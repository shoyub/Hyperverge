// Mock AI underwriting service for demo purposes
import { UserProfile } from './storage';

export interface BankTransaction {
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: Date;
  balance?: number;
}

export interface UnderwritingResult {
  score: number; // 0-100
  eligibleAmount: number;
  maxAmount: number;
  explanation: string;
  riskFactors: string[];
  recommendations: string[];
  confidence: number;
}

// Sample SMS patterns for parsing
const SMS_PATTERNS = {
  credit: [
    /credited.*?INR\s*(\d+(?:,\d+)*(?:\.\d+)?)/i,
    /received.*?Rs\.?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i,
    /deposit.*?₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/i
  ],
  debit: [
    /debited.*?INR\s*(\d+(?:,\d+)*(?:\.\d+)?)/i,
    /withdrawn.*?Rs\.?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i,
    /purchase.*?₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/i
  ],
  balance: [
    /(?:avl|available).*?bal(?:ance)?.*?₹?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i,
    /balance.*?₹?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i
  ]
};

class LLMStubService {
  // Parse bank SMS to extract transactions
  parseBankSMS(smsText: string): BankTransaction[] {
    const transactions: BankTransaction[] = [];
    const lines = smsText.split('\n').filter(line => line.trim());

    for (const line of lines) {
      // Try to parse credit transactions
      for (const pattern of SMS_PATTERNS.credit) {
        const match = line.match(pattern);
        if (match) {
          const amount = this.parseAmount(match[1]);
          const balanceMatch = line.match(SMS_PATTERNS.balance[0]) || line.match(SMS_PATTERNS.balance[1]);
          const balance = balanceMatch ? this.parseAmount(balanceMatch[1]) : undefined;
          
          transactions.push({
            type: 'credit',
            amount,
            description: line.trim(),
            date: this.extractDate(line) || new Date(),
            balance
          });
          break;
        }
      }

      // Try to parse debit transactions
      for (const pattern of SMS_PATTERNS.debit) {
        const match = line.match(pattern);
        if (match) {
          const amount = this.parseAmount(match[1]);
          const balanceMatch = line.match(SMS_PATTERNS.balance[0]) || line.match(SMS_PATTERNS.balance[1]);
          const balance = balanceMatch ? this.parseAmount(balanceMatch[1]) : undefined;
          
          transactions.push({
            type: 'debit',
            amount,
            description: line.trim(),
            date: this.extractDate(line) || new Date(),
            balance
          });
          break;
        }
      }
    }

    return transactions;
  }

  // Calculate underwriting score and eligibility
  calculateUnderwriting(profile: UserProfile, transactions: BankTransaction[]): UnderwritingResult {
    let score = 50; // Base score
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    // Calculate monthly income from credits
    const credits = transactions.filter(t => t.type === 'credit');
    const debits = transactions.filter(t => t.type === 'debit');
    
    const avgCredits = credits.length > 0 ? 
      credits.reduce((sum, t) => sum + t.amount, 0) / credits.length : 0;
    
    const avgDebits = debits.length > 0 ? 
      debits.reduce((sum, t) => sum + t.amount, 0) / debits.length : 0;

    // Income stability scoring
    if (credits.length >= 3) {
      score += 15;
      if (avgCredits > 10000) score += 10;
      if (avgCredits > 20000) score += 5;
    } else {
      score -= 10;
      riskFactors.push('Limited transaction history');
    }

    // Balance management scoring
    const balances = transactions.filter(t => t.balance !== undefined).map(t => t.balance!);
    let avgBalance = 0;
    if (balances.length > 0) {
      avgBalance = balances.reduce((sum, b) => sum + b, 0) / balances.length;
      const minBalance = Math.min(...balances);
      
      if (avgBalance > 5000) score += 10;
      if (minBalance > 1000) score += 5;
      else {
        score -= 5;
        riskFactors.push('Low minimum balance');
      }
    }

    // Cash flow ratio
    if (avgCredits > 0 && avgDebits > 0) {
      const cashFlowRatio = avgCredits / avgDebits;
      if (cashFlowRatio > 1.2) {
        score += 10;
      } else if (cashFlowRatio < 0.8) {
        score -= 15;
        riskFactors.push('Negative cash flow pattern');
      }
    }

    // Occupation-based scoring
    const occupationScore = this.getOccupationScore(profile.occupation);
    score += occupationScore;

    // Declared income vs observed income
    if (profile.monthlyIncome && avgCredits > 0) {
      const incomeRatio = avgCredits / profile.monthlyIncome;
      if (incomeRatio > 0.8 && incomeRatio < 1.5) {
        score += 5; // Consistent with declared income
      } else if (incomeRatio < 0.5) {
        score -= 10;
        riskFactors.push('Declared income not reflected in transactions');
      }
    }

    // Cap score between 0-100
    score = Math.max(0, Math.min(100, score));

    // Calculate eligible amount based on score and income
    const estimatedIncome = Math.max(avgCredits, profile.monthlyIncome || 0);
    let eligibleAmount = Math.floor(estimatedIncome * this.getLoanMultiplier(score));
    
    // Apply loan amount bands
    if (eligibleAmount < 5000) eligibleAmount = 0;
    else if (eligibleAmount > 50000) eligibleAmount = 50000;

    const maxAmount = Math.min(50000, estimatedIncome * 3);

    // Generate recommendations
    if (score < 60) {
      recommendations.push('Maintain higher average balance to improve eligibility');
    }
    if (credits.length < 5) {
      recommendations.push('More transaction history will help us assess better');
    }
    if (avgCredits < 15000) {
      recommendations.push('Regular income deposits can increase loan amount');
    }

    const explanation = this.generateExplanation(score, avgCredits, avgBalance || 0, credits.length);

    return {
      score,
      eligibleAmount,
      maxAmount,
      explanation,
      riskFactors,
      recommendations,
      confidence: Math.min(95, Math.max(60, credits.length * 15))
    };
  }

  // Generate EMI options
  calculateEMI(principal: number, tenureMonths: number, annualRate: number = 24): number {
    const monthlyRate = annualRate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return Math.ceil(emi);
  }

  // Helper methods
  private parseAmount(amountStr: string): number {
    return parseFloat(amountStr.replace(/,/g, ''));
  }

  private extractDate(text: string): Date | null {
    // Simple date extraction - could be enhanced
    const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-]?(\d{2,4})?/);
    if (dateMatch) {
      const day = parseInt(dateMatch[1]);
      const month = parseInt(dateMatch[2]) - 1;
      const year = dateMatch[3] ? parseInt(dateMatch[3]) : new Date().getFullYear();
      return new Date(year, month, day);
    }
    return null;
  }

  private getOccupationScore(occupation: string): number {
    const scores: Record<string, number> = {
      'farmer': 5,
      'teacher': 15,
      'shopkeeper': 10,
      'driver': 8,
      'worker': 3,
      'other': 5
    };
    return scores[occupation] || 5;
  }

  private getLoanMultiplier(score: number): number {
    if (score >= 80) return 2.0;
    if (score >= 70) return 1.5;
    if (score >= 60) return 1.0;
    if (score >= 50) return 0.7;
    return 0.3;
  }

  private generateExplanation(score: number, avgCredits: number, avgBalance: number, transactionCount: number): string {
    const income = Math.floor(avgCredits);
    const balance = Math.floor(avgBalance);
    
    if (score >= 75) {
      return `Great profile! We see regular income of ₹${income.toLocaleString()} with good account management. Your ${transactionCount} transactions show stable financial behavior.`;
    } else if (score >= 60) {
      return `Good financial profile with average income of ₹${income.toLocaleString()}. We found ${transactionCount} transactions indicating regular money flow.`;
    } else if (score >= 40) {
      return `Moderate risk profile. Average deposits of ₹${income.toLocaleString()} with ${transactionCount} transactions. Building more transaction history will help.`;
    } else {
      return `Limited financial history available. We see average deposits of ₹${income.toLocaleString()}. More regular transactions will improve your profile.`;
    }
  }

  // Generate sample SMS for demo
  generateSampleSMS(): string {
    return `A/c X1234 Credited INR 15,500 by NEFT SALARY JUN2024. Avl Bal: 18,240.67
A/c X1234 Debited INR 2,500 ATM WITHDRAWAL. Avl Bal: 15,740.67
A/c X1234 Credited INR 800 UPI from AMIT PAL. Avl Bal: 16,540.67
A/c X1234 Debited INR 1,200 ELECTRICITY BILL PAYMENT. Avl Bal: 15,340.67
A/c X1234 Credited INR 16,000 by NEFT SALARY JUL2024. Avl Bal: 31,340.67`;
  }
}

export const llmStub = new LLMStubService();