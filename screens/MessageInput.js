import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase/firebaseconfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const MessageInput = ({ id_emprendedor, id_inversionista, onSendMessage }) => {
  const [mensaje, setMensaje] = useState('');

  const enviarMensaje = async () => {
    if (mensaje.trim() === '') {
      console.error("El mensaje no puede estar vacío");
      Alert.alert("Error", "El mensaje no puede estar vacío");
      return;
    }

    try {
      console.log("Enviando mensaje con ID emprendedor:", id_emprendedor, "ID inversionista:", id_inversionista);

      // Envía el mensaje a Firestore
      const docRef = await addDoc(collection(db, 'chats'), {
        id_emprendedor, // Debe estar definido
        id_inversionista, // Debe estar definido
        contenido: mensaje,
        fecha: serverTimestamp(),
        hora: serverTimestamp(),
      });
      console.log("Mensaje enviado con ID:", docRef.id);

      if (onSendMessage) {
        onSendMessage({
          id_emprendedor,
          id_inversionista,
          contenido: mensaje,
          fecha: new Date().toISOString(),
        });
      }

      setMensaje('');
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      Alert.alert("Error", "No se pudo enviar el mensaje");
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={mensaje}
        onChangeText={setMensaje}
        placeholder="Escribe tu mensaje..."
      />
      <Button title="Enviar" onPress={enviarMensaje} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: '#fff',
  },
});

export default MessageInput;
