import React, { useEffect, useState, useCallback } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CategorySection from "../../Components/Category";



const AdminProductListing = () => {
  const [data, setData] = useState({
    products: [],
    filteredProducts: [],
    categories: [],
    selectedCategory: null,
    searchQuery: ""
  });
  const navigation = useNavigation();

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products/products/`);
      setData(prevData => ({
        ...prevData,
        products: response.data,
        filteredProducts: response.data,
      }));
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const fetchAllProductCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products/categories/`);
      setData(prevData => ({
        ...prevData,
        categories: response.data,
      }));
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchAllProductCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAllProducts();
      fetchAllProductCategories();
    }, [])
  );

  const filterProducts = () => {
    let filteredProducts = data.products;
    if (data.searchQuery) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(data.searchQuery.toLowerCase())
      );
    }
    if (data.selectedCategory) {
      filteredProducts = filteredProducts.filter(product =>
        product.category_id === data.selectedCategory
      );
    }
    setData(prevData => ({
      ...prevData,
      filteredProducts,
    }));
  };

  useEffect(() => {
    filterProducts();
  }, [data.searchQuery, data.selectedCategory, data.products]);

  const handleCategoryFilter = (categoryId) => {
    if (data.selectedCategory === categoryId) {
      setData(prevData => ({ ...prevData, selectedCategory: null }));
    } else {
      setData(prevData => ({ ...prevData, selectedCategory: categoryId }));
    }
  };

  const handleInputChange = (value) => {
    setData(prevData => ({ ...prevData, searchQuery: value }));
  };

  const HandlefetchAdminProductDetails = (productId) => {
    navigation.navigate('AdminProductDetail', { productId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search products"
          value={data.searchQuery}
          onChangeText={handleInputChange}
        />
      </View>

      <CategorySection
        categories={data.categories}
        selectedCategory={data.selectedCategory}
        onSelectCategory={handleCategoryFilter}
      />

      <FlatList
        data={data.filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const categoryName = data.categories.find(category => category.id === item.category_id)?.name || 'N/A';

          return (
            <View style={styles.productItem}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <TouchableOpacity onPress={() => HandlefetchAdminProductDetails(item.id)}>
                  <Text numberOfLines={2} style={styles.productName}>{item.name} ({categoryName})</Text>
                </TouchableOpacity>
                <Text>Price: <Text style={styles.boldText}>RM{item.price}</Text></Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
  },
  searchBar: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    fontSize: 16,
    elevation: 2,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 16,
    elevation: 1,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007bff",
    flex: 1,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default AdminProductListing;
