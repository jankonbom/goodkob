// Debug vidéo GitHub - Diagnostic complet
console.log('🔍 === DEBUG VIDÉO GITHUB ===');

// Fonction de debug principal
async function debugVideoDisplay() {
    console.log('🔍 === DIAGNOSTIC COMPLET VIDÉO ===');
    
    try {
        // 1. Vérifier les articles avec leurs URLs
        console.log('📋 1. Récupération des articles...');
        const response = await fetch('https://aapicehoqxdwixbiqucs.supabase.co/rest/v1/articles?select=*', {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcGljZWhvcXhkd2l4YmlxdWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzE5ODMsImV4cCI6MjA3MzAwNzk4M30.jBTeUfGBkVT0-5ElCD1NM6fCQCD7wnRpw4I2ulykLOQ',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcGljZWhvcXhkd2l4YmlxdWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzE5ODMsImV4cCI6MjA3MzAwNzk4M30.jBTeUfGBkVT0-5ElCD1NM6fCQCD7wnRpw4I2ulykLOQ'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const articles = await response.json();
        console.log(`✅ ${articles.length} articles récupérés`);
        
        // 2. Analyser chaque article
        console.log('📋 2. Analyse des articles...');
        articles.forEach((article, index) => {
            console.log(`\n📦 Article ${index + 1}: ${article.name}`);
            console.log(`   ID: ${article.id}`);
            console.log(`   URL: ${article.image_url}`);
            
            if (article.image_url) {
                // Vérifier si c'est une vidéo GitHub
                const isGitHubVideo = article.image_url.includes('github.com') && 
                    article.image_url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i);
                
                console.log(`   GitHub: ${article.image_url.includes('github.com')}`);
                console.log(`   Vidéo: ${isGitHubVideo}`);
                
                if (isGitHubVideo) {
                    console.log(`   🎥 VIDÉO GITHUB DÉTECTÉE: ${article.image_url}`);
                }
            } else {
                console.log(`   ❌ Pas d'URL d'image`);
            }
        });
        
        // 3. Tester l'URL de votre vidéo spécifique
        console.log('\n🎥 3. Test de votre vidéo spécifique...');
        const testVideoUrl = 'https://raw.githubusercontent.com/jankonbom/imageforko/main/article_1758902278934.MOV';
        console.log(`URL test: ${testVideoUrl}`);
        
        // Créer un élément vidéo de test
        const testVideo = document.createElement('video');
        testVideo.src = testVideoUrl;
        testVideo.controls = true;
        testVideo.style.width = '300px';
        testVideo.style.height = '200px';
        testVideo.style.border = '2px solid #00ff00';
        testVideo.style.margin = '10px';
        
        // Ajouter au body pour test visuel
        document.body.appendChild(testVideo);
        console.log('✅ Élément vidéo de test ajouté au body');
        
        // 4. Vérifier les éléments vidéo existants
        console.log('\n🔍 4. Vérification des éléments vidéo existants...');
        const existingVideos = document.querySelectorAll('video');
        console.log(`Vidéos trouvées sur la page: ${existingVideos.length}`);
        
        existingVideos.forEach((video, index) => {
            console.log(`Vidéo ${index + 1}:`);
            console.log(`   Source: ${video.src}`);
            console.log(`   Visible: ${video.offsetWidth > 0 && video.offsetHeight > 0}`);
            console.log(`   Erreur: ${video.error ? video.error.message : 'Aucune'}`);
        });
        
        // 5. Vérifier les cartes d'articles
        console.log('\n🔍 5. Vérification des cartes d\'articles...');
        const productCards = document.querySelectorAll('.product-card');
        console.log(`Cartes d'articles trouvées: ${productCards.length}`);
        
        productCards.forEach((card, index) => {
            const title = card.querySelector('.product-title')?.textContent || 'Sans titre';
            const video = card.querySelector('video');
            const image = card.querySelector('img');
            
            console.log(`Carte ${index + 1}: ${title}`);
            console.log(`   Vidéo: ${video ? 'Oui' : 'Non'}`);
            console.log(`   Image: ${image ? 'Oui' : 'Non'}`);
            
            if (video) {
                console.log(`   Source vidéo: ${video.src}`);
                console.log(`   Erreur vidéo: ${video.error ? video.error.message : 'Aucune'}`);
            }
        });
        
        return {
            articles: articles,
            testVideo: testVideo,
            existingVideos: existingVideos.length,
            productCards: productCards.length
        };
        
    } catch (error) {
        console.error('❌ Erreur debug:', error);
        return { error: error.message };
    }
}

// Fonction pour forcer le rechargement des vidéos
function forceReloadVideos() {
    console.log('🔄 Rechargement forcé des vidéos...');
    
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
        console.log(`Rechargement vidéo ${index + 1}: ${video.src}`);
        video.load();
        video.play().catch(e => console.log(`Erreur lecture vidéo ${index + 1}:`, e.message));
    });
}

