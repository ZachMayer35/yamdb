import React from 'react';
import ReactDOM from 'react-dom';
import CardItemDetails from './index';

const priceLink = {
  price: '$3.03',
  uri: 'https://google.com'
};

const gathererCard = {
  id: '123',
  rulings: [
    { date: '1-1-2019', text: 'Some Ruling Text...'},
    { date: '1-1-2019', text: 'Some Ruling Text...'},
    { date: '1-1-2019', text: 'Some Ruling Text...'}
  ]
};

const cardImage = 'https://img.scryfall.com/cards/border_crop/front/c/7/c79036a1-2239-4d4f-8b58-6cf9ac4863fc.jpg';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CardItemDetails priceLink={priceLink} gathererCard={gathererCard} cardImage={cardImage} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
