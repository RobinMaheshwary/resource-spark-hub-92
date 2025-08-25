import { Plus, Search, FileText, CheckCircle, Clock, Users, Target, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// Mock data
const mockRequests = [
  {
    id: '1001',
    projectName: 'E-commerce Platform',
    role: 'Senior Java Developer',
    status: 'open' as const,
    matchesFound: 3,
    createdAt: '2024-01-15'
  },
  {
    id: '1002',
    projectName: 'Mobile Banking App',
    role: 'React Native Developer',
    status: 'in_progress' as const,
    matchesFound: 2,
    createdAt: '2024-01-10'
  },
  {
    id: '1003',
    projectName: 'Analytics Dashboard',
    role: 'QA Lead',
    status: 'fulfilled' as const,
    matchesFound: 0,
    createdAt: '2024-01-05'
  }
];

const statusConfig = {
  open: { label: 'Open', variant: 'default' as const, icon: Clock },
  in_progress: { label: 'In Progress', variant: 'secondary' as const, icon: Users },
  fulfilled: { label: 'Fulfilled', variant: 'default' as const, icon: CheckCircle },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: FileText }
};

export function PMDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [matchingStates, setMatchingStates] = useState<Record<string, 'idle' | 'matching' | 'complete'>>({});

  const handleProfileMatching = (requestId: string) => {
    setMatchingStates(prev => ({ ...prev, [requestId]: 'matching' }));
    
    toast({
      title: "Profile Matching Started",
      description: "Finding matching candidates...",
    });

    // Simulate AI matching process
    setTimeout(() => {
      setMatchingStates(prev => ({ ...prev, [requestId]: 'complete' }));
      toast({
        title: "Matching Complete",
        description: "Found 3 matching candidates for review",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your resource requests and view matching candidates
          </p>
        </div>
        <Button 
          onClick={() => navigate('/requests/new')}
          className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              +1 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fulfilled This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Fulfillment Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 days</div>
            <p className="text-xs text-muted-foreground">
              -2 days from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Available for review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* My Requests */}
      <Card>
        <CardHeader>
          <CardTitle>My Requests</CardTitle>
          <CardDescription>
            Track your resource requests and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRequests.map((request) => {
              const StatusIcon = statusConfig[request.status].icon;
              return (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors bg-background"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">#{request.id}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{request.projectName}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{request.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge variant={statusConfig[request.status].variant}>
                        {statusConfig[request.status].label}
                      </Badge>
                      {request.matchesFound > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {request.matchesFound} matches found
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleProfileMatching(request.id)}
                        disabled={matchingStates[request.id] === 'matching'}
                      >
                        <Target className="mr-2 h-3 w-3" />
                        {matchingStates[request.id] === 'matching' ? 'Matching...' : 'Profile Matching'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/requests/${request.id}/edit`)}
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/requests/${request.id}/candidates`)}
                      >
                        <Search className="mr-2 h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}