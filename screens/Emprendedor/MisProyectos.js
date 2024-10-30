import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { firestore } from '../../firebase/firebaseconfig'; 
import { getAuth } from 'firebase/auth';

const MisProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null); 
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const auth = getAuth();
        const uid = auth.currentUser ? auth.currentUser.uid : null;

        if (!uid) {
          console.log('No hay usuario autenticado.');
          return;
        }

        const proyectosSnapshot = await firestore.collection('proyectos')
          .where('id_emprendedor', '==', uid) // Cambia 'id_emprend' a 'id_emprendedor'
          .get();

        const listaProyectos = proyectosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProyectos(listaProyectos);
      } catch (error) {
        console.log('Error al obtener proyectos:', error);
      }
    };

    obtenerProyectos();
  }, []);

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
      alert('Proyecto actualizado correctamente');
      
      // Actualiza el listado de proyectos
      setProyectos(proyectos.map(proyecto => 
        proyecto.id === proyectoSeleccionado.id 
        ? { ...proyecto, nombre, descripcion, categoria, ubicacion }
        : proyecto
      ));
      
      setProyectoSeleccionado(null); // Reinicia el estado del proyecto seleccionado
    } catch (error) {
      console.log('Error al actualizar el proyecto:', error);
    }
  };

  return (
    <View>
      <Text>Mis Proyectos</Text>

      {proyectoSeleccionado ? (
        // Formulario de edición del proyecto seleccionado
        <View>
          <Text>Editar Proyecto</Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del proyecto"
          />
          <TextInput
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Descripción del proyecto"
          />
          <TextInput
            value={categoria}
            onChangeText={setCategoria}
            placeholder="Categoría"
          />
          <TextInput
            value={ubicacion}
            onChangeText={setUbicacion}
            placeholder="Ubicación"
          />
          <Button title="Guardar Cambios" onPress={guardarCambios} />
          <Button title="Cancelar" onPress={() => setProyectoSeleccionado(null)} />
        </View>
      ) : (
        // Lista de proyectos
        <FlatList
          data={proyectos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => seleccionarProyecto(item)}>
              <Text>{item.nombre}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default MisProyectos;
