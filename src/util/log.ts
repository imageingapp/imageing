import { logger, fileAsyncTransport } from 'react-native-logs';
import * as FileSystem from 'expo-file-system';
import { aboutContent } from '@util/constants';
import Share from 'react-native-share';
import Toast from 'react-native-simple-toast';

const config = {
	severity: 'debug',
	transport: fileAsyncTransport,
	transportOptions: {
		FS: FileSystem,
		fileName: 'imageing-debug.log',
	},
};

export const log = logger.createLogger(config);

export function shareDebugLog() {
	const logFile = `${FileSystem.documentDirectory}imageing-debug.log`;
	FileSystem.readAsStringAsync(logFile)
		.then(x => {
			if (x) {
				Share.open({
					message: aboutContent,
					url: logFile,
				}).catch(err => log.error(err));
			} else {
				Toast.show('No debug log found', Toast.LONG);
			}
		})
		.catch(err => log.error(err));
}

export function logLastModified(setLastModified) {
	const logFile = `${FileSystem.documentDirectory}imageing-debug.log`;
	FileSystem.getInfoAsync(logFile)
		.then(x => {
			if (x) {
				const lastModified = new Date(
					x.modificationTime * 1000,
				).toTimeString();
				setLastModified(`Last modified: ${lastModified}`);
			}
		})
		.catch(err => log.error(err));
}
