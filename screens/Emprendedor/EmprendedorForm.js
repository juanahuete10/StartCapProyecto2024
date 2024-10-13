import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { db, auth, storage } from '../../firebase/firebaseconfig'; 
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const EmprendedorForm = ({ navigation }) => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fecha_nac, setFechaNac] = useState(new Date());
  const [cedula, setCedula] = useState('');
  const [genero, setGenero] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos permisos para acceder a la galería.');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFotoPerfil(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `fotosPerfil/${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };
 


  const getNewUserId = async () => {
    const emprendedoresSnapshot = await getDocs(collection(db, "emprendedores"));
    const count = emprendedoresSnapshot.size + 1;
    return count;
  };

  const guardarEmprendedor = async () => {
    if (!validarCedula()) {
      Alert.alert("Cédula Inválida", "Por favor, ingresa una cédula válida con el formato correcto (000-000000-0000Z)");
      return;
    }

    setLoading(true);
    try {
      let uploadedURL = null;

      if (fotoPerfil) {
        uploadedURL = await uploadImage(fotoPerfil);
        if (!uploadedURL) {
          setLoading(false);
          return;
        }
      }

      const newUserId = await getNewUserId();

      await setDoc(doc(db, "emprendedores", String(newUserId)), { 
        id_emprendedor: newUserId,
        nombres,
        apellidos,
        fecha_nac: fecha_nac.toISOString().split('T')[0],
        cedula,
        genero,
        correo: auth.currentUser.email, // Cambiado a "correo" según tu estructura
        localidad,
        descripcion,
        foto_perfil: uploadedURL || '', // Cambiado a "foto_perfil" según tu estructura
        rol: 'Emprendedor', 
        email: auth.currentUser.email
      });

      Alert.alert("Éxito", "Emprendedor guardado correctamente!");
      limpiarCampos();
      navigation.navigate('EmprendedorDashboard');
    } catch (error) {
      console.error("Error al guardar emprendedor:", error);
      Alert.alert("Error", "Hubo un problema al guardar el emprendedor.");
    } finally {
      setLoading(false);
    }
  };

  const limpiarCampos = () => {
    setNombres('');
    setApellidos('');
    setFechaNac(new Date());
    setCedula('');
    setGenero('');
    setLocalidad('');
    setDescripcion('');
    setFotoPerfil(null);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || fecha_nac;
    setShowDatePicker(false);
    setFechaNac(currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {fotoPerfil ? (
          <Image
            source={{ uri: fotoPerfil }}
            style={styles.profileImage}
          />
        ) : (
          <Text style={styles.imageText}>Seleccionar Foto de Perfil</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Nombres:</Text>
      <TextInput
        style={styles.input}
        value={nombres}
        onChangeText={setNombres}
        placeholder="Ingresa tus nombres"
      />

      <Text style={styles.label}>Apellidos:</Text>
      <TextInput
        style={styles.input}
        value={apellidos}
        onChangeText={setApellidos}
        placeholder="Ingresa tus apellidos"
      />

      <Text style={styles.label}>Fecha de Nacimiento:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{fecha_nac.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={fecha_nac}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

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

      <Text style={styles.label}>Localidad:</Text>
      <TextInput
        style={styles.input}
        value={localidad}
        onChangeText={setLocalidad}
        placeholder="Ingresa tu localidad"
      />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción sobre ti"
        multiline={true}
        numberOfLines={4}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={guardarEmprendedor}>
          <Text style={styles.buttonText}>Registrar Emprendedor</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EmprendedorForm;
