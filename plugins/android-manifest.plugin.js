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
		// Add the intent filter as a child to the first activity.
		config.modResults.manifest.application[0].activity[0].$[
			'android:launchMode'
		] = 'singleTask';
		config.modResults.manifest.application[0].activity[0].intentFilter = [
			{
				action: [
					{
						$: {
							'android:name': 'android.intent.action.SEND'
						}
					}
				],
				category: [
					{
						$: {
							'android:name': 'android.intent.category.DEFAULT'
						}
					}
				],
				data: [
					{
						$: {
							'android:mimeType': 'text/plain'
						}
					},
					{
						$: {
							'android:mimeType': 'image/*'
						}
					}
				]
			}
		];
		return config;
	});
};
