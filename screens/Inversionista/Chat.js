import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { auth, db } from '../../firebase/firebaseconfig';
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';

const Chat = ({ route, navigation }) => {
  const { otherUserId = '', otherUserRole = '' } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);

  // UID del usuario autenticado
  const userId = auth.currentUser?.uid;
  console.log("userId:", userId, "otherUserId:", otherUserId);

  useEffect(() => {
    if (!userId || !otherUserId) {
      Alert.alert("Error", "No se encontró el usuario con el que desea chatear.");
      navigation.goBack();
    } else {
      createNewChat();
    }
  }, [userId, otherUserId]);

  const createNewChat = async () => {
    try {
      const newChat = {
        id_inversionista: otherUserRole === 'Inversionista' ? otherUserId : userId,
        id_emprendedor: otherUserRole === 'Emprendedor' ? otherUserId : userId,
        fecha: new Date(),
        estado: 'No leído',
      };
      const chatDocRef = await addDoc(collection(db, 'chats'), newChat);
      console.log("Chat creado con ID:", chatDocRef.id);
      setChatId(chatDocRef.id);
      setLoading(false);
    } catch (error) {
      console.error("Error creando nuevo chat: ", error);
      Alert.alert("No se pudo crear el chat. Inténtalo de nuevo.");
    }
  };

  const onSend = useCallback(async (newMessages = []) => {
    const newMessage = newMessages[0];
    if (!userId || !chatId) return;

    try {
      const chatRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(chatRef, {
        contenido: newMessage.text,
        fecha: new Date(),
        id_usuario: userId,
        estado: 'No leído',
      });
      setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    } catch (error) {
      console.error("Error al enviar mensaje: ", error);
      Alert.alert("No se pudo enviar el mensaje. Inténtalo de nuevo.");
    }
  }, [chatId, userId]);

  useEffect(() => {
    if (chatId) {
      const chatRef = collection(db, 'chats', chatId, 'messages');
      const q = query(chatRef, orderBy('fecha', 'asc'));

      const unsubscribe = onSnapshot(q, snapshot => {
        const chatMessages = snapshot.docs.map(doc => ({
          _id: doc.id,
          text: doc.data().contenido,
          createdAt: doc.data().fecha.toDate(),
          user: {
            _id: doc.data().id_usuario,
          },
        }));

        console.log("Mensajes recibidos:", chatMessages);
        setMessages(chatMessages);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [chatId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: userId }}
      />
    </View>
  );
};

export default Chat;
