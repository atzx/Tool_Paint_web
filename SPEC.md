# Paint Pro — Especificación Técnica

## Descripción General

Aplicación web de dibujo y edición de imágenes con sistema de capas múltiples, herramientas de dibujo vectorial y de píxeles, selección, texto con editor flotante, y soporte de exportación. Implementada completamente en vanilla JavaScript con Canvas API.

## Stack Tecnológico

- **HTML5** — Estructura semántica y canvas elements
- **CSS3** — Diseño con CSS Grid, tema oscuro, responsive design
- **JavaScript (ES6+)** — Lógica de la aplicación orientada a objetos (~2190 líneas)
- **Canvas API** — Renderizado de gráficos en 2D

## Arquitectura

### Clase Principal: `PaintApp`

Toda la aplicación se maneja desde una única clase `PaintApp` instanciada al cargar el DOM. No hay frameworks ni dependencias externas.

```
PaintApp
├── init()
│   ├── setupCanvas()        — Enlaza elementos del DOM
│   ├── setupEventListeners() — Todos los eventos de UI
│   ├── createNewLayer()     — Capa inicial
│   ├── saveState()          — Estado inicial para undo
│   └── updateUI()           — Barra de estado
├── Sistema de Capas
├── Herramientas de Dibujo
├── Herramientas de Formas
├── Herramientas de Selección y Mover
├── Herramienta de Texto
├── Sistema de Historial
├── Operaciones de Archivo (incl. drag-drop, paste)
├── Selector / Mover
├── Zoom y Vista
└── Atajos de Teclado
```

## Canvas Architecture

Cuatro capas de canvas superpuestas dentro de `#canvas-wrapper`:

```
┌─────────────────────────────────────┐
│  event-canvas (z-index: 10)        │ ← Captura eventos del mouse/touch
│  (position: absolute, transparent)  │
├─────────────────────────────────────┤
│  selection-canvas (z-index: 3)     │ ← Muestra bordes de selección
│  (pointer-events: none)             │
├─────────────────────────────────────┤
│  temp-canvas (z-index: 2)          │ ← Vistas previas temporales (formas, crop, move)
│  (pointer-events: none)             │
├─────────────────────────────────────┤
│  main-canvas (z-index: 1)          │ ← Renderizado final de todas las capas
│                                     │
└─────────────────────────────────────┘
```

Cada capa del usuario es un `<canvas>` en memoria renderizado secuencialmente en `main-canvas` mediante `renderAllLayers()`.

## Layout (CSS Grid)

```
┌───────────────┬──────────────────┬──────────────┐
│   menu-bar    │    menu-bar      │   menu-bar   │
│   (grid-area: menu)              │              │
├───────────────┼──────────────────┼──────────────┤
│   toolbar     │    workspace     │ layers-panel │
│   240px       │    1fr           │   220px      │
├───────────────┴──────────────────┴──────────────┤
│                  status-bar                      │
└─────────────────────────────────────────────────┘
```

Breakpoints responsive: 1024px (columnas se contraen), 768px (toolbar a 60px, títulos ocultos).

## Componentes UI

### Menú Superior (`#menu-bar`)
- **Archivo**: Nuevo, Abrir, Guardar (PNG/JPG), Exportar capa
- **Edición**: Deshacer/Rehacer, Cortar/Copiar/Pegar, Seleccionar todo/Deseleccionar
- **Ver**: Acercar/Alejar/Restablecer zoom, Mostrar/Ocultar cuadrícula

### Barra de Herramientas Lateral (`#toolbar`)
- **Herramientas**: Selector(V), Pincel(B), Lápiz(P), Borrador(E), Rellenar(F), Cuentagotas(I)
- **Formas**: Línea(L), Rectángulo(R), Rectángulo redondeado(U), Círculo(C), Elipse(J), Polígono(O)
- **Selección**: Rectangular(M), Lazo(S), Varita mágica(W), Recortar(R)
- **Texto**: Herramienta de texto(T)
- **Backgrounds**: Transparente, Blanco, Negro (rellenan la capa activa)
- **Propiedades**: Color principal/secundario, grosor, opacidad, relleno de formas, tolerancia de varita

