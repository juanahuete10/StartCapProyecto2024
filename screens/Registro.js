// Registro.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseconfig'; // Importar auth desde firebaseconfig
import { setDoc, doc } from 'firebase/firestore';

export default function Registro({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Expresión regular para validar un correo electrónico
  const validarEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const registrarUsuario = async () => {
    // Validar el formato del correo electrónico
    if (!email || !validarEmail(email)) {
      alert('Por favor, introduce un correo electrónico válido.');
      return;
    }

    // Validar que la contraseña no esté vacía o sea demasiado corta
    if (!password || password.length < 6) {
      alert('Por favor, introduce una contraseña de al menos 6 caracteres.');
      return;
    }

    try {
      // Crear el usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Opcional: Puedes guardar información adicional del usuario en Firestore
      // await setDoc(doc(db, "users", userCredential.user.uid), {
      //   email: email,
      //   createdAt: new Date(),
      // });

      alert('Usuario registrado con éxito!');
      
      // Redirigir a la pantalla principal (Home)
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al registrar:', error.code, error.message);
      if (error.code === 'auth/invalid-email') {
        alert('El formato del correo electrónico no es válido.');
      } else if (error.code === 'auth/email-already-in-use') {
        alert('El correo electrónico ya está en uso.');
      } else {
        alert('Error al registrar: ' + error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={(text) => setEmail(text.trim())} // Eliminar espacios adicionales
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
      <Button title="Registrarse" onPress={registrarUsuario} />
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
