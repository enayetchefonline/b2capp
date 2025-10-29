import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/color';

export default function CustomButton({
	title,
	onPress,
	type = 'primary', // 'primary' | 'delete'
	iconName, // Ionicons icon name, e.g. 'cart-outline'
	iconSize = 20,
	iconPosition = 'left', // 'left' | 'right'
	iconColor, // defaults to text colour
	loading = false,
	loadingText, // e.g. 'Ordering...'
	disabled = false,
	containerStyle,
	textStyle,
}) {
	const isDelete = type === 'delete';
	const textColor = isDelete ? '#fff' : Colors.white;
	const finalIconColor = iconColor || textColor;
	const showText = loading ? loadingText || title : title;

	return (
		<TouchableOpacity
			style={[
				styles.base,
				isDelete ? styles.delete : styles.primary,
				disabled || loading ? styles.disabled : null,
				containerStyle,
			]}
			onPress={onPress}
			activeOpacity={0.7}
			disabled={disabled || loading}
		>
			<View style={styles.content}>
				{loading ? (
					<ActivityIndicator size="small" color={finalIconColor} style={styles.activity} />
				) : iconName && iconPosition === 'left' ? (
					<Ionicons name={iconName} size={iconSize} color={finalIconColor} style={styles.iconLeft} />
				) : null}

				<Text style={[styles.text, {color: textColor}, textStyle]}>{showText}</Text>

				{!loading && iconName && iconPosition === 'right' ? (
					<Ionicons name={iconName} size={iconSize} color={finalIconColor} style={styles.iconRight} />
				) : null}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	base: {
		paddingVertical: 12,
		borderRadius: 6,
		alignItems: 'center',
	},
	primary: {
		backgroundColor: Colors.primary,
		width: '48%',
	},
	delete: {
		backgroundColor: '#A20404',
		width: '100%',
		marginTop: 8,
	},
	disabled: {
		opacity: 0.6,
	},
	text: {
		fontSize: 14,
		fontWeight: '500',
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconLeft: {
		marginRight: 8,
	},
	iconRight: {
		marginLeft: 8,
	},
	activity: {
		marginRight: 8,
	},
});
