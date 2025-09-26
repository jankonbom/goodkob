// 🔍 DEBUG SUPABASE - Vérification de la connexion
console.log('🔍 === DEBUG SUPABASE ===');

// Fonction pour vérifier la connexion Supabase
function debugSupabase() {
    console.log('🔍 Vérification de la connexion Supabase...');
    
    // Vérifier les variables
    console.log('📋 Variables Supabase:');
    console.log('   SUPABASE_URL:', typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : '❌ NON DÉFINIE');
    console.log('   SUPABASE_ANON_KEY:', typeof SUPABASE_ANON_KEY !== 'undefined' ? '✅ DÉFINIE' : '❌ NON DÉFINIE');
    console.log('   supabaseClient:', typeof supabaseClient !== 'undefined' ? '✅ DÉFINIE' : '❌ NON DÉFINIE');
    
    // Vérifier les articles
    console.log('📋 Articles:');
    console.log('   window.articles:', typeof window.articles !== 'undefined' ? window.articles.length : '❌ NON DÉFINIE');
    
    // Test de connexion
    if (typeof supabaseClient !== 'undefined') {
        console.log('🧪 Test de connexion Supabase...');
        
        supabaseClient
            .from('articles')
            .select('count')
            .then(({ data, error }) => {
                if (error) {
                    console.log('❌ Erreur Supabase:', error);
                } else {
                    console.log('✅ Connexion Supabase OK');
                    console.log('   Nombre d\'articles:', data[0]?.count || 0);
                }
            })
            .catch(err => {
                console.log('❌ Erreur de connexion:', err);
            });
    } else {
        console.log('❌ supabaseClient non disponible');
    }
}

// Fonction pour forcer le rechargement des articles
function forceReloadArticles() {
    console.log('🔄 Forçage du rechargement des articles...');
    
    if (typeof window.loadArticles === 'function') {
        window.loadArticles();
    } else if (typeof loadArticles === 'function') {
        loadArticles();
    } else {
        console.log('❌ Fonction loadArticles non trouvée');
        console.log('💡 Essayez: window.loadArticles() ou window.reloadArticles()');
    }
}

// Fonction pour tester la connexion manuellement
async function testSupabaseConnection() {
    console.log('🧪 Test manuel de connexion Supabase...');
    
    try {
        const response = await fetch('https://aapicehoqxdwixbiqucs.supabase.co/rest/v1/articles?select=count', {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcGljZWhvcXhkd2l4YmlxdWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzE5ODMsImV4cCI6MjA3MzAwNzk4M30.jBTeUfGBkVT0-5ElCD1NM6fCQCD7wnRpw4I2ulykLOQ',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcGljZWhvcXhkd2l4YmlxdWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzE5ODMsImV4cCI6MjA3MzAwNzk4M30.jBTeUfGBkVT0-5ElCD1NM6fCQCD7wnRpw4I2ulykLOQ',
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Connexion Supabase OK');
            console.log('   Données reçues:', data);
        } else {
            console.log('❌ Erreur HTTP:', response.status, response.statusText);
        }
    } catch (error) {
        console.log('❌ Erreur de connexion:', error);
    }
}

// Export des fonctions
window.debugSupabase = debugSupabase;
window.forceReloadArticles = forceReloadArticles;
window.testSupabaseConnection = testSupabaseConnection;

console.log('🔍 Fonctions de debug Supabase chargées');
console.log('💡 Utilisez: debugSupabase() pour vérifier la connexion');
console.log('💡 Utilisez: forceReloadArticles() pour recharger les articles');
console.log('💡 Utilisez: testSupabaseConnection() pour tester manuellement');
