/* eslint-disable react/style-prop-object */
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-native-gesture-handler';

import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme
} from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StatusBar } from 'expo-status-bar';

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/home';
import GalleryScreen from './src/screens/gallery';
import SettingScreen from './src/screens/settings';
import { ThemeContext } from './src/utils/theme';

const Tab = createMaterialTopTabNavigator();

export default function App() {
	const scheme = useColorScheme();
	const [currentTheme, changeTheme] = useState(scheme);
	// get the theme from the storage
	useEffect(() => {
		AsyncStorage.getItem('settings').then((x) => {
			const value = JSON.parse(x);

			if (value.theme) {
				if (value.theme === 'auto') {
					changeTheme(scheme);
				} else changeTheme(value.theme);
			} else {
				changeTheme(scheme);
			}
		});
	}, [scheme]);

	const selectedTheme = currentTheme === 'dark' ? DarkTheme : DefaultTheme;
	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const themeData = { currentTheme, changeTheme };
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ThemeContext.Provider value={themeData}>
				<NavigationContainer theme={selectedTheme}>
					<Tab.Navigator
						screenOptions={() => ({
							tabBarActiveTintColor: 'turquoise',
							tabBarInactiveTintColor: 'gray',
							headerShown: false,
							unmountOnBlur: true
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
			</ThemeContext.Provider>
			<StatusBar style='dark' />
		</SafeAreaView>
	);
}
