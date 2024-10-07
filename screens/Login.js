import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { auth, firestore } from '../firebase/firebaseconfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const iniciarSesion = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtiene el rol del usuario desde Firestore
      const userDoc = await getDoc(doc(firestore, 'usuarios', user.uid)); // Corrección aquí
      if (userDoc.exists()) {
        const { role } = userDoc.data();

        switch (role) {
          case 'Administrador':
            navigation.navigate('AdminDashboard');
            break;
          case 'Emprendedor':
            navigation.navigate('EmprendedorDashboard');
            break;
          case 'Inversionista':
            navigation.navigate('InversionistaDashboard');
            break;
          default:
            alert('Rol de usuario desconocido.');
        }
      } else {
        alert('Usuario no encontrado en Firestore.');
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      alert(error.message);
    }
  };

  const irARegistro = () => {
    navigation.navigate('Registro'); // Asegúrate de que 'Registro' sea el nombre correcto de tu pantalla de registro
  };

  return (
    <View style={styles.container}>
      <Image 
        style={styles.logo} 
        source={require('../assets/icon/StartCap.png')} 
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
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
      />
      <TouchableOpacity style={styles.button} onPress={iniciarSesion}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>
        ¿No tienes una cuenta? <Text style={styles.linkText} onPress={irARegistro}>Regístrate aquí</Text>
      </Text>
    </View>
  );
};

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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    fontFamily: 'TW CEN MT',
  },
  button: {
    width: '100%',
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#003366',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'TW CEN MT',
  },
  infoText: {
    fontSize: 14,
    color: '#607D8B',
    marginTop: 20,
    fontFamily: 'TW CEN MT',
  },
  linkText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default Login;
