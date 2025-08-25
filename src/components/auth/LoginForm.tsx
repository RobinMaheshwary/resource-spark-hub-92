import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const demoAccounts = [
  { email: 'pm@company.com', role: 'Project Manager', badge: 'PM' },
  { email: 'rmg@company.com', role: 'Resource Management', badge: 'RMG' },
  { email: 'leadership@company.com', role: 'Leadership', badge: 'LEAD' },
  { email: 'admin@company.com', role: 'Administrator', badge: 'ADMIN' }
];

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome to TalentMatch Pro",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setIsLoading(true);
    
    try {
      await login(demoEmail, 'demo123');
      toast({
        title: "Demo login successful",
        description: `Logged in as ${demoEmail}`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Demo login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            <h1 className="text-3xl font-bold">TalentMatch Pro</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Internal Resource Management Platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Demo Accounts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(account.email)}
                    disabled={isLoading}
                    className="h-auto p-3 flex flex-col items-start"
                  >
                    <Badge variant="secondary" className="mb-1">
                      {account.badge}
                    </Badge>
                    <span className="text-xs">{account.role}</span>
                  </Button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Click any demo account to sign in instantly
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}