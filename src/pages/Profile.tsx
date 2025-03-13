
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProfileDetails } from '@/components/profile/ProfileDetails';

export default function Profile() {
  return (
    <AppLayout>
      <ProfileDetails />
    </AppLayout>
  );
}
