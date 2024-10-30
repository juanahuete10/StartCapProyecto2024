import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { db, auth } from '../../firebase/firebaseconfig'; 
import { doc, getDoc } from 'firebase/firestore';

const Perfil = ({ navigation }) => {
  const [inversionistasData, setInversionistasData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInversionistasData = async () => {
      if (!auth.currentUser) {
        Alert.alert("Error", "Usuario no autenticado.");
        return;
      }

      const uid = auth.currentUser.uid; 
      console.log("UID del usuario:", uid); 
      const inversionistasRef = doc(db, "inversionistas", uid); 

      try {
        const inversionistasDoc = await getDoc(inversionistasRef);

        if (inversionistasDoc.exists()) {
          setInversionistasData(inversionistasDoc.data()); 
        } else {
          Alert.alert("Error", "No se encontraron datos del inversionista.");
          console.log("No se encontró el documento:", inversionistasRef.path); 
        }
      } catch (error) {
        console.error("Error al obtener datos del inversionista:", error);
        Alert.alert("Error", "Ocurrió un error al obtener los datos del inversionista.");
      } finally {
        setLoading(false);
      }
    };

    fetchInversionistasData(); 
  }, []);

  if (loading) {
    return <Text>Cargando...</Text>; 
  }

  if (!inversionistasData) {
    return null; 
  }

  const {
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
    email
  } = inversionistasData;

  return (
    <View style={styles.container}>
      {foto_perfil && (
        <Image
          source={{ uri: foto_perfil }}
          style={styles.fotoPerfil}
        />
      )}
      <Text style={styles.label}>Nombre: {nombre1} {nombre2} {apellido1} {apellido2}</Text>
      <Text style={styles.label}>Cédula: {cedula}</Text>
      <Text style={styles.label}>Género: {genero}</Text>
      <Text style={styles.label}>Fecha de Nacimiento: {fecha_nac}</Text>
      <Text style={styles.label}>Localidad: {localidad}</Text>
      <Text style={styles.label}>Descripción: {descripcion}</Text>
      <Text style={styles.label}>Preferencia: {preferencia}</Text>
      <Text style={styles.label}>Email: {email}</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('InversionistaForm', { inversionistasData })}
      >
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F9FC',
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005EB8',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#005EB8',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Perfil;
