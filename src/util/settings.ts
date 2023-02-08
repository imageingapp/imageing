import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	DestinationNames,
	DestinationObject,
	Settings,
	SettingsOptions,
	StorageKeys,
} from '@util/types';
import { Destinations, emptySettings } from '@util/constants';

export async function getDestinationSettings(): Promise<DestinationObject> {
	const stored = await AsyncStorage.getItem(StorageKeys.Destination);
	const storedDestination =
		Destinations.find(d => d.name === stored) ||
		Destinations.find(d => d.name === DestinationNames.Imgur);
	return storedDestination;
}

export async function setDestinationSettings(destination: DestinationNames) {
	await AsyncStorage.setItem(StorageKeys.Destination, destination);
}

export async function setSettings(options: Settings) {
	await AsyncStorage.setItem(StorageKeys.Settings, JSON.stringify(options));
}

export async function getSettings(): Promise<Settings> {
	const stored = await AsyncStorage.getItem(StorageKeys.Settings);
	const parsed = stored ? JSON.parse(stored) : emptySettings;
	if (!stored) {
		await setSettings(parsed);
	}
	return parsed;
}

export async function saveSingleSetting(
	name: SettingsOptions,
	state: string | boolean,
) {
	// Get Settings
	const stored = await AsyncStorage.getItem(StorageKeys.Settings);
	const parsed = stored ? JSON.parse(stored) : emptySettings;
	// Set Setting
	parsed[name] = state;
	// Save Settings
	await AsyncStorage.setItem(StorageKeys.Settings, JSON.stringify(parsed));
}
