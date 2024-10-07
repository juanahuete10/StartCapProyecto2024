import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig';

export default function Inicio({ navigation, emprendedorId }) { // Asumiendo que recibes el ID del emprendedor como props
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState('');

  const cargarProyectos = async () => {
    // Filtramos por el ID del emprendedor y el sector si está definido
    const q = filtro
      ? query(collection(db, 'proyectos'), where('id_emprend', '==', emprendedorId), where('sector', '==', filtro))
      : query(collection(db, 'proyectos'), where('id_emprend', '==', emprendedorId));
    
    const querySnapshot = await getDocs(q);
    const proyectosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProyectos(proyectosData);
  };

  useEffect(() => {
    cargarProyectos();
  }, [filtro]);

  // Función para manejar el 'Me encanta'
  const handleMeEncanta = async (id, likes) => {
    const proyectoRef = doc(db, 'proyectos', id);
    await updateDoc(proyectoRef, { likes: likes + 1 });
    cargarProyectos(); // Volver a cargar los proyectos después de actualizar
  };

  // Función para navegar al chat con el emprendedor
  const handleChat = (emprendedorId) => {
    navigation.navigate('Chat', { emprendedorId });
  };

  // Renderiza cada proyecto en la lista
  const renderProyecto = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: item.emprendedorFoto }} style={styles.avatar} />
        <Text style={styles.emprendedorNombre}>{item.emprendedorNombre}</Text>
      </View>
      <Text style={styles.proyectoDescripcion}>{item.descripcion}</Text>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => handleMeEncanta(item.id, item.likes)}>
          <Text style={styles.iconText}>❤️ {item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChat(item.id_emprend)}>
          <Text style={styles.iconText}>💬 Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Filtrar por sector"
        value={filtro}
        onChangeText={setFiltro}
      />
      <FlatList
        data={proyectos}
        renderItem={renderProyecto}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#005EB8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  emprendedorNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  proyectoDescripcion: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconText: {
    fontSize: 16,
    color: '#ff6347', // Color para 'Me encanta' y 'Chat'
  },
});
