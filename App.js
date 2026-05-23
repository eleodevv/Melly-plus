import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import { useEffect } from 'react';
import { AppProvider, useApp } from './src/context/AppContext';

import Inicio from './src/screens/Inicio';
import Historial from './src/screens/Historial';
import Analisis from './src/screens/Analisis';
import Registrar from './src/screens/Registrar';
import Resultado from './src/screens/Resultado';
import Perfiles from './src/screens/Perfiles';
import Ajustes from './src/screens/Ajustes';
import Onboarding from './src/screens/Onboarding';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1a1a1a',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8E8E8',
          height: 70,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={Inicio}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="HistorialTab" 
        component={Historial}
        options={{
          tabBarLabel: 'Historial',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'list' : 'list-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="AnalisisTab" 
        component={Analisis}
        options={{
          tabBarLabel: 'Análisis',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'analytics' : 'analytics-outline'} size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  return (
    <AppProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
      </SafeAreaProvider>
    </AppProvider>
  );
}

function AppNavigator() {
  const { profile, loading } = useApp();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      >
        {!profile ? (
          <Stack.Screen 
            name="Onboarding" 
            component={Onboarding}
            options={{ animation: 'fade', gestureEnabled: false }}
          />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeTabs} />
            <Stack.Screen 
              name="Input" 
              component={Registrar}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen 
              name="Result" 
              component={Resultado}
              options={{ animation: 'fade', gestureEnabled: false }}
            />
            <Stack.Screen name="Perfiles" component={Perfiles} />
            <Stack.Screen name="Ajustes" component={Ajustes} />
            <Stack.Screen 
              name="OnboardingNew" 
              component={Onboarding}
              options={{ animation: 'fade' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
