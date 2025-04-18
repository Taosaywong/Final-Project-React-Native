import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import CustomButton from "../../Components/CustomButton";
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL } from '@env'; 

const AddUser = ({ navigation }) => {
  const [userData, setUserData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    user_image: "",
    branch: "",
    role: "",
    status: "",
    password: ""
  });

  const [branchData, setBranchData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchAllBranches = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/branches`);
        setBranchData(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    const fetchAllRoles = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/roles`);
        setRoleData(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchAllBranches();
    fetchAllRoles();
  }, []);

  const handleInputChange = (name, value) => {
    setUserData({ ...userData, [name]: value });
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log(result);

      if (!result.cancelled) {
        handleInputChange("user_image", result.assets[0].uri);
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
      console.error("Image selection error:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Check if user_image exists
      if (!userData.user_image) {
        alert('Please select an image before adding the user');
        return;
      }

      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('first_name', userData.first_name);
      formData.append('last_name', userData.last_name);
      formData.append('email', userData.email);
      formData.append('branch', userData.branch);
      formData.append('role', userData.role);
      formData.append('status', userData.status);
      formData.append('password', userData.password);

      const filename = userData.user_image.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('user_image', { uri: userData.user_image, name: filename, type });

      await axios.post(`${baseURL}/api/users/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'User added successfully');
      navigation.goBack();
    } catch (error) {
      console.error("Error adding user:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        Alert.alert('Error', `Failed to add user: ${JSON.stringify(error.response.data)}`);
      } else {
        Alert.alert('Error', 'An unknown error occurred while adding the user');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          value={userData.username}
          onChangeText={(text) => handleInputChange("username", text)}
        />
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          value={userData.first_name}
          onChangeText={(text) => handleInputChange("first_name", text)}
        />
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          value={userData.last_name}
          onChangeText={(text) => handleInputChange("last_name", text)}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={userData.email}
          onChangeText={(text) => handleInputChange("email", text)}
        />
        <Text style={styles.label}>User Image:</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={selectImage}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {userData.user_image ? (
            <Image source={{ uri: userData.user_image }} style={styles.image} />
          ) : (
            <Text style={styles.imagePickerText}>Select Image</Text>
          )}
          {isHovered && <Text style={styles.uploadText}>Upload Image</Text>}
        </TouchableOpacity>
        
        <Text style={styles.label}>Branch:</Text>
        <Picker
          style={styles.picker}
          selectedValue={userData.branch}
          onValueChange={(itemValue) => handleInputChange("branch", itemValue)}
        >
          <Picker.Item label="Select Branch" value="" />
          {branchData.map(branch => (
            <Picker.Item label={branch.name} value={branch.id} key={branch.id} />
          ))}
        </Picker>

        <Text style={styles.label}>Role:</Text>
        <Picker
          style={styles.picker}
          selectedValue={userData.role}
          onValueChange={(itemValue) => handleInputChange("role", itemValue)}
        >
          <Picker.Item label="Select Role" value="" />
          {roleData.map(roles => (
            <Picker.Item label={roles.name} value={roles.id} key={roles.id} />
          ))}
        </Picker>

        <Text style={styles.label}>Status:</Text>
        <Picker
          style={styles.picker}
          selectedValue={userData.status}
          onValueChange={(itemValue) => handleInputChange("status", itemValue)}
        >
          <Picker.Item label="Select Status" value="" />
          <Picker.Item label="Active" value="active" />
          <Picker.Item label="Inactive" value="inactive" />
        </Picker>

        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          value={userData.password}
          onChangeText={(text) => handleInputChange("password", text)}
        />
        
        <CustomButton 
          iconName="person-add-outline" 
          iconSize={12}
          onPress={handleSubmit}
          color="white"
          backgroundColor="green"
        >
          Add User
        </CustomButton>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUser;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  imagePicker: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  imagePickerText: {
    color: '#999',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
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
});
