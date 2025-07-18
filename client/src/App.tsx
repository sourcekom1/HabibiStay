import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home"; 
import SearchResults from "@/pages/SearchResultsFixed";
import HostDashboard from "@/pages/HostDashboard";
import AdminPanel from "@/pages/AdminPanel";
import BecomeHost from "@/pages/BecomeHost";
import About from "@/pages/About";
import Invest from "@/pages/Invest";
import Contact from "@/pages/Contact";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import FAQ from "@/pages/FAQ";
import NotFound from "@/pages/not-found";
import FavoritesPage from "@/components/FavoritesPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AiSettings from "@/pages/AiSettings";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner briefly, then default to Landing page
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/search" component={SearchResults} />
          <Route path="/about" component={About} />
          <Route path="/invest" component={Invest} />
          <Route path="/contact" component={Contact} />
          <Route path="/become-host" component={BecomeHost} />
          <Route path="/host" component={HostDashboard} />
          <Route path="/terms" component={TermsOfService} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/faq" component={FAQ} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/search" component={SearchResults} />
          <Route path="/about" component={About} />
          <Route path="/invest" component={Invest} />
          <Route path="/contact" component={Contact} />
          <Route path="/become-host" component={BecomeHost} />
          <Route path="/host" component={HostDashboard} />
          <Route path="/terms" component={TermsOfService} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/faq" component={FAQ} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/admin/ai-settings" component={AiSettings} />
          <Route path="/favorites" component={FavoritesPage} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
