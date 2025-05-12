
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold">
              Kominfo Intern Portal
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary-200 transition-colors">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                  className="hover:text-primary-200 transition-colors"
                >
                  Dashboard
                </Link>
                
                {user?.role === 'user' && (
                  <>
                    <Link to="/upload" className="hover:text-primary-200 transition-colors">
                      Upload Task
                    </Link>
                    <Link to="/history" className="hover:text-primary-200 transition-colors">
                      History
                    </Link>
                  </>
                )}
                
                {user?.role === 'admin' && (
                  <Link to="/admin/reports" className="hover:text-primary-200 transition-colors">
                    Reports
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="hover:text-primary-200 transition-colors">
                  Register
                </Link>
              </>
            )}
          </nav>

          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photo} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem asChild>
                    <Link 
                      to={user.role === 'admin' ? '/admin/profile' : '/profile'} 
                      className="flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
