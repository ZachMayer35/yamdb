import React from 'react';
import reactStringReplace from 'react-string-replace';
import { Mana } from '@saeris/react-mana';
import uuidv1 from 'uuid/v1';

const tokenParser = (text) => {
  let tokens = [];
  const characters = [...text];
  let token = '';
  // tokens aren't nested, so we'll just run through the text and enumerate them.
  characters.forEach(c => {
    if (c === '{' || token === '{' || c === '}') {
      token += c;
    }
    if (token.length === 3) {
      tokens.push(token);
      token = '';
    }
  });
  return tokens;
};

const ManaText = ({ text }) => {
  const tokens = tokenParser(text);
  let replacedText = '';
  
  if (tokens.length > 0) {
    replacedText = reactStringReplace(text, tokens[0], (match, i) => (
      <Mana key={uuidv1()} symbol={match[1].toLowerCase()} />
    ));
    tokens.forEach((token, index) => {
      if (index > 0) {
        replacedText = reactStringReplace(replacedText, token, (match, i) => (
          <Mana key={uuidv1()} symbol={match[1].toLowerCase()} />
        ));
      }
    });
  }
  return (<span>{replacedText}</span>);
}

export default ManaText;