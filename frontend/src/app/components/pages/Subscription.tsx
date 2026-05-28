import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  Star, 
  Shield,
  Zap,
  Users,
  Crown,
  ArrowRight,
  Calendar,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface SubscriptionProps {
  onNavigate: (page: string, data?: any) => void;
  navigationData?: any;
  userRole: 'farmer' | 'admin';
}

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for small-scale farming and getting started',
    icon: <Star className="w-6 h-6" />,
    color: 'border-gray-200',
    features: [
      'Basic crop recommendations',
      'Weather forecasts',
      'Community support',
      'Mobile app access',
      'Up to 5 soil tests per month'
    ],
    limitations: [
      'Limited AI insights',
      'Basic reporting',
      'No priority support'
    ],
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999,
    period: 'month',
    description: 'Advanced features for serious farmers and agricultural professionals',
    icon: <Zap className="w-6 h-6" />,
    color: 'border-primary-green',
    features: [
      'Advanced AI crop recommendations',
      'Unlimited soil analysis',
      'Disease detection & treatment',
      'Growth calendar & planning',
      'Premium weather insights',
      'Export reports (PDF/Excel)',
      'Priority customer support',
      'Video tutorial library',
      'Market price alerts'
    ],
    limitations: [],
    popular: true
  },
  {
    id: 'team',
    name: 'Team',
    price: 2499,
    period: 'month',
    description: 'Collaborative tools for farming cooperatives and agricultural businesses',
    icon: <Users className="w-6 h-6" />,
    color: 'border-blue-500',
    features: [
      'Everything in Pro',
      'Multi-user accounts (up to 10)',
      'Team collaboration tools',
      'Bulk operations',
      'Advanced analytics dashboard',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'Custom training sessions'
    ],
    limitations: [],
    popular: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    period: 'custom',
    description: 'Custom solutions for large agricultural organizations',
    icon: <Crown className="w-6 h-6" />,
    color: 'border-purple-500',
    features: [
      'Everything in Team',
      'Unlimited users',
      'Custom AI model training',
      'White-label solutions',
      'On-premise deployment',
      'Advanced security features',
      'Custom reporting',
      '24/7 premium support',
      'SLA guarantees'
    ],
    limitations: [],
    popular: false
  }
];

const currentPlan = {
  name: 'Free',
  renewalDate: '2024-12-15',
  usage: {
    soilTests: { used: 3, limit: 5 },
    reports: { used: 2, limit: 5 },
    storage: { used: 1.2, limit: 5 }
  }
};

export function Subscription({ onNavigate }: SubscriptionProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPayment, setShowPayment] = useState(false);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    if (planId === 'enterprise') {
      // Handle enterprise contact form
      console.log('Contact sales for enterprise plan');
    } else {
      setShowPayment(true);
    }
  };

  const getDiscountedPrice = (price: number) => {
    return billingCycle === 'yearly' ? Math.round(price * 12 * 0.8) : price;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Choose Your Plan
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock the full potential of AI-powered farming with our subscription plans. 
          Start free and upgrade as your farm grows.
        </p>
      </div>

      {/* Current Plan Status */}
      <Card className="glass-card border-0 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            Current Plan: {currentPlan.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Soil Tests</p>
              <p className="text-lg font-semibold">
                {currentPlan.usage.soilTests.used}/{currentPlan.usage.soilTests.limit}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Reports</p>
              <p className="text-lg font-semibold">
                {currentPlan.usage.reports.used}/{currentPlan.usage.reports.limit}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Storage (GB)</p>
              <p className="text-lg font-semibold">
                {currentPlan.usage.storage.used}/{currentPlan.usage.storage.limit}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Renews on {new Date(currentPlan.renewalDate).toLocaleDateString()}
            </p>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Manage Billing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm ${billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            billingCycle === 'yearly' ? 'bg-primary-green' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm ${billingCycle === 'yearly' ? 'font-medium' : 'text-muted-foreground'}`}>
          Yearly
        </span>
        {billingCycle === 'yearly' && (
          <Badge className="bg-green-100 text-green-800">Save 20%</Badge>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative border-2 ${plan.color} ${plan.popular ? 'scale-105' : ''} transition-transform hover:scale-105`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary-green text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                plan.id === 'free' ? 'bg-gray-100 text-gray-600' :
                plan.id === 'pro' ? 'bg-green-100 text-green-600' :
                plan.id === 'team' ? 'bg-blue-100 text-blue-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {plan.icon}
              </div>
              
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-2">
                {plan.price === null ? (
                  <div className="text-2xl font-bold">Custom</div>
                ) : plan.price === 0 ? (
                  <div className="text-2xl font-bold">Free</div>
                ) : (
                  <div>
                    <span className="text-2xl font-bold">₹{getDiscountedPrice(plan.price)}</span>
                    <span className="text-muted-foreground">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                    {billingCycle === 'yearly' && plan.price > 0 && (
                      <div className="text-sm text-green-600">
                        Save ₹{Math.round(plan.price * 12 * 0.2)} per year
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full ${
                  plan.popular 
                    ? 'clay-button bg-primary-green hover:bg-primary-green/90 text-white'
                    : 'clay-button'
                }`}
                disabled={plan.id === 'free' && currentPlan.name === 'Free'}
              >
                {plan.id === 'free' && currentPlan.name === 'Free' ? (
                  'Current Plan'
                ) : plan.id === 'enterprise' ? (
                  'Contact Sales'
                ) : plan.id === 'free' ? (
                  'Downgrade'
                ) : (
                  <>
                    Choose {plan.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Razorpay Integration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Payment gateway integration coming soon. This is a placeholder for the Razorpay payment flow.
              </p>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Credit/Debit Card
                </Button>
                <Button className="w-full" variant="outline">
                  UPI Payment
                </Button>
                <Button className="w-full" variant="outline">
                  Net Banking
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowPayment(false)}>
                Cancel
              </Button>
              <Button className="flex-1 clay-button bg-primary-green hover:bg-primary-green/90 text-white">
                Proceed to Pay
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}