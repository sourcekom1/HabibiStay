import { useState } from "react";
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
import { Menu, User, Settings, LogOut, Home as HomeIcon } from "lucide-react";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-brand-blue cursor-pointer hover:text-brand-blue-dark transition-colors">
                  Habibistay
                </h1>
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/">
                <a className="text-gray-900 hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors">
                  Home
                </a>
              </Link>
              <a 
                href="#experiences" 
                className="text-gray-600 hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors"
              >
                Experiences
              </a>
              {isAuthenticated && user?.userType === 'host' && (
                <Link href="/host">
                  <a className="text-gray-600 hover:text-brand-blue px-3 py-2 text-sm font-medium transition-colors">
                    Host Dashboard
                  </a>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated && (
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="text-gray-600 hover:text-brand-blue text-sm font-medium transition-colors"
              >
                Become a Host
              </Button>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 border border-gray-300 rounded-full py-2 px-4 hover:shadow-md transition-shadow"
                  >
                    <Menu className="h-4 w-4 text-gray-600" />
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user?.profileImageUrl} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {user?.firstName} {user?.lastName}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/">
                      <a className="flex items-center w-full">
                        <HomeIcon className="h-4 w-4 mr-2" />
                        Home
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  {user?.userType === 'host' && (
                    <DropdownMenuItem asChild>
                      <Link href="/host">
                        <a className="flex items-center w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Host Dashboard
                        </a>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user?.userType === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <a className="flex items-center w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </a>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleLogin}
                className="flex items-center space-x-2 border border-gray-300 rounded-full py-2 px-4 hover:shadow-md transition-shadow"
                variant="ghost"
              >
                <Menu className="h-4 w-4 text-gray-600" />
                <User className="h-5 w-5 text-gray-600" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
