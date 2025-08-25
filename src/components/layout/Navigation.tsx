import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  PlusCircle, 
  UserCheck,
  Database,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navigationItems: NavItem[] = [
  // PM Navigation
  { title: 'My Requests', href: '/requests', icon: FileText, roles: ['pm'] },
  { title: 'New Request', href: '/requests/new', icon: PlusCircle, roles: ['pm'] },
  { title: 'Matches', href: '/matches', icon: UserCheck, roles: ['pm'] },
  
  // RMG Navigation
  { title: 'Talent Pool', href: '/profiles', icon: Users, roles: ['rmg'] },
  { title: 'Add Profile', href: '/profiles/new', icon: Database, roles: ['rmg'] },
  
  // Leadership Navigation
  { title: 'Dashboard', href: '/dashboard', icon: BarChart3, roles: ['leadership'] },
  { title: 'Reports', href: '/reports', icon: TrendingUp, roles: ['leadership'] },
  
  // Admin Navigation
  { title: 'User Management', href: '/admin/users', icon: Shield, roles: ['admin'] },
  { title: 'System Config', href: '/admin/config', icon: Settings, roles: ['admin'] },
  { title: 'Audit Logs', href: '/admin/logs', icon: FileText, roles: ['admin'] },
];

export function Navigation() {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredItems = navigationItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <nav className="w-64 bg-card border-r min-h-screen">
      <div className="p-4">
        <div className="space-y-1">
          {filteredItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                  isActive && 'bg-muted text-primary font-medium'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}