import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../../Components/CustomButton';

import { BASE_URL } from '@env';

const TransactionDetail = ({ route, navigation }) => {
    const { invoiceNumber } = route.params;
    const [selectedTransactionData, setTransactionData] = useState([]);
    const [error, setError] = useState('');
    const [productDetailData, setProductDetailData] = useState([]);

    const fetchProductDetail = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/products/products/`);
            console.log("Fetched Product Details:", response.data);
            setProductDetailData(response.data);
        } catch (error) {
            console.error("Failed to Fetch the Product Detail", error);
            setError('Failed to fetch product details. Please try again later.');
        }
    };

    const fetchUserTransactionDetail = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/checkout/transaction/invoiceNum_transaction_detail/${invoiceNumber}`);
            console.log("Fetched Transaction Details:", response.data);
            setTransactionData(response.data);
            setError(''); // Clear any previous error
        } catch (error) {
            console.error("Failed to Fetch the Transaction Detail", error);
            setError('Failed to fetch transaction details. Please try again later.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUserTransactionDetail();
            fetchProductDetail();
        }, [invoiceNumber])
    );

    const renderPurchasedItem = ({ item }) => {
        const product = productDetailData.find((p) => p.id === Number(item.product_id));
        console.log('Purchase Item:', item);
        console.log('Product Detail:', productDetailData);

        console.log('Product:', product);

        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>
                    Product Name: {product ? product.name : "Unknown Product"}
                </Text>
                <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
                <Text style={styles.itemText}>Price: RM {item.price}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Transaction Detail</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.detailSection}>
                <Text style={styles.label}>Invoice Number:</Text>
                <Text style={styles.value}>{invoiceNumber}</Text>
            </View>
            {selectedTransactionData.length > 0 ? (
                <>
                    <View style={styles.detailSection}>
                        <Text style={styles.label}>Total Amount:</Text>
                        <Text style={styles.value}>RM {selectedTransactionData[0].total_price}</Text>
                    </View>
                    <View style={styles.detailSection}>
                        <Text style={styles.label}>Payment Status:</Text>
                        <Text style={styles.value}>{selectedTransactionData[0].transaction_status || 'Unknown'}</Text>
                    </View>
                    <View style={styles.detailSection}>
                        <Text style={styles.label}>Purchased Items:</Text>
                        <FlatList
                            data={selectedTransactionData[0].purchased_items}
                            renderItem={renderPurchasedItem}
                            keyExtractor={(item, index) => index.toString()} // Use index if item.id is not available
                        />
                    </View>
                </>
            ) : (
                <Text style={styles.errorText}>No transaction details available.</Text>
            )}

            <CustomButton onPress={() => alert('Download functionality coming soon!')}>
                Download This Invoice
            </CustomButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    detailSection: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    itemContainer: {
        marginBottom: 8,
        padding: 12,
        backgroundColor: '#ffffff',
        borderRadius: 8,
    },
    itemText: {
        fontSize: 14,
        color: '#555',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 16,
    },
});

export default TransactionDetail;
