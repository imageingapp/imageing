/* eslint-disable global-require */
export default {
	ImgBB: {
		name: 'ImgBB',
		url: 'https://api.imgbb.com/1/upload',
		image: require('../../assets/ImgBB.png'),
		settings: { apiKey: '' },
		getUrl: (data) => data.data.url,
		getDeleteUrl: (data) => data.data.delete_url,
		deleteMethod: 'URL'
	},
	Imgur: {
		name: 'Imgur',
		url: 'https://api.imgur.com/3/image',
		image: require('../../assets/ImgBB.png'),
		settings: { apiClientId: '' },
		getUrl: (data) => data.data.link,
		getDeleteUrl: (data) =>
			`https://api.imgur.com/3/image/${data.data.deletehash}`,
		deleteMethod: 'DELETE',
		header: { text: 'Authorization', value: 'Client-ID 867afe9433c0a53' }
	},
	SXCU: {
		name: 'SXCU',
		add: '(Self-Hosted)',
		image: require('../../assets/SXCU.png'),
		settings: {
			apiUrl: '',
			apiToken: '',
			apiEndpoint: '',
			apiFormName: ''
		},
		getUrl: (data) => data.url,
		getDeleteUrl: (data) => data.deletion_url,
		deleteMethod: 'GET'
	}
};
