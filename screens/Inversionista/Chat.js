import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { db, auth } from '../../firebase/firebaseconfig';
import { collection, onSnapshot, addDoc, query, where } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

const Chat = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const { id_inversionista, id_emprendedor } = route.params || {};

  // Verificar parámetros recibidos
  useEffect(() => {
    console.log('route.params:', route.params); // Muestra todos los parámetros recibidos
    if (!id_inversionista || !id_emprendedor) {
      Alert.alert('Error', 'ID de inversionista o emprendedor faltante');
    }
  }, [route.params]);

  // Suscripción para escuchar cambios en la colección de mensajes
  useEffect(() => {
    if (!id_inversionista || !id_emprendedor) {
      console.log('ID de inversionista o emprendedor faltante');
      return;
    }

    const messagesRef = collection(db, 'chats');
    const chatQuery = query(
      messagesRef,
      where("id_inversionista", "==", id_inversionista),
      where("id_emprendedor", "==", id_emprendedor)
    );

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Ordenar mensajes por timestamp
      setMessages(messagesList.sort((a, b) => a.timestamp - b.timestamp));
    });

    return () => unsubscribe();
  }, [id_inversionista, id_emprendedor]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') {
      Alert.alert('El mensaje no puede estar vacío');
      return;
    }

    if (!id_inversionista || !id_emprendedor) {
      Alert.alert('Error al enviar el mensaje', 'ID de inversionista o emprendedor faltante');
      return;
    }

    try {
      await addDoc(collection(db, 'chats'), {
        text: newMessage,
        senderId: auth.currentUser.uid,
        timestamp: new Date(),
        id_inversionista,
        id_emprendedor,
      });

      setNewMessage('');
    } catch (error) {
      Alert.alert('Error al enviar el mensaje', error.message);
    }
  };

  return (
    <LinearGradient colors={['#B8CDD6', '#FFFFFF']} style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.senderId === auth.currentUser.uid ? styles.sent : styles.received]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Escribe un mensaje..."
      />
      <TouchableOpacity onPress={sendMessage} style={styles.button}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  message: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#007BFF',
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Chat;
