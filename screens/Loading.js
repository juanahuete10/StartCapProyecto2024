// Loading.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { auth } from '../firebase/firebaseconfig';
import { useNavigation } from '@react-navigation/native';

export default function Loading() {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Si el usuario está autenticado, navegar a SeleccionPerfil
        navigation.reset({
          index: 0,
          routes: [{ name: 'SeleccionPerfil' }],
        });
      } else {
        // Si no está autenticado, navegar a Login
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    });

    // Limpia el listener cuando el componente se desmonta
    return () => unsubscribe();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
