import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import Home from './screens/Home';
import Chats from './screens/Chats';
import SeleccionPerfil from './screens/SeleccionPerfil';
import Registro from './screens/Registro';
import InversionistaForm from './Frontend-StartCap/InversionistaForm';
import Notificaciones from './screens/Notificaciones';
import ExploracionProyecto from './screens/ExploracionProyecto';
import EmprendedorForm from './screens/Emprendedor/EmprendedorForm';
import Inicio from './screens/Inicio';
import AdminForm from './screens/Administrador/AdminForm';
import AdminDashboard from './screens/Administrador/AdminDashboard'; // Asegúrate de importar AdminDashboard
import AdminPerfil from './screens/Administrador/AdminPerfil';
import Proyectos from './screens/Emprendedor/Proyectos';

// Crear un Stack Navigator para las funcionalidades de administración
const AdminStack = createStackNavigator();

function AdminNavigator() {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen
        name="AdminForm"
        component={AdminForm}
        options={{ headerShown: false }} // Ocultar el encabezado si es necesario
      />
      <AdminStack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{ headerShown: false }} // Ocultar el encabezado si es necesario
      />
      <AdminStack.Screen
        name="AdminPerfil"
        component={AdminPerfil}
        options={{ headerShown: false }} // Ocultar el encabezado si es necesario
      />
    </AdminStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}
    >
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Chats'
        component={Chats}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='SeleccionPerfil'
        component={SeleccionPerfil}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Registro'
        component={Registro}
        options={{
          tabBarLabel: 'Registro',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-plus" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='InversionistaForm'
        component={InversionistaForm}
        options={{
          headerShown: false,
          tabBarLabel: 'Inversionista',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-tie" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Inicio'
        component={Inicio}
        options={{
          headerShown: false,
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Notificaciones'
        component={Notificaciones}
        options={{
          headerShown: false,
          tabBarLabel: 'Notificaciones',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='EmprendedorForm'
        component={EmprendedorForm}
        options={{
          headerShown: false,
          tabBarLabel: 'Emprendedor',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Proyectos'
        component={Proyectos}
        options={{
          tabBarLabel: 'Proyectos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="description" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name='ExploracionProyecto'
        component={ExploracionProyecto}
        options={{
          headerShown: false,
          tabBarLabel: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Admin'
        component={AdminNavigator} // Cambiar a usar el Stack Navigator
        options={{
          headerShown: false,
          tabBarLabel: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shield-account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navegacion() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

