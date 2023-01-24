import { useState } from 'react';
import { SettingsComponent } from '../../components/SettingsComponent';

import Dialog from 'react-native-dialog';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingScreen() {
	const [host, setHost] = useState('Loading');
	const [multiUpload, setMultiUpload] = useState('Disabled');
	const [zoomAndDrag, setZoomAndDrag] = useState('Disabled');
	const [bDialog, setDialog] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogDescription, setDialogDescription] = useState('');
	const [dialogButton, setDialogButton] = useState('Enable');

	const onMultiUpload = () => {
		// Alert
		setDialog(true);
		setDialogTitle(
			`${multiUpload === 'Enabled' ? 'Disable' : 'Enable'} Multi-Upload`
		);
		setDialogDescription(
			`Do you want to ${
				multiUpload === 'Enabled' ? 'disable' : 'enable'
			} the multi-upload feature?`
		);
		setDialogButton(multiUpload === 'Enabled' ? 'Disable' : 'Enable');
	};

	const onZoomAndDrag = () => {
		// Alert
		setDialog(true);
		setDialogTitle(
			`${
				zoomAndDrag === 'Enabled' ? 'Disable' : 'Enable'
			} Image Zoom and Drag`
		);
		setDialogDescription(
			`Do you want to ${
				zoomAndDrag === 'Enabled' ? 'disable' : 'enable'
			} the image zoom and drag feature?`
		);
		setDialogButton(zoomAndDrag === 'Enabled' ? 'Disable' : 'Enable');
	};

	const handlePush = () => {
		if (dialogTitle.includes('Multi-Upload')) {
			setMultiUpload(multiUpload === 'Enabled' ? 'Disabled' : 'Enabled');
			setDialog(false);
		} else if (dialogTitle.includes('Image Zoom and Drag')) {
			setZoomAndDrag(zoomAndDrag === 'Enabled' ? 'Disabled' : 'Enabled');
			setDialog(false);
		}
	};
	const handleCancel = () => {
		setDialog(false);
	};

	const settingsOptions = [
		{ title: 'Host', subTitle: host, onPress: () => {} }, // Navigate to new Screen just like this
		{
			title: 'Multi-Upload',
			subTitle: multiUpload,
			onPress: onMultiUpload
		}, // Modal which asks for Enabled/Disabled
		{
			title: 'Image Zoom and Drag',
			subTitle: zoomAndDrag,
			onPress: onZoomAndDrag
		}, // Modal which asks for Enabled/Disabled
		{ title: 'Import Settings', subTitle: null, onPress: () => {} }, // Lets you import Settings via QR Code or file
		{ title: 'Export Settings', subTitle: null, onPress: () => {} }, // Saves Settings in a QR Code which you can share
		{ title: 'Clear Gallery', subTitle: null, onPress: () => {} }, // Clears the Gallery
		{ title: 'Credits', subTitle: null, onPress: () => {} }, // Modal with Credits that show who worked on Imageing
		{ title: 'About Imageing', subTitle: null, onPress: () => {} } // Modal with information about Imageing like Version, ...
	];

	return (
		<SafeAreaView>
			<Dialog.Container visible={bDialog}>
				<Dialog.Title>{dialogTitle}</Dialog.Title>
				<Dialog.Description>{dialogDescription}</Dialog.Description>
				<Dialog.Button
					label='Cancel'
					onPress={handleCancel}
				/>
				<Dialog.Button
					label={dialogButton}
					onPress={handlePush}
				/>
			</Dialog.Container>
			<SettingsComponent settingsOptions={settingsOptions} />
		</SafeAreaView>
	);
}
