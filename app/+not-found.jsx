import {Link} from 'expo-router';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function NotFoundScreen() {
	return (
		<View style={styles.container}>
			<Ionicons name="alert-circle-outline" size={64} color="#ff4d4f" />
			<Text style={styles.title}>Oops! Page Not Found</Text>
			<Text style={styles.subtitle}>The page you’re looking for doesn’t exist or has been moved.</Text>

			<Link href="/(tabs)/search" asChild>
				<TouchableOpacity style={styles.button}>
					<Text style={styles.buttonText}>Go to Home</Text>
				</TouchableOpacity>
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		padding: 24,
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		marginTop: 16,
		color: '#333',
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 16,
		color: '#666',
		marginTop: 8,
		textAlign: 'center',
	},
	button: {
		marginTop: 24,
		backgroundColor: '#ff4d4f',
		paddingVertical: 12,
		paddingHorizontal: 28,
		borderRadius: 8,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
