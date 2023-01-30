/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-shadow */
/* eslint-disable arrow-body-style */
/* eslint-disable no-param-reassign */
// expo plugin that adds android manifest entries
// https://docs.expo.io/versions/latest/config/app/#androidmanifest

/*
add this to android manifest:

 <intent-filter>
    <action android:name="android.intent.action.SEND" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:mimeType="text/plain" />
    <data android:mimeType="image/*" />
  </intent-filter>
*/
const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function androiManifestPlugin(config) {
	return withAndroidManifest(config, (config) => {
		if (config.modResults) {
			// Append the activity if it exists, otherwise create it.
			config.modResults.intentFilters = [
				...(config.modResults.intentFilters || []),
				{
					action: 'android.intent.action.SEND',
					category: 'android.intent.category.DEFAULT',
					data: [
						{
							mimeType: 'text/plain'
						},
						{
							mimeType: 'image/*'
						}
					]
				}
			];
		}
		return config;
	});
};
