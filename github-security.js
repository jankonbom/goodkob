// 🔐 GITHUB SECURITY CONFIGURATION
// Configuration sécurisée pour les tokens GitHub

console.log('🔐 === CONFIGURATION SÉCURITÉ GITHUB ===');

// Fonction pour configurer le token GitHub de manière sécurisée
function setupGitHubToken() {
    console.log('🔐 Configuration du token GitHub...');
    
    // Vérifier si un token existe déjà
    const existingToken = localStorage.getItem('github_token');
    
    if (existingToken) {
        console.log('✅ Token GitHub déjà configuré');
        console.log('💡 Pour changer le token, utilisez: changeGitHubToken()');
        return existingToken;
    }
    
    // Demander le token à l'utilisateur
    const token = prompt('🔐 Entrez votre Personal Access Token GitHub:');
    
    if (!token) {
        console.log('❌ Aucun token fourni');
        return null;
    }
    
    // Valider le format du token (commence par ghp_)
    if (!token.startsWith('ghp_')) {
        console.log('⚠️ Format de token invalide. Un token GitHub commence par "ghp_"');
        return null;
    }
    
    // Sauvegarder le token
    localStorage.setItem('github_token', token);
    console.log('✅ Token GitHub sauvegardé de manière sécurisée');
    
    return token;
}

// Fonction pour changer le token
function changeGitHubToken() {
    console.log('🔄 Changement du token GitHub...');
    
    // Supprimer l'ancien token
    localStorage.removeItem('github_token');
    console.log('🗑️ Ancien token supprimé');
    
    // Configurer le nouveau token
    return setupGitHubToken();
}

// Fonction pour supprimer le token (sécurité)
function clearGitHubToken() {
    console.log('🗑️ Suppression du token GitHub...');
    localStorage.removeItem('github_token');
    console.log('✅ Token supprimé de la mémoire locale');
    console.log('⚠️ Vous devrez reconfigurer le token pour les prochains uploads');
}

// Fonction pour vérifier le statut du token
function checkGitHubTokenStatus() {
    const token = localStorage.getItem('github_token');
    
    if (!token) {
        console.log('❌ Aucun token GitHub configuré');
        console.log('💡 Utilisez: setupGitHubToken() pour configurer');
        return false;
    }
    
    console.log('✅ Token GitHub configuré');
    console.log(`🔐 Token: ${token.substring(0, 8)}...${token.substring(token.length - 4)}`);
    return true;
}

// Fonction pour tester la connexion GitHub
async function testGitHubConnection() {
    const token = localStorage.getItem('github_token');
    
    if (!token) {
        console.log('❌ Aucun token configuré');
        return false;
    }
    
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
    console.log('🔗 === CRÉATION D\'UN NOUVEAU TOKEN GITHUB ===');
    console.log('');
    console.log('📋 Étapes à suivre :');
    console.log('1️⃣ Allez sur: https://github.com/settings/tokens');
    console.log('2️⃣ Cliquez "Generate new token" → "Generate new token (classic)"');
    console.log('3️⃣ Donnez un nom: "DarkLabbb Shop Upload"');
    console.log('4️⃣ Sélectionnez les permissions:');
    console.log('   ✅ repo (Full control of private repositories)');
    console.log('   ✅ public_repo (Access public repositories)');
    console.log('5️⃣ Cliquez "Generate token"');
    console.log('6️⃣ COPIEZ le token (commence par ghp_)');
    console.log('7️⃣ Utilisez: setupGitHubToken() pour le configurer');
    console.log('');
    console.log('⚠️ IMPORTANT: Le token ne sera affiché qu\'une seule fois !');
    
    // Ouvrir automatiquement la page GitHub
    window.open('https://github.com/settings/tokens', '_blank');
}

// Export des fonctions
window.setupGitHubToken = setupGitHubToken;
window.changeGitHubToken = changeGitHubToken;
window.clearGitHubToken = clearGitHubToken;
window.checkGitHubTokenStatus = checkGitHubTokenStatus;
window.testGitHubConnection = testGitHubConnection;
window.createNewGitHubToken = createNewGitHubToken;

console.log('🔐 Fonctions de sécurité GitHub chargées');
console.log('💡 Utilisez: setupGitHubToken() pour commencer');
