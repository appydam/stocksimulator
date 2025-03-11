
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TradingProvider } from "./contexts/TradingContext";
import Index from "./pages/Index";
import MarketPage from "./pages/Market";
import WatchlistPage from "./pages/Watchlist";
import OrdersPage from "./pages/Orders";
import PortfolioPage from "./pages/Portfolio";
import SettingsPage from "./pages/Settings";
import HelpPage from "./pages/Help";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
    <TradingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </TradingProvider>
  );
}

export default App;
