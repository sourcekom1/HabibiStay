import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Heart, 
  Filter,
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
  pricePerNight: string;
  rating: string;
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

  const toggleFavorite = (e: React.MouseEvent, propertyId: number) => {
    e.stopPropagation();
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

  const handlePropertyView = (property: Property) => {
    trackPropertyView(property.id, user?.id);
    setSelectedProperty(property);
  };

  const handleShare = async (e: React.MouseEvent, property: Property) => {
    e.stopPropagation();
    if (navigator.share) {
      await navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.origin + `/property/${property.id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/property/${property.id}`);
      toast({
        title: "Link copied",
        description: "Property link has been copied to clipboard.",
      });
    }
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-blue via-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => setLocation('/')}
                className="mb-4 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
              <div className="flex items-center space-x-4 text-white/90">
                <MapPin className="h-4 w-4" />
                <span>{filters.location}</span>
                <span>•</span>
                <Calendar className="h-4 w-4" />
                <span>{filters.checkIn} - {filters.checkOut}</span>
                <span>•</span>
                <Users className="h-4 w-4" />
                <span>{filters.guests} guests</span>
              </div>
            </div>
            <Button
              onClick={() => setShowAdvancedFilters(true)}
              variant="outline"
              className="glass-button rounded-2xl border-white/30 text-white hover:bg-white/20"
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
            {properties.length} stays in {filters.location}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {filters.checkIn} - {filters.checkOut} • {filters.guests} guests
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property, index) => (
            <Card
              key={property.id}
              className={`group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handlePropertyView(property)}
            >
              <div className="relative">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-3 right-3 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 hover:bg-white"
                    onClick={(e) => handleShare(e, property)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className={`bg-white/90 hover:bg-white ${
                      favoriteIds.has(property.id) ? 'text-red-600' : 'text-gray-600'
                    }`}
                    onClick={(e) => toggleFavorite(e, property.id)}
                    disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
                  >
                    <Heart className={`h-4 w-4 ${favoriteIds.has(property.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                <Badge className="absolute bottom-3 left-3 bg-white text-gray-900">
                  {formatSAR(parseFloat(property.pricePerNight))}/night
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {property.title}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {parseFloat(property.rating).toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({property.reviewCount})
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{property.maxGuests} guests</span>
                    </div>
                    <div className="flex items-center">
                      <span>{property.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center">
                      <span>{property.bathrooms} baths</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {property.amenities.slice(0, 3).map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {property.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{property.amenities.length - 3} more
                    </Badge>
                  )}
                </div>

                <Button className="w-full" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or explore different locations.
            </p>
            <Button onClick={() => setShowAdvancedFilters(true)}>
              <Filter className="h-4 w-4 mr-2" />
              Adjust Filters
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filters Modal */}
      <EnhancedSearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
      />

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