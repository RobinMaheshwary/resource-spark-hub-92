import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export function NewRequestForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<RequestData>({
    projectName: '',
    role: '',
    duration: '',
    startDate: '',
    resourceCount: '1',
    keywords: '',
    jobDescription: ''
  });

  const updateFormData = (field: keyof RequestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateJobDescription = async () => {
    if (!formData.keywords.trim()) {
      toast({
        title: "Keywords Required",
        description: "Please enter keywords to generate job description",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual AI API call)
    setTimeout(() => {
      const generatedJD = `Job Title: ${formData.role}

Job Summary:
We are seeking a skilled ${formData.role} to join our ${formData.projectName} project. The ideal candidate will have experience with ${formData.keywords.split(',').join(', ')}.

Key Responsibilities:
• Develop and maintain software solutions using ${formData.keywords.split(',')[0]?.trim() || 'relevant technologies'}
• Collaborate with cross-functional teams to deliver high-quality products
• Participate in code reviews and maintain coding standards
• Troubleshoot and resolve technical issues

Required Skills & Experience:
• Proficiency in ${formData.keywords}
• Strong problem-solving and analytical skills
• Excellent communication and teamwork abilities
• Bachelor's degree in Computer Science or related field

Project Duration: ${formData.duration}
Start Date: ${formData.startDate}

We offer competitive compensation and opportunities for professional growth.`;

      updateFormData('jobDescription', generatedJD);
      setIsGenerating(false);
      setStep(2);
      
      toast({
        title: "Job Description Generated",
        description: "AI has generated a job description based on your keywords"
      });
    }, 2000);
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.projectName || !formData.role || !formData.jobDescription) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate saving request (replace with actual API call)
    toast({
      title: "Request Created Successfully",
      description: `Resource request for ${formData.role} has been created`
    });
    
    navigate('/requests');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/requests')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Resource Request</h1>
          <p className="text-muted-foreground">
            Step {step} of 2: {step === 1 ? 'Basic Information & Keywords' : 'Review & Edit Job Description'}
          </p>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Request Details
            </CardTitle>
            <CardDescription>
              Provide basic information about your resource requirement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., E-commerce Platform"
                  value={formData.projectName}
                  onChange={(e) => updateFormData('projectName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Required Role *</Label>
                <Input
                  id="role"
                  placeholder="e.g., Senior Java Developer"
                  value={formData.role}
                  onChange={(e) => updateFormData('role', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Project Duration</Label>
                <Select value={formData.duration} onValueChange={(value) => updateFormData('duration', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
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
                <Select value={formData.resourceCount} onValueChange={(value) => updateFormData('resourceCount', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords for Job Description *</Label>
              <Textarea
                id="keywords"
                placeholder="e.g., Java, Spring Boot, Microservices, AWS, REST APIs, MySQL"
                value={formData.keywords}
                onChange={(e) => updateFormData('keywords', e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Enter relevant skills, technologies, and keywords separated by commas. This will be used to generate the job description.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={generateJobDescription} 
                disabled={isGenerating || !formData.keywords.trim()}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating JD...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Job Description
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Generated Job Description
            </CardTitle>
            <CardDescription>
              Review and edit the generated job description as needed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                value={formData.jobDescription}
                onChange={(e) => updateFormData('jobDescription', e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Edit Details
              </Button>
              
              <Button onClick={handleSubmit} className="bg-gradient-to-r from-primary to-primary-glow">
                <Save className="mr-2 h-4 w-4" />
                Create Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}