# Tool Paint Web — Especificación Técnica

## Descripción General

Aplicación web de dibujo y edición de imágenes con sistema de capas múltiples, herramientas de dibujo vectorial y de píxeles, selección, texto con editor flotante, y soporte de exportación. Implementada completamente en vanilla JavaScript con Canvas API. Versión actual: **1.1.0**.

## Stack Tecnológico

- **HTML5** — Estructura semántica y canvas elements
- **CSS3** — Diseño con CSS Grid, tema oscuro/claro vía CSS custom properties, responsive design
- **JavaScript (ES6+)** — Lógica de la aplicación orientada a objetos (~2767 líneas)
- **Canvas API** — Renderizado de gráficos en 2D

## Arquitectura

### Clase Principal: `PaintApp`

Toda la aplicación se maneja desde una única clase `PaintApp` instanciada al cargar el DOM. No hay frameworks ni dependencias externas.

```
PaintApp
├── init()
│   ├── setupCanvas()              — Enlaza elementos del DOM
│   ├── setupEventListeners()      — Todos los eventos de UI
│   ├── createNewLayer()           — Capa inicial
│   ├── saveState()                — Estado inicial para undo
│   ├── updateUI()                 — Barra de estado
│   └── applyTranslations()        — Sistema de idiomas
├── Sistema de Capas
├── Herramientas de Dibujo
├── Herramientas de Formas
├── Herramientas de Selección y Mover
├── Herramienta de Texto
├── Sistema de Historial
├── Operaciones de Archivo (incl. drag-drop, paste)
├── Selector / Mover
├── Invertir Colores
├── Flip / Rotate (vertical, horizontal, rotate L/R)
├── Zoom y Vista
├── Sistema de Idiomas (i18n)
├── Tema Oscuro/Claro
├── Diálogo Acerca de
└── Atajos de Teclado
```

## Canvas Architecture

Cuatro capas de canvas superpuestas dentro de `#canvas-wrapper`:

```
┌─────────────────────────────────────┐
│  event-canvas (z-index: 10)        │ ← Captura eventos del mouse/touch
│  (position: absolute, transparent)  │
├─────────────────────────────────────┤
│  selection-canvas (z-index: 3)     │ ← Muestra bordes de selección y máscara varita
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
│   (grid-area: menu)              │  [🌙] [Title]│
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
- **Edición**: Deshacer/Rehacer, Cortar/Copiar/Pegar, Seleccionar todo/Deseleccionar, Limpiar Canvas
- **Ver**: Acercar/Alejar/Restablecer zoom, Mostrar/Ocultar cuadrícula
- **Imagen**: Invertir Colores (⌘I)
- **Ayuda**: Acerca de Tool Paint Web
- **Extras**: Lenguaje (Español/English)
- Botón de cambio de tema (🌙/☀️) y título "Tool Paint Web" alineados a la derecha

### Barra de Herramientas Lateral (`#toolbar`)
- **Herramientas**: Selector(V), Pincel(B), Lápiz(P), Borrador(E), Rellenar(F), Cuentagotas(I)
- **Formas**: Línea(L), Rectángulo(R), Rectángulo redondeado(U), Círculo(C), Elipse(J), Polígono(O)
- **Selección**: Rectangular(M), Lazo(S), Varita mágica(W), Recortar(R), Voltear vertical, Voltear horizontal, Rotar 90° izquierda, Rotar 90° derecha
- **Texto**: Herramienta de texto(T)
- **Backgrounds**: Transparente, Blanco, Negro (rellenan la capa activa)
- **Propiedades**: Color principal/secundario, grosor, opacidad, relleno de formas, tolerancia de varita

### Panel de Capas (`#layers-panel`)
- Lista de capas con previsualización en miniatura
- Nombre de capa editable inline
- Controles de visibilidad
- Opacidad de capa individual (slider)
- Reordenamiento drag & drop entre capas
- Botones: Nueva capa (+), Eliminar capa (−), ✕ rojo para eliminar capa activa, Fusionar abajo

