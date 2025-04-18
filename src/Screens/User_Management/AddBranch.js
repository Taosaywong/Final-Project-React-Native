import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../Components/CustomButton';
import { BASE_URL } from '@env'; 

const AddBranch = ({ navigation: nav }) => {
  const [branchData, setBranchData] = useState({
    branch_name: '',
    branch_address: '',
  });
  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setBranchData({ ...branchData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/branches/`, {
        name: branchData.branch_name,
        address: branchData.branch_address,
      });
      console.log(response.data);
      Alert.alert('Branch Added Successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error Adding New Branch', error);
      Alert.alert('Error', 'Something went wrong while adding the branch');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Branch Name"
        value={branchData.branch_name}
        onChangeText={(text) => handleInputChange('branch_name', text)}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Branch Address"
        value={branchData.branch_address}
        onChangeText={(text) => handleInputChange('branch_address', text)}
        multiline
        numberOfLines={4}
      />

        <CustomButton 
        color="white" 
        backgroundColor="#1c91bd"
        iconName="add-outline"
        iconSize={14}
        onPress={handleSubmit}
        >
            Add Branch
        </CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default AddBranch;
