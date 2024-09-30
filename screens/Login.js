// Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseconfig'; // Importar auth desde firebaseconfig
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const iniciarSesion = async () => {
    const sanitizedEmail = email.trim(); // Limpiar el correo de espacios en blanco

    // Validar el correo electrónico
    if (!sanitizedEmail || !/\S+@\S+\.\S+/.test(sanitizedEmail)) {
      alert('Por favor, introduce un correo electrónico válido.');
      return;
    }

    if (!password) {
      alert('Por favor, introduce tu contraseña.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, sanitizedEmail, password);
      alert('Inicio de sesión exitoso!');
      // Redirigir a la pantalla de Selección de Perfil
      navigation.navigate('SeleccionPerfil');
    } catch (error) {
      console.error("Error al iniciar sesión:", error.code, error.message);
      if (error.code === 'auth/user-not-found') {
        alert('No se encontró un usuario con este correo electrónico.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Contraseña incorrecta.');
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Iniciar sesión" onPress={iniciarSesion} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