### Barra de Estado (`#status-bar`)
- Posición del cursor (x, y)
- Tamaño del documento
- Nivel de zoom
- Herramienta activa

### Diálogos
- **Nuevo documento** (modal): ancho, alto, color de fondo
- **Fonts** (flotante, arrastrable): selector de fuente, tamaño, B/I/U/V, botones Apply/Cancel
- **Acerca de** (modal): ícono SVG, nombre, versión (1.0.0), autor, enlace a GitHub, donación

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

Operaciones: crear, eliminar (mínimo 1 capa), seleccionar (activar), alternar visibilidad, ajustar opacidad, fusionar hacia abajo, reordenar por drag & drop en el panel. Los objetos de texto se vinculan a una capa por ID para re-edición. Al seleccionar una capa con texto asociado, la herramienta de texto se activa automáticamente.

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
| Polígono | O | Drag para crear pentágono regular; finalizar con Enter, doble clic, clic derecho, o cerrar cerca del primer punto |

Las formas muestran preview en `temp-canvas` durante el arrastre y se finalizan en `mouseup`. Soportan relleno opcional (`#fill-shape` checkbox). El polígono ahora se dibuja arrastrando (como el rectángulo) en lugar de click punto por punto — genera un pentágono regular.

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

La selección se almacena en `this.selection` con coordenadas, dimensiones y opcionalmente puntos de lazo. Se visualiza en `selection-canvas` con borde punteado azul `#007acc`. Las operaciones Cortar/Copiar/Pegar actúan sobre el área seleccionada.

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

- Atajo: R (compartido con Rectángulo — se usa el último seleccionado)
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

### 8. Invertir Colores

- Acceso: Menú Imagen > Invertir Colores o atajo ⌘I
- Opera sobre la capa activa únicamente
- Invierte los componentes R, G, B de cada píxel (el canal alpha no se modifica)

### 9. Flip / Rotate

Cuatro botones en la sección Selección de la barra de herramientas:
- **Voltear vertical**: Refleja el contenido sobre el eje Y horizontal
- **Voltear horizontal**: Refleja el contenido sobre el eje X vertical
- **Rotar 90° izquierda**: Rotación antihoraria
- **Rotar 90° derecha**: Rotación horaria

Operan sobre los bounds del contenido no-transparente de la capa activa (auto-detectado), o sobre la selección activa si existe. Usan `getContentBounds()` para detectar el área a transformar con canvas transforms (`scale`, `rotate`).

### 10. Sistema de Historial (Undo/Redo)

- Captura el estado completo de todas las capas en cada acción relevante
- Máximo 50 estados (`this.maxHistory`)
- Cada estado guarda un snapshot del canvas de cada capa (clonado vía `drawImage`)
- Undo: Ctrl+Z (y Shift+Ctrl+Z para redo)
- Redo: Ctrl+Y

### 11. Operaciones de Archivo

| Acción | Descripción |
|-------|------------|
| Nuevo | Diálogo con ancho, alto y color de fondo |
| Abrir | File picker para imágenes (crea nueva capa, imagen escalada al canvas) |
| Guardar PNG | Exporta combinación de capas visibles como PNG |
| Guardar JPG | Similar a PNG, con fondo blanco sólido |
| Exportar capa | Exporta solo la capa activa como PNG |
| Limpiar Canvas | Elimina todas las capas y crea una nueva capa de fondo vacía |

**Drag & Drop**: Arrastrar imágenes al workspace las abre en nuevas capas (escaladas al canvas). Indicador visual con outline punteado azul (`#workspace.drag-over`).

