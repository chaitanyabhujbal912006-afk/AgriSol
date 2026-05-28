import React, { useState } from 'react';
import { 
  Sliders, 
  Thermometer, 
  Droplets, 
  MapPin, 
  TrendingUp,
  Download,
  Calendar,
  Star,
  ArrowRight,
  Filter,
  RotateCcw,
  Sprout,
  Sun,
  Cloud
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../shared/ImageWithFallback';

interface CropRecommendationProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole: 'farmer' | 'admin';
}

const cropRecommendations = [
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    suitability: 92,
    expectedYield: '4.5 tons/acre',
    duration: '120-150 days',
    season: 'Kharif',
    waterRequirement: 'High',
    profitability: 'High',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
    description: 'Excellent choice for your current soil and climate conditions',
    requirements: {
      temperature: '20-35°C',
      rainfall: '1000-2000mm',
      soil: 'Clay loam',
      ph: '6.0-7.0'
    }
  },
  {
    id: 'wheat',
    name: 'Wheat',
    suitability: 85,
    expectedYield: '3.2 tons/acre',
    duration: '110-130 days',
    season: 'Rabi',
    waterRequirement: 'Medium',
    profitability: 'Medium',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
    description: 'Good option with moderate water requirements',
    requirements: {
      temperature: '12-25°C',
      rainfall: '300-1000mm',
      soil: 'Loamy',
      ph: '6.0-7.5'
    }
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    suitability: 78,
    expectedYield: '45 tons/acre',
    duration: '300-365 days',
    season: 'Perennial',
    waterRequirement: 'Very High',
    profitability: 'Very High',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=300&h=200&fit=crop',
    description: 'Long-term high-yield crop with excellent market demand',
    requirements: {
      temperature: '26-32°C',
      rainfall: '1500-2500mm',
      soil: 'Deep, well-drained',
      ph: '6.5-7.5'
    }
  },
  {
    id: 'cotton',
    name: 'Cotton',
    suitability: 72,
    expectedYield: '2.8 quintals/acre',
    duration: '160-200 days',
    season: 'Kharif',
    waterRequirement: 'Medium',
    profitability: 'High',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
    description: 'Commercial crop with good export potential',
    requirements: {
      temperature: '21-27°C',
      rainfall: '500-1000mm',
      soil: 'Black cotton soil',
      ph: '5.8-8.0'
    }
  }
];

const regions = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Haryana', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];

