import { useState, useEffect } from 'react';
import { View } from 'react-native';
import ImageGallery from '../components/ImageGallery.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getImages } from '../utils/storage.js';
import { styles } from '../Styles.js';

export default function GalleryScreen() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        let isMounted = true;
        getImages().then(images => {
          if (isMounted) setImages(images);
        })
        return () => { isMounted = false };
      }, []);

    return (
        <View style={styles.container}>
            <ImageGallery images={images} />
        </View>
    );
}