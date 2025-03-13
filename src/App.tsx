
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Index from "./pages/Index";
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

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ReduxUpdater />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </Provider>
  );
}

export default App;
