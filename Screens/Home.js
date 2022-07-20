import { useState } from 'react';
import { Text, View, Image } from 'react-native';
import { styles } from '../Styles';

import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';

import Placeholder from '../assets/placeholder.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { pickFile, uploadFile } from '../src/Functions';

export default function HomeScreen() {
	const [image, setImage] = useState(Placeholder);
	const [uploading, setUploading] = useState(true);

	return (
		<View style={styles.fileWrap}>
			<View style={styles.container}>
				<Image
					style={styles.preview}
					source={image}></Image>
			</View>
			<View style={styles.buttonContainer}>
				<AwesomeButton
					style={styles.button}
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
						style={{ margin: 10 }}
						name='add-circle'
						size={30}
					/>
				</AwesomeButton>
				<AwesomeButton
					style={styles.button}
					size='medium'
					disabled={uploading}
					onPress={async () => {
						setUploading(true);
						await uploadFile(image);
						setImage(Placeholder);
					}}>
					<Text style={{ fontSize: 20, color: 'white' }}>Upload</Text>
				</AwesomeButton>
			</View>
			<Toast />
		</View>
	);
}
