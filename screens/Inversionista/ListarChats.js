import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Button, StyleSheet } from 'react-native';
import { db } from '../../firebase/firebaseconfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ListarChats = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const userId = auth.currentUser?.uid; // Obtén el ID del usuario autenticado
    const chatsRef = collection(db, 'chats'); // Asegúrate de que esta colección exista

    const unsubscribe = onSnapshot(chatsRef, (querySnapshot) => {
      const chatList = [];
      querySnapshot.forEach((doc) => {
        chatList.push({ id: doc.id, ...doc.data() });
      });
      setChats(chatList);
    }, (error) => {
      console.error("Error al cargar los chats: ", error);
    });

    return () => unsubscribe();
  }, []);

  const goToChat = (chatData) => {
    navigation.navigate('Chats', { chatData });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <View style={styles.chatItem}>
            <Text>{item.chatName || item.id}</Text> {/* Muestra el nombre del chat */}
            <Button title="Abrir Chat" onPress={() => goToChat(item)} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
  },
  chatItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ListarChats;
