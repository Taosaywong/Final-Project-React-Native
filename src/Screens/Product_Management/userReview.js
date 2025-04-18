import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { AirbnbRating } from 'react-native-ratings';
import { Picker } from "@react-native-picker/picker";
import { BASE_URL } from '@env';


const UserReview = ({ route, navigation }) => {
  const { userName } = route.params;
  const isFocused = useIsFocused();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUserReviews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products/users/${userName}/reviews/`);
      setReviews(response.data);
      setFilteredReviews(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products/products/`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserReviews();
      fetchProducts();
    }
  }, [userName, isFocused]);

  const filterReviewsByRating = (rating) => {
    setSelectedRating(rating);
    let filtered = reviews;
    if (rating !== null) {
      filtered = filtered.filter(review => review.rating === rating);
    }
    if (searchQuery) {
      filtered = filtered.filter(review =>
        getProductName(review.product).toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.review_text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredReviews(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    let filtered = reviews;
    if (selectedRating !== null) {
      filtered = filtered.filter(review => review.rating === selectedRating);
    }
    filtered = filtered.filter(review =>
      getProductName(review.product).toLowerCase().includes(query.toLowerCase()) ||
      review.review_text.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredReviews(filtered);
  };

  const getProductName = (productId) => {
    const product = products.find(product => product.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const HandlefetchReviewDetail = (review_id, username) => {
    console.log(`username: ${username}, Review id: ${review_id}`);
    navigation.navigate('ReviewDetail', {
      username,
      review_id,
    })
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No reviews found for this user.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search reviews..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

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
            <TouchableOpacity onPress={() => HandlefetchReviewDetail(item.id, userName)} >
              <Text style={styles.productName}>{getProductName(item.product)}</Text>
            </TouchableOpacity>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewItem: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#007bff",
  },
  reviewText: {
    fontSize: 16,
  },
  starContainer: {
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingLeft: 10,
  },
});

export default UserReview;
