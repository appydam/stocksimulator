
import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTrading } from '@/contexts/TradingContext';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Moon, Sun, Download } from 'lucide-react';

export default function SettingsPage() {
  const { state, resetPortfolio } = useTrading();
  const [showNotifications, setShowNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  
  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('showNotifications');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedNotifications !== null) {
      setShowNotifications(savedNotifications === 'true');
    }
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
      if (savedDarkMode === 'true') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('showNotifications', showNotifications.toString());
  }, [showNotifications]);
  
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your portfolio? This action cannot be undone.')) {
      resetPortfolio();
      toast({
        title: "Portfolio Reset",
        description: "Your portfolio has been reset to initial cash balance.",
      });
    }
  };
  
  const handleExportData = () => {
    // Create CSV for portfolio holdings
    let holdingsCSV = 'Stock Symbol,Quantity,Average Buy Price,Current Value,P&L\n';
    state.holdings.forEach(holding => {
      const stock = state.stockData.find(s => s.id === holding.stockId);
      if (stock) {
        const currentValue = stock.currentPrice * holding.quantity;
        const pnl = currentValue - holding.investedAmount;
        holdingsCSV += `${stock.symbol},${holding.quantity},${holding.averageBuyPrice},${currentValue},${pnl}\n`;
      }
    });
    
    // Create CSV for orders
    let ordersCSV = 'Date,Stock,Type,Quantity,Price,Total,Status\n';
    state.orders.forEach(order => {
      const stock = state.stockData.find(s => s.id === order.stockId);
      const price = order.executedPrice || order.limitPrice || 0;
      ordersCSV += `${new Date(order.createdAt).toISOString()},${stock?.symbol},${order.type},${order.quantity},${price},${price * order.quantity},${order.status}\n`;
    });
    
    // Bundle into a zip-like format (just multiple downloads for now)
    const holdingsBlob = new Blob([holdingsCSV], { type: 'text/csv' });
    const ordersBlob = new Blob([ordersCSV], { type: 'text/csv' });
    
    // Create download links
    const holdingsURL = URL.createObjectURL(holdingsBlob);
    const ordersURL = URL.createObjectURL(ordersBlob);
    
    // Create and trigger download links
    const holdingsLink = document.createElement('a');
    holdingsLink.href = holdingsURL;
    holdingsLink.download = 'portfolio-holdings.csv';
    holdingsLink.click();
    
    const ordersLink = document.createElement('a');
    ordersLink.href = ordersURL;
    ordersLink.download = 'order-history.csv';
    ordersLink.click();
    
    // Clean up
    URL.revokeObjectURL(holdingsURL);
    URL.revokeObjectURL(ordersURL);
    
    toast({
      title: "Export Complete",
      description: "Your portfolio data has been exported as CSV files.",
    });
  };
  
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Trading Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about order status changes
                  </p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={showNotifications} 
                  onCheckedChange={setShowNotifications} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode" className="flex items-center">
                    <span className="mr-2">Dark Mode</span>
                    {darkMode ? (
                      <Moon className="h-4 w-4 inline-block" />
                    ) : (
                      <Sun className="h-4 w-4 inline-block" />
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch 
                  id="darkMode" 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode} 
                />
              </div>
              
              <div className="pt-4 border-t">
                <Label>Export Portfolio Data</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Download your portfolio and order history as CSV files
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Management</CardTitle>
              <CardDescription>Manage your trading portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Cash Balance</Label>
                <p className="text-xl font-bold">{formatCurrency(state.cash)}</p>
              </div>
              
              <div>
                <Label>Reset Portfolio</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Reset your portfolio to the initial cash balance
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleReset}
                >
                  Reset Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
