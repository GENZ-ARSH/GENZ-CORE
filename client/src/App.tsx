import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { UserProvider } from "@/contexts/UserContext";
import { CollaborationProvider } from "@/contexts/CollaborationContext";
import NotFound from "@/pages/not-found";
import MainLayout from "./components/layout/MainLayout";
import Home from "./pages/Home";
import Library from "./pages/Library";
import BookRequest from "./pages/BookRequest";
import AdminPanel from "./pages/AdminPanel";
import Tasks from "./pages/Tasks";
import TeamDashboard from "./pages/TeamDashboard";
import DownloadCenter from "./pages/DownloadCenter";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/library" component={Library} />
        <Route path="/request" component={BookRequest} />
        <Route path="/admin" component={AdminPanel} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/team" component={TeamDashboard} />
        <Route path="/downloads" component={DownloadCenter} />
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <CollaborationProvider>
            <SidebarProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </SidebarProvider>
          </CollaborationProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
