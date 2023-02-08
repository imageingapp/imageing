/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState, useContext } from 'react';
import { getDocumentAsync } from 'expo-document-picker';
import { readAsStringAsync } from 'expo-file-system';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	View,
	Appearance,
	Modal,
	StyleSheet,
	Text,
	Dimensions,
	TouchableOpacity,
} from 'react-native';

import Dialog from 'react-native-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { createStackNavigator } from '@react-navigation/stack';
import ModalSelector, { IOption } from 'react-native-modal-selector';
import QRCode from 'react-native-qrcode-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Share from 'react-native-share';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {
	getDestinationSettings,
	getSettings,
	saveSingleSetting,
	setDestinationSettings,
} from '@util/settings';
import SettingsComponent from '@components/SettingsComponent';
import { aboutContent, Destinations, ThemeContext } from '@util/constants';
import AppIcon from '@assets/icon.png';
import {
	DestinationNames,
	DestinationObject,
	DialogOptions,
	SettingsOptions,
	StorageKeys,
} from '@util/types';
import {
	deleteSavedCustomUploader,
	listCustomUploaders,
	loadCustomUploader,
	saveCustomUploader,
	validateCustomUploader,
} from '@util/uploader';

export default function SettingScreen({ navigation }) {
	const { colors } = useTheme();
	const Stack = createStackNavigator();
	const { changeTheme } = useContext(ThemeContext);
	const [destination, setDestination] = useState({} as DestinationObject);
	const [theme, setTheme] = useState('');
	const [multiUpload, setMultiUpload] = useState(false);
	const [zoomAndDrag, setZoomAndDrag] = useState(false);
	const [bDialog, setDialog] = useState(false);
	const [deleteTargetPath, setDeleteTargetPath] = useState('');
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogDescription, setDialogDescription] = useState('');
	const [dialogContext, setDialogContext] = useState('');
	const [leftDialogButton, setLeftDialogButton] = useState('');
	const [rightDialogButton, setRightDialogButton] = useState('');
	const [inputValue, setInputValue] = useState('');
	const [inputShow, setInputShow] = useState(false);
	const [selectShow, setSelectShow] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [qrValue, setQrValue] = useState('');
	const [base64Code, setBase64Code] = useState('');
	const [showScanner, setShowScanner] = useState(false);
	const [hasPermission, setHasPermission] = useState(null);
	const [currentUploaderPath, setCurrentUploaderPath] = useState('');
	const [showSavedFiles, setShowSavedFiles] = useState(false);
	const [savedFileData, setSavedFileData] = useState([] as IOption[]);

	// ImgBB
	const [inputApiKey, setInputApiKey] = useState('');

	const isFocused = useIsFocused();
	useEffect(() => {
		let isMounted = true;
		if (isMounted)
			getDestinationSettings().then(h => {
				if (isMounted) {
					setDestination(h);
				}
			});
		getSettings().then(settings => {
			if (isMounted) {
				setMultiUpload(settings.multiUpload);
				setZoomAndDrag(settings.imageZoomAndDrag);
				setCurrentUploaderPath(settings.currentUploaderPath);
				setInputApiKey(settings.ImgBBApiKey);
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

	function showDialog(options: DialogOptions) {
		setDialogTitle(options.title);
		setDialogDescription(options.content);
		if (options.showTextInput) {
			setInputShow(options.showTextInput);
		}
		if (options.textInputPlaceholder) {
			setInputValue(options.textInputPlaceholder);
		}
		if (!options.rightButtonText && !options.leftButtonText) {
			setRightDialogButton('OK');
		}
		if (options.rightButtonText) {
			setRightDialogButton(options.rightButtonText);
		}
		if (options.leftButtonText) {
			setLeftDialogButton(options.leftButtonText);
		}
		setDialogContext(options.context);
		setDialog(true);
	}

	const handlePush = async () => {
		switch (dialogContext) {
			case SettingsOptions.MultiUpload:
				await saveSingleSetting(
					SettingsOptions.MultiUpload,
					!multiUpload,
				);
				setMultiUpload(!multiUpload);
				break;
			case SettingsOptions.ImageZoomAndDrag:
				await saveSingleSetting(
					SettingsOptions.ImageZoomAndDrag,
					!zoomAndDrag,
				);
				setZoomAndDrag(!zoomAndDrag);
				break;
			case SettingsOptions.ClearImageGallery:
				await AsyncStorage.removeItem(StorageKeys.Files);
				break;
			case SettingsOptions.ImgBBApiKey:
				await saveSingleSetting(
					SettingsOptions.ImgBBApiKey,
					inputValue,
				);
				setInputApiKey(inputValue);
				break;
			case 'deleteUploader':
				await deleteSavedCustomUploader(deleteTargetPath);
				setDeleteTargetPath('');
				Toast.show('Custom uploader deleted.', Toast.SHORT);
				break;
			default:
				break;
		}
		setDialog(false);
	};

	const handleSwitch = async (h: DestinationNames) => {
		await setDestinationSettings(h);
		const newDestination = await getDestinationSettings();
		setDestination(newDestination);
	};

	const handleImport = async () => {
		const file = await getDocumentAsync();
		if (file.type !== 'cancel') {
			let fileData;
			try {
				fileData = JSON.parse(
					(await readAsStringAsync(file.uri)).trim(),
				);
			} catch (err) {
				Toast.show('The file contains invalid data.', Toast.SHORT);
			}
			if (!validateCustomUploader(fileData, true)) {
				Toast.show('The file contains invalid data.', Toast.SHORT);
				return;
			}
			const configPath = await saveCustomUploader(fileData);
			await saveSingleSetting(
				SettingsOptions.CurrentUploaderPath,
				configPath,
			);
			setCurrentUploaderPath(configPath);
			Toast.show('The data was saved.', Toast.SHORT);
		}
	};

	const handleCancel = () => {
		setDialog(false);
	};

	async function shareConfig() {
		switch (destination?.name) {
			case DestinationNames.ImgBB:
				// if no api key is set show toast and return
				if (inputApiKey === '') {
					Toast.show('No Settings saved', Toast.SHORT);
				} else {
					setQrValue(inputApiKey);
					setModalVisible(true);
				}
				break;
			case DestinationNames.Custom: {
				// if no settings set show toast and return
				const data = await loadCustomUploader(currentUploaderPath);
				if (!data) {
					Toast.show('No Settings saved', Toast.SHORT);
				} else if (data && !validateCustomUploader(data)) {
					Toast.show('No Settings saved', Toast.SHORT);
				} else if (data && validateCustomUploader(data)) {
					setQrValue(JSON.stringify(data));
					setModalVisible(true);
				}
				break;
			}
			default:
				break;
		}
	}

	async function importQRCode(data: string) {
		switch (destination?.name) {
			case DestinationNames.ImgBB:
				setInputApiKey(data);
				await saveSingleSetting(SettingsOptions.ImgBBApiKey, data);
				Toast.show('The data was saved.', Toast.SHORT);
				break;
			case DestinationNames.Custom:
				try {
					const config = JSON.parse(data);
					if (!validateCustomUploader(config, true)) {
						Toast.show(
							'The code contains invalid data.',
							Toast.SHORT,
						);
						return;
					}
					const configPath = await saveCustomUploader(config);
					await saveSingleSetting(
						SettingsOptions.CurrentUploaderPath,
						configPath,
					);
					setCurrentUploaderPath(configPath);
					Toast.show('The data was saved.', Toast.SHORT);
				} catch (err) {
					Toast.show('The code contains invalid data.', Toast.SHORT);
				}
				break;
			default:
				break;
		}
	}

	const settingsOptions = [
		{
			title: 'Theme',
			subTitle: theme,
			icon: 'color-palette-outline',
			show: true,
			onPress: () => navigation.navigate('Theme'),
		},
		{
			title: 'Destination',
			subTitle: (() => {
				switch (destination?.name) {
					case DestinationNames.Custom:
						return DestinationNames.Custom;
					default:
						return destination?.name;
				}
			})(),
			icon: 'cloud-upload-outline',
			show: true,
			onPress: () => navigation.navigate('Destination'),
		},
		{
			title: 'Multi-Upload',
			subTitle: multiUpload ? 'Enabled' : 'Disabled',
			icon: 'images-outline',
			show: true,
			onPress: () => {
				showDialog({
					title: 'Toggle Multi-Upload',
					content: 'Do you want to toggle multi-upload?',
					rightButtonText: 'Cancel',
					leftButtonText: multiUpload ? 'Disable' : 'Enable',
					context: SettingsOptions.MultiUpload,
				});
			},
		}, // Modal which asks for Enabled/Disabled
		{
			title: 'Image Zoom and Drag',
			subTitle: zoomAndDrag ? 'Enabled' : 'Disabled',
			icon: 'move-outline',
			show: true,
			onPress: () => {
				showDialog({
					title: 'Toggle Image Zoom and Drag',
					content: 'Do you want to toggle image zoom and drag?',
					rightButtonText: 'Cancel',
					leftButtonText: zoomAndDrag ? 'Disable' : 'Enable',
					context: SettingsOptions.ImageZoomAndDrag,
				});
			},
		},
		{
			title: 'Clear Gallery',
			subTitle: null,
			icon: 'trash-outline',
			show: true,
			onPress: () => {
				showDialog({
					title: 'Clear Image Gallery',
					content:
						'Are you sure you want to clear your gallery history?',
					rightButtonText: 'Cancel',
					leftButtonText: 'Clear',
					context: SettingsOptions.ClearImageGallery,
				});
			},
		},
		{
			title: 'About Imageing',
			subTitle: null,
			icon: 'information-circle-outline',
			show: true,
			onPress: () => {
				showDialog({
					title: 'Client information',
					content: aboutContent,
					context: 'showAbout',
				});
			},
		}, // Modal with information about Imageing like Version, ...
	];

	const startScan = () => {
		// Request camera permission
		if (!hasPermission) {
			(async () => {
				const { status } =
					await BarCodeScanner.requestPermissionsAsync();
				setHasPermission(status === 'granted');
			})();
		}
		setShowScanner(true);
	};

	const handleBarCodeScanned = async ({ data }) => {
		setShowScanner(false);
		await importQRCode(data);
	};

	const destinationOptions = [
		{
			title: 'Upload Destination',
			subTitle: (() => {
				switch (destination?.name) {
					case DestinationNames.Custom:
						return (
							currentUploaderPath
								// eslint-disable-next-line no-useless-escape
								?.replace(/^.*[\\\/]/, '')
								.replace('.json', '') || 'Custom'
						);
					default:
						return destination?.name;
				}
			})(),
			icon: 'cloud-upload-outline',
			show: true,
			onPress: () => {
				setSelectShow(true);
			},
			onLongPress: async () => {
				const files = await listCustomUploaders();
				if (files.length > 1) {
					// remove the current uploader from the list
					const cleanedFiles = files.filter(
						x => x.key !== currentUploaderPath,
					);
					setSavedFileData(cleanedFiles);
					setShowSavedFiles(true);
				} else if (files.length === 0) {
					Toast.show('No custom uploaders saved', Toast.SHORT);
				} else if (files.length === 1) {
					Toast.show('Only one custom uploader saved', Toast.SHORT);
				}
			},
		}, // Select of Hosts
		{
			title: 'API Key',
			icon: 'key-outline',
			show: destination?.name === DestinationNames.ImgBB,
			onPress: () => {
				showDialog({
					title: 'ImgBB API Key',
					content: 'Enter your ImgBB API Key',
					rightButtonText: 'Cancel',
					leftButtonText: 'Submit',
					context: SettingsOptions.ImgBBApiKey,
					showTextInput: true,
					textInputPlaceholder: inputApiKey,
				});
			},
		},
		{
			title: 'Import',
			subTitle: 'Import custom uploader',
			icon: 'download-outline',
			show: destination?.name === DestinationNames.Custom,
			onPress: handleImport,
		}, // Import Settings File
		{
			title: 'Scan QR Code',
			subTitle: 'Scan QR Code to import config',
			icon: 'qr-code-outline',
			show:
				destination?.name === DestinationNames.Custom ||
				destination?.name === DestinationNames.ImgBB,
			onPress: startScan,
		},
		{
			title: 'Share Config',
			subTitle: 'Share current config as QR Code',
			icon: 'share-social-outline',
			show:
				destination?.name === DestinationNames.Custom ||
				destination?.name === DestinationNames.ImgBB,
			onPress: shareConfig,
		},
	];

	const themeOptions = [
		{
			title: 'Auto',
			subTitle: 'Follows your system theme',
			icon: 'settings-outline',
			show: true,
			onPress: async () => {
				await saveSingleSetting(SettingsOptions.Theme, 'auto');
				setTheme('Auto');
				const systemTheme = Appearance.getColorScheme();
				changeTheme(systemTheme);
				Toast.show('Theme set to Auto', Toast.SHORT);
				navigation.navigate('App Settings');
			},
		}, // Auto
		{
			title: 'Light',
			subTitle: 'Light theme',
			icon: 'sunny-outline',
			show: true,
			onPress: async () => {
				await saveSingleSetting(SettingsOptions.Theme, 'light');
				setTheme('Light');
				changeTheme('light');
				Toast.show('Theme set to Light', Toast.SHORT);
				navigation.navigate('App Settings');
			},
		}, // Light
		{
			title: 'Dark',
			subTitle: 'Dark theme',
			icon: 'moon-outline',
			show: true,
			onPress: async () => {
				await saveSingleSetting(SettingsOptions.Theme, 'dark');
				setTheme('Dark');
				changeTheme('dark');
				Toast.show('Theme set to Dark', Toast.SHORT);
				navigation.navigate('App Settings');
			},
		}, // Dark
	];

	const selectData = Object.keys(Destinations).map(x => {
		const y = Destinations[x];
		return { key: y.name, label: y.name };
	});

	const styles = StyleSheet.create({
		centeredView: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: 22,
		},
		modalView: {
			// occupy 90% of screen width and height
			width: Dimensions.get('window').width * 0.9,
			height: Dimensions.get('window').height * 0.9,
			margin: 20,
			backgroundColor: colors.border,
			borderRadius: 20,
			padding: 35,
			alignItems: 'center',
			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 4,
			elevation: 5,
		},
		button: {
			// make slim oval buttons
			borderRadius: 20,
			padding: 10,
			elevation: 2,
		},
		buttonOpen: {
			backgroundColor: '#F194FF',
		},
		buttonClose: {
			backgroundColor: '#2196F3',
		},
		textStyle: {
			color: colors.text,
			fontWeight: 'bold',
			textAlign: 'center',
		},
		modalText: {
			color: colors.text,
			marginBottom: 15,
			textAlign: 'center',
		},
	});

	const MainSettingsAreaView = (
		<SafeAreaView>
			<Modal
				animationType='slide'
				transparent
				visible={showScanner}
				onRequestClose={() => {
					setShowScanner(!showScanner);
				}}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<View style={StyleSheet.absoluteFillObject}>
							<BarCodeScanner
								style={StyleSheet.absoluteFillObject}
								onBarCodeScanned={handleBarCodeScanned}
								barCodeTypes={[
									BarCodeScanner.Constants.BarCodeType.qr,
								]}
							/>
						</View>
					</View>
				</View>
			</Modal>
			<Modal
				animationType='slide'
				transparent
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<View
							style={{
								backgroundColor: 'white',
								borderRadius: 20,
								// make it square based on window dimensions
								width: Dimensions.get('window').width * 0.8,
								height: Dimensions.get('window').width * 0.8,
								overflow: 'hidden',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<QRCode
								value={qrValue}
								size={Dimensions.get('window').width * 0.7}
								logo={AppIcon}
								logoBackgroundColor='white'
								getRef={ref => {
									if (ref) {
										ref.toDataURL((base64: string) => {
											setBase64Code(base64);
										});
									}
								}}
							/>
						</View>
						<Text style={styles.modalText}>
							This QR code contains sensitive data
						</Text>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								width: Dimensions.get('window').width * 0.8,
							}}>
							<TouchableOpacity
								style={{
									...styles.button,
									backgroundColor: colors.background,
									// center content
									alignItems: 'center',
									justifyContent: 'center',
									width:
										Dimensions.get('window').width * 0.35,
								}}
								onPress={() => {
									const timestamp = new Date().getTime();
									RNFS.writeFile(
										`${RNFS.CachesDirectoryPath}/imageing-qr-${timestamp}.png`,
										base64Code,
										'base64',
									)
										.then(() =>
											CameraRoll.save(
												`${RNFS.CachesDirectoryPath}/imageing-qr-${timestamp}.png`,
											),
										)
										.then(() => {
											Toast.show(
												'Saved to gallery!',
												Toast.SHORT,
											);
										});
									setModalVisible(!modalVisible);
								}}>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									<Ionicons
										style={{
											margin: 5,
											color: colors.text,
										}}
										name='bookmark-outline'
										size={30}
									/>
									<Text style={{ color: colors.text }}>
										Save image
									</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									...styles.button,
									backgroundColor: colors.background,
									// center content
									alignItems: 'center',
									justifyContent: 'center',
									width:
										Dimensions.get('window').width * 0.35,
								}}
								onPress={() => {
									Share.open({
										message: `This is my Imageing ${destination.name} QR code`,
										url: `data:image/png;base64,${base64Code}`,
									})
										.then(() => null)
										.catch(() => null)
										.finally(() => {
											setModalVisible(!modalVisible);
										});
								}}>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									<Ionicons
										style={{
											margin: 5,
											color: colors.text,
										}}
										name='share-social-outline'
										size={30}
									/>
									<Text style={{ color: colors.text }}>
										Share code
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
			<ModalSelector
				initValue={null}
				visible={showSavedFiles}
				customSelector={<View />}
				data={savedFileData}
				optionContainerStyle={{
					backgroundColor: colors.card,
					borderColor: colors.text,
					borderWidth: 2,
					borderRadius: 5,
				}}
				optionTextStyle={{ color: colors.text }}
				onModalClose={() => setShowSavedFiles(false)}
				onChange={async (option, longPress) => {
					if (longPress) {
						setShowSavedFiles(false);
						setDeleteTargetPath(option.key as string);
						showDialog({
							title: 'Delete custom uploader',
							content: `Are you sure you want to delete ${option.label}?`,
							rightButtonText: 'Cancel',
							leftButtonText: 'Delete',
							context: 'deleteUploader',
						});
					} else {
						await saveSingleSetting(
							SettingsOptions.CurrentUploaderPath,
							option.key as string,
						);
						setCurrentUploaderPath(option.key as string);
						Toast.show(
							`Uploader set to ${option.label}`,
							Toast.SHORT,
						);
					}
				}}
			/>
			<ModalSelector
				initValue={null}
				visible={selectShow}
				customSelector={<View />}
				data={selectData}
				optionContainerStyle={{
					backgroundColor: colors.card,
					borderColor: colors.text,
					borderWidth: 2,
					borderRadius: 5,
				}}
				optionTextStyle={{ color: colors.text }}
				onModalClose={() => setSelectShow(false)}
				onChange={option => {
					handleSwitch(option.key);
					Toast.show(
						`Destination set to ${option.label}`,
						Toast.SHORT,
					);
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
					label={leftDialogButton}
					onPress={handlePush}
				/>
				<Dialog.Button
					label={rightDialogButton}
					onPress={handleCancel}
				/>
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
				name='Destination'
				children={() => (
					<SettingsComponent settingsOptions={destinationOptions} />
				)}
			/>
		</Stack.Navigator>
	);
}
