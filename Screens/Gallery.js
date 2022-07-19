import { useState, useEffect } from 'react';
import { View } from 'react-native';
import ImageGallery from '../components/Image Gallery/ImageGallery.js';
import { getImages } from '../utils/storage.js';
import { styles } from '../Styles.js';

export default function GalleryScreen() {
	const [images, setImages] = useState([]);

	useEffect(() => {
		let isMounted = true;
		getImages().then((images) => {
			if (isMounted) setImages(images);
		});
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<View style={styles.container}>
			<ImageGallery images={images} />
		</View>
	);
}
