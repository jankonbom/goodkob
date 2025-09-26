// 🎥 AUTOPLAY VIDEOS - Lancement automatique de toutes les vidéos
console.log('🎥 === AUTOPLAY VIDEOS ===');

// Fonction pour forcer le lancement de toutes les vidéos
function forceAllVideosAutoplay() {
    console.log('🎥 Forçage du lancement de toutes les vidéos...');
    
    const videos = document.querySelectorAll('video');
    console.log(`📹 ${videos.length} vidéos trouvées`);
    
    if (videos.length === 0) {
        console.log('⚠️ Aucune vidéo trouvée, attente de 2 secondes...');
        setTimeout(forceAllVideosAutoplay, 2000);
        return;
    }
    
    videos.forEach((video, index) => {
        console.log(`🎬 Configuration vidéo ${index + 1}`);
        
        // Configuration optimisée
        video.controls = false;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;
        video.style.pointerEvents = 'none';
        video.style.outline = 'none';
        video.style.border = 'none';
        
        // Forcer le chargement
        video.load();
        
        // Essayer de lancer
        video.play().then(() => {
            console.log(`✅ Vidéo ${index + 1} lancée avec succès`);
        }).catch(e => {
            console.log(`⚠️ Vidéo ${index + 1} bloquée:`, e.message);
            
            // Retry multiple
            setTimeout(() => {
                video.play().then(() => {
                    console.log(`✅ Vidéo ${index + 1} lancée en retry 1`);
                }).catch(e2 => {
                    setTimeout(() => {
                        video.play().then(() => {
                            console.log(`✅ Vidéo ${index + 1} lancée en retry 2`);
                        }).catch(e3 => {
                            console.log(`❌ Vidéo ${index + 1} définitivement bloquée`);
                        });
                    }, 1000);
                });
            }, 500);
        });
    });
    
    // Retry final après 3 secondes
    setTimeout(() => {
        console.log('🔄 Retry final de toutes les vidéos...');
        videos.forEach((video, index) => {
            if (video.paused) {
                video.play().then(() => {
                    console.log(`✅ Vidéo ${index + 1} lancée en retry final`);
                }).catch(e => {
                    console.log(`❌ Vidéo ${index + 1} toujours bloquée`);
                });
            }
        });
    }, 3000);
}

// Fonction pour surveiller l'ajout de nouvelles vidéos
function watchForNewVideos() {
    console.log('👀 Surveillance des nouvelles vidéos...');
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    const videos = node.querySelectorAll ? node.querySelectorAll('video') : [];
                    if (node.tagName === 'VIDEO') {
                        videos.push(node);
                    }
                    
                    videos.forEach(video => {
                        console.log('🎬 Nouvelle vidéo détectée, configuration...');
                        
                        // Configuration optimisée
                        video.controls = false;
                        video.muted = true;
                        video.loop = true;
                        video.playsInline = true;
                        video.autoplay = true;
                        video.style.pointerEvents = 'none';
                        video.style.outline = 'none';
                        video.style.border = 'none';
                        
                        // Forcer le chargement et lancement
                        video.load();
                        video.play().catch(e => {
                            console.log('⚠️ Nouvelle vidéo bloquée:', e.message);
                        });
                    });
                }
            });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

// Fonction pour lancer toutes les vidéos avec interaction
function unlockAllVideos() {
    console.log('🔓 Déblocage de toutes les vidéos avec interaction...');
    
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
        video.play().then(() => {
            console.log(`✅ Vidéo ${index + 1} débloquée`);
        }).catch(e => {
            console.log(`❌ Vidéo ${index + 1} toujours bloquée`);
        });
    });
}

// Export des fonctions
window.forceAllVideosAutoplay = forceAllVideosAutoplay;
window.watchForNewVideos = watchForNewVideos;
window.unlockAllVideos = unlockAllVideos;

// Auto-lancement au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎥 Auto-lancement des vidéos au chargement...');
    
    // Lancer immédiatement
    setTimeout(forceAllVideosAutoplay, 1000);
    
    // Surveiller les nouvelles vidéos
    watchForNewVideos();
    
    // Retry après 5 secondes
    setTimeout(forceAllVideosAutoplay, 5000);
});

// Écouter les interactions pour débloquer
document.addEventListener('click', unlockAllVideos, { once: true });
document.addEventListener('touchstart', unlockAllVideos, { once: true });

console.log('🎥 Système d\'autoplay vidéos chargé');
console.log('💡 Utilisez: forceAllVideosAutoplay() pour forcer le lancement');
console.log('💡 Utilisez: unlockAllVideos() pour débloquer avec interaction');
