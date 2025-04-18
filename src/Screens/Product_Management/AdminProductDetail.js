import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, Alert, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL } from '@env'; 


const AdminProductDetail = ({ route }) => {
  const { productId } = route.params;
  const [isHovered, setIsHovered] = useState(false);
  const [data, setData] = useState({
    name: '',
    image: '',
    price: '',
    description: '',
    category_id: '',
  });
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSelectedProduct = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/products/${productId}`);
        const product = response.data;
        setData({
          name: product.name,
          image: product.image,
          price: product.price,
          description: product.description,
          category_id: product.category_id,
        });
      } catch (error) {
        console.error('Failed to Fetch Selected Product', error);
      }
    };
    fetchSelectedProduct();
  }, [productId]);

  const handleInputChange = (name, value) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('description', data.description);
      formData.append('category_id', data.category_id);

      if (data.image) {
        const filename = data.image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('image', { uri: data.image, name: filename, type });
      }

      const response = await axios.patch(`${BASE_URL}/api/products/products/${productId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product Updated', response.data);
      Alert.alert('Success', 'Product Edited Successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error Editing Product', error);
      Alert.alert('Failed', 'Product Edited Unsuccessfully');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${baseURL}/api/products/products/${productId}`);
      console.log('Product Deleted', response.data);
      Alert.alert('Success', 'Product Deleted Successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Failed', 'Unable to Delete the Product');
    }
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        handleInputChange('image', result.assets[0].uri);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
      console.error('Image selection error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={data.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />

      <Text style={styles.label}>Product Image</Text>
      <TouchableOpacity
        style={{ marginBottom: 10 }}
        onPress={selectImage}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {data.image ? (
          <Image source={{ uri: data.image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Select Image</Text>
        )}
        {isHovered && <Text style={styles.uploadText}>Upload Image</Text>}
      </TouchableOpacity>

      <Text style={styles.label}>Product Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Price"
        value={data.price.toString()}
        onChangeText={(text) => handleInputChange('price', parseFloat(text))}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Product Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Product Description"
        value={data.description}
        onChangeText={(text) => handleInputChange('description', text)}
        multiline
        numberOfLines={4}
      />

      <View style={styles.buttonContainer}>
        <Button title="Edit Product" onPress={handleEdit} />
        <Button title="Delete Product" onPress={handleDelete} color="red" />
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  uploadText: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    zIndex: 1,
    textDecorationLine: 'underline',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  imagePickerText: {
    color: '#27507F',
    textDecorationLine: 'underline',
  },
});

export default AdminProductDetail;
