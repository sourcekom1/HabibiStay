import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  Settings,
  Building2,
  Bell,
  MessageCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function MobileFooter() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Fetch unread notifications count
  const { data: unreadNotifications = [] } = useQuery({
    queryKey: ['/api/notifications', true],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/notifications?unread=true");
      return response.json();
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  // Fetch user favorites count
  const { data: userFavorites = [] } = useQuery<any[]>({
    queryKey: ['/api/favorites'],
    enabled: !!user,
  });

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  const NavItem = ({ 
    href, 
    icon: Icon, 
    label, 
    badge,
    onClick 
  }: { 
    href?: string; 
    icon: any; 
    label: string; 
    badge?: number;
    onClick?: () => void;
  }) => {
    const active = href ? isActive(href) : false;
    
    if (href) {
      return (
        <Link
          href={href}
          className={`flex flex-col items-center justify-center py-2 px-3 min-h-16 transition-all duration-200 ${
            active 
              ? 'text-brand-blue' 
              : 'text-gray-500 hover:text-brand-blue'
          }`}
        >
          <div className="relative">
            <Icon className={`h-6 w-6 ${active ? 'scale-110' : ''} transition-transform duration-200`} />
            {badge && badge > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs"
              >
                {badge > 9 ? '9+' : badge}
              </Badge>
            )}
          </div>
          <span className={`text-xs mt-1 font-medium ${active ? 'font-semibold' : ''}`}>
            {label}
          </span>
        </Link>
      );
    }
    
    return (
      <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center py-2 px-3 min-h-16 transition-all duration-200 text-gray-500 hover:text-brand-blue`}
      >
        <div className="relative">
          <Icon className="h-6 w-6 transition-transform duration-200" />
          {badge && badge > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-xs"
            >
              {badge > 9 ? '9+' : badge}
            </Badge>
          )}
        </div>
        <span className="text-xs mt-1 font-medium">
          {label}
        </span>
      </button>
    );
  };

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-pb">
      <div className="grid grid-cols-5 h-16">
        <NavItem 
          href="/" 
          icon={Home} 
          label="Home" 
        />
        
        <NavItem 
          href="/search" 
          icon={Search} 
          label="Search" 
        />
        
        {isAuthenticated ? (
          <>
            <NavItem 
              href="/favorites" 
              icon={Heart} 
              label="Favorites"
              badge={userFavorites?.length || 0}
            />
            
            <NavItem 
              href="/host" 
              icon={Building2} 
              label="Host" 
            />
            
            <NavItem 
              href={user?.userType === 'admin' ? '/admin' : '/profile'} 
              icon={user?.userType === 'admin' ? Settings : User} 
              label={user?.userType === 'admin' ? 'Admin' : 'Profile'}
              badge={unreadNotifications?.length || 0}
            />
          </>
        ) : (
          <>
            <NavItem 
              href="/about" 
              icon={MessageCircle} 
              label="About" 
            />
            
            <NavItem 
              href="/host" 
              icon={Building2} 
              label="Host" 
            />
            
            <NavItem 
              onClick={() => window.location.href = '/api/login'}
              icon={User} 
              label="Login" 
            />
          </>
        )}
      </div>
    </footer>
  );
}