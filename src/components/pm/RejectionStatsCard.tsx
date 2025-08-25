import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, UserX, UserMinus } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  status: string;
  rejectionType?: 'by_candidate' | 'by_interviewer';
  comments?: Array<{ reason: string; performedBy: string; timestamp: string; }>;
}

interface RejectionStatsProps {
  candidates: Candidate[];
}

export function RejectionStatsCard({ candidates }: RejectionStatsProps) {
  const selectedCount = candidates.filter(c => c.status === 'selected').length;
  const rejectedByInterviewer = candidates.filter(c => c.status === 'rejected' && c.rejectionType === 'by_interviewer').length;
  const rejectedByCandidate = candidates.filter(c => c.status === 'rejected' && c.rejectionType === 'by_candidate').length;
  
  const totalProcessed = selectedCount + rejectedByInterviewer + rejectedByCandidate;
  const selectionRate = totalProcessed > 0 ? Math.round((selectedCount / totalProcessed) * 100) : 0;

  return (
    <Card className="bg-gradient-to-br from-background to-muted/20 border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Candidate Processing Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <UserCheck className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Selected</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">{selectedCount}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <UserX className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">Rejected by Interviewer</p>
              <p className="text-2xl font-bold text-red-800 dark:text-red-300">{rejectedByInterviewer}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <UserMinus className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Cancelled by Candidate</p>
              <p className="text-2xl font-bold text-orange-800 dark:text-orange-300">{rejectedByCandidate}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm font-medium text-muted-foreground">Selection Rate:</span>
          <Badge variant={selectionRate >= 50 ? 'default' : selectionRate >= 25 ? 'secondary' : 'destructive'} className="font-semibold">
            {selectionRate}%
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Based on {totalProcessed} processed candidates. Click on message icons to view rejection/cancellation reasons.
        </div>
      </CardContent>
    </Card>
  );
}