import React, { useState } from 'react';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env'; 



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post(`${BASE_URL}/api/user/login/`, { username, password });
      const { access, refresh, user } = response.data;
      console.log(response.data);

      await AsyncStorage.multiSet([['access_token', access], ['refresh_token', refresh], ['role' , user.role]]);

      switch (user.role) {
        case 'customer':
          navigation.navigate('CustomerDrawer', { userId: user.id, role: user.role, authToken: access });
          break;
        case 'admin':
          navigation.navigate('AdminDrawer', { userId: user.id, role: user.role, authToken: access });
          break;
        case 'manager':
          navigation.navigate('ManagerDrawer', { userId: user.id, role: user.role, branchId: user.branchId, branchName: user.branchName, authToken: access });
          break;
        case 'staff':
          navigation.navigate('StaffDrawer', { userId: user.id, role: user.role, branchId: user.branchId, branchName: user.branchName, authToken: access });
          break;
        default:
          setErrorMessage('Invalid user role');
      }
    } catch (error) {
      setErrorMessage('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <Text category="h1" style={{ marginBottom: 20 }}>Login</Text>
      <Input label="Username" placeholder="Enter your username" value={username} onChangeText={setUsername} style={{ marginBottom: 16 }} />
      <Input label="Password" placeholder="Enter your password" secureTextEntry value={password} onChangeText={setPassword} style={{ marginBottom: 16 }} />
      {errorMessage && <Text style={{ color: 'red', marginBottom: 16 }}>{errorMessage}</Text>}
      <Button style={{ marginBottom: 16 }} onPress={handleLogin} disabled={loading}><Text>{loading ? 'Logging in...' : 'Login'}</Text></Button>
      <Text category="s1" status="info" onPress={() => navigation.navigate('Register')} style={{ marginBottom: 16 }}>Don't have an account? Register</Text>
      <Text category="s1" status="info" onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password?</Text>
    </Layout>
  );
};

export default Login;
