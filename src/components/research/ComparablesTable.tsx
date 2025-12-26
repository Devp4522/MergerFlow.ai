import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import type { ComparableCompany } from '@/types/research';

interface ComparablesTableProps {
  comparables: ComparableCompany[];
}

export function ComparablesTable({ comparables }: ComparablesTableProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold font-serif text-foreground flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        Top 3 Comparable Companies
      </h3>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Company</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Similarity</TableHead>
              <TableHead className="hidden md:table-cell">Market Cap</TableHead>
              <TableHead className="hidden md:table-cell">P/E</TableHead>
              <TableHead className="hidden lg:table-cell">Reasoning</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparables.map((comp, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{comp.companyName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {comp.ticker}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getScoreColor(comp.similarityScore)}>
                    {comp.similarityScore}%
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {comp.keyMetrics.marketCap}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {comp.keyMetrics.peRatio}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground text-sm max-w-xs truncate">
                  {comp.reasoning}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
