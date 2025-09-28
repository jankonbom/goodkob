// Configuration sécurisée - Token GitHub
// Ce fichier sera injecté avec le token depuis les secrets GitHub

window.API_TOKEN = 'INJECTED_FROM_SECRETS';

// Fonction pour vérifier si le token est configuré
function checkTokenConfig() {
    if (window.API_TOKEN === 'INJECTED_FROM_SECRETS') {
        console.log('⚠️ Token non configuré - Utilisez les secrets GitHub');
        return false;
    }
    
    console.log('✅ Token GitHub configuré:', window.API_TOKEN.substring(0, 8) + '...');
    return true;
}

// Export
window.checkTokenConfig = checkTokenConfig;
