import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db, auth } from '../../firebase/firebaseconfig'; 
import { doc, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons'; 

const EmprendedorPerfil = ({ navigation }) => {
  const [emprendedorData, setEmprendedorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmprendedorData = async () => {
      if (!auth.currentUser) {
        Alert.alert("Error", "Usuario no autenticado.");
        return;
      }

      const uid = auth.currentUser.uid;
      console.log("UID del usuario:", uid); 
      const emprendedorRef = doc(db, "emprendedor", uid); 

      try {
        const emprendedorDoc = await getDoc(emprendedorRef); 

        if (emprendedorDoc.exists()) {
          setEmprendedorData(emprendedorDoc.data());
        } else {
          Alert.alert("Error", "No se encontraron datos del emprendedor.");
          console.log("No se encontró el documento:", emprendedorRef.path); 
        }
      } catch (error) {
        console.error("Error al obtener datos del emprendedor:", error);
        Alert.alert("Error", "Ocurrió un error al obtener los datos del emprendedor.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmprendedorData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#005EB8" />
      </View>
    );
  }

  if (!emprendedorData) {
    return (
      <View style={styles.container}>
        <Text>No se encontraron datos del emprendedor.</Text>
      </View>
    );
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
  } = emprendedorData;

  return (
    <LinearGradient 
      colors={['#B8CDD6', '#FFFFFF']} 
      style={styles.container}
    >
      <View style={styles.profileContainer}>
        {foto_perfil && (
          <Image
            source={{ uri: foto_perfil }}
            style={styles.fotoPerfil}
          />
        )}
        <View style={styles.infoContainer}>
          <FontAwesome name="user" size={20} color="#005EB8" style={styles.icon} />
          <Text style={styles.label}>Nombre: {nombre1} {nombre2} {apellido1} {apellido2}</Text>
        </View>
        <View style={styles.infoContainer}>
          <FontAwesome name="id-card" size={20} color="#005EB8" style={styles.icon} />
          <Text style={styles.label}>Cédula: {cedula}</Text>
        </View>
        <View style={styles.infoContainer}>
          <FontAwesome name="genderless" size={20} color="#005EB8" style={styles.icon} />
          <Text style={styles.label}>Género: {genero}</Text>
        </View>
        <View style={styles.infoContainer}>
          <FontAwesome name="calendar" size={20} color="#005EB8" style={styles.icon} />
          <Text style={styles.label}>Fecha de Nacimiento: {fecha_nac}</Text>
        </View>
        <View style={styles.infoContainer}>
          <FontAwesome name="map-marker" size={20} color="#005EB8" style={styles.icon} />
          <Text style={styles.label}>Localidad: {localidad}</Text>
        </View>
        <View style={styles.infoContainer}>
          <FontAwesome name="info-circle" size={20} color="#005EB8" style={styles.icon} />
          <Text style={styles.label}>Descripción: {descripcion}</Text>
        </View>
        <View style={styles.infoContainer}>
          <FontAwesome name="star" size={20} color="#005EB8" style={styles.icon} />
          <Text style={styles.label}>Preferencia: {preferencia}</Text>
        </View>
        <View style={styles.infoContainer}>
          <FontAwesome name="envelope" size={20} color="#005EB8" style={styles.icon} />
          <Text style={styles.label}>Email: {email}</Text>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('EmprendedorForm', { emprendedorData })} 
        >
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center', 
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    alignSelf: 'center', 
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#005EB8',
    marginVertical: 8,
    marginLeft: 10, 
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    alignSelf: 'stretch', 
  },
  icon: {
    marginRight: 10, 
  },
  button: {
    backgroundColor: '#005EB8',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EmprendedorPerfil;
