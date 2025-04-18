import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import CustomButton from '../../Components/CustomButton';
import { BASE_URL } from '@env'; 

const ScanProduct = ({ navigation }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to use this feature.');
      }
    })();
  }, []);

  const pickImage = async () => {
    console.log('pickImage called');
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('ImagePicker result:', result);

      if (!result.canceled) {
        const selectedImage = result.assets[0].uri;
        setImage(selectedImage);
        console.log('Image selected:', selectedImage);

        // Call the handleImageMatch function after picking the image
        handleImageMatch(selectedImage);
      } else {
        console.log('Image selection canceled');
      }
    } catch (error) {
      console.error('Error launching camera:', error);
    }
  };

  const handleImageMatch = async (image) => {
    if (!image) {
      Alert.alert('No Image Selected', 'Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    try {
      console.log('Sending image to server for matching');
      const response = await axios.post(`${BASE_URL}/api/products/match-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response from server:', response);

      const { image_name } = response.data;

      if (image_name) {
        Alert.alert('Product Found', `Product name: ${image_name}`);
        navigation.navigate('ProductReviews', { imageName: image_name });
      } else {
        Alert.alert('Product Not Found', 'Please try again');
        console.log('Image match failed: No matching product found');
      }
    } catch (error) {
      console.error('Error matching image:', error);
      console.log('Image match error details:', error.response ? error.response.data : error.message);
      Alert.alert('Network Error', 'There was an issue connecting to the server. Please try again.');
    }
  };

  return (
    <View>
      <CustomButton iconName="scan-outline" onPress={pickImage} color="white" backgroundColor="#007bff">
        Scan Product
      </CustomButton>
    </View>
  );
};

export default ScanProduct;
