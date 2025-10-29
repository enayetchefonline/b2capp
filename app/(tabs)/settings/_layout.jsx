import {Stack} from 'expo-router';

export default function Layout() {
	return (
		<Stack screenOptions={{headerShown: true}}>
			<Stack.Screen name="index" options={{headerShown: true, headerTitle: 'Settings'}} />
			<Stack.Screen name="detail" options={{headerShown: true}} />
		</Stack>
	);
}
