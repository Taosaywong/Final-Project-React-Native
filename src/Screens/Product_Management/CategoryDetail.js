import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Button, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';


const CategoryDetail = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const [isHovered, setIsHovered] = useState(false);
  const [categoryData, setCategoryData] = useState({
    name: '',
    image: '',
  });
  const [allCategory, setCategory] = useState([]);

  useEffect(() => {
    const fetchSelectCategory = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/categories/${categoryId}`);
        const category = response.data;
        setCategoryData({
          name: category.name,
          image: category.image,
        });
      } catch (error) {
        console.error('Failed to Fetch Selected Product', error);
      }
    };

    const fetchAllCategory = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/products/categories/`);
        const categories = response.data;
        setCategory(categories);
      } catch (error) {
        console.error('Failed to Fetch All Categories', error);
      }
    };

    fetchSelectCategory();
    fetchAllCategory();
  }, [categoryId]);

  const handleInputChange = (name, value) => {
    setCategoryData({ ...categoryData, [name]: value });
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
        handleInputChange('image', result.uri);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
      console.error('Image selection error:', error);
    }
  };

  const handleEdit = async () => {
    try {
      // Check if the category name already exists
      if (allCategory.find((category) => category.name === categoryData.name)) {
        alert('Category already exists');
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('name', categoryData.name);

      // If there's an image, add it to the form data
      if (categoryData.image) {
        const filename = categoryData.image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('image', { uri: categoryData.image, name: filename, type });
      }

      // Send patch request to update the category
      const response = await axios.patch(`${baseURL}/api/products/categories/${categoryId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Category Updated', response.data);
      Alert.alert('Success', 'Category Edited Successfully');
      navigation.goBack();

    } catch (error) {
      console.error('Error Editing Category', error);
      Alert.alert('Failed', 'Category Edited Unsuccessfully');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${baseURL}/api/products/categories/${categoryId}/`);
      console.log('Category Deleted', response.data);
      Alert.alert('Success', 'Category Deleted Successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Failed', 'Unable to Delete the Category');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={categoryData.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />

      <Text style={styles.label}>Category Image</Text>
      <TouchableOpacity
        style={{ marginBottom: 10 }}
        onPress={selectImage}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {categoryData.image ? (
          <Image source={{ uri: categoryData.image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Select Image</Text>
        )}
        {isHovered && <Text style={styles.uploadText}>Upload Image</Text>}
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Button title="Edit Category" onPress={handleEdit} />
        <Button title="Delete Category" onPress={handleDelete} color="red" />
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

export default CategoryDetail;
