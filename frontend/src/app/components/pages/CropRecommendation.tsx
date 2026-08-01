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
  Cloud,
  DollarSign,
  Calculator,
  Sparkles,
  CheckCircle2
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

interface CropRecommendationProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole?: 'farmer' | 'admin';
}

const cropRecommendations = [
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    suitability: 92,
    expectedYield: 4.5,
    yieldUnit: 'tons/acre',
    pricePerTon: 320,
    costPerAcre: 450,
    duration: '120-150 days',
    season: 'Kharif',
    waterRequirement: 'High',
    profitability: 'High',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
    description: 'Optimal pH and rich Nitrogen profile guarantees highly productive rice yields.',
    requirements: {
      temperature: '20-35°C',
      rainfall: '1000-2000mm',
      soil: 'Clay loam',
      ph: '6.0-7.0'
    }
  },
  {
    id: 'wheat',
    name: 'Wheat (Durum)',
    suitability: 88,
    expectedYield: 3.8,
    yieldUnit: 'tons/acre',
    pricePerTon: 280,
    costPerAcre: 380,
    duration: '110-130 days',
    season: 'Rabi',
    waterRequirement: 'Medium',
    profitability: 'Medium',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
    description: 'Excellent soil environment for cereal grain production.',
    requirements: {
      temperature: '12-25°C',
      rainfall: '300-1000mm',
      soil: 'Loamy',
      ph: '6.0-7.5'
    }
  },
  {
    id: 'maize',
    name: 'Hybrid Sweet Corn / Maize',
    suitability: 82,
    expectedYield: 4.1,
    yieldUnit: 'tons/acre',
    pricePerTon: 250,
    costPerAcre: 350,
    duration: '100-115 days',
    season: 'Kharif/Rabi',
    waterRequirement: 'Medium',
    profitability: 'High',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&h=200&fit=crop',
    description: 'Adapts well to varied local nutrient profiles with rapid turnover.',
    requirements: {
      temperature: '18-30°C',
      rainfall: '500-800mm',
      soil: 'Deep well-drained',
      ph: '5.8-7.2'
    }
  }
];

