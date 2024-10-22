import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, firestore } from '../../firebase/firebaseconfig';

export default function EmprendedorDashboard({ navigation }) {
  const [formCompleted, setFormCompleted] = useState(false);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const checkFormStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('formCompleted');
        setFormCompleted(value === 'true');
      } catch (error) {
        Alert.alert('Error', 'No se pudo verificar el estado del formulario.');
      }
    };

    const fetchUserRol = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await firestore.collection('usuarios').doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setRol(userData.rol);
          }
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener el rol del usuario.');
      }
    };

    checkFormStatus();
    fetchUserRol();
  }, []);

  const handleNavigation = (screen) => {
    if (!formCompleted && screen !== 'EmprendedorForm') {
      navigation.navigate('EmprendedorForm');
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/icon/LogoStartCap.png')} 
      style={styles.backgroundImage}
      resizeMode="contain" 
    >
      {/* Barra de título en la parte superior */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>StartCap, Tu mejor opción</Text>
      </View>

      {/* Barra de botones al fondo */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Proyectos')}>
          <MaterialCommunityIcons name="file-plus" size={30} color="#0e5575" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Notificaciones')}>
          <MaterialCommunityIcons name="bell-outline" size={30} color="#0e5575" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Chats')}>
          <MaterialCommunityIcons name="chat-outline" size={30} color="#0e5575" />
        </TouchableOpacity>

        {rol === 'emprendedor' && (
          <TouchableOpacity style={styles.button} onPress={() => handleNavigation('EmprendedorDashboard')}>
            <MaterialCommunityIcons name="view-dashboard" size={30} color="#0e5575" />
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 50, 
    paddingBottom: 20, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e5575',
  },
  buttonContainer: {
    flexDirection: 'row', 
    width: '100%',
    justifyContent: 'space-around', 
    position: 'absolute', 
    bottom: 20, 
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent', 
    padding: 15,
  },
});
