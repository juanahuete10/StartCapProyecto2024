import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Importa LinearGradient
import { auth, db } from '../firebase/firebaseconfig';  
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore'; 

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => { 
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try { 
      const userCredential = await signInWithEmailAndPassword(auth, email, password); 
      const user = userCredential.user; 

      // Busca el usuario en la colección 'usuarios' usando el uid
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));

      if (userDoc.exists()) { 
        const userData = userDoc.data(); 
        const userRole = userData.rol;

        switch (userRole) {
          case 'Administrador':
            navigation.reset({
              index: 0,
              routes: [{ name: 'AdminDashboard' }],
            });
            break;
          case 'Emprendedor':
            navigation.reset({
              index: 0,
              routes: [{ name: 'EmprendedorDashboard', params: { emprendedorId: user.uid } }],
            });
            break;
          case 'Inversionista':
            navigation.reset({
              index: 0,
              routes: [{ name: 'InversionistaDashboard', params: { inversionistaId: user.uid } }],
            });
            break;
          default:
            Alert.alert('Error', 'Rol de usuario desconocido.');
            break;
        }
      } else { 
        Alert.alert('Error', 'No se encontró información del usuario en la base de datos'); 
      } 

     
      setEmail(''); 
      setPassword(''); 
    } catch (error) { 
      console.error('Error de inicio de sesión:', error); 
      Alert.alert('Error de inicio de sesión', 'Usuario o contraseña incorrectos'); 
    } 
  };

  return (
    <LinearGradient 
      colors={['#B8CDD6', '#FFFFFF']} // Degradado de color
      style={styles.container}
    >
      <Image source={require('../assets/icon/LogoStartCap.png')} style={styles.logo} />
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
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>
        ¿No tienes una cuenta? <Text style={styles.linkText} onPress={() => navigation.navigate('Registro')}>Regístrate aquí</Text>
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default Login; 
