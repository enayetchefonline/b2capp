import {useRouter} from 'expo-router';
import {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import CustomPopUp from '../../../../components/ui/CustomPopUp';
import Colors from '../../../../constants/color';
import {verifyEmail} from '../../../../lib/api';

export default function ForgetPasswordScreen() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [popupVisible, setPopupVisible] = useState(false);
	const [popupMessage, setPopupMessage] = useState('');

	const handleVerifyEmail = async () => {
		if (!email.trim()) {
			setPopupMessage('Please enter your email.');
			setPopupVisible(true);
			return;
		}

		setLoading(true);
		try {
			const response = await verifyEmail({email});

			if (response?.status === 'success') {
				// ✅ Go next if user_status is 1
				if (response?.user_status === '1') {
					router.replace({
						pathname: '/profile/send-verification-code',
						params: {
							user: JSON.stringify(response), // stringify the object to pass as a param
						},
					});
				} else {
					setPopupMessage(response?.msg || 'Account not active.');
					setPopupVisible(true);
				}
			} else {
				// ❌ Show error message popup
				setPopupMessage(response?.msg || 'Email not recognized.');
				setPopupVisible(true);
			}
		} catch (error) {
			console.error('Forget password error:', error);
			setPopupMessage('Something went wrong. Please try again.');
			setPopupVisible(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.box}>
				<Text style={styles.title}>Forgot Password</Text>

				<TextInput
					style={styles.input}
					placeholder="Enter your email"
					placeholderTextColor={Colors.placeholder}
					keyboardType="email-address"
					autoCapitalize="none"
					value={email}
					onChangeText={setEmail}
				/>

				<TouchableOpacity style={styles.button} onPress={handleVerifyEmail} disabled={loading}>
					<Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify Email'}</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => router.back()}>
					<Text style={styles.backText}>Back to Login</Text>
				</TouchableOpacity>
			</View>

			<CustomPopUp
				visible={popupVisible}
				title="Verification Result"
				message={popupMessage}
				confirmText="OK"
				showCancel={false}
				maskClosable={false}
				onConfirm={() => setPopupVisible(false)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	box: {
		width: '100%',
		backgroundColor: Colors.white,
		borderRadius: 8,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: Colors.text,
		marginBottom: 20,
		textAlign: 'center',
	},
	input: {
		height: 48,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 6,
		paddingHorizontal: 12,
		marginBottom: 16,
		color: Colors.text,
	},
	button: {
		backgroundColor: Colors.primary,
		paddingVertical: 14,
		borderRadius: 6,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
	},
	backText: {
		color: Colors.primary,
		marginTop: 16,
		textAlign: 'center',
	},
});
