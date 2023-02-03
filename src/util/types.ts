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
