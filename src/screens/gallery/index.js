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
	TouchableOpacity
} from 'react-native';
import { setStringAsync } from 'expo-clipboard';
import { useIsFocused } from '@react-navigation/native';

// eslint-disable-next-line import/no-extraneous-dependencies
import Ionicons from '@expo/vector-icons/Ionicons';
import Dialog from 'react-native-dialog';
import Gestures from 'react-native-easy-gestures';
import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';
import styles from '../../Styles';
import AnimatedImages from '../../components/AnimatedImages';
import { getImages, removeImage, deleteImage } from '../../utils/image';

const { width: screenWidth } = Dimensions.get('window');

export default function GalleryScreen({ navigation }) {
	const [images, setImages] = useState([]);
	const [fullImage, setFullImage] = useState({});
	const [deletePopup, setDeletePopup] = useState(false);
	const [additionalInfo, setAdditionalInfo] = useState('');
	const [draggable, setDraggable] = useState(false);
	const [gestures, setGestures] = useState({});

	const isFocused = useIsFocused();

	useEffect(() => {
		let isMounted = true;
		setFullImage({});
		getImages().then((imgs) => {
			if (isMounted) setImages(imgs);
		});
		const unsubscribe = navigation.addListener('tabPress', () => {
			setFullImage({});
		});
		return () => {
			isMounted = false;
			unsubscribe();
		};
	}, [isFocused, navigation]);

	const openImage = (image) => {
		setFullImage(image);
	};

	const renderImages = (image) => (
		<AnimatedImages imageIndex={image.index}>
			<View style={{ flex: 1, alignItems: 'flex-start' }}>
				<TouchableHighlight
					style={{ borderRadius: 10 }}
					onPress={() => openImage(image.item)}>
					<Image
						source={{ uri: image.item.localUrl }}
						style={{
							margin: 2,
							height: screenWidth / 3.1,
							width: screenWidth / 3.1,
							borderRadius: 10
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
		if (!fullImage.manual) {
			await deleteImage(fullImage.deleteUrl);
		} else {
			await Linking.openURL(fullImage.deleteUrl);
		}
		setImages(await removeImage(fullImage.deleteUrl));
		setDeletePopup(false);
		setAdditionalInfo('');
		setFullImage({});
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
			{fullImage.localUrl ? (
				<View style={styles.fileWrap}>
					<View style={styles.container}>
						<Gestures
							style={styles.container}
							ref={(c) => setGestures(c)}
							onScaleStart={() => {
								setDraggable(true);
							}}
							onScaleEnd={() => {
								gestures.reset(() => {});
								setDraggable(false);
							}}
							rotatable={false}
							draggable={draggable}
							scalable={{ min: 1, max: 10 }}>
							<View style={styles.container}>
								{!draggable ? (
									<TouchableOpacity
										style={{
											position: 'absolute',
											top: '7%',
											right: '5%',
											zIndex: 1,
											alignItems: 'center',
											justifyContent: 'center'
										}}
										onPress={() => {
											setFullImage({});
										}}>
										<View
											style={{
												backgroundColor: 'white',
												borderRadius: 10
											}}>
											<Ionicons
												style={{
													margin: 0,
													color: '#ff0000'
												}}
												name='close-outline'
												size={40}
											/>
										</View>
									</TouchableOpacity>
								) : null}

								<Image
									style={styles.preview}
									source={{ uri: fullImage.localUrl }}
								/>
							</View>
						</Gestures>
					</View>
					<View style={styles.buttonContainer}>
						<AwesomeButton
							style={styles.button}
							size='medium'
							onPress={async () => {
								await Linking.openURL(fullImage.url);
							}}>
							<Text style={{ fontSize: 20, color: 'white' }}>
								Open
							</Text>
						</AwesomeButton>
						<AwesomeButton
							style={styles.button}
							onPress={() => setStringAsync(fullImage.url)}>
							<Ionicons
								style={{ margin: 8, color: 'white' }}
								name='clipboard-outline'
								size={30}
							/>
						</AwesomeButton>
						<AwesomeButton
							style={styles.button}
							onPress={() => {
								if (fullImage.manual) {
									setAdditionalInfo(
										'\n\nYou will get redirected to the website and you need to press delete manually.'
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
			) : images.length > 0 ? (
				<FlatList
					data={images}
					renderItem={renderImages}
					keyExtractor={(item, index) => index.toString()}
					horizontal={false}
					numColumns={3}
				/>
			) : (
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center'
					}}>
					<Text style={{ alignSelf: 'center' }}>
						Oh no, the gallery is empty!
					</Text>
				</View>
			)}
		</SafeAreaView>
	);
}
