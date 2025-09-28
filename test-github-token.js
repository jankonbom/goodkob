// Test du token GitHub - Vérification automatique
console.log('🧪 === TEST TOKEN GITHUB ===');

// Fonction de test du token
async function testGitHubToken() {
    const token = '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';
    
    try {
        console.log('🔐 Test du token GitHub...');
        console.log('Token utilisé:', token.substring(0, 8) + '...');
        
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
            console.log('🎥 Prêt pour l\'upload de vidéos et images !');
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

// Test automatique au chargement
testGitHubToken();

// Export pour utilisation
window.testGitHubToken = testGitHubToken;
