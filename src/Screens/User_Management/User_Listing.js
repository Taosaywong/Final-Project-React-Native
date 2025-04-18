import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, Button, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CustomButton from '../../Components/CustomButton';
import { BASE_URL } from '@env'; 


const UserListing = () => {
  const [data, setData] = useState({
    userData: [],
    filteredData: [],
    selectedUser: null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigation = useNavigation();
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/users/`);
      const role_response = await axios.get(`${baseURL}/api/roles`);

      const userDataWithRoles = response.data.map(user => {
        const role = role_response.data.find(role => role.id === user.role);
        return { ...user, roleName: role ? role.name : 'Unknown' };
      });

      setData({
        userData: userDataWithRoles,
        filteredData: userDataWithRoles,
      });
      setRoleData(role_response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
    }, 30000); // Auto-refresh every 30 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  useEffect(() => {
    filterAndSearchUsers();
  }, [searchQuery, userRole, data.userData]);

  const filterAndSearchUsers = () => {
    let filteredUsers = data.userData;

    if (searchQuery) {
      filteredUsers = filteredUsers.filter(user =>
        user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (userRole) {
      filteredUsers = filteredUsers.filter(user => user.roleName === userRole);
    }

    setData({ ...data, filteredData: filteredUsers });
  };

  const navigateToUserDetail = (userId) => {
    navigation.navigate('UserDetail', { userId });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    Alert.alert('Error', error);
    return null;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Picker
        style={styles.picker}
        selectedValue={userRole}
        onValueChange={(itemValue) => setUserRole(itemValue)}
      >
        <Picker.Item label="Select Role" value="" />
        {roleData.map(role => (
          <Picker.Item key={role.id} label={role.name} value={role.name} />
        ))}
      </Picker>
      <FlatList
        data={data.filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity style={styles.userItem} onPress={() => navigateToUserDetail(item.id)}>
              <Text style={styles.userText}>{item.username} ({item.roleName})</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default UserListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
  },
  userText: {
    color: 'blue',
    fontSize: 18,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    borderColor: '#ccc',
    marginBottom: 30,
    padding: 10
  }
});
