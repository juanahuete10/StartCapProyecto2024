import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { db } from '../../firebase/firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';

const Proyectos = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [id_emprend, setIdEmprend] = useState(1); // Cambia esto según el ID del emprendedor correspondiente

  const limpiarCampos = () => {
    setNombre('');
    setDescripcion('');
    setCategoria('');
    setUbicacion('');
  };

  const guardarProyecto = async () => {
    if (!nombre || !descripcion || !categoria || !ubicacion) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      const id_Proyecto = Date.now().toString(); 

      await setDoc(doc(db, "proyectos", id_Proyecto), {
        nombre,
        descripcion,
        categoria,
        ubicacion,
        id_emprend,
      });
      Alert.alert("Proyecto guardado con éxito!");
      limpiarCampos();
      navigation.navigate('ProyectosDashboard'); // Redirige a la pantalla de proyectos
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      Alert.alert("Hubo un error al guardar el proyecto.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nombre del Proyecto:</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} />

      <Text style={styles.label}>Categoría:</Text>
      <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} />

      <Text style={styles.label}>Ubicación:</Text>
      <TextInput style={styles.input} value={ubicacion} onChangeText={setUbicacion} />

      <TouchableOpacity style={styles.button} onPress={guardarProyecto}>
        <Text style={styles.buttonText}>Guardar Proyecto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAE3',
  },
  label: {
    fontSize: 16,
    fontFamily: 'TW CEN MT',
    fontWeight: 'bold',
    color: '#005EB8',
    marginVertical: 8,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  input: {
    width: '90%',
    borderWidth: 2,
    borderColor: '#005EB8',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    fontFamily: 'TW CEN MT',
    color: '#333',
    backgroundColor: '#FFFFFF',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#005EB8',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'TW CEN MT',
  },
});

export default Proyectos;
