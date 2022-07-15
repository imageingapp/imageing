import { useState } from 'react';
import { Text, View, Image } from 'react-native';
import { styles } from '../Styles';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { uploadAsync, FileSystemUploadType } from 'expo-file-system';
import { setStringAsync } from 'expo-clipboard';

import AwesomeButton from 'react-native-really-awesome-button/src/themes/blue';

import Placeholder from '../assets/placeholder.png';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

export default function HomeScreen() {
    const [image, setImage] = useState(Placeholder);
    const [uploading, setUploading] = useState(true);

    return (
        <View style={ styles.fileWrap }>
            <View style={ styles.previewContainer }>
                <Image style={ styles.preview } source={image}></Image>
            </View>
            <View style={ styles.buttonContainer }>
                <AwesomeButton style={styles.button} onPress={async () => {
                    const image = await pickFile();
                    if (image) {
                        setImage(image);
                        setUploading(false);
                    } else {
                        setUploading(true);
                    }
                }}>
                    <Ionicons style={{margin: 10}} name="add-circle" size={30} />
                </AwesomeButton>
                <AwesomeButton style={styles.button} size="medium" disabled={uploading} onPress={async () => {
                    setUploading(true);
                    await uploadFile(image);
                    setImage(Placeholder);
                }}> 
                    <Text style={{ fontSize: 20, color: 'white' }}>
                        Upload
                    </Text>
                </AwesomeButton>
            </View>
            <Toast />
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

async function uploadFile(file) {
    const url = 'https://api.imgbb.com/1/upload';
    const method = 'POST';
    const token = '246bade4022a21d2b30d2033be9625c8';
    const fileFormName = 'image';

    let response;
    try {
        response = await uploadAsync(url, file.uri, { httpMethod: method, headers: { 'Content-Type': 'multipart/form-data' }, uploadType: FileSystemUploadType.MULTIPART, fieldName: fileFormName, parameters: { "key": token } });
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'An error occured!',
            text2: `${error}`
        })
    }

    if (response) {
        if (response.status === 200) {
            const parsedResponse = JSON.parse(response.body);
            await setStringAsync(parsedResponse.data.url).catch(console.log);
            Toast.show({
                type: 'success',
                text1: 'Upload completed',
                text2: `Image URL copied to the clipboard`
            })
        } else {
            Toast.show({
                type: 'error',
                text1: 'An error occured!',
                text2: `Error ${responseJSON.http_code}: ${responseJSON.error}`
            })
        }
    }
}