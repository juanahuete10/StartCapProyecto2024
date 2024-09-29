import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function SeleccionPerfil({ navigation }) {

  const seleccionarPerfil = (perfil) => {
    if (perfil === 'Inversionista') {
      navigation.navigate('InversionistaDashboard');
    } else if (perfil === 'Emprendedor') {
      navigation.navigate('EmprendedorDashboard');
    } else if (perfil === 'Administrador') {
      navigation.navigate('AdministradorDashboard');
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2994a',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10, 
  },
  icon: {
    marginRight: 10, 
  },
});
