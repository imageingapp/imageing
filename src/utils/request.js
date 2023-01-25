export default async function doRequest(
	url,
	method,
	formData,
	header,
	onload,
	onprogress
) {
	const uploadTask = new XMLHttpRequest();

	// Perform request
	uploadTask.open(method, url);
	if (header) {
		uploadTask.setRequestHeader(header.text, header.value);
	}

	const onloadoverride = () => onload(uploadTask);
	const onprogressoverride = (o) => onprogress(o, uploadTask);

	uploadTask.onload = onloadoverride;
	// eslint-disable-next-line no-console
	uploadTask.onerror = (e) => console.log('error', e);
	// eslint-disable-next-line no-console
	uploadTask.ontimeout = (e) => console.log('timeout', e);

	uploadTask.send(formData ?? undefined);

	if (uploadTask.upload) {
		uploadTask.upload.onprogress = onprogressoverride;
	}
}
