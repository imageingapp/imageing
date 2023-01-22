import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image } from 'react-native';
import { useEffect, useState } from "react";
import { TextInput } from 'react-native-paper'
import { getHost, setHost, getHostOptions, setHostOptions } from "../utils/storage";
import { styles } from "../Styles";

import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';
import Ionicons from '@expo/vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';

const hosts = [{ text: 'ImgBB', image: require('../assets/ImgBB.png')}, { text: 'SXCU', add: '(Selfhost)', image: require('../assets/SXCU.png')}]

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
			if (isMounted) setSelHost(hosts.find(h => h.text === host));
			getHostOptions(host).then(options => {
				if (isMounted) {
					setInputApiKey(options.apiKey)
					setInputApiUrl(options.apiUrl)
					setInputApiToken(options.apiToken)
					setInputApiEndpoint(options.apiEndpoint)
					setInputApiFieldname(options.apiFieldname)
				}
			}).catch(err => console.log(err))
		});
		return () => {
			isMounted = false;
		};
	}, []);

	return (
			<SafeAreaView style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20 }}>
				<View>
					<SelectDropdown
						data={hosts}
						onSelect={async (sel, index) => {
							await setHost(sel.text);
							setSelHost(sel);
							const hostOptions = await getHostOptions(sel.text);
							setInputApiKey(hostOptions.apiKey)
							setInputApiUrl(hostOptions.apiUrl)
							setInputApiToken(hostOptions.apiToken)
							setInputApiEndpoint(hostOptions.apiEndpoint)
							setInputApiFieldname(hostOptions.apiFieldname)
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
											<Image source={sel.image} style={styles.dropdownImage} />
											) : (
													<Ionicons name="md-earth-sharp" color={'#444'} size={32} />
													)}
									<Text style={styles.dropdownButtonText}>{sel.text}{sel.add ? ' ' + sel.add : ''}</Text>
									<Ionicons name="chevron-down-outline" color={'#FFF'} size={18} />
								</View>
							);
						}}
						renderCustomizedRowChild={(sel, index) => {
							return (
								<View style={styles.dropdownRowChild}>
									<Image source={sel.image} style={styles.dropdownRowImage} />
									<Text style={styles.dropdownRowText}>{sel.text}{sel.add ? ' ' + sel.add : ''}</Text>
								</View>
							);
						}}
					/>
					{
						selHost.text === 'ImgBB'
						? 	<View>
								<TextInput  contentStyle={styles.textInput} mode='outlined' label="API Key" value={inputApiKey} onChangeText={text => setInputApiKey(text)}/>
							</View>
						: 	<View>
								<TextInput contentStyle={styles.textInput} mode='outlined' label="API Url" value={inputApiUrl} onChangeText={text => setInputApiUrl(text)}/>
								<TextInput contentStyle={styles.textInput} mode='outlined' label="API Token" value={inputApiToken} onChangeText={text => setInputApiToken(text)}/>
								<TextInput contentStyle={styles.textInput} mode='outlined' label="API Endpoint" value={inputApiEndpoint} onChangeText={text => setInputApiEndpoint(text)}/>
								<TextInput contentStyle={styles.textInput} mode='outlined' label="API Fieldname" value={inputApiFieldname} onChangeText={text => setInputApiFieldname(text)}/>
							</View>
					}
				</View>
				<View style={styles.buttonContainerSettings}>
					<AwesomeButton
						style={{...styles.button, marginBottom: 20}}
						size='medium'
						onPress={async () => {
							const hostOptions = selHost.text === 'ImgBB'
								? { apiKey: inputApiKey }
								: { apiUrl: inputApiUrl, apiToken: inputApiToken, apiEndpoint: inputApiEndpoint, apiFieldname: inputApiFieldname };
							await setHostOptions(selHost.text, hostOptions);
						}}
					>
						<Text style={{ fontSize: 20, color: 'white' }}>Save Settings</Text>
					</AwesomeButton>
					{
						selHost.text === 'SXCU'
						?	<AwesomeButton
								style={{...styles.button, marginBottom: 20}}
								onPress={async () => {
								}}
							>
								<Ionicons
									style={{ margin: 8, color: 'white' }}
									name='download-outline'
									size={30}
								/>
							</AwesomeButton>
						: null
					}
				</View>
			</SafeAreaView>
	);
}
