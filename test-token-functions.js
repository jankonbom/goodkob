// Test des fonctions de token GitHub
console.log('🧪 === TEST FONCTIONS TOKEN GITHUB ===');

// Fonction pour tester si les fonctions sont disponibles
function testTokenFunctions() {
    console.log('🔍 Vérification des fonctions...');
    
    if (typeof setGitHubToken === 'function') {
        console.log('✅ setGitHubToken disponible');
    } else {
        console.log('❌ setGitHubToken non disponible');
    }
    
    if (typeof getGitHubToken === 'function') {
        console.log('✅ getGitHubToken disponible');
    } else {
        console.log('❌ getGitHubToken non disponible');
    }
    
    if (typeof GITHUB_CONFIG !== 'undefined') {
        console.log('✅ GITHUB_CONFIG disponible');
    } else {
        console.log('❌ GITHUB_CONFIG non disponible');
    }
}

// Fonction pour configurer le token manuellement
function configureGitHubToken() {
    console.log('🔧 === CONFIGURATION TOKEN GITHUB ===');
    console.log('');
    console.log('1️⃣ Ouvrez la console de votre navigateur');
    console.log('2️⃣ Assurez-vous que github-storage.js est chargé');
    console.log('3️⃣ Exécutez: setGitHubToken("votre_token")');
    console.log('');
    console.log('💡 Token actuel: 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');
    console.log('');
    console.log('🔧 Commandes disponibles:');
    console.log('   setGitHubToken("nouveau_token") - Changer le token');
    console.log('   getGitHubToken() - Voir le token actuel');
    console.log('   clearGitHubToken() - Supprimer le token');
}

// Test automatique
testTokenFunctions();

// Export des fonctions
window.testTokenFunctions = testTokenFunctions;
window.configureGitHubToken = configureGitHubToken;

console.log('🧪 Fonctions de test chargées');
console.log('💡 Utilisez: testTokenFunctions() pour vérifier');
console.log('🔧 Utilisez: configureGitHubToken() pour configurer');
