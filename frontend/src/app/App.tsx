import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Landing } from './components/pages/Landing';
import { Auth } from './components/pages/Auth';
import { Dashboard } from './components/pages/Dashboard';
import { CropRecommendation } from './components/pages/CropRecommendation';
import { SoilPrediction } from './components/pages/SoilPrediction';
import { PlantExplorer } from './components/pages/PlantExplorer';
import { DiseaseLibrary } from './components/pages/DiseaseLibrary';
import { GrowthCalendar } from './components/pages/GrowthCalendar';
import { VideoHub } from './components/pages/VideoHub';
import { Feedback } from './components/pages/Feedback';
import { Reports } from './components/pages/Reports';
import { Subscription } from './components/pages/Subscription';
import { Chatbot } from './components/pages/Chatbot';
import { Toaster } from './components/ui/sonner';

type PageType = 
  | 'landing' 
  | 'auth' 
  | 'dashboard' 
  | 'crop-recommendation' 
  | 'soil-prediction' 
  | 'plant-explorer' 
  | 'disease-library' 
  | 'growth-calendar' 
  | 'video-hub'
  | 'feedback'
  | 'reports'
  | 'subscription'
  | 'chatbot'
  | 'soil-test'
  | 'video-tutorials';

interface NavigationData {
  crop?: string;
  disease?: string;
  [key: string]: any;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [navigationData, setNavigationData] = useState<NavigationData>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'farmer' | 'admin'>('farmer');

  React.useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const token = localStorage.getItem('agrisol_token');
      const userStr = localStorage.getItem('agrisol_user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsAuthenticated(true);
          setUserRole(user.role || 'farmer');
          return true;
        } catch (e) {
          localStorage.removeItem('agrisol_token');
          localStorage.removeItem('agrisol_user');
        }
      }
      return false;
    };
    
    const isAuth = checkAuth();

    // Handle browser back/forward buttons
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        if (event.state.data) setNavigationData(event.state.data);
      } else {
        const path = window.location.pathname.replace('/', '');
        setCurrentPage((path || (isAuth ? 'dashboard' : 'landing')) as PageType);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial page from URL or fallback
    const path = window.location.pathname.replace('/', '');
    let initialPage = path || (isAuth ? 'dashboard' : 'landing');
    
    if (initialPage !== 'landing' && initialPage !== 'auth' && !isAuth) {
      initialPage = 'landing';
    }
    
    setCurrentPage(initialPage as PageType);
    window.history.replaceState(
      { page: initialPage, data: {} }, 
      '', 
      '/' + (initialPage === 'landing' ? '' : initialPage)
    );

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigation = (page: PageType | 'logout', data?: NavigationData) => {
    if (page === 'logout') {
      localStorage.removeItem('agrisol_token');
      localStorage.removeItem('agrisol_user');
      setIsAuthenticated(false);
      setCurrentPage('landing');
      window.history.pushState({ page: 'landing', data: {} }, '', '/');
      return;
    }

    let targetPage = page;
    // Handle special navigation cases
    switch (page) {
      case 'soil-test':
        targetPage = 'soil-prediction';
        break;
      case 'video-tutorials':
        targetPage = 'video-hub';
        break;
    }
    
    setCurrentPage(targetPage as PageType);
    
    if (data) {
      setNavigationData(data);
    }

    // Push state to browser history
    window.history.pushState(
      { page: targetPage, data: data || {} }, 
      '', 
      '/' + (targetPage === 'landing' ? '' : targetPage)
    );

    // Handle authentication flow
    if (targetPage === 'dashboard' && !isAuthenticated) {
      setIsAuthenticated(true);
    }
  };

  const renderPage = () => {
    const commonProps = {
      onNavigate: handleNavigation,
      navigationData,
      userRole
    };

    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={handleNavigation} />;
      
      case 'auth':
        return <Auth onNavigate={handleNavigation} />;
      
      case 'dashboard':
        return <Dashboard {...commonProps} />;
      
      case 'crop-recommendation':
        return <CropRecommendation {...commonProps} />;
      
      case 'soil-prediction':
        return <SoilPrediction {...commonProps} />;
      
      case 'plant-explorer':
        return <PlantExplorer {...commonProps} />;
      
      case 'disease-library':
        return <DiseaseLibrary {...commonProps} />;
      
      case 'growth-calendar':
        return <GrowthCalendar {...commonProps} />;
      
      case 'video-hub':
        return <VideoHub {...commonProps} />;
      
      case 'feedback':
        return <Feedback {...commonProps} />;
      
      case 'reports':
        return <Reports {...commonProps} />;
      
      case 'subscription':
        return <Subscription {...commonProps} />;
      
      case 'chatbot':
        return <Chatbot {...commonProps} />;
      
      default:
        return <Landing onNavigate={handleNavigation} />;
    }
  };

  // Show landing or auth pages without layout
  if (!isAuthenticated || currentPage === 'landing' || currentPage === 'auth') {
    return (
      <>
        {renderPage()}
        <Toaster />
      </>
    );
  }

  // Show authenticated pages with layout
  return (
    <>
      <Layout currentPage={currentPage} onNavigate={handleNavigation}>
        {renderPage()}
      </Layout>
      <Toaster />
    </>
  );
}