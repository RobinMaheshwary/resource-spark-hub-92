import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CandidateCard } from './CandidateCard';
import { RejectionStatsCard } from './RejectionStatsCard';
import { DialogPrompt } from '@/components/ui/dialog-prompt';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

const mockCandidates: Record<string, Candidate[]> = {
  '1001': [
    {
      id: 'c1',
      name: 'John Smith',
      skills: ['Java', 'Spring Boot', 'AWS'],
      experience: 5,
      matchScore: 95,
      status: 'available',
      availability: 'Available immediately',
      resume: 'https://example.com/resume1.pdf',
      globalStatus: 'available'
    },
    {
      id: 'c2',
      name: 'Sarah Johnson',
      skills: ['Java', 'Microservices', 'Docker'],
      experience: 7,
      matchScore: 88,
      status: 'interested',
      availability: '2 weeks notice',
      resume: 'https://example.com/resume2.pdf',
      globalStatus: 'interested'
    },
    {
      id: 'c3',
      name: 'Mike Chen',
      skills: ['Java', 'Spring', 'MySQL'],
      experience: 4,
      matchScore: 82,
      status: 'interview_scheduled',
      availability: 'Available in 1 month',
      resume: 'https://example.com/resume3.pdf',
      globalStatus: 'interview_scheduled',
      reservedForJob: '1001'
    },
    {
      id: 'c4',
      name: 'Emma Wilson',
      skills: ['Java', 'REST APIs', 'AWS'],
      experience: 6,
      matchScore: 90,
      status: 'available',
      availability: 'Available immediately',
      resume: 'https://example.com/resume4.pdf',
      globalStatus: 'available'
    },
    {
      id: 'c5',
      name: 'David Brown',
      skills: ['Java', 'Spring Boot'],
      experience: 3,
      matchScore: 75,
      status: 'rejected',
      availability: 'Available in 2 weeks',
      resume: 'https://example.com/resume5.pdf',
      globalStatus: 'available',
      rejectionType: 'by_interviewer',
      comments: [{
        id: '1',
        candidateId: 'c5',
        jobId: '1001',
        action: 'rejected',
        reason: 'Does not meet technical requirements',
        timestamp: '2024-01-15T10:30:00Z',
        performedBy: 'John Doe'
      }]
    },
    {
      id: 'c7',
      name: 'Robert Taylor',
      skills: ['Java', 'Spring Boot', 'React'],
      experience: 6,
      matchScore: 89,
      status: 'selected',
      availability: 'Available immediately',
      resume: 'https://example.com/resume7.pdf',
      globalStatus: 'no_longer_available'
    },
    {
      id: 'c6',
      name: 'Lisa Zhang',
      skills: ['Java', 'Spring Boot', 'Kubernetes'],
      experience: 8,
      matchScore: 93,
      status: 'rejected',
      availability: 'Available immediately',
      resume: 'https://example.com/resume6.pdf',
      globalStatus: 'available',
      rejectionType: 'by_candidate',
      comments: [{
        id: '2',
        candidateId: 'c6',
        jobId: '1001',
        action: 'declined',
        reason: 'Found another opportunity with better compensation package',
        timestamp: '2024-01-16T14:20:00Z',
        performedBy: 'Lisa Zhang'
      }]
    }
  ],
  '1002': [
    {
      id: 'c8',
      name: 'Alex Rodriguez',
      skills: ['React Native', 'JavaScript'],
      experience: 4,
      matchScore: 87,
      status: 'interview_scheduled',
      availability: 'Available immediately',
      resume: 'https://example.com/resume8.pdf',
      globalStatus: 'interview_scheduled',
      reservedForJob: '1002'
    },
    {
      id: 'c9',
      name: 'Jenny Kim',
      skills: ['React Native', 'Redux'],
      experience: 5,
      matchScore: 85,
      status: 'available',
      availability: '1 week notice',
      resume: 'https://example.com/resume9.pdf',
      globalStatus: 'available'
    }
  ]
};

const mockJobDetails = {
  '1001': {
    projectName: 'E-commerce Platform',
    role: 'Senior Java Developer',
    status: 'open'
  },
  '1002': {
    projectName: 'Mobile Banking App',
    role: 'React Native Developer',
    status: 'in_progress'
  }
};

