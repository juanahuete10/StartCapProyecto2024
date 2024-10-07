import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, firestore } from '../../firebase/firebaseconfig'; // Importa Firebase

export default function EmprendedorDashboard({ navigation }) {
  const [formCompleted, setFormCompleted] = useState(false);
  const [role, setRole] = useState(null); // Estado para almacenar el rol del usuario

  useEffect(() => {
    const checkFormStatus = async () => {
      const value = await AsyncStorage.getItem('formCompleted');
      setFormCompleted(value === 'true');
    };

    const fetchUserRole = async () => {
      const user = auth.currentUser; // Obtiene el usuario actual
      if (user) {
        const userDoc = await firestore.collection('usuarios').doc(user.uid).get();
        if (userDoc.exists) {
          const { role } = userDoc.data();
          setRole(role);
        }
      }
    };

    checkFormStatus();
    fetchUserRole(); // Llama a la función para obtener el rol del usuario
  }, []);

  const handleNavigation = (screen) => {
    console.log(`Navegando a: ${screen}`); 
    if (!formCompleted && screen !== 'EmprendedorForm') {
      navigation.navigate('EmprendedorForm');
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro Emprendedor</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('EmprendedorForm')}>
          <MaterialCommunityIcons name="form-textbox" size={30} color="#0e5575" />
          <Text style={styles.buttonText}>Registro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Proyectos')}>
          <MaterialCommunityIcons name="projects" size={30} color="#0e5575" />
          <Text style={styles.buttonText}>Proyectos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Notificaciones')}>
          <MaterialCommunityIcons name="bell-outline" size={30} color="#0e5575" />
          <Text style={styles.buttonText}>Notificaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Chats')}>
          <MaterialCommunityIcons name="chat-outline" size={30} color="#0e5575" />
          <Text style={styles.buttonText}>Chats</Text>
        </TouchableOpacity>

        {role === 'emprendedor' && (
          <TouchableOpacity style={styles.button} onPress={() => handleNavigation('EmprendedorDashboard')}>
            <MaterialCommunityIcons name="view-dashboard" size={30} color="#0e5575" />
            <Text style={styles.buttonText}>Mi Dashboard</Text>
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0e5575',
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2994a',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

