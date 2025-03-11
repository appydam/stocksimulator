
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function HelpPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Help & Documentation</h1>
        
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Learn the basics of using our trading platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="trading-basics">
                  <AccordionTrigger>Trading Basics</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>View real-time market data in the Market Overview section</li>
                      <li>Add stocks to your watchlist for quick access</li>
                      <li>Place market or limit orders to buy/sell stocks</li>
                      <li>Track your portfolio performance and order history</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="order-types">
                  <AccordionTrigger>Understanding Order Types</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Market Order:</strong> Buy/sell immediately at the current market price</li>
                      <li><strong>Limit Order:</strong> Set a specific price at which you want to buy/sell</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="portfolio">
                  <AccordionTrigger>Managing Your Portfolio</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Track your holdings and their current value</li>
                      <li>Monitor profit/loss for each position</li>
                      <li>View transaction history and order status</li>
                      <li>Reset portfolio if needed through Settings</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions and their answers</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="faq-1">
                  <AccordionTrigger>How do I place an order?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the Market section, find your desired stock, and click on it. You can then choose to buy or sell, select the quantity, and place either a market or limit order.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="faq-2">
                  <AccordionTrigger>How is my portfolio value calculated?</AccordionTrigger>
                  <AccordionContent>
                    Your portfolio value is the sum of your cash balance and the current market value of all your holdings. The profit/loss is calculated based on your average purchase price for each stock.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="faq-3">
                  <AccordionTrigger>Can I cancel a pending order?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can cancel any pending limit orders through the Orders page. Market orders are executed immediately and cannot be canceled.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
