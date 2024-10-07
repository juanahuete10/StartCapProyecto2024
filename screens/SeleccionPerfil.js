import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function SeleccionPerfil({ navigation }) {
  const seleccionarPerfil = (perfil) => {
    if (perfil === 'Inversionista') {
      navigation.navigate('InversionistaForm');
    } else if (perfil === 'Emprendedor') {
      navigation.navigate('EmprendedorDashboard');
    } else if (perfil === 'Administrador') {
      navigation.navigate('AdminDashboard');
    }
  };

  return (
    <View style={styles.container}>
      

      <Image 
        style={styles.logo} 
        source={require('../assets/icon/StartCap.png')} 
      />
      <Text style={styles.subtitle}>Selecciona tu perfil</Text>

      {/* Contenedor para Emprendedor e Inversionista */}
      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.button} onPress={() => seleccionarPerfil('Emprendedor')}>
          <Image source={require('../assets/icon/Emprendedor.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Emprendedor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => seleccionarPerfil('Inversionista')}>
          <Image source={require('../assets/icon/Inversionista.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Inversionista</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para Administrador */}
      <TouchableOpacity style={styles.button} onPress={() => seleccionarPerfil('Administrador')}>
        <Image source={require('../assets/icon/Administrador.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Administrador</Text>
      </TouchableOpacity>
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
  rowContainer: {
    flexDirection: 'row', // Organiza los botones en fila
    justifyContent: 'space-around', // Espaciado entre los botones
    width: '80%', // Ajusta el ancho del contenedor
    marginBottom: 20, // Espacio debajo de esta fila
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 15,
  },
  buttonText: {
    fontSize: 16,
    color: '#003366',
    fontWeight: 'bold',
    marginTop: 10,
  },
  icon: {
    width: 80,
    height: 80,
  },
});
