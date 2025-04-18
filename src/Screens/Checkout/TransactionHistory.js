import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

import { BASE_URL } from '@env';

const TransactionHistoryScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [transactionData, setTransactionData] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUserTransaction = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/checkout/transactions/${userId}/`);
      setTransactionData(response.data);

      // Extract unique dates
      const dates = [...new Set(response.data.map((tx) => tx.formatted_created_at))];
      setUniqueDates(dates);

      // Set filtered transactions to all by default
      setFilteredTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch user transaction data:', error);
      setErrorMessage('Failed to load transactions. Please try again later.');
    }
  };

  useEffect(() => {
    fetchUserTransaction();
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchUserTransaction();
    }, [userId])
  );

  const filterTransactions = (date) => {
    if (date) {
      setFilteredTransactions(transactionData.filter((tx) => tx.formatted_created_at === date));
    } else {
      setFilteredTransactions(transactionData);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterTransactions(date);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => item.invoice_number && navigation.navigate('TransactionDetail', { invoiceNumber: item.invoice_number })}
    >
      <Text style={styles.invoice}>Invoice #: {item.invoice_number}</Text>
      <Text>Date: {item.formatted_created_at}</Text>
      <Text>Total: RM {item.total_price}</Text>
      <Text>Status: {item.transaction_status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filter by Date:</Text>
      {errorMessage ? <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text> : null}

      <Picker
        selectedValue={selectedDate}
        style={styles.datePicker}
        onValueChange={(date) => handleDateChange(date)}
      >
        <Picker.Item label="All Dates" value="" />
        {uniqueDates.map((date) => (
          <Picker.Item label={date} value={date} key={date} />
        ))}
      </Picker>

      <FlatList
        data={filteredTransactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text>No transactions found for the selected date.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  datePicker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  invoice: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TransactionHistoryScreen;
