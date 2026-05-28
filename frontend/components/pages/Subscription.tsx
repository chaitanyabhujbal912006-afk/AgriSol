import React, { useState } from 'react';
import { 
  Crown, 
  Check, 
  X,
  CreditCard,
  Smartphone,
  Shield,
  Zap,
  Users,
  BarChart3,
  Calendar,
  Star,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface SubscriptionProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole: 'farmer' | 'admin';
}

const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for getting started with basic farming insights',
    features: [
      'Basic crop recommendations',
      'Weather information',
      'Up to 5 soil tests/month',
      'Community access',
      'Basic tutorials'
    ],
    limitations: [
      'Limited AI recommendations',
      'No advanced analytics',
      'No export features',
      'Standard support'
    ],
    popular: false,
    current: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 499, yearly: 4990 },
    description: 'Advanced features for serious farmers and agricultural professionals',
    features: [
      'Unlimited AI crop recommendations',
      'Advanced soil analysis',
      'Disease detection & treatment',
      'Growth calendar & planning',
      'Export reports (PDF/Excel)',
      'Priority customer support',
      'Advanced analytics dashboard',
      'Fertilizer optimization',
      'Pest management insights'
    ],
    limitations: [],
    popular: true,
    current: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 1999, yearly: 19990 },
    description: 'Complete solution for large farms and agricultural enterprises',
    features: [
      'Everything in Pro',
      'Multi-farm management',
      'Team collaboration tools',
      'Custom integrations',
      'Dedicated account manager',
      'On-site training',
      'API access',
      'White-label options',
      'Custom reporting',
      'Advanced security features'
    ],
    limitations: [],
    popular: false,
    current: false
  }
];

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" />, description: 'Visa, Mastercard, RuPay' },
  { id: 'upi', name: 'UPI', icon: <Smartphone className="w-5 h-5" />, description: 'GPay, PhonePe, Paytm' },
  { id: 'netbanking', name: 'Net Banking', icon: <div className="w-5 h-5 bg-blue-500 rounded" />, description: 'All major banks' },
  { id: 'wallet', name: 'Digital Wallet', icon: <div className="w-5 h-5 bg-green-500 rounded" />, description: 'Paytm, Mobikwik' }
];

const currentUsage = {
  soilTests: { used: 3, limit: 5 },
  recommendations: { used: 12, limit: 20 },
  exports: { used: 0, limit: 0 },
  storage: { used: 2.1, limit: 5 }
};

export function Subscription({ onNavigate, navigationData, userRole }: SubscriptionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    if (planId !== 'free') {
      setShowPaymentModal(true);
    }
  };

  const handlePayment = () => {
    // In real app, would integrate with Razorpay
    console.log('Processing payment for plan:', selectedPlan);
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Subscription & Billing
          </h1>
          <p className="text-muted-foreground mt-1">
            Choose the perfect plan for your farming needs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Current Usage Sidebar */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Current Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Soil Tests</span>
                  <span className="text-xs text-muted-foreground">
                    {currentUsage.soilTests.used}/{currentUsage.soilTests.limit}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(currentUsage.soilTests.used, currentUsage.soilTests.limit)} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">AI Recommendations</span>
                  <span className="text-xs text-muted-foreground">
                    {currentUsage.recommendations.used}/{currentUsage.recommendations.limit}
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(currentUsage.recommendations.used, currentUsage.recommendations.limit)} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Report Exports</span>
                  <span className="text-xs text-muted-foreground">
                    {currentUsage.exports.used}/{currentUsage.exports.limit || 'Unlimited'}
                  </span>
                </div>
                <Progress 
                  value={currentUsage.exports.limit === 0 ? 0 : getUsagePercentage(currentUsage.exports.used, currentUsage.exports.limit)} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Storage Used</span>
                  <span className="text-xs text-muted-foreground">
                    {currentUsage.storage.used}GB/{currentUsage.storage.limit}GB
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(currentUsage.storage.used, currentUsage.storage.limit)} 
                  className="h-2"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Current Plan</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Free Plan</Badge>
              <p className="text-xs text-muted-foreground mt-2">
                Upgrade to unlock unlimited features and advanced AI insights
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="plans" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
              <TabsTrigger value="billing">Billing History</TabsTrigger>
            </TabsList>

            <TabsContent value="plans" className="space-y-6">
              {/* Billing Toggle */}
              <Card className="glass-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-4">
                    <span className={`font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                      Monthly
                    </span>
                    <Switch
                      checked={billingCycle === 'yearly'}
                      onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                    />
                    <span className={`font-medium ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                      Yearly
                    </span>
                    {billingCycle === 'yearly' && (
                      <Badge className="bg-green-100 text-green-800">
                        Save 17%
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`relative overflow-hidden transition-all duration-200 ${
                      plan.popular ? 'ring-2 ring-primary-green scale-105' : ''
                    } ${plan.current ? 'bg-blue-50 border-blue-200' : 'glass-card border-0'}`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-primary-green text-white text-center py-2">
                        <span className="text-sm font-medium">Most Popular</span>
                      </div>
                    )}
                    
                    {plan.current && (
                      <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-2">
                        <span className="text-sm font-medium">Current Plan</span>
                      </div>
                    )}
                    
                    <CardHeader className={plan.popular || plan.current ? 'pt-12' : ''}>
                      <div className="text-center">
                        <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                        <div className="mb-4">
                          <span className="text-3xl font-bold">
                            ₹{plan.price[billingCycle].toLocaleString()}
                          </span>
                          {plan.price[billingCycle] > 0 && (
                            <span className="text-muted-foreground">
                              /{billingCycle === 'monthly' ? 'month' : 'year'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* Features */}
                        <div>
                          <h4 className="font-medium text-sm mb-3">Included:</h4>
                          <div className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Limitations */}
                        {plan.limitations.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-3">Limitations:</h4>
                            <div className="space-y-2">
                              {plan.limitations.map((limitation, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">{limitation}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <Button
                          className={`w-full ${
                            plan.current 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : plan.popular 
                                ? 'clay-button bg-primary-green hover:bg-primary-green/90' 
                                : ''
                          } text-white`}
                          variant={plan.current || plan.popular ? 'default' : 'outline'}
                          onClick={() => handlePlanSelect(plan.id)}
                          disabled={plan.current}
                        >
                          {plan.current ? (
                            'Current Plan'
                          ) : plan.id === 'free' ? (
                            'Downgrade to Free'
                          ) : (
                            <>
                              Upgrade to {plan.name}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              {/* Billing History */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No Billing History</h3>
                    <p className="text-sm text-muted-foreground">
                      You're currently on the free plan. Upgrade to see your billing history here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Secure Payment
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {selectedPlan && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {subscriptionPlans.find(p => p.id === selectedPlan)?.name} Plan
                  </span>
                  <span className="font-bold">
                    ₹{subscriptionPlans.find(p => p.id === selectedPlan)?.price[billingCycle].toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Billed {billingCycle}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-medium">Select Payment Method</label>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPaymentMethod === method.id 
                      ? 'border-primary-green bg-primary-green/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <div className="text-muted-foreground">
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{method.name}</p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                  {selectedPaymentMethod === method.id && (
                    <Check className="w-4 h-4 text-primary-green" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-primary-green hover:bg-primary-green/90 text-white"
                onClick={handlePayment}
                disabled={!selectedPaymentMethod}
              >
                <Shield className="w-4 h-4 mr-2" />
                Pay Securely
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Powered by Razorpay • Secure SSL Encryption
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}