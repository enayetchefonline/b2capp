import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../store/slices/cartSlice';

export default function OrderSuccessScreen() {
	const router = useRouter();
	const dispatch = useDispatch();
	const {status, transactionId, discount, carrybag, delivery, total} = useLocalSearchParams();
	const storeItemList = useSelector((state) => state.cart.items);
	const restaurantName = useSelector((state) => state.cart.restaurantName);
	const restaurantDetails = useSelector((state) => state.restaurantDetail.data);

	const isSuccess = status === 1 || status?.toLowerCase?.() === 'success';

	const handleBackToHome = () => {
		if (isSuccess) {
			dispatch(clearCart());
			router.replace('/(tabs)/search');
		} else {
			router.replace('/(tabs)/cart');
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.card}>
				<Ionicons
					name={isSuccess ? 'checkmark-circle' : 'close-circle'}
					size={80}
					color={isSuccess ? '#28a745' : '#e74c3c'}
				/>

				{isSuccess ? (
					<Text style={styles.title}>
						Thank you for your order with <Text style={styles.highlight}>{restaurantName}</Text>
					</Text>
				) : (
					<Text style={styles.title}>Please wait for 3 minutes to place a new order.</Text>
				)}

				{isSuccess ? (
					<Text style={styles.orderCode}>
						Your order code is <Text style={styles.bold}>{transactionId}</Text>
					</Text>
				) : null}

				{isSuccess ? (
					<>
						<Text style={styles.support}>
							If you need to make any changes to your order, please call {restaurantDetails?.res_business_tel_for_call}
						</Text>
						<Text style={styles.address}>{restaurantDetails?.address}</Text>
					</>
				) : null}

				{/* Image with overlay text */}
				<Image
					source={{uri: 'https://www.chefonline.co.uk/images/order-complete.jpg'}}
					style={styles.bannerImage}
					resizeMode="cover"
				/>

				{/* Order Summary */}
				{/* Order Summary */}
				<View style={styles.summaryBox}>
					<Text style={styles.summaryTitle}>My Order</Text>

					{Object.values(storeItemList).map((itemObj, index) => {
						const {dish_name, dish_price} = itemObj.item;
						const quantity = itemObj.quantity;
						const totalPrice = (parseFloat(dish_price) * quantity).toFixed(2);
						return (
							<Text style={styles.summaryLine} key={index}>
								{quantity} x {dish_name} - £{totalPrice}
							</Text>
						);
					})}

					{/* Subtotal */}
					<Text style={styles.summaryLine}>
						Subtotal: £
						{Object.values(storeItemList)
							.reduce((sum, itemObj) => sum + parseFloat(itemObj.item.dish_price) * itemObj.quantity, 0)
							.toFixed(2)}
					</Text>

					{/* Dynamic Discount Line */}
					{parseFloat(discount) > 0 && (
						<Text style={styles.summaryLine}>Discount: -£{parseFloat(discount).toFixed(2)}</Text>
					)}

					{/* Delivery */}
					{parseFloat(delivery) > 0 && (
						<Text style={styles.summaryLine}>Delivery: £{parseFloat(delivery).toFixed(2)}</Text>
					)}

					{/* Carry Bag */}
					{parseFloat(carrybag) > 0 && (
						<Text style={styles.summaryLine}>Carry Bag: £{parseFloat(carrybag).toFixed(2)}</Text>
					)}

					{/* Final Total */}
					<Text style={styles.total}>Total: £{parseFloat(total).toFixed(2)}</Text>
				</View>

				<TouchableOpacity
					style={[styles.btn, isSuccess ? styles.btnSuccess : styles.btnError]}
					onPress={handleBackToHome}
				>
					<Text style={styles.btnText}>{isSuccess ? 'Back to Home' : 'Back to Cart'}</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 50,
		padding: 16,
		paddingBottom: 100,
		backgroundColor: '#f4f4f4',
		flexGrow: 1,
		alignItems: 'center',
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 20,
		width: '100%',
		maxWidth: 500,
		alignItems: 'center',
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		textAlign: 'center',
		marginTop: 16,
	},
	highlight: {
		fontStyle: 'italic',
		color: '#333',
	},
	orderCode: {
		marginTop: 10,
		fontSize: 14,
		textAlign: 'center',
	},
	bold: {fontWeight: '700'},
	support: {
		marginTop: 10,
		fontSize: 13,
		color: '#444',
		textAlign: 'center',
	},
	address: {
		fontSize: 13,
		color: '#666',
		textAlign: 'center',
		marginBottom: 16,
	},
	bannerImage: {
		width: '100%',
		height: 160,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 16,
	},
	overlayText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '900',
		backgroundColor: '#00000088',
		padding: 6,
		textAlign: 'center',
	},
	summaryBox: {
		backgroundColor: '#f9f9f9',
		width: '100%',
		padding: 12,
		borderRadius: 8,
		marginTop: 10,
	},
	summaryTitle: {
		fontWeight: 'bold',
		fontSize: 16,
		marginBottom: 8,
	},
	summaryLine: {
		fontSize: 14,
		color: '#333',
		marginBottom: 4,
	},
	total: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000',
		marginTop: 8,
	},
	btn: {
		// backgroundColor: isSuccess ? '#28a745' : '#ff4d4f',
		marginTop: 24,
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 6,
	},
	btnText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
	},
	btnSuccess: {
		backgroundColor: '#28a745',
	},
	btnError: {
		backgroundColor: '#ff4d4f',
	},
});
