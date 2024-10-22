import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../../firebase/firebaseconfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const ListarChats = ({ navigation, id_usuario, rol }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const chatsRef = query(
      collection(db, 'chats'),
      where(rol === 'emprendedor' ? 'id_emprendedor' : 'id_inversionista', '==', id_usuario)
    );

    const unsubscribe = onSnapshot(chatsRef, (querySnapshot) => {
      const chatsList = [];
      querySnapshot.forEach((doc) => {
        chatsList.push({ ...doc.data(), id: doc.id });
      });
      setChats(chatsList);
    });

    return () => unsubscribe();
  }, [id_usuario, rol]);

  const handleChatPress = (chat) => {
    navigation.navigate('ChatE', { chatId: chat.id, chatData: chat });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleChatPress(item)}>
            <Text style={styles.chatItem}>{item.id}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  chatItem: { fontSize: 18, padding: 10, borderBottomWidth: 1 }
});

export default ListarChats;
