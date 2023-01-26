import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import { Bar } from 'react-native-progress';
import { useIsFocused } from '@react-navigation/native';

// eslint-disable-next-line import/no-extraneous-dependencies
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import Gestures from 'react-native-easy-gestures';
import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';
import Placeholder from '../../../assets/placeholder.png';
import { pickImage, takeImage, uploadImages } from '../../utils/image';
import { getSettings } from '../../utils/settings';
import styles from '../../Styles';

export default function HomeScreen() {
	const [progress, setProgress] = useState(0);
	const [images, setImages] = useState([Placeholder]);
	const [uploading, setUploading] = useState(true);
	const [noPick, setNoPick] = useState(false);
	const [draggable, setDraggable] = useState(false);
	const [zoomable, setZoomable] = useState(false);
	const [gestures, setGestures] = useState({});

	const isFocused = useIsFocused();
	useEffect(() => {
		let isMounted = true;
		getSettings().then((settings) => {
			if (isMounted) setZoomable(settings['Image Zoom and Drag']);
		});
		return () => {
			isMounted = false;
		};
	}, [isFocused]);
	return (
		<View style={styles.fileWrap}>
			<View style={styles.container}>
				{ if (images.length > 1) { return (
					images.map((image) => (
						<Image
							style={{
								width: `${95 / images.length}%`,
								height: `${95 / images.length}%`
							}}
							key={image.uri}
							source={{ uri: image.uri }}
						/>
					))
				) 
				} else return  (
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
						scalable={zoomable && { min: 1, max: 10 }}>
						<Image
							style={styles.preview}
							source={images[0]}
						/>
					</Gestures>
				)}
			</View>
			<View style={{ paddingVertical: 10 }}>
				<Bar
					progress={progress}
					width={260}
					color='#1775C8'
					borderColor='#f2f2f2'
				/>
			</View>
			<View style={styles.buttonContainer}>
				<AwesomeButton
					style={styles.button}
					disabled={noPick}
					onPress={async () => {
						const capturedImage = await takeImage();
						if (!capturedImage.canceled) {
							setImages(
								capturedImage.assets.map((asset) => ({
									uri: asset.uri
								}))
							);
							setUploading(false);
						}
					}}>
					<Ionicons
						style={{ margin: 10, color: 'white' }}
						name='camera-outline'
						size={30}
					/>
				</AwesomeButton>
				<AwesomeButton
					style={styles.button}
					disabled={noPick}
					onPress={async () => {
						const pickedImage = await pickImage();
						if (!pickedImage.canceled) {
							setImages(
								pickedImage.assets.map((asset) => ({
									uri: asset.uri
								}))
							);
							setUploading(false);
						}
					}}>
					<Ionicons
						style={{ margin: 10, color: 'white' }}
						name='add-circle-outline'
						size={30}
					/>
				</AwesomeButton>
				<AwesomeButton
					style={styles.button}
					progress
					size='medium'
					disabled={uploading}
					onPress={async (next) => {
						setUploading(true);
						setNoPick(true);
						const netInfo = await NetInfo.fetch();
						if (!netInfo.isConnected) {
							Toast.show({
								type: 'error',
								text1: 'No Internet Connection',
								text2: 'Are you connected to the internet?'
							});
							setUploading(false);
							setNoPick(false);
							next();
							return;
						}
						const resolve = (finished) => {
							if (finished) setImages([Placeholder]);
						};
						await uploadImages({
							files: images,
							Toast,
							setNoPick,
							setProgress,
							setUploading,
							setImages,
							next,
							resolve
						});
					}}>
					<Text style={{ fontSize: 20, color: 'white' }}>Upload</Text>
				</AwesomeButton>
			</View>
			<Toast />
		</View>
	);
}
