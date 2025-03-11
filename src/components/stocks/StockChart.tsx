
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Stock } from '@/data/stocks';
import { getColorForChange, formatCurrency } from '@/lib/utils';

interface StockChartProps {
  stock: Stock;
}

// Generate simulated historical data based on current price
const generateHistoricalData = (stock: Stock, days = 30) => {
  const data = [];
  let price = stock.previousClose;
  
  // Generate data for the past X days
  for (let i = days; i >= 0; i--) {
    // Random volatility factor
    const volatility = 0.01 + (Math.random() * 0.01); // 1-2% daily volatility
    
    // Random direction
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    // Calculate price change
    const change = price * volatility * direction;
    price = price + change;
    
    // Ensure price doesn't go below 0
    price = Math.max(price, 0.01);
    
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      price: Number(price.toFixed(2)),
    });
  }
  
  return data;
};

// Generate intraday data (last 24 hours in 30 min intervals)
const generateIntradayData = (stock: Stock) => {
  const data = [];
  let price = stock.open;
  
  // Generate data for 24 hours in 30 min intervals
  for (let i = 0; i < 48; i++) {
    // Higher volatility for intraday
    const volatility = 0.002 + (Math.random() * 0.003); // 0.2-0.5% per 30 min
    
    // Random direction but slightly biased toward stock.changePercent
    const bias = stock.changePercent > 0 ? 0.55 : stock.changePercent < 0 ? 0.45 : 0.5;
    const direction = Math.random() > bias ? -1 : 1;
    
    // Calculate price change
    const change = price * volatility * direction;
    price = price + change;
    
    // Ensure price doesn't go below 0
    price = Math.max(price, 0.01);
    
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    data.push({
      time: timeString,
      price: Number(price.toFixed(2)),
    });
  }
  
  // Make sure the last point matches current price
  data[data.length - 1].price = stock.currentPrice;
  
  return data;
};

export function StockChart({ stock }: StockChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');
  
  useEffect(() => {
    // Based on selected timeframe, generate appropriate data
    switch (timeframe) {
      case '1D':
        setChartData(generateIntradayData(stock));
        break;
      case '1W':
        setChartData(generateHistoricalData(stock, 7));
        break;
      case '1M':
        setChartData(generateHistoricalData(stock, 30));
        break;
      case '3M':
        setChartData(generateHistoricalData(stock, 90));
        break;
      case '1Y':
        setChartData(generateHistoricalData(stock, 365));
        break;
      default:
        setChartData(generateIntradayData(stock));
    }
  }, [stock, timeframe]);
  
  // Determine chart color based on stock performance
  const chartColor = getColorForChange(stock.changePercent).replace('text-', '');
  const actualColor = chartColor === 'text-green-500' ? '#22c55e' : 
                      chartColor === 'text-red-500' ? '#ef4444' : '#6b7280';
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded shadow-lg">
          <p className="text-sm">{timeframe === '1D' ? `Time: ${label}` : `Date: ${label}`}</p>
          <p className="text-sm font-semibold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold">{stock.symbol} Price Chart</h3>
          </div>
          <div className="flex space-x-1 text-xs">
            <button 
              className={`px-2 py-1 rounded ${timeframe === '1D' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              onClick={() => setTimeframe('1D')}
            >
              1D
            </button>
            <button 
              className={`px-2 py-1 rounded ${timeframe === '1W' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              onClick={() => setTimeframe('1W')}
            >
              1W
            </button>
            <button 
              className={`px-2 py-1 rounded ${timeframe === '1M' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              onClick={() => setTimeframe('1M')}
            >
              1M
            </button>
            <button 
              className={`px-2 py-1 rounded ${timeframe === '3M' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              onClick={() => setTimeframe('3M')}
            >
              3M
            </button>
            <button 
              className={`px-2 py-1 rounded ${timeframe === '1Y' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              onClick={() => setTimeframe('1Y')}
            >
              1Y
            </button>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey={timeframe === '1D' ? 'time' : 'date'} 
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => formatCurrency(value).replace('₹', '')}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={actualColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
