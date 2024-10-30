import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from '../../firebase/firebaseconfig'; 
import { doc, setDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

const InversionistaForm = ({ navigation }) => {
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [cedula, setCedula] = useState('');
  const [genero, setGenero] = useState('');
  const [fecha_nac, setFechaNac] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [localidad, setLocalidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [preferencia, setPreferencia] = useState('');
  const [foto_perfil, setFotoPerfil] = useState(null);

  const validarCedula = () => {
    const cedulaRegex = /^\d{3}-\d{6}-\d{4}[A-Za-z]$/;
    return cedulaRegex.test(cedula);
  };

  const handleCedulaChange = (text) => {
    let cleaned = text.replace(/[^0-9A-Za-z]/g, '');
    const digits = cleaned.slice(0, 13);
    const letter = cleaned.slice(13, 14).toUpperCase();
    let formattedDigits = digits.replace(/(\d{3})(\d{6})(\d{4})/, '$1-$2-$3');
    const formattedCedula = letter ? `${formattedDigits}${letter}` : formattedDigits;
    setCedula(formattedCedula);
  };

  const limpiarCampos = () => {
    setNombre1('');
    setNombre2('');
    setApellido1('');
    setApellido2('');
    setCedula('');
    setGenero('');
    setFechaNac(new Date());
    setLocalidad('');
    setDescripcion('');
    setPreferencia('');
    setFotoPerfil(null);
  };

  const guardarInversionista = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "Usuario no autenticado.");
      return;
    }

    if (!nombre1 || !apellido1 || !apellido2 || !cedula || !genero || !localidad || !descripcion || !preferencia) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos.");
      return;
    }

    if (!validarCedula()) {
      Alert.alert("Error", "La cédula no es válida, debe tener 15 caracteres incluyendo guiones.");
      return;
    }

    try {
      const uid = auth.currentUser.uid; // Obtener el UID del usuario autenticado
      const inversionistaRef = doc(db, "inversionistas", uid); // Usar el UID del usuario autenticado

      await setDoc(inversionistaRef, {
        id_inversionista: uid, // Guardar el UID como ID del inversionista
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        cedula,
        genero,
        fecha_nac: fecha_nac.toISOString().split('T')[0],
        localidad,
        descripcion,
        preferencia,
        foto_perfil,
        rol: 'Inversionista', 
        email: auth.currentUser.email 
      });

      Alert.alert("Inversionista guardado con éxito!");
      limpiarCampos();
      navigation.navigate('InversionistaDashboard');
    } catch (error) {
      console.error("Error al guardar inversionista:", error);
      Alert.alert("Hubo un error al guardar el inversionista. Detalles: " + error.message);
    }
  };

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
      setFotoPerfil(result.assets[0].uri);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fecha_nac;
    setShowDatePicker(false);
    setFechaNac(currentDate);
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
        <Picker.Item label="Selecciona un género" value="" />
        <Picker.Item label="Femenino" value="Femenino" />
        <Picker.Item label="Masculino" value="Masculino" />
      </Picker>

      <Text style={styles.label}>Fecha de Nacimiento:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={styles.dateText}>
          {fecha_nac.toISOString().split('T')[0]} {/* Mostrar la fecha en formato YYYY-MM-DD */}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={fecha_nac}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

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
        <Picker.Item label="Selecciona una preferencia" value="" />
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
    backgroundColor: 'linear-gradient(to bottom, #E0F7FA 0%, #FFEBEE 100%)', // Color de fondo degradado
  },
  label: {
    fontSize: 16,
    fontFamily: 'TW CEN MT',
    fontWeight: 'bold',
    color: '#005EB8',
    marginVertical: 8,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#005EB8',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  selectPhotoText: {
    color: '#005EB8',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#000000',
    padding: 10,
    borderColor: '#005EB8',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#005EB8',
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default InversionistaForm;
