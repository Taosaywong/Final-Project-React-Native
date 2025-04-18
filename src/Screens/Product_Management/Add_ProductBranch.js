import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios';
import { BASE_URL } from '@env'; 

function AddProductBranch({ route }) {
  const { userId, role, branchId, branchName } = route.params;
  const [stock, setStock] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products/`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddBranch = async () => {
    if (!selectedProduct) {
      Alert.alert('Error', 'Please select a product.');
      return;
    }

    try {
      const productDetailResponse = await axios.get(`${BASE_URL}/products/${selectedProduct.id}/`);
      const productDetail = productDetailResponse.data;

      console.log('Product Detail:', productDetail);  // Debugging statement to log product details

      const response = await axios.post(`${baseURL}/product-branches/`, {
        branch_id: branchId,  // Ensure branch ID is included
        product_id: selectedProduct.id,  // Send the product ID
        stock: stock,
        category_id: productDetail.category_id
      });
      console.log('Response:', response.data);
      Alert.alert('Success', 'Product branch added successfully.');
      // Reset the input fields
      setSelectedProduct(null);
      setStock('');
    } catch (error) {
      // Detailed error logging
      console.error('Error adding branch:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        Alert.alert('Error', `Failed to add product branch. Server response: ${JSON.stringify(error.response.data)}`);
      } else {
        Alert.alert('Error', `Failed to add product branch. Error message: ${error.message}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Branch Name: {branchName}</Text>
      <Text style={styles.label}>Product</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedProduct}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedProduct(itemValue)}
        >
          <Picker.Item label="Select a product" value={null} />
          {products.map((product) => (
            <Picker.Item key={product.id} label={product.name} value={product} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Stock</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter stock quantity"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />
      <Button title="Add Branch" onPress={handleAddBranch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  picker: {
    height: 60,
    width: '100%',
  },
});

export default AddProductBranch;
