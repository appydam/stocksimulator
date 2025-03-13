
import React, { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatPercentage, formatNumber, getColorForChange } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, User, Mail, Phone, MapPin, Calendar, Settings, History, PieChart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export function ProfileDetails() {
  const { cash, holdings, transactions, stockData } = useAppSelector(state => state.trading);
  const { username, email, joinDate, fullName, phone, address } = useAppSelector(state => state.user);
  
  // Calculate portfolio metrics
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

  // Format dates
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (date: number | Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  // For demo purposes - calculate trading stats
  const tradingStats = {
    winRate: 68.5,
    avgHoldingPeriod: 14,
    totalTrades: transactions.length,
    avgReturn: pnlPercentage,
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-28 w-28">
                <AvatarImage src="/placeholder.svg" alt={username} />
                <AvatarFallback>{fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">{fullName}</h2>
                <p className="text-muted-foreground">{username}</p>
              </div>
              <Button variant="outline" size="sm">Edit Profile</Button>
            </div>
            
            <Separator orientation="vertical" className="hidden md:block" />
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-sm pl-6">{email}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Phone</span>
                  </div>
                  <p className="text-sm pl-6">{phone}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Address</span>
                  </div>
                  <p className="text-sm pl-6">{address}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Member Since</span>
                  </div>
                  <p className="text-sm pl-6">{formatDate(new Date(joinDate))}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Account Value</p>
                  <p className="text-lg font-semibold">{formatCurrency(totalValue)}</p>
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Available Cash</p>
                  <p className="text-lg font-semibold">{formatCurrency(cash)}</p>
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total P&L</p>
                  <p className={`text-lg font-semibold ${getColorForChange(pnlPercentage)}`}>
                    {formatCurrency(unrealizedPnL)}
                  </p>
                </div>
                
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Trades</p>
                  <p className="text-lg font-semibold">{tradingStats.totalTrades}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-card p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Portfolio Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(portfolioValue)}</p>
                    <p className={`text-sm flex items-center ${getColorForChange(pnlPercentage)}`}>
                      {pnlPercentage > 0 ? (
                        <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                      )}
                      {formatPercentage(pnlPercentage)}
                    </p>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Total Stocks</p>
                    <p className="text-2xl font-bold">{holdings.length}</p>
                    <p className="text-sm text-muted-foreground">Across {holdings.length} companies</p>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Invested Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(investedAmount)}</p>
                    <p className="text-sm text-muted-foreground">Initial investment</p>
                  </div>
                </div>
                
                {holdings.length > 0 ? (
                  <div className="relative w-full overflow-auto rounded-lg border">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="h-10 px-4 text-left align-middle font-medium">Stock</th>
                          <th className="h-10 px-4 text-right align-middle font-medium">Quantity</th>
                          <th className="h-10 px-4 text-right align-middle font-medium">Avg. Price</th>
                          <th className="h-10 px-4 text-right align-middle font-medium">Current</th>
                          <th className="h-10 px-4 text-right align-middle font-medium">Value</th>
                          <th className="h-10 px-4 text-right align-middle font-medium">P&L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {holdings.map(holding => {
                          const stock = stockData.find(s => s.id === holding.stockId);
                          if (!stock) return null;
                          
                          const currentValue = stock.currentPrice * holding.quantity;
                          const pnl = currentValue - holding.investedAmount;
                          const pnlPercent = (pnl / holding.investedAmount) * 100;
                          
                          return (
                            <tr key={holding.stockId} className="border-t">
                              <td className="px-4 py-2.5">{stock.symbol}</td>
                              <td className="px-4 py-2.5 text-right">{formatNumber(holding.quantity, 0)}</td>
                              <td className="px-4 py-2.5 text-right">{formatCurrency(holding.averageBuyPrice)}</td>
                              <td className="px-4 py-2.5 text-right">{formatCurrency(stock.currentPrice)}</td>
                              <td className="px-4 py-2.5 text-right">{formatCurrency(currentValue)}</td>
                              <td className={`px-4 py-2.5 text-right ${getColorForChange(pnlPercent)}`}>
                                <div className="flex items-center justify-end gap-1">
                                  {pnlPercent > 0 ? (
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                  ) : (
                                    <ArrowDownRight className="h-3.5 w-3.5" />
                                  )}
                                  {formatCurrency(pnl)} ({formatPercentage(pnlPercent)})
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">Your portfolio is empty</p>
                    <p className="text-sm text-muted-foreground mt-1">Start trading to build your portfolio</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="relative w-full overflow-auto rounded-lg border">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="h-10 px-4 text-left align-middle font-medium">Date & Time</th>
                        <th className="h-10 px-4 text-left align-middle font-medium">Stock</th>
                        <th className="h-10 px-4 text-center align-middle font-medium">Type</th>
                        <th className="h-10 px-4 text-right align-middle font-medium">Quantity</th>
                        <th className="h-10 px-4 text-right align-middle font-medium">Price</th>
                        <th className="h-10 px-4 text-right align-middle font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(transaction => (
                        <tr key={transaction.id} className="border-t">
                          <td className="px-4 py-2.5">{formatDateTime(transaction.timestamp)}</td>
                          <td className="px-4 py-2.5">{transaction.stockSymbol}</td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              transaction.type === 'BUY' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right">{transaction.quantity}</td>
                          <td className="px-4 py-2.5 text-right">{formatCurrency(transaction.price)}</td>
                          <td className="px-4 py-2.5 text-right">{formatCurrency(transaction.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">No transactions found</p>
                  <p className="text-sm text-muted-foreground mt-1">Your transaction history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <PieChart className="h-5 w-5 text-muted-foreground" />
                    <span className={`text-sm font-medium ${pnlPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(pnlPercentage)}
                    </span>
                  </div>
                  <p className="text-lg font-semibold mt-2">Total Return</p>
                  <p className="text-sm text-muted-foreground">All time</p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{tradingStats.winRate}%</span>
                  </div>
                  <p className="text-lg font-semibold mt-2">Win Rate</p>
                  <p className="text-sm text-muted-foreground">Profitable trades</p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <History className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{tradingStats.avgHoldingPeriod} days</span>
                  </div>
                  <p className="text-lg font-semibold mt-2">Avg. Holding</p>
                  <p className="text-sm text-muted-foreground">Time in position</p>
                </div>
                
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{tradingStats.totalTrades}</span>
                  </div>
                  <p className="text-lg font-semibold mt-2">Total Trades</p>
                  <p className="text-sm text-muted-foreground">Completed trades</p>
                </div>
              </div>
              
              <div className="text-center py-10 mb-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Performance chart will be available soon</p>
                <p className="text-sm text-muted-foreground mt-1">Track your trading performance over time</p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Recent Activity</h3>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-2">
                    {recentTransactions.map(transaction => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            transaction.type === 'BUY' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'BUY' ? (
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {transaction.type === 'BUY' ? 'Bought' : 'Sold'} {transaction.quantity} {transaction.stockSymbol}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateTime(transaction.timestamp)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-medium">
                          {transaction.type === 'BUY' ? '-' : '+'}{formatCurrency(transaction.total)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Notification Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Email Notifications</p>
                    <div className="h-4 w-8 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Price Alerts</p>
                    <div className="h-4 w-8 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Order Confirmations</p>
                    <div className="h-4 w-8 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Market Updates</p>
                    <div className="h-4 w-8 bg-muted rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Security Settings</h3>
                <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Change Password</p>
                      <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Not enabled</p>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Trading Preferences</h3>
                <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Default Order Type</p>
                      <p className="text-xs text-muted-foreground">Market Order</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Chart Preferences</p>
                      <p className="text-xs text-muted-foreground">Candlestick view</p>
                    </div>
                    <Button variant="outline" size="sm">Customize</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
