import AsyncStorage from '@react-native-async-storage/async-storage';
<<<<<<< HEAD
=======
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import React from 'react';
import aHosts from './hosts';
import styles from '../Styles';
>>>>>>> main

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
		// eslint-disable-next-line no-use-before-define
		await setSettings(parsed);
	}
	return parsed;
}

export async function setSettings(options) {
	await AsyncStorage.setItem('settings', JSON.stringify(options));
<<<<<<< HEAD
}
=======
}

export function buildSettings(options) {
	switch (options.host) {
		case aHosts[0]: {
			// ImgBB
			return (
				<View>
					<TextInput
						contentStyle={styles.textInput}
						mode='outlined'
						label='API Key'
						value={options.fields.apiKey.inputApiKey}
						onChangeText={(text) =>
							options.fields.apiKey.setInputApiKey(text)
						}
					/>
				</View>
			);
		}
		case aHosts[1]: {
			// SXCU
			return (
				<View>
					<TextInput
						contentStyle={styles.textInput}
						mode='outlined'
						label='API Url'
						value={options.fields.apiUrl.inputApiUrl}
						onChangeText={(text) =>
							options.fields.apiUrl.setInputApiUrl(text)
						}
					/>
					<TextInput
						contentStyle={styles.textInput}
						mode='outlined'
						label='API Token'
						value={options.fields.apiToken.inputApiToken}
						onChangeText={(text) =>
							options.fields.apiToken.setInputApiToken(text)
						}
					/>
					<TextInput
						contentStyle={styles.textInput}
						mode='outlined'
						label='API Endpoint'
						value={options.fields.apiEndpoint.inputApiEndpoint}
						onChangeText={(text) =>
							options.fields.apiEndpoint.setInputApiEndpoint(text)
						}
					/>
					<TextInput
						contentStyle={styles.textInput}
						mode='outlined'
						label='API Formname'
						value={options.fields.apiFormName.inputApiFormName}
						onChangeText={(text) =>
							options.fields.apiFormName.setInputApiFormName(text)
						}
					/>
				</View>
			);
		}
		default: {
			return <View />;
		}
	}
}
>>>>>>> main
