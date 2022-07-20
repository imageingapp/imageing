import { useState, useEffect } from 'react';
import { View } from 'react-native';
import ImageGallery from '../components/Image Gallery/ImageGallery';
import { getImages } from '../src/AsyncStorage';
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
