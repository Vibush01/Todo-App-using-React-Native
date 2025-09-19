import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Platform,
  StatusBar,
  Text,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView 
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './components/Header';
import AddTask from './components/AddTask';
import TaskItem from './components/TaskItem';
import AuthScreen from './screens/LoginSignup';

import { auth, db } from './config/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    let unsubscribeTasks = () => {};
    if (user) {
      const tasksCollection = collection(db, 'users', user.uid, 'tasks');
      const q = query(tasksCollection, orderBy("createdAt", "desc"));
      unsubscribeTasks = onSnapshot(q, (querySnapshot) => {
        setTasks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    } else {
      setTasks([]);
    }
    return () => unsubscribeTasks();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);
    await updateDoc(taskDocRef, { completed: !currentStatus });
  };

  const handleDeleteTask = async (id) => {
    const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);
    await deleteDoc(taskDocRef);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <Header onSignOut={handleSignOut} />
        <View style={styles.content}>
          <FlatList
            data={tasks}
            renderItem={({ item }) => (
              <TaskItem
                item={item}
                onToggle={handleToggleComplete}
                onDelete={handleDeleteTask}
              />
            )}
            keyExtractor={(item) => item.id}
            style={styles.taskList}
            ListEmptyComponent={<Text style={styles.emptyListText}>No tasks added yet</Text>}
          />
        </View>
        <AddTask user={user} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  taskList: {
    flex: 1,
  },
  emptyListText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  }
});