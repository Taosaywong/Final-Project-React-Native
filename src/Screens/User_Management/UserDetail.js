import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Picker } from "@react-native-picker/picker";
import { BASE_URL } from '@env'; 


const UserDetail = ({ route, navigation }) => {
    const { userId } = route.params;
    const [data, setData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        user_image: '',
        branch: '',
        role: '',
        role_name: '',
        branch_name: '',
        status: '',
        password: '',
    });
    const [roleData, setRoleData] = useState([]);
    const [branchData, setBranchData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchSelectedUserData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/users/${userId}/`);
                setData(response.data);
                console.log(`user data: ${response.data}`);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch user data');
                console.error('Failed to fetch user data:', error);
            }
        };

        const fetchAllBranches = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/branches/`);
                setBranchData(response.data);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch branch data');
                console.error('Failed to fetch branch data:', error);
            }
        };

        const fetchAllRole = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/roles/`);
                setRoleData(response.data);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch role data');
                console.error('Failed to fetch role data:', error);
            }
        };

        fetchSelectedUserData();
        fetchAllBranches();
        fetchAllRole();
    }, [userId]);

    const handleInputChange = (name, value) => {
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleUpdateData = async () => {
        try {
            const updatedData = {
                username: data.username,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                role: data.role,
                branch: data.branch
            };
    
            const response = await axios.patch(`${BASE_URL}/api/users/${userId}/`, updatedData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            Alert.alert('Success', 'User updated successfully');
            console.log(response.data);
            setIsEditMode(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to update user');
            console.error('Error, failed to update user:', error);
        }
    };
    

    const handleDeletePress = (userId) => {
        Alert.alert(
          "Confirm Delete",
          "Are you sure you want to delete?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "Yes", onPress: () => handleDeleteSelectedUser(userId) }
          ],
          { cancelable: false }
        );
    };

    const handleDeleteSelectedUser = async () => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/users/${userId}/`);
            Alert.alert('Success', 'User deleted successfully');
            console.log(response.data);
            navigation.goBack(); // Navigate back after deleting user
        } catch (error) {
            Alert.alert('Error', 'Failed to delete user');
            console.error('Error, failed to delete user:', error);
        }
    };


    if (!data) {
        return <Text>Loading...</Text>;
    }


    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditMode(!isEditMode)}
            >
                <Text style={styles.editButtonText}>{isEditMode ? 'Cancel' : 'Edit'}</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Username:</Text>
            <TextInput
                style={styles.input}
                value={data.username}
                onChangeText={(text) => handleInputChange('username', text)}
                editable={isEditMode}
            />
            <Text style={styles.label}>First Name:</Text>
            <TextInput
                style={styles.input}
                value={data.first_name}
                onChangeText={(text) => handleInputChange('first_name', text)}
                editable={isEditMode}
            />
            <Text style={styles.label}>Last Name:</Text>
            <TextInput
                style={styles.input}
                value={data.last_name}
                onChangeText={(text) => handleInputChange('last_name', text)}
                editable={isEditMode}
            />
            <Text style={styles.label}>Email:</Text>
            <TextInput
                style={styles.input}
                value={data.email}
                onChangeText={(text) => handleInputChange('email', text)}
                editable={isEditMode}
            />
            <Text style={styles.label}>Branch:</Text>
            <Picker
                style={styles.picker}
                selectedValue={data.branch}
                onValueChange={(itemValue) => handleInputChange("branch", itemValue)}
                enabled={isEditMode}
            >
                {branchData.map(branch => (
                    <Picker.Item label={branch.name} value={branch.id} key={branch.id} />
                ))}
            </Picker>
            <Text style={styles.label}>Role:</Text>
            <Picker
                style={styles.picker}
                selectedValue={data.role}
                onValueChange={(itemValue) => handleInputChange("role", itemValue)}
                enabled={isEditMode}
            >
                {roleData.map(role => (
                    <Picker.Item label={role.name} value={role.id} key={role.id} />
                ))}
            </Picker>
            {isEditMode && (
                <View style={styles.rowContainer}>
                    <View style={styles.buttonContainer}>
                        <Button title="Update User" onPress={handleUpdateData} />
                    </View>
                </View>
            )}
            <View style={styles.rowContainer}>
                <View style={styles.buttonContainer}>
                    <Button title="Delete User" color="red" onPress={() => handleDeletePress(userId)} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    buttonContainer: {
        marginVertical: 8,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imageContainer: {
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#000',
        marginBottom: 10,
        resizeMode: 'cover',
    },
    uploadText: {
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: [{ translateX: -50 }],
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        padding: 5,
        borderRadius: 5,
        zIndex: 1,
    },
    editButton: {
        alignSelf: 'flex-end',
        marginBottom: 16,
    },
    editButtonText: {
        fontSize: 16,
        color: '#007bff',
    },
});


export default UserDetail;
