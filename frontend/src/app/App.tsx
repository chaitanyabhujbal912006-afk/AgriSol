import React, { useState, useEffect } from 'react';
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
import { MarketPrices } from './components/pages/MarketPrices';
import { CommunityForum } from './components/pages/CommunityForum';
import { GovernmentSchemes } from './components/pages/GovernmentSchemes';
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
  | 'market-prices'
  | 'community-forum'
  | 'government-schemes'
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
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default true for frictionless navigation
  const [userRole, setUserRole] = useState<'farmer' | 'admin'>('farmer');

  useEffect(() => {
    // Ensure demo user data exists in localStorage
    const userStr = localStorage.getItem('agrisol_user');
    if (!userStr) {
      const demoUser = {
        name: 'Ramesh Patel',
        mobile: '9876543210',
        email: 'ramesh@agrisol.in',
        role: 'farmer',
        district: 'Nashik',
        state: 'Maharashtra',
        village: 'Dhule',
        cropsGrown: ['Wheat', 'Tomato', 'Soybean'],
      };
      localStorage.setItem('agrisol_user', JSON.stringify(demoUser));
      localStorage.setItem('agrisol_token', 'demo_agrisol_jwt_token_2026');
    }

    // Handle browser back/forward buttons
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        if (event.state.data) setNavigationData(event.state.data);
      } else {
        const path = window.location.pathname.replace('/', '') as PageType;
        setCurrentPage(path || 'landing');
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Set initial page from URL
    const path = window.location.pathname.replace('/', '') as PageType;
    if (path) {
      setCurrentPage(path);
    }

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

    let targetPage: PageType = page;
    switch (page) {
      case 'soil-test':
        targetPage = 'soil-prediction';
        break;
      case 'video-tutorials':
        targetPage = 'video-hub';
        break;
    }

    // Enable authenticated shell layout for all pages except landing/auth
    if (targetPage !== 'landing' && targetPage !== 'auth') {
      setIsAuthenticated(true);
    }

    setCurrentPage(targetPage);

    if (data) {
      setNavigationData(data);
    }

    window.history.pushState(
      { page: targetPage, data: data || {} }, 
      '', 
      '/' + (targetPage === 'landing' ? '' : targetPage)
    );
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

      case 'market-prices':
        return <MarketPrices {...commonProps} />;

      case 'community-forum':
        return <CommunityForum {...commonProps} />;

      case 'government-schemes':
        return <GovernmentSchemes {...commonProps} />;
      
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

  // Show landing or auth pages without full layout shell
  if (currentPage === 'landing' || currentPage === 'auth') {
    return (
      <>
        {renderPage()}
        <Toaster />
      </>
    );
  }

  // Show authenticated pages with main layout shell
  return (
    <>
      <Layout currentPage={currentPage} onNavigate={handleNavigation}>
        {renderPage()}
      </Layout>
      <Toaster />
    </>
  );
}