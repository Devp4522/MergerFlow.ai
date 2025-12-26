import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TickerInput } from '@/components/research/TickerInput';
import { CompanyHeader } from '@/components/research/CompanyHeader';
import { ReportBrief } from '@/components/research/ReportBrief';
import { ComparablesTable } from '@/components/research/ComparablesTable';
import { ReportActions } from '@/components/research/ReportActions';
import { useCompanyResearch } from '@/hooks/useCompanyResearch';
import { useAuth } from '@/hooks/useAuth';

export default function Research() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { report, step, error, analyzeCompany, saveReport, reset } = useCompanyResearch();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <FileSearch className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-serif font-semibold text-foreground">
                Company Research Agent
              </h1>
            </div>
          </div>
          {!user && (
            <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
              Sign in to save reports
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
            Analyze Any Public Company
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Enter a stock ticker to get an AI-powered executive brief with financial analysis, 
            risk assessment, and comparable companies.
          </p>
          <TickerInput onAnalyze={analyzeCompany} step={step} />
        </section>

        {/* Error State */}
        {error && step === 'error' && (
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <div className="text-destructive mb-4">
              <Search className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Analysis Failed</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={reset} variant="outline">
              Try Again
            </Button>
          </Card>
        )}

        {/* Results Section */}
        {report && step === 'complete' && (
          <Card className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
            <CompanyHeader report={report} />
            
            <div className="grid lg:grid-cols-2 gap-8">
              <ReportBrief brief={report.brief} />
              <div className="space-y-8">
                <ComparablesTable comparables={report.comparables} />
                
                {/* Key Metrics Summary */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">P/E Ratio</p>
                    <p className="text-xl font-semibold text-foreground">{report.rawData.peRatio || 'N/A'}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Profit Margin</p>
                    <p className="text-xl font-semibold text-foreground">{report.rawData.profitMargin || 'N/A'}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">ROE</p>
                    <p className="text-xl font-semibold text-foreground">{report.rawData.roe || 'N/A'}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Beta</p>
                    <p className="text-xl font-semibold text-foreground">{report.rawData.beta || 'N/A'}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">52W High</p>
                    <p className="text-xl font-semibold text-foreground">${report.rawData.high52Week || 'N/A'}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">52W Low</p>
                    <p className="text-xl font-semibold text-foreground">${report.rawData.low52Week || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <ReportActions report={report} onSave={saveReport} onReset={reset} />
          </Card>
        )}

        {/* Empty State */}
        {step === 'idle' && !report && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <FileSearch className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-serif font-medium text-foreground mb-2">
              Ready to Research
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a US stock ticker above to generate a comprehensive company analysis 
              powered by real-time financial data and AI.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
