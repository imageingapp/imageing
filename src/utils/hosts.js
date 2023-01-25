/* eslint-disable global-require */
export default [
	{
		name: 'ImgBB',
		image: require('../../assets/ImgBB.png'),
		settings: { apiKey: '' },
		getUrl: (data) => data.data.url,
		getDeleteUrl: (data) => data.data.delete_url
	},
	{
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
		getDeleteUrl: (data) => data.deletion_url
	},
	{
		name: 'Imgur',
		image: require('../../assets/ImgBB.png'),
		settings: { apiClientId: '' },
		getUrl: (data) => data.data.link,
		getDeleteUrl: (data) => data.data.deletehash
	}
];
