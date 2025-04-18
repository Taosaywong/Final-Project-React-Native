import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '@env'; 


const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Handle forgot password logic
  const handleForgotPassword = async () => {
    setLoading(true);
    setMessage('');
    setErrorMessage('');

    try {
      const response = await axios.post(`${BASE_URL}/api/forgot_password/`, { email });
      setMessage('A verification code has been sent to your email.');
      // Navigate to the Reset Password screen after successful email submission
      navigation.navigate('ResetPassword', { email });
    } catch (error) {
      setErrorMessage('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      {/* Forgot Password Title */}
      <Text category="h1" style={{ marginBottom: 20 }}>Forgot Password</Text>

      {/* Email Input */}
      <Input 
        label="Email"
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 16 }} 
      />

      {/* Error Message */}
      {errorMessage && <Text style={{ color: 'red', marginBottom: 16 }}>{errorMessage}</Text>}
      {message && <Text style={{ color: 'green', marginBottom: 16 }}>{message}</Text>}

      {/* Submit Button */}
      <Button style={{ marginBottom: 16 }} onPress={handleForgotPassword} disabled={loading}>
        <Text>{loading ? 'Sending...' : 'Submit'}</Text>
      </Button>

      {/* Login Link */}
      <Text 
        category="s1" 
        status="info" 
        onPress={() => navigation.navigate('Login')} 
        style={{ marginBottom: 16 }}
      >
        Remember your password? Login
      </Text>
    </Layout>
  );
};

export default ForgotPasswordScreen;