export function CropRecommendation({ onNavigate, navigationData, userRole }: CropRecommendationProps) {
  const [formData, setFormData] = useState({
    nitrogen: [50],
    phosphorus: [30],
    potassium: [40],
    ph: '',
    rainfall: '',
    temperature: '',
    humidity: '',
    region: navigationData?.soilType || ''
  });
  
  const [showResults, setShowResults] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const handleReset = () => {
    setFormData({
      nitrogen: [50],
      phosphorus: [30],
      potassium: [40],
      ph: '',
      rainfall: '',
      temperature: '',
      humidity: '',
      region: ''
    });
    setShowResults(false);
    setSelectedCrop(null);
  };

  const getSuitabilityColor = (suitability: number) => {
    if (suitability >= 80) return 'text-green-600 bg-green-50';
    if (suitability >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getProfitabilityColor = (profitability: string) => {
    switch (profitability) {
      case 'Very High': return 'bg-green-600';
      case 'High': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            AI Crop Recommendation
          </h1>
          <p className="text-muted-foreground mt-1">
            Get personalized crop suggestions based on soil conditions and climate data
          </p>
        </div>
        
        {showResults && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onNavigate('reports')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button
              onClick={handleReset}
              className="bg-primary-green hover:bg-primary-green/90 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card className="glass-card border-0 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sliders className="w-5 h-5" />
              Input Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NPK Sliders */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Soil Nutrients (ppm)</h3>
                
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    Nitrogen (N)
                    <span className="text-sm text-muted-foreground">{formData.nitrogen[0]}ppm</span>
                  </Label>
                  <Slider
                    value={formData.nitrogen}
                    onValueChange={(value) => handleInputChange('nitrogen', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    Phosphorus (P)
                    <span className="text-sm text-muted-foreground">{formData.phosphorus[0]}ppm</span>
                  </Label>
                  <Slider
                    value={formData.phosphorus}
                    onValueChange={(value) => handleInputChange('phosphorus', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    Potassium (K)
                    <span className="text-sm text-muted-foreground">{formData.potassium[0]}ppm</span>
                  </Label>
                  <Slider
                    value={formData.potassium}
                    onValueChange={(value) => handleInputChange('potassium', value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Environmental Factors */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Environmental Conditions</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>pH Level</Label>
                    <Input
                      type="number"
                      placeholder="6.5"
                      step="0.1"
                      min="4"
                      max="9"
                      value={formData.ph}
                      onChange={(e) => handleInputChange('ph', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Rainfall (mm)</Label>
                    <Input
                      type="number"
                      placeholder="800"
                      min="0"
                      max="3000"
                      value={formData.rainfall}
                      onChange={(e) => handleInputChange('rainfall', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Temperature (°C)</Label>
                    <Input
                      type="number"
                      placeholder="25"
                      min="-10"
                      max="50"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange('temperature', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Humidity (%)</Label>
                    <Input
                      type="number"
                      placeholder="70"
                      min="0"
                      max="100"
                      value={formData.humidity}
                      onChange={(e) => handleInputChange('humidity', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Region/State</Label>
                <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                disabled={showResults}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Get Recommendations
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2">
          {!showResults ? (
            <Card className="glass-card border-0 h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout className="w-8 h-8 text-primary-green" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Ready for Analysis</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Fill in the soil and environmental parameters on the left to get AI-powered crop recommendations tailored to your conditions.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Recommendations Grid */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recommended Crops</span>
                    <Badge className="bg-primary-green text-white">
                      {cropRecommendations.length} matches found
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cropRecommendations.map((crop) => (
                      <Card
                        key={crop.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg border ${
                          selectedCrop === crop.id ? 'border-primary-green bg-primary-green/5' : 'border-border hover:border-primary-green/50'
                        }`}
                        onClick={() => setSelectedCrop(selectedCrop === crop.id ? null : crop.id)}
                      >
                        <div className="relative h-32 overflow-hidden">
                          <ImageWithFallback
                            src={crop.image}
                            alt={crop.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          
                          <div className="absolute top-2 right-2">
                            <Badge className={`${getSuitabilityColor(crop.suitability)} border-0`}>
                              {crop.suitability}% Match
                            </Badge>
                          </div>

                          <div className="absolute bottom-2 left-2">
                            <Badge className="bg-white/20 text-white border-0">
                              {crop.season}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground">{crop.name}</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(crop.suitability / 20) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-3">{crop.description}</p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Expected Yield:</span>
                              <span className="font-medium">{crop.expectedYield}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Duration:</span>
                              <span className="font-medium">{crop.duration}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Water Need:</span>
                              <span className="font-medium">{crop.waterRequirement}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Profitability:</span>
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${getProfitabilityColor(crop.profitability)}`} />
                                <span className="text-sm font-medium">{crop.profitability}</span>
                              </div>
                            </div>
                          </div>
                          
                          <Progress value={crop.suitability} className="mt-3 h-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed View */}
              {selectedCrop && (
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle>Detailed Analysis - {cropRecommendations.find(c => c.id === selectedCrop)?.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const crop = cropRecommendations.find(c => c.id === selectedCrop);
                      if (!crop) return null;
                      
                      return (
                        <Tabs defaultValue="requirements" className="space-y-4">
                          <TabsList className="grid grid-cols-3 w-full">
                            <TabsTrigger value="requirements">Requirements</TabsTrigger>
                            <TabsTrigger value="timeline">Timeline</TabsTrigger>
                            <TabsTrigger value="economics">Economics</TabsTrigger>
                          </TabsList>

                          <TabsContent value="requirements" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Thermometer className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-800">Temperature</span>
                                </div>
                                <p className="text-lg font-bold text-blue-900">{crop.requirements.temperature}</p>
                              </div>
                              
                              <div className="p-4 rounded-lg bg-cyan-50 border border-cyan-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Droplets className="w-4 h-4 text-cyan-600" />
                                  <span className="text-sm font-medium text-cyan-800">Rainfall</span>
                                </div>
                                <p className="text-lg font-bold text-cyan-900">{crop.requirements.rainfall}</p>
                              </div>
                              
                              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-4 h-4 bg-amber-600 rounded" />
                                  <span className="text-sm font-medium text-amber-800">Soil Type</span>
                                </div>
                                <p className="text-lg font-bold text-amber-900">{crop.requirements.soil}</p>
                              </div>
                              
                              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-4 h-4 bg-green-600 rounded-full" />
                                  <span className="text-sm font-medium text-green-800">pH Range</span>
                                </div>
                                <p className="text-lg font-bold text-green-900">{crop.requirements.ph}</p>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="timeline" className="space-y-4">
                            <div className="space-y-4">
                              <div className="p-4 rounded-lg border border-border">
                                <h4 className="font-semibold mb-2">Growing Timeline</h4>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                    <span className="text-sm">Sowing: Week 1-2</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                    <span className="text-sm">Vegetative Growth: Week 3-8</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                    <span className="text-sm">Flowering: Week 9-12</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                                    <span className="text-sm">Harvest: Week 15-20</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="economics" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                <h4 className="font-semibold text-green-800 mb-2">Investment</h4>
                                <p className="text-2xl font-bold text-green-900">₹25,000/acre</p>
                                <p className="text-sm text-green-700">Initial setup cost</p>
                              </div>
                              
                              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                <h4 className="font-semibold text-blue-800 mb-2">Expected Revenue</h4>
                                <p className="text-2xl font-bold text-blue-900">₹45,000/acre</p>
                                <p className="text-sm text-blue-700">Gross income</p>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => onNavigate('growth-calendar', { crops: cropRecommendations.slice(0, 2) })}
                  className="clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Growth Calendar
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => onNavigate('plant-explorer', { crop: selectedCrop || cropRecommendations[0].id })}
                >
                  Explore Plant Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}