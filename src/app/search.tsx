import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, Colors, Spacing } from '@/constants/theme';
import {
    getPublishedArticles,
    type PublishedArticle,
} from '@/services/articles';

type SearchResult = {
    query: string;
    articles: PublishedArticle[];
    failed: boolean;
};

function formatPublishedDate(value: string) {
    const formattedDate = new Date(value).toLocaleDateString('ar-AE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const arabicDigits = '٠١٢٣٤٥٦٧٨٩';

    return formattedDate.replace(/[٠-٩]/gu, (digit) =>
        String(arabicDigits.indexOf(digit)),
    );
}

export default function SearchScreen() {
    const { q } = useLocalSearchParams<{ q?: string | string[] }>();
    const requestedQuery = Array.isArray(q) ? q[0] : q;
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const styles = createStyles(colors);
    const [searchText, setSearchText] = useState(requestedQuery ?? '');
    const [result, setResult] = useState<SearchResult | null>(null);
    const [isSearching, setIsSearching] = useState(Boolean(requestedQuery));

    useEffect(() => {
        if (!requestedQuery) {
            return;
        }

        const controller = new AbortController();

        getPublishedArticles({
            search: requestedQuery,
            limit: 50,
            signal: controller.signal,
        })
            .then(({ articles }) => {
                setResult({
                    query: requestedQuery,
                    articles,
                    failed: false,
                });
            })
            .catch((error: unknown) => {
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }

                setResult({
                    query: requestedQuery,
                    articles: [],
                    failed: true,
                });
            })
            .finally(() => {
                setIsSearching(false);
            });

        return () => controller.abort();
    }, [requestedQuery]);

    async function handleSearch() {
        const query = searchText.trim();

        if (!query || isSearching) {
            return;
        }

        setIsSearching(true);

        try {
            const { articles } = await getPublishedArticles({
                search: query,
                limit: 50,
            });

            setResult({
                query,
                articles,
                failed: false,
            });
        } catch {
            setResult({
                query,
                articles: [],
                failed: true,
            });
        } finally {
            setIsSearching(false);
        }
    }

    return (
        <View style={styles.screen}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.topBar}>
                        <View style={styles.heading}>
                            <Text style={styles.eyebrow}>Future Pressroom AI</Text>
                            <Text style={styles.title}>البحث في الأخبار</Text>
                        </View>

                        <Pressable
                            accessibilityLabel="العودة إلى الأقسام"
                            accessibilityRole="button"
                            onPress={() => router.replace('/sections')}
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

                    <View style={styles.searchBox}>
                        <TextInput
                            accessibilityLabel="عبارة البحث"
                            autoCorrect={false}
                            onChangeText={(value) => {
                                setSearchText(value);

                                if (!value.trim()) {
                                    setResult(null);
                                }
                            }}
                            onSubmitEditing={handleSearch}
                            placeholder="اكتب كلمة أو عنواناً للبحث"
                            placeholderTextColor={colors.textSecondary}
                            returnKeyType="search"
                            style={styles.searchInput}
                            value={searchText}
                        />

                        <Pressable
                            accessibilityLabel="تنفيذ البحث"
                            accessibilityRole="button"
                            disabled={!searchText.trim() || isSearching}
                            onPress={handleSearch}
                            style={({ pressed }) => [
                                styles.searchButton,
                                pressed && styles.pressed,
                            ]}>
                            {isSearching ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Ionicons color="#FFFFFF" name="search" size={22} />
                            )}
                        </Pressable>
                    </View>

                    {!result && !isSearching ? (
                        <View style={styles.messageCard}>
                            <Ionicons
                                color={colors.accent}
                                name="search-outline"
                                size={34}
                            />
                            <Text style={styles.messageTitle}>
                                ابحث في جميع الأخبار المنشورة
                            </Text>
                        </View>
                    ) : null}

                    {result?.failed ? (
                        <View style={styles.messageCard}>
                            <Text style={styles.errorTitle}>تعذر تنفيذ البحث</Text>
                            <Text style={styles.messageText}>
                                تحقق من اتصال الهاتف والخادم ثم أعد المحاولة.
                            </Text>
                        </View>
                    ) : null}

                    {result && !result.failed && result.articles.length === 0 ? (
                        <View style={styles.messageCard}>
                            <Text style={styles.messageTitle}>لا توجد نتائج</Text>
                            <Text style={styles.messageText}>
                                لم نجد أخبارًا مطابقة لعبارة «{result.query}».
                            </Text>
                        </View>
                    ) : null}

                    {result && !result.failed && result.articles.length > 0 ? (
                        <View style={styles.results}>
                            <Text style={styles.resultsTitle}>
                                نتائج البحث عن «{result.query}»
                            </Text>

                            {result.articles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={{
                                        pathname: '/articles/[slug]',
                                        params: {
                                            slug: article.newsItem.seoMetadata.slug,
                                            category: article.newsItem.category.slug,
                                            from: 'search',
                                            search: result.query,
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
                            ))}
                        </View>
                    ) : null}
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
        },
        title: {
            marginTop: Spacing.one,
            color: colors.accent,
            fontSize: Platform.OS === 'android' ? 23 : 28,
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
        searchBox: {
            flexDirection: 'row-reverse',
            gap: Spacing.two,
            marginTop: Spacing.four,
        },
        searchInput: {
            flex: 1,
            minHeight: 52,
            paddingHorizontal: Spacing.three,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 16,
            backgroundColor: colors.backgroundElement,
            color: colors.text,
            fontSize: 15,
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        searchButton: {
            width: 52,
            height: 52,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 16,
            backgroundColor: colors.accent,
        },
        messageCard: {
            minHeight: 220,
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
        results: {
            gap: Spacing.three,
            marginTop: Spacing.four,
        },
        resultsTitle: {
            color: colors.text,
            fontSize: 19,
            fontWeight: '800',
            textAlign: 'right',
            writingDirection: 'rtl',
        },
        articleCard: {
            flexDirection: 'row-reverse',
            gap: Spacing.three,
            padding: Spacing.three,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 20,
            backgroundColor: colors.backgroundElement,
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
    });
}