import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User, Settings, LogOut, Home as HomeIcon, Sparkles, Bell, Heart, X } from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import { apiRequest } from "@/lib/queryClient";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fetch unread notifications count
  const { data: unreadNotifications = [] } = useQuery({
    queryKey: ['/api/notifications', true],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/notifications?unread=true");
      return response.json();
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch user favorites count
  const { data: userFavorites = [] } = useQuery<any[]>({
    queryKey: ['/api/favorites'],
    enabled: !!user,
  });

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  const NavLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link 
      href={href} 
      className="glass-button px-4 py-2 rounded-2xl font-medium transition-all duration-300 hover:scale-105 bg-brand-blue shadow-lg text-[#575b78]"
    >
      {children}
    </Link>
  );

  return (
    <nav className={`glass-nav sticky top-0 z-50 transition-all duration-500 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative">
                    <Sparkles className="h-8 w-8 text-brand-blue group-hover:text-brand-blue-light transition-all duration-300 group-hover:rotate-12" />
                    <div className="absolute inset-0 bg-brand-blue/20 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
                    HabibiStay
                  </h1>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/search">Stays</NavLink>
              <NavLink href="/host">Owners</NavLink>
              <NavLink href="/invest">Invest</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-brand-blue hover:bg-brand-blue/10"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="text-left text-2xl font-bold gradient-text">
                    HabibiStay
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-6 space-y-4">
                  <Link 
                    href="/" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center p-3 rounded-xl transition-colors ${isActive('/') ? 'bg-brand-blue text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <HomeIcon className="h-5 w-5 mr-3" />
                    Home
                  </Link>
                  <Link 
                    href="/search" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center p-3 rounded-xl transition-colors ${isActive('/search') ? 'bg-brand-blue text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <span className="h-5 w-5 mr-3">🏠</span>
                    Find Stays
                  </Link>
                  <Link 
                    href="/host" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center p-3 rounded-xl transition-colors ${isActive('/host') ? 'bg-brand-blue text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <span className="h-5 w-5 mr-3">🏢</span>
                    Become a Host
                  </Link>
                  <Link 
                    href="/invest" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center p-3 rounded-xl transition-colors ${isActive('/invest') ? 'bg-brand-blue text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <span className="h-5 w-5 mr-3">💰</span>
                    Investment
                  </Link>
                  <Link 
                    href="/about" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center p-3 rounded-xl transition-colors ${isActive('/about') ? 'bg-brand-blue text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <span className="h-5 w-5 mr-3">ℹ️</span>
                    About Us
                  </Link>
                  <Link 
                    href="/contact" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center p-3 rounded-xl transition-colors ${isActive('/contact') ? 'bg-brand-blue text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <span className="h-5 w-5 mr-3">📞</span>
                    Contact
                  </Link>
                  
                  {/* Authentication Section */}
                  <div className="border-t pt-4 mt-4">
                    {!isAuthenticated ? (
                      <Button
                        onClick={() => {
                          handleLogin();
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-brand-blue text-white hover:bg-brand-blue-dark"
                      >
                        Sign In / Sign Up
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={user?.profileImageUrl || undefined} />
                            <AvatarFallback className="bg-brand-blue text-white">
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                        
                        {user?.userType === 'admin' && (
                          <Link 
                            href="/admin" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Settings className="h-5 w-5 mr-3 text-brand-blue" />
                            Admin Panel
                          </Link>
                        )}
                        
                        <Link 
                          href="/favorites" 
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Heart className="h-5 w-5 mr-3 text-brand-blue" />
                          My Favorites
                          {userFavorites.length > 0 && (
                            <Badge variant="secondary" className="ml-auto">
                              {userFavorites.length}
                            </Badge>
                          )}
                        </Link>
                        
                        <Button
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut className="h-5 w-5 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && (
              <>
                {/* Favorites Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="relative p-2 rounded-full hover:bg-brand-blue/10 transition-all duration-300"
                >
                  <Link href="/favorites">
                    <Heart className="h-5 w-5 text-brand-blue" />
                    {userFavorites.length > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {userFavorites.length}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {/* Notifications Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full hover:bg-brand-blue/10 transition-all duration-300"
                >
                  <Bell className="h-5 w-5 text-brand-blue" />
                  {unreadNotifications.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                    </Badge>
                  )}
                </Button>
              </>
            )}

            {!isAuthenticated && (
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="glass-button px-6 py-2 rounded-2xl text-brand-blue hover:text-white font-semibold border-2 border-brand-blue hover:bg-brand-blue transition-all duration-300 hover:scale-105"
              >
                Become a Host
              </Button>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="glass-button flex items-center space-x-3 rounded-2xl py-3 px-5 transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-brand-blue/30"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-brand-blue/30">
                      <AvatarImage src={user?.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-brand-blue/10 text-brand-blue">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 glass-card border-brand-blue/20">
                  <DropdownMenuItem className="flex items-center p-4 rounded-xl">
                    <User className="h-5 w-5 mr-3 text-brand-blue" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-brand-blue/20" />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center w-full p-3 rounded-xl hover:bg-brand-blue/10 transition-colors duration-300">
                      <HomeIcon className="h-5 w-5 mr-3 text-brand-blue" />
                      <span className="font-medium">Home</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.userType === 'host' && (
                    <DropdownMenuItem asChild>
                      <Link href="/host" className="flex items-center w-full p-3 rounded-xl hover:bg-brand-blue/10 transition-colors duration-300">
                        <Settings className="h-5 w-5 mr-3 text-brand-blue" />
                        <span className="font-medium">Host Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user?.userType === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center w-full p-3 rounded-xl hover:bg-brand-blue/10 transition-colors duration-300">
                        <Settings className="h-5 w-5 mr-3 text-brand-blue" />
                        <span className="font-medium">Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-brand-blue/20" />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300">
                    <LogOut className="h-5 w-5 mr-3 text-red-500" />
                    <span className="font-medium text-red-600 dark:text-red-400">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleLogin}
                className="glass-button flex items-center space-x-3 rounded-2xl py-3 px-5 transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-brand-blue/30"
                variant="ghost"
              >
                <User className="h-6 w-6 text-brand-blue" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </nav>
  );
}
