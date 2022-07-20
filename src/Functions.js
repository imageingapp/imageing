import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { uploadAsync, FileSystemUploadType } from 'expo-file-system';
import { setStringAsync } from 'expo-clipboard';
import { storeImage } from './AsyncStorage';

export async function pickFile() {
	let result = false;
	const picked = await launchImageLibraryAsync({
		mediaTypes: MediaTypeOptions.Images,
		allowsEditing: false,
		quality: 1,
		allowsMultipleSelection: false
	}).catch(console.log);
	if (!picked.cancelled) {
		result = { uri: picked.uri };
	}
	return result;
}

export async function uploadFile(file, Toast) {
	const url = 'https://api.imgbb.com/1/upload';
	const method = 'POST';
	const token = '246bade4022a21d2b30d2033be9625c8';
	const fileFormName = 'image';

	let response;
	try {
		response = await uploadAsync(url, file.uri, {
			httpMethod: method,
			headers: { 'Content-Type': 'multipart/form-data' },
			uploadType: FileSystemUploadType.MULTIPART,
			fieldName: fileFormName,
			parameters: { key: token }
		});
	} catch (error) {
		Toast.show({
			type: 'error',
			text1: 'An error occured!',
			text2: `${error}`
		});
	}

	if (response) {
		if (response.status === 200) {
			const parsedResponse = JSON.parse(response.body);
			await setStringAsync(parsedResponse.data.url).catch(console.log);
			await storeImage(file.uri, parsedResponse.data.url);

			Toast.show({
				type: 'success',
				text1: 'Upload completed',
				text2: `Image URL copied to the clipboard`
			});
		} else {
			Toast.show({
				type: 'error',
				text1: 'An error occured!',
				text2: `Error ${responseJSON.http_code}: ${responseJSON.error}`
			});
		}
	}
}
