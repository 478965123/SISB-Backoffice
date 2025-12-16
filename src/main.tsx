import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { BranchProvider } from "./contexts/BranchContext";

// In production, get user locations from authenticated user
// For demo purposes, using mock user with access to multiple branches
const mockUserLocations = ["PU", "SV", "TB", "CM", "NB", "RY"];

createRoot(document.getElementById("root")!).render(
  <BranchProvider userLocations={mockUserLocations}>
    <App />
  </BranchProvider>
);
  