import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseconfig';
import { useEffect, useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Text } from 'react-native';
import { serverTimestamp } from 'firebase/firestore';

const ChatE = ({ route }) => {
  const { otherUserId } = route.params || {}; // Maneja undefined

  // Maneja el caso donde otherUserId no está definido
  if (!otherUserId) {
    console.error("otherUserId no está definido");
    return <Text>Error: User ID no encontrado.</Text>; // Muestra un mensaje de error
  }

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Verifica si el usuario está autenticado
    if (!auth.currentUser) {
      console.error("Usuario no autenticado");
      return;
    }

    // Consulta para obtener los mensajes
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', auth.currentUser.uid),
      orderBy('createdAt', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ ...doc.data(), id: doc.id });
      });
      setMessages(msgs);
    });

    return () => unsubscribe(); // Limpia la suscripción al desmontar el componente
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await addDoc(collection(db, 'chats'), {
          participants: [auth.currentUser.uid, otherUserId],
          senderId: auth.currentUser.uid,
          receiverId: otherUserId,
          text: newMessage,
          createdAt: serverTimestamp(), 
        });
        setNewMessage(''); // Limpia el campo de entrada
      } catch (error) {
        console.error("Error enviando el mensaje: ", error);
      }
    } else {
      console.warn("El mensaje está vacío");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        {messages.map((message) => (
          <View key={message.id} style={{
            alignSelf: message.senderId === auth.currentUser.uid ? 'flex-end' : 'flex-start',
            backgroundColor: message.senderId === auth.currentUser.uid ? '#DCF8C6' : '#FFFFFF',
            padding: 10,
            borderRadius: 10,
            marginVertical: 5,
            maxWidth: '80%',
          }}>
            <Text>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 20,
            flex: 1,
            paddingHorizontal: 10,
            height: 40,
          }}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Escribe un mensaje..."
        />
        <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: 'bold', color: '#007BFF' }}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



export default ChatE;
