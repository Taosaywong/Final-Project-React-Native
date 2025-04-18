import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
// ...existing code...

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // Perform login logic here, e.g., API call
      const response = await axios.post(`${baseURL}/api/login/`, { username, password });
      const { role, branchId } = response.data;

      if (role === 'manager') {
        navigation.navigate('ManagerDrawer', { role, branchId });
      } else {
        // Handle other roles or show an error
        setError('Invalid role');
      }
    } catch (error) {
      setError('Login failed');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default Login;
