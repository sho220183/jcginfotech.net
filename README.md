# JCG Info Tech — Landing Page

Sitio web estático de una página (landing) para **JCG Info Tech**, empresa de servicios informáticos y consultoría IT en Paraguay.

🌐 **Demo en vivo:** https://jcginfotech.net.py/

---

## Estructura del proyecto

```
jcg-infotech/
│
├── index.html              ← Documento principal (HTML semántico + ARIA)
│
├── css/
│   ├── variables.css       ← Design tokens: colores, tipografía, espaciado, z-index
│   ├── base.css            ← Reset CSS + estilos globales de elementos
│   ├── layout.css          ← Grid de fondo, orbs, sección base, botones, animaciones
│   ├── nav.css             ← Navbar fija (desktop + mobile hamburger)
│   ├── hero.css            ← Sección hero
│   └── sections.css        ← Marquee, servicios, proceso, testimonios, contacto, footer
│
├── js/
│   └── main.js             ← Scroll animations + mobile nav + active link highlight
│
├── img/
│   ├── logo.svg            ← Logotipo vectorial
│   ├── favicon.svg         ← Favicon SVG
│   ├── og-image.png        ← Imagen para redes sociales (1200×630 px) — PENDIENTE CREAR
│   └── circuit.svg         ← Ilustración (referencia; se usa inline en el HTML)
│
├── .gitignore
├── .nojekyll               ← Activa GitHub Pages sin Jekyll
└── README.md
```

---

## Tecnologías

| Capa        | Tecnología                              |
|-------------|-----------------------------------------|
| Marcado     | HTML5 semántico + ARIA                  |
| Estilos     | CSS3 con custom properties (sin frameworks) |
| Scripts     | Vanilla JavaScript ES6+ (sin dependencias) |
| Tipografías | Google Fonts — Syne · Space Mono · DM Sans |
| Gráficos    | SVG nativos inline                      |

---

## Secciones

1. **Hero** — Título, descripción, CTAs y estadísticas
2. **Marquee** — Banda animada con los servicios destacados
3. **Servicios** — 6 tarjetas: Consultoría IT, Redes, Programación, Soporte, Cloud, Ciberseguridad
4. **Proceso** — 4 pasos de trabajo + ilustración animada de circuito
5. **Nosotros** — Testimonios de clientes
6. **Contacto** — Cards de info + CTA principal
7. **Footer** — Logo, links y copyright

---

## Desplegar en GitHub Pages

1. Crear un repositorio en GitHub (ej. `jcg-infotech`)
2. Subir todos los archivos al branch `main`
3. Ir a **Settings → Pages → Branch: main / (root) → Save**
4. El sitio quedará disponible en:
   `https://<tu-usuario>.github.io/jcg-infotech/`

Para usar tu dominio propio (`jcginfotech.net.py`):
- En **Settings → Pages → Custom domain** ingresar el dominio
- En tu proveedor DNS agregar un registro `CNAME` apuntando a `<tu-usuario>.github.io`

---

## Personalización rápida

### Colores (css/variables.css)
```css
--color-cyan:  #00d2b4;   /* Acento principal */
--color-amber: #f5a623;   /* Acento secundario */
--color-black: #080c10;   /* Fondo base */
```

### Datos de contacto (index.html)
Buscar y reemplazar:
- `+595 XXX XXX XXX` → número real
- `info@jcginfotech.net.py` → email real

### Meta tags SEO (index.html `<head>`)
Actualizar la URL en `og:url` y `canonical` con el dominio real.

### Imagen OG (img/og-image.png)
Crear una imagen de 1200×630 px para previsualización en redes sociales (ver `img/OG-IMAGE-README.md`).

---

## Cómo correr localmente

```bash
# Con Python 3
python -m http.server 3000

# Con Node.js
npx serve .
```

Abrir http://localhost:3000 en el navegador.
