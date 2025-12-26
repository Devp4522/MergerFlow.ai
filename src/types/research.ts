export interface CompanyBrief {
  overview: string;
  businessModel: string;
  financials: string;
  risks: string[];
  opportunities: string[];
}

export interface ComparableCompany {
  companyName: string;
  ticker: string;
  similarityScore: number;
  reasoning: string;
  keyMetrics: {
    marketCap: string;
    peRatio: string;
    sector: string;
  };
}

export interface CompanyRawData {
  sector: string;
  industry: string;
  marketCap: string;
  peRatio: string;
  eps: string;
  revenue: string;
  profitMargin: string;
  operatingMargin: string;
  roe: string;
  beta: string;
  high52Week: string;
  low52Week: string;
  dividendYield: string;
}

export interface CompanyReport {
  ticker: string;
  companyName: string;
  rawData: CompanyRawData;
  brief: CompanyBrief;
  comparables: ComparableCompany[];
  newsCount: number;
  analyzedAt: string;
}

export type AnalysisStep = 
  | 'idle' 
  | 'fetching' 
  | 'analyzing' 
  | 'generating' 
  | 'complete' 
  | 'error';

export interface SavedReport {
  id: string;
  user_id: string;
  ticker: string;
  company_name: string;
  report_data: CompanyBrief;
  comparable_companies: ComparableCompany[];
  created_at: string;
}
