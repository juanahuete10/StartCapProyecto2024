import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Home from './screens/Home';
import Login from './screens/Login';
import SeleccionPerfil from './screens/SeleccionPerfil'; 
import Registro from './screens/Registro';
import InversionistaForm from './screens/Inversionista/InversionistaForm'; 
import Notificaciones from './screens/Inversionista/Notificaciones';
import InversionistaDashboard from './screens/Inversionista/InversionistaDashboard';
import Chats from './screens/Inversionista/Chats';
import ExploracionProyecto from './screens/Inversionista/ExploracionProyecto';
import EmprendedorForm from './screens/Emprendedor/EmprendedorForm';
import EmprendedorDashboard from './screens/Emprendedor/EmprendedorDashboard'
import AdminForm from './screens/Administrador/AdminForm';
import AdminDashboard from './screens/Administrador/AdminDashboard'
import AdminPerfil from './screens/Administrador/AdminPerfil';
import Proyectos from './screens/Emprendedor/Proyectos';
import ListarProyectos from './screens/Emprendedor/ListarProyectos';
import ListInversionistas from './screens/Inversionista/ListInversionistas';
import ChatE from './screens/Emprendedor/ChatE';
import MessageInput from './screens/MessageInput';
import ListarChats from './screens/Inversionista/ListarChats';
import Perfil from './screens/Inversionista/Perfil';




const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SeleccionPerfil" component={SeleccionPerfil} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="InversionistaForm" component={InversionistaForm} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Notificaciones" component={Notificaciones} />
        <Stack.Screen name="InversionistaDashboard" component={InversionistaDashboard} />
        <Stack.Screen name="Chats" component={Chats} />
        <Stack.Screen name="ChatE" component={ChatE} />
        <Stack.Screen name="ExploracionProyecto" component={ExploracionProyecto} />
        <Stack.Screen name="EmprendedorForm" component={EmprendedorForm} />
        <Stack.Screen name="EmprendedorDashboard" component={EmprendedorDashboard} />
        <Stack.Screen name="AdminForm" component={AdminForm} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="AdminPerfil" component={AdminPerfil} />
        <Stack.Screen name="Proyectos" component={Proyectos} />
        <Stack.Screen name="ListarChats" component={ListarChats} />
        <Stack.Screen name="ListInversionistas" component={ListInversionistas} />
        <Stack.Screen name="ListarProyectos" component={ListarProyectos} />
        <Stack.Screen name="MessageInput" component={MessageInput} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