### Panel de Capas (`#layers-panel`)
- Lista de capas con previsualización en miniatura
- Nombre de capa editable inline
- Controles de visibilidad
- Opacidad de capa individual (slider)
- Botones: Nueva capa (+), Eliminar capa (−), ✕ rojo para eliminar capa activa, Fusionar abajo

### Barra de Estado (`#status-bar`)
- Posición del cursor (x, y)
- Tamaño del documento
- Nivel de zoom
- Herramienta activa

## Funcionalidades Detalladas

### 1. Sistema de Capas

Cada capa es un objeto con:
```javascript
{
    id: number,
    name: string,
    canvas: HTMLCanvasElement,   // Canvas en memoria del tamaño del documento
    ctx: CanvasRenderingContext2D,
    visible: boolean,
    opacity: number (0-1),
    locked: boolean
}
```

Operaciones: crear, eliminar (mínimo 1 capa), seleccionar (activar), alternar visibilidad, ajustar opacidad, fusionar hacia abajo. Los objetos de texto se vinculan a una capa por ID para re-edición.

### 2. Herramientas de Dibujo y Formas

| Herramienta | Atajo | Comportamiento |
|------------|-------|---------------|
| Selector | V | Mover contenido de capas o selecciones libremente |
| Pincel | B | Trazo suave (lineCap: round, lineJoin: round) |
| Lápiz | P | Trazo duro (lineCap: butt, lineJoin: miter) |
| Borrador | E | Usa `destination-out` como composite operation |
| Relleno (Bucket) | F | Flood fill (BFS por pila) con reemplazo exacto de color |
| Cuentagotas | I | Toma el color del píxel en la capa activa |
| Línea | L | Trazo recto desde el punto inicial al final |
| Rectángulo | R | Rectángulo con opción de relleno |
| Rect. redondeado | U | Rectángulo con esquinas redondeadas vía `ctx.roundRect()` |
| Círculo | C | Círculo desde el centro (radio = distancia al punto inicial) |
| Elipse | J | Elipse vía `ctx.ellipse()` |
| Polígono | O | Click para añadir vértices; finalizar con Enter, doble clic, clic derecho, o cerrar cerca del primer punto |

Las formas muestran preview en `temp-canvas` durante el arrastre y se finalizan en `mouseup`. Soportan relleno opcional (`#fill-shape` checkbox).

### 3. Selector / Mover (Herramienta V)

Dos modos de operación:
- **Mover capa**: Click sobre píxeles no transparentes de cualquier capa visible → captura todo el contenido de esa capa y lo arrastra libremente, incluso fuera del canvas
- **Mover selección**: Si hay una selección activa, click dentro del área seleccionada → mueve solo el contenido seleccionado (compuesto de todas las capas visibles)

Métodos clave:
- `findLayerAtPoint(x, y)` — busca la capa visible más superior con píxel no transparente
- `captureLayerContent(layer)` — captura el canvas completo de la capa
- `captureSelectionContent()` — captura el área seleccionada de todas las capas visibles
- `finalizeLayerMove(x, y)` — borra la capa origen y redibuja en nueva posición
- `finalizeMove(x, y)` — borra el área original de todas las capas y pega en la activa

### 4. Herramientas de Selección

| Herramienta | Atajo | Comportamiento |
|------------|-------|---------------|
| Rectangular | M | Arrastrar para crear selección rectangular |
| Lazo | S | Arrastrar para crear selección a mano alzada (polígono cerrado de muchos puntos) |
| Varita mágica | W | Selección por color con tolerancia configurable (flood fill con umbral) |

La selección se almacena en `this.selection` con coordenadas, dimensiones y opcionalmente puntos de lazo. Se visualiza en `selection-canvas` con borde punteado azul `#007acc` con animación marching ants. Las operaciones Cortar/Copiar/Pegar actúan sobre el área seleccionada.

### 5. Herramienta de Texto

