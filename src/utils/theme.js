// Import packages
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    // primary: {
    //   main: '#526a82',
    // },
    // secondary: {
    //   main: '#e7edf5',
    // },
    new: {
      main: '#AED6F1',
      bg: '#DCEDF9'
    },
    edit: {
      main: '#D7BDE2',
      bg: '#E3DAF0'
    },
    search: {
      main: '#ABEBC6',
      bg: '#D5F5E3'
    },
    reports: {
      main: '#F9E79F',
      bg: '#FCF3CF'
    },
    subtext: {
      main: '#636b70'
    },
    background: {
      default: '#e7edf5',
      paper: '#ffffff',
    },
  },
  typography: {
    // fontSize: 12,
  }
})
