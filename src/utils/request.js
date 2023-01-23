import { getHost } from './settings';

export async function doRequest(
	url,
	method,
	formData,
	header,
	onload,
	onprogress
) {
	const uploadTask = new XMLHttpRequest();
	// Get Host
	const host = await getHost();

	// Perform request
	uploadTask.open(method, url);
	if (header) {
		uploadTask.setRequestHeader(header.text, header.value);
	}

	const onloadoverride = () => onload(uploadTask);
	const onprogressoverride = (o) => onprogress(o, uploadTask);

	uploadTask.onload = onloadoverride;
	uploadTask.onerror = (e) => console.log('error', e);
	uploadTask.ontimeout = (e) => console.log('timeout', e);

	uploadTask.send(formData ?? undefined);

	if (uploadTask.upload) {
		uploadTask.upload.onprogress = onprogressoverride;
	}
}
