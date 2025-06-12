import { ReactNode } from "react";
import Navigation from "./Navigation";
import MobileFooter from "./MobileFooter";
import SaraChatbot from "./SaraChatbot";

interface LayoutProps {
  children: ReactNode;
  showMobileFooter?: boolean;
}

export default function Layout({ children, showMobileFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className={`${showMobileFooter ? 'pb-16 md:pb-0' : ''}`}>
        {children}
      </main>
      {showMobileFooter && <MobileFooter />}
      <SaraChatbot />
    </div>
  );
}