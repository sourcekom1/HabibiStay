import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export default function HeroSection() {
  const [searchData, setSearchData] = useState({
    where: "",
    checkIn: "",
    checkOut: "",
    guests: ""
  });

  const handleSearch = () => {
    // In a real implementation, this would navigate to search results
    console.log("Performing search with:", searchData);
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="relative">
      {/* Hero Image */}
      <div 
        className="h-96 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=800')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Find your perfect stay</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover amazing places to stay around the world
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-full shadow-2xl p-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="flex-1 px-4 py-3">
              <Label className="block text-xs font-medium text-gray-700 mb-1">Where</Label>
              <Input
                type="text"
                placeholder="Search destinations"
                value={searchData.where}
                onChange={(e) => handleInputChange("where", e.target.value)}
                className="w-full text-sm border-0 p-0 focus:ring-0 shadow-none"
              />
            </div>
            <div className="flex-1 px-4 py-3 border-l border-gray-200">
              <Label className="block text-xs font-medium text-gray-700 mb-1">Check in</Label>
              <Input
                type="date"
                value={searchData.checkIn}
                onChange={(e) => handleInputChange("checkIn", e.target.value)}
                className="w-full text-sm border-0 p-0 focus:ring-0 shadow-none"
              />
            </div>
            <div className="flex-1 px-4 py-3 border-l border-gray-200">
              <Label className="block text-xs font-medium text-gray-700 mb-1">Check out</Label>
              <Input
                type="date"
                value={searchData.checkOut}
                onChange={(e) => handleInputChange("checkOut", e.target.value)}
                className="w-full text-sm border-0 p-0 focus:ring-0 shadow-none"
              />
            </div>
            <div className="flex items-center px-4 py-3 border-l border-gray-200">
              <div className="flex-1">
                <Label className="block text-xs font-medium text-gray-700 mb-1">Who</Label>
                <Input
                  type="number"
                  placeholder="Add guests"
                  min="1"
                  value={searchData.guests}
                  onChange={(e) => handleInputChange("guests", e.target.value)}
                  className="w-full text-sm border-0 p-0 focus:ring-0 shadow-none"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-brand-blue text-white p-3 rounded-full hover:bg-brand-blue-dark transition-colors ml-2"
                size="sm"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
