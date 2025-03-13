
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  email: string;
  joinDate: string;
  fullName: string;
  phone: string;
  address: string;
  profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    occupation: string;
    bio: string;
    avatarUrl?: string;
  };
  settings: {
    notifications: boolean;
    twoFactorAuth: boolean;
    darkMode: boolean;
    emailAlerts: boolean;
    smsAlerts: boolean;
    autoRenew: boolean;
    publicProfile: boolean;
    dataSharing: boolean;
  };
  accountInfo: {
    status: 'Active' | 'Inactive' | 'Suspended';
    subscription: string;
    memberSince: string;
    lastLogin: string;
    loginLocation: string;
  };
}

const initialState: UserState = {
  username: 'rahulsharma',
  email: 'rahul.sharma@example.com',
  joinDate: '2023-03-15',
  fullName: 'Rahul Sharma',
  phone: '+91 98765 43210',
  address: 'Mumbai, Maharashtra',
  profile: {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra',
    occupation: 'Software Engineer',
    bio: 'Passionate investor focused on long-term growth and value investing strategies.',
    avatarUrl: 'https://github.com/shadcn.png'
  },
  settings: {
    notifications: true,
    twoFactorAuth: false,
    darkMode: false,
    emailAlerts: true,
    smsAlerts: false,
    autoRenew: true,
    publicProfile: false,
    dataSharing: true
  },
  accountInfo: {
    status: 'Active',
    subscription: 'Premium Plan',
    memberSince: 'Mar 2023',
    lastLogin: 'Today, 10:45 AM',
    loginLocation: 'Mumbai, IN'
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserState['profile']>>) => {
      state.profile = { ...state.profile, ...action.payload };
      
      // Update top-level fields that match profile fields for consistency
      if (action.payload.name) state.fullName = action.payload.name;
      if (action.payload.email) state.email = action.payload.email;
      if (action.payload.phone) state.phone = action.payload.phone;
      if (action.payload.address) state.address = action.payload.address;
    },
    updateSettings: (state, action: PayloadAction<Partial<UserState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    updateAccountInfo: (state, action: PayloadAction<Partial<UserState['accountInfo']>>) => {
      state.accountInfo = { ...state.accountInfo, ...action.payload };
    },
    updateUserDetails: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    }
  }
});

export const { updateProfile, updateSettings, updateAccountInfo, updateUserDetails } = userSlice.actions;
export default userSlice.reducer;
