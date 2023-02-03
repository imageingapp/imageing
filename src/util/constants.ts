import { createContext } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

export const ThemeContext = createContext(null);

export const Destinations = {
	ImgBB: {
		name: 'ImgBB',
		url: 'https://api.imgbb.com/1/upload',
		settings: { apiKey: '' },
		getUrl: data => data.data.url,
		getDeleteUrl: data => data.data.delete_url,
		deleteMethod: 'URL',
	},
	Imgur: {
		name: 'Imgur',
		url: 'https://api.imgur.com/3/image',
		settings: { apiClientId: '' },
		getUrl: data => data.data.link,
		getDeleteUrl: data =>
			`https://api.imgur.com/3/image/${data.data.deletehash}`,
		deleteMethod: 'DELETE',
		header: { text: 'Authorization', value: 'Client-ID 867afe9433c0a53' },
	},
	SXCU: {
		name: 'SXCU',
		add: '(Self-Hosted)',
		settings: {
			apiUrl: '',
			apiToken: '',
			apiEndpoint: '',
			apiFormName: '',
		},
		getUrl: data => data.url,
		getDeleteUrl: data => data.deletion_url,
		deleteMethod: 'GET',
	},
};

export const emptySettings = {
	// ImgBB
	apiKey: '',
	// SXCU
	apiUrl: '',
	apiToken: '',
	apiEndpoint: '',
	apiFormName: '',
	// Other
	'Multi-Upload': false,
	'Image Zoom and Drag': false,
};

export const Styles = StyleSheet.create({
	container: {
		flex: 15,
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%',
	},
	preview: {
		height: '90%',
		width: '95%',
		resizeMode: 'cover',
		borderRadius: 15,
	},
	buttonContainer: {
		flex: 2,
		flexDirection: 'row',
	},
	buttonContainer2: {
		flexDirection: 'row',
	},
	button: {
		marginHorizontal: 5,
	},
	buttonModal: {
		position: 'absolute',
		bottom: '10%',
	},
	buttonBig: {
		marginHorizontal: 5,
	},
	fileWrap: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%',
	},
	configWrap: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%',
	},
	hosts: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%',
	},
	generalSettings: {
		flex: 3,
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
	},
	about: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
	},
	aboutWrapper: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%',
	},
	aboutModal: {
		justifyContent: 'flex-end',
		margin: 0,
	},
	hostsButton: {
		width: '50%',
		height: 50,
		backgroundColor: '#FFF',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#444',
	},
	hostsButtonText: {
		color: '#444',
		textAlign: 'left',
	},
	hostsDropdown: {
		backgroundColor: '#EFEFEF',
	},
	hostsRow: {
		backgroundColor: '#EFEFEF',
		borderBottomColor: '#C5C5C5',
	},
	hostsRowText: {
		color: '#444',
		textAlign: 'left',
	},
	content: {
		backgroundColor: '#111',
		padding: 22,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		borderColor: 'rgba(0, 0, 0, 0.1)',
	},
	contentTitle: {
		fontSize: 20,
		marginBottom: 12,
	},
	contentLogin: {
		backgroundColor: '#111',
		padding: 22,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		borderColor: 'rgba(0, 0, 0, 0.1)',
	},
	update: {
		color: '#00ffff',
		textDecorationLine: 'underline',
	},
	progress: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '50%',
	},
	progressContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: '50%',
	},
	galleryImage: {
		height: 80,
		width: 80,
		resizeMode: 'center',
	},
	imagesWrap: {
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%',
	},
	imageModal: {
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
		resizeMode: 'contain',
		justifyContent: 'center',
		flexDirection: 'column',
		alignItems: 'center',
	},
	modal: {
		flex: 1,
		alignItems: 'center',
		padding: 100,
	},
	text: {
		color: '#3f2949',
		marginTop: 10,
	},
	buttonContainerGallery: {
		flex: 2,
		flexDirection: 'row',
		padding: 50,
	},
	dropdownButton: {
		width: '80%',
		height: 50,
		backgroundColor: '#FFF',
		paddingHorizontal: 0,
		borderWidth: 1,
		borderRadius: 8,
		borderColor: '#444',
	},
	dropdownButtonText: {
		color: '#444',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 24,
		marginHorizontal: 12,
	},
	dropdown: {
		backgroundColor: 'slategray',
	},
	dropdownRow: {
		backgroundColor: 'slategray',
		borderBottomColor: '#444',
		height: 50,
	},
	dropdownRowText: {
		color: '#F1F1F1',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 24,
		marginHorizontal: 12,
	},
	textInput: {
		width: '80%',
		maxWidth: '80%',
		height: 50,
	},
	buttonContainerSettings: {
		flexDirection: 'row',
	},
	dropdownChild: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 18,
	},
	dropdownImage: {
		width: 45,
		height: 45,
		resizeMode: 'cover',
	},
	dropdownRowChild: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: 18,
	},
	dropdownRowImage: {
		width: 45,
		height: 45,
		resizeMode: 'cover',
	},
});
