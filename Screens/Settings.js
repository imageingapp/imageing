import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import {
	getHost,
	setHost,
	getSettings,
	setSettings
} from '../utils/storage';
import { aHosts } from "../utils/hosts";
import { styles } from '../Styles';

import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';
import Ionicons from '@expo/vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';

const hosts = aHosts;

export default function SettingScreen() {
	const [selHost, setSelHost] = useState({});
	const [inputApiKey, setInputApiKey] = useState('');
	const [inputApiUrl, setInputApiUrl] = useState('');
	const [inputApiToken, setInputApiToken] = useState('');
	const [inputApiEndpoint, setInputApiEndpoint] = useState('');
	const [inputApiFieldname, setInputApiFieldname] = useState('');

	useEffect(() => {
		let isMounted = true;
		getHost().then((host) => {
			if (isMounted) setSelHost(host);
			getSettings()
				.then((settings) => {
					if (isMounted) {
						setInputApiKey(settings.apiKey);
						setInputApiUrl(settings.apiUrl);
						setInputApiToken(settings.apiToken);
						setInputApiEndpoint(settings.apiEndpoint);
						setInputApiFieldname(settings.apiFieldname);
					}
				})
				.catch((err) => console.log(err));
		});
		return () => {
			isMounted = false;
		};
	}, []);

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
						setInputApiFieldname(settings.apiFieldname);
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
				{selHost?.name === 'ImgBB' ? (
					<View>
						<TextInput
							contentStyle={styles.textInput}
							mode='outlined'
							label='API Key'
							value={inputApiKey}
							onChangeText={(text) => setInputApiKey(text)}
						/>
					</View>
				) : (
					<View>
						<TextInput
							contentStyle={styles.textInput}
							mode='outlined'
							label='API Url'
							value={inputApiUrl}
							onChangeText={(text) => setInputApiUrl(text)}
						/>
						<TextInput
							contentStyle={styles.textInput}
							mode='outlined'
							label='API Token'
							value={inputApiToken}
							onChangeText={(text) => setInputApiToken(text)}
						/>
						<TextInput
							contentStyle={styles.textInput}
							mode='outlined'
							label='API Endpoint'
							value={inputApiEndpoint}
							onChangeText={(text) => setInputApiEndpoint(text)}
						/>
						<TextInput
							contentStyle={styles.textInput}
							mode='outlined'
							label='API Fieldname'
							value={inputApiFieldname}
							onChangeText={(text) => setInputApiFieldname(text)}
						/>
					</View>
				)}
			</View>
			<View style={styles.buttonContainerSettings}>
				<AwesomeButton
					style={{ ...styles.button, marginBottom: 20 }}
					size='medium'
					onPress={async () => {
						const settings = {
							apiKey: inputApiKey,
							apiUrl: inputApiUrl,
							apiToken: inputApiToken,
							apiEndpoint: inputApiEndpoint,
							apiFieldname: inputApiFieldname
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
						onPress={async () => {}}>
						<Ionicons
							style={{ margin: 8, color: 'white' }}
							name='download-outline'
							size={30}
						/>
					</AwesomeButton>
				) : null}
			</View>
		</SafeAreaView>
	);
}
