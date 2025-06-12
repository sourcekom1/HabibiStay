import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User, Settings, LogOut, Home as HomeIcon, Sparkles } from "lucide-react";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <nav className={`glass-nav sticky top-0 z-50 transition-all duration-500 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative">
                    <Sparkles className="h-8 w-8 text-brand-blue group-hover:text-brand-blue-light transition-all duration-300 group-hover:rotate-12" />
                    <div className="absolute inset-0 bg-brand-blue/20 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  <h1 className="text-3xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
                    HabibiStay
                  </h1>
                </div>
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <Link href="/" className="glass-button px-4 py-2 rounded-2xl text-brand-blue hover:text-white font-semibold transition-all duration-300 hover:scale-105">
                Home
              </Link>
              <Link href="/search?location=Riyadh" className="glass-button px-4 py-2 rounded-2xl text-gray-700 dark:text-gray-200 hover:text-brand-blue font-medium transition-all duration-300 hover:scale-105">
                Stays
              </Link>
              <Link href="/host" className="glass-button px-4 py-2 rounded-2xl text-gray-700 dark:text-gray-200 hover:text-brand-blue font-medium transition-all duration-300 hover:scale-105">
                Owners
              </Link>
              <Link href="/invest" className="glass-button px-4 py-2 rounded-2xl text-gray-700 dark:text-gray-200 hover:text-brand-blue font-medium transition-all duration-300 hover:scale-105">
                Invest
              </Link>
              <Link href="/about" className="glass-button px-4 py-2 rounded-2xl text-gray-700 dark:text-gray-200 hover:text-brand-blue font-medium transition-all duration-300 hover:scale-105">
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
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
                    <Menu className="h-5 w-5 text-brand-blue" />
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
                <Menu className="h-5 w-5 text-brand-blue" />
                <User className="h-6 w-6 text-brand-blue" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
