import React, { useState } from 'react';
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
  ChevronRight,
  Menu,
  X,
  Compass,
  ArrowUpRight,
  Sparkles,
  MapPin
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
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=450&fit=crop',
    icon: <Droplets className="w-4 h-4 text-blue-400" />
  },
  {
    id: 'wheat',
    name: 'Wheat',
    season: 'Rabi',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=450&fit=crop',
    icon: <Sun className="w-4 h-4 text-amber-400" />
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    season: 'Kharif',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=450&fit=crop',
    icon: <Sun className="w-4 h-4 text-yellow-400" />
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    season: 'Perennial',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&h=450&fit=crop',
    icon: <Droplets className="w-4 h-4 text-teal-400" />
  },
  {
    id: 'tomato',
    name: 'Tomato',
    season: 'All Season',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=450&fit=crop',
    icon: <Thermometer className="w-4 h-4 text-red-400" />
  },
  {
    id: 'cotton',
    name: 'Cotton',
    season: 'Kharif',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=450&fit=crop',
    icon: <Sun className="w-4 h-4 text-orange-400" />
  }
];

const quickLinks = [
  {
    id: 'soil-test',
    title: 'Soil Test & Quality',
    description: 'Upload soil sample photos for advanced nutrient analytics',
    icon: <TestTube className="w-6 h-6 text-blue-500" />,
    glowColor: 'rgba(59, 130, 246, 0.08)',
    borderColor: 'group-hover:border-blue-500/30',
    iconBg: 'bg-blue-50 dark:bg-blue-950/30'
  },
  {
    id: 'crop-recommendation',
    title: 'Crop Advisor',
    description: 'AI recommendation modules tailored to your climate metrics',
    icon: <Sprout className="w-6 h-6 text-emerald-500" />,
    glowColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'group-hover:border-emerald-500/30',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/30'
  },
  {
    id: 'growth-calendar',
    title: 'Farming Calendar',
    description: 'Manage crop growth phases, fertilization, and harvesting activities',
    icon: <Calendar className="w-6 h-6 text-purple-500" />,
    glowColor: 'rgba(168, 85, 247, 0.08)',
    borderColor: 'group-hover:border-purple-500/30',
    iconBg: 'bg-purple-50 dark:bg-purple-950/30'
  },
  {
    id: 'video-tutorials',
    title: 'Techniques Hub',
    description: 'Explore curated expert-led video guides for precision farming',
    icon: <Video className="w-6 h-6 text-red-500" />,
    glowColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'group-hover:border-red-500/30',
    iconBg: 'bg-red-50 dark:bg-red-950/30'
  },
  {
    id: 'chatbot',
    title: 'AI Farm Advisor',
    description: 'Instant answers to plant care, diagnostics, and weather warnings',
    icon: <MessageSquare className="w-6 h-6 text-amber-500" />,
    glowColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'group-hover:border-amber-500/30',
    iconBg: 'bg-amber-50 dark:bg-amber-950/30'
  }
];

interface LandingProps {
  onNavigate: (page: string, data?: any) => void;
}

