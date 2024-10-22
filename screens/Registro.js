import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker'; 


export default function Registro({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Inversionista'); 

  const validarEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const registrarUsuario = async () => {
    const auth = getAuth();
    const db = getFirestore();

    if (!email || !validarEmail(email)) {
      Alert.alert('Error', 'Por favor, introduce un correo electrónico válido.');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Error', 'Por favor, introduce una contraseña de al menos 6 caracteres.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guarda el rol del usuario en Firestore
      await setDoc(doc(db, 'usuarios', user.uid), {
        email: user.email,
        rol: rol, // Usa el rol seleccionado
      });

      navigation.navigate('SeleccionPerfil', { userId: user.uid });
    } catch (error) {
      console.error('Error al registrar:', error.code, error.message);
      Alert.alert('Error', 'Error al registrar: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        style={styles.logo} 
        source={require('../assets/icon/LogoStartCap.png')} 
      />
      <Text style={styles.title}>Crear una cuenta</Text>
      <Text style={styles.subtitle}>Por favor, llena los siguientes campos</Text>
      
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={(text) => setEmail(text.trim())}
        style={styles.input}
        keyboardType="email-address"
        placeholderTextColor="#B0BEC5"
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#B0BEC5"
      />

      {/* Picker para seleccionar el rol */}
      <Picker
        selectedValue={rol}
        style={styles.picker}
        onValueChange={(itemValue) => setRol(itemValue)}
      >
        <Picker.Item label="Inversionista" value="Inversionista" />
        <Picker.Item label="Emprendedor" value="Emprendedor" />
        {/* Agrega más roles si es necesario */}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={registrarUsuario}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        ¿Ya tienes una cuenta? 
        <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}> Inicia sesión</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#607D8B',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#B0BEC5',
    borderWidth: 1,
    borderRadius: 25,
    paddingLeft: 20,
    fontSize: 16,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#003366',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#607D8B',
    marginTop: 20,
  },
  linkText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
