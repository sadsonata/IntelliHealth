import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Settings,
  LogOut,
  Activity
} from 'lucide-react';
import { Button } from '../components/Button';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Workout Plan', href: '/workout-plan', icon: Calendar },
    { name: 'Exercise Library', href: '/exercise-library', icon: BookOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    // Handle logout logic here
    window.dispatchEvent(new CustomEvent('logout'));
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-secondary-900">IntelliHealth</span>
            </Link>

            {/* Horizontal Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-sm text-secondary-600 hover:text-secondary-900"
              >
                About
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className="md:hidden bg-white border-b border-secondary-200">
        <div className="px-4 py-3 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full"
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
