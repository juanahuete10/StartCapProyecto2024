// SeleccionPerfil.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SeleccionPerfil({ navigation }) {

  const seleccionarPerfil = async (perfil) => {
    try {
      // Guarda el perfil seleccionado
      await AsyncStorage.setItem('userProfile', perfil);
      // Redirige al dashboard correspondiente
      if (perfil === 'Inversionista') {
        navigation.replace('InversionistaDashboard'); // Usar replace para evitar volver atrás
      } else if (perfil === 'Emprendedor') {
        navigation.replace('EmprendedorDashboard');
      } else if (perfil === 'Administrador') {
        // Implementar AdministradorDashboard si lo tienes
        navigation.navigate('AdministradorDashboard');
      }
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      alert('Ocurrió un error al seleccionar el perfil. Inténtalo nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu perfil</Text>

      {/* Inversionista */}
      <TouchableOpacity style={styles.button} onPress={() => seleccionarPerfil('Inversionista')}>
        <AntDesign name="profile" size={24} color="black" style={styles.icon} />
        <Text style={styles.buttonText}>Inversionista</Text>
      </TouchableOpacity>

      {/* Emprendedor */}
      <TouchableOpacity style={styles.button} onPress={() => seleccionarPerfil('Emprendedor')}>
        <AntDesign name="rocket1" size={24} color="black" style={styles.icon} />
        <Text style={styles.buttonText}>Emprendedor</Text>
      </TouchableOpacity>

      {/* Administrador */}
      <TouchableOpacity style={styles.button} onPress={() => seleccionarPerfil('Administrador')}>
        <AntDesign name="setting" size={24} color="black" style={styles.icon} />
        <Text style={styles.buttonText}>Administrador</Text>
      </TouchableOpacity>
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
  icon: {
    marginRight: 10, 
  },
});
