//src/screens/App.js

import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, Platform} from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen'
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { getCurrentUser } from './src/services/storage';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({onLogout}) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#7f8c8d',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Calcular',
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color }} />,
        }}
      />
      <Tab.Screen
        name="History"
        
        options={{
          tabBarLabel: 'Histórico',
          tabBarIcon: ({ color }) => <View style={{ width: 24, height: 24, backgroundColor: color }} />,
        }}
      >
        {(props) => <HistoryScreen {...props} onLogout={onLogout}/>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
  const handleLoginSucess = () =>{
    setIsAuthenticated(true);
  }
  
  const checkAuth = async () => {    
    try{
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
    }catch(err){
      setIsAuthenticated(false);
    }finally{      
      setIsLoading(false);
    }  
    
  };

  useEffect(() => {   
    checkAuth();
  }, []);


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
          <Stack.Screen name='Login'>
            {(props) => <LoginScreen {...props} onLoginSuccess={()=> setIsAuthenticated(true)}/>}
          </Stack.Screen>
          <Stack.Screen name='Register' component={RegisterScreen}/> 
          </>         
        ):(
          <Stack.Screen name='Main'>
            {(props) => <MainTabs {...props} onLogout={()=>setIsAuthenticated(false)}/> }
          </Stack.Screen>
        )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}
