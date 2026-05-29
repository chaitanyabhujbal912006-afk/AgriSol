import React from 'react';
import { 
  ArrowRight, 
  Sprout, 
  TestTube, 
  BookOpen, 
  Calendar,
  Video,
  MessageSquare,
  Leaf,
  Droplets,
  Sun,
  Thermometer,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../shared/ImageWithFallback';

const cropCards = [
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    season: 'Kharif',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    icon: <Droplets className="w-4 h-4" />
  },
  {
    id: 'wheat',
    name: 'Wheat',
    season: 'Rabi',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    icon: <Sun className="w-4 h-4" />
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    season: 'Kharif',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop',
    icon: <Sun className="w-4 h-4" />
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    season: 'Perennial',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop',
    icon: <Droplets className="w-4 h-4" />
  },
  {
    id: 'tomato',
    name: 'Tomato',
    season: 'All Season',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop',
    icon: <Thermometer className="w-4 h-4" />
  },
  {
    id: 'cotton',
    name: 'Cotton',
    season: 'Kharif',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
    icon: <Sun className="w-4 h-4" />
  }
];

const quickLinks = [
  {
    id: 'soil-test',
    title: 'Soil Test',
    description: 'Upload soil image for instant analysis',
    icon: <TestTube className="w-6 h-6" />,
    color: 'bg-blue-500'
  },
  {
    id: 'crop-recommendation',
    title: 'Crop Recommendation',
    description: 'Get AI-powered crop suggestions',
    icon: <Sprout className="w-6 h-6" />,
    color: 'bg-green-500'
  },
  {
    id: 'growth-calendar',
    title: 'Growth Calendar',
    description: 'Plan your farming activities',
    icon: <Calendar className="w-6 h-6" />,
    color: 'bg-purple-500'
  },
  {
    id: 'video-tutorials',
    title: 'Video Tutorials',
    description: 'Learn modern farming techniques',
    icon: <Video className="w-6 h-6" />,
    color: 'bg-red-500'
  },
  {
    id: 'chatbot',
    title: 'Virtual Adviser',
    description: 'Get instant farming advice',
    icon: <MessageSquare className="w-6 h-6" />,
    color: 'bg-orange-500'
  }
];

interface LandingProps {
  onNavigate: (page: string, data?: any) => void;
}

export function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop"
            alt="Agricultural landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-primary-green/10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 text-center animate-fade-in-up">
          <div className="glass-card p-8 lg:p-12 max-w-4xl mx-auto backdrop-blur-md">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-green to-primary-green-dark rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-float">
                <Sprout className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Smart Farming with
              <span className="text-harvest-yellow block lg:inline lg:ml-4 drop-shadow-md">
                AI Intelligence
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionize your agricultural practices with AI-powered crop recommendations, 
              soil analysis, and intelligent farming solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="clay-button px-8 py-6 text-lg font-semibold shadow-xl"
                onClick={() => onNavigate('auth')}
              >
                Get Started
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg font-semibold"
                onClick={() => onNavigate('plant-explorer')}
              >
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Crop Feature Tiles */}
      <section className="py-16 lg:py-24 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
              Explore <span className="text-gradient">Crop Intelligence</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Click on any crop to discover optimal growing conditions, disease management, 
              and harvesting insights powered by AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cropCards.map((crop, index) => (
              <Card 
                key={crop.id}
                className={`crop-card-hover cursor-pointer border-0 shadow-lg overflow-hidden group opacity-0 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onNavigate('plant-explorer', { crop: crop.id })}
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={crop.image}
                    alt={crop.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <Badge className="absolute top-3 right-3 bg-white/20 text-white border-0">
                    <span className="mr-1">{crop.icon}</span>
                    {crop.season}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {crop.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Season: {crop.season}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary-green transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
              Quick Access <span className="text-gradient">Tools</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Jump straight into the core features that will transform your farming experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {quickLinks.map((link, index) => (
              <Card 
                key={link.id}
                className={`clay-button cursor-pointer border-0 transition-all duration-300 group opacity-0 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onNavigate(link.id)}
              >
                <CardContent className="p-6 text-center h-full flex flex-col items-center justify-center">
                  <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform`}>
                    {link.icon}
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2">
                    {link.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary-green rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-lg">FarmerAI</span>
              </div>
              <p className="text-neutral-400 text-sm">
                Empowering farmers with AI-driven agricultural intelligence for sustainable and profitable farming.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>Crop Recommendation</li>
                <li>Soil Analysis</li>
                <li>Disease Detection</li>
                <li>Growth Calendar</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>Help Center</li>
                <li>Video Tutorials</li>
                <li>Contact Support</li>
                <li>Community Forum</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
                <li>About Us</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-sm text-neutral-400">
            <p>&copy; 2024 FarmerAI. All rights reserved. Built with ❤️ for farmers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}