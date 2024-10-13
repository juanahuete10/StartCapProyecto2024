import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { EditOutline } from '@ant-design/icons-react-native';

const firestore = getFirestore();

export default function InversionistaPerfil({ route, navigation }) {
  const { userId } = route.params || {}; // Usa optional chaining para evitar errores si route.params es undefined
  const [userProfile, setUserProfile] = useState(null);

  // Verifica que el userId esté definido
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        console.log('No user ID provided');
        return;
      }

      const userRef = doc(firestore, 'inversionistas', userId); // Cambia 'inversionistas' según tu colección
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: userProfile.profileImage }} style={styles.avatar} />
      <Text style={styles.name}>{userProfile.name}</Text>
      <Text style={styles.description}>{userProfile.description}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoText}>{userProfile.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Teléfono:</Text>
        <Text style={styles.infoText}>{userProfile.phone}</Text>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('InversionistaForm', { userId })}>
        <EditOutline style={styles.editIcon} />
        <Text style={styles.editText}>Editar perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F9FC',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#333333',
  },
  infoText: {
    color: '#666666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
  },
  editIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 5,
  },
  editText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
