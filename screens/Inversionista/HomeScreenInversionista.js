import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreenInversionista = ({ route }) => {
  // Obtener el ID del inversionista a través de los parámetros de ruta
  const { inversionistaId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, Inversionista!</Text>
      <Text style={styles.subTitle}>Tu ID: {inversionistaId}</Text>
      {/* Agrega más contenido y componentes según tus necesidades */}
      {/* Por ejemplo, podrías agregar botones o secciones adicionales aquí */}
    </View>
  );
};

// Estilos para el componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366', // Puedes cambiar el color según tu diseño
  },
  subTitle: {
    fontSize: 18,
    color: '#607D8B',
  },
});

export default HomeScreenInversionista;
