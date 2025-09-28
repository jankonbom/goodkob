// GitHub Repository Storage - Upload automatique
// Configuration GitHub Repository - TOKEN SÉCURISÉ
const GITHUB_CONFIG = {
    username: 'jankonbom',
    repository: 'imageforko', // Repository pour stocker les vidéos
    branch: 'main',
    baseUrl: 'https://raw.githubusercontent.com',
    apiUrl: 'https://api.github.com',
    // Token sécurisé - récupéré depuis localStorage
    getToken: function() {
        // Vérifier d'abord dans localStorage
        let token = localStorage.getItem('github_token_imageforko');
        
        if (!token) {
            // Si pas de token, demander à l'utilisateur
            token = prompt('🔑 Entrez votre token GitHub pour imageforko:');
            if (token && token.trim()) {
                localStorage.setItem('github_token_imageforko', token.trim());
                console.log('✅ Token sauvegardé pour les prochaines fois');
            } else {
                throw new Error('Token GitHub requis pour l\'upload');
            }
        }
        
        // Vérifier que le token est valide
        if (!token.startsWith('ghp_')) {
            console.error('❌ Format de token invalide');
            localStorage.removeItem('github_token_imageforko');
            throw new Error('Format de token invalide. Le token doit commencer par "ghp_"');
        }
        
        console.log('🔐 Token utilisé:', token.substring(0, 8) + '...');
        console.log('📁 Upload vers: jankonbom/imageforko');
        return token;
    }
};

// Fonction pour forcer l'utilisation du token
function forceGitHubToken() {
    const token = GITHUB_CONFIG.getToken();
    console.log('🔐 Token GitHub sécurisé:', token.substring(0, 8) + '...');
    return token;
}

// Fonction pour configurer GitHub
function setupGitHubStorage(username, repository = 'darklabbb-shop-images') {
    GITHUB_CONFIG.username = username;
    GITHUB_CONFIG.repository = repository;
    
    console.log('🔧 Configuration GitHub Storage...');
    console.log(`👤 Utilisateur: ${username}`);
    console.log(`📁 Repository: ${repository}`);
    console.log(`🔗 URLs: https://raw.githubusercontent.com/${username}/${repository}/main/`);
    
    // Instructions pour créer le repository
    console.log('');
    console.log('📋 ÉTAPES POUR CRÉER LE REPOSITORY :');
    console.log('1️⃣ Allez sur https://github.com/new');
    console.log(`2️⃣ Nom du repository: ${repository}`);
    console.log('3️⃣ Description: "Images pour DarkLabbb Shop"');
    console.log('4️⃣ Cochez "Public" (obligatoire pour URLs gratuites)');
    console.log('5️⃣ Cochez "Add a README file"');
    console.log('6️⃣ Cliquez "Create repository"');
    console.log('');
    console.log('✅ Une fois créé, utilisez: uploadToGitHub(file, fileName)');
    
    return {
        username,
        repository,
        uploadUrl: `https://raw.githubusercontent.com/${username}/${repository}/main/`,
        setupComplete: true
    };
}

