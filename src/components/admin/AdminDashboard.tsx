import { Settings, Users, Activity, Shield, Database, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Mock data
const systemHealth = {
  status: 'healthy',
  uptime: '99.8%',
  lastBackup: '2024-01-15 02:00',
  activeUsers: 24,
  totalUsers: 156
};

const recentUsers = [
  { name: 'John Smith', role: 'PM', lastLogin: '2 hours ago', status: 'active' },
  { name: 'Sarah Johnson', role: 'RMG', lastLogin: '1 hour ago', status: 'active' },
  { name: 'Mike Wilson', role: 'Leadership', lastLogin: '5 hours ago', status: 'inactive' }
];

const auditLogs = [
  { action: 'User Created', user: 'admin@company.com', target: 'alice.smith@company.com', timestamp: '10 minutes ago' },
  { action: 'Profile Updated', user: 'rmg@company.com', target: 'Profile #156', timestamp: '1 hour ago' },
  { action: 'Request Fulfilled', user: 'pm@company.com', target: 'Request #1001', timestamp: '2 hours ago' },
  { action: 'System Config Changed', user: 'admin@company.com', target: 'AI Matching Settings', timestamp: '1 day ago' }
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Administration</h1>
          <p className="text-muted-foreground">
            Monitor system health, manage users, and configure platform settings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Database className="mr-2 h-4 w-4" />
            Backup Now
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            System Config
          </Button>
        </div>
      </div>

      {/* System Health */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Shield className={`h-4 w-4 ${systemHealth.status === 'healthy' ? 'text-success' : 'text-destructive'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{systemHealth.status}</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.uptime}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              of {systemHealth.totalUsers} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Success</div>
            <p className="text-xs text-muted-foreground">
              {systemHealth.lastBackup}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
            <CardDescription>
              Monitor user login status and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.lastLogin}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Manage All Users
            </Button>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>
              Important notifications and warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium">High Memory Usage</p>
                  <p className="text-xs text-muted-foreground">
                    System memory usage at 85%. Consider optimization.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-info/10 rounded-lg">
                <Shield className="h-4 w-4 text-info mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Security Update Available</p>
                  <p className="text-xs text-muted-foreground">
                    New security patch available for authentication module.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-success/10 rounded-lg">
                <Database className="h-4 w-4 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Backup Completed</p>
                  <p className="text-xs text-muted-foreground">
                    Daily backup completed successfully at 02:00 AM.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Logs</CardTitle>
          <CardDescription>
            Track all system activities and user actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      by {log.user} → {log.target}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{log.timestamp}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View Complete Audit Trail
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}