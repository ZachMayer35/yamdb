import React from 'react';
import CardItemDetails from './index';
import { ThemeProvider, makeStyles } from '@material-ui/styles';
import Theme from '../../theme';
import { Card } from '@material-ui/core';

export default {
  title: 'Test Card Details',
};

const useStyles = makeStyles(theme => ({
  cardItem: {
    width: 375,
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(1)
  }
}));

const priceLink = {
  price: '$3.03',
  uri: 'https://google.com'
};

const gathererCard = {
  id: '123',
  rulings: [
    { date: '1-1-2019', text: 'Some Ruling Text...' },
    { date: '1-1-2019', text: 'Some Ruling Text...' },
    { date: '1-1-2019', text: 'Some Ruling Text...' }
  ]
};

const cardImage = 'https://img.scryfall.com/cards/border_crop/front/c/7/c79036a1-2239-4d4f-8b58-6cf9ac4863fc.jpg';

const TestCardItemDetails = () => {
  const classes = useStyles();
  return (
    <Card className={classes.cardItem}>
      <CardItemDetails priceLink={priceLink} gathererCard={gathererCard} cardImage={cardImage} />
    </Card>
  );
}

export const simple = () => (
  <ThemeProvider theme={Theme}>
    <TestCardItemDetails />
  </ThemeProvider>
);
