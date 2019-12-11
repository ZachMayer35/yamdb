import React from 'react';
import { CardContent, Button, makeStyles } from "@material-ui/core";
import { OpenInNew } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  cardImage: {
    maxWidth: '100%',
    marginTop: '1em'
  },
  buyButton: {
    backgroundColor: 'rgba(0, 128, 0)',
    '&:hover': {
      backgroundColor: 'rgba(0, 128, 0, 0.8)'
    }
  }
}));

const CardItemDetails = ({priceLink, gathererCard, cardImage}) => {
  const classes = useStyles();
  return (
    <CardContent>
      {priceLink.price && priceLink.uri &&
        <Button
          variant="contained"
          color="primary"
          className={classes.buyButton}
          endIcon={<OpenInNew />}
          onClick={() => { window.open(priceLink.uri) }}
        >
          {`${priceLink.price} on TCGPlayer`}
        </Button>
      }
      {priceLink.price && !priceLink.uri &&
        <h4>Price<span>: {priceLink.price}</span></h4>
      }
      {!priceLink.price &&
        <h4>Price<span> Not Available</span></h4>
      }
      {gathererCard && gathererCard.rulings && gathererCard.rulings.length > 0 &&
        <div>
          <h4>Rulings:</h4>
          <ul>
            {gathererCard.rulings.map((ruling, index) => (
              <li key={`${gathererCard.id}-ruling-${index}`}>{ruling.text}</li>
            ))}
          </ul>
        </div>
      }
      <img src={cardImage.split('?')[0]} alt='card' className={classes.cardImage} />
    </CardContent>
  );
}

export default CardItemDetails;