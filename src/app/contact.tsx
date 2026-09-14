import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { Linking, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, Colors, Spacing } from '@/constants/theme';

const CONTACT_EMAIL = 'shadia.vip78@gmail.com';
const CONTACT_URL = 'https://www.futurepressroom.com/contact';

export default function ContactScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const styles = createStyles(colors);

    return (
        <View style={styles.screen}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.content}>
                    <Text style={styles.label}>Future Pressroom AI</Text>
                    <Text style={styles.title}>اتصل بنا</Text>

                    <Text style={styles.description}>
                        نرحب باستفسارات القراء وملاحظاتهم المتعلقة بالمحتوى التحريري
                        أو باستخدام موقع وتطبيق Future Pressroom AI.
                    </Text>

                    <View style={styles.card}>
                        <Ionicons color={colors.accent} name="mail-outline" size={34} />

                        <Text style={styles.cardTitle}>البريد الإلكتروني</Text>

                        <Text selectable style={styles.link}>{CONTACT_EMAIL}</Text>
                    </View>

                    <Pressable
                        accessibilityRole="link"
                        onPress={() => Linking.openURL(CONTACT_URL)}
                        style={styles.websiteButton}>
                        <Text style={styles.websiteButtonText}>زيارة صفحة التواصل في الموقع</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    );
}

function createStyles(colors: typeof Colors.light | typeof Colors.dark) {
    return StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: colors.background,
        },
        safeArea: {
            flex: 1,
        },
        content: {
            flex: 1,
            paddingHorizontal: Spacing.three,
            paddingTop: Spacing.five,
            paddingBottom: BottomTabInset + Spacing.three,
            alignItems: 'flex-end',
        },
        label: {
            color: colors.accent,
            fontSize: 14,
            fontWeight: '800',
        },
        title: {
            marginTop: Spacing.two,
            color: colors.text,
            fontSize: 32,
            fontWeight: '800',
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        description: {
            marginTop: Spacing.three,
            color: colors.textSecondary,
            fontSize: 16,
            lineHeight: 28,
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        card: {
            width: '100%',
            marginTop: Spacing.five,
            padding: Spacing.four,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 22,
            backgroundColor: colors.backgroundElement,
        },
        cardTitle: {
            marginTop: Spacing.two,
            color: colors.text,
            fontSize: 18,
            fontWeight: '800',
            writingDirection: 'rtl',
        },
        link: {
            marginTop: Spacing.two,
            color: colors.accent,
            fontSize: 16,
            fontWeight: '700',
        },
        websiteButton: {
            width: '100%',
            marginTop: Spacing.three,
            padding: Spacing.three,
            alignItems: 'center',
            borderRadius: 16,
            backgroundColor: colors.accent,
        },
        websiteButtonText: {
            color: colors.primary,
            fontSize: 15,
            fontWeight: '800',
            writingDirection: 'rtl',
        },
    });
}