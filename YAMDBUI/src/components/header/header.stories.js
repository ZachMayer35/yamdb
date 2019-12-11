import React from 'react';
import Header from './index';
import { ThemeProvider } from '@material-ui/styles';
import Theme from '../../theme';

export default {
  title: 'Header'
};

export const simple = () => (
  <ThemeProvider theme={Theme}>
    <Header />
  </ThemeProvider>
);
