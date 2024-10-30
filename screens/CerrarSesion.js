import React from 'react';
import { View, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const CerrarSesion = () => {
  const navigation = useNavigation();
  const auth = getAuth();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente.');
        navigation.replace('Login');
      })
      .catch((error) => {
        Alert.alert('Error', 'Hubo un error al cerrar sesión.');
        console.error('Error al cerrar sesión:', error);
      });
  };

  return (
    <LinearGradient colors={['#B8CDD6', '#FFFFFF']} style={styles.container}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="logout" size={80} color="#fff" />
        <Text style={styles.title}>¿Deseas cerrar sesión?</Text>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CerrarSesion;
