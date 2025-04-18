import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '@env'; 


const Branch_Listing = ({ route, navigation: nav }) => {
  const [data, setData] = useState({
    branchData: [],
    filteredData: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const fetchAllBranches = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/branches/`);
      setData({
        branchData: response.data,
        filteredData: response.data,
      });
    } catch (error) {
      console.error('Failed to fetch branch data', error);
    }
  };

  useEffect(() => {
    fetchAllBranches();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAllBranches();
    }, [])
  );

  useEffect(() => {
    filterBranches();
  }, [searchQuery, data.branchData]);

  const filterBranches = () => {
    let filteredBranches = data.branchData;

    if (searchQuery) {
      filteredBranches = filteredBranches.filter(branch =>
        branch.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setData({ ...data, filteredData: filteredBranches });
  };

  const navigateToBranchDetail = (branchId) => {
    navigation.navigate('BranchDetail', { branchId });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by branch name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={data.filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.branchItem} onPress={() => navigateToBranchDetail(item.id)}>
            <Text style={styles.branchName}>{item.name}</Text>
          </TouchableOpacity>
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  branchItem: {
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  branchName: {
    fontSize: 18,
    color: 'blue',
  },
});

export default Branch_Listing;
