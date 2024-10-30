import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, Alert, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from '../../firebase/firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

const EmprendedorForm = ({ navigation }) => {
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [cedula, setCedula] = useState('');
  const [genero, setGenero] = useState('');
  const [fechaNac, setFechaNac] = useState(new Date());
  const [localidad, setLocalidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const validarCedula = () => {
    const cedulaRegex = /^\d{3}-\d{6}-\d{4}[A-Za-z]$/;
    return cedulaRegex.test(cedula);
  };

  const handleCedulaChange = (text) => {
    let cleaned = text.replace(/[^0-9A-Za-z]/g, '');
    const digits = cleaned.slice(0, 13);
    const letter = cleaned.slice(13, 14).toUpperCase();
    setCedula(digits.replace(/(\d{3})(\d{6})(\d{4})/, '$1-$2-$3') + letter);
  };

  const guardarEmprendedor = async () => {
    if (!nombre1 || !nombre2 || !apellido1 || !apellido2 || !cedula || !genero || !localidad || !descripcion || !fotoPerfil) {
      Alert.alert("Error", "Por favor completa todos los campos requeridos.");
      return;
    }

    if (!validarCedula()) {
      Alert.alert("Error", "La cédula no es válida, debe tener 15 caracteres incluyendo guiones.");
      return;
    }

    try {
      const emprendedorRef = doc(db, "emprendedor", auth.currentUser.uid);

      // Línea de impresión de la ruta del documento
      console.log("Ruta del documento:", emprendedorRef.path);

      await setDoc(emprendedorRef, {
        id_emprendedor: auth.currentUser.uid,
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        cedula,
        genero,
        fecha_nac: fechaNac.toISOString().split('T')[0],
        localidad,
        descripcion,
        foto_perfil: fotoPerfil,
        email: auth.currentUser.email,
      });

      Alert.alert("Emprendedor guardado con éxito!");
      navigation.navigate('EmprendedorDashboard');
    } catch (error) {
      console.error("Error al guardar emprendedor:", error);
      Alert.alert("Hubo un error al guardar el emprendedor.");
    }
  };

  const seleccionarFoto = async (source) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Se necesita permiso para acceder a la cámara o galería.");
      return;
    }

    let result;
    if (source === 'camera') {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        Alert.alert("Se necesita permiso para acceder a la cámara.");
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled) {
      setFotoPerfil(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  const mostrarFecha = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || fechaNac;
      setFechaNac(currentDate);
    }
    setShowDatePicker(false);
  };

  // Formatear la fecha a un formato legible
  const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  return (
    <LinearGradient colors={['#E0F7FA', '#B2EBF2']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.fotoContainer}>
          {fotoPerfil && (
            <Image
              source={{ uri: fotoPerfil }}
              style={styles.fotoPerfil}
            />
          )}
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.selectPhotoText}>Seleccionar Foto de Perfil</Text>
          </TouchableOpacity>
        </View>

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
          maxLength={16}
        />

        <Text style={styles.label}>Género:</Text>
        <Picker selectedValue={genero} style={styles.input} onValueChange={(itemValue) => setGenero(itemValue)}>
          <Picker.Item label="Selecciona un género" value="" />
          <Picker.Item label="Femenino" value="Femenino" />
          <Picker.Item label="Masculino" value="Masculino" />
        </Picker>

        <Text style={styles.label}>Fecha de Nacimiento:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text>{fechaNac ? formatearFecha(fechaNac) : 'Selecciona una fecha'}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={fechaNac}
            mode="date"
            display="default"
            onChange={mostrarFecha}
          />
        )}

        <Text style={styles.label}>Localidad:</Text>
        <TextInput style={styles.input} value={localidad} onChangeText={setLocalidad} />

        <Text style={styles.label}>Descripción:</Text>
        <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} multiline />

        <TouchableOpacity style={styles.button} onPress={guardarEmprendedor}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Seleccionar foto de perfil</Text>
              <TouchableOpacity onPress={() => seleccionarFoto('camera')} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Tomar Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => seleccionarFoto('gallery')} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Seleccionar de la Galería</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  fotoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  selectPhotoText: {
    color: '#007BFF',
    marginTop: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: '#007BFF',
  },
});

export default EmprendedorForm;
