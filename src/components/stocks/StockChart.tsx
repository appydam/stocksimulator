
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { Stock } from '@/data/stocks';
import { getColorForChange, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Layers, ZoomIn, ZoomOut, ChevronUp, ChevronDown, SlidersHorizontal, Maximize2 } from 'lucide-react';

interface StockChartProps {
  stock: Stock;
}

// Generate simulated historical data based on current price
const generateHistoricalData = (stock: Stock, days = 30, volatility = 0.02) => {
  const data = [];
  let price = stock.previousClose;
  let volume = stock.volume;
  
  // Generate data for the past X days
  for (let i = days; i >= 0; i--) {
    // Random volatility factor - higher for longer timeframes
    const dailyVolatility = volatility * (1 + Math.random() * 0.5);
    
    // Slightly bias the direction based on current trend
    const bias = stock.changePercent > 0 ? 0.55 : stock.changePercent < 0 ? 0.45 : 0.5;
    const direction = Math.random() > bias ? -1 : 1;
    
    // Calculate price change
    const change = price * dailyVolatility * direction;
    const newPrice = price + change;
    
    // Ensure price doesn't go below 0
    price = Math.max(newPrice, 0.01);
    
    // Generate OHLC data (simulated)
    const open = price * (1 + (Math.random() * 0.01 - 0.005));
    const high = Math.max(price, open) * (1 + Math.random() * 0.02);
    const low = Math.min(price, open) * (1 - Math.random() * 0.02);
    const close = price;
    
    // Generate volume with some correlation to price movement
    const volumeChange = Math.abs(change) / price; // Bigger price changes, more volume
    volume = Math.max(volume * (1 + volumeChange * direction * 2), 1000);
    
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formattedDate = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    
    data.push({
      date: formattedDate,
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      price: parseFloat(close.toFixed(2)),
      volume: Math.round(volume),
    });
  }
  
  // Make sure the last point matches current price
  if (data.length > 0) {
    data[data.length - 1].price = stock.currentPrice;
    data[data.length - 1].close = stock.currentPrice;
  }
  
  return data;
};

// Generate intraday data (last 24 hours in 30 min intervals)
const generateIntradayData = (stock: Stock) => {
  const data = [];
  let price = stock.open;
  let volume = stock.volume / 16; // Distribute daily volume across hours
  
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
    
    // Generate OHLC data
    const open = price * (1 + (Math.random() * 0.005 - 0.0025));
    const high = Math.max(price, open) * (1 + Math.random() * 0.008);
    const low = Math.min(price, open) * (1 - Math.random() * 0.008);
    const close = price;
    
    // Generate volume
    const volumeChange = Math.abs(change) / price;
    volume = Math.max(volume * (1 + volumeChange * direction), 100);
    
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Get date for today
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    
    data.push({
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      time: timeString,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      price: parseFloat(close.toFixed(2)),
      volume: Math.round(volume),
    });
  }
  
  // Make sure the last point matches current price
  if (data.length > 0) {
    data[data.length - 1].price = stock.currentPrice;
    data[data.length - 1].close = stock.currentPrice;
  }
  
  return data;
};

