import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
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

type VarietyCategory = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  color: string;
};

const varietyCategories: VarietyCategory[] = [
  {
    id: 'health',
    title: 'صحة',
    description: 'أخبار الصحة والتوعية الطبية وأنماط الحياة السليمة',
    icon: 'medkit-outline',
    color: '#2F7D61',
  },
  {
    id: 'culture-arts',
    title: 'ثقافة وفن',
    description: 'كتب وفنون وإبداع ومشهد ثقافي عربي وعالمي',
    icon: 'color-palette-outline',
    color: '#885A8C',
  },
  {
    id: 'society',
    title: 'أحداث وقضايا',
    description: 'قضايا المجتمع والموضوعات التي تشغل الرأي العام',
    icon: 'calendar-outline',
    color: '#A34E42',
  },
  {
    id: 'social-media',
    title: 'سوشيال ميديا',
    description: 'أبرز القصص والاتجاهات المتداولة على المنصات',
    icon: 'chatbubbles-outline',
    color: '#4F6FAE',
  },
];

export default function VarietyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const styles = createStyles(colors);

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
              <Text style={styles.title}>اختر القسم</Text>
            </View>

            <Link href="/sections" asChild>
              <Pressable
                accessibilityLabel="العودة إلى الأقسام"
                accessibilityRole="button"
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
            </Link>
          </View>

          <Text style={styles.subtitle}>
            تابع موضوعات الصحة والثقافة والمجتمع وأبرز ما يتداوله الجمهور.
          </Text>

          <View style={styles.divider} />

          <View style={styles.categoryList}>
            {varietyCategories.map((category) => (
              <View key={category.id} style={styles.categoryCard}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: `${category.color}20` },
                  ]}>
                  <Ionicons
                    color={category.color}
                    name={category.icon}
                    size={30}
                  />
                </View>

                <View style={styles.categoryContent}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                </View>

                <Ionicons
                  color={colors.textSecondary}
                  name="chevron-back"
                  size={20}
                />
              </View>
            ))}
          </View>
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
    subtitle: {
      marginTop: Spacing.three,
      color: colors.textSecondary,
      fontSize: 15,
      lineHeight: 25,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    divider: {
      height: 1,
      marginVertical: Spacing.four,
      backgroundColor: colors.border,
    },
    categoryList: {
      gap: Spacing.three,
    },
    categoryCard: {
      minHeight: 118,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: Spacing.three,
      padding: Spacing.three,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      backgroundColor: colors.backgroundElement,
    },
    categoryIcon: {
      width: 58,
      height: 58,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
    },
    categoryContent: {
      flex: 1,
      alignItems: 'flex-end',
    },
    categoryTitle: {
      color: colors.text,
      fontSize: 19,
      fontWeight: '800',
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    categoryDescription: {
      marginTop: Spacing.one,
      color: colors.textSecondary,
      fontSize: 13,
      lineHeight: 21,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
  });
}