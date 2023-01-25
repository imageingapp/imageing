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

function getFormData(file, settings, host) {
	const formData = new FormData();
	switch (host) {
		case aHosts[0]: {
			// ImgBB
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
	return formData;
}

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

export async function storeImage(localUrl, uploadData, host) {
	const stored = await AsyncStorage.getItem('images');
	const images = stored ? JSON.parse(stored) : [];
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
	await AsyncStorage.setItem('images', JSON.stringify(images));
	return images;
}

export async function deleteImage(hash) {
	const settings = await getSettings();
	const host = await getHostSettings();

	const get = host === aHosts[1];

	await doRequest(
		get ? hash : `https://api.imgur.com/3/image/${hash}`,
		get ? 'GET' : 'DELETE',
		null,
		get
			? null
			: {
					text: 'Authorization',
					value: `Client-ID ${settings.apiClientId}`
			  },
		(o, res) => {
			res();
		},
		(o, u, res, rej) => {
			rej();
		},
		(o, u, res, rej) => {
			rej();
		}
	);
}

export async function getImages() {
	const stored = await AsyncStorage.getItem('images');
	const images = stored ? JSON.parse(stored) : [];
	images.sort((a, b) => b.date - a.date);
	return images;
}

export async function uploadImages(
	files,
	Toast,
	setNoPick,
	setProgress,
	setUploading,
	setImages,
	next,
	resolve
) {
	const host = await getHostSettings();
	const settings = await getSettings();
	/* eslint-disable no-nested-ternary */
	const url =
		host === aHosts[1]
			? settings.apiUrl
			: host === aHosts[0]
			? 'https://api.imgbb.com/1/upload'
			: 'https://api.imgur.com/3/image';
	let reason = '';

	const onerror = (error, task, res, rej) => {
		/* eslint-disable no-underscore-dangle */
		reason = task._response;
		rej();
	};

	const onprogress = ({ total, loaded }) => {
		const progress = loaded / total;
		setProgress(progress);
	};

	let failed = 0;
	const remaining = [...files];
	/* eslint-disable no-restricted-syntax */
	for (const file of files) {
		const formData = getFormData(file, settings, host);
		const onload = (task, res, rej) => {
			if (task.status !== 200) return rej(task);
			setProgress(0);

			const response = JSON.parse(task.response);
			setStringAsync(host.getUrl(response));
			storeImage(file.uri, response, host);
			return res();
		};
		/* eslint-disable no-await-in-loop,no-loop-func */
		await doRequest(
			url,
			'POST',
			formData,
			host === aHosts[2]
				? {
						text: 'Authorization',
						value: `Client-ID ${settings.apiClientId}`
				  }
				: null,
			onload,
			onprogress,
			onerror
		).catch((task) => {
			let response;
			try {
				response = JSON.parse(task.response);
			} catch (err) {
				if (task.status === 404) {
					reason = 'Incorrect URL specified';
				}
			}
			if (!reason) {
				reason = response.error_msg.includes('send a file')
					? 'Invalid Formname specified'
					: response.error_msg;
			}
			failed += 1;
		});
		if (reason) {
			failed = files.length;
			break;
		}
		// Please ignore this, this is just til I figure out a nice way to show multiple images
		// and display the remaining images to upload
		if (remaining.length > 1) {
			remaining.shift();
			setImages(remaining);
		}
	}
	if (failed === files.length) {
		Toast.show({
			type: 'error',
			text1: 'Upload failed',
			text2: reason || 'No image could be uploaded'
		});
	} else if (failed > 0) {
		Toast.show({
			type: 'info',
			text1: 'Upload incomplete',
			text2: `${files.length - failed}/${files.length} images uploaded`
		});
	} else {
		Toast.show({
			type: 'success',
			text1: 'Upload completed',
			text2: `Image URL${
				files.length > 1 ? 's' : ''
			} copied to the clipboard`
		});
	}
	setNoPick(false);
	setUploading(true);
	setProgress(0);
	resolve(true);
	next();
}
