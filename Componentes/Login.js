// Login.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Aquí podrías agregar la lógica para autenticar al usuario
    // Por ejemplo, llamar a Firebase Authentication

    if (email && password) {
      // Simulando un inicio de sesión exitoso
      Alert.alert('Inicio de sesión exitoso', `Bienvenido, ${email}`);
      if (onLogin) onLogin(); // Llamar a la función proporcionada para manejar el inicio de sesión
    } else {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico y una contraseña.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});
