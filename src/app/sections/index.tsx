import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
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

type Category = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  color: string;
  href?: '/sections/variety';
};

const categories: Category[] = [
  {
    id: 'local-global',
    title: 'المشهد العربي والعالمي',
    description: 'أهم الأخبار والتطورات المحلية والدولية',
    icon: 'globe-outline',
    color: '#B88A35',
  },
  {
    id: 'politics',
    title: 'سياسة',
    description: 'قراءة في القرارات والتحولات السياسية',
    icon: 'business-outline',
    color: '#9B2C35',
  },
  {
    id: 'economy',
    title: 'اقتصاد',
    description: 'الأسواق والأعمال والمؤشرات الاقتصادية',
    icon: 'trending-up-outline',
    color: '#2F7D61',
  },
  {
    id: 'technology-ai',
    title: 'تكنولوجيا وذكاء اصطناعي',
    description: 'الابتكار والتقنيات التي تصنع المستقبل',
    icon: 'hardware-chip-outline',
    color: '#4F6FAE',
  },
  {
    id: 'opinions',
    title: 'آراء ومقالات',
    description: 'تحليلات ووجهات نظر معمقة',
    icon: 'create-outline',
    color: '#8F6826',
  },
  {
    id: 'sports',
    title: 'رياضة',
    description: 'أبرز المنافسات والنتائج الرياضية',
    icon: 'football-outline',
    color: '#3B7C87',
  },
  {
    id: 'miscellaneous',
    title: 'منوعات',
    description: 'ثقافة ومجتمع وموضوعات متنوعة',
    icon: 'albums-outline',
    color: '#885A8C',
    href: '/sections/variety',
  },
  {
    id: 'video',
    title: 'فيديو',
    description: 'تقارير ومواد مرئية مختارة',
    icon: 'videocam-outline',
    color: '#A34E42',
  },
];

export default function SectionsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const styles = createStyles(colors);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>الأقسام</Text>
            <Text style={styles.subtitle}>
              اختر المجال الذي تريد متابعته واطّلع على أحدث الأخبار والتحليلات
            </Text>
          </View>

          <View style={styles.featured}>
            <View style={styles.featuredIcon}>
              <Ionicons color={colors.accent} name="sparkles" size={28} />
            </View>

            <View style={styles.featuredContent}>
              <Text style={styles.featuredLabel}>مختارات المحرر</Text>
              <Text style={styles.featuredTitle}>
                أهم المواد التي تستحق القراءة اليوم
              </Text>
            </View>
          </View>

          <View style={styles.grid}>
            {categories.map((category) => {
              const cardContent = (
                <>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: `${category.color}20` },
                    ]}>
                    <Ionicons
                      color={category.color}
                      name={category.icon}
                      size={27}
                    />
                  </View>

                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                </>
              );

              if (category.href) {
                return (
                  <Link key={category.id} href={category.href} asChild>
                    <Pressable
                      accessibilityRole="button"
                      style={styles.categoryCard}>
                      {cardContent}
                    </Pressable>
                  </Link>
                );
              }

              return (
                <View key={category.id} style={styles.categoryCard}>
                  {cardContent}
                </View>
              );
            })}
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
    header: {
      alignItems: 'flex-end',
    },

    title: {
      color: colors.accent,
      fontSize: 30,
      fontWeight: '800',
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    subtitle: {
      marginTop: Spacing.two,
      maxWidth: 560,
      color: colors.textSecondary,
      fontSize: 15,
      lineHeight: 25,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    featured: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: Spacing.three,
      marginTop: Spacing.four,
      padding: Spacing.three,
      borderWidth: 1,
      borderColor: colors.accent,
      borderRadius: 20,
      backgroundColor: colors.backgroundElement,
    },
    featuredIcon: {
      width: 52,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor: colors.backgroundSelected,
    },
    featuredContent: {
      flex: 1,
      alignItems: 'flex-end',
    },
    featuredLabel: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: '800',
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    featuredTitle: {
      marginTop: 4,
      color: colors.text,
      fontSize: 17,
      fontWeight: '800',
      lineHeight: 26,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    grid: {
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: Spacing.three,
      marginTop: Spacing.four,
    },
    categoryCard: {
      width: '47.8%',
      minHeight: 205,
      alignItems: 'flex-end',
      padding: Spacing.three,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      backgroundColor: colors.backgroundElement,
    },
    categoryIcon: {
      width: 52,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
    },
    categoryTitle: {
      marginTop: Spacing.three,
      color: colors.text,
      fontSize: 17,
      fontWeight: '800',
      lineHeight: 26,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    categoryDescription: {
      marginTop: Spacing.two,
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 20,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
  });
}