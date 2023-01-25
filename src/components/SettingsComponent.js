import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../theme/colors';

// eslint-disable-next-line react/prop-types
function SettingsComponent({ settingsOptions }) {
	return (
		<ScrollView style={{ backgroundColor: colors.white }}>
			{
				// eslint-disable-next-line react/prop-types
				settingsOptions.map(
					({ title, subTitle, icon, show, onPress }) => {
						if (!show) return null;
						return (
							<TouchableOpacity
								key={title}
								onPress={onPress}>
								<View
									style={{
										paddingHorizontal: 20,
										paddingBottom: 20,
										paddingTop: 20
									}}>
									<View
										style={{
											flexDirection: 'row',
											position: 'relative'
										}}>
										<Text style={{ fontSize: 17 }}>
											{title}
										</Text>
										<Ionicons
											style={{
												position: 'absolute',
												right: 5,
												top: '50%',
												opacity: 0.8,
												transform: [
													{
														translateY: subTitle
															? -5
															: -15
													}
												]
											}}
											name={icon}
											size={35}
										/>
									</View>
									{subTitle && (
										<Text
											style={{
												fontSize: 14,
												opacity: 0.5,
												paddingTop: 5
											}}>
											{subTitle}
										</Text>
									)}
								</View>
								<View
									style={{
										height: 1,
										backgroundColor: colors.grey
									}}
								/>
							</TouchableOpacity>
						);
					}
				)
			}
		</ScrollView>
	);
}

export default SettingsComponent;
