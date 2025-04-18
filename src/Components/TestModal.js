import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import ReusableModal from './Modal';

const TestModal = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="Show Modal" onPress={() => setModalVisible(true)} />
      <ReusableModal visible={modalVisible} onClose={() => setModalVisible(false)} title="Test Modal">
        <Text>Basic Content in Modal</Text>
      </ReusableModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TestModal;
