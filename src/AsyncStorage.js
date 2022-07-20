import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeImage(localUrl, url) {
	const stored = await AsyncStorage.getItem('images');
	const images = stored ? JSON.parse(stored) : [];
	if (images.length > 9) {
		images.sort((a, b) => a.date - b.date);
		images.shift();
	}
	images.push({ localUrl, url, date: Date.now() });
	await AsyncStorage.setItem('images', JSON.stringify(images));
}

export async function getImages() {
	const stored = await AsyncStorage.getItem('images');
	const images = stored ? JSON.parse(stored) : [];
	images.sort((a, b) => b.date - a.date);
	return images;
}
