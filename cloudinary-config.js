// Configuration Cloudinary pour DarkLabbb Shop
// Remplacez les valeurs par vos vraies clés Cloudinary

const CLOUDINARY_CONFIG = {
    cloud_name: 'dwxaflmum',
    api_key: '554445261152118',
    api_secret: 'Rj3ZlhErSmTXPnde-Q6pYbePh2A',
    upload_preset: 'ml_default' // Vous devrez créer ce preset dans Cloudinary
};

// Fonction pour uploader un fichier vers Cloudinary
async function uploadToCloudinary(file, fileName) {
    try {
        console.log('🔄 Upload vers Cloudinary:', fileName, 'Taille:', (file.size / 1024 / 1024).toFixed(2) + ' MB');
        
        // Vérifier la taille du fichier (limite Cloudinary gratuite: 100 Mo)
        const maxSize = 100 * 1024 * 1024; // 100 Mo en bytes
        if (file.size > maxSize) {
            throw new Error(`Fichier trop volumineux. Taille maximum: 100 Mo. Votre fichier: ${(file.size / 1024 / 1024).toFixed(2)} Mo`);
        }
        
        // Créer un FormData pour l'upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset);
        formData.append('public_id', fileName);
        formData.append('resource_type', 'auto'); // Détecte automatiquement image/vidéo
        
        // Upload vers Cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erreur Cloudinary: ${errorData.error.message}`);
        }

        const result = await response.json();
        console.log('✅ Fichier uploadé vers Cloudinary:', result.secure_url);
        
        return result.secure_url; // URL publique du fichier
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'upload vers Cloudinary:', error);
        throw error;
    }
}

// Fonction pour supprimer un fichier de Cloudinary
async function deleteFromCloudinary(publicId) {
    try {
        // Extraire le public_id de l'URL
        const urlParts = publicId.split('/');
        const fileName = urlParts[urlParts.length - 1].split('.')[0];
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/destroy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                public_id: fileName,
                api_key: CLOUDINARY_CONFIG.api_key,
                api_secret: CLOUDINARY_CONFIG.api_secret
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erreur suppression Cloudinary: ${errorData.error.message}`);
        }

        console.log('✅ Fichier supprimé de Cloudinary:', fileName);
        return true;
        
    } catch (error) {
        console.error('❌ Erreur lors de la suppression de Cloudinary:', error);
        throw error;
    }
}

// Export pour utilisation dans d'autres fichiers
window.uploadToCloudinary = uploadToCloudinary;
window.deleteFromCloudinary = deleteFromCloudinary;
window.CLOUDINARY_CONFIG = CLOUDINARY_CONFIG;
