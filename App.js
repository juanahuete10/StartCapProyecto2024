// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importa las pantallas
import Home from './screens/Home';
import Login from './screens/Login';
import SeleccionPerfil from './screens/SeleccionPerfil';
import Registro from './screens/Registro';
import InversionistaForm from './Frontend-StartCap/InversionistaForm';
import InversionistaPerfil from './screens/InversionistaPerfil';
import Notificaciones from './screens/Notificaciones';
import InversionistaDashboard from './screens/InversionistaDashboard';
import Chats from './screens/Chats';
import ExploracionProyecto from './screens/ExploracionProyecto';
import EmprendedorForm from './screens/Emprendedor/EmprendedorForm';
import EmprendedorDashboard from './screens/Emprendedor/EmprendedorDashboard';
import Loading from './screens/Loading'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SeleccionPerfil" component={SeleccionPerfil} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="InversionistaForm" component={InversionistaForm} />
        <Stack.Screen name="InversionistaPerfil" component={InversionistaPerfil} />
        <Stack.Screen name="Notificaciones" component={Notificaciones} />
        <Stack.Screen name="InversionistaDashboard" component={InversionistaDashboard} />
        <Stack.Screen name="Chats" component={Chats} />
        <Stack.Screen name="ExploracionProyecto" component={ExploracionProyecto} />
        <Stack.Screen name="EmprendedorForm" component={EmprendedorForm} />
        <Stack.Screen name="EmprendedorDashboard" component={EmprendedorDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
