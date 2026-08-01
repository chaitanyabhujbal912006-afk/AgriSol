import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  FileImage,
  MapPin,
  Calendar,
  BarChart3,
  ArrowRight,
  Info,
  Sparkles,
  Layers,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface SoilPredictionProps {
  onNavigate: (page: string, data?: any) => void;
}

const sampleImages = [
  {
    name: 'Alluvial Field Sample',
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
    type: 'Alluvial Soil'
  },
  {
    name: 'Red Clay Sample',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    type: 'Red Soil'
  },
  {
    name: 'Rich Black Loam',
    url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    type: 'Black Soil'
  }
];

const soilTypes = [
  {
    type: 'Alluvial Soil',
    confidence: 89,
    description: 'Highly rich in silt and essential mineral nutrients, ideal for crop cultivation.',
    characteristics: ['High fertility', 'Superior water retention', 'Potash rich', 'Moderate nitrogen'],
    color: 'bg-emerald-500',
    suitableCrops: ['Basmati Rice', 'Durum Wheat', 'Sugarcane', 'Cotton']
  },
  {
    type: 'Red Soil',
    confidence: 65,
    description: 'Iron oxide rich soil, good drainage properties for root crops.',
    characteristics: ['Iron oxide content', 'Excellent drainage', 'Low phosphorus'],
    color: 'bg-red-500',
    suitableCrops: ['Groundnut', 'Pulses', 'Wheat', 'Potatoes']
  },
  {
    type: 'Black Cotton Soil',
    confidence: 42,
    description: 'Clay-dense soil with remarkable moisture retention during dry seasons.',
    characteristics: ['High clay content', 'Self-ploughing nature', 'Calcium & Magnesium rich'],
    color: 'bg-slate-800',
    suitableCrops: ['Cotton', 'Soybean', 'Sunflower', 'Jowar']
  }
];

const mockAnalysis = {
  pH: 6.8,
  nitrogen: 'High (85 mg/kg)',
  phosphorus: 'Medium (42 mg/kg)',
  potassium: 'Optimal (190 mg/kg)',
  organicMatter: '4.2% (Excellent)',
  salinity: '0.4 dS/m (Safe)',
  recommendations: [
    'Soil pH (6.8) is optimal for high nitrogen intake.',
    'Nitrogen levels are strong; avoid excessive urea fertilizers.',
    'Potassium levels are in ideal equilibrium for root development.',
    'Add organic compost prior to monsoon sowing.'
  ]
};

