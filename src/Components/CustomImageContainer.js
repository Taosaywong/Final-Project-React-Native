import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const placeholderImage = { uri: 'https://via.placeholder.com/100' }; // Placeholder image URL

const ImageContainer = ({ width, height, imgSrc }) => {
  const source = imgSrc ? imgSrc : placeholderImage; // Use placeholder if no image source

  return (
    <View style={[styles.imageContainer, { width: width, height: height }]}>
      <Image source={source} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 6,
    overflow: 'hidden', // Ensures border radius is applied to the image
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensures the image covers the container
  },
});

export default ImageContainer;
