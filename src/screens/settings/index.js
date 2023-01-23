import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { getDocumentAsync } from 'expo-document-picker';
import { readAsStringAsync } from 'expo-file-system';
import {
	getHost,
	setHost,
	getSettings,
	setSettings,
	buildSettings
} from '../../utils/settings';
import { aHosts } from '../../utils/hosts';
import { styles } from '../../Styles';
import { useIsFocused } from '@react-navigation/native';

import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';
import Ionicons from '@expo/vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import Toast from 'react-native-toast-message';

const hosts = aHosts;

export default function SettingScreen() {
	const [selHost, setSelHost] = useState({});
	// ImgBB
	const [inputApiKey, setInputApiKey] = useState('');
	// SXCU
	const [inputApiUrl, setInputApiUrl] = useState('');
	const [inputApiToken, setInputApiToken] = useState('');
	const [inputApiEndpoint, setInputApiEndpoint] = useState('');
	const [inputApiFormName, setInputApiFormName] = useState('');

	const isFocused = useIsFocused();

	let buildOptions = {
		host: selHost,
		fields: {
			// ImgBB
			apiKey: { inputApiKey, setInputApiKey },
			// SXCU
			apiUrl: { inputApiUrl, setInputApiUrl },
			apiToken: { inputApiToken, setInputApiToken },
			apiEndpoint: { inputApiEndpoint, setInputApiEndpoint },
			apiFormName: { inputApiFormName, setInputApiFormName }
		}
	};

	useEffect(() => {
		let isMounted = true;
		getHost().then((host) => {
			if (isMounted) {
				setSelHost(host);
			}
			getSettings()
				.then((settings) => {
					if (isMounted) {
						setInputApiKey(settings.apiKey);
						setInputApiUrl(settings.apiUrl);
						setInputApiToken(settings.apiToken);
						setInputApiEndpoint(settings.apiEndpoint);
						setInputApiFormName(settings.apiFormName);
					}
				})
				.catch((err) => console.log(err));
		});
		return () => {
			isMounted = false;
		};
	}, [isFocused]);

	return (
		<SafeAreaView
			style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'space-between',
				alignItems: 'center',
				paddingTop: 20
			}}>
			<View>
				<SelectDropdown
					data={hosts}
					onSelect={async (sel, index) => {
						await setHost(sel);
						setSelHost(sel);
						const settings = await getSettings();
						setInputApiKey(settings.apiKey);
						setInputApiUrl(settings.apiUrl);
						setInputApiToken(settings.apiToken);
						setInputApiEndpoint(settings.apiEndpoint);
						setInputApiFormName(settings.apiFormName);
					}}
					defaultValue={selHost}
					buttonStyle={styles.dropdownButton}
					buttonTextStyle={styles.dropdownButtonText}
					dropdownIconPosition={'right'}
					dropdownStyle={styles.dropdown}
					rowStyle={styles.dropdownRow}
					rowTextStyle={styles.dropdownRowText}
					renderCustomizedButtonChild={(sel, index) => {
						return (
							<View style={styles.dropdownChild}>
								{sel ? (
									<Image
										source={sel?.image}
										style={styles.dropdownImage}
									/>
								) : (
									<Ionicons
										name='md-earth-sharp'
										color={'#444'}
										size={32}
									/>
								)}
								<Text style={styles.dropdownButtonText}>
									{sel?.name}
									{sel?.add ? ' ' + sel?.add : ''}
								</Text>
								<Ionicons
									name='chevron-down-outline'
									color={'#FFF'}
									size={18}
								/>
							</View>
						);
					}}
					renderCustomizedRowChild={(sel, index) => {
						return (
							<View style={styles.dropdownRowChild}>
								<Image
									source={sel.image}
									style={styles.dropdownRowImage}
								/>
								<Text style={styles.dropdownRowText}>
									{sel.name}
									{sel.add ? ' ' + sel.add : ''}
								</Text>
							</View>
						);
					}}
				/>
				{selHost.name ? buildSettings(buildOptions) : null}
			</View>
			<View style={styles.buttonContainerSettings}>
				<AwesomeButton
					style={{ ...styles.button, marginBottom: 20 }}
					size='medium'
					onPress={async () => {
						const settings = {
							// ImgBB
							apiKey: inputApiKey,
							// SXCU
							apiUrl: inputApiUrl,
							apiToken: inputApiToken,
							apiEndpoint: inputApiEndpoint,
							apiFormName: inputApiFormName,
							// Imgur
							apiClientId: '867afe9433c0a53'
						};
						await setSettings(settings);
					}}>
					<Text style={{ fontSize: 20, color: 'white' }}>
						Save Settings
					</Text>
				</AwesomeButton>
				{selHost?.name === 'SXCU' ? (
					<AwesomeButton
						style={{ ...styles.button, marginBottom: 20 }}
						onPress={async () => {
							const file = await getDocumentAsync();
							if (file.type !== 'cancel') {
								let fileData;
								try {
									fileData = JSON.parse(
										(
											await readAsStringAsync(file.uri)
										).trim()
									);
								} catch (err) {}
								if (
									!fileData ||
									!fileData.RequestURL ||
									!fileData.Arguments?.token ||
									!fileData.Arguments?.endpoint ||
									!fileData.FileFormName
								) {
									Toast.show({
										type: 'error',
										text1: 'File import failed',
										text2: 'The file contains invalid data.'
									});
									return;
								}
								const url = fileData.RequestURL;
								const apiToken = fileData.Arguments.token;
								const apiEndpoint = fileData.Arguments.endpoint;
								const apiFormName = fileData.FileFormName;
								const settings = {
									apiKey: inputApiKey,
									apiUrl: url,
									apiToken: apiToken,
									apiEndpoint: apiEndpoint,
									apiFormName: apiFormName,
									apiClientId: '867afe9433c0a53'
								};
								setInputApiUrl(url);
								setInputApiToken(apiToken);
								setInputApiEndpoint(apiEndpoint);
								setInputApiFormName(apiFormName);
								await setSettings(settings);
								Toast.show({
									type: 'success',
									text1: 'File imported',
									text2: 'The data was saved.'
								});
							}
						}}>
						<Ionicons
							style={{ margin: 8, color: 'white' }}
							name='download-outline'
							size={30}
						/>
					</AwesomeButton>
				) : null}
			</View>
			<Toast />
		</SafeAreaView>
	);
}
