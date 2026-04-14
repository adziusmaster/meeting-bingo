import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3b82f6' },
    secondary: { main: '#06b6d4' },
    background: { default: '#060d1f', paper: '#0d1a2e' },
    error: { main: '#f43f5e' },
    warning: { main: '#fbbf24' },
    success: { main: '#10b981' },
    text: { primary: '#f1f5f9', secondary: '#94a3b8' },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(ellipse at 20% 0%, #0d2247 0%, transparent 60%), ' +
            'radial-gradient(ellipse at 80% 100%, #0a1f3d 0%, transparent 60%), ' +
            'linear-gradient(160deg, #060d1f 0%, #0d1a35 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
          boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563eb, #0891b2)',
            boxShadow: '0 6px 24px rgba(59,130,246,0.45)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255,255,255,0.06)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(59,130,246,0.4)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(59,130,246,0.6)',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, minHeight: 40 },
      },
    },
  },
})
