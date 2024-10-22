import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, TextInput } from 'react-native';
import { auth, db } from '../../firebase/firebaseconfig'; // Importa tu configuración de Firebase
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUsuario(data);
            setNombre(data.nombre || '');
            setFotoPerfil(data.foto_perfil || null);
          } else {
            Alert.alert('Error', 'No se encontraron datos del usuario.');
          }
        } catch (error) {
          Alert.alert('Error', 'Hubo un problema al cargar los datos del perfil.');
          console.error("Error al cargar datos del usuario:", error);
        } finally {
          setCargando(false);
        }
      } else {
        Alert.alert('Error', 'No hay un usuario autenticado.');
        setCargando(false);
      }
    };

    fetchUsuario();
  }, []);

  const guardarCambios = async () => {
    if (!nombre) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'usuarios', user.uid);
        await updateDoc(userRef, {
          nombre,
        });
        setUsuario({ ...usuario, nombre });
        setEditando(false);
        Alert.alert("Perfil actualizado con éxito!");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al actualizar el perfil.");
      console.error("Error al actualizar perfil:", error);
    }
  };

  if (cargando) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {usuario && (
        <>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.image} />
          ) : (
            <Image
              source={require('../../assets/icon/LogoStartCap.png')} // Puedes cambiar esta imagen según tus necesidades
              style={styles.image}
            />
          )}

          {editando ? (
            <>
              <Text style={styles.label}>Nombre:</Text>
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
              />

              <TouchableOpacity style={styles.button} onPress={guardarCambios}>
                <Text style={styles.buttonText}>Guardar Cambios</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>Perfil de {usuario.nombre}</Text>
              <Text style={styles.label}>Correo: {usuario.email}</Text>
              <Text style={styles.label}>Rol: {usuario.rol}</Text>
              <Text style={styles.label}>Género: {usuario.genero}</Text>
              <Text style={styles.label}>Cédula: {usuario.cedula}</Text>
              <Text style={styles.label}>Fecha de Nacimiento: {usuario.fecha_nacimiento}</Text>
              <Text style={styles.label}>Localidad: {usuario.localidad}</Text>
              <Text style={styles.label}>Descripción: {usuario.descripcion}</Text>
              <Text style={styles.label}>Preferencia: {usuario.preferencia}</Text>

              <TouchableOpacity style={styles.button} onPress={() => setEditando(true)}>
                <Text style={styles.buttonText}>Editar Perfil</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFAE3',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005EB8',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#333',
    marginVertical: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  input: {
    width: '90%',
    borderWidth: 2,
    borderColor: '#005EB8',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#005EB8',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Perfil;
