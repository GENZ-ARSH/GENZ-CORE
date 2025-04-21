import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/layout/MobileHeader";
import DesktopHeader from "@/components/layout/DesktopHeader";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home/HomePage";
import LibraryPage from "@/pages/library/LibraryPage";
import AdminPage from "@/pages/admin/AdminPage";
import TeamPage from "@/pages/team/TeamPage";
import DownloadPage from "@/pages/download/DownloadPage";
import RequestPage from "@/pages/request/RequestPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/library" component={LibraryPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/team" component={TeamPage} />
      <Route path="/downloads" component={DownloadPage} />
      <Route path="/request" component={RequestPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="font-sans antialiased">
          <MobileHeader toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          
          {/* Overlay for sidebar on mobile */}
          <div 
            onClick={() => setSidebarOpen(false)} 
            className={`fixed inset-0 z-30 bg-gray-900 bg-opacity-50 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'block' : 'hidden'}`}
          />
          
          <main className={`transition-all duration-300 min-h-screen ${sidebarOpen ? 'lg:ml-64' : ''}`}>
            <DesktopHeader />
            <div className="p-4 sm:p-6 lg:p-8">
              <Router />
            </div>
          </main>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
