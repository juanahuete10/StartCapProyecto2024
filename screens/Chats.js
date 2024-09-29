import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { db } from '../firebase/firebaseconfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function Chat({ proyectoId }) {
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    const obtenerMensajes = async () => {
      const mensajesSnapshot = await getDocs(collection(db, 'mensajes', proyectoId, 'chat'));
      const mensajesList = mensajesSnapshot.docs.map(doc => doc.data());
      setMensajes(mensajesList);
    };

    obtenerMensajes();
  }, []);

  const enviarMensaje = async () => {
    await addDoc(collection(db, 'mensajes', proyectoId, 'chat'), { mensaje });
    setMensaje('');
  };

  return (
    <View>
      <FlatList
        data={mensajes}
        renderItem={({ item }) => <Text>{item.mensaje}</Text>}
      />
      <TextInput value={mensaje} onChangeText={setMensaje} placeholder="Escribe tu mensaje" />
      <Button title="Enviar" onPress={enviarMensaje} />
    </View>
  );
}
