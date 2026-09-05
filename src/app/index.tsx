import { HomeNewsFeed } from '@/components/home-news-feed';
import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const styles = createStyles(colors);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey((currentKey) => currentKey + 1);
  }, []);

  const handleRefreshComplete = useCallback(() => {
    setIsRefreshing(false);
  }, []);
  return (
    <View style={styles.screen}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              colors={[colors.accent]}
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
              tintColor={colors.accent}
            />
          }
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.brand}>
              <View style={styles.brandMark}>
                <Text style={styles.brandMarkText}>F</Text>
              </View>

              <View style={styles.brandCopy}>
                <Text style={styles.brandName}>Future Pressroom AI</Text>
                <Text style={styles.brandTagline}>صحافة المستقبل تبدأ هنا</Text>
              </View>
            </View>

            <View style={styles.smartBadge}>
              <Text style={styles.smartBadgeText}>تغطية ذكية</Text>
            </View>
          </View>
          <View style={styles.divider} />

          <HomeNewsFeed
            onRefreshComplete={handleRefreshComplete}
            refreshKey={refreshKey}
          />
        </ScrollView>
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
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.two,
      paddingBottom: BottomTabInset + Spacing.five,
    },
    header: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.two,
    },
    brand: {
      flex: 1,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: Spacing.two,
    },
    brandMark: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      backgroundColor: colors.primary,
      borderWidth: 1,
      borderColor: colors.accent,
    },
    brandMarkText: {
      color: colors.accent,
      fontSize: 22,
      fontWeight: '800',
    },
    brandCopy: {
      flex: 1,
      alignItems: 'flex-end',
    },
    brandName: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '800',
      textAlign: 'right',
    },
    brandTagline: {
      marginTop: 2,
      color: colors.textSecondary,
      fontSize: 12,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    smartBadge: {
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: colors.backgroundSelected,
    },
    smartBadgeText: {
      color: colors.accentDark,
      fontSize: 11,
      fontWeight: '700',
      writingDirection: 'rtl',
    },
    divider: {
      height: 1,
      marginVertical: Spacing.three,
      backgroundColor: colors.border,
    },
    sectionHeading: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.three,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '800',
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    sectionLabel: {
      color: colors.accent,
      fontSize: 13,
      fontWeight: '700',
      writingDirection: 'rtl',
    },
    heroCard: {
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      backgroundColor: colors.backgroundElement,
    },
    heroImage: {
      height: 190,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    heroImageText: {
      color: colors.accent,
      fontSize: 14,
      fontWeight: '800',
      letterSpacing: 1.5,
    },
    breakingBadge: {
      position: 'absolute',
      top: Spacing.three,
      right: Spacing.three,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.breaking,
    },
    breakingText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '800',
      writingDirection: 'rtl',
    },
    heroContent: {
      padding: Spacing.three,
      alignItems: 'flex-end',
    },
    heroCategory: {
      color: colors.accent,
      fontSize: 13,
      fontWeight: '800',
      writingDirection: 'rtl',
    },
    heroTitle: {
      marginTop: Spacing.two,
      color: colors.text,
      fontSize: 22,
      fontWeight: '800',
      lineHeight: 34,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    heroSummary: {
      marginTop: Spacing.two,
      color: colors.textSecondary,
      fontSize: 15,
      lineHeight: 25,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    heroTime: {
      marginTop: Spacing.three,
      color: colors.textSecondary,
      fontSize: 12,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    latestHeader: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: Spacing.five,
      marginBottom: Spacing.three,
    },
    latestTitle: {
      color: colors.text,
      fontSize: 21,
      fontWeight: '800',
      writingDirection: 'rtl',
    },
    viewAll: {
      color: colors.accent,
      fontSize: 13,
      fontWeight: '700',
      writingDirection: 'rtl',
    },
    articleList: {
      gap: Spacing.three,
    },
    articleCard: {
      flexDirection: 'row-reverse',
      gap: Spacing.three,
      paddingBottom: Spacing.three,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    articleThumbnail: {
      width: 92,
      minHeight: 92,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor: colors.primary,
    },
    thumbnailLetter: {
      color: colors.accent,
      fontSize: 28,
      fontWeight: '800',
    },
    articleContent: {
      flex: 1,
      alignItems: 'flex-end',
    },
    articleCategory: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: '800',
      writingDirection: 'rtl',
    },
    articleTitle: {
      marginTop: 5,
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
      lineHeight: 25,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    articleTime: {
      marginTop: 7,
      color: colors.textSecondary,
      fontSize: 11,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
  });
}