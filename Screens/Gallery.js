import { useState } from 'react';
import { View } from 'react-native';
import ImageGallery from '../components/ImageGallery.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GalleryScreen() {
    const [images, setImages] = useState([]);

    AsyncStorage.getItem('images').then(localImages => {
        if (localImages) {
            const img = JSON.parse(localImages).sort((a, b) => b.date - a.date);
            setImages(img);
        }
    })

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ImageGallery images={images} />
        </View>
    );
}