// Fonction pour tester une URL vidéo spécifique
function testVideoUrl(url) {
    console.log(`🎥 Test de l'URL vidéo: ${url}`);
    
    const video = document.createElement('video');
    video.src = url;
    video.controls = true;
    video.style.width = '400px';
    video.style.height = '300px';
    video.style.border = '3px solid #ff0000';
    video.style.margin = '20px';
    
    video.addEventListener('loadstart', () => console.log('📡 Chargement démarré'));
    video.addEventListener('loadeddata', () => console.log('✅ Données chargées'));
    video.addEventListener('canplay', () => console.log('▶️ Peut être lu'));
    video.addEventListener('error', (e) => console.log('❌ Erreur:', e));
    
    document.body.appendChild(video);
    
    return video;
}

// Fonction pour vérifier la configuration GitHub
function checkGitHubConfig() {
    console.log('🔧 === VÉRIFICATION CONFIGURATION GITHUB ===');
    
    if (typeof GITHUB_CONFIG !== 'undefined') {
        console.log('✅ GITHUB_CONFIG trouvé:');
        console.log(`   Username: ${GITHUB_CONFIG.username}`);
        console.log(`   Repository: ${GITHUB_CONFIG.repository}`);
        console.log(`   Token: ${GITHUB_CONFIG.token ? 'Configuré' : 'Manquant'}`);
    } else {
        console.log('❌ GITHUB_CONFIG non trouvé');
    }
    
    if (typeof uploadToGitHub !== 'undefined') {
        console.log('✅ uploadToGitHub fonction trouvée');
    } else {
        console.log('❌ uploadToGitHub fonction non trouvée');
    }
}

// Fonction pour simuler la détection de vidéo
function testVideoDetection() {
    console.log('🧪 === TEST DÉTECTION VIDÉO ===');
    
    const testUrls = [
        'https://raw.githubusercontent.com/jankonbom/imageforko/main/article_1758902278934.MOV',
        'https://example.com/video.mp4',
        'https://raw.githubusercontent.com/jankonbom/imageforko/main/image.jpg'
    ];
    
    testUrls.forEach(url => {
        const isVideo = url.includes('github.com') && url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i);
        console.log(`URL: ${url}`);
        console.log(`Contient github.com: ${url.includes('github.com')}`);
        console.log(`Extension vidéo: ${url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i) ? 'Oui' : 'Non'}`);
        console.log(`Détectée comme vidéo: ${isVideo ? '✅ OUI' : '❌ NON'}`);
        console.log('---');
    });
}

// Export des fonctions
window.debugVideoDisplay = debugVideoDisplay;
window.forceReloadVideos = forceReloadVideos;
window.testVideoUrl = testVideoUrl;
window.checkGitHubConfig = checkGitHubConfig;
window.testVideoDetection = testVideoDetection;

console.log('🔍 Debug vidéo chargé');
console.log('📋 Commandes disponibles:');
console.log('   debugVideoDisplay() - Diagnostic complet');
console.log('   forceReloadVideos() - Recharger les vidéos');
console.log('   testVideoUrl(url) - Tester une URL spécifique');
console.log('   checkGitHubConfig() - Vérifier la config GitHub');
console.log('   testVideoDetection() - Tester la détection');
