import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Linking
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Footer from "../../Components/Footer";
import { Picker } from "@react-native-picker/picker";
import axios from 'axios';
import CategorySection from "../../Components/Category";
import ScanProduct from "../QR_Scanner/ScanProduct";
import { BASE_URL } from '@env'; 


const ProductListing = ({ route, navigation}) => {
  const { userId, role, branchId, branchName } = route.params;
  console.log(selectedBranch);
  const [searchQuery, setSearchQuery] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productBranches, setProductBranches] = useState([])
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch branches from backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/branches/`);
        console.log('Fetched branches:', response.data); // Log fetched branches
        setBranches(response.data);
      } catch (error) {
        console.error('Failed to fetch branches', error);
      }
    };
    fetchBranches();
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/categories/`);
        console.log('Fetched categories:', response.data); // Log fetched categories
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    }
    fetchCategories();
  }, [])

  // Set selected branch for manager
  useEffect(() => {
    if ((role == 'manager' || role == 'staff') && branchId) {
      setSelectedBranch(branchId);
    }
  }, [role, branchId]);

  // Fetch products based on selected branch and category
  useEffect(() => {
    if (selectedBranch) {
      const fetchProductBranches = async () => {
        try {
          // Construct the URL with selectedBranch and selectedCategory
          let url = `${BASE_URL}/api/products/product-branches/branch/${selectedBranch}`;
          if (selectedCategory) {
            url += `/category/${selectedCategory}`;
          }
          const response = await axios.get(url);
          console.log('Fetched product branches:', response.data); // Log fetched product branches
          setProductBranches(response.data);
  
          // Fetch additional product details
          const productIds = response.data.map(pb => pb.product_id);
          const productDetailsResponse = await axios.get(`${BASE_URL}/api/products/products/?ids=${productIds.join(',')}`);
          const productsDetails = productDetailsResponse.data;
  
          // Map productBranchData with product details
          const productWithDetails = response.data.map(pb => ({
            ...pb,
            product: productsDetails.find(pd => pd.id === pb.product_id)
          }));
  
          setProducts(productWithDetails);
        } catch (error) {
          console.error('Failed to fetch product branches or product details', error);
        }
      };
      fetchProductBranches();
    }
  }, [selectedBranch, selectedCategory]);
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {role === 'customer' && branches.length > 0 ? (
            <Picker
              selectedValue={selectedBranch}
              style={{ height: 50, width: 150 }}
              onValueChange={(itemValue) => setSelectedBranch(itemValue)}
            >
              {branches.map(branch => (
                <Picker.Item label={branch.name} value={branch.id} key={branch.id} />
              ))}
            </Picker>
          ) : (
            <Text>{branchName || 'Loading...'}</Text>
          )}
        </View>
      ),
      title: 'Product List'
    });
  }, [navigation, selectedBranch, branches, role, branchName]);
  

  useEffect(() => {
    let filtered = products.filter((productBranch) => 
      productBranch.product && productBranch.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleCategoryFilter = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  }

  const HandlefetchProductDetails = (productBranchId, userRole, userId, branchId, branchName) => {
    navigation.navigate('ProductDetail', { 
      productBranchId,
      userRole,
      userId,
      branchId: selectedBranch,
      branchName    
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search products"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <ScanProduct navigation={navigation} style={styles.scanButton} />
      </View>

      <CategorySection
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryFilter}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const categoryName = categories.find(category => category.id === item.category_id)?.name || 'N/A';

          return (
            <View style={styles.productItem}>
              <Image source={{ uri: item.product.image }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <TouchableOpacity onPress={() => HandlefetchProductDetails(item.id, role, userId, branchId, branchName)}>
                  <Text numberOfLines={2} style={styles.productName}>{item.product.name} ({categoryName})</Text>
                </TouchableOpacity>
                  <Text>Price:  <Text style={styles.boldText}>RM{item.product.price}</Text></Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found.</Text>
        }
      />

      <Footer />
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
  scanButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
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
    flex: 1, // Ensure product details take up remaining space
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
  priceContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default ProductListing;
