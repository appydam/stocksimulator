
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTrading } from '@/contexts/TradingContext';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { BarChart, Users, BadgeIndianRupee, History, Settings, Download, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function ProfilePage() {
  const { state, resetPortfolio } = useTrading();
  const [username, setUsername] = useState('Demo User');
  const [email, setEmail] = useState('user@example.com');
  
  // Calculate portfolio stats
  const portfolioValue = state.holdings.reduce((total, holding) => {
    const stock = state.stockData.find(s => s.id === holding.stockId);
    return total + (stock ? stock.currentPrice * holding.quantity : 0);
  }, 0);
  
  const totalValue = state.cash + portfolioValue;
  const investedAmount = state.holdings.reduce((total, holding) => total + holding.investedAmount, 0);
  const totalPnL = portfolioValue - investedAmount;
  const pnlPercentage = investedAmount > 0 ? (totalPnL / investedAmount) * 100 : 0;
  
  // Calculate trading stats
  const completedOrders = state.orders.filter(order => order.status === 'EXECUTED').length;
  const canceledOrders = state.orders.filter(order => order.status === 'CANCELED').length;
  const pendingOrders = state.orders.filter(order => order.status === 'PENDING').length;
  
  const successfulTrades = state.transactions.filter(t => t.type === 'SELL').length;
  
  // Export portfolio data
  const exportPortfolioData = () => {
    // Create Holdings CSV
    const holdingsCSV = [
      'Stock,Symbol,Quantity,Average Buy Price,Current Price,Value,Profit/Loss,P&L %',
      ...state.holdings.map(holding => {
        const stock = state.stockData.find(s => s.id === holding.stockId);
        if (!stock) return '';
        
        const currentValue = stock.currentPrice * holding.quantity;
        const pnl = currentValue - holding.investedAmount;
        const pnlPercent = (pnl / holding.investedAmount) * 100;
        
        return `"${stock.name}",${stock.symbol},${holding.quantity},${holding.averageBuyPrice.toFixed(2)},${stock.currentPrice.toFixed(2)},${currentValue.toFixed(2)},${pnl.toFixed(2)},${pnlPercent.toFixed(2)}%`;
      })
    ].join('\n');
    
    // Create Orders CSV
    const ordersCSV = [
      'Date,Stock,Type,Order Type,Quantity,Price,Total Value,Status',
      ...state.orders.map(order => {
        const stock = state.stockData.find(s => s.id === order.stockId);
        if (!stock) return '';
        
        const date = new Date(order.createdAt).toLocaleDateString();
        const price = order.executedPrice || order.limitPrice || 0;
        const total = price * order.quantity;
        
        return `${date},"${stock.name}",${order.type},${order.orderType},${order.quantity},${price.toFixed(2)},${total.toFixed(2)},${order.status}`;
      })
    ].join('\n');
    
    // Create and download holdings file
    const holdingsBlob = new Blob([holdingsCSV], { type: 'text/csv' });
    const holdingsURL = URL.createObjectURL(holdingsBlob);
    const holdingsLink = document.createElement('a');
    holdingsLink.href = holdingsURL;
    holdingsLink.download = 'portfolio-holdings.csv';
    holdingsLink.click();
    
    // Create and download orders file
    const ordersBlob = new Blob([ordersCSV], { type: 'text/csv' });
    const ordersURL = URL.createObjectURL(ordersBlob);
    const ordersLink = document.createElement('a');
    ordersLink.href = ordersURL;
    ordersLink.download = 'portfolio-orders.csv';
    ordersLink.click();
    
    toast({
      title: "Export Complete",
      description: "Your portfolio data has been exported to CSV files.",
    });
  };
  
  const handleResetPortfolio = () => {
    if (window.confirm("Are you sure you want to reset your portfolio? This will clear all holdings and transactions.")) {
      resetPortfolio();
      toast({
        title: "Portfolio Reset",
        description: "Your portfolio has been reset to initial state.",
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Overview Card */}
          <Card className="w-full md:w-1/3 bg-card/70 backdrop-blur-sm border border-border/50">
            <CardHeader className="pb-2">
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your account and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4 mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {username.split(' ').map(name => name[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-semibold">{username}</h3>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Available Funds</p>
                    <p className="text-xl font-semibold">{formatCurrency(state.cash)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-xl font-semibold">{formatCurrency(totalValue)}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Overall Performance</p>
                  <p className={`text-xl font-semibold ${pnlPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(totalPnL)} ({formatPercentage(pnlPercentage)})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Stats and Settings */}
          <div className="w-full md:w-2/3 space-y-6">
            <Tabs defaultValue="stats">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="stats">Trading Statistics</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <StatCard 
                    icon={<BarChart className="h-4 w-4 text-blue-500" />} 
                    title="Total Orders" 
                    value={state.orders.length.toString()} 
                  />
                  <StatCard 
                    icon={<Users className="h-4 w-4 text-green-500" />} 
                    title="Stocks Owned" 
                    value={state.holdings.length.toString()} 
                  />
                  <StatCard 
                    icon={<BadgeIndianRupee className="h-4 w-4 text-purple-500" />} 
                    title="Successful Trades" 
                    value={successfulTrades.toString()} 
                  />
                  <StatCard 
                    icon={<History className="h-4 w-4 text-amber-500" />} 
                    title="Pending Orders" 
                    value={pendingOrders.toString()} 
                  />
                </div>
                
                <Card className="bg-card/70 backdrop-blur-sm border border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Order Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Executed Orders</span>
                        <span className="text-sm font-medium bg-green-500/10 text-green-500 px-2 py-0.5 rounded">
                          {completedOrders}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Canceled Orders</span>
                        <span className="text-sm font-medium bg-red-500/10 text-red-500 px-2 py-0.5 rounded">
                          {canceledOrders}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pending Orders</span>
                        <span className="text-sm font-medium bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded">
                          {pendingOrders}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={exportPortfolioData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Portfolio Data
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleResetPortfolio}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reset Portfolio
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4 pt-4">
                <Card className="bg-card/70 backdrop-blur-sm border border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Display Name</Label>
                      <Input 
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                      />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-card/70 backdrop-blur-sm border border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notification-email">Email Notifications</Label>
                      <Switch id="notification-email" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notification-price">Price Alerts</Label>
                      <Switch id="notification-price" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-refresh">Auto-refresh Data</Label>
                      <Switch id="auto-refresh" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <Card className="bg-card/70 backdrop-blur-sm border border-border/50">
      <CardContent className="p-4 flex items-center space-x-4">
        <div className="p-2 rounded-full bg-card border border-border/50">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
