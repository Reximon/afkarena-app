# The Resonating Hall

Aplicación web bilingüe (inglés/español) para llevar el seguimiento de tu cuenta de **AFK Arena Classic**: qué héroes tienes, en qué has invertido y qué formaciones usas. Por defecto todos los datos se guardan en el propio navegador; de forma opcional puedes conectar tu propio servidor PocketBase para tener una copia remota por cuenta sin perder el funcionamiento offline.

**Demo en vivo:** <https://reximon.github.io/afkarena-app/> · **Versión:** 1.4.0

## Índice

- [Qué puedes hacer](#qué-puedes-hacer)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Puesta en marcha](#puesta-en-marcha)
- [Comandos](#comandos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Datos y catálogos](#datos-y-catálogos)
- [Persistencia, exportación e importación](#persistencia-exportación-e-importación)
- [Sincronización con PocketBase (opcional)](#sincronización-con-pocketbase-opcional)
- [Idiomas](#idiomas)
- [Calidad y pruebas](#calidad-y-pruebas)
- [Despliegue](#despliegue)
- [Documentación adicional](#documentación-adicional)
- [Aviso legal](#aviso-legal)

## Qué puedes hacer

### Héroes y roster

- Catálogo de los 255 héroes de AFK Arena Classic, generado desde el CDN comunitario `afk-mine`, con las cinco clases reales (Warrior, Tank, Ranger, Mage y Support) resueltas desde bases de datos públicas.
- Ficha por héroe con ascensión, nivel, pertenencia al Cristal Resonante, Signature Item, Furniture (0/3/9/36), Engraving (0/30/60/80), equipo, artefacto o colección, y notas libres.
- Búsqueda y filtros por facción, clase, ascensión y rol, además de un filtro para ver solo los héroes que estás priorizando.
- Panel principal con resumen de héroes, equipos y mascotas, reparto por facción, héroes objetivo y accesos rápidos.
- Héroes Dimensionales vinculados a otro héroe: copian su ascensión y los cambios posteriores se propagan. Si desvinculas, conservan la última ascensión copiada; mientras dura el vínculo, el selector de ascensión queda bloqueado.

### Equipamiento e inversión

- Cuatro piezas de equipo (arma, casco, pecho y botas) con tier (Mítico y T1–T5), estrellas de 0 a 5, facción, equipo resonante y equipo exclusivo.
- **22 artefactos**: los siete de Dura y quince de clase, estos últimos restringidos por la clase real del héroe.
- **23 colecciones** con restricción de clase, nivel de 0 a 10, nivel de habilidad de 0 a 3 y stats míticos de 0 a 8.
- Artefacto y colección son mutuamente excluyentes para un mismo héroe; al cambiar de uno a otro se conserva el progreso guardado de la colección.

### Equipos

- Formaciones con 2 héroes delante y 3 detrás, con nombre, modo (campaña, arena, Dream Realm, Guild Hunt, torre u otro) y notas. Los héroes se colocan arrastrando y soltando.
- Bonus de facción calculado automáticamente a partir de las facciones reales del equipo: 3 héroes → +10% ATK/HP; 3+2 → +15%/+15%; 4 → +15%/+20%; 5 → +25%/+25%. Los Celestiales actúan como comodín para las facciones normales, los Hipogeos suman su propia escala, cada Draconis aporta +2% de ATK/HP y los Dimensionales no cuentan.
- Puedes asignar una mascota a cada equipo.

### Mascotas (Beasts)

- **30 mascotas** con sus tres buffs de atributo (fuerza, inteligencia y agilidad). El nivel de bestia es la suma de los tres, no se introduce a mano.
- Entrenamiento de 0 a 3, disponible solo en mascotas Elite y Fabled y desbloqueado al alcanzar los niveles de bestia 3, 9 y 15.
- Nivel de resonancia objetivo (0–54) definido por ti. Es solo informativo: las mascotas por debajo muestran un indicador `+N` con lo que les falta, pero los buffs nunca se suben automáticamente.
- El objetivo se limita al máximo del tier de cada mascota (18 Rare, 36 Elite, 54 Fabled).

### Datos

- Exportación a JSON legible por personas e importación validada con Zod, ambas desde **Ajustes** y compatibles con copias antiguas.
- Interfaz en inglés y español, con los términos propios del juego siempre en inglés.
- Diseño oscuro adaptable con retratos enmarcados e imágenes oficiales de facción.

## Tecnologías

| Capa               | Tecnología                                                                    |
| ------------------ | ----------------------------------------------------------------------------- |
| Interfaz           | React 19 con TypeScript estricto (`verbatimModuleSyntax`)                     |
| Compilación        | Vite 8                                                                        |
| Estilos            | Tailwind CSS v4 (CSS-first, sin `tailwind.config`; tokens en `src/index.css`) |
| Estado             | Zustand 5 con `persist`                                                       |
| Sincronización     | PocketBase self-hosted (opcional) y su SDK oficial                            |
| Validación         | Zod 4                                                                         |
| Enrutado           | `HashRouter` de react-router                                                  |
| i18n               | i18next + react-i18next                                                       |
| Componentes        | Radix UI (diálogo, popover, select, tooltip), lucide-react                    |
| Arrastrar y soltar | dnd-kit                                                                       |
| Pruebas            | Vitest + Testing Library sobre jsdom                                          |

La guía visual (tipografía, superficies, navegación) está en [DESIGN.md](DESIGN.md).

## Requisitos

- Node.js 24 y npm. Es la versión que usan la CI y el Dockerfile.
- Un navegador moderno con `localStorage` habilitado.

## Puesta en marcha

```bash
npm install
npm run dev
```

El servidor de desarrollo queda en <http://localhost:5173>.

Para probar el build de producción tal cual se publica:

```bash
npm run build
npm run preview
```

## Comandos

| Comando                     | Qué hace                                                             |
| --------------------------- | -------------------------------------------------------------------- |
| `npm run dev`               | Arranca el servidor de desarrollo de Vite en el puerto 5173.         |
| `npm run build`             | Comprueba tipos y genera la compilación de producción en `dist/`.    |
| `npm run preview`           | Sirve la compilación de producción para revisarla en local.          |
| `npm run typecheck`         | Ejecuta `tsc -b`.                                                    |
| `npm run lint`              | Ejecuta Oxlint.                                                      |
| `npm run test`              | Lanza Vitest una vez.                                                |
| `npm run test:watch`        | Lanza Vitest en modo vigilancia.                                     |
| `npm run format`            | Formatea el repositorio con Prettier.                                |
| `npm run sync:heroes`       | Regenera `src/data/heroes.json` desde el CDN.                        |
| `npm run sync:hero-classes` | Regenera `src/data/hero-classes.json` desde bases de datos públicas. |

## Estructura del proyecto

```
src/
  pages/                          Pantallas de ruta: Dashboard, Roster, Teams, Pets, Equipment, Settings
  components/                     Componentes por dominio: dashboard/, roster/, teams/, pets/, equipment/, heroes/, layout/
  components/ui/                  Primitivas reutilizables (Button, Badge, Dialog, Input, Select, Field, EmptyState, PageHeader…)
  components/roster/hero-detail/  Piezas de la ficha de héroe (escena de facción, selectores, panel de inversión)
  features/                       Lógica de dominio: heroes, gear, artifacts, collections, pets, teams, persistence
  sync/                           Sincronización opcional con PocketBase (cliente, motor, estado y validación)
  components/sync/                Panel de cuenta, login, diálogo de conflicto e indicador de estado
  store/                          Store de Zustand (useAppStore)
  types/                          Tipos y enums compartidos
  i18n/                           Configuración y locales (en.ts, es.ts)
  data/                           Catálogos generados (no editar a mano)
  assets/                         Pinturas oficiales de facción para las escenas de héroe
  lib/                            Utilidades compartidas (cn, funciones auxiliares de iconos…)
  index.css                       Tokens y clases de Tailwind (CSS-first)
scripts/                          Scripts de sincronización de los catálogos
pb_migrations/                    Migraciones de PocketBase (colección roster_data y registro cerrado)
docker/                           Configuración de nginx para la imagen
backup/                           Copias reales del formato antiguo; se usan para probar compatibilidad
.github/workflows/                CI y despliegue a GitHub Pages
public/                           Ficheros estáticos que se sirven tal cual
```

## Datos y catálogos

El catálogo de héroes se genera desde `https://raw.githubusercontent.com/afk-mine/cdn/main/unit.json` y se guarda en `src/data/heroes.json`. Los iconos de héroe se cargan en tiempo de ejecución desde el CDN de `afk-mine`, y el arte de artefactos, colecciones y mascotas desde `https://www.afk.global`.

Dentro de `heroes.json`, el campo `class` es el **tipo** de héroe (Warrior/Ranger/Mage), mientras que la clase real (Warrior/Tank/Ranger/Mage/Support) vive en `src/data/hero-classes.json`, generado con `npm run sync:hero-classes` desde `https://www.afk.global/afk-arena/characters` y con `https://gacha-data.com/afk-arena/characters/` como alternativa. Usa `entry.type` para lógica basada en tipo (por ejemplo, el arte del equipo) y `entry.class` para restricciones de clase (artefactos y colecciones).

Los catálogos de artefactos y colecciones se mantienen a mano en `src/features/artifacts/artifacts.ts` y `src/features/collections/collections.ts`; el de las 30 mascotas, en `src/features/pets/pets.ts`.

Los dos ficheros de `src/data/` son generados: no los edites a mano, vuelve a lanzar el script de sincronización correspondiente.

## Persistencia, exportación e importación

### Dónde se guarda

- Datos de la aplicación: clave `afk-astral-codex:data` de `localStorage`.
- Idioma elegido: clave `afk-astral-codex:lang`.
- Metadatos de sincronización (solo si usas PocketBase): clave `afk-astral-codex:sync` con `dirty`, `localUpdatedAt`, `lastSyncedAt` y `lastSyncedServerVersion`. La sesión la guarda el `authStore` del SDK en `pocketbase_auth`.
- Se persiste la versión 1 del esquema con `schemaVersion`, `profile`, `heroes`, `pets` y `teams`.

Internamente los héroes siempre se indexan por `heroId` y las mascotas por `petId`; nunca por nombre visible.

### Formato de exportación

El JSON exportado está pensado para leerse a mano, no para reimportarse a ciegas:

- `heroes` es un objeto indexado por nombre visible, sin `heroId`.
- Los vínculos entre héroes se exportan como `linkedHero` (nombre visible).
- Las posiciones de equipo se exportan como `hero` (nombre visible).
- `pets` es un objeto indexado por nombre de mascota, sin `petId`.
- La mascota asignada a un equipo se exporta como `pet` (nombre).
- No aparece ningún ID de héroe ni de mascota en el JSON.

Al importar se aceptan ambos formatos: primero se prueba el de copias antiguas indexado por ID y, si no encaja, el legible, que resuelve nombres a IDs y falla con un error si el nombre no existe. Las copias anteriores a las mascotas no traen `pets` ni `pet` en los equipos; ambas cosas son opcionales.

### Añadir un campo persistido

Si tocas `HeroProgress`, `PetProgress` o `Profile`, actualiza los cuatro puntos siguientes o el campo se perderá al importar:

1. `src/types/index.ts`.
2. El valor por defecto en `src/features/persistence/defaults.ts`.
3. El esquema Zod correspondiente en `src/features/persistence/exportSchema.ts` (los imports funcionan en modo _strip_, así que lo que no esté en el esquema se descarta en silencio).
4. Las pruebas de ida y vuelta.

Para campos opcionales heredados usa `z.boolean().optional()` y similares, no `.default(...)`, para no reescribir copias antiguas.

## Sincronización con PocketBase (opcional)

La app sigue siendo offline-first: `localStorage` es la fuente de verdad y todo funciona igual si no configuras nada. Si compilas con `VITE_API_URL`, aparece un panel **Cuenta y sincronización** en Ajustes para iniciar sesión contra tu PocketBase y guardar un documento JSON por usuario.

### Activar la sincronización

La URL se incrusta en tiempo de compilación; una variable de entorno en tiempo de ejecución no basta.

```bash
# Desarrollo
cp .env.example .env.local
# edita .env.local con VITE_API_URL=http://api.reximon.lab
npm run dev
```

```bash
# Docker (el compose ya acepta la variable)
VITE_API_URL=http://api.reximon.lab docker compose up --build -d
```

Si `VITE_API_URL` está vacía o sin definir, no se monta nada de la capa de sync: ni login, ni indicador, ni peticiones de red.

### Servicio de PocketBase

Añade este servicio al compose de tu homelab (por ejemplo `~/infra`):

```yaml
services:
  pocketbase:
    image: ghcr.io/muchobien/pocketbase:0.42.3
    container_name: pocketbase
    restart: unless-stopped
    command: serve --http=0.0.0.0:8090 --dir=/pb_data --migrationsDir=/pb_migrations
    ports:
      - '8090:8090'
    volumes:
      - ./pocketbase/pb_data:/pb_data
      - ./pocketbase/pb_migrations:/pb_migrations
```

Copia `pb_migrations/` del repositorio a `~/infra/pocketbase/pb_migrations/` antes de arrancar el contenedor. En Nginx Proxy Manager crea un proxy host `api.reximon.lab` → `http://pocketbase:8090` (o `http://<ip-del-host>:8090`), sin SSL en la red local. PocketBase permite cualquier origen por defecto; si lo restringes, añade `http://afk.reximon.lab` en **Settings → Application → Allowed origins**.

### Crear el primer usuario

1. Abre el panel de administración en `http://api.reximon.lab/_/` y crea el superusuario inicial, o ejecuta `docker exec -it pocketbase /pocketbase superuser create tu@correo 'contraseña'`.
2. En **Collections → users → New record**, crea la cuenta con correo y contraseña.
3. La migración desactiva el registro público (`createRule = null`): desde la app solo se puede iniciar sesión, no registrarse.

### Colección `roster_data`

La migración `pb_migrations/1795651200_created_roster_data.js` crea un registro por usuario:

| Campo             | Tipo     | Notas                          |
| ----------------- | -------- | ------------------------------ |
| `user`            | relation | Obligatorio, único, a `users`. |
| `data`            | json     | Documento exportable completo. |
| `schemaVersion`   | number   | Versión del esquema (1).       |
| `clientUpdatedAt` | date     | Fecha del último cambio local. |

Reglas: cada usuario solo puede listar, ver, crear y actualizar su propio registro (`user = @request.auth.id`); borrar queda reservado al administrador.

### Cómo funciona

- Cada cambio se escribe primero en `localStorage` y marca `dirty` con `localUpdatedAt`.
- Con sesión, un ciclo con debounce de 2 s lee la versión del servidor y decide subir, bajar o abrir un conflicto.
- El ciclo se repite al arrancar, al iniciar sesión y al recuperar la conexión o la pestaña (`online` / `visibilitychange`).
- Si la subida o la bajada falla por red, se reintenta con backoff exponencial (2 s → 60 s); los datos siguen en local.
- El documento remoto se valida con el mismo esquema Zod que el import. Si no valida o su `schemaVersion` es mayor que el de la app, no se aplica y se avisa; las versiones menores se migran.
- `lastSyncedAt` y `lastSyncedServerVersion` detectan cambios en ambos lados. Si ambos cambiaron, se abre un diálogo con tres salidas: conservar local, usar la copia del servidor o descargar la del servidor. Nunca se sobrescribe en silencio.
- Cerrar sesión no borra nada; si hay cambios sin subir, se pide confirmación.
- El export/import manual de Ajustes sigue intacto.

El indicador del encabezado muestra cinco estados: solo local, sincronizando, sincronizado, sin conexión (cambios pendientes) y error.

## Idiomas

- `src/i18n/locales/en.ts` es la fuente de verdad y exporta `TranslationSchema`.
- `es.ts` debe satisfacer ese esquema y `locales.test.ts` comprueba que haya paridad de claves y que ninguna traducción esté vacía.
- Los términos del juego (nombres de ascensión, SI, furniture, engraving, equipo…) se mantienen en inglés también en español.

## Calidad y pruebas

Antes de dar por terminado un cambio:

```bash
npm run typecheck
npm run lint
npm run test
```

Las pruebas están junto al código (`*.test.ts(x)`) y usan Vitest con Testing Library sobre jsdom. Se prefieren consultas accesibles (`getByRole`, `getByLabelText`) y, en las pruebas del store, se reinicia el estado persistido entre casos. Los cambios de interfaz conviene comprobarlos también en el navegador contra el servidor de desarrollo.

## Despliegue

### GitHub Pages

El sitio publicado está en <https://reximon.github.io/afkarena-app/>. El flujo de trabajo `.github/workflows/deploy.yml` se ejecuta en cada push a `master`: comprueba tipos, pasa el lint, lanza las pruebas, construye la app y publica `dist` como artefacto de Pages.

La primera vez hay que activar Pages en **Settings → Pages** eligiendo **GitHub Actions** como origen; después todo es automático. El flujo de trabajo toma la ruta base de Vite a partir del nombre del repositorio, así que no hay rutas que ajustar al publicar.

Las rutas usan `HashRouter`, de modo que cualquier alojamiento estático funciona sin reescrituras en el servidor.

### Docker

```bash
docker compose up --build
```

La app queda en <http://localhost:8080>. La imagen compila los estáticos y los sirve con nginx. Si la alojas bajo un subdirectorio, pasa `VITE_BASE_PATH` como argumento de compilación (`docker build --build-arg VITE_BASE_PATH=/mi-subpath/ .`); el `docker-compose.yml` lo deja en `/` por defecto. Para activar la sincronización, pasa también `VITE_API_URL` (ver [Sincronización con PocketBase](#sincronización-con-pocketbase-opcional)); sin ella el contenedor sirve la app en modo 100 % local.

El despliegue a GitHub Pages deja `VITE_API_URL` vacía, así que el sitio público funciona sin cuentas ni backend.

## Documentación adicional

- [DESIGN.md](DESIGN.md): lenguaje visual, tipografía, superficies y especificación de cabecera y navegación.
- [AGENTS.md](AGENTS.md): guía de convenciones del proyecto (estado, persistencia, i18n, formato de exportación y pruebas) pensada para quien —o lo que— vaya a tocar el código.

## Aviso legal

Proyecto hecho por aficionados. No está afiliado a Lilith Games ni cuenta con su respaldo. AFK Arena y sus recursos gráficos pertenecen a sus respectivos propietarios.
