
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/user/Dashboard";
import UploadTask from "./pages/user/UploadTask";
import TaskHistory from "./pages/user/History";
import UserProfile from "./pages/user/Profile";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminReports from "./pages/admin/Reports";
import AdminProfile from "./pages/admin/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    
    {/* User Routes */}
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute allowedRoles={['user']}>
          <UserDashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/upload" 
      element={
        <ProtectedRoute allowedRoles={['user']}>
          <UploadTask />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/history" 
      element={
        <ProtectedRoute allowedRoles={['user']}>
          <TaskHistory />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/profile" 
      element={
        <ProtectedRoute allowedRoles={['user']}>
          <UserProfile />
        </ProtectedRoute>
      } 
    />
    
    {/* Admin Routes */}
    <Route 
      path="/admin/dashboard" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/reports" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminReports />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin/profile" 
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminProfile />
        </ProtectedRoute>
      } 
    />
    
    {/* 404 Route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <TaskProvider>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </TaskProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
