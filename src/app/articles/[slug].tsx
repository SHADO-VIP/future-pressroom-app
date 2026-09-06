import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import {
    getPublishedArticle,
    type PublishedArticle,
} from '@/services/articles';
import {
    isArticleBookmarked,
    toggleArticleBookmark,
} from '@/services/bookmarks';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    View,
    useColorScheme,
    useWindowDimensions,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoadResult = {
    slug: string;
    article: PublishedArticle | null;
    failed: boolean;
};

function formatPublishedDate(value: string) {
    return new Date(value).toLocaleDateString('ar-AE-u-nu-latn', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function convertHtmlToText(value: string) {
    return value
        .replace(/<\/p>/gu, '\n\n')
        .replace(/<br\s*\/?>/gu, '\n')
        .replace(/<[^>]+>/gu, '')

        .replace(/&nbsp;/gu, ' ')
        .replace(/&quot;/gu, '"')
        .replace(/&#39;/gu, "'")
        .replace(/&amp;/gu, '&')
        .trim();
}
const PUBLIC_SITE_URL = process.env.EXPO_PUBLIC_SITE_URL?.replace(/\/+$/u, '');

async function shareArticle(article: PublishedArticle) {
    const articleSlug = article.newsItem.seoMetadata.slug;
    const articleUrl = PUBLIC_SITE_URL
        ? `${PUBLIC_SITE_URL}/articles/${encodeURIComponent(articleSlug)}`
        : '';

    const message = articleUrl
        ? `${article.finalDraft.titleAr}\n\n${articleUrl}`
        : article.finalDraft.titleAr;

    await Share.share({
        message,
        title: article.finalDraft.titleAr,
    });
}
export default function ArticleScreen() {
    const { slug, category, from, search } = useLocalSearchParams<{
        slug: string | string[];
        category?: string | string[];
        from?: string | string[];
        search?: string | string[];
    }>();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const styles = createStyles(colors);
    const requestedSlug = Array.isArray(slug) ? slug[0] : slug;
    const requestedCategory = Array.isArray(category)
        ? category[0]
        : category;
    const requestedFrom = Array.isArray(from) ? from[0] : from;
    const requestedSearch = Array.isArray(search) ? search[0] : search;
    const [result, setResult] = useState<LoadResult | null>(null);

    useEffect(() => {
        if (!requestedSlug) {
            return;
        }

        const controller = new AbortController();

        getPublishedArticle(requestedSlug, controller.signal)
            .then((article) => {
                setResult({
                    slug: requestedSlug,
                    article,
                    failed: false,
                });
            })
            .catch((error: unknown) => {
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }

                setResult({
                    slug: requestedSlug,
                    article: null,
                    failed: true,
                });
            });

        return () => controller.abort();
    }, [requestedSlug]);

    const currentResult =
        result?.slug === requestedSlug ? result : null;

    return (
        <View style={styles.screen}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.topBar}>
                        <Text style={styles.brand}>Future Pressroom AI</Text>

                        <Pressable
                            accessibilityLabel="العودة إلى الأخبار"
                            accessibilityRole="button"
                            onPress={() => {
                                if (requestedFrom === 'bookmarks') {
                                    router.replace('/bookmarks');
                                    return;
                                }
                                if (requestedFrom === 'search') {
                                    router.replace({
                                        pathname: '/search',
                                        params: requestedSearch ? { q: requestedSearch } : {},
                                    });
                                    return;
                                }
                                if (requestedFrom === 'home') {
                                    router.replace('/');
                                    return;
                                }

                                if (requestedCategory) {
                                    router.replace({
                                        pathname: '/sections/[slug]',
                                        params: { slug: requestedCategory },
                                    });
                                    return;
                                }

                                router.replace('/sections');
                            }}
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

                    {!currentResult ? (
                        <View style={styles.messageCard}>
                            <ActivityIndicator color={colors.accent} size="large" />
                            <Text style={styles.messageText}>جارٍ تحميل المقال...</Text>
                        </View>
                    ) : currentResult.failed || !currentResult.article ? (
                        <View style={styles.messageCard}>
                            <Ionicons
                                color={colors.breaking}
                                name="alert-circle-outline"
                                size={34}
                            />
                            <Text style={styles.errorTitle}>تعذر تحميل المقال</Text>
                            <Text style={styles.messageText}>
                                تحقق من اتصال الهاتف والخادم ثم أعد المحاولة.
                            </Text>
                        </View>
                    ) : (
                        <ArticleContent
                            accentColor={colors.accent}
                            article={currentResult.article}
                            styles={styles}
                        />
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

type ArticleContentProps = {
    article: PublishedArticle;
    accentColor: string;
    styles: ReturnType<typeof createStyles>;
};

function ArticleContent({
    article,
    accentColor,
    styles,
}: ArticleContentProps) {
    const { width } = useWindowDimensions();
    const contentWidth = width - Spacing.three * 2;
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(true);
    const articleSlug = article.newsItem.seoMetadata.slug;

    useEffect(() => {
        let isActive = true;

        isArticleBookmarked(articleSlug)
            .then((saved) => {
                if (isActive) {
                    setIsBookmarked(saved);
                }
            })
            .finally(() => {
                if (isActive) {
                    setIsBookmarkLoading(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, [articleSlug]);

    async function handleBookmark() {
        if (isBookmarkLoading) {
            return;
        }

        setIsBookmarkLoading(true);

        try {
            const saved = await toggleArticleBookmark(article);
            setIsBookmarked(saved);
        } finally {
            setIsBookmarkLoading(false);
        }
    }
    return (
        <View style={styles.article}>
            <Text style={styles.category}>
                {article.newsItem.category.nameAr}
            </Text>

            <Text style={styles.title}>{article.finalDraft.titleAr}</Text>

            <Text style={styles.date}>
                {formatPublishedDate(article.publishedAt)}
            </Text>
            <View style={styles.articleActions}>
                <Pressable
                    accessibilityLabel="مشاركة المقال"
                    accessibilityRole="button"
                    onPress={() => {
                        void shareArticle(article);
                    }}
                    style={({ pressed }) => [
                        styles.shareButton,
                        pressed && styles.pressed,
                    ]}>
                    <Ionicons color="#FFFFFF" name="share-social-outline" size={20} />
                    <Text style={styles.shareButtonText}>مشاركة</Text>
                </Pressable>

                <Pressable
                    accessibilityLabel={
                        isBookmarked ? 'إزالة المقال من المحفوظات' : 'حفظ المقال'
                    }
                    accessibilityRole="button"
                    disabled={isBookmarkLoading}
                    onPress={() => {
                        void handleBookmark();
                    }}
                    style={({ pressed }) => [
                        styles.bookmarkButton,
                        pressed && styles.pressed,
                        isBookmarkLoading && styles.disabledButton,
                    ]}>
                    {isBookmarkLoading ? (
                        <ActivityIndicator color={accentColor} size="small" />
                    ) : (
                        <Ionicons
                            color={accentColor}
                            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                            size={20}
                        />
                    )}
                    <Text style={styles.bookmarkButtonText}>
                        {isBookmarked ? 'محفوظ' : 'حفظ'}
                    </Text>
                </Pressable>
            </View>
            {article.selectedImage?.imageUrl ? (
                <Image
                    accessibilityLabel={
                        article.selectedImage.altText ?? article.finalDraft.titleAr
                    }
                    contentFit="cover"
                    source={{ uri: article.selectedImage.imageUrl }}
                    style={styles.image}
                />
            ) : null}


            <Text style={styles.summary}>{article.finalDraft.summaryAr}</Text>

            {article.finalDraft.keyPoints.length > 0 ? (
                <View style={styles.keyPoints}>
                    <Text style={styles.sectionTitle}>أبرز النقاط</Text>

                    {article.finalDraft.keyPoints.map((point) => (
                        <View key={point} style={styles.keyPointRow}>
                            <View style={styles.bullet} />
                            <Text style={styles.keyPointText}>{point}</Text>
                        </View>
                    ))}
                </View>
            ) : null}
            <RenderHTML
                baseStyle={styles.body}
                contentWidth={contentWidth}
                source={{ html: article.finalDraft.contentAr }}
                tagsStyles={{
                    a: {
                        color: accentColor,
                        fontWeight: '800',
                        textDecorationLine: 'underline',
                    },
                    blockquote: {
                        marginHorizontal: 0,
                        marginVertical: Spacing.three,
                    },
                    p: {
                        marginTop: 0,
                        marginBottom: Spacing.three,
                        textAlign: 'right',
                    },
                }}
            />

            {article.finalDraft.analysisAr ? (
                <View style={styles.analysis}>
                    <Text style={styles.sectionTitle}>قراءة تحليلية</Text>
                    <Text style={styles.body}>
                        {convertHtmlToText(article.finalDraft.analysisAr)}
                    </Text>
                </View>
            ) : null}
            {article.finalDraft.sourceCredit ? (
                <Text style={styles.sourceCredit}>
                    المصدر: {article.finalDraft.sourceCredit}
                </Text>
            ) : null}
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
            paddingBottom: Spacing.three,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        brand: {
            color: colors.accent,
            fontSize: 18,
            fontWeight: '800',
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
        messageCard: {
            minHeight: 260,
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
        messageText: {
            color: colors.textSecondary,
            fontSize: 14,
            lineHeight: 23,
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
        article: {
            alignItems: 'stretch',
            marginTop: Spacing.four,
        },
        category: {
            color: colors.accent,
            fontSize: 14,
            fontWeight: '800',
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        title: {
            marginTop: Spacing.two,
            color: colors.text,
            fontSize: 26,
            fontWeight: '800',
            lineHeight: 38,
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        date: {
            marginTop: Spacing.two,
            color: colors.textSecondary,
            fontSize: 12,
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        articleActions: {
            alignSelf: 'flex-end',
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: Spacing.two,
            marginTop: Spacing.three,
        },
        bookmarkButton: {
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: Spacing.two,
            paddingHorizontal: Spacing.three,
            paddingVertical: Spacing.two,
            borderWidth: 1,
            borderColor: colors.accent,
            borderRadius: 14,
            backgroundColor: colors.backgroundElement,
        },
        bookmarkButtonText: {
            color: colors.accent,
            fontSize: 13,
            fontWeight: '800',
            writingDirection: 'rtl',
        },
        disabledButton: {
            opacity: 0.55,
        },
        shareButton: {
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: Spacing.two,
            paddingHorizontal: Spacing.three,
            paddingVertical: Spacing.two,
            borderRadius: 14,
            backgroundColor: colors.accent,
        },
        shareButtonText: {
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: '800',
            writingDirection: 'rtl',
        },
        image: {
            width: '100%',
            aspectRatio: 4 / 3,
            marginTop: Spacing.four,
            borderRadius: 20,
            backgroundColor: colors.backgroundElement,
        },

        summary: {
            marginTop: Spacing.four,
            color: colors.text,
            fontSize: 18,
            fontWeight: '600',
            lineHeight: 29,
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        sourceCredit: {
            marginTop: Spacing.three,
            color: colors.accent,
            fontSize: 13,
            fontWeight: '700',
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        keyPoints: {
            gap: Spacing.two,
            marginTop: Spacing.four,
            padding: Spacing.three,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 20,
            backgroundColor: colors.backgroundElement,
        },
        sectionTitle: {
            color: colors.accent,
            fontSize: 20,
            fontWeight: '800',
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        keyPointRow: {
            flexDirection: 'row-reverse',
            alignItems: 'flex-start',
            gap: Spacing.two,
        },
        bullet: {
            width: 7,
            height: 7,
            marginTop: 9,
            borderRadius: 4,
            backgroundColor: colors.accent,
        },
        keyPointText: {
            flex: 1,
            color: colors.text,
            fontSize: 15,
            lineHeight: 25,
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        body: {
            marginTop: Spacing.four,
            color: colors.text,
            fontSize: 17,
            lineHeight: 31,
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        xPostButton: {
            alignSelf: 'flex-end',
            flexDirection: 'row-reverse',
            alignItems: 'center',
            gap: Spacing.two,
            marginTop: Spacing.three,
            paddingHorizontal: Spacing.three,
            paddingVertical: Spacing.two,
            borderRadius: 14,
            backgroundColor: colors.accent,
        },
        xPostButtonText: {
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: '800',
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        analysis: {
            marginTop: Spacing.five,
            paddingTop: Spacing.four,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
    });
}