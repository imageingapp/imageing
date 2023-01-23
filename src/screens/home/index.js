import { useState } from 'react';
import { Text, View, Image } from 'react-native';
import { styles } from '../../Styles';
import { pickFile, uploadImage } from '../../utils/image';
import { Bar } from 'react-native-progress';

import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';

import Placeholder from '../../../assets/placeholder.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import Gestures from 'react-native-easy-gestures';

export default function HomeScreen() {
	const [progress, setProgress] = useState(0);
	const [image, setImage] = useState(Placeholder);
	const [uploading, setUploading] = useState(true);
	const [noPick, setNoPick] = useState(false);

	return (
		<View style={styles.fileWrap}>
			<View style={styles.container}>
				<Gestures
					style={styles.container}
					rotatable={false}
					draggable={true}
					Gestures
					scalable={{ min: 1, max: 10 }}>
					<Image
						style={styles.preview}
						source={image}
					/>
				</Gestures>
			</View>
			<View style={{ paddingVertical: 10 }}>
				<Bar
					progress={progress}
					width={260}
					color={'#1775C8'}
					borderColor={'#f2f2f2'}
				/>
			</View>
			<View style={styles.buttonContainer}>
				<AwesomeButton
					style={styles.button}
					disabled={noPick}
					onPress={async () => {
						const pickedImage = await pickFile();
						if (!pickedImage.canceled) {
							setImage({ uri: pickedImage.assets[0].uri });
							setUploading(false);
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
						const resolve = () => setImage(Placeholder);
						await uploadImage(
							image,
							Toast,
							setNoPick,
							setProgress,
							next,
							resolve
						);
					}}>
					<Text style={{ fontSize: 20, color: 'white' }}>Upload</Text>
				</AwesomeButton>
			</View>
			<Toast />
		</View>
	);
}
