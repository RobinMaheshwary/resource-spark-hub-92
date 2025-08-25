import { FileText, MoreVertical, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CandidateComment } from '@/types';

type CandidateStatus = 'available' | 'interested' | 'interview_scheduled' | 'offer_extended' | 'selected' | 'declined' | 'rejected' | 'no_longer_available';

interface Candidate {
  id: string;
  name: string;
  skills: string[];
  experience: number;
  matchScore: number;
  status: CandidateStatus;
  availability: string;
  resume: string;
  globalStatus: CandidateStatus;
  reservedForJob?: string;
  comments?: CandidateComment[];
  rejectionType?: 'by_candidate' | 'by_interviewer';
}

interface CandidateCardProps {
  candidate: Candidate;
  onAction: (candidateId: string, action: CandidateStatus) => void;
  onViewResume: (candidateName: string, resume: string) => void;
  availableActions: CandidateStatus[];
  bgColor?: string;
}

const actionConfig = {
  interested: { label: 'Mark as Interested', variant: 'outline' as const },
  interview_scheduled: { label: 'Schedule Interview', variant: 'default' as const },
  selected: { label: 'Selected', variant: 'default' as const },
  declined: { label: 'Canceled by Candidate', variant: 'outline' as const },
  rejected: { label: 'Rejected', variant: 'destructive' as const }
};

const statusConfig = {
  available: { label: 'Available', color: 'text-green-600' },
  interested: { label: 'Interested Candidates', color: 'text-blue-600' },
  interview_scheduled: { label: 'Interview Scheduled', color: 'text-purple-600' },
  offer_extended: { label: 'Offer Extended', color: 'text-orange-600' },
  selected: { label: 'Selected/Fulfilled', color: 'text-green-700' },
  declined: { label: 'Declined/Unreserved', color: 'text-gray-600' },
  rejected: { label: 'Rejected by Candidate', color: 'text-red-600' },
  no_longer_available: { label: 'No Longer Available', color: 'text-red-700' }
};

export function CandidateCard({ candidate, onAction, onViewResume, availableActions, bgColor }: CandidateCardProps) {
  // Determine rejection type based on candidate status and context
  const getRejectionLabel = () => {
    if (candidate.status === 'rejected') {
      return candidate.rejectionType === 'by_candidate' ? 'Rejected by Candidate' : 'Rejected by Interviewer';
    }
    return statusConfig[candidate.status].label;
  };

  const getLatestComment = () => {
    if (!candidate.comments || candidate.comments.length === 0) return null;
    return candidate.comments[candidate.comments.length - 1];
  };

  const latestComment = getLatestComment();

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between p-6 border-0 hover:bg-muted/30 transition-colors">
        <div className="flex items-center space-x-6">
          {/* Match Score Highlight Box */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 min-w-[80px] text-center">
            <div className="text-2xl font-bold text-primary">{candidate.matchScore}%</div>
            <div className="text-xs text-muted-foreground font-medium">MATCH</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-semibold text-foreground">{candidate.name}</h4>
              <Badge 
                variant={candidate.status === 'rejected' ? 'destructive' : candidate.status === 'selected' ? 'default' : 'secondary'} 
                className="font-medium"
              >
                {candidate.status === 'rejected' ? getRejectionLabel() : statusConfig[candidate.status].label}
              </Badge>
              {candidate.reservedForJob && (
                <Badge variant="outline" className="text-xs font-medium">
                  Reserved for Job {candidate.reservedForJob}
                </Badge>
              )}
              {latestComment && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <div className="space-y-2">
                      <p className="font-medium">
                        {candidate.rejectionType === 'by_candidate' ? 'Cancellation' : 'Rejection'} Reason:
                      </p>
                      <p className="text-sm bg-muted/50 rounded p-2">{latestComment.reason}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>By: {latestComment.performedBy}</span>
                        <span>{new Date(latestComment.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground font-medium">
              {candidate.experience} years experience
            </p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs bg-background">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewResume(candidate.name, candidate.resume)}
            className="font-medium"
          >
            <FileText className="mr-2 h-4 w-4" />
            View Resume
          </Button>
          
          {availableActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-3">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg z-50">
                {availableActions.map((action) => (
                  <DropdownMenuItem
                    key={action}
                    onClick={() => onAction(candidate.id, action)}
                    className={`font-medium ${action === 'rejected' ? 'text-destructive hover:text-destructive' : action === 'selected' ? 'text-green-600 hover:text-green-700' : ''}`}
                  >
                    {actionConfig[action].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}