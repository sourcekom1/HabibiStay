import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Calendar, Users } from "lucide-react";

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const [searchData, setSearchData] = useState({
    where: "",
    checkIn: "",
    checkOut: "",
    guests: "1"
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchData.where) {
      // If no location specified, default to Riyadh
      setSearchData(prev => ({ ...prev, where: "Riyadh" }));
    }
    
    const searchParams = new URLSearchParams({
      location: searchData.where || "Riyadh",
      checkIn: searchData.checkIn || "",
      checkOut: searchData.checkOut || "",
      guests: searchData.guests || "1"
    });
    
    setLocation(`/search?${searchParams.toString()}`);
  };

  const isFormValid = true; // Allow search with any input

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="bg-orb w-64 h-64 top-10 left-10 opacity-30" style={{ animationDelay: '0s' }}></div>
      <div className="bg-orb w-48 h-48 top-32 right-20 opacity-20" style={{ animationDelay: '5s' }}></div>
      <div className="bg-orb w-72 h-72 bottom-20 left-1/3 opacity-15" style={{ animationDelay: '10s' }}></div>
      {/* Hero Section with Full Background */}
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-800/40 to-blue-700/50"></div>
        
        {/* Content positioned absolutely over background */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className={`text-center text-white max-w-6xl mx-auto px-4 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                أهلاً وسهلاً<br />
                Welcome Home
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-12 opacity-95 font-light max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
              Experience authentic Saudi hospitality. Stay in handpicked homes across the Kingdom, from Riyadh's skyline to Jeddah's Red Sea coast, AlUla's ancient wonders to NEOM's futuristic vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16">
              <Button 
                className="w-full sm:w-auto glass-button px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transform hover:scale-105 transition-all duration-300 shadow-2xl blue-glow"
                onClick={() => setLocation('/search?location=Riyadh')}
              >
                Book a Stay
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto glass-button px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold border-2 border-white/40 text-white hover:bg-white/20 backdrop-blur-md transform hover:scale-105 transition-all duration-300"
                onClick={() => setLocation('/host')}
              >
                List Property
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto glass-button px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold border-2 border-white/40 text-white hover:bg-white/20 backdrop-blur-md transform hover:scale-105 transition-all duration-300"
                onClick={() => setLocation('/invest')}
              >
                Invest Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Enhanced Glass Search Bar */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl animate-slide-up blue-glow" style={{ animationDelay: '0.3s' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-stretch lg:items-end">
            {/* Where */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 focus-within:bg-white/15 focus-within:border-blue-300/50">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-blue-300 mr-2" />
                <Label htmlFor="search-where" className="text-sm font-semibold text-white/90">Where</Label>
              </div>
              <Input
                id="search-where"
                type="text"
                placeholder="Riyadh, Jeddah, AlUla..."
                value={searchData.where}
                onChange={(e) => handleInputChange("where", e.target.value)}
                className="w-full text-base border-0 bg-transparent p-0 focus:ring-0 shadow-none placeholder:text-white/60 text-white font-medium"
                required
                aria-label="Enter destination"
              />
            </div>

            {/* Check in */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 focus-within:bg-white/15 focus-within:border-blue-300/50">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-blue-300 mr-2" />
                <Label htmlFor="search-checkin" className="text-sm font-semibold text-white/90">Check in</Label>
              </div>
              <Input
                id="search-checkin"
                type="date"
                value={searchData.checkIn}
                onChange={(e) => handleInputChange("checkIn", e.target.value)}
                className="w-full text-base border-0 bg-transparent p-0 focus:ring-0 shadow-none text-white font-medium"
                required
                aria-label="Select check-in date"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Check out */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 focus-within:bg-white/15 focus-within:border-blue-300/50">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-blue-300 mr-2" />
                <Label htmlFor="search-checkout" className="text-sm font-semibold text-white/90">Check out</Label>
              </div>
              <Input
                id="search-checkout"
                type="date"
                value={searchData.checkOut}
                onChange={(e) => handleInputChange("checkOut", e.target.value)}
                className="w-full text-base border-0 bg-transparent p-0 focus:ring-0 shadow-none text-white font-medium"
                required
                aria-label="Select check-out date"
                min={searchData.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Guests */}
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 focus-within:bg-white/15 focus-within:border-blue-300/50">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-blue-300 mr-2" />
                <Label htmlFor="search-guests" className="text-sm font-semibold text-white/90">Guests</Label>
              </div>
              <Input
                id="search-guests"
                type="number"
                placeholder="2 guests"
                min="1"
                max="20"
                value={searchData.guests}
                onChange={(e) => handleInputChange("guests", e.target.value)}
                className="w-full text-base border-0 bg-transparent p-0 focus:ring-0 shadow-none placeholder:text-white/60 text-white font-medium"
                aria-label="Number of guests"
              />
            </div>

            {/* Search Button */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex items-center justify-center">
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-white font-semibold backdrop-blur-sm border border-blue-400/30"
                aria-label="Search properties"
              >
                <Search className="h-6 w-6 mr-2" />
                <span className="hidden sm:inline">Search</span>
                <span className="sm:hidden">Find</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
