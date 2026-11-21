# Eventos UCA — Solución de referencia

Aplicación de referencia del proyecto de venta y gestión de boletos para eventos. Implementa los ocho módulos del MVP con React, una API falsa y una PWA publicable en GitHub Pages.

## Características

- Catálogo de eventos con búsqueda, filtros y detalle.
- Selección de zonas, precios y disponibilidad.
- Carrito con `Context` y `useReducer`.
- Checkout con pago simulado y validación.
- Generación de órdenes y boletos con código QR.
- Autenticación simulada con roles de cliente, organizador y administrador.
- Panel administrativo con dashboard, CRUD de eventos, inventario, usuarios y reportes.
- API falsa con `seed.json` y persistencia en `localStorage`.
- PWA con manifest, service worker, caché y funcionamiento offline.
- Pruebas automatizadas con Vitest y React Testing Library.
- Preparada para GitHub Pages con `base`, `basename`, `404.html` y `.nojekyll`.

## Stack

- React 19
- Vite 8
- React Router 8 en modo datos
- `react-qr-code`
- `vite-plugin-pwa` + Workbox
- Vitest + jsdom + React Testing Library

## Inicio rápido

```bash
npm install
npm run dev
```

La aplicación se abre en `http://localhost:5173`.

## Comandos

```bash
npm run dev          # desarrollo
npm run build        # compilación de producción
npm run preview      # vista previa de producción
npm run test         # pruebas
npm run test:watch   # pruebas en modo interactivo
npm run test:coverage
```

## Cuentas de demostración

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Cliente | `cliente@eventos.test` | `cliente123` |
| Organizador | `organizador@eventos.test` | `organizador123` |
| Administrador | `admin@eventos.test` | `admin123` |

También se puede crear una cuenta de cliente desde `/registro`.

## Rutas principales

| Ruta | Descripción | Acceso |
| --- | --- | --- |
| `/` | Inicio y eventos destacados | Público |
| `/eventos` | Cartelera | Público |
| `/eventos/:id` | Detalle y selección de zonas | Público |
| `/carrito` | Carrito | Público |
| `/checkout` | Pago simulado | Autenticado |
| `/boletos` | Boletos y QR | Autenticado |
| `/perfil` | Perfil e historial | Autenticado |
| `/login` | Ingreso | Público |
| `/registro` | Registro | Público |
| `/recuperar` | Recuperación simulada | Público |
| `/admin` | Dashboard | Organizador o admin |
| `/admin/eventos` | CRUD de eventos | Organizador o admin |
| `/admin/inventario` | Precios y disponibilidad | Organizador o admin |
| `/admin/usuarios` | Usuarios | Admin |
| `/admin/reportes` | Reportes | Admin |

## API falsa

La aplicación no tiene backend. La capa de datos vive en `src/api` y funciona así:

1. En la primera carga se solicita `public/data/seed.json` con `fetch`.
2. El resultado se guarda en `localStorage` bajo la clave `eventos-db-v1`.
3. Las lecturas y mutaciones se realizan sobre esa copia local.
4. Las operaciones simulan latencia para mostrar estados de carga.
5. El perfil permite restablecer los datos iniciales.

Esto permite practicar un flujo asíncrono y desplegar la aplicación en GitHub Pages sin servidor.

## PWA

- Manifest con iconos de 192, 512 y maskable.
- Service worker generado por `vite-plugin-pwa`.
- Precache del app shell.
- `NetworkFirst` para `seed.json`.
- `CacheFirst` para imágenes.
- `navigateFallback` para rutas SPA.
- Aviso de actualización y de disponibilidad offline.

Para probar el service worker:

```bash
npm run build
npm run preview
```

## GitHub Pages

El workflow `.github/workflows/deploy.yml` compila, ejecuta las pruebas y publica `dist/`.

El build genera `dist/404.html` y conserva `.nojekyll`. Para probar un subdirectorio:

```bash
VITE_BASE=/nombre-del-repo/ npm run build
npm run preview
```

La publicación queda a cargo del usuario. Para añadir el remoto:

```bash
git remote add origin <url-del-repositorio>
git push -u origin main
```

## Estructura

```text
src/
├── api/            capa de acceso a la API falsa
├── components/     UI, eventos, boletos, administración y guards
├── context/        AuthContext, CartContext y reducer
├── hooks/          useAsync
├── layout/         layouts público y administrativo
├── pages/          páginas públicas, de cuenta y de administración
├── tests/          pruebas automatizadas
├── utils/          formato, reportes, validación y QR
├── main.jsx
├── router.jsx
└── styles.css
```

## Documentación

- `docs/convencion-de-commits.md` — reglas de commits.
- `docs/historial-de-commits.md` — relación entre commits, lecciones y cambios.
- `docs/como-revisar-el-historial.md` — comandos para recorrer la evolución.
- `docs/capturas/` — capturas de la versión final.

## Dependencias y auditoría

La versión actual se verificó con `npm audit` sin vulnerabilidades conocidas.

- Vite `8.3.8`.
- React Router `8.5.2`.
- jsdom `31.0.1`.
- `@testing-library/jest-dom` `8.0.0`.
- `@testing-library/user-event` `14.6.13`.

`vite-plugin-pwa` 2.0.0 depende de `workbox-build` 7.4.1, que a su vez utiliza versiones de `glob` y `minimatch` afectadas por avisos de seguridad. Para mantener la compatibilidad con Vite 8 se conserva el plugin y se añaden overrides explícitos:

```json
{
  "overrides": {
    "glob": "14.0.6",
    "minimatch": "11.0.9"
  }
}
```

La compilación y las pruebas se verificaron con esos overrides.

## Limitaciones

- No hay backend ni base de datos real.
- Las mutaciones se guardan en `localStorage`.
- El pago y el envío de correos son simulados.
- La autenticación no es segura para producción.
- Los datos se pierden si se borra el almacenamiento del navegador.

## Licencia

Material educativo. Los datos y las imágenes son de demostración.
