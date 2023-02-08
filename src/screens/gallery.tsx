/* eslint-disable no-nested-ternary */
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
	View,
	FlatList,
	Image,
	Dimensions,
	TouchableHighlight,
	Text,
	Linking,
	TouchableOpacity,
} from 'react-native';
import { setStringAsync } from 'expo-clipboard';
import { useIsFocused, useTheme } from '@react-navigation/native';

// eslint-disable-next-line import/no-extraneous-dependencies
import Ionicons from '@expo/vector-icons/Ionicons';
import Dialog from 'react-native-dialog';
import Gestures from 'react-native-easy-gestures';
import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';
import { Styles } from '@util/constants';
import AnimatedImages from '@components/AnimatedImages';
import { getFiles, removeFile } from '@util/media';
import type { StoredFile } from '@util/types';

const { width: screenWidth } = Dimensions.get('window');

export default function GalleryScreen({ navigation }) {
	const [files, setFiles] = useState([]);
	const [storedFile, setStoredFile] = useState({} as StoredFile);
	const [deletePopup, setDeletePopup] = useState(false);
	const [additionalInfo, setAdditionalInfo] = useState('');
	const [draggable, setDraggable] = useState(false);
	const [gestures, setGestures] = useState({} as Gestures);

	const isFocused = useIsFocused();
	const { colors } = useTheme();

	useEffect(() => {
		let isMounted = true;
		setStoredFile({} as StoredFile);
		getFiles().then(x => {
			if (isMounted) setFiles(x);
		});
		const unsubscribe = navigation.addListener('tabPress', () => {
			setStoredFile({} as StoredFile);
		});
		return () => {
			isMounted = false;
			unsubscribe();
		};
	}, [isFocused, navigation]);

	const openFile = (x: StoredFile) => {
		setStoredFile(x);
	};

	const renderFiles = (file: { index: number; item: StoredFile }) => (
		<AnimatedImages imageIndex={file.index}>
			<View style={{ flex: 1, alignItems: 'flex-start' }}>
				<TouchableHighlight
					style={{ borderRadius: 10 }}
					onPress={() => openFile(file.item)}>
					<Image
						source={{ uri: file.item.localPath }}
						style={{
							margin: 2,
							height: screenWidth / 3.1,
							width: screenWidth / 3.1,
							borderRadius: 10,
						}}
					/>
				</TouchableHighlight>
			</View>
		</AnimatedImages>
	);

	const handleCancel = () => {
		setDeletePopup(false);
	};

	const handleDelete = async () => {
		if (storedFile.deletable) {
			// await deleteFile(storedFile.deleteEndpoint);
		} else {
			await Linking.openURL(storedFile.deleteEndpoint);
		}
		setFiles(await removeFile(storedFile.deleteEndpoint));
		setDeletePopup(false);
		setAdditionalInfo('');
		setStoredFile({} as StoredFile);
	};

	return (
		<SafeAreaView
			style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Dialog.Container visible={deletePopup}>
				<Dialog.Title>Delete image</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to permanently delete this image?
					{additionalInfo}
				</Dialog.Description>
				<Dialog.Button
					label='Cancel'
					onPress={handleCancel}
				/>
				<Dialog.Button
					label='Delete'
					onPress={handleDelete}
				/>
			</Dialog.Container>
			{storedFile.localPath ? (
				<View style={Styles.fileWrap}>
					<View style={Styles.container}>
						<Gestures
							style={Styles.container}
							ref={c => setGestures(c)}
							onScaleStart={() => {
								setDraggable(true);
							}}
							onScaleEnd={() => {
								gestures.reset(() => null);
								setDraggable(false);
							}}
							rotatable={false}
							draggable={draggable}
							scalable={{ min: 1, max: 10 }}>
							<View style={Styles.container}>
								{!draggable ? (
									<TouchableOpacity
										style={{
											position: 'absolute',
											top: '7%',
											right: '5%',
											zIndex: 1,
											alignItems: 'center',
											justifyContent: 'center',
										}}
										onPress={() => {
											setStoredFile({} as StoredFile);
										}}>
										<View
											style={{
												backgroundColor:
													colors.background,
												borderRadius: 10,
											}}>
											<Ionicons
												style={{
													margin: 0,
													color: '#ff0000',
												}}
												name='close-outline'
												size={40}
											/>
										</View>
									</TouchableOpacity>
								) : null}

								<Image
									style={Styles.preview}
									source={{ uri: storedFile.localPath }}
								/>
							</View>
						</Gestures>
					</View>
					<View style={Styles.buttonContainer}>
						<AwesomeButton
							style={Styles.button}
							size='medium'
							onPress={async () => {
								await Linking.openURL(storedFile.remotePath);
							}}>
							<Text style={{ fontSize: 20, color: colors.text }}>
								Open
							</Text>
						</AwesomeButton>
						<AwesomeButton
							style={Styles.button}
							onPress={() =>
								setStringAsync(storedFile.remotePath)
							}>
							<Ionicons
								style={{ margin: 8, color: colors.background }}
								name='clipboard-outline'
								size={30}
							/>
						</AwesomeButton>
						<AwesomeButton
							style={Styles.button}
							onPress={() => {
								if (!storedFile.deletable) {
									setAdditionalInfo(
										'\n\nYou will get redirected to the website and you need to press delete manually.',
									);
								}
								setDeletePopup(true);
							}}>
							<Ionicons
								style={{ margin: 8, color: 'red' }}
								name='trash-outline'
								size={30}
							/>
						</AwesomeButton>
					</View>
				</View>
			) : files.length > 0 ? (
				<FlatList
					data={files}
					renderItem={renderFiles}
					keyExtractor={(_, index) => index.toString()}
					horizontal={false}
					numColumns={3}
				/>
			) : (
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<Text style={{ alignSelf: 'center', color: colors.text }}>
						Oh no, the gallery is empty!
					</Text>
				</View>
			)}
		</SafeAreaView>
	);
}
