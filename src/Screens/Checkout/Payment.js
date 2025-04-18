import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL } from '@env';

const PaymentScreen = ({ navigation, route }) => {
  const { cartId, userId, cartItems, totalAmount } = route.params;  // Ensure userId is received
  const [approvalURL, setApprovalURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [webViewVisible, setWebViewVisible] = useState(true);
  const executingPayment = useRef(false);  // Use ref to track payment execution status

  useEffect(() => {
    console.log("PaymentScreen params:", { cartId, userId, cartItems, totalAmount });  // Log parameters
  }, []);

  useEffect(() => {
    const createPayment = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/api/checkout/create-payment/`, {
          cart_id: cartId,
          total_amount: totalAmount,
          cart_items: cartItems
        });
        if (response.data.approval_url) {
          setApprovalURL(response.data.approval_url);
        } else {
          alert('Failed to initiate payment');
        }
      } catch (error) {
        alert('Error initiating payment: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    createPayment();
  }, [cartId, totalAmount]);

  const handleNavigationChange = async (event) => {
    if (event.url.includes('payment-success') && !executingPayment.current) {
      executingPayment.current = true;  // Set to true to prevent re-entry
      const urlParams = new URLSearchParams(event.url.split('?')[1]);
      const paymentId = urlParams.get('paymentId');
      const payerID = urlParams.get('PayerID');

      // Retrieve the JWT token from AsyncStorage
      const token = await AsyncStorage.getItem('access_token');

      try {
        const response = await axios.post(
          `${BASE_URL}/api/checkout/execute-payment/`,
          {
            paymentId: paymentId,
            PayerID: payerID,
            cart_id: cartId,
            total_amount: totalAmount
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the JWT token
            }
          }
        );
        if (response.data.message.includes('Payment executed successfully')) {
          setWebViewVisible(false); // Close WebView
          console.log("Navigating to PaymentSuccess with userId:", userId);  // Log userId before navigating
          navigation.navigate('PaymentSuccess', { userId, order: response.data.order });
        } else {
          setWebViewVisible(false); // Close WebView
          Alert.alert('Payment failed', 'Please try again.');
        }
      } catch (error) {
        setWebViewVisible(false); // Close WebView
        Alert.alert('Payment error', 'Error executing payment: ' + error.message);
      } finally {
        executingPayment.current = false;  // Reset to allow future executions
      }
    } else if (event.url.includes('payment-cancel')) {
      setWebViewVisible(false); // Close WebView
      navigation.navigate('PaymentCancelled');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ flex: 1 }}>
      {webViewVisible && (
        <WebView
          source={{ uri: approvalURL }}
          onNavigationStateChange={handleNavigationChange}
          startInLoadingState
          renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
        />
      )}
    </View>
  );
};

export default PaymentScreen;
