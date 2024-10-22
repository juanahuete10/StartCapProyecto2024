import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { db } from '../../firebase/firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';

const Proyectos = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [id_emprendedor, setIdEmprendedor] = useState(1); 

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
        id_emprendedor,
      });
      Alert.alert("Proyecto guardado con éxito!");
      limpiarCampos();
      navigation.navigate('ProyectosDashboard'); 
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      Alert.alert("Hubo un error al guardar el proyecto.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Nuevo Proyecto</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre del Proyecto:</Text>
        <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Ingresa el nombre" placeholderTextColor="#B0B0B0" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción:</Text>
        <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} placeholder="Ingresa la descripción" placeholderTextColor="#B0B0B0" multiline={true} numberOfLines={3} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Categoría:</Text>
        <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} placeholder="Ingresa la categoría" placeholderTextColor="#B0B0B0" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ubicación:</Text>
        <TextInput style={styles.input} value={ubicacion} onChangeText={setUbicacion} placeholder="Ingresa la ubicación" placeholderTextColor="#B0B0B0" />
      </View>

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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F2F4F8', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005EB8',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginLeft: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#005EB8',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FFFFFF',
    elevation: 1, 
  },
  button: {
    backgroundColor: '#005EB8',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Proyectos;
