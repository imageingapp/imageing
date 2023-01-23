import Ionicons from '@expo/vector-icons/Ionicons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/home';
import GalleryScreen from './src/screens/gallery';
import SettingScreen from './src/screens/settings';

const Tab = createBottomTabNavigator();

export default function App() {
	return (
		<>
			<NavigationContainer>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							let iconName;

							if (route.name === 'Home') {
								iconName = focused
									? 'camera'
									: 'camera-outline';
							} else if (route.name === 'Gallery') {
								iconName = focused
									? 'albums'
									: 'albums-outline';
							} else if (route.name === 'Settings') {
								iconName = focused
									? 'settings'
									: 'settings-outline';
							}

							// You can return any component that you like here!
							return (
								<Ionicons
									name={iconName}
									size={size}
									color={color}
								/>
							);
						},
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
			<StatusBar style='dark' />
		</>
	);
}
