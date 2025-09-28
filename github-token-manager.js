// Gestionnaire de token GitHub - Version simplifiée
console.log('🔐 === GESTIONNAIRE TOKEN GITHUB ===');

// Token GitHub par défaut
const DEFAULT_TOKEN = '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';

// Fonction pour obtenir le token
function getGitHubToken() {
    let token = localStorage.getItem('github_token_secure');
    
    if (!token) {
        token = DEFAULT_TOKEN;
        localStorage.setItem('github_token_secure', token);
        console.log('🔐 Token GitHub sauvegardé automatiquement');
    }
    
    console.log('🔐 Token GitHub actuel:', token.substring(0, 8) + '...');
    return token;
}

// Fonction pour changer le token
function setGitHubToken(newToken) {
    if (!newToken || !newToken.startsWith('ghp_')) {
        console.log('❌ Token invalide. Un token GitHub commence par "ghp_"');
        return false;
    }
    
    localStorage.setItem('github_token_secure', newToken);
    console.log('✅ Token GitHub mis à jour');
    console.log('🔐 Nouveau token:', newToken.substring(0, 8) + '...');
    return true;
}

// Fonction pour supprimer le token
function clearGitHubToken() {
    localStorage.removeItem('github_token_secure');
    console.log('🗑️ Token GitHub supprimé');
    console.log('⚠️ Le token par défaut sera utilisé');
}

// Fonction pour tester le token
async function testGitHubToken() {
    const token = getGitHubToken();
    
    try {
        console.log('🧪 Test du token GitHub...');
        
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            console.log('✅ Token GitHub VALIDE !');
            console.log('👤 Utilisateur:', user.login);
            console.log('📧 Email:', user.email || 'Non public');
            return true;
        } else {
            console.log('❌ Token GitHub INVALIDE');
            console.log('Status:', response.status);
            return false;
        }
        
    } catch (error) {
        console.log('❌ Erreur de test:', error.message);
        return false;
    }
}

// Export des fonctions
window.getGitHubToken = getGitHubToken;
window.setGitHubToken = setGitHubToken;
window.clearGitHubToken = clearGitHubToken;
window.testGitHubToken = testGitHubToken;

console.log('🔐 Gestionnaire de token GitHub chargé');
console.log('💡 Utilisez: getGitHubToken() pour voir le token');
console.log('🔧 Utilisez: setGitHubToken("nouveau_token") pour changer');
console.log('🧪 Utilisez: testGitHubToken() pour tester');
