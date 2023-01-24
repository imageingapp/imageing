import { aHosts } from './hosts';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { styles } from '../Styles';

export const empty = {
	// ImgBB
	apiKey: '',
	// SXCU
	apiUrl: '',
	apiToken: '',
	apiEndpoint: '',
	apiFormName: '',
	// Imgur
	apiClientId: '867afe9433c0a53'
};

export async function getHost() {
	const stored = await AsyncStorage.getItem('host');
	return aHosts.find((host) => host.name === stored) ?? aHosts[0];
}

export async function setHost(host) {
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

export function buildSettings(options) {
	let component;
	switch (options.host) {
		case aHosts[0]: {
			// ImgBB
			component = <TextInput
							contentStyle={styles.textInput}
							mode='outlined'
							label='API Key'
							value={options.fields.apiKey.inputApiKey}
							onChangeText={(text) =>
								options.fields.apiKey.setInputApiKey(text)
							}
						/>
			break;
		}
		case aHosts[1]: {
			// SXCU
			component = <>
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
			</>
			break;
		}
		default: {
			return <View></View>;
		}
	}
	return <View style={{ marginTop: 20, flex: 1, width: '80%' }}>{component}</View>
}
