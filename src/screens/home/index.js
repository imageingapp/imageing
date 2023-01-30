/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, Image } from 'react-native';
import { Bar } from 'react-native-progress';
import { useIsFocused, useTheme } from '@react-navigation/native';

// eslint-disable-next-line import/no-extraneous-dependencies
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import Gestures from 'react-native-easy-gestures';
import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';
// eslint-disable-next-line import/no-extraneous-dependencies
import ShareMenu from 'react-native-share-menu';
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
	const { colors } = useTheme();

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

	const handleShare = useCallback((item) => {
		if (!item) {
			return;
		}

		const { mimeType, data, extraData } = item;

		console.log('Shared data: ', item);

		if (mimeType === 'image/png' || mimeType === 'image/jpeg') {
			setImages([{ uri: data }]);
			setUploading(false);
		}
	}, []);

	useEffect(() => {
		ShareMenu.getInitialShare(handleShare);
	}, [handleShare]);

	useEffect(() => {
		const listener = ShareMenu.addNewShareListener(handleShare);

		return () => {
			listener.remove();
		};
	}, [handleShare]);

	const imageOrImages = () => {
		if (images.length > 1) {
			return images.map((image) => (
				<Image
					style={{
						width: `${95 / images.length}%`,
						height: `${95 / images.length}%`
					}}
					key={image.uri}
					source={{ uri: image.uri }}
				/>
			));
		}
		return (
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
		);
	};

	return (
		<View style={styles.fileWrap}>
			<View style={styles.container}>{imageOrImages()}</View>
			<View style={{ paddingVertical: 10 }}>
				<Bar
					progress={progress}
					width={260}
					color={colors.background}
					borderColor={colors.background}
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
						style={{ margin: 10, color: colors.background }}
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
						style={{ margin: 10, color: colors.background }}
						name='add-circle-outline'
						size={30}
					/>
				</AwesomeButton>
				<AwesomeButton
					style={styles.button}
					progress
					size='medium'
					disabled={uploading}
					backgroundColor={colors.border}
					backgroundDarker={colors.card}
					backgroundProgress={colors.primary}
					backgroundPlaceholder={colors.background}
					backgroundShadow={colors.card}
					onPress={async (next) => {
						setUploading(true);
						setNoPick(true);
						const netInfo = await NetInfo.fetch();
						if (!netInfo.isConnected) {
							Toast.show(
								'No network connection available',
								Toast.SHORT
							);
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
					<Text style={{ fontSize: 20, color: colors.text }}>
						Upload
					</Text>
				</AwesomeButton>
			</View>
		</View>
	);
}
