import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '@env'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  

  // Handle registration logic
  const handleRegister = async () => {
    // Validate input
    if (!username || !password || !email) {
      setErrorMessage('All fields are required.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    console.log('Attempting to register');  // Debug log
    try {
      const requestData = {
        username,
        password,
        email
      };
      console.log('Request Payload:', requestData);  // Debug log

      const response = await axios.post(`${BASE_URL}/api/register/`, requestData);
      console.log('Registration successful', response.data);  // Debug log

      // Navigate to the login page after successful registration
      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration failed', error.response || error);  // Debug log
      if (error.response) {
        setErrorMessage('Registration failed. Please try again.');
      } else {
        setErrorMessage('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      {/* Register Title */}
      <Text category="h1" style={{ marginBottom: 20 }}>Register</Text>

      {/* Username Input */}
      <Input
        label="Username"
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        style={{ marginBottom: 16 }}
      />

      {/* Email Input */}
      <Input
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 16 }}
      />

      {/* Password Input */}
      <Input
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ marginBottom: 16 }}
      />

      {/* Error Message */}
      {errorMessage && <Text style={{ color: 'red', marginBottom: 16 }}>{errorMessage}</Text>}

      {/* Register Button */}
      <Button style={{ marginBottom: 16 }} onPress={handleRegister} disabled={loading}>
        <Text>{loading ? 'Registering...' : 'Register'}</Text>
      </Button>

      {/* Navigate to Login Page */}
      <Text
        category="s1"
        status="info"
        onPress={() => navigation.navigate('Login')}
        style={{ marginBottom: 16 }}
      >
        Already have an account? Login
      </Text>
    </Layout>
  );
};

export default Register;
