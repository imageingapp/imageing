import { useEffect, useState } from 'react';
import { SettingsComponent } from '../../components/SettingsComponent';
import { getDocumentAsync } from "expo-document-picker";
import { readAsStringAsync } from "expo-file-system";
import { empty, getHostSettings, getSettings, setHostSettings } from "../../utils/settings";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from "react-native";
import { aHosts } from "../../utils/hosts";

import Dialog from 'react-native-dialog';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';

export default function SettingScreen() {
	const [host, setHost] = useState({});
	const [hostPage, setHostPage] = useState(false);
	const [multiUpload, setMultiUpload] = useState('Disabled');
	const [zoomAndDrag, setZoomAndDrag] = useState('Disabled');
	const [bDialog, setDialog] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogDescription, setDialogDescription] = useState('');
	const [dialogButton, setDialogButton] = useState('Enable');
	const [inputValue, setInputValue] = useState('');
	const [inputShow, setInputShow] = useState(false);
	const [switchShow, setSwitchShow] = useState(false);

	// ImgBB
	const [inputApiKey, setInputApiKey] = useState('');
	// SXCU
	const [inputApiUrl, setInputApiUrl] = useState('');
	const [inputApiToken, setInputApiToken] = useState('');
	const [inputApiEndpoint, setInputApiEndpoint] = useState('');
	const [inputApiFormName, setInputApiFormName] = useState('');

	const isFocused = useIsFocused();
