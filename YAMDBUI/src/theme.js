import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#191919',
      contrastText: '#fff'
    },
    secondary: {
      main: '#2C2C2C',
      contrastText: '#fff'
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#2C2C2C',
      text: '#fff'
    },
    text: {
      primary: '#fff',
      secondary: '#898989',
      hint: '#898989'
    },
    cards: {
      black: {
        text: {
          primary: '#fff',
          secondary: '#898989'
        },
        icon: {
          primary: '#898989',
          secondary: '#191919',
          contrastText: '#fff'
        },
        background: "#191919"
      }
    }
  },
  overrides: {
    MuiInputLabel: {
      root: {
        '&$focused': {
          color: '#898989'
        }
      }
    },
    MuiInput: {
      underline: {
        '&:before': {
          borderBottomColor: '#898989'
        },
        '&:after': {
          borderBottomColor: '#898989'
        }
      }
    }
  }
});

export default theme;