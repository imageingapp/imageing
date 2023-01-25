import { aHosts } from './hosts';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const empty = {
	// ImgBB
	'apiKey': '',
	// SXCU
	'apiUrl': '',
	'apiToken': '',
	'apiEndpoint': '',
	'apiFormName': '',
	// Imgur
	'apiClientId': '867afe9433c0a53',
	// Other
	'Multi-Upload': false,
	'Image Zoom and Drag': false
};

export async function getHostSettings() {
	const stored = await AsyncStorage.getItem('host');
	return aHosts.find((host) => host.name === stored) ?? aHosts[0];
}

export async function setHostSettings(host) {
	await AsyncStorage.setItem('host', host.name);
}

export async function getSettings() {
	const stored = await AsyncStorage.getItem('settings');
	const parsed = stored ? JSON.parse(stored) : empty;
	if (!stored) {
		await setSettings(parsed);
	}
	return parsed;
}

export async function setSettings(options) {
	await AsyncStorage.setItem('settings', JSON.stringify(options));
}