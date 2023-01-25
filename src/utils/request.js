export default async function doRequest(
	url,
	method,
	formData,
	header,
	onload,
	onprogress,
	onerror
) {
	const uploadTask = new XMLHttpRequest();

	// Perform request
	uploadTask.open(method, url);
	if (header) {
		uploadTask.setRequestHeader(header.text, header.value);
	}

	const onloadoverride = () => onload(uploadTask);
	const onprogressoverride = (o) => onprogress(o, uploadTask);
	const onerroroverride = (e) => onerror(e, uploadTask);

	uploadTask.onload = onloadoverride;
	uploadTask.onerror = onerroroverride;
	uploadTask.ontimeout = onerroroverride;

	uploadTask.send(formData ?? undefined);

	if (uploadTask.upload) {
		uploadTask.upload.onprogress = onprogressoverride;
	}
}
