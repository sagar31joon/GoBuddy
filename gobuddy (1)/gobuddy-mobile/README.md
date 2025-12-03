# GoBuddy Mobile - React Native Expo App

A mobile version of the GoBuddy sports buddy-finding application built with React Native and Expo.

## Features

- 🔐 **Authentication**: OTP-based phone authentication
- 🗺️ **Map View**: Find nearby sports buddies with real-time location
- 📱 **Feed**: Browse and interact with sports activity posts
- 💬 **Chat**: Connect and message with other users
- 👤 **Profile**: Manage your profile, sports interests, and stats
- ✍️ **Create Posts**: Share your sports activities with location and payment options

## Tech Stack

- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **React Native Maps** for map functionality
- **Expo Location** for geolocation
- **AsyncStorage** for local data persistence
- **Expo Vector Icons** for UI icons

## Installation

1. **Install dependencies:**
   ```bash
   cd gobuddy-mobile
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Run on your device:**
   - **iOS**: Press `i` to open in iOS Simulator (Mac only)
   - **Android**: Press `a` to open in Android Emulator
   - **Physical Device**: Scan the QR code with Expo Go app

## Project Structure

```
gobuddy-mobile/
├── components/          # React Native components
│   ├── AuthScreen.tsx   # OTP authentication
│   ├── MapView.tsx      # Map with markers
│   ├── Feed.tsx         # Activity feed
│   ├── ChatWindow.tsx   # Chat interface
│   ├── CreatePostModal.tsx  # Create post form
│   └── Profile.tsx      # User profile
├── utils/
│   └── storage.ts       # AsyncStorage wrapper
├── types.ts             # TypeScript type definitions
├── constants.ts         # Mock data and constants
├── App.tsx              # Main app with navigation
└── package.json         # Dependencies

```

## Key Components

### AuthScreen
- OTP-based authentication flow
- Animated UI with slide-up effects
- Demo mode: Enter any 10-digit number

### MapView
- React Native Maps integration
- Custom markers for user posts
- Location-based filtering
- Real-time user location tracking

### Feed
- ScrollView with optimized post rendering
- Like, comment, and share functionality
- Expandable post content
- Metadata chips (location, date, price)

### ChatWindow
- Real-time messaging interface
- Typing indicators
- Auto-scroll to latest messages
- Simulated responses

### CreatePostModal
- Location toggle (live/manual)
- Date picker
- Payment options (free/paid/split bill)
- Form validation

### Profile
- Editable user information
- Stats display (matches, friends, rating)
- Sports interests management
- Recent activity feed

## Configuration

### Google Maps (Android)
Add your Google Maps API key in `app.json`:
```json
{
  "android": {
    "config": {
      "googleMaps": {
        "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
      }
    }
  }
}
```

### Permissions
The app requests the following permissions:
- **Location**: For finding nearby sports buddies
- **Camera** (future): For profile photos
- **Storage** (future): For saving images

## Features Comparison

| Feature | Web App | Mobile App |
|---------|---------|------------|
| Authentication | ✅ OTP | ✅ OTP |
| Map View | ✅ Leaflet | ✅ React Native Maps |
| Feed | ✅ | ✅ |
| Chat | ✅ | ✅ |
| Create Post | ✅ | ✅ |
| Profile | ✅ | ✅ |
| AI Enhancement | ✅ | ⏳ Coming Soon |
| Storage | localStorage | AsyncStorage |

## Development Notes

- **No AI Features**: The Google Generative AI package has dependency conflicts with React Native. AI features are planned for future updates.
- **Mock Data**: The app uses mock data from `constants.ts`. In production, this would be replaced with API calls.
- **Coordinates**: Map coordinates are converted from the web app's x/y system to latitude/longitude for React Native Maps.

## Testing

1. **Authentication Flow**:
   - Enter any 10-digit phone number
   - OTP is auto-filled as "1234"
   - Click "Verify & Login"

2. **Map View**:
   - Grant location permissions when prompted
   - View markers for nearby posts
   - Tap markers to see post details
   - Use filters to refine results

3. **Create Post**:
   - Tap the center "+" button
   - Fill in activity details
   - Toggle location options
   - Submit to see in feed/map

4. **Chat**:
   - Tap "Connect" on any post
   - Send messages in chat window
   - Receive simulated responses

## Building for Production

### iOS
```bash
npx expo build:ios
```

### Android
```bash
npx expo build:android
```

## Troubleshooting

**Map not showing:**
- Ensure location permissions are granted
- Check Google Maps API key (Android)
- Verify internet connection

**App crashes on startup:**
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**Location not working:**
- Check device location services are enabled
- Grant location permissions in app settings

## Future Enhancements

- [ ] Push notifications
- [ ] Real-time chat with WebSockets
- [ ] Image upload for posts and profile
- [ ] AI-powered post enhancement
- [ ] Payment integration
- [ ] Social features (follow, like, comment)
- [ ] Activity tracking and analytics

## License

MIT

## Support

For issues or questions, please contact support or create an issue in the repository.
