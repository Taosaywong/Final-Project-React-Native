import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../../Components/CustomButton";
import Ionicons from '@expo/vector-icons/Ionicons';
import { BASE_URL } from '@env'; 


function CreateStockNotification({ route, navigation }) {
  const { branchId, userId, branchName } = route.params;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [productBranch, setProductBranch] = useState([]);

  // Change the Header Title
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Create Stock Notification'
    });
  }, [navigation]);

  // Fetch all products for a specific branch
  useEffect(() => {
    const fetchBranchProduct = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/product-branches/branch/${branchId}`);
        setProductBranch(response.data);
      } catch (error) {
        console.error(`Unable to Fetch the Branch Product from ${baseURL}/product-branches/branch/${branchId}`, error);
      }
    };
    fetchBranchProduct();
  }, [branchId]);

  // fetch all product branches detail for specific branch
  useEffect(() => {
    const fetchProductBranchDetail = async () => {
      try {
        const response = await axios.get(`${baseURL}/products/${productBranch.product_id}`)
        setSelectedProduct(response.data)
      } catch (error) {
        console.error(error, 'Failed to fetch selected product')
      }
    }
    fetchProductBranchDetail
  })




  const handleCreateNotification = async () => {
    if (!selectedProduct) {
      Alert.alert('Error', 'Please select a product.');
      return;
    }

    const payload = {
      product: selectedProduct.product.id,
      branch: branchId,
      staff: userId,
      message: `${selectedProduct.product.name} at ${branchName} has ${selectedProduct.stock}. Please restock the product.`,
      status: 'pending'
    };

    console.log('Payload:', payload);

    try {
      const response = await axios.post(`${baseURL}/product-stock-notifications/`, payload);
      Alert.alert('Success', 'Stock Notification added successfully', [
        {
          text: 'Ok', onPress: () => {
            // Reset state variables
            setSelectedProduct(null);
            setMessage('');
          }
        }
      ]);
    } catch (error) {
      console.error('Error creating notification:', error);
      console.error('Error response data:', error.response?.data);
      Alert.alert('Error', `Failed to create notification: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Select Branch Product</Text>
      <Picker
        selectedValue={selectedProduct}
        onValueChange={(itemValue) => setSelectedProduct(itemValue)}
      >
        {productBranch.map((map) => (
          <Picker.Item label={map.product.name} value={map} key={map.id} />
        ))}
      </Picker>
      <CustomButton backgroundColor={'blue'} width={350} color={'white'} onPress={handleCreateNotification}>
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={{ color: 'white', marginLeft: 5 }}>Create Notification</Text>
      </CustomButton>
    </View>
  );
}

export default CreateStockNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});
