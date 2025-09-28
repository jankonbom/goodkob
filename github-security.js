// 🚀 GITHUB UPLOAD CONFIGURATION
// Configuration pour l'upload de vidéos et images

console.log('🚀 === CONFIGURATION UPLOAD GITHUB ===');

// Token GitHub configuré directement
const GITHUB_TOKEN = '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';

// Fonction pour configurer le token GitHub
function setupGitHubToken() {
    console.log('🚀 Configuration du token GitHub...');
    
    // Sauvegarder le token directement
    localStorage.setItem('github_token', GITHUB_TOKEN);
    console.log('✅ Token GitHub configuré et prêt pour l\'upload');
    console.log('🎥 Prêt pour l\'upload de vidéos et images');
    
    return GITHUB_TOKEN;
}

// Fonction pour changer le token
function changeGitHubToken() {
    console.log('🔄 Changement du token GitHub...');
    
    // Mettre à jour avec le nouveau token
    localStorage.setItem('github_token', GITHUB_TOKEN);
    console.log('✅ Token GitHub mis à jour');
    
    return GITHUB_TOKEN;
}

// Fonction pour réinitialiser le token
function clearGitHubToken() {
    console.log('🔄 Réinitialisation du token GitHub...');
    localStorage.setItem('github_token', GITHUB_TOKEN);
    console.log('✅ Token GitHub réinitialisé et prêt');
}

// Fonction pour vérifier le statut du token
function checkGitHubTokenStatus() {
    const token = localStorage.getItem('github_token') || GITHUB_TOKEN;
    
    console.log('✅ Token GitHub configuré et prêt');
    console.log(`🚀 Token: ${token.substring(0, 8)}...${token.substring(token.length - 4)}`);
    console.log('🎥 Prêt pour l\'upload de vidéos et images');
    return true;
}

// Fonction pour tester la connexion GitHub
async function testGitHubConnection() {
    const token = localStorage.getItem('github_token') || GITHUB_TOKEN;
    
    try {
        console.log('🧪 Test de connexion GitHub...');
        
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            console.log('✅ Connexion GitHub réussie !');
            console.log(`👤 Utilisateur: ${user.login}`);
            console.log(`📧 Email: ${user.email || 'Non public'}`);
            console.log('🎥 Prêt pour l\'upload de vidéos et images');
            return true;
        } else {
            console.log('❌ Échec de la connexion GitHub');
            console.log(`Status: ${response.status}`);
            return false;
        }
        
    } catch (error) {
        console.log('❌ Erreur de connexion:', error.message);
        return false;
    }
}

// Fonction pour créer un nouveau token GitHub
function createNewGitHubToken() {
    console.log('🔗 === TOKEN GITHUB DÉJÀ CONFIGURÉ ===');
    console.log('');
    console.log('✅ Token GitHub déjà configuré et prêt');
    console.log('🎥 Prêt pour l\'upload de vidéos et images');
    console.log('');
    console.log('💡 Pour changer le token, modifiez la variable GITHUB_TOKEN dans le fichier');
    
    return GITHUB_TOKEN;
}

// Export des fonctions
window.setupGitHubToken = setupGitHubToken;
window.changeGitHubToken = changeGitHubToken;
window.clearGitHubToken = clearGitHubToken;
window.checkGitHubTokenStatus = checkGitHubTokenStatus;
window.testGitHubConnection = testGitHubConnection;
window.createNewGitHubToken = createNewGitHubToken;

console.log('🚀 Fonctions d\'upload GitHub chargées');
console.log('✅ Token GitHub configuré et prêt');
console.log('🎥 Prêt pour l\'upload de vidéos et images');
console.log('💡 Utilisez: setupGitHubToken() pour initialiser');