export function Landing({ onNavigate }: LandingProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-foreground overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Floating Header Navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 rounded-2xl bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md border border-white/30 dark:border-neutral-800/50 px-6 py-4 flex items-center justify-between shadow-xl shadow-slate-100/40 dark:shadow-none transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">
            Farmer<span className="text-emerald-500">AI</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 dark:text-neutral-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Features</a>
          <a href="#crops" className="text-sm font-medium text-slate-600 dark:text-neutral-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Crop Intelligence</a>
          <a href="#tools" className="text-sm font-medium text-slate-600 dark:text-neutral-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">Quick Access</a>
        </nav>

        {/* Desktop CTA Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="text-sm font-semibold hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200"
            onClick={() => onNavigate('auth')}
          >
            Log In
          </Button>
          <Button 
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-md shadow-emerald-500/10 px-5 rounded-xl border-0"
            onClick={() => onNavigate('auth')}
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden text-slate-700 dark:text-neutral-200"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[84px] z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg px-6 py-8 flex flex-col gap-6 md:hidden animate-fade-in">
          <a 
            href="#features" 
            className="text-lg font-semibold text-slate-800 dark:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#crops" 
            className="text-lg font-semibold text-slate-800 dark:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Crop Intelligence
          </a>
          <a 
            href="#tools" 
            className="text-lg font-semibold text-slate-800 dark:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Quick Access
          </a>
          <hr className="border-slate-100 dark:border-neutral-800" />
          <Button 
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-6 text-base font-semibold rounded-xl"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('auth');
            }}
          >
            Enter Portal
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-28 overflow-hidden bg-white dark:bg-neutral-950">
        
        {/* Glow Ambient Blobs */}
        <div className="absolute top-[20%] left-[10%] mesh-glow-emerald opacity-70"></div>
        <div className="absolute top-[40%] right-[10%] mesh-glow-amber opacity-60"></div>
        <div className="absolute bottom-[10%] left-[30%] mesh-glow-blue opacity-50"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-12">
          
          {/* Left Column: Rich Typography and Badges */}
          <div className="lg:col-span-7 flex flex-col items-start text-left animate-fade-in-up">
            
            <Badge className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30 px-3 py-1.5 rounded-full mb-6 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen Precision Farming
            </Badge>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
              Empower Your Fields <br />
              With <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 bg-clip-text text-transparent">AI Intelligence</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-neutral-300 mb-8 max-w-2xl leading-relaxed">
              Unlock the power of agricultural machine learning. Upload soil profiles, obtain localized crop intelligence, predict growth stages, and leverage AI diagnostic models for maximum harvest potential.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-6 text-base font-bold rounded-xl shadow-lg shadow-emerald-500/10 border-0"
                onClick={() => onNavigate('auth')}
              >
                Access Portal
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="bg-transparent hover:bg-slate-50 dark:hover:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-200 px-8 py-6 text-base font-semibold rounded-xl"
                onClick={() => {
                  const element = document.getElementById('features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Features
              </Button>
            </div>

            {/* Micro Stats Banner */}
            <div className="grid grid-cols-3 gap-6 md:gap-12 mt-12 pt-8 border-t border-slate-100 dark:border-neutral-900 w-full max-w-lg">
              <div>
                <p className="text-3xl font-extrabold text-slate-800 dark:text-white">98%</p>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">Diagnostic Accuracy</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-800 dark:text-white">12+</p>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">Crops Optimized</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-800 dark:text-white">Instant</p>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">Soil Analysis</p>
              </div>
            </div>

          </div>

          {/* Right Column: Premium Custom Graphical Interactive Showcase */}
          <div className="lg:col-span-5 relative w-full flex justify-center items-center animate-fade-in-up animate-stagger-2">
            
            {/* Visual Frame wrapper */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[36px] bg-slate-900 overflow-hidden shadow-2xl shadow-slate-950/20 border-4 border-slate-800">
              
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=1000&fit=crop"
                alt="AI Farming Diagnostics"
                className="w-full h-full object-cover opacity-80"
              />

              {/* Gradient Backdrop Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              {/* Floating glass overlay panels displaying smart data */}
              <div className="absolute top-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-300">Soil Diagnostic</p>
                    <p className="text-sm font-semibold">Active Scanning</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500 text-white border-0 text-xs">Healthy</Badge>
              </div>

              {/* Overlay Panel 2: Live Sensor Metrics */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-white space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Field Sector A</span>
                  <span>Jan 2026</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-xl bg-white/5 text-center">
                    <p className="text-[10px] text-slate-400">Nitrogen</p>
                    <p className="text-xs font-semibold text-emerald-400">Optimal</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 text-center">
                    <p className="text-[10px] text-slate-400">Moisture</p>
                    <p className="text-xs font-semibold text-blue-400">68%</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 text-center">
                    <p className="text-[10px] text-slate-400">Soil pH</p>
                    <p className="text-xs font-semibold text-yellow-400">6.8</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Extra ambient shapes floating behind frame */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl z-0 animate-float" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl z-0 animate-float" style={{ animationDelay: '1s' }} />

          </div>

        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-24 bg-slate-100 dark:bg-neutral-900/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in-up">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 mb-3 px-3 py-1 font-semibold">
              Advanced Modules
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bespoke Agricultural <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Solutions</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-neutral-400 mt-4 leading-relaxed">
              Harness predictive machine learning algorithms designed to minimize manual guesswork and enhance crop yields through continuous data loops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <Card className="glass-card-premium border-0 opacity-0 animate-fade-in-up">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <TestTube className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Soil Diagnosis</h3>
                <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                  Analyze dirt conditions and pH parameters instantly using photographic input and chemical models for specialized nutrient advice.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-premium border-0 opacity-0 animate-fade-in-up animate-stagger-1">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Crop Analytics</h3>
                <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                  Evaluate nitrogen levels, ambient temperature thresholds, and seasonal cycles to pinpoint high-performance crop options.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card-premium border-0 opacity-0 animate-fade-in-up animate-stagger-2">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">AI Farming Advisor</h3>
                <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                  Ask conversational advice on insect management, disease control, calendar adjustments, or upcoming climate alerts.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Crop Feature Tiles */}
      <section id="crops" className="py-24 bg-white dark:bg-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto animate-fade-in-up">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 mb-3 px-3 py-1 font-semibold">
              Crop Intelligence
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Our <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Plant Library</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-neutral-400 mt-3 leading-relaxed">
              Select any plant to inspect standard developmental schedules, soil composition needs, and automated care recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cropCards.map((crop, index) => (
              <Card 
                key={crop.id}
                className="glass-card-premium overflow-hidden border-0 cursor-pointer group opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onNavigate('plant-explorer', { crop: crop.id })}
              >
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={crop.image}
                    alt={crop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                  
                  <Badge className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-md text-white border border-white/10 px-2.5 py-1 text-xs">
                    <span className="mr-1.5 flex items-center justify-center">{crop.icon}</span>
                    {crop.season}
                  </Badge>
                </div>
                
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-0.5 group-hover:text-emerald-500 transition-colors">
                      {crop.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Season Type: {crop.season}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 group-hover:bg-emerald-500 flex items-center justify-center transition-all duration-300">
                    <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section id="tools" className="py-24 bg-slate-100 dark:bg-neutral-900/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto animate-fade-in-up">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 mb-3 px-3 py-1 font-semibold">
              Interactive Tools
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
              Quick Access <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Modules</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-neutral-400 mt-3 leading-relaxed">
              Launch modular AI micro-applications constructed to provide immediate diagnostic output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {quickLinks.map((link, index) => (
              <Card 
                key={link.id}
                className="glass-card-premium border-0 cursor-pointer group hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between opacity-0 animate-fade-in-up"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  background: `linear-gradient(185deg, var(--glass-bg) 0%, ${link.glowColor} 100%)`
                }}
                onClick={() => onNavigate(link.id)}
              >
                <CardContent className="p-6 text-center flex flex-col items-center justify-center flex-1">
                  <div className={`w-14 h-14 ${link.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner transition-transform group-hover:scale-110`}>
                    {link.icon}
                  </div>
                  
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2 text-base group-hover:text-emerald-500 transition-colors">
                    {link.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                    {link.description}
                  </p>
                </CardContent>
                
                <div className="px-6 pb-4 flex justify-center text-xs text-emerald-500 font-semibold items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Launch <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-neutral-950 text-white border-t border-slate-800 dark:border-neutral-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className="font-extrabold text-lg tracking-tight">FarmerAI</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering international agricultural practices with modern machine learning classifiers for healthy plants and high yields.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-emerald-400">Features</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>Crop Recommendations</li>
                <li>Soil Diagnosis Analytics</li>
                <li>Leaf Disease Detections</li>
                <li>Farming Action Calendars</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-emerald-400">Support</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>Technical Help Desk</li>
                <li>Modern Farming Library</li>
                <li>Cloud Operations Status</li>
                <li>Community Discussions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-emerald-400">Legal</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>Terms of Service Agreement</li>
                <li>Farming Data Privacy Policy</li>
                <li>Browser Cookies Controls</li>
                <li>About AgriSol Research</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 dark:border-neutral-900 mt-12 pt-8 text-center text-xs text-slate-500">
            <p>&copy; 2026 FarmerAI. AgriSol Agricultural Platforms. Built with ❤️ for farmers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}