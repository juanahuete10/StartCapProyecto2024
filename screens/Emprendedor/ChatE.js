import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { db, auth } from '../../firebase/firebaseconfig'; // Asegúrate de importar correctamente db y auth
import { collection, onSnapshot } from 'firebase/firestore';

const ChatE = ({ navigation }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'messages'), (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs.filter(msg =>
        msg.senderId === auth.currentUser.uid || msg.receiverId === auth.currentUser.uid
      ));
    }, (error) => {
      console.error("Error al obtener los mensajes: ", error);
    });

    return () => unsubscribe(); // Desuscribirse al desmontar el componente
  }, []);

  const handleSelectMessage = (receiverId) => {
    navigation.navigate('Mensaje', { receiverId }); // Navegar al componente Mensaje con el receiverId
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectMessage(item.senderId === auth.currentUser.uid ? item.receiverId : item.senderId)}>
            <View style={styles.messageContainer}>
              <Image source={{ uri: item.senderPhotoUrl }} style={styles.photo} />
              <Text style={styles.message}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  photo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  message: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
});

export default ChatE;
