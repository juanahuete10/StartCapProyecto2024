import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { db, auth } from '../../firebase/firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons'; 

const VerPerfilEmprendedor = ({ route }) => {
  const { idEmprendedor } = route.params; 
  const [emprendedorData, setEmprendedorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmprendedorData = async () => {
      if (!auth.currentUser) {
        Alert.alert("Error", "Usuario no autenticado.");
        return;
      }

      const emprendedorRef = doc(db, "emprendedor", idEmprendedor); 

      try {
        const emprendedorDoc = await getDoc(emprendedorRef);

        if (emprendedorDoc.exists()) {
          const { nombre1, apellido1, descripcion, email, fecha_nac, genero, foto_perfil, localidad } = emprendedorDoc.data();
          setEmprendedorData({ nombre1, apellido1, descripcion, email, fecha_nac, genero, foto_perfil, localidad });
        } else {
          Alert.alert("Error", "No se encontraron datos del emprendedor.");
        }
      } catch (error) {
        console.error("Error al obtener datos del emprendedor:", error);
        Alert.alert("Error", "Ocurrió un error al obtener los datos del emprendedor.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmprendedorData();
  }, [idEmprendedor]);

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

  return (
    <LinearGradient 
      colors={['#B8CDD6', '#FFFFFF']} 
      style={styles.container}
    >
      <View style={styles.profileContainer}>
        
        <View style={styles.centeredContainer}>
          {emprendedorData.foto_perfil && (
            <Image
              source={{ uri: emprendedorData.foto_perfil }}
              style={styles.fotoPerfil}
            />
          )}
          <Text style={styles.nombre}>
            {emprendedorData.nombre1} {emprendedorData.apellido1}
          </Text>
        </View>

   
        <View style={styles.infoContainer}>
          <FontAwesome name="info-circle" size={20} color="#005EB8" />
          <Text style={styles.infoLabel}>Descripción:</Text>
        </View>
        <Text style={styles.infoText}>{emprendedorData.descripcion}</Text>
        
        <View style={styles.infoContainer}>
          <FontAwesome name="envelope" size={20} color="#005EB8" />
          <Text style={styles.infoLabel}>Email:</Text>
        </View>
        <Text style={styles.infoText}>{emprendedorData.email}</Text>
        
        <View style={styles.infoContainer}>
          <FontAwesome name="calendar" size={20} color="#005EB8" />
          <Text style={styles.infoLabel}>Fecha de Nacimiento:</Text>
        </View>
        <Text style={styles.infoText}>{emprendedorData.fecha_nac}</Text>
        
        <View style={styles.infoContainer}>
          <FontAwesome name="genderless" size={20} color="#005EB8" />
          <Text style={styles.infoLabel}>Género:</Text>
        </View>
        <Text style={styles.infoText}>{emprendedorData.genero}</Text>

        <View style={styles.infoContainer}>
          <FontAwesome name="map-marker" size={20} color="#005EB8" />
          <Text style={styles.infoLabel}>Localidad:</Text>
        </View>
        <Text style={styles.infoText}>{emprendedorData.localidad}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,
    padding: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  centeredContainer: {
    alignItems: 'center', 
    marginBottom: 20, 
  },
  fotoPerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderColor: '#005EB8',
    borderWidth: 2,
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005EB8',
    marginVertical: 8,
    textAlign: 'center', 
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#333333',
    textAlign: 'left',
    marginVertical: 4,
    marginLeft: 40, 
  },
});

export default VerPerfilEmprendedor;
