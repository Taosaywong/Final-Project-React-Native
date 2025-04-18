import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import axios from 'axios';
import CustomButton from '../../Components/CustomButton';
import { useFocusEffect } from '@react-navigation/native';
import CartList from '../Checkout/CartFunction';
import { BASE_URL } from '@env'; 
import { addCartItem, removeCartItem, checkCartItem } from '../Checkout/CartFunction';


const ProductDetail = ({ route, navigation }) => {
  const { productBranchId, userRole, userId, branchId, branchName } = route.params;
  console.log(`Branch Id: ${branchId}`);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState({
    productBranch: null,
    product: null,
    category: null,
    branchDetail: null,
    allProductDetails: [],
    isLoading: true,
    cart: null,
    cartItem: [],
  });

  const [localStock, setLocalStock] = useState(''); // Local state for stock input
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productBranchRes, allProductsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/products/product-branches/${productBranchId}/`),
          axios.get(`${BASE_URL}/api/products/products/`)
        ]);

        const productBranch = productBranchRes.data;
        if (!productBranch) {
          throw new Error('Product branch not found');
        }

        const [productRes, categoryRes, branchRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/products/products/${productBranch.product_id}`),
          axios.get(`${BASE_URL}/api/products/categories/${productBranch.category_id}`),
          axios.get(`${BASE_URL}/api/branches/${productBranch.branch_id}`)
        ]);

        // Fetch user cart data
        const userCartRes = await axios.get(`${BASE_URL}/api/checkout/cart/${userId}`);
        const userCart = userCartRes.data || { items: [] };

        setData({
          productBranch,
          product: productRes.data,
          category: categoryRes.data,
          branchDetail: branchRes.data,
          allProductDetails: allProductsRes.data,
          isLoading: false,
          cart: userCart,
          cartItem: userCart.items || [] // Safely handle when userCart.items is undefined
        });

        setLocalStock(String(productBranch.stock)); // Initialize local stock state
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setData((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();
  }, [productBranchId, userId]);

  useFocusEffect(
    React.useCallback(() => {
      const checkCartItemExistence = async () => {
        try {
          // Fetch user cart
          const userCartRes = await axios.get(`${BASE_URL}/api/checkout/cart/${userId}`);
          const userCart = userCartRes.data || { items: [] };
  
          // Check if the product is in the user cart before fetching cart item
          const cartItem = userCart[0]?.items.find((item) => item.product.id === productBranchId);
  
          if (cartItem) {
            // Check if the item is in the cart
            const cartItemCheck = await checkCartItem({ userId, productBranchId });
            setIsInCart(!!cartItemCheck);
          } else {
            setIsInCart(false); // Ensure to reset the state if the item is not in the cart
          }
        } catch (error) {
          console.error('Failed to check cart item:', error);
        }
      };
  
      if (productBranchId && userId) {
        checkCartItemExistence();
      }
    }, [productBranchId, userId])
  );
  
  
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtonContainer}>
          <CustomButton iconName="bag-outline" color="black" onPress={() => setModalVisible(true)}>
            Cart
          </CustomButton>
        </View>
      )
    });
  }, [navigation]);

  const handleEdit = async () => {
    try {
      console.log('Submitting stock:', localStock);
      const response = await axios.patch(`${BASE_URL}/api/products/product-branches/${productBranchId}/`, {
        stock: Number(localStock),
      });
      setData((prev) => ({
        ...prev,
        productBranch: {
          ...prev.productBranch,
          stock: response.data.stock,
        },
      }));
      Alert.alert('Success', 'Product stock updated successfully', [
        { text: 'OK', onPress: () => navigation.navigate('ManagerDrawer', { 
          userId,
          role: userRole,
          branchId,
          branchName 
        }) }
      ]);
    } catch (error) {
      console.error('Edit product stock failed:', error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await axios.delete(`${BASE_URL}/api/products/product-branches/${productBranchId}/`);
              Alert.alert('Success', 'Product deleted successfully', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('ManagerDrawer', { 
                    userId,
                    role: userRole,
                    branchId,
                    branchName,
                  }),
                },
              ]);
            } catch (error) {
              console.error('Delete Product failed:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleAddCartItem = async (productBranchId, userId) => {
    try {
      await addCartItem({ userId, productBranchId });

      // Fetch updated cart data
      const userCartRes = await axios.get(`${BASE_URL}/api/checkout/cart/${userId}`);
      const userCart = userCartRes.data || { items: [] }; // Ensure userCart is defined

      // Update state to reflect the added item
      setData((prevData) => ({
        ...prevData,
        cart: userCart,
        cartItem: userCart.items || []  // Safely update cartItem state
      }));
      setIsInCart(true);  // Update isInCart state
      Alert.alert('Success', 'Item added to cart');
    } catch (error) {
      console.error('Failed to add cart item:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const handleRemoveCartItem = async (productBranchId, userId) => {
    try {
      await removeCartItem({ userId, productBranchId });

      // Fetch updated cart data
      const userCartRes = await axios.get(`${BASE_URL}/api/checkout/cart/${userId}`);
      const userCart = userCartRes.data || { items: [] }; // Ensure userCart is defined

      // Update state to reflect the removed item
      setData((prevData) => ({
        ...prevData,
        cart: userCart,
        cartItem: userCart.items || []  // Safely update cartItem state
      }));
      setIsInCart(false);  // Update isInCart state
      Alert.alert('Success', 'Item removed from cart');
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      Alert.alert('Error', 'Failed to remove item from cart');
    }
  };

  if (data.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <CartList  
      userId={userId}
      branchId={branchId}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      />
      {/* <TestModal /> */}
      {data.productBranch && data.product ? (
        <>
          <Image source={{ uri: data.product.image }} style={styles.productImage} />
          <View style={styles.textContainer}>
            <Text style={[styles.label, styles.centeredText]}>{data.product.name}</Text>

            <Text style={styles.label}>Price:</Text>
            <TextInput
              style={styles.input}
              value={String(data.product.price)}
              editable={false}
            />

            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={data.product.description}
              editable={false}
              multiline
            />

            <Text style={styles.label}>Category:</Text>
            <TextInput
              style={styles.input}
              value={data.category.name}
              editable={false}
            />

            <Text style={styles.label}>Stock:</Text>
            <TextInput
              style={styles.input}
              value={localStock}
              onChangeText={(text) => setLocalStock(text)}
              keyboardType="numeric"
              clearButtonMode="while-editing"
            />

            <Text style={styles.label}>Branch:</Text>
            <TextInput
              style={styles.input}
              value={data.branchDetail.name}
              editable={false}
            />

            {userRole === 'manager' ? (
              <View style={styles.buttonContainer}>
                <CustomButton width={100} backgroundColor="yellow" color="black" onPress={handleEdit}>
                  Edit
                </CustomButton>
                <CustomButton width={100} backgroundColor="red" color="white" onPress={handleDelete}>
                  <Text>Delete</Text>
                </CustomButton>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                {!isInCart ? (
                  <CustomButton iconName="bag-add-outline" backgroundColor="green" color="white"
                              onPress={() => handleAddCartItem(productBranchId, userId)}>
                  Add To Cart
                </CustomButton>
                ): (
                  <CustomButton onPress={() => handleRemoveCartItem(productBranchId, userId)} 
                  iconName="bag-remove-outline" 
                  backgroundColor="red" 
                  color="white"
                  >
                    Remove From Cart
                  </CustomButton>
                )}
                
                <CustomButton iconName="archive-outline" backgroundColor="blue" color="white"
                              onPress={() => navigation.navigate('ProductReviews', { productId: data.product.id })}>
                  Review This
                </CustomButton>
              </View>
            )}
          </View>
        </>
      ) : (
        <Text>No product data available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  textContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  textArea: {
    height: 80,
  },
  centeredText: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerButtonContainer: {
    marginRight: 16,
  }
});

export default ProductDetail;
