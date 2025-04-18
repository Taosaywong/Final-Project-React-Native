import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Use expo-image-picker for image upload
import axios from 'axios';
import CustomButton from '../../Components/CustomButton';
import { BASE_URL } from '@env'; 

const placeholderImage = 'https://via.placeholder.com/100'; // Placeholder image URL


const UserProfile = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log(`Fetching user data from: ${BASE_URL}/api/users/${userId}/`); // Debug log
        const response = await axios.get(`${BASE_URL}/api/users/${userId}/`);
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleImageUpload = async () => {
    console.log('handleImageUpload triggered'); // Debug log
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('Permission status:', status); // Debug log

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrected usage of mediaTypes
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log('ImagePicker result:', result); // Debug log

      if (result.cancelled || !result.assets || result.assets.length === 0) {
        alert('No image selected');
        return;
      }

      const selectedImage = result.assets[0];
      console.log('Selected Image:', selectedImage); // Debug log

      const localUri = selectedImage.uri;
      if (!localUri) {
        alert('No image URI found');
        return;
      }

      console.log('Image URI:', localUri); // Debug log

      const filename = localUri.split('/').pop();
      console.log('Filename:', filename); // Debug log

      // Infer the type of the image
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('user_image', { uri: localUri, name: filename, type });
      formData.append('username', userData.username); // Add username to form data
      formData.append('role', userData.role); // Add role to form data
      formData.append('first_name', userData.first_name); // Add first name to form data
      formData.append('last_name', userData.last_name); // Add last name to form data
      formData.append('email', userData.email); // Add email to form data

      console.log('FormData:', formData); // Debug log

      const response = await axios.put(`${baseURL}/api/users/${userId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Server Response:', response.data); // Debug log
      setUserData(response.data);
    } catch (error) {
      if (error.response) {
        console.error('Failed to upload image', error.response.data);
      } else if (error.request) {
        console.error('No response received', error.request);
      } else {
        console.error('Error', error.message);
      }
      console.error('Error config', error.config);
      alert('An error occurred: ' + error.message);
    }
  };

  const handleTextChange = (key, value) => {
    setUserData({
      ...userData,
      [key]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${BASE_URL}/api/users/${userId}/`, {
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        role: userData.role,
      });
      setUserData(response.data);
      console.log('Profile updated successfully', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Failed to save user data', error.response.data);
      } else if (error.request) {
        console.error('No response received', error.request);
      } else {
        console.error('Error', error.message);
      }
      console.error('Error config', error.config);
    }
  };

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  // Prepend the base URL to the user image path
  const userImageUrl = userData.user_image ? `${BASE_URL}${userData.user_image}` : placeholderImage;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onPress={handleImageUpload}
        style={styles.imageContainer} // Added margin to move input fields down
      >
        <Image 
          source={{ uri: userImageUrl }} // Use the full URL for the user image
          style={styles.profileImage}
          resizeMode="cover" // Ensure the image covers the area and is centered
        />
        {isHovered && <Text style={styles.uploadText}>Upload Image</Text>}
      </TouchableOpacity>
      <Text style={styles.title}>{userData.username}</Text>
      
      <TextInput
        style={styles.input}
        value={userData.first_name}
        placeholder="First Name"
        onChangeText={(text) => handleTextChange('first_name', text)}
      />
      <TextInput
        style={styles.input}
        value={userData.last_name}
        placeholder="Last Name"
        onChangeText={(text) => handleTextChange('last_name', text)}
      />
      <TextInput
        style={styles.input}
        value={userData.email}
        placeholder="Email"
        onChangeText={(text) => handleTextChange('email', text)}
      />
      <TextInput
        style={styles.input}
        value={userData.role_name}
        placeholder="Role"
        editable={false}
      />
      {(userData.role_name === 'staff' || userData.role_name === 'manager') && (
        <TextInput
          style={styles.input}
          value={userData.branch_name}
          placeholder="Branch Name"
          editable={false}
        />
      )}
      <CustomButton onPress={handleSave} backgroundColor="#007bff" width="80%">
        <Text style={styles.buttonText}>Save</Text>
      </CustomButton>
    </View>
  );
};

export default UserProfile;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center', // Center the content
    backgroundColor: '#f8f9fa',
  },
  imageContainer: {
    marginBottom: 20, // Added margin to move input fields down
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make the image circular
    borderWidth: 2, // Add border width
    borderColor: '#000', // Add border color
    marginBottom: 10,
    resizeMode: 'cover', // Ensure the image covers the area and is centered
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30, // Adjusted margin to move the title below the image
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 30, // Adjusted margin bottom for inputs
    paddingHorizontal: 10,
    width: '80%',
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
