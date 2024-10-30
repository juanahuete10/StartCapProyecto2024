import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Mensaje = ({ mensaje, esPropio }) => {
  return (
    <View style={[styles.mensaje, esPropio ? styles.mensajePropio : styles.mensajeAjeno]}>
      <Text style={styles.texto}>{mensaje.texto}</Text>
      <Text style={styles.fecha}>
        {new Date(mensaje.fecha.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mensaje: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    maxWidth: '80%', // Limitar el ancho de los mensajes
  },
  mensajePropio: {
    backgroundColor: '#d1e7dd', // Color de fondo para mensajes propios
    alignSelf: 'flex-end', // Alinear a la derecha
  },
  mensajeAjeno: {
    backgroundColor: '#f8d7da', // Color de fondo para mensajes ajenos
    alignSelf: 'flex-start', // Alinear a la izquierda
  },
  texto: {
    fontSize: 16, // Tamaño del texto
  },
  fecha: {
    fontSize: 12, // Tamaño del texto de la fecha
    color: '#888', // Color del texto de la fecha
    marginTop: 5, // Margen superior
  },
});

export default Mensaje;
