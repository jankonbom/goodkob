// Gestionnaire des messages de commande pour la page principale
class OrderMessageManager {
    constructor() {
        this.template = null;
        this.settings = {
            defaultAppName: 'CALI FAST DRIVE',
            defaultCurrency: '€'
        };
        this.init();
    }

    // Initialisation
    async init() {
        await this.loadActiveTemplate();
        await this.loadSettings();
    }

    // Charger le template actif depuis Supabase
    async loadActiveTemplate() {
        try {
            const { data, error } = await supabaseClient
                .from('command_messages')
                .select('*')
                .eq('is_active', true)
                .single();

            if (error) {
                console.warn('Aucun template actif trouvé, utilisation du template par défaut');
                this.template = this.getDefaultTemplate();
                return;
            }

            this.template = data;
        } catch (error) {
            console.error('Erreur lors du chargement du template:', error);
            this.template = this.getDefaultTemplate();
        }
    }

    // Charger les paramètres
    async loadSettings() {
        try {
            // Vérifier d'abord si la colonne 'key' existe
            const { data, error } = await supabaseClient
                .from('informations')
                .select('*')
                .eq('key', 'command_message_settings')
                .single();

            if (error) {
                console.warn('Colonne "key" non trouvée dans la table informations, utilisation des paramètres par défaut');
                return;
            }

            if (data && data.value) {
                const settings = JSON.parse(data.value);
                this.settings = { ...this.settings, ...settings };
            }
        } catch (error) {
            console.warn('Erreur lors du chargement des paramètres, utilisation des paramètres par défaut:', error.message);
        }
    }

    // Template par défaut
    getDefaultTemplate() {
        return {
            message_template: '🛒 COMMANDE\n\n{product_list}\n💰 TOTAL: {total_price}€\n\n📱 Envoyé depuis l\'app {app_name}',
            text_color: '#ffffff',
            background_color: '#1a1a1a',
            font_family: 'Inter',
            font_size: 14,
            text_align: 'left',
            show_emoji: true,
            show_border: false,
            show_shadow: true,
            gradient_background: false
        };
    }

    // Générer le message de commande
    generateOrderMessage(cartItems, deliveryType, deliveryFee) {
        // Calculer le total
        const itemsTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
        const total = itemsTotal + deliveryFee;

        // Générer directement le message avec la liste des produits
        let message = `🛒 COMMANDE\n\n`;
        
        cartItems.forEach(item => {
            message += `• ${item.name} (${item.quantity}) - ${item.total.toFixed(2)}€\n`;
            if (item.description) {
                message += `  ${item.description}\n`;
            }
        });
        
        if (deliveryFee > 0) {
            message += `• Frais de livraison (${this.getDeliveryName(deliveryType)}) - ${deliveryFee.toFixed(2)}€\n`;
        }
        
        message += `\n💰 TOTAL: ${total.toFixed(2)}€\n\n`;
        
        // Ajouter les informations de livraison selon le type
        if (deliveryType === 'livraison') {
            message += `🚚 MODE DE LIVRAISON: Livraison à domicile\n`;
            const address = this.getFormattedAddress();
            if (address) {
                message += `${address}\n\n`;
            }
        } else if (deliveryType === 'mondial-relay') {
            message += `📦 MODE DE LIVRAISON: Mondial Relay\n`;
            const address = this.getFormattedAddress();
            if (address) {
                message += `${address}\n\n`;
            }
        } else if (deliveryType === 'meetup') {
            message += `🤝 MODE DE LIVRAISON: Meet up\n`;
            message += `📍 Rendez-vous à convenir\n\n`;
        }
        
        message += `📱 Envoyé depuis l'app ${this.settings.defaultAppName}`;

        return message;
    }

    // Formater la liste des produits pour le template
    formatProductListForTemplate(cartItems, deliveryType, deliveryFee) {
        let productList = '';
        cartItems.forEach(item => {
            productList += `• ${item.name} (${item.quantity}) - ${item.total.toFixed(2)}€\n`;
            if (item.description) {
                productList += `  ${item.description}\n`;
            }
        });
        
        if (deliveryFee > 0) {
            productList += `• Frais de livraison (${this.getDeliveryName(deliveryType)}) - ${deliveryFee.toFixed(2)}€\n`;
        }
        
        return productList;
    }

