import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Link, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import type { PublishedArticle } from '@/services/articles';
import {
    getBookmarkedArticles,
    toggleArticleBookmark,
} from '@/services/bookmarks';

function formatPublishedDate(value: string) {
    return new Date(value).toLocaleDateString('ar-AE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function BookmarksScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const styles = createStyles(colors);
    const [articles, setArticles] = useState<PublishedArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            getBookmarkedArticles()
                .then((savedArticles) => {
                    if (isActive) {
                        setArticles(savedArticles);
                        setFailed(false);
                    }
                })
                .catch(() => {
                    if (isActive) {
                        setFailed(true);
                    }
                })
                .finally(() => {
                    if (isActive) {
                        setIsLoading(false);
                    }
                });

            return () => {
                isActive = false;
            };
        }, []),
    );

    async function handleRemove(article: PublishedArticle) {
        try {
            await toggleArticleBookmark(article);
            setArticles((currentArticles) =>
                currentArticles.filter(
                    (savedArticle) => savedArticle.id !== article.id,
                ),
            );
        } catch {
            setFailed(true);
        }
    }

    return (
        <View style={styles.screen}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.eyebrow}>للقراءة لاحقًا</Text>
                        <Text style={styles.title}>المحفوظات</Text>
                        <Text style={styles.subtitle}>
                            المقالات التي حفظتها للعودة إليها في أي وقت.
                        </Text>
                    </View>

                    {isLoading ? (
                        <View style={styles.messageCard}>
                            <ActivityIndicator color={colors.accent} size="large" />
                            <Text style={styles.messageText}>
                                جارٍ تحميل المقالات المحفوظة...
                            </Text>
                        </View>
                    ) : failed ? (
                        <View style={styles.messageCard}>
                            <Ionicons
                                color={colors.breaking}
                                name="alert-circle-outline"
                                size={34}
                            />
                            <Text style={styles.errorTitle}>تعذر تحميل المحفوظات</Text>
                        </View>
                    ) : articles.length === 0 ? (
                        <View style={styles.messageCard}>
                            <Ionicons
                                color={colors.accent}
                                name="bookmark-outline"
                                size={38}
                            />
                            <Text style={styles.messageTitle}>
                                لا توجد مقالات محفوظة
                            </Text>
                            <Text style={styles.messageText}>
                                افتح أي مقال واضغط «حفظ» ليظهر هنا.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.articleList}>
                            {articles.map((article) => (
                                <View key={article.id} style={styles.articleCard}>
                                    <Link
                                        href={{
                                            pathname: '/articles/[slug]',
                                            params: {
                                                slug: article.newsItem.seoMetadata.slug,
                                                category: article.newsItem.category.slug,
                                                from: 'bookmarks',
                                            },
                                        }}
                                        asChild>
                                        <Pressable
                                            accessibilityLabel={`فتح المقال ${article.finalDraft.titleAr}`}
                                            accessibilityRole="button"
                                            style={styles.articleLink}>
                                            {article.selectedImage?.imageUrl ? (
                                                <Image
                                                    accessibilityLabel={
                                                        article.selectedImage.altText ??
                                                        article.finalDraft.titleAr
                                                    }
                                                    contentFit="cover"
                                                    source={{ uri: article.selectedImage.imageUrl }}
                                                    style={styles.articleImage}
                                                />
                                            ) : (
                                                <View style={styles.imagePlaceholder}>
                                                    <Image
                                                        accessibilityLabel="شعار Future Pressroom AI"
                                                        contentFit="contain"
                                                        source={require('../../assets/images/brand/future-pressroom-icon.png')}
                                                        style={styles.placeholderLogo}
                                                    />
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

                                    <Pressable
                                        accessibilityLabel={`إزالة ${article.finalDraft.titleAr} من المحفوظات`}
                                        accessibilityRole="button"
                                        onPress={() => {
                                            void handleRemove(article);
                                        }}
                                        style={({ pressed }) => [
                                            styles.removeButton,
                                            pressed && styles.pressed,
                                        ]}>
                                        <Ionicons
                                            color={colors.breaking}
                                            name="trash-outline"
                                            size={18}
                                        />
                                        <Text style={styles.removeButtonText}>إزالة</Text>
                                    </Pressable>
                                </View>
                            ))}
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
        header: {
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
        subtitle: {
            marginTop: Spacing.two,
            color: colors.textSecondary,
            fontSize: 15,
            lineHeight: 25,
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        articleList: {
            gap: Spacing.three,
            marginTop: Spacing.four,
        },
        articleCard: {
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 20,
            backgroundColor: colors.backgroundElement,
        },
        articleLink: {
            flexDirection: 'row-reverse',
            gap: Spacing.three,
            padding: Spacing.three,
        },
        articleImage: {
            width: 96,
            minHeight: 110,
            borderRadius: 15,
            backgroundColor: colors.backgroundSelected,
        },
        imagePlaceholder: {
            width: 96,
            minHeight: 110,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
            backgroundColor: colors.backgroundSelected,
        },
        placeholderLogo: {
            width: 68,
            height: 68,
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
            marginTop: Spacing.one,
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
        removeButton: {
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.one,
            minHeight: 44,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        removeButtonText: {
            color: colors.breaking,
            fontSize: 13,
            fontWeight: '700',
            writingDirection: 'rtl',
        },
        pressed: {
            opacity: 0.65,
        },
        messageCard: {
            minHeight: 240,
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.two,
            marginTop: Spacing.four,
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