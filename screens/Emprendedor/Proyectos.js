import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../firebase/firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';

const Proyectos = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [categoriaPersonalizada, setCategoriaPersonalizada] = useState('');

  const limpiarCampos = () => {
    setNombre('');
    setDescripcion('');
    setCategoria('');
    setUbicacion('');
    setCategoriaPersonalizada('');
  };

  const guardarProyecto = async () => {
    if (!nombre || !descripcion || (!categoria && !categoriaPersonalizada) || !ubicacion) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      // Generar un ID único para el proyecto
      const id_Proyecto = Date.now().toString();
      const auth = getAuth();
      const uid = auth.currentUser ? auth.currentUser.uid : null;

      if (!uid) {
        Alert.alert("Error", "No se encontró el usuario autenticado.");
        return;
      }

      const categoriaFinal = categoria === 'Otras' ? categoriaPersonalizada : categoria;

      // Guardar el proyecto en Firestore
      await setDoc(doc(db, "proyectos", id_Proyecto), {
        id_proyecto: id_Proyecto, 
        nombre,
        descripcion,
        categoria: categoriaFinal,
        ubicacion,
        id_emprendedor: uid,
      });

      Alert.alert("Proyecto guardado con éxito!");
      limpiarCampos();
      navigation.navigate('EmprendedorDashboard');
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      Alert.alert("Hubo un error al guardar el proyecto.");
    }
  };

  return (
    <LinearGradient 
      colors={['#B8CDD6', '#FFFFFF']} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Registro de Proyecto</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre del Proyecto:</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ingresa el nombre"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={styles.input}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Ingresa la descripción"
            placeholderTextColor="#B0B0B0"
            multiline={true}
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Categoría:</Text>
          <Picker
            selectedValue={categoria}
            onValueChange={(itemValue) => {
              setCategoria(itemValue);
              if (itemValue !== 'Otras') {
                setCategoriaPersonalizada('');
              }
            }}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona una categoría" value="" />
            <Picker.Item label="Tecnología" value="Tecnología" />
            <Picker.Item label="Educación" value="Educación" />
            <Picker.Item label="Medio Ambiente" value="Medio Ambiente" />
            <Picker.Item label="Social" value="Social" />
            <Picker.Item label="Artes y Cultura" value="Artes y Cultura" />
            <Picker.Item label="Negocios" value="Negocios" />
            <Picker.Item label="Salud" value="Salud" />
            <Picker.Item label="Otras" value="Otras" />
          </Picker>

          {categoria === 'Otras' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Especifica la categoría:</Text>
              <TextInput
                style={styles.input}
                value={categoriaPersonalizada}
                onChangeText={setCategoriaPersonalizada}
                placeholder="Ingresa la categoría"
                placeholderTextColor="#B0B0B0"
              />
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ubicación:</Text>
          <TextInput
            style={styles.input}
            value={ubicacion}
            onChangeText={setUbicacion}
            placeholder="Ingresa la ubicación"
            placeholderTextColor="#B0B0B0"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={guardarProyecto}>
          <Text style={styles.buttonText}>Guardar Proyecto</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002f6c',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#002f6c',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default Proyectos;
