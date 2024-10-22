import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../../firebase/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';

const ListarProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const proyectosSnapshot = await getDocs(collection(db, 'proyectos'));
        const proyectosList = proyectosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProyectos(proyectosList);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
        setLoading(false);
      }
    };

    fetchProyectos();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#005EB8" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={proyectos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.proyectoCard}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            <Text style={styles.categoria}>Categoría: {item.categoria}</Text>
            <Text style={styles.ubicacion}>Ubicación: {item.ubicacion}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFAE3',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proyectoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#005EB8',
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005EB8',
  },
  descripcion: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  categoria: {
    fontSize: 12,
    color: '#777',
  },
  ubicacion: {
    fontSize: 12,
    color: '#777',
  },
});

export default ListarProyectos;