<<<<<<< HEAD
=======

	const buildOptions = {
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

>>>>>>> main
	useEffect(() => {
		let isMounted = true;
		if (isMounted) setHostPage(false);
		getHostSettings().then((host) => {
			if (isMounted) {
				setHost(host);
			}
<<<<<<< HEAD
=======
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
				// eslint-disable-next-line no-console
				.catch((err) => console.log(err));
>>>>>>> main
		});
		getSettings().then((settings) => {
			if (isMounted) {
				setMultiUpload(settings['Multi-Upload'] ? 'Enabled' : 'Disabled');
				setZoomAndDrag(settings['Image Zoom and Drag'] ? 'Enabled' : 'Disabled');
				setInputApiKey(settings['apiKey']);
				setInputApiUrl(settings['apiUrl']);
				setInputApiToken(settings['apiToken']);
				setInputApiEndpoint(settings['apiEndpoint']);
				setInputApiFormName(settings['apiFormName']);
			}
		})
		return () => {
			isMounted = false;
		};
	}, [isFocused]);

<<<<<<< HEAD

	const saveSetting = async (name, state) => {
		// Get Settings
		const stored = await AsyncStorage.getItem('settings');
		const parsed = stored ? JSON.parse(stored) : empty;
		// Set Setting
		parsed[name] = state;
		// Save Settings
		await AsyncStorage.setItem('settings', JSON.stringify(parsed));
	}

	const onApiUrl = () => {
		// Alert
		setDialog(true);
		setDialogTitle('API URL');
		setDialogDescription('This is a wonderful placeholder about the app Imageing')
		setInputValue(inputApiUrl);
		setDialogButton('Submit');
	}

	const openDialog = (title, description, { show, value }, sShow, button) => {
		// Alert
		setDialog(true);
		setDialogTitle(title);
		setDialogDescription(description)
		setInputShow(show);
		setInputValue(value);
		setSwitchShow(sShow);
		setDialogButton(button);
	}

	const handlePush = async () => {
		if (dialogTitle.includes('Multi-Upload')) {
			await saveSetting('Multi-Upload', !(multiUpload === 'Enabled'));
			setMultiUpload(multiUpload === 'Enabled' ? 'Disabled' : 'Enabled');
		} else if (dialogTitle.includes('Image Zoom and Drag')) {
			await saveSetting('Image Zoom and Drag', !(zoomAndDrag === 'Enabled'));
			setZoomAndDrag(zoomAndDrag === 'Enabled' ? 'Disabled' : 'Enabled');
		} else if (dialogTitle.includes('Clear Image Gallery')) {
			await AsyncStorage.removeItem('images');
			// Should we only delete the history or also delete all uploaded pics?
		} else if (dialogTitle.includes('API URL')) {
			await saveSetting('apiUrl', inputValue);
			setInputApiUrl(inputValue);
		} else if (dialogTitle.includes('API Token')) {
			await saveSetting('apiToken', inputValue);
			setInputApiToken(inputValue);
		} else if (dialogTitle.includes('API Key')) {
			await saveSetting('apiKey', inputValue);
			setInputApiKey(inputValue);
		} else if (dialogTitle.includes('API Endpoint')) {
			await saveSetting('apiEndpoint', inputValue);
			setInputApiEndpoint(inputValue);
		} else if (dialogTitle.includes('API Formname')) {
			await saveSetting('apiFormName', inputValue);
			setInputApiFormName(inputValue);
		}
		setDialog(false);
	};

	const handleSwitch = async (h) => {
		await setHostSettings(h);
		setHost(h);
	}

	const handleImport = async () => {
		const file = await getDocumentAsync();
		if (file.type !== 'cancel') {
			let fileData;
			try {
				fileData = JSON.parse(
						(await readAsStringAsync(file.uri)).trim()
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
			await saveSetting('apiUrl', fileData.RequestURL);
			await saveSetting('apiToken', fileData.Arguments.token);
			await saveSetting('apiEndpoint', fileData.Arguments.endpoint);
			await saveSetting('apiFormName', fileData.FileFormName);
			setInputApiUrl(fileData.RequestURL);
			setInputApiToken(fileData.Arguments.token);
			setInputApiEndpoint(fileData.Arguments.endpoint);
			setInputApiFormName(fileData.FileFormName);
			Toast.show({
				type: 'success',
				text1: 'File imported',
				text2: 'The data was saved.'
			});
		}
	}

	const handleCancel = () => {
		setDialog(false);
	};

	const settingsOptions = [
		{ title: 'Host', subTitle: host?.name, icon: 'chevron-forward-outline', show: true, onPress: () => setHostPage(true) }, // Navigate to new Screen just like this
		{
			title: 'Multi-Upload',
			subTitle: multiUpload,
			icon: 'checkbox-outline',
			show: true,
			onPress: () => {
				openDialog(
					`${multiUpload === 'Enabled' ? 'Disable' : 'Enable'} Multi-Upload`,
					`Do you want to ${multiUpload === 'Enabled' ? 'disable' : 'enable'} the multi-upload feature?`,
					{ show: false, value: '' },
					false,
					multiUpload === 'Enabled' ? 'Disable' : 'Enable'
				)
			}
		}, // Modal which asks for Enabled/Disabled
		{
			title: 'Image Zoom and Drag',
			subTitle: zoomAndDrag,
			icon: 'checkbox-outline',
			show: true,
			onPress: () => {
				openDialog(
					`${zoomAndDrag === 'Enabled' ? 'Disable' : 'Enable'} Image Zoom and Drag`,
					`Do you want to ${zoomAndDrag === 'Enabled' ? 'disable' : 'enable'} the image zoom and drag feature?`,
					{ show: false, value: '' },
					false,
					zoomAndDrag === 'Enabled' ? 'Disable' : 'Enable'
				)
			}
		}, // Modal which asks for Enabled/Disabled
		// { title: 'Import Settings', subTitle: null, onPress: () => {} }, // Lets you import Settings via QR Code or file
		// { title: 'Export Settings', subTitle: null, onPress: () => {} }, // Saves Settings in a QR Code which you can share
		{
			title: 'Clear Gallery',
			subTitle: null,
			icon: 'trash-outline',
			show: true,
			onPress: () => {
				openDialog('Clear Image Gallery', 'Are you sure you want to clear your gallery history?', { show: false, value: '' }, false, 'Clear')
			}
		}, // Clears the Gallery
		// { title: 'Credits', subTitle: null, onPress: onCredits }, // Modal with Credits that show who worked on Imageing
		{
			title: 'About Imageing',
			subTitle: null,
			icon: 'information-circle-outline',
			show: true,
			onPress: () => {
				openDialog('About Imageing', 'This is a wonderful placeholder about the app Imageing', { show: false, value: '' }, false, 'Close')
			}
		} // Modal with information about Imageing like Version, ...
	];

	const hostOptions = [
		{
			title: 'Host',
			subTitle: host?.name,
			show: true,
			onPress: () => {
				openDialog('Host', 'Choose the host to upload to.', { show: false, value: '' }, true, 'Close')
			}
		}, // Select of Hosts
		{
			title: 'API URL',
			subTitle: inputApiUrl,
			show: host?.name === 'SXCU',
			onPress: () => {
				openDialog('API URL', '', { show: true, value: inputApiUrl }, false, 'Submit')
			}
		}, // SXCU: URL
		{
			title: 'API Key',
			subTitle: inputApiKey,
			show: host?.name === 'ImgBB',
			onPress: () => {
				openDialog('API Key', '', { show: true, value: inputApiKey }, false, 'Submit')
			}
		}, // ImgBB: Key
		{
			title: 'API Token',
			subTitle: inputApiToken,
			show: host?.name === 'SXCU',
			onPress: () => {
				openDialog('API Token', '', { show: true, value: inputApiToken }, false, 'Submit')
			}
		}, // SXCU: Token
		{
			title: 'API Endpoint',
			subTitle: inputApiEndpoint,
			show: host?.name === 'SXCU',
			onPress: () => {
				openDialog('API Endpoint', '', { show: true, value: inputApiEndpoint }, false, 'Submit')
			}
		}, // SXCU: Endpoint
		{
			title: 'API Formname',
			subTitle: inputApiFormName,
			show: host?.name === 'SXCU',
			onPress: () => {
				openDialog('API Formname', '', { show: true, value: inputApiFormName }, false, 'Submit')
			}
		}, // SXCU: FormName
		{ title: 'Import', subTitle: null, show: host?.name === 'SXCU', onPress: handleImport }, // Import Settings File
		{ title: 'Back', subTitle: null, show: true, onPress: () => setHostPage(false) }, // Select of Hosts
	];

	return (
		<SafeAreaView>
			<Dialog.Container visible={bDialog} onBackdropPress={handleCancel} >
				<Dialog.Title>{dialogTitle}</Dialog.Title>
				{ dialogDescription !== '' ? <Dialog.Description>{dialogDescription}</Dialog.Description> : null }
				<View style={{ marginLeft: 3 }}>
					{ inputShow && <Dialog.Input value={inputValue} onChangeText={setInputValue} /> }
					{ switchShow && aHosts.map(aHost => {
						return <Dialog.Switch key={aHost?.name} label={aHost?.name} value={host === aHost} onChange={() => handleSwitch(aHost)} />
					})}
				</View>
				<Dialog.Button
					label={dialogButton === 'Close' ? dialogButton : 'Cancel'}
					onPress={handleCancel}
				/>
				{ dialogButton !== 'Close' ? <Dialog.Button label={dialogButton} onPress={handlePush} /> : null }
			</Dialog.Container>
			{ hostPage ? <SettingsComponent settingsOptions={hostOptions} /> : <SettingsComponent settingsOptions={settingsOptions} /> }
=======
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
					onSelect={async (sel) => {
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
					dropdownIconPosition='right'
					dropdownStyle={styles.dropdown}
					rowStyle={styles.dropdownRow}
					rowTextStyle={styles.dropdownRowText}
					renderCustomizedButtonChild={(sel) => (
						<View style={styles.dropdownChild}>
							{sel ? (
								<Image
									source={sel?.image}
									style={styles.dropdownImage}
								/>
							) : (
								<Ionicons
									name='md-earth-sharp'
									color='#444'
									size={32}
								/>
							)}
							<Text style={styles.dropdownButtonText}>
								{sel?.name}
								{sel?.add ? ` ${sel?.add}` : ''}
							</Text>
							<Ionicons
								name='chevron-down-outline'
								color='#FFF'
								size={18}
							/>
						</View>
					)}
					renderCustomizedRowChild={(sel) => (
						<View style={styles.dropdownRowChild}>
							<Image
								source={sel.image}
								style={styles.dropdownRowImage}
							/>
							<Text style={styles.dropdownRowText}>
								{sel.name}
								{sel.add ? ` ${sel.add}` : ''}
							</Text>
						</View>
					)}
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
								} catch (err) {
									/* empty */
								}
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
									apiToken,
									apiEndpoint,
									apiFormName,
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
>>>>>>> main
			<Toast />
		</SafeAreaView>
	);
}
