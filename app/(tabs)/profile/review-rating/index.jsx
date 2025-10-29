import {useLocalSearchParams, useRouter} from 'expo-router';
import {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import CustomButton from '../../../../components/ui/CustomButton';
import CustomPopUp from '../../../../components/ui/CustomPopUp';
import Colors from '../../../../constants/color';
import {reviewSubmit} from '../../../../lib/api';

export default function ReviewRatingScreen() {
	const router = useRouter();
	const {orderId, restaurantId} = useLocalSearchParams();
	const authUser = useSelector((state) => state.auth.user);

	const [foodRating, setFoodRating] = useState(0);
	const [serviceRating, setServiceRating] = useState(0);
	const [valueRating, setValueRating] = useState(0);
	const [comment, setComment] = useState('');

	const [submitting, setSubmitting] = useState(false);
	const [popupVisible, setPopupVisible] = useState(false);

	const [popupMessage, setPopupMessage] = useState('');

	const stars = [1, 2, 3, 4, 5];

	const renderStars = (rating, setRating) => (
		<View style={styles.starRow}>
			{stars.map((i) => (
				<TouchableOpacity key={i} onPress={() => setRating(i)} disabled={submitting}>
					<Ionicons
						name={i <= rating ? 'star' : 'star-outline'}
						size={20}
						color={Colors.primary}
						style={styles.starIcon}
					/>
				</TouchableOpacity>
			))}
		</View>
	);

	const handleSubmit = async () => {
		if (!orderId || !restaurantId || !authUser?.userid) return;
		setSubmitting(true);

		try {
			const response = await reviewSubmit({
				orderId,
				restId: restaurantId,
				qualityOfFood: foodRating,
				qualityOfService: serviceRating,
				valueOfMoney: valueRating,
				reviewComment: comment,
			});

			if (response?.msg?.toLowerCase().includes('success')) {
				setPopupMessage(response.msg); // ✅ set message
				setPopupVisible(true);
			} else {
				alert(response?.msg || 'Something went wrong!');
			}
		} catch (err) {
			console.error(err);
			alert('Failed to submit review. Please try again.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<ScrollView contentContainerStyle={styles.container}>
				{/* Rating Card */}
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Rate your order</Text>

					<View style={styles.row}>
						<View style={styles.ratingItem}>
							<Text style={styles.label}>QUALITY OF FOOD</Text>
							{renderStars(foodRating, setFoodRating)}
						</View>

						<View style={styles.ratingItem}>
							<Text style={styles.label}>QUALITY OF SERVICE</Text>
							{renderStars(serviceRating, setServiceRating)}
						</View>
					</View>

					<View style={[styles.ratingItem, styles.center]}>
						<Text style={styles.label}>VALUE OF MONEY</Text>
						{renderStars(valueRating, setValueRating)}
					</View>
				</View>

				{/* Comment Card */}
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Write Your Comment</Text>
					<TextInput
						style={styles.commentInput}
						placeholder="Write From Here..."
						placeholderTextColor={Colors.placeholder}
						multiline
						value={comment}
						onChangeText={setComment}
						editable={!submitting}
					/>

					<CustomButton
						title="SUBMIT"
						iconName="send-outline"
						loading={submitting}
						loadingText="Submitting…"
						onPress={handleSubmit}
						disabled={submitting || !comment.trim()}
						containerStyle={styles.submitBtn}
					/>
				</View>
			</ScrollView>

			<CustomPopUp
				visible={popupVisible}
				title="Thank you!"
				message={popupMessage} // ✅ use dynamic message here
				confirmText="OK"
				showCancel={false}
				maskClosable={false}
				onConfirm={() => {
					setPopupVisible(false);
					router.back();
				}}
				onCancel={() => {
					setPopupVisible(false);
					router.back();
				}}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
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
	cardTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: Colors.text,
		marginBottom: 12,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	ratingItem: {
		flex: 0.48,
		marginBottom: 12,
	},
	label: {
		fontSize: 12,
		color: Colors.text,
		marginBottom: 6,
	},
	starRow: {
		flexDirection: 'row',
	},
	starIcon: {
		marginRight: 4,
	},
	center: {
		alignItems: 'center',
	},
	commentInput: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4,
		padding: 10,
		minHeight: 80,
		textAlignVertical: 'top',
		color: Colors.text,
	},
	submitBtn: {
		width: '100%',
		marginTop: 16,
	},
});
