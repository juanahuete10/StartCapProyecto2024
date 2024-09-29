import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


import Chats from './screens/Chats';
import Home from'./screens/Home';

const Tab = createBottomTabNavigator();

function MyTabs(){
  return(
    <Tab.Navigator>
      initialRouteName='Home'
      screenOptions={{
        tabBarActivateTintColor: 'black'
      }}



      <Tab.Screen name='Home' component={Home}/>
      options={{
        tabBarLabel:'Home',
        tabBarIcon:({color,size})=> (
          <MaterialCommunityIcons name="home" size ={24} color={color}/>
        )
      }}


      <Tab.Screen name='Chats' component={Chats}/>
      options={{
        tabBarLabel:'Chats',
        tabBarIcon:({color,size})=> (
          <MaterialCommunityIcons name="chats" size ={24} color={color}/>
        )
      }}
    </Tab.Navigator>
  )
};
export default function Navegacion() {
  return (
    <NavigationContainer>
      <MyTabs/>
    </NavigationContainer>
  )
}