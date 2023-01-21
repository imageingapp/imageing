import { View } from 'react-native-animatable';

export const AnimatedImages = (props) => {
    return (
		<View animation='zoomIn' delay={props.imageIndex * 50}>
			{ props.children }
		</View>
    )
}