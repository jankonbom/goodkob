// Test du token GitHub sur mobile
console.log('📱 === TEST TOKEN MOBILE ===');

// Fonction de test du token sur mobile
async function testMobileToken() {
    const token = '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';
    
    try {
        console.log('🔐 Test du token sur mobile...');
        console.log('Token:', token.substring(0, 8) + '...');
        
        // Test de l'API GitHub
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        console.log('📊 Status:', response.status);
        
        if (response.ok) {
            const user = await response.json();
            console.log('✅ Token VALIDE sur mobile !');
            console.log('👤 Utilisateur:', user.login);
            console.log('📧 Email:', user.email || 'Non public');
            console.log('🎥 Prêt pour l\'upload !');
            return true;
        } else {
            const error = await response.json();
            console.log('❌ Token INVALIDE sur mobile');
            console.log('Erreur:', error.message);
            console.log('Status:', response.status);
            return false;
        }
        
    } catch (error) {
        console.log('❌ Erreur de connexion mobile:', error.message);
        return false;
    }
}

// Test automatique
testMobileToken();

// Export
window.testMobileToken = testMobileToken;
