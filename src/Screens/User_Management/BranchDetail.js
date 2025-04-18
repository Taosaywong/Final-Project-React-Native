import React, { useState, useEffect } from "react";
import { View, Button, Text, TextInput, StyleSheet, Alert } from 'react-native';
import axios from "axios";
import CustomButton from "../../Components/CustomButton";
import { useRoute } from '@react-navigation/native';
import { BASE_URL } from '@env'; 


const BranchDetail = ({ navigation}) => {
    const route = useRoute();
    const { branchId } = route.params;
    const [data, setData] = useState({
        selectedBranchData: null,
        name: '',
        address: ''
    });

    useEffect(() => {
        const getBranchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/branches/${branchId}`);
                const selectedBranchData = response.data;
                setData({
                    selectedBranchData: selectedBranchData,
                    name: selectedBranchData.name,
                    address: selectedBranchData.address
                });
            } catch (error) {
                console.error(error, 'Failed to Fetch Selected Branch Data');
            }
        };

        getBranchData();
    }, [branchId]);

    const handleEdit = async () => {
        try {
            const response = await axios.patch(`${baseURL}/api/branches/${branchId}/`, {
                name: data.name,
                address: data.address
            });
            Alert.alert("Success", "Branch updated successfully");
            setData({ ...data, selectedBranchData: response.data });
        } catch (error) {
            console.error(error.message, 'Failed to Update Branch');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${baseURL}/api/branches/${branchId}/`);
            Alert.alert("Success", "Branch deleted successfully");
            navigation.goBack();
        } catch (error) {
            console.error(error.message, 'Failed to Delete Branch');
        }
    };

    return (
        <View style={styles.container}>
            {data.selectedBranchData ? (
                <>
                    <Text style={styles.label}>Branch Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={data.name}
                        onChangeText={(text) => setData({ ...data, name: text })}
                    />
                    <Text style={styles.label}>Branch Address:</Text>
                    <TextInput
                        style={styles.input}
                        value={data.address}
                        onChangeText={(text) => setData({ ...data, address: text })}
                    />

                    <View style={styles.rowContainer}>
                        <CustomButton 
                            iconName="pencil-outline"
                            iconSize={14}
                            color="white"
                            backgroundColor="orange"
                            onPress={handleEdit}
                        >
                            Edit
                        </CustomButton>

                        <CustomButton
                        iconName="trash-outline"
                        iconSize={14}
                        color="white"
                        backgroundColor="red"
                        onPress={handleDelete}
                        >Delete</CustomButton>
                    </View>
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        fontSize: 16,
        borderRadius: 4,
    },

    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});

export default BranchDetail;
