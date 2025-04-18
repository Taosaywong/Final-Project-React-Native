import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from "@react-native-picker/picker";
import CustomButton from '../../Components/CustomButton';
import { BASE_URL } from '@env'; 


const AddProduct = ({ navigation }) => {
  const [data, setData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category_id: ''
  });
    const [isHovered, setIsHovered] = useState(false);

  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/categories/`);
        setCategoryData(response.data);
      } catch (error) {
        console.error('Failed to fetch the product', error);
      }
    };

    fetchCategoriesData();
  }, []);

  const handleInputChange = (name, value) => {
    setData({ ...data, [name]: value });
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
        quality: 1
      });

      if (!result.cancelled) {
        handleInputChange('image', result.assets[0].uri);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
      console.error('Image selection error:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('description', data.description);
      formData.append('category_id', data.category_id);

      const filename = data.image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('image', { uri: data.image, name: filename, type });

      await axios.post(`${BASE_URL}/api/products/products/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Alert.alert('Success', 'Product added successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding Product:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        Alert.alert('Error', `Failed to add product: ${JSON.stringify(error.response.data)}`);
      } else {
        Alert.alert('Error', 'An unknown error occurred while adding the product');
      }
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.label}>Product Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Product Name"
          value={data.name}
          onChangeText={(text) => handleInputChange("name", text)}
        />
        <Text style={styles.label}>Product Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Product Price"
          value={data.price}
          onChangeText={(text) => handleInputChange("price", parseFloat(text))}
        />

        <Text style={styles.label}>User Image:</Text>
        <TouchableOpacity
          style={styles.imagePicker}
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


        <Text style={styles.label}>Product Description</Text>
        <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Product Description"
                value={data.description}
                onChangeText={(text) => handleInputChange('description', text)}
                multiline
                numberOfLines={4}
            />

        <Text style={styles.label}>Category:</Text>
        <Picker
            style={styles.picker}
            selectedValue={data.category_id}
            onValueChange={(itemValue) => handleInputChange("category_id", itemValue)}
            >
            <Picker.Item label="Select Category" value="" />
                  {categoryData.map(categories => (
                    <Picker.Item label={categories.name} value={categories.id} key={categories.id} />
                  ))}
                </Picker>
        
        <CustomButton 
          iconName="add-outline" 
          iconSize={24}
          onPress={handleSubmit}
          color="white"
          backgroundColor="green"
        >
          Add Product
        </CustomButton>
      </ScrollView>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    scrollView: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    label: {
      marginBottom: 5,
      fontWeight: 'bold',
    },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
    },
    picker: {
      height: 50,
      marginBottom: 15,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
    },
    imagePicker: {
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
      backgroundColor: '#fff',
    },
    imagePickerText: {
      color: '#999',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 5,
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
    },
    textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  });

export default AddProduct;
