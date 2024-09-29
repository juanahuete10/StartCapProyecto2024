import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const InversionistaPerfil = ({ inversionista }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: inversionista.foto_perfil }} style={styles.fotoPerfil} />
      <Text style={styles.nombre}>
        {inversionista.nombres} {inversionista.apellidos}
      </Text>
      <Text style={styles.descripcion}>{inversionista.descripcion}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Cédula: {inversionista.cedula}</Text>
        <Text style={styles.info}>Género: {inversionista.genero}</Text>
        <Text style={styles.info}>Fecha de Nacimiento: {inversionista.fecha_nac}</Text>
        <Text style={styles.info}>Correo: {inversionista.correo}</Text>
        <Text style={styles.info}>Localidad: {inversionista.localidad}</Text>
        <Text style={styles.info}>Intereses: {inversionista.preferencia}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0e5575',
  },
  descripcion: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  info: {
    fontSize: 14,
    marginVertical: 5,
    color: '#555',
  },
});

export default InversionistaPerfil;

