// DetalleMensaje.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { db, auth } from '../../firebase/firebaseconfig'; // Ajusta la ruta según tu estructura
import { collection, onSnapshot, addDoc } from 'firebase/firestore';

const DetalleMensaje = ({ route }) => {
  const { chatId } = route.params; // Asegúrate de pasar chatId al navegar
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'chats', chatId, 'mensajes'), (snapshot) => {
      const mensajesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMensajes(mensajesData);
    });

    return () => unsubscribe();
  }, [chatId]);

  const enviarMensaje = async () => {
    if (nuevoMensaje.trim() === '') {
      Alert.alert("Error", "El mensaje no puede estar vacío.");
      return;
    }

    const mensaje = {
      texto: nuevoMensaje,
      fecha: new Date(),
      uid: auth.currentUser.uid, // UID del usuario autenticado
    };

    try {
      await addDoc(collection(db, 'chats', chatId, 'mensajes'), mensaje);
      setNuevoMensaje('');
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      Alert.alert("Hubo un error al enviar el mensaje.");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mensajes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.mensaje, item.uid === auth.currentUser.uid ? styles.mensajePropio : styles.mensajeAjeno]}>
            <Text>{item.texto}</Text>
          </View>
        )}
        inverted // Para mostrar el último mensaje en la parte inferior
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={nuevoMensaje}
          onChangeText={setNuevoMensaje}
          placeholder="Escribe un mensaje..."
        />
        <TouchableOpacity onPress={enviarMensaje} style={styles.botonEnviar}>
          <Text style={styles.botonTexto}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 8,
  },
  botonEnviar: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 10,
    marginLeft: 8,
  },
  botonTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  mensaje: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  mensajePropio: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-end',
  },
  mensajeAjeno: {
    backgroundColor: '#f8d7da',
    alignSelf: 'flex-start',
  },
});

export default DetalleMensaje;
