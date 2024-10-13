import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig';

export default function Inicio({ navigation, route }) {
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [id_emprendedor, setIdEmprendedor] = useState(null);

  useEffect(() => {
    // Verificar si route.params y route.params.id_emprendedor están definidos
    if (route.params && route.params.id_emprendedor) {
      setIdEmprendedor(route.params.id_emprendedor);
      console.log('Emprendedor ID:', route.params.id_emprendedor);
    } else {
      console.error("El ID del emprendedor no está definido en route.params.");
    }
  }, [route.params]);

  // Cargar proyectos al montar el componente o cuando cambie el filtro
  const cargarProyectos = async () => {
    if (!id_emprendedor) {
      console.error("El ID del emprendedor no está definido");
      return; // Salir si el ID no está definido
    }

    try {
      // Si hay filtro, añadir la condición de categoría, si no, cargar todos los proyectos del emprendedor
      const q = filtro
        ? query(collection(db, 'proyectos'), where('id_emprendedor', '==', id_emprendedor), where('categoria', '==', filtro)) 
        : query(collection(db, 'proyectos'), where('id_emprendedor', '==', id_emprendedor));

      const querySnapshot = await getDocs(q);
      const proyectosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProyectos(proyectosData);
    } catch (error) {
      console.error("Error cargando proyectos:", error);
    }
  };

  useEffect(() => {
    cargarProyectos();
  }, [filtro, id_emprendedor]);

  // Manejo del botón "Me encanta"
  const handleMeEncanta = async (id, likes) => {
    const proyectoRef = doc(db, 'proyectos', id);
    try {
      await updateDoc(proyectoRef, { likes: likes + 1 }); // Incrementar likes
      const updatedProyectos = proyectos.map((proyecto) =>
        proyecto.id === id ? { ...proyecto, likes: likes + 1 } : proyecto
      );
      setProyectos(updatedProyectos);
    } catch (error) {
      console.error("Error al dar 'me encanta':", error);
    }
  };

  // Navegar al chat
  const handleChat = (id_emprendedor) => {
    navigation.navigate('Chat', { id_emprendedor });
  };

  // Renderizar cada proyecto
  const renderProyecto = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: item.foto_perfil }} style={styles.avatar} />
        <Text style={styles.emprendedorNombre}>{item.nombre}</Text>
      </View>
      <Text style={styles.proyectoDescripcion}>{item.descripcion}</Text>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => handleMeEncanta(item.id, item.likes)}>
          <Text style={styles.iconText}>❤️ {item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChat(item.id_emprendedor)}>
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
        onChangeText={setFiltro} // Actualizar filtro al escribir
      />
      <FlatList
        data={proyectos}
        renderItem={renderProyecto}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No se encontraron proyectos</Text>} // Mostrar mensaje si no hay proyectos
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F9FC',
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
    color: '#ff6347',
  },
});
