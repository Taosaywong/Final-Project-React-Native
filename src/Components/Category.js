import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const CategorySection = ({categories, selectedCategory, onSelectCategory }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop by Category</Text>
      <FlatList
        data={categories}
        horizontal={true}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryCard, item.id === selectedCategory ? styles.selectedCategory : null]}
            onPress={() => onSelectCategory(item.id)}
          >
            <Image source={{ uri: item.image }} style={styles.categoryImage} />
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 6,
    marginRight: 12,
    width: 80,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategory: {
    backgroundColor: '#007bff',
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    resizeMode: 'contain',
  },
  categoryName: {
    marginTop: 4,
    fontSize: 10,
    color: '#333',
  },
});

export default CategorySection;
