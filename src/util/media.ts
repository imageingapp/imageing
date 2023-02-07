import { setStringAsync } from 'expo-clipboard';
import {
	launchCameraAsync,
	launchImageLibraryAsync,
	requestCameraPermissionsAsync,
	requestMediaLibraryPermissionsAsync,
	MediaTypeOptions,
} from 'expo-image-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import { performHttpRequest } from '@util/http';
import { getDestinationSettings, getSettings } from '@util/settings';
import { CustomUploader, DestinationNames, HttpStatus } from '@util/types';
import { loadCustomUploader } from '@util/uploader';

export async function pickImage() {
	const response = await requestMediaLibraryPermissionsAsync();
	if (response.granted) {
		const settings = await getSettings();
		return launchImageLibraryAsync({
			mediaTypes: MediaTypeOptions.Images,
			allowsEditing: !settings['Multi-Upload'],
			quality: 1,
			allowsMultipleSelection: settings['Multi-Upload'],
		}).catch(() => null);
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
			allowsMultipleSelection: settings['Multi-Upload'],
		}).catch(() => null);
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
		manual: host.deleteMethod === 'URL',
	});
	await AsyncStorage.setItem('images', JSON.stringify(images));
}

export async function removeImage(deleteUrl) {
	const stored = await AsyncStorage.getItem('images');
	const images = stored
		? JSON.parse(stored).filter(i => i.deleteUrl !== deleteUrl)
		: [];
	await AsyncStorage.setItem('images', JSON.stringify(images));
	return images;
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
	resolve,
}) {
	const destination = await getDestinationSettings();
	const settings = await getSettings();
	const uploader = await loadCustomUploader(settings.currentUploaderPath);
	let reason = '';

	let failed = 0;
	const remaining = [...files];
	/* eslint-disable no-restricted-syntax */
	for (const file of files) {
		/* eslint-disable no-await-in-loop,no-loop-func */
		await performHttpRequest({
			data: (() => {
				switch (destination.name) {
					case DestinationNames.Imgur:
						return null;
					case DestinationNames.ImgBB:
						return settings.ImgBBApiKey;
					case DestinationNames.Custom:
						return uploader as CustomUploader;
					default:
						return null;
				}
			})(),
			file,
			destination,
		})
			.then(x => {
				const response = JSON.parse(x as string);
				const url = destination.getUrl(response);
				setStringAsync(url);
				storeImage(file.uri, response, destination);

				Share.open({
					message: url,
				}).catch(() => null);
			})
			.catch(x => {
				reason = x;
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
		// reason is http status code, convert to string from enum
		const error = Object.keys(HttpStatus).find(
			x => HttpStatus[x] === reason,
		);
		Toast.show(`Upload failed: ${reason} ${error}`, Toast.SHORT);
	} else if (failed > 0) {
		Toast.show(
			`${files.length - failed}/${files.length} images uploaded`,
			Toast.SHORT,
		);
	} else {
		Toast.show(
			`Image URL${files.length > 1 ? 's' : ''} copied to clipboard`,
			Toast.SHORT,
		);
	}
	setNoPick(false);
	setUploading(true);
	setProgress(0);
	resolve(true);
	next();
}
