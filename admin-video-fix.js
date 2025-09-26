// Fix pour l'affichage des vidéos GitHub dans le panel admin
console.log('🔧 === FIX VIDÉOS GITHUB PANEL ADMIN ===');

// Fonction pour détecter si une URL est une vidéo GitHub
function isGitHubVideo(url) {
    if (!url) return false;
    
    console.log(`🔍 Test détection vidéo: ${url}`);
    console.log(`   Longueur de l'URL: ${url.length}`);
    console.log(`   Type: ${typeof url}`);
    
    // Debug plus profond pour détecter les caractères invisibles
    console.log(`   Contient 'github.com': ${url.includes('github.com')}`);
    console.log(`   Contient 'github': ${url.includes('github')}`);
    console.log(`   Contient 'raw.githubusercontent': ${url.includes('raw.githubusercontent')}`);
    
    // Test avec indexOf
    const githubIndex = url.indexOf('github.com');
    console.log(`   Index de 'github.com': ${githubIndex}`);
    
    // Test avec une URL nettoyée
    const cleanUrl = url.trim();
    console.log(`   URL nettoyée: ${cleanUrl}`);
    console.log(`   URL nettoyée contient github.com: ${cleanUrl.includes('github.com')}`);
    
    // Test avec une URL reconstruite
    const reconstructedUrl = url.replace(/\s+/g, '');
    console.log(`   URL reconstruite: ${reconstructedUrl}`);
    console.log(`   URL reconstruite contient github.com: ${reconstructedUrl.includes('github.com')}`);
    
    const isVideo = url.includes('github.com') && url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i);
    console.log(`   Résultat: ${isVideo ? '✅ OUI' : '❌ NON'}`);
    
    return isVideo;
}

// Fonction pour corriger l'affichage des vidéos dans le panel admin
function fixAdminVideoDisplay() {
    console.log('🔧 Correction de l\'affichage des vidéos dans le panel admin...');
    
    // Attendre que les articles soient chargés
    setTimeout(() => {
        const articleCards = document.querySelectorAll('.article-card');
        console.log(`📋 ${articleCards.length} cartes d'articles trouvées`);
        
        articleCards.forEach((card, index) => {
            const imageContainer = card.querySelector('.article-image-container');
            const imageElement = card.querySelector('.article-image');
            
            if (imageContainer && imageElement) {
                const imageUrl = imageElement.src;
                console.log(`🔍 Carte ${index + 1}: ${imageUrl}`);
                
                // Utiliser la fonction alternative qui fonctionne
                if (isGitHubVideoAlternative(imageUrl)) {
                    console.log(`🎥 Vidéo GitHub détectée: ${imageUrl}`);
                    
                    // Remplacer l'image par une vidéo
                    const videoElement = document.createElement('video');
                    videoElement.src = imageUrl;
                    videoElement.controls = true;
                    videoElement.style.width = '100%';
                    videoElement.style.height = '100%';
                    videoElement.style.objectFit = 'cover';
                    videoElement.style.borderRadius = '8px';
                    videoElement.setAttribute('playsinline', 'true');
                    videoElement.setAttribute('webkit-playsinline', 'true');
                    
                    // Remplacer l'élément image par la vidéo
                    imageElement.parentNode.replaceChild(videoElement, imageElement);
                    
                    console.log(`✅ Vidéo remplacée pour la carte ${index + 1}`);
                }
            }
        });
    }, 1000);
}

// Fonction pour corriger l'affichage des vidéos dans les modals
function fixModalVideoDisplay() {
    console.log('🔧 Correction de l\'affichage des vidéos dans les modals...');
    
    // Observer les changements dans les modals
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const videoElements = node.querySelectorAll('video');
                        videoElements.forEach(video => {
                            if (isGitHubVideo(video.src)) {
                                console.log('🎥 Vidéo GitHub détectée dans modal:', video.src);
                                video.controls = true;
                                video.style.width = '100%';
                                video.style.height = '200px';
                                video.style.objectFit = 'cover';
                                video.setAttribute('playsinline', 'true');
                                video.setAttribute('webkit-playsinline', 'true');
                            }
                        });
                    }
                });
            }
        });
    });
    
    // Observer les changements dans le body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Fonction pour corriger l'affichage des vidéos dans la prévisualisation
function fixPreviewVideoDisplay() {
    console.log('🔧 Correction de l\'affichage des vidéos dans la prévisualisation...');
    
    const previewContainer = document.getElementById('livePreview');
    if (previewContainer) {
        const videoElements = previewContainer.querySelectorAll('video');
        videoElements.forEach(video => {
            if (isGitHubVideo(video.src)) {
                console.log('🎥 Vidéo GitHub détectée dans prévisualisation:', video.src);
                video.controls = true;
                video.style.width = '100%';
                video.style.height = '200px';
                video.style.objectFit = 'cover';
                video.setAttribute('playsinline', 'true');
                video.setAttribute('webkit-playsinline', 'true');
            }
        });
    }
}

