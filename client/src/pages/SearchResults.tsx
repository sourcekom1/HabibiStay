import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Heart, 
  Filter,
  Wifi,
  Car,
  Coffee,
  Waves,
  Mountain,
  ArrowLeft,
  SlidersHorizontal,
  Share2,
  Eye
} from "lucide-react";
import BookingModal from "@/components/BookingModal";
import EnhancedSearchFilters from "@/components/EnhancedSearchFilters";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatSAR } from "@shared/currency";

interface Property {
  id: number;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  hostId: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
}

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { trackSearchPerformed, trackPropertyView, trackFavoriteAction } = useAnalytics();
  const { toast } = useToast();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: (() => {
      const guestParam = searchParams.get('guests');
      if (!guestParam || guestParam === 'NaN' || guestParam === '') return 1;
      const parsed = parseInt(guestParam);
      return !isNaN(parsed) && parsed > 0 ? parsed : 1;
    })(),
    minPrice: 0,
    maxPrice: 2000,
    propertyType: "",
    amenities: [] as string[],
  });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const location = searchParams.get('location') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = (() => {
    const guestParam = searchParams.get('guests');
    if (!guestParam || guestParam === 'NaN' || guestParam === '') return 1;
    const parsed = parseInt(guestParam);
    return !isNaN(parsed) && parsed > 0 ? parsed : 1;
  })();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fetch search results
  const { data: properties = [], isLoading, refetch } = useQuery<Property[]>({
    queryKey: ['/api/search', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.location) params.set('location', filters.location);
      if (filters.checkIn) params.set('checkIn', filters.checkIn);
      if (filters.checkOut) params.set('checkOut', filters.checkOut);
      if (filters.guests) params.set('guests', filters.guests.toString());
      if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
      if (filters.propertyType) params.set('propertyType', filters.propertyType);
      if (filters.amenities.length > 0) params.set('amenities', filters.amenities.join(','));

      const response = await fetch(`/api/search?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      const results = await response.json();
      
      // Track search analytics
      trackSearchPerformed(filters, results.length, user?.id);
      
      return results;
    }
  });

  // Fetch user favorites
  const { data: userFavorites = [] } = useQuery<Property[]>({
    queryKey: ['/api/favorites'],
    enabled: !!user,
  });

  const favoriteIds = new Set(userFavorites.map(p => p.id));

  // Favorites mutations
  const addToFavoritesMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      const response = await apiRequest("POST", "/api/favorites", { propertyId });
      return response.json();
    },
    onSuccess: (_, propertyId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      trackFavoriteAction(propertyId, 'add', user?.id);
      toast({
        title: "Added to favorites",
        description: "Property has been saved to your favorites.",
      });
    },
  });

  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      const response = await apiRequest("DELETE", `/api/favorites/${propertyId}`);
      return response.json();
    },
    onSuccess: (_, propertyId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      trackFavoriteAction(propertyId, 'remove', user?.id);
      toast({
        title: "Removed from favorites",
        description: "Property has been removed from your favorites.",
      });
    },
  });

  const toggleFavorite = (propertyId: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites.",
        variant: "destructive",
      });
      return;
    }

    if (favoriteIds.has(propertyId)) {
      removeFromFavoritesMutation.mutate(propertyId);
    } else {
      addToFavoritesMutation.mutate(propertyId);
    }
  };

  const amenityIcons: { [key: string]: any } = {
    'wifi': Wifi,
    'parking': Car,
    'breakfast': Coffee,
    'pool': Waves,
    'mountain-view': Mountain
  };

  const filteredProperties = properties.filter(property => {
    const matchesPrice = parseFloat(property.pricePerNight) >= filters.minPrice && 
                        parseFloat(property.pricePerNight) <= filters.maxPrice;
    const matchesGuests = property.maxGuests >= filters.guests;
    
    return matchesPrice && matchesGuests;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-3xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
          <p className="text-center mt-4 text-gray-600 dark:text-gray-300">Searching properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="bg-orb w-64 h-64 top-10 right-10 opacity-20" style={{ animationDelay: '2s' }}></div>
      <div className="bg-orb w-48 h-48 bottom-20 left-20 opacity-15" style={{ animationDelay: '7s' }}></div>

      {/* Search Header */}
      <div className={`glass-nav sticky top-0 z-50 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setLocation('/')}
                className="glass-button rounded-2xl px-4 py-2 hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
                <span>•</span>
                <Calendar className="h-4 w-4" />
                <span>{checkIn} - {checkOut}</span>
                <span>•</span>
                <Users className="h-4 w-4" />
                <span>{guests} guests</span>
              </div>
            </div>
            <Button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              variant="outline"
              className="glass-button rounded-2xl"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <div className={`mb-8 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {filteredProperties.length} stays in {location}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {checkIn} - {checkOut} • {guests} guests
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className={`w-80 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <Card className="glass-card sticky top-28">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold gradient-text mb-6">Filters</h3>
                  
                  {/* Price Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Price per night
                    </label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                      max={1000}
                      min={0}
                      step={50}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Minimum Rating
                    </label>
                    <div className="flex space-x-2">
                      {[0, 3, 4, 4.5].map((rating) => (
                        <Button
                          key={rating}
                          variant={filters.rating === rating ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilters(prev => ({ ...prev, rating }))}
                          className="glass-button rounded-xl"
                        >
                          {rating === 0 ? 'Any' : `${rating}+`}
                          {rating > 0 && <Star className="h-3 w-3 ml-1" />}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ priceRange: [0, 1000], propertyType: "", amenities: [], rating: 0 })}
                    className="w-full glass-button rounded-2xl"
                  >
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Properties Grid */}
          <div className="flex-1">
            {filteredProperties.length === 0 ? (
              <div className={`text-center py-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
                <div className="glass-card p-12 mx-auto max-w-md">
                  <Search className="h-16 w-16 text-brand-blue mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No properties found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button onClick={() => setLocation('/')} className="glass-button rounded-2xl">
                    Start new search
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProperties.map((property, index) => (
                  <Card
                    key={property.id}
                    className={`glass-card group cursor-pointer transition-all duration-500 hover:scale-[1.02] ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${0.1 * index}s` }}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <CardContent className="p-0">
                      {/* Property Image */}
                      <div className="relative overflow-hidden rounded-t-3xl">
                        <img
                          src={property.images[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=600'}
                          alt={property.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(property.id);
                          }}
                          variant="ghost"
                          size="sm"
                          className="absolute top-3 right-3 glass-button rounded-full w-10 h-10 p-0"
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              favorites.includes(property.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-white'
                            }`}
                          />
                        </Button>
                      </div>

                      {/* Property Details */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                            {property.title}
                          </h3>
                          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{property.rating}</span>
                            <span className="text-sm text-gray-500">({property.reviewCount})</span>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.location}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                          <span>{property.maxGuests} guests</span>
                          <span>•</span>
                          <span>{property.bedrooms} bedrooms</span>
                          <span>•</span>
                          <span>{property.bathrooms} bathrooms</span>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {property.amenities.slice(0, 3).map((amenity) => {
                            const IconComponent = amenityIcons[amenity] || Coffee;
                            return (
                              <Badge key={amenity} variant="secondary" className="glass-button text-xs">
                                <IconComponent className="h-3 w-3 mr-1" />
                                {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                              </Badge>
                            );
                          })}
                          {property.amenities.length > 3 && (
                            <Badge variant="secondary" className="glass-button text-xs">
                              +{property.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-2xl font-bold gradient-text">
                              ${property.pricePerNight}
                            </span>
                            <span className="text-gray-600 dark:text-gray-300 text-sm"> / night</span>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProperty(property);
                            }}
                            className="glass-button rounded-2xl hover:scale-105 transition-all duration-300"
                          >
                            Book now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedProperty && (
        <BookingModal
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}