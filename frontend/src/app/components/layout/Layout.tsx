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
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950">
      {/* Desktop Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl border-r border-slate-200/40 dark:border-neutral-800/40
        transform transition-transform duration-300 ease-in-out shadow-xl shadow-slate-100/50 dark:shadow-none
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200/40 dark:border-neutral-800/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/10">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-800 dark:text-white">
              Farmer<span className="text-emerald-500">AI</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-slate-500 hover:bg-slate-100"
            onClick={toggleSidebar}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                  transition-all duration-200 font-semibold text-sm
                  ${isActive 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/10 transform scale-[1.01]' 
                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100/50 dark:hover:bg-neutral-800/40 hover:text-emerald-500 dark:hover:text-emerald-400'
                  }
                `}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-md border-b border-slate-200/40 dark:border-neutral-800/40 px-4 lg:px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-slate-600 dark:text-neutral-300"
                onClick={toggleSidebar}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="relative max-w-md hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search diagnostics, crops..."
                  className="pl-9 h-9 w-[260px] bg-slate-100/50 dark:bg-neutral-900/60 border border-slate-200/40 dark:border-neutral-800/40 focus-visible:ring-1 focus-visible:ring-emerald-500/30 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <Button variant="ghost" size="sm" className="gap-2 text-slate-600 dark:text-neutral-300">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline font-semibold text-xs">{language}</span>
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative text-slate-600 dark:text-neutral-300">
                <Bell className="w-4.5 h-4.5 text-slate-400" />
                <Badge className="absolute top-1.5 right-1.5 w-1.5 h-1.5 p-0 bg-red-500 border border-white dark:border-neutral-950 rounded-full" />
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{userDisplay.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{userDisplay.role}</p>
                </div>
                <Avatar className="w-8 h-8 ring-2 ring-emerald-500/10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs">{userDisplay.initials}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-t border-slate-200/50 dark:border-neutral-800/50 z-40">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`
                  flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg
                  transition-colors duration-200
                  ${isActive ? 'text-emerald-500 font-semibold' : 'text-slate-500 dark:text-neutral-400'}
                `}
              >
                <Icon className="w-4.5 h-4.5" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}