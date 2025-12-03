export enum Tab {
  NEAR_ME = 'near_me',
  FEED = 'feed',
  COACH = 'coach',
  PROFILE = 'profile'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  bio?: string;
  sports?: string[];
}

export interface Post {
  id: string;
  user: User;
  content: string;
  sport: string;
  date: string; // ISO date string
  locationType: 'live' | 'manual';
  locationName: string;
  splitBill: boolean;
  isPaid: boolean; // Paid event vs Free
  price?: number; // Amount in Rupees
  likes: number;
  comments: number;
  coordinates?: { latitude: number; longitude: number }; // Changed for react-native-maps
  createdAt: string;
}

export interface CreatePostPayload {
  content: string;
  isLiveLocation: boolean;
  manualLocation: string;
  splitBill: boolean;
  isPaid: boolean; // false = free, true = paid
  price?: number;
  date: string;
}
