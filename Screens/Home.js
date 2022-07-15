import { useState } from 'react';
import { Text, View, Image } from 'react-native';
import { styles } from '../Styles';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';

import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';

import Placeholder from '../assets/placeholder.png';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen() {
    const [image, setImage] = useState(Placeholder);

    return (
        <View style={ styles.fileWrap }>
            <View style={ styles.previewContainer }>
                <Image style={ styles.preview } source={image}></Image>
            </View>
            <View style={ styles.buttonContainer }>
                <AwesomeButton style={styles.button} onPress={async () => {
                    const image = await pickFile();
                    if (image) setImage(image);
                }}>
                    <Ionicons style={{margin: 10}} name="add-circle" size={30} />
                </AwesomeButton>
                <AwesomeButton style={styles.button} size="medium" disabled={false} progress onPress={async next => {  }}> 
                    <Text style={{ fontSize: 20, color: 'white' }}>
                        Upload
                    </Text>
                </AwesomeButton>
            </View>
        </View>
    );
}

async function pickFile() {
    let result = false;
    const picked = await launchImageLibraryAsync({ mediaTypes: MediaTypeOptions.Images, allowsEditing: true, quality: 1, allowsMultipleSelection: false }).catch(console.log);
    if (!picked.cancelled) {
        result = { uri: picked.uri };
    }
    return result;
}