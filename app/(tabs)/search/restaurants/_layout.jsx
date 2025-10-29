import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
 
export default function Layout() {
	const router = useRouter();
	const searchText = useSelector((state) => state.cart.searchText);

	const backButton = () => (
		<TouchableOpacity onPress={() => router.back()} style={{paddingLeft: 10}}>
			<Ionicons name="arrow-back" size={24} color="black" />
		</TouchableOpacity>
	);

	return (
		<Stack screenOptions={{headerShown: true}}>
			<Stack.Screen
				name="index"
				options={{
					headerTitle: searchText || 'Search',
					headerTitleAlign: 'center',
					headerLeft: backButton, // 🔙 manually add back button
				}}
			/>
			<Stack.Screen name="details/[restaurantId]" options={{headerTitle: searchText || 'Restaurant Detail'}} />
			<Stack.Screen name="info/[restaurantId]" options={{headerTitle: 'Restaurant Info'}} />
			<Stack.Screen name="review/[restaurantId]" options={{headerTitle: 'Restaurant Review'}} />
			<Stack.Screen name="reservation/[restaurantId]" options={{headerTitle: 'Reservation'}} />
			<Stack.Screen name="offer/[restaurantId]" options={{headerTitle: 'Offer'}} />
		</Stack>
	);
}