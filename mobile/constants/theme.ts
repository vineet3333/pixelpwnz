// Design System tokens from design.md
// DO NOT use hardcoded hex values in components. Always use these tokens.

export const Colors = {
  // Dark Theme (Default)
  bg: '#0A0A0A',
  surface: '#151515',
  surfaceElevated: '#1F1F1F',
  border: '#2C2C2C',
  primarySolid: '#8B5CF6',
  primaryLight: '#38BDF8',
  text: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#52525B',
  success: '#34D399',
  error: '#F87171',

  // Light Theme (Alternative)
  light: {
    bg: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceElevated: '#F4F4F5',
    border: '#E4E4E7',
    text: '#18181B',
    textSecondary: '#71717A',
  },
} as const;

// Primary Gradient: #8B5CF6 → #38BDF8
export const Gradients = {
  primary: ['#8B5CF6', '#38BDF8'] as const,
  primaryStart: { x: 0, y: 0 },
  primaryEnd: { x: 1, y: 1 },
} as const;

// Spacing based on 8px grid
// Sequence: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

// Typography - Uses system fonts (SF Pro on iOS, Roboto on Android)
export const Typography = {
  h1: { fontSize: 40, lineHeight: 48, fontWeight: '700' as const },
  h2: { fontSize: 24, lineHeight: 31, fontWeight: '600' as const },
  h3: { fontSize: 18, lineHeight: 25, fontWeight: '600' as const },
  bodyLarge: { fontSize: 16, lineHeight: 26, fontWeight: '400' as const },
  body: { fontSize: 14, lineHeight: 22, fontWeight: '400' as const },
  small: { fontSize: 12, lineHeight: 18, fontWeight: '500' as const },
} as const;

// Border Radii
export const Radii = {
  card: 16,
  button: 9999, // Fully pill
  bubble: 20,
  input: 32, // Pill input
  sm: 8,
  md: 12,
} as const;

// Touch target minimum (Apple HIG)
export const MIN_TOUCH_TARGET = 44;
