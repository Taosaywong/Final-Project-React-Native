import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import PayPalLogo from '../../../assets/paypal-logo.png'; // Replace with the path to your PayPal logo image
import CustomButton from '../../Components/CustomButton';

const CheckoutPage = ({ navigation, route }) => {
  const { cartId, userId, cartItems, total_amount } = route.params;

  const [paymentMethod, setPaymentMethod] = useState('');

  console.log(`Check out check cartId: ${cartId}`);
  console.log(`CheckoutPage userId: ${userId}`); // Add this line to check userId

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.product.name}</Text>
      <Text>Price: RM{item.total_price}</Text>
      <Text>Quantity: {item.quantity}</Text>
    </View>
  );

  const handlePayment = () => {
    if (!paymentMethod) {
      Alert.alert('Error', 'Please select a payment method.');
      return;
    }

    if (paymentMethod === 'PayPal') {
      console.log("Navigating to PaymentScreen with userId:", userId); // Add this line to check userId before navigating
      navigation.navigate('PaymentScreen', { cartId, userId, cartItems, totalAmount: total_amount });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.purchaseSummary}>
        <Text style={styles.heading}>Purchase Summary</Text>
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
        <View style={styles.item}>
          <Text style={styles.total}>Total Amount:</Text>
          <Text style={styles.total}>RM {total_amount}</Text>
        </View>
      </View>
      <View style={styles.paymentMethod}>
        <Text style={styles.heading}>Payment Method</Text>
        <TouchableOpacity
          style={[
            styles.paymentButton,
            paymentMethod === 'PayPal' && styles.selectedButton,
          ]}
          onPress={() => setPaymentMethod('PayPal')}
        >
          <Image source={PayPalLogo} style={styles.paymentLogo} />
          <Text style={styles.buttonText}>PayPal</Text>
        </TouchableOpacity>
      </View>
      <CustomButton
        onPress={handlePayment}
        color="white"
        backgroundColor="blue"
        style={styles.checkoutButton}
      >
        Pay
      </CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  purchaseSummary: {
    marginBottom: 20,
  },
  paymentMethod: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  total: {
    fontWeight: 'bold',
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: '#0056b3', // Darker shade to indicate selection
  },
  paymentLogo: {
    width: 30, // Adjust the width as needed
    height: 30, // Adjust the height as needed
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: '#28a745', // Adjust the background color as needed
  },
});

export default CheckoutPage;
