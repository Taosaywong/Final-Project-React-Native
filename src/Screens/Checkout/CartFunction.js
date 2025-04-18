import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CustomButton from "../../Components/CustomButton";
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, StyleSheet, ScrollView, Modal, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { BASE_URL } from '@env';




// Function to edit the quantity of a cart item

// Function to edit the quantity of a cart item
const updateCartItem = async (userId, itemId, productId, newQuantity) => {
  try {
    const response = await axios.patch(`${BASE_URL}/api/checkout/cart/${userId}/cart_item/${itemId}/update_quantity/${productId}/`, {
      quantity: newQuantity,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update cart item', error);
  }
};

const CartList = ({ userId, branchId, modalVisible, setModalVisible }) => {
  const navigation = useNavigation();
  const [dataItems, setDataItems] = useState([]);
  const [cartId, setCartId] = useState(null);

  // Fetch Cart ID
  const fetchCartId = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/checkout/cart/${userId}/get_cart_id/`);
      if (response.data.cart_id) {
        setCartId(response.data.cart_id);
        console.log('Cart ID:', response.data.cart_id);
      } else {
        alert('Failed to fetch cart ID');
      }
    } catch (error) {
      console.log('Failed to fetch cart ID', error);
    }
  }, [userId]);

  // Fetch Cart Data
  const fetchCartData = useCallback(async () => {
    try {
      // Fetch Cart Items for specific branch
      const cartResponse = await axios.get(`${BASE_URL}/api/checkout/cart/${userId}/branch_cart_items/${branchId}/`);
      console.log('Fetched Cart Items:', cartResponse.data);
      
      // Fetch product details for each cart item
      const enrichedItems = await Promise.all(cartResponse.data.map(async (cartItem) => {
        if (cartItem.product && cartItem.product.product_id) {
          const productResponse = await axios.get(`${BASE_URL}/api/products/products/${cartItem.product.product_id}`);
          const productData = productResponse.data;
          return {
            id: cartItem.id,
            product: productData,
            quantity: cartItem.quantity,
            total_price: cartItem.total_price,
          };
        } else {
          return cartItem;
        }
      }));

      console.log('Enriched Cart Items:', enrichedItems);
      setDataItems(enrichedItems);
    } catch (error) {
      console.error('Failed to fetch cart items', error);
    }
  }, [userId, branchId]);

  // Use useFocusEffect to re-fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCartId();
      fetchCartData();
    }, [fetchCartId, fetchCartData])
  );

  // Fetch data when modal visibility changes
  useEffect(() => {
    if (modalVisible) {
      fetchCartId();
      fetchCartData();
    }
  }, [modalVisible, fetchCartId, fetchCartData]);

  useEffect(() => {
    console.log('Updated Data Items:', dataItems);
  }, [dataItems]); // Log dataItems whenever it changes

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleReduceQuantity = async (item) => {
    if (item.quantity > 1) {
      const updatedItem = await updateCartItem(userId, item.id, item.product?.id, item.quantity - 1);
      setDataItems(dataItems.map(i => {
        if (i.id === item.id) {
          return {
            ...i,
            quantity: updatedItem.quantity,
            total_price: updatedItem.total_price,
          };
        }
        return i;
      }));
    }
  };

  const handleAddQuantity = async (item) => {
    const updatedItem = await updateCartItem(userId, item.id, item.product?.id, item.quantity + 1);
    setDataItems(dataItems.map(i => {
      if (i.id === item.id) {
        return {
          ...i,
          quantity: updatedItem.quantity,
          total_price: updatedItem.total_price,
        };
      }
      return i;
    }));
  };

  const calculateTotalPrice = () => {
    if (dataItems.length === 0) {
      return "0.00";
    }
    const total = dataItems.reduce((total, item) => total + parseFloat(item.total_price || 0), 0);
    return total.toFixed(2);
  }

  return (
    <View style={styles.container}>
      <CustomButton title="Show Cart" onPress={() => toggleModal(null)} />
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => toggleModal(null)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => toggleModal(null)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Cart</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {dataItems.length > 0 ? (
                dataItems.map(item => (
                  <TouchableOpacity key={item.id} onPress={() => toggleModal(item.product)} style={styles.itemContainer}>
                    <Image source={{ uri: item.product?.image }} style={styles.itemImage} />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.product?.name}</Text>
                      <View style={styles.quantityContainer}>
                        <CustomButton iconName="remove-sharp" iconSize={16} onPress={() => handleReduceQuantity(item)} />
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <CustomButton iconName="add-sharp" iconSize={16} onPress={() => handleAddQuantity(item)} />
                      </View>
                      <Text style={styles.itemText}>Price: RM {item.total_price}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No Items in Cart</Text>
              )}
            </ScrollView>
            <View style={styles.checkOutContainer}>
              <View style={styles.total_price_container}>
              <Text style={styles.total_price}>Total Price: RM {calculateTotalPrice()}</Text>
              </View>
              <CustomButton  title="Checkout" 
              onPress={() => {
                  console.log("Navigating to CheckoutPage with userId:", userId);
                  navigation.navigate('CheckoutPage', { cartId, userId, cartItems: dataItems, total_amount: calculateTotalPrice() });
                }}
              style={styles.checkoutButton}>
                Checkout
              </CustomButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


async function addCartItem({ userId, productBranchId, quantity = 1 }) {
  try {
    const addResponse = await axios.post(`${BASE_URL}/api/checkout/cart/${userId}/add_item/`, {
      product_branch_id: productBranchId,
      quantity: quantity,
    });
    console.log('Cart Item Added', addResponse.data);
    return addResponse.data;
  } catch (error) {
    console.error('Failed to Add the Cart Item', error);
    throw error;
  }
}

async function checkCartItem({ userId, productBranchId }) {
  try {
    const response = await axios.get(`${BASE_URL}/api/checkout/cart/${userId}/cart_item/${productBranchId}/`);
    console.log('Cart Item Check', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to Check the Cart Item', error);
    throw error;
  }
}

async function removeCartItem({ userId, productBranchId }) {
  try {
    const removeResponse = await axios.delete(`${BASE_URL}/api/checkout/cart/${userId}/remove_item/${productBranchId}/`);
    console.log('Cart Item Removed', removeResponse.data);
    return removeResponse.data;
  } catch (error) {
    console.error('Failed to Remove the Cart Item', error);
    throw error;
  }
}

const editCartItem = () => {
  // Function implementation here
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '70%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  scrollViewContent: {
    flexGrow: 1,
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%'
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#e0e0e0', // Fallback color in case image is null
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginLeft: 10,
  },
  quantityText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 20, // Add some space between quantity text and buttons
    textAlign: 'center',
    width: 40, // Adjust width to center text
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  checkoutButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  productDetail: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'flex-start',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Center items vertically
    justifyContent: 'center', // Center items horizontally
    marginTop: 10,
  },
  checkOutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    width: '100%', // Ensure it takes the full width of the modal
  },
  total_price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  total_price_container: {
    flex: 1,
    justifyContent: 'flex-start'
  },
});

export default CartList;
export { addCartItem, editCartItem, removeCartItem, checkCartItem };