// Fonction pour corriger l'affichage des vidéos dans la fonction loadExistingMedia
function fixLoadExistingMedia() {
    console.log('🔧 Correction de la fonction loadExistingMedia...');
    
    // Override de la fonction loadExistingMedia si elle existe
    if (typeof loadExistingMedia === 'function') {
        const originalLoadExistingMedia = loadExistingMedia;
        
        loadExistingMedia = function(url) {
            console.log('🖼️ loadExistingMedia appelée avec:', url);
            
            if (isGitHubVideo(url)) {
                console.log('🎥 Vidéo GitHub détectée dans loadExistingMedia');
                
                const preview = document.getElementById('mediaPreview');
                const previewImg = document.getElementById('previewImg');
                const previewVideo = document.getElementById('previewVideo');
                const uploadZone = document.getElementById('mediaUploadZone');

                if (preview && previewImg && previewVideo && uploadZone) {
                    uploadZone.style.display = 'none';
                    preview.style.display = 'block';
                    
                    // Afficher la vidéo
                    previewVideo.src = url;
                    previewVideo.style.display = 'block';
                    previewImg.style.display = 'none';
                    previewVideo.controls = true;
                    previewVideo.style.width = '100%';
                    previewVideo.style.height = '200px';
                    previewVideo.style.objectFit = 'cover';
                    previewVideo.setAttribute('playsinline', 'true');
                    previewVideo.setAttribute('webkit-playsinline', 'true');
                    
                    console.log('✅ Vidéo affichée dans le modal');
                }
            } else {
                // Appeler la fonction originale pour les images
                return originalLoadExistingMedia(url);
            }
        };
    }
}

// Fonction principale pour corriger tous les affichages de vidéos
function fixAllVideoDisplays() {
    console.log('🔧 === CORRECTION COMPLÈTE DES VIDÉOS ===');
    
    // Corriger l'affichage des cartes d'articles
    fixAdminVideoDisplay();
    
    // Corriger l'affichage des modals
    fixModalVideoDisplay();
    
    // Corriger l'affichage de la prévisualisation
    fixPreviewVideoDisplay();
    
    // Corriger la fonction loadExistingMedia
    fixLoadExistingMedia();
    
    console.log('✅ Toutes les corrections appliquées');
}

// Fonction alternative pour détecter les vidéos GitHub
function isGitHubVideoAlternative(url) {
    if (!url) return false;
    
    // Nettoyer l'URL
    const cleanUrl = url.trim().replace(/\s+/g, '');
    
    // Vérifier avec plusieurs méthodes
    const hasGithub1 = cleanUrl.includes('github.com');
    const hasGithub2 = cleanUrl.includes('raw.githubusercontent');
    const hasGithub3 = cleanUrl.indexOf('github.com') !== -1;
    
    // Vérifier l'extension vidéo
    const hasVideoExt = cleanUrl.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i);
    
    console.log(`🔍 Alternative test pour: ${cleanUrl}`);
    console.log(`   github.com (includes): ${hasGithub1}`);
    console.log(`   raw.githubusercontent: ${hasGithub2}`);
    console.log(`   github.com (indexOf): ${hasGithub3}`);
    console.log(`   Extension vidéo: ${hasVideoExt ? hasVideoExt[0] : 'Non'}`);
    
    const isVideo = (hasGithub1 || hasGithub2 || hasGithub3) && hasVideoExt;
    console.log(`   Résultat alternatif: ${isVideo ? '✅ OUI' : '❌ NON'}`);
    
    return isVideo;
}

// Fonction pour tester la détection de vidéos
function testVideoDetection() {
    console.log('🧪 === TEST DÉTECTION VIDÉOS ===');
    
    const testUrls = [
        'https://raw.githubusercontent.com/jankonbom/imageforko/main/article_1758902278934.MOV',
        'https://example.com/video.mp4',
        'https://raw.githubusercontent.com/jankonbom/imageforko/main/image.jpg'
    ];
    
    testUrls.forEach(url => {
        console.log(`\n🔍 Test URL: ${url}`);
        
        // Test avec la fonction originale
        console.log('--- FONCTION ORIGINALE ---');
        isGitHubVideo(url);
        
        // Test avec la fonction alternative
        console.log('--- FONCTION ALTERNATIVE ---');
        isGitHubVideoAlternative(url);
        
        console.log('---');
    });
}

