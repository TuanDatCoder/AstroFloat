import { supabase } from './supabase';
import { TABLES } from '../constants';

export const newsService = {
  async getCategories() {
    const { data, error } = await supabase
      .from(TABLES.NEWS_CATEGORIES)
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    return data;
  },

  async getArticles() {
    const { data, error } = await supabase
      .from(TABLES.NEWS_ARTICLES)
      .select(`
        id, title, slug, summary, thumbnail_url, published_at, view_count, status, is_featured,
        news_article_categories (
          news_categories ( id, name, slug )
        ),
        news_article_tags (
          news_tags ( id, name, slug )
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
    return data;
  },

  async adminGetArticles() {
    const { data, error } = await supabase
      .from(TABLES.NEWS_ARTICLES)
      .select(`
        id, title, slug, summary, thumbnail_url, published_at, created_at, view_count, status, is_featured,
        news_article_categories (
          news_categories ( id, name, slug )
        ),
        news_article_tags (
          news_tags ( id, name, slug )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin articles:', error);
      throw error;
    }
    return data;
  },

  async getArticleBySlug(slug) {
    const { data, error } = await supabase
      .from(TABLES.NEWS_ARTICLES)
      .select(`
        *,
        news_article_categories (
          news_categories ( id, name, slug )
        ),
        news_article_tags (
          news_tags ( id, name, slug )
        )
      `)
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching article details:', error);
      throw error;
    }
    return data;
  },

  async incrementViewCount(articleId, currentCount) {
    const { data, error } = await supabase
      .from(TABLES.NEWS_ARTICLES)
      .update({ view_count: (currentCount || 0) + 1 })
      .eq('id', articleId);
    
    if (error) {
      console.error('Error incrementing view count:', error);
    }
    return data;
  },

  async createArticle(articleData, categoryId) {
    // 1. Tạo bài viết
    const { data: article, error: articleError } = await supabase
      .from(TABLES.NEWS_ARTICLES)
      .insert(articleData)
      .select()
      .single();
    
    if (articleError) throw articleError;

    // 2. Gán danh mục nếu có
    if (categoryId && article) {
      const { error: catError } = await supabase
        .from(TABLES.NEWS_ARTICLE_CATEGORIES)
        .insert({
          article_id: article.id,
          category_id: parseInt(categoryId)
        });
      if (catError) console.error("Lỗi gán danh mục:", catError);
    }

    return article;
  },

  async updateArticle(id, articleData, categoryId) {
    // 1. Cập nhật thông tin bài viết
    const { data: article, error: articleError } = await supabase
      .from(TABLES.NEWS_ARTICLES)
      .update(articleData)
      .eq('id', id)
      .select()
      .single();
    
    if (articleError) throw articleError;

    // 2. Cập nhật danh mục
    if (id) {
      // Luôn xóa các danh mục cũ để cập nhật mới (hoặc xóa trắng nếu categoryId trống)
      await supabase
        .from(TABLES.NEWS_ARTICLE_CATEGORIES)
        .delete()
        .eq('article_id', id);

      if (categoryId) {
        // Thêm danh mục mới
        const { error: catError } = await supabase
          .from(TABLES.NEWS_ARTICLE_CATEGORIES)
          .insert({
            article_id: id,
            category_id: parseInt(categoryId)
          });
        if (catError) console.error("Lỗi cập nhật danh mục:", catError);
      }
    }

    return article;
  },
  async deleteArticle(id) {
    const { error } = await supabase
      .from(TABLES.NEWS_ARTICLES)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      if (uploadError.message.includes('bucket not found')) {
        throw new Error('Vui lòng tạo storage bucket tên "avatars" trong Supabase trước.');
      }
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
