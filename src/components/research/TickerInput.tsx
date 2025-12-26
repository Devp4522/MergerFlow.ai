import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import type { AnalysisStep } from '@/types/research';

interface TickerInputProps {
  onAnalyze: (ticker: string) => void;
  step: AnalysisStep;
}

export function TickerInput({ onAnalyze, step }: TickerInputProps) {
  const [ticker, setTicker] = useState('');
  
  const isLoading = step === 'fetching' || step === 'analyzing' || step === 'generating';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim() && !isLoading) {
      onAnalyze(ticker);
    }
  };

  const getStepMessage = () => {
    switch (step) {
      case 'fetching':
        return 'Fetching company filings...';
      case 'analyzing':
        return 'Analyzing data with AI...';
      case 'generating':
        return 'Generating report...';
      default:
        return null;
    }
  };

  const stepMessage = getStepMessage();

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Enter ticker (e.g., AAPL, TSLA)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase().slice(0, 5))}
            className="h-12 pl-4 pr-12 text-lg font-mono uppercase tracking-wider"
            disabled={isLoading}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <Button 
          type="submit" 
          size="lg" 
          className="h-12 px-6"
          disabled={!ticker.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing
            </>
          ) : (
            'Analyze'
          )}
        </Button>
      </div>
      
      {stepMessage && (
        <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{stepMessage}</span>
        </div>
      )}
    </form>
  );
}
