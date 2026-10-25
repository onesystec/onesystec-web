# OneSystec — sitio web (onesystec.com)

Sitio estático (HTML + CSS + JS, sin dependencias), publicado en Vercel.

## Páginas
| Archivo | Dirección | Contenido |
|---|---|---|
| `index.html` | `/` | Inicio: portada, clientes, pasos, OneTrack, módulos, IA, comparativa, carrusel |
| `servizi.html` | `/servizi` | Soluciones: módulos, plataforma, ecosistema, trabajos a medida |
| `onetrack.html` | `/onetrack` | OneTrack GPS: funciones, planes, comparativa, calculadora, FAQ |
| `prezzi.html` | `/prezzi` | Precios: planes de la plataforma y catálogo de módulos |
| `chi-siamo.html` | `/chi-siamo` | Quiénes somos y equipo |
| `contatti.html` | `/contatti` | Contacto, equipo por idioma y preguntas frecuentes |

## Dónde se cambia cada cosa
- **Menú, pie de página e iconos** (compartidos por todas las páginas) → `assets/js/layout.js`
- **Textos en italiano, español e inglés** → `assets/js/i18n.js`
- **Link de iniciar sesión, correo, WhatsApp, redes sociales** → arriba de `assets/js/main.js` (`CONFIG`)
- **Precios OneTrack** → `onetrack.html` (tarjetas, tabla y opciones de la calculadora `data-price`, `data-hw-min`, `data-hw-max`)
- **Precios de planes y módulos** → `prezzi.html`
- **Estilos y colores** → `assets/css/styles.css`
- **Imágenes** → `assets/img/`

`vercel.json` activa direcciones limpias (`/onetrack` en vez de `/onetrack.html`).
