import {useLocalSearchParams, useNavigation} from 'expo-router';
import {useEffect, useLayoutEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {WebView} from 'react-native-webview';
import Colors from '../../../../constants/color';
import getData from '../../../../lib/api';

export default function SettingsDetailScreen() {
	const {settingsId, settingsName} = useLocalSearchParams();
	const navigation = useNavigation();

	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(true);
	const [isDataFound, setIsDataFound] = useState(false);

	useLayoutEffect(() => {
		if (settingsName) {
			const capitalizedTitle = settingsName
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' ');
			navigation.setOptions({title: capitalizedTitle});
		}
	}, [settingsName, navigation]);

	const fetchSettingsDetail = async () => {
		setLoading(true);
		setIsDataFound(false); // reset before fetching

		try {
			const res = await getData(
				`http://smartrestaurantsolutions.com/mobile-react-api/live/Trigger.php?funId=5&id=${settingsId}`
			);

			const rawContent = res?.data?.result?.content?.trim();

			if (res?.data?.status === 'Success' && rawContent) {
				const styledContent = `
					<html>
						<head>
							<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<style>
								body {
									font-size: 16px;
									color: #333;
									padding: 15px;
									line-height: 1.6;
									font-family: sans-serif;
								}
								h1, h2, h3 {
									font-size: 18px;
									margin-top: 20px;
								}
								p {
									font-size: 15px;
									margin-bottom: 15px;
								}
							</style>
						</head>
						<body>
							${rawContent}
						</body>
					</html>
				`;
				setContent(styledContent);
				setIsDataFound(true);
			} else {
				setIsDataFound(false);
			}
		} catch (err) {
			console.error('Settings detail fetch failed:', err.message);
			setIsDataFound(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (settingsId) {
			fetchSettingsDetail();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settingsId]);

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}

	if (!isDataFound) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorText}>Sorry! We can&apos;t load the data. Please reload.</Text>
				<TouchableOpacity onPress={fetchSettingsDetail} style={styles.reloadBtn}>
					<Text style={styles.reloadText}>Reload</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<WebView
				source={{html: content}}
				style={styles.webView}
				originWhitelist={['*']}
				startInLoadingState={true}
				showsVerticalScrollIndicator={true}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: Colors.background,
	},
	errorText: {
		color: '#999',
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 10,
	},
	reloadBtn: {
		marginTop: 10,
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: Colors.primary,
		borderRadius: 6,
	},
	reloadText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 14,
	},
	webView: {
		flex: 1,
		backgroundColor: Colors.white,
		borderRadius: 10,
		margin: 10,
		overflow: 'hidden',
	},
});
