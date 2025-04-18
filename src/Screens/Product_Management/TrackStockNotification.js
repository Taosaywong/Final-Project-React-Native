import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import FlatListing from '../../Components/FlatList';
import CustomButton from '../../Components/CustomButton';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from '@env';

const baseURL = 'http://192.168.101.148:8000/api/products'; // Hostel Wifi IP Address

const branchbaseURL = `${BASE_URL}/api/branches`; // Corrected URL

function TrackStockNotification({ route, navigation }) {
  const { userId, role, branchId } = route.params;
  const [notifications, setNotifications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [productDetails, setProductDetails] = useState({});
  const [branchDetails, setBranchDetails] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Stock Notification List'
    });
  }, [navigation]);

  const FetchNotifications = async (status) => {
    try {
      let response;
      if (role === 'staff') {
        response = await axios.get(`${BASE_URL}/product-stock-notifications/?staff=${userId}&branch=${branchId}&status=${status}`);
      } else if (role === 'manager') {
        response = await axios.get(`${BASE_URL}/product-stock-notifications/?branch=${branchId}&status=${status}`);
      }
      const notifications = response.data.results;
      setNotifications(notifications);

      // Fetch product and branch details
      const productIds = notifications.map(n => n.product);
      const branchIds = notifications.map(n => n.branch);

      fetchProductDetails(productIds);
      fetchBranchDetails(branchIds);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchProductDetails = async (productIds) => {
    try {
      const response = await axios.get(`${BASE_URL}/products/?ids=${productIds.join(',')}`);
      const products = response.data.results.reduce((acc, product) => {
        acc[product.id] = product.name;
        return acc;
      }, {});
      setProductDetails(products);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const fetchBranchDetails = async (branchIds) => {
    try {
      const response = await axios.get(`${branchbaseURL}/?ids=${branchIds.join(',')}`);
      const branches = response.data.results.reduce((acc, branch) => {
        acc[branch.id] = branch.name;
        return acc;
      }, {});
      setBranchDetails(branches);
    } catch (error) {
      console.error('Error fetching branch details:', error);
    }
  };

  useEffect(() => {
    FetchNotifications(selectedStatus);
  }, [selectedStatus]);

  const handleMarkAsDone = async (id) => {
    try {
      await axios.post(`${BASE_URL}/product-stock-notifications/${id}/mark_as_done/`);
      Alert.alert('Success', 'Notification marked as done');
      FetchNotifications(selectedStatus);
    } catch (error) {
      console.log('Error marking notification as done', error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.notificationItem}>
        <Text style={styles.alignBottom}>Product: {productDetails[item.product]}</Text>
        <Text style={styles.alignBottom}>Branch: {branchDetails[item.branch]}</Text>
        <Text style={styles.alignBottom}>Message: {item.message}</Text>
        <Text style={styles.alignBottom}>Status: {item.status}</Text>
        {role === 'manager' && item.status === 'pending' && (
          <CustomButton style={styles.alignBottom} color={'white'} backgroundColor={'blue'} onPress={() => handleMarkAsDone(item.id)}>
            <Text>Mark as Done</Text>
          </CustomButton>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Select Status</Text>
      <Picker
        selectedValue={selectedStatus}
        onValueChange={(itemValue) => setSelectedStatus(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label='Pending' value='pending' />
        <Picker.Item label='Done' value='done' />
      </Picker>
      <FlatListing
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        itemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

export default TrackStockNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  picker: {
    marginVertical: 10,
  },
  notificationItem: {
    padding: 16,
    marginBottom: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  separator: {
    height: 10,
  },
  alignBottom: {
    marginBottom: 8,
  },
});
