import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Filter, 
  X, 
  Wifi, 
  Car, 
  Coffee, 
  Waves, 
  Mountain,
  Home,
  Building,
  Castle,
  Calendar,
  DollarSign,
  Star
} from "lucide-react";

interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  minPrice: number;
  maxPrice: number;
  propertyType: string;
  amenities: string[];
}

interface EnhancedSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onApplyFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const amenityOptions = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
  { id: 'pool', label: 'Pool', icon: Waves },
  { id: 'mountain-view', label: 'Mountain View', icon: Mountain },
  { id: 'beach-access', label: 'Beach Access', icon: Waves },
  { id: 'gym', label: 'Gym', icon: Building },
  { id: 'spa', label: 'Spa', icon: Castle },
];

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'studio', label: 'Studio' },
  { value: 'resort', label: 'Resort' },
];

export default function EnhancedSearchFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  isOpen,
  onClose
}: EnhancedSearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenityId: string) => {
    const newAmenities = localFilters.amenities.includes(amenityId)
      ? localFilters.amenities.filter(a => a !== amenityId)
      : [...localFilters.amenities, amenityId];
    updateFilter('amenities', newAmenities);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApplyFilters();
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      minPrice: 0,
      maxPrice: 2000,
      propertyType: '',
      amenities: [],
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto glass-card animate-in zoom-in-95 duration-300">
        <CardHeader className="sticky top-0 glass-nav border-b border-white/20 flex flex-row items-center justify-between space-y-0 p-4 sm:p-6">
          <CardTitle className="flex items-center space-x-2 text-gray-800 dark:text-white">
            <Filter className="h-5 w-5 text-blue-600" />
            <span className="text-lg sm:text-xl font-semibold">Advanced Filters</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/20 rounded-full p-2">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 p-4 sm:p-6">
          {/* Basic Search */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              Basic Search
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</Label>
                <Input
                  id="location"
                  placeholder="City, neighborhood, or landmark"
                  value={localFilters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  className="glass-input h-11 rounded-xl border-2 border-white/20 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:bg-white/80 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-sm font-medium text-gray-700 dark:text-gray-300">Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="20"
                  value={localFilters.guests}
                  onChange={(e) => updateFilter('guests', parseInt(e.target.value) || 1)}
                  className="glass-input h-11 rounded-xl border-2 border-white/20 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:bg-white/80 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Travel Dates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn" className="text-sm font-medium text-gray-700 dark:text-gray-300">Check-in Date</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={localFilters.checkIn}
                  onChange={(e) => updateFilter('checkIn', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="glass-input h-11 rounded-xl border-2 border-white/20 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:bg-white/80 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOut" className="text-sm font-medium text-gray-700 dark:text-gray-300">Check-out Date</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={localFilters.checkOut}
                  onChange={(e) => updateFilter('checkOut', e.target.value)}
                  min={localFilters.checkIn || new Date().toISOString().split('T')[0]}
                  className="glass-input h-11 rounded-xl border-2 border-white/20 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:bg-white/80 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Price Range (SAR per night)
            </h3>
            <div className="glass-card p-4 rounded-xl border border-white/20 bg-white/60 backdrop-blur-sm">
              <Slider
                min={0}
                max={2000}
                step={50}
                value={[localFilters.minPrice, localFilters.maxPrice]}
                onValueChange={([min, max]) => {
                  updateFilter('minPrice', min);
                  updateFilter('maxPrice', max);
                }}
                className="w-full"
              />
              <div className="flex justify-between mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">SAR {localFilters.minPrice}</span>
                <span className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">SAR {localFilters.maxPrice}</span>
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Property Type
            </h3>
            <Select
              value={localFilters.propertyType}
              onValueChange={(value) => updateFilter('propertyType', value)}
            >
              <SelectTrigger className="glass-input h-11 rounded-xl border-2 border-white/20 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:bg-white/80 transition-all duration-200">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent className="glass-card backdrop-blur-md border border-white/20">
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="hover:bg-white/20">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {amenityOptions.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = localFilters.amenities.includes(amenity.id);
                
                return (
                  <div
                    key={amenity.id}
                    className={`flex items-center space-x-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md'
                        : 'border-white/20 bg-white/60 backdrop-blur-sm hover:border-blue-200 hover:bg-white/80'
                    }`}
                    onClick={() => toggleAmenity(amenity.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleAmenity(amenity.id)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <span className="text-sm font-medium flex-1">{amenity.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Filters Summary */}
          {(localFilters.amenities.length > 0 || localFilters.propertyType) && (
            <div>
              <Label>Selected Filters</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {localFilters.propertyType && (
                  <Badge variant="secondary">
                    {propertyTypes.find(t => t.value === localFilters.propertyType)?.label}
                  </Badge>
                )}
                {localFilters.amenities.map((amenityId) => {
                  const amenity = amenityOptions.find(a => a.id === amenityId);
                  return amenity ? (
                    <Badge key={amenityId} variant="secondary">
                      {amenity.label}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="flex-1 h-12 rounded-xl glass-button border-2 border-white/20 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 hover:scale-105 font-medium"
            >
              <X className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
            <Button 
              onClick={handleApply} 
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}