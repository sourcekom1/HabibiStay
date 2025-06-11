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
import { Lock, Info, Calendar, Users, CreditCard, MapPin, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { formatSAR } from "@shared/currency";

interface BookingModalProps {
  property: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ property, isOpen, onClose }: BookingModalProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 2,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "card"
  });

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
        totalAmount: calculateTotal(),
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
        paymentMethod: "card"
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const calculateTotal = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !property) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return nights * parseFloat(property.pricePerNight || 0);
  };

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

  const total = calculateTotal();
  const nights = bookingData.checkIn && bookingData.checkOut 
    ? Math.ceil((new Date(bookingData.checkOut).getTime() - new Date(bookingData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

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

          {/* Booking Form */}
          <div className="space-y-4">
            {/* Dates and Guests */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Booking Details</h5>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <Label htmlFor="checkin">Check-in</Label>
                  <Input
                    id="checkin"
                    type="date"
                    value={bookingData.checkIn}
                    onChange={(e) => handleInputChange("checkIn", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="checkout">Check-out</Label>
                  <Input
                    id="checkout"
                    type="date"
                    value={bookingData.checkOut}
                    onChange={(e) => handleInputChange("checkOut", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={property.maxGuests || 10}
                  value={bookingData.guests}
                  onChange={(e) => handleInputChange("guests", parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Guest Information */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Guest Information</h5>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={bookingData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={bookingData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Payment Method</h5>
              <RadioGroup
                value={bookingData.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Payment Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Payment processing is handled securely through MyFatoorah. Your booking will be confirmed instantly.
              </p>
            </div>

            {/* Complete Booking Button */}
            <Button
              onClick={handleSubmit}
              disabled={bookingMutation.isPending || total === 0}
              className="w-full bg-brand-blue text-white py-3 px-4 rounded-md hover:bg-brand-blue-dark transition-colors font-medium"
            >
              <Lock className="h-4 w-4 mr-2" />
              {bookingMutation.isPending ? "Processing..." : `Complete Secure Booking - $${total.toLocaleString()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
