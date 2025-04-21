import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { SidebarProvider } from "./contexts/SidebarContext";
import { UserProvider } from "./contexts/UserContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <SidebarProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </SidebarProvider>
  </ThemeProvider>
);
