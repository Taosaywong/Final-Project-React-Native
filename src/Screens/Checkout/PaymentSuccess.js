import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentSuccess = ({ navigation, route }) => {
  const { order, userId } = route.params;

  useEffect(() => {
      console.log("PaymentSuccess params:", { order, userId});
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Payment Successful!</Text>
      <Button
        title="Go back Product branch Listing"
        onPress={() => navigation.navigate('CustomerDrawer', { userId, role: 'customer' })}
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

export default PaymentSuccess;
