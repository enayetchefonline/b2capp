import {
	ActivityIndicator,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import Colors from '../../constants/color';

export default function CustomPopUp({
	visible,
	title,
	message,
	children,
	onConfirm,
	onCancel,
	confirmText = 'OK',
	cancelText = 'Cancel',
	showCancel = false,
	maskClosable = true,
	containerStyle,
	titleStyle,
	messageStyle,
	buttonContainerStyle,
	confirmButtonStyle,
	cancelButtonStyle,
	confirmTextStyle,
	cancelTextStyle,
	confirmLoading,
	disableConfirm = false,
}) {
	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
			<View style={styles.wrapper}>
				{/* Dismiss when clicking outside */}
				<TouchableWithoutFeedback onPress={maskClosable ? onCancel : undefined}>
					<View style={styles.backdrop} />
				</TouchableWithoutFeedback>

				{/* Popup Card */}
				<View style={styles.centered}>
					<View style={[styles.card, containerStyle]}>
						{title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : null}
						{message ? <Text style={[styles.message, messageStyle]}>{message}</Text> : null}

						{/* Optional custom content */}
						{children}

						<View style={[styles.buttons, buttonContainerStyle]}>
							{showCancel && (
								<TouchableOpacity style={[styles.button, styles.cancelBtn, cancelButtonStyle]} onPress={onCancel}>
									<Text style={[styles.buttonText, cancelTextStyle]}>{cancelText}</Text>
								</TouchableOpacity>
							)}

							<TouchableOpacity
								style={[
									styles.button,
									styles.confirmBtn,
									confirmButtonStyle,
									(confirmLoading || disableConfirm) && {opacity: 0.6},
								]}
								onPress={onConfirm}
								disabled={!!confirmLoading || !!disableConfirm}
							>
								{confirmLoading ? (
									<View style={{flexDirection: 'row', alignItems: 'center'}}>
										<ActivityIndicator size="small" color="#fff" style={{marginRight: 6}} />
										<Text style={[styles.buttonText, confirmTextStyle]}>Submitting...</Text>
									</View>
								) : (
									<Text style={[styles.buttonText, confirmTextStyle]}>{confirmText}</Text>
								)}
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	backdrop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#00000055',
	},
	centered: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	card: {
		width: '80%',
		backgroundColor: Colors.white,
		borderRadius: 8,
		padding: 20,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.text,
		marginBottom: 8,
		textAlign: 'center',
	},
	message: {
		fontSize: 14,
		color: Colors.text,
		marginBottom: 20,
		textAlign: 'center',
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	button: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 4,
		marginLeft: 8,
	},
	confirmBtn: {
		backgroundColor: Colors.primary,
	},
	cancelBtn: {
		backgroundColor: '#4F372D',
	},
	buttonText: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.white,
	},
});
