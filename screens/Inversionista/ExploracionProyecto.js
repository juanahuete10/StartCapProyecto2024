import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../../firebase/firebaseconfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ExploracionProyecto() {
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const obtenerProyectos = async () => {
      const q = query(collection(db, 'proyectos'), where('sector', '==', filtro));
      const querySnapshot = await getDocs(q);
      const proyectosFiltrados = querySnapshot.docs.map(doc => doc.data());
      setProyectos(proyectosFiltrados);
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
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Text>{item.nombreProyecto}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
