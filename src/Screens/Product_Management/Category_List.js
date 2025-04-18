import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, FlatList, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { useFocusEffect } from '@react-navigation/native';


const CategoryList = ({ navigation }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [search, setSearch] = useState('');

  const fetchAllCategory = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products/categories/`);
      setCategoryData(response.data);
    } catch (error) {
      console.error('Failed to fetch the category data from backend', error);
    }
  };

  useEffect(() => {
    fetchAllCategory();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAllCategory();
    }, [])
  );

  const handleSearch = (text) => {
    setSearch(text);
  };

  const handleFetchCategoryDetail = (categoryId) => {
    navigation.navigate('CategoryDetail', { categoryId });
  };

  const filteredCategories = categoryData.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search categories"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Image source={{ uri: item.image }} style={styles.categoryImage} />
            <TouchableOpacity onPress={() => handleFetchCategoryDetail(item.id)}>
              <Text style={[styles.categoryName, styles.textUnderline]}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No categories found.</Text>
        }
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
  searchContainer: {
    marginBottom: 20,
    width: '100%',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  categoryName: {
    fontSize: 18,
    flexShrink: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  textUnderline: {
    textDecorationLine: 'underline',
  },
});

export default CategoryList;
