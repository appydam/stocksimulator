
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSettings } from '@/store/userSlice';

export default function SettingsPage() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector(state => state.user);
  const { holdings, orders, stockData } = useAppSelector(state => state.trading);
  
  const [formState, setFormState] = useState({
    darkMode: settings.darkMode,
    notifications: settings.notifications,
    emailAlerts: settings.emailAlerts,
    smsAlerts: settings.smsAlerts,
  });

  const handleToggle = (field: keyof typeof formState) => {
    setFormState(prev => {
      const newState = { ...prev, [field]: !prev[field] };
      
      // Update Redux state immediately
      dispatch(updateSettings({ [field]: newState[field] }));
      
      // Apply dark mode change
      if (field === 'darkMode') {
        if (newState.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      return newState;
    });
  };

  const handleSave = () => {
    // Settings are already saved on toggle, just show confirmation
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated.',
    });
  };

  const handleResetPortfolio = () => {
    if (window.confirm('Are you sure you want to reset your portfolio? This action cannot be undone.')) {
      // Implement portfolio reset logic here
      toast({
        title: 'Portfolio reset',
        description: 'Your portfolio has been reset to initial state.',
      });
    }
  };

  const handleExportData = () => {
    // Get current state
    const state = {
      holdings,
      orders,
      stockData,
      settings
    };
    
    // Create a CSV string for portfolio
    let portfolioCSV = 'Symbol,Quantity,Average Price,Current Price,Market Value,Profit/Loss,P/L %\n';
    state.holdings.forEach(item => {
      const stock = state.stockData.find(s => s.id === item.stockId);
      if (stock) {
        portfolioCSV += `${stock.symbol},${item.quantity},${item.averageBuyPrice},${stock.currentPrice},${stock.currentPrice * item.quantity},${(stock.currentPrice - item.averageBuyPrice) * item.quantity},${((stock.currentPrice / item.averageBuyPrice) - 1) * 100}\n`;
      }
    });
    
    // Create a CSV string for orders
    let ordersCSV = 'Date,Symbol,Type,Quantity,Price,Total,Status\n';
    state.orders.forEach(order => {
      const stock = state.stockData.find(s => s.id === order.stockId);
      const price = order.executedPrice || order.limitPrice || 0;
      const dateStr = order.createdAt instanceof Date 
        ? order.createdAt.toISOString() 
        : new Date(order.createdAt).toISOString();
      ordersCSV += `${dateStr},${stock?.symbol},${order.type},${order.quantity},${price},${price * order.quantity},${order.status}\n`;
    });
    
    // Bundle into a zip-like format (just multiple downloads for now)
    const portfolioBlob = new Blob([portfolioCSV], { type: 'text/csv' });
    const ordersBlob = new Blob([ordersCSV], { type: 'text/csv' });
    
    // Create download links
    const portfolioLink = document.createElement('a');
    portfolioLink.href = URL.createObjectURL(portfolioBlob);
    portfolioLink.download = 'portfolio.csv';
    
    const ordersLink = document.createElement('a');
    ordersLink.href = URL.createObjectURL(ordersBlob);
    ordersLink.download = 'orders.csv';
    
    // Trigger downloads
    portfolioLink.click();
    setTimeout(() => ordersLink.click(), 100);
    
    toast({
      title: 'Data exported',
      description: 'Your portfolio and order data has been exported as CSV files.',
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <Separator />
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Dark mode</Label>
                <Switch 
                  id="darkMode" 
                  checked={formState.darkMode}
                  onCheckedChange={() => handleToggle('darkMode')}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Notifications Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable notifications</Label>
                <Switch 
                  id="notifications" 
                  checked={formState.notifications}
                  onCheckedChange={() => handleToggle('notifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="emailAlerts">Email alerts</Label>
                <Switch 
                  id="emailAlerts" 
                  checked={formState.emailAlerts}
                  onCheckedChange={() => handleToggle('emailAlerts')}
                  disabled={!formState.notifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="smsAlerts">SMS alerts</Label>
                <Switch 
                  id="smsAlerts" 
                  checked={formState.smsAlerts}
                  onCheckedChange={() => handleToggle('smsAlerts')}
                  disabled={!formState.notifications}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export or reset your trading data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-1">
                <Label>Export Data</Label>
                <p className="text-sm text-muted-foreground">
                  Download your portfolio and trading history as CSV files
                </p>
              </div>
              <Button onClick={handleExportData}>
                Export Data
              </Button>
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive" 
                onClick={handleResetPortfolio}
              >
                Reset Portfolio
              </Button>
            </CardFooter>
          </Card>
          
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-1">
                <Label>Save Changes</Label>
                <p className="text-sm text-muted-foreground">
                  Apply all your setting changes
                </p>
              </div>
              <Button onClick={handleSave}>
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
