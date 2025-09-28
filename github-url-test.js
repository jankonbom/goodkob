// 🧪 TEST URLs GITHUB - Vérification des vidéos GitHub
console.log('🧪 === TEST URLs GITHUB ===');

// Fonction pour tester les URLs GitHub
function testGitHubUrls() {
    console.log('🧪 Test des URLs GitHub...');
    
    if (!window.articles || window.articles.length === 0) {
        console.log('❌ Aucun article chargé');
        console.log('💡 Attendez que les articles se chargent depuis Supabase...');
        console.log('💡 Ou utilisez: setTimeout(() => testGitHubUrls(), 2000);');
        return;
    }
    
    console.log(`📋 ${window.articles.length} articles disponibles`);
    
    // Trouver les articles avec URLs GitHub
    const githubArticles = window.articles.filter(article => {
        return article.image_url && article.image_url.includes('github.com');
    });
    
    console.log(`🔗 ${githubArticles.length} articles avec URLs GitHub:`);
    
    githubArticles.forEach((article, index) => {
        console.log(`\n📋 Article ${index + 1}: ${article.name}`);
        console.log(`   URL: ${article.image_url}`);
        
        // Test de l'URL
        const isVideo = article.image_url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i);
        console.log(`   Extension vidéo: ${isVideo ? isVideo[0] : 'Non'}`);
        console.log(`   Détectée comme vidéo: ${isVideo ? '✅ OUI' : '❌ NON'}`);
        
        // Test de l'URL
        testUrl(article.image_url, article.name);
    });
}

// Fonction pour tester une URL spécifique
function testUrl(url, articleName) {
    console.log(`🔗 Test de l'URL pour ${articleName}:`);
    
    // Créer un élément vidéo de test
    const testVideo = document.createElement('video');
    testVideo.src = url;
    testVideo.preload = 'metadata';
    testVideo.style.display = 'none';
    
    testVideo.addEventListener('loadstart', () => {
        console.log(`   ✅ ${articleName}: Chargement démarré`);
    });
    
    testVideo.addEventListener('loadedmetadata', () => {
        console.log(`   ✅ ${articleName}: Métadonnées chargées`);
        console.log(`   - Durée: ${testVideo.duration}s`);
        console.log(`   - Dimensions: ${testVideo.videoWidth}x${testVideo.videoHeight}`);
    });
    
    testVideo.addEventListener('canplay', () => {
        console.log(`   ✅ ${articleName}: Peut être lu`);
    });
    
    testVideo.addEventListener('error', (e) => {
        console.log(`   ❌ ${articleName}: Erreur de chargement`);
        console.log(`   - Erreur: ${e.target.error?.message || 'Inconnue'}`);
        console.log(`   - Code: ${e.target.error?.code || 'N/A'}`);
    });
    
    // Ajouter au DOM pour le test
    document.body.appendChild(testVideo);
    
    // Nettoyer après 5 secondes
    setTimeout(() => {
        document.body.removeChild(testVideo);
    }, 5000);
}

// Fonction pour tester une URL spécifique
function testSpecificUrl(url) {
    console.log(`🔗 Test de l'URL: ${url}`);
    testUrl(url, 'Test URL');
}

// Fonction pour attendre le chargement des articles
function waitForArticles() {
    console.log('⏳ Attente du chargement des articles...');
    
    const checkArticles = () => {
        if (window.articles && window.articles.length > 0) {
            console.log('✅ Articles chargés, lancement du test...');
            testGitHubUrls();
        } else {
            console.log('⏳ Articles pas encore chargés, nouvelle tentative dans 1s...');
            setTimeout(checkArticles, 1000);
        }
    };
    
    checkArticles();
}

// Export des fonctions
window.testGitHubUrls = testGitHubUrls;
window.testSpecificUrl = testSpecificUrl;
window.waitForArticles = waitForArticles;

console.log('🧪 Fonctions de test GitHub chargées');
console.log('💡 Utilisez: testGitHubUrls() pour tester tous les articles');
console.log('💡 Utilisez: waitForArticles() pour attendre le chargement');
console.log('💡 Utilisez: testSpecificUrl("URL") pour tester une URL spécifique');
