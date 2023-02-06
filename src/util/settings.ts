import AsyncStorage from '@react-native-async-storage/async-storage';
import { DestinationNames, DestinationObject } from '@util/types';
import { Destinations, emptySettings } from '@util/constants';

export async function getDestinationSettings(): Promise<DestinationObject> {
	const stored = await AsyncStorage.getItem('destination');
	const storedDestination =
		Destinations.find(d => d.name === stored) ||
		Destinations.find(d => d.name === DestinationNames.Imgur);
	return storedDestination;
}

export async function setDestinationSettings(destination: string) {
	await AsyncStorage.setItem('destination', destination);
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
