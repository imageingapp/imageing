/* eslint-disable no-console */
import { setStringAsync } from 'expo-clipboard';
import {
	launchCameraAsync,
	launchImageLibraryAsync,
	requestCameraPermissionsAsync,
	requestMediaLibraryPermissionsAsync,
	MediaTypeOptions
} from 'expo-image-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHostSettings, getSettings } from './settings';
import aHosts from './hosts';
import doRequest from './request';

export async function pickImage() {
	const response = await requestMediaLibraryPermissionsAsync();
	if (response.granted) {
		const settings = await getSettings();
		return launchImageLibraryAsync({
			mediaTypes: MediaTypeOptions.Images,
			allowsEditing: !settings['Multi-Upload'],
			quality: 1,
			allowsMultipleSelection: settings['Multi-Upload']
		}).catch(console.log);
	}
	return { canceled: true };
}

export async function takeImage() {
	const response = await requestCameraPermissionsAsync();
	if (response.granted) {
		const settings = await getSettings();
		return launchCameraAsync({
			mediaTypes: MediaTypeOptions.Images,
			allowsEditing: !settings['Multi-Upload'],
			quality: 1,
			allowsMultipleSelection: settings['Multi-Upload']
		}).catch(console.log);
	}
	return { canceled: true };
}

export async function uploadImage(
	file,
	Toast,
	setNoPick,
	setProgress,
	setUploading,
	next,
	resolve
) {
	// Get Host to check what settings should be used
	const host = await getHostSettings();
	// Get Settings from host
	const settings = await getSettings();
	// Configure upload data
	let url = '';
	const formData = new FormData();
	switch (host) {
		case aHosts[0]: {
			// ImgBB
			url = 'https://api.imgbb.com/1/upload';
			formData.append('image', {
				uri: file.uri,
				type: 'image/jpeg',
				name: 'upload.jpeg'
			});
			formData.append('key', settings.apiKey);
			break;
		}
		case aHosts[1]: {
			// SXCU
			url = settings.apiUrl;
			formData.append(settings.apiFormName, {
				uri: file.uri,
				type: 'image/jpeg',
				name: 'upload.jpeg'
			});
			formData.append('endpoint', settings.apiEndpoint);
			formData.append('token', settings.apiToken);
			break;
		}
		case aHosts[2]: {
			// Imgur
			url = 'https://api.imgur.com/3/image';
			formData.append('image', {
				uri: file.uri,
				type: 'image/jpeg',
				name: 'upload.jpeg'
			});
			break;
		}
		default:
			break;
	}

	try {
		const onerror = (error, task) => {
			console.log(error, task);
			setNoPick(false);
			setUploading(false);
			setProgress(0);
			resolve(false);
			next();
			/* eslint-disable no-underscore-dangle */
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: task._response
			});
		};
		const onprogress = ({ total, loaded }) => {
			const uploadProgress = loaded / total;
			setProgress(uploadProgress);
		};
		const onload = async (uploadTask) => {
			setNoPick(false);
			let response;
			try {
				response = JSON.parse(uploadTask.response);
			} catch (err) {
				response = null;
			}

			if (response) {
				if (uploadTask.status === 200) {
					await setStringAsync(host.getUrl(response)).catch(
						console.log
					);
					// eslint-disable-next-line no-use-before-define
					await storeImage(file.uri, response, host);
					Toast.show({
						type: 'success',
						text1: 'Upload completed',
						text2: `Image URL copied to the clipboard`
					});
				} else {
					Toast.show({
						type: 'error',
						text1: `Error ${
							response.status_code ?? response.http_code
						}`,
						text2: `${response.error.message ?? response.error_msg}`
					});
				}
			} else {
				Toast.show({
					type: 'error',
					text1: 'Error',
					text2: 'An unknown error occured, is the URL correct?'
				});
			}
			setProgress(0);
			resolve(true);
			next();
		};

		await doRequest(
			url,
			'POST',
			formData,
			{
				text: 'Authorization',
				value: `Client-ID ${
					host === aHosts[2] ? settings.apiClientId : ''
				}`
			},
			onload,
			onprogress,
			onerror
		);
	} catch (error) {
		console.log(error);
		Toast.show({
			type: 'error',
			text1: 'An error occured!',
			text2: `${error}`
		});
		setNoPick(false);
		setUploading(false);
		setProgress(0);
		resolve(false);
		next();
	}
}

export async function storeImage(localUrl, uploadData, host) {
	const stored = await AsyncStorage.getItem('images');
	const images = stored ? JSON.parse(stored) : [];
	if (images.length > 9) {
		images.sort((a, b) => a.date - b.date);
		images.shift();
	}
	images.push({
		localUrl,
		url: host.getUrl(uploadData),
		deleteUrl: host.getDeleteUrl(uploadData),
		date: Date.now(),
		manual: host === aHosts[0]
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

export async function deleteImage(hash) {
	const settings = await getSettings();
	const host = await getHostSettings();

	if (host === aHosts[1]) {
		await doRequest(
			hash,
			'GET',
			null,
			null,
			() => {},
			() => {},
			() => {}
		);
	} else {
		await doRequest(
			`https://api.imgur.com/3/image/${hash}`,
			'DELETE',
			null,
			{
				text: 'Authorization',
				value: `Client-ID ${settings.apiClientId}`
			},
			() => {},
			() => {},
			() => {}
		);
	}
}

export async function getImages() {
	const stored = await AsyncStorage.getItem('images');
	const images = stored ? JSON.parse(stored) : [];
	images.sort((a, b) => b.date - a.date);
	return images;
}
