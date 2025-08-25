import { TrendingUp, TrendingDown, Users, Clock, BarChart3, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Mock data for charts and metrics
const mockMetrics = {
  totalOpenPositions: 15,
  fulfilledThisMonth: 8,
  avgFulfillmentTime: 6.5,
  fulfillmentRate: 73,
  monthlyTrend: [
    { month: 'Jan', fulfilled: 12, open: 8 },
    { month: 'Feb', fulfilled: 15, open: 6 },
    { month: 'Mar', fulfilled: 18, open: 4 },
    { month: 'Apr', fulfilled: 14, open: 10 },
    { month: 'May', fulfilled: 20, open: 5 },
    { month: 'Jun', fulfilled: 16, open: 9 }
  ]
};

const departmentMetrics = [
  { name: 'Engineering', open: 8, fulfilled: 12, rate: 60 },
  { name: 'Data Science', open: 3, fulfilled: 6, rate: 67 },
  { name: 'Product', open: 2, fulfilled: 4, rate: 67 },
  { name: 'Design', open: 2, fulfilled: 3, rate: 60 }
];

export function LeadershipDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Executive Dashboard</h1>
          <p className="text-muted-foreground">
            Overall resource fulfillment insights and organizational metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Detailed Analytics
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalOpenPositions}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-success" />
              -2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fulfilled This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.fulfilledThisMonth}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-success" />
              +25% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Fulfillment Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.avgFulfillmentTime} days</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-success" />
              -1.5 days improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fulfillment Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.fulfillmentRate}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-success" />
              +8% from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Fulfillment by Department */}
        <Card>
          <CardHeader>
            <CardTitle>Fulfillment by Department</CardTitle>
            <CardDescription>
              Resource allocation efficiency across teams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentMetrics.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dept.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {dept.fulfilled}/{dept.fulfilled + dept.open} ({dept.rate}%)
                    </span>
                  </div>
                  <Progress value={dept.rate} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{dept.open} open</span>
                    <span>{dept.fulfilled} fulfilled</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest fulfillment activities across the organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Senior Java Developer position fulfilled</p>
                  <p className="text-xs text-muted-foreground">Engineering • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-info rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New request: UX Designer</p>
                  <p className="text-xs text-muted-foreground">Product Team • 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Data Analyst position fulfilled</p>
                  <p className="text-xs text-muted-foreground">Data Science • 1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">DevOps Engineer - 5 days overdue</p>
                  <p className="text-xs text-muted-foreground">Engineering • 2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>6-Month Fulfillment Trend</CardTitle>
          <CardDescription>
            Monthly comparison of fulfilled vs open positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {mockMetrics.monthlyTrend.map((month) => (
              <div key={month.month} className="flex flex-col items-center space-y-2 flex-1">
                <div className="flex flex-col items-center space-y-1 w-full">
                  <div 
                    className="w-full bg-success rounded-t"
                    style={{ height: `${(month.fulfilled / 25) * 200}px` }}
                  />
                  <div 
                    className="w-full bg-warning rounded-t"
                    style={{ height: `${(month.open / 25) * 100}px` }}
                  />
                </div>
                <span className="text-xs font-medium">{month.month}</span>
                <div className="text-center">
                  <div className="text-xs text-success">{month.fulfilled}</div>
                  <div className="text-xs text-warning">{month.open}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded" />
              <span className="text-sm">Fulfilled</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded" />
              <span className="text-sm">Open</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}