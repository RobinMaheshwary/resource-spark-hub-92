import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Wand2, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface RequestData {
  projectName: string;
  role: string;
  duration: string;
  startDate: string;
  resourceCount: string;
  keywords: string;
  jobDescription: string;
}

// Mock existing request data
const mockRequestData: Record<string, RequestData> = {
  '1001': {
    projectName: 'E-commerce Platform',
    role: 'Senior Java Developer',
    duration: '6 months',
    startDate: '2024-02-01',
    resourceCount: '2',
    keywords: 'Java, Spring Boot, Microservices, AWS, REST APIs',
    jobDescription: 'We are looking for a Senior Java Developer with expertise in Spring Boot and microservices architecture. The ideal candidate will have experience with AWS cloud services and building scalable REST APIs.'
  },
  '1002': {
    projectName: 'Mobile Banking App',
    role: 'React Native Developer',
    duration: '8 months',
    startDate: '2024-01-15',
    resourceCount: '1',
    keywords: 'React Native, JavaScript, Redux, Mobile Development',
    jobDescription: 'Seeking an experienced React Native Developer to build a cross-platform mobile banking application. Must have strong JavaScript skills and experience with Redux state management.'
  }
};

export function EditRequestForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<RequestData>({
    projectName: '',
    role: '',
    duration: '',
    startDate: '',
    resourceCount: '',
    keywords: '',
    jobDescription: ''
  });

  useEffect(() => {
    if (id && mockRequestData[id]) {
      setFormData(mockRequestData[id]);
    }
  }, [id]);

  const updateFormData = (field: keyof RequestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateJobDescription = async () => {
    if (!formData.keywords.trim()) {
      toast({
        title: "Missing Keywords",
        description: "Please enter keywords to generate job description",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    toast({
      title: "Generating Job Description",
      description: "AI is creating an updated job description based on your keywords...",
    });

    // Simulate AI generation
    setTimeout(() => {
      const newJD = `We are seeking a ${formData.role} for our ${formData.projectName} project. 

Key Requirements:
${formData.keywords.split(',').map(keyword => `• Expertise in ${keyword.trim()}`).join('\n')}

Responsibilities:
• Design and develop high-quality software solutions
• Collaborate with cross-functional teams
• Ensure code quality and best practices
• Participate in agile development processes

Duration: ${formData.duration}
Start Date: ${formData.startDate}
Team Size: ${formData.resourceCount} resources needed

This is an excellent opportunity to work on cutting-edge technology and contribute to meaningful projects.`;

      updateFormData('jobDescription', newJD);
      setIsGenerating(false);
      
      toast({
        title: "Job Description Updated",
        description: "AI has generated an updated job description. Please review and modify as needed.",
      });
    }, 2000);
  };

  const handleSave = () => {
    if (!formData.projectName || !formData.role || !formData.jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Request Updated",
      description: "Your job request has been successfully updated.",
    });

    navigate('/requests');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/requests')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Requests
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Job Request</h1>
          <p className="text-muted-foreground">Update your resource request details</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Update the basic information for this request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => updateFormData('projectName', e.target.value)}
                placeholder="Enter project name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Required Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => updateFormData('role', e.target.value)}
                placeholder="e.g., Senior Java Developer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Project Duration</Label>
              <Select value={formData.duration} onValueChange={(value) => updateFormData('duration', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3 months">3 months</SelectItem>
                  <SelectItem value="6 months">6 months</SelectItem>
                  <SelectItem value="9 months">9 months</SelectItem>
                  <SelectItem value="12 months">12 months</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Desired Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => updateFormData('startDate', e.target.value)}
              />
            </div>


            <div className="space-y-2">
              <Label htmlFor="resourceCount">Number of Resources</Label>
              <Input
                id="resourceCount"
                type="number"
                min="1"
                value={formData.resourceCount}
                onChange={(e) => updateFormData('resourceCount', e.target.value)}
                placeholder="e.g., 2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>Update keywords and regenerate the job description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords for JD Generation</Label>
              <Textarea
                id="keywords"
                value={formData.keywords}
                onChange={(e) => updateFormData('keywords', e.target.value)}
                placeholder="e.g., Java, Spring Boot, Microservices, AWS"
                rows={3}
              />
            </div>

            <Button 
              onClick={generateJobDescription}
              disabled={isGenerating}
              className="w-full"
              variant="secondary"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isGenerating ? 'Regenerating JD...' : 'Regenerate Job Description'}
            </Button>

            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                value={formData.jobDescription}
                onChange={(e) => updateFormData('jobDescription', e.target.value)}
                placeholder="Edit the generated job description..."
                rows={12}
                className="min-h-[300px]"
              />
            </div>

            <Button 
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}