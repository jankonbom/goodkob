// Gestion des messages de commande personnalisés
class CommandMessageManager {
    constructor() {
        this.currentTemplate = null;
        this.templates = [];
        this.settings = {
            defaultAppName: 'CALI FAST DRIVE',
            defaultCurrency: '€',
            autoActivate: true
        };
    }

    // Initialisation
    async init() {
        await this.loadTemplates();
        await this.loadSettings();
        this.setupEventListeners();
        this.updatePreviewTemplates();
    }

    // Charger les templates depuis Supabase
    async loadTemplates() {
        try {
            this.showLoading();
            const { data, error } = await supabaseClient
                .from('command_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            this.templates = data || [];
            this.renderTemplates();
            this.updatePreviewTemplates();
        } catch (error) {
            console.error('Erreur lors du chargement des templates:', error);
            this.showNotification('Erreur lors du chargement des templates', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Charger les paramètres
    async loadSettings() {
        try {
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
                this.settings = { ...this.settings, ...JSON.parse(data.value) };
                this.updateSettingsUI();
            }
        } catch (error) {
            console.warn('Erreur lors du chargement des paramètres, utilisation des paramètres par défaut:', error.message);
        }
    }

    // Sauvegarder les paramètres
    async saveSettings() {
        try {
            const settingsData = {
                defaultAppName: document.getElementById('defaultAppName').value,
                defaultCurrency: document.getElementById('defaultCurrency').value,
                autoActivate: document.getElementById('autoActivate').checked
            };

            const { error } = await supabaseClient
                .from('informations')
                .upsert({
                    key: 'command_message_settings',
                    value: JSON.stringify(settingsData),
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            this.settings = { ...this.settings, ...settingsData };
            this.showNotification('Paramètres sauvegardés avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres:', error);
            this.showNotification('Erreur lors de la sauvegarde des paramètres', 'error');
        }
    }

    // Mettre à jour l'interface des paramètres
    updateSettingsUI() {
        document.getElementById('defaultAppName').value = this.settings.defaultAppName;
        document.getElementById('defaultCurrency').value = this.settings.defaultCurrency;
        document.getElementById('autoActivate').checked = this.settings.autoActivate;
    }

    // Configurer les événements
    setupEventListeners() {
        // Gestion du dégradé
        document.getElementById('gradientBackground').addEventListener('change', (e) => {
            const gradientSettings = document.getElementById('gradientSettings');
            gradientSettings.style.display = e.target.checked ? 'flex' : 'none';
        });

        // Mise à jour de l'aperçu en temps réel
        const previewFields = [
            'messageTemplate', 'textColor', 'backgroundColor', 'borderColor',
            'fontFamily', 'fontSize', 'textAlign', 'showEmoji', 'showBorder',
            'showShadow', 'gradientBackground', 'gradientStart', 'gradientEnd'
        ];

        previewFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.addEventListener('input', () => this.updateLivePreview());
                element.addEventListener('change', () => this.updateLivePreview());
            }
        });
    }

    // Rendre la liste des templates
    renderTemplates() {
        const container = document.getElementById('templatesList');
        if (!container) return;

        if (this.templates.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💬</div>
                    <h3>Aucun template de message</h3>
                    <p>Créez votre premier template de message de commande</p>
                    <button class="btn btn-primary" onclick="openMessageTemplateModal()">
                        <span class="btn-icon">➕</span>
                        Créer un template
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.templates.map(template => `
            <div class="template-card ${template.is_active ? 'active' : ''}" data-id="${template.id}">
                <div class="template-header">
                    <div class="template-info">
                        <h4>${template.name}</h4>
                        <p>${template.description || 'Aucune description'}</p>
                    </div>
                    <div class="template-status ${template.is_active ? 'active' : 'inactive'}">
                        ${template.is_active ? 'Actif' : 'Inactif'}
                    </div>
                </div>
                <div class="template-preview">${this.escapeHtml(template.message_template)}</div>
                <div class="template-actions">
                    <button class="btn btn-secondary" onclick="editMessageTemplate(${template.id})">
                        <span class="btn-icon">✏️</span>
                        Modifier
                    </button>
                    <button class="btn ${template.is_active ? 'btn-warning' : 'btn-success'}" 
                            onclick="toggleTemplateStatus(${template.id})">
                        <span class="btn-icon">${template.is_active ? '⏸️' : '▶️'}</span>
                        ${template.is_active ? 'Désactiver' : 'Activer'}
                    </button>
                    <button class="btn btn-danger" onclick="deleteMessageTemplate(${template.id})">
                        <span class="btn-icon">🗑️</span>
                        Supprimer
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Mettre à jour la liste des templates pour l'aperçu
    updatePreviewTemplates() {
        const select = document.getElementById('previewTemplate');
        if (!select) return;

        select.innerHTML = '<option value="">Sélectionnez un template</option>' +
            this.templates.map(template => 
                `<option value="${template.id}">${template.name}</option>`
            ).join('');
    }

    // Ouvrir le modal de création/édition
    openTemplateModal(templateId = null) {
        const modal = document.getElementById('messageTemplateModal');
        const title = document.getElementById('messageModalTitle');
        
        if (templateId) {
            const template = this.templates.find(t => t.id === templateId);
            if (template) {
                this.currentTemplate = template;
                title.textContent = 'Modifier le Template';
                this.populateTemplateForm(template);
            }
        } else {
            this.currentTemplate = null;
            title.textContent = 'Nouveau Template';
            this.clearTemplateForm();
        }
        
        modal.style.display = 'flex';
    }

    // Remplir le formulaire avec les données du template
    populateTemplateForm(template) {
        document.getElementById('templateName').value = template.name || '';
        document.getElementById('templateDescription').value = template.description || '';
        document.getElementById('messageTemplate').value = template.message_template || '';
        document.getElementById('headerText').value = template.header_text || '🛒 COMMANDE';
        document.getElementById('headerEmoji').value = template.header_emoji || '🛒';
        document.getElementById('textColor').value = template.text_color || '#ffffff';
        document.getElementById('backgroundColor').value = template.background_color || '#1a1a1a';
        document.getElementById('borderColor').value = template.border_color || '#333333';
        document.getElementById('fontFamily').value = template.font_family || 'Inter';
        document.getElementById('fontSize').value = template.font_size || 14;
        document.getElementById('textAlign').value = template.text_align || 'left';
        document.getElementById('showEmoji').checked = template.show_emoji !== false;
        document.getElementById('showBorder').checked = template.show_border || false;
        document.getElementById('showShadow').checked = template.show_shadow !== false;
        document.getElementById('gradientBackground').checked = template.gradient_background || false;
        document.getElementById('gradientStart').value = template.gradient_start || '#ff6b6b';
        document.getElementById('gradientEnd').value = template.gradient_end || '#4ecdc4';
        document.getElementById('isActive').checked = template.is_active !== false;

        // Afficher/masquer les paramètres de dégradé
        const gradientSettings = document.getElementById('gradientSettings');
        gradientSettings.style.display = template.gradient_background ? 'flex' : 'none';
    }

    // Vider le formulaire
    clearTemplateForm() {
        document.getElementById('messageTemplateForm').reset();
        document.getElementById('gradientSettings').style.display = 'none';
    }

    // Sauvegarder le template
    async saveTemplate() {
        try {
            const formData = this.getTemplateFormData();
            
            if (!formData.name || !formData.message_template) {
                this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }

            this.showLoading();

            let result;
            if (this.currentTemplate) {
                // Mise à jour
                const { data, error } = await supabaseClient
                    .from('command_messages')
                    .update(formData)
                    .eq('id', this.currentTemplate.id)
                    .select();

                if (error) throw error;
                result = data[0];
            } else {
                // Création
                const { data, error } = await supabaseClient
                    .from('command_messages')
                    .insert([formData])
                    .select();

                if (error) throw error;
                result = data[0];
            }

            await this.loadTemplates();
            this.closeTemplateModal();
            this.showNotification('Template sauvegardé avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du template:', error);
            this.showNotification('Erreur lors de la sauvegarde du template', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Obtenir les données du formulaire
    getTemplateFormData() {
        return {
            name: document.getElementById('templateName').value,
            description: document.getElementById('templateDescription').value,
            message_template: document.getElementById('messageTemplate').value,
            header_text: document.getElementById('headerText').value,
            header_emoji: document.getElementById('headerEmoji').value,
            text_color: document.getElementById('textColor').value,
            background_color: document.getElementById('backgroundColor').value,
            border_color: document.getElementById('borderColor').value,
            font_family: document.getElementById('fontFamily').value,
            font_size: parseInt(document.getElementById('fontSize').value),
            text_align: document.getElementById('textAlign').value,
            show_emoji: document.getElementById('showEmoji').checked,
            show_border: document.getElementById('showBorder').checked,
            show_shadow: document.getElementById('showShadow').checked,
            gradient_background: document.getElementById('gradientBackground').checked,
            gradient_start: document.getElementById('gradientStart').value,
            gradient_end: document.getElementById('gradientEnd').value,
            is_active: document.getElementById('isActive').checked,
            created_by: 'admin'
        };
    }

    // Fermer le modal
    closeTemplateModal() {
        document.getElementById('messageTemplateModal').style.display = 'none';
        this.currentTemplate = null;
    }

    // Basculer le statut d'un template
    async toggleTemplateStatus(templateId) {
        try {
            const template = this.templates.find(t => t.id === templateId);
            if (!template) return;

            const { error } = await supabaseClient
                .from('command_messages')
                .update({ is_active: !template.is_active })
                .eq('id', templateId);

            if (error) throw error;

            await this.loadTemplates();
            this.showNotification(`Template ${template.is_active ? 'désactivé' : 'activé'} avec succès`, 'success');
        } catch (error) {
            console.error('Erreur lors du changement de statut:', error);
            this.showNotification('Erreur lors du changement de statut', 'error');
        }
    }

    // Supprimer un template
    async deleteTemplate(templateId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) return;

        try {
            const { error } = await supabaseClient
                .from('command_messages')
                .delete()
                .eq('id', templateId);

            if (error) throw error;

            await this.loadTemplates();
            this.showNotification('Template supprimé avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            this.showNotification('Erreur lors de la suppression', 'error');
        }
    }

    // Mettre à jour l'aperçu en temps réel
    updateLivePreview() {
        const template = this.getTemplateFormData();
        const preview = document.getElementById('messagePreview');
        
        if (!preview) return;

        const sampleData = {
            product_name: 'JNR FALCON 18K 🦅',
            product_quantity: '1 puff',
            product_price: '10.00',
            total_price: '220.00',
            app_name: this.settings.defaultAppName,
            product_list: '• JNR FALCON 18K 🦅 (1 puff) - 10.00€\n• JNR FALCON 28K 🦅 (2 bte) - 210.00€'
        };

        let message = this.processTemplate(template.message_template, sampleData);
        
        // Appliquer les styles
        const style = this.generateTemplateStyles(template);
        
        preview.innerHTML = `
            <div class="preview-message" style="${style}">
                ${this.escapeHtml(message)}
            </div>
        `;
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

    // Générer les styles CSS pour le template
    generateTemplateStyles(template) {
        let styles = [];
        
        styles.push(`color: ${template.text_color}`);
        styles.push(`background-color: ${template.background_color}`);
        styles.push(`font-family: ${template.font_family}`);
        styles.push(`font-size: ${template.font_size}px`);
        styles.push(`text-align: ${template.text_align}`);
        
        if (template.show_border) {
            styles.push(`border: 1px solid ${template.border_color}`);
        }
        
        if (template.show_shadow) {
            styles.push(`box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)`);
        }
        
        if (template.gradient_background) {
            styles.push(`background: linear-gradient(45deg, ${template.gradient_start}, ${template.gradient_end})`);
        }
        
        return styles.join('; ');
    }

    // Mettre à jour l'aperçu avec un template sélectionné
    updatePreview() {
        const templateId = document.getElementById('previewTemplate').value;
        if (!templateId) {
            document.getElementById('messagePreview').innerHTML = `
                <div class="preview-placeholder">
                    <p>👆 Sélectionnez un template pour voir l'aperçu</p>
                </div>
            `;
            return;
        }

        const template = this.templates.find(t => t.id == templateId);
        if (!template) return;

        const sampleData = {
            product_name: 'JNR FALCON 18K 🦅',
            product_quantity: '1 puff',
            product_price: '10.00',
            total_price: '220.00',
            app_name: this.settings.defaultAppName,
            product_list: '• JNR FALCON 18K 🦅 (1 puff) - 10.00€\n• JNR FALCON 28K 🦅 (2 bte) - 210.00€'
        };

        let message = this.processTemplate(template.message_template, sampleData);
        const style = this.generateTemplateStyles(template);
        
        document.getElementById('messagePreview').innerHTML = `
            <div class="preview-message" style="${style}">
                ${this.escapeHtml(message)}
            </div>
        `;
    }

    // Insérer une variable dans le textarea
    insertVariable(variable) {
        const textarea = document.getElementById('messageTemplate');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);

        textarea.value = before + variable + after;
        textarea.selectionStart = textarea.selectionEnd = start + variable.length;
        textarea.focus();

        this.updateLivePreview();
    }

    // Échapper le HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Afficher le loading
    showLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.style.display = 'flex';
        }
    }

    // Masquer le loading
    hideLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    // Afficher une notification
    showNotification(message, type = 'info') {
        // Utiliser le système de notification existant s'il existe
        if (typeof showNotification === 'function') {
            showNotification(message, type);
            return;
        }

        // Fallback : créer une notification simple
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background: ${type === 'error' ? '#f85149' : type === 'success' ? '#3fb950' : '#58a6ff'};
        `;

        document.body.appendChild(notification);

        // Supprimer après 3 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Fonctions globales pour l'interface
let commandMessageManager;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    commandMessageManager = new CommandMessageManager();
    commandMessageManager.init();
});

// Fonctions d'interface
function switchCommandTab(tabName) {
    // Masquer tous les onglets
    document.querySelectorAll('#command-messages-section .tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Désactiver tous les boutons d'onglets
    document.querySelectorAll('#command-messages-section .tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Afficher l'onglet sélectionné
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.querySelector(`#command-messages-section .tab-button[onclick="switchCommandTab('${tabName}')"]`).classList.add('active');
}

function openMessageTemplateModal(templateId = null) {
    commandMessageManager.openTemplateModal(templateId);
}

function closeMessageTemplateModal() {
    commandMessageManager.closeTemplateModal();
}

function saveMessageTemplate() {
    commandMessageManager.saveTemplate();
}

function editMessageTemplate(templateId) {
    commandMessageManager.openTemplateModal(templateId);
}

function toggleTemplateStatus(templateId) {
    commandMessageManager.toggleTemplateStatus(templateId);
}

function deleteMessageTemplate(templateId) {
    commandMessageManager.deleteTemplate(templateId);
}

function updatePreview() {
    commandMessageManager.updatePreview();
}

function insertVariable(variable) {
    commandMessageManager.insertVariable(variable);
}

function saveMessageSettings() {
    commandMessageManager.saveSettings();
}
