import React, { useEffect } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '@env'; 


const RefreshAccessToken = ({ refreshToken, setAccessToken }) => {
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        setAccessToken(newAccessToken);
      } catch (error) {
        console.error('Error refreshing access token:', error);

        if (error.response && error.response.status === 401) {
          // Token is invalid or expired, redirect to login page
          Alert.alert('Session Expired', 'Please log in again.', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]);
        }
      }
    }, 600000); // 10 minutes in milliseconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [refreshToken, setAccessToken, navigation]);

  return null; // This component doesn't need to render anything
};

export default RefreshAccessToken;
