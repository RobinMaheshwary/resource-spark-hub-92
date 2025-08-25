export type JobPriority = 'high' | 'medium' | 'low';
export type CandidateStatus = 'available' | 'interested' | 'interview_scheduled' | 'offer_extended' | 'selected' | 'declined' | 'rejected' | 'no_longer_available';

export interface CandidateComment {
  id: string;
  candidateId: string;
  jobId: string;
  action: string;
  reason: string;
  timestamp: string;
  performedBy: string;
}

export interface Request {
  id: string;
  projectName: string;
  role: string;
  status: 'open' | 'fulfilled' | 'in_progress' | 'cancelled';
  priority: JobPriority;
  keywords: string[];
  experience: string;
  location: string;
  duration: string;
  startDate: string;
  resourcesRequired: number;
  jobDescription: string;
  createdBy: string;
  createdAt: string;
  matchingProfiles?: Profile[];
}

export interface CandidateReservation {
  candidateId: string;
  jobId: string;
  status: CandidateStatus;
  reservedAt: string;
  reservedFor?: string; // Job ID for hard reserves
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: number;
  location: string;
  availability: 'available' | 'busy' | 'partially_available';
  profileSummary: string;
  certifications: string[];
  previousProjects: string[];
  lastUpdated: string;
  matchScore?: number;
  globalStatus: CandidateStatus;
  jobSpecificStatus: Record<string, CandidateStatus>;
  reservations: CandidateReservation[];
}

export interface DashboardMetrics {
  totalOpenRequests: number;
  totalFulfilledThisMonth: number;
  averageFulfillmentTime: number;
  totalProfiles: number;
  availableProfiles: number;
  fulfillmentRate: number;
}