**Flujo de uso:**
1. Activar herramienta Texto (T)
2. Click y arrastrar en el canvas para definir el área del texto (o click sin arrastrar para crear área por defecto 200×60)
3. Aparece el editor inline (`#text-input-container`) superpuesto en el área definida
4. Se abre el diálogo flotante **Fonts** (no modal, arrastrable por el header)

**Diálogo Fonts** (`#dialog-text`, position: fixed, z-index: 2000):
- Selector de fuente (12 fuentes)
- Tamaño (input numérico 1–999, con datalist de presets)
- Botones toggle: **B** (bold), *I* (italic), <u>U</u> (underline), **V** (vertical writing mode con tooltip)
- Botones Apply / Cancel

**Comportamiento:**
- Cada creación de texto crea una nueva capa
- Los cambios en Fonts se reflejan en vivo en el textarea (`syncTextareaFont()`)
- Click en texto existente (o su capa) reabre Fonts para edición
- Atajos desactivados mientras textModeActive = true (solo Enter / Escape)
- El texto se renderiza rasterizado con `ctx.fillText()`, word-wrap horizontal o char-by-char en vertical

### 6. Recortar (Crop)

- Atajo: R
- Arrastrar para definir área de recorte (preview blanco punteado)
- Mínimo 10×10 píxeles
- Recorta todas las capas simultáneamente
- Redimensiona el documento al nuevo tamaño

### 7. Backgrounds

Tres botones en la barra de herramientas que operan sobre la capa activa:
- **Transparente**: Limpia la capa (`clearRect`)
- **Blanco**: Rellena con `#ffffff`
- **Negro**: Rellena con `#000000`

Usan `setBackground(bgId)` que alterna clase active, renderiza y guarda estado.

### 8. Sistema de Historial (Undo/Redo)

- Captura el estado completo de todas las capas en cada acción relevante
- Máximo 50 estados (`this.maxHistory`)
- Cada estado guarda un snapshot del canvas de cada capa (clonado vía `drawImage`)
- Undo: Ctrl+Z (y Shift+Ctrl+Z para redo)
- Redo: Ctrl+Y

### 9. Operaciones de Archivo

| Acción | Descripción |
|-------|------------|
| Nuevo | Diálogo con ancho, alto y color de fondo |
| Abrir | File picker para imágenes (crea nueva capa, imagen escalada al canvas) |
| Guardar PNG | Exporta combinación de capas visibles como PNG |
| Guardar JPG | Similar a PNG, con fondo blanco sólido |
| Exportar capa | Exporta solo la capa activa como PNG |

**Drag & Drop**: Arrastrar imágenes al workspace las abre en nuevas capas (escaladas al canvas). Indicador visual con outline punteado azul (`#workspace.drag-over`).

