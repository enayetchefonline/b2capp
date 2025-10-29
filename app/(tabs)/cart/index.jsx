import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from 'expo-router';
import {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RadioButton, Snackbar} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import CustomPopUp from '../../../components/ui/CustomPopUp';

// API and Redux actions
import {carrierBag} from '../../../lib/api';
import {
	addItemToCart,
	setCarryBag,
	setOrderMode,
	setSelectedRestaurantDiscountId,
	setSelectedRestaurantOfferId,
	updateItemQuantity,
} from '../../../store/slices/cartSlice';

// --- FIXED COLOR CONSTANTS ---
const COLORS = {
	background: '#F5F5F5',
	text: '#333333',
	border: '#E0E0E0',
	white: '#FFFFFF',
	primary: '#EC1839', // Strong red
	secondary: '#333333', // Use as needed for proceed btn bg
	shadow: '#000000',
	secondaryText: '#ccc',
};

export default function CartScreen() {
	const dispatch = useDispatch();
	const router = useRouter();

	const [showMinOrderPopup, setShowMinOrderPopup] = useState(false);
	const [showNoOfferDiscountPopup, setShowNoOfferDiscountPopup] = useState(false);

	const [visibleSnackBar, setVisibleSnackBar] = useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState('');

	const restaurantId = useSelector((state) => state.cart.restaurantId);
	const storeItemList = useSelector((state) => state.cart.items);
	const storeOrderPolicy = useSelector((state) => state.cart.order_policy);
	const storeDiscount = useSelector((state) => state.cart.discount);
	const storeOffer = useSelector((state) => state.cart.offer);
	const storeSelectedDiscountId = useSelector((state) => state.cart.selected_discount_id);
	const storeSelectedOfferId = useSelector((state) => state.cart.selected_offer_id);

	console.log('storeDiscount', storeDiscount);

	const availableModes = (storeOrderPolicy?.policy || []).map((p) => p.policy_name);
	const [mode, setMode] = useState(null);

	useEffect(() => {
		if (restaurantId && Object.keys(storeItemList).length > 0) {
			loadCarryBag();
		}
	}, [restaurantId, storeItemList, loadCarryBag]);

	useEffect(() => {
		setMode(null);
	}, [storeItemList]);

	useEffect(() => {
		if (storeDiscount?.status === 1 && Array.isArray(storeDiscount.off)) {
			const defaultDiscount = storeDiscount.off.find((d) => d.default === '1');
			if (defaultDiscount) {
				dispatch(setSelectedRestaurantDiscountId(defaultDiscount.discount_id));
			}
		}

		if (storeOffer?.status === 1 && Array.isArray(storeOffer.offer_list)) {
			const defaultOffer = storeOffer.offer_list.find((o) => o.default === '1');
			if (defaultOffer) {
				dispatch(setSelectedRestaurantOfferId(defaultOffer.id));
			}
		}
	}, [storeDiscount, storeOffer, dispatch]);

	const cartItems = Object.values(storeItemList || {}).map(({item, quantity}) => ({
		id: item?.dish_id,
		name: item?.dish_name,
		price: parseFloat(item?.dish_price || 0),
		qty: quantity,
	}));

	const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

	const loadCarryBag = useCallback(async () => {
		try {
			const response = await carrierBag({restId: restaurantId});

			if (response?.restaurant_service_id && parseFloat(response.price) > 0) {
				const bagId = 'carry_bag';

				// ✅ Prevent adding carry bag again if already exists
				if (storeItemList[bagId]) {
					return;
				}

				const carryBagItem = {
					dish_id: bagId,
					dish_name: 'Carry Bag',
					dish_price: response.price,
				};

				dispatch(setCarryBag(response));
				dispatch(addItemToCart(carryBagItem));
			}
		} catch (err) {
			console.error('❌ Failed to load carry bag:', err);
		}
	}, [restaurantId, storeItemList, dispatch]);

	const applicableDiscounts = (storeDiscount?.status === 1 ? storeDiscount.off : []).filter((d) => {
		const orderType = d.order_type?.toLowerCase();
		return (
			d.active === 1 &&
			(orderType === mode?.toLowerCase() || orderType === 'both') &&
			parseFloat(d.eligible_amount || 0) <= subtotal
		);
	});

	const applicableOffers = (storeOffer?.status === 1 ? storeOffer.offer_list : []).filter((o) => {
		return o.active === 1 && parseFloat(o.eligible_amount || 0) <= subtotal;
	});

	const increaseQty = (id, currentQty) => {
		dispatch(updateItemQuantity({itemId: id, quantity: currentQty + 1}));
	};

	const decreaseQty = (id, currentQty) => {
		if (currentQty > 1) {
			dispatch(updateItemQuantity({itemId: id, quantity: currentQty - 1}));
		} else {
			dispatch(updateItemQuantity({itemId: id, quantity: 0}));
		}
	};

	const getMinOrderAmount = () => {
		const currentPolicy = storeOrderPolicy?.policy?.find((p) => p.policy_name === mode);
		return parseFloat(currentPolicy?.min_order || '0');
	};

	const handleProceed = async () => {
		try {
			const token = await AsyncStorage.getItem('accessToken');
			if (!token) {
				router.replace({
					pathname: '/profile/login',
					params: {redirect: '/cart'},
				});
				return;
			}

			if (!mode) {
				setSnackBarMessage('Please select order type: Collection or Delivery');
				setVisibleSnackBar(true);
				return;
			}

			const minAmount = getMinOrderAmount();
			if (subtotal < minAmount) {
				setShowMinOrderPopup(true);
				return;
			}

			const hasAvailableDiscounts = storeDiscount?.status === 1 && storeDiscount.off?.length > 0;
			const hasAvailableOffers = storeOffer?.status === 1 && storeOffer.offer_list?.length > 0;

			const shouldPromptForDiscountOrOffer =
				(hasAvailableDiscounts || hasAvailableOffers) && !storeSelectedDiscountId && !storeSelectedOfferId;

			if (shouldPromptForDiscountOrOffer) {
				setShowNoOfferDiscountPopup(true);
				return;
			}

			if (mode.toLowerCase() === 'collection') {
				setMode(null);
				router.push('/cart/checkout');
			} else if (mode.toLowerCase() === 'delivery') {
				router.push('/cart/delivery');
			} else {
				console.warn('Invalid order mode');
			}
		} catch (error) {
			console.error('handleProceed error:', error);
		}
	};

	const selectedDiscount = applicableDiscounts.find((d) => d.discount_id === storeSelectedDiscountId);

	const discountAmount =
		selectedDiscount?.discount_type === 'Percentage'
			? (subtotal * parseFloat(selectedDiscount.discount_amount || 0)) / 100
			: parseFloat(selectedDiscount?.discount_amount || 0);

	const total = subtotal - discountAmount;

	return (
		<View style={styles.container}>
			{cartItems.length === 0 ? (
				<View style={styles.emptyCart}>
					<Ionicons name="cart-outline" size={200} color={COLORS.secondaryText} />
					<Text style={{color: COLORS.secondaryText, fontSize: 20, textTransform: 'uppercase'}}>
						Your cart is empty
					</Text>
				</View>
			) : (
				<ScrollView contentContainerStyle={{paddingBottom: 150, flexGrow: 1}} showsVerticalScrollIndicator={false}>
					{/* Order Type Toggle */}
					<View style={styles.toggleRow}>
						{availableModes.map((type) => (
							<TouchableOpacity
								key={type}
								style={[styles.toggleBtn, mode === type && styles.toggleBtnActive]}
								onPress={() => {
									setMode(type);
									dispatch(setOrderMode(type));
								}}
							>
								<Text style={[styles.toggleText, mode === type && styles.toggleTextActive]}>{type.toUpperCase()}</Text>
							</TouchableOpacity>
						))}
					</View>

					{/* Cart Items */}
					<View style={styles.listCard}>
						{cartItems.map((item) => (
							<View key={item.id} style={styles.itemRow}>
								<Text style={styles.itemText}>
									{item.qty} x {item.name}
								</Text>
								<View style={styles.itemActions}>
									<TouchableOpacity style={styles.qtyBtn} onPress={() => decreaseQty(item.id, item.qty)}>
										<Ionicons name="remove-outline" size={20} color={COLORS.primary} />
									</TouchableOpacity>
									<Text style={styles.priceText}>£{(item.price * item.qty).toFixed(2)}</Text>
									<TouchableOpacity style={styles.qtyBtn} onPress={() => increaseQty(item.id, item.qty)}>
										<Ionicons name="add-outline" size={20} color={COLORS.primary} />
									</TouchableOpacity>
								</View>
							</View>
						))}
					</View>

					{/* Available Discounts */}
					{applicableDiscounts.length > 0 && (
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Available Discounts</Text>
							<RadioButton.Group
								onValueChange={(value) => {
									dispatch(setSelectedRestaurantDiscountId(value));
									dispatch(setSelectedRestaurantOfferId(''));
								}}
								value={storeSelectedDiscountId}
							>
								{applicableDiscounts.map((d) => (
									<View key={d.discount_id} style={styles.radioItem}>
										<View style={styles.radioButtonWrapper}>
											<RadioButton value={d.discount_id} color={COLORS.primary} uncheckedColor="#888" />
										</View>
										<Text style={styles.radioLabel}>
											{d.discount_title} - {d.discount_description}
										</Text>
									</View>
								))}
							</RadioButton.Group>
						</View>
					)}

					{/* Available Offers */}
					{applicableOffers.length > 0 && (
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Available Offers</Text>
							<RadioButton.Group
								onValueChange={(value) => {
									dispatch(setSelectedRestaurantOfferId(value));
									dispatch(setSelectedRestaurantDiscountId(''));
								}}
								value={storeSelectedOfferId}
							>
								{applicableOffers.map((o) => (
									<View key={o.id} style={styles.radioItem}>
										<View style={styles.radioButtonWrapper}>
											<RadioButton value={o.id} color={COLORS.primary} uncheckedColor="#888" />
										</View>
										<Text style={styles.radioLabel}>{o.offer_title}</Text>
									</View>
								))}
							</RadioButton.Group>
						</View>
					)}
				</ScrollView>
			)}

			{/* Summary Footer */}
			{cartItems.length > 0 && (
				<View style={styles.bottomBar}>
					<View>
						<Text style={styles.summaryText}>SUBTOTAL: £{subtotal.toFixed(2)}</Text>
						{storeSelectedDiscountId && (
							<Text style={styles.summaryText}>
								DISCOUNT: -£{discountAmount.toFixed(2)}{' '}
								{selectedDiscount?.discount_title ? `(${selectedDiscount.discount_title})` : ''}
							</Text>
						)}
						<Text style={styles.summaryText}>TOTAL: £{total.toFixed(2)}</Text>
					</View>
					<TouchableOpacity style={styles.proceedTouchable} onPress={handleProceed}>
						<Text style={styles.proceedText}>PROCEED</Text>
					</TouchableOpacity>
				</View>
			)}

			<CustomPopUp
				visible={showMinOrderPopup}
				title="Minimum Order Required"
				message={`Minimum order for ${mode} is £${getMinOrderAmount().toFixed(2)}. Your subtotal is £${subtotal.toFixed(
					2
				)}.`}
				onConfirm={() => setShowMinOrderPopup(false)}
				showCancel={false}
				confirmText="OK"
			/>

			<CustomPopUp
				visible={showNoOfferDiscountPopup}
				title="Continue Without Offer or Discount?"
				message="You haven't selected any discount or offer. Do you want to continue?"
				showCancel
				onCancel={() => setShowNoOfferDiscountPopup(false)}
				onConfirm={() => {
					setShowNoOfferDiscountPopup(false);
					setMode(null);
					router.push('/cart/checkout');
				}}
			/>

			<View style={{position: 'absolute', bottom: 16, left: 0, right: 0}}>
				<Snackbar
					visible={visibleSnackBar}
					duration={3000}
					onDismiss={() => {
						setSnackBarMessage('');
						setVisibleSnackBar(false);
					}}
					action={{
						label: 'OK',
						onPress: () => {
							setSnackBarMessage('');
							setVisibleSnackBar(false);
						},
					}}
				>
					{snackBarMessage}
				</Snackbar>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {flex: 1, backgroundColor: COLORS.background, padding: 16},
	toggleRow: {flexDirection: 'row', justifyContent: 'center', paddingVertical: 12},
	toggleBtn: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		backgroundColor: COLORS.border,
		borderRadius: 5,
		marginHorizontal: 8,
	},
	toggleBtnActive: {backgroundColor: COLORS.primary},
	toggleText: {fontSize: 12, color: COLORS.text},
	toggleTextActive: {color: COLORS.white},
	listCard: {
		backgroundColor: COLORS.white,
		borderRadius: 8,
		paddingVertical: 8,
		paddingHorizontal: 12,
		marginBottom: 16,
	},
	itemRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderColor: COLORS.border,
	},
	itemText: {flex: 1, fontSize: 14, color: COLORS.text},
	itemActions: {flexDirection: 'row', alignItems: 'center'},
	qtyBtn: {
		borderWidth: 1,
		borderColor: COLORS.primary,
		borderRadius: 4,
		padding: 4,
		marginHorizontal: 6,
	},
	priceText: {fontSize: 14, color: COLORS.text},
	section: {marginBottom: 16, backgroundColor: COLORS.white, borderRadius: 8, padding: 16},
	sectionTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: COLORS.text},
	radioItem: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
	radioLabel: {fontSize: 14, color: COLORS.text},
	bottomBar: {
		position: 'absolute',
		left: 16,
		right: 16,
		bottom: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: COLORS.primary,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		shadowColor: COLORS.shadow,
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 10,
	},
	summaryText: {color: COLORS.white, fontSize: 12, lineHeight: 18},
	proceedTouchable: {
		backgroundColor: '#A70000',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 4,
	},
	proceedText: {color: COLORS.white, fontSize: 14, fontWeight: '600'},
	emptyCart: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 32,
	},
	radioButtonWrapper: {
		borderWidth: 1,
		borderColor: '#ccc', // Make border visible on iOS
		borderRadius: 100,
		padding: 0,
		backgroundColor: '#fff', // Ensure the radio button is visible
		marginRight: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
