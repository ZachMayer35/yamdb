import React from 'react';
import ReactDOM from 'react-dom';
import CardItem from './index';

const testCard = {
  id: '123',
  set: 'akh',
  rarity: 'mythic',
  power: '1',
  toughness: '1',
  mana_cost: '{X}{U}{G}',
  name: 'Nissa, Steward of Elements',
  artist: 'Howard Lyon',
  flavor_text: 'Flavor Text',
  oracle_text: `+2: Scry 2. 0: Look at the top card of your library. If it's a land card or a creature card with converted mana cost less than or equal to the number of loyalty counters on Nissa, Steward of Elements, you may put that card onto the battlefield. −6: Untap up to two target lands you control. They become 5/5 Elemental creatures with flying and haste until end of turn. They're still lands.`,
  image_uris: {
    art_crop: 'https://img.scryfall.com/cards/art_crop/front/c/7/c79036a1-2239-4d4f-8b58-6cf9ac4863fc.jpg',
    border_crop: 'https://img.scryfall.com/cards/border_crop/front/c/7/c79036a1-2239-4d4f-8b58-6cf9ac4863fc.jpg'
  }
};

const testAction = () => true;

// this module imports sass and uses it in an unsafe way - so we'll mock it.
jest.mock('@saeris/react-keyrune', () => ({
  Keyrune: ({set, rarity}) => <span>{set}{rarity}</span>
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CardItem card={testCard} action={testAction} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
