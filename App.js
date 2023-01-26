/* eslint-disable react/style-prop-object */
// eslint-disable-next-line import/no-extraneous-dependencies

import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme
} from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StatusBar } from 'expo-status-bar';

import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import HomeScreen from './src/screens/home';
import GalleryScreen from './src/screens/gallery';
import SettingScreen from './src/screens/settings';

const Tab = createMaterialTopTabNavigator();

export default function App() {
	const scheme = useColorScheme();
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<NavigationContainer
				theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
				<Tab.Navigator
					screenOptions={() => ({
						tabBarActiveTintColor: 'turquoise',
						tabBarInactiveTintColor: 'gray',
						headerShown: false,
						unmountOnBlur: true,
						lazy: true
					})}>
					<Tab.Screen
						name='Home'
						component={HomeScreen}
					/>
					<Tab.Screen
						name='Gallery'
						component={GalleryScreen}
					/>
					<Tab.Screen
						name='Settings'
						component={SettingScreen}
					/>
				</Tab.Navigator>
			</NavigationContainer>
			<StatusBar style='dark' />
		</SafeAreaView>
	);
}
