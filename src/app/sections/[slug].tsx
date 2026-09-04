import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { ComponentProps } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, Colors, Spacing } from '@/constants/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type CategoryDetails = {
  title: string;
  description: string;
  icon: IconName;
  color: string;
};

const categoryDetails = {
  health: {
    title: 'صحة',
    description: 'أخبار الصحة والتوعية الطبية وأنماط الحياة السليمة',
    icon: 'medkit-outline',
    color: '#2F7D61',
  },
  'culture-arts': {
    title: 'ثقافة وفن',
    description: 'كتب وفنون وإبداع ومشهد ثقافي عربي وعالمي',
    icon: 'color-palette-outline',
    color: '#885A8C',
  },
  society: {
    title: 'أحداث وقضايا',
    description: 'قضايا المجتمع والموضوعات التي تشغل الرأي العام',
    icon: 'calendar-outline',
    color: '#A34E42',
  },
  'social-media': {
    title: 'سوشيال ميديا',
    description: 'أبرز القصص والاتجاهات المتداولة على المنصات',
    icon: 'chatbubbles-outline',
    color: '#4F6FAE',
  },
} satisfies Record<string, CategoryDetails>;

type CategorySlug = keyof typeof categoryDetails;

function isCategorySlug(value: string): value is CategorySlug {
  return value in categoryDetails;
}

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string | string[] }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const styles = createStyles(colors);

  const requestedSlug = Array.isArray(slug) ? slug[0] : slug;
  const category =
    requestedSlug && isCategorySlug(requestedSlug)
      ? categoryDetails[requestedSlug]
      : null;

  return (
    <View style={styles.screen}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <View style={styles.heading}>
              <Text style={styles.eyebrow}>منوعات</Text>
              <Text style={styles.title}>
                {category?.title ?? 'القسم غير موجود'}
              </Text>
            </View>

            <Pressable
              accessibilityLabel="العودة إلى منوعات"
              accessibilityRole="button"
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}>
              <Ionicons
                color={colors.accent}
                name="arrow-forward"
                size={24}
              />
            </Pressable>
          </View>

          {category ? (
            <>
              <View style={styles.categoryIntro}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: `${category.color}20` },
                  ]}>
                  <Ionicons
                    color={category.color}
                    name={category.icon}
                    size={34}
                  />
                </View>

                <Text style={styles.description}>
                  {category.description}
                </Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>أحدث الأخبار</Text>

              <View style={styles.emptyCard}>
                <Ionicons
                  color={colors.accent}
                  name="newspaper-outline"
                  size={32}
                />
                <Text style={styles.emptyTitle}>لا توجد مواد منشورة بعد</Text>
                <Text style={styles.emptyDescription}>
                  ستظهر أحدث مواد هذا القسم هنا فور توفرها.
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons
                color={colors.textSecondary}
                name="alert-circle-outline"
                size={34}
              />
              <Text style={styles.emptyTitle}>تعذر العثور على هذا القسم</Text>
            </View>
          )}
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
      flexGrow: 1,
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.three,
      paddingBottom: BottomTabInset + Spacing.five,
    },
    topBar: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.three,
    },
    heading: {
      flex: 1,
      alignItems: 'flex-end',
    },
    eyebrow: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    title: {
      marginTop: Spacing.one,
      color: colors.accent,
      fontSize: 30,
      fontWeight: '800',
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    backButton: {
      width: 46,
      height: 46,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 15,
      backgroundColor: colors.backgroundElement,
    },
    pressed: {
      opacity: 0.65,
    },
    categoryIntro: {
      alignItems: 'flex-end',
      gap: Spacing.three,
      marginTop: Spacing.four,
      padding: Spacing.four,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      backgroundColor: colors.backgroundElement,
    },
    categoryIcon: {
      width: 64,
      height: 64,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    },
    description: {
      color: colors.textSecondary,
      fontSize: 16,
      lineHeight: 27,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    divider: {
      height: 1,
      marginVertical: Spacing.four,
      backgroundColor: colors.border,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 24,
      fontWeight: '800',
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    emptyCard: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.two,
      marginTop: Spacing.three,
      paddingHorizontal: Spacing.four,
      paddingVertical: Spacing.six,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      backgroundColor: colors.backgroundElement,
    },
    emptyTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
      textAlign: 'center',
      writingDirection: 'rtl',
    },
    emptyDescription: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 23,
      textAlign: 'center',
      writingDirection: 'rtl',
    },
  });
}