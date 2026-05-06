# Paint Pro — Especificación Técnica

## Descripción General

Aplicación web de dibujo y edición de imágenes con sistema de capas múltiples, herramientas de dibujo vectorial y de píxeles, selección, y soporte de exportación. Implementada completamente en vanilla JavaScript con Canvas API.

## Stack Tecnológico

- **HTML5** — Estructura semántica y canvas elements
- **CSS3** — Diseño con CSS Grid, tema oscuro, responsive design
- **JavaScript (ES6+)** — Lógica de la aplicación orientada a objetos
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
├── Herramientas de Selección
├── Sistema de Historial
├── Operaciones de Archivo
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
│  temp-canvas (z-index: 2)          │ ← Vistas previas temporales (formas, crop)
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

## Componentes UI

### Menú Superior (`#menu-bar`)
- **Archivo**: Nuevo, Abrir, Guardar (PNG/JPG), Exportar capa
- **Edición**: Deshacer/Rehacer, Cortar/Copiar/Pegar, Seleccionar todo/Deseleccionar
- **Ver**: Acercar/Alejar/Restablecer zoom, Mostrar/Ocultar cuadrícula

### Barra de Herramientas Lateral (`#toolbar`)
- **Herramientas**: Pincel(B), Lápiz(P), Borrador(E), Rellenar(F), Cuentagotas(I)
- **Formas**: Línea(L), Rectángulo(R), Círculo(C), Polígono(O)
- **Selección**: Rectangular(M), Lazo(S), Varita mágica(W), Recortar
- **Texto**: Herramienta de texto(T)
- **Propiedades**: Color principal/secundario, grosor, opacidad, relleno de formas, tolerancia de varita

### Panel de Capas (`#layers-panel`)
- Lista de capas con previsualización
- Controles de visibilidad (👁/🚫)
- Opacidad de capa individual
- Botones: Nueva capa (+), Eliminar capa (−), Fusionar abajo

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
    canvas: HTMLCanvasElement,   // Canvas en memoria
    ctx: CanvasRenderingContext2D,
    visible: boolean,
    opacity: number (0-1),
    locked: boolean
}
```

Operaciones: crear, eliminar (mínimo 1 capa), seleccionar, alternar visibilidad, ajustar opacidad, fusionar hacia abajo.

### 2. Herramientas de Dibujo

| Herramienta | Atajo | Comportamiento |
|------------|-------|---------------|
| Pincel | B | Trazo suave (lineCap: round, lineJoin: round) |
| Lápiz | P | Trazo duro (lineCap: butt, lineJoin: miter) |
| Borrador | E | Usa `destination-out` como composite operation |
| Relleno (Bucket) | F | Flood fill (BFS por pila) con reemplazo exacto de color |
| Cuentagotas | I | Toma el color del píxel en la capa activa |

### 3. Herramientas de Formas

| Herramienta | Atajo | Comportamiento |
|------------|-------|---------------|
| Línea | L | Trazo recto desde el punto inicial al final |
| Rectángulo | R | Rectángulo con opción de relleno |
| Círculo | C | Círculo desde el centro (radio = distancia al punto inicial) |
| Polígono | O | Click para añadir vértices; finalizar con Enter, doble clic, clic derecho, o cerrar cerca del primer punto |

Las formas muestran preview en `temp-canvas` durante el arrastre y se finalizan en `mouseup`.

### 4. Herramientas de Selección

| Herramienta | Atajo | Comportamiento |
|------------|-------|---------------|
| Rectangular | M | Arrastrar para crear selección rectangular |
| Lazo | S | Arrastrar para crear selección a mano alzada (polígono cerrado de muchos puntos) |
| Varita mágica | W | Selección por color con tolerancia configurable (flood fill con umbral) |

La selección se almacena en `this.selection` con coordenadas y dimensiones. Se visualiza en `selection-canvas` con borde punteado azul `#007acc`. Las operaciones Cortar/Copiar/Pegar actúan sobre el área seleccionada.

### 5. Herramienta de Texto

- Click en el canvas para posicionar el texto
- Diálogo modal con opciones: fuente, tamaño, negrita, cursiva
- Editor inline (`#text-input-container`) superpuesto en la posición del click

### 6. Recortar (Crop)

- Arrastrar para definir área de recorte (preview blanco punteado)
- Mínimo 10x10 píxeles
- Recorta todas las capas simultáneamente
- Redimensiona el documento al nuevo tamaño

### 7. Sistema de Historial (Undo/Redo)

- Captura el estado completo de todas las capas en cada acción relevante
- Máximo 50 estados en memoria
- Cada estado guarda los canvas completos como snapshot
- Undo: Ctrl+Z / Shift+Ctrl+Z para redo
- Redo: Ctrl+Y

### 8. Operaciones de Archivo

| Acción | Descripción |
|-------|------------|
| Nuevo | Diálogo con ancho, alto y color de fondo |
| Abrir | File picker para imágenes (crea nueva capa) |
| Guardar PNG | Exporta combinación de capas visibles como PNG |
| Guardar JPG | Similar a PNG, con fondo blanco sólido |
| Exportar capa | Exporta solo la capa activa como PNG |

### 9. Zoom y Vista

- Zoom con factor 1.2x (rango 0.1x – 5x)
- Aplicado mediante transformación CSS `scale()` en `#canvas-wrapper`
- Cuadrícula overlay con CSS linear-gradient

### 10. Atajos de Teclado

**Modificadores (Ctrl/Meta):**
- Z: Undo | Shift+Z: Redo
- Y: Redo
- C: Copiar | V: Pegar | X: Cortar
- A: Seleccionar todo
- O: Abrir
- S: Guardar PNG

**Herramientas:**
- B: Pincel | P: Lápiz | E: Borrador | F: Rellenar
- I: Cuentagotas | T: Texto
- L: Línea | R: Rectángulo | C: Círculo | O: Polígono
- M: Selección rectangular | S: Lazo | W: Varita mágica

**Otros:**
- Enter: Finalizar polígono
- Escape: Deseleccionar, cancelar polígono/lazo

### 11. Soporte Táctil

Convierte eventos touch a mouse events sintéticos para compatibilidad con dispositivos móviles.

## Archivos del Proyecto

| Archivo | Líneas | Propósito |
|---------|--------|-----------|
| `index.html` | ~253 | Estructura HTML, toolbars, modales |
| `app.js` | ~1465 | Lógica completa de la aplicación |
| `style.css` | ~595 | Estilos visuales, tema oscuro, responsive |

## Limitaciones Conocidas

- **Rendimiento**: El historial guarda canvas completos en memoria (cada estado clona todos los layer canvases). Documentos grandes o muchas capas pueden consumir mucha RAM.
- **Lazo**: La selección de lazo solo almacena el bounding box rectangular para operaciones de cortar/copiar; no respeta el contorno preciso del trazado.
- **Varita mágica**: Similar al lazo, la selección real es un bounding box rectangular a pesar de que la visualización muestre la máscara semi-transparente.
- **Zoom**: El zoom mediante CSS scale puede hacer que los eventos del mouse no se mapeen perfectamente en todos los navegadores.
- **Texto**: El texto se renderiza como píxeles rasterizados (no editable después de aplicar).
- **Polígono**: No hay feedback visual de "finalización" más allá de dibujar la forma.
