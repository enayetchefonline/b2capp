import {useEffect, useState} from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from '../../../../components/ui/CustomButton';
import CustomPopUp from '../../../../components/ui/CustomPopUp';
import Colors from '../../../../constants/color';
import {userEditProfileApi} from '../../../../lib/api';
import {setUser} from '../../../../store/slices/authSlice';

const TITLE_OPTIONS = [
	{label: 'Mr', value: 'Mr'},
	{label: 'Mrs', value: 'Mrs'},
	{label: 'Ms', value: 'Ms'},
	{label: 'Dr', value: 'Dr'},
];

export default function EditProfileScreen() {
	const [title, setTitle] = useState('');
	const [showTitleSheet, setShowTitleSheet] = useState(false);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [telephone, setTelephone] = useState('');
	const [address1, setAddress1] = useState('');
	const [address2, setAddress2] = useState('');
	const [town, setTown] = useState('');
	const [city, setCity] = useState('');
	const [country, setCountry] = useState('');
	const [dob, setDob] = useState('');
	const [anniversary, setAnniversary] = useState('');
	const [dobPickerVisible, setDobPickerVisible] = useState(false);
	const [doaPickerVisible, setDoaPickerVisible] = useState(false);
	const [postcode, setPostcode] = useState('');

	const [saving, setSaving] = useState(false);
	const [popupVisible, setPopupVisible] = useState(false);
	const [popupTitle, setPopupTitle] = useState('');
	const [popupMessage, setPopupMessage] = useState('');

	const dispatch = useDispatch();
	const authUser = useSelector((state) => state.auth.user);
	const userId = authUser?.userid;

	useEffect(() => {
		if (authUser) {
			setTitle(authUser.title || '');
			setFirstName(authUser.first_name || '');
			setLastName(authUser.last_name || '');
			setEmail(authUser.email || '');
			setPhone(authUser.mobile_no || '');
			setTelephone(authUser.telephone_no || '');
			setAddress1(authUser.address1 || '');
			setAddress2(authUser.address2 || '');
			setTown(authUser.town || '');
			setCity(authUser.city || '');
			setCountry(authUser.country || '');
			setDob(authUser.dob_date || authUser.date_of_birth || '');
			setAnniversary(authUser.doa || authUser.date_of_anniversery || '');
			setPostcode(authUser.postcode || '');
		}
	}, [authUser]);

	const handleSave = async () => {
		setSaving(true);
		try {
			const payload = {
				userid: userId,
				title: title,
				first_name: firstName,
				last_name: lastName,
				email: email,
				mobile_no: phone,
				telephone_no: telephone,
				address1: address1,
				address2: address2,
				city: city || town,
				country: country,
				postcode: postcode,
				dob_date: dob,
				doa: anniversary,
			};

			const response = await userEditProfileApi(payload);

			if (response?.status === 'ok' || response?.status === 'Success' || response?.success) {
				dispatch(setUser({user: response?.UserDetails}));
				setPopupTitle('Profile Updated');
				setPopupMessage(response?.msg || 'Your changes have been saved successfully.');
				setPopupVisible(true);
			} else {
				setPopupTitle('Update Failed');
				setPopupMessage(response?.msg || 'Something went wrong!');
				setPopupVisible(true);
			}
		} catch (_error) {
			alert('Failed to update profile. Please try again.');
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<View style={{flex: 1}}>
				<KeyboardAvoidingView
					style={{flex: 1}}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
				>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
							<View style={styles.formContainer}>
								{/* Title Bottom Sheet Selector */}
								<View style={styles.field}>
									<Text style={styles.label}>Title</Text>
									<TouchableOpacity
										activeOpacity={0.7}
										style={styles.sheetInput}
										onPress={() => setShowTitleSheet(true)}
									>
										<Text style={{color: title ? Colors.text : '#aaa'}}>
											{TITLE_OPTIONS.find((opt) => opt.value === title)?.label || 'Select Title'}
										</Text>
									</TouchableOpacity>
								</View>

								{/* First & Last Name */}
								<View style={styles.row}>
									<View style={[styles.field, styles.half]}>
										<Text style={styles.label}>First Name</Text>
										<TextInput
											style={styles.input}
											placeholder="First name"
											value={firstName}
											onChangeText={setFirstName}
											placeholderTextColor={Colors.placeholder}
										/>
									</View>
									<View style={[styles.field, styles.half]}>
										<Text style={styles.label}>Last Name</Text>
										<TextInput
											style={styles.input}
											placeholder="Last name"
											value={lastName}
											onChangeText={setLastName}
											placeholderTextColor={Colors.placeholder}
										/>
									</View>
								</View>

								{/* Email */}
								<View style={styles.field}>
									<Text style={styles.label}>Email</Text>
									<TextInput
										style={styles.input}
										placeholder="you@example.com"
										keyboardType="email-address"
										autoCapitalize="none"
										value={email}
										onChangeText={setEmail}
										editable={false}
										placeholderTextColor={Colors.placeholder}
									/>
								</View>

								{/* Phone & Telephone */}
								<View style={styles.row}>
									<View style={[styles.field, styles.half]}>
										<Text style={styles.label}>Phone</Text>
										<TextInput
											style={styles.input}
											placeholder="Mobile number"
											keyboardType="phone-pad"
											value={phone}
											onChangeText={setPhone}
											editable={false}
											placeholderTextColor={Colors.placeholder}
										/>
									</View>
									<View style={[styles.field, styles.half]}>
										<Text style={styles.label}>Telephone</Text>
										<TextInput
											style={styles.input}
											placeholder="Landline"
											keyboardType="phone-pad"
											value={telephone}
											onChangeText={setTelephone}
											placeholderTextColor={Colors.placeholder}
										/>
									</View>
								</View>

								{/* DOB Picker */}
								<View style={styles.field}>
									<Text style={styles.label}>Date of Birth (DOB)</Text>
									<Pressable onPress={() => setDobPickerVisible(true)}>
										<TextInput
											style={styles.input}
											placeholder="DD/MM/YYYY"
											value={dob}
											editable={false}
											pointerEvents="none"
											placeholderTextColor={Colors.placeholder}
										/>
									</Pressable>
								</View>

								{/* Anniversary Picker */}
								<View style={styles.field}>
									<Text style={styles.label}>Anniversary Date (DOA)</Text>
									<Pressable onPress={() => setDoaPickerVisible(true)}>
										<TextInput
											style={styles.input}
											placeholder="DD/MM/YYYY"
											value={anniversary}
											editable={false}
											pointerEvents="none"
											placeholderTextColor={Colors.placeholder}
										/>
									</Pressable>
								</View>

								{/* Address Lines */}
								<View style={styles.field}>
									<Text style={styles.label}>Address Line 1</Text>
									<TextInput
										style={styles.input}
										placeholder="Street address, P.O. box, etc."
										value={address1}
										onChangeText={setAddress1}
										placeholderTextColor={Colors.placeholder}
									/>
								</View>
								<View style={styles.field}>
									<Text style={styles.label}>Address Line 2</Text>
									<TextInput
										style={styles.input}
										placeholder="Apartment, suite, unit, building, floor, etc."
										value={address2}
										onChangeText={setAddress2}
										placeholderTextColor={Colors.placeholder}
									/>
								</View>

								{/* Town / City / Country */}
								<View style={styles.row}>
									<View style={[styles.field, styles.third]}>
										<Text style={styles.label}>Postcode</Text>
										<TextInput
											style={styles.input}
											placeholder="Enter postcode"
											value={postcode}
											onChangeText={setPostcode}
											placeholderTextColor={Colors.placeholder}
										/>
									</View>
									<View style={[styles.field, styles.third]}>
										<Text style={styles.label}>Town</Text>
										<TextInput
											style={styles.input}
											placeholder="Town"
											value={town}
											onChangeText={setTown}
											placeholderTextColor={Colors.placeholder}
										/>
									</View>
									<View style={[styles.field, styles.third]}>
										<Text style={styles.label}>Country</Text>
										<TextInput
											style={styles.input}
											placeholder="Country"
											value={country}
											onChangeText={setCountry}
											placeholderTextColor={Colors.placeholder}
										/>
									</View>
								</View>

								{/* Save Button */}
								<View style={styles.buttonContainer}>
									<CustomButton
										title="SAVE CHANGES"
										iconName="save-outline"
										loading={saving}
										loadingText="Saving…"
										onPress={handleSave}
									/>
								</View>
							</View>
						</ScrollView>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>

				{/* Date pickers and popup remain unchanged */}
				<DateTimePickerModal
					isVisible={dobPickerVisible}
					mode="date"
					onConfirm={(date) => {
						const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
							date.getDate()
						).padStart(2, '0')}`;
						setDob(formatted);
						setDobPickerVisible(false);
					}}
					onCancel={() => setDobPickerVisible(false)}
				/>

				<DateTimePickerModal
					isVisible={doaPickerVisible}
					mode="date"
					onConfirm={(date) => {
						const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
							date.getDate()
						).padStart(2, '0')}`;
						setAnniversary(formatted);
						setDoaPickerVisible(false);
					}}
					onCancel={() => setDoaPickerVisible(false)}
				/>

				<CustomPopUp
					visible={popupVisible}
					title={popupTitle}
					message={popupMessage}
					confirmText="Great!"
					showCancel={false}
					maskClosable={false}
					onConfirm={() => setPopupVisible(false)}
					onCancel={() => setPopupVisible(false)}
				/>

				{/* Title Bottom Sheet Modal */}
				<Modal
					visible={showTitleSheet}
					transparent
					animationType="slide"
					onRequestClose={() => setShowTitleSheet(false)}
				>
					<TouchableOpacity activeOpacity={1} style={styles.sheetBackdrop} onPress={() => setShowTitleSheet(false)}>
						<TouchableOpacity activeOpacity={1} style={styles.sheetContainer}>
							<Text style={styles.sheetTitle}>Select Title</Text>
							{TITLE_OPTIONS.map((opt) => (
								<TouchableOpacity
									key={opt.value}
									style={[styles.sheetOption, opt.value === title && styles.sheetOptionSelected]}
									onPress={() => {
										setTitle(opt.value);
										setShowTitleSheet(false);
									}}
								>
									<Text style={[styles.sheetOptionText, opt.value === title && styles.sheetOptionTextSelected]}>
										{opt.label}
									</Text>
								</TouchableOpacity>
							))}
						</TouchableOpacity>
					</TouchableOpacity>
				</Modal>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
	},
	formContainer: {
		backgroundColor: Colors.white,
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 10,
	},
	field: {
		marginBottom: 16,
	},
	label: {
		marginBottom: 6,
		fontWeight: '600',
		color: Colors.text,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4,
		paddingHorizontal: 10,
		paddingVertical: 8,
		color: Colors.text,
		height: 45,
	},
	sheetInput: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4,
		paddingHorizontal: 10,
		height: 45,
		justifyContent: 'center',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	half: {
		flex: 0.48,
	},
	third: {
		flex: 0.3,
	},
	buttonContainer: {
		marginTop: 24,
		justifyContent: 'center',
		alignItems: 'center',
	},

	// Bottom Sheet Styles
	sheetBackdrop: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
	sheetContainer: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingBottom: 24,
		paddingTop: 16,
		paddingHorizontal: 16,
	},
	sheetTitle: {
		fontWeight: 'bold',
		fontSize: 18,
		textAlign: 'center',
		marginBottom: 8,
	},
	sheetOption: {
		paddingVertical: 16,
		borderBottomColor: '#eee',
		borderBottomWidth: 1,
	},
	sheetOptionSelected: {
		backgroundColor: '#f5f5f5',
	},
	sheetOptionText: {
		fontSize: 16,
		color: Colors.text,
		textAlign: 'center',
	},
	sheetOptionTextSelected: {
		color: Colors.primary,
		fontWeight: 'bold',
	},
});