export function JobCandidatesPage(): JSX.Element {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [candidates, setCandidates] = useState<Candidate[]>(
    jobId ? mockCandidates[jobId] || [] : []
  );
  const [jobStatus, setJobStatus] = useState(
    jobId ? mockJobDetails[jobId as keyof typeof mockJobDetails]?.status || 'open' : 'open'
  );
  const [activeSection, setActiveSection] = useState<'available' | 'interested' | 'interview_scheduled' | 'selected' | 'rejected'>('available');
  const [dialogConfig, setDialogConfig] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: CandidateStatus;
    candidateId: string;
    candidateName: string;
  } | null>(null);
  const [conflictDialog, setConflictDialog] = useState<{
    open: boolean;
    candidateName: string;
    existingJobId: string;
  } | null>(null);

  const jobDetails = jobId ? mockJobDetails[jobId as keyof typeof mockJobDetails] : null;

  if (!jobDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <Button onClick={() => navigate('/requests')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleCandidateAction = (candidateId: string, action: CandidateStatus): void => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    // Check for conflicts when scheduling interviews
    if (action === 'interview_scheduled') {
      const hasExistingInterview = candidate.globalStatus === 'interview_scheduled' && candidate.reservedForJob !== jobId;
      if (hasExistingInterview) {
        setConflictDialog({
          open: true,
          candidateName: candidate.name,
          existingJobId: candidate.reservedForJob || 'Unknown'
        });
        return;
      }
    }

    // Actions that require reason prompts
    if (['rejected', 'declined'].includes(action)) {
      const actionLabels = {
        rejected: { title: 'Reject Candidate', description: `Why are you rejecting ${candidate.name}?` },
        declined: { title: 'Cancel Interview', description: `Why is the interview being cancelled for ${candidate.name}?` }
      };
      
      setDialogConfig({
        open: true,
        title: actionLabels[action as keyof typeof actionLabels].title,
        description: actionLabels[action as keyof typeof actionLabels].description,
        action,
        candidateId,
        candidateName: candidate.name
      });
      return;
    }

    // Direct actions without prompts
    performCandidateAction(candidateId, action);
  };

  const performCandidateAction = (candidateId: string, action: CandidateStatus, reason?: string): void => {
    setCandidates(prev => prev.map(candidate => {
      if (candidate.id !== candidateId) return candidate;

      const updatedCandidate = { ...candidate };

      // Advanced reservation logic
      if (action === 'interview_scheduled') {
        // Hard reserve for this job
        updatedCandidate.status = 'interview_scheduled';
        updatedCandidate.globalStatus = 'interview_scheduled';
        updatedCandidate.reservedForJob = jobId;
        
        toast({
          title: "Hard Reserve Created",
          description: `${candidate.name} is now reserved for this job. Status updated for all other jobs to "Interviewing - Reserved for Job ${jobId}"`,
        });
      } else if (action === 'selected') {
        // Globally unavailable
        updatedCandidate.status = 'selected';
        updatedCandidate.globalStatus = 'no_longer_available';
        
        toast({
          title: "Candidate Selected",
          description: `${candidate.name} is now globally unavailable for all other positions`,
        });
      } else if (action === 'interested') {
        // Soft reserve
        updatedCandidate.status = 'interested';
        updatedCandidate.globalStatus = 'interested';
        
        toast({
          title: "Soft Reserve Created",
          description: `${candidate.name} marked as interested (soft reserve)`,
        });
      } else if (action === 'rejected') {
        // Remove from consideration for this job with reason
        updatedCandidate.status = 'rejected';
        updatedCandidate.rejectionType = 'by_interviewer';
        
        // Add comment
        if (reason) {
          const comment: CandidateComment = {
            id: Date.now().toString(),
            candidateId,
            jobId: jobId || '',
            action: 'rejected',
            reason,
            timestamp: new Date().toISOString(),
            performedBy: 'Current User'
          };
          updatedCandidate.comments = [...(updatedCandidate.comments || []), comment];
        }
        
        toast({
          title: "Candidate Rejected",
          description: `${candidate.name} has been rejected for this position`,
        });
      } else if (action === 'declined') {
        // Move to rejected section with "Rejected by Candidate" status
        updatedCandidate.status = 'rejected';
        updatedCandidate.rejectionType = 'by_candidate';
        updatedCandidate.globalStatus = 'available'; // Still available for other jobs
        updatedCandidate.reservedForJob = undefined;
        
        // Add comment
        if (reason) {
          const comment: CandidateComment = {
            id: Date.now().toString(),
            candidateId,
            jobId: jobId || '',
            action: 'declined',
            reason,
            timestamp: new Date().toISOString(),
            performedBy: 'Current User'
          };
          updatedCandidate.comments = [...(updatedCandidate.comments || []), comment];
        }
        
        toast({
          title: "Interview Cancelled by Candidate",
          description: `${candidate.name} has been moved to Rejected section for this job but remains available for other positions`,
        });
      }

      return updatedCandidate;
    }));
  };

  const handleViewResume = (candidateName: string, resume: string): void => {
    toast({
      title: "Opening Resume",
      description: `Viewing resume for ${candidateName}`,
    });
  };

  const handleMarkFulfilled = (): void => {
    setJobStatus('fulfilled');
    toast({
      title: "Job Fulfilled",
      description: "Job has been marked as fulfilled successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/requests')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{jobDetails.projectName}</h1>
            <p className="text-muted-foreground">{jobDetails.role}</p>
          </div>
        </div>
        
        {jobStatus !== 'fulfilled' && (
          <Button onClick={handleMarkFulfilled} className="bg-gradient-to-r from-primary to-primary-glow">
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Fulfilled
          </Button>
        )}
      </div>

      {/* Rejection Stats Card */}
      <RejectionStatsCard candidates={candidates} />

      {/* Professional Section Navigation */}
      <div className="border-b border-border mb-8">
        <div className="flex space-x-6">
          {[
            { key: 'available', label: 'Available Candidates', count: candidates.filter(c => c.status === 'available').length },
            { key: 'interested', label: 'Interested Candidates (Soft Reserve)', count: candidates.filter(c => c.status === 'interested').length },
            { key: 'interview_scheduled', label: 'Interview Scheduled (Hard Reserve)', count: candidates.filter(c => c.status === 'interview_scheduled').length },
            { key: 'selected', label: 'Selected Candidates', count: candidates.filter(c => c.status === 'selected').length },
            { key: 'rejected', label: 'Rejected', count: candidates.filter(c => c.status === 'rejected').length }
          ].map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key as any)}
              className={`pb-4 border-b-2 transition-colors ${
                activeSection === section.key
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{section.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {section.count}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Section Content */}
      <Card className="shadow-sm border-border">
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle className="text-xl font-semibold">
            {activeSection === 'available' && 'Available Candidates'}
            {activeSection === 'interested' && 'Interested Candidates (Soft Reserve)'}
            {activeSection === 'interview_scheduled' && 'Interview Scheduled (Hard Reserve)'}
            {activeSection === 'selected' && 'Selected Candidates'}
            {activeSection === 'rejected' && 'Rejected Candidates'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {candidates.filter(c => c.status === activeSection).length > 0 ? (
              candidates.filter(c => c.status === activeSection).map((candidate) => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  onAction={handleCandidateAction}
                  onViewResume={handleViewResume}
                   availableActions={
                     activeSection === 'available' ? ['interested', 'interview_scheduled', 'rejected'] :
                     activeSection === 'interested' ? ['interview_scheduled', 'declined', 'rejected'] :
                     activeSection === 'interview_scheduled' ? ['selected', 'declined', 'rejected'] :
                     activeSection === 'selected' ? [] :
                     activeSection === 'rejected' ? [] :
                     []
                   }
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No candidates found in this category</p>
                <p className="text-sm mt-2">Candidates will appear here as they are added to this status</p>
              </div>
            )}
          </div>
        </CardContent>
        </Card>

      {candidates.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No candidates found for this position.</p>
          </CardContent>
        </Card>
      )}

      {/* Dialog for actions requiring reasons */}
      {dialogConfig && (
        <DialogPrompt
          open={dialogConfig.open}
          onOpenChange={(open) => !open && setDialogConfig(null)}
          title={dialogConfig.title}
          description={dialogConfig.description}
          onConfirm={(reason) => {
            performCandidateAction(dialogConfig.candidateId, dialogConfig.action, reason);
            setDialogConfig(null);
          }}
          onCancel={() => setDialogConfig(null)}
          variant={dialogConfig.action === 'rejected' ? 'destructive' : 'default'}
          confirmLabel={dialogConfig.action === 'rejected' ? 'Reject' : 'Confirm'}
        />
      )}

      {/* Conflict Resolution Dialog */}
      {conflictDialog && (
        <Dialog open={conflictDialog.open} onOpenChange={(open) => !open && setConflictDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Interview Conflict Detected
              </DialogTitle>
              <DialogDescription>
                {conflictDialog.candidateName} already has an interview scheduled for Job {conflictDialog.existingJobId}. 
                You cannot schedule simultaneous interviews. Please cancel the existing interview first or choose a different candidate.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConflictDialog(null)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Navigate to the conflicting job to resolve
                navigate(`/requests/${conflictDialog.existingJobId}/candidates`);
                setConflictDialog(null);
              }}>
                Go to Job {conflictDialog.existingJobId}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}