**Pegar desde portapapeles**: Cmd+V o menú Edición > Pegar. Acepta imágenes del sistema (cualquier tipo MIME image/*) en nueva capa escalada al canvas. También pega selecciones internas (copiadas dentro de la app) como fallback.

**Ajuste de imagen**: `getImageFit(imgWidth, imgHeight)` escala la imagen manteniendo relación de aspecto para que quepa dentro del canvas, centrada. Se usa en loadImage, pasteFromClipboard, handleDropImage.

### 12. Zoom y Vista

- Zoom con factor 1.2x (rango 0.1x – 5x)
- Aplicado mediante transformación CSS `scale()` en `#canvas-wrapper`
- Atajos: + (acercar), - (alejar), restablecer
- Cuadrícula overlay con CSS linear-gradient (toggle desde menú Ver)

### 13. Selección de Color

- Selector de color principal y secundario (inputs `type="color"`)
- Indicador visual azul (`#007acc`) en el wrapper del color seleccionado (clase `.selected`)
- **X**: Intercambia entre color primario y secundario
- `getActiveColor()` retorna el color activo según cuál wrapper tenga `.selected`
- Todos los dibujos (pincel, formas, texto, etc.) usan `getActiveColor()`

### 14. Sistema de Idiomas (i18n)

Soporte completo para Español e Inglés mediante un objeto `TRANSLATIONS` con claves anidadas por idioma:

```javascript
const TRANSLATIONS = { es: { ... }, en: { ... } };
```

- **Activación**: Menú Extras > Lenguaje > Español / English
- **Método**: `t(key)` — busca en el idioma actual, fallback al key si no encuentra
- **Aplicación**: `applyTranslations()` — actualiza todos los elementos con atributos `data-i18n`, `data-i18n-title`, `data-i18n-placeholder`
- La barra de estado se actualiza dinámicamente al cambiar de idioma
- Las herramientas, propiedades, capas, diálogos y tooltips están completamente traducidos

### 15. Tema Oscuro/Claro

Toggle en el menú superior (🌙/☀️) que alterna entre tema oscuro (default) y claro:

```css
:root { /* dark theme vars */ }
[data-theme="light"] { /* light theme vars */ }
```

- Implementado con CSS custom properties
- Cambia colores de fondo, texto, bordes, scrollbars y superficie
- Persiste vía atributo `data-theme` en `<body>`

### 16. Diálogo Acerca de

Modal con:
- Ícono SVG con gráficos de colores
- Nombre: "Tool Paint Web"
- Versión: leída de la constante `APP_VERSION` (actualmente 1.0.0)
- Autor: remake por Antares Martinez
- Enlace a GitHub
- Enlace de donación (pendiente)

### 17. Atajos de Teclado

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
| Ctrl+I | Invertir colores |
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
| R | Rectángulo / Recortar (alterna según tool activo) |
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

### 18. Soporte Táctil

Convierte eventos touch a mouse events sintéticos para compatibilidad con dispositivos móviles.

### 19. Limpiar Canvas

Acceso: Menú Edición > Limpiar Canvas. Elimina todas las capas, historial, y selección, luego crea una nueva capa de fondo vacía. Resetea el documento a un estado limpio.

## Archivos del Proyecto

| Archivo | Líneas | Propósito |
|---------|--------|-----------|
| `index.html` | 375 | Estructura HTML, toolbars, modales, diálogo Fonts flotante, diálogo Acerca de |
| `app.js` | 2767 | Lógica completa de la aplicación (clase PaintApp con i18n, canvas, herramientas) |
| `style.css` | 1031 | Estilos visuales, tema oscuro/claro, responsive, animaciones, scrollbars |

## Constantes Globales

```javascript
const APP_VERSION = '1.1.0';
```

## Estructura de app.js

```
Secciones principales (~2767 líneas):
├── CONSTANTES (línea 8)              — APP_VERSION, TRANSLATIONS (es/en)
├── Constructor (línea 263)           — Estado global, inicialización (~60 líneas)
├── init() / setupCanvas()            — Arranque y canvas DOM
├── setupEventListeners() (200+ lns)  — Todos los eventos UI
├── Sistema de Capas (130 líneas)     — CRUD de capas, renderizado, drag-drop reorder
├── Herramientas de Dibujo (290 lns)  — setTool, cursors, mouse handlers, drawing
├── Polígono (55 líneas)              — Pentágono drag, preview, finalización
├── Relleno Bucket (55 líneas)        — Flood fill algorithm
├── Cuentagotas (15 líneas)           — Pick color from canvas
├── Selección (120 líneas)            — Rect, lasso, selectAll, deselect
├── Varita mágica (60 líneas)         — Tolerance-based flood fill selection
├── Cortar/Copiar/Pegar (100 lns)     — Clipboard interno + sistema
├── Recortar (50 líneas)              — Crop tool con redimension
├── Texto (290 líneas)                — textBounds, Fonts dialog, renderizado, re-edición
├── Sistema de Idiomas (70 líneas)    — TRANSLATIONS, t(), setLanguage, applyTranslations
├── Fonts Drag (30 líneas)            — Arrastre del diálogo Fonts
├── Historial (60 líneas)             — saveState, undo, redo
├── Archivos (120 líneas)             — loadImage, saveImage, exportLayer, clearCanvas
├── Zoom y Vista (30 líneas)          — zoomIn/Out/Reset, grid toggle
├── Atajos de Teclado (100 líneas)    — Keyboard shortcut router con i18n
├── Invertir Colores (20 líneas)      — invertColors()
├── Flip / Rotate (130 líneas)        — getContentBounds, flipV/H, rotate L/R
├── Selector / Mover (140 líneas)     — Layer move, selection move, findLayerAtPoint
└── Utilerías (30 líneas)             — getImageFit, selectColorPicker, getActiveColor
```

## Historial de Commits Relevantes

| Commit | Descripción |
|--------|------------|
| `09b1bd3` | Drag-and-drop layer reordering en layers panel |
| `7b99a5a` | Flip/rotate opera sobre object bounds en lugar de capa completa |
| `e2e5135` | Botones flip vertical, flip horizontal, rotate 90° izq/der |
| `d03d9b3` | Menú Extras con sistema de idiomas Español/English |
| `298523e` | Menú Ayuda con diálogo Acerca de (versión, links, SVG icon) |
| `116990b` | Menú Imagen con Invertir Colores y atajo ⌘I |
| `40a1e7d` | Toggle tema oscuro/claro con CSS variables y botón 🌙/☀️ |
| `ceac330` | Título "Tool Paint Web" en esquina superior derecha |
| `6844027` | Limpiar Canvas en menú Edición |
| `bdac21c` | Fix Cmd+V para pegar imágenes del sistema |
| `a14fe99` | Botón ✕ rojo para eliminar capa activa |
| `486e6d1` | Polígono cambia a drag-to-create pentágono |

## Limitaciones Conocidas

- **Rendimiento**: El historial guarda canvas completos en memoria (cada estado clona todos los layer canvases). Documentos grandes o muchas capas pueden consumir mucha RAM.
- **Lazo**: La selección de lazo solo almacena el bounding box rectangular para operaciones de cortar/copiar; no respeta el contorno preciso del trazado.
- **Varita mágica**: Similar al lazo, la selección real es un bounding box rectangular a pesar de que la visualización muestre la máscara semi-transparente.
- **Zoom**: El zoom mediante CSS scale puede hacer que los eventos del mouse no se mapeen perfectamente en todos los navegadores.
- **Texto**: El texto se renderiza como píxeles rasterizados (no editable después de aplicar, aunque se puede re-editar abriendo el diálogo Fonts).
- **Selector / mover capa**: El contenido arrastrado parcialmente fuera del canvas se pierde (recortado por los límites del canvas). No hay canvas virtual más grande que el viewport.
- **i18n**: Al cambiar de idioma, los textos generados dinámicamente (como nombres de herramientas en la barra de estado) se actualizan, pero los nombres de capa creados previamente no se traducen retroactivamente.
