// Theme constants that match Tailwind colors
export const colors = {
    // Primary Colors
    primary: '#F43F5E',         // rose-500
    primaryDark: '#E11D48',     // rose-600
    primaryLight: '#FB7185',    // rose-400
    
    // Accent Colors
    blue: '#3B82F6',            // blue-500
    blueDark: '#1E40AF',        // blue-800
    amber: '#F59E0B',           // amber-500
    amberDark: '#B45309',       // amber-700
    amberLight: '#D97706',      // amber-600
    emerald: '#10B981',         // emerald-500
    pink: '#EC4899',            // pink-500
    purple: '#8B5CF6',          // violet-500
    error: '#EF4444',           // red-500
    errorDark: '#DC2626',       // red-600
    
    // Background Colors
    background: '#FAFAF9',      // stone-50
    backgroundLight: '#F9FAFB', // gray-50
    surface: '#FFFFFF',         // white
    surfaceSecondary: '#F5F5F4',// stone-100
    
    // Light Tints (for icons/backgrounds)
    roseTint: '#FFE4E6',        // rose-100
    roseLight: '#FFF1F2',       // rose-50
    pinkTint: '#FCE7F3',        // pink-100
    blueTint: '#DBEAFE',        // blue-100
    blueLight: '#EFF6FF',       // blue-50
    amberTint: '#FED7AA',       // amber-200
    yellowLight: '#FFFBEB',     // yellow-50
    emeraldTint: '#D1FAE5',     // emerald-100
    
    // Text Colors
    text: '#1C1917',            // stone-900
    textDark: '#111827',        // gray-900
    textMedium: '#292524',      // stone-800
    textBody: '#44403C',        // stone-700
    textMuted: '#57534E',       // stone-600
    textSecondary: '#78716C',   // stone-500
    textTertiary: '#A8A29E',    // stone-400
    textGray: '#6B7280',        // gray-500
    textGrayDark: '#4B5563',    // gray-600
    textGrayMedium: '#374151',  // gray-700
    placeholder: '#9CA3AF',     // gray-400
    
    // Border Colors
    border: '#F5F5F4',          // stone-100
    borderLight: '#F3F4F6',     // gray-100
    borderMedium: '#E7E5E4',    // stone-200
    borderGray: '#E5E7EB',      // gray-200
    borderError: '#FEE2E2',     // red-100
    borderRose: '#FECDD3',      // rose-200
    borderBlue: '#DBEAFE',      // blue-100
    borderAmber: '#FEF3C7',     // amber-100
    
    // Special Colors
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
  };
  
  export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  };
  
  export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  };
  
  export const fontSize = {
    xs: 10,
    sm: 11,
    base: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    huge: 28,
    massive: 36,
  };
  
  export const fontWeight = {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: 'bold' as const,
  };
  
  export const tabBarTheme = {
    activeTintColor: colors.primary,
    inactiveTintColor: colors.textTertiary,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  };
  
  export const headerTheme = {
    backgroundColor: colors.primary,
    tintColor: colors.surface,
  };
  
  