import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';

const FlatListing = ({ 
    data, 
    renderItem, 
    keyExtractor, 
    itemSeparatorComponent, 
    listFooterComponent,
    listHeaderComponent 
}) => {    
    return (
        <FlatList 
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={itemSeparatorComponent}
        ListFooterComponent={listFooterComponent}
        ListHeaderComponent={listHeaderComponent}
        contentContainerStyle={styles.list} // Apply styles correctly
        />
    );
}

const styles = StyleSheet.create({
    list: {
        flexGrow: 1,
        width: '100%',
    },
    separator: {
        width: 10,
    }
});

export default FlatListing;
