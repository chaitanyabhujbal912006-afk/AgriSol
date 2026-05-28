import React, { useState } from 'react';
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
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
  { id: 'crop-recommendation', label: 'Crop Recommendation', icon: Sprout, path: '/crop-recommendation' },
  { id: 'soil-prediction', label: 'Soil Prediction', icon: TestTube, path: '/soil-prediction' },
  { id: 'plant-explorer', label: 'Plant Explorer', icon: BookOpen, path: '/plant-explorer' },
  { id: 'disease-library', label: 'Disease Library', icon: Bug, path: '/disease-library' },
  { id: 'growth-calendar', label: 'Growth Calendar', icon: Calendar, path: '/growth-calendar' },
  { id: 'video-hub', label: 'Video Hub', icon: Video, path: '/video-hub' },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare, path: '/feedback' },
  { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
  { id: 'subscription', label: 'Subscription', icon: CreditCard, path: '/subscription' },
];

const mobileNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'crop-recommendation', label: 'Crops', icon: Sprout },
  { id: 'plant-explorer', label: 'Plants', icon: BookOpen },
  { id: 'growth-calendar', label: 'Calendar', icon: Calendar },
  { id: 'more', label: 'More', icon: Menu },
];

export function Layout({ children, currentPage = 'dashboard' }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState('EN');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-border
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-foreground">FarmerAI</span>
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
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                  transition-all duration-200 hover:bg-secondary
                  ${isActive ? 'bg-primary-green text-white' : 'text-foreground hover:text-foreground'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-border px-4 lg:px-6 py-4">
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
                  <p className="text-sm font-medium">John Farmer</p>
                  <p className="text-xs text-muted-foreground">Farmer</p>
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary-green text-white">JF</AvatarFallback>
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