    // Traiter le template avec les données
    processTemplate(template, data) {
        let message = template;
        Object.keys(data).forEach(key => {
            const placeholder = `{${key}}`;
            message = message.replace(new RegExp(placeholder, 'g'), data[key]);
        });
        return message;
    }

    // Formater la liste des produits
    formatProductList(cartItems) {
        return cartItems.map(item => item.name).join(', ');
    }

    // Formater la liste des quantités
    formatQuantityList(cartItems) {
        return cartItems.map(item => item.quantity).join(', ');
    }

    // Formater la liste des prix
    formatPriceList(cartItems, deliveryType, deliveryFee) {
        let prices = cartItems.map(item => `${item.total.toFixed(2)}${this.settings.defaultCurrency}`);
        
        if (deliveryFee > 0) {
            const deliveryName = this.getDeliveryName(deliveryType);
            prices.push(`Frais de livraison (${deliveryName}) - ${deliveryFee.toFixed(2)}${this.settings.defaultCurrency}`);
        }
        
        return prices.join(', ');
    }

    // Obtenir le nom de la livraison
    getDeliveryName(deliveryType) {
        const deliveryNames = {
            'livraison': 'Livraison à domicile',
            'mondial-relay': 'Mondial Relay',
            'meetup': 'Meet-up'
        };
        return deliveryNames[deliveryType] || deliveryType;
    }

    // Obtenir l'adresse formatée
    getFormattedAddress() {
        const street = document.getElementById('addressStreet')?.value || '';
        const city = document.getElementById('addressCity')?.value || '';
        const zip = document.getElementById('addressZip')?.value || '';
        const notes = document.getElementById('addressNotes')?.value || '';
        
        if (!street || !city || !zip) {
            return '';
        }
        
        let address = `📍 ADRESSE DE LIVRAISON\n`;
        address += `${street}\n`;
        address += `${zip} ${city}`;
        
        if (notes.trim()) {
            address += `\n📝 Notes: ${notes}`;
        }
        
        return address;
    }

    // Générer le message par défaut (fallback)
    generateDefaultMessage(cartItems, deliveryType, deliveryFee) {
        const itemsTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
        const total = itemsTotal + deliveryFee;
        
        let message = `🛒 COMMANDE\n\n`;
        cartItems.forEach(item => {
            message += `• ${item.name} (${item.quantity}) - ${item.total.toFixed(2)}€\n`;
            if (item.description) {
                message += `  ${item.description}\n`;
            }
        });
        
        if (deliveryFee > 0) {
            message += `• Frais de livraison (${this.getDeliveryName(deliveryType)}) - ${deliveryFee.toFixed(2)}€\n`;
        }
        
        message += `\n💰 TOTAL: ${total.toFixed(2)}€\n\n`;
        
        if (deliveryType === 'livraison' || deliveryType === 'mondial-relay') {
            const address = this.getFormattedAddress();
            if (address) {
                message += `${address}\n\n`;
            }
        }
        
        message += `📱 Envoyé depuis l'app ${this.settings.defaultAppName}`;
        
        return message;
    }

    // Appliquer les styles au message
    applyStyles(element) {
        if (!this.template) return;

        const styles = this.generateStyles();
        Object.assign(element.style, styles);
    }

    // Générer les styles CSS
    generateStyles() {
        if (!this.template) return {};

        let styles = {};
        
        styles.color = this.template.text_color || '#ffffff';
        styles.backgroundColor = this.template.background_color || '#1a1a1a';
        styles.fontFamily = this.template.font_family || 'Inter';
        styles.fontSize = `${this.template.font_size || 14}px`;
        styles.textAlign = this.template.text_align || 'left';
        
        if (this.template.show_border) {
            styles.border = '1px solid #333333';
        }
        
        if (this.template.show_shadow) {
            styles.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }
        
        if (this.template.gradient_background) {
            const start = this.template.gradient_start || '#ff6b6b';
            const end = this.template.gradient_end || '#4ecdc4';
            styles.background = `linear-gradient(45deg, ${start}, ${end})`;
        }
        
        return styles;
    }

    // Rafraîchir le template (pour les mises à jour en temps réel)
    async refreshTemplate() {
        await this.loadActiveTemplate();
        await this.loadSettings();
    }
}

// Instance globale
let orderMessageManager;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    orderMessageManager = new OrderMessageManager();
});
