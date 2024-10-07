import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

// Inicializa Firestore
const firestore = getFirestore();

export default function AdminPerfil({ navigation }) {
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    profileImage: '',
  });
  const [image, setImage] = useState(null);
  const adminId = 'ID_DEL_ADMIN'; // Reemplaza con el ID del administrador

  useEffect(() => {
    const fetchAdminData = async () => {
      const adminDoc = await getDoc(doc(firestore, 'admins', adminId)); // Asegúrate de que el nombre de la colección sea correcto
      if (adminDoc.exists()) {
        setAdminData(adminDoc.data());
      }
    };

    fetchAdminData();
  }, []);

  const handleUpdateProfile = async () => {
    const adminRef = doc(firestore, 'admins', adminId);
    await updateDoc(adminRef, { ...adminData, profileImage: image || adminData.profileImage });
    alert('Perfil actualizado');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Administrador</Text>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: image || adminData.profileImage || 'default_image_url' }} // URL de imagen predeterminada si no hay imagen
          style={styles.avatar}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={adminData.name}
        onChangeText={(text) => setAdminData({ ...adminData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={adminData.email}
        onChangeText={(text) => setAdminData({ ...adminData, email: text })}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Actualizar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F9FC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
