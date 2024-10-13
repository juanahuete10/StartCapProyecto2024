import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore'; // Asegúrate de importar firestore correctamente

const Notificaciones = () => {
  const [loading, setLoading] = useState(true);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    // Función para obtener las notificaciones desde Firestore
    const obtenerNotificaciones = firestore()
      .collection('notificaciones') // Asegúrate de que tienes una colección llamada 'notificaciones'
      .onSnapshot(snapshot => {
        const nuevasNotificaciones = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotificaciones(nuevasNotificaciones);
        setLoading(false);
      });

    // Limpiar la suscripción al desmontar el componente
    return () => obtenerNotificaciones();
  }, []);

  if (loading) {
    return <Text>Cargando notificaciones...</Text>;
  }

  return (
    <View>
      {notificaciones.length > 0 ? (
        notificaciones.map((notificacion) => (
          <Text key={notificacion.id}>{notificacion.contenido}</Text>
        ))
      ) : (
        <Text>No hay notificaciones</Text>
      )}
    </View>
  );
};

export default Notificaciones;
