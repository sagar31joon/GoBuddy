import { Post, User } from './types';

export const MOCK_USER: User = {
    id: 'current-user',
    name: 'Sagar Sagar',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
    bio: 'Badminton enthusiast and weekend hiker. Always looking for a challenge!',
    age: 24,
    gender: 'Male',
    sports: [
        { sport: 'Badminton', level: 'Advanced' },
        { sport: 'Tennis', level: 'Intermediate' },
        { sport: 'Hiking', level: 'Beginner' }
    ],
};

export const SPORTS_LIST = [
    'Badminton', 'Basketball', 'Boxing', 'Cricket', 'Cycling',
    'Football', 'Golf', 'Gym', 'Hiking', 'Hockey',
    'Running', 'Soccer', 'Swimming', 'Tennis', 'Volleyball',
    'Yoga', 'General'
];

export const SPORT_ICONS: Record<string, string> = {
    'Badminton': '🏸',
    'Basketball': '🏀',
    'Boxing': '🥊',
    'Cricket': '🏏',
    'Cycling': '🚴',
    'Football': '🏈',
    'Golf': '⛳',
    'Gym': '💪',
    'Hiking': '🥾',
    'Hockey': '🏑',
    'Running': '🏃',
    'Soccer': '⚽',
    'Swimming': '🏊',
    'Tennis': '🎾',
    'Volleyball': '🏐',
    'Yoga': '🧘',
    'General': '🏅',
};

