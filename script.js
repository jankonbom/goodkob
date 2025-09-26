
// DarkLabbb Shop - Interactivité moderne
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Variables globales
  let articles = [];
  let cart = [];
  
  // Variables pour la musique
  let backgroundMusic = null;
  let isMusicPlaying = false;
  let musicVolume = 0.5;

  // Fonction de nettoyage globale pour l'état du panier
  function cleanupCartState() {
    document.body.classList.remove('cart-open');
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
      cartModal.classList.remove('active');
      cartModal.style.transform = 'translateX(100%)';
      // S'assurer que l'effet est bien contenu
      cartModal.style.overflow = 'hidden';
      cartModal.style.isolation = 'isolate';
    }
    console.log('🧹 État du panier nettoyé');
  }

  // Fonction pour ouvrir le panel admin
  function openAdminPanel() {
    // Ouvrir le panel admin dans un nouvel onglet
    window.open('admin-complete.html', '_blank');
  }

  // Fonction pour gérer les événements tactiles (compatible Telegram Android)
  function setupAdminTrigger() {
    const adminTrigger = document.querySelector('.admin-trigger-hidden');
    if (adminTrigger) {
      // Événements tactiles pour Android/Telegram
      adminTrigger.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.style.backgroundColor = 'rgba(88, 166, 255, 0.1)';
      });
      
      adminTrigger.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.style.backgroundColor = 'transparent';
        openAdminPanel();
      });
      
      // Événement de clic pour les navigateurs de bureau
      adminTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        openAdminPanel();
      });
      
      // Empêcher la sélection de texte
      adminTrigger.addEventListener('selectstart', function(e) {
        e.preventDefault();
      });
    }
  }

  // Rendre la fonction globale
  window.openAdminPanel = openAdminPanel;
  
  // Fonction de test pour la musique (accessible depuis la console)
  window.testMusic = function() {
    console.log('🧪 Test de la musique...');
    console.log('backgroundMusic:', backgroundMusic);
    console.log('isMusicPlaying:', isMusicPlaying);
    console.log('musicVolume:', musicVolume);
    
    if (backgroundMusic) {
      console.log('État de la musique:', {
        paused: backgroundMusic.paused,
        volume: backgroundMusic.volume,
        currentTime: backgroundMusic.currentTime,
        duration: backgroundMusic.duration
      });
    }
    
    // Tester le toggle
    toggleMusic();
  };
  
  // Fonction pour forcer le toggle (utile pour les tests)
  window.forceToggleMusic = function() {
    console.log('🔄 Force toggle musique...');
    toggleMusic();
  };
  
  // Fonction pour forcer la pause
  window.forcePauseMusic = function() {
    console.log('🔄 Force pause musique...');
    if (backgroundMusic) {
      backgroundMusic.pause();
      isMusicPlaying = false;
      updateMusicButton();
      console.log('🔇 Musique forcée en pause');
    }
  };
  
  // Fonction pour forcer la lecture
  window.forcePlayMusic = function() {
    console.log('🔄 Force play musique...');
    if (backgroundMusic) {
      const playPromise = backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isMusicPlaying = true;
          updateMusicButton();
          console.log('🔊 Musique forcée en lecture');
        }).catch(error => {
          console.error('❌ Erreur force play:', error);
        });
      }
    }
  };

  // Fonctions de contrôle de la musique
  function initMusicControls() {
    console.log('🎵 Initialisation des contrôles de musique...');
    
    backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const volumeControl = document.getElementById('volumeControl');

    console.log('Éléments trouvés:', {
      backgroundMusic: !!backgroundMusic,
      musicToggle: !!musicToggle,
      volumeSlider: !!volumeSlider,
      volumeValue: !!volumeValue,
      volumeControl: !!volumeControl
    });

    if (!backgroundMusic || !musicToggle || !volumeSlider || !volumeValue) {
      console.warn('❌ Éléments de contrôle de musique non trouvés');
      return;
    }

    // Configuration initiale
    backgroundMusic.volume = musicVolume;
    volumeSlider.value = musicVolume * 100;
    volumeValue.textContent = Math.round(musicVolume * 100) + '%';

    // Démarrer la musique automatiquement
    startMusic();

    // Gestion du bouton play/pause - Version mobile-first
    let lastTouchTime = 0;
    let touchCount = 0;
    
    // Fonction de toggle avec protection contre les doubles clics
    function safeToggleMusic() {
      const now = Date.now();
      if (now - lastTouchTime < 300) { // Protection contre les doubles clics
        console.log('🎵 Double clic ignoré');
        return;
      }
      lastTouchTime = now;
      touchCount++;
      console.log('🎵 Safe toggle appelé #' + touchCount);
      toggleMusic();
    }
    
    // Événement unique pour tous les types d'interaction
    musicToggle.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🎵 Touch end - toggle direct');
      safeToggleMusic();
    });
    
    musicToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🎵 Click - toggle direct');
      safeToggleMusic();
    });
    
    // Événement mousedown pour desktop
    musicToggle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      console.log('🎵 Mouse down - toggle direct');
      safeToggleMusic();
    });

    // Gestion du slider de volume
    volumeSlider.addEventListener('input', updateVolume);
    volumeSlider.addEventListener('touchend', (e) => {
      e.preventDefault();
    });

    // Afficher/masquer le contrôle de volume au survol
    musicToggle.addEventListener('mouseenter', () => {
      volumeControl.classList.add('show');
    });

    musicToggle.addEventListener('mouseleave', () => {
      volumeControl.classList.remove('show');
    });

    // Gestion du touch long pour afficher le volume
    let longTouchTimer = null;
    
    musicToggle.addEventListener('touchstart', (e) => {
      // Timer pour touch long (afficher le volume)
      longTouchTimer = setTimeout(() => {
        console.log('🎵 Touch long détecté - affichage volume');
        volumeControl.classList.toggle('show');
      }, 800); // Augmenté à 800ms pour éviter les conflits
    }, { passive: true });

    musicToggle.addEventListener('touchend', (e) => {
      // Annuler le timer de touch long
      if (longTouchTimer) {
        clearTimeout(longTouchTimer);
        longTouchTimer = null;
      }
    }, { passive: true });
  }

  function startMusic() {
    if (!backgroundMusic) return;

    // Les navigateurs modernes nécessitent une interaction utilisateur
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isMusicPlaying = true;
        updateMusicButton();
        console.log('🎵 Musique démarrée');
      }).catch(error => {
        console.log('Musique en attente d\'interaction utilisateur:', error.message);
        // La musique se lancera au premier clic
      });
    }
  }

  function toggleMusic() {
    console.log('🎵 Toggle musique appelé, isMusicPlaying:', isMusicPlaying);
    
    if (!backgroundMusic) {
      console.error('❌ backgroundMusic non trouvé');
      return;
    }

    // Vérifier l'état réel de la musique
    const actuallyPaused = backgroundMusic.paused;
    console.log('🎵 État réel de la musique - paused:', actuallyPaused, 'isMusicPlaying:', isMusicPlaying);

    if (actuallyPaused || !isMusicPlaying) {
      // La musique est arrêtée, on la lance
      console.log('🎵 Lancement de la musique...');
      const playPromise = backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isMusicPlaying = true;
          console.log('✅ Musique lancée avec succès');
          updateMusicButton();
        }).catch(error => {
          console.error('❌ Erreur lors du lancement:', error);
        });
      }
    } else {
      // La musique est en cours, on l'arrête
      console.log('🎵 Arrêt de la musique...');
      backgroundMusic.pause();
      isMusicPlaying = false;
      console.log('✅ Musique arrêtée avec succès');
      updateMusicButton();
    }
  }

  function updateVolume() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    
    if (!volumeSlider || !volumeValue || !backgroundMusic) return;

    musicVolume = volumeSlider.value / 100;
    backgroundMusic.volume = musicVolume;
    volumeValue.textContent = Math.round(musicVolume * 100) + '%';
    
    console.log(`🔊 Volume: ${Math.round(musicVolume * 100)}%`);
  }

  function updateMusicButton() {
    const musicToggle = document.getElementById('musicToggle');
    if (!musicToggle) return;

    const icon = musicToggle.querySelector('.icon');
    if (!icon) return;

    if (isMusicPlaying) {
      icon.textContent = '🔊';
      musicToggle.classList.remove('muted');
      musicToggle.classList.add('playing');
    } else {
      icon.textContent = '🔇';
      musicToggle.classList.add('muted');
      musicToggle.classList.remove('playing');
    }
  }

  // Précharger l'image de fond pour la section contact
  function preloadContactBackground() {
    const img = new Image();
    img.src = 'https://i.imgur.com/2T05Hat.jpeg';
    img.onload = function() {
      console.log('✅ Image de fond contact préchargée');
    };
  }

  // Précharger l'image au chargement de la page
  preloadContactBackground();


  // Navigation en bas - gestion des états actifs
  $$('.nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      $$('.nav-item').forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
      
      const navText = item.querySelector('.nav-text').textContent;
      console.log('Navigation vers:', navText);
      
      // Logique de navigation
      if (navText === 'Menu') {
        showProductsPage();
      } else if (navText === 'Infos') {
        showInfoPage();
      } else if (navText === 'Contact') {
        showContactPage();
      }
    });
  });
  
  // Fonction pour afficher la page des produits
  function showProductsPage() {
    const productsSection = document.getElementById('productsSection');
    const infoSection = document.getElementById('infoSection');
    const contactSection = document.getElementById('contactSection');
    const filtersSection = document.getElementById('filtersSection');
    
    if (productsSection) productsSection.style.display = 'block';
    if (infoSection) infoSection.style.display = 'none';
    if (contactSection) contactSection.style.display = 'none';
    if (filtersSection) filtersSection.style.display = 'flex';
  }
  
  // Fonction pour afficher la page d'informations
  function showInfoPage() {
    const productsSection = document.getElementById('productsSection');
    const infoSection = document.getElementById('infoSection');
    const contactSection = document.getElementById('contactSection');
    const filtersSection = document.getElementById('filtersSection');
    
    if (productsSection) productsSection.style.display = 'none';
    if (infoSection) infoSection.style.display = 'block';
    if (contactSection) contactSection.style.display = 'none';
    if (filtersSection) filtersSection.style.display = 'none';
    
    // Recharger les informations depuis Supabase
    if (typeof loadInfoFromSupabase === 'function') {
      loadInfoFromSupabase();
    }
  }
  
  // Fonction pour afficher la page de contact
  function showContactPage() {
    const productsSection = document.getElementById('productsSection');
    const infoSection = document.getElementById('infoSection');
    const contactSection = document.getElementById('contactSection');
    const filtersSection = document.getElementById('filtersSection');
    
    if (productsSection) productsSection.style.display = 'none';
    if (infoSection) infoSection.style.display = 'none';
    if (contactSection) {
      contactSection.style.display = 'block';
      // Forcer le chargement de l'image de fond
      contactSection.style.backgroundImage = 'url("https://i.imgur.com/2T05Hat.jpeg")';
      contactSection.style.backgroundSize = 'cover';
      contactSection.style.backgroundPosition = 'center';
      contactSection.style.backgroundAttachment = 'fixed';
      contactSection.style.backgroundRepeat = 'no-repeat';
    }
    if (filtersSection) filtersSection.style.display = 'none';
  }

  // Barres de filtres - interactions
  $$('.filter-bar').forEach((bar) => {
    bar.addEventListener('click', () => {
      const category = bar.getAttribute('data-category');
      
      // Animation de clic
      bar.style.transform = 'scale(0.98)';
      setTimeout(() => {
        bar.style.transform = '';
      }, 150);
      
      // Logique de filtrage
      filterProducts(category);
    });
  });
  
  // Fonction de filtrage des produits
  function filterProducts(category) {
    const allProducts = $$('.product-card');
    console.log(`🔍 Filtrage par catégorie: ${category}, ${allProducts.length} produits trouvés`);
    
    allProducts.forEach(product => {
      if (category === 'bedave') {
        if (product.classList.contains('bedave-category')) {
          product.style.display = 'block';
          product.style.opacity = '1';
          product.style.transform = 'translateY(0)';
        } else {
          product.style.display = 'none';
        }
      } else if (category === 'tabac') {
        if (product.classList.contains('tabac-category')) {
          product.style.display = 'block';
          product.style.opacity = '1';
          product.style.transform = 'translateY(0)';
        } else {
          product.style.display = 'none';
        }
      } else if (category === 'puffs') {
        if (product.classList.contains('puffs-category')) {
          product.style.display = 'block';
          product.style.opacity = '1';
          product.style.transform = 'translateY(0)';
        } else {
          product.style.display = 'none';
        }
      } else if (category === 'stup') {
        const hasStupClass = product.classList.contains('stup-category');
        console.log(`Produit: ${product.querySelector('.product-title')?.textContent || 'Sans titre'}, Classes: ${product.className}, Contient stup-category: ${hasStupClass}`);
        if (hasStupClass) {
          product.style.display = 'block';
          product.style.opacity = '1';
          product.style.transform = 'translateY(0)';
        } else {
          product.style.display = 'none';
        }
      } else {
        // Afficher tous les produits
        product.style.display = 'block';
        product.style.opacity = '1';
        product.style.transform = 'translateY(0)';
      }
    });
    
    // Mettre à jour l'état actif des filtres
    updateFilterStates(category);
  }
  
  // Fonction pour mettre à jour l'état actif des filtres
  function updateFilterStates(activeCategory) {
    const filterBars = $$('.filter-bar');
    
    filterBars.forEach(bar => {
      const category = bar.getAttribute('data-category');
      if (category === activeCategory) {
        bar.classList.add('active');
      } else {
        bar.classList.remove('active');
      }
    });
  }

  // Fonction pour charger les articles depuis Supabase
  async function loadArticles() {
    try {
      console.log('🔄 Chargement des articles depuis Supabase...');
      
      // Vérifier que les variables Supabase sont définies
      if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
        console.error('❌ Variables Supabase non définies');
        return;
      }
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📄 Données reçues:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Les données reçues ne sont pas un tableau d\'articles');
      }

      // Filtrer les articles actifs côté client
      articles = data.filter(article => {
        return article.status === 'active' || !article.status;
      });
      
      console.log(`✅ ${articles.length} articles chargés depuis Supabase (tous statuts: ${data.length})`);
      
      if (articles.length === 0) {
        console.warn('⚠️ Aucun article trouvé avec le statut "active"');
        
        // Vérifier s'il y a des articles avec d'autres statuts
        const inactiveArticles = data.filter(article => article.status && article.status !== 'active');
        if (inactiveArticles.length > 0) {
          console.log('⚠️ Articles trouvés mais avec d\'autres statuts:', inactiveArticles.map(a => a.name + ' (' + a.status + ')'));
        }
        
        showErrorMessage('Aucun article disponible pour le moment. Veuillez vérifier les articles en cours.');
        return;
      }
      
      // Remplacer le contenu statique par les articles dynamiques
      displayArticles();
      
      // Appliquer le filtre STUP après l'affichage des articles
      setTimeout(() => {
        filterProducts('stup');
        updateFilterStates('stup');
      }, 200);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des articles:', error);
      // En cas d'erreur, afficher un message et essayer de charger les articles statiques
      showErrorMessage(`Erreur de chargement des articles: ${error.message}`);
      loadStaticArticles();
    }
  }

  // Fonction pour afficher un message d'erreur
  function showErrorMessage(message) {
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #ff6b6b;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
          <h3 style="color: #ff6b6b; margin-bottom: 1rem;">${message}</h3>
          <button onclick="location.reload()" style="
            background: linear-gradient(135deg, #58a6ff, #79c0ff);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
          ">🔄 Réessayer</button>
        </div>
      `;
    }
  }

  // Fonction pour charger les articles statiques en cas d'erreur
  function loadStaticArticles() {
    console.log('🔄 Chargement des articles statiques...');
    // Articles statiques de fallback
    articles = [
      {
        id: 1,
        name: "Article de démonstration",
        description: "Article de test en cas d'erreur de connexion",
        category: "stup",
        price: 10.00,
        stock: 1,
        image_url: "https://via.placeholder.com/300x200/2a2a2a/ffffff?text=Article+Demo"
      }
    ];
    displayArticles();
    
    // Appliquer le filtre STUP après l'affichage des articles statiques
    setTimeout(() => {
      filterProducts('stup');
      updateFilterStates('stup');
    }, 200);
  }

  // Fonction pour afficher les articles dynamiquement
  function displayArticles() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    // Vider la grille existante
    productsGrid.innerHTML = '';

    // Créer les cartes d'articles dynamiquement
    articles.forEach(article => {
      const isVideo = article.image_url && (
        article.image_url.startsWith('blob:') ||
        article.image_url.startsWith('data:video/') ||
        (article.image_url.includes('github.com') && article.image_url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)) ||
        (!article.image_url.startsWith('data:image/') && article.image_url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i))
      );

      // Debug pour les vidéos GitHub
      if (article.image_url && article.image_url.includes('github.com')) {
        console.log(`🔍 Debug vidéo pour ${article.name}:`);
        console.log(`   URL: ${article.image_url}`);
        console.log(`   Contient github.com: ${article.image_url.includes('github.com')}`);
        console.log(`   Extension vidéo: ${article.image_url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i) ? 'Oui' : 'Non'}`);
        console.log(`   Détectée comme vidéo: ${isVideo ? '✅ OUI' : '❌ NON'}`);
      }

      const categoryClass = article.category === 'bedave' ? 'bedave-category' : 
                           article.category === 'tabac' ? 'tabac-category' : 
                           article.category === 'puffs' ? 'puffs-category' : 
                           article.category === 'stup' ? 'stup-category' : '';

      const stockStatus = article.stock > 0 ? 'in-stock' : 'out-of-stock';
      const stockText = article.stock > 0 ? 'En stock' : 'Rupture de stock';

      const articleCard = document.createElement('div');
      articleCard.className = `product-card ${categoryClass}`;
      articleCard.setAttribute('data-article-id', article.id);
      
      articleCard.innerHTML = `
        <div class="product-image">
          ${isVideo ? `
            <video class="product-video" autoplay muted loop playsinline webkit-playsinline preload="auto" controls="false" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; pointer-events: none; outline: none; border: none;">
              <source src="${article.image_url}" type="video/mp4">
              Votre navigateur ne supporte pas la vidéo.
            </video>
          ` : `
            <img src="${article.image_url}" alt="${article.name}" class="product-img" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">
          `}
          <div class="product-status ${stockStatus}">${stockText}</div>
        </div>
        <div class="product-info">
          <h3 class="product-title">${article.name}</h3>
          <p class="product-subtitle">${article.description || ''}</p>
        </div>
      `;

      // Ajouter l'événement de clic
      articleCard.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Clic sur article:', article.name);
        openProductModal(article);
      });
      
      // Solution de secours : événement de clic direct
      articleCard.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Clic direct sur article:', article.name);
        openProductModal(article);
      };

      // Configuration simple des vidéos
      if (isVideo) {
        setTimeout(() => {
          const video = articleCard.querySelector('.product-video');
          if (video) {
            console.log('Configuration vidéo pour:', article.name);
            
            // Configuration optimisée pour autoplay
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
            
            // Essayer de lancer immédiatement
            video.play().then(() => {
              console.log(`✅ Vidéo lancée: ${article.name}`);
            }).catch(e => {
              console.log(`⚠️ Autoplay bloqué pour: ${article.name}`, e.message);
              
              // Retry après un délai
              setTimeout(() => {
                video.play().then(() => {
                  console.log(`✅ Vidéo lancée en retry: ${article.name}`);
                }).catch(e2 => {
                  console.log(`❌ Vidéo définitivement bloquée: ${article.name}`);
                });
              }, 1000);
            });
          }
        }, 100);
      }

      productsGrid.appendChild(articleCard);
    });

    // Réattacher les événements aux nouvelles cartes
    attachProductCardEvents();
    
    // Normaliser l'affichage des images
    normalizeProductImages();
    
    // Forcer la lecture des vidéos
    setTimeout(forcePlayAllVideos, 1000);
    
    // Plus de boutons de déblocage
  }

  // Fonction simplifiée pour lancer les vidéos
  function forcePlayAllVideos() {
    console.log('🎥 Lancement de toutes les vidéos...');
    const videos = document.querySelectorAll('video');
    console.log(`📹 ${videos.length} vidéos trouvées`);
    
    videos.forEach((video, index) => {
      console.log(`🎬 Configuration vidéo ${index + 1}`);
      
      // Configuration optimisée pour autoplay
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
      
      // Essayer de lancer immédiatement
      video.play().then(() => {
        console.log(`✅ Vidéo ${index + 1} lancée avec succès`);
      }).catch(e => {
        console.log(`⚠️ Vidéo ${index + 1} bloquée:`, e.message);
        
        // Essayer de nouveau après un délai
        setTimeout(() => {
          video.play().then(() => {
            console.log(`✅ Vidéo ${index + 1} lancée en retry`);
          }).catch(e2 => {
            console.log(`❌ Vidéo ${index + 1} définitivement bloquée:`, e2.message);
          });
        }, 500);
      });
    });
    
    // Essayer de nouveau toutes les vidéos après 2 secondes
    setTimeout(() => {
      console.log('🔄 Retry de toutes les vidéos...');
      videos.forEach((video, index) => {
        if (video.paused) {
          video.play().then(() => {
            console.log(`✅ Vidéo ${index + 1} lancée en retry final`);
          }).catch(e => {
            console.log(`❌ Vidéo ${index + 1} toujours bloquée`);
          });
        }
      });
    }, 2000);
  }

  // Fonction simplifiée pour débloquer l'autoplay
  function tryUnlockAutoplay(video) {
    console.log('Tentative de déblocage vidéo');
    
    // Essayer de lancer après interaction
    const tryPlay = () => {
      video.play().catch(e => console.log('Toujours bloqué:', e.message));
    };
    
    // Écouter les interactions
    document.addEventListener('click', tryPlay, { once: true });
    document.addEventListener('touchstart', tryPlay, { once: true });
    
    // Essayer après un délai
    setTimeout(tryPlay, 1000);
  }

  // Fonction pour initialiser les événements du modal
  function initializeModalEvents() {
    const modal = document.getElementById('orderModal');
    const modalClose = document.getElementById('modalClose');
    
    if (!modal) {
      console.error('Modal non trouvé pour initialisation');
      return;
    }
    
    // Bouton de fermeture
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        console.log('Fermeture du modal');
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
    }
    
    // Fermer en cliquant sur le fond
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        console.log('Fermeture du modal par clic sur fond');
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        console.log('Fermeture du modal avec Escape');
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
    
    console.log('Événements du modal initialisés');
  }

  // Fonction de test supprimée pour éviter les conflits

  // Fonction supprimée - plus de boutons de déblocage

  // Fonction spécifique pour GitHub Pages - Simplifiée
  function setupGitHubPagesVideoFix() {
    // Détecter si on est sur GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (isGitHubPages) {
      console.log('GitHub Pages détecté - Mode optimisé activé');
    }
  }

  // Fonction pour initialiser la page de chargement
  function initializeLoadingPage() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const progressFill = document.getElementById('progressFill');
    const loadingText = document.getElementById('loadingText');
    const loadingClose = document.getElementById('loadingClose');
    
    if (!loadingOverlay) {
      console.log('Page de chargement non trouvée');
      return;
    }
    
    // Mode ultra-rapide pour mobile et Netlify
    const isNetlify = window.location.hostname.includes('netlify.app');
    const isMobile = window.innerWidth < 768;
    const fastMode = isNetlify || isMobile; // Mobile ou Netlify
    
    // Option pour désactiver complètement la page de chargement sur mobile très lent
    if (isMobile && window.innerWidth < 480) {
      console.log('Mobile très petit détecté - Page de chargement désactivée');
      loadingOverlay.style.display = 'none';
      return;
    }
    
    // S'assurer que la page de chargement est visible
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.zIndex = '10000';
    
    console.log('Page de chargement initialisée - Mode ultra-rapide:', fastMode);
    
    let progress = 0;
    const totalSteps = fastMode ? 20 : 50; // Beaucoup moins d'étapes en mode rapide
    const stepDuration = fastMode ? 5 : 15; // Ultra-rapide en mode rapide
    
    // Messages de chargement simplifiés
    const loadingMessages = fastMode ? [
      'Chargement...',
      'Prêt !'
    ] : [
      'Chargement...',
      'Préparation des vidéos...',
      'Optimisation mobile...',
      'Chargement des produits...',
      'Prêt !'
    ];
    
    let messageIndex = 0;
    
    // Fonction pour mettre à jour la progression
    function updateProgress() {
      progress += 1;
      progressFill.style.width = progress + '%';
      
      // Mettre à jour le message
      const messageInterval = fastMode ? 10 : 20;
      if (progress % messageInterval === 0 && messageIndex < loadingMessages.length - 1) {
        messageIndex++;
        loadingText.textContent = loadingMessages[messageIndex];
      }
      
      if (progress < totalSteps) {
        setTimeout(updateProgress, stepDuration);
      } else {
        // Chargement terminé
        loadingText.textContent = loadingMessages[loadingMessages.length - 1];
        
        // Précharger toutes les vidéos (simplifié pour mobile)
        if (fastMode) {
          // Mode ultra-rapide : fermer immédiatement
          setTimeout(() => {
            hideLoadingPage();
          }, 100);
        } else {
          preloadAllVideos().then(() => {
            setTimeout(() => {
              hideLoadingPage();
            }, 200);
          });
        }
      }
    }
    
  // Fonction simplifiée pour précharger les vidéos
  function preloadAllVideos() {
    console.log('Préchargement des vidéos...');
    const videos = document.querySelectorAll('video');
    console.log('Vidéos à précharger:', videos.length);
    
    videos.forEach((video, index) => {
      console.log(`Préchargement vidéo ${index + 1}`);
      video.controls = false;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.style.pointerEvents = 'none';
      
      // Essayer de lancer
      video.play().catch(e => {
        console.log(`Vidéo ${index + 1} préchargement bloqué:`, e.message);
      });
    });
    
    return Promise.resolve();
  }
    
    // Fonction pour masquer la page de chargement
    function hideLoadingPage() {
      loadingOverlay.classList.add('fade-out');
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
        // Lancer les vidéos après fermeture
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
          video.play().catch(() => {});
        });
      }, 500);
    }
    
    // Bouton de fermeture
    if (loadingClose) {
      loadingClose.addEventListener('click', hideLoadingPage);
    }
    
    // Démarrer le chargement ultra-rapidement
    const startDelay = fastMode ? 50 : 100;
    setTimeout(updateProgress, startDelay);
  }

  // Fonction pour normaliser l'affichage des images de produits
  function normalizeProductImages() {
    const images = document.querySelectorAll('.product-img');
    images.forEach(img => {
      // Forcer le style pour toutes les images
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '0px'; // Pas de border-radius pour les images de produits
      img.style.display = 'block';
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100%';
      
      // Gérer les erreurs d'image
      img.onerror = function() {
        this.style.display = 'none';
        // Créer un fallback si l'image ne charge pas
        const fallback = document.createElement('div');
        fallback.style.cssText = `
          width: 100%;
          height: 100%;
          background: #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 48px;
          border-radius: 0px;
        `;
        fallback.innerHTML = '📦';
        this.parentNode.insertBefore(fallback, this.nextSibling);
      };
    });
  }

  // Observer pour détecter les nouvelles images ajoutées
  function setupImageObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.classList && node.classList.contains('product-img')) {
                // Normaliser la nouvelle image
                setTimeout(() => normalizeProductImages(), 100);
              } else if (node.querySelector && node.querySelector('.product-img')) {
                // Normaliser les images dans le nouveau nœud
                setTimeout(() => normalizeProductImages(), 100);
              }
            }
          });
        }
      });
    });

    // Observer les changements dans la grille de produits
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
      observer.observe(productsGrid, {
        childList: true,
        subtree: true
      });
    }
  }

  // Fonction pour ouvrir le modal d'un produit
  function openProductModal(article) {
    console.log('Ouverture du modal pour:', article.name);
    const modal = document.getElementById('orderModal');
    if (!modal) {
      console.error('Modal non trouvé!');
      return;
    }

    // Mettre à jour le contenu du modal
    updateModalContent(article);
    
    // Forcer l'ouverture du modal
    modal.style.display = 'flex';
    modal.classList.add('active');
    modal.style.zIndex = '10000';
    document.body.style.overflow = 'hidden';
    
    console.log('Modal ouvert avec classe active et display flex');
    
    // Vérifier que le modal est visible
    setTimeout(() => {
      const rect = modal.getBoundingClientRect();
      console.log('Modal visible:', rect.width > 0 && rect.height > 0);
      
      // Si le modal n'est pas visible, forcer l'affichage
      if (rect.width === 0 || rect.height === 0) {
        console.log('Modal non visible, forçage de l\'affichage...');
        modal.style.display = 'flex';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.zIndex = '10000';
        modal.style.background = 'rgba(0, 0, 0, 0.8)';
      }
    }, 100);
    
    // Forcer la lecture des vidéos dans le modal après ouverture
    setTimeout(() => {
      const modalVideos = modal.querySelectorAll('video');
      modalVideos.forEach(video => {
        // Supprimer les contrôles
        video.removeAttribute('controls');
        video.controls = false;
        video.style.pointerEvents = 'none';
        video.style.outline = 'none';
        video.style.border = 'none';
        
        // Forcer la lecture
        video.play().then(() => {
          console.log('Vidéo modal lancée après ouverture');
        }).catch(e => {
          console.log('Autoplay modal bloqué après ouverture:', e);
        });
      });
    }, 500);
  }

  // Fonction pour mettre à jour le contenu du modal avec les données de l'article
  function updateModalContent(article) {
    console.log('Mise à jour du contenu du modal pour:', article.name);
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description');
    const modalImageElement = document.querySelector('.modal-product-image');
    const pricingOptions = document.querySelector('.pricing-options');
    
    console.log('Éléments du modal trouvés:', {
      modalTitle: !!modalTitle,
      modalDescription: !!modalDescription,
      modalImageElement: !!modalImageElement,
      pricingOptions: !!pricingOptions
    });

    if (modalTitle) {
      modalTitle.innerHTML = article.name;
    }

    if (modalDescription) {
      modalDescription.innerHTML = article.description || '';
    }

    // Mettre à jour l'image/vidéo
    if (modalImageElement) {
      const isVideo = article.image_url && (
        article.image_url.startsWith('blob:') ||
        article.image_url.startsWith('data:video/') ||
        (article.image_url.includes('github.com') && article.image_url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)) ||
        (!article.image_url.startsWith('data:image/') && article.image_url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i))
      );
      
      console.log('🔍 Détection vidéo modal pour:', article.name);
      console.log('   URL:', article.image_url);
      console.log('   Détectée comme vidéo:', isVideo);
      
      // Debug spécifique pour GitHub
      if (article.image_url && article.image_url.includes('github.com')) {
        console.log('   🔍 Debug GitHub modal:');
        console.log('   - Contient github.com:', article.image_url.includes('github.com'));
        console.log('   - Extension vidéo:', article.image_url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i));
        console.log('   - URL complète:', article.image_url);
      }

      if (isVideo) {
        console.log('Création de vidéo dans le modal:', article.image_url);
        modalImageElement.innerHTML = `
          <video class="modal-video" muted loop playsinline webkit-playsinline preload="metadata" controls="true" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px 20px 0 0; outline: none; border: none;">
            <source src="${article.image_url}" type="video/mp4">
            Votre navigateur ne supporte pas la vidéo.
          </video>
        `;
        console.log('Vidéo créée dans le modal');
        
        // Configuration simple de la vidéo dans le modal
        setTimeout(() => {
          const modalVideo = modalImageElement.querySelector('.modal-video');
          if (modalVideo) {
            console.log('Configuration vidéo modal pour:', article.name);
            
            // Configuration de base
            modalVideo.controls = true;
            modalVideo.muted = true;
            modalVideo.loop = true;
            modalVideo.playsInline = true;
            modalVideo.style.width = '100%';
            modalVideo.style.height = '100%';
            modalVideo.style.objectFit = 'cover';
            modalVideo.style.borderRadius = '20px 20px 0 0';
            
            // Configuration spéciale mobile
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
              console.log('📱 Configuration mobile pour vidéo modal');
              modalVideo.setAttribute('playsinline', 'true');
              modalVideo.setAttribute('webkit-playsinline', 'true');
              modalVideo.setAttribute('preload', 'metadata');
              modalVideo.controls = true;
              modalVideo.muted = true;
              
              // Ne pas essayer de jouer automatiquement sur mobile
              console.log('📱 Mobile détecté - vidéo prête à être lue manuellement');
            } else {
              // Essayer de lancer sur desktop
              modalVideo.play().then(() => {
                console.log('Vidéo modal lancée');
              }).catch(e => {
                console.log('Vidéo modal bloquée:', e.message);
              });
            }
          } else {
            console.error('Vidéo modal non trouvée');
          }
        }, 200);
      } else {
        modalImageElement.innerHTML = `
          <img src="${article.image_url}" alt="${article.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px 20px 0 0;">
        `;
      }
    }

    // Mettre à jour les tarifs avec les variantes de prix
    if (pricingOptions && article.price_variants) {
      let pricingHTML = '';
      article.price_variants.forEach(variant => {
        pricingHTML += `
        <div class="pricing-item">
            <span class="quantity">${variant.quantity}</span>
            <span class="price">${variant.price.toFixed(2)}€</span>
            <button class="add-btn" data-quantity="${variant.quantity}" data-price="${variant.price}">Ajouter</button>
        </div>
      `;
      });
    pricingOptions.innerHTML = pricingHTML;
    
      // Réattacher les événements aux boutons
    attachAddButtonEvents();
    }
  }

  // Fonction pour réattacher les événements aux cartes de produits
  function attachProductCardEvents() {
    $$('.product-card').forEach((card) => {
      card.addEventListener('click', () => {
        const articleId = card.getAttribute('data-article-id');
        const article = articles.find(a => a.id == articleId);
        
        if (article) {
          openProductModal(article);
        }
      });
    });
  }

  // Fonction de debug pour tester Supabase
  window.debugSupabase = async function() {
    console.log('🔍 Test de connexion Supabase...');
    console.log('SUPABASE_URL:', typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : 'Non définie');
    console.log('SUPABASE_ANON_KEY:', typeof SUPABASE_ANON_KEY !== 'undefined' ? (SUPABASE_ANON_KEY.substring(0, 20) + '...') : 'Non définie');
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Status de réponse:', response.status);
      console.log('Headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        console.error('❌ Erreur de connexion:', response.statusText);
        return;
      }

      const data = await response.json();
      console.log('📄 Tous les articles de la DB:', data);
      console.log('Nombre total d\'articles:', data.length);
      
      data.forEach((article, index) => {
        console.log(`Article ${index + 1}:`, {
          id: article.id,
          name: article.name,
          status: article.status,
          category: article.category
        });
      });
      
    } catch (error) {
      console.error('❌ Erreur de test Supabase:', error);
    }
  };

  // Fonction pour forcer le rechargement des articles
  window.reloadArticles = async function() {
    console.log('🔄 Rechargement forcé des articles...');
    await loadArticles();
  };

  // Initialisation - afficher les produits STUP par défaut
  document.addEventListener('DOMContentLoaded', async () => {
    // Nettoyer l'état du panier au chargement
    cleanupCartState();
    
    // Initialiser les contrôles de musique
    initMusicControls();
    
    // Attendre un peu pour s'assurer que les variables Supabase sont chargées
    setTimeout(async () => {
      // Vérifier que les variables Supabase sont disponibles
      if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON_KEY !== 'undefined') {
        console.log('✅ Variables Supabase détectées, chargement des articles...');
        await loadArticles();
      } else {
        console.warn('⚠️ Variables Supabase non disponibles, chargement des articles statiques...');
        loadStaticArticles();
      }
    }, 100);
    
    // Initialiser l'état de la page
    showProductsPage();
    
    // Le filtre STUP sera appliqué après le chargement des articles
    
    // S'assurer que le bouton Menu est actif
    const menuNavItem = document.querySelector('.nav-item:first-child');
    if (menuNavItem) {
      menuNavItem.classList.add('active');
    }
    
    // Forcer la normalisation des images après un délai
    setTimeout(() => {
      normalizeProductImages();
    }, 500);
    
    // Configurer l'observer pour les nouvelles images
    setupImageObserver();
  });

  // Nettoyer l'état du panier avant le déchargement de la page
  window.addEventListener('beforeunload', cleanupCartState);
  
  // Nettoyer l'état du panier si l'utilisateur navigue
  window.addEventListener('pagehide', cleanupCartState);
  
  // Nettoyer l'état du panier au focus de la page (au cas où)
  window.addEventListener('focus', cleanupCartState);

  
  
  
  // Fonction pour réattacher les événements aux boutons "Ajouter"
  function attachAddButtonEvents() {
    $$('.add-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const quantity = btn.getAttribute('data-quantity');
        const price = parseFloat(btn.getAttribute('data-price'));
        
        // Ajouter au panier
        const cartItem = {
          id: 'product-' + Date.now(),
          name: document.querySelector('.modal-title').textContent,
          description: document.querySelector('.modal-description').textContent,
          quantity: quantity,
          price: price,
          total: price
        };
        
        // Vérifier si l'article existe déjà
        const existingItem = cart.find(item => item.name === cartItem.name && item.quantity === cartItem.quantity);
        
        if (existingItem) {
          existingItem.total += price;
        } else {
          cart.push(cartItem);
        }
        
        // Mettre à jour l'affichage du panier
        updateCartDisplay();
        
        // Animation du bouton
        btn.style.transform = 'scale(0.95)';
        btn.textContent = 'Ajouté !';
        btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
        
        setTimeout(() => {
          btn.style.transform = '';
          btn.textContent = 'Ajouter';
          btn.style.background = 'linear-gradient(135deg, #58a6ff, #79c0ff)';
        }, 2000);
        
        // Fermer le modal de commande et retourner au menu
        const orderModal = document.getElementById('orderModal');
        if (orderModal) {
          orderModal.classList.remove('active');
          document.body.style.overflow = ''; // Restaurer le scroll
        }
        
        // Ouvrir automatiquement le panier
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
          cartModal.style.position = 'fixed';
          cartModal.style.top = '0';
          cartModal.style.right = '0';
          cartModal.style.transform = 'translateX(100%)';
          cartModal.classList.add('active');
          
          // Forcer l'affichage après un court délai
          setTimeout(() => {
            cartModal.style.display = 'flex';
            cartModal.style.transform = 'translateX(0)';
          }, 10);
        }
      });
    });
  }

  // Boutons d'en-tête - interactions
  $$('.header-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const label = btn.getAttribute('aria-label');
      console.log('Action en-tête:', label);
      
      // Animation de clic
      btn.style.transform = 'scale(0.9)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
      
      // Ici vous pouvez ajouter la logique spécifique à chaque bouton
      // Exemple: window.Telegram?.WebApp?.sendData(JSON.stringify({ action: label }));
    });
  });

  // Bouton son - toggle
  const soundBtn = $('.sound-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = soundBtn.textContent === '🔇';
      soundBtn.textContent = isMuted ? '🔊' : '🔇';
      soundBtn.style.background = isMuted ? '#4aa8ff' : '#00ff88';
      
      console.log('Son:', isMuted ? 'activé' : 'désactivé');
      
      // Ici vous pouvez ajouter la logique de gestion du son
      // Exemple: window.Telegram?.WebApp?.sendData(JSON.stringify({ 
      //   action: 'toggle_sound', 
      //   muted: !isMuted 
      // }));
    });
  }


  // Animation d'entrée des cartes
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observer les cartes de produits
  $$('.product-card').forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });

  // Initialisation Telegram WebApp
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    // Configuration de l'interface
    tg.setHeaderColor('#1a1a1a');
    tg.setBackgroundColor('#0a0a0a');
    
    console.log('Telegram WebApp initialisé');
  }

  // Modal de commande - gestion
  const modal = document.getElementById('orderModal');
  const modalClose = document.getElementById('modalClose');
  
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Restaurer le scroll
    });
  }
  
  // Fermer le modal en cliquant sur l'arrière-plan
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Fermer avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  
  // Fonction pour mettre à jour l'affichage du panier
  function updateCartDisplay() {
    const cartBody = document.getElementById('cartBody');
    const cartBadge = document.getElementById('cartBadge');
    const totalPrice = document.getElementById('totalPrice');
    const deliverySection = document.getElementById('deliverySection');
    
    // Mettre à jour le badge
    const totalItems = cart.length;
    cartBadge.textContent = `${totalItems} article${totalItems > 1 ? 's' : ''}`;
    
    // Calculer le total des articles
    const itemsTotal = cart.reduce((sum, item) => sum + item.total, 0);
    
    // Mettre à jour le contenu du panier
    if (cart.length === 0) {
      cartBody.innerHTML = '<div class="cart-empty"><p>Votre panier est vide.</p></div>';
      if (deliverySection) deliverySection.style.display = 'none';
      totalPrice.textContent = `${itemsTotal.toFixed(2)}€`;
    } else {
      cartBody.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-description">${item.description || ''}</div>
            <div class="cart-item-details">${item.quantity} Pièces</div>
          </div>
          <div class="cart-item-price">${item.total.toFixed(2)}€</div>
        </div>
      `).join('');
      
      // Afficher la section de livraison
      if (deliverySection) deliverySection.style.display = 'block';
      
      // Calculer le total avec les frais de livraison
      updateTotalWithDelivery(itemsTotal);
    }
    
    // Mettre à jour l'indicateur du bouton panier
    updateCartButtonIndicator();
  }
  
  // Fonction pour mettre à jour le total avec les frais de livraison
  function updateTotalWithDelivery(itemsTotal) {
    const totalPrice = document.getElementById('totalPrice');
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
    
    let deliveryFee = 0;
    if (selectedDelivery) {
      deliveryFee = parseFloat(selectedDelivery.getAttribute('data-fee'));
    }
    
    const total = itemsTotal + deliveryFee;
    totalPrice.textContent = `${total.toFixed(2)}€`;
  }
  
  // Fonction pour mettre à jour l'indicateur du bouton panier
  function updateCartButtonIndicator() {
    const headerCartBtn = document.querySelector('.header-btn[aria-label="Panier"]');
    if (headerCartBtn) {
      const totalItems = cart.length;
      
      // Supprimer l'ancien indicateur s'il existe
      const existingBadge = headerCartBtn.querySelector('.cart-button-badge');
      if (existingBadge) {
        existingBadge.remove();
      }
      
      // Ajouter le nouvel indicateur si il y a des articles
      if (totalItems > 0) {
        const badge = document.createElement('div');
        badge.className = 'cart-button-badge';
        badge.textContent = totalItems;
        headerCartBtn.appendChild(badge);
      }
    }
  }
  
  // Gestion du panier
  const cartModal = document.getElementById('cartModal');
  const cartClose = document.getElementById('cartClose');
  const continueBtn = document.getElementById('continueBtn');
  const orderBtn = document.getElementById('orderBtn');

  // Variables pour les gestes tactiles
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  // Bouton panier dans l'en-tête - Essayer plusieurs sélecteurs
  let headerCartBtn = document.querySelector('.header-btn[aria-label="Panier"]');
  
  // Si le premier sélecteur ne fonctionne pas, essayer d'autres méthodes
  if (!headerCartBtn) {
    headerCartBtn = document.querySelector('.header-btn:first-child');
    console.log('Tentative avec le premier bouton header:', headerCartBtn);
  }
  
  // Si toujours pas trouvé, essayer par contenu
  if (!headerCartBtn) {
    const allHeaderBtns = document.querySelectorAll('.header-btn');
    allHeaderBtns.forEach((btn, index) => {
      if (btn.textContent.includes('🛒')) {
        headerCartBtn = btn;
        console.log('Bouton panier trouvé par contenu à l\'index:', index);
      }
    });
  }
  
  console.log('Bouton panier trouvé:', headerCartBtn);
  console.log('Modal panier trouvé:', cartModal);
  
  if (headerCartBtn) {
    // Support pour les événements tactiles
    const openCart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Clic sur le bouton panier détecté');
      
      if (cartModal) {
        console.log('Ouverture du panier...');
        // S'assurer que l'état est propre avant d'ouvrir
        cleanupCartState();
        
        cartModal.style.position = 'fixed';
        cartModal.style.top = '0';
        cartModal.style.right = '0';
        cartModal.style.transform = 'translateX(100%)';
        cartModal.classList.add('active');
        
        // Forcer l'affichage après un court délai
        setTimeout(() => {
          cartModal.style.display = 'flex';
          cartModal.style.transform = 'translateX(0)';
          // S'assurer que l'effet est contenu
          cartModal.style.overflow = 'hidden';
          cartModal.style.isolation = 'isolate';
          // Prévenir le scroll du body sur mobile
          document.body.classList.add('cart-open');
        }, 10);
      } else {
        console.error('Modal panier non trouvé');
      }
    };

    // Ajouter les événements pour mobile et desktop
    headerCartBtn.addEventListener('click', openCart);
    headerCartBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      openCart(e);
    });
  } else {
    console.error('Bouton panier non trouvé avec tous les sélecteurs');
  }
  
  if (cartClose) {
    const closeCart = () => {
      cartModal.classList.remove('active');
      cartModal.style.transform = 'translateX(100%)';
      // Restaurer le scroll du body
      document.body.classList.remove('cart-open');
    };

    // Support pour les événements tactiles
    cartClose.addEventListener('click', closeCart);
    cartClose.addEventListener('touchend', (e) => {
      e.preventDefault();
      closeCart();
    });
  }

  // Gestion des gestes de swipe pour fermer le panier
  if (cartModal) {
    cartModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    });

    cartModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    });

    function handleSwipe() {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // Vérifier si c'est un swipe horizontal vers la droite
      if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 50) {
        // Fermer le panier
        cartModal.classList.remove('active');
        cartModal.style.transform = 'translateX(100%)';
        document.body.classList.remove('cart-open');
      }
    }
  }
  
  if (continueBtn) {
    const continueShopping = () => {
      cartModal.classList.remove('active');
      cartModal.style.transform = 'translateX(100%)';
      // Restaurer le scroll du body
      document.body.classList.remove('cart-open');
    };

    // Support pour les événements tactiles
    continueBtn.addEventListener('click', continueShopping);
    continueBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      continueShopping();
    });
  }
  
  if (orderBtn) {
    orderBtn.addEventListener('click', () => {
      // Vérifier qu'une option de livraison est sélectionnée
      const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
      if (!selectedDelivery) {
        alert('Veuillez choisir une option de livraison avant de finaliser votre commande.');
        return;
      }
      
      const deliveryType = selectedDelivery.value;
      const deliveryFee = parseFloat(selectedDelivery.getAttribute('data-fee'));
      
      // Vérifier l'adresse si nécessaire
      if (deliveryType === 'livraison' || deliveryType === 'mondial-relay') {
        if (!validateAddress()) {
          return;
        }
      }
      
      // Fermer le panier
      cartModal.classList.remove('active');
      cartModal.style.transform = 'translateX(100%)';
      // Restaurer le scroll du body
      document.body.classList.remove('cart-open');
      
      // Ouvrir le panel de commande
      openOrderPanel(cart, deliveryType, deliveryFee);
    });
  }
  
  // Gestion des options de livraison
  const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
  const addressSection = document.getElementById('addressSection');
  
  deliveryOptions.forEach(option => {
    option.addEventListener('change', () => {
      // Recalculer le total quand une option de livraison change
      const itemsTotal = cart.reduce((sum, item) => sum + item.total, 0);
      updateTotalWithDelivery(itemsTotal);
      
      // Afficher/masquer le formulaire d'adresse
      if (option.value === 'livraison' || option.value === 'mondial-relay') {
        addressSection.style.display = 'block';
      } else {
        addressSection.style.display = 'none';
      }
    });
  });

  // Gestion des cartes de contact
  $$('.contact-card').forEach((card) => {
    card.addEventListener('click', () => {
      const contactType = card.querySelector('h3').textContent;
      console.log('Contact sélectionné:', contactType);
      
      // Animation de clic
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
      
      // Ici vous pouvez ajouter la logique pour ouvrir l'application de contact
      // Exemple: window.open('signal://...', '_blank');
      alert(`Ouverture de ${contactType} - Fonctionnalité à venir`);
    });
  });

  // Fonction pour valider l'adresse
  function validateAddress() {
    const requiredFields = ['addressStreet', 'addressCity', 'addressZip'];
    const missingFields = [];
    
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (!field.value.trim()) {
        missingFields.push(field.previousElementSibling.textContent.replace(' *', ''));
      }
    });
    
    if (missingFields.length > 0) {
      alert(`Veuillez remplir les champs obligatoires : ${missingFields.join(', ')}`);
      return false;
    }
    
    return true;
  }
  
  // Fonction pour obtenir l'adresse formatée
  function getFormattedAddress() {
    const street = document.getElementById('addressStreet').value;
    const city = document.getElementById('addressCity').value;
    const zip = document.getElementById('addressZip').value;
    const notes = document.getElementById('addressNotes').value;
    
    let address = `📍 ADRESSE DE LIVRAISON\n`;
    address += `${street}\n`;
    address += `${zip} ${city}`;
    
    if (notes.trim()) {
      address += `\n📝 Notes: ${notes}`;
    }
    
    return address;
  }
  
  // Fonction pour ouvrir le panel de commande
  function openOrderPanel(cartItems, deliveryType, deliveryFee) {
    // S'assurer que l'état du panier est propre
    cleanupCartState();
    
    const orderPanel = document.getElementById('orderPanel');
    const orderSummary = document.getElementById('orderSummary');
    const orderMessage = document.getElementById('orderMessage');
    
    // Calculer le total
    const itemsTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const total = itemsTotal + deliveryFee;
    
    // Générer le récapitulatif
    let summaryHTML = '';
    cartItems.forEach(item => {
      summaryHTML += `
        <div class="order-summary-item">
          <div class="item-info">
            <span class="item-name">${item.name} (${item.quantity})</span>
            ${item.description ? `<span class="item-description">${item.description}</span>` : ''}
          </div>
          <span class="item-price">${item.total.toFixed(2)}€</span>
        </div>
      `;
    });
    
    // Ajouter les frais de livraison
    if (deliveryFee > 0) {
      summaryHTML += `
        <div class="order-summary-item">
          <span class="item-name">Frais de livraison (${getDeliveryName(deliveryType)})</span>
          <span class="item-price">${deliveryFee.toFixed(2)}€</span>
        </div>
      `;
    }
    
    // Ajouter le total
    summaryHTML += `
      <div class="order-summary-item" style="border-top: 2px solid var(--accent-green); margin-top: 10px; padding-top: 15px;">
        <span class="item-name" style="font-weight: 700; font-size: 1.1rem;">TOTAL</span>
        <span class="item-price" style="font-size: 1.2rem;">${total.toFixed(2)}€</span>
      </div>
    `;
    
    orderSummary.innerHTML = summaryHTML;
    
    // Générer le message à copier avec le template personnalisé
    let message;
    if (orderMessageManager) {
      message = orderMessageManager.generateOrderMessage(cartItems, deliveryType, deliveryFee);
      // Appliquer les styles si nécessaire
      orderMessageManager.applyStyles(orderMessage);
    } else {
      // Fallback vers l'ancien système
      message = `🛒 COMMANDE\n\n`;
      cartItems.forEach(item => {
        message += `• ${item.name} (${item.quantity}) - ${item.total.toFixed(2)}€\n`;
        if (item.description) {
          message += `  ${item.description}\n`;
        }
      });
      if (deliveryFee > 0) {
        message += `• Frais de livraison (${getDeliveryName(deliveryType)}) - ${deliveryFee.toFixed(2)}€\n`;
      }
      message += `\n💰 TOTAL: ${total.toFixed(2)}€\n\n`;
      
      if (deliveryType === 'livraison' || deliveryType === 'mondial-relay') {
        message += `${getFormattedAddress()}\n\n`;
      }
      
      message += `📱 Envoyé depuis l'app CALI FAST DRIVE`;
    }
    
    orderMessage.value = message;
    
    // Afficher le panel
    orderPanel.classList.add('active');
  }
  
  // Fonction pour obtenir le nom de la livraison
  function getDeliveryName(deliveryType) {
    switch(deliveryType) {
      case 'livraison': return 'Livraison';
      case 'meetup': return 'Meet up';
      case 'mondial-relay': return 'Mondial Relay';
      default: return deliveryType;
    }
  }
  
  // Gestion du panel de commande
  const orderPanel = document.getElementById('orderPanel');
  const orderPanelClose = document.getElementById('orderPanelClose');
  const copyBtn = document.getElementById('copyBtn');
  const snapchatBtn = document.getElementById('snapchatBtn');
  
  // Fermer le panel
  if (orderPanelClose) {
    orderPanelClose.addEventListener('click', () => {
      orderPanel.classList.remove('active');
      // S'assurer que l'état du panier est propre
      cleanupCartState();
    });
  }
  
  // Fermer le panel en cliquant à l'extérieur
  if (orderPanel) {
    orderPanel.addEventListener('click', (e) => {
      if (e.target === orderPanel) {
        orderPanel.classList.remove('active');
        // S'assurer que l'état du panier est propre
        cleanupCartState();
      }
    });
  }
  
  // Copier le message
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const orderMessage = document.getElementById('orderMessage');
      try {
        await navigator.clipboard.writeText(orderMessage.value);
        copyBtn.textContent = '✅ Copié !';
        setTimeout(() => {
          copyBtn.textContent = '📋 Copier le message';
        }, 2000);
      } catch (err) {
        // Fallback pour les navigateurs qui ne supportent pas l'API Clipboard
        orderMessage.select();
        document.execCommand('copy');
        copyBtn.textContent = '✅ Copié !';
        setTimeout(() => {
          copyBtn.textContent = '📋 Copier le message';
        }, 2000);
      }
    });
  }
  
  // Ouvrir Snapchat
  if (snapchatBtn) {
    snapchatBtn.addEventListener('click', () => {
      // Utiliser le premier lien Snapchat disponible
      window.open('https://www.snapchat.com/add/bsst6259?share_id=Yh4Picxsxrw&locale=fr-FR', '_blank');
    });
  }

  // Initialiser l'affichage du panier au chargement
  updateCartDisplay();
  
  // Initialiser le trigger admin caché
  setupAdminTrigger();
  
  // Initialiser les événements du modal
  initializeModalEvents();
  
  // Test des événements de clic supprimé
  
  // Forcer la lecture des vidéos dès le chargement
  setTimeout(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.controls = false;
      video.style.pointerEvents = 'none';
      video.play().catch(() => {});
    });
  }, 500);
  
  // Initialiser les corrections GitHub Pages
  setupGitHubPagesVideoFix();
  
  // Initialiser la page de chargement immédiatement (ultra-rapide)
  const isMobile = window.innerWidth < 768;
  const isNetlify = window.location.hostname.includes('netlify.app');
  
  if (isMobile || isNetlify) {
    // Mode ultra-rapide pour mobile/Netlify
    setTimeout(() => {
      initializeLoadingPage();
    }, 10);
  } else {
    setTimeout(() => {
      initializeLoadingPage();
    }, 50);
  }
  
  console.log('DarkLabbb Shop - Interface chargée avec succès');
  
  // Export des fonctions pour debug
  window.loadArticles = loadArticles;
  window.reloadArticles = loadArticles;
})();