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

  const handleNavigation = (page: PageType, data?: NavigationData) => {
    // Handle special navigation cases
    switch (page) {
      case 'soil-test':
        setCurrentPage('soil-prediction');
        break;
      case 'video-tutorials':
        setCurrentPage('video-hub');
        break;
      default:
        setCurrentPage(page);
    }
    
    if (data) {
      setNavigationData(data);
    }

    // Handle authentication flow
    if (page === 'dashboard' && !isAuthenticated) {
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
      <Layout currentPage={currentPage.replace('-', '')}>
        {renderPage()}
      </Layout>
      <Toaster />
    </>
  );
}