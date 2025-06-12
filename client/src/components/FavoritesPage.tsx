import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MapPin, 
  Star, 
  Users, 
  Bed, 
  Bath,
  ArrowLeft,
  Share2,
  Eye
} from "lucide-react";
import Layout from "./Layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatSAR } from "@shared/currency";
import BookingModal from "./BookingModal";

interface Property {
  id: number;
  title: string;
  location: string;
  pricePerNight: string;
  rating: string;
  reviewCount: number;
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
}

export default function FavoritesPage() {
  const { user } = useAuth();
  const { trackPageView, trackPropertyView, trackFavoriteAction } = useAnalytics();
  const { toast } = useToast();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    trackPageView('favorites', user?.id);
  }, []);

  const { data: favorites = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/favorites'],
    enabled: !!user,
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

  const handlePropertyView = (property: Property) => {
    trackPropertyView(property.id, user?.id);
    setSelectedProperty(property);
  };

  const handleRemoveFromFavorites = (e: React.MouseEvent, propertyId: number) => {
    e.stopPropagation();
    removeFromFavoritesMutation.mutate(propertyId);
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

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-blue"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
                <p className="text-gray-600">
                  {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
                </p>
              </div>
            </div>
          </div>

          {favorites.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start exploring properties and save your favorites for easy access.
                </p>
                <Button onClick={() => window.location.href = '/'}>
                  Explore Properties
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((property, index) => (
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
                        className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                        onClick={(e) => handleRemoveFromFavorites(e, property.id)}
                        disabled={removeFromFavoritesMutation.isPending}
                      >
                        <Heart className="h-4 w-4 fill-current" />
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
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms} beds</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
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
          )}
        </div>
      </div>

      {selectedProperty && (
        <BookingModal
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </Layout>
  );
}