export function CropRecommendation({ onNavigate, navigationData }: CropRecommendationProps) {
  const [nitrogen, setNitrogen] = useState(50);
  const [phosphorus, setPhosphorus] = useState(45);
  const [potassium, setPotassium] = useState(60);
  const [ph, setPh] = useState(6.5);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'calculator'>('recommendations');
  
  // Calculator state
  const [landAcres, setLandAcres] = useState(10);
  const [selectedCropId, setSelectedCropId] = useState('rice');

  const selectedCrop = cropRecommendations.find(c => c.id === selectedCropId) || cropRecommendations[0];

  const totalYield = (selectedCrop.expectedYield * landAcres).toFixed(1);
  const grossRevenue = (selectedCrop.expectedYield * landAcres * selectedCrop.pricePerTon).toFixed(0);
  const totalCost = (selectedCrop.costPerAcre * landAcres).toFixed(0);
  const netProfit = (Number(grossRevenue) - Number(totalCost)).toFixed(0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 font-bold text-xs rounded-full">
            🌾 Agronomic Recommendation Suite
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            AI Crop Recommendation & Financial Profit Estimator
          </h1>
          <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1">
            Configure soil NPK inputs to discover highest-yielding crops and simulate harvest profitability.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-slate-100 dark:bg-neutral-900 rounded-xl p-1">
          <TabsTrigger value="recommendations" className="rounded-lg font-bold text-xs">
            <Sprout className="w-4 h-4 mr-2 text-emerald-500" />
            Crop Matching Engine
          </TabsTrigger>
          <TabsTrigger value="calculator" className="rounded-lg font-bold text-xs">
            <Calculator className="w-4 h-4 mr-2 text-emerald-500" />
            Profit & Yield Estimator
          </TabsTrigger>
        </TabsList>

        {/* Crop Matching Engine */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Control Panel */}
            <Card className="glass-card-premium border-0 p-2">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  Soil Chemistry Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-neutral-200 mb-1">
                    <span>Nitrogen (N)</span>
                    <span className="text-emerald-600 font-bold">{nitrogen} mg/kg</span>
                  </div>
                  <Slider value={[nitrogen]} onValueChange={([v]) => setNitrogen(v)} max={140} min={0} step={1} />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-neutral-200 mb-1">
                    <span>Phosphorus (P)</span>
                    <span className="text-emerald-600 font-bold">{phosphorus} mg/kg</span>
                  </div>
                  <Slider value={[phosphorus]} onValueChange={([v]) => setPhosphorus(v)} max={140} min={0} step={1} />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-neutral-200 mb-1">
                    <span>Potassium (K)</span>
                    <span className="text-emerald-600 font-bold">{potassium} mg/kg</span>
                  </div>
                  <Slider value={[potassium]} onValueChange={([v]) => setPotassium(v)} max={200} min={0} step={1} />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-neutral-200 mb-1">
                    <span>pH Level</span>
                    <span className="text-emerald-600 font-bold">{ph}</span>
                  </div>
                  <Slider value={[ph]} onValueChange={([v]) => setPh(v)} max={10} min={3} step={0.1} />
                </div>
              </CardContent>
            </Card>

            {/* Recommendations Grid */}
            <div className="lg:col-span-2 space-y-4">
              {cropRecommendations.map((crop) => (
                <Card key={crop.id} className="glass-card-premium border-0 overflow-hidden hover:border-emerald-500/40 transition-all">
                  <div className="flex flex-col sm:flex-row">
                    <img src={crop.image} alt={crop.name} className="w-full sm:w-48 h-44 object-cover" />
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">{crop.name}</h3>
                          <Badge className="bg-emerald-500 text-white font-extrabold text-xs">
                            {crop.suitability}% Suitability Match
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">{crop.description}</p>
                        
                        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                          <div className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-900">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Expected Yield</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">{crop.expectedYield} {crop.yieldUnit}</p>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-900">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Growth Period</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">{crop.duration}</p>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-900">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Season</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">{crop.season}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                        <Button
                          onClick={() => {
                            setSelectedCropId(crop.id);
                            setActiveTab('calculator');
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold h-9"
                        >
                          Calculate Financial Yield
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

          </div>
        </TabsContent>

        {/* Profit & Yield Estimator Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <Card className="glass-card-premium border-0 p-2">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-500" />
                  Farm Area & Target Crop Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-bold text-slate-700 dark:text-neutral-200">Total Cultivated Farmland (Acres)</Label>
                  <Input 
                    type="number" 
                    value={landAcres} 
                    onChange={(e) => setLandAcres(Math.max(1, Number(e.target.value)))}
                    className="mt-1 h-10 rounded-xl bg-slate-100 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 font-bold"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700 dark:text-neutral-200">Select Crop Target</Label>
                  <Select value={selectedCropId} onValueChange={setSelectedCropId}>
                    <SelectTrigger className="mt-1 h-10 rounded-xl bg-slate-100 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cropRecommendations.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Financial Projection Dashboard */}
            <Card className="lg:col-span-2 glass-card-premium border-0 p-2">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  Simulated Financial Return for {selectedCrop.name} ({landAcres} Acres)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <p className="text-xs font-bold text-slate-500 dark:text-neutral-400">Total Harvest Yield</p>
                    <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{totalYield} Tons</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <p className="text-xs font-bold text-slate-500 dark:text-neutral-400">Gross Estimated Revenue</p>
                    <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">${grossRevenue}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-center">
                    <p className="text-xs font-bold text-slate-500 dark:text-neutral-400">Estimated Net Profit</p>
                    <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">${netProfit}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/50 dark:border-neutral-800 space-y-2">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider">Financial Breakdown</h4>
                  <div className="flex justify-between text-xs py-1 border-b border-slate-200/40 dark:border-neutral-800">
                    <span className="text-slate-500">Seed & Input Fertilizer Cost (${selectedCrop.costPerAcre}/acre)</span>
                    <span className="font-bold text-red-500">-${totalCost}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-slate-200/40 dark:border-neutral-800">
                    <span className="text-slate-500">Commodity Market Price (${selectedCrop.pricePerTon}/ton)</span>
                    <span className="font-bold text-slate-800 dark:text-white">${selectedCrop.pricePerTon} / Ton</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}