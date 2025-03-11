
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TradingProvider } from '@/contexts/TradingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTrading } from '@/contexts/TradingContext';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const { state, resetPortfolio } = useTrading();
  const [showNotifications, setShowNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your portfolio? This action cannot be undone.')) {
      resetPortfolio();
      toast({
        title: "Portfolio Reset",
        description: "Your portfolio has been reset to initial cash balance.",
      });
    }
  };
  
  return (
    <TradingProvider>
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
                    <Label htmlFor="darkMode">Dark Mode</Label>
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
    </TradingProvider>
  );
}
