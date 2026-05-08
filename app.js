/**
 * Paint Pro - Aplicación de dibujo completa
 * Sistema de capas, herramientas de dibujo, selección, texto y más
 */

const APP_VERSION = '1.1.0';

const TRANSLATIONS = {
    es: {
        'menu.file': 'Archivo',
        'menu.edit': 'Edición',
        'menu.view': 'Ver',
        'menu.image': 'Imagen',
        'menu.help': 'Ayuda',
        'menu.extras': 'Extras',
        'menu.language': 'Lenguaje',
        'menu.default': 'Default',
        'menu.new': 'Nuevo',
        'menu.open': 'Abrir...',
        'menu.savePng': 'Guardar como PNG',
        'menu.saveJpg': 'Guardar como JPG',
        'menu.exportLayer': 'Exportar capa actual',
        'menu.undo': 'Deshacer (Ctrl+Z)',
        'menu.redo': 'Rehacer (Ctrl+Y)',
        'menu.cut': 'Cortar (Ctrl+X)',
        'menu.copy': 'Copiar (Ctrl+C)',
        'menu.paste': 'Pegar (Ctrl+V)',
        'menu.selectAll': 'Seleccionar todo',
        'menu.deselect': 'Deseleccionar',
        'menu.clearCanvas': 'Limpiar Canvas',
        'menu.zoomIn': 'Acercar (+)',
        'menu.zoomOut': 'Alejar (-)',
        'menu.zoomReset': 'Restablecer zoom',
        'menu.toggleGrid': 'Mostrar/Ocultar cuadrícula',
        'menu.invert': 'Invertir Colores (⌘I)',
        'menu.aboutApp': 'Acerca de Tool Paint Web',

        'toolbar.tools': 'Herramientas',
        'toolbar.shapes': 'Formas',
        'toolbar.selection': 'Selección',
        'toolbar.text': 'Texto',
        'toolbar.backgrounds': 'Backgrounds',
        'toolbar.properties': 'Propiedades',

        'tooltips.brush': 'Pincel (B)',
        'tooltips.selector': 'Selector (V)',
        'tooltips.pencil': 'Lápiz (P)',
        'tooltips.eraser': 'Borrador (E)',
        'tooltips.bucket': 'Rellenar (F)',
        'tooltips.picker': 'Cuentagotas (I)',
        'tooltips.line': 'Línea (L)',
        'tooltips.rect': 'Rectángulo (R)',
        'tooltips.circle': 'Círculo (C)',
        'tooltips.polygon': 'Polígono (O)',
        'tooltips.roundRect': 'Rectángulo redondeado (U)',
        'tooltips.ellipse': 'Elipse (J)',
        'tooltips.selectRect': 'Selección rectangular (M)',
        'tooltips.selectLasso': 'Lazo (S)',
        'tooltips.selectWand': 'Varita mágica (W)',
        'tooltips.crop': 'Recortar (R)',
        'tooltips.text': 'Texto (T)',
        'tooltips.flipV': 'Voltear verticalmente',
        'tooltips.flipH': 'Voltear horizontalmente',
        'tooltips.rotateL': 'Rotar 90° izquierda',
        'tooltips.rotateR': 'Rotar 90° derecha',

        'theme.toggle': 'Cambiar tema',

        'tools.brush': 'Pincel',
        'tools.selector': 'Selector',
        'tools.pencil': 'Lápiz',
        'tools.eraser': 'Borrador',
        'tools.bucket': 'Rellenar',
        'tools.picker': 'Cuentagotas',
        'tools.line': 'Línea',
        'tools.rect': 'Rectángulo',
        'tools.round-rect': 'Rectángulo redondeado',
        'tools.circle': 'Círculo',
        'tools.polygon': 'Polígono',
        'tools.ellipse': 'Elipse',
        'tools.select-rect': 'Selección rectangular',
        'tools.select-lasso': 'Lazo',
        'tools.select-wand': 'Varita mágica',
        'tools.crop': 'Recortar',
        'tools.text': 'Texto',

        'properties.primaryColor': 'Color principal',
        'properties.secondaryColor': 'Color secundario',
        'properties.size': 'Grosor',
        'properties.opacity': 'Opacidad',
        'properties.fillShape': 'Rellenar formas',
        'properties.wandTolerance': 'Tolerancia varita',

        'layers.title': 'Capas',
        'layers.deleteActive': 'Eliminar capa activa',
        'layers.newLayer': 'Nueva capa',
        'layers.deleteLayer': 'Eliminar capa',
        'layers.layerOpacity': 'Opacidad de capa',
        'layers.mergeDown': 'Fusionar abajo',

        'status.position': 'Posición',
        'status.size': 'Tamaño',
        'status.tool': 'Herramienta',

        'dialog.newDocument': 'Nuevo documento',
        'dialog.width': 'Ancho',
        'dialog.height': 'Alto',
        'dialog.background': 'Fondo',
        'dialog.transparent': 'Transparente',
        'dialog.white': 'Blanco',
        'dialog.black': 'Negro',
        'dialog.create': 'Crear',
        'dialog.cancel': 'Cancelar',

        'fonts.title': 'Fonts',
        'fonts.apply': 'Apply',
        'fonts.cancel': 'Cancel',
        'text.placeholder': 'Escribe aquí...',

        'about.version': 'Version ',
        'about.author': 'Tool Paint remake por Antares Martinez',
        'about.feedback': 'Feedback: ',
        'about.donate': 'Donate: ',
        'about.donatePlaceholder': 'Pendiente...En Construcción...',
        'about.ok': 'OK',

        'layer.defaultName': 'Capa de fondo',
        'layer.pastedImage': 'Imagen pegada',
        'layer.textLayer': 'Texto',
        'layer.newLayer': 'Capa ',
        'alert.minLayers': 'Debe mantener al menos una capa',
        'clipboard.copyError': 'No se pudo copiar al portapapeles',
        'clipboard.notSupported': 'API de portapapeles no soportada',
    },
    en: {
        'menu.file': 'File',
        'menu.edit': 'Edit',
        'menu.view': 'View',
        'menu.image': 'Image',
        'menu.help': 'Help',
        'menu.extras': 'Extras',
        'menu.language': 'Language',
        'menu.default': 'Default',
        'menu.new': 'New',
        'menu.open': 'Open...',
        'menu.savePng': 'Save as PNG',
        'menu.saveJpg': 'Save as JPG',
        'menu.exportLayer': 'Export current layer',
        'menu.undo': 'Undo (Ctrl+Z)',
        'menu.redo': 'Redo (Ctrl+Y)',
        'menu.cut': 'Cut (Ctrl+X)',
        'menu.copy': 'Copy (Ctrl+C)',
        'menu.paste': 'Paste (Ctrl+V)',
        'menu.selectAll': 'Select All',
        'menu.deselect': 'Deselect',
        'menu.clearCanvas': 'Clear Canvas',
        'menu.zoomIn': 'Zoom In (+)',
        'menu.zoomOut': 'Zoom Out (-)',
        'menu.zoomReset': 'Reset Zoom',
        'menu.toggleGrid': 'Show/Hide Grid',
        'menu.invert': 'Invert Colors (⌘I)',
        'menu.aboutApp': 'About Tool Paint Web',

        'toolbar.tools': 'Tools',
        'toolbar.shapes': 'Shapes',
        'toolbar.selection': 'Selection',
        'toolbar.text': 'Text',
        'toolbar.backgrounds': 'Backgrounds',
        'toolbar.properties': 'Properties',

        'tooltips.brush': 'Brush (B)',
        'tooltips.selector': 'Select (V)',
        'tooltips.pencil': 'Pencil (P)',
        'tooltips.eraser': 'Eraser (E)',
        'tooltips.bucket': 'Fill (F)',
        'tooltips.picker': 'Eyedropper (I)',
        'tooltips.line': 'Line (L)',
        'tooltips.rect': 'Rectangle (R)',
        'tooltips.circle': 'Circle (C)',
        'tooltips.polygon': 'Polygon (O)',
        'tooltips.roundRect': 'Rounded Rectangle (U)',
        'tooltips.ellipse': 'Ellipse (J)',
        'tooltips.selectRect': 'Rectangular Selection (M)',
        'tooltips.selectLasso': 'Lasso (S)',
        'tooltips.selectWand': 'Magic Wand (W)',
        'tooltips.crop': 'Crop (R)',
        'tooltips.text': 'Text (T)',
        'tooltips.flipV': 'Flip Vertical',
        'tooltips.flipH': 'Flip Horizontal',
        'tooltips.rotateL': 'Rotate 90° Left',
        'tooltips.rotateR': 'Rotate 90° Right',

        'theme.toggle': 'Toggle theme',

        'tools.brush': 'Brush',
        'tools.selector': 'Select',
        'tools.pencil': 'Pencil',
        'tools.eraser': 'Eraser',
        'tools.bucket': 'Fill',
        'tools.picker': 'Eyedropper',
        'tools.line': 'Line',
        'tools.rect': 'Rectangle',
        'tools.round-rect': 'Rounded Rectangle',
        'tools.circle': 'Circle',
        'tools.polygon': 'Polygon',
        'tools.ellipse': 'Ellipse',
        'tools.select-rect': 'Rectangular Selection',
        'tools.select-lasso': 'Lasso',
        'tools.select-wand': 'Magic Wand',
        'tools.crop': 'Crop',
        'tools.text': 'Text',

        'properties.primaryColor': 'Primary Color',
        'properties.secondaryColor': 'Secondary Color',
        'properties.size': 'Size',
        'properties.opacity': 'Opacity',
        'properties.fillShape': 'Fill shapes',
        'properties.wandTolerance': 'Wand Tolerance',

        'layers.title': 'Layers',
        'layers.deleteActive': 'Delete active layer',
        'layers.newLayer': 'New layer',
        'layers.deleteLayer': 'Delete layer',
        'layers.layerOpacity': 'Layer Opacity',
        'layers.mergeDown': 'Merge Down',

        'status.position': 'Position',
        'status.size': 'Size',
        'status.tool': 'Tool',

        'dialog.newDocument': 'New Document',
        'dialog.width': 'Width',
        'dialog.height': 'Height',
        'dialog.background': 'Background',
        'dialog.transparent': 'Transparent',
        'dialog.white': 'White',
        'dialog.black': 'Black',
        'dialog.create': 'Create',
        'dialog.cancel': 'Cancel',

        'fonts.title': 'Fonts',
        'fonts.apply': 'Apply',
        'fonts.cancel': 'Cancel',
        'text.placeholder': 'Type here...',

        'about.version': 'Version ',
        'about.author': 'Tool Paint remake by Antares Martinez',
        'about.feedback': 'Feedback: ',
        'about.donate': 'Donate: ',
        'about.donatePlaceholder': 'Pending...Under Construction...',
        'about.ok': 'OK',

        'layer.defaultName': 'Background layer',
        'layer.pastedImage': 'Pasted image',
        'layer.textLayer': 'Text',
        'layer.newLayer': 'Layer ',
        'alert.minLayers': 'You must keep at least one layer',
        'clipboard.copyError': 'Could not copy to clipboard',
        'clipboard.notSupported': 'Clipboard API not supported',
    }
};

