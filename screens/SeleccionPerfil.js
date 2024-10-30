import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { auth, db } from '../firebase/firebaseconfig';  
import { doc, getDoc } from 'firebase/firestore';

export default function SeleccionPerfil({ navigation }) {
  const [rol, setRol] = useState('');

  useEffect(() => {
    const obtenerRol = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "usuarios", auth.currentUser.uid); 
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const rolUsuario = userDoc.data().rol;
          setRol(rolUsuario);
          redirigirAlPerfil(rolUsuario);
        } else {
          console.log("No se encontró el usuario");
          Alert.alert("Error", "Usuario no encontrado.");
        }
      }
    };

    obtenerRol();
  }, []);

  const redirigirAlPerfil = (rol) => {
    switch (rol) {
      case 'Inversionista':
        navigation.navigate('InversionistaForm');
        break;
      case 'Emprendedor':
        navigation.navigate('EmprendedorForm');
        break;
      case 'Administrador':
        navigation.navigate('AdminDashboard');
        break;
      default:
        Alert.alert("Error", "Rol no válido.");
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        style={styles.logo} 
        source={require('../assets/icon/StartCap.png')} 
      />
      <Text style={styles.subtitle}>Cargando tu perfil...</Text>

      {/* Mensaje de bienvenida según el rol */}
      {rol && (
        <Text style={styles.welcomeMessage}>
          Bienvenido, {rol}! Tienes acceso al perfil de {rol}.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F3F3',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 20,
    color: '#333',
  },
  welcomeMessage: {
    fontSize: 18,
    color: '#005EB8',
    marginVertical: 15,
  },
});
