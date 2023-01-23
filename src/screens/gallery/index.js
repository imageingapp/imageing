import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import {
	View,
	FlatList,
	Image,
	Dimensions,
	TouchableHighlight,
	Text,
	Linking
} from 'react-native';
import { getImages, removeImage, deleteImage } from '../../utils/image';
import { AnimatedImages } from '../../components/AnimatedImages';
import { styles } from '../../Styles';
import { setStringAsync } from 'expo-clipboard';
import { useIsFocused } from '@react-navigation/native';
import Dialog from 'react-native-dialog';

import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import Gestures from 'react-native-easy-gestures';

let { width: screenWidth } = Dimensions.get('window');

export default function GalleryScreen({ navigation }) {
	const [images, setImages] = useState([]);
	const [fullImage, setFullImage] = useState({});
	const [deletePopup, setDeletePopup] = useState(false);
	const [additionalInfo, setAdditionalInfo] = useState('');

	const isFocused = useIsFocused();

	useEffect(() => {
		let isMounted = true;
		setFullImage({});
		getImages().then((images) => {
			if (isMounted) setImages(images);
		});
		const unsubscribe = navigation.addListener('tabPress', () => {
			setFullImage({});
		});
		return () => {
			isMounted = false;
			unsubscribe();
		};
	}, [isFocused]);

	const openImage = (image) => {
		setFullImage(image);
	};

	const renderImages = (image) => {
		return (
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
	};

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
							rotatable={false}
							draggable={true}
							scalable={{ min: 1, max: 10 }}>
							<Image
								style={styles.preview}
								source={{ uri: fullImage.localUrl }}
							/>
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
					<Toast />
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
