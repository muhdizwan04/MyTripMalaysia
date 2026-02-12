import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Map, PlusCircle, Train, User, Info, Utensils, ShoppingBag } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ResponseEntity, View } from 'react-native';

// Parameters
import { colors } from './src/config/colors';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import PlanTripScreen from './src/screens/PlanTripScreen';
import ItineraryScreen from './src/screens/ItineraryScreen';
import MyTripsScreen from './src/screens/MyTripsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import SignupScreen from './src/screens/auth/SignupScreen';

// New Screens (Strict Parity)
import TransportScreen from './src/screens/TransportScreen';
import FoodScreen from './src/screens/FoodScreen';
import MustVisitScreen from './src/screens/MustVisitScreen';
import ShoppingScreen from './src/screens/ShoppingScreen';
import MallDetailsScreen from './src/screens/MallDetailsScreen';

// Contexts
import { TripProvider } from './src/context/TripContext';
import { CurrencyProvider } from './src/context/CurrencyContext';

// Setup Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Temporary Verification Log
import { auth } from './src/config/firebase';
if (auth?.app?.options?.projectId) {
  console.log("🔥 Connected to Project: " + auth.app.options.projectId);
} else {
  console.log("⚠️ Firebase not verified yet. Update src/config/firebase.js with your keys.");
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          tabBarLabel: 'Explore'
        }}
      />
      <Tab.Screen
        name="Transport"
        component={TransportScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Train color={color} size={size} />,
          tabBarLabel: 'Transport'
        }}
      />
      <Tab.Screen
        name="Plan"
        component={PlanTripScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              top: -20,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}>
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.foreground,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <PlusCircle color="white" size={32} />
              </View>
            </View>
          ),
          tabBarLabel: ''
        }}
      />
      <Tab.Screen
        name="Trips"
        component={MyTripsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
          tabBarLabel: 'My Trips'
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          tabBarLabel: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TripProvider>
        <CurrencyProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
              {/* Auth Stack */}
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />

              {/* Main App */}
              <Stack.Screen name="Main" component={TabNavigator} />

              {/* Detail Stacks */}
              <Stack.Screen name="Itinerary" component={ItineraryScreen} />
              <Stack.Screen name="Expenses" component={ExpensesScreen} />

              {/* Parity Screens */}
              <Stack.Screen name="Food" component={FoodScreen} />
              <Stack.Screen name="MustVisit" component={MustVisitScreen} />
              <Stack.Screen name="Shopping" component={ShoppingScreen} />
              <Stack.Screen name="MallDetails" component={MallDetailsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="auto" />
        </CurrencyProvider>
      </TripProvider>
    </SafeAreaProvider>
  );
}
