import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase/firebaseconfig';
import { LinearGradient } from 'expo-linear-gradient';

export default function ListarProyectos({ navigation }) {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  const cargarProyectos = async () => {
    setLoading(true);
    try {
      const proyectosCollection = collection(db, 'proyectos');
      const proyectosSnapshot = await getDocs(proyectosCollection);
      const proyectosData = await Promise.all(
        proyectosSnapshot.docs.map(async (projectDoc) => {
          const projectData = projectDoc.data();
          const emprendedorRef = doc(db, 'emprendedor', projectData.id_emprendedor);
          const emprendedorSnap = await getDoc(emprendedorRef);

          // Validación para verificar si el documento del emprendedor existe
          const emprendedorData = emprendedorSnap.exists() ? emprendedorSnap.data() : null;
          if (!emprendedorData) {
            console.warn(`No se encontraron datos de emprendedor para el UID: ${projectData.id_emprendedor}`);
          }

          return {
            id: projectDoc.id,
            ...projectData,
            emprendedor: emprendedorData,
          };
        })
      );
      setProyectos(proyectosData);
    } catch (error) {
      console.error("Error cargando proyectos:", error);
      Alert.alert("Error", "Hubo un problema al cargar los proyectos.");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  const renderProyecto = ({ item }) => (
    <View style={styles.projectCard}>
      <View style={styles.projectHeader}>
        {item.emprendedor?.fotoPerfil ? (
          <Image
            source={{ uri: item.emprendedor.fotoPerfil }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <Text style={styles.projectAuthor}>
          {item.emprendedor?.nombre1 ||apellido2 || (item.emprendedor?.uid === auth.currentUser?.uid ? auth.currentUser?.displayName : 'Usuario desconocido')}
        </Text>
      </View>
      <Text style={styles.projectName}>{item.nombre1}</Text>
      <Text style={styles.projectDescription}>{item.descripcion}</Text>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => navigation.navigate('ProyectoDetalles', { proyectoId: item.id })}
      >
        <Text style={styles.viewButtonText}>Ver Detalles</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#005EB8" style={styles.loading} />;
  }

  return (
    <LinearGradient 
      colors={['#B8CDD6', '#FFFFFF']} 
      style={styles.container}
    >
      <FlatList
        data={proyectos}
        renderItem={renderProyecto}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.projectsList}
        ListEmptyComponent={<Text>No se encontraron proyectos</Text>}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  projectsList: {
    padding: 20,
    paddingBottom: 80,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    backgroundColor: '#C4C4C4',
    borderRadius: 20,
    marginRight: 10,
  },
  projectAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005EB8',
    marginVertical: 5,
  },
  projectDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  viewButton: {
    backgroundColor: '#005EB8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
