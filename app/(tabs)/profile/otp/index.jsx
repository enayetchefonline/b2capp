import {useLocalSearchParams, useRouter} from 'expo-router';
import {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import CustomPopUp from '../../../../components/ui/CustomPopUp';
import Colors from '../../../../constants/color';
import {sendOtpApi, verifyOtp} from '../../../../lib/api';

export default function OtpScreen() {
	const {user, method} = useLocalSearchParams();
	const userInfo = JSON.parse(user || '{}');
	const router = useRouter();
	const user_id = userInfo?.id;
	const selectedMethod = method || 'email';

	const [otp, setOtp] = useState(['', '', '', '']);
	const [popupVisible, setPopupVisible] = useState(false);
	const [popupMessage, setPopupMessage] = useState('');
	const [isSuccess, setIsSuccess] = useState(false);
	const [timer, setTimer] = useState(30);
	const [resendPopupVisible, setResendPopupVisible] = useState(false);

	const inputs = useRef([]);

	useEffect(() => {
		if (timer === 0) {
			setResendPopupVisible(true);
			return;
		}
		const countdown = setInterval(() => {
			setTimer((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(countdown);
	}, [timer]);

	const handleChange = (text, index) => {
		if (/^\d$/.test(text)) {
			const newOtp = [...otp];
			newOtp[index] = text;
			setOtp(newOtp);
			if (index < 3) inputs.current[index + 1].focus();
		} else if (text === '') {
			const newOtp = [...otp];
			newOtp[index] = '';
			setOtp(newOtp);
		}
	};

	const handleBackspace = (key, index) => {
		if (key === 'Backspace' && otp[index] === '' && index > 0) {
			inputs.current[index - 1].focus();
		}
	};

	const handleVerify = async () => {
		const code = otp.join('');
		if (code.length < 4) {
			setPopupMessage('Please enter the full 4-digit OTP.');
			setPopupVisible(true);
			return;
		}

		try {
			const response = await verifyOtp({user_id, otp: code});

			if (response?.status?.trim().toLowerCase() === 'success') {
				setPopupMessage('OTP verified successfully!');
				setIsSuccess(true);
			} else {
				setPopupMessage(response?.msg || 'The OTP you entered is incorrect.');
			}
		} catch (err) {
			console.error('Verify OTP ❌', err);
			setPopupMessage('Something went wrong. Please try again.');
		} finally {
			setPopupVisible(true);
		}
	};

	const handleResendOtp = async () => {
		try {
			const payload = {
				funId: 127,
				user_id,
			};

			if (selectedMethod === 'sms') {
				payload.mobile = userInfo.mobile_no;
			} else {
				payload.email = userInfo.email;
			}

			const response = await sendOtpApi(payload);

			if (response?.status?.trim().toLowerCase() === 'success') {
				setOtp(['', '', '', '']);
				setTimer(30);
				setResendPopupVisible(false);
				inputs.current[0]?.focus();
			} else {
				setResendPopupVisible(false);
				setPopupMessage(response?.msg || 'Failed to resend OTP.');
				setPopupVisible(true);
			}
		} catch (error) {
			console.error('Resend OTP ❌', error);
			setResendPopupVisible(false);
			setPopupMessage('Something went wrong while resending OTP.');
			setPopupVisible(true);
		}
	};

	const handleConfirmPopup = () => {
		setPopupVisible(false);
		if (isSuccess) {
			router.replace({
				pathname: '/profile/confirm-new-password',
				params: {user: JSON.stringify(userInfo)},
			});
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.heading}>Enter OTP</Text>
				<Text style={styles.subText}>We’ve sent a code to your {selectedMethod}</Text>

				<View style={styles.otpContainer}>
					{otp.map((digit, index) => (
						<TextInput
							key={index}
							ref={(ref) => (inputs.current[index] = ref)}
							style={styles.otpInput}
							value={digit}
							onChangeText={(text) => handleChange(text, index)}
							onKeyPress={({nativeEvent}) => handleBackspace(nativeEvent.key, index)}
							keyboardType="numeric"
							maxLength={1}
							placeholderTextColor={Colors.placeholder}
						/>
					))}
				</View>

				<TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
					<Text style={styles.verifyButtonText}>Verify</Text>
				</TouchableOpacity>

				<Text style={styles.timerText}>{timer > 0 ? `Resend OTP in ${timer}s` : ''}</Text>
			</View>

			{/* Success or Error Popup */}
			<CustomPopUp
				visible={popupVisible}
				title="OTP Verification"
				message={popupMessage}
				confirmText="OK"
				onConfirm={handleConfirmPopup}
				showCancel={false}
			/>

			{/* Resend OTP Popup */}
			<CustomPopUp
				visible={resendPopupVisible}
				title="Didn't receive the OTP?"
				message="Would you like to resend the code?"
				confirmText="Resend"
				cancelText="Cancel"
				onConfirm={handleResendOtp}
				onCancel={() => setResendPopupVisible(false)}
				showCancel={true}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.background,
		padding: 20,
	},
	content: {
		backgroundColor: Colors.white,
		padding: 24,
		borderRadius: 12,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 10,
		width: '100%',
		alignItems: 'center',
	},
	heading: {
		fontSize: 22,
		fontWeight: 'bold',
		color: Colors.text,
		marginBottom: 10,
	},
	subText: {
		fontSize: 14,
		color: Colors.text,
		marginBottom: 20,
		textAlign: 'center',
	},
	otpContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '80%',
		marginBottom: 20,
	},
	otpInput: {
		width: 50,
		height: 50,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 10,
		textAlign: 'center',
		fontSize: 20,
		backgroundColor: '#fff',
		color: Colors.text,
	},
	verifyButton: {
		backgroundColor: Colors.primary,
		paddingVertical: 14,
		paddingHorizontal: 40,
		borderRadius: 8,
	},
	verifyButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	timerText: {
		marginTop: 12,
		fontSize: 14,
		color: Colors.text,
	},
});
