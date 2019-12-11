import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, AppBar, Toolbar, Container } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  footer: {
    top: 'auto',
    bottom: 0,
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2)
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <AppBar position="fixed" color='primary' className={classes.footer}>
      <Toolbar disableGutters>
        <Container maxWidth="lg">
          <Grid container direction='row-reverse' wrap='wrap-reverse' alignItems='center' justify='space-between' >
            <Grid item >
              <Typography variant="subtitle1">All image assets Copyright Wizards of the Coast Inc. or the Artist where credited</Typography>
            </Grid>
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;