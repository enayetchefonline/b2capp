import {useRouter} from 'expo-router';
import {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.replace('/(tabs)/search');
		}, 2000);

		return () => clearTimeout(timer);
	}, [router]);

	return (
		<View style={styles.container}>
			<Image source={require('../assets/images/splash-icon.png')} style={styles.image} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#E31E3B',
	},
	image: {
		width: 450,
		height: 200,
		resizeMode: 'cover',
	},
});
