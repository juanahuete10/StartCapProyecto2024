import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { db, storage } from '../../firebase/firebaseconfig'; 
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const EmprendedorForm = () => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [fecha_nac, setFecha_nac] = useState('');
  const [cedula, setCedula] = useState('');
  const [genero, setGenero] = useState([]); 
  const [localidad, setLocalidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null); 
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos permisos para acceder a la galería.');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], 
        quality: 1,
      });

      if (!result.canceled) {
        setFotoPerfil(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `fotosPerfil/${Date.now()}.jpg`); 
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      Alert.alert('Error', 'Hubo un problema al subir la imagen.');
      return null;
    }
  };

  const validarCedula = () => {
    const cedulaRegex = /^\d{3}-\d{6}-\d{4}[A-Za-z]$/;  
    return cedulaRegex.test(cedula);
  };

  const handleCedulaChange = (text) => {
    const formattedText = text
      .replace(/\D/g, '')                
      .replace(/(\d{3})(\d{6})(\d{4})/, '$1-$2-$3');  

    setCedula(formattedText + text.slice(13).toUpperCase());  
  };

  const getNewUserId = async () => {
    const emprendedoresSnapshot = await getDocs(collection(db, "emprendedores"));
    const count = emprendedoresSnapshot.size + 1;  
    return count;  
  };

  const guardarEmprendedor = async () => {
    if (!validarCedula()) {
      Alert.alert("Cédula Inválida", "Por favor, ingresa una cédula válida con el formato correcto");
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
        id_usuario: newUserId,
        nombres: nombres,
        apellidos: apellidos,
        fecha_nac: fecha_nac,
        cedula: cedula,
        genero: genero.join(', '), 
        localidad: localidad,
        descripcion: descripcion,
        foto_perfil_url: uploadedURL || '', 
      });

      Alert.alert("Éxito", "Emprendedor guardado correctamente!");
      setNombres('');
      setApellidos('');
      setFecha_nac('');
      setCedula('');
      setGenero([]); 
      setLocalidad('');
      setDescripcion('');
      setFotoPerfil(null);
    } catch (error) {
      console.error("Error al guardar emprendedor:", error);
      Alert.alert("Error", "Hubo un problema al guardar el emprendedor.");
    } finally {
      setLoading(false);
    }
  };

  const toggleGenero = (value) => {
    if (genero.includes(value)) {
      setGenero(genero.filter((item) => item !== value));
    } else {
      setGenero([...genero, value]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Emprendedor</Text>

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

      {/* Campos de texto */}
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
      <TextInput
        style={styles.input}
        value={fecha_nac}
        onChangeText={setFecha_nac}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Cédula:</Text>
      <TextInput
        style={styles.input}
        value={cedula}
        onChangeText={handleCedulaChange}
        placeholder="000-000000-0000X"
        keyboardType="default"
      />

      <Text style={styles.label}>Género:</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.genderOption, genero.includes('masculino') && styles.selectedGender]}
          onPress={() => toggleGenero('masculino')}
        >
          <Text>Masculino</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderOption, genero.includes('femenino') && styles.selectedGender]}
          onPress={() => toggleGenero('femenino')}
        >
          <Text>Femenino</Text>
        </TouchableOpacity>
        <TouchableOpacity
        >
        
        </TouchableOpacity>
      </View>

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
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007BFF',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Estilo circular
  },
  imageText: {
    fontSize: 16,
    color: '#007BFF',
    textAlign: 'center',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  genderOption: {
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#007BFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default EmprendedorForm;

