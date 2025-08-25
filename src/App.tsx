import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import PMDashboardPage from "./pages/PMDashboardPage";
import NewRequestPage from "./pages/NewRequestPage";
import EditRequestPage from "./pages/EditRequestPage";
import JobCandidatesPage from "./pages/JobCandidatesPage";
import RMGDashboardPage from "./pages/RMGDashboardPage";
import LeadershipDashboardPage from "./pages/LeadershipDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function RoleBasedRoute({ allowedRoles, children }: { 
  allowedRoles: string[]; 
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
}

function DashboardRedirect() {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  switch (user.role) {
    case 'pm':
      return <Navigate to="/requests" />;
    case 'rmg':
      return <Navigate to="/profiles" />;
    case 'leadership':
      return <Navigate to="/dashboard" />;
    case 'admin':
      return <Navigate to="/admin" />;
    default:
      return <Navigate to="/login" />;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<DashboardRedirect />} />
              
              {/* PM Routes */}
              <Route path="/requests" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['pm']}>
                    <PMDashboardPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/requests/new" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['pm']}>
                    <NewRequestPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/requests/:id/edit" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['pm']}>
                    <EditRequestPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/requests/:jobId/candidates" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['pm']}>
                    <JobCandidatesPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              {/* RMG Routes */}
              <Route path="/profiles" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['rmg']}>
                    <RMGDashboardPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              {/* Leadership Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['leadership']}>
                    <LeadershipDashboardPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              <Route path="/unauthorized" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-muted-foreground">You don't have permission to access this page.</p>
                  </div>
                </div>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
