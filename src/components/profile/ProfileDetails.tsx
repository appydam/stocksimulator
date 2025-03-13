
import React, { useState } from 'react';
import { useTrading } from '@/contexts/TradingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  User, Mail, Phone, MapPin, Tag, Shield, Bell, 
  CreditCard, LineChart, Settings, Edit, Save, Wallet,
  PieChart, Briefcase, Calendar, Clock, Globe, TrendingUp,
  ArrowDownRight, ArrowUpRight
} from 'lucide-react';
import { formatCurrency, formatPercentage, getColorForChange, formatDateTime } from '@/lib/utils';

export function ProfileDetails() {
  const { state } = useTrading();
  const { cash, holdings, stockData, transactions } = state;

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra',
    occupation: 'Software Engineer',
    bio: 'Passionate investor focused on long-term growth and value investing strategies.'
  });

  // Calculate portfolio stats
  const portfolioValue = holdings.reduce((total, holding) => {
    const stock = stockData.find(s => s.id === holding.stockId);
    return total + (stock ? stock.currentPrice * holding.quantity : 0);
  }, 0);
  
  const totalValue = cash + portfolioValue;
  const investedAmount = holdings.reduce((total, holding) => total + holding.investedAmount, 0);
  
  const unrealizedPnL = holdings.reduce((total, holding) => {
    const stock = stockData.find(s => s.id === holding.stockId);
    const currentValue = stock ? stock.currentPrice * holding.quantity : 0;
    return total + (currentValue - holding.investedAmount);
  }, 0);
  
  const pnlPercentage = investedAmount > 0 ? (unrealizedPnL / investedAmount) * 100 : 0;

  // Mock trading stats
  const tradingStats = {
    totalTrades: transactions.length,
    winRate: 65.8,
    profitFactor: 2.78,
    avgWin: 3200,
    avgLoss: 1200,
    largestWin: 12500,
    largestLoss: 4800,
    longestWinStreak: 7,
    longestLossStreak: 3,
    tradingDays: 124,
    activeHoursPerDay: 3.5,
  };

  // Mock account settings
  const [settings, setSettings] = useState({
    notifications: true,
    twoFactorAuth: false,
    darkMode: false,
    emailAlerts: true,
    smsAlerts: false,
    autoRenew: true,
    publicProfile: false,
    dataSharing: true
  });

  const handleProfileSave = () => {
    setIsEditing(false);
    // Would save data to backend here
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      [key]: value
    });
    // Would save settings to backend here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        {isEditing ? (
          <Button onClick={handleProfileSave} variant="default">
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="col-span-7 md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                  <AvatarFallback className="text-2xl">{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </div>
              
              <ProfileField 
                icon={<User className="h-4 w-4" />}
                label="Name"
                value={profileData.name}
                isEditing={isEditing}
                onChange={(value) => setProfileData({...profileData, name: value})}
              />
              
              <ProfileField 
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={profileData.email}
                isEditing={isEditing}
                onChange={(value) => setProfileData({...profileData, email: value})}
              />
              
              <ProfileField 
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={profileData.phone}
                isEditing={isEditing}
                onChange={(value) => setProfileData({...profileData, phone: value})}
              />
              
              <ProfileField 
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={profileData.address}
                isEditing={isEditing}
                onChange={(value) => setProfileData({...profileData, address: value})}
              />
              
              <ProfileField 
                icon={<Briefcase className="h-4 w-4" />}
                label="Occupation"
                value={profileData.occupation}
                isEditing={isEditing}
                onChange={(value) => setProfileData({...profileData, occupation: value})}
              />
              
              <div className="pt-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Bio
                </label>
                {isEditing ? (
                  <textarea 
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={4}
                  />
                ) : (
                  <p className="text-sm mt-1">{profileData.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Account Status</span>
                </div>
                <span className="text-sm font-medium text-green-500">Active</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm">Subscription</span>
                </div>
                <span className="text-sm font-medium">Premium Plan</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Member Since</span>
                </div>
                <span className="text-sm font-medium">Mar 2023</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Last Login</span>
                </div>
                <span className="text-sm font-medium">Today, 10:45 AM</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Login Location</span>
                </div>
                <span className="text-sm font-medium">Mumbai, IN</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-7 md:col-span-5">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Wallet className="h-4 w-4 mr-2" />
                      Total Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
                    <p className="text-xs text-muted-foreground">Cash + Holdings</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <PieChart className="h-4 w-4 mr-2" />
                      Invested Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(portfolioValue)}</div>
                    <p className="text-xs text-muted-foreground">
                      {((portfolioValue / totalValue) * 100).toFixed(2)}% of total
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Unrealized P&L
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${getColorForChange(pnlPercentage)}`}>
                      {formatCurrency(unrealizedPnL)}
                    </div>
                    <p className={`text-xs flex items-center ${getColorForChange(pnlPercentage)}`}>
                      {pnlPercentage > 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : pnlPercentage < 0 ? (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      )}
                      {formatPercentage(pnlPercentage)}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest trading activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <div className="relative overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-muted/50">
                          <tr>
                            <th scope="col" className="px-4 py-3">Stock</th>
                            <th scope="col" className="px-4 py-3">Type</th>
                            <th scope="col" className="px-4 py-3">Quantity</th>
                            <th scope="col" className="px-4 py-3">Price</th>
                            <th scope="col" className="px-4 py-3">Value</th>
                            <th scope="col" className="px-4 py-3">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.slice(0, 5).map((transaction, index) => {
                            const stock = stockData.find(s => s.id === transaction.stockId);
                            return (
                              <tr key={index} className="border-b hover:bg-muted/50">
                                <td className="px-4 py-3 font-medium">{stock?.symbol}</td>
                                <td className={`px-4 py-3 ${transaction.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                                  {transaction.type.toUpperCase()}
                                </td>
                                <td className="px-4 py-3">{transaction.quantity}</td>
                                <td className="px-4 py-3">{formatCurrency(transaction.price)}</td>
                                <td className="px-4 py-3">{formatCurrency(transaction.price * transaction.quantity)}</td>
                                <td className="px-4 py-3">{formatDateTime(transaction.timestamp)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No transactions found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trading Statistics</CardTitle>
                  <CardDescription>Your performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatItem label="Total Trades" value={tradingStats.totalTrades.toString()} />
                    <StatItem 
                      label="Win Rate" 
                      value={formatPercentage(tradingStats.winRate)}
                      className="text-green-500"
                    />
                    <StatItem 
                      label="Profit Factor" 
                      value={tradingStats.profitFactor.toFixed(2)}
                      className="text-blue-500"
                    />
                    <StatItem 
                      label="Trading Days" 
                      value={tradingStats.tradingDays.toString()} 
                    />
                    
                    <StatItem 
                      label="Avg. Win" 
                      value={formatCurrency(tradingStats.avgWin)}
                      className="text-green-500"
                    />
                    <StatItem 
                      label="Avg. Loss" 
                      value={formatCurrency(tradingStats.avgLoss)}
                      className="text-red-500"
                    />
                    <StatItem 
                      label="Largest Win" 
                      value={formatCurrency(tradingStats.largestWin)}
                      className="text-green-500"
                    />
                    <StatItem 
                      label="Largest Loss" 
                      value={formatCurrency(tradingStats.largestLoss)}
                      className="text-red-500"
                    />
                    
                    <StatItem 
                      label="Win Streak" 
                      value={tradingStats.longestWinStreak.toString()}
                      className="text-green-500"
                    />
                    <StatItem 
                      label="Loss Streak" 
                      value={tradingStats.longestLossStreak.toString()}
                      className="text-red-500"
                    />
                    <StatItem 
                      label="Active Hours/Day" 
                      value={tradingStats.activeHoursPerDay.toString()}
                    />
                    <StatItem 
                      label="Avg. Hold Time" 
                      value="2.4 days"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>Your monthly returns compared to market</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Performance chart will be shown here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notifications</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications about important account events
                        </p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={settings.notifications}
                        onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-alerts">Email Alerts</Label>
                        <p className="text-xs text-muted-foreground">
                          Get important alerts delivered to your email
                        </p>
                      </div>
                      <Switch
                        id="email-alerts"
                        checked={settings.emailAlerts}
                        onCheckedChange={(checked) => handleSettingChange('emailAlerts', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-alerts">SMS Alerts</Label>
                        <p className="text-xs text-muted-foreground">
                          Receive time-sensitive alerts via SMS
                        </p>
                      </div>
                      <Switch
                        id="sms-alerts"
                        checked={settings.smsAlerts}
                        onCheckedChange={(checked) => handleSettingChange('smsAlerts', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Security</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa">Two-Factor Authentication</Label>
                        <p className="text-xs text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        id="2fa"
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Display</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-xs text-muted-foreground">
                          Use dark theme for the application
                        </p>
                      </div>
                      <Switch
                        id="dark-mode"
                        checked={settings.darkMode}
                        onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Privacy</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="public-profile">Public Profile</Label>
                        <p className="text-xs text-muted-foreground">
                          Allow other users to view your profile and statistics
                        </p>
                      </div>
                      <Switch
                        id="public-profile"
                        checked={settings.publicProfile}
                        onCheckedChange={(checked) => handleSettingChange('publicProfile', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="data-sharing">Data Sharing</Label>
                        <p className="text-xs text-muted-foreground">
                          Share anonymized trading data to improve our services
                        </p>
                      </div>
                      <Switch
                        id="data-sharing"
                        checked={settings.dataSharing}
                        onCheckedChange={(checked) => handleSettingChange('dataSharing', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

function ProfileField({ icon, label, value, isEditing, onChange }: ProfileFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium flex items-center gap-2">
        {icon} {label}
      </label>
      {isEditing ? (
        <Input 
          className="mt-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p className="text-sm mt-1">{value}</p>
      )}
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  className?: string;
}

function StatItem({ label, value, className = "" }: StatItemProps) {
  return (
    <div className="p-4 border rounded-md bg-card">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-lg font-bold ${className}`}>{value}</p>
    </div>
  );
}
