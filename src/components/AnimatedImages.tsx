/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import { View } from 'react-native-animatable';
import React from 'react';

export default function AnimatedImages(props) {
	return (
		<View
			animation='zoomIn'
			delay={props.imageIndex * 50}>
			{props.children}
		</View>
	);
}
