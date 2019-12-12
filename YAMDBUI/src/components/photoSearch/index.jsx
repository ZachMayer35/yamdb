import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import Camera from 'react-html5-camera-photo';
import axios from 'axios';
import 'react-html5-camera-photo/build/css/index.css';


const PhotoSearch = ({ handleSearch }) => {
  const dispatch = useDispatch();
  return (<Camera isImageMirror={false} style={{width: '100%', height: '100%', position: 'absolute'}} 
    onTakePhoto = { (image) => { handleSearch(image); } }
  />);
}

export default PhotoSearch;
