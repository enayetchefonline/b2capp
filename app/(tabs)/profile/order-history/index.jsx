import {useRouter} from 'expo-router';
import {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import CustomButton from '../../../../components/ui/CustomButton';
import Colors from '../../../../constants/color';
import {getOrderList} from '../../../../lib/api';

export default function OrderHistoryScreen() {
	const router = useRouter();
	const authUser = useSelector((state) => state.auth.user);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const response = await getOrderList({userid: authUser?.userid});

				if (Array.isArray(response?.orders)) {
					setOrders(response.orders);
				} else {
					setOrders([]);
				}
			} catch (error) {
				console.error('Failed to fetch order list:', error);
				setOrders([]);
			} finally {
				setLoading(false);
			}
		};

		if (authUser?.userid) {
			fetchOrders();
		}
	}, [authUser?.userid]);

	const renderItem = ({item}) => (
		<Pressable
			onPress={() => router.push({pathname: '/profile/order-detail', params: {orderId: item.order_no}})}
			style={styles.card}
		>
			{/* Header */}
			<View style={styles.row}>
				<Text style={styles.restaurant}>{item.restaurant_name}</Text>
				<Text style={styles.orderId}>ORDER ID - {item.order_no}</Text>
			</View>

			{/* Divider */}
			<View style={styles.divider} />

			{/* Address & Date */}
			<View style={[styles.row, styles.justifyBetween]}>
				<View style={styles.row}>
					<Ionicons name="location-outline" size={16} color={Colors.primary} style={styles.iconSmall} />
					<Text style={styles.address}>{item.postcode}</Text>
				</View>
				<Text style={styles.date}>{item.order_date}</Text>
			</View>

			{/* Times */}
			<View style={[styles.row, styles.justifyBetween, styles.mt4]}>
				<Text style={styles.times}>
					IN: {item.order_time} | OUT: {item.delivery_time}
				</Text>
			</View>

			{/* Type & Amount */}
			<View style={[styles.row, styles.mt4]}>
				<View style={styles.row}>
					<Ionicons name="bag-check-outline" size={16} color={Colors.primary} style={styles.iconSmall} />
					<Text style={styles.type}>{item.order_type}</Text>
				</View>
				<Text style={styles.cash}>Paid: £{parseFloat(item.grand_total || 0).toFixed(2)}</Text>
			</View>

			{/* Action Buttons */}
			<View style={[styles.row, styles.buttonRow]}>
				{/* <CustomButton
					title="REORDER"
					iconName="cart-outline"
					onPress={() => router.push('/(tabs)/cart')}
					containerStyle={styles.btnHalf}
				/> */}
				<CustomButton
					title="REVIEW & RATING"
					iconName="star-outline"
					onPress={() =>
						router.push({
							pathname: '/profile/review-rating',
							params: {
								orderId: item.order_no,
								restaurantId: item.rest_id, // Make sure the correct key name is used
							},
						})
					}
					containerStyle={styles.btnHalf}
				/>
			</View>
		</Pressable>
	);

	if (loading) {
		return (
			<View style={styles.loader}>
				<ActivityIndicator size="large" color={Colors.primary} />
				<Text style={{marginTop: 10, color: Colors.text}}>Loading Order History...</Text>
			</View>
		);
	}

	return (
		<View style={styles.screen}>
			<Text style={styles.title}>Total Orders: {orders.length}</Text>
			<FlatList
				data={orders}
				keyExtractor={(item) => item.id?.toString() || item.orderId?.toString() || Math.random().toString()}
				renderItem={renderItem}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<View style={styles.empty}>
						<Text style={{color: Colors.text}}>No orders found.</Text>
					</View>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	title: {
		fontWeight: 'bold',
		color: Colors.text,
		marginTop: 20,
		marginBottom: 10,
		textAlign: 'right',
		paddingRight: 20,
	},
	list: {
		padding: 16,
	},
	card: {
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
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	justifyBetween: {
		justifyContent: 'space-between',
	},
	restaurant: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.text,
	},
	orderId: {
		fontSize: 12,
		color: Colors.text,
	},
	iconSmall: {
		marginRight: 6,
	},
	address: {
		fontSize: 14,
		color: Colors.text,
	},
	date: {
		fontSize: 12,
		color: Colors.text,
	},
	times: {
		fontSize: 12,
		color: Colors.text,
	},
	cash: {
		fontSize: 12,
		color: Colors.text,
	},
	type: {
		fontSize: 14,
		color: Colors.primary,
		marginLeft: 4,
	},
	mt4: {
		marginTop: 8,
	},
	buttonRow: {
		justifyContent: 'flex-end',
		marginTop: 12,
	},
	btnHalf: {
		width: '48%',
	},
	divider: {
		width: '100%',
		height: 1,
		backgroundColor: Colors.border || '#ccc',
		marginVertical: 12,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	empty: {
		marginTop: 80,
		alignItems: 'center',
	},

	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
