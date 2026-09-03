/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';
export const Colors = {
  light: {
    text: '#252A34',
    background: '#F6F3EC',
    backgroundElement: '#FFFEFA',
    backgroundSelected: '#EAD7AD',
    textSecondary: '#6D716F',
    primary: '#172033',
    accent: '#B88A35',
    accentDark: '#8F6826',
    border: '#DDD6C7',
    breaking: '#9B2C35',
  },
  dark: {
    text: '#F6F3EC',
    background: '#0E1524',
    backgroundElement: '#172033',
    backgroundSelected: '#3A321F',
    textSecondary: '#B8B2A7',
    primary: '#172033',
    accent: '#B88A35',
    accentDark: '#8F6826',
    border: '#384156',
    breaking: '#D65A65',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
