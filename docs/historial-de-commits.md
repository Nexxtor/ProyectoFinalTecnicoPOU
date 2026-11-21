# Historial de commits

El historial sigue el orden de construcción de la solución. Cada etiqueta representa el estado del código al finalizar una lección.

| Commit | Etiqueta | Mensaje | Lección | Contenido principal |
| --- | --- | --- | --- | --- |
| `ce493b7` | `leccion-1` | `chore: inicializar proyecto Vite con React` | 1 | Proyecto base, estilos, layouts, componentes UI, contextos, API y páginas provisionales. |
| `3c46c5d` | `leccion-2` | `feat: construir catálogo y detalle de eventos` | 2 | Inicio, cartelera, detalle, tarjeta de evento y selector de zonas. |
| `da7308d` | `leccion-3` | `feat: implementar autenticación simulada y roles` | 3 | Login, registro, recuperación, perfil y sesión persistente. |
| `c26fef9` | `leccion-4` | `feat: implementar carrito, checkout y boletos` | 4 | Carrito, pago simulado, confirmación, boletos y QR. |
| `dfc334c` | `leccion-5` | `feat: agregar panel administrativo y reportes` | 5 | Dashboard, CRUD de eventos, inventario, usuarios y reportes. |
| `b13ab9c` | `leccion-6` | `feat: configurar PWA y funcionamiento offline` | 6 | Manifest, service worker, caché y aviso de actualización. |
| `cd71217` | `leccion-7` | `test: agregar pruebas de reducers, API y componentes` | 7 | Vitest, React Testing Library y pruebas de flujos. |
| — | `v1.0.0` | `docs: documentar arquitectura, rutas y uso` | Cierre | README, convenciones, capturas y documentación. |

## Cómo se construyó

1. Se creó el esqueleto con todos los archivos de infraestructura y páginas provisionales.
2. Se implementó el catálogo y el detalle.
3. Se añadió la autenticación y la protección de rutas.
4. Se implementó el carrito, el checkout y los boletos.
5. Se añadió el panel administrativo y los reportes.
6. Se configuró la PWA.
7. Se añadieron las pruebas automatizadas.
8. Se documentó la solución.

## Relación con las lecciones

- `leccion-1` corresponde a la arquitectura de la solución.
- `leccion-2` corresponde a datos y API falsa.
- `leccion-3` corresponde a autenticación y rutas protegidas.
- `leccion-4` corresponde a catálogo, carrito y checkout.
- `leccion-5` corresponde a boletos, QR y administración.
- `leccion-6` corresponde a PWA, offline y publicación.
- `leccion-7` corresponde a calidad, pruebas y cierre.

## Actualización de dependencias

| Commit | Etiqueta | Mensaje | Contenido |
| --- | --- | --- | --- |
| `496b981` | `v1.0.1` | `chore(deps): actualizar dependencias y corregir auditoría` | Vite 8.3.8, React Router 8.5.2, jsdom 31, Testing Library actualizada y overrides de `glob`/`minimatch`. `npm audit` sin vulnerabilidades. |