class PaintApp {
    constructor() {
        // Dimensiones del canvas
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        
        // Estado actual
        this.currentTool = 'brush';
        this.isDrawing = false;
        this.isSelecting = false;
        this.zoom = 1;
        this.showGrid = false;
        
        // Propiedades de dibujo
        this.primaryColor = '#000000';
        this.secondaryColor = '#ffffff';
        this.brushSize = 5;
        this.brushOpacity = 100;
        this.fillShape = false;
        this.wandTolerance = 32;
        
        // Capas
        this.layers = [];
        this.activeLayerIndex = 0;
        this.layerIdCounter = 0;
        
        // Historial para deshacer/rehacer
        this.history = [];
        this.historyStep = -1;
        this.maxHistory = 50;
        
        // Selección
        this.selection = null;
        this.clipboard = null;
        
        // Puntos para polígonos y lazo
        this.polygonPoints = [];
        this.lassoPoints = [];

        // Texto
        this.textBounds = null;
        this.isDraggingFonts = false;
        this.fontsDragOffsetX = 0;
        this.fontsDragOffsetY = 0;
        this.textObjects = [];
        this.textIdCounter = 0;
        this.textModeActive = false;
        this.editingTextId = null;

        // Language
        this.currentLang = 'es';

        // Selector tool
        this.selectorPhase = null; // 'select' | 'move' | null
        this.moveCanvas = null;
        this.moveOffsetX = 0;
        this.moveOffsetY = 0;
        this.moveLayer = null;
        
        // Inicialización
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.createNewLayer(this.t('layer.defaultName'));
        this.saveState(); // Save initial blank state
        this.updateUI();
        this.applyTranslations();
        // Default: primary color selected
        setTimeout(() => this.selectColorPicker('primary'), 0);
    }
    
    setupCanvas() {
        this.mainCanvas = document.getElementById('main-canvas');
        this.tempCanvas = document.getElementById('temp-canvas');
        this.selectionCanvas = document.getElementById('selection-canvas');
        this.eventCanvas = document.getElementById('event-canvas');
        this.wrapper = document.getElementById('canvas-wrapper');
        
        this.mainCtx = this.mainCanvas.getContext('2d');
        this.tempCtx = this.tempCanvas.getContext('2d');
        this.selectionCtx = this.selectionCanvas.getContext('2d');
        this.eventCtx = this.eventCanvas.getContext('2d');
        
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.mainCanvas.width = this.canvasWidth;
        this.mainCanvas.height = this.canvasHeight;
        this.tempCanvas.width = this.canvasWidth;
        this.tempCanvas.height = this.canvasHeight;
        this.selectionCanvas.width = this.canvasWidth;
        this.selectionCanvas.height = this.canvasHeight;
        this.eventCanvas.width = this.canvasWidth;
        this.eventCanvas.height = this.canvasHeight;
        
        this.wrapper.style.width = this.canvasWidth + 'px';
        this.wrapper.style.height = this.canvasHeight + 'px';
        
        this.renderAllLayers();
    }
    
