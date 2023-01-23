import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import {
	View,
	FlatList,
	Image,
	Dimensions,
	TouchableHighlight,
	Modal,
	Text,
	Linking
} from 'react-native';
import { getImages, removeImage } from '../../utils/image';
import { AnimatedImages } from '../../components/AnimatedImages';
import { styles } from '../../Styles';
import { setStringAsync } from 'expo-clipboard';

import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

let { width: screenWidth } = Dimensions.get('window');

export default function GalleryScreen() {
	const [images, setImages] = useState([]);
	const [fullImage, setFullImage] = useState({});
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		let isMounted = true;
		getImages().then((images) => {
			if (isMounted) setImages(images);
		});
		return () => {
			isMounted = false;
		};
	}, []);

	const openImage = (image) => {
		setFullImage(image);
		setShowModal(true);
	};

	const renderImages = (image) => {
		return (
			<>
				<Modal
					transparent={false}
					visible={showModal}
					onRequestClose={() => {
						console.log(fullImage);
						setFullImage({});
						setShowModal(false);
						console.log('Modal has been closed.');
					}}>
					{/*All views of Modal*/}
					{/*Animation can be slide, slide, none*/}
					<View style={styles.modal}>
						<Image
							source={{ uri: fullImage.localUrl }}
							style={{
								height: screenWidth,
								width: screenWidth
							}}
						/>

						<View style={styles.buttonContainerGallery}>
							<AwesomeButton
								style={styles.button}
								size='medium'
								onPress={() => Linking.openURL(fullImage.url)}>
								<Text style={{ fontSize: 20, color: 'white' }}>
									Open in Browser
								</Text>
							</AwesomeButton>
							<AwesomeButton
								style={styles.button}
								onPress={async () => {
									await setStringAsync(fullImage.url)
										.then(() => {
											Toast.show({
												type: 'success',
												text1: 'URL retrieved',
												text2: `Image URL copied to the clipboard`,
												position: 'bottom'
											});
										})
										.catch((err) => {
											console.log(err);
											Toast.show({
												type: 'error',
												text1: 'An error occured!',
												text2: `${err}`
											});
										});
								}}>
								<Ionicons
									style={{ margin: 8, color: 'white' }}
									name='clipboard-outline'
									size={30}
								/>
							</AwesomeButton>
							{fullImage.deleteUrl ? (
								<AwesomeButton
									style={styles.button}
									onPress={async () => {
										await Linking.openURL(
											fullImage.deleteUrl
										);
										setImages(
											await removeImage(
												fullImage.deleteUrl
											)
										);
										setShowModal(false);
									}}>
									<Ionicons
										style={{ margin: 8, color: 'red' }}
										name='trash-outline'
										size={30}
									/>
								</AwesomeButton>
							) : null}
						</View>
						<Toast />
					</View>
				</Modal>
				<AnimatedImages imageIndex={image.index}>
					<View style={{ flex: 1, alignItems: 'flex-start' }}>
						<TouchableHighlight
							onPress={() => openImage(image.item)}>
							<Image
								source={{ uri: image.item.localUrl }}
								style={{
									margin: 2,
									height: screenWidth / 3.1,
									width: screenWidth / 3.1
								}}
							/>
						</TouchableHighlight>
					</View>
				</AnimatedImages>
			</>
		);
	};

	return (
		<SafeAreaView
			style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			{images.length > 0 ? (
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
 