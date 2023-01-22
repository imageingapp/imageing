import AsyncStorage from '@react-native-async-storage/async-storage';
import { setStringAsync } from "expo-clipboard";

export async function uploadImage(file, Toast, setNoPick, setProgress, next, resolve) {
	// Get Host to check what settings should be used
	const host = await getHost();
	// Get Settings from host
	const settings = await getHostOptions(host);
	// Configure upload data
	let url = '';
	const formData = new FormData();
	switch (host) {
		case 'ImgBB': {
			url = 'https://api.imgbb.com/1/upload';
			formData.append('image', {
				uri: file.uri,
				type: 'image/jpeg',
				name: 'upload.jpeg'
			})
			break;
		}
		case 'SXCU': {
			url = settings.apiUrl;
			formData.append(settings.apiFieldname, {
				uri: file.uri,
				type: 'image/jpeg',
				name: 'upload.jpeg'
			})
			formData.append('endpoint', settings.apiEndpoint)
			formData.append('token', settings.apiToken)
		}
	}

	try {
		const uploadTask = new XMLHttpRequest();
		uploadTask.open('POST', url);
		uploadTask.onload = async () => {
			setNoPick(false);
			console.log(uploadTask.response)
			let response;
			try {
				response = JSON.parse(uploadTask.response);
			} catch (err) {
				response = null;
			}

			if (response) {
				if (uploadTask.status === 200) {
					await setStringAsync(response.data?.url ?? response.url).catch(console.log);
					await storeImage(file.uri, response);
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
						text2: `${
							response.error.message ?? response.error_msg
						}`
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
			resolve();
			next();
		}
		uploadTask.onerror = (e) => console.log(e);
		uploadTask.ontimeout = (e) => console.log(e);

		uploadTask.send(formData);

		if (uploadTask.upload) {
			uploadTask.upload.onprogress = ({ total, loaded }) => {
				const uploadProgress = loaded / total;
				setProgress(uploadProgress);
			}
		}
	} catch (error) {
		console.log(error);
		Toast.show({
			type: 'error',
			text1: 'An error occured!',
			text2: `${error}`
		});
	}
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
