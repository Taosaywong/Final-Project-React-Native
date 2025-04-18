import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '@env'; 

const ResetPasswordScreen = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  // Handle password reset logic
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setMessage('');
    setErrorMessage('');

    try {
      const requestData = {
        verification_code: verificationCode,
        new_password: newPassword,
        email: email,
      };
      console.log('Request Payload:', requestData);  // Debug log

      const response = await axios.post(`${BASE_URL}/api/reset_password/`, requestData);
      console.log('Response:', response.data);  // Debug log

      setMessage('Your password has been successfully reset. Please log in with your new password.');
      // After successful password reset, navigate to the Login page
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error:', error.response || error);  // Debug log
      if (error.response) {
        setErrorMessage(error.response.data.error || 'Failed to reset password. Please try again.');
      } else {
        setErrorMessage('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      {/* Reset Password Title */}
      <Text category="h1" style={{ marginBottom: 20 }}>Reset Password</Text>

      {/* Verification Code Input */}
      <Input 
        label="Verification Code"
        placeholder="Enter the verification code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        style={{ marginBottom: 16 }} 
      />

      {/* New Password Input */}
      <Input 
        label="New Password"
        placeholder="Enter your new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={{ marginBottom: 16 }} 
      />

      {/* Confirm Password Input */}
      <Input 
        label="Confirm Password"
        placeholder="Confirm your new password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={{ marginBottom: 16 }} 
      />

      {/* Error Message */}
      {errorMessage && <Text style={{ color: 'red', marginBottom: 16 }}>{errorMessage}</Text>}
      {message && <Text style={{ color: 'green', marginBottom: 16 }}>{message}</Text>}

      {/* Submit Button */}
      <Button style={{ marginBottom: 16 }} onPress={handleResetPassword} disabled={loading}>
        <Text>{loading ? 'Resetting...' : 'Reset Password'}</Text>
      </Button>

      {/* Login Link */}
      <Text 
        category="s1" 
        status="info" 
        onPress={() => navigation.navigate('Login')} 
        style={{ marginBottom: 16 }}
      >
        Remembered your password? Login
      </Text>
    </Layout>
  );
};

export default ResetPasswordScreen;
