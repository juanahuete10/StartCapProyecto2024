import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreenEmprendedor = ({ route }) => {
  const { emprendedorId } = route.params; // Obtener el ID del emprendedor

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido, Emprendedor!</Text>
      <Text style={styles.subTitle}>Tu ID: {emprendedorId}</Text>
      {/* Agrega más contenido y componentes según tus necesidades */}
    </View>
  );
};

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
  },
  subTitle: {
    fontSize: 18,
    color: '#607D8B',
  },
});

export default HomeScreenEmprendedor;
