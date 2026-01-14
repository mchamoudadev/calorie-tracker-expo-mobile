# Colorie Tracker Mobile App

A React Native mobile application built with Expo for tracking calories and nutritional intake using AI-powered food recognition.

## 📱 Overview

Colorie Tracker is a comprehensive calorie tracking mobile app that allows users to:
- Capture photos of their meals
- Get instant AI-powered nutritional analysis
- Track daily calorie consumption against personal goals
- View detailed reports and analytics
- Monitor macronutrients (protein, carbs, fat)

## ✨ Features

### Authentication & Onboarding
- User registration and login
- Secure token storage using Expo Secure Store
- Onboarding flow for new users
- JWT-based authentication

### Food Tracking
- **AI-Powered Analysis**: Take photos of food and get instant nutritional data
- **Meal Categorization**: Organize entries by meal type (breakfast, lunch, dinner, snack)
- **Image Preview**: Review analyzed food before saving
- **Real-time Updates**: Instant sync with backend API

### Dashboard (Home)
- Daily calorie progress tracking
- Visual progress indicators
- Macro nutrient breakdown (protein, carbs, fat)
- Meal-by-meal breakdown
- Food entry list with images
- Pull-to-refresh functionality

### Reports
- **Daily Reports**: Current day's consumption and progress
- **Weekly Reports**: 7-day view with trends
- **Monthly Reports**: Full month analytics
- Macro nutrient percentages and visualizations

### Add Food
- Camera integration for food photos
- Image picker from gallery
- AI analysis with loading states
- Meal type selection
- Save or discard options

## 🏗️ Project Structure

```
mobile/
├── app/                    # Expo Router file-based routing
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── home/          # Home dashboard
│   │   ├── add/           # Add food screen
│   │   └── reports/       # Reports screen
│   ├── index.tsx          # Root redirect logic
│   ├── login.tsx          # Login screen
│   ├── register.tsx       # Registration screen
│   ├── onboarding.tsx     # Onboarding screen
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable components
│   └── FoodPreviewModal.tsx
├── constants/             # App constants
│   ├── config.ts         # API configuration
│   └── theme.ts          # Theme colors and styles
├── context/              # React Context providers
│   └── AuthContext.tsx   # Authentication context
├── hooks/                # Custom React hooks
│   ├── useFood.ts        # Food-related hooks
│   └── useReport.ts      # Report-related hooks
├── services/             # API services
│   └── api.ts            # Axios API client
└── assets/               # Images, icons, fonts
```

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Storage**: Expo Secure Store
- **Image Handling**: Expo Image Picker, Expo Image
- **Icons**: Expo Vector Icons (Ionicons)
- **Navigation**: Expo Router with Tab Navigation
- **Language**: TypeScript

## 📦 Installation

1. **Navigate to the mobile directory**
```bash
cd mobile
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**

Edit `constants/config.ts` to set your backend API URL:

```typescript
// Production
export const API_URL = "https://your-api-url.com/api";

// Local development (iOS Simulator)
// export const API_URL = "http://localhost:8000/api";

// Local development (Android Emulator)
// export const API_URL = "http://10.0.2.2:8000/api";

// Physical device (use your computer's local IP)
// export const API_URL = "http://192.168.1.X:8000/api";
```

4. **Start the development server**
```bash
npm start
```

5. **Run on your device**
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal
   - **Physical Device**: Scan the QR code with Expo Go app (iOS) or Camera app (Android)

## ⚙️ Configuration

### API Configuration

The app connects to the backend API. Configure the API URL in `constants/config.ts`:

```typescript
export const API_URL = "https://colorie-tracker.vercel.app/api";
```

### Environment Setup

For different environments, you can switch between:
- Production API (deployed backend)
- Local development (localhost)
- Android emulator (10.0.2.2)
- Physical device (local network IP)

## 📱 Screens & Navigation

### Authentication Flow
- **Index** (`app/index.tsx`): Root screen that redirects based on auth state
- **Login** (`app/login.tsx`): User login screen
- **Register** (`app/register.tsx`): User registration screen
- **Onboarding** (`app/onboarding.tsx`): First-time user onboarding

### Main App (Tabs)
- **Home** (`app/(tabs)/home/index.tsx`): Daily calorie tracking dashboard
- **Add** (`app/(tabs)/add/index.tsx`): Add food entry with camera/photo
- **Reports** (`app/(tabs)/reports/index.tsx`): Daily, weekly, and monthly reports

## 🔑 Key Features Implementation

### Authentication Context

The app uses `AuthContext` to manage authentication state:

```typescript
import { useAuth } from "@/context/AuthContext";

const { user, isAuthenticated, login, logout } = useAuth();
```

### Food Tracking Hooks

Custom hooks for food operations:

```typescript
import { useAnalyzeFood, useSaveFood, useFoodEntries } from "@/hooks/useFood";

