import React, { useEffect, useState } from 'react';
import { Grid, Container, Typography, Box, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Search, Camera } from '@material-ui/icons'
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import queryString from 'query-string';
import axios from 'axios';

import InfiniteScroll from 'react-infinite-scroll-component';

import { getCards, getNextPage } from '../../store/reducers/card/sagas';
import CardItem from '../../components/cardItem';
import PhotoSearch from '../../components/photoSearch';

const useStyles = makeStyles(theme => ({
  content: {
    marginBottom: 64,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%'
  },
}));

const CardList = function () {
  const dispatch = useDispatch();
  const cardStore = useSelector(store => store.card);
  const filter = useSelector(store => store.router.location.search);
  const cards = cardStore.cards;
  const classes = useStyles();
  const [search, setSearch] = useState(queryString.parse(window.location.search).name || '');
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState(false);
  const handleShowCamera = () => {
    setShowCamera(!showCamera);
  };
  /* eslint-enable react-hooks/exhaustive-deps */
  const getImageSearchName = async (image) => {
    try{
      const details = await axios.post(`${process.env.REACT_APP_YAMDB_SERVICE_URI || ''}/api/imageSearch`, image);
      return details.data;
    } catch(ex) {
      console.log(ex);
      return { error: ex.message };
    }
  }
  const handlePhotoSearch = async (image) => {
    const name = await getImageSearchName({ image });
    console.log(name);
    if(typeof name === 'string') {
      dispatch(push(`/?name=${name}`));
      setSearch(name);
      handleShowCamera();
      setError(false);
    } else {
      setError(`Couldn't quite read that, try again!`);
    }
  };
  // useEffect runs whenever values in the second argument change, and on initialization.
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const nextQuery = cardStore.currentQuery || cardStore.defaultQuery;
    dispatch(getCards({ ...nextQuery, filter }));
  }, [filter]);
  const fetchMoreData = () => {
    dispatch(getNextPage());
  };
  /* eslint-enable react-hooks/exhaustive-deps */
  const handleSearch = (event) => {
    if (filter !== `?name=${search}` && filter !== search) {
      dispatch(push(`/${search && search.length > 0 ? `?name=${search}` : ''}`));
    }
    if (event) {
      event.preventDefault();
    }
  };
  const handleSearchChange = (event) => {
    setSearch(event.target.value || '');
  };
  const getCardDetails = async (id) => {
    try{
      const details = await axios.get(`${process.env.REACT_APP_YAMDB_SERVICE_URI || ''}/api/cards/id/${id}`);
      return details.data;
    } catch(ex) {
      console.log(ex);
      return { error: ex.message };
    }
  };
  return (
    <Container maxWidth="lg" className={classes.content}>
      <Box my={4} >
        <Typography variant="h4" component="h1">
          Card Search
        </Typography>
        <Grid container alignItems="center" direction="column" >
        {showCamera && 
          <Grid item>
            <PhotoSearch handleSearch={handlePhotoSearch} />
          </Grid>
        }{error && 
          <Grid item>
            <Typography variant="caption" component="h1" style={{color: 'red'}}>{error}</Typography>
          </Grid>
        }
        </Grid>
        <Grid container alignItems="flex-end" direction="row" >
          <Grid item >
            <Search style={{ cursor: 'pointer' }} />
          </Grid>
          <Grid item xs={11}>
            <form className={classes.container} noValidate autoComplete="off" onSubmit={handleSearch}>
              <TextField
                label="Find Cards By Name..."
                style={{ margin: 8 }}
                type='search'
                value={search}
                className={classes.textField}
                margin="normal"
                onChange={handleSearchChange}
                onBlur={handleSearch}
              />
            </form>
          </Grid>
          <Grid item>
            <Camera style={{ cursor: 'pointer', marginLeft: '1em' }}  onClick={handleShowCamera}/>
          </Grid>
        </Grid>
        {cards.docs && cards.docs.length > 0 &&
            <InfiniteScroll
              style={{maxWidth: '100%'}}
              dataLength={cards.docs.length}
              next={fetchMoreData}
              hasMore={cards.docs.length <= cards.total - 1}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b></b>
                </p>
              }
            >
              <Box display="flex" maxWidth="lg" flexDirection='row' flexWrap='wrap' alignItems='flex-start'>
              {cards.docs.map((card, index) => (
                  <CardItem key={card.id} card={card} action={getCardDetails}  flexGrow='1' flexShrink='0'/>
              ))}
              </Box>
            </InfiniteScroll>}
      </Box>
    </Container>
  );
}

export default CardList;
