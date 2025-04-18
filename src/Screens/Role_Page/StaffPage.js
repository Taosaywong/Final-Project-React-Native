import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../Components/Header'; // Adjust path as necessary
import Footer from '../../Components/Footer'; // Adjust path as necessary

const StaffPage = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Staff Page Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Staff Page</Text>
        {/* Add staff-specific content here */}
        <Text style={styles.description}>Welcome, Staff member. You have access to manage staff activities.</Text>
      </View>

      {/* Footer */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default StaffPage;
