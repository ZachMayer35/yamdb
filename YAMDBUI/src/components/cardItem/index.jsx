import React from 'react';
import { Card, CardContent, Typography, CardHeader, IconButton, CardMedia, CardActions, Collapse, makeStyles, CircularProgress } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Keyrune } from '@saeris/react-keyrune';
import clsx from 'clsx';
import CardItemDetails from '../cardItemDetails';
import ManaText from '../manaText';

const useStyles = makeStyles(theme => ({
  cardItem: {
    width: 375,
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(1)
  },
  cardArt: {
    height: 0,
    paddingTop: '100%'
  },
  icon: {
    color: theme.palette.primary.contrastText,
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  progress: {
    color: 'red',
    position: 'absolute',
    zIndex: 1,
  }
}));


const CardItem = ({ card, action }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [details, setDetails] = React.useState(false);
  const [priceLink, setPriceLink] = React.useState(false);
  const [gathererCard, setGathererCard] = React.useState(false);
  const [error, setError] = React.useState(false);
  const priceFormat = new Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' });
  const handleExpandClick = async () => {
    if (!expanded && !details) {
      setLoading(true);
      let actionResponse = await action(card.id);
      if (actionResponse.error) {
        setError(actionResponse);
      } else {
        setError(false);
        setDetails(actionResponse);
        setPriceLink({
          price: actionResponse.prices && (actionResponse.prices.usd || actionResponse.prices.usd_foil) ? priceFormat.format(actionResponse.prices.usd || actionResponse.prices.usd_foil) : null,
          uri: actionResponse.purchase_uris && actionResponse.purchase_uris.tcgplayer ? actionResponse.purchase_uris.tcgplayer : null
        });
        setGathererCard(actionResponse.gathererCards.length === 1 ? actionResponse.gathererCards[0] : actionResponse.gathererCards.find(c => actionResponse.multiverse_ids.indexOf(c.multiverseid) > 0 || actionResponse.set.toLowerCase() === c.set.toLowerCase()));
      }
      setLoading(false);
    }
    setExpanded(!expanded);
  };
  return (
    <Card className={classes.cardItem}>
      <CardHeader
        className={classes.header}
        avatar={
          <Keyrune set={card.set} rarity={card.rarity} size="2x" />
        }
        action={
          <ManaText text={card.mana_cost} />
        }
        title={card.name}
        subheader={card.flavor_text}
      />
      <CardMedia
        className={classes.cardArt}
        image={card.image_uris ? card.image_uris.art_crop : '/logo512.png'}
        title={`Artist: ${card.artist}`}
      />
      <CardContent>
        {card.power && card.toughness &&
          <ManaText text={`{${card.power}}/{${card.toughness}}`} />
        }
        <Typography variant="body2" color="textSecondary" component="p">
          {card.oracle_text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing style={{ flexDirection: 'row-reverse' }}>
        <IconButton
          className={clsx(classes.icon, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          style={{ marginRight: '.5rem', marginBottom: '.5rem' }}
        >
          <ExpandMore />
          {loading && <CircularProgress size={68} className={classes.progress} />}
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {!loading && !error &&
          <CardItemDetails priceLink={priceLink} gathererCard={gathererCard} cardImage={card.image_uris && card.image_uris.border_crop} />
        }
        {error &&
          <CardContent>
            <span>Error loading card details...</span>
          </CardContent>
        }
      </Collapse>
    </Card>
  );
};

export default CardItem;