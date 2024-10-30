import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../../firebase/firebaseconfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ExploracionProyecto() {
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        let q;

        if (filtro) {
          // Si hay un filtro, hacemos la consulta por sector
          q = query(collection(db, 'proyectos'), where('sector', '==', filtro));
        } else {
          // Si no hay filtro, obtenemos todos los proyectos
          q = collection(db, 'proyectos');
        }

        const querySnapshot = await getDocs(q);
        const proyectosFiltrados = querySnapshot.docs.map(doc => ({
          id: doc.id, // Incluye el ID del documento
          ...doc.data()
        }));

        setProyectos(proyectosFiltrados);
      } catch (error) {
        console.error('Error al obtener proyectos:', error);
      }
    };

    obtenerProyectos();
  }, [filtro]);

  return (
    <View>
      <TextInput
        placeholder="Filtrar por sector"
        value={filtro}
        onChangeText={setFiltro}
      />
      <FlatList
        data={proyectos}
        keyExtractor={item => item.id} // Usa el ID como clave
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Text>{item.nombreProyecto}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