    setupEventListeners() {
        // Canvas events - using event-canvas which is on top
        this.eventCanvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.eventCanvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.eventCanvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.eventCanvas.addEventListener('mouseout', this.handleMouseUp.bind(this));
        
        // Touch support
        this.eventCanvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.eventCanvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.eventCanvas.addEventListener('touchend', this.handleMouseUp.bind(this));
        
        // Tool buttons
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', () => this.setTool(btn.dataset.tool));
        });
        
        // Color pickers
        document.getElementById('color-primary').addEventListener('change', (e) => {
            this.primaryColor = e.target.value;
            document.getElementById('preview-primary').style.background = e.target.value;
        });
        document.getElementById('color-primary').addEventListener('click', () => {
            this.selectColorPicker('primary');
        });
        document.getElementById('preview-primary').addEventListener('click', () => {
            document.getElementById('color-primary').click();
        });

        document.getElementById('color-secondary').addEventListener('change', (e) => {
            this.secondaryColor = e.target.value;
            document.getElementById('preview-secondary').style.background = e.target.value;
        });
        document.getElementById('color-secondary').addEventListener('click', () => {
            this.selectColorPicker('secondary');
        });
        document.getElementById('preview-secondary').addEventListener('click', () => {
            document.getElementById('color-secondary').click();
        });
        
        // Property sliders
        document.getElementById('brush-size').addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            document.getElementById('size-value').textContent = this.brushSize;
        });
        
        document.getElementById('brush-opacity').addEventListener('input', (e) => {
            this.brushOpacity = parseInt(e.target.value);
            document.getElementById('opacity-value').textContent = this.brushOpacity;
        });
        
        document.getElementById('wand-tolerance').addEventListener('input', (e) => {
            this.wandTolerance = parseInt(e.target.value);
        });
        
        document.getElementById('fill-shape').addEventListener('change', (e) => {
            this.fillShape = e.target.checked;
        });

        // Background buttons
        document.querySelectorAll('.bg-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setBackground(btn.id));
        });

        // Menu buttons
        document.getElementById('btn-new').addEventListener('click', () => this.showNewDialog());
        document.getElementById('btn-open').addEventListener('click', () => this.openImage());
        document.getElementById('btn-save').addEventListener('click', () => this.saveImage('png'));
        document.getElementById('btn-save-jpg').addEventListener('click', () => this.saveImage('jpg'));
        document.getElementById('btn-export-layer').addEventListener('click', () => this.exportLayer());
        
        document.getElementById('btn-undo').addEventListener('click', () => this.undo());
        document.getElementById('btn-redo').addEventListener('click', () => this.redo());
        document.getElementById('btn-cut').addEventListener('click', () => this.cut());
        document.getElementById('btn-copy').addEventListener('click', () => this.copy());
        document.getElementById('btn-paste').addEventListener('click', () => this.paste());
        document.getElementById('btn-select-all').addEventListener('click', () => this.selectAll());
        document.getElementById('btn-deselect').addEventListener('click', () => this.deselect());
        document.getElementById('btn-clear-canvas').addEventListener('click', () => this.clearCanvas());
        
        document.getElementById('btn-zoom-in').addEventListener('click', () => this.zoomIn());
        document.getElementById('btn-zoom-out').addEventListener('click', () => this.zoomOut());
        document.getElementById('btn-zoom-reset').addEventListener('click', () => this.zoomReset());
        document.getElementById('btn-toggle-grid').addEventListener('click', () => this.toggleGrid());
        document.getElementById('btn-invert').addEventListener('click', () => this.invertColors());
        document.getElementById('btn-flip-v').addEventListener('click', () => this.flipVertical());
        document.getElementById('btn-flip-h').addEventListener('click', () => this.flipHorizontal());
        document.getElementById('btn-rotate-l').addEventListener('click', () => this.rotateLeft());
        document.getElementById('btn-rotate-r').addEventListener('click', () => this.rotateRight());
        document.getElementById('btn-about').addEventListener('click', () => this.showAbout());
        document.getElementById('btn-about-ok').addEventListener('click', () => this.hideAbout());
        document.getElementById('btn-about-close-x').addEventListener('click', () => this.hideAbout());

        // Layer buttons
        document.getElementById('btn-new-layer').addEventListener('click', () => this.addLayer());
        document.getElementById('btn-delete-layer').addEventListener('click', () => this.deleteLayer());
        document.getElementById('btn-delete-layer-x').addEventListener('click', () => this.deleteLayer());
        document.getElementById('btn-merge-down').addEventListener('click', () => this.mergeDown());
        document.getElementById('layer-opacity').addEventListener('input', (e) => {
            this.setLayerOpacity(parseInt(e.target.value));
        });
        
        // Dialog buttons
        document.getElementById('btn-create-new').addEventListener('click', () => this.createNewDocument());
        document.getElementById('btn-cancel-new').addEventListener('click', () => this.hideNewDialog());
        document.getElementById('btn-apply-text').addEventListener('click', () => this.applyText());
        document.getElementById('btn-cancel-text').addEventListener('click', () => this.cancelText());

        // Fonts toggle buttons — sync textarea on each toggle
        document.getElementById('text-bold').addEventListener('click', () => {
            document.getElementById('text-bold').classList.toggle('active');
            this.syncTextareaFont();
        });
        document.getElementById('text-italic').addEventListener('click', () => {
            document.getElementById('text-italic').classList.toggle('active');
            this.syncTextareaFont();
        });
        document.getElementById('text-underline').addEventListener('click', () => {
            document.getElementById('text-underline').classList.toggle('active');
            this.syncTextareaFont();
        });
        document.getElementById('text-vertical').addEventListener('click', () => {
            document.getElementById('text-vertical').classList.toggle('active');
            this.syncTextareaFont();
        });

        // Font dropdown and size input — sync textarea on change
        document.getElementById('text-font').addEventListener('change', () => this.syncTextareaFont());
        document.getElementById('text-size').addEventListener('input', () => this.syncTextareaFont());
        
        // File input
        document.getElementById('file-input').addEventListener('change', (e) => this.loadImage(e));
        
        // Text input
        document.getElementById('text-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.applyText();
            }
        });
        
        // Double-click to finalize polygon
        this.eventCanvas.addEventListener('dblclick', (e) => {
            if (this.currentTool === 'polygon' && this.polygonPoints.length >= 3) {
                this.finalizePolygon();
            }
        });

        // Right-click to finalize polygon
        this.eventCanvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (this.currentTool === 'polygon' && this.polygonPoints.length >= 3) {
                this.finalizePolygon();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Paste from clipboard
        document.addEventListener('paste', (e) => this.handlePaste(e));

        // Drag and drop images onto canvas
        const workspace = document.getElementById('workspace');
        workspace.addEventListener('dragover', (e) => { e.preventDefault(); workspace.classList.add('drag-over'); });
        workspace.addEventListener('dragenter', (e) => { e.preventDefault(); workspace.classList.add('drag-over'); });
        workspace.addEventListener('dragleave', (e) => { e.preventDefault(); workspace.classList.remove('drag-over'); });
        workspace.addEventListener('drop', (e) => { e.preventDefault(); workspace.classList.remove('drag-over'); this.handleDropImage(e); });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => {
            const isLight = document.body.getAttribute('data-theme') === 'light';
            document.body.setAttribute('data-theme', isLight ? '' : 'light');
            themeToggle.textContent = isLight ? '🌙' : '☀️';
        });

        // Language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setLanguage(btn.dataset.lang));
        });

        // Fonts dialog drag
        this.initFontsDrag();
    }
    
    // ====================
    // SISTEMA DE CAPAS
    // ====================
    
    createNewLayer(name = null) {
        const canvas = document.createElement('canvas');
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        
        const ctx = canvas.getContext('2d');
        // Enable anti-aliasing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        const layer = {
            id: ++this.layerIdCounter,
            name: name || (this.t('layer.newLayer') + (this.layers.length + 1)),
            canvas: canvas,
            ctx: ctx,
            visible: true,
            opacity: 1,
            locked: false
        };
        
        this.layers.push(layer);
        this.activeLayerIndex = this.layers.length - 1;
        
        // Only save state if this is not the first layer during init
        if (this.layers.length > 1) {
            this.saveState();
        }
        
        this.renderAllLayers();
        this.updateLayersPanel();
        
        return layer;
    }
    
    getActiveLayer() {
        return this.layers[this.activeLayerIndex];
    }
    
    addLayer() {
        this.createNewLayer();
    }
    
    deleteLayer() {
        if (this.layers.length <= 1) {
            alert(this.t('alert.minLayers'));
            return;
        }

        const deletedLayerId = this.layers[this.activeLayerIndex].id;
        // Remove associated text objects
        this.textObjects = this.textObjects.filter(t => t.layerId !== deletedLayerId);
        this.layers.splice(this.activeLayerIndex, 1);
        this.activeLayerIndex = Math.max(0, this.activeLayerIndex - 1);
        this.saveState();
        this.renderAllLayers();
        this.updateLayersPanel();
    }
    
    setActiveLayer(index) {
        if (index >= 0 && index < this.layers.length) {
            this.activeLayerIndex = index;
            this.updateLayersPanel();
            // If layer has text, enter editing mode automatically
            const layer = this.layers[index];
            const textObj = this.findTextObjectByLayerId(layer.id);
            if (textObj && !this.textBounds) {
                this.setTool('text');
                this.loadTextForEditing(textObj);
            }
        }
    }
    
    toggleLayerVisibility(index) {
        this.layers[index].visible = !this.layers[index].visible;
        this.renderAllLayers();
        this.updateLayersPanel();
    }
    
    setLayerOpacity(opacity) {
        const layer = this.getActiveLayer();
        if (layer) {
            layer.opacity = opacity / 100;
            this.renderAllLayers();
        }
    }
    
    mergeDown() {
        if (this.activeLayerIndex === 0) return;

        const current = this.getActiveLayer();
        const below = this.layers[this.activeLayerIndex - 1];

        below.ctx.globalAlpha = current.opacity;
        below.ctx.drawImage(current.canvas, 0, 0);
        below.ctx.globalAlpha = 1;

        // Remove associated text objects
        this.textObjects = this.textObjects.filter(t => t.layerId !== current.id);
        this.layers.splice(this.activeLayerIndex, 1);
        this.activeLayerIndex--;
        this.saveState();
        this.renderAllLayers();
        this.updateLayersPanel();
    }
    
    updateLayersPanel() {
        const container = document.getElementById('layers-list');
        container.innerHTML = '';

        this.layers.slice().reverse().forEach((layer, reversedIndex) => {
            const index = this.layers.length - 1 - reversedIndex;
            const item = document.createElement('div');
            item.className = 'layer-item' + (index === this.activeLayerIndex ? ' active' : '');
            item.dataset.layerId = layer.id;
            item.draggable = true;
            item.onclick = () => this.setActiveLayer(index);

            // Drag and drop events
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', layer.id);
                item.classList.add('dragging');
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const rect = item.getBoundingClientRect();
                const y = e.clientY - rect.top;
                item.classList.remove('drag-over-top', 'drag-over-bottom');
                if (y < rect.height / 2) {
                    item.classList.add('drag-over-top');
                } else {
                    item.classList.add('drag-over-bottom');
                }
            });

            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over-top', 'drag-over-bottom');
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                item.classList.remove('drag-over-top', 'drag-over-bottom');

                const draggedId = parseInt(e.dataTransfer.getData('text/plain'), 10);
                if (draggedId === layer.id) return;

                const rect = item.getBoundingClientRect();
                const y = e.clientY - rect.top;
                const insertBefore = y < rect.height / 2;

                const draggedEl = container.querySelector(`[data-layer-id="${draggedId}"]`);
                if (!draggedEl) return;

                container.removeChild(draggedEl);

                if (insertBefore) {
                    container.insertBefore(draggedEl, item);
                } else {
                    container.insertBefore(draggedEl, item.nextSibling);
                }

                this.syncLayersFromDOM();
            });

            item.addEventListener('dragend', () => {
                document.querySelectorAll('.layer-item').forEach(el => {
                    el.classList.remove('dragging', 'drag-over-top', 'drag-over-bottom');
                });
            });

            const visibilityBtn = document.createElement('button');
            visibilityBtn.className = 'layer-visibility' + (layer.visible ? '' : ' hidden');
            visibilityBtn.innerHTML = layer.visible ? '👁' : '🚫';
            visibilityBtn.onclick = (e) => {
                e.stopPropagation();
                this.toggleLayerVisibility(index);
            };

            const preview = document.createElement('div');
            preview.className = 'layer-preview';
            const previewCanvas = document.createElement('canvas');
            previewCanvas.width = 40;
            previewCanvas.height = 40;
            const pctx = previewCanvas.getContext('2d');
            pctx.drawImage(layer.canvas, 0, 0, 40, 40);
            preview.appendChild(previewCanvas);

            const info = document.createElement('div');
            info.className = 'layer-info';
            const nameInput = document.createElement('input');
            nameInput.className = 'layer-name';
            nameInput.value = layer.name;
            nameInput.onchange = (e) => { layer.name = e.target.value; };
            info.appendChild(nameInput);

            item.appendChild(visibilityBtn);
            item.appendChild(preview);
            item.appendChild(info);
            container.appendChild(item);
        });

        document.getElementById('layer-opacity').value =
            (this.getActiveLayer()?.opacity || 1) * 100;
    }

    syncLayersFromDOM() {
        const container = document.getElementById('layers-list');
        const items = container.querySelectorAll('.layer-item');
        const newOrder = [];

        items.forEach(el => {
            const id = parseInt(el.dataset.layerId, 10);
            const layer = this.layers.find(l => l.id === id);
            if (layer) newOrder.push(layer);
        });

        // DOM shows reversed order (top layer first), reverse to get array order
        this.layers = newOrder.reverse();

        // Update active layer index
        const activeId = this.getActiveLayer()?.id;
        this.activeLayerIndex = this.layers.findIndex(l => l.id === activeId);
        if (this.activeLayerIndex === -1) this.activeLayerIndex = 0;

        this.saveState();
        this.renderAllLayers();
        this.updateLayersPanel();
        this.updateStatusBar();
    }
    
    renderAllLayers() {
        this.mainCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        this.layers.forEach(layer => {
            if (layer.visible) {
                this.mainCtx.globalAlpha = layer.opacity;
                this.mainCtx.drawImage(layer.canvas, 0, 0);
            }
        });
        
        this.mainCtx.globalAlpha = 1;
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
    
    // ====================
    // HERRAMIENTAS DE DIBUJO
    // ====================
    
    setTool(tool) {
        this.currentTool = tool;
        
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tool === tool) btn.classList.add('active');
        });
        
        const toolKey = 'tools.' + tool;
        document.getElementById('status-tool').textContent =
            this.t('status.tool') + ': ' + this.t(toolKey);
        
        // Reset polygon points and lasso points
        this.polygonPoints = [];
        this.lassoPoints = [];
        this.selectorPhase = null;
        this.moveCanvas = null;
        this.moveLayer = null;

        // Update cursor
        this.updateCursor();

        // Cancel text mode if switching away
        if (this.textBounds) {
            this.cancelText();
        }
    }
    
    updateCursor() {
        const cursors = {
            'brush': 'crosshair',
            'selector': 'default',
            'pencil': 'crosshair',
            'eraser': 'cell',
            'bucket': 'pointer',
            'picker': 'crosshair',
            'text': 'text',
            'select-rect': 'crosshair',
            'select-lasso': 'crosshair',
            'select-wand': 'crosshair',
            'crop': 'crosshair',
            'round-rect': 'crosshair',
            'ellipse': 'crosshair'
        };
        this.eventCanvas.style.cursor = cursors[this.currentTool] || 'default';
    }
    
    getMousePos(e) {
        const rect = this.eventCanvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / this.zoom,
            y: (e.clientY - rect.top) / this.zoom
        };
    }
    
    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                          e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.eventCanvas.dispatchEvent(mouseEvent);
    }
    
    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        this.startX = pos.x;
        this.startY = pos.y;
        this.lastX = pos.x;
        this.lastY = pos.y;
        
        if (this.currentTool !== 'selector') {
            const layer = this.getActiveLayer();
            if (!layer || !layer.visible || layer.locked) return;
        }

        this.isDrawing = true;
        
        switch(this.currentTool) {
            case 'brush':
            case 'pencil':
            case 'eraser':
                this.startDrawing(pos.x, pos.y);
                break;
            case 'bucket':
                this.floodFill(Math.floor(pos.x), Math.floor(pos.y));
                this.saveState();
                break;
            case 'picker':
                this.pickColor(pos.x, pos.y);
                break;
            case 'text':
                if (this.textBounds) {
                    this.cancelText();
                }
                // Check if clicking on existing text to re-edit
                const existing = this.findTextObjectAt(pos.x, pos.y);
                if (existing) {
                    this.isDrawing = false;
                    this.loadTextForEditing(existing);
                    return;
                }
                break;
            case 'select-wand':
                this.magicWand(Math.floor(pos.x), Math.floor(pos.y));
                break;
            case 'select-lasso':
                this.lassoPoints = [{x: pos.x, y: pos.y}];
                break;
            case 'crop':
                this.startCrop(pos.x, pos.y);
                break;
            case 'selector':
                if (this.selection && this.isInsideSelection(pos.x, pos.y)) {
                    this.selectorPhase = 'move';
                    this.moveOffsetX = pos.x - this.selection.x;
                    this.moveOffsetY = pos.y - this.selection.y;
                    this.captureSelectionContent();
                } else {
                    this.deselect();
                    // Try to grab entire layer content under cursor
                    const targetLayer = this.findLayerAtPoint(pos.x, pos.y);
                    if (targetLayer) {
                        this.selectorPhase = 'move';
                        this.moveLayer = targetLayer;
                        this.moveOffsetX = pos.x;
                        this.moveOffsetY = pos.y;
                        this.captureLayerContent(targetLayer);
                    } else {
                        this.selectorPhase = 'select';
                    }
                }
                break;
        }
    }

    handleMouseMove(e) {
        const pos = this.getMousePos(e);
        
        document.getElementById('status-position').textContent =
            `${this.t('status.position')}: ${Math.floor(pos.x)}, ${Math.floor(pos.y)}`;
        
        if (!this.isDrawing) return;
        
        switch(this.currentTool) {
            case 'brush':
            case 'pencil':
            case 'eraser':
                this.draw(pos.x, pos.y);
                break;
            case 'line':
            case 'rect':
            case 'round-rect':
            case 'ellipse':
            case 'circle':
            case 'polygon':
            case 'select-rect':
                this.drawShapePreview(pos.x, pos.y);
                break;
            case 'select-lasso':
                this.lassoPoints.push({x: pos.x, y: pos.y});
                this.drawLassoPreview();
                break;
            case 'crop':
                this.drawCropPreview(pos.x, pos.y);
                break;
            case 'text':
                this.drawTextPreview(pos.x, pos.y);
                break;
            case 'selector':
                if (this.selectorPhase === 'select') {
                    this.drawShapePreview(pos.x, pos.y);
                } else if (this.selectorPhase === 'move') {
                    if (this.moveLayer) this.drawLayerMovePreview(pos.x, pos.y);
                    else this.drawMovePreview(pos.x, pos.y);
                }
                break;
        }

        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    handleMouseUp(e) {
        if (!this.isDrawing) return;

        const pos = this.getMousePos(e);
        
        switch(this.currentTool) {
            case 'brush':
            case 'pencil':
            case 'eraser':
                // Reset composite operation after erasing
                if (this.currentTool === 'eraser') {
                    const layer = this.getActiveLayer();
                    if (layer) layer.ctx.globalCompositeOperation = 'source-over';
                }
                this.saveState();
                break;
            case 'line':
            case 'rect':
            case 'round-rect':
            case 'ellipse':
            case 'circle':
            case 'polygon':
                this.drawShapeFinal(pos.x, pos.y);
                break;
            case 'select-rect':
                this.finalizeSelection(pos.x, pos.y);
                break;
            case 'select-lasso':
                this.finalizeLassoSelection(pos.x, pos.y);
                break;
            case 'crop':
                this.finalizeCrop(pos.x, pos.y);
                break;
            case 'text':
                this.finalizeText(pos.x, pos.y);
                break;
            case 'selector':
                if (this.selectorPhase === 'select') {
                    this.finalizeSelection(pos.x, pos.y);
                } else if (this.selectorPhase === 'move') {
                    if (this.moveLayer) this.finalizeLayerMove(pos.x, pos.y);
                    else this.finalizeMove(pos.x, pos.y);
                }
                this.selectorPhase = null;
                break;
        }

        this.isDrawing = false;
    }
    
    // ====================
    // HERRAMIENTAS ESPECÍFICAS
    // ====================
    
    startDrawing(x, y) {
        const layer = this.getActiveLayer();
        if (!layer) return;
        
        const ctx = layer.ctx;
        
        if (this.currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = this.getActiveColor();
            ctx.fillStyle = this.getActiveColor();
        }

        ctx.lineWidth = this.brushSize;
        ctx.lineCap = this.currentTool === 'pencil' ? 'butt' : 'round';
        ctx.lineJoin = this.currentTool === 'pencil' ? 'miter' : 'round';
        ctx.globalAlpha = this.brushOpacity / 100;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y); // Draw a dot
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        this.lastX = x;
        this.lastY = y;
    }
    
    draw(x, y) {
        const layer = this.getActiveLayer();
        if (!layer) return;
        
        const ctx = layer.ctx;
        
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Update path for next segment
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        this.renderAllLayers();
    }
    
    drawShapePreview(x, y) {
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        if (this.currentTool === 'select-rect') {
            this.tempCtx.strokeStyle = '#007acc';
            this.tempCtx.lineWidth = 1;
            this.tempCtx.setLineDash([5, 5]);
        } else {
            this.tempCtx.strokeStyle = this.getActiveColor();
            this.tempCtx.fillStyle = this.getActiveColor();
            this.tempCtx.lineWidth = this.brushSize;
            this.tempCtx.globalAlpha = this.brushOpacity / 100;
            this.tempCtx.setLineDash([]);
        }

        this.tempCtx.beginPath();
        
        switch(this.currentTool) {
            case 'line':
                this.tempCtx.moveTo(this.startX, this.startY);
                this.tempCtx.lineTo(x, y);
                this.tempCtx.stroke();
                break;
            case 'rect':
            case 'select-rect':
                const w = x - this.startX;
                const h = y - this.startY;
                if (this.fillShape && this.currentTool !== 'select-rect') {
                    this.tempCtx.fillRect(this.startX, this.startY, w, h);
                }
                this.tempCtx.strokeRect(this.startX, this.startY, w, h);
                break;
            case 'round-rect':
                const rw = x - this.startX;
                const rh = y - this.startY;
                const rr = Math.min(Math.abs(rw), Math.abs(rh), 30);
                if (this.fillShape) {
                    this.roundRectPath(this.tempCtx, this.startX, this.startY, rw, rh, rr);
                    this.tempCtx.fill();
                }
                this.roundRectPath(this.tempCtx, this.startX, this.startY, rw, rh, rr);
                this.tempCtx.stroke();
                break;
            case 'circle':
                const cx = (this.startX + x) / 2;
                const cy = (this.startY + y) / 2;
                const cr = Math.min(Math.abs(x - this.startX), Math.abs(y - this.startY)) / 2;
                this.tempCtx.arc(cx, cy, cr, 0, Math.PI * 2);
                if (this.fillShape) this.tempCtx.fill();
                this.tempCtx.stroke();
                break;
            case 'ellipse':
                const ex = (this.startX + x) / 2;
                const ey = (this.startY + y) / 2;
                const rx = Math.abs(x - this.startX) / 2;
                const ry = Math.abs(y - this.startY) / 2;
                this.tempCtx.ellipse(ex, ey, rx, ry, 0, 0, Math.PI * 2);
                if (this.fillShape) this.tempCtx.fill();
                this.tempCtx.stroke();
                break;
            case 'polygon':
                const pCx = (this.startX + x) / 2;
                const pCy = (this.startY + y) / 2;
                const pR = Math.min(Math.abs(x - this.startX), Math.abs(y - this.startY)) / 2;
                this.tempCtx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 72 - 90) * Math.PI / 180;
                    const px = pCx + pR * Math.cos(angle);
                    const py = pCy + pR * Math.sin(angle);
                    if (i === 0) this.tempCtx.moveTo(px, py);
                    else this.tempCtx.lineTo(px, py);
                }
                this.tempCtx.closePath();
                if (this.fillShape) this.tempCtx.fill();
                this.tempCtx.stroke();
                break;
        }

        this.tempCtx.setLineDash([]);
    }

    drawLassoPreview() {
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        if (this.lassoPoints.length < 2) return;

        this.tempCtx.strokeStyle = '#007acc';
        this.tempCtx.lineWidth = 1;
        this.tempCtx.setLineDash([5, 5]);
        this.tempCtx.beginPath();
        this.tempCtx.moveTo(this.lassoPoints[0].x, this.lassoPoints[0].y);
        for (let i = 1; i < this.lassoPoints.length; i++) {
            this.tempCtx.lineTo(this.lassoPoints[i].x, this.lassoPoints[i].y);
        }
        this.tempCtx.stroke();
        this.tempCtx.setLineDash([]);
    }

    roundRectPath(ctx, x, y, w, h, r) {
        ctx.beginPath();
        if (w < 0 && h < 0) {
            ctx.roundRect(x + w, y + h, -w, -h, r);
        } else if (w < 0) {
            ctx.roundRect(x + w, y, -w, h, r);
        } else if (h < 0) {
            ctx.roundRect(x, y + h, w, -h, r);
        } else {
            ctx.roundRect(x, y, w, h, r);
        }
    }

    drawShapeFinal(x, y) {
        const layer = this.getActiveLayer();
        const ctx = layer.ctx;
        
        ctx.strokeStyle = this.getActiveColor();
        ctx.fillStyle = this.getActiveColor();
        ctx.lineWidth = this.brushSize;
        ctx.globalAlpha = this.brushOpacity / 100;
        ctx.beginPath();

        switch(this.currentTool) {
            case 'line':
                ctx.moveTo(this.startX, this.startY);
                ctx.lineTo(x, y);
                ctx.stroke();
                break;
            case 'rect':
                const w = x - this.startX;
                const h = y - this.startY;
                if (this.fillShape) ctx.fillRect(this.startX, this.startY, w, h);
                ctx.strokeRect(this.startX, this.startY, w, h);
                break;
            case 'round-rect':
                const rw = x - this.startX;
                const rh = y - this.startY;
                const rr = Math.min(Math.abs(rw), Math.abs(rh), 30);
                if (this.fillShape) {
                    this.roundRectPath(ctx, this.startX, this.startY, rw, rh, rr);
                    ctx.fill();
                }
                this.roundRectPath(ctx, this.startX, this.startY, rw, rh, rr);
                ctx.stroke();
                break;
            case 'circle':
                const cx = (this.startX + x) / 2;
                const cy = (this.startY + y) / 2;
                const cr = Math.min(Math.abs(x - this.startX), Math.abs(y - this.startY)) / 2;
                ctx.arc(cx, cy, cr, 0, Math.PI * 2);
                if (this.fillShape) ctx.fill();
                ctx.stroke();
                break;
            case 'ellipse':
                const ex = (this.startX + x) / 2;
                const ey = (this.startY + y) / 2;
                const rx = Math.abs(x - this.startX) / 2;
                const ry = Math.abs(y - this.startY) / 2;
                ctx.ellipse(ex, ey, rx, ry, 0, 0, Math.PI * 2);
                if (this.fillShape) ctx.fill();
                ctx.stroke();
                break;
            case 'polygon':
                const pCx = (this.startX + x) / 2;
                const pCy = (this.startY + y) / 2;
                const pR = Math.min(Math.abs(x - this.startX), Math.abs(y - this.startY)) / 2;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 72 - 90) * Math.PI / 180;
                    const px = pCx + pR * Math.cos(angle);
                    const py = pCy + pR * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                if (this.fillShape) ctx.fill();
                ctx.stroke();
                break;
        }
        
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.renderAllLayers();
    }
    
    // ====================
    // POLÍGONO
    // ====================
    
    addPolygonPoint(x, y) {
        this.polygonPoints.push({x, y});
        
        // Dibujar punto temporal
        this.tempCtx.fillStyle = this.getActiveColor();
        this.tempCtx.beginPath();
        this.tempCtx.arc(x, y, 3, 0, Math.PI * 2);
        this.tempCtx.fill();

        if (this.polygonPoints.length > 1) {
            const prev = this.polygonPoints[this.polygonPoints.length - 2];
            this.tempCtx.strokeStyle = this.getActiveColor();
            this.tempCtx.lineWidth = this.brushSize;
            this.tempCtx.beginPath();
            this.tempCtx.moveTo(prev.x, prev.y);
            this.tempCtx.lineTo(x, y);
            this.tempCtx.stroke();
        }
        
        // Doble clic para cerrar
        if (this.polygonPoints.length > 2 && 
            Math.abs(x - this.polygonPoints[0].x) < 10 && 
            Math.abs(y - this.polygonPoints[0].y) < 10) {
            this.finalizePolygon();
        }
    }
    
    finalizePolygon() {
        if (this.polygonPoints.length < 3) return;
        
        const layer = this.getActiveLayer();
        const ctx = layer.ctx;
        
        ctx.strokeStyle = this.getActiveColor();
        ctx.fillStyle = this.getActiveColor();
        ctx.lineWidth = this.brushSize;
        ctx.globalAlpha = this.brushOpacity / 100;
        
        ctx.beginPath();
        ctx.moveTo(this.polygonPoints[0].x, this.polygonPoints[0].y);
        
        for (let i = 1; i < this.polygonPoints.length; i++) {
            ctx.lineTo(this.polygonPoints[i].x, this.polygonPoints[i].y);
        }
        
        ctx.closePath();
        if (this.fillShape) ctx.fill();
        ctx.stroke();
        
        this.polygonPoints = [];
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.renderAllLayers();
        this.saveState();
    }
    
    // ====================
    // RELLENO (BUCKET)
    // ====================
    
    floodFill(startX, startY) {
        const layer = this.getActiveLayer();
        const ctx = layer.ctx;
        const imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        const data = imageData.data;
        
        const targetIdx = (startY * this.canvasWidth + startX) * 4;
        const targetR = data[targetIdx];
        const targetG = data[targetIdx + 1];
        const targetB = data[targetIdx + 2];
        const targetA = data[targetIdx + 3];
        
        const fillColor = this.hexToRgb(this.getActiveColor());
        const fillA = Math.floor((this.brushOpacity / 100) * 255);
        
        if (targetR === fillColor.r && targetG === fillColor.g && 
            targetB === fillColor.b && targetA === fillA) return;
        
        const stack = [[startX, startY]];
        const visited = new Set();
        
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const key = `${x},${y}`;
            
            if (x < 0 || x >= this.canvasWidth || y < 0 || y >= this.canvasHeight) continue;
            if (visited.has(key)) continue;
            
            const idx = (y * this.canvasWidth + x) * 4;
            
            if (data[idx] === targetR && data[idx + 1] === targetG && 
                data[idx + 2] === targetB && data[idx + 3] === targetA) {
                
                data[idx] = fillColor.r;
                data[idx + 1] = fillColor.g;
                data[idx + 2] = fillColor.b;
                data[idx + 3] = fillA;
                
                visited.add(key);
                stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.renderAllLayers();
        this.saveState();
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 0, g: 0, b: 0};
    }
    
    // ====================
    // CUENTAGOTAS
    // ====================
    
    pickColor(x, y) {
        const layer = this.getActiveLayer();
        const pixel = layer.ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
        const hex = '#' + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1);
        
        this.primaryColor = hex;
        document.getElementById('color-primary').value = hex;
        document.getElementById('preview-primary').style.background = hex;
    }
    
    // ====================
    // SELECCIÓN
    // ====================
    
    finalizeSelection(x, y) {
        const minX = Math.min(this.startX, x);
        const minY = Math.min(this.startY, y);
        const w = Math.abs(x - this.startX);
        const h = Math.abs(y - this.startY);
        
        this.selection = {
            x: minX,
            y: minY,
            width: w,
            height: h
        };
        
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawSelectionBorder();
    }
    
    drawSelectionBorder() {
        if (!this.selection) return;
        
        this.selectionCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.selectionCtx.strokeStyle = '#007acc';
        this.selectionCtx.lineWidth = 2;
        this.selectionCtx.setLineDash([5, 5]);
        this.selectionCtx.strokeRect(
            this.selection.x, 
            this.selection.y, 
            this.selection.width, 
            this.selection.height
        );
        this.selectionCtx.setLineDash([]);
    }
    
    finalizeLassoSelection(x, y) {
        // Add last point to close the path
        this.lassoPoints.push({x, y});

        if (this.lassoPoints.length < 3) {
            this.lassoPoints = [];
            return;
        }

        // Calculate bounding box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const p of this.lassoPoints) {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        }

        this.selection = {
            x: minX, y: minY,
            width: maxX - minX, height: maxY - minY,
            points: this.lassoPoints.slice()
        };

        this.lassoPoints = [];
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw lasso path on selection canvas
        this.selectionCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.selectionCtx.strokeStyle = '#007acc';
        this.selectionCtx.lineWidth = 2;
        this.selectionCtx.setLineDash([5, 5]);
        this.selectionCtx.beginPath();
        this.selectionCtx.moveTo(this.selection.points[0].x, this.selection.points[0].y);
        for (let i = 1; i < this.selection.points.length; i++) {
            this.selectionCtx.lineTo(this.selection.points[i].x, this.selection.points[i].y);
        }
        this.selectionCtx.closePath();
        this.selectionCtx.stroke();
        this.selectionCtx.setLineDash([]);
    }

    selectAll() {
        this.selection = {
            x: 0,
            y: 0,
            width: this.canvasWidth,
            height: this.canvasHeight
        };
        this.drawSelectionBorder();
    }
    
    deselect() {
        this.selection = null;
        this.selectionCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
    
    // ====================
    // VARITA MÁGICA
    // ====================
    
    magicWand(startX, startY) {
        const layer = this.getActiveLayer();
        const ctx = layer.ctx;
        const imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        const data = imageData.data;

        const targetIdx = (startY * this.canvasWidth + startX) * 4;
        const targetColor = {
            r: data[targetIdx],
            g: data[targetIdx + 1],
            b: data[targetIdx + 2],
            a: data[targetIdx + 3]
        };

        // Clear selection canvas
        this.selectionCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Create selection mask on the actual selection canvas
        const sData = this.selectionCtx.createImageData(this.canvasWidth, this.canvasHeight);

        const stack = [[startX, startY]];
        const visited = new Set();
        const tolerance = this.wandTolerance;
        let minX = startX, minY = startY, maxX = startX, maxY = startY;

        while (stack.length > 0) {
            const [x, y] = stack.pop();
            const key = `${x},${y}`;

            if (x < 0 || x >= this.canvasWidth || y < 0 || y >= this.canvasHeight) continue;
            if (visited.has(key)) continue;

            const idx = (y * this.canvasWidth + x) * 4;

            const diff = Math.abs(data[idx] - targetColor.r) +
                        Math.abs(data[idx + 1] - targetColor.g) +
                        Math.abs(data[idx + 2] - targetColor.b) +
                        Math.abs(data[idx + 3] - targetColor.a);

            if (diff <= tolerance * 4) {
                sData.data[idx + 3] = 100; // Semi-transparente
                visited.add(key);
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
                stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
            }
        }

        this.selectionCtx.putImageData(sData, 0, 0);

        this.selection = {
            x: minX, y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
    
    // ====================
    // CORTAR, COPIAR, PEGAR
    // ====================
    
    cut() {
        this.copy();
        if (this.selection) {
            const layer = this.getActiveLayer();
            layer.ctx.clearRect(
                this.selection.x, 
                this.selection.y, 
                this.selection.width, 
                this.selection.height
            );
            this.renderAllLayers();
            this.saveState();
        }
    }
    
    copy() {
        if (!this.selection) return;
        
        const layer = this.getActiveLayer();
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.selection.width;
        tempCanvas.height = this.selection.height;
        const tctx = tempCanvas.getContext('2d');
        
        tctx.drawImage(
            layer.canvas,
            this.selection.x, this.selection.y, 
            this.selection.width, this.selection.height,
            0, 0,
            this.selection.width, this.selection.height
        );
        
        this.clipboard = {
            canvas: tempCanvas,
            width: this.selection.width,
            height: this.selection.height
        };
        
        // Copiar al portapapeles del sistema (si está soportado)
        try {
            if (typeof ClipboardItem !== 'undefined') {
                tempCanvas.toBlob(blob => {
                    if (blob) {
                        const item = new ClipboardItem({'image/png': blob});
                        navigator.clipboard.write([item]).catch(err => console.log(this.t('clipboard.copyError'), err));
                    }
                });
            }
        } catch (err) {
            console.log(this.t('clipboard.notSupported'));
        }
    }
    
    paste() {
        if (this.clipboard) {
            this.pasteFromClipboard(this.clipboard.canvas);
        }
    }

    pasteFromClipboard(source) {
        const layer = this.createNewLayer(this.t('layer.pastedImage'));
        const fit = this.getImageFit(source.width, source.height);
        layer.ctx.drawImage(source, fit.offsetX, fit.offsetY, fit.width, fit.height);
        this.renderAllLayers();
        this.saveState();
    }
    
    handlePaste(e) {
        e.preventDefault();
        const items = e.clipboardData.items;
        let found = false;

        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                found = true;
                const blob = item.getAsFile();
                const url = URL.createObjectURL(blob);
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    this.pasteFromClipboard(canvas);
                    URL.revokeObjectURL(url);
                };
                img.src = url;
            }
        }

        // Fallback to internal clipboard if no image in system clipboard
        if (!found && this.clipboard) {
            this.pasteFromClipboard(this.clipboard.canvas);
        }
    }

    handleDropImage(e) {
        const files = e.dataTransfer.files;
        for (let file of files) {
            if (file.type.indexOf('image') !== -1) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const layer = this.createNewLayer(file.name);
                        const fit = this.getImageFit(img.width, img.height);
                        layer.ctx.drawImage(img, fit.offsetX, fit.offsetY, fit.width, fit.height);
                        this.renderAllLayers();
                        this.saveState();
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    }
    
    // ====================
    // RECORTAR
    // ====================

    drawCropPreview(x, y) {
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.tempCtx.strokeStyle = '#ffffff';
        this.tempCtx.lineWidth = 1;
        this.tempCtx.setLineDash([5, 5]);
        this.tempCtx.strokeRect(this.startX, this.startY, x - this.startX, y - this.startY);
        this.tempCtx.setLineDash([]);
    }

    startCrop(x, y) {
        this.cropStart = {x, y};
    }
    
    finalizeCrop(x, y) {
        if (!this.cropStart) return;
        
        const minX = Math.min(this.cropStart.x, x);
        const minY = Math.min(this.cropStart.y, y);
        const w = Math.abs(x - this.cropStart.x);
        const h = Math.abs(y - this.cropStart.y);
        
        if (w < 10 || h < 10) return;
        
        // Recortar todas las capas
        this.layers.forEach(layer => {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tctx = tempCanvas.getContext('2d');
            tctx.drawImage(layer.canvas, -minX, -minY);
            
            layer.canvas.width = w;
            layer.canvas.height = h;
            layer.ctx.drawImage(tempCanvas, 0, 0);
        });
        
        this.canvasWidth = w;
        this.canvasHeight = h;
        this.resizeCanvas();
        this.saveState();
        
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.cropStart = null;
    }
    
    // ====================
    // TEXTO
    // ====================

    drawTextPreview(x, y) {
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.tempCtx.strokeStyle = '#007acc';
        this.tempCtx.lineWidth = 1;
        this.tempCtx.setLineDash([5, 5]);
        const minX = Math.min(this.startX, x);
        const minY = Math.min(this.startY, y);
        const w = Math.abs(x - this.startX);
        const h = Math.abs(y - this.startY);
        this.tempCtx.strokeRect(minX, minY, w, h);
        this.tempCtx.setLineDash([]);
    }

    finalizeText(x, y) {
        let minX = Math.min(this.startX, x);
        let minY = Math.min(this.startY, y);
        let w = Math.abs(x - this.startX);
        let h = Math.abs(y - this.startY);

        // Click without drag - use default size
        if (w < 10 && h < 10) {
            w = 200;
            h = 60;
        }

        this.textBounds = { x: minX, y: minY, width: w, height: h };

        // Draw dashed border for the text area
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.tempCtx.strokeStyle = '#007acc';
        this.tempCtx.lineWidth = 1;
        this.tempCtx.setLineDash([5, 5]);
        this.tempCtx.strokeRect(minX, minY, w, h);
        this.tempCtx.setLineDash([]);

        this.showTextInput('');
        this.showFontsDialog();
        this.textModeActive = true;
    }

    showTextInput(existingText) {
        const container = document.getElementById('text-input-container');
        const input = document.getElementById('text-input');

        container.style.display = 'block';
        container.style.left = (this.textBounds.x * this.zoom) + 'px';
        container.style.top = (this.textBounds.y * this.zoom) + 'px';
        container.style.width = (this.textBounds.width * this.zoom) + 'px';
        container.style.height = (this.textBounds.height * this.zoom) + 'px';

        input.value = existingText || '';
        input.style.width = '100%';
        input.style.height = '100%';
        this.syncTextareaFont();
        input.focus();
    }

    syncTextareaFont() {
        const input = document.getElementById('text-input');
        const font = document.getElementById('text-font').value;
        const size = parseInt(document.getElementById('text-size').value) || 12;
        const bold = document.getElementById('text-bold').classList.contains('active');
        const italic = document.getElementById('text-italic').classList.contains('active');
        const underline = document.getElementById('text-underline').classList.contains('active');
        const vertical = document.getElementById('text-vertical').classList.contains('active');

        input.style.fontFamily = font;
        input.style.fontSize = size + 'px';
        input.style.fontWeight = bold ? 'bold' : 'normal';
        input.style.fontStyle = italic ? 'italic' : 'normal';
        input.style.textDecoration = underline ? 'underline' : 'none';
        input.style.writingMode = vertical ? 'vertical-rl' : 'horizontal-tb';
        input.style.color = this.getActiveColor();
        input.style.textOrientation = vertical ? 'mixed' : 'initial';
    }

    applyText() {
        const input = document.getElementById('text-input');
        const text = input.value;

        if (text && this.textBounds) {
            const font = document.getElementById('text-font').value;
            const size = parseInt(document.getElementById('text-size').value) || 12;
            const bold = document.getElementById('text-bold').classList.contains('active');
            const italic = document.getElementById('text-italic').classList.contains('active');
            const underline = document.getElementById('text-underline').classList.contains('active');
            const vertical = document.getElementById('text-vertical').classList.contains('active');

            if (this.editingTextId) {
                // Re-editing existing text — update in place
                const textObj = this.textObjects.find(t => t.id === this.editingTextId);
                if (textObj) {
                    const layerIndex = this.layers.findIndex(l => l.id === textObj.layerId);
                    if (layerIndex !== -1) {
                        const layer = this.layers[layerIndex];
                        // Clear the layer's canvas entirely (text is the only content)
                        layer.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                        // Update text data
                        textObj.text = text;
                        textObj.font = font;
                        textObj.size = size;
                        textObj.bold = bold;
                        textObj.italic = italic;
                        textObj.underline = underline;
                        textObj.vertical = vertical;
                        // Re-render with full text block
                        this.renderTextOnLayer(layer.ctx, text, this.textBounds, { font, size, bold, italic, underline, vertical, color: textObj.color });
                        this.renderAllLayers();
                        this.saveState();
                    }
                }
            } else {
                // New text — create a new layer
                const layer = this.createNewLayer(this.t('layer.textLayer'));
                this.renderTextOnLayer(layer.ctx, text, this.textBounds, { font, size, bold, italic, underline, vertical }); // color from getActiveColor()
                this.renderAllLayers();
                this.saveState();

                // Store text object for re-editing
                this.textObjects.push({
                    id: ++this.textIdCounter,
                    text: text,
                    x: this.textBounds.x,
                    y: this.textBounds.y,
                    width: this.textBounds.width,
                    height: this.textBounds.height,
                    font: font,
                    size: size,
                    bold: bold,
                    italic: italic,
                    underline: underline,
                    vertical: vertical,
                    color: this.getActiveColor(),
                    opacity: this.brushOpacity,
                    layerId: layer.id
                });
            }
        }

        this.textModeActive = false;
        this.editingTextId = null;
        this.cancelText();
    }

    renderTextOnLayer(ctx, text, bounds, opts) {
        ctx.fillStyle = opts.color || this.getActiveColor();
        ctx.strokeStyle = opts.color || this.getActiveColor();
        ctx.globalAlpha = this.brushOpacity / 100;

        const fontStyle = opts.italic ? 'italic ' : '';
        const fontWeight = opts.bold ? 'bold ' : '';
        ctx.font = `${fontStyle}${fontWeight}${opts.size}px ${opts.font}`;
        ctx.textBaseline = 'top';

        const padding = 4;
        let x = bounds.x + padding;
        let y = bounds.y + padding;

        if (opts.vertical) {
            const charSpacing = opts.size + 2;
            for (let char of text) {
                if (char === '\n') {
                    x += opts.size + 6;
                    y = bounds.y + padding;
                    continue;
                }
                ctx.fillText(char, x, y);
                if (opts.underline) {
                    const charW = ctx.measureText(char).width;
                    ctx.beginPath();
                    ctx.moveTo(x + charW + 1, y);
                    ctx.lineTo(x + charW + 1, y + opts.size);
                    ctx.stroke();
                }
                y += charSpacing;
                if (y > bounds.y + bounds.height - padding - opts.size) {
                    x += opts.size + 6;
                    y = bounds.y + padding;
                }
            }
        } else {
            const maxWidth = bounds.width - padding * 2;
            const lines = [];
            let line = '';
            for (let char of text) {
                if (char === '\n') {
                    lines.push(line);
                    line = '';
                    continue;
                }
                const testLine = line + char;
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && line.length > 0) {
                    lines.push(line);
                    line = char;
                } else {
                    line = testLine;
                }
            }
            lines.push(line);

            const lineHeight = opts.size * 1.4;
            for (let i = 0; i < lines.length; i++) {
                const lineY = y + i * lineHeight;
                ctx.fillText(lines[i], x, lineY);
                if (opts.underline) {
                    const lineW = ctx.measureText(lines[i]).width;
                    ctx.beginPath();
                    ctx.moveTo(x, lineY + opts.size + 2);
                    ctx.lineTo(x + lineW, lineY + opts.size + 2);
                    ctx.stroke();
                }
            }
        }

        ctx.textBaseline = 'alphabetic';
        ctx.globalAlpha = 1;
    }

    cancelText() {
        document.getElementById('text-input-container').style.display = 'none';
        document.getElementById('dialog-text').style.display = 'none';
        document.getElementById('text-input').value = '';
        this.textBounds = null;
        this.editingTextId = null;
        this.textModeActive = false;
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        ['text-bold', 'text-italic', 'text-underline', 'text-vertical'].forEach(id => {
            document.getElementById(id).classList.remove('active');
        });
    }

    findTextObjectAt(x, y) {
        return this.textObjects.find(obj =>
            x >= obj.x && x <= obj.x + obj.width &&
            y >= obj.y && y <= obj.y + obj.height
        );
    }

    findTextObjectByLayerId(layerId) {
        return this.textObjects.find(obj => obj.layerId === layerId);
    }

    loadTextForEditing(textObj) {
        this.editingTextId = textObj.id;
        this.textBounds = {
            x: textObj.x,
            y: textObj.y,
            width: textObj.width,
            height: textObj.height
        };

        // Activate the text's layer
        const layerIdx = this.layers.findIndex(l => l.id === textObj.layerId);
        if (layerIdx !== -1) {
            this.setActiveLayer(layerIdx);
        }

        // Draw dashed border
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.tempCtx.strokeStyle = '#007acc';
        this.tempCtx.lineWidth = 1;
        this.tempCtx.setLineDash([5, 5]);
        this.tempCtx.strokeRect(textObj.x, textObj.y, textObj.width, textObj.height);
        this.tempCtx.setLineDash([]);

        // Show text input with existing content
        this.showTextInput(textObj.text);

        // Restore font settings in the Fonts dialog
        document.getElementById('text-font').value = textObj.font;
        document.getElementById('text-size').value = textObj.size;
        if (textObj.bold) document.getElementById('text-bold').classList.add('active');
        if (textObj.italic) document.getElementById('text-italic').classList.add('active');
        if (textObj.underline) document.getElementById('text-underline').classList.add('active');
        if (textObj.vertical) document.getElementById('text-vertical').classList.add('active');
        // Sync textarea to the restored settings (showTextInput synced with defaults)
        this.syncTextareaFont();

        this.showFontsDialog();
        this.textModeActive = true;
    }

    showFontsDialog() {
        const dialog = document.getElementById('dialog-text');
        dialog.style.display = 'block';
    }

    // ====================
    // LANGUAGE
    // ====================

    t(key) {
        const lang = TRANSLATIONS[this.currentLang];
        return lang && lang[key] !== undefined ? lang[key] : key;
    }

    setLanguage(lang) {
        this.currentLang = lang;
        this.applyTranslations();

        // Update status bar tool name dynamically
        const toolNames = {};
        for (const key of Object.keys(TRANSLATIONS.es)) {
            if (key.startsWith('tools.')) {
                toolNames[key.slice(6)] = this.t(key);
            }
        }
        document.getElementById('status-tool').textContent =
            this.t('status.tool') + ': ' + (toolNames[this.currentTool] || this.currentTool);
    }

    applyTranslations() {
        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = this.t(key);
        });

        // Update all elements with data-i18n-title (tooltips)
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            el.title = this.t(key);
        });

        // Update all elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            el.placeholder = this.t(key);
        });
    }

    initFontsDrag() {
        const header = document.getElementById('fonts-header');
        const dialog = document.getElementById('dialog-text');

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('#fonts-header') !== header) return;
            this.isDraggingFonts = true;
            const rect = dialog.getBoundingClientRect();
            this.fontsDragOffsetX = e.clientX - rect.left;
            this.fontsDragOffsetY = e.clientY - rect.top;
            dialog.style.cursor = 'move';
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDraggingFonts) return;
            dialog.style.left = (e.clientX - this.fontsDragOffsetX) + 'px';
            dialog.style.top = (e.clientY - this.fontsDragOffsetY) + 'px';
            dialog.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (this.isDraggingFonts) {
                this.isDraggingFonts = false;
                dialog.style.cursor = '';
            }
        });
    }
    
    // ====================
    // HISTORIAL (DESHACER/REHACER)
    // ====================
    
    saveState() {
        this.historyStep++;
        if (this.historyStep < this.history.length) {
            this.history.length = this.historyStep;
        }
        
        const state = this.layers.map(layer => {
            const canvas = document.createElement('canvas');
            canvas.width = layer.canvas.width;
            canvas.height = layer.canvas.height;
            canvas.getContext('2d').drawImage(layer.canvas, 0, 0);
            return {
                name: layer.name,
                canvas: canvas,
                visible: layer.visible,
                opacity: layer.opacity
            };
        });
        
        this.history.push(state);
        
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.historyStep--;
        }
    }
    
    undo() {
        if (this.historyStep > 0) {
            this.historyStep--;
            this.restoreState(this.history[this.historyStep]);
        }
    }
    
    redo() {
        if (this.historyStep < this.history.length - 1) {
            this.historyStep++;
            this.restoreState(this.history[this.historyStep]);
        }
    }
    
    restoreState(state) {
        this.layers = state.map(s => ({
            id: ++this.layerIdCounter,
            name: s.name,
            canvas: s.canvas,
            ctx: s.canvas.getContext('2d'),
            visible: s.visible,
            opacity: s.opacity,
            locked: false
        }));
        
        this.activeLayerIndex = 0;
        this.renderAllLayers();
        this.updateLayersPanel();
    }
    
    // ====================
    // ARCHIVOS
    // ====================
    
    showNewDialog() {
        document.getElementById('dialog-new').style.display = 'flex';
    }
    
    hideNewDialog() {
        document.getElementById('dialog-new').style.display = 'none';
    }
    
    createNewDocument() {
        const width = parseInt(document.getElementById('new-width').value);
        const height = parseInt(document.getElementById('new-height').value);
        const bg = document.getElementById('new-bg').value;
        
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.layers = [];
        this.layerIdCounter = 0;
        this.history = [];
        this.historyStep = -1;
        
        this.resizeCanvas();
        this.createNewLayer(this.t('layer.defaultName'));
        
        if (bg !== 'transparent') {
            const layer = this.getActiveLayer();
            layer.ctx.fillStyle = bg === 'white' ? '#ffffff' : '#000000';
            layer.ctx.fillRect(0, 0, width, height);
            this.renderAllLayers();
            this.saveState();
        }
        
        this.hideNewDialog();
    }
    
    openImage() {
        document.getElementById('file-input').click();
    }
    
    loadImage(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const layer = this.createNewLayer(file.name);
                const fit = this.getImageFit(img.width, img.height);
                layer.ctx.drawImage(img, fit.offsetX, fit.offsetY, fit.width, fit.height);
                this.renderAllLayers();
                this.saveState();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);

        e.target.value = '';
    }
    
    saveImage(format) {
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = this.canvasWidth;
        exportCanvas.height = this.canvasHeight;
        const ctx = exportCanvas.getContext('2d');
        
        if (format === 'jpg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
        
        this.layers.forEach(layer => {
            if (layer.visible) {
                ctx.globalAlpha = layer.opacity;
                ctx.drawImage(layer.canvas, 0, 0);
            }
        });
        
        const link = document.createElement('a');
        link.download = `imagen.${format}`;
        link.href = exportCanvas.toDataURL(`image/${format}`);
        link.click();
    }
    
    exportLayer() {
        const layer = this.getActiveLayer();
        if (!layer) return;
        
        const link = document.createElement('a');
        link.download = `${layer.name}.png`;
        link.href = layer.canvas.toDataURL();
        link.click();
    }
    
    // ====================
    // ZOOM Y VISTA
    // ====================
    
    zoomIn() {
        this.zoom = Math.min(this.zoom * 1.2, 5);
        this.applyZoom();
    }
    
    zoomOut() {
        this.zoom = Math.max(this.zoom / 1.2, 0.1);
        this.applyZoom();
    }
    
    zoomReset() {
        this.zoom = 1;
        this.applyZoom();
    }
    
    applyZoom() {
        this.wrapper.style.transform = `scale(${this.zoom})`;
        document.getElementById('status-zoom').textContent = `Zoom: ${Math.round(this.zoom * 100)}%`;
    }
    
    toggleGrid() {
        this.showGrid = !this.showGrid;
        this.wrapper.classList.toggle('show-grid', this.showGrid);
    }
    
    // ====================
    // ATAJOS DE TECLADO
    // ====================
    
    handleKeyboard(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) this.redo();
                    else this.undo();
                    break;
                case 'y':
                    e.preventDefault();
                    this.redo();
                    break;
                case 'c':
                    e.preventDefault();
                    this.copy();
                    break;
                case 'v':
                    // Don't prevent default — let the paste event handle all clipboard data
                    break;
                case 'x':
                    e.preventDefault();
                    this.cut();
                    break;
                case 'a':
                    e.preventDefault();
                    this.selectAll();
                    break;
                case 'i':
                    e.preventDefault();
                    this.invertColors();
                    break;
                case 'o':
                    e.preventDefault();
                    this.openImage();
                    break;
                case 's':
                    e.preventDefault();
                    this.saveImage('png');
                    break;
            }
        } else if (this.textModeActive) {
            // When editing text, only allow Enter and Escape
            switch(e.key.toLowerCase()) {
                case 'enter':
                    if (this.currentTool === 'polygon' && this.polygonPoints.length >= 3) {
                        this.finalizePolygon();
                    }
                    break;
                case 'escape':
                    if (this.textBounds) {
                        this.cancelText();
                    }
                    this.deselect();
                    break;
            }
        } else {
            // Atajos de herramientas
            switch(e.key.toLowerCase()) {
                case 'b': this.setTool('brush'); break;
                case 'v': this.setTool('selector'); break;
                case 'p': this.setTool('pencil'); break;
                case 'e': this.setTool('eraser'); break;
                case 'f': this.setTool('bucket'); break;
                case 'i': this.setTool('picker'); break;
                case 'l': this.setTool('line'); break;
                case 'r': this.setTool('crop'); break;
                case 'c': this.setTool('circle'); break;
                case 'u': this.setTool('round-rect'); break;
                case 'j': this.setTool('ellipse'); break;
                case 'o': this.setTool('polygon'); break;
                case 'm': this.setTool('select-rect'); break;
                case 's': this.setTool('select-lasso'); break;
                case 'w': this.setTool('select-wand'); break;
                case 't': this.setTool('text'); break;
                case 'x':
                    const isPrimary = document.getElementById('color-primary').closest('.color-picker-wrapper').classList.contains('selected');
                    this.selectColorPicker(isPrimary ? 'secondary' : 'primary');
                    break;
                case 'enter':
                    if (this.currentTool === 'polygon' && this.polygonPoints.length >= 3) {
                        this.finalizePolygon();
                    }
                    break;
                case 'escape':
                    if (this.textBounds) {
                        this.cancelText();
                    }
                    this.deselect();
                    this.polygonPoints = [];
                    this.lassoPoints = [];
                    this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                    break;
            }
        }
    }
    
    updateUI() {
        document.getElementById('status-size').textContent =
            `${this.t('status.size')}: ${this.canvasWidth} x ${this.canvasHeight}`;
    }

    showAbout() {
        document.getElementById('about-version-number').textContent = APP_VERSION;
        document.getElementById('dialog-about').style.display = 'flex';
    }

    hideAbout() {
        document.getElementById('dialog-about').style.display = 'none';
    }

    invertColors() {
        const layer = this.getActiveLayer();
        if (!layer) return;

        const imageData = layer.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i]     = 255 - data[i];     // R
            data[i + 1] = 255 - data[i + 1]; // G
            data[i + 2] = 255 - data[i + 2]; // B
            // data[i + 3] alpha unchanged
        }

        layer.ctx.putImageData(imageData, 0, 0);
        this.renderAllLayers();
        this.saveState();
    }

    // ====================
    // FLIP / ROTATE
    // ====================

    getContentBounds() {
        const layer = this.getActiveLayer();
        if (!layer) return null;

        // If there's a selection, use it
        if (this.selection) {
            return { x: this.selection.x, y: this.selection.y, width: this.selection.width, height: this.selection.height };
        }

        // Auto-detect non-transparent content bounds
        const imageData = layer.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        const data = imageData.data;
        let minX = this.canvasWidth, minY = this.canvasHeight, maxX = 0, maxY = 0;

        for (let y = 0; y < this.canvasHeight; y++) {
            for (let x = 0; x < this.canvasWidth; x++) {
                if (data[(y * this.canvasWidth + x) * 4 + 3] > 0) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        if (minX > maxX) return null; // Empty layer

        return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
    }

    flipVertical() {
        const bounds = this.getContentBounds();
        if (!bounds) return;
        this.deselect();

        const layer = this.getActiveLayer();
        // Extract content within bounds
        const temp = document.createElement('canvas');
        temp.width = bounds.width;
        temp.height = bounds.height;
        const tctx = temp.getContext('2d');
        tctx.drawImage(layer.canvas, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);

        // Clear the original area
        layer.ctx.clearRect(bounds.x, bounds.y, bounds.width, bounds.height);

        // Flip and redraw within the same bounds
        layer.ctx.save();
        layer.ctx.translate(bounds.x, bounds.y + bounds.height);
        layer.ctx.scale(1, -1);
        layer.ctx.drawImage(temp, 0, 0);
        layer.ctx.restore();

        this.renderAllLayers();
        this.saveState();
    }

    flipHorizontal() {
        const bounds = this.getContentBounds();
        if (!bounds) return;
        this.deselect();

        const layer = this.getActiveLayer();
        const temp = document.createElement('canvas');
        temp.width = bounds.width;
        temp.height = bounds.height;
        const tctx = temp.getContext('2d');
        tctx.drawImage(layer.canvas, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);

        layer.ctx.clearRect(bounds.x, bounds.y, bounds.width, bounds.height);

        layer.ctx.save();
        layer.ctx.translate(bounds.x + bounds.width, bounds.y);
        layer.ctx.scale(-1, 1);
        layer.ctx.drawImage(temp, 0, 0);
        layer.ctx.restore();

        this.renderAllLayers();
        this.saveState();
    }

    rotateLeft() {
        const bounds = this.getContentBounds();
        if (!bounds) return;
        this.deselect();

        const layer = this.getActiveLayer();
        // Extract content within bounds
        const temp = document.createElement('canvas');
        temp.width = bounds.width;
        temp.height = bounds.height;
        const tctx = temp.getContext('2d');
        tctx.drawImage(layer.canvas, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);

        layer.ctx.clearRect(bounds.x, bounds.y, bounds.width, bounds.height);

        // Rotate 90° CCW and draw centered at bounds center
        layer.ctx.save();
        layer.ctx.translate(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        layer.ctx.rotate(-Math.PI / 2);
        layer.ctx.drawImage(temp, -bounds.width / 2, -bounds.height / 2);
        layer.ctx.restore();

        this.renderAllLayers();
        this.saveState();
    }

    rotateRight() {
        const bounds = this.getContentBounds();
        if (!bounds) return;
        this.deselect();

        const layer = this.getActiveLayer();
        const temp = document.createElement('canvas');
        temp.width = bounds.width;
        temp.height = bounds.height;
        const tctx = temp.getContext('2d');
        tctx.drawImage(layer.canvas, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);

        layer.ctx.clearRect(bounds.x, bounds.y, bounds.width, bounds.height);

        layer.ctx.save();
        layer.ctx.translate(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        layer.ctx.rotate(Math.PI / 2);
        layer.ctx.drawImage(temp, -bounds.width / 2, -bounds.height / 2);
        layer.ctx.restore();

        this.renderAllLayers();
        this.saveState();
    }

    // ====================
    // SELECTOR / MOVER
    // ====================

    isInsideSelection(x, y) {
        if (!this.selection) return false;
        return x >= this.selection.x &&
               x <= this.selection.x + this.selection.width &&
               y >= this.selection.y &&
               y <= this.selection.y + this.selection.height;
    }

    findLayerAtPoint(x, y) {
        for (let i = this.layers.length - 1; i >= 0; i--) {
            const layer = this.layers[i];
            if (!layer.visible) continue;
            const pixel = layer.ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
            if (pixel[3] > 0) return layer;
        }
        return null;
    }

    captureSelectionContent() {
        if (!this.selection) return;

        const composite = document.createElement('canvas');
        composite.width = this.canvasWidth;
        composite.height = this.canvasHeight;
        const ctx = composite.getContext('2d');

        this.layers.forEach(layer => {
            if (layer.visible) {
                ctx.drawImage(layer.canvas, 0, 0);
            }
        });

        this.moveCanvas = document.createElement('canvas');
        this.moveCanvas.width = this.selection.width;
        this.moveCanvas.height = this.selection.height;
        const mctx = this.moveCanvas.getContext('2d');
        mctx.drawImage(composite,
            this.selection.x, this.selection.y,
            this.selection.width, this.selection.height,
            0, 0,
            this.selection.width, this.selection.height
        );
    }

    captureLayerContent(layer) {
        this.moveCanvas = document.createElement('canvas');
        this.moveCanvas.width = this.canvasWidth;
        this.moveCanvas.height = this.canvasHeight;
        const mctx = this.moveCanvas.getContext('2d');
        mctx.drawImage(layer.canvas, 0, 0);
    }

    drawMovePreview(x, y) {
        if (!this.selection || !this.moveCanvas) return;

        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        const newX = x - this.moveOffsetX;
        const newY = y - this.moveOffsetY;

        this.tempCtx.drawImage(this.moveCanvas, newX, newY);

        // Update selection border to follow
        this.selectionCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.selectionCtx.strokeStyle = '#007acc';
        this.selectionCtx.lineWidth = 2;
        this.selectionCtx.setLineDash([5, 5]);
        this.selectionCtx.strokeRect(newX, newY, this.selection.width, this.selection.height);
        this.selectionCtx.setLineDash([]);
    }

    drawLayerMovePreview(x, y) {
        if (!this.moveCanvas) return;

        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        const newX = x - this.moveOffsetX;
        const newY = y - this.moveOffsetY;

        this.tempCtx.drawImage(this.moveCanvas, newX, newY);
    }

    finalizeMove(x, y) {
        if (!this.selection || !this.moveCanvas) return;

        const newX = x - this.moveOffsetX;
        const newY = y - this.moveOffsetY;

        // Clear original area from all visible layers
        this.layers.forEach(layer => {
            if (layer.visible) {
                layer.ctx.clearRect(
                    this.selection.x,
                    this.selection.y,
                    this.selection.width,
                    this.selection.height
                );
            }
        });

        // Paste content at new position on active layer
        const layer = this.getActiveLayer();
        layer.ctx.drawImage(this.moveCanvas, newX, newY);

        // Update selection to new position
        this.selection.x = newX;
        this.selection.y = newY;

        this.moveCanvas = null;

        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.renderAllLayers();
        this.drawSelectionBorder();
        this.saveState();
    }

    finalizeLayerMove(x, y) {
        if (!this.moveCanvas || !this.moveLayer) return;

        const newX = x - this.moveOffsetX;
        const newY = y - this.moveOffsetY;

        // Clear the source layer completely
        this.moveLayer.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Redraw content at new position (may be partially or fully off-canvas)
        this.moveLayer.ctx.drawImage(this.moveCanvas, newX, newY);

        this.moveCanvas = null;
        this.moveLayer = null;

        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.renderAllLayers();
        this.saveState();
    }

    clearCanvas() {
        // Remove all layers and create a single clean default layer
        this.layers = [];
        this.layerIdCounter = 0;
        this.history = [];
        this.historyStep = -1;
        this.selection = null;
        this.selectionCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.tempCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.deselect();

        this.createNewLayer(this.t('layer.defaultName'));
        this.renderAllLayers();
        this.updateLayersPanel();
        this.saveState();
    }

    setBackground(bgId) {
        // Toggle active class
        document.querySelectorAll('.bg-btn').forEach(btn => {
            btn.classList.toggle('active', btn.id === bgId);
        });

        const layer = this.getActiveLayer();
        if (!layer) return;

        layer.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        if (bgId === 'bg-white') {
            layer.ctx.fillStyle = '#ffffff';
            layer.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        } else if (bgId === 'bg-black') {
            layer.ctx.fillStyle = '#000000';
            layer.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
        // bg-transparent: just cleared, nothing to fill

        // Update layer preview thumbnails
        this.renderAllLayers();
        this.updateLayersPanel();
        this.saveState();
    }

    getImageFit(imgWidth, imgHeight) {
        const scale = Math.min(this.canvasWidth / imgWidth, this.canvasHeight / imgHeight);
        const width = Math.floor(imgWidth * scale);
        const height = Math.floor(imgHeight * scale);
        return {
            width,
            height,
            offsetX: Math.floor((this.canvasWidth - width) / 2),
            offsetY: Math.floor((this.canvasHeight - height) / 2)
        };
    }

    selectColorPicker(which) {
        document.getElementById('color-primary').closest('.color-picker-wrapper').classList.toggle('selected', which === 'primary');
        document.getElementById('color-secondary').closest('.color-picker-wrapper').classList.toggle('selected', which === 'secondary');
    }

    getActiveColor() {
        const primarySelected = document.getElementById('color-primary').closest('.color-picker-wrapper').classList.contains('selected');
        return primarySelected ? this.primaryColor : this.secondaryColor;
    }
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.paintApp = new PaintApp();
});
