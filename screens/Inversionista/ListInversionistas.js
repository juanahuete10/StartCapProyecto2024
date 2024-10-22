import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db } from '../../firebase/firebaseconfig'; 
import { collection, getDocs } from 'firebase/firestore';

const ListInversionistas = ({ navigation }) => {
  const [inversionistas, setInversionistas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInversionistas = async () => {
      try {
        const inversionistasCollection = collection(db, "inversionistas");
        const inversionistasSnapshot = await getDocs(inversionistasCollection);
        const inversionistasList = inversionistasSnapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data(),
        }));
        setInversionistas(inversionistasList);
      } catch (error) {
        console.error("Error al recuperar los inversionistas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInversionistas();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        console.log('Navigating to InversionistaPerfil with ID:', item.id); // Agregado para depuración
        navigation.navigate('InversionistaPerfil', { id_inversionista: item.id });
      }} 
    >
      <Text style={styles.itemText}>{`${item.nombre1} ${item.apellido1}`}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#005EB8" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={inversionistas}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
  item: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 18,
    color: '#005EB8',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListInversionistas;
