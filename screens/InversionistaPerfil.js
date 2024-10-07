import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../firebase/firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';

const InversionistaPerfil = ({ route }) => {
  const [inversionista, setInversionista] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatosInversionista = async () => {
      try {
        const id_usuario = route.params?.id_usuario; // Usar el operador de encadenamiento opcional
        if (!id_usuario) {
          console.error("El ID de usuario no está definido");
          return; // Si no hay ID, salir de la función
        }

        const docRef = doc(db, 'inversionistas', id_usuario);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setInversionista(docSnap.data());
        } else {
          console.log("No se encontró el inversionista");
        }
      } catch (error) {
        console.error("Error al obtener los datos del inversionista:", error);
      } finally {
        setLoading(false); // Esto se ejecuta siempre al final
      }
    };

    obtenerDatosInversionista(); // Llamar a la función para obtener los datos
  }, [route.params?.id_usuario]); // Escuchar cambios en el ID de usuario

  if (loading) {
    return <ActivityIndicator size="large" color="#00A859" />; // Mostrar un indicador de carga
  }

  if (!inversionista) {
    return <Text>No se encontraron los datos del inversionista</Text>; // Manejar el caso donde no se encuentran datos
  }

  return (
    <View style={styles.container}>
      {inversionista.foto_perfil && (
        <Image
          source={{ uri: inversionista.foto_perfil }}
          style={styles.fotoPerfil}
        />
      )}
      <Text style={styles.label}>Nombre: {inversionista.nombre1 || 'N/A'} {inversionista.nombre2 || ''}</Text>
      <Text style={styles.label}>Apellidos: {inversionista.apellido1 || 'N/A'} {inversionista.apellido2 || ''}</Text>
      <Text style={styles.label}>Cédula: {inversionista.cedula || 'N/A'}</Text>
      <Text style={styles.label}>Género: {inversionista.genero || 'N/A'}</Text>
      <Text style={styles.label}>Fecha de Nacimiento: {inversionista.fecha_nac || 'N/A'}</Text>
      <Text style={styles.label}>Localidad: {inversionista.localidad || 'N/A'}</Text>
      <Text style={styles.label}>Descripción: {inversionista.descripcion || 'N/A'}</Text>
      <Text style={styles.label}>Preferencias: {inversionista.preferencia || 'N/A'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFAE3',
  },
  label: {
    fontSize: 16,
    fontFamily: 'TW CEN MT',
    fontWeight: 'bold',
    color: '#005EB8',
    marginVertical: 8,
  },
  fotoPerfil: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
});

export default InversionistaPerfil;

