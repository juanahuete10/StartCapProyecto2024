import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InversionistaDashboard({ navigation }) {
  const [formCompleted, setFormCompleted] = useState(false);

  useEffect(() => {
    const checkFormStatus = async () => {
      const value = await AsyncStorage.getItem('formCompleted');
      setFormCompleted(value === 'true');
    };

    checkFormStatus();
  }, []);

  const handleNavigation = (screen) => {
    console.log(`Navegando a: ${screen}`); 
    if (!formCompleted && screen !== 'InversionistaForm') {
      navigation.navigate('InversionistaForm');
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro Inversionista</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('InversionistaForm')}>
          <MaterialCommunityIcons name="form-textbox" size={30} color="#0e5575" />
          <Text style={styles.buttonText}>Registro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('InversionistaPerfil')}>
          <AntDesign name="profile" size={30} color="#0e5575" />
          <Text style={styles.buttonText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Notificaciones')}>
          <MaterialCommunityIcons name="bell-outline" size={30} color="#0e5575" />
          <Text style={styles.buttonText}>Notificaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('ExploracionProyecto')}>
        <AntDesign name="search1" size={24} color="#0e5575" />
          <Text style={styles.buttonText}>ExploracionProyecto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation('Chats')}>
          <MaterialCommunityIcons name="chat-outline" size={30} color="#0e5575" />
          <Text style={styles.buttonText}>Chats</Text>
        </TouchableOpacity>

  

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0e5575',
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2994a',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
