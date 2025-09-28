// ===== VARIABLES GLOBALES =====
let selectedMediaFile = null;
let isLoggedIn = false;

// ===== FONCTIONS DE CONNEXION =====
function checkSession() {
    const session = localStorage.getItem('admin_session');
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            const now = new Date().getTime();
            if (sessionData.expires > now) {
                isLoggedIn = true;
                showAdminPanel();
                return;
            }
        } catch (e) {
            console.error('Erreur session:', e);
        }
    }
    showLoginPage();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === 'admin123') {
        const sessionData = {
            username: username,
            expires: new Date().getTime() + (24 * 60 * 60 * 1000) // 24h
        };
        localStorage.setItem('admin_session', JSON.stringify(sessionData));
        isLoggedIn = true;
        showAdminPanel();
        showNotification('Connexion réussie !', 'success');
    } else {
        showNotification('Identifiants incorrects', 'error');
    }
}

function logout() {
    localStorage.removeItem('admin_session');
    isLoggedIn = false;
    showLoginPage();
    showNotification('Déconnexion réussie', 'info');
}

function showLoginPage() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadArticles();
    setupMobileOptimizations();
}

// ===== FONCTIONS DE NAVIGATION =====
function switchSection(sectionId) {
    // Masquer toutes les sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher la section sélectionnée
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Mettre à jour la navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Activer l'élément de navigation correspondant
    const activeNavItem = document.querySelector(`[onclick="switchSection('${sectionId}')"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Actions spécifiques par section
    switch(sectionId) {
        case 'articles':
            loadArticles();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'info':
            loadInfo();
            break;
        case 'command-messages':
            loadCommandMessages();
            break;
        case 'github-config':
            checkGitHubTokenStatus();
            break;
        case 'github-setup':
            // Section setup - pas d'action spéciale
            break;
    }
}

// ===== FONCTIONS D'ARTICLES =====
function loadArticles() {
    // Simulation de chargement d'articles
    const articlesContainer = document.getElementById('articlesContainer');
    if (articlesContainer) {
        articlesContainer.innerHTML = `
            <div class="admin-card">
                <h3>📄 Gestion des Articles</h3>
                <p>Interface de gestion des articles en cours de développement...</p>
                <button class="btn btn-primary" onclick="openArticleModal()">
                    <span class="btn-icon">➕</span>
                    Ajouter un Article
                </button>
            </div>
        `;
    }
}

function openArticleModal() {
    document.getElementById('articleModal').style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Ajouter un Article';
    resetArticleForm();
    setupMediaUpload();
}

function closeModal() {
    if (isMobile() && selectedMediaFile) {
        if (!confirm('Êtes-vous sûr de vouloir fermer ? Votre fichier sera perdu.')) {
            return;
        }
    }
    document.getElementById('articleModal').style.display = 'none';
}

function resetArticleForm() {
    document.getElementById('articleForm').reset();
    selectedMediaFile = null;
    resetMediaUpload();
}

// ===== FONCTIONS DRAG & DROP =====
function setupMediaUpload() {
    // Détection de l'appareil
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    const isTelegram = /Telegram/i.test(navigator.userAgent);
    
    // Configuration selon l'appareil
    if (isMobileDevice || isTelegram) {
        // Version Mobile/Telegram
        document.getElementById('mobileUpload').style.display = 'block';
        document.getElementById('pcUpload').style.display = 'none';
        
        const mobileInput = document.getElementById('mobileMediaInput');
        if (mobileInput) {
            mobileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    handleMediaFile(e.target.files[0]);
                }
            });
        }
    } else {
        // Version PC
        document.getElementById('mobileUpload').style.display = 'none';
        document.getElementById('pcUpload').style.display = 'block';
        
        const uploadZone = document.getElementById('mediaUploadZone');
        const mediaInput = document.getElementById('mediaInput');
        const removeMedia = document.getElementById('removeMedia');

        if (!uploadZone || !mediaInput) return;

        // Reset des événements
        uploadZone.replaceWith(uploadZone.cloneNode(true));
        const newUploadZone = document.getElementById('mediaUploadZone');
        const newMediaInput = document.getElementById('mediaInput');
        const newRemoveMedia = document.getElementById('removeMedia');

        // Clic sur la zone - déclencher l'input file
        newUploadZone.addEventListener('click', (e) => {
            newMediaInput.click();
        });

        // Drag & Drop pour PC
        newUploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            newUploadZone.classList.add('dragover');
        });

        newUploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            newUploadZone.classList.remove('dragover');
        });

        newUploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            newUploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleMediaFile(files[0]);
            }
        });

        // Sélection de fichier PC
        newMediaInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleMediaFile(e.target.files[0]);
            }
        });
    }

    // Suppression (pour les deux versions)
    const removeMedia = document.getElementById('removeMedia');
    if (removeMedia) {
        removeMedia.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            resetMediaUpload();
        });
    }
}

function handleMediaFile(file) {
    // Vérifier le type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    if (!validTypes.includes(file.type)) {
        showNotification('Format de fichier non supporté', 'error');
        return;
    }

    selectedMediaFile = file;
    const preview = document.getElementById('mediaPreview');
    const previewImg = document.getElementById('previewImg');
    const previewVideo = document.getElementById('previewVideo');
    const uploadZone = document.getElementById('mediaUploadZone');

    // Masquer la zone d'upload et afficher l'aperçu
    uploadZone.style.display = 'none';
    preview.style.display = 'block';

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            previewVideo.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        previewVideo.src = url;
        previewVideo.style.display = 'block';
        previewImg.style.display = 'none';
        
        // Optimisations pour mobile
        if (isMobile()) {
            previewVideo.setAttribute('playsinline', 'true');
            previewVideo.setAttribute('webkit-playsinline', 'true');
            previewVideo.setAttribute('preload', 'metadata');
            previewVideo.setAttribute('controls', 'true');
        }
    }
    
    showNotification('Fichier sélectionné avec succès !', 'success');
}

function resetMediaUpload() {
    const uploadZone = document.getElementById('mediaUploadZone');
    const preview = document.getElementById('mediaPreview');
    const previewImg = document.getElementById('previewImg');
    const previewVideo = document.getElementById('previewVideo');
    
    if (uploadZone) uploadZone.style.display = 'block';
    if (preview) preview.style.display = 'none';
    if (previewImg) {
        previewImg.src = '';
        previewImg.style.display = 'none';
    }
    if (previewVideo) {
        previewVideo.src = '';
        previewVideo.style.display = 'none';
    }
    
    selectedMediaFile = null;
}

// ===== FONCTIONS DE SAUVEGARDE =====
async function saveArticle(event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Empêcher la fermeture du modal sur mobile
    if (isMobile()) {
        event.stopImmediatePropagation();
    }
    
    const formData = new FormData(event.target);
    const stockStatus = formData.get('stock_status');
    
    if (!selectedMediaFile) {
        showNotification('Veuillez sélectionner une image ou vidéo', 'error');
        return;
    }
    
    // Vérifier si le token existe avant l'upload
    const token = localStorage.getItem('github_token_imageforko');
    if (!token) {
        showNotification('❌ Token GitHub manquant. Configurez-le d\'abord dans l\'onglet "Config Token"', 'error');
        return;
    }
    
    try {
        showNotification('Upload en cours...', 'info');
        
        // Vérifier que le token est bien chargé
        const tokenCheck = localStorage.getItem('github_token_imageforko');
        if (!tokenCheck) {
            throw new Error('Token GitHub non trouvé');
        }
        
        // Upload vers GitHub
        const mediaUrl = await uploadToGitHub(selectedMediaFile);
        
        if (mediaUrl) {
            showNotification('Article sauvegardé avec succès !', 'success');
            closeModal();
            loadArticles();
        } else {
            showNotification('Erreur lors de l\'upload', 'error');
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showNotification('Erreur lors de la sauvegarde: ' + error.message, 'error');
    }
}

// ===== FONCTIONS MOBILE =====
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

function setupMobileOptimizations() {
    if (isMobile()) {
        // Ajouter des classes CSS pour mobile
        document.body.classList.add('mobile-device');
        
        // Optimiser les zones de clic pour le tactile
        const clickableElements = document.querySelectorAll('.btn, .nav-item, .article-card, .modal-close');
        clickableElements.forEach(element => {
            element.style.minHeight = '44px';
            element.style.minWidth = '44px';
        });
        
        // Forcer le chargement des vidéos
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.setAttribute('playsinline', 'true');
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('preload', 'metadata');
            video.load();
        });
        
        // Protection basique du modal sur mobile
        const modal = document.getElementById('articleModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            });
        }
        
        // Configuration simple pour mobile
        const mediaInput = document.getElementById('mediaInput');
        if (mediaInput) {
            mediaInput.setAttribute('accept', 'image/*,video/*');
            mediaInput.style.fontSize = '16px';
        }
    }
}

// ===== FONCTIONS GITHUB TOKEN =====
function checkGitHubTokenStatus() {
    const tokenStatus = document.getElementById('tokenStatus');
    if (!tokenStatus) return;
    
    const token = localStorage.getItem('github_token_imageforko');
    if (token) {
        tokenStatus.innerHTML = `
            <span class="status-icon">✅</span>
            <span class="status-text">Token configuré (${token.substring(0, 8)}...)</span>
        `;
    } else {
        tokenStatus.innerHTML = `
            <span class="status-icon">❌</span>
            <span class="status-text">Aucun token configuré</span>
        `;
    }
}

async function testGitHubToken() {
    try {
        showNotification('🧪 Test du token GitHub...', 'info');
        
        const token = localStorage.getItem('github_token_imageforko');
        if (!token) {
            showNotification('❌ Aucun token trouvé. Essayez d\'uploader une vidéo pour le configurer.', 'error');
            return;
        }
        
        // Test simple avec l'API GitHub
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            showNotification(`✅ Token valide ! Connecté en tant que ${user.login}`, 'success');
            checkGitHubTokenStatus();
        } else {
            showNotification('❌ Token invalide ou expiré', 'error');
        }
    } catch (error) {
        console.error('Erreur test token:', error);
        showNotification('❌ Erreur lors du test du token', 'error');
    }
}

function clearGitHubToken() {
    if (confirm('Êtes-vous sûr de vouloir effacer le token GitHub ?')) {
        localStorage.removeItem('github_token_imageforko');
        showNotification('🗑️ Token effacé', 'info');
        checkGitHubTokenStatus();
    }
}

function showTokenInstructions() {
    const instructions = `
🔑 INSTRUCTIONS TOKEN GITHUB

1️⃣ Créer un token :
   • Allez sur GitHub.com → Settings → Developer settings
   • Personal Access Tokens → Tokens (classic)
   • Generate new token (classic)
   • Nom : "Upload Videos"
   • Permissions : repo (Full control)
   • Copiez le token (ghp_...)

2️⃣ Utilisation :
   • Le token sera demandé automatiquement
   • Une seule fois par navigateur
   • Fonctionne sur PC, mobile, tablet

3️⃣ Sécurité :
   • Token stocké localement
   • Aucun token dans le code
   • GitHub ne peut pas le supprimer
    `;
    
    alert(instructions);
}

// ===== FONCTIONS TOKEN DIRECT =====
function toggleTokenVisibility() {
    const tokenInput = document.getElementById('tokenInput');
    const toggleBtn = document.querySelector('.btn-toggle .btn-icon');
    
    if (tokenInput.type === 'password') {
        tokenInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        tokenInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

function saveTokenDirectly() {
    const tokenInput = document.getElementById('tokenInput');
    const token = tokenInput.value.trim();
    
    if (!token) {
        showNotification('❌ Veuillez entrer un token', 'error');
        return;
    }
    
    if (!token.startsWith('ghp_')) {
        showNotification('❌ Format de token invalide (doit commencer par ghp_)', 'error');
        return;
    }
    
    // Sauvegarder dans localStorage
    localStorage.setItem('github_token_imageforko', token);
    
    // Mettre à jour le statut
    updateSetupStatus('✅ Token sauvegardé avec succès !', 'success');
    
    // Effacer le champ
    tokenInput.value = '';
    
    // Mettre à jour l'autre section
    checkGitHubTokenStatus();
    
    showNotification('✅ Token sauvegardé avec succès !', 'success');
}

function clearTokenInput() {
    const tokenInput = document.getElementById('tokenInput');
    tokenInput.value = '';
    updateSetupStatus('ℹ️ Prêt à configurer votre token', 'info');
}

function generateNewToken() {
    window.open('https://github.com/settings/tokens/new', '_blank');
    updateSetupStatus('🔗 Ouvrez GitHub pour créer un nouveau token', 'info');
}

function updateSetupStatus(message, type) {
    const setupStatus = document.getElementById('setupStatus');
    if (!setupStatus) return;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    const color = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8';
    
    setupStatus.innerHTML = `
        <div class="status-message">
            <span class="status-icon">${icon}</span>
            <span class="status-text">${message}</span>
        </div>
    `;
    
    setupStatus.style.borderColor = color;
}

// ===== FONCTIONS UTILITAIRES =====
function showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Styles de notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    return colors[type] || '#17a2b8';
}

// ===== FONCTIONS DE CHARGEMENT =====
function loadCategories() {
    const container = document.getElementById('categoriesContainer');
    if (container) {
        container.innerHTML = `
            <div class="admin-card">
                <h3>📁 Gestion des Catégories</h3>
                <p>Interface de gestion des catégories en cours de développement...</p>
            </div>
        `;
    }
}

function loadInfo() {
    const container = document.getElementById('infoContainer');
    if (container) {
        container.innerHTML = `
            <div class="admin-card">
                <h3>ℹ️ Informations Système</h3>
                <p>Informations système en cours de développement...</p>
            </div>
        `;
    }
}

function loadCommandMessages() {
    const container = document.getElementById('commandMessagesContainer');
    if (container) {
        container.innerHTML = `
            <div class="admin-card">
                <h3>💬 Messages de Commande</h3>
                <p>Interface de gestion des messages de commande en cours de développement...</p>
            </div>
        `;
    }
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier la session existante
    checkSession();
    
    // Vérifier le statut du token GitHub
    checkGitHubTokenStatus();
    
    // Ajouter les styles d'animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
