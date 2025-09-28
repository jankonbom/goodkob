// Test direct du token GitHub
console.log('🧪 === TEST DIRECT TOKEN GITHUB ===');

// Votre token actuel
const TOKEN = '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';

// Fonction de test directe
async function testTokenDirect() {
    console.log('🔐 Test du token:', TOKEN.substring(0, 8) + '...');
    
    try {
        // Test 1: Vérifier l'utilisateur
        console.log('📊 Test 1: Vérification utilisateur...');
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        console.log('📊 Status utilisateur:', userResponse.status);
        
        if (userResponse.ok) {
            const user = await userResponse.json();
            console.log('✅ Utilisateur valide:', user.login);
        } else {
            const error = await userResponse.json();
            console.log('❌ Erreur utilisateur:', error);
        }
        
        // Test 2: Vérifier l'accès au repository
        console.log('📊 Test 2: Vérification repository...');
        const repoResponse = await fetch('https://api.github.com/repos/jankonbom/imageforko', {
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        console.log('📊 Status repository:', repoResponse.status);
        
        if (repoResponse.ok) {
            const repo = await repoResponse.json();
            console.log('✅ Repository accessible:', repo.name);
        } else {
            const error = await repoResponse.json();
            console.log('❌ Erreur repository:', error);
        }
        
        // Test 3: Vérifier les permissions
        console.log('📊 Test 3: Vérification permissions...');
        const contentsResponse = await fetch('https://api.github.com/repos/jankonbom/imageforko/contents', {
            headers: {
                'Authorization': `token ${TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        console.log('📊 Status contents:', contentsResponse.status);
        
        if (contentsResponse.ok) {
            console.log('✅ Permissions OK - Peut lire le repository');
        } else {
            const error = await contentsResponse.json();
            console.log('❌ Erreur permissions:', error);
        }
        
    } catch (error) {
        console.log('❌ Erreur de test:', error.message);
    }
}

// Test automatique
testTokenDirect();

// Export
window.testTokenDirect = testTokenDirect;
