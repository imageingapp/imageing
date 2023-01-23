import { aHosts } from './hosts';

import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getHost() {
	const stored = await AsyncStorage.getItem('host');
	return aHosts.find(host => host.name === stored) ?? aHosts[0];
}

export async function setHost(host) {
	await AsyncStorage.setItem('host', host.name);
}

export async function getSettings() {
	const stored = await AsyncStorage.getItem('settings');
	const parsed = stored
		? JSON.parse(stored)
		: { apiKey: '', apiUrl: '', apiToken: '', apiEndpoint: '', apiFormName: '' };
	if (!stored) {
		await setSettings(parsed);
	}
	return parsed;
}

export async function setSettings(options) {
	await AsyncStorage.setItem('settings', JSON.stringify(options));
}
