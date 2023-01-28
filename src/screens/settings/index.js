/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState, useContext } from 'react';
import { getDocumentAsync } from 'expo-document-picker';
import { readAsStringAsync } from 'expo-file-system';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Appearance } from 'react-native';

import Dialog from 'react-native-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { createStackNavigator } from '@react-navigation/stack';
import ModalSelector from 'react-native-modal-selector';
import {
	empty,
	getHostSettings,
	getSettings,
	setHostSettings
} from '../../utils/settings';
import SettingsComponent from '../../components/SettingsComponent';
import aHosts from '../../utils/hosts';
import { ThemeContext } from '../../utils/theme';

export default function SettingScreen({ navigation }) {
	const { colors } = useTheme();
	const Stack = createStackNavigator();
	const { changeTheme } = useContext(ThemeContext);
	const [host, setHost] = useState({});
	const [theme, setTheme] = useState('');
	const [multiUpload, setMultiUpload] = useState('Disabled');
	const [zoomAndDrag, setZoomAndDrag] = useState('Disabled');
	const [bDialog, setDialog] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogDescription, setDialogDescription] = useState('');
	const [dialogButton, setDialogButton] = useState('Enable');
	const [inputValue, setInputValue] = useState('');
	const [inputShow, setInputShow] = useState(false);
	const [selectShow, setSelectShow] = useState(false);

	// ImgBB
	const [inputApiKey, setInputApiKey] = useState('');
	// SXCU
	const [inputApiUrl, setInputApiUrl] = useState('');
	const [inputApiToken, setInputApiToken] = useState('');
	const [inputApiEndpoint, setInputApiEndpoint] = useState('');
	const [inputApiFormName, setInputApiFormName] = useState('');

	const isFocused = useIsFocused();
	useEffect(() => {
		let isMounted = true;
		if (isMounted)
			getHostSettings().then((h) => {
				if (isMounted) {
					setHost(h);
				}
			});
		getSettings().then((settings) => {
			if (isMounted) {
				setMultiUpload(
					settings['Multi-Upload'] ? 'Enabled' : 'Disabled'
				);
				setZoomAndDrag(
					settings['Image Zoom and Drag'] ? 'Enabled' : 'Disabled'
				);
				setInputApiKey(settings.apiKey);
				setInputApiUrl(settings.apiUrl);
				setInputApiToken(settings.apiToken);
				setInputApiEndpoint(settings.apiEndpoint);
				setInputApiFormName(settings.apiFormName);
				// if no theme is set, set it to default
				if (!settings.theme) {
					setTheme('Auto');
				} else {
					switch (settings.theme) {
						case 'light':
							setTheme('Light');
							break;
						case 'dark':
							setTheme('Dark');
							break;
						case 'material':
							setTheme('Material You');
							break;
						default:
							setTheme('Auto');
							break;
					}
				}
			}
		});
		return () => {
			isMounted = false;
		};
	}, [isFocused]);

	const saveSetting = async (name, state) => {
		// Get Settings
		const stored = await AsyncStorage.getItem('settings');
		const parsed = stored ? JSON.parse(stored) : empty;
		// Set Setting
		parsed[name] = state;
		// Save Settings
		await AsyncStorage.setItem('settings', JSON.stringify(parsed));
	};

	const openDialog = (
		title,
		description,
		{ show, value },
		_sShow,
		button
	) => {
		// Alert
		setDialog(true);
		setDialogTitle(title);
		setDialogDescription(description);
		setInputShow(show);
		setInputValue(value);
		setDialogButton(button);
	};

	const handlePush = async () => {
		if (dialogTitle.includes('Multi-Upload')) {
			await saveSetting('Multi-Upload', !(multiUpload === 'Enabled'));
			setMultiUpload(multiUpload === 'Enabled' ? 'Disabled' : 'Enabled');
		} else if (dialogTitle.includes('Image Zoom and Drag')) {
			await saveSetting(
				'Image Zoom and Drag',
				!(zoomAndDrag === 'Enabled')
			);
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
	};

	const handleImport = async () => {
		const file = await getDocumentAsync();
		if (file.type !== 'cancel') {
			let fileData;
			try {
				fileData = JSON.parse(
					(await readAsStringAsync(file.uri)).trim()
				);
			} catch (err) {
				Toast.show('The file contains invalid data.', Toast.SHORT);
			}
			if (
				!fileData ||
				!fileData.RequestURL ||
				!fileData.Arguments?.token ||
				!fileData.Arguments?.endpoint ||
				!fileData.FileFormName
			) {
				Toast.show('The file contains invalid data.', Toast.SHORT);
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
			Toast.show('The data was saved.', Toast.SHORT);
		}
	};

	const handleCancel = () => {
		setDialog(false);
	};

	const settingsOptions = [
		{
			title: 'Theme',
			subTitle: theme,
			icon: 'color-palette-outline',
			show: true,
			onPress: () => navigation.navigate('Theme')
		},
		{
			title: 'Host',
			subTitle: host?.name,
			icon: 'cloud-upload-outline',
			show: true,
			onPress: () => navigation.navigate('Host')
		}, // Navigate to new Screen just like this
		{
			title: 'Multi-Upload',
			subTitle: multiUpload,
			icon: 'images-outline',
			show: true,
			onPress: () => {
				openDialog(
					`${
						multiUpload === 'Enabled' ? 'Disable' : 'Enable'
					} Multi-Upload`,
					`Do you want to ${
						multiUpload === 'Enabled' ? 'disable' : 'enable'
					} the multi-upload feature?`,
					{ show: false, value: '' },
					false,
					multiUpload === 'Enabled' ? 'Disable' : 'Enable'
				);
			}
		}, // Modal which asks for Enabled/Disabled
		{
			title: 'Image Zoom and Drag',
			subTitle: zoomAndDrag,
			icon: 'move-outline',
			show: true,
			onPress: () => {
				openDialog(
					`${
						zoomAndDrag === 'Enabled' ? 'Disable' : 'Enable'
					} Image Zoom and Drag`,
					`Do you want to ${
						zoomAndDrag === 'Enabled' ? 'disable' : 'enable'
					} the image zoom and drag feature?`,
					{ show: false, value: '' },
					false,
					zoomAndDrag === 'Enabled' ? 'Disable' : 'Enable'
				);
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
				openDialog(
					'Clear Image Gallery',
					'Are you sure you want to clear your gallery history?',
					{ show: false, value: '' },
					false,
					'Clear'
				);
			}
		}, // Clears the Gallery
		// { title: 'Credits', subTitle: null, onPress: onCredits }, // Modal with Credits that show who worked on Imageing
		{
			title: 'About Imageing',
			subTitle: null,
			icon: 'information-circle-outline',
			show: true,
			onPress: () => {
				openDialog(
					'About Imageing',
					'This is a wonderful placeholder about the app Imageing',
					{ show: false, value: '' },
					false,
					'Close'
				);
			}
		} // Modal with information about Imageing like Version, ...
	];

	const hostOptions = [
		{
			title: 'Upload Destination',
			subTitle: host?.name,
			icon: 'cloud-upload-outline',
			show: true,
			onPress: () => {
				setSelectShow(true);
			}
		}, // Select of Hosts
		{
			title: 'API URL',
			subTitle: inputApiUrl,
			icon: 'code-slash-outline',
			show: host?.name === 'SXCU',
			onPress: () => {
				openDialog(
					'API URL',
					'',
					{ show: true, value: inputApiUrl },
					false,
					'Submit'
				);
			}
		}, // SXCU: URL
		{
			title: 'API Key',
			subTitle: inputApiKey,
			icon: 'key-outline',
			show: host?.name === 'ImgBB',
			onPress: () => {
				openDialog(
					'API Key',
					'',
					{ show: true, value: inputApiKey },
					false,
					'Submit'
				);
			}
		}, // ImgBB: Key
		{
			title: 'API Token',
			subTitle: inputApiToken,
			icon: 'key-outline',
			show: host?.name === 'SXCU',
			onPress: () => {
				openDialog(
					'API Token',
					'',
					{ show: true, value: inputApiToken },
					false,
					'Submit'
				);
			}
		}, // SXCU: Token
		{
			title: 'API Endpoint',
			subTitle: inputApiEndpoint,
			icon: 'code-slash-outline',
			show: host?.name === 'SXCU',
			onPress: () => {
				openDialog(
					'API Endpoint',
					'',
					{ show: true, value: inputApiEndpoint },
					false,
					'Submit'
				);
			}
		}, // SXCU: Endpoint
		{
			title: 'API Formname',
			subTitle: inputApiFormName,
			icon: 'code-slash-outline',
			show: host?.name === 'SXCU',
			onPress: () => {
				openDialog(
					'API Formname',
					'',
					{ show: true, value: inputApiFormName },
					false,
					'Submit'
				);
			}
		}, // SXCU: FormName
		{
			title: 'Import',
			subTitle: 'Import SXCU File',
			icon: 'download-outline',
			show: host?.name === 'SXCU',
			onPress: handleImport
		}, // Import Settings File
		{
			title: 'Scan QR Code',
			subTitle: 'Scan QR Code to import config',
			icon: 'qr-code-outline',
			show: host?.name === 'SXCU' || host?.name === 'ImgBB',
			onPress: null
		},
		{
			title: 'Share Config',
			subTitle: 'Share current config as QR Code',
			icon: 'share-outline',
			show: host?.name === 'SXCU' || host?.name === 'ImgBB',
			onPress: null
		}
	];

	const themeOptions = [
		{
			title: 'Auto',
			subTitle: 'Follows your system theme',
			icon: 'settings-outline',
			show: true,
			onPress: async () => {
				await saveSetting('theme', 'auto');
				setTheme('Auto');
				const systemTheme = Appearance.getColorScheme();
				changeTheme(systemTheme);
				Toast.show('Theme set to Auto', Toast.SHORT);
				navigation.navigate('App Settings');
			}
		}, // Auto
		{
			title: 'Light',
			subTitle: 'Light theme',
			icon: 'sunny-outline',
			show: true,
			onPress: async () => {
				await saveSetting('theme', 'light');
				setTheme('Light');
				changeTheme('light');
				Toast.show('Theme set to Light', Toast.SHORT);
				navigation.navigate('App Settings');
			}
		}, // Light
		{
			title: 'Dark',
			subTitle: 'Dark theme',
			icon: 'moon-outline',
			show: true,
			onPress: async () => {
				await saveSetting('theme', 'dark');
				setTheme('Dark');
				changeTheme('dark');
				Toast.show('Theme set to Dark', Toast.SHORT);
				navigation.navigate('App Settings');
			}
		} // Dark
		/* {
			title: 'Material You',
			subTitle: 'Dynamic theme',
			icon: 'color-palette-outline',
			show: true,
			onPress: async () => {
				await saveSetting('theme', 'material');
				setTheme('Material You');
				changeTheme('material');
				Toast.show('Theme set to Material You', Toast.SHORT);
				navigation.navigate('App Settings');
			}
		} */ // Material You module not working properly atm
	];

	const selectData = Object.keys(aHosts).map((x) => {
		const y = aHosts[x];
		return { key: y.name, label: y.name };
	});

	const MainSettingsAreaView = (
		<SafeAreaView>
			<ModalSelector
				initValue={null}
				visible={selectShow}
				customSelector={<View />}
				data={selectData}
				optionContainerStyle={{
					backgroundColor: colors.card,
					borderColor: colors.text,
					borderWidth: 2,
					borderRadius: 5
				}}
				optionTextStyle={{ color: colors.text }}
				onModalClose={() => setSelectShow(false)}
				onChange={(option) => {
					handleSwitch(aHosts[option.key]);
				}}
			/>
			<Dialog.Container
				visible={bDialog}
				onBackdropPress={handleCancel}>
				<Dialog.Title>{dialogTitle}</Dialog.Title>
				{dialogDescription !== '' ? (
					<Dialog.Description>{dialogDescription}</Dialog.Description>
				) : null}
				<View style={{ marginLeft: 3 }}>
					{inputShow && (
						<Dialog.Input
							value={inputValue}
							onChangeText={setInputValue}
						/>
					)}
				</View>
				<Dialog.Button
					label={dialogButton === 'Close' ? dialogButton : 'Cancel'}
					onPress={handleCancel}
				/>
				{dialogButton !== 'Close' ? (
					<Dialog.Button
						label={dialogButton}
						onPress={handlePush}
					/>
				) : null}
			</Dialog.Container>
			<SettingsComponent settingsOptions={settingsOptions} />
		</SafeAreaView>
	);

	return (
		<Stack.Navigator initialRouteName='App Settings'>
			<Stack.Screen
				name='App Settings'
				children={() => MainSettingsAreaView}
			/>
			<Stack.Screen
				name='Theme'
				children={() => (
					<SettingsComponent settingsOptions={themeOptions} />
				)}
			/>
			<Stack.Screen
				name='Host'
				children={() => (
					<SettingsComponent settingsOptions={hostOptions} />
				)}
			/>
		</Stack.Navigator>
	);
}
