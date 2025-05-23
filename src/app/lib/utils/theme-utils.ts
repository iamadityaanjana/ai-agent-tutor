/**
 * UI Theme Helper Functions
 * These functions help maintain a consistent, modern and minimal UI
 */

// Color utilities - defines a minimal color palette
export const colors = {
  primary: '#2563eb', // blue-600
  background: '#0f172a', // slate-900
  foreground: '#f8fafc', // slate-50
  card: '#1e293b', // slate-800
  border: '#334155', // slate-700
  muted: '#94a3b8', // slate-400
  accent: '#3b82f6', // blue-500
};

// Typography scale - maintains consistent sizing
export const typography = {
  heading1: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter',
  heading2: 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight',
  heading3: 'text-2xl font-semibold',
  body: 'text-base md:text-lg',
  small: 'text-sm',
};

// Spacing system - consistent white space
export const spacing = {
  section: 'py-16 md:py-24 lg:py-32',
  container: 'px-4 sm:px-6 lg:px-8',
  stack: 'space-y-8',
  cluster: 'gap-6',
};

// Simplified shadow system - minimal shadow usage
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

// Border radiuses - consistent rounding
export const radius = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

// Helper function to combine TailwindCSS classes conditionally
export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
