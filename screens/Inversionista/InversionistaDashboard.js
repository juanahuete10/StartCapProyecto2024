import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { collection, getDocs, updateDoc, doc, query, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseconfig';
import { LinearGradient } from 'expo-linear-gradient';

export default function InversionistaDashboard({ navigation }) {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const cargarProyectos = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'proyectos'));
      const querySnapshot = await getDocs(q);
      const proyectosData = await Promise.all(
        querySnapshot.docs.map(async (projectDoc) => {
          const projectData = projectDoc.data();
          if (!projectData.id_emprendedor) return null;

          const emprendedorRef = doc(db, 'emprendedor', projectData.id_emprendedor);
          const emprendedorSnap = await getDoc(emprendedorRef);
          const emprendedorData = emprendedorSnap.exists() ? emprendedorSnap.data() : null;

          return {
            id: projectDoc.id,
            ...projectData,
            emprendedor: emprendedorData,
          };
        })
      );
      setProyectos(proyectosData.filter(Boolean));
    } catch (error) {
      console.error("Error cargando proyectos:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  const handleMeEncanta = async (id, likes) => {
    const proyectoRef = doc(db, 'proyectos', id);
    try {
      await updateDoc(proyectoRef, { likes: (likes || 0) + 1 });
      setProyectos((prevProyectos) =>
        prevProyectos.map((proyecto) =>
          proyecto.id === id ? { ...proyecto, likes: (likes || 0) + 1 } : proyecto
        )
      );
    } catch (error) {
      console.error("Error al dar 'me encanta':", error);
    }
  };

  const filteredProyectos = proyectos.filter((proyecto) =>
    (proyecto.nombre && proyecto.nombre.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (proyecto.descripcion && proyecto.descripcion.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleChat = (idEmprendedor) => {
    navigation.navigate('Chat', { idEmprendedor });
  };

  const handleEmprendedorPerfil = (idEmprendedor) => {
    navigation.navigate('VerPerfilEmprendedor', { idEmprendedor });
  };

  const renderProyecto = ({ item }) => (
    <View style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: item.emprendedor?.foto_perfil || 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          <Text style={styles.projectAuthor}>
            {item.emprendedor?.nombre1 || 'Desconocido'} {item.emprendedor?.apellido1 || ''}
          </Text>
        </View>

        <Text style={styles.projectNombre}>{item.nombre}</Text>
        <Text style={styles.projectDescription}>{item.descripcion}</Text>
      </View>

      <View style={styles.projectFooter}>
        <TouchableOpacity onPress={() => handleMeEncanta(item.id, item.likes)}>
          <View style={styles.likesContainer}>
            <MaterialCommunityIcons name="heart" size={24} color="#E63946" />
            <Text style={styles.likesText}>{item.likes || 0} Me encanta</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Chat')} style={styles.iconButton}>
            <MaterialCommunityIcons name="message" size={20} color="#1E90FF" />
            <Text style={styles.navText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEmprendedorPerfil(item.id_emprendedor)} style={styles.iconButton}>
            <MaterialCommunityIcons name="account-outline" size={20} color="#1E90FF" />
            <Text style={styles.navText}>Ver Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#005EB8" style={styles.loading} />;
  }

  return (
    <LinearGradient colors={['#B8CDD6', '#FFFFFF']} style={styles.container}>
      <Image source={require('../../assets/icon/LogoStartCap.png')} style={styles.backgroundImage} />

      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={24} color="#FFFFFF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar proyectos..."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>

          <TouchableOpacity style={styles.notificationIcon} onPress={() => navigation.navigate('Notificaciones')}>
            <MaterialCommunityIcons name="bell" size={28} color="#1E90FF" />
            <Text style={styles.navText}>Notificaciones</Text>
          </TouchableOpacity>

          <View style={styles.navItemsContainer}>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Chat')}>
              <MaterialCommunityIcons name="message-outline" size={28} color="#1E90FF" />
              <Text style={styles.navText}>Chats</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Perfil')}>
              <MaterialCommunityIcons name="account-outline" size={28} color="#1E90FF" />
              <Text style={styles.navText}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('CerrarSesion')}>
              <Entypo name="log-out" size={26} color="#1E90FF" />
              <Text style={styles.navText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={filteredProyectos}
        renderItem={renderProyecto}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.projectsList}
        ListEmptyComponent={<Text>No se encontraron proyectos</Text>}
      />
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    opacity: 0.1,
  },
  topBar: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationIcon: {
    padding: 5,
    alignItems: "center"
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#FFFFFF',
  },
  projectsList: {
    padding: 20,
    paddingBottom: 80,
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
    marginBottom: 10,
  },
  profileContainer: {
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
    marginRight: 10,
  },
  projectNombre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666666',
    marginVertical: 10,
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
    fontSize: 14,
    color: '#666666',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    paddingHorizontal: 10,
    alignItems:"center"
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  navItemsContainer: {
    flexDirection: 'row',
  },
  navItem: {
    alignItems: 'center',
    marginLeft: 10,
  },
  navText: {
    fontSize: 12,
    color: '#1E90FF',
  },
});
