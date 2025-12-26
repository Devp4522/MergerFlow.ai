import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AlertTriangle, Lightbulb, Building, DollarSign, FileText } from 'lucide-react';
import type { CompanyBrief } from '@/types/research';

interface ReportBriefProps {
  brief: CompanyBrief;
}

export function ReportBrief({ brief }: ReportBriefProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold font-serif text-foreground flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        Executive Brief
      </h3>
      
      <Accordion type="multiple" defaultValue={['overview', 'business', 'financials', 'risks', 'opportunities']} className="space-y-2">
        <AccordionItem value="overview" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-medium hover:no-underline">
            <span className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              Overview
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
            {brief.overview}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="business" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-medium hover:no-underline">
            <span className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              Business Model
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
            {brief.businessModel}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="financials" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-medium hover:no-underline">
            <span className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Financials
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
            {brief.financials}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="risks" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-medium hover:no-underline">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Key Risks
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <ul className="space-y-2">
              {brief.risks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-destructive mt-1">•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="opportunities" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-medium hover:no-underline">
            <span className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              Opportunities
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <ul className="space-y-2">
              {brief.opportunities.map((opportunity, idx) => (
                <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-accent mt-1">•</span>
                  {opportunity}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
