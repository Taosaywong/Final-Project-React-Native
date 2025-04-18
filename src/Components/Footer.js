import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text category="s1" style={styles.footerText}>
        © 2024 My App. All rights reserved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  footerText: {
    color: '#757575',
  },
});

export default Footer;
