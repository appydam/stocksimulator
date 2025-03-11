
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Stock } from '@/data/stocks';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Bell, Trash2 } from 'lucide-react';

interface PriceAlert {
  id: string;
  stockId: string;
  stockSymbol: string;
  price: number;
  condition: 'above' | 'below';
  active: boolean;
  createdAt: Date;
}

interface PriceAlertsProps {
  stock: Stock;
}

export function PriceAlerts({ stock }: PriceAlertsProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const savedAlerts = localStorage.getItem('priceAlerts');
    return savedAlerts ? JSON.parse(savedAlerts) : [];
  });
  
  const [price, setPrice] = useState<string>(stock.currentPrice.toString());
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  
  // Filter alerts for the current stock
  const stockAlerts = alerts.filter(alert => alert.stockId === stock.id);
  
  // Save alerts to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
  }, [alerts]);
  
  // Check for alerts whenever stock prices update
  React.useEffect(() => {
    const triggeredAlerts = alerts
      .filter(alert => alert.active)
      .filter(alert => {
        const stockData = [stock]; // In a real app, this would be all stocks
        const alertStock = stockData.find(s => s.id === alert.stockId);
        if (!alertStock) return false;
        
        if (alert.condition === 'above' && alertStock.currentPrice >= alert.price) {
          return true;
        }
        if (alert.condition === 'below' && alertStock.currentPrice <= alert.price) {
          return true;
        }
        return false;
      });
    
    // Notify for triggered alerts and deactivate them
    triggeredAlerts.forEach(alert => {
      toast({
        title: `Price Alert: ${alert.stockSymbol}`,
        description: `${alert.stockSymbol} is now ${alert.condition === 'above' ? 'above' : 'below'} ${formatCurrency(alert.price)}`,
      });
      
      // Deactivate triggered alert
      setAlerts(prev => prev.map(a => 
        a.id === alert.id ? { ...a, active: false } : a
      ));
    });
  }, [stock, alerts]);
  
  const handleAddAlert = () => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price value.",
        variant: "destructive",
      });
      return;
    }
    
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      stockId: stock.id,
      stockSymbol: stock.symbol,
      price: numericPrice,
      condition,
      active: true,
      createdAt: new Date(),
    };
    
    setAlerts(prev => [...prev, newAlert]);
    
    toast({
      title: "Alert Created",
      description: `You'll be notified when ${stock.symbol} price goes ${condition} ${formatCurrency(numericPrice)}`,
    });
    
    // Reset form
    setPrice(stock.currentPrice.toString());
    setCondition('above');
  };
  
  const handleToggleAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, active: !alert.active } : alert
    ));
  };
  
  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Set Price Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alert-condition">Condition</Label>
                <Select 
                  value={condition} 
                  onValueChange={(value) => setCondition(value as 'above' | 'below')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Price goes above</SelectItem>
                    <SelectItem value="below">Price goes below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alert-price">Price (₹)</Label>
                <Input
                  id="alert-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleAddAlert} 
              className="w-full"
            >
              Create Alert
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {stockAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stockAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className="flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {alert.stockSymbol} {alert.condition === 'above' ? 'above' : 'below'} {formatCurrency(alert.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created on {new Date(alert.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={alert.active} 
                      onCheckedChange={() => handleToggleAlert(alert.id)} 
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
