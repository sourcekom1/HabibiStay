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
  Castle
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Advanced Filters</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City or area"
                value={localFilters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="guests">Guests</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max="20"
                value={localFilters.guests}
                onChange={(e) => updateFilter('guests', parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn">Check-in Date</Label>
              <Input
                id="checkIn"
                type="date"
                value={localFilters.checkIn}
                onChange={(e) => updateFilter('checkIn', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="checkOut">Check-out Date</Label>
              <Input
                id="checkOut"
                type="date"
                value={localFilters.checkOut}
                onChange={(e) => updateFilter('checkOut', e.target.value)}
                min={localFilters.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label>Price Range (SAR per night)</Label>
            <div className="px-3 py-4">
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
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>SAR {localFilters.minPrice}</span>
                <span>SAR {localFilters.maxPrice}</span>
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <Label>Property Type</Label>
            <Select
              value={localFilters.propertyType}
              onValueChange={(value) => updateFilter('propertyType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amenities */}
          <div>
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              {amenityOptions.map((amenity) => {
                const Icon = amenity.icon;
                const isSelected = localFilters.amenities.includes(amenity.id);
                
                return (
                  <div
                    key={amenity.id}
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleAmenity(amenity.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleAmenity(amenity.id)}
                    />
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{amenity.label}</span>
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
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Reset Filters
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}