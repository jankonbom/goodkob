// Configuration Supabase
const SUPABASE_URL = 'https://aapicehoqxdwixbiqucs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcGljZWhvcXhkd2l4YmlxdWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzE5ODMsImV4cCI6MjA3MzAwNzk4M30.jBTeUfGBkVT0-5ElCD1NM6fCQCD7wnRpw4I2ulykLOQ';

// Initialisation de Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Structure de la table des articles
const articlesTable = 'articles';

// Fonctions de gestion des articles
class ArticleManager {
  // Récupérer tous les articles
  async getAllArticles() {
    try {
      const { data, error } = await supabaseClient
        .from(articlesTable)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return [];
    }
  }

  // Récupérer un article par ID
  async getArticleById(id) {
    try {
      const { data, error } = await supabaseClient
        .from(articlesTable)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return null;
    }
  }

  // Créer un nouvel article
  async createArticle(articleData) {
    try {
      const { data, error } = await supabaseClient
        .from(articlesTable)
        .insert([articleData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      throw error;
    }
  }

  // Mettre à jour un article
  async updateArticle(id, articleData) {
    try {
      const { data, error } = await supabaseClient
        .from(articlesTable)
        .update(articleData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      throw error;
    }
  }

  // Supprimer un article
  async deleteArticle(id) {
    try {
      const { error } = await supabaseClient
        .from(articlesTable)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      throw error;
    }
  }

  // Uploader une image vers Supabase Storage
  async uploadImage(file, fileName) {
    try {
      const { data, error } = await supabaseClient.storage
        .from('article-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;
      
      // Récupérer l'URL publique de l'image
      const { data: { publicUrl } } = supabaseClient.storage
        .from('article-images')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      throw error;
    }
  }

  // Supprimer une image du storage
  async deleteImage(fileName) {
    try {
      const { error } = await supabaseClient.storage
        .from('article-images')
        .remove([fileName]);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      throw error;
    }
  }
}

// Export pour utilisation dans d'autres fichiers
window.ArticleManager = ArticleManager;
window.supabaseClient = supabaseClient;
