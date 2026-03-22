export const colors = {
  primary: '#1A237E',
  primaryLight: '#534bae',
  primaryDark: '#000051',
  accent: '#C5A028',
  accentLight: '#F9D54A',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
  divider: '#E0E0E0',
  error: '#D32F2F',
  bookmark: '#F9A825',
  cardShadow: 'rgba(0,0,0,0.1)',
};

export const fonts = {
  titleLarge: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
  },
  titleMedium: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  titleSmall: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.text,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    color: colors.textSecondary,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
