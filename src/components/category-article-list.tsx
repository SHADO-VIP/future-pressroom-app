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

type CategoryArticleListProps = {
    category: string;
    refreshKey?: number;
    onRefreshComplete?: () => void;
};

type LoadResult = {
    category: string;
    articles: PublishedArticle[];
    page: number;
    totalPages: number;
    failed: boolean;
};

function formatPublishedDate(value: string) {
    return new Date(value).toLocaleDateString('ar-AE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export function CategoryArticleList({
    category,
    refreshKey = 0,
    onRefreshComplete,
}: CategoryArticleListProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const styles = createStyles(colors);
    const [result, setResult] = useState<LoadResult | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadMoreFailed, setLoadMoreFailed] = useState(false);

    useEffect(() => {
        let isActive = true;
        const controller = new AbortController();

        getPublishedArticles({
            category,
            limit: 20,
            signal: controller.signal,
        })
            .then(({ articles, pagination }) => {
                setResult({
                    category,
                    articles,
                    page: pagination.page,
                    totalPages: pagination.totalPages,
                    failed: false,
                });
            })
            .catch((error: unknown) => {
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }

                setResult({
                    category,
                    articles: [],
                    page: 1,
                    totalPages: 0,
                    failed: true,
                });
            })
            .finally(() => {
                if (isActive) {
                    onRefreshComplete?.();
                }
            });

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [category, onRefreshComplete, refreshKey]);

    const currentResult = result?.category === category ? result : null;
    async function handleLoadMore() {
        if (
            !currentResult ||
            isLoadingMore ||
            currentResult.page >= currentResult.totalPages
        ) {
            return;
        }

        setIsLoadingMore(true);
        setLoadMoreFailed(false);

        try {
            const { articles, pagination } = await getPublishedArticles({
                category,
                page: currentResult.page + 1,
                limit: 20,
            });

            setResult((current) => {
                if (!current || current.category !== category) {
                    return current;
                }

                const existingIds = new Set(
                    current.articles.map((article) => article.id),
                );
                const newArticles = articles.filter(
                    (article) => !existingIds.has(article.id),
                );

                return {
                    ...current,
                    articles: [...current.articles, ...newArticles],
                    page: pagination.page,
                    totalPages: pagination.totalPages,
                    failed: false,
                };
            });
        } catch {
            setLoadMoreFailed(true);
        } finally {
            setIsLoadingMore(false);
        }
    }
    if (!currentResult) {
        return (
            <View style={styles.messageCard}>
                <ActivityIndicator color={colors.accent} size="large" />
                <Text style={styles.messageText}>جارٍ تحميل الأخبار...</Text>
            </View>
        );
    }

    if (currentResult.failed) {
        return (
            <View style={styles.messageCard}>
                <Text style={styles.errorTitle}>تعذر تحميل الأخبار</Text>
                <Text style={styles.messageText}>
                    تحقق من اتصال الهاتف والخادم ثم أعد المحاولة.
                </Text>
            </View>
        );
    }

    if (currentResult.articles.length === 0) {
        return (
            <View style={styles.messageCard}>
                <Text style={styles.emptyTitle}>لا توجد مواد منشورة بعد</Text>
                <Text style={styles.messageText}>
                    ستظهر أحدث مواد هذا القسم هنا فور توفرها.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.articleList}>
            {currentResult.articles.map((article) => (
                <Link
                    key={article.id}
                    href={{
                        pathname: '/articles/[slug]',
                        params: {
                            slug: article.newsItem.seoMetadata.slug,
                            category: article.newsItem.category.slug,
                        },
                    }}
                    asChild>
                    <Pressable
                        accessibilityLabel={`فتح المقال ${article.finalDraft.titleAr}`}
                        accessibilityRole="button"
                        style={styles.articleCard}>
                        {article.selectedImage?.imageUrl ? (
                            <Image
                                accessibilityLabel={
                                    article.selectedImage.altText ?? article.finalDraft.titleAr
                                }
                                contentFit="cover"
                                source={{ uri: article.selectedImage.imageUrl }}
                                style={styles.articleImage}
                            />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Text style={styles.placeholderLetter}>F</Text>
                            </View>
                        )}

                        <View style={styles.articleContent}>
                            <Text style={styles.articleTitle}>
                                {article.finalDraft.titleAr}
                            </Text>

                            <Text numberOfLines={3} style={styles.articleSummary}>
                                {article.finalDraft.summaryAr}
                            </Text>

                            <View style={styles.articleMeta}>
                                <Text style={styles.metaText}>
                                    {formatPublishedDate(article.publishedAt)}
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                </Link>
            ))}
            {currentResult.page < currentResult.totalPages ? (
                <Pressable
                    accessibilityRole="button"
                    disabled={isLoadingMore}
                    onPress={handleLoadMore}
                    style={({ pressed }) => [
                        styles.loadMoreButton,
                        pressed && !isLoadingMore && styles.loadMoreButtonPressed,
                    ]}>
                    {isLoadingMore ? (
                        <ActivityIndicator color={colors.background} size="small" />
                    ) : (
                        <Text style={styles.loadMoreText}>
                            {loadMoreFailed ? 'تعذر التحميل، حاول مرة أخرى' : 'تحميل المزيد'}
                        </Text>
                    )}
                </Pressable>
            ) : null}
        </View>
    );
}

function createStyles(colors: typeof Colors.light | typeof Colors.dark) {
    return StyleSheet.create({
        articleList: {
            gap: Spacing.three,
            marginTop: Spacing.three,
        },
        loadMoreButton: {
            minHeight: 50,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: Spacing.three,
            borderRadius: 16,
            backgroundColor: colors.accent,
        },
        loadMoreButtonPressed: {
            opacity: 0.7,
        },
        loadMoreText: {
            color: colors.background,
            fontSize: 14,
            fontWeight: '800',
            textAlign: 'center',
            writingDirection: 'rtl',
        },
        articleCard: {
            flexDirection: 'row-reverse',
            alignItems: 'stretch',
            gap: Spacing.three,
            padding: Spacing.three,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 20,
            backgroundColor: colors.backgroundElement,
        },
        articleImage: {
            width: 112,
            minHeight: 132,
            borderRadius: 16,
            backgroundColor: colors.backgroundSelected,
        },
        imagePlaceholder: {
            width: 112,
            minHeight: 132,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 16,
            backgroundColor: colors.backgroundSelected,
        },
        placeholderLetter: {
            color: colors.accent,
            fontSize: 36,
            fontWeight: '800',
        },
        articleContent: {
            flex: 1,
            alignItems: 'flex-end',
        },
        articleTitle: {
            color: colors.text,
            fontSize: 17,
            fontWeight: '800',
            lineHeight: 26,
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        articleSummary: {
            marginTop: Spacing.two,
            color: colors.textSecondary,
            fontSize: 13,
            lineHeight: 21,
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        articleMeta: {
            width: '100%',
            flexDirection: 'row-reverse',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: Spacing.one,
            marginTop: Spacing.three,
        },
        metaText: {
            color: colors.textSecondary,
            fontSize: 11,
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        messageCard: {
            minHeight: 180,
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.two,
            marginTop: Spacing.three,
            padding: Spacing.four,
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