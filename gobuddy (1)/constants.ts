import { Post, User } from './types';

export const MOCK_USER: User = {
  id: 'current-user',
  name: 'Sagar Sagar',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
  bio: 'Badminton enthusiast and weekend hiker. Always looking for a challenge!',
  sports: ['Badminton', 'Tennis', 'Hiking'],
};

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    user: {
      id: 'u1',
      name: 'Srinjoy Chatterjee',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150',
      isOnline: true,
    },
    content: 'Hi anyone applying for scholarship programs in bio or life science or anything related to bio. Plzz feel free to reach out we can help each other. Also looking for a tennis partner!',
    sport: 'Tennis',
    date: '2023-12-05T18:00:00',
    locationType: 'live',
    locationName: 'Central Park Courts',
    splitBill: true,
    isPaid: false,
    likes: 12,
    comments: 4,
    coordinates: { x: 50, y: 40 },
    createdAt: '1 day ago'
  },
  {
    id: '2',
    user: {
      id: 'u2',
      name: 'Ayesha Ijaz',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150',
    },
    content: 'Anyone here who did the research on DNA structure by utilizing AI? Looking to discuss over a game of Badminton.',
    sport: 'Badminton',
    date: '2023-12-06T10:00:00',
    locationType: 'manual',
    locationName: 'City Sports Complex',
    splitBill: false,
    isPaid: true,
    price: 500,
    likes: 1,
    comments: 0,
    coordinates: { x: 20, y: 70 },
    createdAt: '5 days ago'
  },
  {
    id: '3',
    user: {
      id: 'u3',
      name: 'Deepak Jaggupalli',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&h=150',
      isOnline: true,
    },
    content: 'Can anyone help me finishing my research on aiml? Also, looking for a gym buddy for early mornings.',
    sport: 'Gym',
    date: '2023-12-07T06:00:00',
    locationType: 'live',
    locationName: 'Gold\'s Gym',
    splitBill: true,
    isPaid: false,
    likes: 45,
    comments: 12,
    coordinates: { x: 80, y: 20 },
    createdAt: '6 days ago'
  },
  {
    id: '4',
    user: {
      id: 'u4',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150',
    },
    content: 'Looking for a goalie for our casual soccer match this Sunday! Free pizza afterwards.',
    sport: 'Soccer',
    date: '2023-12-10T14:00:00',
    locationType: 'manual',
    locationName: 'Riverside Park',
    splitBill: false,
    isPaid: false,
    likes: 8,
    comments: 2,
    coordinates: { x: 45, y: 55 },
    createdAt: '1 hour ago'
  }
];