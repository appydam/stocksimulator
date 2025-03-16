
import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Shield, LineChart, BarChart3 } from 'lucide-react';

export default function Index() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero section */}
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link to="/" className="flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">StockTrade</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <SignedIn>
            <Link to="/market">
              <Button variant="ghost" className="text-md font-medium">Dashboard</Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" className="text-md font-medium">Profile</Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <Link to="/sign-in">
              <Button variant="ghost" className="text-md font-medium">Sign In</Button>
            </Link>
            <Link to="/sign-up">
              <Button variant="default" className="text-md font-medium">Sign Up</Button>
            </Link>
          </SignedOut>
        </nav>
      </header>
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Trade Smarter, Not Harder
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Your all-in-one platform for simplified stock trading and portfolio management.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <SignedOut>
                    <Link to="/sign-up">
                      <Button size="lg" className="inline-flex h-10 items-center justify-center">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link to="/market">
                      <Button size="lg" className="inline-flex h-10 items-center justify-center">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </SignedIn>
                </div>
              </div>
              <div className="hidden lg:block">
                <img
                  src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000&auto=format&fit=crop"
                  alt="Stock Trading Platform"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                  width={500}
                  height={310}
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need to trade like a pro
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform offers advanced features designed to help you make informed trading decisions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <BarChart3 className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Real-time Market Data</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Get up-to-the-minute price updates and market movements.
                </p>
              </div>
              <div className="grid gap-1">
                <LineChart className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Portfolio Tracking</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Monitor your investments and analyze performance over time.
                </p>
              </div>
              <div className="grid gap-1">
                <Shield className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Secure Trading</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Trade with confidence knowing your account is protected.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 StockTrade. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
