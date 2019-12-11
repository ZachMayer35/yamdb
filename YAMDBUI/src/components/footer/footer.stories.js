import React from 'react';
import Footer from './index';
import { ThemeProvider } from '@material-ui/styles';
import Theme from '../../theme';

export default {
  title: 'Footer',
};

export const simple = () => (
  <ThemeProvider theme={Theme}>
    <Footer />
  </ThemeProvider>
);
