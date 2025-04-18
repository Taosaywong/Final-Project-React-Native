import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-ratings';
import ImageContainer from '../../Components/CustomImageContainer';
import CustomButton from '../../Components/CustomButton';
import { BASE_URL } from '@env'; 


const ReviewDetail = ({ route, navigation }) => {
  const { username, review_id } = route.params;
  const [data, setData] = useState({
    review: null,
    reviewText: '',
    rating: 3.0,
    product: null,
    productName: '',
    productImage: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/product-reviews/${review_id}/`);
        const reviewData = response.data;
        setData((prevState) => ({
          ...prevState,
          review: reviewData,
          reviewText: reviewData.review_text,
          rating: reviewData.rating,
          product: reviewData.product,
        }));

        // Fetch product data after review data
        if (reviewData.product) {
          const productResponse = await axios.get(`${BASE_URL}/api/products/products/${reviewData.product}/`);
          setData((prevState) => ({
            ...prevState,
            productName: productResponse.data.name,
            productImage: productResponse.data.image,
          }));
        }
      } catch (error) {
        console.error(error, `Failed to fetch review or product data for review id ${review_id}`);
      }
    };

    fetchReview();
  }, [review_id]);

  const handleUpdate = async () => {
    try {
      const authToken = await AsyncStorage.getItem('access_token');
      const response = await axios.patch(`${BASE_URL}/api/products/product-reviews/${review_id}/`, {
        review_text: data.reviewText,
        rating: data.rating,
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Review updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating review:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
    }
  };

  const handleDelete = async () => {
    try {
      const authToken = await AsyncStorage.getItem('access_token');
      const response = await axios.delete(`${BASE_URL}/api/products/product-reviews/${review_id}/`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.status === 204) {
        Alert.alert('Success', 'Review deleted successfully');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.productName}</Text>
      {data.productImage && (
        <View style={styles.imageContainermb}>
          <ImageContainer width={150} height={150} imgSrc={{ uri: data.productImage }} />
        </View>
      )}

      {isEditing ? (
        <>
          <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={4}
            placeholder="Edit your review"
            value={data.reviewText}
            onChangeText={(text) => setData({ ...data, reviewText: text })}
          />
          <View style={styles.ratingContainer}>
            <AirbnbRating
              count={5}
              defaultRating={data.rating}
              onFinishRating={(rating) => setData({ ...data, rating })}
              size={30}
              ratingContainerStyle={{ alignItems: 'flex-start' }}
            />
          </View>
          <CustomButton
            onPress={handleUpdate}
            style={{ marginTop: 20 }}
            width="100%"
            backgroundColor="#007bff"
            color="white"
            iconName="checkmark-outline"
          >
            <Text>Save</Text>
          </CustomButton>
          <CustomButton
            onPress={() => setIsEditing(false)}
            style={{ marginTop: 20 }}
            width="100%"
            backgroundColor="#6c757d"
            color="white"
            iconName="close-outline"
          >
            <Text>Cancel</Text>
          </CustomButton>
        </>
      ) : (
        <>
          <Text style={styles.reviewText}>{data.reviewText}</Text>
          <View style={styles.ratingContainer}>
            <AirbnbRating
              count={5}
              defaultRating={data.rating}
              isDisabled
              showRating={false}
              size={30}
              starContainerStyle={styles.starContainer}
            />
          </View>
          <CustomButton
            onPress={() => setIsEditing(true)}
            style={{ marginTop: 20 }}
            width="100%"
            backgroundColor="#007bff"
            color="white"
            iconName="pencil-outline"
          >
            <Text>Edit</Text>
          </CustomButton>
          <CustomButton
            onPress={handleDelete}
            style={{ marginTop: 20 }}
            width="100%"
            backgroundColor="#dc3545"
            color="white"
            iconName="trash-outline"
          >
            <Text>Delete</Text>
          </CustomButton>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    height: 200,
    textAlignVertical: 'top',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
  },
  ratingContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginVertical: 10,
  },
  imageContainermb: {
    marginBottom: 16,
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ReviewDetail;
