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
          <div className={`text-center text-white max-w-6xl mx-auto ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                أهلاً وسهلاً<br />
                Welcome Home
              </span>
            </h1>
            <p className="text-xl md:text-3xl mb-12 opacity-95 font-light max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
              Experience authentic Saudi hospitality. Stay in handpicked homes across the Kingdom, from Riyadh's skyline to Jeddah's Red Sea coast, AlUla's ancient wonders to NEOM's futuristic vision.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
              <Button 
                className="glass-button px-10 py-5 text-xl font-semibold bg-brand-blue text-white hover:bg-brand-blue-dark transform hover:scale-105 transition-all duration-300 shadow-2xl"
                onClick={() => setLocation('/search?location=Riyadh')}
              >
                Book a Stay
              </Button>
              <Button 
                variant="outline" 
                className="glass-button px-10 py-5 text-xl font-semibold border-2 border-white/40 text-white hover:bg-white/20 backdrop-blur-md transform hover:scale-105 transition-all duration-300"
                onClick={() => setLocation('/host')}
              >
                List Property
              </Button>
              <Button 
                variant="outline" 
                className="glass-button px-10 py-5 text-xl font-semibold border-2 border-white/40 text-white hover:bg-white/20 backdrop-blur-md transform hover:scale-105 transition-all duration-300"
                onClick={() => setLocation('/invest')}
              >
                Invest Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Glass Search Bar */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-6xl mx-auto px-4">
        <form onSubmit={handleSearch} className={`glass-search rounded-3xl p-4 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
            {/* Where */}
            <div className="group flex-1 px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-white/20">
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 text-brand-blue mr-2" />
                <Label htmlFor="search-where" className="text-sm font-semibold text-gray-700 dark:text-gray-200">Where</Label>
              </div>
              <Input
                id="search-where"
                type="text"
                placeholder="Search destinations"
                value={searchData.where}
                onChange={(e) => handleInputChange("where", e.target.value)}
                className="w-full text-base border-0 bg-transparent p-0 focus:ring-0 shadow-none placeholder:text-gray-500 font-medium"
                required
                aria-label="Enter destination"
              />
            </div>

            {/* Check in */}
            <div className="group flex-1 px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-white/20 border-l border-gray-200/30">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 text-brand-blue mr-2" />
                <Label htmlFor="search-checkin" className="text-sm font-semibold text-gray-700 dark:text-gray-200">Check in</Label>
              </div>
              <Input
                id="search-checkin"
                type="date"
                value={searchData.checkIn}
                onChange={(e) => handleInputChange("checkIn", e.target.value)}
                className="w-full text-base border-0 bg-transparent p-0 focus:ring-0 shadow-none font-medium"
                required
                aria-label="Select check-in date"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Check out */}
            <div className="group flex-1 px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-white/20 border-l border-gray-200/30">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 text-brand-blue mr-2" />
                <Label htmlFor="search-checkout" className="text-sm font-semibold text-gray-700 dark:text-gray-200">Check out</Label>
              </div>
              <Input
                id="search-checkout"
                type="date"
                value={searchData.checkOut}
                onChange={(e) => handleInputChange("checkOut", e.target.value)}
                className="w-full text-base border-0 bg-transparent p-0 focus:ring-0 shadow-none font-medium"
                required
                aria-label="Select check-out date"
                min={searchData.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Guests */}
            <div className="group flex-1 px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-white/20 border-l border-gray-200/30">
              <div className="flex items-center mb-2">
                <Users className="h-4 w-4 text-brand-blue mr-2" />
                <Label htmlFor="search-guests" className="text-sm font-semibold text-gray-700 dark:text-gray-200">Who</Label>
              </div>
              <Input
                id="search-guests"
                type="number"
                placeholder="Add guests"
                min="1"
                max="20"
                value={searchData.guests}
                onChange={(e) => handleInputChange("guests", e.target.value)}
                className="w-full text-base border-0 bg-transparent p-0 focus:ring-0 shadow-none placeholder:text-gray-500 font-medium"
                aria-label="Number of guests"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-center justify-center px-4 py-4">
              <Button
                type="submit"
                className="w-full h-14 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 bg-brand-blue text-white hover:bg-brand-blue-dark pulse-glow font-semibold"
                aria-label="Search properties"
              >
                <Search className="h-6 w-6 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
