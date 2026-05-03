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
        id, title, slug, summary, thumbnail_url, published_at, view_count, status,
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
        id, title, slug, summary, thumbnail_url, published_at, created_at, view_count, status,
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
      .single();

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

  async createArticle(articleData) {
    const { data, error } = await supabase
      .from(TABLES.NEWS_ARTICLES)
      .insert(articleData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateArticle(id, articleData) {
    const { data, error } = await supabase
      .from(TABLES.NEWS_ARTICLES)
      .update(articleData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
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
      // Nếu lỗi do chưa có bucket, ta báo lỗi rõ ràng
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
