import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from 'react-native';
import generateRandomColor from '../../utils/generateRandomColor';

const screenWidth = Dimensions.get('window').width;


const CustomerPurchaseBehavior = ({ route }) => {
    const { userId } = route.params;

    // State to manage the data, loading, and errors
    const [purchaseData, setPurchaseData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user purchase data
    useEffect(() => {
        const fetchPurchaseData = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/user_purchase_category/${userId}/`
                );
                const { purchase_category, total_revenue } = response.data;

                // Transform the data for the PieChart
                const transformedData = purchase_category.map(item => ({
                    name: item.category_name,
                    population: item.total_revenue,
                    color: generateRandomColor(),
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                }));

                setPurchaseData(transformedData);
                setTotalRevenue(total_revenue);
            } catch (err) {
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPurchaseData();
    }, [userId]);

    // Render the component
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Purchase Behavior</Text>
            <Text style={styles.subHeader}>Total Revenue: ${totalRevenue}</Text>
            <PieChart
                data={purchaseData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                    backgroundColor: "#1cc910",
                    backgroundGradientFrom: "#eff3ff",
                    backgroundGradientTo: "#efefef",
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    strokeWidth: 2,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 18,
        color: '#7F7F7F',
        marginBottom: 20,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
});

export default CustomerPurchaseBehavior;