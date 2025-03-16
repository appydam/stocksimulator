
import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="text-muted-foreground">Welcome back to StockTrade</p>
          </div>
          <ClerkSignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                formFieldInput: 'bg-background border border-input',
                formFieldLabel: 'text-foreground',
                footer: 'text-sm text-muted-foreground'
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
