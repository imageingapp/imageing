import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Destination } from '@util/types';
import { Destinations, emptySettings } from '@util/constants';

export async function getDestinationSettings() {
	const stored = await AsyncStorage.getItem('destination');
	return Destinations[stored] ?? Destinations.Imgur;
}

export async function setDestinationSettings(destination: Destination) {
	await AsyncStorage.setItem('destination', destination.name);
}

export async function setSettings(options) {
	await AsyncStorage.setItem('settings', JSON.stringify(options));
}

export async function getSettings() {
	const stored = await AsyncStorage.getItem('settings');
	const parsed = stored ? JSON.parse(stored) : emptySettings;
	if (!stored) {
		await setSettings(parsed);
	}
	return parsed;
}
