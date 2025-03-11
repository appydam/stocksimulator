
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function HelpPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Help & FAQs</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find answers to common questions about the trading platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is paper trading?</AccordionTrigger>
                <AccordionContent>
                  Paper trading is a simulated trading process where you can practice buying and selling stocks without using real money. 
                  It's a risk-free way to test your trading strategies and learn how the stock market works.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I buy stocks?</AccordionTrigger>
                <AccordionContent>
                  To buy stocks, navigate to the Market page and find the stock you want to purchase. Click on the stock card and select the "Trade" tab.
                  Enter the quantity you wish to buy and choose between a market order (executed immediately at current price) or a limit order (executed only when price reaches your specified limit).
                  Click "Place Buy Order" to complete your purchase.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>What's the difference between market and limit orders?</AccordionTrigger>
                <AccordionContent>
                  <p><strong>Market Order:</strong> Executes immediately at the current market price. Use this when you want to ensure your order is filled regardless of small price fluctuations.</p>
                  <p className="mt-2"><strong>Limit Order:</strong> Executes only when the stock reaches a specific price you set. For buy orders, it executes when the price falls to or below your limit. For sell orders, it executes when the price rises to or above your limit.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>How do I add stocks to my watchlist?</AccordionTrigger>
                <AccordionContent>
                  To add a stock to your watchlist, go to the Market page and click the star icon on any stock card. The star will turn yellow indicating it's been added to your watchlist.
                  You can view all your watchlisted stocks on the Watchlist page.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>How is my portfolio value calculated?</AccordionTrigger>
                <AccordionContent>
                  Your portfolio value is the sum of your available cash and the current market value of all your stock holdings.
                  The unrealized profit or loss (P&L) is calculated by comparing the current value of your holdings with your initial investment amount.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger>Can I reset my portfolio?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can reset your portfolio to the initial cash balance (₹10,00,000) by going to the Settings page and clicking the "Reset Portfolio" button.
                  This will clear all your holdings and transaction history, allowing you to start fresh.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger>Is this real money or real stock data?</AccordionTrigger>
                <AccordionContent>
                  No, this is a paper trading simulation. All money is virtual, and while the stock data is based on real Indian companies, the price movements are simulated and do not reflect real-time market conditions.
                  This platform is designed for learning and practice purposes only.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Need more help? Get in touch with our support team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>For any questions or issues not covered in our FAQs, please contact us at:</p>
            <p className="font-medium">support@papertrading.example.com</p>
            <p>Our support team is available Monday to Friday, 9:00 AM to 6:00 PM IST.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
