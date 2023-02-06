export interface Destination {
	name: string;
	url: string;
	settings: {
		apiKey: string;
	};
	getUrl: (data: { url: string }) => string;
	getDeleteUrl: (data: { deletion_url: string }) => string;
	deleteMethod: string;
}

export interface StoredImage {
	localUrl: string;
	url: string;
	deleteUrl: string;
	date: string;
	manual: boolean;
}

export enum DestinationNames {
	ImgBB = 'ImgBB',
	Imgur = 'Imgur',
	Custom = 'Custom',
}

export enum DestinationUrls {
	ImgBB = 'https://api.imgbb.com/1/upload',
	Imgur = 'https://api.imgur.com/3/image',
}

export enum HttpDeleteMethods {
	DELETE = 'DELETE',
	GET = 'GET',
	URL = 'URL',
}

export enum Settings {
	MultiUpload,
	ImageZoomAndDrag,
}
