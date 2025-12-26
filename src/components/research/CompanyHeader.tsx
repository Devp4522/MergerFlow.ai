import { Building2, TrendingUp, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { CompanyReport } from '@/types/research';

interface CompanyHeaderProps {
  report: CompanyReport;
}

export function CompanyHeader({ report }: CompanyHeaderProps) {
  const formatMarketCap = (cap: string) => {
    const num = parseFloat(cap);
    if (isNaN(num)) return cap;
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="secondary" className="font-mono text-lg px-3 py-1">
            {report.ticker}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
            {report.companyName}
          </h2>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <span className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            {report.rawData.sector} • {report.rawData.industry}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {formatMarketCap(report.rawData.marketCap)}
          </span>
        </div>
      </div>
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        Analyzed {new Date(report.analyzedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
