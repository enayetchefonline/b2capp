import {Linking, Platform, StyleSheet, Text, View} from 'react-native';
import CustomButton from './ui/CustomButton';
import Colors from '../constants/color';

export default function ForceUpdate() {
        const handleUpdate = () => {
                const url =
                        Platform.OS === 'ios'
                                ? 'itms-apps://itunes.apple.com/us/app/chefonline/id1007229418?ls=1&mt=8'
                                : 'market://details?id=com.chefonline.chefonline';
                Linking.openURL(url);
        };

        return (
                <View style={styles.container}>
                        <Text style={styles.title}>Update Your App</Text>
                        <Text style={styles.message}>
                                A new version is available in {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}.
                                Please update your app in order to enjoy the latest features.
                        </Text>
                        <CustomButton title="Update Now" onPress={handleUpdate} />
                </View>
        );
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 24,
                backgroundColor: Colors.white,
        },
        title: {
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 12,
                color: Colors.primary,
        },
        message: {
                fontSize: 16,
                color: Colors.text,
                textAlign: 'center',
                marginBottom: 24,
        },
});
