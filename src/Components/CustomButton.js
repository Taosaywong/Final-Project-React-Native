import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'

const CustomButton = ({ onPress, backgroundColor, color, children, iconName, iconSize = 24 }) => {
  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.button, 
        pressed && styles.pressed, 
        { backgroundColor }
      ]}
    >
      <View style={styles.contentContainer}>
        {iconName && <Ionicons name={iconName} size={iconSize} color={color} style={styles.icon} />}
        <Text style={[styles.text, { color }]}>{children}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', // Aligns icon and text horizontally
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default CustomButton;
