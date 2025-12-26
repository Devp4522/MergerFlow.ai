-- Create the update_updated_at_column function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create company_reports table for storing research reports
CREATE TABLE public.company_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticker VARCHAR(10) NOT NULL,
  company_name TEXT,
  report_data JSONB NOT NULL,
  comparable_companies JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.company_reports ENABLE ROW LEVEL SECURITY;

-- Users can view their own reports
CREATE POLICY "Users can view their own reports"
ON public.company_reports
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own reports
CREATE POLICY "Users can create their own reports"
ON public.company_reports
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reports
CREATE POLICY "Users can delete their own reports"
ON public.company_reports
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_company_reports_user_id ON public.company_reports(user_id);
CREATE INDEX idx_company_reports_ticker ON public.company_reports(ticker);

-- Add updated_at trigger
CREATE TRIGGER update_company_reports_updated_at
BEFORE UPDATE ON public.company_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();