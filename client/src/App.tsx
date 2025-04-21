import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
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
import Courses from './pages/Courses';
import Forums from './pages/Forums';
import StudyGroups from './pages/StudyGroups';
import PracticeTests from './pages/PracticeTests';
import ProgressTracking from './pages/ProgressTracking';

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <MainLayout showAdminSidebar={isAdminRoute}>
      <Switch>
        {/* User routes */}
        <Route path="/">
          {() => <Home />}
        </Route>
        <Route path="/library">
          {() => <Library />}
        </Route>
        <Route path="/book-request">
          {() => <BookRequest />}
        </Route>
        <Route path="/team">
          {() => <TeamDashboard />}
        </Route>
        <Route path="/download-center">
          {() => <DownloadCenter />}
        </Route>
        <Route path="/profile">
          {() => <Profile />}
        </Route>
        <Route path="/settings">
          {() => <Settings />}
        </Route>
        <Route path="/courses">
          {() => <Courses />}
        </Route>
        <Route path="/forums">
          {() => <Forums />}
        </Route>
        <Route path="/study-groups">
          {() => <StudyGroups />}
        </Route>
        <Route path="/practice-tests">
          {() => <PracticeTests />}
        </Route>
        <Route path="/progress">
          {() => <ProgressTracking />}
        </Route>

        {/* Admin routes */}
        <Route path="/admin">
          {() => <AdminPanel />}
        </Route>
        <Route path="/admin/books">
          {() => <AdminPanel section="books" />}
        </Route>
        <Route path="/admin/book-requests">
          {() => <AdminPanel section="bookRequests" />}
        </Route>
        <Route path="/admin/users">
          {() => <AdminPanel section="users" />}
        </Route>
        <Route path="/admin/analytics">
          {() => <AdminPanel section="analytics" />}
        </Route>
        <Route path="/admin/tasks">
          {() => <Tasks />}
        </Route>
        <Route path="/admin/downloads">
          {() => <AdminPanel section="downloads" />}
        </Route>
        <Route path="/admin/settings">
          {() => <Settings isAdmin={true} />}
        </Route>

        {/* Fallback route */}
        <Route>
          {() => <NotFound />}
        </Route>
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