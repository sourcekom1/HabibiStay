import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  DollarSign, 
  Shield, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import Layout from "@/components/Layout";
import { apiRequest } from "@/lib/queryClient";

export default function BecomeHost() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    propertyType: '',
    address: '',
    description: '',
    phone: '',
    experience: ''
  });

  const hostApplicationMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/host/apply', { method: 'POST', body: data }),
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you within 24 hours.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/api/login';
      return;
    }
    hostApplicationMutation.mutate(formData);
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Earn Extra Income",
      description: "Hosts earn an average of ﷼2,500 per month"
    },
    {
      icon: Shield,
      title: "Host Protection",
      description: "Comprehensive insurance coverage included"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Join 4M+ hosts worldwide"
    },
    {
      icon: Star,
      title: "24/7 Support",
      description: "Dedicated host support team"
    }
  ];

  const steps = [
    "Complete host application",
    "Property verification",
    "Welcome to hosting!",
    "Start earning"
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Home className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Become a HabibiStay Host</h1>
            <p className="text-xl opacity-90 mb-8">
              Turn your space into income. Join thousands of hosts earning money by sharing their homes.
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">﷼2,500</div>
                <div className="opacity-80">Average monthly earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4M+</div>
                <div className="opacity-80">Active hosts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="opacity-80">Support available</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Why host with us?</h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-brand-blue/10 p-3 rounded-full">
                      <benefit.icon className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Process Steps */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-6">How it works</h3>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Badge variant="outline" className="rounded-full w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Start Your Host Journey</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!user ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Please log in to apply as a host</p>
                      <Button 
                        onClick={() => window.location.href = '/api/login'}
                        className="w-full bg-brand-blue hover:bg-brand-blue/90"
                      >
                        Log In to Continue
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="propertyType">Property Type</Label>
                        <Input
                          id="propertyType"
                          placeholder="Apartment, Villa, Studio..."
                          value={formData.propertyType}
                          onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          Property Address
                        </Label>
                        <Input
                          id="address"
                          placeholder="City, District, Saudi Arabia"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">
                          <Phone className="h-4 w-4 inline mr-1" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          placeholder="+966 5X XXX XXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Property Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Tell us about your space..."
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="experience">Hosting Experience</Label>
                        <Textarea
                          id="experience"
                          placeholder="Any previous hosting experience? (Optional)"
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-brand-blue hover:bg-brand-blue/90"
                        disabled={hostApplicationMutation.isPending}
                      >
                        {hostApplicationMutation.isPending ? (
                          "Submitting..."
                        ) : (
                          <>
                            Submit Application
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions about hosting?</h2>
            <p className="text-gray-600 mb-6">Our team is here to help you get started</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>host-support@habibistay.com</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+966 11 XXX XXXX</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}