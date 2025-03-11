
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TradingProvider } from '@/contexts/TradingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function HelpPage() {
  return (
    <TradingProvider>
      <AppLayout>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Help & Support</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Trading Basics</CardTitle>
              <CardDescription>Learn about basic trading concepts</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is paper trading?</AccordionTrigger>
                  <AccordionContent>
                    Paper trading is a simulated trading process where you can practice buying and selling stocks without using real money. 
                    It's a risk-free way to test trading strategies and get familiar with how markets work.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>What is a market order?</AccordionTrigger>
                  <AccordionContent>
                    A market order is an instruction to buy or sell a stock immediately at the current market price. 
                    Market orders guarantee execution as long as the market is open and there are buyers and sellers, 
                    but do not guarantee the price.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>What is a limit order?</AccordionTrigger>
                  <AccordionContent>
                    A limit order is an instruction to buy or sell a stock at a specific price or better. 
                    A buy limit order will execute at the limit price or lower, while a sell limit order will execute at the limit price or higher. 
                    Limit orders give you price control but do not guarantee execution.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>What is P&L?</AccordionTrigger>
                  <AccordionContent>
                    P&L stands for Profit and Loss. It represents the total profit or loss from your investments. 
                    Unrealized P&L refers to gains or losses on positions that are still open (not sold yet), 
                    while realized P&L refers to gains or losses on positions that have been closed.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>What are trading hours in Indian markets?</AccordionTrigger>
                  <AccordionContent>
                    Indian stock markets (NSE and BSE) operate Monday to Friday from 9:15 AM to 3:30 PM IST, 
                    excluding market holidays. Pre-opening session runs from 9:00 AM to 9:15 AM IST.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Using TradeSimulate</CardTitle>
              <CardDescription>Learn how to use this application</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="app-1">
                  <AccordionTrigger>How do I buy or sell stocks?</AccordionTrigger>
                  <AccordionContent>
                    To buy or sell stocks:
                    <ol className="list-decimal pl-5 space-y-1 mt-2">
                      <li>Click on a stock card from the Market page or your Watchlist</li>
                      <li>In the dialog that opens, select the "Trade" tab</li>
                      <li>Choose "Buy" or "Sell" tab</li>
                      <li>Enter the quantity and select order type (Market or Limit)</li>
                      <li>If choosing a limit order, enter your desired price</li>
                      <li>Click the "Buy" or "Sell" button to place your order</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="app-2">
                  <AccordionTrigger>How do I add stocks to my watchlist?</AccordionTrigger>
                  <AccordionContent>
                    To add stocks to your watchlist, click the star icon on any stock card in the Market view. 
                    The star will turn yellow to indicate that the stock has been added to your watchlist. 
                    Click the star again to remove it from your watchlist.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="app-3">
                  <AccordionTrigger>How do I see my portfolio performance?</AccordionTrigger>
                  <AccordionContent>
                    Visit the Dashboard or Portfolio page to see your portfolio performance. 
                    The Dashboard shows key metrics like total value, available cash, invested value, and unrealized P&L. 
                    The Portfolio page provides detailed information about each stock in your portfolio, 
                    including quantity, average buy price, current price, value, and P&L.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="app-4">
                  <AccordionTrigger>Can I reset my portfolio?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can reset your portfolio to start fresh with the initial cash balance. 
                    Go to the Settings page and click the "Reset Portfolio" button. 
                    This will clear all your holdings and restore your cash to the initial amount.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </TradingProvider>
  );
}
