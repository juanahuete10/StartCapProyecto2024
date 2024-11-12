import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import Home from './screens/Home';
import Mensaje from './screens/Inversionista/Mensaje';
import SeleccionPerfil from './screens/SeleccionPerfil';
import Registro from './screens/Registro';
import InversionistaForm from './screens/Inversionista/InversionistaForm';
import Notificaciones from './screens/Inversionista/Notificaciones';
import ExploracionProyecto from './screens/Inversionista/ExploracionProyecto';
import EmprendedorForm from './screens/Emprendedor/EmprendedorForm';
import AdminForm from './screens/Administrador/AdminForm';
import AdminDashboard from './screens/Administrador/AdminDashboard';
import AdminPerfil from './screens/Administrador/AdminPerfil';
import Proyectos from './screens/Emprendedor/Proyectos';
import InversionistaDashboard from './screens/Inversionista/InversionistaDashboard';
import Perfil from './screens/Inversionista/Perfil';
import Login from './screens/Login';
import ListarChats from './screens/Inversionista/ListarChats';
import MisProyectos from './screens/Emprendedor/MisProyectos';
import Chat from './screens/Inversionista/Chat';
import VerPerfilEmprendedor from './screens/Emprendedor/VerPerfilEmprendedor';
import Ajustes from './screens/Emprendedor/Ajustes';
import AcercaDe from './screens/Emprendedor/AcercaDe';
import Ayuda from './screens/Emprendedor/Ayuda';



// Crear un Stack Navigator para las funcionalidades de administración
const AdminStack = createStackNavigator();

function AdminNavigator() {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen
        name="AdminForm"
        component={AdminForm}
        options={{ headerShown: false }} 
      />
      <AdminStack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{ headerShown: false }} 
      />
      <AdminStack.Screen
        name="AdminPerfil"
        component={AdminPerfil}
        options={{ headerShown: false }} 
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
        name='EmprendedorPerfil'
        component={EmprendededorPerfil}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-tie" size={size} color={color} />
          ),
        }}
      />

       <Tab.Screen
        name='Mensaje'
        component={Mensaje} 
        options={{
          tabBarLabel: 'Mensaje',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chats" size={size} color={color} />
          ),
        }}
      />
       <Tab.Screen
        name='MisProyectos'
        component={MisProyectos}
        options={{
          tabBarLabel: 'MisProyectos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="projects" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name='Ayuda'
        component={Ayuda}
        options={{
          tabBarLabel: 'Ayuda',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="projects" size={size} color={color} />
          ),
        }}
      />

<Tab.Screen
        name='AcercaDe'
        component={AcercaDe}
        options={{
          tabBarLabel: 'AcercaDe',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="projects" size={size} color={color} />
          ),
        }}
      />
      


      <Tab.Screen
        name='Login'
        component={Login}
        options={{
          tabBarLabel: 'Iniciar Sesión',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-plus" size={size} color={color} />
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
        name='InversionistaDashboard'
        component={InversionistaDashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-tie" size={size} color={color} />
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
        name='Perfil'
        component={Perfil}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
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
        name='Chat'
        component={Chat} 
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chats" size={size} color={color} />
          ),
        }}
      />
       <Tab.Screen
        name='VerPerfilEmprendedor'
        component={VerPerfilEmprendedor} 
        options={{
          tabBarLabel: 'VerPerfilEmprendedor',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chats" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name='DetalleMensaje'
        component={DetalleMensaje} 
        options={{
          tabBarLabel: 'DetalleMensaje',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chats" size={size} color={color} />
          ),
        }}
      />

      
      <Tab.Screen
        name='ListarChats'
        component={ListarChats} 
        options={{
          tabBarLabel: 'ListarChats',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chats" size={size} color={color} />
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
        name='CerrarSesion'
        component={CerrarSesion} 
        options={{
          tabBarLabel: 'CerrarSesion',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chats" size={size} color={color} />
          ),
        }}
      />
        <Tab.Screen
        name='Ajustes'
        component={Ajustes} 
        options={{
          tabBarLabel: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chats" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name='Admin'
        component={AdminNavigator}
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

export default function navegacion() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}