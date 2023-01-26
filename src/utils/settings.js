import AsyncStorage from '@react-native-async-storage/async-storage';
import aHosts from './hosts';

export const empty = {
	// ImgBB
	apiKey: '',
	// SXCU
	apiUrl: '',
	apiToken: '',
	apiEndpoint: '',
	apiFormName: '',
	// Other
	'Multi-Upload': false,
	'Image Zoom and Drag': false
};

export async function getHostSettings() {
	const stored = await AsyncStorage.getItem('host');
	return aHosts[stored] ?? aHosts.ImgBB;
}

export async function setHostSettings(host) {
	await AsyncStorage.setItem('host', host.name);
}

export async function getSettings() {
	const stored = await AsyncStorage.getItem('settings');
	const parsed = stored ? JSON.parse(stored) : empty;
	if (!stored) {
		// eslint-disable-next-line no-use-before-define
		await setSettings(parsed);
	}
	return parsed;
}

export async function setSettings(options) {
	await AsyncStorage.setItem('settings', JSON.stringify(options));
}
