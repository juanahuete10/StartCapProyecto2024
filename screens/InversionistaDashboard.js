import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';


const firestore = getFirestore();

export default function InversionistaDashboard({ navigation }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'projects'));
      const projectsList = [];
      querySnapshot.forEach((doc) => {
        projectsList.push({ id: doc.id, ...doc.data() });
      });
      setProjects(projectsList);
    };

    fetchProjects();
  }, []);

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  const handleMeEncanta = async (id, likes) => {
    const proyectoRef = doc(firestore, 'projects', id);
    await updateDoc(proyectoRef, { likes: likes + 1 });
  };

  const renderProject = ({ item }) => (
    <View style={styles.projectCard}>
      <View style={styles.projectHeader}>
      
        <Image source={{ uri: item.profileImage }} style={styles.avatar} />
        <Text style={styles.projectAuthor}>{item.authorName}</Text>
      </View>
      <Text style={styles.projectDescription}>{item.description}</Text>
      <View style={styles.projectFooter}>
        <TouchableOpacity onPress={() => handleMeEncanta(item.id, item.likes)}>
          <View style={styles.likesContainer}>
            <MaterialCommunityIcons name="heart-outline" size={24} color="gray" />
            <Text style={styles.likesText}>{item.likes} Me encanta</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('Chat', { emprendedorId: item.emprendedorId })}>
          <Text style={styles.chatText}>💬 Ver más</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
     
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('Inicio')}>
          <MaterialCommunityIcons name="home-outline" size={28} color="#003366" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('Busqueda')}>
          <MaterialCommunityIcons name="magnify" size={28} color="#003366" />
          <Text style={styles.navText}>Búsqueda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('Chats')}>
          <MaterialCommunityIcons name="message-outline" size={28} color="#003366" />
          <Text style={styles.navText}>Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('Notificaciones')}>
          <MaterialCommunityIcons name="bell-outline" size={28} color="#003366" />
          <Text style={styles.navText}>Notificaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('InversionistaPerfil')}>
          <MaterialCommunityIcons name="account-outline" size={28} color="#003366" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>

     
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
  },
  projectsList: {
    padding: 20,
  },
  projectCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  projectAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    marginLeft: 5,
    color: '#666666',
    fontSize: 14,
  },
  chatText: {
    color: '#1E90FF',
    fontSize: 14,
    fontWeight: 'bold',
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
});
