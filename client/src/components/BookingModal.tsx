import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Info, Calendar, Users, CreditCard, MapPin, Star, User, CheckCircle, AlertCircle, Clock, Shield, Wifi, Car, Coffee } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { formatSAR } from "@shared/currency";
import PayPalButton from "./PayPalButton";

interface BookingModalProps {
  property: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ property, isOpen, onClose }: BookingModalProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 2,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    specialRequests: "",
    paymentMethod: "paypal"
  });
  const [pricing, setPricing] = useState({
    basePrice: 0,
    serviceFee: 0,
    cleaningFee: 50,
    taxes: 0,
    total: 0,
    nights: 0
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        window.location.href = '/api/login';
        return;
      }

      const response = await apiRequest("POST", "/api/bookings", {
        propertyId: property.id,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: data.guests,
        totalAmount: pricing.total,
        guestInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          paymentMethod: data.paymentMethod
        }
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "You will receive a confirmation email shortly.",
      });
      onClose();
      // Reset form
      setBookingData({
        checkIn: "",
        checkOut: "",
        guests: 2,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialRequests: "",
        paymentMethod: "paypal"
      });
      setStep(1);
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const calculatePricing = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !property) {
      return { basePrice: 0, serviceFee: 0, cleaningFee: 50, taxes: 0, total: 0, nights: 0 };
    }
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    const basePrice = nights * parseFloat(property.pricePerNight || 0);
    const serviceFee = Math.round(basePrice * 0.14);
    const cleaningFee = 50;
    const taxes = Math.round((basePrice + serviceFee + cleaningFee) * 0.12);
    const total = basePrice + serviceFee + cleaningFee + taxes;
    
    return { basePrice, serviceFee, cleaningFee, taxes, total, nights };
  };

  useEffect(() => {
    const newPricing = calculatePricing();
    setPricing(newPricing);
  }, [bookingData.checkIn, bookingData.checkOut, property?.pricePerNight]);

  const handleInputChange = (field: string, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.firstName || !bookingData.lastName || !bookingData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    bookingMutation.mutate(bookingData);
  };

  if (!property) return null;

  const total = pricing.total;
  const nights = pricing.nights;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto glass-card border-brand-blue/20">
        <DialogHeader className={`${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <DialogTitle className="text-3xl font-bold gradient-text text-center mb-2">
            Complete Your Booking
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Secure your perfect getaway with just a few clicks
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Property Summary */}
          <Card className={`glass-card border-brand-blue/30 ${isVisible ? 'animate-slide-left' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <img
                  src={property.images?.[0] || "https://images.unsplash.com/photo-1571896349842-33c89424de2d"}
                  alt={property.title}
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 glass-button px-3 py-1 rounded-full">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {parseFloat(property.rating || "0").toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{property.title}</h4>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-6">
                <MapPin className="h-4 w-4 mr-2 text-brand-blue" />
                <span className="font-medium">{property.location}</span>
              </div>
              
              <div className="space-y-4">
                <div className="glass-button p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-brand-blue" />
                      <span className="font-medium">Check-in:</span>
                    </div>
                    <span className="text-brand-blue font-semibold">{bookingData.checkIn || "Select date"}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-brand-blue" />
                      <span className="font-medium">Check-out:</span>
                    </div>
                    <span className="text-brand-blue font-semibold">{bookingData.checkOut || "Select date"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-brand-blue" />
                      <span className="font-medium">Guests:</span>
                    </div>
                    <span className="text-brand-blue font-semibold">{bookingData.guests} guest{bookingData.guests > 1 ? 's' : ''}</span>
                  </div>
                  {nights > 0 && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-medium">Nights:</span>
                      <span className="text-brand-blue font-semibold">{nights}</span>
                    </div>
                  )}
                </div>
                
                <div className="glass-button p-4 rounded-2xl border-2 border-brand-blue/30">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Total:</span>
                    <span className="text-2xl font-bold gradient-text">{formatSAR(total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Booking Form */}
          <div className={`space-y-6 ${isVisible ? 'animate-slide-right' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            {/* Dates and Guests */}
            <div className="glass-button p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 mr-2 text-brand-blue" />
                <h5 className="text-lg font-bold text-gray-900 dark:text-gray-100">Booking Details</h5>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="checkin" className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 block">Check-in</Label>
                  <Input
                    id="checkin"
                    type="date"
                    value={bookingData.checkIn}
                    onChange={(e) => handleInputChange("checkIn", e.target.value)}
                    className="glass-button border-brand-blue/30 rounded-xl focus:border-brand-blue transition-all duration-300"
                  />
                </div>
                <div>
                  <Label htmlFor="checkout" className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 block">Check-out</Label>
                  <Input
                    id="checkout"
                    type="date"
                    value={bookingData.checkOut}
                    onChange={(e) => handleInputChange("checkOut", e.target.value)}
                    className="glass-button border-brand-blue/30 rounded-xl focus:border-brand-blue transition-all duration-300"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="guests" className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 block flex items-center">
                  <Users className="h-4 w-4 mr-2 text-brand-blue" />
                  Number of Guests
                </Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={property.maxGuests || 10}
                  value={bookingData.guests}
                  onChange={(e) => handleInputChange("guests", parseInt(e.target.value))}
                  className="glass-button border-brand-blue/30 rounded-xl focus:border-brand-blue transition-all duration-300"
                />
              </div>
            </div>

            {/* Guest Information */}
            <div className="glass-button p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 mr-2 text-brand-blue" />
                <h5 className="text-lg font-bold text-gray-900 dark:text-gray-100">Guest Information</h5>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 block">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={bookingData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="glass-button border-brand-blue/30 rounded-xl focus:border-brand-blue transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 block">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={bookingData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="glass-button border-brand-blue/30 rounded-xl focus:border-brand-blue transition-all duration-300"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 block">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="glass-button border-brand-blue/30 rounded-xl focus:border-brand-blue transition-all duration-300"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 block">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="glass-button border-brand-blue/30 rounded-xl focus:border-brand-blue transition-all duration-300"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-button p-6 rounded-2xl">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 mr-2 text-brand-blue" />
                <h5 className="text-lg font-bold text-gray-900 dark:text-gray-100">Payment Method</h5>
              </div>
              <RadioGroup
                value={bookingData.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
                className="space-y-3"
              >
                <div className="glass-button p-4 rounded-xl flex items-center space-x-3 cursor-pointer hover:border-brand-blue/50 transition-all duration-300">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="font-medium cursor-pointer">Credit/Debit Card</Label>
                </div>
                <div className="glass-button p-4 rounded-xl flex items-center space-x-3 cursor-pointer hover:border-brand-blue/50 transition-all duration-300">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="font-medium cursor-pointer">PayPal</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Payment Info */}
            <div className="glass-button p-6 rounded-2xl border-2 border-blue-200/50 bg-blue-50/50 dark:bg-blue-900/20">
              <p className="text-blue-800 dark:text-blue-200 flex items-center font-medium">
                <Info className="h-5 w-5 mr-3 text-brand-blue" />
                Payment processing is handled securely through PayPal. Your booking will be confirmed instantly.
              </p>
            </div>

            {/* PayPal Payment */}
            {bookingData.paymentMethod === 'paypal' && total > 0 && (
              <div className="glass-button p-6 rounded-2xl">
                <h5 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Complete Payment</h5>
                <PayPalButton 
                  amount={total.toString()}
                  currency="USD"
                  intent="CAPTURE"
                />
              </div>
            )}

            {/* Complete Booking Button for Card */}
            {bookingData.paymentMethod === 'card' && (
              <Button
                onClick={handleSubmit}
                disabled={bookingMutation.isPending || total === 0}
                className="w-full glass-button bg-brand-blue text-white py-4 px-6 rounded-2xl hover:bg-brand-blue-dark transition-all duration-300 font-semibold text-lg border-2 border-brand-blue hover:scale-105 pulse-glow"
              >
                <Lock className="h-5 w-5 mr-3" />
                {bookingMutation.isPending ? "Processing..." : `Complete Secure Booking - ${formatSAR(total)}`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
