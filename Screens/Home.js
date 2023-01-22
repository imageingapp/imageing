import { useState } from 'react';
import { Text, View, Image } from 'react-native';
import { styles } from '../Styles';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { uploadImage } from '../utils/storage';
import { Bar } from 'react-native-progress';

import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';

import Placeholder from '../assets/placeholder.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

export default function HomeScreen() {
	const [progress, setProgress] = useState(0);
	const [image, setImage] = useState(Placeholder);
	const [uploading, setUploading] = useState(true);
	const [noPick, setNoPick] = useState(false);

	return (
		<View style={styles.fileWrap}>
			<View style={styles.container}>
				<Image
					style={styles.preview}
					source={image}></Image>
			</View>
			<View style={{ paddingVertical: 10 }}>
				<Bar progress={progress} width={260} color={'#1775C8'} borderColor={'#f2f2f2'} />
			</View>
			<View style={styles.buttonContainer}>
				<AwesomeButton
					style={styles.button}
					disabled={noPick}
					onPress={async () => {
						const image = await pickFile();
						if (image) {
							setImage(image);
							setUploading(false);
						} else {
							setUploading(true);
						}
					}}>
					<Ionicons
						style={{ margin: 10, color: 'white' }}
						name='add-circle'
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
						const resolve = () => setImage(Placeholder);
						await uploadImage(image, Toast, setNoPick, setProgress, next, resolve);
					}}>
					<Text style={{ fontSize: 20, color: 'white' }}>Upload</Text>
				</AwesomeButton>
			</View>
			<Toast />
		</View>
	);
}

async function pickFile() {
	let result = false;
	const picked = await launchImageLibraryAsync({
		mediaTypes: MediaTypeOptions.Images,
		allowsEditing: false,
		quality: 1,
		allowsMultipleSelection: false
	}).catch(console.log);
	if (!picked.canceled) {
		result = { uri: picked.assets[0].uri };
	}
	return result;
}