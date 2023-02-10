import { Platform } from 'react-native';
import SpInAppUpdates, {
	IAUUpdateKind,
	StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import { log } from '@util/log';

export default function checkUpdate() {
	const inAppUpdates = new SpInAppUpdates(
		false, // isDebug
	);
	// curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
	inAppUpdates
		.checkNeedsUpdate()
		.then(result => {
			if (result.shouldUpdate) {
				log.info('Update needed');
				let updateOptions: StartUpdateOptions = {};
				if (Platform.OS === 'android') {
					// android only, on iOS the user will be promped to go to your app store page
					updateOptions = {
						updateType: IAUUpdateKind.FLEXIBLE,
					};
				}
				inAppUpdates
					.startUpdate(updateOptions)
					.then(() => {
						log.info('Update started');
					})
					.catch(err => log.error(err));
			} else {
				log.info('No update needed');
			}
		})
		.catch(err => log.error(err));
}
