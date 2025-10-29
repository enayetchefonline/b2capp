import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import 'react-native-reanimated';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
import {Provider, useDispatch} from 'react-redux';
import Colors from '../constants/color';
import {checkForceUpdate} from '../lib/api';
import {setUser} from '../store/slices/authSlice';
import store from '../store/store';

// Inner component to use Redux hooks
function RootLayoutInner() {
	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
		const restoreSession = async () => {
			try {
				const token = await AsyncStorage.getItem('accessToken');
				const userData = await AsyncStorage.getItem('userData');

				if (token && userData) {
					const user = JSON.parse(userData);
					dispatch(setUser({user, token}));
				}
			} catch (error) {
				console.error('❌ Failed to restore session:', error);
			}
		};

		restoreSession();
	}, [dispatch]);

	useEffect(() => {
		const fetchUpdate = async () => {
			try {
				const res = await checkForceUpdate();

				if (Array.isArray(res) && res[0]?.force_update == 1) {
					const latest = parseFloat(res[0].app_version);
					const current = parseFloat(Constants.expoConfig?.version || '0');
					if (latest > current) {
						router.replace('/force-update');
					}
				}
			} catch (err) {
				console.error('❌ Failed to check force update:', err);
			}
		};
		fetchUpdate();
	}, []);

	useEffect(() => {
		const requestPermission = async () => {
			try {
				const status = await requestTrackingPermission();

				if (status === 'authorized') {
					console.log('✅ Tracking permission granted');
				} else {
					console.log('❌ Tracking permission denied or not determined');
				}
			} catch (error) {
				console.log('❗Error requesting ATT permission:', error);
			}
		};

		requestPermission();
	}, []);

	return (
		<>
			{/* Set status bar color based on app primary color */}
			<StatusBar backgroundColor={Colors.primary} style="light" />
			<Stack
				screenOptions={{
					headerShown: false,
					headerStyle: {backgroundColor: Colors.danger},
					headerTitleStyle: {color: Colors.white},
					headerTintColor: Colors.white,
					animation: 'slide_from_right',
				}}
			>
				<Stack.Screen name="(tabs)" options={{headerShown: false}} />
				<Stack.Screen name="card-payment-webview/index" options={{headerShown: false}} />
				<Stack.Screen name="order-success/index" options={{headerShown: false}} />
				<Stack.Screen name="card-order-success/index" options={{headerShown: false}} />
				<Stack.Screen name="+not-found" />
			</Stack>
		</>
	);
}

// Root wrapper with Redux Provider
export default function RootLayout() {
	return (
		<Provider store={store}>
			<View style={{flex: 1}}>
				<RootLayoutInner />
			</View>
		</Provider>
	);
}
