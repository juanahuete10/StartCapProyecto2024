import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { db } from '../../firebase/firebaseconfig'; // Asegúrate de tener tu archivo de configuración de Firebase
import { collection, onSnapshot } from 'firebase/firestore';

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'notificaciones'), (snapshot) => {
      const nuevaLista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotificaciones(nuevaLista);
    }, (error) => {
      Alert.alert('Error', 'No se pudieron cargar las notificaciones.');
      console.error("Error al cargar notificaciones:", error);
    });

    // Limpieza del efecto para evitar fugas de memoria
    return () => unsubscribe();
  }, []);

  const renderNotificacion = ({ item }) => (
    <View style={styles.notificacionContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notificaciones}
        renderItem={renderNotificacion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  list: {
    paddingBottom: 20,
  },
  notificacionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005EB8',
  },
  message: {
    fontSize: 14,
    color: '#333',
  },
});

export default Notificaciones;
