import AsyncStorage from '@react-native-async-storage/async-storage';

import type { PublishedArticle } from '@/services/articles';

const BOOKMARKS_STORAGE_KEY = 'future-pressroom:bookmarks:v1';

export async function getBookmarkedArticles() {
    const storedValue = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);

    if (!storedValue) {
        return [] as PublishedArticle[];
    }

    try {
        const parsedValue = JSON.parse(storedValue) as unknown;

        if (!Array.isArray(parsedValue)) {
            return [] as PublishedArticle[];
        }

        return parsedValue as PublishedArticle[];
    } catch {
        return [] as PublishedArticle[];
    }
}

export async function isArticleBookmarked(articleSlug: string) {
    const articles = await getBookmarkedArticles();

    return articles.some(
        (article) => article.newsItem.seoMetadata.slug === articleSlug,
    );
}

export async function toggleArticleBookmark(article: PublishedArticle) {
    const articles = await getBookmarkedArticles();
    const articleSlug = article.newsItem.seoMetadata.slug;
    const isAlreadyBookmarked = articles.some(
        (savedArticle) =>
            savedArticle.newsItem.seoMetadata.slug === articleSlug,
    );

    const updatedArticles = isAlreadyBookmarked
        ? articles.filter(
            (savedArticle) =>
                savedArticle.newsItem.seoMetadata.slug !== articleSlug,
        )
        : [article, ...articles];

    await AsyncStorage.setItem(
        BOOKMARKS_STORAGE_KEY,
        JSON.stringify(updatedArticles),
    );

    return !isAlreadyBookmarked;
}