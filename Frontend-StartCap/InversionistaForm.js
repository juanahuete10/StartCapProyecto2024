import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebase/firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';

const InversionistaForm = () => {
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [cedula, setCedula] = useState('');
  const [correo, setCorreo] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [foto_perfil, setFotoPerfil] = useState(null);

  const validarCedula = (text) => {
    const regex = /^[0-9]{3}-[0-9]{6}-[0-9]{4}[A-Za-z]$/; // 15 caracteres incluyendo guiones
    return regex.test(text);
  };

  const formatearCedula = (text) => {
    let newText = text.replace(/[^0-9A-Za-z]/g, '');

    // Añade los guiones automáticamente según la longitud
    if (newText.length > 3) newText = `${newText.slice(0, 3)}-${newText.slice(3)}`;
    if (newText.length > 11) newText = `${newText.slice(0, 11)}-${newText.slice(11)}`;

    setCedula(newText);
  };

  const limpiarCampos = () => {
    setNombre1('');
    setNombre2('');
    setApellido1('');
    setApellido2('');
    setCedula('');
    setCorreo('');
    setLocalidad('');
    setFotoPerfil(null);
  };

  const guardarInversionista = async () => {
    if (!nombre1 || !apellido1 || !cedula || !correo || !localidad) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos.");
      return;
    }

    if (!validarCedula(cedula)) {
      Alert.alert("Error", "La cédula no es válida, debe tener 15 caracteres incluyendo guiones.");
      return;
    }

    try {
      // Genera un ID único automáticamente (puedes personalizar la lógica aquí)
      const id_Usuario = Date.now().toString(); // Usar timestamp como ID único

      await setDoc(doc(db, "inversionistas", id_Usuario), {
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        cedula,
        correo,
        localidad,
        foto_perfil,
      });
      Alert.alert("Éxito", "Inversionista guardado con éxito!");

      limpiarCampos();
    } catch (error) {
      console.error("Error al guardar inversionista:", error);
      Alert.alert("Error", "Hubo un error al guardar el inversionista.");
    }
  };

  const seleccionarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permiso requerido", "Se necesita permiso para acceder a la galería.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFotoPerfil(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {foto_perfil && (
        <Image
          source={{ uri: foto_perfil }} 
          style={styles.fotoPerfil} 
        />
      )}
      <TouchableOpacity style={styles.button} onPress={seleccionarFoto}>
        <Text style={styles.buttonText}>Seleccionar Foto</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Primer Nombre:</Text>
      <TextInput style={styles.input} value={nombre1} onChangeText={setNombre1} />

      <Text style={styles.label}>Segundo Nombre:</Text>
      <TextInput style={styles.input} value={nombre2} onChangeText={setNombre2} />

      <Text style={styles.label}>Primer Apellido:</Text>
      <TextInput style={styles.input} value={apellido1} onChangeText={setApellido1} />

      <Text style={styles.label}>Segundo Apellido:</Text>
      <TextInput style={styles.input} value={apellido2} onChangeText={setApellido2} />

      <Text style={styles.label}>Cédula:</Text>
      <TextInput
        style={styles.input}
        value={cedula}
        onChangeText={formatearCedula}
        placeholder="000-000000-0000#"
        maxLength={15} 
      />

      <Text style={styles.label}>Correo:</Text>
      <TextInput style={styles.input} value={correo} onChangeText={setCorreo} />

      <Text style={styles.label}>Localidad:</Text>
      <TextInput style={styles.input} value={localidad} onChangeText={setLocalidad} />

      <TouchableOpacity style={styles.button} onPress={guardarInversionista}>
        <Text style={styles.buttonText}>Registrarse</Text>
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
  fotoPerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#005EB8',
    fontFamily: 'TW CEN MT',
    textAlign: 'center',
  },
});

export default InversionistaForm;
