import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importar el Picker correcto
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebase/firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';

const InversionistaForm = ({ navigation }) => {
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [cedula, setCedula] = useState('');
  const [genero, setGenero] = useState('');
  const [fecha_nac, setFechaNac] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [preferencia, setPreferencia] = useState('');
  const [foto_perfil, setFotoPerfil] = useState(null);

  // Valida que la cédula tenga el formato correcto
  const validarCedula = () => {
    const cedulaRegex = /^\d{3}-\d{6}-\d{4}[A-Za-z]$/;
    return cedulaRegex.test(cedula);
  };

  // Formatea la cédula automáticamente mientras se escribe
  const handleCedulaChange = (text) => {
    let cleaned = text.replace(/[^0-9A-Za-z]/g, '');
    const digits = cleaned.slice(0, 13);
    const letter = cleaned.slice(13, 14).toUpperCase();
    let formattedDigits = digits.replace(/(\d{3})(\d{6})(\d{4})/, '$1-$2-$3');
    const formattedCedula = letter ? `${formattedDigits}${letter}` : formattedDigits;
    setCedula(formattedCedula);
  };

  // Limpia todos los campos del formulario
  const limpiarCampos = () => {
    setNombre1('');
    setNombre2('');
    setApellido1('');
    setApellido2('');
    setCedula('');
    setGenero('');
    setFechaNac('');
    setLocalidad('');
    setDescripcion('');
    setPreferencia('');
    setFotoPerfil(null);
  };

  // Guarda el inversionista en Firebase
  const guardarInversionista = async () => {
    if (!nombre1 || !apellido1 || !apellido2 || !cedula || !genero || !fecha_nac || !localidad || !descripcion || !preferencia) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos.");
      return;
    }

    if (!validarCedula()) {
      Alert.alert("Error", "La cédula no es válida, debe tener 15 caracteres incluyendo guiones.");
      return;
    }

    try {
      // Genera un ID único para el usuario
      const usuarios = Date.now().toString();

      // Guarda los datos en Firestore
      await setDoc(doc(db, "inversionistas", id_usuario), {
        id_usuario: id_usuario, 
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        cedula,
        genero,
        fecha_nac,
        localidad,
        descripcion,
        preferencia,
        foto_perfil,
      });

      Alert.alert("Inversionista guardado con éxito!");
      limpiarCampos(); // Limpia los campos después de guardar
      navigation.navigate('InversionistaDashboard'); // Redirige al dashboard del inversionista
    } catch (error) {
      console.error("Error al guardar inversionista:", error);
      Alert.alert("Hubo un error al guardar el inversionista.");
    }
  };

  // Permite al usuario seleccionar una foto de perfil desde la galería
  const seleccionarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Se necesita permiso para acceder a la galería.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFotoPerfil(result.assets[0].uri); // Guarda la URI de la imagen
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
      <TouchableOpacity onPress={seleccionarFoto}>
        <Text style={styles.selectPhotoText}>Seleccionar Foto de Perfil</Text>
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
        onChangeText={handleCedulaChange}
        placeholder="000-000000-0000Z"
        keyboardType="default"
        maxLength={16}
      />

      <Text style={styles.label}>Género:</Text>
      <Picker
        selectedValue={genero}
        style={styles.input}
        onValueChange={(itemValue) => setGenero(itemValue)}
      >
        <Picker.Item label="Femenino" value="Femenino" />
        <Picker.Item label="Masculino" value="Masculino" />
      </Picker>

      <Text style={styles.label}>Fecha de Nacimiento:</Text>
      <TextInput
        style={styles.input}
        value={fecha_nac}
        onChangeText={setFechaNac}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Localidad:</Text>
      <TextInput style={styles.input} value={localidad} onChangeText={setLocalidad} />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} />

      <Text style={styles.label}>Preferencias:</Text>
      <Picker
        selectedValue={preferencia}
        style={styles.input}
        onValueChange={(itemValue) => setPreferencia(itemValue)}
      >
        <Picker.Item label="Ganadería y Agropecuario" value="Ganadería y Agropecuario" />
        <Picker.Item label="Tecnología" value="Tecnología" />
        <Picker.Item label="Salud" value="Salud" />
        <Picker.Item label="Bienes Raíces y Construcción Sostenible" value="Bienes Raíces y Construcción Sostenible" />
        <Picker.Item label="Alimentación y Bebidas Innovadoras" value="Alimentación y Bebidas Innovadoras" />
        <Picker.Item label="Entretenimiento y Medios Digitales" value="Entretenimiento y Medios Digitales" />
        <Picker.Item label="Moda y Textiles" value="Moda y Textiles" />
      </Picker>

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
    marginBottom: 10,
  },
  selectPhotoText: {
    color: '#005EB8',
    fontWeight: 'bold',
    fontFamily: 'TW CEN MT',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#005EB8',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    width: '90%',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'TW CEN MT',
    fontSize: 16,
  },
});

export default InversionistaForm;

