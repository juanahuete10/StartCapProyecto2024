import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebaseconfig';

export default function InversionistaDashboard({ navigation, userId }) {
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const cargarProyectos = async () => {
    setLoading(true);
    try {
      const q = filtro
        ? query(collection(db, 'proyectos'), where('categoria', '==', filtro))
        : collection(db, 'proyectos');

      const querySnapshot = await getDocs(q);
      const proyectosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProyectos(proyectosData);
    } catch (error) {
      console.error("Error cargando proyectos:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarProyectos();
  }, [filtro]);

  const handleMeEncanta = async (id, likes) => {
    const proyectoRef = doc(db, 'proyectos', id);
    try {
      await updateDoc(proyectoRef, { likes: (likes || 0) + 1 });
      const updatedProyectos = proyectos.map((proyecto) =>
        proyecto.id === id ? { ...proyecto, likes: (likes || 0) + 1 } : proyecto
      );
      setProyectos(updatedProyectos);
    } catch (error) {
      console.error("Error al dar 'me encanta':", error);
    }
  };

  // Actualiza esta función para que tome el ID del emprendedor
  const handleChats = (id_emprendedor) => {
    navigation.navigate('Chats', { id_emprendedor }); 
  };

  const filteredProyectos = proyectos.filter((proyecto) =>
    proyecto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proyecto.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProyecto = ({ item }) => (
    <View style={styles.projectCard}>
      <View style={styles.projectHeader}>
        {item.fotoPerfil ? (
          <Image
            source={{ uri: item.fotoPerfil }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        <Text style={styles.projectAuthor}>{item.nombre}</Text>
      </View>
      <Text style={styles.projectDescription}>{item.descripcion}</Text>
      <View style={styles.projectFooter}>
        <TouchableOpacity onPress={() => handleMeEncanta(item.id, item.likes)}>
          <View style={styles.likesContainer}>
            <MaterialCommunityIcons name="heart" size={24} color="#E63946" />
            <Text style={styles.likesText}>{item.likes || 0} Me encanta</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleChats(item.id_emprendedor)}>
          <View style={styles.chatContainer}>
            <MaterialCommunityIcons name="message" size={24} color="#1E90FF" />
            <Text style={styles.chatText}>Chat</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil', { userId: item.id })}>
          <Text style={styles.profileLink}>Ver perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#005EB8" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/icon/LogoStartCap.png')} style={styles.backgroundImage} />

      {/* Barra de notificaciones y búsqueda */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => navigation.navigate('Notificaciones')}>
          <MaterialCommunityIcons name="bell" size={28} color="#003366" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar proyectos..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
      </View>

      {/* Barra de navegación compacta para Chats y Perfil */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Chats')}>
          <MaterialCommunityIcons name="message-outline" size={24} color="#003366" />
          <Text style={styles.navText}>Chats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Perfil')}>
          <MaterialCommunityIcons name="account-outline" size={24} color="#003366" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de proyectos */}
      <FlatList
        data={filteredProyectos}
        renderItem={renderProyecto}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.projectsList}
        ListEmptyComponent={<Text>No se encontraron proyectos</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    opacity: 0.1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
  },
  notificationIcon: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#666666',
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
  chatContainer: {
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
  profileLink: {
    color: '#1E90FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#003366',
    marginTop: 2,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
