import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Picker } from "@react-native-picker/picker";
import { AirbnbRating } from 'react-native-ratings';
import { BASE_URL } from '@env'; 


const ProductReviewListing = ({ route, navigation }) => {
  const { productId, imageName } = route.params;
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let response;
        if (imageName && imageName.length !== 0) {
          const product_response = await axios.get(`${BASE_URL}/api/products/products/?image=${imageName}`);
          const product = product_response.data[0]
          const productId = product.id;

          console.log('Fetched Product ID', productId)
          response = await axios.get(`${BASE_URL}/api/products/products/${productId}/reviews/`);
        } else {
          response = await axios.get(`${BASE_URL}/api/products/products/${productId}/reviews/`);
        }
        setReviews(response.data);
        setFilteredReviews(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [productId, imageName]);

  const filterReviewsByRating = (rating) => {
    setSelectedRating(rating);
    if (rating === null) {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(review => review.rating === rating));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedRating}
        style={styles.picker}
        onValueChange={(itemValue) => filterReviewsByRating(itemValue)}
      >
        <Picker.Item label="All Ratings" value={null} />
        <Picker.Item label="5 Stars" value={5} />
        <Picker.Item label="4 Stars" value={4} />
        <Picker.Item label="3 Stars" value={3} />
        <Picker.Item label="2 Stars" value={2} />
        <Picker.Item label="1 Star" value={1} />
      </Picker>

      <FlatList
        data={filteredReviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.reviewText}>{item.review_text}</Text>
            <AirbnbRating
              defaultRating={item.rating}
              isDisabled
              showRating={false}
              size={20}
              starContainerStyle={styles.starContainer}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  reviewItem: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  reviewText: {
    fontSize: 18,
  },
  starContainer: {
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'black'
  }
});

export default ProductReviewListing;
