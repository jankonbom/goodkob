// Générateur de token GitHub automatique
console.log('🔑 === GÉNÉRATEUR TOKEN GITHUB ===');

// Fonction pour créer un nouveau token GitHub
function createNewGitHubToken() {
    console.log('🔗 === CRÉATION NOUVEAU TOKEN GITHUB ===');
    console.log('');
    console.log('📋 Étapes pour créer un nouveau token :');
    console.log('');
    console.log('1️⃣ Allez sur: https://github.com/settings/tokens');
    console.log('2️⃣ Cliquez "Generate new token" → "Generate new token (classic)"');
    console.log('3️⃣ Nom: "DarkLabbb Shop Upload"');
    console.log('4️⃣ Expiration: "No expiration" (recommandé)');
    console.log('5️⃣ Permissions:');
    console.log('   ✅ repo (Full control of private repositories)');
    console.log('   ✅ public_repo (Access public repositories)');
    console.log('   ✅ workflow (Update GitHub Action workflows)');
    console.log('6️⃣ Cliquez "Generate token"');
    console.log('7️⃣ COPIEZ le token (commence par ghp_)');
    console.log('8️⃣ Remplacez le token dans github-storage.js');
    console.log('');
    console.log('⚠️ IMPORTANT: Le token ne sera affiché qu\'une seule fois !');
    console.log('💡 Gardez-le secret et ne le partagez jamais !');
    
    // Ouvrir automatiquement la page GitHub
    window.open('https://github.com/settings/tokens', '_blank');
    
    return {
        instructions: 'Suivez les étapes ci-dessus',
        url: 'https://github.com/settings/tokens',
        permissions: ['repo', 'public_repo', 'workflow']
    };
}

// Fonction pour tester un token
async function testGitHubToken(token) {
    if (!token) {
        console.log('❌ Aucun token fourni');
        return false;
    }
    
    try {
        console.log('🧪 Test du token GitHub...');
        console.log('Token:', token.substring(0, 8) + '...');
        
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
            console.log('🎥 Prêt pour l\'upload !');
            return true;
        } else {
            console.log('❌ Token GitHub INVALIDE');
            console.log('Status:', response.status);
            const error = await response.json();
            console.log('Erreur:', error.message);
            return false;
        }
        
    } catch (error) {
        console.log('❌ Erreur de test:', error.message);
        return false;
    }
}

// Fonction pour mettre à jour le token dans le code
function updateGitHubToken(newToken) {
    console.log('🔄 Mise à jour du token GitHub...');
    
    if (!newToken || !newToken.startsWith('ghp_')) {
        console.log('❌ Token invalide. Un token GitHub commence par "ghp_"');
        return false;
    }
    
    // Mettre à jour le localStorage
    localStorage.setItem('github_token', newToken);
    console.log('✅ Token sauvegardé dans localStorage');
    console.log('💡 Vous devez maintenant mettre à jour le fichier github-storage.js');
    console.log('🔧 Remplacez le token dans la ligne: const token = "votre_nouveau_token";');
    
    return true;
}

// Fonction pour obtenir un token depuis localStorage
function getStoredToken() {
    const token = localStorage.getItem('github_token');
    if (token) {
        console.log('🔐 Token trouvé dans localStorage:', token.substring(0, 8) + '...');
        return token;
    } else {
        console.log('❌ Aucun token dans localStorage');
        return null;
    }
}

// Export des fonctions
window.createNewGitHubToken = createNewGitHubToken;
window.testGitHubToken = testGitHubToken;
window.updateGitHubToken = updateGitHubToken;
window.getStoredToken = getStoredToken;

console.log('🔑 Générateur de token GitHub chargé');
console.log('💡 Utilisez: createNewGitHubToken() pour créer un nouveau token');
console.log('🧪 Utilisez: testGitHubToken("votre_token") pour tester');
console.log('🔄 Utilisez: updateGitHubToken("nouveau_token") pour mettre à jour');
