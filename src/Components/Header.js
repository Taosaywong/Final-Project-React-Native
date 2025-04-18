import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons for the navigation icon

const Header = ({ title, onNavigate }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Left Section: Logo and App Name */}
      <View style={styles.leftSection}>
        <Image
          source={require('../../assets/icon.png')} // Replace with your logo path
          style={styles.logo}
        />
        <Text style={styles.appName}>Smart Shopping App</Text>
      </View>

      {/* Right Section: Navigation Icon */}
      <TouchableOpacity onPress={onNavigate}>
        <Ionicons name="menu" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 25,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Header;
