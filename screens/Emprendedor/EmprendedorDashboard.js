import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseconfig';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../../firebase/firebaseconfig'; // Asegúrate de importar auth correctamente

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
        if (!user) {
          Alert.alert('Error', 'Usuario no autenticado. Por favor, inicie sesión.');
          navigation.navigate('Login');
          return;
        }

        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          setRol(userDoc.data().rol);
        } else {
          Alert.alert('Error', 'El documento del usuario no existe.');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener el rol del usuario: ' + error.message);
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
    <LinearGradient 
      colors={['#B8CDD6', '#FFFFFF']} 
      style={styles.container}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>StartCap, Tu mejor opción</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Proyectos')}>
          <MaterialCommunityIcons name="file-plus" size={30} color="#fff" />
          <Text style={styles.buttonText}>Proyectos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Notificaciones')}>
          <MaterialCommunityIcons name="bell-outline" size={26} color="#fff" />
          <Text style={styles.buttonText}>Notificaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('ChatE')}>
          <MaterialCommunityIcons name="chat-outline" size={26} color="#fff" />
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('EmprendedorPerfil')}>
          <MaterialCommunityIcons name="account-outline" size={26} color="#fff" />
          <Text style={styles.buttonText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('MisProyectos')}>
          <MaterialCommunityIcons name="briefcase-outline" size={26} color="#fff" />
          <Text style={styles.buttonText}>Mis Proyectos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CerrarSesion')}>
          <Entypo name="log-out" size={26} color="#fff" />
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {rol === 'emprendedor' && (
          <TouchableOpacity style={styles.button} onPress={() => handleNavigation('EmprendedorDashboard')}>
            <MaterialCommunityIcons name="view-dashboard-outline" size={26} color="#fff" />
            <Text style={styles.buttonText}>Dashboard</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
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
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 15,
  },
  button: {
    alignItems: 'center',
    paddingVertical: 8,
    width: '13%', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
  },
});