// Upload vers GitHub via API avec fallback
async function uploadToGitHub(file, fileName, githubToken = null) {
    try {
        console.log('📤 Upload vers GitHub:', fileName);
        
        // Vérifier que le fichier existe
        if (!file) {
            throw new Error('Aucun fichier sélectionné');
        }
        
        // Récupérer le token avec vérification
        let token;
        try {
            token = GITHUB_CONFIG.getToken();
        } catch (tokenError) {
            console.error('❌ Erreur token:', tokenError.message);
            throw new Error('Token GitHub manquant ou invalide. Configurez-le d\'abord.');
        }
        
        // Convertir le fichier en base64
        const base64Content = await fileToBase64(file);
        
        // URL de l'API GitHub
        const apiUrl = `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/contents/${fileName}`;
        
        // Données pour l'upload
        const uploadData = {
            message: `Upload: ${fileName}`,
            content: base64Content,
            branch: GITHUB_CONFIG.branch
        };
        
        console.log('📤 Tentative d\'upload vers GitHub...');
        
        // Upload via API GitHub avec retry
        let response;
        let attempts = 0;
        const maxAttempts = 2;
        
        while (attempts < maxAttempts) {
            try {
                response = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    body: JSON.stringify(uploadData)
                });
                
                if (response.ok) {
                    break;
                } else if (response.status === 401) {
                    console.error('❌ Token invalide');
                    localStorage.removeItem('github_token_imageforko');
                    throw new Error('Token GitHub invalide ou expiré');
                }
                
                attempts++;
                if (attempts < maxAttempts) {
                    console.log(`🔄 Tentative ${attempts + 1}/${maxAttempts}...`);
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } catch (fetchError) {
                attempts++;
                if (attempts >= maxAttempts) {
                    throw fetchError;
                }
                console.log(`🔄 Erreur réseau, tentative ${attempts + 1}/${maxAttempts}...`);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Erreur GitHub API: ${error.message}`);
        }
        
        const result = await response.json();
        const publicUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/main/${fileName}`;
        
        console.log('✅ Upload réussi:', publicUrl);
        return publicUrl;
        
    } catch (error) {
        console.error('❌ Erreur upload GitHub:', error);
        throw error;
    }
}

// Upload manuel vers GitHub (sans token - méthode alternative)
function uploadToGitHubManual(file, fileName) {
    console.log('📤 === UPLOAD MANUEL VERS GITHUB ===');
    console.log('');
    console.log('🎯 MÉTHODE MANUELLE (100% gratuite) :');
    console.log('');
    console.log('1️⃣ Ouvrez votre repository GitHub :');
    console.log(`   https://github.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}`);
    console.log('');
    console.log('2️⃣ Cliquez sur "Add file" → "Upload files"');
    console.log('');
    console.log('3️⃣ Glissez votre fichier dans la zone');
    console.log(`   Nom du fichier: ${fileName}`);
    console.log('');
    console.log('4️⃣ Message de commit: "Upload image: ' + fileName + '"');
    console.log('');
    console.log('5️⃣ Cliquez "Commit changes"');
    console.log('');
    console.log('6️⃣ Votre URL sera :');
    console.log(`   https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/main/${fileName}`);
    console.log('');
    console.log('💡 Copiez cette URL et utilisez-la dans votre application !');
    
    // Ouvrir automatiquement le repository
    window.open(`https://github.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}`, '_blank');
    
    return {
        method: 'manual',
        instructions: 'Suivez les étapes ci-dessus',
        finalUrl: `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/main/${fileName}`
    };
}

// Migration automatique depuis Cloudinary vers GitHub
async function migrateFromCloudinaryToGitHub(githubToken = null) {
    try {
        console.log('🔄 === MIGRATION CLOUDINARY → GITHUB ===');
        
        if (!GITHUB_CONFIG.username || GITHUB_CONFIG.username === 'YOUR_GITHUB_USERNAME') {
            throw new Error('Configurez d\'abord votre GitHub avec setupGitHubStorage(username)');
        }
        
        // Token GitHub direct
        const token = GITHUB_CONFIG.getToken();
        
        // Récupérer les articles avec images Cloudinary
        const { data: articles, error } = await supabaseClient
            .from('articles')
            .select('*');
            
        if (error) throw error;
        
        const cloudinaryAssets = articles.filter(article => 
            article.image_url && article.image_url.includes('cloudinary.com')
        );
        
        console.log(`📦 ${cloudinaryAssets.length} assets à migrer vers GitHub`);
        
        let migratedCount = 0;
        const migrationResults = [];
        
        for (const article of cloudinaryAssets) {
            try {
                console.log(`🔄 Migration: ${article.name}...`);
                
                // Télécharger l'image depuis Cloudinary
                const response = await fetch(article.image_url);
                if (!response.ok) {
                    console.warn(`⚠️ Impossible de télécharger ${article.name}`);
                    continue;
                }
                
                const blob = await response.blob();
                const fileExtension = article.image_url.split('.').pop().split('?')[0];
                const fileName = `article_${article.id}_${Date.now()}.${fileExtension}`;
                
                let newUrl;
                
                if (token) {
                    // Upload automatique avec token
                    newUrl = await uploadToGitHub(blob, fileName, token);
                } else {
                    // Mode manuel
                    console.log(`📋 Pour ${article.name}, suivez ces étapes :`);
                    console.log(`   1. Téléchargez: ${article.image_url}`);
                    console.log(`   2. Renommez en: ${fileName}`);
                    console.log(`   3. Uploadez vers GitHub`);
                    console.log(`   4. URL finale: https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/main/${fileName}`);
                    
                    newUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/main/${fileName}`;
                }
                
                // Mettre à jour l'article avec la nouvelle URL
                await supabaseClient
                    .from('articles')
                    .update({ image_url: newUrl })
                    .eq('id', article.id);
                
                migratedCount++;
                migrationResults.push({
                    article: article.name,
                    oldUrl: article.image_url,
                    newUrl: newUrl,
                    status: 'success'
                });
                
                console.log(`✅ Migré: ${article.name}`);
                
                // Délai pour éviter la surcharge
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (error) {
                console.error(`❌ Erreur migration ${article.name}:`, error);
                migrationResults.push({
                    article: article.name,
                    error: error.message,
                    status: 'failed'
                });
            }
        }
        
        console.log(`🎉 Migration terminée: ${migratedCount}/${cloudinaryAssets.length} assets migrés`);
        return { 
            success: true, 
            migrated: migratedCount, 
            total: cloudinaryAssets.length,
            results: migrationResults
        };
        
    } catch (error) {
        console.error('❌ Erreur migration GitHub:', error);
        return { success: false, error: error.message };
    }
}

// Fonction utilitaire : convertir fichier en base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1]; // Enlever le préfixe data:image/...
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Instructions pour obtenir un token GitHub
function getGitHubTokenInstructions() {
    console.log('🔑 === TOKEN GITHUB ===');
    console.log('1️⃣ Allez sur: https://github.com/settings/tokens');
    console.log('2️⃣ Cliquez "Generate new token" → "Generate new token (classic)"');
    console.log('3️⃣ Nom: "DarkLabbb Shop Upload"');
    console.log('4️⃣ Permissions: repo, public_repo');
    console.log('5️⃣ Cliquez "Generate token"');
    console.log('6️⃣ COPIEZ le token');
}

// Configuration rapide GitHub
function quickGitHubSetup() {
    console.log('🚀 === SETUP GITHUB ===');
    console.log('1️⃣ Créer repository: https://github.com/new');
    console.log('2️⃣ Nom: darklabbb-shop-images');
    console.log('3️⃣ Public: ✅');
    console.log('4️⃣ Configurer: setupGitHubStorage("VOTRE_USERNAME")');
    console.log('✅ Prêt pour l\'upload !');
}

// Fonctions de gestion du token fixe
function setGitHubToken(newToken) {
    if (!newToken || !newToken.startsWith('ghp_')) {
        console.log('❌ Token invalide. Un token GitHub commence par "ghp_"');
        return false;
    }
    
    // Mettre à jour le token dans le code directement
    console.log('⚠️ Pour changer le token, modifiez la ligne 12 dans github-storage.js');
    console.log('🔐 Token actuel:', GITHUB_CONFIG.getToken().substring(0, 8) + '...');
    console.log('💡 Nouveau token:', newToken.substring(0, 8) + '...');
    return true;
}

function getGitHubToken() {
    const token = GITHUB_CONFIG.getToken();
    console.log('🔐 Token GitHub fixe:', token.substring(0, 8) + '...');
    return token;
}

function clearGitHubToken() {
    console.log('⚠️ Token fixe - ne peut pas être supprimé');
    console.log('💡 Pour changer le token, modifiez le code directement');
}

// Export des fonctions
window.GITHUB_CONFIG = GITHUB_CONFIG;
window.forceGitHubToken = forceGitHubToken;
window.setGitHubToken = setGitHubToken;
window.getGitHubToken = getGitHubToken;
window.clearGitHubToken = clearGitHubToken;
window.setupGitHubStorage = setupGitHubStorage;
window.uploadToGitHub = uploadToGitHub;
window.uploadToGitHubManual = uploadToGitHubManual;
window.migrateFromCloudinaryToGitHub = migrateFromCloudinaryToGitHub;
window.getGitHubTokenInstructions = getGitHubTokenInstructions;
window.quickGitHubSetup = quickGitHubSetup;

console.log('🐙 GitHub Storage configuré !');
console.log('✅ Token GitHub fixe et prêt');
console.log('🔐 Token fixe:', GITHUB_CONFIG.getToken().substring(0, 8) + '...');
console.log('📤 Upload automatique: uploadToGitHub(file, fileName)');
console.log('🌐 Fonctionne sur tous les appareils (PC, mobile, tablette)');
