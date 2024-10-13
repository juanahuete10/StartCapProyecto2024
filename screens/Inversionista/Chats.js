import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebaseconfig';

export default function Chat({ route }) {
  const { id_emprendedor, id_inversionista } = route.params;
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  // Cargar mensajes del chat entre el emprendedor y el inversionista
  useEffect(() => {
    const q = query(
      collection(db, 'chats'),
      where('id_emprendedor', '==', id_emprendedor),
      where('id_inversionista', '==', id_inversionista),
      orderBy('fecha', 'asc'),
      orderBy('hora', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const mensajesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMensajes(mensajesData);
    });

    return () => unsubscribe();
  }, [id_emprendedor, id_inversionista]);

  // Enviar un nuevo mensaje
  const enviarMensaje = async () => {
    if (nuevoMensaje.trim() === '') return;

    try {
      const fechaActual = new Date();
      const fecha = fechaActual.toISOString().split('T')[0]; // yyyy-mm-dd
      const hora = fechaActual.toTimeString().split(' ')[0]; // hh:mm:ss

      await addDoc(collection(db, 'chats'), {
        id_emprendedor,
        id_inversionista,
        contenido: nuevoMensaje,
        fecha,
        hora,
        estado: 'No leído',
      });

      setNuevoMensaje(''); // Limpiar el campo de entrada
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  // Renderizar cada mensaje
  const renderMensaje = ({ item }) => (
    <View style={[styles.mensaje, item.id_emprendedor === id_emprendedor ? styles.emprendedor : styles.inversionista]}>
      <Text style={styles.contenido}>{item.contenido}</Text>
      <Text style={styles.fechaHora}>{item.fecha} {item.hora}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mensajes}
        renderItem={renderMensaje}
        keyExtractor={(item) => item.id.toString()}
        style={styles.listaMensajes}
        ListEmptyComponent={<Text>No hay mensajes aún</Text>}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={nuevoMensaje}
          onChangeText={setNuevoMensaje}
        />
        <TouchableOpacity style={styles.botonEnviar} onPress={enviarMensaje}>
          <Text style={styles.textoBoton}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F0F0F0',
  },
  listaMensajes: {
    flex: 1,
    marginBottom: 10,
  },
  mensaje: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  emprendedor: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  inversionista: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
  },
  contenido: {
    fontSize: 16,
  },
  fechaHora: {
    fontSize: 12,
    color: '#555',
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  botonEnviar: {
    backgroundColor: '#005EB8',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  textoBoton: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
