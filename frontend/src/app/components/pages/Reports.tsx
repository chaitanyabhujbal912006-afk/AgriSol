import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Filter,
  Share,
  Mail,
  Printer,
  Eye,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { ImageWithFallback } from '../shared/ImageWithFallback';

interface ReportsProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole: 'farmer' | 'admin';
}

const reportTemplates = [
  {
    id: 'crop-analysis',
    title: 'Crop Analysis Report',
    description: 'Comprehensive analysis of crop recommendations and performance',
    icon: <TrendingUp className="w-6 h-6" />,
    category: 'Analytics',
    format: ['PDF', 'Excel'],
    estimatedTime: '2-3 minutes',
    lastGenerated: '2024-03-10',
    features: ['Crop suitability scores', 'Weather impact analysis', 'Yield predictions', 'ROI calculations']
  },
  {
    id: 'soil-health',
    title: 'Soil Health Summary',
    description: 'Detailed soil analysis results and improvement recommendations',
    icon: <div className="w-6 h-6 bg-amber-500 rounded" />,
    category: 'Soil',
    format: ['PDF'],
    estimatedTime: '1-2 minutes',
    lastGenerated: '2024-03-08',
    features: ['pH levels', 'Nutrient analysis', 'Soil type classification', 'Fertilizer recommendations']
  },
  {
    id: 'farm-activity',
    title: 'Farm Activity Log',
    description: 'Complete log of farming activities and scheduled tasks',
    icon: <Calendar className="w-6 h-6" />,
    category: 'Management',
    format: ['PDF', 'Excel', 'CSV'],
    estimatedTime: '1 minute',
    lastGenerated: '2024-03-12',
    features: ['Activity timeline', 'Task completion rates', 'Resource utilization', 'Labor tracking']
  },
  {
    id: 'disease-incidents',
    title: 'Disease & Pest Report',
    description: 'Analysis of disease incidents and treatment effectiveness',
    icon: <div className="w-6 h-6 bg-red-500 rounded-full" />,
    category: 'Health',
    format: ['PDF'],
    estimatedTime: '2 minutes',
    lastGenerated: '2024-03-05',
    features: ['Disease identification', 'Treatment history', 'Prevention strategies', 'Cost analysis']
  },
  {
    id: 'financial-summary',
    title: 'Financial Performance',
    description: 'Revenue, costs, and profitability analysis by crop and season',
    icon: <BarChart3 className="w-6 h-6" />,
    category: 'Finance',
    format: ['PDF', 'Excel'],
    estimatedTime: '3-4 minutes',
    lastGenerated: '2024-03-01',
    features: ['Revenue analysis', 'Cost breakdown', 'Profit margins', 'ROI by crop']
  },
  {
    id: 'water-usage',
    title: 'Water Management Report',
    description: 'Irrigation efficiency and water consumption analysis',
    icon: <div className="w-6 h-6 bg-blue-500 rounded-full" />,
    category: 'Resources',
    format: ['PDF', 'Excel'],
    estimatedTime: '2 minutes',
    lastGenerated: '2024-03-07',
    features: ['Water consumption', 'Irrigation schedules', 'Efficiency metrics', 'Cost savings']
  }
];

const recentReports = [
  {
    id: 1,
    title: 'Q1 2024 Crop Analysis',
    type: 'crop-analysis',
    generatedDate: '2024-03-12',
    format: 'PDF',
    size: '2.4 MB',
    status: 'completed'
  },
  {
    id: 2,
    title: 'March Activity Log',
    type: 'farm-activity',
    generatedDate: '2024-03-10',
    format: 'Excel',
    size: '1.8 MB',
    status: 'completed'
  },
  {
    id: 3,
    title: 'Soil Health Assessment',
    type: 'soil-health',
    generatedDate: '2024-03-08',
    format: 'PDF',
    size: '3.1 MB',
    status: 'completed'
  },
  {
    id: 4,
    title: 'February Financial Summary',
    type: 'financial-summary',
    generatedDate: '2024-03-01',
    format: 'PDF',
    size: '2.7 MB',
    status: 'completed'
  }
];

export function Reports({ onNavigate, navigationData, userRole }: ReportsProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const categories = ['All', 'Analytics', 'Soil', 'Management', 'Health', 'Finance', 'Resources'];
  const formats = ['All', 'PDF', 'Excel', 'CSV'];

  const filteredReports = reportTemplates.filter(report => {
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    const matchesFormat = selectedFormat === 'All' || report.format.includes(selectedFormat);
    return matchesCategory && matchesFormat;
  });

  const handleGenerateReport = async (reportId: string) => {
    setGeneratingReport(reportId);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setGeneratingReport(null);
    
    // In real app, would trigger actual report generation and download
    console.log(`Generated report: ${reportId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate comprehensive reports and export your farming data
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share Report
          </Button>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Email Reports
          </Button>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* Filters */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map(format => (
                        <SelectItem key={format} value={format}>{format}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedFormat('All');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="glass-card border-0 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary-green/10 text-primary-green">
                        {report.icon}
                      </div>
                      <Badge variant="outline">{report.category}</Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Features */}
                    <div>
                      <p className="text-sm font-medium mb-2">Includes:</p>
                      <div className="space-y-1">
                        {report.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-primary-green rounded-full" />
                            <span className="text-xs text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                        {report.features.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{report.features.length - 3} more features
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground">Generation Time</p>
                        <p className="font-medium">{report.estimatedTime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Generated</p>
                        <p className="font-medium">{new Date(report.lastGenerated).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Format Options */}
                    <div>
                      <p className="text-sm font-medium mb-2">Available Formats:</p>
                      <div className="flex gap-2">
                        {report.format.map((fmt) => (
                          <Badge key={fmt} variant="outline" className="text-xs">
                            {fmt}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 clay-button bg-primary-green hover:bg-primary-green/90 text-white"
                        onClick={() => handleGenerateReport(report.id)}
                        disabled={generatingReport === report.id}
                      >
                        {generatingReport === report.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Generate
                          </>
                        )}
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Report History */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{report.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Generated {new Date(report.generatedDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{report.format} • {report.size}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}