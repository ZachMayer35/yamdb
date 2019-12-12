import React from 'react';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';


const PhotoSearch = ({ handleSearch }) => {
  return (<Camera isImageMirror={false} idealFacingMode={FACING_MODES.ENVIRONMENT} style={{width: '100%', height: '100%', position: 'absolute'}} 
    onTakePhoto = { (image) => { handleSearch(image); } }
  />);
}

export default PhotoSearch;
