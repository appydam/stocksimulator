
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Provider } from "react-redux";
import { store } from "./store";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MarketPage from "./pages/Market";
import WatchlistPage from "./pages/Watchlist";
import OrdersPage from "./pages/Orders";
import PortfolioPage from "./pages/Portfolio";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import HelpPage from "./pages/Help";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/toaster";
import { ReduxUpdater } from "./components/ReduxUpdater";
import "./App.css";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
};

function App() {
  return (
    <Router>
      <ReduxUpdater />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        
        {/* Protected routes */}
        <Route 
          path="/market" 
          element={
            <ProtectedRoute>
              <MarketPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/watchlist" 
          element={
            <ProtectedRoute>
              <WatchlistPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/portfolio" 
          element={
            <ProtectedRoute>
              <PortfolioPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/help" 
          element={
            <ProtectedRoute>
              <HelpPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
