import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Heart } from "lucide-react";
import BookingModal from "./BookingModal";
import { useState, useEffect } from "react";
import { formatSAR } from "@shared/currency";
import type { Property } from "@shared/schema";

export default function FeaturedProperties() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [likedProperties, setLikedProperties] = useState<Set<number>>(new Set());

  const { data: featuredProperties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", { featured: true, limit: 2 }],
  });

  const { data: moreProperties } = useQuery<Property[]>({
    queryKey: ["/api/properties", { limit: 4 }],
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBookProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsBookingModalOpen(true);
  };

  const toggleLike = (propertyId: number) => {
    setLikedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-12">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-300 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card animate-pulse">
              <div className="bg-gray-300 h-64 rounded-2xl mb-4"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-300 rounded w-24"></div>
                  <div className="h-10 bg-gray-300 rounded-full w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-12 relative">
        {/* Background Orbs */}
        <div className="bg-orb w-48 h-48 top-0 right-0 opacity-10" style={{ animationDelay: '2s' }}></div>
        <div className="bg-orb w-32 h-32 bottom-0 left-10 opacity-15" style={{ animationDelay: '7s' }}></div>

        <div className={`text-center mb-12 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Featured Properties</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Handpicked accommodations for your perfect getaway
          </p>
        </div>

        {/* Featured Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {!featuredProperties || featuredProperties.length === 0 ? (
            <div className="col-span-2 text-center py-16">
              <div className="glass-card p-12 mx-auto max-w-md">
                <div className="text-brand-blue mb-6">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0h2m5 0v-1.5a2.5 2.5 0 00-2.5-2.5H7.5a2.5 2.5 0 00-2.5 2.5V21" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">No featured properties available</h3>
                <p className="text-gray-600 dark:text-gray-400">Featured properties will appear here once they are added by hosts.</p>
              </div>
            </div>
          ) : (
            featuredProperties.map((property, index) => (
              <Card 
                key={property.id} 
                className={`glass-card rounded-3xl overflow-hidden group cursor-pointer float-animation ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={(property.images as string[])?.[0] || "https://images.unsplash.com/photo-1571896349842-33c89424de2d"}
                    alt={property.title}
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button
                    onClick={() => toggleLike(property.id)}
                    className="absolute top-4 right-4 p-2 rounded-full glass-button transition-all duration-300 hover:scale-110"
                  >
                    <Heart 
                      className={`h-5 w-5 transition-colors duration-300 ${
                        likedProperties.has(property.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-white hover:text-red-400'
                      }`} 
                    />
                  </button>
                </div>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-blue transition-colors duration-300">
                      {property.title}
                    </h3>
                    <div className="flex items-center space-x-1 glass-button px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {parseFloat(property.rating || "0").toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                    <MapPin className="h-4 w-4 mr-2 text-brand-blue" />
                    <span className="font-medium">{property.location}</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-base mb-6 line-clamp-2">{property.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-3xl font-bold gradient-text">{formatSAR(parseFloat(property.pricePerNight))}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-lg"> / night</span>
                    </div>
                    <Button 
                      onClick={() => handleBookProperty(property)}
                      className="glass-button px-8 py-3 rounded-2xl font-semibold text-brand-blue hover:text-white border-2 border-brand-blue hover:bg-brand-blue transition-all duration-300 transform hover:scale-105"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* More Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {!moreProperties || moreProperties.length === 0 ? (
            <div className="col-span-4 text-center py-8">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0h2m5 0v-1.5a2.5 2.5 0 00-2.5-2.5H7.5a2.5 2.5 0 00-2.5 2.5V21" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties available</h3>
              <p className="text-gray-600">Properties will appear here once they are added by hosts.</p>
            </div>
          ) : (
            moreProperties.slice(0, 4).map((property) => (
              <Card key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={(property.images as string[])?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1 truncate">{property.title}</h4>
                  <p className="text-gray-600 text-sm mb-2 truncate">{property.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">${property.pricePerNight}/night</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-700">
                        {parseFloat(property.rating || "0").toFixed(1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      <BookingModal
        property={selectedProperty}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
}
