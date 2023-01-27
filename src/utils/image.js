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
		case aHosts.ImgBB: {
			// ImgBB
			formData.append('image', {
				uri: file.uri,
				type: 'image/jpeg',
				name: 'upload.jpeg'
			});
			formData.append('key', settings.apiKey);
			break;
		}
		case aHosts.Imgur: {
			// Imgur
			formData.append('image', {
				uri: file.uri,
				type: 'image/jpeg',
				name: 'upload.jpeg'
			});
			break;
		}
		case aHosts.SXCU: {
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
		manual: host.deleteMethod === 'URL'
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

export async function deleteImage(deleteUrl) {
	const host = await getHostSettings();

	const onLoad = ({ res }) => res();
	const onError = ({ rej }) => rej();
	await doRequest({
		url: deleteUrl,
		method: host.deleteMethod,
		header: host.header,
		onLoad,
		onProgress: () => {},
		onError
	});
}

export async function getImages() {
	const stored = await AsyncStorage.getItem('images');
	const images = stored ? JSON.parse(stored) : [];
	images.sort((a, b) => b.date - a.date);
	return images;
}

/**
 * This method uploads one or more images to the configured host.
 *
 * @param files Array of files to upload
 * @param Toast Reference to the toast object
 * @param setNoPick Function to disable/enable being able to pick a new image
 * @param setProgress Function to set the progress
 * @param setUploading Function to disable/enable being able to press upload
 * @param setImages Function to set the images displayed
 * @param next Function to end the loading state
 * @param resolve Callback
 */
export async function uploadImages({
	files,
	Toast,
	setNoPick,
	setProgress,
	setUploading,
	setImages,
	next,
	resolve
}) {
	const host = await getHostSettings();
	const settings = await getSettings();
	const url = host.url || settings.apiUrl;
	let reason = '';

	const onError = ({ task, rej }) => {
		/* eslint-disable no-underscore-dangle */
		reason = task._response;
		rej();
	};

	const onProgress = ({ data }) => {
		const progress = data.loaded / data.total;
		setProgress(progress);
	};

	let failed = 0;
	const remaining = [...files];
	/* eslint-disable no-restricted-syntax */
	for (const file of files) {
		const formData = getFormData(file, settings, host);
		const onLoad = ({ task, res, rej }) => {
			if (task.status !== 200) return rej(task);
			setProgress(0);

			const response = JSON.parse(task.response);
			setStringAsync(host.getUrl(response));
			storeImage(file.uri, response, host);
			return res();
		};
		/* eslint-disable no-await-in-loop,no-loop-func */
		await doRequest({
			url,
			method: 'POST',
			formData,
			header: host.header,
			onLoad,
			onProgress,
			onError
		}).catch((task) => {
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
		Toast.show('Upload failed', Toast.SHORT);
	} else if (failed > 0) {
		Toast.show(
			`${files.length - failed}/${files.length} images uploaded`,
			Toast.SHORT
		);
	} else {
		Toast.show(
			`Image URL${files.length > 1 ? 's' : ''} copied to the clipboard`,
			Toast.SHORT
		);
	}
	setNoPick(false);
	setUploading(true);
	setProgress(0);
	resolve(true);
	next();
}
