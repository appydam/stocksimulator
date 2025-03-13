
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProfileDetails } from '@/components/profile/ProfileDetails';
import { TradingProvider } from '@/contexts/TradingContext';

export default function Profile() {
  return (
    <TradingProvider>
      <AppLayout>
        <ProfileDetails />
      </AppLayout>
    </TradingProvider>
  );
}
