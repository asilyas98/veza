import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';

// Screens
import Landing  from '../screens/Landing';
import Login    from '../screens/Login';
import Register from '../screens/Register';
import Discover from '../screens/Discover';
import Likes    from '../screens/Likes';
import Stories  from '../screens/Stories';
import Matches  from '../screens/Matches';
import Chat     from '../screens/Chat';
import Profile  from '../screens/Profile';
import Pricing  from '../screens/Pricing';
import IDVerify from '../screens/IDVerify';

// Tab Icons (SVG-like with text)
import { TabBarIcon } from '../components/TabBarIcon';

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  Chat: { matchId: string; name: string };
  Pricing: undefined;
  IDVerify: undefined;
};

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
};

export type TabParamList = {
  Discover: undefined;
  Likes: undefined;
  Stories: undefined;
  Matches: undefined;
  Profile: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab       = createBottomTabNavigator<TabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Landing"  component={Landing} />
      <AuthStack.Screen name="Login"    component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.brand[500],
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray[100],
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon name={route.name as any} focused={focused} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen name="Discover" component={Discover} />
      <Tab.Screen name="Likes"    component={Likes} />
      <Tab.Screen name="Stories"  component={Stories} />
      <Tab.Screen name="Matches"  component={Matches} />
      <Tab.Screen name="Profile"  component={Profile} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={s.loader}>
        <ActivityIndicator size="large" color={Colors.brand[500]} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <RootStack.Screen name="App"      component={TabNavigator} />
            <RootStack.Screen name="Chat"     component={Chat}     options={{ presentation: 'card', headerShown: false }} />
            <RootStack.Screen name="Pricing"  component={Pricing}  options={{ presentation: 'modal' }} />
            <RootStack.Screen name="IDVerify" component={IDVerify} options={{ presentation: 'modal' }} />
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const s = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white },
});