// Analyze food image
const analyzeMutation = useAnalyzeFood();

// Save food entry
const saveMutation = useSaveFood();

// Get food entries
const { data: entries } = useFoodEntries(startDate, endDate);
```

### Report Hooks

Hooks for fetching reports:

```typescript
import { useDailyReport, useWeeklyReport, useMonthlyReport } from "@/hooks/useReport";

// Daily report
const { data: dailyReport } = useDailyReport("2026-01-13");

// Weekly report
const { data: weeklyReport } = useWeeklyReport();

// Monthly report
const { data: monthlyReport } = useMonthlyReport(2026, 1);
```

### API Service

The app uses a centralized API service (`services/api.ts`) with:
- Automatic token injection
- Error handling
- TypeScript interfaces
- Request/response interceptors

## 🎨 Styling & Theme

The app uses a centralized theme system in `constants/theme.ts`:

- Colors (primary, secondary, background, text, etc.)
- Spacing values
- Font sizes and weights
- Border radius values

## 🔐 Security

- **Token Storage**: JWT tokens stored securely using Expo Secure Store
- **Automatic Token Injection**: API client automatically adds tokens to requests
- **Protected Routes**: Navigation guards based on authentication state
- **Secure Image Upload**: Images uploaded to secure cloud storage (Cloudflare R2)

## 📊 State Management

The app uses React Query for server state management:
- Automatic caching
- Background refetching
- Optimistic updates
- Query invalidation on mutations

## 🚀 Development Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator/device
npm run ios        # Run on iOS simulator/device
npm run web        # Run on web browser
npm run lint       # Run ESLint
```

## 📱 Building for Production

### Using EAS Build

1. **Install EAS CLI** (if not already installed)
```bash
npm install -g eas-cli
```

2. **Login to Expo**
```bash
eas login
```

3. **Configure build**

The app includes `eas.json` with build configurations. Update it as needed.

4. **Build for iOS**
```bash
eas build --platform ios
```

5. **Build for Android**
```bash
eas build --platform android
```

### Local Builds

For development builds:

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

## 🐛 Troubleshooting

### API Connection Issues

**Problem**: App can't connect to backend API

**Solutions**:
- Verify API URL in `constants/config.ts`
- For iOS Simulator, use `http://localhost:8000/api`
- For Android Emulator, use `http://10.0.2.2:8000/api`
- For physical devices, use your computer's local IP address
- Ensure backend server is running
- Check network permissions

### Image Upload Issues

**Problem**: Images not uploading or analyzing

**Solutions**:
- Check camera/gallery permissions
- Verify backend API is accessible
- Ensure OpenAI API key is configured on backend
- Check Cloudflare R2 credentials on backend

### Authentication Issues

**Problem**: Login not working or tokens expiring

**Solutions**:
- Clear app data and re-login
- Check backend JWT configuration
- Verify token expiration settings
- Check Secure Store permissions

### Cache Issues

**Problem**: Stale data or not updating

**Solutions**:
- Clear Expo cache: `npx expo start -c`
- Pull to refresh on screens
- Check React Query cache settings
- Manually invalidate queries

## 📝 Code Structure

### File-Based Routing

The app uses Expo Router with file-based routing:
- `app/` directory contains all routes
- `(tabs)` creates tab navigation
- `_layout.tsx` files define layout structure

### Custom Hooks

Reusable hooks in `hooks/`:
- `useFood.ts`: Food entry operations
- `useReport.ts`: Report fetching

### API Client

Centralized API client in `services/api.ts`:
- Authentication endpoints
- Food tracking endpoints
- Report endpoints
- Automatic error handling

## 🔄 Data Flow

1. **User takes photo** → Image picker/camera
2. **Upload to backend** → API analyzes with OpenAI
3. **Display results** → User reviews analysis
4. **Save entry** → Stored in database
5. **Update dashboard** → React Query refetches data
6. **Show reports** → Calculated from saved entries

## 📚 Dependencies

Key dependencies:
- `expo`: Expo SDK
- `expo-router`: File-based routing
- `@tanstack/react-query`: Server state management
- `axios`: HTTP client
- `expo-secure-store`: Secure token storage
- `expo-image-picker`: Camera and gallery access
- `expo-image`: Optimized image component
- `@expo/vector-icons`: Icon library

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test on both iOS and Android
4. Submit a pull request

## 📄 License

ISC

## 🔗 Related Documentation

- [Backend README](../backend/README.md) - Backend API documentation
- [Root README](../README.md) - Project overview
- [Expo Documentation](https://docs.expo.dev/)
- [React Query Documentation](https://tanstack.com/query/latest)

---

Built with ❤️ using React Native, Expo, and TypeScript
