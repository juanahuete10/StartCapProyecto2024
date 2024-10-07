import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// Inicializa Firestore
const firestore = getFirestore();

export default function AdminDashboard({ navigation }) {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchUsersAndProjects = async () => {
      const usersSnapshot = await getDocs(collection(firestore, 'users')); // Asegúrate de que el nombre de la colección sea correcto
      const projectsSnapshot = await getDocs(collection(firestore, 'projects'));

      const usersList = [];
      usersSnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);

      const projectsList = [];
      projectsSnapshot.forEach((doc) => {
        projectsList.push({ id: doc.id, ...doc.data() });
      });
      setProjects(projectsList);
    };

    fetchUsersAndProjects();
  }, []);

  const handleEditUser = (userId) => {
    navigation.navigate('EditUser', { userId });
  };

  const handleEditProject = (projectId) => {
    navigation.navigate('EditProject', { projectId });
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleEditUser(item.id)}>
        <Text style={styles.editText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProject = ({ item }) => (
    <View style={styles.projectCard}>
      <Text style={styles.projectTitle}>{item.title}</Text>
      <TouchableOpacity onPress={() => handleEditProject(item.id)}>
        <Text style={styles.editText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Inicio')}>
          <MaterialCommunityIcons name="home-outline" size={28} color="#003366" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Usuarios')}>
          <MaterialCommunityIcons name="account-multiple-outline" size={28} color="#003366" />
          <Text style={styles.navText}>Usuarios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Proyectos')}>
          <MaterialCommunityIcons name="file-document-outline" size={28} color="#003366" />
          <Text style={styles.navText}>Proyectos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AdminPerfil')}>
          <MaterialCommunityIcons name="account-multiple-outline" size={28} color="#003366" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>

        {/* Agrega más íconos y funcionalidades según sea necesario */}
      </View>

      <Text style={styles.sectionTitle}>Emprendedores e Inversionistas</Text>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.usersList}
      />

      <Text style={styles.sectionTitle}>Proyectos</Text>
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.projectsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 20,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#003366',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  usersList: {
    marginBottom: 20,
  },
  projectsList: {
    marginBottom: 20,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  editText: {
    color: '#1E90FF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