// 10 Demo Users for "Available Now" (Map)
export const MOCK_POSTS: Post[] = [
    {
        id: '1',
        user: {
            id: 'u1',
            name: 'Srinjoy Chatterjee',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150',
            isOnline: true,
            age: 22,
            gender: 'Male',
            bio: 'Tennis enthusiast. Prefer early morning sessions to start the day right.',
            sports: [{ sport: 'Tennis', level: 'Intermediate' }, { sport: 'Badminton', level: 'Beginner' }]
        },
        content: 'Looking for an intermediate Tennis partner for a morning rally. Available 6 AM - 8 AM.',
        sport: 'Tennis',
        date: new Date().toISOString(), // Live now
        locationType: 'live',
        locationName: 'Central Park Courts',
        skillLevel: 'Intermediate',
        splitBill: true,
        likes: 12,
        comments: 4,
        coordinates: { latitude: 28.6139 + 0.01, longitude: 77.2090 + 0.01 },
        createdAt: '1 hour ago'
    },
    {
        id: '2',
        user: {
            id: 'u2',
            name: 'Ayesha Ijaz',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150',
            age: 26,
            gender: 'Female',
            bio: 'Badminton lover. Competitive but fun. Let\'s elevate our game!',
            sports: [{ sport: 'Badminton', level: 'Advanced' }, { sport: 'Yoga', level: 'Intermediate' }]
        },
        content: 'Badminton singles match? Advanced level preferred. Ready to play now!',
        sport: 'Badminton',
        date: new Date().toISOString(),
        locationType: 'live',
        locationName: 'City Sports Complex',
        skillLevel: 'Advanced',
        splitBill: false,
        likes: 1,
        comments: 0,
        coordinates: { latitude: 28.6139 - 0.02, longitude: 77.2090 + 0.015 },
        createdAt: '2 hours ago'
    },
    {
        id: '3',
        user: {
            id: 'u3',
            name: 'Deepak Jaggupalli',
            avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&h=150',
            isOnline: true,
            age: 29,
            gender: 'Male',
            bio: 'Dedicated to fitness. Gym is my second home. Need a spotter?',
            sports: [{ sport: 'Gym', level: 'Advanced' }, { sport: 'Boxing', level: 'Beginner' }]
        },
        content: 'Hitting the gym for chest day. Need a serious spotter for bench press.',
        sport: 'Gym',
        date: new Date().toISOString(),
        locationType: 'live',
        locationName: 'Gold\'s Gym',
        skillLevel: 'Advanced',
        splitBill: true,
        likes: 45,
        comments: 12,
        coordinates: { latitude: 28.6139 + 0.03, longitude: 77.2090 - 0.01 },
        createdAt: '3 hours ago'
    },
    {
        id: '4',
        user: {
            id: 'u4',
            name: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150',
            age: 24,
            gender: 'Female',
            bio: 'Passionate Soccer goalie. Always looking for a team to play with.',
            sports: [{ sport: 'Soccer', level: 'Pro' }, { sport: 'Running', level: 'Intermediate' }]
        },
        content: 'Our team needs a goalie for a friendly match this Sunday! Join us!',
        sport: 'Soccer',
        date: new Date().toISOString(),
        locationType: 'live',
        locationName: 'Riverside Park',
        skillLevel: 'Advanced',
        splitBill: false,
        likes: 8,
        comments: 2,
        coordinates: { latitude: 28.6139 - 0.01, longitude: 77.2090 - 0.02 },
        createdAt: '4 hours ago'
    },
    {
        id: '5',
        user: {
            id: 'u5',
            name: 'Rahul Verma',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150',
            age: 32,
            gender: 'Male',
            bio: 'Marathon runner. Love trail running and long distances.',
            sports: [{ sport: 'Running', level: 'Advanced' }, { sport: 'Cycling', level: 'Beginner' }]
        },
        content: 'Going for a 10k run this evening. Pace 5:00 min/km. Join me?',
        sport: 'Running',
        date: new Date().toISOString(),
        locationType: 'live',
        locationName: 'Lodi Gardens',
        skillLevel: 'Intermediate',
        splitBill: false,
        likes: 5,
        comments: 1,
        coordinates: { latitude: 28.6139 + 0.005, longitude: 77.2090 + 0.025 },
        createdAt: '30 mins ago'
    },
    {
        id: '6',
        user: {
            id: 'u6',
            name: 'Priya Singh',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150',
            age: 21,
            gender: 'Female',
            bio: 'Certified Yoga instructor. Mindfulness and strength.',
            sports: [{ sport: 'Yoga', level: 'Advanced' }, { sport: 'Gym', level: 'Intermediate' }]
        },
        content: 'Hosting a sunset Yoga session at the park. Open to all levels!',
        sport: 'Yoga',
        date: new Date().toISOString(),
        locationType: 'live',
        locationName: 'Community Center',
        skillLevel: 'All Levels',
        splitBill: true,
        likes: 20,
        comments: 5,
        coordinates: { latitude: 28.6139 - 0.03, longitude: 77.2090 - 0.005 },
        createdAt: '1 hour ago'
    },
    {
        id: '7',
        user: {
            id: 'u7',
            name: 'Mike Ross',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150',
            age: 27,
            gender: 'Male',
            bio: 'Avid Cyclist. Weekend rides are my therapy.',
            sports: [{ sport: 'Cycling', level: 'Intermediate' }, { sport: 'Swimming', level: 'Beginner' }]
        },
        content: 'Planning a 50km ride this Sunday morning. Looking for riding buddies.',
        sport: 'Cycling',
        date: new Date().toISOString(),
        locationType: 'live',
        locationName: 'Highway 1',
        skillLevel: 'Intermediate',
        splitBill: false,
        likes: 15,
        comments: 3,
        coordinates: { latitude: 28.6139 + 0.04, longitude: 77.2090 + 0.03 },
        createdAt: '5 hours ago'
    },
    {
        id: '8',
        user: {
            id: 'u8',
            name: 'Emily Blunt',
            avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&w=150&h=150',
            age: 25,
            gender: 'Female',
            bio: 'New to Cricket and eager to learn the basics.',
            sports: [{ sport: 'Cricket', level: 'Beginner' }]
        },
        content: 'Beginner looking for a Cricket coach or a friendly practice group.',
        sport: 'Cricket',
        date: new Date().toISOString(),
        locationType: 'live',
        locationName: 'Local Stadium',
        skillLevel: 'Beginner',
        splitBill: true,
        likes: 3,
        comments: 0,
        coordinates: { latitude: 28.6139 - 0.015, longitude: 77.2090 + 0.035 },
        createdAt: '2 hours ago'
    },
    {
        id: '9',
        user: {
            id: 'u9',
            name: 'David Beckham',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150',
            age: 35,
            gender: 'Male',
            bio: 'Football is passion. Play hard, play fair.',
            sports: [{ sport: 'Football', level: 'Pro' }, { sport: 'Golf', level: 'Intermediate' }]
        },
        content: 'Organizing a casual 5-a-side Football match. We need 2 more players.',
        sport: 'Football',
        date: new Date().toISOString(),
        locationType: 'live',
        locationName: 'Turf Ground',
        skillLevel: 'Pro',
        splitBill: true,
        likes: 100,
        comments: 20,
        coordinates: { latitude: 28.6139 + 0.02, longitude: 77.2090 - 0.03 },
        createdAt: '10 mins ago'
    },
    {
        id: '10',
        user: {
            id: 'u10',
            name: 'Jessica Jones',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150',
            age: 28,
            gender: 'Female',
            bio: 'Kickboxing and strength training. Let\'s sparring!',
            sports: [{ sport: 'Boxing', level: 'Advanced' }, { sport: 'Gym', level: 'Advanced' }]
        },
        content: 'Looking for a sparring partner for Boxing. Safety gear required.',
        sport: 'Boxing',
        date: new Date().toISOString(),
        locationType: 'live',
        locationName: 'Fight Club',
        skillLevel: 'Advanced',
        splitBill: false,
        likes: 7,
        comments: 2,
        coordinates: { latitude: 28.6139 - 0.025, longitude: 77.2090 - 0.015 },
        createdAt: '45 mins ago'
    }
];