export function SoilPrediction({ onNavigate }: SoilPredictionProps) {
  const [uploadState, setUploadState] = useState<'empty' | 'uploading' | 'uploaded' | 'analyzing' | 'results'>('empty');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [predictedSoilTypes, setPredictedSoilTypes] = useState<any[]>(soilTypes);
  const [detailedAnalysis, setDetailedAnalysis] = useState<any>(mockAnalysis);

  const handleSelectSample = (sampleUrl: string) => {
    setUploadedImage(sampleUrl);
    setUploadState('uploaded');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        simulateUpload();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateUpload = () => {
    setUploadState('uploading');
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState('uploaded');
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) return;
    setUploadState('analyzing');
    
    setTimeout(() => {
      setPredictedSoilTypes(soilTypes);
      setDetailedAnalysis(mockAnalysis);
      setUploadState('results');
    }, 1800);
  };

  const handleReset = () => {
    setUploadState('empty');
    setUploadedImage(null);
    setUploadProgress(0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 font-bold text-xs rounded-full">
            🧪 Soil Diagnostics Engine
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            AI Soil Type & Chemistry Analyzer
          </h1>
          <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1">
            Upload a soil photo or select a sample to perform computer-vision classification & NPK assessment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upload & Scanner Card */}
        <Card className="glass-card-premium border-0 p-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
              <Camera className="w-5 h-5 text-emerald-500" />
              Soil Sample Capture & Preset Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {uploadState === 'empty' && (
              <div className="space-y-4">
                <div
                  className={`
                    relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
                    ${dragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-300 dark:border-neutral-800 hover:border-emerald-500/50'}
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-base">Drag & Drop Soil Image</h3>
                      <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP (Max 10MB)</p>
                    </div>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs px-5 py-2"
                    >
                      Browse Device Photo
                    </Button>
                  </div>
                </div>

                {/* Instant Sample Presets */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Or select a demo sample:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {sampleImages.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectSample(s.url)}
                        className="group text-left rounded-xl overflow-hidden border border-slate-200 dark:border-neutral-800 hover:border-emerald-500 transition-all"
                      >
                        <img src={s.url} alt={s.name} className="w-full h-20 object-cover group-hover:scale-105 transition-transform" />
                        <div className="p-2 bg-slate-50 dark:bg-neutral-900">
                          <p className="text-[10px] font-bold text-slate-700 dark:text-neutral-200 truncate">{s.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {uploadState === 'uploading' && (
              <div className="py-12 text-center space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                <h3 className="font-bold text-slate-800 dark:text-white text-base">Uploading Soil Image...</h3>
                <Progress value={uploadProgress} className="h-2 max-w-xs mx-auto" />
              </div>
            )}

            {(uploadState === 'uploaded' || uploadState === 'analyzing' || uploadState === 'results') && uploadedImage && (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-800">
                  <img src={uploadedImage} alt="Soil sample" className="w-full h-64 object-cover" />
                  
                  {/* Radar Line Scan Animation Effect */}
                  {uploadState === 'analyzing' && (
                    <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] animate-radar-scan border-b-2 border-emerald-400" />
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-3 right-3 bg-black/60 text-white hover:bg-black/80 rounded-xl"
                    onClick={handleReset}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {uploadState === 'uploaded' && (
                  <Button
                    onClick={handleAnalyze}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold rounded-xl h-12 text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition-transform"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Run AI Soil Analysis
                  </Button>
                )}

                {uploadState === 'analyzing' && (
                  <div className="text-center py-4 space-y-2">
                    <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Scanning Soil RGB Channels & Mineral Texture...
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="glass-card-premium border-0 p-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              Soil Diagnostic Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploadState !== 'results' ? (
              <div className="text-center py-16 space-y-3">
                <FileImage className="w-16 h-16 text-slate-300 dark:text-neutral-700 mx-auto" />
                <h3 className="font-bold text-slate-700 dark:text-neutral-300">Ready for Analysis</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Upload an image or pick a demo sample to view the AI confidence rating & soil chemistry profile.
                </p>
              </div>
            ) : (
              <Tabs defaultValue="type" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-neutral-900 rounded-xl">
                  <TabsTrigger value="type" className="rounded-lg font-bold text-xs">Soil Type Match</TabsTrigger>
                  <TabsTrigger value="chemistry" className="rounded-lg font-bold text-xs">Nutrient Chemistry</TabsTrigger>
                </TabsList>

                <TabsContent value="type" className="space-y-3">
                  {predictedSoilTypes.map((soil, idx) => (
                    <div 
                      key={soil.type} 
                      className={`p-4 rounded-2xl border transition-all ${
                        idx === 0 
                          ? 'border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20' 
                          : 'border-slate-200 dark:border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${soil.color}`} />
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm">{soil.type}</h4>
                          {idx === 0 && <Badge className="bg-emerald-500 text-white text-[9px]">Top Match</Badge>}
                        </div>
                        <Badge variant="outline" className="font-bold text-xs text-emerald-600 border-emerald-500/30">
                          {soil.confidence}%
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2">{soil.description}</p>
                      
                      <div className="mt-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Ideal Crops:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {soil.suitableCrops.map((c: string) => (
                            <Badge key={c} className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="chemistry" className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200/50 dark:border-neutral-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">pH Balance</p>
                      <p className="text-base font-extrabold text-slate-800 dark:text-white">{detailedAnalysis.pH}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200/50 dark:border-neutral-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Nitrogen (N)</p>
                      <p className="text-base font-extrabold text-slate-800 dark:text-white">{detailedAnalysis.nitrogen}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200/50 dark:border-neutral-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Phosphorus (P)</p>
                      <p className="text-base font-extrabold text-slate-800 dark:text-white">{detailedAnalysis.phosphorus}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200/50 dark:border-neutral-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Potassium (K)</p>
                      <p className="text-base font-extrabold text-slate-800 dark:text-white">{detailedAnalysis.potassium}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white uppercase tracking-wider">Agronomist Recommendations</h4>
                    {detailedAnalysis.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Footer */}
      {uploadState === 'results' && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            onClick={() => onNavigate('crop-recommendation', { soilType: predictedSoilTypes[0].type })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-11 font-bold text-sm"
          >
            Get Optimal Crop Recommendations
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onNavigate('growth-calendar')}
            className="rounded-xl border border-slate-200 dark:border-neutral-800 h-11 text-sm font-semibold"
          >
            Add Sowing Schedule to Calendar
          </Button>
        </div>
      )}
    </div>
  );
}