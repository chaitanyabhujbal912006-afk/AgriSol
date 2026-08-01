import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Filter,
  Share,
  Mail,
  Printer,
  Eye,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface ReportsProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole?: 'farmer' | 'admin';
}

const cropDistributionData = [
  { name: 'Basmati Rice', acres: 20, color: '#10b981' },
  { name: 'Durum Wheat', acres: 15, color: '#3b82f6' },
  { name: 'Sweet Corn Maize', acres: 10, color: '#f59e0b' },
  { name: 'Hybrid Tomato', acres: 5, color: '#ef4444' },
];

const reportTemplates = [
  {
    id: 'crop-analysis',
    title: 'Crop Yield & Suitability Summary',
    description: 'Comprehensive analysis of recommended crops, yields, and harvest schedules.',
    category: 'Analytics',
    format: ['PDF', 'Excel'],
    lastGenerated: '2026-08-01'
  },
  {
    id: 'soil-health',
    title: 'Soil Chemistry Diagnostic Log',
    description: 'Detailed NPK nutrient levels, pH ratings, and compost application guidance.',
    category: 'Soil',
    format: ['PDF'],
    lastGenerated: '2026-07-28'
  },
  {
    id: 'financial-summary',
    title: 'Farm Revenue & Financial Return Report',
    description: 'Calculated gross income, fertilizer input costs, and net projected margins.',
    category: 'Finance',
    format: ['PDF', 'CSV'],
    lastGenerated: '2026-07-25'
  }
];

export function Reports({ onNavigate }: ReportsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.print();
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 font-bold text-xs rounded-full">
            📊 AgriSol Telemetry Reports
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Farm Analytics & Exportable Summaries
          </h1>
          <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1">
            Generate printable PDF reports, export soil diagnostics, and view crop land allocation.
          </p>
        </div>

        <Button 
          onClick={handleExportPDF}
          disabled={isExporting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl px-5 h-11 text-xs shadow-lg shadow-emerald-500/20"
        >
          <Printer className="w-4 h-4 mr-2" />
          {isExporting ? 'Preparing Report...' : 'Print / Export PDF Summary'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Crop Land Allocation Pie Chart */}
        <Card className="glass-card-premium border-0 p-2">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-500" />
              Farmland Crop Allocation (Acres)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cropDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="acres"
                  >
                    {cropDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend fontSize={11} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-base text-slate-800 dark:text-white">Available Telemetry Reports</h3>
          <div className="grid grid-cols-1 gap-3">
            {reportTemplates.map(report => (
              <Card key={report.id} className="glass-card-premium border-0 p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">{report.category}</Badge>
                    <span className="text-[10px] text-slate-400">Last run: {report.lastGenerated}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white mt-1">{report.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">{report.description}</p>
                </div>
                <Button 
                  onClick={handleExportPDF}
                  variant="outline" 
                  className="rounded-xl text-xs font-bold h-9 border-slate-200 dark:border-neutral-800"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Export
                </Button>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}