export interface DestinationObject {
	name: string;
	url?: string;
	settings?: {
		apiKey?: string;
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

export enum DestinationType {
	None = 'None',
	ImageUploader = 'ImageUploader',
	TextUploader = 'TextUploader',
	FileUploader = 'FileUploader',
	URLShortener = 'URLShortener',
	URLSharingService = 'URLSharingService',
}

export enum RequestMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	PATCH = 'PATCH',
	DELETE = 'DELETE',
}

export enum Body {
	None = 'None',
	MultipartFormData = 'MultipartFormData',
	FormURLEncoded = 'FormURLEncoded',
	JSON = 'JSON',
	XML = 'XML',
	Binary = 'Binary',
}

export interface CustomUploader {
	Version: string;
	Name?: string;
	DestinationType: DestinationType;
	RequestMethod: RequestMethod;
	RequestURL: string;
	Parameters: {
		[key: string]: string;
	};
	Headers?: {
		[key: string]: string;
	};
	Body: Body;
	Arguments?: {
		[key: string]: string;
	};
	FileFormName?: string;
	URL: string;
	ThumbnailURL?: string;
	DeletionURL?: string;
	ErrorMessage?: string;
}

export enum HttpStatus {
	OK = 200,
	Created = 201,
	Accepted = 202,
	NoContent = 204,
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
	InternalServerError = 500,
	NotImplemented = 501,
	BadGateway = 502,
	ServiceUnavailable = 503,
}

export enum SettingsOptions {
	Theme = 'theme',
	ImgBBApiKey = 'imgBBApiKey',
	MultiUpload = 'multiUpload',
	ImageZoomAndDrag = 'imageZoomAndDrag',
	CurrentUploaderPath = 'currentUploaderPath',
	ClearImageGallery = 'clearImageGallery',
}

export interface Settings {
	theme: 'light' | 'dark' | 'auto';
	ImgBBApiKey: string;
	[SettingsOptions.MultiUpload]: boolean;
	[SettingsOptions.ImageZoomAndDrag]: boolean;
	currentUploaderPath: string;
}

export interface DialogOptions {
	title: string;
	content: string;
	rightButtonText?: string;
	leftButtonText?: string;
	showTextInput?: boolean;
	textInputPlaceholder?: string;
	context: 'showAbout' | 'deleteUploader' | SettingsOptions;
}
