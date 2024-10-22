import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../../firebase/firebaseconfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import MessageInput from '../MessageInput';

const Chats = ({ route }) => {
  const { id_emprendedor, id_inversionista } = route.params || {};

  // Debugging: imprime los parámetros
  console.log("Parámetros recibidos en Chats:", { id_emprendedor, id_inversionista });

  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    if (id_emprendedor && id_inversionista) {
      const chatRef = query(
        collection(db, 'chats'),
        where('id_emprendedor', '==', id_emprendedor),
        where('id_inversionista', '==', id_inversionista),
        orderBy('fecha', 'desc'),
        orderBy('hora', 'desc')
      );

      const unsubscribe = onSnapshot(chatRef, (querySnapshot) => {
        const mensajesFirestore = [];
        querySnapshot.forEach((doc) => {
          mensajesFirestore.push({ ...doc.data(), id: doc.id });
        });
        setMensajes(mensajesFirestore);
      });

      return () => unsubscribe();
    } else {
      console.error("Los IDs son indefinidos. No se puede establecer la consulta.");
    }
  }, [id_emprendedor, id_inversionista]);

  return (
    <View style={styles.container}>
      <FlatList
        data={mensajes}
        inverted
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.contenido}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <MessageInput 
        id_emprendedor={id_emprendedor} 
        id_inversionista={id_inversionista} 
        onSendMessage={(msg) => setMensajes(prev => [msg, ...prev])} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});

export default Chats;
