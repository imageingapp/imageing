import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadAsync, FileSystemUploadType } from 'expo-file-system';

export async function uploadImage(file, Toast) {
	// Get Host to check what settings should be used
	const host = await getHost();
	// Get Settings from host
	const settings = await getHostOptions(host);
	// Configure upload data
	let url = '';
	const uploadData = {
		httpMethod: 'POST',
		headers: { 'Content-Type': 'multipart/form-data' },
		uploadType: FileSystemUploadType.MULTIPART,
		fieldName: '',
		parameters: {}
	};
	switch (host) {
		case 'ImgBB': {
			url = 'https://api.imgbb.com/1/upload';
			uploadData.fieldName = 'image';
			uploadData.parameters = { key: settings.apiKey };
			break;
		}
		case 'SXCU': {
			// Only multipart/form-data support yet
			url = settings.apiUrl;
			uploadData.fieldName = settings.apiFieldname;
			uploadData.parameters = {
				endpoint: settings.apiEndpoint,
				token: settings.apiToken
			};
		}
	}

	let response;
	try {
		response = await uploadAsync(url, file.uri, uploadData);
	} catch (error) {
		console.log(error);
		Toast.show({
			type: 'error',
			text1: 'An error occured!',
			text2: `${error}`
		});
	}
	return response;
}

export async function storeImage(localUrl, uploadData) {
	const stored = await AsyncStorage.getItem('images');
	const images = stored ? JSON.parse(stored) : [];
	if (images.length > 9) {
		images.sort((a, b) => a.date - b.date);
		images.shift();
	}
	images.push({
		localUrl,
		url: uploadData.data?.url ?? uploadData.url,
		deleteUrl: uploadData.data?.delete_url ?? uploadData.deletion_url,
		date: Date.now()
	});
	await AsyncStorage.setItem('images', JSON.stringify(images));
}

export async function removeImage(deleteUrl) {
	const stored = await AsyncStorage.getItem('images');
	const images = stored
		? JSON.parse(stored).filter((i) => i.deleteUrl !== deleteUrl)
		: [];
	if (images.length > 9) {
		images.sort((a, b) => a.date - b.date);
		images.shift();
	}
	await AsyncStorage.setItem('images', JSON.stringify(images));
	return images;
}

export async function getImages() {
	const stored = await AsyncStorage.getItem('images');
	const images = stored ? JSON.parse(stored) : [];
	images.sort((a, b) => b.date - a.date);
	return images;
}

export async function getHost() {
	const stored = await AsyncStorage.getItem('host');
	return stored ?? 'ImgBB';
}

export async function setHost(host) {
	await AsyncStorage.setItem('host', host);
}

/**
 *	ImgBB:
 * 	{ apiKey: '' }
 *
 *	SXCU:
 *	{ apiUrl: '', apiToken: '', apiEndpoint: '', apiFieldname: '' }
 */
export async function getHostOptions(host) {
	const stored = await AsyncStorage.getItem(host);
	const parsed = stored
		? JSON.parse(stored)
		: host === 'ImgBB'
		? { apiKey: '' }
		: { apiUrl: '', apiEndpoint: '', apiToken: '', apiFieldname: '' };
	if (!stored) {
		await setHostOptions(host, parsed);
	}
	return parsed;
}

export async function setHostOptions(host, options) {
	await AsyncStorage.setItem(host, JSON.stringify(options));
}
