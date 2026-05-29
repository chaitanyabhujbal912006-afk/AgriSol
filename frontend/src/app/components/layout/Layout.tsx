import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Sprout, 
  TestTube, 
  BookOpen, 
  Calendar,
  Video,
  MessageSquare,
  FileText,
  CreditCard,
  Bug,
  BarChart3,
  Menu,
  X,
  Search,
  Bell,
  User,
  Globe,
  Settings
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
  { id: 'crop-recommendation', label: 'Crop Recommendation', icon: Sprout, path: '/crop-recommendation' },
  { id: 'soil-prediction', label: 'Soil Prediction', icon: TestTube, path: '/soil-prediction' },
  { id: 'plant-explorer', label: 'Plant Explorer', icon: BookOpen, path: '/plant-explorer' },
  { id: 'disease-library', label: 'Disease Library', icon: Bug, path: '/disease-library' },
  { id: 'growth-calendar', label: 'Growth Calendar', icon: Calendar, path: '/growth-calendar' },
  { id: 'chatbot', label: 'AI Adviser', icon: MessageSquare, path: '/chatbot' },
  { id: 'video-hub', label: 'Video Hub', icon: Video, path: '/video-hub' },
  { id: 'feedback', label: 'Feedback', icon: FileText, path: '/feedback' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'subscription', label: 'Subscription', icon: CreditCard, path: '/subscription' },
  { id: 'logout', label: 'Logout', icon: X, path: '/logout' },
];

const mobileNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'crop-recommendation', label: 'Crops', icon: Sprout },
  { id: 'plant-explorer', label: 'Plants', icon: BookOpen },
  { id: 'growth-calendar', label: 'Calendar', icon: Calendar },
  { id: 'logout', label: 'Logout', icon: X },
];

export function Layout({ children, currentPage = 'dashboard', onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [userDisplay, setUserDisplay] = useState({ name: 'Farmer', initials: 'F', role: 'farmer' });

  useEffect(() => {
    const userStr = localStorage.getItem('agrisol_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const email = user.email || '';
        const namePart = email.split('@')[0] || 'Farmer';
        const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const initials = displayName.slice(0, 2).toUpperCase();
        setUserDisplay({ name: displayName, initials, role: user.role || 'farmer' });
      } catch {}
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white/80 backdrop-blur-xl border-r border-border
        transform transition-transform duration-300 ease-in-out shadow-lg
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-green to-primary-green-dark rounded-xl flex items-center justify-center shadow-md">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-primary-green-dark">
              FarmerAI
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                  transition-all duration-300 font-medium
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary-green/90 to-primary-green text-white shadow-md transform scale-[1.02]' 
                    : 'text-muted-foreground hover:bg-neutral-100 hover:text-foreground'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-border px-4 lg:px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={toggleSidebar}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search crops, diseases, tutorials..."
                  className="pl-10 bg-input-background border-0 focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language}</span>
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-danger-red" />
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">{userDisplay.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userDisplay.role}</p>
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary-green text-white">{userDisplay.initials}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg
                  transition-colors duration-200
                  ${isActive ? 'text-primary-green' : 'text-muted-foreground'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}