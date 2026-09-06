# Future Pressroom AI — Mobile App

A cross-platform Arabic news application for **Future Pressroom AI**, built with React Native, Expo, and TypeScript.

The application delivers published news, reports, analysis, breaking headlines, category-based browsing, search, article sharing, and locally saved bookmarks through a responsive right-to-left interface.

## Features

- Latest published news and featured articles
- Breaking-news headline ticker
- News categories and dedicated category pages
- Arabic article search
- Full article reading experience
- Article summaries, key points, analysis, and source attribution
- Article sharing through native device options
- Local article bookmarks
- Light and dark themes
- Right-to-left Arabic interface
- Optimized Cloudinary image delivery
- Responsive layouts for Android and iOS
- Native application icon and splash screen

## Technology Stack

- React Native
- Expo
- Expo Router
- TypeScript
- Expo Image
- AsyncStorage
- React Native Render HTML
- EAS Build
- REST API integration

## Backend Integration

The application consumes the public REST API provided by the Future Pressroom AI platform.

Production services:

- Website: [futurepressroom.com](https://www.futurepressroom.com)
- API: `https://future-pressroom-ai-production.up.railway.app/api`

## Getting Started

### Requirements

- Node.js
- npm
- Expo CLI through `npx`
- Expo Go or a compatible development build

### Installation

```bash
git clone git@github.com:SHADO-VIP/future-pressroom-app.git
cd future-pressroom-app
npm install
```

### Environment Configuration

Create a `.env.local` file in the project root:

```env
EXPO_PUBLIC_API_URL=https://future-pressroom-ai-production.up.railway.app/api
EXPO_PUBLIC_SITE_URL=https://www.futurepressroom.com
```

The `.env.local` file is excluded from Git and must not contain private credentials.

### Start Development

```bash
npx expo start
```

### Quality Checks

```bash
npx tsc --noEmit
npx expo lint
```

## Production Build

Android production builds are generated through EAS Build:

```bash
npx eas-cli@latest build --platform android --profile production
```

The resulting Android App Bundle (`.aab`) can be uploaded to Google Play Console.

## Project Structure

```text
src/
├── app/          Application screens and routes
├── components/   Reusable interface components
├── constants/    Theme and design constants
├── hooks/        Shared React hooks
└── services/     API and local-storage services
```

## Current Status

- Android production build completed
- Google Play publishing preparation in progress
- iOS release preparation planned

## Related Project

The mobile application is part of the broader [Future Pressroom AI](https://github.com/SHADO-VIP/future-pressroom-ai) platform, an AI-powered newsroom workflow for collecting, verifying, editing, and publishing journalistic content.

## Author

**Shadia Sarhan**

Senior Political and Economic News Editor, Journalist, and AI Solutions Developer.

- [LinkedIn](https://www.linkedin.com/in/shadia-sarhan-36550823a/)
- [Portfolio](https://shado-portfolio.vercel.app/)
- [GitHub](https://github.com/SHADO-VIP)