**Pegar desde portapapeles**: Cmd+V o menú Edición > Pegar. Acepta imágenes del sistema (cualquier tipo MIME image/*) en nueva capa escalada al canvas. También pega selecciones internas (copiadas dentro de la app) como fallback.

**Ajuste de imagen**: `getImageFit(imgWidth, imgHeight)` escala la imagen manteniendo relación de aspecto para que quepa dentro del canvas, centrada. Se usa en loadImage, pasteFromClipboard, handleDropImage.

### 10. Zoom y Vista

- Zoom con factor 1.2x (rango 0.1x – 5x)
- Aplicado mediante transformación CSS `scale()` en `#canvas-wrapper`
- Atajos: + (acercar), - (alejar), restablecer
- Cuadrícula overlay con CSS linear-gradient (toggle desde menú Ver)

### 11. Selección de Color

- Selector de color principal y secundario (inputs `type="color"`)
- Indicador visual azul (`#007acc`) en el wrapper del color seleccionado (clase `.selected`)
- **X**: Intercambia entre color primario y secundario
- `getActiveColor()` retorna el color activo según cuál wrapper tenga `.selected`
- Todos los dibujos (pincel, formas, texto, etc.) usan `getActiveColor()`

### 12. Atajos de Teclado

**Modificadores (Ctrl/Meta):**
| Atajo | Acción |
|-------|--------|
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Ctrl+Y | Redo |
| Ctrl+C | Copiar selección |
| Ctrl+V | Pegar (sistema clipboard o interno) |
| Ctrl+X | Cortar selección |
| Ctrl+A | Seleccionar todo |
| Ctrl+O | Abrir imagen |
| Ctrl+S | Guardar como PNG |

**Herramientas (sin modificador):**
| Tecla | Herramienta |
|-------|-------------|
| V | Selector |
| B | Pincel |
| P | Lápiz |
| E | Borrador |
| F | Rellenar |
| I | Cuentagotas |
| T | Texto |
| L | Línea |
| R | Rectángulo / Recortar |
| U | Rectángulo redondeado |
| C | Círculo |
| J | Elipse |
| O | Polígono |
| M | Selección rectangular |
| S | Lazo |
| W | Varita mágica |
| X | Intercambiar color primario/secundario |

**Otros:**
| Tecla | Acción |
|-------|--------|
| Enter | Finalizar polígono / Aplicar texto |
| Escape | Deseleccionar, cancelar texto, cancelar polígono/lazo |

**En modo texto** (`textModeActive = true`): solo Enter (aplicar) y Escape (cancelar) funcionan; el resto se ignoran.

### 13. Soporte Táctil

Convierte eventos touch a mouse events sintéticos para compatibilidad con dispositivos móviles.

## Archivos del Proyecto

| Archivo | Líneas | Propósito |
|---------|--------|-----------|
| `index.html` | 299 | Estructura HTML, toolbars, modales, diálogo Fonts flotante |
| `app.js` | 2192 | Lógica completa de la aplicación (clase PaintApp) |
| `style.css` | 828 | Estilos visuales, tema oscuro, responsive, animaciones |

## Estructura de app.js

```
Secciones principales (~2190 líneas):
├── Constructor (60 líneas)         — Estado global, inicialización
├── init() / setupCanvas()          — Arranque y canvas DOM
├── setupEventListeners() (170 lns) — Todos los eventos UI
├── Sistema de Capas (130 líneas)   — CRUD de capas, renderizado
├── Herramientas de Dibujo (280 lns) — setTool, mouse handlers, drawing
├── Polígono (60 líneas)            — Puntos, preview, finalización
├── Relleno Bucket (55 líneas)      — Flood fill algorithm
├── Cuentagotas (15 líneas)         — Pick color from canvas
├── Selección (120 líneas)          — Rect, lasso, selectAll, deselect
├── Varita mágica (60 líneas)       — Tolerance-based flood fill selection
├── Cortar/Copiar/Pegar (100 lns)   — Clipboard interno + sistema
├── Recortar (80 líneas)            — Crop tool con redimension
├── Texto (200 líneas)              — textBounds, Fonts dialog, renderizado
├── Historial (60 líneas)           — saveState, undo, redo
├── Archivos (120 líneas)           — loadImage, saveImage, exportLayer
├── Zoom y Vista (30 líneas)        — zoomIn/Out/Reset, grid toggle
├── Atajos de Teclado (65 líneas)   — Keyboard shortcut router
├── Selector / Mover (115 líneas)   — Layer move, selection move
└── Utilerías (30 líneas)           — getImageFit, selectColorPicker, getActiveColor
```

## Limitaciones Conocidas

- **Rendimiento**: El historial guarda canvas completos en memoria (cada estado clona todos los layer canvases). Documentos grandes o muchas capas pueden consumir mucha RAM.
- **Lazo**: La selección de lazo solo almacena el bounding box rectangular para operaciones de cortar/copiar; no respeta el contorno preciso del trazado.
- **Varita mágica**: Similar al lazo, la selección real es un bounding box rectangular a pesar de que la visualización muestre la máscara semi-transparente.
- **Zoom**: El zoom mediante CSS scale puede hacer que los eventos del mouse no se mapeen perfectamente en todos los navegadores.
- **Texto**: El texto se renderiza como píxeles rasterizados (no editable después de aplicar, aunque se puede re-editar abriendo el diálogo Fonts).
- **Selector / mover capa**: El contenido arrastrado parcialmente fuera del canvas se pierde (recortado por los límites del canvas). No hay canvas virtual más grande que el viewport.
