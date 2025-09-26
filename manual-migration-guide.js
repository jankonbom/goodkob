// Guide de migration manuelle Cloudinary → GitHub
// Quand Cloudinary est bloqué/désactivé

console.log('🚨 === MIGRATION MANUELLE CLOUDINARY → GITHUB ===');
console.log('');
console.log('Votre compte Cloudinary est désactivé (surcharge)');
console.log('Voici comment récupérer vos images manuellement :');
console.log('');

// Fonction pour lister tous vos articles avec images Cloudinary
async function listCloudinaryArticles() {
    try {
        console.log('📋 Récupération de vos articles...');
        
        const { data: articles, error } = await supabaseClient
            .from('articles')
            .select('*');
            
        if (error) throw error;
        
        const cloudinaryArticles = articles.filter(article => 
            article.image_url && article.image_url.includes('cloudinary.com')
        );
        
        console.log(`📦 ${cloudinaryArticles.length} articles avec images Cloudinary trouvés :`);
        console.log('');
        
        cloudinaryArticles.forEach((article, index) => {
            console.log(`${index + 1}. ${article.name}`);
            console.log(`   ID: ${article.id}`);
            console.log(`   URL Cloudinary: ${article.image_url}`);
            console.log(`   Type: ${article.image_url.includes('video') ? 'VIDÉO' : 'IMAGE'}`);
            console.log('');
        });
        
        return cloudinaryArticles;
        
    } catch (error) {
        console.error('❌ Erreur récupération articles:', error);
        return [];
    }
}

// Fonction pour créer un guide de migration manuelle
function createManualMigrationGuide(articles) {
    console.log('📋 === GUIDE MIGRATION MANUELLE ===');
    console.log('');
    console.log('🎯 MÉTHODE RECOMMANDÉE :');
    console.log('');
    console.log('1️⃣ TÉLÉCHARGER VOS IMAGES :');
    console.log('   - Allez dans votre dossier Cloudinary local (si vous l\'avez)');
    console.log('   - OU utilisez un outil de récupération de données');
    console.log('   - OU contactez le support Cloudinary pour récupérer vos assets');
    console.log('');
    console.log('2️⃣ UPLOAD VERS GITHUB :');
    console.log('   - Ouvrez: https://github.com/jankonbom/imageforko');
    console.log('   - Cliquez "Add file" → "Upload files"');
    console.log('   - Glissez vos images/vidéos');
    console.log('   - Nommez-les clairement (ex: article_1.jpg, article_2.mp4)');
    console.log('   - Cliquez "Commit changes"');
    console.log('');
    console.log('3️⃣ METTRE À JOUR VOS ARTICLES :');
    console.log('   - Copiez les nouvelles URLs GitHub');
    console.log('   - Utilisez la fonction updateArticleUrl() pour chaque article');
    console.log('');
    
    return {
        totalArticles: articles.length,
        steps: [
            'Télécharger images depuis Cloudinary',
            'Upload vers GitHub',
            'Mettre à jour URLs dans Supabase'
        ]
    };
}

// Fonction pour mettre à jour une URL d'article
async function updateArticleUrl(articleId, newImageUrl) {
    try {
        console.log(`🔄 Mise à jour article ${articleId}...`);
        
        const { data, error } = await supabaseClient
            .from('articles')
            .update({ image_url: newImageUrl })
            .eq('id', articleId);
            
        if (error) throw error;
        
        console.log(`✅ Article ${articleId} mis à jour avec: ${newImageUrl}`);
        return { success: true, articleId, newUrl: newImageUrl };
        
    } catch (error) {
        console.error(`❌ Erreur mise à jour article ${articleId}:`, error);
        return { success: false, error: error.message };
    }
}

// Fonction pour mettre à jour plusieurs articles en lot
async function updateMultipleArticles(updates) {
    console.log('🔄 === MISE À JOUR EN LOT ===');
    console.log(`📦 ${updates.length} articles à mettre à jour...`);
    
    let successCount = 0;
    const results = [];
    
    for (const update of updates) {
        try {
            const result = await updateArticleUrl(update.articleId, update.newUrl);
            results.push(result);
            
            if (result.success) {
                successCount++;
                console.log(`✅ ${update.articleId} → ${update.newUrl}`);
            } else {
                console.log(`❌ ${update.articleId} → Erreur`);
            }
            
            // Délai pour éviter la surcharge
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error(`❌ Erreur ${update.articleId}:`, error);
            results.push({ success: false, articleId: update.articleId, error: error.message });
        }
    }
    
    console.log(`🎉 Mise à jour terminée: ${successCount}/${updates.length} articles mis à jour`);
    return { successCount, total: updates.length, results };
}

// Fonction pour créer un template de migration
function createMigrationTemplate(articles) {
    console.log('📝 === TEMPLATE DE MIGRATION ===');
    console.log('');
    console.log('Copiez ce code et modifiez les URLs :');
    console.log('');
    console.log('const migrationUpdates = [');
    
    articles.forEach((article, index) => {
        console.log(`  {`);
        console.log(`    articleId: ${article.id},`);
        console.log(`    articleName: "${article.name}",`);
        console.log(`    oldUrl: "${article.image_url}",`);
        console.log(`    newUrl: "https://raw.githubusercontent.com/jankonbom/imageforko/main/article_${article.id}.jpg"`);
        console.log(`  }${index < articles.length - 1 ? ',' : ''}`);
    });
    
    console.log('];');
    console.log('');
    console.log('// Puis exécutez:');
    console.log('updateMultipleArticles(migrationUpdates);');
    console.log('');
    
    return articles.map(article => ({
        articleId: article.id,
        articleName: article.name,
        oldUrl: article.image_url,
        newUrl: `https://raw.githubusercontent.com/jankonbom/imageforko/main/article_${article.id}.jpg`
    }));
}

// Fonction pour récupérer les images depuis un backup local
function createLocalBackupGuide() {
    console.log('💾 === RÉCUPÉRATION DEPUIS BACKUP LOCAL ===');
    console.log('');
    console.log('Si vous avez un backup local de vos images :');
    console.log('');
    console.log('1️⃣ Localisez vos images dans votre ordinateur');
    console.log('2️⃣ Renommez-les selon vos articles (ex: article_1.jpg, article_2.mp4)');
    console.log('3️⃣ Uploadez-les vers GitHub');
    console.log('4️⃣ Utilisez updateArticleUrl() pour chaque article');
    console.log('');
    console.log('💡 ASTUCE : Si vous n\'avez pas de backup, contactez le support Cloudinary');
    console.log('   Ils peuvent parfois vous aider à récupérer vos assets même si le compte est suspendu');
}

// Export des fonctions
window.listCloudinaryArticles = listCloudinaryArticles;
window.createManualMigrationGuide = createManualMigrationGuide;
window.updateArticleUrl = updateArticleUrl;
window.updateMultipleArticles = updateMultipleArticles;
window.createMigrationTemplate = createMigrationTemplate;
window.createLocalBackupGuide = createLocalBackupGuide;

console.log('📋 Guide de migration manuelle chargé');
console.log('🔍 Lister articles: listCloudinaryArticles()');
console.log('📝 Créer template: createMigrationTemplate()');
console.log('🔄 Mettre à jour: updateArticleUrl(id, newUrl)');
console.log('💾 Backup guide: createLocalBackupGuide()');
