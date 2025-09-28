// 📱 TEST MOBILE VIDÉOS - Vérification des vidéos sur mobile
console.log('📱 === TEST MOBILE VIDÉOS ===');

// Fonction pour tester les vidéos sur mobile
function testMobileVideos() {
    console.log('📱 Test des vidéos sur mobile...');
    
    // Détecter si on est sur mobile
    const isMobile = window.innerWidth < 768;
    console.log(`📱 Mobile détecté: ${isMobile ? 'OUI' : 'NON'}`);
    console.log(`📱 Largeur écran: ${window.innerWidth}px`);
    
    if (!isMobile) {
        console.log('💡 Pour tester sur mobile, réduisez la largeur de votre navigateur à moins de 768px');
        return;
    }
    
    // Vérifier les articles
    if (!window.articles || window.articles.length === 0) {
        console.log('❌ Aucun article chargé');
        return;
    }
    
    console.log(`📋 ${window.articles.length} articles disponibles`);
    
    // Trouver les articles avec vidéos
    const videoArticles = window.articles.filter(article => {
        return article.image_url && (
            article.image_url.includes('github.com') && 
            article.image_url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)
        );
    });
    
    console.log(`🎥 ${videoArticles.length} articles avec vidéos GitHub:`);
    
    videoArticles.forEach((article, index) => {
        console.log(`\n📋 Article ${index + 1}: ${article.name}`);
        console.log(`   URL: ${article.image_url}`);
        
        // Test de l'URL
        testMobileVideoUrl(article.image_url, article.name);
    });
}

// Fonction pour tester une URL vidéo sur mobile
function testMobileVideoUrl(url, articleName) {
    console.log(`📱 Test vidéo mobile pour ${articleName}:`);
    
    // Créer un élément vidéo de test
    const testVideo = document.createElement('video');
    testVideo.src = url;
    testVideo.preload = 'metadata';
    testVideo.controls = true;
    testVideo.muted = true;
    testVideo.playsInline = true;
    testVideo.style.width = '100%';
    testVideo.style.height = '200px';
    testVideo.style.border = '2px solid #333';
    testVideo.style.borderRadius = '8px';
    testVideo.style.display = 'block';
    testVideo.style.margin = '10px 0';
    
    // Ajouter un titre
    const title = document.createElement('div');
    title.textContent = `Test vidéo: ${articleName}`;
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '5px';
    
    // Conteneur
    const container = document.createElement('div');
    container.style.margin = '20px 0';
    container.style.padding = '10px';
    container.style.border = '1px solid #555';
    container.style.borderRadius = '8px';
    container.style.backgroundColor = '#f0f0f0';
    
    container.appendChild(title);
    container.appendChild(testVideo);
    
    // Ajouter au DOM
    document.body.appendChild(container);
    
    // Événements de test
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
    
    testVideo.addEventListener('play', () => {
        console.log(`   ▶️ ${articleName}: Lecture démarrée`);
    });
    
    testVideo.addEventListener('error', (e) => {
        console.log(`   ❌ ${articleName}: Erreur de chargement`);
        console.log(`   - Erreur: ${e.target.error?.message || 'Inconnue'}`);
        console.log(`   - Code: ${e.target.error?.code || 'N/A'}`);
    });
    
    // Nettoyer après 30 secondes
    setTimeout(() => {
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
    }, 30000);
}

// Fonction pour simuler un clic sur un article
function simulateArticleClick(articleName) {
    console.log(`📱 Simulation de clic sur: ${articleName}`);
    
    const article = window.articles?.find(a => a.name === articleName);
    if (!article) {
        console.log('❌ Article non trouvé');
        return;
    }
    
    if (window.openProductModal) {
        window.openProductModal(article);
        console.log('✅ Modal ouvert');
    } else {
        console.log('❌ Fonction openProductModal non trouvée');
    }
}

// Export des fonctions
window.testMobileVideos = testMobileVideos;
window.testMobileVideoUrl = testMobileVideoUrl;
window.simulateArticleClick = simulateArticleClick;

console.log('📱 Fonctions de test mobile chargées');
console.log('💡 Utilisez: testMobileVideos() pour tester les vidéos sur mobile');
console.log('💡 Utilisez: simulateArticleClick("Nom de l\'article") pour simuler un clic');


