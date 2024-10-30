import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; // Importa el degradado

export default function Home() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#0E5575', '#FFFFFF', '#FAB613']} // Colores del degradado
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Image style={styles.logo} source={require('../assets/icon/LogoStartCap.png')} />
      <Text style={styles.title}>Bienvenido a StartCap</Text>
      <Text style={styles.subtitle}>Tu aplicación móvil</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Registro')}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0E5575',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#0E5575',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#FAB613',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
