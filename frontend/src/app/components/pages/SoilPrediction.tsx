import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  FileImage,
  MapPin,
  Calendar,
  BarChart3,
  ArrowRight,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../shared/ImageWithFallback';

interface SoilPredictionProps {
  onNavigate: (page: string, data?: any) => void;
}

const soilTypes = [
  {
    type: 'Alluvial Soil',
    confidence: 85,
    description: 'Rich in nutrients, ideal for crop cultivation',
    characteristics: ['High fertility', 'Good water retention', 'Rich in potash'],
    color: 'bg-green-500',
    suitableCrops: ['Rice', 'Wheat', 'Sugarcane', 'Cotton']
  },
  {
    type: 'Red Soil',
    confidence: 72,
    description: 'Iron-rich soil, good drainage properties',
    characteristics: ['Iron oxide content', 'Good drainage', 'Moderate fertility'],
    color: 'bg-red-500',
    suitableCrops: ['Groundnut', 'Cotton', 'Wheat', 'Pulses']
  },
  {
    type: 'Black Soil',
    confidence: 45,
    description: 'Clay-rich, retains moisture well',
    characteristics: ['High clay content', 'Moisture retention', 'Rich in calcium'],
    color: 'bg-gray-800',
    suitableCrops: ['Cotton', 'Wheat', 'Jowar', 'Linseed']
  },
  {
    type: 'Laterite Soil',
    confidence: 28,
    description: 'Iron and aluminum rich, acidic nature',
    characteristics: ['High acidity', 'Iron-aluminum rich', 'Low fertility'],
    color: 'bg-orange-600',
    suitableCrops: ['Cashew', 'Tea', 'Coffee', 'Rubber']
  }
];

const mockAnalysis = {
  pH: 6.8,
  nitrogen: 'Medium',
  phosphorus: 'High',
  potassium: 'Medium',
  organicMatter: 'High',
  salinity: 'Low',
  recommendations: [
    'Soil pH is optimal for most crops',
    'Consider adding potassium-rich fertilizers',
    'Organic matter content is excellent',
    'Monitor salinity levels regularly'
  ]
};

export function SoilPrediction({ onNavigate }: SoilPredictionProps) {
  const [uploadState, setUploadState] = useState<'empty' | 'uploading' | 'uploaded' | 'analyzing' | 'results'>('empty');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
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
        return prev + 10;
      });
    }, 200);
  };

  const handleAnalyze = () => {
    setUploadState('analyzing');
    setTimeout(() => {
      setUploadState('results');
    }, 3000);
  };

  const handleReset = () => {
    setUploadState('empty');
    setUploadedImage(null);
    setUploadProgress(0);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Soil Type Prediction
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload a soil image to get AI-powered soil type analysis and recommendations
          </p>
        </div>
        
        <Alert className="lg:max-w-md border-blue-200 bg-blue-50">
          <Info className="w-4 h-4" />
          <AlertDescription className="text-blue-800">
            <strong>Note:</strong> Model integration coming soon. Currently showing demo results.
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Soil Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploadState === 'empty' && (
              <div
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
                  ${dragActive ? 'border-primary-green bg-primary-green/5' : 'border-border hover:border-primary-green/50'}
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
                
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-primary-green" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Drag & Drop Soil Image
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse from your device
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, WEBP (Max 10MB)
                  </p>
                </div>
              </div>
            )}

            {uploadState === 'uploading' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Uploading Image...</h3>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">{uploadProgress}% Complete</p>
                </div>
              </div>
            )}

            {(uploadState === 'uploaded' || uploadState === 'analyzing' || uploadState === 'results') && uploadedImage && (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded soil sample"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    onClick={handleReset}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Image uploaded successfully</span>
                </div>

                {uploadState === 'uploaded' && (
                  <Button
                    onClick={handleAnalyze}
                    className="w-full clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyze Soil Type
                  </Button>
                )}

                {uploadState === 'analyzing' && (
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-medium">Analyzing soil sample...</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      AI is processing your image. This may take a few moments.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploadState !== 'results' ? (
              <div className="text-center py-12">
                <FileImage className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No Analysis Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Upload and analyze a soil image to see results here
                </p>
              </div>
            ) : (
              <Tabs defaultValue="soil-type" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="soil-type">Soil Type</TabsTrigger>
                  <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="soil-type" className="space-y-4">
                  <div className="space-y-3">
                    {soilTypes.map((soil, index) => (
                      <div
                        key={soil.type}
                        className={`p-4 rounded-lg border transition-colors ${
                          index === 0 ? 'border-primary-green bg-primary-green/5' : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${soil.color}`} />
                            <h4 className="font-semibold text-foreground">{soil.type}</h4>
                            {index === 0 && (
                              <Badge className="bg-primary-green text-white">Best Match</Badge>
                            )}
                          </div>
                          <Badge className={`${getConfidenceColor(soil.confidence)}`}>
                            {soil.confidence}%
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{soil.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {soil.characteristics.map((char) => (
                              <Badge key={char} variant="outline" className="text-xs">
                                {char}
                              </Badge>
                            ))}
                          </div>
                          
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Suitable Crops:</p>
                            <div className="flex flex-wrap gap-1">
                              {soil.suitableCrops.map((crop) => (
                                <Badge key={crop} className="text-xs bg-green-100 text-green-800">
                                  {crop}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">pH Level</p>
                      <p className="text-lg font-semibold text-foreground">{mockAnalysis.pH}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Nitrogen</p>
                      <p className="text-lg font-semibold text-foreground">{mockAnalysis.nitrogen}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Phosphorus</p>
                      <p className="text-lg font-semibold text-foreground">{mockAnalysis.phosphorus}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">Potassium</p>
                      <p className="text-lg font-semibold text-foreground">{mockAnalysis.potassium}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Recommendations</h4>
                    {mockAnalysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {uploadState === 'results' && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => onNavigate('crop-recommendation', { soilType: soilTypes[0].type })}
            className="clay-button bg-primary-green hover:bg-primary-green/90 text-white"
          >
            Get Crop Recommendations
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onNavigate('reports')}
          >
            Export Soil Report
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onNavigate('growth-calendar')}
          >
            Add to Calendar
          </Button>
        </div>
      )}
    </div>
  );
}