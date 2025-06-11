import { useState } from "react";
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
import { Lock, Info } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface BookingModalProps {
  property: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ property, isOpen, onClose }: BookingModalProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Complete Your Booking
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Summary */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <img
                src={property.images?.[0] || "https://images.unsplash.com/photo-1571896349842-33c89424de2d"}
                alt={property.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h4 className="font-semibold text-gray-900 mb-2">{property.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{property.location}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>{bookingData.checkIn || "Select date"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span>{bookingData.checkOut || "Select date"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{bookingData.guests} guest{bookingData.guests > 1 ? 's' : ''}</span>
                </div>
                {nights > 0 && (
                  <div className="flex justify-between">
                    <span>Nights:</span>
                    <span>{nights}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${total.toLocaleString()}</span>
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