export function StockChart({ stock }: StockChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');
  const [chartType, setChartType] = useState<'line' | 'area' | 'candle'>('area');
  const [indicators, setIndicators] = useState<string[]>([]);
  const [showVolume, setShowVolume] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Based on selected timeframe, generate appropriate data
    let data: any[] = [];
    
    switch (timeframe) {
      case '1D':
        data = generateIntradayData(stock);
        break;
      case '1W':
        data = generateHistoricalData(stock, 7, 0.015);
        break;
      case '1M':
        data = generateHistoricalData(stock, 30, 0.02);
        break;
      case '3M':
        data = generateHistoricalData(stock, 90, 0.025);
        break;
      case '1Y':
        data = generateHistoricalData(stock, 365, 0.03);
        break;
      default:
        data = generateIntradayData(stock);
    }
    
    setChartData(data);
  }, [stock, timeframe]);
  
  // Determine chart color based on stock performance
  const chartColor = stock.changePercent >= 0 ? '#22c55e' : '#ef4444';
  const volumeColor = stock.changePercent >= 0 ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)';
  
  // Calculate min and max values for y-axis
  const priceMax = Math.max(...chartData.map(d => d.high || d.price)) * 1.005;
  const priceMin = Math.min(...chartData.map(d => d.low || d.price)) * 0.995;
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (chartRef.current?.requestFullscreen) {
        chartRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-background/90 border border-border p-2 rounded shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium">{data.date} {timeframe === '1D' ? data.time : ''}</p>
          <div className="space-y-1 mt-1">
            {chartType === 'candle' && (
              <>
                <p className="text-xs">O: <span className="font-medium">{formatCurrency(data.open)}</span></p>
                <p className="text-xs">H: <span className="font-medium">{formatCurrency(data.high)}</span></p>
                <p className="text-xs">L: <span className="font-medium">{formatCurrency(data.low)}</span></p>
                <p className="text-xs">C: <span className="font-medium">{formatCurrency(data.close)}</span></p>
              </>
            )}
            {chartType !== 'candle' && (
              <p className="text-xs">Price: <span className="font-medium">{formatCurrency(data.price)}</span></p>
            )}
            {showVolume && (
              <p className="text-xs">Vol: <span className="font-medium">{data.volume.toLocaleString()}</span></p>
            )}
          </div>
        </div>
      );
    }
  
    return null;
  };

  return (
    <Card className="bg-card/70 backdrop-blur-sm border border-border/50">
      <div ref={chartRef} className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background p-6' : ''}`}>
        <div className="flex justify-between items-center p-4 pb-0">
          <div>
            <h3 className="font-bold">{stock.symbol} Chart</h3>
            <p className="text-xs text-muted-foreground">{stock.name}</p>
          </div>
          
          <div className="flex space-x-2">
            <div className="flex bg-secondary rounded-md p-0.5">
              <Button 
                variant={chartType === 'line' ? 'default' : 'secondary'} 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={() => setChartType('line')}
              >
                Line
              </Button>
              <Button 
                variant={chartType === 'area' ? 'default' : 'secondary'} 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={() => setChartType('area')}
              >
                Area
              </Button>
              <Button 
                variant={chartType === 'candle' ? 'default' : 'secondary'} 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={() => setChartType('candle')}
              >
                Candle
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={() => setShowVolume(!showVolume)}
            >
              <Layers className="h-3.5 w-3.5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={toggleFullscreen}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center px-4 py-2">
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
          
          <div className="flex space-x-1 text-xs">
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
              Indicators
            </Button>
          </div>
        </div>
        
        <div className={`${isFullscreen ? 'h-[80vh]' : 'h-64'} p-1`}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
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
                domain={[priceMin, priceMax]}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => formatCurrency(value).replace('₹', '')}
                tickLine={false}
                axisLine={false}
                orientation="right"
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference line for previous close */}
              <ReferenceLine y={stock.previousClose} stroke="#888" strokeDasharray="3 3" />
              
              {/* Different chart types */}
              {chartType === 'line' && (
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={chartColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}
              
              {chartType === 'area' && (
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={chartColor}
                  fill={`${chartColor}20`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}
              
              {chartType === 'candle' && (
                <>
                  {/* Using line segments to simulate candles */}
                  <Line
                    type="monotone"
                    dataKey="high"
                    stroke={chartColor}
                    strokeWidth={1}
                    dot={false}
                    activeDot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="low"
                    stroke={chartColor}
                    strokeWidth={1}
                    dot={false}
                    activeDot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="open"
                    stroke={chartColor}
                    strokeWidth={2}
                    dot={false}
                    activeDot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke={chartColor}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </>
              )}
              
              {/* Volume bars at the bottom */}
              {showVolume && (
                <Area
                  type="monotone"
                  dataKey="volume"
                  fill={volumeColor}
                  stroke="none"
                  yAxisId={1}
                  name="Volume"
                  opacity={0.5}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
