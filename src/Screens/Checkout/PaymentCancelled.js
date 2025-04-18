import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const PaymentCancelled = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Payment Cancelled</Text>
      <Text style={styles.details}>Your payment has been cancelled. Please try again or use a different payment method.</Text>
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default PaymentCancelled;
