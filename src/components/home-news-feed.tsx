import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import {
    getPublishedArticles,
    type PublishedArticle,
} from '@/services/articles';

type LoadResult = {
  articles: PublishedArticle[];
  failed: boolean;
};

function formatPublishedDate(value: string) {
  return new Date(value).toLocaleDateString('ar-AE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function createArticleHref(article: PublishedArticle) {
  return {
    pathname: '/articles/[slug]' as const,
    params: {
      slug: article.newsItem.seoMetadata.slug,
      category: article.newsItem.category.slug,
     from: 'home',
    },
  };
}

export function HomeNewsFeed() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const styles = createStyles(colors);
  const [result, setResult] = useState<LoadResult | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getPublishedArticles({
      limit: 8,
      signal: controller.signal,
    })
      .then(({ articles }) => {
        setResult({
          articles,
          failed: false,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        setResult({
          articles: [],
          failed: true,
        });
      });

    return () => controller.abort();
  }, []);

  if (!result) {
    return (
      <View style={styles.messageCard}>
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={styles.messageText}>جارٍ تحميل الأخبار...</Text>
      </View>
    );
  }

  if (result.failed) {
    return (
      <View style={styles.messageCard}>
        <Text style={styles.errorTitle}>تعذر تحميل الأخبار</Text>
        <Text style={styles.messageText}>
          تحقق من اتصال الهاتف والخادم ثم أعد المحاولة.
        </Text>
      </View>
    );
  }

  if (result.articles.length === 0) {
    return (
      <View style={styles.messageCard}>
        <Text style={styles.messageTitle}>لا توجد أخبار منشورة بعد</Text>
      </View>
    );
  }

  const featuredArticle = result.articles[0];
  const latestArticles = result.articles.slice(1);

  return (
    <>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>أبرز الأخبار</Text>
        <Text style={styles.sectionLabel}>الرئيسية</Text>
      </View>

      <Link href={createArticleHref(featuredArticle)} asChild>
        <Pressable
          accessibilityLabel={`فتح المقال ${featuredArticle.finalDraft.titleAr}`}
          accessibilityRole="button"
          style={styles.heroCard}>
          <View style={styles.heroImageContainer}>
            {featuredArticle.selectedImage?.imageUrl ? (
              <Image
                accessibilityLabel={
                  featuredArticle.selectedImage.altText ??
                  featuredArticle.finalDraft.titleAr
                }
                contentFit="cover"
                source={{ uri: featuredArticle.selectedImage.imageUrl }}
                style={styles.heroImage}
              />
            ) : (
              <View style={styles.heroPlaceholder}>
                <Text style={styles.heroPlaceholderText}>
                  FUTURE PRESSROOM
                </Text>
              </View>
            )}

            {featuredArticle.newsItem.priority === 'breaking' ? (
              <View style={styles.breakingBadge}>
                <Text style={styles.breakingText}>عاجل</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroCategory}>
              {featuredArticle.newsItem.category.nameAr}
            </Text>

            <Text style={styles.heroTitle}>
              {featuredArticle.finalDraft.titleAr}
            </Text>

            <Text numberOfLines={3} style={styles.heroSummary}>
              {featuredArticle.finalDraft.summaryAr}
            </Text>

            <Text style={styles.articleDate}>
              {formatPublishedDate(featuredArticle.publishedAt)}
            </Text>
          </View>
        </Pressable>
      </Link>

      <View style={styles.latestHeader}>
        <Text style={styles.latestTitle}>أحدث الأخبار</Text>
      </View>

      <View style={styles.articleList}>
        {latestArticles.map((article) => (
          <Link
            key={article.id}
            href={createArticleHref(article)}
            asChild>
            <Pressable
              accessibilityLabel={`فتح المقال ${article.finalDraft.titleAr}`}
              accessibilityRole="button"
              style={styles.articleCard}>
              {article.selectedImage?.imageUrl ? (
                <Image
                  accessibilityLabel={
                    article.selectedImage.altText ??
                    article.finalDraft.titleAr
                  }
                  contentFit="cover"
                  source={{ uri: article.selectedImage.imageUrl }}
                  style={styles.articleThumbnail}
                />
              ) : (
                <View style={styles.articlePlaceholder}>
                  <Text style={styles.thumbnailLetter}>F</Text>
                </View>
              )}

              <View style={styles.articleContent}>
                <Text style={styles.articleCategory}>
                  {article.newsItem.category.nameAr}
                </Text>

                <Text numberOfLines={3} style={styles.articleTitle}>
                  {article.finalDraft.titleAr}
                </Text>

                <Text style={styles.articleDate}>
                  {formatPublishedDate(article.publishedAt)}
                </Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </View>
    </>
  );
}

function createStyles(colors: typeof Colors.light | typeof Colors.dark) {
  return StyleSheet.create({
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
    heroImageContainer: {
      height: 210,
      backgroundColor: colors.primary,
    },
    heroImage: {
      width: '100%',
      height: '100%',
    },
    heroPlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroPlaceholderText: {
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
      alignItems: 'flex-end',
      padding: Spacing.three,
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
    latestHeader: {
      alignItems: 'flex-end',
      marginTop: Spacing.five,
      marginBottom: Spacing.three,
    },
    latestTitle: {
      color: colors.text,
      fontSize: 21,
      fontWeight: '800',
      textAlign: 'right',
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
      minHeight: 100,
      borderRadius: 16,
      backgroundColor: colors.primary,
    },
    articlePlaceholder: {
      width: 92,
      minHeight: 100,
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
    articleDate: {
      marginTop: Spacing.two,
      color: colors.textSecondary,
      fontSize: 11,
      textAlign: 'right',
      writingDirection: 'rtl',
    },
    messageCard: {
      minHeight: 260,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.two,
      padding: Spacing.four,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      backgroundColor: colors.backgroundElement,
    },
    messageTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
      textAlign: 'center',
      writingDirection: 'rtl',
    },
    errorTitle: {
      color: colors.breaking,
      fontSize: 18,
      fontWeight: '800',
      textAlign: 'center',
      writingDirection: 'rtl',
    },
    messageText: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 23,
      textAlign: 'center',
      writingDirection: 'rtl',
    },
  });
}