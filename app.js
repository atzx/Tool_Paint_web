/**
 * Paint Pro - Aplicación de dibujo completa
 * Sistema de capas, herramientas de dibujo, selección, texto y más
 */

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
        
        // Inicialización
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.createNewLayer('Capa de fondo');
        this.saveState(); // Save initial blank state
        this.updateUI();
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
        
        document.getElementById('color-secondary').addEventListener('change', (e) => {
            this.secondaryColor = e.target.value;
            document.getElementById('preview-secondary').style.background = e.target.value;
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
        
        document.getElementById('btn-zoom-in').addEventListener('click', () => this.zoomIn());
        document.getElementById('btn-zoom-out').addEventListener('click', () => this.zoomOut());
        document.getElementById('btn-zoom-reset').addEventListener('click', () => this.zoomReset());
        document.getElementById('btn-toggle-grid').addEventListener('click', () => this.toggleGrid());
        
        // Layer buttons
        document.getElementById('btn-new-layer').addEventListener('click', () => this.addLayer());
        document.getElementById('btn-delete-layer').addEventListener('click', () => this.deleteLayer());
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
            name: name || `Capa ${this.layers.length + 1}`,
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
            alert('Debe mantener al menos una capa');
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
            item.onclick = () => this.setActiveLayer(index);
            
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
        
        const toolNames = {
            'brush': 'Pincel',
            'pencil': 'Lápiz',
            'eraser': 'Borrador',
            'bucket': 'Rellenar',
            'picker': 'Cuentagotas',
            'line': 'Línea',
            'rect': 'Rectángulo',
            'circle': 'Círculo',
            'polygon': 'Polígono',
            'select-rect': 'Selección rectangular',
            'select-lasso': 'Lazo',
            'select-wand': 'Varita mágica',
            'crop': 'Recortar',
            'text': 'Texto'
        };
        
        document.getElementById('status-tool').textContent = 
            'Herramienta: ' + (toolNames[tool] || tool);
        
        // Reset polygon points and lasso points
        this.polygonPoints = [];
        this.lassoPoints = [];
        
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
            'pencil': 'crosshair',
            'eraser': 'cell',
            'bucket': 'pointer',
            'picker': 'crosshair',
            'text': 'text',
            'select-rect': 'crosshair',
            'select-lasso': 'crosshair',
            'select-wand': 'crosshair',
            'crop': 'crosshair'
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
        
        const layer = this.getActiveLayer();
        if (!layer || !layer.visible || layer.locked) return;
        
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
        }
    }
    
    handleMouseMove(e) {
        const pos = this.getMousePos(e);
        
        document.getElementById('status-position').textContent = 
            `Posición: ${Math.floor(pos.x)}, ${Math.floor(pos.y)}`;
        
        if (!this.isDrawing) return;
        
        switch(this.currentTool) {
            case 'brush':
            case 'pencil':
            case 'eraser':
                this.draw(pos.x, pos.y);
                break;
            case 'line':
            case 'rect':
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
            ctx.strokeStyle = this.primaryColor;
            ctx.fillStyle = this.primaryColor;
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
            this.tempCtx.strokeStyle = this.primaryColor;
            this.tempCtx.fillStyle = this.primaryColor;
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
            case 'circle':
                const cx = (this.startX + x) / 2;
                const cy = (this.startY + y) / 2;
                const cr = Math.min(Math.abs(x - this.startX), Math.abs(y - this.startY)) / 2;
                this.tempCtx.arc(cx, cy, cr, 0, Math.PI * 2);
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

    drawShapeFinal(x, y) {
        const layer = this.getActiveLayer();
        const ctx = layer.ctx;
        
        ctx.strokeStyle = this.primaryColor;
        ctx.fillStyle = this.primaryColor;
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
            case 'circle':
                const cx = (this.startX + x) / 2;
                const cy = (this.startY + y) / 2;
                const cr = Math.min(Math.abs(x - this.startX), Math.abs(y - this.startY)) / 2;
                ctx.arc(cx, cy, cr, 0, Math.PI * 2);
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
        this.tempCtx.fillStyle = this.primaryColor;
        this.tempCtx.beginPath();
        this.tempCtx.arc(x, y, 3, 0, Math.PI * 2);
        this.tempCtx.fill();
        
        if (this.polygonPoints.length > 1) {
            const prev = this.polygonPoints[this.polygonPoints.length - 2];
            this.tempCtx.strokeStyle = this.primaryColor;
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
        
        ctx.strokeStyle = this.primaryColor;
        ctx.fillStyle = this.primaryColor;
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
        
        const fillColor = this.hexToRgb(this.primaryColor);
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
                        navigator.clipboard.write([item]).catch(err => console.log('No se pudo copiar al portapapeles:', err));
                    }
                });
            }
        } catch (err) {
            console.log('API de portapapeles no soportada');
        }
    }
    
    paste() {
        if (this.clipboard) {
            this.pasteFromClipboard(this.clipboard.canvas);
        }
    }
    
    pasteFromClipboard(canvas) {
        // Create new layer for pasted image
        const newLayer = this.createNewLayer('Imagen pegada');
        
        // Resize layer canvas if needed
        if (canvas.width > this.canvasWidth || canvas.height > this.canvasHeight) {
            newLayer.canvas.width = canvas.width;
            newLayer.canvas.height = canvas.height;
            newLayer.ctx.drawImage(canvas, 0, 0);
            
            // Resize main canvas to fit
            this.canvasWidth = Math.max(this.canvasWidth, canvas.width);
            this.canvasHeight = Math.max(this.canvasHeight, canvas.height);
            this.resizeCanvas();
        } else {
            // Center the pasted image
            const offsetX = Math.floor((this.canvasWidth - canvas.width) / 2);
            const offsetY = Math.floor((this.canvasHeight - canvas.height) / 2);
            newLayer.ctx.drawImage(canvas, offsetX, offsetY);
        }
        
        this.renderAllLayers();
        this.saveState();
    }
    
    handlePaste(e) {
        e.preventDefault();
        const items = e.clipboardData.items;
        
        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
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
        input.style.color = this.primaryColor;
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
                        this.renderTextOnLayer(layer.ctx, text, this.textBounds, { font, size, bold, italic, underline, vertical });
                        this.renderAllLayers();
                        this.saveState();
                    }
                }
            } else {
                // New text — create a new layer
                const layer = this.createNewLayer('Texto');
                this.renderTextOnLayer(layer.ctx, text, this.textBounds, { font, size, bold, italic, underline, vertical });
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
                    color: this.primaryColor,
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
        ctx.fillStyle = this.primaryColor;
        ctx.strokeStyle = this.primaryColor;
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
        this.createNewLayer('Capa de fondo');
        
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
                // Crear nueva capa para la imagen
                const layer = this.createNewLayer(file.name);
                layer.canvas.width = img.width;
                layer.canvas.height = img.height;
                layer.ctx.drawImage(img, 0, 0);
                
                // Ajustar tamaño del canvas si es necesario
                if (img.width > this.canvasWidth || img.height > this.canvasHeight) {
                    this.canvasWidth = Math.max(this.canvasWidth, img.width);
                    this.canvasHeight = Math.max(this.canvasHeight, img.height);
                    this.resizeCanvas();
                }
                
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
                    e.preventDefault();
                    this.paste();
                    break;
                case 'x':
                    e.preventDefault();
                    this.cut();
                    break;
                case 'a':
                    e.preventDefault();
                    this.selectAll();
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
                case 'p': this.setTool('pencil'); break;
                case 'e': this.setTool('eraser'); break;
                case 'f': this.setTool('bucket'); break;
                case 'i': this.setTool('picker'); break;
                case 'l': this.setTool('line'); break;
                case 'r': this.setTool('crop'); break;
                case 'c': this.setTool('circle'); break;
                case 'o': this.setTool('polygon'); break;
                case 'm': this.setTool('select-rect'); break;
                case 's': this.setTool('select-lasso'); break;
                case 'w': this.setTool('select-wand'); break;
                case 't': this.setTool('text'); break;
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
            `Tamaño: ${this.canvasWidth} x ${this.canvasHeight}`;
    }
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.paintApp = new PaintApp();
});
