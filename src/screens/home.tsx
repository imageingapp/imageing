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
import Placeholder from '@assets/placeholder.png';
import { Styles } from '@util/constants';
import { ImagePickerSuccessResult } from 'expo-image-picker/build/ImagePicker.types';
import { pickFile, openCamera, uploadFiles } from '@util/media';
import { getSettings } from '@util/settings';

export default function HomeScreen() {
	const [progress, setProgress] = useState(0);
	const [files, setFiles] = useState([Placeholder]);
	const [uploading, setUploading] = useState(true);
	const [noPick, setNoPick] = useState(false);
	const [draggable, setDraggable] = useState(false);
	const [zoomable, setZoomable] = useState(false);
	const [gestures, setGestures] = useState({} as Gestures);
	const { colors } = useTheme();

	const isFocused = useIsFocused();
	useEffect(() => {
		let isMounted = true;
		getSettings().then(settings => {
			if (isMounted) setZoomable(settings['Image Zoom and Drag']);
		});
		return () => {
			isMounted = false;
		};
	}, [isFocused]);

	const handleShare = useCallback(item => {
		if (!item) {
			return;
		}

		const { data } = item;
		setFiles([{ uri: data }]);
		setUploading(false);
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

	const getFiles = () => {
		if (files.length > 1) {
			return files.map(image => (
				<Image
					style={{
						width: `${95 / files.length}%`,
						height: `${95 / files.length}%`,
					}}
					key={image.uri}
					source={{ uri: image.uri }}
				/>
			));
		}
		return (
			<Gestures
				style={Styles.container}
				ref={(c: unknown) => setGestures(c)}
				onScaleStart={() => {
					setDraggable(true);
				}}
				onScaleEnd={() => {
					gestures.reset(() => null);
					setDraggable(false);
				}}
				rotatable={false}
				draggable={draggable}
				scalable={zoomable && { min: 1, max: 10 }}>
				<Image
					style={Styles.preview}
					source={files[0]}
				/>
			</Gestures>
		);
	};

	return (
		<View style={Styles.fileWrap}>
			<View style={Styles.container}>{getFiles()}</View>
			<View style={{ paddingVertical: 10 }}>
				<Bar
					progress={progress}
					width={260}
					color={colors.background}
					borderColor={colors.background}
				/>
			</View>
			<View style={Styles.buttonContainer}>
				<AwesomeButton
					style={Styles.button}
					disabled={noPick}
					onPress={async () => {
						const captured = await openCamera();

						if (captured && !captured.canceled) {
							setFiles(
								(
									captured as ImagePickerSuccessResult
								).assets.map(asset => ({
									uri: asset.uri,
								})),
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
					style={Styles.button}
					disabled={noPick}
					onPress={async () => {
						const pickedImage = await pickFile();
						if (pickedImage && !pickedImage.canceled) {
							setFiles(
								(
									pickedImage as ImagePickerSuccessResult
								).assets.map(asset => ({
									uri: asset.uri,
								})),
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
					style={Styles.button}
					progress
					size='medium'
					disabled={uploading}
					backgroundColor={colors.border}
					backgroundDarker={colors.card}
					backgroundProgress={colors.primary}
					backgroundPlaceholder={colors.background}
					backgroundShadow={colors.card}
					onPress={async (next: () => void) => {
						setUploading(true);
						setNoPick(true);
						const netInfo = await NetInfo.fetch();
						if (!netInfo.isConnected) {
							Toast.show(
								'No network connection available',
								Toast.SHORT,
							);
							setUploading(false);
							setNoPick(false);
							next();
							return;
						}
						const resolve = finished => {
							if (finished) setFiles([Placeholder]);
						};
						await uploadFiles({
							files,
							Toast,
							setNoPick,
							setProgress,
							setUploading,
							setFiles,
							next,
							resolve,
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
