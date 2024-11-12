import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { db } from '../../firebase/firebaseconfig'; // Asegúrate de tener tu firebaseconfig.js configurado correctamente
import { collection, query, where, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';

const Notificaciones = ({ navigation }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para enviar notificaciones
  const sendNotification = async (userId, title, content) => {
    try {
      const notificationsRef = collection(db, 'notificaciones');
      const notification = {
        userId,
        titulo: title,
        contenido: content,
        fecha: Timestamp.now(),
        visto: false, // Inicialmente no vista
      };
      await addDoc(notificationsRef, notification);
    } catch (error) {
      console.error('Error al enviar notificación: ', error);
      Alert.alert('Error', 'No se pudo enviar la notificación.');
    }
  };

  // Este efecto obtiene las notificaciones desde Firestore
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const notificationsRef = collection(db, 'notificaciones');
        const q = query(notificationsRef, where('visto', '==', false)); // Filtra solo las no vistas
        const unsubscribe = onSnapshot(q, snapshot => {
          const notificationsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotificaciones(notificationsList);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching notifications: ', error);
        Alert.alert('Error', 'No se pudieron cargar las notificaciones.');
      }
    };

    getNotifications();
  }, []);

  // Función para marcar como vista una notificación
  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notificaciones', notificationId);
      await updateDoc(notificationRef, {
        visto: true,
      });
    } catch (error) {
      console.error('Error al marcar notificación como leída: ', error);
      Alert.alert('Error', 'No se pudo marcar la notificación como leída.');
    }
  };

  // Función para navegar a un detalle de la notificación (o cualquier otra acción)
  const handleNotificationPress = (notification) => {
    markAsRead(notification.id);
    navigation.navigate('NotificationDetail', { notificationId: notification.id });
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(item)}
    >
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.content}>{item.contenido}</Text>
      <Text style={styles.date}>{new Date(item.fecha.seconds * 1000).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Cargando notificaciones...</Text>
      </View>
    );
  }

  if (notificaciones.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No tienes notificaciones.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notificaciones}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 10,
  },
  notificationItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 14,
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    marginTop: 10,
    color: '#888',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Notificaciones;
