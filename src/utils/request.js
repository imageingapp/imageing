export default async function doRequest({
	url,
	method,
	formData,
	header,
	onLoad,
	onProgress,
	onError
}) {
	return new Promise((resolve, reject) => {
		const uploadTask = new XMLHttpRequest();

		// Perform request
		uploadTask.open(method, url);
		if (header) {
			uploadTask.setRequestHeader(header.text, header.value);
		}

		const onloadoverride = () =>
			onLoad({ task: uploadTask, res: resolve, rej: reject });
		const onprogressoverride = (o) =>
			onProgress({
				data: o,
				task: uploadTask,
				res: resolve,
				rej: reject
			});
		const onerroroverride = (e) =>
			onError({ data: e, task: uploadTask, res: resolve, rej: reject });

		uploadTask.onload = onloadoverride;
		uploadTask.onerror = onerroroverride;
		uploadTask.ontimeout = onerroroverride;

		uploadTask.send(formData ?? undefined);

		if (uploadTask.upload) {
			uploadTask.upload.onprogress = onprogressoverride;
		}
	});
}
