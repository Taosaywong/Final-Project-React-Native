import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { AirbnbRating } from 'react-native-ratings';
import { Picker } from "@react-native-picker/picker";
import ImageContainer from '../../Components/CustomImageContainer';
import CustomButton from '../../Components/CustomButton'; // Import the CustomButton
import LinkText from '../../Components/LinkText';




const AddReviews = ({ route }) => {
  const { userId, authToken } = route.params;
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(3.0);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const Products_URL = `${BASE_URL}/api/products`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${Products_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error Fetching products', error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddReview = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/products/products/${selectedProduct}/reviews/`, {
        product: selectedProduct,
        user: userId,
        review_text: reviewText,
        rating: rating,
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          },
      }
    );
      if (response.status === 201) {
        Alert.alert('Success', 'Review added successfully');
      }
    } catch (error) {
      console.error('Error Adding Review:', error)
      console.error('Error Details:', error.response ? error.response.data : 'No response data');
    }
  };

  const handleProductChange = (productId) => {
    setSelectedProduct(productId);
    const product = products.find(p => p.id === productId);
    setProductImage(product?.image);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainermb}>
        <Picker
          selectedValue={selectedProduct}
          onValueChange={(itemValue) => handleProductChange(itemValue)}
          placeholder="Choose the product"
        >
          {products.map(product => (
            <Picker.Item label={product.name} value={product.id} key={product.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.imageContainermb}>
        <ImageContainer width={150} height={150} imgSrc={{ uri: productImage }} />
      </View>

      <TextInput
        style={styles.textInput}
        multiline={true}
        numberOfLines={4}
        placeholder="Write your review here"
        value={reviewText}
        onChangeText={setReviewText}
      />
      <View style={styles.ratingContainer}>
        <AirbnbRating
          count={5}
          defaultRating={rating}
          onFinishRating={(rating) => setRating(rating)}
          size={30}
          ratingContainerStyle={{ alignItems: 'flex-start' }}
        />
      </View>
      <View style={{ marginTop: 14 }}>
      <CustomButton
        onPress={handleAddReview}
        style={{ marginTop: 20 }}
        width="100%"
        backgroundColor="#007bff"
        color="white"
        iconName="checkmark-outline"
      >
        <Text>Submit Review</Text>
      </CustomButton>
      </View>
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
    elevation: 5, // For Android
    shadowColor: '#000', // For iOS
    shadowOffset: { width: 0, height: 2 }, // For iOS
    shadowOpacity: 0.25, // For iOS
    shadowRadius: 3.84, // For iOS
    backgroundColor: '#fff', // Ensure the background color is set
  },
  ratingContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginVertical: 10,
  },
  ratingContainerStyle: {
    alignItems: 'flex-start', // Align text to the left
    width: '100%',
  },
  ratingText: {
    alignSelf: 'flex-start', // Ensure text is aligned to the left
    marginBottom: 5,
  },
  starContainer: {
    alignSelf: 'flex-start',
  },
  imageContainermb: {
    marginBottom: 16,
  },
  pickerContainermb: {
    marginBottom: 16,
    borderColor: 'gray',
    borderWidth: 1, // Adding border width
    borderBottomWidth: 2, // Adding bottom border width
    borderBottomColor: 'gray', // Adding bottom border color
    borderRadius: 4, // Optional: Adding border radius for rounded corners
    padding: 8, // Optional: Adding padding for better visual
  },
});

export default AddReviews;
