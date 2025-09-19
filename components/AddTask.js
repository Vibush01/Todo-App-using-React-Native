import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Keyboard, Alert } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const AddTask = ({ user }) => {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = async () => {
    if (!user) {
      Alert.alert("Not Signed In", "You must be signed in to add tasks.");
      return;
    }
    if (newTask.trim() === '') {
      Alert.alert('Empty Task', 'Please enter a task before adding.');
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.uid, 'tasks'), {
        title: newTask,
        completed: false,
        createdAt: serverTimestamp(),
      });
      setNewTask('');
      Keyboard.dismiss();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Add a new task..."
        placeholderTextColor="#888"
        value={newTask}
        onChangeText={setNewTask}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 15,
    borderRadius: 25,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default AddTask;