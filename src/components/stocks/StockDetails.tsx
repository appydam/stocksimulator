
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Stock } from '@/data/stocks';
import { formatCurrency, formatNumber, formatPercentage, getColorForChange } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface StockDetailsProps {
  stock: Stock;
}

export function StockDetails({ stock }: StockDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-3xl font-bold">{formatCurrency(stock.currentPrice)}</div>
          <div className={`flex items-center ${getColorForChange(stock.changePercent)}`}>
            {stock.changePercent > 0 ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : stock.changePercent < 0 ? (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            ) : (
              <TrendingUp className="h-4 w-4 mr-1" />
            )}
            <span className="font-medium">
              {formatCurrency(stock.change)} ({formatPercentage(stock.changePercent)})
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DetailCard label="Open" value={formatCurrency(stock.open)} />
        <DetailCard label="Previous Close" value={formatCurrency(stock.previousClose)} />
        <DetailCard label="Day High" value={formatCurrency(stock.dayHigh)} />
        <DetailCard label="Day Low" value={formatCurrency(stock.dayLow)} />
        <DetailCard label="Volume" value={formatNumber(stock.volume, 0)} />
        <DetailCard label="Market Cap" value={formatCurrency(stock.marketCap)} />
        <DetailCard label="P/E Ratio" value={formatNumber(stock.pe, 2)} />
        <DetailCard label="Dividend Yield" value={formatPercentage(stock.dividendYield)} />
      </div>
    </div>
  );
}

interface DetailCardProps {
  label: string;
  value: string;
}

function DetailCard({ label, value }: DetailCardProps) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-md font-medium">{value}</div>
      </CardContent>
    </Card>
  );
}
