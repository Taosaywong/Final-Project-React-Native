import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../Components/Header'; // Adjust path as necessary
import Footer from '../../Components/Footer'; // Adjust path as necessary

const AdminPage = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Admin Page Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Admin Page</Text>
        {/* Add more admin page specific content here */}
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
});

export default AdminPage;
