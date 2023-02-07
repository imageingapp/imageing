import {
	CustomUploader,
	DestinationType,
	RequestMethod,
	Body,
} from '@util/types';
import Toast from 'react-native-simple-toast';

// eslint-disable-next-line import/prefer-default-export
export function validateCustomUploader(
	data: CustomUploader,
	showToast?: boolean,
): boolean {
	// validate that data is an object and not empty or anything else
	if (
		typeof data !== 'object' ||
		data === null ||
		Object.keys(data).length === 0
	) {
		if (showToast) {
			Toast.show('File does not contain data', Toast.LONG);
		}
		return false;
	}

	// validate that required properties are present and are of the correct type
	if (
		typeof data.Version !== 'string' ||
		typeof data.DestinationType !== 'string' ||
		typeof data.RequestMethod !== 'string' ||
		typeof data.RequestURL !== 'string' ||
		typeof data.Body !== 'string' ||
		typeof data.URL !== 'string'
	) {
		if (showToast) {
			Toast.show('File does not contain required properties', Toast.LONG);
		}
		return false;
	}

	// validate that DestinationType is a valid value
	// it can contain multiple values, so we need to split it
	const destinationTypes = data.DestinationType.split(',');
	// eslint-disable-next-line consistent-return
	destinationTypes.forEach(type => {
		if (
			!Object.values(DestinationType).includes(
				type.trim() as DestinationType,
			)
		) {
			if (showToast) {
				Toast.show('DestinationType is not a valid value', Toast.LONG);
			}
			return false;
		}
	});
	// validate that RequestMethod is a valid value
	const requestMethods = Object.values(RequestMethod);
	if (!requestMethods.includes(data.RequestMethod)) {
		if (showToast) {
			Toast.show('RequestMethod is not a valid value', Toast.LONG);
		}
		return false;
	}

	// validate that Body is a valid value
	const bodyTypes = Object.values(Body);
	if (!bodyTypes.includes(data.Body)) {
		if (showToast) {
			Toast.show('Body is not a valid value', Toast.LONG);
		}
		return false;
	}

	// if body is multipart form data, validate that file form name is present
	if (
		data.Body === Body.MultipartFormData &&
		data.FileFormName === undefined
	) {
		if (showToast) {
			Toast.show(
				'FileFormName is required for multipart form data',
				Toast.LONG,
			);
		}
		return false;
	}

	// validate that optional properties are present and are of the correct type
	if (data.Name !== undefined && typeof data.Name !== 'string') {
		if (showToast) {
			Toast.show('Name is not a string', Toast.LONG);
		}
		return false;
	}

	if (data.Headers !== undefined && typeof data.Headers !== 'object') {
		if (showToast) {
			Toast.show('Headers is not an object', Toast.LONG);
		}
		return false;
	}

	if (data.Arguments !== undefined && typeof data.Arguments !== 'object') {
		if (showToast) {
			Toast.show('Arguments is not an object', Toast.LONG);
		}
		return false;
	}

	if (
		data.FileFormName !== undefined &&
		typeof data.FileFormName !== 'string'
	) {
		if (showToast) {
			Toast.show('FileFormName is not a string', Toast.LONG);
		}
		return false;
	}

	if (
		data.ThumbnailURL !== undefined &&
		typeof data.ThumbnailURL !== 'string'
	) {
		if (showToast) {
			Toast.show('ThumbnailURL is not a string', Toast.LONG);
		}
		return false;
	}

	if (
		data.DeletionURL !== undefined &&
		typeof data.DeletionURL !== 'string'
	) {
		if (showToast) {
			Toast.show('DeletionURL is not a string', Toast.LONG);
		}
		return false;
	}

	if (
		data.ErrorMessage !== undefined &&
		typeof data.ErrorMessage !== 'string'
	) {
		if (showToast) {
			Toast.show('ErrorMessage is not a string', Toast.LONG);
		}
		return false;
	}

	return true;
}
