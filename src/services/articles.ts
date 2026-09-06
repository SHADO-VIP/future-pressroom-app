import { Platform } from 'react-native';
export type PublishedArticle = {
    id: string;
    publishedAt: string;
    finalDraft: {
        articleFormat: 'news' | 'report' | 'opinion';
        titleAr: string;
        sourceCredit: string | null;
        summaryAr: string;
        keyPoints: string[];
        contentAr: string;
        analysisAr: string | null;
        tags: string[];
    };
    selectedImage: {
        imageUrl: string;
        caption: string | null;
        altText: string | null;
    } | null;
    newsItem: {
        priority: 'breaking' | 'high' | 'medium' | 'low';
        category: {
            nameAr: string;
            nameEn: string;
            slug: string;
        };
        source: {
            name: string;
        };
        seoMetadata: {
            slug: string;
        };
    };
};

export type ArticlesPagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

type ArticlesResponse = {
    success: true;
    data: {
        articles: PublishedArticle[];
        pagination: ArticlesPagination;
    };
};

type GetPublishedArticlesOptions = {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    signal?: AbortSignal;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/u, '');

function normalizeArticleImage(article: PublishedArticle) {
    const selectedImage = article.selectedImage;
const imageUrl = selectedImage?.imageUrl;

  if (
    Platform.OS !== 'android' ||
    !imageUrl ||
    !imageUrl.includes('res.cloudinary.com/')
) {
    return article;
}

    const compatibleImageUrl = imageUrl.replace(
        '/image/upload/',
        '/image/upload/f_jpg,q_auto,w_1200,c_limit/',
    );

    return {
        ...article,
        selectedImage: {
            ...selectedImage,
            imageUrl: compatibleImageUrl,
        },
    };
}
export async function getPublishedArticles({
    category,
    search,
    page = 1,
    limit = 20,
    signal,
}: GetPublishedArticlesOptions) {
    if (!API_BASE_URL) {
        throw new Error('EXPO_PUBLIC_API_URL is not configured.');
    }

    const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    if (category) {
        query.set('category', category);
    }
    if (search?.trim()) {
        query.set('search', search.trim());
    }
    const response = await fetch(`${API_BASE_URL}/articles?${query.toString()}`, {
        signal,
    });

    if (!response.ok) {
        throw new Error(`Failed to load articles: ${response.status}`);
    }

    const result = (await response.json()) as ArticlesResponse;

    if (!result.success || !Array.isArray(result.data?.articles)) {
        throw new Error('Invalid articles response.');
    }

    return {
    ...result.data,
    articles: result.data.articles.map(normalizeArticleImage),
};
}
type ArticleResponse = {
    success: true;
    data: {
        article: PublishedArticle;
    };
};

export async function getPublishedArticle(
    slug: string,
    signal?: AbortSignal,
) {
    if (!API_BASE_URL) {
        throw new Error('EXPO_PUBLIC_API_URL is not configured.');
    }

    const response = await fetch(
        `${API_BASE_URL}/articles/${encodeURIComponent(slug)}`,
        { signal },
    );

    if (!response.ok) {
        throw new Error(`Failed to load article: ${response.status}`);
    }

    const result = (await response.json()) as ArticleResponse;

    if (!result.success || !result.data?.article) {
        throw new Error('Invalid article response.');
    }

    return normalizeArticleImage(result.data.article);
}
export type BreakingHeadline = {
    id: string;
    headlineAr: string;
    publishedAtSource: string;
};

type BreakingHeadlinesResponse = {
    success: true;
    data: {
        headlines: BreakingHeadline[];
    };
};

export async function getBreakingHeadlines(signal?: AbortSignal) {
    if (!API_BASE_URL) {
        throw new Error('EXPO_PUBLIC_API_URL is not configured.');
    }

    const response = await fetch(
        `${API_BASE_URL}/articles/breaking/headline`,
        { signal },
    );

    if (!response.ok) {
        throw new Error(`Failed to load breaking headlines: ${response.status}`);
    }

    const result = (await response.json()) as BreakingHeadlinesResponse;

    if (!result.success || !Array.isArray(result.data?.headlines)) {
        throw new Error('Invalid breaking headlines response.');
    }

    return result.data.headlines;
}