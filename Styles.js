import { Dimensions, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 15,
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%'
	},
	preview: {
		height: '90%',
		width: '95%',
		resizeMode: 'center'
	},
	buttonContainer: {
		flex: 2,
		flexDirection: 'row'
	},
	button: {
		marginHorizontal: 5
	},
	buttonModal: {
		position: 'absolute',
		bottom: '10%'
	},
	buttonBig: {
		marginHorizontal: 5
	},
	fileWrap: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%'
	},
	configWrap: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%'
	},
	hosts: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%'
	},
	generalSettings: {
		flex: 3,
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%'
	},
	about: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%'
	},
	aboutWrapper: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%'
	},
	aboutModal: {
		justifyContent: 'flex-end',
		margin: 0
	},
	hostsButton: {
		width: '50%',
		height: 50,
		backgroundColor: '#FFF',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#444'
	},
	hostsButtonText: {
		color: '#444',
		textAlign: 'left'
	},
	hostsDropdown: {
		backgroundColor: '#EFEFEF'
	},
	hostsRow: {
		backgroundColor: '#EFEFEF',
		borderBottomColor: '#C5C5C5'
	},
	hostsRowText: {
		color: '#444',
		textAlign: 'left'
	},
	content: {
		backgroundColor: '#111',
		padding: 22,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		borderColor: 'rgba(0, 0, 0, 0.1)'
	},
	contentTitle: {
		fontSize: 20,
		marginBottom: 12
	},
	contentLogin: {
		backgroundColor: '#111',
		padding: 22,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		borderColor: 'rgba(0, 0, 0, 0.1)'
	},
	update: {
		color: '#00ffff',
		textDecorationLine: 'underline'
	},
	progress: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '50%'
	},
	progressContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: '50%'
	},
	galleryImage: {
		height: 80,
		width: 80,
		resizeMode: 'center'
	},
	imagesWrap: {
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%'
	},
	imageModal: {
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
		resizeMode: 'contain',
		justifyContent: 'center',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
