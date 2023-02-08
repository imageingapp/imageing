import {
	Body,
	CustomUploader,
	DestinationNames,
	DestinationObject,
	HttpStatus,
	RequestMethod,
	StoredFile,
} from '@util/types';
import { ImageURISource } from 'react-native';
import * as mime from 'react-native-mime-types';

// eslint-disable-next-line import/prefer-default-export
export async function performHttpRequest({
	data,
	file,
	destination,
}: {
	data: CustomUploader | string | null;
	file: ImageURISource;
	destination: DestinationObject;
}): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();

		if (destination.name === DestinationNames.Custom) {
			// eslint-disable-next-line no-param-reassign
			data = data as CustomUploader;
			request.open(data.RequestMethod, data.RequestURL);

			if (data.Headers !== undefined) {
				// eslint-disable-next-line no-restricted-syntax
				for (const key in data.Headers) {
					// eslint-disable-next-line no-prototype-builtins
					if (data.Headers.hasOwnProperty(key)) {
						request.setRequestHeader(key, data.Headers[key]);
					}
				}
			}

			if (data.Body === Body.MultipartFormData) {
				const mimeType = mime.lookup(file.uri) || 'text/plain';
				const fileExtension = mime.extension(mimeType) || 'txt';
				const fileFormName = mimeType.split('/')[0];

				const formData = new FormData();
				formData.append(fileFormName, {
					uri: file.uri,
					type: mimeType,
					name: `imageing.${fileExtension}`,
				} as unknown as Blob);

				// if arguments are present, add them to the form data
				if (data.Arguments !== undefined) {
					// eslint-disable-next-line no-restricted-syntax
					for (const key in data.Arguments) {
						// eslint-disable-next-line no-prototype-builtins
						if (data.Arguments.hasOwnProperty(key)) {
							formData.append(key, data.Arguments[key]);
						}
					}
				}

				request.send(formData);
			} else {
				request.send();
			}
		} else {
			request.open(RequestMethod.POST, destination.url);

			const mimeType = mime.lookup(file.uri) || 'text/plain';
			const fileExtension = mime.extension(mimeType) || 'txt';
			const fileFormName = mimeType.split('/')[0];

			const formData = new FormData();
			switch (destination.name) {
				case DestinationNames.ImgBB: {
					// ImgBB
					formData.append(fileFormName, {
						uri: file.uri,
						type: mimeType,
						name: `imageing.${fileExtension}`,
					} as unknown as Blob);
					formData.append('key', data as string);
					break;
				}
				case DestinationNames.Imgur: {
					// Imgur
					request.setRequestHeader(
						'Authorization',
						`Client-ID 867afe9433c0a53`,
					);
					formData.append(fileFormName, {
						uri: file.uri,
						type: mimeType,
						name: `imageing.${fileExtension}`,
					} as unknown as Blob);
					break;
				}
				default:
					break;
			}
			request.send(formData);
		}

		request.onreadystatechange = () => {
			if (request.readyState === 4) {
				if (request.status === HttpStatus.OK) {
					resolve(request.response);
				} else {
					reject(request.status);
				}
			}
		};
	});
}

export async function deleteFileHttpRequest(file: StoredFile) {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();

		request.open(RequestMethod.DELETE, file.deleteEndpoint);

		request.onreadystatechange = () => {
			if (request.readyState === 4) {
				if (request.status === HttpStatus.OK) {
					resolve(request.response);
				} else {
					reject(request.status);
				}
			}
		};

		request.send();
	});
}
