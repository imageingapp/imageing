import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import colors from "../theme/colors";

export function SettingsComponent ({ settingsOptions }) {

	return (
		<ScrollView style={{backgroundColor: colors.white}}>
			{settingsOptions.map(({title, subTitle, onPress}) => (
				<TouchableOpacity key={title} onPress={onPress}>
					<View style={{ paddingHorizontal: 20, paddingBottom: 20, paddingTop: 20 }}>
						<Text style={{fontSize: 17}}>{title}</Text>
						{subTitle && (
							<Text style={{fontSize: 14, opacity: 0.5, paddingTop: 5}}>
							{subTitle}
							</Text>
						)}
					</View>
					<View style={{height: 1, backgroundColor: colors.grey}} />
				</TouchableOpacity>
			))}
		</ScrollView>
	);
};