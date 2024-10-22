import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig';

export default function Inicio({ navigation, userId }) { // Asegúrate de recibir userId
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);

  const cargarProyectos = async () => {
    setLoading(true);
    try {
      const q = filtro
        ? query(collection(db, 'proyectos'), where('categoria', '==', filtro))
        : collection(db, 'proyectos');

      const querySnapshot = await getDocs(q);
      const proyectosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProyectos(proyectosData);
    } catch (error) {
      console.error("Error cargando proyectos:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarProyectos();
  }, [filtro]);

  const handleMeEncanta = async (id, likes) => {
    const proyectoRef = doc(db, 'proyectos', id);
    try {
      await updateDoc(proyectoRef, { likes: (likes || 0) + 1 });
      const updatedProyectos = proyectos.map((proyecto) =>
        proyecto.id === id ? { ...proyecto, likes: (likes || 0) + 1 } : proyecto
      );
      setProyectos(updatedProyectos);
    } catch (error) {
      console.error("Error al dar 'me encanta':", error);
    }
  };

  const handleChats = (id_emprendedor) => {
    navigation.navigate('Chat', { id_emprendedor }); 
  };
  

  const renderProyecto = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        {item.fotoPerfil ? (
          <Image
            source={{ uri: item.fotoPerfil }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <Text style={styles.emprendedorNombre}>{item.nombre}</Text>
      </View>
      <Text style={styles.proyectoDescripcion}>{item.descripcion}</Text>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => handleMeEncanta(item.id, item.likes)}>
          <Text style={styles.iconText}>❤️ {item.likes || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChats(item.id_emprendedor)}>
          <Text style={styles.iconText}>💬 Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#005EB8" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Filtrar por categoría"
        value={filtro}
        onChangeText={setFiltro}
      />
      <FlatList
        data={proyectos}
        renderItem={renderProyecto}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No se encontraron proyectos</Text>}
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
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
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
    color: '#005EB8',
  },
});
