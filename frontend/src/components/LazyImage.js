// frontend/src/components/LazyImage.js
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const LazyImage = ({ src, alt, style, ...rest }) => {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      effect="blur"
      style={style}
      {...rest}
    />
  );
};

export default LazyImage;
