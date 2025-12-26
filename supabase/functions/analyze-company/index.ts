import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompanyOverview {
  Symbol: string;
  Name: string;
  Description: string;
  Exchange: string;
  Sector: string;
  Industry: string;
  MarketCapitalization: string;
  PERatio: string;
  DividendYield: string;
  EPS: string;
  RevenueTTM: string;
  ProfitMargin: string;
  OperatingMarginTTM: string;
  ReturnOnEquityTTM: string;
  Beta: string;
  '52WeekHigh': string;
  '52WeekLow': string;
}

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  time_published: string;
  overall_sentiment_label: string;
}

async function fetchCompanyOverview(ticker: string, apiKey: string): Promise<CompanyOverview | null> {
  console.log(`Fetching company overview for ${ticker}`);
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.Note) {
    console.error('Alpha Vantage rate limit:', data.Note);
    throw new Error('API rate limit reached. Please try again tomorrow.');
  }
  
  if (!data.Symbol) {
    console.log('No company data found for ticker:', ticker);
    return null;
  }
  
  return data as CompanyOverview;
}

async function fetchCompanyNews(ticker: string, apiKey: string): Promise<NewsItem[]> {
  console.log(`Fetching news for ${ticker}`);
  const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&limit=5&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.Note) {
    console.error('Alpha Vantage rate limit:', data.Note);
    return [];
  }
  
  if (!data.feed) {
    return [];
  }
  
  return data.feed.slice(0, 5).map((item: any) => ({
    title: item.title,
    summary: item.summary,
    source: item.source,
    time_published: item.time_published,
    overall_sentiment_label: item.overall_sentiment_label,
  }));
}

async function analyzeWithAI(companyData: CompanyOverview, newsData: NewsItem[]): Promise<{ brief: any; comparables: any[] }> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY is not configured');
  }

  const prompt = `You are a senior M&A analyst. Analyze the following company data and provide a comprehensive analysis.

COMPANY DATA:
- Name: ${companyData.Name}
- Ticker: ${companyData.Symbol}
- Sector: ${companyData.Sector}
- Industry: ${companyData.Industry}
- Description: ${companyData.Description}
- Market Cap: ${companyData.MarketCapitalization}
- P/E Ratio: ${companyData.PERatio}
- EPS: ${companyData.EPS}
- Revenue TTM: ${companyData.RevenueTTM}
- Profit Margin: ${companyData.ProfitMargin}
- Operating Margin: ${companyData.OperatingMarginTTM}
- ROE: ${companyData.ReturnOnEquityTTM}
- Beta: ${companyData.Beta}
- 52-Week High: ${companyData['52WeekHigh']}
- 52-Week Low: ${companyData['52WeekLow']}
- Dividend Yield: ${companyData.DividendYield}

RECENT NEWS:
${newsData.map(n => `- ${n.title} (Sentiment: ${n.overall_sentiment_label})`).join('\n')}

Provide your analysis in the following JSON format ONLY (no markdown, no code blocks, just pure JSON):
{
  "brief": {
    "overview": "2-3 sentence company overview",
    "businessModel": "Description of how the company makes money (2-3 sentences)",
    "financials": "Key financial highlights and health assessment (2-3 sentences)",
    "risks": ["risk 1", "risk 2", "risk 3"],
    "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"]
  },
  "comparables": [
    {
      "companyName": "Company Name 1",
      "ticker": "TICK1",
      "similarityScore": 85,
      "reasoning": "Brief explanation of why this is a comparable",
      "keyMetrics": {
        "marketCap": "$XXB",
        "peRatio": "XX",
        "sector": "Sector Name"
      }
    },
    {
      "companyName": "Company Name 2",
      "ticker": "TICK2",
      "similarityScore": 78,
      "reasoning": "Brief explanation",
      "keyMetrics": {
        "marketCap": "$XXB",
        "peRatio": "XX",
        "sector": "Sector Name"
      }
    },
    {
      "companyName": "Company Name 3",
      "ticker": "TICK3",
      "similarityScore": 72,
      "reasoning": "Brief explanation",
      "keyMetrics": {
        "marketCap": "$XXB",
        "peRatio": "XX",
        "sector": "Sector Name"
      }
    }
  ]
}`;

  console.log('Calling Lovable AI for analysis...');
  
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: 'You are a senior M&A analyst. Always respond with valid JSON only, no markdown formatting.' },
        { role: 'user', content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('AI rate limit exceeded. Please try again later.');
    }
    if (response.status === 402) {
      throw new Error('AI credits exhausted. Please add funds to continue.');
    }
    const errorText = await response.text();
    console.error('AI API error:', response.status, errorText);
    throw new Error('AI analysis failed');
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('Empty AI response');
  }

  console.log('AI response received, parsing...');
  
  // Clean the response - remove any markdown formatting
  let cleanContent = content.trim();
  if (cleanContent.startsWith('```json')) {
    cleanContent = cleanContent.slice(7);
  }
  if (cleanContent.startsWith('```')) {
    cleanContent = cleanContent.slice(3);
  }
  if (cleanContent.endsWith('```')) {
    cleanContent = cleanContent.slice(0, -3);
  }
  cleanContent = cleanContent.trim();

  try {
    const parsed = JSON.parse(cleanContent);
    return {
      brief: parsed.brief,
      comparables: parsed.comparables,
    };
  } catch (e) {
    console.error('Failed to parse AI response:', cleanContent);
    throw new Error('Failed to parse AI analysis');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ticker } = await req.json();
    
    if (!ticker || typeof ticker !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid ticker provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanTicker = ticker.toUpperCase().trim();
    
    if (cleanTicker.length > 5 || !/^[A-Z]+$/.test(cleanTicker)) {
      return new Response(
        JSON.stringify({ error: 'Invalid ticker format. Use uppercase letters only, max 5 characters.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ALPHA_VANTAGE_KEY = Deno.env.get('ALPHA_VANTAGE_KEY');
    
    if (!ALPHA_VANTAGE_KEY) {
      console.error('ALPHA_VANTAGE_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting analysis for ticker: ${cleanTicker}`);

    // Step 1: Fetch company data
    const companyData = await fetchCompanyOverview(cleanTicker, ALPHA_VANTAGE_KEY);
    
    if (!companyData) {
      return new Response(
        JSON.stringify({ error: `Ticker "${cleanTicker}" not found. Please check the symbol and try again.` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Fetch news
    const newsData = await fetchCompanyNews(cleanTicker, ALPHA_VANTAGE_KEY);

    // Step 3: Analyze with AI
    const analysis = await analyzeWithAI(companyData, newsData);

    const result = {
      ticker: cleanTicker,
      companyName: companyData.Name,
      rawData: {
        sector: companyData.Sector,
        industry: companyData.Industry,
        marketCap: companyData.MarketCapitalization,
        peRatio: companyData.PERatio,
        eps: companyData.EPS,
        revenue: companyData.RevenueTTM,
        profitMargin: companyData.ProfitMargin,
        operatingMargin: companyData.OperatingMarginTTM,
        roe: companyData.ReturnOnEquityTTM,
        beta: companyData.Beta,
        high52Week: companyData['52WeekHigh'],
        low52Week: companyData['52WeekLow'],
        dividendYield: companyData.DividendYield,
      },
      brief: analysis.brief,
      comparables: analysis.comparables,
      newsCount: newsData.length,
      analyzedAt: new Date().toISOString(),
    };

    console.log('Analysis complete for', cleanTicker);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-company function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
