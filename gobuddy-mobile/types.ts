export enum Tab {
  PLAY = 'play',
  NEAR_ME = 'near_me',
  FEED = 'feed',
  PROFILE = 'profile'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  bio?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  sports?: { sport: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro' }[];
}

export interface Post {
  id: string;
  user: User;
  content: string;
  sport: string;
  date: string; // ISO date string
  locationType: 'live' | 'manual';
  locationName: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro' | 'All Levels';
  splitBill: boolean;
  likes: number;
  comments: number;
  coordinates?: { latitude: number; longitude: number }; // Changed for react-native-maps
  createdAt: string;
}

export interface CreatePostPayload {
  content: string;
  isLiveLocation: boolean;
  manualLocation: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  splitBill: boolean;
  date: string;
  sport: string;
}
