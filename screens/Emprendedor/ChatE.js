import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebaseconfig';

const ChatE = ({ route }) => {
  const { id_emprendedor } = route.params || {}; // Receives the entrepreneur's ID

  // Error handling
  if (!id_emprendedor) {
    return (
      <View style={styles.container}>
        <Text>Error: no se pudo cargar el chat.</Text>
      </View>
    );
  }

  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [loading, setLoading] = useState(true);

  // Load messages from the conversation
  const cargarMensajes = async () => {
    setLoading(true);
    try {
      console.log("Cargando mensajes para id_emprendedor:", id_emprendedor); // Debugging line
      const q = query(
        collection(db, 'mensajes'),
        where('id_emprendedor', '==', id_emprendedor),
        orderBy('fecha') // Make sure 'fecha' is an actual field in your Firestore documents
      );
      const querySnapshot = await getDocs(q);
      const mensajesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMensajes(mensajesData);
    } catch (error) {
      console.error("Error cargando mensajes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send a new message
  const enviarMensaje = async () => {
    if (nuevoMensaje.trim()) {
      try {
        await addDoc(collection(db, 'mensajes'), {
          id_emprendedor,
          contenido: nuevoMensaje,
          fecha: new Date(), // Make sure 'fecha' is a valid Firestore Timestamp
        });
        setNuevoMensaje('');
        cargarMensajes(); // Reload messages after sending
      } catch (error) {
        console.error("Error enviando el mensaje:", error);
      }
    }
  };

  useEffect(() => {
    cargarMensajes();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#005EB8" style={styles.loading} />;
  }

  const renderMensaje = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.contenido}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mensajes}
        renderItem={renderMensaje}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        inverted // Show the last message at the end
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          value={nuevoMensaje}
          onChangeText={setNuevoMensaje}
        />
        <TouchableOpacity onPress={enviarMensaje} style={styles.sendButton}>
          <MaterialCommunityIcons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  messageList: {
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    borderRadius: 20,
    padding: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatE;
