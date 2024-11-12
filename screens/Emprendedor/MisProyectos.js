import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firestore } from '../../firebase/firebaseconfig'; 

const MisProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        Alert.alert('Error', 'Inicia sesión para ver tus proyectos.');
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!uid) return;
    const obtenerProyectos = async () => {
      try {
        const proyectosSnapshot = await firestore
          .collection('proyectos')
          .where('id_emprendedor', '==', uid)
          .get();

        const listaProyectos = proyectosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProyectos(listaProyectos);
      } catch (error) {
        console.error('Error al obtener proyectos:', error);
      }
    };
    obtenerProyectos();
  }, [uid]);

  const seleccionarProyecto = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setNombre(proyecto.nombre);
    setDescripcion(proyecto.descripcion);
    setCategoria(proyecto.categoria);
    setUbicacion(proyecto.ubicacion);
  };

  const guardarCambios = async () => {
    if (!proyectoSeleccionado) return;

    try {
      await firestore.collection('proyectos').doc(proyectoSeleccionado.id).update({
        nombre,
        descripcion,
        categoria,
        ubicacion,
      });
      Alert.alert('Proyecto actualizado correctamente');

      setProyectos(proyectos.map(proyecto => 
        proyecto.id === proyectoSeleccionado.id 
        ? { ...proyecto, nombre, descripcion, categoria, ubicacion }
        : proyecto
      ));

      setProyectoSeleccionado(null);
    } catch (error) {
      console.error('Error al actualizar el proyecto:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Proyectos</Text>

      {proyectoSeleccionado ? (
        <View style={styles.editContainer}>
          <Text style={styles.editHeader}>Editar Proyecto</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del proyecto"
          />
          <TextInput
            style={styles.input}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Descripción del proyecto"
          />
          <TextInput
            style={styles.input}
            value={categoria}
            onChangeText={setCategoria}
            placeholder="Categoría"
          />
          <TextInput
            style={styles.input}
            value={ubicacion}
            onChangeText={setUbicacion}
            placeholder="Ubicación"
          />
          <Button title="Guardar Cambios" onPress={guardarCambios} />
          <Button title="Cancelar" onPress={() => setProyectoSeleccionado(null)} />
        </View>
      ) : (
        <FlatList
          data={proyectos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => seleccionarProyecto(item)} style={styles.projectCard}>
              <Text style={styles.projectName}>{item.nombre}</Text>
              <Text>{item.descripcion}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  editContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  editHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  projectCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MisProyectos;