// Fonction pour tester avec la vraie URL de votre vidéo
function testRealVideo() {
    console.log('🎥 === TEST AVEC VRAIE VIDÉO ===');
    
    const realVideoUrl = 'https://raw.githubusercontent.com/jankonbom/imageforko/main/article_1758902278934.MOV';
    console.log(`URL réelle: ${realVideoUrl}`);
    
    console.log('--- FONCTION ORIGINALE ---');
    const result1 = isGitHubVideo(realVideoUrl);
    console.log(`Résultat original: ${result1 ? '✅ OUI' : '❌ NON'}`);
    
    console.log('--- FONCTION ALTERNATIVE ---');
    const result2 = isGitHubVideoAlternative(realVideoUrl);
    console.log(`Résultat alternatif: ${result2 ? '✅ OUI' : '❌ NON'}`);
    
    return result1 || result2;
}

// Fonction pour corriger les URLs Cloudinary dans la base de données
async function fixCloudinaryUrls() {
    console.log('🔧 Correction des URLs Cloudinary dans la base de données...');
    
    try {
        // Récupérer tous les articles avec des URLs Cloudinary
        const { data: articles, error } = await supabaseClient
            .from('articles')
            .select('*')
            .like('image_url', '%cloudinary%');
        
        if (error) {
            console.error('❌ Erreur lors de la récupération des articles:', error);
            return;
        }
        
        console.log(`📋 ${articles.length} articles avec URLs Cloudinary trouvés`);
        
        for (const article of articles) {
            console.log(`🔄 Correction de l'article: ${article.name}`);
            console.log(`   URL actuelle: ${article.image_url}`);
            
            // Créer une nouvelle URL GitHub basée sur le nom de l'article
            const fileName = article.image_url.split('/').pop(); // Récupérer le nom du fichier
            const newUrl = `https://raw.githubusercontent.com/jankonbom/imageforko/main/${fileName}`;
            
            console.log(`   Nouvelle URL: ${newUrl}`);
            
            // Mettre à jour l'article dans la base de données
            const { error: updateError } = await supabaseClient
                .from('articles')
                .update({ image_url: newUrl })
                .eq('id', article.id);
            
            if (updateError) {
                console.error(`❌ Erreur lors de la mise à jour de l'article ${article.name}:`, updateError);
            } else {
                console.log(`✅ Article ${article.name} mis à jour avec succès`);
            }
        }
        
        console.log('🎉 Correction des URLs terminée !');
        
    } catch (error) {
        console.error('❌ Erreur lors de la correction des URLs:', error);
    }
}

// Fonction pour lister tous les articles avec des URLs Cloudinary
async function listCloudinaryArticles() {
    console.log('📋 Liste des articles avec URLs Cloudinary...');
    
    try {
        const { data: articles, error } = await supabaseClient
            .from('articles')
            .select('id, name, image_url')
            .like('image_url', '%cloudinary%');
        
        if (error) {
            console.error('❌ Erreur:', error);
            return;
        }
        
        console.log(`📊 ${articles.length} articles trouvés:`);
        articles.forEach((article, index) => {
            console.log(`${index + 1}. ${article.name}`);
            console.log(`   ID: ${article.id}`);
            console.log(`   URL: ${article.image_url}`);
            console.log('---');
        });
        
        return articles;
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

// Export des fonctions
window.isGitHubVideo = isGitHubVideo;
window.isGitHubVideoAlternative = isGitHubVideoAlternative;
window.fixAdminVideoDisplay = fixAdminVideoDisplay;
window.fixModalVideoDisplay = fixModalVideoDisplay;
window.fixPreviewVideoDisplay = fixPreviewVideoDisplay;
window.fixLoadExistingMedia = fixLoadExistingMedia;
window.fixAllVideoDisplays = fixAllVideoDisplays;
window.testVideoDetection = testVideoDetection;
window.testRealVideo = testRealVideo;
window.fixCloudinaryUrls = fixCloudinaryUrls;
window.listCloudinaryArticles = listCloudinaryArticles;

// Auto-correction au chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Auto-correction des vidéos au chargement...');
    setTimeout(fixAllVideoDisplays, 2000);
});

console.log('🔧 Fix vidéos GitHub chargé');
console.log('📋 Commandes disponibles:');
console.log('   fixAllVideoDisplays() - Corriger tous les affichages');
console.log('   testVideoDetection() - Tester la détection');
console.log('   fixAdminVideoDisplay() - Corriger les cartes d\'articles');
console.log('   fixModalVideoDisplay() - Corriger les modals');
console.log('   fixPreviewVideoDisplay() - Corriger la prévisualisation');
