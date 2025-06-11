import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import BookingModal from "./BookingModal";
import { useState } from "react";
import { formatSAR } from "@shared/currency";

export default function FeaturedProperties() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: featuredProperties, isLoading } = useQuery({
    queryKey: ["/api/properties", { featured: true, limit: 2 }],
  });

  const { data: moreProperties } = useQuery({
    queryKey: ["/api/properties", { limit: 4 }],
  });

  const handleBookProperty = (property: any) => {
    setSelectedProperty(property);
    setIsBookingModalOpen(true);
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-64 rounded-2xl mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
          <p className="text-lg text-gray-600">Handpicked accommodations for your perfect getaway</p>
        </div>

        {/* Featured Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {featuredProperties?.length === 0 ? (
            <div className="col-span-2 text-center py-16">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0h2m5 0v-1.5a2.5 2.5 0 00-2.5-2.5H7.5a2.5 2.5 0 00-2.5 2.5V21" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No featured properties available</h3>
              <p className="text-gray-600">Featured properties will appear here once they are added by hosts.</p>
            </div>
          ) : (
            featuredProperties?.map((property: any) => (
              <Card key={property.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
                <img
                  src={property.images?.[0] || "https://images.unsplash.com/photo-1571896349842-33c89424de2d"}
                  alt={property.title}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {parseFloat(property.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{property.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-brand-blue">{formatSAR(parseFloat(property.pricePerNight))}</span>
                      <span className="text-gray-500"> / night</span>
                    </div>
                    <Button 
                      onClick={() => handleBookProperty(property)}
                      className="bg-brand-blue text-white px-6 py-2 rounded-full hover:bg-brand-blue-dark transition-colors font-medium"
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
          {moreProperties?.length === 0 ? (
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
            moreProperties?.slice(0, 4).map((property: any) => (
              <Card key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"}
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
                        {parseFloat(property.rating || 0).toFixed(1)}
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
