/**
 * School App Brand Theme System
 * Central source of truth for all colors and design tokens
 * 
 * Brand Colors:
 * - Primary (Trust/Structure): #0B1F3A (Navy Blue)
 * - Accent (Action/Energy): #FF7A00 (Orange)
 * - Neutral (Clarity): #FFFFFF (White)
 */

import '@/global.css';

import { Platform } from 'react-native';

// Brand Colors - Primary Theme
export const BrandColors = {
  primary: '#0B1F3A',      // Navy Blue - Trust & Structure
  accent: '#FF7A00',       // Orange - Action & Energy
  white: '#FFFFFF',        // White - Clarity & Readability
  
  // Extended Palette
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#0B1F3A',
  
  // Neutral Grays
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#999999',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
} as const;

export const Colors = {
  light: {
    // Primary branding
    primary: BrandColors.primary,
    accent: BrandColors.accent,
    
    // UI Elements
    text: BrandColors.primary,
    background: BrandColors.white,
    backgroundElement: BrandColors.gray100,
    backgroundSelected: BrandColors.gray200,
    textSecondary: BrandColors.gray600,
    
    // Status
    success: BrandColors.success,
    error: BrandColors.error,
    warning: BrandColors.warning,
  },
  dark: {
    // Primary branding (adapted for dark mode)
    primary: '#E8F2FF',
    accent: BrandColors.accent,
    
    // UI Elements
    text: BrandColors.white,
    background: BrandColors.primary,
    backgroundElement: BrandColors.gray800,
    backgroundSelected: BrandColors.gray700,
    textSecondary: BrandColors.gray400,
    
    // Status
    success: '#4ADE80',
    error: '#FF5A5A',
    warning: BrandColors.warning,
  },
} as const;

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

// Additional spacing using brand system
export const BrandSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const Typography = {
  // Font Sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 16,
  body: 14,
  caption: 12,
  
  // Font Weights
  thin: '100',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
