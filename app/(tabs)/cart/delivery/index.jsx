import {useRouter} from 'expo-router';
import {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from '../../../../components/ui/CustomButton';
import CustomPopUp from '../../../../components/ui/CustomPopUp';
import Colors from '../../../../constants/color';
import {setDeliveryInfo, setPostCodeCharge} from '../../../../store/slices/cartSlice';
import {postCodeCharge, restaurantPostCode} from './../../../../lib/api';

export default function DeliveryDetailScreen() {
	const router = useRouter();
	const dispatch = useDispatch();

	const authUser = useSelector((state) => state.auth.user);
	const restaurantDetails = useSelector((state) => state.restaurantDetail.data);

	const storeAddress = useSelector((state) => state.cart.address);
	const storeCity = useSelector((state) => state.cart.city);
	const storePostcode = useSelector((state) => state.cart.postcode);

	const [addressOne, setAddressOne] = useState('');
	const [addressTwo, setAddressTwo] = useState('');
	const [city, setCity] = useState('');
	const [postcode, setPostcode] = useState('');

	// const [deliveryAreasText, setDeliveryAreasText] = useState('');
	const [deliveryPostcodes, setDeliveryPostcodes] = useState([]);
	const [loadingPostcodes, setLoadingPostcodes] = useState(false);
	const [loadingContinue, setLoadingContinue] = useState(false);

	const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
	const [showInvalidPostcodePopup, setShowInvalidPostcodePopup] = useState(false);
	const [invalidMsg, setInvalidMsg] = useState('');

	// Prefill input fields from Redux user store
	// Prefill input fields from Redux user store
	useEffect(() => {
		if (authUser) {
			setAddressOne((prev) => prev || authUser.address1 || '');
			setAddressTwo((prev) => prev || authUser.address2 || '');
			setCity((prev) => prev || authUser.town || '');
			setPostcode((prev) => prev || authUser.postcode || '');
		}

		// 👇 New logic to fallback to cart store if available
		if (storeAddress) {
			const [addr1, ...addr2] = storeAddress.split(' ');
			setAddressOne((prev) => prev || addr1 || '');
			setAddressTwo((prev) => prev || addr2.join(' ') || '');
		}
		if (storeCity) setCity((prev) => prev || storeCity);
		if (storePostcode) setPostcode((prev) => prev || storePostcode);
	}, [authUser, storeAddress, storeCity, storePostcode]);

	// Fetch delivery postcodes
	useEffect(() => {
		const fetchPostCodes = async () => {
			try {
				if (restaurantDetails?.restaurant_id) {
					setLoadingPostcodes(true);
					const res = await restaurantPostCode(restaurantDetails.restaurant_id);
					const districts = res?.postcode_list?.district;

					if (districts && districts.length > 0) {
						setDeliveryPostcodes(districts);

						const formatted = districts
							.reduce((acc, code, idx) => {
								const lineIdx = Math.floor(idx / 5);
								if (!acc[lineIdx]) acc[lineIdx] = [];
								acc[lineIdx].push(code);
								return acc;
							}, [])
							.map((group) => group.join(', '))
							.join('\n');

						// setDeliveryAreasText(formatted);
					} else {
						// setDeliveryAreasText('No delivery areas available.');
					}
				}
			} catch (err) {
				console.error('Failed to fetch postcodes:', err);
				// setDeliveryAreasText('Failed to load delivery areas.');
			} finally {
				setLoadingPostcodes(false);
			}
		};

		fetchPostCodes();
	}, [restaurantDetails]);

	const handleContinue = async () => {
		setLoadingContinue(true);
		dispatch(
			setDeliveryInfo({
				address: `${addressOne} ${addressTwo}`.trim(),
				city,
				postcode,
			})
		);
		const normalizedPostcode = postcode.replace(/\s+/g, '').toUpperCase();

		if (normalizedPostcode) {
			try {
				const response = await postCodeCharge(restaurantDetails.restaurant_id, normalizedPostcode);

				if (response?.status === 'Success') {
					dispatch(setPostCodeCharge(response));
					router.push('/cart/checkout');
				} else {
					setInvalidMsg(response?.msg || 'Invalid postcode');
					setShowInvalidPostcodePopup(true);
				}
			} catch (err) {
				console.error('Failed to fetch postcode charge:', err);
				setInvalidMsg('Something went wrong. Please try again.');
				setShowInvalidPostcodePopup(true);
			}
		} else {
			setInvalidMsg('Please enter a valid postcode.');
			setShowInvalidPostcodePopup(true);
		}

		setLoadingContinue(false);
	};

	const isFormValid = addressOne && city && postcode && !loadingPostcodes;

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.form}>
				<TextInput
					style={styles.input}
					placeholder="Address One"
					value={addressOne}
					onChangeText={setAddressOne}
					placeholderTextColor={Colors.placeholder}
				/>
				<TextInput
					style={styles.input}
					placeholder="Address Two"
					value={addressTwo}
					onChangeText={setAddressTwo}
					placeholderTextColor={Colors.placeholder}
				/>
				<TextInput
					style={styles.input}
					placeholder="Town/City"
					value={city}
					onChangeText={setCity}
					placeholderTextColor={Colors.placeholder}
				/>
				<TextInput
					style={styles.input}
					placeholder="Postcode"
					value={postcode}
					onChangeText={setPostcode}
					placeholderTextColor={Colors.placeholder}
				/>

				{loadingPostcodes ? (
					<View style={styles.loadingContainer}>
						<Text style={styles.loadingText}>Loading delivery areas...</Text>
						<ActivityIndicator size="small" color={Colors.primary} style={{marginLeft: 8}} />
					</View>
				) : (
					<TouchableOpacity style={styles.deliveryAreaBtn} onPress={() => setShowDeliveryPopup(true)}>
						<Ionicons name="location-sharp" size={16} color={Colors.primary} />
						<Text style={styles.deliveryAreaText}>DELIVERY AREAS</Text>
					</TouchableOpacity>
				)}

				<CustomButton
					title="Continue"
					onPress={handleContinue}
					disabled={!isFormValid}
					loading={loadingContinue}
					loadingText="Validating..."
					containerStyle={{width: '100%'}}
				/>
			</View>

			<CustomPopUp
				visible={showDeliveryPopup}
				title="Delivery Areas"
				showCancel={false}
				confirmText="Close"
				onConfirm={() => setShowDeliveryPopup(false)}
			>
				<ScrollView style={{maxHeight: 300}}>
					<View style={styles.postcodeGrid}>
						{deliveryPostcodes.map((code) => (
							<TouchableOpacity
								key={code}
								style={styles.postcodeItem}
								onPress={() => {
									setPostcode(code);
									setShowDeliveryPopup(false);
								}}
							>
								<Text style={styles.postcodeText}>{code}</Text>
							</TouchableOpacity>
						))}
					</View>
				</ScrollView>
			</CustomPopUp>

			<CustomPopUp
				visible={showInvalidPostcodePopup}
				title="Invalid Postcode"
				message={invalidMsg}
				onConfirm={() => setShowInvalidPostcodePopup(false)}
				showCancel={false}
				confirmText="OK"
			/>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 16,
		backgroundColor: Colors.background,
	},
	form: {
		backgroundColor: Colors.white,
		borderRadius: 8,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 10,
		marginBottom: 12,
		fontSize: 14,
	},
	loadingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	deliveryAreaBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
		gap: 8,
		backgroundColor: '#FFCCCC',
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	deliveryAreaText: {
		color: Colors.primary,
		fontSize: 14,
		fontWeight: 'bold',
	},
	postcodeGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		gap: 8,
	},
	postcodeItem: {
		backgroundColor: '#F0F0F0',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 6,
		marginBottom: 8,
	},
	postcodeText: {
		fontSize: 13,
		color: Colors.text,
	},
});
