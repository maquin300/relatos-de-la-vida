# Portal de Historias — Guía de Mantenimiento

Proyecto web estático multi-archivo optimizado para tráfico móvil (Mobile-First).  
Listo para subir directamente a **Netlify** arrastrando la carpeta completa.

---

## Estructura del Proyecto

```
proyecto/
├── index.html              ← Página principal (portada + grid + legales)
├── plantilla.html           ← Plantilla madre para crear nuevas historias
├── historia-taxista.html    ← Primera historia (ejemplo funcional)
├── css/
│   └── styles.css           ← Todos los estilos del proyecto
├── js/
│   ├── main.js              ← JavaScript de index.html
│   └── story.js             ← JavaScript de las páginas de historias
├── _redirects               ← Configuración de Netlify
└── README.md                ← Este archivo
```

---

## Cómo Añadir una Nueva Historia (3 pasos)

### Paso 1: Crear el archivo de la historia

1. **Duplica** el archivo `plantilla.html`.
2. **Renómbralo** con un nombre descriptivo usando el formato:  
   `historia-nombre-corto.html`  
   Ejemplos: `historia-el-espejo-roto.html`, `historia-la-carta-perdida.html`

### Paso 2: Rellenar el contenido

Abre el archivo duplicado y busca todos los comentarios `← [CAMBIAR]`.  
Los campos que debes editar son:

| Campo | Ubicación | Ejemplo |
|-------|-----------|---------|
| `<title>` | `<head>` | `El espejo roto — Mi Portal` |
| `<meta description>` | `<head>` | `Breve extracto para SEO...` |
| Categoría | `.category-chip` | `Misterio` |
| Título | `.reading-title` | `El espejo roto` |
| Imagen | `.reading-image` | Reemplazar con `<img>` |
| Párrafos visibles | `.reading-body > p` | Texto libre (2-4 párrafos) |
| Texto difuminado | `.blur-copy > p` | Adelanto borroso |
| Continuación | `#continued-reading > p` | Resto de la historia |

### Paso 3: Añadir la tarjeta en la portada

Abre `index.html` y busca `<div id="story-grid">`.  
Copia este bloque HTML y pégalo dentro del grid:

```html
<a class="story-card" href="historia-el-espejo-roto.html" data-category="Misterio">
  <span class="thumbnail">Miniatura</span>
  <span class="story-meta">Misterio</span>
  <h3>El espejo roto</h3>
  <p>Extracto breve que engancha al lector...</p>
</a>
```

**Importante:** El valor de `data-category` debe coincidir exactamente con  
uno de los filtros definidos (Misterio, Reflexión, Curiosidades) para que  
el sistema de filtrado funcione correctamente.

---

## Cómo Añadir una Nueva Categoría de Filtro

1. Abre `index.html`.
2. Busca la sección `<div class="filter-row">`.
3. Añade un nuevo botón:

```html
<button class="filter-button" type="button" data-filter="NuevaCategoria">Nueva Categoría</button>
```

4. Asegúrate de que las tarjetas que pertenezcan a esta categoría tengan  
   `data-category="NuevaCategoria"` (el texto debe coincidir exactamente).

---

## Cómo Conectar el Botón CTA con Publicidad

El botón "Continuar leyendo la historia" ejecuta la función `handleUnlock()`  
definida en `js/story.js`.

Abre `js/story.js` y busca:

```javascript
function handleUnlock() {
  // ← INSERTA AQUÍ TU LÓGICA DE MONETIZACIÓN
```

Las opciones disponibles están documentadas en los comentarios del archivo:

- **Opción A:** Redirigir a un enlace publicitario  
- **Opción B:** Abrir en nueva pestaña + desbloquear  
- **Opción C:** Cargar un script de monetización  
- **Opción D:** Mostrar un interstitial/popup  

---

## Cómo Conectar el Formulario de Suscripción

El formulario de email está en `index.html` y su lógica en `js/main.js`.

**Con Netlify Forms (más fácil):**
1. Añade el atributo `netlify` al `<form>`:
   ```html
   <form id="subscribe-form" class="subscribe-form" netlify>
   ```
2. Netlify detectará el formulario automáticamente al hacer deploy.

**Con un servicio externo (Mailchimp, SendGrid, etc.):**
1. Abre `js/main.js` y busca el comentario `TODO: Conectar con servicio real`.
2. Reemplaza el bloque de éxito con un `fetch()` al endpoint de tu servicio.

---

## Deploy en Netlify

### Opción 1: Arrastrar y soltar (más rápida)
1. Ve a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastra toda la carpeta del proyecto.
3. ¡Listo! Tu sitio estará online en segundos.

### Opción 2: Conectar repositorio Git
1. Sube el proyecto a GitHub/GitLab/Bitbucket.
2. En Netlify, haz clic en "New site from Git".
3. Selecciona tu repositorio.
4. No necesitas configurar build command ni publish directory  
   (es un sitio estático puro).

---

## Personalización Rápida

### Cambiar el nombre del sitio
Busca y reemplaza `Nombre de tu Web` en todos los archivos HTML.

### Cambiar el email de contacto
Busca y reemplaza `soporte@tudominio.com` en todos los archivos HTML.

### Cambiar el año del copyright
Busca y reemplaza `© 2026` en todos los archivos HTML.

### Cambiar colores
Edita las variables CSS en `css/styles.css`:
```css
:root {
  --ink: #171717;      /* Color principal del texto */
  --muted: #666666;    /* Color de texto secundario */
  --line: #c9c9c9;     /* Color de líneas y bordes */
  --paper: #f7f7f5;    /* Color de fondo principal */
  --dark: #181818;     /* Color del footer */
  --soft: #ececea;     /* Color de fondos suaves */
}
```

### Añadir imágenes reales
Los placeholders de imagen son `<div>` con patrón diagonal.  
Reemplázalos por etiquetas `<img>` con las mismas clases:
```html
<!-- Antes (placeholder) -->
<div class="reading-image">Imagen ilustrativa · marcador</div>

<!-- Después (imagen real) -->
<img src="img/historia-taxista.jpg" alt="Taxi en la noche" class="reading-image">
```

---

## Dependencias

| Recurso | Tipo | Uso |
|---------|------|-----|
| Google Fonts (CDN) | Externo | Fuentes Source Serif Pro y Work Sans |
| CSS puro | Local | `css/styles.css` — sin frameworks |
| JS puro | Local | `js/main.js` + `js/story.js` — sin librerías |

**Cero dependencias de NPM, frameworks, o SDKs.**  
El proyecto funciona abriendo `index.html` directamente en el navegador.
